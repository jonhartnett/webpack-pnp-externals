## Webpack PnP Externals
Allows you to exclude modules installed using Yarn's [PnP](https://classic.yarnpkg.com/en/docs/pnp/) from the bundle.
Mostly useful for the backend.
Intended to be used alongside [webpack-node-externals](https://github.com/liady/webpack-node-externals).

### Installation
```shell script
npm install -D webpack-pnp-externals
```

### Usage
Webpack Documentation: [Externals](https://webpack.js.org/configuration/externals/).
```js
const {WebpackPnpExternals} = require('webpack-pnp-externals');

module.exports = {
    //...
    externals: [
        WebpackPnpExternals()
    ]
    //...
};
```
This will exclude all PnP modules from the bundle and instead load them with `require`.

### Options
* `include` Only externalizes the matching requests.
    Can be one of the following types:
    * `string` A string to match the request against exactly.
    * `RegExp` A regex pattern to match the request against.
    * `function: (request: string, resolution: string) -> boolean`
        A custom function to check whether to externalize the request.
        * `request` The content of the import statement.
        * `resolution` The file which the request resolved to. 
    * `Array` An array of the preceding to be or-ed together.
* `exclude` Same as `include`, but excludes requests that match.
* `importType` (default `'commonjs'`) 
    The [external type](https://webpack.js.org/configuration/externals/#externalstype) to use when loading the externalized modules.
    Can be one of the following types:
    * `string` A type to use for all modules.
    * `function: (request: string, resolution: string) -> string`
        A custom function to get the external type for a given request and resolution.

### License
[MIT](./LICENSE)
