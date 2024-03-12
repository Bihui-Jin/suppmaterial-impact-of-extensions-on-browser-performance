RULERS.styling.push(()=>{const{css:a}=RULERS.helpers,{color:b}=RULERS.themes;return a`

    /* GENERAL STYLING */
    #RULERS_modal.layout {
      display: flex;
      flex-direction: row;
      padding: 0;
      width: 710px;
    }

    #RULERS_modal.layout h1 {
      font-family: "Lato", sans-serif;
      font-weight: 300;
      font-size: 24px;
      color: ${b('white')};
      padding-bottom: 5px;
    }

    #RULERS_modal.layout h1 strong {
      font-weight: 700;
    }

    #RULERS_modal.layout p {
      font-size: 13px;
      margin-bottom: 10px;
      min-height: 56px;
    }

    /* SECTIONS */
    #RULERS_modal > section.RULERS__layout-modal__design {
      padding: 40px 30px 0 40px;
      width: 300px;
      border-right: 4px solid ${b('purple_extra_dark',.15)};
    }

    #RULERS_modal > section.RULERS__layout-modal__grid {
      padding: 40px 40px 15px 30px;
      flex-basis: 0;
      flex: 1;
    }

    #RULERS_modal .RULERS__layout-modal__columns {
      display: flex;
      flex-direction: row;
    }

    #RULERS_modal .RULERS__layout-modal__columns > section {
      flex-basis: 0;
      flex: 1;
      width: 50%;
      margin: 0;
    }

    #RULERS_modal .RULERS__layout-modal__columns > section:last-of-type {
      padding-left: 20px;
    }
  `});