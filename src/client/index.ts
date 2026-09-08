/**
 * dsh-think-window 浏览器半区.
 *
 * 只给原生思维链展开体加有限高度的内部滚动, 不重挂对话行, 不包工具调用, 不包助手正文.
 */
import { createElement } from 'react'
import {
  DEFAULT_LINES, PLUGIN_ID, SETTINGS_NAMESPACE, decodeThinkWindowSettings,
  type ThinkWindowSettings,
} from '../shared.ts'
import type { ClientContext } from './context.ts'
import { startThinkFollow } from './follow.ts'
import type { SettingsScope } from './scope.ts'
import { ThinkWindowSettingsRow } from './settings-row.tsx'
import { applyWindowLines, injectStyles } from './styles.ts'

export const inject = ['slots', 'settingsScope']

function liveLines(scope: SettingsScope<ThinkWindowSettings> | null): number {
  return scope?.getSnapshot().value?.lines ?? DEFAULT_LINES
}

/**
 * 注入样式, 订阅窗口行数, 并挂上 Settings 行.
 * @param ctx - Web Client 插件上下文.
 */
export function apply(ctx: ClientContext): void {
  ctx.logger.info('dsh-think-window: client applying')
  injectStyles()

  const scope = ctx.settingsScope.bind({
    namespace: SETTINGS_NAMESPACE,
    decode: decodeThinkWindowSettings,
  })

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

  ctx.slots.inject('settings.general.item', () => ctx.slots.register(
    {
      name: 'settings.general.item',
      id: PLUGIN_ID,
      order: 80,
    },
    () => createElement(ThinkWindowSettingsRow, { scope }),
  ))
}
