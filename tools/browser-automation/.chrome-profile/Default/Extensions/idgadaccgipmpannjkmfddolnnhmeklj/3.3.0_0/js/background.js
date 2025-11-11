/*! For license information please see background.js.LICENSE.txt */
import * as e from '../resources/core_engine.main.js';
var t = {
  d: (e, n) => {
    for (var r in n)
      t.o(n, r) && !t.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: n[r] });
  },
};
((t.g = (function () {
  if ('object' == typeof globalThis) return globalThis;
  try {
    return this || new Function('return this')();
  } catch (e) {
    if ('object' == typeof window) return window;
  }
})()),
  (t.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)));
const n = ((s = { engine: () => e.engine }), (o = {}), t.d(o, s), o).engine,
  r = n.browser(),
  i = {
    chrome: { PROD: 'idgadaccgipmpannjkmfddolnnhmeklj', EA: 'amhmmkiplhcagoggialfgcnfkjklfpal' },
    edge: { PROD: 'fephhmmlanlhoiaphlodlhbmbnkmkckn' },
  };
var s, o;
function a() {
  return r.runtime.getManifest().version;
}
function c() {
  return r.runtime.id;
}
function u() {
  return Object.values(i.edge).includes(c()) ? 'edge' : 'chrome';
}
const l = function () {
    return !('update_url' in r.runtime.getManifest());
  },
  h = i[u()].PROD,
  d = i[u()].EA;
function f({ name: e, shortcut: t, text: n }, r) {
  let i = '/new#?source=' + encodeURIComponent(r);
  ((i += '&text=' + encodeURIComponent(n)),
    e && (i += '&name=' + encodeURIComponent(e)),
    t && (i += '&shortcut=' + encodeURIComponent(t)),
    p(i));
}
const p = async function (e = '') {
    let t;
    t = 'https://dashboard.blaze.today' + e;
    const n = await r.tabs.create({ url: t, active: !0 });
    await r.windows.update(n.windowId, { focused: !0 });
  },
  g = function (e) {
    if (!e) return !1;
    const t = e.trim();
    return ![
      'chrome://',
      'chrome-error://',
      'data:',
      'https://chrome.google.com/webstore',
      'https://chromewebstore.google.com/',
      'chrome-extension://',
      'edge://',
    ].some(e => t.startsWith(e));
  },
  m = function (e) {
    return e && !e.discarded && g(e.url);
  },
  y = { running: [] };
function w(e, t, n = { key: '' }) {
  const i = { ...y };
  if (t)
    if ('running' === e) {
      const e = { key: n.key, time: Date.now() };
      y.running = y.running.concat(e);
    } else y[e] = !0;
  else 'running' === e ? (y.running = y.running.filter(e => e.key !== n.key)) : delete y[e];
  !(function (e) {
    let t,
      n,
      i,
      s = 'regular';
    const o = '#fea44a';
    if (y.loggedOut) {
      if (e.loggedOut) return;
      ((t = 'disabled'), (n = ''), (i = 'Log-in to Text Blaze'));
    } else if (y.running.length > 0) {
      ((s = null), (t = 'enabled'), (n = null));
      const e = y.running.length;
      i = 'Text Blaze is currently running ' + (1 === e ? 'a snippet' : e + ' snippets');
    } else
      y.isTranscribing
        ? ((t = 'enabled'),
          (s = 'running'),
          (n = '🎤'),
          (i = 'Text Blaze is transcribing your speech'))
        : (y.disabled
            ? ((t = 'disabled'),
              (i =
                ('edge' === u() ? 'Edge add-ons' : 'Chrome extensions') +
                ' are not supported on this website, so Text Blaze is disabled.'))
            : ((t = 'enabled'), (i = 'View Text Blaze Snippets')),
          (n = y.hasNotification ? ' ' : ''),
          y.isNotLiveSynced &&
            ((s = 'syncing'),
            (n = '↻'),
            (i =
              'Syncing is taking longer than usual... (right-click on the page and select "Text Blaze" -> "Reload Extension..." to resync your snippets)')));
    if (
      (T && 0 === y.running.length && (clearInterval(T), (T = null)),
      r.action.setTitle({ title: i }),
      s &&
        r.action.setBadgeBackgroundColor({
          color:
            'regular' === s
              ? '#d2e3fc'
              : 'running' === s
                ? o
                : 'syncing' === s
                  ? '#ffe4c8'
                  : void 0,
        }),
      t)
    ) {
      const e = v[t];
      r.action.setIcon({ path: e });
    }
    'string' == typeof n
      ? r.action.setBadgeText({ text: n })
      : T ||
        (r.action.setBadgeText({ text: '' }),
        (T = setInterval(() => {
          let e = '';
          if (1 === y.running.length) {
            const t = Date.now() - y.running[0].time;
            e = Math.floor(t / 1e3) + 's';
          } else e = 'x' + y.running.length;
          (r.action.setBadgeText({ text: e }), r.action.setBadgeBackgroundColor({ color: o }));
        }, 1e3)));
  })(i);
}
const v = {},
  b = { enabled: '', disabled: 'grey_' },
  I = [32, 48, 64, 96, 128];
for (const e of Object.keys(b)) {
  const t = {},
    n = b[e];
  for (const e of I) t[e] = r.runtime.getURL(`/images/${n}icon_${e}.png`);
  v[e] = t;
}
let T = null;
function _(e) {
  r.tabs.query({}, function (t) {
    for (const n of t) O(n.id, { type: 'desktopIntegrationStatus', status: e });
  });
}
async function E() {
  const e = await r.tabs.query({ active: !0, currentWindow: !0 });
  e.length
    ? ne(e[0].id, 0).then(e => {
        w('disabled', !e);
      })
    : w('disabled', !1);
}
async function S(e, t) {
  if (!t || m(t)) {
    if (!t) {
      let e;
      try {
        e = await r.tabs.query({ active: !0, lastFocusedWindow: !0 });
      } catch (e) {
        return void x(e);
      }
      if (!(t = e[0])) return void console.warn('returned early');
    }
    return (
      e.target ? e.target.tabId || (e.target.tabId = t.id) : (e.target = { tabId: t.id }),
      await r.scripting.executeScript(e)
    );
  }
}
function C(e = 0) {
  return new Promise(t => setTimeout(t, e));
}
let A = !1,
  k = 0;
function D() {
  A &&
    (k > 0 && console.log('+ ' + (Date.now() - k) + ' ms'),
    (k = Date.now()),
    console.log(...[...arguments].map(e => (e instanceof Function ? e() : e))));
}
function x(...e) {
  n.reportToErrorMonitoring(...e);
}
function N() {
  return new Promise(e => {
    r.tabs.query({ active: !0, currentWindow: !0 }, t => {
      e(t[0]);
    });
  });
}
function O(e, t, n) {
  return new Promise(i =>
    r.tabs.sendMessage(e, t, n, e => {
      r.runtime.lastError ? i(void 0) : i(e);
    })
  );
}
self.reportToErrorMonitoring = x;
const R = r.runtime.getURL('html/offscreen.html');
let P = !1;
async function M() {
  (await r.offscreen.createDocument({
    url: R,
    reasons: [r.offscreen.Reason.CLIPBOARD, r.offscreen.Reason.LOCAL_STORAGE],
    justification: 'access clipboard and local storage data',
  }),
    console.log(Date.now(), 'Offscreen document created'));
}
let L = null;
async function F() {
  if (L) return L;
  ((L = (async function () {
    if (
      !(await (async function () {
        return !!(
          await r.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'], documentUrls: [R] })
        ).length;
      })())
    ) {
      console.log(Date.now(), 'Offscreen document does not exist');
      try {
        let e = Date.now();
        (await M(),
          Math.random() < 0.001 &&
            n.log({ action: 'Offscreen init', label: { duration: Date.now() - e } }));
      } catch (e) {
        if (e.toString().includes('Only a single offscreen document')) {
          const t = await r.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] }),
            n = t.map(e =>
              JSON.stringify({
                url: e.documentUrl,
                origin: e.documentOrigin,
                incognito: e.incognito,
              })
            );
          (x('Closing and creating offscreen document again after a delay', {
            contextCount: t.length,
            metadata: n,
          }),
            await r.offscreen.closeDocument(),
            await C(500));
          try {
            await M();
          } catch (t) {
            x(t, { previousError: e.toString() });
          }
        } else x(e);
      }
    }
    P = !0;
  })()),
    await L,
    (L = null));
}
async function U(e) {
  return (await F(), r.runtime.sendMessage({ ...e, target: 'offscreen' }));
}
function V(e) {
  return U({ type: 'sandbox', message: e });
}
function B(e) {
  r.tabs
    .get(e)
    .then(e => {
      r.windows.update(e.windowId, { focused: !0 }, () => {
        r.tabs.update(e.id, { active: !0 });
      });
    })
    .catch(e => {
      x(e);
    });
}
const j = {};
async function z(e) {
  (n.addBreadcrumb({ message: 'Notification created: ' + e.title, data: e }),
    (e.buttons = e.buttons || []));
  for (const t of e.buttons)
    ((t.identifier = Math.random()), (j[t.identifier] = t.callback), delete t.callback);
  const t = await N();
  let i;
  if (t) {
    const n = t.id;
    i = await O(n, { type: 'inPageNotification', data: e }, { frameId: 0 });
  }
  i ||
    ((i = await (async function (e) {
      const t = await V({ type: 'getScreenWidth' }),
        n = e.message.length < 100 ? 175 : 350,
        i = {
          type: 'popup',
          url: '../html/notify.html',
          focused: !0,
          left: Math.ceil(t - 340 - 200),
          top: 100,
          width: 340,
          height: n,
        };
      async function s(t) {
        return ((q = e), await r.windows.create(t), !0);
      }
      function o(t) {
        return ((q = null), x(t), U({ type: 'alert', msg: `${e.title}\n\n${e.message}` }), !1);
      }
      try {
        return await s({ ...i });
      } catch (e) {
        if (!e.toString().includes('Invalid value for bounds')) return o(e);
        try {
          return await s({ ...i, top: 0, left: 0 });
        } catch (e) {
          return o(e);
        }
      }
    })(e)),
    i || x('Fallback to alert() in notification display'));
}
let q = null;
function G(e) {
  return e
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
function $() {
  r.runtime.reload();
}
function K(e) {
  return z({ title: e.title, message: e.message, intent: e.intent });
}
function W(e, t) {
  const n = 'string' == typeof e ? e : e.toString();
  t.some(e => (e instanceof RegExp ? n.match(e) : n.includes(e))) || x(n);
}
let H = Promise.resolve();
async function Q(e, t) {
  return (
    await H,
    (H = r.storage.local.set({ [e]: t })),
    H.catch(e => {
      (x(e), console.error('Failed to store data'), console.log(t));
    })
  );
}
function Y(e) {
  return r.storage.local.get(e).then(t => t?.[e]);
}
async function X() {
  const e = await r.commands.getAll();
  return e && e[0] ? e[0].shortcut : '';
}
let J = !1,
  Z = !1;
const ee = r.tabs.query({}).then(e => e.map(e => e.id.toString()));
async function te(e) {
  let t = !1;
  const n = await ee;
  for (const r in e) n.includes(r) || (delete e[r], (t = !0));
  return { data: e, isUpdated: t };
}
async function ne(e, t) {
  return !!(await O(e, { type: 'isAlive' }, { frameId: t }));
}
function re(e, t) {
  let n = null;
  return function (...r) {
    (n && clearTimeout(n),
      (n = setTimeout(() => {
        ((n = null), e(...r));
      }, t)));
  };
}
let ie = [];
function se(e) {
  ie.push(e);
}
async function oe(e, t) {
  if (!e) return;
  const n = await N();
  if (n && e === n.id) for (const r of ie) r({ tabId: e, tab: n, event: t });
}
(r.tabs.onActivated.addListener(e => {
  oe(e.tabId, 'active');
}),
  r.tabs.onUpdated.addListener((e, t, n) => {
    oe(e, 'update');
  }),
  r.windows.onFocusChanged.addListener(function () {
    r.tabs.query({ currentWindow: !0, active: !0 }, function (e) {
      1 === e.length && oe(e[0].id, 'window');
    });
  }));
const ae = function (e) {
    const t = [];
    let n = 0;
    for (let r = 0; r < e.length; r++) {
      let i = e.charCodeAt(r);
      i < 128
        ? (t[n++] = i)
        : i < 2048
          ? ((t[n++] = (i >> 6) | 192), (t[n++] = (63 & i) | 128))
          : 55296 == (64512 & i) && r + 1 < e.length && 56320 == (64512 & e.charCodeAt(r + 1))
            ? ((i = 65536 + ((1023 & i) << 10) + (1023 & e.charCodeAt(++r))),
              (t[n++] = (i >> 18) | 240),
              (t[n++] = ((i >> 12) & 63) | 128),
              (t[n++] = ((i >> 6) & 63) | 128),
              (t[n++] = (63 & i) | 128))
            : ((t[n++] = (i >> 12) | 224),
              (t[n++] = ((i >> 6) & 63) | 128),
              (t[n++] = (63 & i) | 128));
    }
    return t;
  },
  ce = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + '+/=';
    },
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + '-_.';
    },
    HAS_NATIVE_SUPPORT: 'function' == typeof atob,
    encodeByteArray(e, t) {
      if (!Array.isArray(e)) throw Error('encodeByteArray takes an array as a parameter');
      this.init_();
      const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
        r = [];
      for (let t = 0; t < e.length; t += 3) {
        const i = e[t],
          s = t + 1 < e.length,
          o = s ? e[t + 1] : 0,
          a = t + 2 < e.length,
          c = a ? e[t + 2] : 0,
          u = i >> 2,
          l = ((3 & i) << 4) | (o >> 4);
        let h = ((15 & o) << 2) | (c >> 6),
          d = 63 & c;
        (a || ((d = 64), s || (h = 64)), r.push(n[u], n[l], n[h], n[d]));
      }
      return r.join('');
    },
    encodeString(e, t) {
      return this.HAS_NATIVE_SUPPORT && !t ? btoa(e) : this.encodeByteArray(ae(e), t);
    },
    decodeString(e, t) {
      return this.HAS_NATIVE_SUPPORT && !t
        ? atob(e)
        : (function (e) {
            const t = [];
            let n = 0,
              r = 0;
            for (; n < e.length; ) {
              const i = e[n++];
              if (i < 128) t[r++] = String.fromCharCode(i);
              else if (i > 191 && i < 224) {
                const s = e[n++];
                t[r++] = String.fromCharCode(((31 & i) << 6) | (63 & s));
              } else if (i > 239 && i < 365) {
                const s =
                  (((7 & i) << 18) | ((63 & e[n++]) << 12) | ((63 & e[n++]) << 6) | (63 & e[n++])) -
                  65536;
                ((t[r++] = String.fromCharCode(55296 + (s >> 10))),
                  (t[r++] = String.fromCharCode(56320 + (1023 & s))));
              } else {
                const s = e[n++],
                  o = e[n++];
                t[r++] = String.fromCharCode(((15 & i) << 12) | ((63 & s) << 6) | (63 & o));
              }
            }
            return t.join('');
          })(this.decodeStringToByteArray(e, t));
    },
    decodeStringToByteArray(e, t) {
      this.init_();
      const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
        r = [];
      for (let t = 0; t < e.length; ) {
        const i = n[e.charAt(t++)],
          s = t < e.length ? n[e.charAt(t)] : 0;
        ++t;
        const o = t < e.length ? n[e.charAt(t)] : 64;
        ++t;
        const a = t < e.length ? n[e.charAt(t)] : 64;
        if ((++t, null == i || null == s || null == o || null == a)) throw new ue();
        const c = (i << 2) | (s >> 4);
        if ((r.push(c), 64 !== o)) {
          const e = ((s << 4) & 240) | (o >> 2);
          if ((r.push(e), 64 !== a)) {
            const e = ((o << 6) & 192) | a;
            r.push(e);
          }
        }
      }
      return r;
    },
    init_() {
      if (!this.byteToCharMap_) {
        ((this.byteToCharMap_ = {}),
          (this.charToByteMap_ = {}),
          (this.byteToCharMapWebSafe_ = {}),
          (this.charToByteMapWebSafe_ = {}));
        for (let e = 0; e < this.ENCODED_VALS.length; e++)
          ((this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
            (this.charToByteMap_[this.byteToCharMap_[e]] = e),
            (this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e)),
            (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e),
            e >= this.ENCODED_VALS_BASE.length &&
              ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e),
              (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e)));
      }
    },
  };
class ue extends Error {
  constructor() {
    (super(...arguments), (this.name = 'DecodeBase64StringError'));
  }
}
const le = function (e) {
    return (function (e) {
      const t = ae(e);
      return ce.encodeByteArray(t, !0);
    })(e).replace(/\./g, '');
  },
  he = function (e) {
    try {
      return ce.decodeString(e, !0);
    } catch (e) {
      console.error('base64Decode failed: ', e);
    }
    return null;
  },
  de = () => {
    try {
      return (
        (function () {
          if ('undefined' != typeof self) return self;
          if ('undefined' != typeof window) return window;
          if (void 0 !== t.g) return t.g;
          throw new Error('Unable to locate global object.');
        })().__FIREBASE_DEFAULTS__ ||
        (() => {
          if ('undefined' == typeof process || void 0 === process.env) return;
          const e = process.env.__FIREBASE_DEFAULTS__;
          return e ? JSON.parse(e) : void 0;
        })() ||
        (() => {
          if ('undefined' == typeof document) return;
          let e;
          try {
            e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
          } catch (e) {
            return;
          }
          const t = e && he(e[1]);
          return t && JSON.parse(t);
        })()
      );
    } catch (e) {
      return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
    }
  },
  fe = e => {
    var t, n;
    return null === (n = null === (t = de()) || void 0 === t ? void 0 : t.emulatorHosts) ||
      void 0 === n
      ? void 0
      : n[e];
  },
  pe = () => {
    var e;
    return null === (e = de()) || void 0 === e ? void 0 : e.config;
  };
class ge {
  constructor() {
    ((this.reject = () => {}),
      (this.resolve = () => {}),
      (this.promise = new Promise((e, t) => {
        ((this.resolve = e), (this.reject = t));
      })));
  }
  wrapCallback(e) {
    return (t, n) => {
      (t ? this.reject(t) : this.resolve(n),
        'function' == typeof e && (this.promise.catch(() => {}), 1 === e.length ? e(t) : e(t, n)));
    };
  }
}
function me() {
  return 'undefined' != typeof navigator && 'string' == typeof navigator.userAgent
    ? navigator.userAgent
    : '';
}
function ye() {
  return (
    !(function () {
      var e;
      const n = null === (e = de()) || void 0 === e ? void 0 : e.forceEnvironment;
      if ('node' === n) return !0;
      if ('browser' === n) return !1;
      try {
        return '[object process]' === Object.prototype.toString.call(t.g.process);
      } catch (e) {
        return !1;
      }
    })() &&
    !!navigator.userAgent &&
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  );
}
function we() {
  try {
    return 'object' == typeof indexedDB;
  } catch (e) {
    return !1;
  }
}
class ve extends Error {
  constructor(e, t, n) {
    (super(t),
      (this.code = e),
      (this.customData = n),
      (this.name = 'FirebaseError'),
      Object.setPrototypeOf(this, ve.prototype),
      Error.captureStackTrace && Error.captureStackTrace(this, be.prototype.create));
  }
}
class be {
  constructor(e, t, n) {
    ((this.service = e), (this.serviceName = t), (this.errors = n));
  }
  create(e, ...t) {
    const n = t[0] || {},
      r = `${this.service}/${e}`,
      i = this.errors[e],
      s = i
        ? (function (e, t) {
            return e.replace(Ie, (e, n) => {
              const r = t[n];
              return null != r ? String(r) : `<${n}?>`;
            });
          })(i, n)
        : 'Error',
      o = `${this.serviceName}: ${s} (${r}).`;
    return new ve(r, o, n);
  }
}
const Ie = /\{\$([^}]+)}/g;
function Te(e, t) {
  if (e === t) return !0;
  const n = Object.keys(e),
    r = Object.keys(t);
  for (const i of n) {
    if (!r.includes(i)) return !1;
    const n = e[i],
      s = t[i];
    if (_e(n) && _e(s)) {
      if (!Te(n, s)) return !1;
    } else if (n !== s) return !1;
  }
  for (const e of r) if (!n.includes(e)) return !1;
  return !0;
}
function _e(e) {
  return null !== e && 'object' == typeof e;
}
function Ee(e) {
  const t = [];
  for (const [n, r] of Object.entries(e))
    Array.isArray(r)
      ? r.forEach(e => {
          t.push(encodeURIComponent(n) + '=' + encodeURIComponent(e));
        })
      : t.push(encodeURIComponent(n) + '=' + encodeURIComponent(r));
  return t.length ? '&' + t.join('&') : '';
}
function Se(e) {
  const t = {};
  return (
    e
      .replace(/^\?/, '')
      .split('&')
      .forEach(e => {
        if (e) {
          const [n, r] = e.split('=');
          t[decodeURIComponent(n)] = decodeURIComponent(r);
        }
      }),
    t
  );
}
function Ce(e) {
  const t = e.indexOf('?');
  if (!t) return '';
  const n = e.indexOf('#', t);
  return e.substring(t, n > 0 ? n : void 0);
}
class Ae {
  constructor(e, t) {
    ((this.observers = []),
      (this.unsubscribes = []),
      (this.observerCount = 0),
      (this.task = Promise.resolve()),
      (this.finalized = !1),
      (this.onNoObservers = t),
      this.task
        .then(() => {
          e(this);
        })
        .catch(e => {
          this.error(e);
        }));
  }
  next(e) {
    this.forEachObserver(t => {
      t.next(e);
    });
  }
  error(e) {
    (this.forEachObserver(t => {
      t.error(e);
    }),
      this.close(e));
  }
  complete() {
    (this.forEachObserver(e => {
      e.complete();
    }),
      this.close());
  }
  subscribe(e, t, n) {
    let r;
    if (void 0 === e && void 0 === t && void 0 === n) throw new Error('Missing Observer.');
    ((r = (function (e, t) {
      if ('object' != typeof e || null === e) return !1;
      for (const t of ['next', 'error', 'complete'])
        if (t in e && 'function' == typeof e[t]) return !0;
      return !1;
    })(e)
      ? e
      : { next: e, error: t, complete: n }),
      void 0 === r.next && (r.next = ke),
      void 0 === r.error && (r.error = ke),
      void 0 === r.complete && (r.complete = ke));
    const i = this.unsubscribeOne.bind(this, this.observers.length);
    return (
      this.finalized &&
        this.task.then(() => {
          try {
            this.finalError ? r.error(this.finalError) : r.complete();
          } catch (e) {}
        }),
      this.observers.push(r),
      i
    );
  }
  unsubscribeOne(e) {
    void 0 !== this.observers &&
      void 0 !== this.observers[e] &&
      (delete this.observers[e],
      (this.observerCount -= 1),
      0 === this.observerCount && void 0 !== this.onNoObservers && this.onNoObservers(this));
  }
  forEachObserver(e) {
    if (!this.finalized) for (let t = 0; t < this.observers.length; t++) this.sendOne(t, e);
  }
  sendOne(e, t) {
    this.task.then(() => {
      if (void 0 !== this.observers && void 0 !== this.observers[e])
        try {
          t(this.observers[e]);
        } catch (e) {
          'undefined' != typeof console && console.error && console.error(e);
        }
    });
  }
  close(e) {
    this.finalized ||
      ((this.finalized = !0),
      void 0 !== e && (this.finalError = e),
      this.task.then(() => {
        ((this.observers = void 0), (this.onNoObservers = void 0));
      }));
  }
}
function ke() {}
function De(e) {
  return e && e._delegate ? e._delegate : e;
}
class xe {
  constructor(e, t, n) {
    ((this.name = e),
      (this.instanceFactory = t),
      (this.type = n),
      (this.multipleInstances = !1),
      (this.serviceProps = {}),
      (this.instantiationMode = 'LAZY'),
      (this.onInstanceCreated = null));
  }
  setInstantiationMode(e) {
    return ((this.instantiationMode = e), this);
  }
  setMultipleInstances(e) {
    return ((this.multipleInstances = e), this);
  }
  setServiceProps(e) {
    return ((this.serviceProps = e), this);
  }
  setInstanceCreatedCallback(e) {
    return ((this.onInstanceCreated = e), this);
  }
}
class Ne {
  constructor(e, t) {
    ((this.name = e),
      (this.container = t),
      (this.component = null),
      (this.instances = new Map()),
      (this.instancesDeferred = new Map()),
      (this.instancesOptions = new Map()),
      (this.onInitCallbacks = new Map()));
  }
  get(e) {
    const t = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(t)) {
      const e = new ge();
      if ((this.instancesDeferred.set(t, e), this.isInitialized(t) || this.shouldAutoInitialize()))
        try {
          const n = this.getOrInitializeService({ instanceIdentifier: t });
          n && e.resolve(n);
        } catch (e) {}
    }
    return this.instancesDeferred.get(t).promise;
  }
  getImmediate(e) {
    var t;
    const n = this.normalizeInstanceIdentifier(null == e ? void 0 : e.identifier),
      r = null !== (t = null == e ? void 0 : e.optional) && void 0 !== t && t;
    if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
      if (r) return null;
      throw Error(`Service ${this.name} is not available`);
    }
    try {
      return this.getOrInitializeService({ instanceIdentifier: n });
    } catch (e) {
      if (r) return null;
      throw e;
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(e) {
    if (e.name !== this.name)
      throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
    if (this.component) throw Error(`Component for ${this.name} has already been provided`);
    if (((this.component = e), this.shouldAutoInitialize())) {
      if (
        (function (e) {
          return 'EAGER' === e.instantiationMode;
        })(e)
      )
        try {
          this.getOrInitializeService({ instanceIdentifier: '[DEFAULT]' });
        } catch (e) {}
      for (const [e, t] of this.instancesDeferred.entries()) {
        const n = this.normalizeInstanceIdentifier(e);
        try {
          const e = this.getOrInitializeService({ instanceIdentifier: n });
          t.resolve(e);
        } catch (e) {}
      }
    }
  }
  clearInstance(e = '[DEFAULT]') {
    (this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e));
  }
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([
      ...e.filter(e => 'INTERNAL' in e).map(e => e.INTERNAL.delete()),
      ...e.filter(e => '_delete' in e).map(e => e._delete()),
    ]);
  }
  isComponentSet() {
    return null != this.component;
  }
  isInitialized(e = '[DEFAULT]') {
    return this.instances.has(e);
  }
  getOptions(e = '[DEFAULT]') {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const { options: t = {} } = e,
      n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(n)) throw Error(`${this.name}(${n}) has already been initialized`);
    if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
    const r = this.getOrInitializeService({ instanceIdentifier: n, options: t });
    for (const [e, t] of this.instancesDeferred.entries())
      n === this.normalizeInstanceIdentifier(e) && t.resolve(r);
    return r;
  }
  onInit(e, t) {
    var n;
    const r = this.normalizeInstanceIdentifier(t),
      i = null !== (n = this.onInitCallbacks.get(r)) && void 0 !== n ? n : new Set();
    (i.add(e), this.onInitCallbacks.set(r, i));
    const s = this.instances.get(r);
    return (
      s && e(s, r),
      () => {
        i.delete(e);
      }
    );
  }
  invokeOnInitCallbacks(e, t) {
    const n = this.onInitCallbacks.get(t);
    if (n)
      for (const r of n)
        try {
          r(e, t);
        } catch (e) {}
  }
  getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
    let n = this.instances.get(e);
    if (
      !n &&
      this.component &&
      ((n = this.component.instanceFactory(this.container, {
        instanceIdentifier: ((r = e), '[DEFAULT]' === r ? void 0 : r),
        options: t,
      })),
      this.instances.set(e, n),
      this.instancesOptions.set(e, t),
      this.invokeOnInitCallbacks(n, e),
      this.component.onInstanceCreated)
    )
      try {
        this.component.onInstanceCreated(this.container, e, n);
      } catch (e) {}
    var r;
    return n || null;
  }
  normalizeInstanceIdentifier(e = '[DEFAULT]') {
    return this.component ? (this.component.multipleInstances ? e : '[DEFAULT]') : e;
  }
  shouldAutoInitialize() {
    return !!this.component && 'EXPLICIT' !== this.component.instantiationMode;
  }
}
class Oe {
  constructor(e) {
    ((this.name = e), (this.providers = new Map()));
  }
  addComponent(e) {
    const t = this.getProvider(e.name);
    if (t.isComponentSet())
      throw new Error(`Component ${e.name} has already been registered with ${this.name}`);
    t.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    (this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name),
      this.addComponent(e));
  }
  getProvider(e) {
    if (this.providers.has(e)) return this.providers.get(e);
    const t = new Ne(e, this);
    return (this.providers.set(e, t), t);
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
const Re = [];
var Pe;
!(function (e) {
  ((e[(e.DEBUG = 0)] = 'DEBUG'),
    (e[(e.VERBOSE = 1)] = 'VERBOSE'),
    (e[(e.INFO = 2)] = 'INFO'),
    (e[(e.WARN = 3)] = 'WARN'),
    (e[(e.ERROR = 4)] = 'ERROR'),
    (e[(e.SILENT = 5)] = 'SILENT'));
})(Pe || (Pe = {}));
const Me = {
    debug: Pe.DEBUG,
    verbose: Pe.VERBOSE,
    info: Pe.INFO,
    warn: Pe.WARN,
    error: Pe.ERROR,
    silent: Pe.SILENT,
  },
  Le = Pe.INFO,
  Fe = {
    [Pe.DEBUG]: 'log',
    [Pe.VERBOSE]: 'log',
    [Pe.INFO]: 'info',
    [Pe.WARN]: 'warn',
    [Pe.ERROR]: 'error',
  },
  Ue = (e, t, ...n) => {
    if (t < e.logLevel) return;
    const r = new Date().toISOString(),
      i = Fe[t];
    if (!i) throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);
    console[i](`[${r}]  ${e.name}:`, ...n);
  };
class Ve {
  constructor(e) {
    ((this.name = e),
      (this._logLevel = Le),
      (this._logHandler = Ue),
      (this._userLogHandler = null),
      Re.push(this));
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(e) {
    if (!(e in Pe)) throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
    this._logLevel = e;
  }
  setLogLevel(e) {
    this._logLevel = 'string' == typeof e ? Me[e] : e;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(e) {
    if ('function' != typeof e)
      throw new TypeError('Value assigned to `logHandler` must be a function');
    this._logHandler = e;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(e) {
    this._userLogHandler = e;
  }
  debug(...e) {
    (this._userLogHandler && this._userLogHandler(this, Pe.DEBUG, ...e),
      this._logHandler(this, Pe.DEBUG, ...e));
  }
  log(...e) {
    (this._userLogHandler && this._userLogHandler(this, Pe.VERBOSE, ...e),
      this._logHandler(this, Pe.VERBOSE, ...e));
  }
  info(...e) {
    (this._userLogHandler && this._userLogHandler(this, Pe.INFO, ...e),
      this._logHandler(this, Pe.INFO, ...e));
  }
  warn(...e) {
    (this._userLogHandler && this._userLogHandler(this, Pe.WARN, ...e),
      this._logHandler(this, Pe.WARN, ...e));
  }
  error(...e) {
    (this._userLogHandler && this._userLogHandler(this, Pe.ERROR, ...e),
      this._logHandler(this, Pe.ERROR, ...e));
  }
}
let Be, je;
const ze = new WeakMap(),
  qe = new WeakMap(),
  Ge = new WeakMap(),
  $e = new WeakMap(),
  Ke = new WeakMap();
let We = {
  get(e, t, n) {
    if (e instanceof IDBTransaction) {
      if ('done' === t) return qe.get(e);
      if ('objectStoreNames' === t) return e.objectStoreNames || Ge.get(e);
      if ('store' === t)
        return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
    }
    return Qe(e[t]);
  },
  set: (e, t, n) => ((e[t] = n), !0),
  has: (e, t) => (e instanceof IDBTransaction && ('done' === t || 'store' === t)) || t in e,
};
function He(e) {
  return 'function' == typeof e
    ? (t = e) !== IDBDatabase.prototype.transaction ||
      'objectStoreNames' in IDBTransaction.prototype
      ? (
          je ||
          (je = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
          ])
        ).includes(t)
        ? function (...e) {
            return (t.apply(Ye(this), e), Qe(ze.get(this)));
          }
        : function (...e) {
            return Qe(t.apply(Ye(this), e));
          }
      : function (e, ...n) {
          const r = t.call(Ye(this), e, ...n);
          return (Ge.set(r, e.sort ? e.sort() : [e]), Qe(r));
        }
    : (e instanceof IDBTransaction &&
        (function (e) {
          if (qe.has(e)) return;
          const t = new Promise((t, n) => {
            const r = () => {
                (e.removeEventListener('complete', i),
                  e.removeEventListener('error', s),
                  e.removeEventListener('abort', s));
              },
              i = () => {
                (t(), r());
              },
              s = () => {
                (n(e.error || new DOMException('AbortError', 'AbortError')), r());
              };
            (e.addEventListener('complete', i),
              e.addEventListener('error', s),
              e.addEventListener('abort', s));
          });
          qe.set(e, t);
        })(e),
      (n = e),
      (Be || (Be = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])).some(
        e => n instanceof e
      )
        ? new Proxy(e, We)
        : e);
  var t, n;
}
function Qe(e) {
  if (e instanceof IDBRequest)
    return (function (e) {
      const t = new Promise((t, n) => {
        const r = () => {
            (e.removeEventListener('success', i), e.removeEventListener('error', s));
          },
          i = () => {
            (t(Qe(e.result)), r());
          },
          s = () => {
            (n(e.error), r());
          };
        (e.addEventListener('success', i), e.addEventListener('error', s));
      });
      return (
        t
          .then(t => {
            t instanceof IDBCursor && ze.set(t, e);
          })
          .catch(() => {}),
        Ke.set(t, e),
        t
      );
    })(e);
  if ($e.has(e)) return $e.get(e);
  const t = He(e);
  return (t !== e && ($e.set(e, t), Ke.set(t, e)), t);
}
const Ye = e => Ke.get(e),
  Xe = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
  Je = ['put', 'add', 'delete', 'clear'],
  Ze = new Map();
function et(e, t) {
  if (!(e instanceof IDBDatabase) || t in e || 'string' != typeof t) return;
  if (Ze.get(t)) return Ze.get(t);
  const n = t.replace(/FromIndex$/, ''),
    r = t !== n,
    i = Je.includes(n);
  if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || (!i && !Xe.includes(n))) return;
  const s = async function (e, ...t) {
    const s = this.transaction(e, i ? 'readwrite' : 'readonly');
    let o = s.store;
    return (r && (o = o.index(t.shift())), (await Promise.all([o[n](...t), i && s.done]))[0]);
  };
  return (Ze.set(t, s), s);
}
var tt;
((tt = We),
  (We = {
    ...tt,
    get: (e, t, n) => et(e, t) || tt.get(e, t, n),
    has: (e, t) => !!et(e, t) || tt.has(e, t),
  }));
class nt {
  constructor(e) {
    this.container = e;
  }
  getPlatformInfoString() {
    return this.container
      .getProviders()
      .map(e => {
        if (
          (function (e) {
            const t = e.getComponent();
            return 'VERSION' === (null == t ? void 0 : t.type);
          })(e)
        ) {
          const t = e.getImmediate();
          return `${t.library}/${t.version}`;
        }
        return null;
      })
      .filter(e => e)
      .join(' ');
  }
}
const rt = '@firebase/app',
  it = new Ve('@firebase/app'),
  st = {
    [rt]: 'fire-core',
    '@firebase/app-compat': 'fire-core-compat',
    '@firebase/analytics': 'fire-analytics',
    '@firebase/analytics-compat': 'fire-analytics-compat',
    '@firebase/app-check': 'fire-app-check',
    '@firebase/app-check-compat': 'fire-app-check-compat',
    '@firebase/auth': 'fire-auth',
    '@firebase/auth-compat': 'fire-auth-compat',
    '@firebase/database': 'fire-rtdb',
    '@firebase/database-compat': 'fire-rtdb-compat',
    '@firebase/functions': 'fire-fn',
    '@firebase/functions-compat': 'fire-fn-compat',
    '@firebase/installations': 'fire-iid',
    '@firebase/installations-compat': 'fire-iid-compat',
    '@firebase/messaging': 'fire-fcm',
    '@firebase/messaging-compat': 'fire-fcm-compat',
    '@firebase/performance': 'fire-perf',
    '@firebase/performance-compat': 'fire-perf-compat',
    '@firebase/remote-config': 'fire-rc',
    '@firebase/remote-config-compat': 'fire-rc-compat',
    '@firebase/storage': 'fire-gcs',
    '@firebase/storage-compat': 'fire-gcs-compat',
    '@firebase/firestore': 'fire-fst',
    '@firebase/firestore-compat': 'fire-fst-compat',
    'fire-js': 'fire-js',
    firebase: 'fire-js-all',
  },
  ot = new Map(),
  at = new Map(),
  ct = new Map();
function ut(e, t) {
  try {
    e.container.addComponent(t);
  } catch (n) {
    it.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`, n);
  }
}
function lt(e) {
  const t = e.name;
  if (ct.has(t)) return (it.debug(`There were multiple attempts to register component ${t}.`), !1);
  ct.set(t, e);
  for (const t of ot.values()) ut(t, e);
  for (const t of at.values()) ut(t, e);
  return !0;
}
function ht(e, t) {
  const n = e.container.getProvider('heartbeat').getImmediate({ optional: !0 });
  return (n && n.triggerHeartbeat(), e.container.getProvider(t));
}
function dt(e) {
  return void 0 !== e.settings;
}
const ft = new be('app', 'Firebase', {
  'no-app': "No Firebase App '{$appName}' has been created - call initializeApp() first",
  'bad-app-name': "Illegal App name: '{$appName}'",
  'duplicate-app':
    "Firebase App named '{$appName}' already exists with different options or config",
  'app-deleted': "Firebase App named '{$appName}' already deleted",
  'server-app-deleted': 'Firebase Server App has been deleted',
  'no-options': 'Need to provide options, when not being deployed to hosting via source.',
  'invalid-app-argument':
    'firebase.{$appName}() takes either no argument or a Firebase App instance.',
  'invalid-log-argument': 'First argument to `onLog` must be null or a function.',
  'idb-open': 'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
  'idb-get': 'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
  'idb-set': 'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
  'idb-delete':
    'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.',
  'finalization-registry-not-supported':
    'FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.',
  'invalid-server-app-environment': 'FirebaseServerApp is not for use in browser environments.',
});
class pt {
  constructor(e, t, n) {
    ((this._isDeleted = !1),
      (this._options = Object.assign({}, e)),
      (this._config = Object.assign({}, t)),
      (this._name = t.name),
      (this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled),
      (this._container = n),
      this.container.addComponent(new xe('app', () => this, 'PUBLIC')));
  }
  get automaticDataCollectionEnabled() {
    return (this.checkDestroyed(), this._automaticDataCollectionEnabled);
  }
  set automaticDataCollectionEnabled(e) {
    (this.checkDestroyed(), (this._automaticDataCollectionEnabled = e));
  }
  get name() {
    return (this.checkDestroyed(), this._name);
  }
  get options() {
    return (this.checkDestroyed(), this._options);
  }
  get config() {
    return (this.checkDestroyed(), this._config);
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(e) {
    this._isDeleted = e;
  }
  checkDestroyed() {
    if (this.isDeleted) throw ft.create('app-deleted', { appName: this._name });
  }
}
function gt(e, t = {}) {
  let n = e;
  'object' != typeof t && (t = { name: t });
  const r = Object.assign({ name: '[DEFAULT]', automaticDataCollectionEnabled: !1 }, t),
    i = r.name;
  if ('string' != typeof i || !i) throw ft.create('bad-app-name', { appName: String(i) });
  if ((n || (n = pe()), !n)) throw ft.create('no-options');
  const s = ot.get(i);
  if (s) {
    if (Te(n, s.options) && Te(r, s.config)) return s;
    throw ft.create('duplicate-app', { appName: i });
  }
  const o = new Oe(i);
  for (const e of ct.values()) o.addComponent(e);
  const a = new pt(n, r, o);
  return (ot.set(i, a), a);
}
function mt(e = '[DEFAULT]') {
  const t = ot.get(e);
  if (!t && '[DEFAULT]' === e && pe()) return gt();
  if (!t) throw ft.create('no-app', { appName: e });
  return t;
}
function yt(e, t, n) {
  var r;
  let i = null !== (r = st[e]) && void 0 !== r ? r : e;
  n && (i += `-${n}`);
  const s = i.match(/\s|\//),
    o = t.match(/\s|\//);
  if (s || o) {
    const e = [`Unable to register library "${i}" with version "${t}":`];
    return (
      s && e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),
      s && o && e.push('and'),
      o && e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),
      void it.warn(e.join(' '))
    );
  }
  lt(new xe(`${i}-version`, () => ({ library: i, version: t }), 'VERSION'));
}
const wt = 'firebase-heartbeat-store';
let vt = null;
function bt() {
  return (
    vt ||
      (vt = (function (e, t, { blocked: n, upgrade: r, blocking: i, terminated: s } = {}) {
        const o = indexedDB.open(e, t),
          a = Qe(o);
        return (
          r &&
            o.addEventListener('upgradeneeded', e => {
              r(Qe(o.result), e.oldVersion, e.newVersion, Qe(o.transaction), e);
            }),
          n && o.addEventListener('blocked', e => n(e.oldVersion, e.newVersion, e)),
          a
            .then(e => {
              (s && e.addEventListener('close', () => s()),
                i && e.addEventListener('versionchange', e => i(e.oldVersion, e.newVersion, e)));
            })
            .catch(() => {}),
          a
        );
      })('firebase-heartbeat-database', 1, {
        upgrade: (e, t) => {
          if (0 === t)
            try {
              e.createObjectStore(wt);
            } catch (e) {
              console.warn(e);
            }
        },
      }).catch(e => {
        throw ft.create('idb-open', { originalErrorMessage: e.message });
      })),
    vt
  );
}
async function It(e, t) {
  try {
    const n = (await bt()).transaction(wt, 'readwrite'),
      r = n.objectStore(wt);
    (await r.put(t, Tt(e)), await n.done);
  } catch (e) {
    if (e instanceof ve) it.warn(e.message);
    else {
      const t = ft.create('idb-set', { originalErrorMessage: null == e ? void 0 : e.message });
      it.warn(t.message);
    }
  }
}
function Tt(e) {
  return `${e.name}!${e.options.appId}`;
}
class _t {
  constructor(e) {
    ((this.container = e), (this._heartbeatsCache = null));
    const t = this.container.getProvider('app').getImmediate();
    ((this._storage = new St(t)),
      (this._heartbeatsCachePromise = this._storage
        .read()
        .then(e => ((this._heartbeatsCache = e), e))));
  }
  async triggerHeartbeat() {
    var e, t;
    const n = this.container.getProvider('platform-logger').getImmediate().getPlatformInfoString(),
      r = Et();
    if (
      (null != (null === (e = this._heartbeatsCache) || void 0 === e ? void 0 : e.heartbeats) ||
        ((this._heartbeatsCache = await this._heartbeatsCachePromise),
        null != (null === (t = this._heartbeatsCache) || void 0 === t ? void 0 : t.heartbeats))) &&
      this._heartbeatsCache.lastSentHeartbeatDate !== r &&
      !this._heartbeatsCache.heartbeats.some(e => e.date === r)
    )
      return (
        this._heartbeatsCache.heartbeats.push({ date: r, agent: n }),
        (this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter(e => {
          const t = new Date(e.date).valueOf();
          return Date.now() - t <= 2592e6;
        })),
        this._storage.overwrite(this._heartbeatsCache)
      );
  }
  async getHeartbeatsHeader() {
    var e;
    if (
      (null === this._heartbeatsCache && (await this._heartbeatsCachePromise),
      null == (null === (e = this._heartbeatsCache) || void 0 === e ? void 0 : e.heartbeats) ||
        0 === this._heartbeatsCache.heartbeats.length)
    )
      return '';
    const t = Et(),
      { heartbeatsToSend: n, unsentEntries: r } = (function (e, t = 1024) {
        const n = [];
        let r = e.slice();
        for (const i of e) {
          const e = n.find(e => e.agent === i.agent);
          if (e) {
            if ((e.dates.push(i.date), Ct(n) > t)) {
              e.dates.pop();
              break;
            }
          } else if ((n.push({ agent: i.agent, dates: [i.date] }), Ct(n) > t)) {
            n.pop();
            break;
          }
          r = r.slice(1);
        }
        return { heartbeatsToSend: n, unsentEntries: r };
      })(this._heartbeatsCache.heartbeats),
      i = le(JSON.stringify({ version: 2, heartbeats: n }));
    return (
      (this._heartbeatsCache.lastSentHeartbeatDate = t),
      r.length > 0
        ? ((this._heartbeatsCache.heartbeats = r),
          await this._storage.overwrite(this._heartbeatsCache))
        : ((this._heartbeatsCache.heartbeats = []), this._storage.overwrite(this._heartbeatsCache)),
      i
    );
  }
}
function Et() {
  return new Date().toISOString().substring(0, 10);
}
class St {
  constructor(e) {
    ((this.app = e), (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck()));
  }
  async runIndexedDBEnvironmentCheck() {
    return (
      !!we() &&
      new Promise((e, t) => {
        try {
          let n = !0;
          const r = 'validate-browser-context-for-indexeddb-analytics-module',
            i = self.indexedDB.open(r);
          ((i.onsuccess = () => {
            (i.result.close(), n || self.indexedDB.deleteDatabase(r), e(!0));
          }),
            (i.onupgradeneeded = () => {
              n = !1;
            }),
            (i.onerror = () => {
              var e;
              t((null === (e = i.error) || void 0 === e ? void 0 : e.message) || '');
            }));
        } catch (e) {
          t(e);
        }
      })
        .then(() => !0)
        .catch(() => !1)
    );
  }
  async read() {
    if (await this._canUseIndexedDBPromise) {
      const e = await (async function (e) {
        try {
          const t = (await bt()).transaction(wt),
            n = await t.objectStore(wt).get(Tt(e));
          return (await t.done, n);
        } catch (e) {
          if (e instanceof ve) it.warn(e.message);
          else {
            const t = ft.create('idb-get', {
              originalErrorMessage: null == e ? void 0 : e.message,
            });
            it.warn(t.message);
          }
        }
      })(this.app);
      return (null == e ? void 0 : e.heartbeats) ? e : { heartbeats: [] };
    }
    return { heartbeats: [] };
  }
  async overwrite(e) {
    var t;
    if (await this._canUseIndexedDBPromise) {
      const n = await this.read();
      return It(this.app, {
        lastSentHeartbeatDate:
          null !== (t = e.lastSentHeartbeatDate) && void 0 !== t ? t : n.lastSentHeartbeatDate,
        heartbeats: e.heartbeats,
      });
    }
  }
  async add(e) {
    var t;
    if (await this._canUseIndexedDBPromise) {
      const n = await this.read();
      return It(this.app, {
        lastSentHeartbeatDate:
          null !== (t = e.lastSentHeartbeatDate) && void 0 !== t ? t : n.lastSentHeartbeatDate,
        heartbeats: [...n.heartbeats, ...e.heartbeats],
      });
    }
  }
}
function Ct(e) {
  return le(JSON.stringify({ version: 2, heartbeats: e })).length;
}
function At(e, t) {
  const n = {};
  for (const r in e) e.hasOwnProperty(r) && (n[r] = t(e[r]));
  return n;
}
function kt(e) {
  if (null == e) return null;
  if ((e instanceof Number && (e = e.valueOf()), 'number' == typeof e && isFinite(e))) return e;
  if (!0 === e || !1 === e) return e;
  if ('[object String]' === Object.prototype.toString.call(e)) return e;
  if (e instanceof Date) return e.toISOString();
  if (Array.isArray(e)) return e.map(e => kt(e));
  if ('function' == typeof e || 'object' == typeof e) return At(e, e => kt(e));
  throw new Error('Data cannot be encoded in JSON: ' + e);
}
function Dt(e) {
  if (null == e) return e;
  if (e['@type'])
    switch (e['@type']) {
      case 'type.googleapis.com/google.protobuf.Int64Value':
      case 'type.googleapis.com/google.protobuf.UInt64Value': {
        const t = Number(e.value);
        if (isNaN(t)) throw new Error('Data cannot be decoded from JSON: ' + e);
        return t;
      }
      default:
        throw new Error('Data cannot be decoded from JSON: ' + e);
    }
  return Array.isArray(e)
    ? e.map(e => Dt(e))
    : 'function' == typeof e || 'object' == typeof e
      ? At(e, e => Dt(e))
      : e;
}
(lt(new xe('platform-logger', e => new nt(e), 'PRIVATE')),
  lt(new xe('heartbeat', e => new _t(e), 'PRIVATE')),
  yt(rt, '0.10.1', ''),
  yt(rt, '0.10.1', 'esm2017'),
  yt('fire-js', ''),
  yt('firebase', '10.11.0', 'app'));
const xt = {
  OK: 'ok',
  CANCELLED: 'cancelled',
  UNKNOWN: 'unknown',
  INVALID_ARGUMENT: 'invalid-argument',
  DEADLINE_EXCEEDED: 'deadline-exceeded',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  PERMISSION_DENIED: 'permission-denied',
  UNAUTHENTICATED: 'unauthenticated',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
  FAILED_PRECONDITION: 'failed-precondition',
  ABORTED: 'aborted',
  OUT_OF_RANGE: 'out-of-range',
  UNIMPLEMENTED: 'unimplemented',
  INTERNAL: 'internal',
  UNAVAILABLE: 'unavailable',
  DATA_LOSS: 'data-loss',
};
class Nt extends ve {
  constructor(e, t, n) {
    (super(`functions/${e}`, t || ''), (this.details = n));
  }
}
class Ot {
  constructor(e, t, n) {
    ((this.auth = null),
      (this.messaging = null),
      (this.appCheck = null),
      (this.auth = e.getImmediate({ optional: !0 })),
      (this.messaging = t.getImmediate({ optional: !0 })),
      this.auth ||
        e.get().then(
          e => (this.auth = e),
          () => {}
        ),
      this.messaging ||
        t.get().then(
          e => (this.messaging = e),
          () => {}
        ),
      this.appCheck ||
        n.get().then(
          e => (this.appCheck = e),
          () => {}
        ));
  }
  async getAuthToken() {
    if (this.auth)
      try {
        const e = await this.auth.getToken();
        return null == e ? void 0 : e.accessToken;
      } catch (e) {
        return;
      }
  }
  async getMessagingToken() {
    if (this.messaging && 'Notification' in self && 'granted' === Notification.permission)
      try {
        return await this.messaging.getToken();
      } catch (e) {
        return;
      }
  }
  async getAppCheckToken(e) {
    if (this.appCheck) {
      const t = e ? await this.appCheck.getLimitedUseToken() : await this.appCheck.getToken();
      return t.error ? null : t.token;
    }
    return null;
  }
  async getContext(e) {
    return {
      authToken: await this.getAuthToken(),
      messagingToken: await this.getMessagingToken(),
      appCheckToken: await this.getAppCheckToken(e),
    };
  }
}
class Rt {
  constructor(e, t, n, r, i = 'us-central1', s) {
    ((this.app = e),
      (this.fetchImpl = s),
      (this.emulatorOrigin = null),
      (this.contextProvider = new Ot(t, n, r)),
      (this.cancelAllRequests = new Promise(e => {
        this.deleteService = () => Promise.resolve(e());
      })));
    try {
      const e = new URL(i);
      ((this.customDomain = e.origin), (this.region = 'us-central1'));
    } catch (e) {
      ((this.customDomain = null), (this.region = i));
    }
  }
  _delete() {
    return this.deleteService();
  }
  _url(e) {
    const t = this.app.options.projectId;
    return null !== this.emulatorOrigin
      ? `${this.emulatorOrigin}/${t}/${this.region}/${e}`
      : null !== this.customDomain
        ? `${this.customDomain}/${e}`
        : `https://${this.region}-${t}.cloudfunctions.net/${e}`;
  }
}
function Pt(e, t, n) {
  return r =>
    (function (e, t, n, r) {
      const i = e._url(t);
      return (async function (e, t, n, r) {
        const i = { data: (n = kt(n)) },
          s = {},
          o = await e.contextProvider.getContext(r.limitedUseAppCheckTokens);
        (o.authToken && (s.Authorization = 'Bearer ' + o.authToken),
          o.messagingToken && (s['Firebase-Instance-ID-Token'] = o.messagingToken),
          null !== o.appCheckToken && (s['X-Firebase-AppCheck'] = o.appCheckToken));
        const a = (function (e) {
            let t = null;
            return {
              promise: new Promise((n, r) => {
                t = setTimeout(() => {
                  r(new Nt('deadline-exceeded', 'deadline-exceeded'));
                }, e);
              }),
              cancel: () => {
                t && clearTimeout(t);
              },
            };
          })(r.timeout || 7e4),
          c = await Promise.race([Mt(t, i, s, e.fetchImpl), a.promise, e.cancelAllRequests]);
        if ((a.cancel(), !c)) throw new Nt('cancelled', 'Firebase Functions instance was deleted.');
        const u = (function (e, t) {
          let n,
            r = (function (e) {
              if (e >= 200 && e < 300) return 'ok';
              switch (e) {
                case 0:
                case 500:
                  return 'internal';
                case 400:
                  return 'invalid-argument';
                case 401:
                  return 'unauthenticated';
                case 403:
                  return 'permission-denied';
                case 404:
                  return 'not-found';
                case 409:
                  return 'aborted';
                case 429:
                  return 'resource-exhausted';
                case 499:
                  return 'cancelled';
                case 501:
                  return 'unimplemented';
                case 503:
                  return 'unavailable';
                case 504:
                  return 'deadline-exceeded';
              }
              return 'unknown';
            })(e),
            i = r;
          try {
            const e = t && t.error;
            if (e) {
              const t = e.status;
              if ('string' == typeof t) {
                if (!xt[t]) return new Nt('internal', 'internal');
                ((r = xt[t]), (i = t));
              }
              const s = e.message;
              ('string' == typeof s && (i = s), (n = e.details), void 0 !== n && (n = Dt(n)));
            }
          } catch (e) {}
          return 'ok' === r ? null : new Nt(r, i, n);
        })(c.status, c.json);
        if (u) throw u;
        if (!c.json) throw new Nt('internal', 'Response is not valid JSON object.');
        let l = c.json.data;
        if ((void 0 === l && (l = c.json.result), void 0 === l))
          throw new Nt('internal', 'Response is missing data field.');
        return { data: Dt(l) };
      })(e, i, n, r);
    })(e, t, r, n || {});
}
async function Mt(e, t, n, r) {
  let i;
  n['Content-Type'] = 'application/json';
  try {
    i = await r(e, { method: 'POST', body: JSON.stringify(t), headers: n });
  } catch (e) {
    return { status: 0, json: null };
  }
  let s = null;
  try {
    s = await i.json();
  } catch (e) {}
  return { status: i.status, json: s };
}
var Lt;
((Lt = fetch.bind(self)),
  lt(
    new xe(
      'functions',
      (e, { instanceIdentifier: t }) => {
        const n = e.getProvider('app').getImmediate(),
          r = e.getProvider('auth-internal'),
          i = e.getProvider('messaging-internal'),
          s = e.getProvider('app-check-internal');
        return new Rt(n, r, i, s, t, Lt);
      },
      'PUBLIC'
    ).setMultipleInstances(!0)
  ),
  yt('@firebase/functions', '0.11.4', void 0),
  yt('@firebase/functions', '0.11.4', 'esm2017'));
var Ft,
  Ut =
    'undefined' != typeof globalThis
      ? globalThis
      : 'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
            ? self
            : {},
  Vt = {},
  Bt = Bt || {},
  jt = Ut || self;
function zt(e) {
  var t = typeof e;
  return (
    'array' == (t = 'object' != t ? t : e ? (Array.isArray(e) ? 'array' : t) : 'null') ||
    ('object' == t && 'number' == typeof e.length)
  );
}
function qt(e) {
  var t = typeof e;
  return ('object' == t && null != e) || 'function' == t;
}
var Gt = 'closure_uid_' + ((1e9 * Math.random()) >>> 0),
  $t = 0;
function Kt(e, t, n) {
  return e.call.apply(e.bind, arguments);
}
function Wt(e, t, n) {
  if (!e) throw Error();
  if (2 < arguments.length) {
    var r = Array.prototype.slice.call(arguments, 2);
    return function () {
      var n = Array.prototype.slice.call(arguments);
      return (Array.prototype.unshift.apply(n, r), e.apply(t, n));
    };
  }
  return function () {
    return e.apply(t, arguments);
  };
}
function Ht(e, t, n) {
  return (Ht =
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf('native code')
      ? Kt
      : Wt).apply(null, arguments);
}
function Qt(e, t) {
  var n = Array.prototype.slice.call(arguments, 1);
  return function () {
    var t = n.slice();
    return (t.push.apply(t, arguments), e.apply(this, t));
  };
}
function Yt(e, t) {
  function n() {}
  ((n.prototype = t.prototype),
    (e.$ = t.prototype),
    (e.prototype = new n()),
    (e.prototype.constructor = e),
    (e.ac = function (e, n, r) {
      for (var i = Array(arguments.length - 2), s = 2; s < arguments.length; s++)
        i[s - 2] = arguments[s];
      return t.prototype[n].apply(e, i);
    }));
}
function Xt() {
  ((this.s = this.s), (this.o = this.o));
}
((Xt.prototype.s = !1),
  (Xt.prototype.sa = function () {
    var e;
    !this.s &&
      ((this.s = !0), this.N(), 0) &&
      ((e = this), (Object.prototype.hasOwnProperty.call(e, Gt) && e[Gt]) || (e[Gt] = ++$t));
  }),
  (Xt.prototype.N = function () {
    if (this.o) for (; this.o.length; ) this.o.shift()();
  }));
const Jt = Array.prototype.indexOf
  ? function (e, t) {
      return Array.prototype.indexOf.call(e, t, void 0);
    }
  : function (e, t) {
      if ('string' == typeof e) return 'string' != typeof t || 1 != t.length ? -1 : e.indexOf(t, 0);
      for (let n = 0; n < e.length; n++) if (n in e && e[n] === t) return n;
      return -1;
    };
function Zt(e) {
  const t = e.length;
  if (0 < t) {
    const n = Array(t);
    for (let r = 0; r < t; r++) n[r] = e[r];
    return n;
  }
  return [];
}
function en(e, t) {
  for (let t = 1; t < arguments.length; t++) {
    const n = arguments[t];
    if (zt(n)) {
      const t = e.length || 0,
        r = n.length || 0;
      e.length = t + r;
      for (let i = 0; i < r; i++) e[t + i] = n[i];
    } else e.push(n);
  }
}
function tn(e, t) {
  ((this.type = e), (this.g = this.target = t), (this.defaultPrevented = !1));
}
tn.prototype.h = function () {
  this.defaultPrevented = !0;
};
var nn = (function () {
  if (!jt.addEventListener || !Object.defineProperty) return !1;
  var e = !1,
    t = Object.defineProperty({}, 'passive', {
      get: function () {
        e = !0;
      },
    });
  try {
    const e = () => {};
    (jt.addEventListener('test', e, t), jt.removeEventListener('test', e, t));
  } catch (e) {}
  return e;
})();
function rn(e) {
  return /^[\s\xa0]*$/.test(e);
}
function sn() {
  var e = jt.navigator;
  return e && (e = e.userAgent) ? e : '';
}
function on(e) {
  return -1 != sn().indexOf(e);
}
function an(e) {
  return (an[' '](e), e);
}
an[' '] = function () {};
var cn,
  un,
  ln,
  hn = on('Opera'),
  dn = on('Trident') || on('MSIE'),
  fn = on('Edge'),
  pn = fn || dn,
  gn =
    on('Gecko') &&
    !(-1 != sn().toLowerCase().indexOf('webkit') && !on('Edge')) &&
    !(on('Trident') || on('MSIE')) &&
    !on('Edge'),
  mn = -1 != sn().toLowerCase().indexOf('webkit') && !on('Edge');
function yn() {
  var e = jt.document;
  return e ? e.documentMode : void 0;
}
e: {
  var wn = '',
    vn =
      ((un = sn()),
      gn
        ? /rv:([^\);]+)(\)|;)/.exec(un)
        : fn
          ? /Edge\/([\d\.]+)/.exec(un)
          : dn
            ? /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(un)
            : mn
              ? /WebKit\/(\S+)/.exec(un)
              : hn
                ? /(?:Version)[ \/]?(\S+)/.exec(un)
                : void 0);
  if ((vn && (wn = vn ? vn[1] : ''), dn)) {
    var bn = yn();
    if (null != bn && bn > parseFloat(wn)) {
      cn = String(bn);
      break e;
    }
  }
  cn = wn;
}
jt.document && dn ? (ln = yn() || parseInt(cn, 10) || void 0) : (ln = void 0);
var In = ln;
function Tn(e, t) {
  if (
    (tn.call(this, e ? e.type : ''),
    (this.relatedTarget = this.g = this.target = null),
    (this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0),
    (this.key = ''),
    (this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1),
    (this.state = null),
    (this.pointerId = 0),
    (this.pointerType = ''),
    (this.i = null),
    e)
  ) {
    var n = (this.type = e.type),
      r = e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : null;
    if (((this.target = e.target || e.srcElement), (this.g = t), (t = e.relatedTarget))) {
      if (gn) {
        e: {
          try {
            an(t.nodeName);
            var i = !0;
            break e;
          } catch (e) {}
          i = !1;
        }
        i || (t = null);
      }
    } else 'mouseover' == n ? (t = e.fromElement) : 'mouseout' == n && (t = e.toElement);
    ((this.relatedTarget = t),
      r
        ? ((this.clientX = void 0 !== r.clientX ? r.clientX : r.pageX),
          (this.clientY = void 0 !== r.clientY ? r.clientY : r.pageY),
          (this.screenX = r.screenX || 0),
          (this.screenY = r.screenY || 0))
        : ((this.clientX = void 0 !== e.clientX ? e.clientX : e.pageX),
          (this.clientY = void 0 !== e.clientY ? e.clientY : e.pageY),
          (this.screenX = e.screenX || 0),
          (this.screenY = e.screenY || 0)),
      (this.button = e.button),
      (this.key = e.key || ''),
      (this.ctrlKey = e.ctrlKey),
      (this.altKey = e.altKey),
      (this.shiftKey = e.shiftKey),
      (this.metaKey = e.metaKey),
      (this.pointerId = e.pointerId || 0),
      (this.pointerType =
        'string' == typeof e.pointerType ? e.pointerType : _n[e.pointerType] || ''),
      (this.state = e.state),
      (this.i = e),
      e.defaultPrevented && Tn.$.h.call(this));
  }
}
Yt(Tn, tn);
var _n = { 2: 'touch', 3: 'pen', 4: 'mouse' };
Tn.prototype.h = function () {
  Tn.$.h.call(this);
  var e = this.i;
  e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
};
var En = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
  Sn = 0;
function Cn(e, t, n, r, i) {
  ((this.listener = e),
    (this.proxy = null),
    (this.src = t),
    (this.type = n),
    (this.capture = !!r),
    (this.la = i),
    (this.key = ++Sn),
    (this.fa = this.ia = !1));
}
function An(e) {
  ((e.fa = !0), (e.listener = null), (e.proxy = null), (e.src = null), (e.la = null));
}
function kn(e, t, n) {
  for (const r in e) t.call(n, e[r], r, e);
}
function Dn(e) {
  const t = {};
  for (const n in e) t[n] = e[n];
  return t;
}
const xn =
  'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(
    ' '
  );
function Nn(e, t) {
  let n, r;
  for (let t = 1; t < arguments.length; t++) {
    for (n in ((r = arguments[t]), r)) e[n] = r[n];
    for (let t = 0; t < xn.length; t++)
      ((n = xn[t]), Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]));
  }
}
function On(e) {
  ((this.src = e), (this.g = {}), (this.h = 0));
}
function Rn(e, t) {
  var n = t.type;
  if (n in e.g) {
    var r,
      i = e.g[n],
      s = Jt(i, t);
    ((r = 0 <= s) && Array.prototype.splice.call(i, s, 1),
      r && (An(t), 0 == e.g[n].length && (delete e.g[n], e.h--)));
  }
}
function Pn(e, t, n, r) {
  for (var i = 0; i < e.length; ++i) {
    var s = e[i];
    if (!s.fa && s.listener == t && s.capture == !!n && s.la == r) return i;
  }
  return -1;
}
On.prototype.add = function (e, t, n, r, i) {
  var s = e.toString();
  (e = this.g[s]) || ((e = this.g[s] = []), this.h++);
  var o = Pn(e, t, r, i);
  return (
    -1 < o
      ? ((t = e[o]), n || (t.ia = !1))
      : (((t = new Cn(t, this.src, s, !!r, i)).ia = n), e.push(t)),
    t
  );
};
var Mn = 'closure_lm_' + ((1e6 * Math.random()) | 0),
  Ln = {};
function Fn(e, t, n, r, i) {
  if (r && r.once) return Vn(e, t, n, r, i);
  if (Array.isArray(t)) {
    for (var s = 0; s < t.length; s++) Fn(e, t[s], n, r, i);
    return null;
  }
  return (
    (n = Kn(n)),
    e && e[En] ? e.O(t, n, qt(r) ? !!r.capture : !!r, i) : Un(e, t, n, !1, r, i)
  );
}
function Un(e, t, n, r, i, s) {
  if (!t) throw Error('Invalid event type');
  var o = qt(i) ? !!i.capture : !!i,
    a = Gn(e);
  if ((a || (e[Mn] = a = new On(e)), (n = a.add(t, n, r, o, s)).proxy)) return n;
  if (
    ((r = (function () {
      const e = qn;
      return function t(n) {
        return e.call(t.src, t.listener, n);
      };
    })()),
    (n.proxy = r),
    (r.src = e),
    (r.listener = n),
    e.addEventListener)
  )
    (nn || (i = o), void 0 === i && (i = !1), e.addEventListener(t.toString(), r, i));
  else if (e.attachEvent) e.attachEvent(zn(t.toString()), r);
  else {
    if (!e.addListener || !e.removeListener)
      throw Error('addEventListener and attachEvent are unavailable.');
    e.addListener(r);
  }
  return n;
}
function Vn(e, t, n, r, i) {
  if (Array.isArray(t)) {
    for (var s = 0; s < t.length; s++) Vn(e, t[s], n, r, i);
    return null;
  }
  return (
    (n = Kn(n)),
    e && e[En] ? e.P(t, n, qt(r) ? !!r.capture : !!r, i) : Un(e, t, n, !0, r, i)
  );
}
function Bn(e, t, n, r, i) {
  if (Array.isArray(t)) for (var s = 0; s < t.length; s++) Bn(e, t[s], n, r, i);
  else
    ((r = qt(r) ? !!r.capture : !!r),
      (n = Kn(n)),
      e && e[En]
        ? ((e = e.i),
          (t = String(t).toString()) in e.g &&
            -1 < (n = Pn((s = e.g[t]), n, r, i)) &&
            (An(s[n]),
            Array.prototype.splice.call(s, n, 1),
            0 == s.length && (delete e.g[t], e.h--)))
        : e &&
          (e = Gn(e)) &&
          ((t = e.g[t.toString()]),
          (e = -1),
          t && (e = Pn(t, n, r, i)),
          (n = -1 < e ? t[e] : null) && jn(n)));
}
function jn(e) {
  if ('number' != typeof e && e && !e.fa) {
    var t = e.src;
    if (t && t[En]) Rn(t.i, e);
    else {
      var n = e.type,
        r = e.proxy;
      (t.removeEventListener
        ? t.removeEventListener(n, r, e.capture)
        : t.detachEvent
          ? t.detachEvent(zn(n), r)
          : t.addListener && t.removeListener && t.removeListener(r),
        (n = Gn(t)) ? (Rn(n, e), 0 == n.h && ((n.src = null), (t[Mn] = null))) : An(e));
    }
  }
}
function zn(e) {
  return e in Ln ? Ln[e] : (Ln[e] = 'on' + e);
}
function qn(e, t) {
  if (e.fa) e = !0;
  else {
    t = new Tn(t, this);
    var n = e.listener,
      r = e.la || e.src;
    (e.ia && jn(e), (e = n.call(r, t)));
  }
  return e;
}
function Gn(e) {
  return (e = e[Mn]) instanceof On ? e : null;
}
var $n = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0);
function Kn(e) {
  return 'function' == typeof e
    ? e
    : (e[$n] ||
        (e[$n] = function (t) {
          return e.handleEvent(t);
        }),
      e[$n]);
}
function Wn() {
  (Xt.call(this), (this.i = new On(this)), (this.S = this), (this.J = null));
}
function Hn(e, t) {
  var n,
    r = e.J;
  if (r) for (n = []; r; r = r.J) n.push(r);
  if (((e = e.S), (r = t.type || t), 'string' == typeof t)) t = new tn(t, e);
  else if (t instanceof tn) t.target = t.target || e;
  else {
    var i = t;
    Nn((t = new tn(r, e)), i);
  }
  if (((i = !0), n))
    for (var s = n.length - 1; 0 <= s; s--) {
      var o = (t.g = n[s]);
      i = Qn(o, r, !0, t) && i;
    }
  if (((i = Qn((o = t.g = e), r, !0, t) && i), (i = Qn(o, r, !1, t) && i), n))
    for (s = 0; s < n.length; s++) i = Qn((o = t.g = n[s]), r, !1, t) && i;
}
function Qn(e, t, n, r) {
  if (!(t = e.i.g[String(t)])) return !0;
  t = t.concat();
  for (var i = !0, s = 0; s < t.length; ++s) {
    var o = t[s];
    if (o && !o.fa && o.capture == n) {
      var a = o.listener,
        c = o.la || o.src;
      (o.ia && Rn(e.i, o), (i = !1 !== a.call(c, r) && i));
    }
  }
  return i && !r.defaultPrevented;
}
(Yt(Wn, Xt),
  (Wn.prototype[En] = !0),
  (Wn.prototype.removeEventListener = function (e, t, n, r) {
    Bn(this, e, t, n, r);
  }),
  (Wn.prototype.N = function () {
    if ((Wn.$.N.call(this), this.i)) {
      var e,
        t = this.i;
      for (e in t.g) {
        for (var n = t.g[e], r = 0; r < n.length; r++) An(n[r]);
        (delete t.g[e], t.h--);
      }
    }
    this.J = null;
  }),
  (Wn.prototype.O = function (e, t, n, r) {
    return this.i.add(String(e), t, !1, n, r);
  }),
  (Wn.prototype.P = function (e, t, n, r) {
    return this.i.add(String(e), t, !0, n, r);
  }));
var Yn = jt.JSON.stringify;
function Xn() {
  var e = ir;
  let t = null;
  return (e.g && ((t = e.g), (e.g = e.g.next), e.g || (e.h = null), (t.next = null)), t);
}
var Jn = new (class {
  constructor(e, t) {
    ((this.i = e), (this.j = t), (this.h = 0), (this.g = null));
  }
  get() {
    let e;
    return (
      0 < this.h ? (this.h--, (e = this.g), (this.g = e.next), (e.next = null)) : (e = this.i()),
      e
    );
  }
})(
  () => new Zn(),
  e => e.reset()
);
class Zn {
  constructor() {
    this.next = this.g = this.h = null;
  }
  set(e, t) {
    ((this.h = e), (this.g = t), (this.next = null));
  }
  reset() {
    this.next = this.g = this.h = null;
  }
}
function er(e) {
  var t = 1;
  e = e.split(':');
  const n = [];
  for (; 0 < t && e.length; ) (n.push(e.shift()), t--);
  return (e.length && n.push(e.join(':')), n);
}
function tr(e) {
  jt.setTimeout(() => {
    throw e;
  }, 0);
}
let nr,
  rr = !1,
  ir = new (class {
    constructor() {
      this.h = this.g = null;
    }
    add(e, t) {
      const n = Jn.get();
      (n.set(e, t), this.h ? (this.h.next = n) : (this.g = n), (this.h = n));
    }
  })(),
  sr = () => {
    const e = jt.Promise.resolve(void 0);
    nr = () => {
      e.then(or);
    };
  };
var or = () => {
  for (var e; (e = Xn()); ) {
    try {
      e.h.call(e.g);
    } catch (e) {
      tr(e);
    }
    var t = Jn;
    (t.j(e), 100 > t.h && (t.h++, (e.next = t.g), (t.g = e)));
  }
  rr = !1;
};
function ar(e, t) {
  (Wn.call(this),
    (this.h = e || 1),
    (this.g = t || jt),
    (this.j = Ht(this.qb, this)),
    (this.l = Date.now()));
}
function cr(e) {
  ((e.ga = !1), e.T && (e.g.clearTimeout(e.T), (e.T = null)));
}
function ur(e, t, n) {
  if ('function' == typeof e) n && (e = Ht(e, n));
  else {
    if (!e || 'function' != typeof e.handleEvent) throw Error('Invalid listener argument');
    e = Ht(e.handleEvent, e);
  }
  return 2147483647 < Number(t) ? -1 : jt.setTimeout(e, t || 0);
}
function lr(e) {
  e.g = ur(() => {
    ((e.g = null), e.i && ((e.i = !1), lr(e)));
  }, e.j);
  const t = e.h;
  ((e.h = null), e.m.apply(null, t));
}
(Yt(ar, Wn),
  ((Ft = ar.prototype).ga = !1),
  (Ft.T = null),
  (Ft.qb = function () {
    if (this.ga) {
      var e = Date.now() - this.l;
      0 < e && e < 0.8 * this.h
        ? (this.T = this.g.setTimeout(this.j, this.h - e))
        : (this.T && (this.g.clearTimeout(this.T), (this.T = null)),
          Hn(this, 'tick'),
          this.ga && (cr(this), this.start()));
    }
  }),
  (Ft.start = function () {
    ((this.ga = !0),
      this.T || ((this.T = this.g.setTimeout(this.j, this.h)), (this.l = Date.now())));
  }),
  (Ft.N = function () {
    (ar.$.N.call(this), cr(this), delete this.g);
  }));
class hr extends Xt {
  constructor(e, t) {
    (super(), (this.m = e), (this.j = t), (this.h = null), (this.i = !1), (this.g = null));
  }
  l(e) {
    ((this.h = arguments), this.g ? (this.i = !0) : lr(this));
  }
  N() {
    (super.N(),
      this.g && (jt.clearTimeout(this.g), (this.g = null), (this.i = !1), (this.h = null)));
  }
}
function dr(e) {
  (Xt.call(this), (this.h = e), (this.g = {}));
}
Yt(dr, Xt);
var fr = [];
function pr(e, t, n, r) {
  Array.isArray(n) || (n && (fr[0] = n.toString()), (n = fr));
  for (var i = 0; i < n.length; i++) {
    var s = Fn(t, n[i], r || e.handleEvent, !1, e.h || e);
    if (!s) break;
    e.g[s.key] = s;
  }
}
function gr(e) {
  (kn(
    e.g,
    function (e, t) {
      this.g.hasOwnProperty(t) && jn(e);
    },
    e
  ),
    (e.g = {}));
}
function mr() {
  this.g = !0;
}
function yr(e, t, n, r) {
  e.info(function () {
    return (
      'XMLHTTP TEXT (' +
      t +
      '): ' +
      (function (e, t) {
        if (!e.g) return t;
        if (!t) return null;
        try {
          var n = JSON.parse(t);
          if (n)
            for (e = 0; e < n.length; e++)
              if (Array.isArray(n[e])) {
                var r = n[e];
                if (!(2 > r.length)) {
                  var i = r[1];
                  if (Array.isArray(i) && !(1 > i.length)) {
                    var s = i[0];
                    if ('noop' != s && 'stop' != s && 'close' != s)
                      for (var o = 1; o < i.length; o++) i[o] = '';
                  }
                }
              }
          return Yn(n);
        } catch (e) {
          return t;
        }
      })(e, n) +
      (r ? ' ' + r : '')
    );
  });
}
((dr.prototype.N = function () {
  (dr.$.N.call(this), gr(this));
}),
  (dr.prototype.handleEvent = function () {
    throw Error('EventHandler.handleEvent not implemented');
  }),
  (mr.prototype.Ea = function () {
    this.g = !1;
  }),
  (mr.prototype.info = function () {}));
var wr = {},
  vr = null;
function br() {
  return (vr = vr || new Wn());
}
function Ir(e) {
  tn.call(this, wr.Ta, e);
}
function Tr(e) {
  const t = br();
  Hn(t, new Ir(t));
}
function _r(e, t) {
  (tn.call(this, wr.STAT_EVENT, e), (this.stat = t));
}
function Er(e) {
  const t = br();
  Hn(t, new _r(t, e));
}
function Sr(e, t) {
  (tn.call(this, wr.Ua, e), (this.size = t));
}
function Cr(e, t) {
  if ('function' != typeof e) throw Error('Fn must not be null and must be a function');
  return jt.setTimeout(function () {
    e();
  }, t);
}
((wr.Ta = 'serverreachability'),
  Yt(Ir, tn),
  (wr.STAT_EVENT = 'statevent'),
  Yt(_r, tn),
  (wr.Ua = 'timingevent'),
  Yt(Sr, tn));
var Ar = { NO_ERROR: 0, rb: 1, Eb: 2, Db: 3, yb: 4, Cb: 5, Fb: 6, Qa: 7, TIMEOUT: 8, Ib: 9 },
  kr = {
    wb: 'complete',
    Sb: 'success',
    Ra: 'error',
    Qa: 'abort',
    Kb: 'ready',
    Lb: 'readystatechange',
    TIMEOUT: 'timeout',
    Gb: 'incrementaldata',
    Jb: 'progress',
    zb: 'downloadprogress',
    $b: 'uploadprogress',
  };
function Dr() {}
function xr(e) {
  return e.h || (e.h = e.i());
}
function Nr() {}
Dr.prototype.h = null;
var Or,
  Rr = { OPEN: 'a', vb: 'b', Ra: 'c', Hb: 'd' };
function Pr() {
  tn.call(this, 'd');
}
function Mr() {
  tn.call(this, 'c');
}
function Lr() {}
function Fr(e, t, n, r) {
  ((this.l = e),
    (this.j = t),
    (this.m = n),
    (this.W = r || 1),
    (this.U = new dr(this)),
    (this.P = Vr),
    (e = pn ? 125 : void 0),
    (this.V = new ar(e)),
    (this.I = null),
    (this.i = !1),
    (this.u = this.B = this.A = this.L = this.G = this.Y = this.C = null),
    (this.F = []),
    (this.g = null),
    (this.o = 0),
    (this.s = this.v = null),
    (this.ca = -1),
    (this.J = !1),
    (this.O = 0),
    (this.M = null),
    (this.ba = this.K = this.aa = this.S = !1),
    (this.h = new Ur()));
}
function Ur() {
  ((this.i = null), (this.g = ''), (this.h = !1));
}
(Yt(Pr, tn),
  Yt(Mr, tn),
  Yt(Lr, Dr),
  (Lr.prototype.g = function () {
    return new XMLHttpRequest();
  }),
  (Lr.prototype.i = function () {
    return {};
  }),
  (Or = new Lr()));
var Vr = 45e3,
  Br = {},
  jr = {};
function zr(e, t, n) {
  ((e.L = 1), (e.A = ai(ni(t))), (e.u = n), (e.S = !0), qr(e, null));
}
function qr(e, t) {
  ((e.G = Date.now()), Wr(e), (e.B = ni(e.A)));
  var n = e.B,
    r = e.W;
  (Array.isArray(r) || (r = [String(r)]),
    bi(n.i, 't', r),
    (e.o = 0),
    (n = e.l.J),
    (e.h = new Ur()),
    (e.g = ws(e.l, n ? t : null, !e.u)),
    0 < e.O && (e.M = new hr(Ht(e.Pa, e, e.g), e.O)),
    pr(e.U, e.g, 'readystatechange', e.nb),
    (t = e.I ? Dn(e.I) : {}),
    e.u
      ? (e.v || (e.v = 'POST'),
        (t['Content-Type'] = 'application/x-www-form-urlencoded'),
        e.g.ha(e.B, e.v, e.u, t))
      : ((e.v = 'GET'), e.g.ha(e.B, e.v, null, t)),
    Tr(),
    (function (e, t, n, r, i, s) {
      e.info(function () {
        if (e.g)
          if (s)
            for (var o = '', a = s.split('&'), c = 0; c < a.length; c++) {
              var u = a[c].split('=');
              if (1 < u.length) {
                var l = u[0];
                u = u[1];
                var h = l.split('_');
                o =
                  2 <= h.length && 'type' == h[1]
                    ? o + (l + '=') + u + '&'
                    : o + (l + '=redacted&');
              }
            }
          else o = null;
        else o = s;
        return 'XMLHTTP REQ (' + r + ') [attempt ' + i + ']: ' + t + '\n' + n + '\n' + o;
      });
    })(e.j, e.v, e.B, e.m, e.W, e.u));
}
function Gr(e) {
  return !!e.g && 'GET' == e.v && 2 != e.L && e.l.Ha;
}
function $r(e, t, n) {
  let r,
    i = !0;
  for (; !e.J && e.o < n.length; ) {
    if (((r = Kr(e, n)), r == jr)) {
      (4 == t && ((e.s = 4), Er(14), (i = !1)), yr(e.j, e.m, null, '[Incomplete Response]'));
      break;
    }
    if (r == Br) {
      ((e.s = 4), Er(15), yr(e.j, e.m, n, '[Invalid Chunk]'), (i = !1));
      break;
    }
    (yr(e.j, e.m, r, null), Jr(e, r));
  }
  (Gr(e) && 0 != e.o && ((e.h.g = e.h.g.slice(e.o)), (e.o = 0)),
    4 != t || 0 != n.length || e.h.h || ((e.s = 1), Er(16), (i = !1)),
    (e.i = e.i && i),
    i
      ? 0 < n.length &&
        !e.ba &&
        ((e.ba = !0),
        (t = e.l).g == e &&
          t.ca &&
          !t.M &&
          (t.l.info('Great, no buffering proxy detected. Bytes received: ' + n.length),
          ls(t),
          (t.M = !0),
          Er(11)))
      : (yr(e.j, e.m, n, '[Invalid Chunked Response]'), Xr(e), Yr(e)));
}
function Kr(e, t) {
  var n = e.o,
    r = t.indexOf('\n', n);
  return -1 == r
    ? jr
    : ((n = Number(t.substring(n, r))),
      isNaN(n) ? Br : (r += 1) + n > t.length ? jr : ((t = t.slice(r, r + n)), (e.o = r + n), t));
}
function Wr(e) {
  ((e.Y = Date.now() + e.P), Hr(e, e.P));
}
function Hr(e, t) {
  if (null != e.C) throw Error('WatchDog timer not null');
  e.C = Cr(Ht(e.lb, e), t);
}
function Qr(e) {
  e.C && (jt.clearTimeout(e.C), (e.C = null));
}
function Yr(e) {
  0 == e.l.H || e.J || fs(e.l, e);
}
function Xr(e) {
  Qr(e);
  var t = e.M;
  (t && 'function' == typeof t.sa && t.sa(),
    (e.M = null),
    cr(e.V),
    gr(e.U),
    e.g && ((t = e.g), (e.g = null), t.abort(), t.sa()));
}
function Jr(e, t) {
  try {
    var n = e.l;
    if (0 != n.H && (n.g == e || Ci(n.i, e)))
      if (!e.K && Ci(n.i, e) && 3 == n.H) {
        try {
          var r = n.Ja.g.parse(t);
        } catch (e) {
          r = null;
        }
        if (Array.isArray(r) && 3 == r.length) {
          var i = r;
          if (0 == i[0]) {
            e: if (!n.u) {
              if (n.g) {
                if (!(n.g.G + 3e3 < e.G)) break e;
                (ds(n), ns(n));
              }
              (us(n), Er(18));
            }
          } else
            ((n.Fa = i[1]),
              0 < n.Fa - n.V &&
                37500 > i[2] &&
                n.G &&
                0 == n.A &&
                !n.v &&
                (n.v = Cr(Ht(n.ib, n), 6e3)));
          if (1 >= Si(n.i) && n.oa) {
            try {
              n.oa();
            } catch (e) {}
            n.oa = void 0;
          }
        } else gs(n, 11);
      } else if (((e.K || n.g == e) && ds(n), !rn(t)))
        for (i = n.Ja.g.parse(t), t = 0; t < i.length; t++) {
          let u = i[t];
          if (((n.V = u[0]), (u = u[1]), 2 == n.H))
            if ('c' == u[0]) {
              ((n.K = u[1]), (n.pa = u[2]));
              const t = u[3];
              null != t && ((n.ra = t), n.l.info('VER=' + n.ra));
              const i = u[4];
              null != i && ((n.Ga = i), n.l.info('SVER=' + n.Ga));
              const l = u[5];
              (null != l &&
                'number' == typeof l &&
                0 < l &&
                ((r = 1.5 * l), (n.L = r), n.l.info('backChannelRequestTimeoutMs_=' + r)),
                (r = n));
              const h = e.g;
              if (h) {
                const e = h.g ? h.g.getResponseHeader('X-Client-Wire-Protocol') : null;
                if (e) {
                  var s = r.i;
                  s.g ||
                    (-1 == e.indexOf('spdy') && -1 == e.indexOf('quic') && -1 == e.indexOf('h2')) ||
                    ((s.j = s.l), (s.g = new Set()), s.h && (Ai(s, s.h), (s.h = null)));
                }
                if (r.F) {
                  const e = h.g ? h.g.getResponseHeader('X-HTTP-Session-Id') : null;
                  e && ((r.Da = e), oi(r.I, r.F, e));
                }
              }
              ((n.H = 3),
                n.h && n.h.Ba(),
                n.ca && ((n.S = Date.now() - e.G), n.l.info('Handshake RTT: ' + n.S + 'ms')));
              var o = e;
              if ((((r = n).wa = ys(r, r.J ? r.pa : null, r.Y)), o.K)) {
                ki(r.i, o);
                var a = o,
                  c = r.L;
                (c && a.setTimeout(c), a.C && (Qr(a), Wr(a)), (r.g = o));
              } else cs(r);
              0 < n.j.length && is(n);
            } else ('stop' != u[0] && 'close' != u[0]) || gs(n, 7);
          else
            3 == n.H &&
              ('stop' == u[0] || 'close' == u[0]
                ? 'stop' == u[0]
                  ? gs(n, 7)
                  : ts(n)
                : 'noop' != u[0] && n.h && n.h.Aa(u),
              (n.A = 0));
        }
    Tr();
  } catch (e) {}
}
function Zr(e, t) {
  if (e.forEach && 'function' == typeof e.forEach) e.forEach(t, void 0);
  else if (zt(e) || 'string' == typeof e) Array.prototype.forEach.call(e, t, void 0);
  else
    for (
      var n = (function (e) {
          if (e.ta && 'function' == typeof e.ta) return e.ta();
          if (!e.Z || 'function' != typeof e.Z) {
            if ('undefined' != typeof Map && e instanceof Map) return Array.from(e.keys());
            if (!('undefined' != typeof Set && e instanceof Set)) {
              if (zt(e) || 'string' == typeof e) {
                var t = [];
                e = e.length;
                for (var n = 0; n < e; n++) t.push(n);
                return t;
              }
              ((t = []), (n = 0));
              for (const r in e) t[n++] = r;
              return t;
            }
          }
        })(e),
        r = (function (e) {
          if (e.Z && 'function' == typeof e.Z) return e.Z();
          if (
            ('undefined' != typeof Map && e instanceof Map) ||
            ('undefined' != typeof Set && e instanceof Set)
          )
            return Array.from(e.values());
          if ('string' == typeof e) return e.split('');
          if (zt(e)) {
            for (var t = [], n = e.length, r = 0; r < n; r++) t.push(e[r]);
            return t;
          }
          for (r in ((t = []), (n = 0), e)) t[n++] = e[r];
          return t;
        })(e),
        i = r.length,
        s = 0;
      s < i;
      s++
    )
      t.call(void 0, r[s], n && n[s], e);
}
(((Ft = Fr.prototype).setTimeout = function (e) {
  this.P = e;
}),
  (Ft.nb = function (e) {
    e = e.target;
    const t = this.M;
    t && 3 == Qi(e) ? t.l() : this.Pa(e);
  }),
  (Ft.Pa = function (e) {
    try {
      if (e == this.g)
        e: {
          const l = Qi(this.g);
          var t = this.g.Ia();
          if (
            (this.g.da(),
            !(3 > l) && (3 != l || pn || (this.g && (this.h.h || this.g.ja() || Yi(this.g)))))
          ) {
            (this.J || 4 != l || 7 == t || Tr(), Qr(this));
            var n = this.g.da();
            this.ca = n;
            t: if (Gr(this)) {
              var r = Yi(this.g);
              e = '';
              var i = r.length,
                s = 4 == Qi(this.g);
              if (!this.h.i) {
                if ('undefined' == typeof TextDecoder) {
                  (Xr(this), Yr(this));
                  var o = '';
                  break t;
                }
                this.h.i = new jt.TextDecoder();
              }
              for (t = 0; t < i; t++)
                ((this.h.h = !0), (e += this.h.i.decode(r[t], { stream: s && t == i - 1 })));
              ((r.length = 0), (this.h.g += e), (this.o = 0), (o = this.h.g));
            } else o = this.g.ja();
            if (
              ((this.i = 200 == n),
              (function (e, t, n, r, i, s, o) {
                e.info(function () {
                  return (
                    'XMLHTTP RESP (' +
                    r +
                    ') [ attempt ' +
                    i +
                    ']: ' +
                    t +
                    '\n' +
                    n +
                    '\n' +
                    s +
                    ' ' +
                    o
                  );
                });
              })(this.j, this.v, this.B, this.m, this.W, l, n),
              this.i)
            ) {
              if (this.aa && !this.K) {
                t: {
                  if (this.g) {
                    var a,
                      c = this.g;
                    if (
                      (a = c.g ? c.g.getResponseHeader('X-HTTP-Initial-Response') : null) &&
                      !rn(a)
                    ) {
                      var u = a;
                      break t;
                    }
                  }
                  u = null;
                }
                if (!(n = u)) {
                  ((this.i = !1), (this.s = 3), Er(12), Xr(this), Yr(this));
                  break e;
                }
                (yr(this.j, this.m, n, 'Initial handshake response via X-HTTP-Initial-Response'),
                  (this.K = !0),
                  Jr(this, n));
              }
              (this.S
                ? ($r(this, l, o),
                  pn && this.i && 3 == l && (pr(this.U, this.V, 'tick', this.mb), this.V.start()))
                : (yr(this.j, this.m, o, null), Jr(this, o)),
                4 == l && Xr(this),
                this.i && !this.J && (4 == l ? fs(this.l, this) : ((this.i = !1), Wr(this))));
            } else
              ((function (e) {
                const t = {};
                e = ((e.g && 2 <= Qi(e) && e.g.getAllResponseHeaders()) || '').split('\r\n');
                for (let r = 0; r < e.length; r++) {
                  if (rn(e[r])) continue;
                  var n = er(e[r]);
                  const i = n[0];
                  if ('string' != typeof (n = n[1])) continue;
                  n = n.trim();
                  const s = t[i] || [];
                  ((t[i] = s), s.push(n));
                }
                !(function (e, t) {
                  for (const n in e) t.call(void 0, e[n], n, e);
                })(t, function (e) {
                  return e.join(', ');
                });
              })(this.g),
                400 == n && 0 < o.indexOf('Unknown SID')
                  ? ((this.s = 3), Er(12))
                  : ((this.s = 0), Er(13)),
                Xr(this),
                Yr(this));
          }
        }
    } catch (e) {}
  }),
  (Ft.mb = function () {
    if (this.g) {
      var e = Qi(this.g),
        t = this.g.ja();
      this.o < t.length && (Qr(this), $r(this, e, t), this.i && 4 != e && Wr(this));
    }
  }),
  (Ft.cancel = function () {
    ((this.J = !0), Xr(this));
  }),
  (Ft.lb = function () {
    this.C = null;
    const e = Date.now();
    0 <= e - this.Y
      ? ((function (e, t) {
          e.info(function () {
            return 'TIMEOUT: ' + t;
          });
        })(this.j, this.B),
        2 != this.L && (Tr(), Er(17)),
        Xr(this),
        (this.s = 2),
        Yr(this))
      : Hr(this, this.Y - e);
  }));
var ei = RegExp(
  '^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$'
);
function ti(e) {
  if (
    ((this.g = this.s = this.j = ''),
    (this.m = null),
    (this.o = this.l = ''),
    (this.h = !1),
    e instanceof ti)
  ) {
    ((this.h = e.h), ri(this, e.j), (this.s = e.s), (this.g = e.g), ii(this, e.m), (this.l = e.l));
    var t = e.i,
      n = new mi();
    ((n.i = t.i), t.g && ((n.g = new Map(t.g)), (n.h = t.h)), si(this, n), (this.o = e.o));
  } else
    e && (t = String(e).match(ei))
      ? ((this.h = !1),
        ri(this, t[1] || '', !0),
        (this.s = ci(t[2] || '')),
        (this.g = ci(t[3] || '', !0)),
        ii(this, t[4]),
        (this.l = ci(t[5] || '', !0)),
        si(this, t[6] || '', !0),
        (this.o = ci(t[7] || '')))
      : ((this.h = !1), (this.i = new mi(null, this.h)));
}
function ni(e) {
  return new ti(e);
}
function ri(e, t, n) {
  ((e.j = n ? ci(t, !0) : t), e.j && (e.j = e.j.replace(/:$/, '')));
}
function ii(e, t) {
  if (t) {
    if (((t = Number(t)), isNaN(t) || 0 > t)) throw Error('Bad port number ' + t);
    e.m = t;
  } else e.m = null;
}
function si(e, t, n) {
  t instanceof mi
    ? ((e.i = t),
      (function (e, t) {
        (t &&
          !e.j &&
          (yi(e),
          (e.i = null),
          e.g.forEach(function (e, t) {
            var n = t.toLowerCase();
            t != n && (wi(this, t), bi(this, n, e));
          }, e)),
          (e.j = t));
      })(e.i, e.h))
    : (n || (t = ui(t, pi)), (e.i = new mi(t, e.h)));
}
function oi(e, t, n) {
  e.i.set(t, n);
}
function ai(e) {
  return (
    oi(
      e,
      'zx',
      Math.floor(2147483648 * Math.random()).toString(36) +
        Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36)
    ),
    e
  );
}
function ci(e, t) {
  return e ? (t ? decodeURI(e.replace(/%25/g, '%2525')) : decodeURIComponent(e)) : '';
}
function ui(e, t, n) {
  return 'string' == typeof e
    ? ((e = encodeURI(e).replace(t, li)), n && (e = e.replace(/%25([0-9a-fA-F]{2})/g, '%$1')), e)
    : null;
}
function li(e) {
  return '%' + (((e = e.charCodeAt(0)) >> 4) & 15).toString(16) + (15 & e).toString(16);
}
ti.prototype.toString = function () {
  var e = [],
    t = this.j;
  t && e.push(ui(t, hi, !0), ':');
  var n = this.g;
  return (
    (n || 'file' == t) &&
      (e.push('//'),
      (t = this.s) && e.push(ui(t, hi, !0), '@'),
      e.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
      null != (n = this.m) && e.push(':', String(n))),
    (n = this.l) &&
      (this.g && '/' != n.charAt(0) && e.push('/'),
      e.push(ui(n, '/' == n.charAt(0) ? fi : di, !0))),
    (n = this.i.toString()) && e.push('?', n),
    (n = this.o) && e.push('#', ui(n, gi)),
    e.join('')
  );
};
var hi = /[#\/\?@]/g,
  di = /[#\?:]/g,
  fi = /[#\?]/g,
  pi = /[#\?@]/g,
  gi = /#/g;
function mi(e, t) {
  ((this.h = this.g = null), (this.i = e || null), (this.j = !!t));
}
function yi(e) {
  e.g ||
    ((e.g = new Map()),
    (e.h = 0),
    e.i &&
      (function (e, t) {
        if (e) {
          e = e.split('&');
          for (var n = 0; n < e.length; n++) {
            var r = e[n].indexOf('='),
              i = null;
            if (0 <= r) {
              var s = e[n].substring(0, r);
              i = e[n].substring(r + 1);
            } else s = e[n];
            t(s, i ? decodeURIComponent(i.replace(/\+/g, ' ')) : '');
          }
        }
      })(e.i, function (t, n) {
        e.add(decodeURIComponent(t.replace(/\+/g, ' ')), n);
      }));
}
function wi(e, t) {
  (yi(e), (t = Ii(e, t)), e.g.has(t) && ((e.i = null), (e.h -= e.g.get(t).length), e.g.delete(t)));
}
function vi(e, t) {
  return (yi(e), (t = Ii(e, t)), e.g.has(t));
}
function bi(e, t, n) {
  (wi(e, t), 0 < n.length && ((e.i = null), e.g.set(Ii(e, t), Zt(n)), (e.h += n.length)));
}
function Ii(e, t) {
  return ((t = String(t)), e.j && (t = t.toLowerCase()), t);
}
function Ti(e) {
  ((this.l = e || _i),
    (e = jt.PerformanceNavigationTiming
      ? 0 < (e = jt.performance.getEntriesByType('navigation')).length &&
        ('hq' == e[0].nextHopProtocol || 'h2' == e[0].nextHopProtocol)
      : !!(jt.g && jt.g.Ka && jt.g.Ka() && jt.g.Ka().dc)),
    (this.j = e ? this.l : 1),
    (this.g = null),
    1 < this.j && (this.g = new Set()),
    (this.h = null),
    (this.i = []));
}
(((Ft = mi.prototype).add = function (e, t) {
  (yi(this), (this.i = null), (e = Ii(this, e)));
  var n = this.g.get(e);
  return (n || this.g.set(e, (n = [])), n.push(t), (this.h += 1), this);
}),
  (Ft.forEach = function (e, t) {
    (yi(this),
      this.g.forEach(function (n, r) {
        n.forEach(function (n) {
          e.call(t, n, r, this);
        }, this);
      }, this));
  }),
  (Ft.ta = function () {
    yi(this);
    const e = Array.from(this.g.values()),
      t = Array.from(this.g.keys()),
      n = [];
    for (let r = 0; r < t.length; r++) {
      const i = e[r];
      for (let e = 0; e < i.length; e++) n.push(t[r]);
    }
    return n;
  }),
  (Ft.Z = function (e) {
    yi(this);
    let t = [];
    if ('string' == typeof e) vi(this, e) && (t = t.concat(this.g.get(Ii(this, e))));
    else {
      e = Array.from(this.g.values());
      for (let n = 0; n < e.length; n++) t = t.concat(e[n]);
    }
    return t;
  }),
  (Ft.set = function (e, t) {
    return (
      yi(this),
      (this.i = null),
      vi(this, (e = Ii(this, e))) && (this.h -= this.g.get(e).length),
      this.g.set(e, [t]),
      (this.h += 1),
      this
    );
  }),
  (Ft.get = function (e, t) {
    return e && 0 < (e = this.Z(e)).length ? String(e[0]) : t;
  }),
  (Ft.toString = function () {
    if (this.i) return this.i;
    if (!this.g) return '';
    const e = [],
      t = Array.from(this.g.keys());
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      const s = encodeURIComponent(String(r)),
        o = this.Z(r);
      for (r = 0; r < o.length; r++) {
        var i = s;
        ('' !== o[r] && (i += '=' + encodeURIComponent(String(o[r]))), e.push(i));
      }
    }
    return (this.i = e.join('&'));
  }));
var _i = 10;
function Ei(e) {
  return !!e.h || (!!e.g && e.g.size >= e.j);
}
function Si(e) {
  return e.h ? 1 : e.g ? e.g.size : 0;
}
function Ci(e, t) {
  return e.h ? e.h == t : !!e.g && e.g.has(t);
}
function Ai(e, t) {
  e.g ? e.g.add(t) : (e.h = t);
}
function ki(e, t) {
  e.h && e.h == t ? (e.h = null) : e.g && e.g.has(t) && e.g.delete(t);
}
function Di(e) {
  if (null != e.h) return e.i.concat(e.h.F);
  if (null != e.g && 0 !== e.g.size) {
    let t = e.i;
    for (const n of e.g.values()) t = t.concat(n.F);
    return t;
  }
  return Zt(e.i);
}
function xi() {
  this.g = new (class {
    stringify(e) {
      return jt.JSON.stringify(e, void 0);
    }
    parse(e) {
      return jt.JSON.parse(e, void 0);
    }
  })();
}
function Ni(e, t, n) {
  const r = n || '';
  try {
    Zr(e, function (e, n) {
      let i = e;
      (qt(e) && (i = Yn(e)), t.push(r + n + '=' + encodeURIComponent(i)));
    });
  } catch (e) {
    throw (t.push(r + 'type=' + encodeURIComponent('_badmap')), e);
  }
}
function Oi(e, t, n, r, i) {
  try {
    ((t.onload = null), (t.onerror = null), (t.onabort = null), (t.ontimeout = null), i(r));
  } catch (e) {}
}
function Ri(e) {
  ((this.l = e.ec || null), (this.j = e.ob || !1));
}
function Pi(e, t) {
  (Wn.call(this),
    (this.F = e),
    (this.u = t),
    (this.m = void 0),
    (this.readyState = Mi),
    (this.status = 0),
    (this.responseType = this.responseText = this.response = this.statusText = ''),
    (this.onreadystatechange = null),
    (this.v = new Headers()),
    (this.h = null),
    (this.C = 'GET'),
    (this.B = ''),
    (this.g = !1),
    (this.A = this.j = this.l = null));
}
((Ti.prototype.cancel = function () {
  if (((this.i = Di(this)), this.h)) (this.h.cancel(), (this.h = null));
  else if (this.g && 0 !== this.g.size) {
    for (const e of this.g.values()) e.cancel();
    this.g.clear();
  }
}),
  Yt(Ri, Dr),
  (Ri.prototype.g = function () {
    return new Pi(this.l, this.j);
  }),
  (Ri.prototype.i = (function (e) {
    return function () {
      return e;
    };
  })({})),
  Yt(Pi, Wn));
var Mi = 0;
function Li(e) {
  e.j.read().then(e.Xa.bind(e)).catch(e.ka.bind(e));
}
function Fi(e) {
  ((e.readyState = 4), (e.l = null), (e.j = null), (e.A = null), Ui(e));
}
function Ui(e) {
  e.onreadystatechange && e.onreadystatechange.call(e);
}
(((Ft = Pi.prototype).open = function (e, t) {
  if (this.readyState != Mi) throw (this.abort(), Error('Error reopening a connection'));
  ((this.C = e), (this.B = t), (this.readyState = 1), Ui(this));
}),
  (Ft.send = function (e) {
    if (1 != this.readyState) throw (this.abort(), Error('need to call open() first. '));
    this.g = !0;
    const t = { headers: this.v, method: this.C, credentials: this.m, cache: void 0 };
    (e && (t.body = e),
      (this.F || jt).fetch(new Request(this.B, t)).then(this.$a.bind(this), this.ka.bind(this)));
  }),
  (Ft.abort = function () {
    ((this.response = this.responseText = ''),
      (this.v = new Headers()),
      (this.status = 0),
      this.j && this.j.cancel('Request was aborted.').catch(() => {}),
      1 <= this.readyState && this.g && 4 != this.readyState && ((this.g = !1), Fi(this)),
      (this.readyState = Mi));
  }),
  (Ft.$a = function (e) {
    if (
      this.g &&
      ((this.l = e),
      this.h ||
        ((this.status = this.l.status),
        (this.statusText = this.l.statusText),
        (this.h = e.headers),
        (this.readyState = 2),
        Ui(this)),
      this.g && ((this.readyState = 3), Ui(this), this.g))
    )
      if ('arraybuffer' === this.responseType)
        e.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this));
      else if (void 0 !== jt.ReadableStream && 'body' in e) {
        if (((this.j = e.body.getReader()), this.u)) {
          if (this.responseType)
            throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
          this.response = [];
        } else ((this.response = this.responseText = ''), (this.A = new TextDecoder()));
        Li(this);
      } else e.text().then(this.Za.bind(this), this.ka.bind(this));
  }),
  (Ft.Xa = function (e) {
    if (this.g) {
      if (this.u && e.value) this.response.push(e.value);
      else if (!this.u) {
        var t = e.value ? e.value : new Uint8Array(0);
        (t = this.A.decode(t, { stream: !e.done })) && (this.response = this.responseText += t);
      }
      (e.done ? Fi(this) : Ui(this), 3 == this.readyState && Li(this));
    }
  }),
  (Ft.Za = function (e) {
    this.g && ((this.response = this.responseText = e), Fi(this));
  }),
  (Ft.Ya = function (e) {
    this.g && ((this.response = e), Fi(this));
  }),
  (Ft.ka = function () {
    this.g && Fi(this);
  }),
  (Ft.setRequestHeader = function (e, t) {
    this.v.append(e, t);
  }),
  (Ft.getResponseHeader = function (e) {
    return (this.h && this.h.get(e.toLowerCase())) || '';
  }),
  (Ft.getAllResponseHeaders = function () {
    if (!this.h) return '';
    const e = [],
      t = this.h.entries();
    for (var n = t.next(); !n.done; ) ((n = n.value), e.push(n[0] + ': ' + n[1]), (n = t.next()));
    return e.join('\r\n');
  }),
  Object.defineProperty(Pi.prototype, 'withCredentials', {
    get: function () {
      return 'include' === this.m;
    },
    set: function (e) {
      this.m = e ? 'include' : 'same-origin';
    },
  }));
var Vi = jt.JSON.parse;
function Bi(e) {
  (Wn.call(this),
    (this.headers = new Map()),
    (this.u = e || null),
    (this.h = !1),
    (this.C = this.g = null),
    (this.I = ''),
    (this.m = 0),
    (this.j = ''),
    (this.l = this.G = this.v = this.F = !1),
    (this.B = 0),
    (this.A = null),
    (this.K = ji),
    (this.L = this.M = !1));
}
Yt(Bi, Wn);
var ji = '',
  zi = /^https?$/i,
  qi = ['POST', 'PUT'];
function Gi(e, t) {
  ((e.h = !1), e.g && ((e.l = !0), e.g.abort(), (e.l = !1)), (e.j = t), (e.m = 5), $i(e), Wi(e));
}
function $i(e) {
  e.F || ((e.F = !0), Hn(e, 'complete'), Hn(e, 'error'));
}
function Ki(e) {
  if (e.h && void 0 !== Bt && (!e.C[1] || 4 != Qi(e) || 2 != e.da()))
    if (e.v && 4 == Qi(e)) ur(e.La, 0, e);
    else if ((Hn(e, 'readystatechange'), 4 == Qi(e))) {
      e.h = !1;
      try {
        const o = e.da();
        e: switch (o) {
          case 200:
          case 201:
          case 202:
          case 204:
          case 206:
          case 304:
          case 1223:
            var t = !0;
            break e;
          default:
            t = !1;
        }
        var n;
        if (!(n = t)) {
          var r;
          if ((r = 0 === o)) {
            var i = String(e.I).match(ei)[1] || null;
            (!i && jt.self && jt.self.location && (i = jt.self.location.protocol.slice(0, -1)),
              (r = !zi.test(i ? i.toLowerCase() : '')));
          }
          n = r;
        }
        if (n) (Hn(e, 'complete'), Hn(e, 'success'));
        else {
          e.m = 6;
          try {
            var s = 2 < Qi(e) ? e.g.statusText : '';
          } catch (e) {
            s = '';
          }
          ((e.j = s + ' [' + e.da() + ']'), $i(e));
        }
      } finally {
        Wi(e);
      }
    }
}
function Wi(e, t) {
  if (e.g) {
    Hi(e);
    const n = e.g,
      r = e.C[0] ? () => {} : null;
    ((e.g = null), (e.C = null), t || Hn(e, 'ready'));
    try {
      n.onreadystatechange = r;
    } catch (e) {}
  }
}
function Hi(e) {
  (e.g && e.L && (e.g.ontimeout = null), e.A && (jt.clearTimeout(e.A), (e.A = null)));
}
function Qi(e) {
  return e.g ? e.g.readyState : 0;
}
function Yi(e) {
  try {
    if (!e.g) return null;
    if ('response' in e.g) return e.g.response;
    switch (e.K) {
      case ji:
      case 'text':
        return e.g.responseText;
      case 'arraybuffer':
        if ('mozResponseArrayBuffer' in e.g) return e.g.mozResponseArrayBuffer;
    }
    return null;
  } catch (e) {
    return null;
  }
}
function Xi(e) {
  let t = '';
  return (
    kn(e, function (e, n) {
      ((t += n), (t += ':'), (t += e), (t += '\r\n'));
    }),
    t
  );
}
function Ji(e, t, n) {
  e: {
    for (r in n) {
      var r = !1;
      break e;
    }
    r = !0;
  }
  r ||
    ((n = Xi(n)), 'string' == typeof e ? null != n && encodeURIComponent(String(n)) : oi(e, t, n));
}
function Zi(e, t, n) {
  return (n && n.internalChannelParams && n.internalChannelParams[e]) || t;
}
function es(e) {
  ((this.Ga = 0),
    (this.j = []),
    (this.l = new mr()),
    (this.pa =
      this.wa =
      this.I =
      this.Y =
      this.g =
      this.Da =
      this.F =
      this.na =
      this.o =
      this.U =
      this.s =
        null),
    (this.fb = this.W = 0),
    (this.cb = Zi('failFast', !1, e)),
    (this.G = this.v = this.u = this.m = this.h = null),
    (this.aa = !0),
    (this.Fa = this.V = -1),
    (this.ba = this.A = this.C = 0),
    (this.ab = Zi('baseRetryDelayMs', 5e3, e)),
    (this.hb = Zi('retryDelaySeedMs', 1e4, e)),
    (this.eb = Zi('forwardChannelMaxRetries', 2, e)),
    (this.xa = Zi('forwardChannelRequestTimeoutMs', 2e4, e)),
    (this.va = (e && e.xmlHttpFactory) || void 0),
    (this.Ha = (e && e.useFetchStreams) || !1),
    (this.L = void 0),
    (this.J = (e && e.supportsCrossDomainXhr) || !1),
    (this.K = ''),
    (this.i = new Ti(e && e.concurrentRequestLimit)),
    (this.Ja = new xi()),
    (this.P = (e && e.fastHandshake) || !1),
    (this.O = (e && e.encodeInitMessageHeaders) || !1),
    this.P && this.O && (this.O = !1),
    (this.bb = (e && e.bc) || !1),
    e && e.Ea && this.l.Ea(),
    e && e.forceLongPolling && (this.aa = !1),
    (this.ca = (!this.P && this.aa && e && e.detectBufferingProxy) || !1),
    (this.qa = void 0),
    e && e.longPollingTimeout && 0 < e.longPollingTimeout && (this.qa = e.longPollingTimeout),
    (this.oa = void 0),
    (this.S = 0),
    (this.M = !1),
    (this.ma = this.B = null));
}
function ts(e) {
  if ((rs(e), 3 == e.H)) {
    var t = e.W++,
      n = ni(e.I);
    if (
      (oi(n, 'SID', e.K),
      oi(n, 'RID', t),
      oi(n, 'TYPE', 'terminate'),
      os(e, n),
      ((t = new Fr(e, e.l, t)).L = 2),
      (t.A = ai(ni(n))),
      (n = !1),
      jt.navigator && jt.navigator.sendBeacon)
    )
      try {
        n = jt.navigator.sendBeacon(t.A.toString(), '');
      } catch (e) {}
    (!n && jt.Image && ((new Image().src = t.A), (n = !0)),
      n || ((t.g = ws(t.l, null)), t.g.ha(t.A)),
      (t.G = Date.now()),
      Wr(t));
  }
  ms(e);
}
function ns(e) {
  e.g && (ls(e), e.g.cancel(), (e.g = null));
}
function rs(e) {
  (ns(e),
    e.u && (jt.clearTimeout(e.u), (e.u = null)),
    ds(e),
    e.i.cancel(),
    e.m && ('number' == typeof e.m && jt.clearTimeout(e.m), (e.m = null)));
}
function is(e) {
  if (!Ei(e.i) && !e.m) {
    e.m = !0;
    var t = e.Na;
    (nr || sr(), rr || (nr(), (rr = !0)), ir.add(t, e), (e.C = 0));
  }
}
function ss(e, t) {
  var n;
  n = t ? t.m : e.W++;
  const r = ni(e.I);
  (oi(r, 'SID', e.K),
    oi(r, 'RID', n),
    oi(r, 'AID', e.V),
    os(e, r),
    e.o && e.s && Ji(r, e.o, e.s),
    (n = new Fr(e, e.l, n, e.C + 1)),
    null === e.o && (n.I = e.s),
    t && (e.j = t.F.concat(e.j)),
    (t = as(e, n, 1e3)),
    n.setTimeout(Math.round(0.5 * e.xa) + Math.round(0.5 * e.xa * Math.random())),
    Ai(e.i, n),
    zr(n, r, t));
}
function os(e, t) {
  (e.na &&
    kn(e.na, function (e, n) {
      oi(t, n, e);
    }),
    e.h &&
      Zr({}, function (e, n) {
        oi(t, n, e);
      }));
}
function as(e, t, n) {
  n = Math.min(e.j.length, n);
  var r = e.h ? Ht(e.h.Va, e.h, e) : null;
  e: {
    var i = e.j;
    let t = -1;
    for (;;) {
      const e = ['count=' + n];
      -1 == t ? (0 < n ? ((t = i[0].g), e.push('ofs=' + t)) : (t = 0)) : e.push('ofs=' + t);
      let s = !0;
      for (let o = 0; o < n; o++) {
        let n = i[o].g;
        const a = i[o].map;
        if (((n -= t), 0 > n)) ((t = Math.max(0, i[o].g - 100)), (s = !1));
        else
          try {
            Ni(a, e, 'req' + n + '_');
          } catch (e) {
            r && r(a);
          }
      }
      if (s) {
        r = e.join('&');
        break e;
      }
    }
  }
  return ((e = e.j.splice(0, n)), (t.F = e), r);
}
function cs(e) {
  if (!e.g && !e.u) {
    e.ba = 1;
    var t = e.Ma;
    (nr || sr(), rr || (nr(), (rr = !0)), ir.add(t, e), (e.A = 0));
  }
}
function us(e) {
  return !(e.g || e.u || 3 <= e.A || (e.ba++, (e.u = Cr(Ht(e.Ma, e), ps(e, e.A))), e.A++, 0));
}
function ls(e) {
  null != e.B && (jt.clearTimeout(e.B), (e.B = null));
}
function hs(e) {
  ((e.g = new Fr(e, e.l, 'rpc', e.ba)), null === e.o && (e.g.I = e.s), (e.g.O = 0));
  var t = ni(e.wa);
  (oi(t, 'RID', 'rpc'),
    oi(t, 'SID', e.K),
    oi(t, 'AID', e.V),
    oi(t, 'CI', e.G ? '0' : '1'),
    !e.G && e.qa && oi(t, 'TO', e.qa),
    oi(t, 'TYPE', 'xmlhttp'),
    os(e, t),
    e.o && e.s && Ji(t, e.o, e.s),
    e.L && e.g.setTimeout(e.L));
  var n = e.g;
  ((e = e.pa), (n.L = 1), (n.A = ai(ni(t))), (n.u = null), (n.S = !0), qr(n, e));
}
function ds(e) {
  null != e.v && (jt.clearTimeout(e.v), (e.v = null));
}
function fs(e, t) {
  var n = null;
  if (e.g == t) {
    (ds(e), ls(e), (e.g = null));
    var r = 2;
  } else {
    if (!Ci(e.i, t)) return;
    ((n = t.F), ki(e.i, t), (r = 1));
  }
  if (0 != e.H)
    if (t.i)
      if (1 == r) {
        ((n = t.u ? t.u.length : 0), (t = Date.now() - t.G));
        var i = e.C;
        (Hn((r = br()), new Sr(r, n)), is(e));
      } else cs(e);
    else if (
      3 == (i = t.s) ||
      (0 == i && 0 < t.ca) ||
      !(
        (1 == r &&
          (function (e, t) {
            return !(
              Si(e.i) >= e.i.j - (e.m ? 1 : 0) ||
              (e.m
                ? ((e.j = t.F.concat(e.j)), 0)
                : 1 == e.H ||
                  2 == e.H ||
                  e.C >= (e.cb ? 0 : e.eb) ||
                  ((e.m = Cr(Ht(e.Na, e, t), ps(e, e.C))), e.C++, 0))
            );
          })(e, t)) ||
        (2 == r && us(e))
      )
    )
      switch ((n && 0 < n.length && ((t = e.i), (t.i = t.i.concat(n))), i)) {
        case 1:
          gs(e, 5);
          break;
        case 4:
          gs(e, 10);
          break;
        case 3:
          gs(e, 6);
          break;
        default:
          gs(e, 2);
      }
}
function ps(e, t) {
  let n = e.ab + Math.floor(Math.random() * e.hb);
  return (e.isActive() || (n *= 2), n * t);
}
function gs(e, t) {
  if ((e.l.info('Error code ' + t), 2 == t)) {
    var n = null;
    e.h && (n = null);
    var r = Ht(e.pb, e);
    (n ||
      ((n = new ti('//www.google.com/images/cleardot.gif')),
      (jt.location && 'http' == jt.location.protocol) || ri(n, 'https'),
      ai(n)),
      (function (e, t) {
        const n = new mr();
        if (jt.Image) {
          const r = new Image();
          ((r.onload = Qt(Oi, n, r, 'TestLoadImage: loaded', !0, t)),
            (r.onerror = Qt(Oi, n, r, 'TestLoadImage: error', !1, t)),
            (r.onabort = Qt(Oi, n, r, 'TestLoadImage: abort', !1, t)),
            (r.ontimeout = Qt(Oi, n, r, 'TestLoadImage: timeout', !1, t)),
            jt.setTimeout(function () {
              r.ontimeout && r.ontimeout();
            }, 1e4),
            (r.src = e));
        } else t(!1);
      })(n.toString(), r));
  } else Er(2);
  ((e.H = 0), e.h && e.h.za(t), ms(e), rs(e));
}
function ms(e) {
  if (((e.H = 0), (e.ma = []), e.h)) {
    const t = Di(e.i);
    ((0 == t.length && 0 == e.j.length) ||
      (en(e.ma, t), en(e.ma, e.j), (e.i.i.length = 0), Zt(e.j), (e.j.length = 0)),
      e.h.ya());
  }
}
function ys(e, t, n) {
  var r = n instanceof ti ? ni(n) : new ti(n);
  if ('' != r.g) (t && (r.g = t + '.' + r.g), ii(r, r.m));
  else {
    var i = jt.location;
    ((r = i.protocol), (t = t ? t + '.' + i.hostname : i.hostname), (i = +i.port));
    var s = new ti(null);
    (r && ri(s, r), t && (s.g = t), i && ii(s, i), n && (s.l = n), (r = s));
  }
  return ((n = e.F), (t = e.Da), n && t && oi(r, n, t), oi(r, 'VER', e.ra), os(e, r), r);
}
function ws(e, t, n) {
  if (t && !e.J) throw Error("Can't create secondary domain capable XhrIo object.");
  return ((t = e.Ha && !e.va ? new Bi(new Ri({ ob: n })) : new Bi(e.va)).Oa(e.J), t);
}
function vs() {}
function bs() {
  if (dn && !(10 <= Number(In))) throw Error('Environmental error: no available transport.');
}
function Is(e, t) {
  (Wn.call(this),
    (this.g = new es(t)),
    (this.l = e),
    (this.h = (t && t.messageUrlParams) || null),
    (e = (t && t.messageHeaders) || null),
    t &&
      t.clientProtocolHeaderRequired &&
      (e ? (e['X-Client-Protocol'] = 'webchannel') : (e = { 'X-Client-Protocol': 'webchannel' })),
    (this.g.s = e),
    (e = (t && t.initMessageHeaders) || null),
    t &&
      t.messageContentType &&
      (e
        ? (e['X-WebChannel-Content-Type'] = t.messageContentType)
        : (e = { 'X-WebChannel-Content-Type': t.messageContentType })),
    t &&
      t.Ca &&
      (e
        ? (e['X-WebChannel-Client-Profile'] = t.Ca)
        : (e = { 'X-WebChannel-Client-Profile': t.Ca })),
    (this.g.U = e),
    (e = t && t.cc) && !rn(e) && (this.g.o = e),
    (this.A = (t && t.supportsCrossDomainXhr) || !1),
    (this.v = (t && t.sendRawJson) || !1),
    (t = t && t.httpSessionIdParam) &&
      !rn(t) &&
      ((this.g.F = t), null !== (e = this.h) && t in e && t in (e = this.h) && delete e[t]),
    (this.j = new Es(this)));
}
function Ts(e) {
  (Pr.call(this),
    e.__headers__ &&
      ((this.headers = e.__headers__),
      (this.statusCode = e.__status__),
      delete e.__headers__,
      delete e.__status__));
  var t = e.__sm__;
  if (t) {
    e: {
      for (const n in t) {
        e = n;
        break e;
      }
      e = void 0;
    }
    ((this.i = e) && ((e = this.i), (t = null !== t && e in t ? t[e] : void 0)), (this.data = t));
  } else this.data = e;
}
function _s() {
  (Mr.call(this), (this.status = 1));
}
function Es(e) {
  this.g = e;
}
function Ss() {
  ((this.blockSize = -1),
    (this.blockSize = 64),
    (this.g = Array(4)),
    (this.m = Array(this.blockSize)),
    (this.i = this.h = 0),
    this.reset());
}
function Cs(e, t, n) {
  n || (n = 0);
  var r = Array(16);
  if ('string' == typeof t)
    for (var i = 0; 16 > i; ++i)
      r[i] =
        t.charCodeAt(n++) |
        (t.charCodeAt(n++) << 8) |
        (t.charCodeAt(n++) << 16) |
        (t.charCodeAt(n++) << 24);
  else for (i = 0; 16 > i; ++i) r[i] = t[n++] | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24);
  ((t = e.g[0]), (n = e.g[1]), (i = e.g[2]));
  var s = e.g[3],
    o = (t + (s ^ (n & (i ^ s))) + r[0] + 3614090360) & 4294967295;
  ((o =
    ((n =
      (i =
        (s =
          (t =
            (n =
              (i =
                (s =
                  (t =
                    (n =
                      (i =
                        (s =
                          (t =
                            (n =
                              (i =
                                (s =
                                  (t =
                                    (n =
                                      (i =
                                        (s =
                                          (t =
                                            (n =
                                              (i =
                                                (s =
                                                  (t =
                                                    (n =
                                                      (i =
                                                        (s =
                                                          (t =
                                                            (n =
                                                              (i =
                                                                (s =
                                                                  (t =
                                                                    (n =
                                                                      (i =
                                                                        (s =
                                                                          (t =
                                                                            (n =
                                                                              (i =
                                                                                (s =
                                                                                  (t =
                                                                                    (n =
                                                                                      (i =
                                                                                        (s =
                                                                                          (t =
                                                                                            (n =
                                                                                              (i =
                                                                                                (s =
                                                                                                  (t =
                                                                                                    (n =
                                                                                                      (i =
                                                                                                        (s =
                                                                                                          (t =
                                                                                                            (n =
                                                                                                              (i =
                                                                                                                (s =
                                                                                                                  (t =
                                                                                                                    (n =
                                                                                                                      (i =
                                                                                                                        (s =
                                                                                                                          (t =
                                                                                                                            n +
                                                                                                                            (((o <<
                                                                                                                              7) &
                                                                                                                              4294967295) |
                                                                                                                              (o >>>
                                                                                                                                25))) +
                                                                                                                          ((((o =
                                                                                                                            (s +
                                                                                                                              (i ^
                                                                                                                                (t &
                                                                                                                                  (n ^
                                                                                                                                    i))) +
                                                                                                                              r[1] +
                                                                                                                              3905402710) &
                                                                                                                            4294967295) <<
                                                                                                                            12) &
                                                                                                                            4294967295) |
                                                                                                                            (o >>>
                                                                                                                              20))) +
                                                                                                                        ((((o =
                                                                                                                          (i +
                                                                                                                            (n ^
                                                                                                                              (s &
                                                                                                                                (t ^
                                                                                                                                  n))) +
                                                                                                                            r[2] +
                                                                                                                            606105819) &
                                                                                                                          4294967295) <<
                                                                                                                          17) &
                                                                                                                          4294967295) |
                                                                                                                          (o >>>
                                                                                                                            15))) +
                                                                                                                      ((((o =
                                                                                                                        (n +
                                                                                                                          (t ^
                                                                                                                            (i &
                                                                                                                              (s ^
                                                                                                                                t))) +
                                                                                                                          r[3] +
                                                                                                                          3250441966) &
                                                                                                                        4294967295) <<
                                                                                                                        22) &
                                                                                                                        4294967295) |
                                                                                                                        (o >>>
                                                                                                                          10))) +
                                                                                                                    ((((o =
                                                                                                                      (t +
                                                                                                                        (s ^
                                                                                                                          (n &
                                                                                                                            (i ^
                                                                                                                              s))) +
                                                                                                                        r[4] +
                                                                                                                        4118548399) &
                                                                                                                      4294967295) <<
                                                                                                                      7) &
                                                                                                                      4294967295) |
                                                                                                                      (o >>>
                                                                                                                        25))) +
                                                                                                                  ((((o =
                                                                                                                    (s +
                                                                                                                      (i ^
                                                                                                                        (t &
                                                                                                                          (n ^
                                                                                                                            i))) +
                                                                                                                      r[5] +
                                                                                                                      1200080426) &
                                                                                                                    4294967295) <<
                                                                                                                    12) &
                                                                                                                    4294967295) |
                                                                                                                    (o >>>
                                                                                                                      20))) +
                                                                                                                ((((o =
                                                                                                                  (i +
                                                                                                                    (n ^
                                                                                                                      (s &
                                                                                                                        (t ^
                                                                                                                          n))) +
                                                                                                                    r[6] +
                                                                                                                    2821735955) &
                                                                                                                  4294967295) <<
                                                                                                                  17) &
                                                                                                                  4294967295) |
                                                                                                                  (o >>>
                                                                                                                    15))) +
                                                                                                              ((((o =
                                                                                                                (n +
                                                                                                                  (t ^
                                                                                                                    (i &
                                                                                                                      (s ^
                                                                                                                        t))) +
                                                                                                                  r[7] +
                                                                                                                  4249261313) &
                                                                                                                4294967295) <<
                                                                                                                22) &
                                                                                                                4294967295) |
                                                                                                                (o >>>
                                                                                                                  10))) +
                                                                                                            ((((o =
                                                                                                              (t +
                                                                                                                (s ^
                                                                                                                  (n &
                                                                                                                    (i ^
                                                                                                                      s))) +
                                                                                                                r[8] +
                                                                                                                1770035416) &
                                                                                                              4294967295) <<
                                                                                                              7) &
                                                                                                              4294967295) |
                                                                                                              (o >>>
                                                                                                                25))) +
                                                                                                          ((((o =
                                                                                                            (s +
                                                                                                              (i ^
                                                                                                                (t &
                                                                                                                  (n ^
                                                                                                                    i))) +
                                                                                                              r[9] +
                                                                                                              2336552879) &
                                                                                                            4294967295) <<
                                                                                                            12) &
                                                                                                            4294967295) |
                                                                                                            (o >>>
                                                                                                              20))) +
                                                                                                        ((((o =
                                                                                                          (i +
                                                                                                            (n ^
                                                                                                              (s &
                                                                                                                (t ^
                                                                                                                  n))) +
                                                                                                            r[10] +
                                                                                                            4294925233) &
                                                                                                          4294967295) <<
                                                                                                          17) &
                                                                                                          4294967295) |
                                                                                                          (o >>>
                                                                                                            15))) +
                                                                                                      ((((o =
                                                                                                        (n +
                                                                                                          (t ^
                                                                                                            (i &
                                                                                                              (s ^
                                                                                                                t))) +
                                                                                                          r[11] +
                                                                                                          2304563134) &
                                                                                                        4294967295) <<
                                                                                                        22) &
                                                                                                        4294967295) |
                                                                                                        (o >>>
                                                                                                          10))) +
                                                                                                    ((((o =
                                                                                                      (t +
                                                                                                        (s ^
                                                                                                          (n &
                                                                                                            (i ^
                                                                                                              s))) +
                                                                                                        r[12] +
                                                                                                        1804603682) &
                                                                                                      4294967295) <<
                                                                                                      7) &
                                                                                                      4294967295) |
                                                                                                      (o >>>
                                                                                                        25))) +
                                                                                                  ((((o =
                                                                                                    (s +
                                                                                                      (i ^
                                                                                                        (t &
                                                                                                          (n ^
                                                                                                            i))) +
                                                                                                      r[13] +
                                                                                                      4254626195) &
                                                                                                    4294967295) <<
                                                                                                    12) &
                                                                                                    4294967295) |
                                                                                                    (o >>>
                                                                                                      20))) +
                                                                                                ((((o =
                                                                                                  (i +
                                                                                                    (n ^
                                                                                                      (s &
                                                                                                        (t ^
                                                                                                          n))) +
                                                                                                    r[14] +
                                                                                                    2792965006) &
                                                                                                  4294967295) <<
                                                                                                  17) &
                                                                                                  4294967295) |
                                                                                                  (o >>>
                                                                                                    15))) +
                                                                                              ((((o =
                                                                                                (n +
                                                                                                  (t ^
                                                                                                    (i &
                                                                                                      (s ^
                                                                                                        t))) +
                                                                                                  r[15] +
                                                                                                  1236535329) &
                                                                                                4294967295) <<
                                                                                                22) &
                                                                                                4294967295) |
                                                                                                (o >>>
                                                                                                  10))) +
                                                                                            ((((o =
                                                                                              (t +
                                                                                                (i ^
                                                                                                  (s &
                                                                                                    (n ^
                                                                                                      i))) +
                                                                                                r[1] +
                                                                                                4129170786) &
                                                                                              4294967295) <<
                                                                                              5) &
                                                                                              4294967295) |
                                                                                              (o >>>
                                                                                                27))) +
                                                                                          ((((o =
                                                                                            (s +
                                                                                              (n ^
                                                                                                (i &
                                                                                                  (t ^
                                                                                                    n))) +
                                                                                              r[6] +
                                                                                              3225465664) &
                                                                                            4294967295) <<
                                                                                            9) &
                                                                                            4294967295) |
                                                                                            (o >>>
                                                                                              23))) +
                                                                                        ((((o =
                                                                                          (i +
                                                                                            (t ^
                                                                                              (n &
                                                                                                (s ^
                                                                                                  t))) +
                                                                                            r[11] +
                                                                                            643717713) &
                                                                                          4294967295) <<
                                                                                          14) &
                                                                                          4294967295) |
                                                                                          (o >>>
                                                                                            18))) +
                                                                                      ((((o =
                                                                                        (n +
                                                                                          (s ^
                                                                                            (t &
                                                                                              (i ^
                                                                                                s))) +
                                                                                          r[0] +
                                                                                          3921069994) &
                                                                                        4294967295) <<
                                                                                        20) &
                                                                                        4294967295) |
                                                                                        (o >>>
                                                                                          12))) +
                                                                                    ((((o =
                                                                                      (t +
                                                                                        (i ^
                                                                                          (s &
                                                                                            (n ^
                                                                                              i))) +
                                                                                        r[5] +
                                                                                        3593408605) &
                                                                                      4294967295) <<
                                                                                      5) &
                                                                                      4294967295) |
                                                                                      (o >>> 27))) +
                                                                                  ((((o =
                                                                                    (s +
                                                                                      (n ^
                                                                                        (i &
                                                                                          (t ^
                                                                                            n))) +
                                                                                      r[10] +
                                                                                      38016083) &
                                                                                    4294967295) <<
                                                                                    9) &
                                                                                    4294967295) |
                                                                                    (o >>> 23))) +
                                                                                ((((o =
                                                                                  (i +
                                                                                    (t ^
                                                                                      (n &
                                                                                        (s ^ t))) +
                                                                                    r[15] +
                                                                                    3634488961) &
                                                                                  4294967295) <<
                                                                                  14) &
                                                                                  4294967295) |
                                                                                  (o >>> 18))) +
                                                                              ((((o =
                                                                                (n +
                                                                                  (s ^
                                                                                    (t & (i ^ s))) +
                                                                                  r[4] +
                                                                                  3889429448) &
                                                                                4294967295) <<
                                                                                20) &
                                                                                4294967295) |
                                                                                (o >>> 12))) +
                                                                            ((((o =
                                                                              (t +
                                                                                (i ^
                                                                                  (s & (n ^ i))) +
                                                                                r[9] +
                                                                                568446438) &
                                                                              4294967295) <<
                                                                              5) &
                                                                              4294967295) |
                                                                              (o >>> 27))) +
                                                                          ((((o =
                                                                            (s +
                                                                              (n ^ (i & (t ^ n))) +
                                                                              r[14] +
                                                                              3275163606) &
                                                                            4294967295) <<
                                                                            9) &
                                                                            4294967295) |
                                                                            (o >>> 23))) +
                                                                        ((((o =
                                                                          (i +
                                                                            (t ^ (n & (s ^ t))) +
                                                                            r[3] +
                                                                            4107603335) &
                                                                          4294967295) <<
                                                                          14) &
                                                                          4294967295) |
                                                                          (o >>> 18))) +
                                                                      ((((o =
                                                                        (n +
                                                                          (s ^ (t & (i ^ s))) +
                                                                          r[8] +
                                                                          1163531501) &
                                                                        4294967295) <<
                                                                        20) &
                                                                        4294967295) |
                                                                        (o >>> 12))) +
                                                                    ((((o =
                                                                      (t +
                                                                        (i ^ (s & (n ^ i))) +
                                                                        r[13] +
                                                                        2850285829) &
                                                                      4294967295) <<
                                                                      5) &
                                                                      4294967295) |
                                                                      (o >>> 27))) +
                                                                  ((((o =
                                                                    (s +
                                                                      (n ^ (i & (t ^ n))) +
                                                                      r[2] +
                                                                      4243563512) &
                                                                    4294967295) <<
                                                                    9) &
                                                                    4294967295) |
                                                                    (o >>> 23))) +
                                                                ((((o =
                                                                  (i +
                                                                    (t ^ (n & (s ^ t))) +
                                                                    r[7] +
                                                                    1735328473) &
                                                                  4294967295) <<
                                                                  14) &
                                                                  4294967295) |
                                                                  (o >>> 18))) +
                                                              ((((o =
                                                                (n +
                                                                  (s ^ (t & (i ^ s))) +
                                                                  r[12] +
                                                                  2368359562) &
                                                                4294967295) <<
                                                                20) &
                                                                4294967295) |
                                                                (o >>> 12))) +
                                                            ((((o =
                                                              (t +
                                                                (n ^ i ^ s) +
                                                                r[5] +
                                                                4294588738) &
                                                              4294967295) <<
                                                              4) &
                                                              4294967295) |
                                                              (o >>> 28))) +
                                                          ((((o =
                                                            (s + (t ^ n ^ i) + r[8] + 2272392833) &
                                                            4294967295) <<
                                                            11) &
                                                            4294967295) |
                                                            (o >>> 21))) +
                                                        ((((o =
                                                          (i + (s ^ t ^ n) + r[11] + 1839030562) &
                                                          4294967295) <<
                                                          16) &
                                                          4294967295) |
                                                          (o >>> 16))) +
                                                      ((((o =
                                                        (n + (i ^ s ^ t) + r[14] + 4259657740) &
                                                        4294967295) <<
                                                        23) &
                                                        4294967295) |
                                                        (o >>> 9))) +
                                                    ((((o =
                                                      (t + (n ^ i ^ s) + r[1] + 2763975236) &
                                                      4294967295) <<
                                                      4) &
                                                      4294967295) |
                                                      (o >>> 28))) +
                                                  ((((o =
                                                    (s + (t ^ n ^ i) + r[4] + 1272893353) &
                                                    4294967295) <<
                                                    11) &
                                                    4294967295) |
                                                    (o >>> 21))) +
                                                ((((o =
                                                  (i + (s ^ t ^ n) + r[7] + 4139469664) &
                                                  4294967295) <<
                                                  16) &
                                                  4294967295) |
                                                  (o >>> 16))) +
                                              ((((o =
                                                (n + (i ^ s ^ t) + r[10] + 3200236656) &
                                                4294967295) <<
                                                23) &
                                                4294967295) |
                                                (o >>> 9))) +
                                            ((((o =
                                              (t + (n ^ i ^ s) + r[13] + 681279174) & 4294967295) <<
                                              4) &
                                              4294967295) |
                                              (o >>> 28))) +
                                          ((((o =
                                            (s + (t ^ n ^ i) + r[0] + 3936430074) & 4294967295) <<
                                            11) &
                                            4294967295) |
                                            (o >>> 21))) +
                                        ((((o =
                                          (i + (s ^ t ^ n) + r[3] + 3572445317) & 4294967295) <<
                                          16) &
                                          4294967295) |
                                          (o >>> 16))) +
                                      ((((o = (n + (i ^ s ^ t) + r[6] + 76029189) & 4294967295) <<
                                        23) &
                                        4294967295) |
                                        (o >>> 9))) +
                                    ((((o = (t + (n ^ i ^ s) + r[9] + 3654602809) & 4294967295) <<
                                      4) &
                                      4294967295) |
                                      (o >>> 28))) +
                                  ((((o = (s + (t ^ n ^ i) + r[12] + 3873151461) & 4294967295) <<
                                    11) &
                                    4294967295) |
                                    (o >>> 21))) +
                                ((((o = (i + (s ^ t ^ n) + r[15] + 530742520) & 4294967295) << 16) &
                                  4294967295) |
                                  (o >>> 16))) +
                              ((((o = (n + (i ^ s ^ t) + r[2] + 3299628645) & 4294967295) << 23) &
                                4294967295) |
                                (o >>> 9))) +
                            ((((o = (t + (i ^ (n | ~s)) + r[0] + 4096336452) & 4294967295) << 6) &
                              4294967295) |
                              (o >>> 26))) +
                          ((((o = (s + (n ^ (t | ~i)) + r[7] + 1126891415) & 4294967295) << 10) &
                            4294967295) |
                            (o >>> 22))) +
                        ((((o = (i + (t ^ (s | ~n)) + r[14] + 2878612391) & 4294967295) << 15) &
                          4294967295) |
                          (o >>> 17))) +
                      ((((o = (n + (s ^ (i | ~t)) + r[5] + 4237533241) & 4294967295) << 21) &
                        4294967295) |
                        (o >>> 11))) +
                    ((((o = (t + (i ^ (n | ~s)) + r[12] + 1700485571) & 4294967295) << 6) &
                      4294967295) |
                      (o >>> 26))) +
                  ((((o = (s + (n ^ (t | ~i)) + r[3] + 2399980690) & 4294967295) << 10) &
                    4294967295) |
                    (o >>> 22))) +
                ((((o = (i + (t ^ (s | ~n)) + r[10] + 4293915773) & 4294967295) << 15) &
                  4294967295) |
                  (o >>> 17))) +
              ((((o = (n + (s ^ (i | ~t)) + r[1] + 2240044497) & 4294967295) << 21) & 4294967295) |
                (o >>> 11))) +
            ((((o = (t + (i ^ (n | ~s)) + r[8] + 1873313359) & 4294967295) << 6) & 4294967295) |
              (o >>> 26))) +
          ((((o = (s + (n ^ (t | ~i)) + r[15] + 4264355552) & 4294967295) << 10) & 4294967295) |
            (o >>> 22))) +
        ((((o = (i + (t ^ (s | ~n)) + r[6] + 2734768916) & 4294967295) << 15) & 4294967295) |
          (o >>> 17))) +
      ((((o = (n + (s ^ (i | ~t)) + r[13] + 1309151649) & 4294967295) << 21) & 4294967295) |
        (o >>> 11))) +
      ((s =
        (t =
          n +
          ((((o = (t + (i ^ (n | ~s)) + r[4] + 4149444226) & 4294967295) << 6) & 4294967295) |
            (o >>> 26))) +
        ((((o = (s + (n ^ (t | ~i)) + r[11] + 3174756917) & 4294967295) << 10) & 4294967295) |
          (o >>> 22))) ^
        ((i =
          s +
          ((((o = (i + (t ^ (s | ~n)) + r[2] + 718787259) & 4294967295) << 15) & 4294967295) |
            (o >>> 17))) |
          ~t)) +
      r[9] +
      3951481745) &
    4294967295),
    (e.g[0] = (e.g[0] + t) & 4294967295),
    (e.g[1] = (e.g[1] + (i + (((o << 21) & 4294967295) | (o >>> 11)))) & 4294967295),
    (e.g[2] = (e.g[2] + i) & 4294967295),
    (e.g[3] = (e.g[3] + s) & 4294967295));
}
function As(e, t) {
  this.h = t;
  for (var n = [], r = !0, i = e.length - 1; 0 <= i; i--) {
    var s = 0 | e[i];
    (r && s == t) || ((n[i] = s), (r = !1));
  }
  this.g = n;
}
(((Ft = Bi.prototype).Oa = function (e) {
  this.M = e;
}),
  (Ft.ha = function (e, t, n, r) {
    if (this.g)
      throw Error(
        '[goog.net.XhrIo] Object is active with another request=' + this.I + '; newUri=' + e
      );
    ((t = t ? t.toUpperCase() : 'GET'),
      (this.I = e),
      (this.j = ''),
      (this.m = 0),
      (this.F = !1),
      (this.h = !0),
      (this.g = this.u ? this.u.g() : Or.g()),
      (this.C = this.u ? xr(this.u) : xr(Or)),
      (this.g.onreadystatechange = Ht(this.La, this)));
    try {
      ((this.G = !0), this.g.open(t, String(e), !0), (this.G = !1));
    } catch (e) {
      return void Gi(this, e);
    }
    if (((e = n || ''), (n = new Map(this.headers)), r))
      if (Object.getPrototypeOf(r) === Object.prototype) for (var i in r) n.set(i, r[i]);
      else {
        if ('function' != typeof r.keys || 'function' != typeof r.get)
          throw Error('Unknown input type for opt_headers: ' + String(r));
        for (const e of r.keys()) n.set(e, r.get(e));
      }
    ((r = Array.from(n.keys()).find(e => 'content-type' == e.toLowerCase())),
      (i = jt.FormData && e instanceof jt.FormData),
      !(0 <= Jt(qi, t)) ||
        r ||
        i ||
        n.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8'));
    for (const [e, t] of n) this.g.setRequestHeader(e, t);
    (this.K && (this.g.responseType = this.K),
      'withCredentials' in this.g &&
        this.g.withCredentials !== this.M &&
        (this.g.withCredentials = this.M));
    try {
      (Hi(this),
        0 < this.B &&
          ((this.L = (function (e) {
            return dn && 'number' == typeof e.timeout && void 0 !== e.ontimeout;
          })(this.g))
            ? ((this.g.timeout = this.B), (this.g.ontimeout = Ht(this.ua, this)))
            : (this.A = ur(this.ua, this.B, this))),
        (this.v = !0),
        this.g.send(e),
        (this.v = !1));
    } catch (e) {
      Gi(this, e);
    }
  }),
  (Ft.ua = function () {
    void 0 !== Bt &&
      this.g &&
      ((this.j = 'Timed out after ' + this.B + 'ms, aborting'),
      (this.m = 8),
      Hn(this, 'timeout'),
      this.abort(8));
  }),
  (Ft.abort = function (e) {
    this.g &&
      this.h &&
      ((this.h = !1),
      (this.l = !0),
      this.g.abort(),
      (this.l = !1),
      (this.m = e || 7),
      Hn(this, 'complete'),
      Hn(this, 'abort'),
      Wi(this));
  }),
  (Ft.N = function () {
    (this.g &&
      (this.h && ((this.h = !1), (this.l = !0), this.g.abort(), (this.l = !1)), Wi(this, !0)),
      Bi.$.N.call(this));
  }),
  (Ft.La = function () {
    this.s || (this.G || this.v || this.l ? Ki(this) : this.kb());
  }),
  (Ft.kb = function () {
    Ki(this);
  }),
  (Ft.isActive = function () {
    return !!this.g;
  }),
  (Ft.da = function () {
    try {
      return 2 < Qi(this) ? this.g.status : -1;
    } catch (e) {
      return -1;
    }
  }),
  (Ft.ja = function () {
    try {
      return this.g ? this.g.responseText : '';
    } catch (e) {
      return '';
    }
  }),
  (Ft.Wa = function (e) {
    if (this.g) {
      var t = this.g.responseText;
      return (e && 0 == t.indexOf(e) && (t = t.substring(e.length)), Vi(t));
    }
  }),
  (Ft.Ia = function () {
    return this.m;
  }),
  (Ft.Sa = function () {
    return 'string' == typeof this.j ? this.j : String(this.j);
  }),
  ((Ft = es.prototype).ra = 8),
  (Ft.H = 1),
  (Ft.Na = function (e) {
    if (this.m)
      if (((this.m = null), 1 == this.H)) {
        if (!e) {
          ((this.W = Math.floor(1e5 * Math.random())), (e = this.W++));
          const i = new Fr(this, this.l, e);
          let s = this.s;
          if (
            (this.U && (s ? ((s = Dn(s)), Nn(s, this.U)) : (s = this.U)),
            null !== this.o || this.O || ((i.I = s), (s = null)),
            this.P)
          )
            e: {
              for (var t = 0, n = 0; n < this.j.length; n++) {
                var r = this.j[n];
                if (
                  void 0 ===
                  (r =
                    '__data__' in r.map && 'string' == typeof (r = r.map.__data__)
                      ? r.length
                      : void 0)
                )
                  break;
                if (4096 < (t += r)) {
                  t = n;
                  break e;
                }
                if (4096 === t || n === this.j.length - 1) {
                  t = n + 1;
                  break e;
                }
              }
              t = 1e3;
            }
          else t = 1e3;
          ((t = as(this, i, t)),
            oi((n = ni(this.I)), 'RID', e),
            oi(n, 'CVER', 22),
            this.F && oi(n, 'X-HTTP-Session-Id', this.F),
            os(this, n),
            s &&
              (this.O
                ? (t = 'headers=' + encodeURIComponent(String(Xi(s))) + '&' + t)
                : this.o && Ji(n, this.o, s)),
            Ai(this.i, i),
            this.bb && oi(n, 'TYPE', 'init'),
            this.P
              ? (oi(n, '$req', t), oi(n, 'SID', 'null'), (i.aa = !0), zr(i, n, null))
              : zr(i, n, t),
            (this.H = 2));
        }
      } else 3 == this.H && (e ? ss(this, e) : 0 == this.j.length || Ei(this.i) || ss(this));
  }),
  (Ft.Ma = function () {
    if (((this.u = null), hs(this), this.ca && !(this.M || null == this.g || 0 >= this.S))) {
      var e = 2 * this.S;
      (this.l.info('BP detection timer enabled: ' + e), (this.B = Cr(Ht(this.jb, this), e)));
    }
  }),
  (Ft.jb = function () {
    this.B &&
      ((this.B = null),
      this.l.info('BP detection timeout reached.'),
      this.l.info('Buffering proxy detected and switch to long-polling!'),
      (this.G = !1),
      (this.M = !0),
      Er(10),
      ns(this),
      hs(this));
  }),
  (Ft.ib = function () {
    null != this.v && ((this.v = null), ns(this), us(this), Er(19));
  }),
  (Ft.pb = function (e) {
    e
      ? (this.l.info('Successfully pinged google.com'), Er(2))
      : (this.l.info('Failed to ping google.com'), Er(1));
  }),
  (Ft.isActive = function () {
    return !!this.h && this.h.isActive(this);
  }),
  ((Ft = vs.prototype).Ba = function () {}),
  (Ft.Aa = function () {}),
  (Ft.za = function () {}),
  (Ft.ya = function () {}),
  (Ft.isActive = function () {
    return !0;
  }),
  (Ft.Va = function () {}),
  (bs.prototype.g = function (e, t) {
    return new Is(e, t);
  }),
  Yt(Is, Wn),
  (Is.prototype.m = function () {
    ((this.g.h = this.j), this.A && (this.g.J = !0));
    var e = this.g,
      t = this.l,
      n = this.h || void 0;
    (Er(0), (e.Y = t), (e.na = n || {}), (e.G = e.aa), (e.I = ys(e, null, e.Y)), is(e));
  }),
  (Is.prototype.close = function () {
    ts(this.g);
  }),
  (Is.prototype.u = function (e) {
    var t = this.g;
    if ('string' == typeof e) {
      var n = {};
      ((n.__data__ = e), (e = n));
    } else this.v && (((n = {}).__data__ = Yn(e)), (e = n));
    (t.j.push(
      new (class {
        constructor(e, t) {
          ((this.g = e), (this.map = t));
        }
      })(t.fb++, e)
    ),
      3 == t.H && is(t));
  }),
  (Is.prototype.N = function () {
    ((this.g.h = null), delete this.j, ts(this.g), delete this.g, Is.$.N.call(this));
  }),
  Yt(Ts, Pr),
  Yt(_s, Mr),
  Yt(Es, vs),
  (Es.prototype.Ba = function () {
    Hn(this.g, 'a');
  }),
  (Es.prototype.Aa = function (e) {
    Hn(this.g, new Ts(e));
  }),
  (Es.prototype.za = function (e) {
    Hn(this.g, new _s());
  }),
  (Es.prototype.ya = function () {
    Hn(this.g, 'b');
  }),
  Yt(Ss, function () {
    this.blockSize = -1;
  }),
  (Ss.prototype.reset = function () {
    ((this.g[0] = 1732584193),
      (this.g[1] = 4023233417),
      (this.g[2] = 2562383102),
      (this.g[3] = 271733878),
      (this.i = this.h = 0));
  }),
  (Ss.prototype.j = function (e, t) {
    void 0 === t && (t = e.length);
    for (var n = t - this.blockSize, r = this.m, i = this.h, s = 0; s < t; ) {
      if (0 == i) for (; s <= n; ) (Cs(this, e, s), (s += this.blockSize));
      if ('string' == typeof e) {
        for (; s < t; )
          if (((r[i++] = e.charCodeAt(s++)), i == this.blockSize)) {
            (Cs(this, r), (i = 0));
            break;
          }
      } else
        for (; s < t; )
          if (((r[i++] = e[s++]), i == this.blockSize)) {
            (Cs(this, r), (i = 0));
            break;
          }
    }
    ((this.h = i), (this.i += t));
  }),
  (Ss.prototype.l = function () {
    var e = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
    e[0] = 128;
    for (var t = 1; t < e.length - 8; ++t) e[t] = 0;
    var n = 8 * this.i;
    for (t = e.length - 8; t < e.length; ++t) ((e[t] = 255 & n), (n /= 256));
    for (this.j(e), e = Array(16), t = n = 0; 4 > t; ++t)
      for (var r = 0; 32 > r; r += 8) e[n++] = (this.g[t] >>> r) & 255;
    return e;
  }));
var ks = {};
function Ds(e) {
  return -128 <= e && 128 > e
    ? (function (e, t) {
        var n = ks;
        return Object.prototype.hasOwnProperty.call(n, e)
          ? n[e]
          : (n[e] = (function (e) {
              return new As([0 | e], 0 > e ? -1 : 0);
            })(e));
      })(e)
    : new As([0 | e], 0 > e ? -1 : 0);
}
function xs(e) {
  if (isNaN(e) || !isFinite(e)) return Os;
  if (0 > e) return Fs(xs(-e));
  for (var t = [], n = 1, r = 0; e >= n; r++) ((t[r] = (e / n) | 0), (n *= Ns));
  return new As(t, 0);
}
var Ns = 4294967296,
  Os = Ds(0),
  Rs = Ds(1),
  Ps = Ds(16777216);
function Ms(e) {
  if (0 != e.h) return !1;
  for (var t = 0; t < e.g.length; t++) if (0 != e.g[t]) return !1;
  return !0;
}
function Ls(e) {
  return -1 == e.h;
}
function Fs(e) {
  for (var t = e.g.length, n = [], r = 0; r < t; r++) n[r] = ~e.g[r];
  return new As(n, ~e.h).add(Rs);
}
function Us(e, t) {
  return e.add(Fs(t));
}
function Vs(e, t) {
  for (; (65535 & e[t]) != e[t]; ) ((e[t + 1] += e[t] >>> 16), (e[t] &= 65535), t++);
}
function Bs(e, t) {
  ((this.g = e), (this.h = t));
}
function js(e, t) {
  if (Ms(t)) throw Error('division by zero');
  if (Ms(e)) return new Bs(Os, Os);
  if (Ls(e)) return ((t = js(Fs(e), t)), new Bs(Fs(t.g), Fs(t.h)));
  if (Ls(t)) return ((t = js(e, Fs(t))), new Bs(Fs(t.g), t.h));
  if (30 < e.g.length) {
    if (Ls(e) || Ls(t)) throw Error('slowDivide_ only works with positive integers.');
    for (var n = Rs, r = t; 0 >= r.X(e); ) ((n = zs(n)), (r = zs(r)));
    var i = qs(n, 1),
      s = qs(r, 1);
    for (r = qs(r, 2), n = qs(n, 2); !Ms(r); ) {
      var o = s.add(r);
      (0 >= o.X(e) && ((i = i.add(n)), (s = o)), (r = qs(r, 1)), (n = qs(n, 1)));
    }
    return ((t = Us(e, i.R(t))), new Bs(i, t));
  }
  for (i = Os; 0 <= e.X(t); ) {
    for (
      n = Math.max(1, Math.floor(e.ea() / t.ea())),
        r = 48 >= (r = Math.ceil(Math.log(n) / Math.LN2)) ? 1 : Math.pow(2, r - 48),
        o = (s = xs(n)).R(t);
      Ls(o) || 0 < o.X(e);

    )
      o = (s = xs((n -= r))).R(t);
    (Ms(s) && (s = Rs), (i = i.add(s)), (e = Us(e, o)));
  }
  return new Bs(i, e);
}
function zs(e) {
  for (var t = e.g.length + 1, n = [], r = 0; r < t; r++)
    n[r] = (e.D(r) << 1) | (e.D(r - 1) >>> 31);
  return new As(n, e.h);
}
function qs(e, t) {
  var n = t >> 5;
  t %= 32;
  for (var r = e.g.length - n, i = [], s = 0; s < r; s++)
    i[s] = 0 < t ? (e.D(s + n) >>> t) | (e.D(s + n + 1) << (32 - t)) : e.D(s + n);
  return new As(i, e.h);
}
(((Ft = As.prototype).ea = function () {
  if (Ls(this)) return -Fs(this).ea();
  for (var e = 0, t = 1, n = 0; n < this.g.length; n++) {
    var r = this.D(n);
    ((e += (0 <= r ? r : Ns + r) * t), (t *= Ns));
  }
  return e;
}),
  (Ft.toString = function (e) {
    if (2 > (e = e || 10) || 36 < e) throw Error('radix out of range: ' + e);
    if (Ms(this)) return '0';
    if (Ls(this)) return '-' + Fs(this).toString(e);
    for (var t = xs(Math.pow(e, 6)), n = this, r = ''; ; ) {
      var i = js(n, t).g,
        s = ((0 < (n = Us(n, i.R(t))).g.length ? n.g[0] : n.h) >>> 0).toString(e);
      if (Ms((n = i))) return s + r;
      for (; 6 > s.length; ) s = '0' + s;
      r = s + r;
    }
  }),
  (Ft.D = function (e) {
    return 0 > e ? 0 : e < this.g.length ? this.g[e] : this.h;
  }),
  (Ft.X = function (e) {
    return Ls((e = Us(this, e))) ? -1 : Ms(e) ? 0 : 1;
  }),
  (Ft.abs = function () {
    return Ls(this) ? Fs(this) : this;
  }),
  (Ft.add = function (e) {
    for (var t = Math.max(this.g.length, e.g.length), n = [], r = 0, i = 0; i <= t; i++) {
      var s = r + (65535 & this.D(i)) + (65535 & e.D(i)),
        o = (s >>> 16) + (this.D(i) >>> 16) + (e.D(i) >>> 16);
      ((r = o >>> 16), (s &= 65535), (o &= 65535), (n[i] = (o << 16) | s));
    }
    return new As(n, -2147483648 & n[n.length - 1] ? -1 : 0);
  }),
  (Ft.R = function (e) {
    if (Ms(this) || Ms(e)) return Os;
    if (Ls(this)) return Ls(e) ? Fs(this).R(Fs(e)) : Fs(Fs(this).R(e));
    if (Ls(e)) return Fs(this.R(Fs(e)));
    if (0 > this.X(Ps) && 0 > e.X(Ps)) return xs(this.ea() * e.ea());
    for (var t = this.g.length + e.g.length, n = [], r = 0; r < 2 * t; r++) n[r] = 0;
    for (r = 0; r < this.g.length; r++)
      for (var i = 0; i < e.g.length; i++) {
        var s = this.D(r) >>> 16,
          o = 65535 & this.D(r),
          a = e.D(i) >>> 16,
          c = 65535 & e.D(i);
        ((n[2 * r + 2 * i] += o * c),
          Vs(n, 2 * r + 2 * i),
          (n[2 * r + 2 * i + 1] += s * c),
          Vs(n, 2 * r + 2 * i + 1),
          (n[2 * r + 2 * i + 1] += o * a),
          Vs(n, 2 * r + 2 * i + 1),
          (n[2 * r + 2 * i + 2] += s * a),
          Vs(n, 2 * r + 2 * i + 2));
      }
    for (r = 0; r < t; r++) n[r] = (n[2 * r + 1] << 16) | n[2 * r];
    for (r = t; r < 2 * t; r++) n[r] = 0;
    return new As(n, 0);
  }),
  (Ft.gb = function (e) {
    return js(this, e).h;
  }),
  (Ft.and = function (e) {
    for (var t = Math.max(this.g.length, e.g.length), n = [], r = 0; r < t; r++)
      n[r] = this.D(r) & e.D(r);
    return new As(n, this.h & e.h);
  }),
  (Ft.or = function (e) {
    for (var t = Math.max(this.g.length, e.g.length), n = [], r = 0; r < t; r++)
      n[r] = this.D(r) | e.D(r);
    return new As(n, this.h | e.h);
  }),
  (Ft.xor = function (e) {
    for (var t = Math.max(this.g.length, e.g.length), n = [], r = 0; r < t; r++)
      n[r] = this.D(r) ^ e.D(r);
    return new As(n, this.h ^ e.h);
  }),
  (bs.prototype.createWebChannel = bs.prototype.g),
  (Is.prototype.send = Is.prototype.u),
  (Is.prototype.open = Is.prototype.m),
  (Is.prototype.close = Is.prototype.close),
  (Ar.NO_ERROR = 0),
  (Ar.TIMEOUT = 8),
  (Ar.HTTP_ERROR = 6),
  (kr.COMPLETE = 'complete'),
  (Nr.EventType = Rr),
  (Rr.OPEN = 'a'),
  (Rr.CLOSE = 'b'),
  (Rr.ERROR = 'c'),
  (Rr.MESSAGE = 'd'),
  (Wn.prototype.listen = Wn.prototype.O),
  (Bi.prototype.listenOnce = Bi.prototype.P),
  (Bi.prototype.getLastError = Bi.prototype.Sa),
  (Bi.prototype.getLastErrorCode = Bi.prototype.Ia),
  (Bi.prototype.getStatus = Bi.prototype.da),
  (Bi.prototype.getResponseJson = Bi.prototype.Wa),
  (Bi.prototype.getResponseText = Bi.prototype.ja),
  (Bi.prototype.send = Bi.prototype.ha),
  (Bi.prototype.setWithCredentials = Bi.prototype.Oa),
  (Ss.prototype.digest = Ss.prototype.l),
  (Ss.prototype.reset = Ss.prototype.reset),
  (Ss.prototype.update = Ss.prototype.j),
  (As.prototype.add = As.prototype.add),
  (As.prototype.multiply = As.prototype.R),
  (As.prototype.modulo = As.prototype.gb),
  (As.prototype.compare = As.prototype.X),
  (As.prototype.toNumber = As.prototype.ea),
  (As.prototype.toString = As.prototype.toString),
  (As.prototype.getBits = As.prototype.D),
  (As.fromNumber = xs),
  (As.fromString = function e(t, n) {
    if (0 == t.length) throw Error('number format error: empty string');
    if (2 > (n = n || 10) || 36 < n) throw Error('radix out of range: ' + n);
    if ('-' == t.charAt(0)) return Fs(e(t.substring(1), n));
    if (0 <= t.indexOf('-')) throw Error('number format error: interior "-" character');
    for (var r = xs(Math.pow(n, 8)), i = Os, s = 0; s < t.length; s += 8) {
      var o = Math.min(8, t.length - s),
        a = parseInt(t.substring(s, s + o), n);
      8 > o ? ((o = xs(Math.pow(n, o))), (i = i.R(o).add(xs(a)))) : (i = (i = i.R(r)).add(xs(a)));
    }
    return i;
  }));
var Gs = (Vt.createWebChannelTransport = function () {
    return new bs();
  }),
  $s = (Vt.getStatEventTarget = function () {
    return br();
  }),
  Ks = (Vt.ErrorCode = Ar),
  Ws = (Vt.EventType = kr),
  Hs = (Vt.Event = wr),
  Qs = (Vt.Stat = {
    xb: 0,
    Ab: 1,
    Bb: 2,
    Ub: 3,
    Zb: 4,
    Wb: 5,
    Xb: 6,
    Vb: 7,
    Tb: 8,
    Yb: 9,
    PROXY: 10,
    NOPROXY: 11,
    Rb: 12,
    Nb: 13,
    Ob: 14,
    Mb: 15,
    Pb: 16,
    Qb: 17,
    tb: 18,
    sb: 19,
    ub: 20,
  }),
  Ys = ((Vt.FetchXmlHttpFactory = Ri), (Vt.WebChannel = Nr)),
  Xs = (Vt.XhrIo = Bi),
  Js = (Vt.Md5 = Ss),
  Zs = (Vt.Integer = As);
class eo {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return null != this.uid;
  }
  toKey() {
    return this.isAuthenticated() ? 'uid:' + this.uid : 'anonymous-user';
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
((eo.UNAUTHENTICATED = new eo(null)),
  (eo.GOOGLE_CREDENTIALS = new eo('google-credentials-uid')),
  (eo.FIRST_PARTY = new eo('first-party-uid')),
  (eo.MOCK_USER = new eo('mock-user')));
let to = '10.11.0';
const no = new Ve('@firebase/firestore');
function ro() {
  return no.logLevel;
}
function io(e, ...t) {
  if (no.logLevel <= Pe.DEBUG) {
    const n = t.map(ao);
    no.debug(`Firestore (${to}): ${e}`, ...n);
  }
}
function so(e, ...t) {
  if (no.logLevel <= Pe.ERROR) {
    const n = t.map(ao);
    no.error(`Firestore (${to}): ${e}`, ...n);
  }
}
function oo(e, ...t) {
  if (no.logLevel <= Pe.WARN) {
    const n = t.map(ao);
    no.warn(`Firestore (${to}): ${e}`, ...n);
  }
}
function ao(e) {
  if ('string' == typeof e) return e;
  try {
    return (function (e) {
      return JSON.stringify(e);
    })(e);
  } catch (t) {
    return e;
  }
}
function co(e = 'Unexpected state') {
  const t = `FIRESTORE (${to}) INTERNAL ASSERTION FAILED: ` + e;
  throw (so(t), new Error(t));
}
function uo(e, t) {
  e || co();
}
function lo(e, t) {
  return e;
}
const ho = {
  OK: 'ok',
  CANCELLED: 'cancelled',
  UNKNOWN: 'unknown',
  INVALID_ARGUMENT: 'invalid-argument',
  DEADLINE_EXCEEDED: 'deadline-exceeded',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  PERMISSION_DENIED: 'permission-denied',
  UNAUTHENTICATED: 'unauthenticated',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
  FAILED_PRECONDITION: 'failed-precondition',
  ABORTED: 'aborted',
  OUT_OF_RANGE: 'out-of-range',
  UNIMPLEMENTED: 'unimplemented',
  INTERNAL: 'internal',
  UNAVAILABLE: 'unavailable',
  DATA_LOSS: 'data-loss',
};
class fo extends ve {
  constructor(e, t) {
    (super(e, t),
      (this.code = e),
      (this.message = t),
      (this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`));
  }
}
class po {
  constructor() {
    this.promise = new Promise((e, t) => {
      ((this.resolve = e), (this.reject = t));
    });
  }
}
class go {
  constructor(e, t) {
    ((this.user = t),
      (this.type = 'OAuth'),
      (this.headers = new Map()),
      this.headers.set('Authorization', `Bearer ${e}`));
  }
}
class mo {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {}
  start(e, t) {
    e.enqueueRetryable(() => t(eo.UNAUTHENTICATED));
  }
  shutdown() {}
}
class yo {
  constructor(e) {
    ((this.t = e),
      (this.currentUser = eo.UNAUTHENTICATED),
      (this.i = 0),
      (this.forceRefresh = !1),
      (this.auth = null));
  }
  start(e, t) {
    let n = this.i;
    const r = e => (this.i !== n ? ((n = this.i), t(e)) : Promise.resolve());
    let i = new po();
    this.o = () => {
      (this.i++,
        (this.currentUser = this.u()),
        i.resolve(),
        (i = new po()),
        e.enqueueRetryable(() => r(this.currentUser)));
    };
    const s = () => {
        const t = i;
        e.enqueueRetryable(async () => {
          (await t.promise, await r(this.currentUser));
        });
      },
      o = e => {
        (io('FirebaseAuthCredentialsProvider', 'Auth detected'),
          (this.auth = e),
          this.auth.addAuthTokenListener(this.o),
          s());
      };
    (this.t.onInit(e => o(e)),
      setTimeout(() => {
        if (!this.auth) {
          const e = this.t.getImmediate({ optional: !0 });
          e
            ? o(e)
            : (io('FirebaseAuthCredentialsProvider', 'Auth not yet detected'),
              i.resolve(),
              (i = new po()));
        }
      }, 0),
      s());
  }
  getToken() {
    const e = this.i,
      t = this.forceRefresh;
    return (
      (this.forceRefresh = !1),
      this.auth
        ? this.auth
            .getToken(t)
            .then(t =>
              this.i !== e
                ? (io('FirebaseAuthCredentialsProvider', 'getToken aborted due to token change.'),
                  this.getToken())
                : t
                  ? (uo('string' == typeof t.accessToken), new go(t.accessToken, this.currentUser))
                  : null
            )
        : Promise.resolve(null)
    );
  }
  invalidateToken() {
    this.forceRefresh = !0;
  }
  shutdown() {
    this.auth && this.auth.removeAuthTokenListener(this.o);
  }
  u() {
    const e = this.auth && this.auth.getUid();
    return (uo(null === e || 'string' == typeof e), new eo(e));
  }
}
class wo {
  constructor(e, t, n) {
    ((this.l = e),
      (this.h = t),
      (this.P = n),
      (this.type = 'FirstParty'),
      (this.user = eo.FIRST_PARTY),
      (this.I = new Map()));
  }
  T() {
    return this.P ? this.P() : null;
  }
  get headers() {
    this.I.set('X-Goog-AuthUser', this.l);
    const e = this.T();
    return (
      e && this.I.set('Authorization', e),
      this.h && this.I.set('X-Goog-Iam-Authorization-Token', this.h),
      this.I
    );
  }
}
class vo {
  constructor(e, t, n) {
    ((this.l = e), (this.h = t), (this.P = n));
  }
  getToken() {
    return Promise.resolve(new wo(this.l, this.h, this.P));
  }
  start(e, t) {
    e.enqueueRetryable(() => t(eo.FIRST_PARTY));
  }
  shutdown() {}
  invalidateToken() {}
}
class bo {
  constructor(e) {
    ((this.value = e),
      (this.type = 'AppCheck'),
      (this.headers = new Map()),
      e && e.length > 0 && this.headers.set('x-firebase-appcheck', this.value));
  }
}
class Io {
  constructor(e) {
    ((this.A = e), (this.forceRefresh = !1), (this.appCheck = null), (this.R = null));
  }
  start(e, t) {
    const n = e => {
      null != e.error &&
        io(
          'FirebaseAppCheckTokenProvider',
          `Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`
        );
      const n = e.token !== this.R;
      return (
        (this.R = e.token),
        io('FirebaseAppCheckTokenProvider', `Received ${n ? 'new' : 'existing'} token.`),
        n ? t(e.token) : Promise.resolve()
      );
    };
    this.o = t => {
      e.enqueueRetryable(() => n(t));
    };
    const r = e => {
      (io('FirebaseAppCheckTokenProvider', 'AppCheck detected'),
        (this.appCheck = e),
        this.appCheck.addTokenListener(this.o));
    };
    (this.A.onInit(e => r(e)),
      setTimeout(() => {
        if (!this.appCheck) {
          const e = this.A.getImmediate({ optional: !0 });
          e ? r(e) : io('FirebaseAppCheckTokenProvider', 'AppCheck not yet detected');
        }
      }, 0));
  }
  getToken() {
    const e = this.forceRefresh;
    return (
      (this.forceRefresh = !1),
      this.appCheck
        ? this.appCheck
            .getToken(e)
            .then(e =>
              e ? (uo('string' == typeof e.token), (this.R = e.token), new bo(e.token)) : null
            )
        : Promise.resolve(null)
    );
  }
  invalidateToken() {
    this.forceRefresh = !0;
  }
  shutdown() {
    this.appCheck && this.appCheck.removeTokenListener(this.o);
  }
}
function To(e) {
  const t = 'undefined' != typeof self && (self.crypto || self.msCrypto),
    n = new Uint8Array(e);
  if (t && 'function' == typeof t.getRandomValues) t.getRandomValues(n);
  else for (let t = 0; t < e; t++) n[t] = Math.floor(256 * Math.random());
  return n;
}
class _o {
  static newId() {
    const e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      t = Math.floor(256 / e.length) * e.length;
    let n = '';
    for (; n.length < 20; ) {
      const r = To(40);
      for (let i = 0; i < r.length; ++i)
        n.length < 20 && r[i] < t && (n += e.charAt(r[i] % e.length));
    }
    return n;
  }
}
function Eo(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function So(e, t, n) {
  return e.length === t.length && e.every((e, r) => n(e, t[r]));
}
function Co(e) {
  return e + '\0';
}
class Ao {
  constructor(e, t) {
    if (((this.seconds = e), (this.nanoseconds = t), t < 0))
      throw new fo(ho.INVALID_ARGUMENT, 'Timestamp nanoseconds out of range: ' + t);
    if (t >= 1e9) throw new fo(ho.INVALID_ARGUMENT, 'Timestamp nanoseconds out of range: ' + t);
    if (e < -62135596800) throw new fo(ho.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e);
    if (e >= 253402300800)
      throw new fo(ho.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e);
  }
  static now() {
    return Ao.fromMillis(Date.now());
  }
  static fromDate(e) {
    return Ao.fromMillis(e.getTime());
  }
  static fromMillis(e) {
    const t = Math.floor(e / 1e3),
      n = Math.floor(1e6 * (e - 1e3 * t));
    return new Ao(t, n);
  }
  toDate() {
    return new Date(this.toMillis());
  }
  toMillis() {
    return 1e3 * this.seconds + this.nanoseconds / 1e6;
  }
  _compareTo(e) {
    return this.seconds === e.seconds
      ? Eo(this.nanoseconds, e.nanoseconds)
      : Eo(this.seconds, e.seconds);
  }
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  toString() {
    return 'Timestamp(seconds=' + this.seconds + ', nanoseconds=' + this.nanoseconds + ')';
  }
  toJSON() {
    return { seconds: this.seconds, nanoseconds: this.nanoseconds };
  }
  valueOf() {
    const e = this.seconds - -62135596800;
    return String(e).padStart(12, '0') + '.' + String(this.nanoseconds).padStart(9, '0');
  }
}
class ko {
  constructor(e) {
    this.timestamp = e;
  }
  static fromTimestamp(e) {
    return new ko(e);
  }
  static min() {
    return new ko(new Ao(0, 0));
  }
  static max() {
    return new ko(new Ao(253402300799, 999999999));
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
  }
  toString() {
    return 'SnapshotVersion(' + this.timestamp.toString() + ')';
  }
  toTimestamp() {
    return this.timestamp;
  }
}
class Do {
  constructor(e, t, n) {
    (void 0 === t ? (t = 0) : t > e.length && co(),
      void 0 === n ? (n = e.length - t) : n > e.length - t && co(),
      (this.segments = e),
      (this.offset = t),
      (this.len = n));
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return 0 === Do.comparator(this, e);
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return (
      e instanceof Do
        ? e.forEach(e => {
            t.push(e);
          })
        : t.push(e),
      this.construct(t)
    );
  }
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return (
      (e = void 0 === e ? 1 : e),
      this.construct(this.segments, this.offset + e, this.length - e)
    );
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return 0 === this.length;
  }
  isPrefixOf(e) {
    if (e.length < this.length) return !1;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
    return !0;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length) return !1;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
    return !0;
  }
  forEach(e) {
    for (let t = this.offset, n = this.limit(); t < n; t++) e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  static comparator(e, t) {
    const n = Math.min(e.length, t.length);
    for (let r = 0; r < n; r++) {
      const n = e.get(r),
        i = t.get(r);
      if (n < i) return -1;
      if (n > i) return 1;
    }
    return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
  }
}
class xo extends Do {
  construct(e, t, n) {
    return new xo(e, t, n);
  }
  canonicalString() {
    return this.toArray().join('/');
  }
  toString() {
    return this.canonicalString();
  }
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join('/');
  }
  static fromString(...e) {
    const t = [];
    for (const n of e) {
      if (n.indexOf('//') >= 0)
        throw new fo(
          ho.INVALID_ARGUMENT,
          `Invalid segment (${n}). Paths must not contain // in them.`
        );
      t.push(...n.split('/').filter(e => e.length > 0));
    }
    return new xo(t);
  }
  static emptyPath() {
    return new xo([]);
  }
}
const No = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
class Oo extends Do {
  construct(e, t, n) {
    return new Oo(e, t, n);
  }
  static isValidIdentifier(e) {
    return No.test(e);
  }
  canonicalString() {
    return this.toArray()
      .map(
        e => (
          (e = e.replace(/\\/g, '\\\\').replace(/`/g, '\\`')),
          Oo.isValidIdentifier(e) || (e = '`' + e + '`'),
          e
        )
      )
      .join('.');
  }
  toString() {
    return this.canonicalString();
  }
  isKeyField() {
    return 1 === this.length && '__name__' === this.get(0);
  }
  static keyField() {
    return new Oo(['__name__']);
  }
  static fromServerFormat(e) {
    const t = [];
    let n = '',
      r = 0;
    const i = () => {
      if (0 === n.length)
        throw new fo(
          ho.INVALID_ARGUMENT,
          `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`
        );
      (t.push(n), (n = ''));
    };
    let s = !1;
    for (; r < e.length; ) {
      const t = e[r];
      if ('\\' === t) {
        if (r + 1 === e.length)
          throw new fo(ho.INVALID_ARGUMENT, 'Path has trailing escape character: ' + e);
        const t = e[r + 1];
        if ('\\' !== t && '.' !== t && '`' !== t)
          throw new fo(ho.INVALID_ARGUMENT, 'Path has invalid escape sequence: ' + e);
        ((n += t), (r += 2));
      } else '`' === t ? ((s = !s), r++) : '.' !== t || s ? ((n += t), r++) : (i(), r++);
    }
    if ((i(), s)) throw new fo(ho.INVALID_ARGUMENT, 'Unterminated ` in path: ' + e);
    return new Oo(t);
  }
  static emptyPath() {
    return new Oo([]);
  }
}
class Ro {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new Ro(xo.fromString(e));
  }
  static fromName(e) {
    return new Ro(xo.fromString(e).popFirst(5));
  }
  static empty() {
    return new Ro(xo.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return null !== e && 0 === xo.comparator(this.path, e.path);
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return xo.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  static fromSegments(e) {
    return new Ro(new xo(e.slice()));
  }
}
class Po {
  constructor(e, t, n, r) {
    ((this.indexId = e), (this.collectionGroup = t), (this.fields = n), (this.indexState = r));
  }
}
function Mo(e) {
  return e.fields.find(e => 2 === e.kind);
}
function Lo(e) {
  return e.fields.filter(e => 2 !== e.kind);
}
Po.UNKNOWN_ID = -1;
class Fo {
  constructor(e, t) {
    ((this.fieldPath = e), (this.kind = t));
  }
}
class Uo {
  constructor(e, t) {
    ((this.sequenceNumber = e), (this.offset = t));
  }
  static empty() {
    return new Uo(0, Bo.min());
  }
}
function Vo(e) {
  return new Bo(e.readTime, e.key, -1);
}
class Bo {
  constructor(e, t, n) {
    ((this.readTime = e), (this.documentKey = t), (this.largestBatchId = n));
  }
  static min() {
    return new Bo(ko.min(), Ro.empty(), -1);
  }
  static max() {
    return new Bo(ko.max(), Ro.empty(), -1);
  }
}
function jo(e, t) {
  let n = e.readTime.compareTo(t.readTime);
  return 0 !== n
    ? n
    : ((n = Ro.comparator(e.documentKey, t.documentKey)),
      0 !== n ? n : Eo(e.largestBatchId, t.largestBatchId));
}
const zo =
  'The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.';
class qo {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach(e => e());
  }
}
async function Go(e) {
  if (e.code !== ho.FAILED_PRECONDITION || e.message !== zo) throw e;
  io('LocalStore', 'Unexpectedly lost primary lease');
}
class $o {
  constructor(e) {
    ((this.nextCallback = null),
      (this.catchCallback = null),
      (this.result = void 0),
      (this.error = void 0),
      (this.isDone = !1),
      (this.callbackAttached = !1),
      e(
        e => {
          ((this.isDone = !0), (this.result = e), this.nextCallback && this.nextCallback(e));
        },
        e => {
          ((this.isDone = !0), (this.error = e), this.catchCallback && this.catchCallback(e));
        }
      ));
  }
  catch(e) {
    return this.next(void 0, e);
  }
  next(e, t) {
    return (
      this.callbackAttached && co(),
      (this.callbackAttached = !0),
      this.isDone
        ? this.error
          ? this.wrapFailure(t, this.error)
          : this.wrapSuccess(e, this.result)
        : new $o((n, r) => {
            ((this.nextCallback = t => {
              this.wrapSuccess(e, t).next(n, r);
            }),
              (this.catchCallback = e => {
                this.wrapFailure(t, e).next(n, r);
              }));
          })
    );
  }
  toPromise() {
    return new Promise((e, t) => {
      this.next(e, t);
    });
  }
  wrapUserFunction(e) {
    try {
      const t = e();
      return t instanceof $o ? t : $o.resolve(t);
    } catch (e) {
      return $o.reject(e);
    }
  }
  wrapSuccess(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : $o.resolve(t);
  }
  wrapFailure(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : $o.reject(t);
  }
  static resolve(e) {
    return new $o((t, n) => {
      t(e);
    });
  }
  static reject(e) {
    return new $o((t, n) => {
      n(e);
    });
  }
  static waitFor(e) {
    return new $o((t, n) => {
      let r = 0,
        i = 0,
        s = !1;
      (e.forEach(e => {
        (++r,
          e.next(
            () => {
              (++i, s && i === r && t());
            },
            e => n(e)
          ));
      }),
        (s = !0),
        i === r && t());
    });
  }
  static or(e) {
    let t = $o.resolve(!1);
    for (const n of e) t = t.next(e => (e ? $o.resolve(e) : n()));
    return t;
  }
  static forEach(e, t) {
    const n = [];
    return (
      e.forEach((e, r) => {
        n.push(t.call(this, e, r));
      }),
      this.waitFor(n)
    );
  }
  static mapArray(e, t) {
    return new $o((n, r) => {
      const i = e.length,
        s = new Array(i);
      let o = 0;
      for (let a = 0; a < i; a++) {
        const c = a;
        t(e[c]).next(
          e => {
            ((s[c] = e), ++o, o === i && n(s));
          },
          e => r(e)
        );
      }
    });
  }
  static doWhile(e, t) {
    return new $o((n, r) => {
      const i = () => {
        !0 === e()
          ? t().next(() => {
              i();
            }, r)
          : n();
      };
      i();
    });
  }
}
class Ko {
  constructor(e, t) {
    ((this.action = e),
      (this.transaction = t),
      (this.aborted = !1),
      (this.V = new po()),
      (this.transaction.oncomplete = () => {
        this.V.resolve();
      }),
      (this.transaction.onabort = () => {
        t.error ? this.V.reject(new Qo(e, t.error)) : this.V.resolve();
      }),
      (this.transaction.onerror = t => {
        const n = ea(t.target.error);
        this.V.reject(new Qo(e, n));
      }));
  }
  static open(e, t, n, r) {
    try {
      return new Ko(t, e.transaction(r, n));
    } catch (e) {
      throw new Qo(t, e);
    }
  }
  get m() {
    return this.V.promise;
  }
  abort(e) {
    (e && this.V.reject(e),
      this.aborted ||
        (io('SimpleDb', 'Aborting transaction:', e ? e.message : 'Client-initiated abort'),
        (this.aborted = !0),
        this.transaction.abort()));
  }
  g() {
    const e = this.transaction;
    this.aborted || 'function' != typeof e.commit || e.commit();
  }
  store(e) {
    const t = this.transaction.objectStore(e);
    return new Xo(t);
  }
}
class Wo {
  constructor(e, t, n) {
    ((this.name = e),
      (this.version = t),
      (this.p = n),
      12.2 === Wo.S(me()) &&
        so(
          'Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.'
        ));
  }
  static delete(e) {
    return (
      io('SimpleDb', 'Removing database:', e),
      Jo(window.indexedDB.deleteDatabase(e)).toPromise()
    );
  }
  static D() {
    if (!we()) return !1;
    if (Wo.C()) return !0;
    const e = me(),
      t = Wo.S(e),
      n = 0 < t && t < 10,
      r = Wo.v(e),
      i = 0 < r && r < 4.5;
    return !(
      e.indexOf('MSIE ') > 0 ||
      e.indexOf('Trident/') > 0 ||
      e.indexOf('Edge/') > 0 ||
      n ||
      i
    );
  }
  static C() {
    var e;
    return (
      'undefined' != typeof process &&
      'YES' === (null === (e = process.__PRIVATE_env) || void 0 === e ? void 0 : e.F)
    );
  }
  static M(e, t) {
    return e.store(t);
  }
  static S(e) {
    const t = e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),
      n = t ? t[1].split('_').slice(0, 2).join('.') : '-1';
    return Number(n);
  }
  static v(e) {
    const t = e.match(/Android ([\d.]+)/i),
      n = t ? t[1].split('.').slice(0, 2).join('.') : '-1';
    return Number(n);
  }
  async O(e) {
    return (
      this.db ||
        (io('SimpleDb', 'Opening database:', this.name),
        (this.db = await new Promise((t, n) => {
          const r = indexedDB.open(this.name, this.version);
          ((r.onsuccess = e => {
            const n = e.target.result;
            t(n);
          }),
            (r.onblocked = () => {
              n(
                new Qo(
                  e,
                  'Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed.'
                )
              );
            }),
            (r.onerror = t => {
              const r = t.target.error;
              'VersionError' === r.name
                ? n(
                    new fo(
                      ho.FAILED_PRECONDITION,
                      'A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.'
                    )
                  )
                : 'InvalidStateError' === r.name
                  ? n(
                      new fo(
                        ho.FAILED_PRECONDITION,
                        'Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: ' +
                          r
                      )
                    )
                  : n(new Qo(e, r));
            }),
            (r.onupgradeneeded = e => {
              io(
                'SimpleDb',
                'Database "' + this.name + '" requires upgrade from version:',
                e.oldVersion
              );
              const t = e.target.result;
              this.p.N(t, r.transaction, e.oldVersion, this.version).next(() => {
                io('SimpleDb', 'Database upgrade to version ' + this.version + ' complete');
              });
            }));
        }))),
      this.L && (this.db.onversionchange = e => this.L(e)),
      this.db
    );
  }
  B(e) {
    ((this.L = e), this.db && (this.db.onversionchange = t => e(t)));
  }
  async runTransaction(e, t, n, r) {
    const i = 'readonly' === t;
    let s = 0;
    for (;;) {
      ++s;
      try {
        this.db = await this.O(e);
        const t = Ko.open(this.db, e, i ? 'readonly' : 'readwrite', n),
          s = r(t)
            .next(e => (t.g(), e))
            .catch(e => (t.abort(e), $o.reject(e)))
            .toPromise();
        return (s.catch(() => {}), await t.m, s);
      } catch (e) {
        const t = e,
          n = 'FirebaseError' !== t.name && s < 3;
        if (
          (io('SimpleDb', 'Transaction failed with error:', t.message, 'Retrying:', n),
          this.close(),
          !n)
        )
          return Promise.reject(t);
      }
    }
  }
  close() {
    (this.db && this.db.close(), (this.db = void 0));
  }
}
class Ho {
  constructor(e) {
    ((this.k = e), (this.q = !1), (this.K = null));
  }
  get isDone() {
    return this.q;
  }
  get $() {
    return this.K;
  }
  set cursor(e) {
    this.k = e;
  }
  done() {
    this.q = !0;
  }
  U(e) {
    this.K = e;
  }
  delete() {
    return Jo(this.k.delete());
  }
}
class Qo extends fo {
  constructor(e, t) {
    (super(ho.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${t}`),
      (this.name = 'IndexedDbTransactionError'));
  }
}
function Yo(e) {
  return 'IndexedDbTransactionError' === e.name;
}
class Xo {
  constructor(e) {
    this.store = e;
  }
  put(e, t) {
    let n;
    return (
      void 0 !== t
        ? (io('SimpleDb', 'PUT', this.store.name, e, t), (n = this.store.put(t, e)))
        : (io('SimpleDb', 'PUT', this.store.name, '<auto-key>', e), (n = this.store.put(e))),
      Jo(n)
    );
  }
  add(e) {
    return (io('SimpleDb', 'ADD', this.store.name, e, e), Jo(this.store.add(e)));
  }
  get(e) {
    return Jo(this.store.get(e)).next(
      t => (void 0 === t && (t = null), io('SimpleDb', 'GET', this.store.name, e, t), t)
    );
  }
  delete(e) {
    return (io('SimpleDb', 'DELETE', this.store.name, e), Jo(this.store.delete(e)));
  }
  count() {
    return (io('SimpleDb', 'COUNT', this.store.name), Jo(this.store.count()));
  }
  W(e, t) {
    const n = this.options(e, t),
      r = n.index ? this.store.index(n.index) : this.store;
    if ('function' == typeof r.getAll) {
      const e = r.getAll(n.range);
      return new $o((t, n) => {
        ((e.onerror = e => {
          n(e.target.error);
        }),
          (e.onsuccess = e => {
            t(e.target.result);
          }));
      });
    }
    {
      const e = this.cursor(n),
        t = [];
      return this.G(e, (e, n) => {
        t.push(n);
      }).next(() => t);
    }
  }
  j(e, t) {
    const n = this.store.getAll(e, null === t ? void 0 : t);
    return new $o((e, t) => {
      ((n.onerror = e => {
        t(e.target.error);
      }),
        (n.onsuccess = t => {
          e(t.target.result);
        }));
    });
  }
  H(e, t) {
    io('SimpleDb', 'DELETE ALL', this.store.name);
    const n = this.options(e, t);
    n.J = !1;
    const r = this.cursor(n);
    return this.G(r, (e, t, n) => n.delete());
  }
  Y(e, t) {
    let n;
    t ? (n = e) : ((n = {}), (t = e));
    const r = this.cursor(n);
    return this.G(r, t);
  }
  Z(e) {
    const t = this.cursor({});
    return new $o((n, r) => {
      ((t.onerror = e => {
        const t = ea(e.target.error);
        r(t);
      }),
        (t.onsuccess = t => {
          const r = t.target.result;
          r
            ? e(r.primaryKey, r.value).next(e => {
                e ? r.continue() : n();
              })
            : n();
        }));
    });
  }
  G(e, t) {
    const n = [];
    return new $o((r, i) => {
      ((e.onerror = e => {
        i(e.target.error);
      }),
        (e.onsuccess = e => {
          const i = e.target.result;
          if (!i) return void r();
          const s = new Ho(i),
            o = t(i.primaryKey, i.value, s);
          if (o instanceof $o) {
            const e = o.catch(e => (s.done(), $o.reject(e)));
            n.push(e);
          }
          s.isDone ? r() : null === s.$ ? i.continue() : i.continue(s.$);
        }));
    }).next(() => $o.waitFor(n));
  }
  options(e, t) {
    let n;
    return (void 0 !== e && ('string' == typeof e ? (n = e) : (t = e)), { index: n, range: t });
  }
  cursor(e) {
    let t = 'next';
    if ((e.reverse && (t = 'prev'), e.index)) {
      const n = this.store.index(e.index);
      return e.J ? n.openKeyCursor(e.range, t) : n.openCursor(e.range, t);
    }
    return this.store.openCursor(e.range, t);
  }
}
function Jo(e) {
  return new $o((t, n) => {
    ((e.onsuccess = e => {
      const n = e.target.result;
      t(n);
    }),
      (e.onerror = e => {
        const t = ea(e.target.error);
        n(t);
      }));
  });
}
let Zo = !1;
function ea(e) {
  const t = Wo.S(me());
  if (t >= 12.2 && t < 13) {
    const t = 'An internal error was encountered in the Indexed Database server';
    if (e.message.indexOf(t) >= 0) {
      const e = new fo(
        'internal',
        `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`
      );
      return (
        Zo ||
          ((Zo = !0),
          setTimeout(() => {
            throw e;
          }, 0)),
        e
      );
    }
  }
  return e;
}
class ta {
  constructor(e, t) {
    ((this.asyncQueue = e), (this.X = t), (this.task = null));
  }
  start() {
    this.ee(15e3);
  }
  stop() {
    this.task && (this.task.cancel(), (this.task = null));
  }
  get started() {
    return null !== this.task;
  }
  ee(e) {
    (io('IndexBackfiller', `Scheduled in ${e}ms`),
      (this.task = this.asyncQueue.enqueueAfterDelay('index_backfill', e, async () => {
        this.task = null;
        try {
          io('IndexBackfiller', `Documents written: ${await this.X.te()}`);
        } catch (e) {
          Yo(e)
            ? io('IndexBackfiller', 'Ignoring IndexedDB error during index backfill: ', e)
            : await Go(e);
        }
        await this.ee(6e4);
      })));
  }
}
class na {
  constructor(e, t) {
    ((this.localStore = e), (this.persistence = t));
  }
  async te(e = 50) {
    return this.persistence.runTransaction('Backfill Indexes', 'readwrite-primary', t =>
      this.ne(t, e)
    );
  }
  ne(e, t) {
    const n = new Set();
    let r = t,
      i = !0;
    return $o
      .doWhile(
        () => !0 === i && r > 0,
        () =>
          this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t => {
            if (null !== t && !n.has(t))
              return (
                io('IndexBackfiller', `Processing collection: ${t}`),
                this.re(e, t, r).next(e => {
                  ((r -= e), n.add(t));
                })
              );
            i = !1;
          })
      )
      .next(() => t - r);
  }
  re(e, t, n) {
    return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e, t).next(r =>
      this.localStore.localDocuments.getNextDocuments(e, t, r, n).next(n => {
        const i = n.changes;
        return this.localStore.indexManager
          .updateIndexEntries(e, i)
          .next(() => this.ie(r, n))
          .next(
            n => (
              io('IndexBackfiller', `Updating offset: ${n}`),
              this.localStore.indexManager.updateCollectionGroup(e, t, n)
            )
          )
          .next(() => i.size);
      })
    );
  }
  ie(e, t) {
    let n = e;
    return (
      t.changes.forEach((e, t) => {
        const r = Vo(t);
        jo(r, n) > 0 && (n = r);
      }),
      new Bo(n.readTime, n.documentKey, Math.max(t.batchId, e.largestBatchId))
    );
  }
}
class ra {
  constructor(e, t) {
    ((this.previousValue = e),
      t &&
        ((t.sequenceNumberHandler = e => this.se(e)), (this.oe = e => t.writeSequenceNumber(e))));
  }
  se(e) {
    return ((this.previousValue = Math.max(e, this.previousValue)), this.previousValue);
  }
  next() {
    const e = ++this.previousValue;
    return (this.oe && this.oe(e), e);
  }
}
function ia(e) {
  return null == e;
}
function sa(e) {
  return 0 === e && 1 / e == -1 / 0;
}
function oa(e) {
  let t = '';
  for (let n = 0; n < e.length; n++) (t.length > 0 && (t = ca(t)), (t = aa(e.get(n), t)));
  return ca(t);
}
function aa(e, t) {
  let n = t;
  const r = e.length;
  for (let t = 0; t < r; t++) {
    const r = e.charAt(t);
    switch (r) {
      case '\0':
        n += '';
        break;
      case '':
        n += '';
        break;
      default:
        n += r;
    }
  }
  return n;
}
function ca(e) {
  return e + '';
}
function ua(e) {
  const t = e.length;
  if ((uo(t >= 2), 2 === t)) return (uo('' === e.charAt(0) && '' === e.charAt(1)), xo.emptyPath());
  const n = t - 2,
    r = [];
  let i = '';
  for (let s = 0; s < t; ) {
    const t = e.indexOf('', s);
    switch (((t < 0 || t > n) && co(), e.charAt(t + 1))) {
      case '':
        const n = e.substring(s, t);
        let o;
        (0 === i.length ? (o = n) : ((i += n), (o = i), (i = '')), r.push(o));
        break;
      case '':
        ((i += e.substring(s, t)), (i += '\0'));
        break;
      case '':
        i += e.substring(s, t + 1);
        break;
      default:
        co();
    }
    s = t + 2;
  }
  return new xo(r);
}
ra._e = -1;
const la = ['userId', 'batchId'];
function ha(e, t) {
  return [e, oa(t)];
}
function da(e, t, n) {
  return [e, oa(t), n];
}
const fa = {},
  pa = ['prefixPath', 'collectionGroup', 'readTime', 'documentId'],
  ga = ['prefixPath', 'collectionGroup', 'documentId'],
  ma = ['collectionGroup', 'readTime', 'prefixPath', 'documentId'],
  ya = ['canonicalId', 'targetId'],
  wa = ['targetId', 'path'],
  va = ['path', 'targetId'],
  ba = ['collectionId', 'parent'],
  Ia = ['indexId', 'uid'],
  Ta = ['uid', 'sequenceNumber'],
  _a = ['indexId', 'uid', 'arrayValue', 'directionalValue', 'orderedDocumentKey', 'documentKey'],
  Ea = ['indexId', 'uid', 'orderedDocumentKey'],
  Sa = ['userId', 'collectionPath', 'documentId'],
  Ca = ['userId', 'collectionPath', 'largestBatchId'],
  Aa = ['userId', 'collectionGroup', 'largestBatchId'],
  ka = [
    'mutationQueues',
    'mutations',
    'documentMutations',
    'remoteDocuments',
    'targets',
    'owner',
    'targetGlobal',
    'targetDocuments',
    'clientMetadata',
    'remoteDocumentGlobal',
    'collectionParents',
    'bundles',
    'namedQueries',
  ],
  Da = [...ka, 'documentOverlays'],
  xa = [
    'mutationQueues',
    'mutations',
    'documentMutations',
    'remoteDocumentsV14',
    'targets',
    'owner',
    'targetGlobal',
    'targetDocuments',
    'clientMetadata',
    'remoteDocumentGlobal',
    'collectionParents',
    'bundles',
    'namedQueries',
    'documentOverlays',
  ],
  Na = xa,
  Oa = [...Na, 'indexConfiguration', 'indexState', 'indexEntries'],
  Ra = Oa;
class Pa extends qo {
  constructor(e, t) {
    (super(), (this.ae = e), (this.currentSequenceNumber = t));
  }
}
function Ma(e, t) {
  const n = lo(e);
  return Wo.M(n.ae, t);
}
function La(e) {
  let t = 0;
  for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
function Fa(e, t) {
  for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
}
function Ua(e) {
  for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
  return !0;
}
class Va {
  constructor(e, t) {
    ((this.comparator = e), (this.root = t || ja.EMPTY));
  }
  insert(e, t) {
    return new Va(
      this.comparator,
      this.root.insert(e, t, this.comparator).copy(null, null, ja.BLACK, null, null)
    );
  }
  remove(e) {
    return new Va(
      this.comparator,
      this.root.remove(e, this.comparator).copy(null, null, ja.BLACK, null, null)
    );
  }
  get(e) {
    let t = this.root;
    for (; !t.isEmpty(); ) {
      const n = this.comparator(e, t.key);
      if (0 === n) return t.value;
      n < 0 ? (t = t.left) : n > 0 && (t = t.right);
    }
    return null;
  }
  indexOf(e) {
    let t = 0,
      n = this.root;
    for (; !n.isEmpty(); ) {
      const r = this.comparator(e, n.key);
      if (0 === r) return t + n.left.size;
      r < 0 ? (n = n.left) : ((t += n.left.size + 1), (n = n.right));
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  get size() {
    return this.root.size;
  }
  minKey() {
    return this.root.minKey();
  }
  maxKey() {
    return this.root.maxKey();
  }
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t, n) => (e(t, n), !1));
  }
  toString() {
    const e = [];
    return (this.inorderTraversal((t, n) => (e.push(`${t}:${n}`), !1)), `{${e.join(', ')}}`);
  }
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  getIterator() {
    return new Ba(this.root, null, this.comparator, !1);
  }
  getIteratorFrom(e) {
    return new Ba(this.root, e, this.comparator, !1);
  }
  getReverseIterator() {
    return new Ba(this.root, null, this.comparator, !0);
  }
  getReverseIteratorFrom(e) {
    return new Ba(this.root, e, this.comparator, !0);
  }
}
class Ba {
  constructor(e, t, n, r) {
    ((this.isReverse = r), (this.nodeStack = []));
    let i = 1;
    for (; !e.isEmpty(); )
      if (((i = t ? n(e.key, t) : 1), t && r && (i *= -1), i < 0))
        e = this.isReverse ? e.left : e.right;
      else {
        if (0 === i) {
          this.nodeStack.push(e);
          break;
        }
        (this.nodeStack.push(e), (e = this.isReverse ? e.right : e.left));
      }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = { key: e.key, value: e.value };
    if (this.isReverse) for (e = e.left; !e.isEmpty(); ) (this.nodeStack.push(e), (e = e.right));
    else for (e = e.right; !e.isEmpty(); ) (this.nodeStack.push(e), (e = e.left));
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (0 === this.nodeStack.length) return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return { key: e.key, value: e.value };
  }
}
class ja {
  constructor(e, t, n, r, i) {
    ((this.key = e),
      (this.value = t),
      (this.color = null != n ? n : ja.RED),
      (this.left = null != r ? r : ja.EMPTY),
      (this.right = null != i ? i : ja.EMPTY),
      (this.size = this.left.size + 1 + this.right.size));
  }
  copy(e, t, n, r, i) {
    return new ja(
      null != e ? e : this.key,
      null != t ? t : this.value,
      null != n ? n : this.color,
      null != r ? r : this.left,
      null != i ? i : this.right
    );
  }
  isEmpty() {
    return !1;
  }
  inorderTraversal(e) {
    return (
      this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e)
    );
  }
  reverseTraversal(e) {
    return (
      this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e)
    );
  }
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  minKey() {
    return this.min().key;
  }
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  insert(e, t, n) {
    let r = this;
    const i = n(e, r.key);
    return (
      (r =
        i < 0
          ? r.copy(null, null, null, r.left.insert(e, t, n), null)
          : 0 === i
            ? r.copy(null, t, null, null, null)
            : r.copy(null, null, null, null, r.right.insert(e, t, n))),
      r.fixUp()
    );
  }
  removeMin() {
    if (this.left.isEmpty()) return ja.EMPTY;
    let e = this;
    return (
      e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()),
      (e = e.copy(null, null, null, e.left.removeMin(), null)),
      e.fixUp()
    );
  }
  remove(e, t) {
    let n,
      r = this;
    if (t(e, r.key) < 0)
      (r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()),
        (r = r.copy(null, null, null, r.left.remove(e, t), null)));
    else {
      if (
        (r.left.isRed() && (r = r.rotateRight()),
        r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()),
        0 === t(e, r.key))
      ) {
        if (r.right.isEmpty()) return ja.EMPTY;
        ((n = r.right.min()), (r = r.copy(n.key, n.value, null, null, r.right.removeMin())));
      }
      r = r.copy(null, null, null, null, r.right.remove(e, t));
    }
    return r.fixUp();
  }
  isRed() {
    return this.color;
  }
  fixUp() {
    let e = this;
    return (
      e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()),
      e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()),
      e.left.isRed() && e.right.isRed() && (e = e.colorFlip()),
      e
    );
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return (
      e.right.left.isRed() &&
        ((e = e.copy(null, null, null, null, e.right.rotateRight())),
        (e = e.rotateLeft()),
        (e = e.colorFlip())),
      e
    );
  }
  moveRedRight() {
    let e = this.colorFlip();
    return (e.left.left.isRed() && ((e = e.rotateRight()), (e = e.colorFlip())), e);
  }
  rotateLeft() {
    const e = this.copy(null, null, ja.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, ja.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null),
      t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  check() {
    if (this.isRed() && this.left.isRed()) throw co();
    if (this.right.isRed()) throw co();
    const e = this.left.check();
    if (e !== this.right.check()) throw co();
    return e + (this.isRed() ? 0 : 1);
  }
}
((ja.EMPTY = null),
  (ja.RED = !0),
  (ja.BLACK = !1),
  (ja.EMPTY = new (class {
    constructor() {
      this.size = 0;
    }
    get key() {
      throw co();
    }
    get value() {
      throw co();
    }
    get color() {
      throw co();
    }
    get left() {
      throw co();
    }
    get right() {
      throw co();
    }
    copy(e, t, n, r, i) {
      return this;
    }
    insert(e, t, n) {
      return new ja(e, t);
    }
    remove(e, t) {
      return this;
    }
    isEmpty() {
      return !0;
    }
    inorderTraversal(e) {
      return !1;
    }
    reverseTraversal(e) {
      return !1;
    }
    minKey() {
      return null;
    }
    maxKey() {
      return null;
    }
    isRed() {
      return !1;
    }
    checkMaxDepth() {
      return !0;
    }
    check() {
      return 0;
    }
  })()));
class za {
  constructor(e) {
    ((this.comparator = e), (this.data = new Va(this.comparator)));
  }
  has(e) {
    return null !== this.data.get(e);
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  forEach(e) {
    this.data.inorderTraversal((t, n) => (e(t), !1));
  }
  forEachInRange(e, t) {
    const n = this.data.getIteratorFrom(e[0]);
    for (; n.hasNext(); ) {
      const r = n.getNext();
      if (this.comparator(r.key, e[1]) >= 0) return;
      t(r.key);
    }
  }
  forEachWhile(e, t) {
    let n;
    for (n = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); n.hasNext(); )
      if (!e(n.getNext().key)) return;
  }
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new qa(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new qa(this.data.getIteratorFrom(e));
  }
  add(e) {
    return this.copy(this.data.remove(e).insert(e, !0));
  }
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return (
      t.size < e.size && ((t = e), (e = this)),
      e.forEach(e => {
        t = t.add(e);
      }),
      t
    );
  }
  isEqual(e) {
    if (!(e instanceof za)) return !1;
    if (this.size !== e.size) return !1;
    const t = this.data.getIterator(),
      n = e.data.getIterator();
    for (; t.hasNext(); ) {
      const e = t.getNext().key,
        r = n.getNext().key;
      if (0 !== this.comparator(e, r)) return !1;
    }
    return !0;
  }
  toArray() {
    const e = [];
    return (
      this.forEach(t => {
        e.push(t);
      }),
      e
    );
  }
  toString() {
    const e = [];
    return (this.forEach(t => e.push(t)), 'SortedSet(' + e.toString() + ')');
  }
  copy(e) {
    const t = new za(this.comparator);
    return ((t.data = e), t);
  }
}
class qa {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}
function Ga(e) {
  return e.hasNext() ? e.getNext() : void 0;
}
class $a {
  constructor(e) {
    ((this.fields = e), e.sort(Oo.comparator));
  }
  static empty() {
    return new $a([]);
  }
  unionWith(e) {
    let t = new za(Oo.comparator);
    for (const e of this.fields) t = t.add(e);
    for (const n of e) t = t.add(n);
    return new $a(t.toArray());
  }
  covers(e) {
    for (const t of this.fields) if (t.isPrefixOf(e)) return !0;
    return !1;
  }
  isEqual(e) {
    return So(this.fields, e.fields, (e, t) => e.isEqual(t));
  }
}
class Ka extends Error {
  constructor() {
    (super(...arguments), (this.name = 'Base64DecodeError'));
  }
}
class Wa {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = (function (e) {
      try {
        return atob(e);
      } catch (e) {
        throw 'undefined' != typeof DOMException && e instanceof DOMException
          ? new Ka('Invalid base64 string: ' + e)
          : e;
      }
    })(e);
    return new Wa(t);
  }
  static fromUint8Array(e) {
    const t = (function (e) {
      let t = '';
      for (let n = 0; n < e.length; ++n) t += String.fromCharCode(e[n]);
      return t;
    })(e);
    return new Wa(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () =>
        e < this.binaryString.length
          ? { value: this.binaryString.charCodeAt(e++), done: !1 }
          : { value: void 0, done: !0 },
    };
  }
  toBase64() {
    return ((e = this.binaryString), btoa(e));
    var e;
  }
  toUint8Array() {
    return (function (e) {
      const t = new Uint8Array(e.length);
      for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
      return t;
    })(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return Eo(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
}
Wa.EMPTY_BYTE_STRING = new Wa('');
const Ha = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function Qa(e) {
  if ((uo(!!e), 'string' == typeof e)) {
    let t = 0;
    const n = Ha.exec(e);
    if ((uo(!!n), n[1])) {
      let e = n[1];
      ((e = (e + '000000000').substr(0, 9)), (t = Number(e)));
    }
    const r = new Date(e);
    return { seconds: Math.floor(r.getTime() / 1e3), nanos: t };
  }
  return { seconds: Ya(e.seconds), nanos: Ya(e.nanos) };
}
function Ya(e) {
  return 'number' == typeof e ? e : 'string' == typeof e ? Number(e) : 0;
}
function Xa(e) {
  return 'string' == typeof e ? Wa.fromBase64String(e) : Wa.fromUint8Array(e);
}
function Ja(e) {
  var t, n;
  return (
    'server_timestamp' ===
    (null ===
      (n = (
        (null === (t = null == e ? void 0 : e.mapValue) || void 0 === t ? void 0 : t.fields) || {}
      ).__type__) || void 0 === n
      ? void 0
      : n.stringValue)
  );
}
function Za(e) {
  const t = e.mapValue.fields.__previous_value__;
  return Ja(t) ? Za(t) : t;
}
function ec(e) {
  const t = Qa(e.mapValue.fields.__local_write_time__.timestampValue);
  return new Ao(t.seconds, t.nanos);
}
class tc {
  constructor(e, t, n, r, i, s, o, a, c) {
    ((this.databaseId = e),
      (this.appId = t),
      (this.persistenceKey = n),
      (this.host = r),
      (this.ssl = i),
      (this.forceLongPolling = s),
      (this.autoDetectLongPolling = o),
      (this.longPollingOptions = a),
      (this.useFetchStreams = c));
  }
}
class nc {
  constructor(e, t) {
    ((this.projectId = e), (this.database = t || '(default)'));
  }
  static empty() {
    return new nc('', '');
  }
  get isDefaultDatabase() {
    return '(default)' === this.database;
  }
  isEqual(e) {
    return e instanceof nc && e.projectId === this.projectId && e.database === this.database;
  }
}
const rc = { mapValue: { fields: { __type__: { stringValue: '__max__' } } } },
  ic = { nullValue: 'NULL_VALUE' };
function sc(e) {
  return 'nullValue' in e
    ? 0
    : 'booleanValue' in e
      ? 1
      : 'integerValue' in e || 'doubleValue' in e
        ? 2
        : 'timestampValue' in e
          ? 3
          : 'stringValue' in e
            ? 5
            : 'bytesValue' in e
              ? 6
              : 'referenceValue' in e
                ? 7
                : 'geoPointValue' in e
                  ? 8
                  : 'arrayValue' in e
                    ? 9
                    : 'mapValue' in e
                      ? Ja(e)
                        ? 4
                        : vc(e)
                          ? 9007199254740991
                          : 10
                      : co();
}
function oc(e, t) {
  if (e === t) return !0;
  const n = sc(e);
  if (n !== sc(t)) return !1;
  switch (n) {
    case 0:
    case 9007199254740991:
      return !0;
    case 1:
      return e.booleanValue === t.booleanValue;
    case 4:
      return ec(e).isEqual(ec(t));
    case 3:
      return (function (e, t) {
        if (
          'string' == typeof e.timestampValue &&
          'string' == typeof t.timestampValue &&
          e.timestampValue.length === t.timestampValue.length
        )
          return e.timestampValue === t.timestampValue;
        const n = Qa(e.timestampValue),
          r = Qa(t.timestampValue);
        return n.seconds === r.seconds && n.nanos === r.nanos;
      })(e, t);
    case 5:
      return e.stringValue === t.stringValue;
    case 6:
      return (function (e, t) {
        return Xa(e.bytesValue).isEqual(Xa(t.bytesValue));
      })(e, t);
    case 7:
      return e.referenceValue === t.referenceValue;
    case 8:
      return (function (e, t) {
        return (
          Ya(e.geoPointValue.latitude) === Ya(t.geoPointValue.latitude) &&
          Ya(e.geoPointValue.longitude) === Ya(t.geoPointValue.longitude)
        );
      })(e, t);
    case 2:
      return (function (e, t) {
        if ('integerValue' in e && 'integerValue' in t)
          return Ya(e.integerValue) === Ya(t.integerValue);
        if ('doubleValue' in e && 'doubleValue' in t) {
          const n = Ya(e.doubleValue),
            r = Ya(t.doubleValue);
          return n === r ? sa(n) === sa(r) : isNaN(n) && isNaN(r);
        }
        return !1;
      })(e, t);
    case 9:
      return So(e.arrayValue.values || [], t.arrayValue.values || [], oc);
    case 10:
      return (function (e, t) {
        const n = e.mapValue.fields || {},
          r = t.mapValue.fields || {};
        if (La(n) !== La(r)) return !1;
        for (const e in n)
          if (n.hasOwnProperty(e) && (void 0 === r[e] || !oc(n[e], r[e]))) return !1;
        return !0;
      })(e, t);
    default:
      return co();
  }
}
function ac(e, t) {
  return void 0 !== (e.values || []).find(e => oc(e, t));
}
function cc(e, t) {
  if (e === t) return 0;
  const n = sc(e),
    r = sc(t);
  if (n !== r) return Eo(n, r);
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return Eo(e.booleanValue, t.booleanValue);
    case 2:
      return (function (e, t) {
        const n = Ya(e.integerValue || e.doubleValue),
          r = Ya(t.integerValue || t.doubleValue);
        return n < r ? -1 : n > r ? 1 : n === r ? 0 : isNaN(n) ? (isNaN(r) ? 0 : -1) : 1;
      })(e, t);
    case 3:
      return uc(e.timestampValue, t.timestampValue);
    case 4:
      return uc(ec(e), ec(t));
    case 5:
      return Eo(e.stringValue, t.stringValue);
    case 6:
      return (function (e, t) {
        const n = Xa(e),
          r = Xa(t);
        return n.compareTo(r);
      })(e.bytesValue, t.bytesValue);
    case 7:
      return (function (e, t) {
        const n = e.split('/'),
          r = t.split('/');
        for (let e = 0; e < n.length && e < r.length; e++) {
          const t = Eo(n[e], r[e]);
          if (0 !== t) return t;
        }
        return Eo(n.length, r.length);
      })(e.referenceValue, t.referenceValue);
    case 8:
      return (function (e, t) {
        const n = Eo(Ya(e.latitude), Ya(t.latitude));
        return 0 !== n ? n : Eo(Ya(e.longitude), Ya(t.longitude));
      })(e.geoPointValue, t.geoPointValue);
    case 9:
      return (function (e, t) {
        const n = e.values || [],
          r = t.values || [];
        for (let e = 0; e < n.length && e < r.length; ++e) {
          const t = cc(n[e], r[e]);
          if (t) return t;
        }
        return Eo(n.length, r.length);
      })(e.arrayValue, t.arrayValue);
    case 10:
      return (function (e, t) {
        if (e === rc.mapValue && t === rc.mapValue) return 0;
        if (e === rc.mapValue) return 1;
        if (t === rc.mapValue) return -1;
        const n = e.fields || {},
          r = Object.keys(n),
          i = t.fields || {},
          s = Object.keys(i);
        (r.sort(), s.sort());
        for (let e = 0; e < r.length && e < s.length; ++e) {
          const t = Eo(r[e], s[e]);
          if (0 !== t) return t;
          const o = cc(n[r[e]], i[s[e]]);
          if (0 !== o) return o;
        }
        return Eo(r.length, s.length);
      })(e.mapValue, t.mapValue);
    default:
      throw co();
  }
}
function uc(e, t) {
  if ('string' == typeof e && 'string' == typeof t && e.length === t.length) return Eo(e, t);
  const n = Qa(e),
    r = Qa(t),
    i = Eo(n.seconds, r.seconds);
  return 0 !== i ? i : Eo(n.nanos, r.nanos);
}
function lc(e) {
  return hc(e);
}
function hc(e) {
  return 'nullValue' in e
    ? 'null'
    : 'booleanValue' in e
      ? '' + e.booleanValue
      : 'integerValue' in e
        ? '' + e.integerValue
        : 'doubleValue' in e
          ? '' + e.doubleValue
          : 'timestampValue' in e
            ? (function (e) {
                const t = Qa(e);
                return `time(${t.seconds},${t.nanos})`;
              })(e.timestampValue)
            : 'stringValue' in e
              ? e.stringValue
              : 'bytesValue' in e
                ? (function (e) {
                    return Xa(e).toBase64();
                  })(e.bytesValue)
                : 'referenceValue' in e
                  ? (function (e) {
                      return Ro.fromName(e).toString();
                    })(e.referenceValue)
                  : 'geoPointValue' in e
                    ? (function (e) {
                        return `geo(${e.latitude},${e.longitude})`;
                      })(e.geoPointValue)
                    : 'arrayValue' in e
                      ? (function (e) {
                          let t = '[',
                            n = !0;
                          for (const r of e.values || []) (n ? (n = !1) : (t += ','), (t += hc(r)));
                          return t + ']';
                        })(e.arrayValue)
                      : 'mapValue' in e
                        ? (function (e) {
                            const t = Object.keys(e.fields || {}).sort();
                            let n = '{',
                              r = !0;
                            for (const i of t)
                              (r ? (r = !1) : (n += ','), (n += `${i}:${hc(e.fields[i])}`));
                            return n + '}';
                          })(e.mapValue)
                        : co();
}
function dc(e, t) {
  return {
    referenceValue: `projects/${e.projectId}/databases/${
      e.database
    }/documents/${t.path.canonicalString()}`,
  };
}
function fc(e) {
  return !!e && 'integerValue' in e;
}
function pc(e) {
  return !!e && 'arrayValue' in e;
}
function gc(e) {
  return !!e && 'nullValue' in e;
}
function mc(e) {
  return !!e && 'doubleValue' in e && isNaN(Number(e.doubleValue));
}
function yc(e) {
  return !!e && 'mapValue' in e;
}
function wc(e) {
  if (e.geoPointValue) return { geoPointValue: Object.assign({}, e.geoPointValue) };
  if (e.timestampValue && 'object' == typeof e.timestampValue)
    return { timestampValue: Object.assign({}, e.timestampValue) };
  if (e.mapValue) {
    const t = { mapValue: { fields: {} } };
    return (Fa(e.mapValue.fields, (e, n) => (t.mapValue.fields[e] = wc(n))), t);
  }
  if (e.arrayValue) {
    const t = { arrayValue: { values: [] } };
    for (let n = 0; n < (e.arrayValue.values || []).length; ++n)
      t.arrayValue.values[n] = wc(e.arrayValue.values[n]);
    return t;
  }
  return Object.assign({}, e);
}
function vc(e) {
  return '__max__' === (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue;
}
function bc(e) {
  return 'nullValue' in e
    ? ic
    : 'booleanValue' in e
      ? { booleanValue: !1 }
      : 'integerValue' in e || 'doubleValue' in e
        ? { doubleValue: NaN }
        : 'timestampValue' in e
          ? { timestampValue: { seconds: Number.MIN_SAFE_INTEGER } }
          : 'stringValue' in e
            ? { stringValue: '' }
            : 'bytesValue' in e
              ? { bytesValue: '' }
              : 'referenceValue' in e
                ? dc(nc.empty(), Ro.empty())
                : 'geoPointValue' in e
                  ? { geoPointValue: { latitude: -90, longitude: -180 } }
                  : 'arrayValue' in e
                    ? { arrayValue: {} }
                    : 'mapValue' in e
                      ? { mapValue: {} }
                      : co();
}
function Ic(e) {
  return 'nullValue' in e
    ? { booleanValue: !1 }
    : 'booleanValue' in e
      ? { doubleValue: NaN }
      : 'integerValue' in e || 'doubleValue' in e
        ? { timestampValue: { seconds: Number.MIN_SAFE_INTEGER } }
        : 'timestampValue' in e
          ? { stringValue: '' }
          : 'stringValue' in e
            ? { bytesValue: '' }
            : 'bytesValue' in e
              ? dc(nc.empty(), Ro.empty())
              : 'referenceValue' in e
                ? { geoPointValue: { latitude: -90, longitude: -180 } }
                : 'geoPointValue' in e
                  ? { arrayValue: {} }
                  : 'arrayValue' in e
                    ? { mapValue: {} }
                    : 'mapValue' in e
                      ? rc
                      : co();
}
function Tc(e, t) {
  const n = cc(e.value, t.value);
  return 0 !== n ? n : e.inclusive && !t.inclusive ? -1 : !e.inclusive && t.inclusive ? 1 : 0;
}
function _c(e, t) {
  const n = cc(e.value, t.value);
  return 0 !== n ? n : e.inclusive && !t.inclusive ? 1 : !e.inclusive && t.inclusive ? -1 : 0;
}
class Ec {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new Ec({ mapValue: {} });
  }
  field(e) {
    if (e.isEmpty()) return this.value;
    {
      let t = this.value;
      for (let n = 0; n < e.length - 1; ++n)
        if (((t = (t.mapValue.fields || {})[e.get(n)]), !yc(t))) return null;
      return ((t = (t.mapValue.fields || {})[e.lastSegment()]), t || null);
    }
  }
  set(e, t) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = wc(t);
  }
  setAll(e) {
    let t = Oo.emptyPath(),
      n = {},
      r = [];
    e.forEach((e, i) => {
      if (!t.isImmediateParentOf(i)) {
        const e = this.getFieldsMap(t);
        (this.applyChanges(e, n, r), (n = {}), (r = []), (t = i.popLast()));
      }
      e ? (n[i.lastSegment()] = wc(e)) : r.push(i.lastSegment());
    });
    const i = this.getFieldsMap(t);
    this.applyChanges(i, n, r);
  }
  delete(e) {
    const t = this.field(e.popLast());
    yc(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return oc(this.value, e.value);
  }
  getFieldsMap(e) {
    let t = this.value;
    t.mapValue.fields || (t.mapValue = { fields: {} });
    for (let n = 0; n < e.length; ++n) {
      let r = t.mapValue.fields[e.get(n)];
      ((yc(r) && r.mapValue.fields) ||
        ((r = { mapValue: { fields: {} } }), (t.mapValue.fields[e.get(n)] = r)),
        (t = r));
    }
    return t.mapValue.fields;
  }
  applyChanges(e, t, n) {
    Fa(t, (t, n) => (e[t] = n));
    for (const t of n) delete e[t];
  }
  clone() {
    return new Ec(wc(this.value));
  }
}
function Sc(e) {
  const t = [];
  return (
    Fa(e.fields, (e, n) => {
      const r = new Oo([e]);
      if (yc(n)) {
        const e = Sc(n.mapValue).fields;
        if (0 === e.length) t.push(r);
        else for (const n of e) t.push(r.child(n));
      } else t.push(r);
    }),
    new $a(t)
  );
}
class Cc {
  constructor(e, t, n, r, i, s, o) {
    ((this.key = e),
      (this.documentType = t),
      (this.version = n),
      (this.readTime = r),
      (this.createTime = i),
      (this.data = s),
      (this.documentState = o));
  }
  static newInvalidDocument(e) {
    return new Cc(e, 0, ko.min(), ko.min(), ko.min(), Ec.empty(), 0);
  }
  static newFoundDocument(e, t, n, r) {
    return new Cc(e, 1, t, ko.min(), n, r, 0);
  }
  static newNoDocument(e, t) {
    return new Cc(e, 2, t, ko.min(), ko.min(), Ec.empty(), 0);
  }
  static newUnknownDocument(e, t) {
    return new Cc(e, 3, t, ko.min(), ko.min(), Ec.empty(), 2);
  }
  convertToFoundDocument(e, t) {
    return (
      !this.createTime.isEqual(ko.min()) ||
        (2 !== this.documentType && 0 !== this.documentType) ||
        (this.createTime = e),
      (this.version = e),
      (this.documentType = 1),
      (this.data = t),
      (this.documentState = 0),
      this
    );
  }
  convertToNoDocument(e) {
    return (
      (this.version = e),
      (this.documentType = 2),
      (this.data = Ec.empty()),
      (this.documentState = 0),
      this
    );
  }
  convertToUnknownDocument(e) {
    return (
      (this.version = e),
      (this.documentType = 3),
      (this.data = Ec.empty()),
      (this.documentState = 2),
      this
    );
  }
  setHasCommittedMutations() {
    return ((this.documentState = 2), this);
  }
  setHasLocalMutations() {
    return ((this.documentState = 1), (this.version = ko.min()), this);
  }
  setReadTime(e) {
    return ((this.readTime = e), this);
  }
  get hasLocalMutations() {
    return 1 === this.documentState;
  }
  get hasCommittedMutations() {
    return 2 === this.documentState;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return 0 !== this.documentType;
  }
  isFoundDocument() {
    return 1 === this.documentType;
  }
  isNoDocument() {
    return 2 === this.documentType;
  }
  isUnknownDocument() {
    return 3 === this.documentType;
  }
  isEqual(e) {
    return (
      e instanceof Cc &&
      this.key.isEqual(e.key) &&
      this.version.isEqual(e.version) &&
      this.documentType === e.documentType &&
      this.documentState === e.documentState &&
      this.data.isEqual(e.data)
    );
  }
  mutableCopy() {
    return new Cc(
      this.key,
      this.documentType,
      this.version,
      this.readTime,
      this.createTime,
      this.data.clone(),
      this.documentState
    );
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(
      this.data.value
    )}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${
      this.documentState
    }})`;
  }
}
class Ac {
  constructor(e, t) {
    ((this.position = e), (this.inclusive = t));
  }
}
function kc(e, t, n) {
  let r = 0;
  for (let i = 0; i < e.position.length; i++) {
    const s = t[i],
      o = e.position[i];
    if (
      ((r = s.field.isKeyField()
        ? Ro.comparator(Ro.fromName(o.referenceValue), n.key)
        : cc(o, n.data.field(s.field))),
      'desc' === s.dir && (r *= -1),
      0 !== r)
    )
      break;
  }
  return r;
}
function Dc(e, t) {
  if (null === e) return null === t;
  if (null === t) return !1;
  if (e.inclusive !== t.inclusive || e.position.length !== t.position.length) return !1;
  for (let n = 0; n < e.position.length; n++) if (!oc(e.position[n], t.position[n])) return !1;
  return !0;
}
class xc {
  constructor(e, t = 'asc') {
    ((this.field = e), (this.dir = t));
  }
}
function Nc(e, t) {
  return e.dir === t.dir && e.field.isEqual(t.field);
}
class Oc {}
class Rc extends Oc {
  constructor(e, t, n) {
    (super(), (this.field = e), (this.op = t), (this.value = n));
  }
  static create(e, t, n) {
    return e.isKeyField()
      ? 'in' === t || 'not-in' === t
        ? this.createKeyFieldInFilter(e, t, n)
        : new qc(e, t, n)
      : 'array-contains' === t
        ? new Wc(e, n)
        : 'in' === t
          ? new Hc(e, n)
          : 'not-in' === t
            ? new Qc(e, n)
            : 'array-contains-any' === t
              ? new Yc(e, n)
              : new Rc(e, t, n);
  }
  static createKeyFieldInFilter(e, t, n) {
    return 'in' === t ? new Gc(e, n) : new $c(e, n);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return '!=' === this.op
      ? null !== t && this.matchesComparison(cc(t, this.value))
      : null !== t && sc(this.value) === sc(t) && this.matchesComparison(cc(t, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case '<':
        return e < 0;
      case '<=':
        return e <= 0;
      case '==':
        return 0 === e;
      case '!=':
        return 0 !== e;
      case '>':
        return e > 0;
      case '>=':
        return e >= 0;
      default:
        return co();
    }
  }
  isInequality() {
    return ['<', '<=', '>', '>=', '!=', 'not-in'].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
}
class Pc extends Oc {
  constructor(e, t) {
    (super(), (this.filters = e), (this.op = t), (this.ue = null));
  }
  static create(e, t) {
    return new Pc(e, t);
  }
  matches(e) {
    return Mc(this)
      ? void 0 === this.filters.find(t => !t.matches(e))
      : void 0 !== this.filters.find(t => t.matches(e));
  }
  getFlattenedFilters() {
    return (
      null !== this.ue ||
        (this.ue = this.filters.reduce((e, t) => e.concat(t.getFlattenedFilters()), [])),
      this.ue
    );
  }
  getFilters() {
    return Object.assign([], this.filters);
  }
}
function Mc(e) {
  return 'and' === e.op;
}
function Lc(e) {
  return 'or' === e.op;
}
function Fc(e) {
  return Uc(e) && Mc(e);
}
function Uc(e) {
  for (const t of e.filters) if (t instanceof Pc) return !1;
  return !0;
}
function Vc(e) {
  if (e instanceof Rc) return e.field.canonicalString() + e.op.toString() + lc(e.value);
  if (Fc(e)) return e.filters.map(e => Vc(e)).join(',');
  {
    const t = e.filters.map(e => Vc(e)).join(',');
    return `${e.op}(${t})`;
  }
}
function Bc(e, t) {
  return e instanceof Rc
    ? (function (e, t) {
        return t instanceof Rc && e.op === t.op && e.field.isEqual(t.field) && oc(e.value, t.value);
      })(e, t)
    : e instanceof Pc
      ? (function (e, t) {
          return (
            t instanceof Pc &&
            e.op === t.op &&
            e.filters.length === t.filters.length &&
            e.filters.reduce((e, n, r) => e && Bc(n, t.filters[r]), !0)
          );
        })(e, t)
      : void co();
}
function jc(e, t) {
  const n = e.filters.concat(t);
  return Pc.create(n, e.op);
}
function zc(e) {
  return e instanceof Rc
    ? (function (e) {
        return `${e.field.canonicalString()} ${e.op} ${lc(e.value)}`;
      })(e)
    : e instanceof Pc
      ? (function (e) {
          return e.op.toString() + ' {' + e.getFilters().map(zc).join(' ,') + '}';
        })(e)
      : 'Filter';
}
class qc extends Rc {
  constructor(e, t, n) {
    (super(e, t, n), (this.key = Ro.fromName(n.referenceValue)));
  }
  matches(e) {
    const t = Ro.comparator(e.key, this.key);
    return this.matchesComparison(t);
  }
}
class Gc extends Rc {
  constructor(e, t) {
    (super(e, 'in', t), (this.keys = Kc(0, t)));
  }
  matches(e) {
    return this.keys.some(t => t.isEqual(e.key));
  }
}
class $c extends Rc {
  constructor(e, t) {
    (super(e, 'not-in', t), (this.keys = Kc(0, t)));
  }
  matches(e) {
    return !this.keys.some(t => t.isEqual(e.key));
  }
}
function Kc(e, t) {
  var n;
  return ((null === (n = t.arrayValue) || void 0 === n ? void 0 : n.values) || []).map(e =>
    Ro.fromName(e.referenceValue)
  );
}
class Wc extends Rc {
  constructor(e, t) {
    super(e, 'array-contains', t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return pc(t) && ac(t.arrayValue, this.value);
  }
}
class Hc extends Rc {
  constructor(e, t) {
    super(e, 'in', t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return null !== t && ac(this.value.arrayValue, t);
  }
}
class Qc extends Rc {
  constructor(e, t) {
    super(e, 'not-in', t);
  }
  matches(e) {
    if (ac(this.value.arrayValue, { nullValue: 'NULL_VALUE' })) return !1;
    const t = e.data.field(this.field);
    return null !== t && !ac(this.value.arrayValue, t);
  }
}
class Yc extends Rc {
  constructor(e, t) {
    super(e, 'array-contains-any', t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return (
      !(!pc(t) || !t.arrayValue.values) &&
      t.arrayValue.values.some(e => ac(this.value.arrayValue, e))
    );
  }
}
class Xc {
  constructor(e, t = null, n = [], r = [], i = null, s = null, o = null) {
    ((this.path = e),
      (this.collectionGroup = t),
      (this.orderBy = n),
      (this.filters = r),
      (this.limit = i),
      (this.startAt = s),
      (this.endAt = o),
      (this.ce = null));
  }
}
function Jc(e, t = null, n = [], r = [], i = null, s = null, o = null) {
  return new Xc(e, t, n, r, i, s, o);
}
function Zc(e) {
  const t = lo(e);
  if (null === t.ce) {
    let e = t.path.canonicalString();
    (null !== t.collectionGroup && (e += '|cg:' + t.collectionGroup),
      (e += '|f:'),
      (e += t.filters.map(e => Vc(e)).join(',')),
      (e += '|ob:'),
      (e += t.orderBy
        .map(e =>
          (function (e) {
            return e.field.canonicalString() + e.dir;
          })(e)
        )
        .join(',')),
      ia(t.limit) || ((e += '|l:'), (e += t.limit)),
      t.startAt &&
        ((e += '|lb:'),
        (e += t.startAt.inclusive ? 'b:' : 'a:'),
        (e += t.startAt.position.map(e => lc(e)).join(','))),
      t.endAt &&
        ((e += '|ub:'),
        (e += t.endAt.inclusive ? 'a:' : 'b:'),
        (e += t.endAt.position.map(e => lc(e)).join(','))),
      (t.ce = e));
  }
  return t.ce;
}
function eu(e, t) {
  if (e.limit !== t.limit) return !1;
  if (e.orderBy.length !== t.orderBy.length) return !1;
  for (let n = 0; n < e.orderBy.length; n++) if (!Nc(e.orderBy[n], t.orderBy[n])) return !1;
  if (e.filters.length !== t.filters.length) return !1;
  for (let n = 0; n < e.filters.length; n++) if (!Bc(e.filters[n], t.filters[n])) return !1;
  return (
    e.collectionGroup === t.collectionGroup &&
    !!e.path.isEqual(t.path) &&
    !!Dc(e.startAt, t.startAt) &&
    Dc(e.endAt, t.endAt)
  );
}
function tu(e) {
  return Ro.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
function nu(e, t) {
  return e.filters.filter(e => e instanceof Rc && e.field.isEqual(t));
}
function ru(e, t, n) {
  let r = ic,
    i = !0;
  for (const n of nu(e, t)) {
    let e = ic,
      t = !0;
    switch (n.op) {
      case '<':
      case '<=':
        e = bc(n.value);
        break;
      case '==':
      case 'in':
      case '>=':
        e = n.value;
        break;
      case '>':
        ((e = n.value), (t = !1));
        break;
      case '!=':
      case 'not-in':
        e = ic;
    }
    Tc({ value: r, inclusive: i }, { value: e, inclusive: t }) < 0 && ((r = e), (i = t));
  }
  if (null !== n)
    for (let s = 0; s < e.orderBy.length; ++s)
      if (e.orderBy[s].field.isEqual(t)) {
        const e = n.position[s];
        Tc({ value: r, inclusive: i }, { value: e, inclusive: n.inclusive }) < 0 &&
          ((r = e), (i = n.inclusive));
        break;
      }
  return { value: r, inclusive: i };
}
function iu(e, t, n) {
  let r = rc,
    i = !0;
  for (const n of nu(e, t)) {
    let e = rc,
      t = !0;
    switch (n.op) {
      case '>=':
      case '>':
        ((e = Ic(n.value)), (t = !1));
        break;
      case '==':
      case 'in':
      case '<=':
        e = n.value;
        break;
      case '<':
        ((e = n.value), (t = !1));
        break;
      case '!=':
      case 'not-in':
        e = rc;
    }
    _c({ value: r, inclusive: i }, { value: e, inclusive: t }) > 0 && ((r = e), (i = t));
  }
  if (null !== n)
    for (let s = 0; s < e.orderBy.length; ++s)
      if (e.orderBy[s].field.isEqual(t)) {
        const e = n.position[s];
        _c({ value: r, inclusive: i }, { value: e, inclusive: n.inclusive }) > 0 &&
          ((r = e), (i = n.inclusive));
        break;
      }
  return { value: r, inclusive: i };
}
class su {
  constructor(e, t = null, n = [], r = [], i = null, s = 'F', o = null, a = null) {
    ((this.path = e),
      (this.collectionGroup = t),
      (this.explicitOrderBy = n),
      (this.filters = r),
      (this.limit = i),
      (this.limitType = s),
      (this.startAt = o),
      (this.endAt = a),
      (this.le = null),
      (this.he = null),
      (this.Pe = null),
      this.startAt,
      this.endAt);
  }
}
function ou(e) {
  return new su(e);
}
function au(e) {
  return (
    0 === e.filters.length &&
    null === e.limit &&
    null == e.startAt &&
    null == e.endAt &&
    (0 === e.explicitOrderBy.length ||
      (1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField()))
  );
}
function cu(e) {
  return null !== e.collectionGroup;
}
function uu(e) {
  const t = lo(e);
  if (null === t.le) {
    t.le = [];
    const e = new Set();
    for (const n of t.explicitOrderBy) (t.le.push(n), e.add(n.field.canonicalString()));
    const n =
        t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : 'asc',
      r = (function (e) {
        let t = new za(Oo.comparator);
        return (
          e.filters.forEach(e => {
            e.getFlattenedFilters().forEach(e => {
              e.isInequality() && (t = t.add(e.field));
            });
          }),
          t
        );
      })(t);
    (r.forEach(r => {
      e.has(r.canonicalString()) || r.isKeyField() || t.le.push(new xc(r, n));
    }),
      e.has(Oo.keyField().canonicalString()) || t.le.push(new xc(Oo.keyField(), n)));
  }
  return t.le;
}
function lu(e) {
  const t = lo(e);
  return (
    t.he ||
      (t.he = (function (e, t) {
        if ('F' === e.limitType)
          return Jc(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
        {
          t = t.map(e => {
            const t = 'desc' === e.dir ? 'asc' : 'desc';
            return new xc(e.field, t);
          });
          const n = e.endAt ? new Ac(e.endAt.position, e.endAt.inclusive) : null,
            r = e.startAt ? new Ac(e.startAt.position, e.startAt.inclusive) : null;
          return Jc(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
        }
      })(t, uu(e))),
    t.he
  );
}
function hu(e, t) {
  const n = e.filters.concat([t]);
  return new su(
    e.path,
    e.collectionGroup,
    e.explicitOrderBy.slice(),
    n,
    e.limit,
    e.limitType,
    e.startAt,
    e.endAt
  );
}
function du(e, t, n) {
  return new su(
    e.path,
    e.collectionGroup,
    e.explicitOrderBy.slice(),
    e.filters.slice(),
    t,
    n,
    e.startAt,
    e.endAt
  );
}
function fu(e, t) {
  return eu(lu(e), lu(t)) && e.limitType === t.limitType;
}
function pu(e) {
  return `${Zc(lu(e))}|lt:${e.limitType}`;
}
function gu(e) {
  return `Query(target=${(function (e) {
    let t = e.path.canonicalString();
    return (
      null !== e.collectionGroup && (t += ' collectionGroup=' + e.collectionGroup),
      e.filters.length > 0 && (t += `, filters: [${e.filters.map(e => zc(e)).join(', ')}]`),
      ia(e.limit) || (t += ', limit: ' + e.limit),
      e.orderBy.length > 0 &&
        (t += `, orderBy: [${e.orderBy
          .map(e =>
            (function (e) {
              return `${e.field.canonicalString()} (${e.dir})`;
            })(e)
          )
          .join(', ')}]`),
      e.startAt &&
        ((t += ', startAt: '),
        (t += e.startAt.inclusive ? 'b:' : 'a:'),
        (t += e.startAt.position.map(e => lc(e)).join(','))),
      e.endAt &&
        ((t += ', endAt: '),
        (t += e.endAt.inclusive ? 'a:' : 'b:'),
        (t += e.endAt.position.map(e => lc(e)).join(','))),
      `Target(${t})`
    );
  })(lu(e))}; limitType=${e.limitType})`;
}
function mu(e, t) {
  return (
    t.isFoundDocument() &&
    (function (e, t) {
      const n = t.key.path;
      return null !== e.collectionGroup
        ? t.key.hasCollectionId(e.collectionGroup) && e.path.isPrefixOf(n)
        : Ro.isDocumentKey(e.path)
          ? e.path.isEqual(n)
          : e.path.isImmediateParentOf(n);
    })(e, t) &&
    (function (e, t) {
      for (const n of uu(e)) if (!n.field.isKeyField() && null === t.data.field(n.field)) return !1;
      return !0;
    })(e, t) &&
    (function (e, t) {
      for (const n of e.filters) if (!n.matches(t)) return !1;
      return !0;
    })(e, t) &&
    (function (e, t) {
      return !(
        (e.startAt &&
          !(function (e, t, n) {
            const r = kc(e, t, n);
            return e.inclusive ? r <= 0 : r < 0;
          })(e.startAt, uu(e), t)) ||
        (e.endAt &&
          !(function (e, t, n) {
            const r = kc(e, t, n);
            return e.inclusive ? r >= 0 : r > 0;
          })(e.endAt, uu(e), t))
      );
    })(e, t)
  );
}
function yu(e) {
  return (t, n) => {
    let r = !1;
    for (const i of uu(e)) {
      const e = wu(i, t, n);
      if (0 !== e) return e;
      r = r || i.field.isKeyField();
    }
    return 0;
  };
}
function wu(e, t, n) {
  const r = e.field.isKeyField()
    ? Ro.comparator(t.key, n.key)
    : (function (e, t, n) {
        const r = t.data.field(e),
          i = n.data.field(e);
        return null !== r && null !== i ? cc(r, i) : co();
      })(e.field, t, n);
  switch (e.dir) {
    case 'asc':
      return r;
    case 'desc':
      return -1 * r;
    default:
      return co();
  }
}
class vu {
  constructor(e, t) {
    ((this.mapKeyFn = e), (this.equalsFn = t), (this.inner = {}), (this.innerSize = 0));
  }
  get(e) {
    const t = this.mapKeyFn(e),
      n = this.inner[t];
    if (void 0 !== n) for (const [t, r] of n) if (this.equalsFn(t, e)) return r;
  }
  has(e) {
    return void 0 !== this.get(e);
  }
  set(e, t) {
    const n = this.mapKeyFn(e),
      r = this.inner[n];
    if (void 0 === r) return ((this.inner[n] = [[e, t]]), void this.innerSize++);
    for (let n = 0; n < r.length; n++) if (this.equalsFn(r[n][0], e)) return void (r[n] = [e, t]);
    (r.push([e, t]), this.innerSize++);
  }
  delete(e) {
    const t = this.mapKeyFn(e),
      n = this.inner[t];
    if (void 0 === n) return !1;
    for (let r = 0; r < n.length; r++)
      if (this.equalsFn(n[r][0], e))
        return (1 === n.length ? delete this.inner[t] : n.splice(r, 1), this.innerSize--, !0);
    return !1;
  }
  forEach(e) {
    Fa(this.inner, (t, n) => {
      for (const [t, r] of n) e(t, r);
    });
  }
  isEmpty() {
    return Ua(this.inner);
  }
  size() {
    return this.innerSize;
  }
}
const bu = new Va(Ro.comparator);
function Iu() {
  return bu;
}
const Tu = new Va(Ro.comparator);
function _u(...e) {
  let t = Tu;
  for (const n of e) t = t.insert(n.key, n);
  return t;
}
function Eu(e) {
  let t = Tu;
  return (e.forEach((e, n) => (t = t.insert(e, n.overlayedDocument))), t);
}
function Su() {
  return Au();
}
function Cu() {
  return Au();
}
function Au() {
  return new vu(
    e => e.toString(),
    (e, t) => e.isEqual(t)
  );
}
const ku = new Va(Ro.comparator),
  Du = new za(Ro.comparator);
function xu(...e) {
  let t = Du;
  for (const n of e) t = t.add(n);
  return t;
}
const Nu = new za(Eo);
function Ou(e, t) {
  if (e.useProto3Json) {
    if (isNaN(t)) return { doubleValue: 'NaN' };
    if (t === 1 / 0) return { doubleValue: 'Infinity' };
    if (t === -1 / 0) return { doubleValue: '-Infinity' };
  }
  return { doubleValue: sa(t) ? '-0' : t };
}
function Ru(e) {
  return { integerValue: '' + e };
}
function Pu(e, t) {
  return (function (e) {
    return (
      'number' == typeof e &&
      Number.isInteger(e) &&
      !sa(e) &&
      e <= Number.MAX_SAFE_INTEGER &&
      e >= Number.MIN_SAFE_INTEGER
    );
  })(t)
    ? Ru(t)
    : Ou(e, t);
}
class Mu {
  constructor() {
    this._ = void 0;
  }
}
function Lu(e, t, n) {
  return e instanceof Vu
    ? (function (e, t) {
        const n = {
          fields: {
            __type__: { stringValue: 'server_timestamp' },
            __local_write_time__: { timestampValue: { seconds: e.seconds, nanos: e.nanoseconds } },
          },
        };
        return (t && Ja(t) && (t = Za(t)), t && (n.fields.__previous_value__ = t), { mapValue: n });
      })(n, t)
    : e instanceof Bu
      ? ju(e, t)
      : e instanceof zu
        ? qu(e, t)
        : (function (e, t) {
            const n = Uu(e, t),
              r = $u(n) + $u(e.Ie);
            return fc(n) && fc(e.Ie) ? Ru(r) : Ou(e.serializer, r);
          })(e, t);
}
function Fu(e, t, n) {
  return e instanceof Bu ? ju(e, t) : e instanceof zu ? qu(e, t) : n;
}
function Uu(e, t) {
  return e instanceof Gu
    ? (function (e) {
        return (
          fc(e) ||
          (function (e) {
            return !!e && 'doubleValue' in e;
          })(e)
        );
      })(t)
      ? t
      : { integerValue: 0 }
    : null;
}
class Vu extends Mu {}
class Bu extends Mu {
  constructor(e) {
    (super(), (this.elements = e));
  }
}
function ju(e, t) {
  const n = Ku(t);
  for (const t of e.elements) n.some(e => oc(e, t)) || n.push(t);
  return { arrayValue: { values: n } };
}
class zu extends Mu {
  constructor(e) {
    (super(), (this.elements = e));
  }
}
function qu(e, t) {
  let n = Ku(t);
  for (const t of e.elements) n = n.filter(e => !oc(e, t));
  return { arrayValue: { values: n } };
}
class Gu extends Mu {
  constructor(e, t) {
    (super(), (this.serializer = e), (this.Ie = t));
  }
}
function $u(e) {
  return Ya(e.integerValue || e.doubleValue);
}
function Ku(e) {
  return pc(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
}
class Wu {
  constructor(e, t) {
    ((this.field = e), (this.transform = t));
  }
}
class Hu {
  constructor(e, t) {
    ((this.version = e), (this.transformResults = t));
  }
}
class Qu {
  constructor(e, t) {
    ((this.updateTime = e), (this.exists = t));
  }
  static none() {
    return new Qu();
  }
  static exists(e) {
    return new Qu(void 0, e);
  }
  static updateTime(e) {
    return new Qu(e);
  }
  get isNone() {
    return void 0 === this.updateTime && void 0 === this.exists;
  }
  isEqual(e) {
    return (
      this.exists === e.exists &&
      (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime)
    );
  }
}
function Yu(e, t) {
  return void 0 !== e.updateTime
    ? t.isFoundDocument() && t.version.isEqual(e.updateTime)
    : void 0 === e.exists || e.exists === t.isFoundDocument();
}
class Xu {}
function Ju(e, t) {
  if (!e.hasLocalMutations || (t && 0 === t.fields.length)) return null;
  if (null === t)
    return e.isNoDocument() ? new cl(e.key, Qu.none()) : new rl(e.key, e.data, Qu.none());
  {
    const n = e.data,
      r = Ec.empty();
    let i = new za(Oo.comparator);
    for (let e of t.fields)
      if (!i.has(e)) {
        let t = n.field(e);
        (null === t && e.length > 1 && ((e = e.popLast()), (t = n.field(e))),
          null === t ? r.delete(e) : r.set(e, t),
          (i = i.add(e)));
      }
    return new il(e.key, r, new $a(i.toArray()), Qu.none());
  }
}
function Zu(e, t, n) {
  e instanceof rl
    ? (function (e, t, n) {
        const r = e.value.clone(),
          i = ol(e.fieldTransforms, t, n.transformResults);
        (r.setAll(i), t.convertToFoundDocument(n.version, r).setHasCommittedMutations());
      })(e, t, n)
    : e instanceof il
      ? (function (e, t, n) {
          if (!Yu(e.precondition, t)) return void t.convertToUnknownDocument(n.version);
          const r = ol(e.fieldTransforms, t, n.transformResults),
            i = t.data;
          (i.setAll(sl(e)),
            i.setAll(r),
            t.convertToFoundDocument(n.version, i).setHasCommittedMutations());
        })(e, t, n)
      : (function (e, t, n) {
          t.convertToNoDocument(n.version).setHasCommittedMutations();
        })(0, t, n);
}
function el(e, t, n, r) {
  return e instanceof rl
    ? (function (e, t, n, r) {
        if (!Yu(e.precondition, t)) return n;
        const i = e.value.clone(),
          s = al(e.fieldTransforms, r, t);
        return (i.setAll(s), t.convertToFoundDocument(t.version, i).setHasLocalMutations(), null);
      })(e, t, n, r)
    : e instanceof il
      ? (function (e, t, n, r) {
          if (!Yu(e.precondition, t)) return n;
          const i = al(e.fieldTransforms, r, t),
            s = t.data;
          return (
            s.setAll(sl(e)),
            s.setAll(i),
            t.convertToFoundDocument(t.version, s).setHasLocalMutations(),
            null === n
              ? null
              : n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e => e.field))
          );
        })(e, t, n, r)
      : (function (e, t, n) {
          return Yu(e.precondition, t)
            ? (t.convertToNoDocument(t.version).setHasLocalMutations(), null)
            : n;
        })(e, t, n);
}
function tl(e, t) {
  let n = null;
  for (const r of e.fieldTransforms) {
    const e = t.data.field(r.field),
      i = Uu(r.transform, e || null);
    null != i && (null === n && (n = Ec.empty()), n.set(r.field, i));
  }
  return n || null;
}
function nl(e, t) {
  return (
    e.type === t.type &&
    !!e.key.isEqual(t.key) &&
    !!e.precondition.isEqual(t.precondition) &&
    !!(function (e, t) {
      return (
        (void 0 === e && void 0 === t) ||
        (!(!e || !t) &&
          So(e, t, (e, t) =>
            (function (e, t) {
              return (
                e.field.isEqual(t.field) &&
                (function (e, t) {
                  return (e instanceof Bu && t instanceof Bu) ||
                    (e instanceof zu && t instanceof zu)
                    ? So(e.elements, t.elements, oc)
                    : e instanceof Gu && t instanceof Gu
                      ? oc(e.Ie, t.Ie)
                      : e instanceof Vu && t instanceof Vu;
                })(e.transform, t.transform)
              );
            })(e, t)
          ))
      );
    })(e.fieldTransforms, t.fieldTransforms) &&
    (0 === e.type
      ? e.value.isEqual(t.value)
      : 1 !== e.type || (e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))
  );
}
class rl extends Xu {
  constructor(e, t, n, r = []) {
    (super(),
      (this.key = e),
      (this.value = t),
      (this.precondition = n),
      (this.fieldTransforms = r),
      (this.type = 0));
  }
  getFieldMask() {
    return null;
  }
}
class il extends Xu {
  constructor(e, t, n, r, i = []) {
    (super(),
      (this.key = e),
      (this.data = t),
      (this.fieldMask = n),
      (this.precondition = r),
      (this.fieldTransforms = i),
      (this.type = 1));
  }
  getFieldMask() {
    return this.fieldMask;
  }
}
function sl(e) {
  const t = new Map();
  return (
    e.fieldMask.fields.forEach(n => {
      if (!n.isEmpty()) {
        const r = e.data.field(n);
        t.set(n, r);
      }
    }),
    t
  );
}
function ol(e, t, n) {
  const r = new Map();
  uo(e.length === n.length);
  for (let i = 0; i < n.length; i++) {
    const s = e[i],
      o = s.transform,
      a = t.data.field(s.field);
    r.set(s.field, Fu(o, a, n[i]));
  }
  return r;
}
function al(e, t, n) {
  const r = new Map();
  for (const i of e) {
    const e = i.transform,
      s = n.data.field(i.field);
    r.set(i.field, Lu(e, s, t));
  }
  return r;
}
class cl extends Xu {
  constructor(e, t) {
    (super(),
      (this.key = e),
      (this.precondition = t),
      (this.type = 2),
      (this.fieldTransforms = []));
  }
  getFieldMask() {
    return null;
  }
}
class ul extends Xu {
  constructor(e, t) {
    (super(),
      (this.key = e),
      (this.precondition = t),
      (this.type = 3),
      (this.fieldTransforms = []));
  }
  getFieldMask() {
    return null;
  }
}
class ll {
  constructor(e, t, n, r) {
    ((this.batchId = e), (this.localWriteTime = t), (this.baseMutations = n), (this.mutations = r));
  }
  applyToRemoteDocument(e, t) {
    const n = t.mutationResults;
    for (let t = 0; t < this.mutations.length; t++) {
      const r = this.mutations[t];
      r.key.isEqual(e.key) && Zu(r, e, n[t]);
    }
  }
  applyToLocalView(e, t) {
    for (const n of this.baseMutations)
      n.key.isEqual(e.key) && (t = el(n, e, t, this.localWriteTime));
    for (const n of this.mutations) n.key.isEqual(e.key) && (t = el(n, e, t, this.localWriteTime));
    return t;
  }
  applyToLocalDocumentSet(e, t) {
    const n = Cu();
    return (
      this.mutations.forEach(r => {
        const i = e.get(r.key),
          s = i.overlayedDocument;
        let o = this.applyToLocalView(s, i.mutatedFields);
        o = t.has(r.key) ? null : o;
        const a = Ju(s, o);
        (null !== a && n.set(r.key, a), s.isValidDocument() || s.convertToNoDocument(ko.min()));
      }),
      n
    );
  }
  keys() {
    return this.mutations.reduce((e, t) => e.add(t.key), xu());
  }
  isEqual(e) {
    return (
      this.batchId === e.batchId &&
      So(this.mutations, e.mutations, (e, t) => nl(e, t)) &&
      So(this.baseMutations, e.baseMutations, (e, t) => nl(e, t))
    );
  }
}
class hl {
  constructor(e, t, n, r) {
    ((this.batch = e),
      (this.commitVersion = t),
      (this.mutationResults = n),
      (this.docVersions = r));
  }
  static from(e, t, n) {
    uo(e.mutations.length === n.length);
    let r = ku;
    const i = e.mutations;
    for (let e = 0; e < i.length; e++) r = r.insert(i[e].key, n[e].version);
    return new hl(e, t, n, r);
  }
}
class dl {
  constructor(e, t) {
    ((this.largestBatchId = e), (this.mutation = t));
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return null !== e && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{\n      largestBatchId: ${
      this.largestBatchId
    },\n      mutation: ${this.mutation.toString()}\n    }`;
  }
}
class fl {
  constructor(e, t) {
    ((this.count = e), (this.unchangedNames = t));
  }
}
var pl, gl;
function ml(e) {
  if (void 0 === e) return (so('GRPC error has no .code'), ho.UNKNOWN);
  switch (e) {
    case pl.OK:
      return ho.OK;
    case pl.CANCELLED:
      return ho.CANCELLED;
    case pl.UNKNOWN:
      return ho.UNKNOWN;
    case pl.DEADLINE_EXCEEDED:
      return ho.DEADLINE_EXCEEDED;
    case pl.RESOURCE_EXHAUSTED:
      return ho.RESOURCE_EXHAUSTED;
    case pl.INTERNAL:
      return ho.INTERNAL;
    case pl.UNAVAILABLE:
      return ho.UNAVAILABLE;
    case pl.UNAUTHENTICATED:
      return ho.UNAUTHENTICATED;
    case pl.INVALID_ARGUMENT:
      return ho.INVALID_ARGUMENT;
    case pl.NOT_FOUND:
      return ho.NOT_FOUND;
    case pl.ALREADY_EXISTS:
      return ho.ALREADY_EXISTS;
    case pl.PERMISSION_DENIED:
      return ho.PERMISSION_DENIED;
    case pl.FAILED_PRECONDITION:
      return ho.FAILED_PRECONDITION;
    case pl.ABORTED:
      return ho.ABORTED;
    case pl.OUT_OF_RANGE:
      return ho.OUT_OF_RANGE;
    case pl.UNIMPLEMENTED:
      return ho.UNIMPLEMENTED;
    case pl.DATA_LOSS:
      return ho.DATA_LOSS;
    default:
      return co();
  }
}
(((gl = pl || (pl = {}))[(gl.OK = 0)] = 'OK'),
  (gl[(gl.CANCELLED = 1)] = 'CANCELLED'),
  (gl[(gl.UNKNOWN = 2)] = 'UNKNOWN'),
  (gl[(gl.INVALID_ARGUMENT = 3)] = 'INVALID_ARGUMENT'),
  (gl[(gl.DEADLINE_EXCEEDED = 4)] = 'DEADLINE_EXCEEDED'),
  (gl[(gl.NOT_FOUND = 5)] = 'NOT_FOUND'),
  (gl[(gl.ALREADY_EXISTS = 6)] = 'ALREADY_EXISTS'),
  (gl[(gl.PERMISSION_DENIED = 7)] = 'PERMISSION_DENIED'),
  (gl[(gl.UNAUTHENTICATED = 16)] = 'UNAUTHENTICATED'),
  (gl[(gl.RESOURCE_EXHAUSTED = 8)] = 'RESOURCE_EXHAUSTED'),
  (gl[(gl.FAILED_PRECONDITION = 9)] = 'FAILED_PRECONDITION'),
  (gl[(gl.ABORTED = 10)] = 'ABORTED'),
  (gl[(gl.OUT_OF_RANGE = 11)] = 'OUT_OF_RANGE'),
  (gl[(gl.UNIMPLEMENTED = 12)] = 'UNIMPLEMENTED'),
  (gl[(gl.INTERNAL = 13)] = 'INTERNAL'),
  (gl[(gl.UNAVAILABLE = 14)] = 'UNAVAILABLE'),
  (gl[(gl.DATA_LOSS = 15)] = 'DATA_LOSS'));
const yl = new Zs([4294967295, 4294967295], 0);
function wl(e) {
  const t = new TextEncoder().encode(e),
    n = new Js();
  return (n.update(t), new Uint8Array(n.digest()));
}
function vl(e) {
  const t = new DataView(e.buffer),
    n = t.getUint32(0, !0),
    r = t.getUint32(4, !0),
    i = t.getUint32(8, !0),
    s = t.getUint32(12, !0);
  return [new Zs([n, r], 0), new Zs([i, s], 0)];
}
class bl {
  constructor(e, t, n) {
    if (((this.bitmap = e), (this.padding = t), (this.hashCount = n), t < 0 || t >= 8))
      throw new Il(`Invalid padding: ${t}`);
    if (n < 0) throw new Il(`Invalid hash count: ${n}`);
    if (e.length > 0 && 0 === this.hashCount) throw new Il(`Invalid hash count: ${n}`);
    if (0 === e.length && 0 !== t) throw new Il(`Invalid padding when bitmap length is 0: ${t}`);
    ((this.Te = 8 * e.length - t), (this.Ee = Zs.fromNumber(this.Te)));
  }
  de(e, t, n) {
    let r = e.add(t.multiply(Zs.fromNumber(n)));
    return (
      1 === r.compare(yl) && (r = new Zs([r.getBits(0), r.getBits(1)], 0)),
      r.modulo(this.Ee).toNumber()
    );
  }
  Ae(e) {
    return 0 != (this.bitmap[Math.floor(e / 8)] & (1 << e % 8));
  }
  mightContain(e) {
    if (0 === this.Te) return !1;
    const t = wl(e),
      [n, r] = vl(t);
    for (let e = 0; e < this.hashCount; e++) {
      const t = this.de(n, r, e);
      if (!this.Ae(t)) return !1;
    }
    return !0;
  }
  static create(e, t, n) {
    const r = e % 8 == 0 ? 0 : 8 - (e % 8),
      i = new Uint8Array(Math.ceil(e / 8)),
      s = new bl(i, r, t);
    return (n.forEach(e => s.insert(e)), s);
  }
  insert(e) {
    if (0 === this.Te) return;
    const t = wl(e),
      [n, r] = vl(t);
    for (let e = 0; e < this.hashCount; e++) {
      const t = this.de(n, r, e);
      this.Re(t);
    }
  }
  Re(e) {
    const t = Math.floor(e / 8),
      n = e % 8;
    this.bitmap[t] |= 1 << n;
  }
}
class Il extends Error {
  constructor() {
    (super(...arguments), (this.name = 'BloomFilterError'));
  }
}
class Tl {
  constructor(e, t, n, r, i) {
    ((this.snapshotVersion = e),
      (this.targetChanges = t),
      (this.targetMismatches = n),
      (this.documentUpdates = r),
      (this.resolvedLimboDocuments = i));
  }
  static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
    const r = new Map();
    return (
      r.set(e, _l.createSynthesizedTargetChangeForCurrentChange(e, t, n)),
      new Tl(ko.min(), r, new Va(Eo), Iu(), xu())
    );
  }
}
class _l {
  constructor(e, t, n, r, i) {
    ((this.resumeToken = e),
      (this.current = t),
      (this.addedDocuments = n),
      (this.modifiedDocuments = r),
      (this.removedDocuments = i));
  }
  static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
    return new _l(n, t, xu(), xu(), xu());
  }
}
class El {
  constructor(e, t, n, r) {
    ((this.Ve = e), (this.removedTargetIds = t), (this.key = n), (this.me = r));
  }
}
class Sl {
  constructor(e, t) {
    ((this.targetId = e), (this.fe = t));
  }
}
class Cl {
  constructor(e, t, n = Wa.EMPTY_BYTE_STRING, r = null) {
    ((this.state = e), (this.targetIds = t), (this.resumeToken = n), (this.cause = r));
  }
}
class Al {
  constructor() {
    ((this.ge = 0),
      (this.pe = xl()),
      (this.ye = Wa.EMPTY_BYTE_STRING),
      (this.we = !1),
      (this.Se = !0));
  }
  get current() {
    return this.we;
  }
  get resumeToken() {
    return this.ye;
  }
  get be() {
    return 0 !== this.ge;
  }
  get De() {
    return this.Se;
  }
  Ce(e) {
    e.approximateByteSize() > 0 && ((this.Se = !0), (this.ye = e));
  }
  ve() {
    let e = xu(),
      t = xu(),
      n = xu();
    return (
      this.pe.forEach((r, i) => {
        switch (i) {
          case 0:
            e = e.add(r);
            break;
          case 2:
            t = t.add(r);
            break;
          case 1:
            n = n.add(r);
            break;
          default:
            co();
        }
      }),
      new _l(this.ye, this.we, e, t, n)
    );
  }
  Fe() {
    ((this.Se = !1), (this.pe = xl()));
  }
  Me(e, t) {
    ((this.Se = !0), (this.pe = this.pe.insert(e, t)));
  }
  xe(e) {
    ((this.Se = !0), (this.pe = this.pe.remove(e)));
  }
  Oe() {
    this.ge += 1;
  }
  Ne() {
    ((this.ge -= 1), uo(this.ge >= 0));
  }
  Le() {
    ((this.Se = !0), (this.we = !0));
  }
}
class kl {
  constructor(e) {
    ((this.Be = e),
      (this.ke = new Map()),
      (this.qe = Iu()),
      (this.Qe = Dl()),
      (this.Ke = new Va(Eo)));
  }
  $e(e) {
    for (const t of e.Ve)
      e.me && e.me.isFoundDocument() ? this.Ue(t, e.me) : this.We(t, e.key, e.me);
    for (const t of e.removedTargetIds) this.We(t, e.key, e.me);
  }
  Ge(e) {
    this.forEachTarget(e, t => {
      const n = this.ze(t);
      switch (e.state) {
        case 0:
          this.je(t) && n.Ce(e.resumeToken);
          break;
        case 1:
          (n.Ne(), n.be || n.Fe(), n.Ce(e.resumeToken));
          break;
        case 2:
          (n.Ne(), n.be || this.removeTarget(t));
          break;
        case 3:
          this.je(t) && (n.Le(), n.Ce(e.resumeToken));
          break;
        case 4:
          this.je(t) && (this.He(t), n.Ce(e.resumeToken));
          break;
        default:
          co();
      }
    });
  }
  forEachTarget(e, t) {
    e.targetIds.length > 0
      ? e.targetIds.forEach(t)
      : this.ke.forEach((e, n) => {
          this.je(n) && t(n);
        });
  }
  Je(e) {
    const t = e.targetId,
      n = e.fe.count,
      r = this.Ye(t);
    if (r) {
      const i = r.target;
      if (tu(i))
        if (0 === n) {
          const e = new Ro(i.path);
          this.We(t, e, Cc.newNoDocument(e, ko.min()));
        } else uo(1 === n);
      else {
        const r = this.Ze(t);
        if (r !== n) {
          const n = this.Xe(e),
            i = n ? this.et(n, e, r) : 1;
          if (0 !== i) {
            this.He(t);
            const e =
              2 === i
                ? 'TargetPurposeExistenceFilterMismatchBloom'
                : 'TargetPurposeExistenceFilterMismatch';
            this.Ke = this.Ke.insert(t, e);
          }
        }
      }
    }
  }
  Xe(e) {
    const t = e.fe.unchangedNames;
    if (!t || !t.bits) return null;
    const {
      bits: { bitmap: n = '', padding: r = 0 },
      hashCount: i = 0,
    } = t;
    let s, o;
    try {
      s = Xa(n).toUint8Array();
    } catch (e) {
      if (e instanceof Ka)
        return (
          oo(
            'Decoding the base64 bloom filter in existence filter failed (' +
              e.message +
              '); ignoring the bloom filter and falling back to full re-query.'
          ),
          null
        );
      throw e;
    }
    try {
      o = new bl(s, r, i);
    } catch (e) {
      return (
        oo(e instanceof Il ? 'BloomFilter error: ' : 'Applying bloom filter failed: ', e),
        null
      );
    }
    return 0 === o.Te ? null : o;
  }
  et(e, t, n) {
    return t.fe.count === n - this.rt(e, t.targetId) ? 0 : 2;
  }
  rt(e, t) {
    const n = this.Be.getRemoteKeysForTarget(t);
    let r = 0;
    return (
      n.forEach(n => {
        const i = this.Be.nt(),
          s = `projects/${i.projectId}/databases/${
            i.database
          }/documents/${n.path.canonicalString()}`;
        e.mightContain(s) || (this.We(t, n, null), r++);
      }),
      r
    );
  }
  it(e) {
    const t = new Map();
    this.ke.forEach((n, r) => {
      const i = this.Ye(r);
      if (i) {
        if (n.current && tu(i.target)) {
          const t = new Ro(i.target.path);
          null !== this.qe.get(t) || this.st(r, t) || this.We(r, t, Cc.newNoDocument(t, e));
        }
        n.De && (t.set(r, n.ve()), n.Fe());
      }
    });
    let n = xu();
    (this.Qe.forEach((e, t) => {
      let r = !0;
      (t.forEachWhile(e => {
        const t = this.Ye(e);
        return !t || 'TargetPurposeLimboResolution' === t.purpose || ((r = !1), !1);
      }),
        r && (n = n.add(e)));
    }),
      this.qe.forEach((t, n) => n.setReadTime(e)));
    const r = new Tl(e, t, this.Ke, this.qe, n);
    return ((this.qe = Iu()), (this.Qe = Dl()), (this.Ke = new Va(Eo)), r);
  }
  Ue(e, t) {
    if (!this.je(e)) return;
    const n = this.st(e, t.key) ? 2 : 0;
    (this.ze(e).Me(t.key, n),
      (this.qe = this.qe.insert(t.key, t)),
      (this.Qe = this.Qe.insert(t.key, this.ot(t.key).add(e))));
  }
  We(e, t, n) {
    if (!this.je(e)) return;
    const r = this.ze(e);
    (this.st(e, t) ? r.Me(t, 1) : r.xe(t),
      (this.Qe = this.Qe.insert(t, this.ot(t).delete(e))),
      n && (this.qe = this.qe.insert(t, n)));
  }
  removeTarget(e) {
    this.ke.delete(e);
  }
  Ze(e) {
    const t = this.ze(e).ve();
    return this.Be.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
  }
  Oe(e) {
    this.ze(e).Oe();
  }
  ze(e) {
    let t = this.ke.get(e);
    return (t || ((t = new Al()), this.ke.set(e, t)), t);
  }
  ot(e) {
    let t = this.Qe.get(e);
    return (t || ((t = new za(Eo)), (this.Qe = this.Qe.insert(e, t))), t);
  }
  je(e) {
    const t = null !== this.Ye(e);
    return (t || io('WatchChangeAggregator', 'Detected inactive target', e), t);
  }
  Ye(e) {
    const t = this.ke.get(e);
    return t && t.be ? null : this.Be._t(e);
  }
  He(e) {
    (this.ke.set(e, new Al()),
      this.Be.getRemoteKeysForTarget(e).forEach(t => {
        this.We(e, t, null);
      }));
  }
  st(e, t) {
    return this.Be.getRemoteKeysForTarget(e).has(t);
  }
}
function Dl() {
  return new Va(Ro.comparator);
}
function xl() {
  return new Va(Ro.comparator);
}
const Nl = { asc: 'ASCENDING', desc: 'DESCENDING' },
  Ol = {
    '<': 'LESS_THAN',
    '<=': 'LESS_THAN_OR_EQUAL',
    '>': 'GREATER_THAN',
    '>=': 'GREATER_THAN_OR_EQUAL',
    '==': 'EQUAL',
    '!=': 'NOT_EQUAL',
    'array-contains': 'ARRAY_CONTAINS',
    in: 'IN',
    'not-in': 'NOT_IN',
    'array-contains-any': 'ARRAY_CONTAINS_ANY',
  },
  Rl = { and: 'AND', or: 'OR' };
class Pl {
  constructor(e, t) {
    ((this.databaseId = e), (this.useProto3Json = t));
  }
}
function Ml(e, t) {
  return e.useProto3Json || ia(t) ? t : { value: t };
}
function Ll(e, t) {
  return e.useProto3Json
    ? `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, '').replace('Z', '')}.${(
        '000000000' + t.nanoseconds
      ).slice(-9)}Z`
    : { seconds: '' + t.seconds, nanos: t.nanoseconds };
}
function Fl(e, t) {
  return e.useProto3Json ? t.toBase64() : t.toUint8Array();
}
function Ul(e, t) {
  return Ll(e, t.toTimestamp());
}
function Vl(e) {
  return (
    uo(!!e),
    ko.fromTimestamp(
      (function (e) {
        const t = Qa(e);
        return new Ao(t.seconds, t.nanos);
      })(e)
    )
  );
}
function Bl(e, t) {
  return jl(e, t).canonicalString();
}
function jl(e, t) {
  const n = (function (e) {
    return new xo(['projects', e.projectId, 'databases', e.database]);
  })(e).child('documents');
  return void 0 === t ? n : n.child(t);
}
function zl(e) {
  const t = xo.fromString(e);
  return (uo(uh(t)), t);
}
function ql(e, t) {
  return Bl(e.databaseId, t.path);
}
function Gl(e, t) {
  const n = zl(t);
  if (n.get(1) !== e.databaseId.projectId)
    throw new fo(
      ho.INVALID_ARGUMENT,
      'Tried to deserialize key from different project: ' +
        n.get(1) +
        ' vs ' +
        e.databaseId.projectId
    );
  if (n.get(3) !== e.databaseId.database)
    throw new fo(
      ho.INVALID_ARGUMENT,
      'Tried to deserialize key from different database: ' +
        n.get(3) +
        ' vs ' +
        e.databaseId.database
    );
  return new Ro(Hl(n));
}
function $l(e, t) {
  return Bl(e.databaseId, t);
}
function Kl(e) {
  const t = zl(e);
  return 4 === t.length ? xo.emptyPath() : Hl(t);
}
function Wl(e) {
  return new xo([
    'projects',
    e.databaseId.projectId,
    'databases',
    e.databaseId.database,
  ]).canonicalString();
}
function Hl(e) {
  return (uo(e.length > 4 && 'documents' === e.get(4)), e.popFirst(5));
}
function Ql(e, t, n) {
  return { name: ql(e, t), fields: n.value.mapValue.fields };
}
function Yl(e, t) {
  let n;
  if (t instanceof rl) n = { update: Ql(e, t.key, t.value) };
  else if (t instanceof cl) n = { delete: ql(e, t.key) };
  else if (t instanceof il) n = { update: Ql(e, t.key, t.data), updateMask: ch(t.fieldMask) };
  else {
    if (!(t instanceof ul)) return co();
    n = { verify: ql(e, t.key) };
  }
  return (
    t.fieldTransforms.length > 0 &&
      (n.updateTransforms = t.fieldTransforms.map(e =>
        (function (e, t) {
          const n = t.transform;
          if (n instanceof Vu)
            return { fieldPath: t.field.canonicalString(), setToServerValue: 'REQUEST_TIME' };
          if (n instanceof Bu)
            return {
              fieldPath: t.field.canonicalString(),
              appendMissingElements: { values: n.elements },
            };
          if (n instanceof zu)
            return {
              fieldPath: t.field.canonicalString(),
              removeAllFromArray: { values: n.elements },
            };
          if (n instanceof Gu) return { fieldPath: t.field.canonicalString(), increment: n.Ie };
          throw co();
        })(0, e)
      )),
    t.precondition.isNone ||
      (n.currentDocument = (function (e, t) {
        return void 0 !== t.updateTime
          ? { updateTime: Ul(e, t.updateTime) }
          : void 0 !== t.exists
            ? { exists: t.exists }
            : co();
      })(e, t.precondition)),
    n
  );
}
function Xl(e, t) {
  const n = t.currentDocument
      ? (function (e) {
          return void 0 !== e.updateTime
            ? Qu.updateTime(Vl(e.updateTime))
            : void 0 !== e.exists
              ? Qu.exists(e.exists)
              : Qu.none();
        })(t.currentDocument)
      : Qu.none(),
    r = t.updateTransforms
      ? t.updateTransforms.map(t =>
          (function (e, t) {
            let n = null;
            if ('setToServerValue' in t)
              (uo('REQUEST_TIME' === t.setToServerValue), (n = new Vu()));
            else if ('appendMissingElements' in t) {
              const e = t.appendMissingElements.values || [];
              n = new Bu(e);
            } else if ('removeAllFromArray' in t) {
              const e = t.removeAllFromArray.values || [];
              n = new zu(e);
            } else 'increment' in t ? (n = new Gu(e, t.increment)) : co();
            const r = Oo.fromServerFormat(t.fieldPath);
            return new Wu(r, n);
          })(e, t)
        )
      : [];
  if (t.update) {
    t.update.name;
    const i = Gl(e, t.update.name),
      s = new Ec({ mapValue: { fields: t.update.fields } });
    if (t.updateMask) {
      const e = (function (e) {
        const t = e.fieldPaths || [];
        return new $a(t.map(e => Oo.fromServerFormat(e)));
      })(t.updateMask);
      return new il(i, s, e, n, r);
    }
    return new rl(i, s, n, r);
  }
  if (t.delete) {
    const r = Gl(e, t.delete);
    return new cl(r, n);
  }
  if (t.verify) {
    const r = Gl(e, t.verify);
    return new ul(r, n);
  }
  return co();
}
function Jl(e, t) {
  return { documents: [$l(e, t.path)] };
}
function Zl(e, t) {
  const n = { structuredQuery: {} },
    r = t.path;
  let i;
  (null !== t.collectionGroup
    ? ((i = r),
      (n.structuredQuery.from = [{ collectionId: t.collectionGroup, allDescendants: !0 }]))
    : ((i = r.popLast()), (n.structuredQuery.from = [{ collectionId: r.lastSegment() }])),
    (n.parent = $l(e, i)));
  const s = (function (e) {
    if (0 !== e.length) return ah(Pc.create(e, 'and'));
  })(t.filters);
  s && (n.structuredQuery.where = s);
  const o = (function (e) {
    if (0 !== e.length)
      return e.map(e =>
        (function (e) {
          return { field: sh(e.field), direction: nh(e.dir) };
        })(e)
      );
  })(t.orderBy);
  o && (n.structuredQuery.orderBy = o);
  const a = Ml(e, t.limit);
  return (
    null !== a && (n.structuredQuery.limit = a),
    t.startAt &&
      (n.structuredQuery.startAt = (function (e) {
        return { before: e.inclusive, values: e.position };
      })(t.startAt)),
    t.endAt &&
      (n.structuredQuery.endAt = (function (e) {
        return { before: !e.inclusive, values: e.position };
      })(t.endAt)),
    { ut: n, parent: i }
  );
}
function eh(e) {
  let t = Kl(e.parent);
  const n = e.structuredQuery,
    r = n.from ? n.from.length : 0;
  let i = null;
  if (r > 0) {
    uo(1 === r);
    const e = n.from[0];
    e.allDescendants ? (i = e.collectionId) : (t = t.child(e.collectionId));
  }
  let s = [];
  n.where &&
    (s = (function (e) {
      const t = th(e);
      return t instanceof Pc && Fc(t) ? t.getFilters() : [t];
    })(n.where));
  let o = [];
  n.orderBy &&
    (o = (function (e) {
      return e.map(e =>
        (function (e) {
          return new xc(
            oh(e.field),
            (function (e) {
              switch (e) {
                case 'ASCENDING':
                  return 'asc';
                case 'DESCENDING':
                  return 'desc';
                default:
                  return;
              }
            })(e.direction)
          );
        })(e)
      );
    })(n.orderBy));
  let a = null;
  n.limit &&
    (a = (function (e) {
      let t;
      return ((t = 'object' == typeof e ? e.value : e), ia(t) ? null : t);
    })(n.limit));
  let c = null;
  n.startAt &&
    (c = (function (e) {
      const t = !!e.before,
        n = e.values || [];
      return new Ac(n, t);
    })(n.startAt));
  let u = null;
  return (
    n.endAt &&
      (u = (function (e) {
        const t = !e.before,
          n = e.values || [];
        return new Ac(n, t);
      })(n.endAt)),
    (function (e, t, n, r, i, s, o, a) {
      return new su(e, t, n, r, i, s, o, a);
    })(t, i, o, s, a, 'F', c, u)
  );
}
function th(e) {
  return void 0 !== e.unaryFilter
    ? (function (e) {
        switch (e.unaryFilter.op) {
          case 'IS_NAN':
            const t = oh(e.unaryFilter.field);
            return Rc.create(t, '==', { doubleValue: NaN });
          case 'IS_NULL':
            const n = oh(e.unaryFilter.field);
            return Rc.create(n, '==', { nullValue: 'NULL_VALUE' });
          case 'IS_NOT_NAN':
            const r = oh(e.unaryFilter.field);
            return Rc.create(r, '!=', { doubleValue: NaN });
          case 'IS_NOT_NULL':
            const i = oh(e.unaryFilter.field);
            return Rc.create(i, '!=', { nullValue: 'NULL_VALUE' });
          default:
            return co();
        }
      })(e)
    : void 0 !== e.fieldFilter
      ? (function (e) {
          return Rc.create(
            oh(e.fieldFilter.field),
            (function (e) {
              switch (e) {
                case 'EQUAL':
                  return '==';
                case 'NOT_EQUAL':
                  return '!=';
                case 'GREATER_THAN':
                  return '>';
                case 'GREATER_THAN_OR_EQUAL':
                  return '>=';
                case 'LESS_THAN':
                  return '<';
                case 'LESS_THAN_OR_EQUAL':
                  return '<=';
                case 'ARRAY_CONTAINS':
                  return 'array-contains';
                case 'IN':
                  return 'in';
                case 'NOT_IN':
                  return 'not-in';
                case 'ARRAY_CONTAINS_ANY':
                  return 'array-contains-any';
                default:
                  return co();
              }
            })(e.fieldFilter.op),
            e.fieldFilter.value
          );
        })(e)
      : void 0 !== e.compositeFilter
        ? (function (e) {
            return Pc.create(
              e.compositeFilter.filters.map(e => th(e)),
              (function (e) {
                switch (e) {
                  case 'AND':
                    return 'and';
                  case 'OR':
                    return 'or';
                  default:
                    return co();
                }
              })(e.compositeFilter.op)
            );
          })(e)
        : co();
}
function nh(e) {
  return Nl[e];
}
function rh(e) {
  return Ol[e];
}
function ih(e) {
  return Rl[e];
}
function sh(e) {
  return { fieldPath: e.canonicalString() };
}
function oh(e) {
  return Oo.fromServerFormat(e.fieldPath);
}
function ah(e) {
  return e instanceof Rc
    ? (function (e) {
        if ('==' === e.op) {
          if (mc(e.value)) return { unaryFilter: { field: sh(e.field), op: 'IS_NAN' } };
          if (gc(e.value)) return { unaryFilter: { field: sh(e.field), op: 'IS_NULL' } };
        } else if ('!=' === e.op) {
          if (mc(e.value)) return { unaryFilter: { field: sh(e.field), op: 'IS_NOT_NAN' } };
          if (gc(e.value)) return { unaryFilter: { field: sh(e.field), op: 'IS_NOT_NULL' } };
        }
        return { fieldFilter: { field: sh(e.field), op: rh(e.op), value: e.value } };
      })(e)
    : e instanceof Pc
      ? (function (e) {
          const t = e.getFilters().map(e => ah(e));
          return 1 === t.length ? t[0] : { compositeFilter: { op: ih(e.op), filters: t } };
        })(e)
      : co();
}
function ch(e) {
  const t = [];
  return (e.fields.forEach(e => t.push(e.canonicalString())), { fieldPaths: t });
}
function uh(e) {
  return e.length >= 4 && 'projects' === e.get(0) && 'databases' === e.get(2);
}
class lh {
  constructor(e, t, n, r, i = ko.min(), s = ko.min(), o = Wa.EMPTY_BYTE_STRING, a = null) {
    ((this.target = e),
      (this.targetId = t),
      (this.purpose = n),
      (this.sequenceNumber = r),
      (this.snapshotVersion = i),
      (this.lastLimboFreeSnapshotVersion = s),
      (this.resumeToken = o),
      (this.expectedCount = a));
  }
  withSequenceNumber(e) {
    return new lh(
      this.target,
      this.targetId,
      this.purpose,
      e,
      this.snapshotVersion,
      this.lastLimboFreeSnapshotVersion,
      this.resumeToken,
      this.expectedCount
    );
  }
  withResumeToken(e, t) {
    return new lh(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      t,
      this.lastLimboFreeSnapshotVersion,
      e,
      null
    );
  }
  withExpectedCount(e) {
    return new lh(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      this.snapshotVersion,
      this.lastLimboFreeSnapshotVersion,
      this.resumeToken,
      e
    );
  }
  withLastLimboFreeSnapshotVersion(e) {
    return new lh(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      this.snapshotVersion,
      e,
      this.resumeToken,
      this.expectedCount
    );
  }
}
class hh {
  constructor(e) {
    this.ct = e;
  }
}
function dh(e, t) {
  const n = t.key,
    r = {
      prefixPath: n.getCollectionPath().popLast().toArray(),
      collectionGroup: n.collectionGroup,
      documentId: n.path.lastSegment(),
      readTime: fh(t.readTime),
      hasCommittedMutations: t.hasCommittedMutations,
    };
  if (t.isFoundDocument())
    r.document = (function (e, t) {
      return {
        name: ql(e, t.key),
        fields: t.data.value.mapValue.fields,
        updateTime: Ll(e, t.version.toTimestamp()),
        createTime: Ll(e, t.createTime.toTimestamp()),
      };
    })(e.ct, t);
  else if (t.isNoDocument()) r.noDocument = { path: n.path.toArray(), readTime: ph(t.version) };
  else {
    if (!t.isUnknownDocument()) return co();
    r.unknownDocument = { path: n.path.toArray(), version: ph(t.version) };
  }
  return r;
}
function fh(e) {
  const t = e.toTimestamp();
  return [t.seconds, t.nanoseconds];
}
function ph(e) {
  const t = e.toTimestamp();
  return { seconds: t.seconds, nanoseconds: t.nanoseconds };
}
function gh(e) {
  const t = new Ao(e.seconds, e.nanoseconds);
  return ko.fromTimestamp(t);
}
function mh(e, t) {
  const n = (t.baseMutations || []).map(t => Xl(e.ct, t));
  for (let e = 0; e < t.mutations.length - 1; ++e) {
    const n = t.mutations[e];
    if (e + 1 < t.mutations.length && void 0 !== t.mutations[e + 1].transform) {
      const r = t.mutations[e + 1];
      ((n.updateTransforms = r.transform.fieldTransforms), t.mutations.splice(e + 1, 1), ++e);
    }
  }
  const r = t.mutations.map(t => Xl(e.ct, t)),
    i = Ao.fromMillis(t.localWriteTimeMs);
  return new ll(t.batchId, i, n, r);
}
function yh(e) {
  const t = gh(e.readTime),
    n = void 0 !== e.lastLimboFreeSnapshotVersion ? gh(e.lastLimboFreeSnapshotVersion) : ko.min();
  let r;
  return (
    (r = (function (e) {
      return void 0 !== e.documents;
    })(e.query)
      ? (function (e) {
          return (uo(1 === e.documents.length), lu(ou(Kl(e.documents[0]))));
        })(e.query)
      : (function (e) {
          return lu(eh(e));
        })(e.query)),
    new lh(
      r,
      e.targetId,
      'TargetPurposeListen',
      e.lastListenSequenceNumber,
      t,
      n,
      Wa.fromBase64String(e.resumeToken)
    )
  );
}
function wh(e, t) {
  const n = ph(t.snapshotVersion),
    r = ph(t.lastLimboFreeSnapshotVersion);
  let i;
  i = tu(t.target) ? Jl(e.ct, t.target) : Zl(e.ct, t.target).ut;
  const s = t.resumeToken.toBase64();
  return {
    targetId: t.targetId,
    canonicalId: Zc(t.target),
    readTime: n,
    resumeToken: s,
    lastListenSequenceNumber: t.sequenceNumber,
    lastLimboFreeSnapshotVersion: r,
    query: i,
  };
}
function vh(e) {
  const t = eh({ parent: e.parent, structuredQuery: e.structuredQuery });
  return 'LAST' === e.limitType ? du(t, t.limit, 'L') : t;
}
function bh(e, t) {
  return new dl(t.largestBatchId, Xl(e.ct, t.overlayMutation));
}
function Ih(e, t) {
  const n = t.path.lastSegment();
  return [e, oa(t.path.popLast()), n];
}
function Th(e, t, n, r) {
  return {
    indexId: e,
    uid: t,
    sequenceNumber: n,
    readTime: ph(r.readTime),
    documentKey: oa(r.documentKey.path),
    largestBatchId: r.largestBatchId,
  };
}
class _h {
  getBundleMetadata(e, t) {
    return Eh(e)
      .get(t)
      .next(e => {
        if (e)
          return (function (e) {
            return { id: e.bundleId, createTime: gh(e.createTime), version: e.version };
          })(e);
      });
  }
  saveBundleMetadata(e, t) {
    return Eh(e).put(
      (function (e) {
        return { bundleId: e.id, createTime: ph(Vl(e.createTime)), version: e.version };
      })(t)
    );
  }
  getNamedQuery(e, t) {
    return Sh(e)
      .get(t)
      .next(e => {
        if (e)
          return (function (e) {
            return { name: e.name, query: vh(e.bundledQuery), readTime: gh(e.readTime) };
          })(e);
      });
  }
  saveNamedQuery(e, t) {
    return Sh(e).put(
      (function (e) {
        return { name: e.name, readTime: ph(Vl(e.readTime)), bundledQuery: e.bundledQuery };
      })(t)
    );
  }
}
function Eh(e) {
  return Ma(e, 'bundles');
}
function Sh(e) {
  return Ma(e, 'namedQueries');
}
class Ch {
  constructor(e, t) {
    ((this.serializer = e), (this.userId = t));
  }
  static lt(e, t) {
    const n = t.uid || '';
    return new Ch(e, n);
  }
  getOverlay(e, t) {
    return Ah(e)
      .get(Ih(this.userId, t))
      .next(e => (e ? bh(this.serializer, e) : null));
  }
  getOverlays(e, t) {
    const n = Su();
    return $o
      .forEach(t, t =>
        this.getOverlay(e, t).next(e => {
          null !== e && n.set(t, e);
        })
      )
      .next(() => n);
  }
  saveOverlays(e, t, n) {
    const r = [];
    return (
      n.forEach((n, i) => {
        const s = new dl(t, i);
        r.push(this.ht(e, s));
      }),
      $o.waitFor(r)
    );
  }
  removeOverlaysForBatchId(e, t, n) {
    const r = new Set();
    t.forEach(e => r.add(oa(e.getCollectionPath())));
    const i = [];
    return (
      r.forEach(t => {
        const r = IDBKeyRange.bound([this.userId, t, n], [this.userId, t, n + 1], !1, !0);
        i.push(Ah(e).H('collectionPathOverlayIndex', r));
      }),
      $o.waitFor(i)
    );
  }
  getOverlaysForCollection(e, t, n) {
    const r = Su(),
      i = oa(t),
      s = IDBKeyRange.bound([this.userId, i, n], [this.userId, i, Number.POSITIVE_INFINITY], !0);
    return Ah(e)
      .W('collectionPathOverlayIndex', s)
      .next(e => {
        for (const t of e) {
          const e = bh(this.serializer, t);
          r.set(e.getKey(), e);
        }
        return r;
      });
  }
  getOverlaysForCollectionGroup(e, t, n, r) {
    const i = Su();
    let s;
    const o = IDBKeyRange.bound(
      [this.userId, t, n],
      [this.userId, t, Number.POSITIVE_INFINITY],
      !0
    );
    return Ah(e)
      .Y({ index: 'collectionGroupOverlayIndex', range: o }, (e, t, n) => {
        const o = bh(this.serializer, t);
        i.size() < r || o.largestBatchId === s
          ? (i.set(o.getKey(), o), (s = o.largestBatchId))
          : n.done();
      })
      .next(() => i);
  }
  ht(e, t) {
    return Ah(e).put(
      (function (e, t, n) {
        const [r, i, s] = Ih(t, n.mutation.key);
        return {
          userId: t,
          collectionPath: i,
          documentId: s,
          collectionGroup: n.mutation.key.getCollectionGroup(),
          largestBatchId: n.largestBatchId,
          overlayMutation: Yl(e.ct, n.mutation),
        };
      })(this.serializer, this.userId, t)
    );
  }
}
function Ah(e) {
  return Ma(e, 'documentOverlays');
}
class kh {
  constructor() {}
  Pt(e, t) {
    (this.It(e, t), t.Tt());
  }
  It(e, t) {
    if ('nullValue' in e) this.Et(t, 5);
    else if ('booleanValue' in e) (this.Et(t, 10), t.dt(e.booleanValue ? 1 : 0));
    else if ('integerValue' in e) (this.Et(t, 15), t.dt(Ya(e.integerValue)));
    else if ('doubleValue' in e) {
      const n = Ya(e.doubleValue);
      isNaN(n) ? this.Et(t, 13) : (this.Et(t, 15), sa(n) ? t.dt(0) : t.dt(n));
    } else if ('timestampValue' in e) {
      let n = e.timestampValue;
      (this.Et(t, 20),
        'string' == typeof n && (n = Qa(n)),
        t.At(`${n.seconds || ''}`),
        t.dt(n.nanos || 0));
    } else if ('stringValue' in e) (this.Rt(e.stringValue, t), this.Vt(t));
    else if ('bytesValue' in e) (this.Et(t, 30), t.ft(Xa(e.bytesValue)), this.Vt(t));
    else if ('referenceValue' in e) this.gt(e.referenceValue, t);
    else if ('geoPointValue' in e) {
      const n = e.geoPointValue;
      (this.Et(t, 45), t.dt(n.latitude || 0), t.dt(n.longitude || 0));
    } else
      'mapValue' in e
        ? vc(e)
          ? this.Et(t, Number.MAX_SAFE_INTEGER)
          : (this.yt(e.mapValue, t), this.Vt(t))
        : 'arrayValue' in e
          ? (this.wt(e.arrayValue, t), this.Vt(t))
          : co();
  }
  Rt(e, t) {
    (this.Et(t, 25), this.St(e, t));
  }
  St(e, t) {
    t.At(e);
  }
  yt(e, t) {
    const n = e.fields || {};
    this.Et(t, 55);
    for (const e of Object.keys(n)) (this.Rt(e, t), this.It(n[e], t));
  }
  wt(e, t) {
    const n = e.values || [];
    this.Et(t, 50);
    for (const e of n) this.It(e, t);
  }
  gt(e, t) {
    (this.Et(t, 37),
      Ro.fromName(e).path.forEach(e => {
        (this.Et(t, 60), this.St(e, t));
      }));
  }
  Et(e, t) {
    e.dt(t);
  }
  Vt(e) {
    e.dt(2);
  }
}
function Dh(e) {
  if (0 === e) return 8;
  let t = 0;
  return (
    e >> 4 == 0 && ((t += 4), (e <<= 4)),
    e >> 6 == 0 && ((t += 2), (e <<= 2)),
    e >> 7 == 0 && (t += 1),
    t
  );
}
function xh(e) {
  const t =
    64 -
    (function (e) {
      let t = 0;
      for (let n = 0; n < 8; ++n) {
        const r = Dh(255 & e[n]);
        if (((t += r), 8 !== r)) break;
      }
      return t;
    })(e);
  return Math.ceil(t / 8);
}
kh.bt = new kh();
class Nh {
  constructor() {
    ((this.buffer = new Uint8Array(1024)), (this.position = 0));
  }
  Dt(e) {
    const t = e[Symbol.iterator]();
    let n = t.next();
    for (; !n.done; ) (this.Ct(n.value), (n = t.next()));
    this.vt();
  }
  Ft(e) {
    const t = e[Symbol.iterator]();
    let n = t.next();
    for (; !n.done; ) (this.Mt(n.value), (n = t.next()));
    this.xt();
  }
  Ot(e) {
    for (const t of e) {
      const e = t.charCodeAt(0);
      if (e < 128) this.Ct(e);
      else if (e < 2048) (this.Ct(960 | (e >>> 6)), this.Ct(128 | (63 & e)));
      else if (t < '\ud800' || '\udbff' < t)
        (this.Ct(480 | (e >>> 12)), this.Ct(128 | (63 & (e >>> 6))), this.Ct(128 | (63 & e)));
      else {
        const e = t.codePointAt(0);
        (this.Ct(240 | (e >>> 18)),
          this.Ct(128 | (63 & (e >>> 12))),
          this.Ct(128 | (63 & (e >>> 6))),
          this.Ct(128 | (63 & e)));
      }
    }
    this.vt();
  }
  Nt(e) {
    for (const t of e) {
      const e = t.charCodeAt(0);
      if (e < 128) this.Mt(e);
      else if (e < 2048) (this.Mt(960 | (e >>> 6)), this.Mt(128 | (63 & e)));
      else if (t < '\ud800' || '\udbff' < t)
        (this.Mt(480 | (e >>> 12)), this.Mt(128 | (63 & (e >>> 6))), this.Mt(128 | (63 & e)));
      else {
        const e = t.codePointAt(0);
        (this.Mt(240 | (e >>> 18)),
          this.Mt(128 | (63 & (e >>> 12))),
          this.Mt(128 | (63 & (e >>> 6))),
          this.Mt(128 | (63 & e)));
      }
    }
    this.xt();
  }
  Lt(e) {
    const t = this.Bt(e),
      n = xh(t);
    (this.kt(1 + n), (this.buffer[this.position++] = 255 & n));
    for (let e = t.length - n; e < t.length; ++e) this.buffer[this.position++] = 255 & t[e];
  }
  qt(e) {
    const t = this.Bt(e),
      n = xh(t);
    (this.kt(1 + n), (this.buffer[this.position++] = ~(255 & n)));
    for (let e = t.length - n; e < t.length; ++e) this.buffer[this.position++] = ~(255 & t[e]);
  }
  Qt() {
    (this.Kt(255), this.Kt(255));
  }
  $t() {
    (this.Ut(255), this.Ut(255));
  }
  reset() {
    this.position = 0;
  }
  seed(e) {
    (this.kt(e.length), this.buffer.set(e, this.position), (this.position += e.length));
  }
  Wt() {
    return this.buffer.slice(0, this.position);
  }
  Bt(e) {
    const t = (function (e) {
        const t = new DataView(new ArrayBuffer(8));
        return (t.setFloat64(0, e, !1), new Uint8Array(t.buffer));
      })(e),
      n = 0 != (128 & t[0]);
    t[0] ^= n ? 255 : 128;
    for (let e = 1; e < t.length; ++e) t[e] ^= n ? 255 : 0;
    return t;
  }
  Ct(e) {
    const t = 255 & e;
    0 === t ? (this.Kt(0), this.Kt(255)) : 255 === t ? (this.Kt(255), this.Kt(0)) : this.Kt(t);
  }
  Mt(e) {
    const t = 255 & e;
    0 === t ? (this.Ut(0), this.Ut(255)) : 255 === t ? (this.Ut(255), this.Ut(0)) : this.Ut(e);
  }
  vt() {
    (this.Kt(0), this.Kt(1));
  }
  xt() {
    (this.Ut(0), this.Ut(1));
  }
  Kt(e) {
    (this.kt(1), (this.buffer[this.position++] = e));
  }
  Ut(e) {
    (this.kt(1), (this.buffer[this.position++] = ~e));
  }
  kt(e) {
    const t = e + this.position;
    if (t <= this.buffer.length) return;
    let n = 2 * this.buffer.length;
    n < t && (n = t);
    const r = new Uint8Array(n);
    (r.set(this.buffer), (this.buffer = r));
  }
}
class Oh {
  constructor(e) {
    this.Gt = e;
  }
  ft(e) {
    this.Gt.Dt(e);
  }
  At(e) {
    this.Gt.Ot(e);
  }
  dt(e) {
    this.Gt.Lt(e);
  }
  Tt() {
    this.Gt.Qt();
  }
}
class Rh {
  constructor(e) {
    this.Gt = e;
  }
  ft(e) {
    this.Gt.Ft(e);
  }
  At(e) {
    this.Gt.Nt(e);
  }
  dt(e) {
    this.Gt.qt(e);
  }
  Tt() {
    this.Gt.$t();
  }
}
class Ph {
  constructor() {
    ((this.Gt = new Nh()), (this.zt = new Oh(this.Gt)), (this.jt = new Rh(this.Gt)));
  }
  seed(e) {
    this.Gt.seed(e);
  }
  Ht(e) {
    return 0 === e ? this.zt : this.jt;
  }
  Wt() {
    return this.Gt.Wt();
  }
  reset() {
    this.Gt.reset();
  }
}
class Mh {
  constructor(e, t, n, r) {
    ((this.indexId = e),
      (this.documentKey = t),
      (this.arrayValue = n),
      (this.directionalValue = r));
  }
  Jt() {
    const e = this.directionalValue.length,
      t = 0 === e || 255 === this.directionalValue[e - 1] ? e + 1 : e,
      n = new Uint8Array(t);
    return (
      n.set(this.directionalValue, 0),
      t !== e ? n.set([0], this.directionalValue.length) : ++n[n.length - 1],
      new Mh(this.indexId, this.documentKey, this.arrayValue, n)
    );
  }
}
function Lh(e, t) {
  let n = e.indexId - t.indexId;
  return 0 !== n
    ? n
    : ((n = Fh(e.arrayValue, t.arrayValue)),
      0 !== n
        ? n
        : ((n = Fh(e.directionalValue, t.directionalValue)),
          0 !== n ? n : Ro.comparator(e.documentKey, t.documentKey)));
}
function Fh(e, t) {
  for (let n = 0; n < e.length && n < t.length; ++n) {
    const r = e[n] - t[n];
    if (0 !== r) return r;
  }
  return e.length - t.length;
}
class Uh {
  constructor(e) {
    ((this.Yt = new za((e, t) => Oo.comparator(e.field, t.field))),
      (this.collectionId = null != e.collectionGroup ? e.collectionGroup : e.path.lastSegment()),
      (this.Zt = e.orderBy),
      (this.Xt = []));
    for (const t of e.filters) {
      const e = t;
      e.isInequality() ? (this.Yt = this.Yt.add(e)) : this.Xt.push(e);
    }
  }
  get en() {
    return this.Yt.size > 1;
  }
  tn(e) {
    if ((uo(e.collectionGroup === this.collectionId), this.en)) return !1;
    const t = Mo(e);
    if (void 0 !== t && !this.nn(t)) return !1;
    const n = Lo(e);
    let r = new Set(),
      i = 0,
      s = 0;
    for (; i < n.length && this.nn(n[i]); ++i) r = r.add(n[i].fieldPath.canonicalString());
    if (i === n.length) return !0;
    if (this.Yt.size > 0) {
      const e = this.Yt.getIterator().getNext();
      if (!r.has(e.field.canonicalString())) {
        const t = n[i];
        if (!this.rn(e, t) || !this.sn(this.Zt[s++], t)) return !1;
      }
      ++i;
    }
    for (; i < n.length; ++i) {
      const e = n[i];
      if (s >= this.Zt.length || !this.sn(this.Zt[s++], e)) return !1;
    }
    return !0;
  }
  on() {
    if (this.en) return null;
    let e = new za(Oo.comparator);
    const t = [];
    for (const n of this.Xt)
      if (!n.field.isKeyField())
        if ('array-contains' === n.op || 'array-contains-any' === n.op) t.push(new Fo(n.field, 2));
        else {
          if (e.has(n.field)) continue;
          ((e = e.add(n.field)), t.push(new Fo(n.field, 0)));
        }
    for (const n of this.Zt)
      n.field.isKeyField() ||
        e.has(n.field) ||
        ((e = e.add(n.field)), t.push(new Fo(n.field, 'asc' === n.dir ? 0 : 1)));
    return new Po(Po.UNKNOWN_ID, this.collectionId, t, Uo.empty());
  }
  nn(e) {
    for (const t of this.Xt) if (this.rn(t, e)) return !0;
    return !1;
  }
  rn(e, t) {
    if (void 0 === e || !e.field.isEqual(t.fieldPath)) return !1;
    const n = 'array-contains' === e.op || 'array-contains-any' === e.op;
    return (2 === t.kind) === n;
  }
  sn(e, t) {
    return (
      !!e.field.isEqual(t.fieldPath) &&
      ((0 === t.kind && 'asc' === e.dir) || (1 === t.kind && 'desc' === e.dir))
    );
  }
}
function Vh(e) {
  var t, n;
  if ((uo(e instanceof Rc || e instanceof Pc), e instanceof Rc)) {
    if (e instanceof Hc) {
      const r =
        (null === (n = null === (t = e.value.arrayValue) || void 0 === t ? void 0 : t.values) ||
        void 0 === n
          ? void 0
          : n.map(t => Rc.create(e.field, '==', t))) || [];
      return Pc.create(r, 'or');
    }
    return e;
  }
  const r = e.filters.map(e => Vh(e));
  return Pc.create(r, e.op);
}
function Bh(e) {
  if (0 === e.getFilters().length) return [];
  const t = Gh(Vh(e));
  return (uo(qh(t)), jh(t) || zh(t) ? [t] : t.getFilters());
}
function jh(e) {
  return e instanceof Rc;
}
function zh(e) {
  return e instanceof Pc && Fc(e);
}
function qh(e) {
  return (
    jh(e) ||
    zh(e) ||
    (function (e) {
      if (e instanceof Pc && Lc(e)) {
        for (const t of e.getFilters()) if (!jh(t) && !zh(t)) return !1;
        return !0;
      }
      return !1;
    })(e)
  );
}
function Gh(e) {
  if ((uo(e instanceof Rc || e instanceof Pc), e instanceof Rc)) return e;
  if (1 === e.filters.length) return Gh(e.filters[0]);
  const t = e.filters.map(e => Gh(e));
  let n = Pc.create(t, e.op);
  return (
    (n = Wh(n)),
    qh(n)
      ? n
      : (uo(n instanceof Pc),
        uo(Mc(n)),
        uo(n.filters.length > 1),
        n.filters.reduce((e, t) => $h(e, t)))
  );
}
function $h(e, t) {
  let n;
  return (
    uo(e instanceof Rc || e instanceof Pc),
    uo(t instanceof Rc || t instanceof Pc),
    (n =
      e instanceof Rc
        ? t instanceof Rc
          ? (function (e, t) {
              return Pc.create([e, t], 'and');
            })(e, t)
          : Kh(e, t)
        : t instanceof Rc
          ? Kh(t, e)
          : (function (e, t) {
              if ((uo(e.filters.length > 0 && t.filters.length > 0), Mc(e) && Mc(t)))
                return jc(e, t.getFilters());
              const n = Lc(e) ? e : t,
                r = Lc(e) ? t : e,
                i = n.filters.map(e => $h(e, r));
              return Pc.create(i, 'or');
            })(e, t)),
    Wh(n)
  );
}
function Kh(e, t) {
  if (Mc(t)) return jc(t, e.getFilters());
  {
    const n = t.filters.map(t => $h(e, t));
    return Pc.create(n, 'or');
  }
}
function Wh(e) {
  if ((uo(e instanceof Rc || e instanceof Pc), e instanceof Rc)) return e;
  const t = e.getFilters();
  if (1 === t.length) return Wh(t[0]);
  if (Uc(e)) return e;
  const n = t.map(e => Wh(e)),
    r = [];
  return (
    n.forEach(t => {
      t instanceof Rc
        ? r.push(t)
        : t instanceof Pc && (t.op === e.op ? r.push(...t.filters) : r.push(t));
    }),
    1 === r.length ? r[0] : Pc.create(r, e.op)
  );
}
class Hh {
  constructor() {
    this._n = new Qh();
  }
  addToCollectionParentIndex(e, t) {
    return (this._n.add(t), $o.resolve());
  }
  getCollectionParents(e, t) {
    return $o.resolve(this._n.getEntries(t));
  }
  addFieldIndex(e, t) {
    return $o.resolve();
  }
  deleteFieldIndex(e, t) {
    return $o.resolve();
  }
  deleteAllFieldIndexes(e) {
    return $o.resolve();
  }
  createTargetIndexes(e, t) {
    return $o.resolve();
  }
  getDocumentsMatchingTarget(e, t) {
    return $o.resolve(null);
  }
  getIndexType(e, t) {
    return $o.resolve(0);
  }
  getFieldIndexes(e, t) {
    return $o.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return $o.resolve(null);
  }
  getMinOffset(e, t) {
    return $o.resolve(Bo.min());
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return $o.resolve(Bo.min());
  }
  updateCollectionGroup(e, t, n) {
    return $o.resolve();
  }
  updateIndexEntries(e, t) {
    return $o.resolve();
  }
}
class Qh {
  constructor() {
    this.index = {};
  }
  add(e) {
    const t = e.lastSegment(),
      n = e.popLast(),
      r = this.index[t] || new za(xo.comparator),
      i = !r.has(n);
    return ((this.index[t] = r.add(n)), i);
  }
  has(e) {
    const t = e.lastSegment(),
      n = e.popLast(),
      r = this.index[t];
    return r && r.has(n);
  }
  getEntries(e) {
    return (this.index[e] || new za(xo.comparator)).toArray();
  }
}
const Yh = new Uint8Array(0);
class Xh {
  constructor(e, t) {
    ((this.databaseId = t),
      (this.an = new Qh()),
      (this.un = new vu(
        e => Zc(e),
        (e, t) => eu(e, t)
      )),
      (this.uid = e.uid || ''));
  }
  addToCollectionParentIndex(e, t) {
    if (!this.an.has(t)) {
      const n = t.lastSegment(),
        r = t.popLast();
      e.addOnCommittedListener(() => {
        this.an.add(t);
      });
      const i = { collectionId: n, parent: oa(r) };
      return Jh(e).put(i);
    }
    return $o.resolve();
  }
  getCollectionParents(e, t) {
    const n = [],
      r = IDBKeyRange.bound([t, ''], [Co(t), ''], !1, !0);
    return Jh(e)
      .W(r)
      .next(e => {
        for (const r of e) {
          if (r.collectionId !== t) break;
          n.push(ua(r.parent));
        }
        return n;
      });
  }
  addFieldIndex(e, t) {
    const n = ed(e),
      r = (function (e) {
        return {
          indexId: e.indexId,
          collectionGroup: e.collectionGroup,
          fields: e.fields.map(e => [e.fieldPath.canonicalString(), e.kind]),
        };
      })(t);
    delete r.indexId;
    const i = n.add(r);
    if (t.indexState) {
      const n = td(e);
      return i.next(e => {
        n.put(Th(e, this.uid, t.indexState.sequenceNumber, t.indexState.offset));
      });
    }
    return i.next();
  }
  deleteFieldIndex(e, t) {
    const n = ed(e),
      r = td(e),
      i = Zh(e);
    return n
      .delete(t.indexId)
      .next(() => r.delete(IDBKeyRange.bound([t.indexId], [t.indexId + 1], !1, !0)))
      .next(() => i.delete(IDBKeyRange.bound([t.indexId], [t.indexId + 1], !1, !0)));
  }
  deleteAllFieldIndexes(e) {
    const t = ed(e),
      n = Zh(e),
      r = td(e);
    return t
      .H()
      .next(() => n.H())
      .next(() => r.H());
  }
  createTargetIndexes(e, t) {
    return $o.forEach(this.cn(t), t =>
      this.getIndexType(e, t).next(n => {
        if (0 === n || 1 === n) {
          const n = new Uh(t).on();
          if (null != n) return this.addFieldIndex(e, n);
        }
      })
    );
  }
  getDocumentsMatchingTarget(e, t) {
    const n = Zh(e);
    let r = !0;
    const i = new Map();
    return $o
      .forEach(this.cn(t), t =>
        this.ln(e, t).next(e => {
          (r && (r = !!e), i.set(t, e));
        })
      )
      .next(() => {
        if (r) {
          let e = xu();
          const r = [];
          return $o
            .forEach(i, (i, s) => {
              io(
                'IndexedDbIndexManager',
                `Using index ${(function (e) {
                  return `id=${e.indexId}|cg=${e.collectionGroup}|f=${e.fields
                    .map(e => `${e.fieldPath}:${e.kind}`)
                    .join(',')}`;
                })(i)} to execute ${Zc(t)}`
              );
              const o = (function (e, t) {
                  const n = Mo(t);
                  if (void 0 === n) return null;
                  for (const t of nu(e, n.fieldPath))
                    switch (t.op) {
                      case 'array-contains-any':
                        return t.value.arrayValue.values || [];
                      case 'array-contains':
                        return [t.value];
                    }
                  return null;
                })(s, i),
                a = (function (e, t) {
                  const n = new Map();
                  for (const r of Lo(t))
                    for (const t of nu(e, r.fieldPath))
                      switch (t.op) {
                        case '==':
                        case 'in':
                          n.set(r.fieldPath.canonicalString(), t.value);
                          break;
                        case 'not-in':
                        case '!=':
                          return (
                            n.set(r.fieldPath.canonicalString(), t.value),
                            Array.from(n.values())
                          );
                      }
                  return null;
                })(s, i),
                c = (function (e, t) {
                  const n = [];
                  let r = !0;
                  for (const i of Lo(t)) {
                    const t =
                      0 === i.kind ? ru(e, i.fieldPath, e.startAt) : iu(e, i.fieldPath, e.startAt);
                    (n.push(t.value), r && (r = t.inclusive));
                  }
                  return new Ac(n, r);
                })(s, i),
                u = (function (e, t) {
                  const n = [];
                  let r = !0;
                  for (const i of Lo(t)) {
                    const t =
                      0 === i.kind ? iu(e, i.fieldPath, e.endAt) : ru(e, i.fieldPath, e.endAt);
                    (n.push(t.value), r && (r = t.inclusive));
                  }
                  return new Ac(n, r);
                })(s, i),
                l = this.hn(i, s, c),
                h = this.hn(i, s, u),
                d = this.Pn(i, s, a),
                f = this.In(i.indexId, o, l, c.inclusive, h, u.inclusive, d);
              return $o.forEach(f, i =>
                n.j(i, t.limit).next(t => {
                  t.forEach(t => {
                    const n = Ro.fromSegments(t.documentKey);
                    e.has(n) || ((e = e.add(n)), r.push(n));
                  });
                })
              );
            })
            .next(() => r);
        }
        return $o.resolve(null);
      });
  }
  cn(e) {
    let t = this.un.get(e);
    return (
      t ||
      ((t =
        0 === e.filters.length
          ? [e]
          : Bh(Pc.create(e.filters, 'and')).map(t =>
              Jc(e.path, e.collectionGroup, e.orderBy, t.getFilters(), e.limit, e.startAt, e.endAt)
            )),
      this.un.set(e, t),
      t)
    );
  }
  In(e, t, n, r, i, s, o) {
    const a = (null != t ? t.length : 1) * Math.max(n.length, i.length),
      c = a / (null != t ? t.length : 1),
      u = [];
    for (let l = 0; l < a; ++l) {
      const a = t ? this.Tn(t[l / c]) : Yh,
        h = this.En(e, a, n[l % c], r),
        d = this.dn(e, a, i[l % c], s),
        f = o.map(t => this.En(e, a, t, !0));
      u.push(...this.createRange(h, d, f));
    }
    return u;
  }
  En(e, t, n, r) {
    const i = new Mh(e, Ro.empty(), t, n);
    return r ? i : i.Jt();
  }
  dn(e, t, n, r) {
    const i = new Mh(e, Ro.empty(), t, n);
    return r ? i.Jt() : i;
  }
  ln(e, t) {
    const n = new Uh(t),
      r = null != t.collectionGroup ? t.collectionGroup : t.path.lastSegment();
    return this.getFieldIndexes(e, r).next(e => {
      let t = null;
      for (const r of e) n.tn(r) && (!t || r.fields.length > t.fields.length) && (t = r);
      return t;
    });
  }
  getIndexType(e, t) {
    let n = 2;
    const r = this.cn(t);
    return $o
      .forEach(r, t =>
        this.ln(e, t).next(e => {
          e
            ? 0 !== n &&
              e.fields.length <
                (function (e) {
                  let t = new za(Oo.comparator),
                    n = !1;
                  for (const r of e.filters)
                    for (const e of r.getFlattenedFilters())
                      e.field.isKeyField() ||
                        ('array-contains' === e.op || 'array-contains-any' === e.op
                          ? (n = !0)
                          : (t = t.add(e.field)));
                  for (const n of e.orderBy) n.field.isKeyField() || (t = t.add(n.field));
                  return t.size + (n ? 1 : 0);
                })(t) &&
              (n = 1)
            : (n = 0);
        })
      )
      .next(() =>
        (function (e) {
          return null !== e.limit;
        })(t) &&
        r.length > 1 &&
        2 === n
          ? 1
          : n
      );
  }
  An(e, t) {
    const n = new Ph();
    for (const r of Lo(e)) {
      const e = t.data.field(r.fieldPath);
      if (null == e) return null;
      const i = n.Ht(r.kind);
      kh.bt.Pt(e, i);
    }
    return n.Wt();
  }
  Tn(e) {
    const t = new Ph();
    return (kh.bt.Pt(e, t.Ht(0)), t.Wt());
  }
  Rn(e, t) {
    const n = new Ph();
    return (
      kh.bt.Pt(
        dc(this.databaseId, t),
        n.Ht(
          (function (e) {
            const t = Lo(e);
            return 0 === t.length ? 0 : t[t.length - 1].kind;
          })(e)
        )
      ),
      n.Wt()
    );
  }
  Pn(e, t, n) {
    if (null === n) return [];
    let r = [];
    r.push(new Ph());
    let i = 0;
    for (const s of Lo(e)) {
      const e = n[i++];
      for (const n of r)
        if (this.Vn(t, s.fieldPath) && pc(e)) r = this.mn(r, s, e);
        else {
          const t = n.Ht(s.kind);
          kh.bt.Pt(e, t);
        }
    }
    return this.fn(r);
  }
  hn(e, t, n) {
    return this.Pn(e, t, n.position);
  }
  fn(e) {
    const t = [];
    for (let n = 0; n < e.length; ++n) t[n] = e[n].Wt();
    return t;
  }
  mn(e, t, n) {
    const r = [...e],
      i = [];
    for (const e of n.arrayValue.values || [])
      for (const n of r) {
        const r = new Ph();
        (r.seed(n.Wt()), kh.bt.Pt(e, r.Ht(t.kind)), i.push(r));
      }
    return i;
  }
  Vn(e, t) {
    return !!e.filters.find(
      e => e instanceof Rc && e.field.isEqual(t) && ('in' === e.op || 'not-in' === e.op)
    );
  }
  getFieldIndexes(e, t) {
    const n = ed(e),
      r = td(e);
    return (t ? n.W('collectionGroupIndex', IDBKeyRange.bound(t, t)) : n.W()).next(e => {
      const t = [];
      return $o
        .forEach(e, e =>
          r.get([e.indexId, this.uid]).next(n => {
            t.push(
              (function (e, t) {
                const n = t
                    ? new Uo(
                        t.sequenceNumber,
                        new Bo(gh(t.readTime), new Ro(ua(t.documentKey)), t.largestBatchId)
                      )
                    : Uo.empty(),
                  r = e.fields.map(([e, t]) => new Fo(Oo.fromServerFormat(e), t));
                return new Po(e.indexId, e.collectionGroup, r, n);
              })(e, n)
            );
          })
        )
        .next(() => t);
    });
  }
  getNextCollectionGroupToUpdate(e) {
    return this.getFieldIndexes(e).next(e =>
      0 === e.length
        ? null
        : (e.sort((e, t) => {
            const n = e.indexState.sequenceNumber - t.indexState.sequenceNumber;
            return 0 !== n ? n : Eo(e.collectionGroup, t.collectionGroup);
          }),
          e[0].collectionGroup)
    );
  }
  updateCollectionGroup(e, t, n) {
    const r = ed(e),
      i = td(e);
    return this.gn(e).next(e =>
      r
        .W('collectionGroupIndex', IDBKeyRange.bound(t, t))
        .next(t => $o.forEach(t, t => i.put(Th(t.indexId, this.uid, e, n))))
    );
  }
  updateIndexEntries(e, t) {
    const n = new Map();
    return $o.forEach(t, (t, r) => {
      const i = n.get(t.collectionGroup);
      return (i ? $o.resolve(i) : this.getFieldIndexes(e, t.collectionGroup)).next(
        i => (
          n.set(t.collectionGroup, i),
          $o.forEach(i, n =>
            this.pn(e, t, n).next(t => {
              const i = this.yn(r, n);
              return t.isEqual(i) ? $o.resolve() : this.wn(e, r, n, t, i);
            })
          )
        )
      );
    });
  }
  Sn(e, t, n, r) {
    return Zh(e).put({
      indexId: r.indexId,
      uid: this.uid,
      arrayValue: r.arrayValue,
      directionalValue: r.directionalValue,
      orderedDocumentKey: this.Rn(n, t.key),
      documentKey: t.key.path.toArray(),
    });
  }
  bn(e, t, n, r) {
    return Zh(e).delete([
      r.indexId,
      this.uid,
      r.arrayValue,
      r.directionalValue,
      this.Rn(n, t.key),
      t.key.path.toArray(),
    ]);
  }
  pn(e, t, n) {
    const r = Zh(e);
    let i = new za(Lh);
    return r
      .Y(
        {
          index: 'documentKeyIndex',
          range: IDBKeyRange.only([n.indexId, this.uid, this.Rn(n, t)]),
        },
        (e, r) => {
          i = i.add(new Mh(n.indexId, t, r.arrayValue, r.directionalValue));
        }
      )
      .next(() => i);
  }
  yn(e, t) {
    let n = new za(Lh);
    const r = this.An(t, e);
    if (null == r) return n;
    const i = Mo(t);
    if (null != i) {
      const s = e.data.field(i.fieldPath);
      if (pc(s))
        for (const i of s.arrayValue.values || [])
          n = n.add(new Mh(t.indexId, e.key, this.Tn(i), r));
    } else n = n.add(new Mh(t.indexId, e.key, Yh, r));
    return n;
  }
  wn(e, t, n, r, i) {
    io('IndexedDbIndexManager', "Updating index entries for document '%s'", t.key);
    const s = [];
    return (
      (function (e, t, n, r, i) {
        const s = e.getIterator(),
          o = t.getIterator();
        let a = Ga(s),
          c = Ga(o);
        for (; a || c; ) {
          let e = !1,
            t = !1;
          if (a && c) {
            const r = n(a, c);
            r < 0 ? (t = !0) : r > 0 && (e = !0);
          } else null != a ? (t = !0) : (e = !0);
          e ? (r(c), (c = Ga(o))) : t ? (i(a), (a = Ga(s))) : ((a = Ga(s)), (c = Ga(o)));
        }
      })(
        r,
        i,
        Lh,
        r => {
          s.push(this.Sn(e, t, n, r));
        },
        r => {
          s.push(this.bn(e, t, n, r));
        }
      ),
      $o.waitFor(s)
    );
  }
  gn(e) {
    let t = 1;
    return td(e)
      .Y(
        {
          index: 'sequenceNumberIndex',
          reverse: !0,
          range: IDBKeyRange.upperBound([this.uid, Number.MAX_SAFE_INTEGER]),
        },
        (e, n, r) => {
          (r.done(), (t = n.sequenceNumber + 1));
        }
      )
      .next(() => t);
  }
  createRange(e, t, n) {
    n = n.sort((e, t) => Lh(e, t)).filter((e, t, n) => !t || 0 !== Lh(e, n[t - 1]));
    const r = [];
    r.push(e);
    for (const i of n) {
      const n = Lh(i, e),
        s = Lh(i, t);
      if (0 === n) r[0] = e.Jt();
      else if (n > 0 && s < 0) (r.push(i), r.push(i.Jt()));
      else if (s > 0) break;
    }
    r.push(t);
    const i = [];
    for (let e = 0; e < r.length; e += 2) {
      if (this.Dn(r[e], r[e + 1])) return [];
      const t = [r[e].indexId, this.uid, r[e].arrayValue, r[e].directionalValue, Yh, []],
        n = [r[e + 1].indexId, this.uid, r[e + 1].arrayValue, r[e + 1].directionalValue, Yh, []];
      i.push(IDBKeyRange.bound(t, n));
    }
    return i;
  }
  Dn(e, t) {
    return Lh(e, t) > 0;
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return this.getFieldIndexes(e, t).next(nd);
  }
  getMinOffset(e, t) {
    return $o.mapArray(this.cn(t), t => this.ln(e, t).next(e => e || co())).next(nd);
  }
}
function Jh(e) {
  return Ma(e, 'collectionParents');
}
function Zh(e) {
  return Ma(e, 'indexEntries');
}
function ed(e) {
  return Ma(e, 'indexConfiguration');
}
function td(e) {
  return Ma(e, 'indexState');
}
function nd(e) {
  uo(0 !== e.length);
  let t = e[0].indexState.offset,
    n = t.largestBatchId;
  for (let r = 1; r < e.length; r++) {
    const i = e[r].indexState.offset;
    (jo(i, t) < 0 && (t = i), n < i.largestBatchId && (n = i.largestBatchId));
  }
  return new Bo(t.readTime, t.documentKey, n);
}
const rd = { didRun: !1, sequenceNumbersCollected: 0, targetsRemoved: 0, documentsRemoved: 0 };
class id {
  constructor(e, t, n) {
    ((this.cacheSizeCollectionThreshold = e),
      (this.percentileToCollect = t),
      (this.maximumSequenceNumbersToCollect = n));
  }
  static withCacheSize(e) {
    return new id(e, id.DEFAULT_COLLECTION_PERCENTILE, id.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
}
function sd(e, t, n) {
  const r = e.store('mutations'),
    i = e.store('documentMutations'),
    s = [],
    o = IDBKeyRange.only(n.batchId);
  let a = 0;
  const c = r.Y({ range: o }, (e, t, n) => (a++, n.delete()));
  s.push(
    c.next(() => {
      uo(1 === a);
    })
  );
  const u = [];
  for (const e of n.mutations) {
    const r = da(t, e.key.path, n.batchId);
    (s.push(i.delete(r)), u.push(e.key));
  }
  return $o.waitFor(s).next(() => u);
}
function od(e) {
  if (!e) return 0;
  let t;
  if (e.document) t = e.document;
  else if (e.unknownDocument) t = e.unknownDocument;
  else {
    if (!e.noDocument) throw co();
    t = e.noDocument;
  }
  return JSON.stringify(t).length;
}
((id.DEFAULT_COLLECTION_PERCENTILE = 10),
  (id.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3),
  (id.DEFAULT = new id(
    41943040,
    id.DEFAULT_COLLECTION_PERCENTILE,
    id.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
  )),
  (id.DISABLED = new id(-1, 0, 0)));
class ad {
  constructor(e, t, n, r) {
    ((this.userId = e),
      (this.serializer = t),
      (this.indexManager = n),
      (this.referenceDelegate = r),
      (this.Cn = {}));
  }
  static lt(e, t, n, r) {
    uo('' !== e.uid);
    const i = e.isAuthenticated() ? e.uid : '';
    return new ad(i, t, n, r);
  }
  checkEmpty(e) {
    let t = !0;
    const n = IDBKeyRange.bound(
      [this.userId, Number.NEGATIVE_INFINITY],
      [this.userId, Number.POSITIVE_INFINITY]
    );
    return ud(e)
      .Y({ index: 'userMutationsIndex', range: n }, (e, n, r) => {
        ((t = !1), r.done());
      })
      .next(() => t);
  }
  addMutationBatch(e, t, n, r) {
    const i = ld(e),
      s = ud(e);
    return s.add({}).next(o => {
      uo('number' == typeof o);
      const a = new ll(o, t, n, r),
        c = (function (e, t, n) {
          const r = n.baseMutations.map(t => Yl(e.ct, t)),
            i = n.mutations.map(t => Yl(e.ct, t));
          return {
            userId: t,
            batchId: n.batchId,
            localWriteTimeMs: n.localWriteTime.toMillis(),
            baseMutations: r,
            mutations: i,
          };
        })(this.serializer, this.userId, a),
        u = [];
      let l = new za((e, t) => Eo(e.canonicalString(), t.canonicalString()));
      for (const e of r) {
        const t = da(this.userId, e.key.path, o);
        ((l = l.add(e.key.path.popLast())), u.push(s.put(c)), u.push(i.put(t, fa)));
      }
      return (
        l.forEach(t => {
          u.push(this.indexManager.addToCollectionParentIndex(e, t));
        }),
        e.addOnCommittedListener(() => {
          this.Cn[o] = a.keys();
        }),
        $o.waitFor(u).next(() => a)
      );
    });
  }
  lookupMutationBatch(e, t) {
    return ud(e)
      .get(t)
      .next(e => (e ? (uo(e.userId === this.userId), mh(this.serializer, e)) : null));
  }
  vn(e, t) {
    return this.Cn[t]
      ? $o.resolve(this.Cn[t])
      : this.lookupMutationBatch(e, t).next(e => {
          if (e) {
            const n = e.keys();
            return ((this.Cn[t] = n), n);
          }
          return null;
        });
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1,
      r = IDBKeyRange.lowerBound([this.userId, n]);
    let i = null;
    return ud(e)
      .Y({ index: 'userMutationsIndex', range: r }, (e, t, r) => {
        (t.userId === this.userId && (uo(t.batchId >= n), (i = mh(this.serializer, t))), r.done());
      })
      .next(() => i);
  }
  getHighestUnacknowledgedBatchId(e) {
    const t = IDBKeyRange.upperBound([this.userId, Number.POSITIVE_INFINITY]);
    let n = -1;
    return ud(e)
      .Y({ index: 'userMutationsIndex', range: t, reverse: !0 }, (e, t, r) => {
        ((n = t.batchId), r.done());
      })
      .next(() => n);
  }
  getAllMutationBatches(e) {
    const t = IDBKeyRange.bound([this.userId, -1], [this.userId, Number.POSITIVE_INFINITY]);
    return ud(e)
      .W('userMutationsIndex', t)
      .next(e => e.map(e => mh(this.serializer, e)));
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = ha(this.userId, t.path),
      r = IDBKeyRange.lowerBound(n),
      i = [];
    return ld(e)
      .Y({ range: r }, (n, r, s) => {
        const [o, a, c] = n,
          u = ua(a);
        if (o === this.userId && t.path.isEqual(u))
          return ud(e)
            .get(c)
            .next(e => {
              if (!e) throw co();
              (uo(e.userId === this.userId), i.push(mh(this.serializer, e)));
            });
        s.done();
      })
      .next(() => i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new za(Eo);
    const r = [];
    return (
      t.forEach(t => {
        const i = ha(this.userId, t.path),
          s = IDBKeyRange.lowerBound(i),
          o = ld(e).Y({ range: s }, (e, r, i) => {
            const [s, o, a] = e,
              c = ua(o);
            s === this.userId && t.path.isEqual(c) ? (n = n.add(a)) : i.done();
          });
        r.push(o);
      }),
      $o.waitFor(r).next(() => this.Fn(e, n))
    );
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path,
      r = n.length + 1,
      i = ha(this.userId, n),
      s = IDBKeyRange.lowerBound(i);
    let o = new za(Eo);
    return ld(e)
      .Y({ range: s }, (e, t, i) => {
        const [s, a, c] = e,
          u = ua(a);
        s === this.userId && n.isPrefixOf(u) ? u.length === r && (o = o.add(c)) : i.done();
      })
      .next(() => this.Fn(e, o));
  }
  Fn(e, t) {
    const n = [],
      r = [];
    return (
      t.forEach(t => {
        r.push(
          ud(e)
            .get(t)
            .next(e => {
              if (null === e) throw co();
              (uo(e.userId === this.userId), n.push(mh(this.serializer, e)));
            })
        );
      }),
      $o.waitFor(r).next(() => n)
    );
  }
  removeMutationBatch(e, t) {
    return sd(e.ae, this.userId, t).next(
      n => (
        e.addOnCommittedListener(() => {
          this.Mn(t.batchId);
        }),
        $o.forEach(n, t => this.referenceDelegate.markPotentiallyOrphaned(e, t))
      )
    );
  }
  Mn(e) {
    delete this.Cn[e];
  }
  performConsistencyCheck(e) {
    return this.checkEmpty(e).next(t => {
      if (!t) return $o.resolve();
      const n = IDBKeyRange.lowerBound(
          (function (e) {
            return [e];
          })(this.userId)
        ),
        r = [];
      return ld(e)
        .Y({ range: n }, (e, t, n) => {
          if (e[0] === this.userId) {
            const t = ua(e[1]);
            r.push(t);
          } else n.done();
        })
        .next(() => {
          uo(0 === r.length);
        });
    });
  }
  containsKey(e, t) {
    return cd(e, this.userId, t);
  }
  xn(e) {
    return hd(e)
      .get(this.userId)
      .next(e => e || { userId: this.userId, lastAcknowledgedBatchId: -1, lastStreamToken: '' });
  }
}
function cd(e, t, n) {
  const r = ha(t, n.path),
    i = r[1],
    s = IDBKeyRange.lowerBound(r);
  let o = !1;
  return ld(e)
    .Y({ range: s, J: !0 }, (e, n, r) => {
      const [s, a, c] = e;
      (s === t && a === i && (o = !0), r.done());
    })
    .next(() => o);
}
function ud(e) {
  return Ma(e, 'mutations');
}
function ld(e) {
  return Ma(e, 'documentMutations');
}
function hd(e) {
  return Ma(e, 'mutationQueues');
}
class dd {
  constructor(e) {
    this.On = e;
  }
  next() {
    return ((this.On += 2), this.On);
  }
  static Nn() {
    return new dd(0);
  }
  static Ln() {
    return new dd(-1);
  }
}
class fd {
  constructor(e, t) {
    ((this.referenceDelegate = e), (this.serializer = t));
  }
  allocateTargetId(e) {
    return this.Bn(e).next(t => {
      const n = new dd(t.highestTargetId);
      return ((t.highestTargetId = n.next()), this.kn(e, t).next(() => t.highestTargetId));
    });
  }
  getLastRemoteSnapshotVersion(e) {
    return this.Bn(e).next(e =>
      ko.fromTimestamp(
        new Ao(e.lastRemoteSnapshotVersion.seconds, e.lastRemoteSnapshotVersion.nanoseconds)
      )
    );
  }
  getHighestSequenceNumber(e) {
    return this.Bn(e).next(e => e.highestListenSequenceNumber);
  }
  setTargetsMetadata(e, t, n) {
    return this.Bn(e).next(
      r => (
        (r.highestListenSequenceNumber = t),
        n && (r.lastRemoteSnapshotVersion = n.toTimestamp()),
        t > r.highestListenSequenceNumber && (r.highestListenSequenceNumber = t),
        this.kn(e, r)
      )
    );
  }
  addTargetData(e, t) {
    return this.qn(e, t).next(() =>
      this.Bn(e).next(n => ((n.targetCount += 1), this.Qn(t, n), this.kn(e, n)))
    );
  }
  updateTargetData(e, t) {
    return this.qn(e, t);
  }
  removeTargetData(e, t) {
    return this.removeMatchingKeysForTargetId(e, t.targetId)
      .next(() => pd(e).delete(t.targetId))
      .next(() => this.Bn(e))
      .next(t => (uo(t.targetCount > 0), (t.targetCount -= 1), this.kn(e, t)));
  }
  removeTargets(e, t, n) {
    let r = 0;
    const i = [];
    return pd(e)
      .Y((s, o) => {
        const a = yh(o);
        a.sequenceNumber <= t &&
          null === n.get(a.targetId) &&
          (r++, i.push(this.removeTargetData(e, a)));
      })
      .next(() => $o.waitFor(i))
      .next(() => r);
  }
  forEachTarget(e, t) {
    return pd(e).Y((e, n) => {
      const r = yh(n);
      t(r);
    });
  }
  Bn(e) {
    return gd(e)
      .get('targetGlobalKey')
      .next(e => (uo(null !== e), e));
  }
  kn(e, t) {
    return gd(e).put('targetGlobalKey', t);
  }
  qn(e, t) {
    return pd(e).put(wh(this.serializer, t));
  }
  Qn(e, t) {
    let n = !1;
    return (
      e.targetId > t.highestTargetId && ((t.highestTargetId = e.targetId), (n = !0)),
      e.sequenceNumber > t.highestListenSequenceNumber &&
        ((t.highestListenSequenceNumber = e.sequenceNumber), (n = !0)),
      n
    );
  }
  getTargetCount(e) {
    return this.Bn(e).next(e => e.targetCount);
  }
  getTargetData(e, t) {
    const n = Zc(t),
      r = IDBKeyRange.bound([n, Number.NEGATIVE_INFINITY], [n, Number.POSITIVE_INFINITY]);
    let i = null;
    return pd(e)
      .Y({ range: r, index: 'queryTargetsIndex' }, (e, n, r) => {
        const s = yh(n);
        eu(t, s.target) && ((i = s), r.done());
      })
      .next(() => i);
  }
  addMatchingKeys(e, t, n) {
    const r = [],
      i = md(e);
    return (
      t.forEach(t => {
        const s = oa(t.path);
        (r.push(i.put({ targetId: n, path: s })),
          r.push(this.referenceDelegate.addReference(e, n, t)));
      }),
      $o.waitFor(r)
    );
  }
  removeMatchingKeys(e, t, n) {
    const r = md(e);
    return $o.forEach(t, t => {
      const i = oa(t.path);
      return $o.waitFor([r.delete([n, i]), this.referenceDelegate.removeReference(e, n, t)]);
    });
  }
  removeMatchingKeysForTargetId(e, t) {
    const n = md(e),
      r = IDBKeyRange.bound([t], [t + 1], !1, !0);
    return n.delete(r);
  }
  getMatchingKeysForTargetId(e, t) {
    const n = IDBKeyRange.bound([t], [t + 1], !1, !0),
      r = md(e);
    let i = xu();
    return r
      .Y({ range: n, J: !0 }, (e, t, n) => {
        const r = ua(e[1]),
          s = new Ro(r);
        i = i.add(s);
      })
      .next(() => i);
  }
  containsKey(e, t) {
    const n = oa(t.path),
      r = IDBKeyRange.bound([n], [Co(n)], !1, !0);
    let i = 0;
    return md(e)
      .Y({ index: 'documentTargetsIndex', J: !0, range: r }, ([e, t], n, r) => {
        0 !== e && (i++, r.done());
      })
      .next(() => i > 0);
  }
  _t(e, t) {
    return pd(e)
      .get(t)
      .next(e => (e ? yh(e) : null));
  }
}
function pd(e) {
  return Ma(e, 'targets');
}
function gd(e) {
  return Ma(e, 'targetGlobal');
}
function md(e) {
  return Ma(e, 'targetDocuments');
}
function yd([e, t], [n, r]) {
  const i = Eo(e, n);
  return 0 === i ? Eo(t, r) : i;
}
class wd {
  constructor(e) {
    ((this.Kn = e), (this.buffer = new za(yd)), (this.$n = 0));
  }
  Un() {
    return ++this.$n;
  }
  Wn(e) {
    const t = [e, this.Un()];
    if (this.buffer.size < this.Kn) this.buffer = this.buffer.add(t);
    else {
      const e = this.buffer.last();
      yd(t, e) < 0 && (this.buffer = this.buffer.delete(e).add(t));
    }
  }
  get maxValue() {
    return this.buffer.last()[0];
  }
}
class vd {
  constructor(e, t, n) {
    ((this.garbageCollector = e), (this.asyncQueue = t), (this.localStore = n), (this.Gn = null));
  }
  start() {
    -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.zn(6e4);
  }
  stop() {
    this.Gn && (this.Gn.cancel(), (this.Gn = null));
  }
  get started() {
    return null !== this.Gn;
  }
  zn(e) {
    (io('LruGarbageCollector', `Garbage collection scheduled in ${e}ms`),
      (this.Gn = this.asyncQueue.enqueueAfterDelay('lru_garbage_collection', e, async () => {
        this.Gn = null;
        try {
          await this.localStore.collectGarbage(this.garbageCollector);
        } catch (e) {
          Yo(e)
            ? io('LruGarbageCollector', 'Ignoring IndexedDB error during garbage collection: ', e)
            : await Go(e);
        }
        await this.zn(3e5);
      })));
  }
}
class bd {
  constructor(e, t) {
    ((this.jn = e), (this.params = t));
  }
  calculateTargetCount(e, t) {
    return this.jn.Hn(e).next(e => Math.floor((t / 100) * e));
  }
  nthSequenceNumber(e, t) {
    if (0 === t) return $o.resolve(ra._e);
    const n = new wd(t);
    return this.jn
      .forEachTarget(e, e => n.Wn(e.sequenceNumber))
      .next(() => this.jn.Jn(e, e => n.Wn(e)))
      .next(() => n.maxValue);
  }
  removeTargets(e, t, n) {
    return this.jn.removeTargets(e, t, n);
  }
  removeOrphanedDocuments(e, t) {
    return this.jn.removeOrphanedDocuments(e, t);
  }
  collect(e, t) {
    return -1 === this.params.cacheSizeCollectionThreshold
      ? (io('LruGarbageCollector', 'Garbage collection skipped; disabled'), $o.resolve(rd))
      : this.getCacheSize(e).next(n =>
          n < this.params.cacheSizeCollectionThreshold
            ? (io(
                'LruGarbageCollector',
                `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`
              ),
              rd)
            : this.Yn(e, t)
        );
  }
  getCacheSize(e) {
    return this.jn.getCacheSize(e);
  }
  Yn(e, t) {
    let n, r, i, s, o, a, c;
    const u = Date.now();
    return this.calculateTargetCount(e, this.params.percentileToCollect)
      .next(
        t => (
          t > this.params.maximumSequenceNumbersToCollect
            ? (io(
                'LruGarbageCollector',
                `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`
              ),
              (r = this.params.maximumSequenceNumbersToCollect))
            : (r = t),
          (s = Date.now()),
          this.nthSequenceNumber(e, r)
        )
      )
      .next(r => ((n = r), (o = Date.now()), this.removeTargets(e, n, t)))
      .next(t => ((i = t), (a = Date.now()), this.removeOrphanedDocuments(e, n)))
      .next(
        e => (
          (c = Date.now()),
          ro() <= Pe.DEBUG &&
            io(
              'LruGarbageCollector',
              `LRU Garbage Collection\n\tCounted targets in ${
                s - u
              }ms\n\tDetermined least recently used ${r} in ` +
                (o - s) +
                'ms\n' +
                `\tRemoved ${i} targets in ` +
                (a - o) +
                'ms\n' +
                `\tRemoved ${e} documents in ` +
                (c - a) +
                'ms\n' +
                `Total Duration: ${c - u}ms`
            ),
          $o.resolve({
            didRun: !0,
            sequenceNumbersCollected: r,
            targetsRemoved: i,
            documentsRemoved: e,
          })
        )
      );
  }
}
class Id {
  constructor(e, t) {
    ((this.db = e),
      (this.garbageCollector = (function (e, t) {
        return new bd(e, t);
      })(this, t)));
  }
  Hn(e) {
    const t = this.Zn(e);
    return this.db
      .getTargetCache()
      .getTargetCount(e)
      .next(e => t.next(t => e + t));
  }
  Zn(e) {
    let t = 0;
    return this.Jn(e, e => {
      t++;
    }).next(() => t);
  }
  forEachTarget(e, t) {
    return this.db.getTargetCache().forEachTarget(e, t);
  }
  Jn(e, t) {
    return this.Xn(e, (e, n) => t(n));
  }
  addReference(e, t, n) {
    return Td(e, n);
  }
  removeReference(e, t, n) {
    return Td(e, n);
  }
  removeTargets(e, t, n) {
    return this.db.getTargetCache().removeTargets(e, t, n);
  }
  markPotentiallyOrphaned(e, t) {
    return Td(e, t);
  }
  er(e, t) {
    return (function (e, t) {
      let n = !1;
      return hd(e)
        .Z(r => cd(e, r, t).next(e => (e && (n = !0), $o.resolve(!e))))
        .next(() => n);
    })(e, t);
  }
  removeOrphanedDocuments(e, t) {
    const n = this.db.getRemoteDocumentCache().newChangeBuffer(),
      r = [];
    let i = 0;
    return this.Xn(e, (s, o) => {
      if (o <= t) {
        const t = this.er(e, s).next(t => {
          if (!t)
            return (
              i++,
              n.getEntry(e, s).next(
                () => (
                  n.removeEntry(s, ko.min()),
                  md(e).delete(
                    (function (e) {
                      return [0, oa(e.path)];
                    })(s)
                  )
                )
              )
            );
        });
        r.push(t);
      }
    })
      .next(() => $o.waitFor(r))
      .next(() => n.apply(e))
      .next(() => i);
  }
  removeTarget(e, t) {
    const n = t.withSequenceNumber(e.currentSequenceNumber);
    return this.db.getTargetCache().updateTargetData(e, n);
  }
  updateLimboDocument(e, t) {
    return Td(e, t);
  }
  Xn(e, t) {
    const n = md(e);
    let r,
      i = ra._e;
    return n
      .Y({ index: 'documentTargetsIndex' }, ([e, n], { path: s, sequenceNumber: o }) => {
        0 === e ? (i !== ra._e && t(new Ro(ua(r)), i), (i = o), (r = s)) : (i = ra._e);
      })
      .next(() => {
        i !== ra._e && t(new Ro(ua(r)), i);
      });
  }
  getCacheSize(e) {
    return this.db.getRemoteDocumentCache().getSize(e);
  }
}
function Td(e, t) {
  return md(e).put(
    (function (e, t) {
      return { targetId: 0, path: oa(e.path), sequenceNumber: t };
    })(t, e.currentSequenceNumber)
  );
}
class _d {
  constructor() {
    ((this.changes = new vu(
      e => e.toString(),
      (e, t) => e.isEqual(t)
    )),
      (this.changesApplied = !1));
  }
  addEntry(e) {
    (this.assertNotApplied(), this.changes.set(e.key, e));
  }
  removeEntry(e, t) {
    (this.assertNotApplied(), this.changes.set(e, Cc.newInvalidDocument(e).setReadTime(t)));
  }
  getEntry(e, t) {
    this.assertNotApplied();
    const n = this.changes.get(t);
    return void 0 !== n ? $o.resolve(n) : this.getFromCache(e, t);
  }
  getEntries(e, t) {
    return this.getAllFromCache(e, t);
  }
  apply(e) {
    return (this.assertNotApplied(), (this.changesApplied = !0), this.applyChanges(e));
  }
  assertNotApplied() {}
}
class Ed {
  constructor(e) {
    this.serializer = e;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  addEntry(e, t, n) {
    return kd(e).put(n);
  }
  removeEntry(e, t, n) {
    return kd(e).delete(
      (function (e, t) {
        const n = e.path.toArray();
        return [n.slice(0, n.length - 2), n[n.length - 2], fh(t), n[n.length - 1]];
      })(t, n)
    );
  }
  updateMetadata(e, t) {
    return this.getMetadata(e).next(n => ((n.byteSize += t), this.tr(e, n)));
  }
  getEntry(e, t) {
    let n = Cc.newInvalidDocument(t);
    return kd(e)
      .Y({ index: 'documentKeyIndex', range: IDBKeyRange.only(Dd(t)) }, (e, r) => {
        n = this.nr(t, r);
      })
      .next(() => n);
  }
  rr(e, t) {
    let n = { size: 0, document: Cc.newInvalidDocument(t) };
    return kd(e)
      .Y({ index: 'documentKeyIndex', range: IDBKeyRange.only(Dd(t)) }, (e, r) => {
        n = { document: this.nr(t, r), size: od(r) };
      })
      .next(() => n);
  }
  getEntries(e, t) {
    let n = Iu();
    return this.ir(e, t, (e, t) => {
      const r = this.nr(e, t);
      n = n.insert(e, r);
    }).next(() => n);
  }
  sr(e, t) {
    let n = Iu(),
      r = new Va(Ro.comparator);
    return this.ir(e, t, (e, t) => {
      const i = this.nr(e, t);
      ((n = n.insert(e, i)), (r = r.insert(e, od(t))));
    }).next(() => ({ documents: n, _r: r }));
  }
  ir(e, t, n) {
    if (t.isEmpty()) return $o.resolve();
    let r = new za(Nd);
    t.forEach(e => (r = r.add(e)));
    const i = IDBKeyRange.bound(Dd(r.first()), Dd(r.last())),
      s = r.getIterator();
    let o = s.getNext();
    return kd(e)
      .Y({ index: 'documentKeyIndex', range: i }, (e, t, r) => {
        const i = Ro.fromSegments([...t.prefixPath, t.collectionGroup, t.documentId]);
        for (; o && Nd(o, i) < 0; ) (n(o, null), (o = s.getNext()));
        (o && o.isEqual(i) && (n(o, t), (o = s.hasNext() ? s.getNext() : null)),
          o ? r.U(Dd(o)) : r.done());
      })
      .next(() => {
        for (; o; ) (n(o, null), (o = s.hasNext() ? s.getNext() : null));
      });
  }
  getDocumentsMatchingQuery(e, t, n, r, i) {
    const s = t.path,
      o = [
        s.popLast().toArray(),
        s.lastSegment(),
        fh(n.readTime),
        n.documentKey.path.isEmpty() ? '' : n.documentKey.path.lastSegment(),
      ],
      a = [
        s.popLast().toArray(),
        s.lastSegment(),
        [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
        '',
      ];
    return kd(e)
      .W(IDBKeyRange.bound(o, a, !0))
      .next(e => {
        null == i || i.incrementDocumentReadCount(e.length);
        let n = Iu();
        for (const i of e) {
          const e = this.nr(
            Ro.fromSegments(i.prefixPath.concat(i.collectionGroup, i.documentId)),
            i
          );
          e.isFoundDocument() && (mu(t, e) || r.has(e.key)) && (n = n.insert(e.key, e));
        }
        return n;
      });
  }
  getAllFromCollectionGroup(e, t, n, r) {
    let i = Iu();
    const s = xd(t, n),
      o = xd(t, Bo.max());
    return kd(e)
      .Y({ index: 'collectionGroupIndex', range: IDBKeyRange.bound(s, o, !0) }, (e, t, n) => {
        const s = this.nr(Ro.fromSegments(t.prefixPath.concat(t.collectionGroup, t.documentId)), t);
        ((i = i.insert(s.key, s)), i.size === r && n.done());
      })
      .next(() => i);
  }
  newChangeBuffer(e) {
    return new Cd(this, !!e && e.trackRemovals);
  }
  getSize(e) {
    return this.getMetadata(e).next(e => e.byteSize);
  }
  getMetadata(e) {
    return Ad(e)
      .get('remoteDocumentGlobalKey')
      .next(e => (uo(!!e), e));
  }
  tr(e, t) {
    return Ad(e).put('remoteDocumentGlobalKey', t);
  }
  nr(e, t) {
    if (t) {
      const e = (function (e, t) {
        let n;
        if (t.document)
          n = (function (e, t, n) {
            const r = Gl(e, t.name),
              i = Vl(t.updateTime),
              s = t.createTime ? Vl(t.createTime) : ko.min(),
              o = new Ec({ mapValue: { fields: t.fields } }),
              a = Cc.newFoundDocument(r, i, s, o);
            return (n && a.setHasCommittedMutations(), n ? a.setHasCommittedMutations() : a);
          })(e.ct, t.document, !!t.hasCommittedMutations);
        else if (t.noDocument) {
          const e = Ro.fromSegments(t.noDocument.path),
            r = gh(t.noDocument.readTime);
          ((n = Cc.newNoDocument(e, r)), t.hasCommittedMutations && n.setHasCommittedMutations());
        } else {
          if (!t.unknownDocument) return co();
          {
            const e = Ro.fromSegments(t.unknownDocument.path),
              r = gh(t.unknownDocument.version);
            n = Cc.newUnknownDocument(e, r);
          }
        }
        return (
          t.readTime &&
            n.setReadTime(
              (function (e) {
                const t = new Ao(e[0], e[1]);
                return ko.fromTimestamp(t);
              })(t.readTime)
            ),
          n
        );
      })(this.serializer, t);
      if (!e.isNoDocument() || !e.version.isEqual(ko.min())) return e;
    }
    return Cc.newInvalidDocument(e);
  }
}
function Sd(e) {
  return new Ed(e);
}
class Cd extends _d {
  constructor(e, t) {
    (super(),
      (this.ar = e),
      (this.trackRemovals = t),
      (this.ur = new vu(
        e => e.toString(),
        (e, t) => e.isEqual(t)
      )));
  }
  applyChanges(e) {
    const t = [];
    let n = 0,
      r = new za((e, t) => Eo(e.canonicalString(), t.canonicalString()));
    return (
      this.changes.forEach((i, s) => {
        const o = this.ur.get(i);
        if ((t.push(this.ar.removeEntry(e, i, o.readTime)), s.isValidDocument())) {
          const a = dh(this.ar.serializer, s);
          r = r.add(i.path.popLast());
          const c = od(a);
          ((n += c - o.size), t.push(this.ar.addEntry(e, i, a)));
        } else if (((n -= o.size), this.trackRemovals)) {
          const n = dh(this.ar.serializer, s.convertToNoDocument(ko.min()));
          t.push(this.ar.addEntry(e, i, n));
        }
      }),
      r.forEach(n => {
        t.push(this.ar.indexManager.addToCollectionParentIndex(e, n));
      }),
      t.push(this.ar.updateMetadata(e, n)),
      $o.waitFor(t)
    );
  }
  getFromCache(e, t) {
    return this.ar
      .rr(e, t)
      .next(e => (this.ur.set(t, { size: e.size, readTime: e.document.readTime }), e.document));
  }
  getAllFromCache(e, t) {
    return this.ar.sr(e, t).next(
      ({ documents: e, _r: t }) => (
        t.forEach((t, n) => {
          this.ur.set(t, { size: n, readTime: e.get(t).readTime });
        }),
        e
      )
    );
  }
}
function Ad(e) {
  return Ma(e, 'remoteDocumentGlobal');
}
function kd(e) {
  return Ma(e, 'remoteDocumentsV14');
}
function Dd(e) {
  const t = e.path.toArray();
  return [t.slice(0, t.length - 2), t[t.length - 2], t[t.length - 1]];
}
function xd(e, t) {
  const n = t.documentKey.path.toArray();
  return [e, fh(t.readTime), n.slice(0, n.length - 2), n.length > 0 ? n[n.length - 1] : ''];
}
function Nd(e, t) {
  const n = e.path.toArray(),
    r = t.path.toArray();
  let i = 0;
  for (let e = 0; e < n.length - 2 && e < r.length - 2; ++e)
    if (((i = Eo(n[e], r[e])), i)) return i;
  return (
    (i = Eo(n.length, r.length)),
    i || ((i = Eo(n[n.length - 2], r[r.length - 2])), i || Eo(n[n.length - 1], r[r.length - 1]))
  );
}
class Od {
  constructor(e, t) {
    ((this.overlayedDocument = e), (this.mutatedFields = t));
  }
}
class Rd {
  constructor(e, t, n, r) {
    ((this.remoteDocumentCache = e),
      (this.mutationQueue = t),
      (this.documentOverlayCache = n),
      (this.indexManager = r));
  }
  getDocument(e, t) {
    let n = null;
    return this.documentOverlayCache
      .getOverlay(e, t)
      .next(r => ((n = r), this.remoteDocumentCache.getEntry(e, t)))
      .next(e => (null !== n && el(n.mutation, e, $a.empty(), Ao.now()), e));
  }
  getDocuments(e, t) {
    return this.remoteDocumentCache
      .getEntries(e, t)
      .next(t => this.getLocalViewOfDocuments(e, t, xu()).next(() => t));
  }
  getLocalViewOfDocuments(e, t, n = xu()) {
    const r = Su();
    return this.populateOverlays(e, r, t).next(() =>
      this.computeViews(e, t, r, n).next(e => {
        let t = _u();
        return (
          e.forEach((e, n) => {
            t = t.insert(e, n.overlayedDocument);
          }),
          t
        );
      })
    );
  }
  getOverlayedDocuments(e, t) {
    const n = Su();
    return this.populateOverlays(e, n, t).next(() => this.computeViews(e, t, n, xu()));
  }
  populateOverlays(e, t, n) {
    const r = [];
    return (
      n.forEach(e => {
        t.has(e) || r.push(e);
      }),
      this.documentOverlayCache.getOverlays(e, r).next(e => {
        e.forEach((e, n) => {
          t.set(e, n);
        });
      })
    );
  }
  computeViews(e, t, n, r) {
    let i = Iu();
    const s = Au(),
      o = Au();
    return (
      t.forEach((e, t) => {
        const o = n.get(t.key);
        r.has(t.key) && (void 0 === o || o.mutation instanceof il)
          ? (i = i.insert(t.key, t))
          : void 0 !== o
            ? (s.set(t.key, o.mutation.getFieldMask()),
              el(o.mutation, t, o.mutation.getFieldMask(), Ao.now()))
            : s.set(t.key, $a.empty());
      }),
      this.recalculateAndSaveOverlays(e, i).next(
        e => (
          e.forEach((e, t) => s.set(e, t)),
          t.forEach((e, t) => {
            var n;
            return o.set(e, new Od(t, null !== (n = s.get(e)) && void 0 !== n ? n : null));
          }),
          o
        )
      )
    );
  }
  recalculateAndSaveOverlays(e, t) {
    const n = Au();
    let r = new Va((e, t) => e - t),
      i = xu();
    return this.mutationQueue
      .getAllMutationBatchesAffectingDocumentKeys(e, t)
      .next(e => {
        for (const i of e)
          i.keys().forEach(e => {
            const s = t.get(e);
            if (null === s) return;
            let o = n.get(e) || $a.empty();
            ((o = i.applyToLocalView(s, o)), n.set(e, o));
            const a = (r.get(i.batchId) || xu()).add(e);
            r = r.insert(i.batchId, a);
          });
      })
      .next(() => {
        const s = [],
          o = r.getReverseIterator();
        for (; o.hasNext(); ) {
          const r = o.getNext(),
            a = r.key,
            c = r.value,
            u = Cu();
          (c.forEach(e => {
            if (!i.has(e)) {
              const r = Ju(t.get(e), n.get(e));
              (null !== r && u.set(e, r), (i = i.add(e)));
            }
          }),
            s.push(this.documentOverlayCache.saveOverlays(e, a, u)));
        }
        return $o.waitFor(s);
      })
      .next(() => n);
  }
  recalculateAndSaveOverlaysForDocumentKeys(e, t) {
    return this.remoteDocumentCache
      .getEntries(e, t)
      .next(t => this.recalculateAndSaveOverlays(e, t));
  }
  getDocumentsMatchingQuery(e, t, n, r) {
    return (function (e) {
      return Ro.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
    })(t)
      ? this.getDocumentsMatchingDocumentQuery(e, t.path)
      : cu(t)
        ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r)
        : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
  }
  getNextDocuments(e, t, n, r) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r).next(i => {
      const s =
        r - i.size > 0
          ? this.documentOverlayCache.getOverlaysForCollectionGroup(
              e,
              t,
              n.largestBatchId,
              r - i.size
            )
          : $o.resolve(Su());
      let o = -1,
        a = i;
      return s.next(t =>
        $o
          .forEach(
            t,
            (t, n) => (
              o < n.largestBatchId && (o = n.largestBatchId),
              i.get(t)
                ? $o.resolve()
                : this.remoteDocumentCache.getEntry(e, t).next(e => {
                    a = a.insert(t, e);
                  })
            )
          )
          .next(() => this.populateOverlays(e, t, i))
          .next(() => this.computeViews(e, a, t, xu()))
          .next(e => ({ batchId: o, changes: Eu(e) }))
      );
    });
  }
  getDocumentsMatchingDocumentQuery(e, t) {
    return this.getDocument(e, new Ro(t)).next(e => {
      let t = _u();
      return (e.isFoundDocument() && (t = t.insert(e.key, e)), t);
    });
  }
  getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
    const i = t.collectionGroup;
    let s = _u();
    return this.indexManager.getCollectionParents(e, i).next(o =>
      $o
        .forEach(o, o => {
          const a = (function (e, t) {
            return new su(
              t,
              null,
              e.explicitOrderBy.slice(),
              e.filters.slice(),
              e.limit,
              e.limitType,
              e.startAt,
              e.endAt
            );
          })(t, o.child(i));
          return this.getDocumentsMatchingCollectionQuery(e, a, n, r).next(e => {
            e.forEach((e, t) => {
              s = s.insert(e, t);
            });
          });
        })
        .next(() => s)
    );
  }
  getDocumentsMatchingCollectionQuery(e, t, n, r) {
    let i;
    return this.documentOverlayCache
      .getOverlaysForCollection(e, t.path, n.largestBatchId)
      .next(s => ((i = s), this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r)))
      .next(e => {
        i.forEach((t, n) => {
          const r = n.getKey();
          null === e.get(r) && (e = e.insert(r, Cc.newInvalidDocument(r)));
        });
        let n = _u();
        return (
          e.forEach((e, r) => {
            const s = i.get(e);
            (void 0 !== s && el(s.mutation, r, $a.empty(), Ao.now()),
              mu(t, r) && (n = n.insert(e, r)));
          }),
          n
        );
      });
  }
}
class Pd {
  constructor(e) {
    ((this.serializer = e), (this.cr = new Map()), (this.lr = new Map()));
  }
  getBundleMetadata(e, t) {
    return $o.resolve(this.cr.get(t));
  }
  saveBundleMetadata(e, t) {
    return (
      this.cr.set(
        t.id,
        (function (e) {
          return { id: e.id, version: e.version, createTime: Vl(e.createTime) };
        })(t)
      ),
      $o.resolve()
    );
  }
  getNamedQuery(e, t) {
    return $o.resolve(this.lr.get(t));
  }
  saveNamedQuery(e, t) {
    return (
      this.lr.set(
        t.name,
        (function (e) {
          return { name: e.name, query: vh(e.bundledQuery), readTime: Vl(e.readTime) };
        })(t)
      ),
      $o.resolve()
    );
  }
}
class Md {
  constructor() {
    ((this.overlays = new Va(Ro.comparator)), (this.hr = new Map()));
  }
  getOverlay(e, t) {
    return $o.resolve(this.overlays.get(t));
  }
  getOverlays(e, t) {
    const n = Su();
    return $o
      .forEach(t, t =>
        this.getOverlay(e, t).next(e => {
          null !== e && n.set(t, e);
        })
      )
      .next(() => n);
  }
  saveOverlays(e, t, n) {
    return (
      n.forEach((n, r) => {
        this.ht(e, t, r);
      }),
      $o.resolve()
    );
  }
  removeOverlaysForBatchId(e, t, n) {
    const r = this.hr.get(n);
    return (
      void 0 !== r &&
        (r.forEach(e => (this.overlays = this.overlays.remove(e))), this.hr.delete(n)),
      $o.resolve()
    );
  }
  getOverlaysForCollection(e, t, n) {
    const r = Su(),
      i = t.length + 1,
      s = new Ro(t.child('')),
      o = this.overlays.getIteratorFrom(s);
    for (; o.hasNext(); ) {
      const e = o.getNext().value,
        s = e.getKey();
      if (!t.isPrefixOf(s.path)) break;
      s.path.length === i && e.largestBatchId > n && r.set(e.getKey(), e);
    }
    return $o.resolve(r);
  }
  getOverlaysForCollectionGroup(e, t, n, r) {
    let i = new Va((e, t) => e - t);
    const s = this.overlays.getIterator();
    for (; s.hasNext(); ) {
      const e = s.getNext().value;
      if (e.getKey().getCollectionGroup() === t && e.largestBatchId > n) {
        let t = i.get(e.largestBatchId);
        (null === t && ((t = Su()), (i = i.insert(e.largestBatchId, t))), t.set(e.getKey(), e));
      }
    }
    const o = Su(),
      a = i.getIterator();
    for (; a.hasNext() && (a.getNext().value.forEach((e, t) => o.set(e, t)), !(o.size() >= r)); );
    return $o.resolve(o);
  }
  ht(e, t, n) {
    const r = this.overlays.get(n.key);
    if (null !== r) {
      const e = this.hr.get(r.largestBatchId).delete(n.key);
      this.hr.set(r.largestBatchId, e);
    }
    this.overlays = this.overlays.insert(n.key, new dl(t, n));
    let i = this.hr.get(t);
    (void 0 === i && ((i = xu()), this.hr.set(t, i)), this.hr.set(t, i.add(n.key)));
  }
}
class Ld {
  constructor() {
    ((this.Pr = new za(Fd.Ir)), (this.Tr = new za(Fd.Er)));
  }
  isEmpty() {
    return this.Pr.isEmpty();
  }
  addReference(e, t) {
    const n = new Fd(e, t);
    ((this.Pr = this.Pr.add(n)), (this.Tr = this.Tr.add(n)));
  }
  dr(e, t) {
    e.forEach(e => this.addReference(e, t));
  }
  removeReference(e, t) {
    this.Ar(new Fd(e, t));
  }
  Rr(e, t) {
    e.forEach(e => this.removeReference(e, t));
  }
  Vr(e) {
    const t = new Ro(new xo([])),
      n = new Fd(t, e),
      r = new Fd(t, e + 1),
      i = [];
    return (
      this.Tr.forEachInRange([n, r], e => {
        (this.Ar(e), i.push(e.key));
      }),
      i
    );
  }
  mr() {
    this.Pr.forEach(e => this.Ar(e));
  }
  Ar(e) {
    ((this.Pr = this.Pr.delete(e)), (this.Tr = this.Tr.delete(e)));
  }
  gr(e) {
    const t = new Ro(new xo([])),
      n = new Fd(t, e),
      r = new Fd(t, e + 1);
    let i = xu();
    return (
      this.Tr.forEachInRange([n, r], e => {
        i = i.add(e.key);
      }),
      i
    );
  }
  containsKey(e) {
    const t = new Fd(e, 0),
      n = this.Pr.firstAfterOrEqual(t);
    return null !== n && e.isEqual(n.key);
  }
}
class Fd {
  constructor(e, t) {
    ((this.key = e), (this.pr = t));
  }
  static Ir(e, t) {
    return Ro.comparator(e.key, t.key) || Eo(e.pr, t.pr);
  }
  static Er(e, t) {
    return Eo(e.pr, t.pr) || Ro.comparator(e.key, t.key);
  }
}
class Ud {
  constructor(e, t) {
    ((this.indexManager = e),
      (this.referenceDelegate = t),
      (this.mutationQueue = []),
      (this.yr = 1),
      (this.wr = new za(Fd.Ir)));
  }
  checkEmpty(e) {
    return $o.resolve(0 === this.mutationQueue.length);
  }
  addMutationBatch(e, t, n, r) {
    const i = this.yr;
    (this.yr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1]);
    const s = new ll(i, t, n, r);
    this.mutationQueue.push(s);
    for (const t of r)
      ((this.wr = this.wr.add(new Fd(t.key, i))),
        this.indexManager.addToCollectionParentIndex(e, t.key.path.popLast()));
    return $o.resolve(s);
  }
  lookupMutationBatch(e, t) {
    return $o.resolve(this.Sr(t));
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1,
      r = this.br(n),
      i = r < 0 ? 0 : r;
    return $o.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return $o.resolve(0 === this.mutationQueue.length ? -1 : this.yr - 1);
  }
  getAllMutationBatches(e) {
    return $o.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = new Fd(t, 0),
      r = new Fd(t, Number.POSITIVE_INFINITY),
      i = [];
    return (
      this.wr.forEachInRange([n, r], e => {
        const t = this.Sr(e.pr);
        i.push(t);
      }),
      $o.resolve(i)
    );
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new za(Eo);
    return (
      t.forEach(e => {
        const t = new Fd(e, 0),
          r = new Fd(e, Number.POSITIVE_INFINITY);
        this.wr.forEachInRange([t, r], e => {
          n = n.add(e.pr);
        });
      }),
      $o.resolve(this.Dr(n))
    );
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path,
      r = n.length + 1;
    let i = n;
    Ro.isDocumentKey(i) || (i = i.child(''));
    const s = new Fd(new Ro(i), 0);
    let o = new za(Eo);
    return (
      this.wr.forEachWhile(e => {
        const t = e.key.path;
        return !!n.isPrefixOf(t) && (t.length === r && (o = o.add(e.pr)), !0);
      }, s),
      $o.resolve(this.Dr(o))
    );
  }
  Dr(e) {
    const t = [];
    return (
      e.forEach(e => {
        const n = this.Sr(e);
        null !== n && t.push(n);
      }),
      t
    );
  }
  removeMutationBatch(e, t) {
    (uo(0 === this.Cr(t.batchId, 'removed')), this.mutationQueue.shift());
    let n = this.wr;
    return $o
      .forEach(t.mutations, r => {
        const i = new Fd(r.key, t.batchId);
        return ((n = n.delete(i)), this.referenceDelegate.markPotentiallyOrphaned(e, r.key));
      })
      .next(() => {
        this.wr = n;
      });
  }
  Mn(e) {}
  containsKey(e, t) {
    const n = new Fd(t, 0),
      r = this.wr.firstAfterOrEqual(n);
    return $o.resolve(t.isEqual(r && r.key));
  }
  performConsistencyCheck(e) {
    return (this.mutationQueue.length, $o.resolve());
  }
  Cr(e, t) {
    return this.br(e);
  }
  br(e) {
    return 0 === this.mutationQueue.length ? 0 : e - this.mutationQueue[0].batchId;
  }
  Sr(e) {
    const t = this.br(e);
    return t < 0 || t >= this.mutationQueue.length ? null : this.mutationQueue[t];
  }
}
class Vd {
  constructor(e) {
    ((this.vr = e), (this.docs = new Va(Ro.comparator)), (this.size = 0));
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  addEntry(e, t) {
    const n = t.key,
      r = this.docs.get(n),
      i = r ? r.size : 0,
      s = this.vr(t);
    return (
      (this.docs = this.docs.insert(n, { document: t.mutableCopy(), size: s })),
      (this.size += s - i),
      this.indexManager.addToCollectionParentIndex(e, n.path.popLast())
    );
  }
  removeEntry(e) {
    const t = this.docs.get(e);
    t && ((this.docs = this.docs.remove(e)), (this.size -= t.size));
  }
  getEntry(e, t) {
    const n = this.docs.get(t);
    return $o.resolve(n ? n.document.mutableCopy() : Cc.newInvalidDocument(t));
  }
  getEntries(e, t) {
    let n = Iu();
    return (
      t.forEach(e => {
        const t = this.docs.get(e);
        n = n.insert(e, t ? t.document.mutableCopy() : Cc.newInvalidDocument(e));
      }),
      $o.resolve(n)
    );
  }
  getDocumentsMatchingQuery(e, t, n, r) {
    let i = Iu();
    const s = t.path,
      o = new Ro(s.child('')),
      a = this.docs.getIteratorFrom(o);
    for (; a.hasNext(); ) {
      const {
        key: e,
        value: { document: o },
      } = a.getNext();
      if (!s.isPrefixOf(e.path)) break;
      e.path.length > s.length + 1 ||
        jo(Vo(o), n) <= 0 ||
        ((r.has(o.key) || mu(t, o)) && (i = i.insert(o.key, o.mutableCopy())));
    }
    return $o.resolve(i);
  }
  getAllFromCollectionGroup(e, t, n, r) {
    co();
  }
  Fr(e, t) {
    return $o.forEach(this.docs, e => t(e));
  }
  newChangeBuffer(e) {
    return new Bd(this);
  }
  getSize(e) {
    return $o.resolve(this.size);
  }
}
class Bd extends _d {
  constructor(e) {
    (super(), (this.ar = e));
  }
  applyChanges(e) {
    const t = [];
    return (
      this.changes.forEach((n, r) => {
        r.isValidDocument() ? t.push(this.ar.addEntry(e, r)) : this.ar.removeEntry(n);
      }),
      $o.waitFor(t)
    );
  }
  getFromCache(e, t) {
    return this.ar.getEntry(e, t);
  }
  getAllFromCache(e, t) {
    return this.ar.getEntries(e, t);
  }
}
class jd {
  constructor(e) {
    ((this.persistence = e),
      (this.Mr = new vu(e => Zc(e), eu)),
      (this.lastRemoteSnapshotVersion = ko.min()),
      (this.highestTargetId = 0),
      (this.Or = 0),
      (this.Nr = new Ld()),
      (this.targetCount = 0),
      (this.Lr = dd.Nn()));
  }
  forEachTarget(e, t) {
    return (this.Mr.forEach((e, n) => t(n)), $o.resolve());
  }
  getLastRemoteSnapshotVersion(e) {
    return $o.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return $o.resolve(this.Or);
  }
  allocateTargetId(e) {
    return ((this.highestTargetId = this.Lr.next()), $o.resolve(this.highestTargetId));
  }
  setTargetsMetadata(e, t, n) {
    return (n && (this.lastRemoteSnapshotVersion = n), t > this.Or && (this.Or = t), $o.resolve());
  }
  qn(e) {
    this.Mr.set(e.target, e);
    const t = e.targetId;
    (t > this.highestTargetId && ((this.Lr = new dd(t)), (this.highestTargetId = t)),
      e.sequenceNumber > this.Or && (this.Or = e.sequenceNumber));
  }
  addTargetData(e, t) {
    return (this.qn(t), (this.targetCount += 1), $o.resolve());
  }
  updateTargetData(e, t) {
    return (this.qn(t), $o.resolve());
  }
  removeTargetData(e, t) {
    return (
      this.Mr.delete(t.target),
      this.Nr.Vr(t.targetId),
      (this.targetCount -= 1),
      $o.resolve()
    );
  }
  removeTargets(e, t, n) {
    let r = 0;
    const i = [];
    return (
      this.Mr.forEach((s, o) => {
        o.sequenceNumber <= t &&
          null === n.get(o.targetId) &&
          (this.Mr.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r++);
      }),
      $o.waitFor(i).next(() => r)
    );
  }
  getTargetCount(e) {
    return $o.resolve(this.targetCount);
  }
  getTargetData(e, t) {
    const n = this.Mr.get(t) || null;
    return $o.resolve(n);
  }
  addMatchingKeys(e, t, n) {
    return (this.Nr.dr(t, n), $o.resolve());
  }
  removeMatchingKeys(e, t, n) {
    this.Nr.Rr(t, n);
    const r = this.persistence.referenceDelegate,
      i = [];
    return (
      r &&
        t.forEach(t => {
          i.push(r.markPotentiallyOrphaned(e, t));
        }),
      $o.waitFor(i)
    );
  }
  removeMatchingKeysForTargetId(e, t) {
    return (this.Nr.Vr(t), $o.resolve());
  }
  getMatchingKeysForTargetId(e, t) {
    const n = this.Nr.gr(t);
    return $o.resolve(n);
  }
  containsKey(e, t) {
    return $o.resolve(this.Nr.containsKey(t));
  }
}
class zd {
  constructor(e, t) {
    ((this.Br = {}),
      (this.overlays = {}),
      (this.kr = new ra(0)),
      (this.qr = !1),
      (this.qr = !0),
      (this.referenceDelegate = e(this)),
      (this.Qr = new jd(this)),
      (this.indexManager = new Hh()),
      (this.remoteDocumentCache = (function (e) {
        return new Vd(e);
      })(e => this.referenceDelegate.Kr(e))),
      (this.serializer = new hh(t)),
      (this.$r = new Pd(this.serializer)));
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return ((this.qr = !1), Promise.resolve());
  }
  get started() {
    return this.qr;
  }
  setDatabaseDeletedListener() {}
  setNetworkEnabled() {}
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t = this.overlays[e.toKey()];
    return (t || ((t = new Md()), (this.overlays[e.toKey()] = t)), t);
  }
  getMutationQueue(e, t) {
    let n = this.Br[e.toKey()];
    return (n || ((n = new Ud(t, this.referenceDelegate)), (this.Br[e.toKey()] = n)), n);
  }
  getTargetCache() {
    return this.Qr;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.$r;
  }
  runTransaction(e, t, n) {
    io('MemoryPersistence', 'Starting transaction:', e);
    const r = new qd(this.kr.next());
    return (
      this.referenceDelegate.Ur(),
      n(r)
        .next(e => this.referenceDelegate.Wr(r).next(() => e))
        .toPromise()
        .then(e => (r.raiseOnCommittedEvent(), e))
    );
  }
  Gr(e, t) {
    return $o.or(Object.values(this.Br).map(n => () => n.containsKey(e, t)));
  }
}
class qd extends qo {
  constructor(e) {
    (super(), (this.currentSequenceNumber = e));
  }
}
class Gd {
  constructor(e) {
    ((this.persistence = e), (this.zr = new Ld()), (this.jr = null));
  }
  static Hr(e) {
    return new Gd(e);
  }
  get Jr() {
    if (this.jr) return this.jr;
    throw co();
  }
  addReference(e, t, n) {
    return (this.zr.addReference(n, t), this.Jr.delete(n.toString()), $o.resolve());
  }
  removeReference(e, t, n) {
    return (this.zr.removeReference(n, t), this.Jr.add(n.toString()), $o.resolve());
  }
  markPotentiallyOrphaned(e, t) {
    return (this.Jr.add(t.toString()), $o.resolve());
  }
  removeTarget(e, t) {
    this.zr.Vr(t.targetId).forEach(e => this.Jr.add(e.toString()));
    const n = this.persistence.getTargetCache();
    return n
      .getMatchingKeysForTargetId(e, t.targetId)
      .next(e => {
        e.forEach(e => this.Jr.add(e.toString()));
      })
      .next(() => n.removeTargetData(e, t));
  }
  Ur() {
    this.jr = new Set();
  }
  Wr(e) {
    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return $o
      .forEach(this.Jr, n => {
        const r = Ro.fromPath(n);
        return this.Yr(e, r).next(e => {
          e || t.removeEntry(r, ko.min());
        });
      })
      .next(() => ((this.jr = null), t.apply(e)));
  }
  updateLimboDocument(e, t) {
    return this.Yr(e, t).next(e => {
      e ? this.Jr.delete(t.toString()) : this.Jr.add(t.toString());
    });
  }
  Kr(e) {
    return 0;
  }
  Yr(e, t) {
    return $o.or([
      () => $o.resolve(this.zr.containsKey(t)),
      () => this.persistence.getTargetCache().containsKey(e, t),
      () => this.persistence.Gr(e, t),
    ]);
  }
}
class $d {
  constructor(e) {
    this.serializer = e;
  }
  N(e, t, n, r) {
    const i = new Ko('createOrUpgrade', t);
    n < 1 &&
      r >= 1 &&
      ((function (e) {
        e.createObjectStore('owner');
      })(e),
      (function (e) {
        (e.createObjectStore('mutationQueues', { keyPath: 'userId' }),
          e
            .createObjectStore('mutations', { keyPath: 'batchId', autoIncrement: !0 })
            .createIndex('userMutationsIndex', la, { unique: !0 }),
          e.createObjectStore('documentMutations'));
      })(e),
      Kd(e),
      (function (e) {
        e.createObjectStore('remoteDocuments');
      })(e));
    let s = $o.resolve();
    return (
      n < 3 &&
        r >= 3 &&
        (0 !== n &&
          ((function (e) {
            (e.deleteObjectStore('targetDocuments'),
              e.deleteObjectStore('targets'),
              e.deleteObjectStore('targetGlobal'));
          })(e),
          Kd(e)),
        (s = s.next(() =>
          (function (e) {
            const t = e.store('targetGlobal'),
              n = {
                highestTargetId: 0,
                highestListenSequenceNumber: 0,
                lastRemoteSnapshotVersion: ko.min().toTimestamp(),
                targetCount: 0,
              };
            return t.put('targetGlobalKey', n);
          })(i)
        ))),
      n < 4 &&
        r >= 4 &&
        (0 !== n &&
          (s = s.next(() =>
            (function (e, t) {
              return t
                .store('mutations')
                .W()
                .next(n => {
                  (e.deleteObjectStore('mutations'),
                    e
                      .createObjectStore('mutations', { keyPath: 'batchId', autoIncrement: !0 })
                      .createIndex('userMutationsIndex', la, { unique: !0 }));
                  const r = t.store('mutations'),
                    i = n.map(e => r.put(e));
                  return $o.waitFor(i);
                });
            })(e, i)
          )),
        (s = s.next(() => {
          !(function (e) {
            e.createObjectStore('clientMetadata', { keyPath: 'clientId' });
          })(e);
        }))),
      n < 5 && r >= 5 && (s = s.next(() => this.Xr(i))),
      n < 6 &&
        r >= 6 &&
        (s = s.next(
          () => (
            (function (e) {
              e.createObjectStore('remoteDocumentGlobal');
            })(e),
            this.ei(i)
          )
        )),
      n < 7 && r >= 7 && (s = s.next(() => this.ti(i))),
      n < 8 && r >= 8 && (s = s.next(() => this.ni(e, i))),
      n < 9 &&
        r >= 9 &&
        (s = s.next(() => {
          !(function (e) {
            e.objectStoreNames.contains('remoteDocumentChanges') &&
              e.deleteObjectStore('remoteDocumentChanges');
          })(e);
        })),
      n < 10 && r >= 10 && (s = s.next(() => this.ri(i))),
      n < 11 &&
        r >= 11 &&
        (s = s.next(() => {
          (!(function (e) {
            e.createObjectStore('bundles', { keyPath: 'bundleId' });
          })(e),
            (function (e) {
              e.createObjectStore('namedQueries', { keyPath: 'name' });
            })(e));
        })),
      n < 12 &&
        r >= 12 &&
        (s = s.next(() => {
          !(function (e) {
            const t = e.createObjectStore('documentOverlays', { keyPath: Sa });
            (t.createIndex('collectionPathOverlayIndex', Ca, { unique: !1 }),
              t.createIndex('collectionGroupOverlayIndex', Aa, { unique: !1 }));
          })(e);
        })),
      n < 13 &&
        r >= 13 &&
        (s = s
          .next(() =>
            (function (e) {
              const t = e.createObjectStore('remoteDocumentsV14', { keyPath: pa });
              (t.createIndex('documentKeyIndex', ga), t.createIndex('collectionGroupIndex', ma));
            })(e)
          )
          .next(() => this.ii(e, i))
          .next(() => e.deleteObjectStore('remoteDocuments'))),
      n < 14 && r >= 14 && (s = s.next(() => this.si(e, i))),
      n < 15 &&
        r >= 15 &&
        (s = s.next(() =>
          (function (e) {
            (e
              .createObjectStore('indexConfiguration', { keyPath: 'indexId', autoIncrement: !0 })
              .createIndex('collectionGroupIndex', 'collectionGroup', { unique: !1 }),
              e
                .createObjectStore('indexState', { keyPath: Ia })
                .createIndex('sequenceNumberIndex', Ta, { unique: !1 }),
              e
                .createObjectStore('indexEntries', { keyPath: _a })
                .createIndex('documentKeyIndex', Ea, { unique: !1 }));
          })(e)
        )),
      n < 16 &&
        r >= 16 &&
        (s = s
          .next(() => {
            t.objectStore('indexState').clear();
          })
          .next(() => {
            t.objectStore('indexEntries').clear();
          })),
      s
    );
  }
  ei(e) {
    let t = 0;
    return e
      .store('remoteDocuments')
      .Y((e, n) => {
        t += od(n);
      })
      .next(() => {
        const n = { byteSize: t };
        return e.store('remoteDocumentGlobal').put('remoteDocumentGlobalKey', n);
      });
  }
  Xr(e) {
    const t = e.store('mutationQueues'),
      n = e.store('mutations');
    return t.W().next(t =>
      $o.forEach(t, t => {
        const r = IDBKeyRange.bound([t.userId, -1], [t.userId, t.lastAcknowledgedBatchId]);
        return n.W('userMutationsIndex', r).next(n =>
          $o.forEach(n, n => {
            uo(n.userId === t.userId);
            const r = mh(this.serializer, n);
            return sd(e, t.userId, r).next(() => {});
          })
        );
      })
    );
  }
  ti(e) {
    const t = e.store('targetDocuments'),
      n = e.store('remoteDocuments');
    return e
      .store('targetGlobal')
      .get('targetGlobalKey')
      .next(e => {
        const r = [];
        return n
          .Y((n, i) => {
            const s = new xo(n),
              o = (function (e) {
                return [0, oa(e)];
              })(s);
            r.push(
              t.get(o).next(n =>
                n
                  ? $o.resolve()
                  : (n =>
                      t.put({
                        targetId: 0,
                        path: oa(n),
                        sequenceNumber: e.highestListenSequenceNumber,
                      }))(s)
              )
            );
          })
          .next(() => $o.waitFor(r));
      });
  }
  ni(e, t) {
    e.createObjectStore('collectionParents', { keyPath: ba });
    const n = t.store('collectionParents'),
      r = new Qh(),
      i = e => {
        if (r.add(e)) {
          const t = e.lastSegment(),
            r = e.popLast();
          return n.put({ collectionId: t, parent: oa(r) });
        }
      };
    return t
      .store('remoteDocuments')
      .Y({ J: !0 }, (e, t) => {
        const n = new xo(e);
        return i(n.popLast());
      })
      .next(() =>
        t.store('documentMutations').Y({ J: !0 }, ([e, t, n], r) => {
          const s = ua(t);
          return i(s.popLast());
        })
      );
  }
  ri(e) {
    const t = e.store('targets');
    return t.Y((e, n) => {
      const r = yh(n),
        i = wh(this.serializer, r);
      return t.put(i);
    });
  }
  ii(e, t) {
    const n = t.store('remoteDocuments'),
      r = [];
    return n
      .Y((e, n) => {
        const i = t.store('remoteDocumentsV14'),
          s = (function (e) {
            return e.document
              ? new Ro(xo.fromString(e.document.name).popFirst(5))
              : e.noDocument
                ? Ro.fromSegments(e.noDocument.path)
                : e.unknownDocument
                  ? Ro.fromSegments(e.unknownDocument.path)
                  : co();
          })(n).path.toArray(),
          o = {
            prefixPath: s.slice(0, s.length - 2),
            collectionGroup: s[s.length - 2],
            documentId: s[s.length - 1],
            readTime: n.readTime || [0, 0],
            unknownDocument: n.unknownDocument,
            noDocument: n.noDocument,
            document: n.document,
            hasCommittedMutations: !!n.hasCommittedMutations,
          };
        r.push(i.put(o));
      })
      .next(() => $o.waitFor(r));
  }
  si(e, t) {
    const n = t.store('mutations'),
      r = Sd(this.serializer),
      i = new zd(Gd.Hr, this.serializer.ct);
    return n.W().next(e => {
      const n = new Map();
      return (
        e.forEach(e => {
          var t;
          let r = null !== (t = n.get(e.userId)) && void 0 !== t ? t : xu();
          (mh(this.serializer, e)
            .keys()
            .forEach(e => (r = r.add(e))),
            n.set(e.userId, r));
        }),
        $o.forEach(n, (e, n) => {
          const s = new eo(n),
            o = Ch.lt(this.serializer, s),
            a = i.getIndexManager(s),
            c = ad.lt(s, this.serializer, a, i.referenceDelegate);
          return new Rd(r, c, o, a)
            .recalculateAndSaveOverlaysForDocumentKeys(new Pa(t, ra._e), e)
            .next();
        })
      );
    });
  }
}
function Kd(e) {
  (e
    .createObjectStore('targetDocuments', { keyPath: wa })
    .createIndex('documentTargetsIndex', va, { unique: !0 }),
    e
      .createObjectStore('targets', { keyPath: 'targetId' })
      .createIndex('queryTargetsIndex', ya, { unique: !0 }),
    e.createObjectStore('targetGlobal'));
}
const Wd =
  'Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.';
class Hd {
  constructor(e, t, n, r, i, s, o, a, c, u, l = 16) {
    if (
      ((this.allowTabSynchronization = e),
      (this.persistenceKey = t),
      (this.clientId = n),
      (this.oi = i),
      (this.window = s),
      (this.document = o),
      (this._i = c),
      (this.ai = u),
      (this.ui = l),
      (this.kr = null),
      (this.qr = !1),
      (this.isPrimary = !1),
      (this.networkEnabled = !0),
      (this.ci = null),
      (this.inForeground = !1),
      (this.li = null),
      (this.hi = null),
      (this.Pi = Number.NEGATIVE_INFINITY),
      (this.Ii = e => Promise.resolve()),
      !Hd.D())
    )
      throw new fo(
        ho.UNIMPLEMENTED,
        'This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.'
      );
    ((this.referenceDelegate = new Id(this, r)),
      (this.Ti = t + 'main'),
      (this.serializer = new hh(a)),
      (this.Ei = new Wo(this.Ti, this.ui, new $d(this.serializer))),
      (this.Qr = new fd(this.referenceDelegate, this.serializer)),
      (this.remoteDocumentCache = Sd(this.serializer)),
      (this.$r = new _h()),
      this.window && this.window.localStorage
        ? (this.di = this.window.localStorage)
        : ((this.di = null),
          !1 === u &&
            so(
              'IndexedDbPersistence',
              'LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page.'
            )));
  }
  start() {
    return this.Ai()
      .then(() => {
        if (!this.isPrimary && !this.allowTabSynchronization)
          throw new fo(ho.FAILED_PRECONDITION, Wd);
        return (
          this.Ri(),
          this.Vi(),
          this.mi(),
          this.runTransaction('getHighestListenSequenceNumber', 'readonly', e =>
            this.Qr.getHighestSequenceNumber(e)
          )
        );
      })
      .then(e => {
        this.kr = new ra(e, this._i);
      })
      .then(() => {
        this.qr = !0;
      })
      .catch(e => (this.Ei && this.Ei.close(), Promise.reject(e)));
  }
  fi(e) {
    return (
      (this.Ii = async t => {
        if (this.started) return e(t);
      }),
      e(this.isPrimary)
    );
  }
  setDatabaseDeletedListener(e) {
    this.Ei.B(async t => {
      null === t.newVersion && (await e());
    });
  }
  setNetworkEnabled(e) {
    this.networkEnabled !== e &&
      ((this.networkEnabled = e),
      this.oi.enqueueAndForget(async () => {
        this.started && (await this.Ai());
      }));
  }
  Ai() {
    return this.runTransaction('updateClientMetadataAndTryBecomePrimary', 'readwrite', e =>
      Yd(e)
        .put({
          clientId: this.clientId,
          updateTimeMs: Date.now(),
          networkEnabled: this.networkEnabled,
          inForeground: this.inForeground,
        })
        .next(() => {
          if (this.isPrimary)
            return this.gi(e).next(e => {
              e || ((this.isPrimary = !1), this.oi.enqueueRetryable(() => this.Ii(!1)));
            });
        })
        .next(() => this.pi(e))
        .next(t =>
          this.isPrimary && !t ? this.yi(e).next(() => !1) : !!t && this.wi(e).next(() => !0)
        )
    )
      .catch(e => {
        if (Yo(e))
          return (io('IndexedDbPersistence', 'Failed to extend owner lease: ', e), this.isPrimary);
        if (!this.allowTabSynchronization) throw e;
        return (
          io('IndexedDbPersistence', 'Releasing owner lease after error during lease refresh', e),
          !1
        );
      })
      .then(e => {
        (this.isPrimary !== e && this.oi.enqueueRetryable(() => this.Ii(e)), (this.isPrimary = e));
      });
  }
  gi(e) {
    return Qd(e)
      .get('owner')
      .next(e => $o.resolve(this.Si(e)));
  }
  bi(e) {
    return Yd(e).delete(this.clientId);
  }
  async Di() {
    if (this.isPrimary && !this.Ci(this.Pi, 18e5)) {
      this.Pi = Date.now();
      const e = await this.runTransaction(
        'maybeGarbageCollectMultiClientState',
        'readwrite-primary',
        e => {
          const t = Ma(e, 'clientMetadata');
          return t.W().next(e => {
            const n = this.vi(e, 18e5),
              r = e.filter(e => -1 === n.indexOf(e));
            return $o.forEach(r, e => t.delete(e.clientId)).next(() => r);
          });
        }
      ).catch(() => []);
      if (this.di) for (const t of e) this.di.removeItem(this.Fi(t.clientId));
    }
  }
  mi() {
    this.hi = this.oi.enqueueAfterDelay('client_metadata_refresh', 4e3, () =>
      this.Ai()
        .then(() => this.Di())
        .then(() => this.mi())
    );
  }
  Si(e) {
    return !!e && e.ownerId === this.clientId;
  }
  pi(e) {
    return this.ai
      ? $o.resolve(!0)
      : Qd(e)
          .get('owner')
          .next(t => {
            if (null !== t && this.Ci(t.leaseTimestampMs, 5e3) && !this.Mi(t.ownerId)) {
              if (this.Si(t) && this.networkEnabled) return !0;
              if (!this.Si(t)) {
                if (!t.allowTabSynchronization) throw new fo(ho.FAILED_PRECONDITION, Wd);
                return !1;
              }
            }
            return (
              !(!this.networkEnabled || !this.inForeground) ||
              Yd(e)
                .W()
                .next(
                  e =>
                    void 0 ===
                    this.vi(e, 5e3).find(e => {
                      if (this.clientId !== e.clientId) {
                        const t = !this.networkEnabled && e.networkEnabled,
                          n = !this.inForeground && e.inForeground,
                          r = this.networkEnabled === e.networkEnabled;
                        if (t || (n && r)) return !0;
                      }
                      return !1;
                    })
                )
            );
          })
          .next(
            e => (
              this.isPrimary !== e &&
                io(
                  'IndexedDbPersistence',
                  `Client ${e ? 'is' : 'is not'} eligible for a primary lease.`
                ),
              e
            )
          );
  }
  async shutdown() {
    ((this.qr = !1),
      this.xi(),
      this.hi && (this.hi.cancel(), (this.hi = null)),
      this.Oi(),
      this.Ni(),
      await this.Ei.runTransaction('shutdown', 'readwrite', ['owner', 'clientMetadata'], e => {
        const t = new Pa(e, ra._e);
        return this.yi(t).next(() => this.bi(t));
      }),
      this.Ei.close(),
      this.Li());
  }
  vi(e, t) {
    return e.filter(e => this.Ci(e.updateTimeMs, t) && !this.Mi(e.clientId));
  }
  Bi() {
    return this.runTransaction('getActiveClients', 'readonly', e =>
      Yd(e)
        .W()
        .next(e => this.vi(e, 18e5).map(e => e.clientId))
    );
  }
  get started() {
    return this.qr;
  }
  getMutationQueue(e, t) {
    return ad.lt(e, this.serializer, t, this.referenceDelegate);
  }
  getTargetCache() {
    return this.Qr;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getIndexManager(e) {
    return new Xh(e, this.serializer.ct.databaseId);
  }
  getDocumentOverlayCache(e) {
    return Ch.lt(this.serializer, e);
  }
  getBundleCache() {
    return this.$r;
  }
  runTransaction(e, t, n) {
    io('IndexedDbPersistence', 'Starting transaction:', e);
    const r = 'readonly' === t ? 'readonly' : 'readwrite',
      i = (function (e) {
        return 16 === e
          ? Ra
          : 15 === e
            ? Oa
            : 14 === e
              ? Na
              : 13 === e
                ? xa
                : 12 === e
                  ? Da
                  : 11 === e
                    ? ka
                    : void co();
      })(this.ui);
    let s;
    return this.Ei.runTransaction(
      e,
      r,
      i,
      r => (
        (s = new Pa(r, this.kr ? this.kr.next() : ra._e)),
        'readwrite-primary' === t
          ? this.gi(s)
              .next(e => !!e || this.pi(s))
              .next(t => {
                if (!t)
                  throw (
                    so(`Failed to obtain primary lease for action '${e}'.`),
                    (this.isPrimary = !1),
                    this.oi.enqueueRetryable(() => this.Ii(!1)),
                    new fo(ho.FAILED_PRECONDITION, zo)
                  );
                return n(s);
              })
              .next(e => this.wi(s).next(() => e))
          : this.ki(s).next(() => n(s))
      )
    ).then(e => (s.raiseOnCommittedEvent(), e));
  }
  ki(e) {
    return Qd(e)
      .get('owner')
      .next(e => {
        if (
          null !== e &&
          this.Ci(e.leaseTimestampMs, 5e3) &&
          !this.Mi(e.ownerId) &&
          !this.Si(e) &&
          !(this.ai || (this.allowTabSynchronization && e.allowTabSynchronization))
        )
          throw new fo(ho.FAILED_PRECONDITION, Wd);
      });
  }
  wi(e) {
    const t = {
      ownerId: this.clientId,
      allowTabSynchronization: this.allowTabSynchronization,
      leaseTimestampMs: Date.now(),
    };
    return Qd(e).put('owner', t);
  }
  static D() {
    return Wo.D();
  }
  yi(e) {
    const t = Qd(e);
    return t
      .get('owner')
      .next(e =>
        this.Si(e)
          ? (io('IndexedDbPersistence', 'Releasing primary lease.'), t.delete('owner'))
          : $o.resolve()
      );
  }
  Ci(e, t) {
    const n = Date.now();
    return !(
      e < n - t ||
      (e > n && (so(`Detected an update time that is in the future: ${e} > ${n}`), 1))
    );
  }
  Ri() {
    null !== this.document &&
      'function' == typeof this.document.addEventListener &&
      ((this.li = () => {
        this.oi.enqueueAndForget(
          () => ((this.inForeground = 'visible' === this.document.visibilityState), this.Ai())
        );
      }),
      this.document.addEventListener('visibilitychange', this.li),
      (this.inForeground = 'visible' === this.document.visibilityState));
  }
  Oi() {
    this.li && (this.document.removeEventListener('visibilitychange', this.li), (this.li = null));
  }
  Vi() {
    var e;
    'function' ==
      typeof (null === (e = this.window) || void 0 === e ? void 0 : e.addEventListener) &&
      ((this.ci = () => {
        this.xi();
        const e = /(?:Version|Mobile)\/1[456]/;
        (ye() &&
          (navigator.appVersion.match(e) || navigator.userAgent.match(e)) &&
          this.oi.enterRestrictedMode(!0),
          this.oi.enqueueAndForget(() => this.shutdown()));
      }),
      this.window.addEventListener('pagehide', this.ci));
  }
  Ni() {
    this.ci && (this.window.removeEventListener('pagehide', this.ci), (this.ci = null));
  }
  Mi(e) {
    var t;
    try {
      const n = null !== (null === (t = this.di) || void 0 === t ? void 0 : t.getItem(this.Fi(e)));
      return (
        io('IndexedDbPersistence', `Client '${e}' ${n ? 'is' : 'is not'} zombied in LocalStorage`),
        n
      );
    } catch (e) {
      return (so('IndexedDbPersistence', 'Failed to get zombied client id.', e), !1);
    }
  }
  xi() {
    if (this.di)
      try {
        this.di.setItem(this.Fi(this.clientId), String(Date.now()));
      } catch (e) {
        so('Failed to set zombie client id.', e);
      }
  }
  Li() {
    if (this.di)
      try {
        this.di.removeItem(this.Fi(this.clientId));
      } catch (e) {}
  }
  Fi(e) {
    return `firestore_zombie_${this.persistenceKey}_${e}`;
  }
}
function Qd(e) {
  return Ma(e, 'owner');
}
function Yd(e) {
  return Ma(e, 'clientMetadata');
}
function Xd(e, t) {
  let n = e.projectId;
  return (e.isDefaultDatabase || (n += '.' + e.database), 'firestore/' + t + '/' + n + '/');
}
class Jd {
  constructor(e, t, n, r) {
    ((this.targetId = e), (this.fromCache = t), (this.qi = n), (this.Qi = r));
  }
  static Ki(e, t) {
    let n = xu(),
      r = xu();
    for (const e of t.docChanges)
      switch (e.type) {
        case 0:
          n = n.add(e.doc.key);
          break;
        case 1:
          r = r.add(e.doc.key);
      }
    return new Jd(e, t.fromCache, n, r);
  }
}
class Zd {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
}
class ef {
  constructor() {
    ((this.$i = !1),
      (this.Ui = !1),
      (this.Wi = 100),
      (this.Gi = ye() ? 8 : Wo.v(me()) > 0 ? 6 : 4));
  }
  initialize(e, t) {
    ((this.zi = e), (this.indexManager = t), (this.$i = !0));
  }
  getDocumentsMatchingQuery(e, t, n, r) {
    const i = { result: null };
    return this.ji(e, t)
      .next(e => {
        i.result = e;
      })
      .next(() => {
        if (!i.result)
          return this.Hi(e, t, r, n).next(e => {
            i.result = e;
          });
      })
      .next(() => {
        if (i.result) return;
        const n = new Zd();
        return this.Ji(e, t, n).next(r => {
          if (((i.result = r), this.Ui)) return this.Yi(e, t, n, r.size);
        });
      })
      .next(() => i.result);
  }
  Yi(e, t, n, r) {
    return n.documentReadCount < this.Wi
      ? (ro() <= Pe.DEBUG &&
          io(
            'QueryEngine',
            'SDK will not create cache indexes for query:',
            gu(t),
            'since it only creates cache indexes for collection contains',
            'more than or equal to',
            this.Wi,
            'documents'
          ),
        $o.resolve())
      : (ro() <= Pe.DEBUG &&
          io(
            'QueryEngine',
            'Query:',
            gu(t),
            'scans',
            n.documentReadCount,
            'local documents and returns',
            r,
            'documents as results.'
          ),
        n.documentReadCount > this.Gi * r
          ? (ro() <= Pe.DEBUG &&
              io(
                'QueryEngine',
                'The SDK decides to create cache indexes for query:',
                gu(t),
                'as using cache indexes may help improve performance.'
              ),
            this.indexManager.createTargetIndexes(e, lu(t)))
          : $o.resolve());
  }
  ji(e, t) {
    if (au(t)) return $o.resolve(null);
    let n = lu(t);
    return this.indexManager.getIndexType(e, n).next(r =>
      0 === r
        ? null
        : (null !== t.limit && 1 === r && ((t = du(t, null, 'F')), (n = lu(t))),
          this.indexManager.getDocumentsMatchingTarget(e, n).next(r => {
            const i = xu(...r);
            return this.zi.getDocuments(e, i).next(r =>
              this.indexManager.getMinOffset(e, n).next(n => {
                const s = this.Zi(t, r);
                return this.Xi(t, s, i, n.readTime)
                  ? this.ji(e, du(t, null, 'F'))
                  : this.es(e, s, t, n);
              })
            );
          }))
    );
  }
  Hi(e, t, n, r) {
    return au(t) || r.isEqual(ko.min())
      ? $o.resolve(null)
      : this.zi.getDocuments(e, n).next(i => {
          const s = this.Zi(t, i);
          return this.Xi(t, s, n, r)
            ? $o.resolve(null)
            : (ro() <= Pe.DEBUG &&
                io(
                  'QueryEngine',
                  'Re-using previous result from %s to execute query: %s',
                  r.toString(),
                  gu(t)
                ),
              this.es(
                e,
                s,
                t,
                (function (e, t) {
                  const n = e.toTimestamp().seconds,
                    r = e.toTimestamp().nanoseconds + 1,
                    i = ko.fromTimestamp(1e9 === r ? new Ao(n + 1, 0) : new Ao(n, r));
                  return new Bo(i, Ro.empty(), t);
                })(r, -1)
              ).next(e => e));
        });
  }
  Zi(e, t) {
    let n = new za(yu(e));
    return (
      t.forEach((t, r) => {
        mu(e, r) && (n = n.add(r));
      }),
      n
    );
  }
  Xi(e, t, n, r) {
    if (null === e.limit) return !1;
    if (n.size !== t.size) return !0;
    const i = 'F' === e.limitType ? t.last() : t.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
  }
  Ji(e, t, n) {
    return (
      ro() <= Pe.DEBUG && io('QueryEngine', 'Using full collection scan to execute query:', gu(t)),
      this.zi.getDocumentsMatchingQuery(e, t, Bo.min(), n)
    );
  }
  es(e, t, n, r) {
    return this.zi.getDocumentsMatchingQuery(e, n, r).next(
      e => (
        t.forEach(t => {
          e = e.insert(t.key, t);
        }),
        e
      )
    );
  }
}
class tf {
  constructor(e, t, n, r) {
    ((this.persistence = e),
      (this.ts = t),
      (this.serializer = r),
      (this.ns = new Va(Eo)),
      (this.rs = new vu(e => Zc(e), eu)),
      (this.ss = new Map()),
      (this.os = e.getRemoteDocumentCache()),
      (this.Qr = e.getTargetCache()),
      (this.$r = e.getBundleCache()),
      this._s(n));
  }
  _s(e) {
    ((this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e)),
      (this.indexManager = this.persistence.getIndexManager(e)),
      (this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager)),
      (this.localDocuments = new Rd(
        this.os,
        this.mutationQueue,
        this.documentOverlayCache,
        this.indexManager
      )),
      this.os.setIndexManager(this.indexManager),
      this.ts.initialize(this.localDocuments, this.indexManager));
  }
  collectGarbage(e) {
    return this.persistence.runTransaction('Collect garbage', 'readwrite-primary', t =>
      e.collect(t, this.ns)
    );
  }
}
function nf(e, t, n, r) {
  return new tf(e, t, n, r);
}
async function rf(e, t) {
  const n = lo(e);
  return await n.persistence.runTransaction('Handle user change', 'readonly', e => {
    let r;
    return n.mutationQueue
      .getAllMutationBatches(e)
      .next(i => ((r = i), n._s(t), n.mutationQueue.getAllMutationBatches(e)))
      .next(t => {
        const i = [],
          s = [];
        let o = xu();
        for (const e of r) {
          i.push(e.batchId);
          for (const t of e.mutations) o = o.add(t.key);
        }
        for (const e of t) {
          s.push(e.batchId);
          for (const t of e.mutations) o = o.add(t.key);
        }
        return n.localDocuments
          .getDocuments(e, o)
          .next(e => ({ us: e, removedBatchIds: i, addedBatchIds: s }));
      });
  });
}
function sf(e) {
  const t = lo(e);
  return t.persistence.runTransaction('Get last remote snapshot version', 'readonly', e =>
    t.Qr.getLastRemoteSnapshotVersion(e)
  );
}
function of(e, t) {
  const n = lo(e);
  return n.persistence.runTransaction(
    'Get next mutation batch',
    'readonly',
    e => (void 0 === t && (t = -1), n.mutationQueue.getNextMutationBatchAfterBatchId(e, t))
  );
}
async function af(e, t, n) {
  const r = lo(e),
    i = r.ns.get(t),
    s = n ? 'readwrite' : 'readwrite-primary';
  try {
    n ||
      (await r.persistence.runTransaction('Release target', s, e =>
        r.persistence.referenceDelegate.removeTarget(e, i)
      ));
  } catch (e) {
    if (!Yo(e)) throw e;
    io('LocalStore', `Failed to update sequence numbers for target ${t}: ${e}`);
  }
  ((r.ns = r.ns.remove(t)), r.rs.delete(i.target));
}
function cf(e, t, n) {
  const r = lo(e);
  let i = ko.min(),
    s = xu();
  return r.persistence.runTransaction('Execute query', 'readwrite', e =>
    (function (e, t, n) {
      const r = lo(e),
        i = r.rs.get(n);
      return void 0 !== i ? $o.resolve(r.ns.get(i)) : r.Qr.getTargetData(t, n);
    })(r, e, lu(t))
      .next(t => {
        if (t)
          return (
            (i = t.lastLimboFreeSnapshotVersion),
            r.Qr.getMatchingKeysForTargetId(e, t.targetId).next(e => {
              s = e;
            })
          );
      })
      .next(() => r.ts.getDocumentsMatchingQuery(e, t, n ? i : ko.min(), n ? s : xu()))
      .next(
        e => (
          (function (e, t, n) {
            let r = e.ss.get(t) || ko.min();
            (n.forEach((e, t) => {
              t.readTime.compareTo(r) > 0 && (r = t.readTime);
            }),
              e.ss.set(t, r));
          })(
            r,
            (function (e) {
              return (
                e.collectionGroup ||
                (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2))
              );
            })(t),
            e
          ),
          { documents: e, hs: s }
        )
      )
  );
}
class uf {
  constructor() {
    this.activeTargetIds = Nu;
  }
  As(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  Rs(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  ds() {
    const e = { activeTargetIds: this.activeTargetIds.toArray(), updateTimeMs: Date.now() };
    return JSON.stringify(e);
  }
}
class lf {
  constructor() {
    ((this.no = new uf()),
      (this.ro = {}),
      (this.onlineStateHandler = null),
      (this.sequenceNumberHandler = null));
  }
  addPendingMutation(e) {}
  updateMutationState(e, t, n) {}
  addLocalQueryTarget(e) {
    return (this.no.As(e), this.ro[e] || 'not-current');
  }
  updateQueryState(e, t, n) {
    this.ro[e] = t;
  }
  removeLocalQueryTarget(e) {
    this.no.Rs(e);
  }
  isLocalQueryTarget(e) {
    return this.no.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.ro[e];
  }
  getAllActiveQueryTargets() {
    return this.no.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.no.activeTargetIds.has(e);
  }
  start() {
    return ((this.no = new uf()), Promise.resolve());
  }
  handleUserChange(e, t, n) {}
  setOnlineState(e) {}
  shutdown() {}
  writeSequenceNumber(e) {}
  notifyBundleLoaded(e) {}
}
class hf {
  io(e) {}
  shutdown() {}
}
class df {
  constructor() {
    ((this.so = () => this.oo()), (this._o = () => this.ao()), (this.uo = []), this.co());
  }
  io(e) {
    this.uo.push(e);
  }
  shutdown() {
    (window.removeEventListener('online', this.so), window.removeEventListener('offline', this._o));
  }
  co() {
    (window.addEventListener('online', this.so), window.addEventListener('offline', this._o));
  }
  oo() {
    io('ConnectivityMonitor', 'Network connectivity changed: AVAILABLE');
    for (const e of this.uo) e(0);
  }
  ao() {
    io('ConnectivityMonitor', 'Network connectivity changed: UNAVAILABLE');
    for (const e of this.uo) e(1);
  }
  static D() {
    return (
      'undefined' != typeof window &&
      void 0 !== window.addEventListener &&
      void 0 !== window.removeEventListener
    );
  }
}
let ff = null;
function pf() {
  return (
    null === ff ? (ff = 268435456 + Math.round(2147483648 * Math.random())) : ff++,
    '0x' + ff.toString(16)
  );
}
const gf = {
  BatchGetDocuments: 'batchGet',
  Commit: 'commit',
  RunQuery: 'runQuery',
  RunAggregationQuery: 'runAggregationQuery',
};
class mf {
  constructor(e) {
    ((this.lo = e.lo), (this.ho = e.ho));
  }
  Po(e) {
    this.Io = e;
  }
  To(e) {
    this.Eo = e;
  }
  onMessage(e) {
    this.Ao = e;
  }
  close() {
    this.ho();
  }
  send(e) {
    this.lo(e);
  }
  Ro() {
    this.Io();
  }
  Vo(e) {
    this.Eo(e);
  }
  mo(e) {
    this.Ao(e);
  }
}
const yf = 'WebChannelConnection';
class wf extends class {
  constructor(e) {
    ((this.databaseInfo = e), (this.databaseId = e.databaseId));
    const t = e.ssl ? 'https' : 'http',
      n = encodeURIComponent(this.databaseId.projectId),
      r = encodeURIComponent(this.databaseId.database);
    ((this.fo = t + '://' + e.host),
      (this.po = `projects/${n}/databases/${r}`),
      (this.yo =
        '(default)' === this.databaseId.database
          ? `project_id=${n}`
          : `project_id=${n}&database_id=${r}`));
  }
  get wo() {
    return !1;
  }
  So(e, t, n, r, i) {
    const s = pf(),
      o = this.bo(e, t.toUriEncodedString());
    io('RestConnection', `Sending RPC '${e}' ${s}:`, o, n);
    const a = { 'google-cloud-resource-prefix': this.po, 'x-goog-request-params': this.yo };
    return (
      this.Do(a, r, i),
      this.Co(e, o, a, n).then(
        t => (io('RestConnection', `Received RPC '${e}' ${s}: `, t), t),
        t => {
          throw (
            oo(
              'RestConnection',
              `RPC '${e}' ${s} failed with error: `,
              t,
              'url: ',
              o,
              'request:',
              n
            ),
            t
          );
        }
      )
    );
  }
  vo(e, t, n, r, i, s) {
    return this.So(e, t, n, r, i);
  }
  Do(e, t, n) {
    ((e['X-Goog-Api-Client'] = 'gl-js/ fire/' + to),
      (e['Content-Type'] = 'text/plain'),
      this.databaseInfo.appId && (e['X-Firebase-GMPID'] = this.databaseInfo.appId),
      t && t.headers.forEach((t, n) => (e[n] = t)),
      n && n.headers.forEach((t, n) => (e[n] = t)));
  }
  bo(e, t) {
    const n = gf[e];
    return `${this.fo}/v1/${t}:${n}`;
  }
  terminate() {}
} {
  constructor(e) {
    (super(e),
      (this.forceLongPolling = e.forceLongPolling),
      (this.autoDetectLongPolling = e.autoDetectLongPolling),
      (this.useFetchStreams = e.useFetchStreams),
      (this.longPollingOptions = e.longPollingOptions));
  }
  Co(e, t, n, r) {
    const i = pf();
    return new Promise((s, o) => {
      const a = new Xs();
      (a.setWithCredentials(!0),
        a.listenOnce(Ws.COMPLETE, () => {
          try {
            switch (a.getLastErrorCode()) {
              case Ks.NO_ERROR:
                const t = a.getResponseJson();
                (io(yf, `XHR for RPC '${e}' ${i} received:`, JSON.stringify(t)), s(t));
                break;
              case Ks.TIMEOUT:
                (io(yf, `RPC '${e}' ${i} timed out`),
                  o(new fo(ho.DEADLINE_EXCEEDED, 'Request time out')));
                break;
              case Ks.HTTP_ERROR:
                const n = a.getStatus();
                if (
                  (io(
                    yf,
                    `RPC '${e}' ${i} failed with status:`,
                    n,
                    'response text:',
                    a.getResponseText()
                  ),
                  n > 0)
                ) {
                  let e = a.getResponseJson();
                  Array.isArray(e) && (e = e[0]);
                  const t = null == e ? void 0 : e.error;
                  if (t && t.status && t.message) {
                    const e = (function (e) {
                      const t = e.toLowerCase().replace(/_/g, '-');
                      return Object.values(ho).indexOf(t) >= 0 ? t : ho.UNKNOWN;
                    })(t.status);
                    o(new fo(e, t.message));
                  } else o(new fo(ho.UNKNOWN, 'Server responded with status ' + a.getStatus()));
                } else o(new fo(ho.UNAVAILABLE, 'Connection failed.'));
                break;
              default:
                co();
            }
          } finally {
            io(yf, `RPC '${e}' ${i} completed.`);
          }
        }));
      const c = JSON.stringify(r);
      (io(yf, `RPC '${e}' ${i} sending request:`, r), a.send(t, 'POST', c, n, 15));
    });
  }
  Fo(e, t, n) {
    const r = pf(),
      i = [this.fo, '/', 'google.firestore.v1.Firestore', '/', e, '/channel'],
      s = Gs(),
      o = $s(),
      a = {
        httpSessionIdParam: 'gsessionid',
        initMessageHeaders: {},
        messageUrlParams: {
          database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`,
        },
        sendRawJson: !0,
        supportsCrossDomainXhr: !0,
        internalChannelParams: { forwardChannelRequestTimeoutMs: 6e5 },
        forceLongPolling: this.forceLongPolling,
        detectBufferingProxy: this.autoDetectLongPolling,
      },
      c = this.longPollingOptions.timeoutSeconds;
    (void 0 !== c && (a.longPollingTimeout = Math.round(1e3 * c)),
      this.useFetchStreams && (a.useFetchStreams = !0),
      this.Do(a.initMessageHeaders, t, n),
      (a.encodeInitMessageHeaders = !0));
    const u = i.join('');
    io(yf, `Creating RPC '${e}' stream ${r}: ${u}`, a);
    const l = s.createWebChannel(u, a);
    let h = !1,
      d = !1;
    const f = new mf({
        lo: t => {
          d
            ? io(yf, `Not sending because RPC '${e}' stream ${r} is closed:`, t)
            : (h || (io(yf, `Opening RPC '${e}' stream ${r} transport.`), l.open(), (h = !0)),
              io(yf, `RPC '${e}' stream ${r} sending:`, t),
              l.send(t));
        },
        ho: () => l.close(),
      }),
      p = (e, t, n) => {
        e.listen(t, e => {
          try {
            n(e);
          } catch (e) {
            setTimeout(() => {
              throw e;
            }, 0);
          }
        });
      };
    return (
      p(l, Ys.EventType.OPEN, () => {
        d || io(yf, `RPC '${e}' stream ${r} transport opened.`);
      }),
      p(l, Ys.EventType.CLOSE, () => {
        d || ((d = !0), io(yf, `RPC '${e}' stream ${r} transport closed`), f.Vo());
      }),
      p(l, Ys.EventType.ERROR, t => {
        d ||
          ((d = !0),
          oo(yf, `RPC '${e}' stream ${r} transport errored:`, t),
          f.Vo(new fo(ho.UNAVAILABLE, 'The operation could not be completed')));
      }),
      p(l, Ys.EventType.MESSAGE, t => {
        var n;
        if (!d) {
          const i = t.data[0];
          uo(!!i);
          const s = i,
            o = s.error || (null === (n = s[0]) || void 0 === n ? void 0 : n.error);
          if (o) {
            io(yf, `RPC '${e}' stream ${r} received error:`, o);
            const t = o.status;
            let n = (function (e) {
                const t = pl[e];
                if (void 0 !== t) return ml(t);
              })(t),
              i = o.message;
            (void 0 === n &&
              ((n = ho.INTERNAL),
              (i = 'Unknown error status: ' + t + ' with message ' + o.message)),
              (d = !0),
              f.Vo(new fo(n, i)),
              l.close());
          } else (io(yf, `RPC '${e}' stream ${r} received:`, i), f.mo(i));
        }
      }),
      p(o, Hs.STAT_EVENT, t => {
        t.stat === Qs.PROXY
          ? io(yf, `RPC '${e}' stream ${r} detected buffering proxy`)
          : t.stat === Qs.NOPROXY && io(yf, `RPC '${e}' stream ${r} detected no buffering proxy`);
      }),
      setTimeout(() => {
        f.Ro();
      }, 0),
      f
    );
  }
}
function vf() {
  return 'undefined' != typeof document ? document : null;
}
function bf(e) {
  return new Pl(e, !0);
}
class If {
  constructor(e, t, n = 1e3, r = 1.5, i = 6e4) {
    ((this.oi = e),
      (this.timerId = t),
      (this.Mo = n),
      (this.xo = r),
      (this.Oo = i),
      (this.No = 0),
      (this.Lo = null),
      (this.Bo = Date.now()),
      this.reset());
  }
  reset() {
    this.No = 0;
  }
  ko() {
    this.No = this.Oo;
  }
  qo(e) {
    this.cancel();
    const t = Math.floor(this.No + this.Qo()),
      n = Math.max(0, Date.now() - this.Bo),
      r = Math.max(0, t - n);
    (r > 0 &&
      io(
        'ExponentialBackoff',
        `Backing off for ${r} ms (base delay: ${this.No} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`
      ),
      (this.Lo = this.oi.enqueueAfterDelay(this.timerId, r, () => ((this.Bo = Date.now()), e()))),
      (this.No *= this.xo),
      this.No < this.Mo && (this.No = this.Mo),
      this.No > this.Oo && (this.No = this.Oo));
  }
  Ko() {
    null !== this.Lo && (this.Lo.skipDelay(), (this.Lo = null));
  }
  cancel() {
    null !== this.Lo && (this.Lo.cancel(), (this.Lo = null));
  }
  Qo() {
    return (Math.random() - 0.5) * this.No;
  }
}
class Tf {
  constructor(e, t, n, r, i, s, o, a) {
    ((this.oi = e),
      (this.$o = n),
      (this.Uo = r),
      (this.connection = i),
      (this.authCredentialsProvider = s),
      (this.appCheckCredentialsProvider = o),
      (this.listener = a),
      (this.state = 0),
      (this.Wo = 0),
      (this.Go = null),
      (this.zo = null),
      (this.stream = null),
      (this.jo = new If(e, t)));
  }
  Ho() {
    return 1 === this.state || 5 === this.state || this.Jo();
  }
  Jo() {
    return 2 === this.state || 3 === this.state;
  }
  start() {
    4 !== this.state ? this.auth() : this.Yo();
  }
  async stop() {
    this.Ho() && (await this.close(0));
  }
  Zo() {
    ((this.state = 0), this.jo.reset());
  }
  Xo() {
    this.Jo() &&
      null === this.Go &&
      (this.Go = this.oi.enqueueAfterDelay(this.$o, 6e4, () => this.e_()));
  }
  t_(e) {
    (this.n_(), this.stream.send(e));
  }
  async e_() {
    if (this.Jo()) return this.close(0);
  }
  n_() {
    this.Go && (this.Go.cancel(), (this.Go = null));
  }
  r_() {
    this.zo && (this.zo.cancel(), (this.zo = null));
  }
  async close(e, t) {
    (this.n_(),
      this.r_(),
      this.jo.cancel(),
      this.Wo++,
      4 !== e
        ? this.jo.reset()
        : t && t.code === ho.RESOURCE_EXHAUSTED
          ? (so(t.toString()),
            so('Using maximum backoff delay to prevent overloading the backend.'),
            this.jo.ko())
          : t &&
            t.code === ho.UNAUTHENTICATED &&
            3 !== this.state &&
            (this.authCredentialsProvider.invalidateToken(),
            this.appCheckCredentialsProvider.invalidateToken()),
      null !== this.stream && (this.i_(), this.stream.close(), (this.stream = null)),
      (this.state = e),
      await this.listener.To(t));
  }
  i_() {}
  auth() {
    this.state = 1;
    const e = this.s_(this.Wo),
      t = this.Wo;
    Promise.all([
      this.authCredentialsProvider.getToken(),
      this.appCheckCredentialsProvider.getToken(),
    ]).then(
      ([e, n]) => {
        this.Wo === t && this.o_(e, n);
      },
      t => {
        e(() => {
          const e = new fo(ho.UNKNOWN, 'Fetching auth token failed: ' + t.message);
          return this.__(e);
        });
      }
    );
  }
  o_(e, t) {
    const n = this.s_(this.Wo);
    ((this.stream = this.a_(e, t)),
      this.stream.Po(() => {
        n(
          () => (
            (this.state = 2),
            (this.zo = this.oi.enqueueAfterDelay(
              this.Uo,
              1e4,
              () => (this.Jo() && (this.state = 3), Promise.resolve())
            )),
            this.listener.Po()
          )
        );
      }),
      this.stream.To(e => {
        n(() => this.__(e));
      }),
      this.stream.onMessage(e => {
        n(() => this.onMessage(e));
      }));
  }
  Yo() {
    ((this.state = 5),
      this.jo.qo(async () => {
        ((this.state = 0), this.start());
      }));
  }
  __(e) {
    return (
      io('PersistentStream', `close with error: ${e}`),
      (this.stream = null),
      this.close(4, e)
    );
  }
  s_(e) {
    return t => {
      this.oi.enqueueAndForget(() =>
        this.Wo === e
          ? t()
          : (io('PersistentStream', 'stream callback skipped by getCloseGuardedDispatcher.'),
            Promise.resolve())
      );
    };
  }
}
class _f extends Tf {
  constructor(e, t, n, r, i, s) {
    (super(
      e,
      'listen_stream_connection_backoff',
      'listen_stream_idle',
      'health_check_timeout',
      t,
      n,
      r,
      s
    ),
      (this.serializer = i));
  }
  a_(e, t) {
    return this.connection.Fo('Listen', e, t);
  }
  onMessage(e) {
    this.jo.reset();
    const t = (function (e, t) {
        let n;
        if ('targetChange' in t) {
          t.targetChange;
          const r = (function (e) {
              return 'NO_CHANGE' === e
                ? 0
                : 'ADD' === e
                  ? 1
                  : 'REMOVE' === e
                    ? 2
                    : 'CURRENT' === e
                      ? 3
                      : 'RESET' === e
                        ? 4
                        : co();
            })(t.targetChange.targetChangeType || 'NO_CHANGE'),
            i = t.targetChange.targetIds || [],
            s = (function (e, t) {
              return e.useProto3Json
                ? (uo(void 0 === t || 'string' == typeof t), Wa.fromBase64String(t || ''))
                : (uo(void 0 === t || t instanceof Buffer || t instanceof Uint8Array),
                  Wa.fromUint8Array(t || new Uint8Array()));
            })(e, t.targetChange.resumeToken),
            o = t.targetChange.cause,
            a =
              o &&
              (function (e) {
                const t = void 0 === e.code ? ho.UNKNOWN : ml(e.code);
                return new fo(t, e.message || '');
              })(o);
          n = new Cl(r, i, s, a || null);
        } else if ('documentChange' in t) {
          t.documentChange;
          const r = t.documentChange;
          (r.document, r.document.name, r.document.updateTime);
          const i = Gl(e, r.document.name),
            s = Vl(r.document.updateTime),
            o = r.document.createTime ? Vl(r.document.createTime) : ko.min(),
            a = new Ec({ mapValue: { fields: r.document.fields } }),
            c = Cc.newFoundDocument(i, s, o, a),
            u = r.targetIds || [],
            l = r.removedTargetIds || [];
          n = new El(u, l, c.key, c);
        } else if ('documentDelete' in t) {
          t.documentDelete;
          const r = t.documentDelete;
          r.document;
          const i = Gl(e, r.document),
            s = r.readTime ? Vl(r.readTime) : ko.min(),
            o = Cc.newNoDocument(i, s),
            a = r.removedTargetIds || [];
          n = new El([], a, o.key, o);
        } else if ('documentRemove' in t) {
          t.documentRemove;
          const r = t.documentRemove;
          r.document;
          const i = Gl(e, r.document),
            s = r.removedTargetIds || [];
          n = new El([], s, i, null);
        } else {
          if (!('filter' in t)) return co();
          {
            t.filter;
            const e = t.filter;
            e.targetId;
            const { count: r = 0, unchangedNames: i } = e,
              s = new fl(r, i),
              o = e.targetId;
            n = new Sl(o, s);
          }
        }
        return n;
      })(this.serializer, e),
      n = (function (e) {
        if (!('targetChange' in e)) return ko.min();
        const t = e.targetChange;
        return t.targetIds && t.targetIds.length
          ? ko.min()
          : t.readTime
            ? Vl(t.readTime)
            : ko.min();
      })(e);
    return this.listener.u_(t, n);
  }
  c_(e) {
    const t = {};
    ((t.database = Wl(this.serializer)),
      (t.addTarget = (function (e, t) {
        let n;
        const r = t.target;
        if (
          ((n = tu(r) ? { documents: Jl(e, r) } : { query: Zl(e, r).ut }),
          (n.targetId = t.targetId),
          t.resumeToken.approximateByteSize() > 0)
        ) {
          n.resumeToken = Fl(e, t.resumeToken);
          const r = Ml(e, t.expectedCount);
          null !== r && (n.expectedCount = r);
        } else if (t.snapshotVersion.compareTo(ko.min()) > 0) {
          n.readTime = Ll(e, t.snapshotVersion.toTimestamp());
          const r = Ml(e, t.expectedCount);
          null !== r && (n.expectedCount = r);
        }
        return n;
      })(this.serializer, e)));
    const n = (function (e, t) {
      const n = (function (e) {
        switch (e) {
          case 'TargetPurposeListen':
            return null;
          case 'TargetPurposeExistenceFilterMismatch':
            return 'existence-filter-mismatch';
          case 'TargetPurposeExistenceFilterMismatchBloom':
            return 'existence-filter-mismatch-bloom';
          case 'TargetPurposeLimboResolution':
            return 'limbo-document';
          default:
            return co();
        }
      })(t.purpose);
      return null == n ? null : { 'goog-listen-tags': n };
    })(this.serializer, e);
    (n && (t.labels = n), this.t_(t));
  }
  l_(e) {
    const t = {};
    ((t.database = Wl(this.serializer)), (t.removeTarget = e), this.t_(t));
  }
}
class Ef extends Tf {
  constructor(e, t, n, r, i, s) {
    (super(
      e,
      'write_stream_connection_backoff',
      'write_stream_idle',
      'health_check_timeout',
      t,
      n,
      r,
      s
    ),
      (this.serializer = i),
      (this.h_ = !1));
  }
  get P_() {
    return this.h_;
  }
  start() {
    ((this.h_ = !1), (this.lastStreamToken = void 0), super.start());
  }
  i_() {
    this.h_ && this.I_([]);
  }
  a_(e, t) {
    return this.connection.Fo('Write', e, t);
  }
  onMessage(e) {
    if ((uo(!!e.streamToken), (this.lastStreamToken = e.streamToken), this.h_)) {
      this.jo.reset();
      const t = (function (e, t) {
          return e && e.length > 0
            ? (uo(void 0 !== t),
              e.map(e =>
                (function (e, t) {
                  let n = e.updateTime ? Vl(e.updateTime) : Vl(t);
                  return (n.isEqual(ko.min()) && (n = Vl(t)), new Hu(n, e.transformResults || []));
                })(e, t)
              ))
            : [];
        })(e.writeResults, e.commitTime),
        n = Vl(e.commitTime);
      return this.listener.T_(n, t);
    }
    return (uo(!e.writeResults || 0 === e.writeResults.length), (this.h_ = !0), this.listener.E_());
  }
  d_() {
    const e = {};
    ((e.database = Wl(this.serializer)), this.t_(e));
  }
  I_(e) {
    const t = { streamToken: this.lastStreamToken, writes: e.map(e => Yl(this.serializer, e)) };
    this.t_(t);
  }
}
class Sf extends class {} {
  constructor(e, t, n, r) {
    (super(),
      (this.authCredentials = e),
      (this.appCheckCredentials = t),
      (this.connection = n),
      (this.serializer = r),
      (this.A_ = !1));
  }
  R_() {
    if (this.A_) throw new fo(ho.FAILED_PRECONDITION, 'The client has already been terminated.');
  }
  So(e, t, n, r) {
    return (
      this.R_(),
      Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()])
        .then(([i, s]) => this.connection.So(e, jl(t, n), r, i, s))
        .catch(e => {
          throw 'FirebaseError' === e.name
            ? (e.code === ho.UNAUTHENTICATED &&
                (this.authCredentials.invalidateToken(),
                this.appCheckCredentials.invalidateToken()),
              e)
            : new fo(ho.UNKNOWN, e.toString());
        })
    );
  }
  vo(e, t, n, r, i) {
    return (
      this.R_(),
      Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()])
        .then(([s, o]) => this.connection.vo(e, jl(t, n), r, s, o, i))
        .catch(e => {
          throw 'FirebaseError' === e.name
            ? (e.code === ho.UNAUTHENTICATED &&
                (this.authCredentials.invalidateToken(),
                this.appCheckCredentials.invalidateToken()),
              e)
            : new fo(ho.UNKNOWN, e.toString());
        })
    );
  }
  terminate() {
    ((this.A_ = !0), this.connection.terminate());
  }
}
class Cf {
  constructor(e, t) {
    ((this.asyncQueue = e),
      (this.onlineStateHandler = t),
      (this.state = 'Unknown'),
      (this.m_ = 0),
      (this.f_ = null),
      (this.g_ = !0));
  }
  p_() {
    0 === this.m_ &&
      (this.y_('Unknown'),
      (this.f_ = this.asyncQueue.enqueueAfterDelay(
        'online_state_timeout',
        1e4,
        () => (
          (this.f_ = null),
          this.w_("Backend didn't respond within 10 seconds."),
          this.y_('Offline'),
          Promise.resolve()
        )
      )));
  }
  S_(e) {
    'Online' === this.state
      ? this.y_('Unknown')
      : (this.m_++,
        this.m_ >= 1 &&
          (this.b_(),
          this.w_(`Connection failed 1 times. Most recent error: ${e.toString()}`),
          this.y_('Offline')));
  }
  set(e) {
    (this.b_(), (this.m_ = 0), 'Online' === e && (this.g_ = !1), this.y_(e));
  }
  y_(e) {
    e !== this.state && ((this.state = e), this.onlineStateHandler(e));
  }
  w_(e) {
    const t = `Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.g_ ? (so(t), (this.g_ = !1)) : io('OnlineStateTracker', t);
  }
  b_() {
    null !== this.f_ && (this.f_.cancel(), (this.f_ = null));
  }
}
class Af {
  constructor(e, t, n, r, i) {
    ((this.localStore = e),
      (this.datastore = t),
      (this.asyncQueue = n),
      (this.remoteSyncer = {}),
      (this.D_ = []),
      (this.C_ = new Map()),
      (this.v_ = new Set()),
      (this.F_ = []),
      (this.M_ = i),
      this.M_.io(e => {
        n.enqueueAndForget(async () => {
          Lf(this) &&
            (io('RemoteStore', 'Restarting streams for network reachability change.'),
            await (async function (e) {
              const t = lo(e);
              (t.v_.add(4), await Df(t), t.x_.set('Unknown'), t.v_.delete(4), await kf(t));
            })(this));
        });
      }),
      (this.x_ = new Cf(n, r)));
  }
}
async function kf(e) {
  if (Lf(e)) for (const t of e.F_) await t(!0);
}
async function Df(e) {
  for (const t of e.F_) await t(!1);
}
function xf(e, t) {
  const n = lo(e);
  n.C_.has(t.targetId) || (n.C_.set(t.targetId, t), Mf(n) ? Pf(n) : Zf(n).Jo() && Of(n, t));
}
function Nf(e, t) {
  const n = lo(e),
    r = Zf(n);
  (n.C_.delete(t),
    r.Jo() && Rf(n, t),
    0 === n.C_.size && (r.Jo() ? r.Xo() : Lf(n) && n.x_.set('Unknown')));
}
function Of(e, t) {
  if (
    (e.O_.Oe(t.targetId),
    t.resumeToken.approximateByteSize() > 0 || t.snapshotVersion.compareTo(ko.min()) > 0)
  ) {
    const n = e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;
    t = t.withExpectedCount(n);
  }
  Zf(e).c_(t);
}
function Rf(e, t) {
  (e.O_.Oe(t), Zf(e).l_(t));
}
function Pf(e) {
  ((e.O_ = new kl({
    getRemoteKeysForTarget: t => e.remoteSyncer.getRemoteKeysForTarget(t),
    _t: t => e.C_.get(t) || null,
    nt: () => e.datastore.serializer.databaseId,
  })),
    Zf(e).start(),
    e.x_.p_());
}
function Mf(e) {
  return Lf(e) && !Zf(e).Ho() && e.C_.size > 0;
}
function Lf(e) {
  return 0 === lo(e).v_.size;
}
function Ff(e) {
  e.O_ = void 0;
}
async function Uf(e) {
  e.C_.forEach((t, n) => {
    Of(e, t);
  });
}
async function Vf(e, t) {
  (Ff(e), Mf(e) ? (e.x_.S_(t), Pf(e)) : e.x_.set('Unknown'));
}
async function Bf(e, t, n) {
  if ((e.x_.set('Online'), t instanceof Cl && 2 === t.state && t.cause))
    try {
      await (async function (e, t) {
        const n = t.cause;
        for (const r of t.targetIds)
          e.C_.has(r) &&
            (await e.remoteSyncer.rejectListen(r, n), e.C_.delete(r), e.O_.removeTarget(r));
      })(e, t);
    } catch (n) {
      (io('RemoteStore', 'Failed to remove targets %s: %s ', t.targetIds.join(','), n),
        await jf(e, n));
    }
  else if (
    (t instanceof El ? e.O_.$e(t) : t instanceof Sl ? e.O_.Je(t) : e.O_.Ge(t), !n.isEqual(ko.min()))
  )
    try {
      const t = await sf(e.localStore);
      n.compareTo(t) >= 0 &&
        (await (function (e, t) {
          const n = e.O_.it(t);
          return (
            n.targetChanges.forEach((n, r) => {
              if (n.resumeToken.approximateByteSize() > 0) {
                const i = e.C_.get(r);
                i && e.C_.set(r, i.withResumeToken(n.resumeToken, t));
              }
            }),
            n.targetMismatches.forEach((t, n) => {
              const r = e.C_.get(t);
              if (!r) return;
              (e.C_.set(t, r.withResumeToken(Wa.EMPTY_BYTE_STRING, r.snapshotVersion)), Rf(e, t));
              const i = new lh(r.target, t, n, r.sequenceNumber);
              Of(e, i);
            }),
            e.remoteSyncer.applyRemoteEvent(n)
          );
        })(e, n));
    } catch (t) {
      (io('RemoteStore', 'Failed to raise snapshot:', t), await jf(e, t));
    }
}
async function jf(e, t, n) {
  if (!Yo(t)) throw t;
  (e.v_.add(1),
    await Df(e),
    e.x_.set('Offline'),
    n || (n = () => sf(e.localStore)),
    e.asyncQueue.enqueueRetryable(async () => {
      (io('RemoteStore', 'Retrying IndexedDB access'), await n(), e.v_.delete(1), await kf(e));
    }));
}
function zf(e, t) {
  return t().catch(n => jf(e, n, t));
}
async function qf(e) {
  const t = lo(e),
    n = ep(t);
  let r = t.D_.length > 0 ? t.D_[t.D_.length - 1].batchId : -1;
  for (; Gf(t); )
    try {
      const e = await of(t.localStore, r);
      if (null === e) {
        0 === t.D_.length && n.Xo();
        break;
      }
      ((r = e.batchId), $f(t, e));
    } catch (e) {
      await jf(t, e);
    }
  Kf(t) && Wf(t);
}
function Gf(e) {
  return Lf(e) && e.D_.length < 10;
}
function $f(e, t) {
  e.D_.push(t);
  const n = ep(e);
  n.Jo() && n.P_ && n.I_(t.mutations);
}
function Kf(e) {
  return Lf(e) && !ep(e).Ho() && e.D_.length > 0;
}
function Wf(e) {
  ep(e).start();
}
async function Hf(e) {
  ep(e).d_();
}
async function Qf(e) {
  const t = ep(e);
  for (const n of e.D_) t.I_(n.mutations);
}
async function Yf(e, t, n) {
  const r = e.D_.shift(),
    i = hl.from(r, t, n);
  (await zf(e, () => e.remoteSyncer.applySuccessfulWrite(i)), await qf(e));
}
async function Xf(e, t) {
  (t &&
    ep(e).P_ &&
    (await (async function (e, t) {
      if (
        (function (e) {
          return (
            (function (e) {
              switch (e) {
                default:
                  return co();
                case ho.CANCELLED:
                case ho.UNKNOWN:
                case ho.DEADLINE_EXCEEDED:
                case ho.RESOURCE_EXHAUSTED:
                case ho.INTERNAL:
                case ho.UNAVAILABLE:
                case ho.UNAUTHENTICATED:
                  return !1;
                case ho.INVALID_ARGUMENT:
                case ho.NOT_FOUND:
                case ho.ALREADY_EXISTS:
                case ho.PERMISSION_DENIED:
                case ho.FAILED_PRECONDITION:
                case ho.ABORTED:
                case ho.OUT_OF_RANGE:
                case ho.UNIMPLEMENTED:
                case ho.DATA_LOSS:
                  return !0;
              }
            })(e) && e !== ho.ABORTED
          );
        })(t.code)
      ) {
        const n = e.D_.shift();
        (ep(e).Zo(),
          await zf(e, () => e.remoteSyncer.rejectFailedWrite(n.batchId, t)),
          await qf(e));
      }
    })(e, t)),
    Kf(e) && Wf(e));
}
async function Jf(e, t) {
  const n = lo(e);
  (n.asyncQueue.verifyOperationInProgress(),
    io('RemoteStore', 'RemoteStore received new credentials'));
  const r = Lf(n);
  (n.v_.add(3),
    await Df(n),
    r && n.x_.set('Unknown'),
    await n.remoteSyncer.handleCredentialChange(t),
    n.v_.delete(3),
    await kf(n));
}
function Zf(e) {
  return (
    e.N_ ||
      ((e.N_ = (function (e, t, n) {
        const r = lo(e);
        return (
          r.R_(),
          new _f(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n)
        );
      })(e.datastore, e.asyncQueue, {
        Po: Uf.bind(null, e),
        To: Vf.bind(null, e),
        u_: Bf.bind(null, e),
      })),
      e.F_.push(async t => {
        t ? (e.N_.Zo(), Mf(e) ? Pf(e) : e.x_.set('Unknown')) : (await e.N_.stop(), Ff(e));
      })),
    e.N_
  );
}
function ep(e) {
  return (
    e.L_ ||
      ((e.L_ = (function (e, t, n) {
        const r = lo(e);
        return (
          r.R_(),
          new Ef(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n)
        );
      })(e.datastore, e.asyncQueue, {
        Po: Hf.bind(null, e),
        To: Xf.bind(null, e),
        E_: Qf.bind(null, e),
        T_: Yf.bind(null, e),
      })),
      e.F_.push(async t => {
        t
          ? (e.L_.Zo(), await qf(e))
          : (await e.L_.stop(),
            e.D_.length > 0 &&
              (io('RemoteStore', `Stopping write stream with ${e.D_.length} pending writes`),
              (e.D_ = [])));
      })),
    e.L_
  );
}
class tp {
  constructor(e, t, n, r, i) {
    ((this.asyncQueue = e),
      (this.timerId = t),
      (this.targetTimeMs = n),
      (this.op = r),
      (this.removalCallback = i),
      (this.deferred = new po()),
      (this.then = this.deferred.promise.then.bind(this.deferred.promise)),
      this.deferred.promise.catch(e => {}));
  }
  get promise() {
    return this.deferred.promise;
  }
  static createAndSchedule(e, t, n, r, i) {
    const s = Date.now() + n,
      o = new tp(e, t, s, r, i);
    return (o.start(n), o);
  }
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  skipDelay() {
    return this.handleDelayElapsed();
  }
  cancel(e) {
    null !== this.timerHandle &&
      (this.clearTimeout(),
      this.deferred.reject(new fo(ho.CANCELLED, 'Operation cancelled' + (e ? ': ' + e : ''))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() =>
      null !== this.timerHandle
        ? (this.clearTimeout(), this.op().then(e => this.deferred.resolve(e)))
        : Promise.resolve()
    );
  }
  clearTimeout() {
    null !== this.timerHandle &&
      (this.removalCallback(this), clearTimeout(this.timerHandle), (this.timerHandle = null));
  }
}
function np(e, t) {
  if ((so('AsyncQueue', `${t}: ${e}`), Yo(e))) return new fo(ho.UNAVAILABLE, `${t}: ${e}`);
  throw e;
}
class rp {
  constructor(e) {
    ((this.comparator = e
      ? (t, n) => e(t, n) || Ro.comparator(t.key, n.key)
      : (e, t) => Ro.comparator(e.key, t.key)),
      (this.keyedMap = _u()),
      (this.sortedSet = new Va(this.comparator)));
  }
  static emptySet(e) {
    return new rp(e.comparator);
  }
  has(e) {
    return null != this.keyedMap.get(e);
  }
  get(e) {
    return this.keyedMap.get(e);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  indexOf(e) {
    const t = this.keyedMap.get(e);
    return t ? this.sortedSet.indexOf(t) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  forEach(e) {
    this.sortedSet.inorderTraversal((t, n) => (e(t), !1));
  }
  add(e) {
    const t = this.delete(e.key);
    return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
  }
  delete(e) {
    const t = this.get(e);
    return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
  }
  isEqual(e) {
    if (!(e instanceof rp)) return !1;
    if (this.size !== e.size) return !1;
    const t = this.sortedSet.getIterator(),
      n = e.sortedSet.getIterator();
    for (; t.hasNext(); ) {
      const e = t.getNext().key,
        r = n.getNext().key;
      if (!e.isEqual(r)) return !1;
    }
    return !0;
  }
  toString() {
    const e = [];
    return (
      this.forEach(t => {
        e.push(t.toString());
      }),
      0 === e.length ? 'DocumentSet ()' : 'DocumentSet (\n  ' + e.join('  \n') + '\n)'
    );
  }
  copy(e, t) {
    const n = new rp();
    return ((n.comparator = this.comparator), (n.keyedMap = e), (n.sortedSet = t), n);
  }
}
class ip {
  constructor() {
    this.B_ = new Va(Ro.comparator);
  }
  track(e) {
    const t = e.doc.key,
      n = this.B_.get(t);
    n
      ? 0 !== e.type && 3 === n.type
        ? (this.B_ = this.B_.insert(t, e))
        : 3 === e.type && 1 !== n.type
          ? (this.B_ = this.B_.insert(t, { type: n.type, doc: e.doc }))
          : 2 === e.type && 2 === n.type
            ? (this.B_ = this.B_.insert(t, { type: 2, doc: e.doc }))
            : 2 === e.type && 0 === n.type
              ? (this.B_ = this.B_.insert(t, { type: 0, doc: e.doc }))
              : 1 === e.type && 0 === n.type
                ? (this.B_ = this.B_.remove(t))
                : 1 === e.type && 2 === n.type
                  ? (this.B_ = this.B_.insert(t, { type: 1, doc: n.doc }))
                  : 0 === e.type && 1 === n.type
                    ? (this.B_ = this.B_.insert(t, { type: 2, doc: e.doc }))
                    : co()
      : (this.B_ = this.B_.insert(t, e));
  }
  k_() {
    const e = [];
    return (
      this.B_.inorderTraversal((t, n) => {
        e.push(n);
      }),
      e
    );
  }
}
class sp {
  constructor(e, t, n, r, i, s, o, a, c) {
    ((this.query = e),
      (this.docs = t),
      (this.oldDocs = n),
      (this.docChanges = r),
      (this.mutatedKeys = i),
      (this.fromCache = s),
      (this.syncStateChanged = o),
      (this.excludesMetadataChanges = a),
      (this.hasCachedResults = c));
  }
  static fromInitialDocuments(e, t, n, r, i) {
    const s = [];
    return (
      t.forEach(e => {
        s.push({ type: 0, doc: e });
      }),
      new sp(e, t, rp.emptySet(t), s, n, r, !0, !1, i)
    );
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(e) {
    if (
      !(
        this.fromCache === e.fromCache &&
        this.hasCachedResults === e.hasCachedResults &&
        this.syncStateChanged === e.syncStateChanged &&
        this.mutatedKeys.isEqual(e.mutatedKeys) &&
        fu(this.query, e.query) &&
        this.docs.isEqual(e.docs) &&
        this.oldDocs.isEqual(e.oldDocs)
      )
    )
      return !1;
    const t = this.docChanges,
      n = e.docChanges;
    if (t.length !== n.length) return !1;
    for (let e = 0; e < t.length; e++)
      if (t[e].type !== n[e].type || !t[e].doc.isEqual(n[e].doc)) return !1;
    return !0;
  }
}
class op {
  constructor() {
    ((this.q_ = void 0), (this.Q_ = []));
  }
  K_() {
    return this.Q_.some(e => e.U_());
  }
}
class ap {
  constructor() {
    ((this.queries = new vu(e => pu(e), fu)),
      (this.onlineState = 'Unknown'),
      (this.W_ = new Set()));
  }
}
async function cp(e, t) {
  const n = lo(e);
  let r = 3;
  const i = t.query;
  let s = n.queries.get(i);
  s ? !s.K_() && t.U_() && (r = 2) : ((s = new op()), (r = t.U_() ? 0 : 1));
  try {
    switch (r) {
      case 0:
        s.q_ = await n.onListen(i, !0);
        break;
      case 1:
        s.q_ = await n.onListen(i, !1);
        break;
      case 2:
        await n.onFirstRemoteStoreListen(i);
    }
  } catch (e) {
    const n = np(e, `Initialization of query '${gu(t.query)}' failed`);
    return void t.onError(n);
  }
  (n.queries.set(i, s), s.Q_.push(t), t.G_(n.onlineState), s.q_ && t.z_(s.q_) && dp(n));
}
async function up(e, t) {
  const n = lo(e),
    r = t.query;
  let i = 3;
  const s = n.queries.get(r);
  if (s) {
    const e = s.Q_.indexOf(t);
    e >= 0 &&
      (s.Q_.splice(e, 1), 0 === s.Q_.length ? (i = t.U_() ? 0 : 1) : !s.K_() && t.U_() && (i = 2));
  }
  switch (i) {
    case 0:
      return (n.queries.delete(r), n.onUnlisten(r, !0));
    case 1:
      return (n.queries.delete(r), n.onUnlisten(r, !1));
    case 2:
      return n.onLastRemoteStoreUnlisten(r);
    default:
      return;
  }
}
function lp(e, t) {
  const n = lo(e);
  let r = !1;
  for (const e of t) {
    const t = e.query,
      i = n.queries.get(t);
    if (i) {
      for (const t of i.Q_) t.z_(e) && (r = !0);
      i.q_ = e;
    }
  }
  r && dp(n);
}
function hp(e, t, n) {
  const r = lo(e),
    i = r.queries.get(t);
  if (i) for (const e of i.Q_) e.onError(n);
  r.queries.delete(t);
}
function dp(e) {
  e.W_.forEach(e => {
    e.next();
  });
}
var fp, pp;
(((pp = fp || (fp = {})).j_ = 'default'), (pp.Cache = 'cache'));
class gp {
  constructor(e, t, n) {
    ((this.query = e),
      (this.H_ = t),
      (this.J_ = !1),
      (this.Y_ = null),
      (this.onlineState = 'Unknown'),
      (this.options = n || {}));
  }
  z_(e) {
    if (!this.options.includeMetadataChanges) {
      const t = [];
      for (const n of e.docChanges) 3 !== n.type && t.push(n);
      e = new sp(
        e.query,
        e.docs,
        e.oldDocs,
        t,
        e.mutatedKeys,
        e.fromCache,
        e.syncStateChanged,
        !0,
        e.hasCachedResults
      );
    }
    let t = !1;
    return (
      this.J_
        ? this.Z_(e) && (this.H_.next(e), (t = !0))
        : this.X_(e, this.onlineState) && (this.ea(e), (t = !0)),
      (this.Y_ = e),
      t
    );
  }
  onError(e) {
    this.H_.error(e);
  }
  G_(e) {
    this.onlineState = e;
    let t = !1;
    return (this.Y_ && !this.J_ && this.X_(this.Y_, e) && (this.ea(this.Y_), (t = !0)), t);
  }
  X_(e, t) {
    if (!e.fromCache) return !0;
    if (!this.U_()) return !0;
    const n = 'Offline' !== t;
    return (!this.options.ta || !n) && (!e.docs.isEmpty() || e.hasCachedResults || 'Offline' === t);
  }
  Z_(e) {
    if (e.docChanges.length > 0) return !0;
    const t = this.Y_ && this.Y_.hasPendingWrites !== e.hasPendingWrites;
    return !(!e.syncStateChanged && !t) && !0 === this.options.includeMetadataChanges;
  }
  ea(e) {
    ((e = sp.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults)),
      (this.J_ = !0),
      this.H_.next(e));
  }
  U_() {
    return this.options.source !== fp.Cache;
  }
}
class mp {
  constructor(e) {
    this.key = e;
  }
}
class yp {
  constructor(e) {
    this.key = e;
  }
}
class wp {
  constructor(e, t) {
    ((this.query = e),
      (this.ua = t),
      (this.ca = null),
      (this.hasCachedResults = !1),
      (this.current = !1),
      (this.la = xu()),
      (this.mutatedKeys = xu()),
      (this.ha = yu(e)),
      (this.Pa = new rp(this.ha)));
  }
  get Ia() {
    return this.ua;
  }
  Ta(e, t) {
    const n = t ? t.Ea : new ip(),
      r = t ? t.Pa : this.Pa;
    let i = t ? t.mutatedKeys : this.mutatedKeys,
      s = r,
      o = !1;
    const a = 'F' === this.query.limitType && r.size === this.query.limit ? r.last() : null,
      c = 'L' === this.query.limitType && r.size === this.query.limit ? r.first() : null;
    if (
      (e.inorderTraversal((e, t) => {
        const u = r.get(e),
          l = mu(this.query, t) ? t : null,
          h = !!u && this.mutatedKeys.has(u.key),
          d =
            !!l &&
            (l.hasLocalMutations || (this.mutatedKeys.has(l.key) && l.hasCommittedMutations));
        let f = !1;
        (u && l
          ? u.data.isEqual(l.data)
            ? h !== d && (n.track({ type: 3, doc: l }), (f = !0))
            : this.da(u, l) ||
              (n.track({ type: 2, doc: l }),
              (f = !0),
              ((a && this.ha(l, a) > 0) || (c && this.ha(l, c) < 0)) && (o = !0))
          : !u && l
            ? (n.track({ type: 0, doc: l }), (f = !0))
            : u && !l && (n.track({ type: 1, doc: u }), (f = !0), (a || c) && (o = !0)),
          f &&
            (l
              ? ((s = s.add(l)), (i = d ? i.add(e) : i.delete(e)))
              : ((s = s.delete(e)), (i = i.delete(e)))));
      }),
      null !== this.query.limit)
    )
      for (; s.size > this.query.limit; ) {
        const e = 'F' === this.query.limitType ? s.last() : s.first();
        ((s = s.delete(e.key)), (i = i.delete(e.key)), n.track({ type: 1, doc: e }));
      }
    return { Pa: s, Ea: n, Xi: o, mutatedKeys: i };
  }
  da(e, t) {
    return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
  }
  applyChanges(e, t, n, r) {
    const i = this.Pa;
    ((this.Pa = e.Pa), (this.mutatedKeys = e.mutatedKeys));
    const s = e.Ea.k_();
    (s.sort(
      (e, t) =>
        (function (e, t) {
          const n = e => {
            switch (e) {
              case 0:
                return 1;
              case 2:
              case 3:
                return 2;
              case 1:
                return 0;
              default:
                return co();
            }
          };
          return n(e) - n(t);
        })(e.type, t.type) || this.ha(e.doc, t.doc)
    ),
      this.Aa(n),
      (r = null != r && r));
    const o = t && !r ? this.Ra() : [],
      a = 0 === this.la.size && this.current && !r ? 1 : 0,
      c = a !== this.ca;
    return (
      (this.ca = a),
      0 !== s.length || c
        ? {
            snapshot: new sp(
              this.query,
              e.Pa,
              i,
              s,
              e.mutatedKeys,
              0 === a,
              c,
              !1,
              !!n && n.resumeToken.approximateByteSize() > 0
            ),
            Va: o,
          }
        : { Va: o }
    );
  }
  G_(e) {
    return this.current && 'Offline' === e
      ? ((this.current = !1),
        this.applyChanges({ Pa: this.Pa, Ea: new ip(), mutatedKeys: this.mutatedKeys, Xi: !1 }, !1))
      : { Va: [] };
  }
  ma(e) {
    return !this.ua.has(e) && !!this.Pa.has(e) && !this.Pa.get(e).hasLocalMutations;
  }
  Aa(e) {
    e &&
      (e.addedDocuments.forEach(e => (this.ua = this.ua.add(e))),
      e.modifiedDocuments.forEach(e => {}),
      e.removedDocuments.forEach(e => (this.ua = this.ua.delete(e))),
      (this.current = e.current));
  }
  Ra() {
    if (!this.current) return [];
    const e = this.la;
    ((this.la = xu()),
      this.Pa.forEach(e => {
        this.ma(e.key) && (this.la = this.la.add(e.key));
      }));
    const t = [];
    return (
      e.forEach(e => {
        this.la.has(e) || t.push(new yp(e));
      }),
      this.la.forEach(n => {
        e.has(n) || t.push(new mp(n));
      }),
      t
    );
  }
  fa(e) {
    ((this.ua = e.hs), (this.la = xu()));
    const t = this.Ta(e.documents);
    return this.applyChanges(t, !0);
  }
  ga() {
    return sp.fromInitialDocuments(
      this.query,
      this.Pa,
      this.mutatedKeys,
      0 === this.ca,
      this.hasCachedResults
    );
  }
}
class vp {
  constructor(e, t, n) {
    ((this.query = e), (this.targetId = t), (this.view = n));
  }
}
class bp {
  constructor(e) {
    ((this.key = e), (this.pa = !1));
  }
}
class Ip {
  constructor(e, t, n, r, i, s) {
    ((this.localStore = e),
      (this.remoteStore = t),
      (this.eventManager = n),
      (this.sharedClientState = r),
      (this.currentUser = i),
      (this.maxConcurrentLimboResolutions = s),
      (this.ya = {}),
      (this.wa = new vu(e => pu(e), fu)),
      (this.Sa = new Map()),
      (this.ba = new Set()),
      (this.Da = new Va(Ro.comparator)),
      (this.Ca = new Map()),
      (this.va = new Ld()),
      (this.Fa = {}),
      (this.Ma = new Map()),
      (this.xa = dd.Ln()),
      (this.onlineState = 'Unknown'),
      (this.Oa = void 0));
  }
  get isPrimaryClient() {
    return !0 === this.Oa;
  }
}
async function Tp(e, t, n = !0) {
  const r = zp(e);
  let i;
  const s = r.wa.get(t);
  return (
    s
      ? (r.sharedClientState.addLocalQueryTarget(s.targetId), (i = s.view.ga()))
      : (i = await Ep(r, t, n, !0)),
    i
  );
}
async function _p(e, t) {
  const n = zp(e);
  await Ep(n, t, !0, !1);
}
async function Ep(e, t, n, r) {
  const i = await (function (e, t) {
      const n = lo(e);
      return n.persistence
        .runTransaction('Allocate target', 'readwrite', e => {
          let r;
          return n.Qr.getTargetData(e, t).next(i =>
            i
              ? ((r = i), $o.resolve(r))
              : n.Qr.allocateTargetId(e).next(
                  i => (
                    (r = new lh(t, i, 'TargetPurposeListen', e.currentSequenceNumber)),
                    n.Qr.addTargetData(e, r).next(() => r)
                  )
                )
          );
        })
        .then(e => {
          const r = n.ns.get(e.targetId);
          return (
            (null === r || e.snapshotVersion.compareTo(r.snapshotVersion) > 0) &&
              ((n.ns = n.ns.insert(e.targetId, e)), n.rs.set(t, e.targetId)),
            e
          );
        });
    })(e.localStore, lu(t)),
    s = i.targetId,
    o = n ? e.sharedClientState.addLocalQueryTarget(s) : 'not-current';
  let a;
  return (
    r &&
      (a = await (async function (e, t, n, r, i) {
        e.Na = (t, n, r) =>
          (async function (e, t, n, r) {
            let i = t.view.Ta(n);
            i.Xi &&
              (i = await cf(e.localStore, t.query, !1).then(({ documents: e }) => t.view.Ta(e, i)));
            const s = r && r.targetChanges.get(t.targetId),
              o = r && null != r.targetMismatches.get(t.targetId),
              a = t.view.applyChanges(i, e.isPrimaryClient, s, o);
            return (Lp(e, t.targetId, a.Va), a.snapshot);
          })(e, t, n, r);
        const s = await cf(e.localStore, t, !0),
          o = new wp(t, s.hs),
          a = o.Ta(s.documents),
          c = _l.createSynthesizedTargetChangeForCurrentChange(
            n,
            r && 'Offline' !== e.onlineState,
            i
          ),
          u = o.applyChanges(a, e.isPrimaryClient, c);
        Lp(e, n, u.Va);
        const l = new vp(t, n, o);
        return (e.wa.set(t, l), e.Sa.has(n) ? e.Sa.get(n).push(t) : e.Sa.set(n, [t]), u.snapshot);
      })(e, t, s, 'current' === o, i.resumeToken)),
    e.isPrimaryClient && n && xf(e.remoteStore, i),
    a
  );
}
async function Sp(e, t, n) {
  const r = lo(e),
    i = r.wa.get(t),
    s = r.Sa.get(i.targetId);
  if (s.length > 1)
    return (
      r.Sa.set(
        i.targetId,
        s.filter(e => !fu(e, t))
      ),
      void r.wa.delete(t)
    );
  r.isPrimaryClient
    ? (r.sharedClientState.removeLocalQueryTarget(i.targetId),
      r.sharedClientState.isActiveQueryTarget(i.targetId) ||
        (await af(r.localStore, i.targetId, !1)
          .then(() => {
            (r.sharedClientState.clearQueryState(i.targetId),
              n && Nf(r.remoteStore, i.targetId),
              Pp(r, i.targetId));
          })
          .catch(Go)))
    : (Pp(r, i.targetId), await af(r.localStore, i.targetId, !0));
}
async function Cp(e, t) {
  const n = lo(e),
    r = n.wa.get(t),
    i = n.Sa.get(r.targetId);
  n.isPrimaryClient &&
    1 === i.length &&
    (n.sharedClientState.removeLocalQueryTarget(r.targetId), Nf(n.remoteStore, r.targetId));
}
async function Ap(e, t) {
  const n = lo(e);
  try {
    const e = await (function (e, t) {
      const n = lo(e),
        r = t.snapshotVersion;
      let i = n.ns;
      return n.persistence
        .runTransaction('Apply remote event', 'readwrite-primary', e => {
          const s = n.os.newChangeBuffer({ trackRemovals: !0 });
          i = n.ns;
          const o = [];
          t.targetChanges.forEach((s, a) => {
            const c = i.get(a);
            if (!c) return;
            o.push(
              n.Qr.removeMatchingKeys(e, s.removedDocuments, a).next(() =>
                n.Qr.addMatchingKeys(e, s.addedDocuments, a)
              )
            );
            let u = c.withSequenceNumber(e.currentSequenceNumber);
            (null !== t.targetMismatches.get(a)
              ? (u = u
                  .withResumeToken(Wa.EMPTY_BYTE_STRING, ko.min())
                  .withLastLimboFreeSnapshotVersion(ko.min()))
              : s.resumeToken.approximateByteSize() > 0 &&
                (u = u.withResumeToken(s.resumeToken, r)),
              (i = i.insert(a, u)),
              (function (e, t, n) {
                return (
                  0 === e.resumeToken.approximateByteSize() ||
                  t.snapshotVersion.toMicroseconds() - e.snapshotVersion.toMicroseconds() >= 3e8 ||
                  n.addedDocuments.size + n.modifiedDocuments.size + n.removedDocuments.size > 0
                );
              })(c, u, s) && o.push(n.Qr.updateTargetData(e, u)));
          });
          let a = Iu(),
            c = xu();
          if (
            (t.documentUpdates.forEach(r => {
              t.resolvedLimboDocuments.has(r) &&
                o.push(n.persistence.referenceDelegate.updateLimboDocument(e, r));
            }),
            o.push(
              (function (e, t, n) {
                let r = xu(),
                  i = xu();
                return (
                  n.forEach(e => (r = r.add(e))),
                  t.getEntries(e, r).next(e => {
                    let r = Iu();
                    return (
                      n.forEach((n, s) => {
                        const o = e.get(n);
                        (s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n)),
                          s.isNoDocument() && s.version.isEqual(ko.min())
                            ? (t.removeEntry(n, s.readTime), (r = r.insert(n, s)))
                            : !o.isValidDocument() ||
                                s.version.compareTo(o.version) > 0 ||
                                (0 === s.version.compareTo(o.version) && o.hasPendingWrites)
                              ? (t.addEntry(s), (r = r.insert(n, s)))
                              : io(
                                  'LocalStore',
                                  'Ignoring outdated watch update for ',
                                  n,
                                  '. Current version:',
                                  o.version,
                                  ' Watch version:',
                                  s.version
                                ));
                      }),
                      { cs: r, ls: i }
                    );
                  })
                );
              })(e, s, t.documentUpdates).next(e => {
                ((a = e.cs), (c = e.ls));
              })
            ),
            !r.isEqual(ko.min()))
          ) {
            const t = n.Qr.getLastRemoteSnapshotVersion(e).next(t =>
              n.Qr.setTargetsMetadata(e, e.currentSequenceNumber, r)
            );
            o.push(t);
          }
          return $o
            .waitFor(o)
            .next(() => s.apply(e))
            .next(() => n.localDocuments.getLocalViewOfDocuments(e, a, c))
            .next(() => a);
        })
        .then(e => ((n.ns = i), e));
    })(n.localStore, t);
    (t.targetChanges.forEach((e, t) => {
      const r = n.Ca.get(t);
      r &&
        (uo(e.addedDocuments.size + e.modifiedDocuments.size + e.removedDocuments.size <= 1),
        e.addedDocuments.size > 0
          ? (r.pa = !0)
          : e.modifiedDocuments.size > 0
            ? uo(r.pa)
            : e.removedDocuments.size > 0 && (uo(r.pa), (r.pa = !1)));
    }),
      await Vp(n, e, t));
  } catch (e) {
    await Go(e);
  }
}
function kp(e, t, n) {
  const r = lo(e);
  if ((r.isPrimaryClient && 0 === n) || (!r.isPrimaryClient && 1 === n)) {
    const e = [];
    (r.wa.forEach((n, r) => {
      const i = r.view.G_(t);
      i.snapshot && e.push(i.snapshot);
    }),
      (function (e, t) {
        const n = lo(e);
        n.onlineState = t;
        let r = !1;
        (n.queries.forEach((e, n) => {
          for (const e of n.Q_) e.G_(t) && (r = !0);
        }),
          r && dp(n));
      })(r.eventManager, t),
      e.length && r.ya.u_(e),
      (r.onlineState = t),
      r.isPrimaryClient && r.sharedClientState.setOnlineState(t));
  }
}
async function Dp(e, t, n) {
  const r = lo(e);
  r.sharedClientState.updateQueryState(t, 'rejected', n);
  const i = r.Ca.get(t),
    s = i && i.key;
  if (s) {
    let e = new Va(Ro.comparator);
    e = e.insert(s, Cc.newNoDocument(s, ko.min()));
    const n = xu().add(s),
      i = new Tl(ko.min(), new Map(), new Va(Eo), e, n);
    (await Ap(r, i), (r.Da = r.Da.remove(s)), r.Ca.delete(t), Up(r));
  } else
    await af(r.localStore, t, !1)
      .then(() => Pp(r, t, n))
      .catch(Go);
}
async function xp(e, t) {
  const n = lo(e),
    r = t.batch.batchId;
  try {
    const e = await (function (e, t) {
      const n = lo(e);
      return n.persistence.runTransaction('Acknowledge batch', 'readwrite-primary', e => {
        const r = t.batch.keys(),
          i = n.os.newChangeBuffer({ trackRemovals: !0 });
        return (function (e, t, n, r) {
          const i = n.batch,
            s = i.keys();
          let o = $o.resolve();
          return (
            s.forEach(e => {
              o = o
                .next(() => r.getEntry(t, e))
                .next(t => {
                  const s = n.docVersions.get(e);
                  (uo(null !== s),
                    t.version.compareTo(s) < 0 &&
                      (i.applyToRemoteDocument(t, n),
                      t.isValidDocument() && (t.setReadTime(n.commitVersion), r.addEntry(t))));
                });
            }),
            o.next(() => e.mutationQueue.removeMutationBatch(t, i))
          );
        })(n, e, t, i)
          .next(() => i.apply(e))
          .next(() => n.mutationQueue.performConsistencyCheck(e))
          .next(() => n.documentOverlayCache.removeOverlaysForBatchId(e, r, t.batch.batchId))
          .next(() =>
            n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(
              e,
              (function (e) {
                let t = xu();
                for (let n = 0; n < e.mutationResults.length; ++n)
                  e.mutationResults[n].transformResults.length > 0 &&
                    (t = t.add(e.batch.mutations[n].key));
                return t;
              })(t)
            )
          )
          .next(() => n.localDocuments.getDocuments(e, r));
      });
    })(n.localStore, t);
    (Rp(n, r, null),
      Op(n, r),
      n.sharedClientState.updateMutationState(r, 'acknowledged'),
      await Vp(n, e));
  } catch (e) {
    await Go(e);
  }
}
async function Np(e, t, n) {
  const r = lo(e);
  try {
    const e = await (function (e, t) {
      const n = lo(e);
      return n.persistence.runTransaction('Reject batch', 'readwrite-primary', e => {
        let r;
        return n.mutationQueue
          .lookupMutationBatch(e, t)
          .next(t => (uo(null !== t), (r = t.keys()), n.mutationQueue.removeMutationBatch(e, t)))
          .next(() => n.mutationQueue.performConsistencyCheck(e))
          .next(() => n.documentOverlayCache.removeOverlaysForBatchId(e, r, t))
          .next(() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e, r))
          .next(() => n.localDocuments.getDocuments(e, r));
      });
    })(r.localStore, t);
    (Rp(r, t, n),
      Op(r, t),
      r.sharedClientState.updateMutationState(t, 'rejected', n),
      await Vp(r, e));
  } catch (n) {
    await Go(n);
  }
}
function Op(e, t) {
  ((e.Ma.get(t) || []).forEach(e => {
    e.resolve();
  }),
    e.Ma.delete(t));
}
function Rp(e, t, n) {
  const r = lo(e);
  let i = r.Fa[r.currentUser.toKey()];
  if (i) {
    const e = i.get(t);
    (e && (n ? e.reject(n) : e.resolve(), (i = i.remove(t))), (r.Fa[r.currentUser.toKey()] = i));
  }
}
function Pp(e, t, n = null) {
  e.sharedClientState.removeLocalQueryTarget(t);
  for (const r of e.Sa.get(t)) (e.wa.delete(r), n && e.ya.La(r, n));
  (e.Sa.delete(t),
    e.isPrimaryClient &&
      e.va.Vr(t).forEach(t => {
        e.va.containsKey(t) || Mp(e, t);
      }));
}
function Mp(e, t) {
  e.ba.delete(t.path.canonicalString());
  const n = e.Da.get(t);
  null !== n && (Nf(e.remoteStore, n), (e.Da = e.Da.remove(t)), e.Ca.delete(n), Up(e));
}
function Lp(e, t, n) {
  for (const r of n)
    r instanceof mp
      ? (e.va.addReference(r.key, t), Fp(e, r))
      : r instanceof yp
        ? (io('SyncEngine', 'Document no longer in limbo: ' + r.key),
          e.va.removeReference(r.key, t),
          e.va.containsKey(r.key) || Mp(e, r.key))
        : co();
}
function Fp(e, t) {
  const n = t.key,
    r = n.path.canonicalString();
  e.Da.get(n) ||
    e.ba.has(r) ||
    (io('SyncEngine', 'New document in limbo: ' + n), e.ba.add(r), Up(e));
}
function Up(e) {
  for (; e.ba.size > 0 && e.Da.size < e.maxConcurrentLimboResolutions; ) {
    const t = e.ba.values().next().value;
    e.ba.delete(t);
    const n = new Ro(xo.fromString(t)),
      r = e.xa.next();
    (e.Ca.set(r, new bp(n)),
      (e.Da = e.Da.insert(n, r)),
      xf(e.remoteStore, new lh(lu(ou(n.path)), r, 'TargetPurposeLimboResolution', ra._e)));
  }
}
async function Vp(e, t, n) {
  const r = lo(e),
    i = [],
    s = [],
    o = [];
  r.wa.isEmpty() ||
    (r.wa.forEach((e, a) => {
      o.push(
        r.Na(a, t, n).then(e => {
          if (
            ((e || n) &&
              r.isPrimaryClient &&
              r.sharedClientState.updateQueryState(
                a.targetId,
                (null == e ? void 0 : e.fromCache) ? 'not-current' : 'current'
              ),
            e)
          ) {
            i.push(e);
            const t = Jd.Ki(a.targetId, e);
            s.push(t);
          }
        })
      );
    }),
    await Promise.all(o),
    r.ya.u_(i),
    await (async function (e, t) {
      const n = lo(e);
      try {
        await n.persistence.runTransaction('notifyLocalViewChanges', 'readwrite', e =>
          $o.forEach(t, t =>
            $o
              .forEach(t.qi, r => n.persistence.referenceDelegate.addReference(e, t.targetId, r))
              .next(() =>
                $o.forEach(t.Qi, r =>
                  n.persistence.referenceDelegate.removeReference(e, t.targetId, r)
                )
              )
          )
        );
      } catch (e) {
        if (!Yo(e)) throw e;
        io('LocalStore', 'Failed to update sequence numbers: ' + e);
      }
      for (const e of t) {
        const t = e.targetId;
        if (!e.fromCache) {
          const e = n.ns.get(t),
            r = e.snapshotVersion,
            i = e.withLastLimboFreeSnapshotVersion(r);
          n.ns = n.ns.insert(t, i);
        }
      }
    })(r.localStore, s));
}
async function Bp(e, t) {
  const n = lo(e);
  if (!n.currentUser.isEqual(t)) {
    io('SyncEngine', 'User change. New user:', t.toKey());
    const e = await rf(n.localStore, t);
    ((n.currentUser = t),
      (function (e, t) {
        (e.Ma.forEach(e => {
          e.forEach(e => {
            e.reject(
              new fo(
                ho.CANCELLED,
                "'waitForPendingWrites' promise is rejected due to a user change."
              )
            );
          });
        }),
          e.Ma.clear());
      })(n),
      n.sharedClientState.handleUserChange(t, e.removedBatchIds, e.addedBatchIds),
      await Vp(n, e.us));
  }
}
function jp(e, t) {
  const n = lo(e),
    r = n.Ca.get(t);
  if (r && r.pa) return xu().add(r.key);
  {
    let e = xu();
    const r = n.Sa.get(t);
    if (!r) return e;
    for (const t of r) {
      const r = n.wa.get(t);
      e = e.unionWith(r.view.Ia);
    }
    return e;
  }
}
function zp(e) {
  const t = lo(e);
  return (
    (t.remoteStore.remoteSyncer.applyRemoteEvent = Ap.bind(null, t)),
    (t.remoteStore.remoteSyncer.getRemoteKeysForTarget = jp.bind(null, t)),
    (t.remoteStore.remoteSyncer.rejectListen = Dp.bind(null, t)),
    (t.ya.u_ = lp.bind(null, t.eventManager)),
    (t.ya.La = hp.bind(null, t.eventManager)),
    t
  );
}
function qp(e) {
  const t = lo(e);
  return (
    (t.remoteStore.remoteSyncer.applySuccessfulWrite = xp.bind(null, t)),
    (t.remoteStore.remoteSyncer.rejectFailedWrite = Np.bind(null, t)),
    t
  );
}
class Gp {
  constructor() {
    this.synchronizeTabs = !1;
  }
  async initialize(e) {
    ((this.serializer = bf(e.databaseInfo.databaseId)),
      (this.sharedClientState = this.createSharedClientState(e)),
      (this.persistence = this.createPersistence(e)),
      await this.persistence.start(),
      (this.localStore = this.createLocalStore(e)),
      (this.gcScheduler = this.createGarbageCollectionScheduler(e, this.localStore)),
      (this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(e, this.localStore)));
  }
  createGarbageCollectionScheduler(e, t) {
    return null;
  }
  createIndexBackfillerScheduler(e, t) {
    return null;
  }
  createLocalStore(e) {
    return nf(this.persistence, new ef(), e.initialUser, this.serializer);
  }
  createPersistence(e) {
    return new zd(Gd.Hr, this.serializer);
  }
  createSharedClientState(e) {
    return new lf();
  }
  async terminate() {
    var e, t;
    (null === (e = this.gcScheduler) || void 0 === e || e.stop(),
      null === (t = this.indexBackfillerScheduler) || void 0 === t || t.stop(),
      this.sharedClientState.shutdown(),
      await this.persistence.shutdown());
  }
}
class $p extends Gp {
  constructor(e, t, n) {
    (super(),
      (this.ka = e),
      (this.cacheSizeBytes = t),
      (this.forceOwnership = n),
      (this.synchronizeTabs = !1));
  }
  async initialize(e) {
    (await super.initialize(e),
      await this.ka.initialize(this, e),
      await qp(this.ka.syncEngine),
      await qf(this.ka.remoteStore),
      await this.persistence.fi(
        () => (
          this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(),
          this.indexBackfillerScheduler &&
            !this.indexBackfillerScheduler.started &&
            this.indexBackfillerScheduler.start(),
          Promise.resolve()
        )
      ));
  }
  createLocalStore(e) {
    return nf(this.persistence, new ef(), e.initialUser, this.serializer);
  }
  createGarbageCollectionScheduler(e, t) {
    const n = this.persistence.referenceDelegate.garbageCollector;
    return new vd(n, e.asyncQueue, t);
  }
  createIndexBackfillerScheduler(e, t) {
    const n = new na(t, this.persistence);
    return new ta(e.asyncQueue, n);
  }
  createPersistence(e) {
    const t = Xd(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey),
      n = void 0 !== this.cacheSizeBytes ? id.withCacheSize(this.cacheSizeBytes) : id.DEFAULT;
    return new Hd(
      this.synchronizeTabs,
      t,
      e.clientId,
      n,
      e.asyncQueue,
      'undefined' != typeof window ? window : null,
      vf(),
      this.serializer,
      this.sharedClientState,
      !!this.forceOwnership
    );
  }
  createSharedClientState(e) {
    return new lf();
  }
}
class Kp {
  async initialize(e, t) {
    this.localStore ||
      ((this.localStore = e.localStore),
      (this.sharedClientState = e.sharedClientState),
      (this.datastore = this.createDatastore(t)),
      (this.remoteStore = this.createRemoteStore(t)),
      (this.eventManager = this.createEventManager(t)),
      (this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs)),
      (this.sharedClientState.onlineStateHandler = e => kp(this.syncEngine, e, 1)),
      (this.remoteStore.remoteSyncer.handleCredentialChange = Bp.bind(null, this.syncEngine)),
      await (async function (e, t) {
        const n = lo(e);
        t ? (n.v_.delete(2), await kf(n)) : t || (n.v_.add(2), await Df(n), n.x_.set('Unknown'));
      })(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(e) {
    return new ap();
  }
  createDatastore(e) {
    const t = bf(e.databaseInfo.databaseId),
      n = (function (e) {
        return new wf(e);
      })(e.databaseInfo);
    return (function (e, t, n, r) {
      return new Sf(e, t, n, r);
    })(e.authCredentials, e.appCheckCredentials, n, t);
  }
  createRemoteStore(e) {
    return (function (e, t, n, r, i) {
      return new Af(e, t, n, r, i);
    })(
      this.localStore,
      this.datastore,
      e.asyncQueue,
      e => kp(this.syncEngine, e, 0),
      df.D() ? new df() : new hf()
    );
  }
  createSyncEngine(e, t) {
    return (function (e, t, n, r, i, s, o) {
      const a = new Ip(e, t, n, r, i, s);
      return (o && (a.Oa = !0), a);
    })(
      this.localStore,
      this.remoteStore,
      this.eventManager,
      this.sharedClientState,
      e.initialUser,
      e.maxConcurrentLimboResolutions,
      t
    );
  }
  async terminate() {
    var e;
    (await (async function (e) {
      const t = lo(e);
      (io('RemoteStore', 'RemoteStore shutting down.'),
        t.v_.add(5),
        await Df(t),
        t.M_.shutdown(),
        t.x_.set('Unknown'));
    })(this.remoteStore),
      null === (e = this.datastore) || void 0 === e || e.terminate());
  }
}
class Wp {
  constructor(e) {
    ((this.observer = e), (this.muted = !1));
  }
  next(e) {
    this.observer.next && this.qa(this.observer.next, e);
  }
  error(e) {
    this.observer.error
      ? this.qa(this.observer.error, e)
      : so('Uncaught Error in snapshot listener:', e.toString());
  }
  Qa() {
    this.muted = !0;
  }
  qa(e, t) {
    this.muted ||
      setTimeout(() => {
        this.muted || e(t);
      }, 0);
  }
}
class Hp {
  constructor(e, t, n, r) {
    ((this.authCredentials = e),
      (this.appCheckCredentials = t),
      (this.asyncQueue = n),
      (this.databaseInfo = r),
      (this.user = eo.UNAUTHENTICATED),
      (this.clientId = _o.newId()),
      (this.authCredentialListener = () => Promise.resolve()),
      (this.appCheckCredentialListener = () => Promise.resolve()),
      this.authCredentials.start(n, async e => {
        (io('FirestoreClient', 'Received user=', e.uid),
          await this.authCredentialListener(e),
          (this.user = e));
      }),
      this.appCheckCredentials.start(
        n,
        e => (
          io('FirestoreClient', 'Received new app check token=', e),
          this.appCheckCredentialListener(e, this.user)
        )
      ));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this.databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100,
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  verifyNotTerminated() {
    if (this.asyncQueue.isShuttingDown)
      throw new fo(ho.FAILED_PRECONDITION, 'The client has already been terminated.');
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new po();
    return (
      this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
        try {
          (this._onlineComponents && (await this._onlineComponents.terminate()),
            this._offlineComponents && (await this._offlineComponents.terminate()),
            this.authCredentials.shutdown(),
            this.appCheckCredentials.shutdown(),
            e.resolve());
        } catch (t) {
          const n = np(t, 'Failed to shutdown persistence');
          e.reject(n);
        }
      }),
      e.promise
    );
  }
}
async function Qp(e, t) {
  (e.asyncQueue.verifyOperationInProgress(),
    io('FirestoreClient', 'Initializing OfflineComponentProvider'));
  const n = e.configuration;
  await t.initialize(n);
  let r = n.initialUser;
  (e.setCredentialChangeListener(async e => {
    r.isEqual(e) || (await rf(t.localStore, e), (r = e));
  }),
    t.persistence.setDatabaseDeletedListener(() => e.terminate()),
    (e._offlineComponents = t));
}
async function Yp(e, t) {
  e.asyncQueue.verifyOperationInProgress();
  const n = await (async function (e) {
    if (!e._offlineComponents)
      if (e._uninitializedComponentsProvider) {
        io('FirestoreClient', 'Using user provided OfflineComponentProvider');
        try {
          await Qp(e, e._uninitializedComponentsProvider._offline);
        } catch (t) {
          const n = t;
          if (
            !(function (e) {
              return 'FirebaseError' === e.name
                ? e.code === ho.FAILED_PRECONDITION || e.code === ho.UNIMPLEMENTED
                : !('undefined' != typeof DOMException && e instanceof DOMException) ||
                    22 === e.code ||
                    20 === e.code ||
                    11 === e.code;
            })(n)
          )
            throw n;
          (oo('Error using user provided cache. Falling back to memory cache: ' + n),
            await Qp(e, new Gp()));
        }
      } else
        (io('FirestoreClient', 'Using default OfflineComponentProvider'), await Qp(e, new Gp()));
    return e._offlineComponents;
  })(e);
  (io('FirestoreClient', 'Initializing OnlineComponentProvider'),
    await t.initialize(n, e.configuration),
    e.setCredentialChangeListener(e => Jf(t.remoteStore, e)),
    e.setAppCheckTokenChangeListener((e, n) => Jf(t.remoteStore, n)),
    (e._onlineComponents = t));
}
async function Xp(e) {
  return (
    e._onlineComponents ||
      (e._uninitializedComponentsProvider
        ? (io('FirestoreClient', 'Using user provided OnlineComponentProvider'),
          await Yp(e, e._uninitializedComponentsProvider._online))
        : (io('FirestoreClient', 'Using default OnlineComponentProvider'), await Yp(e, new Kp()))),
    e._onlineComponents
  );
}
function Jp(e) {
  return Xp(e).then(e => e.syncEngine);
}
async function Zp(e) {
  const t = await Xp(e),
    n = t.eventManager;
  return (
    (n.onListen = Tp.bind(null, t.syncEngine)),
    (n.onUnlisten = Sp.bind(null, t.syncEngine)),
    (n.onFirstRemoteStoreListen = _p.bind(null, t.syncEngine)),
    (n.onLastRemoteStoreUnlisten = Cp.bind(null, t.syncEngine)),
    n
  );
}
function eg(e) {
  const t = {};
  return (void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t);
}
const tg = new Map();
function ng(e, t, n) {
  if (!n) throw new fo(ho.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
}
function rg(e) {
  if (!Ro.isDocumentKey(e))
    throw new fo(
      ho.INVALID_ARGUMENT,
      `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`
    );
}
function ig(e) {
  if (Ro.isDocumentKey(e))
    throw new fo(
      ho.INVALID_ARGUMENT,
      `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`
    );
}
function sg(e) {
  if (void 0 === e) return 'undefined';
  if (null === e) return 'null';
  if ('string' == typeof e)
    return (e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e));
  if ('number' == typeof e || 'boolean' == typeof e) return '' + e;
  if ('object' == typeof e) {
    if (e instanceof Array) return 'an array';
    {
      const t = (function (e) {
        return e.constructor ? e.constructor.name : null;
      })(e);
      return t ? `a custom ${t} object` : 'an object';
    }
  }
  return 'function' == typeof e ? 'a function' : co();
}
function og(e, t) {
  if (('_delegate' in e && (e = e._delegate), !(e instanceof t))) {
    if (t.name === e.constructor.name)
      throw new fo(
        ho.INVALID_ARGUMENT,
        'Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?'
      );
    {
      const n = sg(e);
      throw new fo(ho.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
    }
  }
  return e;
}
class ag {
  constructor(e) {
    var t, n;
    if (void 0 === e.host) {
      if (void 0 !== e.ssl)
        throw new fo(ho.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      ((this.host = 'firestore.googleapis.com'), (this.ssl = !0));
    } else ((this.host = e.host), (this.ssl = null === (t = e.ssl) || void 0 === t || t));
    if (
      ((this.credentials = e.credentials),
      (this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties),
      (this.localCache = e.localCache),
      void 0 === e.cacheSizeBytes)
    )
      this.cacheSizeBytes = 41943040;
    else {
      if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < 1048576)
        throw new fo(ho.INVALID_ARGUMENT, 'cacheSizeBytes must be at least 1048576');
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    ((function (e, t, n, r) {
      if (!0 === t && !0 === r)
        throw new fo(
          ho.INVALID_ARGUMENT,
          'experimentalForceLongPolling and experimentalAutoDetectLongPolling cannot be used together.'
        );
    })(0, e.experimentalForceLongPolling, 0, e.experimentalAutoDetectLongPolling),
      (this.experimentalForceLongPolling = !!e.experimentalForceLongPolling),
      this.experimentalForceLongPolling
        ? (this.experimentalAutoDetectLongPolling = !1)
        : void 0 === e.experimentalAutoDetectLongPolling
          ? (this.experimentalAutoDetectLongPolling = !0)
          : (this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling),
      (this.experimentalLongPollingOptions = eg(
        null !== (n = e.experimentalLongPollingOptions) && void 0 !== n ? n : {}
      )),
      (function (e) {
        if (void 0 !== e.timeoutSeconds) {
          if (isNaN(e.timeoutSeconds))
            throw new fo(
              ho.INVALID_ARGUMENT,
              `invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`
            );
          if (e.timeoutSeconds < 5)
            throw new fo(
              ho.INVALID_ARGUMENT,
              `invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`
            );
          if (e.timeoutSeconds > 30)
            throw new fo(
              ho.INVALID_ARGUMENT,
              `invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`
            );
        }
      })(this.experimentalLongPollingOptions),
      (this.useFetchStreams = !!e.useFetchStreams));
  }
  isEqual(e) {
    return (
      this.host === e.host &&
      this.ssl === e.ssl &&
      this.credentials === e.credentials &&
      this.cacheSizeBytes === e.cacheSizeBytes &&
      this.experimentalForceLongPolling === e.experimentalForceLongPolling &&
      this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling &&
      (function (e, t) {
        return e.timeoutSeconds === t.timeoutSeconds;
      })(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) &&
      this.ignoreUndefinedProperties === e.ignoreUndefinedProperties &&
      this.useFetchStreams === e.useFetchStreams
    );
  }
}
class cg {
  constructor(e, t, n, r) {
    ((this._authCredentials = e),
      (this._appCheckCredentials = t),
      (this._databaseId = n),
      (this._app = r),
      (this.type = 'firestore-lite'),
      (this._persistenceKey = '(lite)'),
      (this._settings = new ag({})),
      (this._settingsFrozen = !1));
  }
  get app() {
    if (!this._app)
      throw new fo(
        ho.FAILED_PRECONDITION,
        "Firestore was not initialized using the Firebase SDK. 'app' is not available"
      );
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return void 0 !== this._terminateTask;
  }
  _setSettings(e) {
    if (this._settingsFrozen)
      throw new fo(
        ho.FAILED_PRECONDITION,
        'Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.'
      );
    ((this._settings = new ag(e)),
      void 0 !== e.credentials &&
        (this._authCredentials = (function (e) {
          if (!e) return new mo();
          switch (e.type) {
            case 'firstParty':
              return new vo(e.sessionIndex || '0', e.iamToken || null, e.authTokenFactory || null);
            case 'provider':
              return e.client;
            default:
              throw new fo(
                ho.INVALID_ARGUMENT,
                'makeAuthCredentialsProvider failed due to invalid credential type'
              );
          }
        })(e.credentials)));
  }
  _getSettings() {
    return this._settings;
  }
  _freezeSettings() {
    return ((this._settingsFrozen = !0), this._settings);
  }
  _delete() {
    return (this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask);
  }
  toJSON() {
    return { app: this._app, databaseId: this._databaseId, settings: this._settings };
  }
  _terminate() {
    return (
      (function (e) {
        const t = tg.get(e);
        t && (io('ComponentProvider', 'Removing Datastore'), tg.delete(e), t.terminate());
      })(this),
      Promise.resolve()
    );
  }
}
class ug {
  constructor(e, t, n) {
    ((this.converter = t), (this._query = n), (this.type = 'query'), (this.firestore = e));
  }
  withConverter(e) {
    return new ug(this.firestore, e, this._query);
  }
}
class lg {
  constructor(e, t, n) {
    ((this.converter = t), (this._key = n), (this.type = 'document'), (this.firestore = e));
  }
  get _path() {
    return this._key.path;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get path() {
    return this._key.path.canonicalString();
  }
  get parent() {
    return new hg(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new lg(this.firestore, e, this._key);
  }
}
class hg extends ug {
  constructor(e, t, n) {
    (super(e, t, ou(n)), (this._path = n), (this.type = 'collection'));
  }
  get id() {
    return this._query.path.lastSegment();
  }
  get path() {
    return this._query.path.canonicalString();
  }
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new lg(this.firestore, null, new Ro(e));
  }
  withConverter(e) {
    return new hg(this.firestore, e, this._path);
  }
}
function dg(e, t, ...n) {
  if (((e = De(e)), ng('collection', 'path', t), e instanceof cg)) {
    const r = xo.fromString(t, ...n);
    return (ig(r), new hg(e, null, r));
  }
  {
    if (!(e instanceof lg || e instanceof hg))
      throw new fo(
        ho.INVALID_ARGUMENT,
        'Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore'
      );
    const r = e._path.child(xo.fromString(t, ...n));
    return (ig(r), new hg(e.firestore, null, r));
  }
}
function fg(e, t, ...n) {
  if (
    ((e = De(e)), 1 === arguments.length && (t = _o.newId()), ng('doc', 'path', t), e instanceof cg)
  ) {
    const r = xo.fromString(t, ...n);
    return (rg(r), new lg(e, null, new Ro(r)));
  }
  {
    if (!(e instanceof lg || e instanceof hg))
      throw new fo(
        ho.INVALID_ARGUMENT,
        'Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore'
      );
    const r = e._path.child(xo.fromString(t, ...n));
    return (rg(r), new lg(e.firestore, e instanceof hg ? e.converter : null, new Ro(r)));
  }
}
class pg {
  constructor() {
    ((this.nu = Promise.resolve()),
      (this.ru = []),
      (this.iu = !1),
      (this.su = []),
      (this.ou = null),
      (this._u = !1),
      (this.au = !1),
      (this.uu = []),
      (this.jo = new If(this, 'async_queue_retry')),
      (this.cu = () => {
        const e = vf();
        (e && io('AsyncQueue', 'Visibility state changed to ' + e.visibilityState), this.jo.Ko());
      }));
    const e = vf();
    e && 'function' == typeof e.addEventListener && e.addEventListener('visibilitychange', this.cu);
  }
  get isShuttingDown() {
    return this.iu;
  }
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    (this.lu(), this.hu(e));
  }
  enterRestrictedMode(e) {
    if (!this.iu) {
      ((this.iu = !0), (this.au = e || !1));
      const t = vf();
      t &&
        'function' == typeof t.removeEventListener &&
        t.removeEventListener('visibilitychange', this.cu);
    }
  }
  enqueue(e) {
    if ((this.lu(), this.iu)) return new Promise(() => {});
    const t = new po();
    return this.hu(() =>
      this.iu && this.au ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)
    ).then(() => t.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.ru.push(e), this.Pu()));
  }
  async Pu() {
    if (0 !== this.ru.length) {
      try {
        (await this.ru[0](), this.ru.shift(), this.jo.reset());
      } catch (e) {
        if (!Yo(e)) throw e;
        io('AsyncQueue', 'Operation failed with retryable error: ' + e);
      }
      this.ru.length > 0 && this.jo.qo(() => this.Pu());
    }
  }
  hu(e) {
    const t = this.nu.then(
      () => (
        (this._u = !0),
        e()
          .catch(e => {
            ((this.ou = e), (this._u = !1));
            const t = (function (e) {
              let t = e.message || '';
              return (
                e.stack && (t = e.stack.includes(e.message) ? e.stack : e.message + '\n' + e.stack),
                t
              );
            })(e);
            throw (so('INTERNAL UNHANDLED ERROR: ', t), e);
          })
          .then(e => ((this._u = !1), e))
      )
    );
    return ((this.nu = t), t);
  }
  enqueueAfterDelay(e, t, n) {
    (this.lu(), this.uu.indexOf(e) > -1 && (t = 0));
    const r = tp.createAndSchedule(this, e, t, n, e => this.Iu(e));
    return (this.su.push(r), r);
  }
  lu() {
    this.ou && co();
  }
  verifyOperationInProgress() {}
  async Tu() {
    let e;
    do {
      ((e = this.nu), await e);
    } while (e !== this.nu);
  }
  Eu(e) {
    for (const t of this.su) if (t.timerId === e) return !0;
    return !1;
  }
  du(e) {
    return this.Tu().then(() => {
      this.su.sort((e, t) => e.targetTimeMs - t.targetTimeMs);
      for (const t of this.su) if ((t.skipDelay(), 'all' !== e && t.timerId === e)) break;
      return this.Tu();
    });
  }
  Au(e) {
    this.uu.push(e);
  }
  Iu(e) {
    const t = this.su.indexOf(e);
    this.su.splice(t, 1);
  }
}
function gg(e) {
  return (function (e, t) {
    if ('object' != typeof e || null === e) return !1;
    const n = e;
    for (const e of ['next', 'error', 'complete'])
      if (e in n && 'function' == typeof n[e]) return !0;
    return !1;
  })(e);
}
class mg extends cg {
  constructor(e, t, n, r) {
    (super(e, t, n, r),
      (this.type = 'firestore'),
      (this._queue = new pg()),
      (this._persistenceKey = (null == r ? void 0 : r.name) || '[DEFAULT]'));
  }
  _terminate() {
    return (this._firestoreClient || wg(this), this._firestoreClient.terminate());
  }
}
function yg(e) {
  return (
    e._firestoreClient || wg(e),
    e._firestoreClient.verifyNotTerminated(),
    e._firestoreClient
  );
}
function wg(e) {
  var t, n, r;
  const i = e._freezeSettings(),
    s = (function (e, t, n, r) {
      return new tc(
        e,
        t,
        n,
        r.host,
        r.ssl,
        r.experimentalForceLongPolling,
        r.experimentalAutoDetectLongPolling,
        eg(r.experimentalLongPollingOptions),
        r.useFetchStreams
      );
    })(
      e._databaseId,
      (null === (t = e._app) || void 0 === t ? void 0 : t.options.appId) || '',
      e._persistenceKey,
      i
    );
  ((e._firestoreClient = new Hp(e._authCredentials, e._appCheckCredentials, e._queue, s)),
    (null === (n = i.localCache) || void 0 === n ? void 0 : n._offlineComponentProvider) &&
      (null === (r = i.localCache) || void 0 === r ? void 0 : r._onlineComponentProvider) &&
      (e._firestoreClient._uninitializedComponentsProvider = {
        _offlineKind: i.localCache.kind,
        _offline: i.localCache._offlineComponentProvider,
        _online: i.localCache._onlineComponentProvider,
      }));
}
class vg {
  constructor(e) {
    this._byteString = e;
  }
  static fromBase64String(e) {
    try {
      return new vg(Wa.fromBase64String(e));
    } catch (e) {
      throw new fo(ho.INVALID_ARGUMENT, 'Failed to construct data from Base64 string: ' + e);
    }
  }
  static fromUint8Array(e) {
    return new vg(Wa.fromUint8Array(e));
  }
  toBase64() {
    return this._byteString.toBase64();
  }
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  toString() {
    return 'Bytes(base64: ' + this.toBase64() + ')';
  }
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
}
class bg {
  constructor(...e) {
    for (let t = 0; t < e.length; ++t)
      if (0 === e[t].length)
        throw new fo(
          ho.INVALID_ARGUMENT,
          'Invalid field name at argument $(i + 1). Field names must not be empty.'
        );
    this._internalPath = new Oo(e);
  }
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
}
class Ig {
  constructor(e) {
    this._methodName = e;
  }
}
class Tg {
  constructor(e, t) {
    if (!isFinite(e) || e < -90 || e > 90)
      throw new fo(
        ho.INVALID_ARGUMENT,
        'Latitude must be a number between -90 and 90, but was: ' + e
      );
    if (!isFinite(t) || t < -180 || t > 180)
      throw new fo(
        ho.INVALID_ARGUMENT,
        'Longitude must be a number between -180 and 180, but was: ' + t
      );
    ((this._lat = e), (this._long = t));
  }
  get latitude() {
    return this._lat;
  }
  get longitude() {
    return this._long;
  }
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  toJSON() {
    return { latitude: this._lat, longitude: this._long };
  }
  _compareTo(e) {
    return Eo(this._lat, e._lat) || Eo(this._long, e._long);
  }
}
const _g = /^__.*__$/;
class Eg {
  constructor(e, t, n) {
    ((this.data = e), (this.fieldMask = t), (this.fieldTransforms = n));
  }
  toMutation(e, t) {
    return null !== this.fieldMask
      ? new il(e, this.data, this.fieldMask, t, this.fieldTransforms)
      : new rl(e, this.data, t, this.fieldTransforms);
  }
}
class Sg {
  constructor(e, t, n) {
    ((this.data = e), (this.fieldMask = t), (this.fieldTransforms = n));
  }
  toMutation(e, t) {
    return new il(e, this.data, this.fieldMask, t, this.fieldTransforms);
  }
}
function Cg(e) {
  switch (e) {
    case 0:
    case 2:
    case 1:
      return !0;
    case 3:
    case 4:
      return !1;
    default:
      throw co();
  }
}
class Ag {
  constructor(e, t, n, r, i, s) {
    ((this.settings = e),
      (this.databaseId = t),
      (this.serializer = n),
      (this.ignoreUndefinedProperties = r),
      void 0 === i && this.Ru(),
      (this.fieldTransforms = i || []),
      (this.fieldMask = s || []));
  }
  get path() {
    return this.settings.path;
  }
  get Vu() {
    return this.settings.Vu;
  }
  mu(e) {
    return new Ag(
      Object.assign(Object.assign({}, this.settings), e),
      this.databaseId,
      this.serializer,
      this.ignoreUndefinedProperties,
      this.fieldTransforms,
      this.fieldMask
    );
  }
  fu(e) {
    var t;
    const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e),
      r = this.mu({ path: n, gu: !1 });
    return (r.pu(e), r);
  }
  yu(e) {
    var t;
    const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e),
      r = this.mu({ path: n, gu: !1 });
    return (r.Ru(), r);
  }
  wu(e) {
    return this.mu({ path: void 0, gu: !0 });
  }
  Su(e) {
    return Bg(e, this.settings.methodName, this.settings.bu || !1, this.path, this.settings.Du);
  }
  contains(e) {
    return (
      void 0 !== this.fieldMask.find(t => e.isPrefixOf(t)) ||
      void 0 !== this.fieldTransforms.find(t => e.isPrefixOf(t.field))
    );
  }
  Ru() {
    if (this.path) for (let e = 0; e < this.path.length; e++) this.pu(this.path.get(e));
  }
  pu(e) {
    if (0 === e.length) throw this.Su('Document fields must not be empty');
    if (Cg(this.Vu) && _g.test(e)) throw this.Su('Document fields cannot begin and end with "__"');
  }
}
class kg {
  constructor(e, t, n) {
    ((this.databaseId = e), (this.ignoreUndefinedProperties = t), (this.serializer = n || bf(e)));
  }
  Cu(e, t, n, r = !1) {
    return new Ag(
      { Vu: e, methodName: t, Du: n, path: Oo.emptyPath(), gu: !1, bu: r },
      this.databaseId,
      this.serializer,
      this.ignoreUndefinedProperties
    );
  }
}
function Dg(e) {
  const t = e._freezeSettings(),
    n = bf(e._databaseId);
  return new kg(e._databaseId, !!t.ignoreUndefinedProperties, n);
}
function xg(e, t, n, r, i, s = {}) {
  const o = e.Cu(s.merge || s.mergeFields ? 2 : 0, t, n, i);
  Lg('Data must be an object, but it was:', o, r);
  const a = Pg(r, o);
  let c, u;
  if (s.merge) ((c = new $a(o.fieldMask)), (u = o.fieldTransforms));
  else if (s.mergeFields) {
    const e = [];
    for (const r of s.mergeFields) {
      const i = Fg(t, r, n);
      if (!o.contains(i))
        throw new fo(
          ho.INVALID_ARGUMENT,
          `Field '${i}' is specified in your field mask but missing from your input data.`
        );
      jg(e, i) || e.push(i);
    }
    ((c = new $a(e)), (u = o.fieldTransforms.filter(e => c.covers(e.field))));
  } else ((c = null), (u = o.fieldTransforms));
  return new Eg(new Ec(a), c, u);
}
class Ng extends Ig {
  _toFieldTransform(e) {
    if (2 !== e.Vu)
      throw 1 === e.Vu
        ? e.Su(`${this._methodName}() can only appear at the top level of your update data`)
        : e.Su(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
    return (e.fieldMask.push(e.path), null);
  }
  isEqual(e) {
    return e instanceof Ng;
  }
}
class Og extends Ig {
  _toFieldTransform(e) {
    return new Wu(e.path, new Vu());
  }
  isEqual(e) {
    return e instanceof Og;
  }
}
function Rg(e, t) {
  if (Mg((e = De(e)))) return (Lg('Unsupported field value:', t, e), Pg(e, t));
  if (e instanceof Ig)
    return (
      (function (e, t) {
        if (!Cg(t.Vu)) throw t.Su(`${e._methodName}() can only be used with update() and set()`);
        if (!t.path) throw t.Su(`${e._methodName}() is not currently supported inside arrays`);
        const n = e._toFieldTransform(t);
        n && t.fieldTransforms.push(n);
      })(e, t),
      null
    );
  if (void 0 === e && t.ignoreUndefinedProperties) return null;
  if ((t.path && t.fieldMask.push(t.path), e instanceof Array)) {
    if (t.settings.gu && 4 !== t.Vu) throw t.Su('Nested arrays are not supported');
    return (function (e, t) {
      const n = [];
      let r = 0;
      for (const i of e) {
        let e = Rg(i, t.wu(r));
        (null == e && (e = { nullValue: 'NULL_VALUE' }), n.push(e), r++);
      }
      return { arrayValue: { values: n } };
    })(e, t);
  }
  return (function (e, t) {
    if (null === (e = De(e))) return { nullValue: 'NULL_VALUE' };
    if ('number' == typeof e) return Pu(t.serializer, e);
    if ('boolean' == typeof e) return { booleanValue: e };
    if ('string' == typeof e) return { stringValue: e };
    if (e instanceof Date) {
      const n = Ao.fromDate(e);
      return { timestampValue: Ll(t.serializer, n) };
    }
    if (e instanceof Ao) {
      const n = new Ao(e.seconds, 1e3 * Math.floor(e.nanoseconds / 1e3));
      return { timestampValue: Ll(t.serializer, n) };
    }
    if (e instanceof Tg) return { geoPointValue: { latitude: e.latitude, longitude: e.longitude } };
    if (e instanceof vg) return { bytesValue: Fl(t.serializer, e._byteString) };
    if (e instanceof lg) {
      const n = t.databaseId,
        r = e.firestore._databaseId;
      if (!r.isEqual(n))
        throw t.Su(
          `Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`
        );
      return { referenceValue: Bl(e.firestore._databaseId || t.databaseId, e._key.path) };
    }
    throw t.Su(`Unsupported field value: ${sg(e)}`);
  })(e, t);
}
function Pg(e, t) {
  const n = {};
  return (
    Ua(e)
      ? t.path && t.path.length > 0 && t.fieldMask.push(t.path)
      : Fa(e, (e, r) => {
          const i = Rg(r, t.fu(e));
          null != i && (n[e] = i);
        }),
    { mapValue: { fields: n } }
  );
}
function Mg(e) {
  return !(
    'object' != typeof e ||
    null === e ||
    e instanceof Array ||
    e instanceof Date ||
    e instanceof Ao ||
    e instanceof Tg ||
    e instanceof vg ||
    e instanceof lg ||
    e instanceof Ig
  );
}
function Lg(e, t, n) {
  if (
    !Mg(n) ||
    !(function (e) {
      return (
        'object' == typeof e &&
        null !== e &&
        (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e))
      );
    })(n)
  ) {
    const r = sg(n);
    throw 'an object' === r ? t.Su(e + ' a custom object') : t.Su(e + ' ' + r);
  }
}
function Fg(e, t, n) {
  if ((t = De(t)) instanceof bg) return t._internalPath;
  if ('string' == typeof t) return Vg(e, t);
  throw Bg('Field path arguments must be of type string or ', e, !1, void 0, n);
}
const Ug = new RegExp('[~\\*/\\[\\]]');
function Vg(e, t, n) {
  if (t.search(Ug) >= 0)
    throw Bg(
      `Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,
      e,
      !1,
      void 0,
      n
    );
  try {
    return new bg(...t.split('.'))._internalPath;
  } catch (r) {
    throw Bg(
      `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      e,
      !1,
      void 0,
      n
    );
  }
}
function Bg(e, t, n, r, i) {
  const s = r && !r.isEmpty(),
    o = void 0 !== i;
  let a = `Function ${t}() called with invalid data`;
  (n && (a += ' (via `toFirestore()`)'), (a += '. '));
  let c = '';
  return (
    (s || o) &&
      ((c += ' (found'), s && (c += ` in field ${r}`), o && (c += ` in document ${i}`), (c += ')')),
    new fo(ho.INVALID_ARGUMENT, a + e + c)
  );
}
function jg(e, t) {
  return e.some(e => e.isEqual(t));
}
class zg {
  constructor(e, t, n, r, i) {
    ((this._firestore = e),
      (this._userDataWriter = t),
      (this._key = n),
      (this._document = r),
      (this._converter = i));
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get ref() {
    return new lg(this._firestore, this._converter, this._key);
  }
  exists() {
    return null !== this._document;
  }
  data() {
    if (this._document) {
      if (this._converter) {
        const e = new qg(this._firestore, this._userDataWriter, this._key, this._document, null);
        return this._converter.fromFirestore(e);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  get(e) {
    if (this._document) {
      const t = this._document.data.field(Gg('DocumentSnapshot.get', e));
      if (null !== t) return this._userDataWriter.convertValue(t);
    }
  }
}
class qg extends zg {
  data() {
    return super.data();
  }
}
function Gg(e, t) {
  return 'string' == typeof t
    ? Vg(e, t)
    : t instanceof bg
      ? t._internalPath
      : t._delegate._internalPath;
}
function $g(e) {
  if ('L' === e.limitType && 0 === e.explicitOrderBy.length)
    throw new fo(
      ho.UNIMPLEMENTED,
      'limitToLast() queries require specifying at least one orderBy() clause'
    );
}
class Kg {}
class Wg extends Kg {}
class Hg extends Wg {
  constructor(e, t, n) {
    (super(), (this._field = e), (this._op = t), (this._value = n), (this.type = 'where'));
  }
  static _create(e, t, n) {
    return new Hg(e, t, n);
  }
  _apply(e) {
    const t = this._parse(e);
    return (em(e._query, t), new ug(e.firestore, e.converter, hu(e._query, t)));
  }
  _parse(e) {
    const t = Dg(e.firestore),
      n = (function (e, t, n, r, i, s, o) {
        let a;
        if (i.isKeyField()) {
          if ('array-contains' === s || 'array-contains-any' === s)
            throw new fo(
              ho.INVALID_ARGUMENT,
              `Invalid Query. You can't perform '${s}' queries on documentId().`
            );
          if ('in' === s || 'not-in' === s) {
            Zg(o, s);
            const t = [];
            for (const n of o) t.push(Jg(r, e, n));
            a = { arrayValue: { values: t } };
          } else a = Jg(r, e, o);
        } else
          (('in' !== s && 'not-in' !== s && 'array-contains-any' !== s) || Zg(o, s),
            (a = (function (e, t, n, r = !1) {
              return Rg(n, e.Cu(r ? 4 : 3, t));
            })(n, 'where', o, 'in' === s || 'not-in' === s)));
        return Rc.create(i, s, a);
      })(e._query, 0, t, e.firestore._databaseId, this._field, this._op, this._value);
    return n;
  }
}
class Qg extends Kg {
  constructor(e, t) {
    (super(), (this.type = e), (this._queryConstraints = t));
  }
  static _create(e, t) {
    return new Qg(e, t);
  }
  _parse(e) {
    const t = this._queryConstraints.map(t => t._parse(e)).filter(e => e.getFilters().length > 0);
    return 1 === t.length ? t[0] : Pc.create(t, this._getOperator());
  }
  _apply(e) {
    const t = this._parse(e);
    return 0 === t.getFilters().length
      ? e
      : ((function (e, t) {
          let n = e;
          const r = t.getFlattenedFilters();
          for (const e of r) (em(n, e), (n = hu(n, e)));
        })(e._query, t),
        new ug(e.firestore, e.converter, hu(e._query, t)));
  }
  _getQueryConstraints() {
    return this._queryConstraints;
  }
  _getOperator() {
    return 'and' === this.type ? 'and' : 'or';
  }
}
class Yg extends Wg {
  constructor(e, t) {
    (super(), (this._field = e), (this._direction = t), (this.type = 'orderBy'));
  }
  static _create(e, t) {
    return new Yg(e, t);
  }
  _apply(e) {
    const t = (function (e, t, n) {
      if (null !== e.startAt)
        throw new fo(
          ho.INVALID_ARGUMENT,
          'Invalid query. You must not call startAt() or startAfter() before calling orderBy().'
        );
      if (null !== e.endAt)
        throw new fo(
          ho.INVALID_ARGUMENT,
          'Invalid query. You must not call endAt() or endBefore() before calling orderBy().'
        );
      return new xc(t, n);
    })(e._query, this._field, this._direction);
    return new ug(
      e.firestore,
      e.converter,
      (function (e, t) {
        const n = e.explicitOrderBy.concat([t]);
        return new su(
          e.path,
          e.collectionGroup,
          n,
          e.filters.slice(),
          e.limit,
          e.limitType,
          e.startAt,
          e.endAt
        );
      })(e._query, t)
    );
  }
}
class Xg extends Wg {
  constructor(e, t, n) {
    (super(), (this.type = e), (this._limit = t), (this._limitType = n));
  }
  static _create(e, t, n) {
    return new Xg(e, t, n);
  }
  _apply(e) {
    return new ug(e.firestore, e.converter, du(e._query, this._limit, this._limitType));
  }
}
function Jg(e, t, n) {
  if ('string' == typeof (n = De(n))) {
    if ('' === n)
      throw new fo(
        ho.INVALID_ARGUMENT,
        'Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.'
      );
    if (!cu(t) && -1 !== n.indexOf('/'))
      throw new fo(
        ho.INVALID_ARGUMENT,
        `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`
      );
    const r = t.path.child(xo.fromString(n));
    if (!Ro.isDocumentKey(r))
      throw new fo(
        ho.INVALID_ARGUMENT,
        `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`
      );
    return dc(e, new Ro(r));
  }
  if (n instanceof lg) return dc(e, n._key);
  throw new fo(
    ho.INVALID_ARGUMENT,
    `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${sg(
      n
    )}.`
  );
}
function Zg(e, t) {
  if (!Array.isArray(e) || 0 === e.length)
    throw new fo(
      ho.INVALID_ARGUMENT,
      `Invalid Query. A non-empty array is required for '${t.toString()}' filters.`
    );
}
function em(e, t) {
  const n = (function (e, t) {
    for (const n of e)
      for (const e of n.getFlattenedFilters()) if (t.indexOf(e.op) >= 0) return e.op;
    return null;
  })(
    e.filters,
    (function (e) {
      switch (e) {
        case '!=':
          return ['!=', 'not-in'];
        case 'array-contains-any':
        case 'in':
          return ['not-in'];
        case 'not-in':
          return ['array-contains-any', 'in', 'not-in', '!='];
        default:
          return [];
      }
    })(t.op)
  );
  if (null !== n)
    throw n === t.op
      ? new fo(
          ho.INVALID_ARGUMENT,
          `Invalid query. You cannot use more than one '${t.op.toString()}' filter.`
        )
      : new fo(
          ho.INVALID_ARGUMENT,
          `Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`
        );
}
function tm(e, t, n) {
  let r;
  return (
    (r = e ? (n && (n.merge || n.mergeFields) ? e.toFirestore(t, n) : e.toFirestore(t)) : t),
    r
  );
}
class nm {
  constructor(e, t) {
    ((this.hasPendingWrites = e), (this.fromCache = t));
  }
  isEqual(e) {
    return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
  }
}
class rm extends zg {
  constructor(e, t, n, r, i, s) {
    (super(e, t, n, r, s), (this._firestore = e), (this._firestoreImpl = e), (this.metadata = i));
  }
  exists() {
    return super.exists();
  }
  data(e = {}) {
    if (this._document) {
      if (this._converter) {
        const t = new im(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          this.metadata,
          null
        );
        return this._converter.fromFirestore(t, e);
      }
      return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
    }
  }
  get(e, t = {}) {
    if (this._document) {
      const n = this._document.data.field(Gg('DocumentSnapshot.get', e));
      if (null !== n) return this._userDataWriter.convertValue(n, t.serverTimestamps);
    }
  }
}
class im extends rm {
  data(e = {}) {
    return super.data(e);
  }
}
class sm {
  constructor(e, t, n, r) {
    ((this._firestore = e),
      (this._userDataWriter = t),
      (this._snapshot = r),
      (this.metadata = new nm(r.hasPendingWrites, r.fromCache)),
      (this.query = n));
  }
  get docs() {
    const e = [];
    return (this.forEach(t => e.push(t)), e);
  }
  get size() {
    return this._snapshot.docs.size;
  }
  get empty() {
    return 0 === this.size;
  }
  forEach(e, t) {
    this._snapshot.docs.forEach(n => {
      e.call(
        t,
        new im(
          this._firestore,
          this._userDataWriter,
          n.key,
          n,
          new nm(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache),
          this.query.converter
        )
      );
    });
  }
  docChanges(e = {}) {
    const t = !!e.includeMetadataChanges;
    if (t && this._snapshot.excludesMetadataChanges)
      throw new fo(
        ho.INVALID_ARGUMENT,
        'To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().'
      );
    return (
      (this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t) ||
        ((this._cachedChanges = (function (e, t) {
          if (e._snapshot.oldDocs.isEmpty()) {
            let t = 0;
            return e._snapshot.docChanges.map(n => {
              const r = new im(
                e._firestore,
                e._userDataWriter,
                n.doc.key,
                n.doc,
                new nm(e._snapshot.mutatedKeys.has(n.doc.key), e._snapshot.fromCache),
                e.query.converter
              );
              return (n.doc, { type: 'added', doc: r, oldIndex: -1, newIndex: t++ });
            });
          }
          {
            let n = e._snapshot.oldDocs;
            return e._snapshot.docChanges
              .filter(e => t || 3 !== e.type)
              .map(t => {
                const r = new im(
                  e._firestore,
                  e._userDataWriter,
                  t.doc.key,
                  t.doc,
                  new nm(e._snapshot.mutatedKeys.has(t.doc.key), e._snapshot.fromCache),
                  e.query.converter
                );
                let i = -1,
                  s = -1;
                return (
                  0 !== t.type && ((i = n.indexOf(t.doc.key)), (n = n.delete(t.doc.key))),
                  1 !== t.type && ((n = n.add(t.doc)), (s = n.indexOf(t.doc.key))),
                  { type: om(t.type), doc: r, oldIndex: i, newIndex: s }
                );
              });
          }
        })(this, t)),
        (this._cachedChangesIncludeMetadataChanges = t)),
      this._cachedChanges
    );
  }
}
function om(e) {
  switch (e) {
    case 0:
      return 'added';
    case 2:
    case 3:
      return 'modified';
    case 1:
      return 'removed';
    default:
      return co();
  }
}
class am extends class {
  convertValue(e, t = 'none') {
    switch (sc(e)) {
      case 0:
        return null;
      case 1:
        return e.booleanValue;
      case 2:
        return Ya(e.integerValue || e.doubleValue);
      case 3:
        return this.convertTimestamp(e.timestampValue);
      case 4:
        return this.convertServerTimestamp(e, t);
      case 5:
        return e.stringValue;
      case 6:
        return this.convertBytes(Xa(e.bytesValue));
      case 7:
        return this.convertReference(e.referenceValue);
      case 8:
        return this.convertGeoPoint(e.geoPointValue);
      case 9:
        return this.convertArray(e.arrayValue, t);
      case 10:
        return this.convertObject(e.mapValue, t);
      default:
        throw co();
    }
  }
  convertObject(e, t) {
    return this.convertObjectMap(e.fields, t);
  }
  convertObjectMap(e, t = 'none') {
    const n = {};
    return (
      Fa(e, (e, r) => {
        n[e] = this.convertValue(r, t);
      }),
      n
    );
  }
  convertGeoPoint(e) {
    return new Tg(Ya(e.latitude), Ya(e.longitude));
  }
  convertArray(e, t) {
    return (e.values || []).map(e => this.convertValue(e, t));
  }
  convertServerTimestamp(e, t) {
    switch (t) {
      case 'previous':
        const n = Za(e);
        return null == n ? null : this.convertValue(n, t);
      case 'estimate':
        return this.convertTimestamp(ec(e));
      default:
        return null;
    }
  }
  convertTimestamp(e) {
    const t = Qa(e);
    return new Ao(t.seconds, t.nanos);
  }
  convertDocumentKey(e, t) {
    const n = xo.fromString(e);
    uo(uh(n));
    const r = new nc(n.get(1), n.get(3)),
      i = new Ro(n.popFirst(5));
    return (
      r.isEqual(t) ||
        so(
          `Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`
        ),
      i
    );
  }
} {
  constructor(e) {
    (super(), (this.firestore = e));
  }
  convertBytes(e) {
    return new vg(e);
  }
  convertReference(e) {
    const t = this.convertDocumentKey(e, this.firestore._databaseId);
    return new lg(this.firestore, null, t);
  }
}
function cm(e, ...t) {
  var n, r, i;
  e = De(e);
  let s = { includeMetadataChanges: !1, source: 'default' },
    o = 0;
  'object' != typeof t[o] || gg(t[o]) || ((s = t[o]), o++);
  const a = { includeMetadataChanges: s.includeMetadataChanges, source: s.source };
  if (gg(t[o])) {
    const e = t[o];
    ((t[o] = null === (n = e.next) || void 0 === n ? void 0 : n.bind(e)),
      (t[o + 1] = null === (r = e.error) || void 0 === r ? void 0 : r.bind(e)),
      (t[o + 2] = null === (i = e.complete) || void 0 === i ? void 0 : i.bind(e)));
  }
  let c, u, l;
  if (e instanceof lg)
    ((u = og(e.firestore, mg)),
      (l = ou(e._key.path)),
      (c = {
        next: n => {
          t[o] && t[o](lm(u, e, n));
        },
        error: t[o + 1],
        complete: t[o + 2],
      }));
  else {
    const n = og(e, ug);
    ((u = og(n.firestore, mg)), (l = n._query));
    const r = new am(u);
    ((c = {
      next: e => {
        t[o] && t[o](new sm(u, r, n, e));
      },
      error: t[o + 1],
      complete: t[o + 2],
    }),
      $g(e._query));
  }
  return (function (e, t, n, r) {
    const i = new Wp(r),
      s = new gp(t, i, n);
    return (
      e.asyncQueue.enqueueAndForget(async () => cp(await Zp(e), s)),
      () => {
        (i.Qa(), e.asyncQueue.enqueueAndForget(async () => up(await Zp(e), s)));
      }
    );
  })(yg(u), l, a, c);
}
function um(e, t) {
  return (function (e, t) {
    const n = new po();
    return (
      e.asyncQueue.enqueueAndForget(async () =>
        (async function (e, t, n) {
          const r = qp(e);
          try {
            const e = await (function (e, t) {
              const n = lo(e),
                r = Ao.now(),
                i = t.reduce((e, t) => e.add(t.key), xu());
              let s, o;
              return n.persistence
                .runTransaction('Locally write mutations', 'readwrite', e => {
                  let a = Iu(),
                    c = xu();
                  return n.os
                    .getEntries(e, i)
                    .next(e => {
                      ((a = e),
                        a.forEach((e, t) => {
                          t.isValidDocument() || (c = c.add(e));
                        }));
                    })
                    .next(() => n.localDocuments.getOverlayedDocuments(e, a))
                    .next(i => {
                      s = i;
                      const o = [];
                      for (const e of t) {
                        const t = tl(e, s.get(e.key).overlayedDocument);
                        null != t && o.push(new il(e.key, t, Sc(t.value.mapValue), Qu.exists(!0)));
                      }
                      return n.mutationQueue.addMutationBatch(e, r, o, t);
                    })
                    .next(t => {
                      o = t;
                      const r = t.applyToLocalDocumentSet(s, c);
                      return n.documentOverlayCache.saveOverlays(e, t.batchId, r);
                    });
                })
                .then(() => ({ batchId: o.batchId, changes: Eu(s) }));
            })(r.localStore, t);
            (r.sharedClientState.addPendingMutation(e.batchId),
              (function (e, t, n) {
                let r = e.Fa[e.currentUser.toKey()];
                (r || (r = new Va(Eo)), (r = r.insert(t, n)), (e.Fa[e.currentUser.toKey()] = r));
              })(r, e.batchId, n),
              await Vp(r, e.changes),
              await qf(r.remoteStore));
          } catch (e) {
            const t = np(e, 'Failed to persist write');
            n.reject(t);
          }
        })(await Jp(e), t, n)
      ),
      n.promise
    );
  })(yg(e), t);
}
function lm(e, t, n) {
  const r = n.docs.get(t._key),
    i = new am(e);
  return new rm(e, i, t._key, r, new nm(n.hasPendingWrites, n.fromCache), t.converter);
}
class hm {
  constructor(e) {
    let t;
    ((this.kind = 'persistent'),
      (null == e ? void 0 : e.tabManager)
        ? (e.tabManager._initialize(e), (t = e.tabManager))
        : ((t = fm(void 0)), t._initialize(e)),
      (this._onlineComponentProvider = t._onlineComponentProvider),
      (this._offlineComponentProvider = t._offlineComponentProvider));
  }
  toJSON() {
    return { kind: this.kind };
  }
}
class dm {
  constructor(e) {
    ((this.forceOwnership = e), (this.kind = 'persistentSingleTab'));
  }
  toJSON() {
    return { kind: this.kind };
  }
  _initialize(e) {
    ((this._onlineComponentProvider = new Kp()),
      (this._offlineComponentProvider = new $p(
        this._onlineComponentProvider,
        null == e ? void 0 : e.cacheSizeBytes,
        this.forceOwnership
      )));
  }
}
function fm(e) {
  return new dm(null == e ? void 0 : e.forceOwnership);
}
function pm(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
    var i = 0;
    for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
        (n[r[i]] = e[r[i]]);
  }
  return n;
}
(new WeakMap(),
  (function (e, t = !0) {
    ((to = '10.11.0'),
      lt(
        new xe(
          'firestore',
          (e, { instanceIdentifier: n, options: r }) => {
            const i = e.getProvider('app').getImmediate(),
              s = new mg(
                new yo(e.getProvider('auth-internal')),
                new Io(e.getProvider('app-check-internal')),
                (function (e, t) {
                  if (!Object.prototype.hasOwnProperty.apply(e.options, ['projectId']))
                    throw new fo(
                      ho.INVALID_ARGUMENT,
                      '"projectId" not provided in firebase.initializeApp.'
                    );
                  return new nc(e.options.projectId, t);
                })(i, n),
                i
              );
            return ((r = Object.assign({ useFetchStreams: t }, r)), s._setSettings(r), s);
          },
          'PUBLIC'
        ).setMultipleInstances(!0)
      ),
      yt('@firebase/firestore', '4.6.0', e),
      yt('@firebase/firestore', '4.6.0', 'esm2017'));
  })(),
  Object.create,
  Object.create);
const gm = function () {
    return {
      'dependent-sdk-initialized-before-auth':
        'Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.',
    };
  },
  mm = new be('auth', 'Firebase', {
    'dependent-sdk-initialized-before-auth':
      'Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.',
  }),
  ym = new Ve('@firebase/auth');
function wm(e, ...t) {
  ym.logLevel <= Pe.ERROR && ym.error(`Auth (10.11.0): ${e}`, ...t);
}
function vm(e, ...t) {
  throw _m(e, ...t);
}
function bm(e, ...t) {
  return _m(e, ...t);
}
function Im(e, t, n) {
  const r = Object.assign(Object.assign({}, gm()), { [t]: n });
  return new be('auth', 'Firebase', r).create(t, { appName: e.name });
}
function Tm(e) {
  return Im(
    e,
    'operation-not-supported-in-this-environment',
    'Operations that alter the current user are not supported in conjunction with FirebaseServerApp'
  );
}
function _m(e, ...t) {
  if ('string' != typeof e) {
    const n = t[0],
      r = [...t.slice(1)];
    return (r[0] && (r[0].appName = e.name), e._errorFactory.create(n, ...r));
  }
  return mm.create(e, ...t);
}
function Em(e, t, ...n) {
  if (!e) throw _m(t, ...n);
}
function Sm(e) {
  const t = 'INTERNAL ASSERTION FAILED: ' + e;
  throw (wm(t), new Error(t));
}
function Cm(e, t) {
  e || Sm(t);
}
function Am() {
  var e;
  return (
    ('undefined' != typeof self &&
      (null === (e = self.location) || void 0 === e ? void 0 : e.protocol)) ||
    null
  );
}
function km() {
  return (
    !(
      'undefined' != typeof navigator &&
      navigator &&
      'onLine' in navigator &&
      'boolean' == typeof navigator.onLine &&
      ('http:' === Am() ||
        'https:' === Am() ||
        (function () {
          const e =
            'object' == typeof chrome
              ? chrome.runtime
              : 'object' == typeof browser
                ? browser.runtime
                : void 0;
          return 'object' == typeof e && void 0 !== e.id;
        })() ||
        'connection' in navigator)
    ) || navigator.onLine
  );
}
class Dm {
  static initialize(e, t, n) {
    ((this.fetchImpl = e), t && (this.headersImpl = t), n && (this.responseImpl = n));
  }
  static fetch() {
    return this.fetchImpl
      ? this.fetchImpl
      : 'undefined' != typeof self && 'fetch' in self
        ? self.fetch
        : 'undefined' != typeof globalThis && globalThis.fetch
          ? globalThis.fetch
          : 'undefined' != typeof fetch
            ? fetch
            : void Sm(
                'Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
              );
  }
  static headers() {
    return this.headersImpl
      ? this.headersImpl
      : 'undefined' != typeof self && 'Headers' in self
        ? self.Headers
        : 'undefined' != typeof globalThis && globalThis.Headers
          ? globalThis.Headers
          : 'undefined' != typeof Headers
            ? Headers
            : void Sm(
                'Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
              );
  }
  static response() {
    return this.responseImpl
      ? this.responseImpl
      : 'undefined' != typeof self && 'Response' in self
        ? self.Response
        : 'undefined' != typeof globalThis && globalThis.Response
          ? globalThis.Response
          : 'undefined' != typeof Response
            ? Response
            : void Sm(
                'Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
              );
  }
}
const xm = {
    CREDENTIAL_MISMATCH: 'custom-token-mismatch',
    MISSING_CUSTOM_TOKEN: 'internal-error',
    INVALID_IDENTIFIER: 'invalid-email',
    MISSING_CONTINUE_URI: 'internal-error',
    INVALID_PASSWORD: 'wrong-password',
    MISSING_PASSWORD: 'missing-password',
    INVALID_LOGIN_CREDENTIALS: 'invalid-credential',
    EMAIL_EXISTS: 'email-already-in-use',
    PASSWORD_LOGIN_DISABLED: 'operation-not-allowed',
    INVALID_IDP_RESPONSE: 'invalid-credential',
    INVALID_PENDING_TOKEN: 'invalid-credential',
    FEDERATED_USER_ID_ALREADY_LINKED: 'credential-already-in-use',
    MISSING_REQ_TYPE: 'internal-error',
    EMAIL_NOT_FOUND: 'user-not-found',
    RESET_PASSWORD_EXCEED_LIMIT: 'too-many-requests',
    EXPIRED_OOB_CODE: 'expired-action-code',
    INVALID_OOB_CODE: 'invalid-action-code',
    MISSING_OOB_CODE: 'internal-error',
    CREDENTIAL_TOO_OLD_LOGIN_AGAIN: 'requires-recent-login',
    INVALID_ID_TOKEN: 'invalid-user-token',
    TOKEN_EXPIRED: 'user-token-expired',
    USER_NOT_FOUND: 'user-token-expired',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'too-many-requests',
    PASSWORD_DOES_NOT_MEET_REQUIREMENTS: 'password-does-not-meet-requirements',
    INVALID_CODE: 'invalid-verification-code',
    INVALID_SESSION_INFO: 'invalid-verification-id',
    INVALID_TEMPORARY_PROOF: 'invalid-credential',
    MISSING_SESSION_INFO: 'missing-verification-id',
    SESSION_EXPIRED: 'code-expired',
    MISSING_ANDROID_PACKAGE_NAME: 'missing-android-pkg-name',
    UNAUTHORIZED_DOMAIN: 'unauthorized-continue-uri',
    INVALID_OAUTH_CLIENT_ID: 'invalid-oauth-client-id',
    ADMIN_ONLY_OPERATION: 'admin-restricted-operation',
    INVALID_MFA_PENDING_CREDENTIAL: 'invalid-multi-factor-session',
    MFA_ENROLLMENT_NOT_FOUND: 'multi-factor-info-not-found',
    MISSING_MFA_ENROLLMENT_ID: 'missing-multi-factor-info',
    MISSING_MFA_PENDING_CREDENTIAL: 'missing-multi-factor-session',
    SECOND_FACTOR_EXISTS: 'second-factor-already-in-use',
    SECOND_FACTOR_LIMIT_EXCEEDED: 'maximum-second-factor-count-exceeded',
    BLOCKING_FUNCTION_ERROR_RESPONSE: 'internal-error',
    RECAPTCHA_NOT_ENABLED: 'recaptcha-not-enabled',
    MISSING_RECAPTCHA_TOKEN: 'missing-recaptcha-token',
    INVALID_RECAPTCHA_TOKEN: 'invalid-recaptcha-token',
    INVALID_RECAPTCHA_ACTION: 'invalid-recaptcha-action',
    MISSING_CLIENT_TYPE: 'missing-client-type',
    MISSING_RECAPTCHA_VERSION: 'missing-recaptcha-version',
    INVALID_RECAPTCHA_VERSION: 'invalid-recaptcha-version',
    INVALID_REQ_TYPE: 'invalid-req-type',
  },
  Nm = new (class {
    constructor(e, t) {
      ((this.shortDelay = e),
        (this.longDelay = t),
        Cm(t > e, 'Short delay should be less than long delay!'),
        (this.isMobile =
          ('undefined' != typeof window &&
            !!(window.cordova || window.phonegap || window.PhoneGap) &&
            /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(me())) ||
          ('object' == typeof navigator && 'ReactNative' === navigator.product)));
    }
    get() {
      return km()
        ? this.isMobile
          ? this.longDelay
          : this.shortDelay
        : Math.min(5e3, this.shortDelay);
    }
  })(3e4, 6e4);
function Om(e, t) {
  return e.tenantId && !t.tenantId
    ? Object.assign(Object.assign({}, t), { tenantId: e.tenantId })
    : t;
}
async function Rm(e, t, n, r, i = {}) {
  return Pm(e, i, async () => {
    let i = {},
      s = {};
    r && ('GET' === t ? (s = r) : (i = { body: JSON.stringify(r) }));
    const o = Ee(Object.assign({ key: e.config.apiKey }, s)).slice(1),
      a = await e._getAdditionalHeaders();
    return (
      (a['Content-Type'] = 'application/json'),
      e.languageCode && (a['X-Firebase-Locale'] = e.languageCode),
      Dm.fetch()(
        Lm(e, e.config.apiHost, n, o),
        Object.assign({ method: t, headers: a, referrerPolicy: 'no-referrer' }, i)
      )
    );
  });
}
async function Pm(e, t, n) {
  e._canInitEmulator = !1;
  const r = Object.assign(Object.assign({}, xm), t);
  try {
    const t = new Um(e),
      i = await Promise.race([n(), t.promise]);
    t.clearNetworkTimeout();
    const s = await i.json();
    if ('needConfirmation' in s) throw Vm(e, 'account-exists-with-different-credential', s);
    if (i.ok && !('errorMessage' in s)) return s;
    {
      const t = i.ok ? s.errorMessage : s.error.message,
        [n, o] = t.split(' : ');
      if ('FEDERATED_USER_ID_ALREADY_LINKED' === n) throw Vm(e, 'credential-already-in-use', s);
      if ('EMAIL_EXISTS' === n) throw Vm(e, 'email-already-in-use', s);
      if ('USER_DISABLED' === n) throw Vm(e, 'user-disabled', s);
      const a = r[n] || n.toLowerCase().replace(/[_\s]+/g, '-');
      if (o) throw Im(e, a, o);
      vm(e, a);
    }
  } catch (t) {
    if (t instanceof ve) throw t;
    vm(e, 'network-request-failed', { message: String(t) });
  }
}
async function Mm(e, t, n, r, i = {}) {
  const s = await Rm(e, t, n, r, i);
  return (
    'mfaPendingCredential' in s && vm(e, 'multi-factor-auth-required', { _serverResponse: s }),
    s
  );
}
function Lm(e, t, n, r) {
  const i = `${t}${n}?${r}`;
  return e.config.emulator
    ? (function (e, t) {
        Cm(e.emulator, 'Emulator should always be set here');
        const { url: n } = e.emulator;
        return t ? `${n}${t.startsWith('/') ? t.slice(1) : t}` : n;
      })(e.config, i)
    : `${e.config.apiScheme}://${i}`;
}
function Fm(e) {
  switch (e) {
    case 'ENFORCE':
      return 'ENFORCE';
    case 'AUDIT':
      return 'AUDIT';
    case 'OFF':
      return 'OFF';
    default:
      return 'ENFORCEMENT_STATE_UNSPECIFIED';
  }
}
class Um {
  constructor(e) {
    ((this.auth = e),
      (this.timer = null),
      (this.promise = new Promise((e, t) => {
        this.timer = setTimeout(() => t(bm(this.auth, 'network-request-failed')), Nm.get());
      })));
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
}
function Vm(e, t, n) {
  const r = { appName: e.name };
  (n.email && (r.email = n.email), n.phoneNumber && (r.phoneNumber = n.phoneNumber));
  const i = bm(e, t, r);
  return ((i.customData._tokenResponse = n), i);
}
function Bm(e) {
  return void 0 !== e && void 0 !== e.enterprise;
}
class jm {
  constructor(e) {
    if (((this.siteKey = ''), (this.recaptchaEnforcementState = []), void 0 === e.recaptchaKey))
      throw new Error('recaptchaKey undefined');
    ((this.siteKey = e.recaptchaKey.split('/')[3]),
      (this.recaptchaEnforcementState = e.recaptchaEnforcementState));
  }
  getProviderEnforcementState(e) {
    if (!this.recaptchaEnforcementState || 0 === this.recaptchaEnforcementState.length) return null;
    for (const t of this.recaptchaEnforcementState)
      if (t.provider && t.provider === e) return Fm(t.enforcementState);
    return null;
  }
  isProviderEnabled(e) {
    return (
      'ENFORCE' === this.getProviderEnforcementState(e) ||
      'AUDIT' === this.getProviderEnforcementState(e)
    );
  }
}
async function zm(e, t) {
  return Rm(e, 'POST', '/v1/accounts:lookup', t);
}
function qm(e) {
  if (e)
    try {
      const t = new Date(Number(e));
      if (!isNaN(t.getTime())) return t.toUTCString();
    } catch (e) {}
}
async function Gm(e, t = !1) {
  const n = De(e),
    r = await n.getIdToken(t),
    i = Km(r);
  Em(i && i.exp && i.auth_time && i.iat, n.auth, 'internal-error');
  const s = 'object' == typeof i.firebase ? i.firebase : void 0,
    o = null == s ? void 0 : s.sign_in_provider;
  return {
    claims: i,
    token: r,
    authTime: qm($m(i.auth_time)),
    issuedAtTime: qm($m(i.iat)),
    expirationTime: qm($m(i.exp)),
    signInProvider: o || null,
    signInSecondFactor: (null == s ? void 0 : s.sign_in_second_factor) || null,
  };
}
function $m(e) {
  return 1e3 * Number(e);
}
function Km(e) {
  const [t, n, r] = e.split('.');
  if (void 0 === t || void 0 === n || void 0 === r)
    return (wm('JWT malformed, contained fewer than 3 sections'), null);
  try {
    const e = he(n);
    return e ? JSON.parse(e) : (wm('Failed to decode base64 JWT payload'), null);
  } catch (e) {
    return (
      wm('Caught error parsing JWT payload as JSON', null == e ? void 0 : e.toString()),
      null
    );
  }
}
function Wm(e) {
  const t = Km(e);
  return (
    Em(t, 'internal-error'),
    Em(void 0 !== t.exp, 'internal-error'),
    Em(void 0 !== t.iat, 'internal-error'),
    Number(t.exp) - Number(t.iat)
  );
}
async function Hm(e, t, n = !1) {
  if (n) return t;
  try {
    return await t;
  } catch (t) {
    throw (
      t instanceof ve &&
        (function ({ code: e }) {
          return 'auth/user-disabled' === e || 'auth/user-token-expired' === e;
        })(t) &&
        e.auth.currentUser === e &&
        (await e.auth.signOut()),
      t
    );
  }
}
class Qm {
  constructor(e) {
    ((this.user = e), (this.isRunning = !1), (this.timerId = null), (this.errorBackoff = 3e4));
  }
  _start() {
    this.isRunning || ((this.isRunning = !0), this.schedule());
  }
  _stop() {
    this.isRunning && ((this.isRunning = !1), null !== this.timerId && clearTimeout(this.timerId));
  }
  getInterval(e) {
    var t;
    if (e) {
      const e = this.errorBackoff;
      return ((this.errorBackoff = Math.min(2 * this.errorBackoff, 96e4)), e);
    }
    {
      this.errorBackoff = 3e4;
      const e =
        (null !== (t = this.user.stsTokenManager.expirationTime) && void 0 !== t ? t : 0) -
        Date.now() -
        3e5;
      return Math.max(0, e);
    }
  }
  schedule(e = !1) {
    if (!this.isRunning) return;
    const t = this.getInterval(e);
    this.timerId = setTimeout(async () => {
      await this.iteration();
    }, t);
  }
  async iteration() {
    try {
      await this.user.getIdToken(!0);
    } catch (e) {
      return void (
        'auth/network-request-failed' === (null == e ? void 0 : e.code) && this.schedule(!0)
      );
    }
    this.schedule();
  }
}
class Ym {
  constructor(e, t) {
    ((this.createdAt = e), (this.lastLoginAt = t), this._initializeTime());
  }
  _initializeTime() {
    ((this.lastSignInTime = qm(this.lastLoginAt)), (this.creationTime = qm(this.createdAt)));
  }
  _copy(e) {
    ((this.createdAt = e.createdAt), (this.lastLoginAt = e.lastLoginAt), this._initializeTime());
  }
  toJSON() {
    return { createdAt: this.createdAt, lastLoginAt: this.lastLoginAt };
  }
}
async function Xm(e) {
  var t;
  const n = e.auth,
    r = await e.getIdToken(),
    i = await Hm(e, zm(n, { idToken: r }));
  Em(null == i ? void 0 : i.users.length, n, 'internal-error');
  const s = i.users[0];
  e._notifyReloadListener(s);
  const o = (null === (t = s.providerUserInfo) || void 0 === t ? void 0 : t.length)
      ? Jm(s.providerUserInfo)
      : [],
    a =
      ((c = e.providerData),
      (u = o),
      [...c.filter(e => !u.some(t => t.providerId === e.providerId)), ...u]);
  var c, u;
  const l = e.isAnonymous,
    h = !((e.email && s.passwordHash) || (null == a ? void 0 : a.length)),
    d = !!l && h,
    f = {
      uid: s.localId,
      displayName: s.displayName || null,
      photoURL: s.photoUrl || null,
      email: s.email || null,
      emailVerified: s.emailVerified || !1,
      phoneNumber: s.phoneNumber || null,
      tenantId: s.tenantId || null,
      providerData: a,
      metadata: new Ym(s.createdAt, s.lastLoginAt),
      isAnonymous: d,
    };
  Object.assign(e, f);
}
function Jm(e) {
  return e.map(e => {
    var { providerId: t } = e,
      n = pm(e, ['providerId']);
    return {
      providerId: t,
      uid: n.rawId || '',
      displayName: n.displayName || null,
      email: n.email || null,
      phoneNumber: n.phoneNumber || null,
      photoURL: n.photoUrl || null,
    };
  });
}
class Zm {
  constructor() {
    ((this.refreshToken = null), (this.accessToken = null), (this.expirationTime = null));
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
  }
  updateFromServerResponse(e) {
    (Em(e.idToken, 'internal-error'),
      Em(void 0 !== e.idToken, 'internal-error'),
      Em(void 0 !== e.refreshToken, 'internal-error'));
    const t = 'expiresIn' in e && void 0 !== e.expiresIn ? Number(e.expiresIn) : Wm(e.idToken);
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, t);
  }
  updateFromIdToken(e) {
    Em(0 !== e.length, 'internal-error');
    const t = Wm(e);
    this.updateTokensAndExpiration(e, null, t);
  }
  async getToken(e, t = !1) {
    return t || !this.accessToken || this.isExpired
      ? (Em(this.refreshToken, e, 'user-token-expired'),
        this.refreshToken ? (await this.refresh(e, this.refreshToken), this.accessToken) : null)
      : this.accessToken;
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  async refresh(e, t) {
    const {
      accessToken: n,
      refreshToken: r,
      expiresIn: i,
    } = await (async function (e, t) {
      const n = await Pm(e, {}, async () => {
        const n = Ee({ grant_type: 'refresh_token', refresh_token: t }).slice(1),
          { tokenApiHost: r, apiKey: i } = e.config,
          s = Lm(e, r, '/v1/token', `key=${i}`),
          o = await e._getAdditionalHeaders();
        return (
          (o['Content-Type'] = 'application/x-www-form-urlencoded'),
          Dm.fetch()(s, { method: 'POST', headers: o, body: n })
        );
      });
      return {
        accessToken: n.access_token,
        expiresIn: n.expires_in,
        refreshToken: n.refresh_token,
      };
    })(e, t);
    this.updateTokensAndExpiration(n, r, Number(i));
  }
  updateTokensAndExpiration(e, t, n) {
    ((this.refreshToken = t || null),
      (this.accessToken = e || null),
      (this.expirationTime = Date.now() + 1e3 * n));
  }
  static fromJSON(e, t) {
    const { refreshToken: n, accessToken: r, expirationTime: i } = t,
      s = new Zm();
    return (
      n && (Em('string' == typeof n, 'internal-error', { appName: e }), (s.refreshToken = n)),
      r && (Em('string' == typeof r, 'internal-error', { appName: e }), (s.accessToken = r)),
      i && (Em('number' == typeof i, 'internal-error', { appName: e }), (s.expirationTime = i)),
      s
    );
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime,
    };
  }
  _assign(e) {
    ((this.accessToken = e.accessToken),
      (this.refreshToken = e.refreshToken),
      (this.expirationTime = e.expirationTime));
  }
  _clone() {
    return Object.assign(new Zm(), this.toJSON());
  }
  _performRefresh() {
    return Sm('not implemented');
  }
}
function ey(e, t) {
  Em('string' == typeof e || void 0 === e, 'internal-error', { appName: t });
}
class ty {
  constructor(e) {
    var { uid: t, auth: n, stsTokenManager: r } = e,
      i = pm(e, ['uid', 'auth', 'stsTokenManager']);
    ((this.providerId = 'firebase'),
      (this.proactiveRefresh = new Qm(this)),
      (this.reloadUserInfo = null),
      (this.reloadListener = null),
      (this.uid = t),
      (this.auth = n),
      (this.stsTokenManager = r),
      (this.accessToken = r.accessToken),
      (this.displayName = i.displayName || null),
      (this.email = i.email || null),
      (this.emailVerified = i.emailVerified || !1),
      (this.phoneNumber = i.phoneNumber || null),
      (this.photoURL = i.photoURL || null),
      (this.isAnonymous = i.isAnonymous || !1),
      (this.tenantId = i.tenantId || null),
      (this.providerData = i.providerData ? [...i.providerData] : []),
      (this.metadata = new Ym(i.createdAt || void 0, i.lastLoginAt || void 0)));
  }
  async getIdToken(e) {
    const t = await Hm(this, this.stsTokenManager.getToken(this.auth, e));
    return (
      Em(t, this.auth, 'internal-error'),
      this.accessToken !== t &&
        ((this.accessToken = t),
        await this.auth._persistUserIfCurrent(this),
        this.auth._notifyListenersIfCurrent(this)),
      t
    );
  }
  getIdTokenResult(e) {
    return Gm(this, e);
  }
  reload() {
    return (async function (e) {
      const t = De(e);
      (await Xm(t), await t.auth._persistUserIfCurrent(t), t.auth._notifyListenersIfCurrent(t));
    })(this);
  }
  _assign(e) {
    this !== e &&
      (Em(this.uid === e.uid, this.auth, 'internal-error'),
      (this.displayName = e.displayName),
      (this.photoURL = e.photoURL),
      (this.email = e.email),
      (this.emailVerified = e.emailVerified),
      (this.phoneNumber = e.phoneNumber),
      (this.isAnonymous = e.isAnonymous),
      (this.tenantId = e.tenantId),
      (this.providerData = e.providerData.map(e => Object.assign({}, e))),
      this.metadata._copy(e.metadata),
      this.stsTokenManager._assign(e.stsTokenManager));
  }
  _clone(e) {
    const t = new ty(
      Object.assign(Object.assign({}, this), {
        auth: e,
        stsTokenManager: this.stsTokenManager._clone(),
      })
    );
    return (t.metadata._copy(this.metadata), t);
  }
  _onReload(e) {
    (Em(!this.reloadListener, this.auth, 'internal-error'),
      (this.reloadListener = e),
      this.reloadUserInfo &&
        (this._notifyReloadListener(this.reloadUserInfo), (this.reloadUserInfo = null)));
  }
  _notifyReloadListener(e) {
    this.reloadListener ? this.reloadListener(e) : (this.reloadUserInfo = e);
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start();
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop();
  }
  async _updateTokensIfNecessary(e, t = !1) {
    let n = !1;
    (e.idToken &&
      e.idToken !== this.stsTokenManager.accessToken &&
      (this.stsTokenManager.updateFromServerResponse(e), (n = !0)),
      t && (await Xm(this)),
      await this.auth._persistUserIfCurrent(this),
      n && this.auth._notifyListenersIfCurrent(this));
  }
  async delete() {
    if (dt(this.auth.app)) return Promise.reject(Tm(this.auth));
    const e = await this.getIdToken();
    return (
      await Hm(
        this,
        (async function (e, t) {
          return Rm(e, 'POST', '/v1/accounts:delete', t);
        })(this.auth, { idToken: e })
      ),
      this.stsTokenManager.clearRefreshToken(),
      this.auth.signOut()
    );
  }
  toJSON() {
    return Object.assign(
      Object.assign(
        {
          uid: this.uid,
          email: this.email || void 0,
          emailVerified: this.emailVerified,
          displayName: this.displayName || void 0,
          isAnonymous: this.isAnonymous,
          photoURL: this.photoURL || void 0,
          phoneNumber: this.phoneNumber || void 0,
          tenantId: this.tenantId || void 0,
          providerData: this.providerData.map(e => Object.assign({}, e)),
          stsTokenManager: this.stsTokenManager.toJSON(),
          _redirectEventId: this._redirectEventId,
        },
        this.metadata.toJSON()
      ),
      { apiKey: this.auth.config.apiKey, appName: this.auth.name }
    );
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || '';
  }
  static _fromJSON(e, t) {
    var n, r, i, s, o, a, c, u;
    const l = null !== (n = t.displayName) && void 0 !== n ? n : void 0,
      h = null !== (r = t.email) && void 0 !== r ? r : void 0,
      d = null !== (i = t.phoneNumber) && void 0 !== i ? i : void 0,
      f = null !== (s = t.photoURL) && void 0 !== s ? s : void 0,
      p = null !== (o = t.tenantId) && void 0 !== o ? o : void 0,
      g = null !== (a = t._redirectEventId) && void 0 !== a ? a : void 0,
      m = null !== (c = t.createdAt) && void 0 !== c ? c : void 0,
      y = null !== (u = t.lastLoginAt) && void 0 !== u ? u : void 0,
      { uid: w, emailVerified: v, isAnonymous: b, providerData: I, stsTokenManager: T } = t;
    Em(w && T, e, 'internal-error');
    const _ = Zm.fromJSON(this.name, T);
    (Em('string' == typeof w, e, 'internal-error'),
      ey(l, e.name),
      ey(h, e.name),
      Em('boolean' == typeof v, e, 'internal-error'),
      Em('boolean' == typeof b, e, 'internal-error'),
      ey(d, e.name),
      ey(f, e.name),
      ey(p, e.name),
      ey(g, e.name),
      ey(m, e.name),
      ey(y, e.name));
    const E = new ty({
      uid: w,
      auth: e,
      email: h,
      emailVerified: v,
      displayName: l,
      isAnonymous: b,
      photoURL: f,
      phoneNumber: d,
      tenantId: p,
      stsTokenManager: _,
      createdAt: m,
      lastLoginAt: y,
    });
    return (
      I && Array.isArray(I) && (E.providerData = I.map(e => Object.assign({}, e))),
      g && (E._redirectEventId = g),
      E
    );
  }
  static async _fromIdTokenResponse(e, t, n = !1) {
    const r = new Zm();
    r.updateFromServerResponse(t);
    const i = new ty({ uid: t.localId, auth: e, stsTokenManager: r, isAnonymous: n });
    return (await Xm(i), i);
  }
  static async _fromGetAccountInfoResponse(e, t, n) {
    const r = t.users[0];
    Em(void 0 !== r.localId, 'internal-error');
    const i = void 0 !== r.providerUserInfo ? Jm(r.providerUserInfo) : [],
      s = !((r.email && r.passwordHash) || (null == i ? void 0 : i.length)),
      o = new Zm();
    o.updateFromIdToken(n);
    const a = new ty({ uid: r.localId, auth: e, stsTokenManager: o, isAnonymous: s }),
      c = {
        uid: r.localId,
        displayName: r.displayName || null,
        photoURL: r.photoUrl || null,
        email: r.email || null,
        emailVerified: r.emailVerified || !1,
        phoneNumber: r.phoneNumber || null,
        tenantId: r.tenantId || null,
        providerData: i,
        metadata: new Ym(r.createdAt, r.lastLoginAt),
        isAnonymous: !((r.email && r.passwordHash) || (null == i ? void 0 : i.length)),
      };
    return (Object.assign(a, c), a);
  }
}
const ny = new Map();
function ry(e) {
  Cm(e instanceof Function, 'Expected a class definition');
  let t = ny.get(e);
  return t
    ? (Cm(t instanceof e, 'Instance stored in cache mismatched with class'), t)
    : ((t = new e()), ny.set(e, t), t);
}
class iy {
  constructor() {
    ((this.type = 'NONE'), (this.storage = {}));
  }
  async _isAvailable() {
    return !0;
  }
  async _set(e, t) {
    this.storage[e] = t;
  }
  async _get(e) {
    const t = this.storage[e];
    return void 0 === t ? null : t;
  }
  async _remove(e) {
    delete this.storage[e];
  }
  _addListener(e, t) {}
  _removeListener(e, t) {}
}
iy.type = 'NONE';
const sy = iy;
function oy(e, t, n) {
  return `firebase:${e}:${t}:${n}`;
}
class ay {
  constructor(e, t, n) {
    ((this.persistence = e), (this.auth = t), (this.userKey = n));
    const { config: r, name: i } = this.auth;
    ((this.fullUserKey = oy(this.userKey, r.apiKey, i)),
      (this.fullPersistenceKey = oy('persistence', r.apiKey, i)),
      (this.boundEventHandler = t._onStorageEvent.bind(t)),
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler));
  }
  setCurrentUser(e) {
    return this.persistence._set(this.fullUserKey, e.toJSON());
  }
  async getCurrentUser() {
    const e = await this.persistence._get(this.fullUserKey);
    return e ? ty._fromJSON(this.auth, e) : null;
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey);
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
  }
  async setPersistence(e) {
    if (this.persistence === e) return;
    const t = await this.getCurrentUser();
    return (
      await this.removeCurrentUser(),
      (this.persistence = e),
      t ? this.setCurrentUser(t) : void 0
    );
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static async create(e, t, n = 'authUser') {
    if (!t.length) return new ay(ry(sy), e, n);
    const r = (
      await Promise.all(
        t.map(async e => {
          if (await e._isAvailable()) return e;
        })
      )
    ).filter(e => e);
    let i = r[0] || ry(sy);
    const s = oy(n, e.config.apiKey, e.name);
    let o = null;
    for (const n of t)
      try {
        const t = await n._get(s);
        if (t) {
          const r = ty._fromJSON(e, t);
          (n !== i && (o = r), (i = n));
          break;
        }
      } catch (e) {}
    const a = r.filter(e => e._shouldAllowMigration);
    return i._shouldAllowMigration && a.length
      ? ((i = a[0]),
        o && (await i._set(s, o.toJSON())),
        await Promise.all(
          t.map(async e => {
            if (e !== i)
              try {
                await e._remove(s);
              } catch (e) {}
          })
        ),
        new ay(i, e, n))
      : new ay(i, e, n);
  }
}
function cy(e) {
  const t = e.toLowerCase();
  if (t.includes('opera/') || t.includes('opr/') || t.includes('opios/')) return 'Opera';
  if (
    (function (e = me()) {
      return /iemobile/i.test(e);
    })(t)
  )
    return 'IEMobile';
  if (t.includes('msie') || t.includes('trident/')) return 'IE';
  if (t.includes('edge/')) return 'Edge';
  if (
    (function (e = me()) {
      return /firefox\//i.test(e);
    })(t)
  )
    return 'Firefox';
  if (t.includes('silk/')) return 'Silk';
  if (
    (function (e = me()) {
      return /blackberry/i.test(e);
    })(t)
  )
    return 'Blackberry';
  if (
    (function (e = me()) {
      return /webos/i.test(e);
    })(t)
  )
    return 'Webos';
  if (
    (function (e = me()) {
      const t = e.toLowerCase();
      return (
        t.includes('safari/') &&
        !t.includes('chrome/') &&
        !t.includes('crios/') &&
        !t.includes('android')
      );
    })(t)
  )
    return 'Safari';
  if (
    (t.includes('chrome/') ||
      (function (e = me()) {
        return /crios\//i.test(e);
      })(t)) &&
    !t.includes('edge/')
  )
    return 'Chrome';
  if (
    (function (e = me()) {
      return /android/i.test(e);
    })(t)
  )
    return 'Android';
  {
    const t = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
      n = e.match(t);
    if (2 === (null == n ? void 0 : n.length)) return n[1];
  }
  return 'Other';
}
function uy(e, t = []) {
  let n;
  switch (e) {
    case 'Browser':
      n = cy(me());
      break;
    case 'Worker':
      n = `${cy(me())}-${e}`;
      break;
    default:
      n = e;
  }
  return `${n}/JsCore/10.11.0/${t.length ? t.join(',') : 'FirebaseCore-web'}`;
}
class ly {
  constructor(e) {
    ((this.auth = e), (this.queue = []));
  }
  pushCallback(e, t) {
    const n = t =>
      new Promise((n, r) => {
        try {
          n(e(t));
        } catch (e) {
          r(e);
        }
      });
    ((n.onAbort = t), this.queue.push(n));
    const r = this.queue.length - 1;
    return () => {
      this.queue[r] = () => Promise.resolve();
    };
  }
  async runMiddleware(e) {
    if (this.auth.currentUser === e) return;
    const t = [];
    try {
      for (const n of this.queue) (await n(e), n.onAbort && t.push(n.onAbort));
    } catch (e) {
      t.reverse();
      for (const e of t)
        try {
          e();
        } catch (e) {}
      throw this.auth._errorFactory.create('login-blocked', {
        originalMessage: null == e ? void 0 : e.message,
      });
    }
  }
}
class hy {
  constructor(e) {
    var t, n, r, i;
    const s = e.customStrengthOptions;
    ((this.customStrengthOptions = {}),
      (this.customStrengthOptions.minPasswordLength =
        null !== (t = s.minPasswordLength) && void 0 !== t ? t : 6),
      s.maxPasswordLength && (this.customStrengthOptions.maxPasswordLength = s.maxPasswordLength),
      void 0 !== s.containsLowercaseCharacter &&
        (this.customStrengthOptions.containsLowercaseLetter = s.containsLowercaseCharacter),
      void 0 !== s.containsUppercaseCharacter &&
        (this.customStrengthOptions.containsUppercaseLetter = s.containsUppercaseCharacter),
      void 0 !== s.containsNumericCharacter &&
        (this.customStrengthOptions.containsNumericCharacter = s.containsNumericCharacter),
      void 0 !== s.containsNonAlphanumericCharacter &&
        (this.customStrengthOptions.containsNonAlphanumericCharacter =
          s.containsNonAlphanumericCharacter),
      (this.enforcementState = e.enforcementState),
      'ENFORCEMENT_STATE_UNSPECIFIED' === this.enforcementState && (this.enforcementState = 'OFF'),
      (this.allowedNonAlphanumericCharacters =
        null !==
          (r =
            null === (n = e.allowedNonAlphanumericCharacters) || void 0 === n
              ? void 0
              : n.join('')) && void 0 !== r
          ? r
          : ''),
      (this.forceUpgradeOnSignin = null !== (i = e.forceUpgradeOnSignin) && void 0 !== i && i),
      (this.schemaVersion = e.schemaVersion));
  }
  validatePassword(e) {
    var t, n, r, i, s, o;
    const a = { isValid: !0, passwordPolicy: this };
    return (
      this.validatePasswordLengthOptions(e, a),
      this.validatePasswordCharacterOptions(e, a),
      a.isValid && (a.isValid = null === (t = a.meetsMinPasswordLength) || void 0 === t || t),
      a.isValid && (a.isValid = null === (n = a.meetsMaxPasswordLength) || void 0 === n || n),
      a.isValid && (a.isValid = null === (r = a.containsLowercaseLetter) || void 0 === r || r),
      a.isValid && (a.isValid = null === (i = a.containsUppercaseLetter) || void 0 === i || i),
      a.isValid && (a.isValid = null === (s = a.containsNumericCharacter) || void 0 === s || s),
      a.isValid &&
        (a.isValid = null === (o = a.containsNonAlphanumericCharacter) || void 0 === o || o),
      a
    );
  }
  validatePasswordLengthOptions(e, t) {
    const n = this.customStrengthOptions.minPasswordLength,
      r = this.customStrengthOptions.maxPasswordLength;
    (n && (t.meetsMinPasswordLength = e.length >= n),
      r && (t.meetsMaxPasswordLength = e.length <= r));
  }
  validatePasswordCharacterOptions(e, t) {
    let n;
    this.updatePasswordCharacterOptionsStatuses(t, !1, !1, !1, !1);
    for (let r = 0; r < e.length; r++)
      ((n = e.charAt(r)),
        this.updatePasswordCharacterOptionsStatuses(
          t,
          n >= 'a' && n <= 'z',
          n >= 'A' && n <= 'Z',
          n >= '0' && n <= '9',
          this.allowedNonAlphanumericCharacters.includes(n)
        ));
  }
  updatePasswordCharacterOptionsStatuses(e, t, n, r, i) {
    (this.customStrengthOptions.containsLowercaseLetter &&
      (e.containsLowercaseLetter || (e.containsLowercaseLetter = t)),
      this.customStrengthOptions.containsUppercaseLetter &&
        (e.containsUppercaseLetter || (e.containsUppercaseLetter = n)),
      this.customStrengthOptions.containsNumericCharacter &&
        (e.containsNumericCharacter || (e.containsNumericCharacter = r)),
      this.customStrengthOptions.containsNonAlphanumericCharacter &&
        (e.containsNonAlphanumericCharacter || (e.containsNonAlphanumericCharacter = i)));
  }
}
class dy {
  constructor(e, t, n, r) {
    ((this.app = e),
      (this.heartbeatServiceProvider = t),
      (this.appCheckServiceProvider = n),
      (this.config = r),
      (this.currentUser = null),
      (this.emulatorConfig = null),
      (this.operations = Promise.resolve()),
      (this.authStateSubscription = new py(this)),
      (this.idTokenSubscription = new py(this)),
      (this.beforeStateQueue = new ly(this)),
      (this.redirectUser = null),
      (this.isProactiveRefreshEnabled = !1),
      (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
      (this._canInitEmulator = !0),
      (this._isInitialized = !1),
      (this._deleted = !1),
      (this._initializationPromise = null),
      (this._popupRedirectResolver = null),
      (this._errorFactory = mm),
      (this._agentRecaptchaConfig = null),
      (this._tenantRecaptchaConfigs = {}),
      (this._projectPasswordPolicy = null),
      (this._tenantPasswordPolicies = {}),
      (this.lastNotifiedUid = void 0),
      (this.languageCode = null),
      (this.tenantId = null),
      (this.settings = { appVerificationDisabledForTesting: !1 }),
      (this.frameworks = []),
      (this.name = e.name),
      (this.clientVersion = r.sdkClientVersion));
  }
  _initializeWithPersistence(e, t) {
    return (
      t && (this._popupRedirectResolver = ry(t)),
      (this._initializationPromise = this.queue(async () => {
        var n, r;
        if (
          !this._deleted &&
          ((this.persistenceManager = await ay.create(this, e)), !this._deleted)
        ) {
          if (
            null === (n = this._popupRedirectResolver) || void 0 === n
              ? void 0
              : n._shouldInitProactively
          )
            try {
              await this._popupRedirectResolver._initialize(this);
            } catch (e) {}
          (await this.initializeCurrentUser(t),
            (this.lastNotifiedUid =
              (null === (r = this.currentUser) || void 0 === r ? void 0 : r.uid) || null),
            this._deleted || (this._isInitialized = !0));
        }
      })),
      this._initializationPromise
    );
  }
  async _onStorageEvent() {
    if (this._deleted) return;
    const e = await this.assertedPersistence.getCurrentUser();
    return this.currentUser || e
      ? this.currentUser && e && this.currentUser.uid === e.uid
        ? (this._currentUser._assign(e), void (await this.currentUser.getIdToken()))
        : void (await this._updateCurrentUser(e, !0))
      : void 0;
  }
  async initializeCurrentUserFromIdToken(e) {
    try {
      const t = await zm(this, { idToken: e }),
        n = await ty._fromGetAccountInfoResponse(this, t, e);
      await this.directlySetCurrentUser(n);
    } catch (e) {
      (console.warn('FirebaseServerApp could not login user with provided authIdToken: ', e),
        await this.directlySetCurrentUser(null));
    }
  }
  async initializeCurrentUser(e) {
    var t;
    if (dt(this.app)) {
      const e = this.app.settings.authIdToken;
      return e
        ? new Promise(t => {
            setTimeout(() => this.initializeCurrentUserFromIdToken(e).then(t, t));
          })
        : this.directlySetCurrentUser(null);
    }
    const n = await this.assertedPersistence.getCurrentUser();
    let r = n,
      i = !1;
    if (e && this.config.authDomain) {
      await this.getOrInitRedirectPersistenceManager();
      const n = null === (t = this.redirectUser) || void 0 === t ? void 0 : t._redirectEventId,
        s = null == r ? void 0 : r._redirectEventId,
        o = await this.tryRedirectSignIn(e);
      (n && n !== s) || !(null == o ? void 0 : o.user) || ((r = o.user), (i = !0));
    }
    if (!r) return this.directlySetCurrentUser(null);
    if (!r._redirectEventId) {
      if (i)
        try {
          await this.beforeStateQueue.runMiddleware(r);
        } catch (e) {
          ((r = n),
            this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e)));
        }
      return r ? this.reloadAndSetCurrentUserOrClear(r) : this.directlySetCurrentUser(null);
    }
    return (
      Em(this._popupRedirectResolver, this, 'argument-error'),
      await this.getOrInitRedirectPersistenceManager(),
      this.redirectUser && this.redirectUser._redirectEventId === r._redirectEventId
        ? this.directlySetCurrentUser(r)
        : this.reloadAndSetCurrentUserOrClear(r)
    );
  }
  async tryRedirectSignIn(e) {
    let t = null;
    try {
      t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
    } catch (e) {
      await this._setRedirectUser(null);
    }
    return t;
  }
  async reloadAndSetCurrentUserOrClear(e) {
    try {
      await Xm(e);
    } catch (e) {
      if ('auth/network-request-failed' !== (null == e ? void 0 : e.code))
        return this.directlySetCurrentUser(null);
    }
    return this.directlySetCurrentUser(e);
  }
  useDeviceLanguage() {
    this.languageCode = (function () {
      if ('undefined' == typeof navigator) return null;
      const e = navigator;
      return (e.languages && e.languages[0]) || e.language || null;
    })();
  }
  async _delete() {
    this._deleted = !0;
  }
  async updateCurrentUser(e) {
    if (dt(this.app)) return Promise.reject(Tm(this));
    const t = e ? De(e) : null;
    return (
      t && Em(t.auth.config.apiKey === this.config.apiKey, this, 'invalid-user-token'),
      this._updateCurrentUser(t && t._clone(this))
    );
  }
  async _updateCurrentUser(e, t = !1) {
    if (!this._deleted)
      return (
        e && Em(this.tenantId === e.tenantId, this, 'tenant-id-mismatch'),
        t || (await this.beforeStateQueue.runMiddleware(e)),
        this.queue(async () => {
          (await this.directlySetCurrentUser(e), this.notifyAuthListeners());
        })
      );
  }
  async signOut() {
    return dt(this.app)
      ? Promise.reject(Tm(this))
      : (await this.beforeStateQueue.runMiddleware(null),
        (this.redirectPersistenceManager || this._popupRedirectResolver) &&
          (await this._setRedirectUser(null)),
        this._updateCurrentUser(null, !0));
  }
  setPersistence(e) {
    return dt(this.app)
      ? Promise.reject(Tm(this))
      : this.queue(async () => {
          await this.assertedPersistence.setPersistence(ry(e));
        });
  }
  _getRecaptchaConfig() {
    return null == this.tenantId
      ? this._agentRecaptchaConfig
      : this._tenantRecaptchaConfigs[this.tenantId];
  }
  async validatePassword(e) {
    this._getPasswordPolicyInternal() || (await this._updatePasswordPolicy());
    const t = this._getPasswordPolicyInternal();
    return t.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION
      ? Promise.reject(this._errorFactory.create('unsupported-password-policy-schema-version', {}))
      : t.validatePassword(e);
  }
  _getPasswordPolicyInternal() {
    return null === this.tenantId
      ? this._projectPasswordPolicy
      : this._tenantPasswordPolicies[this.tenantId];
  }
  async _updatePasswordPolicy() {
    const e = await (async function (e, t = {}) {
        return Rm(e, 'GET', '/v2/passwordPolicy', Om(e, t));
      })(this),
      t = new hy(e);
    null === this.tenantId
      ? (this._projectPasswordPolicy = t)
      : (this._tenantPasswordPolicies[this.tenantId] = t);
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type;
  }
  _updateErrorMap(e) {
    this._errorFactory = new be('auth', 'Firebase', e());
  }
  onAuthStateChanged(e, t, n) {
    return this.registerStateListener(this.authStateSubscription, e, t, n);
  }
  beforeAuthStateChanged(e, t) {
    return this.beforeStateQueue.pushCallback(e, t);
  }
  onIdTokenChanged(e, t, n) {
    return this.registerStateListener(this.idTokenSubscription, e, t, n);
  }
  authStateReady() {
    return new Promise((e, t) => {
      if (this.currentUser) e();
      else {
        const n = this.onAuthStateChanged(() => {
          (n(), e());
        }, t);
      }
    });
  }
  async revokeAccessToken(e) {
    if (this.currentUser) {
      const t = {
        providerId: 'apple.com',
        tokenType: 'ACCESS_TOKEN',
        token: e,
        idToken: await this.currentUser.getIdToken(),
      };
      (null != this.tenantId && (t.tenantId = this.tenantId),
        await (async function (e, t) {
          return Rm(e, 'POST', '/v2/accounts:revokeToken', Om(e, t));
        })(this, t));
    }
  }
  toJSON() {
    var e;
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser: null === (e = this._currentUser) || void 0 === e ? void 0 : e.toJSON(),
    };
  }
  async _setRedirectUser(e, t) {
    const n = await this.getOrInitRedirectPersistenceManager(t);
    return null === e ? n.removeCurrentUser() : n.setCurrentUser(e);
  }
  async getOrInitRedirectPersistenceManager(e) {
    if (!this.redirectPersistenceManager) {
      const t = (e && ry(e)) || this._popupRedirectResolver;
      (Em(t, this, 'argument-error'),
        (this.redirectPersistenceManager = await ay.create(
          this,
          [ry(t._redirectPersistence)],
          'redirectUser'
        )),
        (this.redirectUser = await this.redirectPersistenceManager.getCurrentUser()));
    }
    return this.redirectPersistenceManager;
  }
  async _redirectUserForId(e) {
    var t, n;
    return (
      this._isInitialized && (await this.queue(async () => {})),
      (null === (t = this._currentUser) || void 0 === t ? void 0 : t._redirectEventId) === e
        ? this._currentUser
        : (null === (n = this.redirectUser) || void 0 === n ? void 0 : n._redirectEventId) === e
          ? this.redirectUser
          : null
    );
  }
  async _persistUserIfCurrent(e) {
    if (e === this.currentUser) return this.queue(async () => this.directlySetCurrentUser(e));
  }
  _notifyListenersIfCurrent(e) {
    e === this.currentUser && this.notifyAuthListeners();
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
  }
  _startProactiveRefresh() {
    ((this.isProactiveRefreshEnabled = !0),
      this.currentUser && this._currentUser._startProactiveRefresh());
  }
  _stopProactiveRefresh() {
    ((this.isProactiveRefreshEnabled = !1),
      this.currentUser && this._currentUser._stopProactiveRefresh());
  }
  get _currentUser() {
    return this.currentUser;
  }
  notifyAuthListeners() {
    var e, t;
    if (!this._isInitialized) return;
    this.idTokenSubscription.next(this.currentUser);
    const n =
      null !== (t = null === (e = this.currentUser) || void 0 === e ? void 0 : e.uid) &&
      void 0 !== t
        ? t
        : null;
    this.lastNotifiedUid !== n &&
      ((this.lastNotifiedUid = n), this.authStateSubscription.next(this.currentUser));
  }
  registerStateListener(e, t, n, r) {
    if (this._deleted) return () => {};
    const i = 'function' == typeof t ? t : t.next.bind(t);
    let s = !1;
    const o = this._isInitialized ? Promise.resolve() : this._initializationPromise;
    if (
      (Em(o, this, 'internal-error'),
      o.then(() => {
        s || i(this.currentUser);
      }),
      'function' == typeof t)
    ) {
      const i = e.addObserver(t, n, r);
      return () => {
        ((s = !0), i());
      };
    }
    {
      const n = e.addObserver(t);
      return () => {
        ((s = !0), n());
      };
    }
  }
  async directlySetCurrentUser(e) {
    (this.currentUser && this.currentUser !== e && this._currentUser._stopProactiveRefresh(),
      e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(),
      (this.currentUser = e),
      e
        ? await this.assertedPersistence.setCurrentUser(e)
        : await this.assertedPersistence.removeCurrentUser());
  }
  queue(e) {
    return ((this.operations = this.operations.then(e, e)), this.operations);
  }
  get assertedPersistence() {
    return (Em(this.persistenceManager, this, 'internal-error'), this.persistenceManager);
  }
  _logFramework(e) {
    e &&
      !this.frameworks.includes(e) &&
      (this.frameworks.push(e),
      this.frameworks.sort(),
      (this.clientVersion = uy(this.config.clientPlatform, this._getFrameworks())));
  }
  _getFrameworks() {
    return this.frameworks;
  }
  async _getAdditionalHeaders() {
    var e;
    const t = { 'X-Client-Version': this.clientVersion };
    this.app.options.appId && (t['X-Firebase-gmpid'] = this.app.options.appId);
    const n = await (null === (e = this.heartbeatServiceProvider.getImmediate({ optional: !0 })) ||
    void 0 === e
      ? void 0
      : e.getHeartbeatsHeader());
    n && (t['X-Firebase-Client'] = n);
    const r = await this._getAppCheckToken();
    return (r && (t['X-Firebase-AppCheck'] = r), t);
  }
  async _getAppCheckToken() {
    var e;
    const t = await (null === (e = this.appCheckServiceProvider.getImmediate({ optional: !0 })) ||
    void 0 === e
      ? void 0
      : e.getToken());
    return (
      (null == t ? void 0 : t.error) &&
        (function (e, ...t) {
          ym.logLevel <= Pe.WARN && ym.warn(`Auth (10.11.0): ${e}`, ...t);
        })(`Error while retrieving App Check token: ${t.error}`),
      null == t ? void 0 : t.token
    );
  }
}
function fy(e) {
  return De(e);
}
class py {
  constructor(e) {
    ((this.auth = e),
      (this.observer = null),
      (this.addObserver = (function (e, t) {
        const n = new Ae(e, void 0);
        return n.subscribe.bind(n);
      })(e => (this.observer = e))));
  }
  get next() {
    return (Em(this.observer, this.auth, 'internal-error'), this.observer.next.bind(this.observer));
  }
}
let gy = {
  async loadJS() {
    throw new Error('Unable to load external scripts');
  },
  recaptchaV2Script: '',
  recaptchaEnterpriseScript: '',
  gapiScript: '',
};
class my {
  constructor(e) {
    ((this.type = 'recaptcha-enterprise'), (this.auth = fy(e)));
  }
  async verify(e = 'verify', t = !1) {
    function n(t, n, r) {
      const i = window.grecaptcha;
      Bm(i)
        ? i.enterprise.ready(() => {
            i.enterprise
              .execute(t, { action: e })
              .then(e => {
                n(e);
              })
              .catch(() => {
                n('NO_RECAPTCHA');
              });
          })
        : r(Error('No reCAPTCHA enterprise script loaded.'));
    }
    return new Promise((e, r) => {
      (async function (e) {
        if (!t) {
          if (null == e.tenantId && null != e._agentRecaptchaConfig)
            return e._agentRecaptchaConfig.siteKey;
          if (null != e.tenantId && void 0 !== e._tenantRecaptchaConfigs[e.tenantId])
            return e._tenantRecaptchaConfigs[e.tenantId].siteKey;
        }
        return new Promise(async (t, n) => {
          (async function (e, t) {
            return Rm(e, 'GET', '/v2/recaptchaConfig', Om(e, t));
          })(e, { clientType: 'CLIENT_TYPE_WEB', version: 'RECAPTCHA_ENTERPRISE' })
            .then(r => {
              if (void 0 !== r.recaptchaKey) {
                const n = new jm(r);
                return (
                  null == e.tenantId
                    ? (e._agentRecaptchaConfig = n)
                    : (e._tenantRecaptchaConfigs[e.tenantId] = n),
                  t(n.siteKey)
                );
              }
              n(new Error('recaptcha Enterprise site key undefined'));
            })
            .catch(e => {
              n(e);
            });
        });
      })(this.auth)
        .then(i => {
          if (!t && Bm(window.grecaptcha)) n(i, e, r);
          else {
            if ('undefined' == typeof window)
              return void r(new Error('RecaptchaVerifier is only supported in browser'));
            let t = gy.recaptchaEnterpriseScript;
            (0 !== t.length && (t += i),
              (function (e) {
                return gy.loadJS(e);
              })(t)
                .then(() => {
                  n(i, e, r);
                })
                .catch(e => {
                  r(e);
                }));
          }
        })
        .catch(e => {
          r(e);
        });
    });
  }
}
async function yy(e, t, n, r = !1) {
  const i = new my(e);
  let s;
  try {
    s = await i.verify(n);
  } catch (e) {
    s = await i.verify(n, !0);
  }
  const o = Object.assign({}, t);
  return (
    r ? Object.assign(o, { captchaResp: s }) : Object.assign(o, { captchaResponse: s }),
    Object.assign(o, { clientType: 'CLIENT_TYPE_WEB' }),
    Object.assign(o, { recaptchaVersion: 'RECAPTCHA_ENTERPRISE' }),
    o
  );
}
async function wy(e, t, n, r) {
  var i;
  if (
    null === (i = e._getRecaptchaConfig()) || void 0 === i
      ? void 0
      : i.isProviderEnabled('EMAIL_PASSWORD_PROVIDER')
  ) {
    const i = await yy(e, t, n, 'getOobCode' === n);
    return r(e, i);
  }
  return r(e, t).catch(async i => {
    if ('auth/missing-recaptcha-token' === i.code) {
      console.log(
        `${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`
      );
      const i = await yy(e, t, n, 'getOobCode' === n);
      return r(e, i);
    }
    return Promise.reject(i);
  });
}
function vy(e) {
  const t = e.indexOf(':');
  return t < 0 ? '' : e.substr(0, t + 1);
}
function by(e) {
  if (!e) return null;
  const t = Number(e);
  return isNaN(t) ? null : t;
}
class Iy {
  constructor(e, t) {
    ((this.providerId = e), (this.signInMethod = t));
  }
  toJSON() {
    return Sm('not implemented');
  }
  _getIdTokenResponse(e) {
    return Sm('not implemented');
  }
  _linkToIdToken(e, t) {
    return Sm('not implemented');
  }
  _getReauthenticationResolver(e) {
    return Sm('not implemented');
  }
}
async function Ty(e, t) {
  return Rm(e, 'POST', '/v1/accounts:signUp', t);
}
async function _y(e, t) {
  return Mm(e, 'POST', '/v1/accounts:signInWithPassword', Om(e, t));
}
class Ey extends Iy {
  constructor(e, t, n, r = null) {
    (super('password', n), (this._email = e), (this._password = t), (this._tenantId = r));
  }
  static _fromEmailAndPassword(e, t) {
    return new Ey(e, t, 'password');
  }
  static _fromEmailAndCode(e, t, n = null) {
    return new Ey(e, t, 'emailLink', n);
  }
  toJSON() {
    return {
      email: this._email,
      password: this._password,
      signInMethod: this.signInMethod,
      tenantId: this._tenantId,
    };
  }
  static fromJSON(e) {
    const t = 'string' == typeof e ? JSON.parse(e) : e;
    if ((null == t ? void 0 : t.email) && (null == t ? void 0 : t.password)) {
      if ('password' === t.signInMethod) return this._fromEmailAndPassword(t.email, t.password);
      if ('emailLink' === t.signInMethod)
        return this._fromEmailAndCode(t.email, t.password, t.tenantId);
    }
    return null;
  }
  async _getIdTokenResponse(e) {
    switch (this.signInMethod) {
      case 'password':
        return wy(
          e,
          {
            returnSecureToken: !0,
            email: this._email,
            password: this._password,
            clientType: 'CLIENT_TYPE_WEB',
          },
          'signInWithPassword',
          _y
        );
      case 'emailLink':
        return (async function (e, t) {
          return Mm(e, 'POST', '/v1/accounts:signInWithEmailLink', Om(e, t));
        })(e, { email: this._email, oobCode: this._password });
      default:
        vm(e, 'internal-error');
    }
  }
  async _linkToIdToken(e, t) {
    switch (this.signInMethod) {
      case 'password':
        return wy(
          e,
          {
            idToken: t,
            returnSecureToken: !0,
            email: this._email,
            password: this._password,
            clientType: 'CLIENT_TYPE_WEB',
          },
          'signUpPassword',
          Ty
        );
      case 'emailLink':
        return (async function (e, t) {
          return Mm(e, 'POST', '/v1/accounts:signInWithEmailLink', Om(e, t));
        })(e, { idToken: t, email: this._email, oobCode: this._password });
      default:
        vm(e, 'internal-error');
    }
  }
  _getReauthenticationResolver(e) {
    return this._getIdTokenResponse(e);
  }
}
async function Sy(e, t) {
  return Mm(e, 'POST', '/v1/accounts:signInWithIdp', Om(e, t));
}
class Cy extends Iy {
  constructor() {
    (super(...arguments), (this.pendingToken = null));
  }
  static _fromParams(e) {
    const t = new Cy(e.providerId, e.signInMethod);
    return (
      e.idToken || e.accessToken
        ? (e.idToken && (t.idToken = e.idToken),
          e.accessToken && (t.accessToken = e.accessToken),
          e.nonce && !e.pendingToken && (t.nonce = e.nonce),
          e.pendingToken && (t.pendingToken = e.pendingToken))
        : e.oauthToken && e.oauthTokenSecret
          ? ((t.accessToken = e.oauthToken), (t.secret = e.oauthTokenSecret))
          : vm('argument-error'),
      t
    );
  }
  toJSON() {
    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      secret: this.secret,
      nonce: this.nonce,
      pendingToken: this.pendingToken,
      providerId: this.providerId,
      signInMethod: this.signInMethod,
    };
  }
  static fromJSON(e) {
    const t = 'string' == typeof e ? JSON.parse(e) : e,
      { providerId: n, signInMethod: r } = t,
      i = pm(t, ['providerId', 'signInMethod']);
    if (!n || !r) return null;
    const s = new Cy(n, r);
    return (
      (s.idToken = i.idToken || void 0),
      (s.accessToken = i.accessToken || void 0),
      (s.secret = i.secret),
      (s.nonce = i.nonce),
      (s.pendingToken = i.pendingToken || null),
      s
    );
  }
  _getIdTokenResponse(e) {
    return Sy(e, this.buildRequest());
  }
  _linkToIdToken(e, t) {
    const n = this.buildRequest();
    return ((n.idToken = t), Sy(e, n));
  }
  _getReauthenticationResolver(e) {
    const t = this.buildRequest();
    return ((t.autoCreate = !1), Sy(e, t));
  }
  buildRequest() {
    const e = { requestUri: 'http://localhost', returnSecureToken: !0 };
    if (this.pendingToken) e.pendingToken = this.pendingToken;
    else {
      const t = {};
      (this.idToken && (t.id_token = this.idToken),
        this.accessToken && (t.access_token = this.accessToken),
        this.secret && (t.oauth_token_secret = this.secret),
        (t.providerId = this.providerId),
        this.nonce && !this.pendingToken && (t.nonce = this.nonce),
        (e.postBody = Ee(t)));
    }
    return e;
  }
}
class Ay {
  constructor(e) {
    var t, n, r, i, s, o;
    const a = Se(Ce(e)),
      c = null !== (t = a.apiKey) && void 0 !== t ? t : null,
      u = null !== (n = a.oobCode) && void 0 !== n ? n : null,
      l = (function (e) {
        switch (e) {
          case 'recoverEmail':
            return 'RECOVER_EMAIL';
          case 'resetPassword':
            return 'PASSWORD_RESET';
          case 'signIn':
            return 'EMAIL_SIGNIN';
          case 'verifyEmail':
            return 'VERIFY_EMAIL';
          case 'verifyAndChangeEmail':
            return 'VERIFY_AND_CHANGE_EMAIL';
          case 'revertSecondFactorAddition':
            return 'REVERT_SECOND_FACTOR_ADDITION';
          default:
            return null;
        }
      })(null !== (r = a.mode) && void 0 !== r ? r : null);
    (Em(c && u && l, 'argument-error'),
      (this.apiKey = c),
      (this.operation = l),
      (this.code = u),
      (this.continueUrl = null !== (i = a.continueUrl) && void 0 !== i ? i : null),
      (this.languageCode = null !== (s = a.languageCode) && void 0 !== s ? s : null),
      (this.tenantId = null !== (o = a.tenantId) && void 0 !== o ? o : null));
  }
  static parseLink(e) {
    const t = (function (e) {
      const t = Se(Ce(e)).link,
        n = t ? Se(Ce(t)).deep_link_id : null,
        r = Se(Ce(e)).deep_link_id;
      return (r ? Se(Ce(r)).link : null) || r || n || t || e;
    })(e);
    try {
      return new Ay(t);
    } catch (e) {
      return null;
    }
  }
}
class ky {
  constructor() {
    this.providerId = ky.PROVIDER_ID;
  }
  static credential(e, t) {
    return Ey._fromEmailAndPassword(e, t);
  }
  static credentialWithLink(e, t) {
    const n = Ay.parseLink(t);
    return (Em(n, 'argument-error'), Ey._fromEmailAndCode(e, n.code, n.tenantId));
  }
}
((ky.PROVIDER_ID = 'password'),
  (ky.EMAIL_PASSWORD_SIGN_IN_METHOD = 'password'),
  (ky.EMAIL_LINK_SIGN_IN_METHOD = 'emailLink'));
class Dy extends class {
  constructor(e) {
    ((this.providerId = e), (this.defaultLanguageCode = null), (this.customParameters = {}));
  }
  setDefaultLanguage(e) {
    this.defaultLanguageCode = e;
  }
  setCustomParameters(e) {
    return ((this.customParameters = e), this);
  }
  getCustomParameters() {
    return this.customParameters;
  }
} {
  constructor() {
    (super(...arguments), (this.scopes = []));
  }
  addScope(e) {
    return (this.scopes.includes(e) || this.scopes.push(e), this);
  }
  getScopes() {
    return [...this.scopes];
  }
}
class xy extends Dy {
  constructor() {
    super('facebook.com');
  }
  static credential(e) {
    return Cy._fromParams({
      providerId: xy.PROVIDER_ID,
      signInMethod: xy.FACEBOOK_SIGN_IN_METHOD,
      accessToken: e,
    });
  }
  static credentialFromResult(e) {
    return xy.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return xy.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e || !('oauthAccessToken' in e)) return null;
    if (!e.oauthAccessToken) return null;
    try {
      return xy.credential(e.oauthAccessToken);
    } catch (e) {
      return null;
    }
  }
}
((xy.FACEBOOK_SIGN_IN_METHOD = 'facebook.com'), (xy.PROVIDER_ID = 'facebook.com'));
class Ny extends Dy {
  constructor() {
    (super('google.com'), this.addScope('profile'));
  }
  static credential(e, t) {
    return Cy._fromParams({
      providerId: Ny.PROVIDER_ID,
      signInMethod: Ny.GOOGLE_SIGN_IN_METHOD,
      idToken: e,
      accessToken: t,
    });
  }
  static credentialFromResult(e) {
    return Ny.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return Ny.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e) return null;
    const { oauthIdToken: t, oauthAccessToken: n } = e;
    if (!t && !n) return null;
    try {
      return Ny.credential(t, n);
    } catch (e) {
      return null;
    }
  }
}
((Ny.GOOGLE_SIGN_IN_METHOD = 'google.com'), (Ny.PROVIDER_ID = 'google.com'));
class Oy extends Dy {
  constructor() {
    super('github.com');
  }
  static credential(e) {
    return Cy._fromParams({
      providerId: Oy.PROVIDER_ID,
      signInMethod: Oy.GITHUB_SIGN_IN_METHOD,
      accessToken: e,
    });
  }
  static credentialFromResult(e) {
    return Oy.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return Oy.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e || !('oauthAccessToken' in e)) return null;
    if (!e.oauthAccessToken) return null;
    try {
      return Oy.credential(e.oauthAccessToken);
    } catch (e) {
      return null;
    }
  }
}
((Oy.GITHUB_SIGN_IN_METHOD = 'github.com'), (Oy.PROVIDER_ID = 'github.com'));
class Ry extends Dy {
  constructor() {
    super('twitter.com');
  }
  static credential(e, t) {
    return Cy._fromParams({
      providerId: Ry.PROVIDER_ID,
      signInMethod: Ry.TWITTER_SIGN_IN_METHOD,
      oauthToken: e,
      oauthTokenSecret: t,
    });
  }
  static credentialFromResult(e) {
    return Ry.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return Ry.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e) return null;
    const { oauthAccessToken: t, oauthTokenSecret: n } = e;
    if (!t || !n) return null;
    try {
      return Ry.credential(t, n);
    } catch (e) {
      return null;
    }
  }
}
((Ry.TWITTER_SIGN_IN_METHOD = 'twitter.com'), (Ry.PROVIDER_ID = 'twitter.com'));
class Py {
  constructor(e) {
    ((this.user = e.user),
      (this.providerId = e.providerId),
      (this._tokenResponse = e._tokenResponse),
      (this.operationType = e.operationType));
  }
  static async _fromIdTokenResponse(e, t, n, r = !1) {
    const i = await ty._fromIdTokenResponse(e, n, r),
      s = My(n);
    return new Py({ user: i, providerId: s, _tokenResponse: n, operationType: t });
  }
  static async _forOperation(e, t, n) {
    await e._updateTokensIfNecessary(n, !0);
    const r = My(n);
    return new Py({ user: e, providerId: r, _tokenResponse: n, operationType: t });
  }
}
function My(e) {
  return e.providerId ? e.providerId : 'phoneNumber' in e ? 'phone' : null;
}
new WeakMap();
class Ly {
  constructor(e) {
    ((this.eventTarget = e),
      (this.handlersMap = {}),
      (this.boundEventHandler = this.handleEvent.bind(this)));
  }
  static _getInstance(e) {
    const t = this.receivers.find(t => t.isListeningto(e));
    if (t) return t;
    const n = new Ly(e);
    return (this.receivers.push(n), n);
  }
  isListeningto(e) {
    return this.eventTarget === e;
  }
  async handleEvent(e) {
    const t = e,
      { eventId: n, eventType: r, data: i } = t.data,
      s = this.handlersMap[r];
    if (!(null == s ? void 0 : s.size)) return;
    t.ports[0].postMessage({ status: 'ack', eventId: n, eventType: r });
    const o = Array.from(s).map(async e => e(t.origin, i)),
      a = await (function (e) {
        return Promise.all(
          e.map(async e => {
            try {
              return { fulfilled: !0, value: await e };
            } catch (e) {
              return { fulfilled: !1, reason: e };
            }
          })
        );
      })(o);
    t.ports[0].postMessage({ status: 'done', eventId: n, eventType: r, response: a });
  }
  _subscribe(e, t) {
    (0 === Object.keys(this.handlersMap).length &&
      this.eventTarget.addEventListener('message', this.boundEventHandler),
      this.handlersMap[e] || (this.handlersMap[e] = new Set()),
      this.handlersMap[e].add(t));
  }
  _unsubscribe(e, t) {
    (this.handlersMap[e] && t && this.handlersMap[e].delete(t),
      (t && 0 !== this.handlersMap[e].size) || delete this.handlersMap[e],
      0 === Object.keys(this.handlersMap).length &&
        this.eventTarget.removeEventListener('message', this.boundEventHandler));
  }
}
Ly.receivers = [];
class Fy {
  constructor(e) {
    ((this.target = e), (this.handlers = new Set()));
  }
  removeMessageHandler(e) {
    (e.messageChannel &&
      (e.messageChannel.port1.removeEventListener('message', e.onMessage),
      e.messageChannel.port1.close()),
      this.handlers.delete(e));
  }
  async _send(e, t, n = 50) {
    const r = 'undefined' != typeof MessageChannel ? new MessageChannel() : null;
    if (!r) throw new Error('connection_unavailable');
    let i, s;
    return new Promise((o, a) => {
      const c = (function (e = '', t = 10) {
        let n = '';
        for (let e = 0; e < t; e++) n += Math.floor(10 * Math.random());
        return e + n;
      })('', 20);
      r.port1.start();
      const u = setTimeout(() => {
        a(new Error('unsupported_event'));
      }, n);
      ((s = {
        messageChannel: r,
        onMessage(e) {
          const t = e;
          if (t.data.eventId === c)
            switch (t.data.status) {
              case 'ack':
                (clearTimeout(u),
                  (i = setTimeout(() => {
                    a(new Error('timeout'));
                  }, 3e3)));
                break;
              case 'done':
                (clearTimeout(i), o(t.data.response));
                break;
              default:
                (clearTimeout(u), clearTimeout(i), a(new Error('invalid_response')));
            }
        },
      }),
        this.handlers.add(s),
        r.port1.addEventListener('message', s.onMessage),
        this.target.postMessage({ eventType: e, eventId: c, data: t }, [r.port2]));
    }).finally(() => {
      s && this.removeMessageHandler(s);
    });
  }
}
function Uy() {
  return window;
}
function Vy() {
  return void 0 !== Uy().WorkerGlobalScope && 'function' == typeof Uy().importScripts;
}
class By {
  constructor(e) {
    this.request = e;
  }
  toPromise() {
    return new Promise((e, t) => {
      (this.request.addEventListener('success', () => {
        e(this.request.result);
      }),
        this.request.addEventListener('error', () => {
          t(this.request.error);
        }));
    });
  }
}
function jy(e, t) {
  return e
    .transaction(['firebaseLocalStorage'], t ? 'readwrite' : 'readonly')
    .objectStore('firebaseLocalStorage');
}
function zy() {
  const e = indexedDB.open('firebaseLocalStorageDb', 1);
  return new Promise((t, n) => {
    (e.addEventListener('error', () => {
      n(e.error);
    }),
      e.addEventListener('upgradeneeded', () => {
        const t = e.result;
        try {
          t.createObjectStore('firebaseLocalStorage', { keyPath: 'fbase_key' });
        } catch (e) {
          n(e);
        }
      }),
      e.addEventListener('success', async () => {
        const n = e.result;
        n.objectStoreNames.contains('firebaseLocalStorage')
          ? t(n)
          : (n.close(),
            await (function () {
              const e = indexedDB.deleteDatabase('firebaseLocalStorageDb');
              return new By(e).toPromise();
            })(),
            t(await zy()));
      }));
  });
}
async function qy(e, t, n) {
  const r = jy(e, !0).put({ fbase_key: t, value: n });
  return new By(r).toPromise();
}
function Gy(e, t) {
  const n = jy(e, !0).delete(t);
  return new By(n).toPromise();
}
class $y {
  constructor() {
    ((this.type = 'LOCAL'),
      (this._shouldAllowMigration = !0),
      (this.listeners = {}),
      (this.localCache = {}),
      (this.pollTimer = null),
      (this.pendingWrites = 0),
      (this.receiver = null),
      (this.sender = null),
      (this.serviceWorkerReceiverAvailable = !1),
      (this.activeServiceWorker = null),
      (this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(
        () => {},
        () => {}
      )));
  }
  async _openDb() {
    return (this.db || (this.db = await zy()), this.db);
  }
  async _withRetries(e) {
    let t = 0;
    for (;;)
      try {
        const t = await this._openDb();
        return await e(t);
      } catch (e) {
        if (t++ > 3) throw e;
        this.db && (this.db.close(), (this.db = void 0));
      }
  }
  async initializeServiceWorkerMessaging() {
    return Vy() ? this.initializeReceiver() : this.initializeSender();
  }
  async initializeReceiver() {
    ((this.receiver = Ly._getInstance(Vy() ? self : null)),
      this.receiver._subscribe('keyChanged', async (e, t) => ({
        keyProcessed: (await this._poll()).includes(t.key),
      })),
      this.receiver._subscribe('ping', async (e, t) => ['keyChanged']));
  }
  async initializeSender() {
    var e, t;
    if (
      ((this.activeServiceWorker = await (async function () {
        if (!(null === navigator || void 0 === navigator ? void 0 : navigator.serviceWorker))
          return null;
        try {
          return (await navigator.serviceWorker.ready).active;
        } catch (e) {
          return null;
        }
      })()),
      !this.activeServiceWorker)
    )
      return;
    this.sender = new Fy(this.activeServiceWorker);
    const n = await this.sender._send('ping', {}, 800);
    n &&
      (null === (e = n[0]) || void 0 === e ? void 0 : e.fulfilled) &&
      (null === (t = n[0]) || void 0 === t ? void 0 : t.value.includes('keyChanged')) &&
      (this.serviceWorkerReceiverAvailable = !0);
  }
  async notifyServiceWorker(e) {
    var t;
    if (
      this.sender &&
      this.activeServiceWorker &&
      ((null ===
        (t = null === navigator || void 0 === navigator ? void 0 : navigator.serviceWorker) ||
      void 0 === t
        ? void 0
        : t.controller) || null) === this.activeServiceWorker
    )
      try {
        await this.sender._send(
          'keyChanged',
          { key: e },
          this.serviceWorkerReceiverAvailable ? 800 : 50
        );
      } catch (t) {}
  }
  async _isAvailable() {
    try {
      if (!indexedDB) return !1;
      const e = await zy();
      return (await qy(e, '__sak', '1'), await Gy(e, '__sak'), !0);
    } catch (e) {}
    return !1;
  }
  async _withPendingWrite(e) {
    this.pendingWrites++;
    try {
      await e();
    } finally {
      this.pendingWrites--;
    }
  }
  async _set(e, t) {
    return this._withPendingWrite(
      async () => (
        await this._withRetries(n => qy(n, e, t)),
        (this.localCache[e] = t),
        this.notifyServiceWorker(e)
      )
    );
  }
  async _get(e) {
    const t = await this._withRetries(t =>
      (async function (e, t) {
        const n = jy(e, !1).get(t),
          r = await new By(n).toPromise();
        return void 0 === r ? null : r.value;
      })(t, e)
    );
    return ((this.localCache[e] = t), t);
  }
  async _remove(e) {
    return this._withPendingWrite(
      async () => (
        await this._withRetries(t => Gy(t, e)),
        delete this.localCache[e],
        this.notifyServiceWorker(e)
      )
    );
  }
  async _poll() {
    const e = await this._withRetries(e => {
      const t = jy(e, !1).getAll();
      return new By(t).toPromise();
    });
    if (!e) return [];
    if (0 !== this.pendingWrites) return [];
    const t = [],
      n = new Set();
    if (0 !== e.length)
      for (const { fbase_key: r, value: i } of e)
        (n.add(r),
          JSON.stringify(this.localCache[r]) !== JSON.stringify(i) &&
            (this.notifyListeners(r, i), t.push(r)));
    for (const e of Object.keys(this.localCache))
      this.localCache[e] && !n.has(e) && (this.notifyListeners(e, null), t.push(e));
    return t;
  }
  notifyListeners(e, t) {
    this.localCache[e] = t;
    const n = this.listeners[e];
    if (n) for (const e of Array.from(n)) e(t);
  }
  startPolling() {
    (this.stopPolling(), (this.pollTimer = setInterval(async () => this._poll(), 800)));
  }
  stopPolling() {
    this.pollTimer && (clearInterval(this.pollTimer), (this.pollTimer = null));
  }
  _addListener(e, t) {
    (0 === Object.keys(this.listeners).length && this.startPolling(),
      this.listeners[e] || ((this.listeners[e] = new Set()), this._get(e)),
      this.listeners[e].add(t));
  }
  _removeListener(e, t) {
    (this.listeners[e] &&
      (this.listeners[e].delete(t), 0 === this.listeners[e].size && delete this.listeners[e]),
      0 === Object.keys(this.listeners).length && this.stopPolling());
  }
}
$y.type = 'LOCAL';
const Ky = $y;
class Wy {
  constructor(e) {
    ((this.auth = e), (this.internalListeners = new Map()));
  }
  getUid() {
    var e;
    return (
      this.assertAuthConfigured(),
      (null === (e = this.auth.currentUser) || void 0 === e ? void 0 : e.uid) || null
    );
  }
  async getToken(e) {
    return (
      this.assertAuthConfigured(),
      await this.auth._initializationPromise,
      this.auth.currentUser ? { accessToken: await this.auth.currentUser.getIdToken(e) } : null
    );
  }
  addAuthTokenListener(e) {
    if ((this.assertAuthConfigured(), this.internalListeners.has(e))) return;
    const t = this.auth.onIdTokenChanged(t => {
      e((null == t ? void 0 : t.stsTokenManager.accessToken) || null);
    });
    (this.internalListeners.set(e, t), this.updateProactiveRefresh());
  }
  removeAuthTokenListener(e) {
    this.assertAuthConfigured();
    const t = this.internalListeners.get(e);
    t && (this.internalListeners.delete(e), t(), this.updateProactiveRefresh());
  }
  assertAuthConfigured() {
    Em(this.auth._initializationPromise, 'dependent-sdk-initialized-before-auth');
  }
  updateProactiveRefresh() {
    this.internalListeners.size > 0
      ? this.auth._startProactiveRefresh()
      : this.auth._stopProactiveRefresh();
  }
}
function Hy(e = mt()) {
  const t = ht(e, 'auth');
  if (t.isInitialized()) return t.getImmediate();
  const n = (function (e, t) {
      const n = ht(e, 'auth');
      if (n.isInitialized()) {
        const e = n.getImmediate();
        if (Te(n.getOptions(), null != t ? t : {})) return e;
        vm(e, 'already-initialized');
      }
      return n.initialize({ options: t });
    })(e, { persistence: [Ky] }),
    r = fe('auth');
  return (
    r &&
      (function (e, t, n) {
        const r = fy(e);
        (Em(r._canInitEmulator, r, 'emulator-config-failed'),
          Em(/^https?:\/\//.test(t), r, 'invalid-emulator-scheme'));
        const i = !!(null == n ? void 0 : n.disableWarnings),
          s = vy(t),
          { host: o, port: a } = (function (e) {
            const t = vy(e),
              n = /(\/\/)?([^?#/]+)/.exec(e.substr(t.length));
            if (!n) return { host: '', port: null };
            const r = n[2].split('@').pop() || '',
              i = /^(\[[^\]]+\])(:|$)/.exec(r);
            if (i) {
              const e = i[1];
              return { host: e, port: by(r.substr(e.length + 1)) };
            }
            {
              const [e, t] = r.split(':');
              return { host: e, port: by(t) };
            }
          })(t),
          c = null === a ? '' : `:${a}`;
        ((r.config.emulator = { url: `${s}//${o}${c}/` }),
          (r.settings.appVerificationDisabledForTesting = !0),
          (r.emulatorConfig = Object.freeze({
            host: o,
            port: a,
            protocol: s.replace(':', ''),
            options: Object.freeze({ disableWarnings: i }),
          })),
          i ||
            (function () {
              function e() {
                const e = document.createElement('p'),
                  t = e.style;
                ((e.innerText =
                  'Running in emulator mode. Do not use with production credentials.'),
                  (t.position = 'fixed'),
                  (t.width = '100%'),
                  (t.backgroundColor = '#ffffff'),
                  (t.border = '.1em solid #000000'),
                  (t.color = '#b50000'),
                  (t.bottom = '0px'),
                  (t.left = '0px'),
                  (t.margin = '0px'),
                  (t.zIndex = '10000'),
                  (t.textAlign = 'center'),
                  e.classList.add('firebase-emulator-warning'),
                  document.body.appendChild(e));
              }
              ('undefined' != typeof console &&
                'function' == typeof console.info &&
                console.info(
                  'WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.'
                ),
                'undefined' != typeof window &&
                  'undefined' != typeof document &&
                  ('loading' === document.readyState
                    ? window.addEventListener('DOMContentLoaded', e)
                    : e()));
            })());
      })(n, `http://${r}`),
    n
  );
}
(lt(
  new xe(
    'auth',
    (e, { options: t }) => {
      const n = e.getProvider('app').getImmediate(),
        r = e.getProvider('heartbeat'),
        i = e.getProvider('app-check-internal'),
        { apiKey: s, authDomain: o } = n.options;
      Em(s && !s.includes(':'), 'invalid-api-key', { appName: n.name });
      const a = {
          apiKey: s,
          authDomain: o,
          clientPlatform: 'WebExtension',
          apiHost: 'identitytoolkit.googleapis.com',
          tokenApiHost: 'securetoken.googleapis.com',
          apiScheme: 'https',
          sdkClientVersion: uy('WebExtension'),
        },
        c = new dy(n, r, i, a);
      return (
        (function (e, t) {
          const n = (null == t ? void 0 : t.persistence) || [],
            r = (Array.isArray(n) ? n : [n]).map(ry);
          ((null == t ? void 0 : t.errorMap) && e._updateErrorMap(t.errorMap),
            e._initializeWithPersistence(r, null == t ? void 0 : t.popupRedirectResolver));
        })(c, t),
        c
      );
    },
    'PUBLIC'
  )
    .setInstantiationMode('EXPLICIT')
    .setInstanceCreatedCallback((e, t, n) => {
      e.getProvider('auth-internal').initialize();
    })
),
  lt(
    new xe(
      'auth-internal',
      e => {
        return ((t = fy(e.getProvider('auth').getImmediate())), new Wy(t));
        var t;
      },
      'PRIVATE'
    ).setInstantiationMode('EXPLICIT')
  ),
  yt('@firebase/auth', '1.7.1', 'web-extension'),
  yt('@firebase/auth', '1.7.1', 'esm2017'));
const Qy = {
  waitForPendingWrites: () =>
    (function (e) {
      const t = new po();
      return (
        e.asyncQueue.enqueueAndForget(async () =>
          (async function (e, t) {
            const n = lo(e);
            Lf(n.remoteStore) ||
              io(
                'SyncEngine',
                "The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled."
              );
            try {
              const e = await (function (e) {
                const t = lo(e);
                return t.persistence.runTransaction(
                  'Get highest unacknowledged batch id',
                  'readonly',
                  e => t.mutationQueue.getHighestUnacknowledgedBatchId(e)
                );
              })(n.localStore);
              if (-1 === e) return void t.resolve();
              const r = n.Ma.get(e) || [];
              (r.push(t), n.Ma.set(e, r));
            } catch (e) {
              const n = np(e, 'Initialization of waitForPendingWrites() operation failed');
              t.reject(n);
            }
          })(await Jp(e), t)
        ),
        t.promise
      );
    })(yg(og(Zy(), mg))),
  serverTimestamp: () => new Og('serverTimestamp'),
  getDocs: e =>
    (function (e) {
      e = og(e, ug);
      const t = og(e.firestore, mg),
        n = yg(t),
        r = new am(t);
      return (
        $g(e._query),
        (function (e, t, n = {}) {
          const r = new po();
          return (
            e.asyncQueue.enqueueAndForget(async () =>
              (function (e, t, n, r, i) {
                const s = new Wp({
                    next: n => {
                      (t.enqueueAndForget(() => up(e, o)),
                        n.fromCache && 'server' === r.source
                          ? i.reject(
                              new fo(
                                ho.UNAVAILABLE,
                                'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)'
                              )
                            )
                          : i.resolve(n));
                    },
                    error: e => i.reject(e),
                  }),
                  o = new gp(n, s, { includeMetadataChanges: !0, ta: !0 });
                return cp(e, o);
              })(await Zp(e), e.asyncQueue, t, n, r)
            ),
            r.promise
          );
        })(n, e._query).then(n => new sm(t, r, e, n))
      );
    })(e),
  getDoc: e =>
    (function (e) {
      e = og(e, lg);
      const t = og(e.firestore, mg);
      return (function (e, t, n = {}) {
        const r = new po();
        return (
          e.asyncQueue.enqueueAndForget(async () =>
            (function (e, t, n, r, i) {
              const s = new Wp({
                  next: s => {
                    t.enqueueAndForget(() => up(e, o));
                    const a = s.docs.has(n);
                    !a && s.fromCache
                      ? i.reject(
                          new fo(
                            ho.UNAVAILABLE,
                            'Failed to get document because the client is offline.'
                          )
                        )
                      : a && s.fromCache && r && 'server' === r.source
                        ? i.reject(
                            new fo(
                              ho.UNAVAILABLE,
                              'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)'
                            )
                          )
                        : i.resolve(s);
                  },
                  error: e => i.reject(e),
                }),
                o = new gp(ou(n.path), s, { includeMetadataChanges: !0, ta: !0 });
              return cp(e, o);
            })(await Zp(e), e.asyncQueue, t, n, r)
          ),
          r.promise
        );
      })(yg(t), e._key).then(n => lm(t, e, n));
    })(e),
  onSnapshot: (e, ...t) => cm(e, ...t),
  addDoc: (e, t) =>
    (function (e, t) {
      const n = og(e.firestore, mg),
        r = fg(e),
        i = tm(e.converter, t);
      return um(n, [
        xg(Dg(e.firestore), 'addDoc', r._key, i, null !== e.converter, {}).toMutation(
          r._key,
          Qu.exists(!1)
        ),
      ]).then(() => r);
    })(e, t),
  updateDoc: (e, ...t) =>
    (function (e, t, n, ...r) {
      e = og(e, lg);
      const i = og(e.firestore, mg),
        s = Dg(i);
      let o;
      return (
        (o =
          'string' == typeof (t = De(t)) || t instanceof bg
            ? (function (e, t, n, r, i, s) {
                const o = e.Cu(1, t, n),
                  a = [Fg(t, r, n)],
                  c = [i];
                if (s.length % 2 != 0)
                  throw new fo(
                    ho.INVALID_ARGUMENT,
                    `Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`
                  );
                for (let e = 0; e < s.length; e += 2) (a.push(Fg(t, s[e])), c.push(s[e + 1]));
                const u = [],
                  l = Ec.empty();
                for (let e = a.length - 1; e >= 0; --e)
                  if (!jg(u, a[e])) {
                    const t = a[e];
                    let n = c[e];
                    n = De(n);
                    const r = o.yu(t);
                    if (n instanceof Ng) u.push(t);
                    else {
                      const e = Rg(n, r);
                      null != e && (u.push(t), l.set(t, e));
                    }
                  }
                const h = new $a(u);
                return new Sg(l, h, o.fieldTransforms);
              })(s, 'updateDoc', e._key, t, n, r)
            : (function (e, t, n, r) {
                const i = e.Cu(1, t, n);
                Lg('Data must be an object, but it was:', i, r);
                const s = [],
                  o = Ec.empty();
                Fa(r, (e, r) => {
                  const a = Vg(t, e, n);
                  r = De(r);
                  const c = i.yu(a);
                  if (r instanceof Ng) s.push(a);
                  else {
                    const e = Rg(r, c);
                    null != e && (s.push(a), o.set(a, e));
                  }
                });
                const a = new $a(s);
                return new Sg(o, a, i.fieldTransforms);
              })(s, 'updateDoc', e._key, t)),
        um(i, [o.toMutation(e._key, Qu.exists(!0))])
      );
    })(e, ...t),
  setDoc: (e, t, n) =>
    (function (e, t, n) {
      e = og(e, lg);
      const r = og(e.firestore, mg),
        i = tm(e.converter, t, n);
      return um(r, [
        xg(Dg(r), 'setDoc', e._key, i, null !== e.converter, n).toMutation(e._key, Qu.none()),
      ]);
    })(e, t, n),
  deleteDoc: e => {
    return um(og((t = e).firestore, mg), [new cl(t._key, Qu.none())]);
    var t;
  },
  getFirestore: () => Zy(),
  getAuth: () => Hy(Yy),
  getIdToken: (e, t) =>
    (function (e, t = !1) {
      return De(e).getIdToken(t);
    })(e, t),
  getIdTokenResult: (e, t) => Gm(e, t),
  collection: (e, t, ...n) => dg(e, t, ...n),
  doc: (e, t, ...n) => fg(e, t, ...n),
  docExists: e => e.exists(),
  where: (e, t, n) =>
    (function (e, t, n) {
      const r = t,
        i = Gg('where', e);
      return Hg._create(i, r, n);
    })(e, t, n),
  orderBy: e =>
    (function (e, t = 'asc') {
      const n = t,
        r = Gg('orderBy', e);
      return Yg._create(r, n);
    })(e),
  limit: e => {
    return (
      (function (e, t) {
        if (t <= 0)
          throw new fo(
            ho.INVALID_ARGUMENT,
            `Function ${e}() requires a positive number, but it was: ${t}.`
          );
      })('limit', (t = e)),
      Xg._create('limit', t, 'F')
    );
    var t;
  },
  query: (e, ...t) =>
    (function (e, t, ...n) {
      let r = [];
      (t instanceof Kg && r.push(t),
        (r = r.concat(n)),
        (function (e) {
          const t = e.filter(e => e instanceof Qg).length,
            n = e.filter(e => e instanceof Hg).length;
          if (t > 1 || (t > 0 && n > 0))
            throw new fo(
              ho.INVALID_ARGUMENT,
              'InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.'
            );
        })(r));
      for (const t of r) e = t._apply(e);
      return e;
    })(e, ...t),
  getFunctions: (e, t) =>
    (function (e = mt(), t = 'us-central1') {
      const n = ht(De(e), 'functions').getImmediate({ identifier: t }),
        r = (e => {
          const t = fe('functions');
          if (!t) return;
          const n = t.lastIndexOf(':');
          if (n <= 0 || n + 1 === t.length)
            throw new Error(`Invalid host ${t} with no separate hostname and port!`);
          const r = parseInt(t.substring(n + 1), 10);
          return '[' === t[0] ? [t.substring(1, n - 1), r] : [t.substring(0, n), r];
        })();
      return (
        r &&
          (function (e, t, n) {
            !(function (e, t, n) {
              e.emulatorOrigin = `http://${t}:${n}`;
            })(De(e), t, n);
          })(n, ...r),
        n
      );
    })(e, t),
  httpsCallable: (e, t, n) =>
    (function (e, t, n) {
      return Pt(De(e), t, n);
    })(e, t, n),
};
(!(async function () {
  const e = await Y('TEST_shouldhangfirebase');
  if ('string' != typeof e || !e.startsWith('hangFirebase')) return;
  Q('TEST_shouldhangfirebase', 'cleared');
  const t = +e.substring('hangFirebase'.length);
  console.log(`HANGING FIREBASE MANUALLY IN TEST MODE for ${t} seconds...`);
  let n = !1;
  const r = self.indexedDB.open.bind(self.indexedDB);
  ((self.indexedDB.open = (...e) => {
    const i = r(...e);
    if (n) return i;
    if ('firebase-heartbeat-database' === e[0]) return i;
    n = !0;
    const s = i.addEventListener.bind(i);
    return (
      (i.addEventListener = (...e) => {
        const [n, r, i] = e;
        return 'success' !== n || 'function' != typeof r
          ? s(...e)
          : s(
              'success',
              (...e) => {
                (console.log('Had success event', e),
                  setTimeout(() => {
                    (console.log('Calling listener after delay'), r(...e));
                  }, 1e3 * t));
              },
              i
            );
      }),
      i
    );
  }),
    setTimeout(() => {
      z({ title: '[TEST ONLY]', message: 'Firebase persistence hanged for ' + t });
    }, 500));
})(),
  n.setFirebaseDriver(Qy));
const Yy = gt({
  apiKey: 'AIzaSyA0_OH1h028rsgkdgJIEjVOSe8W9K3ZstQ',
  authDomain: 'blaze-today.firebaseapp.com',
  databaseURL: 'https://blaze-today.firebaseio.com',
  storageBucket: 'blaze-today.appspot.com',
  messagingSenderId: '435466840917',
  projectId: 'blaze-today',
});
let Xy;
function Jy() {
  var e;
  Xy = (function (e, t, n) {
    n || (n = '(default)');
    const r = ht(e, 'firestore');
    if (r.isInitialized(n)) {
      const e = r.getImmediate({ identifier: n });
      if (Te(r.getOptions(n), t)) return e;
      throw new fo(
        ho.FAILED_PRECONDITION,
        'initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.'
      );
    }
    if (void 0 !== t.cacheSizeBytes && void 0 !== t.localCache)
      throw new fo(
        ho.INVALID_ARGUMENT,
        'cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object'
      );
    if (void 0 !== t.cacheSizeBytes && -1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576)
      throw new fo(ho.INVALID_ARGUMENT, 'cacheSizeBytes must be at least 1048576');
    return r.initialize({ options: t, instanceIdentifier: n });
  })(Yy, {
    experimentalForceLongPolling: !0,
    localCache: ((e = { tabManager: fm({ forceOwnership: !0 }) }), new hm(e)),
  });
}
function Zy() {
  return Xy;
}
async function ew() {
  var e;
  await ((e = Xy),
  (function (e, t, n = '[DEFAULT]') {
    ht(e, t).clearInstance(n);
  })(e.app, 'firestore', e._databaseId.database),
  e._delete());
  const t = !self.window;
  (t && (self.window = self),
    await (function (e) {
      if (e._initialized && !e._terminated)
        throw new fo(
          ho.FAILED_PRECONDITION,
          'Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.'
        );
      const t = new po();
      return (
        e._queue.enqueueAndForgetEvenWhileRestricted(async () => {
          try {
            (await (async function (e) {
              if (!Wo.D()) return Promise.resolve();
              const t = e + 'main';
              await Wo.delete(t);
            })(Xd(e._databaseId, e._persistenceKey)),
              t.resolve());
          } catch (e) {
            t.reject(e);
          }
        }),
        t.promise
      );
    })(Xy),
    t && delete self.window,
    Jy());
}
(n.setFunctions(n.getTBFunctions(Yy)), Jy(), n.setFirebaseDriver({ getFirestore: Zy }));
class tw {
  constructor(e = !1) {
    ((this.lengthSortedActiveShortcuts = []),
      (this.isAnywhereSnippets = e),
      (this.trieObj = {}),
      (this.debouncedRebuildTrie = re(this.rebuildTrie.bind(this), 1e3)));
  }
  isAnywhereShortcut(e, t) {
    return t.some(t => 'anywhere' === e[t.group_id]?.data?.options?.trigger);
  }
  rebuildTrie(e, t) {
    ((this.lengthSortedActiveShortcuts = Object.keys(t).sort((e, t) => e.length - t.length)),
      this.isAnywhereSnippets &&
        (this.lengthSortedActiveShortcuts = this.lengthSortedActiveShortcuts.filter(n =>
          this.isAnywhereShortcut(e, t[n])
        )),
      (this.trieObj = Object.create(null)));
    for (let e = 0, t = this.lengthSortedActiveShortcuts.length; e < t; e++) {
      const t = this.lengthSortedActiveShortcuts[e].toLocaleLowerCase();
      for (let n = 1; n <= t.length; n++) {
        const r = t.substring(0, n);
        (r in this.trieObj || (this.trieObj[r] = []), this.trieObj[r].push(e));
      }
    }
  }
  getPrefixMatch(e) {
    const t = this.trieObj[e];
    return t?.length > 0 ? this.lengthSortedActiveShortcuts[t[0]] : null;
  }
  getPrefixMatches(e) {
    return (this.trieObj[e] || []).map(e => this.lengthSortedActiveShortcuts[e]);
  }
}
let nw,
  rw,
  iw,
  sw = { groups: [] };
const ow = n.throttle(function () {
  const e = kw().filter(e => !!e.data.name),
    t = { groups: [] };
  for (const n of e) {
    const e = { id: n.id, name: n.data.name, snippets: [], icon: n.data.options?.icon };
    (t.groups.push(e),
      n.snippets.forEach(t => {
        e.snippets.push({
          id: t.id,
          name: t.data.name,
          shortcut: t.data.shortcut,
          icon: t.data.options?.icon,
        });
      }));
  }
  n.equals(sw, t) ||
    ((sw = t),
    new Promise((e, t) => {
      r.contextMenus.removeAll(() => {
        ((rw = r.contextMenus.create({
          title: 'Text Blaze',
          contexts: ['all'],
          id: 'main-parent',
        })),
          r.contextMenus.create({
            title: 'Open Text Blaze Dashboard',
            contexts: ['all'],
            parentId: rw,
            id: 'open-dashboard',
          }),
          r.contextMenus.create({
            title: 'Reload Extension...',
            contexts: ['all'],
            parentId: rw,
            id: 'reload-extension',
          }),
          (iw = r.contextMenus.create({
            title: 'Edit Last Used Snippet...',
            contexts: ['all'],
            parentId: rw,
            id: 'edit-last-snippet',
            enabled: !1,
          })),
          r.contextMenus.create({
            title: 'Make Snippet from Selection...',
            contexts: ['selection'],
            parentId: rw,
            id: 'make-from-selection',
            enabled: !0,
          }),
          r.contextMenus.create({
            title: 'Right Click in a Textbox to Insert Snippets',
            contexts: ['page'],
            parentId: rw,
            id: 'not-editable-warning',
            enabled: !1,
          }),
          r.contextMenus.create(
            { type: 'separator', parentId: rw, contexts: ['editable'], id: 'the-separator' },
            () => e()
          ),
          Y('LAST_EXPANDED_SNIPPET_ID').then(e => {
            e && ((nw = e), aw(nw));
          }));
      });
    }).then(() => {
      const e = {};
      for (const t of sw.groups) {
        const n = t.icon,
          i = n && 'string' == typeof n ? n : '📁';
        e[t.id] = r.contextMenus.create({
          title: `${i} ${t.name}`,
          parentId: rw,
          contexts: ['editable'],
          id: t.id,
        });
      }
      for (const t of sw.groups) {
        const n = t.snippets.slice();
        for (const i of n)
          r.contextMenus.create({
            title: `${i.icon ? i.icon + ' ' : ''}${i.name} – ${i.shortcut}`,
            parentId: e[t.id],
            contexts: ['editable'],
            id: 'snippet-' + i.id,
          });
      }
    }));
}, 500);
function aw(e) {
  ((nw = e),
    Q('LAST_EXPANDED_SNIPPET_ID', nw),
    iw &&
      (e
        ? r.contextMenus.update(iw, { enabled: !0 })
        : r.contextMenus.update(iw, { enabled: !1 })));
}
r.contextMenus.onClicked.addListener(function (e, t) {
  const { menuItemId: i, frameId: s } = e;
  switch (i) {
    case 'open-dashboard':
      (n.log({ category: 'Extension', action: 'Open Blaze App', label: 'context menu' }), p());
      break;
    case 'reload-extension':
      Lw({
        title: 'Reload the Extension?',
        message: 'It may take 30 seconds to re-sync your snippets.',
        buttons: [
          {
            message: 'Reload',
            callback: () => {
              $();
            },
          },
        ],
        atMouse: !0,
        intent: 'info',
      });
      break;
    case 'edit-last-snippet':
      (n.log({ category: 'Extension', action: 'Edit last snippet' }), p('/snippet/' + nw));
      break;
    case 'make-from-selection':
      (n.log({ category: 'Extension', action: 'Create snippet from selection' }),
        S({
          func: () => window.getSelection().toString(),
          target: { tabId: t.id, allFrames: !1, frameIds: ['number' == typeof s ? s : 0] },
        })
          .then(function (e) {
            e[0]
              ? f({ text: e[0].result, shortcut: null, name: null }, 'contextmenu')
              : Lw({
                  message: 'Could not detect selection in page. Sorry.',
                  atMouse: !0,
                  intent: 'fail',
                });
          })
          .catch(() => {
            f({ text: e.selectionText, shortcut: null, name: null }, 'contextmenu');
          }));
  }
  'string' == typeof i &&
    i.startsWith('snippet-') &&
    (async function (e, t, i, s) {
      let o = i,
        a = s;
      o < 0
        ? Lw({
            title: 'Within Extension Popup',
            message: 'You cannot use Text Blaze within an extension popup.',
            intent: 'fail',
          })
        : (n.log({
            category: 'Extension',
            action: 'Select snippet from context menu',
            label: { id: e },
          }),
          r.tabs.sendMessage(
            o,
            {
              type: 'insert_snippet_separate_context',
              snippetId: e,
              insertionType: 'context_menu',
            },
            { frameId: a }
          ));
    })(i.substring('snippet-'.length), t.url, t.id, s);
});
const cw = [];
let uw = !1;
const lw = new tw(),
  hw = new tw(!0);
let dw,
  fw,
  pw,
  gw,
  mw = Object.create(null),
  yw = Object.create(null),
  ww = !1,
  vw = {};
self.userData = vw;
let bw = {};
self.configData = bw;
let Iw = !1;
function Tw() {
  return Iw;
}
function _w() {
  return !!Hy(Yy).currentUser;
}
const Ew = function () {
    return Tw() ? _w() : !!Bw()?.users_readonly?.uid;
  },
  Sw = function () {
    return Tw() ? Hy(Yy).currentUser.uid : Bw()?.users_readonly?.uid;
  };
n.storage.setStore({ uid: Sw });
const Cw = function () {
  if (Tw()) return Hy(Yy).currentUser?.emailVerified ? Hy(Yy).currentUser.email : null;
  const e = Bw()?.user_info;
  return e?.emailVerified ? e.email : null;
};
function Aw() {
  return { userState: vw, orgState: { org: xw.org && xw.org.data }, config: bw };
}
const kw = function () {
    return xw.getGroupIds({ order: !0 }).map(e => xw.groups[e]);
  },
  Dw = n.throttle(() => V({ type: 'updateAddons', cleanedActiveAddons: yw }), 10),
  xw = new n.Sync({
    storage: n.storage,
    log: n.log,
    isDashboard: !1,
    entityPostProcess: (e, t) => (
      'group' === e
        ? (t.options = Object.assign({ trigger: 'word' }, t.options || {}))
        : 'snippet' === e &&
          (t.delta
            ? t.delta instanceof Uint8Array ||
              (Array.isArray(t.delta)
                ? (t.delta = new Uint8Array(t.delta))
                : x('Invalid delta' + JSON.stringify(t.delta)))
            : (t.delta = t.content.delta.toUint8Array()),
          t.content || (t.content = {}),
          t.content.delta || (t.content.delta = { ops: [] })),
      t
    ),
    dispatch: function (e) {
      if ('DATA_CHANGE' === e.type)
        (ow(),
          (mw = xw.activeShortcuts({ includeAllAppGroups: !0, abSnippets: void 0 })),
          (yw = n.getCleanedAddons(xw.activeAddons())),
          Dw(),
          lw.debouncedRebuildTrie(xw.groups, mw),
          hw.debouncedRebuildTrie(xw.groups, mw),
          lv());
      else if (
        'GROUP_PERMISSION_DENIED' === e.type &&
        (console.warn('Permission denied to access group: ', e.groupId, e.errorCount),
        e.errorCount > 8)
      )
        return (console.warn('Ending attempt to access group: ', e.groupId), e.unSubscribe(), !0);
    },
    getUserState: () => vw,
    skipDisabledGroups: !0,
    tokenRefreshedCallback: () => {
      lv();
    },
    addAddonAttributes: function (e, t) {
      const n = t.content.delta.ops ? t.content.delta : null,
        r = n
          ? null
          : Array.from(
              t.content.delta.toUint8Array ? t.content.delta.toUint8Array() : t.content.delta
            );
      return V({
        type: 'addAddonAttributes',
        addonNamespace: e,
        data: t,
        deltaWithOps: n,
        deltaArray: r,
      });
    },
  });
function Nw() {
  const e = vw && vw.notifications;
  let t = !1;
  if (e) {
    const n = Object.entries(e).filter(
      e =>
        e[0].includes('___') && ('followup' !== e[0].split('___')[0] || e[1].timestamp < Date.now())
    ).length;
    t = n > 0;
  }
  w('hasNotification', t);
}
function Ow() {
  (aw(void 0),
    cw.forEach(e => e()),
    (vw = {}),
    (self.userData = vw),
    (bw = {}),
    (self.configData = bw),
    (self.cachedStorageData = null),
    n.setLogOrgID(null),
    fw && (fw(), (fw = null)),
    dw && (dw(), (dw = null), Nw()),
    pw && (pw(), (pw = null)),
    gw && (gw(), (gw = null)),
    xw.userChanges(),
    (ww = !1));
}
const Rw = async function () {
  if (!gw) {
    const e = fg(dg(Zy(), 'keys'), 'web_config');
    gw = cm(e, e => {
      e.exists() &&
        (Object.assign(bw, e.data()),
        'EXTENSION_UPGRADE_MESSAGE' in bw &&
          !e.data().EXTENSION_UPGRADE_MESSAGE &&
          delete bw.EXTENSION_UPGRADE_MESSAGE,
        uw ||
          (bw &&
            bw.MIN_EXTENSION_VERSION &&
            bw.EXTENSION_UPGRADE_MESSAGE &&
            bw.EXTENSION_UPGRADE_MESSAGE.length > 10 &&
            bw.MIN_EXTENSION_VERSION > 2 &&
            ((uw = !0),
            n.storage && !n.storage.dead && n.storage.kill(!0),
            Lw({ message: bw.EXTENSION_UPGRADE_MESSAGE, intent: 'fail' }))));
    });
  }
  (fw && (fw(), (fw = null)),
    (fw = n.storage.onSnapshot(
      fg(dg(Zy(), 'users_readonly'), Sw()),
      e => {
        if (e.exists()) {
          const t = e.data();
          (t.org || (t.org = null),
            t.teams || (t.teams = null),
            t.billing_alert || (t.billing_alert = null),
            (vw = Object.assign({}, vw, t, { uid: Sw(), readonlyLoaded: !0 })),
            xw.userChanges());
        } else vw = Object.assign({}, vw, { is_pro: !1, org: null, teams: null });
        ((self.userData = vw), n.setLogOrgID(vw.org && vw.org.id));
      },
      void 0,
      { includeMetadataChanges: !0 }
    )),
    dw && (dw(), (dw = null), Nw()),
    Cw() &&
      (dw = n.storage.onSnapshot(fg(dg(Zy(), 'users_notifications'), Cw()), e => {
        if (e.exists()) {
          const t = e.data() || {};
          ((vw.notifications = t), Nw());
        } else ((vw.notifications = null), Nw());
      })),
    pw && (pw(), (pw = null)),
    (pw = n.storage.onSnapshot(fg(dg(Zy(), 'users_settings'), Sw()), e => {
      if (e.exists()) {
        const t = vw.typing_timeout;
        (Object.assign(vw, e.data(), {
          uid: Sw(),
          firebaseMetadata: Tw()
            ? Hy(Yy).currentUser.metadata
            : Bw()?.users_readonly?.firebaseMetadata,
        }),
          void 0 === e.data().locale && (vw.locale = void 0),
          (ww = !0),
          xw.userChanges(),
          V({ type: 'setLocale', code: vw.locale }).then(e => {
            if ('ack' !== e) throw new Error('Locale set failed');
          }),
          (!t || (vw.typing_timeout && t.typing_timeout !== vw.typing_timeout)) &&
            r.tabs.query({}, function (e) {
              for (const t of e) O(t.id, { type: 'updateStreamTimeout', value: vw.typing_timeout });
            }));
      }
    })));
};
function Pw(e) {
  const t = vw?.snippet_volume;
  return U({ type: 'playSound', intent: e, volume: void 0 === t ? 0.5 : t });
}
function Mw() {
  Pw('complete');
}
async function Lw(e) {
  return ('fail' === e.intent ? Pw('fail') : 'info' === e.intent && Pw('intent'), z(e));
}
function Fw(e) {
  return (mw[e.toLocaleLowerCase()] || []).map(e => e.data);
}
let Uw = !1;
async function Vw() {
  try {
    const e = await n.storage.hasInitializedFromCache();
    return (Uw || ((Uw = !0), console.log(Date.now(), '[RESOLVED STORAGE]', JSON.stringify(e))), e);
  } catch (e) {
    return (Uw || ((Uw = !0), x(e)), 'FAILED');
  }
}
function Bw() {
  return self.cachedStorageData;
}
function jw() {
  if (Tw()) {
    const e = Hy(Yy).currentUser;
    return {
      email: e.email,
      name: e.displayName,
      imageUrl: e.photoURL,
      emailVerified: e.emailVerified,
      uid: e.uid,
    };
  }
  if (!n.getUserTokenFromCache()) return (x('Token expired for self user info'), null);
  const e = Bw()?.user_info;
  if (!e) return (x('Self user info is null'), null);
  const { token: t, ...r } = e;
  return r;
}
let zw = !1,
  qw = Promise.resolve();
function Gw() {
  ((zw = !1), (qw = Promise.resolve()), Hy(Yy).signOut(), Ow());
}
let $w = !!Hy(Yy)?.currentUser,
  Kw = !1,
  Ww = !1;
(setTimeout(() => {
  Tw() || ((Ww = !0), w('isNotLiveSynced', !0));
}, 1e4),
  setTimeout(() => {
    Tw() || (Kw = !0);
  }, 3e4),
  setTimeout(() => {
    Tw() ||
      n.withScope(e => {
        const t = Bw()?.users_readonly?.uid;
        (t && e.setUser({ id: t }),
          e.setExtras({ isUserLoggedInInitial: $w, nowLoggedIn: !!Hy(Yy)?.currentUser }),
          n.captureException(new Error('State for user not changed after 40 seconds')));
      });
  }, 4e4));
const Hw = new Promise(e => {
  var t;
  ((t = t => {
    ((Iw = !0),
      (Kw = !1),
      (Ww = !1),
      console.log(Date.now(), 'User exists', !!t),
      ov(t),
      (function (e) {
        (n.handleDetailsUpdate({ id: e }),
          n.setLogUID(e),
          U({ type: 'updateLoggerDetails', id: e }));
      })(t ? t.uid : null),
      w('isNotLiveSynced', !1),
      e());
  }),
    De(Hy(Yy)).onAuthStateChanged(t, undefined, undefined));
});
async function Qw(e = !1) {
  if (!e) {
    const e = n.getUserTokenFromCache()?.token;
    if (e) return e;
  }
  const t = Date.now() + 4e3;
  let r = 100;
  for (let n = 0; n < 11; n++) {
    const n = Hy(Yy).currentUser;
    if (n) return n.getIdToken(e);
    if (Date.now() > t) return null;
    (await C(r), (r *= 1.2));
  }
  return null;
}
function Yw() {
  return n.checkPro(Aw());
}
function Xw(e) {
  return n.checkPayingPro(Aw(), e);
}
function Jw() {
  return n.userMemberData(Cw(), Aw().orgState.org?.member_fields, vw?.member_fields_data);
}
function Zw() {
  return n.checkOrg(Aw());
}
r.runtime.onStartup.addListener(() => {
  (console.log(Date.now(), 'Browser startup'), Q('stored-user-data-logging', {}));
});
let ev = null,
  tv = null,
  nv = { uid: null, percent: null, startDate: null };
let rv,
  iv = { uid: null, isOldUser: null };
function sv(e) {
  let t = 'https://blaze.today/uninstall/?v=' + btoa(a()) + '&e=' + btoa(c());
  if ('signin' === e.type) t += '&i=' + btoa(e.uid);
  else if ('load' === e.type) {
    const e = Sw();
    e && (t += '&i=' + btoa(e));
  }
  r.runtime.setUninstallURL(t);
}
async function ov(e) {
  const t = e?.uid || null;
  (console.log('User state update', t),
    t !== rv &&
      ((rv = t),
      console.log('Running user state update'),
      e
        ? ((function () {
            const e = a(),
              t = c();
            (!(async function (e) {
              const t = await Y('stored-user-data-logging');
              if (!t?.data || !n.equals(t.data, e) || Date.now() - t.timestamp >= 432e5) {
                n.log(e);
                const t = { data: e, timestamp: Date.now() };
                await Q('stored-user-data-logging', t);
              }
            })({
              action: 'Extension Logged In',
              label: { ua: navigator.userAgent, ext_version: e, ext_id: t },
            }),
              r.action.setPopup({ popup: 'html/popup.html' }),
              w('loggedOut', !1),
              E(),
              _(!0),
              av(),
              Promise.race([uv, C(200)]).then(() => {
                Rw();
              }));
          })(),
          sv({ type: 'signin', uid: e.uid }))
        : (await (async function () {
            (await r.storage.local.clear(),
              (self.cachedStorageData = null),
              (self.cachedSidebarTriggers = null),
              r.action.setPopup({ popup: '' }),
              Q(cv, {}),
              Q('AI_CHAT_METADATA_2', {}),
              Q('AI_SIDEBAR_METADATA', {}),
              Ow(),
              w('loggedOut', !0),
              _(!1),
              av());
          })(),
          sv({ type: 'signout' }),
          ew()),
      xw.storage.initiateCacheTimeout('auth')));
}
async function av() {}
const cv = 'LOADED_DATA_CACHED',
  uv = new Promise(e => {
    Y(cv).then(t => {
      (console.log(Date.now(), 'Cache read data', !!t), (self.cachedStorageData = t || null), e(t));
    });
  });
uv.then(e => {
  if (!Tw()) {
    const t = e?.user_info?.uid;
    t && ov({ uid: t, email: e.user_info.email });
  }
});
const lv = re(hv, 2e3);
async function hv(e) {
  const t = await (async function (e) {
    if (!_w()) return;
    const t = Hy(Yy).currentUser;
    let r;
    try {
      r = await t.getIdTokenResult();
    } catch (e) {
      return;
    }
    const i = {},
      s = {};
    function o(e) {
      return { seconds: e?.seconds, nanoseconds: e?.nanoseconds };
    }
    for (const e in xw.groups) {
      const t = xw.groups[e];
      if (t.stub || t.loading) continue;
      const n = vw.groups[e];
      if (n && n.disabled) continue;
      const r = Object.assign({}, t.data);
      ((r.created_at = o(r.created_at)),
        (r.updated_at = o(r.updated_at)),
        (i[e] = r),
        (s[e] = t.snippets.map(e => {
          const t = Object.assign({}, e.data);
          return (
            (t.created_at = o(t.created_at)),
            (t.updated_at = o(t.updated_at)),
            (t.content = Object.assign({}, t.content)),
            delete t.content.delta,
            (t.delta = Array.from(t.delta)),
            { data: t, addonOptions: e.addonOptions }
          );
        })));
    }
    if (e) {
      let t = null;
      for (const e in s) if (((t = e), s[t].length > 0)) break;
      if ('test_add' === e) {
        const e = Object.assign({}, i[t]);
        e.id = '000' + e.id.substring(3);
        const n = Object.assign({}, s[t][0]);
        ((n.data.id = '000' + n.data.id.substring(3)),
          (n.data.group_id = e.id),
          (s[e.id] = [n]),
          (i[e.id] = e));
      } else 'test_delete' === e && s[t].pop();
    }
    const a = {};
    if (xw.teams) for (const e in xw.teams) a[e] = xw.teams[e].data;
    const c = {};
    if (xw.userAddons) for (const e in xw.userAddons) c[e] = xw.userAddons[e].data;
    if (xw.orgAddons) for (const e in xw.orgAddons) c[e] = xw.orgAddons[e].data;
    return {
      groups: i,
      snippets: s,
      user_info: {
        email: t.email,
        name: t.displayName,
        imageUrl: t.photoURL,
        emailVerified: t.emailVerified,
        uid: vw.uid,
        token: r,
      },
      users_readonly: vw,
      users_notifications: vw.notifications,
      users_settings: vw,
      org: Aw().orgState.org,
      teams: a,
      addons: c,
      version: n.LATEST_CACHE_STORAGE_VERSION,
    };
  })(e);
  t && (await Q(cv, t), (self.cachedStorageData = t));
}
let dv = {};
function fv(e) {
  return dv[e] || 0;
}
function pv(e, t) {
  ((dv[e] = t), Q('LAST_FOCUSED_FRAME_ID', dv), D('[LAST FOCUSED FRAME]', dv));
}
(Y('LAST_FOCUSED_FRAME_ID').then(async e => {
  e &&
    te(e).then(e => {
      ((dv = e.data), e.isUpdated && Q('LAST_FOCUSED_FRAME_ID', dv));
    });
}),
  r.tabs.onRemoved.addListener((e, t) => {
    (D('[TAB REMOVED]', e, t), delete dv[e], Q('LAST_FOCUSED_FRAME_ID', dv));
  }),
  N().then(e => {
    e && O(e.id, { type: 'respondIfFocused' });
  }));
const gv = {},
  mv = {};
async function yv(e) {
  const t = Date.now();
  let n = 1;
  for (; Date.now() - t <= 50 && !(await e()); ) (await C(n), (n *= 1.2));
}
async function wv(e, t) {
  return void 0 !== mv[e]?.[t] ||
    (O(e, { type: 'reportFrameDepth' }), await yv(() => !!mv[e]?.[t]), mv[e]?.[t])
    ? mv[e][t]
    : null;
}
async function vv(e) {
  await (async function (e) {
    let t = 5;
    const n = Date.now();
    function r() {
      return Date.now() - n;
    }
    for (; r() < 200 && !(await bv(e, 0)); ) (await C(t), (t *= 1.5));
    r() > 200 && console.warn('Could not focus into tab for insert anyway pipeline');
  })(e);
  const t = await _v(e, 0);
  return (D('[FOCUSED FRAME]', t), t);
}
async function bv(e, t) {
  const n = await O(e, { type: 'doHaveFocus' }, { frameId: t });
  return n ? n.hasFocus : void 0;
}
async function Iv(e, t) {
  let n = [],
    r = new Set();
  if (
    (O(e, { type: 'reportFrameDepth' }),
    await yv(async () => {
      if (!gv[e][t]) return !1;
      const i = [...gv[e][t]].filter(e => !r.has(e));
      i.forEach(e => r.add(e));
      const s = await Promise.all(i.map(t => bv(e, t)));
      n = [];
      for (const [e, t] of s.entries()) t && n.push(i[e]);
      return 1 === n.length;
    }),
    1 === n.length)
  )
    return n[0];
  0 === n.length
    ? console.warn('Found zero focused frames')
    : console.warn('Found multiple focused frames', n);
}
async function Tv(e, t, n = !1) {
  const r = await wv(e, t);
  if (!r) return;
  n && (r.focusedChildId = void 0);
  const i = r.depth;
  if (0 === i) return null;
  const s = r.parentFrameId;
  if (void 0 !== s) return s;
  const o = await Iv(e, i - 1);
  return void 0 !== o ? ((r.parentFrameId = o), (mv[e][o].focusedChildId = t), o) : void 0;
}
async function _v(e, t, n = !1) {
  if (n) {
    for (; void 0 !== (await wv(e, t))?.focusedChildId; ) t = mv[e][t].focusedChildId;
    return t;
  }
  const r = await wv(e, t);
  if (!r) return t;
  let i = t;
  for (let t = r.depth + 1; ; t++) {
    const n = await Iv(e, t);
    if (void 0 === n) break;
    ((mv[e][i].focusedChildId = n), (mv[e][n].parentFrameId = i), (i = n));
  }
  return i;
}
let Ev = -1,
  Sv = -1,
  Cv = !1,
  Av = -1,
  kv = null,
  Dv = {};
function xv() {
  return -1 === Ev
    ? Promise.resolve()
    : O(Ev, { type: 'picker', subType: 'stopPicker' }, { frameId: 0 });
}
function Nv({ selector: e, pageMatched: t } = { selector: '', pageMatched: '' }, n = !0) {
  Cv
    ? (n || console.info('Picking being aborted'),
      (Cv = !1),
      xv().then(() => {
        ((Ev = -1),
          n &&
            (-1 !== Av &&
              r.tabs.get(Av, function (e) {
                r.runtime.lastError ||
                  (r.tabs.highlight({ tabs: e.index, windowId: e.windowId }),
                  r.windows.update(e.windowId, { focused: !0 }));
              }),
            kv &&
              kv({ selector: e, pageMatched: t, isMultiple: 'multiple' === Dv.generationMode })),
          (Av = -1),
          (kv = null));
      }))
    : console.warn('Trying to stop picking when it is not enabled');
}
async function Ov(e, t) {
  if (!(await ne(e.id, t))) {
    const n = ['./js/inPageNotifier.js', './js/contentScript.js'],
      r = { tabId: e.id };
    t ? (r.frameIds = [t]) : (r.allFrames = !0);
    try {
      await S({ files: n, target: r }, e);
    } catch (e) {
      return;
    }
  }
}
se(async function ({ tabId: e, tab: t }) {
  if (
    Cv &&
    g(t.url) &&
    !(function (e) {
      try {
        let { hostname: t } = new URL(e);
        t = t.toLowerCase();
        const n = [
            'dashboard.blaze.today',
            'spark.blaze.today',
            'text.blaze.today',
            'spark-text.blaze.today',
            'ai.blaze.today',
            'spark-ai.blaze.today',
          ].includes(t),
          r = ['www.blaze.today', 'blaze.today'].includes(t);
        return n || r;
      } catch (e) {
        return !1;
      }
    })(t.url) &&
    Cv
  ) {
    (Ev !== e && (await xv()), (Ev = e));
    const t = { frameId: 0 };
    (Dv.supportsCrossIframe && delete t.frameId,
      await O(Ev, { type: 'picker', subType: 'restartPicker', config: Dv }, t));
  }
});
const Rv = n.browser(),
  Pv = async function (e = !1) {
    return !n.isNodeOrServiceWorker() && window.location.pathname.endsWith('/form.html')
      ? new Promise(e => {
          Rv.runtime.sendMessage({ request: 'getCredentials' }, e);
        })
      : Qw(e);
  };
async function Mv(e, t) {
  const n = await Pv();
  return n
    ? await fetch(e, {
        method: 'POST',
        headers: { Authorization: 'FBBEARER ' + n, 'Content-Type': 'application/json' },
        body: JSON.stringify(t),
      }).catch(
        e => (
          console.warn('Fetch error:', e),
          new Response('User is offline', {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
            statusText: 'Network error',
          })
        )
      )
    : new Response('Failed to get token', {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        statusText: 'Please reload the extension and then retry',
      });
}
async function Lv(e, t) {
  let n;
  const r = !e.ok;
  n = r ? { status: 'error', message: Bv(e) } : await e.json();
  const i = [];
  for (let e = 0; e < t; e++) {
    const t = n.results?.[e];
    let s, o, a, c;
    (r
      ? ((a = n.message), (s = n.message), (o = 400), (c = 'error'))
      : ((s = JSON.stringify(t)),
        (c = 'error' === t.status ? 'error' : 'success'),
        (a = 'error' === c ? t.error || t.message : t.results),
        (o = 'error' === c ? 400 : 200)),
      i.push({ text: a, oldText: s, status: c, oldStatus: o }));
  }
  return { results: i, topLevelReqFailed: r };
}
const Fv = {
    url_load: zv(!0),
    url_ping: zv(!1),
    dbselect: function (e) {
      const { body: t } = Vv(e);
      return (async function (e) {
        const t = await Mv(Uv, e);
        return t.ok ? await t.json() : { status: 'error', message: Bv(t) };
      })(t);
    },
    dbinsert: jv,
    dbdelete: jv,
    dbupdate: jv,
  },
  Uv = 'https://data-api.blaze.today/api/database/query/';
function Vv(e) {
  const t = {
    database_id: e.databaseId,
    query: e.query,
    parameters: e.parameters,
    folder_id: e.folderid,
  };
  return (
    'multiple' in e && (t.single = !e.multiple && !e.menu),
    'autoaddfields' in e && (t.auto_create_missing_fields = e.autoaddfields),
    'set' in e && (t.set_values = e.set),
    { body: t, config: { completed: e.completed, finish: e.finish, error: e.error } }
  );
}
function Bv(e) {
  const { status: t, url: n } = e;
  return n
    ? 429 === t
      ? 'Too many requests, please retry later.'
      : 503 === t
        ? 'Data Blaze is currently under maintenance. Please try again later.'
        : 'Could not run SQL'
    : (e.statusText || x('Empty statusText for custom error response'), e.statusText);
}
async function jv(e) {
  const { body: t } = Vv(e),
    n = await Mv(Uv, [t]),
    { results: r } = await Lv(n, 1),
    { text: i, status: s } = r[0];
  return { raw: i, status: s };
}
function zv(e) {
  return (t, n, r) =>
    new Promise(i => {
      const s = { credentials: 'include' };
      (t.method && (s.method = t.method.toUpperCase()),
        t.headers && (s.headers = new Headers(t.headers)),
        t.body && (s.body = t.body),
        fetch(t.url, s)
          .then(s => {
            s.text().then(async o => {
              e ? i(Gv(o, s.status)) : n ? await n(t, s, o, r) : i(Gv(o, s.status));
            });
          })
          .catch(e => {
            const s = '' + e.message || e;
            n ? n(t, { ok: !1, status: 'error' }, s, r) : i(Gv(s, 'error'));
          }));
    });
}
function qv(e, t) {
  z({ title: e, message: t });
}
function Gv(e, t) {
  return { data: e, status: t };
}
async function $v(e, t, n, i) {
  const s = {};
  s.frameId = 'self' === i ? t : 0;
  const { results: o, ...a } = await (async function (e, t, n) {
      for (const i of [100, 200, 800, 0]) {
        let s = null;
        if (
          ((await r.tabs.get(e)).frozen || (s = await O(e, { type: 'getSiteItems', items: t }, n)),
          void 0 === s)
        )
          break;
        if (s) return s;
        i && (await C(i));
      }
      return {
        results: { data: t.map(e => ({ error: 'Could not query {site} data.' })) },
        title: 'NON_INTERACTIVE',
        favicon: null,
      };
    })(e, n, s),
    c = o.data.map((e, t) => {
      const r = n[t];
      if ('error' in e) return e;
      {
        let t;
        return (
          (t =
            'context' === r.part
              ? `context: "${r.contextPart}".`
              : r.selector
                ? `selector: "${r.selector}".`
                : `XPath: "${r.xpath}".`),
          null === e.data
            ? { error: 'No match found for ' + t }
            : void 0 === e.data
              ? { error: 'No contents found for ' + t }
              : e.data
        );
      }
    });
  return { results: c, ...a, type: i };
}
async function Kv(e, t, i) {
  const s = e.some(e => e.selector?.includes('|>') || e.xpath?.includes('|>'));
  s && (await O(t, { type: 'saveFrameFocus' }, { frameId: i }));
  const o = await (async function (e, t) {
      const n = Object.create(null),
        i = [...new Set(e.map(e => e.page || ''))];
      return (
        await Promise.all(
          i.map(async e => {
            const t =
              (await ((i = { url: e || void 0 }), r.tabs.query(i).catch(() => [])))?.map(
                e => e.id
              ) || [];
            var i;
            n[e] = t;
          })
        ),
        e.map(e => {
          const r = e.page || '';
          let i = n[r].slice(0);
          return ('no' === e.select && (i = i.includes(t) ? [t] : []), i);
        })
      );
    })(e, t),
    a = {};
  let c = 0;
  for (const t of e) {
    for (const e of o[c]) (a[e] || (a[e] = []), a[e].push({ item: t, index: c }));
    c++;
  }
  const u = await (async function (e, t, n) {
      const i = Object.keys(e).map(e => +e),
        s = await Promise.all(
          i.map(async i => {
            const s = e[i];
            if (-1 === i) return (x('Invalid tab with -1 id'), null);
            const o = await r.tabs.get(i),
              a = { tabId: i, title: o.title, favicon: o.favIconUrl },
              c = s.map((e, t) => ({ item: null, res: null, index: t }));
            if (o.frozen) return { ...a, error: 'SLEEPING', data: c };
            const u = s.map(e => e.item),
              l = fv(i),
              h = i === t ? n : l,
              { itemsData: d, ...f } = await (async function (e, t, n) {
                const r = { self: [], base: [] };
                for (let t = 0; t < e.length; t++) {
                  const i = e[t];
                  r['self' === i.frame && n ? 'self' : 'base'].push({ loc: t, item: i });
                }
                const i = [];
                for (const e in r)
                  r[e].length &&
                    i.push(
                      $v(
                        t,
                        n,
                        r[e].map(e => e.item),
                        e
                      )
                    );
                const s = await Promise.all(i),
                  o = s.map(e => ({ results: e.results, type: e.type })),
                  a = new Array(e.length);
                for (const e of o)
                  for (let t = 0; t < e.results.length; t++) a[r[e.type][t].loc] = e.results[t];
                return { itemsData: a, title: s[0].title, favicon: s[0].favicon };
              })(u, i, h);
            return 'NON_INTERACTIVE' === f.title
              ? { ...a, error: 'NON_INTERACTIVE', data: c }
              : {
                  tabId: i,
                  data: d.map((e, t) => ({ res: e, index: s[t].index, item: s[t].item })),
                  ...f,
                };
          })
        );
      return s.filter(e => !!e);
    })(a, t, i),
    l = u.findIndex(e => e.tabId === t);
  if (-1 !== l) {
    const e = u.splice(l, 1);
    u.unshift(e[0]);
  }
  const h = Object.create(null),
    d = [...new Set(u.map(e => e.tabId))];
  (await Promise.all(
    d.map(async e => {
      try {
        const t = await r.tabs.get(e);
        h[e] = { windowId: t.windowId, index: t.index };
      } catch (t) {
        (W(t, [/No tab with id: \d+/]), (h[e] = { windowId: -1, index: -1 }));
      }
    })
  ),
    u.sort((e, t) => {
      const n = h[e.tabId],
        r = h[t.tabId];
      return n.windowId === r.windowId ? n.index - r.index : n.windowId - r.windowId;
    }),
    s && (await O(t, { type: 'restoreFrameFocus' }, { frameId: i })));
  const f = (function (e, t, r) {
    let i = !1;
    const s = Object.create(null),
      o = new Set([]);
    function a(e) {
      return e.every(e => 'object' == typeof e.res && 'error' in e.res);
    }
    const c = {};
    for (const t of e) {
      const e = n.getSiteItemGroupingKey(t);
      (c[e] || (c[e] = []), c[e].push(t));
    }
    for (const e in c) {
      for (const u of c[e]) {
        'yes' === u.select && (i = !0);
        let c = !1,
          l = 0;
        for (const { tabId: i, ...h } of t) {
          if ('error' in h) continue;
          const { data: t } = h;
          for (const h of t)
            if (n.equals(h.item, u)) {
              const n = { tabId: i, res: t },
                u = s[e],
                h = !a(n.res);
              if ((h && l++, c)) {
                const t = a(u.res),
                  i = u.tabId !== r,
                  c = n.tabId === r;
                ((t && h) || (c && i && h) || (h && !t && o.has(u.tabId))) && (s[e] = n);
              } else ((c = !0), u || (s[e] = n));
            }
        }
        'ifneeded' === u.select && l > 1 && s[e].tabId !== r && (i = !0);
      }
      s[e] && e.includes(n.SITE_GROUP_JOIN_SYMBOL) && o.add(s[e].tabId);
    }
    return { needsTabSelectInSiteCommand: i, usedSiteTabSelections: s };
  })(e, u, t);
  return { selectorData: u, ...f };
}
function Wv(e) {
  return U({ type: 'setClipboard', data: e });
}
function Hv(e) {
  return V(e);
}
async function Qv(e, t, n) {
  return Hv({ type: 'showCompletedNotification', args: [e, t, n], state: Aw() });
}
function Yv(e, t, n, r, i) {
  return Hv({ type: 'runFinishBlock', args: [e, t, n, r, i] });
}
function Xv(e, t, n, r, i) {
  return Hv({ type: 'runErrorBlock', args: [e, t, n, r, i] });
}
function Jv(e, t) {
  const n = [];
  for (const r of e)
    if (r.type.startsWith('db')) {
      const { body: e, config: t } = Vv(r);
      n.push({ body: e, config: t, command: r.command });
    } else Fv[r.type](r, Zv, t);
  n.length &&
    (async function (e, t) {
      const n = e.map(e => e.body),
        r = await Mv(Uv, n),
        { topLevelReqFailed: i, results: s } = await Lv(r, n.length);
      for (const [n, { text: r, oldStatus: o, oldText: a, status: c }] of s.entries()) {
        const { config: s, command: u } = e[n],
          l = i || 'error' === c;
        l && s?.error
          ? Xv(u, s.error, r, 'error', t)
          : !l && s?.finish
            ? Yv(u, s.finish, r, c, t)
            : s?.completed
              ? await Qv(s.completed, [a, o], 'Data Blaze Notification')
              : l && qv('Data Blaze Error', r || '"' + a + '"');
      }
    })(n, t);
}
async function Zv(e, t, n, r) {
  const i = t.ok && t.status < 400;
  i && e.finish
    ? await Yv('urlsend', e.finish, n, t.status, r)
    : !i && e.error
      ? await Xv('urlsend', e.error, n, t.status, r)
      : e.completed
        ? await Qv(e.completed, [n, t.status], 'Text Blaze Remote Data Notification')
        : i || qv('Text Blaze Remote Data Error', `Code ${t.status}: ${n}`);
}
const eb = new Uint32Array(65536),
  tb = (e, t) => {
    if (e.length < t.length) {
      const n = t;
      ((t = e), (e = n));
    }
    return 0 === t.length
      ? e.length
      : e.length <= 32
        ? ((e, t) => {
            const n = e.length,
              r = t.length,
              i = 1 << (n - 1);
            let s = -1,
              o = 0,
              a = n,
              c = n;
            for (; c--; ) eb[e.charCodeAt(c)] |= 1 << c;
            for (c = 0; c < r; c++) {
              let e = eb[t.charCodeAt(c)];
              const n = e | o;
              ((e |= ((e & s) + s) ^ s),
                (o |= ~(e | s)),
                (s &= e),
                o & i && a++,
                s & i && a--,
                (o = (o << 1) | 1),
                (s = (s << 1) | ~(n | o)),
                (o &= n));
            }
            for (c = n; c--; ) eb[e.charCodeAt(c)] = 0;
            return a;
          })(e, t)
        : ((e, t) => {
            const n = t.length,
              r = e.length,
              i = [],
              s = [],
              o = Math.ceil(n / 32),
              a = Math.ceil(r / 32);
            for (let e = 0; e < o; e++) ((s[e] = -1), (i[e] = 0));
            let c = 0;
            for (; c < a - 1; c++) {
              let o = 0,
                a = -1;
              const u = 32 * c,
                l = Math.min(32, r) + u;
              for (let t = u; t < l; t++) eb[e.charCodeAt(t)] |= 1 << t;
              for (let e = 0; e < n; e++) {
                const n = eb[t.charCodeAt(e)],
                  r = (s[(e / 32) | 0] >>> e) & 1,
                  c = (i[(e / 32) | 0] >>> e) & 1,
                  u = n | o,
                  l = ((((n | c) & a) + a) ^ a) | n | c;
                let h = o | ~(l | a),
                  d = a & l;
                ((h >>> 31) ^ r && (s[(e / 32) | 0] ^= 1 << e),
                  (d >>> 31) ^ c && (i[(e / 32) | 0] ^= 1 << e),
                  (h = (h << 1) | r),
                  (d = (d << 1) | c),
                  (a = d | ~(u | h)),
                  (o = h & u));
              }
              for (let t = u; t < l; t++) eb[e.charCodeAt(t)] = 0;
            }
            let u = 0,
              l = -1;
            const h = 32 * c,
              d = Math.min(32, r - h) + h;
            for (let t = h; t < d; t++) eb[e.charCodeAt(t)] |= 1 << t;
            let f = r;
            for (let e = 0; e < n; e++) {
              const n = eb[t.charCodeAt(e)],
                o = (s[(e / 32) | 0] >>> e) & 1,
                a = (i[(e / 32) | 0] >>> e) & 1,
                c = n | u,
                h = ((((n | a) & l) + l) ^ l) | n | a;
              let d = u | ~(h | l),
                p = l & h;
              ((f += (d >>> (r - 1)) & 1),
                (f -= (p >>> (r - 1)) & 1),
                (d >>> 31) ^ o && (s[(e / 32) | 0] ^= 1 << e),
                (p >>> 31) ^ a && (i[(e / 32) | 0] ^= 1 << e),
                (d = (d << 1) | o),
                (p = (p << 1) | a),
                (l = p | ~(c | d)),
                (u = d & c));
            }
            for (let t = h; t < d; t++) eb[e.charCodeAt(t)] = 0;
            return f;
          })(e, t);
  };
let nb,
  rb = Math.round(1e6 * Math.random()),
  ib = null,
  sb = {},
  ob = 0,
  ab = !0;
const cb = [];
let ub = 0,
  lb = {};
Y('AI_CHAT_METADATA_2').then(e => {
  e &&
    te(e).then(e => {
      lb = e.data;
    });
});
const hb = {};
var db;
function fb(e, t, r) {
  return n.orgPref(Aw(), e, t, r);
}
async function pb(e, t, i, s = 'newForegroundTab') {
  if (null === e) return;
  if (!e) {
    const e = Object.keys(mw);
    let n = null,
      r = 4;
    for (const i of e) {
      const e = tb(i, t);
      e < r && ((n = i), (r = e));
    }
    return void Lw({
      message: `Snippet "${t}" does not exist.` + (n ? ` Did you mean "${n}"?` : ''),
      intent: 'fail',
    });
  }
  if ('replacement' !== e.type) return void console.warn('Invalid result type', e);
  const o = e.replacement;
  n.log({ action: 'Used omnibox' });
  let a = '';
  function c() {
    r.runtime.lastError &&
      r.runtime.lastError.message &&
      r.runtime.lastError.message.startsWith('Invalid url') &&
      Lw({ title: 'Cannot open invalid URL', message: a, intent: 'fail' });
  }
  switch (
    (o.forEach(e => {
      'textStrArr' in e && (a += e.textStrArr.filter(e => 'string' == typeof e).join(''));
    }),
    a.includes('://') || (a = 'http://' + a.trim()),
    s)
  ) {
    case 'currentTab':
      r.tabs.update(i, { url: a }, c);
      break;
    case 'newForegroundTab':
      r.tabs.create({ url: a }, c);
      break;
    case 'newBackgroundTab':
      r.tabs.create({ url: a, active: !1 }, c);
      break;
    default:
      r.tabs.update({ url: a }, c);
  }
}
function gb(e) {
  (clearTimeout(ob), n.addBreadcrumb({ message: 'Form submit handler triggered' }), (ib = null));
  const t = e.config;
  (t.formWindowId && r.windows.remove(t.formWindowId),
    t.appendage && e.replacement.replacement.push({ type: 'string', textStrArr: [t.appendage] }));
  const { snippetId: i, groupId: s, tabId: o, frameId: a, windowId: c } = t,
    u = {
      replacement: e.replacement.replacement,
      snippetType: t.snippetType,
      shortcutToClear: t.typedShortcutText,
    };
  if (t.formRestoreConfig?.onlyClipboardCopy) return void Eb(u.replacement);
  const h = { formId: t.formId, skipElementChecks: t.formRestoreConfig?.skipElementChecks };
  function d() {
    (Mw(),
      l() ||
        n.log({ category: 'Extension', action: 'Form filled' }, { snippet_id: i, group_id: s }),
      l() || yb(e.replacement.length, i, s, t.featureUsage, t.insertionType));
  }
  if (t.isOmnibox) {
    d();
    const n = { type: 'replacement', ...u };
    sb[t.formId]
      ? (sb[t.formId](n), delete sb[t.formId])
      : Tb(c, o).then(t => {
          pb(n, e.config.shortcut, o);
        });
  } else
    _b(c, o, a, t.formRestoreConfig?.skipElementChecks, h)
      .then(n => {
        !1 !== n.success
          ? (d(),
            Ib({
              tabId: o,
              frameId: n.newFrameId,
              replacementObj: u,
              insertionType: t.insertionType,
              isForm: !0,
              snippetId: i,
              groupId: s,
            }),
            (function (e) {
              e.exceededTimeoutMsg && x(e.exceededTimeoutMsg);
            })(n))
          : (function ({ error: t, hasLostTab: n, shouldLog: r, customUIMessage: i }) {
              const s = `[ERROR] Could not insert snippet. Reason: ${t}`;
              (console.error(s),
                r && x(s),
                (ib = e),
                (ib.config.formRestoreConfig = { onlyClipboardCopy: n, customUIMessage: i }),
                mb('../html/fallback.html').then(e => {
                  ib.config.formWindowId = e;
                }));
            })(n);
      })
      .catch(e => {
        n.captureException(e);
      });
}
async function mb(e = '../html/form.html') {
  const t = (await Y('position')) || {},
    n = { left: 40, top: 40, width: 550, height: 650 },
    i = Object.assign({}, n, t),
    s = Math.max(i.width, 200),
    o = Math.max(i.height, 200),
    { left: a, top: c } = i,
    u = { type: 'popup', url: e, focused: !0 };
  let l;
  try {
    l = (await r.windows.create({ ...u, width: s, height: o, left: a, top: c })).id;
  } catch (e) {
    try {
      l = (await r.windows.create(Object.assign({}, u, n))).id;
    } catch (e) {
      return void x(e);
    }
  }
  return (r.windows.update(l, { focused: !0 }), nb && (nb.formWindowId = l), l);
}
function yb(e, t, r, i, s, o) {
  const a = { length: e, features: i.features.COMMANDS };
  (s && (a.insertionType = s),
    o && (a.snippetType = o),
    n.log(
      { category: 'Extension', action: 'Trigger replacement', label: a, value: e },
      { snippet_id: t, group_id: r }
    ));
}
function wb() {
  (n.log({
    category: 'Extension',
    action: 'Open get pro website',
    label: { source: 'notification' },
  }),
    p('/pro'));
}
((db = () => {
  ((nb = null), rb++, (sb = {}));
}),
  cw.push(db),
  r.omnibox.onInputEntered.addListener((e, t) => {
    r.tabs.query({ active: !0, currentWindow: !0 }, n => {
      jb(
        { request: 'getReplacement', shortcut: e, insertionType: 'omnibox', editorData: {} },
        { tab: n[0] || {}, frameId: 0 }
      ).then(r => {
        r && 'form' === r.type
          ? (sb[r.formId] = r => pb(r, e, n[0]?.id, t))
          : pb(r, e, n[0]?.id, t);
      });
    });
  }),
  r.omnibox.onInputChanged.addListener((e, t) => {
    const n = Object.keys(mw).filter(t => t.startsWith(e.toLocaleLowerCase()));
    n.length &&
      t(
        n.map(t => {
          let n = `<match>${G(e)}</match>${G(t.slice(e.length))}`;
          const r = mw[t][0];
          return (
            r && r.data && r.data.name && (n += ` <dim>- ${G(r.data.name)}</dim>`),
            { content: t, description: n }
          );
        })
      );
  }));
const vb = [];
async function bb(e, t, n) {
  const { replacement: r } = n;
  return (
    'string' !== r.type &&
      'action' === r.tag &&
      ('action_start' === r.info.type
        ? ((r.info.savedFocusCount = vb.length), vb.push(t))
        : 'action_end' === r.info.type && ((t = vb.pop()), (r.info.savedFocusCount = vb.length))),
    {
      result: await O(e, { type: 'insertReplacement', replacementData: n }, { frameId: t }),
      frameId: t,
    }
  );
}
async function Ib({
  tabId: e,
  frameId: t,
  replacementObj: r,
  insertionType: i,
  isForm: s,
  snippetId: o,
  groupId: a,
  rewriteMode: c,
}) {
  const u = Date.now();
  let l = 0,
    h = !0,
    d = !0;
  for (; vb.length > 0; ) vb.pop();
  const f = Math.random().toString();
  hb[f] = { tabId: e, hasNavigated: !1 };
  const { replacement: g, snippetType: m } = r;
  let { shortcutToClear: y } = r,
    v = 0,
    b = !1;
  function I() {
    (delete hb[f], w('running', !1, { key: f }), E());
  }
  g.length > 1 && w('running', !0, { key: f });
  for (let n = 0; n < g.length; n++) {
    const r = g[n];
    if (v) {
      const t = 18e4,
        n = Math.floor(v / t),
        r = v % t;
      for (let r = 0; r < n; r++) (await C(t), await O(e, { type: 'isAlive' }));
      (await C(r), (v = 0));
    }
    if (hb[f].hasNavigated) {
      (console.warn('Tab reloaded, bailing on snippet insertion...'), (h = !1));
      break;
    }
    let a = !1,
      u = null;
    if ('string' !== r.type && 'click' === r.tag && 'top' === r.info.frame) t = 0;
    else if (b) {
      const n = await _v(e, 0);
      (D('[MAY SWITCH FRAME] new focused frame ID', n),
        (await bv(e, n))
          ? (t = n)
          : ((a = !0), (u = { success: !1, error: { message: 'Focused frame not found' } })));
    }
    if (!a) {
      const n = {
        replacement: r,
        isFirst: d,
        typedShortcutPrefix: y,
        snippetType: m,
        insertionType: i,
        isForm: s,
        rewriteMode: c,
      };
      (({ result: u, frameId: t } = await bb(e, t, n)), (a = !(void 0 !== u && u.success)));
    }
    if (a) {
      if (u && !u.success && u.error?.message) {
        if ('string' !== r.type && 'click' === r.tag && 'NOT_FOUND' === u.error.name) {
          const e = r.info.selector || r.info.xpath,
            t = r.tag;
          Lw({
            title: `Command to ${t} failed`,
            message: u.error.message || `Could not ${t} into ${e}`,
            buttons: [
              {
                message: 'Go to dashboard',
                callback: () => {
                  p(`/snippet/${o}`);
                },
              },
              {
                message: 'Copy snippet',
                callback: () => {
                  Eb(g);
                },
              },
            ],
            intent: 'fail',
          });
        }
        return I();
      }
      (Sb(u?.error, 'insertion'), console.error('Insertion failed', u), (h = !1));
      break;
    }
    ((b = !1),
      'string' !== r.type &&
        ('click' === r.tag
          ? (b = !!(r.info.selector || r.info.xpath)?.includes('|>'))
          : 'wait' === r.tag && (l += r.info.delay)),
      (v = u.skipTimeMs),
      (d = !1),
      (y = ''));
  }
  if ((O(e, { type: 'replacementComplete' }, { frameId: t }), I(), h)) {
    const e = Date.now() - u - l;
    n.log(
      { category: 'Extension', action: 'Replacement Complete', label: { duration: e } },
      { snippet_id: o, group_id: a }
    );
  }
}
async function Tb(e, t) {
  return (async function () {
    if (e)
      try {
        await r.windows.update(e, { focused: !0 });
      } catch (t) {
        W(t, ['No window with id']);
        let n = !1;
        try {
          (await r.windows.get(e)).focused && (n = !0);
        } catch (e) {}
        if (!n) return { success: !1, error: 'Window lost', hasLostTab: !0 };
      }
    return (async function () {
      if (t)
        try {
          await r.tabs.update(t, { active: !0 });
        } catch (e) {
          const n = e.toString(),
            i = 'Saved groups are not editable';
          let s;
          W(n, ['No tab with id', i]);
          try {
            s = await r.tabs.get(t);
          } catch (e) {
            W(e, ['No tab with id']);
          }
          if (!s || !s.active) {
            let e;
            return (
              n.includes(i) && (e = 'Please remove your Saved Tab Group to fix this.'),
              { success: !1, error: 'Tab lost', hasLostTab: !0, customUIMessage: e }
            );
          }
        }
      return { success: !0 };
    })();
  })();
}
async function _b(e, t, n, i, s) {
  const o = await Tb(e, t);
  if (!1 === o.success) return o;
  i && (n = await vv(t));
  const a = await O(t, { type: 'restoreFocusForForm', data: s }, { frameId: n });
  return r.runtime.lastError || !a
    ? {
        success: !1,
        error: `Communication error: ${r.runtime.lastError?.message || 'frame lost'}`,
        hasLostTab: !1,
      }
    : !1 === a.success
      ? {
          success: !1,
          error: `Snippet insertion failed: ${a.error}`,
          hasLostTab: !1,
          shouldLog: !!a.shouldLog,
        }
      : { ...a, newFrameId: n };
}
function Eb(e) {
  const { htmlString: t, textString: r } = n.convertReplacementPartsToText(e);
  Wv({ html: t, text: r });
}
function Sb(e, t) {
  'widget is not defined' !== e?.message &&
    (l() ||
      n.log({
        category: 'Extension',
        action: 'Content Script Error',
        label: {
          ...e,
          tag: t,
          user_id: Ew() ? Sw() : null,
          ext_version: a(),
          ext_id: c(),
          ext_reported_version: '3.3.0',
        },
      }));
}
let Cb = null;
async function Ab(e) {
  try {
    const t = await r.tabs.get(e);
    let n = null;
    try {
      const e = t && t.url && new URL(t.url);
      e && (e.hostname ? (n = e.hostname) : 'file:' === e.protocol && (n = 'local file'));
    } catch (e) {}
    const [i, s] = await Promise.all([Bb.pageContent, Bb.tabCapture]);
    (delete Bb.pageContent, delete Bb.tabCapture);
    const o = i?.pageContent || null,
      a = s || null;
    D('[PAGE CONTENT]', { hostname: n, pageContentData: i, resultImageSend: a });
    const c = {
      hostname: n,
      pageContent: o,
      fieldTexts: Bb.fieldTexts,
      selectedContent: i && 'selectedContent' in i ? i.selectedContent : Bb.selectedContent,
      rawCapturedImage: a,
      rawImageType: 'webp',
    };
    return (delete Bb.fieldTexts, delete Bb.selectedContent, c);
  } catch (e) {
    return (x(e), null);
  }
}
let kb = {};
const { handleFrameRoutingUpdate: Db, handleFrameRoutingRequest: xb } = (() => {
  const e = { heightChange: {}, focusChange: {} };
  return {
    handleFrameRoutingRequest: function (t, n, r) {
      const i = t.subType,
        s = n.tab.id;
      if ('heightChange' === i) {
        const a = t.depth,
          c = t.height,
          u = 10;
        function o() {
          O(s, { type: 'pollHeight', depth: a, height: c });
        }
        const l = self.setInterval(o, u),
          h = {
            handler: (e, n) =>
              e.depth === a &&
              Math.abs(e.height - c) <= 0.1 &&
              (O(s, t.message, { frameId: n.frameId }).then(e => {
                r(e);
              }),
              !0),
            timeoutId: setTimeout(() => {
              (x('Failed to get ' + i + ' for site data'),
                clearInterval(l),
                delete e[i][s],
                r(null));
            }, 100),
            interval: l,
          };
        ((e[i][s] = h), o());
      } else
        'focusChange' === t.subType &&
          (e[i][s] = {
            handler: (e, n) => (
              O(s, t.message, { frameId: n.frameId }).then(e => {
                r(e);
              }),
              !0
            ),
            timeoutId: self.setTimeout(() => {
              (x('Failed to get ' + i + ' for site data'), delete e[i][s], r(null));
            }, 100),
          });
    },
    handleFrameRoutingUpdate: function (t, n) {
      if (!n.tab) return;
      const r = t.subType,
        i = n.tab.id;
      if ('focusChange' === r) {
        const e = n.frameId || 0;
        (pv(i, e), D('[FOCUS CHANGE TO FRAME]', e));
      }
      const s = e[r]?.[i];
      s &&
        s.handler(t, n) &&
        (clearTimeout(s.timeoutId), clearInterval(s.interval), delete e[r][i]);
    },
  };
})();
async function Nb(e, t, i) {
  try {
    switch ((D('[RUNTIME MSG]', e.request, e), e.request)) {
      case 'isAlive':
        return i(!0);
      case 'notificationClick':
        return (
          (function (e) {
            if (e in j) {
              const t = j[e];
              (delete j[e], t());
            }
          })(e.identifier),
          void i('ack')
        );
      case 'notificationCleared':
        return void (async function (e) {
          e in j && delete j[e];
        })(e.identifier);
      case 'installExtensionIframe':
        return t.tab ? (Ov(t.tab, t.frameId), null) : null;
      case 'getNotificationData':
        return void i(
          (function () {
            const e = q;
            return ((q = null), e);
          })()
        );
      case 'focusTab':
        return void B(e.tabId);
      case 'getKeyboardShortcut':
        return (X().then(e => i(e)), !0);
      case 'showNotification': {
        const t = Date.now();
        return void (async function e() {
          if (Date.now() - t >= 1e3) return void x('Exceeded form window waiting time');
          const n = await N();
          if (n?.url)
            try {
              const t = new URL(n.url);
              t.pathname.endsWith('/form.html') &&
                'chrome-extension:' === t.protocol &&
                (await C(20), await e());
            } catch {
              return;
            }
        })().then(() => {
          K(e);
        });
      }
      case 'offscreenInitialized':
        return void console.log(Date.now(), 'Sandbox initialized');
    }
    switch ((await Vw(), e.request)) {
      case 'getCredentials':
        return (
          Pv()
            .then(i)
            .catch(() => i(null)),
          !0
        );
      case 'errorLoggerDetails':
        return i($b());
      case 'savePosition':
        Q('position', e.position);
        break;
      case 'getSnippetsByShortcut':
        return i(Fw(e.snippet));
      case 'nextForm':
        return void (nb ? (i(nb), (nb = null)) : (console.error('nextFormData is null'), i(null)));
      case 'getStreamTimeout':
        return i(vw && vw.typing_timeout ? vw.typing_timeout : 5e3);
      case 'remoteLoader':
        return (Gb(e.info).then(e => i(e)), !0);
      case 'getDataFromTabs':
        return (Kv(...e.args).then(e => i(e)), !0);
      case 'processSidechannelItems':
        !(function (e, t) {
          const n = e.map(e => e.info);
          Jv(n, t);
        })(...e.args);
        break;
      case 'getReplacement':
        return (jb(e, { tab: t.tab, frameId: t.frameId, messageSender: t }).then(i), !0);
      case 'checkIfPDFPopup':
        t.tab.windowId in kb ? i({ isPDFPopup: !0 }) : i({ isPDFPopup: !1 });
        break;
      case 'openTemporaryPdfWindow':
        return (
          r.windows.getCurrent().then(n => {
            let i = n.left,
              s = n.top;
            r.windows.create(
              { url: e.pdfUrl, left: i + 20, top: s + 20, width: 10, height: 10, focused: !1 },
              e => {
                kb[e.id] = t.tab.id;
              }
            );
          }),
          !1
        );
      case 'closeTemporaryPdfWindow':
        const o = t.tab.windowId,
          a = kb[o];
        return (
          a &&
            (O(a, { type: 'gotPdfText', text: e.text }, { frameId: 0 }),
            r.windows.remove(o),
            delete kb[o]),
          !1
        );
      case 'picker':
        return (function (e, t, n) {
          const r = t.tab?.id,
            i = t.frameId,
            s = Cv && Ev === r && (Dv.supportsCrossIframe || 0 === i);
          if ('shouldWeEnable' === e.subType) n(s ? { enable: !0, config: Dv } : { enable: !1 });
          else if ('install' === e.subType)
            s &&
              (function (e, t) {
                S({ files: ['js/picker.js'], target: { tabId: e, frameIds: [t] } });
              })(r, i);
          else if ('updateConfig' === e.subType) Dv = { ...Dv, ...e.config };
          else if ('stop' === e.subType) {
            const { selector: t, pageMatched: n } = e;
            Nv({ selector: t, pageMatched: n });
          } else
            'togglePickAllFrames' === e.subType
              ? (function (e, t) {
                  O(e, { type: 'picker', subType: 'toggleFrame', shouldEnable: t });
                })(r, e.enable)
              : 'finalizeSelector' === e.subType
                ? Tv(r, i, !1).then(t => {
                    O(
                      r,
                      { type: 'picker', subType: 'finalizeSelector', selector: e.selector },
                      { frameId: t }
                    );
                  })
                : 'focusedFrame' === e.subType
                  ? (-1 !== Sv &&
                      Sv !== i &&
                      O(r, { type: 'picker', subType: 'resetAllClasses' }, { frameId: Sv }),
                    (Sv = i))
                  : x('Unknown picker-bg.js request: ' + JSON.stringify(e));
          return !1;
        })(e, t, i);
      case 'routeToRootFrame':
        t.tab && O(t.tab.id, e.msg, { frameId: 0 });
        break;
      case 'routeToAllFrames':
        t.tab && O(t.tab.id, e.msg);
        break;
      case 'remote_finalize':
        return (Jv(e.info, e.blockData), i('ack'));
      case 'formSubmit':
        return (gb(e), null);
      case 'dismissWidget':
        ((s = t.tab.id), cb.push(s), cb.length > 20 && cb.shift(), ub++);
        const c = 2;
        ab &&
          ub >= c &&
          Lw({
            title: 'Disable permanently?',
            message: 'You can do so in your dashboard settings',
            buttons: [
              {
                message: 'Open settings',
                callback: () => {
                  p('/configure/options?option=widget_enabled');
                },
              },
              {
                message: "Don't show again",
                callback: () => {
                  ab = !1;
                },
              },
            ],
            atMouse: !0,
            intent: 'info',
          });
        break;
      case 'widgetRoute':
        let u = null;
        return (
          void 0 !== t.tab &&
            void 0 !== t.tab.id &&
            void 0 !== t.frameId &&
            ('displayWidget' === e.type
              ? (u = (async function (e, t) {
                  const n = e.frameId,
                    r = e.tab.id;
                  return void 0 === n
                    ? (console.error('Frameid is undefined'), null)
                    : (await Vb(r, n, t.caretPosition))
                      ? void (await O(
                          r,
                          { type: 'widget', subType: 'displayWidget', ...t },
                          { frameId: 0 }
                        ))
                      : null;
                })(t, e.msg))
              : 'hideWidget' === e.type || 'resetWidget' === e.type
                ? (u = (async function (e, t, n) {
                    const r = e.tab.id;
                    await O(r, { type: 'widget', subType: t, ...n }, { frameId: 0 });
                  })(t, e.type, e.msg))
                : 'insertSnippet' === e.type
                  ? (u = (async function (e, t) {
                      const n = e.frameId,
                        r = e.tab.id,
                        i = await _v(r, n, !0);
                      void 0 !== i &&
                        (await O(
                          r,
                          { type: 'widget', subType: 'insertSnippet', ...t },
                          { frameId: i }
                        ));
                    })(t, e.msg))
                  : 'listenerWidget' === e.type &&
                    (u = O(t.tab.id, { type: 'widget', subType: e.type }))),
          u && u.then(() => i('done')),
          !0
        );
      case 'formFallback': {
        let t = ib;
        if (!t) {
          if (!e.storedFailedMsg) return void x('Could not restore failed form', e);
          t = e.storedFailedMsg;
        }
        if (e.getInitialData) {
          const e = t.config.formRestoreConfig;
          return void i({
            onlyClipboard: e?.onlyClipboardCopy,
            customUIMessage: e?.customUIMessage,
            storedFailedMsg: ib,
          });
        }
        ((t.config.formRestoreConfig = {}),
          e.insert && (t.config.formRestoreConfig.skipElementChecks = !0),
          e.clipboard && (t.config.formRestoreConfig.onlyClipboardCopy = !0),
          n.addBreadcrumb({
            message: 'Form submit via fallback window',
            data: t.config.formRestoreConfig,
          }),
          gb(t));
        break;
      }
      case 'pageLoaded':
        void 0 !== t.frameId &&
          t.tab &&
          (function (e) {
            const t = e.tab.id;
            if (0 === e.frameId) {
              !(function (e) {
                ((mv[e] = {}), (gv[e] = {}));
              })(t);
              for (const e in hb) hb[e].tabId === t && (hb[e].hasNavigated = !0);
              (oe(t, 'content_script_loaded'),
                (function (e) {
                  const t = cb.indexOf(e);
                  -1 !== t && cb.splice(t, 1);
                })(t));
            }
          })(t);
        break;
      case 'reportFrameDepth':
        void 0 !== t.frameId &&
          t.tab &&
          (function (e, t, n) {
            (gv[e] || ((gv[e] = {}), (mv[e] = {})),
              gv[e][n] || (gv[e][n] = new Set([])),
              gv[e][n].add(t),
              mv[e][t] || (mv[e][t] = { depth: n }));
          })(t.tab.id, t.frameId, e.depth);
        break;
      case 'reportError':
        Sb(e, 'general');
        break;
      case 'getCaretPosition': {
        let n;
        const r = t.tab.id;
        return (
          'useFocusedFrame' !== e.subType && (n = lb[r]?.requestingFrameId || 0),
          (async function (e, t) {
            void 0 === t && (t = await vv(e));
            const { position: n } = await O(e, { type: 'getCaretPosition' }, { frameId: t });
            return (n.static ? delete n.static : await Vb(e, t, n), n);
          })(r, n).then(e => i(e)),
          !0
        );
      }
      case 'aiChat':
        const l = (async function (e, t) {
          if (t)
            if ('saveSize' === e.type) Q('aiChatIframeSize', { height: e.height, width: e.width });
            else if ('focusChatBox' === e.type)
              O(t, { type: 'aiChat', subType: 'focusChatBox' }, { frameId: lb[t].shownFrameId });
            else if ('attachListeners' === e.type || 'stopListeners' === e.type)
              O(t, { type: 'aiChat', subType: e.type });
            else if ('route' === e.type && lb[t]) return Rb(t, e.route, e.data);
        })(e, t.tab?.id || e.sourceTabId);
        if (l) return (l.then(e => i(e)), !0);
        break;
      case 'confetti':
        !(async function (e, t) {
          const { frameId: r } = t,
            i = t.tab.id;
          if (
            'show' === e.type &&
            (function () {
              const { userState: e } = Aw();
              if (0 === e.snippet_volume) return { enabled: !1 };
              if (void 0 !== e.options?.confetti_enabled)
                return { enabled: !!e.options?.confetti_enabled };
              if (!e.firebaseMetadata || !e.firebaseMetadata.creationTime) return { enabled: !1 };
              const t = e.uid;
              return (
                iv.uid !== t &&
                  (iv = { uid: t, isOldUser: n.isOldUserForConfetti({ userState: e }) }),
                { enabled: !iv.isOldUser }
              );
            })().enabled
          ) {
            let { dimensions: t } = e,
              n = r;
            if ('refer-parent' === t) {
              const e = await Tv(i, r);
              ((t = await (function (e, t) {
                return O(
                  e,
                  { type: 'confetti', subType: 'getActiveElementDimension' },
                  { frameId: t }
                );
              })(i, e)),
                (n = e));
            }
            if (t.right && !(await Vb(i, n, t))) return;
            await O(i, { type: 'confetti', subType: 'show', dimensions: t }, { frameId: 0 });
          }
        })(e, t);
        break;
      case 'replacementHandlerFinished':
        'ai' === Cb?.type &&
          (async function ({ tabId: e, frameId: t, windowId: n }) {
            {
              if (
                (nb.aiData.contexts.PAGE &&
                  (Bb.pageContent = (function (e) {
                    const t = fv(e);
                    return (
                      D('[LAST FOCUSED FRAME]', { tabId: e, frameId: t }),
                      O(e, { type: 'getDocBody' }, { frameId: t })
                    );
                  })(e)),
                void 0 === Bb.fieldTexts && void 0 === Bb.selectedContent)
              ) {
                const n = await O(
                  e,
                  { type: 'aiChat', subType: 'getSelectionTexts' },
                  { frameId: t }
                );
                ((Bb.fieldTexts = n?.fieldTexts || null),
                  (Bb.selectedContent = n?.selectedContent || null));
              }
              const n = Bb.selectedContent || Bb.fieldTexts?.precedingText;
              n && !nb.aiData.precedingText && (nb.aiData.precedingText = n);
            }
            !(async function (e) {
              const t = await Y('aiChatIframeSize');
              let n, r;
              (t && ({ height: n, width: r } = t),
                await O(
                  e,
                  { type: 'aiChat', subType: 'showEmbed', size: { height: n, width: r } },
                  { frameId: 0 }
                ));
            })(e);
          })(Cb.data);
        break;
      case 'showCustomNotification':
        const h = e.includeProButton
          ? [{ message: 'Get Pro', callback: wb }]
          : e.includeContactButton
            ? [
                {
                  message: 'Contact support',
                  callback: () => {
                    chrome.tabs.create({ url: 'mailto:support@blaze.today' });
                  },
                },
              ]
            : void 0;
        Lw({ title: e.title, message: e.message, intent: e.intent, buttons: h });
        break;
      case 'clickFailed':
        break;
      case 'formUpdated':
        (clearTimeout(ob),
          (ob = self.setTimeout(() => {
            console.log('Form is inactive since 15 seconds');
          }, 15e3)));
        break;
      case 'extensionStorage':
        return (Kb(e).then(e => i(e)), !0);
      case 'updateCaretPositionAcrossIframes':
        return (
          Vb(t.tab.id, t.frameId, e.caretPosition).then(() => {
            i(e.caretPosition);
          }),
          !0
        );
      case 'focusLastFocusedFrame':
        await O(
          t.tab.id,
          { type: 'restoreFrameFocus', focusFrameOnly: !0 },
          { frameId: fv(t.tab.id) }
        );
        break;
      case 'frameMessage':
        return (xb(e, t, i), !0);
      case 'updateFocused': {
        const e = t.tab.id,
          n = t.frameId || 0;
        (pv(e, n), D('[UPDATE FOCUSED FRAME]', n));
        break;
      }
      case 'frameUpdate':
        Db(e, t);
        break;
      case 'shouldAddDesktopIntegration':
        return i(!!Ew());
      default:
        const d = e && 'object' == typeof e ? Object.keys(e).slice(0, 10).toString() : [e];
        throw Error(`Unknown request type: ${e.request}; keys: ${d}`);
    }
    i('received');
  } catch (e) {
    throw (n.captureException(e), e);
  }
  var s;
}
function Ob(e, t = {}) {
  const n = Rb(e, 'close', t);
  return (t.shouldHide || (delete lb[e], Q('AI_CHAT_METADATA_2', lb)), n);
}
function Rb(e, t, n) {
  return O(e, { type: 'aiChat', subType: t, data: n }, { frameId: 0 });
}
function Pb(e) {
  const t = lb[e],
    n = t.formData,
    r = { formId: n.formId, skipElementChecks: !1, doNotClear: !0 };
  return [n.windowId, e, t.requestingFrameId, !1, r];
}
async function Mb() {
  return (await Y('aiLocalConfig')) || {};
}
async function Lb() {
  return await Y('aiSnippetsModel');
}
async function Fb(e) {
  const t = (await O(e, { type: 'editable_check' }, { frameId: nb.frameId })) || { editable: !1 };
  let r = vw.options?.voice,
    i = fb('voice', null, null),
    s = !1;
  'OVERRIDE' === i?.type && ((r = i.voice), (s = !0));
  const o = Aw();
  return {
    insertable: t.editable,
    isBlazeUser: Cw()?.endsWith('@blaze.today'),
    userIsPro: Yw(),
    isOrg: Zw(),
    userMemberData: Jw(),
    userIsPayingPro: Xw(),
    userIsPayingForAny: Xw('TEXT') || Xw('AI'),
    proGrant: n.getProGrant(o),
    userInfo: jw(),
    isPageContentAllowed: n.isAISnippetsAllowedPageContent(o),
    isABProEnabled: !0,
    config: await Mb(),
    chatHistoryMessages: null,
    lastModifiedTimestamp: null,
    sessionId: null,
    snippetData: null,
    meta: { voice: r, hasOrgVoice: s },
  };
}
async function Ub(e) {
  ((lb[e].requestingFrameId = nb.frameId),
    (lb[e].formData = { formId: nb.formId, windowId: nb.windowId }),
    Q('AI_CHAT_METADATA_2', lb));
  const t = await Lb();
  return Object.assign(nb, { model: t });
}
async function Vb(e, t, n) {
  let r = await Tv(e, t, !0);
  if (void 0 === r) return null;
  let i = 0,
    s = 0;
  for (; null !== r; ) {
    const { top: t, left: n } = await O(e, { type: 'getFocusOffset' }, { frameId: r });
    if (((i += t), (s += n), (r = await Tv(e, r)), void 0 === r)) return null;
  }
  return ((n.top += i), (n.bottom += i), (n.left += s), (n.right += s), !0);
}
r.runtime.onMessage.addListener(function (e, t, n) {
  if ('offscreen' !== e?.target && 'formRoot' !== e?.target) return (Nb(e, t, n), !0);
});
const Bb = {
  tabCapture: null,
  pageContent: null,
  selectedContent: null,
  fieldTexts: null,
  sessionId: null,
};
async function jb(e, t) {
  const i = t.tab;
  D('[HANDLE REPLACEMENT]', e.insertionType, i?.url);
  const s = e.insertionType,
    o = 'omnibox' === s,
    {
      replacement: a,
      trigger: u,
      appendage: d,
    } = (function (e, t, n) {
      let r = null,
        i = '',
        s = '';
      if ('context' in e);
      else if ('shortcut' in e) {
        s = e.shortcut;
        let n = e.shortcut.toLocaleLowerCase(),
          o = !1;
        for (; n && !r; ) {
          if (mw[n]) {
            const e = mw[n];
            for (let n = 0; n < e.length; n++) {
              const i = xw.groups[e[n].group_id];
              if (
                t ||
                ((!i || (i.data.options && 'standalone' !== i.data.options.trigger)) &&
                  (!o || (i && i.data.options && 'anywhere' === i.data.options.trigger)))
              ) {
                r = e[n];
                break;
              }
            }
          }
          r || ((n = n.slice(1)), (s = s.slice(1)), (o = !0));
        }
        if (
          !r &&
          ((n = e.shortcut.toLocaleLowerCase()),
          (s = e.shortcut),
          /^[\P{L}]$/u.test(n[n.length - 1]))
        ) {
          const e = n.substr(0, n.length - 1);
          if (((s = s.substr(0, s.length - 1)), mw[e])) {
            const t = mw[e];
            for (let e = 0; e < t.length; e++) {
              const s = xw.groups[t[e].group_id];
              if (s && s.data.options && 'standalone' === s.data.options.trigger) {
                ((r = t[e]), (i = n[n.length - 1]));
                break;
              }
            }
          }
        }
      } else 'snippetId' in e && (r = xw.getSnippetById(e.snippetId));
      return { replacement: r, trigger: s, appendage: i };
    })(e, o),
    f = i?.id,
    p = i?.windowId,
    g = t.frameId;
  if (
    ((async function () {
      if (!P) return;
      if (Z || J) return;
      J = !0;
      const e = U({ type: 'isAlive' }),
        t = C(25e3).then(() => null);
      (null === (await Promise.race([t, e])) &&
        (x(new Error('Offscreen document did not respond in 25000ms and reloaded it')),
        await r.offscreen.closeDocument(),
        (Z = !0),
        await F()),
        (J = !1));
    })(),
    !a)
  ) {
    if (o) return !1;
    n.addBreadcrumb({ message: 'No replacement' });
    const { enabled: t, percent: r } = (function () {
      const { config: e, userState: t } = Aw();
      if (!e.experiments || !e.experiments.WIDGET_PERCENT || 0 === e.experiments.WIDGET_PERCENT)
        return { enabled: !1, percent: 0 };
      if (!t.firebaseMetadata || !t.firebaseMetadata.creationTime)
        return { enabled: !1, percent: 0 };
      const r = e.experiments.WIDGET_START_DATE_NEW || null;
      ((nv.uid === t.uid && e.experiments.WIDGET_PERCENT === nv.percent && r === nv.startDate) ||
        ((nv = { uid: t.uid, percent: e.experiments.WIDGET_PERCENT, startDate: r }),
        (ev = n.isPartOfWidgetExperiment({ config: e, userState: t }))),
        (tv = t.options && void 0 !== t.options.widget_enabled ? t.options.widget_enabled : null));
      let i = !1;
      return (
        (i = null !== tv ? !!tv : !(!l() && c() === h) || (null !== ev && ev)),
        { enabled: i, percent: nv.percent }
      );
    })();
    if (t) {
      const t = 1;
      if ('shortcut' in e && e.shortcut.length >= t && !cb.includes(f)) {
        const t = e.shortcut[0].toUpperCase();
        if (!('A' <= t && t <= 'Z')) {
          const t = (function (e, t, n, r) {
            let i = r.toLocaleLowerCase(),
              s = !1;
            const o = [];
            for (; i; ) {
              const r = s ? t.getPrefixMatches(i) : e.getPrefixMatches(i);
              for (const e of r) {
                const t = n[e];
                for (const n of t) {
                  const t = n.data.name;
                  if (!t) continue;
                  const r = { item: { id: n.id, shortcut: e, body: t }, score: e.length };
                  o.push(r);
                  break;
                }
              }
              ((i = i.slice(1)), (s = !0));
            }
            return (o.sort((e, t) => e.score - t.score), o.slice(0, 10).map(e => e.item));
          })(lw, hw, mw, e.shortcut);
          return { type: 'suggestions', matchingSnippets: t, widgetDeployPercent: r };
        }
      }
    }
    return null;
  }
  if (
    e.ancestorOrigins?.length &&
    'chrome-untrusted://companion-side-panel.top-chrome' === e.ancestorOrigins[0]
  )
    return (
      Lw({
        message: "Text Blaze snippets are not supported in Chrome's Side panel",
        intent: 'fail',
        title: 'Error triggering snippet',
      }),
      !1
    );
  (delete Bb.pageContent,
    delete Bb.tabCapture,
    delete Bb.selectedContent,
    delete Bb.fieldTexts,
    delete Bb.sessionId);
  const m = a.id,
    y = a.group_id,
    w =
      'updateData' in a
        ? {
            group: xw.groups[a.group_id],
            replacementObject: a.data,
            selectedContent: e.selectedContent,
            fieldTexts: e.fieldTexts,
          }
        : {
            replacementObject: a.data,
            selectedContent: e.selectedContent,
            fieldTexts: e.fieldTexts,
          },
    v = t.messageSender?.documentId,
    b = !!t.messageSender?.tab;
  let I = [];
  if (v && !b)
    try {
      I = await r.runtime.getContexts({ documentIds: [v] });
    } catch (e) {
      x(e);
    }
  (n.addBreadcrumb({
    message: 'Snippet triggered',
    data: {
      snippetId: m,
      groupId: y,
      tabId: f,
      frameId: g,
      windowId: p,
      senderOrigin: void 0 === f ? t.messageSender?.origin : f,
      hasTab: b,
      initiatorId: t.messageSender?.id,
      lifecycle: t.messageSender?.documentLifecycle,
      documentId: v,
      matchingContexts: I,
      ancestorOrigins: b ? [] : e.ancestorOrigins,
    },
  }),
    aw(m));
  const T = 'snippetId' in e ? e.typedShortcutText : a.data.shortcut + d;
  D('[FOUND SNIPPET]', m, y, T);
  const _ = await (async function ({
    replacementData: e,
    shortcutToClear: t,
    snippetId: r,
    groupId: i,
    tabId: s,
    tabUrl: o,
    frameId: a,
    windowId: c,
    trigger: u,
    appendage: h,
    isOmnibox: d,
    insertionType: f,
    editorData: p,
  }) {
    let g = !1;
    try {
      const e = new URL(o).hostname;
      ('dashboard.blaze.today' !== e.toLowerCase() &&
        'text.blaze.today' !== e.toLowerCase() &&
        'ai.blaze.today' !== e.toLowerCase()) ||
        (g = !0);
    } catch (e) {}
    if (!('group' in e)) return;
    const { replacementObject: m } = e;
    let y = null;
    'group' in e &&
      ((y = { FOCUS: {} }),
      e.replacementObject.options.include_page_context && (y.PAGE = { include_screenshot: !0 }));
    const w = !!m.options?.is_ai,
      v = !!y.PAGE;
    if (
      w &&
      'shortcut' === f &&
      (await O(s, { type: 'isAIBlazeActive' }, { frameId: 0 }))?.isActive
    )
      return null;
    const b = n.limitationsState(Aw()).MAX_PRO_SNIPPETS_PER_DAY,
      I = await n.usageCount('pro_snippets'),
      T = { isBlazeDashboard: g, remainingSnippets: b - I, maxSnippets: b };
    let _ = !1,
      E = {
        config: {
          connectedAddonWhitelist: [],
          databaseQueryWhitelist: {},
          loadHostWhitelist: [],
          pingHostWhitelist: [],
        },
        isConnected: !1,
        invalidShare: !1,
      };
    if ('group' in e) {
      const t = e.group;
      if (!Yw()) {
        const e = n.limitationsState(Aw()),
          s = kw(),
          o = s
            .filter(e => e.id in vw.groups)
            .map(e => e.id)
            .indexOf(i);
        if (e.MAX_GROUPS && e.CAN_UPGRADE_MAX_GROUPS && o >= e.MAX_GROUPS) {
          if (qb("This snippet's folder uses Pro features.", T)) return null;
          _ = !0;
        }
        if (!_ && e.MAX_SNIPPETS_PER_GROUP && e.CAN_UPGRADE_MAX_SNIPPETS_PER_GROUP) {
          const n = t.snippets,
            i = e.MAX_SNIPPETS_PER_GROUP;
          if (n.length > i) {
            const e = n.map(e => e.id).indexOf(r);
            if (e >= i) {
              if (qb("This snippet's folder uses Pro features.", T)) return null;
              _ = !0;
            }
          }
        }
        if (!_ && e.MAX_SNIPPETS && e.CAN_UPGRADE_MAX_SNIPPETS && vw.groups[t.id]) {
          const n = e.MAX_SNIPPETS;
          let i = 0;
          for (const e of s) {
            if (e.id === t.id) {
              i += e.snippets.map(e => e.id).indexOf(r) + 1;
              break;
            }
            i += e.snippets.length;
          }
          if (i > n) {
            if (qb('This snippet uses Pro features.', T)) return null;
            _ = !0;
          }
        }
      }
      if (fb('xSharingDisabled') && vw.org && vw.org.id !== t.data.associated_org_id)
        return (
          Lw({
            title: 'Cannot Use Snippet',
            message:
              'Snippet is not associated with your organization. Contact your Text Blaze administrator.',
            atCursor: !0,
            intent: 'fail',
          }),
          null
        );
      const s = Aw().userState;
      E = n.getConnectedConfigOptions(s, t.data);
    }
    let S = '';
    try {
      S = new URL(o).hostname || '';
    } catch (e) {}
    const C = {
        domain: S,
        windowId: c,
        tabId: s,
        frameId: a,
        quickentry: m.options?.quick_entry || !1,
        date: new Date(),
        locale: vw.locale,
        user: Jw(),
        snippet: { id: m.id, shortcut: m.shortcut, trigger: u, folderid: i },
        randomSeed: Math.random(),
        addons: void 0,
        findSnippet: void 0,
        commandWhitelist: fb('shouldWhitelistCommands') && (fb('commandWhitelist') || []),
        connectedSettings: E,
        typedShortcutText: t,
        insertionType: f,
        usedCommandsWhitelist: void 0,
        usedSiteSelectors: void 0,
        usedSiteSelectorData: void 0,
        usedLambdaWhitelist: void 0,
        usedSiteTabSelections: {},
        editorData: p,
        isOrg: Zw(),
        needsTabSelectInSiteCommand: !1,
        showNotification: e => {
          K(e);
        },
        appType: 'TEXT',
      },
      A = {
        windowId: c,
        tabId: s,
        frameId: a,
        delta: void 0,
        configDef: C,
        snippetType: void 0,
        name: m.name,
        shortcut: m.shortcut,
        snippetId: m.id,
        groupId: m.group_id,
        appendage: h,
        featureUsage: void 0,
        isBlazeDashboard: g,
        typedShortcutText: t,
        insertionType: f,
        isOmnibox: d,
        maxSnippets: b,
        usageProSnippets: I,
        isAISnippet: !1,
      },
      k = !Yw() && !_;
    if (((Cb = null), w)) {
      if (k) {
        if (qb('AI Snippets are a Text Blaze Pro feature.', T)) return null;
        _ = !0;
      }
      (n.log(
        { action: 'AI Snippet Launch', label: { hostnameAccepted: v } },
        { snippet_id: r, group_id: i }
      ),
        (A.isAISnippet = !0));
      const o = zb(A);
      return (
        (nb.aiData = {
          rawDelta: 'group' in e ? Array.from(e.replacementObject.delta) : null,
          rawPromptText: 'group' in e ? null : e.replacementObject.promptText,
          hostnameAccepted: v,
          contexts: y,
        }),
        (Bb.fieldTexts = e.fieldTexts),
        (Bb.selectedContent = e.selectedContent),
        (Bb.sessionId = 'group' in e ? void 0 : e.replacementObject.sessionId),
        (Cb = { type: 'ai', data: { tabId: s, frameId: a, windowId: c } }),
        (nb.typedShortcutText = ''),
        { type: 'form', formId: o, aiData: { shortcutToClear: t } }
      );
    }
    const D = { type: 'handleReplacement', delta: Array.from(m.delta), configDef: C },
      x = await V(D);
    if (!1 === x.success) {
      const e = 'Error in Snippet - ' + m.shortcut;
      return (Lw({ title: x.title || e, message: x.message, atCursor: !0, intent: 'fail' }), null);
    }
    const {
      featureUsage: N,
      snippetType: R,
      delta: P,
      configDefProps: M,
      isUsingFormFeatures: L,
      replacementRes: F,
    } = x;
    for (const e in M) C[e] = M[e];
    if (((A.delta = P), (A.featureUsage = N), (A.snippetType = R), L)) {
      const e = zb(A);
      return (mb(), { type: 'form', formId: e });
    }
    {
      if (
        k &&
        N.proLabels &&
        N.proLabels.length &&
        qb(
          `This snippet uses ${
            N.proLabels.length > 1 ? 'Text Blaze Pro features:' : 'a Text Blaze Pro feature:'
          } ${N.proLabels.join(' and ')}.`,
          T
        )
      )
        return null;
      const e = F?.replacement,
        n = F.length;
      (l() || yb(n, m.id, m.group_id, N, f), h && e.push({ type: 'string', textStrArr: [h] }));
      const o = { replacement: e, shortcutToClear: t, snippetType: R };
      return d
        ? { type: 'replacement', ...o }
        : (Ib({
            tabId: s,
            frameId: a,
            replacementObj: o,
            insertionType: f,
            snippetId: r,
            groupId: i,
            isForm: !1,
          }),
          !1);
    }
  })({
    replacementData: w,
    shortcutToClear: T,
    snippetId: m,
    groupId: y,
    tabUrl: i?.url,
    tabId: f,
    frameId: g,
    windowId: p,
    trigger: u,
    appendage: d,
    isOmnibox: o,
    insertionType: s,
    editorData: e.editorData,
    tab: i,
  });
  return (null !== _ && Mw(), _);
}
function zb({
  windowId: e,
  tabId: t,
  frameId: r,
  delta: i,
  configDef: s,
  snippetType: o,
  name: a,
  shortcut: c,
  snippetId: u,
  groupId: h,
  appendage: d,
  featureUsage: f,
  isBlazeDashboard: p,
  typedShortcutText: g,
  insertionType: m,
  isOmnibox: y,
  maxSnippets: w,
  usageProSnippets: v,
  isAISnippet: b,
}) {
  (D('[OPEN FORM WINDOW]'),
    (m = m || 'shortcut'),
    (y = y || !1),
    rb++,
    l() ||
      n.log({ category: 'Extension', action: 'Show form window' }, { snippet_id: u, group_id: h }),
    delete s.addons);
  const I = Yw(),
    T = Zw(),
    _ = rb.toString();
  let E = !1,
    S = null,
    C = 0;
  return (
    b ||
      ((E = !!f.features.FORM || !!f.features.REMOTE_LOAD),
      (S =
        E && !I && p && w
          ? 'Forms are a Text Blaze Pro feature. You can try them out in the dashboard.'
          : null),
      (C = !I && !p && w)),
    (nb = {
      isUsingProFeatures: E,
      formId: _,
      windowId: e,
      tabId: t,
      frameId: r,
      snippetId: u,
      groupId: h,
      delta: i,
      addons: yw,
      configDef: s,
      name: a,
      snippetType: o,
      shortcut: c,
      isPro: I,
      isOrg: T,
      maxFreeProSnippets: C,
      usageProSnippets: v,
      countUsage: !p && E,
      message: S,
      appendage: d,
      featureUsage: f,
      typedShortcutText: g,
      insertionType: m,
      isOmnibox: y,
      userId: Sw(),
      locale: vw.locale,
    }),
    _
  );
}
function qb(e, { isBlazeDashboard: t, remainingSnippets: r, maxSnippets: i }) {
  if (i) {
    if (!t)
      return r <= 0
        ? (n.log({ category: 'Purchase', action: 'Pro Trial Completion Blocked' }),
          Lw({
            title: e,
            message: `You have used all of your ${i} trial Text Blaze Pro snippets for the day (these refresh daily).\n\nGet Text Blaze Pro for unlimited Pro snippets, or continue using Text Blaze for free with non-Pro snippets.`,
            buttons: [{ message: 'Get Text Blaze Pro', callback: wb }],
            atCursor: !0,
            intent: 'fail',
          }),
          !0)
        : (n.useFeature('pro_snippets'),
          r--,
          n.log({ category: 'Purchase', action: 'Pro Trial Completion Warning' }),
          void Lw({
            title: `${r}/${i} Pro Trial Snippets Left Today`,
            message: e + ' Get Text Blaze Pro to unlock these features.',
            buttons: [{ message: 'Get Pro', callback: wb }],
          }));
    Lw({
      title: 'Trying a Text Blaze Pro Snippet',
      message: e + ' You can try it out in the dashboard.',
      buttons: [{ message: 'Get Pro', callback: wb }],
    });
  }
}
function Gb(e) {
  return Fv[e.type](e);
}
function $b() {
  if (l()) return null;
  const e = `CRX${a()}`,
    t = c();
  let n = 'extension';
  return (
    t === h || (n += t === d ? ' - dev' : ' - team'),
    {
      reported_release: '3.3.0',
      release: e,
      sentryLogger: n,
      id: Ew() ? Sw() : null,
      extension_browser: u(),
    }
  );
}
function Kb({ subType: e, key: t, value: n }) {
  return 'set' === e ? Q(t, n) : Y(t);
}
(console.log('Service worker started at', new Date()),
  (function () {
    const e = $b();
    n.setupErrorLogging({ details: e });
  })(),
  F().then(() => {
    xw.storage.initiateCacheTimeout('offscreen');
  }),
  (async function () {
    const e = await r.tabs.query({});
    for (const t of e) m(t) && Ov(t);
  })(),
  r.runtime.onInstalled.addListener(e => {
    'install' === e.reason && p('#start');
  }),
  r.action.onClicked.addListener(async function () {
    (n.log({ category: 'Extension', action: 'Open Browser Action', label: 'browser action' }),
      await Vw(),
      Ew() || p());
  }),
  se(function () {
    Ew() && E();
  }),
  sv({ type: 'load' }));
let Wb = null,
  Hb = null,
  Qb = null;
async function Yb(e, t, i) {
  try {
    D('[EXTERNAL MSG]', e.type, t.url, e, t);
    let { hostname: o } = new URL(t.url);
    o = o.toLowerCase();
    const h = [
        'dashboard.blaze.today',
        'spark.blaze.today',
        'text.blaze.today',
        'spark-text.blaze.today',
        'ai.blaze.today',
        'spark-ai.blaze.today',
      ].includes(o),
      d = ['www.blaze.today', 'blaze.today'].includes(o);
    if (!h && !d) return void i(!1);
    if (d && !['check', 'get_version'].includes(e.type)) return void i(!1);
    if ('get_version' === e.type) return void i(a());
    if ('getMetadata' === e.type)
      return i({ browser: u(), version: a(), id: c(), isAuthStuck: Kw, isNotLiveSynced: Ww });
    if ('openLink' === e.type) return void r.tabs.create({ url: e.url });
    if ('reload' === e.type) return void setTimeout(() => $(), 100);
    if ('signout' === e.type) return void Gw();
    if ('get-keyboard-shortcut' === e.type || 'getKeyboardShortcut' === e.type)
      return (X().then(e => i(e)), !0);
    if ('getAllKeyboardShortcuts' === e.type) {
      const e = await r.commands.getAll();
      return i(e);
    }
    if ((await Vw(), 'get_matching_tab_data' === e.type))
      return (
        N().then(t => {
          Kv(e.items, e.tabId || t.id, e.frameId || 0).then(
            ({ selectorData: e, usedSiteTabSelections: t, needsTabSelectInSiteCommand: n }) => {
              i({
                usedSiteSelectorData: e,
                usedSiteTabSelections: t,
                needsTabSelectInSiteCommand: n,
              });
            }
          );
        }),
        !0
      );
    if ('insert_replacement' === e.type) {
      const t = (await r.tabs.query({ active: !0, currentWindow: !0 }))[0].id;
      ((Wb = {
        message: {
          type: 'insert_snippet_separate_context',
          snippetId: e.snippet_id,
          validateFocus: !0,
          insertionType: 'assistant',
        },
        tabId: t,
        timeout: setTimeout(() => {
          (Xb(), x('[ASSISTANT] Hit timeout for port disconnect'));
        }, 900),
      }),
        (await r.runtime.getContexts({})).find(e => 'POPUP' === e.contextType) || Xb(),
        i({ success: !0 }));
    } else {
      if ('active_tab_editable' === e.type)
        return (
          r.tabs.query({ active: !0, currentWindow: !0 }, e => {
            const t = e[0];
            r.tabs.sendMessage(t.id, { type: 'editable_check' }, e => {
              e && i(e);
            });
          }),
          !0
        );
      if ('application_state' === e.type) {
        let r = '';
        try {
          r = new URL(t.tab?.url).hostname;
        } catch (e) {}
        return (
          i(
            (function (e, t) {
              const r = 500;
              if (void 0 !== e.chunk && e.chunk > 0) {
                if (Qb === e.chunkAccessKey) {
                  const t = Hb.length;
                  return {
                    snippets: Hb.slice(e.chunk * r, (e.chunk + 1) * r),
                    totalSnippetCount: t,
                  };
                }
                {
                  const e = 'Successive snippet chunk did not use cache';
                  return (console.warn(e), n.captureException(new Error(e)), null);
                }
              }
              const i = kw();
              let s = [];
              for (const e of i) s = s.concat(e.snippets);
              let o = s.map(e => e.data),
                a = i.map((e, t) => ({
                  id: e.data.id,
                  name: e.data.name,
                  options: e.data.options,
                  connected: e.data.connected,
                  order: t,
                }));
              const c = yw,
                u = {
                  userData: vw,
                  org: Aw().orgState.org,
                  groups: a,
                  config: bw,
                  addons: c,
                  isPro: Yw(),
                };
              if (void 0 === e.chunk) return { ...u, snippets: o };
              ((Qb = e.chunkAccessKey), (Hb = o));
              const l = o.length,
                h = Math.ceil(l / r);
              return (
                (o = o.slice(e.chunk * r, (e.chunk + 1) * r)),
                { ...u, totalChunkCount: h, snippets: o, totalSnippetCount: l }
              );
            })(e)
          ),
          !1
        );
      }
      if ('get_credentials' === e.type)
        return (
          (async function (e) {
            const t = e.data;
            return 'token' === t
              ? (async function () {
                  let e = { provider: 'token', data: null };
                  try {
                    _w() && (e = { provider: 'token', data: await n.getTokenCredentials(Yy) });
                  } catch {}
                  return e;
                })()
              : 'JWT' === t
                ? { provider: 'JWT', data: await Qw(e.force_refresh) }
                : void 0;
          })(e).then(i),
          !0
        );
      if ('credentials' === e.type)
        !(function (e) {
          if (null === e.credentials) Gw();
          else if ('token' === e.credentials.provider) {
            const t = e.credentials.options || {},
              n = e.credentials.data;
            (zw && !t.skipLoggingInCheck) ||
              (((_w() ? Sw() : null) !== n.uid || t.skipUIDCheck) &&
                ((zw = !0),
                (qw = new Promise(e => {
                  let r = !1;
                  const i = () => {
                    r || ((r = !0), (zw = !1), e());
                  };
                  (-1 !== t.timeout && setTimeout(() => i(), 'timeout' in t ? t.timeout : 8e3),
                    (async function (e, t) {
                      if (dt(e.app)) return Promise.reject(Tm(e));
                      const n = fy(e),
                        r = await (async function (e, t) {
                          return Mm(e, 'POST', '/v1/accounts:signInWithCustomToken', Om(e, t));
                        })(n, { token: t, returnSecureToken: !0 }),
                        i = await Py._fromIdTokenResponse(n, 'signIn', r);
                      return (await n._updateCurrentUser(i.user), i);
                    })(Hy(Yy), n.token)
                      .then(() => {
                        (i(), t.reload && $());
                      })
                      .catch(function (e) {
                        (i(), console.error(e));
                      }));
                }))));
          }
        })(e);
      else {
        if ('logged_in_status' === e.type)
          return (
            (async function (e) {
              let t = qw;
              if ((e.data && e.data.immediate && (t = Promise.resolve()), await t, _w())) {
                const e = Hy(Yy).currentUser;
                return {
                  loggedIn: !0,
                  email: e.email,
                  emailVerified: e.emailVerified,
                  uid: e.uid,
                  supports: ['localStorage', 'token'],
                };
              }
              return { loggedIn: !1, supports: ['localStorage', 'token'] };
            })(e).then(e => i(e)),
            !0
          );
        if ('check' === e.type) i('installed');
        else {
          if ('remote' === e.type) return (Gb(e.attributes).then(e => i(e)), !0);
          if (['stopPicking', 'startPicking', 'abortPicking'].includes(e.type)) {
            const n = t.tab?.id;
            if (
              (function (e, t, n) {
                if ('startPicking' === e.type)
                  return Cv
                    ? void console.warn('Trying to enable picking when it is already enabled')
                    : (t ? (Av = t) : console.warn('Sender tab is undefined'),
                      (Cv = !0),
                      (kv = n),
                      (Dv.generationMode = e.isMultiple ? 'multiple' : 'single'),
                      (Dv.supportsPage = !!e.supportsPage),
                      (Dv.needsClick = !!e.needsClick),
                      (Dv.supportsCrossIframe = !!e.supportsCrossIframe),
                      !0);
                'stopPicking' === e.type
                  ? Nv()
                  : 'abortPicking' === e.type && Nv({ selector: '' }, !1);
              })(e, n, i)
            )
              return !0;
          } else if ('assistantAction' === e.type)
            !(async function (e, t) {
              const n = t.tab.id;
              if (e.isWebpageEmbedded) {
                const t = Pb(n);
                await Ob(n, { shouldHide: !0, forceHide: !0, shouldRestore: !1, noAnimation: !0 });
                try {
                  const r = await _b(...t);
                  if (!1 === r.success) {
                    if ('insert-text' === e.subType)
                      return void Lw({
                        title: 'Failed to insert the text',
                        message:
                          'This usually means the text box where we were going to insert into has been removed from the page.\n\nYou can use the Copy button to copy the text and paste it manually.',
                        intent: 'fail',
                      }).then(() => {
                        Rb(n, 'unhide');
                      });
                    console.log(r);
                  }
                } catch (e) {
                  (x(e), console.error(e));
                }
              }
              const { textFull: r, snippetType: i } = e.data,
                s = 'polish' === e.data.actionType;
              'copy' === e.subType
                ? Wv({ text: r.text, html: r.html })
                : 'insert-text' === e.subType &&
                  (async function ({
                    snippetId: e,
                    insertionType: t,
                    groupId: n,
                    snippetType: r,
                    textFull: i,
                    isRewrite: s,
                  }) {
                    const o = (await N()).id,
                      a = lb[o].requestingFrameId;
                    (Mw(),
                      l() ||
                        yb(
                          i.text.length,
                          e,
                          n,
                          {
                            features: {
                              COMMANDS: [],
                              LAMBDAS: [],
                              MISSING_ADDONS: {},
                              SITE_SELECTORS: [],
                            },
                          },
                          t,
                          'ai'
                        ));
                    const c = 'html' === r ? [i.html] : void 0;
                    let u = null;
                    (s && (u = 'shortcut' === t ? 'preceding' : 'full'),
                      await Ib({
                        tabId: o,
                        frameId: a,
                        groupId: n,
                        snippetId: e,
                        insertionType: t,
                        isForm: !1,
                        rewriteMode: u,
                        replacementObj: {
                          replacement: [{ type: 'string', textStrArr: [i.text], htmlStrArr: c }],
                          shortcutToClear: '',
                          snippetType: r,
                        },
                      }));
                  })({
                    textFull: r,
                    snippetId: e.data.snippet?.id || '',
                    insertionType: e.data.snippet?.insertionType,
                    groupId: e.data.snippet?.groupId,
                    snippetType: i,
                    isRewrite: s,
                  });
            })(e, t);
          else {
            if ('autowrite' === e.type)
              return (
                (async function (e, t) {
                  const n = t.frameId,
                    r = t.tab.id;
                  if ('close' === e.subType)
                    if (lb[r]) {
                      const t = Pb(r);
                      (await Ob(r, e.data), await _b(...t));
                    } else
                      (await O(r, { type: 'aiChat', subType: 'forceClearEmbed' }, { frameId: 0 }))
                        ?.success || x('Failed to clear embed panel');
                  else if ('saveModel' === e.subType) Q('aiSnippetsModel', e.model);
                  else {
                    if ('getModel' === e.subType) return { model: await Lb() };
                    if ('toggleConfig' === e.subType) {
                      const t = await Mb();
                      ((t[e.name] = !t[e.name]), await Q('aiLocalConfig', t));
                    } else if ('chatLoaded' === e.subType)
                      O(r, { type: 'aiChat', subType: 'expand' }, { frameId: 0 });
                    else if (
                      'embedLoaded' === e.subType &&
                      (lb[r] ||
                        (lb[r] = { shownFrameId: n, formData: void 0, requestingFrameId: void 0 }),
                      nb)
                    ) {
                      let e = await (async function (e) {
                        const [t, n, r] = await Promise.all([Fb(e), Ab(e), Ub(e)]);
                        return (
                          (nb = null),
                          delete Bb.sessionId,
                          { data: t, frame: n, initial: r }
                        );
                      })(r);
                      return (
                        e.initial.aiData.contexts.FOCUS ||
                          ((e.frame.fieldTexts = null),
                          (e.frame.selectedContent = null),
                          (e.initial.aiData.precedingText = void 0)),
                        e
                      );
                    }
                  }
                })(e, t).then(e => {
                  i(e);
                }),
                !0
              );
            if ('getClipboard' === e.type)
              return (
                (async function () {
                  return await U({ type: 'getClipboard' });
                })().then(e => i(e)),
                !0
              );
            if ('supportsFeature' === e.type)
              return i({ supports: ['transcription'].includes(e.feature) });
            if ('getSnippetsByShortcut' === e.type) return i(Fw(e.snippet));
            if ('showNotification' === e.type) return i(Lw(e));
            if ('focusTab' === e.type) return i(B(e.tabId));
            if ('testingStoreIncorrectData' === e.type)
              return (((s = e.mode), hv(s)).then(e => i('done')), !0);
            if ('testingHangFirebase' === e.type)
              return (
                (function (e) {
                  return Q('TEST_shouldhangfirebase', 'hangFirebase' + e.duration);
                })(e).then(() => i('done')),
                !0
              );
            if ('testingAuthMetadata' === e.type) return void i({ hasAuthChanged: Tw() });
            if ('testingExpireCachedToken' === e.type) {
              i({ hasAuthChanged: Tw() });
              const e = Bw()?.user_info?.token;
              return (
                e && (e.claims.exp = Math.floor(Date.now() / 1e3 - 1e4).toString()),
                void i('done')
              );
            }
            if ('testingGetSyncInit' === e.type)
              return (xw.storage.hasInitializedFromCache().then(e => i(e)), !0);
            if ('testingClearAllCache' === e.type)
              return (delete self.cachedStorageData, await Q(cv, null), i('done'), !0);
            if ('performLogging' === e.type) {
              const t = e.args;
              return n.log(...t);
            }
            if ('extensionStorage' === e.type) return (Kb(e).then(e => i(e)), !0);
            if ('sendToFrameOnActiveTab' === e.type) {
              const n = await (async function (e, t) {
                const n = 'ACTIVE' === t.context ? fv(e) : 0;
                return O(e, t.message, { frameId: n });
              })(t.tab.id, e);
              i(n);
            } else {
              if ('copyText' === e.type)
                return (Wv({ html: e.html, text: e.text }).then(() => i(!0)), !0);
              if ('notifyWhenAuthIsUnstuck' === e.type)
                return (Hw.then(() => i({ authResolved: !0 })), !0);
              if ('getUserMetadata' === e.type)
                i({
                  uid: Ew() ? Sw() : null,
                  email: Ew() ? Cw() : null,
                  loggedIn: Ew(),
                  loggedInAndConnected: _w(),
                  createdAt: +vw.firebaseMetadata?.createdAt,
                });
              else if ('getFirestoreData' === e.type) {
                if (!Ew()) return (i(null), !1);
                const t = {
                  values: e.paths.map(e => {
                    let t = vw;
                    for (const n of e.split('.')) {
                      if (!t || 'object' != typeof t || !t.hasOwnProperty(n)) {
                        t = null;
                        break;
                      }
                      t = t[n];
                    }
                    return t;
                  }),
                };
                return (i(t), !1);
              }
            }
          }
        }
      }
    }
    i('received');
  } catch (e) {
    throw (n.captureException(e), e);
  }
  var s;
}
async function Xb() {
  Wb && (clearTimeout(Wb.timeout), r.tabs.sendMessage(Wb.tabId, Wb.message), (Wb = null));
}
(r.runtime.onMessageExternal.addListener(function (e, t, n) {
  return (Yb(e, t, n), !0);
}),
  r.runtime.onConnect.addListener(function (e) {
    'popup' === e.name &&
      e.onDisconnect.addListener(function () {
        Xb();
      });
  }),
  (self.enablePageDebug = function () {
    (!(async function () {
      const e = await r.tabs.query({});
      for (const t of e) O(t.id, { type: 'enableDebug' });
    })(),
      (A = !0));
  }));
