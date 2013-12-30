;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "dcResponsiveCarousel",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        $element = $(element);
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            ssm.addStates([
                {
                    id: 'mobile',
                    maxWidth: 767,
                    onEnter: this.onEnterMobile
                },            
                {
                    id: 'tablet',
                    maxWidth: 991,
                    minWidth: 768,
                    onEnter: this.onEnterTablet
                },
                {
                    id: 'desktop',
                    minWidth: 992,
                    onEnter: this.onEnterDesktop
                }
            ]);
            ssm.ready();
        },

        onEnterMobile: function (){
            var itemsPerPage = 1;
            console.log("Mobile");
            Plugin.prototype.createCarousel($element, itemsPerPage);

        },

        onEnterTablet: function (){
            var itemsPerPage = 2;
            console.log("Tablet");
            Plugin.prototype.createCarousel($element, itemsPerPage);         
        },

        onEnterDesktop: function (){
             var itemsPerPage = 3;
             console.log("Desktop");
             Plugin.prototype.createCarousel($element, itemsPerPage);

        },

        createCarousel: function (element, itemsPerPage){
            
            //Cache all list items within, and the length of the carousel
            var $carousel = $(".carousel"),
                $carouselItems = $carousel.children(".item"),
                carouselItemsLength = $carouselItems.length,
                carouselItemsTotalWidth = 0,
                totalWidth = 0,
                carouselWidth = $carousel.parent().outerWidth(),
                carouselItemWidth = carouselWidth / itemsPerPage,
                itemsPerPage = itemsPerPage;

                //Loop through each item within the carousel, get its width and add it to a total width of the carousel
                //for (var i = 0; i < carouselItemsLength; i++) {
                    //carouselItemsTotalWidth = carouselItemsTotalWidth + $carouselItems.eq(i).outerWidth();
                    //$carouselItems.eq(i).outerWidth(carouselItemWidth);
                //};

                $('.carousel').children('.item').each(function(index) {
                    totalWidth += parseInt($(this).outerWidth(), 10);
                    $(this).css({"width":carouselItemWidth});
                });

                console.log("totalWidth:"+totalWidth);
                console.log($('.carousel').css("width"));

                //Set the width of the carousel to the sum of the widths of its content. This will create a strip of list items all side by side.
                $('.carousel').css({"width":totalWidth});
                //console.log($('.carousel').css("width"));

        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );