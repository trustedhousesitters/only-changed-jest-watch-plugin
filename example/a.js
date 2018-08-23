const { testFnOne } = require('./b');
const { testFnTwo } = require('./c');

const testFnThree = (x, y) => {
    return [testFnOne(x, y), testFnTwo(x, y)];
}

module.exports = testFnThree;