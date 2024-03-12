function ExtensionCommunicator(browserProtocol) {
    this.IsResponseSent = false;
    this.PageCompleteCallBack = new function () { }

    this.BindListner = function () {
        chrome.runtime.onMessage.addListener(this._resetPageComplete);
    }

    this._resetPageComplete = function (request, sender, sendResponse) {
        if (!this.IsResponseSent) {
            this.PageCompleteCallBack;
        }
    }

}

try {
    module.exports = ExtensionCommunicator
} catch (e) { }
