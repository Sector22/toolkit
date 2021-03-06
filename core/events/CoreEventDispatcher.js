/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var CoreObject                      = require('./../CoreObject');
var eventDispatcherMixin            = require('./../mixin/eventDispatcherMixin');

//@formatter:on

CoreObject.extend( CoreEventDispatcher );

eventDispatcherMixin.apply( CoreEventDispatcher, true );

/**
 * Creates a new CoreEventDispatcher
 * @constructor
 * @extends {CoreObject}
 */
function CoreEventDispatcher () {

    CoreEventDispatcher.super_.call(this);

    var _this = this;


    this.setDestruct( function () {

        _this.removeAllEventListeners();

    } )


}


module.exports = CoreEventDispatcher
