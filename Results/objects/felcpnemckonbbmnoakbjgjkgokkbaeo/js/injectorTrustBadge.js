function injectScript(tsId) {
    const scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.textContent = `
      (function () { 
        var _tsid = '${tsId}'; 
            _tsConfig = { 
              'yOffset': '55', /* offset from page bottom */
              'variant': 'reviews', /* default, reviews, custom, custom_reviews */
              'disableResponsive': 'false', /* deactivate responsive behaviour */
            };
            var _ts = document.createElement('script');
            _ts.type = 'text/javascript'; 
            _ts.charset = 'utf-8'; 
            _ts.async = true; 
            _ts.src = '//widgets.trustedshops.com/js/' + _tsid + '.js'; 
            var __ts = document.getElementsByTagName('script')[0];
            __ts.parentNode.insertBefore(_ts, __ts);
      })();
    `;
    document.body.appendChild(scriptEl);
}

chrome.runtime.onMessage.addListener(function (message) {
    if (message && message.action === 'tsBadge') {
        // check TS badge with timeout because there is possibility of injecting TS badge after DOMload...
        setTimeout(function () {
            if (!isThereTsBadge()) {
                // console.log('injecting TrustBadge');
                injectScript(message.tsId);
                // chrome.runtime.sendMessage({action: 'tsBadgeShow', tsId: message.tsId});
            } else {
                // console.log('no need to inject TrustBadge! already on the page!');
            }
        }, 3600);
    }
});

// check if there is trusBadge on the page
function isThereTsBadge() {
    var possibleBadgeId = [
        'tsbadge_db8d3657bdbe440c985ae127463eaad4',
        'tsbadge4_db8d3657bdbe440c985ae127463eaad4',
        'trustbadge-container',
        'trustbadge-container-98e3dadd90eb493088abdc5597a70810',
        'trustbadge-container-98e3dadd90eb493088abdc5597a70810',
        'trustbadge-topbar-container-98e3dadd90eb493088abdc5597a70810',
        'trustbadge-custom-desktop-container-98e3dadd90eb493088abdc5597a70810',
        'trustbadge-custom-mobile-container-98e3dadd90eb493088abdc5597a70810',
    ];

    return possibleBadgeId.some(function (el) {
        return document.getElementById(el);
    });
    //
    // return document.getElementById('tsbadge_db8d3657bdbe440c985ae127463eaad4') ||
    //     document.getElementById('tsbadge4_db8d3657bdbe440c985ae127463eaad4');
}
