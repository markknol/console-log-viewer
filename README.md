console-log-viewer.js
==================

#### .. displays logs and Javascript errors in an overlay on top of your site. Useful for mobile webdevelopment. Installed in 5 seconds [1]. Works on every device and browser [2].

I found debugging is a bit hard on mobile devices since there is no magic button in mobile browser to see the console logs or Javascript errors. [Adobe Edge Inspect](http://html.adobe.com/edge/inspect/) is a great tool for this but is not available in all browsers, and takes some time to setup. Nice when you want to see your logs or see what errors you [3] have created in a mobile browser while debugging. 

<img src="http://dump.stroep.nl/console-log-viewer.gif" alt="console log viewer"/>

#### How to install (in 5 seconds)?

Add this piece of code somewhere in your html-page. Save document, refresh browser.  
In the `<head>` before other `<script>` tags is probably the best place.
    
    <script src="http://markknol.github.io/console-log-viewer/console-log-viewer.js"></script>

#### What does it do?

It captures `console.log`, `console.info`, `console.warn`, `console.debug`, `console.error` and `window.onerror` and displays it in an overlay on top of your site. That's it.

#### Features
* Pause/resume the console logs by pressing the ► button
* Switch top/bottom alignment by pressing the ↕ button in the console. To start bottom-aligned, use `console_at_bottom=true` in the url.
  
_[1] .. depends on your copy/paste skills_  
_[2] .. if this isn't true [report here](https://github.com/markknol/console-log-viewer/issues)_  
_[3] .. protip: blame someone else_  

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/082139baa45624940f19e1af4542a4a7 "githalytics.com")](http://githalytics.com/markknol/console-log-viewer)
