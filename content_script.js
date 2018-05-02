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
tweets = 0;
last_parse = false;
tab = 0;
scroll_try = 0;

function scroll_document(){

	if(!stop){

		if($(".back-to-top:visible").length!=1){

			$("html, body").animate({ scrollTop: 0 }, 1);
			$("html, body").animate({ scrollTop: $(document).height() }, 1);
			if($(".stream-items").children().length>50){
				scroll_try = 0;

				parse_document();
			}else{
				scroll_try++;
				chrome.runtime.sendMessage({instruction: "status", message: "Scrolling... " + $(".stream-items").children().length + " tweets available. " + 100 + " needed to process. Scrollling attempt : " + scroll_try}, function(response) {
					});
				setTimeout(scroll_document,1000);
			}

		}else{

			if($(".stream-items").children().length<100){

				if(scroll_try>20){

					chrome.runtime.sendMessage({instruction: "status", message: "Out of tweets..."}, function(response) {
					});

					stop = true;

					parse_document();

				}else{

					$("html, body").animate({ scrollTop: 0 }, 1);
					$("html, body").animate({ scrollTop: $(document).height() }, 1);
					scroll_try++;

					chrome.runtime.sendMessage({instruction: "status", message: "Scrolling... " + $(".stream-items").children().length + " tweets available. " + 100 + " needed to process. Scrollling attempt : " + scroll_try}, function(response) {
						});
					setTimeout(scroll_document,1000);

				}

			}else{

				if(scroll_try>20){

					chrome.runtime.sendMessage({instruction: "status", message: "Out of tweets..."}, function(response) {
					});

					stop = true;

					parse_document();

				}else{

					$("html, body").animate({ scrollTop: 0 }, 1);
					$("html, body").animate({ scrollTop: $(document).height() }, 1);

					scroll_try++;
					chrome.runtime.sendMessage({instruction: "status", message: "Scrolling... " + $(".stream-items").children().length + " tweets available. " + 100 + " needed to process. Scrollling attempt : " + scroll_try}, function(response) {
					});
					setTimeout(scroll_document,1000);

				}

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

	output = "url,name,handle,verified,conversation,time,content,quote,replies,retweets,favourites,twittercard,media,threaded\n";

	$(".stream-items .original-tweet .content")
		.each(

			function(index,value){

				name = $(value)
					.children()
					.first()
					.children()
					.first()
					.children()
					.first()
					.next()
					.children()
					.first()
					.text();

				verified = "No";

				verifiedcheck = $(value)
					.children()
					.first()
					.children()
					.first()
					.children()
					.first()
					.next()
					.children()
					.first()
					.next()
					.next()
					.text();

				if(verifiedcheck!=""){
						verfied = "Yes"
				}

				handle = $(value)
					.children()
					.first()
					.children()
					.first()
					.attr("href").substring(1);

				image = $(value)
					.children()
					.first()
					.children()
					.first()
					.children()
					.first()
					.attr("src");

				conversation = $(value)
					.children()
					.first()
					.children()
					.first()
					.next()
					.children()
					.first()
					.attr("data-conversation-id");

				url = "twitter.com" + $(value)
					.children()
					.first()
					.children()
					.first()
					.next()
					.children()
					.first()
					.attr("href");

				unix = $(value)
					.children()
					.first()
					.children()
					.first()
					.next()
					.children()
					.first()
					.children()
					.first()
					.attr("data-time");

				contentnode = $(value)
					.children()
					.first()
					.next();

				if(!contentnode.hasClass("js-tweet-text-container")){

					contentnode = $(contentnode).next();

				}

				content = $(contentnode).text();

				quote = "No";

				if($(contentnode).next().hasClass("u-hiddenVisually")){

					content = $(value).children().first().next().next().text();
					quote = $(value).children().last().prev().children().last().children().last().children().first().children().first().text().split("\n").join("");

				}

				replies = $(value)
					.children()
					.first()
					.next()
					.next()
					.next()
					.children()
					.last()
					.children()
					.first()
					.children()
					.first()
					.children()
					.last()
					.children()
					.first()
			   	.text()

				if(replies==""){
					replies = 0;
				}

				retweets = $(value)
					.children()
					.first()
					.next()
					.next()
					.next()
					.children()
					.last()
					.children()
					.first()
					.next()
					.children()
					.first()
					.children()
					.last()
					.children()
					.first()
			   	.text();

				if(retweets==""){
					retweets = 0;
				}

				favourites = $(value)
					.children()
					.first()
					.next()
					.next()
					.next()
					.children()
					.last()
					.children()
					.first()
					.next()
					.next()
					.children()
					.first()
					.children()
					.last()
					.children()
					.first()
			   	.text();

				if(favourites==""){
					favourites = 0;
				}

				media = $(value)
					.children()
					.first()
					.next()
					.next()
					.children()
					.first()
					.children()
					.first();

				twittercard = "No";
				mediatweet = "No"

				if(media[0]!=undefined){
					if($(media).attr("src")!=undefined){
						twittercard = $(media).attr("src");
					}else{
						classes = $(media).attr("class");
						if(classes!=undefined){
							if(classes.indexOf("AdaptiveMedia-container")!=-1){
								mediatweet = "Yes";
							}
						}
					}
				}

				threaded = "No";

				thread = $(value)
					.children()
					.last()
					.attr("class");

				if(thread!=undefined){
					if(thread.indexOf("-thread-")!=-1){
							threaded = "Yes";
					}
				}
				tweets++;

				content = content.split("\n");
				content.shift();
				content = content.join("\n");

				output = output + url + "," + name + "," + handle + "," + verified + "," + conversation + "," + unix + ",\"" + content.split('"').join("'") + "\",\"" + quote.split('"').join("'") + "\"," + replies + "," + retweets + "," + favourites + "," + twittercard + "," + mediatweet + "," + threaded + "\n";

			}

		);

		chrome.runtime.sendMessage({instruction: "date", date: unix}, function(response) {
		});

		chrome.runtime.sendMessage({instruction: "update", tweets: tweets + " tweets processed"}, function(response) {
	 	});

	hashtag = GetURLParameter("q");

	if(counter!=0){
		list = output.split("\n");
		list.pop();
		output = list.join("\n");
	}

	var blob = new Blob([output], {type: "text/plain;charset=utf-8"});
	saveAs(blob, hashtag + "-" + counter++ + "-download.csv");

	$(".stream-items li:not(:last-child)")
		.remove();

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
