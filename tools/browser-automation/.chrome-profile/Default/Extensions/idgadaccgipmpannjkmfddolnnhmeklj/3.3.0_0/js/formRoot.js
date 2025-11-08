import * as e from '../resources/core_engine.main.js';
var t = {
  d: (e, n) => {
    for (var r in n)
      t.o(n, r) && !t.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: n[r] });
  },
  o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
};
const n = ((r = { engine: () => e.engine }), (o = {}), t.d(o, r), o).engine;
var r, o;
const s = window.chrome ? window.chrome : window.browser ? window.browser : void 0;
async function a(e) {
  return await s.runtime.sendMessage(e);
}
let i;
n.setupErrorLogging({ sendMessageFn: a });
const c = {};
var d, l;
(d = async e => {
  if ('setTitle' === e.request) document.title = e.title;
  else if ('closeWindow' === e.request) window.close();
  else if ('getClipboard' === e.request)
    return s.runtime.sendMessage({ type: 'getClipboard', target: 'offscreen' });
}),
  window.addEventListener('message', e => {
    function t(t) {
      e.source.postMessage(
        { waitingKey: o, msg: { type: 'backgroundResponse', response: t } },
        '*'
      );
    }
    const { type: r, waitingKey: o, msg: s } = e.data;
    switch (
      (n.addBreadcrumb({
        message: 'Message from sandbox',
        data: {
          type: r,
          subType:
            'background' === r || 'offscreen' === r
              ? s.request
              : 'localStorage' === r
              ? `${s.subType}|${s.key}`
              : '',
        },
      }),
      r)
    ) {
      case 'response':
        const { result: i } = e.data,
          l = c[o];
        l ? (delete c[o], l(i)) : n.captureException(new Error('Invalid waitingKey'));
        break;
      case 'offscreen':
        d(s).then(e => {
          void 0 !== e && t(e);
        });
        break;
      case 'background':
        a(s).then(e => {
          t(e);
        });
        break;
      case 'localStorage':
        const g = (function (e) {
          return 'get' === e.subType
            ? localStorage.getItem(e.key)
            : 'set' === e.subType
            ? localStorage.setItem(e.key, e.value)
            : void 0;
        })(s);
        t(g);
        break;
      default:
        console.warn('Invalid type', s), n.captureException(new Error('Invalid type: ' + r));
    }
  }),
  (l = s.runtime.getURL('./html/formLoader.html')),
  (i = document.createElement('iframe')),
  (i.src = l),
  (i.id = 'sandboxFrame'),
  new Promise(e => {
    document.body.appendChild(i),
      i.contentWindow.addEventListener('load', () => {
        e();
      });
  });
