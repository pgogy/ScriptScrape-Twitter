chrome.extension.onMessage.addListener( 
	function(request,sender,sendResponse){
	
		if( request.greeting === "GetURL" ){
	
			var tabURL = "Not set yet";
			
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "parse"}, function(response) {

					console.log("here i wait " + response);
					chrome.extension.sendMessage({command: response},
						function (response) {
							
						}); 

				});
		
			});
			
									     
		}
		if( request.greeting === "GetURL2" ){
		
			console.log("yo yo yo yo yo 2");
	
			var tabURL = "Not set yet";
			
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "parse"}, function(response) {

					sendResponse(response);  

				});
		
			});
			      
		}
		if( request.greeting === "GetURL3" ){
		
			console.log("yo yo yo yo yo 3");
	
			var tabURL = "Not set yet";
			
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "parse"}, function(response) {

					sendResponse(response);  

				});
		
			});
			       
		}
		if( request.greeting === "GetURL4" ){
		
			console.log("yo yo yo yo yo 4");
	
			var tabURL = "Not set yet";
			
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "parse"}, function(response) {

					sendResponse(response);  

				});
		
			});
			     
		}
	}
);    