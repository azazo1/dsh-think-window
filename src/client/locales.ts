/** dsh-think-window 插件页配置卡片的文案. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives'
import { DEFAULT_LINES, MAX_LINES, MIN_LINES } from '../shared.ts'

/** 本插件字典的命名空间, 与包名一致. */
export const NS = 'dsh-think-window'

/** 本插件用到的文案键. */
export type ThinkWindowKey =
  | 'description'
  | 'lines' | 'linesHint'
  | 'overridden' | 'reset' | 'invalid'
  | 'readOnly' | 'unavailable' | 'save' | 'saving' | 'saveFailed'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** 本插件配置卡片的文案. */
    'dsh-think-window': ThinkWindowKey
  }
}

/** English copy. */
export const en: Record<ThinkWindowKey, string> = {
  description: 'Give the expanded thinking block a bounded scroll window.',
  lines: 'Window height (lines)',
  linesHint: 'Default ' + DEFAULT_LINES + ' lines; 0 removes the cap. Range ' + MIN_LINES + '-' + MAX_LINES + '.',
  overridden: 'Overridden',
  reset: 'Reset to default',
  invalid: 'Enter a whole number between ' + MIN_LINES + ' and ' + MAX_LINES + ', or leave blank to use the default.',
  readOnly: 'This deployment stores settings read-only.',
  unavailable: 'This plugin is not loaded, so it cannot be configured right now.',
  save: 'Save',
  saving: 'Saving...',
  saveFailed: 'The deployment did not accept these values; they were left for you to correct.',
}

/** Simplified Chinese copy. */
export const zh: Record<ThinkWindowKey, string> = {
  description: '给展开后的思维链块一个有限高度的滚动窗口.',
  lines: '窗口高度 (行)',
  linesHint: '默认 ' + DEFAULT_LINES + ' 行, 0 表示不限高, 取值范围 ' + MIN_LINES + '-' + MAX_LINES + '.',
  overridden: '已覆盖',
  reset: '恢复默认',
  invalid: '请填 ' + MIN_LINES + ' 到 ' + MAX_LINES + ' 之间的整数; 留空表示使用默认值.',
  readOnly: '本部署的设置为只读.',
  unavailable: '该插件当前未加载, 暂时无法配置.',
  save: '保存',
  saving: '保存中...',
  saveFailed: '本部署没有接受这些值, 已保留供你修改.',
}

/**
 * 表单框架要的文案, 从本插件字典取.
 * @param t - 本插件字典的读取函数.
 * @returns 共享设置表单渲染的标签.
 */
export function formLabels(t: (key: ThinkWindowKey) => string): SettingsFormLabels {
  return {
    unavailable: t('unavailable'),
    readOnly: t('readOnly'),
    saveFailed: t('saveFailed'),
    save: t('save'),
    saving: t('saving'),
  }
}
