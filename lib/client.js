window.__ModuleLoader__.load({
	id: "dsh-think-window",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/shared.ts
		/** 插件包名, Client loader 注册 id, Loader row 名共用. */
		const PLUGIN_ID = "dsh-think-window";
		/** profile 条目 id: configForms 表单按它寻址, 与包名一致. */
		const ENTRY_ID = PLUGIN_ID;
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
		//#region src/client/locales.ts
		/** 本插件字典的命名空间, 与包名一致. */
		const NS = "dsh-think-window";
		/** English copy. */
		const en = {
			description: "Give the expanded thinking block a bounded scroll window.",
			lines: "Window height (lines)",
			linesHint: "Default 10 lines; 0 removes the cap. Range 0-200.",
			overridden: "Overridden",
			reset: "Reset to default",
			invalid: "Enter a whole number between 0 and 200, or leave blank to use the default.",
			readOnly: "This deployment stores settings read-only.",
			unavailable: "This plugin is not loaded, so it cannot be configured right now.",
			save: "Save",
			saving: "Saving...",
			saveFailed: "The deployment did not accept these values; they were left for you to correct."
		};
		/** Simplified Chinese copy. */
		const zh = {
			description: "给展开后的思维链块一个有限高度的滚动窗口.",
			lines: "窗口高度 (行)",
			linesHint: "默认 10 行, 0 表示不限高, 取值范围 0-200.",
			overridden: "已覆盖",
			reset: "恢复默认",
			invalid: "请填 0 到 200 之间的整数; 留空表示使用默认值.",
			readOnly: "本部署的设置为只读.",
			unavailable: "该插件当前未加载, 暂时无法配置.",
			save: "保存",
			saving: "保存中...",
			saveFailed: "本部署没有接受这些值, 已保留供你修改."
		};
		/**
		* 表单框架要的文案, 从本插件字典取.
		* @param t - 本插件字典的读取函数.
		* @returns 共享设置表单渲染的标签.
		*/
		function formLabels(t) {
			return {
				unavailable: t("unavailable"),
				readOnly: t("readOnly"),
				saveFailed: t("saveFailed"),
				save: t("save"),
				saving: t("saving")
			};
		}
		//#endregion
		//#region src/client/settings-card.tsx
		/**
		* 渲染本行的一行简介或配置表单, 由插件页的 view 决定.
		* @param props - 页面要的视图, 字典, 表单快照与动作.
		* @returns 简介文本或配置表单.
		*/
		function ThinkWindowSettingsCard(props) {
			const { t } = props;
			const state = props.useThinkWindowCard((snapshot) => snapshot);
			if (props.view === "summary") return t("description");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.SettingsForm, {
				labels: formLabels(t),
				state,
				onSave: props.save,
				onDiscard: props.discard,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.SettingsValueField, {
					id: "plugin-config-think-window-lines",
					label: t("lines"),
					hint: t("linesHint"),
					overriddenLabel: t("overridden"),
					resetLabel: t("reset"),
					invalidLabel: t("invalid"),
					numeric: true,
					disabled: !state.writable,
					...state.lines,
					onEdit: (text) => {
						props.edit(LINES_FIELD, text);
					},
					onReset: () => {
						props.resetField(LINES_FIELD);
					}
				})
			});
		}
		//#endregion
		//#region src/client/settings-form.ts
		/** 把本插件条目的配置表单桥接成配置卡片的暂存表单. */
		var ThinkWindowSettingsForm = class {
			form;
			store;
			/**
			* @param scope - 本插件 profile 条目的共享配置表单 (ctx.configForms.get).
			*/
			constructor(scope) {
				this.form = new _deepseek_ai_dsh_client_ui_primitives.SettingsFormModel(scope, [(0, _deepseek_ai_dsh_client_ui_primitives.settingsNumberField)(LINES_FIELD)]);
				this.store = this.form.bind(() => ({
					...this.form.shell(),
					lines: this.form.field(LINES_FIELD)
				}));
			}
			/**
			* 构造 slot 注册要注入的面.
			* @returns 快照 hook 与表单动作.
			*/
			inject() {
				return {
					hooks: { thinkWindowCard: this.store },
					...this.form.actions()
				};
			}
			/** 释放对配置表单的订阅. */
			dispose() {
				this.form.dispose();
			}
		};
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
		* @param lines - 当前行数, `0` 关闭限高.
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
		const inject = [
			"slots",
			"locale",
			"configForms"
		];
		/** 当前生效的窗口行数, 条目尚未送达时用默认值. */
		function liveLines(scope) {
			return scope.getSnapshot().value?.["lines"] ?? 10;
		}
		/**
		* 注入样式, 订阅窗口行数, 并挂上插件页的卡片配置.
		* @param ctx - Web Client 插件上下文.
		*/
		function apply(ctx) {
			ctx.logger.info("dsh-think-window: client applying");
			injectStyles();
			const scope = ctx.configForms.get(ENTRY_ID);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-think-window: dictionaries");
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
			const card = new ThinkWindowSettingsForm(scope);
			ctx.effect(() => () => {
				card.dispose();
			}, "dsh-think-window: settings form");
			ctx.effect(() => ctx.configForms.whileServed([ENTRY_ID], () => ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
				name: "plugins.bundle.config",
				key: PLUGIN_ID,
				locale: NS,
				inject: () => card.inject()
			}, ThinkWindowSettingsCard))), "dsh-think-window: plugins page card");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map