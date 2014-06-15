// Set up click listeners for each of the toggle buttons
var toggleButtons = document.getElementsByClassName('toggle');
for (var i = 0; i < toggleButtons.length; i++) {
    var button = toggleButtons[i];
    button.onclick = (function() {
        var button = this;
        var action = button.getAttribute('data-action'); 
        chrome.runtime.sendMessage({
            action: action
        }, function(response) {
            // Nothing.
        });
    }).bind(button);
}
