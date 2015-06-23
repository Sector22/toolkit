/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var AbstractSlideShow           = require('./AbstractSlideShow');
var BulletListMenu              = require('./BulletListMenu');
var CoreHTMLElement             = require('../../core/CoreHTMLElement');
var CommonEvent                 = require('../../core/events/CommonEvent');

                                  require('../../extern/gsap/plugins/CSSPlugin');
                                  require('../../extern/gsap/easing/EasePack');
var TweenLite                   = require('../../extern/gsap/TweenLite');


// @formatter:on

AbstractSlideShow.extend( SlideShow );


/**
 * @constructor
 * @extends AbstractSlideShow
 */
function SlideShow ( element ) {

    SlideShow.super_.call( this, element );


    var _this = this;
    var _eventTarget;
    var _animationTime = 1;
    var _animationEase = Power3.easeInOut;
    var _touchValue = -1;
    var _previousTouchValue = -1;
    var _bulletMenu;
    var _touchListenersAdded;


    /**
     *
     * @param listElement {HTMLElement}
     * @param opt_autoCreate {boolean=true}
     */
    _this.addBulletListMenu = function ( listElement, opt_autoCreate ) {

        if( _bulletMenu ) return _this.logError( 'bullet list menu was already added!' );

        _bulletMenu = new BulletListMenu( listElement, opt_autoCreate );

        _bulletMenu.setLength( _this.length );
        _bulletMenu.select( _this.currentSlideIndex );
        _bulletMenu.onBulletClick = _this.setCurrentSlide;

        _this.addEventListener( CommonEvent.UPDATE, handleSlideShowEvents );
        _this.addEventListener( CommonEvent.CHANGE, handleSlideShowEvents );

    }

    _this.addTouchEventListeners = function () {

        if( _touchListenersAdded ) return;
        _touchListenersAdded = true;

        _eventTarget.addEventListener( 'touchstart', handleTouchEvents );
        _eventTarget.addEventListener( 'touchmove', handleTouchEvents );
        _eventTarget.addEventListener( 'touchend', handleTouchEvents );

    }


    function handleSlideShowEvents ( event ) {

        switch ( event.type ) {
            case CommonEvent.CHANGE:

                if( _bulletMenu ) _bulletMenu.setLength( _this.length );

                break;
            case CommonEvent.UPDATE:

                if( _bulletMenu ) _bulletMenu.select( _this.currentSlideIndex );

                break;
            default:
                _this.logError( 'Unhandled slide show event' );
        }


    }


    _this.setEventTarget = function ( target ) {

        _eventTarget = target;

    }

    /**
     *
     * @param event {TouchEvent|Event}
     */
    function handleTouchEvents ( event ) {

        if( _this.isDestructed ) return;


        switch ( event.type ) {
            case 'touchstart':

                if( _this.isHorizontal ) _touchValue = event.touches[ 0 ].clientX;
                else  _touchValue = event.touches[ 0 ].clientY;


                break;
            case 'touchmove':

                _previousTouchValue = _touchValue;

                if( _this.isHorizontal ) _touchValue = event.touches[ 0 ].clientX;
                else  _touchValue = event.touches[ 0 ].clientY;

                if( _previousTouchValue >= 0 ) {

                    if( _touchValue > _previousTouchValue ) _this.previous();
                    else _this.next();

                }

                break;
            case 'touchend':

                _previousTouchValue = -1;

                break;
            default:
                _this.logError( 'Unhandled touch event', event );
        }

    }

    Object.defineProperty( this, 'animationTime', {
        enumerable: true,
        get: function () {
            return _animationTime;
        }
    } );

    Object.defineProperty( this, 'animationEase', {
        enumerable: true,
        get: function () {
            return _animationEase;
        }
    } );

    _this.setDestruct( function () {

        if( _eventTarget ) {

            _eventTarget.removeEventListener( 'touchstart', handleTouchEvents );
            _eventTarget.removeEventListener( 'touchmove', handleTouchEvents );
            _eventTarget.removeEventListener( 'touchend', handleTouchEvents );
            _eventTarget = undefined;
        }

        _this.removeEventListener( CommonEvent.UPDATE, handleSlideShowEvents );
        _this.removeEventListener( CommonEvent.CHANGE, handleSlideShowEvents );

        if( _this.currentSlide ) TweenLite.killTweensOf( _this.currentSlide );
        if( _this.previousSlide ) TweenLite.killTweensOf( _this.previousSlide );

        _animationEase = undefined;
        _animationTime = NaN;
        _touchValue = NaN;
        _previousTouchValue = NaN;

    } );

}

SlideShow.prototype.init = function ( opt_direction, opt_eventTarget ) {

    SlideShow.super_.prototype.init.call( this, opt_direction );

    this.setEventTarget( opt_eventTarget || this.element );

    this.addTouchEventListeners();

}

SlideShow.prototype.transitionSlides = function ( opt_instant ) {

    this.setTransitioning( true );

    var animationOut = { ease: this.animationEase };
    var animationIn = { ease: this.animationEase, onComplete: this.setTransitioning, onCompleteParams: [ false ] };
    var animationInFrom = {};


    if( this.isHorizontal ) {

        if( this.previousSlide ) animationOut.x = ( this.slideForward ? -this.previousSlide.width : this.previousSlide.width );
        animationIn.x = 0 ;
        animationInFrom.x = ( this.slideForward ? this.currentSlide.width : -this.currentSlide.width );

    }
    else if( this.isVertical ) {

        if( this.previousSlide ) animationOut.y = (this.slideForward ? -this.previousSlide.height : this.previousSlide.height);
        animationIn.y = 0;
        animationInFrom.y = ( this.slideForward ? this.currentSlide.height : -this.currentSlide.height );

    }

    if( this.debug ) this.logDebug( 'updating show: \nforward: ' + this.slideForward + '\ndirection:' + this.direction + ' \nanim in: ', animationIn, '\nanim from:', animationInFrom, '\nanim out: ', animationOut );


    if( this.previousSlide ) TweenLite.to( this.previousSlide.element, opt_instant ? 0 : this.animationTime, animationOut );

    TweenLite.fromTo( this.currentSlide.element, opt_instant ? 0 : this.animationTime, animationInFrom, animationIn );

}


module.exports = SlideShow;