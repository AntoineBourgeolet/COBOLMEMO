import { Menu, TerminalSquare, X } from 'lucide-react'
import { useState } from 'react'

function Layout({
  title = 'MEMOCOBOL',
  categories = [],
  activeSection,
  onSelectSection,
  searchSlot,
  children,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSelect = (sectionId) => {
    onSelectSection?.(sectionId)
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <header className="sticky top-0 z-50 border-b border-green-500/20 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-2 text-green-400">
              <TerminalSquare size={18} />
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-green-400">
                Pocket Guide
              </p>
              <h1 className="text-sm font-semibold text-gray-100 sm:text-base">
                {title}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex items-center justify-center rounded-lg border border-green-500/30 bg-gray-900 p-2 text-green-400 md:hidden"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {categories.map((category) => {
              const isActive = activeSection === category.id

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelect(category.id)}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {category.title}
                </button>
              )
            })}
          </nav>
        </div>

        {isMenuOpen ? (
          <nav
            id="mobile-navigation"
            className="border-t border-green-500/10 bg-gray-950 px-4 py-3 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelect(category.id)}
                  className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-left text-sm text-gray-200"
                >
                  {category.title}
                </button>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-4">
        {searchSlot ? <div className="mb-4">{searchSlot}</div> : null}
        <main>{children}</main>
      </div>
    </div>
  )
}

export default Layout
