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
    else if (e.el.data('revert')) {
      revert(e.el);
    }
  }

  function touchDrop(e) {
    if (el && e.el && e.changedTouches.length == 1) {
      var touch = e.changedTouches[0];
      dropOrRevert(e, touch.pageX, touch.pageY);
    }

    return false;
  }

  function mouseDrop(e) {
    if (el && e.el) {
      dropOrRevert(e, e.pageX, e.pageY);
    }

    return false;
  }

  function drop(e, x, y) {
    var isDrop = true;
    var dragEl = e.el;
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
      rev.call(dragEl);
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
})(Zepto)

(function ($) {

  "use strict";

  $.touchable = (function () {
    return !!('ontouchstart' in window);
  })();

})(Zepto);
