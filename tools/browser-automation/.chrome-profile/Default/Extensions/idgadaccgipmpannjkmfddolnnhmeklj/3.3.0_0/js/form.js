(() => {
  'use strict';
  window.TEXT_BLAZE_IS_EXTENSION_SANDBOX = !0;
  const e = window.evaluatorEngine,
    t = {};
  async function n(e) {
    return o(e, 'background');
  }
  function o(e, n = 'offscreen') {
    return new Promise(o => {
      const r = Math.random().toString();
      ((t[r] = o), window.parent.postMessage({ type: n, msg: e, waitingKey: r }, '*'));
    });
  }
  (e.setupErrorLogging({ sendMessageFn: n }),
    (window.TB_preferencesStore = {
      getItem: e => o({ key: e, subType: 'get' }, 'localStorage'),
      setItem: (e, t) => o({ key: e, value: t, subType: 'set' }, 'localStorage'),
    }));
  const r = e.makeConfigMaker(
    'EXTENSION',
    function (e) {
      return n({ request: 'remoteLoader', info: e });
    },
    function () {
      return o({ request: 'getClipboard' }, 'offscreen');
    },
    function (...e) {
      return 0 === e[0].length
        ? Promise.resolve({
            needsTabSelectInSiteCommand: !1,
            selectorData: [],
            usedSiteTabSelections: {},
          })
        : n({ request: 'getDataFromTabs', args: e });
    }
  );
  e.setupErrorLogging({ sendMessageFn: n });
  let s = null;
  const i = e.makeReplacementMaker(function (e, t) {
      const o = e.map(e => e.info);
      s = n({ request: 'remote_finalize', info: o, blockData: t });
    }),
    a = e.finishFormMaker(r, i),
    c = e.initFormMaker({
      makeConfig: r,
      findSnippet: async function (e) {
        const t = await n({ request: 'getSnippetsByShortcut', snippet: e.toLocaleLowerCase() });
        if (t.length) return { delta: new Uint8Array(Object.values(t[0].delta)) };
      },
      onAccept: async function (e, t) {
        const { res: o, snippetConfig: r } = await a(e),
          i = { ...r, ...t };
        (s && (await s), n({ request: 'formSubmit', replacement: o, config: i }));
      },
      onReject: function () {
        o({ request: 'closeWindow' });
      },
      setTitle: function (e) {
        o({ request: 'setTitle', title: e });
      },
    });
  !(async function () {
    console.log(Date.now(), 'Requested form data');
    const e = await n({ request: 'nextForm' });
    (console.log(Date.now(), 'Received form data', e),
      e
        ? c(e)
        : (document.body.innerText =
            'Form failed to load, please contact us at support@blaze.today to troubleshoot'));
  })();
  let u = l();
  function l() {
    return {
      left: window.screenLeft,
      top: window.screenTop,
      width: window.outerWidth,
      height: window.outerHeight,
    };
  }
  (setInterval(() => {
    const e = l();
    (u.left === e.left && u.top === e.top && u.width === e.width && u.height === e.height) ||
      ((u = e), n({ request: 'savePosition', position: e }));
  }, 500),
    (window.forwardMessage = function (n) {
      const o = n.data;
      if (null === o)
        return (
          e.reportToErrorMonitoring('Message data is null', { messageOrigin: n.origin }),
          { handled: !0 }
        );
      const { msg: r, waitingKey: s } = o;
      if (s && t[s]) {
        const e = t[s];
        return (delete t[s], e(r.response), { handled: !0 });
      }
      return 'backgroundResponse' === r.type
        ? { handled: !0 }
        : { handled: !1, msg: r, waitingKey: s };
    }),
    window.clearMessageBuffer());
})();
