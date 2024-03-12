RULERS.styling.push(()=>{const{css:a}=RULERS.helpers,{color:b}=RULERS.themes,{rulerWidth:c}=RULERS.settings,{border:d,background:e}=RULERS.themes.current;return a`

    #RULERS_overlay {
      display: block;
      position: absolute;
      bottom: 0;
      right: 0;
      height: calc(100vh - ${c}px);
      width: calc(100% - ${c}px);
      overflow: auto;
      z-index: 3;
      pointer-events: none;
    }

    #RULERS_RULERS_left-corner {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      background: ${e};
      width: ${c}px;
      height: ${c}px;
      box-shadow: -1px -1px 0 0 ${d} inset, -15px -15px 7px -15px rgba(0, 0, 0, 0.3) inset;
      margin: 0;
      padding: 0;
      z-index: 2;
    }

    #RULERS_RULERS_bottom-corner {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 0;
      left: 0;
      background: ${e};
      width: ${c}px;
      height: ${c}px;
      box-shadow: -1px 1px 0 0 ${d} inset, -15px 0px 7px -15px rgba(0, 0, 0, 0.3) inset;
      margin: 0;
      padding: 0;
      z-index: 2;
    }

    #RULERS_RULERS_left-corner.get-plus {
      background: ${b('purple')};
      box-shadow: inset -2px -2px 3px 0 ${b('black',.1)};
    }

    #RULERS_RULERS_right-corner {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      background: ${e};
      width: ${c}px;
      height: ${c}px;
      box-shadow: 1px -1px 0 0 ${d} inset, 15px -15px 7px -15px rgba(0, 0, 0, 0.3) inset;
      margin: 0;
      z-index: 2;
    }

    #RULERS_RULERS_right-corner.hidden {
      display: none;
    }

    #RULERS_RULERS_left-corner img,
    #RULERS_RULERS_right-corner img,
    #RULERS_RULERS_bottom-corner img {
      height: 80%;
    }

    #RULERS_RULERS_top {
      position: absolute;
      top: 0;
      left: ${c}px;
      background: ${e};
      width: calc(100% - ${2*c}px);
      height: ${c}px;
      margin: 0;
      z-index: 2;
      box-shadow: 0 -1px 0 0 ${d} inset, 0px -15px 7px -15px rgba(0, 0, 0, 0.3) inset;
    }

    #RULERS_RULERS_top.no-right-corner {
      width: calc(100% - ${c}px);
    }

    .removeGuide #RULERS_RULERS_top {
      cursor: pointer;
    }

    #RULERS_RULERS_left {
      position: absolute;
      top: ${c}px;
      left: 0;
      width: ${c}px;
      height: calc(100% - ${c}px);
      background: ${e};
      box-shadow: -1px 0 0 0 ${d} inset, -15px 0px 7px -15px rgba(0, 0, 0, 0.3) inset;
      margin: 0;
      z-index: 2;
    }

    #RULERS_container.removeGuide #RULERS_RULERS_left {
      cursor: pointer;
    }

    #RULERS_container.clickable #RULERS_RULERS_left,
    #RULERS_container.clickable #RULERS_RULERS_top,
    #RULERS_container.clickable #RULERS_RULERS_left-corner,
    #RULERS_container.clickable #RULERS_RULERS_right-corner,
    #RULERS_container.clickable #RULERS_overlay {
      pointer-events: all;
    }

  `});