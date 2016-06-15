(function($) {
  var instagramFullSize = {
    // Get the image elements.
    $imgCover: {},
    $imgParent: {},
    $img: {},

    // Button element.
    $button: {},

    /**
     * Initialize the object.
     */
    init: function() {
      // Find the image.  Die if not.
      if (!this.getImage()) {
        return;
      }

      // Add the button to the image.
      this.addButton();
    },

    /**
     * Get the image from the DOM.
     */
    getImage: function() {
      this.$imgCover = $("._ovg3g");
      this.$imgParent = this.$imgCover.prev('._jjzlb');
      this.$img = this.$imgParent.find('img');

      return (this.$img.length > 0);
    },

    /**
     * Create the CTA button to append to the image.
     */
    addButton: function() {
      var _this = this;
      
      // Create the button.
      var $icon = $('<img />', {'src': 'https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Full_Screen.png'});
      this.$button = $('<a/>', {'href': '#'}).addClass('js-open-full-image').html($icon);

      // Add the button to the image.
      this.$imgCover.append(this.$button);

      // Bind the click event.
      this.$button.on('click', function(e) {
        event.preventDefault();
        window.open(_this.$img.attr('src'));
      });
    }
  };


  /**
   * Kick it off.
   */
  $(document).ready(function() {
    instagramFullSize.init();
  });
})(jQuery);
