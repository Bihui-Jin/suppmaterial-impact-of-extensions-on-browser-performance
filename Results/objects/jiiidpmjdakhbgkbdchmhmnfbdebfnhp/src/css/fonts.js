RULERS.styling.push(()=>{const{css:a}=RULERS.helpers;return a`

    /* lato-300 - latin */
    @font-face {
      font-family: 'Lato';
      font-style: normal;
      font-weight: 300;
      src: local('Lato Light'), local('Lato-Light'),
          url('${chrome.runtime.getURL('fonts/lato-v16-latin-300.woff2')}') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
          url('${chrome.runtime.getURL('fonts/lato-v16-latin-300.woff')}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
    }
    /* lato-regular - latin */
    @font-face {
      font-family: 'Lato';
      font-style: normal;
      font-weight: 400;
      src: local('Lato Regular'), local('Lato-Regular'),
          url('${chrome.runtime.getURL('fonts/lato-v16-latin-regular.woff2')}') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
          url('${chrome.runtime.getURL('fonts/lato-v16-latin-regular.woff')}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
    }
    /* lato-700 - latin */
    @font-face {
      font-family: 'Lato';
      font-style: normal;
      font-weight: 700;
      src: local('Lato Bold'), local('Lato-Bold'),
          url('${chrome.runtime.getURL('fonts/lato-v16-latin-700.woff2')}') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
          url('${chrome.runtime.getURL('fonts/lato-v16-latin-700.woff')}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
    }

    /* varela-round-regular - latin */
    @font-face {
      font-family: 'Varela Round';
      font-style: normal;
      font-weight: 400;
      src: local('Varela Round Regular'), local('VarelaRound-Regular'),
          url('${chrome.runtime.getURL('fonts/varela-round-v12-latin-regular.woff2')}') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
          url('${chrome.runtime.getURL('fonts/varela-round-v12-latin-regular.woff')}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
    }
  `});