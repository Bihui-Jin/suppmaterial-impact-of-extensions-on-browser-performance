function openHtmlLink(e) {
    e.preventDefault();
    chrome.tabs.create(
        {
            url: e.target.href,
        },
        function () {
            window.close();
        }
    );
}
