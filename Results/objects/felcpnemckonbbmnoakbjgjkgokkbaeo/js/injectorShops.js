chrome.runtime.onMessage.addListener(function (message) {
    if (message && message.action === 'tsInfo') {
        var tsInfo = message.tsInfo;

        var tsId = tsInfo.tsId;
        var overallMark = tsInfo.om;
        var overallMarkDescription = tsInfo.omd;
        var activeReviewCount = tsInfo.arc;
        var trustMarkStatus = tsInfo.tm;

        //var cleanReferer = reduceUrlToTLD(document.referrer);
        //var cleanShopUrl = reduceUrlToTLD(tsInfo.url);

        //if (cleanReferer.indexOf(cleanShopUrl) != 0) {
        chrome.runtime.sendMessage({action: 'addShownShop', tsId: tsId});
        //session.shownShops.push(message.tsId);
        setTimeout(function () {
            renderBar(overallMark, overallMarkDescription, activeReviewCount, tsId, trustMarkStatus);
        }, 1500);
        //}
    }
});

//render bar with given params
function renderBar(overallMark, overallMarkDescription, activeReviewCount, tsId, trustMarkStatus) {
    var markDescriptionString;
    var ico_stars = chrome.runtime.getURL('images/ico_stars.png');

    if (overallMarkDescription) {
        markDescriptionString = chrome.i18n.getMessage(getMark(overallMarkDescription)).toUpperCase();
    } else {
        markDescriptionString = '';
    }

    var mainBarContainer = document.createElement('div');
    mainBarContainer.id = "TsBarElement_db8d3657bdbe440c985ae127463eaad5";

    var tsContainer = document.createElement('div');
    tsContainer.className = 'tsContainer_db8d3657bdbe440c985ae127463eaad5';
    mainBarContainer.appendChild(tsContainer);

    var tsBar = document.createElement('div');
    tsBar.className = 'tsBar_db8d3657bdbe440c985ae127463eaad5';

    if (overallMarkDescription != 'no ranking' && overallMark) {
        var omContainer = document.createElement('div');
        omContainer.className = 'tsCon_db8d3657bdbe440c985ae127463eaad5';

        var starsContainer = document.createElement('div');
        starsContainer.className = 'starsContainer_db8d3657bdbe440c985ae127463eaad5';
        starsContainer.style.backgroundImage = 'url(' + ico_stars + ')';

        var stars = document.createElement('div');
        stars.className = 'stars_db8d3657bdbe440c985ae127463eaad5';
        stars.style.width = (overallMark / 5 * 65) + 'px';
        stars.style.backgroundImage = 'url(' + ico_stars + ')';
        starsContainer.appendChild(stars);

        omContainer.appendChild(starsContainer);


        var rankingContainer = document.createElement('div');
        rankingContainer.className = 'rankingContainer_db8d3657bdbe440c985ae127463eaad5';
        rankingContainer.textContent = overallMark.toFixed(2);

        var rankingContainerSpan = document.createElement('span');
        rankingContainerSpan.className = 'bestMark_db8d3657bdbe440c985ae127463eaad5';
        rankingContainerSpan.textContent = '/5 ';
        rankingContainer.appendChild(rankingContainerSpan);

        var rankingContainerSpanDesc = document.createElement('span');
        rankingContainerSpanDesc.textContent = markDescriptionString;
        rankingContainer.appendChild(rankingContainerSpanDesc);

        omContainer.appendChild(rankingContainer);

        var reviewContainer = document.createElement('div');
        reviewContainer.className = 'reviewContainer_db8d3657bdbe440c985ae127463eaad5';

        var reviewContainerA = document.createElement('a');
        reviewContainerA.setAttribute('target', '_blank');
        reviewContainerA.setAttribute('href', 'https://www.trustedshops.de/bewertung/info_' + tsId + '.html');
        reviewContainerA.textContent = activeReviewCount + ' ' + chrome.i18n.getMessage('customerreviews');

        reviewContainer.appendChild(reviewContainerA);

        omContainer.appendChild(reviewContainer);

        tsBar.appendChild(omContainer);

    } else {
        var secureShoping = document.createElement('div');
        secureShoping.className = 'secureShopping_db8d3657bdbe440c985ae127463eaad5';
        secureShoping.textContent = chrome.i18n.getMessage('secure');
        secureShoping.appendChild(document.createElement('br'));

        var secureShopingA = document.createElement('a');
        secureShopingA.setAttribute('targer', '_blank');
        secureShopingA.setAttribute('href', 'https://www.trustedshops.com/shop/certificate.php?shop_id=' + tsId + '&amp;et_cid=136&amp;et_lid=75560');
        secureShopingA.textContent = chrome.i18n.getMessage('money');

        secureShoping.appendChild(secureShopingA);

        tsBar.appendChild(secureShoping);
    }

    var footerArrowClass = '';
    var logoContainer;
    var logoContainerA;
    var logoContainerAimg;

    if (trustMarkStatus == 'VALID') {
        logoContainer = document.createElement('div');
        logoContainer.className = 'logoContainer_db8d3657bdbe440c985ae127463eaad5';

        logoContainerA = document.createElement('a');
        logoContainerA.setAttribute('target', '_blank');
        logoContainerA.setAttribute('href', 'https://www.trustedshops.com/shop/certificate.php?shop_id=' + tsId + '&et_cid=136&et_lid=75560');

        logoContainerAimg = document.createElement('img');
        logoContainerAimg.setAttribute('src', chrome.runtime.getURL('images/logo_eu_b2b.png'));
        logoContainerAimg.style.height = '32px';
        logoContainerAimg.style.width = '32px';

        logoContainerA.appendChild(logoContainerAimg);

        logoContainer.appendChild(logoContainerA);

        tsBar.appendChild(logoContainer);

    } else {
        footerArrowClass = 'no_audit"';

        logoContainer = document.createElement('div');
        logoContainer.className = 'logoContainer_db8d3657bdbe440c985ae127463eaad5';
        logoContainer.style.float = 'right';

        logoContainerA = document.createElement('a');
        logoContainerA.setAttribute('target', '_blank');
        logoContainerA.setAttribute('href', 'https://www.trustedshops.de/bewertung/info_' + tsId + '.html');

        logoContainerAimg = document.createElement('img');
        logoContainerAimg.setAttribute('src', chrome.runtime.getURL('images/logo.svg'));
        logoContainerAimg.style.height = '32px';
        logoContainerAimg.style.width = '32px';

        logoContainerA.appendChild(logoContainerAimg);

        logoContainer.appendChild(logoContainerA);

        tsBar.appendChild(logoContainer);

    }

    var clearContainer = document.createElement('div');
    clearContainer.style.clear = 'both';
    tsBar.appendChild(clearContainer);

    tsContainer.appendChild(tsBar);

    var footerArrow = document.createElement('div');
    footerArrow.className = 'footerArrow_db8d3657bdbe440c985ae127463eaad5 ' + footerArrowClass;

    tsContainer.appendChild(footerArrow);

    mainBarContainer.appendChild(tsContainer);

    /* fadeIn/fadeOut is done by CSS */
    document.body.appendChild(mainBarContainer);
}

//get phrase id for mark
function getMark(mark) {
    if (mark == 'EXCELLENT')
        return "marka";
    if (mark == 'GOOD')
        return "markb";
    if (mark == 'FAIR')
        return "markc";
    if (mark == 'POOR')
        return "markd";
    if (mark == 'VERY_POOR')
        return "marke";
}
