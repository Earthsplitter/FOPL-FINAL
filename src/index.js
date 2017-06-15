const Scope = require('./lib/scope');
const processNames = require('./lib/namesProcessor');
const processValues = require('./lib/valuesProcessor');
const valueResolver = require('./lib/valueResolver');
const utils = require('./lib/utils');
const walker = require('./lib/walker');

let createScope = function () {
    return new Scope();
};

module.exports = {
    createScope: createScope,
    processNames: processNames,
    processValues: processValues,
    valueResolver: valueResolver,
    utils: utils,
    walker: walker
};
