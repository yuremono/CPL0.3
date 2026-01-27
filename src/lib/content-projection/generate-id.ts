/**
 * ID Generation Utility
 */

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const ID_LENGTH = 12

let counter = 0
let timestamp = 0

/**
 * 短い一意IDを生成する（NanoID風）
 * @param prefix IDのプレフィックス（デフォルト: 'cpl_'）
 * @returns 一意なID文字列
 */
export function generateId(prefix = 'cpl_'): string {
  const now = Date.now()

  // タイムスタンプが変わったらカウンターをリセット
  if (now !== timestamp) {
    timestamp = now
    counter = 0
  }

  // カウンターをインクリメント（1ミリ秒に複数生成対応）
  counter++

  // タイムスタンプ + カウンター + ランダム文字
  const timePart = timestamp.toString(36)
  const counterPart = counter.toString(36).padStart(4, '0')
  const randomPart = Array.from({ length: 4 }, () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join('')

  return `${prefix}${timePart}${counterPart}${randomPart}`
}

/**
 * ブロック用IDを生成
 */
export function generateBlockId(): string {
  return generateId('blk_')
}

/**
 * セクション用IDを生成
 */
export function generateSectionId(): string {
  return generateId('sec_')
}
