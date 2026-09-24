import { defineConfig } from 'tsdown'

const PLUGIN_ID = 'dsh-think-window'

export default defineConfig({
  entry: { client: 'src/client/index.ts' },
  format: ['cjs'],
  platform: 'browser',
  outDir: 'lib',
  dts: false,
  clean: false,
  sourcemap: true,
  target: 'es2022',
  fixedExtension: false,
  deps: {
    // 平台模块表里的模块: 运行时由 loader 的 require 提供, 不打进本 bundle.
    neverBundle: [
      'react',
      'react/jsx-runtime',
      'react-dom',
      '@deepseek-ai/cordis',
      '@deepseek-ai/dsh-client-ui-primitives',
    ],
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
})
