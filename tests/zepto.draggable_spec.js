describe("Draggable", () => {

  var dragEl;

  beforeEach(() => {
    dragEl = $('<div class="drag"></div>').appendTo('body');
    dragEl.css({ top: 0, left: 0 });
  });

  afterEach(() => {
    dragEl.remove();
  });

  it("should drag element to a new position", () => {
    dragEl.draggable();
    dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
    var o = dragEl.offset();
    expect(o.left).toBe(480);
    expect(o.top).toBe(280);
  });

  describe("callbacks", () => {
    it("should call start callback", () => {
      var callback = jasmine.createSpy();
      dragEl.draggable({ start: callback });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalledWith(dragEl);
    });

    it("should call stop callback", () => {
      var callback = jasmine.createSpy();
      dragEl.draggable({ stop: callback });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalledWith(dragEl);
    });

    it("should call drag callback", () => {
      var callback = jasmine.createSpy();
      dragEl.draggable({ drag: callback });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalledWith(dragEl);
    });
  });

  describe("events", () => {
    it("should trigger draggable:start event", () => {
      var callback = jasmine.createSpy();
      dragEl.draggable();
      dragEl.on('draggable:start', callback);
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalled();
    });

    it("should trigger draggable:end event", () => {
      var callback = jasmine.createSpy();
      dragEl.draggable();
      dragEl.on('draggable:end', callback);
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
      expect(callback).wasCalled();
    });
  });

  describe("options", () => {
    it("should delegate drag to selector element", () => {
      $('body').draggable({ selector: ".drag" });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 300, y: 300 });
      var o = dragEl.offset();
      expect(o.left).toBe(280);
      expect(o.top).toBe(280);
    });

    it("should revert dragable to original position", () => {
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


    it("should execute in different context", () => {
      var ctx = {};
      var callback = jasmine.createSpy();
      dragEl.draggable({
        context: ctx,
        start() {
          expect(this).toBe(ctx);
        },
        drag() {
          expect(this).toBe(ctx);
        },
        stop() {
          expect(this).toBe(ctx);
        }
      });
      dragEl.simdrag({ x: 20, y: 20 }, { x: 500, y: 300 });
    });
  });
});
