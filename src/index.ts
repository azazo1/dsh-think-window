/**
 * dsh-think-window Host 半区.
 *
 * 注册可持久化的 settings 命名空间, 让 Web Settings 能保存思维链窗口行数.
 * 限高本身在浏览器半区完成, 只作用于原生 Think 展开体.
 */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type { Volatile } from '@deepseek-ai/cordis'
import {
  DEFAULT_LINES, MAX_LINES, MIN_LINES, PLUGIN_NAME, SETTINGS_NAMESPACE,
  type ThinkWindowSettings,
} from './shared.ts'

export const name = PLUGIN_NAME

export type Config = ThinkWindowSettings

export interface ThinkWindowConfig {
  lines: Volatile<number>
}

/** Loader / settings 共用的窗口 schema. */
export const Config = z.object({
  lines: z.number().step(1).min(MIN_LINES).max(MAX_LINES).default(DEFAULT_LINES).volatile(),
})

/**
 * 在 settings 服务可用时挂上命名空间, 并把 cordis.yml 行配置作为 composition 底.
 * @param ctx - Host 插件上下文.
 * @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
 */
export function apply(ctx: Context, config: ThinkWindowConfig): void {
  ctx.logger.info(
    'dsh-think-window: host loaded, default lines=%d',
    config.lines.get(),
  )
}
