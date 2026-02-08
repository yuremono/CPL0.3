import { Metadata } from 'next'
import type { ReactNode } from 'react'

/**
 * Demoページのレイアウト
 * Content Projection Layerのデモページ用メタデータを設定します
 */

export const metadata: Metadata = {
  title: 'Demo - Content Projection Layer',
  description: 'Content Projection Layerの機能をデモします。AI主導の編集体験をお試しいただけます。',
}

export default function DemoLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
