/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  // console.log("window.addEventListener: " + JSON.stringify(event.data));
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
      chrome.runtime.sendMessage(event.data);
  }
}, false);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.cmd == "PK") {
            pkeys = {};
        //  console.log((new Date()).toLocaleString() + " got command PK");
            var scriptContent = "var pk_attr = \"\";window.postMessage({ type: \"FROM_PAGE\", cmd: \"pk\", text: \"start\" }, \"*\");";
            for(var pkcmd in request) {
               if (pkcmd == "cmd") {
                   //skip
               } else if (pkcmd == "script") {
                   if (window.self === window.top) {
                   scriptContent += "window.postMessage({ type: \"FROM_PAGE\", cmd: \"pk\", text: \"top\" }, \"*\");"
                     //  console.log("in main window");
                   }
                   // console.log(scriptContent);
                   scriptContent += request[pkcmd];
                   if (window.self === window.top) {
                       // console.log(scriptContent);
                   }
                    //just append
               } else {
                   scriptContent += "pk_attr = " + request[pkcmd];
                   scriptContent += ";if (pk_attr) {document.body.setAttribute(\"" + pkcmd + "\", pk_attr, 0);"
                   scriptContent += "window.postMessage({ type: \"FROM_PAGE\", cmd: \"" + pkcmd + "\", text: pk_attr }, \"*\");}"
               }
            }
            scriptContent += "window.postMessage({ type: \"FROM_PAGE\", cmd: \"pk\", text: \"end\" }, \"*\");"
           //  console.log(scriptContent);
             if (!document.xmlVersion) {
                var script = document.createElement('script');
                script.appendChild(document.createTextNode(scriptContent));
                document.documentElement.appendChild(script);
            }
          //  console.log((new Date()).toLocaleString() + " script executed");
    }
 });