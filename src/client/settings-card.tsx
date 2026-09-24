/**
 * 插件页里 dsh-think-window 卡片的配置页.
 *
 * 页面只在 Host 真的组合了本条目的期间注册 (configForms.whileServed).
 */
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import { SettingsForm, SettingsValueField } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { LINES_FIELD } from '../shared.ts'
import { formLabels } from './locales.ts'
import type { ThinkWindowCardFace } from './settings-form.ts'

/** 组件拿到的 props. */
export type ThinkWindowSettingsCardProps =
  PropsRuntime<'plugins.bundle.config'>
  & PropsLocale<'dsh-think-window'>
  & InjectFace<ThinkWindowCardFace>

/**
 * 渲染本行的一行简介或配置表单, 由插件页的 view 决定.
 * @param props - 页面要的视图, 字典, 表单快照与动作.
 * @returns 简介文本或配置表单.
 */
export function ThinkWindowSettingsCard(props: ThinkWindowSettingsCardProps) {
  const { t } = props
  const state = props.useThinkWindowCard(snapshot => snapshot)
  if (props.view === 'summary') return t('description')

  return (
    <SettingsForm labels={formLabels(t)} state={state} onSave={props.save} onDiscard={props.discard}>
      <SettingsValueField
        id="plugin-config-think-window-lines"
        label={t('lines')}
        hint={t('linesHint')}
        overriddenLabel={t('overridden')}
        resetLabel={t('reset')}
        invalidLabel={t('invalid')}
        numeric
        disabled={!state.writable}
        {...state.lines}
        onEdit={(text) => { props.edit(LINES_FIELD, text) }}
        onReset={() => { props.resetField(LINES_FIELD) }}
      />
    </SettingsForm>
  )
}
