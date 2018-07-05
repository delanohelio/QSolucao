document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("grade").addEventListener("click", function(){
		popupButtonClick("contentGrade.js");
	});
	document.getElementById("presence").addEventListener("click", function(){
		popupButtonClick("contentPresence.js");
	});
	document.getElementById("carga").addEventListener("click", function(){
		popupButtonClick("carga.js");
	});
});

function popupButtonClick(injectScript) {
	chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
	    chrome.tabs.executeScript(null, { file: "content.js" }, function() {
	    	chrome.tabs.executeScript(null, { file:  injectScript});
	    });
	});
}