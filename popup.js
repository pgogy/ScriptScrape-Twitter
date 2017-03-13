$( document ).ready(function() {
    $("#search_harvest")
		.on("click", function(){
			$("#data-holder")
				.html("Starting...");
			chrome.extension.sendMessage({instruction: "GetURL"},
				function (response) {
				});
		});
		
	$("#stop_button")
		.on("click", function(){
			console.log("stop");
			$("#data-holder")
				.html("Stopping...");
			chrome.extension.sendMessage({instruction: "stop"},
				function (response) {
				});
		});
});

chrome.extension.onMessage.addListener( 
	function(request,sender,sendResponse){
	
		console.log("pop up");
		console.log(request);
	
		if(request.instruction=="update"){
			$("#data-holder")
				.html(request.tweets);
		}
	}
);
