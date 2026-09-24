import z from "@deepseek-ai/schemastery";
import { Context, Volatile } from "@deepseek-ai/cordis";
//#region src/shared.d.ts
/** 用户可调的思维链窗口设置. */
interface ThinkWindowSettings {
  /** 展开后的思维链块限高行数. `0` 表示不限高. */
  lines: number;
}
//#endregion
//#region src/index.d.ts
declare const name = "dsh-think-window";
type Config = ThinkWindowSettings;
interface ThinkWindowConfig {
  lines: Volatile<number>;
}
/** Loader / 插件页表单共用的窗口 schema. */
declare const Config: z<Schemastery.ObjectS<NoInfer<{
  lines: z<number, number, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
  lines: z<number, number, "volatile-defined">;
}>>, "plain">;
/**
 * 报告一次装配结果; 行数本身由浏览器半区每次操作时读取.
 * @param ctx - Host 插件上下文.
 * @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
 */
declare function apply(ctx: Context, config: ThinkWindowConfig): void;
//#endregion
export { Config, ThinkWindowConfig, apply, name };
//# sourceMappingURL=index.d.ts.map