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
	document.getElementById("faltas").addEventListener("click", function(){
		popupButtonClick("faltas.js");
	});
	document.getElementById("download").addEventListener("click", function(){
		popupButtonClick("download.js");
	});
	document.getElementById("save").addEventListener("click", function(){
		popupButtonClick("save.js");
	});
	document.getElementById("load").addEventListener("click", function(){
		popupButtonClick("load.js");
	});
});

function popupButtonClick(injectScript) {
	chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
		chrome.tabs.executeScript(null, { file: "jquery.fileDownload.js" }, function() {
	    	chrome.tabs.executeScript(null, { file: "content.js" }, function() {
	    		chrome.tabs.executeScript(null, { file:  "jszip.js"});
	    		chrome.tabs.executeScript(null, { file:  "jszip-utils.js"});
	    		chrome.tabs.executeScript(null, { file:  "FileSaver.js"});
	    		chrome.tabs.executeScript(null, { file:  injectScript});
	    	});
		});
	});
}