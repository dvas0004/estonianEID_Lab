function replaceSelectedText(replacementText) {
    console.log("replaceSelected Text: "+replacementText);
    splitReplacementText = replacementText.split('\n');
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            
            var elem = document.createElement("div");
            
            for (textElem in splitReplacementText) {
                    var newDiv = document.createElement("div");
                    newDiv.innerHTML = splitReplacementText[textElem];
                    elem.appendChild(newDiv);
            }
            range.insertNode(elem);
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
 if (request.action == "getSelection") {
     selectedText = window.getSelection().toString()
    sendResponse({selection: selectedText});   
 }
else if (request.action == "replaceSelection") {
    console.log("in replaceSelection: " + request);
    replaceSelectedText(request.msg);    
    
}
 else {
    sendResponse({}); // Send nothing..   
 }
});