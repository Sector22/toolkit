/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core
 */

// @formatter:off

var CoreEventDispatcher              = require('./events/CoreEventDispatcher');

//@formatter:on


CoreEventDispatcher.extend( CoreHTMLElement );

// TODO: Find a better solution to combining HTMLElement functions and the element itself in regard to events.


/**
 * Creates a new CoreHTMLElement with basic element manipulation & log capabilities and a destruct method.
 * @constructor
 * @extends CoreEventDispatcher
 * @param {HTMLElement}
 */
function CoreHTMLElement ( element ) {

    console.log(element);
    if( !element ) throw new Error( 'element can not be null!' );

    var _this = this;
    var _element = element;
    var _data;
    var _width;
    var _height;
    var _computedStyle;

    // retrieve dimensions
    var boundingRectangle = _element.getBoundingClientRect();
    _width = boundingRectangle.width;
    _height = boundingRectangle.height;

    _this.getStyle = function ( property ) {

        if( !_computedStyle ) _computedStyle = getComputedStyle( _element, null );

        return _computedStyle.getPropertyValue( property );

    }

    /**
     * Function that parses all the data attributes on the element.
     * @public
     * @function
     */
    _this.parseData = function () {

        if( _data !== undefined ) return _this.logWarn( 'data was already parsed.' );

        if( _this.debug ) _this.logDebug( 'parsing data attributes..' );

        _data = {};
        var attributes = _element.attributes;
        var cameCaseRexp = /-(\w)/g;
        var dataRegExp = /^data-/i;

        for ( var i = 0, leni = attributes.length; i < leni; i++ ) {

            var attribute = attributes[ i ];

            // check if the attribute is a data value, if so save it.
            if( dataRegExp.test( attribute.nodeName ) ) {

                var name = attribute.nodeName;
                name = name.replace( dataRegExp, '' );
                name = name.replace( cameCaseRexp, camelCaseReplacer );
                _data[ name ] = attribute.nodeValue;
            }

        }

        if( _this.debug ) _this.logDebug( 'parsed data:', _this.data );

        // helper function to convert dashed variable names to camelCase.
        function camelCaseReplacer ( match, p1 ) {

            return p1 ? p1.toUpperCase() : '';

        }

    }


    _this.removeChild = function ( element ) {

        if( element instanceof CoreHTMLElement ) element = element.element;
        _this.element.removeChild( element );

    }

    _this.addChild = function ( element ) {

        if( element instanceof CoreHTMLElement ) element = element.element;
        _this.element.addChild( element );

    }

    _this.empty = function () {

        _element.innerHTML = '';

    }



    Object.defineProperty( this, 'width', {
        enumerable: true,
        get: function () {
            return _width;
        },
        set: function ( value ) {

            if(_width === value) return;
            _width = value;
            _element.style.width = _width + 'px';

        }
    } );

    Object.defineProperty( this, 'height', {
        enumerable: true,
        get: function () {
            return _height;
        },
        set: function ( value ) {

            if(_height === value) return;
            _height = value;
            _element.style.height = _height + 'px';

        }
    } );

    Object.defineProperty( this, 'data', {
        enumerable: true,
        get: function () {
            return _data;
        }
    } );


    Object.defineProperty( this, 'element', {
        enumerable: true,
        get: function () {
            return _element;
        }
    } );

    this.setDestruct( function () {

        _element = undefined;
        _data = undefined;
        _width = NaN;
        _height = NaN;

    } );

}

CoreHTMLElement.prototype.setSize = function ( width, height ) {

    this.width = width;
    this.height = height;

}


CoreHTMLElement.prototype.show = function ( opt_display ) {

    this.element.style.display = opt_display || 'block';

}

CoreHTMLElement.prototype.hide = function () {

    this.element.style.display = 'none';

}


CoreHTMLElement.prototype.hasClass = function ( name ) {

    return (new RegExp( '\\b' + name + '\\b' )).test( this.element.className )

}

CoreHTMLElement.prototype.addClass = function ( name ) {

    if( !this.hasClass( name ) ) this.element.className = this.element.className + ' ' + name;

}

CoreHTMLElement.prototype.removeClass = function ( name ) {

    this.element.className = this.element.className.replace( new RegExp( '\\b' + name + '\\b' ), '' );

}

CoreHTMLElement.prototype.toggleClass = function ( name ) {

    if( this.hasClass( name ) ) this.removeClass( name );
    else this.addClass( name );

}


module.exports = CoreHTMLElement;