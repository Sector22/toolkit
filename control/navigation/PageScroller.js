/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

                                  require('../../core/polyfill/corePolyfill' ).apply(global);

var singletonMixin              = require('../../core/mixin/singletonMixin');
var CoreEventDispatcher         = require('../../core/events/CoreEventDispatcher');
var eases                       = require('../../extern/gsap/easing/EasePack');
var TweenLite                   = require('../../extern/gsap/TweenLite');

//@formatter:on


var SCROLL_EASE = eases.Power3.easeInOut;
var SCROLL_TIME = .5;

CoreEventDispatcher.extend( PageScroller );

singletonMixin.apply( PageScroller );

var idLinkRegExp = /\#[\w|-]*/;


/**
 * @constructor
 * @singleton
 * @mixes singletonMixin
 * @extends {CoreEventDispatcher}
 *
 * @event TransitionEvent.START
 * @event TransitionEvent.COMPLETE
 * @event PageTransitionEvent.BEFORE_PAGE_UPDATE
 * @event PageTransitionEvent.AFTER_PAGE_UPDATE
 */
function PageScroller () {

    PageScroller.singletonCheck( this );

    PageScroller.super_.call( this );

    var _this = this;
    var _links = [];
    var _document = document;
    var _scrollContainer = document.getElementsByTagName( 'body' )[ 0 ];
    var _scrollTween;


    _this.debug = true;

    _this.addLinks = function ( element ) {

        var links = element.getElementsByTagName( 'a' );

        for ( var i = 0, leni = links.length; i < leni; i++ ) {

            var link = links[ i ];

            if( !link.__parsedPageScroller ) {

                link.__parsedPageScroller = true;

                var href = link.getAttribute( 'href' );

                if( href && idLinkRegExp.test( href ) ) {

                    link.addEventListener( 'click', handleLinkClick, true );
                    _links.push( link );

                }

                if( _this.debug ) _this.logDebug( 'Added link: ' + link.href + ' (' + link.textContent + ')' );

            }
        }

    }

    _this.scrollTo = function ( item ) {

        if( typeof item === 'string' ) {

            if( !idLinkRegExp.test( item ) ) return _this.logError( 'invalid id given! ', item );

            item = item.slice( 1 ); // remove
            item = _document.getElementById( item );

        }

        if( !item ) return;

        if( _this.debug ) _this.logDebug( 'scroll to : ', item );

        var y = 0;
        while ( item && !isNaN( item.offsetTop ) ) {

            y += item.offsetTop - item.scrollTop;
            item = item.offsetParent;

        }

        TweenLite.to( _scrollContainer, SCROLL_TIME, { scrollTop: y, ease: SCROLL_EASE } );

    }

    function handleLinkClick ( event ) {

        var link = event.currentTarget;

        if( _this.debug ) _this.logDebug( 'handle link click: ', link );

        event.preventDefault();

        if( _scrollTween ) _scrollTween.kill();
        _scrollTween = _this.scrollTo( link.getAttribute( 'href' ) );

    }


    //function updateLinks () {
    //
    //
    //    // clean up the old links first
    //    for ( var i = 0, leni = _links.length; i < leni; i++ ) {
    //
    //        var link = _links[ i ];
    //
    //        if( !_document.contains( link ) ) {
    //
    //            link.removeEventListener( 'click', handleLinkClick );
    //            _links.splice( i, 1 );
    //            i--, leni--;
    //
    //            if( _this.debug ) _this.logDebug( 'Removed link: ' + link.href + ' (' + link.textContent + ')' );
    //
    //        }
    //    }
    //
    //    _this.addLinks( _contentContainer );
    //}

    _this.setDestruct( function () {
        if( _scrollTween ) {
            _scrollTween.kill();
            _scrollTween = undefined;
        }
    } )


}


module.exports = PageScroller;

