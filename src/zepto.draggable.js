/**
 * zepto.dd.js v0.0.1 - Drag & Drop for Zepto with touch and mouse events.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

(function ($) {

  "use strict";

  var el, opts;

  function dragStart(e) {
    var offset, zIndex, $this;

    if (!el) {
      $this = $(this);
      offset = $this.offset();
      zIndex = parseInt($this.css('z-index'), 10);
      $this.css('z-index', zIndex + 1);
      $this.data(offset);

      if (opts.revert && !$this.data('revert')) {
        $this.data({
          rtop: offset.top,
          rleft: offset.left,
          revert: opts.revert });
      }

      opts.beforeDrag && opts.beforeDrag.call($this);
      el = $this;
    }

    return false;
  }

  function dragEnd(e) {
    if (el) {
      e.el = el;
      el.css('z-index', 1);
      opts.afterDrag && this.opts.afterDrag.call(el);
      el = null;
    }

    return false;
  }

  function touchDrag(e) {
    if (el &&
        e.targetTouches.length > 0) {
      var touch = e.targetTouches[0];
      setPosition(touch.pageX, touch.pageY);
    }

    return false;
  }

  function mouseDrag (e) {
    if (el) {
      setPosition(e.pageX, e.pageY);
    }

    return false;
  }

  function setPosition(x, y) {
    var h = el.height();
    var w = el.width();
    var offset = findOffset();
    var left = x - w / offset;
    var top = y - h / offset;
    el.css({ left: left, top: top });
  }

  function findOffset() {
    var ow = el.data('width');
    var nw = el.width();
    return  (ow > nw) ? 2 * ow / nw : 2 * nw / ow;
  }

  // draggable constructor
  $.fn.draggable = function (options) {
    opts = options || {};
    var eventName = ($.touchable) ? "touchstart" : "mousedown";
    $(this).on(eventName, dragStart);
  }

  $(function () {
    //TODO: support unbind
    if ($.touchable) {
      $(document).on({ touchmove: touchDrag, touchend: dragEnd });
    }
    else {
      $(document).on({ mousemove: mouseDrag, mouseup: dragEnd });
    }
  });

})(Zepto);
