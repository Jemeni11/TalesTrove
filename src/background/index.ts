export {};

const openTab = () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("tabs/talestrove.html")
  });
};

if (chrome.action) {
  chrome.action.onClicked.addListener(openTab);
} else if (chrome.browserAction) {
  chrome.browserAction.onClicked.addListener(openTab);
}
