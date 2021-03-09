import { slugify } from '../src/utils/slugify'
import MarkdownIt from 'markdown-it'
import { highlight, highlightLinePlugin, preWrapperPlugin } from './prism'
import { containerPlugin } from './container'
import { componentPlugin } from './component'
// import { shikiPlugin } from './shiki' // doesnt work when building

const anchor = require('markdown-it-anchor')
const footnote = require('markdown-it-footnote')

const md = MarkdownIt({
  html: true, // this allow us to use markdown in vue component slots
  linkify: true,
  highlight, // remove this when using shiki
})

md.use(componentPlugin)
md.use(highlightLinePlugin) // remove this when using shiki
md.use(preWrapperPlugin) // remove this when using shiki
// md.use(shikiPlugin) // shiki fails on build for some reason
md.use(containerPlugin)
md.use(footnote)
md.use(anchor, {
  slugify,
  permalink: true,
  permalinkBefore: true,
  permalinkSymbol: '#',
  permalinkAttrs: () => ({ 'aria-hidden': true }),
})

export default md
