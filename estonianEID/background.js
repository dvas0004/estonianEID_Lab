var port = null;
var selectedText = "";

function notifyPopupScript(message){
  chrome.extension.sendRequest({msg: message});
}

// Connect to native messaging host
function connect() {
  var hostName = "vassallo.david.estonia.eid";
  notifyPopupScript("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  notifyPopupScript('connected');
}

// Send message to native host
function sendNativeMessage(message) {
    console.log("sendNativeMessage: " + message)
    if (port) {
        message = {"text": message};
        selectedText = message;
        port.postMessage(message);
    }
  
}

// Callback triggered on message receipt
function onNativeMessage(message) {
    console.log("onNativeMessage: " + JSON.stringify(message));
  notifyPopupScript("Received message: " + JSON.stringify(message) + "");
    //replace text with signed version
            signedText = "-----BEGIN SIGNED MESSAGE-----\n" + selectedText.text + "\n-----END SIGNED MESSAGE-----\nSigned Hash: "+message.signature;
            chrome.tabs.getSelected(null, function(tab) {
            // Send a request to the content script.
              chrome.tabs.sendRequest(tab.id, {action: "replaceSelection", msg: signedText}, function(response) {
                console.log(response);
              });
            });
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
      if (request.message=="hello") {
          connect();
          sendResponse({msg:'connecting'});
          
      } else {
          sendNativeMessage(request.message);
          sendResponse({msg:"Sent message: <b>" + request.message + "</b>"});
      }
  });