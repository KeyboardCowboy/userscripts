(function($) {
  $(document).ready(function() {
    var $joinPanes = $('.leaf-join');

    if ($joinPanes.length > 0) {
      // Create the icon.
      var $icon = $('<i/>', {'class': 'icon icon-checkbox-alt green-text', 'style': 'font-size: 2.5rem; margin: 0;'});
      var $iconWrapper = $('<p/>').append($icon);

      // Alter the content.
      $joinPanes.prepend($iconWrapper);
      $('.leaf-join__title').text("Enjoy Angie's List member benefits for FREE!");
      $('.leaf-join__message p').text("Search for a highly rated pro, read verified reviews, see member ratings and enjoy special pricing.");

      // Remove page elements.
      $('.leaf-join__social').remove();
      $('.leaf-offers').remove();

      // Adjust styles.
      $("#main-wrapper").css('padding-bottom', '0');
      $("#block-system-main").css('margin-bottom', '0');
      $(".leaf-join__join-link a").html("Join Now for Free").css({
        'text-transform': 'none',
        'font-size': '1.2rem',
        'line-height': '1.5rem'
      });

      //$(".leaf__mid-left").css({'overflow': 'hidden', 'height': '0'});
      //$("#js-leaf-stop-sticky").css({'overflow': 'hidden', 'height': '0'});
      //$(".leaf-join").css('padding', '0 25px 35px');
    }
  });
})(jQuery);
