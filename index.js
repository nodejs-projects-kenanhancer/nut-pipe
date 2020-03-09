const buildPipeline = (functions, index = 0) => {

    if (functions.length == index) return (env) => { }; //Default handler

    let pipelineFunc = (environment) => functions[index](environment, buildPipeline(functions, index + 1));

    return pipelineFunc;
};

module.exports = {buildPipeline};
