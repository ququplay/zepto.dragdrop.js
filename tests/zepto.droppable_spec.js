describe("Droppable", function() {

  beforeEach(function () {
  });

  it("should drop element to droppable", function () {
   //  console.log('dropppable');
    $('#drag2').draggable();
    //$('#drap').droppable();

    $('#drag2').simulate('mousedown');
    $(document)
      .simulate('mousemove', { x: 600, y: 600 })
      .simulate('mouseup');

    var o = $('#drag2').offset();
   // console.log(o);
    expect(o.left).toBe(580);
    expect(o.top).toBe(580);
  });
});
