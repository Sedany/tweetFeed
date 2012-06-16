// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function($, window, document, undefined){
	var Twitter = {
		init: function(options, elem){
			var self = this;

			self.elem = elem;
			self.$elem = $(elem);

			self.username = (typeof options === 'string') ? options : options.username;

			self.options = $.extend({}, $.fn.tweetFeed.options, options);

			self.url = 'http://twitter.com/statuses/user_timeline/' + self.username + '.json';

			self.refresh(1);

		},

		refresh: function(length){
			var self = this;

			setTimeout(function(){
				self.fetchTweets().done(function(results){
					results = self.limit(results, self.options.noOfTweets);

					self.buildHTML(results);

					self.display();

					if(typeof self.options.onComplete === 'function'){
						self.options.onComplete.apply(self.elem, arguments);
					}

					if(self.options.refresh){
						self.refresh();
					}

				});
			}, length || self.options.refresh);
		},

		fetchTweets: function(){
			return $.ajax({
				url : this.url,
				data: {},
				dataType: 'jsonp'
			});
		},

		buildHTML: function(results){
			var self = this;

			self.tweets = $.map(results, function(obj, i){
				
				var tweet = self.linkify(obj.text);
				return $(self.options.wrapWith).append(tweet)[0];
			});
		},

		linkify: function(text){
			return text.replace(/(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/, function (u) {
    			var shortUrl = (u.length > 30) ? u.substr(0, 30) + '...': u;
    			return '<a href="' + u + '">' + shortUrl + '</a>';
  			})
  			.replace(/@([a-zA-Z0-9_]+)/g, '@<a href="http://twitter.com/$1">$1</a>')
  			.replace(/(?:^|\s)#([^\s\.\+:!]+)/g, function (a, u) {
    			return ' <a href="http://twitter.com/search?q=' + encodeURIComponent(u) + '">#' + u + '</a>';
  			});
		},

		display: function(){
			var self = this;

			if(self.options.transition === 'false' || !self.options.transition){
				self.$elem.html(self.tweets);
			}else{
				self.$elem[self.options.transition](500, function(){
					$(this).html(self.tweets)[self.options.transition](500);
				});
			}
		},

		limit: function(obj, count){
			return obj.slice(0 ,count);
		},

	};

	$.fn.tweetFeed = function(options){
		return this.each(function(){
			var twitter = Object.create(Twitter);
			twitter.init(options, this);

			$.data(this, 'queryTwitter', twitter);
		});
	};

	$.fn.tweetFeed.options = {
		username: 'adikari',
		wrapWith: '<li></li>',
		transition: 'fadeToggle',
		noOfTweets: 10,
		refresh: null,
		onComplete: null
	};	
}(jQuery, window, document));