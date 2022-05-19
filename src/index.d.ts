import { Context as AzureContext } from '@azure/functions';
import { Context as AwsContext, APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2, EventBridgeEvent, SQSEvent, SNSEvent, SESEvent, S3Event, S3BatchEvent, SecretsManagerRotationEvent, DynamoDBStreamEvent, MSKEvent, ALBEvent, KinesisStreamEvent } from 'aws-lambda';

export type Append<A extends unknown[], B extends unknown[] = []> = A extends [...infer Params] ? B extends [...infer Params2] ? [...Params, ...Params2] : never : never;

export type NonOptionalKeys<T> = T extends never ? never : { [k in keyof T]-?: undefined extends T[k] ? never : k }[keyof T];

export type MiddlewareServices<T = unknown> = T & {};

export type NextMiddleware<TParameters extends unknown[], TResult = any> = (...args: TParameters) => Promise<TResult>;

export type Middleware<TParameters extends unknown[], TServices = unknown, TResult = any> = (...args: Append<TParameters, [services: MiddlewareServices<TServices>, next: NextMiddleware<TParameters>]>) => ReturnType<NextMiddleware<TParameters, TResult>>;

export type MiddlewareType<T extends (...args: any[]) => any> = T extends (...args: [...infer I, infer _, infer K]) => any ? K extends NextMiddleware ? I extends Parameters<K> ? T : never : never : never;

// Azure
export type AzureMiddlewareDefaultParameters<TParameters extends unknown[] = [], TEvent = any> = Append<[context: AzureContext, event: TEvent], TParameters>;

export type AzureDefaultMiddleware<TEvent = any, TParameters extends unknown[] = [], TServices = unknown, TResult = any> = Middleware<AzureMiddlewareDefaultParameters<TParameters, TEvent>, TServices, TResult>;


// Aws
export type AwsEventTypeKeys = 'All' | 'APIGatewayProxyEvent' | 'APIGatewayProxyEventV2' | 'EventBridgeEvent' | 'SQSEvent' | 'SNSEvent' | 'SESEvent' | 'S3Event' | 'S3BatchEvent' | 'SecretsManagerRotationEvent' | 'DynamoDBStreamEvent' | 'MSKEvent' | 'ALBEvent' | 'KinesisStreamEvent';

export type AwsEvent<TEvent = never> = TEvent | APIGatewayProxyEvent | APIGatewayProxyEventV2 | EventBridgeEvent<string, any> | SQSEvent | SNSEvent | SESEvent | S3Event | S3BatchEvent | SecretsManagerRotationEvent | DynamoDBStreamEvent | MSKEvent | ALBEvent | KinesisStreamEvent;

export type AwsEventType<TEventType extends AwsEventTypeKeys = 'All'> =
    TEventType extends 'All' ? AwsEvent :
    TEventType extends 'APIGatewayProxyEvent' ? APIGatewayProxyEvent :
    TEventType extends 'APIGatewayProxyEventV2' ? APIGatewayProxyEventV2 :
    TEventType extends 'EventBridgeEvent' ? EventBridgeEvent<string, any> :
    TEventType extends 'SQSEvent' ? SQSEvent :
    TEventType extends 'SNSEvent' ? SNSEvent :
    TEventType extends 'SESEvent' ? SESEvent :
    TEventType extends 'S3Event' ? S3Event :
    TEventType extends 'S3BatchEvent' ? S3BatchEvent :
    TEventType extends 'SecretsManagerRotationEvent' ? SecretsManagerRotationEvent :
    TEventType extends 'DynamoDBStreamEvent' ? DynamoDBStreamEvent :
    TEventType extends 'MSKEvent' ? MSKEvent :
    TEventType extends 'ALBEvent' ? ALBEvent :
    TEventType extends 'KinesisStreamEvent' ? KinesisStreamEvent :
    unknown;

export type AwsMiddlewareDefaultParameters<TParameters extends unknown[] = [], TEvent = AwsEvent> = Append<[event: TEvent, context: AwsContext], TParameters>;

export type AwsDefaultMiddleware<TEventType extends AwsEventTypeKeys = 'All', TParameters extends unknown[] = [], TServices = unknown, TResult = APIGatewayProxyResultV2<APIGatewayProxyResult>> = Middleware<AwsMiddlewareDefaultParameters<TParameters, AwsEventType<TEventType>>, TServices, TResult>;

export const isAwsEvent = <TEventType extends AwsEventTypeKeys = 'All', TEvent extends AwsEvent = AwsEventType<TEventType>>(event: AwsEvent, fieldName: NonOptionalKeys<TEvent>): event is TEvent => fieldName in event;


export function buildPipeline<TParameters extends unknown[], TServices = unknown>(functions: Array<Middleware<TParameters>>, services?: MiddlewareServices<TServices>, index?: number): NextMiddleware<TParameters>;
