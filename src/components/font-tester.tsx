/**
 * Font Tester Component
 *
 * Y2Kスタイルフォントの比較用タブUI
 */

'use client'

import { useState } from 'react'

// Y2K風フォント5種類
const Y2K_FONTS = [
  {
    id: 'space-mono',
    name: 'Space Mono',
    className: 'font-mono',
    description: 'モノスペース・レトロフューチャー',
  },
  {
    id: 'press-start-2p',
    name: 'Press Start 2P',
    className: 'font-pixel',
    description: 'ピクセル・ゲーム風',
  },
  {
    id: ' VT323',
    name: 'VT323',
    className: 'font-vt323',
    description: 'レトロ端末・ドットマトリクス',
  },
  {
    id: 'orbitron',
    name: 'Orbitron',
    className: 'font-orbitron',
    description: 'SF・未来的ディスプレイ',
  },
  {
    id: 'righteous',
    name: 'Righteous',
    className: 'font-righteous',
    description: '太字・ rounded groovy',
  },
]

export function FontTester() {
  const [selectedFont, setSelectedFont] = useState(Y2K_FONTS[0])

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 bg-white border-2 border-black shadow-[4px_4px_0_0_#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black bg-accent">
        <h3 className="font-bold text-sm">Y2K Font Tester</h3>
        <button
          type="button"
          onClick={() => {
            const tester = document.getElementById('font-tester-content')
            if (tester) {
              tester.classList.toggle('hidden')
            }
          }}
          className="text-sm hover:underline"
          aria-label="Toggle font tester"
        >
          −
        </button>
      </div>

      {/* Content */}
      <div id="font-tester-content" className="max-h-96 overflow-y-auto">
        {/* Tabs */}
        <div className="flex flex-col border-b-2 border-black">
          {Y2K_FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => setSelectedFont(font)}
              className={`px-4 py-2 text-left text-sm border-b border-black last:border-b-0 transition-colors ${
                selectedFont.id === font.id
                  ? 'bg-secondary font-bold'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{font.name}</div>
              <div className="text-xs text-gray-600">{font.description}</div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="p-4 border-b-2 border-black">
          <div className="text-xs text-gray-500 mb-2">Preview:</div>
          <p className={`text-lg ${selectedFont.className}`}>
            AI-Driven Editing Experience
          </p>
          <p className={`text-sm mt-2 ${selectedFont.className}`}>
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
          <p className={`text-xs mt-2 text-gray-600 ${selectedFont.className}`}>
            あいうえお ABCDE abcde
          </p>
        </div>

        {/* Apply Button */}
        <div className="p-2">
          <button
            type="button"
            className="w-full px-3 py-2 text-sm font-semibold border-2 border-black bg-white hover:bg-gray-100 transition-colors"
            onClick={() => {
              // フォントをbodyに適用
              document.body.classList.remove(
                'font-mono',
                'font-pixel',
                'font-vt323',
                'font-orbitron',
                'font-righteous'
              )
              document.body.classList.add(selectedFont.className)
            }}
          >
            Apply to Page
          </button>
        </div>
      </div>
    </div>
  )
}
