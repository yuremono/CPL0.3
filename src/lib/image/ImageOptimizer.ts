/**
 * Image Optimizer
 *
 * 画像のリサイズと圧縮を行うユーティリティ。
 * IndexedDBの容量制限に対応するため、アップロード時に最適化します。
 */

export interface ImageOptimizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'image/jpeg' | 'image/webp'
}

/**
 * 画像を最適化する
 * @param file 画像ファイル
 * @param options 最適化オプション
 * @returns 最適化された画像のBlob
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizeOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    format = 'image/webp',
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('画像の読み込みに失敗しました'))
    }

    img.onload = () => {
      // Canvasを作成してリサイズ
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvasの初期化に失敗しました'))
        return
      }

      // 新しいサイズを計算（アスペクト比を維持）
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }

      canvas.width = width
      canvas.height = height

      // 画像を描画
      ctx.drawImage(img, 0, 0, width, height)

      // Blobに変換
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('画像の変換に失敗しました'))
          }
        },
        format,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('画像の読み込みに失敗しました'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 最適化された画像のDataURLを取得
 * @param file 画像ファイル
 * @param options 最適化オプション
 * @returns DataURL
 */
export async function getOptimizedImageDataUrl(
  file: File,
  options?: ImageOptimizeOptions
): Promise<string> {
  const blob = await optimizeImage(file, options)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('DataURLの変換に失敗しました'))
    reader.readAsDataURL(blob)
  })
}

/**
 * ファイルサイズをフォーマット（MB/KB）
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * 画像ファイルかどうかを判定
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * サポートされている画像形式かどうかを判定
 */
export function isSupportedImageFormat(file: File): boolean {
  const supportedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
  ]
  return supportedTypes.some(type => file.type === type)
}
