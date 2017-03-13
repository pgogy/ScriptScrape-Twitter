chrome.extension.onMessage.addListener( 

	function(request,sender,sendResponse){
	
		console.log(request);
	
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
		
			console.log("stop");
	
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
  
    if( request.instruction === "refresh" ){
	
			chrome.tabs.getSelected(null, function(tab) {

				chrome.tabs.sendMessage(tab.id, {command: "update", updateText: request.tweets}, function(response) {

					chrome.extension.sendMessage({command: response},
						function (response) {
							
						}); 

				});
		
			});
			
		}
  
    console.log("background listener");
	console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  }); 
