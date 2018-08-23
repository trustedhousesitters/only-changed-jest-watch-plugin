const { testFnTwo } = require('./c');

test('2 - 1 to equal 1', () => {
  expect(testFnTwo(2, 1)).toEqual(1);
});