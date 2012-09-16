[![build status](https://secure.travis-ci.org/mkuklis/asEvented.png)](http://travis-ci.org/mkuklis/zepto.dd.js)
# zepto.dd.js

Micro (only 3kb) drag & drop library for Zepto with touch and mouse events.


## Install

    <script src="zepto.dd.min.js"></script>

##Simple Usage:

###drag:

    dragEl.draggable();

###drop:

    dropEl.droppable();

## Callbacks:

###drag:
Drag supports three callbacks: `start`, `drag`, and `stop`. Start is fired at the start of the drag; drag during the drag; and stop when dragging stops.


    dragEl.draggable({
      start: function () {

      },
      drag: function () {

      },
      stop: function () {

      }
    });

###drop:
At the moment drop supports one callback `drop` which fires when draggable element id dropped into droppable element. Drop callback can be used to validate a drop action by returning `true` - successful drop or `false` - unsuccessful drop.

    dragEl.draggable({
      drop: function (e, dragEl, dropEl) {
         // code here

         return true;
      }
    });

## Events:
###drag:

coming soon

###drop:

coming soon

## Options:
###drag:

coming soon

###drop:

coming soon


##License:
<pre>
(The MIT License)

Copyright (c) 2012 Michal Kuklis

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</pre>

