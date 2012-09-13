/**
 * zepto.dd.js v0.0.1 - Drag & Drop for Zepto with touch and mouse events.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

(function ($) {

  "use strict";

  var draggable; // current draggable

  function Draggable(el, opts) {
    var eventName = ($.touchable) ? "touchstart" : "mousedown";

    this.el = el;
    this.opts = opts || {};
    this.ctx = this.opts.context || this.el;

    if (this.opts.selector) {
      this.el.on(eventName, this.opts.selector, $.proxy(this.dragStart, this));
    }
    else {
      this.el.on(eventName, $.proxy(this.dragStart, this));
    }
  }

  Draggable.prototype = {
    constructor: Draggable,

    dragStart: function (e) {
      var offset, zIndex;

      if (!draggable) {
        this.curEl = $(e.target);
        offset = this.curEl.offset();

        this.setZIndex(this.curEl, 1);
        this.curEl.data(offset);

        if (this.opts.revert && !this.curEl.data('revert')) {
          this.curEl.data({
            rtop: offset.top,
            rleft: offset.left,
            revert: this.opts.revert });
        }

        this.ctx.trigger('dragstart', [e, this.curEl]);
        this.opts.beforeDrag && this.opts.beforeDrag.call(this.ctx, this.curEl);
        draggable = this;
      }

      return false;
    },

    dragEnd: function (e) {
      if (draggable) {
        e.el = this.curEl;
        this.setZIndex(this.curEl, -1);
        this.ctx.trigger('dragend', [e, this.curEl]);
        this.opts.afterDrag && this.opts.afterDrag.call(this.ctx, this.curEl);
        draggable = null;
      }

      return false;
    },

    drag: function (e) {
      if ($.touchable) {
        if (e.targetTouches.length > 0) {
          var touch = e.targetTouches[0];
          this.setPosition(touch.pageX, touch.pageY);
        }
      }
      else {
        this.setPosition(e.pageX, e.pageY);
      }

      return false;
    },

    setPosition: function (x, y) {
      var h = this.curEl.height();
      var w = this.curEl.width();
      var offset = this.findOffset();
      var left = x - w / offset;
      var top = y - h / offset;
      this.curEl.css({ left: left, top: top });
    },

    findOffset: function () {
      var ow = this.curEl.data('width');
      var nw = this.curEl.width();
      return  (ow > nw) ? 2 * ow / nw : 2 * nw / ow;
    },

    setZIndex: function (el, val) {
      var zIndex = parseInt(el.css('z-index'), 10);
      el.css('z-index', zIndex + val);
    }
  };

  // draggable plugin
  $.fn.draggable = function (options) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('draggable');
      if (!data) {
        $this.data('draggable', (data = new Draggable($this, options)));
      }
    });
  }

  $(function () {
    //TODO: support unbind
    $(document).on("mousemove touchmove mouseup touchend", function (e) {
      if (!draggable) return;
      switch(e.type) {
        case "mousemove":
        case "touchmove":
          Draggable.prototype.drag.call(draggable, e);
          break;
        case "mouseup":
        case "touchend":
          Draggable.prototype.dragEnd.call(draggable, e);
          break;
      }
    });
  });

})(Zepto);
