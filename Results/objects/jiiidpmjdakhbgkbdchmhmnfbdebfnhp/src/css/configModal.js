RULERS.styling.push(()=>{const{css:a}=RULERS.helpers,{color:b}=RULERS.themes;return a`
    /* GENERAL STYLING */
    #RULERS_modal.config {
      display: flex;
      flex-direction: row;
      padding: 0;
      width: 680px;
    }

    #RULERS_modal.config h1 {
      font-family: "Lato", sans-serif;
      font-weight: 300;
      font-size: 24px;
      color: ${b("white")};
      padding-bottom: 5px;
    }

    #RULERS_modal.config h1 strong {
      font-weight: 700;
    }

    #RULERS_modal.config p {
      font-size: 13px;
      margin-bottom: 10px;
    }

    /* SECTIONS */
    #RULERS_modal.config > section.RULERS__config-modal__settings {
      padding: 40px 30px 0 40px;
      height: 420px;
      border-right: 4px solid ${b("purple_extra_dark",.15)};
    }

    #RULERS_modal.config > section.RULERS__config-modal__shortcuts {
      padding: 40px 40px 15px 30px;
      flex-basis: 0;
      flex: 1;
      display: flex;
      min-height: 200px;
      flex-direction: column;
      justify-content: space-between;
    }

    #RULERS_modal.config .RULERS__config-modal__columns {
      display: flex;
      flex-direction: row;
      position: relative;
    }

    #RULERS_modal.config .RULERS_button-container {
      width: 100%;
    }

    #RULERS_modal.config .RULERS__config-modal__columns > section {
      flex-basis: 0;
      flex: 1;
      width: 50%;
      margin: 0;
    }

    #RULERS_modal.config .RULERS__config-modal__columns > section:last-of-type {
      padding-left: 20px;
    }

    #RULERS_modal.config .RULERS__config-modal__shortcut-container {
      width: 100%;
      position: relative;
      min-height: 32px;
      padding: 8px 12px 8px 8px;
      background: rgba(42, 20, 122, 0.32);
      border-radius: 3px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    #RULERS_modal.config
      .RULERS__config-modal__shortcut-container.RULERS__shortcut--hidden {
      opacity: 0;
    }

    #RULERS_modal.config
      .RULERS__config-modal__shortcut-container.RULERS__plus-only {
      margin-top: 5px;
      background: rgba(42, 20, 122, 0.16);
    }
    #RULERS_modal.config
      .RULERS__config-modal__shortcut-container.RULERS__plus-only
      > div {
      opacity: 0.5;
    }

    #RULERS_modal.config
      .RULERS__config-modal__shortcut-container.RULERS__plus-only::after {
      content: "Plus only";
      position: absolute;
      top: -5px;
      font-size: 10px;
      background: rgb(255, 197, 0);
      padding: 2px 4px;
      border-radius: 3px;
      z-index: 4;
    }

    #RULERS_modal.config .RULERS__config-modal__shortcut__key-container {
      width: 64px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-right: 10px;
    }

    #RULERS_modal.config .RULERS__config-modal__shortcut__key {
      padding: 3px 9px 4px;
      border-radius: 5px;
      font-family: "Varela Round", sans-serif;
      font-size: 12px;
      color: #623cea;
      background: #ffffff;
      margin-left: 4px;
    }

    #RULERS_modal.config .RULERS__config-modal__shortcut__description {
      flex: 1;
    }
  `});