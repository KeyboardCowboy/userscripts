(function ($) {
  console.log("YNAB Budget Usage Tracker v1.0.3");

  // Budget tracking object.
  var BudgetTrack = {
    waitForBudgetTable: function() {
      var observer = new MutationObserver(function(mutations) {
        if ($(".budget-table .is-sub-category").length) {
          console.log("Categories loaded.  Calculating usage percentages.");
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });
    },

    /**
     * Get the percentage of dollars spent for a sub category.
     *
     * @param $activity_cell
     * @returns {number}
     */
    getPctSpent: function ($activity_cell) {
      var activity = this.getActivity($activity_cell);
      var avail = this.getAvailable($activity_cell);
      var total = activity + avail;
      var pct_spent = ((activity / total) * 1000) / 1000 || 0;
      pct_spent = Math.round((Math.min(pct_spent, 1)) * 100);

      return pct_spent;
    },

    /**
     * Determine if a category has been actively budgeted.
     *
     * @param $activity_cell
     * @returns {boolean}
     */
    catIsActive: function ($activity_cell) {
      var activity = this.getActivity($activity_cell);
      var available = this.getAvailable($activity_cell);

      return !(activity === 0 && available === 0);
    },

    /**
     * Set the background percentage for active cell.
     *
     * @param $activity_cell
     */
    setActivityIndicator: function ($activity_cell) {
      var pct_spent = this.getPctSpent($activity_cell);

      $activity_cell.css({
        background: "linear-gradient(to right, var(--accent200) " + pct_spent + "%, transparent " + pct_spent + "%)"
      });
    },

    /**
     * Set the marker for the point in the month we are today.
     */
    setDateMarker: function () {
      var date_str = this.getDateFromURL();
      var y = date_str.substr(0, 4);
      var m = date_str.substr(4, 2);

      var date_today = new Date();
      var date_budget = new Date(y, m, 0);

      // If we're not looking at the current month, don't add the indicator.
      if (date_today.getMonth() !== date_budget.getMonth()) {
        return;
      }

      var today = date_today.getDate();
      var total = date_budget.getDate();
      var pct_complete = (Math.round((today / total) * 1000)) / 10;

      // Add the stylesheet to the DOM.
      $style = $('<style />', {'type': 'text/css'}).append('.budget-table-row.is-sub-category li.budget-table-cell-activity:after {left: ' + pct_complete + '%; border-color: #999 !important;}');
      $(document).find('head').append($style);
    },

    /**
     * Get the date string from the URL.
     *
     * @returns {string|number}
     */
    getDateFromURL: function() {
      // If we're on the live app, use the actual URL.
      if (window.location.hostname === 'app.youneedabudget.com') {
        // Get the date string from the URL.
        var parts = window.location.href.split('/');

        // Handle potential trailing slash.
        return parts.pop() || parts.pop();
      }
      // If we're on a dev server, use today's date.
      else {
        var date = new Date();
        return date.getFullYear().toString() + (date.getMonth() + 1).toString();
      }
    },

    /**
     * Get the amount spent.
     *
     * @param $activity_cell
     * @returns {number}
     */
    getActivity: function ($activity_cell) {
      var string = $activity_cell.find('span.user-data').text();
      string = string.replace(/[\D$]/g,'');
      return parseFloat(string) / 100 || 0;
    },

    /**
     * Get the available amount remaining as a float.
     *
     * @param $cell
     * @returns {number}
     */
    getAvailable: function ($cell) {
      var string = $cell.next('.budget-table-cell-available').find('span.user-data').text();
      string = string.replace(/[\D$]/g,'');
      return parseFloat(string) / 100 || 0;
    }
  };

  // Add the tracking to the DOM.
  $(document).ready(function() {
    BudgetTrack.waitForBudgetTable();

    var $cells = $('.budget-table-row.is-sub-category li.budget-table-cell-activity');

    // Set the date marker.
    BudgetTrack.setDateMarker();

    // Set the background on each cell as a percentage of the amount spent vs budgeted.
    $cells.each(function() {
      var $cell = $(this);

      // Only add indicators to active budget items for the month.
      if (BudgetTrack.catIsActive($cell)) {
        // Set each row's activity percentage indicator.
        BudgetTrack.setActivityIndicator($cell);
      }
    });
  });
})(jQuery);
