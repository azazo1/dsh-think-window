import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pluginId = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name
const code = readFileSync(join(root, 'lib/client.js'), 'utf8')

if (/^\s*import\s/m.test(code)) {
  throw new Error('client bundle still has a top-level ESM import')
}
if (/\bexport\s/.test(code)) {
  throw new Error('client bundle still has an ESM export')
}

if (!code.includes('__ModuleLoader__.load') || !code.includes(`id: "${pluginId}"`)) {
  throw new Error(`client bundle is missing __ModuleLoader__.load id ${pluginId}`)
}

let handoff
const sandbox = {
  window: {
    __ModuleLoader__: {
      load(next) {
        handoff = next
      },
    },
  },
}
sandbox.window.window = sandbox.window
vm.runInNewContext(code, sandbox, { filename: 'client.js' })

if (handoff === undefined) {
  throw new Error('client bundle did not register via __ModuleLoader__.load')
}
if (handoff.id !== pluginId) {
  throw new Error(`registered id ${handoff.id} !== ${pluginId}`)
}

const require = createRequire(import.meta.url)
// 平台模块表里的依赖: 运行时由 loader 的 require 提供. react 用本机安装的同一份顶替,
// 界面控件这里只要形状存在即可 — 本脚本校验的是 loader 注册, 真实挂载在运行中的 web 实例里验证.
const componentStub = () => null
const platformModules = new Map([
  ['react', () => require('react')],
  ['react/jsx-runtime', () => require('react/jsx-runtime')],
  ['@deepseek-ai/dsh-client-ui-primitives', () => ({
    SettingsForm: componentStub,
    SettingsValueField: componentStub,
  })],
])
const exports = handoff.factory((spec) => {
  const load = platformModules.get(spec)
  if (load === undefined) throw new Error(`unexpected require: ${spec}`)
  return load()
})

if (typeof exports.apply !== 'function') {
  throw new Error('factory did not export apply')
}
for (const service of ['slots', 'locale', 'configForms']) {
  if (!Array.isArray(exports.inject) || !exports.inject.includes(service)) {
    throw new Error(`unexpected inject: ${JSON.stringify(exports.inject)}`)
  }
}

console.log('dsh-think-window: client loader registration ok')
