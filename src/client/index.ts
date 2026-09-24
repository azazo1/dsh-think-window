/**
 * dsh-think-window 浏览器半区.
 *
 * 只给原生思维链展开体加有限高度的内部滚动, 不重挂对话行, 不包工具调用, 不包助手正文.
 * 窗口行数来自本插件 profile 条目 Config 的 volatile 字段, 在插件页的卡片配置里编辑.
 */
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import {
  DEFAULT_LINES, ENTRY_ID, LINES_FIELD, PLUGIN_ID,
  type ThinkWindowSettings,
} from '../shared.ts'
import type { ClientContext } from './context.ts'
import { startThinkFollow } from './follow.ts'
import { en, NS, zh } from './locales.ts'
import { ThinkWindowSettingsCard } from './settings-card.tsx'
import { ThinkWindowSettingsForm } from './settings-form.ts'
import { applyWindowLines, injectStyles } from './styles.ts'

export const inject = ['slots', 'locale', 'configForms']

/** 当前生效的窗口行数, 条目尚未送达时用默认值. */
function liveLines(scope: ConfigForm<ThinkWindowSettings>): number {
  return scope.getSnapshot().value?.[LINES_FIELD] ?? DEFAULT_LINES
}

/**
 * 注入样式, 订阅窗口行数, 并挂上插件页的卡片配置.
 * @param ctx - Web Client 插件上下文.
 */
export function apply(ctx: ClientContext): void {
  ctx.logger.info('dsh-think-window: client applying')
  injectStyles()

  const scope = ctx.configForms.get<ThinkWindowSettings>(ENTRY_ID)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-think-window: dictionaries')

  ctx.effect(() => {
    const sync = (): void => {
      const lines = liveLines(scope)
      applyWindowLines(lines)
      ctx.logger.debug('dsh-think-window: window lines=%d', lines)
    }
    sync()
    const unsub = scope.subscribe(sync)
    const stopFollow = startThinkFollow()
    return () => {
      unsub()
      stopFollow()
    }
  }, 'dsh-think-window: window')

  const card = new ThinkWindowSettingsForm(scope)
  ctx.effect(() => () => { card.dispose() }, 'dsh-think-window: settings form')
  ctx.effect(() => ctx.configForms.whileServed([ENTRY_ID], () => ctx.slots.inject(
    'plugins.bundle.config',
    () => ctx.slots.register({
      name: 'plugins.bundle.config',
      key: PLUGIN_ID,
      locale: NS,
      inject: () => card.inject(),
    }, ThinkWindowSettingsCard),
  )), 'dsh-think-window: plugins page card')
}
