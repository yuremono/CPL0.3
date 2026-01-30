/**
 * Retry Logic Utilities
 * 指数バックオフ付きのリトライロジックを実装
 */

import { isRetryableError } from './errors'

// リトライ設定の型
export interface RetryOptions {
  maxRetries?: number // 最大リトライ回数（デフォルト: 3）
  initialDelay?: number // 初期遅延（ミリ秒、デフォルト: 1000）
  maxDelay?: number // 最大遅延（ミリ秒、デフォルト: 10000）
  backoffMultiplier?: number // バックオフ乗数（デフォルト: 2）
  onRetry?: (attempt: number, error: unknown) => void // リトライ時のコールバック
}

// デフォルト設定
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  onRetry: () => {},
}

/**
 * 遅延を待機する関数
 * @param ms 待機時間（ミリ秒）
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 指数バックオフで遅延時間を計算する
 * @param attempt 試行回数（0始まり）
 * @param options リトライ設定
 */
function calculateDelay(attempt: number, options: Required<RetryOptions>): number {
  const exponentialDelay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt)

  // ジッター（ランダムな揺らぎ）を追加して、複数クライアントが同時にリトライしないようにする
  const jitter = exponentialDelay * 0.1 * Math.random()

  return Math.min(exponentialDelay + jitter, options.maxDelay)
}

/**
 * リトライロジックを適用して非同期関数を実行する
 * @param fn 実行する非同期関数
 * @param options リトライ設定
 * @returns 関数の実行結果
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options }

  let lastError: unknown

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // リトライ可能なエラーかチェック
      if (!isRetryableError(error)) {
        throw error
      }

      // 最大リトライ回数に達した場合は失敗
      if (attempt >= config.maxRetries) {
        console.error(`Max retries (${config.maxRetries}) reached`)
        throw error
      }

      // 遅延時間を計算
      const delayMs = calculateDelay(attempt, config)

      console.warn(
        `Retry attempt ${attempt + 1}/${config.maxRetries} after ${delayMs.toFixed(0)}ms. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )

      // コールバックを実行
      config.onRetry(attempt + 1, error)

      // 待機
      await delay(delayMs)
    }
  }

  // ここには到達しないはずだが、TypeScriptの型チェックのため
  throw lastError
}

/**
 * タイムアウト付きで非同期関数を実行する
 * @param fn 実行する非同期関数
 * @param timeoutMs タイムアウト時間（ミリ秒）
 * @returns 関数の実行結果
 */
export async function withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  return Promise.race([fn(), timeoutPromise])
}

/**
 * リトライとタイムアウトを組み合わせて実行する
 * @param fn 実行する非同期関数
 * @param retryOptions リトライ設定
 * @param timeoutMs タイムアウト時間（ミリ秒）
 * @returns 関数の実行結果
 */
export async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  retryOptions: RetryOptions = {},
  timeoutMs?: number
): Promise<T> {
  const wrappedFn = timeoutMs ? () => withTimeout(fn, timeoutMs) : fn

  return withRetry(wrappedFn, retryOptions)
}
