RULERS.styling.push(()=>{const{css:a}=RULERS.helpers;return a`

    #RULERS_modal.plus {
      background-image: url("${chrome.runtime.getURL('img/bubble_background.svg')}");
      background-size: cover;
      text-align: center;
      width: 460px;
      overflow: hidden;
    }

    #RULERS_modal.plus h1 {
      color: #FFFFFF;
      display: inline-block;
      font-weight: 100;
      font-size: 26px;
      letter-spacing: 0;
      line-height: 34px;
      text-align: center;
      width: 100%;
    }

    #RULERS_modal.plus p {
      font-size: 18px;
      margin-top: 0;
      letter-spacing: 0;
      font-weight: 100;
    }

    #RULERS_modal.plus h1 span,
    #RULERS_modal.plus p span {
      color: #FFC500;
      font-weight: 600;
    }

    #RULERS_modal.plus #RULERS_slideshow {
      display: block;
      height: 370px;
      margin: 20px auto 0;
      position: relative;
      white-space: nowrap;
      width: 336px;
    }

    #RULERS_modal.plus #RULERS_slideshow > div {
      display: flex;
      flex-direction: column;
      left: 0;
      opacity: 0;
      position: absolute;
      top: 0;
      transition: opacity 0.4s linear, transform 0.4s ease-in-out;
    }

    #RULERS_modal.plus #RULERS_slideshow > div p {
      text-align: center;
      width: 360px;
      white-space: pre-wrap;
      opacity: 0;
      transition: opacity 0.4s;
    }

    #RULERS_modal.plus #RULERS_slideshow > div .imageWrapper {
      background: #ffffff;
      border-radius: 5px;
      position: relative;
      margin: 10px 0;
      height: 285px;
      width: 336px;
      pointer-events: none;
    }

    #RULERS_modal.plus #RULERS_slideshow > div:nth-child(1) {
      transform: translate(-125%) scale(0.5) perspective(400px) rotateY(-20deg);
    }

    #RULERS_modal.plus #RULERS_slideshow > div:nth-child(2) {
      opacity: 0.5;
      transform: translate(-100%) scale(0.7) perspective(400px) rotateY(-10deg);
    }

    #RULERS_modal.plus #RULERS_slideshow > div:nth-child(3) {
      opacity: 1;
      transform: perspective(400px) rotateY(0deg)
    }

    #RULERS_modal.plus #RULERS_slideshow > div:nth-child(3) p {
      opacity: 1;
    }

    #RULERS_modal.plus #RULERS_slideshow > div:nth-child(4) {
      opacity: 0.5;
      transform: translate(100%) scale(0.7) perspective(400px) rotateY(10deg);
    }

    #RULERS_modal.plus #RULERS_slideshow > div:nth-child(5) {
      transform: translate(125%) scale(0.5) perspective(400px) rotateY(20deg);
    }

    #RULERS_modal.plus .RULERS_button-container button:last-of-type {
      left: 40px;
    }

    #RULERS_modal.plus #RULERS_slideshow > div img {
      height: 100%;
      max-width: none;
      pointer-events: none;
      position: relative;
    }

    #RULERS_modal.plus #RULERS_slideshow > div img.alignRight {
      left: -35px;
    }

    @media only screen and (max-height: 670px) {
      #RULERS_modal.plus {
        transform: scale(0.9) translate(-50%, -50%);
        transform-origin: top left;
      }
    }

    @media only screen and (max-height: 670px) {
      #RULERS_modal.plus {
        transform: scale(0.9) translate(-50%, -50%);
        transform-origin: top left;
      }
    }

  `});