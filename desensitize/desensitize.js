(function($) {
  "use strict";

  var Desensitizer = {
    // Match this to the CSS.
    topClass: 'desensitize',

    // CSS ID for the toggle wrapper.  Match to CSS file.
    toggleWrapperId: 'js-kitten-toggle',

    // Image search base selector.
    baseSelector: '#main img',

    /**
     * Install the toggle box.
     *
     * @param settings
     */
    init: function(settings) {
      var _this = this;

      // Create the toggle box and add it to the DOM.
      var $toggle = $('<input>', {'type': 'checkbox', 'name': 'kitten-toggle'});
      var $wrapper = $('<div>', {'id': this.toggleWrapperId});

      $wrapper.append($toggle);
      $wrapper.append('<label for="kitten-toggle">Desensitize</label>');
      $('body').append($wrapper);

      // Bind the toggle functionality.
      $toggle.click(function() {
        if ($(this).is(':checked')) {
          _this.enable();
        }
        else {
          _this.disable();
        }
      });

      // Check for auto-enable.
      if (settings.enable === true) {
        $toggle.prop('checked', true);
        this.enable();
      }
    },

    /**
     * Enable the desensitizer.
     */
    enable: function() {
      var _this = this;

      // Add CSS trigger to blur text.
      $('html').addClass(this.topClass);

      // Swap out photos for kittens.
      $(this.baseSelector).each(function() {
        var $img = $(this);

        // Replace the src with placekitten photos.
        var kitten = _this._useKitten($img);

        // Replace all sourcesets next to the images.
        $img.siblings('source').each(function() {
          _this._useKitten($(this), kitten);
        });
      });
    },

    /**
     * Disable the desensitizer.
     */
    disable: function() {
      var _this = this;

      // Remove the blur class.
      $('html').removeClass(this.topClass);

      // Restore original images.
      $(this.baseSelector).each(function() {
        _this._restoreImage($(this));

        $(this).siblings('source').each(function() {
          _this._restoreImage($(this));
        });
      });
    },

    /**
     * Get the placekitten URL for an image element.
     *
     * @param $e
     * @returns {string}
     */
    getKitten: function($e) {
      var h = $e.height();
      var w = $e.width();

      // Force set the height and width.
      $e.height(h);
      $e.width(w);

      return 'http://placekitten.com/' + w + '/' + h;
    },

    /**
     * Swap images for kitten photos.
     *
     * @param $e
     * @param kitten
     * @returns {*}
     * @private
     */
    _useKitten: function($e, kitten) {
      if (typeof kitten === 'undefined') {
        kitten = $e.is('[data-src-kitten]')
          ? $e.attr('data-src-kitten')
          : this.getKitten($e);
      }

      $e.attr('data-src-kitten', kitten);

      if ($e.is(['src'])) {
        $e.attr('data-src-orig', $e.attr('src'));
        $e.attr('src', kitten);
      }
      else if ($e.is('[srcset]')) {
        $e.attr('data-src-orig', $e.attr('srcset'));
        $e.attr('srcset', kitten);
      }

      return kitten;
    },

    /**
     * Restore an image to its original photo.
     *
     * @param $e
     * @private
     */
    _restoreImage: function($e) {
      if ($e.is('[src]') && $e.is('[data-src-orig]')) {
        $e.attr('src', $e.attr('data-src-orig'));
      }
      else if ($e.is('[srcset]') && $e.is('[data-src-orig]')) {
        $e.attr('srcset', $e.attr('data-src-orig'));
      }
    }
  };

  $(document).ready(function() {
    // Initialize the desensitizer.
    Desensitizer.init({enable: true});
  });
})(jQuery);
