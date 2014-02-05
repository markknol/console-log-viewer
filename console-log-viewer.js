/**
 * Displays logs and Javascript errors in an overlay on top of your site. Useful for mobile webdevelopment.
 * 
 * http://markknol.github.io/console-log-viewer/
 * @author Mark Knol [http://blog.stroep.nl]
 */

(function() {
	var TOTAL = 15;
	var _items = [];
	
	// add div to DOM
	document.write('<div id="debug_console" class="top-aligned"><a href="#close" id="debug_console_close_button" class="log-button">x</a><a href="#position" id="debug_console_position_button" class="log-button">&#8597;</a><div id="debug_console_messages"></div></div>');
	document.getElementById("debug_console_close_button").addEventListener("click", function(e) { document.getElementById("debug_console").style.display = 'none'; e.preventDefault();}, false);
	document.getElementById("debug_console_position_button").addEventListener("click", function(e) { document.getElementById("debug_console").className = document.getElementById("debug_console").className == "top-aligned" ? "bottom-aligned" : "top-aligned"; e.preventDefault();}, false);
	addCSS();
	
	// store original functions
	var original = {
		console: {
			log:console.log,
			debug:console.debug,
			info:console.info,
			error:console.error
		}, 
		window:{onerror: window.onerror}
	}
	
	// overwrite original functions
	if (original.console.log) console.log = function(){
		log(arguments,"log-normal", true); 
		original.console.log.apply(this, arguments);
	}
	if (original.console.debug) console.debug = function(){
		log(arguments,"log-debug", true); 
		original.console.debug.apply(this, arguments);
	}
	if (original.console.info) console.info = function(){
		log(arguments,"log-info", true); 
		original.console.info.apply(this, arguments);
	}
	if (original.console.error) console.error = function(){
		log(arguments,"log-error", true); 
		original.console.error.apply(this, arguments);
	}
	window.onerror = function(message, file, lineNumber){
		log(arguments, "log-error", true); 
		if (original.window.onerror) return original.window.onerror(message, file, lineNumber);
		else return false;
	}
	
	function getFormattedTime()
	{
		var date = new Date();
		return f(date.getHours(), 2) + ":" + f(date.getMinutes(), 2) + ":" + f(date.getSeconds(), 2) + ": " + f(date.getMilliseconds(), 3);
	}
	
	// 
	function f(v, x)
	{
		if (x===2) return  (v < 10) ? "0" + v : "" + v;
		else if (x===3)
		{
			if  (v < 10) return "00" + v;
			else if  (v < 100) return "0" + v;
			else return "" + v;
		}
	}
	
	function log(args, color, splitArgs){
		_items.push("<font class='log-date'>" + getFormattedTime() + " </font> &nbsp; <font class='" + color + "'>" + (splitArgs ? Array.prototype.slice.call(args).join(",") : args) + "<\/font>");
		while (_items.length > TOTAL) _items.shift();
		document.getElementById('debug_console_messages').innerHTML = _items.join("<br>");
	}
	
	function addCSS()
	{
		var css = '#debug_console { background: rgba(0,0,0,.75); font: 10px Arial, sans-serif!important; position:fixed; padding:0; margin:0; z-ndex:1234567; box-zizing:border-box; pointer-events:none; text-align:left; }';
		css += '#debug_console_button { border:1px solid #fff; position:absolute; z-index:2; }';
		css += '#debug_console.top-aligned {left:0; right:0; top:0;}';
		css += '#debug_console.bottom-aligned {left:0; right:0; bottom:0;}';
		css += '#debug_console a.log-button {font: bold 12px Arial, sans-serif!important; pointer-events:all; text-align:center; text-decoration:none; border:1px solid #999; background:#333; color:#fff; width:16px; height:16px; padding:5px; margin:1px; display:block; float:right; }';
		css += '#debug_console font.log-date {color:gray;}';
		css += '#debug_console font.log-info {color:yellow;}';
		css += '#debug_console font.log-debug {color:lightblue;}';
		css += '#debug_console font.log-error {color:red;}';
		css += '#debug_console font.log-normal {color:white;}';
		
		var style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet) style.styleSheet.cssText = css;
		else style.appendChild(document.createTextNode(css));
		
		document.getElementsByTagName('head')[0].appendChild(style);
	}
})();
