var listeningTabIds = {};

// Event Page Messaging
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Event page got message from popup', request);
    sendNativeMessage('Will ' + request + ' for messages from tab id ' + request.tabId);
    if (request.action === "start") {
        listeningTabIds[request.tabId] = request.tabId;
        sendResponse('Will start reloading tab ' + request.tabId + ' on relevant Vim events.');
        console.log('Will start reloading tab', request.tabId, 'on relevant Vim events.');
    } else if (request.action === 'stop') {
        delete listeningTabIds[request.tabId];
        sendResponse('Will stop automatically reloading tab ' + request.tabId);
        console.log('Will stop automatically reloading tab', request.tabId);
    }
});

// Native Messaging
var port = null;
function sendNativeMessage(message) {
    port.postMessage(message);
}

function onNativeMessage(eventName) {
    console.log('Event page got native message from host:', eventName);
    switch (eventName) {
        case 'BufWritePost':
            Object.keys(listeningTabIds).forEach(function(tabId) {
                tabId = parseInt(tabId);
                console.log('Found listening tab id', tabId);
                chrome.tabs.reload(tabId, function() {
                    console.log('Reloading tab id', tabId);
                });
            });
            break;
        default:
            sendNativeMessage('Event name', eventName, 'is unknown. Doing nothing.');
            break;
    }
}

function onDisconnected() {
    var message = 'Failed to connect. ' + chrome.runtime.lastError.message;
    console.log('ERROR:', message);
    port = null;
}

function connect() {
    var hostName = "org.vim.stayfresh";
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    console.log("Event page connecting to native messaging host ", hostName);
}

connect();
