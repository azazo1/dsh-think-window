/**
 * dsh-think-window 配置卡片的暂存表单.
 *
 * 表单是 profile 条目 volatile Config 的投影: 草稿只留在页面, 保存才写回 profile 的 patch 层.
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import {
  SettingsFormModel, settingsNumberField,
  type SettingsFieldState, type SettingsFormActions, type SettingsFormScope, type SettingsFormShell,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { LINES_FIELD, type ThinkWindowSettings } from '../shared.ts'

/** 页面读到的状态. */
export interface ThinkWindowCardState extends SettingsFormShell {
  /** 窗口高度字段. */
  lines: SettingsFieldState
}

/** 页面注册时注入给组件的面. */
export interface ThinkWindowCardFace extends SettingsFormActions {
  hooks: {
    /** 组件通过它读快照 (useThinkWindowCard). */
    thinkWindowCard: SnapshotStore<ThinkWindowCardState>
  }
}

/** 把本插件条目的配置表单桥接成配置卡片的暂存表单. */
export class ThinkWindowSettingsForm {
  private readonly form: SettingsFormModel<ThinkWindowSettings>
  private readonly store: SnapshotStore<ThinkWindowCardState>

  /**
   * @param scope - 本插件 profile 条目的共享配置表单 (ctx.configForms.get).
   */
  constructor(scope: SettingsFormScope<ThinkWindowSettings>) {
    this.form = new SettingsFormModel(scope, [settingsNumberField(LINES_FIELD)])
    this.store = this.form.bind(() => ({
      ...this.form.shell(),
      lines: this.form.field(LINES_FIELD),
    }))
  }

  /**
   * 构造 slot 注册要注入的面.
   * @returns 快照 hook 与表单动作.
   */
  inject(): ThinkWindowCardFace {
    return { hooks: { thinkWindowCard: this.store }, ...this.form.actions() }
  }

  /** 释放对配置表单的订阅. */
  dispose(): void {
    this.form.dispose()
  }
}
