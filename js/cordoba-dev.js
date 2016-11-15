/*
* Cordoba (HTML) V2.0.4
* Copyright 2015, Limitless LLC
* www.limitless.company
*/

var windowHeight = $(window).height();
var windowWidth = $(window).width();
var settings;

settings = {
	enableAnimations: true,
	enableLoader: true,
	workItemsPerPage: 10,
	previewNavButtons : true,
	previewNavButtonNext : "Next",
	previewNavButtonPrev : "Prev",
	previewProtection: true,
};

jQuery(document).ready(function($) {
   'use strict';

   	// Basics
	$(".background.image").each(function() {
		var img = $(this).attr("data-url");
		var type = $(this).attr("data-type");
		if(img==undefined) return false;
		$(this).css("background-image", "url("+img+")");
	});

	$(".background.video").each(function() {
		var video = $(this).attr("data-url");
		var poster = $(this).attr("data-poster");
		if(video==undefined) return false;
		var h = "<video autoplay loop poster='"+poster+"'><source src='"+video+"' type='video/mp4'></video>";
		$(this).html(h);
	});

	$(".background").each(function() {
		if ($(this).hasClass("overlay-dark")) $(this).append("<div class='overlay-dark'></div>");
		if ($(this).hasClass("overlay-light")) $(this).append("<div class='overlay-light'></div>");
	});

	$(document).scroll(function() {
		var pageY = $(this).scrollTop();
		if (pageY > 10) {
			$('header.header').addClass("scrolled");
		} else {
			$('header.header').removeClass("scrolled");
		}
	});

	$(document).on('contextmenu',function (e) {
	    if(settings.previewProtection) e.preventDefault();
	})


	//Navigation Menu
    $("header.header .menu").click(function(e){
    	$('nav.navigation').fadeToggle("slow");
		$("nav.navigation .menu").css('margin-top', (windowHeight - $("nav.navigation .menu").height()) / 2);
		$("header.header .menu").toggleClass("close");
    });


	//Home
	$("section.home .discover").hover(function(e){
		$(this).removeClass("fadeInDownHalf");
		$(this).removeClass("animated");
	});

	$('section.home .slider').flexslider({
	    animation: "fade",
	    animationLoop: true,
	    animationSpeed: 1500,
	    controlNav: true,
	    directionNav: true,
	    easing: "easeOutBack",
	    pauseOnHover: false,
	    selector: ".slides > .slide",
	    slideshow: true
 	});


	//Work
	$("section.work .albums li").click(function(){
		if($(this).hasClass("selected")) return;
		var album = $(this).text().toLowerCase();
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");
		showPortfolio();
	});

	$("section.work .file").hover(function(e){
		$(this).removeClass("hover");
		$(this).siblings().addClass("hover");
	}, function(){
		$('section.work .file').removeClass("hover");
	});


	//Blog
	$("section.blog .post").hover(function(e){
		$(this).siblings().addClass("hover");
	}, function(){
		$('section.blog .post').removeClass("hover");
	});

	$("section.blog .post .image, section.blog .post .cover").click(function(){

	    $.magnificPopup.open({
			items: {
				src: $(this).parent().attr("data-url"),
				type:'ajax'
			},
			closeMarkup: "<button class='mfp-close'>close</button>"
		});

	});

	$("section.article .social .facebook").click(function(){
		var url = $(location).attr('href');
		window.open("https://www.facebook.com/sharer/sharer.php?u="+url, "Share", "resizable=yes,width=640, height=360");
	});

	$("section.article .social .twitter").click(function(){
		var url = $(location).attr('href');
		window.open("https://twitter.com/home?status="+url, "Tweet", "resizable=yes,width=640, height=360");
	});

});


$(window).load(function() {

	// General Adjustments
	adjustSizes();

	// Portfolio
	showPortfolio();

	//Loader
	playLoader();

	//Animations
	playAnimations();

});


$(window).resize(function() {
	adjustSizes();
});


function adjustSizes() {

	windowHeight = $(window).height();
	windowWidth = $(window).width();

	// Adjust .fullscreen
	$(".fullscreen").css('height', windowHeight);

	// Adjust .vertical-center
	$(".vertical-center").each(function() {
		$(this).css('margin-top', ($(this).parent().height() - $(this).height()) / 2);
	});

	// Adjust .stream
	var stream = $("section.work .stream");
	stream.attr("data-item-height", 300);
	if(windowWidth < 767) stream.attr("data-item-height", 200);

	// Adjust .page
	if(windowWidth > 767) {
		$("section.page .background").css('height', windowHeight - 117);
		$("section.page .content").css('height', windowHeight - 210);
		var pg = $("section.page .text").height() + $("section.page .info").height() + 50;
		if($("section.page .content").height() < pg) {
			$("section.page .content").addClass("scroll");
		} else {
			var gt = $("section.page .content").height() - pg;
			$("section.page .info").css('margin-top', gt + 10);
			$("section.page .content").addClass("no-scroll");
		}
	} else {
		$("section.page .background").removeAttr("height");
		$("section.page .content").removeAttr("height");
		$("section.page .info").removeAttr("margin-top");
		$("section.page .content").removeClass("scroll no-scroll");
	}

	// Fix work preview
	$('.work-preview .frame').css('height', windowHeight - $('.work-preview .nav').height() - $('.work-preview .info').height() - 40);
	$('.work-preview img').css('margin-top', - ($('.work-preview img').height()/2));
	$('.work-preview .prev, .work-preview .next').css('top', ((windowHeight - $('.work-preview .info').height()) / 2) + 40);

	// Fix landing page video background
	var rat = windowWidth / windowHeight;
	if (rat > (16/9)) {
		var v = windowWidth * (16/9);
		$("section.home video").css('width', windowWidth);
		$("section.home video").css('height', v);
		var vc = ($(".home video").height() - windowHeight) / 2;
		$("section.home video").css('margin-top', '-'+vc+'px');
		$("section.home video").css('margin-left', '0px');
	} else {
		var v = windowHeight * (16/9);
		$("section.home video").css('height', windowHeight);
		$("section.home video").css('width', v);
		var vc = ($(".home video").width() - windowWidth) / 2;
		$("section.home video").css('margin-top', '0px');
		$("section.home video").css('margin-left', '-'+vc+'px');
	}


	// Adjust home page slider
	var z = (windowHeight - $(".home .flex-control-nav").height()) / 2;
	$(".home .flex-control-nav").css('top', z);
	$(".home .flex-prev").css('top', z - 60);
	$(".home .flex-next").css('top', z + $(".home .flex-control-nav").height() + 52);

}

var currentAlbum;
function showPortfolio() {

	// Define stream
	var work = $("section.work");
	var stream = work.find(".stream");
	stream.attr("data-width", stream.width());
	work.css('min-height', windowHeight);

	// Create select for mobile view
	var albums = work.find(".albums");
	if(!albums.children("select").length) {
		$("section.work .albums").append("<select></select>");
		var albums_select = albums.find("select");
		albums.find("li").each(function() {
			var albumTitle = $(this).text();
			var albumURL = $(this).attr("data-album");
			if ($(this).hasClass("selected")) {
				albums_select.append("<option data-album='"+albumURL+"' selected>"+albumTitle+"</option>");
			} else {
				albums_select.append("<option data-album='"+albumURL+"'>"+albumTitle+"</option>");
			}
		});

		$("section.work .albums select").change(function() {
			var album = $(".work .albums select option:selected").attr("data-album");
			$(".work .albums li[data-album='"+album+"']").addClass("selected").siblings().removeClass("selected");
			console.log(album);
			showPortfolio();
		});
	}

	// Define album
	var album = $(".work .albums li.selected").attr("data-album");
	var albumChanged = true;
	if(currentAlbum == album) {
		albumChanged = false;
	} else {
		currentAlbum = album;
	}

	// Reset the stream if different album
	if(albumChanged) stream.find(".row").remove();
	if(albumChanged) stream.find(".file").removeClass("visible active awake");

	// Mark album images
	stream.children(".file").each(function(){
		if ($(this).attr("data-album") == album) {
			$(this).addClass("active");
		} else {
			$(this).removeClass("active selected");
		}
	});

	var loadStep = settings.workItemsPerPage;
	var currentlyLoaded = parseInt($(".stream").children(".awake").length);
	var totalItems = parseInt($(".stream").children(".active").length);
	var target = currentlyLoaded + loadStep;

	if(target > totalItems) target = totalItems;

	if(currentlyLoaded == totalItems) return;

	for (var i = currentlyLoaded; i < target; i++) {
		var item = $(".stream .active").eq(i);
		var itemAlbum = item.attr("data-album");
		if (itemAlbum == album) item.addClass("selected");
	};

	// Show loading
	if(stream.children(".selected").length > 0) {
		stream.addClass("loading");
		$("html, body").scrollTop(windowHeight);
	}

	var counter = 0;
	$(".stream > .selected").each(function() {

			var item = $(this);
			var itemType = item.attr("data-type");
			var itemSource = item.attr("data-source");

			var image = $("<img />").attr('src', itemSource).load(function() {

			    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {

			    	// Issue an error message
			        console.log("("+this.src+") is broken :'(");

			    } else {

			    	// Define image properties
			    	var imageHeight = this.naturalHeight;
			    	var imagePath = this.src;
			    	var imageWidth = this.naturalWidth;

			    	// Save image to the background
					item.css("background-image", "url("+imagePath+")");

					// Mark the image as loaded
					item.addClass("awake");

					// Save original dimentions
					item.attr("data-width", imageWidth).attr("data-height", imageHeight);

					// Add file type as class
					item.addClass(itemType);

			    }

			    counter+=1;

			    // Resize once everything is loaded
			    if(counter == ($(".stream > .selected").length)) {

					// Define stream
					var stream = $(".stream");
					var images = stream.children(".selected");
					var rowHeight = parseInt(stream.attr("data-item-height"));
					var colMargin = 0;

					// Define container width
					var containerWidth = stream.attr("data-width");
					var totalItemWidth = 0;

					// Create first row if there is no row
					if(stream.find(".row").length == 0) stream.append("<div class='row'></div>");

					// Create another row if all rows are full
					if(stream.find(".row").length == stream.find(".row.full").length) {
						stream.append("<div class='row'></div>");

					// Calculate 'total width' if the last row is not full
					} else {
						stream.find(".row").last().find(".file").each(function() {
						    totalItemWidth += parseInt($(this).attr("itemWidthRatio"));
						});
					}

					var rowCounter = 0;
					images.each(function() {

						// Define item
					    var item = $(this);

					    // Get properties
					    var type = item.attr("data-type");

					    var itemWidth = item.attr("data-width");
					    var itemHeight = item.attr("data-height");

					    var itemWidthRatio = rowHeight * (itemWidth/itemHeight);
					    var itemWidthTemp = (itemWidth / rowHeight) * 100;
					    itemWidthTemp = itemWidthTemp - colMargin;
					    item.attr("itemWidthRatio", itemWidthRatio).css("width", itemWidthTemp);


					    var totalItemWidthRatio = containerWidth/totalItemWidth;

					    if(work.hasClass("grid")) {

					    	var ref = 1.5;
					    	if(rowCounter == 0) ref = 2;

						    if (totalItemWidthRatio > ref && containerWidth > 479) {

						    	item.removeClass("selected");

					    		var itemHTML = item[0].outerHTML;

						    	$(".stream .row").last().append(itemHTML);

						    	totalItemWidth += itemWidthRatio;

						    } else {

						    	totalItemWidth = itemWidthRatio;

						    	item.removeClass("selected");

						    	var itemHTML = item[0].outerHTML;

						    	$(".stream .row").last().append(itemHTML);

								var totalItemWidth2 = 0;

								$(".stream .row").last().find(".file").each(function() {
								    totalItemWidth2 += parseInt($(this).attr("itemWidthRatio"));
								});

								var widthDiff = totalItemWidth2 - containerWidth;
								if(totalItemWidth2 < containerWidth) widthDiff = containerWidth - totalItemWidth2;

								$(".stream .row").last().find(".file").each(function() {
									var i = parseInt($(this).attr("itemWidthRatio"));
									var f = widthDiff * (i / totalItemWidth2);
									var r = i - f;
									if(totalItemWidth2 < containerWidth) r = i + f;

									var wi = (r / containerWidth) * 100;

									$(this).css('width', wi + "%");
									$(this).attr("data-width-adapted", r);
								});

								// Mark row as full
								$(".stream .row").last().addClass("full");

						    	stream.append("<div class='row'></div>");
						    	rowCounter+=1;

						    }

						} else {

							//
							var ref = 0;
							if(work.hasClass("grid-trio")) var ref = 3;
							if(work.hasClass("grid-quad")) ref = 4;

							var currentRowItems = $(".stream .row").last().find(".file").length;

						    if (currentRowItems < ref && containerWidth > 479) {

						    	// Remove .selected
						    	item.removeClass("selected");

						    	// Apend file to last row
					    		var itemHTML = item[0].outerHTML;
						    	$(".stream .row").last().append(itemHTML);

						    } else {

								// Mark row as full
								$(".stream .row").last().addClass("full");

						    	// Append new row
						    	stream.append("<div class='row'></div>");
						    	rowCounter+=1;

						    	// Remove .selected
						    	item.removeClass("selected");

						    	// Apend file to last row
					    		var itemHTML = item[0].outerHTML;
						    	$(".stream .row").last().append(itemHTML);

						    }

						}

					});

					// Hide loading
					stream.removeClass("loading");

					// Final housekeeping
					stream.find(".row").each(function() {

						// Add Animated class
						//$(this).addClass("animated");

						// Remove classes
						$(this).find("div").removeClass("awake active");
						$(this).find("div").addClass("view");

						// Add overlay to video
						var overlay = "<div class='overlay'></div>";
						$(this).find(".video").html(overlay);
						$(this).find(".youtube").html(overlay);
						$(this).find(".vimeo").html(overlay);

						// Clean empty rows
						if ($(this).find("div").length == 0) $(this).remove();

						// Register the "Preview" function
						$(this).find(".file").click(function(){
							previewImage($(this));
						});

					});

					// Run the function again when scroll down
				   	$(document).scroll(function() {
				   		var scrolled = $(this).scrollTop() + $(this).height();
				   		if(scrolled>=windowHeight){
				   			showPortfolio();
				   		}
					});

					//playAnimations();

				}

			});

	});

}

function previewImage(image) {

	// Define properties
	var image = image;
	var source = image.attr("data-source"); // File path
	var type = image.attr("data-type"); // Type
	var url = image.attr("data-url"); // Attached file path (for video)
	var caption = image.attr("data-caption"); // Caption
	var album = image.attr("data-album"); // Album title
	var detail = image.attr("data-detail"); //Image details NEW
	var current = $('section.work .stream .view').index(image); // Current index
	var total = $('section.work .stream .view').length; //Total files in album

	// Calculate height values
	var fHeight = windowHeight - 190;
	//var fHeight = windowHeight - 300; //NEW
	var marg = ((windowHeight - 100) / 2) + 40;

	// Build the preview markup
	var frame;
	var nav = "<div class='nav'></div>";
	var meta = "<div class='info'><div class='meta'><span class='picture-title'>"+caption+"</span><span class='album-title'>"+album+"</span><span class='picture-detail'>"+detail+"</span><span class='current'>"+(current+1)+" / "+total+"</span></div><div class='close'></div></div>";
	if(type=="image") frame = "<div class='frame' style='height:"+fHeight+"px'><img src='"+source+"' alt='"+caption+"'></div>";
	if(type=="video" || type=="youtube" || type=="vimeo" || type=="soundcloud") frame = "<div class='frame' style='height:"+fHeight+"px'><div class='player' data-type='"+type+"' data-url='"+url+"'></div></div>";
	if(settings.previewNavButtons) nav = "<div class='nav'><div class='prev' style='top: "+marg+"px;'>"+settings.previewNavButtonPrev+"</div><div class='next' style='top: "+marg+"px;'>"+settings.previewNavButtonNext+"</div></div>";

	// Show the preview
	$.magnificPopup.open({
		items: {
		    src: "<div class='work-preview'>"+meta+frame+nav+"</div>",
		    type: "inline"
		}
	});

	// Adjust height values
	$('.work-preview .frame').css('height', windowHeight - $('.work-preview .nav').height() - $('.work-preview .info').height() - 40);
	$('.work-preview .prev, .work-preview .next').css('top', ((windowHeight - $('.work-preview .info').height()) / 2) + 40);

	// Disable prev if first
	if(current==0) $('.work-preview .prev').addClass("disabled");

	// Protect image if enabled
	if(type=="image" && settings.previewProtection) $('.work-preview .frame').append("<div class='protected'></div>");

	// load video player if video
	if(type=="youtube" || type=="vimeo" || type=="soundcloud") loadVideoPlayer();

	// Adjust vertical alignement
	$('.work-preview img').css('margin-top', - ($('.work-preview img').height()/2));

	// Load video player for video preview
	function loadVideoPlayer() {
		$(".work-preview .player").each(function() {
			var t = $(this).attr("data-type");
			var u = $(this).attr("data-url");
			var w = $(this).parent().width();
			var h = $(this).parent().height();

			if(t==="youtube") {
				var d = '<iframe width="'+w+'" height="'+h+'" src="//www.youtube.com/embed/'+ u +'?rel=0" frameborder="0" allowfullscreen></iframe>';
				$(this).html(d);

			} else if (t==="vimeo") {
				var d = '<iframe src="//player.vimeo.com/video/'+ u + '?autoplay=1;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" width="'+w+'" height="'+h+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
				$(this).html(d);
			}
		});
	}

	// Close preview
	function previewClose(){
		var magnificPopup = $.magnificPopup.instance;
		magnificPopup.close();
	}

	// Preview previous image/video
	function previewPrev(){

		if(current>0) {

			current--;

			var i = $('section.work .stream .view').eq(current);
			img = i.attr("data-source");
			type = i.attr("data-type");
			file = i.attr("data-file");
			caption = i.attr("data-caption");
			album = i.attr("data-album");
			detail = i.attr("data-detail");

			$('.work-preview .meta .picture-title').text(caption);
			$('.work-preview .meta .album-title').text(album);
			$('.work-preview .meta .picture-detail').text(detail); //NEW

			if(type=="image") frame = "<div class='frame' style='height:"+fHeight+"px'><img src='"+img+"' alt='"+caption+"'></div>";
			if(type=="youtube" || type=="vimeo" || type=="soundcloud") frame = "<div class='frame' style='height:"+fHeight+"px'><div class='player' data-type='"+type+"' data-file='"+file+"'></div></div>";

			$('.work-preview .frame').replaceWith(frame);

			// Protect image if enabled
			if(type=="image" && settings.previewProtection) $('.work-preview .frame').append("<div class='protected'></div>");

			if(type=="youtube" || type=="vimeo" || type=="soundcloud") loadVideoPlayer();

			$('.work-preview .meta .current').text((current+1)+' / '+total);

			// Adjust vertical alignement
			$('.work-preview .frame').css('height', windowHeight - $('.work-preview .nav').height() - $('.work-preview .info').height() - 40);
			$('.work-preview img').css('margin-top', - ($('.work-preview img').height()/2));

			// Disable prev button if first
			if(current==0) $('.work-preview .nav .prev').addClass("disabled");

			// Enable next button if last
			if(current<total) $('.work-preview .nav .next').removeClass("disabled");


			// Register touch functions
			$('.work-preview .frame').on("swipeleft",function(){
				previewNext();
			});

			$('.work-preview .frame').on("swiperight",function(){
				previewPrev();
			});

		}

	}

	// Preview next image/video
	function previewNext(){

		if(current<total-1) {

			current++;

			var i = $('section.work .stream .view').eq(current);
			img = i.attr("data-source");
			type = i.attr("data-type");
			file = i.attr("data-file");
			caption = i.attr("data-caption");
			album = i.attr("data-album");
			detail = i.attr("data-detail");

			$('.work-preview .meta .picture-title').text(caption);
			$('.work-preview .meta .album-title').text(album);
			$('.work-preview .meta .picture-detail').text(detail); //NEW

			if(type=="image") frame = "<div class='frame' style='height:"+fHeight+"px'><img src='"+img+"' alt='"+caption+"'></div>";
			if(type=="youtube" || type=="vimeo" || type=="soundcloud") frame = "<div class='frame' style='height:"+fHeight+"px'><div class='player' data-type='"+type+"' data-file='"+file+"'></div></div>";
			$('.work-preview .frame').replaceWith(frame);

			// Protect image if enabled
			if(type=="image" && settings.previewProtection) $('.work-preview .frame').append("<div class='protected'></div>");

			if(type=="youtube" || type=="vimeo" || type=="soundcloud") loadVideoPlayer();

			$('.work-preview .meta .current').text((current+1)+' / '+total);

			// Adjust vertical alignement
			$('.work-preview .frame').css('height', windowHeight - $('.work-preview .nav').height() - $('.work-preview .info').height() - 40);
			$('.work-preview img').css('margin-top', - ($('.work-preview img').height()/2));

			// Enable previous button if not first
			if(!current==0) $('.work-preview .nav .prev').removeClass("disabled");

			// Disable next button if last
			if(current==total-1) $('.work-preview .nav .next').addClass("disabled");

			// Register touch functions
			$('.work-preview .frame').on("swipeleft",function(){
				previewNext();
			});

			$('.work-preview .frame').on("swiperight",function(){
				previewPrev();
			});

		}

	}

	// Close button
	$('.work-preview .close').click(function(){
		previewClose();
	});

	// Navigation buttons
	$('.work-preview .prev').click(function(){
		previewPrev();
	});

	$('.work-preview .next').click(function(){
		previewNext();
	});

	$('.work-preview .frame').on("swipeleft",function(){
		previewNext();
	});

	$('.work-preview .frame').on("swiperight",function(){
		previewPrev();
	});

	// Keyboard navigation
	$(document).keydown(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '37') previewPrev();
	});
	$(document).keydown(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '39') previewNext();
	});

}

function playLoader() {
	if(settings.enableLoader) {
		$("body").append("<div class='loading'></div>");
		$("body").children(".loading").delay(1000).fadeOut(1000, function() {
			$(".wrapper").animate({ opacity: 1 }, 1000);
			$("body").children(".loading").remove();
	 	});
	} else {
		$(".wrapper").css("opacity", 1);
	}

}

function playAnimations() {

	if(settings.enableAnimations) {
		var delay = 2000;
		$(".animated").each(function() {
			var item = $(this);
			var t = item.offset().top;
			var r = windowHeight;
			item.css("opacity", 0);
			setTimeout(function(){
				item.addClass("fadeInDown");
				item.removeAttr("opacity");
			}, delay);
			delay += 400;
		});
	}

}
