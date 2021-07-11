const {buildPipeline} = require("../index");
const {
    errorMidlleware,
    logMiddleware,
    dynamicFunctionCallerMiddleware
} = require("./middlewares");
const {greetingService} = require("./services");

describe('NUT-PIPE tests', () => {
    beforeAll(() => {
        const mockMiddleware1 = jest.fn((context, next) => {
            return next(context);
        });

        const mockMiddleware2 = jest.fn((context, next) => {
            return next(context);
        });

        const mockMiddleware3 = jest.fn((context, services) => {
            return services.greetingService.sayHello(context);
        });

        const services = {
            greetingService: {
                sayHello: jest.fn(({firstName, lastName}) => {
                    return `Hello ${firstName} ${lastName}`;
                })
            }
        };

        Object.assign(this, {mockMiddleware1, mockMiddleware2, mockMiddleware3, services});
    });

    it('should create a basic pipeline function', () => {

        const mockMiddleware1 = jest.fn((context, next) => {

            return next(context);
        });

        const mockMiddleware2 = jest.fn((context, next) => {

            return next(context);
        });

        const mockMiddleware3 = jest.fn((context) => {

            return `Hello ${context.firstName} ${context.lastName}`;
        });

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3]);

        const person = {firstName: "kenan", lastName: "hancer"};

        const response = middlewareChainFunction(person);


        expect(response).toEqual(`Hello ${person.firstName} ${person.lastName}`);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(person, expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);


        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(person, expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);


        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledWith(person);

        expect(mockMiddleware3).toHaveReturnedWith(response);
    });

    it('should create a basic pipeline function with services', () => {

        const {mockMiddleware1, mockMiddleware2, mockMiddleware3, services} = this;

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3], services);

        const person = {firstName: "kenan", lastName: "hancer"};

        const response = middlewareChainFunction(person);

        expect(response).toEqual(`Hello ${person.firstName} ${person.lastName}`);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(person, expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);

        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(person, expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);

        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledWith(person, services);

        expect(mockMiddleware3).toHaveReturnedWith(response);

        expect(services.greetingService.sayHello).toHaveBeenCalledTimes(1);

        expect(services.greetingService.sayHello).toHaveBeenCalledWith(person);

        expect(services.greetingService.sayHello).toHaveReturnedWith(response);
    });

    it('should work without parameters', () => {
        const mockMiddleware1 = jest.fn((services, next) => {
            return next();
        });

        const mockMiddleware2 = jest.fn((next) => {
            return next();
        });

        const mockMiddleware3 = jest.fn((services) => {
            return services.greetingService.sayHello({});
        });

        const services = {
            greetingService: {
                sayHello: jest.fn(({firstName, lastName}) => {
                    return `Hello ${firstName} ${lastName}`;
                })
            }
        };

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3], services);

        const response = middlewareChainFunction();

        expect(response).toEqual(`Hello ${undefined} ${undefined}`);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(services, expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);

        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);

        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledWith(services);

        expect(mockMiddleware3).toHaveReturnedWith(response);
    });

    it('should create a new pipeline function from middlewares and return with extra two more fields', () => {

        const mockMiddleware1 = (context, next) => {

            context.Person.city = "Istanbul";

            return next(context);
        };

        const mockMiddleware2 = (context, next) => {

            context.Person.email = 'kenanhancer@gmail.com';

            return next(context);
        };

        const mockMiddleware3 = (context) => {

            return context.Person;
        };

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3]);

        const data = {
            Person: {
                personId: 1,
                firstName: "kenan",
                lastName: "HANCER"
            }
        };

        const response = middlewareChainFunction(data);

        expect(response).toEqual({
            ...data.Person,
            city: expect.any(String),
            email: expect.any(String)
        });
    });

    it('should set undefined value for missing parameters', function () {

        const mockMiddleware1 = jest.fn((firstName, lastName, mail, age, next) => {
            return next(firstName, lastName, mail, age);
        });

        const mockMiddleware2 = jest.fn((firstName, lastName, mail, age, services, next) => {
            return next(firstName, lastName, mail, age);
        });

        const mockMiddleware3 = jest.fn((firstName, lastName, mail, age) => {
            return {firstName, lastName, mail, age};
        });

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3])

        const data = {firstName: "kenan", lastName: "hancer", mail: "kenanhancer@gmail.com", age: 37};

        const response = middlewareChainFunction(data.firstName, data.lastName, data.mail, data.age);

        expect(response).toEqual(data);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        // expect(mockMiddleware1).
    });

    it('test1', () => {
        const pipelineInvoker = buildPipeline([errorMidlleware, logMiddleware, dynamicFunctionCallerMiddleware]);

        let args = {firstName: "kenan", lastName: "hancer"}

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

        let args = {firstName: "kenan", lastName: "hancer"}

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

        let args = {firstName: "kenan", lastName: "hancer"}

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
});