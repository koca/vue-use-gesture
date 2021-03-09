import MarkdownIt from 'markdown-it'
const chalk = require('chalk')
const prism = require('prismjs')
const loadLanguages = require('prismjs/components/index')
import { escapeHtml } from 'markdown-it/lib/common/utils'

export const preWrapperPlugin = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const rawCode = fence(...args)
    return `<div class="language-${token.info.trim()}">${rawCode}</div>`
  }
}

// required to make embedded highlighting work...
loadLanguages(['markup', 'css', 'javascript'])

function wrap(code: string, _lang: string, hasHighlights: boolean): string {
  code = escapeHtml(code)
  return `<pre v-pre class="code-shiki-mk ${hasHighlights ? 'has-highlight' : ''}"><code>${code}</code></pre>`
}

export const highlight = (str: string, lang: string, attrs: string) => {
  const hasHighlights = Number(attrs) >= 1
  if (!lang) {
    return wrap(str, 'text', hasHighlights)
  }
  lang = lang.toLowerCase()
  const rawLang = lang
  if (lang === 'vue' || lang === 'html') {
    lang = 'markup'
  }
  if (lang === 'md') {
    lang = 'markdown'
  }
  if (lang === 'ts') {
    lang = 'typescript'
  }
  if (lang === 'py') {
    lang = 'python'
  }
  if (!prism.languages[lang]) {
    try {
      loadLanguages([lang])
    } catch (e) {
      console.warn(chalk.yellow(`[vitepress] Syntax highlight for language "${lang}" is not supported.`))
    }
  }
  if (prism.languages[lang]) {
    const code = prism.highlight(str, prism.languages[lang], lang)
    return wrap(code, rawLang, hasHighlights)
  }
  return wrap(str, 'text', hasHighlights)
}

const RE = /{([\d,-]+)}/
const wrapperRE = /^<pre .*?><code>/

export const highlightLinePlugin = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options] = args
    const token = tokens[idx]

    const rawInfo = token.info
    if (!rawInfo || !RE.test(rawInfo)) {
      return fence(...args)
    }

    const langName = rawInfo.replace(RE, '').trim()
    // ensure the next plugin get the correct lang.
    token.info = langName

    const lineNumbers = RE.exec(rawInfo)![1]
      .split(',')
      .map((v) => v.split('-').map((v) => parseInt(v, 10)))

    const code = options.highlight
      ? escapeHtml(options.highlight(token.content, langName, `${lineNumbers.length}`))
      : escapeHtml(token.content)

    const rawCode = code.replace(wrapperRE, '')
    const highlightLinesCode = rawCode
      .split('\n')
      .map((_split, index) => {
        const lineNumber = index + 1
        const inRange = lineNumbers.some(([start, end]) => {
          if (start && end) {
            return lineNumber >= start && lineNumber <= end
          }
          return lineNumber === start
        })
        if (inRange) {
          return `<div class="highlighted">&nbsp;</div>`
        }
        return '<div class="dim">&nbsp;</div>'
      })
      .join('')

    const highlightLinesWrapperCode = `<div class="highlight-lines">${highlightLinesCode}</div>`

    return highlightLinesWrapperCode + code
  }
}
