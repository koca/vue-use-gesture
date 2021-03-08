import { slugify } from '../src/utils/slugify'
import MarkdownIt from 'markdown-it'
import { unescapeAll, escapeHtml } from 'markdown-it/lib/common/utils'
import Shiki from './shiki'
import { containerPlugin } from './container'
import { componentPlugin } from './component'

const anchor = require('markdown-it-anchor')
const footnote = require('markdown-it-footnote')

const md = MarkdownIt({
  html: true, // this allow us to use markdown in vue component slots
  linkify: true,
})

md.use(componentPlugin)
md.use(Shiki, {
  theme: {
    dark: 'nord',
    light: 'min-light',
  },
})
md.use(containerPlugin)
md.use(footnote)
md.use(anchor, {
  slugify,
  permalink: true,
  permalinkBefore: true,
  permalinkSymbol: '#',
  permalinkAttrs: () => ({ 'aria-hidden': true }),
})

// remove `pre` and `code` wrapper from markdown-it => https://github.com/markdown-it/markdown-it/issues/269#issuecomment-506199293
md.renderer.rules.fence = function (tokens, idx, options, _env, _slf) {
  const token = tokens[idx]
  const info = token.info ? unescapeAll(token.info).trim() : ''
  let langName = ''
  let suffix = ''
  let highlighted

  if (info) {
    ;[langName, suffix] = info.split(/\s+/g) // `js {1,2}` => [`js`, `{1,2}`]
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName, suffix)
  } else {
    highlighted = escapeHtml(token.content)
  }

  return highlighted + '\n'
}

export default md
