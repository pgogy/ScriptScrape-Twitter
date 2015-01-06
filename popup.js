$( document ).ready(function() {
    $("#search_harvest")
		.on("click", function(){
			chrome.extension.sendMessage({greeting: "GetURL"},
				function (response) {
				    console.log(response);
					console.log("***************");
				});
		});
	$("#clickhere")
		.on("click", function(){
			chrome.extension.sendMessage({greeting: "GetURL2"},
				function (response) {
				    console.log(response);
					console.log("***************");
				});
		});
	$("#clickthere")
		.on("click", function(){
			chrome.extension.sendMessage({greeting: "GetURL3"},
				function (response) {
				    console.log(response);
					console.log("***************");
				});
		});
	$("#clickalso")
		.on("click", function(){
			chrome.extension.sendMessage({greeting: "GetURL4"},
				function (response) {
				    console.log(response);
					console.log("***************");
				});
		});
});

chrome.extension.onMessage.addListener( 
	function(request,sender,sendResponse){
		if(request.command!=""){
		}
	}
);