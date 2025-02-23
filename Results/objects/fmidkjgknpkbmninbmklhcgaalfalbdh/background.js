// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Get token from https://newsela-ir-hook.azurewebsites.net/api/what?code=CGT9rel2GF9IGjEvVN8u4Bg0L8BaXJhaaWaCebnmloaPTQzXaSDCsA==

chrome.contextMenus.create({
  id: "main read menu item",
  title: "Help me read this",
  contexts: ["selection"],
});

const loadedMap = {};
function ensureSDKLoadedForTab(tabId) {
  return new Promise((resolve, reject) => {
    if (loadedMap[tabId]) {
      resolve();
    } else {
      try {
        chrome.tabs.executeScript(
          { file: "./immersive-reader-sdk.1.1.0.js" },
          (success) => {
            if (success) {
              loadedMap[tabId] = true;
              resolve();
            } else {
              reject();
            }
          },
        );
      } catch (e) {
        reject();
      }
    }
  });
}

function readText(text) {
  const characterLimit = 10000;
  if (text.length > characterLimit) {
    return readText(
      `Sorry, there is a per use character limit of ${characterLimit}, please select a shorter section of text!`,
    );
  }
  fetch(
    "https://newsela-ir-hook.azurewebsites.net/api/what?code=CGT9rel2GF9IGjEvVN8u4Bg0L8BaXJhaaWaCebnmloaPTQzXaSDCsA==",
  )
    .then((response) => response.json())
    .then((json) => json.access_token)
    .then((access_token) => {
      const data = {
        chunks: [
          {
            mimeType: "text/html",
            content: text,
          },
        ],
      };

      const script = `
          var aadToken = "${access_token}";
          var subdomain = "NewselaImmersiveReader"; // Your subdomain goes here

          ImmersiveReader.launchAsync(aadToken, subdomain, ${JSON.stringify(
            data,
          )});
      `;

      chrome.tabs.executeScript(
        { file: "./immersive-reader-sdk.1.1.0.js" },
        (success) => {
          chrome.tabs.executeScript({ code: script });
        },
      );
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  ensureSDKLoadedForTab(tab.id).then(() => readText(info.selectionText));
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
  ensureSDKLoadedForTab(tab.id).then(() => {
    readText(
      "To get started, just select some text on your website, right-click it, and choose 'Help me read this!'",
    );
  });
});
