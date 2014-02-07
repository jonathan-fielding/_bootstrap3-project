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
            
            //Put this in the readme.md file for the plugin, in the source it is never read and you should be distributing the minified versions so it will be removed
            //This plugin has a dependency on another plugin Simple State Manager 2.2.1 by Jonathan Fielding - http://www.simplestatemanager.com/
            //Simple State Manager is a javascript state manager for responsive websites. It allows different functions to be called based on device 'state'.

            ssm.addStates([
                {
                    id: 'mobile',
                    maxWidth: 767,
                    onEnter:  $.proxy(this.onEnterMobile,this) //While this is good, your using jQuery, you could do with learninn about .bind so you know how to do this in pure js
                },            
                {
                    id: 'tablet',
                    maxWidth: 991,
                    minWidth: 768,
                    onEnter:  $.proxy(this.onEnterTablet,this)//While this is good, your using jQuery, you could do with learninn about .bind so you know how to do this in pure js
                },
                {
                    id: 'desktop',
                    minWidth: 992,
                    onEnter:  $.proxy(this.onEnterDesktop,this)//While this is good, your using jQuery, you could do with learninn about .bind so you know how to do this in pure js
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

            //Typically classes belonging to a plugin are prefixed with plugin name, e.g colorbox = .cbox-close etc 
            //This is so that there are no clashes with the users codebase
            
            //Add enabled class to Carousel's containing element which will apply further styles for users with JS
            this.$carouselContainer.addClass("enabled");

            //You could take the same approach as twitter bootstrap that has you put the controls in the HTML, this means you dont need to generate HTML in your JS which is nasty
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
            var itemsPerPage = this.settings.itemsPerPageOnMobile;
                this.$carousel.css("left","auto");
                this.resizeCarousel(itemsPerPage);//Good that you have reused code
        },

        onEnterTablet: function (){
            var itemsPerPage = this.settings.itemsPerPageOnTablet;
                this.resizeCarousel(itemsPerPage);//Good that you have reused code         
        },

        onEnterDesktop: function (){
             var itemsPerPage = this.settings.itemsPerPageOnDesktop;
                 this.resizeCarousel(itemsPerPage);//Good that you have reused code
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
            direction = $(this).parent().hasClass("previous") ? "previous" : "next", //Check direction based on a data attribute, will be simpler to read this line and a next and previous class could cause issues in some use cases
            pageWidth = $element.parent().outerWidth(),
            itemPadding = parseInt($element.children().first().css("padding-left").replace("px","")),
            moveDistance = pageWidth - itemPadding;

            //For these animations you could consider using CSS3 animations, older browsers just wont receive the annimations
            if(direction==="next"){

                if(ssm.isActive('mobile')){
                    $element.children().eq(1).css("z-index","2");
                    $element.children().eq(0).stop().animate({opacity: 0 }, 1000, function(){
                        $(this).appendTo($element);
                        $element.children().css({"z-index":"1", "opacity":"1"});
                        $element.children().eq(0).css("z-index","3");
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
            //If you need this as a comment, just change the else to an else if, let the code document itself
            //If direction==="previous"
            else{
                if(ssm.isActive('mobile')){
                    $element.children().eq(0).stop().animate({opacity: 0}, 1000, function(){
                        $element.children(":last").prependTo($element);
                        $element.children().css({"z-index":"1", "opacity":"1"});
                        $element.children().eq(0).css("z-index","3");
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

                //As discussed, just move 1 item at a time
                //If an imcomplete page is found, loop through the number of items required, clone that amount of items from the start of the carousel and add them to the end. 
                if(noOfItemsOnIncompletePage!==0){
                    for (var i = 0; i < noOfItemsToAdd; i++) {
                        if(i<$element.children().length){
                            $element.children().eq(i).clone(true).attr("data-page", Math.floor(noOfPages)).attr("data-original-order", $element.children().length+1).addClass("clone").appendTo($element);
                        }
                        
                    }
                }

        },
        
        //Your doing a lot on your on resize, you need to look at reducing this
        resizeCarousel: function (itemsPerPage){
            var carouselItemsTotalWidth = 0,
                tallestItemHeight = 0,
                $carouselItems = this.$carousel.children(this.carouselItemClass),
                carouselItemsLength = $carouselItems.length

                //Resorting on browser resize will be heavy on the rendering engine, if you wanted to reset to original order, cache the original items somewhere and just readd these to the DOM overwriting what is there
                //As resizeCarousel runs on change of device state - e.g - desktop to tablet view - Reset the carousel to the first slide(s) on stage change
                $carouselItems.detach().sort(function(a,b){
                    return $(a).attr('data-original-order') - $(b).attr('data-original-order');
                });

                this.$carousel.append($carouselItems);  

                //A normal for loop would be better for performance
                $carouselItems.each(function(){
                    
                    //If this item is a clone remove it. It would be a cloned item from another device view and is not required. Any clones for this device view will be created later
                    if($(this).hasClass("clone")){
                        $(this).remove();
                    }

                    //You could reset all of the items before hand
                    //Reset height of list item to auto if previously set to static height
                    $(this).height("auto");

                    //Find the tallest item by comparing the current item's height with the previous tallest.
                    tallestItemHeight = $(this).height() > tallestItemHeight?$(this).height():tallestItemHeight;
                    
                    //Get each element's width and add it to a total width of the carousel.
                    carouselItemsTotalWidth = carouselItemsTotalWidth + $(this).outerWidth();
                });


            //The height can come from your CSS, the only time your height would need to be dynamic is on mobile where you can use the padding-bottom trick
            //Set all elements within the carousel to the height of the tallest item
            $carouselItems.height(tallestItemHeight);

            //Set the height of the carousel container to the height of its tallest item.
            this.$carouselContainer.height(tallestItemHeight);

            if(!ssm.isActive('mobile')){
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
