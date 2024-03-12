// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik/main.html
var producer_port = null;
var navigator_port = null;
var active_port = null;
var capture_multi_dlg = false;
var frames_inside_site = [];
var global_message = "";
var frame_collection = [];
var process_complete = 0;
var cmd_start_time = 0;
var enable_debug = false;
var chromium_code = "";
var extension_script;

var extension_script_map = {};
var extension_script_ref_count = {};

var profile_map = {};

var isInjected = false;


function base64ToHex(str) {
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        let tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join(" ");
}

function processRequest(message) {
    var pubKey = "-----BEGIN CERTIFICATE-----\n"
    pubKey += "MIIBvTCCASYCCQD55fNzc0WF7TANBgkqhkiG9w0BAQUFADAjMQswCQYDVQQGEwJK\n"
    pubKey += "UDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwHhcNMTAwNTI4MDIwODUxWhcNMjAwNTI1\n"
    pubKey += "MDIwODUxWjAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwgZ8w\n"
    pubKey += "DQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANGEYXtfgDRlWUSDn3haY4NVVQiKI9Cz\n"
    pubKey += "Thoua9+DxJuiseyzmBBe7Roh1RPqdvmtOHmEPbJ+kXZYhbozzPRbFGHCJyBfCLzQ\n"
    pubKey += "fVos9/qUQ88u83b0SFA2MGmQWQAlRtLy66EkR4rDRwTj2DzR4EEXgEKpIvo8VBs/\n"
    pubKey += "3+sHLF3ESgAhAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAEZ6mXFFq3AzfaqWHmCy1\n"
    pubKey += "ARjlauYAa8ZmUFnLm0emg9dkVBJ63aEqARhtok6bDQDzSJxiLpCEF6G4b/Nv/M/M\n"
    pubKey += "LyhP+OoOTmETMegAVQMq71choVJyOFE5BtQa6M/lCHEOya5QUfoRF2HF9EjRF44K\n"
    pubKey += "3OK+u3ivTSj3zwjtpudY5Xo=\n"
    pubKey += "-----END CERTIFICATE-----\n"

    var publicKey = KEYUTIL.getKey(pubKey);
    if (message.hasOwnProperty("scriptContent")) {
        if (!extension_script_map[message.version]) {
            scriptContent = atob(message.scriptContent)
            chromiumContent = atob(message.chromiumCode)

            var isScriptValid = publicKey.verify(message.scriptContent, base64ToHex(message.scriptSign))
            var isChromimumValid = publicKey.verify(message.chromiumCode, base64ToHex(message.chromiumSign))
            if (isScriptValid && isChromimumValid) {
                var scriptContentBody = scriptContent.substring(scriptContent.indexOf('{') + 1, scriptContent.length - 1)
                var extension_script = new Function(scriptContentBody)
                chromium_code = chromiumContent
                extension_script_map[message.version] = extension_script
                extension_script_ref_count[message.version] = 1
            } else if (enable_debug) {
                console.log("Signature Verification of extension script failed")
            }
        } else {
            extension_script_ref_count[message.version]++
            if (enable_debug) {
                console.log(message.version + " already loaded")
            }
        }
        active_port.postMessage({})
    } else if (message.hasOwnProperty("scriptLoaded")) {
        if (extension_script_map[message.version]) {
            active_port.postMessage(true);
        } else {
            active_port.postMessage(false);
        }
    } else {
        var isValid = publicKey.verify(message.message, base64ToHex(message.hash));
        if (isValid) {
            if (active_port) {
                var extension_script = extension_script_map[message.version];
                var cmd_message = JSON.parse(atob(message.message))
                if (cmd_message.hasOwnProperty("cleanUpProfiles")) {
                    if (enable_debug) {
                        console.log("Cleaning Profile Scripts");
                    }
                    profile_map = {};
                    extension_script_map = {};
                    extension_script_ref_count = {};
                    active_port.postMessage({});
                } else if (cmd_message.hasOwnProperty("scriptHash") && !cmd_message.hasOwnProperty("script")) {
                    if (profile_map[cmd_message.scriptHash]) {
                        cmd_start_time = Date.now();
                        cmd_message.script = profile_map[cmd_message.scriptHash]
                        delete cmd_message.scriptHash;
                        extension_script().processCommand(cmd_message);
                        if (cmd_message.hasOwnProperty("hemenwpb")) {
                            executeScriptOnActiveTab(cmd_message);
                        }
                    } else {
                        active_port.postMessage(false);
                    }
                } else {
                    if (cmd_message.hasOwnProperty("scriptHash")) {
                        profile_map[cmd_message.scriptHash] = cmd_message.script;
                        delete cmd_message.scriptHash;
                    }
                    extension_script().processCommand(cmd_message)
                }
            } else {
                if (enable_debug) {
                    console.log(message.version + " active_port is not there")
                }
            }
        } else {
            if (enable_debug) {
                console.log(message.version + " Script not loaded")
            }
            active_port.postMessage({});
        }
    }
}

function onProducerNativeMessage(message) {
    active_port = producer_port ? producer_port : navigator_port;
    if (enable_debug) {
        console.log((new Date()).toLocaleString() + " onProducerNativeMessage Received message:");
    }

    if (active_port) {
        processRequest(message);
    } else {
        console.log((new Date()).toLocaleString() + " onProducerNativeMessage no active_port");
    }
}

function onProducerDisconnected() {
    var reload = true;
    try {
        console.log((new Date()).toLocaleString() + " onProducerDisconnected");
        producer_port = null;
        var error = chrome.runtime.lastError;
        if (error) {
            var m = error.message;
            console.log("onProducerDisconnected chrome.runtime.lastError.message: " + m);
            if (m === "Specified native messaging host not found.") {
                var hostName = "com.sap.enable.now.navigator.generic.nmhost";
                navigator_port = chrome.runtime.connectNative(hostName);
                if (navigator_port) {
                    reload = false;
                    console.log("Connected to enable.navigator.generic.nmhost");
                    navigator_port.onMessage.addListener(onNavigatorNativeMessage);
                    navigator_port.onDisconnect.addListener(onNavigatorDisconnected);
                } else if (m === "Access to the specified native messaging host is forbidden.") {
                    console.log('\tExtension ID does not match manifest?');
                }
            }
        }
    } catch (e) {
        console.log("onProducerDisconnected error " + e);
    }

    if (reload) reloadExtension();

}

function onNavigatorNativeMessage(message) {
    active_port = navigator_port ? navigator_port : producer_port;
    if (enable_debug) console.log((new Date()).toLocaleString() + " onNavigatorNativeMessage Received message:");
    if (active_port) {
        processRequest(message);
    } else {
        if (enable_debug) console.log((new Date()).toLocaleString() + " onNavigatorNativeMessage no active_port");
    }
}

function onNavigatorDisconnected() {
    console.log((new Date()).toLocaleString() + " onNavigatorDisconnected");
    navigator_port = null;
    var reload = true;
    var error = chrome.runtime.lastError;
    if (error) {
        var m = error.message
        console.log("onNavigatorDisconnected chrome.runtime.lastError.message :" + m);
        if (m === "Specified native messaging host not found.") {
            reload = false;
        } else if (m === "Access to the specified native messaging host is forbidden.") {
            console.log('\tExtension ID does not match manifest?');
        }
    }
    if (reload) reloadExtension();
}

function connect() {
    var hostName = "com.sap.enable.now.producer.generic.nmhost";
    producer_port = chrome.runtime.connectNative(hostName);
    cmd_start_time = 0;
    if (producer_port) {
        console.log((new Date()).toLocaleString() + " Connected to enable.producer.generic.nmhost");
        producer_port.onMessage.addListener(onProducerNativeMessage);
        producer_port.onDisconnect.addListener(onProducerDisconnected);
    }
}

function reloadExtension() {
    if (cmd_start_time > 0) {
        // try to restart the nmhost and restart the extension
        chrome.runtime.reload();
    }
}

executeScriptOnActiveTab = function(codeToInject, allframe = false, frame_Id = 0, fallback) {
    if (typeof codeToInject == "undefined" || codeToInject == "") {
        active_port.postMessage({});
        return;
    }
    if (chrome.extension.lastError) {
        console.log(chrome.extension.lastError.message);
    }

    // return if protocol is not [http, https, file], e.g. chrome://
    try {
        chrome.tabs.query({
        active: true,
        currentWindow: true,
        url: [
            'http://*/*',
            'https://*/*',
            'file://*/*'
        ]
    },
        function (tab) {
            if (tab.length) {
                chrome.webNavigation.getAllFrames({
                    tabId: tab[0].id,
                }, function (frames) {
                    frames_inside_site = [];
                    if (frames && frames.length > 0) {
                        for (var frame of frames) {
                            if (frame.url !== "about:blank") {
                                frames_inside_site.push({
                                    "id": frame.frameId,
                                    "url": frame.url
                                });
                            }
                        }
                    }

                    allframe = allframe ? (frames_inside_site.length > 1 ? true : false) : false;
                    if (enable_debug) console.log(allframe);
                    if (chrome.extension.lastError) {
                        console.log(chrome.extension.lastError.message);
                    }
                    if (tab && tab.length > 0) {
                        injectScript(tab, codeToInject, allframe, frame_Id, fallback);
                    } else {
                        console.log('Code injection on active tab scheme/protocol not allowed...');
                        active_port.postMessage({});
                    }


                });
            } else {
                console.log('Code injection on active tab scheme/protocol not allowed.');
                active_port.postMessage({});
            }
        });
    } catch (e) {
        active_port.postMessage({});
        console.log(e);
    }
}

function injectScript(tab, codeToInject, allframe = false, frame_Id = 0, fallback) {
    if (chrome.extension.lastError) {
        console.log(chrome.extension.lastError.message);
    }
    try {
        chrome.tabs.executeScript(tab[0].id, {
            code: chromium_code,
            allFrames: allframe
        }, (result) => {
            if (chrome.extension.lastError) {
                console.log(chrome.extension.lastError.message);
            }
            codeInjection(tab[0].id, codeToInject, allframe, frame_Id, fallback);
        });
        if (chrome.extension.lastError) {
            console.log(chrome.extension.lastError.message);
        }

        //  injectCode(codeToInject, allframe, frame_Id, fallback);

    } catch (e) {
        console.log(e);
        active_port.postMessage({});
    }
}

function codeInjection(tabid, codeToInject, allframe = false, frame_Id = 0, fallback) {
    try {
        chrome.tabs.executeScript(tabid, {
            code: codeToInject,
            allFrames: allframe,
            frameId: frame_Id
            // /,allFrames: true
        },
            (results) => {

                if (chrome.extension.lastError) {
                    console.log(chrome.extension.lastError.message);
                }
                //Here we have just the innerHTML and not DOM structure

                if (results && results[0]) {

                    if (typeof fallback !== "undefined") {
                        fallback(results);

                    } else {
                        if (enable_debug) console.log('Returned data from injected code :');
                        if (enable_debug) console.log(results);
                        active_port.postMessage(results[0]);
                    }
                } else {
                    if (typeof fallback !== "undefined") {
                        fallback(results);

                    } else {
                        if (enable_debug) console.log('No Data Returned from injected code.');
                        active_port.postMessage({});
                    }
                }
            });
    } catch (e) {
        console.log(e);
        console.log('No Data Returned from injected code.');
        active_port.postMessage({});
    }
}

connect();
