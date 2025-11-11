!(function () {
  const e = '__tb_configs',
    t = {
      execCommand: {
        fn: function () {
          const e = document.execCommand,
            t = Document.prototype.execCommand !== e;
          return (
            (document.execCommand = function () {
              let n;
              if (
                ((n = t ? e.bind(document) : Document.prototype.execCommand.bind(document)),
                '1' === document.body.dataset.__TB_execCommand)
              ) {
                document.body.dataset.__TB_execCommand_pending = '1';
                const e = arguments;
                return (
                  queueMicrotask(() => {
                    (n(...e), (document.body.dataset.__TB_execCommand_finished = '1'));
                  }),
                  !0
                );
              }
              return n(...arguments);
            }),
            () => {
              document.execCommand = e;
            }
          );
        },
        version: 1,
      },
      dataTransfer: {
        fn: function () {
          const e = o,
            t = ['types', 'items', 'getData'],
            n = {},
            r = {},
            s = e => `__TB_override-${e}`;
          function c(e) {
            if (document.body.dataset.__TB_execCommand) {
              const t = e.clipboardData;
              ((t.__is_TB_overridden = !0), (t[s('types')] = e.clipboardData[n.types].slice()));
              const o = new DataTransfer(),
                r = Object.create(null);
              for (const e of t[s('types')]) {
                const s = t[n.getData](e);
                ((r[e] = s), o.setData(e, s));
              }
              ((t[s('items')] = o[n.items]),
                (t[s('getData')] = function (e) {
                  if (
                    this.__is_TB_overridden &&
                    ('text' === (e = e.toLowerCase()) && (e = 'text/plain'), e in r)
                  ) {
                    return r[e];
                  }
                  return this[n.getData](...arguments);
                }));
            }
          }
          return (
            t.forEach(t => {
              const o = Object.getOwnPropertyDescriptor(e, t),
                c = Symbol('__' + t);
              let i;
              ((n[t] = c),
                (r[t] = o),
                Object.defineProperty(e, c, o),
                (i =
                  'types' === t || 'items' === t
                    ? {
                        get() {
                          return this.__is_TB_overridden ? this[s(t)] : this[n[t]];
                        },
                      }
                    : {
                        value: function (...e) {
                          return this.__is_TB_overridden ? this[s(t)](...e) : this[n[t]](...e);
                        },
                        writable: !0,
                      }),
                Object.defineProperty(e, t, i));
            }),
            document.addEventListener('paste', c, !0),
            () => {
              document.removeEventListener('paste', c, !0);
              for (const o of t) {
                const t = n[o];
                (Object.defineProperty(e, o, r[o]), delete e[t]);
              }
              for (const e in n) (delete n[e], delete r[e]);
            }
          );
        },
        version: 1,
      },
      editContext: {
        fn: function () {
          const e = HTMLElement.prototype,
            t = 'editContext',
            n = Object.getOwnPropertyDescriptor(e, t);
          if (n)
            return (
              Object.defineProperty(e, t, {
                configurable: !0,
                enumerable: !0,
                get() {
                  return n.get.call(this);
                },
                set(e) {
                  try {
                    if (e)
                      queueMicrotask(() => {
                        const e = new CustomEvent('__TB_registerElementEvent', {
                          bubbles: !0,
                          cancelable: !1,
                          detail: { register: !0 },
                        });
                        this.dispatchEvent(e);
                      });
                    else if (document.body.dataset.__TB_pasteEvent) {
                      const t = n.set.call(this, e);
                      return (
                        delete document.body.dataset.__TB_pasteEvent,
                        queueMicrotask(() => {
                          const e = new CustomEvent('__TB_triggerPasteElementEvent', {
                            bubbles: !0,
                            cancelable: !1,
                          });
                          this.dispatchEvent(e);
                        }),
                        t
                      );
                    }
                  } catch (e) {
                    console.error(e);
                  }
                  return n.set.call(this, e);
                },
              }),
              () => {
                Object.defineProperty(e, t, n);
              }
            );
        },
        version: 1,
      },
      clickElement: {
        fn: function () {
          const e = e => {
            const t = e.composedPath()[0];
            if (!('click' in t)) return;
            const n = t.getBoundingClientRect(),
              o = n.width / 2 + n.x,
              r = n.height / 2 + n.y,
              s = {
                bubbles: !0,
                cancelable: !0,
                composed: !0,
                detail: 1,
                which: 1,
                button: 0,
                buttons: 0,
                clientX: o,
                clientY: r,
                screenX: o + window.screenX,
                screenY: r + window.screenY,
              },
              c = { detail: 0, isPrimary: !0, pointerType: 'mouse' },
              i = new PointerEvent('pointerdown', { ...s, ...c, buttons: 1, pressure: 0.5 });
            (t.dispatchEvent(i),
              i.defaultPrevented ||
                t.dispatchEvent(new MouseEvent('mousedown', { ...s, buttons: 1 })),
              t.dispatchEvent(new PointerEvent('pointerup', { ...s, ...c, pressure: 0 })),
              i.defaultPrevented || t.dispatchEvent(new MouseEvent('mouseup', s)),
              t.click());
          };
          return (
            document.addEventListener('TB_customClick', e),
            () => {
              document.removeEventListener('TB_customClick', e);
            }
          );
        },
        version: 2,
      },
      pdfHandler: {
        fn: function () {
          function e() {
            document.getElementsByTagName('embed')[0].postMessage({ type: 'getSelectedText' }, '*');
          }
          function t() {
            const e = document
              .getElementById('__TB_pdf_iframe')
              .contentDocument.getElementsByTagName('embed')[0];
            (e.postMessage({ type: 'selectAll' }, '*'),
              e.postMessage({ type: 'getSelectedText' }, '*'));
          }
          function n() {
            const e = document.getElementsByTagName('embed')[0];
            (e.postMessage({ type: 'selectAll' }, '*'),
              e.postMessage({ type: 'getSelectedText' }, '*'));
          }
          return (
            document.addEventListener('TB_PDF_GetSelectedText', e),
            document.addEventListener('TB_PDF_GetAllText', t),
            document.addEventListener('TB_PDF_GetAllTextFromOriginalPdf', n),
            () => {
              (document.removeEventListener('TB_PDF_GetSelectedText', e),
                document.removeEventListener('TB_PDF_GetAllText', t),
                document.removeEventListener('TB_PDF_GetAllTextFromOriginalPdf', n));
            }
          );
        },
        version: 1,
      },
    };
  document.currentScript.cookieScriptProcessed = !0;
  const n = '__is_TB_Overridden',
    o = DataTransfer.prototype;
  if (!0 === Object.getOwnPropertyDescriptor(o, n)?.value && !window.__tb_configs) {
    const e = '__tb_config_pdf';
    if (!window[e]) {
      const { fn: n, version: o } = t.pdfHandler;
      Object.defineProperty(window, e, {
        enumerable: !1,
        writable: !1,
        configurable: !1,
        value: { remaps: { pdfHandler: { cleanupFn: n(), timestamp: Date.now(), version: o } } },
      });
    }
    return;
  }
  (Object.defineProperty(o, n, { value: !0, enumerable: !1, configurable: !1, writable: !1 }),
    window.__tb_configs ||
      Object.defineProperty(window, e, {
        enumerable: !1,
        writable: !1,
        configurable: !1,
        value: { remaps: Object.create(null) },
      }));
  const r = window.__tb_configs;
  for (const e in t) {
    const { fn: n, version: o } = t[e],
      s = r.remaps[e];
    (!s || s.version < o) &&
      (s?.cleanupFn(), (r.remaps[e] = { cleanupFn: n(), timestamp: Date.now(), version: o }));
  }
})();
