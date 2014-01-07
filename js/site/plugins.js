;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "dcResponsiveCarousel",
        defaults = {
            itemsPerPageOnMobile: 1,
            itemsPerPageOnTablet: 2,
            itemsPerPageOnDesktop: 3,
            carouselItemClass: ".item",
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        $element = $(element);
        this.settings = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var that = this;
            enquire
            .register("screen and (max-width:767px)", $.proxy(this.onEnterMobile,this))
            .register("screen and (min-width:768px) and (max-width:991px)", $.proxy(this.onEnterTablet,this))
            .register("screen and (min-width:992px)", $.proxy(this.onEnterDesktop,this))
        },


        onEnterMobile: function (){
            var itemsPerPage = this.settings.itemsPerPageOnMobile,
                deviceType = "mobile";
                this.createCarousel(itemsPerPage, deviceType);
        },

        onEnterTablet: function (){
            var itemsPerPage = this.settings.itemsPerPageOnTablet,
                deviceType = "tablet";
                this.createCarousel(itemsPerPage, deviceType);         
        },

        onEnterDesktop: function (){
             var itemsPerPage = this.settings.itemsPerPageOnDesktop,
                 deviceType = "desktop";
                 this.createCarousel(itemsPerPage, deviceType);
        },

        createCarousel: function (itemsPerPage, deviceType){
            
            //Cache all list items within, and the length of the carousel
            var $carousel = $(this.element),
                $carouselItem = $(this.settings.carouselItemClass);
                $carouselItems = $carousel.children(),
                carouselItemsLength = $carouselItems.length,
                carouselItemsTotalWidth = 0,
                tallestItemHeight = 0,
                $carouselContainer = $carousel.parent(),

                setupCarousel = function(){

                    //Add enabled class to Carousel's containing element which will apply further styles for users with JS
                    $carouselContainer.addClass("enabled");

                    for (var i = 0; i < carouselItemsLength; i++) {                        
                        //Reset height of list item to auto if previously set to static height
                        $carousel.children($carouselItem).eq(i).height("auto");
                        
                        //Find the tallest item by comparing the current item's height with the previous tallest.
                        tallestItemHeight = $carousel.children($carouselItem).eq(i).height() > tallestItemHeight?$carousel.children($carouselItem).eq(i).height():tallestItemHeight;
                        
                        //Get each element's width and add it to a total width of the carousel.
                        carouselItemsTotalWidth = carouselItemsTotalWidth + $carousel.children($carouselItem).eq(i).outerWidth();
                    };

                    //Set all elements within the carousel to the height of the tallest item
                    $carouselItems.height(tallestItemHeight);

                    //Set the height of the carousel container to the height of its tallest item.
                    $carouselContainer.height(tallestItemHeight);

                    if(deviceType!=="mobile"){
                        //Set the width of the carousel to the sum of the widths of its content. This will create a strip of list items all side by side. 
                        $carousel.css({"width":carouselItemsTotalWidth});
                    }

                    else{
                        //On mobile view only 1 carousel item is shown at a time. If the carousel's width exceeds the width of a single image (as it does on devices above 768px) then
                        //the max-width property of the image is rendered useless in this view and the images will no longer be responsive.

                        //So reset the width of the carousel to auto so the carousel can only ever be the width of a single image. 
                        $carousel.css({"width":"auto"});
                    }    
                }();

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