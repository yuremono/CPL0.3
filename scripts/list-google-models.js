/**
 * 利用可能なGoogleモデルをリストアップするスクリプト
 */

require('dotenv').config({ path: '.env.local' })
const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

if (!apiKey) {
  console.error('NEXT_PUBLIC_GOOGLE_API_KEYが設定されていません')
  console.error('.env.localファイルを確認してください')
  process.exit(1)
}

const client = new GoogleGenerativeAI(apiKey)

async function listModels() {
  try {
    console.log('利用可能なモデルを確認中...')
    console.log('APIキー:', apiKey.substring(0, 10) + '...')

    // ListModelsメソッドを使って利用可能なモデルを確認
    // 注意: 公式SDKにはlistModelsメソッドがないため、直接APIを呼び出す
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`API呼び出し失敗: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    console.log('\n利用可能なモデル:')
    if (data.models && data.models.length > 0) {
      data.models.forEach((model) => {
        const supportedMethods = model.supportedGenerationMethods?.join(', ') || 'なし'
        console.log(`  - ${model.name} (${supportedMethods})`)
      })
    } else {
      console.log('  利用可能なモデルがありません')
    }
  } catch (error) {
    console.error('✗ エラーが発生しました:')
    console.error(error.message)

    if (error.message.includes('API key') || error.message.includes('403') || error.message.includes('401')) {
      console.error('\nAPIキーが無効な可能性があります')
      console.error('https://aistudio.google.com/app/apikey でAPIキーを取得してください')
    }
  }
}

listModels()
