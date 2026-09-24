import {
  CAPPED_ATTR, DEFAULT_LINES, LINES_VAR, STYLE_ATTR, STYLE_ID,
} from '../shared.ts'

/**
 * 只约束原生 Think 展开体.
 *
 * 选择器走稳定的 data 属性, 不依赖 CSS Module 哈希类名:
 * `[data-variant="think"]` 是 ReasoningRow 根,
 * `[data-open] > :not([data-disclosure-row])` 是展开后的 thinkBody.
 * 工具调用和助手正文都不匹配.
 */
const CSS_TEXT = `
html[${CAPPED_ATTR}="1"] [data-variant="think"][data-expanded] [data-open] > :not([data-disclosure-row]) {
  max-height: calc(var(${LINES_VAR}, ${DEFAULT_LINES}) * (20px + var(--dsh-content-font-delta-secondary, 0px)) + 8px);
  overflow-y: auto;
  overscroll-behavior: contain;
}
`.trim()

/**
 * 把插件样式注入 document, 重复调用是空操作.
 */
export function injectStyles(): void {
  if (typeof document === 'undefined') return
  if (document.querySelector(`style[${STYLE_ATTR}="${STYLE_ID}"]`) !== null) return
  const style = document.createElement('style')
  style.setAttribute(STYLE_ATTR, STYLE_ID)
  style.textContent = CSS_TEXT
  document.head.appendChild(style)
}

/**
 * 把当前窗口行数写到文档根, 已渲染的 Think 块立即改高度.
 * @param lines - 当前行数, `0` 关闭限高.
 */
export function applyWindowLines(lines: number): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty(LINES_VAR, String(lines))
  if (lines > 0) root.setAttribute(CAPPED_ATTR, '1')
  else root.removeAttribute(CAPPED_ATTR)
}
