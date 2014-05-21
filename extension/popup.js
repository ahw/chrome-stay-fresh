var port = null;

function appendMessage(text) {
    var previousContent = document.getElementById('response').innerHTML;
    document.getElementById('response').innerHTML = "<p>" + text + "</p>" + previousContent;
}

function updateUiState() {
    if (port) {
        document.getElementById('connect-button').style.display = 'none';
        document.getElementById('input-text').style.display = 'block';
        document.getElementById('send-message-button').style.display = 'block';
    } else {
        document.getElementById('connect-button').style.display = 'block';
        document.getElementById('input-text').style.display = 'none';
        document.getElementById('send-message-button').style.display = 'none';
    }
}

function sendNativeMessage() {
    message = document.getElementById('input-text').value;
    port.postMessage(message);
    appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
    console.log('got message', message);
    appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
    appendMessage("<span style=\"color:red\">Failed to connect: " + chrome.runtime.lastError.message + "</span>");
    port = null;
    updateUiState();
}

function connect() {
    var hostName = "org.vim.stayfresh";
    appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    updateUiState();
}

function sendMessage(message) {
    console.log('sending message...');
    document.getElementById('random').innerHTML = (new Date());
    chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
        var tabId = tabs[0].id;
        chrome.runtime.sendMessage({
            tabId: tabId,
            action: message
        }, function(response) {
            console.log('Sent message', message, 'and got response', response);
        });
    });
}

// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('start').addEventListener('click', startListening);
//     document.getElementById('stop').addEventListener('click', stopListening);
// });

document.getElementById('start').addEventListener('click', sendMessage.bind(this, 'start'));
document.getElementById('stop').addEventListener('click', sendMessage.bind(this, 'stop'));
