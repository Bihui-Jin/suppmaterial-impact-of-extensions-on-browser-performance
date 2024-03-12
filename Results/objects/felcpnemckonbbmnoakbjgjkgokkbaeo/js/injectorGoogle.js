var aNodesList = [];

function getAHrefs() {
    var hrefs = [];
    var aNode = document.querySelectorAll('div.yuRUbf>a');
    Array.prototype.forEach.call(aNode, function (a) {
        aNodesList.push(a);
        hrefs.push(a.href);
    });
    return hrefs;
}

if (config.googleInjection.checkOnLoad) {
    chrome.runtime.sendMessage({action: 'googleGiveMeShopsInfo', hrefs: getAHrefs()});
}

chrome.runtime.onMessage.addListener(function (message) {
    var i;
    if (message.action === 'googleShopsInfo') {
        for (i = 0; i < message.shopsInfo.length; i++) {
            if (message.shopsInfo[i] !== '') {
                insertTsContent(aNodesList[i], message.shopsInfo[i]);
            }
        }
        // flush 'shown' list on google page
        chrome.runtime.sendMessage({action: 'clearShownShops'});
    }
});

function handlePage() {
    chrome.runtime.sendMessage({action: 'googleGiveMeShopsInfo', hrefs: getAHrefs()});
}

// var observer = new MutationObserver(function (mutations) {
//     var len = mutations.length;
//
//     for (var i = 0; i < len; i++) {
//         var mutation = mutations[i];
//         if (
//             mutation &&
//             mutation.type === 'attributes' &&
//             mutation.target &&
//             mutation.target.id === 'gb' &&
//             mutation.target.classList.contains('gb_of')
//         ) {
//             handlePage();
//             break;
//         }
//     }
// });
//
// observer.observe(document, {
//     childList: false,
//     subtree: true,
//     attributes: true,
//     characterData: false
// });

var insertTsContent = function (aNode, shopsData) {
    var tsId = shopsData.tsId;
    var overallMark = shopsData.om;
    var overallMarkDescription = shopsData.omd;
    var activeReviewCount = shopsData.arc;
    var trustMarkStatus = shopsData.tm;

    let divRc = aNode.parentNode.parentNode.parentNode;
    let divS;
    const divRcDisplayStyle = window.getComputedStyle(divRc).display;
    if (divRcDisplayStyle === 'grid') {
        divS = aNode.parentNode.parentNode.nextSibling.nextSibling;
    }
    if (!divS) {
        divS = divRc.querySelector('div.IsZvec');
    }
    if (!divS) {
        divS = aNode.parentNode.parentNode.nextSibling;
    }
    if (!divS) return;

    var starsImageWidth = (overallMark / 5 * 65) + 'px';

    var tsShopRatingHref = chrome.i18n.getMessage('ratingProfileUrl', tsId) +
        '?utm_source=google' +
        '&utm_medium=' + config.googleInjection.utm_medium +
        '&utm_campaign=BrowserExtension';

    if (trustMarkStatus === 'DISABLED') {
        return;
    }

    /*insert image*/
    if (trustMarkStatus === 'VALID' && !aNode.classList.contains('trustmarkInsertedByTsExtension')) {
        var linkNode = document.createElement('a');
        linkNode.setAttribute('target', '_blank');
        linkNode.setAttribute('href', tsShopRatingHref);

        var imgNode = document.createElement('img');
        imgNode.setAttribute('src', config.PATH.IMAGES + 'trustmark_44x44px.png');
        imgNode.className = 'logo_eu_b2b';

        linkNode.appendChild(imgNode);

        var imgTag = document.createElement('div');
        imgTag.className = 'tsCertificateLink';
        imgTag.appendChild(linkNode);

        var clearTag = document.createElement('div');
        clearTag.style.clear = 'left';

        aNode.classList.add('trustmarkInsertedByTsExtension');
        if (divS) {
            // divS.querySelectorAll('div')[0].style.marginLeft = '56px';
            divS.insertBefore(imgTag, divS.firstChild);
            divS.appendChild(clearTag);
        }
    }

    /*insert reviews bar*/
    if (overallMark && overallMark > 0 && overallMarkDescription && activeReviewCount && activeReviewCount > 0/* && !$aNode.hasClass('reviewInfosInsertedByTsExtension') */ && !aNode.classList.contains('reviewInfosInsertedByTsExtension')) {
        var img_stars_url = config.PATH.IMAGES + 'ico_stars.png';

        var reviewBarTag = document.createElement('div');
        reviewBarTag.className = 'tsRichSnippet';

        var tsStarsContainer = document.createElement('div');
        tsStarsContainer.className = 'tsStarsContainer';

        var tsStarsBackground = document.createElement('div');
        tsStarsBackground.className = 'tsStarsBackground';
        tsStarsBackground.style.background = 'url(' + img_stars_url + ') no-repeat 0 -12px';

        var tsStarsImage = document.createElement('div');
        tsStarsImage.className = 'tsStarsImage';
        tsStarsImage.style.background = 'url(' + img_stars_url + ') no-repeat 0 0';
        tsStarsImage.style.width = starsImageWidth;

        tsStarsBackground.appendChild(tsStarsImage);
        tsStarsContainer.appendChild(tsStarsBackground);
        reviewBarTag.appendChild(tsStarsContainer);

        var tsOverallMark = document.createElement('div');
        tsOverallMark.className = 'tsOverallMark';

        var tsOverallMarkB = document.createElement('b');
        tsOverallMarkB.textContent = overallMark.toFixed(2);
        tsOverallMark.appendChild(tsOverallMarkB);

        var tsOverallMarkSpan = document.createElement('span');
        tsOverallMarkSpan.style.fontSize = '12px';
        tsOverallMarkSpan.textContent = '/5.00';
        tsOverallMark.appendChild(tsOverallMarkSpan);

        reviewBarTag.appendChild(tsOverallMark);

        var tsReviewsLink = document.createElement('div');
        tsReviewsLink.className = 'tsReviewsLink';

        var tsReviewsLinkA = document.createElement('a');
        tsReviewsLinkA.setAttribute('href', tsShopRatingHref);
        tsReviewsLinkA.setAttribute('target', '_blank');
        tsReviewsLinkA.textContent = activeReviewCount + ' ' + chrome.i18n.getMessage('customerreviews');
        tsReviewsLink.appendChild(tsReviewsLinkA);

        reviewBarTag.appendChild(tsReviewsLink);

        aNode.classList.add('reviewInfosInsertedByTsExtension');
        // divRc.style.display = 'inline-block';
        divRc.appendChild(reviewBarTag);
    }
};

handlePage();
