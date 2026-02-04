/**
 * File Change List Component Tests
 *
 * TDD: テストファーストで実装
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileChangeList } from '../file-change-list'
import type { FileChange } from '../types'

describe('FileChangeList', () => {
  describe('変更がない場合', () => {
    it('空の状態を表示する', () => {
      const { container } = render(<FileChangeList changes={[]} />)
      expect(screen.getByText('変更されたファイルはありません')).toBeInTheDocument()
    })
  })

  describe('変更がある場合', () => {
    const mockChanges: FileChange[] = [
      {
        path: 'src/components/test.tsx',
        type: 'modified',
        oldContent: 'old content',
        newContent: 'new content',
      },
      {
        path: 'src/pages/new.tsx',
        type: 'created',
        newContent: 'new file content',
      },
      {
        path: 'src/pages/deleted.tsx',
        type: 'deleted',
        oldContent: 'deleted content',
      },
    ]

    it('変更ファイルの一覧を表示する', () => {
      render(<FileChangeList changes={mockChanges} />)

      expect(screen.getByText('src/components/test.tsx')).toBeInTheDocument()
      expect(screen.getByText('src/pages/new.tsx')).toBeInTheDocument()
      expect(screen.getByText('src/pages/deleted.tsx')).toBeInTheDocument()
    })

    it('変更タイプのバッジを表示する', () => {
      render(<FileChangeList changes={mockChanges} />)

      expect(screen.getByText('変更')).toBeInTheDocument()
      expect(screen.getByText('新規')).toBeInTheDocument()
      expect(screen.getByText('削除')).toBeInTheDocument()
    })

    it('画像ファイルを表示する', () => {
      const imageChange: FileChange[] = [
        {
          path: 'public/images/test.png',
          type: 'modified',
          oldContent: 'old.png',
          newContent: 'new.png',
          isImage: true,
        },
      ]

      const { container } = render(<FileChangeList changes={imageChange} />)

      const imageIcon = container.querySelector('[aria-label="画像ファイル"]')
      expect(imageIcon).toBeInTheDocument()
    })
  })

  describe('差分表示のインタラクション', () => {
    const mockChange: FileChange[] = [
      {
        path: 'src/components/test.tsx',
        type: 'modified',
        oldContent: 'old content',
        newContent: 'new content',
      },
    ]

    it('初期状態では差分が非表示', () => {
      render(<FileChangeList changes={mockChange} />)

      expect(screen.queryByText('変更前')).not.toBeInTheDocument()
      expect(screen.queryByText('変更後')).not.toBeInTheDocument()
    })

    it('クリックで差分を展開できる', () => {
      render(<FileChangeList changes={mockChange} />)

      const button = screen.getByText('src/components/test.tsx').closest('button')
      expect(button).toBeInTheDocument()

      if (button) {
        fireEvent.click(button)

        expect(screen.getByText('変更前')).toBeInTheDocument()
        expect(screen.getByText('変更後')).toBeInTheDocument()
        expect(screen.getByText('old content')).toBeInTheDocument()
        expect(screen.getByText('new content')).toBeInTheDocument()
      }
    })

    it('再度クリックで差分を折りたためる', () => {
      render(<FileChangeList changes={mockChange} />)

      const button = screen.getByText('src/components/test.tsx').closest('button')
      expect(button).toBeInTheDocument()

      if (button) {
        // 展開
        fireEvent.click(button)
        expect(screen.getByText('変更前')).toBeInTheDocument()

        // 折りたたみ
        fireEvent.click(button)
        expect(screen.queryByText('変更前')).not.toBeInTheDocument()
      }
    })
  })

  describe('境界ケース', () => {
    it('oldContentのみの場合（削除）', () => {
      const deleteChange: FileChange[] = [
        {
          path: 'src/deleted.tsx',
          type: 'deleted',
          oldContent: 'deleted content',
        },
      ]

      render(<FileChangeList changes={deleteChange} />)

      const button = screen.getByText('src/deleted.tsx').closest('button')
      if (button) fireEvent.click(button)

      expect(screen.getByText('変更前')).toBeInTheDocument()
      expect(screen.getByText('deleted content')).toBeInTheDocument()
    })

    it('newContentのみの場合（新規）', () => {
      const createChange: FileChange[] = [
        {
          path: 'src/new.tsx',
          type: 'created',
          newContent: 'new content',
        },
      ]

      render(<FileChangeList changes={createChange} />)

      const button = screen.getByText('src/new.tsx').closest('button')
      if (button) fireEvent.click(button)

      expect(screen.getByText('変更後')).toBeInTheDocument()
      expect(screen.getByText('new content')).toBeInTheDocument()
    })

    it('空のコンテンツの場合', () => {
      const emptyChange: FileChange[] = [
        {
          path: 'src/empty.tsx',
          type: 'modified',
          oldContent: '',
          newContent: '',
        },
      ]

      render(<FileChangeList changes={emptyChange} />)

      const button = screen.getByText('src/empty.tsx').closest('button')
      if (button) fireEvent.click(button)

      expect(screen.getAllByText('(空)')).toHaveLength(2)
    })
  })
})
