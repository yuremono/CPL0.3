/**
 * Page Impact List Component Tests
 *
 * TDD: テストファーストで実装
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageImpactList } from '../page-impact-list'
import type { PageImpact } from '../types'

describe('PageImpactList', () => {
  describe('影響がない場合', () => {
    it('空の状態を表示する', () => {
      render(<PageImpactList impacts={[]} />)
      expect(screen.getByText('影響を受けるページはありません')).toBeInTheDocument()
    })
  })

  describe('影響がある場合', () => {
    const mockImpacts: PageImpact[] = [
      {
        path: '/',
        title: 'ホーム',
        affectedChanges: 3,
      },
      {
        path: '/about',
        title: '会社概要',
        affectedChanges: 1,
      },
    ]

    it('影響ページの一覧を表示する', () => {
      render(<PageImpactList impacts={mockImpacts} />)

      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('会社概要')).toBeInTheDocument()
    })

    it('変更数を表示する', () => {
      render(<PageImpactList impacts={mockImpacts} />)

      expect(screen.getByText('3件の変更')).toBeInTheDocument()
      expect(screen.getByText('1件の変更')).toBeInTheDocument()
    })

    it('パスを表示する', () => {
      render(<PageImpactList impacts={mockImpacts} />)

      expect(screen.getByText('/')).toBeInTheDocument()
      expect(screen.getByText('/about')).toBeInTheDocument()
    })
  })

  describe('注意メッセージ', () => {
    it('単数ページのメッセージを表示する', () => {
      const mockImpacts: PageImpact[] = [
        {
          path: '/',
          title: 'ホーム',
          affectedChanges: 1,
        },
      ]

      render(<PageImpactList impacts={mockImpacts} />)

      expect(screen.getByText(/このページのビルドが実行されます/)).toBeInTheDocument()
    })

    it('複数ページのメッセージを表示する', () => {
      const mockImpacts: PageImpact[] = [
        {
          path: '/',
          title: 'ホーム',
          affectedChanges: 1,
        },
        {
          path: '/about',
          title: '会社概要',
          affectedChanges: 1,
        },
      ]

      render(<PageImpactList impacts={mockImpacts} />)

      expect(screen.getByText(/これら2ページのビルドが実行されます/)).toBeInTheDocument()
    })
  })
})
