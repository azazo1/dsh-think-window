import {
  CAPPED_ATTR, DEFAULT_LINES, LINES_VAR, PLUGIN_ATTR, PLUGIN_ID, STYLE_ATTR, STYLE_ID,
} from '../shared.ts'

/**
 * 只约束原生 Think 展开体.
 *
 * 选择器走稳定的 data 属性, 不依赖 CSS Module 哈希类名:
 * `[data-variant="think"]` 是 ReasoningRow 根,
 * `[data-open] > :not([data-disclosure-row])` 是展开后的 thinkBody.
 * 工具调用和助手正文都不匹配.
 *
 * 这里不写 `overscroll-behavior`: 默认的 auto 让滚动链生效,
 * 窗口内滚到上下限后继续滚动会带动外层会话滚动容器.
 */
const CSS_TEXT = `
html[${CAPPED_ATTR}="1"] [data-variant="think"][data-expanded] [data-open] > :not([data-disclosure-row]) {
  max-height: calc(var(${LINES_VAR}, ${DEFAULT_LINES}) * (20px + var(--dsh-content-font-delta-secondary, 0px)) + 8px);
  overflow-y: auto;
}
`.trim()

/**
 * 注入插件样式, 并返回移除它的 disposer.
 *
 * style 带 `data-plugin-css` 与 `data-plugin` 两个标记: DSH Client module system
 * 在替换或回收插件时按它们认领和删除样式, 插件自己也在 disposer 里移除,
 * 两条路径都走到, 热拔插后不会留下残余限高.
 *
 * 若文档里已有同标记的样式 (上一次装载的残留), 先移除再注入,
 * 保证生效的永远是当前这份 CSS.
 * @returns 移除本次注入样式的函数, 重复调用无害.
 */
export function injectStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  document.querySelector(`style[${STYLE_ATTR}="${STYLE_ID}"]`)?.remove()
  const style = document.createElement('style')
  style.setAttribute(STYLE_ATTR, STYLE_ID)
  style.setAttribute(PLUGIN_ATTR, PLUGIN_ID)
  style.textContent = CSS_TEXT
  document.head.appendChild(style)
  return () => { style.remove() }
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

/**
 * 撤掉限高开关与行数变量, 让文档根回到插件装载前的样子.
 */
export function resetWindowLines(): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.removeProperty(LINES_VAR)
  root.removeAttribute(CAPPED_ATTR)
}
