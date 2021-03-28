module.exports = {
    middleware1: (context, next) => {

        const person = JSON.stringify(context.Person);

        console.log(`ENTRY: middleware1, Person = ${person}`);

        context.Person.city = "Istanbul";

        const response = next(context);

        return response;
    },
    middleware2: (context, next) => {

        const person = JSON.stringify(context.Person);

        console.log(`ENTRY: middleware2, Person = ${person}`);

        context.Person.email = 'kenanhancer@gmail.com';

        const response = next(context);

        return response;
    },
    middleware3: (context, next) => {

        const person = JSON.stringify(context.Person);

        console.log(`ENTRY: middleware3, Person = ${person}`);

        return context.Person;
    },
    errorMidlleware: (context, next) => {

        try {

            const result = next(context);

            return result;

        } catch (error) {

            const { method, args } = context;

            console.log(`ERROR: ${method.name}(${JSON.stringify(args)}) function`);

            throw error;
        }
    },
    logMiddleware: (context, next) => {

        const { method, args } = context;

        console.log(`ENTRY: ${method.name}(${JSON.stringify(args)}) function`)

        const startDate = new Date();

        const result = next(context);

        const elapsedMilliseconds = new Date() - startDate;

        console.log(`SUCCESS: ${method.name} function returns //${result}. Elapsed milliseconds is ${elapsedMilliseconds}`);

        return result;
    },
    dynamicFunctionCallerMiddleware: (context, next) => {

        const { method, args } = context;

        const result = method.apply(null, [args]);

        return result;
    }
}