const injections=[{file:"src/js/config.js"},{file:"src/js/cursor.js"},{file:"src/js/layers/design.js"},{file:"src/js/drawOverlay.js"},{file:"src/js/drawRulers.js"},{file:"src/js/feedback.js"},{file:"src/js/form.js"},{file:"src/js/layers/grid.js"},{file:"src/js/layers/guides.js"},{file:"src/js/helpers.js"},{file:"src/js/infoPanel.js"},{file:"src/js/init.js"},{file:"src/js/inject.js"},{file:"src/js/layout.js"},{file:"src/js/modal.js"},{file:"src/js/overlay.js"},{file:"src/js/onboarding.js"},{file:"src/js/plus.js"},{file:"src/js/rulers.js"},{file:"src/js/settings.js"},{file:"src/js/store.js"},{file:"src/js/themes.js"},{file:"src/js/variables.js"},{file:"src/js/welcome.js"},{file:"src/js/keyboard.js"},{file:"src/html/form/file-input.js"},{file:"src/html/form/options-input.js"},{file:"src/html/form/text-input.js"},{file:"src/html/form/toggle-input.js"},{file:"src/html/global.js"},{file:"src/html/infoPanel.js"},{file:"src/html/configModal.js"},{file:"src/html/feedbackModal.js"},{file:"src/html/layoutModal.js"},{file:"src/html/plusModal.js"},{file:"src/html/warningModal.js"},{file:"src/html/storageFullModal.js"},{file:"src/html/welcomeModal.js"},{file:"src/css/global.js"},{file:"src/css/fonts.js"},{file:"src/css/forms.js"},{file:"src/css/infoPanel.js"},{file:"src/css/pointer.js"},{file:"src/css/rulers.js"},{file:"src/css/modal.js"},{file:"src/css/configModal.js"},{file:"src/css/feedbackModal.js"},{file:"src/css/layoutModal.js"},{file:"src/css/storageFullModal.js"},{file:"src/css/plusModal.js"},{code:"RULERS.init.toggle();"}],toggleExtension=()=>{(a=>{let b=null;const c=(a,b)=>()=>chrome.tabs.executeScript(null,a,b);for(var d=a.length-1;0<=d;--d)b=c(a[d],b);"function"==typeof b&&b()})(injections)};chrome.browserAction.onClicked.addListener(toggleExtension),chrome.commands.onCommand.addListener(a=>{"enable"===a&&toggleExtension()});