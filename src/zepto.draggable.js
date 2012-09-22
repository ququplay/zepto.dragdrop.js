/**
 * zepto.dragdrop.js v0.1.1 - Drag & Drop for Zepto with touch and mouse events.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

;(function ($) {

  "use strict";

  var draggable; // current draggable

  function Draggable(el, opts) {
    var eventName = ($.touchable) ? "touchstart" : "mousedown";
    var o = el.offset();
    this.el = el;
    this.opts = opts || {};
    this.ctx = this.opts.context || this.el;
    this.pos = { left: o.left, top: o.top };

    if (this.opts.selector) {
      this.el.on(eventName, this.opts.selector, $.proxy(this.start, this));
    }
    else {
      this.el.on(eventName, $.proxy(this.start, this));
    }
  }

  Draggable.prototype = {
    constructor: Draggable,

    start: function (e) {
      var offset, zIndex;
      if (!draggable) {
        this.curEl = $(e.target);
        offset = this.curEl.offset();
        this.curEl.data(offset);
        this.setRevert(offset);
        this.setZIndex(1);

        this.ctx.trigger && this.ctx.trigger('draggable:start', [e, this.curEl]);
        this.opts.start && this.opts.start.call(this.ctx, this.curEl);
        this.setPosition(e);
        draggable = this;
        redraw();
      }

      e.preventDefault();
      e.stopPropagation();
    },

    stop: function (e) {
      if (draggable) {
        e.el = this.curEl;
        this.setZIndex(-1);
        this.ctx.trigger && this.ctx.trigger('draggable:end', [e, this.curEl]);
        this.opts.stop && this.opts.stop.call(this.ctx, this.curEl);
        redraw();
        draggable = null;
      }

      e.preventDefault();
      e.stopPropagation();
    },

    drag: function () {
      this.curEl.css(this.pos);
      this.opts.drag && this.opts.drag.call(this.ctx, this.curEl);
    },

    setPosition: function (e) {
      var pos = $.getPos(e);
      var h = this.curEl.height();
      var w = this.curEl.width();
      var offset = this.findOffset();
      this.pos = {
        left: pos.x - w / offset,
        top: pos.y - h / offset };

      e.preventDefault();
      e.stopPropagation();
    },

    setRevert: function (offset) {
      if (this.opts.revert && !this.curEl.data('revert')) {
        this.curEl.data({
          rtop: offset.top,
          rleft: offset.left,
          revert: this.opts.revert });
      }
    },

    findOffset: function () {
      var ow = this.curEl.data('width');
      var nw = this.curEl.width();

      return  (ow > nw) ? 2 * ow / nw : 2 * nw / ow;
    },

    setZIndex: function (val) {
      var zIndex = parseInt(this.curEl.css('z-index'), 10);
      this.curEl.css('z-index', zIndex + val);
    }
  };

  // helpers
  function redraw() {
    if (draggable) {
      draggable.drag();
      window.requestAnimationFrame(redraw);
    }
    return false;
  }

  // draggable plugin
  $.fn.draggable = function (options) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('draggable');
      if (!data) {
        data = new Draggable($this, options);
        $this.data('draggable', data);
      }
    });
  }

  $(function () {
    //TODO: support unbind
    $(document).on("mousemove touchmove mouseup touchend", function (e) {
      if (!draggable) return;
      switch (e.type) {
        case "mousemove":
        case "touchmove":
          draggable.setPosition(e);
          break;
        case "mouseup":
        case "touchend":
          draggable.stop(e);
          break;
      }

      e.preventDefault();
      e.stopPropagation();
    });
  });

})(Zepto);
