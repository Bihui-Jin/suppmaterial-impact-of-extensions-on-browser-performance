/**
 * Copyright (c) 2010 The Chromium Authors. All rights reserved. Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 * 
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet. It has been modified to pull the HTTPS version of ga.js instead
 * of the default HTTP version. It is recommended that you use this snippet
 * instead of the standard tracking snippet provided when setting up a Google
 * Analytics account.
 * 
 * See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
 * for information on how to use the asynchronous tracking API.
 * 
 * If you wish to use this file in your own extension, replace UA-12026369-1
 * with your own Google Analytics account number. Note that the default code
 * will automatically track a page view for any page this file is included in.
 * 
 * When including this file in your code, the best practice is to insert the
 * <script src="analytics.js"></script> include at the top of the <body>
 * section of your pages, after the opening <body> tag.
 */

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-756372-44']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();
/*
(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o), m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-756372-44', 'kaipoke.jp');
ga('send', 'pageview');
*/