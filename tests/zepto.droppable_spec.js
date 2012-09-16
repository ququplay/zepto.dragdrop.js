describe("Droppable", function() {

  var dragEl, dropEl;

  beforeEach(function () {
    dragEl = $('<div class="drag"></div>').appendTo('body');
    dropEl = $('<div class="drop"></div>').appendTo('body');

    dragEl.css({ top: 0, left: 0 });
    dropEl.css({ top: 300, left: 300 });
  });

  it("should drop element", function () {
    var callback = jasmine.createSpy();

    dragEl.draggable();
    dropEl.droppable({ drop: callback });
    dragEl.simdrag({ x: 20, y: 20 }, { x: 350, y: 350 });

    expect(callback).wasCalled();
  });
});
