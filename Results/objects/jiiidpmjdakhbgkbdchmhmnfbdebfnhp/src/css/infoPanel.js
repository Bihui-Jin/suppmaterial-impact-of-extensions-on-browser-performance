RULERS.styling.push(()=>{const{css:a}=RULERS.helpers,{infoPanelWidth:b}=RULERS.themes,{border:c,infoPanelBackground:d,infoPanelColorText:e,infoPanelShadow:f,infoPanelTextColor:g,infoPanelTitleBackground:h,infoPanelTitleColor:i,infoPanelTitleBorder:j,infoPanelColorBorder:k,infoPanelColorBackground:l,infoPanelColorShadow:m}=RULERS.themes.current,{rulerWidth:n}=RULERS.settings;return a`

    body.RULERS_infoPanel {
      width: calc(100% - ${n+b}px);
    }

    #RULERS_infoPanel {
      background: ${d};
      font-size: 12px;
      height: 100vh;
      position: absolute;
      right: -300px;
      top: 0;
      transition: 0.2s;
      width: 300px;
      z-index: 4;
    }

    #RULERS_infoPanel svg.RULERS_infoPanelEmptyState {
      margin: 70px 20px 20px;
    }

    #RULERS_infoPanel svg.positioning {
      display: block;
    }

    #RULERS_infoPanel.enabled {
      right: 0;
    }

    #RULERS_infoPanel::after {
      box-shadow: 1px 0 0 0 ${c} inset, 15px 0px 7px -15px ${f} inset;
      content: "";
      height: 100%;
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      width: 15px;
    }

    #RULERS_infoPanel .RULERS_infoPanelContainer {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    #RULERS_infoPanel header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }

    #RULERS_infoPanel header h1 {
      font-family: "Varela Round", sans-serif;
      font-size: 14px;
      color: ${i};
      padding: 13px 20px 9px;
    }

    #RULERS_infoPanel header button {
      padding: 13px 13px 9px;
      outline: none;
      background: none;
      border: none;
    }

    #RULERS_infoPanel h2 {
      font-size: 14px;
      font-weight: bold;
      font-family: "Varela Round", sans-serif;
      background: ${h};
      color: ${i};
      margin: 0;
      padding: 10px 20px;
      border-top: 1px solid ${j};
      border-bottom: 1px solid ${j};
      white-space: nowrap;
    }

    #RULERS_infoPanel table {
      max-width: 100%;
      table-layout: fixed;
      margin: 10px 20px;
    }

    #RULERS_infoPanel table tr td {
      white-space: nowrap;
      font-family: "Varela Round", sans-serif;
      font-size: 12px;
      line-height: 14px;
      color: ${g};
      padding-bottom: 10px;
    }

    #RULERS_infoPanel table tr td.capitalize {
      text-transform: capitalize;
    }

    #RULERS_infoPanel table tr td:first-of-type {
      color: ${g};
      width: 120px;
      vertical-align: top;
    }

    #RULERS_infoPanel table tr td span.unit {
      font-size: 9px;
    }

    #RULERS_infoPanel .colorWrapper {
      display: inline-block;
      white-space: nowrap;
      background: ${l};
      border-radius: 100px;
      padding: 3px 9px 2px 2px;
      border: 1px solid ${k};
      font-weight: normal;
      color: ${e};
      font-size: 12px;
      transform: translateX(-2px);
    }

    #RULERS_infoPanel .colorWrapper .color {
      display: inline-block;
      vertical-align: middle;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABlBMVEXp6en///8aIX6LAAAAGElEQVR4AWNAB4xoYEQpGFUwGjCjCpABACRcAgFyjNYZAAAAAElFTkSuQmCC);
      background-size: 10px;
      height: 15px;
      margin-right: 5px;
      overflow: hidden;
      width: 15px;
      border-radius: 15px;
      margin-top: -3px;
      padding: 0;
    }

    #RULERS_infoPanel .colorWrapper .color span {
      display: block;
      height: 100%;
      width: 100%;
      box-shadow: 0 0 0 1px ${m} inset;
      border-radius: 15px;
    }

    #RULERS_infoPanel .colorWrapper .text {
      display: inline-block;
    }

    #RULERS_infoPanel.dark svg {
      filter: invert() brightness(1.6) contrast(0.7);
    }

    #RULERS_infoPanel.dark svg path.RULERS_questionmark {
      /* Inverted color of blue, so it will appear
        * correctly with the filter applied
        */
      fill: #e01000;
    }

  `});