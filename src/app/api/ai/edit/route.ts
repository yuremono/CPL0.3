/**
 * AI Edit API Endpoint
 * コンテンツ編集リクエストを処理するAPIルート
 */

import { NextRequest, NextResponse } from 'next/server'
import { createProvider } from '@/lib/ai'
import type { AIEditRequest, AIEditResponse } from '@/lib/content-projection/types'

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
  details?: string
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

    // バリデーション
    if (!body.selectedElement) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'selectedElement is required'
        },
        { status: 400 }
      )
    }

    if (!body.userIntent) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'userIntent is required'
        },
        { status: 400 }
      )
    }

    // プロバイダーの作成
    const provider = createProvider(body.provider)

    if (!provider) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'AI provider is not available',
          details: `Check if API key for ${body.provider || 'default provider'} is configured`
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

    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: 'Failed to process edit request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
