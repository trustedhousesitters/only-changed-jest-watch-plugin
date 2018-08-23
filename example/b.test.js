const { testFnOne } = require('./b');

test('adds 2 + 1 to equal 3', () => {
  expect(testFnOne(2, 1)).toEqual(3);
});