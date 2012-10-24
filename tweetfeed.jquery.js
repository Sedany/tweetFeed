/*==============================================================================
	Author: 		Subash Adhikari
	Description: 	jQuery plugin that fetches tweets for the given username
	website: 		www.subash.com.au/plugins/tweetfeed	
	Date: 			2nd August 2012
	Contact: 		me@subash.com.au
	Version: 		1.2

	HOW TO USE
	============
	Just add the following script in the footer of your HTML.

	$('div_to_load_tweets').tweetFeed('your_twitter_username');

	There are more option available.  Visit the plugin website or the github page.

	CONTACTS AND FEEDBACK
	=======================
	If you want more functionalities or have feedback, feel free to contact me at:
	me@subash.com.au or tweet me at @adikari

	If you want to improve the plugin please fork it at github.
	https://github.com/subash1232/tweetFeed
=================================================================================*/



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
		/**
		 * function that initializes the plugin
		 * @param  {object} options user passed options
		 * @param  {DOM ELement} elem    Twitter element
		 */
		init: function(options, elem){
			var self = this
			options = $.extend({
			        callback: function() {}
			    }, arguments[0] || {});

			self.elem = elem;
			self.$elem = $(elem);

			self.username = (typeof options === 'string') ? options : options.username;

			self.options = $.extend({}, $.fn.tweetFeed.options, options);

			self.url = 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + self.username ;

			self.refresh(1);

		},

		/**
		 * refresh tweets
		 * @param  {int} length interval of time to refresh tweets
		 */
		refresh: function(length){
			var self = this;

			setTimeout(function(){
				self.fetchTweets().done(function(results){
					results = self.limit(results, self.options.noOfTweets);

					self.buildHTML(results);

					self.display();

					if(self.options.refresh){
						self.refresh();
					}

				});
			}, length || self.options.refresh);
		},

		/**
		 * fetch tweet object from twitter
		 * @return {json} json representation of tweets
		 */
		fetchTweets: function(){
			return $.ajax({
				url : this.url,
				data: {},
				dataType: 'jsonp'
			});
		},

		/**
		 * build HTML with the twitter object
		 * @param  {object} results twitter object
		 * @return {DOM element}         element wrapped in HTML tags
		 */
		buildHTML: function(results){
			var self = this,
				options = self.options;

			self.tweets = $.map(results, function(obj, i){
				
				var $screenName = $(document.createElement(options.wrapUserNameWith)).append('<a href="http://www.twitter.com/'+ self.username +'">@' + self.username + '</a>'),

					tweet = options.wrapTweetWith !== null ?
								$(document.createElement(options.wrapTweetWith))
									.append(self.linkify(obj.text)):
										self.linkify(obj.text),

					tweetTime = options.wrapDateWith !== null ?
									$(document.createElement(options.wrapDateWith))
										.append(self.compareDates(obj.created_at)):
											self.compareDates(obj.created_at),

					container = $(document.createElement(options.wrapContWith)).append();

				if(options.showUsername)
					container.append($screenName);

				html = container.append(tweet);
					
				if(options.containerClass !== null && options.wrapContWith !== null)
					container.addClass(options.containerClass);

				if(options.showUsername && options.usernameClass !== null && options.wrapUserNameWith !== null)
					$screenName.addClass(options.usernameClass);

				if(options.tweetClass !== null && options.wrapTweetWith !== null)
					tweet.addClass(options.tweetClass);

				if(options.dateClass !== null && options.wrapDateWith !== null)
					tweetTime.addClass(options.dateClass);

				// append date to the container
				if(options.tweetTime)
					html.append(tweetTime);

				return html[0];
			});
		},

		/**
		 * compares the given date to the current date
		 * @param  {String} time time representation
		 * @return {String}      compared time 
		 */
		compareDates: function(time){
			var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
				diff = (((new Date()).getTime() - date.getTime()) / 1000),
				day_diff = Math.floor(diff / 86400);
			
			if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
				return;
			
			return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "1 hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
				day_diff == 1 && "Yesterday" ||
				day_diff < 7 && day_diff + " days ago" ||
				day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
		},

		/**
		 * Regex to convert links in tweets to anchor tags
		 * @param  {String} text String to be linkified
		 * @return {HTML}      converted anchor tags
		 */
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

		/**
		 * display the tweets in the browser
		 */
		display: function(){
			var self = this;

			if(self.options.transition === 'false' || !self.options.transition){
				self.$elem.html(self.tweets);
			}else{
				self.$elem[self.options.transition](500, function(){
					$(this).html(self.tweets)[self.options.transition](500);
				});
			}

			// call the callback and apply the scope:
			self.options.callback.call(self);
		},

		/**
		 * Slices the HTML of tweet according the value passed
		 * @param  {HTML} obj   HTML representation of tweets
		 * @param  {int} count number of tweets to be displayed
		 * @return {HTML}       number of tweets
		 */
		limit: function(obj, count){
			return obj.slice(0 ,count);
		}

	};

	$.fn.tweetFeed = function(options){
		return this.each(function(){
			var twitter = Object.create(Twitter);
			twitter.init(options, this);

			$.data(this, 'queryTwitter', twitter);
		});
	};

	$.fn.tweetFeed.options = {
		username 			: 'adikari',
		tweetTime    		: true,
		showUsername 		: true,
    	wrapUserNameWith 	: 'h3',
		wrapContWith 		: 'li',
		wrapTweetWith 		: null,
		wrapDateWith 		: null,
		containerClass 		: null,
		tweetClass 			: null,
		usernameClass 		: null,
		dateClass 			: null,
		transition 			: false,
		noOfTweets 			: 10,
		refresh 			: null,
		callback 			: null
	};	
}(jQuery, window, document));