describe("Draggable", function() {

  beforeEach(function () {
  });

  it("should drag element to a new position", function () {
    $('#drag1').draggable();
    $('#drag1').simulate('mousedown');
    $(document)
      .simulate('mousemove', { x: 500, y: 300 })
      .simulate('mouseup');

    var o = $('#drag1').offset();
    expect(o.left).toBe(480);
    expect(o.top).toBe(280);
  });

  it("should bind to selector", function () {
    $('body').draggable({ selector: ".test" });

    $('body').append('<div class="test">test</div>');

    $('.test').simulate('mousedown');
    $(document)
      .simulate('mousemove', { x: 200, y: 200 })
      .simulate('mouseup');

    var o = $('.test').offset();
    expect(o.left).toBe(180);
    expect(o.top).toBe(180);

    $('.test').remove().appendTo($('#wrapper'));
    $('.test').simulate('mousedown');
    $(document)
      .simulate('mousemove', { x: 600, y: 600 })
      .simulate('mouseup');

    o = $('.test').offset();
    expect(o.left).toBe(580);
    expect(o.top).toBe(580);
  });
});
