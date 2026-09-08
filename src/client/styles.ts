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

.dtw-set-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dtw-set-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 48px;
}

.dtw-set-title {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.dtw-set-desc {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

.dtw-set-control {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}

.dtw-set-btn {
  height: 36px;
  min-width: 36px;
  padding: 0 10px;
  border: none;
  border-radius: 18px;
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-label-primary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.dtw-set-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dtw-set-btn:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}

.dtw-set-btn:disabled {
  color: var(--dsw-alias-label-caption);
  cursor: default;
}

.dtw-set-input {
  width: 64px;
  height: 36px;
  padding: 0 12px;
  text-align: center;
  border: none;
  border-radius: 18px;
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
}

.dtw-set-input:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dtw-set-input:focus,
.dtw-set-input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary);
}

@media (max-width: 640px) {
  .dtw-set-row {
    flex-direction: column;
    align-items: stretch;
  }

  .dtw-set-text {
    padding-right: 0;
  }

  .dtw-set-control {
    width: 100%;
  }

  .dtw-set-input {
    flex: 1;
    width: 100%;
  }
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
 * @param lines - 夹紧后的行数, `0` 关闭限高.
 */
export function applyWindowLines(lines: number): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty(LINES_VAR, String(lines))
  if (lines > 0) root.setAttribute(CAPPED_ATTR, '1')
  else root.removeAttribute(CAPPED_ATTR)
}
