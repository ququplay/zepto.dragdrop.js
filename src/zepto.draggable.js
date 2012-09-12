/**
 * zepto.dd.js v0.0.1 - Drag & Drop for Zepto with touch and mouse events.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

(function ($) {

  "use strict";

  var dragEl, opts, ctx;

  function dragStart(e) {
    var offset, zIndex, $this;
    if (!dragEl) {
      $this = $(this);
      offset = $this.offset();
      setZIndex($this, 1);
      $this.data(offset);

      if (opts.revert && !$this.data('revert')) {
        $this.data({
          rtop: offset.top,
          rleft: offset.left,
          revert: opts.revert });
      }

      ctx.trigger('dragstart', [e, $this]);
      opts.beforeDrag && opts.beforeDrag.call(ctx, $this);
      dragEl = $this;
    }

    return false;
  }

  function dragEnd(e) {
    if (dragEl) {
      e.el = dragEl;
      setZIndex(dragEl, -1);
      ctx.trigger('dragend', [e, dragEl]);
      opts.afterDrag && opts.afterDrag.call(ctx, dragEl);
      dragEl = null;
    }

    return false;
  }

  function touchDrag(e) {
    if (dragEl &&
        e.targetTouches.length > 0) {
      var touch = e.targetTouches[0];
      setPosition(touch.pageX, touch.pageY);
    }

    return false;
  }

  function mouseDrag (e) {
    if (dragEl) {
      setPosition(e.pageX, e.pageY);
    }

    return false;
  }

  function setPosition(x, y) {
    var h = dragEl.height();
    var w = dragEl.width();
    var offset = findOffset();
    var left = x - w / offset;
    var top = y - h / offset;
    dragEl.css({ left: left, top: top });
  }

  function findOffset() {
    var ow = dragEl.data('width');
    var nw = dragEl.width();
    return  (ow > nw) ? 2 * ow / nw : 2 * nw / ow;
  }

  function setZIndex(el, val) {
    var zIndex = parseInt(el.css('z-index'), 10);
    el.css('z-index', zIndex + val);
  }

  // draggable constructor
  $.fn.draggable = function (options) {
    var eventName = ($.touchable) ? "touchstart" : "mousedown";

    opts = options || {};
    ctx = (opts.context) ? opts.context : $(this);

    return this.each(function () {
      if (opts.selector) {
        $(this).on(eventName, opts.selector, dragStart);
      }
      else {
        $(this).on(eventName, dragStart);
      }
    });
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
