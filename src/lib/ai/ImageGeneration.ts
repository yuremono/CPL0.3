/**
 * Image Generation Utility
 *
 * 無料の画像生成API（Pollinations.ai）と統合します。
 */

export interface ImageGenerationOptions {
  prompt: string
  width?: number
  height?: number
  model?: 'flux' | 'flux-realism' | 'flux-anime' | 'flux-3d' | 'turbo'
  seed?: string
}

/**
 * Pollinations.aiで画像を生成
 * @param options 画像生成オプション
 * @returns 画像URL
 */
export function generateImageUrl(options: ImageGenerationOptions): string {
  const {
    prompt,
    width = 1024,
    height = 1024,
    model = 'flux',
    seed = Math.random().toString(36).substring(7),
  } = options

  // Pollinations.aiのURL形式
  // https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&seed={seed}&model={model}
  const encodedPrompt = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`
}

/**
 * 画像生成プロンプトを検出
 * @param content AI応答のテキスト
 * @returns 画像生成プロンプトかどうか
 */
export function detectImageGenerationPrompt(content: string): { isImagePrompt: boolean; prompt?: string } {
  // 画像生成を示すキーワード
  const imageKeywords = [
    'イラスト', '画像', '絵', 'キャラクター', 'イラストレーション',
    'illustration', 'image', 'picture', 'art', 'drawing', 'character',
    '生成して', '描いて', '書いて', 'create', 'generate', 'draw',
    'のイラスト', 'の画像', 'の絵'
  ]

  const lowerContent = content.toLowerCase()

  // 画像生成キーワードが含まれるかチェック
  const hasImageKeyword = imageKeywords.some(keyword => lowerContent.includes(keyword))

  if (!hasImageKeyword) {
    return { isImagePrompt: false }
  }

  // プロンプトを抽出（シンプルに全体をプロンプトとして使用）
  return {
    isImagePrompt: true,
    prompt: content
      .replace(/^(イラスト|画像|絵|キャラクター|イラストレーション).+?(を|の)?/i, '') // 「XXXのイラスト」→「XXX」
      .replace(/^(illustration|image|picture|art|drawing|character).+?(of|for)?/i, '')
      .trim() || content
  }
}

/**
 * AI応答から画像URLを抽出または生成
 * @param content AI応答のテキスト
 * @returns 画像URLまたはnull
 */
export function extractOrGenerateImageUrl(content: string): string | null {
  // 既にURLが含まれているかチェック
  const urlMatch = content.match(/https?:\/\/[^\s<>"{}|\\^`\[\]]+\.(?:jpg|jpeg|png|gif|webp|bmp)/i)
  if (urlMatch) {
    return urlMatch[0]
  }

  // URLが含まれているか（拡張子なし）
  const plainUrlMatch = content.match(/https?:\/\/[^\s<>"{}|\\^`\[\]]+/i)
  if (plainUrlMatch) {
    return plainUrlMatch[0]
  }

  // 画像生成プロンプトを検出
  const { isImagePrompt, prompt } = detectImageGenerationPrompt(content)

  if (isImagePrompt && prompt) {
    return generateImageUrl({
      prompt: prompt,
      width: 1024,
      height: 1024,
      model: 'flux',
    })
  }

  return null
}
