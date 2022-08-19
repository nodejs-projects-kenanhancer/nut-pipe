export type Append<A extends unknown[], B extends unknown[] = []> = A extends [...infer Params] ? B extends [...infer Params2] ? [...Params, ...Params2] : never : never;

export type NonOptionalKeys<T> = T extends never ? never : { [k in keyof T]-?: undefined extends T[k] ? never : k }[keyof T];

export type MiddlewareServices<T = unknown> = T & {};

export type NextMiddleware<TParameters extends unknown[], TResult = any> = (...args: TParameters) => Promise<TResult>;

export type Middleware<TParameters extends unknown[], TServices = unknown, TResult = any> = (...args: Append<TParameters, [services: MiddlewareServices<TServices>, next: NextMiddleware<TParameters>]>) => ReturnType<NextMiddleware<TParameters, TResult>>;

export type MiddlewareType<T extends (...args: any[]) => any> = T extends (...args: [...infer I, infer _, infer K]) => any ? K extends NextMiddleware ? I extends Parameters<K> ? T : never : never : never;

export function buildPipeline<TParameters extends unknown[], TServices = unknown>(functions: Array<Middleware<TParameters, TServices>>, services?: MiddlewareServices<TServices>, index?: number): NextMiddleware<TParameters>;
