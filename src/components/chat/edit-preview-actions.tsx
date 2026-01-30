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
      <Button
        onClick={onApprove}
        disabled={disabled || loading}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
        aria-label="プレビューを確定"
      >
        <CheckIcon className="w-4 h-4 mr-1" />
        OK
      </Button>
      <Button
        onClick={onReject}
        disabled={disabled || loading}
        variant="outline"
        className="flex-1"
        aria-label="プレビューをキャンセル"
      >
        <XMarkIcon className="w-4 h-4 mr-1" />
        NG
      </Button>
    </div>
  )
}
