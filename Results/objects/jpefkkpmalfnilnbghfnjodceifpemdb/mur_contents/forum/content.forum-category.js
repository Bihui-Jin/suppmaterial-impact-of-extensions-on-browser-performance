// ==UserScript==
// @name     ErExt_forum_category
// @include forum.ereality.ru
// @include forum.ereality.ru/category*
// @exclude forum.ereality.ru/forum*
// @exclude forum.ereality.ru/topic*
//
// @require tools/jquery.js
// @require tools.js
//
// @require common/forum/ignore/ignore-tools.js
// @require common/forum/ignore/category-author-name-ignore.js
//
// @all-frames  true
// ==/UserScript==

$(document).ready(function() {
    function controller(extOptions) {
        if (!extOptions.options.unpaused) {
            return;
        }

        if (extOptions.options.forum_ignore) {
            new categoryAuthorNameIgnoreClass(
                new IgnoreToolsClass(extOptions.forumIgnore).init(),
                extOptions.systemOptions.forum_ignore_user_replace
            ).init();
        }
    }

    var loadOptions = [
        {systemName: 'options', defaultName: "myoptions"},
        {systemName: 'forumIgnore', defaultName: "forumIgnore"},
        {systemName: 'systemOptions', defaultName: "systemOptions"}
    ];

    tools.loadOptions(loadOptions, controller);
});
