window.TEXT_BLAZE_IS_EXTENSION_SANDBOX = !0;
const e = window.evaluatorEngine,
  t = {};
async function n(e) {
  return a(e, 'background');
}
function a(e, n = 'offscreen') {
  return new Promise(a => {
    const o = Math.random().toString();
    ((t[o] = a), window.parent.postMessage({ type: n, msg: e, waitingKey: o }, '*'));
  });
}
async function o(e) {
  const t = await n({ request: 'getSnippetsByShortcut', snippet: e.toLocaleLowerCase() });
  if (t.length) return { delta: new Uint8Array(Object.values(t[0].delta)) };
}
(e.setupErrorLogging({ sendMessageFn: n }),
  (window.TB_preferencesStore = {
    getItem: e => a({ key: e, subType: 'get' }, 'localStorage'),
    setItem: (e, t) => a({ key: e, value: t, subType: 'set' }, 'localStorage'),
  }));
const r = e.makeConfigMaker(
  'EXTENSION',
  function (e) {
    return n({ request: 'remoteLoader', info: e });
  },
  function () {
    return a({ request: 'getClipboard' }, 'offscreen');
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
let s = {};
const i = document.getElementById('abs-font-size');
function c(e) {
  n({ request: 'showNotification', ...e });
}
const d = e.makeReplacementMaker(function (...e) {
  n({ request: 'processSidechannelItems', args: e });
});
async function l(t) {
  switch (t.type) {
    case 'getScreenWidth':
      return window.screen.width;
    case 'getHTMLInsertionStats':
      return e.getHTMLInsertionStats(...t.args);
    case 'handleReplacement':
      return (async function ({ delta: t, configDef: n }) {
        return (
          e.restoreConfigDefFromCleaned(n, s, c, o, () => {}),
          await e.evaluateDeltaUsingConfigDef(t, n, r, d)
        );
      })(t);
    case 'convertAbsSizeToPx':
      return (
        (n = t.fontFamily),
        (l = t.fontSize),
        (i.style.fontFamily = n),
        (i.style.fontSize = l),
        window.getComputedStyle(i).fontSize
      );
    case 'runErrorBlock':
    case 'runFinishBlock':
    case 'showCompletedNotification':
      return (function ({ type: t, args: n, state: a }) {
        switch (t) {
          case 'runFinishBlock':
            return (async function (t, n, a, o, s) {
              await e.runFinishBlockDownstream(t, n, a, o, s, r, c);
            })(...n);
          case 'runErrorBlock':
            return (async function (t, n, a, o, s) {
              await e.runErrorBlockDownstream(t, n, a, o, s, r, c);
            })(...n);
          case 'showCompletedNotification':
            return (async function (t, n, a, o) {
              const r = await e.callCompletedFn(o, t, n);
              r && c({ title: a, message: r });
            })(...n, a);
        }
      })(t);
    case 'setLocale':
      return (e.setLocale(t.code), 'ack');
    case 'addAddonAttributes': {
      const n = t.data;
      if (t.deltaWithOps || t.deltaArray) {
        const a = t.deltaWithOps || e.decompressDelta(new Uint8Array(t.deltaArray));
        Object.assign(n, { content: { delta: a } });
      }
      return e.addAddonAttributes(t.addonNamespace, n);
    }
    case 'updateLoggerDetails':
      (t.id || a({ request: 'clearTmpCacheClipboard' }, 'offscreen'), e.handleDetailsUpdate(t));
      break;
    case 'updateAddons':
      s = t.cleanedActiveAddons;
      break;
    default:
      throw (console.warn('Unknown message', t), new Error('Unknown message type: ' + t.type));
  }
  var n, l;
}
((window.forwardMessage = n => {
  const a = (function (n) {
    const a = n.data;
    if (null === a)
      return (
        e.reportToErrorMonitoring('Message data is null', { messageOrigin: n.origin }),
        { handled: !0 }
      );
    const { msg: o, waitingKey: r } = a;
    if (r && t[r]) {
      const e = t[r];
      return (delete t[r], e(o.response), { handled: !0 });
    }
    return 'backgroundResponse' === o.type
      ? { handled: !0 }
      : { handled: !1, msg: o, waitingKey: r };
  })(n);
  if (!0 === a.handled) return;
  const { msg: o, waitingKey: r } = a;
  l(o).then(e => {
    n.source.postMessage({ type: 'response', waitingKey: r, result: e }, n.origin);
  });
}),
  window.clearMessageBuffer(),
  console.log(Date.now(), 'Sandbox document loaded'),
  n({ request: 'offscreenInitialized' }));
