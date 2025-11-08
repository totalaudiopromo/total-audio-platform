function getBrowser() {
  return window.chrome ? window.chrome : window.browser ? window.browser : void 0;
}
setTimeout(function () {
  document.body.innerHTML =
    '<iframe src="https://dashboard.blaze.today/popup/" width=650 height=450 style="padding: 0px; margin: 0px; border: none;"></iframe>';
}, 0),
  window.addEventListener('message', e => {
    'close' === e.data.type && window.close();
  });
const browser = getBrowser();
browser.runtime.connect({ name: 'popup' });
