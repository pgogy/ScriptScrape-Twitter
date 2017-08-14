chrome.extension.onMessage.addListener( 

	function(request,sender,sendResponse){
	
		if( request.instruction === "GetURL" ){
	
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "parse", tab: tab.id}, function(response) {

					chrome.extension.sendMessage({command: response},
						function (response) {
							
						}); 

				});
		
			});
			
		}
		
		if( request.instruction === "stop" ){
		
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "stop", tab: tab.id}, function(response) {

					chrome.extension.sendMessage({command: response},
						function (response) {
							
						}); 

				});
		
			});
			
		}

	}
);   

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  
    if(request.instruction === "refresh"){
	
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "update", updateText: request.tweets}, function(response) {

					chrome.extension.sendMessage({command: response},
						function (response) {
							
						}); 

				});
		
			});
			
	}
	
	if(request.instruction === "date"){
	
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "date", date: request.date}, function(response) {

					chrome.extension.sendMessage({command: response},
						function (response) {
							
						}); 

				});
		
			});
			
	}
	
	if(request.instruction === "status"){
	
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "status", message: request.message}, function(response) {

					chrome.extension.sendMessage({command: response},
						function (response) {
							
						}); 

				});
		
			});
			
	}
  
  }); 
