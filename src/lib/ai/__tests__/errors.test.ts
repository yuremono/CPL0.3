/**
 * Error Handling Tests
 * エラーハンドリングの動作を確認するテスト
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createProvider } from '../index'
import {
  AIProviderError,
  APIKeyMissingError,
  NetworkError,
  TimeoutError,
  RateLimitError,
  InvalidResponseError,
  AuthenticationError,
  ContentPolicyError,
  UserInputError,
  isRetryableError,
  getStatusCode,
} from '../errors'

describe('Error Classes', () => {
  describe('AIProviderError', () => {
    it('should create base error with correct properties', () => {
      const error = new AIProviderError('Test error', 'TEST_ERROR', 500, true)

      expect(error.message).toBe('Test error')
      expect(error.code).toBe('TEST_ERROR')
      expect(error.statusCode).toBe(500)
      expect(error.retryable).toBe(true)
      expect(error.name).toBe('AIProviderError')
    })

    it('should have default values', () => {
      const error = new AIProviderError('Test error', 'TEST_ERROR')

      expect(error.statusCode).toBe(500)
      expect(error.retryable).toBe(false)
    })
  })

  describe('APIKeyMissingError', () => {
    it('should create error with correct properties', () => {
      const error = new APIKeyMissingError('Google')

      expect(error.message).toBe('Google API key is not configured')
      expect(error.code).toBe('API_KEY_MISSING')
      expect(error.statusCode).toBe(503)
      expect(error.retryable).toBe(false)
    })
  })

  describe('NetworkError', () => {
    it('should create error with correct properties', () => {
      const error = new NetworkError('Connection failed')

      expect(error.message).toBe('Connection failed')
      expect(error.code).toBe('NETWORK_ERROR')
      expect(error.statusCode).toBe(503)
      expect(error.retryable).toBe(true)
    })
  })

  describe('TimeoutError', () => {
    it('should create error with default message', () => {
      const error = new TimeoutError()

      expect(error.message).toBe('Request timed out')
      expect(error.code).toBe('TIMEOUT_ERROR')
      expect(error.statusCode).toBe(504)
      expect(error.retryable).toBe(true)
    })

    it('should create error with custom message', () => {
      const error = new TimeoutError('Custom timeout message')

      expect(error.message).toBe('Custom timeout message')
    })
  })

  describe('RateLimitError', () => {
    it('should create error without retryAfter', () => {
      const error = new RateLimitError()

      expect(error.message).toBe('Rate limit exceeded')
      expect(error.code).toBe('RATE_LIMIT_ERROR')
      expect(error.statusCode).toBe(429)
      expect(error.retryable).toBe(true)
    })

    it('should create error with retryAfter', () => {
      const error = new RateLimitError(60)

      expect(error.message).toBe('Rate limit exceeded. Retry after 60 seconds')
    })
  })

  describe('InvalidResponseError', () => {
    it('should create error with correct properties', () => {
      const error = new InvalidResponseError('Invalid JSON')

      expect(error.message).toBe('Invalid JSON')
      expect(error.code).toBe('INVALID_RESPONSE')
      expect(error.statusCode).toBe(502)
      expect(error.retryable).toBe(false)
    })
  })

  describe('AuthenticationError', () => {
    it('should create error with default message', () => {
      const error = new AuthenticationError()

      expect(error.message).toBe('Authentication failed')
      expect(error.code).toBe('AUTHENTICATION_ERROR')
      expect(error.statusCode).toBe(401)
      expect(error.retryable).toBe(false)
    })

    it('should create error with custom message', () => {
      const error = new AuthenticationError('Invalid API key')

      expect(error.message).toBe('Invalid API key')
    })
  })

  describe('ContentPolicyError', () => {
    it('should create error with default message', () => {
      const error = new ContentPolicyError()

      expect(error.message).toBe('Content was rejected by the provider')
      expect(error.code).toBe('CONTENT_POLICY_ERROR')
      expect(error.statusCode).toBe(451)
      expect(error.retryable).toBe(false)
    })

    it('should create error with custom message', () => {
      const error = new ContentPolicyError('Safety filter triggered')

      expect(error.message).toBe('Safety filter triggered')
    })
  })

  describe('UserInputError', () => {
    it('should create error with correct properties', () => {
      const error = new UserInputError('Invalid input')

      expect(error.message).toBe('Invalid input')
      expect(error.code).toBe('USER_INPUT_ERROR')
      expect(error.statusCode).toBe(400)
      expect(error.retryable).toBe(false)
    })
  })
})

describe('Error Utilities', () => {
  describe('isRetryableError', () => {
    it('should return true for retryable errors', () => {
      const retryableErrors = [
        new NetworkError('test'),
        new TimeoutError('test'),
        new RateLimitError(),
      ]

      retryableErrors.forEach((error) => {
        expect(isRetryableError(error)).toBe(true)
      })
    })

    it('should return false for non-retryable errors', () => {
      const nonRetryableErrors = [
        new APIKeyMissingError('Test'),
        new InvalidResponseError('test'),
        new AuthenticationError('test'),
        new UserInputError('test'),
      ]

      nonRetryableErrors.forEach((error) => {
        expect(isRetryableError(error)).toBe(false)
      })
    })

    it('should return false for non-AIProviderError', () => {
      expect(isRetryableError(new Error('test'))).toBe(false)
      expect(isRetryableError(null)).toBe(false)
      expect(isRetryableError(undefined)).toBe(false)
    })
  })

  describe('getStatusCode', () => {
    it('should return correct status code for AIProviderError', () => {
      const errors = [
        new APIKeyMissingError('Test'),
        new NetworkError('test'),
        new TimeoutError('test'),
        new RateLimitError(),
        new InvalidResponseError('test'),
        new AuthenticationError('test'),
        new ContentPolicyError('test'),
        new UserInputError('test'),
      ]

      const expectedCodes = [503, 503, 504, 429, 502, 401, 451, 400]

      errors.forEach((error, index) => {
        expect(getStatusCode(error)).toBe(expectedCodes[index])
      })
    })

    it('should return 500 for non-AIProviderError', () => {
      expect(getStatusCode(new Error('test'))).toBe(500)
      expect(getStatusCode(null)).toBe(500)
      expect(getStatusCode(undefined)).toBe(500)
    })
  })
})

describe('Provider Error Handling', () => {
  it('GoogleプロバイダーがAPIキーなしでエラーをスローする', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_API_KEY', '')

    const provider = createProvider('google')

    expect(provider).toBeNull()
  })

  it('ZAIプロバイダーがAPIキーなしでエラーをスローする', () => {
    vi.stubEnv('NEXT_PUBLIC_ZAI_API_KEY', '')

    const provider = createProvider('zai')

    expect(provider).toBeNull()
  })
})
