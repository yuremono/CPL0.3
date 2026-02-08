/**
 * useElementId Hook
 *
 * SSR/CSR互換の決定論的な要素ID生成フック。
 * 同じプレフィックスに対して常に同じIDを返します。
 */

import { useMemo } from 'react'
import { generateId } from '@/lib/content-projection/GenerateId'

/**
 * 要素IDを生成するフック
 * @param prefix IDのプレフィックス
 * @returns 生成されたID文字列
 *
 * メモ化により、同じプレフィックスに対しては常に同じIDを返します。
 */
export function useElementId(prefix: string): string {
  return useMemo(() => generateId(prefix), [prefix])
}
