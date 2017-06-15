const utils = require('./utils/index');

/**
 * Scope is a constructor
 * @param {Scope=} parent
 * @param {string=} name
 * @constructor
 */
function Scope(parent, name) {
    this.name = name || null;
    this.scopes = [];
    this.references = {};
    this.thisRef = null;
    this.parent = null;

    // create parent - child relationship
    if (parent && parent instanceof Scope) {
        parent.addScope(this);
    }
}

/**
 * Add sub scope
 * @param {Scope} scope
 * @return {boolean}
 */
Scope.prototype.addScope = function(scope) {
    let added = utils.array.add(this.scopes, scope);

    // if Added success, remove old parent (if exists)
    if (added) {
        if (scope.parent) {
            scope.parent.removeScope(scope);
        }
        // set new parent
        scope.parent = this;
    }

    return added;
};

/**
 * Is has scope
 * @param {Scope} scope
 * @return {boolean}
 */
Scope.prototype.hasScope = function(scope) {
    return utils.array.has(this.scopes, scope);
};

/**
 * Remove scope
 * @param {Scope} scope
 * @return {boolean}
 */
Scope.prototype.removeScope = function(scope) {
    let removed = utils.array.remove(this.scopes, scope);

    if (removed) {
        scope.parent = null;
    }

    return removed;
};

/**
 * Find reference
 * @param {string} name
 * @returns {?{scope: Scope, name: String, value: *}}
 */
Scope.prototype.findReference = function(name) {
    let current = this;
    // find variable reference from inner to outer
    while (current && !current.hasOwnReference(name)) {
        current = current.parent;
    }
    // found
    if (current) {
        return {
            scope: current,
            name: name,
            value: current.getOwnReference(name)
        };
    }
    // not found
    return null;
};

/**
 * Get reference
 * @param {string} name
 */
Scope.prototype.getReference = function(name) {
    let reference = this.findReference(name);

    return reference ? reference.value : null;
};

/**
 * Set reference
 * @param {string} name
 * @param {*=} value
 */
Scope.prototype.setReference = function(name, value) {
    let reference = this.findReference(name);

    if (reference) {
        return reference.scope.setOwnReference(name, value);
    }

    return this.setOwnReference(name, value);
};

/**
 * Set own reference
 * @param {string} name
 * @param {*=} value
 * @returns {object} reference
 */
Scope.prototype.setOwnReference = function(name, value) {
    this.references[name] = typeof value === 'undefined' ? {} : value;

    return value;
};

/**
 * Has reference
 * @param {string} name
 */
Scope.prototype.hasReference = function(name) {
    return this.findReference(name);
};

/**
 * Has own reference
 * @param {string} name
 */
Scope.prototype.hasOwnReference = function(name) {
    return this.references.hasOwnProperty(name);
};

/**
 * Get own reference
 * @param {string} name
 */
Scope.prototype.getOwnReference = function(name) {
    if (this.hasOwnReference(name)) {
        return this.references[name];
    }

    return null;
};

/**
 * Get own references names
 * @returns {Array<string>}
 */
Scope.prototype.getOwnReferenceNames = function() {
    return Object.keys(this.references);
};

/**
 * Get references names
 * @returns {Array<string>}
 */
Scope.prototype.getReferenceNames = function() {
    let references = [];
    let current = this;

    while (current) {
        let ownReferences = current.getOwnReferenceNames();

        for (let i = 0; i < ownReferences.length; i++) {
            references.push(ownReferences[i]);
        }

        current = current.parent;
    }

    return references;
};


/**
 * Count scope references
 * @returns {number}
 */
Scope.prototype.countReferences = function() {
    let current = this;
    let references = {};

    while (current) {
        for (let referenceName in current.references) {
            if (current.references.hasOwnProperty(referenceName)) {
                references[referenceName] = true;
            }
        }

        current = current.parent;
    }

    return Object.keys(references).length;
};

/**
 * Count scope own references
 * @returns {number}
 */
Scope.prototype.countOwnReferences = function() {
    return Object.keys(this.references).length;
};

/**
 * Remove own reference
 * @param {string} name
 */
Scope.prototype.removeOwnReference = function(name) {
    if (this.references.hasOwnProperty(name)) {
        delete this.references[name];
    }
};

/**
 * Remove own reference
 * @param {string} name
 */
Scope.prototype.removeNearReference = function(name) {
    let current = this;

    while (current) {
        if (current.hasOwnReference(name)) {
            current.removeOwnReference(name);

            return;
        }

        current = current.parent;
    }
};

/**
 * Remove reference
 * @param {string} name
 */
Scope.prototype.removeReference = function(name) {
    let current = this;

    while (current) {
        current.removeOwnReference(name);
        current = current.parent;
    }
};

module.exports = Scope;
