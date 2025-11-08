// @ts-nocheck
var xe =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
    ? window
    : typeof global < 'u'
    ? global
    : typeof self < 'u'
    ? self
    : {};
function er(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, 'default') ? t.default : t;
}
var Na = function t(e, r) {
  if (e === r) return !0;
  if (e && r && typeof e == 'object' && typeof r == 'object') {
    if (e.constructor !== r.constructor) return !1;
    var n, i, s;
    if (Array.isArray(e)) {
      if (((n = e.length), n != r.length)) return !1;
      for (i = n; i-- !== 0; ) if (!t(e[i], r[i])) return !1;
      return !0;
    }
    if (e instanceof Map && r instanceof Map) {
      if (e.size !== r.size) return !1;
      for (i of e.entries()) if (!r.has(i[0])) return !1;
      for (i of e.entries()) if (!t(i[1], r.get(i[0]))) return !1;
      return !0;
    }
    if (e instanceof Set && r instanceof Set) {
      if (e.size !== r.size) return !1;
      for (i of e.entries()) if (!r.has(i[0])) return !1;
      return !0;
    }
    if (ArrayBuffer.isView(e) && ArrayBuffer.isView(r)) {
      if (((n = e.length), n != r.length)) return !1;
      for (i = n; i-- !== 0; ) if (e[i] !== r[i]) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
    if (((s = Object.keys(e)), (n = s.length), n !== Object.keys(r).length)) return !1;
    for (i = n; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(r, s[i])) return !1;
    for (i = n; i-- !== 0; ) {
      var o = s[i];
      if (!t(e[o], r[o])) return !1;
    }
    return !0;
  }
  return e !== e && r !== r;
};
const Ci = er(Na);
function Pa(t, e) {
  try {
    let r = new URL(t);
    return {
      url: t,
      protocol: r.protocol.slice(0, r.protocol.length - 1),
      domain: r.hostname,
      port: r.port,
      path: r.pathname,
      query: r.search,
      hash: r.hash,
    }[e];
  } catch {
    return { error: 'Could not parse URL' };
  }
}
const Xr = '<TB>';
function La(t) {
  return t.page + Xr + t.group;
}
function Ui(t) {
  return t.select === 'no' ? 'current-tab' : t.page + Xr + t.group;
}
function Ba(t, e) {
  const r = t?.[Ui(e)]?.res || t?.[La(e)]?.res;
  if (r) {
    for (const { item: n, res: i } of r)
      if (Ci(n, e)) return typeof i == 'string' && e.part === 'url' ? Pa(i, e.urlPart) : i;
  }
}
function Ca(t) {
  const e = {};
  for (const r in t) {
    const n = t[r],
      i = {
        deltaArray: Array.from(n.addon.data.delta),
        delta: n.addon.data.delta,
        options: n.addon.data.options,
        addonOptions: n.addon.addonOptions,
      };
    e[r] = Object.assign({}, n, { addon: i });
  }
  return e;
}
const Mi = 'P';
function Ua(t, e) {
  if (e === Mi || !(t instanceof HTMLElement) || t.tagName.toLowerCase() === 'table') return;
  const r = document.createElement(e);
  [...t.attributes].forEach(n => {
    r.setAttribute(n.name, n.value);
  }),
    r.append(...t.childNodes),
    t.replaceWith(r);
}
const Ma = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
  Fa = ['P', 'UL', 'OL', 'BLOCKQUOTE', 'LI'].concat(Ma);
function Ga(t) {
  return t.includes('<p') || t.includes('<ul') || t.includes('<ol') || t.includes('<blockquote');
}
function Fi(t, e) {
  if (t instanceof HTMLElement && Fa.includes(t.tagName)) {
    let n = '';
    for (const i in e) t.style[i] || (n += `${i}:${e[i]};`);
    if (
      ((n = n + (t.hasAttribute('style') ? t.getAttribute('style') : '')),
      t.setAttribute('style', n),
      t.setAttribute('data-mce-style', n),
      ['OL', 'UL'].includes(t.tagName))
    )
      for (const i of t.children) Fi(i, e);
  }
}
function ja(t, e, r) {
  if (t !== void 0 && ((r = r || Mi), e && Object.keys(e).length))
    if (Ga(t)) {
      const n = document.createElement('div');
      n.innerHTML = t;
      const i = [...n.children];
      for (const s of i) Ua(s, r);
      for (const s of n.children) Fi(s, e);
      t = n.innerHTML;
    } else {
      const n = document.createElement('span');
      n.innerHTML = t;
      for (const i in e) n.style[i] = e[i];
      t = n.outerHTML;
    }
  return t;
}
function $a(t) {
  let e = '',
    r;
  for (const n of t)
    if (n.type === 'string') {
      for (const i of n.textStrArr) typeof i == 'string' && (e += i + ' ');
      if (
        ((e += `
`),
        n.htmlStrArr)
      ) {
        r || (r = '');
        for (const i of n.htmlStrArr) typeof i == 'string' && (r += i + ' ');
        r += `
`;
      }
    }
  return (e = e.trimEnd()), r && (r = r.trimEnd()), { textString: e, htmlString: r };
}
function Ha(t) {
  function e(i) {
    for (const o of [...i.childNodes]) o instanceof Element && e(o);
    function s(o) {
      if (o >= i.childNodes.length) return !1;
      const a = i.childNodes[o];
      return (
        (a instanceof HTMLParagraphElement &&
          a.style.textAlign === '' &&
          a.style.direction === '') ||
        a instanceof HTMLBRElement
      );
    }
    for (let o = 0; o < i.childNodes.length - 1; o++)
      if (s(o) && s(o + 1)) {
        i.childNodes[o].appendChild(document.createElement('br'));
        const a = i.childNodes[o + 1];
        a.tagName !== 'BR' &&
          (a.children.length !== 1 || a.children[0].tagName !== 'BR') &&
          i.childNodes[o].append(...a.childNodes),
          a.remove(),
          o--;
      }
  }
  const r = document.createElement('div');
  (r.innerHTML = t), e(r);
  let n = r.innerHTML;
  return (n = n.replaceAll('<br>', '<br/>')), n;
}
function Gi(t, e) {
  let r = null,
    n = 0;
  function i() {
    (n = Date.now()), r && (clearTimeout(r), (r = null)), t();
  }
  return () => {
    const s = Date.now();
    if (!r) {
      const o = n + e,
        a = o <= s ? e : o - s;
      r = setTimeout(() => {
        i();
      }, a);
    }
  };
}
function Wa(t, e) {
  let r = null;
  return function (...n) {
    r && clearTimeout(r),
      (r = setTimeout(() => {
        (r = null), t(...n);
      }, e));
  };
}
function qa(t, e, r) {
  let n = { email: t };
  if (!e) return n;
  let i = {},
    s = {};
  for (let a of e) a.sharing === 'master' ? (s[a.name] = a.default) : (i[a.name] = a.default);
  let o = {};
  if (r) for (let a of e) a.name in r && (o[a.name] = r[a.name]);
  return Object.assign(n, i, o, s);
}
var Ya = function t(e, r) {
  if (e === r) return !0;
  if (e && r && typeof e == 'object' && typeof r == 'object') {
    if (e.constructor !== r.constructor) return !1;
    var n, i, s;
    if (Array.isArray(e)) {
      if (((n = e.length), n != r.length)) return !1;
      for (i = n; i-- !== 0; ) if (!t(e[i], r[i])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
    if (((s = Object.keys(e)), (n = s.length), n !== Object.keys(r).length)) return !1;
    for (i = n; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(r, s[i])) return !1;
    for (i = n; i-- !== 0; ) {
      var o = s[i];
      if (!t(e[o], r[o])) return !1;
    }
    return !0;
  }
  return e !== e && r !== r;
};
const zt = er(Ya);
function za() {
  return typeof __SENTRY_BROWSER_BUNDLE__ < 'u' && !!__SENTRY_BROWSER_BUNDLE__;
}
function Kr() {
  return (
    !za() &&
    Object.prototype.toString.call(typeof process < 'u' ? process : 0) === '[object process]'
  );
}
function Va(t, e) {
  return t.require(e);
}
var Ja = {};
function W() {
  return Kr() ? global : typeof window < 'u' ? window : typeof self < 'u' ? self : Ja;
}
function Qr(t, e, r) {
  var n = r || W(),
    i = (n.__SENTRY__ = n.__SENTRY__ || {}),
    s = i[t] || (i[t] = e());
  return s;
}
var ji = Object.prototype.toString;
function $i(t) {
  switch (ji.call(t)) {
    case '[object Error]':
    case '[object Exception]':
    case '[object DOMException]':
      return !0;
    default:
      return Pe(t, Error);
  }
}
function at(t, e) {
  return ji.call(t) === `[object ${e}]`;
}
function Hi(t) {
  return at(t, 'ErrorEvent');
}
function Gn(t) {
  return at(t, 'DOMError');
}
function Xa(t) {
  return at(t, 'DOMException');
}
function nt(t) {
  return at(t, 'String');
}
function Wi(t) {
  return t === null || (typeof t != 'object' && typeof t != 'function');
}
function it(t) {
  return at(t, 'Object');
}
function Zr(t) {
  return typeof Event < 'u' && Pe(t, Event);
}
function Ka(t) {
  return typeof Element < 'u' && Pe(t, Element);
}
function Qa(t) {
  return at(t, 'RegExp');
}
function en(t) {
  return !!(t && t.then && typeof t.then == 'function');
}
function Za(t) {
  return it(t) && 'nativeEvent' in t && 'preventDefault' in t && 'stopPropagation' in t;
}
function eu(t) {
  return typeof t == 'number' && t !== t;
}
function Pe(t, e) {
  try {
    return t instanceof e;
  } catch {
    return !1;
  }
}
function Ir(t, e) {
  try {
    let a = t;
    var r = 5,
      n = 80,
      i = [];
    let c = 0,
      f = 0;
    var s = ' > ',
      o = s.length;
    let g;
    for (
      ;
      a &&
      c++ < r &&
      ((g = tu(a, e)), !(g === 'html' || (c > 1 && f + i.length * o + g.length >= n)));

    )
      i.push(g), (f += g.length), (a = a.parentNode);
    return i.reverse().join(s);
  } catch {
    return '<unknown>';
  }
}
function tu(t, e) {
  var r = t,
    n = [];
  let i, s, o, a, c;
  if (!r || !r.tagName) return '';
  n.push(r.tagName.toLowerCase());
  var f = e && e.length ? e.filter(_ => r.getAttribute(_)).map(_ => [_, r.getAttribute(_)]) : null;
  if (f && f.length)
    f.forEach(_ => {
      n.push(`[${_[0]}="${_[1]}"]`);
    });
  else if ((r.id && n.push(`#${r.id}`), (i = r.className), i && nt(i)))
    for (s = i.split(/\s+/), c = 0; c < s.length; c++) n.push(`.${s[c]}`);
  var g = ['type', 'name', 'title', 'alt'];
  for (c = 0; c < g.length; c++) (o = g[c]), (a = r.getAttribute(o)), a && n.push(`[${o}="${a}"]`);
  return n.join('');
}
function ru() {
  var t = W();
  try {
    return t.document.location.href;
  } catch {
    return '';
  }
}
class J extends Error {
  constructor(e, r = 'warn') {
    super(e),
      (this.message = e),
      (this.name = new.target.prototype.constructor.name),
      Object.setPrototypeOf(this, new.target.prototype),
      (this.logLevel = r);
  }
}
var nu = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function iu(t) {
  return t === 'http' || t === 'https';
}
function tn(t, e = !1) {
  const { host: r, path: n, pass: i, port: s, projectId: o, protocol: a, publicKey: c } = t;
  return `${a}://${c}${e && i ? `:${i}` : ''}@${r}${s ? `:${s}` : ''}/${n && `${n}/`}${o}`;
}
function su(t) {
  var e = nu.exec(t);
  if (!e) throw new J(`Invalid Sentry Dsn: ${t}`);
  const [r, n, i = '', s, o = '', a] = e.slice(1);
  let c = '',
    f = a;
  var g = f.split('/');
  if ((g.length > 1 && ((c = g.slice(0, -1).join('/')), (f = g.pop())), f)) {
    var _ = f.match(/^\d+/);
    _ && (f = _[0]);
  }
  return qi({ host: s, pass: i, path: c, projectId: f, port: o, protocol: r, publicKey: n });
}
function qi(t) {
  return {
    protocol: t.protocol,
    publicKey: t.publicKey || '',
    pass: t.pass || '',
    host: t.host,
    port: t.port || '',
    path: t.path || '',
    projectId: t.projectId,
  };
}
function ou(t) {
  if (!(typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__)) return;
  const { port: e, projectId: r, protocol: n } = t;
  var i = ['protocol', 'publicKey', 'host', 'projectId'];
  if (
    (i.forEach(s => {
      if (!t[s]) throw new J(`Invalid Sentry Dsn: ${s} missing`);
    }),
    !r.match(/^\d+$/))
  )
    throw new J(`Invalid Sentry Dsn: Invalid projectId ${r}`);
  if (!iu(n)) throw new J(`Invalid Sentry Dsn: Invalid protocol ${n}`);
  if (e && isNaN(parseInt(e, 10))) throw new J(`Invalid Sentry Dsn: Invalid port ${e}`);
  return !0;
}
function au(t) {
  var e = typeof t == 'string' ? su(t) : qi(t);
  return ou(e), e;
}
var uu = W(),
  lu = 'Sentry Logger ',
  Vt = ['debug', 'info', 'warn', 'error', 'log', 'assert', 'trace'];
function Yi(t) {
  var e = W();
  if (!('console' in e)) return t();
  var r = e.console,
    n = {};
  Vt.forEach(i => {
    var s = r[i] && r[i].__sentry_original__;
    i in e.console && s && ((n[i] = r[i]), (r[i] = s));
  });
  try {
    return t();
  } finally {
    Object.keys(n).forEach(i => {
      r[i] = n[i];
    });
  }
}
function jn() {
  let t = !1;
  var e = {
    enable: () => {
      t = !0;
    },
    disable: () => {
      t = !1;
    },
  };
  return (
    typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__
      ? Vt.forEach(r => {
          e[r] = (...n) => {
            t &&
              Yi(() => {
                uu.console[r](`${lu}[${r}]:`, ...n);
              });
          };
        })
      : Vt.forEach(r => {
          e[r] = () => {};
        }),
    e
  );
}
let I;
typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__ ? (I = Qr('logger', jn)) : (I = jn());
function pt(t, e = 0) {
  return typeof t != 'string' || e === 0 || t.length <= e ? t : `${t.substr(0, e)}...`;
}
function $n(t, e) {
  if (!Array.isArray(t)) return '';
  var r = [];
  for (let i = 0; i < t.length; i++) {
    var n = t[i];
    try {
      r.push(String(n));
    } catch {
      r.push('[value cannot be serialized]');
    }
  }
  return r.join(e);
}
function rn(t, e) {
  return nt(t) ? (Qa(e) ? e.test(t) : typeof e == 'string' ? t.indexOf(e) !== -1 : !1) : !1;
}
function X(t, e, r) {
  if (e in t) {
    var n = t[e],
      i = r(n);
    if (typeof i == 'function')
      try {
        zi(i, n);
      } catch {}
    t[e] = i;
  }
}
function nn(t, e, r) {
  Object.defineProperty(t, e, { value: r, writable: !0, configurable: !0 });
}
function zi(t, e) {
  var r = e.prototype || {};
  (t.prototype = e.prototype = r), nn(t, '__sentry_original__', e);
}
function sn(t) {
  return t.__sentry_original__;
}
function cu(t) {
  return Object.keys(t)
    .map(e => `${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`)
    .join('&');
}
function Vi(t) {
  if ($i(t)) return { message: t.message, name: t.name, stack: t.stack, ...Wn(t) };
  if (Zr(t)) {
    var e = { type: t.type, target: Hn(t.target), currentTarget: Hn(t.currentTarget), ...Wn(t) };
    return typeof CustomEvent < 'u' && Pe(t, CustomEvent) && (e.detail = t.detail), e;
  } else return t;
}
function Hn(t) {
  try {
    return Ka(t) ? Ir(t) : Object.prototype.toString.call(t);
  } catch {
    return '<unknown>';
  }
}
function Wn(t) {
  if (typeof t == 'object' && t !== null) {
    var e = {};
    for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
    return e;
  } else return {};
}
function fu(t, e = 40) {
  var r = Object.keys(Vi(t));
  if ((r.sort(), !r.length)) return '[object has no keys]';
  if (r[0].length >= e) return pt(r[0], e);
  for (let i = r.length; i > 0; i--) {
    var n = r.slice(0, i).join(', ');
    if (!(n.length > e)) return i === r.length ? n : pt(n, e);
  }
  return '';
}
function on(t) {
  var e = new Map();
  return Nr(t, e);
}
function Nr(t, e) {
  if (it(t)) {
    var r = e.get(t);
    if (r !== void 0) return r;
    var n = {};
    e.set(t, n);
    for (var i of Object.keys(t)) typeof t[i] < 'u' && (n[i] = Nr(t[i], e));
    return n;
  }
  if (Array.isArray(t)) {
    var r = e.get(t);
    if (r !== void 0) return r;
    var n = [];
    return (
      e.set(t, n),
      t.forEach(a => {
        n.push(Nr(a, e));
      }),
      n
    );
  }
  return t;
}
var du = 50;
function Ji(...t) {
  var e = t.sort((r, n) => r[0] - n[0]).map(r => r[1]);
  return (r, n = 0) => {
    var i = [];
    for (var s of r
      .split(
        `
`
      )
      .slice(n)) {
      var o = s.replace(/\(error: (.*)\)/, '$1');
      for (var a of e) {
        var c = a(o);
        if (c) {
          i.push(c);
          break;
        }
      }
    }
    return pu(i);
  };
}
function hu(t) {
  return Array.isArray(t) ? Ji(...t) : t;
}
function pu(t) {
  if (!t.length) return [];
  let e = t;
  var r = e[0].function || '',
    n = e[e.length - 1].function || '';
  return (
    (r.indexOf('captureMessage') !== -1 || r.indexOf('captureException') !== -1) &&
      (e = e.slice(1)),
    n.indexOf('sentryWrapped') !== -1 && (e = e.slice(0, -1)),
    e
      .slice(0, du)
      .map(i => ({ ...i, filename: i.filename || e[0].filename, function: i.function || '?' }))
      .reverse()
  );
}
var yr = '<anonymous>';
function Ne(t) {
  try {
    return !t || typeof t != 'function' ? yr : t.name || yr;
  } catch {
    return yr;
  }
}
function an() {
  if (!('fetch' in W())) return !1;
  try {
    return new Headers(), new Request('http://www.example.com'), new Response(), !0;
  } catch {
    return !1;
  }
}
function Pr(t) {
  return t && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(t.toString());
}
function gu() {
  if (!an()) return !1;
  var t = W();
  if (Pr(t.fetch)) return !0;
  let e = !1;
  var r = t.document;
  if (r && typeof r.createElement == 'function')
    try {
      var n = r.createElement('iframe');
      (n.hidden = !0),
        r.head.appendChild(n),
        n.contentWindow && n.contentWindow.fetch && (e = Pr(n.contentWindow.fetch)),
        r.head.removeChild(n);
    } catch (i) {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn(
          'Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ',
          i
        );
    }
  return e;
}
function mu() {
  var t = W(),
    e = t.chrome,
    r = e && e.app && e.app.runtime,
    n = 'history' in t && !!t.history.pushState && !!t.history.replaceState;
  return !r && n;
}
var G = W(),
  gt = {},
  qn = {};
function _u(t) {
  if (!qn[t])
    switch (((qn[t] = !0), t)) {
      case 'console':
        vu();
        break;
      case 'dom':
        ku();
        break;
      case 'xhr':
        bu();
        break;
      case 'fetch':
        yu();
        break;
      case 'history':
        wu();
        break;
      case 'error':
        Au();
        break;
      case 'unhandledrejection':
        Du();
        break;
      default:
        (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
          I.warn('unknown instrumentation type:', t);
        return;
    }
}
function Te(t, e) {
  (gt[t] = gt[t] || []), gt[t].push(e), _u(t);
}
function se(t, e) {
  if (!(!t || !gt[t]))
    for (var r of gt[t] || [])
      try {
        r(e);
      } catch (n) {
        (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
          I.error(
            `Error while triggering instrumentation handler.
Type: ${t}
Name: ${Ne(r)}
Error:`,
            n
          );
      }
}
function vu() {
  'console' in G &&
    Vt.forEach(function (t) {
      t in G.console &&
        X(G.console, t, function (e) {
          return function (...r) {
            se('console', { args: r, level: t }), e && e.apply(G.console, r);
          };
        });
    });
}
function yu() {
  gu() &&
    X(G, 'fetch', function (t) {
      return function (...e) {
        var r = { args: e, fetchData: { method: Eu(e), url: Su(e) }, startTimestamp: Date.now() };
        return (
          se('fetch', { ...r }),
          t.apply(G, e).then(
            n => (se('fetch', { ...r, endTimestamp: Date.now(), response: n }), n),
            n => {
              throw (se('fetch', { ...r, endTimestamp: Date.now(), error: n }), n);
            }
          )
        );
      };
    });
}
function Eu(t = []) {
  return 'Request' in G && Pe(t[0], Request) && t[0].method
    ? String(t[0].method).toUpperCase()
    : t[1] && t[1].method
    ? String(t[1].method).toUpperCase()
    : 'GET';
}
function Su(t = []) {
  return typeof t[0] == 'string'
    ? t[0]
    : 'Request' in G && Pe(t[0], Request)
    ? t[0].url
    : String(t[0]);
}
function bu() {
  if ('XMLHttpRequest' in G) {
    var t = XMLHttpRequest.prototype;
    X(t, 'open', function (e) {
      return function (...r) {
        var n = this,
          i = r[1],
          s = (n.__sentry_xhr__ = { method: nt(r[0]) ? r[0].toUpperCase() : r[0], url: r[1] });
        nt(i) && s.method === 'POST' && i.match(/sentry_key/) && (n.__sentry_own_request__ = !0);
        var o = function () {
          if (n.readyState === 4) {
            try {
              s.status_code = n.status;
            } catch {}
            se('xhr', { args: r, endTimestamp: Date.now(), startTimestamp: Date.now(), xhr: n });
          }
        };
        return (
          'onreadystatechange' in n && typeof n.onreadystatechange == 'function'
            ? X(n, 'onreadystatechange', function (a) {
                return function (...c) {
                  return o(), a.apply(n, c);
                };
              })
            : n.addEventListener('readystatechange', o),
          e.apply(n, r)
        );
      };
    }),
      X(t, 'send', function (e) {
        return function (...r) {
          return (
            this.__sentry_xhr__ && r[0] !== void 0 && (this.__sentry_xhr__.body = r[0]),
            se('xhr', { args: r, startTimestamp: Date.now(), xhr: this }),
            e.apply(this, r)
          );
        };
      });
  }
}
let jt;
function wu() {
  if (!mu()) return;
  var t = G.onpopstate;
  G.onpopstate = function (...r) {
    var n = G.location.href,
      i = jt;
    if (((jt = n), se('history', { from: i, to: n }), t))
      try {
        return t.apply(this, r);
      } catch {}
  };
  function e(r) {
    return function (...n) {
      var i = n.length > 2 ? n[2] : void 0;
      if (i) {
        var s = jt,
          o = String(i);
        (jt = o), se('history', { from: s, to: o });
      }
      return r.apply(this, n);
    };
  }
  X(G.history, 'pushState', e), X(G.history, 'replaceState', e);
}
var Ou = 1e3;
let $t, Ht;
function xu(t, e) {
  if (!t || t.type !== e.type) return !0;
  try {
    if (t.target !== e.target) return !0;
  } catch {}
  return !1;
}
function Tu(t) {
  if (t.type !== 'keypress') return !1;
  try {
    var e = t.target;
    if (!e || !e.tagName) return !0;
    if (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA' || e.isContentEditable) return !1;
  } catch {}
  return !0;
}
function Yn(t, e = !1) {
  return r => {
    if (!(!r || Ht === r) && !Tu(r)) {
      var n = r.type === 'keypress' ? 'input' : r.type;
      $t === void 0
        ? (t({ event: r, name: n, global: e }), (Ht = r))
        : xu(Ht, r) && (t({ event: r, name: n, global: e }), (Ht = r)),
        clearTimeout($t),
        ($t = G.setTimeout(() => {
          $t = void 0;
        }, Ou));
    }
  };
}
function ku() {
  if ('document' in G) {
    var t = se.bind(null, 'dom'),
      e = Yn(t, !0);
    G.document.addEventListener('click', e, !1),
      G.document.addEventListener('keypress', e, !1),
      ['EventTarget', 'Node'].forEach(r => {
        var n = G[r] && G[r].prototype;
        !n ||
          !n.hasOwnProperty ||
          !n.hasOwnProperty('addEventListener') ||
          (X(n, 'addEventListener', function (i) {
            return function (s, o, a) {
              if (s === 'click' || s == 'keypress')
                try {
                  var c = this,
                    f = (c.__sentry_instrumentation_handlers__ =
                      c.__sentry_instrumentation_handlers__ || {}),
                    g = (f[s] = f[s] || { refCount: 0 });
                  if (!g.handler) {
                    var _ = Yn(t);
                    (g.handler = _), i.call(this, s, _, a);
                  }
                  g.refCount += 1;
                } catch {}
              return i.call(this, s, o, a);
            };
          }),
          X(n, 'removeEventListener', function (i) {
            return function (s, o, a) {
              if (s === 'click' || s == 'keypress')
                try {
                  var c = this,
                    f = c.__sentry_instrumentation_handlers__ || {},
                    g = f[s];
                  g &&
                    ((g.refCount -= 1),
                    g.refCount <= 0 &&
                      (i.call(this, s, g.handler, a), (g.handler = void 0), delete f[s]),
                    Object.keys(f).length === 0 && delete c.__sentry_instrumentation_handlers__);
                } catch {}
              return i.call(this, s, o, a);
            };
          }));
      });
  }
}
let Er = null;
function Au() {
  (Er = G.onerror),
    (G.onerror = function (t, e, r, n, i) {
      return (
        se('error', { column: n, error: i, line: r, msg: t, url: e }),
        Er ? Er.apply(this, arguments) : !1
      );
    });
}
let Sr = null;
function Du() {
  (Sr = G.onunhandledrejection),
    (G.onunhandledrejection = function (t) {
      return se('unhandledrejection', t), Sr ? Sr.apply(this, arguments) : !0;
    });
}
function Ru() {
  var t = typeof WeakSet == 'function',
    e = t ? new WeakSet() : [];
  function r(i) {
    if (t) return e.has(i) ? !0 : (e.add(i), !1);
    for (let o = 0; o < e.length; o++) {
      var s = e[o];
      if (s === i) return !0;
    }
    return e.push(i), !1;
  }
  function n(i) {
    if (t) e.delete(i);
    else
      for (let s = 0; s < e.length; s++)
        if (e[s] === i) {
          e.splice(s, 1);
          break;
        }
  }
  return [r, n];
}
function Qe() {
  var t = W(),
    e = t.crypto || t.msCrypto;
  if (e && e.randomUUID) return e.randomUUID().replace(/-/g, '');
  var r =
    e && e.getRandomValues
      ? () => e.getRandomValues(new Uint8Array(1))[0]
      : () => Math.random() * 16;
  return ('10000000100040008000' + 1e11).replace(/[018]/g, n =>
    (n ^ ((r() & 15) >> (n / 4))).toString(16)
  );
}
function Xi(t) {
  return t.exception && t.exception.values ? t.exception.values[0] : void 0;
}
function He(t) {
  const { message: e, event_id: r } = t;
  if (e) return e;
  var n = Xi(t);
  return n
    ? n.type && n.value
      ? `${n.type}: ${n.value}`
      : n.type || n.value || r || '<unknown>'
    : r || '<unknown>';
}
function Lr(t, e, r) {
  var n = (t.exception = t.exception || {}),
    i = (n.values = n.values || []),
    s = (i[0] = i[0] || {});
  s.value || (s.value = e || ''), s.type || (s.type = 'Error');
}
function vt(t, e) {
  var r = Xi(t);
  if (r) {
    var n = { type: 'generic', handled: !0 },
      i = r.mechanism;
    if (((r.mechanism = { ...n, ...i, ...e }), e && 'data' in e)) {
      var s = { ...(i && i.data), ...e.data };
      r.mechanism.data = s;
    }
  }
}
function zn(t) {
  if (t && t.__sentry_captured__) return !0;
  try {
    nn(t, '__sentry_captured__', !0);
  } catch {}
  return !1;
}
function Iu(t) {
  return Array.isArray(t) ? t : [t];
}
function je(t, e = 1 / 0, r = 1 / 0) {
  try {
    return Br('', t, e, r);
  } catch (n) {
    return { ERROR: `**non-serializable** (${n})` };
  }
}
function Ki(t, e = 3, r = 100 * 1024) {
  var n = je(t, e);
  return Lu(n) > r ? Ki(t, e - 1, r) : n;
}
function Br(t, e, r = 1 / 0, n = 1 / 0, i = Ru()) {
  const [s, o] = i;
  if (e === null || (['number', 'boolean', 'string'].includes(typeof e) && !eu(e))) return e;
  var a = Nu(t, e);
  if (!a.startsWith('[object ')) return a;
  if (e.__sentry_skip_normalization__) return e;
  if (r === 0) return a.replace('object ', '');
  if (s(e)) return '[Circular ~]';
  var c = e;
  if (c && typeof c.toJSON == 'function')
    try {
      var f = c.toJSON();
      return Br('', f, r - 1, n, i);
    } catch {}
  var g = Array.isArray(e) ? [] : {};
  let _ = 0;
  var y = Vi(e);
  for (var E in y)
    if (Object.prototype.hasOwnProperty.call(y, E)) {
      if (_ >= n) {
        g[E] = '[MaxProperties ~]';
        break;
      }
      var O = y[E];
      (g[E] = Br(E, O, r - 1, n, i)), (_ += 1);
    }
  return o(e), g;
}
function Nu(t, e) {
  try {
    return t === 'domain' && e && typeof e == 'object' && e._events
      ? '[Domain]'
      : t === 'domainEmitter'
      ? '[DomainEmitter]'
      : typeof global < 'u' && e === global
      ? '[Global]'
      : typeof window < 'u' && e === window
      ? '[Window]'
      : typeof document < 'u' && e === document
      ? '[Document]'
      : Za(e)
      ? '[SyntheticEvent]'
      : typeof e == 'number' && e !== e
      ? '[NaN]'
      : e === void 0
      ? '[undefined]'
      : typeof e == 'function'
      ? `[Function: ${Ne(e)}]`
      : typeof e == 'symbol'
      ? `[${String(e)}]`
      : typeof e == 'bigint'
      ? `[BigInt: ${String(e)}]`
      : `[object ${Object.getPrototypeOf(e).constructor.name}]`;
  } catch (r) {
    return `**non-serializable** (${r})`;
  }
}
function Pu(t) {
  return ~-encodeURI(t).split(/%..|./).length;
}
function Lu(t) {
  return Pu(JSON.stringify(t));
}
var ge;
(function (t) {
  var e = 0;
  t[(t.PENDING = e)] = 'PENDING';
  var r = 1;
  t[(t.RESOLVED = r)] = 'RESOLVED';
  var n = 2;
  t[(t.REJECTED = n)] = 'REJECTED';
})(ge || (ge = {}));
function We(t) {
  return new K(e => {
    e(t);
  });
}
function Cr(t) {
  return new K((e, r) => {
    r(t);
  });
}
class K {
  __init() {
    this._state = ge.PENDING;
  }
  __init2() {
    this._handlers = [];
  }
  constructor(e) {
    K.prototype.__init.call(this),
      K.prototype.__init2.call(this),
      K.prototype.__init3.call(this),
      K.prototype.__init4.call(this),
      K.prototype.__init5.call(this),
      K.prototype.__init6.call(this);
    try {
      e(this._resolve, this._reject);
    } catch (r) {
      this._reject(r);
    }
  }
  then(e, r) {
    return new K((n, i) => {
      this._handlers.push([
        !1,
        s => {
          if (!e) n(s);
          else
            try {
              n(e(s));
            } catch (o) {
              i(o);
            }
        },
        s => {
          if (!r) i(s);
          else
            try {
              n(r(s));
            } catch (o) {
              i(o);
            }
        },
      ]),
        this._executeHandlers();
    });
  }
  catch(e) {
    return this.then(r => r, e);
  }
  finally(e) {
    return new K((r, n) => {
      let i, s;
      return this.then(
        o => {
          (s = !1), (i = o), e && e();
        },
        o => {
          (s = !0), (i = o), e && e();
        }
      ).then(() => {
        if (s) {
          n(i);
          return;
        }
        r(i);
      });
    });
  }
  __init3() {
    this._resolve = e => {
      this._setResult(ge.RESOLVED, e);
    };
  }
  __init4() {
    this._reject = e => {
      this._setResult(ge.REJECTED, e);
    };
  }
  __init5() {
    this._setResult = (e, r) => {
      if (this._state === ge.PENDING) {
        if (en(r)) {
          r.then(this._resolve, this._reject);
          return;
        }
        (this._state = e), (this._value = r), this._executeHandlers();
      }
    };
  }
  __init6() {
    this._executeHandlers = () => {
      if (this._state !== ge.PENDING) {
        var e = this._handlers.slice();
        (this._handlers = []),
          e.forEach(r => {
            r[0] ||
              (this._state === ge.RESOLVED && r[1](this._value),
              this._state === ge.REJECTED && r[2](this._value),
              (r[0] = !0));
          });
      }
    };
  }
}
function Bu(t) {
  var e = [];
  function r() {
    return t === void 0 || e.length < t;
  }
  function n(o) {
    return e.splice(e.indexOf(o), 1)[0];
  }
  function i(o) {
    if (!r()) return Cr(new J('Not adding Promise because buffer limit was reached.'));
    var a = o();
    return (
      e.indexOf(a) === -1 && e.push(a),
      a.then(() => n(a)).then(null, () => n(a).then(null, () => {})),
      a
    );
  }
  function s(o) {
    return new K((a, c) => {
      let f = e.length;
      if (!f) return a(!0);
      var g = setTimeout(() => {
        o && o > 0 && a(!1);
      }, o);
      e.forEach(_ => {
        We(_).then(() => {
          --f || (clearTimeout(g), a(!0));
        }, c);
      });
    });
  }
  return { $: e, add: i, drain: s };
}
function br(t) {
  if (!t) return {};
  var e = t.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!e) return {};
  var r = e[6] || '',
    n = e[8] || '';
  return { host: e[4], path: e[5], protocol: e[2], relative: e[5] + r + n };
}
var Cu = ['fatal', 'error', 'warning', 'log', 'info', 'debug'];
function Uu(t) {
  return t === 'warn' ? 'warning' : Cu.includes(t) ? t : 'log';
}
var Ur = { nowSeconds: () => Date.now() / 1e3 };
function Mu() {
  const { performance: t } = W();
  if (!(!t || !t.now)) {
    var e = Date.now() - t.now();
    return { now: () => t.now(), timeOrigin: e };
  }
}
function Fu() {
  try {
    var t = Va(module, 'perf_hooks');
    return t.performance;
  } catch {
    return;
  }
}
var wr = Kr() ? Fu() : Mu(),
  Vn = wr === void 0 ? Ur : { nowSeconds: () => (wr.timeOrigin + wr.now()) / 1e3 },
  tr = Ur.nowSeconds.bind(Ur),
  Qi = Vn.nowSeconds.bind(Vn);
(() => {
  const { performance: t } = W();
  if (!(!t || !t.now)) {
    var e = 3600 * 1e3,
      r = t.now(),
      n = Date.now(),
      i = t.timeOrigin ? Math.abs(t.timeOrigin + r - n) : e,
      s = i < e,
      o = t.timing && t.timing.navigationStart,
      a = typeof o == 'number',
      c = a ? Math.abs(o + r - n) : e,
      f = c < e;
    return s || f ? (i <= c ? t.timeOrigin : o) : n;
  }
})();
function rr(t, e = []) {
  return [t, e];
}
function Gu(t, e) {
  const [r, n] = t;
  return [r, [...n, e]];
}
function Jn(t, e) {
  var r = t[1];
  r.forEach(n => {
    var i = n[0].type;
    e(n, i);
  });
}
function Mr(t, e) {
  var r = e || new TextEncoder();
  return r.encode(t);
}
function Zi(t, e) {
  const [r, n] = t;
  let i = JSON.stringify(r);
  function s(a) {
    typeof i == 'string'
      ? (i = typeof a == 'string' ? i + a : [Mr(i, e), a])
      : i.push(typeof a == 'string' ? Mr(a, e) : a);
  }
  for (var o of n) {
    const [a, c] = o;
    s(`
${JSON.stringify(a)}
`),
      s(typeof c == 'string' || c instanceof Uint8Array ? c : JSON.stringify(c));
  }
  return typeof i == 'string' ? i : ju(i);
}
function ju(t) {
  var e = t.reduce((s, o) => s + o.length, 0),
    r = new Uint8Array(e);
  let n = 0;
  for (var i of t) r.set(i, n), (n += i.length);
  return r;
}
function $u(t, e) {
  var r = typeof t.data == 'string' ? Mr(t.data, e) : t.data;
  return [
    on({
      type: 'attachment',
      length: r.length,
      filename: t.filename,
      content_type: t.contentType,
      attachment_type: t.attachmentType,
    }),
    r,
  ];
}
var Hu = {
  session: 'session',
  sessions: 'session',
  attachment: 'attachment',
  transaction: 'transaction',
  event: 'error',
  client_report: 'internal',
  user_report: 'default',
};
function Xn(t) {
  return Hu[t];
}
function Wu(t, e, r) {
  var n = [{ type: 'client_report' }, { timestamp: tr(), discarded_events: t }];
  return rr(e ? { dsn: e } : {}, [n]);
}
var qu = 60 * 1e3;
function Yu(t, e = Date.now()) {
  var r = parseInt(`${t}`, 10);
  if (!isNaN(r)) return r * 1e3;
  var n = Date.parse(`${t}`);
  return isNaN(n) ? qu : n - e;
}
function zu(t, e) {
  return t[e] || t.all || 0;
}
function Vu(t, e, r = Date.now()) {
  return zu(t, e) > r;
}
function Ju(t, { statusCode: e, headers: r }, n = Date.now()) {
  var i = { ...t },
    s = r && r['x-sentry-rate-limits'],
    o = r && r['retry-after'];
  if (s)
    for (var a of s.trim().split(',')) {
      const [_, y] = a.split(':', 2);
      var c = parseInt(_, 10),
        f = (isNaN(c) ? 60 : c) * 1e3;
      if (!y) i.all = n + f;
      else for (var g of y.split(';')) i[g] = n + f;
    }
  else o ? (i.all = n + Yu(o, n)) : e === 429 && (i.all = n + 60 * 1e3);
  return i;
}
function Xu(t) {
  return t[0];
}
function Ku(t) {
  var e = Qi(),
    r = {
      sid: Qe(),
      init: !0,
      timestamp: e,
      started: e,
      duration: 0,
      status: 'ok',
      errors: 0,
      ignoreDuration: !1,
      toJSON: () => Zu(r),
    };
  return t && st(r, t), r;
}
function st(t, e = {}) {
  if (
    (e.user &&
      (!t.ipAddress && e.user.ip_address && (t.ipAddress = e.user.ip_address),
      !t.did && !e.did && (t.did = e.user.id || e.user.email || e.user.username)),
    (t.timestamp = e.timestamp || Qi()),
    e.ignoreDuration && (t.ignoreDuration = e.ignoreDuration),
    e.sid && (t.sid = e.sid.length === 32 ? e.sid : Qe()),
    e.init !== void 0 && (t.init = e.init),
    !t.did && e.did && (t.did = `${e.did}`),
    typeof e.started == 'number' && (t.started = e.started),
    t.ignoreDuration)
  )
    t.duration = void 0;
  else if (typeof e.duration == 'number') t.duration = e.duration;
  else {
    var r = t.timestamp - t.started;
    t.duration = r >= 0 ? r : 0;
  }
  e.release && (t.release = e.release),
    e.environment && (t.environment = e.environment),
    !t.ipAddress && e.ipAddress && (t.ipAddress = e.ipAddress),
    !t.userAgent && e.userAgent && (t.userAgent = e.userAgent),
    typeof e.errors == 'number' && (t.errors = e.errors),
    e.status && (t.status = e.status);
}
function Qu(t, e) {
  let r = {};
  t.status === 'ok' && (r = { status: 'exited' }), st(t, r);
}
function Zu(t) {
  return on({
    sid: `${t.sid}`,
    init: t.init,
    started: new Date(t.started * 1e3).toISOString(),
    timestamp: new Date(t.timestamp * 1e3).toISOString(),
    status: t.status,
    errors: t.errors,
    did: typeof t.did == 'number' || typeof t.did == 'string' ? `${t.did}` : void 0,
    duration: t.duration,
    attrs: {
      release: t.release,
      environment: t.environment,
      ip_address: t.ipAddress,
      user_agent: t.userAgent,
    },
  });
}
var Kn = 100;
class Re {
  constructor() {
    (this._notifyingListeners = !1),
      (this._scopeListeners = []),
      (this._eventProcessors = []),
      (this._breadcrumbs = []),
      (this._attachments = []),
      (this._user = {}),
      (this._tags = {}),
      (this._extra = {}),
      (this._contexts = {}),
      (this._sdkProcessingMetadata = {});
  }
  static clone(e) {
    var r = new Re();
    return (
      e &&
        ((r._breadcrumbs = [...e._breadcrumbs]),
        (r._tags = { ...e._tags }),
        (r._extra = { ...e._extra }),
        (r._contexts = { ...e._contexts }),
        (r._user = e._user),
        (r._level = e._level),
        (r._span = e._span),
        (r._session = e._session),
        (r._transactionName = e._transactionName),
        (r._fingerprint = e._fingerprint),
        (r._eventProcessors = [...e._eventProcessors]),
        (r._requestSession = e._requestSession),
        (r._attachments = [...e._attachments])),
      r
    );
  }
  addScopeListener(e) {
    this._scopeListeners.push(e);
  }
  addEventProcessor(e) {
    return this._eventProcessors.push(e), this;
  }
  setUser(e) {
    return (
      (this._user = e || {}),
      this._session && st(this._session, { user: e }),
      this._notifyScopeListeners(),
      this
    );
  }
  getUser() {
    return this._user;
  }
  getRequestSession() {
    return this._requestSession;
  }
  setRequestSession(e) {
    return (this._requestSession = e), this;
  }
  setTags(e) {
    return (this._tags = { ...this._tags, ...e }), this._notifyScopeListeners(), this;
  }
  setTag(e, r) {
    return (this._tags = { ...this._tags, [e]: r }), this._notifyScopeListeners(), this;
  }
  setExtras(e) {
    return (this._extra = { ...this._extra, ...e }), this._notifyScopeListeners(), this;
  }
  setExtra(e, r) {
    return (this._extra = { ...this._extra, [e]: r }), this._notifyScopeListeners(), this;
  }
  setFingerprint(e) {
    return (this._fingerprint = e), this._notifyScopeListeners(), this;
  }
  setLevel(e) {
    return (this._level = e), this._notifyScopeListeners(), this;
  }
  setTransactionName(e) {
    return (this._transactionName = e), this._notifyScopeListeners(), this;
  }
  setContext(e, r) {
    return (
      r === null ? delete this._contexts[e] : (this._contexts = { ...this._contexts, [e]: r }),
      this._notifyScopeListeners(),
      this
    );
  }
  setSpan(e) {
    return (this._span = e), this._notifyScopeListeners(), this;
  }
  getSpan() {
    return this._span;
  }
  getTransaction() {
    var e = this.getSpan();
    return e && e.transaction;
  }
  setSession(e) {
    return e ? (this._session = e) : delete this._session, this._notifyScopeListeners(), this;
  }
  getSession() {
    return this._session;
  }
  update(e) {
    if (!e) return this;
    if (typeof e == 'function') {
      var r = e(this);
      return r instanceof Re ? r : this;
    }
    return (
      e instanceof Re
        ? ((this._tags = { ...this._tags, ...e._tags }),
          (this._extra = { ...this._extra, ...e._extra }),
          (this._contexts = { ...this._contexts, ...e._contexts }),
          e._user && Object.keys(e._user).length && (this._user = e._user),
          e._level && (this._level = e._level),
          e._fingerprint && (this._fingerprint = e._fingerprint),
          e._requestSession && (this._requestSession = e._requestSession))
        : it(e) &&
          ((e = e),
          (this._tags = { ...this._tags, ...e.tags }),
          (this._extra = { ...this._extra, ...e.extra }),
          (this._contexts = { ...this._contexts, ...e.contexts }),
          e.user && (this._user = e.user),
          e.level && (this._level = e.level),
          e.fingerprint && (this._fingerprint = e.fingerprint),
          e.requestSession && (this._requestSession = e.requestSession)),
      this
    );
  }
  clear() {
    return (
      (this._breadcrumbs = []),
      (this._tags = {}),
      (this._extra = {}),
      (this._user = {}),
      (this._contexts = {}),
      (this._level = void 0),
      (this._transactionName = void 0),
      (this._fingerprint = void 0),
      (this._requestSession = void 0),
      (this._span = void 0),
      (this._session = void 0),
      this._notifyScopeListeners(),
      (this._attachments = []),
      this
    );
  }
  addBreadcrumb(e, r) {
    var n = typeof r == 'number' ? Math.min(r, Kn) : Kn;
    if (n <= 0) return this;
    var i = { timestamp: tr(), ...e };
    return (
      (this._breadcrumbs = [...this._breadcrumbs, i].slice(-n)), this._notifyScopeListeners(), this
    );
  }
  clearBreadcrumbs() {
    return (this._breadcrumbs = []), this._notifyScopeListeners(), this;
  }
  addAttachment(e) {
    return this._attachments.push(e), this;
  }
  getAttachments() {
    return this._attachments;
  }
  clearAttachments() {
    return (this._attachments = []), this;
  }
  applyToEvent(e, r = {}) {
    if (
      (this._extra && Object.keys(this._extra).length && (e.extra = { ...this._extra, ...e.extra }),
      this._tags && Object.keys(this._tags).length && (e.tags = { ...this._tags, ...e.tags }),
      this._user && Object.keys(this._user).length && (e.user = { ...this._user, ...e.user }),
      this._contexts &&
        Object.keys(this._contexts).length &&
        (e.contexts = { ...this._contexts, ...e.contexts }),
      this._level && (e.level = this._level),
      this._transactionName && (e.transaction = this._transactionName),
      this._span)
    ) {
      e.contexts = { trace: this._span.getTraceContext(), ...e.contexts };
      var n = this._span.transaction && this._span.transaction.name;
      n && (e.tags = { transaction: n, ...e.tags });
    }
    return (
      this._applyFingerprint(e),
      (e.breadcrumbs = [...(e.breadcrumbs || []), ...this._breadcrumbs]),
      (e.breadcrumbs = e.breadcrumbs.length > 0 ? e.breadcrumbs : void 0),
      (e.sdkProcessingMetadata = { ...e.sdkProcessingMetadata, ...this._sdkProcessingMetadata }),
      this._notifyEventProcessors([...es(), ...this._eventProcessors], e, r)
    );
  }
  setSDKProcessingMetadata(e) {
    return (this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...e }), this;
  }
  _notifyEventProcessors(e, r, n, i = 0) {
    return new K((s, o) => {
      var a = e[i];
      if (r === null || typeof a != 'function') s(r);
      else {
        var c = a({ ...r }, n);
        (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
          a.id &&
          c === null &&
          I.log(`Event processor "${a.id}" dropped event`),
          en(c)
            ? c.then(f => this._notifyEventProcessors(e, f, n, i + 1).then(s)).then(null, o)
            : this._notifyEventProcessors(e, c, n, i + 1)
                .then(s)
                .then(null, o);
      }
    });
  }
  _notifyScopeListeners() {
    this._notifyingListeners ||
      ((this._notifyingListeners = !0),
      this._scopeListeners.forEach(e => {
        e(this);
      }),
      (this._notifyingListeners = !1));
  }
  _applyFingerprint(e) {
    (e.fingerprint = e.fingerprint ? Iu(e.fingerprint) : []),
      this._fingerprint && (e.fingerprint = e.fingerprint.concat(this._fingerprint)),
      e.fingerprint && !e.fingerprint.length && delete e.fingerprint;
  }
}
function es() {
  return Qr('globalEventProcessors', () => []);
}
function un(t) {
  es().push(t);
}
var ln = 4,
  el = 100;
class xt {
  __init() {
    this._stack = [{}];
  }
  constructor(e, r = new Re(), n = ln) {
    (this._version = n),
      xt.prototype.__init.call(this),
      (this.getStackTop().scope = r),
      e && this.bindClient(e);
  }
  isOlderThan(e) {
    return this._version < e;
  }
  bindClient(e) {
    var r = this.getStackTop();
    (r.client = e), e && e.setupIntegrations && e.setupIntegrations();
  }
  pushScope() {
    var e = Re.clone(this.getScope());
    return this.getStack().push({ client: this.getClient(), scope: e }), e;
  }
  popScope() {
    return this.getStack().length <= 1 ? !1 : !!this.getStack().pop();
  }
  withScope(e) {
    var r = this.pushScope();
    try {
      e(r);
    } finally {
      this.popScope();
    }
  }
  getClient() {
    return this.getStackTop().client;
  }
  getScope() {
    return this.getStackTop().scope;
  }
  getStack() {
    return this._stack;
  }
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  captureException(e, r) {
    var n = (this._lastEventId = r && r.event_id ? r.event_id : Qe()),
      i = new Error('Sentry syntheticException');
    return (
      this._withClient((s, o) => {
        s.captureException(
          e,
          { originalException: e, syntheticException: i, ...r, event_id: n },
          o
        );
      }),
      n
    );
  }
  captureMessage(e, r, n) {
    var i = (this._lastEventId = n && n.event_id ? n.event_id : Qe()),
      s = new Error(e);
    return (
      this._withClient((o, a) => {
        o.captureMessage(
          e,
          r,
          { originalException: e, syntheticException: s, ...n, event_id: i },
          a
        );
      }),
      i
    );
  }
  captureEvent(e, r) {
    var n = r && r.event_id ? r.event_id : Qe();
    return (
      e.type !== 'transaction' && (this._lastEventId = n),
      this._withClient((i, s) => {
        i.captureEvent(e, { ...r, event_id: n }, s);
      }),
      n
    );
  }
  lastEventId() {
    return this._lastEventId;
  }
  addBreadcrumb(e, r) {
    const { scope: n, client: i } = this.getStackTop();
    if (!n || !i) return;
    const { beforeBreadcrumb: s = null, maxBreadcrumbs: o = el } =
      (i.getOptions && i.getOptions()) || {};
    if (!(o <= 0)) {
      var a = tr(),
        c = { timestamp: a, ...e },
        f = s ? Yi(() => s(c, r)) : c;
      f !== null && n.addBreadcrumb(f, o);
    }
  }
  setUser(e) {
    var r = this.getScope();
    r && r.setUser(e);
  }
  setTags(e) {
    var r = this.getScope();
    r && r.setTags(e);
  }
  setExtras(e) {
    var r = this.getScope();
    r && r.setExtras(e);
  }
  setTag(e, r) {
    var n = this.getScope();
    n && n.setTag(e, r);
  }
  setExtra(e, r) {
    var n = this.getScope();
    n && n.setExtra(e, r);
  }
  setContext(e, r) {
    var n = this.getScope();
    n && n.setContext(e, r);
  }
  configureScope(e) {
    const { scope: r, client: n } = this.getStackTop();
    r && n && e(r);
  }
  run(e) {
    var r = Qn(this);
    try {
      e(this);
    } finally {
      Qn(r);
    }
  }
  getIntegration(e) {
    var r = this.getClient();
    if (!r) return null;
    try {
      return r.getIntegration(e);
    } catch {
      return (
        (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
          I.warn(`Cannot retrieve integration ${e.id} from the current Hub`),
        null
      );
    }
  }
  startTransaction(e, r) {
    return this._callExtensionMethod('startTransaction', e, r);
  }
  traceHeaders() {
    return this._callExtensionMethod('traceHeaders');
  }
  captureSession(e = !1) {
    if (e) return this.endSession();
    this._sendSessionUpdate();
  }
  endSession() {
    var e = this.getStackTop(),
      r = e && e.scope,
      n = r && r.getSession();
    n && Qu(n), this._sendSessionUpdate(), r && r.setSession();
  }
  startSession(e) {
    const { scope: r, client: n } = this.getStackTop(),
      { release: i, environment: s } = (n && n.getOptions()) || {};
    var o = W();
    const { userAgent: a } = o.navigator || {};
    var c = Ku({
      release: i,
      environment: s,
      ...(r && { user: r.getUser() }),
      ...(a && { userAgent: a }),
      ...e,
    });
    if (r) {
      var f = r.getSession && r.getSession();
      f && f.status === 'ok' && st(f, { status: 'exited' }), this.endSession(), r.setSession(c);
    }
    return c;
  }
  shouldSendDefaultPii() {
    var e = this.getClient(),
      r = e && e.getOptions();
    return !!(r && r.sendDefaultPii);
  }
  _sendSessionUpdate() {
    const { scope: e, client: r } = this.getStackTop();
    if (e) {
      var n = e.getSession();
      n && r && r.captureSession && r.captureSession(n);
    }
  }
  _withClient(e) {
    const { scope: r, client: n } = this.getStackTop();
    n && e(n, r);
  }
  _callExtensionMethod(e, ...r) {
    var n = nr(),
      i = n.__SENTRY__;
    if (i && i.extensions && typeof i.extensions[e] == 'function')
      return i.extensions[e].apply(this, r);
    (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
      I.warn(`Extension method ${e} couldn't be found, doing nothing.`);
  }
}
function nr() {
  var t = W();
  return (t.__SENTRY__ = t.__SENTRY__ || { extensions: {}, hub: void 0 }), t;
}
function Qn(t) {
  var e = nr(),
    r = ke(e);
  return cn(e, t), r;
}
function Y() {
  var t = nr();
  return (!ts(t) || ke(t).isOlderThan(ln)) && cn(t, new xt()), Kr() ? tl(t) : ke(t);
}
function tl(t) {
  try {
    var e = nr().__SENTRY__,
      r = e && e.extensions && e.extensions.domain && e.extensions.domain.active;
    if (!r) return ke(t);
    if (!ts(r) || ke(r).isOlderThan(ln)) {
      var n = ke(t).getStackTop();
      cn(r, new xt(n.client, Re.clone(n.scope)));
    }
    return ke(r);
  } catch {
    return ke(t);
  }
}
function ts(t) {
  return !!(t && t.__SENTRY__ && t.__SENTRY__.hub);
}
function ke(t) {
  return Qr('hub', () => new xt(), t);
}
function cn(t, e) {
  if (!t) return !1;
  var r = (t.__SENTRY__ = t.__SENTRY__ || {});
  return (r.hub = e), !0;
}
function ir(t, e) {
  return Y().captureException(t, { captureContext: e });
}
function sr(t) {
  Y().configureScope(t);
}
function rs(t) {
  Y().addBreadcrumb(t);
}
function fn(t) {
  Y().withScope(t);
}
var rl = '7';
function nl(t) {
  var e = t.protocol ? `${t.protocol}:` : '',
    r = t.port ? `:${t.port}` : '';
  return `${e}//${t.host}${r}${t.path ? `/${t.path}` : ''}/api/`;
}
function il(t) {
  return `${nl(t)}${t.projectId}/envelope/`;
}
function sl(t, e) {
  return cu({
    sentry_key: t.publicKey,
    sentry_version: rl,
    ...(e && { sentry_client: `${e.name}/${e.version}` }),
  });
}
function ns(t, e = {}) {
  var r = typeof e == 'string' ? e : e.tunnel,
    n = typeof e == 'string' || !e._metadata ? void 0 : e._metadata.sdk;
  return r || `${il(t)}?${sl(t, n)}`;
}
function is(t) {
  if (!t || !t.sdk) return;
  const { name: e, version: r } = t.sdk;
  return { name: e, version: r };
}
function ol(t, e) {
  return (
    e &&
      ((t.sdk = t.sdk || {}),
      (t.sdk.name = t.sdk.name || e.name),
      (t.sdk.version = t.sdk.version || e.version),
      (t.sdk.integrations = [...(t.sdk.integrations || []), ...(e.integrations || [])]),
      (t.sdk.packages = [...(t.sdk.packages || []), ...(e.packages || [])])),
    t
  );
}
function al(t, e, r, n) {
  var i = is(r),
    s = { sent_at: new Date().toISOString(), ...(i && { sdk: i }), ...(!!n && { dsn: tn(e) }) },
    o = 'aggregates' in t ? [{ type: 'sessions' }, t] : [{ type: 'session' }, t];
  return rr(s, [o]);
}
function ul(t, e, r, n) {
  var i = is(r),
    s = t.type || 'event';
  const { transactionSampling: o } = t.sdkProcessingMetadata || {},
    { method: a, rate: c } = o || {};
  ol(t, r && r.sdk);
  var f = ll(t, i, n, e);
  delete t.sdkProcessingMetadata;
  var g = [{ type: s, sample_rates: [{ id: a, rate: c }] }, t];
  return rr(f, [g]);
}
function ll(t, e, r, n) {
  var i = t.sdkProcessingMetadata && t.sdkProcessingMetadata.baggage,
    s = i && Xu(i);
  return {
    event_id: t.event_id,
    sent_at: new Date().toISOString(),
    ...(e && { sdk: e }),
    ...(!!r && { dsn: tn(n) }),
    ...(t.type === 'transaction' && s && { trace: on({ ...s }) }),
  };
}
var Zn = [];
function ei(t) {
  return t.reduce((e, r) => (e.every(n => r.name !== n.name) && e.push(r), e), []);
}
function cl(t) {
  var e = (t.defaultIntegrations && [...t.defaultIntegrations]) || [],
    r = t.integrations;
  let n = [...ei(e)];
  Array.isArray(r)
    ? (n = [...n.filter(o => r.every(a => a.name !== o.name)), ...ei(r)])
    : typeof r == 'function' && ((n = r(n)), (n = Array.isArray(n) ? n : [n]));
  var i = n.map(o => o.name),
    s = 'Debug';
  return i.indexOf(s) !== -1 && n.push(...n.splice(i.indexOf(s), 1)), n;
}
function fl(t) {
  var e = {};
  return (
    t.forEach(r => {
      (e[r.name] = r),
        Zn.indexOf(r.name) === -1 &&
          (r.setupOnce(un, Y),
          Zn.push(r.name),
          (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
            I.log(`Integration installed: ${r.name}`));
    }),
    e
  );
}
var ti = "Not capturing exception because it's already been captured.";
class Ke {
  __init() {
    this._integrations = {};
  }
  __init2() {
    this._integrationsInitialized = !1;
  }
  __init3() {
    this._numProcessing = 0;
  }
  __init4() {
    this._outcomes = {};
  }
  constructor(e) {
    if (
      (Ke.prototype.__init.call(this),
      Ke.prototype.__init2.call(this),
      Ke.prototype.__init3.call(this),
      Ke.prototype.__init4.call(this),
      (this._options = e),
      e.dsn)
    ) {
      this._dsn = au(e.dsn);
      var r = ns(this._dsn, e);
      this._transport = e.transport({
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...e.transportOptions,
        url: r,
      });
    } else
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn('No DSN provided, client will not do anything.');
  }
  captureException(e, r, n) {
    if (zn(e)) {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.log(ti);
      return;
    }
    let i = r && r.event_id;
    return (
      this._process(
        this.eventFromException(e, r)
          .then(s => this._captureEvent(s, r, n))
          .then(s => {
            i = s;
          })
      ),
      i
    );
  }
  captureMessage(e, r, n, i) {
    let s = n && n.event_id;
    var o = Wi(e) ? this.eventFromMessage(String(e), r, n) : this.eventFromException(e, n);
    return (
      this._process(
        o
          .then(a => this._captureEvent(a, n, i))
          .then(a => {
            s = a;
          })
      ),
      s
    );
  }
  captureEvent(e, r, n) {
    if (r && r.originalException && zn(r.originalException)) {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.log(ti);
      return;
    }
    let i = r && r.event_id;
    return (
      this._process(
        this._captureEvent(e, r, n).then(s => {
          i = s;
        })
      ),
      i
    );
  }
  captureSession(e) {
    if (!this._isEnabled()) {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn('SDK not enabled, will not capture session.');
      return;
    }
    typeof e.release != 'string'
      ? (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn('Discarded session because of missing or non-string release')
      : (this.sendSession(e), st(e, { init: !1 }));
  }
  getDsn() {
    return this._dsn;
  }
  getOptions() {
    return this._options;
  }
  getTransport() {
    return this._transport;
  }
  flush(e) {
    var r = this._transport;
    return r ? this._isClientDoneProcessing(e).then(n => r.flush(e).then(i => n && i)) : We(!0);
  }
  close(e) {
    return this.flush(e).then(r => ((this.getOptions().enabled = !1), r));
  }
  setupIntegrations() {
    this._isEnabled() &&
      !this._integrationsInitialized &&
      ((this._integrations = fl(this._options.integrations)), (this._integrationsInitialized = !0));
  }
  getIntegrationById(e) {
    return this._integrations[e];
  }
  getIntegration(e) {
    try {
      return this._integrations[e.id] || null;
    } catch {
      return (
        (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
          I.warn(`Cannot retrieve integration ${e.id} from the current Client`),
        null
      );
    }
  }
  sendEvent(e, r = {}) {
    if (this._dsn) {
      let i = ul(e, this._dsn, this._options._metadata, this._options.tunnel);
      for (var n of r.attachments || [])
        i = Gu(
          i,
          $u(n, this._options.transportOptions && this._options.transportOptions.textEncoder)
        );
      this._sendEnvelope(i);
    }
  }
  sendSession(e) {
    if (this._dsn) {
      var r = al(e, this._dsn, this._options._metadata, this._options.tunnel);
      this._sendEnvelope(r);
    }
  }
  recordDroppedEvent(e, r) {
    if (this._options.sendClientReports) {
      var n = `${e}:${r}`;
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.log(`Adding outcome: "${n}"`),
        (this._outcomes[n] = this._outcomes[n] + 1 || 1);
    }
  }
  _updateSessionFromEvent(e, r) {
    let n = !1,
      i = !1;
    var s = r.exception && r.exception.values;
    if (s) {
      i = !0;
      for (var o of s) {
        var a = o.mechanism;
        if (a && a.handled === !1) {
          n = !0;
          break;
        }
      }
    }
    var c = e.status === 'ok',
      f = (c && e.errors === 0) || (c && n);
    f &&
      (st(e, { ...(n && { status: 'crashed' }), errors: e.errors || Number(i || n) }),
      this.captureSession(e));
  }
  _isClientDoneProcessing(e) {
    return new K(r => {
      let n = 0;
      var i = 1,
        s = setInterval(() => {
          this._numProcessing == 0
            ? (clearInterval(s), r(!0))
            : ((n += i), e && n >= e && (clearInterval(s), r(!1)));
        }, i);
    });
  }
  _isEnabled() {
    return this.getOptions().enabled !== !1 && this._dsn !== void 0;
  }
  _prepareEvent(e, r, n) {
    const { normalizeDepth: i = 3, normalizeMaxBreadth: s = 1e3 } = this.getOptions();
    var o = { ...e, event_id: e.event_id || r.event_id || Qe(), timestamp: e.timestamp || tr() };
    this._applyClientOptions(o), this._applyIntegrationsMetadata(o);
    let a = n;
    r.captureContext && (a = Re.clone(a).update(r.captureContext));
    let c = We(o);
    if (a) {
      var f = [...(r.attachments || []), ...a.getAttachments()];
      f.length && (r.attachments = f), (c = a.applyToEvent(o, r));
    }
    return c.then(g => (typeof i == 'number' && i > 0 ? this._normalizeEvent(g, i, s) : g));
  }
  _normalizeEvent(e, r, n) {
    if (!e) return null;
    var i = {
      ...e,
      ...(e.breadcrumbs && {
        breadcrumbs: e.breadcrumbs.map(s => ({ ...s, ...(s.data && { data: je(s.data, r, n) }) })),
      }),
      ...(e.user && { user: je(e.user, r, n) }),
      ...(e.contexts && { contexts: je(e.contexts, r, n) }),
      ...(e.extra && { extra: je(e.extra, r, n) }),
    };
    return (
      e.contexts &&
        e.contexts.trace &&
        i.contexts &&
        ((i.contexts.trace = e.contexts.trace),
        e.contexts.trace.data && (i.contexts.trace.data = je(e.contexts.trace.data, r, n))),
      e.spans && (i.spans = e.spans.map(s => (s.data && (s.data = je(s.data, r, n)), s))),
      i
    );
  }
  _applyClientOptions(e) {
    var r = this.getOptions();
    const { environment: n, release: i, dist: s, maxValueLength: o = 250 } = r;
    'environment' in e || (e.environment = 'environment' in r ? n : 'production'),
      e.release === void 0 && i !== void 0 && (e.release = i),
      e.dist === void 0 && s !== void 0 && (e.dist = s),
      e.message && (e.message = pt(e.message, o));
    var a = e.exception && e.exception.values && e.exception.values[0];
    a && a.value && (a.value = pt(a.value, o));
    var c = e.request;
    c && c.url && (c.url = pt(c.url, o));
  }
  _applyIntegrationsMetadata(e) {
    var r = Object.keys(this._integrations);
    r.length > 0 &&
      ((e.sdk = e.sdk || {}), (e.sdk.integrations = [...(e.sdk.integrations || []), ...r]));
  }
  _captureEvent(e, r = {}, n) {
    return this._processEvent(e, r, n).then(
      i => i.event_id,
      i => {
        if (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) {
          var s = i;
          s.logLevel === 'log' ? I.log(s.message) : I.warn(s);
        }
      }
    );
  }
  _processEvent(e, r, n) {
    const { beforeSend: i, sampleRate: s } = this.getOptions();
    if (!this._isEnabled()) return Cr(new J('SDK not enabled, will not capture event.', 'log'));
    var o = e.type === 'transaction';
    return !o && typeof s == 'number' && Math.random() > s
      ? (this.recordDroppedEvent('sample_rate', 'error'),
        Cr(
          new J(
            `Discarding event because it's not included in the random sample (sampling rate = ${s})`,
            'log'
          )
        ))
      : this._prepareEvent(e, r, n)
          .then(a => {
            if (a === null)
              throw (
                (this.recordDroppedEvent('event_processor', e.type || 'error'),
                new J('An event processor returned null, will not send event.', 'log'))
              );
            var c = r.data && r.data.__sentry__ === !0;
            if (c || o || !i) return a;
            var f = i(a, r);
            return dl(f);
          })
          .then(a => {
            if (a === null)
              throw (
                (this.recordDroppedEvent('before_send', e.type || 'error'),
                new J('`beforeSend` returned `null`, will not send event.', 'log'))
              );
            var c = n && n.getSession();
            return !o && c && this._updateSessionFromEvent(c, a), this.sendEvent(a, r), a;
          })
          .then(null, a => {
            throw a instanceof J
              ? a
              : (this.captureException(a, { data: { __sentry__: !0 }, originalException: a }),
                new J(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${a}`));
          });
  }
  _process(e) {
    (this._numProcessing += 1),
      e.then(
        r => ((this._numProcessing -= 1), r),
        r => ((this._numProcessing -= 1), r)
      );
  }
  _sendEnvelope(e) {
    this._transport && this._dsn
      ? this._transport.send(e).then(null, r => {
          (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
            I.error('Error while sending event:', r);
        })
      : (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.error('Transport disabled');
  }
  _clearOutcomes() {
    var e = this._outcomes;
    return (
      (this._outcomes = {}),
      Object.keys(e).map(r => {
        const [n, i] = r.split(':');
        return { reason: n, category: i, quantity: e[r] };
      })
    );
  }
}
function dl(t) {
  var e = '`beforeSend` method has to return `null` or a valid event.';
  if (en(t))
    return t.then(
      r => {
        if (!(it(r) || r === null)) throw new J(e);
        return r;
      },
      r => {
        throw new J(`beforeSend rejected with ${r}`);
      }
    );
  if (!(it(t) || t === null)) throw new J(e);
  return t;
}
function hl(t, e) {
  e.debug === !0 &&
    (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__
      ? I.enable()
      : console.warn(
          '[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.'
        ));
  var r = Y(),
    n = r.getScope();
  n && n.update(e.initialScope);
  var i = new t(e);
  r.bindClient(i);
}
var pl = 30;
function ss(t, e, r = Bu(t.bufferSize || pl)) {
  let n = {};
  var i = o => r.drain(o);
  function s(o) {
    var a = [];
    if (
      (Jn(o, (_, y) => {
        var E = Xn(y);
        Vu(n, E) ? t.recordDroppedEvent('ratelimit_backoff', E) : a.push(_);
      }),
      a.length === 0)
    )
      return We();
    var c = rr(o[0], a),
      f = _ => {
        Jn(c, (y, E) => {
          t.recordDroppedEvent(_, Xn(E));
        });
      },
      g = () =>
        e({ body: Zi(c, t.textEncoder) }).then(
          _ => {
            _.statusCode !== void 0 &&
              (_.statusCode < 200 || _.statusCode >= 300) &&
              (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
              I.warn(`Sentry responded with status code ${_.statusCode} to sent event.`),
              (n = Ju(n, _));
          },
          _ => {
            (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
              I.error('Failed while sending event:', _),
              f('network_error');
          }
        );
    return r.add(g).then(
      _ => _,
      _ => {
        if (_ instanceof J)
          return (
            (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
              I.error('Skipped sending event because buffer is full.'),
            f('queue_overflow'),
            We()
          );
        throw _;
      }
    );
  }
  return { send: s, flush: i };
}
var ri = '7.12.1';
let ni;
class yt {
  constructor() {
    yt.prototype.__init.call(this);
  }
  static __initStatic() {
    this.id = 'FunctionToString';
  }
  __init() {
    this.name = yt.id;
  }
  setupOnce() {
    (ni = Function.prototype.toString),
      (Function.prototype.toString = function (...e) {
        var r = sn(this) || this;
        return ni.apply(r, e);
      });
  }
}
yt.__initStatic();
var gl = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
class Ze {
  static __initStatic() {
    this.id = 'InboundFilters';
  }
  __init() {
    this.name = Ze.id;
  }
  constructor(e = {}) {
    (this._options = e), Ze.prototype.__init.call(this);
  }
  setupOnce(e, r) {
    var n = i => {
      var s = r();
      if (s) {
        var o = s.getIntegration(Ze);
        if (o) {
          var a = s.getClient(),
            c = a ? a.getOptions() : {},
            f = ml(o._options, c);
          return _l(i, f) ? null : i;
        }
      }
      return i;
    };
    (n.id = this.name), e(n);
  }
}
Ze.__initStatic();
function ml(t = {}, e = {}) {
  return {
    allowUrls: [...(t.allowUrls || []), ...(e.allowUrls || [])],
    denyUrls: [...(t.denyUrls || []), ...(e.denyUrls || [])],
    ignoreErrors: [...(t.ignoreErrors || []), ...(e.ignoreErrors || []), ...gl],
    ignoreInternal: t.ignoreInternal !== void 0 ? t.ignoreInternal : !0,
  };
}
function _l(t, e) {
  return e.ignoreInternal && bl(t)
    ? ((typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn(`Event dropped due to being internal Sentry Error.
Event: ${He(t)}`),
      !0)
    : vl(t, e.ignoreErrors)
    ? ((typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${He(t)}`),
      !0)
    : yl(t, e.denyUrls)
    ? ((typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${He(t)}.
Url: ${Jt(t)}`),
      !0)
    : El(t, e.allowUrls)
    ? !1
    : ((typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${He(t)}.
Url: ${Jt(t)}`),
      !0);
}
function vl(t, e) {
  return !e || !e.length ? !1 : Sl(t).some(r => e.some(n => rn(r, n)));
}
function yl(t, e) {
  if (!e || !e.length) return !1;
  var r = Jt(t);
  return r ? e.some(n => rn(r, n)) : !1;
}
function El(t, e) {
  if (!e || !e.length) return !0;
  var r = Jt(t);
  return r ? e.some(n => rn(r, n)) : !0;
}
function Sl(t) {
  if (t.message) return [t.message];
  if (t.exception)
    try {
      const { type: e = '', value: r = '' } = (t.exception.values && t.exception.values[0]) || {};
      return [`${r}`, `${e}: ${r}`];
    } catch {
      return (
        (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
          I.error(`Cannot extract message for event ${He(t)}`),
        []
      );
    }
  return [];
}
function bl(t) {
  try {
    return t.exception.values[0].type === 'SentryError';
  } catch {}
  return !1;
}
function wl(t = []) {
  for (let r = t.length - 1; r >= 0; r--) {
    var e = t[r];
    if (e && e.filename !== '<anonymous>' && e.filename !== '[native code]')
      return e.filename || null;
  }
  return null;
}
function Jt(t) {
  try {
    let e;
    try {
      e = t.exception.values[0].stacktrace.frames;
    } catch {}
    return e ? wl(e) : null;
  } catch {
    return (
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.error(`Cannot extract url for event ${He(t)}`),
      null
    );
  }
}
function os(t, e) {
  var r = dn(t, e),
    n = { type: e && e.name, value: kl(e) };
  return (
    r.length && (n.stacktrace = { frames: r }),
    n.type === void 0 && n.value === '' && (n.value = 'Unrecoverable error caught'),
    n
  );
}
function Ol(t, e, r, n) {
  var i = {
    exception: {
      values: [
        {
          type: Zr(e) ? e.constructor.name : n ? 'UnhandledRejection' : 'Error',
          value: `Non-Error ${n ? 'promise rejection' : 'exception'} captured with keys: ${fu(e)}`,
        },
      ],
    },
    extra: { __serialized__: Ki(e) },
  };
  if (r) {
    var s = dn(t, r);
    s.length && (i.exception.values[0].stacktrace = { frames: s });
  }
  return i;
}
function Or(t, e) {
  return { exception: { values: [os(t, e)] } };
}
function dn(t, e) {
  var r = e.stacktrace || e.stack || '',
    n = Tl(e);
  try {
    return t(r, n);
  } catch {}
  return [];
}
var xl = /Minified React error #\d+;/i;
function Tl(t) {
  if (t) {
    if (typeof t.framesToPop == 'number') return t.framesToPop;
    if (xl.test(t.message)) return 1;
  }
  return 0;
}
function kl(t) {
  var e = t && t.message;
  return e
    ? e.error && typeof e.error.message == 'string'
      ? e.error.message
      : e
    : 'No error message';
}
function Al(t, e, r, n) {
  var i = (r && r.syntheticException) || void 0,
    s = hn(t, e, i, n);
  return vt(s), (s.level = 'error'), r && r.event_id && (s.event_id = r.event_id), We(s);
}
function Dl(t, e, r = 'info', n, i) {
  var s = (n && n.syntheticException) || void 0,
    o = Fr(t, e, s, i);
  return (o.level = r), n && n.event_id && (o.event_id = n.event_id), We(o);
}
function hn(t, e, r, n, i) {
  let s;
  if (Hi(e) && e.error) {
    var o = e;
    return Or(t, o.error);
  }
  if (Gn(e) || Xa(e)) {
    var a = e;
    if ('stack' in e) s = Or(t, e);
    else {
      var c = a.name || (Gn(a) ? 'DOMError' : 'DOMException'),
        f = a.message ? `${c}: ${a.message}` : c;
      (s = Fr(t, f, r, n)), Lr(s, f);
    }
    return 'code' in a && (s.tags = { ...s.tags, 'DOMException.code': `${a.code}` }), s;
  }
  if ($i(e)) return Or(t, e);
  if (it(e) || Zr(e)) {
    var g = e;
    return (s = Ol(t, g, r, i)), vt(s, { synthetic: !0 }), s;
  }
  return (s = Fr(t, e, r, n)), Lr(s, `${e}`), vt(s, { synthetic: !0 }), s;
}
function Fr(t, e, r, n) {
  var i = { message: e };
  if (n && r) {
    var s = dn(t, r);
    s.length && (i.exception = { values: [{ value: e, stacktrace: { frames: s } }] });
  }
  return i;
}
var as = 'Breadcrumbs';
class Et {
  static __initStatic() {
    this.id = as;
  }
  __init() {
    this.name = Et.id;
  }
  constructor(e) {
    Et.prototype.__init.call(this),
      (this.options = { console: !0, dom: !0, fetch: !0, history: !0, sentry: !0, xhr: !0, ...e });
  }
  setupOnce() {
    this.options.console && Te('console', Il),
      this.options.dom && Te('dom', Rl(this.options.dom)),
      this.options.xhr && Te('xhr', Nl),
      this.options.fetch && Te('fetch', Pl),
      this.options.history && Te('history', Ll);
  }
}
Et.__initStatic();
function Rl(t) {
  function e(r) {
    let n,
      i = typeof t == 'object' ? t.serializeAttribute : void 0;
    typeof i == 'string' && (i = [i]);
    try {
      n = r.event.target ? Ir(r.event.target, i) : Ir(r.event, i);
    } catch {
      n = '<unknown>';
    }
    n.length !== 0 &&
      Y().addBreadcrumb(
        { category: `ui.${r.name}`, message: n },
        { event: r.event, name: r.name, global: r.global }
      );
  }
  return e;
}
function Il(t) {
  var e = {
    category: 'console',
    data: { arguments: t.args, logger: 'console' },
    level: Uu(t.level),
    message: $n(t.args, ' '),
  };
  if (t.level === 'assert')
    if (t.args[0] === !1)
      (e.message = `Assertion failed: ${$n(t.args.slice(1), ' ') || 'console.assert'}`),
        (e.data.arguments = t.args.slice(1));
    else return;
  Y().addBreadcrumb(e, { input: t.args, level: t.level });
}
function Nl(t) {
  if (t.endTimestamp) {
    if (t.xhr.__sentry_own_request__) return;
    const { method: e, url: r, status_code: n, body: i } = t.xhr.__sentry_xhr__ || {};
    Y().addBreadcrumb(
      { category: 'xhr', data: { method: e, url: r, status_code: n }, type: 'http' },
      { xhr: t.xhr, input: i }
    );
    return;
  }
}
function Pl(t) {
  t.endTimestamp &&
    ((t.fetchData.url.match(/sentry_key/) && t.fetchData.method === 'POST') ||
      (t.error
        ? Y().addBreadcrumb(
            { category: 'fetch', data: t.fetchData, level: 'error', type: 'http' },
            { data: t.error, input: t.args }
          )
        : Y().addBreadcrumb(
            {
              category: 'fetch',
              data: { ...t.fetchData, status_code: t.response.status },
              type: 'http',
            },
            { input: t.args, response: t.response }
          )));
}
function Ll(t) {
  var e = W();
  let r = t.from,
    n = t.to;
  var i = br(e.location.href);
  let s = br(r);
  var o = br(n);
  s.path || (s = i),
    i.protocol === o.protocol && i.host === o.host && (n = o.relative),
    i.protocol === s.protocol && i.host === s.host && (r = s.relative),
    Y().addBreadcrumb({ category: 'navigation', data: { from: r, to: n } });
}
var ie = W();
let Wt;
function us() {
  if (Wt) return Wt;
  if (Pr(ie.fetch)) return (Wt = ie.fetch.bind(ie));
  var t = ie.document;
  let e = ie.fetch;
  if (t && typeof t.createElement == 'function')
    try {
      var r = t.createElement('iframe');
      (r.hidden = !0), t.head.appendChild(r);
      var n = r.contentWindow;
      n && n.fetch && (e = n.fetch), t.head.removeChild(r);
    } catch (i) {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.warn(
          'Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ',
          i
        );
    }
  return (Wt = e.bind(ie));
}
function Bl(t, e) {
  var r = Object.prototype.toString.call(ie && ie.navigator) === '[object Navigator]',
    n = r && typeof ie.navigator.sendBeacon == 'function';
  if (n) {
    var i = ie.navigator.sendBeacon.bind(ie.navigator);
    i(t, e);
  } else if (an()) {
    var s = us();
    s(t, { body: e, method: 'POST', credentials: 'omit', keepalive: !0 }).then(null, o => {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.error(o);
    });
  }
}
var xr = W();
class Cl extends Ke {
  constructor(e) {
    (e._metadata = e._metadata || {}),
      (e._metadata.sdk = e._metadata.sdk || {
        name: 'sentry.javascript.browser',
        packages: [{ name: 'npm:@sentry/browser', version: ri }],
        version: ri,
      }),
      super(e),
      e.sendClientReports &&
        xr.document &&
        xr.document.addEventListener('visibilitychange', () => {
          xr.document.visibilityState === 'hidden' && this._flushOutcomes();
        });
  }
  eventFromException(e, r) {
    return Al(this._options.stackParser, e, r, this._options.attachStacktrace);
  }
  eventFromMessage(e, r = 'info', n) {
    return Dl(this._options.stackParser, e, r, n, this._options.attachStacktrace);
  }
  sendEvent(e, r) {
    var n = this.getIntegrationById(as);
    n &&
      n.options &&
      n.options.sentry &&
      Y().addBreadcrumb(
        {
          category: `sentry.${e.type === 'transaction' ? 'transaction' : 'event'}`,
          event_id: e.event_id,
          level: e.level,
          message: He(e),
        },
        { event: e }
      ),
      super.sendEvent(e, r);
  }
  _prepareEvent(e, r, n) {
    return (e.platform = e.platform || 'javascript'), super._prepareEvent(e, r, n);
  }
  _flushOutcomes() {
    var e = this._clearOutcomes();
    if (e.length === 0) {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.log('No outcomes to send');
      return;
    }
    if (!this._dsn) {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
        I.log('No dsn provided, will not send outcomes');
      return;
    }
    (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.log('Sending outcomes:', e);
    var r = ns(this._dsn, this._options),
      n = Wu(e, this._options.tunnel && tn(this._dsn));
    try {
      Bl(r, Zi(n));
    } catch (i) {
      (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.error(i);
    }
  }
}
function Ul(t, e = us()) {
  function r(n) {
    var i = {
      body: n.body,
      method: 'POST',
      referrerPolicy: 'origin',
      headers: t.headers,
      ...t.fetchOptions,
    };
    return e(t.url, i).then(s => ({
      statusCode: s.status,
      headers: {
        'x-sentry-rate-limits': s.headers.get('X-Sentry-Rate-Limits'),
        'retry-after': s.headers.get('Retry-After'),
      },
    }));
  }
  return ss(t, r);
}
var Ml = 4;
function Fl(t) {
  function e(r) {
    return new K((n, i) => {
      var s = new XMLHttpRequest();
      (s.onerror = i),
        (s.onreadystatechange = () => {
          s.readyState === Ml &&
            n({
              statusCode: s.status,
              headers: {
                'x-sentry-rate-limits': s.getResponseHeader('X-Sentry-Rate-Limits'),
                'retry-after': s.getResponseHeader('Retry-After'),
              },
            });
        }),
        s.open('POST', t.url);
      for (var o in t.headers)
        Object.prototype.hasOwnProperty.call(t.headers, o) && s.setRequestHeader(o, t.headers[o]);
      s.send(r.body);
    });
  }
  return ss(t, e);
}
var or = '?',
  Gl = 30,
  jl = 40,
  $l = 50;
function pn(t, e, r, n) {
  var i = { filename: t, function: e, in_app: !0 };
  return r !== void 0 && (i.lineno = r), n !== void 0 && (i.colno = n), i;
}
var Hl =
    /^\s*at (?:(.*\).*?|.*?) ?\((?:address at )?)?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
  Wl = /\((\S*)(?::(\d+))(?::(\d+))\)/,
  ql = t => {
    var e = Hl.exec(t);
    if (e) {
      var r = e[2] && e[2].indexOf('eval') === 0;
      if (r) {
        var n = Wl.exec(e[2]);
        n && ((e[2] = n[1]), (e[3] = n[2]), (e[4] = n[3]));
      }
      const [i, s] = ls(e[1] || or, e[2]);
      return pn(s, i, e[3] ? +e[3] : void 0, e[4] ? +e[4] : void 0);
    }
  },
  Yl = [Gl, ql],
  zl =
    /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:file|https?|blob|chrome|webpack|resource|moz-extension|safari-extension|safari-web-extension|capacitor)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
  Vl = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
  Jl = t => {
    var e = zl.exec(t);
    if (e) {
      var r = e[3] && e[3].indexOf(' > eval') > -1;
      if (r) {
        var n = Vl.exec(e[3]);
        n && ((e[1] = e[1] || 'eval'), (e[3] = n[1]), (e[4] = n[2]), (e[5] = ''));
      }
      let i = e[3],
        s = e[1] || or;
      return ([s, i] = ls(s, i)), pn(i, s, e[4] ? +e[4] : void 0, e[5] ? +e[5] : void 0);
    }
  },
  Xl = [$l, Jl],
  Kl =
    /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
  Ql = t => {
    var e = Kl.exec(t);
    return e ? pn(e[2], e[1] || or, +e[3], e[4] ? +e[4] : void 0) : void 0;
  },
  Zl = [jl, Ql],
  ec = [Yl, Xl, Zl],
  tc = Ji(...ec),
  ls = (t, e) => {
    var r = t.indexOf('safari-extension') !== -1,
      n = t.indexOf('safari-web-extension') !== -1;
    return r || n
      ? [
          t.indexOf('@') !== -1 ? t.split('@')[0] : or,
          r ? `safari-extension:${e}` : `safari-web-extension:${e}`,
        ]
      : [t, e];
  };
let Gr = 0;
function cs() {
  return Gr > 0;
}
function rc() {
  (Gr += 1),
    setTimeout(() => {
      Gr -= 1;
    });
}
function ot(t, e = {}, r) {
  if (typeof t != 'function') return t;
  try {
    var n = t.__sentry_wrapped__;
    if (n) return n;
    if (sn(t)) return t;
  } catch {
    return t;
  }
  var i = function () {
    var a = Array.prototype.slice.call(arguments);
    try {
      var c = a.map(f => ot(f, e));
      return t.apply(this, c);
    } catch (f) {
      throw (
        (rc(),
        fn(g => {
          g.addEventProcessor(
            _ => (
              e.mechanism && (Lr(_, void 0), vt(_, e.mechanism)),
              (_.extra = { ..._.extra, arguments: a }),
              _
            )
          ),
            ir(f);
        }),
        f)
      );
    }
  };
  try {
    for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (i[s] = t[s]);
  } catch {}
  zi(i, t), nn(t, '__sentry_wrapped__', i);
  try {
    var o = Object.getOwnPropertyDescriptor(i, 'name');
    o.configurable &&
      Object.defineProperty(i, 'name', {
        get() {
          return t.name;
        },
      });
  } catch {}
  return i;
}
class Ie {
  static __initStatic() {
    this.id = 'GlobalHandlers';
  }
  __init() {
    this.name = Ie.id;
  }
  __init2() {
    this._installFunc = { onerror: nc, onunhandledrejection: ic };
  }
  constructor(e) {
    Ie.prototype.__init.call(this),
      Ie.prototype.__init2.call(this),
      (this._options = { onerror: !0, onunhandledrejection: !0, ...e });
  }
  setupOnce() {
    Error.stackTraceLimit = 50;
    var e = this._options;
    for (var r in e) {
      var n = this._installFunc[r];
      n && e[r] && (ac(r), n(), (this._installFunc[r] = void 0));
    }
  }
}
Ie.__initStatic();
function nc() {
  Te('error', t => {
    const [e, r, n] = hs();
    if (!e.getIntegration(Ie)) return;
    const { msg: i, url: s, line: o, column: a, error: c } = t;
    if (!(cs() || (c && c.__sentry_own_request__))) {
      var f = c === void 0 && nt(i) ? oc(i, s, o, a) : fs(hn(r, c || i, void 0, n, !1), s, o, a);
      (f.level = 'error'), ds(e, c, f, 'onerror');
    }
  });
}
function ic() {
  Te('unhandledrejection', t => {
    const [e, r, n] = hs();
    if (!e.getIntegration(Ie)) return;
    let i = t;
    try {
      'reason' in t
        ? (i = t.reason)
        : 'detail' in t && 'reason' in t.detail && (i = t.detail.reason);
    } catch {}
    if (cs() || (i && i.__sentry_own_request__)) return !0;
    var s = Wi(i) ? sc(i) : hn(r, i, void 0, n, !0);
    (s.level = 'error'), ds(e, i, s, 'onunhandledrejection');
  });
}
function sc(t) {
  return {
    exception: {
      values: [
        {
          type: 'UnhandledRejection',
          value: `Non-Error promise rejection captured with value: ${String(t)}`,
        },
      ],
    },
  };
}
function oc(t, e, r, n) {
  var i =
    /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
  let s = Hi(t) ? t.message : t,
    o = 'Error';
  var a = s.match(i);
  a && ((o = a[1]), (s = a[2]));
  var c = { exception: { values: [{ type: o, value: s }] } };
  return fs(c, e, r, n);
}
function fs(t, e, r, n) {
  var i = (t.exception = t.exception || {}),
    s = (i.values = i.values || []),
    o = (s[0] = s[0] || {}),
    a = (o.stacktrace = o.stacktrace || {}),
    c = (a.frames = a.frames || []),
    f = isNaN(parseInt(n, 10)) ? void 0 : n,
    g = isNaN(parseInt(r, 10)) ? void 0 : r,
    _ = nt(e) && e.length > 0 ? e : ru();
  return (
    c.length === 0 && c.push({ colno: f, filename: _, function: '?', in_app: !0, lineno: g }), t
  );
}
function ac(t) {
  (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) && I.log(`Global Handler attached: ${t}`);
}
function ds(t, e, r, n) {
  vt(r, { handled: !1, type: n }), t.captureEvent(r, { originalException: e });
}
function hs() {
  var t = Y(),
    e = t.getClient(),
    r = (e && e.getOptions()) || { stackParser: () => [], attachStacktrace: !1 };
  return [t, r.stackParser, r.attachStacktrace];
}
var uc = [
  'EventTarget',
  'Window',
  'Node',
  'ApplicationCache',
  'AudioTrackList',
  'ChannelMergerNode',
  'CryptoOperation',
  'EventSource',
  'FileReader',
  'HTMLUnknownElement',
  'IDBDatabase',
  'IDBRequest',
  'IDBTransaction',
  'KeyOperation',
  'MediaController',
  'MessagePort',
  'ModalWindow',
  'Notification',
  'SVGElementInstance',
  'Screen',
  'TextTrack',
  'TextTrackCue',
  'TextTrackList',
  'WebSocket',
  'WebSocketWorker',
  'Worker',
  'XMLHttpRequest',
  'XMLHttpRequestEventTarget',
  'XMLHttpRequestUpload',
];
class St {
  static __initStatic() {
    this.id = 'TryCatch';
  }
  __init() {
    this.name = St.id;
  }
  constructor(e) {
    St.prototype.__init.call(this),
      (this._options = {
        XMLHttpRequest: !0,
        eventTarget: !0,
        requestAnimationFrame: !0,
        setInterval: !0,
        setTimeout: !0,
        ...e,
      });
  }
  setupOnce() {
    var e = W();
    this._options.setTimeout && X(e, 'setTimeout', ii),
      this._options.setInterval && X(e, 'setInterval', ii),
      this._options.requestAnimationFrame && X(e, 'requestAnimationFrame', lc),
      this._options.XMLHttpRequest &&
        'XMLHttpRequest' in e &&
        X(XMLHttpRequest.prototype, 'send', cc);
    var r = this._options.eventTarget;
    if (r) {
      var n = Array.isArray(r) ? r : uc;
      n.forEach(fc);
    }
  }
}
St.__initStatic();
function ii(t) {
  return function (...e) {
    var r = e[0];
    return (
      (e[0] = ot(r, { mechanism: { data: { function: Ne(t) }, handled: !0, type: 'instrument' } })),
      t.apply(this, e)
    );
  };
}
function lc(t) {
  return function (e) {
    return t.apply(this, [
      ot(e, {
        mechanism: {
          data: { function: 'requestAnimationFrame', handler: Ne(t) },
          handled: !0,
          type: 'instrument',
        },
      }),
    ]);
  };
}
function cc(t) {
  return function (...e) {
    var r = this,
      n = ['onload', 'onerror', 'onprogress', 'onreadystatechange'];
    return (
      n.forEach(i => {
        i in r &&
          typeof r[i] == 'function' &&
          X(r, i, function (s) {
            var o = {
                mechanism: {
                  data: { function: i, handler: Ne(s) },
                  handled: !0,
                  type: 'instrument',
                },
              },
              a = sn(s);
            return a && (o.mechanism.data.handler = Ne(a)), ot(s, o);
          });
      }),
      t.apply(this, e)
    );
  };
}
function fc(t) {
  var e = W(),
    r = e[t] && e[t].prototype;
  !r ||
    !r.hasOwnProperty ||
    !r.hasOwnProperty('addEventListener') ||
    (X(r, 'addEventListener', function (n) {
      return function (i, s, o) {
        try {
          typeof s.handleEvent == 'function' &&
            (s.handleEvent = ot(s.handleEvent, {
              mechanism: {
                data: { function: 'handleEvent', handler: Ne(s), target: t },
                handled: !0,
                type: 'instrument',
              },
            }));
        } catch {}
        return n.apply(this, [
          i,
          ot(s, {
            mechanism: {
              data: { function: 'addEventListener', handler: Ne(s), target: t },
              handled: !0,
              type: 'instrument',
            },
          }),
          o,
        ]);
      };
    }),
    X(r, 'removeEventListener', function (n) {
      return function (i, s, o) {
        var a = s;
        try {
          var c = a && a.__sentry_wrapped__;
          c && n.call(this, i, c, o);
        } catch {}
        return n.call(this, i, a, o);
      };
    }));
}
var dc = 'cause',
  hc = 5;
class et {
  static __initStatic() {
    this.id = 'LinkedErrors';
  }
  __init() {
    this.name = et.id;
  }
  constructor(e = {}) {
    et.prototype.__init.call(this), (this._key = e.key || dc), (this._limit = e.limit || hc);
  }
  setupOnce() {
    var e = Y().getClient();
    e &&
      un((r, n) => {
        var i = Y().getIntegration(et);
        return i ? pc(e.getOptions().stackParser, i._key, i._limit, r, n) : r;
      });
  }
}
et.__initStatic();
function pc(t, e, r, n, i) {
  if (!n.exception || !n.exception.values || !i || !Pe(i.originalException, Error)) return n;
  var s = ps(t, r, i.originalException, e);
  return (n.exception.values = [...s, ...n.exception.values]), n;
}
function ps(t, e, r, n, i = []) {
  if (!Pe(r[n], Error) || i.length + 1 >= e) return i;
  var s = os(t, r[n]);
  return ps(t, e, r[n], n, [s, ...i]);
}
var Ue = W();
class tt {
  constructor() {
    tt.prototype.__init.call(this);
  }
  static __initStatic() {
    this.id = 'HttpContext';
  }
  __init() {
    this.name = tt.id;
  }
  setupOnce() {
    un(e => {
      if (Y().getIntegration(tt)) {
        if (!Ue.navigator && !Ue.location && !Ue.document) return e;
        var r = (e.request && e.request.url) || (Ue.location && Ue.location.href);
        const { referrer: s } = Ue.document || {},
          { userAgent: o } = Ue.navigator || {};
        var n = {
            ...(e.request && e.request.headers),
            ...(s && { Referer: s }),
            ...(o && { 'User-Agent': o }),
          },
          i = { ...(r && { url: r }), headers: n };
        return { ...e, request: i };
      }
      return e;
    });
  }
}
tt.__initStatic();
class rt {
  constructor() {
    rt.prototype.__init.call(this);
  }
  static __initStatic() {
    this.id = 'Dedupe';
  }
  __init() {
    this.name = rt.id;
  }
  setupOnce(e, r) {
    var n = i => {
      var s = r().getIntegration(rt);
      if (s) {
        try {
          if (gc(i, s._previousEvent))
            return (
              (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
                I.warn('Event dropped due to being a duplicate of previously captured event.'),
              null
            );
        } catch {
          return (s._previousEvent = i);
        }
        return (s._previousEvent = i);
      }
      return i;
    };
    (n.id = this.name), e(n);
  }
}
rt.__initStatic();
function gc(t, e) {
  return e ? !!(mc(t, e) || _c(t, e)) : !1;
}
function mc(t, e) {
  var r = t.message,
    n = e.message;
  return !((!r && !n) || (r && !n) || (!r && n) || r !== n || !ms(t, e) || !gs(t, e));
}
function _c(t, e) {
  var r = si(e),
    n = si(t);
  return !(!r || !n || r.type !== n.type || r.value !== n.value || !ms(t, e) || !gs(t, e));
}
function gs(t, e) {
  let r = oi(t),
    n = oi(e);
  if (!r && !n) return !0;
  if ((r && !n) || (!r && n) || ((r = r), (n = n), n.length !== r.length)) return !1;
  for (let o = 0; o < n.length; o++) {
    var i = n[o],
      s = r[o];
    if (
      i.filename !== s.filename ||
      i.lineno !== s.lineno ||
      i.colno !== s.colno ||
      i.function !== s.function
    )
      return !1;
  }
  return !0;
}
function ms(t, e) {
  let r = t.fingerprint,
    n = e.fingerprint;
  if (!r && !n) return !0;
  if ((r && !n) || (!r && n)) return !1;
  (r = r), (n = n);
  try {
    return r.join('') === n.join('');
  } catch {
    return !1;
  }
}
function si(t) {
  return t.exception && t.exception.values && t.exception.values[0];
}
function oi(t) {
  var e = t.exception;
  if (e)
    try {
      return e.values[0].stacktrace.frames;
    } catch {
      return;
    }
}
var vc = [new Ze(), new yt(), new St(), new Et(), new Ie(), new et(), new rt(), new tt()];
function _s(t = {}) {
  if ((t.defaultIntegrations === void 0 && (t.defaultIntegrations = vc), t.release === void 0)) {
    var e = W();
    e.SENTRY_RELEASE && e.SENTRY_RELEASE.id && (t.release = e.SENTRY_RELEASE.id);
  }
  t.autoSessionTracking === void 0 && (t.autoSessionTracking = !0),
    t.sendClientReports === void 0 && (t.sendClientReports = !0);
  var r = {
    ...t,
    stackParser: hu(t.stackParser || tc),
    integrations: cl(t),
    transport: t.transport || (an() ? Ul : Fl),
  };
  hl(Cl, r), t.autoSessionTracking && yc();
}
function ai(t) {
  t.startSession({ ignoreDuration: !0 }), t.captureSession();
}
function yc() {
  var t = W(),
    e = t.document;
  if (typeof e > 'u') {
    (typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__) &&
      I.warn('Session tracking in non-browser environment with @sentry/browser is not supported.');
    return;
  }
  var r = Y();
  r.captureSession &&
    (ai(r),
    Te('history', ({ from: n, to: i }) => {
      n === void 0 || n === i || ai(Y());
    }));
}
var Xt = 'NOT_FOUND';
function Ec(t) {
  var e;
  return {
    get: function (n) {
      return e && t(e.key, n) ? e.value : Xt;
    },
    put: function (n, i) {
      e = { key: n, value: i };
    },
    getEntries: function () {
      return e ? [e] : [];
    },
    clear: function () {
      e = void 0;
    },
  };
}
function Sc(t, e) {
  var r = [];
  function n(a) {
    var c = r.findIndex(function (g) {
      return e(a, g.key);
    });
    if (c > -1) {
      var f = r[c];
      return c > 0 && (r.splice(c, 1), r.unshift(f)), f.value;
    }
    return Xt;
  }
  function i(a, c) {
    n(a) === Xt && (r.unshift({ key: a, value: c }), r.length > t && r.pop());
  }
  function s() {
    return r;
  }
  function o() {
    r = [];
  }
  return { get: n, put: i, getEntries: s, clear: o };
}
var bc = function (e, r) {
  return e === r;
};
function wc(t) {
  return function (r, n) {
    if (r === null || n === null || r.length !== n.length) return !1;
    for (var i = r.length, s = 0; s < i; s++) if (!t(r[s], n[s])) return !1;
    return !0;
  };
}
function Oc(t, e) {
  var r = typeof e == 'object' ? e : { equalityCheck: e },
    n = r.equalityCheck,
    i = n === void 0 ? bc : n,
    s = r.maxSize,
    o = s === void 0 ? 1 : s,
    a = r.resultEqualityCheck,
    c = wc(i),
    f = o === 1 ? Ec(c) : Sc(o, c);
  function g() {
    var _ = f.get(arguments);
    if (_ === Xt) {
      if (((_ = t.apply(null, arguments)), a)) {
        var y = f.getEntries(),
          E = y.find(function (O) {
            return a(O.value, _);
          });
        E && (_ = E.value);
      }
      f.put(arguments, _);
    }
    return _;
  }
  return (
    (g.clearCache = function () {
      return f.clear();
    }),
    g
  );
}
function xc(t) {
  var e = Array.isArray(t[0]) ? t[0] : t;
  if (
    !e.every(function (n) {
      return typeof n == 'function';
    })
  ) {
    var r = e
      .map(function (n) {
        return typeof n == 'function' ? 'function ' + (n.name || 'unnamed') + '()' : typeof n;
      })
      .join(', ');
    throw new Error(
      'createSelector expects all input-selectors to be functions, but received the following types: [' +
        r +
        ']'
    );
  }
  return e;
}
function Tc(t) {
  for (var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++)
    r[n - 1] = arguments[n];
  var i = function () {
    for (var o = arguments.length, a = new Array(o), c = 0; c < o; c++) a[c] = arguments[c];
    var f = 0,
      g,
      _ = { memoizeOptions: void 0 },
      y = a.pop();
    if ((typeof y == 'object' && ((_ = y), (y = a.pop())), typeof y != 'function'))
      throw new Error(
        'createSelector expects an output function after the inputs, but received: [' +
          typeof y +
          ']'
      );
    var E = _,
      O = E.memoizeOptions,
      R = O === void 0 ? r : O,
      P = Array.isArray(R) ? R : [R],
      N = xc(a),
      w = t.apply(
        void 0,
        [
          function () {
            return f++, y.apply(null, arguments);
          },
        ].concat(P)
      ),
      A = t(function () {
        for (var F = [], $ = N.length, q = 0; q < $; q++) F.push(N[q].apply(null, arguments));
        return (g = w.apply(null, F)), g;
      });
    return (
      Object.assign(A, {
        resultFunc: y,
        memoizedResultFunc: w,
        dependencies: N,
        lastResult: function () {
          return g;
        },
        recomputations: function () {
          return f;
        },
        resetRecomputations: function () {
          return (f = 0);
        },
      }),
      A
    );
  };
  return i;
}
function ae() {
  return typeof window > 'u' || typeof WorkerGlobalScope < 'u';
}
function vs() {
  return ae() || 'vi' in window ? !1 : !['', '80', '443'].includes(window.location.port);
}
function ar() {
  return ae() ? !1 : !!window.electronAPI;
}
function kc() {
  return ae(), !1;
}
function ur() {
  return ae() ? !1 : window.navigator.userAgent.toLowerCase().includes('macintosh');
}
function ys() {
  return ae()
    ? !1
    : !!(window.ReactNativeWebView || window.AndroidInterface || window.AndroidAssistantInterface);
}
const Ac = ar(),
  Dc = Ac && !1,
  jr = Dc;
function bt(t) {
  return !!(t.userState && t.userState.org && t.userState.org.id);
}
function Es(t, e) {
  e || (e = 'TEXT');
  let r = bt(t) && !!Kt(t, 'products')?.includes(e);
  return e === 'TEXT' && Kt(t, 'products') === void 0 && bt(t) && (r = !0), r;
}
function ui(t) {
  if (
    !(!t || !t.userState || !t.orgState) &&
    !(!t.userState.org || !(t.orgState.org && t.orgState.org.id))
  )
    return t.orgState.org.id;
}
function Kt(t, e) {
  if (!(!t || !t.userState || !t.orgState) && !(!t.userState.org || !t.orgState.org?.readonly))
    return t.orgState.org.readonly[e];
}
function Ss(t, e, r = void 0, n = void 0) {
  if (
    ![
      'xSharingDisabled',
      'shouldWhitelistCommands',
      'commandWhitelist',
      'domainWhitelist',
      'smartsEnabled',
      'userAddonsEnabled',
      'userConnectedDisabled',
      'userBlazeChatDisabled',
      'voice',
    ].includes(e)
  )
    throw Error('Unknown org pref: ' + e);
  return !t || !t.userState || !t.userState.org
    ? r
    : !t.orgState || !t.orgState.org
    ? n
    : t.orgState.org.options && e in t.orgState.org.options
    ? t.orgState.org.options[e]
    : n;
}
function bs(t) {
  return !!(t && t.userState && t.userState.org && t.userState.org.type === 'owner');
}
function Rc(t, e) {
  if (!['create', 'share'].includes(e)) throw Error('Unknown member restriction: ' + e);
  return !t ||
    !t.userState ||
    !t.orgState ||
    !t.userState.org ||
    !t.orgState.org ||
    t.userState.org.type !== 'member'
    ? !1
    : t.orgState.org.options
    ? (t.orgState.org.options.memberRestrictions || '').includes(e)
    : !1;
}
const li = 'DEFAULT';
function Ic(t) {
  let e, r;
  return (
    bt(t)
      ? ((e = Kt(t, 'capabilities_plan') || li), (r = Kt(t, 'capabilities_adjustment')))
      : (!t.userState || !t.userState.options || !t.userState.options.capabilities_plan
          ? (e = li)
          : (e = t.userState.options.capabilities_plan),
        (r = t.userState && t.userState.capabilities_adjustment)),
    { plan: e, adjustments: r }
  );
}
function ws(t, e) {
  let r,
    n = '';
  if ((e || (e = 'TEXT'), e === 'AI')) {
    const i = t.userState?.pro_grant_ai?.expiry?.seconds;
    if (
      ((r = i && new Date(i * 1e3)),
      (n = t.userState?.pro_grant_ai?.mode),
      t.orgState?.org?.id && (!r || r.getTime() < Date.now()))
    ) {
      const s = t.orgState?.org?.readonly?.pro_grant_ai?.expiry?.seconds;
      (r = s && new Date(s * 1e3)), (n = 'business');
    }
  } else {
    const i = t.userState?.pro_grant_expiry?.seconds;
    r = i && new Date(i * 1e3);
  }
  return r ? { expiry: r, mode: n } : null;
}
function $r(t, e) {
  if (!t || !t.userState) return;
  let r = ws(t, e)?.expiry;
  return !!(Os(t, e) || (r && new Date() < r));
}
function Os(t, e) {
  if (!t || !t.userState) return;
  e || (e = 'TEXT');
  let r = t.userState.products?.includes(e) || !!Es(t, e);
  return e === 'TEXT' && !r && t.userState.products === void 0 && (r = !!t.userState.is_pro), r;
}
function Nc(t, e, r) {
  let n, i;
  return (
    e.addons &&
      e.addons[t] &&
      e.addons[t].enabled &&
      ((n = 'user'), (i = e.addons[t].approved_grants)),
    r &&
      r.org &&
      r.org.addons &&
      r.org.addons[t] &&
      ((n = 'organization'), (i = r.org.addons[t].approved_grants)),
    { installedBy: n, approvedGrants: i }
  );
}
function Pc(t, e, r, n = null) {
  let i = (t.options.addon.config && t.options.addon.config.form_names) || {},
    s,
    o,
    a,
    c;
  n && (s = t.associated_addon_id);
  let f = n;
  if (!f && t.associated_addon_id) {
    s = t.associated_addon_id;
    let _ = Nc(s, e, r);
    (f = _.installedBy), (c = _.approvedGrants), f === 'organization' && (a = r.org.addons[s].data);
  }
  if (
    (f || ((s = t.id), (f = 'user'), (c = 'LOCAL_DEVELOPMENT')),
    (o = e.addons && e.addons[s] && e.addons[s].data),
    f === 'user')
  )
    for (let _ in o) _ in i || delete o[_];
  else {
    for (let _ in o) (!(_ in i) || i[_].type !== 'standard') && delete o[_];
    for (let _ in a) (!(_ in i) || i[_].type !== 'shared') && delete a[_];
  }
  let g = Object.assign({}, o, a);
  for (let _ in i) _ in g || (g[_] = i[_].default);
  return { installed: f, data: g, id: s, approvedGrants: c };
}
function Lc(t, e, r) {
  let n = e.connected,
    i = t && t.org && t.org.id,
    s = t && t.uid;
  const o = r ? 'Page' : 'Snippet',
    a = c => {
      let f =
        'Cannot use {command} in a shared ' + c + ' outside a Text Blaze Business organization';
      return {
        isConnected: !1,
        invalidShare: !0,
        config: {
          pingHostWhitelist: [],
          loadHostWhitelist: [],
          connectedAddonWhitelist: [],
          databaseQueryWhitelist: {},
          pingHostWhitelistErrorTemplate: f,
          loadHostWhitelistErrorTemplate: f,
          connectedAddonWhitelistErrorTemplate: f,
          databaseQueryWhitelistErrorTemplate: f,
        },
      };
    };
  if (n && n.is_connected) {
    if (n.connector) {
      if (!r && !(n.connector === 'u:' + s || (i && n.connector === 'o:' + i)))
        return a(`Connected ${o}`);
    } else return a(`Connected ${o}`);
    return {
      isConnected: !0,
      config: {
        pingHostWhitelist: r ? null : n.ping_hosts || [],
        loadHostWhitelist: r ? null : n.load_hosts || [],
        connectedAddonWhitelist: r ? null : n.addons || [],
        databaseQueryWhitelist: n.database_queries || {},
        pingHostWhitelistErrorTemplate: `${o} not connected to send data to {domain}`,
        loadHostWhitelistErrorTemplate: `${o} not connected to send data to and load data from {domain}`,
        databaseQueryWhitelistErrorTemplate: `${o} not connected to run this query on this space`,
        connectedAddonWhitelistErrorTemplate: '{command} is not connected',
      },
    };
  } else {
    let c = `You can only use {command} in a Connected ${o}`;
    return {
      isConnected: !1,
      config: {
        pingHostWhitelist: [],
        loadHostWhitelist: [],
        connectedAddonWhitelist: [],
        databaseQueryWhitelist: {},
        pingHostWhitelistErrorTemplate: c,
        loadHostWhitelistErrorTemplate: c,
        databaseQueryWhitelistErrorTemplate: c,
        connectedAddonWhitelistErrorTemplate: c,
      },
    };
  }
}
ar() && ur();
function Bc(t) {
  const e = 'full';
  return bs(t) || Ss(t, 'userBlazeChatDisabled', e, e) === e;
}
const Cc = 'https://data-api.blaze.today',
  xs = 'https://data-owl.blaze.today',
  Uc = 'https://data-embed.blaze.today',
  Mc = ['https://pageblaze.com', 'https://wwww.pageblaze.com'];
[Cc, Uc].some(t => t.includes('localhost')) &&
  console.warn('Do NOT use local database in production.');
Mc.some(t => t.includes('localhost')) && console.warn('Do NOT use local Page Blaze in production.');
const gn = new URL(xs);
gn.pathname = '/ai/autowrite/';
gn.protocol = xs.startsWith('https:') ? 'wss:' : 'ws:';
const Fc = gn.toString();
ur();
ur();
ur();
async function Gc(t) {
  let e = null;
  if (
    ('sendMessageFn' in t
      ? (e = await t.sendMessageFn({ request: 'errorLoggerDetails' }))
      : (e = t.details),
    !e)
  )
    return;
  let r = 'service_worker';
  ae() || (r = window.location.pathname.split('/').slice(-2).join('/')),
    _s({
      dsn: e.dsn || 'https://cc8ab001f3a041a9a12b648032cebdf6@o233950.ingest.sentry.io/1397434',
      release: e.release,
      normalizeDepth: 5,
      beforeSend: (n, i) =>
        i?.originalException?.toString().includes('The browser is shutting down') ? null : n,
      maxBreadcrumbs: e.maxBreadcrumbs,
      beforeBreadcrumb: e.beforeBreadcrumb,
    }),
    sr(n => {
      n.setTag('extension_context', r),
        n.setTag('logger', e.sentryLogger),
        n.setTag('extension_browser', e.extension_browser),
        n.setTag('reported_release', e.reported_release),
        n.setUser({ id: e.id });
    });
}
function jc({ id: t }) {
  sr(e => {
    e.setUser({ id: t });
  });
}
function Ae() {
  let t = ae() ? self : window;
  if (t.chrome) return t.chrome;
  if (t.browser) return t.browser;
}
function wt() {
  if (ae())
    return {
      getItem: e =>
        Ae().runtime.sendMessage({
          type: 'localStorage',
          subType: 'get',
          key: e,
          target: 'offscreen',
        }),
      setItem: (e, r) =>
        Ae().runtime.sendMessage({
          type: 'localStorage',
          subType: 'set',
          key: e,
          value: r,
          target: 'offscreen',
        }),
    };
  const t = window.location.href;
  return t.startsWith('chrome-extension://') &&
    (t.endsWith('/html/sandbox.html') || t.endsWith('/html/formLoader.html'))
    ? window.TB_preferencesStore
    : {
        getItem: e => Promise.resolve(localStorage.getItem(e)),
        setItem: (e, r) => Promise.resolve(localStorage.setItem(e, r)),
      };
}
function $c(t, e = null) {
  const r = typeof t == 'string' ? new Error(t) : t;
  console.error(r),
    fn(n => {
      e && n.setExtras(e), ir(r);
    });
}
function Hc(t, e) {
  if (!e || !Object.keys(e).length) return t;
  let r = Object.assign({}, t);
  for (let n in e)
    if (e[n].type === 'sum') {
      if (typeof r[n] == 'number') {
        let i = +e[n].value;
        isNaN(i) ? console.warn('Invalid sum adjustment: ' + n + ' -- ' + e[n].value) : (r[n] += i);
      }
    } else (e[n].type === 'set' || (e[n].type === 'replace' && n in r)) && (r[n] = e[n].value);
  return r;
}
function ci(t, e, r) {
  if (!t || !Object.keys(t).length) return {};
  let n = t[e];
  if (
    !n &&
    ((typeof window > 'u' || !window.disable_capabilities_plan_warning_in_tests) &&
      console.warn('Invalid plan: ' + e),
    (n = t._STANDARD),
    !n)
  )
    return {};
  let i = Object.assign({}, n.shared, n.skus && n.skus[r]);
  for (; n.parent; ) (n = t[n.parent]), (i = Object.assign({}, n.shared, n.skus && n.skus[r], i));
  return i;
}
let Wc = t => {
    try {
      return qc(t);
    } catch (e) {
      return console.error('Capabilities failures.', e), ir(e), {};
    }
  },
  qc = Tc(Oc, zt)([t => t.config && t.config.plans, t => Ic(t), t => Yc(t)], (t, e, r) => {
    if (!t) return {};
    let { plan: n, adjustments: i } = e,
      [s, o] = r,
      a = ci(t, n, s),
      c;
    if (o) {
      c = ci(t, n, o);
      for (let f in a) a['CAN_UPGRADE_' + f] = a[f] !== c[f];
    } else for (let f in a) a['CAN_UPGRADE_' + f] = !1;
    return (a = Hc(a, i)), (a._PLAN = n), a;
  });
function Yc(t) {
  return bt(t)
    ? Es(t) || jr
      ? ['business', null]
      : ['basic', 'business']
    : $r(t) || (jr && $r(t, 'TEXT'))
    ? ['pro', 'business']
    : ['basic', 'pro'];
}
async function zc(t) {
  let e = 'usage_' + t,
    r = await wt().getItem(e),
    n = [];
  return (
    r && (n = JSON.parse(r)),
    (n = n.filter(i => new Date(i).toDateString() === new Date().toDateString())),
    await wt().setItem(e, JSON.stringify(n)),
    n.length
  );
}
async function Vc(t) {
  let e = 'usage_' + t,
    r = await wt().getItem(e),
    n = [];
  r && (n = JSON.parse(r)),
    n.length > 100 && (n = n.slice(n.length - 100)),
    n.push(Date.now()),
    await wt().setItem(e, JSON.stringify(n));
}
let Ts = [
    'waitForPendingWrites',
    'serverTimestamp',
    'getDocs',
    'getDoc',
    'onSnapshot',
    'addDoc',
    'updateDoc',
    'setDoc',
    'deleteDoc',
    'getFirestore',
    'getAuth',
    'getIdToken',
    'getIdTokenResult',
    'collection',
    'doc',
    'where',
    'orderBy',
    'limit',
    'query',
    'docExists',
    'getFunctions',
    'httpsCallable',
  ],
  Hr = {},
  j = lf();
const Jc = j.waitForPendingWrites,
  fi = j.serverTimestamp,
  Xc = j.getDocs,
  Kc = j.getDoc,
  qt = j.onSnapshot,
  Qc = j.addDoc,
  di = j.updateDoc,
  Zc = j.setDoc,
  ef = j.deleteDoc,
  ks = j.getFirestore,
  $e = j.getAuth;
let dt;
const ht = async (...t) => {
    if (dt) return dt;
    try {
      return (dt = j.getIdToken(...t)), await dt;
    } finally {
      dt = null;
    }
  },
  Tr = j.getIdTokenResult,
  tf = j.collection,
  As = j.doc,
  Me = j.docExists,
  rf = j.where,
  nf = j.orderBy,
  sf = j.limit,
  of = j.query,
  af = j.getFunctions,
  Ds = j.httpsCallable,
  Fe = function () {
    let t = Array.prototype.slice.call(arguments),
      e = typeof t[0] == 'string' || t.length === 0 ? ks() : t.shift();
    for (; t.length > 0; ) {
      let r = t.shift();
      if (((e = tf(e, r)), t.length > 0)) {
        let n = t.shift();
        e = As(e, n);
      }
    }
    return e;
  };
function uf(...t) {
  t.forEach(e => {
    for (let r of Ts) e.hasOwnProperty(r) && (Hr[r] = e[r]);
  });
}
function lf() {
  let t = {};
  for (let e of Ts) t[e] = cf(e);
  return t;
}
function cf(t) {
  return function () {
    if (Hr[t]) return Hr[t].apply(this, arguments);
    throw new Error(`Function ${t} of the firebase shared driver not implemented`);
  };
}
const ff = new Date('2023-11-01').getTime();
function df({ userState: t }) {
  const e = t?.firebaseMetadata?.creationTime;
  return !!(e && new Date(e).getTime() < ff);
}
function Wr() {
  const e = self.cachedStorageData?.user_info?.token;
  if (!e) return null;
  const r = 60,
    n = Date.now() / 1e3;
  return +e.claims.exp > n + r ? e : null;
}
const Rs = 4,
  hf = t =>
    t.options.projectId === 'blaze-today-stage'
      ? 'https://spark-api.blaze.today'
      : 'https://api.blaze.today',
  Is = t => af(t, hf(t));
var Ns = {},
  kr = {},
  pf = gf;
function gf(t, e) {
  for (var r = new Array(arguments.length - 1), n = 0, i = 2, s = !0; i < arguments.length; )
    r[n++] = arguments[i++];
  return new Promise(function (a, c) {
    r[n] = function (g) {
      if (s)
        if (((s = !1), g)) c(g);
        else {
          for (var _ = new Array(arguments.length - 1), y = 0; y < _.length; )
            _[y++] = arguments[y];
          a.apply(null, _);
        }
    };
    try {
      t.apply(e || null, r);
    } catch (f) {
      s && ((s = !1), c(f));
    }
  });
}
var mn = {};
(function (t) {
  var e = t;
  e.length = function (a) {
    var c = a.length;
    if (!c) return 0;
    for (var f = 0; --c % 4 > 1 && a.charAt(c) === '='; ) ++f;
    return Math.ceil(a.length * 3) / 4 - f;
  };
  for (var r = new Array(64), n = new Array(123), i = 0; i < 64; )
    n[(r[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : (i - 59) | 43)] = i++;
  e.encode = function (a, c, f) {
    for (var g = null, _ = [], y = 0, E = 0, O; c < f; ) {
      var R = a[c++];
      switch (E) {
        case 0:
          (_[y++] = r[R >> 2]), (O = (R & 3) << 4), (E = 1);
          break;
        case 1:
          (_[y++] = r[O | (R >> 4)]), (O = (R & 15) << 2), (E = 2);
          break;
        case 2:
          (_[y++] = r[O | (R >> 6)]), (_[y++] = r[R & 63]), (E = 0);
          break;
      }
      y > 8191 && ((g || (g = [])).push(String.fromCharCode.apply(String, _)), (y = 0));
    }
    return (
      E && ((_[y++] = r[O]), (_[y++] = 61), E === 1 && (_[y++] = 61)),
      g
        ? (y && g.push(String.fromCharCode.apply(String, _.slice(0, y))), g.join(''))
        : String.fromCharCode.apply(String, _.slice(0, y))
    );
  };
  var s = 'invalid encoding';
  (e.decode = function (a, c, f) {
    for (var g = f, _ = 0, y, E = 0; E < a.length; ) {
      var O = a.charCodeAt(E++);
      if (O === 61 && _ > 1) break;
      if ((O = n[O]) === void 0) throw Error(s);
      switch (_) {
        case 0:
          (y = O), (_ = 1);
          break;
        case 1:
          (c[f++] = (y << 2) | ((O & 48) >> 4)), (y = O), (_ = 2);
          break;
        case 2:
          (c[f++] = ((y & 15) << 4) | ((O & 60) >> 2)), (y = O), (_ = 3);
          break;
        case 3:
          (c[f++] = ((y & 3) << 6) | O), (_ = 0);
          break;
      }
    }
    if (_ === 1) throw Error(s);
    return f - g;
  }),
    (e.test = function (a) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(a);
    });
})(mn);
const mf = er(mn);
var _f = lr;
function lr() {
  this._listeners = {};
}
lr.prototype.on = function (e, r, n) {
  return (this._listeners[e] || (this._listeners[e] = [])).push({ fn: r, ctx: n || this }), this;
};
lr.prototype.off = function (e, r) {
  if (e === void 0) this._listeners = {};
  else if (r === void 0) this._listeners[e] = [];
  else for (var n = this._listeners[e], i = 0; i < n.length; ) n[i].fn === r ? n.splice(i, 1) : ++i;
  return this;
};
lr.prototype.emit = function (e) {
  var r = this._listeners[e];
  if (r) {
    for (var n = [], i = 1; i < arguments.length; ) n.push(arguments[i++]);
    for (i = 0; i < r.length; ) r[i].fn.apply(r[i++].ctx, n);
  }
  return this;
};
var vf = hi(hi);
function hi(t) {
  return (
    typeof Float32Array < 'u'
      ? (function () {
          var e = new Float32Array([-0]),
            r = new Uint8Array(e.buffer),
            n = r[3] === 128;
          function i(c, f, g) {
            (e[0] = c), (f[g] = r[0]), (f[g + 1] = r[1]), (f[g + 2] = r[2]), (f[g + 3] = r[3]);
          }
          function s(c, f, g) {
            (e[0] = c), (f[g] = r[3]), (f[g + 1] = r[2]), (f[g + 2] = r[1]), (f[g + 3] = r[0]);
          }
          (t.writeFloatLE = n ? i : s), (t.writeFloatBE = n ? s : i);
          function o(c, f) {
            return (r[0] = c[f]), (r[1] = c[f + 1]), (r[2] = c[f + 2]), (r[3] = c[f + 3]), e[0];
          }
          function a(c, f) {
            return (r[3] = c[f]), (r[2] = c[f + 1]), (r[1] = c[f + 2]), (r[0] = c[f + 3]), e[0];
          }
          (t.readFloatLE = n ? o : a), (t.readFloatBE = n ? a : o);
        })()
      : (function () {
          function e(n, i, s, o) {
            var a = i < 0 ? 1 : 0;
            if ((a && (i = -i), i === 0)) n(1 / i > 0 ? 0 : 2147483648, s, o);
            else if (isNaN(i)) n(2143289344, s, o);
            else if (i > 34028234663852886e22) n(((a << 31) | 2139095040) >>> 0, s, o);
            else if (i < 11754943508222875e-54)
              n(((a << 31) | Math.round(i / 1401298464324817e-60)) >>> 0, s, o);
            else {
              var c = Math.floor(Math.log(i) / Math.LN2),
                f = Math.round(i * Math.pow(2, -c) * 8388608) & 8388607;
              n(((a << 31) | ((c + 127) << 23) | f) >>> 0, s, o);
            }
          }
          (t.writeFloatLE = e.bind(null, pi)), (t.writeFloatBE = e.bind(null, gi));
          function r(n, i, s) {
            var o = n(i, s),
              a = (o >> 31) * 2 + 1,
              c = (o >>> 23) & 255,
              f = o & 8388607;
            return c === 255
              ? f
                ? NaN
                : a * (1 / 0)
              : c === 0
              ? a * 1401298464324817e-60 * f
              : a * Math.pow(2, c - 150) * (f + 8388608);
          }
          (t.readFloatLE = r.bind(null, mi)), (t.readFloatBE = r.bind(null, _i));
        })(),
    typeof Float64Array < 'u'
      ? (function () {
          var e = new Float64Array([-0]),
            r = new Uint8Array(e.buffer),
            n = r[7] === 128;
          function i(c, f, g) {
            (e[0] = c),
              (f[g] = r[0]),
              (f[g + 1] = r[1]),
              (f[g + 2] = r[2]),
              (f[g + 3] = r[3]),
              (f[g + 4] = r[4]),
              (f[g + 5] = r[5]),
              (f[g + 6] = r[6]),
              (f[g + 7] = r[7]);
          }
          function s(c, f, g) {
            (e[0] = c),
              (f[g] = r[7]),
              (f[g + 1] = r[6]),
              (f[g + 2] = r[5]),
              (f[g + 3] = r[4]),
              (f[g + 4] = r[3]),
              (f[g + 5] = r[2]),
              (f[g + 6] = r[1]),
              (f[g + 7] = r[0]);
          }
          (t.writeDoubleLE = n ? i : s), (t.writeDoubleBE = n ? s : i);
          function o(c, f) {
            return (
              (r[0] = c[f]),
              (r[1] = c[f + 1]),
              (r[2] = c[f + 2]),
              (r[3] = c[f + 3]),
              (r[4] = c[f + 4]),
              (r[5] = c[f + 5]),
              (r[6] = c[f + 6]),
              (r[7] = c[f + 7]),
              e[0]
            );
          }
          function a(c, f) {
            return (
              (r[7] = c[f]),
              (r[6] = c[f + 1]),
              (r[5] = c[f + 2]),
              (r[4] = c[f + 3]),
              (r[3] = c[f + 4]),
              (r[2] = c[f + 5]),
              (r[1] = c[f + 6]),
              (r[0] = c[f + 7]),
              e[0]
            );
          }
          (t.readDoubleLE = n ? o : a), (t.readDoubleBE = n ? a : o);
        })()
      : (function () {
          function e(n, i, s, o, a, c) {
            var f = o < 0 ? 1 : 0;
            if ((f && (o = -o), o === 0)) n(0, a, c + i), n(1 / o > 0 ? 0 : 2147483648, a, c + s);
            else if (isNaN(o)) n(0, a, c + i), n(2146959360, a, c + s);
            else if (o > 17976931348623157e292)
              n(0, a, c + i), n(((f << 31) | 2146435072) >>> 0, a, c + s);
            else {
              var g;
              if (o < 22250738585072014e-324)
                (g = o / 5e-324),
                  n(g >>> 0, a, c + i),
                  n(((f << 31) | (g / 4294967296)) >>> 0, a, c + s);
              else {
                var _ = Math.floor(Math.log(o) / Math.LN2);
                _ === 1024 && (_ = 1023),
                  (g = o * Math.pow(2, -_)),
                  n((g * 4503599627370496) >>> 0, a, c + i),
                  n(((f << 31) | ((_ + 1023) << 20) | ((g * 1048576) & 1048575)) >>> 0, a, c + s);
              }
            }
          }
          (t.writeDoubleLE = e.bind(null, pi, 0, 4)), (t.writeDoubleBE = e.bind(null, gi, 4, 0));
          function r(n, i, s, o, a) {
            var c = n(o, a + i),
              f = n(o, a + s),
              g = (f >> 31) * 2 + 1,
              _ = (f >>> 20) & 2047,
              y = 4294967296 * (f & 1048575) + c;
            return _ === 2047
              ? y
                ? NaN
                : g * (1 / 0)
              : _ === 0
              ? g * 5e-324 * y
              : g * Math.pow(2, _ - 1075) * (y + 4503599627370496);
          }
          (t.readDoubleLE = r.bind(null, mi, 0, 4)), (t.readDoubleBE = r.bind(null, _i, 4, 0));
        })(),
    t
  );
}
function pi(t, e, r) {
  (e[r] = t & 255),
    (e[r + 1] = (t >>> 8) & 255),
    (e[r + 2] = (t >>> 16) & 255),
    (e[r + 3] = t >>> 24);
}
function gi(t, e, r) {
  (e[r] = t >>> 24),
    (e[r + 1] = (t >>> 16) & 255),
    (e[r + 2] = (t >>> 8) & 255),
    (e[r + 3] = t & 255);
}
function mi(t, e) {
  return (t[e] | (t[e + 1] << 8) | (t[e + 2] << 16) | (t[e + 3] << 24)) >>> 0;
}
function _i(t, e) {
  return ((t[e] << 24) | (t[e + 1] << 16) | (t[e + 2] << 8) | t[e + 3]) >>> 0;
}
function vi(t) {
  throw new Error(
    'Could not dynamically require "' +
      t +
      '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.'
  );
}
var yf = Ef;
function Ef(t) {
  try {
    if (typeof vi != 'function') return null;
    var e = vi(t);
    return e && (e.length || Object.keys(e).length) ? e : null;
  } catch {
    return null;
  }
}
var Ps = {};
(function (t) {
  var e = t;
  (e.length = function (n) {
    for (var i = 0, s = 0, o = 0; o < n.length; ++o)
      (s = n.charCodeAt(o)),
        s < 128
          ? (i += 1)
          : s < 2048
          ? (i += 2)
          : (s & 64512) === 55296 && (n.charCodeAt(o + 1) & 64512) === 56320
          ? (++o, (i += 4))
          : (i += 3);
    return i;
  }),
    (e.read = function (n, i, s) {
      var o = s - i;
      if (o < 1) return '';
      for (var a = null, c = [], f = 0, g; i < s; )
        (g = n[i++]),
          g < 128
            ? (c[f++] = g)
            : g > 191 && g < 224
            ? (c[f++] = ((g & 31) << 6) | (n[i++] & 63))
            : g > 239 && g < 365
            ? ((g =
                (((g & 7) << 18) | ((n[i++] & 63) << 12) | ((n[i++] & 63) << 6) | (n[i++] & 63)) -
                65536),
              (c[f++] = 55296 + (g >> 10)),
              (c[f++] = 56320 + (g & 1023)))
            : (c[f++] = ((g & 15) << 12) | ((n[i++] & 63) << 6) | (n[i++] & 63)),
          f > 8191 && ((a || (a = [])).push(String.fromCharCode.apply(String, c)), (f = 0));
      return a
        ? (f && a.push(String.fromCharCode.apply(String, c.slice(0, f))), a.join(''))
        : String.fromCharCode.apply(String, c.slice(0, f));
    }),
    (e.write = function (n, i, s) {
      for (var o = s, a, c, f = 0; f < n.length; ++f)
        (a = n.charCodeAt(f)),
          a < 128
            ? (i[s++] = a)
            : a < 2048
            ? ((i[s++] = (a >> 6) | 192), (i[s++] = (a & 63) | 128))
            : (a & 64512) === 55296 && ((c = n.charCodeAt(f + 1)) & 64512) === 56320
            ? ((a = 65536 + ((a & 1023) << 10) + (c & 1023)),
              ++f,
              (i[s++] = (a >> 18) | 240),
              (i[s++] = ((a >> 12) & 63) | 128),
              (i[s++] = ((a >> 6) & 63) | 128),
              (i[s++] = (a & 63) | 128))
            : ((i[s++] = (a >> 12) | 224),
              (i[s++] = ((a >> 6) & 63) | 128),
              (i[s++] = (a & 63) | 128));
      return s - o;
    });
})(Ps);
var Sf = bf;
function bf(t, e, r) {
  var n = r || 8192,
    i = n >>> 1,
    s = null,
    o = n;
  return function (c) {
    if (c < 1 || c > i) return t(c);
    o + c > n && ((s = t(n)), (o = 0));
    var f = e.call(s, o, (o += c));
    return o & 7 && (o = (o | 7) + 1), f;
  };
}
var Ar, yi;
function wf() {
  if (yi) return Ar;
  (yi = 1), (Ar = e);
  var t = ze();
  function e(s, o) {
    (this.lo = s >>> 0), (this.hi = o >>> 0);
  }
  var r = (e.zero = new e(0, 0));
  (r.toNumber = function () {
    return 0;
  }),
    (r.zzEncode = r.zzDecode =
      function () {
        return this;
      }),
    (r.length = function () {
      return 1;
    });
  var n = (e.zeroHash = '\0\0\0\0\0\0\0\0');
  (e.fromNumber = function (o) {
    if (o === 0) return r;
    var a = o < 0;
    a && (o = -o);
    var c = o >>> 0,
      f = ((o - c) / 4294967296) >>> 0;
    return (
      a &&
        ((f = ~f >>> 0),
        (c = ~c >>> 0),
        ++c > 4294967295 && ((c = 0), ++f > 4294967295 && (f = 0))),
      new e(c, f)
    );
  }),
    (e.from = function (o) {
      if (typeof o == 'number') return e.fromNumber(o);
      if (t.isString(o))
        if (t.Long) o = t.Long.fromString(o);
        else return e.fromNumber(parseInt(o, 10));
      return o.low || o.high ? new e(o.low >>> 0, o.high >>> 0) : r;
    }),
    (e.prototype.toNumber = function (o) {
      if (!o && this.hi >>> 31) {
        var a = (~this.lo + 1) >>> 0,
          c = ~this.hi >>> 0;
        return a || (c = (c + 1) >>> 0), -(a + c * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    }),
    (e.prototype.toLong = function (o) {
      return t.Long
        ? new t.Long(this.lo | 0, this.hi | 0, !!o)
        : { low: this.lo | 0, high: this.hi | 0, unsigned: !!o };
    });
  var i = String.prototype.charCodeAt;
  return (
    (e.fromHash = function (o) {
      return o === n
        ? r
        : new e(
            (i.call(o, 0) | (i.call(o, 1) << 8) | (i.call(o, 2) << 16) | (i.call(o, 3) << 24)) >>>
              0,
            (i.call(o, 4) | (i.call(o, 5) << 8) | (i.call(o, 6) << 16) | (i.call(o, 7) << 24)) >>> 0
          );
    }),
    (e.prototype.toHash = function () {
      return String.fromCharCode(
        this.lo & 255,
        (this.lo >>> 8) & 255,
        (this.lo >>> 16) & 255,
        this.lo >>> 24,
        this.hi & 255,
        (this.hi >>> 8) & 255,
        (this.hi >>> 16) & 255,
        this.hi >>> 24
      );
    }),
    (e.prototype.zzEncode = function () {
      var o = this.hi >> 31;
      return (
        (this.hi = (((this.hi << 1) | (this.lo >>> 31)) ^ o) >>> 0),
        (this.lo = ((this.lo << 1) ^ o) >>> 0),
        this
      );
    }),
    (e.prototype.zzDecode = function () {
      var o = -(this.lo & 1);
      return (
        (this.lo = (((this.lo >>> 1) | (this.hi << 31)) ^ o) >>> 0),
        (this.hi = ((this.hi >>> 1) ^ o) >>> 0),
        this
      );
    }),
    (e.prototype.length = function () {
      var o = this.lo,
        a = ((this.lo >>> 28) | (this.hi << 4)) >>> 0,
        c = this.hi >>> 24;
      return c === 0
        ? a === 0
          ? o < 16384
            ? o < 128
              ? 1
              : 2
            : o < 2097152
            ? 3
            : 4
          : a < 16384
          ? a < 128
            ? 5
            : 6
          : a < 2097152
          ? 7
          : 8
        : c < 128
        ? 9
        : 10;
    }),
    Ar
  );
}
var Ei;
function ze() {
  return (
    Ei ||
      ((Ei = 1),
      (function (t) {
        var e = t;
        (e.asPromise = pf),
          (e.base64 = mn),
          (e.EventEmitter = _f),
          (e.float = vf),
          (e.inquire = yf),
          (e.utf8 = Ps),
          (e.pool = Sf),
          (e.LongBits = wf()),
          (e.isNode = !!(
            typeof xe < 'u' &&
            xe &&
            xe.process &&
            xe.process.versions &&
            xe.process.versions.node
          )),
          (e.global =
            (e.isNode && xe) ||
            (typeof window < 'u' && window) ||
            (typeof self < 'u' && self) ||
            xe),
          (e.emptyArray = Object.freeze ? Object.freeze([]) : []),
          (e.emptyObject = Object.freeze ? Object.freeze({}) : {}),
          (e.isInteger =
            Number.isInteger ||
            function (s) {
              return typeof s == 'number' && isFinite(s) && Math.floor(s) === s;
            }),
          (e.isString = function (s) {
            return typeof s == 'string' || s instanceof String;
          }),
          (e.isObject = function (s) {
            return s && typeof s == 'object';
          }),
          (e.isset = e.isSet =
            function (s, o) {
              var a = s[o];
              return a != null && s.hasOwnProperty(o)
                ? typeof a != 'object' || (Array.isArray(a) ? a.length : Object.keys(a).length) > 0
                : !1;
            }),
          (e.Buffer = (function () {
            try {
              var i = e.inquire('buffer').Buffer;
              return i.prototype.utf8Write ? i : null;
            } catch {
              return null;
            }
          })()),
          (e._Buffer_from = null),
          (e._Buffer_allocUnsafe = null),
          (e.newBuffer = function (s) {
            return typeof s == 'number'
              ? e.Buffer
                ? e._Buffer_allocUnsafe(s)
                : new e.Array(s)
              : e.Buffer
              ? e._Buffer_from(s)
              : typeof Uint8Array > 'u'
              ? s
              : new Uint8Array(s);
          }),
          (e.Array = typeof Uint8Array < 'u' ? Uint8Array : Array),
          (e.Long =
            (e.global.dcodeIO && e.global.dcodeIO.Long) || e.global.Long || e.inquire('long')),
          (e.key2Re = /^true|false|0|1$/),
          (e.key32Re = /^-?(?:0|[1-9][0-9]*)$/),
          (e.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/),
          (e.longToHash = function (s) {
            return s ? e.LongBits.from(s).toHash() : e.LongBits.zeroHash;
          }),
          (e.longFromHash = function (s, o) {
            var a = e.LongBits.fromHash(s);
            return e.Long ? e.Long.fromBits(a.lo, a.hi, o) : a.toNumber(!!o);
          });
        function r(i, s, o) {
          for (var a = Object.keys(s), c = 0; c < a.length; ++c)
            (i[a[c]] === void 0 || !o) && (i[a[c]] = s[a[c]]);
          return i;
        }
        (e.merge = r),
          (e.lcFirst = function (s) {
            return s.charAt(0).toLowerCase() + s.substring(1);
          });
        function n(i) {
          function s(o, a) {
            if (!(this instanceof s)) return new s(o, a);
            Object.defineProperty(this, 'message', {
              get: function () {
                return o;
              },
            }),
              Error.captureStackTrace
                ? Error.captureStackTrace(this, s)
                : Object.defineProperty(this, 'stack', { value: new Error().stack || '' }),
              a && r(this, a);
          }
          return (
            ((s.prototype = Object.create(Error.prototype)).constructor = s),
            Object.defineProperty(s.prototype, 'name', {
              get: function () {
                return i;
              },
            }),
            (s.prototype.toString = function () {
              return this.name + ': ' + this.message;
            }),
            s
          );
        }
        (e.newError = n),
          (e.ProtocolError = n('ProtocolError')),
          (e.oneOfGetter = function (s) {
            for (var o = {}, a = 0; a < s.length; ++a) o[s[a]] = 1;
            return function () {
              for (var c = Object.keys(this), f = c.length - 1; f > -1; --f)
                if (o[c[f]] === 1 && this[c[f]] !== void 0 && this[c[f]] !== null) return c[f];
            };
          }),
          (e.oneOfSetter = function (s) {
            return function (o) {
              for (var a = 0; a < s.length; ++a) s[a] !== o && delete this[s[a]];
            };
          }),
          (e.toJSONOptions = { longs: String, enums: String, bytes: String, json: !0 }),
          (e._configure = function () {
            var i = e.Buffer;
            if (!i) {
              e._Buffer_from = e._Buffer_allocUnsafe = null;
              return;
            }
            (e._Buffer_from =
              (i.from !== Uint8Array.from && i.from) ||
              function (o, a) {
                return new i(o, a);
              }),
              (e._Buffer_allocUnsafe =
                i.allocUnsafe ||
                function (o) {
                  return new i(o);
                });
          });
      })(kr)),
    kr
  );
}
var Ls = L,
  ee = ze(),
  qr,
  cr = ee.LongBits,
  Si = ee.base64,
  bi = ee.utf8;
function Tt(t, e, r) {
  (this.fn = t), (this.len = e), (this.next = void 0), (this.val = r);
}
function _n() {}
function Of(t) {
  (this.head = t.head), (this.tail = t.tail), (this.len = t.len), (this.next = t.states);
}
function L() {
  (this.len = 0), (this.head = new Tt(_n, 0, 0)), (this.tail = this.head), (this.states = null);
}
var Bs = function () {
  return ee.Buffer
    ? function () {
        return (L.create = function () {
          return new qr();
        })();
      }
    : function () {
        return new L();
      };
};
L.create = Bs();
L.alloc = function (e) {
  return new ee.Array(e);
};
ee.Array !== Array && (L.alloc = ee.pool(L.alloc, ee.Array.prototype.subarray));
L.prototype._push = function (e, r, n) {
  return (this.tail = this.tail.next = new Tt(e, r, n)), (this.len += r), this;
};
function vn(t, e, r) {
  e[r] = t & 255;
}
function xf(t, e, r) {
  for (; t > 127; ) (e[r++] = (t & 127) | 128), (t >>>= 7);
  e[r] = t;
}
function yn(t, e) {
  (this.len = t), (this.next = void 0), (this.val = e);
}
yn.prototype = Object.create(Tt.prototype);
yn.prototype.fn = xf;
L.prototype.uint32 = function (e) {
  return (
    (this.len += (this.tail = this.tail.next =
      new yn(
        (e = e >>> 0) < 128 ? 1 : e < 16384 ? 2 : e < 2097152 ? 3 : e < 268435456 ? 4 : 5,
        e
      )).len),
    this
  );
};
L.prototype.int32 = function (e) {
  return e < 0 ? this._push(En, 10, cr.fromNumber(e)) : this.uint32(e);
};
L.prototype.sint32 = function (e) {
  return this.uint32(((e << 1) ^ (e >> 31)) >>> 0);
};
function En(t, e, r) {
  for (; t.hi; )
    (e[r++] = (t.lo & 127) | 128), (t.lo = ((t.lo >>> 7) | (t.hi << 25)) >>> 0), (t.hi >>>= 7);
  for (; t.lo > 127; ) (e[r++] = (t.lo & 127) | 128), (t.lo = t.lo >>> 7);
  e[r++] = t.lo;
}
L.prototype.uint64 = function (e) {
  var r = cr.from(e);
  return this._push(En, r.length(), r);
};
L.prototype.int64 = L.prototype.uint64;
L.prototype.sint64 = function (e) {
  var r = cr.from(e).zzEncode();
  return this._push(En, r.length(), r);
};
L.prototype.bool = function (e) {
  return this._push(vn, 1, e ? 1 : 0);
};
function Yr(t, e, r) {
  (e[r] = t & 255),
    (e[r + 1] = (t >>> 8) & 255),
    (e[r + 2] = (t >>> 16) & 255),
    (e[r + 3] = t >>> 24);
}
L.prototype.fixed32 = function (e) {
  return this._push(Yr, 4, e >>> 0);
};
L.prototype.sfixed32 = L.prototype.fixed32;
L.prototype.fixed64 = function (e) {
  var r = cr.from(e);
  return this._push(Yr, 4, r.lo)._push(Yr, 4, r.hi);
};
L.prototype.sfixed64 = L.prototype.fixed64;
L.prototype.float = function (e) {
  return this._push(ee.float.writeFloatLE, 4, e);
};
L.prototype.double = function (e) {
  return this._push(ee.float.writeDoubleLE, 8, e);
};
var Tf = ee.Array.prototype.set
  ? function (e, r, n) {
      r.set(e, n);
    }
  : function (e, r, n) {
      for (var i = 0; i < e.length; ++i) r[n + i] = e[i];
    };
L.prototype.bytes = function (e) {
  var r = e.length >>> 0;
  if (!r) return this._push(vn, 1, 0);
  if (ee.isString(e)) {
    var n = L.alloc((r = Si.length(e)));
    Si.decode(e, n, 0), (e = n);
  }
  return this.uint32(r)._push(Tf, r, e);
};
L.prototype.string = function (e) {
  var r = bi.length(e);
  return r ? this.uint32(r)._push(bi.write, r, e) : this._push(vn, 1, 0);
};
L.prototype.fork = function () {
  return (
    (this.states = new Of(this)), (this.head = this.tail = new Tt(_n, 0, 0)), (this.len = 0), this
  );
};
L.prototype.reset = function () {
  return (
    this.states
      ? ((this.head = this.states.head),
        (this.tail = this.states.tail),
        (this.len = this.states.len),
        (this.states = this.states.next))
      : ((this.head = this.tail = new Tt(_n, 0, 0)), (this.len = 0)),
    this
  );
};
L.prototype.ldelim = function () {
  var e = this.head,
    r = this.tail,
    n = this.len;
  return (
    this.reset().uint32(n), n && ((this.tail.next = e.next), (this.tail = r), (this.len += n)), this
  );
};
L.prototype.finish = function () {
  for (var e = this.head.next, r = this.constructor.alloc(this.len), n = 0; e; )
    e.fn(e.val, r, n), (n += e.len), (e = e.next);
  return r;
};
L._configure = function (t) {
  (qr = t), (L.create = Bs()), qr._configure();
};
var kf = ue,
  Cs = Ls;
(ue.prototype = Object.create(Cs.prototype)).constructor = ue;
var De = ze();
function ue() {
  Cs.call(this);
}
ue._configure = function () {
  (ue.alloc = De._Buffer_allocUnsafe),
    (ue.writeBytesBuffer =
      De.Buffer &&
      De.Buffer.prototype instanceof Uint8Array &&
      De.Buffer.prototype.set.name === 'set'
        ? function (e, r, n) {
            r.set(e, n);
          }
        : function (e, r, n) {
            if (e.copy) e.copy(r, n, 0, e.length);
            else for (var i = 0; i < e.length; ) r[n++] = e[i++];
          });
};
ue.prototype.bytes = function (e) {
  De.isString(e) && (e = De._Buffer_from(e, 'base64'));
  var r = e.length >>> 0;
  return this.uint32(r), r && this._push(ue.writeBytesBuffer, r, e), this;
};
function Af(t, e, r) {
  t.length < 40 ? De.utf8.write(t, e, r) : e.utf8Write ? e.utf8Write(t, r) : e.write(t, r);
}
ue.prototype.string = function (e) {
  var r = De.Buffer.byteLength(e);
  return this.uint32(r), r && this._push(Af, r, e), this;
};
ue._configure();
var Us = H,
  le = ze(),
  zr,
  Ms = le.LongBits,
  Df = le.utf8;
function oe(t, e) {
  return RangeError('index out of range: ' + t.pos + ' + ' + (e || 1) + ' > ' + t.len);
}
function H(t) {
  (this.buf = t), (this.pos = 0), (this.len = t.length);
}
var wi =
    typeof Uint8Array < 'u'
      ? function (e) {
          if (e instanceof Uint8Array || Array.isArray(e)) return new H(e);
          throw Error('illegal buffer');
        }
      : function (e) {
          if (Array.isArray(e)) return new H(e);
          throw Error('illegal buffer');
        },
  Fs = function () {
    return le.Buffer
      ? function (r) {
          return (H.create = function (i) {
            return le.Buffer.isBuffer(i) ? new zr(i) : wi(i);
          })(r);
        }
      : wi;
  };
H.create = Fs();
H.prototype._slice = le.Array.prototype.subarray || le.Array.prototype.slice;
H.prototype.uint32 = (function () {
  var e = 4294967295;
  return function () {
    if (
      ((e = (this.buf[this.pos] & 127) >>> 0),
      this.buf[this.pos++] < 128 ||
        ((e = (e | ((this.buf[this.pos] & 127) << 7)) >>> 0), this.buf[this.pos++] < 128) ||
        ((e = (e | ((this.buf[this.pos] & 127) << 14)) >>> 0), this.buf[this.pos++] < 128) ||
        ((e = (e | ((this.buf[this.pos] & 127) << 21)) >>> 0), this.buf[this.pos++] < 128) ||
        ((e = (e | ((this.buf[this.pos] & 15) << 28)) >>> 0), this.buf[this.pos++] < 128))
    )
      return e;
    if ((this.pos += 5) > this.len) throw ((this.pos = this.len), oe(this, 10));
    return e;
  };
})();
H.prototype.int32 = function () {
  return this.uint32() | 0;
};
H.prototype.sint32 = function () {
  var e = this.uint32();
  return ((e >>> 1) ^ -(e & 1)) | 0;
};
function Dr() {
  var t = new Ms(0, 0),
    e = 0;
  if (this.len - this.pos > 4) {
    for (; e < 4; ++e)
      if (
        ((t.lo = (t.lo | ((this.buf[this.pos] & 127) << (e * 7))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return t;
    if (
      ((t.lo = (t.lo | ((this.buf[this.pos] & 127) << 28)) >>> 0),
      (t.hi = (t.hi | ((this.buf[this.pos] & 127) >> 4)) >>> 0),
      this.buf[this.pos++] < 128)
    )
      return t;
    e = 0;
  } else {
    for (; e < 3; ++e) {
      if (this.pos >= this.len) throw oe(this);
      if (
        ((t.lo = (t.lo | ((this.buf[this.pos] & 127) << (e * 7))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return t;
    }
    return (t.lo = (t.lo | ((this.buf[this.pos++] & 127) << (e * 7))) >>> 0), t;
  }
  if (this.len - this.pos > 4) {
    for (; e < 5; ++e)
      if (
        ((t.hi = (t.hi | ((this.buf[this.pos] & 127) << (e * 7 + 3))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return t;
  } else
    for (; e < 5; ++e) {
      if (this.pos >= this.len) throw oe(this);
      if (
        ((t.hi = (t.hi | ((this.buf[this.pos] & 127) << (e * 7 + 3))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return t;
    }
  throw Error('invalid varint encoding');
}
H.prototype.bool = function () {
  return this.uint32() !== 0;
};
function Qt(t, e) {
  return (t[e - 4] | (t[e - 3] << 8) | (t[e - 2] << 16) | (t[e - 1] << 24)) >>> 0;
}
H.prototype.fixed32 = function () {
  if (this.pos + 4 > this.len) throw oe(this, 4);
  return Qt(this.buf, (this.pos += 4));
};
H.prototype.sfixed32 = function () {
  if (this.pos + 4 > this.len) throw oe(this, 4);
  return Qt(this.buf, (this.pos += 4)) | 0;
};
function Oi() {
  if (this.pos + 8 > this.len) throw oe(this, 8);
  return new Ms(Qt(this.buf, (this.pos += 4)), Qt(this.buf, (this.pos += 4)));
}
H.prototype.float = function () {
  if (this.pos + 4 > this.len) throw oe(this, 4);
  var e = le.float.readFloatLE(this.buf, this.pos);
  return (this.pos += 4), e;
};
H.prototype.double = function () {
  if (this.pos + 8 > this.len) throw oe(this, 4);
  var e = le.float.readDoubleLE(this.buf, this.pos);
  return (this.pos += 8), e;
};
H.prototype.bytes = function () {
  var e = this.uint32(),
    r = this.pos,
    n = this.pos + e;
  if (n > this.len) throw oe(this, e);
  return (
    (this.pos += e),
    Array.isArray(this.buf)
      ? this.buf.slice(r, n)
      : r === n
      ? new this.buf.constructor(0)
      : this._slice.call(this.buf, r, n)
  );
};
H.prototype.string = function () {
  var e = this.bytes();
  return Df.read(e, 0, e.length);
};
H.prototype.skip = function (e) {
  if (typeof e == 'number') {
    if (this.pos + e > this.len) throw oe(this, e);
    this.pos += e;
  } else
    do if (this.pos >= this.len) throw oe(this);
    while (this.buf[this.pos++] & 128);
  return this;
};
H.prototype.skipType = function (t) {
  switch (t) {
    case 0:
      this.skip();
      break;
    case 1:
      this.skip(8);
      break;
    case 2:
      this.skip(this.uint32());
      break;
    case 3:
      for (; (t = this.uint32() & 7) !== 4; ) this.skipType(t);
      break;
    case 5:
      this.skip(4);
      break;
    default:
      throw Error('invalid wire type ' + t + ' at offset ' + this.pos);
  }
  return this;
};
H._configure = function (t) {
  (zr = t), (H.create = Fs()), zr._configure();
  var e = le.Long ? 'toLong' : 'toNumber';
  le.merge(H.prototype, {
    int64: function () {
      return Dr.call(this)[e](!1);
    },
    uint64: function () {
      return Dr.call(this)[e](!0);
    },
    sint64: function () {
      return Dr.call(this).zzDecode()[e](!1);
    },
    fixed64: function () {
      return Oi.call(this)[e](!0);
    },
    sfixed64: function () {
      return Oi.call(this)[e](!1);
    },
  });
};
var Rf = qe,
  Gs = Us;
(qe.prototype = Object.create(Gs.prototype)).constructor = qe;
var xi = ze();
function qe(t) {
  Gs.call(this, t);
}
qe._configure = function () {
  xi.Buffer && (qe.prototype._slice = xi.Buffer.prototype.slice);
};
qe.prototype.string = function () {
  var e = this.uint32();
  return this.buf.utf8Slice
    ? this.buf.utf8Slice(this.pos, (this.pos = Math.min(this.pos + e, this.len)))
    : this.buf.toString('utf-8', this.pos, (this.pos = Math.min(this.pos + e, this.len)));
};
qe._configure();
var js = {},
  If = Ot,
  Sn = ze();
(Ot.prototype = Object.create(Sn.EventEmitter.prototype)).constructor = Ot;
function Ot(t, e, r) {
  if (typeof t != 'function') throw TypeError('rpcImpl must be a function');
  Sn.EventEmitter.call(this),
    (this.rpcImpl = t),
    (this.requestDelimited = !!e),
    (this.responseDelimited = !!r);
}
Ot.prototype.rpcCall = function t(e, r, n, i, s) {
  if (!i) throw TypeError('request must be specified');
  var o = this;
  if (!s) return Sn.asPromise(t, o, e, r, n, i);
  if (!o.rpcImpl) {
    setTimeout(function () {
      s(Error('already ended'));
    }, 0);
    return;
  }
  try {
    return o.rpcImpl(
      e,
      r[o.requestDelimited ? 'encodeDelimited' : 'encode'](i).finish(),
      function (c, f) {
        if (c) return o.emit('error', c, e), s(c);
        if (f === null) {
          o.end(!0);
          return;
        }
        if (!(f instanceof n))
          try {
            f = n[o.responseDelimited ? 'decodeDelimited' : 'decode'](f);
          } catch (g) {
            return o.emit('error', g, e), s(g);
          }
        return o.emit('data', f, e), s(null, f);
      }
    );
  } catch (a) {
    o.emit('error', a, e),
      setTimeout(function () {
        s(a);
      }, 0);
    return;
  }
};
Ot.prototype.end = function (e) {
  return (
    this.rpcImpl &&
      (e || this.rpcImpl(null, null, null), (this.rpcImpl = null), this.emit('end').off()),
    this
  );
};
(function (t) {
  var e = t;
  e.Service = If;
})(js);
var Nf = {};
(function (t) {
  var e = t;
  (e.build = 'minimal'),
    (e.Writer = Ls),
    (e.BufferWriter = kf),
    (e.Reader = Us),
    (e.BufferReader = Rf),
    (e.util = ze()),
    (e.rpc = js),
    (e.roots = Nf),
    (e.configure = r);
  function r() {
    e.util._configure(), e.Writer._configure(e.BufferWriter), e.Reader._configure(e.BufferReader);
  }
  r();
})(Ns);
var Ye = Ns;
const Oe = Ye.Reader,
  Ti = Ye.Writer,
  pe = Ye.util,
  Z = Ye.roots.logproto || (Ye.roots.logproto = {}),
  Pf = (Z.logproto = (() => {
    const t = {};
    return (
      (t.Log = (function () {
        function e(r) {
          if (((this.events = []), r))
            for (let n = Object.keys(r), i = 0; i < n.length; ++i)
              r[n[i]] != null && (this[n[i]] = r[n[i]]);
        }
        return (
          (e.prototype.events = pe.emptyArray),
          (e.create = function (n) {
            return new e(n);
          }),
          (e.encode = function (n, i) {
            if ((i || (i = Ti.create()), n.events != null && n.events.length))
              for (let s = 0; s < n.events.length; ++s)
                Z.logproto.Log.Event.encode(n.events[s], i.uint32(10).fork()).ldelim();
            return i;
          }),
          (e.encodeDelimited = function (n, i) {
            return this.encode(n, i).ldelim();
          }),
          (e.decode = function (n, i) {
            n instanceof Oe || (n = Oe.create(n));
            let s = i === void 0 ? n.len : n.pos + i,
              o = new Z.logproto.Log();
            for (; n.pos < s; ) {
              let a = n.uint32();
              switch (a >>> 3) {
                case 1:
                  (o.events && o.events.length) || (o.events = []),
                    o.events.push(Z.logproto.Log.Event.decode(n, n.uint32()));
                  break;
                default:
                  n.skipType(a & 7);
                  break;
              }
            }
            return o;
          }),
          (e.decodeDelimited = function (n) {
            return n instanceof Oe || (n = new Oe(n)), this.decode(n, n.uint32());
          }),
          (e.verify = function (n) {
            if (typeof n != 'object' || n === null) return 'object expected';
            if (n.events != null && n.hasOwnProperty('events')) {
              if (!Array.isArray(n.events)) return 'events: array expected';
              for (let i = 0; i < n.events.length; ++i) {
                let s = Z.logproto.Log.Event.verify(n.events[i]);
                if (s) return 'events.' + s;
              }
            }
            return null;
          }),
          (e.fromObject = function (n) {
            if (n instanceof Z.logproto.Log) return n;
            let i = new Z.logproto.Log();
            if (n.events) {
              if (!Array.isArray(n.events)) throw TypeError('.logproto.Log.events: array expected');
              i.events = [];
              for (let s = 0; s < n.events.length; ++s) {
                if (typeof n.events[s] != 'object')
                  throw TypeError('.logproto.Log.events: object expected');
                i.events[s] = Z.logproto.Log.Event.fromObject(n.events[s]);
              }
            }
            return i;
          }),
          (e.toObject = function (n, i) {
            i || (i = {});
            let s = {};
            if (((i.arrays || i.defaults) && (s.events = []), n.events && n.events.length)) {
              s.events = [];
              for (let o = 0; o < n.events.length; ++o)
                s.events[o] = Z.logproto.Log.Event.toObject(n.events[o], i);
            }
            return s;
          }),
          (e.prototype.toJSON = function () {
            return this.constructor.toObject(this, Ye.util.toJSONOptions);
          }),
          (e.Event = (function () {
            function r(n) {
              if (n)
                for (let i = Object.keys(n), s = 0; s < i.length; ++s)
                  n[i[s]] != null && (this[i[s]] = n[i[s]]);
            }
            return (
              (r.prototype.event = ''),
              (r.prototype.timestamp = 0),
              (r.prototype.data = ''),
              (r.prototype.groupId = ''),
              (r.prototype.snippetId = ''),
              (r.prototype.location = ''),
              (r.create = function (i) {
                return new r(i);
              }),
              (r.encode = function (i, s) {
                return (
                  s || (s = Ti.create()),
                  s.uint32(10).string(i.event),
                  s.uint32(21).fixed32(i.timestamp),
                  i.data != null &&
                    Object.hasOwnProperty.call(i, 'data') &&
                    s.uint32(26).string(i.data),
                  i.groupId != null &&
                    Object.hasOwnProperty.call(i, 'groupId') &&
                    s.uint32(34).string(i.groupId),
                  i.snippetId != null &&
                    Object.hasOwnProperty.call(i, 'snippetId') &&
                    s.uint32(42).string(i.snippetId),
                  i.location != null &&
                    Object.hasOwnProperty.call(i, 'location') &&
                    s.uint32(50).string(i.location),
                  s
                );
              }),
              (r.encodeDelimited = function (i, s) {
                return this.encode(i, s).ldelim();
              }),
              (r.decode = function (i, s) {
                i instanceof Oe || (i = Oe.create(i));
                let o = s === void 0 ? i.len : i.pos + s,
                  a = new Z.logproto.Log.Event();
                for (; i.pos < o; ) {
                  let c = i.uint32();
                  switch (c >>> 3) {
                    case 1:
                      a.event = i.string();
                      break;
                    case 2:
                      a.timestamp = i.fixed32();
                      break;
                    case 3:
                      a.data = i.string();
                      break;
                    case 4:
                      a.groupId = i.string();
                      break;
                    case 5:
                      a.snippetId = i.string();
                      break;
                    case 6:
                      a.location = i.string();
                      break;
                    default:
                      i.skipType(c & 7);
                      break;
                  }
                }
                if (!a.hasOwnProperty('event'))
                  throw pe.ProtocolError("missing required 'event'", { instance: a });
                if (!a.hasOwnProperty('timestamp'))
                  throw pe.ProtocolError("missing required 'timestamp'", { instance: a });
                return a;
              }),
              (r.decodeDelimited = function (i) {
                return i instanceof Oe || (i = new Oe(i)), this.decode(i, i.uint32());
              }),
              (r.verify = function (i) {
                return typeof i != 'object' || i === null
                  ? 'object expected'
                  : pe.isString(i.event)
                  ? pe.isInteger(i.timestamp)
                    ? i.data != null && i.hasOwnProperty('data') && !pe.isString(i.data)
                      ? 'data: string expected'
                      : i.groupId != null && i.hasOwnProperty('groupId') && !pe.isString(i.groupId)
                      ? 'groupId: string expected'
                      : i.snippetId != null &&
                        i.hasOwnProperty('snippetId') &&
                        !pe.isString(i.snippetId)
                      ? 'snippetId: string expected'
                      : i.location != null &&
                        i.hasOwnProperty('location') &&
                        !pe.isString(i.location)
                      ? 'location: string expected'
                      : null
                    : 'timestamp: integer expected'
                  : 'event: string expected';
              }),
              (r.fromObject = function (i) {
                if (i instanceof Z.logproto.Log.Event) return i;
                let s = new Z.logproto.Log.Event();
                return (
                  i.event != null && (s.event = String(i.event)),
                  i.timestamp != null && (s.timestamp = i.timestamp >>> 0),
                  i.data != null && (s.data = String(i.data)),
                  i.groupId != null && (s.groupId = String(i.groupId)),
                  i.snippetId != null && (s.snippetId = String(i.snippetId)),
                  i.location != null && (s.location = String(i.location)),
                  s
                );
              }),
              (r.toObject = function (i, s) {
                s || (s = {});
                let o = {};
                return (
                  s.defaults &&
                    ((o.event = ''),
                    (o.timestamp = 0),
                    (o.data = ''),
                    (o.groupId = ''),
                    (o.snippetId = ''),
                    (o.location = '')),
                  i.event != null && i.hasOwnProperty('event') && (o.event = i.event),
                  i.timestamp != null &&
                    i.hasOwnProperty('timestamp') &&
                    (o.timestamp = i.timestamp),
                  i.data != null && i.hasOwnProperty('data') && (o.data = i.data),
                  i.groupId != null && i.hasOwnProperty('groupId') && (o.groupId = i.groupId),
                  i.snippetId != null &&
                    i.hasOwnProperty('snippetId') &&
                    (o.snippetId = i.snippetId),
                  i.location != null && i.hasOwnProperty('location') && (o.location = i.location),
                  o
                );
              }),
              (r.prototype.toJSON = function () {
                return this.constructor.toObject(this, Ye.util.toJSONOptions);
              }),
              r
            );
          })()),
          e
        );
      })()),
      t
    );
  })()),
  ki = Pf.Log;
function Lf(t) {
  let e = ki.encode(ki.create({ events: t })).finish();
  return [e.length, mf.encode(e, 0, e.length)];
}
var $s = { exports: {} };
(function (t, e) {
  (function (n, i) {
    t.exports = i();
  })(xe, function () {
    return (() => {
      var r = {
          837: (s, o, a) => {
            a.r(o),
              a.d(o, {
                Assignment: () => xa,
                Experiment: () => Ta,
                ExperimentSetup: () => ka,
                Interpreter: () => Aa,
                Namespace: () => Ra,
                Ops: () => Da,
              });
            var c = {};
            a.r(c), a.d(c, { getExperimentInputs: () => Nn, registerExperimentInput: () => ao });
            var f = {};
            a.r(f),
              a.d(f, {
                PlanOutOp: () => Q,
                PlanOutOpBinary: () => ve,
                PlanOutOpCommutative: () => ft,
                PlanOutOpSimple: () => Be,
                PlanOutOpUnary: () => Ce,
              });
            var g = {};
            a.r(g),
              a.d(g, {
                StopPlanOutException: () => Cn,
                initializeOperators: () => Pn,
                isOperator: () => Bn,
                operatorInstance: () => vo,
                registerOperators: () => Ln,
              });
            var _ = {};
            a.r(_),
              a.d(_, {
                And: () => No,
                Arr: () => Ao,
                Coalesce: () => Do,
                Cond: () => Io,
                Divide: () => $o,
                Equals: () => Co,
                Exp: () => Wo,
                Get: () => Oo,
                GreaterThan: () => Uo,
                GreaterThanOrEqualTo: () => Go,
                Index: () => Ro,
                Length: () => Xo,
                LessThan: () => Mo,
                LessThanOrEqualTo: () => Fo,
                Literal: () => wo,
                Map: () => Ko,
                Max: () => Jo,
                Min: () => Vo,
                Mod: () => jo,
                Negative: () => zo,
                Not: () => Yo,
                Or: () => Po,
                Product: () => Lo,
                Return: () => To,
                Round: () => Ho,
                Seq: () => xo,
                Set: () => ko,
                Sqrt: () => qo,
                Sum: () => Bo,
              });
            var y = {};
            a.r(y),
              a.d(y, {
                BernoulliFilter: () => Sa,
                BernoulliTrial: () => ba,
                PlanOutOpRandom: () => we,
                RandomFloat: () => Oa,
                RandomInteger: () => wa,
                Sample: () => va,
                UniformChoice: () => Ea,
                WeightedChoice: () => ya,
              });
            function E(h) {
              '@babel/helpers - typeof';
              return (
                typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
                  ? (E = function (u) {
                      return typeof u;
                    })
                  : (E = function (u) {
                      return u &&
                        typeof Symbol == 'function' &&
                        u.constructor === Symbol &&
                        u !== Symbol.prototype
                        ? 'symbol'
                        : typeof u;
                    }),
                E(h)
              );
            }
            var O = function (l) {
                return l.replace(/^\s+|\s+$/g, '');
              },
              R = function (l) {
                var u = typeof location < 'u',
                  p = typeof window < 'u',
                  d;
                if (u) {
                  l = l.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                  var m = new RegExp('[\\?&]' + l + '=([^&#]*)'),
                    v = m.exec(location.search);
                  d = v === null ? '' : decodeURIComponent(v[1].replace(/\+/g, ' '));
                } else d = '';
                return (d == null || d.length === 0) &&
                  p &&
                  window.localStorage !== void 0 &&
                  window.localStorage !== null
                  ? window.localStorage.getItem(l)
                  : d;
              },
              P = function h(l) {
                var u = l;
                if (l && E(l) === 'object') {
                  u = Object.prototype.toString.call(l) === '[object Array]' ? [] : {};
                  for (var p in l) u[p] = h(l[p]);
                }
                return u;
              },
              N = function (l) {
                var u = E(l);
                return u === 'function' || (u === 'object' && !!l);
              },
              w = function (l) {
                return Array.isArray
                  ? Array.isArray(l)
                  : Object.prototype.toString.call(l) === '[object Array]';
              },
              A = function (l) {
                return typeof l == 'function' || !1;
              },
              T = function (l) {
                if (!N(l)) return [];
                if (Object.keys) return Object.keys(l);
                var u = [];
                for (var p in l) xn(l, p) && u.push(p);
                return Tn && An(l, u), u;
              },
              F = function (l) {
                if (!N(l)) return [];
                var u = [];
                for (var p in l) u.push(p);
                return Tn && An(l, u), u;
              },
              $ = function (l, u) {
                return function (p) {
                  var d = arguments.length;
                  if (d < 2 || p == null) return p;
                  for (var m = 1; m < d; m++)
                    for (var v = arguments[m], S = l(v), x = S.length, k = 0; k < x; k++) {
                      var b = S[k];
                      p[b] = v[b];
                    }
                  return p;
                };
              },
              q = $(F),
              ce = $(T),
              fe = function (l) {
                return l;
              },
              me = function (l, u) {
                var p = p(u),
                  d = p.length;
                if (l == null) return !d;
                for (var m = Object(l), v = 0; v < d; v++) {
                  var S = p[v];
                  if (u[S] !== m[S] || !(S in m)) return !1;
                }
                return !0;
              },
              _e = function (l) {
                return (
                  (l = ce({}, l)),
                  function (u) {
                    return me(u, l);
                  }
                );
              },
              z = function (l, u, p) {
                return l == null ? fe : A(l) ? Ve(l) : N(l) ? _e(l) : On(l);
              },
              Ve = function (l, u, p) {
                return l;
              },
              de = function (l, u, p) {
                u = Ve(u);
                var d, m;
                if (At(l)) for (d = 0, m = l.length; d < m; d++) u(l[d], d, l);
                else {
                  var v = T(l);
                  for (d = 0, m = v.length; d < m; d++) u(l[v[d]], v[d], l);
                }
                return l;
              },
              fr = function (l, u, p) {
                u = z(u);
                for (var d = !At(l) && T(l), m = (d || l).length, v = Array(m), S = 0; S < m; S++) {
                  var x = d ? d[S] : S;
                  v[S] = u(l[x], x, l);
                }
                return v;
              },
              kt = function (l, u, p, d) {
                u = Ve(u);
                var m = !At(l) && T(l),
                  v = (m || l).length,
                  S = 0;
                for (
                  arguments.length < 3 && ((p = l[m ? m[S] : S]), (S += 1));
                  S >= 0 && S < v;
                  S++
                ) {
                  var x = m ? m[S] : S;
                  p = u(p, l[x], x, l);
                }
                return p;
              },
              Le = function (l) {
                return N(l) ? (w(l) ? l.slice() : q({}, l)) : l;
              },
              On = function (l) {
                return function (u) {
                  return u?.[l];
                };
              },
              Vs = Math.pow(2, 53) - 1,
              Js = On('length'),
              At = function (l) {
                var u = Js(l);
                return typeof u == 'number' && u >= 0 && u <= Vs;
              },
              xn = function (l, u) {
                return l != null && Object.prototype.hasOwnProperty.call(l, u);
              },
              Tn = !{ toString: null }.propertyIsEnumerable('toString'),
              kn = [
                'valueOf',
                'isPrototypeOf',
                'toString',
                'propertyIsEnumerable',
                'hasOwnProperty',
                'toLocaleString',
              ];
            function An(h, l) {
              var u = kn.length,
                p = h.constructor,
                d = (A(p) && p.prototype) || Object.Prototype,
                m = 'constructor';
              for (xn(h, m) && !Dn(l, m) && l.push(m); u--; )
                (m = kn[u]), m in h && h[m] !== d[m] && !Dn(l, m) && l.push(m);
            }
            var Dn = function (l, u, p, d) {
                return At(l) || (l = Xs(l)), l.indexOf(u) >= 0;
              },
              Xs = function (l) {
                for (var u = T(l), p = u.length, d = Array(p), m = 0; m < p; m++) d[m] = l[u[m]];
                return d;
              },
              Ks = function (l) {
                for (var u = [], p = 0; p < l; p++) u.push(p);
                return u;
              },
              Dt = function (l, u) {
                return typeof l[u] < 'u';
              };
            function Qs(h, l) {
              if (!(h instanceof l)) throw new TypeError('Cannot call a class as a function');
            }
            function Zs(h, l) {
              for (var u = 0; u < l.length; u++) {
                var p = l[u];
                (p.enumerable = p.enumerable || !1),
                  (p.configurable = !0),
                  'value' in p && (p.writable = !0),
                  Object.defineProperty(h, p.key, p);
              }
            }
            function eo(h, l, u) {
              return l && Zs(h.prototype, l), h;
            }
            function to(h) {
              var l = (function () {
                function u(p, d) {
                  Qs(this, u),
                    d || (d = {}),
                    (this.experimentSalt = p),
                    (this._overrides = Le(d)),
                    (this._data = Le(d)),
                    (this.saltSeparator = '.');
                }
                return (
                  eo(u, [
                    {
                      key: 'evaluate',
                      value: function (d) {
                        return d;
                      },
                    },
                    {
                      key: 'getOverrides',
                      value: function () {
                        return this._overrides;
                      },
                    },
                    {
                      key: 'addOverride',
                      value: function (d, m) {
                        (this._overrides[d] = m), (this._data[d] = m);
                      },
                    },
                    {
                      key: 'setOverrides',
                      value: function (d) {
                        this._overrides = Le(d);
                        var m = this;
                        de(Object.keys(this._overrides), function (v) {
                          m._data[v] = m._overrides[v];
                        });
                      },
                    },
                    {
                      key: 'set',
                      value: function (d, m) {
                        if (d === '_data') {
                          this._data = m;
                          return;
                        } else if (d === '_overrides') {
                          this._overrides = m;
                          return;
                        } else if (d === 'experimentSalt') {
                          this.experimentSalt = m;
                          return;
                        } else if (d === 'saltSeparator') {
                          this.saltSeparator = m;
                          return;
                        }
                        Dt(this._overrides, d) ||
                          (m instanceof h.PlanOutOpRandom
                            ? (m.args.salt || (m.args.salt = d), (this._data[d] = m.execute(this)))
                            : (this._data[d] = m));
                      },
                    },
                    {
                      key: 'get',
                      value: function (d, m) {
                        if (d === '_data') return this._data;
                        if (d === '_overrides') return this._overrides;
                        if (d === 'experimentSalt') return this.experimentSalt;
                        if (d === 'saltSeparator') return this.saltSeparator;
                        var v = this._data[d];
                        return v ?? m;
                      },
                    },
                    {
                      key: 'getParams',
                      value: function () {
                        return this._data;
                      },
                    },
                    {
                      key: 'del',
                      value: function (d) {
                        delete this._data[d];
                      },
                    },
                    {
                      key: 'toString',
                      value: function () {
                        return String(this._data);
                      },
                    },
                    {
                      key: 'length',
                      value: function () {
                        return Object.keys(this._data).length;
                      },
                    },
                  ]),
                  u
                );
              })();
              return l;
            }
            function ro(h, l) {
              if (!(h instanceof l)) throw new TypeError('Cannot call a class as a function');
            }
            function no(h, l) {
              for (var u = 0; u < l.length; u++) {
                var p = l[u];
                (p.enumerable = p.enumerable || !1),
                  (p.configurable = !0),
                  'value' in p && (p.writable = !0),
                  Object.defineProperty(h, p.key, p);
              }
            }
            function io(h, l, u) {
              return l && no(h.prototype, l), h;
            }
            function so(h) {
              var l = (function () {
                function u(p) {
                  if (
                    (ro(this, u),
                    (this.inputs = p),
                    (this._exposureLogged = !1),
                    (this._salt = null),
                    (this._inExperiment = !0),
                    (this._autoExposureLog = !0),
                    this.setup(),
                    !this.name)
                  )
                    throw 'setup() must set an experiment name via this.setName()';
                  (this._assignment = new h(this.getSalt())), (this._assigned = !1);
                }
                return (
                  io(u, [
                    {
                      key: 'getDefaultParamNames',
                      value: function () {
                        var d = this.assign.toString(),
                          m = d.split('.set(');
                        return (
                          m.splice(0, 1),
                          fr(m, function (v) {
                            var S = O(v.split(',')[0]);
                            return S.substr(1, S.length - 2);
                          })
                        );
                      },
                    },
                    {
                      key: 'requireAssignment',
                      value: function () {
                        this._assigned || this._assign();
                      },
                    },
                    {
                      key: 'requireExposureLogging',
                      value: function (d) {
                        this.shouldLogExposure(d) && this.logExposure();
                      },
                    },
                    {
                      key: '_assign',
                      value: function () {
                        this.configureLogger();
                        var d = this.assign(this._assignment, this.inputs);
                        d || d === void 0 ? (this._inExperiment = !0) : (this._inExperiment = !1),
                          (this._assigned = !0);
                      },
                    },
                    {
                      key: 'setup',
                      value: function () {
                        throw 'IMPLEMENT setup';
                      },
                    },
                    {
                      key: 'inExperiment',
                      value: function () {
                        return this._inExperiment;
                      },
                    },
                    {
                      key: 'addOverride',
                      value: function (d, m) {
                        this._assignment.addOverride(d, m);
                      },
                    },
                    {
                      key: 'setOverrides',
                      value: function (d) {
                        this._assignment.setOverrides(d);
                        var m = this._assignment.getOverrides(),
                          v = this;
                        de(Object.keys(m), function (S) {
                          v.inputs[S] !== void 0 && (v.inputs[S] = m[S]);
                        });
                      },
                    },
                    {
                      key: 'setLocalOverride',
                      value: function (d) {
                        var m = R('experimentOverride'),
                          v = R(d);
                        m === this.name && v && this.addOverride(d, v);
                      },
                    },
                    {
                      key: 'getSalt',
                      value: function () {
                        return this._salt ? this._salt : this.name;
                      },
                    },
                    {
                      key: 'setSalt',
                      value: function (d) {
                        (this._salt = d), this._assignment && (this._assignment.experimentSalt = d);
                      },
                    },
                    {
                      key: 'getName',
                      value: function () {
                        return this.name;
                      },
                    },
                    {
                      key: 'assign',
                      value: function (d, m) {
                        throw 'IMPLEMENT assign';
                      },
                    },
                    {
                      key: 'getParamNames',
                      value: function () {
                        throw 'IMPLEMENT getParamNames';
                      },
                    },
                    {
                      key: 'shouldFetchExperimentParameter',
                      value: function (d) {
                        var m = this.getParamNames();
                        return m.indexOf(d) >= 0;
                      },
                    },
                    {
                      key: 'setName',
                      value: function (d) {
                        var m = /\s+/g;
                        (this.name = d.replace(m, '-')),
                          this._assignment && (this._assignment.experimentSalt = this.getSalt());
                      },
                    },
                    {
                      key: '__asBlob',
                      value: function () {
                        var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
                          m = {
                            name: this.getName(),
                            time: new Date().getTime() / 1e3,
                            salt: this.getSalt(),
                            inputs: this.inputs,
                            params: this._assignment.getParams(),
                          };
                        return q(m, d), m;
                      },
                    },
                    {
                      key: 'setAutoExposureLogging',
                      value: function (d) {
                        this._autoExposureLog = d;
                      },
                    },
                    {
                      key: 'getParams',
                      value: function () {
                        return (
                          this.requireAssignment(),
                          this.requireExposureLogging(),
                          this._assignment.getParams()
                        );
                      },
                    },
                    {
                      key: 'get',
                      value: function (d, m) {
                        return (
                          this.requireAssignment(),
                          this.requireExposureLogging(d),
                          this.setLocalOverride(d),
                          this._assignment.get(d, m)
                        );
                      },
                    },
                    {
                      key: 'toString',
                      value: function () {
                        return (
                          this.requireAssignment(),
                          this.requireExposureLogging(),
                          JSON.stringify(this.__asBlob())
                        );
                      },
                    },
                    {
                      key: 'logExposure',
                      value: function (d) {
                        this.inExperiment() &&
                          ((this._exposureLogged = !0), this.logEvent('exposure', d));
                      },
                    },
                    {
                      key: 'shouldLogExposure',
                      value: function (d) {
                        return d !== void 0 && !this.shouldFetchExperimentParameter(d)
                          ? !1
                          : this._autoExposureLog && !this.previouslyLogged();
                      },
                    },
                    {
                      key: 'logEvent',
                      value: function (d, m) {
                        if (this.inExperiment()) {
                          var v;
                          m ? (v = { event: d, extra_data: Le(m) }) : (v = { event: d }),
                            this.log(this.__asBlob(v));
                        }
                      },
                    },
                    {
                      key: 'configureLogger',
                      value: function () {
                        throw 'IMPLEMENT configureLogger';
                      },
                    },
                    {
                      key: 'log',
                      value: function (d) {
                        throw 'IMPLEMENT log';
                      },
                    },
                    {
                      key: 'previouslyLogged',
                      value: function () {
                        throw 'IMPLEMENT previouslyLogged';
                      },
                    },
                  ]),
                  u
                );
              })();
              return l;
            }
            var Rn = {},
              ut = {},
              In = function (l) {
                return l ? oo(Le(l)) : {};
              },
              oo = function (l) {
                return (
                  de(Object.keys(l), function (u) {
                    A(l[u]) && (l[u] = l[u]());
                  }),
                  l
                );
              },
              ao = function (l, u, p) {
                p ? (ut[p] || (ut[p] = {}), (ut[p][l] = u)) : (Rn[l] = u);
              },
              Nn = function (l) {
                var u = In(Rn);
                return l && ut[l] ? q(u, In(ut[l])) : u;
              };
            function uo(h, l) {
              if (!(h instanceof l)) throw new TypeError('Cannot call a class as a function');
            }
            function lo(h, l) {
              for (var u = 0; u < l.length; u++) {
                var p = l[u];
                (p.enumerable = p.enumerable || !1),
                  (p.configurable = !0),
                  'value' in p && (p.writable = !0),
                  Object.defineProperty(h, p.key, p);
              }
            }
            function co(h, l, u) {
              return l && lo(h.prototype, l), h;
            }
            function fo(h, l) {
              var u = (function () {
                function p(d) {
                  var m =
                      arguments.length > 1 && arguments[1] !== void 0
                        ? arguments[1]
                        : 'global_salt',
                    v = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
                    S = arguments.length > 3 ? arguments[3] : void 0;
                  uo(this, p),
                    (this._serialization = P(d)),
                    S ? (this._env = S) : (this._env = new l(m)),
                    (this.experimentSalt = this._experimentSalt = m),
                    (this._evaluated = !1),
                    (this._inExperiment = !1),
                    (this._inputs = Le(v));
                }
                return (
                  co(p, [
                    {
                      key: 'inExperiment',
                      value: function () {
                        return this._inExperiment;
                      },
                    },
                    {
                      key: 'setEnv',
                      value: function (m) {
                        return (this._env = P(m)), this;
                      },
                    },
                    {
                      key: 'has',
                      value: function (m) {
                        return this._env[m];
                      },
                    },
                    {
                      key: 'get',
                      value: function (m, v) {
                        var S = this._inputs[m];
                        S == null && (S = v);
                        var x = this._env.get(m);
                        return x ?? S;
                      },
                    },
                    {
                      key: 'getParams',
                      value: function () {
                        if (!this._evaluated) {
                          try {
                            this.evaluate(this._serialization);
                          } catch (m) {
                            m instanceof h.StopPlanOutException &&
                              (this._inExperiment = m.inExperiment);
                          }
                          this._evaluated = !0;
                        }
                        return this._env.getParams();
                      },
                    },
                    {
                      key: 'set',
                      value: function (m, v) {
                        return this._env.set(m, v), this;
                      },
                    },
                    {
                      key: 'getSaltSeparator',
                      value: function () {
                        return this._env.saltSeparator;
                      },
                    },
                    {
                      key: 'setOverrides',
                      value: function (m) {
                        return this._env.setOverrides(m), this;
                      },
                    },
                    {
                      key: 'getOverrides',
                      value: function () {
                        return this._env.getOverrides();
                      },
                    },
                    {
                      key: 'hasOverride',
                      value: function (m) {
                        var v = this.getOverrides();
                        return v && v[m] !== void 0;
                      },
                    },
                    {
                      key: 'registerCustomOperators',
                      value: function (m) {
                        h.registerOperators(m);
                      },
                    },
                    {
                      key: 'evaluate',
                      value: function (m) {
                        if (N(m) && m.op) return h.operatorInstance(m).execute(this);
                        if (w(m)) {
                          var v = this;
                          return fr(m, function (S) {
                            return v.evaluate(S);
                          });
                        } else return m;
                      },
                    },
                  ]),
                  p
                );
              })();
              return u;
            }
            function Rt(h) {
              '@babel/helpers - typeof';
              return (
                typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
                  ? (Rt = function (u) {
                      return typeof u;
                    })
                  : (Rt = function (u) {
                      return u &&
                        typeof Symbol == 'function' &&
                        u.constructor === Symbol &&
                        u !== Symbol.prototype
                        ? 'symbol'
                        : typeof u;
                    }),
                Rt(h)
              );
            }
            function It(h, l) {
              if (typeof l != 'function' && l !== null)
                throw new TypeError('Super expression must either be null or a function');
              (h.prototype = Object.create(l && l.prototype, {
                constructor: { value: h, writable: !0, configurable: !0 },
              })),
                l && dr(h, l);
            }
            function dr(h, l) {
              return (
                (dr =
                  Object.setPrototypeOf ||
                  function (p, d) {
                    return (p.__proto__ = d), p;
                  }),
                dr(h, l)
              );
            }
            function Nt(h) {
              var l = go();
              return function () {
                var p = Pt(h),
                  d;
                if (l) {
                  var m = Pt(this).constructor;
                  d = Reflect.construct(p, arguments, m);
                } else d = p.apply(this, arguments);
                return ho(this, d);
              };
            }
            function ho(h, l) {
              return l && (Rt(l) === 'object' || typeof l == 'function') ? l : po(h);
            }
            function po(h) {
              if (h === void 0)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return h;
            }
            function go() {
              if (typeof Reflect > 'u' || !Reflect.construct || Reflect.construct.sham) return !1;
              if (typeof Proxy == 'function') return !0;
              try {
                return (
                  Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0
                );
              } catch {
                return !1;
              }
            }
            function Pt(h) {
              return (
                (Pt = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (u) {
                      return u.__proto__ || Object.getPrototypeOf(u);
                    }),
                Pt(h)
              );
            }
            function lt(h, l) {
              if (!(h instanceof l)) throw new TypeError('Cannot call a class as a function');
            }
            function mo(h, l) {
              for (var u = 0; u < l.length; u++) {
                var p = l[u];
                (p.enumerable = p.enumerable || !1),
                  (p.configurable = !0),
                  'value' in p && (p.writable = !0),
                  Object.defineProperty(h, p.key, p);
              }
            }
            function ct(h, l, u) {
              return l && mo(h.prototype, l), h;
            }
            var Q = (function () {
                function h(l) {
                  lt(this, h), (this.args = l);
                }
                return (
                  ct(h, [
                    {
                      key: 'execute',
                      value: function (u) {
                        throw 'Implement the execute function';
                      },
                    },
                    {
                      key: 'dumpArgs',
                      value: function () {
                        console.log(this.args);
                      },
                    },
                    {
                      key: 'getArgMixed',
                      value: function (u) {
                        if (this.args[u] === void 0) throw 'Missing argument ' + u;
                        return this.args[u];
                      },
                    },
                    {
                      key: 'getArgNumber',
                      value: function (u) {
                        var p = this.getArgMixed(u);
                        if (typeof p != 'number') throw u + ' is not a number.';
                        return p;
                      },
                    },
                    {
                      key: 'getArgString',
                      value: function (u) {
                        var p = this.getArgMixed(u);
                        if (typeof p != 'string') throw u + ' is not a string.';
                        return p;
                      },
                    },
                    {
                      key: 'getArgList',
                      value: function (u) {
                        var p = this.getArgMixed(u);
                        if (Object.prototype.toString.call(p) !== '[object Array]')
                          throw u + ' is not a list';
                        return p;
                      },
                    },
                    {
                      key: 'getArgObject',
                      value: function (u) {
                        var p = this.getArgMixed(u);
                        if (Object.prototype.toString.call(p) !== '[object Object]')
                          throw u + ' is not an object.';
                        return p;
                      },
                    },
                    {
                      key: 'getArgIndexish',
                      value: function (u) {
                        var p = this.getArgMixed(u),
                          d = Object.prototype.toString.call(p);
                        if (d !== '[object Object]' && d !== '[object Array]')
                          throw u + ' is not an list or object.';
                        return p;
                      },
                    },
                  ]),
                  h
                );
              })(),
              Be = (function (h) {
                It(u, h);
                var l = Nt(u);
                function u() {
                  return lt(this, u), l.apply(this, arguments);
                }
                return (
                  ct(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        this.mapper = d;
                        var m = this;
                        return (
                          de(Object.keys(this.args), function (v) {
                            m.args[v] = d.evaluate(m.args[v]);
                          }),
                          this.simpleExecute()
                        );
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              Ce = (function (h) {
                It(u, h);
                var l = Nt(u);
                function u() {
                  return lt(this, u), l.apply(this, arguments);
                }
                return (
                  ct(u, [
                    {
                      key: 'simpleExecute',
                      value: function () {
                        return this.unaryExecute(this.getArgMixed('value'));
                      },
                    },
                    {
                      key: 'getUnaryString',
                      value: function () {
                        return this.args.op;
                      },
                    },
                    {
                      key: 'unaryExecute',
                      value: function (d) {
                        throw 'implement unaryExecute';
                      },
                    },
                  ]),
                  u
                );
              })(Be),
              ve = (function (h) {
                It(u, h);
                var l = Nt(u);
                function u() {
                  return lt(this, u), l.apply(this, arguments);
                }
                return (
                  ct(u, [
                    {
                      key: 'simpleExecute',
                      value: function () {
                        var d = this.getArgMixed('left'),
                          m = this.getArgMixed('right');
                        return this.binaryExecute(d, m);
                      },
                    },
                    {
                      key: 'getInfixString',
                      value: function () {
                        return this.args.op;
                      },
                    },
                    {
                      key: 'binaryExecute',
                      value: function (d, m) {
                        throw 'implement binaryExecute';
                      },
                    },
                  ]),
                  u
                );
              })(Be),
              ft = (function (h) {
                It(u, h);
                var l = Nt(u);
                function u() {
                  return lt(this, u), l.apply(this, arguments);
                }
                return (
                  ct(u, [
                    {
                      key: 'simpleExecute',
                      value: function () {
                        return this.commutativeExecute(this.getArgList('values'));
                      },
                    },
                    {
                      key: 'getCommutativeString',
                      value: function () {
                        return this.args.op;
                      },
                    },
                    {
                      key: 'commutativeExecute',
                      value: function (d) {
                        throw 'implement commutativeExecute';
                      },
                    },
                  ]),
                  u
                );
              })(Be);
            function _o(h, l) {
              if (!(h instanceof l)) throw new TypeError('Cannot call a class as a function');
            }
            var Pn = function (l, u) {
                Ln({
                  literal: l.Literal,
                  get: l.Get,
                  set: l.Set,
                  seq: l.Seq,
                  return: l.Return,
                  index: l.Index,
                  array: l.Arr,
                  equals: l.Equals,
                  and: l.And,
                  or: l.Or,
                  '>': l.GreaterThan,
                  '<': l.LessThan,
                  '>=': l.GreaterThanOrEqualTo,
                  '<=': l.LessThanOrEqualTo,
                  '%': l.Mod,
                  '/': l.Divide,
                  not: l.Not,
                  round: l.Round,
                  exp: l.Exp,
                  sqrt: l.Sqrt,
                  negative: l.Negative,
                  min: l.Min,
                  max: l.Max,
                  length: l.Length,
                  coalesce: l.Coalesce,
                  map: l.Map,
                  cond: l.Cond,
                  product: l.Product,
                  sum: l.Sum,
                  randomFloat: u.RandomFloat,
                  randomInteger: u.RandomInteger,
                  bernoulliTrial: u.BernoulliTrial,
                  bernoulliFilter: u.BernoulliFilter,
                  uniformChoice: u.UniformChoice,
                  weightedChoice: u.WeightedChoice,
                  sample: u.Sample,
                });
              },
              Lt = {},
              Ln = function (l) {
                de(l, function (u, p) {
                  if (Lt[p]) throw ''.concat(p, ' already is defined');
                  Lt[p] = u;
                });
              },
              Bn = function (l) {
                return N(l) && l.op;
              },
              vo = function (l) {
                var u = l.op;
                if (!Lt[u]) throw 'Unknown Operator '.concat(u);
                return new Lt[u](l);
              },
              Cn = function h(l) {
                _o(this, h), (this.inExperiment = l);
              };
            function Bt(h) {
              '@babel/helpers - typeof';
              return (
                typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
                  ? (Bt = function (u) {
                      return typeof u;
                    })
                  : (Bt = function (u) {
                      return u &&
                        typeof Symbol == 'function' &&
                        u.constructor === Symbol &&
                        u !== Symbol.prototype
                        ? 'symbol'
                        : typeof u;
                    }),
                Bt(h)
              );
            }
            function B(h, l) {
              if (!(h instanceof l)) throw new TypeError('Cannot call a class as a function');
            }
            function yo(h, l) {
              for (var u = 0; u < l.length; u++) {
                var p = l[u];
                (p.enumerable = p.enumerable || !1),
                  (p.configurable = !0),
                  'value' in p && (p.writable = !0),
                  Object.defineProperty(h, p.key, p);
              }
            }
            function C(h, l, u) {
              return l && yo(h.prototype, l), h;
            }
            function U(h, l) {
              if (typeof l != 'function' && l !== null)
                throw new TypeError('Super expression must either be null or a function');
              (h.prototype = Object.create(l && l.prototype, {
                constructor: { value: h, writable: !0, configurable: !0 },
              })),
                l && hr(h, l);
            }
            function hr(h, l) {
              return (
                (hr =
                  Object.setPrototypeOf ||
                  function (p, d) {
                    return (p.__proto__ = d), p;
                  }),
                hr(h, l)
              );
            }
            function M(h) {
              var l = bo();
              return function () {
                var p = Ct(h),
                  d;
                if (l) {
                  var m = Ct(this).constructor;
                  d = Reflect.construct(p, arguments, m);
                } else d = p.apply(this, arguments);
                return Eo(this, d);
              };
            }
            function Eo(h, l) {
              return l && (Bt(l) === 'object' || typeof l == 'function') ? l : So(h);
            }
            function So(h) {
              if (h === void 0)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return h;
            }
            function bo() {
              if (typeof Reflect > 'u' || !Reflect.construct || Reflect.construct.sham) return !1;
              if (typeof Proxy == 'function') return !0;
              try {
                return (
                  Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0
                );
              } catch {
                return !1;
              }
            }
            function Ct(h) {
              return (
                (Ct = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (u) {
                      return u.__proto__ || Object.getPrototypeOf(u);
                    }),
                Ct(h)
              );
            }
            var wo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        return this.getArgMixed('value');
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              Oo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        return d.get(this.getArgString('var'));
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              xo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        de(this.getArgList('seq'), function (m) {
                          d.evaluate(m);
                        });
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              To = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        var m = d.evaluate(this.getArgMixed('value')),
                          v = !1;
                        throw (m && (v = !0), new Cn(v));
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              ko = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        var m = this.getArgString('var'),
                          v = this.getArgMixed('value');
                        d.hasOverride(m) ||
                          (v && Bn(v) && !v.salt && (v.salt = m),
                          m == 'experimentSalt' && (d.experimentSalt = v),
                          d.set(m, d.evaluate(v)));
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              Ao = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        return fr(this.getArgList('values'), function (m) {
                          return d.evaluate(m);
                        });
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              Do = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        for (var m = this.getArgList('values'), v = 0; v < m.length; v++) {
                          var S = m[v],
                            x = d.evaluate(S);
                          if (x != null) return x;
                        }
                        return null;
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              Ro = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'simpleExecute',
                      value: function () {
                        var d = this.getArgIndexish('base'),
                          m = this.getArgMixed('index');
                        return typeof m == 'number'
                          ? m >= 0 && m < d.length
                            ? d[m]
                            : void 0
                          : d[m];
                      },
                    },
                  ]),
                  u
                );
              })(Be),
              Io = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        var m = this.getArgList('cond');
                        for (var v in m) {
                          var S = m[v].if,
                            x = m[v].then;
                          if (d.evaluate(S)) return d.evaluate(x);
                        }
                        return null;
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              No = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        return kt(
                          this.getArgList('values'),
                          function (m, v) {
                            return m && !!d.evaluate(v);
                          },
                          !0
                        );
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              Po = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'execute',
                      value: function (d) {
                        return kt(
                          this.getArgList('values'),
                          function (m, v) {
                            return m || !!d.evaluate(v);
                          },
                          !1
                        );
                      },
                    },
                  ]),
                  u
                );
              })(Q),
              Lo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'commutativeExecute',
                      value: function (d) {
                        return kt(
                          d,
                          function (m, v) {
                            return m * v;
                          },
                          1
                        );
                      },
                    },
                  ]),
                  u
                );
              })(ft),
              Bo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'commutativeExecute',
                      value: function (d) {
                        return kt(
                          d,
                          function (m, v) {
                            return m + v;
                          },
                          0
                        );
                      },
                    },
                  ]),
                  u
                );
              })(ft),
              Co = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'getInfixString',
                      value: function () {
                        return '==';
                      },
                    },
                    {
                      key: 'binaryExecute',
                      value: function (d, m) {
                        return d === m;
                      },
                    },
                  ]),
                  u
                );
              })(ve),
              Uo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'binaryExecute',
                      value: function (d, m) {
                        return d > m;
                      },
                    },
                  ]),
                  u
                );
              })(ve),
              Mo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'binaryExecute',
                      value: function (d, m) {
                        return d < m;
                      },
                    },
                  ]),
                  u
                );
              })(ve),
              Fo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'binaryExecute',
                      value: function (d, m) {
                        return d <= m;
                      },
                    },
                  ]),
                  u
                );
              })(ve),
              Go = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'binaryExecute',
                      value: function (d, m) {
                        return d >= m;
                      },
                    },
                  ]),
                  u
                );
              })(ve),
              jo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'binaryExecute',
                      value: function (d, m) {
                        return d % m;
                      },
                    },
                  ]),
                  u
                );
              })(ve),
              $o = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'binaryExecute',
                      value: function (d, m) {
                        return parseFloat(d) / parseFloat(m);
                      },
                    },
                  ]),
                  u
                );
              })(ve),
              Ho = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'unaryExecute',
                      value: function (d) {
                        return Math.round(d);
                      },
                    },
                  ]),
                  u
                );
              })(Ce),
              Wo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'unaryExecute',
                      value: function (d) {
                        return Math.exp(d);
                      },
                    },
                  ]),
                  u
                );
              })(Ce),
              qo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'unaryExecute',
                      value: function (d) {
                        return Math.sqrt(d);
                      },
                    },
                  ]),
                  u
                );
              })(Ce),
              Yo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'getUnaryString',
                      value: function () {
                        return '!';
                      },
                    },
                    {
                      key: 'unaryExecute',
                      value: function (d) {
                        return !d;
                      },
                    },
                  ]),
                  u
                );
              })(Ce),
              zo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'getUnaryString',
                      value: function () {
                        return '-';
                      },
                    },
                    {
                      key: 'unaryExecute',
                      value: function (d) {
                        return 0 - d;
                      },
                    },
                  ]),
                  u
                );
              })(Ce),
              Vo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'commutativeExecute',
                      value: function (d) {
                        return Math.min.apply(null, d);
                      },
                    },
                  ]),
                  u
                );
              })(ft),
              Jo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'commutativeExecute',
                      value: function (d) {
                        return Math.max.apply(null, d);
                      },
                    },
                  ]),
                  u
                );
              })(ft),
              Xo = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'unaryExecute',
                      value: function (d) {
                        return d.length;
                      },
                    },
                  ]),
                  u
                );
              })(Ce),
              Ko = (function (h) {
                U(u, h);
                var l = M(u);
                function u() {
                  return B(this, u), l.apply(this, arguments);
                }
                return (
                  C(u, [
                    {
                      key: 'simpleExecute',
                      value: function () {
                        var d = P(this.args);
                        return delete d.op, delete d.salt, d;
                      },
                    },
                  ]),
                  u
                );
              })(Be);
            function Ut(h) {
              '@babel/helpers - typeof';
              return (
                typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
                  ? (Ut = function (u) {
                      return typeof u;
                    })
                  : (Ut = function (u) {
                      return u &&
                        typeof Symbol == 'function' &&
                        u.constructor === Symbol &&
                        u !== Symbol.prototype
                        ? 'symbol'
                        : typeof u;
                    }),
                Ut(h)
              );
            }
            function he(h, l, u) {
              return (
                typeof Reflect < 'u' && Reflect.get
                  ? (he = Reflect.get)
                  : (he = function (d, m, v) {
                      var S = Qo(d, m);
                      if (S) {
                        var x = Object.getOwnPropertyDescriptor(S, m);
                        return x.get ? x.get.call(v) : x.value;
                      }
                    }),
                he(h, l, u || h)
              );
            }
            function Qo(h, l) {
              for (; !Object.prototype.hasOwnProperty.call(h, l) && ((h = re(h)), h !== null); );
              return h;
            }
            function pr(h, l) {
              if (!(h instanceof l)) throw new TypeError('Cannot call a class as a function');
            }
            function Zo(h, l) {
              for (var u = 0; u < l.length; u++) {
                var p = l[u];
                (p.enumerable = p.enumerable || !1),
                  (p.configurable = !0),
                  'value' in p && (p.writable = !0),
                  Object.defineProperty(h, p.key, p);
              }
            }
            function gr(h, l, u) {
              return l && Zo(h.prototype, l), h;
            }
            function Un(h, l) {
              if (typeof l != 'function' && l !== null)
                throw new TypeError('Super expression must either be null or a function');
              (h.prototype = Object.create(l && l.prototype, {
                constructor: { value: h, writable: !0, configurable: !0 },
              })),
                l && mr(h, l);
            }
            function mr(h, l) {
              return (
                (mr =
                  Object.setPrototypeOf ||
                  function (p, d) {
                    return (p.__proto__ = d), p;
                  }),
                mr(h, l)
              );
            }
            function Mn(h) {
              var l = ra();
              return function () {
                var p = re(h),
                  d;
                if (l) {
                  var m = re(this).constructor;
                  d = Reflect.construct(p, arguments, m);
                } else d = p.apply(this, arguments);
                return ea(this, d);
              };
            }
            function ea(h, l) {
              return l && (Ut(l) === 'object' || typeof l == 'function') ? l : ta(h);
            }
            function ta(h) {
              if (h === void 0)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return h;
            }
            function ra() {
              if (typeof Reflect > 'u' || !Reflect.construct || Reflect.construct.sham) return !1;
              if (typeof Proxy == 'function') return !0;
              try {
                return (
                  Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0
                );
              } catch {
                return !1;
              }
            }
            function re(h) {
              return (
                (re = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (u) {
                      return u.__proto__ || Object.getPrototypeOf(u);
                    }),
                re(h)
              );
            }
            function na(h, l, u) {
              var p = (function (v) {
                  Un(x, v);
                  var S = Mn(x);
                  function x() {
                    return pr(this, x), S.apply(this, arguments);
                  }
                  return (
                    gr(x, [
                      { key: 'configureLogger', value: function () {} },
                      {
                        key: 'setup',
                        value: function () {
                          this.name = 'test_name';
                        },
                      },
                      { key: 'log', value: function (b) {} },
                      {
                        key: 'getParamNames',
                        value: function () {
                          return this.getDefaultParamNames();
                        },
                      },
                      {
                        key: 'previouslyLogged',
                        value: function () {
                          return !0;
                        },
                      },
                      { key: 'assign', value: function (b, D) {} },
                    ]),
                    x
                  );
                })(u),
                d = (function () {
                  function v() {
                    pr(this, v);
                  }
                  return (
                    gr(v, [
                      {
                        key: 'addExperiment',
                        value: function (x, k, b) {
                          throw 'IMPLEMENT addExperiment';
                        },
                      },
                      {
                        key: 'removeExperiment',
                        value: function (x) {
                          throw 'IMPLEMENT removeExperiment';
                        },
                      },
                      {
                        key: 'setAutoExposureLogging',
                        value: function (x) {
                          throw 'IMPLEMENT setAutoExposureLogging';
                        },
                      },
                      {
                        key: 'inExperiment',
                        value: function () {
                          throw 'IMPLEMENT inExperiment';
                        },
                      },
                      {
                        key: 'get',
                        value: function (x, k) {
                          throw 'IMPLEMENT get';
                        },
                      },
                      {
                        key: 'logExposure',
                        value: function (x) {
                          throw 'IMPLEMENT logExposure';
                        },
                      },
                      {
                        key: 'logEvent',
                        value: function (x, k) {
                          throw 'IMPLEMENT logEvent';
                        },
                      },
                      {
                        key: 'requireExperiment',
                        value: function () {
                          this._experiment || this._assignExperiment();
                        },
                      },
                      {
                        key: 'requireDefaultExperiment',
                        value: function () {
                          this._defaultExperiment || this._assignDefaultExperiment();
                        },
                      },
                    ]),
                    v
                  );
                })(),
                m = (function (v) {
                  Un(x, v);
                  var S = Mn(x);
                  function x(k) {
                    var b;
                    if (
                      (pr(this, x),
                      (b = S.call(this, k)),
                      (b.inputs = k || {}),
                      (b.numSegments = 1),
                      (b.segmentAllocations = {}),
                      (b.currentExperiments = {}),
                      (b._experiment = null),
                      (b._defaultExperiment = null),
                      (b.defaultExperimentClass = p),
                      (b._inExperiment = !1),
                      b.setupDefaults(),
                      b.setup(),
                      !b.name)
                    )
                      throw 'setup() must set a namespace name via this.setName()';
                    return (b.availableSegments = Ks(b.numSegments)), b.setupExperiments(), b;
                  }
                  return (
                    gr(x, [
                      { key: 'setupDefaults', value: function () {} },
                      {
                        key: 'setup',
                        value: function () {
                          throw 'IMPLEMENT setup';
                        },
                      },
                      {
                        key: 'setupExperiments',
                        value: function () {
                          throw 'IMPLEMENT setupExperiments';
                        },
                      },
                      {
                        key: 'getPrimaryUnit',
                        value: function () {
                          return this._primaryUnit;
                        },
                      },
                      {
                        key: 'allowedOverride',
                        value: function () {
                          return !1;
                        },
                      },
                      {
                        key: 'getOverrides',
                        value: function () {
                          return {};
                        },
                      },
                      {
                        key: 'setPrimaryUnit',
                        value: function (b) {
                          this._primaryUnit = b;
                        },
                      },
                      {
                        key: 'addExperiment',
                        value: function (b, D, V) {
                          var Xe = this.availableSegments.length;
                          if (Xe < V) return !1;
                          if (this.currentExperiments[b] !== void 0) return !1;
                          var Fn = new l(this.name);
                          Fn.set(
                            'sampled_segments',
                            new h.Sample({ choices: this.availableSegments, draws: V, unit: b })
                          );
                          for (var vr = Fn.get('sampled_segments'), Gt = 0; Gt < vr.length; Gt++) {
                            this.segmentAllocations[vr[Gt]] = b;
                            var Ia = this.availableSegments.indexOf(vr[Gt]);
                            (this.availableSegments[Ia] = this.availableSegments[Xe - 1]),
                              this.availableSegments.splice(Xe - 1, 1),
                              (Xe -= 1);
                          }
                          this.currentExperiments[b] = D;
                        },
                      },
                      {
                        key: 'removeExperiment',
                        value: function (b) {
                          var D = this;
                          return this.currentExperiments[b] === void 0
                            ? !1
                            : (de(Object.keys(this.segmentAllocations), function (V) {
                                D.segmentAllocations[V] === b &&
                                  (delete D.segmentAllocations[V], D.availableSegments.push(V));
                              }),
                              delete this.currentExperiments[b],
                              !0);
                        },
                      },
                      {
                        key: 'getSegment',
                        value: function () {
                          var b = new l(this.name),
                            D = new h.RandomInteger({
                              min: 0,
                              max: this.numSegments - 1,
                              unit: this.inputs[this.getPrimaryUnit()],
                            });
                          return b.set('segment', D), b.get('segment');
                        },
                      },
                      {
                        key: '_assignExperiment',
                        value: function () {
                          this.inputs = q(this.inputs, Nn(this.getName()));
                          var b = this.getSegment();
                          if (this.segmentAllocations[b] !== void 0) {
                            var D = this.segmentAllocations[b];
                            this._assignExperimentObject(D);
                          }
                        },
                      },
                      {
                        key: '_assignExperimentObject',
                        value: function (b) {
                          var D = new this.currentExperiments[b](this.inputs);
                          D.setName(''.concat(this.getName(), '-').concat(b)),
                            D.setSalt(''.concat(this.getName(), '-').concat(b)),
                            (this._experiment = D),
                            (this._inExperiment = D.inExperiment()),
                            this._inExperiment || this._assignDefaultExperiment();
                        },
                      },
                      {
                        key: '_assignDefaultExperiment',
                        value: function () {
                          this._defaultExperiment = new this.defaultExperimentClass(this.inputs);
                        },
                      },
                      {
                        key: 'defaultGet',
                        value: function (b, D) {
                          return (
                            he(re(x.prototype), 'requireDefaultExperiment', this).call(this),
                            this._defaultExperiment.get(b, D)
                          );
                        },
                      },
                      {
                        key: 'getName',
                        value: function () {
                          return this.name;
                        },
                      },
                      {
                        key: 'setName',
                        value: function (b) {
                          this.name = b;
                        },
                      },
                      {
                        key: 'previouslyLogged',
                        value: function () {
                          return this._experiment ? this._experiment.previouslyLogged() : null;
                        },
                      },
                      {
                        key: 'inExperiment',
                        value: function () {
                          return (
                            he(re(x.prototype), 'requireExperiment', this).call(this),
                            this._inExperiment
                          );
                        },
                      },
                      {
                        key: 'setAutoExposureLogging',
                        value: function (b) {
                          (this._autoExposureLoggingSet = b),
                            this._defaultExperiment &&
                              this._defaultExperiment.setAutoExposureLogging(b),
                            this._experiment && this._experiment.setAutoExposureLogging(b);
                        },
                      },
                      {
                        key: 'setGlobalOverride',
                        value: function (b) {
                          var D = this.getOverrides();
                          if (D && Dt(D, b)) {
                            var V = D[b];
                            V &&
                              Dt(this.currentExperiments, V.experimentName) &&
                              (this._assignExperimentObject(V.experimentName),
                              this._experiment.addOverride(b, V.value));
                          }
                        },
                      },
                      {
                        key: 'setLocalOverride',
                        value: function (b) {
                          var D = R('experimentOverride');
                          D &&
                            Dt(this.currentExperiments, D) &&
                            (this._assignExperimentObject(D),
                            R(b) && this._experiment.addOverride(b, R(b)));
                        },
                      },
                      {
                        key: 'getParams',
                        value: function (b) {
                          return (
                            he(re(x.prototype), 'requireExperiment', this).call(this),
                            this._experiment && this.getOriginalExperimentName() === b
                              ? this._experiment.getParams()
                              : null
                          );
                        },
                      },
                      {
                        key: 'getOriginalExperimentName',
                        value: function () {
                          return this._experiment ? this._experiment.getName().split('-')[1] : null;
                        },
                      },
                      {
                        key: 'get',
                        value: function (b, D) {
                          return (
                            he(re(x.prototype), 'requireExperiment', this).call(this),
                            this.allowedOverride() && this.setGlobalOverride(b),
                            this.setLocalOverride(b),
                            this._experiment
                              ? (this._autoExposureLoggingSet !== void 0 &&
                                  this._experiment.setAutoExposureLogging(
                                    this._autoExposureLoggingSet
                                  ),
                                this._experiment.get(b, this.defaultGet(b, D)))
                              : this.defaultGet(b, D)
                          );
                        },
                      },
                      {
                        key: 'logExposure',
                        value: function (b) {
                          he(re(x.prototype), 'requireExperiment', this).call(this),
                            this._experiment && this._experiment.logExposure(b);
                        },
                      },
                      {
                        key: 'logEvent',
                        value: function (b, D) {
                          he(re(x.prototype), 'requireExperiment', this).call(this),
                            this._experiment && this._experiment.logEvent(b, D);
                        },
                      },
                    ]),
                    x
                  );
                })(d);
              return { Namespace: d, SimpleNamespace: m };
            }
            const ia = function () {
              var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
                l = h.Random,
                u = l === void 0 ? null : l;
              Pn(_, u);
              var p = to(u),
                d = so(p),
                m = fo(g, p),
                v = na(u, p, d);
              return {
                Assignment: p,
                Experiment: d,
                ExperimentSetup: c,
                Interpreter: m,
                Ops: { Random: u, Core: _, Base: f },
                Namespace: v,
              };
            };
            var sa = a(738),
              oa = a.n(sa);
            function Mt(h) {
              '@babel/helpers - typeof';
              return (
                typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
                  ? (Mt = function (u) {
                      return typeof u;
                    })
                  : (Mt = function (u) {
                      return u &&
                        typeof Symbol == 'function' &&
                        u.constructor === Symbol &&
                        u !== Symbol.prototype
                        ? 'symbol'
                        : typeof u;
                    }),
                Mt(h)
              );
            }
            function ye(h, l) {
              if (!(h instanceof l)) throw new TypeError('Cannot call a class as a function');
            }
            function aa(h, l) {
              for (var u = 0; u < l.length; u++) {
                var p = l[u];
                (p.enumerable = p.enumerable || !1),
                  (p.configurable = !0),
                  'value' in p && (p.writable = !0),
                  Object.defineProperty(h, p.key, p);
              }
            }
            function Ee(h, l, u) {
              return l && aa(h.prototype, l), h;
            }
            function Se(h, l) {
              if (typeof l != 'function' && l !== null)
                throw new TypeError('Super expression must either be null or a function');
              (h.prototype = Object.create(l && l.prototype, {
                constructor: { value: h, writable: !0, configurable: !0 },
              })),
                l && _r(h, l);
            }
            function _r(h, l) {
              return (
                (_r =
                  Object.setPrototypeOf ||
                  function (p, d) {
                    return (p.__proto__ = d), p;
                  }),
                _r(h, l)
              );
            }
            function be(h) {
              var l = ca();
              return function () {
                var p = Ft(h),
                  d;
                if (l) {
                  var m = Ft(this).constructor;
                  d = Reflect.construct(p, arguments, m);
                } else d = p.apply(this, arguments);
                return ua(this, d);
              };
            }
            function ua(h, l) {
              return l && (Mt(l) === 'object' || typeof l == 'function') ? l : la(h);
            }
            function la(h) {
              if (h === void 0)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return h;
            }
            function ca() {
              if (typeof Reflect > 'u' || !Reflect.construct || Reflect.construct.sham) return !1;
              if (typeof Proxy == 'function') return !0;
              try {
                return (
                  Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0
                );
              } catch {
                return !1;
              }
            }
            function Ft(h) {
              return (
                (Ft = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (u) {
                      return u.__proto__ || Object.getPrototypeOf(u);
                    }),
                Ft(h)
              );
            }
            var we = (function (h) {
                Se(u, h);
                var l = be(u);
                function u() {
                  return ye(this, u), l.apply(this, arguments);
                }
                return (
                  Ee(u, [
                    {
                      key: 'hashCalculation',
                      value: function (d) {
                        return parseInt(d.substr(0, 13), 16);
                      },
                    },
                    {
                      key: 'zeroToOneCalculation',
                      value: function (d) {
                        return this.getHash(d) / 0xfffffffffffff;
                      },
                    },
                    {
                      key: 'getUnit',
                      value: function (d) {
                        var m = this.getArgMixed('unit');
                        return w(m) || (m = [m]), d && m.push(d), m;
                      },
                    },
                    {
                      key: 'getUniform',
                      value: function () {
                        var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0,
                          m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1,
                          v = arguments.length > 2 ? arguments[2] : void 0,
                          S = this.zeroToOneCalculation(v);
                        return S * (m - d) + d;
                      },
                    },
                    {
                      key: 'getHash',
                      value: function (d) {
                        var m;
                        if (this.args.full_salt) m = this.getArgString('full_salt') + '.';
                        else {
                          var v = this.getArgString('salt');
                          m =
                            this.mapper.get('experimentSalt') +
                            '.' +
                            v +
                            this.mapper.get('saltSeparator');
                        }
                        var S = this.getUnit(d)
                            .map(function (b) {
                              return String(b);
                            })
                            .join('.'),
                          x = m + S,
                          k = oa()(x);
                        return this.hashCalculation(k);
                      },
                    },
                  ]),
                  u
                );
              })(Be),
              fa = function (l) {
                return (function (u) {
                  Se(d, u);
                  var p = be(d);
                  function d() {
                    return ye(this, d), p.apply(this, arguments);
                  }
                  return (
                    Ee(d, [
                      {
                        key: 'simpleExecute',
                        value: function () {
                          var v = this.getArgNumber('min'),
                            S = this.getArgNumber('max');
                          return this.getUniform(v, S);
                        },
                      },
                    ]),
                    d
                  );
                })(l);
              },
              da = function (l) {
                return (function (u) {
                  Se(d, u);
                  var p = be(d);
                  function d() {
                    return ye(this, d), p.apply(this, arguments);
                  }
                  return (
                    Ee(d, [
                      {
                        key: 'randomIntegerCalculation',
                        value: function (v, S) {
                          return (this.getHash() + v) % (S - v + 1);
                        },
                      },
                      {
                        key: 'simpleExecute',
                        value: function () {
                          var v = this.getArgNumber('min'),
                            S = this.getArgNumber('max');
                          return this.randomIntegerCalculation(v, S);
                        },
                      },
                    ]),
                    d
                  );
                })(l);
              },
              ha = function (l) {
                return (function (u) {
                  Se(d, u);
                  var p = be(d);
                  function d() {
                    return ye(this, d), p.apply(this, arguments);
                  }
                  return (
                    Ee(d, [
                      {
                        key: 'simpleExecute',
                        value: function () {
                          var v = this.getArgNumber('p');
                          if (v < 0 || v > 1) throw 'Invalid probability';
                          return this.getUniform(0, 1) <= v ? 1 : 0;
                        },
                      },
                    ]),
                    d
                  );
                })(l);
              },
              pa = function (l) {
                return (function (u) {
                  Se(d, u);
                  var p = be(d);
                  function d() {
                    return ye(this, d), p.apply(this, arguments);
                  }
                  return (
                    Ee(d, [
                      {
                        key: 'simpleExecute',
                        value: function () {
                          var v = this.getArgNumber('p'),
                            S = this.getArgList('choices');
                          if (v < 0 || v > 1) throw 'Invalid probability';
                          if (S.length == 0) return [];
                          for (var x = [], k = 0; k < S.length; k++) {
                            var b = S[k];
                            this.getUniform(0, 1, b) <= v && x.push(b);
                          }
                          return x;
                        },
                      },
                    ]),
                    d
                  );
                })(l);
              },
              ga = function (l) {
                return (function (u) {
                  Se(d, u);
                  var p = be(d);
                  function d() {
                    return ye(this, d), p.apply(this, arguments);
                  }
                  return (
                    Ee(d, [
                      {
                        key: 'randomIndexCalculation',
                        value: function (v) {
                          return this.getHash() % v.length;
                        },
                      },
                      {
                        key: 'simpleExecute',
                        value: function () {
                          var v = this.getArgList('choices');
                          if (v.length === 0) return [];
                          var S = this.randomIndexCalculation(v);
                          return v[S];
                        },
                      },
                    ]),
                    d
                  );
                })(l);
              },
              ma = function (l) {
                return (function (u) {
                  Se(d, u);
                  var p = be(d);
                  function d() {
                    return ye(this, d), p.apply(this, arguments);
                  }
                  return (
                    Ee(d, [
                      {
                        key: 'simpleExecute',
                        value: function () {
                          var v = this.getArgList('choices'),
                            S = this.getArgList('weights');
                          if (v.length === 0) return [];
                          for (
                            var x = 0,
                              k = S.map(function (V) {
                                return (x += V), x;
                              }),
                              b = this.getUniform(0, x),
                              D = 0;
                            D < k.length;
                            ++D
                          )
                            if (b <= k[D]) return v[D];
                        },
                      },
                    ]),
                    d
                  );
                })(l);
              },
              _a = function (l) {
                return (function (u) {
                  Se(d, u);
                  var p = be(d);
                  function d() {
                    return ye(this, d), p.apply(this, arguments);
                  }
                  return (
                    Ee(d, [
                      {
                        key: 'sampleIndexCalculation',
                        value: function (v) {
                          return this.getHash(v) % (v + 1);
                        },
                      },
                      {
                        key: 'allowSampleStoppingPoint',
                        value: function () {
                          return !0;
                        },
                      },
                      {
                        key: 'sample',
                        value: function (v, S) {
                          for (
                            var x = v.length,
                              k = x - S,
                              b = this.allowSampleStoppingPoint(),
                              D = x - 1;
                            D > 0;
                            D--
                          ) {
                            var V = this.sampleIndexCalculation(D),
                              Xe = v[D];
                            if (((v[D] = v[V]), (v[V] = Xe), b && k === D)) return v.slice(D, x);
                          }
                          return v.slice(0, S);
                        },
                      },
                      {
                        key: 'simpleExecute',
                        value: function () {
                          var v = Le(this.getArgList('choices')),
                            S = 0;
                          return (
                            this.args.draws !== void 0
                              ? (S = this.getArgNumber('draws'))
                              : (S = v.length),
                            this.sample(v, S)
                          );
                        },
                      },
                    ]),
                    d
                  );
                })(l);
              },
              va = _a(we),
              ya = ma(we),
              Ea = ga(we),
              Sa = pa(we),
              ba = ha(we),
              wa = da(we),
              Oa = fa(we),
              Je = ia({ Random: y }),
              xa = Je.Assignment,
              Ta = Je.Experiment,
              ka = Je.ExperimentSetup,
              Aa = Je.Interpreter,
              Da = Je.Ops,
              Ra = Je.Namespace;
          },
          487: s => {
            var o = {
              utf8: {
                stringToBytes: function (a) {
                  return o.bin.stringToBytes(unescape(encodeURIComponent(a)));
                },
                bytesToString: function (a) {
                  return decodeURIComponent(escape(o.bin.bytesToString(a)));
                },
              },
              bin: {
                stringToBytes: function (a) {
                  for (var c = [], f = 0; f < a.length; f++) c.push(a.charCodeAt(f) & 255);
                  return c;
                },
                bytesToString: function (a) {
                  for (var c = [], f = 0; f < a.length; f++) c.push(String.fromCharCode(a[f]));
                  return c.join('');
                },
              },
            };
            s.exports = o;
          },
          12: s => {
            (function () {
              var o = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
                a = {
                  rotl: function (c, f) {
                    return (c << f) | (c >>> (32 - f));
                  },
                  rotr: function (c, f) {
                    return (c << (32 - f)) | (c >>> f);
                  },
                  endian: function (c) {
                    if (c.constructor == Number)
                      return (a.rotl(c, 8) & 16711935) | (a.rotl(c, 24) & 4278255360);
                    for (var f = 0; f < c.length; f++) c[f] = a.endian(c[f]);
                    return c;
                  },
                  randomBytes: function (c) {
                    for (var f = []; c > 0; c--) f.push(Math.floor(Math.random() * 256));
                    return f;
                  },
                  bytesToWords: function (c) {
                    for (var f = [], g = 0, _ = 0; g < c.length; g++, _ += 8)
                      f[_ >>> 5] |= c[g] << (24 - (_ % 32));
                    return f;
                  },
                  wordsToBytes: function (c) {
                    for (var f = [], g = 0; g < c.length * 32; g += 8)
                      f.push((c[g >>> 5] >>> (24 - (g % 32))) & 255);
                    return f;
                  },
                  bytesToHex: function (c) {
                    for (var f = [], g = 0; g < c.length; g++)
                      f.push((c[g] >>> 4).toString(16)), f.push((c[g] & 15).toString(16));
                    return f.join('');
                  },
                  hexToBytes: function (c) {
                    for (var f = [], g = 0; g < c.length; g += 2)
                      f.push(parseInt(c.substr(g, 2), 16));
                    return f;
                  },
                  bytesToBase64: function (c) {
                    for (var f = [], g = 0; g < c.length; g += 3)
                      for (var _ = (c[g] << 16) | (c[g + 1] << 8) | c[g + 2], y = 0; y < 4; y++)
                        g * 8 + y * 6 <= c.length * 8
                          ? f.push(o.charAt((_ >>> (6 * (3 - y))) & 63))
                          : f.push('=');
                    return f.join('');
                  },
                  base64ToBytes: function (c) {
                    c = c.replace(/[^A-Z0-9+\/]/gi, '');
                    for (var f = [], g = 0, _ = 0; g < c.length; _ = ++g % 4)
                      _ != 0 &&
                        f.push(
                          ((o.indexOf(c.charAt(g - 1)) & (Math.pow(2, -2 * _ + 8) - 1)) <<
                            (_ * 2)) |
                            (o.indexOf(c.charAt(g)) >>> (6 - _ * 2))
                        );
                    return f;
                  },
                };
              s.exports = a;
            })();
          },
          738: (s, o, a) => {
            (function () {
              var c = a(12),
                f = a(487).utf8,
                g = a(487).bin,
                _ = function (E) {
                  E.constructor == String
                    ? (E = f.stringToBytes(E))
                    : typeof Buffer < 'u' &&
                      typeof Buffer.isBuffer == 'function' &&
                      Buffer.isBuffer(E)
                    ? (E = Array.prototype.slice.call(E, 0))
                    : Array.isArray(E) || (E = E.toString());
                  var O = c.bytesToWords(E),
                    R = E.length * 8,
                    P = [],
                    N = 1732584193,
                    w = -271733879,
                    A = -1732584194,
                    T = 271733878,
                    F = -1009589776;
                  (O[R >> 5] |= 128 << (24 - (R % 32))), (O[(((R + 64) >>> 9) << 4) + 15] = R);
                  for (var $ = 0; $ < O.length; $ += 16) {
                    for (var q = N, ce = w, fe = A, me = T, _e = F, z = 0; z < 80; z++) {
                      if (z < 16) P[z] = O[$ + z];
                      else {
                        var Ve = P[z - 3] ^ P[z - 8] ^ P[z - 14] ^ P[z - 16];
                        P[z] = (Ve << 1) | (Ve >>> 31);
                      }
                      var de =
                        ((N << 5) | (N >>> 27)) +
                        F +
                        (P[z] >>> 0) +
                        (z < 20
                          ? ((w & A) | (~w & T)) + 1518500249
                          : z < 40
                          ? (w ^ A ^ T) + 1859775393
                          : z < 60
                          ? ((w & A) | (w & T) | (A & T)) - 1894007588
                          : (w ^ A ^ T) - 899497514);
                      (F = T), (T = A), (A = (w << 30) | (w >>> 2)), (w = N), (N = de);
                    }
                    (N += q), (w += ce), (A += fe), (T += me), (F += _e);
                  }
                  return [N, w, A, T, F];
                },
                y = function (E, O) {
                  var R = c.wordsToBytes(_(E));
                  return O && O.asBytes
                    ? R
                    : O && O.asString
                    ? g.bytesToString(R)
                    : c.bytesToHex(R);
                };
              (y._blocksize = 16), (y._digestsize = 20), (s.exports = y);
            })();
          },
        },
        n = {};
      function i(s) {
        if (n[s]) return n[s].exports;
        var o = (n[s] = { exports: {} });
        return r[s](o, o.exports, i), o.exports;
      }
      return (
        (i.n = s => {
          var o = s && s.__esModule ? () => s.default : () => s;
          return i.d(o, { a: o }), o;
        }),
        (i.d = (s, o) => {
          for (var a in o)
            i.o(o, a) && !i.o(s, a) && Object.defineProperty(s, a, { enumerable: !0, get: o[a] });
        }),
        (i.o = (s, o) => Object.prototype.hasOwnProperty.call(s, o)),
        (i.r = s => {
          typeof Symbol < 'u' &&
            Symbol.toStringTag &&
            Object.defineProperty(s, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(s, '__esModule', { value: !0 });
        }),
        i(837)
      );
    })();
  });
})($s);
var Ai = $s.exports;
function Bf() {
  try {
    return window.localStorage;
  } catch {
    let e = {};
    return {
      getItem: r => (e.hasOwnProperty(r) ? e[r] : null),
      setItem: (r, n) => {
        e[r] = n.toString();
      },
      removeItem: r => {
        delete e[r];
      },
      clear: () => {
        e = {};
      },
    };
  }
}
const mt = Bf();
let Di;
class Cf extends Ai.Experiment {
  constructor(e, r, n) {
    (Di = e), super({ id: n }), (this.experimentName = e), (this.ops = r);
  }
  configureLogger() {}
  log(e) {
    wn({
      action: 'Experiment ' + this.experimentName,
      label: {
        type: e.event,
        value: e.params.singleton !== void 0 ? e.params.singleton : e.params,
      },
    });
  }
  previouslyLogged() {
    let e = 'exp-' + this.experimentName + '-' + this.experimentId;
    return mt.getItem(e) ? !0 : (mt.setItem(e, 'true'), this._exposureLogged);
  }
  getParamNames() {
    return Object.keys(this.ops);
  }
  setup() {
    this.setName(Di);
  }
  assign(e, r) {
    this.experimentId = r.id;
    for (let n in this.ops) {
      let i = this.ops[n];
      e.set(n, new Ai.Ops.Random[i.type](Object.assign({}, i, { unit: r.id })));
    }
  }
  values() {
    let e = {};
    for (let r in this.ops) e[r] = this.get(r);
    return e;
  }
}
function Uf(t, e, r = 'user') {
  if (!['user', 'org'].includes(r)) throw Error('"unit" must be one of "user" or "org"');
  e.type && (e = { singleton: e }), t in _t || (_t[t] = new Cf(t, e, r === 'user' ? Ws : Hs));
  const n = _t[t].values();
  return 'singleton' in n ? n.singleton : n;
}
let _t = {},
  Hs,
  Ws;
function Mf(t) {
  (Hs = t), (_t = {});
}
function Ff(t) {
  (Ws = t), (_t = {});
}
function Ri(t, e) {
  for (const r in e) Object.defineProperty(t, r, { value: e[r], enumerable: !0, configurable: !0 });
  return t;
}
function Gf(t, e, r) {
  if (!t || typeof t == 'string') throw new TypeError('Please pass an Error to err-code');
  r || (r = {}), typeof e == 'object' && ((r = e), (e = void 0)), e != null && (r.code = e);
  try {
    return Ri(t, r);
  } catch {
    (r.message = t.message), (r.stack = t.stack);
    const i = function () {};
    return (i.prototype = Object.create(Object.getPrototypeOf(t))), Ri(new i(), r);
  }
}
var jf = Gf,
  qs = {};
function te(t, e) {
  typeof e == 'boolean' && (e = { forever: e }),
    (this._originalTimeouts = JSON.parse(JSON.stringify(t))),
    (this._timeouts = t),
    (this._options = e || {}),
    (this._maxRetryTime = (e && e.maxRetryTime) || 1 / 0),
    (this._fn = null),
    (this._errors = []),
    (this._attempts = 1),
    (this._operationTimeout = null),
    (this._operationTimeoutCb = null),
    (this._timeout = null),
    (this._operationStart = null),
    this._options.forever && (this._cachedTimeouts = this._timeouts.slice(0));
}
var $f = te;
te.prototype.reset = function () {
  (this._attempts = 1), (this._timeouts = this._originalTimeouts);
};
te.prototype.stop = function () {
  this._timeout && clearTimeout(this._timeout),
    (this._timeouts = []),
    (this._cachedTimeouts = null);
};
te.prototype.retry = function (t) {
  if ((this._timeout && clearTimeout(this._timeout), !t)) return !1;
  var e = new Date().getTime();
  if (t && e - this._operationStart >= this._maxRetryTime)
    return this._errors.unshift(new Error('RetryOperation timeout occurred')), !1;
  this._errors.push(t);
  var r = this._timeouts.shift();
  if (r === void 0)
    if (this._cachedTimeouts)
      this._errors.splice(this._errors.length - 1, this._errors.length),
        (this._timeouts = this._cachedTimeouts.slice(0)),
        (r = this._timeouts.shift());
    else return !1;
  var n = this,
    i = setTimeout(function () {
      n._attempts++,
        n._operationTimeoutCb &&
          ((n._timeout = setTimeout(function () {
            n._operationTimeoutCb(n._attempts);
          }, n._operationTimeout)),
          n._options.unref && n._timeout.unref()),
        n._fn(n._attempts);
    }, r);
  return this._options.unref && i.unref(), !0;
};
te.prototype.attempt = function (t, e) {
  (this._fn = t),
    e &&
      (e.timeout && (this._operationTimeout = e.timeout),
      e.cb && (this._operationTimeoutCb = e.cb));
  var r = this;
  this._operationTimeoutCb &&
    (this._timeout = setTimeout(function () {
      r._operationTimeoutCb();
    }, r._operationTimeout)),
    (this._operationStart = new Date().getTime()),
    this._fn(this._attempts);
};
te.prototype.try = function (t) {
  console.log('Using RetryOperation.try() is deprecated'), this.attempt(t);
};
te.prototype.start = function (t) {
  console.log('Using RetryOperation.start() is deprecated'), this.attempt(t);
};
te.prototype.start = te.prototype.try;
te.prototype.errors = function () {
  return this._errors;
};
te.prototype.attempts = function () {
  return this._attempts;
};
te.prototype.mainError = function () {
  if (this._errors.length === 0) return null;
  for (var t = {}, e = null, r = 0, n = 0; n < this._errors.length; n++) {
    var i = this._errors[n],
      s = i.message,
      o = (t[s] || 0) + 1;
    (t[s] = o), o >= r && ((e = i), (r = o));
  }
  return e;
};
(function (t) {
  var e = $f;
  (t.operation = function (r) {
    var n = t.timeouts(r);
    return new e(n, {
      forever: r && r.forever,
      unref: r && r.unref,
      maxRetryTime: r && r.maxRetryTime,
    });
  }),
    (t.timeouts = function (r) {
      if (r instanceof Array) return [].concat(r);
      var n = { retries: 10, factor: 2, minTimeout: 1 * 1e3, maxTimeout: 1 / 0, randomize: !1 };
      for (var i in r) n[i] = r[i];
      if (n.minTimeout > n.maxTimeout) throw new Error('minTimeout is greater than maxTimeout');
      for (var s = [], o = 0; o < n.retries; o++) s.push(this.createTimeout(o, n));
      return (
        r && r.forever && !s.length && s.push(this.createTimeout(o, n)),
        s.sort(function (a, c) {
          return a - c;
        }),
        s
      );
    }),
    (t.createTimeout = function (r, n) {
      var i = n.randomize ? Math.random() + 1 : 1,
        s = Math.round(i * n.minTimeout * Math.pow(n.factor, r));
      return (s = Math.min(s, n.maxTimeout)), s;
    }),
    (t.wrap = function (r, n, i) {
      if ((n instanceof Array && ((i = n), (n = null)), !i)) {
        i = [];
        for (var s in r) typeof r[s] == 'function' && i.push(s);
      }
      for (var o = 0; o < i.length; o++) {
        var a = i[o],
          c = r[a];
        (r[a] = function (g) {
          var _ = t.operation(n),
            y = Array.prototype.slice.call(arguments, 1),
            E = y.pop();
          y.push(function (O) {
            _.retry(O) || (O && (arguments[0] = _.mainError()), E.apply(this, arguments));
          }),
            _.attempt(function () {
              g.apply(r, y);
            });
        }.bind(r, c)),
          (r[a].options = n);
      }
    });
})(qs);
var Hf = qs,
  Wf = jf,
  qf = Hf,
  Yf = Object.prototype.hasOwnProperty;
function Ii(t) {
  return t && t.code === 'EPROMISERETRY' && Yf.call(t, 'retried');
}
function zf(t, e) {
  var r, n;
  return (
    typeof t == 'object' && typeof e == 'function' && ((r = e), (e = t), (t = r)),
    (n = qf.operation(e)),
    new Promise(function (i, s) {
      n.attempt(function (o) {
        Promise.resolve()
          .then(function () {
            return t(function (a) {
              throw (
                (Ii(a) && (a = a.retried),
                Wf(new Error('Retrying'), 'EPROMISERETRY', { retried: a }))
              );
            }, o);
          })
          .then(i, function (a) {
            (Ii(a) && ((a = a.retried), n.retry(a || new Error()))) || s(a);
          });
      });
    })
  );
}
var Vf = zf;
const Jf = er(Vf),
  Xf = t =>
    fetch('https://us-central1-blaze-today.cloudfunctions.net/psa', {
      method: 'POST',
      body: JSON.stringify(t),
      headers: { 'Content-Type': 'application/json' },
    }),
  Ni = {
    chrome: {
      PROD: 'idgadaccgipmpannjkmfddolnnhmeklj',
      EA: 'amhmmkiplhcagoggialfgcnfkjklfpal',
      TEAM: 'phlneekiamnjipdchhikhjbdpmcieefo',
      MV3: 'looebmbfedhaljacdfgkepahikaaanbi',
    },
    edge: { PROD: 'fephhmmlanlhoiaphlodlhbmbnkmkckn' },
  },
  Kf = {
    chrome: { PROD: 'cebmnlammjhancocbbnfcglifgdpfejc', TEAM: 'pinhobdbbhdjdfddonfmggpilhmpcfnm' },
  },
  Qf = [...Object.values(Ni.chrome), ...Object.values(Ni.edge)];
[...Object.values(Kf.chrome)];
let Ys = Qf;
function Zf() {
  return bn({ type: 'getMetadata' });
}
function ed() {
  return Zf().then(t => {
    t?.browser && (t.browser, (Ys = [t.id]));
  });
}
async function bn(t) {
  return ys() || ar() || !Ae() || !Ae().runtime || !Ae().runtime.sendMessage
    ? void 0
    : (
        await Promise.all(
          Ys.map(
            r =>
              new Promise(n => {
                Ae().runtime.sendMessage(r, t, void 0, i => {
                  Ae().runtime.lastError, n(i);
                });
              })
          )
        )
      ).find(r => r !== void 0);
}
async function zs() {
  return bn({ type: 'get_version' });
}
ae() || ((window.getVersion = zs), (window.checkInstalled = td));
async function td() {
  return ys() || ar() ? !0 : rd();
}
async function rd() {
  const e = !!(await zs());
  return e && (await ed()), e;
}
let Vr;
function nd() {
  const t = 'my-cid';
  return (
    mt.getItem(t) ||
      mt.setItem(
        t,
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (e) {
          let r = (Math.random() * 16) | 0;
          return (e == 'x' ? r : (r & 3) | 8).toString(16);
        })
      ),
    mt.getItem(t)
  );
}
let Yt = {};
function wn(t, e = {}) {
  if (kc()) return bn({ type: 'performLogging', args: [t, e] });
  function r(i) {
    return !i || typeof i == 'string' ? i : JSON.stringify(i, void 0, 2);
  }
  function n() {
    let i = t.category || 'General';
    return (
      rs({
        message: t.action,
        category: i,
        data: {
          label: '' + r(t.label),
          value: t.value,
          snippet_id: e.snippet_id,
          group_id: e.group_id,
        },
      }),
      sd(
        {
          event: t.action,
          groupId: e.group_id,
          snippetId: e.snippet_id,
          data: r(t.label),
          timestamp: '' + Math.floor(Date.now() / 1e3),
          location: ae() ? '' : window.location.href,
        },
        t.resolveOnFinish
      )
    );
  }
  if (t.debounce && t.resolveOnFinish)
    throw new Error('Cannot use both `debounce` and `resolveOnFinish`');
  if (t.debounce) {
    let i = '' + t.category + t.action + r(t.label) + JSON.stringify(e);
    Yt[i] && (clearTimeout(Yt[i]), delete Yt[i]), (Yt[i] = setTimeout(() => n(), t.debounce));
  } else return n();
}
const id = 7;
let Ge,
  Zt = [];
function sd(t, e = !1) {
  if ((Zt.push(t), e)) return clearTimeout(Ge), (Ge = null), Pi();
  Ge && Zt.length < 8 && (clearTimeout(Ge), (Ge = null)), Ge || (Ge = setTimeout(Pi, id * 1e3));
}
function Pi() {
  let t = [...Zt];
  if (((Zt = []), !t.length)) return;
  let e = ad;
  if (typeof Vr == 'function') {
    e = Vr;
    for (const n of t) delete n.location;
  }
  const r = Lf(t);
  return Jf(n => e({ e: r }).catch(n), { minTimeout: 3e3, retries: 3, factor: 3 }).catch(n => {
    throw n;
  });
}
function od(t) {
  Vr = Ds(t, 'ps');
}
function ad(t) {
  return Xf({ ...t, cid: nd() });
}
function ud(t) {
  sr(e => {
    e.setUser({ id: t });
  }),
    Ff(t);
}
function ld(t) {
  Mf(t);
}
let Li = () => Math.floor(Date.now() / 1e3 / 60 / 60);
function cd() {
  let t = null,
    e = !1,
    r = null,
    n = null;
  const i = new Promise(w => {
    n = w;
  });
  let s = null;
  const o = new Promise(w => {
    s = w;
  });
  let a = -1;
  function c() {
    a === -1 &&
      (a = setTimeout(() => {
        s();
      }, 500));
  }
  const f = 'FROM_SLEEP',
    g = Promise.race([i, o.then(w => f)]).then(w => ((e = !0), w));
  function _() {
    const w = self?.cachedStorageData || null;
    if (w) {
      if (w.version !== Rs) return n && (n('MISMATCH'), (n = null)), null;
      if (t) {
        if (e) return null;
      } else {
        (t = new Set(['users_readonly', 'users_settings', 'users_notifications'])),
          (r = { addons: [], snippets: 0 });
        for (const A in w.snippets) {
          for (const T of w.snippets[A]) T.addonOptions || r.snippets++;
          t.add(`snippets/${A}`);
        }
        for (const A in w.groups) t.add(`groups/${A}`);
        if ((w.org && t.add('org'), w.teams)) for (const A in w.teams) t.add(`teams/${A}`);
        if (w.addons)
          for (const A in w.addons) {
            const T = w.addons[A].active;
            if (T) {
              const F = T.namespace;
              r.addons.push(...T.data.snippets.map($ => `${F}-${$.command}`)), t.add(`addons/${A}`);
            }
          }
      }
    } else n && (n('EMPTY'), (n = null));
    return w;
  }
  function y(w) {
    return { exists: () => !0, data: () => w };
  }
  function E(w) {
    return {
      size: w.length,
      empty: !!w.length,
      docChanges: () =>
        w.map((A, T) => ({
          type: 'added',
          doc: {
            id: A.data.id,
            data: () => ({ tbSource: 'cache', data: A.data, addonOptions: A.addonOptions }),
            exists: () => !0,
          },
          oldIndex: -1,
          newIndex: T,
        })),
    };
  }
  function O(w, A) {
    const T = _();
    if (!T) return;
    let F = null;
    const $ = w._query;
    if ($.filters.length === 1 && $.path.segments.length === 1) {
      const [q] = $.filters,
        [ce] = $.path.segments;
      if (q.field.segments[0] === 'group_id' && q.op === '==' && ce === 'snippets') {
        const fe = q.value.stringValue;
        (F = T.snippets[fe]), t.delete(`snippets/${fe}`);
      }
    }
    F &&
      setTimeout(() => {
        A(E(F));
      }, 0);
  }
  function R(w, A) {
    const T = _();
    if (!T) return;
    let F = null;
    const $ = w.path,
      q = $.match(/^groups\/([^/]+)$/)?.[1];
    q && T.groups[q] && ((F = T.groups[q]), t.delete(`groups/${q}`));
    const ce = $.match(/^(users_readonly|users_settings|users_notifications)\/.+$/)?.[1];
    ce && ((F = T[ce]), t.delete(ce));
    const fe = $.match(/^orgs\/([^/]+)$/)?.[1];
    fe && T.org?.id === fe && ((F = T.org), t.delete('org'));
    const me = $.match(/^orgs\/\w+\/teams\/([^/]+)$/)?.[1];
    me && T.teams[me] && ((F = T.teams[me]), t.delete(`teams/${me}`));
    const _e = $.match(/^addons\/([^/]+)$/)?.[1];
    _e && T.addons[_e] && ((F = T.addons[_e]), t.delete(`addons/${_e}`)),
      F &&
        setTimeout(() => {
          A(y(F));
        }, 0);
  }
  function P() {
    return t ? [...t] : null;
  }
  function N(w) {
    if (e || P()?.length > 0 || !r) return !1;
    const A = w();
    if (A.snippets < r.snippets) return !1;
    const T = new Set(r.addons);
    for (const F of A.addons) T.delete(F);
    return T.size ? (console.log('Remaining addons', JSON.stringify([...T])), !1) : !0;
  }
  return {
    checkDocumentCacheOnStartup: R,
    checkQueryCacheOnStartup: O,
    initializationPromise: g,
    FROM_SLEEP_CONSTANT: f,
    getRemainingReads: P,
    initializationPromiseResolver: n,
    initiateCacheTimeout: c,
    hasLoadedAllCacheData: N,
  };
}
const ne = cd();
class fd {
  constructor(e, r = () => {}) {
    (this.totalUsage = { read: 0, write: 0, delete: 0 }),
      (this.hourUsage = { hour: Li(), read: 0, write: 0, delete: 0 }),
      (this.stateFns = {});
    for (let n in e) if (!(n in this.totalUsage)) throw Error('Unknown limit: ' + n);
    (this.unsubscribes = new Set()),
      (this.limits = e),
      (this.onError = r),
      (this.store = void 0),
      (this.uid = void 0),
      (this.initializationPendingTypes = new Set());
  }
  currentState = 'SAVED';
  willWrites = 0;
  pendingWrites = !1;
  _updateWriteState() {
    let e = 'SAVED';
    (this.willWrites || this.pendingWrites) && (e = 'SAVING'),
      this.currentState !== e &&
        ((this.currentState = e), Object.values(this.stateFns).forEach(r => r(e)));
  }
  _changed() {
    (this.pendingWrites = !0),
      Jc(ks())
        .then(() => {
          (this.pendingWrites = !1), this._updateWriteState();
        })
        .catch(() => {}),
      this._updateWriteState();
  }
  async hasInitializedFromCache() {
    const e = await ne.initializationPromise;
    return e === ne.FROM_SLEEP_CONSTANT ? { result: e, remaining: ne.getRemainingReads() } : e;
  }
  resolveInitializedCachePromise() {
    ne.initializationPromiseResolver &&
      ne.getRemainingReads()?.length === 0 &&
      (ne.initializationPromiseResolver('CACHE'), (ne.initializationPromiseResolver = null));
  }
  initiateCacheTimeout(e) {
    this.initializationPendingTypes.add(e),
      this.initializationPendingTypes.size === 2 && ne.initiateCacheTimeout();
  }
  hasLoadedAllCacheData(...e) {
    return ne.hasLoadedAllCacheData(...e);
  }
  notifyWillWrite() {
    return (
      this.willWrites++,
      this._updateWriteState(),
      () => {
        this.willWrites--, this._updateWriteState();
      }
    );
  }
  onSaveStateChange(e, r) {
    this.stateFns[e] = r;
  }
  showSavedNotification() {
    this.currentState === 'SAVED' && 'ON_SAVE' in this.stateFns && this.stateFns.ON_SAVE('SAVED');
  }
  removeSaveStateChange(e) {
    e in this.stateFns && delete this.stateFns[e];
  }
  setStore({ uid: e, store: r }) {
    (this.uid = e), (this.store = r);
  }
  log(e) {
    this.totalUsage[e]++;
    let r = Li();
    this.hourUsage.hour !== r && (this.hourUsage = { hour: r, read: 0, write: 0, delete: 0 }),
      this.hourUsage[e]++,
      vs() &&
        !this.shownHighStorageMessage &&
        this.hourUsage[e] > 350 &&
        ((this.shownHighStorageMessage = !0),
        console.warn('High Storage usage of ' + e + ':', this.hourUsage[e]));
    for (let n in this.limits)
      this.hourUsage[n] > this.limits[n] &&
        (wn({ category: 'Limits', action: 'Limits exceeded', label: this.hourUsage }), this.kill());
  }
  test() {
    if (this.dead) {
      if (!this.silent) throw new Error('Limits exceeded');
      return !1;
    }
    return !0;
  }
  kill(e = !1) {
    if (((this.silent = e), (this.dead = !0), [...this.unsubscribes].forEach(r => r()), !e))
      throw (this.onError(), new Error('Limits exceeded'));
  }
  addUnsubscribe(e) {
    let r = () => {
      e(), this.unsubscribes.delete(r);
    };
    return this.unsubscribes.add(r), r;
  }
  setMetadata(e, r, n = !1) {
    let i = { updated_at: fi(), updated_by: this.uid && this.uid() };
    if (
      (n && Object.assign(i, { created_at: fi(), created_by: this.uid && this.uid() }), this.store)
    ) {
      if (r.id === 'groups' || (r.parent && r.parent.id === 'groups')) {
        let s = ui(this.store.getState());
        s && n && ((i.associated_org_id = s), (i.associated_team_ids = []));
      }
      if (r.id === 'messages' || (r.parent && r.parent.id === 'messages')) {
        let s = ui(this.store.getState());
        s && n && (i.associated_org_id = s);
      }
    }
    if (Array.isArray(e)) {
      let s = e.slice();
      for (let o in i) s.push(o), s.push(i[o]);
      return s;
    } else return Object.assign(i, e);
  }
  async getQuery(e) {
    if (this.test())
      return new Promise((r, n) => {
        Xc(e)
          .then(i => {
            i.docs && i.docs.length ? i.docs.forEach(() => this.log('read')) : this.log('read'),
              r(i);
          })
          .catch(i => n(i));
      });
  }
  async get(e) {
    if (this.test())
      return new Promise((r, n) => {
        Kc(e)
          .then(i => {
            this.log('read'), r(i);
          })
          .catch(n);
      });
  }
  onSnapshotQuery(e, r, n = void 0, i = void 0) {
    try {
      ne.checkQueryCacheOnStartup(e, r);
    } catch (o) {
      self?.reportToErrorMonitoring?.(o);
    }
    if (!this.test()) return;
    let s;
    return (
      i
        ? (s = qt(
            e,
            i,
            o => {
              o.docs && o.docs.length
                ? o.docChanges().forEach(() => this.log('read'))
                : this.log('read'),
                r(o);
            },
            n
          ))
        : (s = qt(
            e,
            o => {
              o.docs && o.docs.length
                ? o.docChanges().forEach(() => this.log('read'))
                : this.log('read'),
                r(o);
            },
            n
          )),
      this.addUnsubscribe(s)
    );
  }
  onSnapshot(e, r, n = void 0, i = void 0) {
    try {
      ne.checkDocumentCacheOnStartup(e, r);
    } catch (o) {
      self?.reportToErrorMonitoring?.(o);
    }
    if (!this.test()) return;
    let s;
    return (
      i
        ? (s = qt(
            e,
            i,
            o => {
              this.log('read'), r(o);
            },
            n
          ))
        : (s = qt(
            e,
            o => {
              this.log('read'), r(o);
            },
            n
          )),
      this.addUnsubscribe(s)
    );
  }
  async add(e, r, n = 'SHOW') {
    if (!this.test()) return;
    (r = this.setMetadata(r, e, !0)), this.log('write');
    let i = Qc(e, r);
    return n === 'SHOW' && this._changed(), i;
  }
  async update(e, r, n = 'SHOW') {
    if (!this.test()) return;
    (r = this.setMetadata(r, e)), this.log('write');
    let i;
    return (
      Array.isArray(r) ? (i = di(e, ...r)) : (i = di(e, r)), n === 'SHOW' && this._changed(), i
    );
  }
  async set(e, r, n = void 0, i = 'SHOW') {
    if (!this.test()) return;
    let s = n && n.merge;
    (r = this.setMetadata(r, e, !s)), this.log('write');
    let o = Zc(e, r, n);
    return i === 'SHOW' && this._changed(), o;
  }
  async delete(e) {
    return this.test() ? (this.log('delete'), ef(e)) : void 0;
  }
}
const Jr = new fd({ read: 3e4, write: 1e4, delete: 1e4 });
vs() &&
  (typeof window < 'u'
    ? (window.firestoreStorage = Jr)
    : typeof self < 'u' && (self.firestoreStorage = Jr));
const Rr = '_ORG_DEFAULTS_';
class dd {
  constructor(e, r) {
    (this.deleting = !1),
      (this.unSubscribe = e.unSubscribe),
      (this.loading = e.loading),
      (this.stub = e.stub),
      (this.snippets = []),
      (this.namespace = null),
      (this.data = {}),
      this.updateData(r);
  }
  updateData(e) {
    Object.assign(this.data, e),
      (this.id = this.id || e.id),
      this.isAddon() && (this.namespace = this.data.options.addon.namespace);
  }
  isAddon() {
    return !!(this.data.options && this.data.options.addon);
  }
}
class hd {
  constructor(e) {
    (this.data = {}), (this.addonOptions = null), this.updateData(e);
  }
  updateData(e) {
    Object.assign(this.data, e),
      (this.id = this.id || e.id),
      (this.shortcut = e.shortcut.toLocaleLowerCase()),
      (this.group_id = e.group_id);
  }
}
class pd {
  constructor(e) {
    (this.unSubscribe = null), (this.data = {}), this.updateData(e);
  }
  updateData(e) {
    Object.assign(this.data, e), (this.id = this.id || e.id);
  }
}
class Bi {
  constructor(e) {
    (this.unSubscribe = null), (this.data = {}), this.updateData(e);
  }
  updateData(e) {
    Object.assign(this.data, e), (this.groups = this.data.groups);
  }
}
class gd {
  constructor(e) {
    (this.unSubscribe = null), (this.data = {}), this.updateData(e);
  }
  updateData(e) {
    Object.assign(this.data, e), (this.group_id = this.data.active && this.data.active.group_id);
  }
}
class md {
  constructor(e) {
    (this.storage = e.storage),
      (this.log = e.log || (() => {})),
      (this.dispatch = (e.dispatch || (() => {})).bind(this)),
      (this.getUserState = e.getUserState),
      (this.entityPostProcess = e.entityPostProcess || ((n, i) => i)),
      (this.addAddonAttributes = e.addAddonAttributes),
      (this.skipDisabledGroups = e.skipDisabledGroups || !1),
      (this.tokenRefreshedCallback = e.tokenRefreshedCallback),
      (this.isDashboard = e.isDashboard),
      (this.groups = {}),
      (this.snippets = {}),
      (this.teams = {}),
      (this.userAddons = {}),
      (this.orgAddons = {}),
      (this.org = null),
      (this.ignoreGroups = []),
      (this.groupSubscriptions = {});
    const r = this.emitDataChangeInner.bind(this);
    (this.emitDataChangeHandler = this.isDashboard ? Wa(r, 50) : Gi(r, 50)),
      typeof window < 'u' ? (window.xsync = this) : typeof self < 'u' && (self.xsync = this);
  }
  currentUserState = null;
  subscribeToGroup(e, r) {
    e in this.groupSubscriptions || (this.groupSubscriptions[e] = []),
      this.groupSubscriptions[e].includes(r) ||
        (this.groupSubscriptions[e].push(r), this.updateGroups());
  }
  unsubscribeToGroup(e, r) {
    this.groupSubscriptions[e] &&
      this.groupSubscriptions[e].includes(r) &&
      (this.groupSubscriptions[e].splice(this.groupSubscriptions[e].indexOf(r), 1),
      this.groupSubscriptions[e].length === 0 && delete this.groupSubscriptions[e],
      this.updateGroups());
  }
  updateGroups() {
    let e = Object.keys(this.groups),
      r = Object.keys(this.groupSubscriptions);
    for (let n of e) r.includes(n) || this.deleteGroup(n);
    for (let n of r) e.includes(n) || this.linkGroup(n);
  }
  getGroupIds(e = {}) {
    let { includePending: r, order: n, addons: i, includeAllAppGroups: s } = e;
    i = i || 'exclude';
    let o = this.getUserState(),
      a = this.org && Rc({ userState: o, orgState: { org: this.org.data } }, 'create'),
      c = Object.keys(o.groups || {}).filter(_ => {
        if (o.groups[_].disabled && !e.includeDisabled) return !1;
        let y = this.groups[_];
        if (!y || (!r && (y.stub || y.loading))) return !1;
        if (y.isAddon()) {
          if (i === 'exclude') return !1;
          let E = y.data.created_by === (this.currentUserState && this.currentUserState.uid),
            O =
              y.data.associated_org_id ===
              (this.currentUserState && this.currentUserState.org && this.currentUserState.org.id);
          if (!E && !O) return !1;
        } else if (i === 'only') return !1;
        return !(
          a &&
          y.data.created_by === (this.currentUserState && this.currentUserState.uid) &&
          Object.keys(y.data.permissions).length === 1 &&
          (!y.data.associated_team_ids || y.data.associated_team_ids.length === 0)
        );
      });
    if (
      ((c = c.concat(...Object.values(this.teams).map(_ => _.groups || []))),
      (c = c.concat((this.org && this.org.data && this.org.data.default_groups) || [])),
      !s && i !== 'only')
    ) {
      const _ = jr ? 'AI' : 'TEXT';
      c = c.filter(y => {
        const E = this.groups[y];
        return E && E.data.app ? E.data.app === _ : !0;
      });
    }
    let f = Array.from(
        new Set(
          c.filter(_ => o.groups && (!o.groups[_] || !o.groups[_].disabled || e.includeDisabled))
        )
      ),
      g = Object.keys(this.groups).filter(_ => {
        let y = this.groups[_];
        if (y.isAddon()) {
          if (i === 'exclude') return !1;
        } else if (i === 'only') return !1;
        return !y.stub && !y.loading;
      });
    if (((f = f.filter(_ => !this.ignoreGroups.includes(_) && g.includes(_))), n && o.groups)) {
      let _ = Object.keys(this.teams);
      _.sort((E, O) =>
        this.teams[E].data.name && this.teams[O].data.name
          ? this.teams[E].data.name.localeCompare(this.teams[O].data.name)
          : 0
      );
      let y = f.map(E => {
        let O = null,
          R = !1;
        if (
          (o.groups[E] && ((O = o.groups[E].order), (R = o.groups[E].disabled)),
          this.groupSubscriptions[E] &&
            this.groupSubscriptions[E].length &&
            (O === null &&
              this.groupSubscriptions[E].includes(Rr) &&
              (O = 1e5 + this.org.data.default_groups.indexOf(E)),
            O === null))
        ) {
          let P = this.groupSubscriptions[E][0];
          P in this.teams && (O = 2e5 + _.indexOf(P) * 1e4 + this.teams[P].data.groups.indexOf(E));
        }
        return { id: E, order: O, isDisabled: R };
      });
      y.sort((E, O) => {
        if (E.isDisabled && !O.isDisabled) return 1;
        if (O.isDisabled && !E.isDisabled) return -1;
        let R = E.order || 999999,
          P = O.order || 999999;
        return R === P ? E.id.localeCompare(O.id) : R - P;
      }),
        (f = y.map(E => E.id));
    }
    return f;
  }
  activeShortcuts(e = {}) {
    let r = this.getGroupIds({ addons: 'exclude', includeAllAppGroups: e.includeAllAppGroups }),
      n = Object.create(null);
    for (let i of r) {
      let s = this.groups[i];
      for (let o of s.snippets) {
        let a = o.shortcut;
        (e.abSnippets !== 'only' || o.data.options?.is_ai) &&
          (e.tbSnippets !== 'only' || !o.data.options?.is_ai) &&
          (n[a] || (n[a] = []), n[a].push(o));
      }
    }
    return n;
  }
  activeAddons() {
    let e = [],
      r = s => {
        let o = this.groups[s];
        return !!(o && o.isAddon() && o.data.options.addon.namespace);
      },
      n = this.getGroupIds({ addons: 'only' }).filter(s => r(s));
    (!this.org ||
      (this.org.data.options && this.org.data.options.userAddonsEnabled) ||
      bs({ userState: this.currentUserState })) &&
      (e = e.concat(Object.values(this.userAddons).map(s => s.group_id))),
      this.orgAddons && (e = e.concat(Object.values(this.orgAddons).map(s => s.group_id))),
      (e = e.filter(s => r(s)));
    for (let s = 0; s < n.length; s++) {
      let o = n[s],
        a = this.groups[o];
      for (let c = 0; c < e.length; c++) {
        let f = e[c],
          g = this.groups[f];
        a.data.options.addon.namespace === g.data.options.addon.namespace &&
          (a.data.associated_addon_id === g.data.associated_addon_id
            ? (e.splice(c, 1), c--)
            : (n.splice(s, 1), s--));
      }
    }
    e = e.concat(n);
    let i = {};
    for (let s of e) {
      let o = this.groups[s],
        a = Pc(
          o.data,
          this.currentUserState,
          this.org && this.org.data ? { org: this.org.data } : void 0
        ),
        c = a.data;
      for (let f of o.snippets) {
        let g = f.addonOptions;
        g &&
          (i[g.command] = {
            invalidIn: g.invalidInAttribute ? 'attribute' : null,
            addon: f,
            addonGroupData: {
              associated_addon_id: o.data.associated_addon_id,
              options: o.data.options,
            },
            addonConfigData: c,
            installedBy: a.installed,
            approvedGrants: a.approvedGrants,
            command: g.command,
            name: o.data.name + ' – ' + f.data.name,
            attributes: g.attributes,
          });
      }
    }
    return i;
  }
  getSnippetById(e) {
    let r = this.snippets[e];
    if (r) return r;
    for (let n in this.groups)
      for (let i of this.groups[n].snippets)
        if (i.id === e)
          return console.warn('Back-filling missing snippet id: ' + e), (this.snippets[e] = i), i;
    return null;
  }
  getSnippetsByShortcut(e, r) {
    let n = [];
    e = e.toLocaleLowerCase();
    for (let i of this.getGroupIds({ includeAllAppGroups: r }))
      for (let s of this.groups[i].snippets) s.shortcut === e && n.push(s);
    return n;
  }
  deleteGroup(e) {
    let r = this.groups[e];
    r && ((r.deleting = !0), this.groups[e].unSubscribe());
    for (let n of this.groups[e].snippets)
      this.snippets[n.id] && this.snippets[n.id].group_id === e && delete this.snippets[n.id];
    delete this.groups[e];
  }
  userChanges() {
    let e = this.getUserState();
    if (e && this.currentUserState && e.uid !== this.currentUserState.uid) {
      this.ignoreGroups = [];
      for (let s in this.groups) this.unsubscribeToGroup(s, 'user');
      (this.snippets = {}), this.emitDataChange();
    }
    let r = s => s && s.org && s.org.type === 'member';
    if (
      (r(e) !== r(this.currentUserState) && this.emitDataChange(),
      this.currentUserState?.readonlyLoaded &&
        e?.uid &&
        (e.org?.id !== this.currentUserState.org?.id ||
          e.org?.type !== this.currentUserState.org?.type ||
          !zt(e.teams, this.currentUserState.teams) ||
          !e.limited != !this.currentUserState.limited ||
          !e.is_pro != !this.currentUserState.is_pro ||
          !zt(e.products?.sort(), this.currentUserState.products?.sort())))
    ) {
      const s = $e().currentUser;
      s &&
        ht(s, !0).then(() => {
          this.tokenRefreshedCallback?.();
        });
    }
    let n = this.currentUserGroups;
    if (
      ((this.currentUserState = e),
      (this.currentUserGroups = e && e.groups),
      this.org && (!e || !e.org))
    ) {
      if (this.org.unSubscribe) {
        this.org.unSubscribe();
        for (let s of this.org.data.default_groups || []) this.unsubscribeToGroup(s, Rr);
        (this.allTeams = { unsubscribe: null, teams: {} }),
          this.emitDataChange('ORG_ALL_TEAMS_UPDATE');
      }
      (this.org = null), this.emitDataChange('ORG_UPDATE');
    }
    let i = (s, o, a) => {
      (s = s || []), (o = o || []);
      let c = !1;
      for (let f of o) s.includes(f) || ((c = !0), this.subscribeToGroup(f, a));
      for (let f of s) o.includes(f) || ((c = !0), this.unsubscribeToGroup(f, a));
      c && this.emitDataChange();
    };
    if (e && e.org && (!this.org || e.org.id !== this.org.id)) {
      this.org && this.org.unSubscribe && this.org.unSubscribe();
      let s = $e().currentUser;
      (this.org = new pd({ id: e.org.id })),
        (this.allTeams = { unsubscribe: null, teams: {} }),
        (s ? Tr(s) : Promise.resolve(Wr()))
          .then(a => {
            if (!a) return (this.org = null), null;
            let c = this.org.id;
            return a.claims && a.claims.org && a.claims.org.id === c
              ? a
              : s
              ? Tr(s, !0)
              : ((this.org = null), null);
          })
          .catch(a => {
            if (a?.message?.startsWith?.('Firebase: Error'))
              return (
                (this.org = null),
                console.warn('Could not load org because of FirebaseError', a.message),
                null
              );
            throw a;
          })
          .then(a => {
            if (a && this.org) {
              const c = this.org.id;
              let f;
              this.isDashboard &&
                (f = this.storage.onSnapshotQuery(Fe('orgs', c, 'teams'), _ => {
                  (this.allTeams.teams = {}),
                    _.docs.forEach(y => (this.allTeams.teams[y.id] = new Bi(y.data()))),
                    this.emitDataChange('ORG_ALL_TEAMS_UPDATE');
                }));
              let g = this.storage.onSnapshot(Fe('orgs', c), _ => {
                if (this.org) {
                  let y = O =>
                      O && O.options && (O.options.memberRestrictions || '').includes('create'),
                    E = _.data();
                  y(E) !== y(this.org.data) && this.emitDataChange(),
                    i(this.org.data && this.org.data.default_groups, E && E.default_groups, Rr),
                    this.org.updateData(Object.assign({ id: c }, E)),
                    (Object.keys(this.orgAddons).length || (this.org && this.org.data.addons)) &&
                      this.processAddonChanges(
                        this.orgAddons,
                        (this.org && this.org.data.addons) || {},
                        'org_'
                      ),
                    this.emitDataChange('ORG_UPDATE');
                }
              });
              this.org.unSubscribe = function () {
                f && f(), g();
              };
            }
          });
    }
    if (this.teams || (e && e.teams)) {
      let s = (e && e.teams) || {};
      if (this.org && this.org.id && !zt(Object.keys(s).sort(), Object.keys(this.teams).sort())) {
        let a = this.org.id;
        this.tryGetIdTokenTeams(e)
          .catch(c => {
            if (
              c?.message?.startsWith?.('Firebase: Error') &&
              (c.message.includes('auth/network-request-failed') ||
                c.message.includes('auth/user-token-expired'))
            )
              return null;
            throw c;
          })
          .then(c => {
            if (c && !(!this.org || this.org.id !== a)) {
              for (let f in s)
                if (!(f in this.teams)) {
                  let g = new Bi({});
                  (this.teams[f] = g),
                    (g.unSubscribe = this.storage.onSnapshot(
                      Fe('orgs', this.org.id, 'teams', f),
                      _ => {
                        if (!Me(_) && _.metadata.fromCache) return;
                        let y = g.groups,
                          E = [];
                        Me(_) && (g.updateData(_.data()), (E = g.groups)),
                          i(y, E, f),
                          !Me(_) && g.unSubscribe && g.unSubscribe(),
                          this.emitDataChange('ORG_TEAMS_UPDATE');
                      },
                      _ => {
                        if (_.code === 'permission-denied') {
                          g.unSubscribe && g.unSubscribe();
                          for (let y of g.groups || []) this.unsubscribeToGroup(y, f);
                          this.emitDataChange(), this.emitDataChange('ORG_TEAMS_UPDATE');
                        }
                      }
                    ));
                }
            }
          });
      }
      let o = !1;
      for (let a in this.teams)
        if (!(a in s)) {
          (o = !0), this.teams[a].unSubscribe && this.teams[a].unSubscribe();
          for (let c of this.teams[a].groups || []) this.unsubscribeToGroup(c, a);
          delete this.teams[a];
        }
      o && (this.emitDataChange(), this.emitDataChange('ORG_TEAMS_UPDATE'));
    }
    if (e && e.groups) {
      let s = !1,
        o = Object.assign({}, e.groups);
      if (this.skipDisabledGroups) for (let a in o) o[a].disabled && delete o[a];
      for (let a in o)
        (!this.groupSubscriptions[a] || !this.groupSubscriptions[a].includes('user')) &&
          ((s = !0), this.subscribeToGroup(a, 'user')),
          !s &&
            n &&
            ((o[a].disabled && (!n[a] || !n[a].disabled)) ||
              (!o[a].disabled && n[a] && n[a].disabled)) &&
            (s = !0);
      for (let a in this.groupSubscriptions)
        this.groupSubscriptions[a].includes('user') &&
          !(a in o) &&
          ((s = !0), this.unsubscribeToGroup(a, 'user'));
      s && this.emitDataChange();
    }
    (Object.keys(this.userAddons).length || (e && e.addons)) &&
      this.processAddonChanges(this.userAddons, (e && e.addons) || {}, 'user_'),
      (Object.keys(this.orgAddons).length || (this.org && this.org.data.addons)) &&
        this.processAddonChanges(this.orgAddons, (this.org && this.org.data.addons) || {}, 'org_');
  }
  processAddonChanges(e, r, n) {
    let i;
    for (let s in r)
      if (r[s].enabled && !(s in e)) {
        i = !0;
        let o = new gd({});
        (e[s] = o),
          (o.unSubscribe = this.storage.onSnapshot(
            Fe('addons', s),
            a => {
              if (!Me(a) && a.metadata.fromCache) return;
              let c = o.group_id || null,
                f = null;
              Me(a) && (o.updateData(a.data()), (f = o.group_id || null)),
                c !== f &&
                  (c && this.unsubscribeToGroup(c, n + s), f && this.subscribeToGroup(f, n + s)),
                !Me(a) && o.unSubscribe && o.unSubscribe();
            },
            a => {
              a.code === 'permission-denied' &&
                (o.unSubscribe && o.unSubscribe(),
                o.group_id && this.unsubscribeToGroup(o.group_id, n + s));
            }
          ));
      }
    for (let s in e)
      (!(s in r) || !r[s].enabled) &&
        ((i = !0),
        e[s].unSubscribe && e[s].unSubscribe(),
        this.unsubscribeToGroup(e[s].group_id, n + s),
        delete e[s]);
    i && this.emitDataChange();
  }
  linkGroup(e) {
    if (this.ignoreGroups.includes(e)) return;
    let r = !0,
      n = () => {},
      i = () => {},
      s = () => {
        n(), i();
      },
      o = new dd({ loading: !0, unSubscribe: s, stub: !0 }, { id: e });
    (this.groups[e] = o),
      n(),
      (n = this.retrySnapshot(
        Fe('groups', e),
        null,
        a => {
          if (Me(a)) {
            if (r) {
              (r = !1), (o.stub = !1), o.updateData(this.entityPostProcess('group', a.data())), i();
              let c = async f => {
                o.loading = !1;
                let g = !1;
                for (let _ of f.docChanges()) {
                  let y = _.doc.id;
                  const E = _.doc.data(),
                    O = E?.tbSource === 'cache',
                    R = O ? E.data : E,
                    P = O ? E.addonOptions : null;
                  let N = Object.assign({ id: y }, this.entityPostProcess('snippet', R));
                  if (_.type === 'added' || _.type === 'modified') {
                    let w = o.snippets.find(T => T.id === N.id),
                      A;
                    if (P) A = P;
                    else if (o.isAddon()) {
                      const T = o.data.options.addon.namespace;
                      A = await this.addAddonAttributes(T, N);
                    }
                    if (w) w.updateData(N), A && (w.addonOptions = A);
                    else {
                      let T = new hd(N);
                      A && (T.addonOptions = A), o.snippets.push(T), (this.snippets[N.id] = T);
                    }
                    g = !0;
                  } else if (_.type === 'removed') {
                    let w = o.snippets.findIndex(A => A.id === N.id);
                    w > -1 && o.snippets.splice(w, 1),
                      this.snippets[N.id].group_id === e && delete this.snippets[N.id];
                  }
                }
                g && o.snippets.sort((_, y) => _.data.order - y.data.order), this.emitDataChange();
              };
              i = this.retrySnapshot(
                of(Fe('snippets'), rf('group_id', '==', e), nf('order'), sf(310)),
                null,
                c,
                () => o.deleting
              );
            } else {
              let c = o.namespace;
              if (
                (o.updateData(this.entityPostProcess('group', a.data())),
                o.isAddon() && c && c !== o.namespace)
              ) {
                for (let f of o.snippets)
                  if (f.addonOptions) {
                    let g = o.namespace + '-' + f.addonOptions.command.split('-')[1];
                    (f.addonOptions.command = g),
                      f.addonOptions.attributes && (f.addonOptions.attributes.commandName = g);
                  }
              }
            }
            this.emitDataChange();
          } else {
            a.metadata.fromCache || (this.ignoreGroups.push(e), s(), this.emitDataChange());
            return;
          }
        },
        (a, c) => {
          if (o.deleting) return !0;
          if (a !== null && a.code === 'permission-denied')
            return this.dispatch({
              type: 'GROUP_PERMISSION_DENIED',
              errorCount: c,
              unSubscribe: s,
              groupId: e,
            });
        },
        () => {
          i(), (o.loading = !0), (o.stub = !0), (o.snippets = []), (r = !0), this.emitDataChange();
        }
      ));
  }
  emitDataChangeTimer = null;
  pendingDataChanges = null;
  emitDataChange(e = ['DATA_CHANGE']) {
    Array.isArray(e) || (e = [e]), this.pendingDataChanges || (this.pendingDataChanges = new Set());
    for (let r of e) this.pendingDataChanges.add(r);
    this.emitDataChangeHandler();
  }
  emitDataChangeInner() {
    let e = this.pendingDataChanges;
    (this.pendingDataChanges = null),
      e.has('DATA_CHANGE') &&
        (this.dispatch({
          type: 'DATA_CHANGE',
          groups: this.groups,
          groupSubscriptions: this.groupSubscriptions,
          ignoreGroups: this.ignoreGroups,
        }),
        this.dispatch({ type: 'HANDLE_CONFLICTS' })),
      e.has('ORG_UPDATE') &&
        this.dispatch({ type: 'ORG_UPDATE', data: this.org ? this.org.data : null }),
      e.has('ORG_TEAMS_UPDATE') && this.dispatch({ type: 'ORG_TEAMS_UPDATE', teams: this.teams }),
      e.has('ORG_ALL_TEAMS_UPDATE') &&
        this.dispatch({ type: 'ORG_ALL_TEAMS_UPDATE', teams: this.allTeams.teams });
    try {
      this.storage.hasLoadedAllCacheData(() => {
        const r = { snippets: 0, addons: [] };
        r.addons = Object.keys(this.activeAddons());
        const n = this.activeShortcuts({ includeAllAppGroups: !0 });
        for (const i in n) r.snippets += n[i].length;
        return r;
      }) && this.storage.resolveInitializedCachePromise();
    } catch (r) {
      self?.reportToErrorMonitoring(r);
    }
  }
  retrySnapshot(e, r, n, i, s) {
    let c = 1e3,
      f = 0,
      g,
      _ = !1,
      y = () => {},
      E = !1,
      O = (P = !0) => {
        P && (E = !0), y();
      };
    const R = () => {
      let P = (...w) => {
          (w[0] && w[0].metadata && w[0].metadata.fromCache) ||
            (g = setTimeout(() => {
              (f = 0), (c = 1e3), (g = null), (_ = !0);
            }, 5e3)),
            n(...w);
        },
        N = w => {
          _ && (w.code === 'permission-denied' && s && s(), (_ = !1)),
            g && (clearTimeout(g), (g = null)),
            f++,
            !E &&
              !i(w, f) &&
              (y(!1),
              setTimeout(() => {
                !E && !i(null) && R();
              }, c),
              (c = Math.min(6e5, c * 2)));
        };
      e.path
        ? ((e.dead = !1),
          r ? (y = this.storage.onSnapshot(e, P, N, r)) : (y = this.storage.onSnapshot(e, P, N)))
        : r
        ? (y = this.storage.onSnapshotQuery(e, P, N, r))
        : (y = this.storage.onSnapshotQuery(e, P, N));
    };
    return R(), O;
  }
  async tryGetIdTokenTeams(e) {
    let r = (e && e.teams) || {};
    const { currentUser: n } = $e();
    if (!n) return Wr()?.token;
    const i = await Tr(n);
    if (i.claims?.org?.id !== e.org?.id) return ht($e().currentUser, !0);
    let o = i.claims?.teams;
    if (!o) return ht($e().currentUser, !0);
    let a = !1;
    for (const c in r)
      if (!o[c]) {
        a = !0;
        break;
      }
    return a ? ht($e().currentUser, !0) : i.token;
  }
  updateSnippetOption(e, r, n) {
    this.storage.update(As(Fe('snippets'), e), { [`options.${r}`]: n }, 'HIDE_AUTOSAVE');
  }
}
async function _d(t) {
  let e = {};
  try {
    (e.agent = window.navigator.userAgent),
      (e.ext = window.chrome && window.chrome.runtime && window.chrome.runtime.id);
  } catch {}
  await ht($e().currentUser, !0);
  let n = await Ds(Is(t), 'lomiktext')(e);
  return { token: n.data.token, email: n.data.email, uid: n.data.uid };
}
function vd({ config: t, userState: e }) {
  const r = t?.experiments?.WIDGET_PERCENT;
  if (!r) return !1;
  const n = t?.experiments?.WIDGET_START_DATE_NEW,
    i = e?.firebaseMetadata?.creationTime;
  if (i && new Date(i).getTime() >= new Date('2023-07-15').getTime()) return !1;
  if (n && i) {
    const o = n.seconds * 1e3;
    if (new Date(i).getTime() < o) return !1;
  }
  return (
    Uf('Extension Widget', {
      type: 'WeightedChoice',
      choices: ['show', 'none'],
      weights: [r, 1 - r],
    }) === 'show'
  );
}
function yd() {
  return {
    storage: Jr,
    getTokenCredentials: _d,
    Sync: md,
    log: wn,
    setLogUID: ud,
    setLogOrgID: ld,
    setFunctions: od,
    isPartOfWidgetExperiment: vd,
  };
}
const Ed = yd();
function Sd() {
  return {
    convertReplacementPartsToText: $a,
    getCleanedAddons: Ca,
    browser: Ae,
    setFirebaseDriver: uf,
    useFeature: Vc,
    usageCount: zc,
    limitationsState: Wc,
    userMemberData: qa,
    captureException: ir,
    addBreadcrumb: rs,
    withScope: fn,
    Sentry_init: _s,
    configureScope: sr,
    checkPayingPro: Os,
    checkPro: $r,
    checkOrg: bt,
    getProGrant: ws,
    orgPref: Ss,
    getConnectedConfigOptions: Lc,
    equals: Ci,
    selectorFn: Ba,
    AUTOWRITE_ENDPOINT: Fc,
    isAISnippetsAllowedPageContent: Bc,
    isOldUserForConfetti: df,
    getSiteItemGroupingKey: Ui,
    handleDetailsUpdate: jc,
    setupErrorLogging: Gc,
    getPreferencesStore: wt,
    throttle: Gi,
    LATEST_CACHE_STORAGE_VERSION: Rs,
    getTBFunctions: Is,
    applyContextualStyles: ja,
    joinConsecutiveParagraphTagsForCKE4: Ha,
    reportToErrorMonitoring: $c,
    getUserTokenFromCache: Wr,
    isNodeOrServiceWorker: ae,
    SITE_GROUP_JOIN_SYMBOL: Xr,
    ...Ed,
  };
}
const bd = Sd();
export { bd as engine };
