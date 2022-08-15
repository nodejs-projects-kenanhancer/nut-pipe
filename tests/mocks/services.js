const helper = {
    getFullName: ({ firstName, lastName }) => (`${firstName} ${lastName}`)
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

module.exports = { helper, greetingService };