let walker = require('estraverse');

/**
 * use estraverse to traverse ast
 * @param ast
 * @param walkers
 * @param context
 */
exports.walk = function(ast, walkers, context) {
    walkers = walkers || {};
    walker.traverse(ast, {
        enter: function(token, parent) {
            // if has token.type handler, get this handler
            let handler = walkers.hasOwnProperty(token.type) && walkers[token.type];
            let allHandler = walkers.hasOwnProperty('*') && walkers['*'];

            if (typeof allHandler === 'function') {
                allHandler.call(this, token, parent, context);
            }

            if (typeof handler === 'function') {
                return handler.call(this, token, parent, context);
            }
        }
    });
};
