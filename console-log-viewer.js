/**
 * Displays logs and Javascript errors in an overlay on top of your site. Useful for mobile webdevelopment.
 * 
 * http://markknol.github.io/console-log-viewer/
 * @author Mark Knol [http://blog.stroep.nl]
 */


var ConsoleLogViewer = (function() {
	
	ConsoleLogViewer.logEnabled = true;
	ConsoleLogViewer.TOTAL = 15;
	
	var _items = [];
	
	function ConsoleLogViewer()
	{
		var self = this;
		try
		{
			self.addCSS();
			self.addDivs(self);
			self.overwrite();
			self.applyCustomSettings();
		}
		catch(e) 
		{
			setTimeout(function()
			{
				self.addCSS();
				self.addDivs(self);
				self.overwrite();
				self.applyCustomSettings();
			}, 61);
		}
	}
	
	ConsoleLogViewer.prototype.getFormattedTime = function()
	{
		var date = new Date();
		return this.format(date.getHours(), 2) + ":" + this.format(date.getMinutes(), 2) + ":" + this.format(date.getSeconds(), 2) + ":" + this.format(date.getMilliseconds(), 3);
	}
	
	ConsoleLogViewer.prototype.format = function(v, x)
	{
		if (x == 2) return  (v < 10) ? "0" + v : "" + v;
		else if (x == 3)
		{
			if  (v < 10) return "00" + v;
			else if  (v < 100) return "0" + v;
			else return "" + v;
		}
	}
	
	ConsoleLogViewer.prototype.log = function(args, color, splitArgs)
	{
		if (!ConsoleLogViewer.logEnabled) return;
		
		_items.push("<font class='log-date'>" + this.getFormattedTime() + "</font> &nbsp; <font class='" + color + "'>" + (splitArgs ? Array.prototype.slice.call(args).join(",") : args) + "<\/font>");
		while (_items.length > ConsoleLogViewer.TOTAL) _items.shift();
		document.getElementById('debug_console_messages').innerHTML = _items.join("<br>");
	}
	
	ConsoleLogViewer.prototype.applyCustomSettings = function()
	{
		if (window.location.href.indexOf("//try.haxe.org") > -1)
		{
			ConsoleLogViewer.TOTAL = 999999;
			var d = document.getElementById("debug_console");
			d.style.pointerEvents = "auto";
			d.style.position = "relative";
			d.style.left = "auto";
			d.style.top = "auto";
			d.style.bottom = "auto";
			d.style.right = "auto";
			d.style.height = "100%";
			d.style.overflow = "auto";
			var m = document.getElementById("debug_console_messages");
			m.style.font = "11px monospace";
			m.style.pointerEvents = "auto";
		}
	}
	
	ConsoleLogViewer.prototype.overwrite = function()
	{
		var self = this;
		// store original functions
		var original = {
			console: {
				log:console.log,
				debug:console.debug,
				info:console.info,
				warn:console.warn,
				error:console.error
			}, 
			window:{onerror: window.onerror}
		}
		
		// overwrite original functions
		if (original.console.log) console.log = function(){
			self.log(arguments,"log-normal", true); 
			original.console.log.apply(this, arguments);
		}
		if (original.console.debug) console.debug = function(){
			self.log(arguments,"log-debug", true); 
			original.console.debug.apply(this, arguments);
		}
		if (original.console.info) console.info = function(){
			self.log(arguments,"log-info", true); 
			original.console.info.apply(this, arguments);
		}
		if (original.console.warn) console.warn = function(){
			self.log(arguments,"log-warn", true); 
			original.console.warn.apply(this, arguments);
		}
		if (original.console.error) console.error = function(){
			self.log(arguments,"log-error", true); 
			original.console.error.apply(this, arguments);
		}
		window.onerror = function(message, url, lineNumber){
			self.log([message, "<a target='_blank' onclick='javascript:window.open(this.href);return false' href='view-source:"+url+"#"+lineNumber+"'>"+url+"</a>", "line:" + lineNumber], "log-error", true); 
			if (original.window.onerror) return original.window.onerror(message, url, lineNumber);
			else return false;
		}
	}
	
	ConsoleLogViewer.prototype.addDivs = function(self)
	{
		var alignment = window.location.href.indexOf("console_at_bottom=true") > -1 || window.location.href.indexOf("console_at_bottom=1") > -1 ? "bottom-aligned" : "top-aligned";
		var scripts = window.document.getElementsByTagName('script');
		for (var i=0;i<scripts.length;i++) {
		    script = scripts[i];
		    if(typeof script !== 'undefined' && typeof script.src !== 'undefined'){
		        if (script.src.indexOf('console-log-viewer.js') !== -1) {
		            if(script.src.indexOf('console_at_bottom=true') !== -1){
		                alignment = 'bottom-aligned';
		                break;
		            }
		        }
		    }
		}
		
		var div = document.createElement('div');
		div.id = "debug_console";
		div.className = alignment;
		div.innerHTML = ('<a href="#close" id="debug_console_close_button" class="log-button">x</a><a href="#position" id="debug_console_position_button" class="log-button">&#8597;</a><a href="#pause" id="debug_console_pause_button" class="log-button">&#9658;</a><div id="debug_console_messages"></div>');
		document.getElementsByTagName('body')[0].appendChild(div);
		
		document.getElementById("debug_console_close_button").addEventListener("click", function(e) { 
			document.getElementById("debug_console").style.display = 'none'; 
			e.preventDefault();
		}, false);
		
		document.getElementById("debug_console_position_button").addEventListener("click", function(e) { 
			document.getElementById("debug_console").className = (document.getElementById("debug_console").className == "top-aligned") ? "bottom-aligned" : "top-aligned"; 
			e.preventDefault();
		}, false);
		
		document.getElementById("debug_console_pause_button").addEventListener("click", function(e) { 
			ConsoleLogViewer.logEnabled = !ConsoleLogViewer.logEnabled; 
			this.innerHTML = (!ConsoleLogViewer.logEnabled ? "||" : "&#9658;"); 
			e.preventDefault();
		}, false);
	}
	
	ConsoleLogViewer.prototype.addCSS = function()
	{
		var css = '#debug_console { background: rgba(0,0,0,.75); font: 10px Arial, sans-serif!important; position:fixed; padding:0; margin:0; z-index:12834567; box-sizing:border-box; pointer-events:none; text-align:left; text-transform:none; }';
		css += '#debug_console_messages { background:transparent;pointer-events:none; }'
		css += '#debug_console_button { border:1px solid #fff; position:absolute; z-index:2; }';
		css += '#debug_console.top-aligned {left:0; right:0; top:0;}';
		css += '#debug_console.bottom-aligned {left:0; right:0; bottom:0;}';
		css += '#debug_console a.log-button {font: bold 12px Arial, sans-serif!important; pointer-events:all; text-align:center; text-decoration:none; border:1px solid #999; background:#333; color:#fff; width:16px; height:16px; padding:5px; margin:1px; display:block; float:right; }';
		css += '#debug_console font.log-error a {pointer-events:all;color:red;}';
		css += '#debug_console font.log-date {color:gray;}';
		css += '#debug_console font.log-info {color:yellow;}';
		css += '#debug_console font.log-warn {color:orange;}';
		css += '#debug_console font.log-debug {color:lightblue;}';
		css += '#debug_console font.log-error {color:red;}';
		css += '#debug_console font.log-normal {color:white;}';
		
		var style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet) style.styleSheet.cssText = css;
		else style.appendChild(document.createTextNode(css));
		
		document.getElementsByTagName('head')[0].appendChild(style);
	}
	
	return ConsoleLogViewer;
})();

new ConsoleLogViewer();
