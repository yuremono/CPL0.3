/**
 * useAutoSave Hook
 *
 * 自動保存をセットアップするカスタムフック。
 */

import { useEffect, useRef } from 'react'
import { usePreviewStore } from '@/stores/preview-store'
import { setupAutoSave, triggerAutoSave } from '@/lib/storage/auto-save'

/**
 * 自動保存をセットアップするフック
 *
 * コンポーネントがマウントされると自動保存の監視を開始し、
 * アンマウント時にクリーンアップを行う。
 */
export function useAutoSave(): void {
  const storeRef = useRef(usePreviewStore)

  useEffect(() => {
    // 自動保存をセットアップ
    const cleanup = setupAutoSave({
      subscribe: (listener) => usePreviewStore.subscribe(listener),
    })

    // クリーンアップ
    return cleanup
  }, [])
}

/**
 * 手動保存をトリガーする関数を取得するフック
 *
 * 即座に保存を実行したい場合に使用する。
 * 例: AI編集完了時、ページ離脱前など。
 */
export function useManualSave(): () => Promise<void> {
  return () => triggerAutoSave(usePreviewStore)
}

/**
 * 編集内容が保存されているかどうかを判定するフック
 *
 * @returns 保存が必要かどうか
 */
export function useHasUnsavedChanges(): boolean {
  const edits = usePreviewStore((state) => state.edits)

  // 編集内容が1つ以上ある場合は未保存とみなす
  return Object.keys(edits).length > 0
}

/**
 * 保存前の確認を行うフック
 *
 * ページ離脱前に未保存の変更がある場合に警告を表示する。
 */
export function useBeforeUnload(): void {
  const hasUnsavedChanges = useHasUnsavedChanges()

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // ブラウザのデフォルトの確認ダイアログを表示
        event.preventDefault()
        // ChromeではreturnValueを設定する必要がある
        event.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])
}
