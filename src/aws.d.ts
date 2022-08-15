import { Append, Middleware, NonOptionalKeys } from './base';

import { Context as AwsContext, APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2, EventBridgeEvent, SQSEvent, SNSEvent, SESEvent, S3Event, S3BatchEvent, SecretsManagerRotationEvent, DynamoDBStreamEvent, MSKEvent, ALBEvent, KinesisStreamEvent } from 'aws-lambda';

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
