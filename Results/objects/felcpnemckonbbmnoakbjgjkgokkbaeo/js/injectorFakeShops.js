var injectorFakeShops = {
    overlay: null,
    bsInfo: null,

    text: (function () {
        var tmpNode = document.createElement('div');

        function purify(str) {
            tmpNode.textContent = str;
            return tmpNode.textContent;
        }

        return {
            header: purify(chrome.i18n.getMessage('p_fakeShop_header')),
            line1: purify(chrome.i18n.getMessage('p_fakeShop_line1')),
            line2: purify(chrome.i18n.getMessage('p_fakeShop_line2')),
            buttonLink: purify(chrome.i18n.getMessage('p_invalidShop_button_link')),
            buttonText: purify(chrome.i18n.getMessage('p_fakeShop_button')),
            footer: purify(chrome.i18n.getMessage('p_fakeShop_footer')),
        };
    })(),

    getMarkup: function (text) {
        return (`
            <div class="ts-fs-modal-background"></div>
            <div class="ts-fs-modal-header">
                ${text.header}
                <div class="ts-fs-modal-ico"></div>
            </div>
        
            <div class="ts-fs-modal-main">
                <div class="ts-fs-modal-section">
                    ${text.line1}
                </div>
                <div class="ts-fs-modal-section">
                    <div>${text.line2}</div>
                </div>
            
                <div class="ts-fs-modal-footer">
                    <div class="ts-fs-modal-footer-left">
                        <a id="ts-fs-modal-allow" class="ts-fs-modal-link" href="#">${text.footer}</a>
                    </div>
                    <div class="ts-fs-modal-footer-right">
                        <a class="ts-fs-modal-button" href="${text.buttonLink}" target="_blank">${text.buttonText}</a>
                    </div>
                </div>
            </div>
        `);
    },

    handleAllowClick: function (e) {
        e.preventDefault();
        injectorFakeShops.hideModal();
        chrome.runtime.sendMessage({action: 'fakeShop-allow', bsInfo: injectorFakeShops.bsInfo})
    },

    renderModal: function (bsInfo, hidden) {
        var container = document.createElement('div');
        container.id = 'ts-fs-modal';

        var overlay = document.createElement('div');
        overlay.id = 'ts-fs-modal-overlay';
        this.overlay = overlay;

        // FOR FIREFOX MODERATOR
        // Please note that all content for this innerHTML is clean
        // text variables that come from locales messages.json are sanitized via textContent trick
        // and there is no user input
        container.innerHTML = this.getMarkup(this.text);

        if (hidden) {
            this.hideModal();
        }

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        var allowNode = document.getElementById('ts-fs-modal-allow');
        allowNode && allowNode.addEventListener('click', this.handleAllowClick);
    },

    showModal: function (bsInfo, hidden) {
        if (bsInfo) {
            this.bsInfo = bsInfo;
        }
        if (this.overlay && !hidden) {
            this.overlay.style.display = 'flex';
        } else {
            this.renderModal(bsInfo, hidden);
        }
    },

    hideModal: function () {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }
};

chrome.runtime.onMessage.addListener(function (msg) {
    switch (msg.action) {
        case 'bsInfo':
            injectorFakeShops.showModal(msg.bsInfo, msg.hidden);
            break;
    }
});
