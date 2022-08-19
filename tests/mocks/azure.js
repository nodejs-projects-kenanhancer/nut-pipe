module.exports = {
    createInputDataForHttp: (body) => ({
        method: "GET",
        url: "",
        headers: {},
        query: {},
        params: {},
        body,
        rawBody: body && JSON.stringify(body) || ""
    }),
    createContext: () => ({
        invocationId: 'abcabc',
        executionContext: {
            invocationId: 'abcabc',
            functionName: 'abcabc',
            functionDirectory: 'abcabc'
        },
        bindings: {},
        bindingData: {},
        traceContext: {
            traceparent: "",
            tracestate: "",
            attributes: {}
        },
        bindingDefinitions: [{ "name": "inputData", "type": "httpTrigger", "direction": "in" }, { "name": "res", "type": "http", "direction": "out" }],
        log: {
            error: (args) => { },
            warn: (args) => { },
            info: (args) => { },
            verbose: (args) => { }
        },
        done: (err, result) => { },
        req: {
            method: "GET",
            url: "",
            headers: {},
            query: {},
            params: {},
            body: undefined,
            rawBody: undefined
        },
        res: {}
    })
};