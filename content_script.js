chrome.extension.onMessage.addListener(
	 
	function(request, sender, sendResponse) {	
		
		if(request.command=="parse"){
	
			scroll_document();
			parse_document();
			
		}
		
	}     
		
);

stream_length = 0;
counter = 0;
last_parse = false;

function scroll_document(){

	if($(".stream-end-inner button:visible").length!=1){
		$("html, body").animate({ scrollTop: $(document).height() }, 1);
		console.log($(".stream-items").children().length);
		if($(".stream-items").children().length>1000){
			parse_document();						
		}else{
			setTimeout(scroll_document,1000);	
		}
	}else{
	
		console.log($(".stream-items").children().length + " " + stream_length);
	
		if($(".stream-items").children().length == stream_length){
			console.log($(".stream-end-inner button:visible").text() + " ENDING");
			if(!last_parse){
				parse_document();
				last_parse = true;
			}else{
				alert("Download Complete");
			}
		}else{			
			stream_length = $(".stream-items").children().length;
			console.log($(".stream-end-inner button:visible").text() + " " + stream_length + " REFRESHING");
			$("html, body").animate({ scrollTop: $(document).height() }, 1000);	
			setTimeout(scroll_document,4500);	
		}
		
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

	$(".stream-items .content .stream-item-footer")
		.each(
		
			function(index,value){
			
				//$(value)
				//	.trigger("click");
			
			}
			
		);
		
	setTimeout(get_data,2000);
		
}
		
function get_data(){

	output = "";

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
					.html();
					
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
					
				time = $(value)
					.children()
					.first()
					.children()
					.last()
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
					
				retweet = $(value)
					.children()
					.last()
					.children()
					.first()
					.next()
					.children()
					.first()
					.attr("data-tweet-stat-count");	
					
				conversation = $(value)
					.children()
					.last()
					.children()
					.first()
					.children()
					.length;
					
				if(conversation != 1){
					conversation = "true";
				}else{
					conversation = "false";
				}
					
				favourite = $(value)
					.children()
					.last()
					.children()
					.first()
					.next()
					.next()
					.children()
					.first()
					.attr("data-tweet-stat-count");	
				
				retweeters = "";
	
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
					
					
				output = output + name + "\t" + handle + "\t" + image + "\t" + time + "\t" + content + "\t" + retweet + "\t" + favourite + "\t" + conversation + "\t" + retweeters + "\n";
				
			}						
	
		);
		
	hashtag = GetURLParameter("q");	
	
	if(counter!=0){
		list = output.split("\n");
		list.pop();
		output = list.join("\n");
	}
		
	var blob = new Blob([output], {type: "text/plain;charset=utf-8"});	
	saveAs(blob, hashtag + "-" + counter++ + "-download.txt");
	
	$(".stream-items li:not(:last-child)")
		.remove();
		
	$("html, body").animate({ scrollTop: 0 }, 1);	
	
	setTimeout(scroll_document,1000);
	
	console.log("parsing done");
	
	
}