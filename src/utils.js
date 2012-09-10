(function ($) {

  "use strict";

  $.touchable = (function () {
    return !!('ontouchstart' in window);
  })();

})(Zepto);
