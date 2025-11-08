import * as e from '../resources/core_engine.main.js';
var t = {
  d: (e, n) => {
    for (var o in n)
      t.o(n, o) && !t.o(e, o) && Object.defineProperty(e, o, { enumerable: !0, get: n[o] });
  },
  o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
};
const n = ((o = { engine: () => e.engine }), (a = {}), t.d(a, o), a).engine;
var o, a;
const r = window.chrome ? window.chrome : window.browser ? window.browser : void 0;
async function i(e) {
  return await r.runtime.sendMessage(e);
}
function s(e) {
  return 'get' === e.subType
    ? localStorage.getItem(e.key)
    : 'set' === e.subType
    ? localStorage.setItem(e.key, e.value)
    : void 0;
}
let c;
n.setupErrorLogging({ sendMessageFn: i });
const d = {};
function l(e, t) {
  const n = Math.random();
  (d[n] = t), c.contentWindow.postMessage({ waitingKey: n, msg: e }, '*');
}
const {
    getClipboard: u,
    setClipboard: p,
    getAndSetClipboard: m,
    setClipboardWithCache: g,
    clearTmpCacheClipboard: b,
  } = (() => {
    let e;
    const t = function () {
      document.activeElement &&
        document.activeElement instanceof HTMLElement &&
        document.activeElement.blur(),
        (c = !0),
        document.execCommand('paste', !1);
      const e = { text: i, html: s };
      return (i = void 0), (s = void 0), e;
    };
    let o,
      a,
      r = null;
    document.getElementById('clip-write').addEventListener('copy', function (e) {
      void 0 !== o && e.clipboardData.setData('text/plain', o),
        void 0 !== a &&
          (r && r.isCKE4 && (a = n.joinConsecutiveParagraphTagsForCKE4(a)),
          e.clipboardData.setData('text/html', a)),
        e.preventDefault(),
        (o = void 0),
        (a = void 0),
        (r = null);
    });
    let i,
      s,
      c = !1;
    window.addEventListener('paste', function (e) {
      if (c) {
        const t = e.clipboardData,
          n = t.types;
        n.includes('text/plain') && (i = t.getData('text/plain')),
          n.includes('text/html') &&
            ((s = t.getData('text/html')),
            (s = (function (e) {
              const t = new DOMParser().parseFromString(e, 'text/html'),
                n = t.querySelector('parsererror');
              if (n)
                return (
                  console.error(
                    `Error ("${n.textContent}") when parsing snippet content. Aborting strip IDs and returning original snippet content unchanged`
                  ),
                  e
                );
              const o = t.querySelectorAll('[id]');
              for (const e of o) e.removeAttribute('id');
              return t.body.innerHTML;
            })(s))),
          void 0 === i &&
            void 0 === s &&
            (console.warn('Clipboard did not contain text or HTML'),
            (i = t.getData('text/uri-list') || t.getData('text/csv'))),
          e.stopPropagation(),
          e.preventDefault(),
          (c = !1);
      }
    });
    const d = function ({ data: e, options: t }) {
      return (
        (o = e.text),
        (a = e.html),
        (r = t),
        document.getElementById('clip-write').focus(),
        document.execCommand('copy', !1),
        (function (e = 0) {
          return new Promise(t => setTimeout(t, e));
        })(3)
      );
    };
    return {
      getClipboard: t,
      setClipboard: d,
      getAndSetClipboard: function (o) {
        e = t();
        const { contents: a, styles: r, targetTag: i, options: s } = o.set;
        return (
          a.html && (a.html = n.applyContextualStyles(a.html, r, i)), d({ data: a, options: s })
        );
      },
      setClipboardWithCache: async function () {
        if (null === e) return console.warn('No cache to set.'), 'failed';
        if (void 0 === e)
          return void n.captureException(
            new Error('Missing cached clipboard value when restoring')
          );
        const t = d({ data: e });
        return (e = null), t;
      },
      clearTmpCacheClipboard: function () {
        e = null;
      },
    };
  })(),
  w = (() => {
    const e = {
      complete: new Audio(r.runtime.getURL('sounds/click.wav')),
      intent: new Audio(r.runtime.getURL('sounds/intent.mp3')),
      fail: new Audio(r.runtime.getURL('sounds/fail.mp3')),
    };
    return function (t, o) {
      const a = e[t];
      try {
        (a.volume = o),
          a.play().catch(e => {
            n.captureException(e);
          });
      } catch (e) {
        n.captureException(e);
      }
    };
  })();
var f, h;
(window.forwardMessage = (e, t, o) => {
  if ('offscreen' === e.target)
    switch (e.type) {
      case 'isAlive':
        o({ isAlive: !0, version: '3.3.0' });
        break;
      case 'getClipboard':
        return o(u());
      case 'setClipboard':
        return p({ data: e.data }).then(e => o('done')), !0;
      case 'getAndSetClipboard':
        return m(e).then(() => o('done')), !0;
      case 'setClipboardWithCache':
        return g().then(e => o(e || 'done')), !0;
      case 'localStorage':
        o(s(e));
        break;
      case 'playSound':
        w(e.intent, e.volume);
        break;
      case 'alert':
        alert(e.msg);
        break;
      case 'sandbox':
        return l(e.message, o), !0;
      case 'updateLoggerDetails':
        return n.handleDetailsUpdate(e), l(e, o), !1;
      default:
        throw new Error('Undefined message type' + e.type);
    }
}),
  (f = async e =>
    'getClipboard' === e.request ? u() : 'clearTmpCacheClipboard' === e.request ? b() : void 0),
  window.addEventListener('message', e => {
    function t(t) {
      e.source.postMessage(
        { waitingKey: a, msg: { type: 'backgroundResponse', response: t } },
        '*'
      );
    }
    const { type: o, waitingKey: a, msg: r } = e.data;
    switch (
      (n.addBreadcrumb({
        message: 'Message from sandbox',
        data: {
          type: o,
          subType:
            'background' === o || 'offscreen' === o
              ? r.request
              : 'localStorage' === o
              ? `${r.subType}|${r.key}`
              : '',
        },
      }),
      o)
    ) {
      case 'response':
        const { result: c } = e.data,
          l = d[a];
        l ? (delete d[a], l(c)) : n.captureException(new Error('Invalid waitingKey'));
        break;
      case 'offscreen':
        f(r).then(e => {
          void 0 !== e && t(e);
        });
        break;
      case 'background':
        i(r).then(e => {
          t(e);
        });
        break;
      case 'localStorage':
        t(s(r));
        break;
      default:
        console.warn('Invalid type', r), n.captureException(new Error('Invalid type: ' + o));
    }
  }),
  ((h = r.runtime.getURL('./html/sandbox.html')),
  (c = document.createElement('iframe')),
  (c.src = h),
  (c.id = 'sandboxFrame'),
  new Promise(e => {
    document.body.appendChild(c),
      c.contentWindow.addEventListener('load', () => {
        e();
      });
  })).then(() => {
    window.clearMessageBuffer();
  }),
  console.log(Date.now(), 'Offscreen document script complete');
