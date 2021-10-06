// Type definitions for nut-pipe 1.1
// Project: https://github.com/nodejs-projects-kenanhancer/nut-pipe
// Definitions by: kenan hancer <https://github.com/kenanhancer>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


import { Context, Callback, APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyResult, EventBridgeEvent } from "aws-lambda";

export type AsyncBasicHandler<TEvent = any, TResult = any> = (event: TEvent) => Promise<TResult | Error>;

export type AsyncBasicMiddleware<TEvent = any, T extends AsyncBasicHandler = AsyncBasicHandler<TEvent>> =
    T extends AsyncBasicHandler<TEvent, infer TResult> ?
    (event: TEvent, next: T) => Promise<TResult> :
    never;

export type AsyncBasicMiddlewareWithServices<TEvent = any, TServices = Record<string, any>, T extends AsyncBasicHandler = AsyncBasicHandler<TEvent>> =
    T extends AsyncBasicHandler<TEvent, infer TResult> ?
    (event: TEvent, services: TServices, next: T) => Promise<TResult | Error> :
    never;

export type EventType = APIGatewayProxyEvent | APIGatewayProxyEventV2 | EventBridgeEvent<string, any> | unknown;

export type ResultType = APIGatewayProxyResultV2 | APIGatewayProxyResult | unknown;

export type AsyncLambdaHandler<TEvent extends EventType = APIGatewayProxyEventV2, TResult extends ResultType = APIGatewayProxyResultV2> =
    (event: TEvent, context?: Context, callback?: Callback<TResult>) => Promise<TResult | Error | void>;

export type AsyncLambdaMiddleware<TEvent extends EventType = APIGatewayProxyEventV2, TResult extends ResultType = APIGatewayProxyResultV2, T = AsyncLambdaHandler<TEvent, TResult>> =
    T extends AsyncLambdaHandler<TEvent, TResult> ?
    (event: TEvent, context?: Context, callback?: Callback<TResult>, next?: T) => void | Promise<TResult | Error | void> :
    never;

export type AsyncLambdaMiddlewareWithServices<TEvent extends EventType = APIGatewayProxyEventV2, TResult extends ResultType = APIGatewayProxyResultV2, TServices = Record<string, any>, T = AsyncLambdaHandler<TEvent>> =
    T extends AsyncLambdaHandler<TEvent, TResult> ?
    (event: TEvent, context?: Context, callback?: Callback<TResult>, services?: TServices, next?: T) => void | Promise<TResult | Error | void> :
    never;

export type AsyncHandler = AsyncBasicHandler & AsyncLambdaHandler;

export type AsyncMiddleware<T = never> =
    AsyncBasicMiddleware |
    AsyncBasicMiddlewareWithServices |
    AsyncLambdaMiddleware<any, any> |
    AsyncLambdaMiddlewareWithServices<any, any> |
    T;

export function buildPipeline(functions: Array<AsyncMiddleware<any>>, services?: Record<string, any>, index?: number): AsyncHandler;
