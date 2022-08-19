const { buildPipeline } = require("../src/index");
const { errorMidlleware, logMiddleware, dynamicFunctionCallerMiddleware } = require("./mocks/middlewares");
const { greetingService } = require("./mocks/services");

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
                sayHello: jest.fn(({ firstName, lastName }) => `Hello ${firstName} ${lastName}`)
            }
        };

        Object.assign(this, { mockMiddleware1, mockMiddleware2, mockMiddleware3, services });
    });

    it('when middlewares have one parameter and if we call middlewareChainFunction without any argument then that parameter in each function will be next function object except last middelware', () => {

        const mockMiddleware1 = jest.fn((next) => {

            return next();
        });

        const mockMiddleware2 = jest.fn((services, next) => {

            return next();
        });

        const mockMiddleware3 = jest.fn(() => {

            return 'Hello World!';
        });

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3]);

        const response = middlewareChainFunction();

        expect(response).toEqual('Hello World!');

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);


        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);


        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveReturnedWith(response);
    });

    it('when middlewares have two parameters and if we call middlewareChainFunction without any argument then first parameter will be services object and second one will be next function object except last middelware', () => {

        const mockMiddleware1 = jest.fn((services, next) => {

            return next();
        });

        const mockMiddleware2 = jest.fn((services, next) => {

            return next();
        });

        const mockMiddleware3 = jest.fn((services) => {

            return 'Hello World!';
        });

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3]);

        const response = middlewareChainFunction();

        expect(response).toEqual('Hello World!');

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);


        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);


        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveReturnedWith(response);
    });

    it('when middlewares have two parameters and if we call middlewareChainFunction with one argument then first parameter value will be passed object and second parameter will be next function object except last middelware', () => {

        const mockMiddleware1 = jest.fn((person, next) => {

            return next(person);
        });

        const mockMiddleware2 = jest.fn((person, services, next) => {

            return next(person);
        });

        const mockMiddleware3 = jest.fn((person) => {

            return `Hello ${person.firstName} ${person.lastName}`;
        });

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3]);

        const person = { firstName: "Kenan", lastName: "Hancer" };

        const response = middlewareChainFunction(person);


        expect(response).toEqual(`Hello ${person.firstName} ${person.lastName}`);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(person, expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);


        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(person, {}, expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);


        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledWith(person);

        expect(mockMiddleware3).toHaveReturnedWith(response);
    });

    it('when middlewares have one parameter and if we call middlewareChainFunction with one argument then first parameter will be next function object except last middelware', () => {

        const mockMiddleware1 = jest.fn((next) => {

            return next();
        });

        const mockMiddleware2 = jest.fn((next) => {

            return next();
        });

        const mockMiddleware3 = jest.fn((person) => {

            return `Hello ${person.firstName} ${person.lastName}`;
        });

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3]);

        const person = { firstName: "Kenan", lastName: "Hancer" };

        const response = middlewareChainFunction(person);


        expect(response).toEqual(`Hello ${person.firstName} ${person.lastName}`);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);


        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);


        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledWith(person);

        expect(mockMiddleware3).toHaveReturnedWith(response);
    });

    it('when middlewares have two parameters and if we call middlewareChainFunction with one argument then first parameter value will be passed object and second parameter will be next function except last middelware due to end of pipeline', () => {

        const mockMiddleware1 = jest.fn((person, next) => {
            return next(person);
        });

        const mockMiddleware2 = jest.fn((person, next) => {
            return next(person);
        });

        const mockMiddleware3 = jest.fn((person, services) => {
            return services.greetingService.sayHello(person);
        });

        const services = {
            greetingService: {
                sayHello: jest.fn(({ firstName, lastName }) => `Hello ${firstName} ${lastName}`)
            }
        };

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3], services);

        const person = { firstName: "Kenan", lastName: "Hancer" };

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
                sayHello: jest.fn(({ firstName, lastName }) => `Hello ${firstName} ${lastName}`)
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
                firstName: "Kenan",
                lastName: "Hancer"
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
            return { firstName, lastName, mail, age };
        });

        const middlewareChainFunction = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3])

        const data = { firstName: "Kenan", lastName: "Hancer", mail: "kenanhancer@gmail.com", age: 37 };

        const response = middlewareChainFunction(data.firstName, data.lastName, data.mail, data.age);

        expect(response).toEqual(data);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

    });

    it('test1', () => {
        const proxyFn = buildPipeline([errorMidlleware, logMiddleware, dynamicFunctionCallerMiddleware]);

        const args = { firstName: "Kenan", lastName: "Hancer" }

        let response = proxyFn({ method: greetingService.sayHello, args });

        expect(response).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        response = proxyFn({ method: greetingService.sayGoodbye, args });

        expect(response).toEqual(`Goodbye, ${args.firstName} ${args.lastName}`);
    });

    it('test2', () => {

        const mockMiddleware1 = jest.fn((context, next) => {

            return next(context);
        });

        const mockMiddleware2 = jest.fn((context, next) => {

            return next(context);
        });

        const mockMiddleware3 = jest.fn((context, next) => {

            return next(context);
        });

        jest.spyOn(greetingService, 'sayHello');

        jest.spyOn(greetingService, 'sayGoodbye');

        let proxyFn = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3, greetingService.sayHello]);

        const args = { firstName: "Kenan", lastName: "Hancer" }

        let response = proxyFn(args);

        expect(response).toEqual(`Hello ${args.firstName} ${args.lastName}`);


        proxyFn = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3, greetingService.sayGoodbye]);

        response = proxyFn(args);

        expect(response).toEqual(`Goodbye, ${args.firstName} ${args.lastName}`);



        expect(mockMiddleware1).toHaveBeenCalledTimes(2);

        expect(mockMiddleware2).toHaveBeenCalledTimes(2);

        expect(mockMiddleware3).toHaveBeenCalledTimes(2);

        expect(greetingService.sayHello).toHaveBeenCalledTimes(1);

        expect(greetingService.sayGoodbye).toHaveBeenCalledTimes(1);

    });

    it('test3', () => {

        const mockMiddleware1 = jest.fn((context, next) => {

            return next(context);
        });

        const mockMiddleware2 = jest.fn((context, next) => {

            return next(context);
        });

        const mockMiddleware3 = jest.fn((context, next) => {

            // return next(...Object.values(context));
            return next.apply(null, Object.values(context));
        });

        const sayHello = jest.fn((firstName, lastName) => `Hello ${firstName} ${lastName}`);

        const proxyFn = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3, sayHello]);

        const args = { firstName: "Kenan", lastName: "Hancer" }

        const response = proxyFn(args);


        expect(response).toEqual(`Hello ${args.firstName} ${args.lastName}`);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);


        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);


        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));

        expect(mockMiddleware3).toHaveReturnedWith(response);


        expect(sayHello).toHaveBeenCalledTimes(1);

        expect(sayHello).toHaveBeenCalledWith(expect.any(String), expect.any(String));

        expect(sayHello).toHaveReturnedWith(response);
    });

    it('test4', () => {

        const mockMiddleware1 = jest.fn((...args) => {

            const next = args.pop();
            const services = args.pop();

            return next(...args);
        });

        const mockMiddleware2 = jest.fn((...args) => {

            const next = args.pop();
            const services = args.pop();

            return next(...args);
        });

        const mockMiddleware3 = jest.fn((...args) => {

            const next = args.pop();
            const services = args.pop();

            return next(...args);
        });

        const sayHello = jest.fn((firstName, lastName) => `Hello ${firstName} ${lastName}`);

        const proxyFn = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3, sayHello]);

        const firstName = "Kenan", lastName = "Hancer";

        const response = proxyFn(firstName, lastName);


        expect(response).toEqual(`Hello ${firstName} ${lastName}`);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(Object), expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);


        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(Object), expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);


        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(Object), expect.any(Function));

        expect(mockMiddleware3).toHaveReturnedWith(response);


        expect(sayHello).toHaveBeenCalledTimes(1);

        expect(sayHello).toHaveBeenCalledWith(expect.any(String), expect.any(String));

        expect(sayHello).toHaveReturnedWith(response);
    });

    it('test5', () => {

        const mockMiddleware1 = jest.fn((firstName, lastName, next) => {

            return next(firstName, lastName);
        });

        const mockMiddleware2 = jest.fn((firstName, lastName, next) => {

            return next(firstName, lastName);
        });

        const mockMiddleware3 = jest.fn((firstName, lastName, next) => {

            return next(firstName, lastName);
        });

        const sayHello = jest.fn((firstName, lastName) => `Hello ${firstName} ${lastName}`);

        const proxyFn = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3, sayHello]);

        const firstName = "Kenan", lastName = "Hancer";

        const response = proxyFn(firstName, lastName);


        expect(response).toEqual(`Hello ${firstName} ${lastName}`);

        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware1).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(Function));

        expect(mockMiddleware1).toHaveReturnedWith(response);


        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(Function));

        expect(mockMiddleware2).toHaveReturnedWith(response);


        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(Function));

        expect(mockMiddleware3).toHaveReturnedWith(response);


        expect(sayHello).toHaveBeenCalledTimes(1);

        expect(sayHello).toHaveBeenCalledWith(expect.any(String), expect.any(String));

        expect(sayHello).toHaveReturnedWith(response);
    });

    it('test6', () => {

        const mockMiddleware1 = jest.fn((next) => {

            return next();
        });

        const mockMiddleware2 = jest.fn((next) => {

            return next();
        });

        const mockMiddleware3 = jest.fn((firstName, lastName, age, services, next) => {

            return next();
        });

        const sayHello = jest.fn((firstName, lastName, age) => `Hello ${firstName} ${lastName}, your age is ${age}`);

        const proxyFn = buildPipeline([mockMiddleware1, mockMiddleware2, mockMiddleware3, sayHello]);

        const firstName = "Kenan";

        const response = proxyFn(firstName);


        expect(mockMiddleware1).toHaveBeenCalledTimes(1);

        expect(mockMiddleware2).toHaveBeenCalledTimes(1);

        expect(mockMiddleware3).toHaveBeenCalledTimes(1);

        expect(sayHello).toHaveBeenCalledTimes(1);
    });
});