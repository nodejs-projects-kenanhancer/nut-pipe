# nut-pipe

a very simple middleware pipeline builder. The aim of this package is wrapping any function with another function.

You can even use nut-pipe to add middlewares to your AWS Lambda Function and Azure Function so check README for AWS Lambda Function or Azure Function usages.

Visit below page for live demo.

https://kenanhancer.com/2020/03/11/node-js-nut-pipe-usage/

https://kenanhancer.com/2018/01/18/javascript-pipeline-demo-with-es6/

# Documentation

<br/>

- [Getting started](#getting-started)
    - [Install](#install)
    - [Usage](#usage)
    - [Basic Example](#basic-example)
    - [Real life Example](#real-life-example)
    - [Real life Example With All Aspects](#real-life-example-with-all-aspects)
    - [Real life Example With nut.pipe](#real-life-example-with-nut.pipe)
    - [AWS Lambda Function Example With nut.pipe](#aws-lambda-function-example-with-nut.pipe)
    - [Azure Function Example With nut.pipe](#azure-function-example-with-nut.pipe)

## Install

Install the package.

```sh
$ npm i -S nut-pipe
```

## Usage

Create your middlewares like the following code. According to the following code, there are three middlewares named **middleware1**, **middleware2**, **middleware3** and 
after pipeline is builded with ```const pipelineInvoker = buildPipeline([middleware1, middleware2, middleware3]);```, pipelineInvoker variable will be a function to call middlewares sequentially. In this case, when ```pipelineInvoker({ Person: person });``` function is called, firstly middleware1 will run, then middleware2, then middleware 3. 

## Basic Example

Live demo
https://kenanhancer.com/2018/01/18/javascript-pipeline-demo-with-es6/

**`app.js`**
```js
const middleware1 = (context, next) => {

  const person = JSON.stringify(context.Person);

  console.log(`ENTRY: middleware1, Person = ${person}`);

  context.Person.city = "Istanbul";

  next(context);
};

const middleware2 = (context, next) => {

  const person = JSON.stringify(context.Person);

  console.log(`ENTRY: middleware2, Person = ${person}`);

  context.Person.email = 'kenanhancer@gmail.com';

  next(context);
};

const middleware3 = (context, next) => {

  const person = JSON.stringify(context.Person);

  console.log(`ENTRY: middleware3, Person = ${person}`);

  next(context);
};


const pipelineInvoker = buildPipeline([middleware1, middleware2, middleware3]);

const person = {
  personId: 1,
  firstName: "kenan",
  lastName: "HANCER"
};

pipelineInvoker({ Person: person });
```

## Real life Example

Live demo
https://kenanhancer.com/2020/03/11/node-js-nut-pipe-usage/

Let's think a scenario like below greeting service business logic. It looks very basic. But, we have to decorate it for code quality.

```js
const helper = {
  getFullName: ({firstName, lastName})=>{
    return `${firstName} ${lastName}`;
  }
};

const greetingService = {
  sayHello: ({ firstName, lastName }) => {
      const fullName = helper.getFullName({ firstName, lastName });

      return `Hello ${fullName}`;
  },
  sayGoodbye: ({ firstName, lastName }) => {
        const fullName = helper.getFullName({ firstName, lastName });

        return `Goodbye, ${fullName}`;
  }
};
```

Notice that we have only three functions, so you shouldn't think that you can handle all aspects in every functions, because you will have many functions, classes, modules etc. Every project will evolve soon.

## Real life Example With All Aspects

I included all aspects in every function in this code example. Actually, this is very usual condition in many project :)
But, this approach has a very big problem, developers shouldn't forget to write all these duplicated codes. So this approach cause code duplication clearly.
In addition to this, if developer wants to change aspects of business logic for all or some of functions, then they have to manually change them.
There are many other disadvantages as well. But, let's focus on the main idea :)

**`app.js`**
```js
const helper = {
  getFullName: ({firstName, lastName})=>{
    return `${firstName} ${lastName}`;
  }
};

const greetingService = {
  sayHello: ({ firstName, lastName }) => {
    try {

      console.log(`ENTRY: sayHello({ firstName: ${firstName}, ${lastName} }) function`);

      const fullName = helper.getFullName({ firstName, lastName });

      const startDate = new Date();

      const result = `Hello ${fullName}`;

      const elapsedMilliseconds = new Date() - startDate;

      console.log(`SUCCESS: sayHello function returns //${result}. Elapsed milliseconds is ${elapsedMilliseconds}`);

      return result;

    } catch (error) {

      console.log(`ERROR: sayHello({ firstName: ${firstName}, ${lastName} }) function`);

      throw error;
    }

    return undefined;
  },
  sayGoodbye: ({ firstName, lastName }) => {
      try {

        console.log(`ENTRY: sayGoodbye({ firstName: ${firstName}, ${lastName} }) function`);

        const startDate = new Date();

        const fullName = helper.getFullName({ firstName, lastName });

        const result = `Goodbye, ${fullName}`;

        const elapsedMilliseconds = new Date() - startDate;

        console.log(`SUCCESS: sayGoodbye function returns //${result}. Elapsed milliseconds is ${elapsedMilliseconds}`);

        return result;

      } catch (error) {

        console.log(`ERROR: sayGoodbye({ firstName: ${firstName}, ${lastName} }) function`);

        throw error;
      }

      return undefined;
  }
};



let result = greetingService.sayHello({ firstName: "kenan", lastName: "hancer" });

console.log(result);

console.log();

result = greetingService.sayGoodbye({ firstName: "kenan", lastName: "hancer" });

console.log(result);
```




## Real life Example With nut.pipe

Writing previous code with nut-pipe makes code clean. Notice that business logic is very clean code definetely this time. I didn't include any logging, exception or timing business logic in sayHello(), sayGoodbye() functions.

**`app.js`**
```js
const { buildPipeline } = require("nut-pipe");


/////////////////BUSINESS LOGIC///////////////////////////
const helper = {
  getFullName: ({firstName, lastName})=>{
    return `${firstName} ${lastName}`;
  }
};

const greetingService = {
  sayHello: ({ firstName, lastName }) => {
      const fullName = helper.getFullName({ firstName, lastName });

      return `Hello ${fullName}`;
  },
  sayGoodbye: ({ firstName, lastName }) => {
        const fullName = helper.getFullName({ firstName, lastName });

        return `Goodbye, ${fullName}`;
  }
};
/////////////////BUSINESS LOGIC///////////////////////////



/////////////////ASPECTS///////////////////////////
const errorMidlleware = (context, next) => {

  try {

    const result = next(context);

    return result;

  } catch (error) {

    const {method, args} = context;

    console.log(`ERROR: ${method.name}(${JSON.stringify(args)}) function`);

    throw error;
  }
};

const logMiddleware = (context, next) => {

  const {method, args} = context;

  console.log(`ENTRY: ${method.name}(${JSON.stringify(args)}) function`)

  const startDate = new Date();

  const result = next(context);

  const elapsedMilliseconds = new Date() - startDate;

  console.log(`SUCCESS: ${method.name} function returns //${result}. Elapsed milliseconds is ${elapsedMilliseconds}`);

  return result;
};

const dynamicFunctionCallerMiddleware = (context, next) => {

  const { method, args } = context;

  const result = method.apply(null, [args]);

  return result;
};
/////////////////ASPECTS///////////////////////////




const pipelineInvoker = buildPipeline([errorMidlleware, logMiddleware, dynamicFunctionCallerMiddleware]);


let result = pipelineInvoker({
  method: greetingService.sayHello,
  args: { firstName: "kenan", lastName: "hancer" }
});

console.log(result);

result = pipelineInvoker({
  method: greetingService.sayGoodbye,
  args: { firstName: "kenan", lastName: "hancer" }
});

console.log(result);
```

## AWS Lambda Function Example With nut.pipe

If you have a AWS Lambda Function, then you could use middleware logic as well.

**`app.js`**
```js
const corsMiddleware = async (event, context, next) => {

    const response = await next(event, context);

    if (!response.headers) {
        response.headers = {};
    }

    response.headers['Access-Control-Allow-Origin'] = '*';
    response.headers['Access-Control-Allow-Credentials'] = true;

    return response;
};

const logMiddleware = async (event, context, next) => {

    try {
        console.debug(`logMiddleware: request received in ${context.functionName} lambda`, event);

        return await next(event, context);
    } catch (e) {
        console.error(`logMiddleware: request failed in ${context.functionName} lambda`, event, e);

        throw e;
    }
};

const jsonBodyParser = async (event, context, next) => {

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
        body: services.greetingService.sayHello({ firstName, lastName })
        statusCode: 200,
    };
};

const mainAsync = async () => {

  const services = { greetingService };

  let pipelineInvoker = buildPipeline([corsMiddleware, logMiddleware, jsonBodyParser, lambdaHandler], services);

  let args = { firstName: "kenan", lastName: "hancer" }

  let result = await pipelineInvoker(createAPIGatewayProxyEventV2(JSON.stringify(args)), createContext());

  expect(result.body).toEqual(`Hello ${args.firstName} ${args.lastName}`);

  expect(result.statusCode).toEqual(200);
};

mainAsync();
```

## Azure Function Example With nut.pipe

If you have an Azure Function like AWS Lambda Function, then you could use middleware logic in similar way.

**`app.js`**
```js

const errorMiddleware = async (context, inputData, next) => {

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

    const response = await next(context, inputData);

    const { type } = context.bindingDefinitions.find(def => def.direction === 'in');

    if (type === 'httpTrigger') {
        context.res = { status: 200, body: response, headers: { 'Access-Control-Allow-Origin': "*", "Access-Control-Allow-Credentials": false } };
    }

    return response;
};

const logMiddleware = async (context, inputData, next) => {

    const { executionContext: { functionName, invocationId } } = context;

    const log = { functionName, invocationId };
    let logJson = JSON.stringify(log);

    context.log.info(`ENTRY: ${logJson}`);

    const result = await next(context, inputData);

    context.log.info(`SUCCESS: ${logJson}`);

    return result;
};

const timingMiddleware = async (context, inputData, next) => {

    const startDate = new Date();

    const result = await next(context, inputData);

    const elapsedMilliseconds = new Date().getTime() - startDate.getTime();

    const { executionContext: { functionName } } = context;

    context.log.info(`Elapsed milliseconds is ${elapsedMilliseconds} for ${functionName} function`);

    return result;
};

const jsonParser = async (context, inputData, services, next) => {

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
    }
    else if (type === 'eventGridTrigger') {
        let { data } = inputData;
        handleData = JSON.parse(data);
    }
    else if (type === 'queueTrigger') {
        handleData = inputData;
    }
    else if (type === 'blobTrigger') {
        handleData = JSON.parse(inputData.toString('utf8'));
    }
    else if (type === 'eventHubTrigger') {
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
```