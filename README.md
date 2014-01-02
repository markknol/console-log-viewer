console-log-viewer.js
==================

#### .. displays console logs and javascript errors in a div on top of your site. Useful for mobile development. It is enabled in 5 seconds [1].   

I found debugging is a bit hard on mobile devices since there is no magic button to see the console logs or javascript errors. Adobe Edge Inspect is a great tool for this but is not available in all browsers, and takes some time to setup. If you quickly want to see your logs or see what errors you [2] have created. The same goes to other remote loggers.

#### What does it do

It overwrites `console.log`, `console.info`, `console.debug`, `console.error` and `window.onerror` and displays the input in a newly created div on top of your site. That's it.

#### How to use?

Add this piece of code somewhere in your html-page.
In the `<head>` before other `<script>` tags is probably the best place.
    
    <script src="https://raw.github.com/markknol/console-log-viewer/master/console-log-viewer.js"></script>
  
_[1] .. depends on your copy/paste skills_  
_[2] .. of course, it is not you_  
