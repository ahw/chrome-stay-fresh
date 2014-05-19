var listeningTabIds = {};

// Event Page Messaging
// --------------------
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    sendNativeMessage('Got request form popup: ' + request);
    console.log(sender.tab ?
        "from a content script:" + sender.tab.id :
        "from the extension");
    if (request === "start") {
        listeningTabIds[sender.tab.id] = sender.tab.id;
        sendResponse('Will start reloading tab ' + sender.tab.id + ' on relevant Vim events.');
    } else if (request === 'stop') {
        delete listeningTabIds[sender.tab.id];
        sendResponse('Will stop automatically reloading tab ' + sender.tab.id);
    }
});

// Native Messaging
// ----------------
var port = null;

function sendNativeMessage(message) {
    port.postMessage(message);
}

function onNativeMessage(eventName) {
    sendNativeMessage('Event page got eventName ' + eventName);
    switch (eventName) {
        case 'BufWritePost':
            break;
        default:
            console.log('Event name', eventName, 'is unknown. Doing nothing.');
            break;
    }
}

function onDisconnected() {
    var message = 'Failed to connect. ' + chrome.runtime.lastError.message;
    console.error(message);
    sendNativeMessage(message);
    port = null;
}

function connect() {
    var hostName = "org.vim.stayfresh";
    console.log("Connecting to native messaging host " + hostName)
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
}

connect();
