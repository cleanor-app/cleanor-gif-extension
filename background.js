// Service worker — funnel + the right-click entry point.
// All GIF work happens locally in the popup/worker; nothing is uploaded and we never
// touch a page's <video> or media stream, only an image the user explicitly right-clicks.

const SITE = 'https://cleanor.app';
const MENU_OPEN = 'cleanor-gif-open';

function siteUrl(path, medium) {
  const u = new URL(path, SITE);
  u.searchParams.set('utm_source', 'chrome_extension');
  u.searchParams.set('utm_medium', medium);
  u.searchParams.set('utm_campaign', 'cleanor_gif_toolkit');
  u.searchParams.set('utm_content', chrome.runtime.getManifest().version);
  return u.href;
}

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_OPEN,
      title: 'Open this GIF in Cleanor GIF Toolkit',
      contexts: ['image'],
    });
  });
  if (details.reason === 'install') {
    chrome.tabs.create({ url: siteUrl('/tools/reverse-gif', 'onboarding') });
  }
});

// The toolkit runs in a full tab here: the popup would close the moment the user
// answers Chrome's permission prompt for the image's origin.
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_OPEN || !info.srcUrl) return;
  const url = chrome.runtime.getURL(`popup.html?tab=1&src=${encodeURIComponent(info.srcUrl)}`);
  chrome.tabs.create({ url });
});

chrome.runtime.setUninstallURL(siteUrl('/support', 'uninstall'));
