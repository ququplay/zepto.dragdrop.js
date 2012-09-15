describe("Draggable", function() {

  var dragEl, dropEl;

  beforeEach(function () {
    dragEl = $('<div class="drag"></div>').appendTo('body');
    dragEl.css({top: 0, left: 0});
  });

  afterEach(function () {
    dragEl.remove();
  });

  it("should drag element to a new position", function () {
    dragEl.draggable();
    dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
    var o = dragEl.offset();
    expect(o.left).toBe(480);
    expect(o.top).toBe(280);
  });

  describe("callbacks", function () {
    it("should call start callback", function () {
      var callback = jasmine.createSpy();
      dragEl.draggable({ start: callback });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalledWith(dragEl);
    });

    it("should call stop callback", function () {
      var callback = jasmine.createSpy();
      dragEl.draggable({ stop: callback });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalledWith(dragEl);
    });

    it("should call drag callback", function () {
      var callback = jasmine.createSpy();
      dragEl.draggable({ drag: callback });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalledWith(dragEl);
    });
  });

  describe("events", function () {
    it("should trigger draggable:start event", function () {
      var callback = jasmine.createSpy();
      dragEl.draggable();
      dragEl.on('draggable:start', callback);
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalled();
    });

    it("should trigger draggable:end event", function () {
      var callback = jasmine.createSpy();
      dragEl.draggable();
      dragEl.on('draggable:end', callback);
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalled();
    });
  });

  describe("options", function() {
    it("should delegate drag to selector element", function () {
      $('body').draggable({ selector: ".drag" });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 300, y: 300 });
      var o = dragEl.offset();
      expect(o.left).toBe(280);
      expect(o.top).toBe(280);
    });

    it("should revert dragable to original position", function () {
      // set starting position
      dragEl.css({ top: 200, left: 200 });
      dragEl.draggable({
        revert: true
      });

      dragEl.simdrag({ x: 220, y: 220 }, { x: 500, y: 500 });
      var o = dragEl.offset();
      expect(o.left).toBe(200);
      expect(o.top).toBe(200);
    });


    it("should execute in different context", function () {
      var ctx = {};
      var callback = jasmine.createSpy();
      dragEl.draggable({
        context: ctx,
        start: function () {
          expect(this).toBe(ctx);
        },
        drag: function () {
          expect(this).toBe(ctx);
        },
        stop: function () {
          expect(this).toBe(ctx);
        }
      });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
    });
  });
});
