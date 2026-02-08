'use client';

/**
 * Z.AI ポートフォリオサイト - 本番ページ
 *
 * Content Projection Layer 統合版
 * ?mode=preview クエリパラメータでプレビューモードが有効になります。
 */

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PreviewProvider } from '@/components/content-projection-layer'
import { EditableWrapper, EditableImageWrapper } from '@/components/content-projection-layer'
import { generateId } from '@/lib/content-projection/generate-id'
import { usePreviewStore } from '@/stores/preview-store'
import { useEditHistoryStore } from '@/stores/edit-history-store'
import { useAutoSave } from '@/hooks/use-auto-save'
import { useSectionRef } from '@/hooks/use-element-ref'
import {
  ChatSidebar,
  ChatApp,
  PreviewModeToggle,
  useChatStore,
} from '@/components/chat'

function HomeContent() {
  const router = useRouter()

  // 状態管理統合: モード・選択機能
  const mode = usePreviewStore((state) => state.mode)
  const isPreviewMode = mode === 'preview'
  const isEditMode = mode === 'edit'
  const selectElement = usePreviewStore((state) => state.selectElement)
  const selectedElement = usePreviewStore((state) => state.selectedElement)
  const updateContent = usePreviewStore((state) => state.updateContent)
  const setMode = usePreviewStore((state) => state.setMode)
  const edits = usePreviewStore((state) => state.edits)

  // 編集履歴統合
  const addOperation = useEditHistoryStore((state) => state.addOperation)

  // 自動保存統合
  useAutoSave()

  // チャットストア初期化
  const setIsChatOpen = useChatStore((state) => state.setOpen)

  // モード変更時の副作用
  useEffect(() => {
    // 編集モード時はチャットUIを開く
    if (isEditMode) {
      setIsChatOpen(true)
    }
  }, [isEditMode, setIsChatOpen])

  const handleSelectElement = (element: Parameters<typeof selectElement>[0]) => {
    selectElement(element)
  }

  // セクションIDと参照IDを生成
  const heroSectionId = generateId('hero-section')
  const heroSectionRef = useSectionRef(heroSectionId)
  const aboutSectionId = generateId('about-section')
  const aboutSectionRef = useSectionRef(aboutSectionId)
  const featuresSectionId = generateId('features-section')
  const featuresSectionRef = useSectionRef(featuresSectionId)
  const projectsSectionId = generateId('projects-section')
  const projectsSectionRef = useSectionRef(projectsSectionId)
  const contactSectionId = generateId('contact-section')
  const contactSectionRef = useSectionRef(contactSectionId)

  return (
    <PreviewProvider isPreviewMode={isPreviewMode}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b-2 border-black sticky top-0 bg-white z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <EditableWrapper
              element={{
                id: generateId('header-title'),
                role: 'heading',
                content: 'Z.AI',
                level: 1,
                editable: true,
              }}
              isSelected={selectedElement?.id === generateId('header-title')}
              onSelect={handleSelectElement}
            >
              <h1 className="text-xl font-bold">Z.AI</h1>
            </EditableWrapper>

            <nav className="flex gap-6" aria-label="Main navigation">
              <a href="#about" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">About</a>
              <a href="#projects" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Projects</a>
              <a href="#contact" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Contact</a>
            </nav>
          </div>
        </header>

        {/* Hero Section - Asymmetric Grid */}
        <section data-ref={heroSectionRef} aria-labelledby="hero-title" className="border-b-2 border-black">
                                  <div className="grid md:grid-cols-12 min-h-[60vh]">
                                                      {/* Right - Hero Image */}
            <div className="md:col-span-4 p-0 flex items-center justify-center bg-gray-50">
              <EditableImageWrapper
                element={{
                  id: generateId('hero-image'),
                  role: 'image',
                  content: 'Hero workspace image',
                  label: 'Hero Image',
                  editable: true,
                }}
                isSelected={selectedElement?.id === generateId('hero-image')}
                onSelect={handleSelectElement}
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1200&fit=crop"
                alt="Creative developer workspace"
              >
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1200&fit=crop"
                  alt="Creative developer workspace"
                  className="w-full h-full object-cover min-h-[60vh]"
                />
              </EditableImageWrapper>
            </div>
            {/* Left - Large Typography */}
            <div className="md:col-span-6 border-b-2 md:border-b-0 md:border-r-2 border-black p-8 md:p-16 flex flex-col justify-center">
              <EditableWrapper
                element={{
                  id: generateId('hero-label'),
                  role: 'text',
                  content: 'Portfolio',
                  editable: true,
                }}
                isSelected={selectedElement?.id === generateId('hero-label')}
                onSelect={handleSelectElement}
              >
                <p className="text-lg font-mono mb-4 text-gray-600">Portfolio</p>
              </EditableWrapper>

              <EditableWrapper
                element={{
                  id: generateId('hero-title'),
                  role: 'heading',
                  content: 'Creative\nDeveloper',
                  level: 1,
                  editable: true,
                }}
                isSelected={selectedElement?.id === generateId('hero-title')}
                onSelect={handleSelectElement}
              >
                <h2 id="hero-title" className="text-5xl md:text-7xl font-bold leading-tight">
                  Creative<br/>
                  Developer
                </h2>
              </EditableWrapper>
            </div>


          </div>
        </section>

        {/* About Section */}
        <section data-ref={aboutSectionRef} aria-labelledby="about-title" className="border-b-2 border-black">
          <div className="grid md:grid-cols-12">
            {/* Left - Title */}
            <div className="md:col-span-4 border-b-2 md:border-b-0 md:border-r-2 border-black p-8 md:p-12 bg-gray-50">
              <EditableWrapper
                element={{
                  id: generateId('about-title'),
                  role: 'heading',
                  content: 'About',
                  level: 2,
                  editable: true,
                }}
                isSelected={selectedElement?.id === generateId('about-title')}
                onSelect={handleSelectElement}
              >
                <h2 id="about-title" className="text-3xl md:text-4xl font-bold">
                  About
                </h2>
              </EditableWrapper>
            </div>

            {/* Right - Content */}
            <div className="md:col-span-8 p-8 md:p-12">
              <div className="space-y-6">
                <EditableWrapper
                  element={{
                    id: generateId('about-paragraph-1'),
                    role: 'paragraph',
                    content: "I'm a creative developer passionate about building exceptional digital experiences. With expertise in modern web technologies, I create solutions that are both beautiful and functional.",
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('about-paragraph-1')}
                  onSelect={handleSelectElement}
                >
                  <p className="text-lg leading-relaxed">
                    I&apos;m a creative developer passionate about building exceptional digital experiences.
                    With expertise in modern web technologies, I create solutions that are both beautiful and functional.
                  </p>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: generateId('about-paragraph-2'),
                    role: 'paragraph',
                    content: "My approach combines clean code with thoughtful design, ensuring every project meets the highest standards of quality and performance.",
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('about-paragraph-2')}
                  onSelect={handleSelectElement}
                >
                  <p className="text-lg leading-relaxed">
                    My approach combines clean code with thoughtful design, ensuring every project
                    meets the highest standards of quality and performance.
                  </p>
                </EditableWrapper>

                {/* Skills */}
                <div className="pt-6">
                  <EditableWrapper
                    element={{
                      id: generateId('about-skills-title'),
                      role: 'heading',
                      content: 'Skills',
                      level: 3,
                      editable: true,
                    }}
                    isSelected={selectedElement?.id === generateId('about-skills-title')}
                    onSelect={handleSelectElement}
                  >
                    <h3 className="font-bold text-xl mb-4">Skills</h3>
                  </EditableWrapper>

                  <div className="flex flex-wrap gap-2">
                    {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'AI/ML'].map((skill) => (
                      <span
                        key={skill}
                        className="inline-block px-3 py-1 border-2 border-black bg-white hover:bg-gray-50 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Grid Layout */}
        <section data-ref={featuresSectionRef} aria-label="Features" className="border-b-2 border-black">
          <div className="grid md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
            {/* Feature 1 */}
            <div className="p-8 md:p-12 hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0_0_#0A0A0A] group-hover:shadow-[3px_3px_0_0_#0A0A0A] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <span className="text-2xl font-bold">01</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Design</h3>
              <p className="text-gray-600">
                Crafting visual experiences that communicate and captivate.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 md:p-12 hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0_0_#0A0A0A] group-hover:shadow-[3px_3px_0_0_#0A0A0A] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <span className="text-2xl font-bold">02</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Develop</h3>
              <p className="text-gray-600">
                Building robust applications with modern technologies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 md:p-12 hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0_0_#0A0A0A] group-hover:shadow-[3px_3px_0_0_#0A0A0A] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <span className="text-2xl font-bold">03</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Deliver</h3>
              <p className="text-gray-600">
                Shipping polished products that exceed expectations.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section data-ref={projectsSectionRef} aria-labelledby="projects-title" className="border-b-2 border-black">
          <div className="p-8 md:p-12">
            <EditableWrapper
              element={{
                id: generateId('projects-title'),
                role: 'heading',
                content: 'Selected Projects',
                level: 2,
                editable: true,
              }}
              isSelected={selectedElement?.id === generateId('projects-title')}
              onSelect={handleSelectElement}
            >
              <h2 id="projects-title" className="text-3xl md:text-4xl font-bold mb-8">
                Selected Projects
              </h2>
            </EditableWrapper>

            <div className="grid md:grid-cols-2 border-2 border-black">
              {/* Project 1 */}
              <article className="p-8 hover:bg-gray-50 transition-colors border-b-2 md:border-b-0 md:border-r-2 border-black">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-mono text-gray-500">01</span>
                  <a
                    href="#"
                    className="text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
                    aria-label="View Project Alpha project"
                  >
                    View →
                  </a>
                </div>
                <EditableWrapper
                  element={{
                    id: generateId('projects-alpha-title'),
                    role: 'heading',
                    content: 'Project Alpha',
                    level: 3,
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('projects-alpha-title')}
                  onSelect={handleSelectElement}
                >
                  <h3 className="text-2xl font-bold mb-2">Project Alpha</h3>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: generateId('projects-alpha-desc'),
                    role: 'paragraph',
                    content: 'A modern web application built with Next.js and TypeScript.',
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('projects-alpha-desc')}
                  onSelect={handleSelectElement}
                >
                  <p className="text-gray-600 mb-4">
                    A modern web application built with Next.js and TypeScript.
                  </p>
                </EditableWrapper>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-sm border border-gray-300">Next.js</span>
                  <span className="px-2 py-1 text-sm border border-gray-300">TypeScript</span>
                  <span className="px-2 py-1 text-sm border border-gray-300">Tailwind</span>
                </div>
              </article>

              {/* Project 2 */}
              <article className="p-8 hover:bg-gray-50 transition-colors border-b-2 md:border-b-0 border-black">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-mono text-gray-500">02</span>
                  <a
                    href="#"
                    className="text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
                    aria-label="View Project Beta project"
                  >
                    View →
                  </a>
                </div>
                <EditableWrapper
                  element={{
                    id: generateId('projects-beta-title'),
                    role: 'heading',
                    content: 'Project Beta',
                    level: 3,
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('projects-beta-title')}
                  onSelect={handleSelectElement}
                >
                  <h3 className="text-2xl font-bold mb-2">Project Beta</h3>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: generateId('projects-beta-desc'),
                    role: 'paragraph',
                    content: 'An AI-powered tool for creative professionals.',
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('projects-beta-desc')}
                  onSelect={handleSelectElement}
                >
                  <p className="text-gray-600 mb-4">
                    An AI-powered tool for creative professionals.
                  </p>
                </EditableWrapper>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-sm border border-gray-300">React</span>
                  <span className="px-2 py-1 text-sm border border-gray-300">Python</span>
                  <span className="px-2 py-1 text-sm border border-gray-300">AI/ML</span>
                </div>
              </article>

              {/* Project 3 */}
              <article className="p-8 hover:bg-gray-50 transition-colors md:border-r-2 border-black">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-mono text-gray-500">03</span>
                  <a
                    href="#"
                    className="text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
                    aria-label="View Project Gamma project"
                  >
                    View →
                  </a>
                </div>
                <EditableWrapper
                  element={{
                    id: generateId('projects-gamma-title'),
                    role: 'heading',
                    content: 'Project Gamma',
                    level: 3,
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('projects-gamma-title')}
                  onSelect={handleSelectElement}
                >
                  <h3 className="text-2xl font-bold mb-2">Project Gamma</h3>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: generateId('projects-gamma-desc'),
                    role: 'paragraph',
                    content: 'A real-time collaboration platform for teams.',
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('projects-gamma-desc')}
                  onSelect={handleSelectElement}
                >
                  <p className="text-gray-600 mb-4">
                    A real-time collaboration platform for teams.
                  </p>
                </EditableWrapper>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-sm border border-gray-300">Node.js</span>
                  <span className="px-2 py-1 text-sm border border-gray-300">WebSocket</span>
                  <span className="px-2 py-1 text-sm border border-gray-300">PostgreSQL</span>
                </div>
              </article>

              {/* Project 4 */}
              <article className="p-8 hover:bg-gray-50 transition-colors border-black">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-mono text-gray-500">04</span>
                  <a
                    href="#"
                    className="text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
                    aria-label="View Project Delta project"
                  >
                    View →
                  </a>
                </div>
                <EditableWrapper
                  element={{
                    id: generateId('projects-delta-title'),
                    role: 'heading',
                    content: 'Project Delta',
                    level: 3,
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('projects-delta-title')}
                  onSelect={handleSelectElement}
                >
                  <h3 className="text-2xl font-bold mb-2">Project Delta</h3>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: generateId('projects-delta-desc'),
                    role: 'paragraph',
                    content: 'A design system component library with Storybook.',
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === generateId('projects-delta-desc')}
                  onSelect={handleSelectElement}
                >
                  <p className="text-gray-600 mb-4">
                    A design system component library with Storybook.
                  </p>
                </EditableWrapper>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-sm border border-gray-300">Storybook</span>
                  <span className="px-2 py-1 text-sm border border-gray-300">CSS</span>
                  <span className="px-2 py-1 text-sm border border-gray-300">Figma</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section data-ref={contactSectionRef} aria-labelledby="contact-title">
          <div className="grid md:grid-cols-12">
            {/* Left - Title */}
            <div className="md:col-span-4 md:border-r-2 border-black p-8 md:p-12 bg-gray-50">
              <EditableWrapper
                element={{
                  id: generateId('contact-title'),
                  role: 'heading',
                  content: "Let's Connect",
                  level: 2,
                  editable: true,
                }}
                isSelected={selectedElement?.id === generateId('contact-title')}
                onSelect={handleSelectElement}
              >
                <h2 id="contact-title" className="text-3xl md:text-4xl font-bold mb-4">
                  Let&apos;s Connect
                </h2>
              </EditableWrapper>

              <p className="text-gray-600">
                Have a project in mind? Let&apos;s talk.
              </p>
            </div>

            {/* Right - Contact Info & Form */}
            <div className="md:col-span-8 p-8 md:p-12">
              <div className="space-y-8">
                {/* Contact Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="mailto:hello@example.com"
                    className="p-4 border-2 border-black hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
                  >
                    <div className="font-bold mb-1 group-hover:underline">Email</div>
                    <div className="text-gray-600">hello@example.com</div>
                  </a>
                  <a
                    href="#"
                    className="p-4 border-2 border-black hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
                  >
                    <div className="font-bold mb-1 group-hover:underline">GitHub</div>
                    <div className="text-gray-600">@username</div>
                  </a>
                  <a
                    href="#"
                    className="p-4 border-2 border-black hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
                  >
                    <div className="font-bold mb-1 group-hover:underline">Twitter</div>
                    <div className="text-gray-600">@username</div>
                  </a>
                  <a
                    href="#"
                    className="p-4 border-2 border-black hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
                  >
                    <div className="font-bold mb-1 group-hover:underline">LinkedIn</div>
                    <div className="text-gray-600">/in/username</div>
                  </a>
                </div>

                {/* Contact Form */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label htmlFor="name" className="block font-bold mb-2">
                      Name <span className="text-gray-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-bold mb-2">
                      Email <span className="text-gray-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block font-bold mb-2">
                      Message <span className="text-gray-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:border-accent resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-3 font-semibold text-base border-2 border-black bg-accent text-white hover:bg-accent-dark hover:text-white shadow-[2px_2px_0_0_#0A0A0A] hover:shadow-[0_0_0_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-black">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                © 2025 Z.AI. All rights reserved.
              </p>
              <nav className="flex gap-6" aria-label="Footer navigation">
                <a href="#" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">GitHub</a>
                <a href="#" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Twitter</a>
                <a href="#" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">LinkedIn</a>
              </nav>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center md:text-left">
              Built with Next.js, TypeScript, and Neo-Brutalism design principles.
            </p>
          </div>
        </footer>

        {/* Skip Link (Accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:z-[100] focus:rounded"
        >
          Skip to main content
        </a>

        {/* Chat Sidebar - 編集モード時のみ表示 */}
        {isEditMode && (
          <ChatSidebar>
            <ChatApp />
          </ChatSidebar>
        )}

        {/* Preview Mode Toggle */}
        <PreviewModeToggle />
      </div>
    </PreviewProvider>
  )
}

// Suspenseでラップ
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
