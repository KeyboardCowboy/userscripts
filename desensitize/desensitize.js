(function($) {
  "use strict";

  $(document).ready(function() {
    $("#main img").each(function() {
      var $img = $(this);

      var h = $img.height();
      var w = $img.width();

      // Force set the height and width.
      $img.height(h);
      $img.width(w);

      var placekitten = 'http://placekitten.com/' + w + '/' + h;

      // Replace the src with placekitten photos.
      $img.attr('src', placekitten);

      // Replace all sourcesets next to the images.
      $img.siblings('source').attr('srcset', placekitten);
    });
  });
})(jQuery);
