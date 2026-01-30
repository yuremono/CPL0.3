/**
 * AI Provider Error Types
 * エラーハンドリングを強化するためのカスタムエラークラス
 */

// ベースエラークラス
export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly retryable: boolean = false
  ) {
    super(message)
    this.name = 'AIProviderError'
  }
}

// APIキー未設定エラー
export class APIKeyMissingError extends AIProviderError {
  constructor(providerName: string) {
    super(
      `${providerName} API key is not configured`,
      'API_KEY_MISSING',
      503,
      false
    )
    this.name = 'APIKeyMissingError'
  }
}

// ネットワークエラー
export class NetworkError extends AIProviderError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 503, true)
    this.name = 'NetworkError'
  }
}

// タイムアウトエラー
export class TimeoutError extends AIProviderError {
  constructor(message: string = 'Request timed out') {
    super(message, 'TIMEOUT_ERROR', 504, true)
    this.name = 'TimeoutError'
  }
}

// レート制限エラー
export class RateLimitError extends AIProviderError {
  constructor(retryAfter?: number) {
    super(
      retryAfter
        ? `Rate limit exceeded. Retry after ${retryAfter} seconds`
        : 'Rate limit exceeded',
      'RATE_LIMIT_ERROR',
      429,
      true
    )
    this.name = 'RateLimitError'
  }
}

// 無効なレスポンスエラー
export class InvalidResponseError extends AIProviderError {
  constructor(message: string) {
    super(message, 'INVALID_RESPONSE', 502, false)
    this.name = 'InvalidResponseError'
  }
}

// 認証エラー
export class AuthenticationError extends AIProviderError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401, false)
    this.name = 'AuthenticationError'
  }
}

// コンテンツポリシーエラー
export class ContentPolicyError extends AIProviderError {
  constructor(message: string = 'Content was rejected by the provider') {
    super(message, 'CONTENT_POLICY_ERROR', 451, false)
    this.name = 'ContentPolicyError'
  }
}

// ユーザー入力エラー
export class UserInputError extends AIProviderError {
  constructor(message: string) {
    super(message, 'USER_INPUT_ERROR', 400, false)
    this.name = 'UserInputError'
  }
}

// エラー判定ユーティリティ
export function isRetryableError(error: unknown): boolean {
  return error instanceof AIProviderError && error.retryable
}

export function getStatusCode(error: unknown): number {
  if (error instanceof AIProviderError) {
    return error.statusCode
  }
  return 500
}
