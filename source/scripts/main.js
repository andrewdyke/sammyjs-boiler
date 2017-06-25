'use strict';

// Initializing our Sammy App
var app = $.sammy('#app', function() {
	this.use('Template');
	this.around(function(callback) {
		var context = this;
		// Import JSON data via jquery .load() method
		this.load('data/articles.json')
			// using `then` to pass the returned data to a function
			.then(function(items) {
			// that stores the data in context.items
				context.items = items;
			})
			// then im not quite sure what this does but it makes shit work lol
			.then(callback);
	});

	// Getting our app target so we can later animate our content changes.
	var pageContentBox = $('#app');
	
	// Main nav links
	var $mainNavLinks = $('.mainNavLink');

	// Main nav link on click
	$mainNavLinks.on('click', function(e) {
		// store the href value
		var href = this.href;
		// prevent it from going to the href
		e.preventDefault();
		// if the link clicked is the current page
		if ($(this).hasClass('current')) {
			// don't do shit
		} else {
			// otherwise fade out the content area
			pageContentBox.addClass('scaleTrans').fadeOut(300, function() {
				// When it's done fading out go to the href.(Note that by going to the
				// href will trigger the Sammy .get route function relevant to the link
				// you clicked if there is one.)
				window.location = href;
			});
		}
	});

	// ROUTES ==========================================================

		// HOME
		this.get('#/', function(context) {
			calcRoute(context);
		});

		// BLOG
		this.get('#/blog', function(context) {
			// empty content
			context.app.swap('');
			// for each item
			$.each(this.items, function(i, item) {
				// render the articles template and pass it an object with the increment 
				// values of the each loop as the value of their according variable. 
				// i will be the increment number so it can be used for the id and the 
				// passed item variable will go as the value of the item
				context.render('templates/article.template', {id: i, item: item})
				// append to the target element
				.appendTo(context.$element());
				// wait then fade in
				setTimeout(function() { 
					pageContentBox.removeClass('scaleTrans').fadeIn(300); 
				}, 600);
			});
		});
		
		// ABOUT
		this.get('#/about', function(context) {
			calcRoute(context);
		});

		// CONTACT
		this.get('#/contact', function(context) {
			calcRoute(context);
		});

		// PRODUCTS
		this.get('#/products', function(context) {
			calcRoute(context);
		});

	// end routes ================================================================

	function calcRoute(context) { 
		// get the current url and store as str
		var str = location.href.toLowerCase();
		// get the value after the # and the character after it(this will get us 
		// the page name from the url) and store as pageId
		var pageId = str.substr(str.indexOf("#") + 2);
		// if there is no value returned we know its actually our home page so we'll
		// set it to that
		if (pageId === '') {
			pageId = 'home';
		}
		// send the new pageId and context to swapContent()
		swapContent(pageId, context);
	}

	function swapContent(thePageId, context) {
		// Remove the current content
		context.app.swap('');
		// Get the template with the same name as the requested PageId
		context.render('templates/' + thePageId + '.template', {})
		// and then place it in the content area
		.appendTo(context.$element());
		// wait then fade in
		setTimeout(function() { 
			pageContentBox.fadeIn(300).removeClass('scaleTrans'); 
		}, 200);
	}

	// Article by ID
	this.get('#/article/:id', function(context) {
		this.item = this.items[this.params['id']];
		if (!this.item) { return this.notFound(); }
		this.partial('templates/article-detail.template');
	});

	// Update active link based on URL
	this.before('.*', function() {
		var hash = document.location.hash;
		$("nav").find("a").removeClass("current");
		$("nav").find("a[href='"+hash+"']").addClass("current");
	});
});

$(document).ready(function() {
	app.run('#/');
	// wait .7 milliseconds then fade the page in!
	setTimeout(function() { 
		$('#body').fadeIn(1600); 
	}, 400);
});
