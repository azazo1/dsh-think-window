import { useSyncExternalStore, type ChangeEvent } from 'react'
import {
  DEFAULT_LINES, LINES_FIELD, MAX_LINES, MIN_LINES, clampLines,
  type ThinkWindowSettings,
} from '../shared.ts'
import type { SettingsScope } from './scope.ts'

export interface ThinkWindowSettingsRowProps {
  /** 已绑定的 settings scope. */
  scope: SettingsScope<ThinkWindowSettings>
}

function currentLines(scope: SettingsScope<ThinkWindowSettings>): number {
  return scope.getSnapshot().value?.lines ?? DEFAULT_LINES
}

/**
 * Settings > General 中的思维链窗口行数调节行.
 * @param props.scope - Host 命名空间的浏览器镜像.
 */
export function ThinkWindowSettingsRow({ scope }: ThinkWindowSettingsRowProps) {
  const lines = useSyncExternalStore(
    (onChange) => scope.subscribe(onChange),
    () => currentLines(scope),
  )
  const value = clampLines(lines)

  const commit = (next: unknown): void => {
    const n = clampLines(next)
    void scope.set(LINES_FIELD, n)
  }

  return (
    <div className="dtw-set-row">
      <div className="dtw-set-text">
        <div className="dtw-set-title">思维链窗口 (行数)</div>
        <div className="dtw-set-desc">
          展开后的思维链块限高滚动. 默认 {DEFAULT_LINES} 行, 0 表示不限高, 改动即时生效.
        </div>
      </div>
      <div className="dtw-set-control">
        <button
          type="button"
          className="dtw-set-btn"
          aria-label="减小窗口"
          disabled={value <= MIN_LINES}
          onClick={() => {
            commit(value - 1)
          }}
        >
          -
        </button>
        <input
          type="number"
          className="dtw-set-input"
          min={MIN_LINES}
          max={MAX_LINES}
          step={1}
          value={String(value)}
          aria-label="思维链窗口行数"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            commit(event.currentTarget.value)
          }}
        />
        <button
          type="button"
          className="dtw-set-btn"
          aria-label="增大窗口"
          disabled={value >= MAX_LINES}
          onClick={() => {
            commit(value + 1)
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}
