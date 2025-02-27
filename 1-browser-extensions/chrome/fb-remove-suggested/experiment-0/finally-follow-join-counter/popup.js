// Popup settings management
document.addEventListener('DOMContentLoaded', () => {
  const finallyCheckbox = document.getElementById('finally-checkbox');
  const followCheckbox = document.getElementById('follow-checkbox');
  const joinCheckbox = document.getElementById('join-checkbox');

  // Load saved settings
  chrome.storage.sync.get(['finallyEnabled', 'followEnabled', 'joinEnabled'], (result) => {
    finallyCheckbox.checked = result.finallyEnabled !== false;
    followCheckbox.checked = result.followEnabled !== false;
    joinCheckbox.checked = result.joinEnabled !== false;
  });

  // Save settings when checkboxes are changed
  finallyCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ 
      finallyEnabled: finallyCheckbox.checked 
    });
    // Notify content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'settingsUpdate',
        finallyEnabled: finallyCheckbox.checked
      });
    });
  });

  followCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ 
      followEnabled: followCheckbox.checked 
    });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'settingsUpdate',
        followEnabled: followCheckbox.checked
      });
    });
  });

  joinCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ 
      joinEnabled: joinCheckbox.checked 
    });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'settingsUpdate',
        joinEnabled: joinCheckbox.checked
      });
    });
  });
});