// ==UserScript==
// @name     ErExt_forum_all
// @include forum.ereality.ru*
// @require tools/jquery.js
// @require tools.js
// @require css/popup-css.js
// @require tools/popup.js
//
// @require common/forum/ignore/ignore-list.js
// @require common/forum/ignore/ignore-list-viewer.js
// @require common/forum/ignore/ignore-ui-builder.js
//
// @require css/forum/ignore-list-viewer-css.js
// @require css/forum/ignore-ui-builder-css.js
//
// @all-frames  true
// ==/UserScript==

$(document).ready(function () {
    function controller(extOptions) {
        if (!extOptions.options.unpaused) {
            return;
        }

        if (extOptions.options.forum_ignore) {
            var ignoreList = new IgnoreListClass();
            ignoreList.init(extOptions.forumIgnore);

            var ignoreListViewer = new IgnoreListViewerClass(ignoreList, popup, ignoreListViewerCss, 'NickName', extOptions.systemOptions);
            ignoreListViewer.init();

            var ignoreUiBuilder = new IgnoreUiBuilderClass(ignoreListViewer, ignoreUiBuilderCss, 'erExtForumIgnoreList');
            ignoreUiBuilder.init();
        }
    }

    var loadOptions = [
        {systemName: 'options', defaultName: "myoptions"},
        {systemName: 'forumIgnore', defaultName: "forumIgnore"},
        {systemName: 'systemOptions', defaultName: "systemOptions"}
    ];

    new toolsClass().loadOptions(loadOptions, controller);
});