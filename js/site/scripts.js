client ={};

client.website = function(){

	var initPlugins = function(){
		$(".carousel").dcResponsiveCarousel();
	}

	return{
		init: function(){
			initPlugins();
		}
	};

}();

$(window).load(client.website.init);