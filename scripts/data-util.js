//
//	Author: munawwar_ali@yahoo.com
//

function getLocationPath(){
	return window.location.href.substring(0,window.location.href.lastIndexOf("/")+1);
}

function getSiteLocationPath(url){
	return url.substring(0,window.location.href.lastIndexOf("/")+1);
}

function getParamValue(paramName){
	var url = window.location.search.substring(1); //get rid of "?" in querystring
	var qArray = url.split('&'); //get key-value pairs
	for (var i = 0; i < qArray.length; i++) 
	{
		var pArr = qArray[i].split('='); //split key and value
		if (pArr[0] == paramName) 
			return pArr[1]; //return value
	}
}

async function loadJsonData(url, callback, errorCallback)
{

	try {
		console.log('Fetching: '+ url);
		const response = await fetch(url+"?nocache=123");
		if (!response.ok) {

			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();

		callback(data);
	} 
	catch (error) {

		console.error("Fetch error:", error);
		if (errorCallback){
			errorCallback(error);
		}
	}
}

async function loadHtmlData(url,  callback, opt)
{
	try {
		const response = await fetch(url, opt);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.text();
		callback(data);
	} 
	catch (error) {
		console.error("Fetch error:", error);
	}
}

async function loadZipData(url, file, callback, errorCallback)
{
	try {
		console.log('Fetching zip: '+ url);
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		var jsZip = new JSZip();
		jsZip.loadAsync(response.blob())
		     .then(function (zip){
				zip.file(file)
				   .async("string")
				   .then(function(data){
						if(file.endsWith(".json")){
							surah_list_cache = JSON.parse(data);
							callback(surah_list_cache); 	
						}						
					})
			 });
	} 
	catch (error) {

		console.error("Fetch error:", error);
		if (errorCallback){
			errorCallback(error);
		}
	}
}

function copyTextToClipboard(txt){
	navigator.clipboard.writeText(txt);
}

const PAD_WIDTH = 768;
const MOBILE_WIDTH = 480;

function getDeviceType() {
	var device_width = window.innerWidth * window.devicePixelRatio;
    var device_height = window.innerHeight * window.devicePixelRatio;

    if (device_width <= MOBILE_WIDTH) {
        return "mobile";
    } else if (device_width <= PAD_WIDTH) {
        return "mobile";
    } else {
        return "desktop";
    }
}

function isOS(os){
	return navigator.userAgent.includes(os+";") || 
	navigator.userAgent.includes(os);
}

//https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
function invertColor(hex) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	// invert color components
	var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
		g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
		b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
	// pad each with zeros and return
	return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
	len = len || 2;
	var zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}

function toggleDropdownContent(elem, state){
	//$(elem).closest('div').find("[class^='chk']").find("[class=dropdown-content]").hide();
	if(state){
		$(elem).next().addClass("dropdown-content");
		$(elem).next().show();
	}else{
		$(elem).next().toggleClass("dropdown-content");
		$(elem).next().toggle();
	}
}

function bringIntoView(elem, delay=1600){
	var el = elem; //$(elem);
	if(el.length > 0){
		$([document.documentElement, document.body]).animate({
			scrollTop: $(elem).offset().top
		}, delay);
	}
}

var supportsPassive;
function getPassiveOption(){
	if(supportsPassive === undefined){
		try {
		  return Object.defineProperty({}, 'passive', {
			get: function() {
			  supportsPassive = true;
			}
		  });
		} catch (e) {
			supportsPassive = false;
			console.log("Passive support: "+ supportsPassive);
		}	
	}
	return supportsPassive ? { passive: true } : { passive: false };
}

function toDataURL(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';
    xhr.onload = function(){
      var fr = new FileReader();
    
      fr.onload = function(){
        callback(this.result);
      };
    
      fr.readAsDataURL(xhr.response); // async call
    };
    
    xhr.send();
}

function toggleQHead(){
	if($("#imgQHead").prop('src').endsWith("up.png")){
		$("#imgQHead").prop('src', 'images/dn.png');
		$("#divQHead").hide();
	}
	else{
		$("#imgQHead").prop('src', 'images/up.png');
		$("#divQHead").show();
	}
	changeDisplayLayout();
}

function shareExternal(title, parameters){
	if (navigator.share) {
	  var url = getLocationPath()+"?"+parameters.join('&')
	  const shareData = {
		title: title,
		text: 'Here is an interesting verse for you:',
		url: url
	  };

	  // Trigger the share menu
	  navigator.share(shareData)
		.then(() => console.log('Shared!'))
		.catch((error) => console.error('Error sharing content:', error));
	} 
	else {
	  console.error('Web Share API is not supported on this browser.');
	}
}
