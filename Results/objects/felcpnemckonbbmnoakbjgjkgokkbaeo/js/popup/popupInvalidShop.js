document.addEventListener('DOMContentLoaded', function () {
    var dateNode = document.getElementById('last-db-update');
    if (dateNode) {
        var date = localStorage.lastDbUpdate;
        if (date) {
            date = new Date(parseInt(date, 10));
            dateNode.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
    }

    document.getElementById('impressum').addEventListener('click', openHtmlLink);
    document.getElementById('invalidShopButton').addEventListener('click', openHtmlLink);
});
