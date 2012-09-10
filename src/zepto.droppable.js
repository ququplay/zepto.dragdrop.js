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

  function isInRange(x, y) {
    var o = el.offset();
    return x >= o.left && x <= o.left + o.width &&
      y >= o.top && y <= o.top + o.height;
  }

  function dropOrRevert(e, x, y) {
    if (isInRange(x, y)) {
       drop(e, x, y);
    }
    else if (e.dragEl.data('revert')) {
      revert(e.dragEl);
    }
  }

  function touchDrop(e) {
    if (e.dragEl && e.changedTouches.length == 1) {
      var touch = e.changedTouches[0];
      dropOrRevert(e, touch.pageX, touch.pageY);
    }

    return false;
  }

  function mouseDrop(e) {
    if (e.dragEl) {
      dropOrRevert(e, e.pageX, e.pageY);
    }

    return false;
  }

  function drop(e, x, y) {
    var isDrop = true;
    var dragEl = e.dragEl;
    dragEl.css({ display: 'none' });
    var dropEl = $(document.elementFromPoint(x, y));
    dragEl.css({ display: 'block' });

    // TODO: handle other types of selectors
    if (opts.selector && !dropEl.hasClass(opts.selector)) {
      isDrop = false;
    }
    if (isDrop && opts.drop) {
      isDrop &= opts.drop.call(el, e, dragEl, $(dropEl));
    }

    // only revert if element was not dropped
    if (!isDrop && dragEl.data('revert')) {
      revert(dragEl);
    }
  }

  function revert(dragEl) {
    var l = dragEl.data('rleft');
    var t = dragEl.data('rtop');
    var rev = dragEl.data('revert');

    if ($.isFunction(rev)) {
      rev.call(el);
    }

    dragEl.css({ left: l, top: t });
  }

  // droppable api
  $.fn.droppable = function (options) {
    opts = options || {};
    el = this;
  };

  $(function () {
    if ($.touchable) {
      $(document).on("touchend", touchDrop);
    }
    else {
      $(document).on("mouseup", mouseDrop);
    }
  });
})(Zepto);
