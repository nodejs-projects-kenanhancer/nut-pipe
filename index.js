const buildPipeline = (functions, services = undefined, index = 0) => {

    let pipelineFunc = (...args) => {

        const funcParametersLength = functions[index].length;

        const passedArgumentsLength = args.length;

        const nullParametersLength = funcParametersLength - passedArgumentsLength;

        const isEndOfPipeline = index === functions.length - 1;

        if (!isEndOfPipeline) {
            if (nullParametersLength > 2) {
                args.push(...Array(nullParametersLength - 2).fill(null));
            }

            if (nullParametersLength >= 2) {
                args.push(services);
            }

            args.push(buildPipeline(functions, services, index + 1));
        } else if (isEndOfPipeline) {
            if (nullParametersLength === 1) {
                args.push(services);
            }
        }

        return functions[index].apply(null, args);
    };

    return pipelineFunc;
};

module.exports = { buildPipeline };
