/*! For license information please see background.js.LICENSE.txt */
(() => {
  var e = {
      23: function (e, t, n) {
        'use strict';
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.DomHandler = void 0);
        var o = n(811),
          a = n(511);
        i(n(511), t);
        var s = { withStartIndices: !1, withEndIndices: !1, xmlMode: !1 },
          c = (function () {
            function e(e, t, n) {
              (this.dom = []),
                (this.root = new a.Document(this.dom)),
                (this.done = !1),
                (this.tagStack = [this.root]),
                (this.lastNode = null),
                (this.parser = null),
                'function' == typeof t && ((n = t), (t = s)),
                'object' == typeof e && ((t = e), (e = void 0)),
                (this.callback = null != e ? e : null),
                (this.options = null != t ? t : s),
                (this.elementCB = null != n ? n : null);
            }
            return (
              (e.prototype.onparserinit = function (e) {
                this.parser = e;
              }),
              (e.prototype.onreset = function () {
                (this.dom = []),
                  (this.root = new a.Document(this.dom)),
                  (this.done = !1),
                  (this.tagStack = [this.root]),
                  (this.lastNode = null),
                  (this.parser = null);
              }),
              (e.prototype.onend = function () {
                this.done || ((this.done = !0), (this.parser = null), this.handleCallback(null));
              }),
              (e.prototype.onerror = function (e) {
                this.handleCallback(e);
              }),
              (e.prototype.onclosetag = function () {
                this.lastNode = null;
                var e = this.tagStack.pop();
                this.options.withEndIndices && (e.endIndex = this.parser.endIndex),
                  this.elementCB && this.elementCB(e);
              }),
              (e.prototype.onopentag = function (e, t) {
                var n = this.options.xmlMode ? o.ElementType.Tag : void 0,
                  r = new a.Element(e, t, void 0, n);
                this.addNode(r), this.tagStack.push(r);
              }),
              (e.prototype.ontext = function (e) {
                var t = this.lastNode;
                if (t && t.type === o.ElementType.Text)
                  (t.data += e), this.options.withEndIndices && (t.endIndex = this.parser.endIndex);
                else {
                  var n = new a.Text(e);
                  this.addNode(n), (this.lastNode = n);
                }
              }),
              (e.prototype.oncomment = function (e) {
                if (this.lastNode && this.lastNode.type === o.ElementType.Comment)
                  this.lastNode.data += e;
                else {
                  var t = new a.Comment(e);
                  this.addNode(t), (this.lastNode = t);
                }
              }),
              (e.prototype.oncommentend = function () {
                this.lastNode = null;
              }),
              (e.prototype.oncdatastart = function () {
                var e = new a.Text(''),
                  t = new a.CDATA([e]);
                this.addNode(t), (e.parent = t), (this.lastNode = e);
              }),
              (e.prototype.oncdataend = function () {
                this.lastNode = null;
              }),
              (e.prototype.onprocessinginstruction = function (e, t) {
                var n = new a.ProcessingInstruction(e, t);
                this.addNode(n);
              }),
              (e.prototype.handleCallback = function (e) {
                if ('function' == typeof this.callback) this.callback(e, this.dom);
                else if (e) throw e;
              }),
              (e.prototype.addNode = function (e) {
                var t = this.tagStack[this.tagStack.length - 1],
                  n = t.children[t.children.length - 1];
                this.options.withStartIndices && (e.startIndex = this.parser.startIndex),
                  this.options.withEndIndices && (e.endIndex = this.parser.endIndex),
                  t.children.push(e),
                  n && ((e.prev = n), (n.next = e)),
                  (e.parent = t),
                  (this.lastNode = null);
              }),
              e
            );
          })();
        (t.DomHandler = c), (t.default = c);
      },
      31: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
        const n = /\n/g;
        function r(e) {
          const t = [...e.matchAll(n)].map(e => e.index || 0);
          t.unshift(-1);
          const r = i(t, 0, t.length);
          return e => o(r, e);
        }
        function i(e, t, n) {
          if (n - t == 1) return { offset: e[t], index: t + 1 };
          const r = Math.ceil((t + n) / 2),
            o = i(e, t, r),
            a = i(e, r, n);
          return { offset: o.offset, low: o, high: a };
        }
        function o(e, t) {
          return (function (e) {
            return Object.prototype.hasOwnProperty.call(e, 'index');
          })(e)
            ? { line: e.index, column: t - e.offset }
            : o(e.high.offset < t ? e.high : e.low, t);
        }
        function a(e, t) {
          return { ...e, regex: s(e, t) };
        }
        function s(e, t) {
          if (0 === e.name.length)
            throw new Error(`Rule #${t} has empty name, which is not allowed.`);
          if (
            (function (e) {
              return Object.prototype.hasOwnProperty.call(e, 'regex');
            })(e)
          )
            return (function (e) {
              if (e.global)
                throw new Error(
                  `Regular expression /${e.source}/${e.flags} contains the global flag, which is not allowed.`
                );
              return e.sticky ? e : new RegExp(e.source, e.flags + 'y');
            })(e.regex);
          if (
            (function (e) {
              return Object.prototype.hasOwnProperty.call(e, 'str');
            })(e)
          ) {
            if (0 === e.str.length)
              throw new Error(
                `Rule #${t} ("${e.name}") has empty "str" property, which is not allowed.`
              );
            return new RegExp(c(e.str), 'y');
          }
          return new RegExp(c(e.name), 'y');
        }
        function c(e) {
          return e.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&');
        }
        t.createLexer = function (e, t = '', n = {}) {
          const i = 'string' != typeof t ? t : n,
            o = 'string' == typeof t ? t : '',
            s = e.map(a),
            c = !!i.lineNumbers;
          return function (e, t = 0) {
            const n = c ? r(e) : () => ({ line: 0, column: 0 });
            let i = t;
            const a = [];
            e: for (; i < e.length; ) {
              let t = !1;
              for (const r of s) {
                r.regex.lastIndex = i;
                const s = r.regex.exec(e);
                if (s && s[0].length > 0) {
                  if (!r.discard) {
                    const e = n(i),
                      t =
                        'string' == typeof r.replace
                          ? s[0].replace(new RegExp(r.regex.source, r.regex.flags), r.replace)
                          : s[0];
                    a.push({
                      state: o,
                      name: r.name,
                      text: t,
                      offset: i,
                      len: s[0].length,
                      line: e.line,
                      column: e.column,
                    });
                  }
                  if (((i = r.regex.lastIndex), (t = !0), r.push)) {
                    const t = r.push(e, i);
                    a.push(...t.tokens), (i = t.offset);
                  }
                  if (r.pop) break e;
                  break;
                }
              }
              if (!t) break;
            }
            return { tokens: a, offset: i, complete: e.length <= i };
          };
        };
      },
      57: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = new Uint16Array(
            'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'
              .split('')
              .map(function (e) {
                return e.charCodeAt(0);
              })
          ));
      },
      184: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.QuoteType = void 0);
        var r,
          i,
          o,
          a = n(972);
        function s(e) {
          return (
            e === r.Space ||
            e === r.NewLine ||
            e === r.Tab ||
            e === r.FormFeed ||
            e === r.CarriageReturn
          );
        }
        function c(e) {
          return e === r.Slash || e === r.Gt || s(e);
        }
        function l(e) {
          return e >= r.Zero && e <= r.Nine;
        }
        !(function (e) {
          (e[(e.Tab = 9)] = 'Tab'),
            (e[(e.NewLine = 10)] = 'NewLine'),
            (e[(e.FormFeed = 12)] = 'FormFeed'),
            (e[(e.CarriageReturn = 13)] = 'CarriageReturn'),
            (e[(e.Space = 32)] = 'Space'),
            (e[(e.ExclamationMark = 33)] = 'ExclamationMark'),
            (e[(e.Number = 35)] = 'Number'),
            (e[(e.Amp = 38)] = 'Amp'),
            (e[(e.SingleQuote = 39)] = 'SingleQuote'),
            (e[(e.DoubleQuote = 34)] = 'DoubleQuote'),
            (e[(e.Dash = 45)] = 'Dash'),
            (e[(e.Slash = 47)] = 'Slash'),
            (e[(e.Zero = 48)] = 'Zero'),
            (e[(e.Nine = 57)] = 'Nine'),
            (e[(e.Semi = 59)] = 'Semi'),
            (e[(e.Lt = 60)] = 'Lt'),
            (e[(e.Eq = 61)] = 'Eq'),
            (e[(e.Gt = 62)] = 'Gt'),
            (e[(e.Questionmark = 63)] = 'Questionmark'),
            (e[(e.UpperA = 65)] = 'UpperA'),
            (e[(e.LowerA = 97)] = 'LowerA'),
            (e[(e.UpperF = 70)] = 'UpperF'),
            (e[(e.LowerF = 102)] = 'LowerF'),
            (e[(e.UpperZ = 90)] = 'UpperZ'),
            (e[(e.LowerZ = 122)] = 'LowerZ'),
            (e[(e.LowerX = 120)] = 'LowerX'),
            (e[(e.OpeningSquareBracket = 91)] = 'OpeningSquareBracket');
        })(r || (r = {})),
          (function (e) {
            (e[(e.Text = 1)] = 'Text'),
              (e[(e.BeforeTagName = 2)] = 'BeforeTagName'),
              (e[(e.InTagName = 3)] = 'InTagName'),
              (e[(e.InSelfClosingTag = 4)] = 'InSelfClosingTag'),
              (e[(e.BeforeClosingTagName = 5)] = 'BeforeClosingTagName'),
              (e[(e.InClosingTagName = 6)] = 'InClosingTagName'),
              (e[(e.AfterClosingTagName = 7)] = 'AfterClosingTagName'),
              (e[(e.BeforeAttributeName = 8)] = 'BeforeAttributeName'),
              (e[(e.InAttributeName = 9)] = 'InAttributeName'),
              (e[(e.AfterAttributeName = 10)] = 'AfterAttributeName'),
              (e[(e.BeforeAttributeValue = 11)] = 'BeforeAttributeValue'),
              (e[(e.InAttributeValueDq = 12)] = 'InAttributeValueDq'),
              (e[(e.InAttributeValueSq = 13)] = 'InAttributeValueSq'),
              (e[(e.InAttributeValueNq = 14)] = 'InAttributeValueNq'),
              (e[(e.BeforeDeclaration = 15)] = 'BeforeDeclaration'),
              (e[(e.InDeclaration = 16)] = 'InDeclaration'),
              (e[(e.InProcessingInstruction = 17)] = 'InProcessingInstruction'),
              (e[(e.BeforeComment = 18)] = 'BeforeComment'),
              (e[(e.CDATASequence = 19)] = 'CDATASequence'),
              (e[(e.InSpecialComment = 20)] = 'InSpecialComment'),
              (e[(e.InCommentLike = 21)] = 'InCommentLike'),
              (e[(e.BeforeSpecialS = 22)] = 'BeforeSpecialS'),
              (e[(e.SpecialStartSequence = 23)] = 'SpecialStartSequence'),
              (e[(e.InSpecialTag = 24)] = 'InSpecialTag'),
              (e[(e.BeforeEntity = 25)] = 'BeforeEntity'),
              (e[(e.BeforeNumericEntity = 26)] = 'BeforeNumericEntity'),
              (e[(e.InNamedEntity = 27)] = 'InNamedEntity'),
              (e[(e.InNumericEntity = 28)] = 'InNumericEntity'),
              (e[(e.InHexEntity = 29)] = 'InHexEntity');
          })(i || (i = {})),
          (function (e) {
            (e[(e.NoValue = 0)] = 'NoValue'),
              (e[(e.Unquoted = 1)] = 'Unquoted'),
              (e[(e.Single = 2)] = 'Single'),
              (e[(e.Double = 3)] = 'Double');
          })((o = t.QuoteType || (t.QuoteType = {})));
        var u = {
            Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
            CdataEnd: new Uint8Array([93, 93, 62]),
            CommentEnd: new Uint8Array([45, 45, 62]),
            ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
            StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
            TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
          },
          f = (function () {
            function e(e, t) {
              var n = e.xmlMode,
                r = void 0 !== n && n,
                o = e.decodeEntities,
                s = void 0 === o || o;
              (this.cbs = t),
                (this.state = i.Text),
                (this.buffer = ''),
                (this.sectionStart = 0),
                (this.index = 0),
                (this.baseState = i.Text),
                (this.isSpecial = !1),
                (this.running = !0),
                (this.offset = 0),
                (this.currentSequence = void 0),
                (this.sequenceIndex = 0),
                (this.trieIndex = 0),
                (this.trieCurrent = 0),
                (this.entityResult = 0),
                (this.entityExcess = 0),
                (this.xmlMode = r),
                (this.decodeEntities = s),
                (this.entityTrie = r ? a.xmlDecodeTree : a.htmlDecodeTree);
            }
            return (
              (e.prototype.reset = function () {
                (this.state = i.Text),
                  (this.buffer = ''),
                  (this.sectionStart = 0),
                  (this.index = 0),
                  (this.baseState = i.Text),
                  (this.currentSequence = void 0),
                  (this.running = !0),
                  (this.offset = 0);
              }),
              (e.prototype.write = function (e) {
                (this.offset += this.buffer.length), (this.buffer = e), this.parse();
              }),
              (e.prototype.end = function () {
                this.running && this.finish();
              }),
              (e.prototype.pause = function () {
                this.running = !1;
              }),
              (e.prototype.resume = function () {
                (this.running = !0), this.index < this.buffer.length + this.offset && this.parse();
              }),
              (e.prototype.getIndex = function () {
                return this.index;
              }),
              (e.prototype.getSectionStart = function () {
                return this.sectionStart;
              }),
              (e.prototype.stateText = function (e) {
                e === r.Lt || (!this.decodeEntities && this.fastForwardTo(r.Lt))
                  ? (this.index > this.sectionStart &&
                      this.cbs.ontext(this.sectionStart, this.index),
                    (this.state = i.BeforeTagName),
                    (this.sectionStart = this.index))
                  : this.decodeEntities && e === r.Amp && (this.state = i.BeforeEntity);
              }),
              (e.prototype.stateSpecialStartSequence = function (e) {
                var t = this.sequenceIndex === this.currentSequence.length;
                if (t ? c(e) : (32 | e) === this.currentSequence[this.sequenceIndex]) {
                  if (!t) return void this.sequenceIndex++;
                } else this.isSpecial = !1;
                (this.sequenceIndex = 0), (this.state = i.InTagName), this.stateInTagName(e);
              }),
              (e.prototype.stateInSpecialTag = function (e) {
                if (this.sequenceIndex === this.currentSequence.length) {
                  if (e === r.Gt || s(e)) {
                    var t = this.index - this.currentSequence.length;
                    if (this.sectionStart < t) {
                      var n = this.index;
                      (this.index = t), this.cbs.ontext(this.sectionStart, t), (this.index = n);
                    }
                    return (
                      (this.isSpecial = !1),
                      (this.sectionStart = t + 2),
                      void this.stateInClosingTagName(e)
                    );
                  }
                  this.sequenceIndex = 0;
                }
                (32 | e) === this.currentSequence[this.sequenceIndex]
                  ? (this.sequenceIndex += 1)
                  : 0 === this.sequenceIndex
                  ? this.currentSequence === u.TitleEnd
                    ? this.decodeEntities && e === r.Amp && (this.state = i.BeforeEntity)
                    : this.fastForwardTo(r.Lt) && (this.sequenceIndex = 1)
                  : (this.sequenceIndex = Number(e === r.Lt));
              }),
              (e.prototype.stateCDATASequence = function (e) {
                e === u.Cdata[this.sequenceIndex]
                  ? ++this.sequenceIndex === u.Cdata.length &&
                    ((this.state = i.InCommentLike),
                    (this.currentSequence = u.CdataEnd),
                    (this.sequenceIndex = 0),
                    (this.sectionStart = this.index + 1))
                  : ((this.sequenceIndex = 0),
                    (this.state = i.InDeclaration),
                    this.stateInDeclaration(e));
              }),
              (e.prototype.fastForwardTo = function (e) {
                for (; ++this.index < this.buffer.length + this.offset; )
                  if (this.buffer.charCodeAt(this.index - this.offset) === e) return !0;
                return (this.index = this.buffer.length + this.offset - 1), !1;
              }),
              (e.prototype.stateInCommentLike = function (e) {
                e === this.currentSequence[this.sequenceIndex]
                  ? ++this.sequenceIndex === this.currentSequence.length &&
                    (this.currentSequence === u.CdataEnd
                      ? this.cbs.oncdata(this.sectionStart, this.index, 2)
                      : this.cbs.oncomment(this.sectionStart, this.index, 2),
                    (this.sequenceIndex = 0),
                    (this.sectionStart = this.index + 1),
                    (this.state = i.Text))
                  : 0 === this.sequenceIndex
                  ? this.fastForwardTo(this.currentSequence[0]) && (this.sequenceIndex = 1)
                  : e !== this.currentSequence[this.sequenceIndex - 1] && (this.sequenceIndex = 0);
              }),
              (e.prototype.isTagStartChar = function (e) {
                return this.xmlMode
                  ? !c(e)
                  : (function (e) {
                      return (e >= r.LowerA && e <= r.LowerZ) || (e >= r.UpperA && e <= r.UpperZ);
                    })(e);
              }),
              (e.prototype.startSpecial = function (e, t) {
                (this.isSpecial = !0),
                  (this.currentSequence = e),
                  (this.sequenceIndex = t),
                  (this.state = i.SpecialStartSequence);
              }),
              (e.prototype.stateBeforeTagName = function (e) {
                if (e === r.ExclamationMark)
                  (this.state = i.BeforeDeclaration), (this.sectionStart = this.index + 1);
                else if (e === r.Questionmark)
                  (this.state = i.InProcessingInstruction), (this.sectionStart = this.index + 1);
                else if (this.isTagStartChar(e)) {
                  var t = 32 | e;
                  (this.sectionStart = this.index),
                    this.xmlMode || t !== u.TitleEnd[2]
                      ? (this.state =
                          this.xmlMode || t !== u.ScriptEnd[2] ? i.InTagName : i.BeforeSpecialS)
                      : this.startSpecial(u.TitleEnd, 3);
                } else
                  e === r.Slash
                    ? (this.state = i.BeforeClosingTagName)
                    : ((this.state = i.Text), this.stateText(e));
              }),
              (e.prototype.stateInTagName = function (e) {
                c(e) &&
                  (this.cbs.onopentagname(this.sectionStart, this.index),
                  (this.sectionStart = -1),
                  (this.state = i.BeforeAttributeName),
                  this.stateBeforeAttributeName(e));
              }),
              (e.prototype.stateBeforeClosingTagName = function (e) {
                s(e) ||
                  (e === r.Gt
                    ? (this.state = i.Text)
                    : ((this.state = this.isTagStartChar(e)
                        ? i.InClosingTagName
                        : i.InSpecialComment),
                      (this.sectionStart = this.index)));
              }),
              (e.prototype.stateInClosingTagName = function (e) {
                (e === r.Gt || s(e)) &&
                  (this.cbs.onclosetag(this.sectionStart, this.index),
                  (this.sectionStart = -1),
                  (this.state = i.AfterClosingTagName),
                  this.stateAfterClosingTagName(e));
              }),
              (e.prototype.stateAfterClosingTagName = function (e) {
                (e === r.Gt || this.fastForwardTo(r.Gt)) &&
                  ((this.state = i.Text),
                  (this.baseState = i.Text),
                  (this.sectionStart = this.index + 1));
              }),
              (e.prototype.stateBeforeAttributeName = function (e) {
                e === r.Gt
                  ? (this.cbs.onopentagend(this.index),
                    this.isSpecial
                      ? ((this.state = i.InSpecialTag), (this.sequenceIndex = 0))
                      : (this.state = i.Text),
                    (this.baseState = this.state),
                    (this.sectionStart = this.index + 1))
                  : e === r.Slash
                  ? (this.state = i.InSelfClosingTag)
                  : s(e) || ((this.state = i.InAttributeName), (this.sectionStart = this.index));
              }),
              (e.prototype.stateInSelfClosingTag = function (e) {
                e === r.Gt
                  ? (this.cbs.onselfclosingtag(this.index),
                    (this.state = i.Text),
                    (this.baseState = i.Text),
                    (this.sectionStart = this.index + 1),
                    (this.isSpecial = !1))
                  : s(e) ||
                    ((this.state = i.BeforeAttributeName), this.stateBeforeAttributeName(e));
              }),
              (e.prototype.stateInAttributeName = function (e) {
                (e === r.Eq || c(e)) &&
                  (this.cbs.onattribname(this.sectionStart, this.index),
                  (this.sectionStart = -1),
                  (this.state = i.AfterAttributeName),
                  this.stateAfterAttributeName(e));
              }),
              (e.prototype.stateAfterAttributeName = function (e) {
                e === r.Eq
                  ? (this.state = i.BeforeAttributeValue)
                  : e === r.Slash || e === r.Gt
                  ? (this.cbs.onattribend(o.NoValue, this.index),
                    (this.state = i.BeforeAttributeName),
                    this.stateBeforeAttributeName(e))
                  : s(e) ||
                    (this.cbs.onattribend(o.NoValue, this.index),
                    (this.state = i.InAttributeName),
                    (this.sectionStart = this.index));
              }),
              (e.prototype.stateBeforeAttributeValue = function (e) {
                e === r.DoubleQuote
                  ? ((this.state = i.InAttributeValueDq), (this.sectionStart = this.index + 1))
                  : e === r.SingleQuote
                  ? ((this.state = i.InAttributeValueSq), (this.sectionStart = this.index + 1))
                  : s(e) ||
                    ((this.sectionStart = this.index),
                    (this.state = i.InAttributeValueNq),
                    this.stateInAttributeValueNoQuotes(e));
              }),
              (e.prototype.handleInAttributeValue = function (e, t) {
                e === t || (!this.decodeEntities && this.fastForwardTo(t))
                  ? (this.cbs.onattribdata(this.sectionStart, this.index),
                    (this.sectionStart = -1),
                    this.cbs.onattribend(t === r.DoubleQuote ? o.Double : o.Single, this.index),
                    (this.state = i.BeforeAttributeName))
                  : this.decodeEntities &&
                    e === r.Amp &&
                    ((this.baseState = this.state), (this.state = i.BeforeEntity));
              }),
              (e.prototype.stateInAttributeValueDoubleQuotes = function (e) {
                this.handleInAttributeValue(e, r.DoubleQuote);
              }),
              (e.prototype.stateInAttributeValueSingleQuotes = function (e) {
                this.handleInAttributeValue(e, r.SingleQuote);
              }),
              (e.prototype.stateInAttributeValueNoQuotes = function (e) {
                s(e) || e === r.Gt
                  ? (this.cbs.onattribdata(this.sectionStart, this.index),
                    (this.sectionStart = -1),
                    this.cbs.onattribend(o.Unquoted, this.index),
                    (this.state = i.BeforeAttributeName),
                    this.stateBeforeAttributeName(e))
                  : this.decodeEntities &&
                    e === r.Amp &&
                    ((this.baseState = this.state), (this.state = i.BeforeEntity));
              }),
              (e.prototype.stateBeforeDeclaration = function (e) {
                e === r.OpeningSquareBracket
                  ? ((this.state = i.CDATASequence), (this.sequenceIndex = 0))
                  : (this.state = e === r.Dash ? i.BeforeComment : i.InDeclaration);
              }),
              (e.prototype.stateInDeclaration = function (e) {
                (e === r.Gt || this.fastForwardTo(r.Gt)) &&
                  (this.cbs.ondeclaration(this.sectionStart, this.index),
                  (this.state = i.Text),
                  (this.sectionStart = this.index + 1));
              }),
              (e.prototype.stateInProcessingInstruction = function (e) {
                (e === r.Gt || this.fastForwardTo(r.Gt)) &&
                  (this.cbs.onprocessinginstruction(this.sectionStart, this.index),
                  (this.state = i.Text),
                  (this.sectionStart = this.index + 1));
              }),
              (e.prototype.stateBeforeComment = function (e) {
                e === r.Dash
                  ? ((this.state = i.InCommentLike),
                    (this.currentSequence = u.CommentEnd),
                    (this.sequenceIndex = 2),
                    (this.sectionStart = this.index + 1))
                  : (this.state = i.InDeclaration);
              }),
              (e.prototype.stateInSpecialComment = function (e) {
                (e === r.Gt || this.fastForwardTo(r.Gt)) &&
                  (this.cbs.oncomment(this.sectionStart, this.index, 0),
                  (this.state = i.Text),
                  (this.sectionStart = this.index + 1));
              }),
              (e.prototype.stateBeforeSpecialS = function (e) {
                var t = 32 | e;
                t === u.ScriptEnd[3]
                  ? this.startSpecial(u.ScriptEnd, 4)
                  : t === u.StyleEnd[3]
                  ? this.startSpecial(u.StyleEnd, 4)
                  : ((this.state = i.InTagName), this.stateInTagName(e));
              }),
              (e.prototype.stateBeforeEntity = function (e) {
                (this.entityExcess = 1),
                  (this.entityResult = 0),
                  e === r.Number
                    ? (this.state = i.BeforeNumericEntity)
                    : e === r.Amp ||
                      ((this.trieIndex = 0),
                      (this.trieCurrent = this.entityTrie[0]),
                      (this.state = i.InNamedEntity),
                      this.stateInNamedEntity(e));
              }),
              (e.prototype.stateInNamedEntity = function (e) {
                if (
                  ((this.entityExcess += 1),
                  (this.trieIndex = (0, a.determineBranch)(
                    this.entityTrie,
                    this.trieCurrent,
                    this.trieIndex + 1,
                    e
                  )),
                  this.trieIndex < 0)
                )
                  return this.emitNamedEntity(), void this.index--;
                this.trieCurrent = this.entityTrie[this.trieIndex];
                var t = this.trieCurrent & a.BinTrieFlags.VALUE_LENGTH;
                if (t) {
                  var n = (t >> 14) - 1;
                  if (this.allowLegacyEntity() || e === r.Semi) {
                    var i = this.index - this.entityExcess + 1;
                    i > this.sectionStart && this.emitPartial(this.sectionStart, i),
                      (this.entityResult = this.trieIndex),
                      (this.trieIndex += n),
                      (this.entityExcess = 0),
                      (this.sectionStart = this.index + 1),
                      0 === n && this.emitNamedEntity();
                  } else this.trieIndex += n;
                }
              }),
              (e.prototype.emitNamedEntity = function () {
                if (((this.state = this.baseState), 0 !== this.entityResult))
                  switch (
                    (this.entityTrie[this.entityResult] & a.BinTrieFlags.VALUE_LENGTH) >>
                    14
                  ) {
                    case 1:
                      this.emitCodePoint(
                        this.entityTrie[this.entityResult] & ~a.BinTrieFlags.VALUE_LENGTH
                      );
                      break;
                    case 2:
                      this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
                      break;
                    case 3:
                      this.emitCodePoint(this.entityTrie[this.entityResult + 1]),
                        this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
                  }
              }),
              (e.prototype.stateBeforeNumericEntity = function (e) {
                (32 | e) === r.LowerX
                  ? (this.entityExcess++, (this.state = i.InHexEntity))
                  : ((this.state = i.InNumericEntity), this.stateInNumericEntity(e));
              }),
              (e.prototype.emitNumericEntity = function (e) {
                var t = this.index - this.entityExcess - 1;
                t + 2 + Number(this.state === i.InHexEntity) !== this.index &&
                  (t > this.sectionStart && this.emitPartial(this.sectionStart, t),
                  (this.sectionStart = this.index + Number(e)),
                  this.emitCodePoint((0, a.replaceCodePoint)(this.entityResult))),
                  (this.state = this.baseState);
              }),
              (e.prototype.stateInNumericEntity = function (e) {
                e === r.Semi
                  ? this.emitNumericEntity(!0)
                  : l(e)
                  ? ((this.entityResult = 10 * this.entityResult + (e - r.Zero)),
                    this.entityExcess++)
                  : (this.allowLegacyEntity()
                      ? this.emitNumericEntity(!1)
                      : (this.state = this.baseState),
                    this.index--);
              }),
              (e.prototype.stateInHexEntity = function (e) {
                e === r.Semi
                  ? this.emitNumericEntity(!0)
                  : l(e)
                  ? ((this.entityResult = 16 * this.entityResult + (e - r.Zero)),
                    this.entityExcess++)
                  : (function (e) {
                      return (e >= r.UpperA && e <= r.UpperF) || (e >= r.LowerA && e <= r.LowerF);
                    })(e)
                  ? ((this.entityResult = 16 * this.entityResult + ((32 | e) - r.LowerA + 10)),
                    this.entityExcess++)
                  : (this.allowLegacyEntity()
                      ? this.emitNumericEntity(!1)
                      : (this.state = this.baseState),
                    this.index--);
              }),
              (e.prototype.allowLegacyEntity = function () {
                return (
                  !this.xmlMode && (this.baseState === i.Text || this.baseState === i.InSpecialTag)
                );
              }),
              (e.prototype.cleanup = function () {
                this.running &&
                  this.sectionStart !== this.index &&
                  (this.state === i.Text ||
                  (this.state === i.InSpecialTag && 0 === this.sequenceIndex)
                    ? (this.cbs.ontext(this.sectionStart, this.index),
                      (this.sectionStart = this.index))
                    : (this.state !== i.InAttributeValueDq &&
                        this.state !== i.InAttributeValueSq &&
                        this.state !== i.InAttributeValueNq) ||
                      (this.cbs.onattribdata(this.sectionStart, this.index),
                      (this.sectionStart = this.index)));
              }),
              (e.prototype.shouldContinue = function () {
                return this.index < this.buffer.length + this.offset && this.running;
              }),
              (e.prototype.parse = function () {
                for (; this.shouldContinue(); ) {
                  var e = this.buffer.charCodeAt(this.index - this.offset);
                  switch (this.state) {
                    case i.Text:
                      this.stateText(e);
                      break;
                    case i.SpecialStartSequence:
                      this.stateSpecialStartSequence(e);
                      break;
                    case i.InSpecialTag:
                      this.stateInSpecialTag(e);
                      break;
                    case i.CDATASequence:
                      this.stateCDATASequence(e);
                      break;
                    case i.InAttributeValueDq:
                      this.stateInAttributeValueDoubleQuotes(e);
                      break;
                    case i.InAttributeName:
                      this.stateInAttributeName(e);
                      break;
                    case i.InCommentLike:
                      this.stateInCommentLike(e);
                      break;
                    case i.InSpecialComment:
                      this.stateInSpecialComment(e);
                      break;
                    case i.BeforeAttributeName:
                      this.stateBeforeAttributeName(e);
                      break;
                    case i.InTagName:
                      this.stateInTagName(e);
                      break;
                    case i.InClosingTagName:
                      this.stateInClosingTagName(e);
                      break;
                    case i.BeforeTagName:
                      this.stateBeforeTagName(e);
                      break;
                    case i.AfterAttributeName:
                      this.stateAfterAttributeName(e);
                      break;
                    case i.InAttributeValueSq:
                      this.stateInAttributeValueSingleQuotes(e);
                      break;
                    case i.BeforeAttributeValue:
                      this.stateBeforeAttributeValue(e);
                      break;
                    case i.BeforeClosingTagName:
                      this.stateBeforeClosingTagName(e);
                      break;
                    case i.AfterClosingTagName:
                      this.stateAfterClosingTagName(e);
                      break;
                    case i.BeforeSpecialS:
                      this.stateBeforeSpecialS(e);
                      break;
                    case i.InAttributeValueNq:
                      this.stateInAttributeValueNoQuotes(e);
                      break;
                    case i.InSelfClosingTag:
                      this.stateInSelfClosingTag(e);
                      break;
                    case i.InDeclaration:
                      this.stateInDeclaration(e);
                      break;
                    case i.BeforeDeclaration:
                      this.stateBeforeDeclaration(e);
                      break;
                    case i.BeforeComment:
                      this.stateBeforeComment(e);
                      break;
                    case i.InProcessingInstruction:
                      this.stateInProcessingInstruction(e);
                      break;
                    case i.InNamedEntity:
                      this.stateInNamedEntity(e);
                      break;
                    case i.BeforeEntity:
                      this.stateBeforeEntity(e);
                      break;
                    case i.InHexEntity:
                      this.stateInHexEntity(e);
                      break;
                    case i.InNumericEntity:
                      this.stateInNumericEntity(e);
                      break;
                    default:
                      this.stateBeforeNumericEntity(e);
                  }
                  this.index++;
                }
                this.cleanup();
              }),
              (e.prototype.finish = function () {
                this.state === i.InNamedEntity && this.emitNamedEntity(),
                  this.sectionStart < this.index && this.handleTrailingData(),
                  this.cbs.onend();
              }),
              (e.prototype.handleTrailingData = function () {
                var e = this.buffer.length + this.offset;
                this.state === i.InCommentLike
                  ? this.currentSequence === u.CdataEnd
                    ? this.cbs.oncdata(this.sectionStart, e, 0)
                    : this.cbs.oncomment(this.sectionStart, e, 0)
                  : (this.state === i.InNumericEntity && this.allowLegacyEntity()) ||
                    (this.state === i.InHexEntity && this.allowLegacyEntity())
                  ? this.emitNumericEntity(!1)
                  : this.state === i.InTagName ||
                    this.state === i.BeforeAttributeName ||
                    this.state === i.BeforeAttributeValue ||
                    this.state === i.AfterAttributeName ||
                    this.state === i.InAttributeName ||
                    this.state === i.InAttributeValueSq ||
                    this.state === i.InAttributeValueDq ||
                    this.state === i.InAttributeValueNq ||
                    this.state === i.InClosingTagName ||
                    this.cbs.ontext(this.sectionStart, e);
              }),
              (e.prototype.emitPartial = function (e, t) {
                this.baseState !== i.Text && this.baseState !== i.InSpecialTag
                  ? this.cbs.onattribdata(e, t)
                  : this.cbs.ontext(e, t);
              }),
              (e.prototype.emitCodePoint = function (e) {
                this.baseState !== i.Text && this.baseState !== i.InSpecialTag
                  ? this.cbs.onattribentity(e)
                  : this.cbs.ontextentity(e);
              }),
              e
            );
          })();
        t.default = f;
      },
      199: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
        var r = n(31);
        function i(e) {
          if (e && e.__esModule) return e;
          var t = Object.create(null);
          return (
            e &&
              Object.keys(e).forEach(function (n) {
                if ('default' !== n) {
                  var r = Object.getOwnPropertyDescriptor(e, n);
                  Object.defineProperty(
                    t,
                    n,
                    r.get
                      ? r
                      : {
                          enumerable: !0,
                          get: function () {
                            return e[n];
                          },
                        }
                  );
                }
              }),
            (t.default = e),
            Object.freeze(t)
          );
        }
        var o = i(n(447)),
          a = Object.freeze({ __proto__: null });
        const s = '(?:\\n|\\r\\n|\\r|\\f)',
          c = '[^\\x00-\\x7F]',
          l = '(?:\\\\[0-9a-f]{1,6}(?:\\r\\n|[ \\n\\r\\t\\f])?)',
          u = '(?:\\\\[^\\n\\r\\f0-9a-f])',
          f = `(?:[_a-z0-9-]|${c}|${l}|${u})`,
          d = `(?:${f}+)`,
          p = `(?:[-]?(?:[_a-z]|${c}|${l}|${u})${f}*)`,
          h = `'([^\\n\\r\\f\\\\']|\\\\${s}|${c}|${l}|${u})*'`,
          m = `"([^\\n\\r\\f\\\\"]|\\\\${s}|${c}|${l}|${u})*"`,
          g = r.createLexer([
            { name: 'ws', regex: new RegExp('(?:[ \\t\\r\\n\\f]*)') },
            { name: 'hash', regex: new RegExp(`#${d}`, 'i') },
            { name: 'ident', regex: new RegExp(p, 'i') },
            { name: 'str1', regex: new RegExp(h, 'i') },
            { name: 'str2', regex: new RegExp(m, 'i') },
            { name: '*' },
            { name: '.' },
            { name: ',' },
            { name: '[' },
            { name: ']' },
            { name: '=' },
            { name: '>' },
            { name: '|' },
            { name: '+' },
            { name: '~' },
            { name: '^' },
            { name: '$' },
          ]),
          y = r.createLexer([
            { name: 'unicode', regex: new RegExp(l, 'i') },
            { name: 'escape', regex: new RegExp(u, 'i') },
            { name: 'any', regex: new RegExp('[\\s\\S]', 'i') },
          ]);
        function v([e, t, n], [r, i, o]) {
          return [e + r, t + i, n + o];
        }
        function b(e) {
          return e.reduce(v, [0, 0, 0]);
        }
        const x = o.token(e =>
            'unicode' === e.name ? String.fromCodePoint(parseInt(e.text.slice(1), 16)) : void 0
          ),
          w = o.token(e => ('escape' === e.name ? e.text.slice(1) : void 0)),
          T = o.token(e => ('any' === e.name ? e.text : void 0)),
          k = o.map(o.many(o.or(x, w, T)), e => e.join(''));
        function _(e) {
          const t = y(e);
          return k({ tokens: t.tokens, options: void 0 }, 0).value;
        }
        function E(e) {
          return o.token(t => t.name === e || void 0);
        }
        const S = o.token(e => ('ws' === e.name ? null : void 0)),
          L = o.option(S, null);
        function A(e) {
          return o.middle(L, e, L);
        }
        const C = o.token(e => ('ident' === e.name ? _(e.text) : void 0)),
          N = o.token(e => ('hash' === e.name ? _(e.text.slice(1)) : void 0)),
          I = o.token(e => (e.name.startsWith('str') ? _(e.text.slice(1, -1)) : void 0)),
          D = o.left(o.option(C, ''), E('|')),
          O = o.eitherOr(
            o.ab(D, C, (e, t) => ({ name: t, namespace: e })),
            o.map(C, e => ({ name: e, namespace: null }))
          ),
          q = o.eitherOr(
            o.ab(D, E('*'), e => ({ type: 'universal', namespace: e, specificity: [0, 0, 0] })),
            o.map(E('*'), () => ({ type: 'universal', namespace: null, specificity: [0, 0, 0] }))
          ),
          B = o.map(O, ({ name: e, namespace: t }) => ({
            type: 'tag',
            name: e,
            namespace: t,
            specificity: [0, 0, 1],
          })),
          j = o.ab(E('.'), C, (e, t) => ({ type: 'class', name: t, specificity: [0, 1, 0] })),
          P = o.map(N, e => ({ type: 'id', name: e, specificity: [1, 0, 0] })),
          M = o.token(e => {
            if ('ident' === e.name) {
              if ('i' === e.text || 'I' === e.text) return 'i';
              if ('s' === e.text || 'S' === e.text) return 's';
            }
          }),
          R = o.eitherOr(
            o.ab(I, o.option(o.right(L, M), null), (e, t) => ({ value: e, modifier: t })),
            o.ab(C, o.option(o.right(S, M), null), (e, t) => ({ value: e, modifier: t }))
          ),
          H = o.choice(
            o.map(E('='), () => '='),
            o.ab(E('~'), E('='), () => '~='),
            o.ab(E('|'), E('='), () => '|='),
            o.ab(E('^'), E('='), () => '^='),
            o.ab(E('$'), E('='), () => '$='),
            o.ab(E('*'), E('='), () => '*=')
          ),
          W = o.abc(E('['), A(O), E(']'), (e, { name: t, namespace: n }) => ({
            type: 'attrPresence',
            name: t,
            namespace: n,
            specificity: [0, 1, 0],
          })),
          U = o.middle(
            E('['),
            o.abc(A(O), H, A(R), ({ name: e, namespace: t }, n, { value: r, modifier: i }) => ({
              type: 'attrValue',
              name: e,
              namespace: t,
              matcher: n,
              value: r,
              modifier: i,
              specificity: [0, 1, 0],
            })),
            E(']')
          ),
          $ = o.eitherOr(W, U),
          F = o.eitherOr(q, B),
          V = o.choice(P, j, $),
          G = o.map(o.eitherOr(o.flatten(F, o.many(V)), o.many1(V)), e => ({
            type: 'compound',
            list: e,
            specificity: b(e.map(e => e.specificity)),
          })),
          z = o.choice(
            o.map(E('>'), () => '>'),
            o.map(E('+'), () => '+'),
            o.map(E('~'), () => '~'),
            o.ab(E('|'), E('|'), () => '||')
          ),
          Q = o.eitherOr(
            A(z),
            o.map(S, () => ' ')
          ),
          X = o.leftAssoc2(
            G,
            o.map(Q, e => (t, n) => ({
              type: 'compound',
              list: [
                ...n.list,
                { type: 'combinator', combinator: e, left: t, specificity: t.specificity },
              ],
              specificity: v(t.specificity, n.specificity),
            })),
            G
          ),
          J = o.leftAssoc2(
            o.map(X, e => ({ type: 'list', list: [e] })),
            o.map(A(E(',')), () => (e, t) => ({ type: 'list', list: [...e.list, t] })),
            X
          );
        function Z(e, t) {
          if (!('string' == typeof t || t instanceof String))
            throw new Error('Expected a selector string. Actual input is not a string!');
          const n = g(t);
          if (!n.complete)
            throw new Error(
              `The input "${t}" was only partially tokenized, stopped at offset ${n.offset}!\n` +
                Y(t, n.offset)
            );
          const r = A(e)({ tokens: n.tokens, options: void 0 }, 0);
          if (!r.matched) throw new Error(`No match for "${t}" input!`);
          if (r.position < n.tokens.length) {
            const e = n.tokens[r.position];
            throw new Error(
              `The input "${t}" was only partially parsed, stopped at offset ${e.offset}!\n` +
                Y(t, e.offset, e.len)
            );
          }
          return r.value;
        }
        function Y(e, t, n = 1) {
          return `${e.replace(/(\t)|(\r)|(\n)/g, (e, t, n) =>
            t ? '␉' : n ? '␍' : '␊'
          )}\n${''.padEnd(t)}${'^'.repeat(n)}`;
        }
        function K(e) {
          if (!e.type) throw new Error('This is not an AST node.');
          switch (e.type) {
            case 'universal':
              return ee(e.namespace) + '*';
            case 'tag':
              return ee(e.namespace) + ne(e.name);
            case 'class':
              return '.' + ne(e.name);
            case 'id':
              return '#' + ne(e.name);
            case 'attrPresence':
              return `[${ee(e.namespace)}${ne(e.name)}]`;
            case 'attrValue':
              return `[${ee(e.namespace)}${ne(e.name)}${e.matcher}"${
                ((t = e.value),
                t.replace(/(")|(\\)|(\x00)|([\x01-\x1f]|\x7f)/g, (e, t, n, r, i) =>
                  t ? '\\"' : n ? '\\\\' : r ? '�' : te(i)
                ))
              }"${e.modifier ? e.modifier : ''}]`;
            case 'combinator':
              return K(e.left) + e.combinator;
            case 'compound':
              return e.list.reduce((e, t) => ('combinator' === t.type ? K(t) + e : e + K(t)), '');
            case 'list':
              return e.list.map(K).join(',');
          }
          var t;
        }
        function ee(e) {
          return e || '' === e ? ne(e) + '|' : '';
        }
        function te(e) {
          return `\\${e.codePointAt(0).toString(16)} `;
        }
        function ne(e) {
          return e.replace(
            /(^[0-9])|(^-[0-9])|(^-$)|([-0-9a-zA-Z_]|[^\x00-\x7F])|(\x00)|([\x01-\x1f]|\x7f)|([\s\S])/g,
            (e, t, n, r, i, o, a, s) =>
              t
                ? te(t)
                : n
                ? '-' + te(n.slice(1))
                : r
                ? '\\-'
                : i || (o ? '�' : a ? te(a) : '\\' + s)
          );
        }
        function re(e) {
          switch (e.type) {
            case 'universal':
            case 'tag':
              return [1];
            case 'id':
              return [2];
            case 'class':
              return [3, e.name];
            case 'attrPresence':
              return [4, K(e)];
            case 'attrValue':
              return [5, K(e)];
            case 'combinator':
              return [15, K(e)];
          }
        }
        function ie(e, t) {
          if (!Array.isArray(e) || !Array.isArray(t)) throw new Error('Arguments must be arrays.');
          const n = e.length < t.length ? e.length : t.length;
          for (let r = 0; r < n; r++) if (e[r] !== t[r]) return e[r] < t[r] ? -1 : 1;
          return e.length - t.length;
        }
        (t.Ast = a),
          (t.compareSelectors = function (e, t) {
            return ie(e.specificity, t.specificity);
          }),
          (t.compareSpecificity = function (e, t) {
            return ie(e, t);
          }),
          (t.normalize = function e(t) {
            if (!t.type) throw new Error('This is not an AST node.');
            switch (t.type) {
              case 'compound':
                t.list.forEach(e), t.list.sort((e, t) => ie(re(e), re(t)));
                break;
              case 'combinator':
                e(t.left);
                break;
              case 'list':
                t.list.forEach(e), t.list.sort((e, t) => (K(e) < K(t) ? -1 : 1));
            }
            return t;
          }),
          (t.parse = function (e) {
            return Z(J, e);
          }),
          (t.parse1 = function (e) {
            return Z(X, e);
          }),
          (t.serialize = K);
      },
      226: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.attributeNames = t.elementNames = void 0),
          (t.elementNames = new Map(
            [
              'altGlyph',
              'altGlyphDef',
              'altGlyphItem',
              'animateColor',
              'animateMotion',
              'animateTransform',
              'clipPath',
              'feBlend',
              'feColorMatrix',
              'feComponentTransfer',
              'feComposite',
              'feConvolveMatrix',
              'feDiffuseLighting',
              'feDisplacementMap',
              'feDistantLight',
              'feDropShadow',
              'feFlood',
              'feFuncA',
              'feFuncB',
              'feFuncG',
              'feFuncR',
              'feGaussianBlur',
              'feImage',
              'feMerge',
              'feMergeNode',
              'feMorphology',
              'feOffset',
              'fePointLight',
              'feSpecularLighting',
              'feSpotLight',
              'feTile',
              'feTurbulence',
              'foreignObject',
              'glyphRef',
              'linearGradient',
              'radialGradient',
              'textPath',
            ].map(function (e) {
              return [e.toLowerCase(), e];
            })
          )),
          (t.attributeNames = new Map(
            [
              'definitionURL',
              'attributeName',
              'attributeType',
              'baseFrequency',
              'baseProfile',
              'calcMode',
              'clipPathUnits',
              'diffuseConstant',
              'edgeMode',
              'filterUnits',
              'glyphRef',
              'gradientTransform',
              'gradientUnits',
              'kernelMatrix',
              'kernelUnitLength',
              'keyPoints',
              'keySplines',
              'keyTimes',
              'lengthAdjust',
              'limitingConeAngle',
              'markerHeight',
              'markerUnits',
              'markerWidth',
              'maskContentUnits',
              'maskUnits',
              'numOctaves',
              'pathLength',
              'patternContentUnits',
              'patternTransform',
              'patternUnits',
              'pointsAtX',
              'pointsAtY',
              'pointsAtZ',
              'preserveAlpha',
              'preserveAspectRatio',
              'primitiveUnits',
              'refX',
              'refY',
              'repeatCount',
              'repeatDur',
              'requiredExtensions',
              'requiredFeatures',
              'specularConstant',
              'specularExponent',
              'spreadMethod',
              'startOffset',
              'stdDeviation',
              'stitchTiles',
              'surfaceScale',
              'systemLanguage',
              'tableValues',
              'targetX',
              'targetY',
              'textLength',
              'viewBox',
              'viewTarget',
              'xChannelSelector',
              'yChannelSelector',
              'zoomAndPan',
            ].map(function (e) {
              return [e.toLowerCase(), e];
            })
          ));
      },
      238: function (e, t, n) {
        'use strict';
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.hasChildren = t.isDocument = t.isComment = t.isText = t.isCDATA = t.isTag = void 0),
          i(n(779), t),
          i(n(855), t),
          i(n(685), t),
          i(n(664), t),
          i(n(679), t),
          i(n(575), t),
          i(n(951), t);
        var o = n(23);
        Object.defineProperty(t, 'isTag', {
          enumerable: !0,
          get: function () {
            return o.isTag;
          },
        }),
          Object.defineProperty(t, 'isCDATA', {
            enumerable: !0,
            get: function () {
              return o.isCDATA;
            },
          }),
          Object.defineProperty(t, 'isText', {
            enumerable: !0,
            get: function () {
              return o.isText;
            },
          }),
          Object.defineProperty(t, 'isComment', {
            enumerable: !0,
            get: function () {
              return o.isComment;
            },
          }),
          Object.defineProperty(t, 'isDocument', {
            enumerable: !0,
            get: function () {
              return o.isDocument;
            },
          }),
          Object.defineProperty(t, 'hasChildren', {
            enumerable: !0,
            get: function () {
              return o.hasChildren;
            },
          });
      },
      357: function (e, t, n) {
        'use strict';
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          o =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && r(t, e, n);
              return i(t, e), t;
            },
          a =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.DomUtils =
            t.parseFeed =
            t.getFeed =
            t.ElementType =
            t.Tokenizer =
            t.createDomStream =
            t.parseDOM =
            t.parseDocument =
            t.DefaultHandler =
            t.DomHandler =
            t.Parser =
              void 0);
        var s = n(762),
          c = n(762);
        Object.defineProperty(t, 'Parser', {
          enumerable: !0,
          get: function () {
            return c.Parser;
          },
        });
        var l = n(23),
          u = n(23);
        function f(e, t) {
          var n = new l.DomHandler(void 0, t);
          return new s.Parser(n, t).end(e), n.root;
        }
        function d(e, t) {
          return f(e, t).children;
        }
        Object.defineProperty(t, 'DomHandler', {
          enumerable: !0,
          get: function () {
            return u.DomHandler;
          },
        }),
          Object.defineProperty(t, 'DefaultHandler', {
            enumerable: !0,
            get: function () {
              return u.DomHandler;
            },
          }),
          (t.parseDocument = f),
          (t.parseDOM = d),
          (t.createDomStream = function (e, t, n) {
            var r = new l.DomHandler(e, t, n);
            return new s.Parser(r, t);
          });
        var p = n(184);
        Object.defineProperty(t, 'Tokenizer', {
          enumerable: !0,
          get: function () {
            return a(p).default;
          },
        }),
          (t.ElementType = o(n(811)));
        var h = n(238),
          m = n(238);
        Object.defineProperty(t, 'getFeed', {
          enumerable: !0,
          get: function () {
            return m.getFeed;
          },
        });
        var g = { xmlMode: !0 };
        (t.parseFeed = function (e, t) {
          return void 0 === t && (t = g), (0, h.getFeed)(d(e, t));
        }),
          (t.DomUtils = o(n(238)));
      },
      360: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.decodeXMLStrict =
            t.decodeHTML5Strict =
            t.decodeHTML4Strict =
            t.decodeHTML5 =
            t.decodeHTML4 =
            t.decodeHTMLAttribute =
            t.decodeHTMLStrict =
            t.decodeHTML =
            t.decodeXML =
            t.DecodingMode =
            t.EntityDecoder =
            t.encodeHTML5 =
            t.encodeHTML4 =
            t.encodeNonAsciiHTML =
            t.encodeHTML =
            t.escapeText =
            t.escapeAttribute =
            t.escapeUTF8 =
            t.escape =
            t.encodeXML =
            t.encode =
            t.decodeStrict =
            t.decode =
            t.EncodingMode =
            t.EntityLevel =
              void 0);
        var r,
          i,
          o = n(972),
          a = n(388),
          s = n(665);
        function c(e, t) {
          if ((void 0 === t && (t = r.XML), ('number' == typeof t ? t : t.level) === r.HTML)) {
            var n = 'object' == typeof t ? t.mode : void 0;
            return (0, o.decodeHTML)(e, n);
          }
          return (0, o.decodeXML)(e);
        }
        !(function (e) {
          (e[(e.XML = 0)] = 'XML'), (e[(e.HTML = 1)] = 'HTML');
        })((r = t.EntityLevel || (t.EntityLevel = {}))),
          (function (e) {
            (e[(e.UTF8 = 0)] = 'UTF8'),
              (e[(e.ASCII = 1)] = 'ASCII'),
              (e[(e.Extensive = 2)] = 'Extensive'),
              (e[(e.Attribute = 3)] = 'Attribute'),
              (e[(e.Text = 4)] = 'Text');
          })((i = t.EncodingMode || (t.EncodingMode = {}))),
          (t.decode = c),
          (t.decodeStrict = function (e, t) {
            var n;
            void 0 === t && (t = r.XML);
            var i = 'number' == typeof t ? { level: t } : t;
            return (
              (null !== (n = i.mode) && void 0 !== n) || (i.mode = o.DecodingMode.Strict), c(e, i)
            );
          }),
          (t.encode = function (e, t) {
            void 0 === t && (t = r.XML);
            var n = 'number' == typeof t ? { level: t } : t;
            return n.mode === i.UTF8
              ? (0, s.escapeUTF8)(e)
              : n.mode === i.Attribute
              ? (0, s.escapeAttribute)(e)
              : n.mode === i.Text
              ? (0, s.escapeText)(e)
              : n.level === r.HTML
              ? n.mode === i.ASCII
                ? (0, a.encodeNonAsciiHTML)(e)
                : (0, a.encodeHTML)(e)
              : (0, s.encodeXML)(e);
          });
        var l = n(665);
        Object.defineProperty(t, 'encodeXML', {
          enumerable: !0,
          get: function () {
            return l.encodeXML;
          },
        }),
          Object.defineProperty(t, 'escape', {
            enumerable: !0,
            get: function () {
              return l.escape;
            },
          }),
          Object.defineProperty(t, 'escapeUTF8', {
            enumerable: !0,
            get: function () {
              return l.escapeUTF8;
            },
          }),
          Object.defineProperty(t, 'escapeAttribute', {
            enumerable: !0,
            get: function () {
              return l.escapeAttribute;
            },
          }),
          Object.defineProperty(t, 'escapeText', {
            enumerable: !0,
            get: function () {
              return l.escapeText;
            },
          });
        var u = n(388);
        Object.defineProperty(t, 'encodeHTML', {
          enumerable: !0,
          get: function () {
            return u.encodeHTML;
          },
        }),
          Object.defineProperty(t, 'encodeNonAsciiHTML', {
            enumerable: !0,
            get: function () {
              return u.encodeNonAsciiHTML;
            },
          }),
          Object.defineProperty(t, 'encodeHTML4', {
            enumerable: !0,
            get: function () {
              return u.encodeHTML;
            },
          }),
          Object.defineProperty(t, 'encodeHTML5', {
            enumerable: !0,
            get: function () {
              return u.encodeHTML;
            },
          });
        var f = n(972);
        Object.defineProperty(t, 'EntityDecoder', {
          enumerable: !0,
          get: function () {
            return f.EntityDecoder;
          },
        }),
          Object.defineProperty(t, 'DecodingMode', {
            enumerable: !0,
            get: function () {
              return f.DecodingMode;
            },
          }),
          Object.defineProperty(t, 'decodeXML', {
            enumerable: !0,
            get: function () {
              return f.decodeXML;
            },
          }),
          Object.defineProperty(t, 'decodeHTML', {
            enumerable: !0,
            get: function () {
              return f.decodeHTML;
            },
          }),
          Object.defineProperty(t, 'decodeHTMLStrict', {
            enumerable: !0,
            get: function () {
              return f.decodeHTMLStrict;
            },
          }),
          Object.defineProperty(t, 'decodeHTMLAttribute', {
            enumerable: !0,
            get: function () {
              return f.decodeHTMLAttribute;
            },
          }),
          Object.defineProperty(t, 'decodeHTML4', {
            enumerable: !0,
            get: function () {
              return f.decodeHTML;
            },
          }),
          Object.defineProperty(t, 'decodeHTML5', {
            enumerable: !0,
            get: function () {
              return f.decodeHTML;
            },
          }),
          Object.defineProperty(t, 'decodeHTML4Strict', {
            enumerable: !0,
            get: function () {
              return f.decodeHTMLStrict;
            },
          }),
          Object.defineProperty(t, 'decodeHTML5Strict', {
            enumerable: !0,
            get: function () {
              return f.decodeHTMLStrict;
            },
          }),
          Object.defineProperty(t, 'decodeXMLStrict', {
            enumerable: !0,
            get: function () {
              return f.decodeXML;
            },
          });
      },
      376: function (e, t, n) {
        'use strict';
        var r =
            (this && this.__assign) ||
            function () {
              return (
                (r =
                  Object.assign ||
                  function (e) {
                    for (var t, n = 1, r = arguments.length; n < r; n++)
                      for (var i in (t = arguments[n]))
                        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                    return e;
                  }),
                r.apply(this, arguments)
              );
            },
          i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          o =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          a =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && i(t, e, n);
              return o(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.render = void 0);
        var s = a(n(811)),
          c = n(360),
          l = n(226),
          u = new Set([
            'style',
            'script',
            'xmp',
            'iframe',
            'noembed',
            'noframes',
            'plaintext',
            'noscript',
          ]);
        function f(e) {
          return e.replace(/"/g, '&quot;');
        }
        var d = new Set([
          'area',
          'base',
          'basefont',
          'br',
          'col',
          'command',
          'embed',
          'frame',
          'hr',
          'img',
          'input',
          'isindex',
          'keygen',
          'link',
          'meta',
          'param',
          'source',
          'track',
          'wbr',
        ]);
        function p(e, t) {
          void 0 === t && (t = {});
          for (var n = ('length' in e) ? e : [e], r = '', i = 0; i < n.length; i++) r += h(n[i], t);
          return r;
        }
        function h(e, t) {
          switch (e.type) {
            case s.Root:
              return p(e.children, t);
            case s.Doctype:
            case s.Directive:
              return '<'.concat(e.data, '>');
            case s.Comment:
              return '\x3c!--'.concat(e.data, '--\x3e');
            case s.CDATA:
              return (function (e) {
                return '<![CDATA['.concat(e.children[0].data, ']]>');
              })(e);
            case s.Script:
            case s.Style:
            case s.Tag:
              return (function (e, t) {
                var n;
                'foreign' === t.xmlMode &&
                  ((e.name =
                    null !== (n = l.elementNames.get(e.name)) && void 0 !== n ? n : e.name),
                  e.parent && m.has(e.parent.name) && (t = r(r({}, t), { xmlMode: !1 }))),
                  !t.xmlMode && g.has(e.name) && (t = r(r({}, t), { xmlMode: 'foreign' }));
                var i = '<'.concat(e.name),
                  o = (function (e, t) {
                    var n;
                    if (e) {
                      var r =
                        !1 ===
                        (null !== (n = t.encodeEntities) && void 0 !== n ? n : t.decodeEntities)
                          ? f
                          : t.xmlMode || 'utf8' !== t.encodeEntities
                          ? c.encodeXML
                          : c.escapeAttribute;
                      return Object.keys(e)
                        .map(function (n) {
                          var i,
                            o,
                            a = null !== (i = e[n]) && void 0 !== i ? i : '';
                          return (
                            'foreign' === t.xmlMode &&
                              (n = null !== (o = l.attributeNames.get(n)) && void 0 !== o ? o : n),
                            t.emptyAttrs || t.xmlMode || '' !== a
                              ? ''.concat(n, '="').concat(r(a), '"')
                              : n
                          );
                        })
                        .join(' ');
                    }
                  })(e.attribs, t);
                return (
                  o && (i += ' '.concat(o)),
                  0 === e.children.length &&
                  (t.xmlMode ? !1 !== t.selfClosingTags : t.selfClosingTags && d.has(e.name))
                    ? (t.xmlMode || (i += ' '), (i += '/>'))
                    : ((i += '>'),
                      e.children.length > 0 && (i += p(e.children, t)),
                      (!t.xmlMode && d.has(e.name)) || (i += '</'.concat(e.name, '>'))),
                  i
                );
              })(e, t);
            case s.Text:
              return (function (e, t) {
                var n,
                  r = e.data || '';
                return (
                  !1 === (null !== (n = t.encodeEntities) && void 0 !== n ? n : t.decodeEntities) ||
                    (!t.xmlMode && e.parent && u.has(e.parent.name)) ||
                    (r =
                      t.xmlMode || 'utf8' !== t.encodeEntities
                        ? (0, c.encodeXML)(r)
                        : (0, c.escapeText)(r)),
                  r
                );
              })(e, t);
          }
        }
        (t.render = p), (t.default = p);
        var m = new Set([
            'mi',
            'mo',
            'mn',
            'ms',
            'mtext',
            'annotation-xml',
            'foreignObject',
            'desc',
            'title',
          ]),
          g = new Set(['svg', 'math']);
      },
      388: function (e, t, n) {
        'use strict';
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.encodeNonAsciiHTML = t.encodeHTML = void 0);
        var i = r(n(758)),
          o = n(665),
          a = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
        function s(e, t) {
          for (var n, r = '', a = 0; null !== (n = e.exec(t)); ) {
            var s = n.index;
            r += t.substring(a, s);
            var c = t.charCodeAt(s),
              l = i.default.get(c);
            if ('object' == typeof l) {
              if (s + 1 < t.length) {
                var u = t.charCodeAt(s + 1),
                  f = 'number' == typeof l.n ? (l.n === u ? l.o : void 0) : l.n.get(u);
                if (void 0 !== f) {
                  (r += f), (a = e.lastIndex += 1);
                  continue;
                }
              }
              l = l.v;
            }
            if (void 0 !== l) (r += l), (a = s + 1);
            else {
              var d = (0, o.getCodePoint)(t, s);
              (r += '&#x'.concat(d.toString(16), ';')), (a = e.lastIndex += Number(d !== c));
            }
          }
          return r + t.substr(a);
        }
        (t.encodeHTML = function (e) {
          return s(a, e);
        }),
          (t.encodeNonAsciiHTML = function (e) {
            return s(o.xmlReplacer, e);
          });
      },
      411: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
        var r = n(23),
          i = n(603);
        function o(e) {
          const t = e.map(a);
          return (e, ...n) => t.flatMap(t => t(e, ...n));
        }
        function a(e) {
          switch (e.type) {
            case 'terminal': {
              const t = [e.valueContainer];
              return (e, ...n) => t;
            }
            case 'tagName':
              return (function (e) {
                const t = {};
                for (const n of e.variants) t[n.value] = o(n.cont);
                return (e, ...n) => {
                  const r = t[e.name];
                  return r ? r(e, ...n) : [];
                };
              })(e);
            case 'attrValue':
              return (function (e) {
                const t = [];
                for (const n of e.matchers) {
                  const e = n.predicate,
                    r = o(n.cont);
                  t.push((t, n, ...i) => (e(t) ? r(n, ...i) : []));
                }
                const n = e.name;
                return (e, ...r) => {
                  const i = e.attribs[n];
                  return i || '' === i ? t.flatMap(t => t(i, e, ...r)) : [];
                };
              })(e);
            case 'attrPresence':
              return (function (e) {
                const t = e.name,
                  n = o(e.cont);
                return (e, ...r) =>
                  Object.prototype.hasOwnProperty.call(e.attribs, t) ? n(e, ...r) : [];
              })(e);
            case 'pushElement':
              return (function (e) {
                const t = o(e.cont),
                  n = '+' === e.combinator ? s : c;
                return (e, ...r) => {
                  const i = n(e);
                  return null === i ? [] : t(i, e, ...r);
                };
              })(e);
            case 'popElement':
              return (function (e) {
                const t = o(e.cont);
                return (e, n, ...r) => t(n, ...r);
              })(e);
          }
        }
        const s = e => {
            const t = e.prev;
            return null === t ? null : r.isTag(t) ? t : s(t);
          },
          c = e => {
            const t = e.parent;
            return t && r.isTag(t) ? t : null;
          };
        t.hp2Builder = function (e) {
          return new i.Picker(o(e));
        };
      },
      447: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
        var r = n(970);
        function i(e) {
          return (t, n) => ({ matched: !0, position: n, value: e });
        }
        function o(e, t) {
          return e.matched
            ? { matched: !0, position: e.position, value: t(e.value, e.position) }
            : e;
        }
        function a(e, t) {
          return e.matched ? t(e) : e;
        }
        function s(e, t) {
          return (n, r) => o(e(n, r), (e, i) => t(e, n, r, i));
        }
        function c(...e) {
          return (t, n) => {
            for (const r of e) {
              const e = r(t, n);
              if (e.matched) return e;
            }
            return { matched: !1 };
          };
        }
        function l(e, t) {
          return (n, r) => {
            const i = e(n, r);
            return i.matched ? i : t(n, r);
          };
        }
        function u(e, t) {
          return (n, r) => {
            const i = [];
            let o = !0;
            do {
              const a = e(n, r);
              a.matched && t(a.value, i.length + 1, n, r, a.position)
                ? (i.push(a.value), (r = a.position))
                : (o = !1);
            } while (o);
            return { matched: !0, position: r, value: i };
          };
        }
        function f(e) {
          return u(e, () => !0);
        }
        function d(e) {
          return p(e, f(e), (e, t) => [e, ...t]);
        }
        function p(e, t, n) {
          return (r, i) => a(e(r, i), e => o(t(r, e.position), (t, o) => n(e.value, t, r, i, o)));
        }
        function h(e, t) {
          return p(e, t, (e, t) => t);
        }
        function m(e, t, n, r) {
          return (i, s) =>
            a(e(i, s), e =>
              a(t(i, e.position), t =>
                o(n(i, t.position), (n, o) => r(e.value, t.value, n, i, s, o))
              )
            );
        }
        function g(...e) {
          return (t, n) => {
            const r = [];
            let i = n;
            for (const n of e) {
              const e = n(t, i);
              if (!e.matched) return { matched: !1 };
              r.push(e.value), (i = e.position);
            }
            return { matched: !0, position: i, value: r };
          };
        }
        function y(...e) {
          return s(g(...e), () => null);
        }
        function v(e) {
          return s(e, e => e.flatMap(e => e));
        }
        function b(e, t) {
          return p(e, f(h(t, e)), (e, t) => [e, ...t]);
        }
        function x(e, t) {
          return (n, r) => {
            let i = !0,
              o = e,
              a = r;
            do {
              const e = t(o, n, a)(n, a);
              e.matched ? ((o = e.value), (a = e.position)) : (i = !1);
            } while (i);
            return { matched: !0, position: a, value: o };
          };
        }
        function w(e, t, n) {
          return x(e, e => s(t, (t, r, i, o) => n(e, t, r, i, o)));
        }
        function T(e, t, n) {
          return s(f(e), (e, r, i, o) => e.reduceRight((e, t) => n(t, e, r, i, o), t));
        }
        function k(e, t) {
          return (n, r) => a(e(n, r), e => t(e.value, n, r, e.position)(n, e.position));
        }
        function _(e) {
          return (t, n) => a(e(t, n), e => ({ matched: !0, position: n, value: e.value }));
        }
        function E(e, t) {
          return t < e.tokens.length ? { matched: !1 } : { matched: !0, position: t, value: !0 };
        }
        function S(e, t, n, i = 3) {
          const o = e.tokens.length,
            a = r.clamp(0, t - i, o - i),
            s = r.clamp(i, t + 1 + i, o),
            c = e.tokens.slice(a, s),
            l = [],
            u = String(s - 1).length + 1;
          t < 0 && l.push(`${String(t).padStart(u)} >>`), 0 < a && l.push('...'.padStart(u + 6));
          for (let e = 0; e < c.length; e++) {
            const i = a + e;
            l.push(
              `${String(i).padStart(u)} ${i === t ? '>' : ' '} ${r.escapeWhitespace(n(c[e]))}`
            );
          }
          return (
            s < o && l.push('...'.padStart(u + 6)),
            o <= t && l.push(`${String(t).padStart(u)} >>`),
            l.join('\n')
          );
        }
        (t.ab = p),
          (t.abc = m),
          (t.action = function (e) {
            return (t, n) => (e(t, n), { matched: !0, position: n, value: null });
          }),
          (t.ahead = _),
          (t.all = g),
          (t.and = g),
          (t.any = function (e, t) {
            return t < e.tokens.length
              ? { matched: !0, position: t + 1, value: e.tokens[t] }
              : { matched: !1 };
          }),
          (t.chain = k),
          (t.chainReduce = x),
          (t.choice = c),
          (t.condition = function (e, t, n) {
            return (r, i) => (e(r, i) ? t(r, i) : n(r, i));
          }),
          (t.decide = function (e) {
            return (t, n) => a(e(t, n), e => e.value(t, e.position));
          }),
          (t.discard = y),
          (t.eitherOr = l),
          (t.emit = i),
          (t.end = E),
          (t.eof = E),
          (t.error = function (e) {
            return (t, n) => {
              throw new Error(e instanceof Function ? e(t, n) : e);
            };
          }),
          (t.fail = function (e, t) {
            return { matched: !1 };
          }),
          (t.flatten = function (...e) {
            return v(g(...e));
          }),
          (t.flatten1 = v),
          (t.left = function (e, t) {
            return p(e, t, e => e);
          }),
          (t.leftAssoc1 = function (e, t) {
            return k(e, e => w(e, t, (e, t) => t(e)));
          }),
          (t.leftAssoc2 = function (e, t, n) {
            return k(e, e =>
              w(
                e,
                p(t, n, (e, t) => [e, t]),
                (e, [t, n]) => t(e, n)
              )
            );
          }),
          (t.longest = function (...e) {
            return (t, n) => {
              let r;
              for (const i of e) {
                const e = i(t, n);
                e.matched && (!r || r.position < e.position) && (r = e);
              }
              return r || { matched: !1 };
            };
          }),
          (t.lookAhead = _),
          (t.make = function (e) {
            return (t, n) => ({ matched: !0, position: n, value: e(t, n) });
          }),
          (t.many = f),
          (t.many1 = d),
          (t.map = s),
          (t.map1 = function (e, t) {
            return (n, r) => a(e(n, r), e => t(e, n, r));
          }),
          (t.match = function (e, t, n) {
            return e({ tokens: t, options: n }, 0).value;
          }),
          (t.middle = function (e, t, n) {
            return m(e, t, n, (e, t) => t);
          }),
          (t.not = function (e) {
            return (t, n) =>
              e(t, n).matched ? { matched: !1 } : { matched: !0, position: n, value: !0 };
          }),
          (t.of = i),
          (t.option = function (e, t) {
            return (n, r) => {
              const i = e(n, r);
              return i.matched ? i : { matched: !0, position: r, value: t };
            };
          }),
          (t.or = c),
          (t.otherwise = l),
          (t.parse = function (e, t, n, r = JSON.stringify) {
            const i = { tokens: t, options: n },
              o = e(i, 0);
            if (!o.matched) throw new Error('No match');
            if (o.position < i.tokens.length)
              throw new Error(`Partial match. Parsing stopped at:\n${S(i, o.position, r)}`);
            return o.value;
          }),
          (t.parserPosition = S),
          (t.peek = function (e, t) {
            return (n, r) => {
              const i = e(n, r);
              return t(i, n, r), i;
            };
          }),
          (t.recursive = function (e) {
            return function (t, n) {
              return e()(t, n);
            };
          }),
          (t.reduceLeft = w),
          (t.reduceRight = T),
          (t.remainingTokensNumber = function (e, t) {
            return e.tokens.length - t;
          }),
          (t.right = h),
          (t.rightAssoc1 = function (e, t) {
            return p(
              T(
                e,
                e => e,
                (e, t) => n => e(t(n))
              ),
              t,
              (e, t) => e(t)
            );
          }),
          (t.rightAssoc2 = function (e, t, n) {
            return p(
              T(
                p(e, t, (e, t) => [e, t]),
                e => e,
                ([e, t], n) =>
                  r =>
                    t(e, n(r))
              ),
              n,
              (e, t) => e(t)
            );
          }),
          (t.satisfy = function (e) {
            return (t, n) =>
              n < t.tokens.length && e(t.tokens[n], t, n)
                ? { matched: !0, position: n + 1, value: t.tokens[n] }
                : { matched: !1 };
          }),
          (t.sepBy = function (e, t) {
            return l(b(e, t), i([]));
          }),
          (t.sepBy1 = b),
          (t.skip = y),
          (t.some = d),
          (t.start = function (e, t) {
            return 0 !== t ? { matched: !1 } : { matched: !0, position: t, value: !0 };
          }),
          (t.takeUntil = function (e, t) {
            return u(e, (e, n, r, i, o) => !t(e, n, r, i, o));
          }),
          (t.takeUntilP = function (e, t) {
            return u(e, (e, n, r, i) => !t(r, i).matched);
          }),
          (t.takeWhile = u),
          (t.takeWhileP = function (e, t) {
            return u(e, (e, n, r, i) => t(r, i).matched);
          }),
          (t.token = function (e, t) {
            return (n, r) => {
              let i,
                o = r;
              return (
                r < n.tokens.length ? ((i = e(n.tokens[r], n, r)), void 0 !== i && o++) : t?.(n, r),
                void 0 === i ? { matched: !1 } : { matched: !0, position: o, value: i }
              );
            };
          }),
          (t.tryParse = function (e, t, n) {
            const r = e({ tokens: t, options: n }, 0);
            return r.matched ? r.value : void 0;
          });
      },
      510: e => {
        'use strict';
        var t = function (e) {
            return (
              (function (e) {
                return !!e && 'object' == typeof e;
              })(e) &&
              !(function (e) {
                var t = Object.prototype.toString.call(e);
                return (
                  '[object RegExp]' === t ||
                  '[object Date]' === t ||
                  (function (e) {
                    return e.$$typeof === n;
                  })(e)
                );
              })(e)
            );
          },
          n = 'function' == typeof Symbol && Symbol.for ? Symbol.for('react.element') : 60103;
        function r(e, t) {
          return !1 !== t.clone && t.isMergeableObject(e)
            ? s(((n = e), Array.isArray(n) ? [] : {}), e, t)
            : e;
          var n;
        }
        function i(e, t, n) {
          return e.concat(t).map(function (e) {
            return r(e, n);
          });
        }
        function o(e) {
          return Object.keys(e).concat(
            (function (e) {
              return Object.getOwnPropertySymbols
                ? Object.getOwnPropertySymbols(e).filter(function (t) {
                    return Object.propertyIsEnumerable.call(e, t);
                  })
                : [];
            })(e)
          );
        }
        function a(e, t) {
          try {
            return t in e;
          } catch (e) {
            return !1;
          }
        }
        function s(e, n, c) {
          ((c = c || {}).arrayMerge = c.arrayMerge || i),
            (c.isMergeableObject = c.isMergeableObject || t),
            (c.cloneUnlessOtherwiseSpecified = r);
          var l = Array.isArray(n);
          return l === Array.isArray(e)
            ? l
              ? c.arrayMerge(e, n, c)
              : (function (e, t, n) {
                  var i = {};
                  return (
                    n.isMergeableObject(e) &&
                      o(e).forEach(function (t) {
                        i[t] = r(e[t], n);
                      }),
                    o(t).forEach(function (o) {
                      (function (e, t) {
                        return (
                          a(e, t) &&
                          !(
                            Object.hasOwnProperty.call(e, t) &&
                            Object.propertyIsEnumerable.call(e, t)
                          )
                        );
                      })(e, o) ||
                        (a(e, o) && n.isMergeableObject(t[o])
                          ? (i[o] = (function (e, t) {
                              if (!t.customMerge) return s;
                              var n = t.customMerge(e);
                              return 'function' == typeof n ? n : s;
                            })(o, n)(e[o], t[o], n))
                          : (i[o] = r(t[o], n)));
                    }),
                    i
                  );
                })(e, n, c)
            : r(n, c);
        }
        s.all = function (e, t) {
          if (!Array.isArray(e)) throw new Error('first argument should be an array');
          return e.reduce(function (e, n) {
            return s(e, n, t);
          }, {});
        };
        var c = s;
        e.exports = c;
      },
      511: function (e, t, n) {
        'use strict';
        var r,
          i =
            (this && this.__extends) ||
            ((r = function (e, t) {
              return (
                (r =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, t) {
                      e.__proto__ = t;
                    }) ||
                  function (e, t) {
                    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                  }),
                r(e, t)
              );
            }),
            function (e, t) {
              if ('function' != typeof t && null !== t)
                throw new TypeError(
                  'Class extends value ' + String(t) + ' is not a constructor or null'
                );
              function n() {
                this.constructor = e;
              }
              r(e, t),
                (e.prototype =
                  null === t ? Object.create(t) : ((n.prototype = t.prototype), new n()));
            }),
          o =
            (this && this.__assign) ||
            function () {
              return (
                (o =
                  Object.assign ||
                  function (e) {
                    for (var t, n = 1, r = arguments.length; n < r; n++)
                      for (var i in (t = arguments[n]))
                        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                    return e;
                  }),
                o.apply(this, arguments)
              );
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.cloneNode =
            t.hasChildren =
            t.isDocument =
            t.isDirective =
            t.isComment =
            t.isText =
            t.isCDATA =
            t.isTag =
            t.Element =
            t.Document =
            t.CDATA =
            t.NodeWithChildren =
            t.ProcessingInstruction =
            t.Comment =
            t.Text =
            t.DataNode =
            t.Node =
              void 0);
        var a = n(811),
          s = (function () {
            function e() {
              (this.parent = null),
                (this.prev = null),
                (this.next = null),
                (this.startIndex = null),
                (this.endIndex = null);
            }
            return (
              Object.defineProperty(e.prototype, 'parentNode', {
                get: function () {
                  return this.parent;
                },
                set: function (e) {
                  this.parent = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(e.prototype, 'previousSibling', {
                get: function () {
                  return this.prev;
                },
                set: function (e) {
                  this.prev = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(e.prototype, 'nextSibling', {
                get: function () {
                  return this.next;
                },
                set: function (e) {
                  this.next = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (e.prototype.cloneNode = function (e) {
                return void 0 === e && (e = !1), T(this, e);
              }),
              e
            );
          })();
        t.Node = s;
        var c = (function (e) {
          function t(t) {
            var n = e.call(this) || this;
            return (n.data = t), n;
          }
          return (
            i(t, e),
            Object.defineProperty(t.prototype, 'nodeValue', {
              get: function () {
                return this.data;
              },
              set: function (e) {
                this.data = e;
              },
              enumerable: !1,
              configurable: !0,
            }),
            t
          );
        })(s);
        t.DataNode = c;
        var l = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (t.type = a.ElementType.Text), t;
          }
          return (
            i(t, e),
            Object.defineProperty(t.prototype, 'nodeType', {
              get: function () {
                return 3;
              },
              enumerable: !1,
              configurable: !0,
            }),
            t
          );
        })(c);
        t.Text = l;
        var u = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (t.type = a.ElementType.Comment), t;
          }
          return (
            i(t, e),
            Object.defineProperty(t.prototype, 'nodeType', {
              get: function () {
                return 8;
              },
              enumerable: !1,
              configurable: !0,
            }),
            t
          );
        })(c);
        t.Comment = u;
        var f = (function (e) {
          function t(t, n) {
            var r = e.call(this, n) || this;
            return (r.name = t), (r.type = a.ElementType.Directive), r;
          }
          return (
            i(t, e),
            Object.defineProperty(t.prototype, 'nodeType', {
              get: function () {
                return 1;
              },
              enumerable: !1,
              configurable: !0,
            }),
            t
          );
        })(c);
        t.ProcessingInstruction = f;
        var d = (function (e) {
          function t(t) {
            var n = e.call(this) || this;
            return (n.children = t), n;
          }
          return (
            i(t, e),
            Object.defineProperty(t.prototype, 'firstChild', {
              get: function () {
                var e;
                return null !== (e = this.children[0]) && void 0 !== e ? e : null;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(t.prototype, 'lastChild', {
              get: function () {
                return this.children.length > 0 ? this.children[this.children.length - 1] : null;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(t.prototype, 'childNodes', {
              get: function () {
                return this.children;
              },
              set: function (e) {
                this.children = e;
              },
              enumerable: !1,
              configurable: !0,
            }),
            t
          );
        })(s);
        t.NodeWithChildren = d;
        var p = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (t.type = a.ElementType.CDATA), t;
          }
          return (
            i(t, e),
            Object.defineProperty(t.prototype, 'nodeType', {
              get: function () {
                return 4;
              },
              enumerable: !1,
              configurable: !0,
            }),
            t
          );
        })(d);
        t.CDATA = p;
        var h = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (t.type = a.ElementType.Root), t;
          }
          return (
            i(t, e),
            Object.defineProperty(t.prototype, 'nodeType', {
              get: function () {
                return 9;
              },
              enumerable: !1,
              configurable: !0,
            }),
            t
          );
        })(d);
        t.Document = h;
        var m = (function (e) {
          function t(t, n, r, i) {
            void 0 === r && (r = []),
              void 0 === i &&
                (i =
                  'script' === t
                    ? a.ElementType.Script
                    : 'style' === t
                    ? a.ElementType.Style
                    : a.ElementType.Tag);
            var o = e.call(this, r) || this;
            return (o.name = t), (o.attribs = n), (o.type = i), o;
          }
          return (
            i(t, e),
            Object.defineProperty(t.prototype, 'nodeType', {
              get: function () {
                return 1;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(t.prototype, 'tagName', {
              get: function () {
                return this.name;
              },
              set: function (e) {
                this.name = e;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(t.prototype, 'attributes', {
              get: function () {
                var e = this;
                return Object.keys(this.attribs).map(function (t) {
                  var n, r;
                  return {
                    name: t,
                    value: e.attribs[t],
                    namespace:
                      null === (n = e['x-attribsNamespace']) || void 0 === n ? void 0 : n[t],
                    prefix: null === (r = e['x-attribsPrefix']) || void 0 === r ? void 0 : r[t],
                  };
                });
              },
              enumerable: !1,
              configurable: !0,
            }),
            t
          );
        })(d);
        function g(e) {
          return (0, a.isTag)(e);
        }
        function y(e) {
          return e.type === a.ElementType.CDATA;
        }
        function v(e) {
          return e.type === a.ElementType.Text;
        }
        function b(e) {
          return e.type === a.ElementType.Comment;
        }
        function x(e) {
          return e.type === a.ElementType.Directive;
        }
        function w(e) {
          return e.type === a.ElementType.Root;
        }
        function T(e, t) {
          var n;
          if ((void 0 === t && (t = !1), v(e))) n = new l(e.data);
          else if (b(e)) n = new u(e.data);
          else if (g(e)) {
            var r = t ? k(e.children) : [],
              i = new m(e.name, o({}, e.attribs), r);
            r.forEach(function (e) {
              return (e.parent = i);
            }),
              null != e.namespace && (i.namespace = e.namespace),
              e['x-attribsNamespace'] && (i['x-attribsNamespace'] = o({}, e['x-attribsNamespace'])),
              e['x-attribsPrefix'] && (i['x-attribsPrefix'] = o({}, e['x-attribsPrefix'])),
              (n = i);
          } else if (y(e)) {
            r = t ? k(e.children) : [];
            var a = new p(r);
            r.forEach(function (e) {
              return (e.parent = a);
            }),
              (n = a);
          } else if (w(e)) {
            r = t ? k(e.children) : [];
            var s = new h(r);
            r.forEach(function (e) {
              return (e.parent = s);
            }),
              e['x-mode'] && (s['x-mode'] = e['x-mode']),
              (n = s);
          } else {
            if (!x(e)) throw new Error('Not implemented yet: '.concat(e.type));
            var c = new f(e.name, e.data);
            null != e['x-name'] &&
              ((c['x-name'] = e['x-name']),
              (c['x-publicId'] = e['x-publicId']),
              (c['x-systemId'] = e['x-systemId'])),
              (n = c);
          }
          return (
            (n.startIndex = e.startIndex),
            (n.endIndex = e.endIndex),
            null != e.sourceCodeLocation && (n.sourceCodeLocation = e.sourceCodeLocation),
            n
          );
        }
        function k(e) {
          for (
            var t = e.map(function (e) {
                return T(e, !0);
              }),
              n = 1;
            n < t.length;
            n++
          )
            (t[n].prev = t[n - 1]), (t[n - 1].next = t[n]);
          return t;
        }
        (t.Element = m),
          (t.isTag = g),
          (t.isCDATA = y),
          (t.isText = v),
          (t.isComment = b),
          (t.isDirective = x),
          (t.isDocument = w),
          (t.hasChildren = function (e) {
            return Object.prototype.hasOwnProperty.call(e, 'children');
          }),
          (t.cloneNode = T);
      },
      575: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.DocumentPosition = void 0),
          (t.removeSubsets = function (e) {
            for (var t = e.length; --t >= 0; ) {
              var n = e[t];
              if (t > 0 && e.lastIndexOf(n, t - 1) >= 0) e.splice(t, 1);
              else
                for (var r = n.parent; r; r = r.parent)
                  if (e.includes(r)) {
                    e.splice(t, 1);
                    break;
                  }
            }
            return e;
          }),
          (t.compareDocumentPosition = o),
          (t.uniqueSort = function (e) {
            return (
              (e = e.filter(function (e, t, n) {
                return !n.includes(e, t + 1);
              })).sort(function (e, t) {
                var n = o(e, t);
                return n & r.PRECEDING ? -1 : n & r.FOLLOWING ? 1 : 0;
              }),
              e
            );
          });
        var r,
          i = n(23);
        function o(e, t) {
          var n = [],
            o = [];
          if (e === t) return 0;
          for (var a = (0, i.hasChildren)(e) ? e : e.parent; a; ) n.unshift(a), (a = a.parent);
          for (a = (0, i.hasChildren)(t) ? t : t.parent; a; ) o.unshift(a), (a = a.parent);
          for (var s = Math.min(n.length, o.length), c = 0; c < s && n[c] === o[c]; ) c++;
          if (0 === c) return r.DISCONNECTED;
          var l = n[c - 1],
            u = l.children,
            f = n[c],
            d = o[c];
          return u.indexOf(f) > u.indexOf(d)
            ? l === t
              ? r.FOLLOWING | r.CONTAINED_BY
              : r.FOLLOWING
            : l === e
            ? r.PRECEDING | r.CONTAINS
            : r.PRECEDING;
        }
        !(function (e) {
          (e[(e.DISCONNECTED = 1)] = 'DISCONNECTED'),
            (e[(e.PRECEDING = 2)] = 'PRECEDING'),
            (e[(e.FOLLOWING = 4)] = 'FOLLOWING'),
            (e[(e.CONTAINS = 8)] = 'CONTAINS'),
            (e[(e.CONTAINED_BY = 16)] = 'CONTAINED_BY');
        })(r || (t.DocumentPosition = r = {}));
      },
      603: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
        var r = n(199);
        function i(e) {
          if (e && e.__esModule) return e;
          var t = Object.create(null);
          return (
            e &&
              Object.keys(e).forEach(function (n) {
                if ('default' !== n) {
                  var r = Object.getOwnPropertyDescriptor(e, n);
                  Object.defineProperty(
                    t,
                    n,
                    r.get
                      ? r
                      : {
                          enumerable: !0,
                          get: function () {
                            return e[n];
                          },
                        }
                  );
                }
              }),
            (t.default = e),
            Object.freeze(t)
          );
        }
        var o = i(r),
          a = Object.freeze({ __proto__: null }),
          s = Object.freeze({ __proto__: null });
        const c = [
            ['├─', '│ '],
            ['└─', '  '],
          ],
          l = [
            ['┠─', '┃ '],
            ['┖─', '  '],
          ],
          u = [
            ['╟─', '║ '],
            ['╙─', '  '],
          ];
        function f(e, t = l) {
          return (function (e, t) {
            return t
              .map((t, n, { length: r }) =>
                (function (e, t, n = !0) {
                  const r = e[n ? 1 : 0];
                  return r[0] + t.split('\n').join('\n' + r[1]);
                })(e, t, n === r - 1)
              )
              .join('\n');
          })(
            t,
            e.map(e =>
              (function (e) {
                switch (e.type) {
                  case 'terminal': {
                    const t = e.valueContainer;
                    return `◁ #${t.index} ${JSON.stringify(t.specificity)} ${t.value}`;
                  }
                  case 'tagName':
                    return `◻ Tag name\n${f(e.variants, u)}`;
                  case 'attrValue':
                    return `▣ Attr value: ${e.name}\n${f(e.matchers, u)}`;
                  case 'attrPresence':
                    return `◨ Attr presence: ${e.name}\n${f(e.cont)}`;
                  case 'pushElement':
                    return `◉ Push element: ${e.combinator}\n${f(e.cont, c)}`;
                  case 'popElement':
                    return `◌ Pop element\n${f(e.cont, c)}`;
                  case 'variant':
                    return `◇ = ${e.value}\n${f(e.cont)}`;
                  case 'matcher':
                    return `◈ ${e.matcher} "${e.value}"${e.modifier || ''}\n${f(e.cont)}`;
                }
              })(e)
            )
          );
        }
        var d = Object.freeze({ __proto__: null, treeify: e => '▽\n' + f(e, c) });
        function p(e) {
          return h(e), o.normalize(e), e;
        }
        function h(e) {
          const t = [];
          e.list.forEach(e => {
            switch (e.type) {
              case 'class':
                t.push({
                  matcher: '~=',
                  modifier: null,
                  name: 'class',
                  namespace: null,
                  specificity: e.specificity,
                  type: 'attrValue',
                  value: e.name,
                });
                break;
              case 'id':
                t.push({
                  matcher: '=',
                  modifier: null,
                  name: 'id',
                  namespace: null,
                  specificity: e.specificity,
                  type: 'attrValue',
                  value: e.name,
                });
                break;
              case 'combinator':
                h(e.left), t.push(e);
                break;
              case 'universal':
                break;
              default:
                t.push(e);
            }
          }),
            (e.list = t);
        }
        function m(e) {
          const t = [];
          for (; e.length; ) {
            const n = _(e, e => !0, v),
              { matches: r, nonmatches: i, empty: o } = y(e, n);
            (e = i), r.length && t.push(b(n, r)), o.length && t.push(...g(o));
          }
          return t;
        }
        function g(e) {
          const t = [];
          for (const n of e) {
            const e = n.terminal;
            if ('terminal' === e.type) t.push(e);
            else {
              const { matches: n, rest: r } = E(e.cont, e => 'terminal' === e.type);
              n.forEach(e => t.push(e)), r.length && ((e.cont = r), t.push(e));
            }
          }
          return t;
        }
        function y(e, t) {
          const n = [],
            r = [],
            i = [];
          for (const o of e) {
            const e = o.ast.list;
            e.length ? (e.some(e => v(e) === t) ? n : r).push(o) : i.push(o);
          }
          return { matches: n, nonmatches: r, empty: i };
        }
        function v(e) {
          switch (e.type) {
            case 'attrPresence':
              return `attrPresence ${e.name}`;
            case 'attrValue':
              return `attrValue ${e.name}`;
            case 'combinator':
              return `combinator ${e.combinator}`;
            default:
              return e.type;
          }
        }
        function b(e, t) {
          if ('tag' === e)
            return (function (e) {
              const t = T(
                e,
                e => 'tag' === e.type,
                e => e.name
              );
              return {
                type: 'tagName',
                variants: Object.entries(t).map(([e, t]) => ({
                  type: 'variant',
                  value: e,
                  cont: m(t.items),
                })),
              };
            })(t);
          if (e.startsWith('attrValue '))
            return (function (e, t) {
              const n = T(
                  t,
                  t => 'attrValue' === t.type && t.name === e,
                  e => `${e.matcher} ${e.modifier || ''} ${e.value}`
                ),
                r = [];
              for (const e of Object.values(n)) {
                const t = e.oneSimpleSelector,
                  n = x(t),
                  i = m(e.items);
                r.push({
                  type: 'matcher',
                  matcher: t.matcher,
                  modifier: t.modifier,
                  value: t.value,
                  predicate: n,
                  cont: i,
                });
              }
              return { type: 'attrValue', name: e, matchers: r };
            })(e.substring(10), t);
          if (e.startsWith('attrPresence '))
            return (function (e, t) {
              for (const n of t) k(n, t => 'attrPresence' === t.type && t.name === e);
              return { type: 'attrPresence', name: e, cont: m(t) };
            })(e.substring(13), t);
          if ('combinator >' === e) return w('>', t);
          if ('combinator +' === e) return w('+', t);
          throw new Error(`Unsupported selector kind: ${e}`);
        }
        function x(e) {
          if ('i' === e.modifier) {
            const t = e.value.toLowerCase();
            switch (e.matcher) {
              case '=':
                return e => t === e.toLowerCase();
              case '~=':
                return e =>
                  e
                    .toLowerCase()
                    .split(/[ \t]+/)
                    .includes(t);
              case '^=':
                return e => e.toLowerCase().startsWith(t);
              case '$=':
                return e => e.toLowerCase().endsWith(t);
              case '*=':
                return e => e.toLowerCase().includes(t);
              case '|=':
                return e => {
                  const n = e.toLowerCase();
                  return t === n || (n.startsWith(t) && '-' === n[t.length]);
                };
            }
          } else {
            const t = e.value;
            switch (e.matcher) {
              case '=':
                return e => t === e;
              case '~=':
                return e => e.split(/[ \t]+/).includes(t);
              case '^=':
                return e => e.startsWith(t);
              case '$=':
                return e => e.endsWith(t);
              case '*=':
                return e => e.includes(t);
              case '|=':
                return e => t === e || (e.startsWith(t) && '-' === e[t.length]);
            }
          }
        }
        function w(e, t) {
          const n = T(
              t,
              t => 'combinator' === t.type && t.combinator === e,
              e => o.serialize(e.left)
            ),
            r = [];
          for (const e of Object.values(n)) {
            const t = m(e.items),
              n = e.oneSimpleSelector.left;
            r.push({ ast: n, terminal: { type: 'popElement', cont: t } });
          }
          return { type: 'pushElement', combinator: e, cont: m(r) };
        }
        function T(e, t, n) {
          const r = {};
          for (; e.length; ) {
            const i = _(e, t, n),
              o = e => t(e) && n(e) === i,
              a = e => e.ast.list.some(o),
              { matches: s, rest: c } = S(e, a);
            let l = null;
            for (const e of s) {
              const t = k(e, o);
              l || (l = t);
            }
            if (null == l) throw new Error('No simple selector is found.');
            (r[i] = { oneSimpleSelector: l, items: s }), (e = c);
          }
          return r;
        }
        function k(e, t) {
          const n = e.ast.list,
            r = new Array(n.length);
          let i = -1;
          for (let e = n.length; e-- > 0; ) t(n[e]) && ((r[e] = !0), (i = e));
          if (-1 == i) throw new Error("Couldn't find the required simple selector.");
          const o = n[i];
          return (e.ast.list = n.filter((e, t) => !r[t])), o;
        }
        function _(e, t, n) {
          const r = {};
          for (const i of e) {
            const e = {};
            for (const r of i.ast.list.filter(t)) e[n(r)] = !0;
            for (const t of Object.keys(e)) r[t] ? r[t]++ : (r[t] = 1);
          }
          let i = '',
            o = 0;
          for (const e of Object.entries(r)) e[1] > o && ((i = e[0]), (o = e[1]));
          return i;
        }
        function E(e, t) {
          const n = [],
            r = [];
          for (const i of e) t(i) ? n.push(i) : r.push(i);
          return { matches: n, rest: r };
        }
        function S(e, t) {
          const n = [],
            r = [];
          for (const i of e) t(i) ? n.push(i) : r.push(i);
          return { matches: n, rest: r };
        }
        function L(e, t) {
          const n = r.compareSpecificity(t.specificity, e.specificity);
          return n > 0 || (0 === n && t.index < e.index);
        }
        function A(e, t) {
          const n = r.compareSpecificity(t.specificity, e.specificity);
          return n > 0 || (0 === n && t.index > e.index);
        }
        (t.Ast = a),
          (t.DecisionTree = class {
            constructor(e) {
              this.branches = m(
                (function (e) {
                  const t = e.length,
                    n = new Array(t);
                  for (let r = 0; r < t; r++) {
                    const [t, i] = e[r],
                      a = p(o.parse1(t));
                    n[r] = {
                      ast: a,
                      terminal: {
                        type: 'terminal',
                        valueContainer: { index: r, value: i, specificity: a.specificity },
                      },
                    };
                  }
                  return n;
                })(e)
              );
            }
            build(e) {
              return e(this.branches);
            }
          }),
          (t.Picker = class {
            constructor(e) {
              this.f = e;
            }
            pickAll(e) {
              return this.f(e);
            }
            pick1(e, t = !1) {
              const n = this.f(e),
                r = n.length;
              if (0 === r) return null;
              if (1 === r) return n[0].value;
              const i = t ? L : A;
              let o = n[0];
              for (let e = 1; e < r; e++) {
                const t = n[e];
                i(o, t) && (o = t);
              }
              return o.value;
            }
          }),
          (t.Treeify = d),
          (t.Types = s);
      },
      615: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = new Uint16Array(
            'Ȁaglq\tɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢'.split('').map(function (e) {
              return e.charCodeAt(0);
            })
          ));
      },
      655: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
        var r = n(411),
          i = n(357),
          o = n(603),
          a = n(510),
          s = n(376);
        function c(e) {
          return e && 'object' == typeof e && 'default' in e ? e : { default: e };
        }
        var l = c(a);
        function u(e, t, n = () => {}) {
          if (void 0 === e) {
            const e = function (...n) {
              return t(e, ...n);
            };
            return e;
          }
          return e >= 0
            ? function (...r) {
                return t(u(e - 1, t, n), ...r);
              }
            : n;
        }
        function f(e, t) {
          let n = 0,
            r = e.length;
          for (; n < r && e[n] === t; ) ++n;
          for (; r > n && e[r - 1] === t; ) --r;
          return n > 0 || r < e.length ? e.substring(n, r) : e;
        }
        function d(e, t) {
          const n = new Map();
          for (let r = e.length; r-- > 0; ) {
            const i = e[r],
              o = t(i);
            n.set(o, n.has(o) ? l.default(i, n.get(o), { arrayMerge: p }) : i);
          }
          return [...n.values()].reverse();
        }
        const p = (e, t, n) => [...t];
        function h(e, t) {
          for (const n of t) {
            if (!e) return;
            e = e[n];
          }
          return e;
        }
        function m(e, t = 'a', n = 26) {
          const r = [];
          do {
            (e -= 1), r.push(e % n), (e = (e / n) | 0);
          } while (e > 0);
          const i = t.charCodeAt(0);
          return r
            .reverse()
            .map(e => String.fromCharCode(i + e))
            .join('');
        }
        const g = ['I', 'X', 'C', 'M'],
          y = ['V', 'L', 'D'];
        function v(e) {
          return [...(e + '')]
            .map(e => +e)
            .reverse()
            .map((e, t) =>
              e % 5 < 4
                ? (e < 5 ? '' : y[t]) + g[t].repeat(e % 5)
                : g[t] + (e < 5 ? y[t] : g[t + 1])
            )
            .reverse()
            .join('');
        }
        class b {
          constructor(e, t = void 0) {
            (this.lines = []),
              (this.nextLineWords = []),
              (this.maxLineLength = t || e.wordwrap || Number.MAX_VALUE),
              (this.nextLineAvailableChars = this.maxLineLength),
              (this.wrapCharacters = h(e, ['longWordSplit', 'wrapCharacters']) || []),
              (this.forceWrapOnLimit = h(e, ['longWordSplit', 'forceWrapOnLimit']) || !1),
              (this.stashedSpace = !1),
              (this.wordBreakOpportunity = !1);
          }
          pushWord(e, t = !1) {
            this.nextLineAvailableChars <= 0 && !t && this.startNewLine();
            const n = 0 === this.nextLineWords.length,
              r = e.length + (n ? 0 : 1);
            if (r <= this.nextLineAvailableChars || t)
              this.nextLineWords.push(e), (this.nextLineAvailableChars -= r);
            else {
              const [t, ...r] = this.splitLongWord(e);
              n || this.startNewLine(),
                this.nextLineWords.push(t),
                (this.nextLineAvailableChars -= t.length);
              for (const e of r)
                this.startNewLine(),
                  this.nextLineWords.push(e),
                  (this.nextLineAvailableChars -= e.length);
            }
          }
          popWord() {
            const e = this.nextLineWords.pop();
            if (void 0 !== e) {
              const t = 0 === this.nextLineWords.length,
                n = e.length + (t ? 0 : 1);
              this.nextLineAvailableChars += n;
            }
            return e;
          }
          concatWord(e, t = !1) {
            if (this.wordBreakOpportunity && e.length > this.nextLineAvailableChars)
              this.pushWord(e, t), (this.wordBreakOpportunity = !1);
            else {
              const n = this.popWord();
              this.pushWord(n ? n.concat(e) : e, t);
            }
          }
          startNewLine(e = 1) {
            this.lines.push(this.nextLineWords),
              e > 1 && this.lines.push(...Array.from({ length: e - 1 }, () => [])),
              (this.nextLineWords = []),
              (this.nextLineAvailableChars = this.maxLineLength);
          }
          isEmpty() {
            return 0 === this.lines.length && 0 === this.nextLineWords.length;
          }
          clear() {
            (this.lines.length = 0),
              (this.nextLineWords.length = 0),
              (this.nextLineAvailableChars = this.maxLineLength);
          }
          toString() {
            return [...this.lines, this.nextLineWords].map(e => e.join(' ')).join('\n');
          }
          splitLongWord(e) {
            const t = [];
            let n = 0;
            for (; e.length > this.maxLineLength; ) {
              const r = e.substring(0, this.maxLineLength),
                i = e.substring(this.maxLineLength),
                o = r.lastIndexOf(this.wrapCharacters[n]);
              if (o > -1) (e = r.substring(o + 1) + i), t.push(r.substring(0, o + 1));
              else {
                if ((n++, !(n < this.wrapCharacters.length))) {
                  if (this.forceWrapOnLimit) {
                    if ((t.push(r), (e = i).length > this.maxLineLength)) continue;
                  } else e = r + i;
                  break;
                }
                e = r + i;
              }
            }
            return t.push(e), t;
          }
        }
        class x {
          constructor(e = null) {
            this.next = e;
          }
          getRoot() {
            return this.next ? this.next : this;
          }
        }
        class w extends x {
          constructor(e, t = null, n = 1, r = void 0) {
            super(t),
              (this.leadingLineBreaks = n),
              (this.inlineTextBuilder = new b(e, r)),
              (this.rawText = ''),
              (this.stashedLineBreaks = 0),
              (this.isPre = t && t.isPre),
              (this.isNoWrap = t && t.isNoWrap);
          }
        }
        class T extends w {
          constructor(
            e,
            t = null,
            {
              interRowLineBreaks: n = 1,
              leadingLineBreaks: r = 2,
              maxLineLength: i,
              maxPrefixLength: o = 0,
              prefixAlign: a = 'left',
            } = {}
          ) {
            super(e, t, r, i),
              (this.maxPrefixLength = o),
              (this.prefixAlign = a),
              (this.interRowLineBreaks = n);
          }
        }
        class k extends w {
          constructor(
            e,
            t = null,
            { leadingLineBreaks: n = 1, maxLineLength: r, prefix: i = '' } = {}
          ) {
            super(e, t, n, r), (this.prefix = i);
          }
        }
        class _ extends x {
          constructor(e = null) {
            super(e),
              (this.rows = []),
              (this.isPre = e && e.isPre),
              (this.isNoWrap = e && e.isNoWrap);
          }
        }
        class E extends x {
          constructor(e = null) {
            super(e),
              (this.cells = []),
              (this.isPre = e && e.isPre),
              (this.isNoWrap = e && e.isNoWrap);
          }
        }
        class S extends x {
          constructor(e, t = null, n = void 0) {
            super(t),
              (this.inlineTextBuilder = new b(e, n)),
              (this.rawText = ''),
              (this.stashedLineBreaks = 0),
              (this.isPre = t && t.isPre),
              (this.isNoWrap = t && t.isNoWrap);
          }
        }
        class L extends x {
          constructor(e = null, t) {
            super(e), (this.transform = t);
          }
        }
        class A {
          constructor(e) {
            this.whitespaceChars = e.preserveNewlines
              ? e.whitespaceCharacters.replace(/\n/g, '')
              : e.whitespaceCharacters;
            const t =
              ((n = this.whitespaceChars),
              [...n].map(e => '\\u' + e.charCodeAt(0).toString(16).padStart(4, '0')).join(''));
            var n;
            if (
              ((this.leadingWhitespaceRe = new RegExp(`^[${t}]`)),
              (this.trailingWhitespaceRe = new RegExp(`[${t}]$`)),
              (this.allWhitespaceOrEmptyRe = new RegExp(`^[${t}]*$`)),
              (this.newlineOrNonWhitespaceRe = new RegExp(`(\\n|[^\\n${t}])`, 'g')),
              (this.newlineOrNonNewlineStringRe = new RegExp('(\\n|[^\\n]+)', 'g')),
              e.preserveNewlines)
            ) {
              const e = new RegExp(`\\n|[^\\n${t}]+`, 'gm');
              this.shrinkWrapAdd = function (t, n, r = e => e, i = !1) {
                if (!t) return;
                const o = n.stashedSpace;
                let a = !1,
                  s = e.exec(t);
                if (s)
                  for (
                    a = !0,
                      '\n' === s[0]
                        ? n.startNewLine()
                        : o || this.testLeadingWhitespace(t)
                        ? n.pushWord(r(s[0]), i)
                        : n.concatWord(r(s[0]), i);
                    null !== (s = e.exec(t));

                  )
                    '\n' === s[0] ? n.startNewLine() : n.pushWord(r(s[0]), i);
                n.stashedSpace = (o && !a) || this.testTrailingWhitespace(t);
              };
            } else {
              const e = new RegExp(`[^${t}]+`, 'g');
              this.shrinkWrapAdd = function (t, n, r = e => e, i = !1) {
                if (!t) return;
                const o = n.stashedSpace;
                let a = !1,
                  s = e.exec(t);
                if (s)
                  for (
                    a = !0,
                      o || this.testLeadingWhitespace(t)
                        ? n.pushWord(r(s[0]), i)
                        : n.concatWord(r(s[0]), i);
                    null !== (s = e.exec(t));

                  )
                    n.pushWord(r(s[0]), i);
                n.stashedSpace = (o && !a) || this.testTrailingWhitespace(t);
              };
            }
          }
          addLiteral(e, t, n = !0) {
            if (!e) return;
            const r = t.stashedSpace;
            let i = !1,
              o = this.newlineOrNonNewlineStringRe.exec(e);
            if (o)
              for (
                i = !0,
                  '\n' === o[0]
                    ? t.startNewLine()
                    : r
                    ? t.pushWord(o[0], n)
                    : t.concatWord(o[0], n);
                null !== (o = this.newlineOrNonNewlineStringRe.exec(e));

              )
                '\n' === o[0] ? t.startNewLine() : t.pushWord(o[0], n);
            t.stashedSpace = r && !i;
          }
          testLeadingWhitespace(e) {
            return this.leadingWhitespaceRe.test(e);
          }
          testTrailingWhitespace(e) {
            return this.trailingWhitespaceRe.test(e);
          }
          testContainsWords(e) {
            return !this.allWhitespaceOrEmptyRe.test(e);
          }
          countNewlinesNoWords(e) {
            this.newlineOrNonWhitespaceRe.lastIndex = 0;
            let t,
              n = 0;
            for (; null !== (t = this.newlineOrNonWhitespaceRe.exec(e)); ) {
              if ('\n' !== t[0]) return 0;
              n++;
            }
            return n;
          }
        }
        class C {
          constructor(e, t, n = void 0) {
            (this.options = e),
              (this.picker = t),
              (this.metadata = n),
              (this.whitespaceProcessor = new A(e)),
              (this._stackItem = new w(e)),
              (this._wordTransformer = void 0);
          }
          pushWordTransform(e) {
            this._wordTransformer = new L(this._wordTransformer, e);
          }
          popWordTransform() {
            if (!this._wordTransformer) return;
            const e = this._wordTransformer.transform;
            return (this._wordTransformer = this._wordTransformer.next), e;
          }
          startNoWrap() {
            this._stackItem.isNoWrap = !0;
          }
          stopNoWrap() {
            this._stackItem.isNoWrap = !1;
          }
          _getCombinedWordTransformer() {
            const e = this._wordTransformer ? e => D(e, this._wordTransformer) : void 0,
              t = this.options.encodeCharacters;
            return e ? (t ? n => t(e(n)) : e) : t;
          }
          _popStackItem() {
            const e = this._stackItem;
            return (this._stackItem = e.next), e;
          }
          addLineBreak() {
            (this._stackItem instanceof w ||
              this._stackItem instanceof k ||
              this._stackItem instanceof S) &&
              (this._stackItem.isPre
                ? (this._stackItem.rawText += '\n')
                : this._stackItem.inlineTextBuilder.startNewLine());
          }
          addWordBreakOpportunity() {
            (this._stackItem instanceof w ||
              this._stackItem instanceof k ||
              this._stackItem instanceof S) &&
              (this._stackItem.inlineTextBuilder.wordBreakOpportunity = !0);
          }
          addInline(e, { noWordTransform: t = !1 } = {}) {
            if (
              this._stackItem instanceof w ||
              this._stackItem instanceof k ||
              this._stackItem instanceof S
            )
              if (this._stackItem.isPre) this._stackItem.rawText += e;
              else if (
                0 !== e.length &&
                (!this._stackItem.stashedLineBreaks ||
                  this.whitespaceProcessor.testContainsWords(e))
              ) {
                if (this.options.preserveNewlines) {
                  const t = this.whitespaceProcessor.countNewlinesNoWords(e);
                  if (t > 0) return void this._stackItem.inlineTextBuilder.startNewLine(t);
                }
                this._stackItem.stashedLineBreaks &&
                  this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks),
                  this.whitespaceProcessor.shrinkWrapAdd(
                    e,
                    this._stackItem.inlineTextBuilder,
                    t ? void 0 : this._getCombinedWordTransformer(),
                    this._stackItem.isNoWrap
                  ),
                  (this._stackItem.stashedLineBreaks = 0);
              }
          }
          addLiteral(e) {
            (this._stackItem instanceof w ||
              this._stackItem instanceof k ||
              this._stackItem instanceof S) &&
              0 !== e.length &&
              (this._stackItem.isPre
                ? (this._stackItem.rawText += e)
                : (this._stackItem.stashedLineBreaks &&
                    this._stackItem.inlineTextBuilder.startNewLine(
                      this._stackItem.stashedLineBreaks
                    ),
                  this.whitespaceProcessor.addLiteral(
                    e,
                    this._stackItem.inlineTextBuilder,
                    this._stackItem.isNoWrap
                  ),
                  (this._stackItem.stashedLineBreaks = 0)));
          }
          openBlock({ leadingLineBreaks: e = 1, reservedLineLength: t = 0, isPre: n = !1 } = {}) {
            const r = Math.max(20, this._stackItem.inlineTextBuilder.maxLineLength - t);
            (this._stackItem = new w(this.options, this._stackItem, e, r)),
              n && (this._stackItem.isPre = !0);
          }
          closeBlock({ trailingLineBreaks: e = 1, blockTransform: t } = {}) {
            const n = this._popStackItem(),
              r = t ? t(N(n)) : N(n);
            I(this._stackItem, r, n.leadingLineBreaks, Math.max(n.stashedLineBreaks, e));
          }
          openList({
            maxPrefixLength: e = 0,
            prefixAlign: t = 'left',
            interRowLineBreaks: n = 1,
            leadingLineBreaks: r = 2,
          } = {}) {
            this._stackItem = new T(this.options, this._stackItem, {
              interRowLineBreaks: n,
              leadingLineBreaks: r,
              maxLineLength: this._stackItem.inlineTextBuilder.maxLineLength,
              maxPrefixLength: e,
              prefixAlign: t,
            });
          }
          openListItem({ prefix: e = '' } = {}) {
            if (!(this._stackItem instanceof T))
              throw new Error(
                "Can't add a list item to something that is not a list! Check the formatter."
              );
            const t = this._stackItem,
              n = Math.max(e.length, t.maxPrefixLength),
              r = Math.max(20, t.inlineTextBuilder.maxLineLength - n);
            this._stackItem = new k(this.options, t, {
              prefix: e,
              maxLineLength: r,
              leadingLineBreaks: t.interRowLineBreaks,
            });
          }
          closeListItem() {
            const e = this._popStackItem(),
              t = e.next,
              n = Math.max(e.prefix.length, t.maxPrefixLength),
              r = '\n' + ' '.repeat(n);
            I(
              t,
              ('right' === t.prefixAlign ? e.prefix.padStart(n) : e.prefix.padEnd(n)) +
                N(e).replace(/\n/g, r),
              e.leadingLineBreaks,
              Math.max(e.stashedLineBreaks, t.interRowLineBreaks)
            );
          }
          closeList({ trailingLineBreaks: e = 2 } = {}) {
            const t = this._popStackItem(),
              n = N(t);
            n && I(this._stackItem, n, t.leadingLineBreaks, e);
          }
          openTable() {
            this._stackItem = new _(this._stackItem);
          }
          openTableRow() {
            if (!(this._stackItem instanceof _))
              throw new Error(
                "Can't add a table row to something that is not a table! Check the formatter."
              );
            this._stackItem = new E(this._stackItem);
          }
          openTableCell({ maxColumnWidth: e } = {}) {
            if (!(this._stackItem instanceof E))
              throw new Error(
                "Can't add a table cell to something that is not a table row! Check the formatter."
              );
            this._stackItem = new S(this.options, this._stackItem, e);
          }
          closeTableCell({ colspan: e = 1, rowspan: t = 1 } = {}) {
            const n = this._popStackItem(),
              r = f(N(n), '\n');
            n.next.cells.push({ colspan: e, rowspan: t, text: r });
          }
          closeTableRow() {
            const e = this._popStackItem();
            e.next.rows.push(e.cells);
          }
          closeTable({ tableToString: e, leadingLineBreaks: t = 2, trailingLineBreaks: n = 2 }) {
            const r = e(this._popStackItem().rows);
            r && I(this._stackItem, r, t, n);
          }
          toString() {
            return N(this._stackItem.getRoot());
          }
        }
        function N(e) {
          if (!(e instanceof w || e instanceof k || e instanceof S))
            throw new Error(
              'Only blocks, list items and table cells can be requested for text contents.'
            );
          return e.inlineTextBuilder.isEmpty()
            ? e.rawText
            : e.rawText + e.inlineTextBuilder.toString();
        }
        function I(e, t, n, r) {
          if (!(e instanceof w || e instanceof k || e instanceof S))
            throw new Error('Only blocks, list items and table cells can contain text.');
          const i = N(e),
            o = Math.max(e.stashedLineBreaks, n);
          e.inlineTextBuilder.clear(),
            i ? (e.rawText = i + '\n'.repeat(o) + t) : ((e.rawText = t), (e.leadingLineBreaks = o)),
            (e.stashedLineBreaks = r);
        }
        function D(e, t) {
          return t ? D(t.transform(e), t.next) : e;
        }
        function O(e, t, n) {
          if (!t) return;
          const r = n.options;
          t.length > r.limits.maxChildNodes &&
            (t = t.slice(0, r.limits.maxChildNodes)).push({
              data: r.limits.ellipsis,
              type: 'text',
            });
          for (const i of t)
            switch (i.type) {
              case 'text':
                n.addInline(i.data);
                break;
              case 'tag': {
                const t = n.picker.pick1(i);
                (0, r.formatters[t.format])(i, e, n, t.options || {});
                break;
              }
            }
        }
        function q(e) {
          const t =
            e.attribs && e.attribs.length
              ? ' ' +
                Object.entries(e.attribs)
                  .map(([e, t]) => ('' === t ? e : `${e}=${t.replace(/"/g, '&quot;')}`))
                  .join(' ')
              : '';
          return `<${e.name}${t}>`;
        }
        function B(e) {
          return `</${e.name}>`;
        }
        var j = Object.freeze({
          __proto__: null,
          block: function (e, t, n, r) {
            n.openBlock({ leadingLineBreaks: r.leadingLineBreaks || 2 }),
              t(e.children, n),
              n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks || 2 });
          },
          blockHtml: function (e, t, n, r) {
            n.openBlock({ leadingLineBreaks: r.leadingLineBreaks || 2 }),
              n.startNoWrap(),
              n.addLiteral(s.render(e, { decodeEntities: n.options.decodeEntities })),
              n.stopNoWrap(),
              n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks || 2 });
          },
          blockString: function (e, t, n, r) {
            n.openBlock({ leadingLineBreaks: r.leadingLineBreaks || 2 }),
              n.addLiteral(r.string || ''),
              n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks || 2 });
          },
          blockTag: function (e, t, n, r) {
            n.openBlock({ leadingLineBreaks: r.leadingLineBreaks || 2 }),
              n.startNoWrap(),
              n.addLiteral(q(e)),
              n.stopNoWrap(),
              t(e.children, n),
              n.startNoWrap(),
              n.addLiteral(B(e)),
              n.stopNoWrap(),
              n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks || 2 });
          },
          inline: function (e, t, n, r) {
            t(e.children, n);
          },
          inlineHtml: function (e, t, n, r) {
            n.startNoWrap(),
              n.addLiteral(s.render(e, { decodeEntities: n.options.decodeEntities })),
              n.stopNoWrap();
          },
          inlineString: function (e, t, n, r) {
            n.addLiteral(r.string || '');
          },
          inlineSurround: function (e, t, n, r) {
            n.addLiteral(r.prefix || ''), t(e.children, n), n.addLiteral(r.suffix || '');
          },
          inlineTag: function (e, t, n, r) {
            n.startNoWrap(),
              n.addLiteral(q(e)),
              n.stopNoWrap(),
              t(e.children, n),
              n.startNoWrap(),
              n.addLiteral(B(e)),
              n.stopNoWrap();
          },
          skip: function (e, t, n, r) {},
        });
        function P(e, t) {
          return e[t] || (e[t] = []), e[t];
        }
        function M(e, t = 0) {
          for (; e[t]; ) t++;
          return t;
        }
        function R(e, t, n, r) {
          for (let i = 0; i < e.rowspan; i++) {
            const o = P(t, n + i);
            for (let t = 0; t < e.colspan; t++) o[r + t] = e;
          }
        }
        function H(e, t) {
          return void 0 === e[t] && (e[t] = 0 === t ? 0 : 1 + H(e, t - 1)), e[t];
        }
        function W(e, t, n, r) {
          e[t + n] = Math.max(H(e, t + n), H(e, t) + r);
        }
        function U(e, t) {
          return t
            ? ('string' == typeof t[0] ? t[0] : '[') + e + ('string' == typeof t[1] ? t[1] : ']')
            : e;
        }
        function $(e, t, n, r, i) {
          const o = 'function' == typeof t ? t(e, r, i) : e;
          return '/' === o[0] && n
            ? (function (e) {
                let t = e.length;
                for (; t > 0 && '/' === e[t - 1]; ) --t;
                return t < e.length ? e.substring(0, t) : e;
              })(n) + o
            : o;
        }
        function F(e, t, n, r, i) {
          const o = 'li' === h(e, ['parent', 'name']);
          let a = 0;
          const s = (e.children || [])
            .filter(e => 'text' !== e.type || !/^\s*$/.test(e.data))
            .map(function (e) {
              if ('li' !== e.name) return { node: e, prefix: '' };
              const t = o ? i().trimStart() : i();
              return t.length > a && (a = t.length), { node: e, prefix: t };
            });
          if (s.length) {
            n.openList({
              interRowLineBreaks: 1,
              leadingLineBreaks: o ? 1 : r.leadingLineBreaks || 2,
              maxPrefixLength: a,
              prefixAlign: 'left',
            });
            for (const { node: e, prefix: r } of s)
              n.openListItem({ prefix: r }), t([e], n), n.closeListItem();
            n.closeList({ trailingLineBreaks: o ? 1 : r.trailingLineBreaks || 2 });
          }
        }
        function V(e, t, n, r) {
          function i(e) {
            const i = +h(e, ['attribs', 'colspan']) || 1,
              o = +h(e, ['attribs', 'rowspan']) || 1;
            n.openTableCell({ maxColumnWidth: r.maxColumnWidth }),
              t(e.children, n),
              n.closeTableCell({ colspan: i, rowspan: o });
          }
          n.openTable(),
            e.children.forEach(function e(t) {
              if ('tag' !== t.type) return;
              const o =
                !1 !== r.uppercaseHeaderCells
                  ? e => {
                      n.pushWordTransform(e => e.toUpperCase()), i(e), n.popWordTransform();
                    }
                  : i;
              switch (t.name) {
                case 'thead':
                case 'tbody':
                case 'tfoot':
                case 'center':
                  return void t.children.forEach(e);
                case 'tr':
                  n.openTableRow();
                  for (const e of t.children)
                    if ('tag' === e.type)
                      switch (e.name) {
                        case 'th':
                          o(e);
                          break;
                        case 'td':
                          i(e);
                      }
                  n.closeTableRow();
              }
            }),
            n.closeTable({
              tableToString: e =>
                (function (e, t, n) {
                  const r = [];
                  let i = 0;
                  const o = e.length,
                    a = [0];
                  for (let n = 0; n < o; n++) {
                    const o = P(r, n),
                      s = e[n];
                    let c = 0;
                    for (let e = 0; e < s.length; e++) {
                      const i = s[e];
                      (c = M(o, c)),
                        R(i, r, n, c),
                        (c += i.colspan),
                        (i.lines = i.text.split('\n'));
                      const l = i.lines.length;
                      W(a, n, i.rowspan, l + t);
                    }
                    i = o.length > i ? o.length : i;
                  }
                  !(function (e, t) {
                    for (let n = 0; n < t; n++) {
                      const t = P(e, n);
                      for (let r = 0; r < n; r++) {
                        const i = P(e, r);
                        if (t[r] || i[n]) {
                          const e = t[r];
                          (t[r] = i[n]), (i[n] = e);
                        }
                      }
                    }
                  })(r, o > i ? o : i);
                  const s = [],
                    c = [0];
                  for (let e = 0; e < i; e++) {
                    let t,
                      i = 0;
                    const l = Math.min(o, r[e].length);
                    for (; i < l; )
                      if (((t = r[e][i]), t)) {
                        if (!t.rendered) {
                          let r = 0;
                          for (let n = 0; n < t.lines.length; n++) {
                            const o = t.lines[n],
                              l = a[i] + n;
                            (s[l] = (s[l] || '').padEnd(c[e]) + o),
                              (r = o.length > r ? o.length : r);
                          }
                          W(c, e, t.colspan, r + n), (t.rendered = !0);
                        }
                        i += t.rowspan;
                      } else {
                        const e = a[i];
                        (s[e] = s[e] || ''), i++;
                      }
                  }
                  return s.join('\n');
                })(e, r.rowSpacing ?? 0, r.colSpacing ?? 3),
              leadingLineBreaks: r.leadingLineBreaks,
              trailingLineBreaks: r.trailingLineBreaks,
            });
        }
        var G = Object.freeze({
          __proto__: null,
          anchor: function (e, t, n, r) {
            const i = (function () {
              if (r.ignoreHref) return '';
              if (!e.attribs || !e.attribs.href) return '';
              let t = e.attribs.href.replace(/^mailto:/, '');
              return r.noAnchorUrl && '#' === t[0]
                ? ''
                : ((t = $(t, r.pathRewrite, r.baseUrl, n.metadata, e)), t);
            })();
            if (i) {
              let o = '';
              n.pushWordTransform(e => (e && (o += e), e)),
                t(e.children, n),
                n.popWordTransform(),
                (r.hideLinkHrefIfSameAsText && i === o) ||
                  n.addInline(o ? ' ' + U(i, r.linkBrackets) : i, { noWordTransform: !0 });
            } else t(e.children, n);
          },
          blockquote: function (e, t, n, r) {
            n.openBlock({ leadingLineBreaks: r.leadingLineBreaks || 2, reservedLineLength: 2 }),
              t(e.children, n),
              n.closeBlock({
                trailingLineBreaks: r.trailingLineBreaks || 2,
                blockTransform: e =>
                  (!1 !== r.trimEmptyLines ? f(e, '\n') : e)
                    .split('\n')
                    .map(e => '> ' + e)
                    .join('\n'),
              });
          },
          dataTable: V,
          heading: function (e, t, n, r) {
            n.openBlock({ leadingLineBreaks: r.leadingLineBreaks || 2 }),
              !1 !== r.uppercase
                ? (n.pushWordTransform(e => e.toUpperCase()),
                  t(e.children, n),
                  n.popWordTransform())
                : t(e.children, n),
              n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks || 2 });
          },
          horizontalLine: function (e, t, n, r) {
            n.openBlock({ leadingLineBreaks: r.leadingLineBreaks || 2 }),
              n.addInline('-'.repeat(r.length || n.options.wordwrap || 40)),
              n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks || 2 });
          },
          image: function (e, t, n, r) {
            const i = e.attribs || {},
              o = i.alt ? i.alt : '',
              a = i.src ? $(i.src, r.pathRewrite, r.baseUrl, n.metadata, e) : '',
              s = a ? (o ? o + ' ' + U(a, r.linkBrackets) : U(a, r.linkBrackets)) : o;
            n.addInline(s, { noWordTransform: !0 });
          },
          lineBreak: function (e, t, n, r) {
            n.addLineBreak();
          },
          orderedList: function (e, t, n, r) {
            let i = Number(e.attribs.start || '1');
            const o = (function (e = '1') {
              switch (e) {
                case 'a':
                  return e => m(e, 'a');
                case 'A':
                  return e => m(e, 'A');
                case 'i':
                  return e => v(e).toLowerCase();
                case 'I':
                  return e => v(e);
                default:
                  return e => e.toString();
              }
            })(e.attribs.type);
            return F(e, t, n, r, () => ' ' + o(i++) + '. ');
          },
          paragraph: function (e, t, n, r) {
            n.openBlock({ leadingLineBreaks: r.leadingLineBreaks || 2 }),
              t(e.children, n),
              n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks || 2 });
          },
          pre: function (e, t, n, r) {
            n.openBlock({ isPre: !0, leadingLineBreaks: r.leadingLineBreaks || 2 }),
              t(e.children, n),
              n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks || 2 });
          },
          table: function (e, t, n, r) {
            return (function (e, t) {
              if (!0 === t) return !0;
              if (!e) return !1;
              const { classes: n, ids: r } = (function (e) {
                  const t = [],
                    n = [];
                  for (const r of e)
                    r.startsWith('.')
                      ? t.push(r.substring(1))
                      : r.startsWith('#') && n.push(r.substring(1));
                  return { classes: t, ids: n };
                })(t),
                i = (e.class || '').split(' '),
                o = (e.id || '').split(' ');
              return i.some(e => n.includes(e)) || o.some(e => r.includes(e));
            })(e.attribs, n.options.tables)
              ? V(e, t, n, r)
              : (function (e, t, n, r) {
                  n.openBlock({ leadingLineBreaks: r.leadingLineBreaks }),
                    t(e.children, n),
                    n.closeBlock({ trailingLineBreaks: r.trailingLineBreaks });
                })(e, t, n, r);
          },
          unorderedList: function (e, t, n, r) {
            const i = r.itemPrefix || ' * ';
            return F(e, t, n, r, () => i);
          },
          wbr: function (e, t, n, r) {
            n.addWordBreakOpportunity();
          },
        });
        const z = {
            baseElements: { selectors: ['body'], orderBy: 'selectors', returnDomByDefault: !0 },
            decodeEntities: !0,
            encodeCharacters: {},
            formatters: {},
            limits: {
              ellipsis: '...',
              maxBaseElements: void 0,
              maxChildNodes: void 0,
              maxDepth: void 0,
              maxInputLength: 1 << 24,
            },
            longWordSplit: { forceWrapOnLimit: !1, wrapCharacters: [] },
            preserveNewlines: !1,
            selectors: [
              { selector: '*', format: 'inline' },
              {
                selector: 'a',
                format: 'anchor',
                options: {
                  baseUrl: null,
                  hideLinkHrefIfSameAsText: !1,
                  ignoreHref: !1,
                  linkBrackets: ['[', ']'],
                  noAnchorUrl: !0,
                },
              },
              {
                selector: 'article',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'aside',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'blockquote',
                format: 'blockquote',
                options: { leadingLineBreaks: 2, trailingLineBreaks: 2, trimEmptyLines: !0 },
              },
              { selector: 'br', format: 'lineBreak' },
              {
                selector: 'div',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'footer',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'form',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'h1',
                format: 'heading',
                options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: !0 },
              },
              {
                selector: 'h2',
                format: 'heading',
                options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: !0 },
              },
              {
                selector: 'h3',
                format: 'heading',
                options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: !0 },
              },
              {
                selector: 'h4',
                format: 'heading',
                options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: !0 },
              },
              {
                selector: 'h5',
                format: 'heading',
                options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: !0 },
              },
              {
                selector: 'h6',
                format: 'heading',
                options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: !0 },
              },
              {
                selector: 'header',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'hr',
                format: 'horizontalLine',
                options: { leadingLineBreaks: 2, length: void 0, trailingLineBreaks: 2 },
              },
              {
                selector: 'img',
                format: 'image',
                options: { baseUrl: null, linkBrackets: ['[', ']'] },
              },
              {
                selector: 'main',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'nav',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'ol',
                format: 'orderedList',
                options: { leadingLineBreaks: 2, trailingLineBreaks: 2 },
              },
              {
                selector: 'p',
                format: 'paragraph',
                options: { leadingLineBreaks: 2, trailingLineBreaks: 2 },
              },
              {
                selector: 'pre',
                format: 'pre',
                options: { leadingLineBreaks: 2, trailingLineBreaks: 2 },
              },
              {
                selector: 'section',
                format: 'block',
                options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
              },
              {
                selector: 'table',
                format: 'table',
                options: {
                  colSpacing: 3,
                  leadingLineBreaks: 2,
                  maxColumnWidth: 60,
                  rowSpacing: 0,
                  trailingLineBreaks: 2,
                  uppercaseHeaderCells: !0,
                },
              },
              {
                selector: 'ul',
                format: 'unorderedList',
                options: { itemPrefix: ' * ', leadingLineBreaks: 2, trailingLineBreaks: 2 },
              },
              { selector: 'wbr', format: 'wbr' },
            ],
            tables: [],
            whitespaceCharacters: ' \t\r\n\f​',
            wordwrap: 80,
          },
          Q = (e, t, n) => [...t],
          X = (e, t, n) =>
            e.some(e => 'object' == typeof e) ? ((e, t) => [...e, ...t])(e, t) : Q(0, t);
        function J(e = {}) {
          return (
            ((e = l.default(z, e, {
              arrayMerge: Q,
              customMerge: e => ('selectors' === e ? X : void 0),
            })).formatters = Object.assign({}, j, G, e.formatters)),
            (e.selectors = d(e.selectors, e => e.selector)),
            (function (e) {
              if (e.tags) {
                const t = Object.entries(e.tags).map(([e, t]) => ({ ...t, selector: e || '*' }));
                e.selectors.push(...t), (e.selectors = d(e.selectors, e => e.selector));
              }
              function t(e, t, n) {
                const r = t.pop();
                for (const n of t) {
                  let t = e[n];
                  t || ((t = {}), (e[n] = t)), (e = t);
                }
                e[r] = n;
              }
              if (e.baseElement) {
                const n = e.baseElement;
                t(e, ['baseElements', 'selectors'], Array.isArray(n) ? n : [n]);
              }
              void 0 !== e.returnDomByDefault &&
                t(e, ['baseElements', 'returnDomByDefault'], e.returnDomByDefault);
              for (const n of e.selectors)
                'anchor' === n.format &&
                  h(n, ['options', 'noLinkBrackets']) &&
                  t(n, ['options', 'linkBrackets'], !1);
            })(e),
            (function (e = {}) {
              const t = e.selectors.filter(e => !e.format);
              if (t.length)
                throw new Error(
                  'Following selectors have no specified format: ' +
                    t.map(e => `\`${e.selector}\``).join(', ')
                );
              const n = new o.DecisionTree(e.selectors.map(e => [e.selector, e])).build(
                r.hp2Builder
              );
              'function' != typeof e.encodeCharacters &&
                (e.encodeCharacters = (function (e) {
                  if (!e || 0 === Object.keys(e).length) return;
                  const t = Object.entries(e).filter(([, e]) => !1 !== e),
                    n = new RegExp(
                      t
                        .map(([e]) => {
                          return `(${
                            ((t = [...e][0]),
                            t.replace(
                              /[\s\S]/g,
                              e => '\\u' + e.charCodeAt().toString(16).padStart(4, '0')
                            ))
                          })`;
                          var t;
                        })
                        .join('|'),
                      'g'
                    ),
                    r = t.map(([, e]) => e),
                    i = (e, ...t) => r[t.findIndex(e => e)];
                  return e => e.replace(n, i);
                })(e.encodeCharacters));
              const a = new o.DecisionTree(
                e.baseElements.selectors.map((e, t) => [e, t + 1])
              ).build(r.hp2Builder);
              function s(t) {
                return (function (e, t, n) {
                  const r = [],
                    i = u(t.limits.maxDepth, function (e, i) {
                      i = i.slice(0, t.limits.maxChildNodes);
                      for (const o of i) {
                        if ('tag' !== o.type) continue;
                        const i = n.pick1(o);
                        if (
                          (i > 0
                            ? r.push({ selectorIndex: i, element: o })
                            : o.children && e(o.children),
                          r.length >= t.limits.maxBaseElements)
                        )
                          return;
                      }
                    });
                  return (
                    i(e),
                    'occurrence' !== t.baseElements.orderBy &&
                      r.sort((e, t) => e.selectorIndex - t.selectorIndex),
                    t.baseElements.returnDomByDefault && 0 === r.length ? e : r.map(e => e.element)
                  );
                })(t, e, a);
              }
              const c = u(e.limits.maxDepth, O, function (t, n) {
                n.addInline(e.limits.ellipsis || '');
              });
              return function (t, r = void 0) {
                return (function (e, t, n, r, o, a) {
                  const s = n.limits.maxInputLength;
                  s &&
                    e &&
                    e.length > s &&
                    (console.warn(
                      `Input length ${e.length} is above allowed limit of ${s}. Truncating without ellipsis.`
                    ),
                    (e = e.substring(0, s)));
                  const c = o(i.parseDocument(e, { decodeEntities: n.decodeEntities }).children),
                    l = new C(n, r, t);
                  return a(c, l), l.toString();
                })(t, r, e, n, s, c);
              };
            })(e)
          );
        }
        function Z(e, t = {}, n = void 0) {
          return J(t)(e, n);
        }
        (t.compile = J), (t.convert = Z), (t.htmlToText = Z);
      },
      664: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.filter = function (e, t, n, r) {
            return (
              void 0 === n && (n = !0),
              void 0 === r && (r = 1 / 0),
              i(e, Array.isArray(t) ? t : [t], n, r)
            );
          }),
          (t.find = i),
          (t.findOneChild = function (e, t) {
            return t.find(e);
          }),
          (t.findOne = function e(t, n, i) {
            void 0 === i && (i = !0);
            for (var o = Array.isArray(n) ? n : [n], a = 0; a < o.length; a++) {
              var s = o[a];
              if ((0, r.isTag)(s) && t(s)) return s;
              if (i && (0, r.hasChildren)(s) && s.children.length > 0) {
                var c = e(t, s.children, !0);
                if (c) return c;
              }
            }
            return null;
          }),
          (t.existsOne = function e(t, n) {
            return (Array.isArray(n) ? n : [n]).some(function (n) {
              return ((0, r.isTag)(n) && t(n)) || ((0, r.hasChildren)(n) && e(t, n.children));
            });
          }),
          (t.findAll = function (e, t) {
            for (var n = [], i = [Array.isArray(t) ? t : [t]], o = [0]; ; )
              if (o[0] >= i[0].length) {
                if (1 === i.length) return n;
                i.shift(), o.shift();
              } else {
                var a = i[0][o[0]++];
                (0, r.isTag)(a) && e(a) && n.push(a),
                  (0, r.hasChildren)(a) &&
                    a.children.length > 0 &&
                    (o.unshift(0), i.unshift(a.children));
              }
          });
        var r = n(23);
        function i(e, t, n, i) {
          for (var o = [], a = [Array.isArray(t) ? t : [t]], s = [0]; ; )
            if (s[0] >= a[0].length) {
              if (1 === s.length) return o;
              a.shift(), s.shift();
            } else {
              var c = a[0][s[0]++];
              if (e(c) && (o.push(c), --i <= 0)) return o;
              n &&
                (0, r.hasChildren)(c) &&
                c.children.length > 0 &&
                (s.unshift(0), a.unshift(c.children));
            }
        }
      },
      665: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.escapeText =
            t.escapeAttribute =
            t.escapeUTF8 =
            t.escape =
            t.encodeXML =
            t.getCodePoint =
            t.xmlReplacer =
              void 0),
          (t.xmlReplacer = /["&'<>$\x80-\uFFFF]/g);
        var n = new Map([
          [34, '&quot;'],
          [38, '&amp;'],
          [39, '&apos;'],
          [60, '&lt;'],
          [62, '&gt;'],
        ]);
        function r(e) {
          for (var r, i = '', o = 0; null !== (r = t.xmlReplacer.exec(e)); ) {
            var a = r.index,
              s = e.charCodeAt(a),
              c = n.get(s);
            void 0 !== c
              ? ((i += e.substring(o, a) + c), (o = a + 1))
              : ((i += ''
                  .concat(e.substring(o, a), '&#x')
                  .concat((0, t.getCodePoint)(e, a).toString(16), ';')),
                (o = t.xmlReplacer.lastIndex += Number(55296 == (64512 & s))));
          }
          return i + e.substr(o);
        }
        function i(e, t) {
          return function (n) {
            for (var r, i = 0, o = ''; (r = e.exec(n)); )
              i !== r.index && (o += n.substring(i, r.index)),
                (o += t.get(r[0].charCodeAt(0))),
                (i = r.index + 1);
            return o + n.substring(i);
          };
        }
        (t.getCodePoint =
          null != String.prototype.codePointAt
            ? function (e, t) {
                return e.codePointAt(t);
              }
            : function (e, t) {
                return 55296 == (64512 & e.charCodeAt(t))
                  ? 1024 * (e.charCodeAt(t) - 55296) + e.charCodeAt(t + 1) - 56320 + 65536
                  : e.charCodeAt(t);
              }),
          (t.encodeXML = r),
          (t.escape = r),
          (t.escapeUTF8 = i(/[&<>'"]/g, n)),
          (t.escapeAttribute = i(
            /["&\u00A0]/g,
            new Map([
              [34, '&quot;'],
              [38, '&amp;'],
              [160, '&nbsp;'],
            ])
          )),
          (t.escapeText = i(
            /[&<>\u00A0]/g,
            new Map([
              [38, '&amp;'],
              [60, '&lt;'],
              [62, '&gt;'],
              [160, '&nbsp;'],
            ])
          ));
      },
      679: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.testElement = function (e, t) {
            var n = c(e);
            return !n || n(t);
          }),
          (t.getElements = function (e, t, n, r) {
            void 0 === r && (r = 1 / 0);
            var o = c(e);
            return o ? (0, i.filter)(o, t, n, r) : [];
          }),
          (t.getElementById = function (e, t, n) {
            return (
              void 0 === n && (n = !0),
              Array.isArray(t) || (t = [t]),
              (0, i.findOne)(a('id', e), t, n)
            );
          }),
          (t.getElementsByTagName = function (e, t, n, r) {
            return (
              void 0 === n && (n = !0),
              void 0 === r && (r = 1 / 0),
              (0, i.filter)(o.tag_name(e), t, n, r)
            );
          }),
          (t.getElementsByClassName = function (e, t, n, r) {
            return (
              void 0 === n && (n = !0),
              void 0 === r && (r = 1 / 0),
              (0, i.filter)(a('class', e), t, n, r)
            );
          }),
          (t.getElementsByTagType = function (e, t, n, r) {
            return (
              void 0 === n && (n = !0),
              void 0 === r && (r = 1 / 0),
              (0, i.filter)(o.tag_type(e), t, n, r)
            );
          });
        var r = n(23),
          i = n(664),
          o = {
            tag_name: function (e) {
              return 'function' == typeof e
                ? function (t) {
                    return (0, r.isTag)(t) && e(t.name);
                  }
                : '*' === e
                ? r.isTag
                : function (t) {
                    return (0, r.isTag)(t) && t.name === e;
                  };
            },
            tag_type: function (e) {
              return 'function' == typeof e
                ? function (t) {
                    return e(t.type);
                  }
                : function (t) {
                    return t.type === e;
                  };
            },
            tag_contains: function (e) {
              return 'function' == typeof e
                ? function (t) {
                    return (0, r.isText)(t) && e(t.data);
                  }
                : function (t) {
                    return (0, r.isText)(t) && t.data === e;
                  };
            },
          };
        function a(e, t) {
          return 'function' == typeof t
            ? function (n) {
                return (0, r.isTag)(n) && t(n.attribs[e]);
              }
            : function (n) {
                return (0, r.isTag)(n) && n.attribs[e] === t;
              };
        }
        function s(e, t) {
          return function (n) {
            return e(n) || t(n);
          };
        }
        function c(e) {
          var t = Object.keys(e).map(function (t) {
            var n = e[t];
            return Object.prototype.hasOwnProperty.call(o, t) ? o[t](n) : a(t, n);
          });
          return 0 === t.length ? null : t.reduce(s);
        }
      },
      685: (e, t) => {
        'use strict';
        function n(e) {
          if ((e.prev && (e.prev.next = e.next), e.next && (e.next.prev = e.prev), e.parent)) {
            var t = e.parent.children,
              n = t.lastIndexOf(e);
            n >= 0 && t.splice(n, 1);
          }
          (e.next = null), (e.prev = null), (e.parent = null);
        }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.removeElement = n),
          (t.replaceElement = function (e, t) {
            var n = (t.prev = e.prev);
            n && (n.next = t);
            var r = (t.next = e.next);
            r && (r.prev = t);
            var i = (t.parent = e.parent);
            if (i) {
              var o = i.children;
              (o[o.lastIndexOf(e)] = t), (e.parent = null);
            }
          }),
          (t.appendChild = function (e, t) {
            if ((n(t), (t.next = null), (t.parent = e), e.children.push(t) > 1)) {
              var r = e.children[e.children.length - 2];
              (r.next = t), (t.prev = r);
            } else t.prev = null;
          }),
          (t.append = function (e, t) {
            n(t);
            var r = e.parent,
              i = e.next;
            if (((t.next = i), (t.prev = e), (e.next = t), (t.parent = r), i)) {
              if (((i.prev = t), r)) {
                var o = r.children;
                o.splice(o.lastIndexOf(i), 0, t);
              }
            } else r && r.children.push(t);
          }),
          (t.prependChild = function (e, t) {
            if ((n(t), (t.parent = e), (t.prev = null), 1 !== e.children.unshift(t))) {
              var r = e.children[1];
              (r.prev = t), (t.next = r);
            } else t.next = null;
          }),
          (t.prepend = function (e, t) {
            n(t);
            var r = e.parent;
            if (r) {
              var i = r.children;
              i.splice(i.indexOf(e), 0, t);
            }
            e.prev && (e.prev.next = t),
              (t.parent = r),
              (t.prev = e.prev),
              (t.next = e),
              (e.prev = t);
          });
      },
      758: (e, t) => {
        'use strict';
        function n(e) {
          for (var t = 1; t < e.length; t++) e[t][0] += e[t - 1][0] + 1;
          return e;
        }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = new Map(
            n([
              [9, '&Tab;'],
              [0, '&NewLine;'],
              [22, '&excl;'],
              [0, '&quot;'],
              [0, '&num;'],
              [0, '&dollar;'],
              [0, '&percnt;'],
              [0, '&amp;'],
              [0, '&apos;'],
              [0, '&lpar;'],
              [0, '&rpar;'],
              [0, '&ast;'],
              [0, '&plus;'],
              [0, '&comma;'],
              [1, '&period;'],
              [0, '&sol;'],
              [10, '&colon;'],
              [0, '&semi;'],
              [0, { v: '&lt;', n: 8402, o: '&nvlt;' }],
              [0, { v: '&equals;', n: 8421, o: '&bne;' }],
              [0, { v: '&gt;', n: 8402, o: '&nvgt;' }],
              [0, '&quest;'],
              [0, '&commat;'],
              [26, '&lbrack;'],
              [0, '&bsol;'],
              [0, '&rbrack;'],
              [0, '&Hat;'],
              [0, '&lowbar;'],
              [0, '&DiacriticalGrave;'],
              [5, { n: 106, o: '&fjlig;' }],
              [20, '&lbrace;'],
              [0, '&verbar;'],
              [0, '&rbrace;'],
              [34, '&nbsp;'],
              [0, '&iexcl;'],
              [0, '&cent;'],
              [0, '&pound;'],
              [0, '&curren;'],
              [0, '&yen;'],
              [0, '&brvbar;'],
              [0, '&sect;'],
              [0, '&die;'],
              [0, '&copy;'],
              [0, '&ordf;'],
              [0, '&laquo;'],
              [0, '&not;'],
              [0, '&shy;'],
              [0, '&circledR;'],
              [0, '&macr;'],
              [0, '&deg;'],
              [0, '&PlusMinus;'],
              [0, '&sup2;'],
              [0, '&sup3;'],
              [0, '&acute;'],
              [0, '&micro;'],
              [0, '&para;'],
              [0, '&centerdot;'],
              [0, '&cedil;'],
              [0, '&sup1;'],
              [0, '&ordm;'],
              [0, '&raquo;'],
              [0, '&frac14;'],
              [0, '&frac12;'],
              [0, '&frac34;'],
              [0, '&iquest;'],
              [0, '&Agrave;'],
              [0, '&Aacute;'],
              [0, '&Acirc;'],
              [0, '&Atilde;'],
              [0, '&Auml;'],
              [0, '&angst;'],
              [0, '&AElig;'],
              [0, '&Ccedil;'],
              [0, '&Egrave;'],
              [0, '&Eacute;'],
              [0, '&Ecirc;'],
              [0, '&Euml;'],
              [0, '&Igrave;'],
              [0, '&Iacute;'],
              [0, '&Icirc;'],
              [0, '&Iuml;'],
              [0, '&ETH;'],
              [0, '&Ntilde;'],
              [0, '&Ograve;'],
              [0, '&Oacute;'],
              [0, '&Ocirc;'],
              [0, '&Otilde;'],
              [0, '&Ouml;'],
              [0, '&times;'],
              [0, '&Oslash;'],
              [0, '&Ugrave;'],
              [0, '&Uacute;'],
              [0, '&Ucirc;'],
              [0, '&Uuml;'],
              [0, '&Yacute;'],
              [0, '&THORN;'],
              [0, '&szlig;'],
              [0, '&agrave;'],
              [0, '&aacute;'],
              [0, '&acirc;'],
              [0, '&atilde;'],
              [0, '&auml;'],
              [0, '&aring;'],
              [0, '&aelig;'],
              [0, '&ccedil;'],
              [0, '&egrave;'],
              [0, '&eacute;'],
              [0, '&ecirc;'],
              [0, '&euml;'],
              [0, '&igrave;'],
              [0, '&iacute;'],
              [0, '&icirc;'],
              [0, '&iuml;'],
              [0, '&eth;'],
              [0, '&ntilde;'],
              [0, '&ograve;'],
              [0, '&oacute;'],
              [0, '&ocirc;'],
              [0, '&otilde;'],
              [0, '&ouml;'],
              [0, '&div;'],
              [0, '&oslash;'],
              [0, '&ugrave;'],
              [0, '&uacute;'],
              [0, '&ucirc;'],
              [0, '&uuml;'],
              [0, '&yacute;'],
              [0, '&thorn;'],
              [0, '&yuml;'],
              [0, '&Amacr;'],
              [0, '&amacr;'],
              [0, '&Abreve;'],
              [0, '&abreve;'],
              [0, '&Aogon;'],
              [0, '&aogon;'],
              [0, '&Cacute;'],
              [0, '&cacute;'],
              [0, '&Ccirc;'],
              [0, '&ccirc;'],
              [0, '&Cdot;'],
              [0, '&cdot;'],
              [0, '&Ccaron;'],
              [0, '&ccaron;'],
              [0, '&Dcaron;'],
              [0, '&dcaron;'],
              [0, '&Dstrok;'],
              [0, '&dstrok;'],
              [0, '&Emacr;'],
              [0, '&emacr;'],
              [2, '&Edot;'],
              [0, '&edot;'],
              [0, '&Eogon;'],
              [0, '&eogon;'],
              [0, '&Ecaron;'],
              [0, '&ecaron;'],
              [0, '&Gcirc;'],
              [0, '&gcirc;'],
              [0, '&Gbreve;'],
              [0, '&gbreve;'],
              [0, '&Gdot;'],
              [0, '&gdot;'],
              [0, '&Gcedil;'],
              [1, '&Hcirc;'],
              [0, '&hcirc;'],
              [0, '&Hstrok;'],
              [0, '&hstrok;'],
              [0, '&Itilde;'],
              [0, '&itilde;'],
              [0, '&Imacr;'],
              [0, '&imacr;'],
              [2, '&Iogon;'],
              [0, '&iogon;'],
              [0, '&Idot;'],
              [0, '&imath;'],
              [0, '&IJlig;'],
              [0, '&ijlig;'],
              [0, '&Jcirc;'],
              [0, '&jcirc;'],
              [0, '&Kcedil;'],
              [0, '&kcedil;'],
              [0, '&kgreen;'],
              [0, '&Lacute;'],
              [0, '&lacute;'],
              [0, '&Lcedil;'],
              [0, '&lcedil;'],
              [0, '&Lcaron;'],
              [0, '&lcaron;'],
              [0, '&Lmidot;'],
              [0, '&lmidot;'],
              [0, '&Lstrok;'],
              [0, '&lstrok;'],
              [0, '&Nacute;'],
              [0, '&nacute;'],
              [0, '&Ncedil;'],
              [0, '&ncedil;'],
              [0, '&Ncaron;'],
              [0, '&ncaron;'],
              [0, '&napos;'],
              [0, '&ENG;'],
              [0, '&eng;'],
              [0, '&Omacr;'],
              [0, '&omacr;'],
              [2, '&Odblac;'],
              [0, '&odblac;'],
              [0, '&OElig;'],
              [0, '&oelig;'],
              [0, '&Racute;'],
              [0, '&racute;'],
              [0, '&Rcedil;'],
              [0, '&rcedil;'],
              [0, '&Rcaron;'],
              [0, '&rcaron;'],
              [0, '&Sacute;'],
              [0, '&sacute;'],
              [0, '&Scirc;'],
              [0, '&scirc;'],
              [0, '&Scedil;'],
              [0, '&scedil;'],
              [0, '&Scaron;'],
              [0, '&scaron;'],
              [0, '&Tcedil;'],
              [0, '&tcedil;'],
              [0, '&Tcaron;'],
              [0, '&tcaron;'],
              [0, '&Tstrok;'],
              [0, '&tstrok;'],
              [0, '&Utilde;'],
              [0, '&utilde;'],
              [0, '&Umacr;'],
              [0, '&umacr;'],
              [0, '&Ubreve;'],
              [0, '&ubreve;'],
              [0, '&Uring;'],
              [0, '&uring;'],
              [0, '&Udblac;'],
              [0, '&udblac;'],
              [0, '&Uogon;'],
              [0, '&uogon;'],
              [0, '&Wcirc;'],
              [0, '&wcirc;'],
              [0, '&Ycirc;'],
              [0, '&ycirc;'],
              [0, '&Yuml;'],
              [0, '&Zacute;'],
              [0, '&zacute;'],
              [0, '&Zdot;'],
              [0, '&zdot;'],
              [0, '&Zcaron;'],
              [0, '&zcaron;'],
              [19, '&fnof;'],
              [34, '&imped;'],
              [63, '&gacute;'],
              [65, '&jmath;'],
              [142, '&circ;'],
              [0, '&caron;'],
              [16, '&breve;'],
              [0, '&DiacriticalDot;'],
              [0, '&ring;'],
              [0, '&ogon;'],
              [0, '&DiacriticalTilde;'],
              [0, '&dblac;'],
              [51, '&DownBreve;'],
              [127, '&Alpha;'],
              [0, '&Beta;'],
              [0, '&Gamma;'],
              [0, '&Delta;'],
              [0, '&Epsilon;'],
              [0, '&Zeta;'],
              [0, '&Eta;'],
              [0, '&Theta;'],
              [0, '&Iota;'],
              [0, '&Kappa;'],
              [0, '&Lambda;'],
              [0, '&Mu;'],
              [0, '&Nu;'],
              [0, '&Xi;'],
              [0, '&Omicron;'],
              [0, '&Pi;'],
              [0, '&Rho;'],
              [1, '&Sigma;'],
              [0, '&Tau;'],
              [0, '&Upsilon;'],
              [0, '&Phi;'],
              [0, '&Chi;'],
              [0, '&Psi;'],
              [0, '&ohm;'],
              [7, '&alpha;'],
              [0, '&beta;'],
              [0, '&gamma;'],
              [0, '&delta;'],
              [0, '&epsi;'],
              [0, '&zeta;'],
              [0, '&eta;'],
              [0, '&theta;'],
              [0, '&iota;'],
              [0, '&kappa;'],
              [0, '&lambda;'],
              [0, '&mu;'],
              [0, '&nu;'],
              [0, '&xi;'],
              [0, '&omicron;'],
              [0, '&pi;'],
              [0, '&rho;'],
              [0, '&sigmaf;'],
              [0, '&sigma;'],
              [0, '&tau;'],
              [0, '&upsi;'],
              [0, '&phi;'],
              [0, '&chi;'],
              [0, '&psi;'],
              [0, '&omega;'],
              [7, '&thetasym;'],
              [0, '&Upsi;'],
              [2, '&phiv;'],
              [0, '&piv;'],
              [5, '&Gammad;'],
              [0, '&digamma;'],
              [18, '&kappav;'],
              [0, '&rhov;'],
              [3, '&epsiv;'],
              [0, '&backepsilon;'],
              [10, '&IOcy;'],
              [0, '&DJcy;'],
              [0, '&GJcy;'],
              [0, '&Jukcy;'],
              [0, '&DScy;'],
              [0, '&Iukcy;'],
              [0, '&YIcy;'],
              [0, '&Jsercy;'],
              [0, '&LJcy;'],
              [0, '&NJcy;'],
              [0, '&TSHcy;'],
              [0, '&KJcy;'],
              [1, '&Ubrcy;'],
              [0, '&DZcy;'],
              [0, '&Acy;'],
              [0, '&Bcy;'],
              [0, '&Vcy;'],
              [0, '&Gcy;'],
              [0, '&Dcy;'],
              [0, '&IEcy;'],
              [0, '&ZHcy;'],
              [0, '&Zcy;'],
              [0, '&Icy;'],
              [0, '&Jcy;'],
              [0, '&Kcy;'],
              [0, '&Lcy;'],
              [0, '&Mcy;'],
              [0, '&Ncy;'],
              [0, '&Ocy;'],
              [0, '&Pcy;'],
              [0, '&Rcy;'],
              [0, '&Scy;'],
              [0, '&Tcy;'],
              [0, '&Ucy;'],
              [0, '&Fcy;'],
              [0, '&KHcy;'],
              [0, '&TScy;'],
              [0, '&CHcy;'],
              [0, '&SHcy;'],
              [0, '&SHCHcy;'],
              [0, '&HARDcy;'],
              [0, '&Ycy;'],
              [0, '&SOFTcy;'],
              [0, '&Ecy;'],
              [0, '&YUcy;'],
              [0, '&YAcy;'],
              [0, '&acy;'],
              [0, '&bcy;'],
              [0, '&vcy;'],
              [0, '&gcy;'],
              [0, '&dcy;'],
              [0, '&iecy;'],
              [0, '&zhcy;'],
              [0, '&zcy;'],
              [0, '&icy;'],
              [0, '&jcy;'],
              [0, '&kcy;'],
              [0, '&lcy;'],
              [0, '&mcy;'],
              [0, '&ncy;'],
              [0, '&ocy;'],
              [0, '&pcy;'],
              [0, '&rcy;'],
              [0, '&scy;'],
              [0, '&tcy;'],
              [0, '&ucy;'],
              [0, '&fcy;'],
              [0, '&khcy;'],
              [0, '&tscy;'],
              [0, '&chcy;'],
              [0, '&shcy;'],
              [0, '&shchcy;'],
              [0, '&hardcy;'],
              [0, '&ycy;'],
              [0, '&softcy;'],
              [0, '&ecy;'],
              [0, '&yucy;'],
              [0, '&yacy;'],
              [1, '&iocy;'],
              [0, '&djcy;'],
              [0, '&gjcy;'],
              [0, '&jukcy;'],
              [0, '&dscy;'],
              [0, '&iukcy;'],
              [0, '&yicy;'],
              [0, '&jsercy;'],
              [0, '&ljcy;'],
              [0, '&njcy;'],
              [0, '&tshcy;'],
              [0, '&kjcy;'],
              [1, '&ubrcy;'],
              [0, '&dzcy;'],
              [7074, '&ensp;'],
              [0, '&emsp;'],
              [0, '&emsp13;'],
              [0, '&emsp14;'],
              [1, '&numsp;'],
              [0, '&puncsp;'],
              [0, '&ThinSpace;'],
              [0, '&hairsp;'],
              [0, '&NegativeMediumSpace;'],
              [0, '&zwnj;'],
              [0, '&zwj;'],
              [0, '&lrm;'],
              [0, '&rlm;'],
              [0, '&dash;'],
              [2, '&ndash;'],
              [0, '&mdash;'],
              [0, '&horbar;'],
              [0, '&Verbar;'],
              [1, '&lsquo;'],
              [0, '&CloseCurlyQuote;'],
              [0, '&lsquor;'],
              [1, '&ldquo;'],
              [0, '&CloseCurlyDoubleQuote;'],
              [0, '&bdquo;'],
              [1, '&dagger;'],
              [0, '&Dagger;'],
              [0, '&bull;'],
              [2, '&nldr;'],
              [0, '&hellip;'],
              [9, '&permil;'],
              [0, '&pertenk;'],
              [0, '&prime;'],
              [0, '&Prime;'],
              [0, '&tprime;'],
              [0, '&backprime;'],
              [3, '&lsaquo;'],
              [0, '&rsaquo;'],
              [3, '&oline;'],
              [2, '&caret;'],
              [1, '&hybull;'],
              [0, '&frasl;'],
              [10, '&bsemi;'],
              [7, '&qprime;'],
              [7, { v: '&MediumSpace;', n: 8202, o: '&ThickSpace;' }],
              [0, '&NoBreak;'],
              [0, '&af;'],
              [0, '&InvisibleTimes;'],
              [0, '&ic;'],
              [72, '&euro;'],
              [46, '&tdot;'],
              [0, '&DotDot;'],
              [37, '&complexes;'],
              [2, '&incare;'],
              [4, '&gscr;'],
              [0, '&hamilt;'],
              [0, '&Hfr;'],
              [0, '&Hopf;'],
              [0, '&planckh;'],
              [0, '&hbar;'],
              [0, '&imagline;'],
              [0, '&Ifr;'],
              [0, '&lagran;'],
              [0, '&ell;'],
              [1, '&naturals;'],
              [0, '&numero;'],
              [0, '&copysr;'],
              [0, '&weierp;'],
              [0, '&Popf;'],
              [0, '&Qopf;'],
              [0, '&realine;'],
              [0, '&real;'],
              [0, '&reals;'],
              [0, '&rx;'],
              [3, '&trade;'],
              [1, '&integers;'],
              [2, '&mho;'],
              [0, '&zeetrf;'],
              [0, '&iiota;'],
              [2, '&bernou;'],
              [0, '&Cayleys;'],
              [1, '&escr;'],
              [0, '&Escr;'],
              [0, '&Fouriertrf;'],
              [1, '&Mellintrf;'],
              [0, '&order;'],
              [0, '&alefsym;'],
              [0, '&beth;'],
              [0, '&gimel;'],
              [0, '&daleth;'],
              [12, '&CapitalDifferentialD;'],
              [0, '&dd;'],
              [0, '&ee;'],
              [0, '&ii;'],
              [10, '&frac13;'],
              [0, '&frac23;'],
              [0, '&frac15;'],
              [0, '&frac25;'],
              [0, '&frac35;'],
              [0, '&frac45;'],
              [0, '&frac16;'],
              [0, '&frac56;'],
              [0, '&frac18;'],
              [0, '&frac38;'],
              [0, '&frac58;'],
              [0, '&frac78;'],
              [49, '&larr;'],
              [0, '&ShortUpArrow;'],
              [0, '&rarr;'],
              [0, '&darr;'],
              [0, '&harr;'],
              [0, '&updownarrow;'],
              [0, '&nwarr;'],
              [0, '&nearr;'],
              [0, '&LowerRightArrow;'],
              [0, '&LowerLeftArrow;'],
              [0, '&nlarr;'],
              [0, '&nrarr;'],
              [1, { v: '&rarrw;', n: 824, o: '&nrarrw;' }],
              [0, '&Larr;'],
              [0, '&Uarr;'],
              [0, '&Rarr;'],
              [0, '&Darr;'],
              [0, '&larrtl;'],
              [0, '&rarrtl;'],
              [0, '&LeftTeeArrow;'],
              [0, '&mapstoup;'],
              [0, '&map;'],
              [0, '&DownTeeArrow;'],
              [1, '&hookleftarrow;'],
              [0, '&hookrightarrow;'],
              [0, '&larrlp;'],
              [0, '&looparrowright;'],
              [0, '&harrw;'],
              [0, '&nharr;'],
              [1, '&lsh;'],
              [0, '&rsh;'],
              [0, '&ldsh;'],
              [0, '&rdsh;'],
              [1, '&crarr;'],
              [0, '&cularr;'],
              [0, '&curarr;'],
              [2, '&circlearrowleft;'],
              [0, '&circlearrowright;'],
              [0, '&leftharpoonup;'],
              [0, '&DownLeftVector;'],
              [0, '&RightUpVector;'],
              [0, '&LeftUpVector;'],
              [0, '&rharu;'],
              [0, '&DownRightVector;'],
              [0, '&dharr;'],
              [0, '&dharl;'],
              [0, '&RightArrowLeftArrow;'],
              [0, '&udarr;'],
              [0, '&LeftArrowRightArrow;'],
              [0, '&leftleftarrows;'],
              [0, '&upuparrows;'],
              [0, '&rightrightarrows;'],
              [0, '&ddarr;'],
              [0, '&leftrightharpoons;'],
              [0, '&Equilibrium;'],
              [0, '&nlArr;'],
              [0, '&nhArr;'],
              [0, '&nrArr;'],
              [0, '&DoubleLeftArrow;'],
              [0, '&DoubleUpArrow;'],
              [0, '&DoubleRightArrow;'],
              [0, '&dArr;'],
              [0, '&DoubleLeftRightArrow;'],
              [0, '&DoubleUpDownArrow;'],
              [0, '&nwArr;'],
              [0, '&neArr;'],
              [0, '&seArr;'],
              [0, '&swArr;'],
              [0, '&lAarr;'],
              [0, '&rAarr;'],
              [1, '&zigrarr;'],
              [6, '&larrb;'],
              [0, '&rarrb;'],
              [15, '&DownArrowUpArrow;'],
              [7, '&loarr;'],
              [0, '&roarr;'],
              [0, '&hoarr;'],
              [0, '&forall;'],
              [0, '&comp;'],
              [0, { v: '&part;', n: 824, o: '&npart;' }],
              [0, '&exist;'],
              [0, '&nexist;'],
              [0, '&empty;'],
              [1, '&Del;'],
              [0, '&Element;'],
              [0, '&NotElement;'],
              [1, '&ni;'],
              [0, '&notni;'],
              [2, '&prod;'],
              [0, '&coprod;'],
              [0, '&sum;'],
              [0, '&minus;'],
              [0, '&MinusPlus;'],
              [0, '&dotplus;'],
              [1, '&Backslash;'],
              [0, '&lowast;'],
              [0, '&compfn;'],
              [1, '&radic;'],
              [2, '&prop;'],
              [0, '&infin;'],
              [0, '&angrt;'],
              [0, { v: '&ang;', n: 8402, o: '&nang;' }],
              [0, '&angmsd;'],
              [0, '&angsph;'],
              [0, '&mid;'],
              [0, '&nmid;'],
              [0, '&DoubleVerticalBar;'],
              [0, '&NotDoubleVerticalBar;'],
              [0, '&and;'],
              [0, '&or;'],
              [0, { v: '&cap;', n: 65024, o: '&caps;' }],
              [0, { v: '&cup;', n: 65024, o: '&cups;' }],
              [0, '&int;'],
              [0, '&Int;'],
              [0, '&iiint;'],
              [0, '&conint;'],
              [0, '&Conint;'],
              [0, '&Cconint;'],
              [0, '&cwint;'],
              [0, '&ClockwiseContourIntegral;'],
              [0, '&awconint;'],
              [0, '&there4;'],
              [0, '&becaus;'],
              [0, '&ratio;'],
              [0, '&Colon;'],
              [0, '&dotminus;'],
              [1, '&mDDot;'],
              [0, '&homtht;'],
              [0, { v: '&sim;', n: 8402, o: '&nvsim;' }],
              [0, { v: '&backsim;', n: 817, o: '&race;' }],
              [0, { v: '&ac;', n: 819, o: '&acE;' }],
              [0, '&acd;'],
              [0, '&VerticalTilde;'],
              [0, '&NotTilde;'],
              [0, { v: '&eqsim;', n: 824, o: '&nesim;' }],
              [0, '&sime;'],
              [0, '&NotTildeEqual;'],
              [0, '&cong;'],
              [0, '&simne;'],
              [0, '&ncong;'],
              [0, '&ap;'],
              [0, '&nap;'],
              [0, '&ape;'],
              [0, { v: '&apid;', n: 824, o: '&napid;' }],
              [0, '&backcong;'],
              [0, { v: '&asympeq;', n: 8402, o: '&nvap;' }],
              [0, { v: '&bump;', n: 824, o: '&nbump;' }],
              [0, { v: '&bumpe;', n: 824, o: '&nbumpe;' }],
              [0, { v: '&doteq;', n: 824, o: '&nedot;' }],
              [0, '&doteqdot;'],
              [0, '&efDot;'],
              [0, '&erDot;'],
              [0, '&Assign;'],
              [0, '&ecolon;'],
              [0, '&ecir;'],
              [0, '&circeq;'],
              [1, '&wedgeq;'],
              [0, '&veeeq;'],
              [1, '&triangleq;'],
              [2, '&equest;'],
              [0, '&ne;'],
              [0, { v: '&Congruent;', n: 8421, o: '&bnequiv;' }],
              [0, '&nequiv;'],
              [1, { v: '&le;', n: 8402, o: '&nvle;' }],
              [0, { v: '&ge;', n: 8402, o: '&nvge;' }],
              [0, { v: '&lE;', n: 824, o: '&nlE;' }],
              [0, { v: '&gE;', n: 824, o: '&ngE;' }],
              [0, { v: '&lnE;', n: 65024, o: '&lvertneqq;' }],
              [0, { v: '&gnE;', n: 65024, o: '&gvertneqq;' }],
              [
                0,
                {
                  v: '&ll;',
                  n: new Map(
                    n([
                      [824, '&nLtv;'],
                      [7577, '&nLt;'],
                    ])
                  ),
                },
              ],
              [
                0,
                {
                  v: '&gg;',
                  n: new Map(
                    n([
                      [824, '&nGtv;'],
                      [7577, '&nGt;'],
                    ])
                  ),
                },
              ],
              [0, '&between;'],
              [0, '&NotCupCap;'],
              [0, '&nless;'],
              [0, '&ngt;'],
              [0, '&nle;'],
              [0, '&nge;'],
              [0, '&lesssim;'],
              [0, '&GreaterTilde;'],
              [0, '&nlsim;'],
              [0, '&ngsim;'],
              [0, '&LessGreater;'],
              [0, '&gl;'],
              [0, '&NotLessGreater;'],
              [0, '&NotGreaterLess;'],
              [0, '&pr;'],
              [0, '&sc;'],
              [0, '&prcue;'],
              [0, '&sccue;'],
              [0, '&PrecedesTilde;'],
              [0, { v: '&scsim;', n: 824, o: '&NotSucceedsTilde;' }],
              [0, '&NotPrecedes;'],
              [0, '&NotSucceeds;'],
              [0, { v: '&sub;', n: 8402, o: '&NotSubset;' }],
              [0, { v: '&sup;', n: 8402, o: '&NotSuperset;' }],
              [0, '&nsub;'],
              [0, '&nsup;'],
              [0, '&sube;'],
              [0, '&supe;'],
              [0, '&NotSubsetEqual;'],
              [0, '&NotSupersetEqual;'],
              [0, { v: '&subne;', n: 65024, o: '&varsubsetneq;' }],
              [0, { v: '&supne;', n: 65024, o: '&varsupsetneq;' }],
              [1, '&cupdot;'],
              [0, '&UnionPlus;'],
              [0, { v: '&sqsub;', n: 824, o: '&NotSquareSubset;' }],
              [0, { v: '&sqsup;', n: 824, o: '&NotSquareSuperset;' }],
              [0, '&sqsube;'],
              [0, '&sqsupe;'],
              [0, { v: '&sqcap;', n: 65024, o: '&sqcaps;' }],
              [0, { v: '&sqcup;', n: 65024, o: '&sqcups;' }],
              [0, '&CirclePlus;'],
              [0, '&CircleMinus;'],
              [0, '&CircleTimes;'],
              [0, '&osol;'],
              [0, '&CircleDot;'],
              [0, '&circledcirc;'],
              [0, '&circledast;'],
              [1, '&circleddash;'],
              [0, '&boxplus;'],
              [0, '&boxminus;'],
              [0, '&boxtimes;'],
              [0, '&dotsquare;'],
              [0, '&RightTee;'],
              [0, '&dashv;'],
              [0, '&DownTee;'],
              [0, '&bot;'],
              [1, '&models;'],
              [0, '&DoubleRightTee;'],
              [0, '&Vdash;'],
              [0, '&Vvdash;'],
              [0, '&VDash;'],
              [0, '&nvdash;'],
              [0, '&nvDash;'],
              [0, '&nVdash;'],
              [0, '&nVDash;'],
              [0, '&prurel;'],
              [1, '&LeftTriangle;'],
              [0, '&RightTriangle;'],
              [0, { v: '&LeftTriangleEqual;', n: 8402, o: '&nvltrie;' }],
              [0, { v: '&RightTriangleEqual;', n: 8402, o: '&nvrtrie;' }],
              [0, '&origof;'],
              [0, '&imof;'],
              [0, '&multimap;'],
              [0, '&hercon;'],
              [0, '&intcal;'],
              [0, '&veebar;'],
              [1, '&barvee;'],
              [0, '&angrtvb;'],
              [0, '&lrtri;'],
              [0, '&bigwedge;'],
              [0, '&bigvee;'],
              [0, '&bigcap;'],
              [0, '&bigcup;'],
              [0, '&diam;'],
              [0, '&sdot;'],
              [0, '&sstarf;'],
              [0, '&divideontimes;'],
              [0, '&bowtie;'],
              [0, '&ltimes;'],
              [0, '&rtimes;'],
              [0, '&leftthreetimes;'],
              [0, '&rightthreetimes;'],
              [0, '&backsimeq;'],
              [0, '&curlyvee;'],
              [0, '&curlywedge;'],
              [0, '&Sub;'],
              [0, '&Sup;'],
              [0, '&Cap;'],
              [0, '&Cup;'],
              [0, '&fork;'],
              [0, '&epar;'],
              [0, '&lessdot;'],
              [0, '&gtdot;'],
              [0, { v: '&Ll;', n: 824, o: '&nLl;' }],
              [0, { v: '&Gg;', n: 824, o: '&nGg;' }],
              [0, { v: '&leg;', n: 65024, o: '&lesg;' }],
              [0, { v: '&gel;', n: 65024, o: '&gesl;' }],
              [2, '&cuepr;'],
              [0, '&cuesc;'],
              [0, '&NotPrecedesSlantEqual;'],
              [0, '&NotSucceedsSlantEqual;'],
              [0, '&NotSquareSubsetEqual;'],
              [0, '&NotSquareSupersetEqual;'],
              [2, '&lnsim;'],
              [0, '&gnsim;'],
              [0, '&precnsim;'],
              [0, '&scnsim;'],
              [0, '&nltri;'],
              [0, '&NotRightTriangle;'],
              [0, '&nltrie;'],
              [0, '&NotRightTriangleEqual;'],
              [0, '&vellip;'],
              [0, '&ctdot;'],
              [0, '&utdot;'],
              [0, '&dtdot;'],
              [0, '&disin;'],
              [0, '&isinsv;'],
              [0, '&isins;'],
              [0, { v: '&isindot;', n: 824, o: '&notindot;' }],
              [0, '&notinvc;'],
              [0, '&notinvb;'],
              [1, { v: '&isinE;', n: 824, o: '&notinE;' }],
              [0, '&nisd;'],
              [0, '&xnis;'],
              [0, '&nis;'],
              [0, '&notnivc;'],
              [0, '&notnivb;'],
              [6, '&barwed;'],
              [0, '&Barwed;'],
              [1, '&lceil;'],
              [0, '&rceil;'],
              [0, '&LeftFloor;'],
              [0, '&rfloor;'],
              [0, '&drcrop;'],
              [0, '&dlcrop;'],
              [0, '&urcrop;'],
              [0, '&ulcrop;'],
              [0, '&bnot;'],
              [1, '&profline;'],
              [0, '&profsurf;'],
              [1, '&telrec;'],
              [0, '&target;'],
              [5, '&ulcorn;'],
              [0, '&urcorn;'],
              [0, '&dlcorn;'],
              [0, '&drcorn;'],
              [2, '&frown;'],
              [0, '&smile;'],
              [9, '&cylcty;'],
              [0, '&profalar;'],
              [7, '&topbot;'],
              [6, '&ovbar;'],
              [1, '&solbar;'],
              [60, '&angzarr;'],
              [51, '&lmoustache;'],
              [0, '&rmoustache;'],
              [2, '&OverBracket;'],
              [0, '&bbrk;'],
              [0, '&bbrktbrk;'],
              [37, '&OverParenthesis;'],
              [0, '&UnderParenthesis;'],
              [0, '&OverBrace;'],
              [0, '&UnderBrace;'],
              [2, '&trpezium;'],
              [4, '&elinters;'],
              [59, '&blank;'],
              [164, '&circledS;'],
              [55, '&boxh;'],
              [1, '&boxv;'],
              [9, '&boxdr;'],
              [3, '&boxdl;'],
              [3, '&boxur;'],
              [3, '&boxul;'],
              [3, '&boxvr;'],
              [7, '&boxvl;'],
              [7, '&boxhd;'],
              [7, '&boxhu;'],
              [7, '&boxvh;'],
              [19, '&boxH;'],
              [0, '&boxV;'],
              [0, '&boxdR;'],
              [0, '&boxDr;'],
              [0, '&boxDR;'],
              [0, '&boxdL;'],
              [0, '&boxDl;'],
              [0, '&boxDL;'],
              [0, '&boxuR;'],
              [0, '&boxUr;'],
              [0, '&boxUR;'],
              [0, '&boxuL;'],
              [0, '&boxUl;'],
              [0, '&boxUL;'],
              [0, '&boxvR;'],
              [0, '&boxVr;'],
              [0, '&boxVR;'],
              [0, '&boxvL;'],
              [0, '&boxVl;'],
              [0, '&boxVL;'],
              [0, '&boxHd;'],
              [0, '&boxhD;'],
              [0, '&boxHD;'],
              [0, '&boxHu;'],
              [0, '&boxhU;'],
              [0, '&boxHU;'],
              [0, '&boxvH;'],
              [0, '&boxVh;'],
              [0, '&boxVH;'],
              [19, '&uhblk;'],
              [3, '&lhblk;'],
              [3, '&block;'],
              [8, '&blk14;'],
              [0, '&blk12;'],
              [0, '&blk34;'],
              [13, '&square;'],
              [8, '&blacksquare;'],
              [0, '&EmptyVerySmallSquare;'],
              [1, '&rect;'],
              [0, '&marker;'],
              [2, '&fltns;'],
              [1, '&bigtriangleup;'],
              [0, '&blacktriangle;'],
              [0, '&triangle;'],
              [2, '&blacktriangleright;'],
              [0, '&rtri;'],
              [3, '&bigtriangledown;'],
              [0, '&blacktriangledown;'],
              [0, '&dtri;'],
              [2, '&blacktriangleleft;'],
              [0, '&ltri;'],
              [6, '&loz;'],
              [0, '&cir;'],
              [32, '&tridot;'],
              [2, '&bigcirc;'],
              [8, '&ultri;'],
              [0, '&urtri;'],
              [0, '&lltri;'],
              [0, '&EmptySmallSquare;'],
              [0, '&FilledSmallSquare;'],
              [8, '&bigstar;'],
              [0, '&star;'],
              [7, '&phone;'],
              [49, '&female;'],
              [1, '&male;'],
              [29, '&spades;'],
              [2, '&clubs;'],
              [1, '&hearts;'],
              [0, '&diamondsuit;'],
              [3, '&sung;'],
              [2, '&flat;'],
              [0, '&natural;'],
              [0, '&sharp;'],
              [163, '&check;'],
              [3, '&cross;'],
              [8, '&malt;'],
              [21, '&sext;'],
              [33, '&VerticalSeparator;'],
              [25, '&lbbrk;'],
              [0, '&rbbrk;'],
              [84, '&bsolhsub;'],
              [0, '&suphsol;'],
              [28, '&LeftDoubleBracket;'],
              [0, '&RightDoubleBracket;'],
              [0, '&lang;'],
              [0, '&rang;'],
              [0, '&Lang;'],
              [0, '&Rang;'],
              [0, '&loang;'],
              [0, '&roang;'],
              [7, '&longleftarrow;'],
              [0, '&longrightarrow;'],
              [0, '&longleftrightarrow;'],
              [0, '&DoubleLongLeftArrow;'],
              [0, '&DoubleLongRightArrow;'],
              [0, '&DoubleLongLeftRightArrow;'],
              [1, '&longmapsto;'],
              [2, '&dzigrarr;'],
              [258, '&nvlArr;'],
              [0, '&nvrArr;'],
              [0, '&nvHarr;'],
              [0, '&Map;'],
              [6, '&lbarr;'],
              [0, '&bkarow;'],
              [0, '&lBarr;'],
              [0, '&dbkarow;'],
              [0, '&drbkarow;'],
              [0, '&DDotrahd;'],
              [0, '&UpArrowBar;'],
              [0, '&DownArrowBar;'],
              [2, '&Rarrtl;'],
              [2, '&latail;'],
              [0, '&ratail;'],
              [0, '&lAtail;'],
              [0, '&rAtail;'],
              [0, '&larrfs;'],
              [0, '&rarrfs;'],
              [0, '&larrbfs;'],
              [0, '&rarrbfs;'],
              [2, '&nwarhk;'],
              [0, '&nearhk;'],
              [0, '&hksearow;'],
              [0, '&hkswarow;'],
              [0, '&nwnear;'],
              [0, '&nesear;'],
              [0, '&seswar;'],
              [0, '&swnwar;'],
              [8, { v: '&rarrc;', n: 824, o: '&nrarrc;' }],
              [1, '&cudarrr;'],
              [0, '&ldca;'],
              [0, '&rdca;'],
              [0, '&cudarrl;'],
              [0, '&larrpl;'],
              [2, '&curarrm;'],
              [0, '&cularrp;'],
              [7, '&rarrpl;'],
              [2, '&harrcir;'],
              [0, '&Uarrocir;'],
              [0, '&lurdshar;'],
              [0, '&ldrushar;'],
              [2, '&LeftRightVector;'],
              [0, '&RightUpDownVector;'],
              [0, '&DownLeftRightVector;'],
              [0, '&LeftUpDownVector;'],
              [0, '&LeftVectorBar;'],
              [0, '&RightVectorBar;'],
              [0, '&RightUpVectorBar;'],
              [0, '&RightDownVectorBar;'],
              [0, '&DownLeftVectorBar;'],
              [0, '&DownRightVectorBar;'],
              [0, '&LeftUpVectorBar;'],
              [0, '&LeftDownVectorBar;'],
              [0, '&LeftTeeVector;'],
              [0, '&RightTeeVector;'],
              [0, '&RightUpTeeVector;'],
              [0, '&RightDownTeeVector;'],
              [0, '&DownLeftTeeVector;'],
              [0, '&DownRightTeeVector;'],
              [0, '&LeftUpTeeVector;'],
              [0, '&LeftDownTeeVector;'],
              [0, '&lHar;'],
              [0, '&uHar;'],
              [0, '&rHar;'],
              [0, '&dHar;'],
              [0, '&luruhar;'],
              [0, '&ldrdhar;'],
              [0, '&ruluhar;'],
              [0, '&rdldhar;'],
              [0, '&lharul;'],
              [0, '&llhard;'],
              [0, '&rharul;'],
              [0, '&lrhard;'],
              [0, '&udhar;'],
              [0, '&duhar;'],
              [0, '&RoundImplies;'],
              [0, '&erarr;'],
              [0, '&simrarr;'],
              [0, '&larrsim;'],
              [0, '&rarrsim;'],
              [0, '&rarrap;'],
              [0, '&ltlarr;'],
              [1, '&gtrarr;'],
              [0, '&subrarr;'],
              [1, '&suplarr;'],
              [0, '&lfisht;'],
              [0, '&rfisht;'],
              [0, '&ufisht;'],
              [0, '&dfisht;'],
              [5, '&lopar;'],
              [0, '&ropar;'],
              [4, '&lbrke;'],
              [0, '&rbrke;'],
              [0, '&lbrkslu;'],
              [0, '&rbrksld;'],
              [0, '&lbrksld;'],
              [0, '&rbrkslu;'],
              [0, '&langd;'],
              [0, '&rangd;'],
              [0, '&lparlt;'],
              [0, '&rpargt;'],
              [0, '&gtlPar;'],
              [0, '&ltrPar;'],
              [3, '&vzigzag;'],
              [1, '&vangrt;'],
              [0, '&angrtvbd;'],
              [6, '&ange;'],
              [0, '&range;'],
              [0, '&dwangle;'],
              [0, '&uwangle;'],
              [0, '&angmsdaa;'],
              [0, '&angmsdab;'],
              [0, '&angmsdac;'],
              [0, '&angmsdad;'],
              [0, '&angmsdae;'],
              [0, '&angmsdaf;'],
              [0, '&angmsdag;'],
              [0, '&angmsdah;'],
              [0, '&bemptyv;'],
              [0, '&demptyv;'],
              [0, '&cemptyv;'],
              [0, '&raemptyv;'],
              [0, '&laemptyv;'],
              [0, '&ohbar;'],
              [0, '&omid;'],
              [0, '&opar;'],
              [1, '&operp;'],
              [1, '&olcross;'],
              [0, '&odsold;'],
              [1, '&olcir;'],
              [0, '&ofcir;'],
              [0, '&olt;'],
              [0, '&ogt;'],
              [0, '&cirscir;'],
              [0, '&cirE;'],
              [0, '&solb;'],
              [0, '&bsolb;'],
              [3, '&boxbox;'],
              [3, '&trisb;'],
              [0, '&rtriltri;'],
              [0, { v: '&LeftTriangleBar;', n: 824, o: '&NotLeftTriangleBar;' }],
              [0, { v: '&RightTriangleBar;', n: 824, o: '&NotRightTriangleBar;' }],
              [11, '&iinfin;'],
              [0, '&infintie;'],
              [0, '&nvinfin;'],
              [4, '&eparsl;'],
              [0, '&smeparsl;'],
              [0, '&eqvparsl;'],
              [5, '&blacklozenge;'],
              [8, '&RuleDelayed;'],
              [1, '&dsol;'],
              [9, '&bigodot;'],
              [0, '&bigoplus;'],
              [0, '&bigotimes;'],
              [1, '&biguplus;'],
              [1, '&bigsqcup;'],
              [5, '&iiiint;'],
              [0, '&fpartint;'],
              [2, '&cirfnint;'],
              [0, '&awint;'],
              [0, '&rppolint;'],
              [0, '&scpolint;'],
              [0, '&npolint;'],
              [0, '&pointint;'],
              [0, '&quatint;'],
              [0, '&intlarhk;'],
              [10, '&pluscir;'],
              [0, '&plusacir;'],
              [0, '&simplus;'],
              [0, '&plusdu;'],
              [0, '&plussim;'],
              [0, '&plustwo;'],
              [1, '&mcomma;'],
              [0, '&minusdu;'],
              [2, '&loplus;'],
              [0, '&roplus;'],
              [0, '&Cross;'],
              [0, '&timesd;'],
              [0, '&timesbar;'],
              [1, '&smashp;'],
              [0, '&lotimes;'],
              [0, '&rotimes;'],
              [0, '&otimesas;'],
              [0, '&Otimes;'],
              [0, '&odiv;'],
              [0, '&triplus;'],
              [0, '&triminus;'],
              [0, '&tritime;'],
              [0, '&intprod;'],
              [2, '&amalg;'],
              [0, '&capdot;'],
              [1, '&ncup;'],
              [0, '&ncap;'],
              [0, '&capand;'],
              [0, '&cupor;'],
              [0, '&cupcap;'],
              [0, '&capcup;'],
              [0, '&cupbrcap;'],
              [0, '&capbrcup;'],
              [0, '&cupcup;'],
              [0, '&capcap;'],
              [0, '&ccups;'],
              [0, '&ccaps;'],
              [2, '&ccupssm;'],
              [2, '&And;'],
              [0, '&Or;'],
              [0, '&andand;'],
              [0, '&oror;'],
              [0, '&orslope;'],
              [0, '&andslope;'],
              [1, '&andv;'],
              [0, '&orv;'],
              [0, '&andd;'],
              [0, '&ord;'],
              [1, '&wedbar;'],
              [6, '&sdote;'],
              [3, '&simdot;'],
              [2, { v: '&congdot;', n: 824, o: '&ncongdot;' }],
              [0, '&easter;'],
              [0, '&apacir;'],
              [0, { v: '&apE;', n: 824, o: '&napE;' }],
              [0, '&eplus;'],
              [0, '&pluse;'],
              [0, '&Esim;'],
              [0, '&Colone;'],
              [0, '&Equal;'],
              [1, '&ddotseq;'],
              [0, '&equivDD;'],
              [0, '&ltcir;'],
              [0, '&gtcir;'],
              [0, '&ltquest;'],
              [0, '&gtquest;'],
              [0, { v: '&leqslant;', n: 824, o: '&nleqslant;' }],
              [0, { v: '&geqslant;', n: 824, o: '&ngeqslant;' }],
              [0, '&lesdot;'],
              [0, '&gesdot;'],
              [0, '&lesdoto;'],
              [0, '&gesdoto;'],
              [0, '&lesdotor;'],
              [0, '&gesdotol;'],
              [0, '&lap;'],
              [0, '&gap;'],
              [0, '&lne;'],
              [0, '&gne;'],
              [0, '&lnap;'],
              [0, '&gnap;'],
              [0, '&lEg;'],
              [0, '&gEl;'],
              [0, '&lsime;'],
              [0, '&gsime;'],
              [0, '&lsimg;'],
              [0, '&gsiml;'],
              [0, '&lgE;'],
              [0, '&glE;'],
              [0, '&lesges;'],
              [0, '&gesles;'],
              [0, '&els;'],
              [0, '&egs;'],
              [0, '&elsdot;'],
              [0, '&egsdot;'],
              [0, '&el;'],
              [0, '&eg;'],
              [2, '&siml;'],
              [0, '&simg;'],
              [0, '&simlE;'],
              [0, '&simgE;'],
              [0, { v: '&LessLess;', n: 824, o: '&NotNestedLessLess;' }],
              [0, { v: '&GreaterGreater;', n: 824, o: '&NotNestedGreaterGreater;' }],
              [1, '&glj;'],
              [0, '&gla;'],
              [0, '&ltcc;'],
              [0, '&gtcc;'],
              [0, '&lescc;'],
              [0, '&gescc;'],
              [0, '&smt;'],
              [0, '&lat;'],
              [0, { v: '&smte;', n: 65024, o: '&smtes;' }],
              [0, { v: '&late;', n: 65024, o: '&lates;' }],
              [0, '&bumpE;'],
              [0, { v: '&PrecedesEqual;', n: 824, o: '&NotPrecedesEqual;' }],
              [0, { v: '&sce;', n: 824, o: '&NotSucceedsEqual;' }],
              [2, '&prE;'],
              [0, '&scE;'],
              [0, '&precneqq;'],
              [0, '&scnE;'],
              [0, '&prap;'],
              [0, '&scap;'],
              [0, '&precnapprox;'],
              [0, '&scnap;'],
              [0, '&Pr;'],
              [0, '&Sc;'],
              [0, '&subdot;'],
              [0, '&supdot;'],
              [0, '&subplus;'],
              [0, '&supplus;'],
              [0, '&submult;'],
              [0, '&supmult;'],
              [0, '&subedot;'],
              [0, '&supedot;'],
              [0, { v: '&subE;', n: 824, o: '&nsubE;' }],
              [0, { v: '&supE;', n: 824, o: '&nsupE;' }],
              [0, '&subsim;'],
              [0, '&supsim;'],
              [2, { v: '&subnE;', n: 65024, o: '&varsubsetneqq;' }],
              [0, { v: '&supnE;', n: 65024, o: '&varsupsetneqq;' }],
              [2, '&csub;'],
              [0, '&csup;'],
              [0, '&csube;'],
              [0, '&csupe;'],
              [0, '&subsup;'],
              [0, '&supsub;'],
              [0, '&subsub;'],
              [0, '&supsup;'],
              [0, '&suphsub;'],
              [0, '&supdsub;'],
              [0, '&forkv;'],
              [0, '&topfork;'],
              [0, '&mlcp;'],
              [8, '&Dashv;'],
              [1, '&Vdashl;'],
              [0, '&Barv;'],
              [0, '&vBar;'],
              [0, '&vBarv;'],
              [1, '&Vbar;'],
              [0, '&Not;'],
              [0, '&bNot;'],
              [0, '&rnmid;'],
              [0, '&cirmid;'],
              [0, '&midcir;'],
              [0, '&topcir;'],
              [0, '&nhpar;'],
              [0, '&parsim;'],
              [9, { v: '&parsl;', n: 8421, o: '&nparsl;' }],
              [
                44343,
                {
                  n: new Map(
                    n([
                      [56476, '&Ascr;'],
                      [1, '&Cscr;'],
                      [0, '&Dscr;'],
                      [2, '&Gscr;'],
                      [2, '&Jscr;'],
                      [0, '&Kscr;'],
                      [2, '&Nscr;'],
                      [0, '&Oscr;'],
                      [0, '&Pscr;'],
                      [0, '&Qscr;'],
                      [1, '&Sscr;'],
                      [0, '&Tscr;'],
                      [0, '&Uscr;'],
                      [0, '&Vscr;'],
                      [0, '&Wscr;'],
                      [0, '&Xscr;'],
                      [0, '&Yscr;'],
                      [0, '&Zscr;'],
                      [0, '&ascr;'],
                      [0, '&bscr;'],
                      [0, '&cscr;'],
                      [0, '&dscr;'],
                      [1, '&fscr;'],
                      [1, '&hscr;'],
                      [0, '&iscr;'],
                      [0, '&jscr;'],
                      [0, '&kscr;'],
                      [0, '&lscr;'],
                      [0, '&mscr;'],
                      [0, '&nscr;'],
                      [1, '&pscr;'],
                      [0, '&qscr;'],
                      [0, '&rscr;'],
                      [0, '&sscr;'],
                      [0, '&tscr;'],
                      [0, '&uscr;'],
                      [0, '&vscr;'],
                      [0, '&wscr;'],
                      [0, '&xscr;'],
                      [0, '&yscr;'],
                      [0, '&zscr;'],
                      [52, '&Afr;'],
                      [0, '&Bfr;'],
                      [1, '&Dfr;'],
                      [0, '&Efr;'],
                      [0, '&Ffr;'],
                      [0, '&Gfr;'],
                      [2, '&Jfr;'],
                      [0, '&Kfr;'],
                      [0, '&Lfr;'],
                      [0, '&Mfr;'],
                      [0, '&Nfr;'],
                      [0, '&Ofr;'],
                      [0, '&Pfr;'],
                      [0, '&Qfr;'],
                      [1, '&Sfr;'],
                      [0, '&Tfr;'],
                      [0, '&Ufr;'],
                      [0, '&Vfr;'],
                      [0, '&Wfr;'],
                      [0, '&Xfr;'],
                      [0, '&Yfr;'],
                      [1, '&afr;'],
                      [0, '&bfr;'],
                      [0, '&cfr;'],
                      [0, '&dfr;'],
                      [0, '&efr;'],
                      [0, '&ffr;'],
                      [0, '&gfr;'],
                      [0, '&hfr;'],
                      [0, '&ifr;'],
                      [0, '&jfr;'],
                      [0, '&kfr;'],
                      [0, '&lfr;'],
                      [0, '&mfr;'],
                      [0, '&nfr;'],
                      [0, '&ofr;'],
                      [0, '&pfr;'],
                      [0, '&qfr;'],
                      [0, '&rfr;'],
                      [0, '&sfr;'],
                      [0, '&tfr;'],
                      [0, '&ufr;'],
                      [0, '&vfr;'],
                      [0, '&wfr;'],
                      [0, '&xfr;'],
                      [0, '&yfr;'],
                      [0, '&zfr;'],
                      [0, '&Aopf;'],
                      [0, '&Bopf;'],
                      [1, '&Dopf;'],
                      [0, '&Eopf;'],
                      [0, '&Fopf;'],
                      [0, '&Gopf;'],
                      [1, '&Iopf;'],
                      [0, '&Jopf;'],
                      [0, '&Kopf;'],
                      [0, '&Lopf;'],
                      [0, '&Mopf;'],
                      [1, '&Oopf;'],
                      [3, '&Sopf;'],
                      [0, '&Topf;'],
                      [0, '&Uopf;'],
                      [0, '&Vopf;'],
                      [0, '&Wopf;'],
                      [0, '&Xopf;'],
                      [0, '&Yopf;'],
                      [1, '&aopf;'],
                      [0, '&bopf;'],
                      [0, '&copf;'],
                      [0, '&dopf;'],
                      [0, '&eopf;'],
                      [0, '&fopf;'],
                      [0, '&gopf;'],
                      [0, '&hopf;'],
                      [0, '&iopf;'],
                      [0, '&jopf;'],
                      [0, '&kopf;'],
                      [0, '&lopf;'],
                      [0, '&mopf;'],
                      [0, '&nopf;'],
                      [0, '&oopf;'],
                      [0, '&popf;'],
                      [0, '&qopf;'],
                      [0, '&ropf;'],
                      [0, '&sopf;'],
                      [0, '&topf;'],
                      [0, '&uopf;'],
                      [0, '&vopf;'],
                      [0, '&wopf;'],
                      [0, '&xopf;'],
                      [0, '&yopf;'],
                      [0, '&zopf;'],
                    ])
                  ),
                },
              ],
              [8906, '&fflig;'],
              [0, '&filig;'],
              [0, '&fllig;'],
              [0, '&ffilig;'],
              [0, '&ffllig;'],
            ])
          ));
      },
      762: function (e, t, n) {
        'use strict';
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          o =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && r(t, e, n);
              return i(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.Parser = void 0);
        var a = o(n(184)),
          s = n(972),
          c = new Set(['input', 'option', 'optgroup', 'select', 'button', 'datalist', 'textarea']),
          l = new Set(['p']),
          u = new Set(['thead', 'tbody']),
          f = new Set(['dd', 'dt']),
          d = new Set(['rt', 'rp']),
          p = new Map([
            ['tr', new Set(['tr', 'th', 'td'])],
            ['th', new Set(['th'])],
            ['td', new Set(['thead', 'th', 'td'])],
            ['body', new Set(['head', 'link', 'script'])],
            ['li', new Set(['li'])],
            ['p', l],
            ['h1', l],
            ['h2', l],
            ['h3', l],
            ['h4', l],
            ['h5', l],
            ['h6', l],
            ['select', c],
            ['input', c],
            ['output', c],
            ['button', c],
            ['datalist', c],
            ['textarea', c],
            ['option', new Set(['option'])],
            ['optgroup', new Set(['optgroup', 'option'])],
            ['dd', f],
            ['dt', f],
            ['address', l],
            ['article', l],
            ['aside', l],
            ['blockquote', l],
            ['details', l],
            ['div', l],
            ['dl', l],
            ['fieldset', l],
            ['figcaption', l],
            ['figure', l],
            ['footer', l],
            ['form', l],
            ['header', l],
            ['hr', l],
            ['main', l],
            ['nav', l],
            ['ol', l],
            ['pre', l],
            ['section', l],
            ['table', l],
            ['ul', l],
            ['rt', d],
            ['rp', d],
            ['tbody', u],
            ['tfoot', u],
          ]),
          h = new Set([
            'area',
            'base',
            'basefont',
            'br',
            'col',
            'command',
            'embed',
            'frame',
            'hr',
            'img',
            'input',
            'isindex',
            'keygen',
            'link',
            'meta',
            'param',
            'source',
            'track',
            'wbr',
          ]),
          m = new Set(['math', 'svg']),
          g = new Set([
            'mi',
            'mo',
            'mn',
            'ms',
            'mtext',
            'annotation-xml',
            'foreignobject',
            'desc',
            'title',
          ]),
          y = /\s|\//,
          v = (function () {
            function e(e, t) {
              var n, r, i, o, s;
              void 0 === t && (t = {}),
                (this.options = t),
                (this.startIndex = 0),
                (this.endIndex = 0),
                (this.openTagStart = 0),
                (this.tagname = ''),
                (this.attribname = ''),
                (this.attribvalue = ''),
                (this.attribs = null),
                (this.stack = []),
                (this.foreignContext = []),
                (this.buffers = []),
                (this.bufferOffset = 0),
                (this.writeIndex = 0),
                (this.ended = !1),
                (this.cbs = null != e ? e : {}),
                (this.lowerCaseTagNames =
                  null !== (n = t.lowerCaseTags) && void 0 !== n ? n : !t.xmlMode),
                (this.lowerCaseAttributeNames =
                  null !== (r = t.lowerCaseAttributeNames) && void 0 !== r ? r : !t.xmlMode),
                (this.tokenizer = new (null !== (i = t.Tokenizer) && void 0 !== i ? i : a.default)(
                  this.options,
                  this
                )),
                null === (s = (o = this.cbs).onparserinit) || void 0 === s || s.call(o, this);
            }
            return (
              (e.prototype.ontext = function (e, t) {
                var n,
                  r,
                  i = this.getSlice(e, t);
                (this.endIndex = t - 1),
                  null === (r = (n = this.cbs).ontext) || void 0 === r || r.call(n, i),
                  (this.startIndex = t);
              }),
              (e.prototype.ontextentity = function (e) {
                var t,
                  n,
                  r = this.tokenizer.getSectionStart();
                (this.endIndex = r - 1),
                  null === (n = (t = this.cbs).ontext) ||
                    void 0 === n ||
                    n.call(t, (0, s.fromCodePoint)(e)),
                  (this.startIndex = r);
              }),
              (e.prototype.isVoidElement = function (e) {
                return !this.options.xmlMode && h.has(e);
              }),
              (e.prototype.onopentagname = function (e, t) {
                this.endIndex = t;
                var n = this.getSlice(e, t);
                this.lowerCaseTagNames && (n = n.toLowerCase()), this.emitOpenTag(n);
              }),
              (e.prototype.emitOpenTag = function (e) {
                var t, n, r, i;
                (this.openTagStart = this.startIndex), (this.tagname = e);
                var o = !this.options.xmlMode && p.get(e);
                if (o)
                  for (; this.stack.length > 0 && o.has(this.stack[this.stack.length - 1]); ) {
                    var a = this.stack.pop();
                    null === (n = (t = this.cbs).onclosetag) || void 0 === n || n.call(t, a, !0);
                  }
                this.isVoidElement(e) ||
                  (this.stack.push(e),
                  m.has(e)
                    ? this.foreignContext.push(!0)
                    : g.has(e) && this.foreignContext.push(!1)),
                  null === (i = (r = this.cbs).onopentagname) || void 0 === i || i.call(r, e),
                  this.cbs.onopentag && (this.attribs = {});
              }),
              (e.prototype.endOpenTag = function (e) {
                var t, n;
                (this.startIndex = this.openTagStart),
                  this.attribs &&
                    (null === (n = (t = this.cbs).onopentag) ||
                      void 0 === n ||
                      n.call(t, this.tagname, this.attribs, e),
                    (this.attribs = null)),
                  this.cbs.onclosetag &&
                    this.isVoidElement(this.tagname) &&
                    this.cbs.onclosetag(this.tagname, !0),
                  (this.tagname = '');
              }),
              (e.prototype.onopentagend = function (e) {
                (this.endIndex = e), this.endOpenTag(!1), (this.startIndex = e + 1);
              }),
              (e.prototype.onclosetag = function (e, t) {
                var n, r, i, o, a, s;
                this.endIndex = t;
                var c = this.getSlice(e, t);
                if (
                  (this.lowerCaseTagNames && (c = c.toLowerCase()),
                  (m.has(c) || g.has(c)) && this.foreignContext.pop(),
                  this.isVoidElement(c))
                )
                  this.options.xmlMode ||
                    'br' !== c ||
                    (null === (r = (n = this.cbs).onopentagname) || void 0 === r || r.call(n, 'br'),
                    null === (o = (i = this.cbs).onopentag) ||
                      void 0 === o ||
                      o.call(i, 'br', {}, !0),
                    null === (s = (a = this.cbs).onclosetag) ||
                      void 0 === s ||
                      s.call(a, 'br', !1));
                else {
                  var l = this.stack.lastIndexOf(c);
                  if (-1 !== l)
                    if (this.cbs.onclosetag)
                      for (var u = this.stack.length - l; u--; )
                        this.cbs.onclosetag(this.stack.pop(), 0 !== u);
                    else this.stack.length = l;
                  else
                    this.options.xmlMode ||
                      'p' !== c ||
                      (this.emitOpenTag('p'), this.closeCurrentTag(!0));
                }
                this.startIndex = t + 1;
              }),
              (e.prototype.onselfclosingtag = function (e) {
                (this.endIndex = e),
                  this.options.xmlMode ||
                  this.options.recognizeSelfClosing ||
                  this.foreignContext[this.foreignContext.length - 1]
                    ? (this.closeCurrentTag(!1), (this.startIndex = e + 1))
                    : this.onopentagend(e);
              }),
              (e.prototype.closeCurrentTag = function (e) {
                var t,
                  n,
                  r = this.tagname;
                this.endOpenTag(e),
                  this.stack[this.stack.length - 1] === r &&
                    (null === (n = (t = this.cbs).onclosetag) || void 0 === n || n.call(t, r, !e),
                    this.stack.pop());
              }),
              (e.prototype.onattribname = function (e, t) {
                this.startIndex = e;
                var n = this.getSlice(e, t);
                this.attribname = this.lowerCaseAttributeNames ? n.toLowerCase() : n;
              }),
              (e.prototype.onattribdata = function (e, t) {
                this.attribvalue += this.getSlice(e, t);
              }),
              (e.prototype.onattribentity = function (e) {
                this.attribvalue += (0, s.fromCodePoint)(e);
              }),
              (e.prototype.onattribend = function (e, t) {
                var n, r;
                (this.endIndex = t),
                  null === (r = (n = this.cbs).onattribute) ||
                    void 0 === r ||
                    r.call(
                      n,
                      this.attribname,
                      this.attribvalue,
                      e === a.QuoteType.Double
                        ? '"'
                        : e === a.QuoteType.Single
                        ? "'"
                        : e === a.QuoteType.NoValue
                        ? void 0
                        : null
                    ),
                  this.attribs &&
                    !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname) &&
                    (this.attribs[this.attribname] = this.attribvalue),
                  (this.attribvalue = '');
              }),
              (e.prototype.getInstructionName = function (e) {
                var t = e.search(y),
                  n = t < 0 ? e : e.substr(0, t);
                return this.lowerCaseTagNames && (n = n.toLowerCase()), n;
              }),
              (e.prototype.ondeclaration = function (e, t) {
                this.endIndex = t;
                var n = this.getSlice(e, t);
                if (this.cbs.onprocessinginstruction) {
                  var r = this.getInstructionName(n);
                  this.cbs.onprocessinginstruction('!'.concat(r), '!'.concat(n));
                }
                this.startIndex = t + 1;
              }),
              (e.prototype.onprocessinginstruction = function (e, t) {
                this.endIndex = t;
                var n = this.getSlice(e, t);
                if (this.cbs.onprocessinginstruction) {
                  var r = this.getInstructionName(n);
                  this.cbs.onprocessinginstruction('?'.concat(r), '?'.concat(n));
                }
                this.startIndex = t + 1;
              }),
              (e.prototype.oncomment = function (e, t, n) {
                var r, i, o, a;
                (this.endIndex = t),
                  null === (i = (r = this.cbs).oncomment) ||
                    void 0 === i ||
                    i.call(r, this.getSlice(e, t - n)),
                  null === (a = (o = this.cbs).oncommentend) || void 0 === a || a.call(o),
                  (this.startIndex = t + 1);
              }),
              (e.prototype.oncdata = function (e, t, n) {
                var r, i, o, a, s, c, l, u, f, d;
                this.endIndex = t;
                var p = this.getSlice(e, t - n);
                this.options.xmlMode || this.options.recognizeCDATA
                  ? (null === (i = (r = this.cbs).oncdatastart) || void 0 === i || i.call(r),
                    null === (a = (o = this.cbs).ontext) || void 0 === a || a.call(o, p),
                    null === (c = (s = this.cbs).oncdataend) || void 0 === c || c.call(s))
                  : (null === (u = (l = this.cbs).oncomment) ||
                      void 0 === u ||
                      u.call(l, '[CDATA['.concat(p, ']]')),
                    null === (d = (f = this.cbs).oncommentend) || void 0 === d || d.call(f)),
                  (this.startIndex = t + 1);
              }),
              (e.prototype.onend = function () {
                var e, t;
                if (this.cbs.onclosetag) {
                  this.endIndex = this.startIndex;
                  for (var n = this.stack.length; n > 0; this.cbs.onclosetag(this.stack[--n], !0));
                }
                null === (t = (e = this.cbs).onend) || void 0 === t || t.call(e);
              }),
              (e.prototype.reset = function () {
                var e, t, n, r;
                null === (t = (e = this.cbs).onreset) || void 0 === t || t.call(e),
                  this.tokenizer.reset(),
                  (this.tagname = ''),
                  (this.attribname = ''),
                  (this.attribs = null),
                  (this.stack.length = 0),
                  (this.startIndex = 0),
                  (this.endIndex = 0),
                  null === (r = (n = this.cbs).onparserinit) || void 0 === r || r.call(n, this),
                  (this.buffers.length = 0),
                  (this.bufferOffset = 0),
                  (this.writeIndex = 0),
                  (this.ended = !1);
              }),
              (e.prototype.parseComplete = function (e) {
                this.reset(), this.end(e);
              }),
              (e.prototype.getSlice = function (e, t) {
                for (; e - this.bufferOffset >= this.buffers[0].length; ) this.shiftBuffer();
                for (
                  var n = this.buffers[0].slice(e - this.bufferOffset, t - this.bufferOffset);
                  t - this.bufferOffset > this.buffers[0].length;

                )
                  this.shiftBuffer(), (n += this.buffers[0].slice(0, t - this.bufferOffset));
                return n;
              }),
              (e.prototype.shiftBuffer = function () {
                (this.bufferOffset += this.buffers[0].length),
                  this.writeIndex--,
                  this.buffers.shift();
              }),
              (e.prototype.write = function (e) {
                var t, n;
                this.ended
                  ? null === (n = (t = this.cbs).onerror) ||
                    void 0 === n ||
                    n.call(t, new Error('.write() after done!'))
                  : (this.buffers.push(e),
                    this.tokenizer.running && (this.tokenizer.write(e), this.writeIndex++));
              }),
              (e.prototype.end = function (e) {
                var t, n;
                this.ended
                  ? null === (n = (t = this.cbs).onerror) ||
                    void 0 === n ||
                    n.call(t, new Error('.end() after done!'))
                  : (e && this.write(e), (this.ended = !0), this.tokenizer.end());
              }),
              (e.prototype.pause = function () {
                this.tokenizer.pause();
              }),
              (e.prototype.resume = function () {
                for (
                  this.tokenizer.resume();
                  this.tokenizer.running && this.writeIndex < this.buffers.length;

                )
                  this.tokenizer.write(this.buffers[this.writeIndex++]);
                this.ended && this.tokenizer.end();
              }),
              (e.prototype.parseChunk = function (e) {
                this.write(e);
              }),
              (e.prototype.done = function (e) {
                this.end(e);
              }),
              e
            );
          })();
        t.Parser = v;
      },
      779: function (e, t, n) {
        'use strict';
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getOuterHTML = s),
          (t.getInnerHTML = function (e, t) {
            return (0, i.hasChildren)(e)
              ? e.children
                  .map(function (e) {
                    return s(e, t);
                  })
                  .join('')
              : '';
          }),
          (t.getText = function e(t) {
            return Array.isArray(t)
              ? t.map(e).join('')
              : (0, i.isTag)(t)
              ? 'br' === t.name
                ? '\n'
                : e(t.children)
              : (0, i.isCDATA)(t)
              ? e(t.children)
              : (0, i.isText)(t)
              ? t.data
              : '';
          }),
          (t.textContent = function e(t) {
            return Array.isArray(t)
              ? t.map(e).join('')
              : (0, i.hasChildren)(t) && !(0, i.isComment)(t)
              ? e(t.children)
              : (0, i.isText)(t)
              ? t.data
              : '';
          }),
          (t.innerText = function e(t) {
            return Array.isArray(t)
              ? t.map(e).join('')
              : (0, i.hasChildren)(t) && (t.type === a.ElementType.Tag || (0, i.isCDATA)(t))
              ? e(t.children)
              : (0, i.isText)(t)
              ? t.data
              : '';
          });
        var i = n(23),
          o = r(n(376)),
          a = n(811);
        function s(e, t) {
          return (0, o.default)(e, t);
        }
      },
      811: (e, t) => {
        'use strict';
        var n;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.Doctype =
            t.CDATA =
            t.Tag =
            t.Style =
            t.Script =
            t.Comment =
            t.Directive =
            t.Text =
            t.Root =
            t.isTag =
            t.ElementType =
              void 0),
          (function (e) {
            (e.Root = 'root'),
              (e.Text = 'text'),
              (e.Directive = 'directive'),
              (e.Comment = 'comment'),
              (e.Script = 'script'),
              (e.Style = 'style'),
              (e.Tag = 'tag'),
              (e.CDATA = 'cdata'),
              (e.Doctype = 'doctype');
          })((n = t.ElementType || (t.ElementType = {}))),
          (t.isTag = function (e) {
            return e.type === n.Tag || e.type === n.Script || e.type === n.Style;
          }),
          (t.Root = n.Root),
          (t.Text = n.Text),
          (t.Directive = n.Directive),
          (t.Comment = n.Comment),
          (t.Script = n.Script),
          (t.Style = n.Style),
          (t.Tag = n.Tag),
          (t.CDATA = n.CDATA),
          (t.Doctype = n.Doctype);
      },
      855: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getChildren = i),
          (t.getParent = o),
          (t.getSiblings = function (e) {
            var t = o(e);
            if (null != t) return i(t);
            for (var n = [e], r = e.prev, a = e.next; null != r; ) n.unshift(r), (r = r.prev);
            for (; null != a; ) n.push(a), (a = a.next);
            return n;
          }),
          (t.getAttributeValue = function (e, t) {
            var n;
            return null === (n = e.attribs) || void 0 === n ? void 0 : n[t];
          }),
          (t.hasAttrib = function (e, t) {
            return (
              null != e.attribs &&
              Object.prototype.hasOwnProperty.call(e.attribs, t) &&
              null != e.attribs[t]
            );
          }),
          (t.getName = function (e) {
            return e.name;
          }),
          (t.nextElementSibling = function (e) {
            for (var t = e.next; null !== t && !(0, r.isTag)(t); ) t = t.next;
            return t;
          }),
          (t.prevElementSibling = function (e) {
            for (var t = e.prev; null !== t && !(0, r.isTag)(t); ) t = t.prev;
            return t;
          });
        var r = n(23);
        function i(e) {
          return (0, r.hasChildren)(e) ? e.children : [];
        }
        function o(e) {
          return e.parent || null;
        }
      },
      886: function (e, t) {
        var n;
        !(function (t, n) {
          'use strict';
          'object' == typeof e.exports
            ? (e.exports = t.document
                ? n(t, !0)
                : function (e) {
                    if (!e.document) throw new Error('jQuery requires a window with a document');
                    return n(e);
                  })
            : n(t);
        })('undefined' != typeof window ? window : this, function (r, i) {
          'use strict';
          var o = [],
            a = Object.getPrototypeOf,
            s = o.slice,
            c = o.flat
              ? function (e) {
                  return o.flat.call(e);
                }
              : function (e) {
                  return o.concat.apply([], e);
                },
            l = o.push,
            u = o.indexOf,
            f = {},
            d = f.toString,
            p = f.hasOwnProperty,
            h = p.toString,
            m = h.call(Object),
            g = {},
            y = function (e) {
              return (
                'function' == typeof e &&
                'number' != typeof e.nodeType &&
                'function' != typeof e.item
              );
            },
            v = function (e) {
              return null != e && e === e.window;
            },
            b = r.document,
            x = { type: !0, src: !0, nonce: !0, noModule: !0 };
          function w(e, t, n) {
            var r,
              i,
              o = (n = n || b).createElement('script');
            if (((o.text = e), t))
              for (r in x)
                (i = t[r] || (t.getAttribute && t.getAttribute(r))) && o.setAttribute(r, i);
            n.head.appendChild(o).parentNode.removeChild(o);
          }
          function T(e) {
            return null == e
              ? e + ''
              : 'object' == typeof e || 'function' == typeof e
              ? f[d.call(e)] || 'object'
              : typeof e;
          }
          var k = '3.7.1',
            _ = /HTML$/i,
            E = function (e, t) {
              return new E.fn.init(e, t);
            };
          function S(e) {
            var t = !!e && 'length' in e && e.length,
              n = T(e);
            return (
              !y(e) &&
              !v(e) &&
              ('array' === n || 0 === t || ('number' == typeof t && t > 0 && t - 1 in e))
            );
          }
          function L(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
          }
          (E.fn = E.prototype =
            {
              jquery: k,
              constructor: E,
              length: 0,
              toArray: function () {
                return s.call(this);
              },
              get: function (e) {
                return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e];
              },
              pushStack: function (e) {
                var t = E.merge(this.constructor(), e);
                return (t.prevObject = this), t;
              },
              each: function (e) {
                return E.each(this, e);
              },
              map: function (e) {
                return this.pushStack(
                  E.map(this, function (t, n) {
                    return e.call(t, n, t);
                  })
                );
              },
              slice: function () {
                return this.pushStack(s.apply(this, arguments));
              },
              first: function () {
                return this.eq(0);
              },
              last: function () {
                return this.eq(-1);
              },
              even: function () {
                return this.pushStack(
                  E.grep(this, function (e, t) {
                    return (t + 1) % 2;
                  })
                );
              },
              odd: function () {
                return this.pushStack(
                  E.grep(this, function (e, t) {
                    return t % 2;
                  })
                );
              },
              eq: function (e) {
                var t = this.length,
                  n = +e + (e < 0 ? t : 0);
                return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
              },
              end: function () {
                return this.prevObject || this.constructor();
              },
              push: l,
              sort: o.sort,
              splice: o.splice,
            }),
            (E.extend = E.fn.extend =
              function () {
                var e,
                  t,
                  n,
                  r,
                  i,
                  o,
                  a = arguments[0] || {},
                  s = 1,
                  c = arguments.length,
                  l = !1;
                for (
                  'boolean' == typeof a && ((l = a), (a = arguments[s] || {}), s++),
                    'object' == typeof a || y(a) || (a = {}),
                    s === c && ((a = this), s--);
                  s < c;
                  s++
                )
                  if (null != (e = arguments[s]))
                    for (t in e)
                      (r = e[t]),
                        '__proto__' !== t &&
                          a !== r &&
                          (l && r && (E.isPlainObject(r) || (i = Array.isArray(r)))
                            ? ((n = a[t]),
                              (o = i && !Array.isArray(n) ? [] : i || E.isPlainObject(n) ? n : {}),
                              (i = !1),
                              (a[t] = E.extend(l, o, r)))
                            : void 0 !== r && (a[t] = r));
                return a;
              }),
            E.extend({
              expando: 'jQuery' + (k + Math.random()).replace(/\D/g, ''),
              isReady: !0,
              error: function (e) {
                throw new Error(e);
              },
              noop: function () {},
              isPlainObject: function (e) {
                var t, n;
                return !(
                  !e ||
                  '[object Object]' !== d.call(e) ||
                  ((t = a(e)) &&
                    ('function' != typeof (n = p.call(t, 'constructor') && t.constructor) ||
                      h.call(n) !== m))
                );
              },
              isEmptyObject: function (e) {
                var t;
                for (t in e) return !1;
                return !0;
              },
              globalEval: function (e, t, n) {
                w(e, { nonce: t && t.nonce }, n);
              },
              each: function (e, t) {
                var n,
                  r = 0;
                if (S(e)) for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++);
                else for (r in e) if (!1 === t.call(e[r], r, e[r])) break;
                return e;
              },
              text: function (e) {
                var t,
                  n = '',
                  r = 0,
                  i = e.nodeType;
                if (!i) for (; (t = e[r++]); ) n += E.text(t);
                return 1 === i || 11 === i
                  ? e.textContent
                  : 9 === i
                  ? e.documentElement.textContent
                  : 3 === i || 4 === i
                  ? e.nodeValue
                  : n;
              },
              makeArray: function (e, t) {
                var n = t || [];
                return (
                  null != e &&
                    (S(Object(e)) ? E.merge(n, 'string' == typeof e ? [e] : e) : l.call(n, e)),
                  n
                );
              },
              inArray: function (e, t, n) {
                return null == t ? -1 : u.call(t, e, n);
              },
              isXMLDoc: function (e) {
                var t = e && e.namespaceURI,
                  n = e && (e.ownerDocument || e).documentElement;
                return !_.test(t || (n && n.nodeName) || 'HTML');
              },
              merge: function (e, t) {
                for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
                return (e.length = i), e;
              },
              grep: function (e, t, n) {
                for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                  !t(e[i], i) !== a && r.push(e[i]);
                return r;
              },
              map: function (e, t, n) {
                var r,
                  i,
                  o = 0,
                  a = [];
                if (S(e)) for (r = e.length; o < r; o++) null != (i = t(e[o], o, n)) && a.push(i);
                else for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
                return c(a);
              },
              guid: 1,
              support: g,
            }),
            'function' == typeof Symbol && (E.fn[Symbol.iterator] = o[Symbol.iterator]),
            E.each(
              'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '),
              function (e, t) {
                f['[object ' + t + ']'] = t.toLowerCase();
              }
            );
          var A = o.pop,
            C = o.sort,
            N = o.splice,
            I = '[\\x20\\t\\r\\n\\f]',
            D = new RegExp('^' + I + '+|((?:^|[^\\\\])(?:\\\\.)*)' + I + '+$', 'g');
          E.contains = function (e, t) {
            var n = t && t.parentNode;
            return (
              e === n ||
              !(
                !n ||
                1 !== n.nodeType ||
                !(e.contains
                  ? e.contains(n)
                  : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n))
              )
            );
          };
          var O = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
          function q(e, t) {
            return t
              ? '\0' === e
                ? '�'
                : e.slice(0, -1) + '\\' + e.charCodeAt(e.length - 1).toString(16) + ' '
              : '\\' + e;
          }
          E.escapeSelector = function (e) {
            return (e + '').replace(O, q);
          };
          var B = b,
            j = l;
          !(function () {
            var e,
              t,
              n,
              i,
              a,
              c,
              l,
              f,
              d,
              h,
              m = j,
              y = E.expando,
              v = 0,
              b = 0,
              x = ee(),
              w = ee(),
              T = ee(),
              k = ee(),
              _ = function (e, t) {
                return e === t && (a = !0), 0;
              },
              S =
                'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
              O = '(?:\\\\[\\da-fA-F]{1,6}' + I + '?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+',
              q =
                '\\[' +
                I +
                '*(' +
                O +
                ')(?:' +
                I +
                '*([*^$|!~]?=)' +
                I +
                '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' +
                O +
                '))|)' +
                I +
                '*\\]',
              P =
                ':(' +
                O +
                ')(?:\\(((\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|' +
                q +
                ')*)|.*)\\)|)',
              M = new RegExp(I + '+', 'g'),
              R = new RegExp('^' + I + '*,' + I + '*'),
              H = new RegExp('^' + I + '*([>+~]|' + I + ')' + I + '*'),
              W = new RegExp(I + '|>'),
              U = new RegExp(P),
              $ = new RegExp('^' + O + '$'),
              F = {
                ID: new RegExp('^#(' + O + ')'),
                CLASS: new RegExp('^\\.(' + O + ')'),
                TAG: new RegExp('^(' + O + '|[*])'),
                ATTR: new RegExp('^' + q),
                PSEUDO: new RegExp('^' + P),
                CHILD: new RegExp(
                  '^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' +
                    I +
                    '*(even|odd|(([+-]|)(\\d*)n|)' +
                    I +
                    '*(?:([+-]|)' +
                    I +
                    '*(\\d+)|))' +
                    I +
                    '*\\)|)',
                  'i'
                ),
                bool: new RegExp('^(?:' + S + ')$', 'i'),
                needsContext: new RegExp(
                  '^' +
                    I +
                    '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' +
                    I +
                    '*((?:-\\d)?\\d*)' +
                    I +
                    '*\\)|)(?=[^-]|$)',
                  'i'
                ),
              },
              V = /^(?:input|select|textarea|button)$/i,
              G = /^h\d$/i,
              z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
              Q = /[+~]/,
              X = new RegExp('\\\\[\\da-fA-F]{1,6}' + I + '?|\\\\([^\\r\\n\\f])', 'g'),
              J = function (e, t) {
                var n = '0x' + e.slice(1) - 65536;
                return (
                  t ||
                  (n < 0
                    ? String.fromCharCode(n + 65536)
                    : String.fromCharCode((n >> 10) | 55296, (1023 & n) | 56320))
                );
              },
              Z = function () {
                ce();
              },
              Y = de(
                function (e) {
                  return !0 === e.disabled && L(e, 'fieldset');
                },
                { dir: 'parentNode', next: 'legend' }
              );
            try {
              m.apply((o = s.call(B.childNodes)), B.childNodes), o[B.childNodes.length].nodeType;
            } catch (e) {
              m = {
                apply: function (e, t) {
                  j.apply(e, s.call(t));
                },
                call: function (e) {
                  j.apply(e, s.call(arguments, 1));
                },
              };
            }
            function K(e, t, n, r) {
              var i,
                o,
                a,
                s,
                l,
                u,
                p,
                h = t && t.ownerDocument,
                v = t ? t.nodeType : 9;
              if (((n = n || []), 'string' != typeof e || !e || (1 !== v && 9 !== v && 11 !== v)))
                return n;
              if (!r && (ce(t), (t = t || c), f)) {
                if (11 !== v && (l = z.exec(e)))
                  if ((i = l[1])) {
                    if (9 === v) {
                      if (!(a = t.getElementById(i))) return n;
                      if (a.id === i) return m.call(n, a), n;
                    } else if (h && (a = h.getElementById(i)) && K.contains(t, a) && a.id === i)
                      return m.call(n, a), n;
                  } else {
                    if (l[2]) return m.apply(n, t.getElementsByTagName(e)), n;
                    if ((i = l[3]) && t.getElementsByClassName)
                      return m.apply(n, t.getElementsByClassName(i)), n;
                  }
                if (!(k[e + ' '] || (d && d.test(e)))) {
                  if (((p = e), (h = t), 1 === v && (W.test(e) || H.test(e)))) {
                    for (
                      ((h = (Q.test(e) && se(t.parentNode)) || t) == t && g.scope) ||
                        ((s = t.getAttribute('id'))
                          ? (s = E.escapeSelector(s))
                          : t.setAttribute('id', (s = y))),
                        o = (u = ue(e)).length;
                      o--;

                    )
                      u[o] = (s ? '#' + s : ':scope') + ' ' + fe(u[o]);
                    p = u.join(',');
                  }
                  try {
                    return m.apply(n, h.querySelectorAll(p)), n;
                  } catch (t) {
                    k(e, !0);
                  } finally {
                    s === y && t.removeAttribute('id');
                  }
                }
              }
              return ve(e.replace(D, '$1'), t, n, r);
            }
            function ee() {
              var e = [];
              return function n(r, i) {
                return e.push(r + ' ') > t.cacheLength && delete n[e.shift()], (n[r + ' '] = i);
              };
            }
            function te(e) {
              return (e[y] = !0), e;
            }
            function ne(e) {
              var t = c.createElement('fieldset');
              try {
                return !!e(t);
              } catch (e) {
                return !1;
              } finally {
                t.parentNode && t.parentNode.removeChild(t), (t = null);
              }
            }
            function re(e) {
              return function (t) {
                return L(t, 'input') && t.type === e;
              };
            }
            function ie(e) {
              return function (t) {
                return (L(t, 'input') || L(t, 'button')) && t.type === e;
              };
            }
            function oe(e) {
              return function (t) {
                return 'form' in t
                  ? t.parentNode && !1 === t.disabled
                    ? 'label' in t
                      ? 'label' in t.parentNode
                        ? t.parentNode.disabled === e
                        : t.disabled === e
                      : t.isDisabled === e || (t.isDisabled !== !e && Y(t) === e)
                    : t.disabled === e
                  : 'label' in t && t.disabled === e;
              };
            }
            function ae(e) {
              return te(function (t) {
                return (
                  (t = +t),
                  te(function (n, r) {
                    for (var i, o = e([], n.length, t), a = o.length; a--; )
                      n[(i = o[a])] && (n[i] = !(r[i] = n[i]));
                  })
                );
              });
            }
            function se(e) {
              return e && void 0 !== e.getElementsByTagName && e;
            }
            function ce(e) {
              var n,
                r = e ? e.ownerDocument || e : B;
              return r != c && 9 === r.nodeType && r.documentElement
                ? ((l = (c = r).documentElement),
                  (f = !E.isXMLDoc(c)),
                  (h = l.matches || l.webkitMatchesSelector || l.msMatchesSelector),
                  l.msMatchesSelector &&
                    B != c &&
                    (n = c.defaultView) &&
                    n.top !== n &&
                    n.addEventListener('unload', Z),
                  (g.getById = ne(function (e) {
                    return (
                      (l.appendChild(e).id = E.expando),
                      !c.getElementsByName || !c.getElementsByName(E.expando).length
                    );
                  })),
                  (g.disconnectedMatch = ne(function (e) {
                    return h.call(e, '*');
                  })),
                  (g.scope = ne(function () {
                    return c.querySelectorAll(':scope');
                  })),
                  (g.cssHas = ne(function () {
                    try {
                      return c.querySelector(':has(*,:jqfake)'), !1;
                    } catch (e) {
                      return !0;
                    }
                  })),
                  g.getById
                    ? ((t.filter.ID = function (e) {
                        var t = e.replace(X, J);
                        return function (e) {
                          return e.getAttribute('id') === t;
                        };
                      }),
                      (t.find.ID = function (e, t) {
                        if (void 0 !== t.getElementById && f) {
                          var n = t.getElementById(e);
                          return n ? [n] : [];
                        }
                      }))
                    : ((t.filter.ID = function (e) {
                        var t = e.replace(X, J);
                        return function (e) {
                          var n = void 0 !== e.getAttributeNode && e.getAttributeNode('id');
                          return n && n.value === t;
                        };
                      }),
                      (t.find.ID = function (e, t) {
                        if (void 0 !== t.getElementById && f) {
                          var n,
                            r,
                            i,
                            o = t.getElementById(e);
                          if (o) {
                            if ((n = o.getAttributeNode('id')) && n.value === e) return [o];
                            for (i = t.getElementsByName(e), r = 0; (o = i[r++]); )
                              if ((n = o.getAttributeNode('id')) && n.value === e) return [o];
                          }
                          return [];
                        }
                      })),
                  (t.find.TAG = function (e, t) {
                    return void 0 !== t.getElementsByTagName
                      ? t.getElementsByTagName(e)
                      : t.querySelectorAll(e);
                  }),
                  (t.find.CLASS = function (e, t) {
                    if (void 0 !== t.getElementsByClassName && f)
                      return t.getElementsByClassName(e);
                  }),
                  (d = []),
                  ne(function (e) {
                    var t;
                    (l.appendChild(e).innerHTML =
                      "<a id='" +
                      y +
                      "' href='' disabled='disabled'></a><select id='" +
                      y +
                      "-\r\\' disabled='disabled'><option selected=''></option></select>"),
                      e.querySelectorAll('[selected]').length ||
                        d.push('\\[' + I + '*(?:value|' + S + ')'),
                      e.querySelectorAll('[id~=' + y + '-]').length || d.push('~='),
                      e.querySelectorAll('a#' + y + '+*').length || d.push('.#.+[+~]'),
                      e.querySelectorAll(':checked').length || d.push(':checked'),
                      (t = c.createElement('input')).setAttribute('type', 'hidden'),
                      e.appendChild(t).setAttribute('name', 'D'),
                      (l.appendChild(e).disabled = !0),
                      2 !== e.querySelectorAll(':disabled').length &&
                        d.push(':enabled', ':disabled'),
                      (t = c.createElement('input')).setAttribute('name', ''),
                      e.appendChild(t),
                      e.querySelectorAll("[name='']").length ||
                        d.push('\\[' + I + '*name' + I + '*=' + I + '*(?:\'\'|"")');
                  }),
                  g.cssHas || d.push(':has'),
                  (d = d.length && new RegExp(d.join('|'))),
                  (_ = function (e, t) {
                    if (e === t) return (a = !0), 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return (
                      n ||
                      (1 &
                        (n =
                          (e.ownerDocument || e) == (t.ownerDocument || t)
                            ? e.compareDocumentPosition(t)
                            : 1) ||
                      (!g.sortDetached && t.compareDocumentPosition(e) === n)
                        ? e === c || (e.ownerDocument == B && K.contains(B, e))
                          ? -1
                          : t === c || (t.ownerDocument == B && K.contains(B, t))
                          ? 1
                          : i
                          ? u.call(i, e) - u.call(i, t)
                          : 0
                        : 4 & n
                        ? -1
                        : 1)
                    );
                  }),
                  c)
                : c;
            }
            for (e in ((K.matches = function (e, t) {
              return K(e, null, null, t);
            }),
            (K.matchesSelector = function (e, t) {
              if ((ce(e), f && !k[t + ' '] && (!d || !d.test(t))))
                try {
                  var n = h.call(e, t);
                  if (n || g.disconnectedMatch || (e.document && 11 !== e.document.nodeType))
                    return n;
                } catch (e) {
                  k(t, !0);
                }
              return K(t, c, null, [e]).length > 0;
            }),
            (K.contains = function (e, t) {
              return (e.ownerDocument || e) != c && ce(e), E.contains(e, t);
            }),
            (K.attr = function (e, n) {
              (e.ownerDocument || e) != c && ce(e);
              var r = t.attrHandle[n.toLowerCase()],
                i = r && p.call(t.attrHandle, n.toLowerCase()) ? r(e, n, !f) : void 0;
              return void 0 !== i ? i : e.getAttribute(n);
            }),
            (K.error = function (e) {
              throw new Error('Syntax error, unrecognized expression: ' + e);
            }),
            (E.uniqueSort = function (e) {
              var t,
                n = [],
                r = 0,
                o = 0;
              if (((a = !g.sortStable), (i = !g.sortStable && s.call(e, 0)), C.call(e, _), a)) {
                for (; (t = e[o++]); ) t === e[o] && (r = n.push(o));
                for (; r--; ) N.call(e, n[r], 1);
              }
              return (i = null), e;
            }),
            (E.fn.uniqueSort = function () {
              return this.pushStack(E.uniqueSort(s.apply(this)));
            }),
            (t = E.expr =
              {
                cacheLength: 50,
                createPseudo: te,
                match: F,
                attrHandle: {},
                find: {},
                relative: {
                  '>': { dir: 'parentNode', first: !0 },
                  ' ': { dir: 'parentNode' },
                  '+': { dir: 'previousSibling', first: !0 },
                  '~': { dir: 'previousSibling' },
                },
                preFilter: {
                  ATTR: function (e) {
                    return (
                      (e[1] = e[1].replace(X, J)),
                      (e[3] = (e[3] || e[4] || e[5] || '').replace(X, J)),
                      '~=' === e[2] && (e[3] = ' ' + e[3] + ' '),
                      e.slice(0, 4)
                    );
                  },
                  CHILD: function (e) {
                    return (
                      (e[1] = e[1].toLowerCase()),
                      'nth' === e[1].slice(0, 3)
                        ? (e[3] || K.error(e[0]),
                          (e[4] = +(e[4]
                            ? e[5] + (e[6] || 1)
                            : 2 * ('even' === e[3] || 'odd' === e[3]))),
                          (e[5] = +(e[7] + e[8] || 'odd' === e[3])))
                        : e[3] && K.error(e[0]),
                      e
                    );
                  },
                  PSEUDO: function (e) {
                    var t,
                      n = !e[6] && e[2];
                    return F.CHILD.test(e[0])
                      ? null
                      : (e[3]
                          ? (e[2] = e[4] || e[5] || '')
                          : n &&
                            U.test(n) &&
                            (t = ue(n, !0)) &&
                            (t = n.indexOf(')', n.length - t) - n.length) &&
                            ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                        e.slice(0, 3));
                  },
                },
                filter: {
                  TAG: function (e) {
                    var t = e.replace(X, J).toLowerCase();
                    return '*' === e
                      ? function () {
                          return !0;
                        }
                      : function (e) {
                          return L(e, t);
                        };
                  },
                  CLASS: function (e) {
                    var t = x[e + ' '];
                    return (
                      t ||
                      ((t = new RegExp('(^|' + I + ')' + e + '(' + I + '|$)')) &&
                        x(e, function (e) {
                          return t.test(
                            ('string' == typeof e.className && e.className) ||
                              (void 0 !== e.getAttribute && e.getAttribute('class')) ||
                              ''
                          );
                        }))
                    );
                  },
                  ATTR: function (e, t, n) {
                    return function (r) {
                      var i = K.attr(r, e);
                      return null == i
                        ? '!=' === t
                        : !t ||
                            ((i += ''),
                            '=' === t
                              ? i === n
                              : '!=' === t
                              ? i !== n
                              : '^=' === t
                              ? n && 0 === i.indexOf(n)
                              : '*=' === t
                              ? n && i.indexOf(n) > -1
                              : '$=' === t
                              ? n && i.slice(-n.length) === n
                              : '~=' === t
                              ? (' ' + i.replace(M, ' ') + ' ').indexOf(n) > -1
                              : '|=' === t && (i === n || i.slice(0, n.length + 1) === n + '-'));
                    };
                  },
                  CHILD: function (e, t, n, r, i) {
                    var o = 'nth' !== e.slice(0, 3),
                      a = 'last' !== e.slice(-4),
                      s = 'of-type' === t;
                    return 1 === r && 0 === i
                      ? function (e) {
                          return !!e.parentNode;
                        }
                      : function (t, n, c) {
                          var l,
                            u,
                            f,
                            d,
                            p,
                            h = o !== a ? 'nextSibling' : 'previousSibling',
                            m = t.parentNode,
                            g = s && t.nodeName.toLowerCase(),
                            b = !c && !s,
                            x = !1;
                          if (m) {
                            if (o) {
                              for (; h; ) {
                                for (f = t; (f = f[h]); )
                                  if (s ? L(f, g) : 1 === f.nodeType) return !1;
                                p = h = 'only' === e && !p && 'nextSibling';
                              }
                              return !0;
                            }
                            if (((p = [a ? m.firstChild : m.lastChild]), a && b)) {
                              for (
                                x =
                                  (d = (l = (u = m[y] || (m[y] = {}))[e] || [])[0] === v && l[1]) &&
                                  l[2],
                                  f = d && m.childNodes[d];
                                (f = (++d && f && f[h]) || (x = d = 0) || p.pop());

                              )
                                if (1 === f.nodeType && ++x && f === t) {
                                  u[e] = [v, d, x];
                                  break;
                                }
                            } else if (
                              (b &&
                                (x = d = (l = (u = t[y] || (t[y] = {}))[e] || [])[0] === v && l[1]),
                              !1 === x)
                            )
                              for (
                                ;
                                (f = (++d && f && f[h]) || (x = d = 0) || p.pop()) &&
                                (!(s ? L(f, g) : 1 === f.nodeType) ||
                                  !++x ||
                                  (b && ((u = f[y] || (f[y] = {}))[e] = [v, x]), f !== t));

                              );
                            return (x -= i) === r || (x % r === 0 && x / r >= 0);
                          }
                        };
                  },
                  PSEUDO: function (e, n) {
                    var r,
                      i =
                        t.pseudos[e] ||
                        t.setFilters[e.toLowerCase()] ||
                        K.error('unsupported pseudo: ' + e);
                    return i[y]
                      ? i(n)
                      : i.length > 1
                      ? ((r = [e, e, '', n]),
                        t.setFilters.hasOwnProperty(e.toLowerCase())
                          ? te(function (e, t) {
                              for (var r, o = i(e, n), a = o.length; a--; )
                                e[(r = u.call(e, o[a]))] = !(t[r] = o[a]);
                            })
                          : function (e) {
                              return i(e, 0, r);
                            })
                      : i;
                  },
                },
                pseudos: {
                  not: te(function (e) {
                    var t = [],
                      n = [],
                      r = ye(e.replace(D, '$1'));
                    return r[y]
                      ? te(function (e, t, n, i) {
                          for (var o, a = r(e, null, i, []), s = e.length; s--; )
                            (o = a[s]) && (e[s] = !(t[s] = o));
                        })
                      : function (e, i, o) {
                          return (t[0] = e), r(t, null, o, n), (t[0] = null), !n.pop();
                        };
                  }),
                  has: te(function (e) {
                    return function (t) {
                      return K(e, t).length > 0;
                    };
                  }),
                  contains: te(function (e) {
                    return (
                      (e = e.replace(X, J)),
                      function (t) {
                        return (t.textContent || E.text(t)).indexOf(e) > -1;
                      }
                    );
                  }),
                  lang: te(function (e) {
                    return (
                      $.test(e || '') || K.error('unsupported lang: ' + e),
                      (e = e.replace(X, J).toLowerCase()),
                      function (t) {
                        var n;
                        do {
                          if (
                            (n = f ? t.lang : t.getAttribute('xml:lang') || t.getAttribute('lang'))
                          )
                            return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + '-');
                        } while ((t = t.parentNode) && 1 === t.nodeType);
                        return !1;
                      }
                    );
                  }),
                  target: function (e) {
                    var t = r.location && r.location.hash;
                    return t && t.slice(1) === e.id;
                  },
                  root: function (e) {
                    return e === l;
                  },
                  focus: function (e) {
                    return (
                      e ===
                        (function () {
                          try {
                            return c.activeElement;
                          } catch (e) {}
                        })() &&
                      c.hasFocus() &&
                      !!(e.type || e.href || ~e.tabIndex)
                    );
                  },
                  enabled: oe(!1),
                  disabled: oe(!0),
                  checked: function (e) {
                    return (L(e, 'input') && !!e.checked) || (L(e, 'option') && !!e.selected);
                  },
                  selected: function (e) {
                    return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected;
                  },
                  empty: function (e) {
                    for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeType < 6) return !1;
                    return !0;
                  },
                  parent: function (e) {
                    return !t.pseudos.empty(e);
                  },
                  header: function (e) {
                    return G.test(e.nodeName);
                  },
                  input: function (e) {
                    return V.test(e.nodeName);
                  },
                  button: function (e) {
                    return (L(e, 'input') && 'button' === e.type) || L(e, 'button');
                  },
                  text: function (e) {
                    var t;
                    return (
                      L(e, 'input') &&
                      'text' === e.type &&
                      (null == (t = e.getAttribute('type')) || 'text' === t.toLowerCase())
                    );
                  },
                  first: ae(function () {
                    return [0];
                  }),
                  last: ae(function (e, t) {
                    return [t - 1];
                  }),
                  eq: ae(function (e, t, n) {
                    return [n < 0 ? n + t : n];
                  }),
                  even: ae(function (e, t) {
                    for (var n = 0; n < t; n += 2) e.push(n);
                    return e;
                  }),
                  odd: ae(function (e, t) {
                    for (var n = 1; n < t; n += 2) e.push(n);
                    return e;
                  }),
                  lt: ae(function (e, t, n) {
                    var r;
                    for (r = n < 0 ? n + t : n > t ? t : n; --r >= 0; ) e.push(r);
                    return e;
                  }),
                  gt: ae(function (e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; ) e.push(r);
                    return e;
                  }),
                },
              }),
            (t.pseudos.nth = t.pseudos.eq),
            { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
              t.pseudos[e] = re(e);
            for (e in { submit: !0, reset: !0 }) t.pseudos[e] = ie(e);
            function le() {}
            function ue(e, n) {
              var r,
                i,
                o,
                a,
                s,
                c,
                l,
                u = w[e + ' '];
              if (u) return n ? 0 : u.slice(0);
              for (s = e, c = [], l = t.preFilter; s; ) {
                for (a in ((r && !(i = R.exec(s))) ||
                  (i && (s = s.slice(i[0].length) || s), c.push((o = []))),
                (r = !1),
                (i = H.exec(s)) &&
                  ((r = i.shift()),
                  o.push({ value: r, type: i[0].replace(D, ' ') }),
                  (s = s.slice(r.length))),
                t.filter))
                  !(i = F[a].exec(s)) ||
                    (l[a] && !(i = l[a](i))) ||
                    ((r = i.shift()),
                    o.push({ value: r, type: a, matches: i }),
                    (s = s.slice(r.length)));
                if (!r) break;
              }
              return n ? s.length : s ? K.error(e) : w(e, c).slice(0);
            }
            function fe(e) {
              for (var t = 0, n = e.length, r = ''; t < n; t++) r += e[t].value;
              return r;
            }
            function de(e, t, n) {
              var r = t.dir,
                i = t.next,
                o = i || r,
                a = n && 'parentNode' === o,
                s = b++;
              return t.first
                ? function (t, n, i) {
                    for (; (t = t[r]); ) if (1 === t.nodeType || a) return e(t, n, i);
                    return !1;
                  }
                : function (t, n, c) {
                    var l,
                      u,
                      f = [v, s];
                    if (c) {
                      for (; (t = t[r]); ) if ((1 === t.nodeType || a) && e(t, n, c)) return !0;
                    } else
                      for (; (t = t[r]); )
                        if (1 === t.nodeType || a)
                          if (((u = t[y] || (t[y] = {})), i && L(t, i))) t = t[r] || t;
                          else {
                            if ((l = u[o]) && l[0] === v && l[1] === s) return (f[2] = l[2]);
                            if (((u[o] = f), (f[2] = e(t, n, c)))) return !0;
                          }
                    return !1;
                  };
            }
            function pe(e) {
              return e.length > 1
                ? function (t, n, r) {
                    for (var i = e.length; i--; ) if (!e[i](t, n, r)) return !1;
                    return !0;
                  }
                : e[0];
            }
            function he(e, t, n, r, i) {
              for (var o, a = [], s = 0, c = e.length, l = null != t; s < c; s++)
                (o = e[s]) && ((n && !n(o, r, i)) || (a.push(o), l && t.push(s)));
              return a;
            }
            function me(e, t, n, r, i, o) {
              return (
                r && !r[y] && (r = me(r)),
                i && !i[y] && (i = me(i, o)),
                te(function (o, a, s, c) {
                  var l,
                    f,
                    d,
                    p,
                    h = [],
                    g = [],
                    y = a.length,
                    v =
                      o ||
                      (function (e, t, n) {
                        for (var r = 0, i = t.length; r < i; r++) K(e, t[r], n);
                        return n;
                      })(t || '*', s.nodeType ? [s] : s, []),
                    b = !e || (!o && t) ? v : he(v, h, e, s, c);
                  if ((n ? n(b, (p = i || (o ? e : y || r) ? [] : a), s, c) : (p = b), r))
                    for (l = he(p, g), r(l, [], s, c), f = l.length; f--; )
                      (d = l[f]) && (p[g[f]] = !(b[g[f]] = d));
                  if (o) {
                    if (i || e) {
                      if (i) {
                        for (l = [], f = p.length; f--; ) (d = p[f]) && l.push((b[f] = d));
                        i(null, (p = []), l, c);
                      }
                      for (f = p.length; f--; )
                        (d = p[f]) && (l = i ? u.call(o, d) : h[f]) > -1 && (o[l] = !(a[l] = d));
                    }
                  } else (p = he(p === a ? p.splice(y, p.length) : p)), i ? i(null, a, p, c) : m.apply(a, p);
                })
              );
            }
            function ge(e) {
              for (
                var r,
                  i,
                  o,
                  a = e.length,
                  s = t.relative[e[0].type],
                  c = s || t.relative[' '],
                  l = s ? 1 : 0,
                  f = de(
                    function (e) {
                      return e === r;
                    },
                    c,
                    !0
                  ),
                  d = de(
                    function (e) {
                      return u.call(r, e) > -1;
                    },
                    c,
                    !0
                  ),
                  p = [
                    function (e, t, i) {
                      var o = (!s && (i || t != n)) || ((r = t).nodeType ? f(e, t, i) : d(e, t, i));
                      return (r = null), o;
                    },
                  ];
                l < a;
                l++
              )
                if ((i = t.relative[e[l].type])) p = [de(pe(p), i)];
                else {
                  if ((i = t.filter[e[l].type].apply(null, e[l].matches))[y]) {
                    for (o = ++l; o < a && !t.relative[e[o].type]; o++);
                    return me(
                      l > 1 && pe(p),
                      l > 1 &&
                        fe(
                          e.slice(0, l - 1).concat({ value: ' ' === e[l - 2].type ? '*' : '' })
                        ).replace(D, '$1'),
                      i,
                      l < o && ge(e.slice(l, o)),
                      o < a && ge((e = e.slice(o))),
                      o < a && fe(e)
                    );
                  }
                  p.push(i);
                }
              return pe(p);
            }
            function ye(e, r) {
              var i,
                o = [],
                a = [],
                s = T[e + ' '];
              if (!s) {
                for (r || (r = ue(e)), i = r.length; i--; )
                  (s = ge(r[i]))[y] ? o.push(s) : a.push(s);
                (s = T(
                  e,
                  (function (e, r) {
                    var i = r.length > 0,
                      o = e.length > 0,
                      a = function (a, s, l, u, d) {
                        var p,
                          h,
                          g,
                          y = 0,
                          b = '0',
                          x = a && [],
                          w = [],
                          T = n,
                          k = a || (o && t.find.TAG('*', d)),
                          _ = (v += null == T ? 1 : Math.random() || 0.1),
                          S = k.length;
                        for (d && (n = s == c || s || d); b !== S && null != (p = k[b]); b++) {
                          if (o && p) {
                            for (
                              h = 0, s || p.ownerDocument == c || (ce(p), (l = !f));
                              (g = e[h++]);

                            )
                              if (g(p, s || c, l)) {
                                m.call(u, p);
                                break;
                              }
                            d && (v = _);
                          }
                          i && ((p = !g && p) && y--, a && x.push(p));
                        }
                        if (((y += b), i && b !== y)) {
                          for (h = 0; (g = r[h++]); ) g(x, w, s, l);
                          if (a) {
                            if (y > 0) for (; b--; ) x[b] || w[b] || (w[b] = A.call(u));
                            w = he(w);
                          }
                          m.apply(u, w),
                            d && !a && w.length > 0 && y + r.length > 1 && E.uniqueSort(u);
                        }
                        return d && ((v = _), (n = T)), x;
                      };
                    return i ? te(a) : a;
                  })(a, o)
                )),
                  (s.selector = e);
              }
              return s;
            }
            function ve(e, n, r, i) {
              var o,
                a,
                s,
                c,
                l,
                u = 'function' == typeof e && e,
                d = !i && ue((e = u.selector || e));
              if (((r = r || []), 1 === d.length)) {
                if (
                  (a = d[0] = d[0].slice(0)).length > 2 &&
                  'ID' === (s = a[0]).type &&
                  9 === n.nodeType &&
                  f &&
                  t.relative[a[1].type]
                ) {
                  if (!(n = (t.find.ID(s.matches[0].replace(X, J), n) || [])[0])) return r;
                  u && (n = n.parentNode), (e = e.slice(a.shift().value.length));
                }
                for (
                  o = F.needsContext.test(e) ? 0 : a.length;
                  o-- && ((s = a[o]), !t.relative[(c = s.type)]);

                )
                  if (
                    (l = t.find[c]) &&
                    (i = l(
                      s.matches[0].replace(X, J),
                      (Q.test(a[0].type) && se(n.parentNode)) || n
                    ))
                  ) {
                    if ((a.splice(o, 1), !(e = i.length && fe(a)))) return m.apply(r, i), r;
                    break;
                  }
              }
              return (u || ye(e, d))(i, n, !f, r, !n || (Q.test(e) && se(n.parentNode)) || n), r;
            }
            (le.prototype = t.filters = t.pseudos),
              (t.setFilters = new le()),
              (g.sortStable = y.split('').sort(_).join('') === y),
              ce(),
              (g.sortDetached = ne(function (e) {
                return 1 & e.compareDocumentPosition(c.createElement('fieldset'));
              })),
              (E.find = K),
              (E.expr[':'] = E.expr.pseudos),
              (E.unique = E.uniqueSort),
              (K.compile = ye),
              (K.select = ve),
              (K.setDocument = ce),
              (K.tokenize = ue),
              (K.escape = E.escapeSelector),
              (K.getText = E.text),
              (K.isXML = E.isXMLDoc),
              (K.selectors = E.expr),
              (K.support = E.support),
              (K.uniqueSort = E.uniqueSort);
          })();
          var P = function (e, t, n) {
              for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
                if (1 === e.nodeType) {
                  if (i && E(e).is(n)) break;
                  r.push(e);
                }
              return r;
            },
            M = function (e, t) {
              for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
              return n;
            },
            R = E.expr.match.needsContext,
            H = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
          function W(e, t, n) {
            return y(t)
              ? E.grep(e, function (e, r) {
                  return !!t.call(e, r, e) !== n;
                })
              : t.nodeType
              ? E.grep(e, function (e) {
                  return (e === t) !== n;
                })
              : 'string' != typeof t
              ? E.grep(e, function (e) {
                  return u.call(t, e) > -1 !== n;
                })
              : E.filter(t, e, n);
          }
          (E.filter = function (e, t, n) {
            var r = t[0];
            return (
              n && (e = ':not(' + e + ')'),
              1 === t.length && 1 === r.nodeType
                ? E.find.matchesSelector(r, e)
                  ? [r]
                  : []
                : E.find.matches(
                    e,
                    E.grep(t, function (e) {
                      return 1 === e.nodeType;
                    })
                  )
            );
          }),
            E.fn.extend({
              find: function (e) {
                var t,
                  n,
                  r = this.length,
                  i = this;
                if ('string' != typeof e)
                  return this.pushStack(
                    E(e).filter(function () {
                      for (t = 0; t < r; t++) if (E.contains(i[t], this)) return !0;
                    })
                  );
                for (n = this.pushStack([]), t = 0; t < r; t++) E.find(e, i[t], n);
                return r > 1 ? E.uniqueSort(n) : n;
              },
              filter: function (e) {
                return this.pushStack(W(this, e || [], !1));
              },
              not: function (e) {
                return this.pushStack(W(this, e || [], !0));
              },
              is: function (e) {
                return !!W(this, 'string' == typeof e && R.test(e) ? E(e) : e || [], !1).length;
              },
            });
          var U,
            $ = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
          ((E.fn.init = function (e, t, n) {
            var r, i;
            if (!e) return this;
            if (((n = n || U), 'string' == typeof e)) {
              if (
                !(r =
                  '<' === e[0] && '>' === e[e.length - 1] && e.length >= 3
                    ? [null, e, null]
                    : $.exec(e)) ||
                (!r[1] && t)
              )
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
              if (r[1]) {
                if (
                  ((t = t instanceof E ? t[0] : t),
                  E.merge(this, E.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : b, !0)),
                  H.test(r[1]) && E.isPlainObject(t))
                )
                  for (r in t) y(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this;
              }
              return (i = b.getElementById(r[2])) && ((this[0] = i), (this.length = 1)), this;
            }
            return e.nodeType
              ? ((this[0] = e), (this.length = 1), this)
              : y(e)
              ? void 0 !== n.ready
                ? n.ready(e)
                : e(E)
              : E.makeArray(e, this);
          }).prototype = E.fn),
            (U = E(b));
          var F = /^(?:parents|prev(?:Until|All))/,
            V = { children: !0, contents: !0, next: !0, prev: !0 };
          function G(e, t) {
            for (; (e = e[t]) && 1 !== e.nodeType; );
            return e;
          }
          E.fn.extend({
            has: function (e) {
              var t = E(e, this),
                n = t.length;
              return this.filter(function () {
                for (var e = 0; e < n; e++) if (E.contains(this, t[e])) return !0;
              });
            },
            closest: function (e, t) {
              var n,
                r = 0,
                i = this.length,
                o = [],
                a = 'string' != typeof e && E(e);
              if (!R.test(e))
                for (; r < i; r++)
                  for (n = this[r]; n && n !== t; n = n.parentNode)
                    if (
                      n.nodeType < 11 &&
                      (a ? a.index(n) > -1 : 1 === n.nodeType && E.find.matchesSelector(n, e))
                    ) {
                      o.push(n);
                      break;
                    }
              return this.pushStack(o.length > 1 ? E.uniqueSort(o) : o);
            },
            index: function (e) {
              return e
                ? 'string' == typeof e
                  ? u.call(E(e), this[0])
                  : u.call(this, e.jquery ? e[0] : e)
                : this[0] && this[0].parentNode
                ? this.first().prevAll().length
                : -1;
            },
            add: function (e, t) {
              return this.pushStack(E.uniqueSort(E.merge(this.get(), E(e, t))));
            },
            addBack: function (e) {
              return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
            },
          }),
            E.each(
              {
                parent: function (e) {
                  var t = e.parentNode;
                  return t && 11 !== t.nodeType ? t : null;
                },
                parents: function (e) {
                  return P(e, 'parentNode');
                },
                parentsUntil: function (e, t, n) {
                  return P(e, 'parentNode', n);
                },
                next: function (e) {
                  return G(e, 'nextSibling');
                },
                prev: function (e) {
                  return G(e, 'previousSibling');
                },
                nextAll: function (e) {
                  return P(e, 'nextSibling');
                },
                prevAll: function (e) {
                  return P(e, 'previousSibling');
                },
                nextUntil: function (e, t, n) {
                  return P(e, 'nextSibling', n);
                },
                prevUntil: function (e, t, n) {
                  return P(e, 'previousSibling', n);
                },
                siblings: function (e) {
                  return M((e.parentNode || {}).firstChild, e);
                },
                children: function (e) {
                  return M(e.firstChild);
                },
                contents: function (e) {
                  return null != e.contentDocument && a(e.contentDocument)
                    ? e.contentDocument
                    : (L(e, 'template') && (e = e.content || e), E.merge([], e.childNodes));
                },
              },
              function (e, t) {
                E.fn[e] = function (n, r) {
                  var i = E.map(this, t, n);
                  return (
                    'Until' !== e.slice(-5) && (r = n),
                    r && 'string' == typeof r && (i = E.filter(r, i)),
                    this.length > 1 && (V[e] || E.uniqueSort(i), F.test(e) && i.reverse()),
                    this.pushStack(i)
                  );
                };
              }
            );
          var z = /[^\x20\t\r\n\f]+/g;
          function Q(e) {
            return e;
          }
          function X(e) {
            throw e;
          }
          function J(e, t, n, r) {
            var i;
            try {
              e && y((i = e.promise))
                ? i.call(e).done(t).fail(n)
                : e && y((i = e.then))
                ? i.call(e, t, n)
                : t.apply(void 0, [e].slice(r));
            } catch (e) {
              n.apply(void 0, [e]);
            }
          }
          (E.Callbacks = function (e) {
            e =
              'string' == typeof e
                ? (function (e) {
                    var t = {};
                    return (
                      E.each(e.match(z) || [], function (e, n) {
                        t[n] = !0;
                      }),
                      t
                    );
                  })(e)
                : E.extend({}, e);
            var t,
              n,
              r,
              i,
              o = [],
              a = [],
              s = -1,
              c = function () {
                for (i = i || e.once, r = t = !0; a.length; s = -1)
                  for (n = a.shift(); ++s < o.length; )
                    !1 === o[s].apply(n[0], n[1]) && e.stopOnFalse && ((s = o.length), (n = !1));
                e.memory || (n = !1), (t = !1), i && (o = n ? [] : '');
              },
              l = {
                add: function () {
                  return (
                    o &&
                      (n && !t && ((s = o.length - 1), a.push(n)),
                      (function t(n) {
                        E.each(n, function (n, r) {
                          y(r)
                            ? (e.unique && l.has(r)) || o.push(r)
                            : r && r.length && 'string' !== T(r) && t(r);
                        });
                      })(arguments),
                      n && !t && c()),
                    this
                  );
                },
                remove: function () {
                  return (
                    E.each(arguments, function (e, t) {
                      for (var n; (n = E.inArray(t, o, n)) > -1; ) o.splice(n, 1), n <= s && s--;
                    }),
                    this
                  );
                },
                has: function (e) {
                  return e ? E.inArray(e, o) > -1 : o.length > 0;
                },
                empty: function () {
                  return o && (o = []), this;
                },
                disable: function () {
                  return (i = a = []), (o = n = ''), this;
                },
                disabled: function () {
                  return !o;
                },
                lock: function () {
                  return (i = a = []), n || t || (o = n = ''), this;
                },
                locked: function () {
                  return !!i;
                },
                fireWith: function (e, n) {
                  return (
                    i || ((n = [e, (n = n || []).slice ? n.slice() : n]), a.push(n), t || c()), this
                  );
                },
                fire: function () {
                  return l.fireWith(this, arguments), this;
                },
                fired: function () {
                  return !!r;
                },
              };
            return l;
          }),
            E.extend({
              Deferred: function (e) {
                var t = [
                    ['notify', 'progress', E.Callbacks('memory'), E.Callbacks('memory'), 2],
                    [
                      'resolve',
                      'done',
                      E.Callbacks('once memory'),
                      E.Callbacks('once memory'),
                      0,
                      'resolved',
                    ],
                    [
                      'reject',
                      'fail',
                      E.Callbacks('once memory'),
                      E.Callbacks('once memory'),
                      1,
                      'rejected',
                    ],
                  ],
                  n = 'pending',
                  i = {
                    state: function () {
                      return n;
                    },
                    always: function () {
                      return o.done(arguments).fail(arguments), this;
                    },
                    catch: function (e) {
                      return i.then(null, e);
                    },
                    pipe: function () {
                      var e = arguments;
                      return E.Deferred(function (n) {
                        E.each(t, function (t, r) {
                          var i = y(e[r[4]]) && e[r[4]];
                          o[r[1]](function () {
                            var e = i && i.apply(this, arguments);
                            e && y(e.promise)
                              ? e.promise().progress(n.notify).done(n.resolve).fail(n.reject)
                              : n[r[0] + 'With'](this, i ? [e] : arguments);
                          });
                        }),
                          (e = null);
                      }).promise();
                    },
                    then: function (e, n, i) {
                      var o = 0;
                      function a(e, t, n, i) {
                        return function () {
                          var s = this,
                            c = arguments,
                            l = function () {
                              var r, l;
                              if (!(e < o)) {
                                if ((r = n.apply(s, c)) === t.promise())
                                  throw new TypeError('Thenable self-resolution');
                                (l =
                                  r && ('object' == typeof r || 'function' == typeof r) && r.then),
                                  y(l)
                                    ? i
                                      ? l.call(r, a(o, t, Q, i), a(o, t, X, i))
                                      : (o++,
                                        l.call(
                                          r,
                                          a(o, t, Q, i),
                                          a(o, t, X, i),
                                          a(o, t, Q, t.notifyWith)
                                        ))
                                    : (n !== Q && ((s = void 0), (c = [r])),
                                      (i || t.resolveWith)(s, c));
                              }
                            },
                            u = i
                              ? l
                              : function () {
                                  try {
                                    l();
                                  } catch (r) {
                                    E.Deferred.exceptionHook &&
                                      E.Deferred.exceptionHook(r, u.error),
                                      e + 1 >= o &&
                                        (n !== X && ((s = void 0), (c = [r])), t.rejectWith(s, c));
                                  }
                                };
                          e
                            ? u()
                            : (E.Deferred.getErrorHook
                                ? (u.error = E.Deferred.getErrorHook())
                                : E.Deferred.getStackHook && (u.error = E.Deferred.getStackHook()),
                              r.setTimeout(u));
                        };
                      }
                      return E.Deferred(function (r) {
                        t[0][3].add(a(0, r, y(i) ? i : Q, r.notifyWith)),
                          t[1][3].add(a(0, r, y(e) ? e : Q)),
                          t[2][3].add(a(0, r, y(n) ? n : X));
                      }).promise();
                    },
                    promise: function (e) {
                      return null != e ? E.extend(e, i) : i;
                    },
                  },
                  o = {};
                return (
                  E.each(t, function (e, r) {
                    var a = r[2],
                      s = r[5];
                    (i[r[1]] = a.add),
                      s &&
                        a.add(
                          function () {
                            n = s;
                          },
                          t[3 - e][2].disable,
                          t[3 - e][3].disable,
                          t[0][2].lock,
                          t[0][3].lock
                        ),
                      a.add(r[3].fire),
                      (o[r[0]] = function () {
                        return o[r[0] + 'With'](this === o ? void 0 : this, arguments), this;
                      }),
                      (o[r[0] + 'With'] = a.fireWith);
                  }),
                  i.promise(o),
                  e && e.call(o, o),
                  o
                );
              },
              when: function (e) {
                var t = arguments.length,
                  n = t,
                  r = Array(n),
                  i = s.call(arguments),
                  o = E.Deferred(),
                  a = function (e) {
                    return function (n) {
                      (r[e] = this),
                        (i[e] = arguments.length > 1 ? s.call(arguments) : n),
                        --t || o.resolveWith(r, i);
                    };
                  };
                if (
                  t <= 1 &&
                  (J(e, o.done(a(n)).resolve, o.reject, !t),
                  'pending' === o.state() || y(i[n] && i[n].then))
                )
                  return o.then();
                for (; n--; ) J(i[n], a(n), o.reject);
                return o.promise();
              },
            });
          var Z = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
          (E.Deferred.exceptionHook = function (e, t) {
            r.console &&
              r.console.warn &&
              e &&
              Z.test(e.name) &&
              r.console.warn('jQuery.Deferred exception: ' + e.message, e.stack, t);
          }),
            (E.readyException = function (e) {
              r.setTimeout(function () {
                throw e;
              });
            });
          var Y = E.Deferred();
          function K() {
            b.removeEventListener('DOMContentLoaded', K),
              r.removeEventListener('load', K),
              E.ready();
          }
          (E.fn.ready = function (e) {
            return (
              Y.then(e).catch(function (e) {
                E.readyException(e);
              }),
              this
            );
          }),
            E.extend({
              isReady: !1,
              readyWait: 1,
              ready: function (e) {
                (!0 === e ? --E.readyWait : E.isReady) ||
                  ((E.isReady = !0), (!0 !== e && --E.readyWait > 0) || Y.resolveWith(b, [E]));
              },
            }),
            (E.ready.then = Y.then),
            'complete' === b.readyState ||
            ('loading' !== b.readyState && !b.documentElement.doScroll)
              ? r.setTimeout(E.ready)
              : (b.addEventListener('DOMContentLoaded', K), r.addEventListener('load', K));
          var ee = function (e, t, n, r, i, o, a) {
              var s = 0,
                c = e.length,
                l = null == n;
              if ('object' === T(n)) for (s in ((i = !0), n)) ee(e, t, s, n[s], !0, o, a);
              else if (
                void 0 !== r &&
                ((i = !0),
                y(r) || (a = !0),
                l &&
                  (a
                    ? (t.call(e, r), (t = null))
                    : ((l = t),
                      (t = function (e, t, n) {
                        return l.call(E(e), n);
                      }))),
                t)
              )
                for (; s < c; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
              return i ? e : l ? t.call(e) : c ? t(e[0], n) : o;
            },
            te = /^-ms-/,
            ne = /-([a-z])/g;
          function re(e, t) {
            return t.toUpperCase();
          }
          function ie(e) {
            return e.replace(te, 'ms-').replace(ne, re);
          }
          var oe = function (e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
          };
          function ae() {
            this.expando = E.expando + ae.uid++;
          }
          (ae.uid = 1),
            (ae.prototype = {
              cache: function (e) {
                var t = e[this.expando];
                return (
                  t ||
                    ((t = {}),
                    oe(e) &&
                      (e.nodeType
                        ? (e[this.expando] = t)
                        : Object.defineProperty(e, this.expando, { value: t, configurable: !0 }))),
                  t
                );
              },
              set: function (e, t, n) {
                var r,
                  i = this.cache(e);
                if ('string' == typeof t) i[ie(t)] = n;
                else for (r in t) i[ie(r)] = t[r];
                return i;
              },
              get: function (e, t) {
                return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][ie(t)];
              },
              access: function (e, t, n) {
                return void 0 === t || (t && 'string' == typeof t && void 0 === n)
                  ? this.get(e, t)
                  : (this.set(e, t, n), void 0 !== n ? n : t);
              },
              remove: function (e, t) {
                var n,
                  r = e[this.expando];
                if (void 0 !== r) {
                  if (void 0 !== t) {
                    n = (t = Array.isArray(t)
                      ? t.map(ie)
                      : (t = ie(t)) in r
                      ? [t]
                      : t.match(z) || []).length;
                    for (; n--; ) delete r[t[n]];
                  }
                  (void 0 === t || E.isEmptyObject(r)) &&
                    (e.nodeType ? (e[this.expando] = void 0) : delete e[this.expando]);
                }
              },
              hasData: function (e) {
                var t = e[this.expando];
                return void 0 !== t && !E.isEmptyObject(t);
              },
            });
          var se = new ae(),
            ce = new ae(),
            le = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            ue = /[A-Z]/g;
          function fe(e, t, n) {
            var r;
            if (void 0 === n && 1 === e.nodeType)
              if (
                ((r = 'data-' + t.replace(ue, '-$&').toLowerCase()),
                'string' == typeof (n = e.getAttribute(r)))
              ) {
                try {
                  n = (function (e) {
                    return (
                      'true' === e ||
                      ('false' !== e &&
                        ('null' === e ? null : e === +e + '' ? +e : le.test(e) ? JSON.parse(e) : e))
                    );
                  })(n);
                } catch (e) {}
                ce.set(e, t, n);
              } else n = void 0;
            return n;
          }
          E.extend({
            hasData: function (e) {
              return ce.hasData(e) || se.hasData(e);
            },
            data: function (e, t, n) {
              return ce.access(e, t, n);
            },
            removeData: function (e, t) {
              ce.remove(e, t);
            },
            _data: function (e, t, n) {
              return se.access(e, t, n);
            },
            _removeData: function (e, t) {
              se.remove(e, t);
            },
          }),
            E.fn.extend({
              data: function (e, t) {
                var n,
                  r,
                  i,
                  o = this[0],
                  a = o && o.attributes;
                if (void 0 === e) {
                  if (
                    this.length &&
                    ((i = ce.get(o)), 1 === o.nodeType && !se.get(o, 'hasDataAttrs'))
                  ) {
                    for (n = a.length; n--; )
                      a[n] &&
                        0 === (r = a[n].name).indexOf('data-') &&
                        ((r = ie(r.slice(5))), fe(o, r, i[r]));
                    se.set(o, 'hasDataAttrs', !0);
                  }
                  return i;
                }
                return 'object' == typeof e
                  ? this.each(function () {
                      ce.set(this, e);
                    })
                  : ee(
                      this,
                      function (t) {
                        var n;
                        if (o && void 0 === t)
                          return void 0 !== (n = ce.get(o, e)) || void 0 !== (n = fe(o, e))
                            ? n
                            : void 0;
                        this.each(function () {
                          ce.set(this, e, t);
                        });
                      },
                      null,
                      t,
                      arguments.length > 1,
                      null,
                      !0
                    );
              },
              removeData: function (e) {
                return this.each(function () {
                  ce.remove(this, e);
                });
              },
            }),
            E.extend({
              queue: function (e, t, n) {
                var r;
                if (e)
                  return (
                    (t = (t || 'fx') + 'queue'),
                    (r = se.get(e, t)),
                    n &&
                      (!r || Array.isArray(n) ? (r = se.access(e, t, E.makeArray(n))) : r.push(n)),
                    r || []
                  );
              },
              dequeue: function (e, t) {
                t = t || 'fx';
                var n = E.queue(e, t),
                  r = n.length,
                  i = n.shift(),
                  o = E._queueHooks(e, t);
                'inprogress' === i && ((i = n.shift()), r--),
                  i &&
                    ('fx' === t && n.unshift('inprogress'),
                    delete o.stop,
                    i.call(
                      e,
                      function () {
                        E.dequeue(e, t);
                      },
                      o
                    )),
                  !r && o && o.empty.fire();
              },
              _queueHooks: function (e, t) {
                var n = t + 'queueHooks';
                return (
                  se.get(e, n) ||
                  se.access(e, n, {
                    empty: E.Callbacks('once memory').add(function () {
                      se.remove(e, [t + 'queue', n]);
                    }),
                  })
                );
              },
            }),
            E.fn.extend({
              queue: function (e, t) {
                var n = 2;
                return (
                  'string' != typeof e && ((t = e), (e = 'fx'), n--),
                  arguments.length < n
                    ? E.queue(this[0], e)
                    : void 0 === t
                    ? this
                    : this.each(function () {
                        var n = E.queue(this, e, t);
                        E._queueHooks(this, e),
                          'fx' === e && 'inprogress' !== n[0] && E.dequeue(this, e);
                      })
                );
              },
              dequeue: function (e) {
                return this.each(function () {
                  E.dequeue(this, e);
                });
              },
              clearQueue: function (e) {
                return this.queue(e || 'fx', []);
              },
              promise: function (e, t) {
                var n,
                  r = 1,
                  i = E.Deferred(),
                  o = this,
                  a = this.length,
                  s = function () {
                    --r || i.resolveWith(o, [o]);
                  };
                for ('string' != typeof e && ((t = e), (e = void 0)), e = e || 'fx'; a--; )
                  (n = se.get(o[a], e + 'queueHooks')) && n.empty && (r++, n.empty.add(s));
                return s(), i.promise(t);
              },
            });
          var de = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            pe = new RegExp('^(?:([+-])=|)(' + de + ')([a-z%]*)$', 'i'),
            he = ['Top', 'Right', 'Bottom', 'Left'],
            me = b.documentElement,
            ge = function (e) {
              return E.contains(e.ownerDocument, e);
            },
            ye = { composed: !0 };
          me.getRootNode &&
            (ge = function (e) {
              return E.contains(e.ownerDocument, e) || e.getRootNode(ye) === e.ownerDocument;
            });
          var ve = function (e, t) {
            return (
              'none' === (e = t || e).style.display ||
              ('' === e.style.display && ge(e) && 'none' === E.css(e, 'display'))
            );
          };
          function be(e, t, n, r) {
            var i,
              o,
              a = 20,
              s = r
                ? function () {
                    return r.cur();
                  }
                : function () {
                    return E.css(e, t, '');
                  },
              c = s(),
              l = (n && n[3]) || (E.cssNumber[t] ? '' : 'px'),
              u = e.nodeType && (E.cssNumber[t] || ('px' !== l && +c)) && pe.exec(E.css(e, t));
            if (u && u[3] !== l) {
              for (c /= 2, l = l || u[3], u = +c || 1; a--; )
                E.style(e, t, u + l),
                  (1 - o) * (1 - (o = s() / c || 0.5)) <= 0 && (a = 0),
                  (u /= o);
              (u *= 2), E.style(e, t, u + l), (n = n || []);
            }
            return (
              n &&
                ((u = +u || +c || 0),
                (i = n[1] ? u + (n[1] + 1) * n[2] : +n[2]),
                r && ((r.unit = l), (r.start = u), (r.end = i))),
              i
            );
          }
          var xe = {};
          function we(e) {
            var t,
              n = e.ownerDocument,
              r = e.nodeName,
              i = xe[r];
            return (
              i ||
              ((t = n.body.appendChild(n.createElement(r))),
              (i = E.css(t, 'display')),
              t.parentNode.removeChild(t),
              'none' === i && (i = 'block'),
              (xe[r] = i),
              i)
            );
          }
          function Te(e, t) {
            for (var n, r, i = [], o = 0, a = e.length; o < a; o++)
              (r = e[o]).style &&
                ((n = r.style.display),
                t
                  ? ('none' === n &&
                      ((i[o] = se.get(r, 'display') || null), i[o] || (r.style.display = '')),
                    '' === r.style.display && ve(r) && (i[o] = we(r)))
                  : 'none' !== n && ((i[o] = 'none'), se.set(r, 'display', n)));
            for (o = 0; o < a; o++) null != i[o] && (e[o].style.display = i[o]);
            return e;
          }
          E.fn.extend({
            show: function () {
              return Te(this, !0);
            },
            hide: function () {
              return Te(this);
            },
            toggle: function (e) {
              return 'boolean' == typeof e
                ? e
                  ? this.show()
                  : this.hide()
                : this.each(function () {
                    ve(this) ? E(this).show() : E(this).hide();
                  });
            },
          });
          var ke,
            _e,
            Ee = /^(?:checkbox|radio)$/i,
            Se = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
            Le = /^$|^module$|\/(?:java|ecma)script/i;
          (ke = b.createDocumentFragment().appendChild(b.createElement('div'))),
            (_e = b.createElement('input')).setAttribute('type', 'radio'),
            _e.setAttribute('checked', 'checked'),
            _e.setAttribute('name', 't'),
            ke.appendChild(_e),
            (g.checkClone = ke.cloneNode(!0).cloneNode(!0).lastChild.checked),
            (ke.innerHTML = '<textarea>x</textarea>'),
            (g.noCloneChecked = !!ke.cloneNode(!0).lastChild.defaultValue),
            (ke.innerHTML = '<option></option>'),
            (g.option = !!ke.lastChild);
          var Ae = {
            thead: [1, '<table>', '</table>'],
            col: [2, '<table><colgroup>', '</colgroup></table>'],
            tr: [2, '<table><tbody>', '</tbody></table>'],
            td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            _default: [0, '', ''],
          };
          function Ce(e, t) {
            var n;
            return (
              (n =
                void 0 !== e.getElementsByTagName
                  ? e.getElementsByTagName(t || '*')
                  : void 0 !== e.querySelectorAll
                  ? e.querySelectorAll(t || '*')
                  : []),
              void 0 === t || (t && L(e, t)) ? E.merge([e], n) : n
            );
          }
          function Ne(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
              se.set(e[n], 'globalEval', !t || se.get(t[n], 'globalEval'));
          }
          (Ae.tbody = Ae.tfoot = Ae.colgroup = Ae.caption = Ae.thead),
            (Ae.th = Ae.td),
            g.option ||
              (Ae.optgroup = Ae.option = [1, "<select multiple='multiple'>", '</select>']);
          var Ie = /<|&#?\w+;/;
          function De(e, t, n, r, i) {
            for (
              var o, a, s, c, l, u, f = t.createDocumentFragment(), d = [], p = 0, h = e.length;
              p < h;
              p++
            )
              if ((o = e[p]) || 0 === o)
                if ('object' === T(o)) E.merge(d, o.nodeType ? [o] : o);
                else if (Ie.test(o)) {
                  for (
                    a = a || f.appendChild(t.createElement('div')),
                      s = (Se.exec(o) || ['', ''])[1].toLowerCase(),
                      c = Ae[s] || Ae._default,
                      a.innerHTML = c[1] + E.htmlPrefilter(o) + c[2],
                      u = c[0];
                    u--;

                  )
                    a = a.lastChild;
                  E.merge(d, a.childNodes), ((a = f.firstChild).textContent = '');
                } else d.push(t.createTextNode(o));
            for (f.textContent = '', p = 0; (o = d[p++]); )
              if (r && E.inArray(o, r) > -1) i && i.push(o);
              else if (((l = ge(o)), (a = Ce(f.appendChild(o), 'script')), l && Ne(a), n))
                for (u = 0; (o = a[u++]); ) Le.test(o.type || '') && n.push(o);
            return f;
          }
          var Oe = /^([^.]*)(?:\.(.+)|)/;
          function qe() {
            return !0;
          }
          function Be() {
            return !1;
          }
          function je(e, t, n, r, i, o) {
            var a, s;
            if ('object' == typeof t) {
              for (s in ('string' != typeof n && ((r = r || n), (n = void 0)), t))
                je(e, s, n, r, t[s], o);
              return e;
            }
            if (
              (null == r && null == i
                ? ((i = n), (r = n = void 0))
                : null == i &&
                  ('string' == typeof n
                    ? ((i = r), (r = void 0))
                    : ((i = r), (r = n), (n = void 0))),
              !1 === i)
            )
              i = Be;
            else if (!i) return e;
            return (
              1 === o &&
                ((a = i),
                (i = function (e) {
                  return E().off(e), a.apply(this, arguments);
                }),
                (i.guid = a.guid || (a.guid = E.guid++))),
              e.each(function () {
                E.event.add(this, t, i, r, n);
              })
            );
          }
          function Pe(e, t, n) {
            n
              ? (se.set(e, t, !1),
                E.event.add(e, t, {
                  namespace: !1,
                  handler: function (e) {
                    var n,
                      r = se.get(this, t);
                    if (1 & e.isTrigger && this[t]) {
                      if (r) (E.event.special[t] || {}).delegateType && e.stopPropagation();
                      else if (
                        ((r = s.call(arguments)),
                        se.set(this, t, r),
                        this[t](),
                        (n = se.get(this, t)),
                        se.set(this, t, !1),
                        r !== n)
                      )
                        return e.stopImmediatePropagation(), e.preventDefault(), n;
                    } else
                      r &&
                        (se.set(this, t, E.event.trigger(r[0], r.slice(1), this)),
                        e.stopPropagation(),
                        (e.isImmediatePropagationStopped = qe));
                  },
                }))
              : void 0 === se.get(e, t) && E.event.add(e, t, qe);
          }
          (E.event = {
            global: {},
            add: function (e, t, n, r, i) {
              var o,
                a,
                s,
                c,
                l,
                u,
                f,
                d,
                p,
                h,
                m,
                g = se.get(e);
              if (oe(e))
                for (
                  n.handler && ((n = (o = n).handler), (i = o.selector)),
                    i && E.find.matchesSelector(me, i),
                    n.guid || (n.guid = E.guid++),
                    (c = g.events) || (c = g.events = Object.create(null)),
                    (a = g.handle) ||
                      (a = g.handle =
                        function (t) {
                          return void 0 !== E && E.event.triggered !== t.type
                            ? E.event.dispatch.apply(e, arguments)
                            : void 0;
                        }),
                    l = (t = (t || '').match(z) || ['']).length;
                  l--;

                )
                  (p = m = (s = Oe.exec(t[l]) || [])[1]),
                    (h = (s[2] || '').split('.').sort()),
                    p &&
                      ((f = E.event.special[p] || {}),
                      (p = (i ? f.delegateType : f.bindType) || p),
                      (f = E.event.special[p] || {}),
                      (u = E.extend(
                        {
                          type: p,
                          origType: m,
                          data: r,
                          handler: n,
                          guid: n.guid,
                          selector: i,
                          needsContext: i && E.expr.match.needsContext.test(i),
                          namespace: h.join('.'),
                        },
                        o
                      )),
                      (d = c[p]) ||
                        (((d = c[p] = []).delegateCount = 0),
                        (f.setup && !1 !== f.setup.call(e, r, h, a)) ||
                          (e.addEventListener && e.addEventListener(p, a))),
                      f.add && (f.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)),
                      i ? d.splice(d.delegateCount++, 0, u) : d.push(u),
                      (E.event.global[p] = !0));
            },
            remove: function (e, t, n, r, i) {
              var o,
                a,
                s,
                c,
                l,
                u,
                f,
                d,
                p,
                h,
                m,
                g = se.hasData(e) && se.get(e);
              if (g && (c = g.events)) {
                for (l = (t = (t || '').match(z) || ['']).length; l--; )
                  if (
                    ((p = m = (s = Oe.exec(t[l]) || [])[1]),
                    (h = (s[2] || '').split('.').sort()),
                    p)
                  ) {
                    for (
                      f = E.event.special[p] || {},
                        d = c[(p = (r ? f.delegateType : f.bindType) || p)] || [],
                        s = s[2] && new RegExp('(^|\\.)' + h.join('\\.(?:.*\\.|)') + '(\\.|$)'),
                        a = o = d.length;
                      o--;

                    )
                      (u = d[o]),
                        (!i && m !== u.origType) ||
                          (n && n.guid !== u.guid) ||
                          (s && !s.test(u.namespace)) ||
                          (r && r !== u.selector && ('**' !== r || !u.selector)) ||
                          (d.splice(o, 1),
                          u.selector && d.delegateCount--,
                          f.remove && f.remove.call(e, u));
                    a &&
                      !d.length &&
                      ((f.teardown && !1 !== f.teardown.call(e, h, g.handle)) ||
                        E.removeEvent(e, p, g.handle),
                      delete c[p]);
                  } else for (p in c) E.event.remove(e, p + t[l], n, r, !0);
                E.isEmptyObject(c) && se.remove(e, 'handle events');
              }
            },
            dispatch: function (e) {
              var t,
                n,
                r,
                i,
                o,
                a,
                s = new Array(arguments.length),
                c = E.event.fix(e),
                l = (se.get(this, 'events') || Object.create(null))[c.type] || [],
                u = E.event.special[c.type] || {};
              for (s[0] = c, t = 1; t < arguments.length; t++) s[t] = arguments[t];
              if (
                ((c.delegateTarget = this), !u.preDispatch || !1 !== u.preDispatch.call(this, c))
              ) {
                for (
                  a = E.event.handlers.call(this, c, l), t = 0;
                  (i = a[t++]) && !c.isPropagationStopped();

                )
                  for (
                    c.currentTarget = i.elem, n = 0;
                    (o = i.handlers[n++]) && !c.isImmediatePropagationStopped();

                  )
                    (c.rnamespace && !1 !== o.namespace && !c.rnamespace.test(o.namespace)) ||
                      ((c.handleObj = o),
                      (c.data = o.data),
                      void 0 !==
                        (r = ((E.event.special[o.origType] || {}).handle || o.handler).apply(
                          i.elem,
                          s
                        )) &&
                        !1 === (c.result = r) &&
                        (c.preventDefault(), c.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, c), c.result;
              }
            },
            handlers: function (e, t) {
              var n,
                r,
                i,
                o,
                a,
                s = [],
                c = t.delegateCount,
                l = e.target;
              if (c && l.nodeType && !('click' === e.type && e.button >= 1))
                for (; l !== this; l = l.parentNode || this)
                  if (1 === l.nodeType && ('click' !== e.type || !0 !== l.disabled)) {
                    for (o = [], a = {}, n = 0; n < c; n++)
                      void 0 === a[(i = (r = t[n]).selector + ' ')] &&
                        (a[i] = r.needsContext
                          ? E(i, this).index(l) > -1
                          : E.find(i, this, null, [l]).length),
                        a[i] && o.push(r);
                    o.length && s.push({ elem: l, handlers: o });
                  }
              return (l = this), c < t.length && s.push({ elem: l, handlers: t.slice(c) }), s;
            },
            addProp: function (e, t) {
              Object.defineProperty(E.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: y(t)
                  ? function () {
                      if (this.originalEvent) return t(this.originalEvent);
                    }
                  : function () {
                      if (this.originalEvent) return this.originalEvent[e];
                    },
                set: function (t) {
                  Object.defineProperty(this, e, {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: t,
                  });
                },
              });
            },
            fix: function (e) {
              return e[E.expando] ? e : new E.Event(e);
            },
            special: {
              load: { noBubble: !0 },
              click: {
                setup: function (e) {
                  var t = this || e;
                  return Ee.test(t.type) && t.click && L(t, 'input') && Pe(t, 'click', !0), !1;
                },
                trigger: function (e) {
                  var t = this || e;
                  return Ee.test(t.type) && t.click && L(t, 'input') && Pe(t, 'click'), !0;
                },
                _default: function (e) {
                  var t = e.target;
                  return (
                    (Ee.test(t.type) && t.click && L(t, 'input') && se.get(t, 'click')) || L(t, 'a')
                  );
                },
              },
              beforeunload: {
                postDispatch: function (e) {
                  void 0 !== e.result &&
                    e.originalEvent &&
                    (e.originalEvent.returnValue = e.result);
                },
              },
            },
          }),
            (E.removeEvent = function (e, t, n) {
              e.removeEventListener && e.removeEventListener(t, n);
            }),
            (E.Event = function (e, t) {
              if (!(this instanceof E.Event)) return new E.Event(e, t);
              e && e.type
                ? ((this.originalEvent = e),
                  (this.type = e.type),
                  (this.isDefaultPrevented =
                    e.defaultPrevented || (void 0 === e.defaultPrevented && !1 === e.returnValue)
                      ? qe
                      : Be),
                  (this.target =
                    e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target),
                  (this.currentTarget = e.currentTarget),
                  (this.relatedTarget = e.relatedTarget))
                : (this.type = e),
                t && E.extend(this, t),
                (this.timeStamp = (e && e.timeStamp) || Date.now()),
                (this[E.expando] = !0);
            }),
            (E.Event.prototype = {
              constructor: E.Event,
              isDefaultPrevented: Be,
              isPropagationStopped: Be,
              isImmediatePropagationStopped: Be,
              isSimulated: !1,
              preventDefault: function () {
                var e = this.originalEvent;
                (this.isDefaultPrevented = qe), e && !this.isSimulated && e.preventDefault();
              },
              stopPropagation: function () {
                var e = this.originalEvent;
                (this.isPropagationStopped = qe), e && !this.isSimulated && e.stopPropagation();
              },
              stopImmediatePropagation: function () {
                var e = this.originalEvent;
                (this.isImmediatePropagationStopped = qe),
                  e && !this.isSimulated && e.stopImmediatePropagation(),
                  this.stopPropagation();
              },
            }),
            E.each(
              {
                altKey: !0,
                bubbles: !0,
                cancelable: !0,
                changedTouches: !0,
                ctrlKey: !0,
                detail: !0,
                eventPhase: !0,
                metaKey: !0,
                pageX: !0,
                pageY: !0,
                shiftKey: !0,
                view: !0,
                char: !0,
                code: !0,
                charCode: !0,
                key: !0,
                keyCode: !0,
                button: !0,
                buttons: !0,
                clientX: !0,
                clientY: !0,
                offsetX: !0,
                offsetY: !0,
                pointerId: !0,
                pointerType: !0,
                screenX: !0,
                screenY: !0,
                targetTouches: !0,
                toElement: !0,
                touches: !0,
                which: !0,
              },
              E.event.addProp
            ),
            E.each({ focus: 'focusin', blur: 'focusout' }, function (e, t) {
              function n(e) {
                if (b.documentMode) {
                  var n = se.get(this, 'handle'),
                    r = E.event.fix(e);
                  (r.type = 'focusin' === e.type ? 'focus' : 'blur'),
                    (r.isSimulated = !0),
                    n(e),
                    r.target === r.currentTarget && n(r);
                } else E.event.simulate(t, e.target, E.event.fix(e));
              }
              (E.event.special[e] = {
                setup: function () {
                  var r;
                  if ((Pe(this, e, !0), !b.documentMode)) return !1;
                  (r = se.get(this, t)) || this.addEventListener(t, n),
                    se.set(this, t, (r || 0) + 1);
                },
                trigger: function () {
                  return Pe(this, e), !0;
                },
                teardown: function () {
                  var e;
                  if (!b.documentMode) return !1;
                  (e = se.get(this, t) - 1)
                    ? se.set(this, t, e)
                    : (this.removeEventListener(t, n), se.remove(this, t));
                },
                _default: function (t) {
                  return se.get(t.target, e);
                },
                delegateType: t,
              }),
                (E.event.special[t] = {
                  setup: function () {
                    var r = this.ownerDocument || this.document || this,
                      i = b.documentMode ? this : r,
                      o = se.get(i, t);
                    o ||
                      (b.documentMode ? this.addEventListener(t, n) : r.addEventListener(e, n, !0)),
                      se.set(i, t, (o || 0) + 1);
                  },
                  teardown: function () {
                    var r = this.ownerDocument || this.document || this,
                      i = b.documentMode ? this : r,
                      o = se.get(i, t) - 1;
                    o
                      ? se.set(i, t, o)
                      : (b.documentMode
                          ? this.removeEventListener(t, n)
                          : r.removeEventListener(e, n, !0),
                        se.remove(i, t));
                  },
                });
            }),
            E.each(
              {
                mouseenter: 'mouseover',
                mouseleave: 'mouseout',
                pointerenter: 'pointerover',
                pointerleave: 'pointerout',
              },
              function (e, t) {
                E.event.special[e] = {
                  delegateType: t,
                  bindType: t,
                  handle: function (e) {
                    var n,
                      r = e.relatedTarget,
                      i = e.handleObj;
                    return (
                      (r && (r === this || E.contains(this, r))) ||
                        ((e.type = i.origType),
                        (n = i.handler.apply(this, arguments)),
                        (e.type = t)),
                      n
                    );
                  },
                };
              }
            ),
            E.fn.extend({
              on: function (e, t, n, r) {
                return je(this, e, t, n, r);
              },
              one: function (e, t, n, r) {
                return je(this, e, t, n, r, 1);
              },
              off: function (e, t, n) {
                var r, i;
                if (e && e.preventDefault && e.handleObj)
                  return (
                    (r = e.handleObj),
                    E(e.delegateTarget).off(
                      r.namespace ? r.origType + '.' + r.namespace : r.origType,
                      r.selector,
                      r.handler
                    ),
                    this
                  );
                if ('object' == typeof e) {
                  for (i in e) this.off(i, t, e[i]);
                  return this;
                }
                return (
                  (!1 !== t && 'function' != typeof t) || ((n = t), (t = void 0)),
                  !1 === n && (n = Be),
                  this.each(function () {
                    E.event.remove(this, e, n, t);
                  })
                );
              },
            });
          var Me = /<script|<style|<link/i,
            Re = /checked\s*(?:[^=]|=\s*.checked.)/i,
            He = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
          function We(e, t) {
            return (
              (L(e, 'table') &&
                L(11 !== t.nodeType ? t : t.firstChild, 'tr') &&
                E(e).children('tbody')[0]) ||
              e
            );
          }
          function Ue(e) {
            return (e.type = (null !== e.getAttribute('type')) + '/' + e.type), e;
          }
          function $e(e) {
            return (
              'true/' === (e.type || '').slice(0, 5)
                ? (e.type = e.type.slice(5))
                : e.removeAttribute('type'),
              e
            );
          }
          function Fe(e, t) {
            var n, r, i, o, a, s;
            if (1 === t.nodeType) {
              if (se.hasData(e) && (s = se.get(e).events))
                for (i in (se.remove(t, 'handle events'), s))
                  for (n = 0, r = s[i].length; n < r; n++) E.event.add(t, i, s[i][n]);
              ce.hasData(e) && ((o = ce.access(e)), (a = E.extend({}, o)), ce.set(t, a));
            }
          }
          function Ve(e, t) {
            var n = t.nodeName.toLowerCase();
            'input' === n && Ee.test(e.type)
              ? (t.checked = e.checked)
              : ('input' !== n && 'textarea' !== n) || (t.defaultValue = e.defaultValue);
          }
          function Ge(e, t, n, r) {
            t = c(t);
            var i,
              o,
              a,
              s,
              l,
              u,
              f = 0,
              d = e.length,
              p = d - 1,
              h = t[0],
              m = y(h);
            if (m || (d > 1 && 'string' == typeof h && !g.checkClone && Re.test(h)))
              return e.each(function (i) {
                var o = e.eq(i);
                m && (t[0] = h.call(this, i, o.html())), Ge(o, t, n, r);
              });
            if (
              d &&
              ((o = (i = De(t, e[0].ownerDocument, !1, e, r)).firstChild),
              1 === i.childNodes.length && (i = o),
              o || r)
            ) {
              for (s = (a = E.map(Ce(i, 'script'), Ue)).length; f < d; f++)
                (l = i),
                  f !== p && ((l = E.clone(l, !0, !0)), s && E.merge(a, Ce(l, 'script'))),
                  n.call(e[f], l, f);
              if (s)
                for (u = a[a.length - 1].ownerDocument, E.map(a, $e), f = 0; f < s; f++)
                  (l = a[f]),
                    Le.test(l.type || '') &&
                      !se.access(l, 'globalEval') &&
                      E.contains(u, l) &&
                      (l.src && 'module' !== (l.type || '').toLowerCase()
                        ? E._evalUrl &&
                          !l.noModule &&
                          E._evalUrl(l.src, { nonce: l.nonce || l.getAttribute('nonce') }, u)
                        : w(l.textContent.replace(He, ''), l, u));
            }
            return e;
          }
          function ze(e, t, n) {
            for (var r, i = t ? E.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
              n || 1 !== r.nodeType || E.cleanData(Ce(r)),
                r.parentNode && (n && ge(r) && Ne(Ce(r, 'script')), r.parentNode.removeChild(r));
            return e;
          }
          E.extend({
            htmlPrefilter: function (e) {
              return e;
            },
            clone: function (e, t, n) {
              var r,
                i,
                o,
                a,
                s = e.cloneNode(!0),
                c = ge(e);
              if (!(g.noCloneChecked || (1 !== e.nodeType && 11 !== e.nodeType) || E.isXMLDoc(e)))
                for (a = Ce(s), r = 0, i = (o = Ce(e)).length; r < i; r++) Ve(o[r], a[r]);
              if (t)
                if (n)
                  for (o = o || Ce(e), a = a || Ce(s), r = 0, i = o.length; r < i; r++)
                    Fe(o[r], a[r]);
                else Fe(e, s);
              return (a = Ce(s, 'script')).length > 0 && Ne(a, !c && Ce(e, 'script')), s;
            },
            cleanData: function (e) {
              for (var t, n, r, i = E.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (oe(n)) {
                  if ((t = n[se.expando])) {
                    if (t.events)
                      for (r in t.events)
                        i[r] ? E.event.remove(n, r) : E.removeEvent(n, r, t.handle);
                    n[se.expando] = void 0;
                  }
                  n[ce.expando] && (n[ce.expando] = void 0);
                }
            },
          }),
            E.fn.extend({
              detach: function (e) {
                return ze(this, e, !0);
              },
              remove: function (e) {
                return ze(this, e);
              },
              text: function (e) {
                return ee(
                  this,
                  function (e) {
                    return void 0 === e
                      ? E.text(this)
                      : this.empty().each(function () {
                          (1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType) ||
                            (this.textContent = e);
                        });
                  },
                  null,
                  e,
                  arguments.length
                );
              },
              append: function () {
                return Ge(this, arguments, function (e) {
                  (1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType) ||
                    We(this, e).appendChild(e);
                });
              },
              prepend: function () {
                return Ge(this, arguments, function (e) {
                  if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = We(this, e);
                    t.insertBefore(e, t.firstChild);
                  }
                });
              },
              before: function () {
                return Ge(this, arguments, function (e) {
                  this.parentNode && this.parentNode.insertBefore(e, this);
                });
              },
              after: function () {
                return Ge(this, arguments, function (e) {
                  this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
                });
              },
              empty: function () {
                for (var e, t = 0; null != (e = this[t]); t++)
                  1 === e.nodeType && (E.cleanData(Ce(e, !1)), (e.textContent = ''));
                return this;
              },
              clone: function (e, t) {
                return (
                  (e = null != e && e),
                  (t = null == t ? e : t),
                  this.map(function () {
                    return E.clone(this, e, t);
                  })
                );
              },
              html: function (e) {
                return ee(
                  this,
                  function (e) {
                    var t = this[0] || {},
                      n = 0,
                      r = this.length;
                    if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                    if (
                      'string' == typeof e &&
                      !Me.test(e) &&
                      !Ae[(Se.exec(e) || ['', ''])[1].toLowerCase()]
                    ) {
                      e = E.htmlPrefilter(e);
                      try {
                        for (; n < r; n++)
                          1 === (t = this[n] || {}).nodeType &&
                            (E.cleanData(Ce(t, !1)), (t.innerHTML = e));
                        t = 0;
                      } catch (e) {}
                    }
                    t && this.empty().append(e);
                  },
                  null,
                  e,
                  arguments.length
                );
              },
              replaceWith: function () {
                var e = [];
                return Ge(
                  this,
                  arguments,
                  function (t) {
                    var n = this.parentNode;
                    E.inArray(this, e) < 0 && (E.cleanData(Ce(this)), n && n.replaceChild(t, this));
                  },
                  e
                );
              },
            }),
            E.each(
              {
                appendTo: 'append',
                prependTo: 'prepend',
                insertBefore: 'before',
                insertAfter: 'after',
                replaceAll: 'replaceWith',
              },
              function (e, t) {
                E.fn[e] = function (e) {
                  for (var n, r = [], i = E(e), o = i.length - 1, a = 0; a <= o; a++)
                    (n = a === o ? this : this.clone(!0)), E(i[a])[t](n), l.apply(r, n.get());
                  return this.pushStack(r);
                };
              }
            );
          var Qe = new RegExp('^(' + de + ')(?!px)[a-z%]+$', 'i'),
            Xe = /^--/,
            Je = function (e) {
              var t = e.ownerDocument.defaultView;
              return (t && t.opener) || (t = r), t.getComputedStyle(e);
            },
            Ze = function (e, t, n) {
              var r,
                i,
                o = {};
              for (i in t) (o[i] = e.style[i]), (e.style[i] = t[i]);
              for (i in ((r = n.call(e)), t)) e.style[i] = o[i];
              return r;
            },
            Ye = new RegExp(he.join('|'), 'i');
          function Ke(e, t, n) {
            var r,
              i,
              o,
              a,
              s = Xe.test(t),
              c = e.style;
            return (
              (n = n || Je(e)) &&
                ((a = n.getPropertyValue(t) || n[t]),
                s && a && (a = a.replace(D, '$1') || void 0),
                '' !== a || ge(e) || (a = E.style(e, t)),
                !g.pixelBoxStyles() &&
                  Qe.test(a) &&
                  Ye.test(t) &&
                  ((r = c.width),
                  (i = c.minWidth),
                  (o = c.maxWidth),
                  (c.minWidth = c.maxWidth = c.width = a),
                  (a = n.width),
                  (c.width = r),
                  (c.minWidth = i),
                  (c.maxWidth = o))),
              void 0 !== a ? a + '' : a
            );
          }
          function et(e, t) {
            return {
              get: function () {
                if (!e()) return (this.get = t).apply(this, arguments);
                delete this.get;
              },
            };
          }
          !(function () {
            function e() {
              if (u) {
                (l.style.cssText =
                  'position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0'),
                  (u.style.cssText =
                    'position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%'),
                  me.appendChild(l).appendChild(u);
                var e = r.getComputedStyle(u);
                (n = '1%' !== e.top),
                  (c = 12 === t(e.marginLeft)),
                  (u.style.right = '60%'),
                  (a = 36 === t(e.right)),
                  (i = 36 === t(e.width)),
                  (u.style.position = 'absolute'),
                  (o = 12 === t(u.offsetWidth / 3)),
                  me.removeChild(l),
                  (u = null);
              }
            }
            function t(e) {
              return Math.round(parseFloat(e));
            }
            var n,
              i,
              o,
              a,
              s,
              c,
              l = b.createElement('div'),
              u = b.createElement('div');
            u.style &&
              ((u.style.backgroundClip = 'content-box'),
              (u.cloneNode(!0).style.backgroundClip = ''),
              (g.clearCloneStyle = 'content-box' === u.style.backgroundClip),
              E.extend(g, {
                boxSizingReliable: function () {
                  return e(), i;
                },
                pixelBoxStyles: function () {
                  return e(), a;
                },
                pixelPosition: function () {
                  return e(), n;
                },
                reliableMarginLeft: function () {
                  return e(), c;
                },
                scrollboxSize: function () {
                  return e(), o;
                },
                reliableTrDimensions: function () {
                  var e, t, n, i;
                  return (
                    null == s &&
                      ((e = b.createElement('table')),
                      (t = b.createElement('tr')),
                      (n = b.createElement('div')),
                      (e.style.cssText =
                        'position:absolute;left:-11111px;border-collapse:separate'),
                      (t.style.cssText = 'box-sizing:content-box;border:1px solid'),
                      (t.style.height = '1px'),
                      (n.style.height = '9px'),
                      (n.style.display = 'block'),
                      me.appendChild(e).appendChild(t).appendChild(n),
                      (i = r.getComputedStyle(t)),
                      (s =
                        parseInt(i.height, 10) +
                          parseInt(i.borderTopWidth, 10) +
                          parseInt(i.borderBottomWidth, 10) ===
                        t.offsetHeight),
                      me.removeChild(e)),
                    s
                  );
                },
              }));
          })();
          var tt = ['Webkit', 'Moz', 'ms'],
            nt = b.createElement('div').style,
            rt = {};
          function it(e) {
            return (
              E.cssProps[e] ||
              rt[e] ||
              (e in nt
                ? e
                : (rt[e] =
                    (function (e) {
                      for (var t = e[0].toUpperCase() + e.slice(1), n = tt.length; n--; )
                        if ((e = tt[n] + t) in nt) return e;
                    })(e) || e))
            );
          }
          var ot = /^(none|table(?!-c[ea]).+)/,
            at = { position: 'absolute', visibility: 'hidden', display: 'block' },
            st = { letterSpacing: '0', fontWeight: '400' };
          function ct(e, t, n) {
            var r = pe.exec(t);
            return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || 'px') : t;
          }
          function lt(e, t, n, r, i, o) {
            var a = 'width' === t ? 1 : 0,
              s = 0,
              c = 0,
              l = 0;
            if (n === (r ? 'border' : 'content')) return 0;
            for (; a < 4; a += 2)
              'margin' === n && (l += E.css(e, n + he[a], !0, i)),
                r
                  ? ('content' === n && (c -= E.css(e, 'padding' + he[a], !0, i)),
                    'margin' !== n && (c -= E.css(e, 'border' + he[a] + 'Width', !0, i)))
                  : ((c += E.css(e, 'padding' + he[a], !0, i)),
                    'padding' !== n
                      ? (c += E.css(e, 'border' + he[a] + 'Width', !0, i))
                      : (s += E.css(e, 'border' + he[a] + 'Width', !0, i)));
            return (
              !r &&
                o >= 0 &&
                (c +=
                  Math.max(
                    0,
                    Math.ceil(e['offset' + t[0].toUpperCase() + t.slice(1)] - o - c - s - 0.5)
                  ) || 0),
              c + l
            );
          }
          function ut(e, t, n) {
            var r = Je(e),
              i = (!g.boxSizingReliable() || n) && 'border-box' === E.css(e, 'boxSizing', !1, r),
              o = i,
              a = Ke(e, t, r),
              s = 'offset' + t[0].toUpperCase() + t.slice(1);
            if (Qe.test(a)) {
              if (!n) return a;
              a = 'auto';
            }
            return (
              ((!g.boxSizingReliable() && i) ||
                (!g.reliableTrDimensions() && L(e, 'tr')) ||
                'auto' === a ||
                (!parseFloat(a) && 'inline' === E.css(e, 'display', !1, r))) &&
                e.getClientRects().length &&
                ((i = 'border-box' === E.css(e, 'boxSizing', !1, r)), (o = s in e) && (a = e[s])),
              (a = parseFloat(a) || 0) + lt(e, t, n || (i ? 'border' : 'content'), o, r, a) + 'px'
            );
          }
          function ft(e, t, n, r, i) {
            return new ft.prototype.init(e, t, n, r, i);
          }
          E.extend({
            cssHooks: {
              opacity: {
                get: function (e, t) {
                  if (t) {
                    var n = Ke(e, 'opacity');
                    return '' === n ? '1' : n;
                  }
                },
              },
            },
            cssNumber: {
              animationIterationCount: !0,
              aspectRatio: !0,
              borderImageSlice: !0,
              columnCount: !0,
              flexGrow: !0,
              flexShrink: !0,
              fontWeight: !0,
              gridArea: !0,
              gridColumn: !0,
              gridColumnEnd: !0,
              gridColumnStart: !0,
              gridRow: !0,
              gridRowEnd: !0,
              gridRowStart: !0,
              lineHeight: !0,
              opacity: !0,
              order: !0,
              orphans: !0,
              scale: !0,
              widows: !0,
              zIndex: !0,
              zoom: !0,
              fillOpacity: !0,
              floodOpacity: !0,
              stopOpacity: !0,
              strokeMiterlimit: !0,
              strokeOpacity: !0,
            },
            cssProps: {},
            style: function (e, t, n, r) {
              if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i,
                  o,
                  a,
                  s = ie(t),
                  c = Xe.test(t),
                  l = e.style;
                if ((c || (t = it(s)), (a = E.cssHooks[t] || E.cssHooks[s]), void 0 === n))
                  return a && 'get' in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                'string' == (o = typeof n) &&
                  (i = pe.exec(n)) &&
                  i[1] &&
                  ((n = be(e, t, i)), (o = 'number')),
                  null != n &&
                    n == n &&
                    ('number' !== o || c || (n += (i && i[3]) || (E.cssNumber[s] ? '' : 'px')),
                    g.clearCloneStyle ||
                      '' !== n ||
                      0 !== t.indexOf('background') ||
                      (l[t] = 'inherit'),
                    (a && 'set' in a && void 0 === (n = a.set(e, n, r))) ||
                      (c ? l.setProperty(t, n) : (l[t] = n)));
              }
            },
            css: function (e, t, n, r) {
              var i,
                o,
                a,
                s = ie(t);
              return (
                Xe.test(t) || (t = it(s)),
                (a = E.cssHooks[t] || E.cssHooks[s]) && 'get' in a && (i = a.get(e, !0, n)),
                void 0 === i && (i = Ke(e, t, r)),
                'normal' === i && t in st && (i = st[t]),
                '' === n || n ? ((o = parseFloat(i)), !0 === n || isFinite(o) ? o || 0 : i) : i
              );
            },
          }),
            E.each(['height', 'width'], function (e, t) {
              E.cssHooks[t] = {
                get: function (e, n, r) {
                  if (n)
                    return !ot.test(E.css(e, 'display')) ||
                      (e.getClientRects().length && e.getBoundingClientRect().width)
                      ? ut(e, t, r)
                      : Ze(e, at, function () {
                          return ut(e, t, r);
                        });
                },
                set: function (e, n, r) {
                  var i,
                    o = Je(e),
                    a = !g.scrollboxSize() && 'absolute' === o.position,
                    s = (a || r) && 'border-box' === E.css(e, 'boxSizing', !1, o),
                    c = r ? lt(e, t, r, s, o) : 0;
                  return (
                    s &&
                      a &&
                      (c -= Math.ceil(
                        e['offset' + t[0].toUpperCase() + t.slice(1)] -
                          parseFloat(o[t]) -
                          lt(e, t, 'border', !1, o) -
                          0.5
                      )),
                    c &&
                      (i = pe.exec(n)) &&
                      'px' !== (i[3] || 'px') &&
                      ((e.style[t] = n), (n = E.css(e, t))),
                    ct(0, n, c)
                  );
                },
              };
            }),
            (E.cssHooks.marginLeft = et(g.reliableMarginLeft, function (e, t) {
              if (t)
                return (
                  (parseFloat(Ke(e, 'marginLeft')) ||
                    e.getBoundingClientRect().left -
                      Ze(e, { marginLeft: 0 }, function () {
                        return e.getBoundingClientRect().left;
                      })) + 'px'
                );
            })),
            E.each({ margin: '', padding: '', border: 'Width' }, function (e, t) {
              (E.cssHooks[e + t] = {
                expand: function (n) {
                  for (var r = 0, i = {}, o = 'string' == typeof n ? n.split(' ') : [n]; r < 4; r++)
                    i[e + he[r] + t] = o[r] || o[r - 2] || o[0];
                  return i;
                },
              }),
                'margin' !== e && (E.cssHooks[e + t].set = ct);
            }),
            E.fn.extend({
              css: function (e, t) {
                return ee(
                  this,
                  function (e, t, n) {
                    var r,
                      i,
                      o = {},
                      a = 0;
                    if (Array.isArray(t)) {
                      for (r = Je(e), i = t.length; a < i; a++) o[t[a]] = E.css(e, t[a], !1, r);
                      return o;
                    }
                    return void 0 !== n ? E.style(e, t, n) : E.css(e, t);
                  },
                  e,
                  t,
                  arguments.length > 1
                );
              },
            }),
            (E.Tween = ft),
            (ft.prototype = {
              constructor: ft,
              init: function (e, t, n, r, i, o) {
                (this.elem = e),
                  (this.prop = n),
                  (this.easing = i || E.easing._default),
                  (this.options = t),
                  (this.start = this.now = this.cur()),
                  (this.end = r),
                  (this.unit = o || (E.cssNumber[n] ? '' : 'px'));
              },
              cur: function () {
                var e = ft.propHooks[this.prop];
                return e && e.get ? e.get(this) : ft.propHooks._default.get(this);
              },
              run: function (e) {
                var t,
                  n = ft.propHooks[this.prop];
                return (
                  this.options.duration
                    ? (this.pos = t =
                        E.easing[this.easing](
                          e,
                          this.options.duration * e,
                          0,
                          1,
                          this.options.duration
                        ))
                    : (this.pos = t = e),
                  (this.now = (this.end - this.start) * t + this.start),
                  this.options.step && this.options.step.call(this.elem, this.now, this),
                  n && n.set ? n.set(this) : ft.propHooks._default.set(this),
                  this
                );
              },
            }),
            (ft.prototype.init.prototype = ft.prototype),
            (ft.propHooks = {
              _default: {
                get: function (e) {
                  var t;
                  return 1 !== e.elem.nodeType ||
                    (null != e.elem[e.prop] && null == e.elem.style[e.prop])
                    ? e.elem[e.prop]
                    : (t = E.css(e.elem, e.prop, '')) && 'auto' !== t
                    ? t
                    : 0;
                },
                set: function (e) {
                  E.fx.step[e.prop]
                    ? E.fx.step[e.prop](e)
                    : 1 !== e.elem.nodeType ||
                      (!E.cssHooks[e.prop] && null == e.elem.style[it(e.prop)])
                    ? (e.elem[e.prop] = e.now)
                    : E.style(e.elem, e.prop, e.now + e.unit);
                },
              },
            }),
            (ft.propHooks.scrollTop = ft.propHooks.scrollLeft =
              {
                set: function (e) {
                  e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
                },
              }),
            (E.easing = {
              linear: function (e) {
                return e;
              },
              swing: function (e) {
                return 0.5 - Math.cos(e * Math.PI) / 2;
              },
              _default: 'swing',
            }),
            (E.fx = ft.prototype.init),
            (E.fx.step = {});
          var dt,
            pt,
            ht = /^(?:toggle|show|hide)$/,
            mt = /queueHooks$/;
          function gt() {
            pt &&
              (!1 === b.hidden && r.requestAnimationFrame
                ? r.requestAnimationFrame(gt)
                : r.setTimeout(gt, E.fx.interval),
              E.fx.tick());
          }
          function yt() {
            return (
              r.setTimeout(function () {
                dt = void 0;
              }),
              (dt = Date.now())
            );
          }
          function vt(e, t) {
            var n,
              r = 0,
              i = { height: e };
            for (t = t ? 1 : 0; r < 4; r += 2 - t) i['margin' + (n = he[r])] = i['padding' + n] = e;
            return t && (i.opacity = i.width = e), i;
          }
          function bt(e, t, n) {
            for (
              var r, i = (xt.tweeners[t] || []).concat(xt.tweeners['*']), o = 0, a = i.length;
              o < a;
              o++
            )
              if ((r = i[o].call(n, t, e))) return r;
          }
          function xt(e, t, n) {
            var r,
              i,
              o = 0,
              a = xt.prefilters.length,
              s = E.Deferred().always(function () {
                delete c.elem;
              }),
              c = function () {
                if (i) return !1;
                for (
                  var t = dt || yt(),
                    n = Math.max(0, l.startTime + l.duration - t),
                    r = 1 - (n / l.duration || 0),
                    o = 0,
                    a = l.tweens.length;
                  o < a;
                  o++
                )
                  l.tweens[o].run(r);
                return (
                  s.notifyWith(e, [l, r, n]),
                  r < 1 && a ? n : (a || s.notifyWith(e, [l, 1, 0]), s.resolveWith(e, [l]), !1)
                );
              },
              l = s.promise({
                elem: e,
                props: E.extend({}, t),
                opts: E.extend(!0, { specialEasing: {}, easing: E.easing._default }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: dt || yt(),
                duration: n.duration,
                tweens: [],
                createTween: function (t, n) {
                  var r = E.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                  return l.tweens.push(r), r;
                },
                stop: function (t) {
                  var n = 0,
                    r = t ? l.tweens.length : 0;
                  if (i) return this;
                  for (i = !0; n < r; n++) l.tweens[n].run(1);
                  return (
                    t
                      ? (s.notifyWith(e, [l, 1, 0]), s.resolveWith(e, [l, t]))
                      : s.rejectWith(e, [l, t]),
                    this
                  );
                },
              }),
              u = l.props;
            for (
              (function (e, t) {
                var n, r, i, o, a;
                for (n in e)
                  if (
                    ((i = t[(r = ie(n))]),
                    (o = e[n]),
                    Array.isArray(o) && ((i = o[1]), (o = e[n] = o[0])),
                    n !== r && ((e[r] = o), delete e[n]),
                    (a = E.cssHooks[r]) && ('expand' in a))
                  )
                    for (n in ((o = a.expand(o)), delete e[r], o))
                      (n in e) || ((e[n] = o[n]), (t[n] = i));
                  else t[r] = i;
              })(u, l.opts.specialEasing);
              o < a;
              o++
            )
              if ((r = xt.prefilters[o].call(l, e, u, l.opts)))
                return y(r.stop) && (E._queueHooks(l.elem, l.opts.queue).stop = r.stop.bind(r)), r;
            return (
              E.map(u, bt, l),
              y(l.opts.start) && l.opts.start.call(e, l),
              l
                .progress(l.opts.progress)
                .done(l.opts.done, l.opts.complete)
                .fail(l.opts.fail)
                .always(l.opts.always),
              E.fx.timer(E.extend(c, { elem: e, anim: l, queue: l.opts.queue })),
              l
            );
          }
          (E.Animation = E.extend(xt, {
            tweeners: {
              '*': [
                function (e, t) {
                  var n = this.createTween(e, t);
                  return be(n.elem, e, pe.exec(t), n), n;
                },
              ],
            },
            tweener: function (e, t) {
              y(e) ? ((t = e), (e = ['*'])) : (e = e.match(z));
              for (var n, r = 0, i = e.length; r < i; r++)
                (n = e[r]), (xt.tweeners[n] = xt.tweeners[n] || []), xt.tweeners[n].unshift(t);
            },
            prefilters: [
              function (e, t, n) {
                var r,
                  i,
                  o,
                  a,
                  s,
                  c,
                  l,
                  u,
                  f = 'width' in t || 'height' in t,
                  d = this,
                  p = {},
                  h = e.style,
                  m = e.nodeType && ve(e),
                  g = se.get(e, 'fxshow');
                for (r in (n.queue ||
                  (null == (a = E._queueHooks(e, 'fx')).unqueued &&
                    ((a.unqueued = 0),
                    (s = a.empty.fire),
                    (a.empty.fire = function () {
                      a.unqueued || s();
                    })),
                  a.unqueued++,
                  d.always(function () {
                    d.always(function () {
                      a.unqueued--, E.queue(e, 'fx').length || a.empty.fire();
                    });
                  })),
                t))
                  if (((i = t[r]), ht.test(i))) {
                    if ((delete t[r], (o = o || 'toggle' === i), i === (m ? 'hide' : 'show'))) {
                      if ('show' !== i || !g || void 0 === g[r]) continue;
                      m = !0;
                    }
                    p[r] = (g && g[r]) || E.style(e, r);
                  }
                if ((c = !E.isEmptyObject(t)) || !E.isEmptyObject(p))
                  for (r in (f &&
                    1 === e.nodeType &&
                    ((n.overflow = [h.overflow, h.overflowX, h.overflowY]),
                    null == (l = g && g.display) && (l = se.get(e, 'display')),
                    'none' === (u = E.css(e, 'display')) &&
                      (l
                        ? (u = l)
                        : (Te([e], !0),
                          (l = e.style.display || l),
                          (u = E.css(e, 'display')),
                          Te([e]))),
                    ('inline' === u || ('inline-block' === u && null != l)) &&
                      'none' === E.css(e, 'float') &&
                      (c ||
                        (d.done(function () {
                          h.display = l;
                        }),
                        null == l && ((u = h.display), (l = 'none' === u ? '' : u))),
                      (h.display = 'inline-block'))),
                  n.overflow &&
                    ((h.overflow = 'hidden'),
                    d.always(function () {
                      (h.overflow = n.overflow[0]),
                        (h.overflowX = n.overflow[1]),
                        (h.overflowY = n.overflow[2]);
                    })),
                  (c = !1),
                  p))
                    c ||
                      (g
                        ? 'hidden' in g && (m = g.hidden)
                        : (g = se.access(e, 'fxshow', { display: l })),
                      o && (g.hidden = !m),
                      m && Te([e], !0),
                      d.done(function () {
                        for (r in (m || Te([e]), se.remove(e, 'fxshow'), p)) E.style(e, r, p[r]);
                      })),
                      (c = bt(m ? g[r] : 0, r, d)),
                      r in g || ((g[r] = c.start), m && ((c.end = c.start), (c.start = 0)));
              },
            ],
            prefilter: function (e, t) {
              t ? xt.prefilters.unshift(e) : xt.prefilters.push(e);
            },
          })),
            (E.speed = function (e, t, n) {
              var r =
                e && 'object' == typeof e
                  ? E.extend({}, e)
                  : {
                      complete: n || (!n && t) || (y(e) && e),
                      duration: e,
                      easing: (n && t) || (t && !y(t) && t),
                    };
              return (
                E.fx.off
                  ? (r.duration = 0)
                  : 'number' != typeof r.duration &&
                    (r.duration in E.fx.speeds
                      ? (r.duration = E.fx.speeds[r.duration])
                      : (r.duration = E.fx.speeds._default)),
                (null != r.queue && !0 !== r.queue) || (r.queue = 'fx'),
                (r.old = r.complete),
                (r.complete = function () {
                  y(r.old) && r.old.call(this), r.queue && E.dequeue(this, r.queue);
                }),
                r
              );
            }),
            E.fn.extend({
              fadeTo: function (e, t, n, r) {
                return this.filter(ve)
                  .css('opacity', 0)
                  .show()
                  .end()
                  .animate({ opacity: t }, e, n, r);
              },
              animate: function (e, t, n, r) {
                var i = E.isEmptyObject(e),
                  o = E.speed(t, n, r),
                  a = function () {
                    var t = xt(this, E.extend({}, e), o);
                    (i || se.get(this, 'finish')) && t.stop(!0);
                  };
                return (a.finish = a), i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a);
              },
              stop: function (e, t, n) {
                var r = function (e) {
                  var t = e.stop;
                  delete e.stop, t(n);
                };
                return (
                  'string' != typeof e && ((n = t), (t = e), (e = void 0)),
                  t && this.queue(e || 'fx', []),
                  this.each(function () {
                    var t = !0,
                      i = null != e && e + 'queueHooks',
                      o = E.timers,
                      a = se.get(this);
                    if (i) a[i] && a[i].stop && r(a[i]);
                    else for (i in a) a[i] && a[i].stop && mt.test(i) && r(a[i]);
                    for (i = o.length; i--; )
                      o[i].elem !== this ||
                        (null != e && o[i].queue !== e) ||
                        (o[i].anim.stop(n), (t = !1), o.splice(i, 1));
                    (!t && n) || E.dequeue(this, e);
                  })
                );
              },
              finish: function (e) {
                return (
                  !1 !== e && (e = e || 'fx'),
                  this.each(function () {
                    var t,
                      n = se.get(this),
                      r = n[e + 'queue'],
                      i = n[e + 'queueHooks'],
                      o = E.timers,
                      a = r ? r.length : 0;
                    for (
                      n.finish = !0,
                        E.queue(this, e, []),
                        i && i.stop && i.stop.call(this, !0),
                        t = o.length;
                      t--;

                    )
                      o[t].elem === this &&
                        o[t].queue === e &&
                        (o[t].anim.stop(!0), o.splice(t, 1));
                    for (t = 0; t < a; t++) r[t] && r[t].finish && r[t].finish.call(this);
                    delete n.finish;
                  })
                );
              },
            }),
            E.each(['toggle', 'show', 'hide'], function (e, t) {
              var n = E.fn[t];
              E.fn[t] = function (e, r, i) {
                return null == e || 'boolean' == typeof e
                  ? n.apply(this, arguments)
                  : this.animate(vt(t, !0), e, r, i);
              };
            }),
            E.each(
              {
                slideDown: vt('show'),
                slideUp: vt('hide'),
                slideToggle: vt('toggle'),
                fadeIn: { opacity: 'show' },
                fadeOut: { opacity: 'hide' },
                fadeToggle: { opacity: 'toggle' },
              },
              function (e, t) {
                E.fn[e] = function (e, n, r) {
                  return this.animate(t, e, n, r);
                };
              }
            ),
            (E.timers = []),
            (E.fx.tick = function () {
              var e,
                t = 0,
                n = E.timers;
              for (dt = Date.now(); t < n.length; t++)
                (e = n[t])() || n[t] !== e || n.splice(t--, 1);
              n.length || E.fx.stop(), (dt = void 0);
            }),
            (E.fx.timer = function (e) {
              E.timers.push(e), E.fx.start();
            }),
            (E.fx.interval = 13),
            (E.fx.start = function () {
              pt || ((pt = !0), gt());
            }),
            (E.fx.stop = function () {
              pt = null;
            }),
            (E.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
            (E.fn.delay = function (e, t) {
              return (
                (e = (E.fx && E.fx.speeds[e]) || e),
                (t = t || 'fx'),
                this.queue(t, function (t, n) {
                  var i = r.setTimeout(t, e);
                  n.stop = function () {
                    r.clearTimeout(i);
                  };
                })
              );
            }),
            (function () {
              var e = b.createElement('input'),
                t = b.createElement('select').appendChild(b.createElement('option'));
              (e.type = 'checkbox'),
                (g.checkOn = '' !== e.value),
                (g.optSelected = t.selected),
                ((e = b.createElement('input')).value = 't'),
                (e.type = 'radio'),
                (g.radioValue = 't' === e.value);
            })();
          var wt,
            Tt = E.expr.attrHandle;
          E.fn.extend({
            attr: function (e, t) {
              return ee(this, E.attr, e, t, arguments.length > 1);
            },
            removeAttr: function (e) {
              return this.each(function () {
                E.removeAttr(this, e);
              });
            },
          }),
            E.extend({
              attr: function (e, t, n) {
                var r,
                  i,
                  o = e.nodeType;
                if (3 !== o && 8 !== o && 2 !== o)
                  return void 0 === e.getAttribute
                    ? E.prop(e, t, n)
                    : ((1 === o && E.isXMLDoc(e)) ||
                        (i =
                          E.attrHooks[t.toLowerCase()] ||
                          (E.expr.match.bool.test(t) ? wt : void 0)),
                      void 0 !== n
                        ? null === n
                          ? void E.removeAttr(e, t)
                          : i && 'set' in i && void 0 !== (r = i.set(e, n, t))
                          ? r
                          : (e.setAttribute(t, n + ''), n)
                        : i && 'get' in i && null !== (r = i.get(e, t))
                        ? r
                        : null == (r = E.find.attr(e, t))
                        ? void 0
                        : r);
              },
              attrHooks: {
                type: {
                  set: function (e, t) {
                    if (!g.radioValue && 'radio' === t && L(e, 'input')) {
                      var n = e.value;
                      return e.setAttribute('type', t), n && (e.value = n), t;
                    }
                  },
                },
              },
              removeAttr: function (e, t) {
                var n,
                  r = 0,
                  i = t && t.match(z);
                if (i && 1 === e.nodeType) for (; (n = i[r++]); ) e.removeAttribute(n);
              },
            }),
            (wt = {
              set: function (e, t, n) {
                return !1 === t ? E.removeAttr(e, n) : e.setAttribute(n, n), n;
              },
            }),
            E.each(E.expr.match.bool.source.match(/\w+/g), function (e, t) {
              var n = Tt[t] || E.find.attr;
              Tt[t] = function (e, t, r) {
                var i,
                  o,
                  a = t.toLowerCase();
                return (
                  r || ((o = Tt[a]), (Tt[a] = i), (i = null != n(e, t, r) ? a : null), (Tt[a] = o)),
                  i
                );
              };
            });
          var kt = /^(?:input|select|textarea|button)$/i,
            _t = /^(?:a|area)$/i;
          function Et(e) {
            return (e.match(z) || []).join(' ');
          }
          function St(e) {
            return (e.getAttribute && e.getAttribute('class')) || '';
          }
          function Lt(e) {
            return Array.isArray(e) ? e : ('string' == typeof e && e.match(z)) || [];
          }
          E.fn.extend({
            prop: function (e, t) {
              return ee(this, E.prop, e, t, arguments.length > 1);
            },
            removeProp: function (e) {
              return this.each(function () {
                delete this[E.propFix[e] || e];
              });
            },
          }),
            E.extend({
              prop: function (e, t, n) {
                var r,
                  i,
                  o = e.nodeType;
                if (3 !== o && 8 !== o && 2 !== o)
                  return (
                    (1 === o && E.isXMLDoc(e)) || ((t = E.propFix[t] || t), (i = E.propHooks[t])),
                    void 0 !== n
                      ? i && 'set' in i && void 0 !== (r = i.set(e, n, t))
                        ? r
                        : (e[t] = n)
                      : i && 'get' in i && null !== (r = i.get(e, t))
                      ? r
                      : e[t]
                  );
              },
              propHooks: {
                tabIndex: {
                  get: function (e) {
                    var t = E.find.attr(e, 'tabindex');
                    return t
                      ? parseInt(t, 10)
                      : kt.test(e.nodeName) || (_t.test(e.nodeName) && e.href)
                      ? 0
                      : -1;
                  },
                },
              },
              propFix: { for: 'htmlFor', class: 'className' },
            }),
            g.optSelected ||
              (E.propHooks.selected = {
                get: function (e) {
                  var t = e.parentNode;
                  return t && t.parentNode && t.parentNode.selectedIndex, null;
                },
                set: function (e) {
                  var t = e.parentNode;
                  t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
                },
              }),
            E.each(
              [
                'tabIndex',
                'readOnly',
                'maxLength',
                'cellSpacing',
                'cellPadding',
                'rowSpan',
                'colSpan',
                'useMap',
                'frameBorder',
                'contentEditable',
              ],
              function () {
                E.propFix[this.toLowerCase()] = this;
              }
            ),
            E.fn.extend({
              addClass: function (e) {
                var t, n, r, i, o, a;
                return y(e)
                  ? this.each(function (t) {
                      E(this).addClass(e.call(this, t, St(this)));
                    })
                  : (t = Lt(e)).length
                  ? this.each(function () {
                      if (((r = St(this)), (n = 1 === this.nodeType && ' ' + Et(r) + ' '))) {
                        for (o = 0; o < t.length; o++)
                          (i = t[o]), n.indexOf(' ' + i + ' ') < 0 && (n += i + ' ');
                        (a = Et(n)), r !== a && this.setAttribute('class', a);
                      }
                    })
                  : this;
              },
              removeClass: function (e) {
                var t, n, r, i, o, a;
                return y(e)
                  ? this.each(function (t) {
                      E(this).removeClass(e.call(this, t, St(this)));
                    })
                  : arguments.length
                  ? (t = Lt(e)).length
                    ? this.each(function () {
                        if (((r = St(this)), (n = 1 === this.nodeType && ' ' + Et(r) + ' '))) {
                          for (o = 0; o < t.length; o++)
                            for (i = t[o]; n.indexOf(' ' + i + ' ') > -1; )
                              n = n.replace(' ' + i + ' ', ' ');
                          (a = Et(n)), r !== a && this.setAttribute('class', a);
                        }
                      })
                    : this
                  : this.attr('class', '');
              },
              toggleClass: function (e, t) {
                var n,
                  r,
                  i,
                  o,
                  a = typeof e,
                  s = 'string' === a || Array.isArray(e);
                return y(e)
                  ? this.each(function (n) {
                      E(this).toggleClass(e.call(this, n, St(this), t), t);
                    })
                  : 'boolean' == typeof t && s
                  ? t
                    ? this.addClass(e)
                    : this.removeClass(e)
                  : ((n = Lt(e)),
                    this.each(function () {
                      if (s)
                        for (o = E(this), i = 0; i < n.length; i++)
                          (r = n[i]), o.hasClass(r) ? o.removeClass(r) : o.addClass(r);
                      else
                        (void 0 !== e && 'boolean' !== a) ||
                          ((r = St(this)) && se.set(this, '__className__', r),
                          this.setAttribute &&
                            this.setAttribute(
                              'class',
                              r || !1 === e ? '' : se.get(this, '__className__') || ''
                            ));
                    }));
              },
              hasClass: function (e) {
                var t,
                  n,
                  r = 0;
                for (t = ' ' + e + ' '; (n = this[r++]); )
                  if (1 === n.nodeType && (' ' + Et(St(n)) + ' ').indexOf(t) > -1) return !0;
                return !1;
              },
            });
          var At = /\r/g;
          E.fn.extend({
            val: function (e) {
              var t,
                n,
                r,
                i = this[0];
              return arguments.length
                ? ((r = y(e)),
                  this.each(function (n) {
                    var i;
                    1 === this.nodeType &&
                      (null == (i = r ? e.call(this, n, E(this).val()) : e)
                        ? (i = '')
                        : 'number' == typeof i
                        ? (i += '')
                        : Array.isArray(i) &&
                          (i = E.map(i, function (e) {
                            return null == e ? '' : e + '';
                          })),
                      ((t = E.valHooks[this.type] || E.valHooks[this.nodeName.toLowerCase()]) &&
                        'set' in t &&
                        void 0 !== t.set(this, i, 'value')) ||
                        (this.value = i));
                  }))
                : i
                ? (t = E.valHooks[i.type] || E.valHooks[i.nodeName.toLowerCase()]) &&
                  'get' in t &&
                  void 0 !== (n = t.get(i, 'value'))
                  ? n
                  : 'string' == typeof (n = i.value)
                  ? n.replace(At, '')
                  : null == n
                  ? ''
                  : n
                : void 0;
            },
          }),
            E.extend({
              valHooks: {
                option: {
                  get: function (e) {
                    var t = E.find.attr(e, 'value');
                    return null != t ? t : Et(E.text(e));
                  },
                },
                select: {
                  get: function (e) {
                    var t,
                      n,
                      r,
                      i = e.options,
                      o = e.selectedIndex,
                      a = 'select-one' === e.type,
                      s = a ? null : [],
                      c = a ? o + 1 : i.length;
                    for (r = o < 0 ? c : a ? o : 0; r < c; r++)
                      if (
                        ((n = i[r]).selected || r === o) &&
                        !n.disabled &&
                        (!n.parentNode.disabled || !L(n.parentNode, 'optgroup'))
                      ) {
                        if (((t = E(n).val()), a)) return t;
                        s.push(t);
                      }
                    return s;
                  },
                  set: function (e, t) {
                    for (var n, r, i = e.options, o = E.makeArray(t), a = i.length; a--; )
                      ((r = i[a]).selected = E.inArray(E.valHooks.option.get(r), o) > -1) &&
                        (n = !0);
                    return n || (e.selectedIndex = -1), o;
                  },
                },
              },
            }),
            E.each(['radio', 'checkbox'], function () {
              (E.valHooks[this] = {
                set: function (e, t) {
                  if (Array.isArray(t)) return (e.checked = E.inArray(E(e).val(), t) > -1);
                },
              }),
                g.checkOn ||
                  (E.valHooks[this].get = function (e) {
                    return null === e.getAttribute('value') ? 'on' : e.value;
                  });
            });
          var Ct = r.location,
            Nt = { guid: Date.now() },
            It = /\?/;
          E.parseXML = function (e) {
            var t, n;
            if (!e || 'string' != typeof e) return null;
            try {
              t = new r.DOMParser().parseFromString(e, 'text/xml');
            } catch (e) {}
            return (
              (n = t && t.getElementsByTagName('parsererror')[0]),
              (t && !n) ||
                E.error(
                  'Invalid XML: ' +
                    (n
                      ? E.map(n.childNodes, function (e) {
                          return e.textContent;
                        }).join('\n')
                      : e)
                ),
              t
            );
          };
          var Dt = /^(?:focusinfocus|focusoutblur)$/,
            Ot = function (e) {
              e.stopPropagation();
            };
          E.extend(E.event, {
            trigger: function (e, t, n, i) {
              var o,
                a,
                s,
                c,
                l,
                u,
                f,
                d,
                h = [n || b],
                m = p.call(e, 'type') ? e.type : e,
                g = p.call(e, 'namespace') ? e.namespace.split('.') : [];
              if (
                ((a = d = s = n = n || b),
                3 !== n.nodeType &&
                  8 !== n.nodeType &&
                  !Dt.test(m + E.event.triggered) &&
                  (m.indexOf('.') > -1 && ((g = m.split('.')), (m = g.shift()), g.sort()),
                  (l = m.indexOf(':') < 0 && 'on' + m),
                  ((e = e[E.expando] ? e : new E.Event(m, 'object' == typeof e && e)).isTrigger = i
                    ? 2
                    : 3),
                  (e.namespace = g.join('.')),
                  (e.rnamespace = e.namespace
                    ? new RegExp('(^|\\.)' + g.join('\\.(?:.*\\.|)') + '(\\.|$)')
                    : null),
                  (e.result = void 0),
                  e.target || (e.target = n),
                  (t = null == t ? [e] : E.makeArray(t, [e])),
                  (f = E.event.special[m] || {}),
                  i || !f.trigger || !1 !== f.trigger.apply(n, t)))
              ) {
                if (!i && !f.noBubble && !v(n)) {
                  for (
                    c = f.delegateType || m, Dt.test(c + m) || (a = a.parentNode);
                    a;
                    a = a.parentNode
                  )
                    h.push(a), (s = a);
                  s === (n.ownerDocument || b) && h.push(s.defaultView || s.parentWindow || r);
                }
                for (o = 0; (a = h[o++]) && !e.isPropagationStopped(); )
                  (d = a),
                    (e.type = o > 1 ? c : f.bindType || m),
                    (u =
                      (se.get(a, 'events') || Object.create(null))[e.type] &&
                      se.get(a, 'handle')) && u.apply(a, t),
                    (u = l && a[l]) &&
                      u.apply &&
                      oe(a) &&
                      ((e.result = u.apply(a, t)), !1 === e.result && e.preventDefault());
                return (
                  (e.type = m),
                  i ||
                    e.isDefaultPrevented() ||
                    (f._default && !1 !== f._default.apply(h.pop(), t)) ||
                    !oe(n) ||
                    (l &&
                      y(n[m]) &&
                      !v(n) &&
                      ((s = n[l]) && (n[l] = null),
                      (E.event.triggered = m),
                      e.isPropagationStopped() && d.addEventListener(m, Ot),
                      n[m](),
                      e.isPropagationStopped() && d.removeEventListener(m, Ot),
                      (E.event.triggered = void 0),
                      s && (n[l] = s))),
                  e.result
                );
              }
            },
            simulate: function (e, t, n) {
              var r = E.extend(new E.Event(), n, { type: e, isSimulated: !0 });
              E.event.trigger(r, null, t);
            },
          }),
            E.fn.extend({
              trigger: function (e, t) {
                return this.each(function () {
                  E.event.trigger(e, t, this);
                });
              },
              triggerHandler: function (e, t) {
                var n = this[0];
                if (n) return E.event.trigger(e, t, n, !0);
              },
            });
          var qt = /\[\]$/,
            Bt = /\r?\n/g,
            jt = /^(?:submit|button|image|reset|file)$/i,
            Pt = /^(?:input|select|textarea|keygen)/i;
          function Mt(e, t, n, r) {
            var i;
            if (Array.isArray(t))
              E.each(t, function (t, i) {
                n || qt.test(e)
                  ? r(e, i)
                  : Mt(e + '[' + ('object' == typeof i && null != i ? t : '') + ']', i, n, r);
              });
            else if (n || 'object' !== T(t)) r(e, t);
            else for (i in t) Mt(e + '[' + i + ']', t[i], n, r);
          }
          (E.param = function (e, t) {
            var n,
              r = [],
              i = function (e, t) {
                var n = y(t) ? t() : t;
                r[r.length] = encodeURIComponent(e) + '=' + encodeURIComponent(null == n ? '' : n);
              };
            if (null == e) return '';
            if (Array.isArray(e) || (e.jquery && !E.isPlainObject(e)))
              E.each(e, function () {
                i(this.name, this.value);
              });
            else for (n in e) Mt(n, e[n], t, i);
            return r.join('&');
          }),
            E.fn.extend({
              serialize: function () {
                return E.param(this.serializeArray());
              },
              serializeArray: function () {
                return this.map(function () {
                  var e = E.prop(this, 'elements');
                  return e ? E.makeArray(e) : this;
                })
                  .filter(function () {
                    var e = this.type;
                    return (
                      this.name &&
                      !E(this).is(':disabled') &&
                      Pt.test(this.nodeName) &&
                      !jt.test(e) &&
                      (this.checked || !Ee.test(e))
                    );
                  })
                  .map(function (e, t) {
                    var n = E(this).val();
                    return null == n
                      ? null
                      : Array.isArray(n)
                      ? E.map(n, function (e) {
                          return { name: t.name, value: e.replace(Bt, '\r\n') };
                        })
                      : { name: t.name, value: n.replace(Bt, '\r\n') };
                  })
                  .get();
              },
            });
          var Rt = /%20/g,
            Ht = /#.*$/,
            Wt = /([?&])_=[^&]*/,
            Ut = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            $t = /^(?:GET|HEAD)$/,
            Ft = /^\/\//,
            Vt = {},
            Gt = {},
            zt = '*/'.concat('*'),
            Qt = b.createElement('a');
          function Xt(e) {
            return function (t, n) {
              'string' != typeof t && ((n = t), (t = '*'));
              var r,
                i = 0,
                o = t.toLowerCase().match(z) || [];
              if (y(n))
                for (; (r = o[i++]); )
                  '+' === r[0]
                    ? ((r = r.slice(1) || '*'), (e[r] = e[r] || []).unshift(n))
                    : (e[r] = e[r] || []).push(n);
            };
          }
          function Jt(e, t, n, r) {
            var i = {},
              o = e === Gt;
            function a(s) {
              var c;
              return (
                (i[s] = !0),
                E.each(e[s] || [], function (e, s) {
                  var l = s(t, n, r);
                  return 'string' != typeof l || o || i[l]
                    ? o
                      ? !(c = l)
                      : void 0
                    : (t.dataTypes.unshift(l), a(l), !1);
                }),
                c
              );
            }
            return a(t.dataTypes[0]) || (!i['*'] && a('*'));
          }
          function Zt(e, t) {
            var n,
              r,
              i = E.ajaxSettings.flatOptions || {};
            for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
            return r && E.extend(!0, e, r), e;
          }
          (Qt.href = Ct.href),
            E.extend({
              active: 0,
              lastModified: {},
              etag: {},
              ajaxSettings: {
                url: Ct.href,
                type: 'GET',
                isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
                  Ct.protocol
                ),
                global: !0,
                processData: !0,
                async: !0,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                accepts: {
                  '*': zt,
                  text: 'text/plain',
                  html: 'text/html',
                  xml: 'application/xml, text/xml',
                  json: 'application/json, text/javascript',
                },
                contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
                responseFields: { xml: 'responseXML', text: 'responseText', json: 'responseJSON' },
                converters: {
                  '* text': String,
                  'text html': !0,
                  'text json': JSON.parse,
                  'text xml': E.parseXML,
                },
                flatOptions: { url: !0, context: !0 },
              },
              ajaxSetup: function (e, t) {
                return t ? Zt(Zt(e, E.ajaxSettings), t) : Zt(E.ajaxSettings, e);
              },
              ajaxPrefilter: Xt(Vt),
              ajaxTransport: Xt(Gt),
              ajax: function (e, t) {
                'object' == typeof e && ((t = e), (e = void 0)), (t = t || {});
                var n,
                  i,
                  o,
                  a,
                  s,
                  c,
                  l,
                  u,
                  f,
                  d,
                  p = E.ajaxSetup({}, t),
                  h = p.context || p,
                  m = p.context && (h.nodeType || h.jquery) ? E(h) : E.event,
                  g = E.Deferred(),
                  y = E.Callbacks('once memory'),
                  v = p.statusCode || {},
                  x = {},
                  w = {},
                  T = 'canceled',
                  k = {
                    readyState: 0,
                    getResponseHeader: function (e) {
                      var t;
                      if (l) {
                        if (!a)
                          for (a = {}; (t = Ut.exec(o)); )
                            a[t[1].toLowerCase() + ' '] = (
                              a[t[1].toLowerCase() + ' '] || []
                            ).concat(t[2]);
                        t = a[e.toLowerCase() + ' '];
                      }
                      return null == t ? null : t.join(', ');
                    },
                    getAllResponseHeaders: function () {
                      return l ? o : null;
                    },
                    setRequestHeader: function (e, t) {
                      return (
                        null == l &&
                          ((e = w[e.toLowerCase()] = w[e.toLowerCase()] || e), (x[e] = t)),
                        this
                      );
                    },
                    overrideMimeType: function (e) {
                      return null == l && (p.mimeType = e), this;
                    },
                    statusCode: function (e) {
                      var t;
                      if (e)
                        if (l) k.always(e[k.status]);
                        else for (t in e) v[t] = [v[t], e[t]];
                      return this;
                    },
                    abort: function (e) {
                      var t = e || T;
                      return n && n.abort(t), _(0, t), this;
                    },
                  };
                if (
                  (g.promise(k),
                  (p.url = ((e || p.url || Ct.href) + '').replace(Ft, Ct.protocol + '//')),
                  (p.type = t.method || t.type || p.method || p.type),
                  (p.dataTypes = (p.dataType || '*').toLowerCase().match(z) || ['']),
                  null == p.crossDomain)
                ) {
                  c = b.createElement('a');
                  try {
                    (c.href = p.url),
                      (c.href = c.href),
                      (p.crossDomain = Qt.protocol + '//' + Qt.host != c.protocol + '//' + c.host);
                  } catch (e) {
                    p.crossDomain = !0;
                  }
                }
                if (
                  (p.data &&
                    p.processData &&
                    'string' != typeof p.data &&
                    (p.data = E.param(p.data, p.traditional)),
                  Jt(Vt, p, t, k),
                  l)
                )
                  return k;
                for (f in ((u = E.event && p.global) &&
                  0 === E.active++ &&
                  E.event.trigger('ajaxStart'),
                (p.type = p.type.toUpperCase()),
                (p.hasContent = !$t.test(p.type)),
                (i = p.url.replace(Ht, '')),
                p.hasContent
                  ? p.data &&
                    p.processData &&
                    0 === (p.contentType || '').indexOf('application/x-www-form-urlencoded') &&
                    (p.data = p.data.replace(Rt, '+'))
                  : ((d = p.url.slice(i.length)),
                    p.data &&
                      (p.processData || 'string' == typeof p.data) &&
                      ((i += (It.test(i) ? '&' : '?') + p.data), delete p.data),
                    !1 === p.cache &&
                      ((i = i.replace(Wt, '$1')),
                      (d = (It.test(i) ? '&' : '?') + '_=' + Nt.guid++ + d)),
                    (p.url = i + d)),
                p.ifModified &&
                  (E.lastModified[i] && k.setRequestHeader('If-Modified-Since', E.lastModified[i]),
                  E.etag[i] && k.setRequestHeader('If-None-Match', E.etag[i])),
                ((p.data && p.hasContent && !1 !== p.contentType) || t.contentType) &&
                  k.setRequestHeader('Content-Type', p.contentType),
                k.setRequestHeader(
                  'Accept',
                  p.dataTypes[0] && p.accepts[p.dataTypes[0]]
                    ? p.accepts[p.dataTypes[0]] +
                        ('*' !== p.dataTypes[0] ? ', ' + zt + '; q=0.01' : '')
                    : p.accepts['*']
                ),
                p.headers))
                  k.setRequestHeader(f, p.headers[f]);
                if (p.beforeSend && (!1 === p.beforeSend.call(h, k, p) || l)) return k.abort();
                if (
                  ((T = 'abort'),
                  y.add(p.complete),
                  k.done(p.success),
                  k.fail(p.error),
                  (n = Jt(Gt, p, t, k)))
                ) {
                  if (((k.readyState = 1), u && m.trigger('ajaxSend', [k, p]), l)) return k;
                  p.async &&
                    p.timeout > 0 &&
                    (s = r.setTimeout(function () {
                      k.abort('timeout');
                    }, p.timeout));
                  try {
                    (l = !1), n.send(x, _);
                  } catch (e) {
                    if (l) throw e;
                    _(-1, e);
                  }
                } else _(-1, 'No Transport');
                function _(e, t, a, c) {
                  var f,
                    d,
                    b,
                    x,
                    w,
                    T = t;
                  l ||
                    ((l = !0),
                    s && r.clearTimeout(s),
                    (n = void 0),
                    (o = c || ''),
                    (k.readyState = e > 0 ? 4 : 0),
                    (f = (e >= 200 && e < 300) || 304 === e),
                    a &&
                      (x = (function (e, t, n) {
                        for (var r, i, o, a, s = e.contents, c = e.dataTypes; '*' === c[0]; )
                          c.shift(),
                            void 0 === r && (r = e.mimeType || t.getResponseHeader('Content-Type'));
                        if (r)
                          for (i in s)
                            if (s[i] && s[i].test(r)) {
                              c.unshift(i);
                              break;
                            }
                        if (c[0] in n) o = c[0];
                        else {
                          for (i in n) {
                            if (!c[0] || e.converters[i + ' ' + c[0]]) {
                              o = i;
                              break;
                            }
                            a || (a = i);
                          }
                          o = o || a;
                        }
                        if (o) return o !== c[0] && c.unshift(o), n[o];
                      })(p, k, a)),
                    !f &&
                      E.inArray('script', p.dataTypes) > -1 &&
                      E.inArray('json', p.dataTypes) < 0 &&
                      (p.converters['text script'] = function () {}),
                    (x = (function (e, t, n, r) {
                      var i,
                        o,
                        a,
                        s,
                        c,
                        l = {},
                        u = e.dataTypes.slice();
                      if (u[1]) for (a in e.converters) l[a.toLowerCase()] = e.converters[a];
                      for (o = u.shift(); o; )
                        if (
                          (e.responseFields[o] && (n[e.responseFields[o]] = t),
                          !c && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                          (c = o),
                          (o = u.shift()))
                        )
                          if ('*' === o) o = c;
                          else if ('*' !== c && c !== o) {
                            if (!(a = l[c + ' ' + o] || l['* ' + o]))
                              for (i in l)
                                if (
                                  (s = i.split(' '))[1] === o &&
                                  (a = l[c + ' ' + s[0]] || l['* ' + s[0]])
                                ) {
                                  !0 === a
                                    ? (a = l[i])
                                    : !0 !== l[i] && ((o = s[0]), u.unshift(s[1]));
                                  break;
                                }
                            if (!0 !== a)
                              if (a && e.throws) t = a(t);
                              else
                                try {
                                  t = a(t);
                                } catch (e) {
                                  return {
                                    state: 'parsererror',
                                    error: a ? e : 'No conversion from ' + c + ' to ' + o,
                                  };
                                }
                          }
                      return { state: 'success', data: t };
                    })(p, x, k, f)),
                    f
                      ? (p.ifModified &&
                          ((w = k.getResponseHeader('Last-Modified')) && (E.lastModified[i] = w),
                          (w = k.getResponseHeader('etag')) && (E.etag[i] = w)),
                        204 === e || 'HEAD' === p.type
                          ? (T = 'nocontent')
                          : 304 === e
                          ? (T = 'notmodified')
                          : ((T = x.state), (d = x.data), (f = !(b = x.error))))
                      : ((b = T), (!e && T) || ((T = 'error'), e < 0 && (e = 0))),
                    (k.status = e),
                    (k.statusText = (t || T) + ''),
                    f ? g.resolveWith(h, [d, T, k]) : g.rejectWith(h, [k, T, b]),
                    k.statusCode(v),
                    (v = void 0),
                    u && m.trigger(f ? 'ajaxSuccess' : 'ajaxError', [k, p, f ? d : b]),
                    y.fireWith(h, [k, T]),
                    u &&
                      (m.trigger('ajaxComplete', [k, p]),
                      --E.active || E.event.trigger('ajaxStop')));
                }
                return k;
              },
              getJSON: function (e, t, n) {
                return E.get(e, t, n, 'json');
              },
              getScript: function (e, t) {
                return E.get(e, void 0, t, 'script');
              },
            }),
            E.each(['get', 'post'], function (e, t) {
              E[t] = function (e, n, r, i) {
                return (
                  y(n) && ((i = i || r), (r = n), (n = void 0)),
                  E.ajax(
                    E.extend(
                      { url: e, type: t, dataType: i, data: n, success: r },
                      E.isPlainObject(e) && e
                    )
                  )
                );
              };
            }),
            E.ajaxPrefilter(function (e) {
              var t;
              for (t in e.headers)
                'content-type' === t.toLowerCase() && (e.contentType = e.headers[t] || '');
            }),
            (E._evalUrl = function (e, t, n) {
              return E.ajax({
                url: e,
                type: 'GET',
                dataType: 'script',
                cache: !0,
                async: !1,
                global: !1,
                converters: { 'text script': function () {} },
                dataFilter: function (e) {
                  E.globalEval(e, t, n);
                },
              });
            }),
            E.fn.extend({
              wrapAll: function (e) {
                var t;
                return (
                  this[0] &&
                    (y(e) && (e = e.call(this[0])),
                    (t = E(e, this[0].ownerDocument).eq(0).clone(!0)),
                    this[0].parentNode && t.insertBefore(this[0]),
                    t
                      .map(function () {
                        for (var e = this; e.firstElementChild; ) e = e.firstElementChild;
                        return e;
                      })
                      .append(this)),
                  this
                );
              },
              wrapInner: function (e) {
                return y(e)
                  ? this.each(function (t) {
                      E(this).wrapInner(e.call(this, t));
                    })
                  : this.each(function () {
                      var t = E(this),
                        n = t.contents();
                      n.length ? n.wrapAll(e) : t.append(e);
                    });
              },
              wrap: function (e) {
                var t = y(e);
                return this.each(function (n) {
                  E(this).wrapAll(t ? e.call(this, n) : e);
                });
              },
              unwrap: function (e) {
                return (
                  this.parent(e)
                    .not('body')
                    .each(function () {
                      E(this).replaceWith(this.childNodes);
                    }),
                  this
                );
              },
            }),
            (E.expr.pseudos.hidden = function (e) {
              return !E.expr.pseudos.visible(e);
            }),
            (E.expr.pseudos.visible = function (e) {
              return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
            }),
            (E.ajaxSettings.xhr = function () {
              try {
                return new r.XMLHttpRequest();
              } catch (e) {}
            });
          var Yt = { 0: 200, 1223: 204 },
            Kt = E.ajaxSettings.xhr();
          (g.cors = !!Kt && 'withCredentials' in Kt),
            (g.ajax = Kt = !!Kt),
            E.ajaxTransport(function (e) {
              var t, n;
              if (g.cors || (Kt && !e.crossDomain))
                return {
                  send: function (i, o) {
                    var a,
                      s = e.xhr();
                    if ((s.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields))
                      for (a in e.xhrFields) s[a] = e.xhrFields[a];
                    for (a in (e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType),
                    e.crossDomain ||
                      i['X-Requested-With'] ||
                      (i['X-Requested-With'] = 'XMLHttpRequest'),
                    i))
                      s.setRequestHeader(a, i[a]);
                    (t = function (e) {
                      return function () {
                        t &&
                          ((t =
                            n =
                            s.onload =
                            s.onerror =
                            s.onabort =
                            s.ontimeout =
                            s.onreadystatechange =
                              null),
                          'abort' === e
                            ? s.abort()
                            : 'error' === e
                            ? 'number' != typeof s.status
                              ? o(0, 'error')
                              : o(s.status, s.statusText)
                            : o(
                                Yt[s.status] || s.status,
                                s.statusText,
                                'text' !== (s.responseType || 'text') ||
                                  'string' != typeof s.responseText
                                  ? { binary: s.response }
                                  : { text: s.responseText },
                                s.getAllResponseHeaders()
                              ));
                      };
                    }),
                      (s.onload = t()),
                      (n = s.onerror = s.ontimeout = t('error')),
                      void 0 !== s.onabort
                        ? (s.onabort = n)
                        : (s.onreadystatechange = function () {
                            4 === s.readyState &&
                              r.setTimeout(function () {
                                t && n();
                              });
                          }),
                      (t = t('abort'));
                    try {
                      s.send((e.hasContent && e.data) || null);
                    } catch (e) {
                      if (t) throw e;
                    }
                  },
                  abort: function () {
                    t && t();
                  },
                };
            }),
            E.ajaxPrefilter(function (e) {
              e.crossDomain && (e.contents.script = !1);
            }),
            E.ajaxSetup({
              accepts: {
                script:
                  'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
              },
              contents: { script: /\b(?:java|ecma)script\b/ },
              converters: {
                'text script': function (e) {
                  return E.globalEval(e), e;
                },
              },
            }),
            E.ajaxPrefilter('script', function (e) {
              void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = 'GET');
            }),
            E.ajaxTransport('script', function (e) {
              var t, n;
              if (e.crossDomain || e.scriptAttrs)
                return {
                  send: function (r, i) {
                    (t = E('<script>')
                      .attr(e.scriptAttrs || {})
                      .prop({ charset: e.scriptCharset, src: e.url })
                      .on(
                        'load error',
                        (n = function (e) {
                          t.remove(), (n = null), e && i('error' === e.type ? 404 : 200, e.type);
                        })
                      )),
                      b.head.appendChild(t[0]);
                  },
                  abort: function () {
                    n && n();
                  },
                };
            });
          var en,
            tn = [],
            nn = /(=)\?(?=&|$)|\?\?/;
          E.ajaxSetup({
            jsonp: 'callback',
            jsonpCallback: function () {
              var e = tn.pop() || E.expando + '_' + Nt.guid++;
              return (this[e] = !0), e;
            },
          }),
            E.ajaxPrefilter('json jsonp', function (e, t, n) {
              var i,
                o,
                a,
                s =
                  !1 !== e.jsonp &&
                  (nn.test(e.url)
                    ? 'url'
                    : 'string' == typeof e.data &&
                      0 === (e.contentType || '').indexOf('application/x-www-form-urlencoded') &&
                      nn.test(e.data) &&
                      'data');
              if (s || 'jsonp' === e.dataTypes[0])
                return (
                  (i = e.jsonpCallback = y(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback),
                  s
                    ? (e[s] = e[s].replace(nn, '$1' + i))
                    : !1 !== e.jsonp && (e.url += (It.test(e.url) ? '&' : '?') + e.jsonp + '=' + i),
                  (e.converters['script json'] = function () {
                    return a || E.error(i + ' was not called'), a[0];
                  }),
                  (e.dataTypes[0] = 'json'),
                  (o = r[i]),
                  (r[i] = function () {
                    a = arguments;
                  }),
                  n.always(function () {
                    void 0 === o ? E(r).removeProp(i) : (r[i] = o),
                      e[i] && ((e.jsonpCallback = t.jsonpCallback), tn.push(i)),
                      a && y(o) && o(a[0]),
                      (a = o = void 0);
                  }),
                  'script'
                );
            }),
            (g.createHTMLDocument =
              (((en = b.implementation.createHTMLDocument('').body).innerHTML =
                '<form></form><form></form>'),
              2 === en.childNodes.length)),
            (E.parseHTML = function (e, t, n) {
              return 'string' != typeof e
                ? []
                : ('boolean' == typeof t && ((n = t), (t = !1)),
                  t ||
                    (g.createHTMLDocument
                      ? (((r = (t = b.implementation.createHTMLDocument('')).createElement(
                          'base'
                        )).href = b.location.href),
                        t.head.appendChild(r))
                      : (t = b)),
                  (o = !n && []),
                  (i = H.exec(e))
                    ? [t.createElement(i[1])]
                    : ((i = De([e], t, o)),
                      o && o.length && E(o).remove(),
                      E.merge([], i.childNodes)));
              var r, i, o;
            }),
            (E.fn.load = function (e, t, n) {
              var r,
                i,
                o,
                a = this,
                s = e.indexOf(' ');
              return (
                s > -1 && ((r = Et(e.slice(s))), (e = e.slice(0, s))),
                y(t) ? ((n = t), (t = void 0)) : t && 'object' == typeof t && (i = 'POST'),
                a.length > 0 &&
                  E.ajax({ url: e, type: i || 'GET', dataType: 'html', data: t })
                    .done(function (e) {
                      (o = arguments), a.html(r ? E('<div>').append(E.parseHTML(e)).find(r) : e);
                    })
                    .always(
                      n &&
                        function (e, t) {
                          a.each(function () {
                            n.apply(this, o || [e.responseText, t, e]);
                          });
                        }
                    ),
                this
              );
            }),
            (E.expr.pseudos.animated = function (e) {
              return E.grep(E.timers, function (t) {
                return e === t.elem;
              }).length;
            }),
            (E.offset = {
              setOffset: function (e, t, n) {
                var r,
                  i,
                  o,
                  a,
                  s,
                  c,
                  l = E.css(e, 'position'),
                  u = E(e),
                  f = {};
                'static' === l && (e.style.position = 'relative'),
                  (s = u.offset()),
                  (o = E.css(e, 'top')),
                  (c = E.css(e, 'left')),
                  ('absolute' === l || 'fixed' === l) && (o + c).indexOf('auto') > -1
                    ? ((a = (r = u.position()).top), (i = r.left))
                    : ((a = parseFloat(o) || 0), (i = parseFloat(c) || 0)),
                  y(t) && (t = t.call(e, n, E.extend({}, s))),
                  null != t.top && (f.top = t.top - s.top + a),
                  null != t.left && (f.left = t.left - s.left + i),
                  'using' in t ? t.using.call(e, f) : u.css(f);
              },
            }),
            E.fn.extend({
              offset: function (e) {
                if (arguments.length)
                  return void 0 === e
                    ? this
                    : this.each(function (t) {
                        E.offset.setOffset(this, e, t);
                      });
                var t,
                  n,
                  r = this[0];
                return r
                  ? r.getClientRects().length
                    ? ((t = r.getBoundingClientRect()),
                      (n = r.ownerDocument.defaultView),
                      { top: t.top + n.pageYOffset, left: t.left + n.pageXOffset })
                    : { top: 0, left: 0 }
                  : void 0;
              },
              position: function () {
                if (this[0]) {
                  var e,
                    t,
                    n,
                    r = this[0],
                    i = { top: 0, left: 0 };
                  if ('fixed' === E.css(r, 'position')) t = r.getBoundingClientRect();
                  else {
                    for (
                      t = this.offset(),
                        n = r.ownerDocument,
                        e = r.offsetParent || n.documentElement;
                      e &&
                      (e === n.body || e === n.documentElement) &&
                      'static' === E.css(e, 'position');

                    )
                      e = e.parentNode;
                    e &&
                      e !== r &&
                      1 === e.nodeType &&
                      (((i = E(e).offset()).top += E.css(e, 'borderTopWidth', !0)),
                      (i.left += E.css(e, 'borderLeftWidth', !0)));
                  }
                  return {
                    top: t.top - i.top - E.css(r, 'marginTop', !0),
                    left: t.left - i.left - E.css(r, 'marginLeft', !0),
                  };
                }
              },
              offsetParent: function () {
                return this.map(function () {
                  for (var e = this.offsetParent; e && 'static' === E.css(e, 'position'); )
                    e = e.offsetParent;
                  return e || me;
                });
              },
            }),
            E.each({ scrollLeft: 'pageXOffset', scrollTop: 'pageYOffset' }, function (e, t) {
              var n = 'pageYOffset' === t;
              E.fn[e] = function (r) {
                return ee(
                  this,
                  function (e, r, i) {
                    var o;
                    if ((v(e) ? (o = e) : 9 === e.nodeType && (o = e.defaultView), void 0 === i))
                      return o ? o[t] : e[r];
                    o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : (e[r] = i);
                  },
                  e,
                  r,
                  arguments.length
                );
              };
            }),
            E.each(['top', 'left'], function (e, t) {
              E.cssHooks[t] = et(g.pixelPosition, function (e, n) {
                if (n) return (n = Ke(e, t)), Qe.test(n) ? E(e).position()[t] + 'px' : n;
              });
            }),
            E.each({ Height: 'height', Width: 'width' }, function (e, t) {
              E.each({ padding: 'inner' + e, content: t, '': 'outer' + e }, function (n, r) {
                E.fn[r] = function (i, o) {
                  var a = arguments.length && (n || 'boolean' != typeof i),
                    s = n || (!0 === i || !0 === o ? 'margin' : 'border');
                  return ee(
                    this,
                    function (t, n, i) {
                      var o;
                      return v(t)
                        ? 0 === r.indexOf('outer')
                          ? t['inner' + e]
                          : t.document.documentElement['client' + e]
                        : 9 === t.nodeType
                        ? ((o = t.documentElement),
                          Math.max(
                            t.body['scroll' + e],
                            o['scroll' + e],
                            t.body['offset' + e],
                            o['offset' + e],
                            o['client' + e]
                          ))
                        : void 0 === i
                        ? E.css(t, n, s)
                        : E.style(t, n, i, s);
                    },
                    t,
                    a ? i : void 0,
                    a
                  );
                };
              });
            }),
            E.each(
              ['ajaxStart', 'ajaxStop', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'ajaxSend'],
              function (e, t) {
                E.fn[t] = function (e) {
                  return this.on(t, e);
                };
              }
            ),
            E.fn.extend({
              bind: function (e, t, n) {
                return this.on(e, null, t, n);
              },
              unbind: function (e, t) {
                return this.off(e, null, t);
              },
              delegate: function (e, t, n, r) {
                return this.on(t, e, n, r);
              },
              undelegate: function (e, t, n) {
                return 1 === arguments.length ? this.off(e, '**') : this.off(t, e || '**', n);
              },
              hover: function (e, t) {
                return this.on('mouseenter', e).on('mouseleave', t || e);
              },
            }),
            E.each(
              'blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu'.split(
                ' '
              ),
              function (e, t) {
                E.fn[t] = function (e, n) {
                  return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
                };
              }
            );
          var rn = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
          (E.proxy = function (e, t) {
            var n, r, i;
            if (('string' == typeof t && ((n = e[t]), (t = e), (e = n)), y(e)))
              return (
                (r = s.call(arguments, 2)),
                (i = function () {
                  return e.apply(t || this, r.concat(s.call(arguments)));
                }),
                (i.guid = e.guid = e.guid || E.guid++),
                i
              );
          }),
            (E.holdReady = function (e) {
              e ? E.readyWait++ : E.ready(!0);
            }),
            (E.isArray = Array.isArray),
            (E.parseJSON = JSON.parse),
            (E.nodeName = L),
            (E.isFunction = y),
            (E.isWindow = v),
            (E.camelCase = ie),
            (E.type = T),
            (E.now = Date.now),
            (E.isNumeric = function (e) {
              var t = E.type(e);
              return ('number' === t || 'string' === t) && !isNaN(e - parseFloat(e));
            }),
            (E.trim = function (e) {
              return null == e ? '' : (e + '').replace(rn, '$1');
            }),
            void 0 ===
              (n = function () {
                return E;
              }.apply(t, [])) || (e.exports = n);
          var on = r.jQuery,
            an = r.$;
          return (
            (E.noConflict = function (e) {
              return r.$ === E && (r.$ = an), e && r.jQuery === E && (r.jQuery = on), E;
            }),
            void 0 === i && (r.jQuery = r.$ = E),
            E
          );
        });
      },
      946: (e, t) => {
        'use strict';
        var n;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.replaceCodePoint = t.fromCodePoint = void 0);
        var r = new Map([
          [0, 65533],
          [128, 8364],
          [130, 8218],
          [131, 402],
          [132, 8222],
          [133, 8230],
          [134, 8224],
          [135, 8225],
          [136, 710],
          [137, 8240],
          [138, 352],
          [139, 8249],
          [140, 338],
          [142, 381],
          [145, 8216],
          [146, 8217],
          [147, 8220],
          [148, 8221],
          [149, 8226],
          [150, 8211],
          [151, 8212],
          [152, 732],
          [153, 8482],
          [154, 353],
          [155, 8250],
          [156, 339],
          [158, 382],
          [159, 376],
        ]);
        function i(e) {
          var t;
          return (e >= 55296 && e <= 57343) || e > 1114111
            ? 65533
            : null !== (t = r.get(e)) && void 0 !== t
            ? t
            : e;
        }
        (t.fromCodePoint =
          null !== (n = String.fromCodePoint) && void 0 !== n
            ? n
            : function (e) {
                var t = '';
                return (
                  e > 65535 &&
                    ((e -= 65536),
                    (t += String.fromCharCode(((e >>> 10) & 1023) | 55296)),
                    (e = 56320 | (1023 & e))),
                  t + String.fromCharCode(e)
                );
              }),
          (t.replaceCodePoint = i),
          (t.default = function (e) {
            return (0, t.fromCodePoint)(i(e));
          });
      },
      951: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getFeed = function (e) {
            var t = c(f, e);
            return t
              ? 'feed' === t.name
                ? (function (e) {
                    var t,
                      n = e.children,
                      r = {
                        type: 'atom',
                        items: (0, i.getElementsByTagName)('entry', n).map(function (e) {
                          var t,
                            n = e.children,
                            r = { media: s(n) };
                          u(r, 'id', 'id', n), u(r, 'title', 'title', n);
                          var i =
                            null === (t = c('link', n)) || void 0 === t ? void 0 : t.attribs.href;
                          i && (r.link = i);
                          var o = l('summary', n) || l('content', n);
                          o && (r.description = o);
                          var a = l('updated', n);
                          return a && (r.pubDate = new Date(a)), r;
                        }),
                      };
                    u(r, 'id', 'id', n), u(r, 'title', 'title', n);
                    var o = null === (t = c('link', n)) || void 0 === t ? void 0 : t.attribs.href;
                    o && (r.link = o), u(r, 'description', 'subtitle', n);
                    var a = l('updated', n);
                    return a && (r.updated = new Date(a)), u(r, 'author', 'email', n, !0), r;
                  })(t)
                : (function (e) {
                    var t,
                      n,
                      r =
                        null !==
                          (n =
                            null === (t = c('channel', e.children)) || void 0 === t
                              ? void 0
                              : t.children) && void 0 !== n
                          ? n
                          : [],
                      o = {
                        type: e.name.substr(0, 3),
                        id: '',
                        items: (0, i.getElementsByTagName)('item', e.children).map(function (e) {
                          var t = e.children,
                            n = { media: s(t) };
                          u(n, 'id', 'guid', t),
                            u(n, 'title', 'title', t),
                            u(n, 'link', 'link', t),
                            u(n, 'description', 'description', t);
                          var r = l('pubDate', t) || l('dc:date', t);
                          return r && (n.pubDate = new Date(r)), n;
                        }),
                      };
                    u(o, 'title', 'title', r),
                      u(o, 'link', 'link', r),
                      u(o, 'description', 'description', r);
                    var a = l('lastBuildDate', r);
                    return (
                      a && (o.updated = new Date(a)), u(o, 'author', 'managingEditor', r, !0), o
                    );
                  })(t)
              : null;
          });
        var r = n(779),
          i = n(679),
          o = ['url', 'type', 'lang'],
          a = [
            'fileSize',
            'bitrate',
            'framerate',
            'samplingrate',
            'channels',
            'duration',
            'height',
            'width',
          ];
        function s(e) {
          return (0, i.getElementsByTagName)('media:content', e).map(function (e) {
            for (
              var t = e.attribs, n = { medium: t.medium, isDefault: !!t.isDefault }, r = 0, i = o;
              r < i.length;
              r++
            )
              t[(l = i[r])] && (n[l] = t[l]);
            for (var s = 0, c = a; s < c.length; s++) {
              var l;
              t[(l = c[s])] && (n[l] = parseInt(t[l], 10));
            }
            return t.expression && (n.expression = t.expression), n;
          });
        }
        function c(e, t) {
          return (0, i.getElementsByTagName)(e, t, !0, 1)[0];
        }
        function l(e, t, n) {
          return (
            void 0 === n && (n = !1),
            (0, r.textContent)((0, i.getElementsByTagName)(e, t, n, 1)).trim()
          );
        }
        function u(e, t, n, r, i) {
          void 0 === i && (i = !1);
          var o = l(n, r, i);
          o && (e[t] = o);
        }
        function f(e) {
          return 'rss' === e || 'feed' === e || 'rdf:RDF' === e;
        }
      },
      970: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.clamp = function (e, t, n) {
            return Math.max(e, Math.min(t, n));
          }),
          (t.escapeWhitespace = function (e) {
            return e.replace(/(\t)|(\r)|(\n)/g, (e, t, n) => (t ? '\\t' : n ? '\\r' : '\\n'));
          });
      },
      972: function (e, t, n) {
        'use strict';
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          o =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && r(t, e, n);
              return i(t, e), t;
            },
          a =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.decodeXML =
            t.decodeHTMLStrict =
            t.decodeHTMLAttribute =
            t.decodeHTML =
            t.determineBranch =
            t.EntityDecoder =
            t.DecodingMode =
            t.BinTrieFlags =
            t.fromCodePoint =
            t.replaceCodePoint =
            t.decodeCodePoint =
            t.xmlDecodeTree =
            t.htmlDecodeTree =
              void 0);
        var s = a(n(57));
        t.htmlDecodeTree = s.default;
        var c = a(n(615));
        t.xmlDecodeTree = c.default;
        var l = o(n(946));
        t.decodeCodePoint = l.default;
        var u,
          f,
          d,
          p,
          h = n(946);
        function m(e) {
          return e >= u.ZERO && e <= u.NINE;
        }
        function g(e) {
          return (e >= u.UPPER_A && e <= u.UPPER_F) || (e >= u.LOWER_A && e <= u.LOWER_F);
        }
        function y(e) {
          return (
            e === u.EQUALS ||
            (function (e) {
              return (
                (e >= u.UPPER_A && e <= u.UPPER_Z) || (e >= u.LOWER_A && e <= u.LOWER_Z) || m(e)
              );
            })(e)
          );
        }
        Object.defineProperty(t, 'replaceCodePoint', {
          enumerable: !0,
          get: function () {
            return h.replaceCodePoint;
          },
        }),
          Object.defineProperty(t, 'fromCodePoint', {
            enumerable: !0,
            get: function () {
              return h.fromCodePoint;
            },
          }),
          (function (e) {
            (e[(e.NUM = 35)] = 'NUM'),
              (e[(e.SEMI = 59)] = 'SEMI'),
              (e[(e.EQUALS = 61)] = 'EQUALS'),
              (e[(e.ZERO = 48)] = 'ZERO'),
              (e[(e.NINE = 57)] = 'NINE'),
              (e[(e.LOWER_A = 97)] = 'LOWER_A'),
              (e[(e.LOWER_F = 102)] = 'LOWER_F'),
              (e[(e.LOWER_X = 120)] = 'LOWER_X'),
              (e[(e.LOWER_Z = 122)] = 'LOWER_Z'),
              (e[(e.UPPER_A = 65)] = 'UPPER_A'),
              (e[(e.UPPER_F = 70)] = 'UPPER_F'),
              (e[(e.UPPER_Z = 90)] = 'UPPER_Z');
          })(u || (u = {})),
          (function (e) {
            (e[(e.VALUE_LENGTH = 49152)] = 'VALUE_LENGTH'),
              (e[(e.BRANCH_LENGTH = 16256)] = 'BRANCH_LENGTH'),
              (e[(e.JUMP_TABLE = 127)] = 'JUMP_TABLE');
          })((f = t.BinTrieFlags || (t.BinTrieFlags = {}))),
          (function (e) {
            (e[(e.EntityStart = 0)] = 'EntityStart'),
              (e[(e.NumericStart = 1)] = 'NumericStart'),
              (e[(e.NumericDecimal = 2)] = 'NumericDecimal'),
              (e[(e.NumericHex = 3)] = 'NumericHex'),
              (e[(e.NamedEntity = 4)] = 'NamedEntity');
          })(d || (d = {})),
          (function (e) {
            (e[(e.Legacy = 0)] = 'Legacy'),
              (e[(e.Strict = 1)] = 'Strict'),
              (e[(e.Attribute = 2)] = 'Attribute');
          })((p = t.DecodingMode || (t.DecodingMode = {})));
        var v = (function () {
          function e(e, t, n) {
            (this.decodeTree = e),
              (this.emitCodePoint = t),
              (this.errors = n),
              (this.state = d.EntityStart),
              (this.consumed = 1),
              (this.result = 0),
              (this.treeIndex = 0),
              (this.excess = 1),
              (this.decodeMode = p.Strict);
          }
          return (
            (e.prototype.startEntity = function (e) {
              (this.decodeMode = e),
                (this.state = d.EntityStart),
                (this.result = 0),
                (this.treeIndex = 0),
                (this.excess = 1),
                (this.consumed = 1);
            }),
            (e.prototype.write = function (e, t) {
              switch (this.state) {
                case d.EntityStart:
                  return e.charCodeAt(t) === u.NUM
                    ? ((this.state = d.NumericStart),
                      (this.consumed += 1),
                      this.stateNumericStart(e, t + 1))
                    : ((this.state = d.NamedEntity), this.stateNamedEntity(e, t));
                case d.NumericStart:
                  return this.stateNumericStart(e, t);
                case d.NumericDecimal:
                  return this.stateNumericDecimal(e, t);
                case d.NumericHex:
                  return this.stateNumericHex(e, t);
                case d.NamedEntity:
                  return this.stateNamedEntity(e, t);
              }
            }),
            (e.prototype.stateNumericStart = function (e, t) {
              return t >= e.length
                ? -1
                : (32 | e.charCodeAt(t)) === u.LOWER_X
                ? ((this.state = d.NumericHex),
                  (this.consumed += 1),
                  this.stateNumericHex(e, t + 1))
                : ((this.state = d.NumericDecimal), this.stateNumericDecimal(e, t));
            }),
            (e.prototype.addToNumericResult = function (e, t, n, r) {
              if (t !== n) {
                var i = n - t;
                (this.result = this.result * Math.pow(r, i) + parseInt(e.substr(t, i), r)),
                  (this.consumed += i);
              }
            }),
            (e.prototype.stateNumericHex = function (e, t) {
              for (var n = t; t < e.length; ) {
                var r = e.charCodeAt(t);
                if (!m(r) && !g(r))
                  return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
                t += 1;
              }
              return this.addToNumericResult(e, n, t, 16), -1;
            }),
            (e.prototype.stateNumericDecimal = function (e, t) {
              for (var n = t; t < e.length; ) {
                var r = e.charCodeAt(t);
                if (!m(r))
                  return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
                t += 1;
              }
              return this.addToNumericResult(e, n, t, 10), -1;
            }),
            (e.prototype.emitNumericEntity = function (e, t) {
              var n;
              if (this.consumed <= t)
                return (
                  null === (n = this.errors) ||
                    void 0 === n ||
                    n.absenceOfDigitsInNumericCharacterReference(this.consumed),
                  0
                );
              if (e === u.SEMI) this.consumed += 1;
              else if (this.decodeMode === p.Strict) return 0;
              return (
                this.emitCodePoint((0, l.replaceCodePoint)(this.result), this.consumed),
                this.errors &&
                  (e !== u.SEMI && this.errors.missingSemicolonAfterCharacterReference(),
                  this.errors.validateNumericCharacterReference(this.result)),
                this.consumed
              );
            }),
            (e.prototype.stateNamedEntity = function (e, t) {
              for (
                var n = this.decodeTree, r = n[this.treeIndex], i = (r & f.VALUE_LENGTH) >> 14;
                t < e.length;
                t++, this.excess++
              ) {
                var o = e.charCodeAt(t);
                if (
                  ((this.treeIndex = x(n, r, this.treeIndex + Math.max(1, i), o)),
                  this.treeIndex < 0)
                )
                  return 0 === this.result || (this.decodeMode === p.Attribute && (0 === i || y(o)))
                    ? 0
                    : this.emitNotTerminatedNamedEntity();
                if (0 != (i = ((r = n[this.treeIndex]) & f.VALUE_LENGTH) >> 14)) {
                  if (o === u.SEMI)
                    return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
                  this.decodeMode !== p.Strict &&
                    ((this.result = this.treeIndex),
                    (this.consumed += this.excess),
                    (this.excess = 0));
                }
              }
              return -1;
            }),
            (e.prototype.emitNotTerminatedNamedEntity = function () {
              var e,
                t = this.result,
                n = (this.decodeTree[t] & f.VALUE_LENGTH) >> 14;
              return (
                this.emitNamedEntityData(t, n, this.consumed),
                null === (e = this.errors) ||
                  void 0 === e ||
                  e.missingSemicolonAfterCharacterReference(),
                this.consumed
              );
            }),
            (e.prototype.emitNamedEntityData = function (e, t, n) {
              var r = this.decodeTree;
              return (
                this.emitCodePoint(1 === t ? r[e] & ~f.VALUE_LENGTH : r[e + 1], n),
                3 === t && this.emitCodePoint(r[e + 2], n),
                n
              );
            }),
            (e.prototype.end = function () {
              var e;
              switch (this.state) {
                case d.NamedEntity:
                  return 0 === this.result ||
                    (this.decodeMode === p.Attribute && this.result !== this.treeIndex)
                    ? 0
                    : this.emitNotTerminatedNamedEntity();
                case d.NumericDecimal:
                  return this.emitNumericEntity(0, 2);
                case d.NumericHex:
                  return this.emitNumericEntity(0, 3);
                case d.NumericStart:
                  return (
                    null === (e = this.errors) ||
                      void 0 === e ||
                      e.absenceOfDigitsInNumericCharacterReference(this.consumed),
                    0
                  );
                case d.EntityStart:
                  return 0;
              }
            }),
            e
          );
        })();
        function b(e) {
          var t = '',
            n = new v(e, function (e) {
              return (t += (0, l.fromCodePoint)(e));
            });
          return function (e, r) {
            for (var i = 0, o = 0; (o = e.indexOf('&', o)) >= 0; ) {
              (t += e.slice(i, o)), n.startEntity(r);
              var a = n.write(e, o + 1);
              if (a < 0) {
                i = o + n.end();
                break;
              }
              (i = o + a), (o = 0 === a ? i + 1 : i);
            }
            var s = t + e.slice(i);
            return (t = ''), s;
          };
        }
        function x(e, t, n, r) {
          var i = (t & f.BRANCH_LENGTH) >> 7,
            o = t & f.JUMP_TABLE;
          if (0 === i) return 0 !== o && r === o ? n : -1;
          if (o) {
            var a = r - o;
            return a < 0 || a >= i ? -1 : e[n + a] - 1;
          }
          for (var s = n, c = s + i - 1; s <= c; ) {
            var l = (s + c) >>> 1,
              u = e[l];
            if (u < r) s = l + 1;
            else {
              if (!(u > r)) return e[l + i];
              c = l - 1;
            }
          }
          return -1;
        }
        (t.EntityDecoder = v), (t.determineBranch = x);
        var w = b(s.default),
          T = b(c.default);
        (t.decodeHTML = function (e, t) {
          return void 0 === t && (t = p.Legacy), w(e, t);
        }),
          (t.decodeHTMLAttribute = function (e) {
            return w(e, p.Attribute);
          }),
          (t.decodeHTMLStrict = function (e) {
            return w(e, p.Strict);
          }),
          (t.decodeXML = function (e) {
            return T(e, p.Strict);
          });
      },
    },
    t = {};
  function n(r) {
    var i = t[r];
    if (void 0 !== i) return i.exports;
    var o = (t[r] = { exports: {} });
    return e[r].call(o.exports, o, o.exports, n), o.exports;
  }
  (n.n = e => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return n.d(t, { a: t }), t;
  }),
    (n.d = (e, t) => {
      for (var r in t)
        n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
    }),
    (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    chrome.runtime.onMessage.addListener((e, t, n) => {
      if ('inboxsdk__injectPageWorld' === e.type && t.tab)
        if (chrome.scripting) {
          let e, r;
          t.documentId ? (e = [t.documentId]) : (r = [t.frameId]),
            chrome.scripting.executeScript({
              target: { tabId: t.tab.id, documentIds: e, frameIds: r },
              world: 'MAIN',
              files: ['pageWorld.js'],
            }),
            n(!0);
        } else n(!1);
    }),
    (() => {
      'use strict';
      var e = n(886),
        t = n.n(e);
      new (class {
        constructor(e) {
          (this.notif_win = null),
            (this.error_win = null),
            (this.g_logger = !1),
            (this.server_url = 'https://www.cloudhq.net/');
        }
        fn_is_extension_installed = function (e) {
          var t = document.head,
            n = 'data-cloudhq-has-' + e.replace(/_/g, '-');
          return t && 'true' == t.getAttribute(n);
        };
        fn_get_function_name = function (e) {
          try {
            if ('function' == typeof e || 'object' == typeof e) {
              var t = ('' + e).match(/function\s*([\w\$]*)\s*\(/);
              if (null !== t) return t[1];
            }
          } catch (e) {}
          return 'unknown';
        };
        fn_log = function (e, t, n) {
          try {
            window.top && window.top.console
              ? window.top.console.log(e)
              : window.console && window.console.log(e);
          } catch (e) {}
          if (t && this.g_logger) {
            var r = n || 'debug';
            this.g_logger.log(r, t, e);
          }
        };
        fn_refresh_all = function (e, n) {
          var r = null;
          null != e && (r = { obj: t().toJSON(e), operation: t().toJSON(n) });
          var i = {
            type: 'GET',
            url: this.server_url + 'main_cloud_fs_interface/refresh_cloudhq_dir',
            dataType: 'json',
            data: r,
            async: !0,
          };
          this.fn_execute_via_background(
            'fn_ajax',
            i,
            function (e) {
              (e.s && e.s.error) ||
                (t()('#left_jstree_container').jstree('refresh'),
                t()('#right_jstree_container').jstree('refresh'),
                t()('#synchpopup_jstree_container').jstree('refresh'),
                t()('#copypopup_jstree_container').jstree('refresh'));
            },
            function (e) {}
          );
        };
        fn_loggily = function (e, t) {
          var n = this;
          return function () {
            try {
              return t.apply(this, arguments);
            } catch (t) {
              throw (n.fn_log('cloudHQ exception: ' + e + ': ' + t, 'google docs', 'error'), t);
            }
          };
        };
        c_logger = function (e, t) {
          var n = { all: 0, debug: 10, info: 20, warn: 30, warning: 30, error: 40, fatal: 100 },
            r = new Date().getTime();
          (this.server = e),
            (this.minLevel = t),
            (this.baseUrl = function (e, t) {
              return (
                this.server + 'logger?c=' + encodeURIComponent(t) + '&l=' + encodeURIComponent(e)
              );
            }),
            (this.log = function (e, t, i, o) {
              if (void 0 === i && void 0 === o)
                throw new Error('Please specify level, category and message');
              if (!(n[e] < n[this.minLevel])) {
                i = '[' + g_google_id + '] ' + i;
                var a = 'logger-' + r;
                r += 1;
                var s = { level: e, category: t, message: i, callback: a, params: o };
                chrome.runtime.sendRequest(
                  { action_name: 'fn_logger', action_params: s },
                  function (e) {}
                );
              }
            }),
            (this.debug = function (e, t, n) {
              this.log('debug', e, t, n);
            }),
            (this.info = function (e, t, n) {
              this.log('info', e, t, n);
            }),
            (this.warning = this.warn =
              function (e, t, n) {
                this.log('warning', e, t, n);
              }),
            (this.error = function (e, t, n) {
              this.log('error', e, t, n);
            }),
            (this.fatal = function (e, t, n) {
              this.log('fatal', e, t, n);
            }),
            (this.track = function (e, t, n) {
              void 0 !== n && (t.probability = n), this.log('info', 'track', e, t);
            });
        };
        fn_delayed_conditional_execute = function (e) {
          var n = this;
          e = t().extend(
            {
              poll_delay: 200,
              max_poll_attempts: 1,
              retry_message: 'Scheduling another delayedConditionalExecute search.',
              failure_message: null,
              error_message: 'Condition threw an exception!',
              error_continuation: null,
              condition: null,
              continuation: null,
              log_category: 'gmail',
              log_level_on_failure: 'error',
              log_level_on_error: null,
            },
            e
          );
          var r = 0;
          function i(e, t, r, i) {
            'function' == typeof e && (e = e()), e && n.fn_log(e + ' ' + (t || ''), r, i);
          }
          !(function t() {
            var o;
            try {
              o = e.condition();
            } catch (t) {
              var a = t.message ? t.message : t;
              return void i(
                e.error_message,
                '(after ' + r + " attempts, '" + a + "')",
                e.log_category,
                e.log_level_on_error || e.log_level_on_failure
              );
            }
            o
              ? e.continuation()
              : r < e.max_poll_attempts
              ? ((r += 1),
                e.retry_message && i(e.retry_message, 'Attempts so far: ' + r),
                window.setTimeout(
                  n.fn_loggily('fn_delayed_conditional_execute attempt', t),
                  e.poll_delay
                ))
              : (e.failure_message &&
                  (n.fn_log(e.failure_message, null, e.log_category, e.log_level_on_failure),
                  g_sdk.ButterBar.showMessage({
                    text: e.failure_message,
                    messageKey: 'cloudHQ_butter_error',
                  })),
                e.error_continuation && e.error_continuation());
          })();
        };
        fn_execute_via_background = function (e, t, n, r) {
          var i = this;
          chrome.runtime.sendRequest({ action_name: e, action_params: t }, function (t) {
            try {
              var o;
              if (
                (i.fn_log(
                  'received answer from background.html on request to run ' + e,
                  'gdoc',
                  'debug'
                ),
                null == t)
              ) {
                if (
                  ((o = 'Failed to call ' + e + '. Unable to connect to background.html'),
                  !jQuery.isFunction(r))
                )
                  throw o;
                i.fn_log(o, 'gdoc', 'debug'), r(null);
              } else if (t.error) {
                if (
                  ((o = 'Action ' + e + ' failed. error: ' + JSON.stringify(t.error)),
                  !jQuery.isFunction(r))
                )
                  throw o;
                i.fn_log(o, 'gdoc', 'debug'), r(t.error);
              } else jQuery.isFunction(n) && n(t.result);
            } catch (e) {}
          });
        };
        fn_insert_overlay = function () {
          ($g_overlay = t()(
            '<div id="cloudHQ_overlay" class="ui-widget-overlay" style="z-index: 9999;"></div>'
          ).hide()),
            t()('body').append($g_overlay);
        };
        fn_insert_notif_error_win = function () {
          var e = this;
          t()('body').append(
            '<div id="cloudHQ_notif_win_msg" style="display:none;"><div id="cloudHQ_notif_win_msg_content"><span>TESt1 <br/>TEST2</span></div></div></div>'
          ),
            t()('body').append(
              '<div id="cloudHQ_error_win_msg" style="display:none;"><div id="cloudHQ_error_win_msg_content"><span>TEST1 <br/>TEST2</span></div></div></div>'
            ),
            t()('#cloudHQ_notif_win_msg_content').bind('click', function () {
              e.fn_notif_win(!1);
            }),
            t()('#cloudHQ_error_win_msg_content').bind('click', function () {
              e.fn_error_win(!1);
            });
        };
        fn_notif_win = function (e, n, r) {
          var i = this;
          t()('#cloudHQ_error_win_msg').hide(),
            (g_error_win = null),
            1 == e
              ? (t()('#cloudHQ_notif_win_msg').hide(),
                (i.notif_win = null),
                t()('#cloudHQ_notif_win_msg_content').html(n),
                t()('#cloudHQ_notif_win_msg').show(),
                null != r &&
                  null == i.notif_win &&
                  (i.notif_win = setTimeout(function () {
                    t()('#cloudHQ_notif_win_msg').hide(), (i.notif_win = null);
                  }, r)))
              : (t()('#cloudHQ_notif_win_msg').hide(), (i.notif_win = null));
        };
        fn_error_win = function (e, n, r) {
          var i = this;
          t()('#cloudHQ_notif_win_msg').hide(),
            (i.notif_win = null),
            1 == e
              ? (t()('#cloudHQ_error_win_msg').hide(),
                (i.error_win = null),
                t()('#cloudHQ_error_win_msg_content').html(n),
                t()('#cloudHQ_error_win_msg').show(),
                null != r &&
                  null == i.error_win &&
                  (i.error_win = setTimeout(function () {
                    t()('#cloudHQ_error_win_msg').hide(), (i.notif_win = null);
                  }, r)))
              : (t()('#cloudHQ_error_win_msg').hide(), (i.error_win = null));
        };
        fn_get_account_identifier_number_from_url = function () {
          var e = window.location.href,
            t = 0;
          if (e.indexOf('/mail/u/') > -1) {
            var n = e.split('/mail/u/');
            if (n[1]) {
              var r = n[1].split('/');
              r[0] && (t = r[0]);
            }
          }
          return t;
        };
        fn_fetch_user_name_from_settings = function (e, n) {
          var r = [];
          function i(e, t) {
            if (e && e.length)
              for (var n = 0; n < e.length; n++)
                if (Array.isArray(e[n]) && e[n].length > 0 && e[n][0] === t) return e[n];
            return [];
          }
          console.log('fn_fetch_user_name_from_settings: ENTERING');
          try {
            t().ajax({
              url:
                'https://mail.google.com/mail/u/' +
                this.fn_get_account_identifier_number_from_url() +
                '/#settings/accounts',
              context: document.body,
              success: function (o, a, s) {
                var c,
                  l = /null\; _GM_setData\(([\s\S]*?)\)\; _rmNode/gm;
                try {
                  for (var u = {}; (c = l.exec(o)); ) {
                    var f = JSON.parse(c[1]).sBEv4c;
                    if (f) {
                      var d = i(f, 'mla');
                      d.length > 1 &&
                        t().each(d[1], function (e, t) {
                          t.length > 1 && (u[t[0] + ''] = t[t.length - 1]);
                        });
                      var p = i(f, 'p');
                      if (p && p.length > 1) {
                        var h = i(p[1], 'sx_dn');
                        h.length > 1 && (u[e.User.getEmailAddress() + ''] = h[1].toString());
                      }
                    }
                  }
                  t().each(u, function (e, t) {
                    r.push({ emailAddress: e, name: t });
                  });
                } catch (e) {
                  console.log('fn_fetch_user_name_from_settings: step4 e=', e);
                }
                n && n(r);
              },
            });
          } catch (e) {
            console.log('fn_fetch_user_name_from_settings e=', ex);
          }
        };
        fn_ajax = function (e) {
          chrome.runtime.sendMessage({ what: 'PROXY_AJAX', payload: e }, function (n) {
            if (n) {
              var r = n.payload,
                i = t().isPlainObject(r) ? JSON.stringify(r) : r + '',
                o = {
                  status: n.status,
                  response: i,
                  getResponseHeader: function (e) {
                    return n.headers && n.headers[e.toLowerCase()];
                  },
                };
              if ('blob' === n.payloadType) {
                for (
                  var a = n.payload,
                    s = atob(a.split(',')[1]),
                    c = a.split(',')[0].split(':')[1].split(';')[0],
                    l = new ArrayBuffer(s.length),
                    u = new Uint8Array(l),
                    f = 0;
                  f < s.length;
                  f++
                )
                  u[f] = s.charCodeAt(f);
                var d = new Blob([l], { type: c });
                o.response = d;
              }
              'success' == n.what && t().isFunction(e.success)
                ? e.success.call(this, r, 'success', o)
                : t().isFunction(e.error)
                ? e.error.call(this, r, 'error', o)
                : t().isFunction(e.failure) && e.failure.call(this, r, 'failure', o),
                t().isFunction(e.complete) && e.complete.call(this, o, i);
            }
          });
        };
        fn_get_redirect_url = function (e) {
          var n = window.location.href;
          if (((n = n.split(/[?#]/)[0]), e)) {
            var r = [];
            t().each(e, function (e, t) {
              r.push(e + '=' + encodeURIComponent(t));
            }),
              (n = n + '?' + r.join('&'));
          }
          return n + window.location.hash;
        };
        fn_insert_toolbar_button_top_right = function (e, n) {
          var r = '.Cr.aqJ',
            i = '.ar5.J-J5-Ji';
          this.fn_delayed_conditional_execute({
            poll_delay: 500,
            max_poll_attempts: 5e3,
            retry_message: null,
            condition: function () {
              var n = !1;
              return (
                e.thread_view && ((r = '.G-atb .adF'), (i = '.T-I-ax7.T-I-Js-Gs.L3')),
                t()(r).length > 0 && t()(r).is(':visible') && (n = !0),
                n
              );
            },
            continuation: function () {
              return (
                setTimeout(function () {
                  setTimeout(function () {
                    t()(r).each(function () {
                      var n = t()(this),
                        r = n
                          .parent()
                          .find('[data-toolbar-icononly]')
                          .attr('data-toolbar-icononly'),
                        o = n.find('.' + e.class);
                      0 == o.length
                        ? ((o = t()(
                            '<div id="" class="T-I J-J5-Ji T-I-ax7 ' +
                              e.class +
                              '" role="button" tabindex="0" aria-haspopup="false" aria-expanded="false" data-tooltip="' +
                              e.tooltip +
                              '" aria-label="' +
                              e.text +
                              '" style="user-select: none;"></div>'
                          )),
                          'false' != r
                            ? o.append(
                                t()('<div class="asa"><div class="aos T-I-J3 J-J5-Ji"></div></div>')
                              )
                            : o.append(
                                t()(
                                  '<div class="chq_xxx Bn" style="padding-left:6px">' +
                                    e.text +
                                    '</div>'
                                )
                              ),
                          o.css({ 'min-width': '50px' }),
                          o.find('.aos').css({
                            background: 'url(' + e.icon_url + ')',
                            'background-size': '16px 16px',
                            'background-repeat': 'no-repeat',
                            'background-position': 'center center',
                          }),
                          n.find(i).last().parent().prepend(o),
                          o.click(function (t) {
                            e.onClick(t);
                          }),
                          o.hover(
                            function () {
                              t()(this).addClass('T-I-JW');
                            },
                            function () {
                              t()(this).removeClass('T-I-JW');
                            }
                          ))
                        : o.is(':visible') || o.show();
                    });
                  }, 1e3);
                }, 500),
                !0
              );
            },
          });
        };
        fn_encode_url_safe_base64 = function (e) {
          return btoa(e).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        };
      })();
      const r = new (class {
        ajaxRequest = function (e) {
          function t(e, n, r) {
            if (!n || 'object' != typeof n || n instanceof Date || n instanceof File) {
              const t = null == n ? '' : n;
              e.append(r, t);
            } else
              Object.keys(n).forEach(i => {
                t(e, n[i], r ? `${r}[${i}]` : i);
              });
          }
          const n = new Headers();
          'json' == e.dataType && n.append('Content-Type', 'application/json'),
            'html' == e.dataType && n.append('Content-Type', 'text/html'),
            e.responseType && 'blob' == e.responseType && n.append('Content-Type', 'text/plain'),
            e['Content-type'] && n.append('Content-Type', e['Content-type']),
            e.headers && Object.keys(e.headers).forEach(t => n.append(t, e.headers[t]));
          var r = { method: e.type, headers: n };
          if (e.data)
            if ('get' == e.type.toLowerCase()) {
              var i = new URL(e.url);
              Object.keys(e.data).forEach(function (t) {
                e.data[t] && 'object' == typeof e.data[t]
                  ? e.data[t].forEach(function (e) {
                      i.searchParams.append(t + '[]', e);
                    })
                  : i.searchParams.append(t, e.data[t]);
              }),
                (e.url = i.href);
            } else
              'post' == e.type.toLowerCase() && 'form' == e.dataType
                ? (r.body = (function (e) {
                    const n = new FormData();
                    return t(n, e), n;
                  })(e.data))
                : 'string' == typeof e.data
                ? (r.body = new URLSearchParams(e.data))
                : (r.body = JSON.stringify(e.data));
          e.image && (r.body = e.image);
          const o = new Request(e.url, r);
          var a = '',
            s = '',
            c = null;
          fetch(o)
            .then(
              t => (
                (c = t.status),
                (s = t.headers.get('Content-Type')),
                e.responseType && 'blob' == e.responseType
                  ? ((a = t.headers.get('Content-Disposition')), t.blob())
                  : s && s.includes('application/json')
                  ? t.json()
                  : t.text()
              )
            )
            .then(t => {
              if (
                e.success &&
                e.responseType &&
                'blob' == e.responseType &&
                e.returnBlobAfterRead
              ) {
                var n = new FileReader();
                n.readAsDataURL(t),
                  (n.onload = function () {
                    e.success &&
                      e.success.call(this, {
                        what: 'success',
                        payloadType: 'blob',
                        payload: n.result,
                        type: s || t.type,
                        disposition: a,
                        status: c,
                        http_status_code: c,
                      });
                  });
              } else if (e.success) {
                try {
                  s && s.includes('application/json') && (t.http_status_code = c);
                } catch (e) {
                  console.log('ajaxRequest: Unable set http_status_code e=', e);
                }
                e.success.call(this, t);
              }
            })
            .catch(t => {
              e.error && e.error.call(this, t);
            });
        };
        openNewTab = function (e, t) {
          chrome.tabs.create({ url: e, active: !0 }, function (e) {
            t && t(e);
          });
        };
        openOrFocusTab = function (e, t) {
          var n = this;
          t
            ? chrome.tabs.query({}, function (r) {
                for (var i = r.length, o = !1, a = 0; a < i; a++) {
                  var s = r[a];
                  !o &&
                    s &&
                    s.url &&
                    s.url.match(t) &&
                    'complete' == s.status &&
                    ((o = !0), (e.active = !0), chrome.tabs.update(s.id, e), n.focusWindow(s.id));
                }
                setTimeout(function () {
                  o || chrome.tabs.create(e);
                }, 0);
              })
            : chrome.tabs.create(e);
        };
        focusWindow = function (e) {
          chrome.windows.getCurrent(function (t) {
            chrome.windows.update(t.id, { focused: !0 }, function (t) {
              chrome.tabs.update(e, { active: !0 });
            });
          });
        };
        fullScreenMode = function (e) {
          chrome.windows.getCurrent(function (t) {
            chrome.windows.update(t.id, { state: e ? 'fullscreen' : 'maximized' }, function (e) {});
          });
        };
        refreshBrowser = function (e, t, n) {
          chrome.windows.getAll({ populate: !0 }, function (r) {
            var i = !1,
              o = 'https://mail.google.com';
            if (
              (r.forEach(function (r) {
                r.tabs.forEach(function (r) {
                  if ('gmail' === e) {
                    if (!/https:\/\/(mail|inbox)\.google\.com/.test(r.url)) return;
                  } else if ('outlook' === e) {
                    if (
                      ((o = 'https://outlook.office.com'),
                      !/https:\/\/(outlook)\.live\.com/.test(r.url) &&
                        !/https:\/\/mail\.office365\.com/.test(r.url) &&
                        !/https:\/\/outlook\.office\.com/.test(r.url))
                    )
                      return;
                  } else if (!r.url || !r.url.match(e)) return;
                  if ((chrome.tabs.reload(r.id), t && !i))
                    if (n && n.install_or_update && 'install' == n.install_or_update) {
                      var a = o + (n.query_params ? n.query_params : '');
                      chrome.tabs.update(r.id, { url: a, active: !0 });
                    } else chrome.tabs.update(r.id, { active: !0 });
                  i = !0;
                });
              }),
              t && !i)
            )
              if (n && n.install_or_update && 'install' == n.install_or_update) {
                if ('gmail' == e || 'outlook' == e) {
                  var a = o + (n.query_params ? n.query_params : '');
                  chrome.tabs.create({ url: a, active: !0 });
                }
              } else ('gmail' != e && 'outlook' != e) || chrome.tabs.create({ url: o, active: !0 });
          });
        };
        sendRequestToTab = function (e, t, n) {
          var r = this;
          chrome.tabs.sendMessage(e, t, function (i) {
            console.log('fn_send_request_to_tab: response=', i),
              (i && i.success) ||
                (console.log(
                  'fn_send_request_to_tab: runtime.lastError=',
                  chrome.runtime.lastError
                ),
                n < 3 &&
                  setTimeout(function () {
                    r.fn_send_request_to_tab(e, t, n + 1);
                  }, 1e3));
          });
        };
      })();
      new (class {
        fn_fetch_website_content = async function (e) {
          console.log(`fetchWebsiteContent: ENTERING input_url=${e}`);
          var t,
            r = '',
            i = !0;
          e.match(/https:\/\/docs.google.com\/document/) &&
            ((e =
              'https://docs.google.com/document/d/' +
              new URL(e).pathname.replace('/document/d/', '').replace(/\/.*/, '') +
              '/export?format=txt'),
            (i = !1)),
            e.match(/websitescraper/) && (i = !1);
          var o = [e, 'https://websitescraper.cloudhq.workers.dev/scrape?scrapeUrl=' + e];
          for (const e of o) {
            try {
              var a = new Headers();
              if (
                (a.append('Content-Type', 'text/plain; charset=UTF-8'), !(t = await fetch(e, a)).ok)
              )
                throw (
                  (console.log(`fetchWebsiteContent: ERROR: url=${e} statusText=${t.statusText}`),
                  new Error(`Error fetching ${e}: ${t.statusText}`))
                );
              if (((r = await t.text()), i)) {
                const { convert: e } = n(655);
                r = e(r, {
                  baseElements: {
                    selectors: ['.page-title', '.entry-content', '.lt-article__body'],
                  },
                  wordwrap: 200,
                  selectors: [
                    { selector: 'ul', options: { itemPrefix: ' - ' } },
                    { selector: '.st-alert', format: 'skip' },
                    { selector: '.header-bar', format: 'skip' },
                    { selector: '.footer-row', format: 'skip' },
                    { selector: '#dd_site_share', format: 'skip' },
                    { selector: '#dd_site_more', format: 'skip' },
                    { selector: '[style*="font-size:1px"]', format: 'skip' },
                  ],
                });
              }
            } catch (e) {
              console.log(`fetchWebsiteContent: failed to download content. error=${e}`), (r = '');
            }
            if ('' != r) break;
          }
          return console.log(`fetchWebsiteContent: EXITING ret=${r}`), r;
        };
        fn_extract_prompt_context = function (e) {
          return e.match(/^Text: ###/m) && e.match(/^###/m)
            ? /^Text: ###(.*)^###/gms.exec(e)[1]
            : e;
        };
        fn_extract_prompt_instructions = function (e) {
          return e.match(/^Text: ###/m) && e.match(/^###/m) ? /(.*)^Text: *###$/gms.exec(e)[1] : e;
        };
        fn_process_prompt = async function (e) {
          let t, n;
          console.log(`fn_process_prompt: ENTERING input_prompt=${e}`);
          var r = e;
          function i(e) {
            const t = [],
              n = e.split('\n');
            let r = !1;
            for (const e of n)
              if ((e.includes('prompt:start') && (r = !0), r && e.includes('prompt:end'))) r = !1;
              else if (!r) {
                const n = e.match(/\{\{import:[^\}]+\}\}/);
                n && t.push(n[0]);
              }
            return t;
          }
          for (
            t = /^ *prompt:start(.*)prompt:end$/gms, n = t.exec(r), n && n.length > 0 && (r = n[1]);
            ;

          ) {
            var o = i(r),
              a = [];
            for (let e of o) {
              const t = e.match(/\{\{import:([^\}]+)\}\}/)[1];
              console.log('import_keyword=', e, ' url=', t);
              const n = await this.fn_fetch_website_content(t);
              console.log(
                `fn_process_prompt: after fetchWebsiteContent content=${n}\n---\nurl=${t} `
              ),
                a.push({ match: e, content: n });
            }
            r = e;
            for (let e of a)
              console.log('replacement.match=', e.match), (r = r.replace(e.match, e.content));
            if (!t.exec(r)) break;
            e = r;
          }
          const s = r.split('\n'),
            c = [];
          let l = !1;
          for (const e of s)
            e.includes('prompt:start') ? (l = !0) : l && e.includes('prompt:end') && (l = !1),
              (!l && e.match(/^\s+<\-\-\-/)) || c.push(e);
          return (
            (r = c.join('\n')), console.log(`fn_process_prompt: EXITING output_prompt=${r}`), r
          );
        };
        fn_get_dalle_image = function (e, t) {
          return new Promise(function (n, r) {
            fetch(e, { headers: { Authorization: 'Bearer ' + t } }).then(function (e) {
              e && e.ok
                ? e.json().then(function (e) {
                    n(e);
                  })
                : n(null);
            });
          });
        };
        fn_process_image_data = function (e) {
          if (
            e.content_type &&
            'multimodal_text' == e.content_type &&
            e.parts &&
            'object' == typeof e.parts &&
            e.parts.length > 0
          )
            for (var t = 0; t < e.parts.length; t += 1) {
              var n = e.parts[t];
              if ('image_asset_pointer' == n.content_type && n.asset_pointer)
                return (
                  n.metadata.dalle.prompt,
                  'https://chatgpt.com/backend-api/files/' +
                    n.asset_pointer.replace('file-service://', '') +
                    '/download'
                );
            }
          return null;
        };
        fn_replace_metadata_urls = function (e, t) {
          function n(e) {
            var t,
              n = '' + e,
              r = /["'&<>]/.exec(n);
            if (!r) return n;
            var i = '',
              o = 0,
              a = 0;
            for (o = r.index; o < n.length; o++) {
              switch (n.charCodeAt(o)) {
                case 34:
                  t = '&quot;';
                  break;
                case 38:
                  t = '&amp;';
                  break;
                case 39:
                  t = '&#39;';
                  break;
                case 60:
                  t = '&lt;';
                  break;
                case 62:
                  t = '&gt;';
                  break;
                default:
                  continue;
              }
              a !== o && (i += n.substring(a, o)), (a = o + 1), (i += t);
            }
            return a !== o ? i + n.substring(a, o) : i;
          }
          if (-1 == e.indexOf('【')) return e;
          if (!t) return e;
          if (!t.citations) return e;
          for (var r = t.citations, i = [], o = 0; o < r.length; o += 1)
            if (r[o].metadata) {
              var a = r[o].metadata;
              if (a.extra && a.extra.cited_message_idx && a.extra.cited_message_idx >= 0) {
                var s = a.extra.cited_message_idx,
                  c = ' <a href="' + n(a.url) + '" target="_blank">[' + (o + 1) + ']</a> ';
                (e = e.replace('【' + s + '†source】', c)),
                  i.push(
                    '<li><a href="' +
                      n(a.url) +
                      '" target="_blank">' +
                      n(a.title || 'Source') +
                      '</a></li>'
                  );
              }
            }
          return i.length && (e = e + '<br/><p>Source:</p><ul>' + i.join('') + '</ul>'), e;
        };
      })();
      var i = [],
        o = {};
      chrome.runtime.onMessage.addListener(function (e, t, n) {
        if (e && 'PROXY_AJAX' == e.what) {
          var i = e.payload;
          if (!i.url || !i.url.startsWith('https://www.cloudhq.net/'))
            return void n({ what: 'error', payload: 'Invalid request' });
          try {
            (i.success = function (e) {
              n({ what: 'success', payload: e, status: 200 });
            }),
              (i.error = function (e) {
                console.log('out_request:error:out_request:', i),
                  console.log('out_request:error:data:', e),
                  n({ what: 'error', payload: e, status: 200 });
              }),
              r.ajaxRequest(i);
          } catch (e) {
            n({ what: 'error', payload: e });
          }
          return !0;
        }
      }),
        chrome.runtime.onConnect.addListener(function (e) {
          console.log('gmail_bulk_forward: gmail_port=', e);
          var t = e.name;
          t && (o[t] = { gmail_port: e }),
            e.onMessage.addListener(function (t) {
              if ((console.log('MESSAGE', t), 'CHQ_REGISTER_USER_ID' === t.type))
                -1 == i.indexOf(t.user_id) && i.push(t.user_id);
              else if ('CHQ_REFRESH_WINDOW' === t.type) r.refreshBrowser(t.target, !1);
              else if ('CHQ_FOCUS_WINDOW' === t.type) r.focusWindow(e.sender.tab.id);
              else if ('CHQ_CREATE_TAB' === t.type) r.openOrFocusTab(t.tab, t.match_url);
              else if ('CHQ_OPEN_POPUP_IFRAME' === t.type) {
                var n = t.port_name,
                  a = t.url,
                  s = 0,
                  c = 0,
                  l = 800,
                  u = 800;
                t.options &&
                  (t.options.left && (s = t.options.left),
                  t.options.top && (c = t.options.top),
                  t.options.width && (l = t.options.width),
                  t.options.height && (u = t.options.height)),
                  (o[n] = { gmail_port: e, url: a }),
                  chrome.windows.create({
                    url: a,
                    type: 'popup',
                    focused: !0,
                    left: s,
                    top: c,
                    width: l,
                    height: u,
                  });
              } else {
                let n = o[e.name];
                if (n && n.popup_port) {
                  let r = n.popup_port;
                  console.log(
                    'gmail_campaigns: forward message gmail_port=',
                    e,
                    ' popup_port=',
                    r,
                    ' msg=',
                    t
                  ),
                    r.postMessage(t);
                }
              }
            }),
            e.onDisconnect.addListener(function (e) {
              let n = o[e.name];
              if (n) {
                var r = o[t].window_id;
                try {
                  chrome.windows.remove(r, function () {});
                } catch (e) {}
                (o[e.name] = null),
                  n.popup_port && n.popup_port.postMessage({ type: 'CHQ_GMAIL_CLOSE' });
              }
            });
        }),
        chrome.runtime.onInstalled.addListener(function (e) {
          ('install' !== e.reason && 'update' !== e.reason) ||
            ('install' === e.reason &&
              r.refreshBrowser('gmail', !0, {
                install_or_update: e.reason,
                query_params: '?from_extension=gmail_bulk_forward',
              }),
            'update' === e.reason && r.refreshBrowser('gmail', !1, { install_or_update: e.reason }),
            r.refreshBrowser('gmail', !0, { install_or_update: e.reason }),
            chrome.permissions.contains({ permissions: ['storage'] }, function (e) {
              if (e) {
                let e = new Date().getTime();
                chrome.storage.sync.get('install_timestamp', function (t) {
                  if (t) e = t;
                  else
                    try {
                      let t = { install_timestamp: e };
                      chrome.storage.sync.set(t, function () {});
                    } catch (e) {}
                });
              } else alert('storage permissions missing');
            }));
        }),
        chrome.runtime.setUninstallURL(
          'https://www.cloudhq.net/uninstall_chrome_extension?product_what=gmail_bulk_forward'
        );
    })();
})();
