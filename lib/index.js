import z from "@deepseek-ai/schemastery";
//#region src/shared.ts
/** 插件包名, Client loader 注册 id, Loader row 名共用. */
const PLUGIN_ID = "dsh-think-window";
/** Host Cordis 插件名. */
const PLUGIN_NAME = PLUGIN_ID;
/** 持久化 settings 命名空间, 与插件名一致. */
const SETTINGS_NAMESPACE = PLUGIN_ID;
//#endregion
//#region src/index.ts
const name = PLUGIN_NAME;
/** Loader / settings 共用的窗口 schema. */
const Config = z.object({ lines: z.number().step(1).min(0).max(200).default(10) });
/**
* 在 settings 服务可用时挂上命名空间, 并把 cordis.yml 行配置作为 composition 底.
* @param ctx - Host 插件上下文.
* @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
*/
function apply(ctx, config) {
	const resolved = Config(config);
	ctx.logger.info("dsh-think-window: host loaded, default lines=%d", resolved.lines);
	ctx.inject(["settings"], (settingsCtx) => {
		let source = () => resolved;
		settingsCtx.settings.installSection(ctx, SETTINGS_NAMESPACE, Config, resolved, {
			setSource: (current) => {
				source = current;
			},
			onChange: () => {
				const next = source();
				settingsCtx.logger.info("dsh-think-window: settings lines=%d", next.lines);
			}
		});
	});
}
//#endregion
export { Config, apply, name };

//# sourceMappingURL=index.js.map