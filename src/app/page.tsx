'use client';

import { ChatSidebar, ChatApp, PreviewModeToggle } from '@/components/chat';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Z.AI</h1>
          <nav className="flex gap-6" aria-label="Main navigation">
            <a href="#about" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">About</a>
            <a href="#projects" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Projects</a>
            <a href="#contact" className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section - Asymmetric Grid */}
      <section aria-labelledby="hero-title" className="border-b-2 border-black">
        <div className="grid md:grid-cols-12 min-h-[60vh]">
          {/* Left - Large Typography */}
          <div className="md:col-span-8 border-b-2 md:border-b-0 md:border-r-2 border-black p-8 md:p-16 flex flex-col justify-center">
            <p className="text-lg font-mono mb-4 text-gray-600">Portfolio</p>
            <h2 id="hero-title" className="text-5xl md:text-7xl font-bold leading-tight">
              Creative<br/>
              Developer
            </h2>
          </div>

          {/* Right - Description & CTA */}
          <div className="md:col-span-4 p-8 md:p-16 flex flex-col justify-center gap-6 bg-gray-50">
            <p className="text-lg">
              Building digital experiences with precision and purpose.
            </p>
            <div className="flex flex-col gap-4">
              <a href="#projects" className="inline-flex items-center justify-center px-6 py-3 font-semibold text-lg border-2 border-black bg-accent text-white hover:bg-accent-dark hover:text-white shadow-[2px_2px_0_0_#0A0A0A] hover:shadow-[0_0_0_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                View Projects
              </a>
              <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 font-semibold text-lg border-2 border-black bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_0_#0A0A0A] hover:shadow-[0_0_0_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" aria-labelledby="about-title" className="border-b-2 border-black">
        <div className="grid md:grid-cols-12">
          {/* Left - Title */}
          <div className="md:col-span-4 border-b-2 md:border-b-0 md:border-r-2 border-black p-8 md:p-12 bg-gray-50">
            <h2 id="about-title" className="text-3xl md:text-4xl font-bold">
              About
            </h2>
          </div>

          {/* Right - Content */}
          <div className="md:col-span-8 p-8 md:p-12">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                I&apos;m a creative developer passionate about building exceptional digital experiences.
                With expertise in modern web technologies, I create solutions that are both beautiful and functional.
              </p>
              <p className="text-lg leading-relaxed">
                My approach combines clean code with thoughtful design, ensuring every project
                meets the highest standards of quality and performance.
              </p>

              {/* Skills */}
              <div className="pt-6">
                <h3 className="font-bold text-xl mb-4">Skills</h3>
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
      <section aria-label="Features" className="border-b-2 border-black">
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
      <section id="projects" aria-labelledby="projects-title" className="border-b-2 border-black">
        <div className="p-8 md:p-12">
          <h2 id="projects-title" className="text-3xl md:text-4xl font-bold mb-8">
            Selected Projects
          </h2>

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
              <h3 className="text-2xl font-bold mb-2">Project Alpha</h3>
              <p className="text-gray-600 mb-4">
                A modern web application built with Next.js and TypeScript.
              </p>
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
              <h3 className="text-2xl font-bold mb-2">Project Beta</h3>
              <p className="text-gray-600 mb-4">
                An AI-powered tool for creative professionals.
              </p>
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
              <h3 className="text-2xl font-bold mb-2">Project Gamma</h3>
              <p className="text-gray-600 mb-4">
                A real-time collaboration platform for teams.
              </p>
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
              <h3 className="text-2xl font-bold mb-2">Project Delta</h3>
              <p className="text-gray-600 mb-4">
                A design system component library with Storybook.
              </p>
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
      <section id="contact" aria-labelledby="contact-title">
        <div className="grid md:grid-cols-12">
          {/* Left - Title */}
          <div className="md:col-span-4 md:border-r-2 border-black p-8 md:p-12 bg-gray-50">
            <h2 id="contact-title" className="text-3xl md:text-4xl font-bold mb-4">
              Let&apos;s Connect
            </h2>
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

      {/* Chat Sidebar */}
      <ChatSidebar>
        <ChatApp />
      </ChatSidebar>

      {/* Preview Mode Toggle */}
      <PreviewModeToggle />
    </div>
  );
}
