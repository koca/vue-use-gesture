import { join } from 'path'
import { ILanguageRegistration, BUNDLED_LANGUAGES } from 'shiki-languages'
import { getHighlighter } from 'shiki'
import { Theme, IShikiTheme, getTheme, loadTheme } from 'shiki-themes'
import { escapeHtml } from 'markdown-it/lib/common/utils'

type UnWrapPromise<T> = T extends PromiseLike<infer R> ? R : T

/**
 * Shiki renderer to render codeblocks using vscode themes and languages.
 */
export class ShikiRenderer {
  private themeToUse!: IShikiTheme
  private shikiLanguages: ILanguageRegistration[] = []
  private highlighter?: UnWrapPromise<ReturnType<typeof getHighlighter>>

  /**
   * An object of registered languages. We create the object since the array can be
   * quite big and looping over all the items will take time.
   */
  private registeredLanguagesIds: any = {}

  constructor(private basePath: string) {
    BUNDLED_LANGUAGES.forEach((lang) => this.registerLanguage(lang))
  }

  /**
   * Register the language id and aliases
   */
  private registerLanguage(language: ILanguageRegistration) {
    this.registeredLanguagesIds[language.id] = true
    if (language.aliases) {
      language.aliases.forEach((alias) => {
        this.registeredLanguagesIds[alias] = true
      })
    }
  }

  /**
   * Wraps code inside pre tag
   */
  private wrapToPre(code: string, lang: string, highlights?: number[]) {
    const hasHighlights: boolean = (highlights && highlights.length > 0) || false
    return `<pre class="code-shiki-mk ${
      hasHighlights ? 'has-highlight' : ''
    } language-${lang}" style="background-color: ${this.themeToUse.bg}"><code>${code}</code></pre>`
  }

  /**
   * Returns the classes to the used by the code line
   */
  private getLineClasses(line: number, highlights?: number[]) {
    if (!highlights) {
      return 'line'
    }

    return highlights.includes(line) ? 'line highlight' : 'line dim'
  }

  /**
   * Returns true when language id is one of the plain text
   * languages.
   */
  private isPlaintext(language: string) {
    return ['plaintext', 'txt', 'text'].includes(language)
  }

  /**
   * Use an existing theme
   */
  public useTheme(name: Theme): this {
    this.themeToUse = getTheme(name)
    return this
  }

  /**
   * Load a custom theme
   */
  public loadTheme(pathToTheme: string): this {
    this.themeToUse = loadTheme(join(this.basePath, pathToTheme))
    return this
  }

  /**
   * Load a custom language
   */
  public loadLanguage(language: ILanguageRegistration): this {
    language.path = join(this.basePath, language.path)
    this.shikiLanguages.push(language)
    this.registerLanguage(language)
    return this
  }

  /**
   * Boot to instantiate the highlighter. Must be done only once
   */
  public async boot() {
    if (this.highlighter) {
      return
    }

    if (!this.themeToUse) {
      this.useTheme('material-theme-default')
    }

    this.highlighter = await getHighlighter({
      langs: this.shikiLanguages,
      theme: this.themeToUse,
    })
  }

  /**
   * Render code string and get HTML back
   */
  public render(code: string, language?: string, highlights?: number[]): string {
    language = language || 'text'

    /**
     * Render as text when language is not registered
     */
    if (!language) {
      language = 'text'
    }

    /**
     * Plain text languages cannot be tokenized and hence we have
     * to render them as it is
     */
    if (this.isPlaintext(language)) {
      return this.wrapToPre(
        `<div class="line"><span style="color: ${this.themeToUse.fg}">${escapeHtml(code)}</span></div>`,
        'text'
      )
    }

    /**
     * Tokenize code
     */
    const tokens = this.highlighter!.codeToThemedTokens(code, language, undefined, {
      includeExplanation: false,
    })!

    /**
     * Build HTML with support for line highlighting
     */
    let html = ''
    tokens.forEach((group, index) => {
      html += `<div class="${this.getLineClasses(index + 1, highlights)}">`
      group.forEach((token) => {
        html += `<span style="color: ${token.color || this.themeToUse.fg}">${escapeHtml(token.content)}</span>`
      })
      html += `</div>`
    })

    return this.wrapToPre(html, language, highlights)
  }
}
