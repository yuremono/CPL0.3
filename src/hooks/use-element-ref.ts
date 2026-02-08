/**
 * useElementRef Hook
 *
 * 短い参照ID（e1, e2, e3...）を生成するフック。
 * SSR/CSR互換の決定論的生成。
 */

import { useMemo } from 'react'

// グローバルカウンター
let refCounter = 0
const refCache = new Map<string, string>()

/**
 * 要素参照IDを生成するフック
 * @param id 一意なID（data-id）
 * @returns 短い参照ID（e1, e2, e3...）
 *
 * メモ化により、同じIDに対しては常に同じ参照IDを返します。
 */
export function useElementRef(id: string): string {
  return useMemo(() => {
    // キャッシュにあればそれを返す
    if (refCache.has(id)) {
      return refCache.get(id)!
    }

    // 新しい参照IDを生成
    refCounter++
    const ref = `e${refCounter}`

    // キャッシュに保存
    refCache.set(id, ref)

    return ref
  }, [id])
}

/**
 * セクション参照IDを生成するフック（s1, s2, s3...）
 */
let sectionRefCounter = 0
const sectionRefCache = new Map<string, string>()

export function useSectionRef(id: string): string {
  return useMemo(() => {
    if (sectionRefCache.has(id)) {
      return sectionRefCache.get(id)!
    }

    sectionRefCounter++
    const ref = `s${sectionRefCounter}`

    sectionRefCache.set(id, ref)

    return ref
  }, [id])
}
