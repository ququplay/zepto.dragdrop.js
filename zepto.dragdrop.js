/**
 * zepto.dragdrop.js v0.1.1 - Drag & Drop for Zepto with touch and mouse events.
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
    var o = el.offset();

    this.opts = opts || {};
    this.ctx = this.opts.context || el;
    this.pos = { left: o.left, top: o.top };

    if (this.opts.selector) {
      el.on(eventName, this.opts.selector, $.proxy(this.start, this));
    }
    else {
      el.on(eventName, $.proxy(this.start, this));
    }
  }

  Draggable.prototype = {
    constructor: Draggable,

    start: function (e) {
      var offset, zIndex;
      if (!draggable) {
        this.curEl = $(e.currentTarget);
        offset = this.curEl.offset();
        this.curEl.data(offset);
        this.setRevert(offset);
        this.setZIndex(1);
        this.opts.start && this.opts.start.call(this.ctx, this.curEl);
        this.curEl.trigger('draggable:start', [e, this.curEl]);

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
        this.opts.stop && this.opts.stop.call(this.ctx, this.curEl);
        this.curEl.trigger('draggable:end', [e, this.curEl]);

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

/**
 * zepto.dragdrop.js v0.1.1 - Drag & Drop for Zepto with touch and mouse events.
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

    e.preventDefault();
    e.stopPropagation();
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

//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()

;(function($) {
  var data = {}, dataAttr = $.fn.data, camelize = $.zepto.camelize,
    exp = $.expando = 'Zepto' + (+new Date())

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes, function(i, attr){
      if (attr.name.indexOf('data-') === 0)
        store[camelize(attr.name.replace('data-', ''))] = attr.value
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        this.length === 0 ? undefined : getData(this[0], name) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names, function(){ delete store[camelize(this)] })
    })
  }
})(Zepto);

(function ($) {

  "use strict";

  // for testing
  var phantom = navigator.userAgent.match(/PhantomJS/);

  $.touchable = (function () {
    // http://modernizr.github.com/Modernizr/touch.html
    return !!('ontouchstart' in window) && !phantom
  })();

  // helpers
  $.getPos = function (e) {
    var pos = {}, touch;

    if ($.touchable) {
      touch = (e.targetTouches.length) ? e.targetTouches[0] : e.changedTouches[0];
      pos = { x: touch.pageX, y: touch.pageY };
    }
    else {
      pos = { x: e.pageX, y: e.pageY };
    }

    return pos;
  }

  var doc = document;

  $.elementFromPoint = function (x, y) {
    var moved = false;
    var yo = window.pageYOffset;
    var xo = window.pageXOffset;
    var h = window.innerHeight;
    var w = window.innerWidth;

    if (yo > 0) {
      moved = (!doc.elementFromPoint(0, yo + h - 1));
    } else if (xo > 0) {
      moved = (!doc.elementFromPoint(xo + w - 1, 0));
    }

    return (moved) ?
      doc.elementFromPoint(x - xo, y - yo) :
      doc.elementFromPoint(x, y);
  }

   // https://gist.github.com/997619
  window.requestAnimationFrame = function(a,b){while(a--&&!(b=window["oR0msR0mozR0webkitR0r".split(0)[a]+"equestAnimationFrame"]));return b||function(a){setTimeout(a,15)}}(5);

})(Zepto);
