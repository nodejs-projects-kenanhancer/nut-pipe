const { buildPipeline } = require("../src/index");
const { createInputDataForHttp, createContext: createAzureContext } = require("./azure");
const { greetingService } = require("./services");

describe('NUT-PIPE Azure Function tests', () => {
    it('Azure Function Test', async () => {
        const mockMiddleware = jest.fn();

        const errorMiddleware = async (context, inputData, next) => {

            mockMiddleware();

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
        };

        const corsMiddleware = async (context, inputData, next) => {

            mockMiddleware();

            const response = await next(context, inputData);

            const { type } = context.bindingDefinitions.find(def => def.direction === 'in');

            if (type === 'httpTrigger') {
                context.res = {
                    status: 200,
                    body: response,
                    headers: { 'Access-Control-Allow-Origin': "*", "Access-Control-Allow-Credentials": false }
                };
            }

            return response;
        };

        const logMiddleware = async (context, inputData, next) => {

            mockMiddleware();

            const { executionContext: { functionName, invocationId } } = context;

            const log = { functionName, invocationId };
            let logJson = JSON.stringify(log);

            context.log.info(`ENTRY: ${logJson}`);

            const result = await next(context, inputData);

            context.log.info(`SUCCESS: ${logJson}`);

            return result;
        };

        const timingMiddleware = async (context, inputData, next) => {

            mockMiddleware();

            const startDate = new Date();

            const result = await next(context, inputData);

            const elapsedMilliseconds = new Date().getTime() - startDate.getTime();

            const { executionContext: { functionName } } = context;

            context.log.info(`Elapsed milliseconds is ${elapsedMilliseconds} for ${functionName} function`);

            return result;
        };

        const jsonParser = async (context, inputData, services, next) => {

            mockMiddleware();

            let { executionContext: { functionName } } = context;
            // const [azureFunctionName, triggerType] = functionName.split('-');
            // const { handlers } = services;
            // const handle = handlers[azureFunctionName];
            // if (!handle) {
            //     throw new Error(`${functionName} function can not be find.`);
            // }

            const { type } = context.bindingDefinitions.find(def => def.direction === 'in');

            let handleData;

            if (type === 'httpTrigger') {
                handleData = { ...inputData.body, ...inputData.headers, ...inputData.params, ...inputData.query }
            } else if (type === 'eventGridTrigger') {
                let { data } = inputData;
                handleData = JSON.parse(data);
            } else if (type === 'queueTrigger') {
                handleData = inputData;
            } else if (type === 'blobTrigger') {
                handleData = JSON.parse(inputData.toString('utf8'));
            } else if (type === 'eventHubTrigger') {
                handleData = inputData;
            }

            return next(...Object.values(handleData));
        };

        const azureFunctionHandler = (firstName, lastName, services) => {

            return {
                body: services.greetingService.sayHello({ firstName, lastName }),
                statusCode: 200,
            };
        };

        const services = { greetingService };

        let pipelineInvoker = buildPipeline([errorMiddleware, corsMiddleware, logMiddleware, timingMiddleware, jsonParser, azureFunctionHandler], services);

        let args = { firstName: "kenan", lastName: "hancer" };

        let result = await pipelineInvoker(createAzureContext(), createInputDataForHttp(args));

        expect(result.body).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        expect(result.statusCode).toEqual(200);

        expect(mockMiddleware).toHaveBeenCalledTimes(5);
    });
});