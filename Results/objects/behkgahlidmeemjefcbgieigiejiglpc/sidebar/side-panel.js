/* ----------------- SIDEBAR EXTERNAL ----------------- */
var betterTabSidebarActive = false;
var bd = document.body || document.getElementsByTagName('body')[0];

// read sidebar settings
chrome.storage.sync.get(function (obj) {
    if (typeof obj.sidebarOpen !== 'undefined') {
        betterTabSidebarActive = obj.sidebarOpen;
        if (betterTabSidebarActive)
            showBetterTabSidebar();
    }
    else {
        chrome.storage.sync.set({
            'sidebarOpen': true
        });
    }
});



// add/remove class
function addBetterTabClass(el, classNameToAdd) {
    el.className += ' ' + classNameToAdd;
}
addBetterTabClass(bd, 'BetterTabSidebar');



// show sidebar
function showBetterTabSidebar() {
    // anchor to mouseover
    var anchor = document.createElement('div');
    anchor.id = "BetterTabSidebarAnchorOver";
    bd.appendChild(anchor);


    // create iframe
    var anchor = document.createElement('div');
    anchor.id = "BetterTabSidebarAnchorClick";

    var overlay = document.createElement('div');
    overlay.id = "BetterTabSidebarOverlay";

    var frame_ctn = document.createElement('div');
    frame_ctn.id = "BetterTabSidebar";
    frame_ctn.style.height = "100%";
    frame_ctn.style.width = "400px";
    frame_ctn.style.position = "fixed";
    frame_ctn.style.top = "0px";
    frame_ctn.style.left = "0px";
    frame_ctn.style.zIndex = "2147483647";

    var iframe = document.createElement('iframe');
    iframe.style.height = "100%";
    iframe.style.width = "100%";
    iframe.style.border = "0px";
    iframe.src = chrome.runtime.getURL("/sidebar/sidebar.html");

    bd.appendChild(overlay);
    bd.appendChild(frame_ctn);
    frame_ctn.appendChild(iframe);
    frame_ctn.appendChild(anchor);


    // panel
    var iframe_sidebar = document.getElementById('BetterTabSidebar');
    var iframe_anchorOver = document.getElementById('BetterTabSidebarAnchorOver');
    var iframe_anchorClick = document.getElementById('BetterTabSidebarAnchorClick');
    var iframe_Overlay = document.getElementById('BetterTabSidebarOverlay');


    // mouse enter
    iframe_anchorOver.onmouseover = function () {
        addBetterTabClass(iframe_sidebar, 'bettertabsidebar_open');
        addBetterTabClass(iframe_Overlay, 'bettertabsidebar_show');
    }


    //  click
    function toggleBetterTabSidebar() {
        iframe_sidebar.classList.toggle('bettertabsidebar_open');
        iframe_Overlay.classList.toggle('bettertabsidebar_show');
    }
    iframe_anchorClick.onclick = function () {
        toggleBetterTabSidebar();
    }
    iframe_Overlay.onclick = function () {
        toggleBetterTabSidebar();
    }


    //  theme
    chrome.storage.sync.get(function (obj) {
        if (typeof obj.userDarkMode !== 'undefined') {
            darkmode = obj.userDarkMode;
            iframe_anchorClick.setAttribute('data-theme', darkmode);
            iframe_Overlay.setAttribute('data-theme', darkmode);
        }
    });
}


/* COLOR SCHEME */
try {
	var c = 'light';
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
		c = 'dark';

	chrome.storage.local.set({
		'colorScheme': c
	});
	chrome.action.setIcon({
		path: {
			'16': '/icons/16-' + c + '_theme.png',
			'32': '/icons/32-' + c + '_theme.png'
		}
	})
}
catch (e) { }