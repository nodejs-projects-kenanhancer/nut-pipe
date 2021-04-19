const { buildPipeline } = require("../index");
const { middleware1, middleware2, middleware3, errorMidlleware, logMiddleware, dynamicFunctionCallerMiddleware } = require("./middlewares");
const { greetingService } = require("./services");
const { createAPIGatewayProxyEventV2, createContext } = require("./aws");

describe('NUT-PIPE tests', () => {
    it('should create a basic pipeline function', () => {

        const mockMiddleware = jest.fn();

        const basicMiddleware1 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware2 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware3 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware4 = (context) => {

            mockMiddleware();

            return `Hello ${context.firstName} ${context.lastName}`;
        };

        const pipelineInvoker = buildPipeline([basicMiddleware1, basicMiddleware2, basicMiddleware3, basicMiddleware4]);

        const person = { firstName: "kenan", lastName: "hancer" };

        const response = pipelineInvoker(person);

        expect(response).toEqual(`Hello ${person.firstName} ${person.lastName}`);

        expect(mockMiddleware.mock.calls.length).toBe(4);
    });

    it('then create a basic pipeline function with services', () => {

        const mockMiddleware = jest.fn();

        const basicMiddleware1 = (context, services, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware2 = (context, services, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware3 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware4 = (context, services) => {

            mockMiddleware();

            return services.greetingService.sayHello(context);
        };

        const services = { greetingService };

        const pipelineInvoker = buildPipeline([basicMiddleware1, basicMiddleware2, basicMiddleware3, basicMiddleware4], services);

        const person = { firstName: "kenan", lastName: "hancer" };

        const response = pipelineInvoker(person);

        expect(response).toEqual(`Hello ${person.firstName} ${person.lastName}`);

        expect(mockMiddleware.mock.calls.length).toBe(4);
    });

    it('should throw error without passing arguments', () => {

        const mockMiddleware = jest.fn();

        const basicMiddleware1 = (context, services, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware2 = (context, services, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware3 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware4 = (context, services) => {

            mockMiddleware();

            return services.greetingService.sayHello(context);
        };

        const services = { greetingService };

        const pipelineInvoker = buildPipeline([basicMiddleware1, basicMiddleware2, basicMiddleware3, basicMiddleware4], services);

        try {
            const person = { firstName: "kenan", lastName: "hancer" };

            const response = pipelineInvoker();
        } catch (error) {
            expect(error.message).toContain('Cannot destructure property');
        }
    });

    it('should create a new pipeline function from middlewares and return with extra two more fields', () => {

        const pipelineInvoker = buildPipeline([middleware1, middleware2, middleware3]);

        const person = {
            personId: 1,
            firstName: "kenan",
            lastName: "HANCER"
        };

        const response = pipelineInvoker({ Person: { ...person } });

        expect(response).toEqual({
            ...person,
            city: expect.any(String),
            email: expect.any(String)
        });
    });

    it('test1', () => {
        const pipelineInvoker = buildPipeline([errorMidlleware, logMiddleware, dynamicFunctionCallerMiddleware]);

        let args = { firstName: "kenan", lastName: "hancer" }

        let result = pipelineInvoker({
            method: greetingService.sayHello,
            args
        });

        expect(result).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        result = pipelineInvoker({
            method: greetingService.sayGoodbye,
            args
        });

        expect(result).toEqual(`Goodbye, ${args.firstName} ${args.lastName}`);
    });

    it('test2', () => {
        const mockMiddleware = jest.fn();

        const basicMiddleware1 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware2 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware3 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        let pipelineInvoker = buildPipeline([basicMiddleware1, basicMiddleware2, basicMiddleware3, greetingService.sayHello]);

        let args = { firstName: "kenan", lastName: "hancer" }

        let result = pipelineInvoker(args);

        expect(result).toEqual(`Hello ${args.firstName} ${args.lastName}`);


        pipelineInvoker = buildPipeline([basicMiddleware1, basicMiddleware2, basicMiddleware3, greetingService.sayGoodbye]);

        result = pipelineInvoker(args);

        expect(result).toEqual(`Goodbye, ${args.firstName} ${args.lastName}`);
    });

    it('test3', () => {
        const mockMiddleware = jest.fn();

        const basicMiddleware1 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware2 = (context, next) => {

            mockMiddleware();

            return next(context);
        };

        const basicMiddleware3 = (context, next) => {

            mockMiddleware();

            // return next(...Object.values(context));
            return next.apply(null, Object.values(context));
        };

        const sayHello = (firstName, lastName) => `Hello ${firstName} ${lastName}`;

        let pipelineInvoker = buildPipeline([basicMiddleware1, basicMiddleware2, basicMiddleware3, sayHello]);

        let args = { firstName: "kenan", lastName: "hancer" }

        let result = pipelineInvoker(args);

        expect(result).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        expect(mockMiddleware.mock.calls.length).toBe(3);
    });

    it('test4', () => {
        const mockMiddleware = jest.fn();

        const basicMiddleware1 = (...args) => {

            mockMiddleware();

            const next = args.pop();

            return next(...args);
        };

        const basicMiddleware2 = (...args) => {

            mockMiddleware();

            const next = args.pop();

            return next(...args);
        };

        const basicMiddleware3 = (...args) => {

            mockMiddleware();

            const next = args.pop();

            return next(...args);
        };

        const sayHello = (firstName, lastName) => `Hello ${firstName} ${lastName}`;

        let pipelineInvoker = buildPipeline([basicMiddleware1, basicMiddleware2, basicMiddleware3, sayHello]);

        let result = pipelineInvoker("kenan", "hancer");

        expect(result).toEqual("Hello kenan hancer");

        expect(mockMiddleware.mock.calls.length).toBe(3);
    });

    it('AWS lambda handler', async () => {
        const mockMiddleware = jest.fn();

        const corsMiddleware = async (event, context, next) => {

            mockMiddleware();

            const response = await next(event, context);

            if (!response.headers) {
                response.headers = {};
            }

            response.headers['Access-Control-Allow-Origin'] = '*';
            response.headers['Access-Control-Allow-Credentials'] = true;

            return response;
        };

        const logMiddleware = async (event, context, next) => {

            mockMiddleware();

            try {
                console.debug(`logMiddleware: request received in ${context.functionName} lambda`, event);

                return await next(event, context);
            } catch (e) {
                console.error(`logMiddleware: request failed in ${context.functionName} lambda`, event, e);

                throw e;
            }
        };

        const jsonBodyParser = async (event, context, next) => {

            mockMiddleware();

            let parsedBody;

            try {
                console.debug(`jsonParserMiddleware: parsing JSON in ${context.functionName}`, event);

                parsedBody = JSON.parse(event.body);
            } catch (e) {
                console.error(`jsonParserMiddleware: failed to parse JSON in ${context.functionName}`, {}, e);

                throw new BadJsonResponse('invalid body, expected JSON');
            }

            return next(...Object.values(parsedBody));
        };

        const lambdaHandler = (firstName, lastName, services) => {

            return {
                body: services.greetingService.sayHello({ firstName, lastName }),
                statusCode: 200,
            };
        };

        const services = { greetingService };

        let pipelineInvoker = buildPipeline([corsMiddleware, logMiddleware, jsonBodyParser, lambdaHandler], services);

        let args = { firstName: "kenan", lastName: "hancer" };

        let result = await pipelineInvoker(createAPIGatewayProxyEventV2(JSON.stringify(args)), createContext());

        expect(result.body).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        expect(result.statusCode).toEqual(200);

        expect(mockMiddleware.mock.calls.length).toBe(3);
    });
});