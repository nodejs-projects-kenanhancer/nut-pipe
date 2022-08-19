import { Append, Middleware } from './base';

import { Context as AzureContext } from '@azure/functions';

export type AzureMiddlewareDefaultParameters<TParameters extends unknown[] = [], TEvent = any> = [] extends TParameters ? Append<[context: AzureContext, event: TEvent], TParameters> : TParameters;

export type AzureDefaultMiddleware<TEvent = any, TParameters extends unknown[] = [], TServices = unknown, TResult = any> = Middleware<AzureMiddlewareDefaultParameters<TParameters, TEvent>, TServices, TResult>;
