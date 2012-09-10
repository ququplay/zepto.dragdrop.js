(function ($) {

  var matchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
  }

  function findEventType(eventName, matchers) {
    for (var name in matchers) {
      if (matchers[name].test(eventName)) {
        return name;
      }
    }
  }

  $.fn.simulate = function (eventName, options) {
    var event;

    var defaults = {
      x: 0,
      y: 0,
      button: 0,
      detail: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true
    };

    var o = $.extend(defaults, options || {});
    var eventType = findEventType(eventName, matchers);

    if (!eventType) {
      throw new SyntaxError('Event not supported');
    }

    event = document.createEvent(eventType);

    return this.each(function () {
      if (eventType == 'html') {
        event.initEvent(eventName, o.bubbles, o.cancelable);
      }
      else {
        event.initMouseEvent(
          eventName,
          o.bubbles,
          o.cancelable,
          document.defaultView,
          o.detail,
          o.x,
          o.y,
          o.x,
          o.y,
          o.ctrlKey,
          o.altKey,
          o.shiftKey,
          o.metaKey,
          o.button,
          this);
      }

      this.dispatchEvent(event);
    });
  }
})(Zepto);
