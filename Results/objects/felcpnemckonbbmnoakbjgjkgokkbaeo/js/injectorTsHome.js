// hide ChromePlugin install paragraph (if existent) if found. Therefore show RateLaterContent (if existent).
var nodes = {
    later: document.getElementById('RateLaterContent'),
    plugin: document.getElementById(config.tsHome.pluginContentId)
};

if (nodes.later && nodes.later.style.display == 'none') {
    nodes.later.style.display = 'block';
}
if (nodes.plugin && nodes.plugin.style.display == 'block') {
    nodes.plugin.style.display = 'none';
}
