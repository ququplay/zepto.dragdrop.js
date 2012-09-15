(function ($) {

  "use strict";

  $.touchable = (function () {
    return !!('ontouchstart' in window);
  })();

  var doc = document;

  $.elementFromPoint = function (x, y) {
    var moved = false;

    if (window.pageYOffset > 0) {
      moved = (doc.elementFromPoint(0, window.pageYOffset + window.innerHeight -1) == null);
    } else if (pageXOffset > 0) {
      moved = (doc.elementFromPoint(window.pageXOffset + window.innerWidth -1, 0) == null);
    }

    if (moved) {
      return doc.elementFromPoint(x - window.pageXOffset, y - window.pageYOffset);
    } else {
      return doc.elementFromPoint(x, y);
    }
  }

})(Zepto);
