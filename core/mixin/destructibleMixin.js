/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 *
 */

/**
 * @mixin destructibleMixin
 */
destructibleMixin = {};


/**
 * Returns whether the object has been destroyed and made available for the garbage collector.
 * @function isDestructed
 * @public
 * @returns {boolean}
 * @readonly
 */
destructibleMixin.isDestructed = false; // Only here so auto completion works.


/**
 * Destroys the object and makes it available for the garbage collector.
 * @memberOf sector22/core.CoreObject
 * @public
 * @function destruct
 */
destructibleMixin.destruct = function () {

    // Only here so auto completion works.
    // check the setDestruct function for the actual implementation.

}


/**
 * Sets the destruct function for this class, will also automatically
 * call the super classes destruct function when called.
 * @function setDestruct
 * @protected
 * @param destructFunction {function}
 */
destructibleMixin.setDestruct = function setDestruct ( destructFunction ) {

    // Safe a reference to the destruct function so we can call it from the current child class.
    var parentDestruct = this.destruct;

    // Useful for testing the destruct chain.
    var instanceName = (this.debug && setDestruct.caller !== undefined && setDestruct.caller.name !== undefined ) ? setDestruct.caller.name : undefined;


    this.destruct = function dest () {

        if( this.debug && instanceName !== undefined ) this.logDebug( 'destructing: ' + instanceName );

        destructObject( this, parentDestruct, destructFunction );

    };

}

/**
 * The function that wraps the actualy destruct
 * function and makes sure the parent is also destructed.
 * @param object {object}
 * @param parentDestruct {function}
 * @param destructFunction {function}
 */
function destructObject ( object, parentDestruct, destructFunction ) {

    if( object.isDestructed ) return;

    destructFunction.call( object );

    if( typeof parentDestruct === 'function' ) {

        parentDestruct.call( object )

    } else {

        if( object.debug && typeof object.logDebug === 'function' ) object.logDebug.call( object, '-- destructed --' );

        Object.defineProperty( object, 'isDestructed', {
            enumerable: true,
            configurable: false,
            writable: false,
            value: true
        } );

    }

}


/**
 * Adds the mixin functionality to the constructors prototype
 * @param constructor {function}
 * @param opt_unsafe {boolean=false} won't double check if we are overwriting anything if true
 */
destructibleMixin.apply = function ( constructor, opt_unsafe ) {

    var proto = constructor.prototype;

    if( !opt_unsafe && (
        proto[ 'destruct' ] !== undefined ||
        proto[ 'isDestructed' ] !== undefined ||
        proto[ 'setDestruct' ] !== undefined ) ) {

        throw new Error( 'Failed to apply the mixin because some property name is already taken!' );

    }

    proto.setDestruct = destructibleMixin.setDestruct;

};


Object.freeze( destructibleMixin ) // lock the object to minimize accidental changes

module.exports = destructibleMixin;