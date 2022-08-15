const buildPipeline = (functions, services = {}, index = 0, initArgs = []) => {

    const pipelineFunc = (...args) => {

        const funcParametersLength = functions[index].length;

        const isEndOfPipeline = index === functions.length - 1;

        const passedArgumentsLength = args.length;

        const missingArgumentsLength = funcParametersLength - passedArgumentsLength;

        const _initArgs = index === 0 ? [...args] : [...initArgs];

        const _args = [];

        if (!isEndOfPipeline) {
            const next = buildPipeline(functions, services, index + 1, _initArgs);

            if (funcParametersLength === 1) {
                _args.push(next);
            } else if (passedArgumentsLength === 0) {
                _args.push(..._initArgs, ...Array(missingArgumentsLength - _initArgs.length - 2).fill(null), services, next);
            } else if (missingArgumentsLength === 1) {
                _args.push(...args, next);
            } else {
                _args.push(...args, services, next);
            }
        } else {
            if (passedArgumentsLength === 0) {
                if (_initArgs.length === 0 && missingArgumentsLength === 1) {
                    _args.push(..._initArgs, services);
                } else {
                    _args.push(..._initArgs);
                }
            } else if (missingArgumentsLength === 1) {
                _args.push(...args, services);
            } else {
                _args.push(...args);
            }
        }

        return functions[index].apply(null, _args);
    };

    return pipelineFunc;
};

module.exports = { buildPipeline };
