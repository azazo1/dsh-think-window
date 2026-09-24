import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { ThinkWindowKey } from './locales.ts'

/** Client 插件实际用到的 Cordis 面. */
export interface ClientContext {
  logger: {
    info: (...args: unknown[]) => void
    debug: (...args: unknown[]) => void
  }
  configForms: {
    get<T>(entryId: string): ConfigForm<T>
    whileServed(entryIds: readonly string[], register: (served: ReadonlySet<string>) => () => void): () => void
  }
  locale: {
    register(ns: string, dicts: Record<'zh' | 'en', Record<ThinkWindowKey, string>>): () => void
    bind(ns: string): (key: ThinkWindowKey) => string
  }
  slots: {
    inject: (name: string, factory: () => unknown) => () => void
    register: (options: Record<string, unknown>, component: unknown) => unknown
  }
  effect: (callback: () => (() => void) | void, name?: string) => void
}
