RULERS.styling.push(()=>{const{css:a}=RULERS.helpers,{color:b}=RULERS.themes;return a`
    /* FIELDS */
    #RULERS_modal .RULERS__form__field-container {
      padding: 6px 0;
      display: block;
    }

    #RULERS_modal
      .RULERS__form__field-container.loading
      .RULERS__form__field-wrapper {
      opacity: 0.5;
      transition: opacity 0.2s;
    }

    /* Plus only fields */
    #RULERS_modal .RULERS__plus-only {
      pointer-events: none;
    }

    #RULERS_modal .RULERS__plus-only .RULERS__form__field-wrapper {
      position: relative;
    }

    #RULERS_modal .RULERS__plus-only .RULERS__form__field-wrapper::after {
      content: "Plus only";
      position: absolute;
      top: -5px;
      font-size: 10px;
      background: rgb(255, 197, 0);
      padding: 2px 4px;
      border-radius: 3px;
      z-index: 4;
    }

    #RULERS_modal .RULERS__plus-only .RULERS__form__field-input {
      background: rgba(42, 20, 122, 0.16);
    }

    #RULERS_modal .RULERS__plus-only .RULERS__form__field-input * {
      opacity: 0.5;
    }

    #RULERS_modal .RULERS__form__field-container label {
      display: block;
      color: ${b("white")};
      opacity: 0.65;
      font-family: "Varela Round", sans-serif;
      margin: 0 0 5px 0;
      font-size: 12px;
    }

    #RULERS_modal .RULERS__form__field-wrapper {
      display: flex;
      flex-direction: row;
    }

    #RULERS_modal .RULERS__form__field-container input,
    #RULERS_modal .RULERS__form__field-options,
    #RULERS_modal .RULERS__form__field-input {
      box-shadow: none;
      display: block;
      border-radius: 4px;
      background: ${b("purple_extra_dark",.3)};
      border: none;
      outline: none;
      max-width: 100%;
      flex-basis: 0;
      flex: 1;
      line-height: 14px;
      font-size: 12px;
      color: ${b("white")};
      font-family: "Varela Round", sans-serif;
      padding: 9px 12px;
      margin: 0;
      white-space: nowrap;
      transition: box-shadow 0.1s;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #RULERS_modal .RULERS__form__field-input--with-button {
      max-width: calc(100% - 37px);
    }

    #RULERS_modal .RULERS__form__field-container input:active,
    #RULERS_modal .RULERS__form__field-container input:focus,
    #RULERS_modal .RULERS__form__field-options:active,
    #RULERS_modal .RULERS__form__field-options:focus,
    #RULERS_modal .RULERS__form__field-options:focus-within,
    #RULERS_modal .RULERS__form__field-input:active,
    #RULERS_modal .RULERS__form__field-input--with-button:focus,
    #RULERS_modal .RULERS__form__field-input--with-button:focus-within,
    #RULERS_modal
      .RULERS__form__field-wrapper:focus-within
      .RULERS__form__field-input {
      box-shadow: 0 0 0 1px ${b("yellow")};
    }

    #RULERS_modal .RULERS__form__field-container input:disabled {
      pointer-events: none;
    }

    #RULERS_modal .RULERS__form__field-options {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
    }

    #RULERS_modal .RULERS__form__field-options button {
      border: none;
      background: none;
      color: ${b("white")};
      font-family: "Varela Round", sans-serif;
      outline: none;
      padding: 5px 5px;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid transparent;
    }

    #RULERS_modal .RULERS__form__field-options button:focus {
      border-color: ${b("yellow")};
    }

    #RULERS_modal .RULERS__form__field-options button.active {
      background: ${b("white")};
      color: ${b("purple")};
    }

    #RULERS_modal .RULERS__form__field-options button.active:focus {
      border-color: ${b("white")};
    }

    #RULERS_modal .RULERS__form__field-unit {
      width: 0;
      white-space: nowrap;
      text-align: right;
      margin: 0 -50px;
      position: relative;
      direction: rtl;
      right: 12px;
      top: 3px;
      padding: 6px 50px;
      font-family: "Varela Round", sans-serif;
      font-weight: 400;
      font-size: 12px;
      color: ${b("white",.65)};
      pointer-events: none;
      overflow: hidden;
    }

    #RULERS_modal .RULERS__form__field-button {
      border-radius: 4px;
      background: ${b("purple_extra_dark",.3)};
      border: none;
      outline: none;
      width: 32px;
      min-width: 32px;
      text-align: center;
      padding: 2px 0 0;
      color: ${b("white")};
      font-family: "Varela Round", sans-serif;
      margin-left: 5px;
    }

    #RULERS_modal .RULERS__form__field-image {
      display: inline-block;
      height: 22px;
      width: 22px;
      margin: -4px 5px -6px -7px;
      object-fit: cover;
      background: ${b("white")};
      border: 1px solid ${b("white")};
      border-radius: 4px;
    }

    #RULERS_modal .RULERS__form__field-image-check {
      display: block;
    }
  `});