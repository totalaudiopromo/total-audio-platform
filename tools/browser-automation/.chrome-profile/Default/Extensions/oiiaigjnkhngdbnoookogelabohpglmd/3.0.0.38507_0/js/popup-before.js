!(function () {
  'use strict';
  var t = {}.toString,
    e = function (e) {
      return t.call(e).slice(8, -1);
    },
    n =
      Array.isArray ||
      function (t) {
        return 'Array' == e(t);
      },
    r = function (t) {
      return 'object' == typeof t ? null !== t : 'function' == typeof t;
    },
    o = function (t) {
      if (null == t) throw TypeError("Can't call method on " + t);
      return t;
    },
    i = function (t) {
      return Object(o(t));
    },
    u = Math.ceil,
    s = Math.floor,
    c = function (t) {
      return isNaN((t = +t)) ? 0 : (t > 0 ? s : u)(t);
    },
    a = Math.min,
    f = function (t) {
      return t > 0 ? a(c(t), 9007199254740991) : 0;
    },
    l = function (t, e) {
      if (!r(t)) return t;
      var n, o;
      if (e && 'function' == typeof (n = t.toString) && !r((o = n.call(t)))) return o;
      if ('function' == typeof (n = t.valueOf) && !r((o = n.call(t)))) return o;
      if (!e && 'function' == typeof (n = t.toString) && !r((o = n.call(t)))) return o;
      throw TypeError("Can't convert object to primitive value");
    },
    h = function (t) {
      try {
        return !!t();
      } catch (t) {
        return !0;
      }
    },
    p = !h(function () {
      return (
        7 !=
        Object.defineProperty({}, 'a', {
          get: function () {
            return 7;
          },
        }).a
      );
    }),
    d =
      'object' == typeof window && window && window.Math == Math
        ? window
        : 'object' == typeof self && self && self.Math == Math
        ? self
        : Function('return this')(),
    v = d.document,
    g = r(v) && r(v.createElement),
    b = function (t) {
      return g ? v.createElement(t) : {};
    },
    y =
      !p &&
      !h(function () {
        return (
          7 !=
          Object.defineProperty(b('div'), 'a', {
            get: function () {
              return 7;
            },
          }).a
        );
      }),
    m = function (t) {
      if (!r(t)) throw TypeError(String(t) + ' is not an object');
      return t;
    },
    w = Object.defineProperty,
    T = {
      f: p
        ? w
        : function (t, e, n) {
            m(t);
            e = l(e, !0);
            m(n);
            if (y)
              try {
                return w(t, e, n);
              } catch (t) {}
            if ('get' in n || 'set' in n) throw TypeError('Accessors not supported');
            'value' in n && (t[e] = n.value);
            return t;
          },
    },
    O = function (t, e) {
      return { enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: e };
    },
    E = function (t, e, n) {
      var r = l(e);
      r in t ? T.f(t, r, O(0, n)) : (t[r] = n);
    };
  'undefined' != typeof window
    ? window
    : 'undefined' != typeof global
    ? global
    : 'undefined' != typeof self && self;
  function S() {
    throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }
  function _(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, 'default') ? t.default : t;
  }
  function R(t, e) {
    return t((e = { exports: {} }), e.exports), e.exports;
  }
  var L,
    j,
    I,
    M = p
      ? function (t, e, n) {
          return T.f(t, e, O(1, n));
        }
      : function (t, e, n) {
          t[e] = n;
          return t;
        },
    P = function (t, e) {
      try {
        M(d, t, e);
      } catch (n) {
        d[t] = e;
      }
      return e;
    },
    x = !1,
    A = R(function (t) {
      var e = '__core-js_shared__',
        n = d[e] || P(e, {});
      (t.exports = function (t, e) {
        return n[t] || (n[t] = void 0 !== e ? e : {});
      })('versions', []).push({
        version: '3.0.1',
        mode: x ? 'pure' : 'global',
        copyright: '\xa9 2019 Denis Pushkarev (zloirock.ru)',
      });
    }),
    D = 0,
    $ = Math.random(),
    k = function (t) {
      return 'Symbol('.concat(void 0 === t ? '' : t, ')_', (++D + $).toString(36));
    },
    N = !h(function () {
      return !String(Symbol());
    }),
    C = A('wks'),
    F = d.Symbol,
    q = function (t) {
      return C[t] || (C[t] = (N && F[t]) || (N ? F : k)('Symbol.' + t));
    },
    z = q('species'),
    V = function (t, e) {
      var o;
      n(t) &&
        ('function' != typeof (o = t.constructor) || (o !== Array && !n(o.prototype))
          ? r(o) && null === (o = o[z]) && (o = void 0)
          : (o = void 0));
      return new (void 0 === o ? Array : o)(0 === e ? 0 : e);
    },
    H = q('species'),
    U = function (t) {
      return !h(function () {
        var e = [];
        (e.constructor = {})[H] = function () {
          return { foo: 1 };
        };
        return 1 !== e[t](Boolean).foo;
      });
    },
    B = {}.propertyIsEnumerable,
    G = Object.getOwnPropertyDescriptor,
    W = {
      f:
        G && !B.call({ 1: 2 }, 1)
          ? function (t) {
              var e = G(this, t);
              return !!e && e.enumerable;
            }
          : B,
    },
    Y = ''.split,
    J = h(function () {
      return !Object('z').propertyIsEnumerable(0);
    })
      ? function (t) {
          return 'String' == e(t) ? Y.call(t, '') : Object(t);
        }
      : Object,
    K = function (t) {
      return J(o(t));
    },
    Q = {}.hasOwnProperty,
    X = function (t, e) {
      return Q.call(t, e);
    },
    Z = Object.getOwnPropertyDescriptor,
    tt = {
      f: p
        ? Z
        : function (t, e) {
            t = K(t);
            e = l(e, !0);
            if (y)
              try {
                return Z(t, e);
              } catch (t) {}
            if (X(t, e)) return O(!W.f.call(t, e), t[e]);
          },
    },
    et = A('native-function-to-string', Function.toString),
    nt = d.WeakMap,
    rt = 'function' == typeof nt && /native code/.test(et.call(nt)),
    ot = A('keys'),
    it = function (t) {
      return ot[t] || (ot[t] = k(t));
    },
    ut = {},
    st = d.WeakMap,
    ct = function (t) {
      return I(t) ? j(t) : L(t, {});
    },
    at = function (t) {
      return function (e) {
        var n;
        if (!r(e) || (n = j(e)).type !== t)
          throw TypeError('Incompatible receiver, ' + t + ' required');
        return n;
      };
    };
  if (rt) {
    var ft = new st(),
      lt = ft.get,
      ht = ft.has,
      pt = ft.set;
    L = function (t, e) {
      pt.call(ft, t, e);
      return e;
    };
    j = function (t) {
      return lt.call(ft, t) || {};
    };
    I = function (t) {
      return ht.call(ft, t);
    };
  } else {
    var dt = it('state');
    ut[dt] = !0;
    L = function (t, e) {
      M(t, dt, e);
      return e;
    };
    j = function (t) {
      return X(t, dt) ? t[dt] : {};
    };
    I = function (t) {
      return X(t, dt);
    };
  }
  var vt = { set: L, get: j, has: I, enforce: ct, getterFor: at },
    gt =
      (vt.set,
      vt.get,
      vt.has,
      vt.enforce,
      vt.getterFor,
      R(function (t) {
        var e = vt.get,
          n = vt.enforce,
          r = String(et).split('toString');
        A('inspectSource', function (t) {
          return et.call(t);
        });
        (t.exports = function (t, e, o, i) {
          var u = !!i && !!i.unsafe,
            s = !!i && !!i.enumerable,
            c = !!i && !!i.noTargetGet;
          if ('function' == typeof o) {
            'string' != typeof e || X(o, 'name') || M(o, 'name', e);
            n(o).source = r.join('string' == typeof e ? e : '');
          }
          if (t !== d) {
            u ? !c && t[e] && (s = !0) : delete t[e];
            s ? (t[e] = o) : M(t, e, o);
          } else s ? (t[e] = o) : P(e, o);
        })(Function.prototype, 'toString', function () {
          return ('function' == typeof this && e(this).source) || et.call(this);
        });
      })),
    bt = Math.max,
    yt = Math.min,
    mt = function (t, e) {
      var n = c(t);
      return n < 0 ? bt(n + e, 0) : yt(n, e);
    },
    wt = (function (t) {
      return function (e, n, r) {
        var o,
          i = K(e),
          u = f(i.length),
          s = mt(r, u);
        if (t && n != n) {
          for (; u > s; ) if ((o = i[s++]) != o) return !0;
        } else for (; u > s; s++) if ((t || s in i) && i[s] === n) return t || s || 0;
        return !t && -1;
      };
    })(!1),
    Tt = function (t, e) {
      var n,
        r = K(t),
        o = 0,
        i = [];
      for (n in r) !X(ut, n) && X(r, n) && i.push(n);
      for (; e.length > o; ) X(r, (n = e[o++])) && (~wt(i, n) || i.push(n));
      return i;
    },
    Ot = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf',
    ],
    Et = Ot.concat('length', 'prototype'),
    St = {
      f:
        Object.getOwnPropertyNames ||
        function (t) {
          return Tt(t, Et);
        },
    },
    _t = { f: Object.getOwnPropertySymbols },
    Rt = d.Reflect,
    Lt =
      (Rt && Rt.ownKeys) ||
      function (t) {
        var e = St.f(m(t)),
          n = _t.f;
        return n ? e.concat(n(t)) : e;
      },
    jt = function (t, e) {
      for (var n = Lt(e), r = T.f, o = tt.f, i = 0; i < n.length; i++) {
        var u = n[i];
        X(t, u) || r(t, u, o(e, u));
      }
    },
    It = /#|\.prototype\./,
    Mt = function (t, e) {
      var n = xt[Pt(t)];
      return n == Dt || (n != At && ('function' == typeof e ? h(e) : !!e));
    },
    Pt = (Mt.normalize = function (t) {
      return String(t).replace(It, '.').toLowerCase();
    }),
    xt = (Mt.data = {}),
    At = (Mt.NATIVE = 'N'),
    Dt = (Mt.POLYFILL = 'P'),
    $t = Mt,
    kt = tt.f,
    Nt = function (t, e) {
      var n,
        r,
        o,
        i,
        u,
        s = t.target,
        c = t.global,
        a = t.stat;
      if ((n = c ? d : a ? d[s] || P(s, {}) : (d[s] || {}).prototype))
        for (r in e) {
          i = e[r];
          o = t.noTargetGet ? (u = kt(n, r)) && u.value : n[r];
          if (!$t(c ? r : s + (a ? '.' : '#') + r, t.forced) && void 0 !== o) {
            if (typeof i == typeof o) continue;
            jt(i, o);
          }
          (t.sham || (o && o.sham)) && M(i, 'sham', !0);
          gt(n, r, i, t);
        }
    },
    Ct = q('isConcatSpreadable'),
    Ft = 9007199254740991,
    qt = 'Maximum allowed index exceeded',
    zt = !h(function () {
      var t = [];
      t[Ct] = !1;
      return t.concat()[0] !== t;
    }),
    Vt = U('concat'),
    Ht = function (t) {
      if (!r(t)) return !1;
      var e = t[Ct];
      return void 0 !== e ? !!e : n(t);
    };
  Nt(
    { target: 'Array', proto: !0, forced: !zt || !Vt },
    {
      concat: function (t) {
        var e,
          n,
          r,
          o,
          u,
          s = i(this),
          c = V(s, 0),
          a = 0;
        for (e = -1, r = arguments.length; e < r; e++)
          if (Ht((u = -1 === e ? s : arguments[e]))) {
            if (a + (o = f(u.length)) > Ft) throw TypeError(qt);
            for (n = 0; n < o; n++, a++) n in u && E(c, a, u[n]);
          } else {
            if (a >= Ft) throw TypeError(qt);
            E(c, a++, u);
          }
        c.length = a;
        return c;
      },
    }
  );
  var Ut = q('toStringTag'),
    Bt =
      'Arguments' ==
      e(
        (function () {
          return arguments;
        })()
      ),
    Gt = function (t, e) {
      try {
        return t[e];
      } catch (t) {}
    },
    Wt = function (t) {
      var n, r, o;
      return void 0 === t
        ? 'Undefined'
        : null === t
        ? 'Null'
        : 'string' == typeof (r = Gt((n = Object(t)), Ut))
        ? r
        : Bt
        ? e(n)
        : 'Object' == (o = e(n)) && 'function' == typeof n.callee
        ? 'Arguments'
        : o;
    },
    Yt = {};
  Yt[q('toStringTag')] = 'z';
  var Jt =
      '[object z]' !== String(Yt)
        ? function () {
            return '[object ' + Wt(this) + ']';
          }
        : Yt.toString,
    Kt = Object.prototype;
  Jt !== Kt.toString && gt(Kt, 'toString', Jt, { unsafe: !0 });
  var Qt = T.f,
    Xt = q('toStringTag'),
    Zt = function (t, e, n) {
      t && !X((t = n ? t : t.prototype), Xt) && Qt(t, Xt, { configurable: !0, value: e });
    },
    te = { f: q },
    ee = d,
    ne = T.f,
    re = function (t) {
      var e = ee.Symbol || (ee.Symbol = {});
      X(e, t) || ne(e, t, { value: te.f(t) });
    },
    oe =
      Object.keys ||
      function (t) {
        return Tt(t, Ot);
      },
    ie = function (t) {
      var e = oe(t),
        n = _t.f;
      if (n)
        for (var r, o = n(t), i = W.f, u = 0; o.length > u; ) i.call(t, (r = o[u++])) && e.push(r);
      return e;
    },
    ue = p
      ? Object.defineProperties
      : function (t, e) {
          m(t);
          for (var n, r = oe(e), o = r.length, i = 0; o > i; ) T.f(t, (n = r[i++]), e[n]);
          return t;
        },
    se = d.document,
    ce = se && se.documentElement,
    ae = it('IE_PROTO'),
    fe = 'prototype',
    le = function () {},
    he = function () {
      var t,
        e = b('iframe'),
        n = Ot.length,
        r = '<',
        o = 'script',
        i = '>',
        u = 'java' + o + ':';
      e.style.display = 'none';
      ce.appendChild(e);
      e.src = String(u);
      (t = e.contentWindow.document).open();
      t.write(r + o + i + 'document.F=Object' + r + '/' + o + i);
      t.close();
      he = t.F;
      for (; n--; ) delete he[fe][Ot[n]];
      return he();
    },
    pe =
      Object.create ||
      function (t, e) {
        var n;
        if (null !== t) {
          le[fe] = m(t);
          n = new le();
          le[fe] = null;
          n[ae] = t;
        } else n = he();
        return void 0 === e ? n : ue(n, e);
      };
  ut[ae] = !0;
  var de = St.f,
    ve = {}.toString,
    ge =
      'object' == typeof window && window && Object.getOwnPropertyNames
        ? Object.getOwnPropertyNames(window)
        : [],
    be = function (t) {
      try {
        return de(t);
      } catch (t) {
        return ge.slice();
      }
    },
    ye = {
      f: function (t) {
        return ge && '[object Window]' == ve.call(t) ? be(t) : de(K(t));
      },
    },
    me = it('hidden'),
    we = 'Symbol',
    Te = vt.set,
    Oe = vt.getterFor(we),
    Ee = tt.f,
    Se = T.f,
    _e = ye.f,
    Re = d.Symbol,
    Le = d.JSON,
    je = Le && Le.stringify,
    Ie = 'prototype',
    Me = q('toPrimitive'),
    Pe = W.f,
    xe = A('symbol-registry'),
    Ae = A('symbols'),
    De = A('op-symbols'),
    $e = A('wks'),
    ke = Object[Ie],
    Ne = d.QObject,
    Ce = !Ne || !Ne[Ie] || !Ne[Ie].findChild,
    Fe =
      p &&
      h(function () {
        return (
          7 !=
          pe(
            Se({}, 'a', {
              get: function () {
                return Se(this, 'a', { value: 7 }).a;
              },
            })
          ).a
        );
      })
        ? function (t, e, n) {
            var r = Ee(ke, e);
            r && delete ke[e];
            Se(t, e, n);
            r && t !== ke && Se(ke, e, r);
          }
        : Se,
    qe = function (t, e) {
      var n = (Ae[t] = pe(Re[Ie]));
      Te(n, { type: we, tag: t, description: e });
      p || (n.description = e);
      return n;
    },
    ze =
      N && 'symbol' == typeof Re.iterator
        ? function (t) {
            return 'symbol' == typeof t;
          }
        : function (t) {
            return Object(t) instanceof Re;
          },
    Ve = function (t, e, n) {
      t === ke && Ve(De, e, n);
      m(t);
      e = l(e, !0);
      m(n);
      if (X(Ae, e)) {
        if (n.enumerable) {
          X(t, me) && t[me][e] && (t[me][e] = !1);
          n = pe(n, { enumerable: O(0, !1) });
        } else {
          X(t, me) || Se(t, me, O(1, {}));
          t[me][e] = !0;
        }
        return Fe(t, e, n);
      }
      return Se(t, e, n);
    },
    He = function (t, e) {
      m(t);
      for (var n, r = ie((e = K(e))), o = 0, i = r.length; i > o; ) Ve(t, (n = r[o++]), e[n]);
      return t;
    },
    Ue = function (t, e) {
      return void 0 === e ? pe(t) : He(pe(t), e);
    },
    Be = function (t) {
      var e = Pe.call(this, (t = l(t, !0)));
      return (
        !(this === ke && X(Ae, t) && !X(De, t)) &&
        (!(e || !X(this, t) || !X(Ae, t) || (X(this, me) && this[me][t])) || e)
      );
    },
    Ge = function (t, e) {
      t = K(t);
      e = l(e, !0);
      if (t !== ke || !X(Ae, e) || X(De, e)) {
        var n = Ee(t, e);
        !n || !X(Ae, e) || (X(t, me) && t[me][e]) || (n.enumerable = !0);
        return n;
      }
    },
    We = function (t) {
      for (var e, n = _e(K(t)), r = [], o = 0; n.length > o; )
        X(Ae, (e = n[o++])) || X(ut, e) || r.push(e);
      return r;
    },
    Ye = function (t) {
      for (var e, n = t === ke, r = _e(n ? De : K(t)), o = [], i = 0; r.length > i; )
        !X(Ae, (e = r[i++])) || (n && !X(ke, e)) || o.push(Ae[e]);
      return o;
    };
  if (!N) {
    Re = function () {
      if (this instanceof Re) throw TypeError('Symbol is not a constructor');
      var t = void 0 === arguments[0] ? void 0 : String(arguments[0]),
        e = k(t),
        n = function (t) {
          this === ke && n.call(De, t);
          X(this, me) && X(this[me], e) && (this[me][e] = !1);
          Fe(this, e, O(1, t));
        };
      p && Ce && Fe(ke, e, { configurable: !0, set: n });
      return qe(e, t);
    };
    gt(Re[Ie], 'toString', function () {
      return Oe(this).tag;
    });
    W.f = Be;
    T.f = Ve;
    tt.f = Ge;
    St.f = ye.f = We;
    _t.f = Ye;
    if (p) {
      Se(Re[Ie], 'description', {
        configurable: !0,
        get: function () {
          return Oe(this).description;
        },
      });
      x || gt(ke, 'propertyIsEnumerable', Be, { unsafe: !0 });
    }
    te.f = function (t) {
      return qe(q(t), t);
    };
  }
  Nt({ global: !0, wrap: !0, forced: !N, sham: !N }, { Symbol: Re });
  for (var Je = oe($e), Ke = 0; Je.length > Ke; ) re(Je[Ke++]);
  Nt(
    { target: we, stat: !0, forced: !N },
    {
      for: function (t) {
        return X(xe, (t += '')) ? xe[t] : (xe[t] = Re(t));
      },
      keyFor: function (t) {
        if (!ze(t)) throw TypeError(t + ' is not a symbol');
        for (var e in xe) if (xe[e] === t) return e;
      },
      useSetter: function () {
        Ce = !0;
      },
      useSimple: function () {
        Ce = !1;
      },
    }
  );
  Nt(
    { target: 'Object', stat: !0, forced: !N, sham: !p },
    { create: Ue, defineProperty: Ve, defineProperties: He, getOwnPropertyDescriptor: Ge }
  );
  Nt(
    { target: 'Object', stat: !0, forced: !N },
    { getOwnPropertyNames: We, getOwnPropertySymbols: Ye }
  );
  Le &&
    Nt(
      {
        target: 'JSON',
        stat: !0,
        forced:
          !N ||
          h(function () {
            var t = Re();
            return '[null]' != je([t]) || '{}' != je({ a: t }) || '{}' != je(Object(t));
          }),
      },
      {
        stringify: function (t) {
          for (var e, o, i = [t], u = 1; arguments.length > u; ) i.push(arguments[u++]);
          o = e = i[1];
          if ((r(e) || void 0 !== t) && !ze(t)) {
            n(e) ||
              (e = function (t, e) {
                'function' == typeof o && (e = o.call(this, t, e));
                if (!ze(e)) return e;
              });
            i[1] = e;
            return je.apply(Le, i);
          }
        },
      }
    );
  Re[Ie][Me] || M(Re[Ie], Me, Re[Ie].valueOf);
  Zt(Re, we);
  ut[me] = !0;
  re('asyncIterator');
  var Qe = T.f,
    Xe = d.Symbol;
  if (
    p &&
    'function' == typeof Xe &&
    (!('description' in Xe.prototype) || void 0 !== Xe().description)
  ) {
    var Ze = {},
      tn = function () {
        var t = arguments.length < 1 || void 0 === arguments[0] ? void 0 : String(arguments[0]),
          e = this instanceof tn ? new Xe(t) : void 0 === t ? Xe() : Xe(t);
        '' === t && (Ze[e] = !0);
        return e;
      };
    jt(tn, Xe);
    var en = (tn.prototype = Xe.prototype);
    en.constructor = tn;
    var nn = en.toString,
      rn = 'Symbol(test)' == String(Xe('test')),
      on = /^Symbol\((.*)\)[^)]+$/;
    Qe(en, 'description', {
      configurable: !0,
      get: function () {
        var t = r(this) ? this.valueOf() : this,
          e = nn.call(t);
        if (X(Ze, t)) return '';
        var n = rn ? e.slice(7, -1) : e.replace(on, '$1');
        return '' === n ? void 0 : n;
      },
    });
    Nt({ global: !0, forced: !0 }, { Symbol: tn });
  }
  re('hasInstance');
  re('isConcatSpreadable');
  re('iterator');
  re('match');
  re('replace');
  re('search');
  re('species');
  re('split');
  re('toPrimitive');
  re('toStringTag');
  re('unscopables');
  Zt(Math, 'Math', !0);
  Zt(d.JSON, 'JSON', !0);
  ee.Symbol;
  var un = function (t) {
      if ('function' != typeof t) throw TypeError(String(t) + ' is not a function');
      return t;
    },
    sn = function (t, e, n) {
      un(t);
      if (void 0 === e) return t;
      switch (n) {
        case 0:
          return function () {
            return t.call(e);
          };
        case 1:
          return function (n) {
            return t.call(e, n);
          };
        case 2:
          return function (n, r) {
            return t.call(e, n, r);
          };
        case 3:
          return function (n, r, o) {
            return t.call(e, n, r, o);
          };
      }
      return function () {
        return t.apply(e, arguments);
      };
    },
    cn = function (t, e, r, o, i, u, s, c) {
      for (var a, l = i, h = 0, p = !!s && sn(s, c, 3); h < o; ) {
        if (h in r) {
          a = p ? p(r[h], h, e) : r[h];
          if (u > 0 && n(a)) l = cn(t, e, a, f(a.length), l, u - 1) - 1;
          else {
            if (l >= 9007199254740991) throw TypeError('Exceed the acceptable array length');
            t[l] = a;
          }
          l++;
        }
        h++;
      }
      return l;
    },
    an = cn;
  Nt(
    { target: 'Array', proto: !0 },
    {
      flat: function () {
        var t = arguments[0],
          e = i(this),
          n = f(e.length),
          r = V(e, 0);
        r.length = an(r, e, e, n, 0, void 0 === t ? 1 : c(t));
        return r;
      },
    }
  );
  Nt(
    { target: 'Array', proto: !0 },
    {
      flatMap: function (t) {
        var e,
          n = i(this),
          r = f(n.length);
        un(t);
        (e = V(n, 0)).length = an(e, n, n, r, 0, 1, t, arguments[1]);
        return e;
      },
    }
  );
  var fn = {},
    ln = q('iterator'),
    hn = Array.prototype,
    pn = function (t) {
      return void 0 !== t && (fn.Array === t || hn[ln] === t);
    },
    dn = q('iterator'),
    vn = function (t) {
      if (null != t) return t[dn] || t['@@iterator'] || fn[Wt(t)];
    },
    gn = function (t, e, n, r) {
      try {
        return r ? e(m(n)[0], n[1]) : e(n);
      } catch (e) {
        var o = t.return;
        void 0 !== o && m(o.call(t));
        throw e;
      }
    },
    bn = R(function (t) {
      var e = {},
        n = (t.exports = function (t, n, r, o, i) {
          var u,
            s,
            c,
            a,
            l,
            h = sn(n, r, o ? 2 : 1);
          if (i) u = t;
          else {
            if ('function' != typeof (s = vn(t))) throw TypeError('Target is not iterable');
            if (pn(s)) {
              for (c = 0, a = f(t.length); a > c; c++)
                if ((o ? h(m((l = t[c]))[0], l[1]) : h(t[c])) === e) return e;
              return;
            }
            u = s.call(t);
          }
          for (; !(l = u.next()).done; ) if (gn(u, h, l.value, o) === e) return e;
        });
      n.BREAK = e;
    });
  Nt(
    { target: 'Object', stat: !0 },
    {
      fromEntries: function (t) {
        var e = {};
        bn(
          t,
          function (t, n) {
            E(e, t, n);
          },
          void 0,
          !0
        );
        return e;
      },
    }
  );
  var yn,
    mn,
    wn,
    Tn = function (t, e, n) {
      var r,
        i,
        u = String(o(t)),
        s = c(e),
        a = u.length;
      return s < 0 || s >= a
        ? n
          ? ''
          : void 0
        : (r = u.charCodeAt(s)) < 55296 ||
          r > 56319 ||
          s + 1 === a ||
          (i = u.charCodeAt(s + 1)) < 56320 ||
          i > 57343
        ? n
          ? u.charAt(s)
          : r
        : n
        ? u.slice(s, s + 2)
        : i - 56320 + ((r - 55296) << 10) + 65536;
    },
    On = !h(function () {
      function t() {}
      t.prototype.constructor = null;
      return Object.getPrototypeOf(new t()) !== t.prototype;
    }),
    En = it('IE_PROTO'),
    Sn = Object.prototype,
    _n = On
      ? Object.getPrototypeOf
      : function (t) {
          t = i(t);
          return X(t, En)
            ? t[En]
            : 'function' == typeof t.constructor && t instanceof t.constructor
            ? t.constructor.prototype
            : t instanceof Object
            ? Sn
            : null;
        },
    Rn = q('iterator'),
    Ln = !1,
    jn = function () {
      return this;
    };
  [].keys &&
    ('next' in (wn = [].keys()) ? (mn = _n(_n(wn))) !== Object.prototype && (yn = mn) : (Ln = !0));
  null == yn && (yn = {});
  x || X(yn, Rn) || M(yn, Rn, jn);
  var In = { IteratorPrototype: yn, BUGGY_SAFARI_ITERATORS: Ln },
    Mn = (In.IteratorPrototype, In.BUGGY_SAFARI_ITERATORS, In.IteratorPrototype),
    Pn = function () {
      return this;
    },
    xn = function (t, e, n) {
      var r = e + ' Iterator';
      t.prototype = pe(Mn, { next: O(1, n) });
      Zt(t, r, !1, !0);
      fn[r] = Pn;
      return t;
    },
    An = function (t, e) {
      m(t);
      if (!r(e) && null !== e) throw TypeError("Can't set " + String(e) + ' as a prototype');
    },
    Dn =
      Object.setPrototypeOf ||
      ('__proto__' in {}
        ? (function () {
            var t,
              e = !1,
              n = {};
            try {
              (t = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set).call(n, []);
              e = n instanceof Array;
            } catch (t) {}
            return function (n, r) {
              An(n, r);
              e ? t.call(n, r) : (n.__proto__ = r);
              return n;
            };
          })()
        : void 0),
    $n = q('iterator'),
    kn = In.IteratorPrototype,
    Nn = In.BUGGY_SAFARI_ITERATORS,
    Cn = 'keys',
    Fn = 'values',
    qn = 'entries',
    zn = function () {
      return this;
    },
    Vn = function (t, e, n, r, o, i, u) {
      xn(n, e, r);
      var s,
        c,
        a,
        f = function (t) {
          if (t === o && v) return v;
          if (!Nn && t in p) return p[t];
          switch (t) {
            case Cn:
            case Fn:
            case qn:
              return function () {
                return new n(this, t);
              };
          }
          return function () {
            return new n(this);
          };
        },
        l = e + ' Iterator',
        h = !1,
        p = t.prototype,
        d = p[$n] || p['@@iterator'] || (o && p[o]),
        v = (!Nn && d) || f(o),
        g = ('Array' == e && p.entries) || d;
      if (g) {
        s = _n(g.call(new t()));
        if (kn !== Object.prototype && s.next) {
          x || _n(s) === kn || (Dn ? Dn(s, kn) : 'function' != typeof s[$n] && M(s, $n, zn));
          Zt(s, l, !0, !0);
          x && (fn[l] = zn);
        }
      }
      if (o == Fn && d && d.name !== Fn) {
        h = !0;
        v = function () {
          return d.call(this);
        };
      }
      (x && !u) || p[$n] === v || M(p, $n, v);
      fn[e] = v;
      if (o) {
        c = { values: f(Fn), keys: i ? v : f(Cn), entries: f(qn) };
        if (u) for (a in c) (Nn || h || !(a in p)) && gt(p, a, c[a]);
        else Nt({ target: e, proto: !0, forced: Nn || h }, c);
      }
      return c;
    },
    Hn = 'String Iterator',
    Un = vt.set,
    Bn = vt.getterFor(Hn);
  Vn(
    String,
    'String',
    function (t) {
      Un(this, { type: Hn, string: String(t), index: 0 });
    },
    function () {
      var t,
        e = Bn(this),
        n = e.string,
        r = e.index;
      if (r >= n.length) return { value: void 0, done: !0 };
      t = Tn(n, r, !0);
      e.index += t.length;
      return { value: t, done: !1 };
    }
  );
  var Gn = {
      CSSRuleList: 0,
      CSSStyleDeclaration: 0,
      CSSValueList: 0,
      ClientRectList: 0,
      DOMRectList: 0,
      DOMStringList: 0,
      DOMTokenList: 1,
      DataTransferItemList: 0,
      FileList: 0,
      HTMLAllCollection: 0,
      HTMLCollection: 0,
      HTMLFormElement: 0,
      HTMLSelectElement: 0,
      MediaList: 0,
      MimeTypeArray: 0,
      NamedNodeMap: 0,
      NodeList: 1,
      PaintRequestList: 0,
      Plugin: 0,
      PluginArray: 0,
      SVGLengthList: 0,
      SVGNumberList: 0,
      SVGPathSegList: 0,
      SVGPointList: 0,
      SVGStringList: 0,
      SVGTransformList: 0,
      SourceBufferList: 0,
      StyleSheetList: 0,
      TextTrackCueList: 0,
      TextTrackList: 0,
      TouchList: 0,
    },
    Wn =
      (Gn.CSSRuleList,
      Gn.CSSStyleDeclaration,
      Gn.CSSValueList,
      Gn.ClientRectList,
      Gn.DOMRectList,
      Gn.DOMStringList,
      Gn.DOMTokenList,
      Gn.DataTransferItemList,
      Gn.FileList,
      Gn.HTMLAllCollection,
      Gn.HTMLCollection,
      Gn.HTMLFormElement,
      Gn.HTMLSelectElement,
      Gn.MediaList,
      Gn.MimeTypeArray,
      Gn.NamedNodeMap,
      Gn.NodeList,
      Gn.PaintRequestList,
      Gn.Plugin,
      Gn.PluginArray,
      Gn.SVGLengthList,
      Gn.SVGNumberList,
      Gn.SVGPathSegList,
      Gn.SVGPointList,
      Gn.SVGStringList,
      Gn.SVGTransformList,
      Gn.SourceBufferList,
      Gn.StyleSheetList,
      Gn.TextTrackCueList,
      Gn.TextTrackList,
      Gn.TouchList,
      q('unscopables')),
    Yn = Array.prototype;
  null == Yn[Wn] && M(Yn, Wn, pe(null));
  var Jn = function (t) {
      Yn[Wn][t] = !0;
    },
    Kn = 'Array Iterator',
    Qn = vt.set,
    Xn = vt.getterFor(Kn),
    Zn = Vn(
      Array,
      'Array',
      function (t, e) {
        Qn(this, { type: Kn, target: K(t), index: 0, kind: e });
      },
      function () {
        var t = Xn(this),
          e = t.target,
          n = t.kind,
          r = t.index++;
        if (!e || r >= e.length) {
          t.target = void 0;
          return { value: void 0, done: !0 };
        }
        return 'keys' == n
          ? { value: r, done: !1 }
          : 'values' == n
          ? { value: e[r], done: !1 }
          : { value: [r, e[r]], done: !1 };
      },
      'values'
    );
  fn.Arguments = fn.Array;
  Jn('keys');
  Jn('values');
  Jn('entries');
  var tr = q('iterator'),
    er = q('toStringTag'),
    nr = Zn.values;
  for (var rr in Gn) {
    var or = d[rr],
      ir = or && or.prototype;
    if (ir) {
      if (ir[tr] !== nr)
        try {
          M(ir, tr, nr);
        } catch (t) {
          ir[tr] = nr;
        }
      ir[er] || M(ir, er, rr);
      if (Gn[rr])
        for (var ur in Zn)
          if (ir[ur] !== Zn[ur])
            try {
              M(ir, ur, Zn[ur]);
            } catch (t) {
              ir[ur] = Zn[ur];
            }
    }
  }
  var sr = function (t, e, n) {
      if (!(t instanceof e)) throw TypeError('Incorrect ' + (n ? n + ' ' : '') + 'invocation');
      return t;
    },
    cr = q('iterator'),
    ar = !1;
  try {
    var fr = 0,
      lr = {
        next: function () {
          return { done: !!fr++ };
        },
        return: function () {
          ar = !0;
        },
      };
    lr[cr] = function () {
      return this;
    };
    Array.from(lr, function () {
      throw 2;
    });
  } catch (t) {}
  var hr,
    pr,
    dr,
    vr = function (t, e) {
      if (!e && !ar) return !1;
      var n = !1;
      try {
        var r = {};
        r[cr] = function () {
          return {
            next: function () {
              return { done: (n = !0) };
            },
          };
        };
        t(r);
      } catch (t) {}
      return n;
    },
    gr = q('species'),
    br = function (t, e) {
      var n,
        r = m(t).constructor;
      return void 0 === r || null == (n = m(r)[gr]) ? e : un(n);
    },
    yr = d.setImmediate,
    mr = d.clearImmediate,
    wr = d.process,
    Tr = d.MessageChannel,
    Or = d.Dispatch,
    Er = 0,
    Sr = {},
    _r = 'onreadystatechange',
    Rr = function () {
      var t = +this;
      if (Sr.hasOwnProperty(t)) {
        var e = Sr[t];
        delete Sr[t];
        e();
      }
    },
    Lr = function (t) {
      Rr.call(t.data);
    };
  if (!yr || !mr) {
    yr = function (t) {
      for (var e = [], n = 1; arguments.length > n; ) e.push(arguments[n++]);
      Sr[++Er] = function () {
        ('function' == typeof t ? t : Function(t)).apply(void 0, e);
      };
      hr(Er);
      return Er;
    };
    mr = function (t) {
      delete Sr[t];
    };
    if ('process' == e(wr))
      hr = function (t) {
        wr.nextTick(sn(Rr, t, 1));
      };
    else if (Or && Or.now)
      hr = function (t) {
        Or.now(sn(Rr, t, 1));
      };
    else if (Tr) {
      dr = (pr = new Tr()).port2;
      pr.port1.onmessage = Lr;
      hr = sn(dr.postMessage, dr, 1);
    } else if (d.addEventListener && 'function' == typeof postMessage && !d.importScripts) {
      hr = function (t) {
        d.postMessage(t + '', '*');
      };
      d.addEventListener('message', Lr, !1);
    } else
      hr =
        _r in b('script')
          ? function (t) {
              ce.appendChild(b('script'))[_r] = function () {
                ce.removeChild(this);
                Rr.call(t);
              };
            }
          : function (t) {
              setTimeout(sn(Rr, t, 1), 0);
            };
  }
  var jr,
    Ir,
    Mr,
    Pr,
    xr,
    Ar,
    Dr,
    $r = { set: yr, clear: mr },
    kr = ($r.set, $r.clear, d.navigator),
    Nr = (kr && kr.userAgent) || '',
    Cr = tt.f,
    Fr = $r.set,
    qr = d.MutationObserver || d.WebKitMutationObserver,
    zr = d.process,
    Vr = d.Promise,
    Hr = 'process' == e(zr),
    Ur = Cr(d, 'queueMicrotask'),
    Br = Ur && Ur.value;
  if (!Br) {
    jr = function () {
      var t, e;
      Hr && (t = zr.domain) && t.exit();
      for (; Ir; ) {
        e = Ir.fn;
        Ir = Ir.next;
        try {
          e();
        } catch (t) {
          Ir ? Pr() : (Mr = void 0);
          throw t;
        }
      }
      Mr = void 0;
      t && t.enter();
    };
    if (Hr)
      Pr = function () {
        zr.nextTick(jr);
      };
    else if (qr && !/(iPhone|iPod|iPad).*AppleWebKit/i.test(Nr)) {
      xr = !0;
      Ar = document.createTextNode('');
      new qr(jr).observe(Ar, { characterData: !0 });
      Pr = function () {
        Ar.data = xr = !xr;
      };
    } else if (Vr && Vr.resolve) {
      Dr = Vr.resolve(void 0);
      Pr = function () {
        Dr.then(jr);
      };
    } else
      Pr = function () {
        Fr.call(d, jr);
      };
  }
  var Gr,
    Wr,
    Yr,
    Jr =
      Br ||
      function (t) {
        var e = { fn: t, next: void 0 };
        Mr && (Mr.next = e);
        if (!Ir) {
          Ir = e;
          Pr();
        }
        Mr = e;
      },
    Kr = function (t) {
      var e, n;
      this.promise = new t(function (t, r) {
        if (void 0 !== e || void 0 !== n) throw TypeError('Bad Promise constructor');
        e = t;
        n = r;
      });
      this.resolve = un(e);
      this.reject = un(n);
    },
    Qr = {
      f: function (t) {
        return new Kr(t);
      },
    },
    Xr = function (t, e) {
      m(t);
      if (r(e) && e.constructor === t) return e;
      var n = Qr.f(t);
      (0, n.resolve)(e);
      return n.promise;
    },
    Zr = function (t, e) {
      var n = d.console;
      n && n.error && (1 === arguments.length ? n.error(t) : n.error(t, e));
    },
    to = function (t) {
      try {
        return { error: !1, value: t() };
      } catch (t) {
        return { error: !0, value: t };
      }
    },
    eo = function (t, e, n) {
      for (var r in e) gt(t, r, e[r], n);
      return t;
    },
    no = function (t) {
      return 'function' == typeof t ? t : void 0;
    },
    ro = function (t, e) {
      return arguments.length < 2
        ? no(ee[t]) || no(d[t])
        : (ee[t] && ee[t][e]) || (d[t] && d[t][e]);
    },
    oo = q('species'),
    io = function (t) {
      var e = ro(t),
        n = T.f;
      p &&
        e &&
        !e[oo] &&
        n(e, oo, {
          configurable: !0,
          get: function () {
            return this;
          },
        });
    },
    uo = 'Promise',
    so = $r.set,
    co = q('species'),
    ao = vt.get,
    fo = vt.set,
    lo = vt.getterFor(uo),
    ho = d[uo],
    po = d.TypeError,
    vo = d.document,
    go = d.process,
    bo = d.fetch,
    yo = go && go.versions,
    mo = (yo && yo.v8) || '',
    wo = Qr.f,
    To = wo,
    Oo = 'process' == e(go),
    Eo = !!(vo && vo.createEvent && d.dispatchEvent),
    So = 'unhandledrejection',
    _o = 'rejectionhandled',
    Ro = 0,
    Lo = 1,
    jo = 2,
    Io = 1,
    Mo = 2,
    Po = $t(uo, function () {
      var t = ho.resolve(1),
        e = function () {},
        n = ((t.constructor = {})[co] = function (t) {
          t(e, e);
        });
      return !(
        (Oo || 'function' == typeof PromiseRejectionEvent) &&
        (!x || t.finally) &&
        t.then(e) instanceof n &&
        0 !== mo.indexOf('6.6') &&
        -1 === Nr.indexOf('Chrome/66')
      );
    }),
    xo =
      Po ||
      !vr(function (t) {
        ho.all(t).catch(function () {});
      }),
    Ao = function (t) {
      var e;
      return !(!r(t) || 'function' != typeof (e = t.then)) && e;
    },
    Do = function (t, e, n) {
      if (!e.notified) {
        e.notified = !0;
        var r = e.reactions;
        Jr(function () {
          for (
            var o = e.value,
              i = e.state == Lo,
              u = 0,
              s = function (n) {
                var r,
                  u,
                  s,
                  c = i ? n.ok : n.fail,
                  a = n.resolve,
                  f = n.reject,
                  l = n.domain;
                try {
                  if (c) {
                    if (!i) {
                      e.rejection === Mo && Co(t, e);
                      e.rejection = Io;
                    }
                    if (!0 === c) r = o;
                    else {
                      l && l.enter();
                      r = c(o);
                      if (l) {
                        l.exit();
                        s = !0;
                      }
                    }
                    r === n.promise
                      ? f(po('Promise-chain cycle'))
                      : (u = Ao(r))
                      ? u.call(r, a, f)
                      : a(r);
                  } else f(o);
                } catch (t) {
                  l && !s && l.exit();
                  f(t);
                }
              };
            r.length > u;

          )
            s(r[u++]);
          e.reactions = [];
          e.notified = !1;
          n && !e.rejection && ko(t, e);
        });
      }
    },
    $o = function (t, e, n) {
      var r, o;
      if (Eo) {
        (r = vo.createEvent('Event')).promise = e;
        r.reason = n;
        r.initEvent(t, !1, !0);
        d.dispatchEvent(r);
      } else r = { promise: e, reason: n };
      (o = d['on' + t]) ? o(r) : t === So && Zr('Unhandled promise rejection', n);
    },
    ko = function (t, e) {
      so.call(d, function () {
        var n,
          r = e.value;
        if (No(e)) {
          n = to(function () {
            Oo ? go.emit('unhandledRejection', r, t) : $o(So, t, r);
          });
          e.rejection = Oo || No(e) ? Mo : Io;
          if (n.error) throw n.value;
        }
      });
    },
    No = function (t) {
      return t.rejection !== Io && !t.parent;
    },
    Co = function (t, e) {
      so.call(d, function () {
        Oo ? go.emit('rejectionHandled', t) : $o(_o, t, e.value);
      });
    },
    Fo = function (t, e, n, r) {
      return function (o) {
        t(e, n, o, r);
      };
    },
    qo = function (t, e, n, r) {
      if (!e.done) {
        e.done = !0;
        r && (e = r);
        e.value = n;
        e.state = jo;
        Do(t, e, !0);
      }
    },
    zo = function (t, e, n, r) {
      if (!e.done) {
        e.done = !0;
        r && (e = r);
        try {
          if (t === n) throw po("Promise can't be resolved itself");
          var o = Ao(n);
          if (o)
            Jr(function () {
              var r = { done: !1 };
              try {
                o.call(n, Fo(zo, t, r, e), Fo(qo, t, r, e));
              } catch (n) {
                qo(t, r, n, e);
              }
            });
          else {
            e.value = n;
            e.state = Lo;
            Do(t, e, !1);
          }
        } catch (n) {
          qo(t, { done: !1 }, n, e);
        }
      }
    };
  if (Po) {
    ho = function (t) {
      sr(this, ho, uo);
      un(t);
      Gr.call(this);
      var e = ao(this);
      try {
        t(Fo(zo, this, e), Fo(qo, this, e));
      } catch (t) {
        qo(this, e, t);
      }
    };
    (Gr = function (t) {
      fo(this, {
        type: uo,
        done: !1,
        notified: !1,
        parent: !1,
        reactions: [],
        rejection: !1,
        state: Ro,
        value: void 0,
      });
    }).prototype = eo(ho.prototype, {
      then: function (t, e) {
        var n = lo(this),
          r = wo(br(this, ho));
        r.ok = 'function' != typeof t || t;
        r.fail = 'function' == typeof e && e;
        r.domain = Oo ? go.domain : void 0;
        n.parent = !0;
        n.reactions.push(r);
        n.state != Ro && Do(this, n, !1);
        return r.promise;
      },
      catch: function (t) {
        return this.then(void 0, t);
      },
    });
    Wr = function () {
      var t = new Gr(),
        e = ao(t);
      this.promise = t;
      this.resolve = Fo(zo, t, e);
      this.reject = Fo(qo, t, e);
    };
    Qr.f = wo = function (t) {
      return t === ho || t === Yr ? new Wr(t) : To(t);
    };
    x ||
      'function' != typeof bo ||
      Nt(
        { global: !0, enumerable: !0, forced: !0 },
        {
          fetch: function (t) {
            return Xr(ho, bo.apply(d, arguments));
          },
        }
      );
  }
  Nt({ global: !0, wrap: !0, forced: Po }, { Promise: ho });
  Zt(ho, uo, !1, !0);
  io(uo);
  Yr = ee[uo];
  Nt(
    { target: uo, stat: !0, forced: Po },
    {
      reject: function (t) {
        var e = wo(this);
        e.reject.call(void 0, t);
        return e.promise;
      },
    }
  );
  Nt(
    { target: uo, stat: !0, forced: x || Po },
    {
      resolve: function (t) {
        return Xr(x && this === Yr ? ho : this, t);
      },
    }
  );
  Nt(
    { target: uo, stat: !0, forced: xo },
    {
      all: function (t) {
        var e = this,
          n = wo(e),
          r = n.resolve,
          o = n.reject,
          i = to(function () {
            var n = [],
              i = 0,
              u = 1;
            bn(t, function (t) {
              var s = i++,
                c = !1;
              n.push(void 0);
              u++;
              e.resolve(t).then(function (t) {
                if (!c) {
                  c = !0;
                  n[s] = t;
                  --u || r(n);
                }
              }, o);
            });
            --u || r(n);
          });
        i.error && o(i.value);
        return n.promise;
      },
      race: function (t) {
        var e = this,
          n = wo(e),
          r = n.reject,
          o = to(function () {
            bn(t, function (t) {
              e.resolve(t).then(n.resolve, r);
            });
          });
        o.error && r(o.value);
        return n.promise;
      },
    }
  );
  Nt(
    { target: 'Promise', proto: !0, real: !0 },
    {
      finally: function (t) {
        var e = br(this, ro('Promise')),
          n = 'function' == typeof t;
        return this.then(
          n
            ? function (n) {
                return Xr(e, t()).then(function () {
                  return n;
                });
              }
            : t,
          n
            ? function (n) {
                return Xr(e, t()).then(function () {
                  throw n;
                });
              }
            : t
        );
      },
    }
  );
  ee.Promise;
  !(function () {
    if ('object' == typeof window)
      if (
        'IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window &&
        'intersectionRatio' in window.IntersectionObserverEntry.prototype
      )
        'isIntersecting' in window.IntersectionObserverEntry.prototype ||
          Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
            get: function () {
              return this.intersectionRatio > 0;
            },
          });
      else {
        var t = (function (t) {
            for (var e = window.document, n = o(e); n; ) n = o((e = n.ownerDocument));
            return e;
          })(),
          e = [],
          n = null,
          r = null;
        u.prototype.THROTTLE_TIMEOUT = 100;
        u.prototype.POLL_INTERVAL = null;
        u.prototype.USE_MUTATION_OBSERVER = !0;
        u._setupCrossOriginUpdater = function () {
          n ||
            (n = function (t, n) {
              r = t && n ? v(t, n) : p();
              e.forEach(function (t) {
                t._checkForIntersections();
              });
            });
          return n;
        };
        u._resetCrossOriginUpdater = function () {
          n = null;
          r = null;
        };
        u.prototype.observe = function (t) {
          if (
            !this._observationTargets.some(function (e) {
              return e.element == t;
            })
          ) {
            if (!t || 1 != t.nodeType) throw new Error('target must be an Element');
            this._registerInstance();
            this._observationTargets.push({ element: t, entry: null });
            this._monitorIntersections(t.ownerDocument);
            this._checkForIntersections();
          }
        };
        u.prototype.unobserve = function (t) {
          this._observationTargets = this._observationTargets.filter(function (e) {
            return e.element != t;
          });
          this._unmonitorIntersections(t.ownerDocument);
          0 == this._observationTargets.length && this._unregisterInstance();
        };
        u.prototype.disconnect = function () {
          this._observationTargets = [];
          this._unmonitorAllIntersections();
          this._unregisterInstance();
        };
        u.prototype.takeRecords = function () {
          var t = this._queuedEntries.slice();
          this._queuedEntries = [];
          return t;
        };
        u.prototype._initThresholds = function (t) {
          var e = t || [0];
          Array.isArray(e) || (e = [e]);
          return e.sort().filter(function (t, e, n) {
            if ('number' != typeof t || isNaN(t) || t < 0 || t > 1)
              throw new Error('threshold must be a number between 0 and 1 inclusively');
            return t !== n[e - 1];
          });
        };
        u.prototype._parseRootMargin = function (t) {
          var e = (t || '0px').split(/\s+/).map(function (t) {
            var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
            if (!e) throw new Error('rootMargin must be specified in pixels or percent');
            return { value: parseFloat(e[1]), unit: e[2] };
          });
          e[1] = e[1] || e[0];
          e[2] = e[2] || e[0];
          e[3] = e[3] || e[1];
          return e;
        };
        u.prototype._monitorIntersections = function (e) {
          var n = e.defaultView;
          if (n && -1 == this._monitoringDocuments.indexOf(e)) {
            var r = this._checkForIntersections,
              i = null,
              u = null;
            if (this.POLL_INTERVAL) i = n.setInterval(r, this.POLL_INTERVAL);
            else {
              a(n, 'resize', r, !0);
              a(e, 'scroll', r, !0);
              this.USE_MUTATION_OBSERVER &&
                'MutationObserver' in n &&
                (u = new n.MutationObserver(r)).observe(e, {
                  attributes: !0,
                  childList: !0,
                  characterData: !0,
                  subtree: !0,
                });
            }
            this._monitoringDocuments.push(e);
            this._monitoringUnsubscribes.push(function () {
              var t = e.defaultView;
              if (t) {
                i && t.clearInterval(i);
                f(t, 'resize', r, !0);
              }
              f(e, 'scroll', r, !0);
              u && u.disconnect();
            });
            if (e != ((this.root && this.root.ownerDocument) || t)) {
              var s = o(e);
              s && this._monitorIntersections(s.ownerDocument);
            }
          }
        };
        u.prototype._unmonitorIntersections = function (e) {
          var n = this._monitoringDocuments.indexOf(e);
          if (-1 != n) {
            var r = (this.root && this.root.ownerDocument) || t,
              i = this._observationTargets.some(function (t) {
                var n = t.element.ownerDocument;
                if (n == e) return !0;
                for (; n && n != r; ) {
                  var i = o(n);
                  if ((n = i && i.ownerDocument) == e) return !0;
                }
                return !1;
              });
            if (!i) {
              var u = this._monitoringUnsubscribes[n];
              this._monitoringDocuments.splice(n, 1);
              this._monitoringUnsubscribes.splice(n, 1);
              u();
              if (e != r) {
                var s = o(e);
                s && this._unmonitorIntersections(s.ownerDocument);
              }
            }
          }
        };
        u.prototype._unmonitorAllIntersections = function () {
          var t = this._monitoringUnsubscribes.slice(0);
          this._monitoringDocuments.length = 0;
          this._monitoringUnsubscribes.length = 0;
          for (var e = 0; e < t.length; e++) t[e]();
        };
        u.prototype._checkForIntersections = function () {
          if (this.root || !n || r) {
            var t = this._rootIsInDom(),
              e = t ? this._getRootRect() : p();
            this._observationTargets.forEach(function (r) {
              var o = r.element,
                u = h(o),
                c = this._rootContainsTarget(o),
                a = r.entry,
                f = t && c && this._computeTargetAndRootIntersection(o, u, e),
                l = (r.entry = new i({
                  time: s(),
                  target: o,
                  boundingClientRect: u,
                  rootBounds: n && !this.root ? null : e,
                  intersectionRect: f,
                }));
              a
                ? t && c
                  ? this._hasCrossedThreshold(a, l) && this._queuedEntries.push(l)
                  : a && a.isIntersecting && this._queuedEntries.push(l)
                : this._queuedEntries.push(l);
            }, this);
            this._queuedEntries.length && this._callback(this.takeRecords(), this);
          }
        };
        u.prototype._computeTargetAndRootIntersection = function (e, o, i) {
          if ('none' != window.getComputedStyle(e).display) {
            for (var u = o, s = b(e), c = !1; !c && s; ) {
              var a = null,
                f = 1 == s.nodeType ? window.getComputedStyle(s) : {};
              if ('none' == f.display) return null;
              if (s == this.root || 9 == s.nodeType) {
                c = !0;
                if (s == this.root || s == t)
                  if (n && !this.root)
                    if (!r || (0 == r.width && 0 == r.height)) {
                      s = null;
                      a = null;
                      u = null;
                    } else a = r;
                  else a = i;
                else {
                  var p = b(s),
                    d = p && h(p),
                    g = p && this._computeTargetAndRootIntersection(p, d, i);
                  if (d && g) {
                    s = p;
                    a = v(d, g);
                  } else {
                    s = null;
                    u = null;
                  }
                }
              } else {
                var y = s.ownerDocument;
                s != y.body && s != y.documentElement && 'visible' != f.overflow && (a = h(s));
              }
              a && (u = l(a, u));
              if (!u) break;
              s = s && b(s);
            }
            return u;
          }
        };
        u.prototype._getRootRect = function () {
          var e;
          if (this.root) e = h(this.root);
          else {
            var n = t.documentElement,
              r = t.body;
            e = {
              top: 0,
              left: 0,
              right: n.clientWidth || r.clientWidth,
              width: n.clientWidth || r.clientWidth,
              bottom: n.clientHeight || r.clientHeight,
              height: n.clientHeight || r.clientHeight,
            };
          }
          return this._expandRectByRootMargin(e);
        };
        u.prototype._expandRectByRootMargin = function (t) {
          var e = this._rootMarginValues.map(function (e, n) {
              return 'px' == e.unit ? e.value : (e.value * (n % 2 ? t.width : t.height)) / 100;
            }),
            n = {
              top: t.top - e[0],
              right: t.right + e[1],
              bottom: t.bottom + e[2],
              left: t.left - e[3],
            };
          n.width = n.right - n.left;
          n.height = n.bottom - n.top;
          return n;
        };
        u.prototype._hasCrossedThreshold = function (t, e) {
          var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
            r = e.isIntersecting ? e.intersectionRatio || 0 : -1;
          if (n !== r)
            for (var o = 0; o < this.thresholds.length; o++) {
              var i = this.thresholds[o];
              if (i == n || i == r || i < n != i < r) return !0;
            }
        };
        u.prototype._rootIsInDom = function () {
          return !this.root || g(t, this.root);
        };
        u.prototype._rootContainsTarget = function (e) {
          return g(this.root || t, e) && (!this.root || this.root.ownerDocument == e.ownerDocument);
        };
        u.prototype._registerInstance = function () {
          e.indexOf(this) < 0 && e.push(this);
        };
        u.prototype._unregisterInstance = function () {
          var t = e.indexOf(this);
          -1 != t && e.splice(t, 1);
        };
        window.IntersectionObserver = u;
        window.IntersectionObserverEntry = i;
      }
    function o(t) {
      try {
        return (t.defaultView && t.defaultView.frameElement) || null;
      } catch (t) {
        return null;
      }
    }
    function i(t) {
      this.time = t.time;
      this.target = t.target;
      this.rootBounds = d(t.rootBounds);
      this.boundingClientRect = d(t.boundingClientRect);
      this.intersectionRect = d(t.intersectionRect || p());
      this.isIntersecting = !!t.intersectionRect;
      var e = this.boundingClientRect,
        n = e.width * e.height,
        r = this.intersectionRect,
        o = r.width * r.height;
      this.intersectionRatio = n ? Number((o / n).toFixed(4)) : this.isIntersecting ? 1 : 0;
    }
    function u(t, e) {
      var n = e || {};
      if ('function' != typeof t) throw new Error('callback must be a function');
      if (n.root && 1 != n.root.nodeType) throw new Error('root must be an Element');
      this._checkForIntersections = c(
        this._checkForIntersections.bind(this),
        this.THROTTLE_TIMEOUT
      );
      this._callback = t;
      this._observationTargets = [];
      this._queuedEntries = [];
      this._rootMarginValues = this._parseRootMargin(n.rootMargin);
      this.thresholds = this._initThresholds(n.threshold);
      this.root = n.root || null;
      this.rootMargin = this._rootMarginValues
        .map(function (t) {
          return t.value + t.unit;
        })
        .join(' ');
      this._monitoringDocuments = [];
      this._monitoringUnsubscribes = [];
    }
    function s() {
      return window.performance && performance.now && performance.now();
    }
    function c(t, e) {
      var n = null;
      return function () {
        n ||
          (n = setTimeout(function () {
            t();
            n = null;
          }, e));
      };
    }
    function a(t, e, n, r) {
      'function' == typeof t.addEventListener
        ? t.addEventListener(e, n, r || !1)
        : 'function' == typeof t.attachEvent && t.attachEvent('on' + e, n);
    }
    function f(t, e, n, r) {
      'function' == typeof t.removeEventListener
        ? t.removeEventListener(e, n, r || !1)
        : 'function' == typeof t.detatchEvent && t.detatchEvent('on' + e, n);
    }
    function l(t, e) {
      var n = Math.max(t.top, e.top),
        r = Math.min(t.bottom, e.bottom),
        o = Math.max(t.left, e.left),
        i = Math.min(t.right, e.right),
        u = i - o,
        s = r - n;
      return (
        (u >= 0 && s >= 0 && { top: n, bottom: r, left: o, right: i, width: u, height: s }) || null
      );
    }
    function h(t) {
      var e;
      try {
        e = t.getBoundingClientRect();
      } catch (t) {}
      if (!e) return p();
      (e.width && e.height) ||
        (e = {
          top: e.top,
          right: e.right,
          bottom: e.bottom,
          left: e.left,
          width: e.right - e.left,
          height: e.bottom - e.top,
        });
      return e;
    }
    function p() {
      return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
    }
    function d(t) {
      return !t || 'x' in t
        ? t
        : {
            top: t.top,
            y: t.top,
            bottom: t.bottom,
            left: t.left,
            x: t.left,
            right: t.right,
            width: t.width,
            height: t.height,
          };
    }
    function v(t, e) {
      var n = e.top - t.top,
        r = e.left - t.left;
      return {
        top: n,
        left: r,
        height: e.height,
        width: e.width,
        bottom: n + e.height,
        right: r + e.width,
      };
    }
    function g(t, e) {
      for (var n = e; n; ) {
        if (n == t) return !0;
        n = b(n);
      }
      return !1;
    }
    function b(e) {
      var n = e.parentNode;
      return 9 == e.nodeType && e != t
        ? o(e)
        : n && 11 == n.nodeType && n.host
        ? n.host
        : n && n.assignedSlot
        ? n.assignedSlot.parentNode
        : n;
    }
  })();
  var Vo = R(function (t) {
    !(function () {
      function t(e, n, r) {
        function o(u, s) {
          if (!n[u]) {
            if (!e[u]) {
              var c = 'function' == typeof S && S;
              if (!s && c) return c(u, !0);
              if (i) return i(u, !0);
              var a = new Error("Cannot find module '" + u + "'");
              throw ((a.code = 'MODULE_NOT_FOUND'), a);
            }
            var f = (n[u] = { exports: {} });
            e[u][0].call(
              f.exports,
              function (t) {
                return o(e[u][1][t] || t);
              },
              f,
              f.exports,
              t,
              e,
              n,
              r
            );
          }
          return n[u].exports;
        }
        for (var i = 'function' == typeof S && S, u = 0; u < r.length; u++) o(r[u]);
        return o;
      }
      return t;
    })()(
      {
        1: [
          function (t, e, n) {
            Object.defineProperty(n, '__esModule', { value: !0 });
            var r = function (t) {
              if ('getBBox' in t) {
                var e = t.getBBox();
                return Object.freeze({ height: e.height, left: 0, top: 0, width: e.width });
              }
              var n = window.getComputedStyle(t);
              return Object.freeze({
                height: parseFloat(n.height || '0'),
                left: parseFloat(n.paddingLeft || '0'),
                top: parseFloat(n.paddingTop || '0'),
                width: parseFloat(n.width || '0'),
              });
            };
            n.ContentRect = r;
          },
          {},
        ],
        2: [
          function (t, e, n) {
            Object.defineProperty(n, '__esModule', { value: !0 });
            var r = t('./ContentRect'),
              o = (function () {
                function t(t) {
                  this.target = t;
                  this.$$broadcastWidth = this.$$broadcastHeight = 0;
                }
                Object.defineProperty(t.prototype, 'broadcastWidth', {
                  get: function () {
                    return this.$$broadcastWidth;
                  },
                  enumerable: !0,
                  configurable: !0,
                });
                Object.defineProperty(t.prototype, 'broadcastHeight', {
                  get: function () {
                    return this.$$broadcastHeight;
                  },
                  enumerable: !0,
                  configurable: !0,
                });
                t.prototype.isActive = function () {
                  var t = r.ContentRect(this.target);
                  return (
                    !!t && (t.width !== this.broadcastWidth || t.height !== this.broadcastHeight)
                  );
                };
                return t;
              })();
            n.ResizeObservation = o;
          },
          { './ContentRect': 1 },
        ],
        3: [
          function (t, e, n) {
            Object.defineProperty(n, '__esModule', { value: !0 });
            var r = t('./ResizeObservation'),
              o = t('./ResizeObserverEntry'),
              i = [],
              u = (function () {
                function t(t) {
                  this.$$observationTargets = [];
                  this.$$activeTargets = [];
                  this.$$skippedTargets = [];
                  var e = a(t);
                  if (e) throw TypeError(e);
                  this.$$callback = t;
                }
                t.prototype.observe = function (t) {
                  var e = f('observe', t);
                  if (e) throw TypeError(e);
                  if (!(l(this.$$observationTargets, t) >= 0)) {
                    this.$$observationTargets.push(new r.ResizeObservation(t));
                    s(this);
                  }
                };
                t.prototype.unobserve = function (t) {
                  var e = f('unobserve', t);
                  if (e) throw TypeError(e);
                  var n = l(this.$$observationTargets, t);
                  if (!(n < 0)) {
                    this.$$observationTargets.splice(n, 1);
                    0 === this.$$observationTargets.length && c(this);
                  }
                };
                t.prototype.disconnect = function () {
                  this.$$observationTargets = [];
                  this.$$activeTargets = [];
                  c(this);
                };
                return t;
              })();
            n.ResizeObserver = u;
            function s(t) {
              if (i.indexOf(t) < 0) {
                i.push(t);
                w();
              }
            }
            function c(t) {
              var e = i.indexOf(t);
              if (e >= 0) {
                i.splice(e, 1);
                O();
              }
            }
            function a(t) {
              return void 0 === t
                ? "Failed to construct 'ResizeObserver': 1 argument required, but only 0 present."
                : 'function' != typeof t
                ? "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function."
                : void 0;
            }
            function f(t, e) {
              return void 0 === e
                ? "Failed to execute '" +
                    t +
                    "' on 'ResizeObserver': 1 argument required, but only 0 present."
                : e && e.nodeType === window.Node.ELEMENT_NODE
                ? void 0
                : "Failed to execute '" +
                  t +
                  "' on 'ResizeObserver': parameter 1 is not of type 'Element'.";
            }
            function l(t, e) {
              for (var n = 0; n < t.length; n += 1) if (t[n].target === e) return n;
              return -1;
            }
            var h = function (t) {
                i.forEach(function (e) {
                  e.$$activeTargets = [];
                  e.$$skippedTargets = [];
                  e.$$observationTargets.forEach(function (n) {
                    if (n.isActive()) {
                      y(n.target) > t ? e.$$activeTargets.push(n) : e.$$skippedTargets.push(n);
                    }
                  });
                });
              },
              p = function () {
                return i.some(function (t) {
                  return !!t.$$activeTargets.length;
                });
              },
              d = function () {
                return i.some(function (t) {
                  return !!t.$$skippedTargets.length;
                });
              },
              v = function () {
                var t = 1 / 0;
                i.forEach(function (e) {
                  if (e.$$activeTargets.length) {
                    var n = [];
                    e.$$activeTargets.forEach(function (e) {
                      var r = new o.ResizeObserverEntry(e.target);
                      n.push(r);
                      e.$$broadcastWidth = r.contentRect.width;
                      e.$$broadcastHeight = r.contentRect.height;
                      var i = y(e.target);
                      i < t && (t = i);
                    });
                    e.$$callback(n, e);
                    e.$$activeTargets = [];
                  }
                });
                return t;
              };
            !(function () {
              if ('function' == typeof window.ErrorEvent) return !1;
              function t(t, e) {
                e = e || { bubbles: !1, cancelable: !1, detail: null };
                var n = document.createEvent('CustomEvent');
                n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail);
                return n;
              }
              window.ErrorEvent = t;
            })();
            var g,
              b = function () {
                var t = new window.ErrorEvent('ResizeLoopError', {
                  message: 'ResizeObserver loop completed with undelivered notifications.',
                });
                window.dispatchEvent(t);
              },
              y = function (t) {
                for (var e = 0; t.parentNode; ) {
                  t = t.parentNode;
                  e += 1;
                }
                return e;
              },
              m = function () {
                var t = 0;
                h(t);
                for (; p(); ) {
                  t = v();
                  h(t);
                }
                d() && b();
              },
              w = function () {
                g || T();
              },
              T = function t() {
                g = window.requestAnimationFrame(function () {
                  m();
                  t();
                });
              },
              O = function () {
                if (
                  g &&
                  !i.some(function (t) {
                    return !!t.$$observationTargets.length;
                  })
                ) {
                  window.cancelAnimationFrame(g);
                  g = void 0;
                }
              },
              E = function () {
                return (window.ResizeObserver = u);
              };
            n.install = E;
          },
          { './ResizeObservation': 2, './ResizeObserverEntry': 4 },
        ],
        4: [
          function (t, e, n) {
            Object.defineProperty(n, '__esModule', { value: !0 });
            var r = t('./ContentRect'),
              o = (function () {
                function t(t) {
                  this.target = t;
                  this.contentRect = r.ContentRect(t);
                }
                return t;
              })();
            n.ResizeObserverEntry = o;
          },
          { './ContentRect': 1 },
        ],
        5: [
          function (t, e, n) {
            Object.defineProperty(n, '__esModule', { value: !0 });
            t('./ResizeObserver').install();
          },
          { './ResizeObserver': 3 },
        ],
      },
      {},
      [5]
    );
  });
  _(Vo);
  void 0 === window.hubspot && (window.hubspot = {});
  'object' != typeof window.hubspot.polyfills && (window.hubspot.polyfills = {});
  window.hubspot.polyfills.__INSTALLED = !0;
})();
var globalRoot,
  hns =
    ((globalRoot =
      'undefined' != typeof window && null !== window
        ? window
        : 'undefined' != typeof global && null !== global
        ? global
        : this).hns =
    globalRoot.hns2 =
      function (t, e) {
        var n,
          r,
          o,
          i,
          u = t.split('.'),
          s = globalRoot,
          c = '',
          a = u.length - 1;
        e = e || {};
        n = u[a];
        for (var f = 0; f < a; f++) {
          s[(c = u[f])] = s[c] || {};
          s = s[c];
        }
        if (s[n] && e !== s[n]) {
          r = s[n];
          o = [];
          for (var l in e)
            if (e.hasOwnProperty(l))
              if ('object' == typeof r[l]) {
                e[l] !== r[l] && o.push({ qSource: e[l], qTarget: r[l] });
                for (; o.length > 0; ) {
                  i = o.shift();
                  for (var h in i.qSource)
                    i.qSource.hasOwnProperty(h) &&
                      ('object' != typeof i.qSource[h] ||
                      'object' != typeof i.qTarget[h] ||
                      (i.qSource[h] &&
                        void 0 !== i.qSource[h].classList &&
                        void 0 !== i.qSource[h].nodeType)
                        ? (i.qTarget[h] = i.qSource[h])
                        : i.qSource[h] !== i.qTarget[h] &&
                          o.push({ qSource: i.qSource[h], qTarget: i.qTarget[h] }));
                }
              } else r[l] = e[l];
        } else s[n] = e;
        'undefined' != typeof hubspot &&
          hubspot.updateDependencies &&
          hubspot.updateDependencies(t);
        return s[n];
      });
hns('hubspot');
!(function () {
  'undefined' != typeof hubspot &&
    null !== hubspot &&
    hubspot.define &&
    console.warn("hubspot.define included more than once, you most certainly _don't_ want this");
  hubspot = hubspot || {};
  hubspot.modules = hubspot.modules || {};
  var t = [],
    e = {},
    n = {},
    r = {},
    o = {},
    i = '<hubspot.require>',
    u = 1;
  hubspot.modules.useGlobals = function (t) {
    return !0;
  };
  hubspot.modules.getNamespace = function (t) {
    if (n[t]) return n[t];
    if (!hubspot.modules.useGlobals(t)) return null;
    var e,
      r = t.split('.'),
      o = r.length,
      i = window;
    for (e = 0; e < o && (i = i[r[e]]); ++e);
    return i;
  };
  hubspot.getDeferredModules = function () {
    return t;
  };
  hubspot.getIdleModules = function () {
    return e;
  };
  hubspot.getLoadedModules = function () {
    return n;
  };
  hubspot.getErroredModules = function () {
    return r;
  };
  hubspot.getAllModuleDefinitions = function () {
    return o;
  };
  var s = function () {
    return i.replace('>', ' ' + u++ + '>');
  };
  hubspot.getBlockingModules = function () {
    for (var e, n = t, r = [], o = {}, i = {}, u = n.length; u--; ) {
      var s = n[u];
      if (s && s.deps) {
        i[s.ns] = !0;
        for (var c = s.deps.length; c--; ) o[s.deps[c]] = !0;
      }
    }
    for (e in o) i[e] || r.push(e);
    return r;
  };
  function c() {
    var t;
    if (void 0 !== hubspot._cached_debug_define_enabled)
      return hubspot._cached_debug_define_enabled;
    if (!0 === window.HUBSPOT_DEBUG_DEFINE) t = !0;
    else {
      var e = 'test';
      try {
        localStorage.setItem(e, e);
        localStorage.removeItem(e);
        t = 'true' === localStorage.HUBSPOT_DEBUG_DEFINE;
      } catch (e) {
        t = !1;
      }
    }
    hubspot._cached_debug_define_enabled = t;
    return t;
  }
  function a(t) {
    var e,
      n,
      o = [],
      u = t.allDeps;
    for (e = 0; e < u.length; e++) o[e] = hubspot.modules.getNamespace(u[e]);
    try {
      n = 'function' == typeof t.module ? t.module.apply(this, o) : t.module;
    } catch (e) {
      var s = t.ns || i;
      r[s] = !0;
      if (c()) throw e;
      setTimeout(function () {
        s.length > 0 && console.log('Error while defining hubspot module:', s);
        throw e;
      }, 0);
      return;
    }
    return n;
  }
  function f(t) {
    var e;
    e = a(t);
    if (t.ns) {
      n[t.ns] = e;
      hubspot.modules.useGlobals(t.ns) ? window.hns2(t.ns, e) : hubspot.updateDependencies(t.ns);
    }
  }
  hubspot.updateDependencies = function (e) {
    var n,
      r,
      o,
      i,
      u = [];
    for (o = 0; o < t.length; o++)
      if ((n = t[o]).depsDict[e]) {
        delete n.depsDict[e];
        r = n.deps;
        for (i = 0; i < r.length; i++)
          if (r[i] === e) {
            r.splice(i, 1);
            break;
          }
        if (0 === r.length) {
          t.splice(o, 1);
          u.push(n);
          o--;
        }
      }
    for (o = 0; o < u.length; o++) f(u[o]);
  };
  function l(e) {
    var n;
    for (n = 0; n < t.length; n++) if (t[n].depsDict[e]) return !0;
    return !1;
  }
  function h(n, r) {
    for (var o, i, u = r.deps, s = r.depsDict, c = u.length, a = []; c--; ) {
      i = u[c];
      if (hubspot.modules.getNamespace(i)) {
        u.splice(c, 1);
        delete s[i];
      }
      e[i] && a.push(i);
    }
    u.length > 0 ? t.push(r) : f(r);
    for (c = 0; c < a.length; c++) {
      i = a[c];
      if ((o = e[i])) {
        delete e[i];
        h(i, o);
      }
    }
  }
  function p(t) {
    return {
      fileName: t.getFileName(),
      lineNumber: t.getLineNumber(),
      columnNumber: t.getColumnNumber(),
      functionName: t.getFunctionName(),
    };
  }
  function d() {
    if (!Error.captureStackTrace) return new Error().stack;
    var t = Error.prepareStackTrace;
    try {
      Error.prepareStackTrace = function (t, e) {
        return e;
      };
      var e = new Error();
      Error.captureStackTrace(e);
      var n = e.stack,
        r =
          (n[0].getFileName(),
          n
            .slice(2)
            .map(p)
            .filter(function (t) {
              return (
                !t.functionName ||
                (0 !== t.functionName.indexOf('hubspot.define') &&
                  0 !== t.functionName.indexOf('hubspot.require'))
              );
            }));
      return r.length > 0 ? r : null;
    } catch (t) {
      return null;
    } finally {
      Error.prepareStackTrace = t;
    }
  }
  hubspot.defineHelper = function (t, r, i, u) {
    var a,
      f,
      p,
      v = {};
    c() && (p = d());
    if ('string' == typeof r)
      throw new Error(
        'hubspot.define/require must be provided an array of dependencies, not a string'
      );
    if ('boolean' != typeof u)
      throw new Error('hubspot.defineHelper must be called with the isEagerDefinition flag');
    if (void 0 !== n[t]) {
      if ('function' != typeof i)
        throw new Error(
          "You cannot redefine a module with hubspot.define, '" +
            t +
            "' has already been defined once."
        );
      console.warn(
        "You should not redefine a module with hubspot.define, '" +
          t +
          "' has already been defined once."
      );
    }
    for (var g = 0; g < r.length; g++) v[(f = r[g])] = f;
    a = { ns: t, allDeps: r.slice(), deps: r, depsDict: v, module: i, stack: p };
    o[t || s()] = a;
    null == t || u || l(t) ? h(t, a) : (e[t] = a);
  };
  hubspot.defineEager = function (t, e, n) {
    hubspot.defineHelper(t, e, n, !0);
  };
  hubspot.defineLazy = function (t, e, n) {
    hubspot.defineHelper(t, e, n, !1);
  };
  hubspot.define = hubspot.defineEager;
  hubspot.require = function (t, e) {
    hubspot.defineEager(null, t, e);
  };
  hubspot.requireSync = function (t) {
    var e;
    hubspot.require([t], function (t) {
      e = t;
    });
    if (!e) throw new Error(t + ' has not been defined with hubspot.define or is blocked');
    return e;
  };
})();
!(function () {
  var t = [],
    e = [];
  window.addEventListener('unhandledrejection', function (n) {
    e.push(n.promise);
    t.push(n.reason);
  });
  window.addEventListener('rejectionhandled', function (n) {
    var r = n.promise,
      o = e.indexOf(r);
    if (-1 !== o) {
      e.splice(o, 1);
      t.splice(o, 1);
    }
  });
  hubspot.getUnhandledReasons = function () {
    return t.slice();
  };
})();
hubspot.define = hubspot.defineLazy;
//# sourceMappingURL=//static.hsappstatic.net/SignalsExtension/static-2.32769/js/popup-before.js.map
