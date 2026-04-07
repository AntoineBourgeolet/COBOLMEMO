import { Star } from 'lucide-react'
import CodeBlock from './CodeBlock'

function MemoCard({
  item,
  isFavorite = false,
  onToggleFavorite,
  onTagClick,
}) {
  const favoriteLabel = isFavorite
    ? `Retirer ${item.title} des favoris`
    : `Ajouter ${item.title} aux favoris`

  return (
    <article className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-medium text-gray-100">{item.title}</h4>
          <p className="mt-1 text-sm text-gray-300">{item.content}</p>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite?.(item.id)}
          className={`shrink-0 rounded-lg border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 ${
            isFavorite
              ? 'border-green-400/40 bg-green-500/15 text-green-300'
              : 'border-gray-700 bg-gray-950/70 text-gray-500 hover:border-green-500/30 hover:text-green-300'
          }`}
          aria-label={favoriteLabel}
          aria-pressed={isFavorite}
          title={favoriteLabel}
        >
          <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {item.tags?.length ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              className="cursor-pointer rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 font-mono text-xs text-green-300 transition-colors hover:border-green-400/40 hover:bg-green-500/20 hover:text-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
              aria-label={`Rechercher le tag ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}

      <CodeBlock
        title={item.snippetTitle}
        language={item.language}
        code={item.codeSnippet}
      />
    </article>
  )
}

export default MemoCard
