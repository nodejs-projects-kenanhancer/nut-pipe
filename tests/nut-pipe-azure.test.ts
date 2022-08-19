import { buildPipeline, AzureDefaultMiddleware } from "../src";
import { createInputDataForHttp, createContext } from "./mocks/azure";
import { greetingService } from "./mocks/services";

describe('NUT-PIPE Azure Function tests for TypeScript', () => {
    it('Azure Function Test', async () => {

        const services = { greetingService };

        type MiddlewareServices = typeof services;

        const errorMiddleware: AzureDefaultMiddleware = jest.fn(async (context, inputData, _, next) => {

            let result;
            try {

                result = await next(context, inputData);

            } catch (error) {

                const { executionContext: { functionName, invocationId } } = context;

                const log = { functionName, invocationId };
                const logJson = JSON.stringify(log);

                context.log.error(`ERROR: ${logJson}`, error);

                throw error;
            }

            return result;
        });

        const corsMiddleware: AzureDefaultMiddleware = jest.fn(async (context, inputData, _, next) => {

            const response = await next(context, inputData);

            const { type } = context.bindingDefinitions.find(def => def.direction === 'in')!;

            if (type === 'httpTrigger') {
                context.res = {
                    status: 200,
                    body: response,
                    headers: { 'Access-Control-Allow-Origin': "*", "Access-Control-Allow-Credentials": false }
                };
            }

            return response;
        });

        const logMiddleware: AzureDefaultMiddleware = jest.fn(async (context, inputData, _, next) => {

            const { executionContext: { functionName, invocationId } } = context;

            const log = { functionName, invocationId };

            let logJson = JSON.stringify(log);

            context.log.info(`ENTRY: ${logJson}`);

            const result = await next(context, inputData);

            context.log.info(`SUCCESS: ${logJson}`);

            return result;
        });

        const timingMiddleware: AzureDefaultMiddleware = jest.fn(async (context, inputData, _, next) => {

            const startDate = new Date();

            const result = await next(context, inputData);

            const elapsedMilliseconds = new Date().getTime() - startDate.getTime();

            const { executionContext: { functionName } } = context;

            context.log.info(`Elapsed milliseconds is ${elapsedMilliseconds} for ${functionName} function`);

            return result;
        });

        const jsonParser: AzureDefaultMiddleware = jest.fn(async (context, inputData, _, next) => {

            const { type } = context.bindingDefinitions.find(def => def.direction === 'in')!;

            let outputData;

            if (type === 'httpTrigger') {
                outputData = { ...inputData.body, ...inputData.headers, ...inputData.params, ...inputData.query }
            } else if (type === 'eventGridTrigger') {
                let { data } = inputData;
                outputData = JSON.parse(data);
            } else if (type === 'queueTrigger') {
                outputData = inputData;
            } else if (type === 'blobTrigger') {
                outputData = JSON.parse(inputData.toString('utf8'));
            } else if (type === 'eventHubTrigger') {
                outputData = inputData;
            }

            return next.apply(null, Object.values(outputData) as any);
        });

        const azureFunctionHandler: AzureDefaultMiddleware<'All', [string, string], MiddlewareServices> = jest.fn((firstName, lastName, services) => {

            return {
                body: services.greetingService.sayHello({ firstName, lastName }),
                statusCode: 200,
            } as any;
        });

        const proxyFn = buildPipeline([errorMiddleware, corsMiddleware, logMiddleware, timingMiddleware, jsonParser, azureFunctionHandler as any], services);

        const args = { firstName: "Kenan", lastName: "Hancer" };

        const context = createContext();

        const inputData = createInputDataForHttp(args);

        const result = await proxyFn(context, inputData);

        expect(result.body).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        expect(result.statusCode).toEqual(200);

        // expect(errorMiddleware).toHaveBeenCalledTimes(1);

        // expect(errorMiddleware).toHaveBeenCalledWith(context, inputData, expect.any(Object), expect.any(Function));

        // expect(corsMiddleware).toHaveBeenCalledTimes(1);

        // expect(corsMiddleware).toHaveBeenCalledWith(context, inputData, expect.any(Object), expect.any(Function));

        // expect(logMiddleware).toHaveBeenCalledTimes(1);

        // expect(logMiddleware).toHaveBeenCalledWith(context, inputData, expect.any(Object), expect.any(Function));

        // expect(jsonParser).toHaveBeenCalledTimes(1);

        // expect(jsonParser).toHaveBeenCalledWith(context, inputData, expect.any(Object), expect.any(Function));

        // expect(azureFunctionHandler).toHaveBeenCalledTimes(1);

        // expect(azureFunctionHandler).toHaveBeenCalledWith(args.firstName, args.lastName, expect.any(Object));
    });
});