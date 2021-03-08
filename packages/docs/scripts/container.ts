import MarkdownIt from 'markdown-it'
import Token from 'markdown-it/lib/token'

const container = require('markdown-it-container')

export const containerPlugin = (md: MarkdownIt) => {
  md.use(...createContainer('info', 'Info'))
    .use(...createContainer('warning', 'Warning'))
    .use(...createContainer('danger', 'Warning'))
    // explicitly escape Vue syntax
    .use(container, 'v-pre', {
      render: (tokens: Token[], idx: number) => {
        return tokens[idx].nesting === 1 ? `<div v-pre>\n` : `</div>\n`
      },
    })
}

type ContainerArgs = [
  typeof container,
  string,
  {
    render(tokens: Token[], idx: number): string
  }
]

const iconSvg = `<svg viewBox="0 0 24 24" focusable="false" class="custom-block-svg"><path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z"></path></svg>`

function createContainer(klass: string, defaultTitle: string): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx]
        // const info = token.info.trim().slice(klass.length).trim()
        if (token.nesting === 1) {
          return `<div class="${klass} custom-block">${iconSvg}<div class="custom-block-content">\n`
        } else {
          return `</div></div>\n`
        }
      },
    },
  ]
}
