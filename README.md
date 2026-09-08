# dsh-think-window

DeepSeek Harness Web 插件: 给对话里展开后的思维链块加上有限高度的内部滚动窗口, 长推理不再把整页撑开. 工具调用和助手正文保持原生显示.

## 效果

- 折叠态仍是原生 Think 一行摘要.
- 展开后正文限高 (默认 10 行), 超出部分在块内滚动, 内容不隐藏.
- 流式输出时, 若滚动条贴着底部会自动跟随最新行; 上翻后暂停, 回到底部再恢复.
- Settings > General 可调行数, `0` 表示不限高, 改动即时生效.

## 安装

在插件目录:

```shell
dsh plugin --profile web add "link:$(pwd)"
```

装完重启 `dsh web`. 卸载: `dsh plugin --profile web remove dsh-think-window`.

## 配置

`cordis.patch.yml` 行配置与 Settings 命名空间 `dsh-think-window` 共用:

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `lines` | `10` | 展开后的窗口高度 (行). `0` 关闭限高 |

## 实现

插件不移动 React 拥有的对话行, 也不替换 `assistant-step` / `tool-call` 渲染. 限高通过稳定的 `[data-variant="think"]` 选择器加在原生展开体上.
