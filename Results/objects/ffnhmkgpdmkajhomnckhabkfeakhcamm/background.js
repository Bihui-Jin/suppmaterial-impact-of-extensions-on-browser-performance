const PROTOCOL = 'https:';
const HOST = 'www.tumblr.com';
const PATHNAME = '/widgets/share/tool';

function getBrowserSource () {
  const { userAgent = '' } = window.navigator;

  return userAgent.includes('Chrome')
    ? 'chrome_extension'
    : userAgent.includes('Firefox')
      ? 'firefox_extension'
      : null;
}

function getScrollBarWidth () {
  try {
    const div = document.createElement('div');
    div.style.height = '100px';
    div.style.width = '100px';
    div.style.overflow = 'scroll';

    document.body.append(div);
    const width = div.offsetWidth - div.clientWidth;

    div.remove();
    return width;
  } catch (exception) {
    return 0;
  }
}

function getShareParams () {
  const searchParams = new URLSearchParams();
  searchParams.set('url', location.href);
  searchParams.set('title', document.title);
  searchParams.set('selection', window.getSelection());

  return searchParams.toString();
}

function openPopup ({ search, scrollBarWidth }) {
  const url = new URL(`${PROTOCOL}//${HOST}${PATHNAME}`);
  Object.assign(url, { search });

  const { searchParams } = url;
  searchParams.set('shareSource', getBrowserSource());

  browser.windows.create({
    focused: true,
    height: 600,
    type: 'popup',
    url: url.href,
    width: 540 + scrollBarWidth
  });
}

async function handleActionClick (tab) {
  const [search] = await browser.tabs.executeScript(tab.id, {
    code: `(${getShareParams.toString()})()`
  });

  const [scrollBarWidth] = await browser.tabs.executeScript(tab.id, {
    code: `(${getScrollBarWidth.toString()})()`
  });

  openPopup({ search, scrollBarWidth });
}

async function handleContextMenuClick (info, tab) {
  const searchParams = new URLSearchParams();
  searchParams.set('posttype', 'photo');
  searchParams.set('content', info.srcUrl);
  searchParams.set('title', tab.title);
  searchParams.set('url', tab.url);

  const [scrollBarWidth] = await browser.tabs.executeScript(tab.id, {
    code: `(${getScrollBarWidth.toString()})()`
  });

  openPopup({
    search: searchParams.toString(),
    scrollBarWidth
  });
}

browser.contextMenus.create({
  contexts: ['image'],
  id: 'rightClickImage',
  title: browser.i18n.getMessage('actionTitle')
});

browser.browserAction.onClicked.addListener(handleActionClick);
browser.contextMenus.onClicked.addListener(handleContextMenuClick);
