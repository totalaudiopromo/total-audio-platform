var installed,
  debugblaze = !1,
  debugWidgetPosition = !1;
if (installed);
else {
  installed = !0;
  let e = 0,
    t = !1;
  const n = 'LAST_FOCUSED',
    o = 'AI_SIDEBAR_TARGET',
    i = 'LAST_FOCUSED_AI',
    s = 'text-blaze-app-reference',
    r = 'ai-blaze-no-context',
    a = 'text',
    c = 'https://dashboard.blaze.today/iframe/?app=embed&is_preloaded=true';
  let l = null;
  const d = (e = 'rgba(0, 0, 0, 0.54)') =>
    `<svg color="${e}" fill="currentcolor" width="24" height="24" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`;
  function documentContainsNode(e) {
    if (!e.isConnected) return !1;
    const t = e.getRootNode();
    return !(t instanceof win(e).ShadowRoot) || documentContainsNode(t.host);
  }
  function getUrl() {
    const e = window.location.href;
    return 'about:blank' === e && window.opener ? window.opener.location.href : e;
  }
  function readFromExtensionStorage(e) {
    return T.storage.local.get(e).then(t => t?.[e]);
  }
  function writeToExtensionStorage(e, t) {
    promiseSendMessage({ request: 'extensionStorage', subType: 'set', key: e, value: t });
  }
  function promiseDelay(e = 0) {
    return new Promise(t => setTimeout(t, e));
  }
  function promiseSendMessage(e) {
    return extensionActive()
      ? new Promise(t =>
          T.runtime.sendMessage(e, (...e) => {
            T.runtime.lastError ? t(void 0) : t(...e);
          })
        )
      : Promise.reject('Content script is unloaded');
  }
  function selectionForElement(e) {
    const t = e.getRootNode();
    return 'function' != typeof t.getSelection
      ? (t.isConnected &&
          reportToErrorMonitoring(new Error('rootNode().getSelection() is not a function'), {
            isShadowRoot: t instanceof ShadowRoot,
            isHTMLDoc: t instanceof HTMLDocument,
            nodeName: t.nodeName,
            nodeType: t.nodeType,
            isConnected: t.isConnected,
            type: typeof t.getSelection,
          }),
        null)
      : t.getSelection();
  }
  function getShadowRoot(e) {
    try {
      return T.dom.openOrClosedShadowRoot(e);
    } catch (t) {
      return (
        !t.message.includes('Extension context invalidated') &&
          extensionActive() &&
          reportToErrorMonitoring(t, { tagName: e?.tagName, isFalsy: !e }),
        null
      );
    }
  }
  const {
    widget: u,
    WIDGET_SHORTCUT_MIN_LEN: p,
    getCaretPosition: g,
  } = (() => {
    function e(e) {
      (e.preventDefault(), e.stopImmediatePropagation());
    }
    function t(e, t) {
      for (const n of ['top', 'left', 'right', 'bottom'])
        if (n in t) {
          let o = t[n];
          ('bottom' === n
            ? (o = window.innerHeight - o)
            : 'right' === n && (o = window.innerWidth - o),
            (e.style[n] = o + 'px'));
        } else e.style.removeProperty(n);
    }
    const n = 'updateMarkerPosition';
    window.updateMarkerPosition = (e, t = 'red') => {};
    const o = (() => {
      const e = [
        'direction',
        'boxSizing',
        'width',
        'height',
        'overflowX',
        'overflowY',
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderTopStyle',
        'borderRightStyle',
        'borderBottomStyle',
        'borderLeftStyle',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'fontSizeAdjust',
        'lineHeight',
        'fontFamily',
        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration',
        'letterSpacing',
        'whiteSpace',
        'wordSpacing',
        'tabSize',
        'MozTabSize',
      ];
      function t(e) {
        const t = e.lineHeight;
        return 'normal' === t ? parseInt(e.fontSize) : parseInt(t);
      }
      return function (n, o) {
        const i = win(n),
          s = i.document,
          r = document.createElement('div');
        ((r.id = 'input-textarea-caret-position-mirror-div'), s.body.appendChild(r));
        const a = r.style,
          c = i.getComputedStyle(n),
          l = 'INPUT' === n.nodeName;
        (l || ((a.whiteSpace = 'pre-wrap'), (a.wordWrap = 'break-word')),
          (a.position = 'absolute'),
          (a.visibility = 'hidden'),
          (a.top = '0'),
          (a.left = '0'),
          e.forEach(function (e) {
            if (l && 'lineHeight' === e)
              if ('border-box' === c.boxSizing) {
                const e = parseInt(c.height),
                  n =
                    parseInt(c.paddingTop) +
                    parseInt(c.paddingBottom) +
                    parseInt(c.borderTopWidth) +
                    parseInt(c.borderBottomWidth),
                  o = n + t(c);
                e > o ? (a.lineHeight = e - n + 'px') : e === o && (a.lineHeight = c.lineHeight);
              } else a.lineHeight = c.height;
            else a[e] = c[e];
          }),
          'content-box' === a.boxSizing && (a.overflow = 'hidden'),
          l && (a.whiteSpace = 'pre'));
        let d = 'number' == typeof o ? o : o.start,
          u = 'number' == typeof o ? o : o.end,
          p = document.createElement('span');
        p.textContent = n.value.substring(0, d);
        let g = document.createElement('span');
        g.textContent = n.value.substring(d, u);
        let m = document.createElement('span');
        ((m.textContent = n.value.substring(u) + '.'),
          l &&
            ((p.textContent = p.textContent.replace(/\s/g, ' ')),
            (g.textContent = g.textContent.replace(/\s/g, ' ')),
            (m.textContent = m.textContent.replace(/\s/g, ' '))),
          r.append(p, g, m),
          debugWidgetPosition &&
            (console.log('[MIRROR DIV]', m.offsetParent),
            console.log('[SPAN OFFSETS]', m.offsetTop, m.offsetLeft, m.offsetHeight, m.offsetWidth),
            console.log('[ELEMENT OFFSETS]', n.scrollTop, n.scrollLeft)));
        const { top: f, left: h } = n.getBoundingClientRect();
        if ('number' == typeof o) {
          const e = parseInt(c.borderTopWidth),
            o = parseInt(c.borderLeftWidth),
            i = m.offsetTop - n.scrollTop,
            a = m.offsetLeft - n.scrollLeft;
          debugWidgetPosition &&
            (console.log('[COORD TOP]', { boxTop: f, verticalOffset: i, borderTopWidth: e }),
            console.log('[COORD LEFT]', { boxLeft: h, horizontalOffset: a, borderLeftWidth: o }));
          const l = f + i + e,
            d = h + a + o,
            u = { top: l, left: d, bottom: l + t(c), right: d + 2 };
          return (s.body.removeChild(r), u);
        }
        {
          let e = r.getBoundingClientRect(),
            t = g.getBoundingClientRect();
          return (
            s.body.removeChild(r),
            {
              left: t.left + (h - e.left),
              right: t.right + (h - e.left),
              top: t.top + (f - e.top),
              bottom: t.bottom + (f - e.top),
              width: t.width,
              height: t.height,
            }
          );
        }
      };
    })();
    function i(e) {
      if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) {
        const t = e.selectionStart;
        return o(e, t);
      }
      let t = win(e).getSelection();
      const i = e.getRootNode();
      if ((i instanceof ShadowRoot && (t = i.getSelection()), 0 === t.rangeCount))
        return (reportToErrorMonitoring('Widget: no cursor range exists.'), null);
      console.assert(e.isContentEditable);
      const s = t.getRangeAt(0);
      let r = s.getBoundingClientRect(),
        { top: a, left: c, bottom: l, right: d } = r;
      if (0 === a && 0 === c) {
        const t = s.cloneRange();
        if (
          (t.setStart(t.startContainer, 0),
          t.setStart(t.startContainer, t.startOffset),
          (r = t.getBoundingClientRect()),
          (a = r.top),
          (c = r.left),
          (d = r.right),
          (l = r.bottom),
          0 === a && 0 === c)
        ) {
          const t = e.ownerDocument,
            n = t.createElement('span');
          n.appendChild(t.createTextNode('​'));
          s.cloneRange().insertNode(n);
          const o = n.getClientRects()[0];
          ((a = o.top), (c = o.left), (d = o.right), (l = o.bottom));
          const i = n.parentNode;
          (i.removeChild(n), i.normalize());
        }
      }
      const u = { top: a, left: c, bottom: l, right: d };
      return (window[n](u), u);
    }
    function s(e, t) {
      if (extensionActive()) return promiseSendMessage({ request: 'widgetRoute', type: e, msg: t });
    }
    class r {
      static CONTAINER_ID = 'tb-tb-widget-container';
      static WIDGET_ID = 'widget';
      static WIDGET_LIST_ID = 'widget-list';
      static WIDGET_FOOTER_ID = 'widget-footer';
      static WIDGET_ITEM_CLASS = 'widget-item';
      static WIDGET_ITEM_SELECTED_CLASS = 'widget-item-selected';
      static WIDGET_EXPANDED_CLASS = 'expandedFull';
      static WIDGET_DEBOUNCE_THRESHOLD_MS = 50;
      static LATEST_CLICK_THRESHOLD_MS = 100;
      static SHORTCUT_MIN_LEN = 1;
      static SAVED_FOCUS_ID = 'widget-focus-save';
      static ROUTE_DISPLAY_KEY = 'displayWidget';
      static ROUTE_HIDE_KEY = 'hideWidget';
      static ROUTE_RESET_KEY = 'resetWidget';
      static ROUTE_LISTENER_KEY = 'listenerWidget';
      constructor() {
        ((this.widgetContainer = null),
          (this.widget = null),
          (this.widgetList = null),
          (this.attachedWindowListener = !1),
          (this.streamTimeout = -1),
          (this.orchestrationMetadata = {
            startingPosition: { left: 0, top: 0 },
            expandedDimensions: { width: 0, height: 0 },
          }),
          (this.requestTimer = {}),
          this.resetAllRunningValues());
      }
      routeRequestToCorrectFrame(e, t) {
        if (extensionActive())
          return (
            this.requestTimer[e] && clearTimeout(this.requestTimer[e]),
            e === r.ROUTE_HIDE_KEY &&
              this.requestTimer[r.ROUTE_DISPLAY_KEY] &&
              clearTimeout(this.requestTimer[r.ROUTE_DISPLAY_KEY]),
            new Promise(n => {
              this.requestTimer[e] = setTimeout(() => {
                const o = t ? t() : {};
                null !== o
                  ? (debug('[WIDGET ROUTE]', e, document),
                    s(e, o).then(() => {
                      (e === r.ROUTE_HIDE_KEY
                        ? this.hideWidget()
                        : e === r.ROUTE_RESET_KEY && this.resetWidget(),
                        n());
                    }))
                  : debug('[WIDGET] cancel as target changed');
              }, r.WIDGET_DEBOUNCE_THRESHOLD_MS);
            })
          );
      }
      resetAllRunningValues() {
        this.logicMetadata = { shortcutText: '', targetNode: null };
      }
      isListItem(e) {
        return e && e.classList.contains(r.WIDGET_ITEM_CLASS);
      }
      async insertSnippetByElement(e, t) {
        let n;
        const { targetNode: o, shortcutText: i } = this.logicMetadata;
        ('click' === t
          ? (n = restoreFocusAndSelection(r.SAVED_FOCUS_ID, !0).set)
          : ((n = !0), o.focus()),
          n
            ? await insertSnippetByID(o, e, { insertionType: 'widget', typedShortcutText: i })
            : console.error('[FAILED TO FOCUS]', o, document));
      }
      itemClickListener(t) {
        const n = t.target;
        debug('[WIDGET ITEM CLICK]', n, n.parentElement, n.parentElement.parentElement);
        let o = n;
        for (; o && !this.isListItem(o); ) o = o.parentElement;
        if (!o) return;
        const i = o.dataset.snipid;
        i && (e(t), this.hideWidget(), s('insertSnippet', { snipId: i, eventType: 'click' }));
      }
      insertWidget() {
        return new Promise((e, t) => {
          const n = document.createElement('link');
          ((n.rel = 'stylesheet'),
            (n.href = T.runtime.getURL('css/widget.css')),
            (this.widgetContainer = document.createElement('div')),
            (this.widgetContainer.id = r.CONTAINER_ID),
            (this.widgetContainer.style.all = 'initial'),
            (this.widgetContainer.style.position = 'absolute'),
            (this.widgetContainer.style.zIndex = '2147483647'),
            (this.widgetContainer.style.display = 'none'),
            (this.widgetContainer.style.background = 'transparent'),
            document.body.appendChild(this.widgetContainer),
            (this.widget = document.createElement('div')),
            (this.widget.id = r.WIDGET_ID),
            (this.widgetList = document.createElement('div')),
            (this.widgetList.id = r.WIDGET_LIST_ID));
          const o = document.createElement('div');
          ((o.id = r.WIDGET_FOOTER_ID),
            this.widget.appendChild(this.widgetList),
            this.widget.appendChild(o));
          const i = this.widgetContainer.attachShadow({ mode: 'closed' });
          (n.addEventListener('load', () => {
            (i.appendChild(this.widget), e());
          }),
            n.addEventListener('error', e => {
              (console.warn('Stylesheet failed to load', e), t());
            }),
            i.appendChild(n));
        });
      }
      expandWidget() {
        const { height: e, width: t } = this.orchestrationMetadata.expandedDimensions;
        (e && (this.widgetContainer.style.height = `${e}px`),
          t && (this.widgetContainer.style.width = `${t}px`),
          this.widget.classList.add(r.WIDGET_EXPANDED_CLASS));
      }
      collapseWidget() {
        (this.widgetContainer.style.removeProperty('height'),
          this.widgetContainer.style.removeProperty('width'),
          this.widget.classList.remove(r.WIDGET_EXPANDED_CLASS));
      }
      updateWidget(e, t, n = 1) {
        this.widgetList.innerHTML = '';
        let o = 0;
        const i = T.runtime.getURL('images/icon_128.png'),
          s = e.length > 8,
          a = t.length;
        for (const { id: t, shortcut: s, body: c } of e.slice(0, 8)) {
          const e = document.createElement('p');
          ((e.dataset.snipid = t), e.classList.add(r.WIDGET_ITEM_CLASS));
          const l = document.createElement('span');
          o > 1 && l.classList.add('chip-outer');
          const d = document.createElement('span');
          d.classList.add('snippet-shortcut', 'chip');
          const u = document.createElement('span');
          u.classList.add('snippet-shortcut-text');
          const p = document.createElement('b');
          p.innerText = s.slice(0, a);
          const g = document.createElement('span');
          ((g.innerText = s.slice(a)), u.append(p), u.append(g), d.appendChild(u));
          const m = document.createElement('span');
          ((m.innerText = '-'), m.classList.add('separator'), d.appendChild(m));
          const f = document.createElement('span');
          if (((f.innerText = c), f.classList.add('shortcut-name'), d.appendChild(f), 0 === o)) {
            const e = document.createElement('img');
            ((e.src = i), e.classList.add('logo-image-small', 'logo-embedded'), d.appendChild(e));
          }
          if (
            (l.appendChild(d),
            l.addEventListener('click', this.itemClickListener.bind(this), !0),
            e.appendChild(l),
            0 === o)
          ) {
            const t = document.createElement('span');
            t.classList.add();
            const o = document.createElement('span');
            o.classList.add('snippet-shortcut', 'chip', 'logo-separate-chip');
            const s = document.createElement('img');
            ((s.src = i),
              s.classList.add('logo-image-small'),
              o.appendChild(s),
              t.append(o),
              t.addEventListener('click', () => {
                let e = '';
                (n < 0.1
                  ? (e = 'We are currently testing this feature for selected users')
                  : n < 1 && (e = 'We are gradually rolling this out to all users'),
                  alert(
                    `This is the new Instant Assistant! ${e} - Team Text Blaze Chrome Extension`
                  ));
              }));
            const r = document.createElement('button');
            (r.classList.add('dismiss-button'),
              (r.innerText = '×'),
              r.setAttribute('title', 'Dismiss suggestions'),
              r.addEventListener('click', () => {
                (this.hideWidget(), promiseSendMessage({ request: 'dismissWidget' }));
              }),
              e.appendChild(t),
              e.appendChild(r));
          }
          (this.widgetList.appendChild(e), o++);
        }
        if (s) {
          const e = document.createElement('p');
          e.classList.add('chip-outer', 'widget-item');
          const t = document.createElement('a');
          (t.classList.add('has-more'),
            t.setAttribute('target', '_blank'),
            t.setAttribute('href', 'http://dashboard.blaze.today'),
            (t.innerHTML =
              'More…<kbd class="key" style="margin-left: 8px" title="Control-Shift-Space">Ctrl-⇧-⎵</kbd>'),
            t.classList.add('chip'),
            e.appendChild(t),
            this.widgetList.appendChild(e));
        }
        (this.widget.addEventListener('mousemove', () => {
          this.expandWidget();
        }),
          this.widget.addEventListener('mouseleave', () => {
            this.collapseWidget();
          }));
      }
      async positionWidget(e = !1) {
        const o = this.widget.classList.contains(r.WIDGET_EXPANDED_CLASS);
        (this.collapseWidget(),
          this.widget.classList.remove('vertical-flip', 'horizontal-flip'),
          this.widgetContainer.style.removeProperty('top'),
          this.widgetContainer.style.removeProperty('bottom'),
          this.widgetContainer.style.removeProperty('left'),
          this.widgetContainer.style.removeProperty('right'),
          this.widget.classList.add(r.WIDGET_EXPANDED_CLASS));
        const { top: i, left: s, bottom: a, right: c } = this.absoluteCaretPos,
          { width: l, height: d } = this.widget.getBoundingClientRect();
        (window[n](this.absoluteCaretPos, 'blueviolet'),
          this.widget.classList.remove(r.WIDGET_EXPANDED_CLASS),
          (this.orchestrationMetadata.expandedDimensions = { width: l, height: d }),
          debugWidgetPosition &&
            debug('[CARET POSITION]', { caretBottom: a, caretLeft: s, caretRight: c, caretTop: i }),
          e &&
            ((this.orchestrationMetadata.startingPosition.left = s),
            (this.orchestrationMetadata.startingPosition.top = i)));
        let u = i,
          p = c;
        const { border: g, height: m, width: f, scrollX: h, scrollY: E } = getWindowBorders();
        let b = !1,
          y = !1;
        if (u + d >= g.bottom) {
          const e = a - d;
          e >= g.top && ((u = e), this.widget.classList.add('vertical-flip'), (b = !0));
        }
        if (p + l >= g.right) {
          const e = this.orchestrationMetadata.startingPosition.left - l;
          e >= g.left && ((p = e - 10), this.widget.classList.add('horizontal-flip'), (y = !0));
        }
        const T = (function (e) {
          const t = { top: e.top, left: e.left };
          return (
            b && ((t.bottom = t.top + d), delete t.top),
            y && ((t.right = t.left + l), delete t.left),
            t
          );
        })({ top: u, left: p });
        (debugWidgetPosition &&
          (debug('[WINDOW WIDTH/HEIGHT]', { windowWidth: f, windowHeight: m }),
          debug('[INITIAL POSITION]', T)),
          t(this.widgetContainer, T));
        const w = {},
          S = this.widgetContainer.getBoundingClientRect();
        for (const e of ['left', 'right', 'bottom', 'top']) w[e] = S[e];
        ((w.left += h),
          (w.right += h),
          (w.top += E),
          (w.bottom += E),
          debugWidgetPosition && debug('[OBSERVED POSITION]', w));
        const C = {};
        for (const e in T) {
          const t = T[e] - w[e];
          C[e] = T[e] + t;
        }
        (debugWidgetPosition && debug('[ASSIGNEE UPDATED]', C),
          o && this.widget.classList.add(r.WIDGET_EXPANDED_CLASS),
          t(this.widgetContainer, C));
      }
      hideWidgetRouted() {
        this.routeRequestToCorrectFrame(r.ROUTE_HIDE_KEY);
      }
      hideWidget() {
        this.widgetContainer && (this.widgetContainer.style.display = 'none');
      }
      resetWidgetRouted() {
        this.routeRequestToCorrectFrame(r.ROUTE_RESET_KEY);
      }
      resetWidget() {
        (this.hideWidget(), this.resetAllRunningValues());
      }
      unhideWidget() {
        this.widgetContainer && (this.widgetContainer.style.display = 'block');
      }
      isDisplayedInThisFrame() {
        return this.widgetContainer && 'block' === this.widgetContainer.style.display;
      }
      isDisplayTriggeredByMyFrame() {
        return null !== this.logicMetadata.targetNode;
      }
      isValidTarget(e) {
        return (e.innerText || e.value || '').trim().length > 0;
      }
      displayWidgetRouted(e, t, n, o) {
        this.routeRequestToCorrectFrame(r.ROUTE_DISPLAY_KEY, () => {
          if (!this.isValidTarget(e)) return null;
          ((this.logicMetadata.targetNode = e), (this.logicMetadata.shortcutText = t));
          const s = i(e);
          return s
            ? (debugWidgetPosition && debug('[INNER CARET POSITION]', s),
              saveFocusAndSelection(r.SAVED_FOCUS_ID, e, !0),
              { caretPosition: s, shortcut: t, matchingSnippets: n, widgetDeployPercent: o })
            : null;
        });
      }
      async displayWidget(e, t, n, o) {
        const i = 1 === e.length;
        this.logicMetadata.shortcutText = e;
        try {
          (this.widgetContainer || (await this.insertWidget()),
            (function (e) {
              const t = window.scrollY,
                n = window.scrollX;
              ((e.top += t), (e.bottom += t), (e.left += n), (e.right += n));
            })(o),
            (this.absoluteCaretPos = o),
            this.routeRequestToCorrectFrame(r.ROUTE_LISTENER_KEY),
            this.updateWidget(t, e, n),
            this.unhideWidget(),
            this.positionWidget(i));
        } catch (e) {
          console.warn('Non-blocking widget error', e);
        }
      }
      attachWindowListener() {
        if (this.attachedWindowListener) return;
        (debug('[WIDGET] Attached window listener', document), (this.attachedWindowListener = !0));
        (window.addEventListener(
          'mousedown',
          t => {
            if (this.isDisplayedInThisFrame()) {
              const n = t.target;
              n.nodeType === Node.ELEMENT_NODE && n.id === r.CONTAINER_ID
                ? e(t)
                : this.resetWidgetRouted();
            } else this.resetWidgetRouted();
          },
          !0
        ),
          document.addEventListener('visibilitychange', () => {
            this.isDisplayTriggeredByMyFrame() &&
              'hidden' === document.visibilityState &&
              s(r.ROUTE_RESET_KEY);
          }),
          window.addEventListener(
            'resize',
            ((e, t) => {
              let n = -1;
              return () => {
                (-1 !== n && clearTimeout(n),
                  (n = window.setTimeout(() => {
                    ((n = -1), e());
                  }, t)));
              };
            })(() => {
              this.isDisplayedInThisFrame() && this.positionWidget();
            }, 200)
          ));
      }
    }
    return {
      widget: new r(),
      WIDGET_SHORTCUT_MIN_LEN: r.SHORTCUT_MIN_LEN,
      getCaretPosition: i,
      getTextareaCaretPosition: o,
    };
  })();
  function getActiveHTMLElementFromDocument(e) {
    const t = e.activeElement;
    return t && (t instanceof win(t).HTMLElement || ('click' in t && t.click)) ? t : null;
  }
  function documentActive(e = document, t = !0) {
    let n;
    if (((n = e.host ? e.host.ownerDocument : e), t && !n.hasFocus()))
      try {
        if (n.defaultView.parent && n.defaultView.parent !== n.defaultView)
          return documentActive(n.defaultView.parent.document);
      } catch (e) {
        debug('[NOT TRAVERSING PARENT IFRAME]', n);
      }
    const o = getActiveHTMLElementFromDocument(e);
    if (o) {
      if (getShadowRoot(o)) return documentActive(getShadowRoot(o), t);
      if (t && isFrameElement(o))
        try {
          return documentActive(o.contentWindow.document);
        } catch (e) {
          return o;
        }
    }
    return o;
  }
  function isFrameElement(e) {
    return e && (e instanceof win(e).HTMLIFrameElement || e instanceof win(e).HTMLFrameElement);
  }
  function getFocusedSelectionObjectAcrossShadowDOM(e) {
    const t = e.getSelection();
    if (0 === t.rangeCount) return t;
    const n = t.getRangeAt(0),
      o = n.startContainer,
      i = n.startOffset;
    if (o === n.endContainer && i === n.endOffset) {
      const e = o.childNodes[i];
      if (e instanceof HTMLElement) {
        const t = getShadowRoot(e);
        if (t) return getFocusedSelectionObjectAcrossShadowDOM(t);
      }
    }
    return t;
  }
  function win(e) {
    return e.ownerDocument.defaultView;
  }
  function debug() {
    debugblaze &&
      (e > 0 && console.log('+ ' + (Date.now() - e) + ' ms'),
      (e = Date.now()),
      console.log(...[...arguments].map(e => (e instanceof Function ? e() : e))));
  }
  function allowedToInsert(e) {
    return !(isBannedSite() && !e.classList.contains('allow-blaze'));
  }
  function getBrowser() {
    return window.chrome ? window.chrome : window.browser ? window.browser : void 0;
  }
  function extensionActive() {
    try {
      return !(!T.runtime || !T.runtime.getManifest());
    } catch (e) {
      return !1;
    }
  }
  const m = Object.freeze({
    backspace: 8,
    tab: 9,
    return: 13,
    escape: 27,
    space: 32,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
  });
  function isUpDownArrowKey(e) {
    return e.keyCode === m.up || e.keyCode === m.down;
  }
  function isArrowKey(e) {
    return (
      e.keyCode === m.right || e.keyCode === m.left || e.keyCode === m.up || e.keyCode === m.down
    );
  }
  function isSingleLetterKey(e) {
    return 1 === e.key.length;
  }
  const f = { [m.return]: 'return', [m.tab]: 'tab', [m.space]: 'space' },
    h = [m.left, m.right, m.down, m.up, m.pagedown, m.pageup, m.home, m.end];
  for (const Ce of h) f[Ce] = `content jump: ${Ce}`;
  class E {
    constructor() {
      ((this.stream = []),
        (this.baseResetTimeout = 2e3),
        (this.resetTimeout = this.baseResetTimeout),
        (this.timer = null),
        (this.previousTarget = null));
    }
    setResetTimeout(e) {
      ((this.resetTimeout = Math.max(e || this.baseResetTimeout, 800)),
        (u.streamTimeout = this.resetTimeout));
    }
    resetTimer() {
      (this.timer && clearTimeout(this.timer),
        (this.timer = setTimeout(
          () => this.empty('timeout ' + this.resetTimeout),
          this.resetTimeout
        )));
    }
    add(e, t, n = !1) {
      if ((this.checkTarget(e), this.resetTimer(), !n && (this.stream.push(t), isEditable(e))))
        if ((lookupShortcuts(e, this.toString()), /\s/.test(t))) {
          const e = [...t].map(e => e.charCodeAt(0));
          this.empty(`input whitespace: ${e}`);
        } else this.dispatchStreamEvent({ type: 'add', character: t });
    }
    checkTarget(e) {
      return this.previousTarget && this.previousTarget !== e
        ? !!this.previousTarget.contains(e) || (this.empty('target changed'), !1)
        : ((this.previousTarget = e), !0);
    }
    pop(e) {
      this.checkTarget(e) &&
        (debug('[POP CHARACTER FROM STREAM]'),
        this.resetTimer(),
        this.stream.pop(),
        this.dispatchStreamEvent({ type: 'pop' }),
        e &&
          (0 === this.stream.length
            ? u.resetWidgetRouted()
            : (this.stream.length < p && u.hideWidgetRouted(),
              this.stream.length > 0 && lookupShortcuts(e, this.toString()))));
    }
    empty(e, t = null) {
      (e.startsWith('timeout') &&
        (u.isDisplayedInThisFrame() || u.isDisplayTriggeredByMyFrame())) ||
        (debug('[CLEAR STREAM]', e),
        u.resetWidgetRouted(),
        this.timer && (clearTimeout(this.timer), (this.timer = null)),
        (this.stream.length = 0),
        this.dispatchStreamEvent({ type: 'clear', reason: e }),
        (this.previousTarget = null));
    }
    toString() {
      return this.stream.join('');
    }
    dispatchStreamEvent(e) {
      if (!this.previousTarget?.classList?.contains('allow-blaze')) return;
      if (!isBannedSite()) return;
      const t = { ...e, stream: this.toString() };
      window.dispatchEvent(new CustomEvent('TB_streamUpdate', { detail: t }));
    }
  }
  const b = navigator.appVersion.includes('Mac'),
    y = '[role=dialog][aria-modal=true]',
    T = getBrowser(),
    w = 'action-focus_',
    S =
      'textarea,input,*[contenteditable=true],[contenteditable=""],[contenteditable=plaintext-only]',
    C = 'iframe[src*=":"], iframe[src=""], iframe:not([src])',
    x = [
      'dashboard.blaze.today',
      'spark.blaze.today',
      'text.blaze.today',
      'spark-text.blaze.today',
      'ai.blaze.today',
      'spark-ai.blaze.today',
    ];
  function isBannedSite() {
    return x.includes(document.location.host);
  }
  function isAIChatIframe() {
    return (
      'tb-tb-input-trap' === window.frameElement?.id ||
      (isBannedSite() &&
        ['sidebar', 'embed', 'tooltip'].includes(
          new URLSearchParams(document.location.search).get('app')
        ))
    );
  }
  const v = new E(),
    I = [];
  let R = !0;
  const L = Date.now();
  let A = !1;
  function addGlobalListener(e) {
    (e({ document: document, window: window }), I.push(e));
  }
  addGlobalListener(({ document: e }) =>
    e.addEventListener('selectionchange', () => {
      if (!extensionActive()) return;
      if (A) return void (A = !1);
      const e = documentActive();
      isEditable(e) &&
        (ye.has(e) || registerElement(e),
        e.isContentEditable && !N.has(e) && observeIntersection(e));
    })
  );
  let k = 200;
  function pollDesignMode() {
    if ('on' === document.designMode.toLowerCase()) registerElement(document.documentElement);
    else {
      if (((k *= 2), k > 3e5)) return;
      setTimeout(pollDesignMode, k);
    }
  }
  setTimeout(pollDesignMode, k);
  const D = new MutationObserver(function (e) {
      for (let t = 0; t < e.length; t++) {
        const n = e[t];
        if ('childList' === n.type && R)
          if (Date.now() - L >= 2e3) ((R = !1), (I.length = 0));
          else
            for (let e = 0; e < n.removedNodes.length; e++) {
              const t = n.removedNodes[e];
              if ('tagName' in t && 'HTML' === t.tagName) {
                for (const e of I) e({ document: document, window: window });
                ((R = !1), (I.length = 0));
              }
            }
        if ('childList' === n.type && n.addedNodes.length)
          for (let e = 0; e < n.addedNodes.length; e++) {
            const t = n.addedNodes[e];
            if (t.nodeType === Node.ELEMENT_NODE) {
              const e = t;
              if (!e.matches && !e.querySelectorAll) {
                reportToErrorMonitoring('Element node does not have matches method', {
                  tagName: e.tagName,
                });
                continue;
              }
              (e.matches(S) ? registerElement(e) : registerElement(e.querySelectorAll(S)),
                e instanceof HTMLIFrameElement && e.matches(C)
                  ? checkIFrames(e)
                  : checkIFrames(e.querySelectorAll(C)),
                e === document.documentElement &&
                  'HTML' === e.tagName &&
                  0 === getIframeDepth(window) &&
                  addExtensionActiveWebComponent(e),
                e.querySelectorAll(y).forEach(e => {
                  addExtensionActiveWebComponent(e);
                }),
                e.matches(y) && addExtensionActiveWebComponent(e));
            }
          }
        else if (
          'attributes' === n.type &&
          ('contenteditable' === n.attributeName.toLowerCase() && registerElement(n.target),
          ('role' === n.attributeName.toLowerCase() ||
            'aria-modal' === n.attributeName.toLowerCase()) &&
            n.target.nodeType === Node.ELEMENT_NODE)
        ) {
          const e = n.target;
          if (!e.matches && !e.querySelectorAll) {
            reportToErrorMonitoring('Element node does not have matches method', {
              tagName: e.tagName,
            });
            continue;
          }
          e.matches(y) && addExtensionActiveWebComponent(e);
        }
      }
    }),
    N = new WeakMap(),
    M = new IntersectionObserver(
      e => {
        e.forEach(e => {
          N.set(e.target, e.isIntersecting);
        });
      },
      { threshold: 0 }
    );
  function observeIntersection(e) {
    M.observe(e);
  }
  async function replacementRequestHandler({ target: e, typedShortcutText: t, request: n }) {
    let o = e;
    const s = [...window.location.ancestorOrigins];
    ((n.ancestorOrigins = s.some(e => e?.match(/^chrome.*?:\/\//)) ? s : []),
      (n.editorData = getEditorData(o)));
    const r = await promiseSendMessage(n);
    debug('[GET REPLACEMENT - RESULT]', t, r);
    let a = !1;
    (r &&
      ('form' === r.type
        ? (r.aiData &&
            r.aiData.shortcutToClear &&
            isEditable(o) &&
            (await clearShortcut(r.aiData.shortcutToClear, o, !1, selectionForElement(o)),
            o.isConnected || (o = documentActive())),
          (r.aiData && !r.aiData.shortcutToClear) || o.dispatchEvent(new Event('selectionchange')),
          saveFocusAndSelection(r.formId, o, !0),
          (he[i] = Object.assign({}, he[r.formId])),
          v.empty('form triggered', r.aiData?.shortcutToClear))
        : 'suggestions' === r.type &&
          r.matchingSnippets.length > 0 &&
          ((a = !0), u.displayWidgetRouted(o, t, r.matchingSnippets, r.widgetDeployPercent)),
      ('replacement' !== r.type && 'form' !== r.type) ||
        promiseSendMessage({ request: 'replacementHandlerFinished' })),
      a || u.hideWidgetRouted());
  }
  function getEditorData(e) {
    return 'DIV' === e.tagName &&
      e.nextElementSibling &&
      'docs-texteventtarget-descendant' === e.nextElementSibling.id
      ? { isDocs: !0 }
      : 'DIV' === e.tagName && 'true' === e.getAttribute('data-lexical-editor')
        ? { isLexical: !0 }
        : 'DIV' === e.tagName &&
            e.classList.contains('public-DraftEditor-content') &&
            e.parentElement.classList.contains('DraftEditor-editorContainer')
          ? { isDraftJS: !0 }
          : {};
  }
  function insertSnippetByID(e, t, n) {
    return replacementRequestHandler({
      target: e,
      request: {
        request: 'getReplacement',
        snippetId: t,
        typedShortcutText: n.typedShortcutText || '',
        insertionType: n.insertionType,
        selectedContent: n.selectedContent,
        fieldTexts: n.fieldTexts,
        precedingText: n.precedingText,
        editorData: null,
      },
      typedShortcutText: n.typedShortcutText || '',
    });
  }
  function insertSnippetByText(e, t, n, o = null, i = null, s = null) {
    return replacementRequestHandler({
      target: e,
      request: {
        request: 'getReplacement',
        insertionType: n,
        typedShortcutText: '',
        editorData: null,
        details: t,
        selectedContent: o,
        fieldTexts: i,
        sessionId: s,
        precedingText: o || i?.precedingText,
      },
      typedShortcutText: '',
    });
  }
  let O = !1,
    F = !1,
    P = !1;
  function keyDownEventListener(e) {
    if (e.isTrusted && !e.blazeHandled) {
      const t = e.keyCode,
        n = f[t];
      e.blazeHandled = !0;
      const o = e.defaultPrevented;
      if (
        (debug('[KEYDOWN]', e.keyCode, e),
        ('Process' === e.key || 'Unidentified' === e.key) && 229 === t)
      )
        return (debug('[IME/Composition event]', e), void (O = !0));
      ((O = !1),
        (t === m.space && !o) || void 0 === n
          ? t === m.backspace
            ? e.ctrlKey || e.metaKey || e.altKey
              ? v.empty('batch delete')
              : v.pop(e.target)
            : (65 !== t && 86 !== t) ||
              !((b && e.metaKey) || e.ctrlKey) ||
              v.empty(65 === t ? 'selecting all' : 'pasting')
          : v.empty(n));
    }
  }
  function keyPressEventListener(e) {
    if (!e.isComposing && e.isTrusted && !e.blazeHandled) {
      const t = e.key;
      ((e.blazeHandled = !0), debug('[KEYPRESS]', t, e), debug('[IS COMPOSING FALSE]'), (F = !1));
      const n = e.target;
      if (!allowedToInsert(n)) return;
      if ('Enter' === t) return void v.empty('enter');
      v.add(n, t);
    }
  }
  function beforeInputEventListener(e) {
    if (
      e.isTrusted &&
      !e.blazeHandled &&
      (e.isComposing || O) &&
      e.inputType.startsWith('insert')
    ) {
      ((e.blazeHandled = !0), debug('[BEFORE INPUT]', e));
      const t = e.target,
        n = e.inputType;
      if (
        (debug('[BEFORE INPUT STATUS]', {
          isIMEHandling: O,
          inputType: n,
          event: e,
          composing: e.isComposing,
        }),
        (F = e.isComposing),
        (O = !1),
        !allowedToInsert(t))
      )
        return;
      switch (n) {
        case 'insertCompositionText':
          v.add(t, e.data, !0);
          break;
        case 'insertLineBreak':
        case 'insertParagraph':
          v.empty('new line');
          break;
        case 'insertText':
          v.add(t, e.data);
          break;
        default:
          v.empty(`Unhandled inputType: ${n}`);
      }
    }
  }
  function compositionEndEventListener(e) {
    if (!e.blazeHandled && !e.isBlazeGenerated && !P) {
      ((e.blazeHandled = !0), (F = !1), (O = !1), debug('[COMPOSITION END]', e));
      let t = e.target;
      if (
        (window.EditContext &&
          e.target instanceof window.EditContext &&
          (t = e.target.attachedElements()[0]),
        !allowedToInsert(t))
      )
        return;
      v.add(t, e.data);
    }
  }
  function isEditableInner(e) {
    return (
      (e instanceof win(e).HTMLInputElement && isInputEditable(e)) ||
      e instanceof win(e).HTMLTextAreaElement ||
      e.isContentEditable ||
      'on' === e.ownerDocument.designMode.toLowerCase() ||
      !!e.editContext
    );
  }
  function isEditable(e) {
    return !!e && !!allowedToInsert(e) && isEditableInner(e);
  }
  function isInputEditable(e) {
    return ![
      'submit',
      'button',
      'reset',
      'radio',
      'range',
      'image',
      'file',
      'color',
      'checkbox',
    ].includes(e.type);
  }
  function getFavicon() {
    function e(e) {
      return e.href;
    }
    const t = document.querySelector('link[rel="shortcut icon"]'),
      n = t?.getAttribute('href');
    if (n) return e(t);
    const o = document.querySelector('link[rel="icon"]'),
      i = o?.getAttribute('href');
    return i
      ? e(o)
      : window.location.host
        ? `https://www.google.com/s2/favicons?domain=${window.location.host}&sz=44`
        : '';
  }
  async function sendSubframeMessageViaFocusChange(e, t) {
    const n = promiseSendMessage({ request: 'frameMessage', subType: 'focusChange', message: t });
    e.contentWindow.focus();
    return await n;
  }
  async function sendSubframeMessageViaHeightChange(e, t) {
    const n = parseInt(window.getComputedStyle(e).height, 10);
    if (n < 20)
      return (
        reportToErrorMonitoring(new Error('Very short iframe for message passing'), { height: n }),
        null
      );
    const o = n - 5,
      i = promiseSendMessage({
        request: 'frameMessage',
        subType: 'heightChange',
        message: t,
        depth: getIframeDepth(window) + 1,
        height: o,
      }),
      s = e.getAttribute('style');
    ((e.style.flex = 'none'), (e.style.minHeight = 'auto'), (e.style.height = o + 'px'));
    const r = await i;
    return (
      null !== s ? e.setAttribute('style', s) : e.attributes.removeNamedItem('style'),
      r || null
    );
  }
  function sendSubframeMessage(e, t, n) {
    return 'focus' === e
      ? sendSubframeMessageViaFocusChange(t, n)
      : sendSubframeMessageViaHeightChange(t, n);
  }
  const H = '|>';
  function getFailureError(e, t) {
    const n = t.message;
    return (
      /Failed to execute '(evaluate|querySelector|querySelectorAll)' on 'Document'/.test(n) ||
        reportToErrorMonitoring(t, { selectors: e }),
      'string' == typeof n && n.startsWith('TB: ')
        ? { error: n.substring('TB: '.length) }
        : e.selector
          ? { error: 'Invalid selector "' + e.selector + '"' }
          : { error: 'Invalid XPath "' + e.xpath + '"' }
    );
  }
  async function getDataFromSelectorInner(
    { selector: e, xpath: t },
    { multiple: n, readType: o, rootNode: i, fullSelector: s }
  ) {
    i || (i = document);
    const [r, ...a] = (e || t).split(H);
    a.length > 0 && 0 === getIframeDepth(window) && window.focus();
    const c = document.hasFocus() ? 'focus' : 'height';
    let l = [];
    if (e) l = n ? [...i.querySelectorAll(r)] : [i.querySelector(r)];
    else if (n) {
      const e = document.evaluate(r, i, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      for (let t = 0, n = e.snapshotLength; t < n; t++) l.push(e.snapshotItem(t));
    } else
      l.push(document.evaluate(r, i, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue);
    const d = a.join(H),
      u = { selector: e ? d : null, xpath: t ? d : null };
    let p;
    if (a.length) {
      p = [];
      for (const e of l) {
        let t;
        const i = [u, { multiple: n, readType: o, fullSelector: s }];
        if (isFrameElement(e)) {
          const n = { type: 'getDataFromSelectorMsg', args: i },
            o = await sendSubframeMessage(c, e, n);
          if (o) {
            if ('error' in o) return o;
            t = o.data;
          } else t = null;
        } else {
          if (!(e instanceof HTMLElement && getShadowRoot(e)))
            return { error: 'Invalid match for multi-part selection using: ' + r };
          {
            if (u.xpath)
              return {
                error: 'XPath is not supported across shadow root boundaries. Matched using ' + r,
              };
            const i = await getDataFromSelector(u, {
              multiple: n,
              readType: o,
              rootNode: getShadowRoot(e),
              fullSelector: s,
            });
            if (i) {
              if ('error' in i) return i;
              t = i.data;
            } else t = null;
          }
        }
        t && (n ? p.push(...t) : p.push(t));
      }
      if (!n && 0 === p.length)
        return { error: 'No match found for "' + (s.selector || s.xpath) + '"' };
    } else p = l.map(e => getData(e, o));
    return n ? { data: p } : { data: p[0] };
  }
  function getDataFromSelector(e, t) {
    return getDataFromSelectorInner(e, t).catch(e => getFailureError(t.fullSelector, e));
  }
  function getData(e, t) {
    if (!e) return null;
    if (!(e instanceof HTMLElement)) return e.textContent;
    if ('text' === t) {
      if (e instanceof win(e).HTMLInputElement || e instanceof win(e).HTMLTextAreaElement) {
        const t = e.getAttribute('type');
        return t && 'password' === t.toLowerCase() ? '' : e.value;
      }
      return e instanceof win(e).HTMLSelectElement ? e.options[e.selectedIndex].text : e.innerText;
    }
    return 'html' === t ? e.outerHTML : void 0;
  }
  async function getSiteItems(e) {
    const t = [];
    for (const n of e) {
      const e = n.part;
      if ('title' === e) t.push({ data: document.title });
      else if ('url' === e) t.push({ data: document.URL });
      else if ('context' === e) t.push({ data: getContextContent(n.contextPart) });
      else if (n.selector || n.xpath) {
        const o = { selector: n.selector, xpath: n.xpath };
        t.push(
          await getDataFromSelector(o, { multiple: n.multiple, readType: e, fullSelector: o })
        );
      } else t.push({ data: getData(document.documentElement, e) });
    }
    for (let n = 0; n < e.length; n++) {
      const o = t[n];
      'error' in o &&
        (console.error('Failed to get site selector data'), console.log(e[n], o.error));
    }
    return { results: { data: t }, title: document.title, favicon: getFavicon() };
  }
  async function restoreFocusForForm(e) {
    debug('[RESTORING FOCUS FOR FORM]', e);
    const t = 200;
    let n = 5;
    const o = Date.now();
    function i() {
      return Date.now() - o;
    }
    for (; !document.hasFocus() && i() < t; ) (await promiseDelay(n), (n *= 1.5));
    debug('[RESTORING FOCUS FOR FORM] document focused');
    const s = e.formId;
    let r;
    if (!e.skipElementChecks) {
      if (s && !he[s]) return { success: !1, error: 'Lost focus selection' };
      r = s && he[s].focusedElement;
      const d = r && documentContainsNode(r);
      function a() {
        return r && d && !isEditable(r);
      }
      for (; a() && i() < t; ) (await promiseDelay(n), (n *= 1.5));
      if (
        (debug('[RESTORING FOCUS FOR FORM] old element editable check finished'),
        i() >= t && console.warn('Max insertion delay'),
        s)
      ) {
        const u = restoreFocusAndSelection(s, void 0, e.doNotClear);
        if (!u.found) return { success: !1, error: 'Lost element to focus on' };
        u.changed && (debug('[RESTORE FOCUS DELAY]'), await promiseDelay(120));
      }
    }
    let c = '',
      l = documentActive();
    for (; !isEditable(l); ) {
      if (!(i() < t)) {
        if (!e.skipElementChecks) {
          if (!l || (r && r !== l))
            return { success: !1, error: 'Not able to focus on the correct element' };
          const p = `[FORM SUBMIT] exceeded editable delay. Active element: ${
            l ? l.tagName : null
          }. Prior focused element: ${r ? r.tagName : null}`;
          (console.error(p, { elementToUse: l, priorFocused: r }), (c = p));
        }
        break;
      }
      (await promiseDelay(n), (n *= 1.5), (l = documentActive()));
    }
    if (
      (debug('[RESTORE FOCUS FOR FORM] chosen element', l),
      debug('[RESTORE FOCUS FOR FORM] is result editable', () => isEditable(l)),
      l instanceof HTMLInputElement || l instanceof HTMLTextAreaElement)
    ) {
      const g = win(l);
      g.document.dispatchEvent(new g.Event('selectionchange', { bubbles: !1, cancelable: !1 }));
    }
    return { success: !0, exceededTimeoutMsg: c };
  }
  function isUncollapsedSelection(e) {
    if (e) {
      if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement)
        return e.selectionEnd !== e.selectionStart;
      {
        const t = selectionForElement(e);
        return (
          !(!t || isSelectionObjectCollapsed(t)) &&
          e.contains(t.getRangeAt(0).commonAncestorContainer)
        );
      }
    }
    return !1;
  }
  async function getSidebarFrameSelectionData() {
    const e = documentActive(document, !1);
    if (
      (debug('[SIDEBAR FRAME DATA] data', { focusedElement: e, depth: getIframeDepth(window) }),
      e && isEditableInner(e))
    ) {
      debug('[SIDEBAR FRAME DATA] is editable');
      const t = getSelectionTextsForSidebar(e);
      return (
        debug('[SIDEBAR FRAME DATA] response', t),
        { editable: !0, ...t, precedingText: t.selectedContent || t.fieldTexts?.precedingText }
      );
    }
    const t = getFocusedSelectionObjectAcrossShadowDOM(document);
    if (!t) return (debug('[SIDEBAR FRAME DATA] exit as no selection'), null);
    const n = t.toString();
    let o = null;
    if (t.rangeCount > 0 && 'Range' === t.type) {
      const e = t.getRangeAt(0).getBoundingClientRect();
      o = {
        top: e.top + window.scrollY,
        left: e.left + window.scrollX,
        width: e.width,
        height: e.height,
      };
    }
    return (
      debug('[SIDEBAR FRAME DATA] selection string', n),
      { editable: !1, selectionBounds: o, selectedContent: n, fieldTexts: null, selString: n }
    );
  }
  const _ = document.createElement('span');
  (_.classList.add('tooltip', 'close-button-tooltip-text'), (_.textContent = 'Disable this tab'));
  const W = document.createElement('div');
  W.id = 'restore-container';
  const B = document.createElement('span');
  (B.classList.add('tooltip', 'restore-tooltip'),
    (B.innerText = 'Restore your last chat from this session'));
  const U = document.createElement('div');
  ((U.id = 'restore-icon'),
    W.append(U),
    (U.innerHTML = `<img src="${T.runtime.getURL(
      'images/icon_128_white_bottom.png'
    )}" alt="Icon" style="fill: rgb(0 0 0); border-radius: 100%; width:100%; height:100%">`));
  let q = { top: 'initial', bottom: '50px' };
  const z = 25,
    K = 45;
  function getDocumentOrItsShadowRoot() {
    let e = document,
      t = getShadowRoot(document.body);
    return (t && (e = t), e);
  }
  function getDocumentBodyOrItsShadowRoot() {
    let e = document.body,
      t = getShadowRoot(document.body);
    return (t && (e = t), e);
  }
  const G = 'text-blaze-dragger-overlay',
    X = 1e9;
  let V = null;
  function enableDraggerOverlay() {
    if (getDocumentOrItsShadowRoot().getElementById(G)) return;
    const e = document.createElement('div');
    (e.setAttribute(
      'style',
      `display: block; background: transparent; z-index: ${
        X - 1
      }; position: fixed; left: 0; top: 0; right: 0; bottom: 0;`
    ),
      (e.id = G),
      e.addEventListener('mousedown', disableDraggerOverlay),
      getDocumentBodyOrItsShadowRoot().appendChild(e));
  }
  function disableDraggerOverlay() {
    getDocumentOrItsShadowRoot().getElementById(G)?.remove();
  }
  function createBackgroundElement(e, t, n) {
    const o = document.createElement('div');
    return (
      (o.innerHTML = `\n        <div style="position: absolute; bottom: 0px; right: 0px; left: 0px">\n          <style>\n\n          #${e} {\n            background: rgb(255,252,255);\n          }\n\n          .pulses {\n            position: relative;\n            width: 100%;\n            height: ${t}px;\n            position: absolute;\n            bottom: 0px;\n            left: 0px;\n            right: 0px;\n          }\n\n          .parallax > use {\n            animation: move-x 25s cubic-bezier(.55,.5,.45,.5)     infinite;\n          }\n\n          .parallax > use:nth-child(1) {\n            animation-delay: -2s;\n            animation-duration: 7s;\n          }\n\n          .parallax > use:nth-child(2) {\n            animation-delay: -3s;\n            animation-duration: 10s;\n          }\n          \n          .parallax > use:nth-child(3) {\n            animation-delay: -4s;\n            animation-duration: 13s;\n          }\n          \n          .parallax > use:nth-child(4) {\n            animation-delay: -5s;\n            animation-duration: 20s;\n          }\n          \n          @keyframes move-x {\n            0% {\n            transform: translate3d(-90px,0,0);\n            }\n            100% { \n              transform: translate3d(85px,0,0);\n            }\n          }\n\n          </style>\n\n          <div style="height: ${n}px; position: absolute; bottom: 0; background: linear-gradient(0deg, rgb(255,249,255) 10%, rgba(253, 191, 191, 0%)); width: 100%; pointer-events: none; z-index: 3;"></div>\n\n\n          <svg class="pulses" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n            viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">\n            <defs>\n              <path id="single-pulse" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />\n            </defs>\n            <g class="parallax">\n              <use xlink:href="#single-pulse" x="48" y="0" fill="rgba(173,216,230,0.5)" />\n              <use xlink:href="#single-pulse" x="48" y="3" fill="rgba(255,182,193,0.7)" />\n              <use xlink:href="#single-pulse" x="48" y="5" fill="rgba(255,255,224,0.3)" />\n              <use xlink:href="#single-pulse" x="48" y="7" fill="rgba(221,160,221,0.6)" />\n            </g>\n          </svg>\n\n        </div>\n    `),
      o
    );
  }
  function getContextContent(e) {
    const t = documentActive(document, !1);
    switch (e) {
      case 'selection':
        if (t && isEditableInner(t))
          return isUncollapsedSelection(t) ? getSelectionTexts(t).selectedContent : '';
        const n = getFocusedSelectionObjectAcrossShadowDOM(document);
        return n ? n.toString() : void 0;
      case 'fieldtext':
        return t && isEditableInner(t)
          ? t instanceof win(t).HTMLInputElement || t instanceof win(t).HTMLTextAreaElement
            ? t.value
            : t.innerText
          : '';
      case 'fieldleft':
      case 'fieldright':
        if (t && isEditableInner(t)) {
          const { fieldTexts: n } = getFieldTexts(t);
          return n ? ('fieldleft' === e ? n.precedingText : n.afterText) : void 0;
        }
        return '';
      default:
        return;
    }
  }
  function getVisibleTextFromRange(e) {
    let t = e.startContainer,
      n = e.endContainer,
      o = e.startOffset,
      i = e.endOffset;
    (t.nodeType !== Node.TEXT_NODE && ((t = t.childNodes[e.startOffset]), (o = 0)),
      n.nodeType !== Node.TEXT_NODE && ((n = n.childNodes[e.endOffset]), (i = 0)));
    const s = document.createTreeWalker(e.commonAncestorContainer, NodeFilter.SHOW_ALL);
    let r = '',
      a = s.currentNode;
    for (; a && a !== t; ) a = s.nextNode();
    function c(e) {
      const t = e.parentNode.nodeName;
      return 'STYLE' !== t && 'SCRIPT' !== t;
    }
    for (; a; ) {
      if (a.nodeType !== Node.TEXT_NODE) {
        if (a === n) break;
        a = s.nextNode();
        continue;
      }
      if (a !== t && a !== n) {
        (c(a) && (r += a.textContent), (a = s.nextNode()));
        continue;
      }
      const e = document.createRange();
      if (
        (e.selectNode(a),
        a === t && e.setStart(a, o),
        a === n && e.setEnd(a, i),
        c(a) && (r += e.toString()),
        a === n)
      )
        break;
      a = s.nextNode();
    }
    return r;
  }
  function getSelectionTexts(e) {
    if (e instanceof win(e).HTMLInputElement || e instanceof win(e).HTMLTextAreaElement)
      return {
        selectedContent: e.value.substring(e.selectionStart, e.selectionEnd),
        fieldTexts: null,
      };
    return { selectedContent: selectionForElement(e).toString(), fieldTexts: null };
  }
  function getFieldTexts(e) {
    if (e instanceof win(e).HTMLInputElement || e instanceof win(e).HTMLTextAreaElement) {
      return {
        fieldTexts: {
          precedingText: e.value.substring(0, e.selectionStart),
          afterText: e.value.substring(e.selectionEnd),
        },
        selectedContent: null,
      };
    }
    {
      const t = selectionForElement(e);
      if (t.rangeCount) {
        const n = t.getRangeAt(0).cloneRange(),
          o = n.endContainer,
          i = n.endOffset,
          s = n.startContainer,
          r = n.startOffset;
        (n.setStart(o, i), n.setEnd(e, e.childNodes.length));
        let a = getVisibleTextFromRange(n);
        (n.setStart(e, 0), n.setEnd(s, r));
        let c = getVisibleTextFromRange(n);
        return (
          '' === e.innerText && ((a = ''), (c = '')),
          { fieldTexts: { precedingText: c, afterText: a }, selectedContent: null }
        );
      }
      return (
        reportToErrorMonitoring('No range found for retrieving target text'),
        { selectedContent: '', fieldTexts: null }
      );
    }
  }
  function getSelectionTextsForSidebar(e) {
    return isUncollapsedSelection(e) ? getSelectionTexts(e) : getFieldTexts(e);
  }
  function createAIChatHandler() {
    const e = 60;
    function t(e, t) {
      let n = null;
      return function (...o) {
        (n && clearTimeout(n),
          (n = setTimeout(() => {
            ((n = null), e(...o));
          }, t)));
      };
    }
    const n = 'text-blaze-ai-chat',
      o = 'shown-container',
      s = 'aiChatPosition';
    let a = null,
      l = null,
      u = null,
      p = !1,
      g = null,
      m = { isDragging: !1 },
      f = null,
      h = null,
      E = null,
      b = Math.random().toString(16);
    const y = throttle(t => {
      !0 === m.isDragging && (m.queue = [0, 0]);
      const [n, o] = t,
        i = window.getComputedStyle(l);
      let r = parseFloat(i.left) + n;
      ((r = Math.min(r, window.innerWidth - e)), (r = Math.max(r, e - parseFloat(i.width))));
      let a = Math.max(parseFloat(i.top) + o, 0);
      a = Math.min(a, window.innerHeight - e);
      const c = r + 'px',
        d = a + 'px';
      ((l.style.left = c), (l.style.top = d), writeToExtensionStorage(s, { left: c, top: d }));
    }, 10);
    const T =
      ((w = 'position'),
      t(function (...e) {
        return promiseSendMessage({ request: 'aiChat', type: 'route', route: w, data: e });
      }, 100));
    var w;
    const S = t(function () {
      if (((u.style.pointerEvents = 'initial'), l)) {
        const e = l.offsetHeight,
          t = l.offsetWidth;
        e >= 400 &&
          t >= 400 &&
          promiseSendMessage({ request: 'aiChat', type: 'saveSize', height: e, width: t });
      }
    }, 100);
    let C = null,
      x = null,
      v = null;
    function I() {
      (C && (clearTimeout(C), (C = null)), (B.style.opacity = '1'), L());
    }
    function R() {
      ((B.style.opacity = '0'), k());
    }
    function L() {
      (x && (x.cancel(), (x = null)), v && (v.cancel(), (v = null)));
    }
    function A() {
      (L(), W.removeEventListener('pointerenter', I), W.removeEventListener('pointerleave', R));
    }
    function k() {
      (L(),
        (v = U.animate(
          [
            {
              transform: 'scale(1)',
              opacity: 1,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              offset: 0,
            },
            {
              transform: 'scale(1.2)',
              opacity: 1,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              offset: 0.5,
            },
            {
              transform: 'scale(1)',
              opacity: 1,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              offset: 1,
            },
          ],
          { duration: 300, easing: 'ease' }
        )),
        (x = W.animate(
          [
            { opacity: 1, offset: 0.1 },
            { opacity: 0, offset: 1 },
          ],
          { duration: 1e4, easing: 'ease' }
        )),
        (x.onfinish = () => {
          (F(), (x = null), (v = null));
        }));
    }
    async function D() {
      if ('none' === E.style.display || 'none' === l.style.display) return;
      (debug('[HIDE CHAT IFRAME]'), (E.style.display = 'none'));
      const { right: e, bottom: t } = l.getBoundingClientRect(),
        n = {
          left: l.style.left,
          width: l.style.width,
          top: l.style.top,
          height: l.style.height,
          background: l.style.background,
          border: l.style.border,
          boxShadow: l.style.boxShadow,
          borderRadius: l.style.borderRadius,
          minHeight: l.style.minHeight,
          minWidth: l.style.minWidth,
        };
      (l.style.removeProperty('left'),
        l.style.removeProperty('top'),
        l.style.removeProperty('min-height'),
        l.style.removeProperty('min-width'),
        (l.style.resize = 'none'),
        (l.style.background = 'transparent'),
        (l.style.border = '1px solid #ddd'),
        (l.style.borderRight = 'none'),
        (l.style.boxShadow = 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'),
        (l.style.pointerEvents = 'none'),
        (l.style.position = 'fixed'));
      let o = {
        bottom: 'initial',
        top: 'initial',
        right: K - z / 2 + 'px',
        width: z + 'px',
        height: z + 'px',
        borderRadius: '100%',
      };
      const i = {
          top: 'initial',
          bottom: 'initial',
          right: window.innerWidth - e + 'px',
          width: n.width,
          height: n.height,
          borderRadius: n.borderRadius,
        },
        s = window.innerHeight - t + 'px';
      ((o.bottom = q.bottom), (o.top = q.top), (i.bottom = s));
      const r = Math.min(parseFloat(i.width), parseFloat(i.height)) * (1 - 0.8) + 'px';
      l.animate([i, { width: r, height: r, borderRadius: n.borderRadius, offset: 0.8 }, o], {
        duration: 200,
        easing: 'ease-out',
      }).onfinish = () => {
        for (const e in o) l.style[e] = o[e];
        ((l.style.display = 'none'),
          (W.style.display = 'flex'),
          (E.style.display = 'block'),
          k(),
          (B.style.opacity = '1'),
          (C = setTimeout(() => {
            B.style.opacity = '0';
          }, 1e3)),
          W.addEventListener('pointerenter', I),
          W.addEventListener('pointerleave', R));
        for (const e in n) l.style[e] = n[e];
      };
    }
    function N() {
      (debug('[UNHIDE CHAT IFRAME]'),
        A(),
        u.contentWindow.postMessage({ type: 'restoreScrollTop' }, '*'),
        (l.style.resize = 'both'),
        (l.style.pointerEvents = 'all'),
        (l.style.position = 'fixed'),
        (l.style.display = 'block'),
        (W.style.display = 'none'),
        promiseSendMessage({ request: 'aiChat', type: 'focusChatBox' }),
        $(),
        promiseSendMessage({ request: 'aiChat', type: 'attachListeners' }),
        a && a.observe(l),
        P());
    }
    function M() {
      p &&
        (window.removeEventListener('mousemove', H, !0),
        window.removeEventListener('mouseup', _, !0),
        window.removeEventListener('keydown', G, !0),
        window.removeEventListener('resize', Y),
        (p = !1));
    }
    function O() {
      h && (h.remove(), (h = null));
    }
    function F(e = {}) {
      const { shouldRestore: t, shouldHide: n } = e;
      l &&
        (debug('[CHAT]', n ? 'hiding iframe' : 'closing iframe'),
        M(),
        promiseSendMessage({ request: 'aiChat', type: 'stopListeners' }),
        n ? D() : (l.remove(), (l = null), O()),
        a && a.disconnect(),
        t && restoreFocusAndSelection(i, void 0, !!n));
    }
    async function P() {
      if (!l) return;
      let t = parseFloat(l.style.left),
        n = parseFloat(l.style.top),
        o = !1;
      (t > window.innerWidth - e && ((t = window.innerWidth - e), (o = !0)),
        n > window.innerHeight - e && ((n = window.innerHeight - e), (o = !0)),
        o && ((l.style.top = n + 'px'), (l.style.left = t + 'px')));
    }
    function H(e) {
      if (!1 === m.isDragging) return;
      e.preventDefault();
      const t = [e.screenX, e.screenY],
        [n, o] = m.previousCoordinates,
        [i, s] = [t[0] - n, t[1] - o];
      m.previousCoordinates = t;
      const r = m.queue;
      ((r[0] += i), (r[1] += s), (m.queue = r), y(r));
    }
    function _(e) {
      m.isDragging &&
        (e.preventDefault(),
        (u.style.pointerEvents = 'all'),
        (m = { isDragging: !1 }),
        disableDraggerOverlay());
    }
    function G(e) {
      l && 'Escape' === e.key && F({ shouldHide: !0, forceHide: !0 });
    }
    function Y() {
      T();
    }
    function $() {
      (debug('[CHAT] has already attached listeners', p, document),
        p ||
          isAIChatIframe() ||
          ((p = !0),
          window.addEventListener('mousemove', H, !0),
          window.addEventListener('mouseup', _, !0),
          window.addEventListener('keydown', G, !0),
          window.addEventListener('resize', Y)));
    }
    function j({ isPreloading: e }) {
      if (
        (getDocumentOrItsShadowRoot().querySelector(`[data-tb-tb-unique-id="${b}"]`) || (l = null),
        l && 'true' === l.dataset.isBaseIframe)
      )
        return;
      if (l && e) return;
      ((m = { isDragging: !1 }), A(), O(), (W.style.display = 'none'));
      const t = getDocumentOrItsShadowRoot().getElementById(n);
      (t && t.remove(),
        (l = document.createElement('div')),
        (l.dataset.tbTbUniqueId = b),
        (l.id = n),
        l.setAttribute(
          'style',
          'all: initial; border: 1px solid black; position: fixed; z-index: 10000000000; min-height: 400px; min-width: 400px; resize: both; overflow: hidden; box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset; border-radius: 8px; border: 1px solid #ccc; text-align: center; user-select: none; background-color: rgb(255, 252, 255);'
        ),
        (l.style.display = 'none'),
        (l.dataset.isBaseIframe = 'true'),
        (u = document.createElement('iframe')),
        u.setAttribute('allowTransparency', 'true'));
      const i = c;
      ((u.src = i),
        (u.id = 'tb-tb-chat-iframe'),
        u.setAttribute(
          'style',
          'all: initial; height: 0; width: 0; position: absolute; top: 0; left: 0; background: transparent; z-index: 10;'
        ));
      const s = document.createElement('style');
      s.innerHTML =
        '\n\n#shown-container {\n  background: rgb(255, 249, 255);\n  width: 100%;\n  height: 100%;\n}\n\n#drag-handler {\n  position: absolute;\n  top: 0px;\n  /* space for close button in the iframe\n  (we cannot handle this using z-index) \n  so that we can center the drag handle */\n  --close-button-width: 34px;\n  left: var(--close-button-width);\n  right: var(--close-button-width);\n  text-align: center;\n\n  cursor: grab;\n  background: transparent;\n  height: 20px;\n  opacity: 1;\n  transition: 0.25s ease;\n  z-index: 10000000;\n  user-select: none;\n}\n\n#shown-container {\n  height: 100%;\n  width: 100%;\n  font-family: Roboto, Helvetica, Arial, sans-serif;\n}\n\n#close-button {\n  position: absolute;\n  /* align with close button iframe */\n  top: -1px;\n  right: 5px;\n  color: grey;\n  cursor: pointer;\n  /* align this button closely with the one in iframe */\n  padding: 6px 10px;\n  font-size: 20px;\n  font-family: Arial;\n  margin: 0;\n}\n      ';
      const r = document.createElement('div');
      r.id = 'drag-handler';
      const a = document.createElement('span');
      ((a.textContent = '  ='),
        r.addEventListener('pointerdown', e => {
          ((m = { isDragging: !0, previousCoordinates: [e.screenX, e.screenY], queue: [0, 0] }),
            (u.style.pointerEvents = 'none'),
            enableDraggerOverlay());
        }),
        r.appendChild(a),
        (f = document.createElement('p')),
        f.setAttribute('role', 'button'),
        (f.innerHTML = d()),
        (f.id = 'close-button'),
        f.addEventListener('click', function (e) {
          (F(), e.preventDefault(), e.stopPropagation());
        }),
        (E = document.createElement('div')),
        (E.id = o),
        E.append(u, r, f),
        E.appendChild(s),
        E.appendChild(createBackgroundElement(o, 120, 150)));
      (l.attachShadow({ mode: 'closed' }).append(E),
        getDocumentBodyOrItsShadowRoot().appendChild(l),
        (h = document.createElement('div')),
        (h.id = 'tb-tb-restore-container'));
      const p = h.attachShadow({ mode: 'closed' });
      W.addEventListener('click', () => {
        N();
      });
      const g = document.createElement('style');
      ((g.textContent = `\n        #restore-container {\n          position: fixed;\n          bottom: 50px;\n          right: 10px;\n          display: none;\n          align-items: center;\n          justify-content: center;\n          width: 40px;\n          height: 40px;\n          background-color: rgb(250, 250, 250);\n          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n          border-radius: 100%;\n          transition: opacity 1s ease, box-shadow 1s ease;\n          cursor: pointer;\n          pointer-events: all;\n          display: none;\n          z-index: ${X};\n        }\n        #restore-icon {\n          border-radius: 100%;\n          width: 100%;\n          height: 100%;\n          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n        }\n        .restore-tooltip {\n          position: absolute;\n          top: 100%;\n          right: 0;\n          background-color: rgba(97, 97, 97, 0.92);\n          color: rgb(255, 255, 255);\n          padding: 4px 8px;\n          border-radius: 4px;\n          margin: 9px;\n          font-weight: 500;\n          font-size: 0.6875rem;\n          font-family: Helvetica, Arial, sans-serif;\n          transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 133ms cubic-bezier(0.4, 0, 0.2, 1);\n          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n          white-space: nowrap;\n          opacity: 0;\n          z-index: 1000000000;\n          pointer-events: none;\n        }\n      `),
        p.appendChild(g),
        W.append(B),
        p.appendChild(W),
        document.body.appendChild(h));
    }
    return {
      handleAIChatRequest: async function (e) {
        if ('expand' === e.subType) {
          if ('none' === f.style.display) return;
          clearTimeout(g);
          let e = E.querySelector('#slow-loading');
          (e && e.remove(),
            (u.style.height = '100%'),
            (u.style.width = '100%'),
            setTimeout(() => {
              f.style.display = 'none';
            }, 100));
        } else if ('createBaseIframe' === e.subType) j({ isPreloading: !0 });
        else if ('showEmbed' === e.subType)
          !(async function ({ height: e, width: t }) {
            (j({ isPreloading: !1 }), u.contentWindow.postMessage({ type: 'requestData' }, '*'));
            const n = 0.75 * window.innerHeight,
              o = 0.8 * n,
              i = Math.min(e || n, window.innerHeight - 48),
              r = Math.min(t || o, window.innerWidth - 48);
            let c = null,
              d = null;
            const p = await readFromExtensionStorage(s);
            if (p) {
              let e = parseFloat(p.left),
                t = parseFloat(p.top);
              ((t = Math.max(t, 0)),
                (t = Math.min(t, window.innerHeight - 180)),
                (e = Math.max(e, 180 - r)),
                (e = Math.min(e, window.innerWidth - 180)),
                (c = e + 'px'),
                (d = t + 'px'));
            } else
              ((c = `calc(50vw - ${Math.floor(r / 2)}px)`),
                (d = `calc(50vh - ${Math.floor(i / 2)}px)`));
            (debug('[CHAT] iframe added with position', { left: c, top: d }),
              (l.style.left = c),
              (l.style.top = d),
              (l.style.height = `${i}px`),
              (l.style.width = `${r}px`),
              (l.style.display = 'block'),
              (l.dataset.isBaseIframe = 'false'),
              (a = new ResizeObserver(() => {
                ((u.style.pointerEvents = 'none'),
                  clearTimeout(V),
                  enableDraggerOverlay(),
                  (V = setTimeout(() => {
                    disableDraggerOverlay();
                  }, 50)),
                  S());
              })),
              a.observe(l),
              $(),
              promiseSendMessage({ request: 'aiChat', type: 'attachListeners' }),
              clearTimeout(g),
              (g = setTimeout(() => {
                const e = document.createElement('div');
                (e.setAttribute('id', 'slow-loading'),
                  e.setAttribute(
                    'style',
                    'margin: 0 auto; text-align: center; top: 40%; display: block; font-family: Arial; z-index: 10000000001; position: relative;'
                  ),
                  (e.innerHTML =
                    '\n            <div style="padding: 20px;">\n              Loading is taking longer than usual...\n            </div>\n            <div class="progress-container">\n              <div class="progress-bar">\n                <div class="progress"></div>\n              </div>\n            </div>\n            <style>\n              .progress-container {\n                width: 100%;\n                box-sizing: border-box;\n              }\n\n              .progress-bar {\n                width: 100%;\n                height: 4px;\n                background-color: #e0e0e0;\n                overflow: hidden;\n              }\n\n              .progress {\n                width: 40%;\n                height: 100%;\n                background-color: #54b5bc;\n                transform-origin: left;\n                animation: \n                  fast-progress 5s cubic-bezier(0.4, 0, 0.2, 1) forwards,\n                  slow-progress 20s 5s ease-out forwards;\n              }\n\n              @keyframes fast-progress {\n                to { transform: scaleX(2.25); }\n              }\n\n              @keyframes slow-progress {\n                from { transform: scaleX(2.25); }\n                to { transform: scaleX(2.4875); }\n              }\n            </style>\n          '),
                  reportToErrorMonitoring('Could not load AI Chat within 4000ms'),
                  E.appendChild(e));
              }, 4e3)));
          })(e.size);
        else if ('close' === e.subType) {
          F(...(Array.isArray(e.data) ? e.data : [e.data]));
        } else if ('unhide' === e.subType) N();
        else {
          if ('getSelectionTexts' === e.subType) {
            return await getSidebarFrameSelectionData();
          }
          if ('getPrecedingText' === e.subType) {
            debug('[GET PRECEDING TEXT]');
            const e = await getSidebarFrameSelectionData();
            return e ? (e.selectedContent ? e.selectedContent : e.fieldTexts?.precedingText) : null;
          }
          if ('focusChatBox' === e.subType) {
            document.querySelector('textarea')?.focus();
          } else if ('attachListeners' === e.subType) $();
          else if ('stopListeners' === e.subType) M();
          else if ('position' === e.subType) P();
          else {
            if ('forceClearEmbed' === e.subType) {
              const e = getDocumentOrItsShadowRoot().getElementById(n);
              return e ? (e.remove(), { success: !0 }) : { success: !1 };
            }
            if ('shouldTakeScreenshot' === e.subType) return !document.body?.classList.contains(r);
          }
        }
      },
    };
  }
  const { handleAIChatRequest: Y } = createAIChatHandler();
  function createConfettiHandler() {
    const e = 1250,
      t = document.createElement('canvas');
    t.id = 'text-blaze-confetti';
    const n = t.getContext('2d');
    let o, i, s, r, a;
    ((t.width = 0),
      (t.height = 0),
      (t.style.position = 'absolute'),
      (t.style.zIndex = '2147483647'),
      (t.style.pointerEvents = 'none'));
    let c = [],
      l = [];
    const d = [
      { front: '#ff3800', back: '#e4562c' },
      { front: '#ffd55c', back: '#e57d4a' },
      { front: '#e11e3e', back: '#d60030' },
    ];
    let u;
    function p(e, t) {
      return Math.random() * (t - e) + e;
    }
    function g(e, t) {
      const n = p(e[0], e[1]),
        o = t[1] - t[0] + 1;
      let s = t[1] - Math.abs(p(0, o) + p(0, o) - o);
      s >= t[1] - 1 && (s += Math.random() < 0.25 ? p(1, 3) : 0);
      const r = i,
        a = Math.sqrt(Math.abs(0.8 * r));
      let c;
      return ((c = s <= a ? s : p(0, a)), { x: n, y: -c });
    }
    function m() {
      const e = Math.max(Math.min(200, o), 150),
        t = s + o / 2;
      return { x: p(t - e / 2, t + e / 2), y: i };
    }
    function f() {
      document.getElementById(t.id) || document.body.appendChild(t);
      for (let e = 0; e < 15; e++)
        c.push({
          randomModifier: p(0, 99),
          color: d[Math.floor(p(0, d.length))],
          dimensions: { x: p(5, 9), y: p(8, 15) },
          position: m(),
          rotation: p(0, 2 * Math.PI),
          scale: { x: 1, y: 1 },
          velocity: g([-9, 9], [6, 11]),
          update: function (e) {
            ((this.velocity.x -= 0.075 * this.velocity.x * e),
              (this.velocity.y = Math.min(this.velocity.y + 0.4 * e, 5)),
              (this.velocity.x += (Math.random() > 0.5 ? Math.random() : -Math.random()) * e),
              (this.position.x += this.velocity.x * e),
              (this.position.y += this.velocity.y * e),
              (this.scale.y = Math.cos(0.09 * (this.position.y + this.randomModifier))));
          },
          render: function (e) {
            const o = this.dimensions.x * this.scale.x,
              s = this.dimensions.y * this.scale.y;
            (n.translate(this.position.x, this.position.y),
              n.rotate(this.rotation),
              this.update(e),
              (n.fillStyle = this.scale.y > 0 ? this.color.front : this.color.back),
              n.fillRect(-o / 2, -s / 2, o, s),
              n.setTransform(1, 0, 0, 1, 0, 0),
              this.velocity.y < 0 && n.clearRect(0, i, t.width, t.height));
          },
        });
      for (let e = 0; e < 7; e++)
        l.push({
          color: d[Math.floor(p(0, d.length))].back,
          radius: p(1, 2),
          position: m(),
          velocity: g([-6, 6], [8, 12]),
          update: function (e) {
            ((this.velocity.x -= 0.02 * this.velocity.x * e),
              (this.velocity.y = this.velocity.y + 0.55 * e),
              (this.position.x += this.velocity.x * e),
              (this.position.y += this.velocity.y * e));
          },
          render: function (e) {
            (n.translate(this.position.x, this.position.y),
              this.update(e),
              (n.fillStyle = this.color),
              n.beginPath(),
              n.arc(0, 0, this.radius, 0, 2 * Math.PI),
              n.fill(),
              n.setTransform(1, 0, 0, 1, 0, 0),
              this.velocity.y < 0 && n.clearRect(0, i, t.width, t.height));
          },
        });
    }
    let h = !1;
    function E(o) {
      let i, s;
      void 0 === o
        ? ((i = 0), (s = 0))
        : (r || (r = o), a || (a = o), (i = o - r), (r = o), (s = o - a));
      const d = 0.05 * i;
      (n.clearRect(0, 0, t.width, t.height),
        (n.globalAlpha = s < e ? 1 : s < 1500 ? 1 - (s - e) / 250 : 0));
      for (const e of c) e.render(d);
      for (const e of l) e.render(d);
      const p = 0 === c.length && 0 === l.length,
        g = 0 === n.globalAlpha;
      if (p || g) {
        for (h = !1, r = void 0, a = void 0; c.length; ) c.pop();
        for (; l.length; ) l.pop();
        t.remove();
      } else
        ((c = c.filter(e => e.position.y <= t.height)),
          (l = l.filter(e => e.position.y <= t.height)),
          u++,
          window.requestAnimationFrame(E));
    }
    function b(e) {
      return new Promise(t => {
        new IntersectionObserver(function (n, o) {
          (n.forEach(n => {
            if (n.target === e) {
              const o = e.getBoundingClientRect();
              let i;
              ((i = !!n.isIntersecting
                ? { width: o.width, right: o.right, bottom: o.bottom, left: o.left, top: o.top }
                : {}),
                t(i));
            }
          }),
            o.disconnect());
        }).observe(e);
      });
    }
    function y({ right: e, width: n, bottom: r, left: a }) {
      void 0 === e &&
        ((e = window.innerWidth), (n = window.innerWidth), (r = window.innerHeight), (a = 0));
      const c = Math.min(e, n, window.innerWidth);
      ((o = c),
        (i = Math.min(r, window.innerHeight)),
        (s = Math.max(a, 0)),
        (u = 0),
        (t.width = document.body.getBoundingClientRect().width),
        (t.height = window.innerHeight),
        (t.style.top = window.scrollY + 'px'),
        (t.style.left = window.scrollX + 'px'),
        f(),
        h || ((h = !0), E(void 0)));
    }
    return {
      handleConfettiRequest: function (e) {
        if ('show' === e.subType) y(e.dimensions);
        else if ('getActiveElementDimension' === e.subType) {
          const e = documentActive(document, !1);
          return e
            ? b(e)
            : (reportToErrorMonitoring('Active element is null for confetti', {
                tagName: document.activeElement?.tagName,
                nodeType: document.activeElement?.nodeType,
              }),
              null);
        }
      },
      showConfettiRouted: async function () {
        const e = documentActive();
        let t;
        if (e) {
          if (e instanceof HTMLElement && e.isContentEditable && 'BODY' === e.tagName)
            t = 'refer-parent';
          else {
            if (e.nodeType !== Node.ELEMENT_NODE)
              return void reportToErrorMonitoring('Trying to observe non-element node', {
                tagName: e.tagName,
                nodeType: e.nodeType,
              });
            t = await b(e);
          }
          promiseSendMessage({ request: 'confetti', type: 'show', dimensions: t });
        }
      },
    };
  }
  const { handleConfettiRequest: $, showConfettiRouted: j } = createConfettiHandler();
  function isCurrentFrameFocused() {
    if (document.hasFocus()) {
      const e = documentActive(document, !1)?.tagName;
      return 'IFRAME' !== e && 'FRAME' !== e;
    }
    return !1;
  }
  async function handleInsertSnippetSeparateContext(e) {
    debug('[MESSAGE - complete]', e);
    const t = isCurrentFrameFocused();
    if (e.validateFocus && !t) return;
    'assistant' === e.insertionType && (await restoreFocusForForm({ formId: n }));
    const o = documentActive(document, !e.validateFocus);
    !e.validateFocus || isEditable(o)
      ? insertSnippetByID(o, e.snippetId, { insertionType: e.insertionType })
      : debug(
          '[BAILED INSERTION]',
          { document: document, focusedElement: o, activeElement: document.activeElement },
          'hasFocus',
          () => document.hasFocus(),
          'isEditable',
          () => isEditable(o)
        );
  }
  function safeStringSlice(e, t, n) {
    return [...e].slice(t, n).join('');
  }
  function getContextFromString(e, t, n, o) {
    let i = o - t.length;
    if (i <= 0) return { beforeText: '', focusedContent: safeStringSlice(t, 0, o), afterText: '' };
    let s = Math.floor(0.6 * i),
      r = e.slice(0, n);
    r = safeStringSlice(r, Math.max(0, n - s));
    let a = i - [...r].length,
      c = e.slice(n + t.length);
    c = safeStringSlice(c, 0, a);
    let l = i - [...c].length;
    return (
      l > s && ((s = l), (r = e.slice(0, n)), (r = safeStringSlice(r, Math.max(0, n - s)))),
      { beforeText: r, focusedContent: t, afterText: c }
    );
  }
  T.runtime.onMessage.addListener(function (e, t, s) {
    try {
      switch (e.type) {
        case 'desktopIntegrationStatus':
          updateDesktopIntegrationStatus(e.status);
          break;
        case 'isAlive':
          s(!0);
          break;
        case 'getUrl':
          s(getUrl());
          break;
        case 'insert_snippet_embed': {
          be.focus();
          let t = documentActive(document, !1) || document.body;
          (isElementManagedByBlaze(t) &&
            (t.blur(), (t = documentActive(document, !1) || document.body)),
            debug('[FOCUSED ELEMENT]', t));
          let n = e.fieldTexts;
          (!n && e.precedingText && (n = { precedingText: e.precedingText, afterText: '' }),
            e.details
              ? insertSnippetByText(
                  t,
                  e.details,
                  e.insertionType,
                  e.selectedContent,
                  e.fieldTexts,
                  e.sessionId
                )
              : insertSnippetByID(t, e.snippetId, {
                  insertionType: 'sidebar',
                  fieldTexts: n,
                  selectedContent: e.selectedContent,
                }));
          break;
        }
        case 'insert_snippet_separate_context':
          handleInsertSnippetSeparateContext(e);
          break;
        case 'replacementComplete':
          (v.empty('insert finished'), j());
          break;
        case 'insertReplacement':
          return (
            debug('[REPLACEMENT DATA RECEIVED]', e.replacementData),
            insertReplacement(e.replacementData)
              .then(e => {
                s(e);
              })
              .catch(e => {
                let t = { message: 'Replacement failed' };
                ((t =
                  e instanceof Error
                    ? { stack: e.stack, name: e.name, message: e.message }
                    : { message: e }),
                  console.error(t),
                  s({ success: !1, error: t }));
              }),
            !0
          );
        case 'restoreFocusForForm':
          return (
            window.focus(),
            restoreFocusForForm(e.data)
              .then(e => {
                ('error' in e && console.error(e.error), s(e));
              })
              .catch(e => {
                (console.error(e),
                  s({ success: !1, error: `[FORM RESTORE]: ${e.message}`, shouldLog: !0 }));
              }),
            !0
          );
        case 'editable_check_focused':
          return (debug('[EDITABLE CHECK FOCUSED]'), getSidebarFrameSelectionData().then(s), !0);
        case 'editable_check':
          let t, r;
          const a = Ee?.deref();
          (a && isEditable(a)
            ? ((t = a), (r = !0), debug('[EDITABLE CHECK]', 'Using last focused element', t))
            : ((t = documentActive(document, !1)), (r = isEditable(t))),
            r
              ? (s({ hasSelection: isUncollapsedSelection(t), editable: !0 }),
                saveFocusAndSelection(n, t, !0))
              : delete he[n]);
          break;
        case 'picker':
          if ('stopPicker' === e.subType)
            ('undefined' == typeof PickerComponent ||
              PickerComponent.hasStopped() ||
              PickerComponent.removeFromPage(),
              null !== document.getElementById('tb-tb-container') &&
                reportToErrorMonitoring('Failed to clear picker from page'));
          else if ('restartPicker' === e.subType) {
            if ('undefined' == typeof PickerComponent)
              return void promiseSendMessage({ request: 'picker', subType: 'install' });
            PickerComponent.handlePageInitialization(e.config);
          } else if ('undefined' != typeof Picker) return Picker.handleRequest(e);
          break;
        case 'getFocusOffset':
          const c = documentActive(document, !1),
            l = c.getBoundingClientRect();
          let { top: d, left: p } = l;
          if (isFrameElement(c)) {
            const e = getComputedStyle(c);
            ((d += parseInt(e.paddingTop)),
              (d += parseInt(e.borderTopWidth)),
              (p += parseInt(e.paddingLeft)),
              (p += parseInt(e.borderLeftWidth)));
          }
          s({ top: d, left: p });
          break;
        case 'widget':
          if ('displayWidget' === e.subType)
            u.displayWidget(
              e.shortcut,
              e.matchingSnippets,
              e.widgetDeployPercent,
              e.caretPosition
            ).then(() => s('ack'));
          else if ('resetWidget' === e.subType) (u.resetWidget(), s('ack'));
          else if ('hideWidget' === e.subType) (u.hideWidget(), s('ack'));
          else if ('listenerWidget' === e.subType) (u.attachWindowListener(), s('ack'));
          else if ('insertSnippet' === e.subType)
            return (u.insertSnippetByElement(e.snipId, e.eventType).then(() => s('ack')), !0);
          break;
        case 'doHaveFocus': {
          const e = null !== document.activeElement && document.hasFocus();
          s({ hasFocus: e, tagName: document.activeElement?.tagName });
          break;
        }
        case 'respondIfFocused':
          isCurrentFrameFocused() && promiseSendMessage({ request: 'updateFocused' });
          break;
        case 'getSiteItems':
          return (
            getSiteItems(e.items).then(e => {
              s(e);
            }),
            !0
          );
        case 'updateStreamTimeout':
          e.value && v.setResetTimeout(e.value);
          break;
        case 'debug':
          debug('[BACKGROUND]', ...e.value);
          break;
        case 'enableDebug':
          debugblaze = !0;
          break;
        case 'inPageNotification':
          (createInPageNotification(e.data), s('ack'));
          break;
        case 'getDocBody':
          try {
            const e = 24e3;
            let t = convertDocumentToMarkdown(document, {
              focusedNodeText: '[[BLAZE USER IS FOCUSED IN THIS AREA OF THE PAGE]]',
              maxLength: e,
            });
            if (window.parent !== window && t.length < e)
              try {
                t = convertDocumentToMarkdown(window.parent.document, {
                  focusedNodeText: t,
                  maxLength: e - t.length,
                });
              } catch (e) {}
            s({ pageContent: t });
            break;
          } catch (e) {
            (reportToErrorMonitoring(e), s({ pageContent: '' }));
            break;
          }
        case 'getDataFromSelectorMsg':
          return (
            getDataFromSelector(...e.args).then(e => {
              s(e);
            }),
            !0
          );
        case 'saveFrameFocus':
          (saveFocusAndSelection(n, null, !0), s('done'));
          break;
        case 'restoreFrameFocus':
          if ((window.focus(), e.focusFrameOnly)) {
            s('done');
            break;
          }
          return (
            restoreFocusForForm({ formId: e.autoSaved ? o : n }).then(() => {
              s('done');
            }),
            !0
          );
        case 'getCaretPosition': {
          const e = he[i]?.focusedElement || document.activeElement,
            t = isEditable(e) ? g(e) : null;
          let n;
          return (
            (n =
              !t || (0 === t.left && 0 === t.right) || (0 === t.top && 0 === t.bottom)
                ? {
                    position: {
                      top: 0,
                      left: 0,
                      right: window.innerWidth,
                      bottom: window.innerHeight,
                      static: !0,
                    },
                  }
                : { position: t }),
            s(n)
          );
        }
        case 'aiChat':
          return (Y(e).then(s), !0);
        case 'confetti': {
          const t = $(e);
          if (t)
            return (
              t?.then(e => {
                s(e);
              }),
              !0
            );
          break;
        }
        case 'isAIBlazeActive':
          return s({ isActive: isAIBlazeExtensionActive() });
        case 'placeFocusCrossIframesMsg':
          return (
            placeFocusCrossIframes(...e.args).then(e => {
              s(e);
            }),
            !0
          );
        case 'pollHeight': {
          const t = window.innerHeight,
            n = getIframeDepth(window);
          Math.abs(e.height - t) <= 0.1 &&
            e.depth === n &&
            promiseSendMessage({
              request: 'frameUpdate',
              subType: 'heightChange',
              height: t,
              depth: n,
            });
          break;
        }
        case 'getIframesMetadata':
          return s({ count: getIframesCount(window) });
        case 'reportFrameDepth':
          promiseSendMessage({ request: 'reportFrameDepth', depth: getIframeDepth(window) });
          break;
        default:
          console.error('Unknown request type', e.type);
      }
    } catch (e) {
      throw (reportToErrorMonitoring(e), e);
    }
  });
  let J = new Set(['script', 'style', 'noscript', 'template']),
    Z = new Set([
      'address',
      'article',
      'aside',
      'blockquote',
      'div',
      'dl',
      'fieldset',
      'figcaption',
      'figure',
      'footer',
      'form',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'header',
      'hr',
      'li',
      'main',
      'nav',
      'ol',
      'p',
      'pre',
      'section',
      'table',
      'td',
      'th',
      'tr',
      'ul',
    ]),
    Q = /([[\]])/g,
    ee = /\n{3,}/g,
    te = /\n\s+\n/g,
    ne = / {2,}/g,
    oe = /\[([^\]]+)\]/g;
  const ie = '[[BLAZE USER SELECTION START]]',
    se = '[[BLAZE USER SELECTION END]]',
    re = '[[FOCUSED TEXT BOX START]]',
    ae = '[[FOCUSED TEXT BOX END]]',
    ce = '[[BLAZE USER CURSOR]]';
  function convertDocumentToMarkdown(e, t = {}) {
    let n = e.body;
    const {
      activeElement: o,
      selection: i,
      range: s,
      selectedText: a,
      precedingText: c,
      afterText: l,
    } = (function () {
      let t,
        n,
        o,
        i = e.activeElement,
        s = '',
        r = '',
        a = '';
      if (((e.getSelection().toString() || i !== e.body) && (t = i), t))
        if (((n = selectionForElement(t)), (s = n.toString()), s))
          n.rangeCount
            ? (o = n.getRangeAt(0))
            : reportToErrorMonitoring('No range found for retrieving selected text');
        else if (isEditableInner(t)) {
          const { fieldTexts: e } = getFieldTexts(t);
          e && ((r = e.precedingText), (a = e.afterText));
        }
      return {
        activeElement: t,
        selection: n,
        range: o,
        selectedText: s,
        precedingText: r,
        afterText: a,
      };
    })();
    let d = !!o,
      { focusedNodeText: u = '', maxLength: p = null } = t,
      g = [],
      m = 0,
      f = [],
      h = !1,
      E = [],
      b = 0,
      y = [];
    for (f.push({ node: n, isClosing: !1, isTextboxEnd: !1 }); f.length; ) {
      let { node: e, isClosing: t, isTextboxEnd: n } = f.pop(),
        T = e.nodeType,
        w = T === Node.ELEMENT_NODE ? e.tagName.toLowerCase() : '';
      if (T === Node.ELEMENT_NODE && e.classList.contains(r)) continue;
      if (t) {
        if (T !== Node.ELEMENT_NODE) continue;
        let e = '';
        switch (w) {
          case 'strong':
          case 'b':
          case 'em':
          case 'i':
          case 'u':
          case 'del':
          case 's':
          case 'sup':
          case 'sub':
            e = y.pop();
            break;
          case 'a':
            e = ']()';
            break;
          case 'code':
            y.includes('```') || ((e = '`'), y.pop());
            break;
          case 'pre':
            ((e = '\n```\n'), y.pop());
            break;
          case 'blockquote':
          case 'li':
            e = '\n';
            break;
          case 'ol':
            (E.pop(), b--, (e = '\n'));
            break;
          case 'ul':
            (b--, (e = '\n'));
            break;
          case 'p':
          case 'div':
          case 'table':
          case 'tr':
          case 'td':
          case 'th':
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            e = '\n\n';
        }
        if (e && (g.push(e), (m += e.length), p && m >= p && !d)) {
          g.push('...');
          break;
        }
        h = Z.has(w);
        continue;
      }
      if (T === Node.TEXT_NODE) {
        let t = e.nodeValue;
        if (
          !t.trim() &&
          (e.parentElement instanceof win(e).HTMLOListElement ||
            e.parentElement instanceof win(e).HTMLUListElement)
        )
          continue;
        const i = t => {
          let n = e.parentElement;
          return (
            'a' === (n ? n.tagName.toLowerCase() : '') && (t = (t = t.trim()).replace(Q, '\\$1')),
            t
          );
        };
        if (a && d && s) {
          const { startContainer: r, startOffset: a, endContainer: c, endOffset: l } = s;
          if (r === e) {
            const e = s.cloneRange();
            (e.setStart(r, 0),
              e.setEnd(r, a),
              (t = i(e.toString()) + u),
              isEditableInner(o) || (d = !1));
          }
          if (c === e) {
            const n = s.cloneRange();
            (n.setStart(c, l),
              n.setEnd(c, c.textContent.length),
              r === e ? (t += i(n.toString())) : (t = i(n.toString())));
          }
          if (n) {
            if (((d = !1), g.push(ae), (m += ae.length), p && m >= p && !d)) {
              g.push('...');
              break;
            }
            continue;
          }
          e !== r && e !== c && (t = i(t));
        } else t = i(t);
        if ((g.push(t), (m += t.length), p && m >= p && !d)) {
          g.push('...');
          break;
        }
        h = !1;
        continue;
      }
      if (T !== Node.ELEMENT_NODE) continue;
      if (
        J.has(w) ||
        (!e.checkVisibility({ visibilityProperty: !0, opacityProperty: !0 }) &&
          'contents' !== window.getComputedStyle(e).getPropertyValue('display'))
      )
        continue;
      if (!a && e === o && d) {
        if (
          ((d = !1),
          isEditableInner(e) && (u = re + c + ce + l + ae),
          g.push(u),
          (m += u.length),
          p && m >= p && !d)
        ) {
          g.push('...');
          break;
        }
        continue;
      }
      let S = '';
      switch ((Z.has(w) && !h && (g.push('\n\n'), (m += 2)), w)) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          S = '#'.repeat(parseInt(w.charAt(1), 10)) + ' ';
          break;
        case 'strong':
        case 'b':
          ((S = '**'), y.push('**'));
          break;
        case 'em':
        case 'i':
          ((S = '*'), y.push('*'));
          break;
        case 'u':
          ((S = '__'), y.push('__'));
          break;
        case 'del':
        case 's':
          ((S = '~~'), y.push('~~'));
          break;
        case 'sup':
          ((S = '^('), y.push(')'));
          break;
        case 'sub':
          ((S = '~('), y.push(')'));
          break;
        case 'a':
          S = '[';
          break;
        case 'code':
          'pre' !== (e.parentElement ? e.parentElement.tagName.toLowerCase() : '') &&
            ((S = '`'), y.push('`'));
          break;
        case 'pre':
          ((S = '```\n'), y.push('```'));
          break;
        case 'li': {
          let t = e.parentElement ? e.parentElement.tagName.toLowerCase() : '',
            n = ' '.repeat(Math.max(b - 1, 0));
          'ol' === t
            ? (E.length ? E[E.length - 1]++ : E.push(1), (S = `${n}${E[E.length - 1]}. `))
            : (S = `${n}- `);
          break;
        }
        case 'ol':
          (b++, E.push(0), (S = ''));
          break;
        case 'ul':
          (b++, (S = ''));
          break;
        case 'blockquote':
          S = '> ';
          break;
        case 'br':
          S = '\n';
          break;
        case 'hr':
          S = '\n\n---\n\n';
          break;
        case 'img': {
          let t = e.getAttribute('alt') || '';
          if (t) {
            let e = `![${t}]()`;
            (g.push(e), (m += e.length));
          }
          break;
        }
      }
      if (S && (g.push(S), (m += S.length), p && m >= p && !d)) {
        g.push('...');
        break;
      }
      if (e instanceof win(e).HTMLInputElement && !isInputEditable(e)) {
        let t = '';
        switch (e.type) {
          case 'submit':
          case 'button':
          case 'reset':
          case 'range':
          case 'color':
          case 'file':
            t = e.value || '';
            break;
          case 'checkbox':
            t = `[${e.checked ? 'x' : ' '}] `;
            break;
          case 'radio':
            t = `(${e.checked ? 'x' : ' '}) `;
            break;
          case 'image':
            t = e.alt || '';
        }
        if ((g.push(t), (m += t.length), p && m >= p && !d)) {
          g.push('...');
          break;
        }
        continue;
      }
      if (e instanceof win(e).HTMLInputElement || e instanceof win(e).HTMLTextAreaElement) {
        let t = e.value || '';
        if (a && e === o && d) {
          d = !1;
          const n = e.selectionStart,
            o = e.selectionEnd,
            i = t.substring(0, n),
            s = t.substring(o);
          ((u = ie + a + se), (t = re + i + u + s + ae));
        }
        if ((g.push(t), (m += t.length), p && m >= p && !d)) {
          g.push('...');
          break;
        }
        continue;
      }
      ((h = Z.has(w)), f.push({ node: e, isClosing: !0 }));
      let C = e.childNodes;
      a &&
        e === o &&
        d &&
        ((u = ie + a + se),
        isEditableInner(e) && f.push({ node: new Text(''), isClosing: !1, isTextboxEnd: !0 }));
      for (let e = C.length - 1; e >= 0; e--)
        (a &&
          d &&
          s &&
          s.startContainer !== C[e] &&
          s.endContainer !== C[e] &&
          i.containsNode(C[e])) ||
          f.push({ node: C[e], isClosing: !1, isTextboxEnd: !1 });
      if (
        a &&
        e === o &&
        d &&
        isEditableInner(e) &&
        (g.push(re), (m += re.length), p && m >= p && !d)
      ) {
        g.push('...');
        break;
      }
      if (e instanceof win(e).HTMLElement && getShadowRoot(e)) {
        let t = getShadowRoot(e).childNodes;
        for (let e = t.length - 1; e >= 0; e--) f.push({ node: t[e], isClosing: !1 });
      }
      if (
        (e instanceof win(e).HTMLIFrameElement &&
          e.contentDocument &&
          f.push({ node: e.contentDocument.body, isClosing: !1 }),
        p && m >= p && !d)
      ) {
        g.push('...');
        break;
      }
    }
    let T = g.join('');
    if (
      ((T = T.replace(ne, ' ')),
      (T = T.replace(te, '\n\n')),
      (T = T.replace(ee, '\n\n')),
      (T = T.replace(oe, function (e, t) {
        return '[' + t.replace(/\s*\n\s*/g, ' ').trim() + ']';
      })),
      (T = T.replaceAll(' ', ' ')),
      (T = T.trim()),
      p && T.length > p)
    ) {
      let e = T.indexOf(u);
      if (-1 === e) return safeStringSlice(T, 0, p);
      let t = getContextFromString(T, u, e, p);
      T = t.beforeText + t.focusedContent + t.afterText;
    }
    return T;
  }
  function getIframesCount(e) {
    try {
      let t = 1;
      for (let n = 0; n < e.frames.length; n++) t += getIframesCount(e.frames[n]);
      return t;
    } catch (e) {
      return (reportToErrorMonitoring(e), 0);
    }
  }
  async function lookupShortcuts(e, t) {
    if (extensionActive()) {
      debug('[LOOKUP SHORTCUT]', t);
      return replacementRequestHandler({
        target: e,
        request: {
          request: 'getReplacement',
          shortcut: t,
          insertionType: 'shortcut',
          editorData: null,
        },
        typedShortcutText: t,
      });
    }
  }
  const le = '[{!~TB!!/]';
  function editorRequiresSpecialCursorPositioning(e) {
    return de.isCkEditor4(e) || de.isProsemirror(e) || de.isTinyMce5(e);
  }
  function insertCursorPlaceholderAtPosition(e, t, n = !1) {
    return e && null !== t ? (n && (t = e.length - t), e.slice(0, t) + le + e.slice(t)) : e;
  }
  function doesElementMatchSelector(e, { classes: t = [], tagName: n = null, id: o = null }) {
    let i = !n || e.tagName === n;
    return ((i = i && (!o || e.id === o)), (i = i && t.every(t => e.classList.contains(t))), i);
  }
  const de = {
    isCkEditor4: function (e) {
      return (
        doesElementMatchSelector(e, { classes: ['cke_editable'], tagName: 'BODY' }) &&
        window.parent !== window
      );
    },
    isTinyMce5: function (e) {
      if (
        !doesElementMatchSelector(e, {
          classes: ['mce-content-body'],
          tagName: 'BODY',
          id: 'tinymce',
        })
      )
        return !1;
      const t = e.ownerDocument.defaultView;
      if (!t) return !1;
      const n = t.frameElement;
      if (!n) return !1;
      const o = n.parentElement;
      return !(!o || !doesElementMatchSelector(o, { classes: ['tox-edit-area'] }));
    },
    isProsemirror: function (e) {
      return doesElementMatchSelector(e, { classes: ['ProseMirror'] });
    },
  };
  function isSelectionObjectCollapsed(e) {
    return !(e.rangeCount > 0) || e.getRangeAt(0).collapsed;
  }
  function isSelectionCollapsed(e) {
    if (e.isContentEditable) {
      return selectionForElement(e).isCollapsed;
    }
    if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement)
      return e.selectionEnd === e.selectionStart;
  }
  async function clearTextPrecedingCursor(e) {
    if (!isEditableInner(e))
      return (console.warn('Invalid target', e, 'for clearing text before cursor'), !1);
    if (
      (debug('[CLEARING TEXT PRECEDING CURSOR]', e),
      e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement)
    )
      ((e.value = e.value.substring(e.selectionEnd)),
        (e.selectionStart = e.selectionEnd = 0),
        debug('[CLEARED TEXT PRECEDING CURSOR] plain text'));
    else {
      const t = selectionForElement(e);
      if (t.rangeCount) {
        const n = t.getRangeAt(0).cloneRange(),
          o = n.endContainer;
        (n.setStart(e, 0), n.setEnd(o, n.endOffset));
        !n.collapsed &&
          (t.removeAllRanges(),
          t.addRange(n),
          await promiseDelay(1),
          sendKey({ key: 'backspace' }),
          debug('[CLEARED TEXT PRECEDING CURSOR] content editable'));
      }
    }
  }
  function emulateSelectAllOrClickEnd(e, t = !1) {
    const n = e.editContext,
      o = win(e),
      i = win(e).document;
    if (n) {
      const n = o.getSelection();
      (n.getRangeAt(0).selectNodeContents(e),
        t && n.collapseToEnd(),
        i.dispatchEvent(new Event('selectionchange')));
    } else if ((i.execCommand('selectAll', !1), t)) {
      o.getSelection().collapseToEnd();
    }
  }
  function showContainerAroundElement(e) {
    for (; e.parentElement && isEditable(e.parentElement); ) e = e.parentElement;
    const t = e.getBoundingClientRect(),
      n = document.createElement('div');
    ((n.id = 'text-blaze-animater'),
      (n.style.background = 'rgb(255 255 80 / 50%)'),
      (n.style.position = 'absolute'),
      (n.style.boxSizing = 'border-box'));
    const o = t.top + window.scrollY,
      i = t.left + window.scrollX,
      s = t.height,
      r = t.width,
      a = e => e + 'px';
    ((n.style.top = a(o)),
      (n.style.left = a(i)),
      (n.style.height = a(s)),
      (n.style.width = a(r)),
      (n.style.zIndex = '100000000000'),
      (n.style.pointerEvents = 'none'),
      (n.inert = !0));
    const c = e.ownerDocument.body;
    if (e === c) return;
    (c.appendChild(n), n.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }));
    n.animate(
      [
        { opacity: 0.5 },
        { opacity: 1, top: a(o - 12), left: a(i - 12), width: a(r + 24), height: a(s + 24) },
        { opacity: 0.1, top: a(o), left: a(i), height: a(s), width: a(r) },
      ],
      { duration: 350 }
    ).addEventListener('finish', () => {
      n.remove();
    });
  }
  async function placeFocusCrossIframes({ selector: e, xpath: t, rootNode: n, timeoutMs: o }) {
    n || (n = document);
    const [i, ...s] = (e || t).split(H);
    0 === getIframeDepth(window) && window.focus();
    const r = await placeFocusWithTimeout({
      selector: e ? i : '',
      xpath: t ? i : '',
      timeoutMs: o,
      rootNode: n,
    });
    if (!1 === r.success) return r;
    o = r.remainingTimeMs;
    const a = r.element;
    if (s.length > 0) {
      const n = s.join(H),
        r = [{ selector: e ? n : '', xpath: t ? n : '', timeoutMs: o }];
      if (isFrameElement(a)) {
        const e = { type: 'placeFocusCrossIframesMsg', args: r };
        return await sendSubframeMessage('focus', a, e);
      }
      return a instanceof win(a).HTMLElement && getShadowRoot(a)
        ? ((r[0].rootNode = getShadowRoot(a)), placeFocusCrossIframes(...r))
        : { success: !1, error: 'Invalid match for multi-part selection using: ' + i };
    }
    if (!(a && a instanceof win(a).HTMLElement))
      return { success: !1, error: (t || e) + ' did not match any interactive element' };
    const c = a;
    return (c.focus(), showContainerAroundElement(c), triggerClickOnElement(c), { success: !0 });
  }
  function triggerClickOnElement(e) {
    (emulateClickOnElement(e),
      isEditable(e) &&
        (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement
          ? (e.selectionEnd = e.selectionStart = e.value.length)
          : emulateSelectAllOrClickEnd(e, !0)));
  }
  async function placeFocus({ rootNode: e, selector: t, xpath: n }) {
    let o;
    try {
      n
        ? ((o = document.evaluate(n, e, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue),
          o && o.nodeType === Node.TEXT_NODE && (o = o.parentElement))
        : (o = e.querySelector(t));
    } catch (e) {
      o = null;
    }
    try {
      if ((debug('[PLACEFOCUS] initial element', o), o)) {
        const e = isFrameElement(o),
          t = o instanceof win(o).HTMLElement && getShadowRoot(o);
        if (e || t || isClickableNode(o))
          return t && n
            ? { success: !1, error: 'Multi-step XPath is not supported across shadow roots' }
            : (debug('[PLACEFOCUS] focused element', o), { success: !0, element: o });
      }
      return (
        debug('[PLACEFOCUS] could not find focusable element', { selector: t, xpath: n }),
        {
          success: !1,
          error: (n || t) + ' did not match any interactive element',
          element: o && o instanceof win(o).HTMLElement ? o : null,
        }
      );
    } catch (e) {
      return (reportToErrorMonitoring(e), { success: !1, error: e.message });
    }
  }
  async function placeFocusWithTimeout({ timeoutMs: e, rootNode: t, selector: n, xpath: o }) {
    const i = e + Date.now();
    let s = await placeFocus({ rootNode: t, selector: n, xpath: o }),
      r = i - Date.now();
    for (; !s.success && r > 0; )
      (promiseSendMessage({ request: 'clickFailed' }),
        await promiseDelay(Math.min(r, 100)),
        (s = await placeFocus({ rootNode: t, selector: n, xpath: o })),
        (r = i - Date.now()));
    return (
      !1 === s.success &&
        s.element &&
        (debug('[PLACEFOCUS] clicking on element anyway', {
          element: s.element,
          selector: n,
          xpath: o,
        }),
        (s = { success: !0, element: s.element })),
      { ...s, remainingTimeMs: r }
    );
  }
  function emulateClickOnElement(e) {
    const t = win(e);
    e.dispatchEvent(
      new t.CustomEvent('TB_customClick', { bubbles: !0, cancelable: !1, composed: !0 })
    );
  }
  function moveCursorBackwards(e, t) {
    const n = 'rtl' === e ? 'rightarrow' : 'leftarrow';
    for (let e = 0; e < t; e++) sendKey({ key: n });
  }
  async function moveCursor(e, t, n, o, i) {
    function s(e) {
      const t = e.currentNode;
      return [t, t.textContent];
    }
    function r(e) {
      return '' === e.textContent;
    }
    function a(e) {
      return '' === e.textContent.trim();
    }
    function c(e) {
      return e.nodeType === Node.ELEMENT_NODE && e.childNodes.length > 0;
    }
    function l(e) {
      return '' === e.trim();
    }
    function d(e) {
      const n = e.previousNode(),
        o = !(i = n) || i === t;
      var i;
      return (o && debug('[CURSORPOS] bailing on node', n), o);
    }
    async function u() {
      if (null !== e.cursorEndOffset) return e.cursorEndOffset;
      const t = i.htmlStr.length - e.cursorEndOffsetHTML,
        n = insertCursorPlaceholderAtPosition(i.htmlStr, t),
        { count: o } = await sendToSandboxDocument({
          type: 'getHTMLInsertionStats',
          args: [n, le],
        });
      return ((e.cursorEndOffset = o), o);
    }
    if (
      (debug('[DOING CURSOR]'),
      await promiseDelay(20),
      debug('[{CURSOR} MOVE] ' + JSON.stringify(e)),
      o)
    ) {
      debug('[CURSORPOS] starting positioning');
      const g = selectionForElement(t);
      let m = g.anchorNode,
        f = g.anchorOffset;
      const h = document.createElement('div'),
        E = new DocumentFragment();
      ((h.contentEditable = 'true'),
        E.appendChild(h),
        i.htmlStr
          ? (h.innerHTML = insertCursorPlaceholderAtPosition(i.htmlStr, e.cursorEndOffsetHTML, !0))
          : i.textStr
            ? (h.innerText = insertCursorPlaceholderAtPosition(i.textStr, e.cursorEndOffset, !0))
            : console.error(
                'Replacement data neither has textStr nor htmlStr set, this should NEVER happen.'
              ));
      const b = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
        ),
        y = document.createTreeWalker(E, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      if (1 === m.nodeType) {
        const w = m.childNodes[f];
        w
          ? ((b.currentNode = w), (f = 0))
          : ((b.currentNode = m.childNodes[m.childNodes.length - 1]),
            (f = b.currentNode.textContent.length));
      } else b.currentNode = m;
      for (y.currentNode = h; y.lastChild(); );
      b.currentNode.nodeType === Node.TEXT_NODE &&
        0 === f &&
        (debug('[CURSORPOS] anchorOrg is a text node with offset 0, moving walkerOld'), d(b));
      let T = [null, null];
      function p(e, t) {
        let n = t.length,
          o = -1;
        b.currentNode === m
          ? ((o = f), o === e.length - 1 && l(e[o]) && l(t[n - 1]) && n--)
          : (o = e.length);
        let i = !0;
        for (; n > 0 && o > 0; )
          if ((i && !l(e[o - 1]) && (i = !1), e[o - 1] !== t[n - 1]))
            if (l(e[o - 1]) && l(t[n - 1])) (n--, o--);
            else {
              if (!i || !l(e[o - 1])) break;
              if (t.substring(n - le.length, n) === le) break;
              o--;
            }
          else (n--, o--);
        T = [b.currentNode, o];
      }
      for (;;) {
        const [S, C] = s(b),
          [x, v] = s(y),
          I = x.nodeType === Node.ELEMENT_NODE,
          R = S.nodeType === Node.ELEMENT_NODE,
          L = v.trim() === le;
        if ((debug('[CURSORPOS] element info', S, x), !L)) {
          let A = !1;
          if (c(S)) {
            if (d(b)) break;
            A = !0;
          }
          if (c(x)) {
            if (d(y)) break;
            A = !0;
          }
          if (A) {
            debug('[CURSORPOS] element node with children');
            continue;
          }
        }
        if (r(x) && r(S)) {
          if ((debug('[CURSORPOS] both empty nodes'), d(y))) break;
          if (d(b)) break;
        } else {
          if (L) {
            if (
              (debug('[CURSORPOS] new content is placeholder'),
              S instanceof Element && 1 === S.children.length)
            )
              T = [S, 0];
            else if (S.nodeType === Node.TEXT_NODE) p(C, v);
            else {
              const k = S.parentNode,
                D = [...k.childNodes].indexOf(S) + 1;
              T = [k, D];
            }
            break;
          }
          if (I || R) {
            if ((debug('[CURSORPOS] skipping element nodes'), I && d(y))) break;
            if (R && d(b)) break;
          } else if (a(S)) {
            if ((debug("[CURSORPOS] skip old node that's empty"), d(b))) break;
          } else if (a(x)) {
            if ((debug("[CURSORPOS] skip new node that's empty"), d(y))) break;
          } else {
            if (v.includes(le)) {
              (debug('[CURSORPOS] assign cursor pos in the correct textnode'), p(C, v));
              break;
            }
            if (v.endsWith(C) && C.length > 0 && v !== C) {
              if ((debug('[CURSORPOS] old content is suffix of new content'), d(b))) break;
              x.textContent = x.textContent.substring(0, v.length - C.length);
            } else if ((debug('[CURSORPOS] nothing significant, move back one step'), d(b) || d(y)))
              break;
          }
        }
      }
      if ((debug('[CURSORPOS] positioning over'), E.removeChild(h), T[0])) {
        const N = document.createRange(),
          [M, O] = T;
        (N.setStart(M, O), N.setEnd(M, O), g.removeAllRanges(), g.addRange(N));
      } else
        (console.error('[ERROR - CURSOR] No position found!'), moveCursorBackwards(n, await u()));
    } else (debug('[USING CURSOR EMULATION]'), moveCursorBackwards(n, await u()));
  }
  async function insertReplacement(e) {
    const { isFirst: t, replacement: n, snippetType: o, isForm: i } = e;
    let { typedShortcutPrefix: s, rewriteMode: r } = e;
    e.isRewrite && (r = 'preceding');
    const a = documentActive(document);
    if (t) {
      v.empty('inserted replacement');
      r && isUncollapsedSelection(a)
        ? debug('[HAS UNCOLLAPSED SELECTION WITH REWRITE]')
        : (F &&
            !i &&
            (debug('[CLEARING COMPOSITION]'),
            (P = !0),
            saveFocusAndSelection('ime_clear'),
            a.blur(),
            restoreFocusAndSelection('ime_clear'),
            (P = !1)),
          'preceding' === r
            ? await clearTextPrecedingCursor(a)
            : 'full' === r && emulateSelectAllOrClickEnd(a));
    }
    debug('[REPLACEMENT]', {
      shortcutTyped: s,
      replacement: n,
      target: a,
      snippetType: o,
      rewriteMode: r,
    });
    let c = 50;
    if ('string' === n.type) {
      function l(e) {
        let t,
          n = null;
        for (let t = e.length - 1; t >= 0; t--) {
          const o = e[t];
          if ('string' != typeof o && 'cursor' === o.tag) {
            n = t;
            break;
          }
        }
        return (
          (t =
            null !== n
              ? e.filter(
                  e => ('string' != typeof e && 'cursor' === e.tag && n--, 'string' == typeof e)
                )
              : e.slice()),
          { lastCursorIndex: n, cleanedParts: t }
        );
      }
      const d = { textStr: '', htmlStr: void 0 },
        u = l(n.textStrArr);
      for (const b of u.cleanedParts) d.textStr += b;
      let p,
        g,
        m,
        f = null;
      if (n.htmlStrArr) {
        ((d.htmlStr = ''), (p = l(n.htmlStrArr)));
        for (const y of p.cleanedParts) d.htmlStr += y;
        if (null !== p.lastCursorIndex) {
          f = 0;
          for (let T = p.lastCursorIndex + 1; T < p.cleanedParts.length; T++)
            f += p.cleanedParts[T].length;
        }
      }
      const h = documentActive();
      (h && (h instanceof win(h).HTMLInputElement || h instanceof win(h).HTMLTextAreaElement)) ||
      'text' === o ||
      void 0 === d.htmlStr ||
      (h && 'plaintext-only' === h.getAttribute('contenteditable'))
        ? ((g = !!d.textStr), (m = 'text'))
        : ((g = !!d.htmlStr), (m = 'html'));
      let E = null;
      if ('text' === m && null !== u.lastCursorIndex) {
        E = 0;
        for (let L = u.cleanedParts.length - 1; L > u.lastCursorIndex; L--)
          E += u.cleanedParts[L].length;
        const S = u.lastCursorIndex,
          C = S >= 0 ? u.cleanedParts[S] : null,
          x = S + 1 < u.cleanedParts.length ? u.cleanedParts[S + 1] : null,
          I = !C || C.endsWith('\n'),
          R = !x || x.startsWith('\n');
        if (I && R && editorRequiresSpecialCursorPositioning(a)) {
          debug('INSERTING EXTRA SPACE AFTER CURSOR');
          const A = '​';
          x ? (u.cleanedParts[S + 1] = A + u.cleanedParts[S + 1]) : u.cleanedParts.push(A);
          const k = d.textStr.length - E;
          ((d.textStr = d.textStr.substr(0, k) + A + d.textStr.substr(k)), (E += A.length));
        }
      }
      if (s || g) {
        (debug('[INSERTING]', s, d.textStr || d.htmlStr, d, a, m),
          (d.textStr = d.textStr.replace(new RegExp(String.fromCharCode(160), 'g'), ' ')));
        try {
          'INPUT' === insertionMode(a, s)
            ? await insertInputTextarea(a, s, d.textStr, E)
            : await insertContentEditable(a, s, d, m, {
                cursorEndOffset: E,
                cursorEndOffsetHTML: f,
              });
        } catch (D) {
          if ('' !== d.textStr.trim()) throw D;
          console.warn(D);
        }
        s = '';
      }
    } else if ('key' === n.tag) sendKey(n.info);
    else if ('click' === n.tag) {
      const N = n.info;
      if (N.selector || N.xpath) {
        const { selector: M, xpath: O, timeout: H } = N,
          _ = await placeFocusCrossIframes({ selector: M, xpath: O, timeoutMs: H ? 1e3 * H : 0 });
        return !1 === _.success
          ? { success: !1, error: { name: 'NOT_FOUND', message: _.error } }
          : _;
      }
      triggerClickOnElement(a);
    } else
      'action' === n.tag
        ? 'action_start' === n.info.type
          ? saveFocusAndSelection(w + n.info.savedFocusCount)
          : 'action_end' === n.info.type
            ? (restoreFocusAndSelection(w + n.info.savedFocusCount), (c = 120))
            : console.log('Unknown form type: ', n.type, n.tag, n.info.type)
        : 'wait' === n.tag
          ? (c = 1e3 * n.info.delay)
          : console.log('Unknown action type: ', n.type, n.tag);
    return (debug('[INSERTED]', { type: n.type, skipTimeMs: c }), { success: !0, skipTimeMs: c });
  }
  function insertionMode(e, t) {
    return ((e instanceof win(e).HTMLInputElement && isInputEditable(e)) ||
      e instanceof win(e).HTMLTextAreaElement) &&
      e.value.toLocaleLowerCase().includes(t.toLocaleLowerCase())
      ? 'INPUT'
      : 'CONTENTEDITABLE';
  }
  function createAndDispatchEvent(e, t, n) {
    const o = new (win(e).Event)(t, Object.assign({ bubbles: !0, cancelable: !1 }, n));
    e.dispatchEvent(o);
  }
  async function insertInputTextarea(e, t, n, o) {
    (debug('[INPUT/TEXTAREA INSERT]', n),
      e instanceof HTMLInputElement && (n = n.replace(/\r\n?|\n/g, ' ')));
    const i = getCursorLocation(e);
    let s, r;
    i && 'textarea' === i.type
      ? ((s = i.start - t.length), (r = void 0 !== i.end ? i.end : i.start))
      : ((s = e.value.toLocaleLowerCase().lastIndexOf(t.toLocaleLowerCase())),
        -1 === s && (s = e.value.length - t.length),
        (r = s + t.length));
    const a = isProxyEditor(e),
      c = 0 === n.length;
    if (a)
      (debug('[EMULATION CLEAR SHORTCUT INPUT/TEXTAREA]'),
        await clearShortcut(t, e, c, window.getSelection()));
    else {
      debug('[DIRECT CLEAR SHORTCUT INPUT/TEXTAREA]');
      const t = e.value,
        n = t.slice(0, s),
        o = t.slice(r);
      ((e.value = n + o), moveCursorInputTextarea(e, s));
    }
    if ((win(e).document.execCommand('insertText', !1, n), 0 !== o)) {
      const t = s + n.length;
      moveCursorInputTextarea(e, t - o, null, t);
    }
    0 === n.length && createAndDispatchEvent(e, 'input');
  }
  function emulateBackspace(e, t) {
    const n = t.editContext;
    if ((debug('[BACKSPACE EMULATION]', { hasContext: !!n }), n)) {
      let e = n.selectionStart,
        o = n.selectionEnd;
      if (e !== o);
      else {
        if (!(e > 0)) return;
        ((o = e), e--);
      }
      const i = e,
        s = e;
      (n.updateText(e, o, ''), n.updateSelection(i, s));
      const r = new (win(t).TextUpdateEvent)('textupdate', {
        text: '',
        selectionStart: i,
        selectionEnd: s,
        updateRangeEnd: o,
        updateRangeStart: e,
      });
      n.dispatchEvent(r);
    } else e.execCommand('delete');
  }
  (addGlobalListener(({ document: e }) =>
    e.addEventListener('__TB_registerElementEvent', e => {
      registerElement(e.target);
    })
  ),
    addGlobalListener(({ document: e }) =>
      e.addEventListener('__TB_triggerPasteElementEvent', t => {
        (e.execCommand('paste', !1), t.stopImmediatePropagation());
      })
    ));
  const ue = Math.random().toString(36).substring(7);
  let pe = 0;
  const ge = { previousKeyTarget: null, keysSoFar: '' };
  function dispatchInputAndChangeEvents(e) {
    const t = ['input', 'change'];
    for (const n of t) createAndDispatchEvent(e, n, { composed: 'input' === n });
  }
  function sendKey(e) {
    let t = documentActive() || document,
      n = t.ownerDocument;
    const o = 'TBDefaultPrevented' + ue + 'id' + pe++;
    let i = !1;
    function s(o) {
      let i;
      const s = e.keyCode,
        r = { data: null, bubbles: !0, composed: !0, cancelable: !0, isComposing: !1 };
      if ('beforeinput' === o) {
        const e = win(t).getSelection();
        if (e.rangeCount > 0) {
          const n = e.getRangeAt(0),
            { startContainer: o, startOffset: i, endContainer: s, endOffset: a } = n;
          r.targetRanges = [
            new (win(t).StaticRange)({
              startContainer: o,
              startOffset: i,
              endContainer: s,
              endOffset: a,
            }),
          ];
        } else reportToErrorMonitoring(`beforeinput target range is empty: ${t.nodeName}`);
      }
      if (s === m.backspace) {
        if ('input' === o) return void emulateBackspace(n, t);
        ((r.inputType = 'deleteContentBackward'), (i = new (win(t).InputEvent)(o, r)));
      } else if (1 === e.key.length || e.keyCode === m.space) {
        const s = e.keyCode === m.space ? ' ' : e.key,
          a = t instanceof HTMLSelectElement;
        if ('input' !== o || a)
          ('textInput' === o || a || (r.inputType = 'insertText'),
            (r.data = s),
            (i = new (win(t).InputEvent)(o, r)));
        else {
          const e = t.editContext;
          if (e) {
            const n = e.selectionStart,
              o = e.selectionEnd,
              i = n + 1,
              r = n + 1;
            (e.updateText(n, o, s), e.updateSelection(i, r));
            const a = new (win(t).TextUpdateEvent)('textupdate', {
              text: s,
              selectionStart: i,
              selectionEnd: r,
              updateRangeEnd: o,
              updateRangeStart: n,
            });
            e.dispatchEvent(a);
          } else n.execCommand('insertText', !1, s);
        }
      } else
        s === m.return &&
          (t instanceof win(t).HTMLInputElement
            ? 'beforeinput' === o &&
              ((r.inputType = 'insertLineBreak'), (i = new (win(t).InputEvent)(o, r)))
            : 'input' === o
              ? n.execCommand('insertParagraph')
              : 'beforeinput' === o
                ? ((r.inputType = 'insertParagraph'), (i = new (win(t).InputEvent)(o, r)))
                : ((r.data = '\n'), (i = new (win(t).InputEvent)(o, r))));
      if (i)
        return (
          debug('[INPUT EVENT]', { type: i.type, inputType: i.inputType }, i),
          t.dispatchEvent(i),
          i.defaultPrevented
        );
    }
    function r(n) {
      const o = 'keypress' === n && 1 === e.key.length ? e.key.charCodeAt(0) : e.keyCode,
        i = {
          keyCode: o,
          which: o,
          bubbles: !0,
          cancelable: !0,
          shiftKey: e.shift,
          ctrlKey: e.ctrl,
          altKey: e.alt,
          metaKey: e.cmd,
          composed: !0,
          isComposing: !1,
          location: 0,
          repeat: !1,
        };
      if (1 === e.key.length) {
        const t = {
          '-0': 'Digit0',
          '-1': 'Digit1',
          '-2': 'Digit2',
          '-3': 'Digit3',
          '-4': 'Digit4',
          '-5': 'Digit5',
          '-6': 'Digit6',
          '-7': 'Digit7',
          '-8': 'Digit8',
          '-9': 'Digit9',
          '-a': 'KeyA',
          '-b': 'KeyB',
          '-c': 'KeyC',
          '-d': 'KeyD',
          '-e': 'KeyE',
          '-f': 'KeyF',
          '-g': 'KeyG',
          '-h': 'KeyH',
          '-i': 'KeyI',
          '-j': 'KeyJ',
          '-k': 'KeyK',
          '-l': 'KeyL',
          '-m': 'KeyM',
          '-n': 'KeyN',
          '-o': 'KeyO',
          '-p': 'KeyP',
          '-q': 'KeyQ',
          '-r': 'KeyR',
          '-s': 'KeyS',
          '-t': 'KeyT',
          '-u': 'KeyU',
          '-v': 'KeyV',
          '-w': 'KeyW',
          '-x': 'KeyX',
          '-y': 'KeyY',
          '-z': 'KeyZ',
          '-;': 'Semicolon',
          '-=': 'Equal',
          '-,': 'Comma',
          '--': 'Minus',
          '-.': 'Period',
          '-/': 'Slash',
          '-`': 'Backquote',
          '-[': 'BracketLeft',
          '-\\': 'Backslash',
          '-]': 'BracketRight',
          "-'": 'Quote',
        }['-' + e.key.toLowerCase()];
        ((i.key = e.key), t && (i.code = t));
      } else {
        const t = {
          backspace: 'Backspace',
          tab: 'Tab',
          enter: 'Enter',
          return: 'Enter',
          escape: 'Escape',
          leftarrow: 'ArrowLeft',
          rightarrow: 'ArrowRight',
          uparrow: 'ArrowUp',
          downarrow: 'ArrowDown',
          space: 'Space',
        }[e.key];
        t && ((i.code = t), 'space' === e.key ? (i.key = ' ') : (i.key = t));
      }
      ((i.charCode = 'keypress' === n ? o : 0), debug('[KEY EVENT]', n, i));
      const s = new (win(t).KeyboardEvent)(n, i);
      return (t.dispatchEvent(s), s.defaultPrevented);
    }
    function a() {
      if ((r('keyup'), i)) {
        const n = new (win(t).CompositionEvent)('compositionend', { data: e.key });
        ((n.isBlazeGenerated = !0),
          t.editContext ? t.editContext.dispatchEvent(n) : t.dispatchEvent(n));
      }
    }
    ((t === ge.previousKeyTarget && isSingleLetterKey(e)) || (ge.keysSoFar = ''),
      (ge.previousKeyTarget = t));
    const c = e.key.toLowerCase();
    if (
      ((e.keyCode =
        'escape' === c
          ? m.escape
          : 'tab' === c
            ? m.tab
            : 'backspace' === c
              ? m.backspace
              : 'enter' === c || 'return' === c
                ? m.return
                : 'leftarrow' === c
                  ? m.left
                  : 'rightarrow' === c
                    ? m.right
                    : 'uparrow' === c
                      ? m.up
                      : 'downarrow' === c
                        ? m.down
                        : 'space' === c || ' ' === c
                          ? m.space
                          : c.toUpperCase().charCodeAt(0)),
      debug('[SEND KEY]', e.keyCode, e, t),
      (function (o, c) {
        let l;
        const d = e.keyCode === m.return,
          u = e.ctrl || e.cmd || e.alt,
          p = 1 === e.key.length || e.keyCode === m.space,
          g = t instanceof HTMLSelectElement,
          f = d || p,
          h = !u && (f || e.keyCode === m.backspace) && !g,
          E = !u && f && !g;
        if (((i = c && !u && f), i)) {
          const e = new (win(t).CompositionEvent)('compositionstart');
          t.editContext ? t.editContext.dispatchEvent(e) : t.dispatchEvent(e);
        }
        (r('keydown') && (l = 'keydown'),
          !l && f && (('A' === t.nodeName && d) || (r('keypress') && (l = 'keypress'))),
          (['SELECT', 'INPUT', 'TEXTAREA'].includes(t.nodeName) ||
            'yes' === n.designMode.toLowerCase() ||
            t.isContentEditable ||
            t.editContext) &&
            ((t instanceof HTMLInputElement && ('button' === t.type || 'submit' === t.type)) ||
              (!l && h && s('beforeinput') && (l = 'beforeinput'),
              l ||
                e.keyCode !== m.return ||
                (['SELECT', 'INPUT', 'TEXTAREA'].includes(t.nodeName) &&
                  createAndDispatchEvent(t, 'change')),
              i &&
                (t.editContext ||
                  t.dispatchEvent(
                    new (win(t).CompositionEvent)('compositionupdate', { data: e.key })
                  )),
              !l && E && s('textInput') && (l = 'textInput'),
              !l && h && s('input') && (l = 'input'))),
          d || a(),
          l && (n.body.dataset[o] = l));
      })(o, F),
      (t = documentActive()),
      (n = t && t.ownerDocument),
      e.keyCode === m.tab && 'keydown' !== n.body.dataset[o])
    )
      (e.shift ? tabPrev() : tabNext(),
        (t = documentActive()),
        t && t instanceof win(t).HTMLInputElement && t.select());
    else if (t instanceof HTMLSelectElement && 'keydown' !== n.body.dataset[o])
      if (isUpDownArrowKey(e)) {
        const n = t.selectedIndex,
          o = t.options.length,
          i = m.up === e.keyCode,
          s = m.down === e.keyCode;
        ((i && n > 0) || (s && n < o - 1)) &&
          ((t.selectedIndex = n + (i ? -1 : 1)), dispatchInputAndChangeEvents(t));
      } else if (isSingleLetterKey(e)) {
        let n = ge.keysSoFar;
        n += e.key;
        const o = t.selectedIndex,
          i = -1 === o ? 0 : o,
          s = (function (e, t, n) {
            const o = Intl.Collator(void 0, { sensitivity: 'base' }).compare,
              i = new Intl.Segmenter();
            function s(e) {
              try {
                return [...i.segment(e)].map(e => e.segment);
              } catch (t) {
                return (reportToErrorMonitoring(t), [...e]);
              }
            }
            const r = t.trim(),
              a = s(r).length;
            function c(e) {
              const t = s(e.textContent.trim()).slice(0, a).join('');
              return 0 === o(t, r);
            }
            for (let t = n; t < e.length; t++) if (c(e[t])) return t;
            for (let t = 0; t < n; t++) if (c(e[t])) return t;
            return -1;
          })([...t.options], n, i);
        s > -1
          ? ((t.selectedIndex = s),
            o !== t.selectedIndex && dispatchInputAndChangeEvents(t),
            (ge.keysSoFar = n))
          : (ge.keysSoFar = '');
      } else createAndDispatchEvent(t, 'input');
    else if (
      t instanceof HTMLInputElement &&
      isArrowKey(e) &&
      'radio' === t.type &&
      t.name &&
      'keydown' !== n.body.dataset[o]
    ) {
      const n = e.keyCode === m.right || e.keyCode === m.down;
      moveToNextRadioButton(t, n);
    } else if (e.keyCode === m.left && 'keydown' !== n.body.dataset[o])
      selectionForElement(t).modify('move', 'left', 'character');
    else if (e.keyCode === m.right && 'keydown' !== n.body.dataset[o])
      selectionForElement(t).modify('move', 'right', 'character');
    else if (
      65 !== e.keyCode ||
      !((b && e.cmd) || e.ctrl) ||
      e.shift ||
      e.alt ||
      'keydown' === n.body.dataset[o]
    ) {
      if (e.keyCode === m.return && 'keydown' !== n.body.dataset[o] && t) {
        const e = t instanceof HTMLInputElement && ('button' === t.type || 'submit' === t.type);
        if ((['A', 'BUTTON'].includes(t.nodeName) || e) && t instanceof HTMLElement)
          emulateClickOnElement(t);
        else if (t instanceof win(t).HTMLInputElement && 'keypress' !== n.body.dataset[o]) {
          const e = t.closest('form');
          if (e) {
            const t = e.querySelectorAll('input'),
              n = e.querySelector('input[type=submit],button:not([type=button]):not([type=reset])');
            if (!!n || 1 === t.length) {
              const t = n;
              (t && t.disabled) || (n && emulateClickOnElement(n), e.requestSubmit());
            }
          }
        }
        a();
      }
    } else emulateSelectAllOrClickEnd(t, !1);
    return n.body.dataset[o];
  }
  function getAnchorText(e) {
    const t = selectionForElement(e);
    if (!t) return void debug('[MISSING SELECTION]');
    const n = t.anchorNode;
    if (!n) return void debug('[MISSING ANCHOR NODE]');
    let o = n.textContent;
    if (null != o) return ((o = o.slice(0, t.anchorOffset)), o.toLowerCase());
    debug('[MISSING ANCHOR NODE TEXT]');
  }
  async function pasteWithExecCommand(e) {
    ((e.body.dataset.__TB_execCommand = '1'),
      delete e.body.dataset.__TB_execCommand_pending,
      delete e.body.dataset.__TB_execCommand_finished,
      window.addEventListener('paste', pasteListenerForBeforeInput, !1),
      debug('[EXEC COMMAND]', e.execCommand('paste', !1)),
      window.removeEventListener('paste', pasteListenerForBeforeInput, !1),
      '1' === e.body.dataset.__TB_execCommand_pending &&
        '1' !== e.body.dataset.__TB_execCommand_finished &&
        (debug('[WAITING FOR EXEC]'), await execCommandFinished(e)),
      delete e.body.dataset.__TB_execCommand,
      delete e.body.dataset.__TB_execCommand_pending,
      delete e.body.dataset.__TB_execCommand_finished);
  }
  function pasteWithEvent(e, t) {
    const n = getDataTransferFromReplacementData(t),
      o = new (win(e).ClipboardEvent)('paste', {
        clipboardData: n,
        bubbles: !0,
        cancelable: !0,
        composed: !0,
      });
    debug('[PASTE EVENT]', e.dispatchEvent(o), o.defaultPrevented);
  }
  function execCommandFinished(e) {
    return new Promise(t => {
      const n = () => {
        '1' === e.body.dataset.__TB_execCommand_finished
          ? (debug('[EXEC FINISHED]'), t())
          : setTimeout(n, 2);
      };
      n();
    });
  }
  const me = {};
  async function getStylesAndDirection(e) {
    const t = ['font-family', 'font-size', 'font-style', 'font-weight', 'color'],
      n = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large'],
      o = /\d(px|cm|mm|Q|in|pc|pt)$/;
    async function i(t, i, s) {
      let r = null;
      for (;;) {
        if (!t) return null;
        const o = t.style.fontSize;
        if (o) {
          r = o;
          break;
        }
        const i =
          'FONT' === t.tagName
            ? (a = t.getAttribute('size')) && 1 === (a = a.trim()).length && a >= '0' && a <= '7'
              ? n[parseInt(a)]
              : null
            : null;
        if (i) {
          r = i;
          break;
        }
        if (t === e) break;
        t = t.parentElement;
      }
      var a, c;
      if (r && ((c = (c = r).trim()), o.test(c) || n.includes(c) || 'initial' === c)) {
        const e = await (async function (e, t) {
          const n = e + '-' + t;
          if (!me[n]) {
            const o = await sendToSandboxDocument({
              type: 'convertAbsSizeToPx',
              fontFamily: e,
              fontSize: t,
            });
            me[n] = o;
          }
          return me[n];
        })(i, r);
        if (e === s) return r;
      }
      return null;
    }
    function s(e, t) {
      const n = window.getComputedStyle(t).fontSize;
      for (; e && e !== t; ) {
        if (n !== window.getComputedStyle(e).fontSize) return !0;
        e = e.parentElement;
      }
      return !1;
    }
    const r = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    let a = null;
    const c = selectionForElement(e);
    let l = c.anchorNode || c.focusNode,
      d = {},
      u = null;
    if (!c)
      return (
        debug('[GET STYLES] skipped because of null selection'),
        { direction: a, sel: c, styles: d, targetTag: u }
      );
    if (l) {
      for (; !(l instanceof win(l).HTMLElement) && l.parentElement; ) l = l.parentElement;
      if (l instanceof win(l).HTMLElement) {
        (debug('[GET STYLES] styleEl', l),
          (u = (function (t) {
            for (; t; ) {
              const n = r.find(e => e === t.tagName);
              if (n) return n;
              if (t === e) break;
              t = t.parentElement;
            }
            return null;
          })(l)));
        const n = window.getComputedStyle(l);
        if (((a = n.direction), !N.has(e) || !0 === N.get(e)))
          for (const o of t) {
            let t = n.getPropertyValue(o);
            if ('font-size' === o) {
              if (['0px', '0', '0em', '0rem'].includes(t)) {
                d = {};
                break;
              }
              const o = await i(l, n.getPropertyValue('font-family'), t);
              !s(l, e) ? (t = void 0) : o && (t = o);
            }
            t && (d[o] = t);
          }
      }
    }
    const p = { sel: c, direction: a, styles: d, targetTag: u };
    return (debug('[GET STYLES] styles', p), p);
  }
  function isEmptyInsert(e, t) {
    if ('html' === e) {
      const e = document.createElement('span');
      if (
        ((e.style.opacity = '0'),
        (e.innerHTML = t.htmlStr),
        /^\s*$/.test(e.innerText) && !e.querySelector('img') && !e.querySelector('table'))
      )
        return (e.remove(), !0);
      e.remove();
    } else if ('text' === e && '' === t.textStr) return !0;
    return !1;
  }
  async function clearShortcut(e, t, n, o) {
    if (e.length) {
      debug('[CLEARING SHORTCUT]', e);
      const i = t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement;
      debug('[TEXT 0]', () => (i ? t.value : t.textContent));
      const s = getAnchorText(t),
        r = e.length;
      for (let e = 0; e < r; e++) (sendKey({ key: 'backspace' }), await promiseDelay(1));
      if (void 0 !== s && !n) {
        const n = e.toLowerCase();
        if (
          s.endsWith(n) &&
          s === getAnchorText(t) &&
          (debug('[SHORTCUT CLEAR FAILED]', s), !(t instanceof win(t).HTMLInputElement))
        ) {
          debug('[SHORTCUT CLEAR FALLBACK]');
          for (let t = 0; t < e.length; t++) o.modify('extend', 'backward', 'character');
          if (o.toString().toLowerCase() !== n) o.collapseToEnd();
          else {
            sendKey({ key: 'backspace' });
            t.ownerDocument.execCommand('delete', !1);
          }
        }
      }
    }
  }
  async function sendToOffscreenDocument(e) {
    return await promiseSendMessage({ ...e, target: 'offscreen' });
  }
  async function sendToSandboxDocument(e) {
    return await sendToOffscreenDocument({ type: 'sandbox', message: e });
  }
  async function setClipboard(e, t, n, o, i) {
    const s = de.isCkEditor4(o);
    (debug('[SETTING CLIPBOARD]', {
      type: e,
      replacementData: n,
      styles: t,
      targetTag: i,
      isCKE4: s,
    }),
      await sendToOffscreenDocument({
        type: 'getAndSetClipboard',
        set: {
          contents: { html: n.htmlStr, text: n.textStr },
          type: e,
          styles: t,
          targetTag: i,
          options: { isCKE4: s },
        },
      }),
      debug('[CLIPBOARD SET]'));
  }
  function getDataTransferFromReplacementData(e) {
    const t = new DataTransfer();
    if ((t.setData('text/plain', e.textStr), e.htmlStr)) {
      const n = "<meta charset='utf-8'>";
      let o = e.htmlStr;
      (o.startsWith(n) || (o = n + o), t.setData('text/html', o));
    }
    return t;
  }
  let fe = { target: null, pasteData: null, defaultPrevented: !1 };
  function dispatchBeforeInputEventForPaste() {
    const { target: e, pasteData: t } = fe,
      n = new (win(e).InputEvent)('beforeinput', {
        inputType: 'insertFromPaste',
        dataTransfer: t,
        bubbles: !0,
        cancelable: !0,
        composed: !0,
        isComposing: !1,
      });
    return (e.dispatchEvent(n), n.defaultPrevented);
  }
  function pasteListenerForBeforeInput(e) {
    e.defaultPrevented ||
      ((fe.defaultPrevented = dispatchBeforeInputEventForPaste()),
      fe.defaultPrevented && e.preventDefault());
  }
  async function clipboardPaste(e, t) {
    const n = e.textContent,
      o = e.ownerDocument,
      i = !!e.editContext;
    if (
      ((fe = { target: e, pasteData: getDataTransferFromReplacementData(t), defaultPrevented: !1 }),
      i &&
        ((document.body.dataset.__TB_pasteEvent = '1'),
        pasteWithEvent(e, t),
        delete document.body.dataset.__TB_pasteEvent,
        dispatchBeforeInputEventForPaste()),
      i)
    )
      e.editContext &&
        e.textContent === n &&
        t.textStr.trim().length > 0 &&
        reportToErrorMonitoring(new Error('Paste failed'));
    else {
      const t = e.textContent;
      (debug('[EXEC_PASTE 1]'),
        debug('[TEXT 1]', () => e.textContent),
        await pasteWithExecCommand(o),
        debug('[TEXT 2]', () => e.textContent),
        fe.defaultPrevented &&
          (debug('[CHECKING PASTE]'),
          await promiseDelay(1),
          await new Promise(e => requestAnimationFrame(e)),
          t === e.textContent && (debug('[EXEC_PASTE 2]'), await pasteWithExecCommand(o))));
    }
    fe = { target: null, pasteData: null, defaultPrevented: !1 };
  }
  function isElementVisible(e) {
    return e.checkVisibility({ checkOpacity: !0 });
  }
  function isProxyEditor(e) {
    return !isElementVisible(e);
  }
  function isIntegratedEditor(e, t) {
    const n = selectionForElement(e),
      o = n.anchorNode;
    if (!n.isCollapsed)
      return (console.warn('isIntegratedEditor called with uncollapsed selection'), !0);
    if (!o) return (reportToErrorMonitoring('anchorNode is null in isIntegratedEditor'), !0);
    const i = o.textContent,
      s = n.anchorOffset;
    return i.substring(s - t.length, s).toLocaleLowerCase() === t.toLocaleLowerCase();
  }
  async function insertContentEditable(e, t, n, o, i) {
    debug('[REPLACEMENT DATA]', n);
    const { direction: s, styles: r, sel: a, targetTag: c } = await getStylesAndDirection(e),
      l = isEmptyInsert(o, n),
      d = isIntegratedEditor(e, t);
    (await clearShortcut(t, e, l, a),
      l
        ? debug('[EMPTY INSERT]')
        : (await setClipboard(o, r, n, e, c),
          await clipboardPaste(e, n),
          Math.max(i.cursorEndOffset, i.cursorEndOffsetHTML) > 0 &&
            (await moveCursor(i, e, s, d, n)),
          debug('[FINISHING]'),
          await sendToOffscreenDocument({ type: 'setClipboardWithCache' }),
          debug('[RESTORED CLIPBOARD]')));
  }
  const he = {};
  function saveFocusAndSelection(e, t = null, n = !1) {
    const o = t || documentActive(),
      i = {
        cursorLocation: getCursorLocation(o),
        focusedElement: o,
        isVisible: isElementVisible(o),
      };
    (debug('[SAVED FOCUS AND SELECTION]', { savedId: e, saved: i }),
      (he[e] = i),
      n &&
        !isEditable(o) &&
        reportToErrorMonitoring(`Element ${o.tagName} with save focus is not editable`));
  }
  function restoreFocusAndSelection(e, t = !1, n = !1) {
    const o = he[e];
    debug('[RESTORE FOCUS AND SELECTION]', { savedId: e, saved: o });
    const i = { set: !1, changed: !1, found: !0 };
    if (o) {
      if (documentContainsNode(o.focusedElement))
        if (o.isVisible && !isElementVisible(o.focusedElement)) i.found = !1;
        else {
          const e = o.focusedElement === documentActive() && document.hasFocus(),
            n = isCursorLocationCollapsed(o.cursorLocation),
            s = isSelectionCollapsed(o.focusedElement) === n,
            r = !e || !s;
          if (
            (debug('[RESTORE FOCUS AND SELECTION] state', {
              isSavedPositionCollapsed: n,
              isCollapseStatePreserved: s,
              isAlreadyFocused: e,
              requiresChange: r,
            }),
            e || o.focusedElement.focus(),
            o.cursorLocation && (t || r))
          )
            try {
              if ('ce' === o.cursorLocation.type) {
                const e = selectionForElement(o.focusedElement);
                let n;
                (debug('[RESTORE FOCUS AND SELECTION] existing range count', e.rangeCount),
                  (n = e.rangeCount ? e.getRangeAt(0) : document.createRange()));
                const {
                    startContainer: i,
                    endContainer: s,
                    startOffset: r,
                    endOffset: a,
                    commonAncestorContainer: c,
                  } = o.cursorLocation.range,
                  l = documentContainsNode(c);
                if (
                  (debug(
                    '[RESTORE FOCUS AND SELECTION] document contains range ancestor node',
                    l,
                    c
                  ),
                  l)
                ) {
                  const o =
                    n.startContainer !== i ||
                    n.endContainer !== s ||
                    n.startOffset !== r ||
                    n.endOffset !== a;
                  (t || o) &&
                    (n.setStart(i, r), n.setEnd(s, a), e.removeAllRanges(), e.addRange(n));
                }
              } else {
                const e = o.focusedElement,
                  n =
                    e.selectionStart !== o.cursorLocation.start ||
                    e.selectionEnd !== o.cursorLocation.end;
                (t || n) &&
                  moveCursorInputTextarea(e, o.cursorLocation.start, o.cursorLocation.end);
              }
              ((i.set = !0), (i.changed = r));
            } catch (e) {
              console.error(e);
            }
        }
      else i.found = !1;
      n || delete he[e];
    }
    return (debug('[RESTORE RESULT]', i), i);
  }
  function getCursorLocation(e) {
    if (
      (e instanceof win(e).HTMLInputElement && isInputEditable(e)) ||
      e instanceof win(e).HTMLTextAreaElement
    )
      return canManipulateCursor(e)
        ? { start: e.selectionStart, end: e.selectionEnd, type: 'textarea' }
        : null;
    {
      const t = selectionForElement(e);
      if (t?.rangeCount) {
        const e = t.getRangeAt(0);
        return null === e.commonAncestorContainer.ownerDocument
          ? null
          : { range: e.cloneRange(), type: 'ce' };
      }
      return null;
    }
  }
  function isCursorLocationCollapsed(e) {
    if (e) {
      if ('ce' === e.type) {
        const t = e.range.endOffset === e.range.startOffset,
          n = e.range.endContainer === e.range.startContainer;
        return t && n;
      }
      return e.start === e.end;
    }
    return !1;
  }
  function moveCursorInputTextarea(e, t, n = null, o = null) {
    if (
      (debug('[MOVING INPUT/TEXTAREA]', t, e),
      null === n && (n = t),
      e.setSelectionRange && canManipulateCursor(e))
    )
      e.setSelectionRange(t, n);
    else if (
      e instanceof win(e).HTMLInputElement &&
      'email' === e.type &&
      t === n &&
      null !== o &&
      o > t
    ) {
      moveCursorBackwards(window.getComputedStyle(e).direction, o - t);
    }
  }
  let Ee = null,
    be = document.body;
  function canManipulateCursor(e) {
    return (
      !(e instanceof win(e).HTMLInputElement) ||
      ['text', 'search', 'url', 'tel', 'password'].includes(e.type)
    );
  }
  const ye = new WeakSet(),
    Te = new WeakSet();
  function registerElement(e) {
    if (e instanceof NodeList) return void e.forEach(e => registerElement(e));
    if (!ye.has(e)) {
      if ((ye.add(e), 'function' != typeof e.addEventListener)) return;
      (e.addEventListener('mousedown', () => v.empty('mousedown')),
        e.addEventListener('keydown', keyDownEventListener),
        e.addEventListener('keypress', keyPressEventListener),
        e.addEventListener('beforeinput', beforeInputEventListener),
        e.addEventListener('compositionend', compositionEndEventListener));
    }
    const t = e.editContext;
    t &&
      !Te.has(t) &&
      (Te.add(t), t.addEventListener('compositionend', compositionEndEventListener));
  }
  function checkIFrames(e) {
    if (e instanceof NodeList) return void e.forEach(e => checkIFrames(e));
    if ('function' != typeof e.getAttribute) return;
    const t = e;
    let n = t.getAttribute('src');
    if (n) {
      if (((n = n.trim().toLowerCase()), /^[^:/]+:\/\//.test(n))) return;
      if (n.startsWith('data:')) return;
      {
        const e = n.indexOf(':'),
          t = n.indexOf('/');
        if (t > -1 && t < e) return;
      }
    }
    try {
      t.contentWindow &&
        t.contentWindow.chrome &&
        t.contentWindow.chrome.runtime &&
        t.contentWindow.chrome.runtime
          .sendMessage({ request: 'installExtensionIframe' })
          .catch(e => {
            debug('[IFRAME INSERTION ERROR 2]', e);
          });
    } catch (e) {
      debug('[IFRAME INSERTION ERROR]', e);
    }
  }
  function updateDesktopIntegrationStatus(e) {
    t !== e &&
      ((t = e),
      !0 === e ? initializeDesktopIntegration(getIframeDepth(window)) : removeDesktopIntegration());
  }
  function addExtensionActiveWebComponent(e) {
    if (!extensionActive()) return;
    if (!1 === t) return;
    const n = Array.from(e.children).find(e => e.tagName.toLowerCase() === s);
    if (n) {
      const e = getShadowRoot(n);
      if (!e) return;
      const t = e.lastElementChild,
        o = JSON.parse(t.dataset.content);
      return void (o[a] || (t.dataset.content = JSON.stringify({ ...o, [a]: !0 })));
    }
    const o = document.createElement(s);
    (o.setAttribute('style', 'display: contents !important;'), o.setAttribute('role', 'none'));
    const i = o.attachShadow({ mode: 'closed' }),
      r = document.createElement('style');
    ((r.textContent =
      '\n      div:before {\n        content: attr(data-content);\n      }\n      div {\n        all: initial;\n        position: absolute;\n        border: 0;\n        margin: -1px;\n        padding: 0;\n        width: 0.1px;\n        height: 0.1px;\n        user-select: none;\n        overflow: hidden;\n        font-size: 0px;\n        clip: rect(0, 0, 0, 0);\n        white-space: nowrap;\n        pointer-events: none;\n      }\n      @media print {\n        * {\n          display: none !important;\n        }\n      }\n      '),
      i.appendChild(r));
    const c = document.createElement('div');
    ((c.ariaLabel = 'text-blaze-integration'),
      c.setAttribute('role', 'group'),
      (c.tabIndex = -1),
      (c.dataset.content = JSON.stringify({ extensionEnabled: !0, [a]: !0 })),
      i.appendChild(c),
      c.setAttribute('dir', 'ltr'),
      e.appendChild(o));
  }
  function onLoaded(e) {
    if (
      document.attachEvent ? 'complete' === document.readyState : 'loading' !== document.readyState
    )
      e();
    else {
      let t = !1;
      const n = () => {
        t || ((t = !0), e());
      };
      (document.addEventListener('DOMContentLoaded', n), setTimeout(n, 200));
    }
  }
  function getIframeDepth(e) {
    return e && e.parent !== e ? getIframeDepth(e.parent) + 1 : 0;
  }
  function registerExistingEditContexts() {
    if (window.EditContext) {
      let e, t;
      try {
        e = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      } catch (e) {
        return;
      }
      do {
        if (((t = e.nextNode()), !t)) break;
        t.editContext && registerElement(t);
      } while (t);
    }
  }
  function initializeDesktopIntegration(e) {
    (0 === e && addExtensionActiveWebComponent(document.documentElement),
      document.querySelectorAll(y).forEach(e => {
        addExtensionActiveWebComponent(e);
      }));
  }
  function removeDesktopIntegration() {
    for (const e of document.querySelectorAll(s)) {
      const t = getShadowRoot(e).lastElementChild,
        n = JSON.parse(t.dataset.content);
      (delete n[a], (t.dataset.content = JSON.stringify(n)));
    }
  }
  function isElementManagedByBlaze(e) {
    return 'string' == typeof e.id && e.id.startsWith('tb-tb-');
  }
  function createInPageNotification(e) {
    showInPageNotification(e);
  }
  function rootDocument() {
    let e = 0,
      t = window,
      n = t.document;
    for (; t.parent && t.parent !== t; ) {
      if ((e++, e > 30)) {
        console.error('Exceeding frame depth');
        break;
      }
      try {
        ((t = window.parent), (n = t.document));
      } catch (e) {
        break;
      }
    }
    return n;
  }
  function getTabindex(e) {
    const t = parseInt(e.getAttribute('tabindex'), 10);
    return isNaN(t) ? (e.isContentEditable || e.editContext ? 0 : e.tabIndex) : t;
  }
  function tabPrev() {
    const e = tabbable(rootDocument().body);
    if (e.length) {
      let t = e.indexOf(documentActive());
      (t--, t < 0 && (t = e.length - 1), e[t].focus());
    }
  }
  function tabNext() {
    const e = tabbable(rootDocument().body);
    if (e.length) {
      let t = e.indexOf(documentActive());
      (t++, t >= e.length && (t = 0), e[t].focus());
    }
  }
  function tabbable(e) {
    const t = [];
    return (
      (function e(t, n) {
        if (t instanceof win(t).HTMLElement)
          if (getShadowRoot(t)) {
            const o = [];
            (n.push({ type: 'CONTAINER', element: t, candidates: o }), e(getShadowRoot(t), o));
          } else if (t instanceof win(t).HTMLIFrameElement) {
            const o = [];
            n.push({ type: 'CONTAINER', element: t, candidates: o });
            try {
              e(t.contentWindow.document.body, o);
            } catch (e) {
              n.pop();
            }
          } else t.matches(we) && n.push({ type: 'ELEMENT', element: t });
        for (t = t.firstChild; t; ) (e(t, n), (t = t.nextSibling));
      })(e, t),
      (function e(t) {
        const n = [],
          o = [];
        let i, s;
        for (let e = 0; e < t.length; e++)
          ((i = t[e]),
            ('ELEMENT' !== i.type || isNodeMatchingSelectorTabbable(i.element)) &&
              ('CONTAINER' !== i.type || i.candidates.length) &&
              ((s = getTabindex(i.element)),
              'CONTAINER' === i.type && s < 0 && (s = 0),
              0 === s
                ? n.push({ candidate: i })
                : o.push({ documentOrder: e, tabIndex: s, candidate: i })));
        let r = o.sort(sortOrderedTabbables);
        r = r.concat(n);
        let a = [];
        for (const t of r)
          'ELEMENT' === t.candidate.type
            ? a.push(t.candidate.element)
            : (a = a.concat(e(t.candidate.candidates)));
        return a;
      })(t)
    );
  }
  function moveToNextRadioButton(e, t) {
    const n = e.name,
      o = [...document.querySelectorAll(getSelectorForNamedRadioInput(n))],
      i = o.indexOf(e),
      s = t ? 1 : -1;
    for (let e = i + s; e !== i; e += s) {
      (-1 === e && (e = o.length - 1), e === o.length && (e = 0));
      const t = o[e];
      if (isNodeMatchingSelectorFocusable(t))
        return ((t.checked = !0), t.focus(), void dispatchInputAndChangeEvents(t));
    }
    reportToErrorMonitoring('Could not find next visible radio button');
  }
  onLoaded(function () {
    const e = document.createElement('script');
    function t() {
      const e = documentActive(document, !1);
      e && e.nodeType === Node.ELEMENT_NODE && e.matches(S) && (Ee = new WeakRef(e));
    }
    function n() {
      (debug('[FOCUSED WINDOW]', document.location.href),
        promiseSendMessage({ request: 'frameUpdate', subType: 'focusChange' }));
    }
    ((e.src = T.runtime.getURL('js/tbremapper.js')),
      e.addEventListener('load', function () {
        this.remove();
      }),
      (document.head || document.documentElement).appendChild(e),
      extensionActive() &&
        promiseSendMessage({ request: 'getStreamTimeout' }).then(function (e) {
          v.setResetTimeout(e);
        }),
      promiseSendMessage({ request: 'pageLoaded' }),
      promiseSendMessage({ request: 'picker', subType: 'install' }),
      D.observe(document, {
        attributes: !0,
        childList: !0,
        subtree: !0,
        attributeFilter: ['contenteditable', 'role', 'aria-modal'],
      }),
      registerElement(document.querySelectorAll(S)),
      checkIFrames(document.querySelectorAll(C)),
      registerExistingEditContexts(),
      promiseSendMessage({ request: 'shouldAddDesktopIntegration' }).then(e => {
        void 0 !== e && updateDesktopIntegrationStatus(e);
      }),
      isAIChatIframe() ||
        addGlobalListener(({ window: e }) => {
          (isCurrentFrameFocused() && (n(), t()),
            e.addEventListener('focus', () => {
              n();
            }));
        }),
      addGlobalListener(({ document: e }) =>
        e.addEventListener(
          'focusin',
          () => {
            t();
          },
          !0
        )
      ));
  });
  const we = [
    'input',
    'select',
    'textarea',
    'a[href]',
    'button',
    '[tabindex]',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
  ].join(',');
  function isNodeMatchingSelectorTabbable(e) {
    return !(!isNodeMatchingSelectorFocusable(e) || isNonTabbableRadio(e) || getTabindex(e) < 0);
  }
  function isInteractiveNode(e) {
    const t = 'role' in e ? e.role : void 0;
    if (
      t &&
      [
        'scrollbar',
        'searchbox',
        'separator',
        'slider',
        'spinbutton',
        'switch',
        'tab',
        'tabpanel',
        'treeitem',
        'button',
        'checkbox',
        'gridcell',
        'link',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'option',
        'progressbar',
        'radio',
        'textbox',
      ].includes(t)
    )
      return !0;
    if (e instanceof Element && 'false' === e.ariaDisabled) return !0;
    if (e instanceof win(e).HTMLLabelElement) {
      const t = e.getAttribute('for');
      let n;
      if (
        ((n = t ? document.getElementById(t) : e.querySelector('input')),
        n && !(n instanceof win(n).HTMLLabelElement) && n.labels && [...n.labels].includes(e))
      )
        return isClickableNode(n);
    }
    return !1;
  }
  function isClickableNode(e) {
    return (
      !!e &&
      e instanceof win(e).HTMLElement &&
      (isNodeMatchingSelectorTabbable(e) || isInteractiveNode(e))
    );
  }
  function isNodeMatchingSelectorFocusable(e) {
    return !(e.disabled || isHiddenInput(e) || Se(e));
  }
  function sortOrderedTabbables(e, t) {
    return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
  }
  function isInput(e) {
    return 'INPUT' === e.tagName;
  }
  function isHiddenInput(e) {
    return isInput(e) && 'hidden' === e.type;
  }
  function isRadio(e) {
    return isInput(e) && 'radio' === e.type;
  }
  function isNonTabbableRadio(e) {
    return isRadio(e) && !isTabbableRadio(e);
  }
  function getCheckedRadio(e) {
    for (let t = 0; t < e.length; t++) if (e[t].checked) return e[t];
  }
  function getSelectorForNamedRadioInput(e) {
    return 'input[type="radio"][name="' + CSS.escape(e) + '"]';
  }
  function isTabbableRadio(e) {
    if (!e.name) return !0;
    const t = getCheckedRadio(
      e.ownerDocument.querySelectorAll(getSelectorForNamedRadioInput(e.name))
    );
    return !t || t === e;
  }
  const Se = function (e) {
    if ('hidden' === getComputedStyle(e).visibility) return !0;
    if (
      (e.matches('details>summary:first-of-type') ? e.parentElement : e).matches(
        'details:not([open]) *'
      )
    )
      return !0;
    for (; e; ) {
      if ('none' === getComputedStyle(e).display) return !0;
      e = e.parentElement;
    }
    return !1;
  };
  function isAIBlazeExtensionActive() {
    try {
      if (!l?.deref()) {
        const e = document.querySelector('html > ' + s);
        l = new WeakRef(e);
      }
      const e = l.deref();
      if (!(e && e instanceof HTMLElement)) return !1;
      const t = getShadowRoot(e);
      return !!JSON.parse(t.querySelector('div').dataset.content).ai;
    } catch (e) {
      return (reportToErrorMonitoring(e), !1);
    }
  }
  function reportToErrorMonitoring(e, t) {
    try {
      if (!extensionActive()) return;
      let n = null;
      ((n = 'string' == typeof e ? new Error(e) : e), console.error(n));
      const o = { request: 'reportError', message: 'Error report' };
      ((o.message = n.message),
        (o.stack = n.stack),
        (o.name = n.name),
        (o.extraData = t),
        promiseSendMessage(o).catch(e => {
          console.warn('sendMessage failed', e);
        }));
    } catch (e) {
      console.warn('Recursive exception while reporting error', e);
    }
  }
  function errorHandler(e) {
    try {
      if (!extensionActive()) return void e.preventDefault();
      const n = { type: e.type };
      let o;
      function t(e) {
        ((n.message = e.message),
          (n.stack = e.stack),
          (n.name = e.name),
          (o = new Error(e.message)),
          (o.name = e.name),
          (o.stack = e.stack));
      }
      if (e instanceof PromiseRejectionEvent)
        'object' != typeof e.reason ? (o = e.reason) : t(e.reason);
      else {
        if (!e.error) return;
        t(e.error);
      }
      reportToErrorMonitoring(o, n);
    } catch (i) {
      return (console.warn('Exception while reporting error', i), void reportToErrorMonitoring(i));
    }
  }
  function throttle(e, t) {
    let n = null,
      o = 0,
      i = [];
    function s() {
      ((o = Date.now()), n && (clearTimeout(n), (n = null)), e(...i), (i = []));
    }
    return (...e) => {
      i = e;
      const r = Date.now();
      if (!n) {
        const e = o + t;
        if (e <= r) s();
        else {
          n = setTimeout(() => {
            s();
          }, e - r);
        }
      }
    };
  }
  (addGlobalListener(({ window: e }) => e.addEventListener('unhandledrejection', errorHandler)),
    addGlobalListener(({ window: e }) => e.addEventListener('error', errorHandler)));
}
