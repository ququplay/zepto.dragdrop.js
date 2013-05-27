[![build status](https://secure.travis-ci.org/mkuklis/zepto.dragdrop.js.png)](http://travis-ci.org/mkuklis/zepto.dragdrop.js)
# zepto.dragdrop.js

Micro (only 4kb) drag & drop library for [Zepto](http://zeptojs.com/) with touch and mouse events.


## Install

    <script src="zepto.dragdrop.min.js"></script>

##Simple Usage

###drag

    dragEl.draggable();

###drop

    dropEl.droppable();

## Callbacks

###drag
Drag supports three callbacks: `start`, `drag`, and `stop`. Start is fired at the start of the drag; drag during the drag; and stop when dragging stops.

    dragEl.draggable({
      start: function (e, dragEl) {
        // your code here
      },
      drag: function (e, dragEl) {
        // your code here
      },
      stop: function (e, dragEl) {
        // your code here
      }
    });

###drop
At the moment drop supports one callback `drop` which fires when draggable element is dropped into droppable element. Drop callback can be used to validate a drop action by returning `true` - successful drop or `false` - unsuccessful drop.

    dragEl.draggable({
      drop: function (e, dragEl, dropEl, pos) {
         // your code here
         return true;
      }
    });

## Events

###drag

It's possible to bind to three different events `draggable:start`, `draggable:drag` and `draggable:stop` emitted by draggable.

    dragEl.on('draggable:start', function () {
      // your code goes here
    });


###drop

Droppable emits one event `droppable:drop` when element is successfully dropped.

## Options

###drag

####selector (class name)

Delegates to elements defined by selector instead of the main object.
This is useful if you have a lot of draggable elements. Instead of binding to each element you can 
setup draggable to their parent and delegate to dragging elements by providing selector.

####context

Changes context in which callbacks will be executed.

####revert

When set to `true` draggable element goes back to its starting position in case when drop fails.

###drop

####context

Changes context in which callbacks will be executed.


##License:
<pre>
(The MIT License)
</pre>

