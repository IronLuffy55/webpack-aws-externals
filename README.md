# Webpack-AWS-Externals

> Easily exclude node modules that are commonly included in AWS Lambda runtimes from Webpack

[![Version](https://img.shields.io/npm/v/webpack-aws-externals.svg)](https://www.npmjs.org/package/webpack-aws-externals)
[![Downloads](https://img.shields.io/npm/dm/webpack-aws-externals.svg)](https://www.npmjs.org/package/webpack-aws-externals)

This module builds on [webpack-node-externals](https://github.com/liady/webpack-node-externals) which is a super handy plugin for Webpack. Webpack-aws-externals will make sure that the core list of modules that are known to be distributed within AWS lambdaLambda node runtimes will not be bundled into your webpack - but everything else will be. This way your uploaded packages for serverless lambdas wont have unnecessary bloat, but you won't have to keep track of a whitelist.

## Quick usage

```sh
npm install webpack-aws-externals --save-dev
```

In your `webpack.config.js`:

```js
var awsExternals = require('webpack-aws-externals');
...
module.exports = {
    ...
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [awsExternals()], // in order to ignore all modules in node_modules folder
    ...
};
```

And that's it. All aws modules will no longer be bundled but will be left as `require('module')`.

## Detailed overview

### Configuration

This library accepts an `options` object.

#### `options.whitelist (=[])`

An array for the `externals` to whitelist, so they **will** be included in the bundle. Can accept exact strings (`'module_name'`), regex patterns (`/^module_name/`), or a function that accepts the module name and returns whether it should be included.
<br/>**Important** - if you have set aliases in your webpack config with the exact same names as modules in _node_modules_, you need to whitelist them so Webpack will know they should be bundled.

#### `options.importType (='commonjs')`

The method in which unbundled modules will be required in the code. Best to leave as `commonjs` for node modules.
May be one of [documented options](https://webpack.js.org/configuration/externals/#externals) or function `callback(moduleName)` which returns custom code to be returned as import type, e.g:

```js
options.importType = function(moduleName) {
  return "amd " + moduleName;
};
```

## Usage example

```js
var awsExternals = require('webpack-aws-externals');
...
module.exports = {
    ...
    target: 'node', // important in order not to bundle built-in modules like path, fs, etc.
    externals: [awsExternals({
        // this WILL include `uuid` in the bundle
        whitelist: ['uuid']
    })],
    ...
};
```

For most use cases, the defaults of `importType` should be used.

## Contribute

Contributions and pull requests are welcome.

## License

MIT

## Thank you

[@liady](https://github.com/liady) made an awesome package that let us make this very quickly.
