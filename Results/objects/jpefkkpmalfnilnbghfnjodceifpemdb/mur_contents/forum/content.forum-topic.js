// ==UserScript==
// @name     ErExt_forum_topic
// @include forum.ereality.ru/topic*
// @require tools/jquery.js
// @require tools.js
//
// @require common/forum/ignore/ignore-tools.js
// @require common/forum/ignore/forum-post-replace.js
// @require common/forum/ignore/forum-post-ignore.js
//
// @all-frames  true
// ==/UserScript==

$(document).ready(function () {
    function controller(extOptions) {
        if (!extOptions.options.unpaused) {
            return;
        }

        if (extOptions.options.forum_ignore) {
            new forumPostIgnoreClass(
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


