RULERS.styling.push(()=>{const{css:a}=RULERS.helpers,{rulerWidth:b}=RULERS.settings;return a`
    body {
      width: calc(100% - ${b}px);
      overflow-x: hidden;
    }

    body > * {
      transform: translate(${b}px, ${b}px) !important;
    }

    /* Remove styling for all ids that start with RULERS_ */
    [id^=RULERS_],
    [id^=RULERS_] h1,
    [id^=RULERS_] p,
    [id^=RULERS_] div {
      all: unset;
    }

    #RULERS_container {
      display: block;
      position: fixed;
      top: -${b}px;
      left: -${b}px;
      height: 100vh;
      width: 100%;
      z-index: 2147483647;
      user-select: none;
      -webkit-font-smoothing: antialiased;
      font-family: "Varela Round", sans-serif;
    }

    .RULERS__no-scroll {
      overflow: hidden!important;
    }
  `});