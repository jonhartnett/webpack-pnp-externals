import Path from 'path';

export function WebpackPnpExternals(options={}) {
    let {include, exclude, importType='commonjs'} = options;
    let pnpApi;
    try{
        pnpApi = require('pnpapi');
    }catch(err){
        if(err.code !== 'MODULE_NOT_FOUND')
            throw err;
        pnpApi = null;
    }
    return function() {
        let [context, request, callback] = arguments;
        // support Webpack 5
        if (arguments.length === 2) {
            [{ context, request }, callback] = arguments;
        }
        if(pnpApi == null)
            return callback();
        //don't check relative or absolute requires
        if(/^\.\.?[/\\]/.test(request) || Path.isAbsolute(request))
            return callback();
        let resolution;
        try{
            resolution = pnpApi.resolveRequest(request, context, {
                considerBuiltins: false
            });
        }catch(err){
            if(err.code === 'MODULE_NOT_FOUND')
                return callback();
            throw err;
        }
        if(include != null && !isMatch(include, request, resolution))
            return callback();
        if(exclude != null && isMatch(exclude, request, resolution))
            return callback();
        let type = importType;
        if(type instanceof Function)
            type = type(request, resolution);
        return callback(null, request, type);
    };
}

function isMatch(pattern, request, ...args){
    if(typeof pattern === 'string'){
        return pattern === request;
    }else if(pattern instanceof RegExp){
        return pattern.test(request);
    }else if(pattern instanceof Function){
        return pattern(request, ...args);
    }else if(pattern instanceof Array){
        for(let subPattern of pattern){
            if(isMatch(subPattern, request, ...args))
                return true;
        }
        return false;
    }else{
        throw new Error(`Unexpected pattern type: ${pattern}`);
    }
}