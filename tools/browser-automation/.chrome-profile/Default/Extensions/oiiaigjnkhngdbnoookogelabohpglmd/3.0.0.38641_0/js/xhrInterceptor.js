!(function () {
  var e = {
      2888: function (e, t, r) {
        'use strict';
        r.r(t);
        r.d(t, {
          interceptSend: function () {
            return b;
          },
        });
        const n = (e, t) => {
            for (const r in e)
              if (e.hasOwnProperty(r)) {
                if (t(e[r])) return [r];
                const o = e[r];
                if ('object' == typeof o) {
                  const e = n(o, t);
                  if (null != e) {
                    e.unshift(r);
                    return e;
                  }
                }
              }
            return null;
          },
          o = (e, t) => t.reduce((e, t) => e[t], e),
          a = (e, t, r) => {
            const n = [...t],
              a = n.pop();
            o(e, n)[a] = r;
          },
          i = (e, t, r) => {
            for (; t && t.length >= 0; ) {
              const a = n(o(e, t), r);
              if (null != a) return t.concat(a);
              if (!(t.length > 0)) break;
              t = t.slice(0, t.length - 1);
            }
            return null;
          };
        let s = null;
        const c = 'data-hbstrk',
          l = 'data-hbsasc',
          d = e => {
            const t = document.createElement('div');
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
              s ||
                (s = window.trustedTypes.createPolicy('GmailXhrInterceptor', {
                  createHTML: e => e,
                }));
              t.innerHTML = s.createHTML(e);
            } else t.innerHTML = e;
            const r = t.childNodes[0];
            return r ? r.nodeValue : '';
          },
          p = e => {
            const t = { trackerData: null, associationData: null, parsedEmailBody: null },
              r = e.match(new RegExp(`${c}="(.*?)"`));
            if (r) {
              const [n, o] = r;
              t.trackerData = JSON.parse(d(o));
              e = e.replace(n, '');
            }
            const n = e.match(new RegExp(`<div ${l}="(.*?)"></div>`));
            if (n) {
              const [r, o] = n;
              t.associationData = JSON.parse(d(o));
              e = e.replace(r, '');
            }
            t.parsedEmailBody = e;
            return t;
          },
          u = (e, t) => {
            document.dispatchEvent(
              new CustomEvent(t, { detail: Object.assign({}, e, { sender: 'SIG_EXTENSION' }) })
            );
          },
          f = e => u(e, 'TRACKER_GENERATED'),
          y = e => u(e, 'ASSOCIATION_GENERATED'),
          m = /^thread-\w{1,3}:(\w{1,6}-?){0,3}\d{10,25}/,
          g = /^msg-\w{1,3}:(\w{1,6}-?){0,3}\d{10,25}$/,
          h = e => /sync\/(?:u\/\d+\/)?i\/s/.test(e),
          w = e => t => !('string' != typeof t || !t.match(e)),
          E = (e, t) => {
            const r = o(e, i(e, t, w(m)));
            return { messageId: o(e, i(e, t, w(g))), threadId: r };
          },
          _ = e => {
            const t = JSON.parse(e);
            let r = n(t, w(`(${c}|${l})`));
            const i = n(t, w(`(${c})`));
            if (!!r) {
              let e = o(t, r),
                { trackerData: n, associationData: s, parsedEmailBody: c } = p(e);
              if (!n && i) {
                r = i;
                e = o(t, r);
                const a = p(e);
                n = a.trackerData;
                c = a.parsedEmailBody;
                s = a.associationData;
              }
              if (n || s) {
                a(t, r, c);
                const { threadId: e, messageId: o } = E(t, r);
                if (n)
                  if (n.tracker && n.tracker.email) {
                    n.tracker.email.gmail_ui_id = o;
                    n.tracker.email.gmail_ui_thread_id = e;
                    f(n);
                  } else
                    console.error('Error during email parsing: tracker was not build properly');
                if (s) {
                  const { association: t } = s;
                  if (t) {
                    t.gmail_ui_id = o;
                    t.gmail_ui_thread_id = e;
                    y(t);
                  } else
                    console.error('Error during email parsing: association was not build properly');
                }
              }
            }
          },
          b = (e, t) => {
            const r = e._openUrl;
            h(r) && _(t);
          },
          O = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function (e, t) {
          this._openUrl = t;
          O.apply(this, arguments);
        };
        const k = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.send = function (e) {
          try {
            b(this, e);
          } catch (e) {
            console.error(e);
          }
          k.apply(this, arguments);
        };
      },
    },
    t = {};
  function r(n) {
    var o = t[n];
    if (void 0 !== o) return o.exports;
    var a = (t[n] = { exports: {} });
    e[n](a, a.exports, r);
    return a.exports;
  }
  r.d = function (e, t) {
    for (var n in t)
      r.o(t, n) && !r.o(e, n) && Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
  };
  r.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  };
  r.r = function (e) {
    'undefined' != typeof Symbol &&
      Symbol.toStringTag &&
      Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(e, '__esModule', { value: !0 });
  };
  !(function () {
    try {
      r(2888);
    } catch (e) {
      const t = `xhrInterceptor failed to load: ${e.message || e}`;
      console.error(`%c${t}`, 'font-size: x-large; padding: 5px; background: red; color: yellow; ');
      document.dispatchEvent(
        new CustomEvent('xhr_interceptor', {
          detail: { type: 'LOAD_ERROR', message: t, stacktrace: e.stack },
        })
      );
    }
  })();
})();
//# sourceMappingURL=//static.hsappstatic.net/SignalsExtension/static-2.32896/js/xhrInterceptor.js.map
