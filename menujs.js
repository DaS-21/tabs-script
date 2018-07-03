$().ready(function () { 
 
  // self infocing function
  (function ( $, window, document, undefined ) {


    // Create the defaults once
    var pluginName = "ngRibbon",
        defaults = {
          moreNavSelector: '#more-nav',
          menuSelector: '#nav-menu',
          dropDownSelector: '.subfilter'
        };

    /**
     * Contructor
     * @param {domelement} element from selector
     * @param {object} options pass settings from contructor
     */

    function Plugin( element, options ) {
      this.element = element;
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    Plugin.prototype = {
      
      setWaiAria: function(menuLi) {
        menuLi.each(function (i,el) {
          var $el = $(el);
          $el.attr('aria-setsize',menuLi.length);
          $el.attr('aria-posinset',i+1);
        });
      },

      getChildWidthSum: function() {
        var cws = 0;
        $(this.options.menuSelector +' > .list-item').each(function(i,el) {
          var $el = $(el);
          var elWidth = $el.outerWidth();
          cws += elWidth;
          $el.data('width' ,elWidth);
        });
        return cws;
      },

      resetMenu: function(){
        var clone;
        var main = this;
        var parentWidth = main.$menuContainer.width();
        var moreNavWidth = main.$moreBox.outerWidth();
        var activeElement = $(document.activeElement)[0];

        // before remove item check if you have to reset the focus
        var removeOriginal = function(item,clone){
          // check focused element
          if(item.find('a')[0] === activeElement){
            activeElement = clone.find('a')[0];
          }
          item.remove();
        };

        // get total width of all children
        var cws = main.getChildWidthSum();

        // parent needs space for all children and moreNav
        var overflowWidth = parentWidth - cws - moreNavWidth;

        if(overflowWidth<0) {

          // if not already there create more nav first and set to block
          main.$moreBox.removeClass('sr-only');

          // get last element in menu and place at top of the $morebox
          var item = $(main.options.menuSelector + ' > .list-item:last-child');
          clone = $(main.options.menuSelector + ' > .list-item:last-child').clone(true,true);
          clone.prependTo(main.$moreBoxDropdown);
          removeOriginal(item, clone);

          // check for more
          main.resetMenu();

        } else {

          if(main.$moreBoxDropdown.children()[0]) {
            var firstItem = $(main.options.dropDownSelector + ' > .list-item:first-child');
            // does the first child of the dropdown fits in the overflow space when put back
            if( overflowWidth > firstItem.data('width')) {
              clone = firstItem.clone(true,true);
              clone.appendTo(main.$menu);
              removeOriginal(firstItem, clone);
              main.resetMenu();
            }
          }
        }

        //if we have elements in extended menu - and has focussed element then show it
        if ($(main.options.dropDownSelector + ' > .list-item').length > 0) { 
          main.$moreBox.removeClass('sr-only');
        }
        else {
          main.$moreBox.addClass('sr-only');
        }

        // reset focus
        activeElement.focus();

      },

      init: function() {
        var main = this;

        main.$moreBox = $(main.options.moreNavSelector);
        main.$menu = $(main.options.menuSelector);
        main.$menuContainer = main.$menu.parent();
        main.$moreBoxDropdown = $(main.options.dropDownSelector);

        
        //we reconstruct menu on window.resize after delay
        $(window).on('resize', function (e) {
          main.resetMenu();
        });

        // set clickhandler
        $('.more').click(function () {
          //var $moreBox = $('#more-nav');

          main.$moreBox.toggleClass('active');

          // when active set focus to first element in drop down
          if(main.$moreBox.hasClass('active')){
            main.$moreBoxDropdown.children().first().find('a')[0].focus();
          } else {
            main.$menu.children().last().find('a')[0].focus();
          }

        });

        $( main.options.menuSelector +' > .list-item').each(function(i,el) {
          var $el = $(el);

          $el.focusin(function(e){

            if($(this).closest(main.options.moreNavSelector).length){
              main.$moreBox.addClass('active');
            } else {
              main.$moreBox.removeClass('active');
            }
          });
        });

        // set wai aria aria-setsize and aria-posinset before cloning elements in other list
        main.setWaiAria($( main.options.menuSelector + ' > .list-item'));

      }

    };

   
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
      return this.each(function () {
        if ( !$.data(this, "plugin_" + pluginName )) {
          $.data( this, "plugin_" + pluginName, 
            new Plugin( this, options ));
        }
      });
    };

    // init plugin
    $('.ng-ribbon').ngRibbon();
    $(window).trigger('resize'); //call resize handler to build menu right

  })( jQuery, window, document );
    
  });
