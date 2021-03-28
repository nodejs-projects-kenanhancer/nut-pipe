const buildPipeline = (functions, index = 0) => {

    let pipelineFunc = (...args) => {

        if (index < functions.length - 1) {
            const funcParametersLength = functions[index].length;

            const passedArgumentsLength = args.length;

            const nullParametersLength = funcParametersLength - passedArgumentsLength - 1

            if (nullParametersLength > 0) {
                args.unshift(...Array(nullParametersLength).fill(null));
            } else if (nullParametersLength < 0) {
                // args = args.slice(0, funcParametersLength - 1);
            }

            return functions[index].apply(null, [...args, buildPipeline(functions, index + 1)]);
        }

        return functions[index].apply(null, [...args]);
    };

    return pipelineFunc;
};

module.exports = { buildPipeline };
