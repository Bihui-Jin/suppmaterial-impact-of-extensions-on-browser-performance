RULERS.styling.push(()=>{const{css:a}=RULERS.helpers;return a`

    @keyframes fadeIn {
      1% { opacity: 0; }
      100% { opacity: 1; }
    }

    #RULERS_modal.feedback .RULERS__rating__stars {
      margin: 20px 0;
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: center;
      transition: transform 0.4s;
      transform: translateY(0);
      position: relative;
      z-index: 3;
    }

    #RULERS_modal.feedback .RULERS__rating__stars.selected {
      transform: translateY(-100px)
    }

    #RULERS_modal.feedback .RULERS__rating__stars__half {
      display: block;
      height: 48px;
      min-width: 31px;
      background-size: cover;
      background-position-x: -25px;
      background-repeat: no-repeat;
      background-image: url("${chrome.runtime.getURL('img/emoji/star.png')}");
      filter: drop-shadow(0 0 0 transparent);
      z-index: 2;
    }

    #RULERS_modal.feedback .RULERS__rating__stars.selected .RULERS__rating__stars__half {
      filter: drop-shadow(0 0 10px yellow);
      transition: filter 0.2s;
    }

    #RULERS_modal.feedback .RULERS__rating__stars__half:nth-child(odd) {
      background-position-x: 5px;
    }

    #RULERS_modal.feedback .RULERS__rating__stars__half.selected ~ .RULERS__rating__stars__half,
    #RULERS_modal.feedback .RULERS__rating__stars__half:hover ~ .RULERS__rating__stars__half {
      filter: saturate(0) brightness(0.2);
      z-index: 1;
    }

    /* VISIBLE WHEN USER RATES POSITIVE */
    #RULERS_modal.feedback .RULERS__rating__positive {
      display: none;
    }

    /* VISIBLE WHEN USER RATES NEGATIVE */
    #RULERS_modal.feedback .RULERS__rating__negative {
      display: none;
    }

    #RULERS_modal.feedback .RULERS__modal__header {
      display: block;
      overflow: hidden;
      max-height: 100px;
      transform: translateY(0px);
      transition: max-height 0.4s, transform 0.4s;
    }

    #RULERS_modal.feedback .RULERS__modal__header.hidden {
      transform: translateY(-10px);
      max-height: 0px;
    }

    #RULERS_modal.feedback .RULERS__rating__result {
      margin-top: -100px;
    }

    #RULERS_modal.feedback .RULERS__rating__result.active {
      display: block;
      opacity: 0;
      animation: fadeIn 0.4s ease-out 0.2s 1 forwards;
    }

    #RULERS_modal.feedback .RULERS__rating__result__input {
      background: #8260ff;
      border-radius: 5px;
      margin-top: 10px;
      width: 100%;
      padding: 10px;
      display: block;
      color: #ffffff;
      height: 100px;
    }

    #RULERS_modal.feedback .RULERS__rating__result__input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    #RULERS_modal.feedback .RULERS_button-container .hidden,
    #RULERS_modal.feedback .RULERS_button-container.hidden {
      display: none;
    }
 `});