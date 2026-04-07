import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Layout from './components/Layout'
import CodeBlock from './components/CodeBlock'
import guideData from './data/data.json'

function App() {
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState(
    guideData.categories[0]?.id ?? '',
  )

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return guideData.categories
    }

    return guideData.categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const searchableContent = [
            item.title,
            item.content,
            item.codeSnippet,
            ...(item.tags ?? []),
          ]
            .join(' ')
            .toLowerCase()

          return searchableContent.includes(normalizedQuery)
        }),
      }))
      .filter((category) => category.items.length > 0)
  }, [query])

  const currentSection =
    filteredCategories.find((category) => category.id === activeSection)?.id ??
    filteredCategories[0]?.id ??
    ''

  useEffect(() => {
    document.title = query
      ? `MEMOCOBOL | Recherche: ${query}`
      : 'MEMOCOBOL | Pocket Guide COBOL z/OS'

    return () => {
      document.title = 'MEMOCOBOL | Pocket Guide COBOL z/OS'
    }
  }, [query])

  const handleSectionSelect = (sectionId) => {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const handleTagClick = (tag) => {
    setQuery(tag)
  }

  const searchBar = (
    <label className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-gray-900/70 px-3 py-2 text-sm text-gray-300 shadow-lg shadow-black/20">
      <Search size={16} className="text-green-400" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher : COMP-3, S0C4, JOB, PERFORM..."
        className="w-full bg-transparent outline-none placeholder:text-gray-500"
        aria-label="Rechercher dans le mémo COBOL"
      />
    </label>
  )

  return (
    <Layout
      categories={guideData.categories}
      activeSection={currentSection}
      onSelectSection={handleSectionSelect}
      searchSlot={searchBar}
    >
      <section className="mb-6 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-gray-950 to-gray-900 p-4 shadow-xl shadow-black/20">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-green-400">
          z/OS 1.3 Pocket Guide
        </p>
        <h2 className="text-2xl font-semibold text-gray-100">
          Référentiel mobile-first pour COBOL & JCL
        </h2>
        <p className="mt-2 text-sm text-gray-300">
          Une base rapide pour retrouver la structure d&apos;un programme, un
          squelette JCL et les snippets essentiels en environnement mainframe.
        </p>
      </section>

      <div className="space-y-5">
        {filteredCategories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-28 rounded-2xl border border-gray-800 bg-gray-950/80 p-4 shadow-lg shadow-black/10"
          >
            <div className="mb-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-green-400">
                {category.id}
              </p>
              <h3 className="text-xl font-semibold text-gray-100">
                {category.title}
              </h3>
              <p className="mt-1 text-sm text-gray-400">{category.description}</p>
            </div>

            <div className="space-y-4">
              {category.items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-gray-800 bg-gray-900/60 p-4"
                >
                  <div className="mb-3">
                    <h4 className="text-lg font-medium text-gray-100">{item.title}</h4>
                    <p className="mt-1 text-sm text-gray-300">{item.content}</p>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.tags?.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className="cursor-pointer rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 font-mono text-xs text-green-300 transition-colors hover:border-green-400/40 hover:bg-green-500/20 hover:text-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
                        aria-label={`Rechercher le tag ${tag}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <CodeBlock
                    title={item.snippetTitle}
                    language={item.language}
                    code={item.codeSnippet}
                  />
                </article>
              ))}
            </div>
          </section>
        ))}

        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/40 p-6 text-center text-sm text-gray-400">
            Aucun résultat pour <span className="font-mono text-green-400">{query}</span>.
          </div>
        ) : null}
      </div>
    </Layout>
  )
}

export default App
