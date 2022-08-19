const { buildPipeline } = require("../src/index");
const { createAPIGatewayProxyEventV2, createContext: createAwsContext } = require("./mocks/aws");
const { greetingService } = require("./mocks/services");

describe('NUT-PIPE AWS Lambda Function tests', () => {
    it('AWS Lambda Function Test', async () => {

        const corsMiddleware = jest.fn(async (event, context, next) => {

            const response = await next(event, context);

            if (!response.headers) {
                response.headers = {};
            }

            response.headers['Access-Control-Allow-Origin'] = '*';
            response.headers['Access-Control-Allow-Credentials'] = true;

            return response;
        });

        const logMiddleware = jest.fn(async (event, context, next) => {

            try {
                console.debug(`logMiddleware: request received in ${context.functionName} lambda`, event);

                return next(event, context);
            } catch (e) {
                console.error(`logMiddleware: request failed in ${context.functionName} lambda`, event, e);

                throw e;
            }
        });

        const jsonBodyParser = jest.fn(async (event, context, next) => {

            let parsedBody;

            try {
                console.debug(`jsonParserMiddleware: parsing JSON in ${context.functionName}`, event);

                parsedBody = JSON.parse(event.body);
            } catch (e) {
                console.error(`jsonParserMiddleware: failed to parse JSON in ${context.functionName}`, {}, e);

                throw new BadJsonResponse('invalid body, expected JSON');
            }

            return next(...Object.values(parsedBody));
        });

        const awsLambdaHandler = jest.fn((firstName, lastName, services) => {

            return {
                body: services.greetingService.sayHello({ firstName, lastName }),
                statusCode: 200,
            };
        });

        const services = { greetingService };

        const proxyFn = buildPipeline([corsMiddleware, logMiddleware, jsonBodyParser, awsLambdaHandler], services);

        const args = { firstName: "Kenan", lastName: "Hancer" };

        const event = createAPIGatewayProxyEventV2(JSON.stringify(args));

        const context = createAwsContext();

        const response = await proxyFn(event, context);

        expect(response.body).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        expect(response.statusCode).toEqual(200);

        expect(corsMiddleware).toHaveBeenCalledTimes(1);

        expect(corsMiddleware).toHaveBeenCalledWith(event, context, expect.any(Function));

        expect(logMiddleware).toHaveBeenCalledTimes(1);

        expect(logMiddleware).toHaveBeenCalledWith(event, context, expect.any(Function));

        expect(jsonBodyParser).toHaveBeenCalledTimes(1);

        expect(jsonBodyParser).toHaveBeenCalledWith(event, context, expect.any(Function));

        expect(awsLambdaHandler).toHaveBeenCalledTimes(1);

        expect(awsLambdaHandler).toHaveBeenCalledWith(args.firstName, args.lastName, expect.any(Object));
    });
});