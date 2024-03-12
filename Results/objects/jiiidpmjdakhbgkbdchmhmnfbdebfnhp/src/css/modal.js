RULERS.styling.push(()=>{const{css:a}=RULERS.helpers,{color:b}=RULERS.themes,{rulerWidth:c}=RULERS.settings;return a`
    #RULERS_modal {
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      background-size: cover;
      border-radius: 5px;
      border: none;
      box-shadow: 0 0 0 1px ${b("black",.15)} inset;
      color: ${b("white")};
      font-family: "Lato", sans-serif;
      font-weight: 300;
      left: 50%;
      margin-left: ${c/2}px;
      opacity: 0;
      padding: 40px 40px 14px;
      pointer-events: none;
      position: absolute;
      text-align: left;
      font-weight: normal;
      font-size: 14px;
      top: 50%;
      transform: translate(-50%, -45%);
      transition: transform 0.3s, opacity 0.3s;
      z-index: 3;
      width: 360px;
      background: ${b("purple")};
    }

    #RULERS_modal *:not(table, thead, tbody, th, td, tr) {
      all: unset;
      font-family: "Lato", sans-serif;
      color: ${b("white")};
      font-size: inherit;
    }

    /* ADD A TRANSPARENT BORDER */
    #RULERS_modal::after {
      content: "";
      display: block;
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      box-shadow: 0 0 0 1px #000856;
      opacity: 0.1;
    }

    #RULERS_modal * {
      box-sizing: border-box;
    }

    #RULERS_modal input[type="number"]::-webkit-inner-spin-button,
    #RULERS_modal input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    #RULERS_modal input:disabled {
      opacity: 0.5;
    }

    #RULERS_modal.active {
      pointer-events: all;
      opacity: 1;
      transform: translate(-50%, -50%);
    }

    /* EMOJI STYLING */
    #RULERS_modal::before {
      content: "";
      display: none;
      color: ${b("white")};
      letter-spacing: 0;
      text-align: center;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      position: absolute;
      height: 75px;
      width: 100%;
      top: -44px;
      left: 0;
      z-index: 1;
    }

    #RULERS_modal .RULERS__hidden {
      display: none !important;
    }

    #RULERS_modal.emoji {
      padding-top: 54px;
    }

    #RULERS_modal.emoji::before {
      display: block;
    }

    #RULERS_modal.emoji.emoji-tada::before {
      background-image: url("${chrome.runtime.getURL("img/emoji/tada.png")}");
    }

    #RULERS_modal.emoji.emoji-stars::before {
      background-image: url("${chrome.runtime.getURL("img/emoji/stars.png")}");
    }

    #RULERS_modal.emoji.emoji-mindblown::before {
      background-image: url("${chrome.runtime.getURL("img/emoji/mindblown.png")}");
    }

    #RULERS_modal.emoji.emoji-lookingglass::before {
      background-image: url("${chrome.runtime.getURL("img/emoji/lookingglass.png")}");
    }

    #RULERS_modal.emoji.emoji-warning::before {
      background-image: url("${chrome.runtime.getURL("img/emoji/warning.png")}");
    }

    #RULERS_modal.emoji.emoji-danger::before {
      background-image: url("${chrome.runtime.getURL("img/emoji/danger.png")}");
    }

    #RULERS_modal.emoji.emoji-love::before {
      background-image: url("${chrome.runtime.getURL("img/emoji/love.png")}");
    }

    #RULERS_modal h1 {
      color: #ffffff;
      font-weight: 600;
      display: inline-block;
      font-size: 16px;
      letter-spacing: 0;
      line-height: 140%;
    }

    #RULERS_modal p {
      color: #ffffff;
      display: inline-block;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 140%;
      margin-top: 15px;
      text-align: left;
      font-weight: 400;
      max-width: 380px;
    }

    #RULERS_modal p strong {
      font-weight: 800;
    }

    #RULERS_modal .columns {
      display: flex;
      flex-direction: row;
    }

    #RULERS_modal .columns > div {
      flex-basis: 0;
      flex: 1;
      margin-right: 40px;
    }

    #RULERS_modal .columns > div:last-child {
      margin: 0;
    }

    #RULERS_modal .RULERS_button-container {
      display: flex;
      width: 100%;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: 20px;
    }

    #RULERS_modal .RULERS_button-container > * {
      box-shadow: none;
      line-height: 1;
    }

    #RULERS_modal .RULERS_button-container button:first-of-type {
      border: none;
      background: none;
      padding: 0;
      font-family: "Varela Round", sans-serif;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
      outline: none;
      transition: opacity 0.2s;
      opacity: 0.5;
      max-width: 100px;
      vertical-align: middle;
      text-align: left;
      height: 36px;
      line-height: 140%;
    }

    #RULERS_modal .RULERS_button-container button:first-of-type:hover {
      opacity: 1;
    }

    #RULERS_modal .RULERS_button-container button:last-of-type {
      border-radius: 50px 0 0 50px;
      border: none;
      box-shadow: -1px 0 0 0px rgba(0, 0, 0, 0.1) inset;
      font-family: "Varela Round", sans-serif;
      font-size: 12px;
      left: 40px;
      outline: none;
      white-space: nowrap;
      box-sizing: content-box;
      padding: 0 20px;
      height: 36px;
      position: relative;
      transition: padding 0.2s;
      background: ${b("white")};
      color: ${b("purple")};
    }

    #RULERS_modal .RULERS_button-container button:last-of-type[disabled] {
      pointer-events: none;
      opacity: 0.2;
    }

    #RULERS_modal .RULERS_button-container button:last-of-type:only-child {
      margin-left: auto;
      opacity: 1;
    }

    #RULERS_modal .RULERS_button-container button:last-of-type:hover {
      padding: 0 24px;
    }

    #RULERS_modal
      .RULERS_button-container
      button:last-of-type
      .RULERS_button_icon {
      margin: 0px 0px -5px 10px;
    }
  `});