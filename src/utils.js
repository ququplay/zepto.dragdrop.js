;(function ($) {

  "use strict";

  // for testing
  var phantom = navigator.userAgent.match(/PhantomJS/);

  $.touchable = (function () {
    // http://modernizr.github.com/Modernizr/touch.html
    return !!('ontouchstart' in window) && !phantom
  })();

  // helpers
  $.getPos = function (e) {
    var pos = {}, touch;

    if ($.touchable) {
      touch = (e.targetTouches.length) ? e.targetTouches[0] : e.changedTouches[0];
      pos = { x: touch.pageX, y: touch.pageY };
    }
    else {
      pos = { x: e.pageX, y: e.pageY };
    }

    return pos;
  }

  var doc = document;

  $.elementFromPoint = function (x, y) {
    var moved = false;

    if (window.pageYOffset > 0) {
      moved = (doc.elementFromPoint(0, window.pageYOffset + window.innerHeight -1) === null);
    } else if (window.pageXOffset > 0) {
      moved = (doc.elementFromPoint(window.pageXOffset + window.innerWidth -1, 0) === null);
    }

    if (moved) {
      return doc.elementFromPoint(x - window.pageXOffset, y - window.pageYOffset);
    } else {
      return doc.elementFromPoint(x, y);
    }
  }

   // https://gist.github.com/997619
  window.requestAnimationFrame = function(a,b){while(a--&&!(b=window["oR0msR0mozR0webkitR0r".split(0)[a]+"equestAnimationFrame"]));return b||function(a){setTimeout(a,15)}}(5);

})(Zepto);
