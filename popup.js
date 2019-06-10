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
			$("#data-holder")
				.html("Stopping...");
			chrome.extension.sendMessage({instruction: "stop"},
				function (response) {
				});
		});
});

chrome.extension.onMessage.addListener( 
	function(request,sender,sendResponse){
		if(request.instruction=="update"){
			$("#data-holder")
				.html(request.tweets);
		}
		if(request.instruction=="date"){
			
			var a = new Date(request.date * 1000);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
			
			$("#date-holder")
				.html("Time reached: " + time);
		}
		if(request.instruction=="status"){
			$("#status-holder")
				.html("Status: " + request.message);
		}
		if(request.instruction=="files"){
		
			console.log(request);
		
			$("#files-holder")
				.html("Files processed: " + request.message);
		}
	}
);
