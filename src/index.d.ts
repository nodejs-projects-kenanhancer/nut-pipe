import { Context as AzureContext } from '@azure/functions';
import { Context as AwsContext, EventBridgeEvent, APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2, SQSEvent, SNSEvent, SESEvent, S3Event, S3BatchEvent, SecretsManagerRotationEvent, DynamoDBStreamEvent, MSKEvent, ALBEvent, KinesisStreamEvent } from 'aws-lambda';

export type Append<A extends unknown[], B extends unknown[] = []> = A extends [...infer Params] ? B extends [...infer Params2] ? [...Params, ...Params2] : never : never;

export type MiddlewareServices<T = unknown> = T & {};

export type NextMiddleware<TParameters extends unknown[], TResult = any> = (...args: TParameters) => void | Promise<void> | Promise<TResult>;

export type Middleware<TParameters extends unknown[], TServices = unknown, TResult = any> = (...args: Append<TParameters, [services: MiddlewareServices<TServices>, next: NextMiddleware<TParameters>]>) => ReturnType<NextMiddleware<TParameters, TResult>>;

export type MiddlewareType<T extends (...args: any[]) => any> = T extends (...args: [...infer I, infer _, infer K]) => any ? K extends NextMiddleware ? I extends Parameters<K> ? T : never : never : never;

// Azure
export type AzureMiddlewareDefaultParameters<TParameters extends unknown[] = [], TInput = any> = Append<[context: AzureContext, event: TInput], TParameters>;

export type AzureDefaultMiddleware<TParameters extends unknown[] = AzureMiddlewareDefaultParameters, TServices = unknown, TResult = any> = Middleware<AzureMiddlewareDefaultParameters<TParameters>, TServices, TResult>;

// Aws
export type AwsEvent<TEvent = never> = TEvent | APIGatewayProxyEvent | APIGatewayProxyEventV2 | EventBridgeEvent<string, any> | SQSEvent | SNSEvent | SESEvent | S3Event | S3BatchEvent | SecretsManagerRotationEvent | DynamoDBStreamEvent | MSKEvent | ALBEvent | KinesisStreamEvent;

export type AwsMiddlewareDefaultParameters<TParameters extends unknown[] = [], TEvent = AwsEvent> = Append<[event: TEvent, context: AwsContext], TParameters>;

export type AwsDefaultMiddleware<TParameters extends unknown[] = AwsMiddlewareDefaultParameters, TServices = unknown, TResult = APIGatewayProxyResultV2<APIGatewayProxyResult>> = Middleware<AwsMiddlewareDefaultParameters<TParameters>, TServices, TResult>;


export function buildPipeline<TParameters extends unknown[], TServices = unknown>(functions: Array<Middleware<TParameters>>, services?: MiddlewareServices<TServices>, index?: number): NextMiddleware<TParameters>;
