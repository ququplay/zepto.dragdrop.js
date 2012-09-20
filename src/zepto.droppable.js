/**
 * zepto.dragdrop.js v0.1.0 - Drag & Drop for Zepto with touch and mouse events.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

;(function ($) {

  "use strict";

  function Droppable(el, opts) {
    this.el = el;
    this.opts = opts || {};
    this.ctx = this.opts.context || this.el;
  }

  Droppable.prototype.drop = function (e, pos) {
    var isDrop = true;
    var dragEl = $(e.el);

    if (this.opts.drop) {
      isDrop &= this.opts.drop.call(this.ctx, e, dragEl, this.el, pos);
    }

    isDrop && $(this.ctx).trigger('droppable:drop', [e, dragEl, this.el, pos]);

    // only revert if element was not dropped
    if (!isDrop && dragEl.data('revert')) {
      this.revert(dragEl);
    }
  };

  Droppable.prototype.revert = function (dragEl) {
    var left = dragEl.data('rleft');
    var top = dragEl.data('rtop');
    var rev = dragEl.data('revert');

    if ($.isFunction(rev)) {
      rev.call(dragEl);
    }

    dragEl.css({ left: left, top: top });
  };


  // helpers
  function dropOrRevert(e) {
    var droppable, pos;
    var dragEl = e.el;

    if (dragEl) {
      pos = $.getPos(e);
      droppable = findDroppable(e, pos);
      if (droppable) {
        droppable.drop(e, pos);
      }
      else if (dragEl.data('revert')){
        Droppable.prototype.revert(dragEl);
      }
    }

    return false;
  }

  function findDroppable(e, pos) {
    var droppable, dropEl;
    var dragEl = e.el;

    dragEl.css({ display: 'none' });
    dropEl = $.elementFromPoint(pos.x, pos.y);
    dragEl.css({ display: 'block' });
    return $(dropEl).data('droppable');
  }

  // droppable api
  $.fn.droppable = function (options) {
    return this.each(function () {
      var $this = $(this);
      var droppable = $this.data('droppable');
      if (!droppable) {
        droppable = new Droppable($this, options);
        $this.data('droppable', droppable);
      }
    });
  };

  // bind mouse/touch event
  $(function () {
    $(document).on("mouseup touchend", dropOrRevert);
  });

})(Zepto);
