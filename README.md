# nut-pipe
a very simple middleware pipeline builder.

build pipeline with your middlewares easily. Visit below page for live demo.

https://kenanhancer.com/2020/03/11/node-js-nut-pipe-usage/

https://kenanhancer.com/2018/01/18/javascript-pipeline-demo-with-es6/


## Install

Install the package.

```sh
$ npm i -S nut-pipe
```

## Usage

Create your middlewares like the following code. According to the following code, there are three middlewares named middleware1, middleware2, middleware3 and 
after pipeline is builded with ```const pipelineInvoker = pipelineBuilder([middleware1, middleware2, middleware3]);```, pipelineInvoker variable will be a function to call middlewares sequentially. In this case, when ```pipelineInvoker({ Person: person });``` function is called, firstly middleware1 will run, then middleware2, then middleware 3. 

## Basic Example

Live demo
https://kenanhancer.com/2018/01/18/javascript-pipeline-demo-with-es6/

**`app.js`**
```js
const middleware1 = (environment, next) => {

  const person = JSON.stringify(environment.Person);

  console.log(`ENTRY: middleware1, Person = ${person}`);

  environment.Person.city = "Istanbul";

  next(environment);
};

const middleware2 = (environment, next) => {

  const person = JSON.stringify(environment.Person);

  console.log(`ENTRY: middleware2, Person = ${person}`);

  environment.Person.email = 'kenanhancer@gmail.com';

  next(environment);
};

const middleware3 = (environment, next) => {

  const person = JSON.stringify(environment.Person);

  console.log(`ENTRY: middleware3, Person = ${person}`);

  next(environment);
};


const pipelineInvoker = pipelineBuilder([middleware1, middleware2, middleware3]);

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

### Classic code

I included all aspects in every function in this code example. Actually, this is very usual condition in many project :)
But, this approach has a very big problem, developers shouldn't forget to write all these duplicated codes. So this approach cause code duplication clearly.
In addition to this, if developer wants to change aspects of business logic for some functions, then they have to manually find and change them.
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




### nut.pipe code

Notice that business logic is very clean code definetely this time. I didn't include any logging, exception or timing business logic in sayHello(), sayGoodbye() functions.

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
const errorMidlleware = (environment, next) => {

  try {

    const result = next(environment);

    return result;

  } catch (error) {

    const {method, args} = environment;

    console.log(`ERROR: ${method.name}(${JSON.stringify(args)}) function`);

    throw error;
  }

  return undefined;
};

const logMiddleware = (environment, next) => {

  const {method, args} = environment;

  console.log(`ENTRY: ${method.name}(${JSON.stringify(args)}) function`)

  const startDate = new Date();

  const result = next(environment);

  const elapsedMilliseconds = new Date() - startDate;

  console.log(`SUCCESS: ${method.name} function returns //${result}. Elapsed milliseconds is ${elapsedMilliseconds}`);

  return result;
};

const dynamicFunctionCallerMiddleware = (environment, next) => {

  const { method, args } = environment;

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