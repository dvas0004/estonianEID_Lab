var port = null;
var selectedText = "";

function notifyPopupScript(message){
  chrome.extension.sendRequest({msg: message});
}

// Connect to native messaging host
function connect() {
  var hostName = "vassallo.david.estonia.eid";
  
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  console.log('connected');
}

// Send message to native host
function sendNativeMessage(message) {
    
    if (port) {
        console.log("sendNativeMessage: " + message)
        message = {"text": message};
        selectedText = message;
        port.postMessage(message);
    } else {
        console.log('warning no port available');
    }
  
}

// Callback triggered on message receipt
function onNativeMessage(message) {
    console.log("onNativeMessage: " + JSON.stringify(message));
  notifyPopupScript("Received message: " + JSON.stringify(message) + "");
    
    if (message.type == "s") {
        //replace text with signed version
        signedText = "-----BEGIN SIGNED MESSAGE-----\n" + selectedText.text + "\n-----END SIGNED MESSAGE-----\nSerial Number: "+message.serial+"\nSigned Hash: "+message.signature;
        chrome.tabs.getSelected(null, function(tab) {
        // Send a request to the content script.
          chrome.tabs.sendRequest(tab.id, {action: "replaceSelection", msg: signedText}, function(response) {
            console.log(response);
          });
        });
    } else {
        signedText = selectedText.text + "\n\n\n\n\n\ Verification Result: "+message.result;
        notifyPopupScript(message.result);
    }
    
    
}

// callback when diconnected
function onDisconnected() {
  notifyPopupScript("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
}

// listener for messages from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log(request);
      
//       chrome.runtime.sendNativeMessage("vassallo.david.estonia.eid",
//          { text: "Hello" },
//          function(response) {
//            console.log("Received " + response);
//          });
      
      if (request.message=="hello") {
          connect();
      } else {
          sendNativeMessage(request.message);
      }
  });