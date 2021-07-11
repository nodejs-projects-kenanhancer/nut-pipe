const {buildPipeline} = require("../index");
const {createAPIGatewayProxyEventV2, createContext: createAwsContext} = require("./aws");
const {greetingService} = require("./services");

describe('NUT-PIPE AWS Lambda Function tests', () => {
    it('AWS Lambda Function Test', async () => {
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

        const awsLambdaHandler = (firstName, lastName, services) => {

            return {
                body: services.greetingService.sayHello({firstName, lastName}),
                statusCode: 200,
            };
        };

        const services = {greetingService};

        let pipelineInvoker = buildPipeline([corsMiddleware, logMiddleware, jsonBodyParser, awsLambdaHandler], services);

        let args = {firstName: "kenan", lastName: "hancer"};

        let result = await pipelineInvoker(createAPIGatewayProxyEventV2(JSON.stringify(args)), createAwsContext());

        expect(result.body).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        expect(result.statusCode).toEqual(200);

        expect(mockMiddleware.mock.calls.length).toBe(3);
    });
});