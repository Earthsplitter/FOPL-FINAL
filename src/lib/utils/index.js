function isObject(obj) {
    return typeof obj === 'object' && obj;
}

function cloneArray(array) {
    return array.map(function(el) {
        if (Array.isArray(el)) {
            return cloneArray(el);
        }

        if (isObject(el) && el.constructor === Object) {
            return deepExtend({}, el);
        }

        return el;
    });
}

function deepExtend(target) {
    let sources = Array.prototype.slice.call(arguments, 1);

    if (typeof target !== 'object' || !target) {
        return;
    }

    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];

        if (isObject(source)) {
            for (let sourceKey in source) {
                if (source.hasOwnProperty(sourceKey)) {
                    let value = source[sourceKey];

                    if (Array.isArray(value)) {
                        target[sourceKey] = cloneArray(value);
                    } else if (isObject(value) && value.constructor === Object) {
                        target[sourceKey] = deepExtend({}, value);
                    } else {
                        target[sourceKey] = value;
                    }
                }
            }
        }
    }

    return target;
}

module.exports = {
    array: require('./array'),
    ast: require('./ast'),
    isObject: isObject,
    cloneArray: cloneArray,
    deepExtend: deepExtend
};
