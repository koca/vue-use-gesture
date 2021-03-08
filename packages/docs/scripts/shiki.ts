import type MarkdownIt from 'markdown-it'
import deasync from 'deasync'
import { Theme } from 'shiki-themes'
import { ShikiRenderer } from './renderer'
import { escapeHtml } from 'markdown-it/lib/common/utils'
import MultiRange from 'multi-integer-range'

export interface Options {
  theme?: Theme
  timeout?: number
}

async function boot(theme: Theme = 'nord') {
  const renderer = new ShikiRenderer(__dirname)
  await renderer.useTheme(theme).boot()
  return renderer
}

const MarkdownItShiki: MarkdownIt.PluginWithOptions<Options> = (markdownit, options = {}) => {
  let _highlighter: any = undefined!

  const { timeout = 10_000 } = options

  boot().then(function (h) {
    _highlighter = h
  })

  /**
   * @param info the highlighting range text. example: `js {1-3}` => `{1-3}` is the info. see `./markdown.ts`
   */
  markdownit.options.highlight = (code, lang, info) => {
    if (!_highlighter) {
      console.log('awaiting getHighlighter()')
      let count = timeout / 200
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!_highlighter) {
        deasync.sleep(200)
        count -= 1
        if (count <= 0) {
          throw new Error('Shiki.getHighlighter() never gets resolved')
        }
      }
      console.log('getHighlighter() resolved')
    }

    let highlightLinesArray: any = []

    if (info) {
      const [, lineNumbersRange] = info.match(/-?{(.*)}/) || [] // without curlybraces
      const highlightLines = new MultiRange(lineNumbersRange)
      highlightLinesArray = highlightLines.toArray() // [1, 3]
    }

    if (lang) {
      const results = escapeHtml(_highlighter.render(code, lang, highlightLinesArray))
      return results
    } else {
      return `<pre><code>${code}</code></pre>`
    }
  }
}

export default MarkdownItShiki
