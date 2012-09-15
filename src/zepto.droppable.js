/**
 * zepto.dd.js v0.0.1 - Drag & Drop for Zepto with touch and mouse events.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

(function ($) {

  "use strict";

  function Droppable(el, opts) {
    this.el = el;
    this.opts = opts || {};
  }

  Droppable.prototype.drop = function (e) {
    var isDrop = true;
    var dragEl = e.el;

    // TODO: handle other types of selectors
    if (this.opts.selector && !this.el.hasClass(this.opts.selector)) {
      isDrop = false;
    }
    if (isDrop && this.opts.drop) {
      isDrop &= this.opts.drop.call(this.el, e, dragEl, this.el);
    }

    // only revert if element was not dropped
    if (!isDrop && dragEl.data('revert')) {
      this.revert(dragEl);
    }
  };

  Droppable.prototype.revert = function (dragEl) {
    var l = dragEl.data('rleft');
    var t = dragEl.data('rtop');
    var rev = dragEl.data('revert');

    if ($.isFunction(rev)) {
      rev.call(dragEl);
    }

    dragEl.css({ left: l, top: t });
  };

  // helpers
  function getPos(e) {
    var x, y;
    if ($.touchable) {
      if (e.targetTouches.length == 1) {
        x = e.targetTouches[0].x, y = e.targetTouches[0].y;
      }
    }
    else {
      x = e.pageX, y = e.pageY;
    }
    return { x: x, y: y };
  }

  function dropOrRevert(e) {
    var droppable, pos, dragEl, dropEl;

    if (e.el) {
      pos = getPos(e);
      dragEl = e.el;
      dragEl.css({ display: 'none' });
      dropEl = $.elementFromPoint(pos.x, pos.y);
      dragEl.css({ display: 'block' });
      droppable = $(dropEl).data('droppable');
      if (droppable) {
        droppable.drop(e);
      }
      else if (dragEl.data('revert')){
        Droppable.prototype.revert(dragEl);
      }
    }

    return false;
  }

  // droppable api
  $.fn.droppable = function (options) {
    return this.each(function () {
      var $this = $(this);
      var droppable = $this.data('droppable');
      if (!droppable) {
        $this.data('droppable', (droppable = new Droppable($this, options)));
      }
    });
  };

  // bind mouse/touch event
  $(function () {
    $(document).on("mouseup touchend", dropOrRevert);
  });

})(Zepto);
