;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "dcResponsiveCarousel",
        defaults = {
            itemsPerPageOnMobile: 1,
            itemsPerPageOnTablet: 2,
            itemsPerPageOnDesktop: 3
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
            enquire
            .register("screen and (max-width:767px)", this.onEnterMobile)
            .register("screen and (min-width:768px) and (max-width:991px)", this.onEnterTablet)
            .register("screen and (min-width:992px)", this.onEnterDesktop)          
        },

    

        onEnterMobile: function (){
            var itemsPerPage = Plugin.prototype,
                deviceType = "mobile";
            console.log(deviceType);
            Plugin.prototype.createCarousel($element, itemsPerPage, deviceType);

        },

        onEnterTablet: function (){
            var itemsPerPage = 2;
                deviceType = "tablet";
            console.log(deviceType);
            Plugin.prototype.createCarousel($element, itemsPerPage, deviceType);         
        },

        onEnterDesktop: function (){
             var itemsPerPage = 3;
                deviceType = "desktop";
            console.log(deviceType);
             Plugin.prototype.createCarousel($element, itemsPerPage, deviceType);

        },

        createCarousel: function (element, itemsPerPage, deviceType){
            
            //Cache all list items within, and the length of the carousel
            var $carousel = $(element),
                $carouselItems = $carousel.children(".item"),
                carouselItemsLength = $carouselItems.length,
                carouselItemsTotalWidth = 0,
                totalWidth = 0,
                tallestItemHeight = 0,
                $carouselContainer = $carousel.parent(),
                carouselWidth = $carouselContainer.outerWidth(),
                carouselItemWidth = carouselWidth / itemsPerPage,
                itemsPerPage = itemsPerPage,
                deviceType = deviceType;

                var setupCarousel = function(){

                    //Add enabled class to Carousel's containing element which will apply further styles for users with JS
                    $carouselContainer.addClass("enabled");

                    for (var i = 0; i < carouselItemsLength; i++) {
                        
                        $carousel.children(".item").eq(i).height("auto");

                        if(deviceType==="mobile"){
                            //Don't set a width on carousel items when viewed on a mobile device. The main reason for this is the $carouselContainer does not have a max-width property set on device screens below 768px
                            $carousel.children(".item").eq(i).css({
                                "width": "100%",
                            });
                        }else{
                            //Add a width to each item within the carousel: total width of carousel / the number of items = item width
                            $carousel.children(".item").eq(i).outerWidth(carouselItemWidth);
                        }
                        
                        //Find the tallest item by comparing the current item's height with the previous tallest.
                        tallestItemHeight = $carousel.children(".item").eq(i).height() > tallestItemHeight?$carousel.children(".item").eq(i).height():tallestItemHeight;
                        
                        //Get each element's width and add it to a total width of the carousel.
                        carouselItemsTotalWidth = carouselItemsTotalWidth + $carousel.children(".item").eq(i).outerWidth();
                    };

                    //Set all elements within the carousel to the height of the tallest item
                    $carouselItems.height(tallestItemHeight);

                    //Set the height of the carousel container to the height of its tallest item.
                    $carouselContainer.height(tallestItemHeight);

                    if(deviceType!=="mobile"){
                        //Set the width of the carousel to the sum of the widths of its content. This will create a strip of list items all side by side.
                        $carousel.css({"width":carouselItemsTotalWidth});
                    }else{
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