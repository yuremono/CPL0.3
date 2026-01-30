/**
 * AI Edit API Endpoint
 * コンテンツ編集リクエストを処理するAPIルート
 */

import { NextRequest, NextResponse } from 'next/server'
import { createProvider } from '@/lib/ai'
import type { AIEditRequest, AIEditResponse } from '@/lib/content-projection/types'
import {
  AIProviderError,
  UserInputError,
  getStatusCode,
  isRetryableError,
} from '@/lib/ai/errors'

// リクエストボディの型
interface EditRequest {
  provider?: string
  selectedElement: {
    id: string
    role: string
    content: string
    label?: string
    level?: number
    editable: boolean
    context?: {
      section?: string
      position?: string
    }
  }
  userIntent: string
  pageContext?: {
    pageType?: string
    targetAudience?: string
    tone?: string
  }
}

// エラーレスポンスの型
interface ErrorResponse {
  success: false
  error: string
  code: string
  details?: string
  retryable?: boolean
}

// 成功レスポンスの型
interface SuccessResponse {
  success: true
  data: AIEditResponse
}

/**
 * POST /api/ai/edit
 * AIによるコンテンツ編集を実行する
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディのパース
    const body: EditRequest = await request.json()

    // デバッグ用: リクエスト内容をログに出力
    console.log('[AI Edit API] Received request:', {
      provider: body.provider,
      selectedElementId: body.selectedElement?.id,
      selectedElementRole: body.selectedElement?.role,
      selectedElementContent: body.selectedElement?.content?.substring(0, 100),
      userIntent: body.userIntent?.substring(0, 100),
    })

    // バリデーション
    if (!body.selectedElement) {
      throw new UserInputError('selectedElement is required')
    }

    if (!body.userIntent) {
      throw new UserInputError('userIntent is required')
    }

    // 選択要素の追加バリデーション
    if (!body.selectedElement.id) {
      throw new UserInputError('selectedElement.id is required')
    }
    if (!body.selectedElement.content) {
      throw new UserInputError('selectedElement.content is required')
    }

    // プロバイダーの作成
    const provider = createProvider(body.provider)

    if (!provider) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'AI provider is not available',
          code: 'PROVIDER_NOT_AVAILABLE',
          details: `Check if API key for ${body.provider || 'default provider'} is configured`,
          retryable: false,
        },
        { status: 503 }
      )
    }

    // 編集リクエストの構築
    const editRequest: AIEditRequest = {
      selectedElement: {
        id: body.selectedElement.id,
        role: body.selectedElement.role,
        content: body.selectedElement.content,
        label: body.selectedElement.label,
        level: body.selectedElement.level,
        editable: body.selectedElement.editable,
        context: body.selectedElement.context
      },
      userIntent: body.userIntent,
      pageContext: body.pageContext
    }

    // AIによる編集の実行
    const response = await provider.editContent(editRequest)

    // 成功レスポンスの返却
    return NextResponse.json<SuccessResponse>(
      {
        success: true,
        data: response
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('AI Edit API error:', error)

    // 詳細なエラー情報をログに出力
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    // AIProviderError の場合、適切なステータスコードを返す
    if (error instanceof AIProviderError) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.message,
          retryable: error.retryable,
        },
        { status: error.statusCode }
      )
    }

    // その他のエラー
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: 'Failed to process edit request',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
        retryable: false,
      },
      { status: 500 }
    )
  }
}
