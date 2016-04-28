// get selected text
function getSelectionText(callback) {
    var text = "";
    chrome.tabs.getSelected(null, function(tab) {
      // Send a request to the content script.
      chrome.tabs.sendRequest(tab.id, {action: "getSelection"}, function(response) {
        console.log(response.selection);
        callback(response.selection);
      });
    }); 
}

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Dom Loaded');
    
    //the below bever fired even when using the same - had to use the .extension func instead... weird
  chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
          console.log(request);
        renderStatus(request.msg);     
          sendResponse('content js - got it');
  });
    

// as noted above, the below worked though it should be deprecated
chrome.extension.onRequest.addListener(
	  function(request, sender, sendResponse) {
	    console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
          console.log(request);
        renderStatus(request.msg);     
          sendResponse('content js - got it');
  });
    
  chrome.runtime.sendMessage({message: "hello"}, function(response) {
      if (response) {
        console.log(response.msg);
        renderStatus(response.msg);        
      }
  });

    
  getSelectionText(function(selectedText) {
    
    renderStatus('Current selected text is: ' + selectedText);
    chrome.runtime.sendMessage({message: selectedText}, function(response) {
        if (response) {
            console.log(response.msg);
            var signature = response.msg; 
            renderStatus("Message Signed");      
        }
      });
    }, function(errorMessage) {
      renderStatus('Cannot sign text: ' + errorMessage);
    });
  });