'use client';

/**
 * Z.AI ポートフォリオサイト - 本番ページ
 *
 * 編集機能なしの純粋な表示ページ
 */

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Z.AI</h1>

          <nav className="flex gap-6" aria-label="Main navigation">
            <Link href="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Home</Link>
            <Link href="/demo" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Demo</Link>
            <a href="#about" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">About</a>
            <a href="#projects" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Projects</a>
            <a href="#contact" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="border-b-2 border-black py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-6xl font-bold mb-6">Creative Developer</h2>
              <p className="text-xl text-gray-600 mb-8">
                Building digital experiences with precision and purpose.
              </p>
              <div className="flex gap-4">
                <a href="#projects" className="px-6 py-3 border-2 border-black bg-accent text-white hover:bg-gray-800 transition-colors">
                  View Projects
                </a>
                <a href="#contact" className="px-6 py-3 border-2 border-black hover:bg-gray-100 transition-colors">
                  Contact
                </a>
              </div>
            </div>
            <div className="bg-gray-100 aspect-square rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-b-2 border-black py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">About</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            I am a creative developer specializing in building modern web applications
            with cutting-edge technologies. With expertise in Next.js, React, and TypeScript,
            I create seamless digital experiences that combine beautiful design with robust functionality.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="border-b-2 border-black py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-2 border-black p-6 hover:shadow-[4px_4px_0_0_#0A0A0A] transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Content Projection Layer</h3>
              <p className="text-gray-600 mb-4">AI-powered content editing system</p>
              <a href="/?mode=preview" className="text-accent hover:underline">View Demo →</a>
            </div>
            <div className="border-2 border-black p-6 hover:shadow-[4px_4px_0_0_#0A0A0A] transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Multi-Agent Shogun</h3>
              <p className="text-gray-600 mb-4">Claude-powered task management system</p>
              <a href="https://github.com/yuremono/multi-agent-shogun" className="text-accent hover:underline">View on GitHub →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-b-2 border-black py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Contact</h2>
          <p className="text-lg text-gray-700 mb-8">
            Interested in working together? Let's connect.
          </p>
          <a href="mailto:hello@z.ai" className="px-6 py-3 border-2 border-black bg-accent text-white hover:bg-gray-800 transition-colors">
            Get in Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600">
        <p>© 2026 Z.AI. All rights reserved.</p>
      </footer>
    </div>
  )
}
