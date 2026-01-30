/**
 * Retry Logic Tests
 * リトライロジックの動作を確認するテスト
 */

import { describe, it, expect, vi } from 'vitest'
import {
  withRetry,
  withTimeout,
  withRetryAndTimeout,
  type RetryOptions,
} from '../retry'
import { NetworkError, TimeoutError, UserInputError } from '../errors'

describe('Retry Logic', () => {
  describe('withRetry', () => {
    it('成功時はリトライしない', async () => {
      const mockFn = vi.fn().mockResolvedValue('success')

      const result = await withRetry(mockFn)

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('リトライ可能なエラーでリトライする', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new NetworkError('Network error'))
        .mockResolvedValue('success')

      const onRetry = vi.fn()

      const result = await withRetry(mockFn, { onRetry, initialDelay: 10 })

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('リトライ不可能なエラーで即座に失敗する', async () => {
      const mockFn = vi.fn().mockRejectedValue(new UserInputError('Invalid input'))

      await expect(withRetry(mockFn)).rejects.toThrow('Invalid input')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('最大リトライ回数を超えると失敗する', async () => {
      const mockFn = vi.fn().mockRejectedValue(new NetworkError('Network error'))

      const onRetry = vi.fn()

      try {
        await withRetry(mockFn, {
          maxRetries: 2,
          initialDelay: 10,
          onRetry,
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(NetworkError)
      }

      // 初回 + リトライ2回 = 3回
      expect(mockFn).toHaveBeenCalledTimes(3)
      expect(onRetry).toHaveBeenCalledTimes(2)
    })

    it('指数バックオフで遅延する', async () => {
      const delays: number[] = []
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new NetworkError('Error 1'))
        .mockRejectedValueOnce(new NetworkError('Error 2'))
        .mockResolvedValue('success')

      const startTime = Date.now()

      const onRetry = vi.fn((attempt) => {
        delays.push(Date.now() - startTime)
      })

      await withRetry(mockFn, {
        maxRetries: 3,
        initialDelay: 20,
        backoffMultiplier: 2,
        onRetry,
      })

      // バックオフが指数関数的になっていることを確認
      // 20ms -> 40ms（ジッターを含むのである程度の許容）
      expect(delays.length).toBeGreaterThan(0)

      // 相対的な遅延時間の増加を確認
      if (delays.length >= 2) {
        expect(delays[1]).toBeGreaterThan(delays[0] * 1.3) // 1.3倍以上（ジッター考慮）
      }
    })
  })

  describe('withTimeout', () => {
    it('タイムアウト前に成功した場合は結果を返す', async () => {
      const mockFn = vi.fn().mockResolvedValue('success')

      const result = await withTimeout(mockFn, 1000)

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('タイムアウトした場合はエラーをスローする', async () => {
      const mockFn = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 2000))
      )

      await expect(withTimeout(mockFn, 100)).rejects.toThrow('Operation timed out after 100ms')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('エラーが発生した場合は即座にエラーをスローする', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      await expect(withTimeout(mockFn, 1000)).rejects.toThrow('Test error')
    })
  })

  describe('withRetryAndTimeout', () => {
    it('リトライとタイムアウトを組み合わせる', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new TimeoutError('Timeout'))
        .mockResolvedValue('success')

      const result = await withRetryAndTimeout(
        mockFn,
        { maxRetries: 2, initialDelay: 10 },
        1000
      )

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('タイムアウト設定がない場合はリトライのみ', async () => {
      const mockFn = vi.fn().mockResolvedValue('success')

      const result = await withRetryAndTimeout(mockFn, { maxRetries: 2 })

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Retry Callback', () => {
    it('リトライ時にコールバックが呼ばれる', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new NetworkError('Error 1'))
        .mockRejectedValueOnce(new NetworkError('Error 2'))
        .mockResolvedValue('success')

      const onRetry = vi.fn()

      await withRetry(mockFn, {
        maxRetries: 3,
        initialDelay: 10,
        onRetry,
      })

      expect(onRetry).toHaveBeenCalledTimes(2)
      expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(NetworkError))
      expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(NetworkError))
    })

    it('コールバックでエラー情報を取得できる', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new NetworkError('Network error'))
        .mockResolvedValue('success')

      const errors: unknown[] = []
      const onRetry = vi.fn((attempt, error) => {
        errors.push(error)
      })

      await withRetry(mockFn, { onRetry, initialDelay: 10 })

      expect(errors).toHaveLength(1)
      expect(errors[0]).toBeInstanceOf(NetworkError)
      expect((errors[0] as NetworkError).message).toBe('Network error')
    })
  })
})
