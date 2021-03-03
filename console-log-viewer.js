/**
 * Displays logs and Javascript errors in an overlay on top of your site. Useful for mobile webdevelopment.
 * 
 * <https://github.com/markknol/console-log-viewer>
 * @author Mark Knol <http://blog.stroep.nl>
 */
var ConsoleLogViewer = (function() {
	ConsoleLogViewer.ALIGNMENT = "top"; // top | bottom
	ConsoleLogViewer.IS_MINIMIZED = false; // true | false
	ConsoleLogViewer.LOG_ENABLED = true;
	ConsoleLogViewer.IS_CLOSED = false;
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
		if (!ConsoleLogViewer.LOG_ENABLED) return;
		
		var content = args;//(splitArgs ? Array.prototype.slice.call(args).join(",") : args);
		//if (content != null && (content.indexOf("script") > -1)) return; // Want to log script ? No.
		
		_items.push("<font class='log-date'>" + this.getFormattedTime() + "</font> &nbsp; <font class='" + color + "'>" + content + "<\/font>");
		while (_items.length > ConsoleLogViewer.TOTAL) _items.shift();
		
		this.updateLog();
	}
	
	ConsoleLogViewer.prototype.updateLog = function()
	{
		if (!ConsoleLogViewer.IS_MINIMIZED)
		{
			document.getElementById('debug_console_messages').innerHTML = _items.join("<br>");
		}
		else
		{
			var minimized = [];
			for(var i = Math.max(0, _items.length-3), leni = _items.length; i < leni ; i++) minimized.push(_items[i]);
			document.getElementById('debug_console_messages').innerHTML = minimized.join("<br>");
		}
	}
	
	ConsoleLogViewer.prototype.flatten = function(value)
	{
		return value.split("<").join("&lt;").split(">").join("&gt;").split("\"").join("&quot;");
	}
	
	ConsoleLogViewer.prototype.applyCustomSettings = function()
	{
		var url = window.location.href;
		if (url.indexOf("//try.haxe.org") > -1 || url.indexOf("try-haxe.mrcdk.com") > -1)
		{
			ConsoleLogViewer.TOTAL = 999999;
			var d = document.getElementById("debug_console");
			d.style.pointerEvents = "auto";
			d.style.position = "absolute";
			d.style.left = "auto";
			d.style.top = "auto";
			d.style.bottom = "auto";
			d.style.right = "auto";
			d.style.maxHeight = "100%";
			d.style.width = "98%";
			d.style.background = "rgba(250,250,250,.7)";
			d.style.overflow = "auto";
			var m = document.getElementById("debug_console_messages");
			m.style.font = "12px sans-serif";
			m.style.pointerEvents = "auto";
			document.getElementById("debug_console_close_button").style.display="none";
			document.getElementById("debug_console_minimize_button").style.display="none";
			document.getElementById("debug_console_position_button").style.display="none";
			document.getElementById("debug_console_pause_button").style.display="none";
		}
	}
	
	ConsoleLogViewer.prototype.overwrite = function()
	{
		var self = this;
		// store original functions
		var original = 
		{
			console: 
			{
				log:console.log,
				debug:console.debug,
				info:console.info,
				warn:console.warn,
				error:console.error
			}, 
			window: 
			{
				onerror: window.onerror
			}
		}
		
		// overwrite original functions
		if (original.console.log) console.log = function()
		{
			self.log(self.flatten(Array.prototype.slice.call(arguments).join(",")),"log-normal", true); 
			original.console.log.apply(this, arguments);
		}
		if (original.console.debug) console.debug = function()
		{
			self.log(self.flatten(Array.prototype.slice.call(arguments).join(",")),"log-debug", true); 
			original.console.debug.apply(this, arguments);
		}
		if (original.console.info) console.info = function()
		{
			self.log(self.flatten(Array.prototype.slice.call(arguments).join(",")),"log-info", true); 
			original.console.info.apply(this, arguments);
		}
		if (original.console.warn) console.warn = function()
		{
			self.log(self.flatten(Array.prototype.slice.call(arguments).join(",")),"log-warn", true); 
			original.console.warn.apply(this, arguments);
		}
		if (original.console.error) console.error = function()
		{
			self.log(self.flatten(Array.prototype.slice.call(arguments).join(",")),"log-error", true); 
			original.console.error.apply(this, arguments);
		}
		window.onerror = function(message, url, lineNumber){
			self.log([message, "<a target='_blank' onclick='javascript:DebugSource.show(this.href, this.parentNode.innerText);return false' href='"+url+"#"+lineNumber+"'>"+url+"</a>", "line:" + lineNumber], "log-error", true); 
			if (original.window.onerror) return original.window.onerror(message, url, lineNumber);
			else return false;
		}
	}
	
	ConsoleLogViewer.prototype.addDivs = function(self)
	{
		var self = self;
		var alignment = window.location.href.indexOf("console_at_bottom=true") > -1 || window.location.href.indexOf("console_at_bottom=1") > -1 ? "bottom-aligned" : "top-aligned";
		var scripts = window.document.getElementsByTagName('script');
		for (var i=0;i<scripts.length;i++) 
		{
			var script = scripts[i];
			if(typeof script !== 'undefined' && typeof script.src !== 'undefined') 
			{
				if (script.src.indexOf('console-log-viewer.js') !== -1) 
				{
					if (script.src.indexOf('align=bottom') !== -1)
					{
						ConsoleLogViewer.ALIGNMENT = "bottom";
					} 
					if (script.src.indexOf('minimized=true') !== -1)
					{
						ConsoleLogViewer.IS_MINIMIZED = true;
					}
					if (script.src.indexOf('closed=true') !== -1)
					{
						ConsoleLogViewer.IS_CLOSED = true;
					}
					if (script.src.indexOf('log_enabled=false') !== -1)
					{
						ConsoleLogViewer.LOG_ENABLED = false;
					}
				}
			}
		}
		
		
		var div = document.createElement('div');
		div.id = "debug_console";
		var html = '<a href="#close" id="debug_console_close_button" class="log-button"></a>';
		html += '<a href="#minimize" id="debug_console_minimize_button" class="log-button"></a>';
		html += '<a href="#position" id="debug_console_position_button" class="log-button"></a>';
		html += '<a href="#pause" id="debug_console_pause_button" class="log-button"></a>';
		html += '<div id="debug_console_messages"></div>';
		div.innerHTML = (html);
		document.getElementsByTagName('body')[0].appendChild(div);
		
		document.getElementById("debug_console_close_button").addEventListener("click", function(e) { 
			//div.style.display = "none";
			ConsoleLogViewer.IS_CLOSED = !ConsoleLogViewer.IS_CLOSED;
			self.setClosed(ConsoleLogViewer.IS_CLOSED);
			e.preventDefault();
		}, false);
		
		window.addEventListener("keydown", function(e) { 
			if (e.keyCode == 192) {
				ConsoleLogViewer.IS_CLOSED = !ConsoleLogViewer.IS_CLOSED;
				self.setClosed(ConsoleLogViewer.IS_CLOSED);
			}
		}, false);
		
		document.getElementById("debug_console_minimize_button").addEventListener("click", function(e) { 
			ConsoleLogViewer.IS_MINIMIZED = !ConsoleLogViewer.IS_MINIMIZED;
			self.setMinimized(ConsoleLogViewer.IS_MINIMIZED);
			e.preventDefault();
		}, false);
		
		document.getElementById("debug_console_position_button").addEventListener("click", function(e) { 
			ConsoleLogViewer.ALIGNMENT = ConsoleLogViewer.ALIGNMENT == "top" ? "bottom" : "top";
			self.alignTo(ConsoleLogViewer.ALIGNMENT);
			e.preventDefault();
		}, false);
		
		document.getElementById("debug_console_pause_button").addEventListener("click", function(e) { 
			ConsoleLogViewer.LOG_ENABLED = !ConsoleLogViewer.LOG_ENABLED; 
			self.setLogEnabled(ConsoleLogViewer.LOG_ENABLED);
			e.preventDefault();
		}, false);
		
		self.setClosed(ConsoleLogViewer.IS_CLOSED);
		self.setMinimized(ConsoleLogViewer.IS_MINIMIZED);
		self.setLogEnabled(ConsoleLogViewer.LOG_ENABLED);
		self.alignTo(ConsoleLogViewer.ALIGNMENT);
	}
	
	ConsoleLogViewer.prototype.setClosed = function(value) { // true | false
		ConsoleLogViewer.IS_CLOSED = value; 
		
		document.getElementById("debug_console_close_button").innerHTML = !value ? "x" : "&Xi;";
		document.getElementById("debug_console").style.background = !value ? "rgba(0, 0, 0, .75)" : "transparent";
		document.getElementById("debug_console_messages").style.display = !value ? "block" : "none";
		document.getElementById("debug_console_minimize_button").style.display = !value ? "inline" : "none";
		document.getElementById("debug_console_position_button").style.display = !value ? "inline" : "none";
		document.getElementById("debug_console_pause_button").style.display = !value ? "inline" : "none";
	}
	
	ConsoleLogViewer.prototype.setLogEnabled = function(value) { // true | false
		ConsoleLogViewer.LOG_ENABLED = value; 
		document.getElementById("debug_console_pause_button").innerHTML = (!value ? "||" : "&#9658;"); 
	}
	
	ConsoleLogViewer.prototype.setMinimized = function(value) { // true | false
		ConsoleLogViewer.IS_MINIMIZED = value;
		document.getElementById("debug_console_minimize_button").innerHTML = value ? "+" : "-";
		this.updateLog();
	}
	
	ConsoleLogViewer.prototype.alignTo = function(value) { // top | bottom
		ConsoleLogViewer.ALIGNMENT = value;
		document.getElementById("debug_console").className = value == "bottom" ? "bottom-aligned" : "top-aligned"; 
		document.getElementById("debug_console_position_button").innerHTML = value == "bottom" ? "&uarr;" : "&darr;";
	}
	
	ConsoleLogViewer.prototype.addCSS = function()
	{
		var css = '#debug_console { background: rgba(0,0,0,.75); position:fixed; padding:0; margin:0; z-index:12834567; box-sizing:border-box; pointer-events:none; text-align:left; text-transform:none; }';
		css += '#debug_console, #debug_console * { font: 12px sans-serif!important;  }';
		css += '#debug_console_messages { background:transparent;pointer-events:none; }'
		css += '#debug_console_button { border:1px solid #fff; position:absolute; z-index:2;  }';
		css += '#debug_console.top-aligned {left:0; right:0; top:0;}';
		css += '#debug_console.minimized {left:0; right:0; top:0;}';
		css += '#debug_console.bottom-aligned {left:0; right:0; bottom:0;}';
		css += '#debug_console a.log-button {font: bold 12px sans-serif!important; pointer-events:all; text-align:center; text-decoration:none; border:1px solid #999; background:#333; color:#fff; width:16px; height:16px; padding:5px; margin:1px; display:block; float:right; box-sizing: content-box; }';
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




(function ($hx_exports) { "use strict";
var DebugSource = $hx_exports.DebugSource = function() { };
DebugSource.__name__ = true;
DebugSource.main = function() {
};
DebugSource.show = function(url,message) {
	var $window = window.open("","_blank");
	var http = new haxe_Http(url.split("#").shift());
	http.onData = function(data) {
		var startLineNumber = Std.parseInt(url.split("#").pop().split("-").shift()) - 1;
		var endLineNumber = Std.parseInt(url.split("#").pop().split("-").pop()) - 1;
		var css = $window.document.createElement("style");
		var stylesheet = "body{font:14px consolas,'courier new',monospaced;background:#FFF;}\npre{max-width:1000px;width:100%;white-space:pre-line;}\n.highlighted-line{background:yellow;display:inline-block;}\n.tab{padding-right:20px;}\n.keyword{color:blue;}\n.operator{color:lightgray;}\n.linenumber{display:inline-block;width:45px;margin-right:5px;background:darkgray;color:white;}\n.debug-error{display:block;background:red;color:white;}";
		css.type = "text/css";
		if(css.styleSheet) css.styleSheet.cssText = stylesheet; else css.appendChild($window.document.createTextNode(stylesheet));
		$window.document.getElementsByTagName("head")[0].appendChild(css);
		var view = $window.document.createElement("pre");
		data = data.split("<").join("&lt;").split(">").join("&gt;").split("\"").join("&quot;");
		var lines = data.split("\n");
		var html = "";
		var _g_i = 0;
		var _g_items = lines;
		while(_g_i < _g_items.length) {
			var obj = new IndexedItemObject_$String(_g_i,_g_items[_g_i++]);
			var content = obj.item;
			content = content.split("\t").join("<span class=\"tab\"></span>");
			content = content.split("\t").join("<span class=\"tab\"></span>");
			if(obj.index >= startLineNumber && obj.index <= endLineNumber) {
				content = "<div class=\"highlighted-line\" id=\"highlight\"><div class=\"debug-error\"><strong>Error:</strong><em>" + message + "</em></div>" + content + "</div>";
				html += "<span class=\"linenumber\">" + (obj.index + 1) + "</span>" + content + "<br/>";
			} else html += "<span class=\"linenumber\">" + (obj.index + 1) + "</span>" + content + "<br/>";
		}
		view.innerHTML = html;
		$window.document.body.appendChild(view);
		$window.document.getElementById("highlight").scrollIntoView(true);
		haxe_Timer.delay(function() {
			$window.document.getElementById("highlight").scrollIntoView(true);
		},300);
		return;
	};
	http.onError = function(msg) {
		js_Lib.alert(msg);
	};
	http.request();
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
var IndexedItemObject_$String = function(index,item) {
	this.index = index;
	this.item = item;
};
IndexedItemObject_$String.__name__ = true;
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.exists = function(it,f) {
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
};
var Std = function() { };
Std.__name__ = true;
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var haxe_Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe_Http.__name__ = true;
haxe_Http.prototype = {
	request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js_Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js_Boot.__string_rec(o[i],s); else str += js_Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var js_Browser = function() { };
js_Browser.__name__ = true;
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
var js_Lib = function() { };
js_Lib.__name__ = true;
js_Lib.alert = function(v) {
	alert(js_Boot.__string_rec(v,""));
};
String.__name__ = true;
Array.__name__ = true;
DebugSource.main();
})(typeof window != "undefined" ? window : exports);
