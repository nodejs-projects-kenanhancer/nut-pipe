import { buildPipeline, AwsDefaultMiddleware } from "../src";
import { isAwsEvent } from "../src/aws";
import { createEventBridgeEvent, createContext } from "./mocks/aws";

describe('NUT-PIPE AWS Lambda Function tests for TypeScript', () => {
    it('AWS Lambda Function Test with async', async () => {

        type MiddlewareServices = {
            elapsedMilliseconds?: number;
            validateRequest?: boolean;
            validateResponse?: boolean;
        };

        const errorMiddleware: AwsDefaultMiddleware = jest.fn(async (event, context, _, next) => {

            return await next(event, context);
        });

        const corsMiddleware: AwsDefaultMiddleware = jest.fn(async (event, context, _, next) => {

            return await next(event, context);
        });

        const logMiddleware: AwsDefaultMiddleware<'All', [], MiddlewareServices> = jest.fn(async (event, context, _, next) => {

            return await next(event, context);
        });

        const timingMiddleware: AwsDefaultMiddleware = jest.fn(async (event, context, _, next) => {

            return await next(event, context);
        });

        const jsonBodyParser: AwsDefaultMiddleware = jest.fn(async (event, context, _, next) => {

            let data;

            if (isAwsEvent<'APIGatewayProxyEvent'>(event, 'path')
                || isAwsEvent<'APIGatewayProxyEventV2'>(event, 'rawPath')
                || isAwsEvent<'ALBEvent'>(event, 'body')) {

                let parsedBody;
                try { parsedBody = event.body && JSON.parse(event.body); }
                catch (error: any) { throw new Error('invalid body, expected JSON'); }

                data = parsedBody;

            } else if (isAwsEvent<'EventBridgeEvent'>(event, 'detail-type')) {

                data = event.detail;

            } else if (isAwsEvent<'SQSEvent'>(event, 'Records')
                || isAwsEvent<'SNSEvent'>(event, 'Records')
                || isAwsEvent<'SESEvent'>(event, 'Records')
                || isAwsEvent<'S3Event'>(event, 'Records')
                || isAwsEvent<'DynamoDBStreamEvent'>(event, 'Records')
                || isAwsEvent<'KinesisStreamEvent'>(event, 'Records')) {

                data = event.Records;

            } else if (isAwsEvent<'MSKEvent'>(event, 'records')) {

                data = event.records;
            }

            return await next(data, context);
        });

        const awsLambdaFunctionTriggeredByEventBridgeMiddleware: AwsDefaultMiddleware = jest.fn(async (event, _) => {

            const message = `Event detail is ${event}`;

            return { statusCode: 200, body: message };
        });

        const proxyFn = buildPipeline([errorMiddleware, corsMiddleware, logMiddleware, timingMiddleware, jsonBodyParser, awsLambdaFunctionTriggeredByEventBridgeMiddleware]);

        const args = { firstName: "Kenan", lastName: "Hancer" };

        const event = createEventBridgeEvent('string', JSON.stringify(args));

        const context = createContext();

        const response = await proxyFn(event, context); // response: { statusCode: 200, body: 'Event detail is { firstName: "Kenan", lastName: "Hancer" }' }

        expect(response.body).toEqual(`Event detail is ${JSON.stringify(args)}`);

        expect(response.statusCode).toEqual(200);

        expect(errorMiddleware).toHaveBeenCalledTimes(1);

        expect(errorMiddleware).toHaveBeenCalledWith(event, context, expect.any(Object), expect.any(Function));

        expect(corsMiddleware).toHaveBeenCalledTimes(1);

        expect(corsMiddleware).toHaveBeenCalledWith(event, context, expect.any(Object), expect.any(Function));

        expect(logMiddleware).toHaveBeenCalledTimes(1);

        expect(logMiddleware).toHaveBeenCalledWith(event, context, expect.any(Object), expect.any(Function));

        expect(jsonBodyParser).toHaveBeenCalledTimes(1);

        expect(jsonBodyParser).toHaveBeenCalledWith(event, context, expect.any(Object), expect.any(Function));

        expect(awsLambdaFunctionTriggeredByEventBridgeMiddleware).toHaveBeenCalledTimes(1);

        expect(awsLambdaFunctionTriggeredByEventBridgeMiddleware).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    });

    it('AWS Lambda Function Test without async', async () => {

        type MiddlewareServices = {
            elapsedMilliseconds?: number;
            validateRequest?: boolean;
            validateResponse?: boolean;
        };

        const errorMiddleware: AwsDefaultMiddleware = jest.fn((event, context, _, next) => {

            return next(event, context);
        });

        const corsMiddleware: AwsDefaultMiddleware = jest.fn((event, context, _, next) => {

            return next(event, context);
        });

        const logMiddleware: AwsDefaultMiddleware<'All', [], MiddlewareServices> = jest.fn((event, context, _, next) => {

            return next(event, context);
        });

        const timingMiddleware: AwsDefaultMiddleware = jest.fn((event, context, _, next) => {

            return next(event, context);
        });

        const jsonBodyParser: AwsDefaultMiddleware = jest.fn((event, context, _, next) => {

            return next(event, context);
        });

        const awsLambdaFunctionTriggeredByEventBridgeMiddleware: AwsDefaultMiddleware<'EventBridgeEvent'> = jest.fn((event, _) => {

            const message = `Event detail is ${event['detail']}`;

            return { statusCode: 200, body: message } as any;
        });

        const proxyFn = buildPipeline([errorMiddleware, corsMiddleware, logMiddleware, timingMiddleware, jsonBodyParser, awsLambdaFunctionTriggeredByEventBridgeMiddleware]);

        const args = { firstName: "Kenan", lastName: "Hancer" };

        const event = createEventBridgeEvent('string', JSON.stringify(args));

        const context = createContext();

        const response = await proxyFn(event, context); // response: { statusCode: 200, body: 'Event detail is { firstName: "Kenan", lastName: "Hancer" }' }

        expect(response.body).toEqual(`Event detail is ${JSON.stringify(args)}`);

        expect(response.statusCode).toEqual(200);

        expect(errorMiddleware).toHaveBeenCalledTimes(1);

        expect(errorMiddleware).toHaveBeenCalledWith(event, context, expect.any(Object), expect.any(Function));

        expect(corsMiddleware).toHaveBeenCalledTimes(1);

        expect(corsMiddleware).toHaveBeenCalledWith(event, context, expect.any(Object), expect.any(Function));

        expect(logMiddleware).toHaveBeenCalledTimes(1);

        expect(logMiddleware).toHaveBeenCalledWith(event, context, expect.any(Object), expect.any(Function));

        expect(jsonBodyParser).toHaveBeenCalledTimes(1);

        expect(jsonBodyParser).toHaveBeenCalledWith(event, context, expect.any(Object), expect.any(Function));

        expect(awsLambdaFunctionTriggeredByEventBridgeMiddleware).toHaveBeenCalledTimes(1);

        expect(awsLambdaFunctionTriggeredByEventBridgeMiddleware).toHaveBeenCalledWith(event, expect.any(Object));
    });
});