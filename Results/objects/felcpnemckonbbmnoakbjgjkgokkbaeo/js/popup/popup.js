document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.getBackgroundPage(function (bgPage) {
        var nodes = {
            // isActiveCheckbox: document.getElementById('tsWidgetActive'),
            lastUpdateNode: document.getElementById('lastDbUpdate'),
            loader: document.getElementById('loader'),
            updDbButton: document.getElementById('updDb'),
            rateUsPart: document.getElementById('rateUsPart'),
            feedbackCloser: document.getElementById('feedbackCloser'),
            starsLine: document.getElementById('starsLine')
        };

        // function saveTsBarOptions() {
        //     bgPage.session.showShopsBadge = nodes.isActiveCheckbox.checked;
        //     config.storageArea.set({
        //         'extActive': nodes.isActiveCheckbox.checked
        //     });
        // }

        function loaderHandler(status) {
            if (status === 'show') {
                nodes.loader.style.display = 'inline';
                nodes.updDbButton.style.display = 'none';
            } else {
                nodes.loader.style.display = 'none';
                nodes.updDbButton.style.display = 'inline';
            }
        }

        function buildLastUpdateBlock() {
            var date = new Date(parseInt(bgPage.storage.lastDbUpdate, 10));
            if (bgPage.storage.lastDbUpdate) {
                nodes.lastUpdateNode.textContent = date.toLocaleDateString() +
                    ' ' + date.toLocaleTimeString();
                if (bgPage.tester.updWheel || (Date.now() - bgPage.storage.lastDbUpdate >= bgPage.INTERVALS.userDbUpdate)) {
                    nodes.updDbButton.style.display = 'inline';
                } else {
                    nodes.updDbButton.style.display = 'none';
                }
            } else {
                nodes.lastUpdateNode.textContent = chrome.i18n.getMessage('p_dbCheckNever');
                nodes.updDbButton.style.display = 'inline';
            }
        }

        document.getElementById('impressum').addEventListener('click', openHtmlLink);
        document.getElementById('reportFakeShop').addEventListener('click', openHtmlLink);

        // event handlers
        // nodes.isActiveCheckbox.addEventListener('change', saveTsBarOptions);

        nodes.updDbButton.addEventListener('click', function () {
            loaderHandler('show');
            bgPage.mainOperator.updateBases(function (answ) {
                loaderHandler('hide');
                if (answ !== -1) {
                    buildLastUpdateBlock();
                }
            });
        });

        nodes.feedbackCloser.addEventListener('click', function () {
            nodes.rateUsPart.style.display = 'none';
            // after clicking on this link never show review badge again
            bgPage.session.isReviewAgitationShown = true;
            config.storageArea.set({
                'isReviewAgitationShown': true
            });
        });

        // make stars yellow on mouse over
        nodes.starsLine.addEventListener('mouseover', function (e) {
            var num = e.target.id;

            if (num !== 'starsLine') {
                num = parseInt(num, 10);
                for (var i = 1; i <= 5; i++) {
                    document.getElementById(i.toString()).className = i <= num ? 'yellow' : 'grey';
                }
            }
        });

        // init actions
        // nodes.isActiveCheckbox.checked = bgPage.session.showShopsBadge;

        // found which page is in active tab
        chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            if (tab && tab.length) {
                var match = bgPage.matcher.getMatchForHref(bgPage.session.shopList, bgPage.session.urlList, tab[0].url, true);
                if (match) {
                    document.querySelector('main').className = 'ts';
                }
            }
        });

        // show review agitation if it is needed
        // see conditions there https://bitbucket.org/tsextensions/browserextensions/issues/32/encourage-users-to-give-a-review
        if (
            bgPage.tester.reviewBadge ||
            (chrome.i18n.getUILanguage().toLowerCase() === 'de' // language is DE
                && !bgPage.session.isReviewAgitationShown // have never shown before
                && bgPage.session.installationDateTime // Extension was installed more than 3 days ago
                && Date.now() - bgPage.session.installationDateTime >= bgPage.INTERVALS.showReviewAgitationAfter)
        ) {
            // show the review
            nodes.rateUsPart.querySelector('#reviewLink').setAttribute('href', config.reviewUrl);
            nodes.rateUsPart.querySelector('#feedbackButton a').setAttribute('href', config.reviewUrl);
            nodes.rateUsPart.style.display = 'block';
        }
        buildLastUpdateBlock();
    });
});
