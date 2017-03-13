chrome.runtime.onMessage.addListener(
	 
	function(request, sender, sendResponse) {	
		
		if(request.command=="parse"){
	
			tab = request.tab;
			scroll_document();
			
		}
		
		if(request.command=="stop"){
	
			console.log("stopping");
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

function scroll_document(){

	if($(".stream-end-inner button:visible").length!=1){
		$("html, body").animate({ scrollTop: $(document).height() }, 1);
		if($(".stream-items").children().length>100){
			parse_document();						
		}else{
			setTimeout(scroll_document,1000);	
		}
	}else{
	
		//if($(".stream-items").children().length == stream_length){
		//	console.log($(".stream-end-inner button:visible").text() + " ENDING");
		//	if(!last_parse){
		//		parse_document();
		//		//last_parse = true;
		//	}else{
		//		alert("Download Complete");
		//	}
		//}else{			
			stream_length = $(".stream-items").children().length;
			$("html, body").animate({ scrollTop: $(document).height() }, 1000);	
			setTimeout(scroll_document,4500);	
		//}
		
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

	/*$(".stream-items .content .stream-item-footer")
		.each(
		
			function(index,value){
			
				//$(value)
				//	.trigger("click");
			
			}
			
		);*/
		
	setTimeout(get_data,2000);
		
}
		
function get_data(){

	output = "name,handle,conversation,time,content,replies,retweets,favourites\n";	

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
					.text();
					
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
	
				content = $(value)
					.children()
					.first()
					.next()
					.text();

				replies = $(value)
					.children()
					.last()
					.children()
					.last()
					.children()
					.first()
					.children()
					.last()
					.children()
					.last()
					.children()
					.first()
					.children()
					.first()
					.text();
					
				if(replies==""){
					replies = 0;
				}	
					
				retweets = $(value)
					.children()
					.last()
					.children()
					.last()
					.children()
					.first()
					.next()
					.children()
					.last()
					.children()
					.last()
					.children()
					.first()
					.children()
					.first()
					.text();	
					
				if(retweets==""){
					retweets = 0;
				}			

				favourites = $(value)
					.children()
					.last()
					.children()
					.last()
					.children()
					.first()
					.next()
					.next()
					.children()
					.last()
					.children()
					.last()
					.children()
					.first()
					.children()
					.first()
					.text();	
					
				if(favourites==""){
					favourites = 0;
				}	
				
				retweeters = "";

				/*
				$(value)
					.children()
					.first()
					.next()
					.next()
					.children()
					.first()
					.children()
					.first()
					.next()
					.next()
					.children()
					.first()
					.children()
					.last()
					.children()
					.each(
						function(index,value){
							retweeters += $(value).attr("href").substring(1) + " (" + $(value).attr("original-title") + ") ";
						}
					);
				*/
				
				tweets++;
	
				output = output + url + "," + name + "," + handle + "," + conversation + "," + unix + "," + content.split('"').join('""').split("\t").join(" ").split("\n").join(" ").split("\r").join(" ") + "," + replies + "," + retweets + "," + favourites + "\n";
				
			}						
	
		);
		
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
	
		console.log("stopping now");
	
		chrome.runtime.sendMessage({instruction: "update", tweets: "Harvest stopped"}, function(response) {
		});		
	
	}else{
	
		setTimeout(scroll_document,1000);
		
	}
	
}