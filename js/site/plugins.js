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
            this.setupCarousel();
            ssm.addStates([
                {
                    id: 'mobile',
                    maxWidth: 767,
                    onEnter:  $.proxy(this.onEnterMobile,this)
                },            
                {
                    id: 'tablet',
                    maxWidth: 991,
                    minWidth: 768,
                    onEnter:  $.proxy(this.onEnterTablet,this)
                },
                {
                    id: 'desktop',
                    minWidth: 992,
                    onEnter:  $.proxy(this.onEnterDesktop,this)
                }
            ]);
            ssm.ready();
        },



        setupCarousel: function(){
            var controls = this.settings.controls
                this.carouselItemClass = this.settings.carouselItemClass
                this.$carousel = $(this.element),
                this.$carouselContainer = this.$carousel.parent(),
                this.$carouselItems = this.$carousel.children(this.carouselItemClass),
                this.$pageWidth = this.$carouselContainer.outerWidth(),


            //Add enabled class to Carousel's containing element which will apply further styles for users with JS
            this.$carouselContainer.addClass("enabled");

            //If controls are enabled then create them
            if(controls){
                var $controls = $('<ul/>',{'class':'carousel-controls clearfix'});
                $controls.html("<li class='previous'><a href='#' class='text-hide'>Previous</a></li><li class='next'><a href='#' class='text-hide'>Next</a></li>");
                $controls.insertAfter(this.$carousel);
                $controls.on("click", "li a", this.switchPage);
            }

            this.$carouselItems.each(function(){
                $(this).attr("data-original-order",$(this).index()+1)
            });
        },

        onEnterMobile: function (){
            var itemsPerPage = this.settings.itemsPerPageOnMobile,
                deviceType = "mobile";
                this.resizeCarousel(itemsPerPage, deviceType);
        },

        onEnterTablet: function (){
            var itemsPerPage = this.settings.itemsPerPageOnTablet,
                deviceType = "tablet";
                this.resizeCarousel(itemsPerPage, deviceType);         
        },

        onEnterDesktop: function (){
             var itemsPerPage = this.settings.itemsPerPageOnDesktop,
                 deviceType = "desktop";
                 this.resizeCarousel(itemsPerPage, deviceType);
        },

        createPages: function(itemsPerPage){
            var pageCounter = 1;

            // Implement pages
            for (var i = 0; i < this.$carouselItems.length; i++) {
                
                // Checks for current item's index relative to the page limit
                var itemPageIndex = i % itemsPerPage;

                $(this.$carouselItems.eq(i)).attr("data-page",pageCounter);

                // If the item equals the page limit, update the page counter, unless it's also the last item
                if((itemPageIndex === (itemsPerPage - 1)) && (i < (this.$carouselItems.length - 1))) {
                    pageCounter++;
                }
            }    

        },

        switchPage: function(){
            var 
            direction = $(this).parent().hasClass("previous") ? "previous" : "next",
            pageWidth = $element.parent().outerWidth(),
            itemPadding = parseInt($element.children().first().css("padding-left").replace("px","")),
            moveDistance = pageWidth - itemPadding;


            if(direction==="next"){

                if(ssm.isActive('mobile')){
                    console.log("next mobile");
                    $element.stop().animate(1000, function(){
                        $element.children("li").css({"visibility":"hidden"});
                        $itemsToMove = $("[data-page="+$element.children("li:first").attr('data-page')+']');
                        $itemsToMove.appendTo($element);
                        $element.children("li:first").css({"visibility":"visible"});
                    });    
                }
                else{
                    $element.stop().animate({left: -moveDistance}, 1000, function(){
                        $element.css('left','10px');
                        $itemsToMove = $("[data-page="+$element.children("li:first").attr('data-page')+']');
                        $itemsToMove.appendTo($element);
                    });
                }

            }
            //If direction==="previous"
            else{
                if(ssm.isActive('mobile')){
                    console.log("previous mobile");
                    $element.stop().animate(1000, function(){
                        $element.children("li").css({"visibility":"hidden"});
                        $itemsToMove = $("[data-page="+$element.children("li:last").attr('data-page')+']');
                        $itemsToMove.prependTo($element);
                        $element.children("li:first").css({"visibility":"visible"});
                    });  


                }
                else{
                    $itemsToMove = $("[data-page="+$element.children("li:last").attr('data-page')+']');
                    $itemsToMove.prependTo($element);
                    $element.css('left',-moveDistance);
                    $element.stop().animate({left: '10'}, 1000);
                }
            }
        },

        checkForIncompletePage: function(itemsPerPage){
            var noOfItemsOnIncompletePage = $element.children().length % itemsPerPage,
                noOfItemsToAdd = itemsPerPage - noOfItemsOnIncompletePage,
                noOfPages = $element.children().length / itemsPerPage+1;

                if(noOfItemsOnIncompletePage!==0){
                    for (var i = 0; i < noOfItemsToAdd; i++) {
                        $element.children().eq(i).clone(true).attr("data-page", Math.floor(noOfPages)).attr("data-original-order", $element.children().length+1).addClass("clone").appendTo($element);
                    }
                }

        },

        resizeCarousel: function (itemsPerPage, deviceType){
            var carouselItemsTotalWidth = 0,
                tallestItemHeight = 0,
                $carouselItems = this.$carousel.children(this.carouselItemClass),
                carouselItemsLength = $carouselItems.length

                $carouselItems.each(function(){
                    
                    //If this item is a clone remove it. It would be a cloned item from another device view and is not required. Any clones for this device view will be created later
                    if($(this).hasClass("clone")){
                        $(this).remove();
                    }

                    //Reset height of list item to auto if previously set to static height
                    $(this).height("auto");

                    //Find the tallest item by comparing the current item's height with the previous tallest.
                    tallestItemHeight = $(this).height() > tallestItemHeight?$(this).height():tallestItemHeight;
                    
                    //Get each element's width and add it to a total width of the carousel.
                    carouselItemsTotalWidth = carouselItemsTotalWidth + $(this).outerWidth();
                });


            //Set all elements within the carousel to the height of the tallest item
            $carouselItems.height(tallestItemHeight);

            //Set the height of the carousel container to the height of its tallest item.
            this.$carouselContainer.height(tallestItemHeight);

            if(deviceType!=="mobile"){
                //Set the width of the carousel to the sum of the widths of its content. This will create a strip of list items all side by side. 
                this.$carousel.css({"width":carouselItemsTotalWidth});
            }

            else{
                
                // On mobile view only 1 carousel item is shown at a time. If the carousel's width exceeds the width of a single image
                // (as it does on devices above 768px) then the max-width property of the image is rendered useless in this view
                // and the images will no longer be responsive.
                // So reset the width of the carousel to auto so the carousel can only ever be the width of a single image. 
                
                this.$carousel.css({"width":"auto"});
            }
            this.createPages(itemsPerPage);
            this.checkForIncompletePage(itemsPerPage); 
        }
    },



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