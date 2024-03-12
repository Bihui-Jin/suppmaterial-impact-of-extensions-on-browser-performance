const getTagAndQuoteEscapedString = (string) => {
  if (typeof string !== 'string') return string;
  return string
    ?.replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

function handleLocalMessage(event) {
  if (event.name === 'INIT_FOLDER_DROPDOWN_POPOVER') {
    initFolderDropdown(event.message);
  } else if (event.name === 'POPOVER_NEW_FOLDER_ITEM') {
    addNewFolderItem(event.message.folder);
  } else if (event.name === 'PAGE_SAVED') {
    updateSavedPageId(event.message.savedPageId);
  }
}

const initFolderDropdown = (message) => {
  clearFolderDropdown();
  initLocalization();
  renderFolders(message);
  updateCurFolderStyle();

  addEvents();
};

const renderFolders = (message) => {
  const { folders, savedPage } = message;
  const folderDropdown = document.querySelector('.L-FolderDropdown');
  folderDropdown.dataset.savedPageId = savedPage.savedPageId ?? -1;
  folderDropdown.dataset.curFolderId = savedPage.folder?.id ?? -1;

  const foldersDOM = folders.reduce((dom, folder) => dom + createFolder(folder), '');
  folderDropdown.insertAdjacentHTML('afterbegin', foldersDOM);
};

const createFolder = (folder) => {
  const { id, name, status, emoji } = folder;
  if (status === 'unclassified') return '';
  return `
    <li class='L-FolderItem' data-folder-id='${id}'>
      <b class='L-FolderItem__emoji ${emoji ? '' : 'L-EmptyEmoji'}'>${emoji || ''}</b>
      <b class='L-FolderItem__nameWrapper'>
        <span class='L-FolderItem__name'>${getTagAndQuoteEscapedString(name)}</span>
        <i class='L-FolderItem__icon'></i>
      </b>
    </li>
  `;
};

const updateCurFolderIdDataset = (folderId) => {
  const folderDropdown = document.querySelector('.L-FolderDropdown');
  folderDropdown.dataset.curFolderId = folderId;
};

const updateCurFolderStyle = () => {
  const folderDropdown = document.querySelector('.L-FolderDropdown');
  const { curFolderId } = folderDropdown.dataset;
  const folderItems = [...document.querySelectorAll('.L-FolderItem')];

  folderItems.forEach((folderItem) => {
    const { folderId } = folderItem.dataset;
    if (+folderId === +curFolderId) {
      folderItem.classList.add('L-FolderItem__current');
    } else {
      folderItem.classList.remove('L-FolderItem__current');
    }
  });
};

const clearFolderDropdown = () => {
  const folderDropdown = document.querySelector('.L-FolderDropdown');
  while (folderDropdown.firstElementChild) {
    folderDropdown.firstElementChild.remove();
  }
};

const addEvents = () => {
  const folderItems = [...document.querySelectorAll('.L-FolderItem')];
  folderItems.forEach((folderItem) => {
    folderItem.addEventListener('click', putCurPageFolder);
  });

  const addFolderBtn = document.querySelector('.L-AddFolderBtn');
  addFolderBtn.addEventListener('click', showAddFolderModal);
};

const putCurPageFolder = (e) => {
  const folderItem = e.currentTarget;
  if (folderItem.classList.contains('L-FolderItem__current')) {
    return;
  }

  const { folderId } = folderItem.dataset;
  const folderDropdown = document.querySelector('.L-FolderDropdown');
  const { savedPageId, curFolderId } = folderDropdown.dataset;
  const folderName = folderItem.querySelector('.L-FolderItem__name').textContent;
  const folderEmoji = folderItem.querySelector('.L-FolderItem__emoji').textContent;

  messageToNative('PUT_CUR_PAGE_FOLDER_ID', {
    savedPageId: +savedPageId,
    folderId: +folderId,
    folderName: folderName.trim(),
    folderEmoji: folderEmoji,
    curFolderId: +curFolderId,
  });

  updateCurFolderIdDataset(folderId);
  updateCurFolderStyle();
};

const showAddFolderModal = () => {
  const { savedPageId, curFolderId } = document.querySelector('.L-FolderDropdown').dataset;
  messageToNative('SHOW_ADD_FOLDER_MODAL', { savedPageId, curFolderId });
};

const addNewFolderItem = (folder) => {
  const folderDropdown = document.querySelector('.L-FolderDropdown');
  const newFolderItem = createFolder(folder);
  folderDropdown.insertAdjacentHTML('afterbegin', newFolderItem);

  const scrollBox = document.querySelector('.L-FolderDropdownBox');
  scrollBox.scroll({ top: 0, left: 0, behavior: 'smooth' });

  const targetItem = document.querySelector(`[data-folder-id="${folder.id}"]`);
  targetItem.addEventListener('click', putCurPageFolder);

  updateCurFolderIdDataset(folder.id);
  updateCurFolderStyle();
};

const initLocalization = () => {
  const addFolderBtn = document.querySelector('.L-AddFolderBtn__text');
  addFolderBtn.textContent = localize('Create new folder');
};

const updateSavedPageId = (savedPageId) => {
  const folderDropdown = document.querySelector('.L-FolderDropdown');
  folderDropdown.dataset.savedPageId = savedPageId;
};

document.addEventListener('DOMContentLoaded', () => {
  messageToNative('INIT_FOLDER_DROPDOWN_POPOVER');
});
