(function($) {
  $(document).ready(function() {
    var $joinPanes = $('.leaf-join');

    if ($joinPanes.length > 0) {
      // Get the height of the original block in case we can't reset the sidebar.
      var origHeight = $joinPanes.eq(1).outerHeight();

      // Get the elements we are altering.
      var $title = $('.leaf-join__title');
      var $message = $('.leaf-join__message p');
      var $link = $('.leaf-join__join-link a');

      // Create the icon.
      var $icon = $('<i/>', {'class': 'icon icon-checkbox-alt green-text', 'style': 'font-size: 2.5rem; margin: 0;'});
      var $iconWrapper = $('<p/>', {'style': 'text-align: center;'}).append($icon);

      // Alter the content.
      $joinPanes.prepend($iconWrapper);
      $title.text("Enjoy Angie's List member benefits for FREE!");
      $message.text("Search for a highly rated pro, read verified reviews, see member ratings and enjoy special pricing.");
      $link.text("Join Now for Free");

      // Remove page elements.
      $('.leaf-join__social').remove();
      $('.leaf-offers').remove();

      // Adjust styles.
      $("#main-wrapper").css('padding-bottom', '0');
      $("#block-system-main").css('margin-bottom', '0');
      $joinPanes.css('padding', '0 25px 35px 25px');
      $link.css({
        'text-transform': 'none',
        'font-size': '1.2rem',
        'line-height': '1.5rem'
      });

      // Hide the first instance of the sidebar until 1603 is released.
      var $sb1 = $(".leaf__top-right");
      var $sb2 = $(".leaf__lower-right");
      $(window).on('scroll', function() {
        if ($sb2.is(':visible')) {
          $sb1.addClass('js-hide');
        }
        else {
          $sb1.removeClass('js-hide');
        }
      });

      // Reset the sticky sidebar.
      if (Drupal !== 'undefined') {
        Drupal.behaviors.leafStickyComponents.attach();
      }
      else {
        console.log('Unable to reset sticky height.');
        $joinPanes.height(origHeight);
      }
    }
  });
})(jQuery);
