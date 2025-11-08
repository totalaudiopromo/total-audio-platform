!(function () {
  const n =
    'undefined' != typeof GLOBALS ? GLOBALS : (window.opener && window.opener.GLOBALS) || [];
  document.dispatchEvent(new CustomEvent('GMAIL_SDK_LOADED', { detail: n }));
})();
//# sourceMappingURL=//static.hsappstatic.net/SignalsExtension/static-2.32769/js/gmailSdk.js.map
