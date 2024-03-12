RULERS.styling.push(()=>{const{css:a}=RULERS.helpers;return a`

    #RULERS_pointer {
      position: absolute;
      width: 180vw;
      height: 180vw;
      opacity: 0;
      top: -90vw;
      left: -90vw;
      background-image: url("${chrome.runtime.getURL('img/pointer_background.svg')}");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      transition: transform 0.6s, opacity 0.3s;
      z-index: 3;
    }

    #RULERS_pointer.visible {
      opacity: 1;
    }

  `});