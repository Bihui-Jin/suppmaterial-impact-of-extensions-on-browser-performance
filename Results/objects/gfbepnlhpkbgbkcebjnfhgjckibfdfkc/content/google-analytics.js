var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-17511397-16']);

var _gaEventLabel = 'Unknown';

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function sendGAEvent(category, action, label){
	_gaq.push(['_trackEvent', category, action, label || _gaEventLabel]);
}