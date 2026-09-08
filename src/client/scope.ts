/** 浏览器 settings scope 的最小契约, 避免把 UI 包打进 Client bundle. */
export interface SettingsScopeSnapshot<T> {
  value: T | undefined
}

export interface SettingsScope<T> {
  getSnapshot(): SettingsScopeSnapshot<T>
  subscribe(listener: () => void): () => void
  set(field: string, value: unknown): Promise<void>
}

export interface SettingsScopeService {
  bind<T>(spec: {
    namespace: string
    decode?: (section: unknown) => T | undefined
  }): SettingsScope<T>
}
