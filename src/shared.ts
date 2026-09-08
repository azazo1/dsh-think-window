/** 插件包名, Client loader 注册 id, Loader row 名共用. */
export const PLUGIN_ID = 'dsh-think-window'

/** Host Cordis 插件名. */
export const PLUGIN_NAME = PLUGIN_ID

/** 持久化 settings 命名空间, 与插件名一致. */
export const SETTINGS_NAMESPACE = PLUGIN_ID

/** 窗口高度字段名. */
export const LINES_FIELD = 'lines'

/** 默认窗口高度 (行). */
export const DEFAULT_LINES = 10

/** 允许的最小行数. `0` 表示不限高. */
export const MIN_LINES = 0

/** 允许的最大行数. */
export const MAX_LINES = 200

/** 判断滚动是否贴着底部的像素余量. */
export const FOLLOW_SLOP_PX = 32

/** 注入样式的标记, 避免重复插入. */
export const STYLE_ATTR = 'data-plugin-css'

/** 注入样式的 id. */
export const STYLE_ID = 'dsh-think-window'

/** 文档根上的限高开关属性. */
export const CAPPED_ATTR = 'data-dsh-think-window-capped'

/** 行数 CSS 变量. */
export const LINES_VAR = '--dsh-think-window-lines'

/** 用户可调的思维链窗口设置. */
export interface ThinkWindowSettings {
  /** 展开后的思维链块限高行数. `0` 表示不限高. */
  lines: number
}

/**
 * 把未知值夹到合法行数.
 * @param value - 用户输入或 settings 原始值.
 * @returns 夹紧后的整数行数.
 */
export function clampLines(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return DEFAULT_LINES
  return Math.min(MAX_LINES, Math.max(MIN_LINES, Math.round(n)))
}

/**
 * 把 Host 返回的未知 section 解码成类型化设置.
 * 非对象返回 `undefined`, 保留上一次已接受值; 对象字段异常则回退默认行数.
 * @param section - settings namespace 的原始 section.
 * @returns 解码后的设置, 或 `undefined`.
 */
export function decodeThinkWindowSettings(
  section: unknown,
): ThinkWindowSettings | undefined {
  if (typeof section !== 'object' || section === null) return undefined
  const lines = (section as Record<string, unknown>)[LINES_FIELD]
  return { lines: clampLines(lines) }
}

/**
 * 判断滚动容器是否贴着底部, 用于流式输出时的跟随.
 * @param scrollTop - 当前滚动位置.
 * @param scrollHeight - 内容高度.
 * @param clientHeight - 可见高度.
 * @param slop - 贴底判定余量.
 * @returns 是否视为贴着底部.
 */
export function isNearBottom(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  slop = FOLLOW_SLOP_PX,
): boolean {
  return scrollHeight - scrollTop - clientHeight <= slop
}
