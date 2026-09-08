window.__ModuleLoader__.load({
	id: "dsh-think-window",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/shared.ts
		/** 插件包名, Client loader 注册 id, Loader row 名共用. */
		const PLUGIN_ID = "dsh-think-window";
		/** 持久化 settings 命名空间, 与插件名一致. */
		const SETTINGS_NAMESPACE = PLUGIN_ID;
		/** 窗口高度字段名. */
		const LINES_FIELD = "lines";
		/** 注入样式的标记, 避免重复插入. */
		const STYLE_ATTR = "data-plugin-css";
		/** 注入样式的 id. */
		const STYLE_ID = "dsh-think-window";
		/** 文档根上的限高开关属性. */
		const CAPPED_ATTR = "data-dsh-think-window-capped";
		/** 行数 CSS 变量. */
		const LINES_VAR = "--dsh-think-window-lines";
		/**
		* 把未知值夹到合法行数.
		* @param value - 用户输入或 settings 原始值.
		* @returns 夹紧后的整数行数.
		*/
		function clampLines(value) {
			const n = typeof value === "number" ? value : Number(value);
			if (!Number.isFinite(n)) return 10;
			return Math.min(200, Math.max(0, Math.round(n)));
		}
		/**
		* 把 Host 返回的未知 section 解码成类型化设置.
		* 非对象返回 `undefined`, 保留上一次已接受值; 对象字段异常则回退默认行数.
		* @param section - settings namespace 的原始 section.
		* @returns 解码后的设置, 或 `undefined`.
		*/
		function decodeThinkWindowSettings(section) {
			if (typeof section !== "object" || section === null) return void 0;
			const lines = section[LINES_FIELD];
			return { lines: clampLines(lines) };
		}
		/**
		* 判断滚动容器是否贴着底部, 用于流式输出时的跟随.
		* @param scrollTop - 当前滚动位置.
		* @param scrollHeight - 内容高度.
		* @param clientHeight - 可见高度.
		* @param slop - 贴底判定余量.
		* @returns 是否视为贴着底部.
		*/
		function isNearBottom(scrollTop, scrollHeight, clientHeight, slop = 32) {
			return scrollHeight - scrollTop - clientHeight <= slop;
		}
		//#endregion
		//#region src/client/follow.ts
		/** 正在流式输出且已展开的 Think 体. */
		const BODY_SELECTOR = ["[data-variant=\"think\"][data-expanded][data-state=\"running\"]", "[data-open] > :not([data-disclosure-row])"].join(" ");
		/**
		* 跟随流式思维链: 用户贴着底部时自动滚到最新行, 上翻则暂停, 回到底部再恢复.
		* 不移动 React 拥有的行节点, 只改 thinkBody 的 scrollTop.
		* @returns 取消观察与监听的 disposer.
		*/
		function startThinkFollow() {
			if (typeof document === "undefined" || document.body === null) return () => {};
			const following = /* @__PURE__ */ new WeakMap();
			let frame = 0;
			const scan = () => {
				const bodies = document.querySelectorAll(BODY_SELECTOR);
				for (let i = 0; i < bodies.length; i++) {
					const node = bodies.item(i);
					if (!(node instanceof HTMLElement)) continue;
					if (following.get(node) === false) continue;
					following.set(node, true);
					node.scrollTop = node.scrollHeight;
				}
			};
			const schedule = () => {
				if (frame !== 0) return;
				frame = requestAnimationFrame(() => {
					frame = 0;
					scan();
				});
			};
			const onScroll = (event) => {
				const target = event.target;
				if (!(target instanceof HTMLElement)) return;
				if (!target.matches(BODY_SELECTOR)) return;
				following.set(target, isNearBottom(target.scrollTop, target.scrollHeight, target.clientHeight));
			};
			scan();
			const observer = new MutationObserver(() => {
				schedule();
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true,
				characterData: true
			});
			document.addEventListener("scroll", onScroll, true);
			return () => {
				observer.disconnect();
				document.removeEventListener("scroll", onScroll, true);
				if (frame !== 0) cancelAnimationFrame(frame);
				frame = 0;
			};
		}
		//#endregion
		//#region src/client/settings-row.tsx
		function currentLines(scope) {
			return scope.getSnapshot().value?.lines ?? 10;
		}
		/**
		* Settings > General 中的思维链窗口行数调节行.
		* @param props.scope - Host 命名空间的浏览器镜像.
		*/
		function ThinkWindowSettingsRow({ scope }) {
			const value = clampLines((0, react.useSyncExternalStore)((onChange) => scope.subscribe(onChange), () => currentLines(scope)));
			const commit = (next) => {
				const n = clampLines(next);
				scope.set(LINES_FIELD, n);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dtw-set-row",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dtw-set-text",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dtw-set-title",
						children: "思维链窗口 (行数)"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dtw-set-desc",
						children: [
							"展开后的思维链块限高滚动. 默认 ",
							10,
							" 行, 0 表示不限高, 改动即时生效."
						]
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dtw-set-control",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dtw-set-btn",
							"aria-label": "减小窗口",
							disabled: value <= 0,
							onClick: () => {
								commit(value - 1);
							},
							children: "-"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "number",
							className: "dtw-set-input",
							min: 0,
							max: 200,
							step: 1,
							value: String(value),
							"aria-label": "思维链窗口行数",
							onChange: (event) => {
								commit(event.currentTarget.value);
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dtw-set-btn",
							"aria-label": "增大窗口",
							disabled: value >= 200,
							onClick: () => {
								commit(value + 1);
							},
							children: "+"
						})
					]
				})]
			});
		}
		//#endregion
		//#region src/client/styles.ts
		/**
		* 只约束原生 Think 展开体.
		*
		* 选择器走稳定的 data 属性, 不依赖 CSS Module 哈希类名:
		* `[data-variant="think"]` 是 ReasoningRow 根,
		* `[data-open] > :not([data-disclosure-row])` 是展开后的 thinkBody.
		* 工具调用和助手正文都不匹配.
		*/
		const CSS_TEXT = `
html[${CAPPED_ATTR}="1"] [data-variant="think"][data-expanded] [data-open] > :not([data-disclosure-row]) {
  max-height: calc(var(${LINES_VAR}, 10) * (20px + var(--dsh-content-font-delta-secondary, 0px)) + 8px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.dtw-set-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dtw-set-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 48px;
}

.dtw-set-title {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.dtw-set-desc {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

.dtw-set-control {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}

.dtw-set-btn {
  height: 36px;
  min-width: 36px;
  padding: 0 10px;
  border: none;
  border-radius: 18px;
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-label-primary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.dtw-set-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dtw-set-btn:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}

.dtw-set-btn:disabled {
  color: var(--dsw-alias-label-caption);
  cursor: default;
}

.dtw-set-input {
  width: 64px;
  height: 36px;
  padding: 0 12px;
  text-align: center;
  border: none;
  border-radius: 18px;
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
}

.dtw-set-input:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dtw-set-input:focus,
.dtw-set-input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary);
}

@media (max-width: 640px) {
  .dtw-set-row {
    flex-direction: column;
    align-items: stretch;
  }

  .dtw-set-text {
    padding-right: 0;
  }

  .dtw-set-control {
    width: 100%;
  }

  .dtw-set-input {
    flex: 1;
    width: 100%;
  }
}
`.trim();
		/**
		* 把插件样式注入 document, 重复调用是空操作.
		*/
		function injectStyles() {
			if (typeof document === "undefined") return;
			if (document.querySelector(`style[data-plugin-css="dsh-think-window"]`) !== null) return;
			const style = document.createElement("style");
			style.setAttribute(STYLE_ATTR, STYLE_ID);
			style.textContent = CSS_TEXT;
			document.head.appendChild(style);
		}
		/**
		* 把当前窗口行数写到文档根, 已渲染的 Think 块立即改高度.
		* @param lines - 夹紧后的行数, `0` 关闭限高.
		*/
		function applyWindowLines(lines) {
			if (typeof document === "undefined") return;
			const root = document.documentElement;
			root.style.setProperty(LINES_VAR, String(lines));
			if (lines > 0) root.setAttribute(CAPPED_ATTR, "1");
			else root.removeAttribute(CAPPED_ATTR);
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* dsh-think-window 浏览器半区.
		*
		* 只给原生思维链展开体加有限高度的内部滚动, 不重挂对话行, 不包工具调用, 不包助手正文.
		*/
		const inject = ["slots", "settingsScope"];
		function liveLines(scope) {
			return scope?.getSnapshot().value?.lines ?? 10;
		}
		/**
		* 注入样式, 订阅窗口行数, 并挂上 Settings 行.
		* @param ctx - Web Client 插件上下文.
		*/
		function apply(ctx) {
			ctx.logger.info("dsh-think-window: client applying");
			injectStyles();
			const scope = ctx.settingsScope.bind({
				namespace: SETTINGS_NAMESPACE,
				decode: decodeThinkWindowSettings
			});
			ctx.effect(() => {
				const sync = () => {
					const lines = liveLines(scope);
					applyWindowLines(lines);
					ctx.logger.debug("dsh-think-window: window lines=%d", lines);
				};
				sync();
				const unsub = scope.subscribe(sync);
				const stopFollow = startThinkFollow();
				return () => {
					unsub();
					stopFollow();
				};
			}, "dsh-think-window: window");
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: PLUGIN_ID,
				order: 80
			}, () => (0, react.createElement)(ThinkWindowSettingsRow, { scope })));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map