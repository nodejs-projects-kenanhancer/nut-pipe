# nut-pipe
a very simple middleware pipeline builder.

build pipeline with your middlewares easily. Visit below page for live demo.

https://kenanhancer.com/2018/01/18/javascript-pipeline-demo-with-es6/


## Install

Install the package.

```sh
$ npm i -S nut-pipe
```

## Usage

Create your middlewares like the following code. According to the following code, there are three middlewares named middleware1, middleware2, middleware3 and 
after pipeline is builded with ```const pipelineInvoker = pipelineBuilder([middleware1, middleware2, middleware3]);```, pipelineInvoker variable will be a function to call middlewares sequentially. In this case, when ```pipelineInvoker({ Person: person });``` function is called, firstly middleware1 will run, then middleware2, then middleware 3. 

**`app.js`**
```js
const middleware1 = (environment, next) => {

  console.log("middleware1", "\n", JSON.stringify(environment.Person), "\n");

  environment.Person.city = "Istanbul";

  next(environment);
};

const middleware2 = (environment, next) => {

  console.log("middleware2", "\n", JSON.stringify(environment.Person), "\n", "Person has a new field named city coming from middleware1\n");

  environment.Person.email = 'kenanhancer@gmail.com';

  next(environment);
};

const middleware3 = (environment, next) => {

  console.log("middleware3", "\n", JSON.stringify(environment.Person), "\n", "Person has a new field named email coming from middleware2\n");

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