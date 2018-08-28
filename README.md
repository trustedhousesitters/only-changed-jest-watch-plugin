# only-changed-jest-watch-plugin
Jest watch plugin for running either only the modified test (for TDD), or tests of dependent modules. Developed as using the `-o` option to test for updated files only requires git, which isn't present in our dockerized containers.

## Usage

### Install

Install `jest`_(it needs Jest 23+)_ and `only-changed-jest-watch-plugin`

```bash
yarn add --dev jest only-changed-jest-watch-plugin

# or with NPM

npm install --save-dev jest only-changed-jest-watch-plugin
```

### Add it to your Jest config

In your `package.json`

```json
{
  "jest": {
    "watchPlugins": [
      "only-changed-jest-watch-plugin"
    ]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  watchPlugins: [
    'only-changed-jest-watch-plugin'
  ],
};
```

### Configuring your key, prompt name and watch ignore path globs

```js
module.exports = {
  watchPlugins: [
    [
      'only-changed-jest-watch-plugin',
      {
        key: 'k',
        prompt: 'My custom prompt',
        watchPathIgnoreGlobs: ['**/node_modules/**', './node_modules/**']
      },
    ],
  ],
};
```

### Test naming and location conventions

This plugin expects tests to sit alongside in the same directory the module they are testing, and be named like `my-module.test.js` e.g. module name postfixed with test/spec etc.

### Run Jest in watch mode

```bash
yarn jest --watchAll
```
