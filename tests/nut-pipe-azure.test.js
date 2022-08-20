// const { buildPipeline } = require("../src/index");
const { createInputDataForHttp, createContext: createAzureContext } = require("./mocks/azure");
const { greetingService } = require("./mocks/services");

const buildPipeline = (functions, services = {}, index = 0, initArgs = []) => {

    const pipelineFunc = (...args) => {

        const funcParametersLength = functions[index].length;

        const isEndOfPipeline = index === functions.length - 1;

        const passedArgumentsLength = args.length;

        const missingArgumentsLength = funcParametersLength - passedArgumentsLength;

        const _initArgs = index === 0 ? [...args] : [...initArgs];

        const _args = [];

        if (!isEndOfPipeline) {
            const next = buildPipeline(functions, services, index + 1, _initArgs);

            if (funcParametersLength === 1) {
                _args.push(next);
            } else if (passedArgumentsLength === 0) {
                _args.push(..._initArgs, ...Array(missingArgumentsLength - _initArgs.length - 2).fill(null), services, next);
            } else if (missingArgumentsLength === 1) {
                _args.push(...args, next);
            } else {
                _args.push(...args, services, next);
            }
        } else {
            if (passedArgumentsLength === 0) {
                if (_initArgs.length === 0 && missingArgumentsLength === 1) {
                    _args.push(..._initArgs, services);
                } else {
                    _args.push(..._initArgs);
                }
            } else if (missingArgumentsLength === 1) {
                _args.push(...args, services);
            } else {
                _args.push(...args);
            }
        }

        return functions[index].apply(null, _args);
    };

    return pipelineFunc;
};

describe('NUT-PIPE Azure Function tests', () => {
    it('Azure Function Test', async () => {

        const errorMiddleware = jest.fn(async (context, inputData, next) => {

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

        const corsMiddleware = jest.fn(async (context, inputData, next) => {

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
        });

        const logMiddleware = jest.fn(async (context, inputData, next) => {

            const { executionContext: { functionName, invocationId } } = context;

            const log = { functionName, invocationId };
            let logJson = JSON.stringify(log);

            context.log.info(`ENTRY: ${logJson}`);

            const result = await next(context, inputData);

            context.log.info(`SUCCESS: ${logJson}`);

            return result;
        });

        const timingMiddleware = jest.fn(async (context, inputData, next) => {

            const startDate = new Date();

            const result = await next(context, inputData);

            const elapsedMilliseconds = new Date().getTime() - startDate.getTime();

            const { executionContext: { functionName } } = context;

            context.log.info(`Elapsed milliseconds is ${elapsedMilliseconds} for ${functionName} function`);

            return result;
        });

        const jsonParser = jest.fn(async (context, inputData, services, next) => {

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
        });

        const azureFunctionHandler = jest.fn((firstName, lastName, services) => {

            return {
                body: services.greetingService.sayHello({ firstName, lastName }),
                statusCode: 200,
            };
        });

        const services = { greetingService };

        const proxyFn = buildPipeline([errorMiddleware, corsMiddleware, logMiddleware, timingMiddleware, jsonParser, azureFunctionHandler], services);

        const args = { firstName: "Kenan", lastName: "Hancer" };

        const context = createAzureContext();

        const inputData = createInputDataForHttp(args);

        const result = await proxyFn(context, inputData);

        expect(result.body).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        expect(result.statusCode).toEqual(200);

        expect(errorMiddleware).toHaveBeenCalledTimes(1);

        expect(errorMiddleware).toHaveBeenCalledWith(context, inputData, expect.any(Function));

        expect(corsMiddleware).toHaveBeenCalledTimes(1);

        expect(corsMiddleware).toHaveBeenCalledWith(context, inputData, expect.any(Function));

        expect(logMiddleware).toHaveBeenCalledTimes(1);

        expect(logMiddleware).toHaveBeenCalledWith(context, inputData, expect.any(Function));

        expect(jsonParser).toHaveBeenCalledTimes(1);

        expect(jsonParser).toHaveBeenCalledWith(context, inputData, expect.any(Object), expect.any(Function));

        expect(azureFunctionHandler).toHaveBeenCalledTimes(1);

        expect(azureFunctionHandler).toHaveBeenCalledWith(args.firstName, args.lastName, expect.any(Object));
    });
});