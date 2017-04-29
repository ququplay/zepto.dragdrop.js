/**
 * zepto.dragdrop.js v0.1.1 - Drag & Drop for Zepto with touch and mouse events.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

(($ => {

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

    isDrop && this.el.trigger('droppable:drop', [e, dragEl, this.el, pos]);

    // only revert if element was not dropped
    if (!isDrop && dragEl.data('revert')) {
      this.revert(dragEl);
    }
  };

  Droppable.prototype.revert = dragEl => {
    var left = dragEl.data('rleft');
    var top = dragEl.data('rtop');
    var rev = dragEl.data('revert');

    if ($.isFunction(rev)) {
      rev.call(dragEl);
    }

    dragEl.css({ left, top });
  };


  // helpers
  function dropOrRevert(e) {
    var droppable;
    var pos;
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

    e.preventDefault();
    e.stopPropagation();
  }

  function findDroppable(e, pos) {
    var droppable;
    var dropEl;
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
  $(() => {
    $(document).on("mouseup touchend", dropOrRevert);
  });

}))(Zepto);
