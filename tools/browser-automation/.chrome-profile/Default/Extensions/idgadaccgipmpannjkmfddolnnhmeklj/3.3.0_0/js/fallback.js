let storedFailedMsg = null;

function sendFallbackMsg(msg, callback) {
  chrome.runtime.sendMessage({ request: 'formFallback', storedFailedMsg, ...msg }, callback);
}

document.getElementById('icon').setAttribute('src', chrome.runtime.getURL('images/icon_128.png'));

const insertAnywayBtn = document.getElementById('insert-anyway-btn');
insertAnywayBtn.addEventListener('click', function () {
  sendFallbackMsg({ insert: true });
});

document.getElementById('copy-clipboard-btn').addEventListener('click', function () {
  sendFallbackMsg({ clipboard: true });
});
document.getElementById('close-window-btn').addEventListener('click', function () {
  window.close();
});

sendFallbackMsg({ getInitialData: true }, response => {
  if (response.onlyClipboard) {
    document.getElementById('insert-anyway').remove();
  }
  if (response.customUIMessage) {
    document.querySelector('.failure-default-reason').remove();
    /** @type {HTMLHeadingElement} */
    const divElement = document.querySelector('.custom-ui-message');
    divElement.innerText = '⚠️ ' + response.customUIMessage;
  }
  storedFailedMsg = response.storedFailedMsg;
});
