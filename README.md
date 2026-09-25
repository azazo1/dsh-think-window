# dsh-think-window

DeepSeek Harness Web 插件: 给对话里展开后的思维链块加上有限高度的内部滚动窗口, 长推理不再把整页撑开. 工具调用和助手正文保持原生显示.

## 效果

- 折叠态仍是原生 Think 一行摘要.
- 展开后正文限高 (默认 10 行), 超出部分在块内滚动, 内容不隐藏.
- 块内滚到上下限后继续滚动会接着滚动外层会话, 不会被窗口卡住.
- 流式输出时, 若滚动条贴着底部会自动跟随最新行; 上翻后暂停, 回到底部再恢复.
- Settings > General 可调行数, `0` 表示不限高, 改动即时生效.

## 安装

Web 端装进 `web` profile:

```shell
dsh plugin --profile web add azazo1/dsh-think-window
```

本地 checkout 可以直接装目录:

```shell
dsh plugin --profile web add "link:$(pwd)"
```

装完重启 `dsh web`, 浏览器里刷新一次页面. 卸载: `dsh plugin --profile web remove dsh-think-window`.

桌面端装进 `desktop` profile. 它由 Electron 应用独占管理, `dsh plugin` 会拒绝 `--profile desktop`, 所以要用应用内的插件管理器: 在插件页的安装入口填上面命令里对应的包名或本地目录. 装上后重启应用, 窗口刷新一次.

引擎版本线要求 `@deepseek-ai/dsh-*` 不低于 `0.1.7-rc.2`, 且仍在 `0.1.x` 上 (devDependencies 写作 `>=0.1.7-rc.2 <0.2.0`). 更早的引擎线装不上这个版本.

web 与 desktop 两个 profile 跑的是同一套 Web 应用, 桌面端只是多起一个 Host 子进程并给 `<html>` 打上平台标记, 所以同一份包在两边通用, 不需要分别构建.

## 配置

`cordis.patch.yml` 行配置与 Settings 命名空间 `dsh-think-window` 共用:

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `lines` | `10` | 展开后的窗口高度 (行). `0` 关闭限高 |

## 实现

插件不移动 React 拥有的对话行, 也不替换 `assistant-step` / `tool-call` 渲染. 限高通过稳定的 `[data-variant="think"]` 选择器加在原生展开体上, 样式里不设 `overscroll-behavior`, 滚动链交给浏览器默认行为.

样式标签带 `data-plugin` / `data-plugin-css` 标记, 与 DSH Client module system 的样式记账对齐; 卸载或热替换时插件在自己的 effect 里移除样式, 并清掉文档根上的限高属性与行数变量, 已展开的 Think 块随即回到原生显示.
