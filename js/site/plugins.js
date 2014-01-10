;(function ( $, window, document, undefined ) {
    var pluginName = "dcResponsiveCarousel",
        defaults = {
            itemsPerPageOnMobile: 1,
            itemsPerPageOnTablet: 2,
            itemsPerPageOnDesktop: 3,
            carouselItemClass: ".item",
            controls: true,
        };

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
            this.initCarousel();
            enquire
            .register("screen and (max-width:767px)", $.proxy(this.onEnterMobile,this))
            .register("screen and (min-width:768px) and (max-width:991px)", $.proxy(this.onEnterTablet,this))
            .register("screen and (min-width:992px)", $.proxy(this.onEnterDesktop,this))
        },

        initCarousel: function(){
            var controls = this.settings.controls,
                $carousel = $(this.element);

            setupNavigation = function(){
                if(controls){
                    var $controls = $('<ul/>',{'class':'carousel-controls clearfix'});
                    $controls.html("<li class='previous'><a href='#' class='hide-text'>Previous</a></li><li class='next'><a href='#' class='hide-text'>Next</a></li>");
                    $controls.insertAfter($carousel);
                }
            }()


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

                ///////////////////////////////////////////////////////////////////////////////////////////////////////////
                //                                                                                                       //                
                //    setupCarousel:                                                                                     //
                //                                                                                                       //
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////
                //                                                                                                       //                
                //    The carousel consists of a <UL> of <LI> items which are floated together in a strip. Only a small  //
                //    section of this strip is shown at any one time as the carousel's container has overflow:hidden.    //
                //                                                                                                       //
                //    setupCarousel:                                                                                     //
                //                                                                                                       //
                //    -   creates the strip of list items by adding all the <LI> widths together to establish            //
                //        a total width and adding this to the <UL> to make it wide enough for all <LI>s to be stacked   //
                //        side by side.                                                                                  //
                //                                                                                                       //
                //    -   Calculates the carousel slide with the greatest height and sets all slides to this height.     //
                //                                                                                                       //
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                        
                        // On mobile view only 1 carousel item is shown at a time. If the carousel's width exceeds the width of a single image
                        // (as it does on devices above 768px) then the max-width property of the image is rendered useless in this view
                        // and the images will no longer be responsive.
                        // So reset the width of the carousel to auto so the carousel can only ever be the width of a single image. 
                        
                        $carousel.css({"width":"auto"});
                    }    
                }()

                ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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