(function($, Drupal) {
  $(document).ready(function() {
    var $joinPanes = $('.leaf-join');

    if ($joinPanes.length > 0) {
      // Create the icon.
      var $icon = $('<i/>', {'class': 'icon icon-checkbox-alt green-text', 'style': 'font-size: 2.5rem; margin: 0;'});
      var $iconWrapper = $('<p/>', {'style': 'text-align: center;'}).append($icon);

      // Alter the content.
      $joinPanes.prepend($iconWrapper);
      $('.leaf-join__title').text("Enjoy Angie's List member benefits for FREE!");
      $('.leaf-join__message p').text("Search for a highly rated pro, read verified reviews, see member ratings and enjoy special pricing.");
      $('.leaf-join__join-link a').text("Join Now for Free");

      // Remove page elements.
      $('.leaf-join__social').remove();
      $('.leaf-offers').remove();

      // Adjust styles.
      $("#main-wrapper").css('padding-bottom', '0');
      $("#block-system-main").css('margin-bottom', '0');
      $joinPanes.css('padding', '0 25px 35px 25px');
      $(".leaf-join__join-link a").css({
        'text-transform': 'none',
        'font-size': '1.2rem',
        'line-height': '1.5rem'
      });

      // Reset the sticky sidebar.
      Drupal.behaviors.leafStickyComponents.attach();
    }
  });
})(jQuery, Drupal);
