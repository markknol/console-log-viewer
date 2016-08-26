console-log-viewer.js
==================

## .. displays logs and Javascript errors in an overlay on top of your site. Useful for mobile webdevelopment. Installed in 5 seconds [1]. Works on every device and browser [2].

### It's useful when you want to see logs and the errors you [3] have created in a mobile browser while you are developing and debugging. 

I found debugging is a bit hard on mobile devices since there is no magic button in mobile browser to see the console logs or Javascript errors and related source. There are a lot of remote-tools. Some are not available for all browsers, take time too much time to setup or aren't sync because of remote delays. 

## How to install (in 5 seconds)?

Add this piece of code somewhere in your html-page. Save document, refresh browser.  
In the `<head>` before other `<script>` tags is probably the best place.
    
```html
<script src="http://markknol.github.io/console-log-viewer/console-log-viewer.js"></script>
```

<img src="http://dump.stroep.nl/console-log-viewer.gif?v=4" alt="console log viewer"/>

## What does it do?

It captures `console.log`, `console.info`, `console.warn`, `console.debug`, `console.error` and `window.onerror` and displays it in an overlay on top of your site. That's it. 

## Features

#### Close / Open console
* Closes the console with the **x** button, and bring back with the **&Xi;** button. 
* Start closed using:

```html
<script src="http://markknol.github.io/console-log-viewer/console-log-viewer.js?closed=true"></script>
```

#### Pause
* Pause/resume the console logs by pressing the ► button
* Start minimized using:

```html
<script src="http://markknol.github.io/console-log-viewer/console-log-viewer.js?log_enabled=false"></script>
```

#### Minimize
* Minimize the console with the **-** button, and bring back to normal with the **+** button.
* Start minimized using:

```html
<script src="http://markknol.github.io/console-log-viewer/console-log-viewer.js?minimized=true"></script>
```

#### Alignment
* Switch top/bottom alignment by pressing the **&uarr;** or **&darr;** button in the console. 
* Start bottom aligned using:

```html
<script src="http://markknol.github.io/console-log-viewer/console-log-viewer.js?align=bottom"></script>
```

#### Displaying errors
Clicking on a Javascript-error opens the source in a new tab (<a href="https://twitter.com/mknol/status/529937001563553792">demo</a>). 
## Source

The source can be found here: 
[https://github.com/markknol/console-log-viewer/blob/gh-pages/console-log-viewer.js](https://github.com/markknol/console-log-viewer/blob/gh-pages/console-log-viewer.js)

## Disclaimers
  
_[1] .. depends on your copy/paste skills_  
_[2] .. if this isn't true [report here](https://github.com/markknol/console-log-viewer/issues)_  
_[3] .. protip: blame someone else_  
