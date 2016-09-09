/*
	Future Imperfect by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

  skel.breakpoints({
    xlarge: '(max-width: 1680px)',
    large: '(max-width: 1280px)',
    medium: '(max-width: 980px)',
    small: '(max-width: 736px)',
    xsmall: '(max-width: 480px)'
  });

  $(function () {

    var $window = $(window);
    var $body = $('body');
    var $menu = $('#menu');
    var $sidebar = $('#sidebar');
    var $main = $('#main');

    // Disable animations/transitions until the page has loaded.
    $body.addClass('is-loading');

    $window.on('load', function () {
      window.setTimeout(function () {
        $body.removeClass('is-loading');
      }, 100);
    });

    // Fix: Placeholder polyfill.
    $('form').placeholder();

    // Prioritize "important" elements on medium.
    skel.on('+medium -medium', function () {
      $.prioritize(
        '.important\\28 medium\\29',
        skel.breakpoint('medium').active
      );
    });

    // IE<=9: Reverse order of main and sidebar.
    if (skel.vars.IEVersion <= 9) {
      $main.insertAfter($sidebar);
    }

    // Menu.
    $menu
      .appendTo($body)
      .panel({
        delay: 500,
        hideOnClick: true,
        hideOnSwipe: true,
        resetScroll: true,
        resetForms: true,
        side: 'right',
        target: $body,
        visibleClass: 'is-menu-visible'
      });

    // Search (header).
    var $search = $('#search');
    var $searchInput = $search.find('input');

    $body
      .on('click', '[href="#search"]', function (event) {

        event.preventDefault();

        // Not visible?
        if (!$search.hasClass('visible')) {

          // Reset form.
          $search[0].reset();

          // Show.
          $search.addClass('visible');

          // Focus input.
          $searchInput.focus();

        }

      });

    $searchInput
      .on('keydown', function (event) {

        if (event.keyCode == 27) {
          $searchInput.blur();
        }

      })
      .on('blur', function () {
        window.setTimeout(function () {
          $search.removeClass('visible');
        }, 100);
      });

    // Intro.
    var $intro = $('#intro');

    // Move to main on <=large, back to sidebar on >large.
    skel
      .on('+large', function () {
        $intro.prependTo($main);
      })
      .on('-large', function () {
        $intro.prependTo($sidebar);
      });

  });
  
  initializeSearch();
  
  function initializeSearch() {
    var map = {
      'category': getParam('category'),
      'tags': getParam('tags')
    };
    
    $.each(map, function (type, value) {
      if (value !== null) {
        $.getJSON('/search.json', function(data) {
            posts = filterPostsByPropertyValue(data, type, value);
            if (posts.length > 0) {
              noResultPage();
            } else {
              layoutResultsPage(type, value, posts);
            }
        });
      }
    });
  }
  
  function getParam(key) {
    var params = (document.location.search).replace(/(^\?)/, '').split('&').map(function (n) {return n = n.split('='), this[n[0]] = n[1], this;}.bind({}))[0];
    return params[key] ? params[key] : '';
  }
  
})(jQuery);