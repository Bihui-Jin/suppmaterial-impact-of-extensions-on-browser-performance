(function () {

    var w2gConnections = {};

    function Connection(w2gPort){
        "use strict";

        var m = {
            id : w2gPort.sender.id
        }, syncUrl, controlledWindow = null, controlledFrame = null, vidScore = -1, topFrame = null;

        w2gPort.onMessage.addListener(function(msg, sender){
            if(msg.openSite){
                if(msg.openSite.url.match(/^https:\/\/.*netflix.com/)){
                    msg.openSite.url = msg.openSite.url.replace(/[?&]{1}t=\d+/g, '');
                    var parts = msg.openSite.url.split("?");
                    msg.openSite.url = parts[0] + "?" + (parts[1] ? parts[1] + "&t=0" : "t=0");
                }
                if(controlledWindow === null) {
                    topFrame = null;
                    controlledFrame = null;
                    if(msg.openSite.auto) {
                        syncUrl = msg.openSite.url;
                        browser.windows.create({
                            left: 10,
                            top: 10,
                            width: 1024,
                            height: 680,
                            type:  (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || typeof window.opr !== "undefined") ? "normal" : "popup",
                            url: syncUrl
                        }).then(function (w) {
                            w2gPort.postMessage({"windowOpened": true});
                            controlledWindow = w;
                        });
                    }
                } else {
                    var tab = browser.tabs.get(controlledWindow.tabs[0].id).then(function(tab){
                       if(syncUrl !== msg.openSite.url) {
                           topFrame = null;
                           controlledFrame = null;
                           var cur = document.createElement("a"), next = document.createElement("a");
                           cur.href = syncUrl;
                           next.href = msg.openSite.url;
                           if (cur.hostname === next.hostname) {
                               syncUrl = msg.openSite.url;
                               browser.tabs.update(tab.id, {
                                   url: syncUrl
                               });
                           } else {
                               browser.windows.remove(controlledWindow.id);
                               w2gPort.postMessage({"windowClosed": true});
                               controlledWindow = null;
                           }
                       }
                       if(controlledWindow){
                           browser.windows.update(controlledWindow.id, {focused : true});
                       }
                    });
                }
            } else if(msg.closeSite){
                controlledFrame = null;
                if(controlledWindow){
                    browser.windows.remove(controlledWindow.id);
                    controlledWindow = null;
                }
            } else if(msg.fetchPRX){
                var options = msg.fetchPRX.options ||  {};
                options.credentials = 'omit';
                fetch(msg.fetchPRX.url, options).then(function(data){
                    if(data.ok){
                        data.text().then(function(data){
                            w2gPort.postMessage({type: 'ptrxres', key: msg.fetchPRX.key, data: data, error: false});
                        }).catch(function(){
                            w2gPort.postMessage({type: 'ptrxres', key: msg.fetchPRX.key, data: null, error: true});
                        });
                    } else {
                        w2gPort.postMessage({type: 'ptrxres', key: msg.fetchPRX.key, data: null, error: true});
                    }
                });
            } else if(msg.focusSite){
                if(controlledWindow){
                    browser.windows.update(controlledWindow.id, {focused : true});
                }
            } else if(msg.urlok) {
                if(topFrame){
                    topFrame.postMessage(msg);
                }
            } else if(controlledFrame){
                try {
                    controlledFrame.port.postMessage(msg);
                } catch(e){
                    console.log("Can not communicate with frame.");
                }
            }
        });

        m.injectCode = function(detail){
            "use strict";

            if(detail.url !== "about:blank") {
                if (controlledWindow) {
                    var tab = controlledWindow.tabs.find(function(t){
                        return t.id === detail.tabId;
                    });
                    if(tab){
                        insertCode(detail.frameId === 0);
                    }
                } else if (detail.tabId === w2gPort.sender.tab.id && detail.frameId !== 0) {
                    if (detail.url.indexOf("https://mediaplay.cc/oembed.html?url=") === 0) {
                        insertCode(true);
                    } else {
                        function checkFrame(id){
                            if(id > 0) {
                                browser.webNavigation.getFrame({
                                    tabId: detail.tabId,
                                    frameId: id
                                }).then(function (frame) {
                                    if(frame) {
                                        if (frame.url.indexOf("https://mediaplay.cc/oembed.html?url=") === 0) {
                                            insertCode(false);
                                        } else {
                                            checkFrame(frame.parentFrameId);
                                        }
                                    }
                                });
                            }
                        }
                        checkFrame(detail.parentFrameId)
                    }
                }
            }

            function insertCode(master) {
                browser.tabs.insertCSS(detail.tabId, {file: "/css/content_video.css", frameId : detail.frameId, runAt: "document_start"});
                browser.tabs.executeScript(detail.tabId, {file: "/javascript/browser-polyfill.min.js", frameId : detail.frameId, runAt: "document_start"}).then(function () {
                    browser.tabs.executeScript(detail.tabId, {file: "/javascript/content_video.js", frameId : detail.frameId, runAt: "document_start"}).then(function () {
                        if(detail.url.match(/^https:\/\/.*netflix.com/)){
                            browser.tabs.executeScript(detail.tabId, {file: "/javascript/plugins/nflx.js", frameId : detail.frameId, runAt: "document_start"}).then(function () {
                                init();
                            });
                        } else if(detail.url.match(/^https:\/\/.*amazon./)){
                            browser.tabs.executeScript(detail.tabId, {file: "/javascript/plugins/amzn.js", frameId : detail.frameId, runAt: "document_start"}).then(function () {
                                init();
                            });
                        } else {
                            init();
                        }
                        function init() {
                            var cPort = browser.tabs.connect(detail.tabId, {frameId : detail.frameId});
                            if(master){
                                w2gPort.postMessage({"reset": true});
                                topFrame = cPort;
                                vidScore = -1;
                            }
                            cPort.postMessage({syncUrl: syncUrl});
                            cPort.onMessage.addListener(function (msg) {
                                if (msg.newurl && detail.frameId === 0) {
                                    browser.tabs.get(detail.tabId).then(function(controlledTab){
                                        w2gPort.postMessage({
                                            "content_loaded": {
                                                url: msg.newurl.url,
                                                title: msg.newurl.title,
                                                thumb: controlledTab.favIconUrl && controlledTab.favIconUrl.startsWith("http") ? controlledTab.favIconUrl : "https://w2g.tv/static/providers/10.png"
                                            }
                                        });
                                    });
                                } else if(msg.checkurl && detail.frameId === 0) {
                                    w2gPort.postMessage(msg);
                                } else if (msg.videofound) {
                                    if(msg.videofound > vidScore){
                                        vidScore = msg.videofound;
                                        controlledFrame = {
                                            frameId: detail.frameId,
                                            port: cPort
                                        };
                                        if(topFrame){
                                            topFrame.postMessage(msg);
                                        }
                                    }
                                } else if(topFrame && controlledFrame && (controlledFrame.frameId === detail.frameId || (msg.ui_seek !== undefined || msg.ui_toggle !== undefined || msg.checkurl !== undefined))) {
                                    topFrame.postMessage({ui_update: msg})
                                    w2gPort.postMessage(msg);
                                }
                            });
                        }
                    });
                });
            }
        };

        m.windowRemoved = function(id){
           if(controlledWindow && controlledWindow.id === id){
               w2gPort.postMessage({"reset": true});
               w2gPort.postMessage({"windowClosed": true});
               controlledWindow = null;
               controlledFrame = null;
           }
        };

        m.shutdown = function(){
            if(controlledWindow){
                browser.windows.remove(controlledWindow.id);
                controlledWindow = null;
            }
        };

        return m;
    }

    browser.runtime.onInstalled.addListener(function(){
        var scripts = browser.runtime.getManifest().content_scripts[0];
        var windows = browser.windows.getAll(
            {
                populate: true
            }
        ).then(function(windows){
            windows.forEach(function(win){
                win.tabs.forEach(function(tab){
                    if(tab.url){
                        scripts.matches.forEach(function(match){
                            match = match.substring(0, match.length - 1);
                            if(tab.url.indexOf(match) === 0){
                                scripts.js.forEach(function(script){
                                    browser.tabs.executeScript(tab.id, {
                                        file: script
                                    });
                                });
                            }
                        });
                    }
                })
            });
        });
    });

    browser.runtime.onConnect.addListener(function (p){
        "use strict";
        switch(p.name){
            case "w2g_player":
                p.onDisconnect.addListener(function(p){
                    if(w2gConnections[p.sender.url]){
                        w2gConnections[p.sender.url].shutdown();
                        delete w2gConnections[p.sender.url];
                    }
                });
                w2gConnections[p.sender.url] = new Connection(p);
                break;
        }
    });

    browser.windows.onRemoved.addListener(function(id){
        "use strict";
        for(var prop in w2gConnections){
            if(w2gConnections.hasOwnProperty(prop)){
                w2gConnections[prop].windowRemoved(id);
            }
        }
    });

    browser.webNavigation.onDOMContentLoaded.addListener(function(detail){
        "use strict";
        for(var prop in w2gConnections){
            if(w2gConnections.hasOwnProperty(prop)){
                w2gConnections[prop].injectCode(detail);
            }
        }
    });

}());