describe("Draggable", function() {

  beforeEach(function () {
    $('#drag1').draggable();
  });

  it("should drag element to a new position", function () {

    $('#drag1').simulate('mousedown');
    $(document)
      .simulate('mousemove', { x: 500, y: 300 })
      .simulate('mouseup');

    var o = $('#drag1').offset();
    expect(o.left).toBe(480);
    expect(o.top).toBe(280);

  });
});
