import z from "@deepseek-ai/schemastery";
//#endregion
//#region src/index.ts
const name = "dsh-think-window";
/** Loader / 插件页表单共用的窗口 schema. */
const Config = z.object({ lines: z.number().step(1).min(0).max(200).default(10).volatile() });
/**
* 报告一次装配结果; 行数本身由浏览器半区每次操作时读取.
* @param ctx - Host 插件上下文.
* @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
*/
function apply(ctx, config) {
	ctx.logger.info("dsh-think-window: host loaded, default lines=%d", config.lines.get());
}
//#endregion
export { Config, apply, name };

//# sourceMappingURL=index.js.map