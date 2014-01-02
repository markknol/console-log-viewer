/**
 * console.log on top of your website / game. Useful for mobile development. Also captures window errors. 
 * @author Mark Knol [http://blog.stroep.nl]
 */

(function() {
	var total = 15;
	var _items = [];
	
	var theme = {
		background: "rgba(0,0,0,.75)",
		font: "10px Arial, sans-serif!important",
		position:"fixed",
		left:0,
		right:0,
		top:0,
		padding:0,
		margin:0,
		zIndex: 1234567,
		boxSizing:"border-box",
		pointerEvents:"none",
		textAlign:"left"
	}
	
	// add div to DOM
	var _styles = [];
	for (property in theme) _styles.push(property.replace(/([A-Z])/g, function(v) { return "-"+v.toLowerCase(); }) +":"+theme[property]);
	var style=_styles.join(";");
	document.write('<div id="debug_console" style="'+style+'">&nbsp;</div>');
	
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
		log(arguments,"white", true); 
		original.console.log.apply(this, arguments);
	}
	if (original.console.debug) console.debug = function(){
		log(arguments,"blue", true); 
		original.console.debug.apply(this, arguments);
	}
	if (original.console.info) console.info = function(){
		log(arguments,"lightblue", true); 
		original.console.info.apply(this, arguments);
	}
	if (original.console.error) console.error = function(){
		log(arguments,"red", true); 
		original.console.error.apply(this, arguments);
	}
	window.onerror = function(message, file, lineNumber){
		log(arguments, "red", true); 
		if (original.window.onerror) return original.window.onerror(message, file, lineNumber);
		else return false;
	}
	
	function log(args, color, splitArgs){
		_items.push("<font color='"+color+"'>" + (splitArgs ? Array.prototype.slice.call(args).join(",") : args) + "<\/font>");
		while (_items.length > total) _items.shift();
		document.getElementById('debug_console').innerHTML = _items.join("<br>");
	}
})();
