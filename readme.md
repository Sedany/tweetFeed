TweetFeed
=============

TweetFeed is a very easy to use and highly customisable twitter plugin. Its very lightweight and is only 2.95kb.

How to use
-------

Using tweetFeed is very easy. 

### Simpler Approach

1. Include tweetFeed in your HTML.

        <script src="jquery.js"></script>
        <script src="tweetfeed.jquery.js"></script>

2. Below is the simplest way to use the plugin.

        $('div_to_load_tweets').tweetFeed('your_twitter_username');

That's all for it.


### More Customised
1. Include tweetFeed in your HTML.

        <script src="jquery.js"></script>
        <script src="tweetfeed.jquery.js"></script>

2. Below is the simplest way to use the plugin.

        $('div_to_load_tweets').tweetFeed({  
            username "your_username",  
            transition: true  
            onComplete: function(){  
               // call any function
            }   
         });

Check the options section for the list of all options available.


Options Available
-------

### username : String
### tweetTime : Boolean
### profilePic : Boolean
### screenName : Boolean
### wrapWith : Html tag as String
### wrapTweetWith : Html tag as String
###wrapDateWith : Html tag as String
### wrapScreenNameWith : Html tag as String
### containerClass : String
### tweetClass : String
### dateClass : String
### transition : Boolean
### noOfTweets : Integer
### refresh : Time Interval as Integer
### onComplete : Callback Function


Contributing
------------

1. Fork it.
2. Create a branch 
3. Commit your changes 
4. Push to the branch 
5. Open a Pull Request
6. Then I will merge it
