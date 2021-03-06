/**
 * @typedef {Object} Token
 * @property {string} type
 */

module.exports = {
    /**
     * Returns first expression in BlockStatement
     * @param {BlockStatement} token
     * @returns {?Token}
     */
    getFirstExpression: function(token) {
        if (token.type === 'BlockStatement' || token.type === 'ClassBody' || token.type === 'Program') {
            return token.body[0] && token.body[0].expression || token.body[0];
        }

        return null;
    },
    /**
     * Create literal from string, number or boolean
     * @param {string|number|boolean} value
     * @returns {?Literal}
     */
    createLiteral: function(value) {
        if (['string', 'number', 'boolean'].indexOf(typeof value) > -1) {
            let literal = {
                type: 'Literal',
                value: value,
                raw: typeof value === 'string' ? ('"' + value + '"') : String(value)
            };

            if (typeof value !== 'number' || typeof value === 'number' && isFinite(value)) {
                return literal;
            }
        }

        return null;
    },
    /**
     * Create identifier
     * @param {string} name
     * @returns {Identifier}
     */
    createIdentifier: function(name) {
        return {
            type: 'Identifier',
            name: name
        };
    },
    /**
     * Is token a function
     * @param {Token} token
     * @returns {boolean}
     */
    isFunction: function(token) {
        return this.isTypeFunction(token.type);
    },
    /**
     * Is type a function
     * @param {string} type token type
     * @returns {boolean}
     */
    isTypeFunction: function(type) {
        return ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].indexOf(type) > -1;
    },
    /**
     * Is token a class
     * @param {Token} token
     * @returns {boolean}
     */
    isClass: function(token) {
        return this.isTypeClass(token.type);
    },
    /**
     * Is type a class
     * @param {string} type token type
     * @returns {boolean}
     */
    isTypeClass: function(type) {
        return ['ClassDeclaration', 'ClassExpression'].indexOf(type) > -1;
    },
    /**
     * Is token a block
     * @param {Token} token
     * @returns {boolean}
     */
    isBlock: function(token) {
        return this.isTypeBlock(token.type);
    },
    /**
     * Is type a block
     * @param {string} type token type
     * @returns {boolean}
     */
    isTypeBlock: function(type) {
        return ['BlockStatement', 'ForStatement', 'SwitchStatement', 'ClassBody'].indexOf(type) > -1;
    },
    /**
     * Bubble from scope to nearest function scope or global scope
     * Uses for hoisting emulation
     * @param {Scope} scope from
     * @returns {Scope}
     */
    bubble: function(scope) {
        let cursor = scope.token;

        while (cursor && cursor.parent && !this.isFunction(cursor) && !this.isClass(cursor)) {
            cursor = cursor.parent;
        }

        return cursor.scope;
    },
    /**
     * Bubble from token to nearest BlockStatement or ForStatement or SwitchStatement or global token
     * Uses for let/const/class hoisting emulation
     * @param {Token} token from
     * @returns {Token}
     */
    bubbleToBlock: function(token) {
        let current = token;

        while (current && current.parent && !this.isBlock(current)) {
            current = current.parent;
        }

        return current;
    }
};
