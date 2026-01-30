/**
 * ID Generation Utility
 *
 * SSR/CSR互換のため、決定論的なID生成を行います。
 * 同じprefixに対しては常に同じIDを生成します。
 */

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

// IDキャッシュ - 同じprefixに対して同じIDを返す
const idCache = new Map<string, string>()
let globalCounter = 0

/**
 * プレフィックスから決定論的なハッシュを生成
 * @param prefix IDのプレフィックス
 * @returns ハッシュ値
 */
function hashString(prefix: string): string {
  let hash = 0
  for (let i = 0; i < prefix.length; i++) {
    const char = prefix.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * 短い一意IDを生成する（決定論的）
 * @param prefix IDのプレフィックス（デフォルト: 'cpl_'）
 * @returns 一意なID文字列
 *
 * SSR/CSR互換のため、同じprefixに対しては常に同じIDを返します。
 */
export function generateId(prefix = 'cpl_'): string {
  // キャッシュにあればそれを返す
  if (idCache.has(prefix)) {
    return idCache.get(prefix)!
  }

  // 決定論的なIDを生成: prefix + ハッシュ + カウンター
  const hashPart = hashString(prefix).padStart(4, '0')
  globalCounter++
  const counterPart = globalCounter.toString(36).padStart(4, '0')

  const id = `${prefix}${hashPart}${counterPart}`

  // キャッシュに保存
  idCache.set(prefix, id)

  return id
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
