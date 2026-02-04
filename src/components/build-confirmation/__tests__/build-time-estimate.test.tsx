/**
 * Build Time Estimate Component Tests
 *
 * TDD: テストファーストで実装
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BuildTimeEstimate } from '../build-time-estimate'
import type { BuildTimeEstimate as BuildTimeEstimateType } from '../types'

describe('BuildTimeEstimate', () => {
  const baseEstimate: BuildTimeEstimateType = {
    estimatedSeconds: 45,
    confidence: 'high',
    factors: ['5件の変更'],
  }

  describe('基本表示', () => {
    it('予想所要時間を表示する', () => {
      render(<BuildTimeEstimate estimate={baseEstimate} />)

      expect(screen.getByText('45秒')).toBeInTheDocument()
      expect(screen.getByText('予想所要時間')).toBeInTheDocument()
    })

    it('信頼度バッジを表示する', () => {
      render(<BuildTimeEstimate estimate={baseEstimate} />)

      expect(screen.getByText('信頼度: 高い')).toBeInTheDocument()
    })

    it('計算要素を表示する', () => {
      render(<BuildTimeEstimate estimate={baseEstimate} />)

      expect(screen.getByText('5件の変更')).toBeInTheDocument()
      expect(screen.getByText('計算要素')).toBeInTheDocument()
    })
  })

  describe('時間フォーマット', () => {
    it('秒のみを表示する', () => {
      const estimate: BuildTimeEstimateType = {
        estimatedSeconds: 30,
        confidence: 'medium',
        factors: ['3件の変更'],
      }

      render(<BuildTimeEstimate estimate={estimate} />)

      expect(screen.getByText('30秒')).toBeInTheDocument()
    })

    it('分と秒を表示する', () => {
      const estimate: BuildTimeEstimateType = {
        estimatedSeconds: 90,
        confidence: 'medium',
        factors: ['10件の変更'],
      }

      render(<BuildTimeEstimate estimate={estimate} />)

      expect(screen.getByText('1分30秒')).toBeInTheDocument()
    })
  })

  describe('信頼度', () => {
    it('高い信頼度を表示する', () => {
      const estimate: BuildTimeEstimateType = {
        estimatedSeconds: 30,
        confidence: 'high',
        factors: ['3件の変更'],
      }

      render(<BuildTimeEstimate estimate={estimate} />)

      expect(screen.getByText('信頼度: 高い')).toBeInTheDocument()
    })

    it('中程度の信頼度を表示する', () => {
      const estimate: BuildTimeEstimateType = {
        estimatedSeconds: 60,
        confidence: 'medium',
        factors: ['10件の変更'],
      }

      render(<BuildTimeEstimate estimate={estimate} />)

      expect(screen.getByText('信頼度: 中')).toBeInTheDocument()
    })

    it('低い信頼度を表示する', () => {
      const estimate: BuildTimeEstimateType = {
        estimatedSeconds: 120,
        confidence: 'low',
        factors: ['25件の変更'],
      }

      render(<BuildTimeEstimate estimate={estimate} />)

      expect(screen.getByText('信頼度: 低い')).toBeInTheDocument()
    })
  })

  describe('情報表示', () => {
    it('ご注意メッセージを表示する', () => {
      render(<BuildTimeEstimate estimate={baseEstimate} />)

      expect(screen.getByText(/ご注意:/)).toBeInTheDocument()
      expect(screen.getByText(/これは予想所要時間です/)).toBeInTheDocument()
    })

    it('ISR/SSG情報を表示する', () => {
      render(<BuildTimeEstimate estimate={baseEstimate} />)

      expect(screen.getByText('ISR/SSG ビルドについて')).toBeInTheDocument()
      expect(
        screen.getByText(/Incremental Static Regeneration/),
      ).toBeInTheDocument()
    })
  })
})
