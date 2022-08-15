module.exports = {
    createAPIGatewayProxyEventV2: (body = '') => ({
        version: '2.0',
        routeKey: '$default_route',
        rawPath: '/my/path',
        rawQueryString: '',
        headers: {},
        requestContext: {
            accountId: '1111111111',
            apiId: 'api-id',
            domainName: 'id.execute-api.eu-west-1.amazonaws.com',
            domainPrefix: 'id',
            http: {
                method: 'POST',
                path: '/my/path',
                protocol: 'HTTP/1.1',
                sourceIp: 'IP',
                userAgent: 'agent',
            },
            requestId: 'id',
            routeKey: '$default_route',
            stage: '$default',
            time: '22/Jun/2021:13:21:04 +0000',
            timeEpoch: 1181148333220,
        },
        body,
        isBase64Encoded: false,
    }),
    createContext: () => ({
        callbackWaitsForEmptyEventLoop: true,
        functionName: 'abcabc',
        functionVersion: 'abcabab',
        invokedFunctionArn: 'abcabc',
        memoryLimitInMB: 'abcabc',
        awsRequestId: 'abcabc',
        logGroupName: 'abcabc',
        logStreamName: 'abcabc',
        getRemainingTimeInMillis: () => 0
    })
};