//
//	Author: munawwar_ali@yahoo.com
//

var loadRetryCount = 5; 
const RETRY_DELAY = 400;

$(document).ready(function()
{	
	$(".tool").on('click', function(){
		updateToolDescription(event.target.id);
	});
		
    console.log("onLoad...");
    // Load initial page
	var theme = getParamValue("theme");
	if(theme && theme !== ""){
		app_theme = "theme-"+theme;
		$("body").addClass(app_theme);
	}
	var mode = getParamValue("mode");
	app_mode = mode ?? 'default';
	$(".toolDiv").show();
	
	var noTools = getParamValue("no-tools");
	var tools = getParamValue("tools");
	showHideTools(noTools, tools);
	$("#hd-loading").hide();
	
	checkBrowserSupport();
});

function showHideTools(noTools, tools){
	if(noTools && noTools.length > 0){
		noTools.split(',').every(function(t){
			var tt = $(".toolSpan img[id^="+t+"]");
			if(tt && tt.length > 0){
				tt.hide();
			}
			return true;
		});
	}
	
	if(tools && tools.length > 0){
		tools.split(',').every(function(t){
		    var tt = $(".toolSpan img[id^="+t+"]");
		    if(tt && tt.length > 0){
			    if(t.startsWith('sp')){
				    //$("#speech_2").show();
				    //toggleAutoplay();
			    }else{
				    tt.show();
			    }
		    }
		    return true;
	    });
	}
}

function updateVoiceSelection(){
	var lang = $("#lang-options").val();
	var val = $('#voice-options option:selected').val();
	if(val){
		states[lang] = val;
		loadVoiceOptions(true, true);
		
		const event = new Event('onvoiceloaded');
		document.dispatchEvent(event);
	}	
}

function loadVoiceOptions(fill, clean){
	var l = $("#lang-options").val();
	var voices = $('#languages option[value^="'+l.substring(0,2)+'"]');
	//if(voices.length === 0){
	//	voices = $('#languages option:contains("'+l.replace('-','_')+'")');
	//}
	$("#voice-options").empty();
	if(voices.length > 0 && fill){
		var filter = {};
		var o = '';
		for(var i = 0; i < voices.length; i++){
			var val = voices[i].value;
			if(filter[voices[i].value] === undefined) 
			{
				var selected = (states[l] === val) ? " selected " : "";
				//var value = (i === 0) ? ' value="'+l+'" ' : ' value="'+l+i+'" ';
				var value = ' value="'+val+'" ';
				o += '<option '+value+selected+'>'+voices[i].text+'</option>';
				filter[voices[i].value] = true;
			}
		}
		$("#voice-options").append($(o));
	}
	
	//const langSelectionEvent = new Event("lang-changed");
	//document.dispatchEvent(langSelectionEvent);
	
	return voices;
}

function loadLanguages(){
	var l = $("#languages");
	l.empty();
	
	const event = new Event('onvoiceloaded');
	document.dispatchEvent(event);
};

			
function singInUser(){
	console.log("signIn");
	$('.reading-pane').attr("src","");
	setTimeout(function(){
		$('.reading-pane').attr('src', encodeURI(getLocationPath() + "login.html"));
		//$('#title-img').hide();
	}, 5);
}

function changeLanguageOption(lang){
	
	langOption = lang ?? langOption ?? "en-US";
	if( !lang && langOption == "ar-SA"){
		langOption = "en-US";
	}
		
	var selectElement = document.getElementById('lang-options');
	selectElement.value = langOption;
	var event = new Event('change');
	selectElement.dispatchEvent(event);	
}

function toggleHead(){
	$(".toolDiv").toggle();
	if($("#imgHead").prop('src').endsWith("up.png"))
		$("#imgHead").prop('src', 'images/dn.png');
	else
		$("#imgHead").prop('src', 'images/up.png');
}

function toggleAutoplay(){
	
	if(!speech_synthesis_supportd){
		$("#ss-support_2").show();
		//toggleIcon("#ss-support");
		//alert('Speech synthesis is not supported on your browser!');
	}else{
		$("#ss-support_1").hide();
		$("#ss-support_2").hide();
		toggleIcon("#speech");
		autoplay = !autoplay;
		
		if(autoplay){
			$("#playSections").show();
			$("#play").show();
			updateStates({"speech": "Autoplay is now enabled!" });
		}else{
			$("#playSections").hide();
			$("#play").hide();
			updateStates({"speech": "Autoplay is now disabled!" });
		}
	}
	console.log('autoplay :' + autoplay);
}

function toggleMenu(){
	
	toggleIcon("#topics");
	menuOption = !menuOption;
	$(".menu-container").toggle();
	//console.log('menuOption :' + menuOption);
}

function toggleIcon(id){
	[id+'_1', id+'_2'].forEach(function(id){
		//console.log('toggleIcon: ' + id); 
		$(id).toggle();	
	});
	
};

function loadResources(){
	console.log("loadResources");
	$('.reading-pane').attr("src","");
	setTimeout(function(){
		$('.reading-pane').attr('src', encodeURI(getLocationPath() + "dresources.html"));
	}, 5);
}

function loadTestBankResources(){
	console.log("loadTestBankResources");
	$('.reading-pane').attr("src","");
	setTimeout(function(){
		$('.reading-pane').attr('src', encodeURI(getLocationPath() + "qtests.html"));
	}, 5);
}

function loadDictionarySearch(text){

	console.log("loadDictionarySearch");
	$('.reading-pane').attr("src","");
	setTimeout(function(){
		$('.reading-pane').attr('src', encodeURI(getLocationPath() + "dsearch.html?search="+text));
		//$('#title-img').hide();
	}, 5);
}

function loadGrammarView(params){

	console.log("loadGrammarView");
	$('.reading-pane').attr("src","");
	setTimeout(function(){
		var path = "dict.html?";
		if(params){
			if(params["action"])
				path += "&action="+params["action"];
			if(params["data"])
				path += "&data="+params["data"];
		}
		$('.reading-pane').attr('src', encodeURI(getLocationPath() + path));
		//$('#title-img').hide();
	}, 5);
}

function loadQuranSearch(text, sval = ''){
	
	console.log("loadQuranSearch");
	$('.reading-pane').attr("src","");
	setTimeout(function(){

		//get lang pram value
		var selectElement = document.getElementById('lang-options');
		var lang = selectElement.value.substring(0,2);

		$('.reading-pane').attr('src', encodeURI(getLocationPath() + "qsearch.html?search="+text+"&lang="+lang+"&mode="+app_mode));
		//$('#title-img').hide();
	}, 5);
}

function showClock(){
	console.log("showChart: "+ name);
	$('.reading-pane').attr("src","");
	setTimeout(function(){
		$('.reading-pane').attr('src', encodeURI(getLocationPath() + "clock.html"));
	}, 5);
}

function showChart(sel){
	var name = $('#sel'+sel).val();
	console.log("showChart: "+ name);
	$('.reading-pane').attr("src","");
	var path = "";
	switch (sel){
		case "Vocab": path = 'cards.html?data='+name; break;
		case "Misc": path = name+'.html'; break;
		case "Chart": path = 'charts.html?folder='+name; break;
		case "TTS": path = 'tts.html';break;
		default: console.log('Error: invalid section');	return;
	}
	setTimeout(function(){
		$('.reading-pane').attr('src', encodeURI(getLocationPath() +  path));
	}, 5);
}

function updateToolDescription(id, opt){
	
	var lOption = $("#l-option-child");
	lOption = lOption.detach();

	var toolMessage = $("#tool-description");
	toolMessage.empty();
	toolMessage.show();
	$("#psHolder").hide();
	
	switch(id){
		case 'theme':
			var sdiv = $('<div>'+
			'Choose a theme: <select id="theme-options" onchange="changeTheme(this)">'+
			'<option value="default" '+(app_theme === 'default' ?' selected ':'')+'>Default</option>'+
			'<option value="theme-dark" '+(app_theme === 'dark-theme' ?' selected ':'')+'>Dark</option>'+
			'<option value="theme-grayscale" '+(app_theme === 'grayscale-theme' ?' selected ':'')+'>Grayscale</option>'+
			'<option value="theme-saturation" '+(app_theme === 'saturation-theme' ?' selected ':'')+'>Saturation</option>'+
			'<option value="theme-sepia" '+(app_theme === 'sepia-theme' ?' selected ':'')+'>Sepia</option>'+
			'</select>'+
			'</div>');
			toolMessage.html(sdiv);
			break;
			
		case "km":
		{
			toolMessage.html($('<p Style="padding:0;margin:0;"><b>Test</b></p>'));
		}
		break;		
	}
}

function toggleMenu(items, key){
	items.every(function(mi){
		if("sel"+mi == key){
			$("#sel"+mi).show();
			showChart(mi);
		}else{
			$("#sel"+mi).hide();
		}
		return true;
	});
}

function updateInitialStates(){
	updateStates({"ss_support": speech_synthesis_supportd ?
						"Speech Synthesis is supported by the browser!":
						"Speech Synthesis is NOT supported by the browser!"});
	updateStates({"speeqch": autoplay ?
						"Autoplay is now disabled!":
						"Autoplay is now enabled!"});
}

function checkBrowserSupport(){
	
	if(navigator){
		const userAgent = navigator.userAgent;
		console.log(userAgent);
		if (userAgent.includes("Edg") || userAgent.includes("Chrome")) {
			setTimeout(function(){$("#info").hide();},5);
		}else{
			updateStates({"info": "Best viewed in Chromium/Edge browser."});
			$("#info").show();
			updateToolDescription("info");
		}
	}
				
	var support = document.getElementById("support").innerHTML;
	if(support.startsWith("Hurray")){
		speech_synthesis_supportd = true;
		//toggleAutoplay();
		updateInitialStates();
		$("#ss-support_1").hide();
		$("#ss-support_2").hide();
	}
	else{
		speech_synthesis_supportd = false;
	}	
}

function autoplayAudio(chapter, page){
	var lang = parent ? parent.getLangOption() : "en-US";
	var url = getLocationPath() + 'data/audio/'+ lang + '_' + chapter + '_autoplay.json';
	console.log('Loding play file: ' + url);
	loadJsonData(url, function(data){
		
		var sections = jQuery.map(data, function(obj) {
			if(obj.pageNo === page)
			return obj.sections;
		});
		
		// Load play list
		$('#playSections').find('option').remove().end();
		if(sections){
			sections.forEach(function(sect){
				//console.log(sect.play);
				$('#playSections').append('<option value="'+ sect.play +'">'+sect.topic+'</option>');					
			});
			
			$("#text").text($('#playSections').val());
			
			if(autoplay)
				$("#play").click();
			
			
		}
	}, function(err){
		console.log("Please change language option and retry!");
	});
}

function getDefaultActions(txt){
	var res = [];
	
	if(txt){
		if(txt.match(/[\u0621-\u064A]+/g) && !txt.includes(' ')){
			res.push('...Analyze '+arRemovePunct(txt));
		}
		res.push('...QuranSearch '+arRemovePunct(txt));
	}
	return res;
}

function genAndDownloadSitemap(){
	var dataFile =  getLocationPath() + 'data/isearch.json'; 
	loadJsonData(dataFile, function(data){
		var siteMap = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
		siteMap += getDefaultSiteMapUrls();
		for(const [k,v] of Object.entries(data)){
			var keys = k.split(";").filter(x => x !== "");
			keys.every(function(xKey){
				siteMap += getSitemapUrl(xKey);
				return true;
			});
		}
		siteMap += '</urlset>';
		saveTextAsFile(siteMap, "site-map.xml");
	});
}

function saveTextAsFile(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getDefaultSiteMapUrls(){
	return getSitemapUrl() + 
		   getSitemapUrl('Quran search');
}

function getSitemapUrl(query){
	var priority = '1.0';
	var dateStr = '2025-01-08'
	var baseUrl = 'https://munawwaransari.github.io/alug';
	if(query) baseUrl += '?q='+encodeURI(query);
	return '<url>'+
      '<loc>'+baseUrl+'</loc>'+
      '<lastmod>'+dateStr+'</lastmod>'+
      '<changefreq>monthly</changefreq>'+
      '<priority>'+priority+'</priority>'+
   '</url>';
}

function changeTheme(opt){
	$('body[class^="theme-"]').removeClass();
	var t=$(opt).val();
	if(t !== 'default'){
		$('body').addClass(t);
	}
}
