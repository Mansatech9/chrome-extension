// Background service worker for JobTracker CRM

let contextMenuTriggered = false;

// Set up context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveToJobTracker',
    title: 'Save to JobTracker CRM',
    contexts: ['page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToJobTracker') {
    contextMenuTriggered = true;
    chrome.action.openPopup();
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkContextMenuTrigger') {
    sendResponse({ fromContextMenu: contextMenuTriggered });
    contextMenuTriggered = false;
  }
  return true;
});

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  console.log('JobTracker CRM extension started');
});