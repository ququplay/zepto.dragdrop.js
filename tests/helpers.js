(function ($) {
  // simulate
  $.fn.simdrag = function (fromPos, toPos) {
    return this.each(function () {
      $(this).simulate('mousedown', fromPos);
      $(document)
        .simulate('mousemove', toPos)
        .simulate('mouseup');
    });
  }
})(Zepto);
