/**
 * @file
 * Make the Dropbox paper TOC collapsible.
 *
 * Be sure to add a jQuery library as a dependency.
 */
(function($){
  $(document).ready(function() {
    $toggler = $('<a class="js-toc-toggle">[-]</a>');
    $level1 = $('.hp-toc-entry-level0');
    $level2 = $('.hp-toc-entry-level1');

    $level1.prepend($toggler);
    //$level2.prepend($toggler);

    $('.js-toc-toggle', $level1).on('click', function() {
      $(this).closest('.hp-toc-entry-level0').siblings('.hp-toc-entry-level1').slideToggle('fast');
    });
  });
})(jQuery);
