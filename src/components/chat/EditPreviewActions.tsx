/**
 * Edit Preview Actions Component
 *
 * プレビュー確定用のOK/NGボタンコンポーネント。
 */

import { Button } from '@/components/ui/button'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface EditPreviewActionsProps {
  onApprove: () => void
  onReject: () => void
  disabled?: boolean
  loading?: boolean
}

export function EditPreviewActions({
  onApprove,
  onReject,
  disabled = false,
  loading = false,
}: EditPreviewActionsProps) {
  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={onApprove}
        disabled={disabled || loading}
        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border-2 border-black bg-green-500 text-white hover:bg-green-600 shadow-[2px_2px_0_0_#0A0A0A] hover:shadow-[0_0_0_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-50 transition-all duration-150"
        aria-label="プレビューを確定"
        type="button"
      >
        <CheckIcon className="w-4 h-4 mr-1" />
        確定
      </button>
      <button
        onClick={onReject}
        disabled={disabled || loading}
        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border-2 border-black bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_0_#0A0A0A] hover:shadow-[0_0_0_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-50 transition-all duration-150"
        aria-label="プレビューをキャンセル"
        type="button"
      >
        <XMarkIcon className="w-4 h-4 mr-1" />
        キャンセル
      </button>
    </div>
  )
}
