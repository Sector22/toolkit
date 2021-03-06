/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core
 */

// @formatter:off

require('./toolkit'); // pull in the toolkit core to force the application of the polyfills

var inherits                = require('./utils/inherits');
var destructibleMixin       = require('./mixin/destructibleMixin');
var logMixin                = require('./mixin/logMixin');

//@formatter:on

destructibleMixin.apply( CoreObject, true );

logMixin.apply( CoreObject, true );


// Keeps count of the number of objects created.
CoreObject.__counter = 0;

/**
 * Creates a new Object with log capabilities and a destruct method.
 * @mixes destructibleMixin
 * @mixes logMixin
 * @constructor
 */
function CoreObject () {

    /**
     * Contains a unique id of this object
     * @memberOf sector22/core.CoreObject
     * @private
     * @property _id {string}
     * @readonly
     */
    Object.defineProperty( this, 'toolkitId', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: ('core_object_' + ++CoreObject.__counter)
    } );

    this.setDestruct( function () {

        // Remove event listeners and references to other objects here

    } );

}

/**
 * Function to easily inherit the CoreObject class.
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function extend
 * @param constructor {function} the class that should inherit the CoreObject
 */
CoreObject.extend = CoreObject.prototype.extend = function ( constructor ) {

    inherits( constructor, this );
    constructor.extend = CoreObject.extend;

}

module.exports = CoreObject