describe("Droppable", function() {

  var dragEl, dropEl;

  beforeEach(function () {
    dragEl = $('<div class="drag"></div>').appendTo('body');
    dropEl = $('<div class="drop"></div>').appendTo('body');

    dragEl.css({ top: 0, left: 0 });
    dropEl.css({ top: 100, left: 100 });
  });

  afterEach(function () {
    dragEl.remove();
    dropEl.remove();
  });

  it("should drop element", function () {
    var callback = jasmine.createSpy();

    dragEl.draggable();
    dropEl.droppable({ drop: callback });
    dragEl.simdrag({ x: 20, y: 20 }, { x: 120, y: 120 });
    expect(callback).wasCalled();
  });

  describe("options", function() {
    it("should execute in different context", function () {
      var ctx = {};
      dragEl.draggable();
      dropEl.droppable({
        context: ctx,
        drop: function () {
          expect(this).toBe(ctx);
        }
      });

      dragEl.simdrag({ x: 20, y: 20 }, { x: 120, y: 120 });
    });
  });

  describe("events", function () {
    it("should trigger droppable:drop event", function () {
      var callback = jasmine.createSpy();
      dragEl.draggable();
      dropEl.droppable();

      dropEl.on('droppable:drop', callback);
      dragEl.simdrag({ x: 20, y: 20 }, { x: 120, y: 120 });
      expect(callback).wasCalled();
    });
  });

  describe("events", function () {
    it("should pass dropEl, dragEl and position to drop callback", function () {
      var fromPos = { x: 20, y: 20 };
      var toPos = { x: 120, y: 120 };

      dragEl.draggable();
      dropEl.droppable({
        drop: function (e, drag, drop, pos) {
          expect(pos).toEqual(toPos);
          expect(drag).toEqual(dragEl);
          expect(drop).toEqual(dropEl);
        }
      });

      dragEl.simdrag(fromPos, toPos);

    });
  });
});
