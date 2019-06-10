chrome.runtime.onMessage.addListener(

	function(request, sender, sendResponse) {

		if(request.command=="parse"){

			tab = request.tab;
			scroll_document();

		}

		if(request.command=="stop"){

			stop = true;

		}

	}

);

stop = false;
stream_length = 0;
counter = 0;
totaltweets = 0;
tweets = 0;
last_parse = false;
tab = 0;
scroll_try = 0;
last_children = 0;
data_try = 0;
datastore = new Array();

function scroll_document(){

	if(!stop){

		if($(".back-to-top:visible").length!=1){

			$("html, body").animate({ scrollTop: 0 }, 1);
			$("html, body").animate({ scrollTop: $(document).height() }, 1);
			if($(".stream-items").children().length>100){
				scroll_try = 0;
				parse_document();
			}else{
				scroll_try++;
				chrome.runtime.sendMessage({instruction: "status", message: "Scrolling... " + $(".stream-items").children().length + " tweets available. " + 100 + " needed to process. Scrollling attempt : " + scroll_try}, function(response) {
					});
				setTimeout(scroll_document,1000);
			}

		}else{

			if($(".stream-items").children().length<1){

				if(scroll_try>20){

					chrome.runtime.sendMessage({instruction: "status", message: "Out of tweets..."}, function(response) {
					});

					stop = true;

					scroll_try = 0;

					parse_document();

				}else{

					$("html, body").animate({ scrollTop: 0 }, 1);
					$("html, body").animate({ scrollTop: $(document).height() }, 1);

					if(last_children!=$(".stream-items").children().length){
						scroll_try = 0;
					}else{
						scroll_try++;
					}

					last_children = $(".stream-items").children().length;

					chrome.runtime.sendMessage({instruction: "status", message: "Scrolling... " + $(".stream-items").children().length + " tweets available. " + 100 + " needed to process. Scrollling attempt : " + scroll_try}, function(response) {
						});
					setTimeout(scroll_document,1000);

				}

			}else{

				parse_document();

				/*if(scroll_try>20){

					/*chrome.runtime.sendMessage({instruction: "status", message: "Out of tweets..."}, function(response) {
					});

					stop = true;



				}else{

					$("html, body").animate({ scrollTop: 0 }, 1);
					$("html, body").animate({ scrollTop: $(document).height() }, 1);

					scroll_try++;
					chrome.runtime.sendMessage({instruction: "status", message: "Scrolling... " + $(".stream-items").children().length + " tweets available. " + 100 + " needed to process. Scrollling attempt : " + scroll_try}, function(response) {
					});
					setTimeout(scroll_document,1000);

				}*/

			}

		}

	}else{

		chrome.runtime.sendMessage({instruction: "status", message: "Stopped"}, function(response) {
					});

	}

}

function GetURLParameter(sParam){

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++){

		var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }

    }

}

function parse_document(){

	setTimeout(get_data,2000);

}

function get_data(){

	chrome.runtime.sendMessage({instruction: "status", message: "Processing data..."}, function(response) {
		});

	output = "url,name,handle,avatar_image,verified,conversation,plaindate,time,content,quoted_url,quoted_conversation,quoted_name,quoted_handle,quote,quoted_id,replies,retweets,favourites,twittercard,media,threaded\n";

	favouritesdata = new Array();
	retweetsdata = new Array();
	repliesdata = new Array();

	tweets = 0;

	$(".stream-items .original-tweet .content")
		.each(

			function(index,value){		
							
				tweets++;

				$(value).parent().parent().attr("processedbytool","true");

				name = $(value)
							.find("strong.fullname")
							.text();

				verified = $(value)
							.find(".stream-item-header a.account-group span.Icon--verified");

				if(verified.length==1){
					verified = "Yes";
				}else{
					verified = "No";
				}
				
				handle = $(value)
							.find(".stream-item-header a span.username b")
							.text();

				image = $(value)
							.find(".stream-item-header img.avatar")
							.attr("src");

				conversation = $(value)
									.parent()
									.attr("data-conversation-id");
				
				url = $(value)
						.find(".tweet-timestamp")
						.attr("href");
				
				plaindate = $(value)
								.find("small.time a.tweet-timestamp")
								.attr("title");
					
				unix = $(value)
						.find("._timestamp")
						.attr("data-time");
	
				content = ($(value)
								.find(".js-tweet-text-container p")
								.first()
								.text());

				quoted_url = "No";
				quoted_conversation = "No";
				quoted_name = "No";
				quoted_handle = "No";
				quoted_text = "No";
				quoted_id = "No";
				
				quotetweet = $(value)
					.find(".QuoteTweet-innerContainer");
	
				if(quotetweet.length!=0){

					quoted_url = "https://twitter.com/" + $(value)
									.find(".QuoteTweet-innerContainer")
									.attr("href");
									
					quoted_conversation = $(value)
											.find(".QuoteTweet-innerContainer")
											.attr("data-conversation-id");

					quoted_id = $(value)
									.find(".QuoteTweet-innerContainer")
									.attr("data-item-id");

					quoted_name = $(value)
										.find(".QuoteTweet-innerContainer .QuoteTweet-fullname")
										.text();
										
					quoted_handle = $(value)
										.find(".QuoteTweet-innerContainer .username b")
										.text();
										
					quoted_text = $(value)
										.find(".QuoteTweet-innerContainer .QuoteTweet-text")
										.text();
										
				}

				replies = 0;
				retweets = 0;
				favourites = 0;
				
				$(value)
					.find(".stream-item-footer .ProfileTweet-action .ProfileTweet-actionCountForPresentation")
					.each(
						function(index,innervalue){
							if($(innervalue).is(":visible")){
								number = jQuery(innervalue).text().trim();
								if(index==0){
									replies = number;
								}else if(index==1){
									retweets = number;
								}else if(index==2){
									retweets = number;
								}else if(index==3){
									favourites = number;
								}else if(index==4){
									favourites = number;
								}
								number = "";
							}
						}
					);

				media = $(value)
							.find(".AdaptiveMedia-container img");
				
				mediatweet = "";
			
				if(media.length != 0){	
				
					$(media)
						.each(
							function(index,value){
								mediatweet = mediatweet + " " + $(value).attr("src");
							}
						);
				}else{
				
					media = $(value)
							.find(".AdaptiveMediaOuterContainer video");
		
					$(media)
						.each(
							function(index,innervalue){							
								mediatweet = $(innervalue).attr("src");
							}
						);		
						
				
				}
				
				if(mediatweet==""){
					mediatweet="No";
				}
				
				twittercard = $(value)
							.find(".card2")
							.children()
							.first()
							.attr("data-card-url");
				
				if(twittercard==undefined){
					twittercard="No";
				}
				
				threaded = "No";

				thread = $(value)
							.find(".self-thread-tweet-cta");
				
				threaded = "No";
				
				if(thread.length==1){
					threaded = "Yes";
				}
				
				output =
					output
					+ "https://twitter.com" + url
					+ ",\"" + name + "\","
					+ handle + ","
					+ image + ","
					+ verified + ","
					+ conversation + ",\""
					+ plaindate + "\","
					+ unix + ",\""
					+ content.split('"').join("'") + "\","
					+ quoted_url + ","
					+ quoted_conversation + ",\""
					+ quoted_name + "\",\""
					+ quoted_handle + "\",\""
					+ quoted_text.split('"').join("'") + "\","
					+ quoted_id + ","
					+ replies + ","
					+ retweets + ","
					+ favourites + ","
					+ twittercard + ","
					+ mediatweet + ","
					+ threaded + "\n";				

			}

		);	
		
	chrome.runtime.sendMessage({instruction: "date", date: unix}, function(response) {
		});	

		
	totaltweets += tweets;

	chrome.runtime.sendMessage({instruction: "update", tweets: totaltweets + " tweets processed"}, function(response) {
		});
	
	hashtag = GetURLParameter("q");

	if(counter!=0){
		list = output.split("\n");
		list.pop();
		output = list.join("\n");
	}

	var blob = new Blob([output], {type: "text/plain;charset=utf-8"});
	saveAs(blob, hashtag + "-" + counter++ + "-download.csv");

	chrome.runtime.sendMessage({instruction: "files", message: counter}, function(response) {
		});

	$(".stream-items li[processedbytool=true]")
		.each(
			function(index,value){
				$(value).remove();
			}
		)
		
	$("html, body").animate({ scrollTop: 0 }, 1);

	if(stop){
		chrome.runtime.sendMessage({instruction: "update", tweets: "Harvest stopped"}, function(response) {
		});
		chrome.runtime.sendMessage({instruction: "status", message: "Completed"}, function(response) {
		});

	}else{

		setTimeout(scroll_document,1000);

	}
	
}
