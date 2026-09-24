/**
 * dsh-think-window Host 半区.
 *
 * 只声明窗口行数的 volatile Config, 让插件页的卡片配置能编辑它.
 * 限高本身在浏览器半区完成, 只作用于原生 Think 展开体.
 */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type { Volatile } from '@deepseek-ai/cordis'
import {
  DEFAULT_LINES, MAX_LINES, MIN_LINES, PLUGIN_NAME,
  type ThinkWindowSettings,
} from './shared.ts'

export const name = PLUGIN_NAME

export type Config = ThinkWindowSettings

export interface ThinkWindowConfig {
  lines: Volatile<number>
}

/** Loader / 插件页表单共用的窗口 schema. */
export const Config = z.object({
  lines: z.number().step(1).min(MIN_LINES).max(MAX_LINES).default(DEFAULT_LINES).volatile(),
})

/**
 * 报告一次装配结果; 行数本身由浏览器半区每次操作时读取.
 * @param ctx - Host 插件上下文.
 * @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
 */
export function apply(ctx: Context, config: ThinkWindowConfig): void {
  ctx.logger.info(
    'dsh-think-window: host loaded, default lines=%d',
    config.lines.get(),
  )
}
