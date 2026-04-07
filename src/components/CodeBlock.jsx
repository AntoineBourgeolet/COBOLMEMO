import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

function CodeBlock({ code, title = 'Exemple', language = 'text', className = '' }) {
  const [isCopied, setIsCopied] = useState(false)

  const fallbackCopy = () => {
    const textArea = document.createElement('textarea')
    textArea.value = code
    textArea.setAttribute('readonly', '')
    textArea.style.position = 'absolute'
    textArea.style.left = '-9999px'

    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        fallbackCopy()
      }

      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 1800)
    } catch (error) {
      console.error('Clipboard copy failed:', error)
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-green-500/20 bg-gray-950/90 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-green-500/10 px-3 py-2">
        <div>
          <p className="text-sm font-medium text-gray-100">{title}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-green-400">
            {language}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-300 transition hover:bg-green-500/20"
          aria-live="polite"
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          {isCopied ? 'Copié !' : 'Copier'}
        </button>
      </div>

      <pre
        data-language={language}
        className="overflow-x-auto p-4 font-mono text-sm leading-6 text-green-300"
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
