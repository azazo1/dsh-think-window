import z from "@deepseek-ai/schemastery";
import { Context } from "@deepseek-ai/cordis";
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
/** Loader / settings 共用的窗口 schema. */
declare const Config: z<ThinkWindowSettings>;
/**
 * 在 settings 服务可用时挂上命名空间, 并把 cordis.yml 行配置作为 composition 底.
 * @param ctx - Host 插件上下文.
 * @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
 */
declare function apply(ctx: Context, config?: ThinkWindowSettings): void;
//#endregion
export { Config, apply, name };
//# sourceMappingURL=index.d.ts.map