/**
 * Auto Save Logic
 *
 * プレビューストアの変更を監視し、自動保存を行う。
 */

import type { PreviewState } from '@/stores/preview-store'
import { createIndexedDBStorage, STORAGE_KEYS } from './indexed-db'

/**
 * 自動保存のデバウンス時間（ミリ秒）
 */
const AUTO_SAVE_DEBOUNCE_MS = 1000

/**
 * デバウンス用のタイマーID管理
 */
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 保存済みの編集内容（変更検出用）
 */
let savedEdits: Record<string, string> = {}

/**
 * 自動保存をセットアップ
 *
 * プレビューストアの変更を監視し、編集内容が変更されたら
 * デバウンスしてIndexedDBに保存する。
 *
 * @param store - プレビューストア
 * @returns クリーンアップ関数
 */
export function setupAutoSave(store: {
  subscribe: (listener: (state: PreviewState) => void) => () => void
}): () => void {
  const storage = createIndexedDBStorage()

  // 初期状態を保存済みとして記録
  const initialState = {
    // Zustandのストアから現在の状態を取得
    // Note: 実際の使用時にはgetState()を経由して取得
  }

  const unsubscribe = store.subscribe((state) => {
    const currentEdits = state.edits

    // 変更がなければ何もしない
    if (isEqualEdits(currentEdits, savedEdits)) {
      return
    }

    // 保留中の保存をキャンセル
    if (autoSaveTimer !== null) {
      clearTimeout(autoSaveTimer)
    }

    // デバウンスして保存をスケジュール
    autoSaveTimer = setTimeout(async () => {
      try {
        await saveEdits(storage, currentEdits)
        savedEdits = { ...currentEdits }
      } catch (error) {
        console.error('自動保存に失敗しました:', error)
      }
    }, AUTO_SAVE_DEBOUNCE_MS)
  })

  // クリーンアップ関数
  return () => {
    if (autoSaveTimer !== null) {
      clearTimeout(autoSaveTimer)
    }
    unsubscribe()
  }
}

/**
 * 編集内容を保存
 */
async function saveEdits(
  storage: ReturnType<typeof createIndexedDBStorage>,
  edits: Record<string, string>
): Promise<void> {
  const data = JSON.stringify(edits)
  await storage.setItem(STORAGE_KEYS.AUTO_SAVE, data)
}

/**
 * 編集内容を読み込み
 */
export async function loadSavedEdits(): Promise<Record<string, string>> {
  const storage = createIndexedDBStorage()

  try {
    const data = await storage.getItem(STORAGE_KEYS.AUTO_SAVE)
    if (!data) {
      return {}
    }
    return JSON.parse(data) as Record<string, string>
  } catch (error) {
    console.error('保存された編集内容の読み込みに失敗しました:', error)
    return {}
  }
}

/**
 * 保存された編集内容をクリア
 */
export async function clearSavedEdits(): Promise<void> {
  const storage = createIndexedDBStorage()
  await storage.removeItem(STORAGE_KEYS.AUTO_SAVE)
  savedEdits = {}
}

/**
 * 編集内容が等しいかどうかを比較
 */
function isEqualEdits(
  edits1: Record<string, string>,
  edits2: Record<string, string>
): boolean {
  const keys1 = Object.keys(edits1).sort()
  const keys2 = Object.keys(edits2).sort()

  if (keys1.length !== keys2.length) {
    return false
  }

  return keys1.every((key) => edits1[key] === edits2[key])
}

/**
 * 手動保存をトリガー
 *
 * デバウンスを待たずに即座に保存する。
 * 例えば、AI編集完了時などに使用。
 */
export async function triggerAutoSave(
  store: { getState: () => { edits: Record<string, string> } }
): Promise<void> {
  // 保留中の保存をキャンセル
  if (autoSaveTimer !== null) {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = null
  }

  const storage = createIndexedDBStorage()
  const currentEdits = store.getState().edits

  try {
    await saveEdits(storage, currentEdits)
    savedEdits = { ...currentEdits }
  } catch (error) {
    console.error('手動保存に失敗しました:', error)
  }
}
