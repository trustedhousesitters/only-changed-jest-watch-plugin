const a = require('./a');

test('adds 2 + 1 to equal 3 and 2 - 1 to equal 1', () => {
  expect(a(2, 1)).toEqual([3,1]);
});