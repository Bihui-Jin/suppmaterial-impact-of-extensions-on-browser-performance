RULERS.styling.push(()=>{const{css:a}=RULERS.helpers;return a`
    /* GENERAL STYLING */
    #RULERS_modal.storage-full {
      display: flex;
      flex-direction: column;
    }

    #RULERS_modal.storage-full table {
      table-layout: fixed;
      border-collapse: collapse;
      width: 100%;
      padding: 0;
      margin-top: 16px;
    }

    #RULERS_modal.storage-full table tr {
      padding: 0;
      margin: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    #RULERS_modal.storage-full table tr.deleted {
      opacity: 0.5;
      text-decoration: line-through;
      pointer-events: none;
    }

    #RULERS_modal.storage-full table tr:last-of-type {
      border-bottom: none;
    }

    #RULERS_modal.storage-full table tr th,
    #RULERS_modal.storage-full table tr td {
      padding: 4px 0;
      vertical-align: middle;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    #RULERS_modal.storage-full table tr .site {
      width: 25%;
    }

    #RULERS_modal.storage-full table tr .file {
      width: auto;
      padding-left: 10px;
    }

    #RULERS_modal.storage-full table tr .size {
      width: 60px;
      padding-left: 10px;
    }

    #RULERS_modal.storage-full table tr .delete {
      padding-left: 8px;
      width: 30px;
    }

    #RULERS_modal.storage-full table tr .delete button {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid transparent;
      background-image: url(${chrome.runtime.getURL("img/icons/remove.svg")});
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 10px;
      transition: background-color 0.2s, border 0.2s;
      cursor: pointer;
    }

    #RULERS_modal.storage-full table tr .delete button:hover {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    #RULERS_modal.storage-full .RULERS_important {
      position: relative;
      padding: 10px 10px 10px 50px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      font-weight: 800;
      margin-top: 20px;
    }

    #RULERS_modal.storage-full .RULERS_important::before {
      content: "";
      background-image: url(${chrome.runtime.getURL("img/emoji/danger.png")});
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 15px;
      display: inline-block;
      width: 15px;
      position: absolute;
      height: 100%;
      padding: 0 10px;
      top: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 3px 0 0 3px;
      border-right: 1px solid rgba(255, 255, 255, 0.3);
    }

    #RULERS_modal.storage-full .RULERS_important.done::before {
      background-image: url(${chrome.runtime.getURL("img/emoji/tada.png")});
    }
  `});