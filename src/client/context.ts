import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'

/** Client 插件实际用到的 Cordis 面. */
export interface ClientContext {
  logger: {
    info: (...args: unknown[]) => void
    debug: (...args: unknown[]) => void
  }
  configForms: { get<T>(namespace: string): ConfigForm<T> }
  slots: {
    inject: (name: string, factory: () => unknown) => void
    register: (options: Record<string, unknown>, component: unknown) => unknown
  }
  effect: (callback: () => (() => void) | void, name?: string) => void
}
