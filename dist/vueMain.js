'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
var e = require('vscode'),
  t = require('fs'),
  n = require('path'),
  i = require('child_process'),
  r = require('util'),
  o = require('os'),
  s = require('crypto'),
  a = require('net');
function c(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
function l(e) {
  if (e && e.__esModule) return e;
  var t = Object.create(null);
  return (
    e &&
      Object.keys(e).forEach(function (n) {
        if ('default' !== n) {
          var i = Object.getOwnPropertyDescriptor(e, n);
          Object.defineProperty(
            t,
            n,
            i.get
              ? i
              : {
                  enumerable: !0,
                  get: function () {
                    return e[n];
                  }
                }
          );
        }
      }),
    (t.default = e),
    Object.freeze(t)
  );
}
var u = c(e),
  d = c(t),
  h = l(t),
  p = c(n),
  f = c(i),
  g = c(r),
  m = c(o),
  v = c(s),
  y = c(a);
const C = {
  html: 'text.html.basic',
  pug: 'text.pug',
  haml: 'text.haml',
  slim: 'text.slim',
  css: 'source.css',
  scss: 'source.css.scss',
  less: 'source.css.less',
  postcss: 'source.css.postcss',
  sss: 'source.css.sugarss',
  sass: 'source.sass',
  stylus: 'source.stylus',
  js: 'source.js',
  ts: 'source.ts',
  coffee: 'source.coffee',
  md: 'text.html.markdown',
  yaml: 'source.yaml',
  json: 'source.json',
  php: 'source.php',
  graphql: 'source.graphql',
  liquid: 'text.html.liquid',
  xml: 'text.xml'
};
function R(e, t) {
  return JSON.parse(
    `\n  {\n    "begin": "(<)(${e})",\n    "beginCaptures": {\n        "1": {\n            "name": "punctuation.definition.tag.begin.html"\n        },\n        "2": {\n            "name": "entity.name.tag.style.html"\n        }\n    },\n    "end": "(</)(${e})(>)",\n    "endCaptures": {\n        "1": {\n            "name": "punctuation.definition.tag.begin.html"\n        },\n        "2": {\n            "name": "entity.name.tag.style.html"\n        },\n        "3": {\n            "name": "punctuation.definition.tag.end.html"\n        }\n    },\n    "patterns": [\n        {\n            "include": "#tag-stuff"\n        },\n        {\n            "begin": "(>)",\n            "beginCaptures": {\n                "1": {\n                    "name": "punctuation.definition.tag.end.html"\n                }\n            },\n            "end": "(?=</${e}>)",\n            "contentName": "${t}",\n            "patterns": [\n                {\n                    "include": "${t}"\n                }\n            ]\n        }\n    ]\n  }\n  `
  );
}
function w(e) {
  return () => {
    try {
      const i = u.default.workspace.getConfiguration().get('vetur.grammar.customBlocks') || {},
        r = (function (e, n) {
          const i = JSON.parse(t.readFileSync(e, 'utf-8'));
          for (const e in n) {
            const t = n[e];
            if (!C[t]) throw `The language for custom block <${e}> is invalid`;
            i.patterns.unshift(R(e, C[t]));
          }
          return JSON.stringify(i, null, 2);
        })(n.resolve(e, 'syntaxes/vue.tmLanguage.json'), i);
      t.writeFileSync(n.resolve(e, 'syntaxes/vue-generated.json'), r, 'utf-8'),
        u.default.window.showInformationMessage('Successfully generated vue grammar. Reload VS Code to enable it.');
    } catch (e) {
      console.error(e.stack),
        u.default.window.showErrorMessage(
          'Failed to generate vue grammar. `vetur.grammar.customBlocks` contain invalid language values'
        );
    }
  };
}
const T = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];
var b =
  'undefined' != typeof globalThis
    ? globalThis
    : 'undefined' != typeof window
    ? window
    : 'undefined' != typeof global
    ? global
    : 'undefined' != typeof self
    ? self
    : {};
function S(e) {
  if (e.__esModule) return e;
  var t = Object.defineProperty({}, '__esModule', { value: !0 });
  return (
    Object.keys(e).forEach(function (n) {
      var i = Object.getOwnPropertyDescriptor(e, n);
      Object.defineProperty(
        t,
        n,
        i.get
          ? i
          : {
              enumerable: !0,
              get: function () {
                return e[n];
              }
            }
      );
    }),
    t
  );
}
function _(e) {
  var t = { exports: {} };
  return e(t, t.exports), t.exports;
}
var D = {
  SEMVER_SPEC_VERSION: '2.0.0',
  MAX_LENGTH: 256,
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991,
  MAX_SAFE_COMPONENT_LENGTH: 16
};
var P =
    'object' == typeof process && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)
      ? (...e) => console.error('SEMVER', ...e)
      : () => {},
  E = _(function (e, t) {
    const { MAX_SAFE_COMPONENT_LENGTH: n } = D,
      i = ((t = e.exports = {}).re = []),
      r = (t.src = []),
      o = (t.t = {});
    let s = 0;
    const a = (e, t, n) => {
      const a = s++;
      P(a, t), (o[e] = a), (r[a] = t), (i[a] = new RegExp(t, n ? 'g' : void 0));
    };
    a('NUMERICIDENTIFIER', '0|[1-9]\\d*'),
      a('NUMERICIDENTIFIERLOOSE', '[0-9]+'),
      a('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*'),
      a('MAINVERSION', `(${r[o.NUMERICIDENTIFIER]})\\.(${r[o.NUMERICIDENTIFIER]})\\.(${r[o.NUMERICIDENTIFIER]})`),
      a(
        'MAINVERSIONLOOSE',
        `(${r[o.NUMERICIDENTIFIERLOOSE]})\\.(${r[o.NUMERICIDENTIFIERLOOSE]})\\.(${r[o.NUMERICIDENTIFIERLOOSE]})`
      ),
      a('PRERELEASEIDENTIFIER', `(?:${r[o.NUMERICIDENTIFIER]}|${r[o.NONNUMERICIDENTIFIER]})`),
      a('PRERELEASEIDENTIFIERLOOSE', `(?:${r[o.NUMERICIDENTIFIERLOOSE]}|${r[o.NONNUMERICIDENTIFIER]})`),
      a('PRERELEASE', `(?:-(${r[o.PRERELEASEIDENTIFIER]}(?:\\.${r[o.PRERELEASEIDENTIFIER]})*))`),
      a('PRERELEASELOOSE', `(?:-?(${r[o.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${r[o.PRERELEASEIDENTIFIERLOOSE]})*))`),
      a('BUILDIDENTIFIER', '[0-9A-Za-z-]+'),
      a('BUILD', `(?:\\+(${r[o.BUILDIDENTIFIER]}(?:\\.${r[o.BUILDIDENTIFIER]})*))`),
      a('FULLPLAIN', `v?${r[o.MAINVERSION]}${r[o.PRERELEASE]}?${r[o.BUILD]}?`),
      a('FULL', `^${r[o.FULLPLAIN]}$`),
      a('LOOSEPLAIN', `[v=\\s]*${r[o.MAINVERSIONLOOSE]}${r[o.PRERELEASELOOSE]}?${r[o.BUILD]}?`),
      a('LOOSE', `^${r[o.LOOSEPLAIN]}$`),
      a('GTLT', '((?:<|>)?=?)'),
      a('XRANGEIDENTIFIERLOOSE', r[o.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'),
      a('XRANGEIDENTIFIER', r[o.NUMERICIDENTIFIER] + '|x|X|\\*'),
      a(
        'XRANGEPLAIN',
        `[v=\\s]*(${r[o.XRANGEIDENTIFIER]})(?:\\.(${r[o.XRANGEIDENTIFIER]})(?:\\.(${r[o.XRANGEIDENTIFIER]})(?:${
          r[o.PRERELEASE]
        })?${r[o.BUILD]}?)?)?`
      ),
      a(
        'XRANGEPLAINLOOSE',
        `[v=\\s]*(${r[o.XRANGEIDENTIFIERLOOSE]})(?:\\.(${r[o.XRANGEIDENTIFIERLOOSE]})(?:\\.(${
          r[o.XRANGEIDENTIFIERLOOSE]
        })(?:${r[o.PRERELEASELOOSE]})?${r[o.BUILD]}?)?)?`
      ),
      a('XRANGE', `^${r[o.GTLT]}\\s*${r[o.XRANGEPLAIN]}$`),
      a('XRANGELOOSE', `^${r[o.GTLT]}\\s*${r[o.XRANGEPLAINLOOSE]}$`),
      a('COERCE', `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?(?:$|[^\\d])`),
      a('COERCERTL', r[o.COERCE], !0),
      a('LONETILDE', '(?:~>?)'),
      a('TILDETRIM', `(\\s*)${r[o.LONETILDE]}\\s+`, !0),
      (t.tildeTrimReplace = '$1~'),
      a('TILDE', `^${r[o.LONETILDE]}${r[o.XRANGEPLAIN]}$`),
      a('TILDELOOSE', `^${r[o.LONETILDE]}${r[o.XRANGEPLAINLOOSE]}$`),
      a('LONECARET', '(?:\\^)'),
      a('CARETTRIM', `(\\s*)${r[o.LONECARET]}\\s+`, !0),
      (t.caretTrimReplace = '$1^'),
      a('CARET', `^${r[o.LONECARET]}${r[o.XRANGEPLAIN]}$`),
      a('CARETLOOSE', `^${r[o.LONECARET]}${r[o.XRANGEPLAINLOOSE]}$`),
      a('COMPARATORLOOSE', `^${r[o.GTLT]}\\s*(${r[o.LOOSEPLAIN]})$|^$`),
      a('COMPARATOR', `^${r[o.GTLT]}\\s*(${r[o.FULLPLAIN]})$|^$`),
      a('COMPARATORTRIM', `(\\s*)${r[o.GTLT]}\\s*(${r[o.LOOSEPLAIN]}|${r[o.XRANGEPLAIN]})`, !0),
      (t.comparatorTrimReplace = '$1$2$3'),
      a('HYPHENRANGE', `^\\s*(${r[o.XRANGEPLAIN]})\\s+-\\s+(${r[o.XRANGEPLAIN]})\\s*$`),
      a('HYPHENRANGELOOSE', `^\\s*(${r[o.XRANGEPLAINLOOSE]})\\s+-\\s+(${r[o.XRANGEPLAINLOOSE]})\\s*$`),
      a('STAR', '(<|>)?=?\\s*\\*'),
      a('GTE0', '^\\s*>=\\s*0.0.0\\s*$'),
      a('GTE0PRE', '^\\s*>=\\s*0.0.0-0\\s*$');
  });
const x = ['includePrerelease', 'loose', 'rtl'];
var k = e =>
  e ? ('object' != typeof e ? { loose: !0 } : x.filter(t => e[t]).reduce((e, t) => ((e[t] = !0), e), {})) : {};
const O = /^[0-9]+$/,
  F = (e, t) => {
    const n = O.test(e),
      i = O.test(t);
    return n && i && ((e = +e), (t = +t)), e === t ? 0 : n && !i ? -1 : i && !n ? 1 : e < t ? -1 : 1;
  };
var q = { compareIdentifiers: F, rcompareIdentifiers: (e, t) => F(t, e) };
const { MAX_LENGTH: N, MAX_SAFE_INTEGER: I } = D,
  { re: M, t: L } = E,
  { compareIdentifiers: A } = q;
class j {
  constructor(e, t) {
    if (((t = k(t)), e instanceof j)) {
      if (e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease) return e;
      e = e.version;
    } else if ('string' != typeof e) throw new TypeError('Invalid Version: ' + e);
    if (e.length > N) throw new TypeError(`version is longer than ${N} characters`);
    P('SemVer', e, t), (this.options = t), (this.loose = !!t.loose), (this.includePrerelease = !!t.includePrerelease);
    const n = e.trim().match(t.loose ? M[L.LOOSE] : M[L.FULL]);
    if (!n) throw new TypeError('Invalid Version: ' + e);
    if (
      ((this.raw = e),
      (this.major = +n[1]),
      (this.minor = +n[2]),
      (this.patch = +n[3]),
      this.major > I || this.major < 0)
    )
      throw new TypeError('Invalid major version');
    if (this.minor > I || this.minor < 0) throw new TypeError('Invalid minor version');
    if (this.patch > I || this.patch < 0) throw new TypeError('Invalid patch version');
    n[4]
      ? (this.prerelease = n[4].split('.').map(e => {
          if (/^[0-9]+$/.test(e)) {
            const t = +e;
            if (t >= 0 && t < I) return t;
          }
          return e;
        }))
      : (this.prerelease = []),
      (this.build = n[5] ? n[5].split('.') : []),
      this.format();
  }
  format() {
    return (
      (this.version = `${this.major}.${this.minor}.${this.patch}`),
      this.prerelease.length && (this.version += '-' + this.prerelease.join('.')),
      this.version
    );
  }
  toString() {
    return this.version;
  }
  compare(e) {
    if ((P('SemVer.compare', this.version, this.options, e), !(e instanceof j))) {
      if ('string' == typeof e && e === this.version) return 0;
      e = new j(e, this.options);
    }
    return e.version === this.version ? 0 : this.compareMain(e) || this.comparePre(e);
  }
  compareMain(e) {
    return (
      e instanceof j || (e = new j(e, this.options)),
      A(this.major, e.major) || A(this.minor, e.minor) || A(this.patch, e.patch)
    );
  }
  comparePre(e) {
    if ((e instanceof j || (e = new j(e, this.options)), this.prerelease.length && !e.prerelease.length)) return -1;
    if (!this.prerelease.length && e.prerelease.length) return 1;
    if (!this.prerelease.length && !e.prerelease.length) return 0;
    let t = 0;
    do {
      const n = this.prerelease[t],
        i = e.prerelease[t];
      if ((P('prerelease compare', t, n, i), void 0 === n && void 0 === i)) return 0;
      if (void 0 === i) return 1;
      if (void 0 === n) return -1;
      if (n !== i) return A(n, i);
    } while (++t);
  }
  compareBuild(e) {
    e instanceof j || (e = new j(e, this.options));
    let t = 0;
    do {
      const n = this.build[t],
        i = e.build[t];
      if ((P('prerelease compare', t, n, i), void 0 === n && void 0 === i)) return 0;
      if (void 0 === i) return 1;
      if (void 0 === n) return -1;
      if (n !== i) return A(n, i);
    } while (++t);
  }
  inc(e, t) {
    switch (e) {
      case 'premajor':
        (this.prerelease.length = 0), (this.patch = 0), (this.minor = 0), this.major++, this.inc('pre', t);
        break;
      case 'preminor':
        (this.prerelease.length = 0), (this.patch = 0), this.minor++, this.inc('pre', t);
        break;
      case 'prepatch':
        (this.prerelease.length = 0), this.inc('patch', t), this.inc('pre', t);
        break;
      case 'prerelease':
        0 === this.prerelease.length && this.inc('patch', t), this.inc('pre', t);
        break;
      case 'major':
        (0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length) || this.major++,
          (this.minor = 0),
          (this.patch = 0),
          (this.prerelease = []);
        break;
      case 'minor':
        (0 === this.patch && 0 !== this.prerelease.length) || this.minor++, (this.patch = 0), (this.prerelease = []);
        break;
      case 'patch':
        0 === this.prerelease.length && this.patch++, (this.prerelease = []);
        break;
      case 'pre':
        if (0 === this.prerelease.length) this.prerelease = [0];
        else {
          let e = this.prerelease.length;
          for (; --e >= 0; ) 'number' == typeof this.prerelease[e] && (this.prerelease[e]++, (e = -2));
          -1 === e && this.prerelease.push(0);
        }
        t &&
          (this.prerelease[0] === t
            ? isNaN(this.prerelease[1]) && (this.prerelease = [t, 0])
            : (this.prerelease = [t, 0]));
        break;
      default:
        throw new Error('invalid increment argument: ' + e);
    }
    return this.format(), (this.raw = this.version), this;
  }
}
var $ = j;
const { MAX_LENGTH: W } = D,
  { re: K, t: H } = E;
var U = (e, t) => {
  if (((t = k(t)), e instanceof $)) return e;
  if ('string' != typeof e) return null;
  if (e.length > W) return null;
  if (!(t.loose ? K[H.LOOSE] : K[H.FULL]).test(e)) return null;
  try {
    return new $(e, t);
  } catch (e) {
    return null;
  }
};
var z = (e, t) => {
  const n = U(e, t);
  return n ? n.version : null;
};
var V = (e, t) => {
  const n = U(e.trim().replace(/^[=v]+/, ''), t);
  return n ? n.version : null;
};
var B = (e, t, n, i) => {
  'string' == typeof n && ((i = n), (n = void 0));
  try {
    return new $(e, n).inc(t, i).version;
  } catch (e) {
    return null;
  }
};
var G = (e, t, n) => new $(e, n).compare(new $(t, n));
var X = (e, t, n) => 0 === G(e, t, n);
var J = (e, t) => {
  if (X(e, t)) return null;
  {
    const n = U(e),
      i = U(t),
      r = n.prerelease.length || i.prerelease.length,
      o = r ? 'pre' : '',
      s = r ? 'prerelease' : '';
    for (const e in n) if (('major' === e || 'minor' === e || 'patch' === e) && n[e] !== i[e]) return o + e;
    return s;
  }
};
var Y = (e, t) => new $(e, t).major;
var Z = (e, t) => new $(e, t).minor;
var Q = (e, t) => new $(e, t).patch;
var ee = (e, t) => {
  const n = U(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var te = (e, t, n) => G(t, e, n);
var ne = (e, t) => G(e, t, !0);
var ie = (e, t, n) => {
  const i = new $(e, n),
    r = new $(t, n);
  return i.compare(r) || i.compareBuild(r);
};
var re = (e, t) => e.sort((e, n) => ie(e, n, t));
var oe = (e, t) => e.sort((e, n) => ie(n, e, t));
var se = (e, t, n) => G(e, t, n) > 0;
var ae = (e, t, n) => G(e, t, n) < 0;
var ce = (e, t, n) => 0 !== G(e, t, n);
var le = (e, t, n) => G(e, t, n) >= 0;
var ue = (e, t, n) => G(e, t, n) <= 0;
var de = (e, t, n, i) => {
  switch (t) {
    case '===':
      return 'object' == typeof e && (e = e.version), 'object' == typeof n && (n = n.version), e === n;
    case '!==':
      return 'object' == typeof e && (e = e.version), 'object' == typeof n && (n = n.version), e !== n;
    case '':
    case '=':
    case '==':
      return X(e, n, i);
    case '!=':
      return ce(e, n, i);
    case '>':
      return se(e, n, i);
    case '>=':
      return le(e, n, i);
    case '<':
      return ae(e, n, i);
    case '<=':
      return ue(e, n, i);
    default:
      throw new TypeError('Invalid operator: ' + t);
  }
};
const { re: he, t: pe } = E;
var fe = (e, t) => {
    if (e instanceof $) return e;
    if (('number' == typeof e && (e = String(e)), 'string' != typeof e)) return null;
    let n = null;
    if ((t = t || {}).rtl) {
      let t;
      for (; (t = he[pe.COERCERTL].exec(e)) && (!n || n.index + n[0].length !== e.length); )
        (n && t.index + t[0].length === n.index + n[0].length) || (n = t),
          (he[pe.COERCERTL].lastIndex = t.index + t[1].length + t[2].length);
      he[pe.COERCERTL].lastIndex = -1;
    } else n = e.match(he[pe.COERCE]);
    return null === n ? null : U(`${n[2]}.${n[3] || '0'}.${n[4] || '0'}`, t);
  },
  ge = me;
function me(e) {
  var t = this;
  if (
    (t instanceof me || (t = new me()),
    (t.tail = null),
    (t.head = null),
    (t.length = 0),
    e && 'function' == typeof e.forEach)
  )
    e.forEach(function (e) {
      t.push(e);
    });
  else if (arguments.length > 0) for (var n = 0, i = arguments.length; n < i; n++) t.push(arguments[n]);
  return t;
}
function ve(e, t, n) {
  var i = t === e.head ? new Re(n, null, t, e) : new Re(n, t, t.next, e);
  return null === i.next && (e.tail = i), null === i.prev && (e.head = i), e.length++, i;
}
function ye(e, t) {
  (e.tail = new Re(t, e.tail, null, e)), e.head || (e.head = e.tail), e.length++;
}
function Ce(e, t) {
  (e.head = new Re(t, null, e.head, e)), e.tail || (e.tail = e.head), e.length++;
}
function Re(e, t, n, i) {
  if (!(this instanceof Re)) return new Re(e, t, n, i);
  (this.list = i),
    (this.value = e),
    t ? ((t.next = this), (this.prev = t)) : (this.prev = null),
    n ? ((n.prev = this), (this.next = n)) : (this.next = null);
}
(me.Node = Re),
  (me.create = me),
  (me.prototype.removeNode = function (e) {
    if (e.list !== this) throw new Error('removing node which does not belong to this list');
    var t = e.next,
      n = e.prev;
    return (
      t && (t.prev = n),
      n && (n.next = t),
      e === this.head && (this.head = t),
      e === this.tail && (this.tail = n),
      e.list.length--,
      (e.next = null),
      (e.prev = null),
      (e.list = null),
      t
    );
  }),
  (me.prototype.unshiftNode = function (e) {
    if (e !== this.head) {
      e.list && e.list.removeNode(e);
      var t = this.head;
      (e.list = this), (e.next = t), t && (t.prev = e), (this.head = e), this.tail || (this.tail = e), this.length++;
    }
  }),
  (me.prototype.pushNode = function (e) {
    if (e !== this.tail) {
      e.list && e.list.removeNode(e);
      var t = this.tail;
      (e.list = this), (e.prev = t), t && (t.next = e), (this.tail = e), this.head || (this.head = e), this.length++;
    }
  }),
  (me.prototype.push = function () {
    for (var e = 0, t = arguments.length; e < t; e++) ye(this, arguments[e]);
    return this.length;
  }),
  (me.prototype.unshift = function () {
    for (var e = 0, t = arguments.length; e < t; e++) Ce(this, arguments[e]);
    return this.length;
  }),
  (me.prototype.pop = function () {
    if (this.tail) {
      var e = this.tail.value;
      return (this.tail = this.tail.prev), this.tail ? (this.tail.next = null) : (this.head = null), this.length--, e;
    }
  }),
  (me.prototype.shift = function () {
    if (this.head) {
      var e = this.head.value;
      return (this.head = this.head.next), this.head ? (this.head.prev = null) : (this.tail = null), this.length--, e;
    }
  }),
  (me.prototype.forEach = function (e, t) {
    t = t || this;
    for (var n = this.head, i = 0; null !== n; i++) e.call(t, n.value, i, this), (n = n.next);
  }),
  (me.prototype.forEachReverse = function (e, t) {
    t = t || this;
    for (var n = this.tail, i = this.length - 1; null !== n; i--) e.call(t, n.value, i, this), (n = n.prev);
  }),
  (me.prototype.get = function (e) {
    for (var t = 0, n = this.head; null !== n && t < e; t++) n = n.next;
    if (t === e && null !== n) return n.value;
  }),
  (me.prototype.getReverse = function (e) {
    for (var t = 0, n = this.tail; null !== n && t < e; t++) n = n.prev;
    if (t === e && null !== n) return n.value;
  }),
  (me.prototype.map = function (e, t) {
    t = t || this;
    for (var n = new me(), i = this.head; null !== i; ) n.push(e.call(t, i.value, this)), (i = i.next);
    return n;
  }),
  (me.prototype.mapReverse = function (e, t) {
    t = t || this;
    for (var n = new me(), i = this.tail; null !== i; ) n.push(e.call(t, i.value, this)), (i = i.prev);
    return n;
  }),
  (me.prototype.reduce = function (e, t) {
    var n,
      i = this.head;
    if (arguments.length > 1) n = t;
    else {
      if (!this.head) throw new TypeError('Reduce of empty list with no initial value');
      (i = this.head.next), (n = this.head.value);
    }
    for (var r = 0; null !== i; r++) (n = e(n, i.value, r)), (i = i.next);
    return n;
  }),
  (me.prototype.reduceReverse = function (e, t) {
    var n,
      i = this.tail;
    if (arguments.length > 1) n = t;
    else {
      if (!this.tail) throw new TypeError('Reduce of empty list with no initial value');
      (i = this.tail.prev), (n = this.tail.value);
    }
    for (var r = this.length - 1; null !== i; r--) (n = e(n, i.value, r)), (i = i.prev);
    return n;
  }),
  (me.prototype.toArray = function () {
    for (var e = new Array(this.length), t = 0, n = this.head; null !== n; t++) (e[t] = n.value), (n = n.next);
    return e;
  }),
  (me.prototype.toArrayReverse = function () {
    for (var e = new Array(this.length), t = 0, n = this.tail; null !== n; t++) (e[t] = n.value), (n = n.prev);
    return e;
  }),
  (me.prototype.slice = function (e, t) {
    (t = t || this.length) < 0 && (t += this.length), (e = e || 0) < 0 && (e += this.length);
    var n = new me();
    if (t < e || t < 0) return n;
    e < 0 && (e = 0), t > this.length && (t = this.length);
    for (var i = 0, r = this.head; null !== r && i < e; i++) r = r.next;
    for (; null !== r && i < t; i++, r = r.next) n.push(r.value);
    return n;
  }),
  (me.prototype.sliceReverse = function (e, t) {
    (t = t || this.length) < 0 && (t += this.length), (e = e || 0) < 0 && (e += this.length);
    var n = new me();
    if (t < e || t < 0) return n;
    e < 0 && (e = 0), t > this.length && (t = this.length);
    for (var i = this.length, r = this.tail; null !== r && i > t; i--) r = r.prev;
    for (; null !== r && i > e; i--, r = r.prev) n.push(r.value);
    return n;
  }),
  (me.prototype.splice = function (e, t, ...n) {
    e > this.length && (e = this.length - 1), e < 0 && (e = this.length + e);
    for (var i = 0, r = this.head; null !== r && i < e; i++) r = r.next;
    var o = [];
    for (i = 0; r && i < t; i++) o.push(r.value), (r = this.removeNode(r));
    null === r && (r = this.tail), r !== this.head && r !== this.tail && (r = r.prev);
    for (i = 0; i < n.length; i++) r = ve(this, r, n[i]);
    return o;
  }),
  (me.prototype.reverse = function () {
    for (var e = this.head, t = this.tail, n = e; null !== n; n = n.prev) {
      var i = n.prev;
      (n.prev = n.next), (n.next = i);
    }
    return (this.head = t), (this.tail = e), this;
  });
try {
  !(function (e) {
    e.prototype[Symbol.iterator] = function* () {
      for (let e = this.head; e; e = e.next) yield e.value;
    };
  })(me);
} catch (e) {}
const we = Symbol('max'),
  Te = Symbol('length'),
  be = Symbol('lengthCalculator'),
  Se = Symbol('allowStale'),
  _e = Symbol('maxAge'),
  De = Symbol('dispose'),
  Pe = Symbol('noDisposeOnSet'),
  Ee = Symbol('lruList'),
  xe = Symbol('cache'),
  ke = Symbol('updateAgeOnGet'),
  Oe = () => 1;
const Fe = (e, t, n) => {
    const i = e[xe].get(t);
    if (i) {
      const t = i.value;
      if (qe(e, t)) {
        if ((Ie(e, i), !e[Se])) return;
      } else n && (e[ke] && (i.value.now = Date.now()), e[Ee].unshiftNode(i));
      return t.value;
    }
  },
  qe = (e, t) => {
    if (!t || (!t.maxAge && !e[_e])) return !1;
    const n = Date.now() - t.now;
    return t.maxAge ? n > t.maxAge : e[_e] && n > e[_e];
  },
  Ne = e => {
    if (e[Te] > e[we])
      for (let t = e[Ee].tail; e[Te] > e[we] && null !== t; ) {
        const n = t.prev;
        Ie(e, t), (t = n);
      }
  },
  Ie = (e, t) => {
    if (t) {
      const n = t.value;
      e[De] && e[De](n.key, n.value), (e[Te] -= n.length), e[xe].delete(n.key), e[Ee].removeNode(t);
    }
  };
class Me {
  constructor(e, t, n, i, r) {
    (this.key = e), (this.value = t), (this.length = n), (this.now = i), (this.maxAge = r || 0);
  }
}
const Le = (e, t, n, i) => {
  let r = n.value;
  qe(e, r) && (Ie(e, n), e[Se] || (r = void 0)), r && t.call(i, r.value, r.key, e);
};
var Ae = class {
  constructor(e) {
    if (('number' == typeof e && (e = { max: e }), e || (e = {}), e.max && ('number' != typeof e.max || e.max < 0)))
      throw new TypeError('max must be a non-negative number');
    this[we] = e.max || 1 / 0;
    const t = e.length || Oe;
    if (
      ((this[be] = 'function' != typeof t ? Oe : t),
      (this[Se] = e.stale || !1),
      e.maxAge && 'number' != typeof e.maxAge)
    )
      throw new TypeError('maxAge must be a number');
    (this[_e] = e.maxAge || 0),
      (this[De] = e.dispose),
      (this[Pe] = e.noDisposeOnSet || !1),
      (this[ke] = e.updateAgeOnGet || !1),
      this.reset();
  }
  set max(e) {
    if ('number' != typeof e || e < 0) throw new TypeError('max must be a non-negative number');
    (this[we] = e || 1 / 0), Ne(this);
  }
  get max() {
    return this[we];
  }
  set allowStale(e) {
    this[Se] = !!e;
  }
  get allowStale() {
    return this[Se];
  }
  set maxAge(e) {
    if ('number' != typeof e) throw new TypeError('maxAge must be a non-negative number');
    (this[_e] = e), Ne(this);
  }
  get maxAge() {
    return this[_e];
  }
  set lengthCalculator(e) {
    'function' != typeof e && (e = Oe),
      e !== this[be] &&
        ((this[be] = e),
        (this[Te] = 0),
        this[Ee].forEach(e => {
          (e.length = this[be](e.value, e.key)), (this[Te] += e.length);
        })),
      Ne(this);
  }
  get lengthCalculator() {
    return this[be];
  }
  get length() {
    return this[Te];
  }
  get itemCount() {
    return this[Ee].length;
  }
  rforEach(e, t) {
    t = t || this;
    for (let n = this[Ee].tail; null !== n; ) {
      const i = n.prev;
      Le(this, e, n, t), (n = i);
    }
  }
  forEach(e, t) {
    t = t || this;
    for (let n = this[Ee].head; null !== n; ) {
      const i = n.next;
      Le(this, e, n, t), (n = i);
    }
  }
  keys() {
    return this[Ee].toArray().map(e => e.key);
  }
  values() {
    return this[Ee].toArray().map(e => e.value);
  }
  reset() {
    this[De] && this[Ee] && this[Ee].length && this[Ee].forEach(e => this[De](e.key, e.value)),
      (this[xe] = new Map()),
      (this[Ee] = new ge()),
      (this[Te] = 0);
  }
  dump() {
    return this[Ee].map(e => !qe(this, e) && { k: e.key, v: e.value, e: e.now + (e.maxAge || 0) })
      .toArray()
      .filter(e => e);
  }
  dumpLru() {
    return this[Ee];
  }
  set(e, t, n) {
    if ((n = n || this[_e]) && 'number' != typeof n) throw new TypeError('maxAge must be a number');
    const i = n ? Date.now() : 0,
      r = this[be](t, e);
    if (this[xe].has(e)) {
      if (r > this[we]) return Ie(this, this[xe].get(e)), !1;
      const o = this[xe].get(e).value;
      return (
        this[De] && (this[Pe] || this[De](e, o.value)),
        (o.now = i),
        (o.maxAge = n),
        (o.value = t),
        (this[Te] += r - o.length),
        (o.length = r),
        this.get(e),
        Ne(this),
        !0
      );
    }
    const o = new Me(e, t, r, i, n);
    return o.length > this[we]
      ? (this[De] && this[De](e, t), !1)
      : ((this[Te] += o.length), this[Ee].unshift(o), this[xe].set(e, this[Ee].head), Ne(this), !0);
  }
  has(e) {
    if (!this[xe].has(e)) return !1;
    const t = this[xe].get(e).value;
    return !qe(this, t);
  }
  get(e) {
    return Fe(this, e, !0);
  }
  peek(e) {
    return Fe(this, e, !1);
  }
  pop() {
    const e = this[Ee].tail;
    return e ? (Ie(this, e), e.value) : null;
  }
  del(e) {
    Ie(this, this[xe].get(e));
  }
  load(e) {
    this.reset();
    const t = Date.now();
    for (let n = e.length - 1; n >= 0; n--) {
      const i = e[n],
        r = i.e || 0;
      if (0 === r) this.set(i.k, i.v);
      else {
        const e = r - t;
        e > 0 && this.set(i.k, i.v, e);
      }
    }
  }
  prune() {
    this[xe].forEach((e, t) => Fe(this, t, !1));
  }
};
class je {
  constructor(e, t) {
    if (((t = k(t)), e instanceof je))
      return e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease ? e : new je(e.raw, t);
    if (e instanceof ut) return (this.raw = e.value), (this.set = [[e]]), this.format(), this;
    if (
      ((this.options = t),
      (this.loose = !!t.loose),
      (this.includePrerelease = !!t.includePrerelease),
      (this.raw = e),
      (this.set = e
        .split(/\s*\|\|\s*/)
        .map(e => this.parseRange(e.trim()))
        .filter(e => e.length)),
      !this.set.length)
    )
      throw new TypeError('Invalid SemVer Range: ' + e);
    if (this.set.length > 1) {
      const e = this.set[0];
      if (((this.set = this.set.filter(e => !Be(e[0]))), 0 === this.set.length)) this.set = [e];
      else if (this.set.length > 1)
        for (const e of this.set)
          if (1 === e.length && Ge(e[0])) {
            this.set = [e];
            break;
          }
    }
    this.format();
  }
  format() {
    return (
      (this.range = this.set
        .map(e => e.join(' ').trim())
        .join('||')
        .trim()),
      this.range
    );
  }
  toString() {
    return this.range;
  }
  parseRange(e) {
    e = e.trim();
    const t = `parseRange:${Object.keys(this.options).join(',')}:${e}`,
      n = We.get(t);
    if (n) return n;
    const i = this.options.loose,
      r = i ? Ke[He.HYPHENRANGELOOSE] : Ke[He.HYPHENRANGE];
    (e = e.replace(r, st(this.options.includePrerelease))),
      P('hyphen replace', e),
      (e = e.replace(Ke[He.COMPARATORTRIM], Ue)),
      P('comparator trim', e, Ke[He.COMPARATORTRIM]),
      (e = (e = (e = e.replace(Ke[He.TILDETRIM], ze)).replace(Ke[He.CARETTRIM], Ve)).split(/\s+/).join(' '));
    const o = i ? Ke[He.COMPARATORLOOSE] : Ke[He.COMPARATOR],
      s = e
        .split(' ')
        .map(e => Je(e, this.options))
        .join(' ')
        .split(/\s+/)
        .map(e => ot(e, this.options))
        .filter(this.options.loose ? e => !!e.match(o) : () => !0)
        .map(e => new ut(e, this.options));
    s.length;
    const a = new Map();
    for (const e of s) {
      if (Be(e)) return [e];
      a.set(e.value, e);
    }
    a.size > 1 && a.has('') && a.delete('');
    const c = [...a.values()];
    return We.set(t, c), c;
  }
  intersects(e, t) {
    if (!(e instanceof je)) throw new TypeError('a Range is required');
    return this.set.some(n => Xe(n, t) && e.set.some(e => Xe(e, t) && n.every(n => e.every(e => n.intersects(e, t)))));
  }
  test(e) {
    if (!e) return !1;
    if ('string' == typeof e)
      try {
        e = new $(e, this.options);
      } catch (e) {
        return !1;
      }
    for (let t = 0; t < this.set.length; t++) if (at(this.set[t], e, this.options)) return !0;
    return !1;
  }
}
var $e = je;
const We = new Ae({ max: 1e3 }),
  { re: Ke, t: He, comparatorTrimReplace: Ue, tildeTrimReplace: ze, caretTrimReplace: Ve } = E,
  Be = e => '<0.0.0-0' === e.value,
  Ge = e => '' === e.value,
  Xe = (e, t) => {
    let n = !0;
    const i = e.slice();
    let r = i.pop();
    for (; n && i.length; ) (n = i.every(e => r.intersects(e, t))), (r = i.pop());
    return n;
  },
  Je = (e, t) => (
    P('comp', e, t),
    (e = et(e, t)),
    P('caret', e),
    (e = Ze(e, t)),
    P('tildes', e),
    (e = nt(e, t)),
    P('xrange', e),
    (e = rt(e, t)),
    P('stars', e),
    e
  ),
  Ye = e => !e || 'x' === e.toLowerCase() || '*' === e,
  Ze = (e, t) =>
    e
      .trim()
      .split(/\s+/)
      .map(e => Qe(e, t))
      .join(' '),
  Qe = (e, t) => {
    const n = t.loose ? Ke[He.TILDELOOSE] : Ke[He.TILDE];
    return e.replace(n, (t, n, i, r, o) => {
      let s;
      return (
        P('tilde', e, t, n, i, r, o),
        Ye(n)
          ? (s = '')
          : Ye(i)
          ? (s = `>=${n}.0.0 <${+n + 1}.0.0-0`)
          : Ye(r)
          ? (s = `>=${n}.${i}.0 <${n}.${+i + 1}.0-0`)
          : o
          ? (P('replaceTilde pr', o), (s = `>=${n}.${i}.${r}-${o} <${n}.${+i + 1}.0-0`))
          : (s = `>=${n}.${i}.${r} <${n}.${+i + 1}.0-0`),
        P('tilde return', s),
        s
      );
    });
  },
  et = (e, t) =>
    e
      .trim()
      .split(/\s+/)
      .map(e => tt(e, t))
      .join(' '),
  tt = (e, t) => {
    P('caret', e, t);
    const n = t.loose ? Ke[He.CARETLOOSE] : Ke[He.CARET],
      i = t.includePrerelease ? '-0' : '';
    return e.replace(n, (t, n, r, o, s) => {
      let a;
      return (
        P('caret', e, t, n, r, o, s),
        Ye(n)
          ? (a = '')
          : Ye(r)
          ? (a = `>=${n}.0.0${i} <${+n + 1}.0.0-0`)
          : Ye(o)
          ? (a = '0' === n ? `>=${n}.${r}.0${i} <${n}.${+r + 1}.0-0` : `>=${n}.${r}.0${i} <${+n + 1}.0.0-0`)
          : s
          ? (P('replaceCaret pr', s),
            (a =
              '0' === n
                ? '0' === r
                  ? `>=${n}.${r}.${o}-${s} <${n}.${r}.${+o + 1}-0`
                  : `>=${n}.${r}.${o}-${s} <${n}.${+r + 1}.0-0`
                : `>=${n}.${r}.${o}-${s} <${+n + 1}.0.0-0`))
          : (P('no pr'),
            (a =
              '0' === n
                ? '0' === r
                  ? `>=${n}.${r}.${o}${i} <${n}.${r}.${+o + 1}-0`
                  : `>=${n}.${r}.${o}${i} <${n}.${+r + 1}.0-0`
                : `>=${n}.${r}.${o} <${+n + 1}.0.0-0`)),
        P('caret return', a),
        a
      );
    });
  },
  nt = (e, t) => (
    P('replaceXRanges', e, t),
    e
      .split(/\s+/)
      .map(e => it(e, t))
      .join(' ')
  ),
  it = (e, t) => {
    e = e.trim();
    const n = t.loose ? Ke[He.XRANGELOOSE] : Ke[He.XRANGE];
    return e.replace(n, (n, i, r, o, s, a) => {
      P('xRange', e, n, i, r, o, s, a);
      const c = Ye(r),
        l = c || Ye(o),
        u = l || Ye(s),
        d = u;
      return (
        '=' === i && d && (i = ''),
        (a = t.includePrerelease ? '-0' : ''),
        c
          ? (n = '>' === i || '<' === i ? '<0.0.0-0' : '*')
          : i && d
          ? (l && (o = 0),
            (s = 0),
            '>' === i
              ? ((i = '>='), l ? ((r = +r + 1), (o = 0), (s = 0)) : ((o = +o + 1), (s = 0)))
              : '<=' === i && ((i = '<'), l ? (r = +r + 1) : (o = +o + 1)),
            '<' === i && (a = '-0'),
            (n = `${i + r}.${o}.${s}${a}`))
          : l
          ? (n = `>=${r}.0.0${a} <${+r + 1}.0.0-0`)
          : u && (n = `>=${r}.${o}.0${a} <${r}.${+o + 1}.0-0`),
        P('xRange return', n),
        n
      );
    });
  },
  rt = (e, t) => (P('replaceStars', e, t), e.trim().replace(Ke[He.STAR], '')),
  ot = (e, t) => (P('replaceGTE0', e, t), e.trim().replace(Ke[t.includePrerelease ? He.GTE0PRE : He.GTE0], '')),
  st = e => (t, n, i, r, o, s, a, c, l, u, d, h, p) =>
    `${(n = Ye(i)
      ? ''
      : Ye(r)
      ? `>=${i}.0.0${e ? '-0' : ''}`
      : Ye(o)
      ? `>=${i}.${r}.0${e ? '-0' : ''}`
      : s
      ? '>=' + n
      : `>=${n}${e ? '-0' : ''}`)} ${(c = Ye(l)
      ? ''
      : Ye(u)
      ? `<${+l + 1}.0.0-0`
      : Ye(d)
      ? `<${l}.${+u + 1}.0-0`
      : h
      ? `<=${l}.${u}.${d}-${h}`
      : e
      ? `<${l}.${u}.${+d + 1}-0`
      : '<=' + c)}`.trim(),
  at = (e, t, n) => {
    for (let n = 0; n < e.length; n++) if (!e[n].test(t)) return !1;
    if (t.prerelease.length && !n.includePrerelease) {
      for (let n = 0; n < e.length; n++)
        if ((P(e[n].semver), e[n].semver !== ut.ANY && e[n].semver.prerelease.length > 0)) {
          const i = e[n].semver;
          if (i.major === t.major && i.minor === t.minor && i.patch === t.patch) return !0;
        }
      return !1;
    }
    return !0;
  },
  ct = Symbol('SemVer ANY');
class lt {
  static get ANY() {
    return ct;
  }
  constructor(e, t) {
    if (((t = k(t)), e instanceof lt)) {
      if (e.loose === !!t.loose) return e;
      e = e.value;
    }
    P('comparator', e, t),
      (this.options = t),
      (this.loose = !!t.loose),
      this.parse(e),
      this.semver === ct ? (this.value = '') : (this.value = this.operator + this.semver.version),
      P('comp', this);
  }
  parse(e) {
    const t = this.options.loose ? dt[ht.COMPARATORLOOSE] : dt[ht.COMPARATOR],
      n = e.match(t);
    if (!n) throw new TypeError('Invalid comparator: ' + e);
    (this.operator = void 0 !== n[1] ? n[1] : ''),
      '=' === this.operator && (this.operator = ''),
      n[2] ? (this.semver = new $(n[2], this.options.loose)) : (this.semver = ct);
  }
  toString() {
    return this.value;
  }
  test(e) {
    if ((P('Comparator.test', e, this.options.loose), this.semver === ct || e === ct)) return !0;
    if ('string' == typeof e)
      try {
        e = new $(e, this.options);
      } catch (e) {
        return !1;
      }
    return de(e, this.operator, this.semver, this.options);
  }
  intersects(e, t) {
    if (!(e instanceof lt)) throw new TypeError('a Comparator is required');
    if (((t && 'object' == typeof t) || (t = { loose: !!t, includePrerelease: !1 }), '' === this.operator))
      return '' === this.value || new $e(e.value, t).test(this.value);
    if ('' === e.operator) return '' === e.value || new $e(this.value, t).test(e.semver);
    const n = !(('>=' !== this.operator && '>' !== this.operator) || ('>=' !== e.operator && '>' !== e.operator)),
      i = !(('<=' !== this.operator && '<' !== this.operator) || ('<=' !== e.operator && '<' !== e.operator)),
      r = this.semver.version === e.semver.version,
      o = !(('>=' !== this.operator && '<=' !== this.operator) || ('>=' !== e.operator && '<=' !== e.operator)),
      s =
        de(this.semver, '<', e.semver, t) &&
        ('>=' === this.operator || '>' === this.operator) &&
        ('<=' === e.operator || '<' === e.operator),
      a =
        de(this.semver, '>', e.semver, t) &&
        ('<=' === this.operator || '<' === this.operator) &&
        ('>=' === e.operator || '>' === e.operator);
    return n || i || (r && o) || s || a;
  }
}
var ut = lt;
const { re: dt, t: ht } = E;
var pt = (e, t, n) => {
  try {
    t = new $e(t, n);
  } catch (e) {
    return !1;
  }
  return t.test(e);
};
var ft = (e, t) =>
  new $e(e, t).set.map(e =>
    e
      .map(e => e.value)
      .join(' ')
      .trim()
      .split(' ')
  );
var gt = (e, t, n) => {
  let i = null,
    r = null,
    o = null;
  try {
    o = new $e(t, n);
  } catch (e) {
    return null;
  }
  return (
    e.forEach(e => {
      o.test(e) && ((i && -1 !== r.compare(e)) || ((i = e), (r = new $(i, n))));
    }),
    i
  );
};
var mt = (e, t, n) => {
  let i = null,
    r = null,
    o = null;
  try {
    o = new $e(t, n);
  } catch (e) {
    return null;
  }
  return (
    e.forEach(e => {
      o.test(e) && ((i && 1 !== r.compare(e)) || ((i = e), (r = new $(i, n))));
    }),
    i
  );
};
var vt = (e, t) => {
  e = new $e(e, t);
  let n = new $('0.0.0');
  if (e.test(n)) return n;
  if (((n = new $('0.0.0-0')), e.test(n))) return n;
  n = null;
  for (let t = 0; t < e.set.length; ++t) {
    const i = e.set[t];
    let r = null;
    i.forEach(e => {
      const t = new $(e.semver.version);
      switch (e.operator) {
        case '>':
          0 === t.prerelease.length ? t.patch++ : t.prerelease.push(0), (t.raw = t.format());
        case '':
        case '>=':
          (r && !se(t, r)) || (r = t);
          break;
        case '<':
        case '<=':
          break;
        default:
          throw new Error('Unexpected operation: ' + e.operator);
      }
    }),
      !r || (n && !se(n, r)) || (n = r);
  }
  return n && e.test(n) ? n : null;
};
var yt = (e, t) => {
  try {
    return new $e(e, t).range || '*';
  } catch (e) {
    return null;
  }
};
const { ANY: Ct } = ut;
var Rt = (e, t, n, i) => {
  let r, o, s, a, c;
  switch (((e = new $(e, i)), (t = new $e(t, i)), n)) {
    case '>':
      (r = se), (o = ue), (s = ae), (a = '>'), (c = '>=');
      break;
    case '<':
      (r = ae), (o = le), (s = se), (a = '<'), (c = '<=');
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (pt(e, t, i)) return !1;
  for (let n = 0; n < t.set.length; ++n) {
    const l = t.set[n];
    let u = null,
      d = null;
    if (
      (l.forEach(e => {
        e.semver === Ct && (e = new ut('>=0.0.0')),
          (u = u || e),
          (d = d || e),
          r(e.semver, u.semver, i) ? (u = e) : s(e.semver, d.semver, i) && (d = e);
      }),
      u.operator === a || u.operator === c)
    )
      return !1;
    if ((!d.operator || d.operator === a) && o(e, d.semver)) return !1;
    if (d.operator === c && s(e, d.semver)) return !1;
  }
  return !0;
};
var wt = (e, t, n) => Rt(e, t, '>', n);
var Tt = (e, t, n) => Rt(e, t, '<', n);
var bt = (e, t, n) => ((e = new $e(e, n)), (t = new $e(t, n)), e.intersects(t));
const { ANY: St } = ut,
  _t = (e, t, n) => {
    if (e === t) return !0;
    if (1 === e.length && e[0].semver === St) return 1 === t.length && t[0].semver === St;
    const i = new Set();
    let r, o, s, a, c, l, u;
    for (const t of e)
      '>' === t.operator || '>=' === t.operator
        ? (r = Dt(r, t, n))
        : '<' === t.operator || '<=' === t.operator
        ? (o = Pt(o, t, n))
        : i.add(t.semver);
    if (i.size > 1) return null;
    if (r && o) {
      if (((s = G(r.semver, o.semver, n)), s > 0)) return null;
      if (0 === s && ('>=' !== r.operator || '<=' !== o.operator)) return null;
    }
    for (const e of i) {
      if (r && !pt(e, String(r), n)) return null;
      if (o && !pt(e, String(o), n)) return null;
      for (const i of t) if (!pt(e, String(i), n)) return !1;
      return !0;
    }
    for (const e of t) {
      if (
        ((u = u || '>' === e.operator || '>=' === e.operator), (l = l || '<' === e.operator || '<=' === e.operator), r)
      )
        if ('>' === e.operator || '>=' === e.operator) {
          if (((a = Dt(r, e, n)), a === e && a !== r)) return !1;
        } else if ('>=' === r.operator && !pt(r.semver, String(e), n)) return !1;
      if (o)
        if ('<' === e.operator || '<=' === e.operator) {
          if (((c = Pt(o, e, n)), c === e && c !== o)) return !1;
        } else if ('<=' === o.operator && !pt(o.semver, String(e), n)) return !1;
      if (!e.operator && (o || r) && 0 !== s) return !1;
    }
    return !(r && l && !o && 0 !== s) && !(o && u && !r && 0 !== s);
  },
  Dt = (e, t, n) => {
    if (!e) return t;
    const i = G(e.semver, t.semver, n);
    return i > 0 ? e : i < 0 || ('>' === t.operator && '>=' === e.operator) ? t : e;
  },
  Pt = (e, t, n) => {
    if (!e) return t;
    const i = G(e.semver, t.semver, n);
    return i < 0 ? e : i > 0 || ('<' === t.operator && '<=' === e.operator) ? t : e;
  };
var Et = (e, t, n) => {
    if (e === t) return !0;
    (e = new $e(e, n)), (t = new $e(t, n));
    let i = !1;
    e: for (const r of e.set) {
      for (const e of t.set) {
        const t = _t(r, e, n);
        if (((i = i || null !== t), t)) continue e;
      }
      if (i) return !1;
    }
    return !0;
  },
  xt = {
    re: E.re,
    src: E.src,
    tokens: E.t,
    SEMVER_SPEC_VERSION: D.SEMVER_SPEC_VERSION,
    SemVer: $,
    compareIdentifiers: q.compareIdentifiers,
    rcompareIdentifiers: q.rcompareIdentifiers,
    parse: U,
    valid: z,
    clean: V,
    inc: B,
    diff: J,
    major: Y,
    minor: Z,
    patch: Q,
    prerelease: ee,
    compare: G,
    rcompare: te,
    compareLoose: ne,
    compareBuild: ie,
    sort: re,
    rsort: oe,
    gt: se,
    lt: ae,
    eq: X,
    neq: ce,
    gte: le,
    lte: ue,
    cmp: de,
    coerce: fe,
    Comparator: ut,
    Range: $e,
    satisfies: pt,
    toComparators: ft,
    maxSatisfying: gt,
    minSatisfying: mt,
    minVersion: vt,
    validRange: yt,
    outside: Rt,
    gtr: wt,
    ltr: Tt,
    intersects: bt,
    simplifyRange: (e, t, n) => {
      const i = [];
      let r = null,
        o = null;
      const s = e.sort((e, t) => G(e, t, n));
      for (const e of s) {
        pt(e, t, n) ? ((o = e), r || (r = e)) : (o && i.push([r, o]), (o = null), (r = null));
      }
      r && i.push([r, null]);
      const a = [];
      for (const [e, t] of i)
        e === t
          ? a.push(e)
          : t || e !== s[0]
          ? t
            ? e === s[0]
              ? a.push('<=' + t)
              : a.push(`${e} - ${t}`)
            : a.push('>=' + e)
          : a.push('*');
      const c = a.join(' || '),
        l = 'string' == typeof t.raw ? t.raw : String(t);
      return c.length < l.length ? c : t;
    },
    subset: Et
  },
  kt = _(function (e, t) {
    function n(e) {
      return 'string' == typeof e || e instanceof String;
    }
    function i(e) {
      return 'function' == typeof e;
    }
    function r(e) {
      return Array.isArray(e);
    }
    function o(e) {
      return e && i(e.then);
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.asPromise = t.thenable = t.typedArray = t.stringArray = t.array = t.func = t.error = t.number = t.string = t.boolean = void 0),
      (t.boolean = function (e) {
        return !0 === e || !1 === e;
      }),
      (t.string = n),
      (t.number = function (e) {
        return 'number' == typeof e || e instanceof Number;
      }),
      (t.error = function (e) {
        return e instanceof Error;
      }),
      (t.func = i),
      (t.array = r),
      (t.stringArray = function (e) {
        return r(e) && e.every(e => n(e));
      }),
      (t.typedArray = function (e, t) {
        return Array.isArray(e) && e.every(t);
      }),
      (t.thenable = o),
      (t.asPromise = function (e) {
        return e instanceof Promise
          ? e
          : o(e)
          ? new Promise((t, n) => {
              e.then(
                e => t(e),
                e => n(e)
              );
            })
          : Promise.resolve(e);
      });
  });
let Ot;
function Ft() {
  if (void 0 === Ot) throw new Error('No runtime abstraction layer installed');
  return Ot;
}
!(function (e) {
  e.install = function (e) {
    if (void 0 === e) throw new Error('No runtime abstraction layer provided');
    Ot = e;
  };
})(Ft || (Ft = {}));
var qt = Ft,
  Nt = Object.defineProperty({ default: qt }, '__esModule', { value: !0 }),
  It = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.Disposable = void 0),
      ((t.Disposable || (t.Disposable = {})).create = function (e) {
        return { dispose: e };
      });
  }),
  Mt = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.AbstractMessageBuffer = void 0);
    t.AbstractMessageBuffer = class {
      constructor(e = 'utf-8') {
        (this._encoding = e), (this._chunks = []), (this._totalLength = 0);
      }
      get encoding() {
        return this._encoding;
      }
      append(e) {
        const t = 'string' == typeof e ? this.fromString(e, this._encoding) : e;
        this._chunks.push(t), (this._totalLength += t.byteLength);
      }
      tryReadHeaders() {
        if (0 === this._chunks.length) return;
        let e = 0,
          t = 0,
          n = 0,
          i = 0;
        e: for (; t < this._chunks.length; ) {
          const r = this._chunks[t];
          for (n = 0; n < r.length; ) {
            switch (r[n]) {
              case 13:
                switch (e) {
                  case 0:
                    e = 1;
                    break;
                  case 2:
                    e = 3;
                    break;
                  default:
                    e = 0;
                }
                break;
              case 10:
                switch (e) {
                  case 1:
                    e = 2;
                    break;
                  case 3:
                    (e = 4), n++;
                    break e;
                  default:
                    e = 0;
                }
                break;
              default:
                e = 0;
            }
            n++;
          }
          (i += r.byteLength), t++;
        }
        if (4 !== e) return;
        const r = this._read(i + n),
          o = new Map(),
          s = this.toString(r, 'ascii').split('\r\n');
        if (s.length < 2) return o;
        for (let e = 0; e < s.length - 2; e++) {
          const t = s[e],
            n = t.indexOf(':');
          if (-1 === n) throw new Error('Message header must separate key and value using :');
          const i = t.substr(0, n),
            r = t.substr(n + 1).trim();
          o.set(i, r);
        }
        return o;
      }
      tryReadBody(e) {
        if (!(this._totalLength < e)) return this._read(e);
      }
      get numberOfBytes() {
        return this._totalLength;
      }
      _read(e) {
        if (0 === e) return this.emptyBuffer();
        if (e > this._totalLength) throw new Error('Cannot read so many bytes!');
        if (this._chunks[0].byteLength === e) {
          const t = this._chunks[0];
          return this._chunks.shift(), (this._totalLength -= e), this.asNative(t);
        }
        if (this._chunks[0].byteLength > e) {
          const t = this._chunks[0],
            n = this.asNative(t, e);
          return (this._chunks[0] = t.slice(e)), (this._totalLength -= e), n;
        }
        const t = this.allocNative(e);
        let n = 0;
        for (; e > 0; ) {
          const i = this._chunks[0];
          if (i.byteLength > e) {
            const r = i.slice(0, e);
            t.set(r, n), (n += e), (this._chunks[0] = i.slice(e)), (this._totalLength -= e), (e -= e);
          } else
            t.set(i, n),
              (n += i.byteLength),
              this._chunks.shift(),
              (this._totalLength -= i.byteLength),
              (e -= i.byteLength);
        }
        return t;
      }
    };
  });
class Lt extends Mt.AbstractMessageBuffer {
  constructor(e = 'utf-8') {
    super(e);
  }
  emptyBuffer() {
    return Lt.emptyBuffer;
  }
  fromString(e, t) {
    return Buffer.from(e, t);
  }
  toString(e, t) {
    return e instanceof Buffer ? e.toString(t) : new g.default.TextDecoder(t).decode(e);
  }
  asNative(e, t) {
    return void 0 === t
      ? e instanceof Buffer
        ? e
        : Buffer.from(e)
      : e instanceof Buffer
      ? e.slice(0, t)
      : Buffer.from(e, 0, t);
  }
  allocNative(e) {
    return Buffer.allocUnsafe(e);
  }
}
Lt.emptyBuffer = Buffer.allocUnsafe(0);
class At {
  constructor(e) {
    this.stream = e;
  }
  onClose(e) {
    return this.stream.on('close', e), It.Disposable.create(() => this.stream.off('close', e));
  }
  onError(e) {
    return this.stream.on('error', e), It.Disposable.create(() => this.stream.off('error', e));
  }
  onEnd(e) {
    return this.stream.on('end', e), It.Disposable.create(() => this.stream.off('end', e));
  }
  onData(e) {
    return this.stream.on('data', e), It.Disposable.create(() => this.stream.off('data', e));
  }
}
class jt {
  constructor(e) {
    this.stream = e;
  }
  onClose(e) {
    return this.stream.on('close', e), It.Disposable.create(() => this.stream.off('close', e));
  }
  onError(e) {
    return this.stream.on('error', e), It.Disposable.create(() => this.stream.off('error', e));
  }
  onEnd(e) {
    return this.stream.on('end', e), It.Disposable.create(() => this.stream.off('end', e));
  }
  write(e, t) {
    return new Promise((n, i) => {
      const r = e => {
        null == e ? n() : i(e);
      };
      'string' == typeof e ? this.stream.write(e, t, r) : this.stream.write(e, r);
    });
  }
  end() {
    this.stream.end();
  }
}
const $t = Object.freeze({
  messageBuffer: Object.freeze({ create: e => new Lt(e) }),
  applicationJson: Object.freeze({
    encoder: Object.freeze({
      name: 'application/json',
      encode: (e, t) => {
        try {
          return Promise.resolve(Buffer.from(JSON.stringify(e, void 0, 0), t.charset));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }),
    decoder: Object.freeze({
      name: 'application/json',
      decode: (e, t) => {
        try {
          return e instanceof Buffer
            ? Promise.resolve(JSON.parse(e.toString(t.charset)))
            : Promise.resolve(JSON.parse(new g.default.TextDecoder(t.charset).decode(e)));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    })
  }),
  stream: Object.freeze({ asReadableStream: e => new At(e), asWritableStream: e => new jt(e) }),
  console: console,
  timer: Object.freeze({
    setTimeout: (e, t, ...n) => setTimeout(e, t, ...n),
    clearTimeout(e) {
      clearTimeout(e);
    },
    setImmediate: (e, ...t) => setImmediate(e, ...t),
    clearImmediate(e) {
      clearImmediate(e);
    }
  })
});
function Wt() {
  return $t;
}
!(function (e) {
  e.install = function () {
    Nt.default.install($t);
  };
})(Wt || (Wt = {}));
var Kt,
  Ht,
  Ut,
  zt,
  Vt,
  Bt,
  Gt,
  Xt,
  Jt,
  Yt,
  Zt,
  Qt,
  en,
  tn,
  nn,
  rn,
  on,
  sn,
  an,
  cn,
  ln,
  un,
  dn,
  hn,
  pn,
  fn,
  gn = Wt,
  mn = Object.defineProperty({ default: gn }, '__esModule', { value: !0 }),
  vn = _(function (e, t) {
    function n(e) {
      return 'string' == typeof e || e instanceof String;
    }
    function i(e) {
      return Array.isArray(e);
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.stringArray = t.array = t.func = t.error = t.number = t.string = t.boolean = void 0),
      (t.boolean = function (e) {
        return !0 === e || !1 === e;
      }),
      (t.string = n),
      (t.number = function (e) {
        return 'number' == typeof e || e instanceof Number;
      }),
      (t.error = function (e) {
        return e instanceof Error;
      }),
      (t.func = function (e) {
        return 'function' == typeof e;
      }),
      (t.array = i),
      (t.stringArray = function (e) {
        return i(e) && e.every(e => n(e));
      });
  }),
  yn = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.isResponseMessage = t.isNotificationMessage = t.isRequestMessage = t.NotificationType9 = t.NotificationType8 = t.NotificationType7 = t.NotificationType6 = t.NotificationType5 = t.NotificationType4 = t.NotificationType3 = t.NotificationType2 = t.NotificationType1 = t.NotificationType0 = t.NotificationType = t.RequestType9 = t.RequestType8 = t.RequestType7 = t.RequestType6 = t.RequestType5 = t.RequestType4 = t.RequestType3 = t.RequestType2 = t.RequestType1 = t.RequestType = t.RequestType0 = t.AbstractMessageSignature = t.ParameterStructures = t.ResponseError = t.ErrorCodes = void 0),
      (function (e) {
        (e.ParseError = -32700),
          (e.InvalidRequest = -32600),
          (e.MethodNotFound = -32601),
          (e.InvalidParams = -32602),
          (e.InternalError = -32603),
          (e.jsonrpcReservedErrorRangeStart = -32099),
          (e.serverErrorStart = e.jsonrpcReservedErrorRangeStart),
          (e.MessageWriteError = -32099),
          (e.MessageReadError = -32098),
          (e.ServerNotInitialized = -32002),
          (e.UnknownErrorCode = -32001),
          (e.jsonrpcReservedErrorRangeEnd = -32e3),
          (e.serverErrorEnd = e.jsonrpcReservedErrorRangeEnd);
      })((n = t.ErrorCodes || (t.ErrorCodes = {})));
    class i extends Error {
      constructor(e, t, r) {
        super(t),
          (this.code = vn.number(e) ? e : n.UnknownErrorCode),
          (this.data = r),
          Object.setPrototypeOf(this, i.prototype);
      }
      toJson() {
        return { code: this.code, message: this.message, data: this.data };
      }
    }
    t.ResponseError = i;
    class r {
      constructor(e) {
        this.kind = e;
      }
      static is(e) {
        return e === r.auto || e === r.byName || e === r.byPosition;
      }
      toString() {
        return this.kind;
      }
    }
    (t.ParameterStructures = r),
      (r.auto = new r('auto')),
      (r.byPosition = new r('byPosition')),
      (r.byName = new r('byName'));
    class o {
      constructor(e, t) {
        (this.method = e), (this.numberOfParams = t);
      }
      get parameterStructures() {
        return r.auto;
      }
    }
    t.AbstractMessageSignature = o;
    t.RequestType0 = class extends o {
      constructor(e) {
        super(e, 0);
      }
    };
    t.RequestType = class extends o {
      constructor(e, t = r.auto) {
        super(e, 1), (this._parameterStructures = t);
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    t.RequestType1 = class extends o {
      constructor(e, t = r.auto) {
        super(e, 1), (this._parameterStructures = t);
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    t.RequestType2 = class extends o {
      constructor(e) {
        super(e, 2);
      }
    };
    t.RequestType3 = class extends o {
      constructor(e) {
        super(e, 3);
      }
    };
    t.RequestType4 = class extends o {
      constructor(e) {
        super(e, 4);
      }
    };
    t.RequestType5 = class extends o {
      constructor(e) {
        super(e, 5);
      }
    };
    t.RequestType6 = class extends o {
      constructor(e) {
        super(e, 6);
      }
    };
    t.RequestType7 = class extends o {
      constructor(e) {
        super(e, 7);
      }
    };
    t.RequestType8 = class extends o {
      constructor(e) {
        super(e, 8);
      }
    };
    t.RequestType9 = class extends o {
      constructor(e) {
        super(e, 9);
      }
    };
    t.NotificationType = class extends o {
      constructor(e, t = r.auto) {
        super(e, 1), (this._parameterStructures = t);
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    t.NotificationType0 = class extends o {
      constructor(e) {
        super(e, 0);
      }
    };
    t.NotificationType1 = class extends o {
      constructor(e, t = r.auto) {
        super(e, 1), (this._parameterStructures = t);
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    t.NotificationType2 = class extends o {
      constructor(e) {
        super(e, 2);
      }
    };
    t.NotificationType3 = class extends o {
      constructor(e) {
        super(e, 3);
      }
    };
    t.NotificationType4 = class extends o {
      constructor(e) {
        super(e, 4);
      }
    };
    t.NotificationType5 = class extends o {
      constructor(e) {
        super(e, 5);
      }
    };
    t.NotificationType6 = class extends o {
      constructor(e) {
        super(e, 6);
      }
    };
    t.NotificationType7 = class extends o {
      constructor(e) {
        super(e, 7);
      }
    };
    t.NotificationType8 = class extends o {
      constructor(e) {
        super(e, 8);
      }
    };
    (t.NotificationType9 = class extends o {
      constructor(e) {
        super(e, 9);
      }
    }),
      (t.isRequestMessage = function (e) {
        const t = e;
        return t && vn.string(t.method) && (vn.string(t.id) || vn.number(t.id));
      }),
      (t.isNotificationMessage = function (e) {
        const t = e;
        return t && vn.string(t.method) && void 0 === e.id;
      }),
      (t.isResponseMessage = function (e) {
        const t = e;
        return t && (void 0 !== t.result || !!t.error) && (vn.string(t.id) || vn.number(t.id) || null === t.id);
      });
  }),
  Cn = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.Emitter = t.Event = void 0),
      (function (e) {
        const t = { dispose() {} };
        e.None = function () {
          return t;
        };
      })(t.Event || (t.Event = {}));
    class n {
      add(e, t = null, n) {
        this._callbacks || ((this._callbacks = []), (this._contexts = [])),
          this._callbacks.push(e),
          this._contexts.push(t),
          Array.isArray(n) && n.push({ dispose: () => this.remove(e, t) });
      }
      remove(e, t = null) {
        if (!this._callbacks) return;
        let n = !1;
        for (let i = 0, r = this._callbacks.length; i < r; i++)
          if (this._callbacks[i] === e) {
            if (this._contexts[i] === t) return this._callbacks.splice(i, 1), void this._contexts.splice(i, 1);
            n = !0;
          }
        if (n) throw new Error('When adding a listener with a context, you should remove it with the same context');
      }
      invoke(...e) {
        if (!this._callbacks) return [];
        const t = [],
          n = this._callbacks.slice(0),
          i = this._contexts.slice(0);
        for (let r = 0, o = n.length; r < o; r++)
          try {
            t.push(n[r].apply(i[r], e));
          } catch (e) {
            Nt.default().console.error(e);
          }
        return t;
      }
      isEmpty() {
        return !this._callbacks || 0 === this._callbacks.length;
      }
      dispose() {
        (this._callbacks = void 0), (this._contexts = void 0);
      }
    }
    class i {
      constructor(e) {
        this._options = e;
      }
      get event() {
        return (
          this._event ||
            (this._event = (e, t, r) => {
              this._callbacks || (this._callbacks = new n()),
                this._options &&
                  this._options.onFirstListenerAdd &&
                  this._callbacks.isEmpty() &&
                  this._options.onFirstListenerAdd(this),
                this._callbacks.add(e, t);
              const o = {
                dispose: () => {
                  this._callbacks &&
                    (this._callbacks.remove(e, t),
                    (o.dispose = i._noop),
                    this._options &&
                      this._options.onLastListenerRemove &&
                      this._callbacks.isEmpty() &&
                      this._options.onLastListenerRemove(this));
                }
              };
              return Array.isArray(r) && r.push(o), o;
            }),
          this._event
        );
      }
      fire(e) {
        this._callbacks && this._callbacks.invoke.call(this._callbacks, e);
      }
      dispose() {
        this._callbacks && (this._callbacks.dispose(), (this._callbacks = void 0));
      }
    }
    (t.Emitter = i), (i._noop = function () {});
  }),
  Rn = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.CancellationTokenSource = t.CancellationToken = void 0),
      (function (e) {
        (e.None = Object.freeze({ isCancellationRequested: !1, onCancellationRequested: Cn.Event.None })),
          (e.Cancelled = Object.freeze({ isCancellationRequested: !0, onCancellationRequested: Cn.Event.None })),
          (e.is = function (t) {
            const n = t;
            return (
              n &&
              (n === e.None ||
                n === e.Cancelled ||
                (vn.boolean(n.isCancellationRequested) && !!n.onCancellationRequested))
            );
          });
      })((n = t.CancellationToken || (t.CancellationToken = {})));
    const i = Object.freeze(function (e, t) {
      const n = Nt.default().timer.setTimeout(e.bind(t), 0);
      return {
        dispose() {
          Nt.default().timer.clearTimeout(n);
        }
      };
    });
    class r {
      constructor() {
        this._isCancelled = !1;
      }
      cancel() {
        this._isCancelled || ((this._isCancelled = !0), this._emitter && (this._emitter.fire(void 0), this.dispose()));
      }
      get isCancellationRequested() {
        return this._isCancelled;
      }
      get onCancellationRequested() {
        return this._isCancelled ? i : (this._emitter || (this._emitter = new Cn.Emitter()), this._emitter.event);
      }
      dispose() {
        this._emitter && (this._emitter.dispose(), (this._emitter = void 0));
      }
    }
    t.CancellationTokenSource = class {
      get token() {
        return this._token || (this._token = new r()), this._token;
      }
      cancel() {
        this._token ? this._token.cancel() : (this._token = n.Cancelled);
      }
      dispose() {
        this._token ? this._token instanceof r && this._token.dispose() : (this._token = n.None);
      }
    };
  }),
  wn = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ReadableStreamMessageReader = t.AbstractMessageReader = t.MessageReader = void 0),
      ((t.MessageReader || (t.MessageReader = {})).is = function (e) {
        let t = e;
        return (
          t &&
          vn.func(t.listen) &&
          vn.func(t.dispose) &&
          vn.func(t.onError) &&
          vn.func(t.onClose) &&
          vn.func(t.onPartialMessage)
        );
      });
    class i {
      constructor() {
        (this.errorEmitter = new Cn.Emitter()),
          (this.closeEmitter = new Cn.Emitter()),
          (this.partialMessageEmitter = new Cn.Emitter());
      }
      dispose() {
        this.errorEmitter.dispose(), this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(e) {
        this.errorEmitter.fire(this.asError(e));
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      get onPartialMessage() {
        return this.partialMessageEmitter.event;
      }
      firePartialMessage(e) {
        this.partialMessageEmitter.fire(e);
      }
      asError(e) {
        return e instanceof Error
          ? e
          : new Error('Reader received error. Reason: ' + (vn.string(e.message) ? e.message : 'unknown'));
      }
    }
    (t.AbstractMessageReader = i),
      (function (e) {
        e.fromOptions = function (e) {
          var t;
          let n, i;
          const r = new Map();
          let o;
          const s = new Map();
          if (void 0 === e || 'string' == typeof e) n = null != e ? e : 'utf-8';
          else {
            if (
              ((n = null !== (t = e.charset) && void 0 !== t ? t : 'utf-8'),
              void 0 !== e.contentDecoder && ((i = e.contentDecoder), r.set(i.name, i)),
              void 0 !== e.contentDecoders)
            )
              for (const t of e.contentDecoders) r.set(t.name, t);
            if (
              (void 0 !== e.contentTypeDecoder && ((o = e.contentTypeDecoder), s.set(o.name, o)),
              void 0 !== e.contentTypeDecoders)
            )
              for (const t of e.contentTypeDecoders) s.set(t.name, t);
          }
          return (
            void 0 === o && ((o = Nt.default().applicationJson.decoder), s.set(o.name, o)),
            { charset: n, contentDecoder: i, contentDecoders: r, contentTypeDecoder: o, contentTypeDecoders: s }
          );
        };
      })(n || (n = {}));
    t.ReadableStreamMessageReader = class extends i {
      constructor(e, t) {
        super(),
          (this.readable = e),
          (this.options = n.fromOptions(t)),
          (this.buffer = Nt.default().messageBuffer.create(this.options.charset)),
          (this._partialMessageTimeout = 1e4),
          (this.nextMessageLength = -1),
          (this.messageToken = 0);
      }
      set partialMessageTimeout(e) {
        this._partialMessageTimeout = e;
      }
      get partialMessageTimeout() {
        return this._partialMessageTimeout;
      }
      listen(e) {
        (this.nextMessageLength = -1),
          (this.messageToken = 0),
          (this.partialMessageTimer = void 0),
          (this.callback = e);
        const t = this.readable.onData(e => {
          this.onData(e);
        });
        return this.readable.onError(e => this.fireError(e)), this.readable.onClose(() => this.fireClose()), t;
      }
      onData(e) {
        for (this.buffer.append(e); ; ) {
          if (-1 === this.nextMessageLength) {
            const e = this.buffer.tryReadHeaders();
            if (!e) return;
            const t = e.get('Content-Length');
            if (!t) throw new Error('Header must provide a Content-Length property.');
            const n = parseInt(t);
            if (isNaN(n)) throw new Error('Content-Length value must be a number.');
            this.nextMessageLength = n;
          }
          const e = this.buffer.tryReadBody(this.nextMessageLength);
          if (void 0 === e) return void this.setPartialMessageTimer();
          let t;
          this.clearPartialMessageTimer(),
            (this.nextMessageLength = -1),
            (t = void 0 !== this.options.contentDecoder ? this.options.contentDecoder.decode(e) : Promise.resolve(e)),
            t.then(
              e => {
                this.options.contentTypeDecoder.decode(e, this.options).then(
                  e => {
                    this.callback(e);
                  },
                  e => {
                    this.fireError(e);
                  }
                );
              },
              e => {
                this.fireError(e);
              }
            );
        }
      }
      clearPartialMessageTimer() {
        this.partialMessageTimer &&
          (Nt.default().timer.clearTimeout(this.partialMessageTimer), (this.partialMessageTimer = void 0));
      }
      setPartialMessageTimer() {
        this.clearPartialMessageTimer(),
          this._partialMessageTimeout <= 0 ||
            (this.partialMessageTimer = Nt.default().timer.setTimeout(
              (e, t) => {
                (this.partialMessageTimer = void 0),
                  e === this.messageToken &&
                    (this.firePartialMessage({ messageToken: e, waitingTime: t }), this.setPartialMessageTimer());
              },
              this._partialMessageTimeout,
              this.messageToken,
              this._partialMessageTimeout
            ));
      }
    };
  }),
  Tn = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.Semaphore = void 0);
    t.Semaphore = class {
      constructor(e = 1) {
        if (e <= 0) throw new Error('Capacity must be greater than 0');
        (this._capacity = e), (this._active = 0), (this._waiting = []);
      }
      lock(e) {
        return new Promise((t, n) => {
          this._waiting.push({ thunk: e, resolve: t, reject: n }), this.runNext();
        });
      }
      get active() {
        return this._active;
      }
      runNext() {
        0 !== this._waiting.length &&
          this._active !== this._capacity &&
          Nt.default().timer.setImmediate(() => this.doRunNext());
      }
      doRunNext() {
        if (0 === this._waiting.length || this._active === this._capacity) return;
        const e = this._waiting.shift();
        if ((this._active++, this._active > this._capacity)) throw new Error('To many thunks active');
        try {
          const t = e.thunk();
          t instanceof Promise
            ? t.then(
                t => {
                  this._active--, e.resolve(t), this.runNext();
                },
                t => {
                  this._active--, e.reject(t), this.runNext();
                }
              )
            : (this._active--, e.resolve(t), this.runNext());
        } catch (t) {
          this._active--, e.reject(t), this.runNext();
        }
      }
    };
  }),
  bn = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WriteableStreamMessageWriter = t.AbstractMessageWriter = t.MessageWriter = void 0);
    var n;
    (t.MessageWriter || (t.MessageWriter = {})).is = function (e) {
      let t = e;
      return t && vn.func(t.dispose) && vn.func(t.onClose) && vn.func(t.onError) && vn.func(t.write);
    };
    class i {
      constructor() {
        (this.errorEmitter = new Cn.Emitter()), (this.closeEmitter = new Cn.Emitter());
      }
      dispose() {
        this.errorEmitter.dispose(), this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(e, t, n) {
        this.errorEmitter.fire([this.asError(e), t, n]);
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      asError(e) {
        return e instanceof Error
          ? e
          : new Error('Writer received error. Reason: ' + (vn.string(e.message) ? e.message : 'unknown'));
      }
    }
    (t.AbstractMessageWriter = i),
      (function (e) {
        e.fromOptions = function (e) {
          var t, n;
          return void 0 === e || 'string' == typeof e
            ? { charset: null != e ? e : 'utf-8', contentTypeEncoder: Nt.default().applicationJson.encoder }
            : {
                charset: null !== (t = e.charset) && void 0 !== t ? t : 'utf-8',
                contentEncoder: e.contentEncoder,
                contentTypeEncoder:
                  null !== (n = e.contentTypeEncoder) && void 0 !== n ? n : Nt.default().applicationJson.encoder
              };
        };
      })(n || (n = {}));
    t.WriteableStreamMessageWriter = class extends i {
      constructor(e, t) {
        super(),
          (this.writable = e),
          (this.options = n.fromOptions(t)),
          (this.errorCount = 0),
          (this.writeSemaphore = new Tn.Semaphore(1)),
          this.writable.onError(e => this.fireError(e)),
          this.writable.onClose(() => this.fireClose());
      }
      async write(e) {
        return this.writeSemaphore.lock(async () =>
          this.options.contentTypeEncoder
            .encode(e, this.options)
            .then(e => (void 0 !== this.options.contentEncoder ? this.options.contentEncoder.encode(e) : e))
            .then(
              t => {
                const n = [];
                return (
                  n.push('Content-Length: ', t.byteLength.toString(), '\r\n'), n.push('\r\n'), this.doWrite(e, n, t)
                );
              },
              e => {
                throw (this.fireError(e), e);
              }
            )
        );
      }
      async doWrite(e, t, n) {
        try {
          return await this.writable.write(t.join(''), 'ascii'), this.writable.write(n);
        } catch (t) {
          return this.handleError(t, e), Promise.reject(t);
        }
      }
      handleError(e, t) {
        this.errorCount++, this.fireError(e, t, this.errorCount);
      }
      end() {
        this.writable.end();
      }
    };
  }),
  Sn = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.LRUCache = t.LinkedMap = t.Touch = void 0),
      (function (e) {
        (e.None = 0), (e.First = 1), (e.AsOld = e.First), (e.Last = 2), (e.AsNew = e.Last);
      })((n = t.Touch || (t.Touch = {})));
    class i {
      constructor() {
        (this[Symbol.toStringTag] = 'LinkedMap'),
          (this._map = new Map()),
          (this._head = void 0),
          (this._tail = void 0),
          (this._size = 0),
          (this._state = 0);
      }
      clear() {
        this._map.clear(), (this._head = void 0), (this._tail = void 0), (this._size = 0), this._state++;
      }
      isEmpty() {
        return !this._head && !this._tail;
      }
      get size() {
        return this._size;
      }
      get first() {
        var e;
        return null === (e = this._head) || void 0 === e ? void 0 : e.value;
      }
      get last() {
        var e;
        return null === (e = this._tail) || void 0 === e ? void 0 : e.value;
      }
      has(e) {
        return this._map.has(e);
      }
      get(e, t = n.None) {
        const i = this._map.get(e);
        if (i) return t !== n.None && this.touch(i, t), i.value;
      }
      set(e, t, i = n.None) {
        let r = this._map.get(e);
        if (r) (r.value = t), i !== n.None && this.touch(r, i);
        else {
          switch (((r = { key: e, value: t, next: void 0, previous: void 0 }), i)) {
            case n.None:
              this.addItemLast(r);
              break;
            case n.First:
              this.addItemFirst(r);
              break;
            case n.Last:
            default:
              this.addItemLast(r);
          }
          this._map.set(e, r), this._size++;
        }
        return this;
      }
      delete(e) {
        return !!this.remove(e);
      }
      remove(e) {
        const t = this._map.get(e);
        if (t) return this._map.delete(e), this.removeItem(t), this._size--, t.value;
      }
      shift() {
        if (!this._head && !this._tail) return;
        if (!this._head || !this._tail) throw new Error('Invalid list');
        const e = this._head;
        return this._map.delete(e.key), this.removeItem(e), this._size--, e.value;
      }
      forEach(e, t) {
        const n = this._state;
        let i = this._head;
        for (; i; ) {
          if ((t ? e.bind(t)(i.value, i.key, this) : e(i.value, i.key, this), this._state !== n))
            throw new Error('LinkedMap got modified during iteration.');
          i = i.next;
        }
      }
      keys() {
        const e = this,
          t = this._state;
        let n = this._head;
        const i = {
          [Symbol.iterator]: () => i,
          next() {
            if (e._state !== t) throw new Error('LinkedMap got modified during iteration.');
            if (n) {
              const e = { value: n.key, done: !1 };
              return (n = n.next), e;
            }
            return { value: void 0, done: !0 };
          }
        };
        return i;
      }
      values() {
        const e = this,
          t = this._state;
        let n = this._head;
        const i = {
          [Symbol.iterator]: () => i,
          next() {
            if (e._state !== t) throw new Error('LinkedMap got modified during iteration.');
            if (n) {
              const e = { value: n.value, done: !1 };
              return (n = n.next), e;
            }
            return { value: void 0, done: !0 };
          }
        };
        return i;
      }
      entries() {
        const e = this,
          t = this._state;
        let n = this._head;
        const i = {
          [Symbol.iterator]: () => i,
          next() {
            if (e._state !== t) throw new Error('LinkedMap got modified during iteration.');
            if (n) {
              const e = { value: [n.key, n.value], done: !1 };
              return (n = n.next), e;
            }
            return { value: void 0, done: !0 };
          }
        };
        return i;
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      trimOld(e) {
        if (e >= this.size) return;
        if (0 === e) return void this.clear();
        let t = this._head,
          n = this.size;
        for (; t && n > e; ) this._map.delete(t.key), (t = t.next), n--;
        (this._head = t), (this._size = n), t && (t.previous = void 0), this._state++;
      }
      addItemFirst(e) {
        if (this._head || this._tail) {
          if (!this._head) throw new Error('Invalid list');
          (e.next = this._head), (this._head.previous = e);
        } else this._tail = e;
        (this._head = e), this._state++;
      }
      addItemLast(e) {
        if (this._head || this._tail) {
          if (!this._tail) throw new Error('Invalid list');
          (e.previous = this._tail), (this._tail.next = e);
        } else this._head = e;
        (this._tail = e), this._state++;
      }
      removeItem(e) {
        if (e === this._head && e === this._tail) (this._head = void 0), (this._tail = void 0);
        else if (e === this._head) {
          if (!e.next) throw new Error('Invalid list');
          (e.next.previous = void 0), (this._head = e.next);
        } else if (e === this._tail) {
          if (!e.previous) throw new Error('Invalid list');
          (e.previous.next = void 0), (this._tail = e.previous);
        } else {
          const t = e.next,
            n = e.previous;
          if (!t || !n) throw new Error('Invalid list');
          (t.previous = n), (n.next = t);
        }
        (e.next = void 0), (e.previous = void 0), this._state++;
      }
      touch(e, t) {
        if (!this._head || !this._tail) throw new Error('Invalid list');
        if (t === n.First || t === n.Last)
          if (t === n.First) {
            if (e === this._head) return;
            const t = e.next,
              n = e.previous;
            e === this._tail ? ((n.next = void 0), (this._tail = n)) : ((t.previous = n), (n.next = t)),
              (e.previous = void 0),
              (e.next = this._head),
              (this._head.previous = e),
              (this._head = e),
              this._state++;
          } else if (t === n.Last) {
            if (e === this._tail) return;
            const t = e.next,
              n = e.previous;
            e === this._head ? ((t.previous = void 0), (this._head = t)) : ((t.previous = n), (n.next = t)),
              (e.next = void 0),
              (e.previous = this._tail),
              (this._tail.next = e),
              (this._tail = e),
              this._state++;
          }
      }
      toJSON() {
        const e = [];
        return (
          this.forEach((t, n) => {
            e.push([n, t]);
          }),
          e
        );
      }
      fromJSON(e) {
        this.clear();
        for (const [t, n] of e) this.set(t, n);
      }
    }
    t.LinkedMap = i;
    t.LRUCache = class extends i {
      constructor(e, t = 1) {
        super(), (this._limit = e), (this._ratio = Math.min(Math.max(0, t), 1));
      }
      get limit() {
        return this._limit;
      }
      set limit(e) {
        (this._limit = e), this.checkTrim();
      }
      get ratio() {
        return this._ratio;
      }
      set ratio(e) {
        (this._ratio = Math.min(Math.max(0, e), 1)), this.checkTrim();
      }
      get(e, t = n.AsNew) {
        return super.get(e, t);
      }
      peek(e) {
        return super.get(e, n.None);
      }
      set(e, t) {
        return super.set(e, t, n.Last), this.checkTrim(), this;
      }
      checkTrim() {
        this.size > this._limit && this.trimOld(Math.round(this._limit * this._ratio));
      }
    };
  }),
  _n = _(function (e, t) {
    var n, i, r, o, s, a, c, l, u, d, h, p, f;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createMessageConnection = t.ConnectionOptions = t.CancellationStrategy = t.CancellationSenderStrategy = t.CancellationReceiverStrategy = t.ConnectionStrategy = t.ConnectionError = t.ConnectionErrors = t.LogTraceNotification = t.SetTraceNotification = t.TraceFormat = t.Trace = t.NullLogger = t.ProgressType = void 0),
      (function (e) {
        e.type = new yn.NotificationType('$/cancelRequest');
      })(n || (n = {})),
      (function (e) {
        e.type = new yn.NotificationType('$/progress');
      })(i || (i = {}));
    (t.ProgressType = class {
      constructor() {}
    }),
      (function (e) {
        e.is = function (e) {
          return vn.func(e);
        };
      })(r || (r = {})),
      (t.NullLogger = Object.freeze({ error: () => {}, warn: () => {}, info: () => {}, log: () => {} })),
      (function (e) {
        (e[(e.Off = 0)] = 'Off'), (e[(e.Messages = 1)] = 'Messages'), (e[(e.Verbose = 2)] = 'Verbose');
      })((o = t.Trace || (t.Trace = {}))),
      (function (e) {
        (e.fromString = function (t) {
          if (!vn.string(t)) return e.Off;
          switch ((t = t.toLowerCase())) {
            case 'off':
              return e.Off;
            case 'messages':
              return e.Messages;
            case 'verbose':
              return e.Verbose;
            default:
              return e.Off;
          }
        }),
          (e.toString = function (t) {
            switch (t) {
              case e.Off:
                return 'off';
              case e.Messages:
                return 'messages';
              case e.Verbose:
                return 'verbose';
              default:
                return 'off';
            }
          });
      })((o = t.Trace || (t.Trace = {}))),
      (function (e) {
        (e.Text = 'text'), (e.JSON = 'json');
      })(t.TraceFormat || (t.TraceFormat = {})),
      (function (e) {
        e.fromString = function (t) {
          return 'json' === (t = t.toLowerCase()) ? e.JSON : e.Text;
        };
      })((s = t.TraceFormat || (t.TraceFormat = {}))),
      (function (e) {
        e.type = new yn.NotificationType('$/setTrace');
      })((a = t.SetTraceNotification || (t.SetTraceNotification = {}))),
      (function (e) {
        e.type = new yn.NotificationType('$/logTrace');
      })((c = t.LogTraceNotification || (t.LogTraceNotification = {}))),
      (function (e) {
        (e[(e.Closed = 1)] = 'Closed'),
          (e[(e.Disposed = 2)] = 'Disposed'),
          (e[(e.AlreadyListening = 3)] = 'AlreadyListening');
      })((l = t.ConnectionErrors || (t.ConnectionErrors = {})));
    class g extends Error {
      constructor(e, t) {
        super(t), (this.code = e), Object.setPrototypeOf(this, g.prototype);
      }
    }
    (t.ConnectionError = g),
      (function (e) {
        e.is = function (e) {
          const t = e;
          return t && vn.func(t.cancelUndispatched);
        };
      })((u = t.ConnectionStrategy || (t.ConnectionStrategy = {}))),
      (function (e) {
        (e.Message = Object.freeze({ createCancellationTokenSource: e => new Rn.CancellationTokenSource() })),
          (e.is = function (e) {
            const t = e;
            return t && vn.func(t.createCancellationTokenSource);
          });
      })((d = t.CancellationReceiverStrategy || (t.CancellationReceiverStrategy = {}))),
      (function (e) {
        (e.Message = Object.freeze({
          sendCancellation(e, t) {
            e.sendNotification(n.type, { id: t });
          },
          cleanup(e) {}
        })),
          (e.is = function (e) {
            const t = e;
            return t && vn.func(t.sendCancellation) && vn.func(t.cleanup);
          });
      })((h = t.CancellationSenderStrategy || (t.CancellationSenderStrategy = {}))),
      (function (e) {
        (e.Message = Object.freeze({ receiver: d.Message, sender: h.Message })),
          (e.is = function (e) {
            const t = e;
            return t && d.is(t.receiver) && h.is(t.sender);
          });
      })((p = t.CancellationStrategy || (t.CancellationStrategy = {}))),
      ((t.ConnectionOptions || (t.ConnectionOptions = {})).is = function (e) {
        const t = e;
        return t && (p.is(t.cancellationStrategy) || u.is(t.connectionStrategy));
      }),
      (function (e) {
        (e[(e.New = 1)] = 'New'),
          (e[(e.Listening = 2)] = 'Listening'),
          (e[(e.Closed = 3)] = 'Closed'),
          (e[(e.Disposed = 4)] = 'Disposed');
      })(f || (f = {})),
      (t.createMessageConnection = function (e, u, d, h) {
        const m = void 0 !== d ? d : t.NullLogger;
        let v = 0,
          y = 0,
          C = 0;
        const R = '2.0';
        let w = void 0;
        const T = Object.create(null);
        let b = void 0;
        const S = Object.create(null),
          _ = new Map();
        let D,
          P,
          E = new Sn.LinkedMap(),
          x = Object.create(null),
          k = Object.create(null),
          O = o.Off,
          F = s.Text,
          q = f.New;
        const N = new Cn.Emitter(),
          I = new Cn.Emitter(),
          M = new Cn.Emitter(),
          L = new Cn.Emitter(),
          A = new Cn.Emitter(),
          j = h && h.cancellationStrategy ? h.cancellationStrategy : p.Message;
        function $(e) {
          if (null === e) throw new Error("Can't send requests with id null since the response can't be correlated.");
          return 'req-' + e.toString();
        }
        function W(e, t) {
          var n;
          yn.isRequestMessage(t)
            ? e.set($(t.id), t)
            : yn.isResponseMessage(t)
            ? e.set(null === (n = t.id) ? 'res-unknown-' + (++C).toString() : 'res-' + n.toString(), t)
            : e.set('not-' + (++y).toString(), t);
        }
        function K(e) {}
        function H() {
          return q === f.Listening;
        }
        function U() {
          return q === f.Closed;
        }
        function z() {
          return q === f.Disposed;
        }
        function V() {
          (q !== f.New && q !== f.Listening) || ((q = f.Closed), I.fire(void 0));
        }
        function B() {
          D ||
            0 === E.size ||
            (D = Nt.default().timer.setImmediate(() => {
              (D = void 0),
                (function () {
                  if (0 === E.size) return;
                  const e = E.shift();
                  try {
                    yn.isRequestMessage(e)
                      ? (function (e) {
                          if (z()) return;
                          function t(t, n, i) {
                            const r = { jsonrpc: R, id: e.id };
                            t instanceof yn.ResponseError
                              ? (r.error = t.toJson())
                              : (r.result = void 0 === t ? null : t),
                              X(r, n, i),
                              u.write(r);
                          }
                          function n(t, n, i) {
                            const r = { jsonrpc: R, id: e.id, error: t.toJson() };
                            X(r, n, i), u.write(r);
                          }
                          function i(t, n, i) {
                            void 0 === t && (t = null);
                            const r = { jsonrpc: R, id: e.id, result: t };
                            X(r, n, i), u.write(r);
                          }
                          !(function (e) {
                            if (O === o.Off || !P) return;
                            if (F === s.Text) {
                              let t = void 0;
                              O === o.Verbose && e.params && (t = `Params: ${JSON.stringify(e.params, null, 4)}\n\n`),
                                P.log(`Received request '${e.method} - (${e.id})'.`, t);
                            } else J('receive-request', e);
                          })(e);
                          const r = T[e.method];
                          let a, c;
                          r && ((a = r.type), (c = r.handler));
                          const l = Date.now();
                          if (c || w) {
                            const r = String(e.id),
                              o = j.receiver.createCancellationTokenSource(r);
                            k[r] = o;
                            try {
                              let s;
                              if (c)
                                if (void 0 === e.params) {
                                  if (void 0 !== a && 0 !== a.numberOfParams)
                                    return void n(
                                      new yn.ResponseError(
                                        yn.ErrorCodes.InvalidParams,
                                        `Request ${e.method} defines ${a.numberOfParams} params but recevied none.`
                                      ),
                                      e.method,
                                      l
                                    );
                                  s = c(o.token);
                                } else if (Array.isArray(e.params)) {
                                  if (void 0 !== a && a.parameterStructures === yn.ParameterStructures.byName)
                                    return void n(
                                      new yn.ResponseError(
                                        yn.ErrorCodes.InvalidParams,
                                        `Request ${e.method} defines parameters by name but received parameters by position`
                                      ),
                                      e.method,
                                      l
                                    );
                                  s = c(...e.params, o.token);
                                } else {
                                  if (void 0 !== a && a.parameterStructures === yn.ParameterStructures.byPosition)
                                    return void n(
                                      new yn.ResponseError(
                                        yn.ErrorCodes.InvalidParams,
                                        `Request ${e.method} defines parameters by position but received parameters by name`
                                      ),
                                      e.method,
                                      l
                                    );
                                  s = c(e.params, o.token);
                                }
                              else w && (s = w(e.method, e.params, o.token));
                              const u = s;
                              s
                                ? u.then
                                  ? u.then(
                                      n => {
                                        delete k[r], t(n, e.method, l);
                                      },
                                      t => {
                                        delete k[r],
                                          t instanceof yn.ResponseError
                                            ? n(t, e.method, l)
                                            : t && vn.string(t.message)
                                            ? n(
                                                new yn.ResponseError(
                                                  yn.ErrorCodes.InternalError,
                                                  `Request ${e.method} failed with message: ${t.message}`
                                                ),
                                                e.method,
                                                l
                                              )
                                            : n(
                                                new yn.ResponseError(
                                                  yn.ErrorCodes.InternalError,
                                                  `Request ${e.method} failed unexpectedly without providing any details.`
                                                ),
                                                e.method,
                                                l
                                              );
                                      }
                                    )
                                  : (delete k[r], t(s, e.method, l))
                                : (delete k[r], i(s, e.method, l));
                            } catch (i) {
                              delete k[r],
                                i instanceof yn.ResponseError
                                  ? t(i, e.method, l)
                                  : i && vn.string(i.message)
                                  ? n(
                                      new yn.ResponseError(
                                        yn.ErrorCodes.InternalError,
                                        `Request ${e.method} failed with message: ${i.message}`
                                      ),
                                      e.method,
                                      l
                                    )
                                  : n(
                                      new yn.ResponseError(
                                        yn.ErrorCodes.InternalError,
                                        `Request ${e.method} failed unexpectedly without providing any details.`
                                      ),
                                      e.method,
                                      l
                                    );
                            }
                          } else
                            n(
                              new yn.ResponseError(yn.ErrorCodes.MethodNotFound, 'Unhandled method ' + e.method),
                              e.method,
                              l
                            );
                        })(e)
                      : yn.isNotificationMessage(e)
                      ? (function (e) {
                          if (z()) return;
                          let t,
                            i = void 0;
                          if (e.method === n.type.method)
                            t = e => {
                              const t = e.id,
                                n = k[String(t)];
                              n && n.cancel();
                            };
                          else {
                            const n = S[e.method];
                            n && ((t = n.handler), (i = n.type));
                          }
                          if (t || b)
                            try {
                              !(function (e) {
                                if (O === o.Off || !P || e.method === c.type.method) return;
                                if (F === s.Text) {
                                  let t = void 0;
                                  O === o.Verbose &&
                                    (t = e.params
                                      ? `Params: ${JSON.stringify(e.params, null, 4)}\n\n`
                                      : 'No parameters provided.\n\n'),
                                    P.log(`Received notification '${e.method}'.`, t);
                                } else J('receive-notification', e);
                              })(e),
                                t
                                  ? void 0 === e.params
                                    ? (void 0 !== i &&
                                        0 !== i.numberOfParams &&
                                        i.parameterStructures !== yn.ParameterStructures.byName &&
                                        m.error(
                                          `Notification ${e.method} defines ${i.numberOfParams} params but recevied none.`
                                        ),
                                      t())
                                    : Array.isArray(e.params)
                                    ? (void 0 !== i &&
                                        (i.parameterStructures === yn.ParameterStructures.byName &&
                                          m.error(
                                            `Notification ${e.method} defines parameters by name but received parameters by position`
                                          ),
                                        i.numberOfParams !== e.params.length &&
                                          m.error(
                                            `Notification ${e.method} defines ${i.numberOfParams} params but received ${e.params.length} argumennts`
                                          )),
                                      t(...e.params))
                                    : (void 0 !== i &&
                                        i.parameterStructures === yn.ParameterStructures.byPosition &&
                                        m.error(
                                          `Notification ${e.method} defines parameters by position but received parameters by name`
                                        ),
                                      t(e.params))
                                  : b && b(e.method, e.params);
                            } catch (t) {
                              t.message
                                ? m.error(`Notification handler '${e.method}' failed with message: ${t.message}`)
                                : m.error(`Notification handler '${e.method}' failed unexpectedly.`);
                            }
                          else M.fire(e);
                        })(e)
                      : yn.isResponseMessage(e)
                      ? (function (e) {
                          if (z()) return;
                          if (null === e.id)
                            e.error
                              ? m.error(
                                  'Received response message without id: Error is: \n' +
                                    JSON.stringify(e.error, void 0, 4)
                                )
                              : m.error('Received response message without id. No further error information provided.');
                          else {
                            const t = String(e.id),
                              n = x[t];
                            if (
                              ((function (e, t) {
                                if (O === o.Off || !P) return;
                                if (F === s.Text) {
                                  let n = void 0;
                                  if (
                                    (O === o.Verbose &&
                                      (e.error && e.error.data
                                        ? (n = `Error data: ${JSON.stringify(e.error.data, null, 4)}\n\n`)
                                        : e.result
                                        ? (n = `Result: ${JSON.stringify(e.result, null, 4)}\n\n`)
                                        : void 0 === e.error && (n = 'No result returned.\n\n')),
                                    t)
                                  ) {
                                    const i = e.error ? ` Request failed: ${e.error.message} (${e.error.code}).` : '';
                                    P.log(
                                      `Received response '${t.method} - (${e.id})' in ${
                                        Date.now() - t.timerStart
                                      }ms.${i}`,
                                      n
                                    );
                                  } else P.log(`Received response ${e.id} without active response promise.`, n);
                                } else J('receive-response', e);
                              })(e, n),
                              n)
                            ) {
                              delete x[t];
                              try {
                                if (e.error) {
                                  const t = e.error;
                                  n.reject(new yn.ResponseError(t.code, t.message, t.data));
                                } else {
                                  if (void 0 === e.result) throw new Error('Should never happen.');
                                  n.resolve(e.result);
                                }
                              } catch (e) {
                                e.message
                                  ? m.error(`Response handler '${n.method}' failed with message: ${e.message}`)
                                  : m.error(`Response handler '${n.method}' failed unexpectedly.`);
                              }
                            }
                          }
                        })(e)
                      : (function (e) {
                          if (!e) return void m.error('Received empty message.');
                          m.error(
                            'Received message which is neither a response nor a notification message:\n' +
                              JSON.stringify(e, null, 4)
                          );
                          const t = e;
                          if (vn.string(t.id) || vn.number(t.id)) {
                            const e = String(t.id),
                              n = x[e];
                            n &&
                              n.reject(new Error('The received response has neither a result nor an error property.'));
                          }
                        })(e);
                  } finally {
                    B();
                  }
                })();
            }));
        }
        e.onClose(V),
          e.onError(function (e) {
            N.fire([e, void 0, void 0]);
          }),
          u.onClose(V),
          u.onError(function (e) {
            N.fire(e);
          });
        const G = e => {
          try {
            if (yn.isNotificationMessage(e) && e.method === n.type.method) {
              const t = $(e.params.id),
                n = E.get(t);
              if (yn.isRequestMessage(n)) {
                const i = null == h ? void 0 : h.connectionStrategy,
                  r = i && i.cancelUndispatched ? i.cancelUndispatched(n, K) : void 0;
                if (r && (void 0 !== r.error || void 0 !== r.result))
                  return E.delete(t), (r.id = n.id), X(r, e.method, Date.now()), void u.write(r);
              }
            }
            W(E, e);
          } finally {
            B();
          }
        };
        function X(e, t, n) {
          if (O !== o.Off && P)
            if (F === s.Text) {
              let i = void 0;
              O === o.Verbose &&
                (e.error && e.error.data
                  ? (i = `Error data: ${JSON.stringify(e.error.data, null, 4)}\n\n`)
                  : e.result
                  ? (i = `Result: ${JSON.stringify(e.result, null, 4)}\n\n`)
                  : void 0 === e.error && (i = 'No result returned.\n\n')),
                P.log(`Sending response '${t} - (${e.id})'. Processing request took ${Date.now() - n}ms`, i);
            } else J('send-response', e);
        }
        function J(e, t) {
          if (!P || O === o.Off) return;
          const n = { isLSPMessage: !0, type: e, message: t, timestamp: Date.now() };
          P.log(n);
        }
        function Y() {
          if (U()) throw new g(l.Closed, 'Connection is closed.');
          if (z()) throw new g(l.Disposed, 'Connection is disposed.');
        }
        function Z(e) {
          return void 0 === e ? null : e;
        }
        function Q(e) {
          return null === e ? void 0 : e;
        }
        function ee(e) {
          return null != e && !Array.isArray(e) && 'object' == typeof e;
        }
        function te(e, t) {
          switch (e) {
            case yn.ParameterStructures.auto:
              return ee(t) ? Q(t) : [Z(t)];
            case yn.ParameterStructures.byName:
              if (!ee(t)) throw new Error('Recevied parameters by name but param is not an object literal.');
              return Q(t);
            case yn.ParameterStructures.byPosition:
              return [Z(t)];
            default:
              throw new Error('Unknown parameter structure ' + e.toString());
          }
        }
        function ne(e, t) {
          let n;
          const i = e.numberOfParams;
          switch (i) {
            case 0:
              n = void 0;
              break;
            case 1:
              n = te(e.parameterStructures, t[0]);
              break;
            default:
              n = [];
              for (let e = 0; e < t.length && e < i; e++) n.push(Z(t[e]));
              if (t.length < i) for (let e = t.length; e < i; e++) n.push(null);
          }
          return n;
        }
        const ie = {
          sendNotification: (e, ...t) => {
            let n, i;
            if ((Y(), vn.string(e))) {
              n = e;
              const r = t[0];
              let o = 0,
                s = yn.ParameterStructures.auto;
              yn.ParameterStructures.is(r) && ((o = 1), (s = r));
              let a = t.length;
              const c = a - o;
              switch (c) {
                case 0:
                  i = void 0;
                  break;
                case 1:
                  i = te(s, t[o]);
                  break;
                default:
                  if (s === yn.ParameterStructures.byName)
                    throw new Error(`Recevied ${c} parameters for 'by Name' notification parameter structure.`);
                  i = t.slice(o, a).map(e => Z(e));
              }
            } else {
              const r = t;
              (n = e.method), (i = ne(e, r));
            }
            const r = { jsonrpc: R, method: n, params: i };
            !(function (e) {
              if (O !== o.Off && P)
                if (F === s.Text) {
                  let t = void 0;
                  O === o.Verbose &&
                    (t = e.params ? `Params: ${JSON.stringify(e.params, null, 4)}\n\n` : 'No parameters provided.\n\n'),
                    P.log(`Sending notification '${e.method}'.`, t);
                } else J('send-notification', e);
            })(r),
              u.write(r);
          },
          onNotification: (e, t) => {
            let n;
            return (
              Y(),
              vn.func(e)
                ? (b = e)
                : t &&
                  (vn.string(e)
                    ? ((n = e), (S[e] = { type: void 0, handler: t }))
                    : ((n = e.method), (S[e.method] = { type: e, handler: t }))),
              {
                dispose: () => {
                  void 0 !== n ? delete S[n] : (b = void 0);
                }
              }
            );
          },
          onProgress: (e, t, n) => {
            if (_.has(t)) throw new Error(`Progress handler for token ${t} already registered`);
            return (
              _.set(t, n),
              {
                dispose: () => {
                  _.delete(t);
                }
              }
            );
          },
          sendProgress: (e, t, n) => {
            ie.sendNotification(i.type, { token: t, value: n });
          },
          onUnhandledProgress: L.event,
          sendRequest: (e, ...t) => {
            let n, i;
            Y(),
              (function () {
                if (!H()) throw new Error('Call listen() first.');
              })();
            let r = void 0;
            if (vn.string(e)) {
              n = e;
              const o = t[0],
                s = t[t.length - 1];
              let a = 0,
                c = yn.ParameterStructures.auto;
              yn.ParameterStructures.is(o) && ((a = 1), (c = o));
              let l = t.length;
              Rn.CancellationToken.is(s) && ((l -= 1), (r = s));
              const u = l - a;
              switch (u) {
                case 0:
                  i = void 0;
                  break;
                case 1:
                  i = te(c, t[a]);
                  break;
                default:
                  if (c === yn.ParameterStructures.byName)
                    throw new Error(`Recevied ${u} parameters for 'by Name' request parameter structure.`);
                  i = t.slice(a, l).map(e => Z(e));
              }
            } else {
              const o = t;
              (n = e.method), (i = ne(e, o));
              const s = e.numberOfParams;
              r = Rn.CancellationToken.is(o[s]) ? o[s] : void 0;
            }
            const a = v++;
            let c;
            r &&
              (c = r.onCancellationRequested(() => {
                j.sender.sendCancellation(ie, a);
              }));
            return new Promise((e, t) => {
              const r = { jsonrpc: R, id: a, method: n, params: i };
              let l = {
                method: n,
                timerStart: Date.now(),
                resolve: t => {
                  e(t), j.sender.cleanup(a), null == c || c.dispose();
                },
                reject: e => {
                  t(e), j.sender.cleanup(a), null == c || c.dispose();
                }
              };
              !(function (e) {
                if (O !== o.Off && P)
                  if (F === s.Text) {
                    let t = void 0;
                    O === o.Verbose && e.params && (t = `Params: ${JSON.stringify(e.params, null, 4)}\n\n`),
                      P.log(`Sending request '${e.method} - (${e.id})'.`, t);
                  } else J('send-request', e);
              })(r);
              try {
                u.write(r);
              } catch (e) {
                l.reject(
                  new yn.ResponseError(yn.ErrorCodes.MessageWriteError, e.message ? e.message : 'Unknown reason')
                ),
                  (l = null);
              }
              l && (x[String(a)] = l);
            });
          },
          onRequest: (e, t) => {
            Y();
            let n = null;
            return (
              r.is(e)
                ? ((n = void 0), (w = e))
                : vn.string(e)
                ? ((n = null), void 0 !== t && ((n = e), (T[e] = { handler: t, type: void 0 })))
                : void 0 !== t && ((n = e.method), (T[e.method] = { type: e, handler: t })),
              {
                dispose: () => {
                  null !== n && (void 0 !== n ? delete T[n] : (w = void 0));
                }
              }
            );
          },
          trace: (e, t, n) => {
            let i = !1,
              r = s.Text;
            void 0 !== n && (vn.boolean(n) ? (i = n) : ((i = n.sendNotification || !1), (r = n.traceFormat || s.Text))),
              (O = e),
              (F = r),
              (P = O === o.Off ? void 0 : t),
              !i || U() || z() || ie.sendNotification(a.type, { value: o.toString(e) });
          },
          onError: N.event,
          onClose: I.event,
          onUnhandledNotification: M.event,
          onDispose: A.event,
          end: () => {
            u.end();
          },
          dispose: () => {
            if (z()) return;
            (q = f.Disposed), A.fire(void 0);
            const t = new Error('Connection got disposed.');
            Object.keys(x).forEach(e => {
              x[e].reject(t);
            }),
              (x = Object.create(null)),
              (k = Object.create(null)),
              (E = new Sn.LinkedMap()),
              vn.func(u.dispose) && u.dispose(),
              vn.func(e.dispose) && e.dispose();
          },
          listen: () => {
            Y(),
              (function () {
                if (H()) throw new g(l.AlreadyListening, 'Connection is already listening');
              })(),
              (q = f.Listening),
              e.listen(G);
          },
          inspect: () => {
            Nt.default().console.log('inspect');
          }
        };
        return (
          ie.onNotification(c.type, e => {
            O !== o.Off && P && P.log(e.message, O === o.Verbose ? e.verbose : void 0);
          }),
          ie.onNotification(i.type, e => {
            const t = _.get(e.token);
            t ? t(e.value) : L.fire(e);
          }),
          ie
        );
      });
  }),
  Dn = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.CancellationSenderStrategy = t.CancellationReceiverStrategy = t.ConnectionError = t.ConnectionErrors = t.LogTraceNotification = t.SetTraceNotification = t.TraceFormat = t.Trace = t.ProgressType = t.createMessageConnection = t.NullLogger = t.ConnectionOptions = t.ConnectionStrategy = t.WriteableStreamMessageWriter = t.AbstractMessageWriter = t.MessageWriter = t.ReadableStreamMessageReader = t.AbstractMessageReader = t.MessageReader = t.CancellationToken = t.CancellationTokenSource = t.Emitter = t.Event = t.Disposable = t.ParameterStructures = t.NotificationType9 = t.NotificationType8 = t.NotificationType7 = t.NotificationType6 = t.NotificationType5 = t.NotificationType4 = t.NotificationType3 = t.NotificationType2 = t.NotificationType1 = t.NotificationType0 = t.NotificationType = t.ErrorCodes = t.ResponseError = t.RequestType9 = t.RequestType8 = t.RequestType7 = t.RequestType6 = t.RequestType5 = t.RequestType4 = t.RequestType3 = t.RequestType2 = t.RequestType1 = t.RequestType0 = t.RequestType = t.RAL = void 0),
      (t.CancellationStrategy = void 0),
      Object.defineProperty(t, 'RequestType', {
        enumerable: !0,
        get: function () {
          return yn.RequestType;
        }
      }),
      Object.defineProperty(t, 'RequestType0', {
        enumerable: !0,
        get: function () {
          return yn.RequestType0;
        }
      }),
      Object.defineProperty(t, 'RequestType1', {
        enumerable: !0,
        get: function () {
          return yn.RequestType1;
        }
      }),
      Object.defineProperty(t, 'RequestType2', {
        enumerable: !0,
        get: function () {
          return yn.RequestType2;
        }
      }),
      Object.defineProperty(t, 'RequestType3', {
        enumerable: !0,
        get: function () {
          return yn.RequestType3;
        }
      }),
      Object.defineProperty(t, 'RequestType4', {
        enumerable: !0,
        get: function () {
          return yn.RequestType4;
        }
      }),
      Object.defineProperty(t, 'RequestType5', {
        enumerable: !0,
        get: function () {
          return yn.RequestType5;
        }
      }),
      Object.defineProperty(t, 'RequestType6', {
        enumerable: !0,
        get: function () {
          return yn.RequestType6;
        }
      }),
      Object.defineProperty(t, 'RequestType7', {
        enumerable: !0,
        get: function () {
          return yn.RequestType7;
        }
      }),
      Object.defineProperty(t, 'RequestType8', {
        enumerable: !0,
        get: function () {
          return yn.RequestType8;
        }
      }),
      Object.defineProperty(t, 'RequestType9', {
        enumerable: !0,
        get: function () {
          return yn.RequestType9;
        }
      }),
      Object.defineProperty(t, 'ResponseError', {
        enumerable: !0,
        get: function () {
          return yn.ResponseError;
        }
      }),
      Object.defineProperty(t, 'ErrorCodes', {
        enumerable: !0,
        get: function () {
          return yn.ErrorCodes;
        }
      }),
      Object.defineProperty(t, 'NotificationType', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType;
        }
      }),
      Object.defineProperty(t, 'NotificationType0', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType0;
        }
      }),
      Object.defineProperty(t, 'NotificationType1', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType1;
        }
      }),
      Object.defineProperty(t, 'NotificationType2', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType2;
        }
      }),
      Object.defineProperty(t, 'NotificationType3', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType3;
        }
      }),
      Object.defineProperty(t, 'NotificationType4', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType4;
        }
      }),
      Object.defineProperty(t, 'NotificationType5', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType5;
        }
      }),
      Object.defineProperty(t, 'NotificationType6', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType6;
        }
      }),
      Object.defineProperty(t, 'NotificationType7', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType7;
        }
      }),
      Object.defineProperty(t, 'NotificationType8', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType8;
        }
      }),
      Object.defineProperty(t, 'NotificationType9', {
        enumerable: !0,
        get: function () {
          return yn.NotificationType9;
        }
      }),
      Object.defineProperty(t, 'ParameterStructures', {
        enumerable: !0,
        get: function () {
          return yn.ParameterStructures;
        }
      }),
      Object.defineProperty(t, 'Disposable', {
        enumerable: !0,
        get: function () {
          return It.Disposable;
        }
      }),
      Object.defineProperty(t, 'Event', {
        enumerable: !0,
        get: function () {
          return Cn.Event;
        }
      }),
      Object.defineProperty(t, 'Emitter', {
        enumerable: !0,
        get: function () {
          return Cn.Emitter;
        }
      }),
      Object.defineProperty(t, 'CancellationTokenSource', {
        enumerable: !0,
        get: function () {
          return Rn.CancellationTokenSource;
        }
      }),
      Object.defineProperty(t, 'CancellationToken', {
        enumerable: !0,
        get: function () {
          return Rn.CancellationToken;
        }
      }),
      Object.defineProperty(t, 'MessageReader', {
        enumerable: !0,
        get: function () {
          return wn.MessageReader;
        }
      }),
      Object.defineProperty(t, 'AbstractMessageReader', {
        enumerable: !0,
        get: function () {
          return wn.AbstractMessageReader;
        }
      }),
      Object.defineProperty(t, 'ReadableStreamMessageReader', {
        enumerable: !0,
        get: function () {
          return wn.ReadableStreamMessageReader;
        }
      }),
      Object.defineProperty(t, 'MessageWriter', {
        enumerable: !0,
        get: function () {
          return bn.MessageWriter;
        }
      }),
      Object.defineProperty(t, 'AbstractMessageWriter', {
        enumerable: !0,
        get: function () {
          return bn.AbstractMessageWriter;
        }
      }),
      Object.defineProperty(t, 'WriteableStreamMessageWriter', {
        enumerable: !0,
        get: function () {
          return bn.WriteableStreamMessageWriter;
        }
      }),
      Object.defineProperty(t, 'ConnectionStrategy', {
        enumerable: !0,
        get: function () {
          return _n.ConnectionStrategy;
        }
      }),
      Object.defineProperty(t, 'ConnectionOptions', {
        enumerable: !0,
        get: function () {
          return _n.ConnectionOptions;
        }
      }),
      Object.defineProperty(t, 'NullLogger', {
        enumerable: !0,
        get: function () {
          return _n.NullLogger;
        }
      }),
      Object.defineProperty(t, 'createMessageConnection', {
        enumerable: !0,
        get: function () {
          return _n.createMessageConnection;
        }
      }),
      Object.defineProperty(t, 'ProgressType', {
        enumerable: !0,
        get: function () {
          return _n.ProgressType;
        }
      }),
      Object.defineProperty(t, 'Trace', {
        enumerable: !0,
        get: function () {
          return _n.Trace;
        }
      }),
      Object.defineProperty(t, 'TraceFormat', {
        enumerable: !0,
        get: function () {
          return _n.TraceFormat;
        }
      }),
      Object.defineProperty(t, 'SetTraceNotification', {
        enumerable: !0,
        get: function () {
          return _n.SetTraceNotification;
        }
      }),
      Object.defineProperty(t, 'LogTraceNotification', {
        enumerable: !0,
        get: function () {
          return _n.LogTraceNotification;
        }
      }),
      Object.defineProperty(t, 'ConnectionErrors', {
        enumerable: !0,
        get: function () {
          return _n.ConnectionErrors;
        }
      }),
      Object.defineProperty(t, 'ConnectionError', {
        enumerable: !0,
        get: function () {
          return _n.ConnectionError;
        }
      }),
      Object.defineProperty(t, 'CancellationReceiverStrategy', {
        enumerable: !0,
        get: function () {
          return _n.CancellationReceiverStrategy;
        }
      }),
      Object.defineProperty(t, 'CancellationSenderStrategy', {
        enumerable: !0,
        get: function () {
          return _n.CancellationSenderStrategy;
        }
      }),
      Object.defineProperty(t, 'CancellationStrategy', {
        enumerable: !0,
        get: function () {
          return _n.CancellationStrategy;
        }
      }),
      (t.RAL = Nt.default);
  }),
  Pn = _(function (e, t) {
    var n =
        (b && b.__createBinding) ||
        (Object.create
          ? function (e, t, n, i) {
              void 0 === i && (i = n),
                Object.defineProperty(e, i, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, i) {
              void 0 === i && (i = n), (e[i] = t[n]);
            }),
      i =
        (b && b.__exportStar) ||
        function (e, t) {
          for (var i in e) 'default' === i || Object.prototype.hasOwnProperty.call(t, i) || n(t, e, i);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createMessageConnection = t.createServerSocketTransport = t.createClientSocketTransport = t.createServerPipeTransport = t.createClientPipeTransport = t.generateRandomPipeName = t.StreamMessageWriter = t.StreamMessageReader = t.SocketMessageWriter = t.SocketMessageReader = t.IPCMessageWriter = t.IPCMessageReader = void 0),
      mn.default.install(),
      i(Dn, t);
    class r extends Dn.AbstractMessageReader {
      constructor(e) {
        super(), (this.process = e);
        let t = this.process;
        t.on('error', e => this.fireError(e)), t.on('close', () => this.fireClose());
      }
      listen(e) {
        return this.process.on('message', e), Dn.Disposable.create(() => this.process.off('message', e));
      }
    }
    t.IPCMessageReader = r;
    class o extends Dn.AbstractMessageWriter {
      constructor(e) {
        super(), (this.process = e), (this.errorCount = 0);
        let t = this.process;
        t.on('error', e => this.fireError(e)), t.on('close', () => this.fireClose);
      }
      write(e) {
        try {
          return (
            'function' == typeof this.process.send &&
              this.process.send(e, void 0, void 0, t => {
                t ? (this.errorCount++, this.handleError(t, e)) : (this.errorCount = 0);
              }),
            Promise.resolve()
          );
        } catch (t) {
          return this.handleError(t, e), Promise.reject(t);
        }
      }
      handleError(e, t) {
        this.errorCount++, this.fireError(e, t, this.errorCount);
      }
      end() {}
    }
    t.IPCMessageWriter = o;
    class s extends Dn.ReadableStreamMessageReader {
      constructor(e, t = 'utf-8') {
        super(mn.default().stream.asReadableStream(e), t);
      }
    }
    t.SocketMessageReader = s;
    class a extends Dn.WriteableStreamMessageWriter {
      constructor(e, t) {
        super(mn.default().stream.asWritableStream(e), t), (this.socket = e);
      }
      dispose() {
        super.dispose(), this.socket.destroy();
      }
    }
    t.SocketMessageWriter = a;
    class c extends Dn.ReadableStreamMessageReader {
      constructor(e, t) {
        super(mn.default().stream.asReadableStream(e), t);
      }
    }
    t.StreamMessageReader = c;
    class l extends Dn.WriteableStreamMessageWriter {
      constructor(e, t) {
        super(mn.default().stream.asWritableStream(e), t);
      }
    }
    t.StreamMessageWriter = l;
    const u = process.env.XDG_RUNTIME_DIR,
      d = new Map([
        ['linux', 107],
        ['darwin', 103]
      ]);
    (t.generateRandomPipeName = function () {
      const e = v.default.randomBytes(21).toString('hex');
      if ('win32' === process.platform) return `\\\\.\\pipe\\vscode-jsonrpc-${e}-sock`;
      let t;
      t = u ? p.default.join(u, `vscode-ipc-${e}.sock`) : p.default.join(m.default.tmpdir(), `vscode-${e}.sock`);
      const n = d.get(process.platform);
      return (
        void 0 !== n &&
          t.length >= n &&
          mn.default().console.warn(`WARNING: IPC handle "${t}" is longer than ${n} characters.`),
        t
      );
    }),
      (t.createClientPipeTransport = function (e, t = 'utf-8') {
        let n;
        const i = new Promise((e, t) => {
          n = e;
        });
        return new Promise((r, o) => {
          let c = y.default.createServer(e => {
            c.close(), n([new s(e, t), new a(e, t)]);
          });
          c.on('error', o),
            c.listen(e, () => {
              c.removeListener('error', o), r({ onConnected: () => i });
            });
        });
      }),
      (t.createServerPipeTransport = function (e, t = 'utf-8') {
        const n = y.default.createConnection(e);
        return [new s(n, t), new a(n, t)];
      }),
      (t.createClientSocketTransport = function (e, t = 'utf-8') {
        let n;
        const i = new Promise((e, t) => {
          n = e;
        });
        return new Promise((r, o) => {
          const c = y.default.createServer(e => {
            c.close(), n([new s(e, t), new a(e, t)]);
          });
          c.on('error', o),
            c.listen(e, '127.0.0.1', () => {
              c.removeListener('error', o), r({ onConnected: () => i });
            });
        });
      }),
      (t.createServerSocketTransport = function (e, t = 'utf-8') {
        const n = y.default.createConnection(e, '127.0.0.1');
        return [new s(n, t), new a(n, t)];
      }),
      (t.createMessageConnection = function (e, t, n, i) {
        n || (n = Dn.NullLogger);
        const r = (function (e) {
            const t = e;
            return void 0 !== t.read && void 0 !== t.addListener;
          })(e)
            ? new c(e)
            : e,
          o = (function (e) {
            const t = e;
            return void 0 !== t.write && void 0 !== t.addListener;
          })(t)
            ? new l(t)
            : t;
        return Dn.ConnectionStrategy.is(i) && (i = { connectionStrategy: i }), Dn.createMessageConnection(r, o, n, i);
      });
  }),
  En = Pn;
!(function (e) {
  (e.MIN_VALUE = -2147483648), (e.MAX_VALUE = 2147483647);
})(Kt || (Kt = {})),
  (function (e) {
    (e.MIN_VALUE = 0), (e.MAX_VALUE = 2147483647);
  })(Ht || (Ht = {})),
  (function (e) {
    (e.create = function (e, t) {
      return (
        e === Number.MAX_VALUE && (e = Ht.MAX_VALUE),
        t === Number.MAX_VALUE && (t = Ht.MAX_VALUE),
        { line: e, character: t }
      );
    }),
      (e.is = function (e) {
        var t = e;
        return li.objectLiteral(t) && li.uinteger(t.line) && li.uinteger(t.character);
      });
  })(Ut || (Ut = {})),
  (function (e) {
    (e.create = function (e, t, n, i) {
      if (li.uinteger(e) && li.uinteger(t) && li.uinteger(n) && li.uinteger(i))
        return { start: Ut.create(e, t), end: Ut.create(n, i) };
      if (Ut.is(e) && Ut.is(t)) return { start: e, end: t };
      throw new Error('Range#create called with invalid arguments[' + e + ', ' + t + ', ' + n + ', ' + i + ']');
    }),
      (e.is = function (e) {
        var t = e;
        return li.objectLiteral(t) && Ut.is(t.start) && Ut.is(t.end);
      });
  })(zt || (zt = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { uri: e, range: t };
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && zt.is(t.range) && (li.string(t.uri) || li.undefined(t.uri));
      });
  })(Vt || (Vt = {})),
  (function (e) {
    (e.create = function (e, t, n, i) {
      return { targetUri: e, targetRange: t, targetSelectionRange: n, originSelectionRange: i };
    }),
      (e.is = function (e) {
        var t = e;
        return (
          li.defined(t) &&
          zt.is(t.targetRange) &&
          li.string(t.targetUri) &&
          (zt.is(t.targetSelectionRange) || li.undefined(t.targetSelectionRange)) &&
          (zt.is(t.originSelectionRange) || li.undefined(t.originSelectionRange))
        );
      });
  })(Bt || (Bt = {})),
  (function (e) {
    (e.create = function (e, t, n, i) {
      return { red: e, green: t, blue: n, alpha: i };
    }),
      (e.is = function (e) {
        var t = e;
        return (
          li.numberRange(t.red, 0, 1) &&
          li.numberRange(t.green, 0, 1) &&
          li.numberRange(t.blue, 0, 1) &&
          li.numberRange(t.alpha, 0, 1)
        );
      });
  })(Gt || (Gt = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { range: e, color: t };
    }),
      (e.is = function (e) {
        var t = e;
        return zt.is(t.range) && Gt.is(t.color);
      });
  })(Xt || (Xt = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      return { label: e, textEdit: t, additionalTextEdits: n };
    }),
      (e.is = function (e) {
        var t = e;
        return (
          li.string(t.label) &&
          (li.undefined(t.textEdit) || sn.is(t)) &&
          (li.undefined(t.additionalTextEdits) || li.typedArray(t.additionalTextEdits, sn.is))
        );
      });
  })(Jt || (Jt = {})),
  (function (e) {
    (e.Comment = 'comment'), (e.Imports = 'imports'), (e.Region = 'region');
  })(Yt || (Yt = {})),
  (function (e) {
    (e.create = function (e, t, n, i, r) {
      var o = { startLine: e, endLine: t };
      return (
        li.defined(n) && (o.startCharacter = n), li.defined(i) && (o.endCharacter = i), li.defined(r) && (o.kind = r), o
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          li.uinteger(t.startLine) &&
          li.uinteger(t.startLine) &&
          (li.undefined(t.startCharacter) || li.uinteger(t.startCharacter)) &&
          (li.undefined(t.endCharacter) || li.uinteger(t.endCharacter)) &&
          (li.undefined(t.kind) || li.string(t.kind))
        );
      });
  })(Zt || (Zt = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { location: e, message: t };
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && Vt.is(t.location) && li.string(t.message);
      });
  })(Qt || (Qt = {})),
  (function (e) {
    (e.Error = 1), (e.Warning = 2), (e.Information = 3), (e.Hint = 4);
  })(en || (en = {})),
  (function (e) {
    (e.Unnecessary = 1), (e.Deprecated = 2);
  })(tn || (tn = {})),
  (function (e) {
    e.is = function (e) {
      var t = e;
      return null != t && li.string(t.href);
    };
  })(nn || (nn = {})),
  (function (e) {
    (e.create = function (e, t, n, i, r, o) {
      var s = { range: e, message: t };
      return (
        li.defined(n) && (s.severity = n),
        li.defined(i) && (s.code = i),
        li.defined(r) && (s.source = r),
        li.defined(o) && (s.relatedInformation = o),
        s
      );
    }),
      (e.is = function (e) {
        var t,
          n = e;
        return (
          li.defined(n) &&
          zt.is(n.range) &&
          li.string(n.message) &&
          (li.number(n.severity) || li.undefined(n.severity)) &&
          (li.integer(n.code) || li.string(n.code) || li.undefined(n.code)) &&
          (li.undefined(n.codeDescription) ||
            li.string(null === (t = n.codeDescription) || void 0 === t ? void 0 : t.href)) &&
          (li.string(n.source) || li.undefined(n.source)) &&
          (li.undefined(n.relatedInformation) || li.typedArray(n.relatedInformation, Qt.is))
        );
      });
  })(rn || (rn = {})),
  (function (e) {
    (e.create = function (e, t) {
      for (var n = [], i = 2; i < arguments.length; i++) n[i - 2] = arguments[i];
      var r = { title: e, command: t };
      return li.defined(n) && n.length > 0 && (r.arguments = n), r;
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && li.string(t.title) && li.string(t.command);
      });
  })(on || (on = {})),
  (function (e) {
    (e.replace = function (e, t) {
      return { range: e, newText: t };
    }),
      (e.insert = function (e, t) {
        return { range: { start: e, end: e }, newText: t };
      }),
      (e.del = function (e) {
        return { range: e, newText: '' };
      }),
      (e.is = function (e) {
        var t = e;
        return li.objectLiteral(t) && li.string(t.newText) && zt.is(t.range);
      });
  })(sn || (sn = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      var i = { label: e };
      return void 0 !== t && (i.needsConfirmation = t), void 0 !== n && (i.description = n), i;
    }),
      (e.is = function (e) {
        var t = e;
        return (
          void 0 !== t &&
          li.objectLiteral(t) &&
          li.string(t.label) &&
          (li.boolean(t.needsConfirmation) || void 0 === t.needsConfirmation) &&
          (li.string(t.description) || void 0 === t.description)
        );
      });
  })(an || (an = {})),
  (function (e) {
    e.is = function (e) {
      return 'string' == typeof e;
    };
  })(cn || (cn = {})),
  (function (e) {
    (e.replace = function (e, t, n) {
      return { range: e, newText: t, annotationId: n };
    }),
      (e.insert = function (e, t, n) {
        return { range: { start: e, end: e }, newText: t, annotationId: n };
      }),
      (e.del = function (e, t) {
        return { range: e, newText: '', annotationId: t };
      }),
      (e.is = function (e) {
        var t = e;
        return sn.is(t) && (an.is(t.annotationId) || cn.is(t.annotationId));
      });
  })(ln || (ln = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { textDocument: e, edits: t };
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && On.is(t.textDocument) && Array.isArray(t.edits);
      });
  })(un || (un = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      var i = { kind: 'create', uri: e };
      return (
        void 0 === t || (void 0 === t.overwrite && void 0 === t.ignoreIfExists) || (i.options = t),
        void 0 !== n && (i.annotationId = n),
        i
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          'create' === t.kind &&
          li.string(t.uri) &&
          (void 0 === t.options ||
            ((void 0 === t.options.overwrite || li.boolean(t.options.overwrite)) &&
              (void 0 === t.options.ignoreIfExists || li.boolean(t.options.ignoreIfExists)))) &&
          (void 0 === t.annotationId || cn.is(t.annotationId))
        );
      });
  })(dn || (dn = {})),
  (function (e) {
    (e.create = function (e, t, n, i) {
      var r = { kind: 'rename', oldUri: e, newUri: t };
      return (
        void 0 === n || (void 0 === n.overwrite && void 0 === n.ignoreIfExists) || (r.options = n),
        void 0 !== i && (r.annotationId = i),
        r
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          'rename' === t.kind &&
          li.string(t.oldUri) &&
          li.string(t.newUri) &&
          (void 0 === t.options ||
            ((void 0 === t.options.overwrite || li.boolean(t.options.overwrite)) &&
              (void 0 === t.options.ignoreIfExists || li.boolean(t.options.ignoreIfExists)))) &&
          (void 0 === t.annotationId || cn.is(t.annotationId))
        );
      });
  })(hn || (hn = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      var i = { kind: 'delete', uri: e };
      return (
        void 0 === t || (void 0 === t.recursive && void 0 === t.ignoreIfNotExists) || (i.options = t),
        void 0 !== n && (i.annotationId = n),
        i
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          'delete' === t.kind &&
          li.string(t.uri) &&
          (void 0 === t.options ||
            ((void 0 === t.options.recursive || li.boolean(t.options.recursive)) &&
              (void 0 === t.options.ignoreIfNotExists || li.boolean(t.options.ignoreIfNotExists)))) &&
          (void 0 === t.annotationId || cn.is(t.annotationId))
        );
      });
  })(pn || (pn = {})),
  (function (e) {
    e.is = function (e) {
      var t = e;
      return (
        t &&
        (void 0 !== t.changes || void 0 !== t.documentChanges) &&
        (void 0 === t.documentChanges ||
          t.documentChanges.every(function (e) {
            return li.string(e.kind) ? dn.is(e) || hn.is(e) || pn.is(e) : un.is(e);
          }))
      );
    };
  })(fn || (fn = {}));
var xn,
  kn,
  On,
  Fn,
  qn,
  Nn,
  In,
  Mn,
  Ln,
  An,
  jn,
  $n,
  Wn,
  Kn,
  Hn,
  Un,
  zn,
  Vn,
  Bn,
  Gn,
  Xn,
  Jn,
  Yn,
  Zn,
  Qn,
  ei,
  ti,
  ni,
  ii,
  ri,
  oi = (function () {
    function e(e, t) {
      (this.edits = e), (this.changeAnnotations = t);
    }
    return (
      (e.prototype.insert = function (e, t, n) {
        var i, r;
        if (
          (void 0 === n
            ? (i = sn.insert(e, t))
            : cn.is(n)
            ? ((r = n), (i = ln.insert(e, t, n)))
            : (this.assertChangeAnnotations(this.changeAnnotations),
              (r = this.changeAnnotations.manage(n)),
              (i = ln.insert(e, t, r))),
          this.edits.push(i),
          void 0 !== r)
        )
          return r;
      }),
      (e.prototype.replace = function (e, t, n) {
        var i, r;
        if (
          (void 0 === n
            ? (i = sn.replace(e, t))
            : cn.is(n)
            ? ((r = n), (i = ln.replace(e, t, n)))
            : (this.assertChangeAnnotations(this.changeAnnotations),
              (r = this.changeAnnotations.manage(n)),
              (i = ln.replace(e, t, r))),
          this.edits.push(i),
          void 0 !== r)
        )
          return r;
      }),
      (e.prototype.delete = function (e, t) {
        var n, i;
        if (
          (void 0 === t
            ? (n = sn.del(e))
            : cn.is(t)
            ? ((i = t), (n = ln.del(e, t)))
            : (this.assertChangeAnnotations(this.changeAnnotations),
              (i = this.changeAnnotations.manage(t)),
              (n = ln.del(e, i))),
          this.edits.push(n),
          void 0 !== i)
        )
          return i;
      }),
      (e.prototype.add = function (e) {
        this.edits.push(e);
      }),
      (e.prototype.all = function () {
        return this.edits;
      }),
      (e.prototype.clear = function () {
        this.edits.splice(0, this.edits.length);
      }),
      (e.prototype.assertChangeAnnotations = function (e) {
        if (void 0 === e) throw new Error('Text edit change is not configured to manage change annotations.');
      }),
      e
    );
  })(),
  si = (function () {
    function e(e) {
      (this._annotations = void 0 === e ? Object.create(null) : e), (this._counter = 0), (this._size = 0);
    }
    return (
      (e.prototype.all = function () {
        return this._annotations;
      }),
      Object.defineProperty(e.prototype, 'size', {
        get: function () {
          return this._size;
        },
        enumerable: !1,
        configurable: !0
      }),
      (e.prototype.manage = function (e, t) {
        var n;
        if ((cn.is(e) ? (n = e) : ((n = this.nextId()), (t = e)), void 0 !== this._annotations[n]))
          throw new Error('Id ' + n + ' is already in use.');
        if (void 0 === t) throw new Error('No annotation provided for id ' + n);
        return (this._annotations[n] = t), this._size++, n;
      }),
      (e.prototype.nextId = function () {
        return this._counter++, this._counter.toString();
      }),
      e
    );
  })(),
  ai = (function () {
    function e(e) {
      var t = this;
      (this._textEditChanges = Object.create(null)),
        void 0 !== e
          ? ((this._workspaceEdit = e),
            e.documentChanges
              ? ((this._changeAnnotations = new si(e.changeAnnotations)),
                (e.changeAnnotations = this._changeAnnotations.all()),
                e.documentChanges.forEach(function (e) {
                  if (un.is(e)) {
                    var n = new oi(e.edits, t._changeAnnotations);
                    t._textEditChanges[e.textDocument.uri] = n;
                  }
                }))
              : e.changes &&
                Object.keys(e.changes).forEach(function (n) {
                  var i = new oi(e.changes[n]);
                  t._textEditChanges[n] = i;
                }))
          : (this._workspaceEdit = {});
    }
    return (
      Object.defineProperty(e.prototype, 'edit', {
        get: function () {
          return (
            this.initDocumentChanges(),
            void 0 !== this._changeAnnotations &&
              (0 === this._changeAnnotations.size
                ? (this._workspaceEdit.changeAnnotations = void 0)
                : (this._workspaceEdit.changeAnnotations = this._changeAnnotations.all())),
            this._workspaceEdit
          );
        },
        enumerable: !1,
        configurable: !0
      }),
      (e.prototype.getTextEditChange = function (e) {
        if (On.is(e)) {
          if ((this.initDocumentChanges(), void 0 === this._workspaceEdit.documentChanges))
            throw new Error('Workspace edit is not configured for document changes.');
          var t = { uri: e.uri, version: e.version };
          if (!(i = this._textEditChanges[t.uri])) {
            var n = { textDocument: t, edits: (r = []) };
            this._workspaceEdit.documentChanges.push(n),
              (i = new oi(r, this._changeAnnotations)),
              (this._textEditChanges[t.uri] = i);
          }
          return i;
        }
        if ((this.initChanges(), void 0 === this._workspaceEdit.changes))
          throw new Error('Workspace edit is not configured for normal text edit changes.');
        var i;
        if (!(i = this._textEditChanges[e])) {
          var r = [];
          (this._workspaceEdit.changes[e] = r), (i = new oi(r)), (this._textEditChanges[e] = i);
        }
        return i;
      }),
      (e.prototype.initDocumentChanges = function () {
        void 0 === this._workspaceEdit.documentChanges &&
          void 0 === this._workspaceEdit.changes &&
          ((this._changeAnnotations = new si()),
          (this._workspaceEdit.documentChanges = []),
          (this._workspaceEdit.changeAnnotations = this._changeAnnotations.all()));
      }),
      (e.prototype.initChanges = function () {
        void 0 === this._workspaceEdit.documentChanges &&
          void 0 === this._workspaceEdit.changes &&
          (this._workspaceEdit.changes = Object.create(null));
      }),
      (e.prototype.createFile = function (e, t, n) {
        if ((this.initDocumentChanges(), void 0 === this._workspaceEdit.documentChanges))
          throw new Error('Workspace edit is not configured for document changes.');
        var i, r, o;
        if (
          (an.is(t) || cn.is(t) ? (i = t) : (n = t),
          void 0 === i
            ? (r = dn.create(e, n))
            : ((o = cn.is(i) ? i : this._changeAnnotations.manage(i)), (r = dn.create(e, n, o))),
          this._workspaceEdit.documentChanges.push(r),
          void 0 !== o)
        )
          return o;
      }),
      (e.prototype.renameFile = function (e, t, n, i) {
        if ((this.initDocumentChanges(), void 0 === this._workspaceEdit.documentChanges))
          throw new Error('Workspace edit is not configured for document changes.');
        var r, o, s;
        if (
          (an.is(n) || cn.is(n) ? (r = n) : (i = n),
          void 0 === r
            ? (o = hn.create(e, t, i))
            : ((s = cn.is(r) ? r : this._changeAnnotations.manage(r)), (o = hn.create(e, t, i, s))),
          this._workspaceEdit.documentChanges.push(o),
          void 0 !== s)
        )
          return s;
      }),
      (e.prototype.deleteFile = function (e, t, n) {
        if ((this.initDocumentChanges(), void 0 === this._workspaceEdit.documentChanges))
          throw new Error('Workspace edit is not configured for document changes.');
        var i, r, o;
        if (
          (an.is(t) || cn.is(t) ? (i = t) : (n = t),
          void 0 === i
            ? (r = pn.create(e, n))
            : ((o = cn.is(i) ? i : this._changeAnnotations.manage(i)), (r = pn.create(e, n, o))),
          this._workspaceEdit.documentChanges.push(r),
          void 0 !== o)
        )
          return o;
      }),
      e
    );
  })();
!(function (e) {
  (e.create = function (e) {
    return { uri: e };
  }),
    (e.is = function (e) {
      var t = e;
      return li.defined(t) && li.string(t.uri);
    });
})(xn || (xn = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { uri: e, version: t };
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && li.string(t.uri) && li.integer(t.version);
      });
  })(kn || (kn = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { uri: e, version: t };
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && li.string(t.uri) && (null === t.version || li.integer(t.version));
      });
  })(On || (On = {})),
  (function (e) {
    (e.create = function (e, t, n, i) {
      return { uri: e, languageId: t, version: n, text: i };
    }),
      (e.is = function (e) {
        var t = e;
        return (
          li.defined(t) && li.string(t.uri) && li.string(t.languageId) && li.integer(t.version) && li.string(t.text)
        );
      });
  })(Fn || (Fn = {})),
  (function (e) {
    (e.PlainText = 'plaintext'), (e.Markdown = 'markdown');
  })(qn || (qn = {})),
  (function (e) {
    e.is = function (t) {
      var n = t;
      return n === e.PlainText || n === e.Markdown;
    };
  })(qn || (qn = {})),
  (function (e) {
    e.is = function (e) {
      var t = e;
      return li.objectLiteral(e) && qn.is(t.kind) && li.string(t.value);
    };
  })(Nn || (Nn = {})),
  (function (e) {
    (e.Text = 1),
      (e.Method = 2),
      (e.Function = 3),
      (e.Constructor = 4),
      (e.Field = 5),
      (e.Variable = 6),
      (e.Class = 7),
      (e.Interface = 8),
      (e.Module = 9),
      (e.Property = 10),
      (e.Unit = 11),
      (e.Value = 12),
      (e.Enum = 13),
      (e.Keyword = 14),
      (e.Snippet = 15),
      (e.Color = 16),
      (e.File = 17),
      (e.Reference = 18),
      (e.Folder = 19),
      (e.EnumMember = 20),
      (e.Constant = 21),
      (e.Struct = 22),
      (e.Event = 23),
      (e.Operator = 24),
      (e.TypeParameter = 25);
  })(In || (In = {})),
  (function (e) {
    (e.PlainText = 1), (e.Snippet = 2);
  })(Mn || (Mn = {})),
  (function (e) {
    e.Deprecated = 1;
  })(Ln || (Ln = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      return { newText: e, insert: t, replace: n };
    }),
      (e.is = function (e) {
        var t = e;
        return t && li.string(t.newText) && zt.is(t.insert) && zt.is(t.replace);
      });
  })(An || (An = {})),
  (function (e) {
    (e.asIs = 1), (e.adjustIndentation = 2);
  })(jn || (jn = {})),
  (function (e) {
    e.create = function (e) {
      return { label: e };
    };
  })($n || ($n = {})),
  (function (e) {
    e.create = function (e, t) {
      return { items: e || [], isIncomplete: !!t };
    };
  })(Wn || (Wn = {})),
  (function (e) {
    (e.fromPlainText = function (e) {
      return e.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
    }),
      (e.is = function (e) {
        var t = e;
        return li.string(t) || (li.objectLiteral(t) && li.string(t.language) && li.string(t.value));
      });
  })(Kn || (Kn = {})),
  (function (e) {
    e.is = function (e) {
      var t = e;
      return (
        !!t &&
        li.objectLiteral(t) &&
        (Nn.is(t.contents) || Kn.is(t.contents) || li.typedArray(t.contents, Kn.is)) &&
        (void 0 === e.range || zt.is(e.range))
      );
    };
  })(Hn || (Hn = {})),
  (function (e) {
    e.create = function (e, t) {
      return t ? { label: e, documentation: t } : { label: e };
    };
  })(Un || (Un = {})),
  (function (e) {
    e.create = function (e, t) {
      for (var n = [], i = 2; i < arguments.length; i++) n[i - 2] = arguments[i];
      var r = { label: e };
      return li.defined(t) && (r.documentation = t), li.defined(n) ? (r.parameters = n) : (r.parameters = []), r;
    };
  })(zn || (zn = {})),
  (function (e) {
    (e.Text = 1), (e.Read = 2), (e.Write = 3);
  })(Vn || (Vn = {})),
  (function (e) {
    e.create = function (e, t) {
      var n = { range: e };
      return li.number(t) && (n.kind = t), n;
    };
  })(Bn || (Bn = {})),
  (function (e) {
    (e.File = 1),
      (e.Module = 2),
      (e.Namespace = 3),
      (e.Package = 4),
      (e.Class = 5),
      (e.Method = 6),
      (e.Property = 7),
      (e.Field = 8),
      (e.Constructor = 9),
      (e.Enum = 10),
      (e.Interface = 11),
      (e.Function = 12),
      (e.Variable = 13),
      (e.Constant = 14),
      (e.String = 15),
      (e.Number = 16),
      (e.Boolean = 17),
      (e.Array = 18),
      (e.Object = 19),
      (e.Key = 20),
      (e.Null = 21),
      (e.EnumMember = 22),
      (e.Struct = 23),
      (e.Event = 24),
      (e.Operator = 25),
      (e.TypeParameter = 26);
  })(Gn || (Gn = {})),
  (function (e) {
    e.Deprecated = 1;
  })(Xn || (Xn = {})),
  (function (e) {
    e.create = function (e, t, n, i, r) {
      var o = { name: e, kind: t, location: { uri: i, range: n } };
      return r && (o.containerName = r), o;
    };
  })(Jn || (Jn = {})),
  (function (e) {
    (e.create = function (e, t, n, i, r, o) {
      var s = { name: e, detail: t, kind: n, range: i, selectionRange: r };
      return void 0 !== o && (s.children = o), s;
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          li.string(t.name) &&
          li.number(t.kind) &&
          zt.is(t.range) &&
          zt.is(t.selectionRange) &&
          (void 0 === t.detail || li.string(t.detail)) &&
          (void 0 === t.deprecated || li.boolean(t.deprecated)) &&
          (void 0 === t.children || Array.isArray(t.children)) &&
          (void 0 === t.tags || Array.isArray(t.tags))
        );
      });
  })(Yn || (Yn = {})),
  (function (e) {
    (e.Empty = ''),
      (e.QuickFix = 'quickfix'),
      (e.Refactor = 'refactor'),
      (e.RefactorExtract = 'refactor.extract'),
      (e.RefactorInline = 'refactor.inline'),
      (e.RefactorRewrite = 'refactor.rewrite'),
      (e.Source = 'source'),
      (e.SourceOrganizeImports = 'source.organizeImports'),
      (e.SourceFixAll = 'source.fixAll');
  })(Zn || (Zn = {})),
  (function (e) {
    (e.create = function (e, t) {
      var n = { diagnostics: e };
      return null != t && (n.only = t), n;
    }),
      (e.is = function (e) {
        var t = e;
        return (
          li.defined(t) &&
          li.typedArray(t.diagnostics, rn.is) &&
          (void 0 === t.only || li.typedArray(t.only, li.string))
        );
      });
  })(Qn || (Qn = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      var i = { title: e },
        r = !0;
      return (
        'string' == typeof t ? ((r = !1), (i.kind = t)) : on.is(t) ? (i.command = t) : (i.edit = t),
        r && void 0 !== n && (i.kind = n),
        i
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          li.string(t.title) &&
          (void 0 === t.diagnostics || li.typedArray(t.diagnostics, rn.is)) &&
          (void 0 === t.kind || li.string(t.kind)) &&
          (void 0 !== t.edit || void 0 !== t.command) &&
          (void 0 === t.command || on.is(t.command)) &&
          (void 0 === t.isPreferred || li.boolean(t.isPreferred)) &&
          (void 0 === t.edit || fn.is(t.edit))
        );
      });
  })(ei || (ei = {})),
  (function (e) {
    (e.create = function (e, t) {
      var n = { range: e };
      return li.defined(t) && (n.data = t), n;
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && zt.is(t.range) && (li.undefined(t.command) || on.is(t.command));
      });
  })(ti || (ti = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { tabSize: e, insertSpaces: t };
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && li.uinteger(t.tabSize) && li.boolean(t.insertSpaces);
      });
  })(ni || (ni = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      return { range: e, target: t, data: n };
    }),
      (e.is = function (e) {
        var t = e;
        return li.defined(t) && zt.is(t.range) && (li.undefined(t.target) || li.string(t.target));
      });
  })(ii || (ii = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { range: e, parent: t };
    }),
      (e.is = function (t) {
        var n = t;
        return void 0 !== n && zt.is(n.range) && (void 0 === n.parent || e.is(n.parent));
      });
  })(ri || (ri = {}));
var ci;
!(function (e) {
  function t(e, n) {
    if (e.length <= 1) return e;
    var i = (e.length / 2) | 0,
      r = e.slice(0, i),
      o = e.slice(i);
    t(r, n), t(o, n);
    for (var s = 0, a = 0, c = 0; s < r.length && a < o.length; ) {
      var l = n(r[s], o[a]);
      e[c++] = l <= 0 ? r[s++] : o[a++];
    }
    for (; s < r.length; ) e[c++] = r[s++];
    for (; a < o.length; ) e[c++] = o[a++];
    return e;
  }
  (e.create = function (e, t, n, i) {
    return new ui(e, t, n, i);
  }),
    (e.is = function (e) {
      var t = e;
      return !!(
        li.defined(t) &&
        li.string(t.uri) &&
        (li.undefined(t.languageId) || li.string(t.languageId)) &&
        li.uinteger(t.lineCount) &&
        li.func(t.getText) &&
        li.func(t.positionAt) &&
        li.func(t.offsetAt)
      );
    }),
    (e.applyEdits = function (e, n) {
      for (
        var i = e.getText(),
          r = t(n, function (e, t) {
            var n = e.range.start.line - t.range.start.line;
            return 0 === n ? e.range.start.character - t.range.start.character : n;
          }),
          o = i.length,
          s = r.length - 1;
        s >= 0;
        s--
      ) {
        var a = r[s],
          c = e.offsetAt(a.range.start),
          l = e.offsetAt(a.range.end);
        if (!(l <= o)) throw new Error('Overlapping edit');
        (i = i.substring(0, c) + a.newText + i.substring(l, i.length)), (o = c);
      }
      return i;
    });
})(ci || (ci = {}));
var li,
  ui = (function () {
    function e(e, t, n, i) {
      (this._uri = e), (this._languageId = t), (this._version = n), (this._content = i), (this._lineOffsets = void 0);
    }
    return (
      Object.defineProperty(e.prototype, 'uri', {
        get: function () {
          return this._uri;
        },
        enumerable: !1,
        configurable: !0
      }),
      Object.defineProperty(e.prototype, 'languageId', {
        get: function () {
          return this._languageId;
        },
        enumerable: !1,
        configurable: !0
      }),
      Object.defineProperty(e.prototype, 'version', {
        get: function () {
          return this._version;
        },
        enumerable: !1,
        configurable: !0
      }),
      (e.prototype.getText = function (e) {
        if (e) {
          var t = this.offsetAt(e.start),
            n = this.offsetAt(e.end);
          return this._content.substring(t, n);
        }
        return this._content;
      }),
      (e.prototype.update = function (e, t) {
        (this._content = e.text), (this._version = t), (this._lineOffsets = void 0);
      }),
      (e.prototype.getLineOffsets = function () {
        if (void 0 === this._lineOffsets) {
          for (var e = [], t = this._content, n = !0, i = 0; i < t.length; i++) {
            n && (e.push(i), (n = !1));
            var r = t.charAt(i);
            (n = '\r' === r || '\n' === r), '\r' === r && i + 1 < t.length && '\n' === t.charAt(i + 1) && i++;
          }
          n && t.length > 0 && e.push(t.length), (this._lineOffsets = e);
        }
        return this._lineOffsets;
      }),
      (e.prototype.positionAt = function (e) {
        e = Math.max(Math.min(e, this._content.length), 0);
        var t = this.getLineOffsets(),
          n = 0,
          i = t.length;
        if (0 === i) return Ut.create(0, e);
        for (; n < i; ) {
          var r = Math.floor((n + i) / 2);
          t[r] > e ? (i = r) : (n = r + 1);
        }
        var o = n - 1;
        return Ut.create(o, e - t[o]);
      }),
      (e.prototype.offsetAt = function (e) {
        var t = this.getLineOffsets();
        if (e.line >= t.length) return this._content.length;
        if (e.line < 0) return 0;
        var n = t[e.line],
          i = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
        return Math.max(Math.min(n + e.character, i), n);
      }),
      Object.defineProperty(e.prototype, 'lineCount', {
        get: function () {
          return this.getLineOffsets().length;
        },
        enumerable: !1,
        configurable: !0
      }),
      e
    );
  })();
!(function (e) {
  var t = Object.prototype.toString;
  (e.defined = function (e) {
    return void 0 !== e;
  }),
    (e.undefined = function (e) {
      return void 0 === e;
    }),
    (e.boolean = function (e) {
      return !0 === e || !1 === e;
    }),
    (e.string = function (e) {
      return '[object String]' === t.call(e);
    }),
    (e.number = function (e) {
      return '[object Number]' === t.call(e);
    }),
    (e.numberRange = function (e, n, i) {
      return '[object Number]' === t.call(e) && n <= e && e <= i;
    }),
    (e.integer = function (e) {
      return '[object Number]' === t.call(e) && -2147483648 <= e && e <= 2147483647;
    }),
    (e.uinteger = function (e) {
      return '[object Number]' === t.call(e) && 0 <= e && e <= 2147483647;
    }),
    (e.func = function (e) {
      return '[object Function]' === t.call(e);
    }),
    (e.objectLiteral = function (e) {
      return null !== e && 'object' == typeof e;
    }),
    (e.typedArray = function (e, t) {
      return Array.isArray(e) && e.every(t);
    });
})(li || (li = {}));
var di = Object.freeze({
    __proto__: null,
    get integer() {
      return Kt;
    },
    get uinteger() {
      return Ht;
    },
    get Position() {
      return Ut;
    },
    get Range() {
      return zt;
    },
    get Location() {
      return Vt;
    },
    get LocationLink() {
      return Bt;
    },
    get Color() {
      return Gt;
    },
    get ColorInformation() {
      return Xt;
    },
    get ColorPresentation() {
      return Jt;
    },
    get FoldingRangeKind() {
      return Yt;
    },
    get FoldingRange() {
      return Zt;
    },
    get DiagnosticRelatedInformation() {
      return Qt;
    },
    get DiagnosticSeverity() {
      return en;
    },
    get DiagnosticTag() {
      return tn;
    },
    get CodeDescription() {
      return nn;
    },
    get Diagnostic() {
      return rn;
    },
    get Command() {
      return on;
    },
    get TextEdit() {
      return sn;
    },
    get ChangeAnnotation() {
      return an;
    },
    get ChangeAnnotationIdentifier() {
      return cn;
    },
    get AnnotatedTextEdit() {
      return ln;
    },
    get TextDocumentEdit() {
      return un;
    },
    get CreateFile() {
      return dn;
    },
    get RenameFile() {
      return hn;
    },
    get DeleteFile() {
      return pn;
    },
    get WorkspaceEdit() {
      return fn;
    },
    WorkspaceChange: ai,
    get TextDocumentIdentifier() {
      return xn;
    },
    get VersionedTextDocumentIdentifier() {
      return kn;
    },
    get OptionalVersionedTextDocumentIdentifier() {
      return On;
    },
    get TextDocumentItem() {
      return Fn;
    },
    get MarkupKind() {
      return qn;
    },
    get MarkupContent() {
      return Nn;
    },
    get CompletionItemKind() {
      return In;
    },
    get InsertTextFormat() {
      return Mn;
    },
    get CompletionItemTag() {
      return Ln;
    },
    get InsertReplaceEdit() {
      return An;
    },
    get InsertTextMode() {
      return jn;
    },
    get CompletionItem() {
      return $n;
    },
    get CompletionList() {
      return Wn;
    },
    get MarkedString() {
      return Kn;
    },
    get Hover() {
      return Hn;
    },
    get ParameterInformation() {
      return Un;
    },
    get SignatureInformation() {
      return zn;
    },
    get DocumentHighlightKind() {
      return Vn;
    },
    get DocumentHighlight() {
      return Bn;
    },
    get SymbolKind() {
      return Gn;
    },
    get SymbolTag() {
      return Xn;
    },
    get SymbolInformation() {
      return Jn;
    },
    get DocumentSymbol() {
      return Yn;
    },
    get CodeActionKind() {
      return Zn;
    },
    get CodeActionContext() {
      return Qn;
    },
    get CodeAction() {
      return ei;
    },
    get CodeLens() {
      return ti;
    },
    get FormattingOptions() {
      return ni;
    },
    get DocumentLink() {
      return ii;
    },
    get SelectionRange() {
      return ri;
    },
    EOL: ['\n', '\r\n', '\r'],
    get TextDocument() {
      return ci;
    }
  }),
  hi = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ProtocolNotificationType = t.ProtocolNotificationType0 = t.ProtocolRequestType = t.ProtocolRequestType0 = t.RegistrationType = void 0);
    t.RegistrationType = class {
      constructor(e) {
        this.method = e;
      }
    };
    class n extends Pn.RequestType0 {
      constructor(e) {
        super(e);
      }
    }
    t.ProtocolRequestType0 = n;
    class i extends Pn.RequestType {
      constructor(e) {
        super(e, Pn.ParameterStructures.byName);
      }
    }
    t.ProtocolRequestType = i;
    class r extends Pn.NotificationType0 {
      constructor(e) {
        super(e);
      }
    }
    t.ProtocolNotificationType0 = r;
    class o extends Pn.NotificationType {
      constructor(e) {
        super(e, Pn.ParameterStructures.byName);
      }
    }
    t.ProtocolNotificationType = o;
  }),
  pi = _(function (e, t) {
    function n(e) {
      return 'string' == typeof e || e instanceof String;
    }
    function i(e) {
      return Array.isArray(e);
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.objectLiteral = t.typedArray = t.stringArray = t.array = t.func = t.error = t.number = t.string = t.boolean = void 0),
      (t.boolean = function (e) {
        return !0 === e || !1 === e;
      }),
      (t.string = n),
      (t.number = function (e) {
        return 'number' == typeof e || e instanceof Number;
      }),
      (t.error = function (e) {
        return e instanceof Error;
      }),
      (t.func = function (e) {
        return 'function' == typeof e;
      }),
      (t.array = i),
      (t.stringArray = function (e) {
        return i(e) && e.every(e => n(e));
      }),
      (t.typedArray = function (e, t) {
        return Array.isArray(e) && e.every(t);
      }),
      (t.objectLiteral = function (e) {
        return null !== e && 'object' == typeof e;
      });
  }),
  fi = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ImplementationRequest = void 0),
      ((n = t.ImplementationRequest || (t.ImplementationRequest = {})).method = 'textDocument/implementation'),
      (n.type = new hi.ProtocolRequestType(n.method));
  }),
  gi = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.TypeDefinitionRequest = void 0),
      ((n = t.TypeDefinitionRequest || (t.TypeDefinitionRequest = {})).method = 'textDocument/typeDefinition'),
      (n.type = new hi.ProtocolRequestType(n.method));
  }),
  mi = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.DidChangeWorkspaceFoldersNotification = t.WorkspaceFoldersRequest = void 0),
      ((t.WorkspaceFoldersRequest || (t.WorkspaceFoldersRequest = {})).type = new hi.ProtocolRequestType0(
        'workspace/workspaceFolders'
      )),
      ((
        t.DidChangeWorkspaceFoldersNotification || (t.DidChangeWorkspaceFoldersNotification = {})
      ).type = new hi.ProtocolNotificationType('workspace/didChangeWorkspaceFolders'));
  }),
  vi = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ConfigurationRequest = void 0),
      ((t.ConfigurationRequest || (t.ConfigurationRequest = {})).type = new hi.ProtocolRequestType(
        'workspace/configuration'
      ));
  }),
  yi = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ColorPresentationRequest = t.DocumentColorRequest = void 0),
      ((n = t.DocumentColorRequest || (t.DocumentColorRequest = {})).method = 'textDocument/documentColor'),
      (n.type = new hi.ProtocolRequestType(n.method)),
      ((t.ColorPresentationRequest || (t.ColorPresentationRequest = {})).type = new hi.ProtocolRequestType(
        'textDocument/colorPresentation'
      ));
  }),
  Ci = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.FoldingRangeRequest = t.FoldingRangeKind = void 0),
      (function (e) {
        (e.Comment = 'comment'), (e.Imports = 'imports'), (e.Region = 'region');
      })(t.FoldingRangeKind || (t.FoldingRangeKind = {})),
      ((n = t.FoldingRangeRequest || (t.FoldingRangeRequest = {})).method = 'textDocument/foldingRange'),
      (n.type = new hi.ProtocolRequestType(n.method));
  }),
  Ri = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.DeclarationRequest = void 0),
      ((n = t.DeclarationRequest || (t.DeclarationRequest = {})).method = 'textDocument/declaration'),
      (n.type = new hi.ProtocolRequestType(n.method));
  }),
  wi = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.SelectionRangeRequest = void 0),
      ((n = t.SelectionRangeRequest || (t.SelectionRangeRequest = {})).method = 'textDocument/selectionRange'),
      (n.type = new hi.ProtocolRequestType(n.method));
  }),
  Ti = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WorkDoneProgressCancelNotification = t.WorkDoneProgressCreateRequest = t.WorkDoneProgress = void 0),
      ((n = t.WorkDoneProgress || (t.WorkDoneProgress = {})).type = new Pn.ProgressType()),
      (n.is = function (e) {
        return e === n.type;
      }),
      ((t.WorkDoneProgressCreateRequest || (t.WorkDoneProgressCreateRequest = {})).type = new hi.ProtocolRequestType(
        'window/workDoneProgress/create'
      )),
      ((
        t.WorkDoneProgressCancelNotification || (t.WorkDoneProgressCancelNotification = {})
      ).type = new hi.ProtocolNotificationType('window/workDoneProgress/cancel'));
  }),
  bi = _(function (e, t) {
    var n, i, r;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.CallHierarchyOutgoingCallsRequest = t.CallHierarchyIncomingCallsRequest = t.CallHierarchyPrepareRequest = void 0),
      ((n = t.CallHierarchyPrepareRequest || (t.CallHierarchyPrepareRequest = {})).method =
        'textDocument/prepareCallHierarchy'),
      (n.type = new hi.ProtocolRequestType(n.method)),
      ((i = t.CallHierarchyIncomingCallsRequest || (t.CallHierarchyIncomingCallsRequest = {})).method =
        'callHierarchy/incomingCalls'),
      (i.type = new hi.ProtocolRequestType(i.method)),
      ((r = t.CallHierarchyOutgoingCallsRequest || (t.CallHierarchyOutgoingCallsRequest = {})).method =
        'callHierarchy/outgoingCalls'),
      (r.type = new hi.ProtocolRequestType(r.method));
  }),
  Si = _(function (e, t) {
    var n, i, r, o, s, a, c;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.SemanticTokensRefreshRequest = t.SemanticTokensRangeRequest = t.SemanticTokensDeltaRequest = t.SemanticTokensRequest = t.SemanticTokensRegistrationType = t.TokenFormat = t.SemanticTokens = t.SemanticTokenModifiers = t.SemanticTokenTypes = void 0),
      ((n = t.SemanticTokenTypes || (t.SemanticTokenTypes = {})).namespace = 'namespace'),
      (n.type = 'type'),
      (n.class = 'class'),
      (n.enum = 'enum'),
      (n.interface = 'interface'),
      (n.struct = 'struct'),
      (n.typeParameter = 'typeParameter'),
      (n.parameter = 'parameter'),
      (n.variable = 'variable'),
      (n.property = 'property'),
      (n.enumMember = 'enumMember'),
      (n.event = 'event'),
      (n.function = 'function'),
      (n.method = 'method'),
      (n.macro = 'macro'),
      (n.keyword = 'keyword'),
      (n.modifier = 'modifier'),
      (n.comment = 'comment'),
      (n.string = 'string'),
      (n.number = 'number'),
      (n.regexp = 'regexp'),
      (n.operator = 'operator'),
      ((i = t.SemanticTokenModifiers || (t.SemanticTokenModifiers = {})).declaration = 'declaration'),
      (i.definition = 'definition'),
      (i.readonly = 'readonly'),
      (i.static = 'static'),
      (i.deprecated = 'deprecated'),
      (i.abstract = 'abstract'),
      (i.async = 'async'),
      (i.modification = 'modification'),
      (i.documentation = 'documentation'),
      (i.defaultLibrary = 'defaultLibrary'),
      ((t.SemanticTokens || (t.SemanticTokens = {})).is = function (e) {
        const t = e;
        return (
          void 0 !== t &&
          (void 0 === t.resultId || 'string' == typeof t.resultId) &&
          Array.isArray(t.data) &&
          (0 === t.data.length || 'number' == typeof t.data[0])
        );
      }),
      ((t.TokenFormat || (t.TokenFormat = {})).Relative = 'relative'),
      ((r = t.SemanticTokensRegistrationType || (t.SemanticTokensRegistrationType = {})).method =
        'textDocument/semanticTokens'),
      (r.type = new hi.RegistrationType(r.method)),
      ((o = t.SemanticTokensRequest || (t.SemanticTokensRequest = {})).method = 'textDocument/semanticTokens/full'),
      (o.type = new hi.ProtocolRequestType(o.method)),
      ((s = t.SemanticTokensDeltaRequest || (t.SemanticTokensDeltaRequest = {})).method =
        'textDocument/semanticTokens/full/delta'),
      (s.type = new hi.ProtocolRequestType(s.method)),
      ((a = t.SemanticTokensRangeRequest || (t.SemanticTokensRangeRequest = {})).method =
        'textDocument/semanticTokens/range'),
      (a.type = new hi.ProtocolRequestType(a.method)),
      ((c = t.SemanticTokensRefreshRequest || (t.SemanticTokensRefreshRequest = {})).method =
        'workspace/semanticTokens/refresh'),
      (c.type = new hi.ProtocolRequestType0(c.method));
  }),
  _i = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ShowDocumentRequest = void 0),
      ((n = t.ShowDocumentRequest || (t.ShowDocumentRequest = {})).method = 'window/showDocument'),
      (n.type = new hi.ProtocolRequestType(n.method));
  }),
  Di = _(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.LinkedEditingRangeRequest = void 0),
      ((n = t.LinkedEditingRangeRequest || (t.LinkedEditingRangeRequest = {})).method =
        'textDocument/linkedEditingRange'),
      (n.type = new hi.ProtocolRequestType(n.method));
  }),
  Pi = _(function (e, t) {
    var n, i, r, o, s, a, c;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WillDeleteFilesRequest = t.DidDeleteFilesNotification = t.DidRenameFilesNotification = t.WillRenameFilesRequest = t.DidCreateFilesNotification = t.WillCreateFilesRequest = t.FileOperationPatternKind = void 0),
      ((n = t.FileOperationPatternKind || (t.FileOperationPatternKind = {})).file = 'file'),
      (n.folder = 'folder'),
      ((i = t.WillCreateFilesRequest || (t.WillCreateFilesRequest = {})).method = 'workspace/willCreateFiles'),
      (i.type = new hi.ProtocolRequestType(i.method)),
      ((r = t.DidCreateFilesNotification || (t.DidCreateFilesNotification = {})).method = 'workspace/didCreateFiles'),
      (r.type = new hi.ProtocolNotificationType(r.method)),
      ((o = t.WillRenameFilesRequest || (t.WillRenameFilesRequest = {})).method = 'workspace/willRenameFiles'),
      (o.type = new hi.ProtocolRequestType(o.method)),
      ((s = t.DidRenameFilesNotification || (t.DidRenameFilesNotification = {})).method = 'workspace/didRenameFiles'),
      (s.type = new hi.ProtocolNotificationType(s.method)),
      ((a = t.DidDeleteFilesNotification || (t.DidDeleteFilesNotification = {})).method = 'workspace/didDeleteFiles'),
      (a.type = new hi.ProtocolNotificationType(a.method)),
      ((c = t.WillDeleteFilesRequest || (t.WillDeleteFilesRequest = {})).method = 'workspace/willDeleteFiles'),
      (c.type = new hi.ProtocolRequestType(c.method));
  }),
  Ei = _(function (e, t) {
    var n, i, r;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.MonikerRequest = t.MonikerKind = t.UniquenessLevel = void 0),
      ((n = t.UniquenessLevel || (t.UniquenessLevel = {})).document = 'document'),
      (n.project = 'project'),
      (n.group = 'group'),
      (n.scheme = 'scheme'),
      (n.global = 'global'),
      ((i = t.MonikerKind || (t.MonikerKind = {})).import = 'import'),
      (i.export = 'export'),
      (i.local = 'local'),
      ((r = t.MonikerRequest || (t.MonikerRequest = {})).method = 'textDocument/moniker'),
      (r.type = new hi.ProtocolRequestType(r.method));
  }),
  xi = _(function (e, t) {
    var n,
      i,
      r,
      o,
      s,
      a,
      c,
      l,
      u,
      d,
      h,
      p,
      f,
      g,
      m,
      v,
      y,
      C,
      R,
      w,
      T,
      b,
      S,
      _,
      D,
      P,
      E,
      x,
      k,
      O,
      F,
      q,
      N,
      I,
      M,
      L,
      A,
      j,
      $,
      W;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.DocumentLinkRequest = t.CodeLensRefreshRequest = t.CodeLensResolveRequest = t.CodeLensRequest = t.WorkspaceSymbolRequest = t.CodeActionResolveRequest = t.CodeActionRequest = t.DocumentSymbolRequest = t.DocumentHighlightRequest = t.ReferencesRequest = t.DefinitionRequest = t.SignatureHelpRequest = t.SignatureHelpTriggerKind = t.HoverRequest = t.CompletionResolveRequest = t.CompletionRequest = t.CompletionTriggerKind = t.PublishDiagnosticsNotification = t.WatchKind = t.FileChangeType = t.DidChangeWatchedFilesNotification = t.WillSaveTextDocumentWaitUntilRequest = t.WillSaveTextDocumentNotification = t.TextDocumentSaveReason = t.DidSaveTextDocumentNotification = t.DidCloseTextDocumentNotification = t.DidChangeTextDocumentNotification = t.TextDocumentContentChangeEvent = t.DidOpenTextDocumentNotification = t.TextDocumentSyncKind = t.TelemetryEventNotification = t.LogMessageNotification = t.ShowMessageRequest = t.ShowMessageNotification = t.MessageType = t.DidChangeConfigurationNotification = t.ExitNotification = t.ShutdownRequest = t.InitializedNotification = t.InitializeError = t.InitializeRequest = t.WorkDoneProgressOptions = t.TextDocumentRegistrationOptions = t.StaticRegistrationOptions = t.FailureHandlingKind = t.ResourceOperationKind = t.UnregistrationRequest = t.RegistrationRequest = t.DocumentSelector = t.DocumentFilter = void 0),
      (t.MonikerRequest = t.MonikerKind = t.UniquenessLevel = t.WillDeleteFilesRequest = t.DidDeleteFilesNotification = t.WillRenameFilesRequest = t.DidRenameFilesNotification = t.WillCreateFilesRequest = t.DidCreateFilesNotification = t.FileOperationPatternKind = t.LinkedEditingRangeRequest = t.ShowDocumentRequest = t.SemanticTokensRegistrationType = t.SemanticTokensRefreshRequest = t.SemanticTokensRangeRequest = t.SemanticTokensDeltaRequest = t.SemanticTokensRequest = t.TokenFormat = t.SemanticTokens = t.SemanticTokenModifiers = t.SemanticTokenTypes = t.CallHierarchyPrepareRequest = t.CallHierarchyOutgoingCallsRequest = t.CallHierarchyIncomingCallsRequest = t.WorkDoneProgressCancelNotification = t.WorkDoneProgressCreateRequest = t.WorkDoneProgress = t.SelectionRangeRequest = t.DeclarationRequest = t.FoldingRangeRequest = t.ColorPresentationRequest = t.DocumentColorRequest = t.ConfigurationRequest = t.DidChangeWorkspaceFoldersNotification = t.WorkspaceFoldersRequest = t.TypeDefinitionRequest = t.ImplementationRequest = t.ApplyWorkspaceEditRequest = t.ExecuteCommandRequest = t.PrepareRenameRequest = t.RenameRequest = t.PrepareSupportDefaultBehavior = t.DocumentOnTypeFormattingRequest = t.DocumentRangeFormattingRequest = t.DocumentFormattingRequest = t.DocumentLinkResolveRequest = void 0),
      Object.defineProperty(t, 'ImplementationRequest', {
        enumerable: !0,
        get: function () {
          return fi.ImplementationRequest;
        }
      }),
      Object.defineProperty(t, 'TypeDefinitionRequest', {
        enumerable: !0,
        get: function () {
          return gi.TypeDefinitionRequest;
        }
      }),
      Object.defineProperty(t, 'WorkspaceFoldersRequest', {
        enumerable: !0,
        get: function () {
          return mi.WorkspaceFoldersRequest;
        }
      }),
      Object.defineProperty(t, 'DidChangeWorkspaceFoldersNotification', {
        enumerable: !0,
        get: function () {
          return mi.DidChangeWorkspaceFoldersNotification;
        }
      }),
      Object.defineProperty(t, 'ConfigurationRequest', {
        enumerable: !0,
        get: function () {
          return vi.ConfigurationRequest;
        }
      }),
      Object.defineProperty(t, 'DocumentColorRequest', {
        enumerable: !0,
        get: function () {
          return yi.DocumentColorRequest;
        }
      }),
      Object.defineProperty(t, 'ColorPresentationRequest', {
        enumerable: !0,
        get: function () {
          return yi.ColorPresentationRequest;
        }
      }),
      Object.defineProperty(t, 'FoldingRangeRequest', {
        enumerable: !0,
        get: function () {
          return Ci.FoldingRangeRequest;
        }
      }),
      Object.defineProperty(t, 'DeclarationRequest', {
        enumerable: !0,
        get: function () {
          return Ri.DeclarationRequest;
        }
      }),
      Object.defineProperty(t, 'SelectionRangeRequest', {
        enumerable: !0,
        get: function () {
          return wi.SelectionRangeRequest;
        }
      }),
      Object.defineProperty(t, 'WorkDoneProgress', {
        enumerable: !0,
        get: function () {
          return Ti.WorkDoneProgress;
        }
      }),
      Object.defineProperty(t, 'WorkDoneProgressCreateRequest', {
        enumerable: !0,
        get: function () {
          return Ti.WorkDoneProgressCreateRequest;
        }
      }),
      Object.defineProperty(t, 'WorkDoneProgressCancelNotification', {
        enumerable: !0,
        get: function () {
          return Ti.WorkDoneProgressCancelNotification;
        }
      }),
      Object.defineProperty(t, 'CallHierarchyIncomingCallsRequest', {
        enumerable: !0,
        get: function () {
          return bi.CallHierarchyIncomingCallsRequest;
        }
      }),
      Object.defineProperty(t, 'CallHierarchyOutgoingCallsRequest', {
        enumerable: !0,
        get: function () {
          return bi.CallHierarchyOutgoingCallsRequest;
        }
      }),
      Object.defineProperty(t, 'CallHierarchyPrepareRequest', {
        enumerable: !0,
        get: function () {
          return bi.CallHierarchyPrepareRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokenTypes', {
        enumerable: !0,
        get: function () {
          return Si.SemanticTokenTypes;
        }
      }),
      Object.defineProperty(t, 'SemanticTokenModifiers', {
        enumerable: !0,
        get: function () {
          return Si.SemanticTokenModifiers;
        }
      }),
      Object.defineProperty(t, 'SemanticTokens', {
        enumerable: !0,
        get: function () {
          return Si.SemanticTokens;
        }
      }),
      Object.defineProperty(t, 'TokenFormat', {
        enumerable: !0,
        get: function () {
          return Si.TokenFormat;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensRequest', {
        enumerable: !0,
        get: function () {
          return Si.SemanticTokensRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensDeltaRequest', {
        enumerable: !0,
        get: function () {
          return Si.SemanticTokensDeltaRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensRangeRequest', {
        enumerable: !0,
        get: function () {
          return Si.SemanticTokensRangeRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensRefreshRequest', {
        enumerable: !0,
        get: function () {
          return Si.SemanticTokensRefreshRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensRegistrationType', {
        enumerable: !0,
        get: function () {
          return Si.SemanticTokensRegistrationType;
        }
      }),
      Object.defineProperty(t, 'ShowDocumentRequest', {
        enumerable: !0,
        get: function () {
          return _i.ShowDocumentRequest;
        }
      }),
      Object.defineProperty(t, 'LinkedEditingRangeRequest', {
        enumerable: !0,
        get: function () {
          return Di.LinkedEditingRangeRequest;
        }
      }),
      Object.defineProperty(t, 'FileOperationPatternKind', {
        enumerable: !0,
        get: function () {
          return Pi.FileOperationPatternKind;
        }
      }),
      Object.defineProperty(t, 'DidCreateFilesNotification', {
        enumerable: !0,
        get: function () {
          return Pi.DidCreateFilesNotification;
        }
      }),
      Object.defineProperty(t, 'WillCreateFilesRequest', {
        enumerable: !0,
        get: function () {
          return Pi.WillCreateFilesRequest;
        }
      }),
      Object.defineProperty(t, 'DidRenameFilesNotification', {
        enumerable: !0,
        get: function () {
          return Pi.DidRenameFilesNotification;
        }
      }),
      Object.defineProperty(t, 'WillRenameFilesRequest', {
        enumerable: !0,
        get: function () {
          return Pi.WillRenameFilesRequest;
        }
      }),
      Object.defineProperty(t, 'DidDeleteFilesNotification', {
        enumerable: !0,
        get: function () {
          return Pi.DidDeleteFilesNotification;
        }
      }),
      Object.defineProperty(t, 'WillDeleteFilesRequest', {
        enumerable: !0,
        get: function () {
          return Pi.WillDeleteFilesRequest;
        }
      }),
      Object.defineProperty(t, 'UniquenessLevel', {
        enumerable: !0,
        get: function () {
          return Ei.UniquenessLevel;
        }
      }),
      Object.defineProperty(t, 'MonikerKind', {
        enumerable: !0,
        get: function () {
          return Ei.MonikerKind;
        }
      }),
      Object.defineProperty(t, 'MonikerRequest', {
        enumerable: !0,
        get: function () {
          return Ei.MonikerRequest;
        }
      }),
      (function (e) {
        e.is = function (e) {
          const t = e;
          return pi.string(t.language) || pi.string(t.scheme) || pi.string(t.pattern);
        };
      })((n = t.DocumentFilter || (t.DocumentFilter = {}))),
      (function (e) {
        e.is = function (e) {
          if (!Array.isArray(e)) return !1;
          for (let t of e) if (!pi.string(t) && !n.is(t)) return !1;
          return !0;
        };
      })((i = t.DocumentSelector || (t.DocumentSelector = {}))),
      ((t.RegistrationRequest || (t.RegistrationRequest = {})).type = new hi.ProtocolRequestType(
        'client/registerCapability'
      )),
      ((t.UnregistrationRequest || (t.UnregistrationRequest = {})).type = new hi.ProtocolRequestType(
        'client/unregisterCapability'
      )),
      ((r = t.ResourceOperationKind || (t.ResourceOperationKind = {})).Create = 'create'),
      (r.Rename = 'rename'),
      (r.Delete = 'delete'),
      ((o = t.FailureHandlingKind || (t.FailureHandlingKind = {})).Abort = 'abort'),
      (o.Transactional = 'transactional'),
      (o.TextOnlyTransactional = 'textOnlyTransactional'),
      (o.Undo = 'undo'),
      ((t.StaticRegistrationOptions || (t.StaticRegistrationOptions = {})).hasId = function (e) {
        const t = e;
        return t && pi.string(t.id) && t.id.length > 0;
      }),
      ((t.TextDocumentRegistrationOptions || (t.TextDocumentRegistrationOptions = {})).is = function (e) {
        const t = e;
        return t && (null === t.documentSelector || i.is(t.documentSelector));
      }),
      ((s = t.WorkDoneProgressOptions || (t.WorkDoneProgressOptions = {})).is = function (e) {
        const t = e;
        return pi.objectLiteral(t) && (void 0 === t.workDoneProgress || pi.boolean(t.workDoneProgress));
      }),
      (s.hasWorkDoneProgress = function (e) {
        const t = e;
        return t && pi.boolean(t.workDoneProgress);
      }),
      ((t.InitializeRequest || (t.InitializeRequest = {})).type = new hi.ProtocolRequestType('initialize')),
      ((t.InitializeError || (t.InitializeError = {})).unknownProtocolVersion = 1),
      ((t.InitializedNotification || (t.InitializedNotification = {})).type = new hi.ProtocolNotificationType(
        'initialized'
      )),
      ((t.ShutdownRequest || (t.ShutdownRequest = {})).type = new hi.ProtocolRequestType0('shutdown')),
      ((t.ExitNotification || (t.ExitNotification = {})).type = new hi.ProtocolNotificationType0('exit')),
      ((
        t.DidChangeConfigurationNotification || (t.DidChangeConfigurationNotification = {})
      ).type = new hi.ProtocolNotificationType('workspace/didChangeConfiguration')),
      ((a = t.MessageType || (t.MessageType = {})).Error = 1),
      (a.Warning = 2),
      (a.Info = 3),
      (a.Log = 4),
      ((t.ShowMessageNotification || (t.ShowMessageNotification = {})).type = new hi.ProtocolNotificationType(
        'window/showMessage'
      )),
      ((t.ShowMessageRequest || (t.ShowMessageRequest = {})).type = new hi.ProtocolRequestType(
        'window/showMessageRequest'
      )),
      ((t.LogMessageNotification || (t.LogMessageNotification = {})).type = new hi.ProtocolNotificationType(
        'window/logMessage'
      )),
      ((t.TelemetryEventNotification || (t.TelemetryEventNotification = {})).type = new hi.ProtocolNotificationType(
        'telemetry/event'
      )),
      ((c = t.TextDocumentSyncKind || (t.TextDocumentSyncKind = {})).None = 0),
      (c.Full = 1),
      (c.Incremental = 2),
      ((l = t.DidOpenTextDocumentNotification || (t.DidOpenTextDocumentNotification = {})).method =
        'textDocument/didOpen'),
      (l.type = new hi.ProtocolNotificationType(l.method)),
      ((u = t.TextDocumentContentChangeEvent || (t.TextDocumentContentChangeEvent = {})).isIncremental = function (e) {
        let t = e;
        return (
          null != t &&
          'string' == typeof t.text &&
          void 0 !== t.range &&
          (void 0 === t.rangeLength || 'number' == typeof t.rangeLength)
        );
      }),
      (u.isFull = function (e) {
        let t = e;
        return null != t && 'string' == typeof t.text && void 0 === t.range && void 0 === t.rangeLength;
      }),
      ((d = t.DidChangeTextDocumentNotification || (t.DidChangeTextDocumentNotification = {})).method =
        'textDocument/didChange'),
      (d.type = new hi.ProtocolNotificationType(d.method)),
      ((h = t.DidCloseTextDocumentNotification || (t.DidCloseTextDocumentNotification = {})).method =
        'textDocument/didClose'),
      (h.type = new hi.ProtocolNotificationType(h.method)),
      ((p = t.DidSaveTextDocumentNotification || (t.DidSaveTextDocumentNotification = {})).method =
        'textDocument/didSave'),
      (p.type = new hi.ProtocolNotificationType(p.method)),
      ((f = t.TextDocumentSaveReason || (t.TextDocumentSaveReason = {})).Manual = 1),
      (f.AfterDelay = 2),
      (f.FocusOut = 3),
      ((g = t.WillSaveTextDocumentNotification || (t.WillSaveTextDocumentNotification = {})).method =
        'textDocument/willSave'),
      (g.type = new hi.ProtocolNotificationType(g.method)),
      ((m = t.WillSaveTextDocumentWaitUntilRequest || (t.WillSaveTextDocumentWaitUntilRequest = {})).method =
        'textDocument/willSaveWaitUntil'),
      (m.type = new hi.ProtocolRequestType(m.method)),
      ((
        t.DidChangeWatchedFilesNotification || (t.DidChangeWatchedFilesNotification = {})
      ).type = new hi.ProtocolNotificationType('workspace/didChangeWatchedFiles')),
      ((v = t.FileChangeType || (t.FileChangeType = {})).Created = 1),
      (v.Changed = 2),
      (v.Deleted = 3),
      ((y = t.WatchKind || (t.WatchKind = {})).Create = 1),
      (y.Change = 2),
      (y.Delete = 4),
      ((
        t.PublishDiagnosticsNotification || (t.PublishDiagnosticsNotification = {})
      ).type = new hi.ProtocolNotificationType('textDocument/publishDiagnostics')),
      ((C = t.CompletionTriggerKind || (t.CompletionTriggerKind = {})).Invoked = 1),
      (C.TriggerCharacter = 2),
      (C.TriggerForIncompleteCompletions = 3),
      ((R = t.CompletionRequest || (t.CompletionRequest = {})).method = 'textDocument/completion'),
      (R.type = new hi.ProtocolRequestType(R.method)),
      ((w = t.CompletionResolveRequest || (t.CompletionResolveRequest = {})).method = 'completionItem/resolve'),
      (w.type = new hi.ProtocolRequestType(w.method)),
      ((T = t.HoverRequest || (t.HoverRequest = {})).method = 'textDocument/hover'),
      (T.type = new hi.ProtocolRequestType(T.method)),
      ((b = t.SignatureHelpTriggerKind || (t.SignatureHelpTriggerKind = {})).Invoked = 1),
      (b.TriggerCharacter = 2),
      (b.ContentChange = 3),
      ((S = t.SignatureHelpRequest || (t.SignatureHelpRequest = {})).method = 'textDocument/signatureHelp'),
      (S.type = new hi.ProtocolRequestType(S.method)),
      ((_ = t.DefinitionRequest || (t.DefinitionRequest = {})).method = 'textDocument/definition'),
      (_.type = new hi.ProtocolRequestType(_.method)),
      ((D = t.ReferencesRequest || (t.ReferencesRequest = {})).method = 'textDocument/references'),
      (D.type = new hi.ProtocolRequestType(D.method)),
      ((P = t.DocumentHighlightRequest || (t.DocumentHighlightRequest = {})).method = 'textDocument/documentHighlight'),
      (P.type = new hi.ProtocolRequestType(P.method)),
      ((E = t.DocumentSymbolRequest || (t.DocumentSymbolRequest = {})).method = 'textDocument/documentSymbol'),
      (E.type = new hi.ProtocolRequestType(E.method)),
      ((x = t.CodeActionRequest || (t.CodeActionRequest = {})).method = 'textDocument/codeAction'),
      (x.type = new hi.ProtocolRequestType(x.method)),
      ((k = t.CodeActionResolveRequest || (t.CodeActionResolveRequest = {})).method = 'codeAction/resolve'),
      (k.type = new hi.ProtocolRequestType(k.method)),
      ((O = t.WorkspaceSymbolRequest || (t.WorkspaceSymbolRequest = {})).method = 'workspace/symbol'),
      (O.type = new hi.ProtocolRequestType(O.method)),
      ((F = t.CodeLensRequest || (t.CodeLensRequest = {})).method = 'textDocument/codeLens'),
      (F.type = new hi.ProtocolRequestType(F.method)),
      ((q = t.CodeLensResolveRequest || (t.CodeLensResolveRequest = {})).method = 'codeLens/resolve'),
      (q.type = new hi.ProtocolRequestType(q.method)),
      ((N = t.CodeLensRefreshRequest || (t.CodeLensRefreshRequest = {})).method = 'workspace/codeLens/refresh'),
      (N.type = new hi.ProtocolRequestType0(N.method)),
      ((I = t.DocumentLinkRequest || (t.DocumentLinkRequest = {})).method = 'textDocument/documentLink'),
      (I.type = new hi.ProtocolRequestType(I.method)),
      ((M = t.DocumentLinkResolveRequest || (t.DocumentLinkResolveRequest = {})).method = 'documentLink/resolve'),
      (M.type = new hi.ProtocolRequestType(M.method)),
      ((L = t.DocumentFormattingRequest || (t.DocumentFormattingRequest = {})).method = 'textDocument/formatting'),
      (L.type = new hi.ProtocolRequestType(L.method)),
      ((A = t.DocumentRangeFormattingRequest || (t.DocumentRangeFormattingRequest = {})).method =
        'textDocument/rangeFormatting'),
      (A.type = new hi.ProtocolRequestType(A.method)),
      ((j = t.DocumentOnTypeFormattingRequest || (t.DocumentOnTypeFormattingRequest = {})).method =
        'textDocument/onTypeFormatting'),
      (j.type = new hi.ProtocolRequestType(j.method)),
      ((t.PrepareSupportDefaultBehavior || (t.PrepareSupportDefaultBehavior = {})).Identifier = 1),
      (($ = t.RenameRequest || (t.RenameRequest = {})).method = 'textDocument/rename'),
      ($.type = new hi.ProtocolRequestType($.method)),
      ((W = t.PrepareRenameRequest || (t.PrepareRenameRequest = {})).method = 'textDocument/prepareRename'),
      (W.type = new hi.ProtocolRequestType(W.method)),
      ((t.ExecuteCommandRequest || (t.ExecuteCommandRequest = {})).type = new hi.ProtocolRequestType(
        'workspace/executeCommand'
      )),
      ((t.ApplyWorkspaceEditRequest || (t.ApplyWorkspaceEditRequest = {})).type = new hi.ProtocolRequestType(
        'workspace/applyEdit'
      ));
  }),
  ki = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createProtocolConnection = void 0),
      (t.createProtocolConnection = function (e, t, n, i) {
        return Pn.ConnectionStrategy.is(i) && (i = { connectionStrategy: i }), Pn.createMessageConnection(e, t, n, i);
      });
  }),
  Oi = S(di),
  Fi = _(function (e, t) {
    var n,
      i =
        (b && b.__createBinding) ||
        (Object.create
          ? function (e, t, n, i) {
              void 0 === i && (i = n),
                Object.defineProperty(e, i, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, i) {
              void 0 === i && (i = n), (e[i] = t[n]);
            }),
      r =
        (b && b.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || i(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.LSPErrorCodes = t.createProtocolConnection = void 0),
      r(Pn, t),
      r(Oi, t),
      r(hi, t),
      r(xi, t),
      Object.defineProperty(t, 'createProtocolConnection', {
        enumerable: !0,
        get: function () {
          return ki.createProtocolConnection;
        }
      }),
      ((n = t.LSPErrorCodes || (t.LSPErrorCodes = {})).lspReservedErrorRangeStart = -32899),
      (n.ContentModified = -32801),
      (n.RequestCancelled = -32800),
      (n.lspReservedErrorRangeEnd = -32800);
  }),
  qi = _(function (e, t) {
    var n =
        (b && b.__createBinding) ||
        (Object.create
          ? function (e, t, n, i) {
              void 0 === i && (i = n),
                Object.defineProperty(e, i, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, i) {
              void 0 === i && (i = n), (e[i] = t[n]);
            }),
      i =
        (b && b.__exportStar) ||
        function (e, t) {
          for (var i in e) 'default' === i || Object.prototype.hasOwnProperty.call(t, i) || n(t, e, i);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createProtocolConnection = void 0),
      i(En, t),
      i(Fi, t),
      (t.createProtocolConnection = function (e, t, n, i) {
        return En.createMessageConnection(e, t, n, i);
      });
  }),
  Ni = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.toJSONObject = t.ConfigurationFeature = void 0);
    function n(e) {
      if (e) {
        if (Array.isArray(e)) return e.map(n);
        if ('object' == typeof e) {
          const t = Object.create(null);
          for (const i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = n(e[i]));
          return t;
        }
      }
      return e;
    }
    (t.ConfigurationFeature = class {
      constructor(e) {
        this._client = e;
      }
      fillClientCapabilities(e) {
        (e.workspace = e.workspace || {}), (e.workspace.configuration = !0);
      }
      initialize() {
        let e = this._client;
        e.onRequest(qi.ConfigurationRequest.type, (t, n) => {
          let i = e => {
              let t = [];
              for (let n of e.items) {
                let e =
                  void 0 !== n.scopeUri && null !== n.scopeUri
                    ? this._client.protocol2CodeConverter.asUri(n.scopeUri)
                    : void 0;
                t.push(this.getConfiguration(e, null !== n.section ? n.section : void 0));
              }
              return t;
            },
            r = e.clientOptions.middleware.workspace;
          return r && r.configuration ? r.configuration(t, n, i) : i(t);
        });
      }
      getConfiguration(e, t) {
        let i = null;
        if (t) {
          let r = t.lastIndexOf('.');
          if (-1 === r) i = n(u.default.workspace.getConfiguration(void 0, e).get(t));
          else {
            let o = u.default.workspace.getConfiguration(t.substr(0, r), e);
            o && (i = n(o.get(t.substr(r + 1))));
          }
        } else {
          let t = u.default.workspace.getConfiguration(void 0, e);
          i = {};
          for (let e of Object.keys(t)) t.has(e) && (i[e] = n(t.get(e)));
        }
        return void 0 === i && (i = null), i;
      }
      dispose() {}
    }),
      (t.toJSONObject = n);
  });
class Ii extends u.default.CompletionItem {
  constructor(e) {
    super(e);
  }
}
var Mi = Ii,
  Li = Object.defineProperty({ default: Mi }, '__esModule', { value: !0 });
class Ai extends u.default.CodeLens {
  constructor(e) {
    super(e);
  }
}
var ji = Ai,
  $i = Object.defineProperty({ default: ji }, '__esModule', { value: !0 });
class Wi extends u.default.DocumentLink {
  constructor(e, t) {
    super(e, t);
  }
}
var Ki = Wi,
  Hi = Object.defineProperty({ default: Ki }, '__esModule', { value: !0 });
class Ui extends u.default.CodeAction {
  constructor(e, t) {
    super(e), (this.data = t);
  }
}
var zi = Ui,
  Vi = Object.defineProperty({ default: zi }, '__esModule', { value: !0 }),
  Bi = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ProtocolDiagnostic = t.DiagnosticCode = void 0),
      ((t.DiagnosticCode || (t.DiagnosticCode = {})).is = function (e) {
        const t = e;
        return null != t && (kt.number(t.value) || kt.string(t.value)) && kt.string(t.target);
      });
    class n extends u.default.Diagnostic {
      constructor(e, t, n, i) {
        super(e, t, n), (this.data = i), (this.hasDiagnosticCode = !1);
      }
    }
    t.ProtocolDiagnostic = n;
  });
class Gi extends u.default.CallHierarchyItem {
  constructor(e, t, n, i, r, o, s) {
    super(e, t, n, i, r, o), void 0 !== s && (this.data = s);
  }
}
var Xi = Gi,
  Ji = Object.defineProperty({ default: Xi }, '__esModule', { value: !0 }),
  Yi = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.createConverter = void 0);
    const n = qi;
    var i;
    !(function (e) {
      e.is = function (e) {
        const t = e;
        return t && !!t.inserting && !!t.replacing;
      };
    })(i || (i = {})),
      (t.createConverter = function (e) {
        const t = e || (e => e.toString());
        function r(e) {
          return t(e);
        }
        function o(e) {
          return { uri: t(e.uri) };
        }
        function s(e) {
          switch (e) {
            case u.default.TextDocumentSaveReason.Manual:
              return qi.TextDocumentSaveReason.Manual;
            case u.default.TextDocumentSaveReason.AfterDelay:
              return qi.TextDocumentSaveReason.AfterDelay;
            case u.default.TextDocumentSaveReason.FocusOut:
              return qi.TextDocumentSaveReason.FocusOut;
          }
          return qi.TextDocumentSaveReason.Manual;
        }
        function a(e) {
          switch (e) {
            case u.default.CompletionTriggerKind.TriggerCharacter:
              return qi.CompletionTriggerKind.TriggerCharacter;
            case u.default.CompletionTriggerKind.TriggerForIncompleteCompletions:
              return qi.CompletionTriggerKind.TriggerForIncompleteCompletions;
            default:
              return qi.CompletionTriggerKind.Invoked;
          }
        }
        function c(e) {
          switch (e) {
            case u.default.SignatureHelpTriggerKind.Invoke:
              return qi.SignatureHelpTriggerKind.Invoked;
            case u.default.SignatureHelpTriggerKind.TriggerCharacter:
              return qi.SignatureHelpTriggerKind.TriggerCharacter;
            case u.default.SignatureHelpTriggerKind.ContentChange:
              return qi.SignatureHelpTriggerKind.ContentChange;
          }
        }
        function l(e) {
          return { label: e.label };
        }
        function d(e) {
          return { label: e.label, parameters: ((t = e.parameters), t.map(l)) };
          var t;
        }
        function h(e) {
          return { line: e.line, character: e.character };
        }
        function p(e) {
          return null == e ? e : { line: e.line, character: e.character };
        }
        function f(e) {
          return null == e ? e : { start: p(e.start), end: p(e.end) };
        }
        function g(e) {
          return null == e ? e : qi.Location.create(r(e.uri), f(e.range));
        }
        function m(e) {
          switch (e) {
            case u.default.DiagnosticSeverity.Error:
              return qi.DiagnosticSeverity.Error;
            case u.default.DiagnosticSeverity.Warning:
              return qi.DiagnosticSeverity.Warning;
            case u.default.DiagnosticSeverity.Information:
              return qi.DiagnosticSeverity.Information;
            case u.default.DiagnosticSeverity.Hint:
              return qi.DiagnosticSeverity.Hint;
          }
        }
        function v(e) {
          switch (e) {
            case u.default.DiagnosticTag.Unnecessary:
              return qi.DiagnosticTag.Unnecessary;
            case u.default.DiagnosticTag.Deprecated:
              return qi.DiagnosticTag.Deprecated;
            default:
              return;
          }
        }
        function y(e) {
          return { message: e.message, location: g(e.location) };
        }
        function C(e) {
          const t = qi.Diagnostic.create(f(e.range), e.message),
            n = e instanceof Bi.ProtocolDiagnostic ? e : void 0;
          void 0 !== n && void 0 !== n.data && (t.data = n.data);
          const i = (function (e) {
            if (null != e) return kt.number(e) || kt.string(e) ? e : { value: e.value, target: r(e.target) };
          })(e.code);
          return (
            Bi.DiagnosticCode.is(i)
              ? void 0 !== n && n.hasDiagnosticCode
                ? (t.code = i)
                : ((t.code = i.value), (t.codeDescription = { href: i.target }))
              : (t.code = i),
            kt.number(e.severity) && (t.severity = m(e.severity)),
            Array.isArray(e.tags) &&
              (t.tags = (function (e) {
                if (!e) return;
                let t = [];
                for (let n of e) {
                  let e = v(n);
                  void 0 !== e && t.push(e);
                }
                return t.length > 0 ? t : void 0;
              })(e.tags)),
            e.relatedInformation && (t.relatedInformation = e.relatedInformation.map(y)),
            e.source && (t.source = e.source),
            t
          );
        }
        function R(e) {
          return null == e ? e : e.map(C);
        }
        function w(e) {
          switch (e) {
            case u.default.CompletionItemTag.Deprecated:
              return qi.CompletionItemTag.Deprecated;
          }
        }
        function T(e) {
          return { range: f(e.range), newText: e.newText };
        }
        function b(e) {
          return e <= u.default.SymbolKind.TypeParameter ? e + 1 : qi.SymbolKind.Property;
        }
        function S(e) {
          return e;
        }
        function _(e) {
          return e.map(S);
        }
        function D(e) {
          let t = qi.Command.create(e.title, e.command);
          return e.arguments && (t.arguments = e.arguments), t;
        }
        return {
          asUri: r,
          asTextDocumentIdentifier: o,
          asVersionedTextDocumentIdentifier: function (e) {
            return { uri: t(e.uri), version: e.version };
          },
          asOpenTextDocumentParams: function (e) {
            return { textDocument: { uri: t(e.uri), languageId: e.languageId, version: e.version, text: e.getText() } };
          },
          asChangeTextDocumentParams: function (e) {
            if (
              (function (e) {
                let t = e;
                return !!t.uri && !!t.version;
              })(e)
            ) {
              return { textDocument: { uri: t(e.uri), version: e.version }, contentChanges: [{ text: e.getText() }] };
            }
            if (
              (function (e) {
                let t = e;
                return !!t.document && !!t.contentChanges;
              })(e)
            ) {
              let n = e.document;
              return {
                textDocument: { uri: t(n.uri), version: n.version },
                contentChanges: e.contentChanges.map(e => {
                  let t = e.range;
                  return {
                    range: {
                      start: { line: t.start.line, character: t.start.character },
                      end: { line: t.end.line, character: t.end.character }
                    },
                    rangeLength: e.rangeLength,
                    text: e.text
                  };
                })
              };
            }
            throw Error('Unsupported text document change parameter');
          },
          asCloseTextDocumentParams: function (e) {
            return { textDocument: o(e) };
          },
          asSaveTextDocumentParams: function (e, t = !1) {
            let n = { textDocument: o(e) };
            return t && (n.text = e.getText()), n;
          },
          asWillSaveTextDocumentParams: function (e) {
            return { textDocument: o(e.document), reason: s(e.reason) };
          },
          asDidCreateFilesParams: function (e) {
            return { files: e.files.map(e => ({ uri: t(e) })) };
          },
          asDidRenameFilesParams: function (e) {
            return { files: e.files.map(e => ({ oldUri: t(e.oldUri), newUri: t(e.newUri) })) };
          },
          asDidDeleteFilesParams: function (e) {
            return { files: e.files.map(e => ({ uri: t(e) })) };
          },
          asWillCreateFilesParams: function (e) {
            return { files: e.files.map(e => ({ uri: t(e) })) };
          },
          asWillRenameFilesParams: function (e) {
            return { files: e.files.map(e => ({ oldUri: t(e.oldUri), newUri: t(e.newUri) })) };
          },
          asWillDeleteFilesParams: function (e) {
            return { files: e.files.map(e => ({ uri: t(e) })) };
          },
          asTextDocumentPositionParams: function (e, t) {
            return { textDocument: o(e), position: h(t) };
          },
          asCompletionParams: function (e, t, n) {
            return {
              textDocument: o(e),
              position: h(t),
              context: { triggerKind: a(n.triggerKind), triggerCharacter: n.triggerCharacter }
            };
          },
          asSignatureHelpParams: function (e, t, n) {
            return {
              textDocument: o(e),
              position: h(t),
              context: {
                isRetrigger: n.isRetrigger,
                triggerCharacter: n.triggerCharacter,
                triggerKind: c(n.triggerKind),
                activeSignatureHelp:
                  ((i = n.activeSignatureHelp),
                  void 0 === i
                    ? i
                    : {
                        signatures: ((r = i.signatures), r.map(d)),
                        activeSignature: i.activeSignature,
                        activeParameter: i.activeParameter
                      })
              }
            };
            var i, r;
          },
          asWorkerPosition: h,
          asRange: f,
          asPosition: p,
          asPositions: function (e) {
            let t = [];
            for (let n of e) t.push(p(n));
            return t;
          },
          asLocation: g,
          asDiagnosticSeverity: m,
          asDiagnosticTag: v,
          asDiagnostic: C,
          asDiagnostics: R,
          asCompletionItem: function (e) {
            let t = { label: e.label },
              r = e instanceof Li.default ? e : void 0;
            var o, s;
            e.detail && (t.detail = e.detail),
              e.documentation &&
                (r && '$string' !== r.documentationFormat
                  ? (t.documentation = (function (e, t) {
                      switch (e) {
                        case '$string':
                          return t;
                        case qi.MarkupKind.PlainText:
                          return { kind: e, value: t };
                        case qi.MarkupKind.Markdown:
                          return { kind: e, value: t.value };
                        default:
                          return 'Unsupported Markup content received. Kind is: ' + e;
                      }
                    })(r.documentationFormat, e.documentation))
                  : (t.documentation = e.documentation)),
              e.filterText && (t.filterText = e.filterText),
              (function (e, t) {
                let n = qi.InsertTextFormat.PlainText,
                  r = void 0,
                  o = void 0;
                t.textEdit
                  ? ((r = t.textEdit.newText), (o = t.textEdit.range))
                  : t.insertText instanceof u.default.SnippetString
                  ? ((n = qi.InsertTextFormat.Snippet), (r = t.insertText.value))
                  : (r = t.insertText);
                t.range && (o = t.range);
                (e.insertTextFormat = n),
                  t.fromEdit && void 0 !== r && void 0 !== o
                    ? (e.textEdit = (function (e, t) {
                        return i.is(t)
                          ? qi.InsertReplaceEdit.create(e, f(t.inserting), f(t.replacing))
                          : { newText: e, range: f(t) };
                      })(r, o))
                    : (e.insertText = r);
              })(t, e),
              kt.number(e.kind) && (t.kind = ((o = e.kind), void 0 !== (s = r && r.originalItemKind) ? s : o + 1)),
              e.sortText && (t.sortText = e.sortText),
              e.additionalTextEdits &&
                (t.additionalTextEdits = (function (e) {
                  if (null == e) return e;
                  return e.map(T);
                })(e.additionalTextEdits)),
              e.commitCharacters && (t.commitCharacters = e.commitCharacters.slice()),
              e.command && (t.command = D(e.command)),
              (!0 !== e.preselect && !1 !== e.preselect) || (t.preselect = e.preselect);
            const a = (function (e) {
              if (void 0 === e) return e;
              const t = [];
              for (let n of e) {
                const e = w(n);
                void 0 !== e && t.push(e);
              }
              return t;
            })(e.tags);
            if (r) {
              if ((void 0 !== r.data && (t.data = r.data), !0 === r.deprecated || !1 === r.deprecated)) {
                if (!0 === r.deprecated && void 0 !== a && a.length > 0) {
                  const e = a.indexOf(u.default.CompletionItemTag.Deprecated);
                  -1 !== e && a.splice(e, 1);
                }
                t.deprecated = r.deprecated;
              }
              void 0 !== r.insertTextMode && (t.insertTextMode = r.insertTextMode);
            }
            return (
              void 0 !== a && a.length > 0 && (t.tags = a),
              void 0 === t.insertTextMode &&
                !0 === e.keepWhitespace &&
                (t.insertTextMode = n.InsertTextMode.adjustIndentation),
              t
            );
          },
          asTextEdit: T,
          asSymbolKind: b,
          asSymbolTag: S,
          asSymbolTags: _,
          asReferenceParams: function (e, t, n) {
            return { textDocument: o(e), position: h(t), context: { includeDeclaration: n.includeDeclaration } };
          },
          asCodeAction: function (e) {
            let t = qi.CodeAction.create(e.title);
            if (
              (e instanceof Vi.default && void 0 !== e.data && (t.data = e.data),
              void 0 !== e.kind &&
                (t.kind = (function (e) {
                  if (null == e) return;
                  return e.value;
                })(e.kind)),
              void 0 !== e.diagnostics && (t.diagnostics = R(e.diagnostics)),
              void 0 !== e.edit)
            )
              throw new Error('VS Code code actions can only be converted to a protocol code action without an edit.');
            return (
              void 0 !== e.command && (t.command = D(e.command)),
              void 0 !== e.isPreferred && (t.isPreferred = e.isPreferred),
              void 0 !== e.disabled && (t.disabled = { reason: e.disabled.reason }),
              t
            );
          },
          asCodeActionContext: function (e) {
            if (null == e) return e;
            let t;
            return (
              e.only && kt.string(e.only.value) && (t = [e.only.value]),
              qi.CodeActionContext.create(R(e.diagnostics), t)
            );
          },
          asCommand: D,
          asCodeLens: function (e) {
            let t = qi.CodeLens.create(f(e.range));
            return e.command && (t.command = D(e.command)), e instanceof $i.default && e.data && (t.data = e.data), t;
          },
          asFormattingOptions: function (e, t) {
            const n = { tabSize: e.tabSize, insertSpaces: e.insertSpaces };
            return (
              t.trimTrailingWhitespace && (n.trimTrailingWhitespace = !0),
              t.trimFinalNewlines && (n.trimFinalNewlines = !0),
              t.insertFinalNewline && (n.insertFinalNewline = !0),
              n
            );
          },
          asDocumentSymbolParams: function (e) {
            return { textDocument: o(e) };
          },
          asCodeLensParams: function (e) {
            return { textDocument: o(e) };
          },
          asDocumentLink: function (e) {
            let t = qi.DocumentLink.create(f(e.range));
            e.target && (t.target = r(e.target)), void 0 !== e.tooltip && (t.tooltip = e.tooltip);
            let n = e instanceof Hi.default ? e : void 0;
            return n && n.data && (t.data = n.data), t;
          },
          asDocumentLinkParams: function (e) {
            return { textDocument: o(e) };
          },
          asCallHierarchyItem: function (e) {
            const t = {
              name: e.name,
              kind: b(e.kind),
              uri: r(e.uri),
              range: f(e.range),
              selectionRange: f(e.selectionRange)
            };
            return (
              void 0 !== e.detail && e.detail.length > 0 && (t.detail = e.detail),
              void 0 !== e.tags && (t.tags = _(e.tags)),
              e instanceof Ji.default && void 0 !== e.data && (t.data = e.data),
              t
            );
          }
        };
      });
  }),
  Zi = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.createConverter = void 0);
    const n = qi;
    var i;
    !(function (e) {
      e.is = function (e) {
        let t = e;
        return t && kt.string(t.language) && kt.string(t.value);
      };
    })(i || (i = {})),
      (t.createConverter = function (e, t) {
        const r = e || (e => u.default.Uri.parse(e));
        function o(e) {
          return r(e);
        }
        function s(e) {
          return e.map(a);
        }
        function a(e) {
          let t = new Bi.ProtocolDiagnostic(h(e.range), e.message, f(e.severity), e.data);
          return (
            void 0 !== e.code &&
              (qi.CodeDescription.is(e.codeDescription)
                ? (t.code = { value: e.code, target: o(e.codeDescription.href) })
                : Bi.DiagnosticCode.is(e.code)
                ? ((t.hasDiagnosticCode = !0), (t.code = { value: e.code.value, target: o(e.code.target) }))
                : (t.code = e.code)),
            e.source && (t.source = e.source),
            e.relatedInformation && (t.relatedInformation = e.relatedInformation.map(c)),
            Array.isArray(e.tags) &&
              (t.tags = (function (e) {
                if (!e) return;
                let t = [];
                for (let n of e) {
                  let e = l(n);
                  void 0 !== e && t.push(e);
                }
                return t.length > 0 ? t : void 0;
              })(e.tags)),
            t
          );
        }
        function c(e) {
          return new u.default.DiagnosticRelatedInformation(D(e.location), e.message);
        }
        function l(e) {
          switch (e) {
            case qi.DiagnosticTag.Unnecessary:
              return u.default.DiagnosticTag.Unnecessary;
            case qi.DiagnosticTag.Deprecated:
              return u.default.DiagnosticTag.Deprecated;
            default:
              return;
          }
        }
        function d(e) {
          if (e) return new u.default.Position(e.line, e.character);
        }
        function h(e) {
          if (e) return new u.default.Range(d(e.start), d(e.end));
        }
        function p(e) {
          return e.map(e => h(e));
        }
        function f(e) {
          if (null == e) return u.default.DiagnosticSeverity.Error;
          switch (e) {
            case qi.DiagnosticSeverity.Error:
              return u.default.DiagnosticSeverity.Error;
            case qi.DiagnosticSeverity.Warning:
              return u.default.DiagnosticSeverity.Warning;
            case qi.DiagnosticSeverity.Information:
              return u.default.DiagnosticSeverity.Information;
            case qi.DiagnosticSeverity.Hint:
              return u.default.DiagnosticSeverity.Hint;
          }
          return u.default.DiagnosticSeverity.Error;
        }
        function g(e) {
          if (kt.string(e)) return e;
          switch (e.kind) {
            case qi.MarkupKind.Markdown:
              return m(e.value);
            case qi.MarkupKind.PlainText:
              return e.value;
            default:
              return 'Unsupported Markup content received. Kind is: ' + e.kind;
          }
        }
        function m(e) {
          const n = new u.default.MarkdownString(e);
          return !0 === t && (n.isTrusted = t), n;
        }
        function v(e) {
          switch (e) {
            case qi.CompletionItemTag.Deprecated:
              return u.default.CompletionItemTag.Deprecated;
          }
        }
        function y(e) {
          let t = (function (e) {
              if (null == e) return [];
              const t = [];
              for (let n of e) {
                const e = v(n);
                void 0 !== e && t.push(e);
              }
              return t;
            })(e.tags),
            i = new Li.default(e.label);
          e.detail && (i.detail = e.detail),
            e.documentation &&
              ((i.documentation = g(e.documentation)),
              (i.documentationFormat = kt.string(e.documentation) ? '$string' : e.documentation.kind)),
            e.filterText && (i.filterText = e.filterText);
          let r = (function (e) {
            return e.textEdit
              ? e.insertTextFormat === qi.InsertTextFormat.Snippet
                ? { text: new u.default.SnippetString(e.textEdit.newText), range: C(e.textEdit), fromEdit: !0 }
                : { text: e.textEdit.newText, range: C(e.textEdit), fromEdit: !0 }
              : e.insertText
              ? e.insertTextFormat === qi.InsertTextFormat.Snippet
                ? { text: new u.default.SnippetString(e.insertText), fromEdit: !1 }
                : { text: e.insertText, fromEdit: !1 }
              : void 0;
          })(e);
          if ((r && ((i.insertText = r.text), (i.range = r.range), (i.fromEdit = r.fromEdit)), kt.number(e.kind))) {
            let [t, n] =
              ((o = e.kind),
              qi.CompletionItemKind.Text <= o && o <= qi.CompletionItemKind.TypeParameter
                ? [o - 1, void 0]
                : [u.default.CompletionItemKind.Text, o]);
            (i.kind = t), n && (i.originalItemKind = n);
          }
          var o;
          return (
            e.sortText && (i.sortText = e.sortText),
            e.additionalTextEdits && (i.additionalTextEdits = w(e.additionalTextEdits)),
            kt.stringArray(e.commitCharacters) && (i.commitCharacters = e.commitCharacters.slice()),
            e.command && (i.command = L(e.command)),
            (!0 !== e.deprecated && !1 !== e.deprecated) ||
              ((i.deprecated = e.deprecated), !0 === e.deprecated && t.push(u.default.CompletionItemTag.Deprecated)),
            (!0 !== e.preselect && !1 !== e.preselect) || (i.preselect = e.preselect),
            void 0 !== e.data && (i.data = e.data),
            t.length > 0 && (i.tags = t),
            void 0 !== e.insertTextMode &&
              ((i.insertTextMode = e.insertTextMode),
              e.insertTextMode === n.InsertTextMode.asIs && (i.keepWhitespace = !0)),
            i
          );
        }
        function C(e) {
          return qi.InsertReplaceEdit.is(e) ? { inserting: h(e.insert), replacing: h(e.replace) } : h(e.range);
        }
        function R(e) {
          if (e) return new u.default.TextEdit(h(e.range), e.newText);
        }
        function w(e) {
          if (e) return e.map(R);
        }
        function T(e) {
          return e.map(b);
        }
        function b(e) {
          let t = new u.default.SignatureInformation(e.label);
          return (
            void 0 !== e.documentation && (t.documentation = g(e.documentation)),
            void 0 !== e.parameters && (t.parameters = S(e.parameters)),
            void 0 !== e.activeParameter && (t.activeParameter = e.activeParameter),
            t
          );
        }
        function S(e) {
          return e.map(_);
        }
        function _(e) {
          let t = new u.default.ParameterInformation(e.label);
          return e.documentation && (t.documentation = g(e.documentation)), t;
        }
        function D(e) {
          if (e) return new u.default.Location(r(e.uri), h(e.range));
        }
        function P(e) {
          if (!e) return;
          let t = {
            targetUri: r(e.targetUri),
            targetRange: h(e.targetRange),
            originSelectionRange: h(e.originSelectionRange),
            targetSelectionRange: h(e.targetSelectionRange)
          };
          if (!t.targetSelectionRange) throw new Error('targetSelectionRange must not be undefined or null');
          return t;
        }
        function E(e) {
          if (e) {
            if (kt.array(e)) {
              if (0 === e.length) return [];
              if (qi.LocationLink.is(e[0])) {
                return e.map(e => P(e));
              }
              return e.map(e => D(e));
            }
            return qi.LocationLink.is(e) ? [P(e)] : D(e);
          }
        }
        function x(e) {
          let t = new u.default.DocumentHighlight(h(e.range));
          return kt.number(e.kind) && (t.kind = k(e.kind)), t;
        }
        function k(e) {
          switch (e) {
            case qi.DocumentHighlightKind.Text:
              return u.default.DocumentHighlightKind.Text;
            case qi.DocumentHighlightKind.Read:
              return u.default.DocumentHighlightKind.Read;
            case qi.DocumentHighlightKind.Write:
              return u.default.DocumentHighlightKind.Write;
          }
          return u.default.DocumentHighlightKind.Text;
        }
        function O(e) {
          return e <= qi.SymbolKind.TypeParameter ? e - 1 : u.default.SymbolKind.Property;
        }
        function F(e) {
          switch (e) {
            case qi.SymbolTag.Deprecated:
              return u.default.SymbolTag.Deprecated;
            default:
              return;
          }
        }
        function q(e) {
          if (null == e) return;
          const t = [];
          for (const n of e) {
            const e = F(n);
            void 0 !== e && t.push(e);
          }
          return 0 === t.length ? void 0 : t;
        }
        function N(e, t) {
          let n = new u.default.SymbolInformation(
            e.name,
            O(e.kind),
            h(e.location.range),
            e.location.uri ? r(e.location.uri) : t
          );
          return M(n, e), e.containerName && (n.containerName = e.containerName), n;
        }
        function I(e) {
          let t = new u.default.DocumentSymbol(e.name, e.detail || '', O(e.kind), h(e.range), h(e.selectionRange));
          if ((M(t, e), void 0 !== e.children && e.children.length > 0)) {
            let n = [];
            for (let t of e.children) n.push(I(t));
            t.children = n;
          }
          return t;
        }
        function M(e, t) {
          (e.tags = q(t.tags)),
            t.deprecated &&
              (e.tags
                ? e.tags.includes(u.default.SymbolTag.Deprecated) ||
                  (e.tags = e.tags.concat(u.default.SymbolTag.Deprecated))
                : (e.tags = [u.default.SymbolTag.Deprecated]));
        }
        function L(e) {
          let t = { title: e.title, command: e.command };
          return e.arguments && (t.arguments = e.arguments), t;
        }
        const A = new Map();
        function j(e) {
          if (null == e) return;
          let t = A.get(e);
          if (t) return t;
          let n = e.split('.');
          t = u.default.CodeActionKind.Empty;
          for (let e of n) t = t.append(e);
          return t;
        }
        function $(e) {
          if (!e) return;
          let t = new $i.default(h(e.range));
          return e.command && (t.command = L(e.command)), void 0 !== e.data && null !== e.data && (t.data = e.data), t;
        }
        function W(e) {
          if (!e) return;
          const t = new Map();
          if (void 0 !== e.changeAnnotations)
            for (const n of Object.keys(e.changeAnnotations)) {
              const i = K(e.changeAnnotations[n]);
              t.set(n, i);
            }
          const i = e => (void 0 === e ? void 0 : t.get(e)),
            o = new u.default.WorkspaceEdit();
          if (e.documentChanges)
            for (const t of e.documentChanges)
              if (qi.CreateFile.is(t)) o.createFile(r(t.uri), t.options, i(t.annotationId));
              else if (qi.RenameFile.is(t)) o.renameFile(r(t.oldUri), r(t.newUri), t.options, i(t.annotationId));
              else if (qi.DeleteFile.is(t)) o.deleteFile(r(t.uri), t.options, i(t.annotationId));
              else {
                if (!qi.TextDocumentEdit.is(t))
                  throw new Error('Unknown workspace edit change received:\n' + JSON.stringify(t, void 0, 4));
                {
                  const e = r(t.textDocument.uri);
                  for (const r of t.edits)
                    n.AnnotatedTextEdit.is(r)
                      ? o.replace(e, h(r.range), r.newText, i(r.annotationId))
                      : o.replace(e, h(r.range), r.newText);
                }
              }
          else
            e.changes &&
              Object.keys(e.changes).forEach(t => {
                o.set(r(t), w(e.changes[t]));
              });
          return o;
        }
        function K(e) {
          if (void 0 !== e)
            return { label: e.label, needsConfirmation: !!e.needsConfirmation, description: e.description };
        }
        function H(e) {
          let t = h(e.range),
            n = e.target ? o(e.target) : void 0,
            i = new Hi.default(t, n);
          return (
            void 0 !== e.tooltip && (i.tooltip = e.tooltip),
            void 0 !== e.data && null !== e.data && (i.data = e.data),
            i
          );
        }
        function U(e) {
          return new u.default.Color(e.red, e.green, e.blue, e.alpha);
        }
        function z(e) {
          return new u.default.ColorInformation(h(e.range), U(e.color));
        }
        function V(e) {
          let t = new u.default.ColorPresentation(e.label);
          return (t.additionalTextEdits = w(e.additionalTextEdits)), e.textEdit && (t.textEdit = R(e.textEdit)), t;
        }
        function B(e) {
          if (e)
            switch (e) {
              case qi.FoldingRangeKind.Comment:
                return u.default.FoldingRangeKind.Comment;
              case qi.FoldingRangeKind.Imports:
                return u.default.FoldingRangeKind.Imports;
              case qi.FoldingRangeKind.Region:
                return u.default.FoldingRangeKind.Region;
            }
        }
        function G(e) {
          return new u.default.FoldingRange(e.startLine, e.endLine, B(e.kind));
        }
        function X(e) {
          return new u.default.SelectionRange(h(e.range), e.parent ? X(e.parent) : void 0);
        }
        function J(e) {
          if (null === e) return;
          let t = new Ji.default(O(e.kind), e.name, e.detail || '', o(e.uri), h(e.range), h(e.selectionRange), e.data);
          return void 0 !== e.tags && (t.tags = q(e.tags)), t;
        }
        function Y(e) {
          return new u.default.CallHierarchyIncomingCall(J(e.from), p(e.fromRanges));
        }
        function Z(e) {
          return new u.default.CallHierarchyOutgoingCall(J(e.to), p(e.fromRanges));
        }
        function Q(e) {
          return new u.default.SemanticTokensEdit(
            e.start,
            e.deleteCount,
            void 0 !== e.data ? new Uint32Array(e.data) : void 0
          );
        }
        return (
          A.set(qi.CodeActionKind.Empty, u.default.CodeActionKind.Empty),
          A.set(qi.CodeActionKind.QuickFix, u.default.CodeActionKind.QuickFix),
          A.set(qi.CodeActionKind.Refactor, u.default.CodeActionKind.Refactor),
          A.set(qi.CodeActionKind.RefactorExtract, u.default.CodeActionKind.RefactorExtract),
          A.set(qi.CodeActionKind.RefactorInline, u.default.CodeActionKind.RefactorInline),
          A.set(qi.CodeActionKind.RefactorRewrite, u.default.CodeActionKind.RefactorRewrite),
          A.set(qi.CodeActionKind.Source, u.default.CodeActionKind.Source),
          A.set(qi.CodeActionKind.SourceOrganizeImports, u.default.CodeActionKind.SourceOrganizeImports),
          {
            asUri: o,
            asDiagnostics: s,
            asDiagnostic: a,
            asRange: h,
            asRanges: p,
            asPosition: d,
            asDiagnosticSeverity: f,
            asDiagnosticTag: l,
            asHover: function (e) {
              if (e)
                return new u.default.Hover(
                  (function (e) {
                    if (kt.string(e)) return m(e);
                    if (i.is(e)) return m().appendCodeblock(e.value, e.language);
                    if (Array.isArray(e)) {
                      let t = [];
                      for (let n of e) {
                        let e = m();
                        i.is(n) ? e.appendCodeblock(n.value, n.language) : e.appendMarkdown(n), t.push(e);
                      }
                      return t;
                    }
                    {
                      let t;
                      switch (e.kind) {
                        case qi.MarkupKind.Markdown:
                          return m(e.value);
                        case qi.MarkupKind.PlainText:
                          return (t = m()), t.appendText(e.value), t;
                        default:
                          return (t = m()), t.appendText('Unsupported Markup content received. Kind is: ' + e.kind), t;
                      }
                    }
                  })(e.contents),
                  h(e.range)
                );
            },
            asCompletionResult: function (e) {
              if (!e) return;
              if (Array.isArray(e)) {
                return e.map(y);
              }
              let t = e;
              return new u.default.CompletionList(t.items.map(y), t.isIncomplete);
            },
            asCompletionItem: y,
            asTextEdit: R,
            asTextEdits: w,
            asSignatureHelp: function (e) {
              if (!e) return;
              let t = new u.default.SignatureHelp();
              return (
                kt.number(e.activeSignature) ? (t.activeSignature = e.activeSignature) : (t.activeSignature = 0),
                kt.number(e.activeParameter) ? (t.activeParameter = e.activeParameter) : (t.activeParameter = 0),
                e.signatures && (t.signatures = T(e.signatures)),
                t
              );
            },
            asSignatureInformations: T,
            asSignatureInformation: b,
            asParameterInformations: S,
            asParameterInformation: _,
            asDeclarationResult: function (e) {
              if (e) return E(e);
            },
            asDefinitionResult: function (e) {
              if (e) return E(e);
            },
            asLocation: D,
            asReferences: function (e) {
              if (e) return e.map(e => D(e));
            },
            asDocumentHighlights: function (e) {
              if (e) return e.map(x);
            },
            asDocumentHighlight: x,
            asDocumentHighlightKind: k,
            asSymbolKind: O,
            asSymbolTag: F,
            asSymbolTags: q,
            asSymbolInformations: function (e, t) {
              if (e) return e.map(e => N(e, t));
            },
            asSymbolInformation: N,
            asDocumentSymbols: function (e) {
              if (null != e) return e.map(I);
            },
            asDocumentSymbol: I,
            asCommand: L,
            asCommands: function (e) {
              if (e) return e.map(L);
            },
            asCodeAction: function (e) {
              if (null == e) return;
              let t = new Vi.default(e.title, e.data);
              return (
                void 0 !== e.kind && (t.kind = j(e.kind)),
                void 0 !== e.diagnostics && (t.diagnostics = s(e.diagnostics)),
                void 0 !== e.edit && (t.edit = W(e.edit)),
                void 0 !== e.command && (t.command = L(e.command)),
                void 0 !== e.isPreferred && (t.isPreferred = e.isPreferred),
                void 0 !== e.disabled && (t.disabled = { reason: e.disabled.reason }),
                t
              );
            },
            asCodeActionKind: j,
            asCodeActionKinds: function (e) {
              if (null != e) return e.map(e => j(e));
            },
            asCodeLens: $,
            asCodeLenses: function (e) {
              if (e) return e.map(e => $(e));
            },
            asWorkspaceEdit: W,
            asDocumentLink: H,
            asDocumentLinks: function (e) {
              if (e) return e.map(H);
            },
            asFoldingRangeKind: B,
            asFoldingRange: G,
            asFoldingRanges: function (e) {
              if (Array.isArray(e)) return e.map(G);
            },
            asColor: U,
            asColorInformation: z,
            asColorInformations: function (e) {
              if (Array.isArray(e)) return e.map(z);
            },
            asColorPresentation: V,
            asColorPresentations: function (e) {
              if (Array.isArray(e)) return e.map(V);
            },
            asSelectionRange: X,
            asSelectionRanges: function (e) {
              if (!Array.isArray(e)) return [];
              let t = [];
              for (let n of e) t.push(X(n));
              return t;
            },
            asSemanticTokensLegend: function (e) {
              return e;
            },
            asSemanticTokens: function (e) {
              if (null != e) return new u.default.SemanticTokens(new Uint32Array(e.data), e.resultId);
            },
            asSemanticTokensEdit: Q,
            asSemanticTokensEdits: function (e) {
              if (null != e) return new u.default.SemanticTokensEdits(e.edits.map(Q), e.resultId);
            },
            asCallHierarchyItem: J,
            asCallHierarchyItems: function (e) {
              if (null !== e) return e.map(e => J(e));
            },
            asCallHierarchyIncomingCall: Y,
            asCallHierarchyIncomingCalls: function (e) {
              if (null !== e) return e.map(e => Y(e));
            },
            asCallHierarchyOutgoingCall: Z,
            asCallHierarchyOutgoingCalls: function (e) {
              if (null !== e) return e.map(e => Z(e));
            },
            asLinkedEditingRanges: function (e) {
              if (null != e)
                return new u.default.LinkedEditingRanges(
                  p(e.ranges),
                  (function (e) {
                    if (null == e) return;
                    return new RegExp(e);
                  })(e.wordPattern)
                );
            }
          }
        );
      });
  }),
  Qi = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.Delayer = void 0);
    t.Delayer = class {
      constructor(e) {
        (this.defaultDelay = e),
          (this.timeout = void 0),
          (this.completionPromise = void 0),
          (this.onSuccess = void 0),
          (this.task = void 0);
      }
      trigger(e, t = this.defaultDelay) {
        return (
          (this.task = e),
          t >= 0 && this.cancelTimeout(),
          this.completionPromise ||
            (this.completionPromise = new Promise(e => {
              this.onSuccess = e;
            }).then(() => {
              (this.completionPromise = void 0), (this.onSuccess = void 0);
              var e = this.task();
              return (this.task = void 0), e;
            })),
          (t >= 0 || void 0 === this.timeout) &&
            (this.timeout = qi.RAL().timer.setTimeout(
              () => {
                (this.timeout = void 0), this.onSuccess(void 0);
              },
              t >= 0 ? t : this.defaultDelay
            )),
          this.completionPromise
        );
      }
      forceDelivery() {
        if (!this.completionPromise) return;
        this.cancelTimeout();
        let e = this.task();
        return (this.completionPromise = void 0), (this.onSuccess = void 0), (this.task = void 0), e;
      }
      isTriggered() {
        return void 0 !== this.timeout;
      }
      cancel() {
        this.cancelTimeout(), (this.completionPromise = void 0);
      }
      cancelTimeout() {
        void 0 !== this.timeout && (qi.RAL().timer.clearTimeout(this.timeout), (this.timeout = void 0));
      }
    };
  }),
  er = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.generateUuid = t.parse = t.isUUID = t.v4 = t.empty = void 0);
    class n {
      constructor(e) {
        this._value = e;
      }
      asHex() {
        return this._value;
      }
      equals(e) {
        return this.asHex() === e.asHex();
      }
    }
    class i extends n {
      constructor() {
        super(
          [
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            '-',
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            '-',
            '4',
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            '-',
            i._oneOf(i._timeHighBits),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            '-',
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex(),
            i._randomHex()
          ].join('')
        );
      }
      static _oneOf(e) {
        return e[Math.floor(e.length * Math.random())];
      }
      static _randomHex() {
        return i._oneOf(i._chars);
      }
    }
    function r() {
      return new i();
    }
    (i._chars = ['0', '1', '2', '3', '4', '5', '6', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']),
      (i._timeHighBits = ['8', '9', 'a', 'b']),
      (t.empty = new n('00000000-0000-0000-0000-000000000000')),
      (t.v4 = r);
    const o = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    function s(e) {
      return o.test(e);
    }
    (t.isUUID = s),
      (t.parse = function (e) {
        if (!s(e)) throw new Error('invalid uuid');
        return new n(e);
      }),
      (t.generateUuid = function () {
        return r().asHex();
      });
  }),
  tr = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ProgressPart = void 0);
    t.ProgressPart = class {
      constructor(e, t, n) {
        (this._client = e),
          (this._token = t),
          (this._reported = 0),
          (this._disposable = this._client.onProgress(qi.WorkDoneProgress.type, this._token, e => {
            switch (e.kind) {
              case 'begin':
                this.begin(e);
                break;
              case 'report':
                this.report(e);
                break;
              case 'end':
                this.done(), n && n(this);
            }
          }));
      }
      begin(e) {
        u.default.window.withProgress(
          { location: u.default.ProgressLocation.Window, cancellable: e.cancellable, title: e.title },
          async (t, n) => (
            (this._progress = t),
            (this._infinite = void 0 === e.percentage),
            (this._cancellationToken = n),
            this._cancellationToken.onCancellationRequested(() => {
              this._client.sendNotification(qi.WorkDoneProgressCancelNotification.type, { token: this._token });
            }),
            this.report(e),
            new Promise((e, t) => {
              (this._resolve = e), (this._reject = t);
            })
          )
        );
      }
      report(e) {
        if (this._infinite && kt.string(e.message)) this._progress.report({ message: e.message });
        else if (kt.number(e.percentage)) {
          let t = Math.max(0, Math.min(e.percentage, 100)),
            n = Math.max(0, t - this._reported);
          this._progress.report({ message: e.message, increment: n }), (this._reported += n);
        }
      }
      cancel() {
        this._disposable && (this._disposable.dispose(), (this._disposable = void 0)),
          this._reject && (this._reject(), (this._resolve = void 0), (this._reject = void 0));
      }
      done() {
        this._disposable && (this._disposable.dispose(), (this._disposable = void 0)),
          this._resolve && (this._resolve(), (this._resolve = void 0), (this._reject = void 0));
      }
    };
  }),
  nr = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.BaseLanguageClient = t.MessageTransports = t.TextDocumentFeature = t.State = t.RevealOutputChannelOn = t.CloseAction = t.ErrorAction = void 0);
    class n {
      error(e) {
        qi.RAL().console.error(e);
      }
      warn(e) {
        qi.RAL().console.warn(e);
      }
      info(e) {
        qi.RAL().console.info(e);
      }
      log(e) {
        qi.RAL().console.log(e);
      }
    }
    var i, r, o, s, a;
    !(function (e) {
      (e[(e.Continue = 1)] = 'Continue'), (e[(e.Shutdown = 2)] = 'Shutdown');
    })((i = t.ErrorAction || (t.ErrorAction = {}))),
      (function (e) {
        (e[(e.DoNotRestart = 1)] = 'DoNotRestart'), (e[(e.Restart = 2)] = 'Restart');
      })((r = t.CloseAction || (t.CloseAction = {})));
    class c {
      constructor(e, t) {
        (this.name = e), (this.maxRestartCount = t), (this.restarts = []);
      }
      error(e, t, n) {
        return n && n <= 3 ? i.Continue : i.Shutdown;
      }
      closed() {
        if ((this.restarts.push(Date.now()), this.restarts.length <= this.maxRestartCount)) return r.Restart;
        return this.restarts[this.restarts.length - 1] - this.restarts[0] <= 18e4
          ? (u.default.window.showErrorMessage(
              `The ${this.name} server crashed ${
                this.maxRestartCount + 1
              } times in the last 3 minutes. The server will not be restarted.`
            ),
            r.DoNotRestart)
          : (this.restarts.shift(), r.Restart);
      }
    }
    !(function (e) {
      (e[(e.Info = 1)] = 'Info'),
        (e[(e.Warn = 2)] = 'Warn'),
        (e[(e.Error = 3)] = 'Error'),
        (e[(e.Never = 4)] = 'Never');
    })((o = t.RevealOutputChannelOn || (t.RevealOutputChannelOn = {}))),
      (function (e) {
        (e[(e.Stopped = 1)] = 'Stopped'), (e[(e.Starting = 3)] = 'Starting'), (e[(e.Running = 2)] = 'Running');
      })((s = t.State || (t.State = {}))),
      (function (e) {
        (e[(e.Initial = 0)] = 'Initial'),
          (e[(e.Starting = 1)] = 'Starting'),
          (e[(e.StartFailed = 2)] = 'StartFailed'),
          (e[(e.Running = 3)] = 'Running'),
          (e[(e.Stopping = 4)] = 'Stopping'),
          (e[(e.Stopped = 5)] = 'Stopped');
      })(a || (a = {}));
    const l = [
        qi.SymbolKind.File,
        qi.SymbolKind.Module,
        qi.SymbolKind.Namespace,
        qi.SymbolKind.Package,
        qi.SymbolKind.Class,
        qi.SymbolKind.Method,
        qi.SymbolKind.Property,
        qi.SymbolKind.Field,
        qi.SymbolKind.Constructor,
        qi.SymbolKind.Enum,
        qi.SymbolKind.Interface,
        qi.SymbolKind.Function,
        qi.SymbolKind.Variable,
        qi.SymbolKind.Constant,
        qi.SymbolKind.String,
        qi.SymbolKind.Number,
        qi.SymbolKind.Boolean,
        qi.SymbolKind.Array,
        qi.SymbolKind.Object,
        qi.SymbolKind.Key,
        qi.SymbolKind.Null,
        qi.SymbolKind.EnumMember,
        qi.SymbolKind.Struct,
        qi.SymbolKind.Event,
        qi.SymbolKind.Operator,
        qi.SymbolKind.TypeParameter
      ],
      d = [
        qi.CompletionItemKind.Text,
        qi.CompletionItemKind.Method,
        qi.CompletionItemKind.Function,
        qi.CompletionItemKind.Constructor,
        qi.CompletionItemKind.Field,
        qi.CompletionItemKind.Variable,
        qi.CompletionItemKind.Class,
        qi.CompletionItemKind.Interface,
        qi.CompletionItemKind.Module,
        qi.CompletionItemKind.Property,
        qi.CompletionItemKind.Unit,
        qi.CompletionItemKind.Value,
        qi.CompletionItemKind.Enum,
        qi.CompletionItemKind.Keyword,
        qi.CompletionItemKind.Snippet,
        qi.CompletionItemKind.Color,
        qi.CompletionItemKind.File,
        qi.CompletionItemKind.Reference,
        qi.CompletionItemKind.Folder,
        qi.CompletionItemKind.EnumMember,
        qi.CompletionItemKind.Constant,
        qi.CompletionItemKind.Struct,
        qi.CompletionItemKind.Event,
        qi.CompletionItemKind.Operator,
        qi.CompletionItemKind.TypeParameter
      ],
      h = [qi.SymbolTag.Deprecated];
    function p(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    var f, g;
    !(function (e) {
      e.fromConfiguration = function (e) {
        const t = u.default.workspace.getConfiguration('files', e);
        return {
          trimTrailingWhitespace: t.get('trimTrailingWhitespace'),
          trimFinalNewlines: t.get('trimFinalNewlines'),
          insertFinalNewline: t.get('insertFinalNewline')
        };
      };
    })(f || (f = {})),
      (function (e) {
        e.is = function (e) {
          let t = e;
          return (
            t && kt.func(t.register) && kt.func(t.unregister) && kt.func(t.dispose) && void 0 !== t.registrationType
          );
        };
      })(g || (g = {}));
    class m {
      constructor(e, t, n, i, r, o) {
        (this._client = e),
          (this._event = t),
          (this._type = n),
          (this._middleware = i),
          (this._createParams = r),
          (this._selectorFilter = o),
          (this._selectors = new Map());
      }
      static textDocumentFilter(e, t) {
        for (const n of e) if (u.default.languages.match(n, t)) return !0;
        return !1;
      }
      register(e) {
        e.registerOptions.documentSelector &&
          (this._listener || (this._listener = this._event(this.callback, this)),
          this._selectors.set(e.id, e.registerOptions.documentSelector));
      }
      callback(e) {
        (this._selectorFilter && !this._selectorFilter(this._selectors.values(), e)) ||
          (this._middleware
            ? this._middleware(e, e => this._client.sendNotification(this._type, this._createParams(e)))
            : this._client.sendNotification(this._type, this._createParams(e)),
          this.notificationSent(e));
      }
      notificationSent(e) {}
      unregister(e) {
        this._selectors.delete(e),
          0 === this._selectors.size && this._listener && (this._listener.dispose(), (this._listener = void 0));
      }
      dispose() {
        this._selectors.clear(), this._listener && (this._listener.dispose(), (this._listener = void 0));
      }
      getProvider(e) {
        for (const t of this._selectors.values())
          if (u.default.languages.match(t, e))
            return {
              send: e => {
                this.callback(e);
              }
            };
      }
    }
    class v extends m {
      constructor(e, t) {
        super(
          e,
          u.default.workspace.onDidOpenTextDocument,
          qi.DidOpenTextDocumentNotification.type,
          e.clientOptions.middleware.didOpen,
          t => e.code2ProtocolConverter.asOpenTextDocumentParams(t),
          m.textDocumentFilter
        ),
          (this._syncedDocuments = t);
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'synchronization').dynamicRegistration = !0;
      }
      initialize(e, t) {
        let n = e.resolvedTextDocumentSync;
        t && n && n.openClose && this.register({ id: er.generateUuid(), registerOptions: { documentSelector: t } });
      }
      get registrationType() {
        return qi.DidOpenTextDocumentNotification.type;
      }
      register(e) {
        if ((super.register(e), !e.registerOptions.documentSelector)) return;
        let t = e.registerOptions.documentSelector;
        u.default.workspace.textDocuments.forEach(e => {
          let n = e.uri.toString();
          if (!this._syncedDocuments.has(n) && u.default.languages.match(t, e)) {
            let t = this._client.clientOptions.middleware,
              i = e => {
                this._client.sendNotification(this._type, this._createParams(e));
              };
            t.didOpen ? t.didOpen(e, i) : i(e), this._syncedDocuments.set(n, e);
          }
        });
      }
      notificationSent(e) {
        super.notificationSent(e), this._syncedDocuments.set(e.uri.toString(), e);
      }
    }
    class y extends m {
      constructor(e, t) {
        super(
          e,
          u.default.workspace.onDidCloseTextDocument,
          qi.DidCloseTextDocumentNotification.type,
          e.clientOptions.middleware.didClose,
          t => e.code2ProtocolConverter.asCloseTextDocumentParams(t),
          m.textDocumentFilter
        ),
          (this._syncedDocuments = t);
      }
      get registrationType() {
        return qi.DidCloseTextDocumentNotification.type;
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'synchronization').dynamicRegistration = !0;
      }
      initialize(e, t) {
        let n = e.resolvedTextDocumentSync;
        t && n && n.openClose && this.register({ id: er.generateUuid(), registerOptions: { documentSelector: t } });
      }
      notificationSent(e) {
        super.notificationSent(e), this._syncedDocuments.delete(e.uri.toString());
      }
      unregister(e) {
        let t = this._selectors.get(e);
        super.unregister(e);
        let n = this._selectors.values();
        this._syncedDocuments.forEach(e => {
          if (u.default.languages.match(t, e) && !this._selectorFilter(n, e)) {
            let t = this._client.clientOptions.middleware,
              n = e => {
                this._client.sendNotification(this._type, this._createParams(e));
              };
            this._syncedDocuments.delete(e.uri.toString()), t.didClose ? t.didClose(e, n) : n(e);
          }
        });
      }
    }
    class C {
      constructor(e) {
        (this._client = e), (this._changeData = new Map()), (this._forcingDelivery = !1);
      }
      get registrationType() {
        return qi.DidChangeTextDocumentNotification.type;
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'synchronization').dynamicRegistration = !0;
      }
      initialize(e, t) {
        let n = e.resolvedTextDocumentSync;
        t &&
          n &&
          void 0 !== n.change &&
          n.change !== qi.TextDocumentSyncKind.None &&
          this.register({
            id: er.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector: t }, { syncKind: n.change })
          });
      }
      register(e) {
        e.registerOptions.documentSelector &&
          (this._listener || (this._listener = u.default.workspace.onDidChangeTextDocument(this.callback, this)),
          this._changeData.set(e.id, {
            documentSelector: e.registerOptions.documentSelector,
            syncKind: e.registerOptions.syncKind
          }));
      }
      callback(e) {
        if (0 !== e.contentChanges.length)
          for (const t of this._changeData.values())
            if (u.default.languages.match(t.documentSelector, e.document)) {
              let n = this._client.clientOptions.middleware;
              if (t.syncKind === qi.TextDocumentSyncKind.Incremental) {
                let t = this._client.code2ProtocolConverter.asChangeTextDocumentParams(e);
                n.didChange
                  ? n.didChange(e, () => this._client.sendNotification(qi.DidChangeTextDocumentNotification.type, t))
                  : this._client.sendNotification(qi.DidChangeTextDocumentNotification.type, t);
              } else if (t.syncKind === qi.TextDocumentSyncKind.Full) {
                let t = e => {
                  this._changeDelayer
                    ? (this._changeDelayer.uri !== e.document.uri.toString() &&
                        (this.forceDelivery(), (this._changeDelayer.uri = e.document.uri.toString())),
                      this._changeDelayer.delayer.trigger(() => {
                        this._client.sendNotification(
                          qi.DidChangeTextDocumentNotification.type,
                          this._client.code2ProtocolConverter.asChangeTextDocumentParams(e.document)
                        );
                      }))
                    : ((this._changeDelayer = { uri: e.document.uri.toString(), delayer: new Qi.Delayer(200) }),
                      this._changeDelayer.delayer.trigger(() => {
                        this._client.sendNotification(
                          qi.DidChangeTextDocumentNotification.type,
                          this._client.code2ProtocolConverter.asChangeTextDocumentParams(e.document)
                        );
                      }, -1));
                };
                n.didChange ? n.didChange(e, t) : t(e);
              }
            }
      }
      unregister(e) {
        this._changeData.delete(e),
          0 === this._changeData.size && this._listener && (this._listener.dispose(), (this._listener = void 0));
      }
      dispose() {
        (this._changeDelayer = void 0),
          (this._forcingDelivery = !1),
          this._changeData.clear(),
          this._listener && (this._listener.dispose(), (this._listener = void 0));
      }
      forceDelivery() {
        if (!this._forcingDelivery && this._changeDelayer)
          try {
            (this._forcingDelivery = !0), this._changeDelayer.delayer.forceDelivery();
          } finally {
            this._forcingDelivery = !1;
          }
      }
      getProvider(e) {
        for (const t of this._changeData.values())
          if (u.default.languages.match(t.documentSelector, e))
            return {
              send: e => {
                this.callback(e);
              }
            };
      }
    }
    class R extends m {
      constructor(e) {
        super(
          e,
          u.default.workspace.onWillSaveTextDocument,
          qi.WillSaveTextDocumentNotification.type,
          e.clientOptions.middleware.willSave,
          t => e.code2ProtocolConverter.asWillSaveTextDocumentParams(t),
          (e, t) => m.textDocumentFilter(e, t.document)
        );
      }
      get registrationType() {
        return qi.WillSaveTextDocumentNotification.type;
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'synchronization').willSave = !0;
      }
      initialize(e, t) {
        let n = e.resolvedTextDocumentSync;
        t && n && n.willSave && this.register({ id: er.generateUuid(), registerOptions: { documentSelector: t } });
      }
    }
    class w {
      constructor(e) {
        (this._client = e), (this._selectors = new Map());
      }
      get registrationType() {
        return qi.WillSaveTextDocumentWaitUntilRequest.type;
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'synchronization').willSaveWaitUntil = !0;
      }
      initialize(e, t) {
        let n = e.resolvedTextDocumentSync;
        t &&
          n &&
          n.willSaveWaitUntil &&
          this.register({ id: er.generateUuid(), registerOptions: { documentSelector: t } });
      }
      register(e) {
        e.registerOptions.documentSelector &&
          (this._listener || (this._listener = u.default.workspace.onWillSaveTextDocument(this.callback, this)),
          this._selectors.set(e.id, e.registerOptions.documentSelector));
      }
      callback(e) {
        if (m.textDocumentFilter(this._selectors.values(), e.document)) {
          let t = this._client.clientOptions.middleware,
            n = e =>
              this._client
                .sendRequest(
                  qi.WillSaveTextDocumentWaitUntilRequest.type,
                  this._client.code2ProtocolConverter.asWillSaveTextDocumentParams(e)
                )
                .then(e => {
                  let t = this._client.protocol2CodeConverter.asTextEdits(e);
                  return void 0 === t ? [] : t;
                });
          e.waitUntil(t.willSaveWaitUntil ? t.willSaveWaitUntil(e, n) : n(e));
        }
      }
      unregister(e) {
        this._selectors.delete(e),
          0 === this._selectors.size && this._listener && (this._listener.dispose(), (this._listener = void 0));
      }
      dispose() {
        this._selectors.clear(), this._listener && (this._listener.dispose(), (this._listener = void 0));
      }
    }
    class T extends m {
      constructor(e) {
        super(
          e,
          u.default.workspace.onDidSaveTextDocument,
          qi.DidSaveTextDocumentNotification.type,
          e.clientOptions.middleware.didSave,
          t => e.code2ProtocolConverter.asSaveTextDocumentParams(t, this._includeText),
          m.textDocumentFilter
        ),
          (this._includeText = !1);
      }
      get registrationType() {
        return qi.DidSaveTextDocumentNotification.type;
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'synchronization').didSave = !0;
      }
      initialize(e, t) {
        const n = e.resolvedTextDocumentSync;
        if (t && n && n.save) {
          const e = 'boolean' == typeof n.save ? { includeText: !1 } : { includeText: !!n.save.includeText };
          this.register({ id: er.generateUuid(), registerOptions: Object.assign({}, { documentSelector: t }, e) });
        }
      }
      register(e) {
        (this._includeText = !!e.registerOptions.includeText), super.register(e);
      }
    }
    class b {
      constructor(e, t) {
        (this._client = e), (this._notifyFileEvent = t), (this._watchers = new Map());
      }
      get registrationType() {
        return qi.DidChangeWatchedFilesNotification.type;
      }
      fillClientCapabilities(e) {
        p(p(e, 'workspace'), 'didChangeWatchedFiles').dynamicRegistration = !0;
      }
      initialize(e, t) {}
      register(e) {
        if (!Array.isArray(e.registerOptions.watchers)) return;
        let t = [];
        for (let n of e.registerOptions.watchers) {
          if (!kt.string(n.globPattern)) continue;
          let e = !0,
            i = !0,
            r = !0;
          void 0 !== n.kind &&
            null !== n.kind &&
            ((e = 0 != (n.kind & qi.WatchKind.Create)),
            (i = 0 != (n.kind & qi.WatchKind.Change)),
            (r = 0 != (n.kind & qi.WatchKind.Delete)));
          let o = u.default.workspace.createFileSystemWatcher(n.globPattern, !e, !i, !r);
          this.hookListeners(o, e, i, r), t.push(o);
        }
        this._watchers.set(e.id, t);
      }
      registerRaw(e, t) {
        let n = [];
        for (let e of t) this.hookListeners(e, !0, !0, !0, n);
        this._watchers.set(e, n);
      }
      hookListeners(e, t, n, i, r) {
        t &&
          e.onDidCreate(
            e =>
              this._notifyFileEvent({
                uri: this._client.code2ProtocolConverter.asUri(e),
                type: qi.FileChangeType.Created
              }),
            null,
            r
          ),
          n &&
            e.onDidChange(
              e =>
                this._notifyFileEvent({
                  uri: this._client.code2ProtocolConverter.asUri(e),
                  type: qi.FileChangeType.Changed
                }),
              null,
              r
            ),
          i &&
            e.onDidDelete(
              e =>
                this._notifyFileEvent({
                  uri: this._client.code2ProtocolConverter.asUri(e),
                  type: qi.FileChangeType.Deleted
                }),
              null,
              r
            );
      }
      unregister(e) {
        let t = this._watchers.get(e);
        if (t) for (let e of t) e.dispose();
      }
      dispose() {
        this._watchers.forEach(e => {
          for (let t of e) t.dispose();
        }),
          this._watchers.clear();
      }
    }
    class S {
      constructor(e, t) {
        (this._client = e), (this._registrationType = t), (this._registrations = new Map());
      }
      get registrationType() {
        return this._registrationType;
      }
      register(e) {
        if (!e.registerOptions.documentSelector) return;
        let t = this.registerLanguageProvider(e.registerOptions);
        this._registrations.set(e.id, { disposable: t[0], data: e, provider: t[1] });
      }
      unregister(e) {
        let t = this._registrations.get(e);
        void 0 !== t && t.disposable.dispose();
      }
      dispose() {
        this._registrations.forEach(e => {
          e.disposable.dispose();
        }),
          this._registrations.clear();
      }
      getRegistration(e, t) {
        if (!t) return [void 0, void 0];
        if (qi.TextDocumentRegistrationOptions.is(t)) {
          const n = qi.StaticRegistrationOptions.hasId(t) ? t.id : er.generateUuid(),
            i = t.documentSelector || e;
          if (i) return [n, Object.assign({}, t, { documentSelector: i })];
        } else if ((kt.boolean(t) && !0 === t) || qi.WorkDoneProgressOptions.is(t)) {
          if (!e) return [void 0, void 0];
          let n = kt.boolean(t) && !0 === t ? { documentSelector: e } : Object.assign({}, t, { documentSelector: e });
          return [er.generateUuid(), n];
        }
        return [void 0, void 0];
      }
      getRegistrationOptions(e, t) {
        if (e && t)
          return kt.boolean(t) && !0 === t ? { documentSelector: e } : Object.assign({}, t, { documentSelector: e });
      }
      getProvider(e) {
        for (const t of this._registrations.values()) {
          let n = t.data.registerOptions.documentSelector;
          if (null !== n && u.default.languages.match(n, e)) return t.provider;
        }
      }
      getAllProviders() {
        const e = [];
        for (const t of this._registrations.values()) e.push(t.provider);
        return e;
      }
    }
    t.TextDocumentFeature = S;
    class _ extends S {
      constructor(e) {
        super(e, qi.CompletionRequest.type);
      }
      fillClientCapabilities(e) {
        let t = p(p(e, 'textDocument'), 'completion');
        (t.dynamicRegistration = !0),
          (t.contextSupport = !0),
          (t.completionItem = {
            snippetSupport: !0,
            commitCharactersSupport: !0,
            documentationFormat: [qi.MarkupKind.Markdown, qi.MarkupKind.PlainText],
            deprecatedSupport: !0,
            preselectSupport: !0,
            tagSupport: { valueSet: [qi.CompletionItemTag.Deprecated] },
            insertReplaceSupport: !0,
            resolveSupport: { properties: ['documentation', 'detail', 'additionalTextEdits'] },
            insertTextModeSupport: { valueSet: [qi.InsertTextMode.asIs, qi.InsertTextMode.adjustIndentation] }
          }),
          (t.completionItemKind = { valueSet: d });
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.completionProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = e.triggerCharacters || [],
          n = {
            provideCompletionItems: (e, t, n, i) => {
              const r = this._client,
                o = this._client.clientOptions.middleware,
                s = (e, t, n, i) =>
                  r
                    .sendRequest(qi.CompletionRequest.type, r.code2ProtocolConverter.asCompletionParams(e, t, n), i)
                    .then(r.protocol2CodeConverter.asCompletionResult, e =>
                      r.handleFailedRequest(qi.CompletionRequest.type, e, null)
                    );
              return o.provideCompletionItem ? o.provideCompletionItem(e, t, i, n, s) : s(e, t, i, n);
            },
            resolveCompletionItem: e.resolveProvider
              ? (e, t) => {
                  const n = this._client,
                    i = this._client.clientOptions.middleware,
                    r = (e, t) =>
                      n
                        .sendRequest(qi.CompletionResolveRequest.type, n.code2ProtocolConverter.asCompletionItem(e), t)
                        .then(n.protocol2CodeConverter.asCompletionItem, t =>
                          n.handleFailedRequest(qi.CompletionResolveRequest.type, t, e)
                        );
                  return i.resolveCompletionItem ? i.resolveCompletionItem(e, t, r) : r(e, t);
                }
              : void 0
          };
        return [u.default.languages.registerCompletionItemProvider(e.documentSelector, n, ...t), n];
      }
    }
    class D extends S {
      constructor(e) {
        super(e, qi.HoverRequest.type);
      }
      fillClientCapabilities(e) {
        const t = p(p(e, 'textDocument'), 'hover');
        (t.dynamicRegistration = !0), (t.contentFormat = [qi.MarkupKind.Markdown, qi.MarkupKind.PlainText]);
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.hoverProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideHover: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) =>
                i
                  .sendRequest(qi.HoverRequest.type, i.code2ProtocolConverter.asTextDocumentPositionParams(e, t), n)
                  .then(i.protocol2CodeConverter.asHover, e => i.handleFailedRequest(qi.HoverRequest.type, e, null)),
              o = i.clientOptions.middleware;
            return o.provideHover ? o.provideHover(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerHoverProvider(e.documentSelector, t), t];
      }
    }
    class P extends S {
      constructor(e) {
        super(e, qi.SignatureHelpRequest.type);
      }
      fillClientCapabilities(e) {
        let t = p(p(e, 'textDocument'), 'signatureHelp');
        (t.dynamicRegistration = !0),
          (t.signatureInformation = { documentationFormat: [qi.MarkupKind.Markdown, qi.MarkupKind.PlainText] }),
          (t.signatureInformation.parameterInformation = { labelOffsetSupport: !0 }),
          (t.signatureInformation.activeParameterSupport = !0),
          (t.contextSupport = !0);
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.signatureHelpProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideSignatureHelp: (e, t, n, i) => {
            const r = this._client,
              o = (e, t, n, i) =>
                r
                  .sendRequest(qi.SignatureHelpRequest.type, r.code2ProtocolConverter.asSignatureHelpParams(e, t, n), i)
                  .then(r.protocol2CodeConverter.asSignatureHelp, e =>
                    r.handleFailedRequest(qi.SignatureHelpRequest.type, e, null)
                  ),
              s = r.clientOptions.middleware;
            return s.provideSignatureHelp ? s.provideSignatureHelp(e, t, i, n, o) : o(e, t, i, n);
          }
        };
        let n;
        if (void 0 === e.retriggerCharacters) {
          const i = e.triggerCharacters || [];
          n = u.default.languages.registerSignatureHelpProvider(e.documentSelector, t, ...i);
        } else {
          const i = { triggerCharacters: e.triggerCharacters || [], retriggerCharacters: e.retriggerCharacters || [] };
          n = u.default.languages.registerSignatureHelpProvider(e.documentSelector, t, i);
        }
        return [n, t];
      }
    }
    class E extends S {
      constructor(e) {
        super(e, qi.DefinitionRequest.type);
      }
      fillClientCapabilities(e) {
        let t = p(p(e, 'textDocument'), 'definition');
        (t.dynamicRegistration = !0), (t.linkSupport = !0);
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.definitionProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideDefinition: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) =>
                i
                  .sendRequest(
                    qi.DefinitionRequest.type,
                    i.code2ProtocolConverter.asTextDocumentPositionParams(e, t),
                    n
                  )
                  .then(i.protocol2CodeConverter.asDefinitionResult, e =>
                    i.handleFailedRequest(qi.DefinitionRequest.type, e, null)
                  ),
              o = i.clientOptions.middleware;
            return o.provideDefinition ? o.provideDefinition(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerDefinitionProvider(e.documentSelector, t), t];
      }
    }
    class x extends S {
      constructor(e) {
        super(e, qi.ReferencesRequest.type);
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'references').dynamicRegistration = !0;
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.referencesProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideReferences: (e, t, n, i) => {
            const r = this._client,
              o = (e, t, n, i) =>
                r
                  .sendRequest(qi.ReferencesRequest.type, r.code2ProtocolConverter.asReferenceParams(e, t, n), i)
                  .then(r.protocol2CodeConverter.asReferences, e =>
                    r.handleFailedRequest(qi.ReferencesRequest.type, e, null)
                  ),
              s = r.clientOptions.middleware;
            return s.provideReferences ? s.provideReferences(e, t, n, i, o) : o(e, t, n, i);
          }
        };
        return [u.default.languages.registerReferenceProvider(e.documentSelector, t), t];
      }
    }
    class k extends S {
      constructor(e) {
        super(e, qi.DocumentHighlightRequest.type);
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'documentHighlight').dynamicRegistration = !0;
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.documentHighlightProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideDocumentHighlights: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) =>
                i
                  .sendRequest(
                    qi.DocumentHighlightRequest.type,
                    i.code2ProtocolConverter.asTextDocumentPositionParams(e, t),
                    n
                  )
                  .then(i.protocol2CodeConverter.asDocumentHighlights, e =>
                    i.handleFailedRequest(qi.DocumentHighlightRequest.type, e, null)
                  ),
              o = i.clientOptions.middleware;
            return o.provideDocumentHighlights ? o.provideDocumentHighlights(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerDocumentHighlightProvider(e.documentSelector, t), t];
      }
    }
    class O extends S {
      constructor(e) {
        super(e, qi.DocumentSymbolRequest.type);
      }
      fillClientCapabilities(e) {
        let t = p(p(e, 'textDocument'), 'documentSymbol');
        (t.dynamicRegistration = !0),
          (t.symbolKind = { valueSet: l }),
          (t.hierarchicalDocumentSymbolSupport = !0),
          (t.tagSupport = { valueSet: h }),
          (t.labelSupport = !0);
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.documentSymbolProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
            provideDocumentSymbols: (e, t) => {
              const n = this._client,
                i = (e, t) =>
                  n
                    .sendRequest(qi.DocumentSymbolRequest.type, n.code2ProtocolConverter.asDocumentSymbolParams(e), t)
                    .then(
                      e => {
                        if (null !== e) {
                          if (0 === e.length) return [];
                          {
                            let t = e[0];
                            return qi.DocumentSymbol.is(t)
                              ? n.protocol2CodeConverter.asDocumentSymbols(e)
                              : n.protocol2CodeConverter.asSymbolInformations(e);
                          }
                        }
                      },
                      e => n.handleFailedRequest(qi.DocumentSymbolRequest.type, e, null)
                    ),
                r = n.clientOptions.middleware;
              return r.provideDocumentSymbols ? r.provideDocumentSymbols(e, t, i) : i(e, t);
            }
          },
          n = void 0 !== e.label ? { label: e.label } : void 0;
        return [u.default.languages.registerDocumentSymbolProvider(e.documentSelector, t, n), t];
      }
    }
    class F extends class {
      constructor(e, t) {
        (this._client = e), (this._registrationType = t), (this._registrations = new Map());
      }
      get registrationType() {
        return this._registrationType;
      }
      register(e) {
        const t = this.registerLanguageProvider(e.registerOptions);
        this._registrations.set(e.id, { disposable: t[0], provider: t[1] });
      }
      unregister(e) {
        let t = this._registrations.get(e);
        void 0 !== t && t.disposable.dispose();
      }
      dispose() {
        this._registrations.forEach(e => {
          e.disposable.dispose();
        }),
          this._registrations.clear();
      }
      getProviders() {
        const e = [];
        for (const t of this._registrations.values()) e.push(t.provider);
        return e;
      }
    } {
      constructor(e) {
        super(e, qi.WorkspaceSymbolRequest.type);
      }
      fillClientCapabilities(e) {
        let t = p(p(e, 'workspace'), 'symbol');
        (t.dynamicRegistration = !0), (t.symbolKind = { valueSet: l }), (t.tagSupport = { valueSet: h });
      }
      initialize(e) {
        e.workspaceSymbolProvider &&
          this.register({
            id: er.generateUuid(),
            registerOptions: !0 === e.workspaceSymbolProvider ? { workDoneProgress: !1 } : e.workspaceSymbolProvider
          });
      }
      registerLanguageProvider(e) {
        const t = {
          provideWorkspaceSymbols: (e, t) => {
            const n = this._client,
              i = (e, t) =>
                n
                  .sendRequest(qi.WorkspaceSymbolRequest.type, { query: e }, t)
                  .then(n.protocol2CodeConverter.asSymbolInformations, e =>
                    n.handleFailedRequest(qi.WorkspaceSymbolRequest.type, e, null)
                  ),
              r = n.clientOptions.middleware;
            return r.provideWorkspaceSymbols ? r.provideWorkspaceSymbols(e, t, i) : i(e, t);
          }
        };
        return [u.default.languages.registerWorkspaceSymbolProvider(t), t];
      }
    }
    class q extends S {
      constructor(e) {
        super(e, qi.CodeActionRequest.type);
      }
      fillClientCapabilities(e) {
        const t = p(p(e, 'textDocument'), 'codeAction');
        (t.dynamicRegistration = !0),
          (t.isPreferredSupport = !0),
          (t.disabledSupport = !0),
          (t.dataSupport = !0),
          (t.resolveSupport = { properties: ['edit'] }),
          (t.codeActionLiteralSupport = {
            codeActionKind: {
              valueSet: [
                qi.CodeActionKind.Empty,
                qi.CodeActionKind.QuickFix,
                qi.CodeActionKind.Refactor,
                qi.CodeActionKind.RefactorExtract,
                qi.CodeActionKind.RefactorInline,
                qi.CodeActionKind.RefactorRewrite,
                qi.CodeActionKind.Source,
                qi.CodeActionKind.SourceOrganizeImports
              ]
            }
          }),
          (t.honorsChangeAnnotations = !1);
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.codeActionProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideCodeActions: (e, t, n, i) => {
            const r = this._client,
              o = (e, t, n, i) => {
                const o = {
                  textDocument: r.code2ProtocolConverter.asTextDocumentIdentifier(e),
                  range: r.code2ProtocolConverter.asRange(t),
                  context: r.code2ProtocolConverter.asCodeActionContext(n)
                };
                return r.sendRequest(qi.CodeActionRequest.type, o, i).then(
                  e => {
                    if (null === e) return;
                    const t = [];
                    for (let n of e)
                      qi.Command.is(n)
                        ? t.push(r.protocol2CodeConverter.asCommand(n))
                        : t.push(r.protocol2CodeConverter.asCodeAction(n));
                    return t;
                  },
                  e => r.handleFailedRequest(qi.CodeActionRequest.type, e, null)
                );
              },
              s = r.clientOptions.middleware;
            return s.provideCodeActions ? s.provideCodeActions(e, t, n, i, o) : o(e, t, n, i);
          },
          resolveCodeAction: e.resolveProvider
            ? (e, t) => {
                const n = this._client,
                  i = this._client.clientOptions.middleware,
                  r = (e, t) =>
                    n
                      .sendRequest(qi.CodeActionResolveRequest.type, n.code2ProtocolConverter.asCodeAction(e), t)
                      .then(n.protocol2CodeConverter.asCodeAction, t =>
                        n.handleFailedRequest(qi.CodeActionResolveRequest.type, t, e)
                      );
                return i.resolveCodeAction ? i.resolveCodeAction(e, t, r) : r(e, t);
              }
            : void 0
        };
        return [
          u.default.languages.registerCodeActionsProvider(
            e.documentSelector,
            t,
            e.codeActionKinds
              ? { providedCodeActionKinds: this._client.protocol2CodeConverter.asCodeActionKinds(e.codeActionKinds) }
              : void 0
          ),
          t
        ];
      }
    }
    class N extends S {
      constructor(e) {
        super(e, qi.CodeLensRequest.type);
      }
      fillClientCapabilities(e) {
        (p(p(e, 'textDocument'), 'codeLens').dynamicRegistration = !0),
          (p(p(e, 'workspace'), 'codeLens').refreshSupport = !0);
      }
      initialize(e, t) {
        this._client.onRequest(qi.CodeLensRefreshRequest.type, async () => {
          for (const e of this.getAllProviders()) e.onDidChangeCodeLensEmitter.fire();
        });
        const n = this.getRegistrationOptions(t, e.codeLensProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = new u.default.EventEmitter(),
          n = {
            onDidChangeCodeLenses: t.event,
            provideCodeLenses: (e, t) => {
              const n = this._client,
                i = (e, t) =>
                  n
                    .sendRequest(qi.CodeLensRequest.type, n.code2ProtocolConverter.asCodeLensParams(e), t)
                    .then(n.protocol2CodeConverter.asCodeLenses, e =>
                      n.handleFailedRequest(qi.CodeLensRequest.type, e, null)
                    ),
                r = n.clientOptions.middleware;
              return r.provideCodeLenses ? r.provideCodeLenses(e, t, i) : i(e, t);
            },
            resolveCodeLens: e.resolveProvider
              ? (e, t) => {
                  const n = this._client,
                    i = (e, t) =>
                      n
                        .sendRequest(qi.CodeLensResolveRequest.type, n.code2ProtocolConverter.asCodeLens(e), t)
                        .then(n.protocol2CodeConverter.asCodeLens, t =>
                          n.handleFailedRequest(qi.CodeLensResolveRequest.type, t, e)
                        ),
                    r = n.clientOptions.middleware;
                  return r.resolveCodeLens ? r.resolveCodeLens(e, t, i) : i(e, t);
                }
              : void 0
          };
        return [
          u.default.languages.registerCodeLensProvider(e.documentSelector, n),
          { provider: n, onDidChangeCodeLensEmitter: t }
        ];
      }
    }
    class I extends S {
      constructor(e) {
        super(e, qi.DocumentFormattingRequest.type);
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'formatting').dynamicRegistration = !0;
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.documentFormattingProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideDocumentFormattingEdits: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) => {
                const r = {
                  textDocument: i.code2ProtocolConverter.asTextDocumentIdentifier(e),
                  options: i.code2ProtocolConverter.asFormattingOptions(t, f.fromConfiguration(e))
                };
                return i
                  .sendRequest(qi.DocumentFormattingRequest.type, r, n)
                  .then(i.protocol2CodeConverter.asTextEdits, e =>
                    i.handleFailedRequest(qi.DocumentFormattingRequest.type, e, null)
                  );
              },
              o = i.clientOptions.middleware;
            return o.provideDocumentFormattingEdits ? o.provideDocumentFormattingEdits(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerDocumentFormattingEditProvider(e.documentSelector, t), t];
      }
    }
    class M extends S {
      constructor(e) {
        super(e, qi.DocumentRangeFormattingRequest.type);
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'rangeFormatting').dynamicRegistration = !0;
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.documentRangeFormattingProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideDocumentRangeFormattingEdits: (e, t, n, i) => {
            const r = this._client,
              o = (e, t, n, i) => {
                const o = {
                  textDocument: r.code2ProtocolConverter.asTextDocumentIdentifier(e),
                  range: r.code2ProtocolConverter.asRange(t),
                  options: r.code2ProtocolConverter.asFormattingOptions(n, f.fromConfiguration(e))
                };
                return r
                  .sendRequest(qi.DocumentRangeFormattingRequest.type, o, i)
                  .then(r.protocol2CodeConverter.asTextEdits, e =>
                    r.handleFailedRequest(qi.DocumentRangeFormattingRequest.type, e, null)
                  );
              },
              s = r.clientOptions.middleware;
            return s.provideDocumentRangeFormattingEdits
              ? s.provideDocumentRangeFormattingEdits(e, t, n, i, o)
              : o(e, t, n, i);
          }
        };
        return [u.default.languages.registerDocumentRangeFormattingEditProvider(e.documentSelector, t), t];
      }
    }
    class L extends S {
      constructor(e) {
        super(e, qi.DocumentOnTypeFormattingRequest.type);
      }
      fillClientCapabilities(e) {
        p(p(e, 'textDocument'), 'onTypeFormatting').dynamicRegistration = !0;
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.documentOnTypeFormattingProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
            provideOnTypeFormattingEdits: (e, t, n, i, r) => {
              const o = this._client,
                s = (e, t, n, i, r) => {
                  let s = {
                    textDocument: o.code2ProtocolConverter.asTextDocumentIdentifier(e),
                    position: o.code2ProtocolConverter.asPosition(t),
                    ch: n,
                    options: o.code2ProtocolConverter.asFormattingOptions(i, f.fromConfiguration(e))
                  };
                  return o
                    .sendRequest(qi.DocumentOnTypeFormattingRequest.type, s, r)
                    .then(o.protocol2CodeConverter.asTextEdits, e =>
                      o.handleFailedRequest(qi.DocumentOnTypeFormattingRequest.type, e, null)
                    );
                },
                a = o.clientOptions.middleware;
              return a.provideOnTypeFormattingEdits
                ? a.provideOnTypeFormattingEdits(e, t, n, i, r, s)
                : s(e, t, n, i, r);
            }
          },
          n = e.moreTriggerCharacter || [];
        return [
          u.default.languages.registerOnTypeFormattingEditProvider(
            e.documentSelector,
            t,
            e.firstTriggerCharacter,
            ...n
          ),
          t
        ];
      }
    }
    class A extends S {
      constructor(e) {
        super(e, qi.RenameRequest.type);
      }
      fillClientCapabilities(e) {
        let t = p(p(e, 'textDocument'), 'rename');
        (t.dynamicRegistration = !0),
          (t.prepareSupport = !0),
          (t.prepareSupportDefaultBehavior = qi.PrepareSupportDefaultBehavior.Identifier),
          (t.honorsChangeAnnotations = !0);
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.renameProvider);
        n &&
          (kt.boolean(e.renameProvider) && (n.prepareProvider = !1),
          this.register({ id: er.generateUuid(), registerOptions: n }));
      }
      registerLanguageProvider(e) {
        const t = {
          provideRenameEdits: (e, t, n, i) => {
            const r = this._client,
              o = (e, t, n, i) => {
                let o = {
                  textDocument: r.code2ProtocolConverter.asTextDocumentIdentifier(e),
                  position: r.code2ProtocolConverter.asPosition(t),
                  newName: n
                };
                return r
                  .sendRequest(qi.RenameRequest.type, o, i)
                  .then(r.protocol2CodeConverter.asWorkspaceEdit, e =>
                    r.handleFailedRequest(qi.RenameRequest.type, e, null)
                  );
              },
              s = r.clientOptions.middleware;
            return s.provideRenameEdits ? s.provideRenameEdits(e, t, n, i, o) : o(e, t, n, i);
          },
          prepareRename: e.prepareProvider
            ? (e, t, n) => {
                const i = this._client,
                  r = (e, t, n) => {
                    let r = {
                      textDocument: i.code2ProtocolConverter.asTextDocumentIdentifier(e),
                      position: i.code2ProtocolConverter.asPosition(t)
                    };
                    return i.sendRequest(qi.PrepareRenameRequest.type, r, n).then(
                      e =>
                        qi.Range.is(e)
                          ? i.protocol2CodeConverter.asRange(e)
                          : this.isDefaultBehavior(e)
                          ? !0 === e.defaultBehavior
                            ? null
                            : Promise.reject(new Error("The element can't be renamed."))
                          : e && qi.Range.is(e.range)
                          ? { range: i.protocol2CodeConverter.asRange(e.range), placeholder: e.placeholder }
                          : Promise.reject(new Error("The element can't be renamed.")),
                      e => i.handleFailedRequest(qi.PrepareRenameRequest.type, e, void 0)
                    );
                  },
                  o = i.clientOptions.middleware;
                return o.prepareRename ? o.prepareRename(e, t, n, r) : r(e, t, n);
              }
            : void 0
        };
        return [u.default.languages.registerRenameProvider(e.documentSelector, t), t];
      }
      isDefaultBehavior(e) {
        const t = e;
        return t && kt.boolean(t.defaultBehavior);
      }
    }
    class j extends S {
      constructor(e) {
        super(e, qi.DocumentLinkRequest.type);
      }
      fillClientCapabilities(e) {
        const t = p(p(e, 'textDocument'), 'documentLink');
        (t.dynamicRegistration = !0), (t.tooltipSupport = !0);
      }
      initialize(e, t) {
        const n = this.getRegistrationOptions(t, e.documentLinkProvider);
        n && this.register({ id: er.generateUuid(), registerOptions: n });
      }
      registerLanguageProvider(e) {
        const t = {
          provideDocumentLinks: (e, t) => {
            const n = this._client,
              i = (e, t) =>
                n
                  .sendRequest(qi.DocumentLinkRequest.type, n.code2ProtocolConverter.asDocumentLinkParams(e), t)
                  .then(n.protocol2CodeConverter.asDocumentLinks, e =>
                    n.handleFailedRequest(qi.DocumentLinkRequest.type, e, null)
                  ),
              r = n.clientOptions.middleware;
            return r.provideDocumentLinks ? r.provideDocumentLinks(e, t, i) : i(e, t);
          },
          resolveDocumentLink: e.resolveProvider
            ? (e, t) => {
                const n = this._client;
                let i = (e, t) =>
                  n
                    .sendRequest(qi.DocumentLinkResolveRequest.type, n.code2ProtocolConverter.asDocumentLink(e), t)
                    .then(n.protocol2CodeConverter.asDocumentLink, t =>
                      n.handleFailedRequest(qi.DocumentLinkResolveRequest.type, t, e)
                    );
                const r = n.clientOptions.middleware;
                return r.resolveDocumentLink ? r.resolveDocumentLink(e, t, i) : i(e, t);
              }
            : void 0
        };
        return [u.default.languages.registerDocumentLinkProvider(e.documentSelector, t), t];
      }
    }
    class $ {
      constructor(e) {
        (this._client = e), (this._listeners = new Map());
      }
      get registrationType() {
        return qi.DidChangeConfigurationNotification.type;
      }
      fillClientCapabilities(e) {
        p(p(e, 'workspace'), 'didChangeConfiguration').dynamicRegistration = !0;
      }
      initialize() {
        let e = this._client.clientOptions.synchronize.configurationSection;
        void 0 !== e && this.register({ id: er.generateUuid(), registerOptions: { section: e } });
      }
      register(e) {
        let t = u.default.workspace.onDidChangeConfiguration(t => {
          this.onDidChangeConfiguration(e.registerOptions.section, t);
        });
        this._listeners.set(e.id, t),
          void 0 !== e.registerOptions.section && this.onDidChangeConfiguration(e.registerOptions.section, void 0);
      }
      unregister(e) {
        let t = this._listeners.get(e);
        t && (this._listeners.delete(e), t.dispose());
      }
      dispose() {
        for (let e of this._listeners.values()) e.dispose();
        this._listeners.clear();
      }
      onDidChangeConfiguration(e, t) {
        let n;
        if (((n = kt.string(e) ? [e] : e), void 0 !== n && void 0 !== t)) {
          if (!n.some(e => t.affectsConfiguration(e))) return;
        }
        let i = e => {
            void 0 !== e
              ? this._client.sendNotification(qi.DidChangeConfigurationNotification.type, {
                  settings: this.extractSettingsInformation(e)
                })
              : this._client.sendNotification(qi.DidChangeConfigurationNotification.type, { settings: null });
          },
          r = this.getMiddleware();
        r ? r(n, i) : i(n);
      }
      extractSettingsInformation(e) {
        function t(e, t) {
          let n = e;
          for (let e = 0; e < t.length - 1; e++) {
            let i = n[t[e]];
            i || ((i = Object.create(null)), (n[t[e]] = i)), (n = i);
          }
          return n;
        }
        let n = this._client.clientOptions.workspaceFolder ? this._client.clientOptions.workspaceFolder.uri : void 0,
          i = Object.create(null);
        for (let r = 0; r < e.length; r++) {
          let o = e[r],
            s = o.indexOf('.'),
            a = null;
          if (
            ((a =
              s >= 0
                ? u.default.workspace.getConfiguration(o.substr(0, s), n).get(o.substr(s + 1))
                : u.default.workspace.getConfiguration(void 0, n).get(o)),
            a)
          ) {
            let n = e[r].split('.');
            t(i, n)[n[n.length - 1]] = Ni.toJSONObject(a);
          }
        }
        return i;
      }
      getMiddleware() {
        let e = this._client.clientOptions.middleware;
        return e.workspace && e.workspace.didChangeConfiguration ? e.workspace.didChangeConfiguration : void 0;
      }
    }
    class W {
      constructor(e) {
        (this._client = e), (this._commands = new Map());
      }
      get registrationType() {
        return qi.ExecuteCommandRequest.type;
      }
      fillClientCapabilities(e) {
        p(p(e, 'workspace'), 'executeCommand').dynamicRegistration = !0;
      }
      initialize(e) {
        e.executeCommandProvider &&
          this.register({ id: er.generateUuid(), registerOptions: Object.assign({}, e.executeCommandProvider) });
      }
      register(e) {
        const t = this._client,
          n = t.clientOptions.middleware,
          i = (e, n) => {
            let i = { command: e, arguments: n };
            return t
              .sendRequest(qi.ExecuteCommandRequest.type, i)
              .then(void 0, e => t.handleFailedRequest(qi.ExecuteCommandRequest.type, e, void 0));
          };
        if (e.registerOptions.commands) {
          const t = [];
          for (const r of e.registerOptions.commands)
            t.push(
              u.default.commands.registerCommand(r, (...e) => (n.executeCommand ? n.executeCommand(r, e, i) : i(r, e)))
            );
          this._commands.set(e.id, t);
        }
      }
      unregister(e) {
        let t = this._commands.get(e);
        t && t.forEach(e => e.dispose());
      }
      dispose() {
        this._commands.forEach(e => {
          e.forEach(e => e.dispose());
        }),
          this._commands.clear();
      }
    }
    (t.MessageTransports || (t.MessageTransports = {})).is = function (e) {
      return e && qi.MessageReader.is(e.reader) && qi.MessageWriter.is(e.writer);
    };
    class K {
      constructor(e, t) {
        (this._resolve = e), (this._reject = t), (this._used = !1);
      }
      get isUsed() {
        return this._used;
      }
      resolve() {
        (this._used = !0), this._resolve();
      }
      reject(e) {
        (this._used = !0), this._reject(e);
      }
    }
    class H {
      constructor(e, t, n) {
        var i;
        (this._traceFormat = qi.TraceFormat.Text),
          (this._features = []),
          (this._dynamicFeatures = new Map()),
          (this._id = e),
          (this._name = t);
        const r = { isTrusted: !1 };
        void 0 !== (n = n || {}).markdown && !0 === n.markdown.isTrusted && (r.isTrusted = !0),
          (this._clientOptions = {
            documentSelector: n.documentSelector || [],
            synchronize: n.synchronize || {},
            diagnosticCollectionName: n.diagnosticCollectionName,
            outputChannelName: n.outputChannelName || this._name,
            revealOutputChannelOn: n.revealOutputChannelOn || o.Error,
            stdioEncoding: n.stdioEncoding || 'utf8',
            initializationOptions: n.initializationOptions,
            initializationFailedHandler: n.initializationFailedHandler,
            progressOnInitialization: !!n.progressOnInitialization,
            errorHandler:
              n.errorHandler ||
              this.createDefaultErrorHandler(
                null === (i = n.connectionOptions) || void 0 === i ? void 0 : i.maxRestartCount
              ),
            middleware: n.middleware || {},
            uriConverters: n.uriConverters,
            workspaceFolder: n.workspaceFolder,
            connectionOptions: n.connectionOptions,
            markdown: r
          }),
          (this._clientOptions.synchronize = this._clientOptions.synchronize || {}),
          (this._state = a.Initial),
          (this._connectionPromise = void 0),
          (this._resolvedConnection = void 0),
          (this._initializeResult = void 0),
          n.outputChannel
            ? ((this._outputChannel = n.outputChannel), (this._disposeOutputChannel = !1))
            : ((this._outputChannel = void 0), (this._disposeOutputChannel = !0)),
          (this._traceOutputChannel = n.traceOutputChannel),
          (this._listeners = void 0),
          (this._providers = void 0),
          (this._diagnostics = void 0),
          (this._fileEvents = []),
          (this._fileEventDelayer = new Qi.Delayer(250)),
          (this._onReady = new Promise((e, t) => {
            this._onReadyCallbacks = new K(e, t);
          })),
          (this._onStop = void 0),
          (this._telemetryEmitter = new qi.Emitter()),
          (this._stateChangeEmitter = new qi.Emitter()),
          (this._trace = qi.Trace.Off),
          (this._tracer = {
            log: (e, t) => {
              kt.string(e) ? this.logTrace(e, t) : this.logObjectTrace(e);
            }
          }),
          (this._c2p = Yi.createConverter(n.uriConverters ? n.uriConverters.code2Protocol : void 0)),
          (this._p2c = Zi.createConverter(
            n.uriConverters ? n.uriConverters.protocol2Code : void 0,
            this._clientOptions.markdown.isTrusted
          )),
          (this._syncedDocuments = new Map()),
          this.registerBuiltinFeatures();
      }
      get state() {
        return this._state;
      }
      set state(e) {
        let t = this.getPublicState();
        this._state = e;
        let n = this.getPublicState();
        n !== t && this._stateChangeEmitter.fire({ oldState: t, newState: n });
      }
      getPublicState() {
        return this.state === a.Running ? s.Running : this.state === a.Starting ? s.Starting : s.Stopped;
      }
      get initializeResult() {
        return this._initializeResult;
      }
      sendRequest(e, ...t) {
        if (!this.isConnectionActive()) throw new Error('Language client is not ready yet');
        this.forceDocumentSync();
        try {
          return this._resolvedConnection.sendRequest(e, ...t);
        } catch (t) {
          throw (this.error(`Sending request ${kt.string(e) ? e : e.method} failed.`, t), t);
        }
      }
      onRequest(e, t) {
        if (!this.isConnectionActive()) throw new Error('Language client is not ready yet');
        try {
          return this._resolvedConnection.onRequest(e, t);
        } catch (t) {
          throw (this.error(`Registering request handler ${kt.string(e) ? e : e.method} failed.`, t), t);
        }
      }
      sendNotification(e, t) {
        if (!this.isConnectionActive()) throw new Error('Language client is not ready yet');
        this.forceDocumentSync();
        try {
          this._resolvedConnection.sendNotification(e, t);
        } catch (t) {
          throw (this.error(`Sending notification ${kt.string(e) ? e : e.method} failed.`, t), t);
        }
      }
      onNotification(e, t) {
        if (!this.isConnectionActive()) throw new Error('Language client is not ready yet');
        try {
          return this._resolvedConnection.onNotification(e, t);
        } catch (t) {
          throw (this.error(`Registering notification handler ${kt.string(e) ? e : e.method} failed.`, t), t);
        }
      }
      onProgress(e, t, n) {
        if (!this.isConnectionActive()) throw new Error('Language client is not ready yet');
        try {
          if (qi.WorkDoneProgress.is(e)) {
            const i = this._clientOptions.middleware.handleWorkDoneProgress;
            if (void 0 !== i)
              return this._resolvedConnection.onProgress(e, t, e => {
                i(t, e, () => n(e));
              });
          }
          return this._resolvedConnection.onProgress(e, t, n);
        } catch (e) {
          throw (this.error(`Registering progress handler for token ${t} failed.`, e), e);
        }
      }
      sendProgress(e, t, n) {
        if (!this.isConnectionActive()) throw new Error('Language client is not ready yet');
        this.forceDocumentSync();
        try {
          this._resolvedConnection.sendProgress(e, t, n);
        } catch (e) {
          throw (this.error(`Sending progress for token ${t} failed.`, e), e);
        }
      }
      get clientOptions() {
        return this._clientOptions;
      }
      get protocol2CodeConverter() {
        return this._p2c;
      }
      get code2ProtocolConverter() {
        return this._c2p;
      }
      get onTelemetry() {
        return this._telemetryEmitter.event;
      }
      get onDidChangeState() {
        return this._stateChangeEmitter.event;
      }
      get outputChannel() {
        return (
          this._outputChannel ||
            (this._outputChannel = u.default.window.createOutputChannel(
              this._clientOptions.outputChannelName ? this._clientOptions.outputChannelName : this._name
            )),
          this._outputChannel
        );
      }
      get traceOutputChannel() {
        return this._traceOutputChannel ? this._traceOutputChannel : this.outputChannel;
      }
      get diagnostics() {
        return this._diagnostics;
      }
      createDefaultErrorHandler(e) {
        if (void 0 !== e && e < 0) throw new Error('Invalid maxRestartCount: ' + e);
        return new c(this._name, null != e ? e : 4);
      }
      set trace(e) {
        (this._trace = e),
          this.onReady().then(
            () => {
              this.resolveConnection().then(e => {
                e.trace(this._trace, this._tracer, { sendNotification: !1, traceFormat: this._traceFormat });
              });
            },
            () => {}
          );
      }
      data2String(e) {
        if (e instanceof qi.ResponseError) {
          const t = e;
          return `  Message: ${t.message}\n  Code: ${t.code} ${t.data ? '\n' + t.data.toString() : ''}`;
        }
        return e instanceof Error ? (kt.string(e.stack) ? e.stack : e.message) : kt.string(e) ? e : e.toString();
      }
      info(e, t, n = !0) {
        this.outputChannel.appendLine(`[Info  - ${new Date().toLocaleTimeString()}] ${e}`),
          t && this.outputChannel.appendLine(this.data2String(t)),
          n && this._clientOptions.revealOutputChannelOn <= o.Info && this.showNotificationMessage();
      }
      warn(e, t, n = !0) {
        this.outputChannel.appendLine(`[Warn  - ${new Date().toLocaleTimeString()}] ${e}`),
          t && this.outputChannel.appendLine(this.data2String(t)),
          n && this._clientOptions.revealOutputChannelOn <= o.Warn && this.showNotificationMessage();
      }
      error(e, t, n = !0) {
        this.outputChannel.appendLine(`[Error - ${new Date().toLocaleTimeString()}] ${e}`),
          t && this.outputChannel.appendLine(this.data2String(t)),
          n && this._clientOptions.revealOutputChannelOn <= o.Error && this.showNotificationMessage();
      }
      showNotificationMessage() {
        u.default.window
          .showInformationMessage('A request has failed. See the output for more information.', 'Go to output')
          .then(() => {
            this.outputChannel.show(!0);
          });
      }
      logTrace(e, t) {
        this.traceOutputChannel.appendLine(`[Trace - ${new Date().toLocaleTimeString()}] ${e}`),
          t && this.traceOutputChannel.appendLine(this.data2String(t));
      }
      logObjectTrace(e) {
        e.isLSPMessage && e.type
          ? this.traceOutputChannel.append(`[LSP   - ${new Date().toLocaleTimeString()}] `)
          : this.traceOutputChannel.append(`[Trace - ${new Date().toLocaleTimeString()}] `),
          e && this.traceOutputChannel.appendLine('' + JSON.stringify(e));
      }
      needsStart() {
        return this.state === a.Initial || this.state === a.Stopping || this.state === a.Stopped;
      }
      needsStop() {
        return this.state === a.Starting || this.state === a.Running;
      }
      onReady() {
        return this._onReady;
      }
      isConnectionActive() {
        return this.state === a.Running && !!this._resolvedConnection;
      }
      start() {
        return (
          this._onReadyCallbacks.isUsed &&
            (this._onReady = new Promise((e, t) => {
              this._onReadyCallbacks = new K(e, t);
            })),
          (this._listeners = []),
          (this._providers = []),
          this._diagnostics ||
            (this._diagnostics = this._clientOptions.diagnosticCollectionName
              ? u.default.languages.createDiagnosticCollection(this._clientOptions.diagnosticCollectionName)
              : u.default.languages.createDiagnosticCollection()),
          (this.state = a.Starting),
          this.resolveConnection()
            .then(
              e => (
                e.onLogMessage(e => {
                  switch (e.type) {
                    case qi.MessageType.Error:
                      this.error(e.message, void 0, !1);
                      break;
                    case qi.MessageType.Warning:
                      this.warn(e.message, void 0, !1);
                      break;
                    case qi.MessageType.Info:
                      this.info(e.message, void 0, !1);
                      break;
                    default:
                      this.outputChannel.appendLine(e.message);
                  }
                }),
                e.onShowMessage(e => {
                  switch (e.type) {
                    case qi.MessageType.Error:
                      u.default.window.showErrorMessage(e.message);
                      break;
                    case qi.MessageType.Warning:
                      u.default.window.showWarningMessage(e.message);
                      break;
                    case qi.MessageType.Info:
                      u.default.window.showInformationMessage(e.message);
                      break;
                    default:
                      u.default.window.showInformationMessage(e.message);
                  }
                }),
                e.onRequest(qi.ShowMessageRequest.type, e => {
                  let t;
                  switch (e.type) {
                    case qi.MessageType.Error:
                      t = u.default.window.showErrorMessage;
                      break;
                    case qi.MessageType.Warning:
                      t = u.default.window.showWarningMessage;
                      break;
                    case qi.MessageType.Info:
                      t = u.default.window.showInformationMessage;
                      break;
                    default:
                      t = u.default.window.showInformationMessage;
                  }
                  let n = e.actions || [];
                  return t(e.message, ...n);
                }),
                e.onTelemetry(e => {
                  this._telemetryEmitter.fire(e);
                }),
                e.onRequest(qi.ShowDocumentRequest.type, async e => {
                  var t;
                  const n = async e => {
                      const t = this.protocol2CodeConverter.asUri(e.uri);
                      try {
                        if (!0 === e.external) {
                          return { success: await u.default.env.openExternal(t) };
                        }
                        {
                          const n = {};
                          return (
                            void 0 !== e.selection && (n.selection = this.protocol2CodeConverter.asRange(e.selection)),
                            void 0 === e.takeFocus || !1 === e.takeFocus
                              ? (n.preserveFocus = !0)
                              : !0 === e.takeFocus && (n.preserveFocus = !1),
                            await u.default.window.showTextDocument(t, n),
                            { success: !0 }
                          );
                        }
                      } catch (e) {
                        return { success: !0 };
                      }
                    },
                    i = null === (t = this._clientOptions.middleware.window) || void 0 === t ? void 0 : t.showDocument;
                  return void 0 !== i ? i(e, n) : n(e);
                }),
                e.listen(),
                this.initialize(e)
              )
            )
            .then(void 0, e => {
              (this.state = a.StartFailed),
                this._onReadyCallbacks.reject(e),
                this.error('Starting client failed', e),
                u.default.window.showErrorMessage("Couldn't start client " + this._name);
            }),
          new u.default.Disposable(() => {
            this.needsStop() && this.stop();
          })
        );
      }
      resolveConnection() {
        return this._connectionPromise || (this._connectionPromise = this.createConnection()), this._connectionPromise;
      }
      initialize(e) {
        this.refreshTrace(e, !1);
        let t = this._clientOptions.initializationOptions,
          n = this._clientOptions.workspaceFolder
            ? this._clientOptions.workspaceFolder.uri.fsPath
            : this._clientGetRootPath(),
          i = {
            processId: null,
            clientInfo: { name: u.default.env.appName, version: u.default.version },
            locale: this.getLocale(),
            rootPath: n || null,
            rootUri: n ? this._c2p.asUri(u.default.Uri.file(n)) : null,
            capabilities: this.computeClientCapabilities(),
            initializationOptions: kt.func(t) ? t() : t,
            trace: qi.Trace.toString(this._trace),
            workspaceFolders: null
          };
        if ((this.fillInitializeParams(i), this._clientOptions.progressOnInitialization)) {
          const t = er.generateUuid(),
            n = new tr.ProgressPart(e, t);
          return (
            (i.workDoneToken = t),
            this.doInitialize(e, i).then(
              e => (n.done(), e),
              e => {
                throw (n.cancel(), e);
              }
            )
          );
        }
        return this.doInitialize(e, i);
      }
      doInitialize(e, t) {
        return e
          .initialize(t)
          .then(t => {
            (this._resolvedConnection = e), (this._initializeResult = t), (this.state = a.Running);
            let n = void 0;
            return (
              kt.number(t.capabilities.textDocumentSync)
                ? (n =
                    t.capabilities.textDocumentSync === qi.TextDocumentSyncKind.None
                      ? { openClose: !1, change: qi.TextDocumentSyncKind.None, save: void 0 }
                      : { openClose: !0, change: t.capabilities.textDocumentSync, save: { includeText: !1 } })
                : void 0 !== t.capabilities.textDocumentSync &&
                  null !== t.capabilities.textDocumentSync &&
                  (n = t.capabilities.textDocumentSync),
              (this._capabilities = Object.assign({}, t.capabilities, { resolvedTextDocumentSync: n })),
              e.onDiagnostics(e => this.handleDiagnostics(e)),
              e.onRequest(qi.RegistrationRequest.type, e => this.handleRegistrationRequest(e)),
              e.onRequest('client/registerFeature', e => this.handleRegistrationRequest(e)),
              e.onRequest(qi.UnregistrationRequest.type, e => this.handleUnregistrationRequest(e)),
              e.onRequest('client/unregisterFeature', e => this.handleUnregistrationRequest(e)),
              e.onRequest(qi.ApplyWorkspaceEditRequest.type, e => this.handleApplyWorkspaceEdit(e)),
              e.sendNotification(qi.InitializedNotification.type, {}),
              this.hookFileEvents(e),
              this.hookConfigurationChanged(e),
              this.initializeFeatures(e),
              this._onReadyCallbacks.resolve(),
              t
            );
          })
          .then(void 0, t => {
            throw (
              (this._clientOptions.initializationFailedHandler
                ? this._clientOptions.initializationFailedHandler(t)
                  ? this.initialize(e)
                  : (this.stop(), this._onReadyCallbacks.reject(t))
                : t instanceof qi.ResponseError && t.data && t.data.retry
                ? u.default.window.showErrorMessage(t.message, { title: 'Retry', id: 'retry' }).then(n => {
                    n && 'retry' === n.id ? this.initialize(e) : (this.stop(), this._onReadyCallbacks.reject(t));
                  })
                : (t && t.message && u.default.window.showErrorMessage(t.message),
                  this.error('Server initialization failed.', t),
                  this.stop(),
                  this._onReadyCallbacks.reject(t)),
              t)
            );
          });
      }
      _clientGetRootPath() {
        let e = u.default.workspace.workspaceFolders;
        if (!e || 0 === e.length) return;
        let t = e[0];
        return 'file' === t.uri.scheme ? t.uri.fsPath : void 0;
      }
      stop() {
        return (
          (this._initializeResult = void 0),
          this._connectionPromise
            ? this.state === a.Stopping && this._onStop
              ? this._onStop
              : ((this.state = a.Stopping),
                this.cleanUp(!1),
                (this._onStop = this.resolveConnection().then(e =>
                  e.shutdown().then(() => {
                    e.exit(),
                      e.end(),
                      e.dispose(),
                      (this.state = a.Stopped),
                      this.cleanUpChannel(),
                      (this._onStop = void 0),
                      (this._connectionPromise = void 0),
                      (this._resolvedConnection = void 0);
                  })
                )))
            : ((this.state = a.Stopped), Promise.resolve())
        );
      }
      cleanUp(e = !0, t = !0) {
        this._listeners && (this._listeners.forEach(e => e.dispose()), (this._listeners = void 0)),
          this._providers && (this._providers.forEach(e => e.dispose()), (this._providers = void 0)),
          this._syncedDocuments && this._syncedDocuments.clear();
        for (const e of this._features.values()) e.dispose();
        e && this.cleanUpChannel(),
          t && this._diagnostics && (this._diagnostics.dispose(), (this._diagnostics = void 0));
      }
      cleanUpChannel() {
        this._outputChannel &&
          this._disposeOutputChannel &&
          (this._outputChannel.dispose(), (this._outputChannel = void 0));
      }
      notifyFileEvent(e) {
        var t;
        const n = this;
        function i(e) {
          n._fileEvents.push(e),
            n._fileEventDelayer.trigger(() => {
              n.onReady().then(
                () => {
                  n.resolveConnection().then(e => {
                    n.isConnectionActive() &&
                      (n.forceDocumentSync(), e.didChangeWatchedFiles({ changes: n._fileEvents })),
                      (n._fileEvents = []);
                  });
                },
                e => {
                  n.error('Notify file events failed.', e);
                }
              );
            });
        }
        const r = null === (t = this.clientOptions.middleware) || void 0 === t ? void 0 : t.workspace;
        (null == r ? void 0 : r.didChangeWatchedFile) ? r.didChangeWatchedFile(e, i) : i(e);
      }
      forceDocumentSync() {
        void 0 === this._didChangeTextDocumentFeature &&
          (this._didChangeTextDocumentFeature = this._dynamicFeatures.get(
            qi.DidChangeTextDocumentNotification.type.method
          )),
          this._didChangeTextDocumentFeature.forceDelivery();
      }
      handleDiagnostics(e) {
        if (!this._diagnostics) return;
        let t = this._p2c.asUri(e.uri),
          n = this._p2c.asDiagnostics(e.diagnostics),
          i = this.clientOptions.middleware;
        i.handleDiagnostics
          ? i.handleDiagnostics(t, n, (e, t) => this.setDiagnostics(e, t))
          : this.setDiagnostics(t, n);
      }
      setDiagnostics(e, t) {
        this._diagnostics && this._diagnostics.set(e, t);
      }
      createConnection() {
        let e = (e, t, n) => {
            this.handleConnectionError(e, t, n);
          },
          t = () => {
            this.handleConnectionClosed();
          };
        return this.createMessageTransports(this._clientOptions.stdioEncoding || 'utf8').then(i =>
          (function (e, t, i, r, o) {
            let s = new n(),
              a = qi.createProtocolConnection(e, t, s, o);
            return (
              a.onError(e => {
                i(e[0], e[1], e[2]);
              }),
              a.onClose(r),
              {
                listen: () => a.listen(),
                sendRequest: (e, ...t) => a.sendRequest(kt.string(e) ? e : e.method, ...t),
                onRequest: (e, t) => a.onRequest(kt.string(e) ? e : e.method, t),
                sendNotification: (e, t) => a.sendNotification(kt.string(e) ? e : e.method, t),
                onNotification: (e, t) => a.onNotification(kt.string(e) ? e : e.method, t),
                onProgress: a.onProgress,
                sendProgress: a.sendProgress,
                trace: (e, t, n) => {
                  const i = { sendNotification: !1, traceFormat: qi.TraceFormat.Text };
                  void 0 === n ? a.trace(e, t, i) : (kt.boolean(n), a.trace(e, t, n));
                },
                initialize: e => a.sendRequest(qi.InitializeRequest.type, e),
                shutdown: () => a.sendRequest(qi.ShutdownRequest.type, void 0),
                exit: () => a.sendNotification(qi.ExitNotification.type),
                onLogMessage: e => a.onNotification(qi.LogMessageNotification.type, e),
                onShowMessage: e => a.onNotification(qi.ShowMessageNotification.type, e),
                onTelemetry: e => a.onNotification(qi.TelemetryEventNotification.type, e),
                didChangeConfiguration: e => a.sendNotification(qi.DidChangeConfigurationNotification.type, e),
                didChangeWatchedFiles: e => a.sendNotification(qi.DidChangeWatchedFilesNotification.type, e),
                didOpenTextDocument: e => a.sendNotification(qi.DidOpenTextDocumentNotification.type, e),
                didChangeTextDocument: e => a.sendNotification(qi.DidChangeTextDocumentNotification.type, e),
                didCloseTextDocument: e => a.sendNotification(qi.DidCloseTextDocumentNotification.type, e),
                didSaveTextDocument: e => a.sendNotification(qi.DidSaveTextDocumentNotification.type, e),
                onDiagnostics: e => a.onNotification(qi.PublishDiagnosticsNotification.type, e),
                end: () => a.end(),
                dispose: () => a.dispose()
              }
            );
          })(i.reader, i.writer, e, t, this._clientOptions.connectionOptions)
        );
      }
      handleConnectionClosed() {
        if (this.state === a.Stopping || this.state === a.Stopped) return;
        try {
          this._resolvedConnection && this._resolvedConnection.dispose();
        } catch (e) {}
        let e = r.DoNotRestart;
        try {
          e = this._clientOptions.errorHandler.closed();
        } catch (e) {}
        (this._connectionPromise = void 0),
          (this._resolvedConnection = void 0),
          e === r.DoNotRestart
            ? (this.error('Connection to server got closed. Server will not be restarted.'),
              this.state === a.Starting
                ? (this._onReadyCallbacks.reject(
                    new Error('Connection to server got closed. Server will not be restarted.')
                  ),
                  (this.state = a.StartFailed))
                : (this.state = a.Stopped),
              this.cleanUp(!1, !0))
            : e === r.Restart &&
              (this.info('Connection to server got closed. Server will restart.'),
              this.cleanUp(!1, !1),
              (this.state = a.Initial),
              this.start());
      }
      handleConnectionError(e, t, n) {
        this._clientOptions.errorHandler.error(e, t, n) === i.Shutdown &&
          (this.error('Connection to server is erroring. Shutting down server.'), this.stop());
      }
      hookConfigurationChanged(e) {
        u.default.workspace.onDidChangeConfiguration(() => {
          this.refreshTrace(e, !0);
        });
      }
      refreshTrace(e, t = !1) {
        let n = u.default.workspace.getConfiguration(this._id),
          i = qi.Trace.Off,
          r = qi.TraceFormat.Text;
        if (n) {
          const e = n.get('trace.server', 'off');
          'string' == typeof e
            ? (i = qi.Trace.fromString(e))
            : ((i = qi.Trace.fromString(n.get('trace.server.verbosity', 'off'))),
              (r = qi.TraceFormat.fromString(n.get('trace.server.format', 'text'))));
        }
        (this._trace = i),
          (this._traceFormat = r),
          e.trace(this._trace, this._tracer, { sendNotification: t, traceFormat: this._traceFormat });
      }
      hookFileEvents(e) {
        let t,
          n = this._clientOptions.synchronize.fileEvents;
        n &&
          ((t = kt.array(n) ? n : [n]),
          t &&
            this._dynamicFeatures
              .get(qi.DidChangeWatchedFilesNotification.type.method)
              .registerRaw(er.generateUuid(), t));
      }
      registerFeatures(e) {
        for (let t of e) this.registerFeature(t);
      }
      registerFeature(e) {
        if ((this._features.push(e), g.is(e))) {
          const t = e.registrationType;
          this._dynamicFeatures.set(t.method, e);
        }
      }
      getFeature(e) {
        return this._dynamicFeatures.get(e);
      }
      registerBuiltinFeatures() {
        this.registerFeature(new $(this)),
          this.registerFeature(new v(this, this._syncedDocuments)),
          this.registerFeature(new C(this)),
          this.registerFeature(new R(this)),
          this.registerFeature(new w(this)),
          this.registerFeature(new T(this)),
          this.registerFeature(new y(this, this._syncedDocuments)),
          this.registerFeature(new b(this, e => this.notifyFileEvent(e))),
          this.registerFeature(new _(this)),
          this.registerFeature(new D(this)),
          this.registerFeature(new P(this)),
          this.registerFeature(new E(this)),
          this.registerFeature(new x(this)),
          this.registerFeature(new k(this)),
          this.registerFeature(new O(this)),
          this.registerFeature(new F(this)),
          this.registerFeature(new q(this)),
          this.registerFeature(new N(this)),
          this.registerFeature(new I(this)),
          this.registerFeature(new M(this)),
          this.registerFeature(new L(this)),
          this.registerFeature(new A(this)),
          this.registerFeature(new j(this)),
          this.registerFeature(new W(this));
      }
      fillInitializeParams(e) {
        for (let t of this._features) kt.func(t.fillInitializeParams) && t.fillInitializeParams(e);
      }
      computeClientCapabilities() {
        const e = {};
        p(e, 'workspace').applyEdit = !0;
        const t = p(p(e, 'workspace'), 'workspaceEdit');
        (t.documentChanges = !0),
          (t.resourceOperations = [
            qi.ResourceOperationKind.Create,
            qi.ResourceOperationKind.Rename,
            qi.ResourceOperationKind.Delete
          ]),
          (t.failureHandling = qi.FailureHandlingKind.TextOnlyTransactional),
          (t.normalizesLineEndings = !0),
          (t.changeAnnotationSupport = { groupsOnLabel: !0 });
        const n = p(p(e, 'textDocument'), 'publishDiagnostics');
        (n.relatedInformation = !0),
          (n.versionSupport = !1),
          (n.tagSupport = { valueSet: [qi.DiagnosticTag.Unnecessary, qi.DiagnosticTag.Deprecated] }),
          (n.codeDescriptionSupport = !0),
          (n.dataSupport = !0);
        const i = p(e, 'window');
        p(i, 'showMessage').messageActionItem = { additionalPropertiesSupport: !0 };
        p(i, 'showDocument').support = !0;
        const r = p(e, 'general');
        (r.regularExpressions = { engine: 'ECMAScript', version: 'ES2020' }),
          (r.markdown = { parser: 'marked', version: '1.1.0' });
        for (let t of this._features) t.fillClientCapabilities(e);
        return e;
      }
      initializeFeatures(e) {
        let t = this._clientOptions.documentSelector;
        for (let e of this._features) e.initialize(this._capabilities, t);
      }
      handleRegistrationRequest(e) {
        return new Promise((t, n) => {
          for (const t of e.registrations) {
            const e = this._dynamicFeatures.get(t.method);
            if (void 0 === e)
              return void n(new Error(`No feature implementation for ${t.method} found. Registration failed.`));
            const i = t.registerOptions || {};
            i.documentSelector = i.documentSelector || this._clientOptions.documentSelector;
            const r = { id: t.id, registerOptions: i };
            try {
              e.register(r);
            } catch (e) {
              return void n(e);
            }
          }
          t();
        });
      }
      handleUnregistrationRequest(e) {
        return new Promise((t, n) => {
          for (let t of e.unregisterations) {
            const e = this._dynamicFeatures.get(t.method);
            if (!e) return void n(new Error(`No feature implementation for ${t.method} found. Unregistration failed.`));
            e.unregister(t.id);
          }
          t();
        });
      }
      handleApplyWorkspaceEdit(e) {
        let t = e.edit,
          n = new Map();
        u.default.workspace.textDocuments.forEach(e => n.set(e.uri.toString(), e));
        let i = !1;
        if (t.documentChanges)
          for (const e of t.documentChanges)
            if (qi.TextDocumentEdit.is(e) && e.textDocument.version && e.textDocument.version >= 0) {
              let t = n.get(e.textDocument.uri);
              if (t && t.version !== e.textDocument.version) {
                i = !0;
                break;
              }
            }
        return i
          ? Promise.resolve({ applied: !1 })
          : kt.asPromise(u.default.workspace.applyEdit(this._p2c.asWorkspaceEdit(e.edit)).then(e => ({ applied: e })));
      }
      handleFailedRequest(e, t, n) {
        if (t instanceof qi.ResponseError) {
          if (t.code === qi.LSPErrorCodes.RequestCancelled) throw this.makeCancelError();
          if (t.code === qi.LSPErrorCodes.ContentModified) return n;
        }
        throw (this.error(`Request ${e.method} failed.`, t), t);
      }
      makeCancelError() {
        const e = new Error(H.Canceled);
        return (e.name = H.Canceled), e;
      }
    }
    (t.BaseLanguageClient = H), (H.Canceled = 'Canceled');
  }),
  ir = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ColorProviderFeature = void 0);
    class i extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.DocumentColorRequest.type);
      }
      fillClientCapabilities(e) {
        n(n(e, 'textDocument'), 'colorProvider').dynamicRegistration = !0;
      }
      initialize(e, t) {
        let [n, i] = this.getRegistration(t, e.colorProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = {
          provideColorPresentations: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) => {
                const r = {
                  color: e,
                  textDocument: i.code2ProtocolConverter.asTextDocumentIdentifier(t.document),
                  range: i.code2ProtocolConverter.asRange(t.range)
                };
                return i
                  .sendRequest(qi.ColorPresentationRequest.type, r, n)
                  .then(this.asColorPresentations.bind(this), e =>
                    i.handleFailedRequest(qi.ColorPresentationRequest.type, e, null)
                  );
              },
              o = i.clientOptions.middleware;
            return o.provideColorPresentations ? o.provideColorPresentations(e, t, n, r) : r(e, t, n);
          },
          provideDocumentColors: (e, t) => {
            const n = this._client,
              i = (e, t) => {
                const i = { textDocument: n.code2ProtocolConverter.asTextDocumentIdentifier(e) };
                return n
                  .sendRequest(qi.DocumentColorRequest.type, i, t)
                  .then(this.asColorInformations.bind(this), e =>
                    n.handleFailedRequest(qi.ColorPresentationRequest.type, e, null)
                  );
              },
              r = n.clientOptions.middleware;
            return r.provideDocumentColors ? r.provideDocumentColors(e, t, i) : i(e, t);
          }
        };
        return [u.default.languages.registerColorProvider(e.documentSelector, t), t];
      }
      asColor(e) {
        return new u.default.Color(e.red, e.green, e.blue, e.alpha);
      }
      asColorInformations(e) {
        return Array.isArray(e)
          ? e.map(
              e =>
                new u.default.ColorInformation(
                  this._client.protocol2CodeConverter.asRange(e.range),
                  this.asColor(e.color)
                )
            )
          : [];
      }
      asColorPresentations(e) {
        return Array.isArray(e)
          ? e.map(e => {
              let t = new u.default.ColorPresentation(e.label);
              return (
                (t.additionalTextEdits = this._client.protocol2CodeConverter.asTextEdits(e.additionalTextEdits)),
                (t.textEdit = this._client.protocol2CodeConverter.asTextEdit(e.textEdit)),
                t
              );
            })
          : [];
      }
    }
    t.ColorProviderFeature = i;
  }),
  rr = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ImplementationFeature = void 0);
    class i extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.ImplementationRequest.type);
      }
      fillClientCapabilities(e) {
        let t = n(n(e, 'textDocument'), 'implementation');
        (t.dynamicRegistration = !0), (t.linkSupport = !0);
      }
      initialize(e, t) {
        let [n, i] = this.getRegistration(t, e.implementationProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = {
          provideImplementation: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) =>
                i
                  .sendRequest(
                    qi.ImplementationRequest.type,
                    i.code2ProtocolConverter.asTextDocumentPositionParams(e, t),
                    n
                  )
                  .then(i.protocol2CodeConverter.asDefinitionResult, e =>
                    i.handleFailedRequest(qi.ImplementationRequest.type, e, null)
                  ),
              o = i.clientOptions.middleware;
            return o.provideImplementation ? o.provideImplementation(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerImplementationProvider(e.documentSelector, t), t];
      }
    }
    t.ImplementationFeature = i;
  }),
  or = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.TypeDefinitionFeature = void 0);
    class i extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.TypeDefinitionRequest.type);
      }
      fillClientCapabilities(e) {
        n(n(e, 'textDocument'), 'typeDefinition').dynamicRegistration = !0;
        let t = n(n(e, 'textDocument'), 'typeDefinition');
        (t.dynamicRegistration = !0), (t.linkSupport = !0);
      }
      initialize(e, t) {
        let [n, i] = this.getRegistration(t, e.typeDefinitionProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = {
          provideTypeDefinition: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) =>
                i
                  .sendRequest(
                    qi.TypeDefinitionRequest.type,
                    i.code2ProtocolConverter.asTextDocumentPositionParams(e, t),
                    n
                  )
                  .then(i.protocol2CodeConverter.asDefinitionResult, e =>
                    i.handleFailedRequest(qi.TypeDefinitionRequest.type, e, null)
                  ),
              o = i.clientOptions.middleware;
            return o.provideTypeDefinition ? o.provideTypeDefinition(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerTypeDefinitionProvider(e.documentSelector, t), t];
      }
    }
    t.TypeDefinitionFeature = i;
  }),
  sr = _(function (e, t) {
    function n(e, t) {
      if (void 0 !== e) return e[t];
    }
    function i(e, t) {
      return e.filter(e => t.indexOf(e) < 0);
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WorkspaceFoldersFeature = t.arrayDiff = void 0),
      (t.arrayDiff = i);
    t.WorkspaceFoldersFeature = class {
      constructor(e) {
        (this._client = e), (this._listeners = new Map());
      }
      get registrationType() {
        return qi.DidChangeWorkspaceFoldersNotification.type;
      }
      fillInitializeParams(e) {
        const t = u.default.workspace.workspaceFolders;
        this.initializeWithFolders(t), (e.workspaceFolders = void 0 === t ? null : t.map(e => this.asProtocol(e)));
      }
      initializeWithFolders(e) {
        this._initialFolders = e;
      }
      fillClientCapabilities(e) {
        (e.workspace = e.workspace || {}), (e.workspace.workspaceFolders = !0);
      }
      initialize(e) {
        const t = this._client;
        t.onRequest(qi.WorkspaceFoldersRequest.type, e => {
          const n = () => {
              const e = u.default.workspace.workspaceFolders;
              if (void 0 === e) return null;
              return e.map(e => this.asProtocol(e));
            },
            i = t.clientOptions.middleware.workspace;
          return i && i.workspaceFolders ? i.workspaceFolders(e, n) : n();
        });
        const i = n(n(n(e, 'workspace'), 'workspaceFolders'), 'changeNotifications');
        let r;
        'string' == typeof i ? (r = i) : !0 === i && (r = er.generateUuid()),
          r && this.register({ id: r, registerOptions: void 0 });
      }
      sendInitialEvent(e) {
        if (this._initialFolders && e) {
          const t = i(this._initialFolders, e),
            n = i(e, this._initialFolders);
          (n.length > 0 || t.length > 0) && this.doSendEvent(n, t);
        } else this._initialFolders ? this.doSendEvent([], this._initialFolders) : e && this.doSendEvent(e, []);
      }
      doSendEvent(e, t) {
        let n = { event: { added: e.map(e => this.asProtocol(e)), removed: t.map(e => this.asProtocol(e)) } };
        this._client.sendNotification(qi.DidChangeWorkspaceFoldersNotification.type, n);
      }
      register(e) {
        let t = e.id,
          n = this._client,
          i = u.default.workspace.onDidChangeWorkspaceFolders(e => {
            let t = e => {
                this.doSendEvent(e.added, e.removed);
              },
              i = n.clientOptions.middleware.workspace;
            i && i.didChangeWorkspaceFolders ? i.didChangeWorkspaceFolders(e, t) : t(e);
          });
        this._listeners.set(t, i), this.sendInitialEvent(u.default.workspace.workspaceFolders);
      }
      unregister(e) {
        let t = this._listeners.get(e);
        void 0 !== t && (this._listeners.delete(e), t.dispose());
      }
      dispose() {
        for (let e of this._listeners.values()) e.dispose();
        this._listeners.clear();
      }
      asProtocol(e) {
        return void 0 === e ? null : { uri: this._client.code2ProtocolConverter.asUri(e.uri), name: e.name };
      }
    };
  }),
  ar = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.FoldingRangeFeature = void 0);
    class i extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.FoldingRangeRequest.type);
      }
      fillClientCapabilities(e) {
        let t = n(n(e, 'textDocument'), 'foldingRange');
        (t.dynamicRegistration = !0), (t.rangeLimit = 5e3), (t.lineFoldingOnly = !0);
      }
      initialize(e, t) {
        let [n, i] = this.getRegistration(t, e.foldingRangeProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = {
          provideFoldingRanges: (e, t, n) => {
            const r = this._client,
              o = (e, t, n) => {
                const o = { textDocument: r.code2ProtocolConverter.asTextDocumentIdentifier(e) };
                return r
                  .sendRequest(qi.FoldingRangeRequest.type, o, n)
                  .then(i.asFoldingRanges, e => r.handleFailedRequest(qi.FoldingRangeRequest.type, e, null));
              },
              s = r.clientOptions.middleware;
            return s.provideFoldingRanges ? s.provideFoldingRanges(e, t, n, o) : o(e, 0, n);
          }
        };
        return [u.default.languages.registerFoldingRangeProvider(e.documentSelector, t), t];
      }
      static asFoldingRangeKind(e) {
        if (e)
          switch (e) {
            case qi.FoldingRangeKind.Comment:
              return u.default.FoldingRangeKind.Comment;
            case qi.FoldingRangeKind.Imports:
              return u.default.FoldingRangeKind.Imports;
            case qi.FoldingRangeKind.Region:
              return u.default.FoldingRangeKind.Region;
          }
      }
      static asFoldingRanges(e) {
        return Array.isArray(e)
          ? e.map(e => new u.default.FoldingRange(e.startLine, e.endLine, i.asFoldingRangeKind(e.kind)))
          : [];
      }
    }
    t.FoldingRangeFeature = i;
  }),
  cr = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.DeclarationFeature = void 0);
    class i extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.DeclarationRequest.type);
      }
      fillClientCapabilities(e) {
        const t = n(n(e, 'textDocument'), 'declaration');
        (t.dynamicRegistration = !0), (t.linkSupport = !0);
      }
      initialize(e, t) {
        const [n, i] = this.getRegistration(t, e.declarationProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = {
          provideDeclaration: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) =>
                i
                  .sendRequest(
                    qi.DeclarationRequest.type,
                    i.code2ProtocolConverter.asTextDocumentPositionParams(e, t),
                    n
                  )
                  .then(i.protocol2CodeConverter.asDeclarationResult, e =>
                    i.handleFailedRequest(qi.DeclarationRequest.type, e, null)
                  ),
              o = i.clientOptions.middleware;
            return o.provideDeclaration ? o.provideDeclaration(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerDeclarationProvider(e.documentSelector, t), t];
      }
    }
    t.DeclarationFeature = i;
  }),
  lr = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = Object.create(null)), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.SelectionRangeFeature = void 0);
    class i extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.SelectionRangeRequest.type);
      }
      fillClientCapabilities(e) {
        n(n(e, 'textDocument'), 'selectionRange').dynamicRegistration = !0;
      }
      initialize(e, t) {
        let [n, i] = this.getRegistration(t, e.selectionRangeProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = {
          provideSelectionRanges: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) => {
                const r = {
                  textDocument: i.code2ProtocolConverter.asTextDocumentIdentifier(e),
                  positions: i.code2ProtocolConverter.asPositions(t)
                };
                return i.sendRequest(qi.SelectionRangeRequest.type, r, n).then(
                  e => i.protocol2CodeConverter.asSelectionRanges(e),
                  e => i.handleFailedRequest(qi.SelectionRangeRequest.type, e, null)
                );
              },
              o = i.clientOptions.middleware;
            return o.provideSelectionRanges ? o.provideSelectionRanges(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerSelectionRangeProvider(e.documentSelector, t), t];
      }
    }
    t.SelectionRangeFeature = i;
  }),
  ur = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ProgressFeature = void 0);
    t.ProgressFeature = class {
      constructor(e) {
        (this._client = e), (this.activeParts = new Set());
      }
      fillClientCapabilities(e) {
        var t, n;
        ((t = e), (n = 'window'), void 0 === t[n] && (t[n] = Object.create(null)), t[n]).workDoneProgress = !0;
      }
      initialize() {
        const e = this._client,
          t = e => {
            this.activeParts.delete(e);
          };
        e.onRequest(qi.WorkDoneProgressCreateRequest.type, e => {
          this.activeParts.add(new tr.ProgressPart(this._client, e.token, t));
        });
      }
      dispose() {
        for (const e of this.activeParts) e.done();
        this.activeParts.clear();
      }
    };
  }),
  dr = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.CallHierarchyFeature = void 0);
    class i {
      constructor(e) {
        (this.client = e), (this.middleware = e.clientOptions.middleware);
      }
      prepareCallHierarchy(e, t, n) {
        const i = this.client,
          r = this.middleware,
          o = (e, t, n) => {
            const r = i.code2ProtocolConverter.asTextDocumentPositionParams(e, t);
            return i.sendRequest(qi.CallHierarchyPrepareRequest.type, r, n).then(
              e => i.protocol2CodeConverter.asCallHierarchyItems(e),
              e => i.handleFailedRequest(qi.CallHierarchyPrepareRequest.type, e, null)
            );
          };
        return r.prepareCallHierarchy ? r.prepareCallHierarchy(e, t, n, o) : o(e, t, n);
      }
      provideCallHierarchyIncomingCalls(e, t) {
        const n = this.client,
          i = this.middleware,
          r = (e, t) => {
            const i = { item: n.code2ProtocolConverter.asCallHierarchyItem(e) };
            return n.sendRequest(qi.CallHierarchyIncomingCallsRequest.type, i, t).then(
              e => n.protocol2CodeConverter.asCallHierarchyIncomingCalls(e),
              e => n.handleFailedRequest(qi.CallHierarchyIncomingCallsRequest.type, e, null)
            );
          };
        return i.provideCallHierarchyIncomingCalls ? i.provideCallHierarchyIncomingCalls(e, t, r) : r(e, t);
      }
      provideCallHierarchyOutgoingCalls(e, t) {
        const n = this.client,
          i = this.middleware,
          r = (e, t) => {
            const i = { item: n.code2ProtocolConverter.asCallHierarchyItem(e) };
            return n.sendRequest(qi.CallHierarchyOutgoingCallsRequest.type, i, t).then(
              e => n.protocol2CodeConverter.asCallHierarchyOutgoingCalls(e),
              e => n.handleFailedRequest(qi.CallHierarchyOutgoingCallsRequest.type, e, null)
            );
          };
        return i.provideCallHierarchyOutgoingCalls ? i.provideCallHierarchyOutgoingCalls(e, t, r) : r(e, t);
      }
    }
    class r extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.CallHierarchyPrepareRequest.type);
      }
      fillClientCapabilities(e) {
        n(n(e, 'textDocument'), 'callHierarchy').dynamicRegistration = !0;
      }
      initialize(e, t) {
        const [n, i] = this.getRegistration(t, e.callHierarchyProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = this._client,
          n = new i(t);
        return [u.default.languages.registerCallHierarchyProvider(e.documentSelector, n), n];
      }
    }
    t.CallHierarchyFeature = r;
  }),
  hr = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.SemanticTokensFeature = void 0);
    class i extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.SemanticTokensRegistrationType.type);
      }
      fillClientCapabilities(e) {
        const t = n(n(e, 'textDocument'), 'semanticTokens');
        (t.dynamicRegistration = !0),
          (t.tokenTypes = [
            qi.SemanticTokenTypes.namespace,
            qi.SemanticTokenTypes.type,
            qi.SemanticTokenTypes.class,
            qi.SemanticTokenTypes.enum,
            qi.SemanticTokenTypes.interface,
            qi.SemanticTokenTypes.struct,
            qi.SemanticTokenTypes.typeParameter,
            qi.SemanticTokenTypes.parameter,
            qi.SemanticTokenTypes.variable,
            qi.SemanticTokenTypes.property,
            qi.SemanticTokenTypes.enumMember,
            qi.SemanticTokenTypes.event,
            qi.SemanticTokenTypes.function,
            qi.SemanticTokenTypes.method,
            qi.SemanticTokenTypes.macro,
            qi.SemanticTokenTypes.keyword,
            qi.SemanticTokenTypes.modifier,
            qi.SemanticTokenTypes.comment,
            qi.SemanticTokenTypes.string,
            qi.SemanticTokenTypes.number,
            qi.SemanticTokenTypes.regexp,
            qi.SemanticTokenTypes.operator
          ]),
          (t.tokenModifiers = [
            qi.SemanticTokenModifiers.declaration,
            qi.SemanticTokenModifiers.definition,
            qi.SemanticTokenModifiers.readonly,
            qi.SemanticTokenModifiers.static,
            qi.SemanticTokenModifiers.deprecated,
            qi.SemanticTokenModifiers.abstract,
            qi.SemanticTokenModifiers.async,
            qi.SemanticTokenModifiers.modification,
            qi.SemanticTokenModifiers.documentation,
            qi.SemanticTokenModifiers.defaultLibrary
          ]),
          (t.formats = [qi.TokenFormat.Relative]),
          (t.requests = { range: !0, full: { delta: !0 } }),
          (t.multilineTokenSupport = !1),
          (t.overlappingTokenSupport = !1),
          (n(n(e, 'workspace'), 'semanticTokens').refreshSupport = !0);
      }
      initialize(e, t) {
        this._client.onRequest(qi.SemanticTokensRefreshRequest.type, async () => {
          for (const e of this.getAllProviders()) e.onDidChangeSemanticTokensEmitter.fire();
        });
        const [n, i] = this.getRegistration(t, e.semanticTokensProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = kt.boolean(e.full) ? e.full : void 0 !== e.full,
          n = void 0 !== e.full && 'boolean' != typeof e.full && !0 === e.full.delta,
          i = new u.default.EventEmitter(),
          r = t
            ? {
                onDidChangeSemanticTokens: i.event,
                provideDocumentSemanticTokens: (e, t) => {
                  const n = this._client,
                    i = n.clientOptions.middleware,
                    r = (e, t) => {
                      const i = { textDocument: n.code2ProtocolConverter.asTextDocumentIdentifier(e) };
                      return n.sendRequest(qi.SemanticTokensRequest.type, i, t).then(
                        e => n.protocol2CodeConverter.asSemanticTokens(e),
                        e => n.handleFailedRequest(qi.SemanticTokensRequest.type, e, null)
                      );
                    };
                  return i.provideDocumentSemanticTokens ? i.provideDocumentSemanticTokens(e, t, r) : r(e, t);
                },
                provideDocumentSemanticTokensEdits: n
                  ? (e, t, n) => {
                      const i = this._client,
                        r = i.clientOptions.middleware,
                        o = (e, t, n) => {
                          const r = {
                            textDocument: i.code2ProtocolConverter.asTextDocumentIdentifier(e),
                            previousResultId: t
                          };
                          return i.sendRequest(qi.SemanticTokensDeltaRequest.type, r, n).then(
                            e =>
                              qi.SemanticTokens.is(e)
                                ? i.protocol2CodeConverter.asSemanticTokens(e)
                                : i.protocol2CodeConverter.asSemanticTokensEdits(e),
                            e => i.handleFailedRequest(qi.SemanticTokensDeltaRequest.type, e, null)
                          );
                        };
                      return r.provideDocumentSemanticTokensEdits
                        ? r.provideDocumentSemanticTokensEdits(e, t, n, o)
                        : o(e, t, n);
                    }
                  : void 0
              }
            : void 0,
          o =
            !0 === e.range
              ? {
                  provideDocumentRangeSemanticTokens: (e, t, n) => {
                    const i = this._client,
                      r = i.clientOptions.middleware,
                      o = (e, t, n) => {
                        const r = {
                          textDocument: i.code2ProtocolConverter.asTextDocumentIdentifier(e),
                          range: i.code2ProtocolConverter.asRange(t)
                        };
                        return i.sendRequest(qi.SemanticTokensRangeRequest.type, r, n).then(
                          e => i.protocol2CodeConverter.asSemanticTokens(e),
                          e => i.handleFailedRequest(qi.SemanticTokensRangeRequest.type, e, null)
                        );
                      };
                    return r.provideDocumentRangeSemanticTokens
                      ? r.provideDocumentRangeSemanticTokens(e, t, n, o)
                      : o(e, t, n);
                  }
                }
              : void 0,
          s = [],
          a = this._client.protocol2CodeConverter.asSemanticTokensLegend(e.legend);
        return (
          void 0 !== r && s.push(u.default.languages.registerDocumentSemanticTokensProvider(e.documentSelector, r, a)),
          void 0 !== o &&
            s.push(u.default.languages.registerDocumentRangeSemanticTokensProvider(e.documentSelector, o, a)),
          [
            new u.default.Disposable(() => s.forEach(e => e.dispose())),
            { range: o, full: r, onDidChangeSemanticTokensEmitter: i }
          ]
        );
      }
    }
    t.SemanticTokensFeature = i;
  }),
  pr =
    Array.isArray ||
    function (e) {
      return '[object Array]' === Object.prototype.toString.call(e);
    },
  fr = gr;
function gr(e, t, n) {
  e instanceof RegExp && (e = mr(e, n)), t instanceof RegExp && (t = mr(t, n));
  var i = vr(e, t, n);
  return (
    i && {
      start: i[0],
      end: i[1],
      pre: n.slice(0, i[0]),
      body: n.slice(i[0] + e.length, i[1]),
      post: n.slice(i[1] + t.length)
    }
  );
}
function mr(e, t) {
  var n = t.match(e);
  return n ? n[0] : null;
}
function vr(e, t, n) {
  var i,
    r,
    o,
    s,
    a,
    c = n.indexOf(e),
    l = n.indexOf(t, c + 1),
    u = c;
  if (c >= 0 && l > 0) {
    for (i = [], o = n.length; u >= 0 && !a; )
      u == c
        ? (i.push(u), (c = n.indexOf(e, u + 1)))
        : 1 == i.length
        ? (a = [i.pop(), l])
        : ((r = i.pop()) < o && ((o = r), (s = l)), (l = n.indexOf(t, u + 1))),
        (u = c < l && c >= 0 ? c : l);
    i.length && (a = [o, s]);
  }
  return a;
}
gr.range = vr;
var yr = function (e) {
    if (!e) return [];
    '{}' === e.substr(0, 2) && (e = '\\{\\}' + e.substr(2));
    return Or(
      (function (e) {
        return e
          .split('\\\\')
          .join(Cr)
          .split('\\{')
          .join(Rr)
          .split('\\}')
          .join(wr)
          .split('\\,')
          .join(Tr)
          .split('\\.')
          .join(br);
      })(e),
      !0
    ).map(_r);
  },
  Cr = '\0SLASH' + Math.random() + '\0',
  Rr = '\0OPEN' + Math.random() + '\0',
  wr = '\0CLOSE' + Math.random() + '\0',
  Tr = '\0COMMA' + Math.random() + '\0',
  br = '\0PERIOD' + Math.random() + '\0';
function Sr(e) {
  return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
}
function _r(e) {
  return e.split(Cr).join('\\').split(Rr).join('{').split(wr).join('}').split(Tr).join(',').split(br).join('.');
}
function Dr(e) {
  if (!e) return [''];
  var t = [],
    n = fr('{', '}', e);
  if (!n) return e.split(',');
  var i = n.pre,
    r = n.body,
    o = n.post,
    s = i.split(',');
  s[s.length - 1] += '{' + r + '}';
  var a = Dr(o);
  return o.length && ((s[s.length - 1] += a.shift()), s.push.apply(s, a)), t.push.apply(t, s), t;
}
function Pr(e) {
  return '{' + e + '}';
}
function Er(e) {
  return /^-?0\d/.test(e);
}
function xr(e, t) {
  return e <= t;
}
function kr(e, t) {
  return e >= t;
}
function Or(e, t) {
  var n = [],
    i = fr('{', '}', e);
  if (!i || /\$$/.test(i.pre)) return [e];
  var r,
    o = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(i.body),
    s = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(i.body),
    a = o || s,
    c = i.body.indexOf(',') >= 0;
  if (!a && !c) return i.post.match(/,.*\}/) ? Or((e = i.pre + '{' + i.body + wr + i.post)) : [e];
  if (a) r = i.body.split(/\.\./);
  else if (1 === (r = Dr(i.body)).length && 1 === (r = Or(r[0], !1).map(Pr)).length)
    return (d = i.post.length ? Or(i.post, !1) : ['']).map(function (e) {
      return i.pre + r[0] + e;
    });
  var l,
    u = i.pre,
    d = i.post.length ? Or(i.post, !1) : [''];
  if (a) {
    var h = Sr(r[0]),
      p = Sr(r[1]),
      f = Math.max(r[0].length, r[1].length),
      g = 3 == r.length ? Math.abs(Sr(r[2])) : 1,
      m = xr;
    p < h && ((g *= -1), (m = kr));
    var v = r.some(Er);
    l = [];
    for (var y = h; m(y, p); y += g) {
      var C;
      if (s) '\\' === (C = String.fromCharCode(y)) && (C = '');
      else if (((C = String(y)), v)) {
        var R = f - C.length;
        if (R > 0) {
          var w = new Array(R + 1).join('0');
          C = y < 0 ? '-' + w + C.slice(1) : w + C;
        }
      }
      l.push(C);
    }
  } else
    l = (function (e, t) {
      for (var n = [], i = 0; i < e.length; i++) {
        var r = t(e[i], i);
        pr(r) ? n.push.apply(n, r) : n.push(r);
      }
      return n;
    })(r, function (e) {
      return Or(e, !1);
    });
  for (var T = 0; T < l.length; T++)
    for (var b = 0; b < d.length; b++) {
      var S = u + l[T] + d[b];
      (!t || a || S) && n.push(S);
    }
  return n;
}
var Fr = jr;
jr.Minimatch = $r;
var qr = { sep: '/' };
try {
  qr = p.default;
} catch (e) {}
var Nr = (jr.GLOBSTAR = $r.GLOBSTAR = {}),
  Ir = {
    '!': { open: '(?:(?!(?:', close: '))[^/]*?)' },
    '?': { open: '(?:', close: ')?' },
    '+': { open: '(?:', close: ')+' },
    '*': { open: '(?:', close: ')*' },
    '@': { open: '(?:', close: ')' }
  },
  Mr = '().*{}+?[]^$\\!'.split('').reduce(function (e, t) {
    return (e[t] = !0), e;
  }, {});
var Lr = /\/+/;
function Ar(e, t) {
  (e = e || {}), (t = t || {});
  var n = {};
  return (
    Object.keys(t).forEach(function (e) {
      n[e] = t[e];
    }),
    Object.keys(e).forEach(function (t) {
      n[t] = e[t];
    }),
    n
  );
}
function jr(e, t, n) {
  if ('string' != typeof t) throw new TypeError('glob pattern string required');
  return n || (n = {}), !(!n.nocomment && '#' === t.charAt(0)) && ('' === t.trim() ? '' === e : new $r(t, n).match(e));
}
function $r(e, t) {
  if (!(this instanceof $r)) return new $r(e, t);
  if ('string' != typeof e) throw new TypeError('glob pattern string required');
  t || (t = {}),
    (e = e.trim()),
    '/' !== qr.sep && (e = e.split(qr.sep).join('/')),
    (this.options = t),
    (this.set = []),
    (this.pattern = e),
    (this.regexp = null),
    (this.negate = !1),
    (this.comment = !1),
    (this.empty = !1),
    this.make();
}
function Wr(e, t) {
  if ((t || (t = this instanceof $r ? this.options : {}), void 0 === (e = void 0 === e ? this.pattern : e)))
    throw new TypeError('undefined pattern');
  return t.nobrace || !e.match(/\{.*\}/) ? [e] : yr(e);
}
(jr.filter = function (e, t) {
  return (
    (t = t || {}),
    function (n, i, r) {
      return jr(n, e, t);
    }
  );
}),
  (jr.defaults = function (e) {
    if (!e || !Object.keys(e).length) return jr;
    var t = jr,
      n = function (n, i, r) {
        return t.minimatch(n, i, Ar(e, r));
      };
    return (
      (n.Minimatch = function (n, i) {
        return new t.Minimatch(n, Ar(e, i));
      }),
      n
    );
  }),
  ($r.defaults = function (e) {
    return e && Object.keys(e).length ? jr.defaults(e).Minimatch : $r;
  }),
  ($r.prototype.debug = function () {}),
  ($r.prototype.make = function () {
    if (this._made) return;
    var e = this.pattern,
      t = this.options;
    if (!t.nocomment && '#' === e.charAt(0)) return void (this.comment = !0);
    if (!e) return void (this.empty = !0);
    this.parseNegate();
    var n = (this.globSet = this.braceExpand());
    t.debug && (this.debug = console.error);
    this.debug(this.pattern, n),
      (n = this.globParts = n.map(function (e) {
        return e.split(Lr);
      })),
      this.debug(this.pattern, n),
      (n = n.map(function (e, t, n) {
        return e.map(this.parse, this);
      }, this)),
      this.debug(this.pattern, n),
      (n = n.filter(function (e) {
        return -1 === e.indexOf(!1);
      })),
      this.debug(this.pattern, n),
      (this.set = n);
  }),
  ($r.prototype.parseNegate = function () {
    var e = this.pattern,
      t = !1,
      n = this.options,
      i = 0;
    if (n.nonegate) return;
    for (var r = 0, o = e.length; r < o && '!' === e.charAt(r); r++) (t = !t), i++;
    i && (this.pattern = e.substr(i));
    this.negate = t;
  }),
  (jr.braceExpand = function (e, t) {
    return Wr(e, t);
  }),
  ($r.prototype.braceExpand = Wr),
  ($r.prototype.parse = function (e, t) {
    if (e.length > 65536) throw new TypeError('pattern is too long');
    var n = this.options;
    if (!n.noglobstar && '**' === e) return Nr;
    if ('' === e) return '';
    var i,
      r = '',
      o = !!n.nocase,
      s = !1,
      a = [],
      c = [],
      l = !1,
      u = -1,
      d = -1,
      h = '.' === e.charAt(0) ? '' : n.dot ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))' : '(?!\\.)',
      p = this;
    function f() {
      if (i) {
        switch (i) {
          case '*':
            (r += '[^/]*?'), (o = !0);
            break;
          case '?':
            (r += '[^/]'), (o = !0);
            break;
          default:
            r += '\\' + i;
        }
        p.debug('clearStateChar %j %j', i, r), (i = !1);
      }
    }
    for (var g, m = 0, v = e.length; m < v && (g = e.charAt(m)); m++)
      if ((this.debug('%s\t%s %s %j', e, m, r, g), s && Mr[g])) (r += '\\' + g), (s = !1);
      else
        switch (g) {
          case '/':
            return !1;
          case '\\':
            f(), (s = !0);
            continue;
          case '?':
          case '*':
          case '+':
          case '@':
          case '!':
            if ((this.debug('%s\t%s %s %j <-- stateChar', e, m, r, g), l)) {
              this.debug('  in class'), '!' === g && m === d + 1 && (g = '^'), (r += g);
              continue;
            }
            p.debug('call clearStateChar %j', i), f(), (i = g), n.noext && f();
            continue;
          case '(':
            if (l) {
              r += '(';
              continue;
            }
            if (!i) {
              r += '\\(';
              continue;
            }
            a.push({ type: i, start: m - 1, reStart: r.length, open: Ir[i].open, close: Ir[i].close }),
              (r += '!' === i ? '(?:(?!(?:' : '(?:'),
              this.debug('plType %j %j', i, r),
              (i = !1);
            continue;
          case ')':
            if (l || !a.length) {
              r += '\\)';
              continue;
            }
            f(), (o = !0);
            var y = a.pop();
            (r += y.close), '!' === y.type && c.push(y), (y.reEnd = r.length);
            continue;
          case '|':
            if (l || !a.length || s) {
              (r += '\\|'), (s = !1);
              continue;
            }
            f(), (r += '|');
            continue;
          case '[':
            if ((f(), l)) {
              r += '\\' + g;
              continue;
            }
            (l = !0), (d = m), (u = r.length), (r += g);
            continue;
          case ']':
            if (m === d + 1 || !l) {
              (r += '\\' + g), (s = !1);
              continue;
            }
            if (l) {
              var C = e.substring(d + 1, m);
              try {
                RegExp('[' + C + ']');
              } catch (e) {
                var R = this.parse(C, Kr);
                (r = r.substr(0, u) + '\\[' + R[0] + '\\]'), (o = o || R[1]), (l = !1);
                continue;
              }
            }
            (o = !0), (l = !1), (r += g);
            continue;
          default:
            f(), s ? (s = !1) : !Mr[g] || ('^' === g && l) || (r += '\\'), (r += g);
        }
    l && ((C = e.substr(d + 1)), (R = this.parse(C, Kr)), (r = r.substr(0, u) + '\\[' + R[0]), (o = o || R[1]));
    for (y = a.pop(); y; y = a.pop()) {
      var w = r.slice(y.reStart + y.open.length);
      this.debug('setting tail', r, y),
        (w = w.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (e, t, n) {
          return n || (n = '\\'), t + t + n + '|';
        })),
        this.debug('tail=%j\n   %s', w, w, y, r);
      var T = '*' === y.type ? '[^/]*?' : '?' === y.type ? '[^/]' : '\\' + y.type;
      (o = !0), (r = r.slice(0, y.reStart) + T + '\\(' + w);
    }
    f(), s && (r += '\\\\');
    var b = !1;
    switch (r.charAt(0)) {
      case '.':
      case '[':
      case '(':
        b = !0;
    }
    for (var S = c.length - 1; S > -1; S--) {
      var _ = c[S],
        D = r.slice(0, _.reStart),
        P = r.slice(_.reStart, _.reEnd - 8),
        E = r.slice(_.reEnd - 8, _.reEnd),
        x = r.slice(_.reEnd);
      E += x;
      var k = D.split('(').length - 1,
        O = x;
      for (m = 0; m < k; m++) O = O.replace(/\)[+*?]?/, '');
      var F = '';
      '' === (x = O) && t !== Kr && (F = '$'), (r = D + P + x + F + E);
    }
    '' !== r && o && (r = '(?=.)' + r);
    b && (r = h + r);
    if (t === Kr) return [r, o];
    if (!o)
      return (function (e) {
        return e.replace(/\\(.)/g, '$1');
      })(e);
    var q = n.nocase ? 'i' : '';
    try {
      var N = new RegExp('^' + r + '$', q);
    } catch (e) {
      return new RegExp('$.');
    }
    return (N._glob = e), (N._src = r), N;
  });
var Kr = {};
(jr.makeRe = function (e, t) {
  return new $r(e, t || {}).makeRe();
}),
  ($r.prototype.makeRe = function () {
    if (this.regexp || !1 === this.regexp) return this.regexp;
    var e = this.set;
    if (!e.length) return (this.regexp = !1), this.regexp;
    var t = this.options,
      n = t.noglobstar ? '[^/]*?' : t.dot ? '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?' : '(?:(?!(?:\\/|^)\\.).)*?',
      i = t.nocase ? 'i' : '',
      r = e
        .map(function (e) {
          return e
            .map(function (e) {
              return e === Nr
                ? n
                : 'string' == typeof e
                ? (function (e) {
                    return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                  })(e)
                : e._src;
            })
            .join('\\/');
        })
        .join('|');
    (r = '^(?:' + r + ')$'), this.negate && (r = '^(?!' + r + ').*$');
    try {
      this.regexp = new RegExp(r, i);
    } catch (e) {
      this.regexp = !1;
    }
    return this.regexp;
  }),
  (jr.match = function (e, t, n) {
    var i = new $r(t, (n = n || {}));
    return (
      (e = e.filter(function (e) {
        return i.match(e);
      })),
      i.options.nonull && !e.length && e.push(t),
      e
    );
  }),
  ($r.prototype.match = function (e, t) {
    if ((this.debug('match', e, this.pattern), this.comment)) return !1;
    if (this.empty) return '' === e;
    if ('/' === e && t) return !0;
    var n = this.options;
    '/' !== qr.sep && (e = e.split(qr.sep).join('/'));
    (e = e.split(Lr)), this.debug(this.pattern, 'split', e);
    var i,
      r,
      o = this.set;
    for (this.debug(this.pattern, 'set', o), r = e.length - 1; r >= 0 && !(i = e[r]); r--);
    for (r = 0; r < o.length; r++) {
      var s = o[r],
        a = e;
      if ((n.matchBase && 1 === s.length && (a = [i]), this.matchOne(a, s, t))) return !!n.flipNegate || !this.negate;
    }
    return !n.flipNegate && this.negate;
  }),
  ($r.prototype.matchOne = function (e, t, n) {
    var i = this.options;
    this.debug('matchOne', { this: this, file: e, pattern: t }), this.debug('matchOne', e.length, t.length);
    for (var r = 0, o = 0, s = e.length, a = t.length; r < s && o < a; r++, o++) {
      this.debug('matchOne loop');
      var c,
        l = t[o],
        u = e[r];
      if ((this.debug(t, l, u), !1 === l)) return !1;
      if (l === Nr) {
        this.debug('GLOBSTAR', [t, l, u]);
        var d = r,
          h = o + 1;
        if (h === a) {
          for (this.debug('** at the end'); r < s; r++)
            if ('.' === e[r] || '..' === e[r] || (!i.dot && '.' === e[r].charAt(0))) return !1;
          return !0;
        }
        for (; d < s; ) {
          var p = e[d];
          if ((this.debug('\nglobstar while', e, d, t, h, p), this.matchOne(e.slice(d), t.slice(h), n)))
            return this.debug('globstar found match!', d, s, p), !0;
          if ('.' === p || '..' === p || (!i.dot && '.' === p.charAt(0))) {
            this.debug('dot detected!', e, d, t, h);
            break;
          }
          this.debug('globstar swallow a segment, and continue'), d++;
        }
        return !(!n || (this.debug('\n>>> no match, partial?', e, d, t, h), d !== s));
      }
      if (
        ('string' == typeof l
          ? ((c = i.nocase ? u.toLowerCase() === l.toLowerCase() : u === l), this.debug('string match', l, u, c))
          : ((c = u.match(l)), this.debug('pattern match', l, u, c)),
        !c)
      )
        return !1;
    }
    if (r === s && o === a) return !0;
    if (r === s) return n;
    if (o === a) return r === s - 1 && '' === e[r];
    throw new Error('wtf?');
  });
var Hr = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    function i(e, t, n) {
      e[t] = n;
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WillDeleteFilesFeature = t.WillRenameFilesFeature = t.WillCreateFilesFeature = t.DidDeleteFilesFeature = t.DidRenameFilesFeature = t.DidCreateFilesFeature = void 0);
    class r {
      constructor(e, t, n, i, r) {
        (this._filters = new Map()),
          (this._client = e),
          (this._event = t),
          (this._registrationType = n),
          (this._clientCapability = i),
          (this._serverCapability = r);
      }
      get registrationType() {
        return this._registrationType;
      }
      fillClientCapabilities(e) {
        const t = n(n(e, 'workspace'), 'fileOperations');
        i(t, 'dynamicRegistration', !0), i(t, this._clientCapability, !0);
      }
      initialize(e) {
        var t;
        const n = null === (t = e.workspace) || void 0 === t ? void 0 : t.fileOperations,
          i = void 0 !== n ? ((r = n), (o = this._serverCapability), r[o]) : void 0;
        var r, o;
        if (void 0 !== (null == i ? void 0 : i.filters))
          try {
            this.register({ id: er.generateUuid(), registerOptions: { filters: i.filters } });
          } catch (e) {
            this._client.warn(`Ignoring invalid glob pattern for ${this._serverCapability} registration: ${e}`);
          }
      }
      register(e) {
        this._listener || (this._listener = this._event(this.send, this));
        const t = e.registerOptions.filters.map(e => {
          const t = new Fr.Minimatch(e.pattern.glob, r.asMinimatchOptions(e.pattern.options));
          if (!t.makeRe()) throw new Error(`Invalid pattern ${e.pattern.glob}!`);
          return { scheme: e.scheme, matcher: t, kind: e.pattern.matches };
        });
        this._filters.set(e.id, t);
      }
      unregister(e) {
        this._filters.delete(e),
          0 === this._filters.size && this._listener && (this._listener.dispose(), (this._listener = void 0));
      }
      dispose() {
        this._filters.clear(), this._listener && (this._listener.dispose(), (this._listener = void 0));
      }
      async filter(e, t) {
        const n = await Promise.all(
            e.files.map(async e => {
              const n = t(e),
                i = n.fsPath.replace(/\\/g, '/');
              for (const e of this._filters.values())
                for (const t of e)
                  if (void 0 === t.scheme || t.scheme === n.scheme)
                    if (t.matcher.match(i)) {
                      if (void 0 === t.kind) return !0;
                      const e = await r.getFileType(n);
                      if (void 0 === e)
                        return this._client.error(`Failed to determine file type for ${n.toString()}.`), !0;
                      if (
                        (e === u.default.FileType.File && t.kind === qi.FileOperationPatternKind.file) ||
                        (e === u.default.FileType.Directory && t.kind === qi.FileOperationPatternKind.folder)
                      )
                        return !0;
                    } else if (t.kind === qi.FileOperationPatternKind.folder) {
                      if ((await r.getFileType(n)) === u.default.FileType.Directory && t.matcher.match(i + '/'))
                        return !0;
                    }
              return !1;
            })
          ),
          i = e.files.filter((e, t) => n[t]);
        return Object.assign(Object.assign({}, e), { files: i });
      }
      static async getFileType(e) {
        try {
          return (await u.default.workspace.fs.stat(e)).type;
        } catch (e) {
          return;
        }
      }
      static asMinimatchOptions(e) {
        if (void 0 !== e) return !0 === e.ignoreCase ? { nocase: !0 } : void 0;
      }
    }
    class o extends r {
      constructor(e, t, n, i, r, o, s) {
        super(e, t, n, i, r), (this._notificationType = n), (this._accessUri = o), (this._createParams = s);
      }
      async send(e) {
        const t = await this.filter(e, this._accessUri);
        if (t.files.length) {
          const e = async e => {
            this._client.sendNotification(this._notificationType, this._createParams(e));
          };
          this.doSend(t, e);
        }
      }
    }
    t.DidCreateFilesFeature = class extends o {
      constructor(e) {
        super(
          e,
          u.default.workspace.onDidCreateFiles,
          qi.DidCreateFilesNotification.type,
          'didCreate',
          'didCreate',
          e => e,
          e.code2ProtocolConverter.asDidCreateFilesParams
        );
      }
      doSend(e, t) {
        var n;
        const i = null === (n = this._client.clientOptions.middleware) || void 0 === n ? void 0 : n.workspace;
        return (null == i ? void 0 : i.didCreateFiles) ? i.didCreateFiles(e, t) : t(e);
      }
    };
    t.DidRenameFilesFeature = class extends o {
      constructor(e) {
        super(
          e,
          u.default.workspace.onDidRenameFiles,
          qi.DidRenameFilesNotification.type,
          'didRename',
          'didRename',
          e => e.oldUri,
          e.code2ProtocolConverter.asDidRenameFilesParams
        );
      }
      doSend(e, t) {
        var n;
        const i = null === (n = this._client.clientOptions.middleware) || void 0 === n ? void 0 : n.workspace;
        return (null == i ? void 0 : i.didRenameFiles) ? i.didRenameFiles(e, t) : t(e);
      }
    };
    t.DidDeleteFilesFeature = class extends o {
      constructor(e) {
        super(
          e,
          u.default.workspace.onDidDeleteFiles,
          qi.DidDeleteFilesNotification.type,
          'didDelete',
          'didDelete',
          e => e,
          e.code2ProtocolConverter.asDidDeleteFilesParams
        );
      }
      doSend(e, t) {
        var n;
        const i = null === (n = this._client.clientOptions.middleware) || void 0 === n ? void 0 : n.workspace;
        return (null == i ? void 0 : i.didDeleteFiles) ? i.didDeleteFiles(e, t) : t(e);
      }
    };
    class s extends r {
      constructor(e, t, n, i, r, o, s) {
        super(e, t, n, i, r), (this._requestType = n), (this._accessUri = o), (this._createParams = s);
      }
      async send(e) {
        const t = this.waitUntil(e);
        e.waitUntil(t);
      }
      async waitUntil(e) {
        const t = await this.filter(e, this._accessUri);
        if (t.files.length) {
          const e = e =>
            this._client
              .sendRequest(this._requestType, this._createParams(e))
              .then(this._client.protocol2CodeConverter.asWorkspaceEdit);
          return this.doSend(t, e);
        }
      }
    }
    t.WillCreateFilesFeature = class extends s {
      constructor(e) {
        super(
          e,
          u.default.workspace.onWillCreateFiles,
          qi.WillCreateFilesRequest.type,
          'willCreate',
          'willCreate',
          e => e,
          e.code2ProtocolConverter.asWillCreateFilesParams
        );
      }
      doSend(e, t) {
        var n;
        const i = null === (n = this._client.clientOptions.middleware) || void 0 === n ? void 0 : n.workspace;
        return (null == i ? void 0 : i.willCreateFiles) ? i.willCreateFiles(e, t) : t(e);
      }
    };
    t.WillRenameFilesFeature = class extends s {
      constructor(e) {
        super(
          e,
          u.default.workspace.onWillRenameFiles,
          qi.WillRenameFilesRequest.type,
          'willRename',
          'willRename',
          e => e.oldUri,
          e.code2ProtocolConverter.asWillRenameFilesParams
        );
      }
      doSend(e, t) {
        var n;
        const i = null === (n = this._client.clientOptions.middleware) || void 0 === n ? void 0 : n.workspace;
        return (null == i ? void 0 : i.willRenameFiles) ? i.willRenameFiles(e, t) : t(e);
      }
    };
    t.WillDeleteFilesFeature = class extends s {
      constructor(e) {
        super(
          e,
          u.default.workspace.onWillDeleteFiles,
          qi.WillDeleteFilesRequest.type,
          'willDelete',
          'willDelete',
          e => e,
          e.code2ProtocolConverter.asWillDeleteFilesParams
        );
      }
      doSend(e, t) {
        var n;
        const i = null === (n = this._client.clientOptions.middleware) || void 0 === n ? void 0 : n.workspace;
        return (null == i ? void 0 : i.willDeleteFiles) ? i.willDeleteFiles(e, t) : t(e);
      }
    };
  }),
  Ur = _(function (e, t) {
    function n(e, t) {
      return void 0 === e[t] && (e[t] = {}), e[t];
    }
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.LinkedEditingFeature = void 0);
    class i extends nr.TextDocumentFeature {
      constructor(e) {
        super(e, qi.LinkedEditingRangeRequest.type);
      }
      fillClientCapabilities(e) {
        n(n(e, 'textDocument'), 'linkedEditingRange').dynamicRegistration = !0;
      }
      initialize(e, t) {
        let [n, i] = this.getRegistration(t, e.linkedEditingRangeProvider);
        n && i && this.register({ id: n, registerOptions: i });
      }
      registerLanguageProvider(e) {
        const t = {
          provideLinkedEditingRanges: (e, t, n) => {
            const i = this._client,
              r = (e, t, n) =>
                i
                  .sendRequest(
                    qi.LinkedEditingRangeRequest.type,
                    i.code2ProtocolConverter.asTextDocumentPositionParams(e, t),
                    n
                  )
                  .then(i.protocol2CodeConverter.asLinkedEditingRanges, e =>
                    i.handleFailedRequest(qi.LinkedEditingRangeRequest.type, e, null)
                  ),
              o = i.clientOptions.middleware;
            return o.provideLinkedEditingRange ? o.provideLinkedEditingRange(e, t, n, r) : r(e, t, n);
          }
        };
        return [u.default.languages.registerLinkedEditingRangeProvider(e.documentSelector, t), t];
      }
    }
    t.LinkedEditingFeature = i;
  }),
  zr = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ProposedFeatures = t.CommonLanguageClient = void 0);
    class n extends nr.BaseLanguageClient {
      constructor(e, t, n) {
        super(e, t, n);
      }
      registerProposedFeatures() {
        this.registerFeatures(i.createAll(this));
      }
      registerBuiltinFeatures() {
        super.registerBuiltinFeatures(),
          this.registerFeature(new Ni.ConfigurationFeature(this)),
          this.registerFeature(new or.TypeDefinitionFeature(this)),
          this.registerFeature(new rr.ImplementationFeature(this)),
          this.registerFeature(new ir.ColorProviderFeature(this)),
          this.registerFeature(new sr.WorkspaceFoldersFeature(this)),
          this.registerFeature(new ar.FoldingRangeFeature(this)),
          this.registerFeature(new cr.DeclarationFeature(this)),
          this.registerFeature(new lr.SelectionRangeFeature(this)),
          this.registerFeature(new ur.ProgressFeature(this)),
          this.registerFeature(new dr.CallHierarchyFeature(this)),
          this.registerFeature(new hr.SemanticTokensFeature(this)),
          this.registerFeature(new Ur.LinkedEditingFeature(this)),
          this.registerFeature(new Hr.DidCreateFilesFeature(this)),
          this.registerFeature(new Hr.DidRenameFilesFeature(this)),
          this.registerFeature(new Hr.DidDeleteFilesFeature(this)),
          this.registerFeature(new Hr.WillCreateFilesFeature(this)),
          this.registerFeature(new Hr.WillRenameFilesFeature(this)),
          this.registerFeature(new Hr.WillDeleteFilesFeature(this));
      }
    }
    var i;
    (t.CommonLanguageClient = n),
      (function (e) {
        e.createAll = function (e) {
          return [];
        };
      })((i = t.ProposedFeatures || (t.ProposedFeatures = {})));
  }),
  Vr = _(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.terminate = void 0);
    const n = 'win32' === process.platform,
      i = 'darwin' === process.platform,
      r = 'linux' === process.platform;
    t.terminate = function (e, t) {
      if (n)
        try {
          let n = { stdio: ['pipe', 'pipe', 'ignore'] };
          return t && (n.cwd = t), f.default.execFileSync('taskkill', ['/T', '/F', '/PID', e.pid.toString()], n), !0;
        } catch (e) {
          return !1;
        }
      else {
        if (!r && !i) return e.kill('SIGKILL'), !0;
        try {
          var o = p.default.join(__dirname, 'terminateProcess.sh');
          return !f.default.spawnSync(o, [e.pid.toString()]).error;
        } catch (e) {
          return !1;
        }
      }
    };
  }),
  Br = qi,
  Gr = _(function (e, t) {
    var n =
        (b && b.__createBinding) ||
        (Object.create
          ? function (e, t, n, i) {
              void 0 === i && (i = n),
                Object.defineProperty(e, i, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, i) {
              void 0 === i && (i = n), (e[i] = t[n]);
            }),
      i =
        (b && b.__exportStar) ||
        function (e, t) {
          for (var i in e) 'default' === i || Object.prototype.hasOwnProperty.call(t, i) || n(t, e, i);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), i(qi, t), i(nr, t), i(zr, t);
  }),
  Xr = _(function (e, t) {
    var n =
        (b && b.__createBinding) ||
        (Object.create
          ? function (e, t, n, i) {
              void 0 === i && (i = n),
                Object.defineProperty(e, i, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, i) {
              void 0 === i && (i = n), (e[i] = t[n]);
            }),
      i =
        (b && b.__exportStar) ||
        function (e, t) {
          for (var i in e) 'default' === i || Object.prototype.hasOwnProperty.call(t, i) || n(t, e, i);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.SettingMonitor = t.LanguageClient = t.TransportKind = void 0);
    const r = f.default;
    i(Br, t), i(Gr, t);
    const o = '^1.52.0';
    var s, a, c, l, h, g;
    !(function (e) {
      e.is = function (e) {
        return kt.string(e.command);
      };
    })(s || (s = {})),
      (function (e) {
        (e[(e.stdio = 0)] = 'stdio'),
          (e[(e.ipc = 1)] = 'ipc'),
          (e[(e.pipe = 2)] = 'pipe'),
          (e[(e.socket = 3)] = 'socket');
      })((a = t.TransportKind || (t.TransportKind = {}))),
      (function (e) {
        e.isSocket = function (e) {
          let t = e;
          return t && t.kind === a.socket && kt.number(t.port);
        };
      })(c || (c = {})),
      (function (e) {
        e.is = function (e) {
          return kt.string(e.module);
        };
      })(l || (l = {})),
      (function (e) {
        e.is = function (e) {
          let t = e;
          return t && void 0 !== t.writer && void 0 !== t.reader;
        };
      })(h || (h = {})),
      (function (e) {
        e.is = function (e) {
          let t = e;
          return t && void 0 !== t.process && 'boolean' == typeof t.detached;
        };
      })(g || (g = {}));
    class m extends zr.CommonLanguageClient {
      constructor(e, t, n, i, r) {
        let o, s, a, c, l;
        kt.string(t)
          ? ((o = e), (s = t), (a = n), (c = i), (l = !!r))
          : ((o = e.toLowerCase()), (s = e), (a = t), (c = n), (l = i)),
          void 0 === l && (l = !1),
          super(o, s, c),
          (this._serverOptions = a),
          (this._forceDebug = l);
        try {
          this.checkVersion();
        } catch (e) {
          throw (kt.string(e.message) && this.outputChannel.appendLine(e.message), e);
        }
      }
      checkVersion() {
        let e = xt.parse(u.default.version);
        if (!e) throw new Error('No valid VS Code version detected. Version string is: ' + u.default.version);
        if ((e.prerelease && e.prerelease.length > 0 && (e.prerelease = []), !xt.satisfies(e, o)))
          throw new Error(
            'The language client requires VS Code version ^1.52.0 but received version ' + u.default.version
          );
      }
      stop() {
        return super.stop().then(() => {
          if (this._serverProcess) {
            let e = this._serverProcess;
            (this._serverProcess = void 0),
              (void 0 !== this._isDetached && this._isDetached) || this.checkProcessDied(e),
              (this._isDetached = void 0);
          }
        });
      }
      checkProcessDied(e) {
        e &&
          setTimeout(() => {
            try {
              process.kill(e.pid, 0), Vr.terminate(e);
            } catch (e) {}
          }, 2e3);
      }
      handleConnectionClosed() {
        (this._serverProcess = void 0), super.handleConnectionClosed();
      }
      fillInitializeParams(e) {
        super.fillInitializeParams(e), null === e.processId && (e.processId = process.pid);
      }
      createMessageTransports(e) {
        function t(e, t) {
          if (!e && !t) return;
          let n = Object.create(null);
          return (
            Object.keys(process.env).forEach(e => (n[e] = process.env[e])),
            t && ((n.ELECTRON_RUN_AS_NODE = '1'), (n.ELECTRON_NO_ASAR = '1')),
            e && Object.keys(e).forEach(t => (n[t] = e[t])),
            n
          );
        }
        const n = ['--debug=', '--debug-brk=', '--inspect=', '--inspect-brk='],
          i = ['--debug', '--debug-brk', '--inspect', '--inspect-brk'];
        function o(e) {
          if (null === e.stdin || null === e.stdout || null === e.stderr)
            throw new Error('Process created without stdio streams');
        }
        let u,
          d = this._serverOptions;
        if (kt.func(d))
          return d().then(t => {
            if (nr.MessageTransports.is(t)) return (this._isDetached = !!t.detached), t;
            if (h.is(t))
              return (
                (this._isDetached = !!t.detached),
                { reader: new Br.StreamMessageReader(t.reader), writer: new Br.StreamMessageWriter(t.writer) }
              );
            {
              let n;
              return (
                g.is(t) ? ((n = t.process), (this._isDetached = t.detached)) : ((n = t), (this._isDetached = !1)),
                n.stderr.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                { reader: new Br.StreamMessageReader(n.stdout), writer: new Br.StreamMessageWriter(n.stdin) }
              );
            }
          });
        let p = d;
        return (
          (u =
            p.run || p.debug
              ? this._forceDebug ||
                (function () {
                  let e = process.execArgv;
                  return !!e && e.some(e => n.some(t => e.startsWith(t)) || i.some(t => e === t));
                })()
                ? p.debug
                : p.run
              : d),
          this._getServerWorkingDir(u.options).then(n => {
            if (l.is(u) && u.module) {
              let i = u,
                s = i.transport || a.stdio;
              if (!i.runtime) {
                let l = void 0;
                return new Promise((u, d) => {
                  let h = (i.args && i.args.slice()) || [];
                  s === a.ipc
                    ? h.push('--node-ipc')
                    : s === a.stdio
                    ? h.push('--stdio')
                    : s === a.pipe
                    ? ((l = Br.generateRandomPipeName()), h.push('--pipe=' + l))
                    : c.isSocket(s) && h.push('--socket=' + s.port),
                    h.push('--clientProcessId=' + process.pid.toString());
                  let p = i.options || Object.create(null);
                  if (
                    ((p.env = t(p.env, !0)),
                    (p.execArgv = p.execArgv || []),
                    (p.cwd = n),
                    (p.silent = !0),
                    s === a.ipc || s === a.stdio)
                  ) {
                    let t = r.fork(i.module, h || [], p);
                    o(t),
                      (this._serverProcess = t),
                      t.stderr.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                      s === a.ipc
                        ? (t.stdout.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                          u({
                            reader: new Br.IPCMessageReader(this._serverProcess),
                            writer: new Br.IPCMessageWriter(this._serverProcess)
                          }))
                        : u({
                            reader: new Br.StreamMessageReader(t.stdout),
                            writer: new Br.StreamMessageWriter(t.stdin)
                          });
                  } else
                    s === a.pipe
                      ? Br.createClientPipeTransport(l).then(t => {
                          let n = r.fork(i.module, h || [], p);
                          o(n),
                            (this._serverProcess = n),
                            n.stderr.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                            n.stdout.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                            t.onConnected().then(e => {
                              u({ reader: e[0], writer: e[1] });
                            });
                        })
                      : c.isSocket(s) &&
                        Br.createClientSocketTransport(s.port).then(t => {
                          let n = r.fork(i.module, h || [], p);
                          o(n),
                            (this._serverProcess = n),
                            n.stderr.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                            n.stdout.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                            t.onConnected().then(e => {
                              u({ reader: e[0], writer: e[1] });
                            });
                        });
                });
              }
              {
                let o = [],
                  l = i.options || Object.create(null);
                l.execArgv && l.execArgv.forEach(e => o.push(e)),
                  o.push(i.module),
                  i.args && i.args.forEach(e => o.push(e));
                const u = Object.create(null);
                (u.cwd = n), (u.env = t(l.env, !1));
                const d = this._getRuntimePath(i.runtime, n);
                let h = void 0;
                if (
                  (s === a.ipc
                    ? ((u.stdio = [null, null, null, 'ipc']), o.push('--node-ipc'))
                    : s === a.stdio
                    ? o.push('--stdio')
                    : s === a.pipe
                    ? ((h = Br.generateRandomPipeName()), o.push('--pipe=' + h))
                    : c.isSocket(s) && o.push('--socket=' + s.port),
                  o.push('--clientProcessId=' + process.pid.toString()),
                  s === a.ipc || s === a.stdio)
                ) {
                  let t = r.spawn(d, o, u);
                  return t && t.pid
                    ? ((this._serverProcess = t),
                      t.stderr.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                      s === a.ipc
                        ? (t.stdout.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                          Promise.resolve({ reader: new Br.IPCMessageReader(t), writer: new Br.IPCMessageWriter(t) }))
                        : Promise.resolve({
                            reader: new Br.StreamMessageReader(t.stdout),
                            writer: new Br.StreamMessageWriter(t.stdin)
                          }))
                    : Promise.reject(`Launching server using runtime ${d} failed.`);
                }
                if (s === a.pipe)
                  return Br.createClientPipeTransport(h).then(t => {
                    let n = r.spawn(d, o, u);
                    return n && n.pid
                      ? ((this._serverProcess = n),
                        n.stderr.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                        n.stdout.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                        t.onConnected().then(e => ({ reader: e[0], writer: e[1] })))
                      : Promise.reject(`Launching server using runtime ${d} failed.`);
                  });
                if (c.isSocket(s))
                  return Br.createClientSocketTransport(s.port).then(t => {
                    let n = r.spawn(d, o, u);
                    return n && n.pid
                      ? ((this._serverProcess = n),
                        n.stderr.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                        n.stdout.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                        t.onConnected().then(e => ({ reader: e[0], writer: e[1] })))
                      : Promise.reject(`Launching server using runtime ${d} failed.`);
                  });
              }
            } else if (s.is(u) && u.command) {
              let t = u,
                i = t.args || [],
                o = Object.assign({}, t.options);
              o.cwd = o.cwd || n;
              let s = r.spawn(t.command, i, o);
              return s && s.pid
                ? (s.stderr.on('data', t => this.outputChannel.append(kt.string(t) ? t : t.toString(e))),
                  (this._serverProcess = s),
                  (this._isDetached = !!o.detached),
                  Promise.resolve({
                    reader: new Br.StreamMessageReader(s.stdout),
                    writer: new Br.StreamMessageWriter(s.stdin)
                  }))
                : Promise.reject(`Launching server using command ${t.command} failed.`);
            }
            return Promise.reject(new Error('Unsupported server configuration ' + JSON.stringify(d, null, 4)));
          })
        );
      }
      _getRuntimePath(e, t) {
        if (p.default.isAbsolute(e)) return e;
        const n = this._mainGetRootPath();
        if (void 0 !== n) {
          const t = p.default.join(n, e);
          if (d.default.existsSync(t)) return t;
        }
        if (void 0 !== t) {
          const n = p.default.join(t, e);
          if (d.default.existsSync(n)) return n;
        }
        return e;
      }
      _mainGetRootPath() {
        let e = u.default.workspace.workspaceFolders;
        if (!e || 0 === e.length) return;
        let t = e[0];
        return 'file' === t.uri.scheme ? t.uri.fsPath : void 0;
      }
      _getServerWorkingDir(e) {
        let t = e && e.cwd;
        return (
          t ||
            (t = this.clientOptions.workspaceFolder
              ? this.clientOptions.workspaceFolder.uri.fsPath
              : this._mainGetRootPath()),
          t
            ? new Promise(e => {
                d.default.lstat(t, (n, i) => {
                  e(!n && i.isDirectory() ? t : void 0);
                });
              })
            : Promise.resolve(void 0)
        );
      }
      getLocale() {
        const e = process.env.VSCODE_NLS_CONFIG;
        if (void 0 === e) return 'en';
        let t = void 0;
        try {
          t = JSON.parse(e);
        } catch (e) {}
        return void 0 === t || 'string' != typeof t.locale ? 'en' : t.locale;
      }
    }
    t.LanguageClient = m;
    t.SettingMonitor = class {
      constructor(e, t) {
        (this._client = e), (this._setting = t), (this._listeners = []);
      }
      start() {
        return (
          u.default.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this._listeners),
          this.onDidChangeConfiguration(),
          new u.default.Disposable(() => {
            this._client.needsStop() && this._client.stop();
          })
        );
      }
      onDidChangeConfiguration() {
        let e = this._setting.indexOf('.'),
          t = e >= 0 ? this._setting.substr(0, e) : this._setting,
          n = e >= 0 ? this._setting.substr(e + 1) : void 0,
          i = n ? u.default.workspace.getConfiguration(t).get(n, !1) : u.default.workspace.getConfiguration(t);
        i && this._client.needsStart() ? this._client.start() : !i && this._client.needsStop() && this._client.stop();
      }
    };
  });
let Jr = '',
  Yr = '',
  Zr = '';
const Qr = Array(20).fill('=').join(''),
  eo = new u.default.EventEmitter();
async function to() {
  return u.default.workspace.registerTextDocumentContentProvider('vetur', {
    onDidChange: eo.event,
    provideTextDocumentContent: e =>
      `${Qr}\nVirtual content of ${
        Jr + '.template'
      }\nHover, semantic diagnostics, jump to definition and find references are run on this file.\n${Qr}\n\n${Yr}\n\n${Qr}\nSourceMap\nfrom: ${Jr}\nto  : ${
        Jr + '.template'
      }\n[VueFileStart, VueFileEnd, VueFileText] => [TSVirtualFileStart, TSVirtualFileEnd, TSVirtualFileText]\n${Qr}\n\n${Zr}\n`
  });
}
async function no(e) {
  return u.default.window.withProgress(
    { title: 'Vetur initialization', location: u.default.ProgressLocation.Window },
    () => e
  );
}
exports.activate = async function (i) {
  const r = (function (e) {
    const t = e ? 'Code - Insiders' : 'Code';
    return 'win32' === process.platform
      ? n.resolve(process.env.APPDATA || '', t, 'User/snippets/vetur')
      : 'darwin' === process.platform
      ? n.resolve(o.homedir(), 'Library/Application Support', t, 'User/snippets/vetur')
      : n.resolve(o.homedir(), '.config', t, 'User/snippets/vetur');
  })(u.default.env.appName.includes('Insiders'));
  i.subscriptions.push(await to()),
    i.subscriptions.push(u.default.commands.registerCommand('vetur.generateGrammar', w(i.extensionPath))),
    i.subscriptions.push(
      u.default.commands.registerCommand(
        'vetur.openUserScaffoldSnippetFolder',
        (function (e) {
          return async () => {
            const t = u.default.Uri.file(e);
            h.existsSync(t.fsPath) || h.mkdirSync(t.fsPath),
              u.default.commands.executeCommand('vscode.openFolder', t, !0);
          };
        })(r)
      )
    ),
    e.languages.setLanguageConfiguration('vue-html', {
      wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
      onEnterRules: [
        {
          beforeText: new RegExp(`<(?!(?:${T.join('|')}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
          afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
          action: { indentAction: e.IndentAction.IndentOutdent }
        },
        {
          beforeText: new RegExp(`<(?!(?:${T.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
          action: { indentAction: e.IndentAction.Indent }
        }
      ]
    });
  const s = (function (e, i) {
    const r = u.default.workspace.getConfiguration();
    let o;
    const s = r.get('vetur.dev.vlsPath', '');
    o = s && '' !== s && t.existsSync(s) ? n.resolve(s, 'dist/vueServerMain.js') : e;
    const a = [],
      c = r.get('vetur.dev.vlsPort');
    -1 !== c && (a.push('--inspect=' + c), console.log('Will launch VLS in port: ' + c));
    const l = {
        run: { module: o, transport: Xr.TransportKind.ipc, options: { execArgv: a } },
        debug: { module: o, transport: Xr.TransportKind.ipc, options: { execArgv: ['--nolazy', '--inspect=6005'] } }
      },
      d = {
        documentSelector: [{ language: 'vue', scheme: 'file' }],
        synchronize: {
          configurationSection: [
            'vetur',
            'sass',
            'emmet',
            'html',
            'css',
            'javascript',
            'typescript',
            'prettier',
            'stylusSupremacy'
          ],
          fileEvents: u.default.workspace.createFileSystemWatcher('{**/*.js,**/*.ts,**/*.json}', !1, !1, !0)
        },
        initializationOptions: { config: r, globalSnippetDir: i },
        revealOutputChannelOn: Xr.RevealOutputChannelOn.Never
      };
    return new Xr.LanguageClient('vetur', 'Vue Language Server', l, d);
  })(i.asAbsolutePath(n.join('server', 'dist', 'vueServerMain.js')), r);
  i.subscriptions.push(s.start());
  const a = s
    .onReady()
    .then(() => {
      if (
        ((function (e) {
          e.onNotification('$/showVirtualFile', (e, t) => {});
        })(s),
        (function (e, t) {
          e.subscriptions.push(
            u.default.commands.registerCommand(
              'vetur.showCorrespondingVirtualFile',
              (function (e) {
                return async () => {
                  if (
                    !u.default.window.activeTextEditor ||
                    !u.default.window.activeTextEditor.document.fileName.endsWith('.vue')
                  )
                    return u.default.window.showInformationMessage(
                      'Failed to show virtual file. Make sure the current file is a .vue file.'
                    );
                  const t = u.default.window.activeTextEditor.document.fileName,
                    n = u.default.window.activeTextEditor.document.getText(),
                    i = u.default.Uri.parse('vetur:' + t);
                  Jr = t;
                  const r = await e.sendRequest('$/queryVirtualFileInfo', { fileName: Jr, currFileText: n });
                  (Yr = r.source), (Zr = r.sourceMapNodesString), eo.fire(i);
                  const o = await u.default.workspace.openTextDocument(i);
                  u.default.window.showTextDocument(o, { viewColumn: u.default.ViewColumn.Beside });
                };
              })(t)
            ),
            u.default.commands.registerCommand('vetur.showOutputChannel', () => t.outputChannel.show()),
            u.default.commands.registerCommand(
              'vetur.showDoctorInfo',
              (function (e) {
                return async () => {
                  if (
                    !u.default.window.activeTextEditor ||
                    !u.default.window.activeTextEditor.document.fileName.endsWith('.vue')
                  )
                    return u.default.window.showInformationMessage(
                      'Failed to doctor. Make sure the current file is a .vue file.'
                    );
                  const t = u.default.window.activeTextEditor.document.fileName,
                    n = await e.sendRequest('$/doctor', { fileName: t }),
                    i = n.slice(0, 1e3) + '....';
                  'Copy' === (await u.default.window.showInformationMessage(i, { modal: !0 }, 'Ok', 'Copy')) &&
                    (await u.default.env.clipboard.writeText(n));
                };
              })(t)
            )
          );
        })(i, s),
        (function (e, t) {
          e.subscriptions.push(
            u.default.commands.registerCommand('vetur.restartVLS', () =>
              no(
                t
                  .stop()
                  .then(() => t.start())
                  .then(() => t.onReady())
              )
            )
          );
        })(i, s),
        i.extensionMode === u.default.ExtensionMode.Test)
      )
        return { sendRequest: s.sendRequest.bind(s) };
    })
    .catch(e => {
      console.error(e.stack), console.log('Client initialization failed');
    });
  return no(a);
};
//# sourceMappingURL=vueMain.js.map
