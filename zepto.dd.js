/**
 * zepto.dd.js v0.1.0 - Drag & Drop for Zepto with touch and mouse events.
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

        $(this.ctx).trigger('draggable:start', [e, this.curEl]);
        this.opts.start && this.opts.start.call(this.ctx, this.curEl);
        draggable = this;
      }

      return false;
    },

    stop: function (e) {
      if (draggable) {
        e.el = this.curEl;
        this.setZIndex(-1);
        $(this.ctx).trigger('draggable:end', [e, this.curEl]);
        this.opts.stop && this.opts.stop.call(this.ctx, this.curEl);
        draggable = null;
      }

      return false;
    },

    drag: function (e) {
      var pos = $.getPos(e);
      this.setPosition(pos.x, pos.y);
      this.opts.drag && this.opts.drag.call(this.ctx, this.curEl);

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
          draggable.drag(e);
          break;
        case "mouseup":
        case "touchend":
          draggable.stop(e);
          break;
      }
    });
  });

})(Zepto);

/**
 * zepto.dd.js v0.1.0 - Drag & Drop for Zepto with touch and mouse events.
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

  Droppable.prototype.drop = function (e) {
    var isDrop = true;
    var dragEl = e.el;

    // TODO: handle other types of selectors
    if (this.opts.selector && !this.el.hasClass(this.opts.selector)) {
      isDrop = false;
    }
    if (isDrop && this.opts.drop) {
      isDrop &= this.opts.drop.call(this.ctx, e, dragEl, this.el);
    }

    isDrop && $(this.ctx).trigger('droppable:drop', [e, dragEl, this.el]);

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

  function dropOrRevert(e) {
    var droppable, pos, dragEl, dropEl;

    if (e.el) {
      pos = $.getPos(e);
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

  $.touchable = (function () {
    // http://modernizr.github.com/Modernizr/touch.html
    return typeof Touch == "object"
    // return !!('ontouchstart' in window);
  })();

  // helpers
  $.getPos = function (e) {
    var pos, touch;

    if ($.touchable) {
      if (e.targetTouches.length == 1) {
        touch = e.targetTouches[0];
        pos = { x: touch.x, y: touch.y };
      }
    }
    else {
      pos = { x: e.pageX, y: e.pageY };
    }

    return pos;
  }

  var doc = document;

  $.elementFromPoint = function (x, y) {
    var moved = false;

    if (window.pageYOffset > 0) {
      moved = (doc.elementFromPoint(0, window.pageYOffset + window.innerHeight -1) === null);
    } else if (window.pageXOffset > 0) {
      moved = (doc.elementFromPoint(window.pageXOffset + window.innerWidth -1, 0) === null);
    }

    if (moved) {
      return doc.elementFromPoint(x - window.pageXOffset, y - window.pageYOffset);
    } else {
      return doc.elementFromPoint(x, y);
    }
  }

})(Zepto);
