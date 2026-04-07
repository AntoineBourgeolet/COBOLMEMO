import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Layout from './components/Layout'
import MemoCard from './components/MemoCard'
import guideData from './data/data.json'

const FAVORITES_STORAGE_KEY = 'memocobol-favorites'
const FAVORITES_SECTION = {
  id: 'favoris',
  title: 'Favoris',
  description: 'Vos fiches épinglées pour un accès rapide.',
}

const matchesQuery = (item, normalizedQuery) => {
  if (!normalizedQuery) {
    return true
  }

  const searchableContent = [
    item.title,
    item.content,
    item.codeSnippet,
    ...(item.tags ?? []),
  ]
    .join(' ')
    .toLowerCase()

  return searchableContent.includes(normalizedQuery)
}

const readStoredFavorites = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : []

    return Array.isArray(parsedFavorites)
      ? [...new Set(parsedFavorites.filter((value) => typeof value === 'string'))]
      : []
  } catch (error) {
    console.error('Unable to read favorites from localStorage:', error)
    return []
  }
}

function App() {
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState(readStoredFavorites)
  const [activeSection, setActiveSection] = useState(
    guideData.categories[0]?.id ?? '',
  )

  const normalizedQuery = query.trim().toLowerCase()

  const itemsById = useMemo(
    () =>
      new Map(
        guideData.categories
          .flatMap((category) => category.items)
          .map((item) => [item.id, item]),
      ),
    [],
  )

  const favoriteIds = useMemo(() => new Set(favorites), [favorites])

  const filteredCategories = useMemo(
    () =>
      guideData.categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => matchesQuery(item, normalizedQuery)),
        }))
        .filter((category) => category.items.length > 0),
    [normalizedQuery],
  )

  const favoriteItems = useMemo(
    () =>
      favorites
        .map((favoriteId) => itemsById.get(favoriteId))
        .filter((item) => item && matchesQuery(item, normalizedQuery)),
    [favorites, itemsById, normalizedQuery],
  )

  const categoriesToRender = useMemo(() => {
    if (favoriteItems.length === 0) {
      return filteredCategories
    }

    return [
      {
        ...FAVORITES_SECTION,
        items: favoriteItems,
      },
      ...filteredCategories,
    ]
  }, [favoriteItems, filteredCategories])

  const currentSection =
    categoriesToRender.find((category) => category.id === activeSection)?.id ??
    categoriesToRender[0]?.id ??
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

  const toggleFavorite = (itemId) => {
    setFavorites((currentFavorites) => {
      const nextFavorites = currentFavorites.includes(itemId)
        ? currentFavorites.filter((favoriteId) => favoriteId !== itemId)
        : [itemId, ...currentFavorites]

      try {
        window.localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(nextFavorites),
        )
      } catch (error) {
        console.error('Unable to save favorites to localStorage:', error)
      }

      return nextFavorites
    })
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
      categories={categoriesToRender}
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
        {categoriesToRender.map((category) => (
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
                <MemoCard
                  key={item.id}
                  item={item}
                  isFavorite={favoriteIds.has(item.id)}
                  onToggleFavorite={toggleFavorite}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          </section>
        ))}

        {categoriesToRender.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/40 p-6 text-center text-sm text-gray-400">
            Aucun résultat pour <span className="font-mono text-green-400">{query}</span>.
          </div>
        ) : null}
      </div>
    </Layout>
  )
}

export default App
