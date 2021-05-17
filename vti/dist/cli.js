'use strict';
var e = require('events'),
  t = require('child_process'),
  n = require('path'),
  r = require('fs'),
  o = require('util'),
  i = require('os'),
  s = require('crypto'),
  a = require('net'),
  c = require('url'),
  u = require('stream'),
  l = require('vls'),
  h = require('assert'),
  d = require('tty');
function f(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
var p = f(e),
  g = f(t),
  m = f(n),
  y = f(r),
  v = f(o),
  b = f(i),
  _ = f(s),
  w = f(a),
  R = f(c),
  k = f(h),
  C = f(d),
  O =
    'undefined' != typeof globalThis
      ? globalThis
      : 'undefined' != typeof window
      ? window
      : 'undefined' != typeof global
      ? global
      : 'undefined' != typeof self
      ? self
      : {};
function T(e) {
  if (e.__esModule) return e;
  var t = Object.defineProperty({}, '__esModule', { value: !0 });
  return (
    Object.keys(e).forEach(function (n) {
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
              }
            }
      );
    }),
    t
  );
}
function P(e) {
  var t = { exports: {} };
  return e(t, t.exports), t.exports;
}
var x = P(function (e, t) {
    const n = p.default.EventEmitter;
    class r {
      constructor() {
        (this.helpWidth = void 0), (this.sortSubcommands = !1), (this.sortOptions = !1);
      }
      visibleCommands(e) {
        const t = e.commands.filter(e => !e._hidden);
        if (e._hasImplicitHelpCommand()) {
          const n = e._helpCommandnameAndArgs.split(/ +/),
            r = e.createCommand(n.shift()).helpOption(!1);
          r.description(e._helpCommandDescription), r._parseExpectedArgs(n), t.push(r);
        }
        return this.sortSubcommands && t.sort((e, t) => e.name().localeCompare(t.name())), t;
      }
      visibleOptions(e) {
        const t = e.options.filter(e => !e.hidden),
          n = e._hasHelpOption && e._helpShortFlag && !e._findOption(e._helpShortFlag),
          r = e._hasHelpOption && !e._findOption(e._helpLongFlag);
        if (n || r) {
          let o;
          (o = n
            ? r
              ? e.createOption(e._helpFlags, e._helpDescription)
              : e.createOption(e._helpShortFlag, e._helpDescription)
            : e.createOption(e._helpLongFlag, e._helpDescription)),
            t.push(o);
        }
        if (this.sortOptions) {
          const e = e => (e.short ? e.short.replace(/^-/, '') : e.long.replace(/^--/, ''));
          t.sort((t, n) => e(t).localeCompare(e(n)));
        }
        return t;
      }
      visibleArguments(e) {
        return e._argsDescription && e._args.length
          ? e._args.map(t => ({ term: t.name, description: e._argsDescription[t.name] || '' }), 0)
          : [];
      }
      subcommandTerm(e) {
        const t = e._args.map(e => u(e)).join(' ');
        return (
          e._name +
          (e._aliases[0] ? '|' + e._aliases[0] : '') +
          (e.options.length ? ' [options]' : '') +
          (t ? ' ' + t : '')
        );
      }
      optionTerm(e) {
        return e.flags;
      }
      longestSubcommandTermLength(e, t) {
        return t.visibleCommands(e).reduce((e, n) => Math.max(e, t.subcommandTerm(n).length), 0);
      }
      longestOptionTermLength(e, t) {
        return t.visibleOptions(e).reduce((e, n) => Math.max(e, t.optionTerm(n).length), 0);
      }
      longestArgumentTermLength(e, t) {
        return t.visibleArguments(e).reduce((e, t) => Math.max(e, t.term.length), 0);
      }
      commandUsage(e) {
        let t = e._name;
        e._aliases[0] && (t = t + '|' + e._aliases[0]);
        let n = '';
        for (let t = e.parent; t; t = t.parent) n = t.name() + ' ' + n;
        return n + t + ' ' + e.usage();
      }
      commandDescription(e) {
        return e.description();
      }
      subcommandDescription(e) {
        return e.description();
      }
      optionDescription(e) {
        if (e.negate) return e.description;
        const t = [];
        return (
          e.argChoices && t.push('choices: ' + e.argChoices.map(e => JSON.stringify(e)).join(', ')),
          void 0 !== e.defaultValue &&
            t.push('default: ' + (e.defaultValueDescription || JSON.stringify(e.defaultValue))),
          t.length > 0 ? `${e.description} (${t.join(', ')})` : e.description
        );
      }
      formatHelp(e, t) {
        const n = t.padWidth(e, t),
          r = t.helpWidth || 80;
        function o(e, o) {
          if (o) {
            const i = `${e.padEnd(n + 2)}${o}`;
            return t.wrap(i, r - 2, n + 2);
          }
          return e;
        }
        function i(e) {
          return e.join('\n').replace(/^/gm, ' '.repeat(2));
        }
        let s = ['Usage: ' + t.commandUsage(e), ''];
        const a = t.commandDescription(e);
        a.length > 0 && (s = s.concat([a, '']));
        const c = t.visibleArguments(e).map(e => o(e.term, e.description));
        c.length > 0 && (s = s.concat(['Arguments:', i(c), '']));
        const u = t.visibleOptions(e).map(e => o(t.optionTerm(e), t.optionDescription(e)));
        u.length > 0 && (s = s.concat(['Options:', i(u), '']));
        const l = t.visibleCommands(e).map(e => o(t.subcommandTerm(e), t.subcommandDescription(e)));
        return l.length > 0 && (s = s.concat(['Commands:', i(l), ''])), s.join('\n');
      }
      padWidth(e, t) {
        return Math.max(
          t.longestOptionTermLength(e, t),
          t.longestSubcommandTermLength(e, t),
          t.longestArgumentTermLength(e, t)
        );
      }
      wrap(e, t, n, r = 40) {
        if (e.match(/[\n]\s+/)) return e;
        const o = t - n;
        if (o < r) return e;
        const i = e.substr(0, n),
          s = e.substr(n),
          a = ' '.repeat(n),
          c = new RegExp('.{1,' + (o - 1) + '}([\\s​]|$)|[^\\s​]+?([\\s​]|$)', 'g');
        return (
          i +
          (s.match(c) || [])
            .map((e, t) => ('\n' === e.slice(-1) && (e = e.slice(0, e.length - 1)), (t > 0 ? a : '') + e.trimRight()))
            .join('\n')
        );
      }
    }
    class o {
      constructor(e, t) {
        (this.flags = e),
          (this.description = t || ''),
          (this.required = e.includes('<')),
          (this.optional = e.includes('[')),
          (this.variadic = /\w\.\.\.[>\]]$/.test(e)),
          (this.mandatory = !1);
        const n = l(e);
        (this.short = n.shortFlag),
          (this.long = n.longFlag),
          (this.negate = !1),
          this.long && (this.negate = this.long.startsWith('--no-')),
          (this.defaultValue = void 0),
          (this.defaultValueDescription = void 0),
          (this.parseArg = void 0),
          (this.hidden = !1),
          (this.argChoices = void 0);
      }
      default(e, t) {
        return (this.defaultValue = e), (this.defaultValueDescription = t), this;
      }
      argParser(e) {
        return (this.parseArg = e), this;
      }
      makeOptionMandatory(e = !0) {
        return (this.mandatory = !!e), this;
      }
      hideHelp(e = !0) {
        return (this.hidden = !!e), this;
      }
      _concatValue(e, t) {
        return t !== this.defaultValue && Array.isArray(t) ? t.concat(e) : [e];
      }
      choices(e) {
        return (
          (this.argChoices = e),
          (this.parseArg = (t, n) => {
            if (!e.includes(t)) throw new s(`Allowed choices are ${e.join(', ')}.`);
            return this.variadic ? this._concatValue(t, n) : t;
          }),
          this
        );
      }
      name() {
        return this.long ? this.long.replace(/^--/, '') : this.short.replace(/^-/, '');
      }
      attributeName() {
        return this.name()
          .replace(/^no-/, '')
          .split('-')
          .reduce((e, t) => e + t[0].toUpperCase() + t.slice(1));
      }
      is(e) {
        return this.short === e || this.long === e;
      }
    }
    class i extends Error {
      constructor(e, t, n) {
        super(n),
          Error.captureStackTrace(this, this.constructor),
          (this.name = this.constructor.name),
          (this.code = t),
          (this.exitCode = e),
          (this.nestedError = void 0);
      }
    }
    class s extends i {
      constructor(e) {
        super(1, 'commander.invalidOptionArgument', e),
          Error.captureStackTrace(this, this.constructor),
          (this.name = this.constructor.name);
      }
    }
    class a extends n {
      constructor(e) {
        super(),
          (this.commands = []),
          (this.options = []),
          (this.parent = null),
          (this._allowUnknownOption = !1),
          (this._allowExcessArguments = !0),
          (this._args = []),
          (this.rawArgs = null),
          (this._scriptPath = null),
          (this._name = e || ''),
          (this._optionValues = {}),
          (this._storeOptionsAsProperties = !1),
          (this._actionResults = []),
          (this._actionHandler = null),
          (this._executableHandler = !1),
          (this._executableFile = null),
          (this._defaultCommandName = null),
          (this._exitCallback = null),
          (this._aliases = []),
          (this._combineFlagAndOptionalValue = !0),
          (this._description = ''),
          (this._argsDescription = void 0),
          (this._enablePositionalOptions = !1),
          (this._passThroughOptions = !1),
          (this._outputConfiguration = {
            writeOut: e => process.stdout.write(e),
            writeErr: e => process.stderr.write(e),
            getOutHelpWidth: () => (process.stdout.isTTY ? process.stdout.columns : void 0),
            getErrHelpWidth: () => (process.stderr.isTTY ? process.stderr.columns : void 0),
            outputError: (e, t) => t(e)
          }),
          (this._hidden = !1),
          (this._hasHelpOption = !0),
          (this._helpFlags = '-h, --help'),
          (this._helpDescription = 'display help for command'),
          (this._helpShortFlag = '-h'),
          (this._helpLongFlag = '--help'),
          (this._addImplicitHelpCommand = void 0),
          (this._helpCommandName = 'help'),
          (this._helpCommandnameAndArgs = 'help [command]'),
          (this._helpCommandDescription = 'display help for command'),
          (this._helpConfiguration = {});
      }
      command(e, t, n) {
        let r = t,
          o = n;
        'object' == typeof r && null !== r && ((o = r), (r = null)), (o = o || {});
        const i = e.split(/ +/),
          s = this.createCommand(i.shift());
        return (
          r && (s.description(r), (s._executableHandler = !0)),
          o.isDefault && (this._defaultCommandName = s._name),
          (s._outputConfiguration = this._outputConfiguration),
          (s._hidden = !(!o.noHelp && !o.hidden)),
          (s._hasHelpOption = this._hasHelpOption),
          (s._helpFlags = this._helpFlags),
          (s._helpDescription = this._helpDescription),
          (s._helpShortFlag = this._helpShortFlag),
          (s._helpLongFlag = this._helpLongFlag),
          (s._helpCommandName = this._helpCommandName),
          (s._helpCommandnameAndArgs = this._helpCommandnameAndArgs),
          (s._helpCommandDescription = this._helpCommandDescription),
          (s._helpConfiguration = this._helpConfiguration),
          (s._exitCallback = this._exitCallback),
          (s._storeOptionsAsProperties = this._storeOptionsAsProperties),
          (s._combineFlagAndOptionalValue = this._combineFlagAndOptionalValue),
          (s._allowExcessArguments = this._allowExcessArguments),
          (s._enablePositionalOptions = this._enablePositionalOptions),
          (s._executableFile = o.executableFile || null),
          this.commands.push(s),
          s._parseExpectedArgs(i),
          (s.parent = this),
          r ? this : s
        );
      }
      createCommand(e) {
        return new a(e);
      }
      createHelp() {
        return Object.assign(new r(), this.configureHelp());
      }
      configureHelp(e) {
        return void 0 === e ? this._helpConfiguration : ((this._helpConfiguration = e), this);
      }
      configureOutput(e) {
        return void 0 === e ? this._outputConfiguration : (Object.assign(this._outputConfiguration, e), this);
      }
      addCommand(e, t) {
        if (!e._name) throw new Error('Command passed to .addCommand() must have a name');
        return (
          (function e(t) {
            t.forEach(t => {
              if (t._executableHandler && !t._executableFile)
                throw new Error('Must specify executableFile for deeply nested executable: ' + t.name());
              e(t.commands);
            });
          })(e.commands),
          (t = t || {}).isDefault && (this._defaultCommandName = e._name),
          (t.noHelp || t.hidden) && (e._hidden = !0),
          this.commands.push(e),
          (e.parent = this),
          this
        );
      }
      arguments(e) {
        return this._parseExpectedArgs(e.split(/ +/));
      }
      addHelpCommand(e, t) {
        return (
          !1 === e
            ? (this._addImplicitHelpCommand = !1)
            : ((this._addImplicitHelpCommand = !0),
              'string' == typeof e && ((this._helpCommandName = e.split(' ')[0]), (this._helpCommandnameAndArgs = e)),
              (this._helpCommandDescription = t || this._helpCommandDescription)),
          this
        );
      }
      _hasImplicitHelpCommand() {
        return void 0 === this._addImplicitHelpCommand
          ? this.commands.length && !this._actionHandler && !this._findCommand('help')
          : this._addImplicitHelpCommand;
      }
      _parseExpectedArgs(e) {
        if (e.length)
          return (
            e.forEach(e => {
              const t = { required: !1, name: '', variadic: !1 };
              switch (e[0]) {
                case '<':
                  (t.required = !0), (t.name = e.slice(1, -1));
                  break;
                case '[':
                  t.name = e.slice(1, -1);
              }
              t.name.length > 3 && '...' === t.name.slice(-3) && ((t.variadic = !0), (t.name = t.name.slice(0, -3))),
                t.name && this._args.push(t);
            }),
            this._args.forEach((e, t) => {
              if (e.variadic && t < this._args.length - 1)
                throw new Error(`only the last argument can be variadic '${e.name}'`);
            }),
            this
          );
      }
      exitOverride(e) {
        return (
          (this._exitCallback =
            e ||
            (e => {
              if ('commander.executeSubCommandAsync' !== e.code) throw e;
            })),
          this
        );
      }
      _exit(e, t, n) {
        this._exitCallback && this._exitCallback(new i(e, t, n)), process.exit(e);
      }
      action(e) {
        return (
          (this._actionHandler = t => {
            const n = this._args.length,
              r = t.slice(0, n);
            this._storeOptionsAsProperties ? (r[n] = this) : (r[n] = this.opts()), r.push(this);
            const o = e.apply(this, r);
            let i = this;
            for (; i.parent; ) i = i.parent;
            i._actionResults.push(o);
          }),
          this
        );
      }
      createOption(e, t) {
        return new o(e, t);
      }
      addOption(e) {
        const t = e.name(),
          n = e.attributeName();
        let r = e.defaultValue;
        if (e.negate || e.optional || e.required || 'boolean' == typeof r) {
          if (e.negate) {
            const t = e.long.replace(/^--no-/, '--');
            r = !this._findOption(t) || this._getOptionValue(n);
          }
          void 0 !== r && this._setOptionValue(n, r);
        }
        return (
          this.options.push(e),
          this.on('option:' + t, t => {
            const o = this._getOptionValue(n);
            if (null !== t && e.parseArg)
              try {
                t = e.parseArg(t, void 0 === o ? r : o);
              } catch (n) {
                if ('commander.invalidOptionArgument' === n.code) {
                  const r = `error: option '${e.flags}' argument '${t}' is invalid. ${n.message}`;
                  this._displayError(n.exitCode, n.code, r);
                }
                throw n;
              }
            else null !== t && e.variadic && (t = e._concatValue(t, o));
            'boolean' == typeof o || void 0 === o
              ? null == t
                ? this._setOptionValue(n, !e.negate && (r || !0))
                : this._setOptionValue(n, t)
              : null !== t && this._setOptionValue(n, !e.negate && t);
          }),
          this
        );
      }
      _optionEx(e, t, n, r, o) {
        const i = this.createOption(t, n);
        if ((i.makeOptionMandatory(!!e.mandatory), 'function' == typeof r)) i.default(o).argParser(r);
        else if (r instanceof RegExp) {
          const e = r;
          (r = (t, n) => {
            const r = e.exec(t);
            return r ? r[0] : n;
          }),
            i.default(o).argParser(r);
        } else i.default(r);
        return this.addOption(i);
      }
      option(e, t, n, r) {
        return this._optionEx({}, e, t, n, r);
      }
      requiredOption(e, t, n, r) {
        return this._optionEx({ mandatory: !0 }, e, t, n, r);
      }
      combineFlagAndOptionalValue(e = !0) {
        return (this._combineFlagAndOptionalValue = !!e), this;
      }
      allowUnknownOption(e = !0) {
        return (this._allowUnknownOption = !!e), this;
      }
      allowExcessArguments(e = !0) {
        return (this._allowExcessArguments = !!e), this;
      }
      enablePositionalOptions(e = !0) {
        return (this._enablePositionalOptions = !!e), this;
      }
      passThroughOptions(e = !0) {
        if (((this._passThroughOptions = !!e), this.parent && e && !this.parent._enablePositionalOptions))
          throw new Error(
            'passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)'
          );
        return this;
      }
      storeOptionsAsProperties(e = !0) {
        if (((this._storeOptionsAsProperties = !!e), this.options.length))
          throw new Error('call .storeOptionsAsProperties() before adding options');
        return this;
      }
      _setOptionValue(e, t) {
        this._storeOptionsAsProperties ? (this[e] = t) : (this._optionValues[e] = t);
      }
      _getOptionValue(e) {
        return this._storeOptionsAsProperties ? this[e] : this._optionValues[e];
      }
      parse(e, t) {
        if (void 0 !== e && !Array.isArray(e)) throw new Error('first parameter to parse must be array or undefined');
        let n;
        switch (
          ((t = t || {}),
          void 0 === e && ((e = process.argv), process.versions && process.versions.electron && (t.from = 'electron')),
          (this.rawArgs = e.slice()),
          t.from)
        ) {
          case void 0:
          case 'node':
            (this._scriptPath = e[1]), (n = e.slice(2));
            break;
          case 'electron':
            process.defaultApp ? ((this._scriptPath = e[1]), (n = e.slice(2))) : (n = e.slice(1));
            break;
          case 'user':
            n = e.slice(0);
            break;
          default:
            throw new Error(`unexpected parse option { from: '${t.from}' }`);
        }
        return (
          !this._scriptPath && require.main && (this._scriptPath = require.main.filename),
          (this._name =
            this._name ||
            (this._scriptPath && m.default.basename(this._scriptPath, m.default.extname(this._scriptPath)))),
          this._parseCommand([], n),
          this
        );
      }
      parseAsync(e, t) {
        return this.parse(e, t), Promise.all(this._actionResults).then(() => this);
      }
      _executeSubCommand(e, t) {
        t = t.slice();
        let n = !1;
        const r = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
        this._checkForMissingMandatoryOptions();
        let o,
          s = this._scriptPath;
        !s && require.main && (s = require.main.filename);
        try {
          const e = y.default.realpathSync(s);
          o = m.default.dirname(e);
        } catch (e) {
          o = '.';
        }
        let a = m.default.basename(s, m.default.extname(s)) + '-' + e._name;
        e._executableFile && (a = e._executableFile);
        const c = m.default.join(o, a);
        let u;
        y.default.existsSync(c)
          ? (a = c)
          : r.forEach(e => {
              y.default.existsSync(`${c}${e}`) && (a = `${c}${e}`);
            }),
          (n = r.includes(m.default.extname(a))),
          'win32' !== process.platform
            ? n
              ? (t.unshift(a),
                (t = h(process.execArgv).concat(t)),
                (u = g.default.spawn(process.argv[0], t, { stdio: 'inherit' })))
              : (u = g.default.spawn(a, t, { stdio: 'inherit' }))
            : (t.unshift(a),
              (t = h(process.execArgv).concat(t)),
              (u = g.default.spawn(process.execPath, t, { stdio: 'inherit' })));
        ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'].forEach(e => {
          process.on(e, () => {
            !1 === u.killed && null === u.exitCode && u.kill(e);
          });
        });
        const l = this._exitCallback;
        l
          ? u.on('close', () => {
              l(new i(process.exitCode || 0, 'commander.executeSubCommandAsync', '(close)'));
            })
          : u.on('close', process.exit.bind(process)),
          u.on('error', t => {
            if ('ENOENT' === t.code) {
              const t = `'${a}' does not exist\n - if '${e._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead\n - if the default executable name is not suitable, use the executableFile option to supply a custom name`;
              throw new Error(t);
            }
            if ('EACCES' === t.code) throw new Error(`'${a}' not executable`);
            if (l) {
              const e = new i(1, 'commander.executeSubCommandAsync', '(error)');
              (e.nestedError = t), l(e);
            } else process.exit(1);
          }),
          (this.runningCommand = u);
      }
      _dispatchSubcommand(e, t, n) {
        const r = this._findCommand(e);
        r || this.help({ error: !0 }),
          r._executableHandler ? this._executeSubCommand(r, t.concat(n)) : r._parseCommand(t, n);
      }
      _parseCommand(e, t) {
        const n = this.parseOptions(t);
        if (((e = e.concat(n.operands)), (t = n.unknown), (this.args = e.concat(t)), e && this._findCommand(e[0])))
          this._dispatchSubcommand(e[0], e.slice(1), t);
        else if (this._hasImplicitHelpCommand() && e[0] === this._helpCommandName)
          1 === e.length ? this.help() : this._dispatchSubcommand(e[1], [], [this._helpLongFlag]);
        else if (this._defaultCommandName) c(this, t), this._dispatchSubcommand(this._defaultCommandName, e, t);
        else {
          !this.commands.length ||
            0 !== this.args.length ||
            this._actionHandler ||
            this._defaultCommandName ||
            this.help({ error: !0 }),
            c(this, n.unknown),
            this._checkForMissingMandatoryOptions();
          const r = () => {
              n.unknown.length > 0 && this.unknownOption(n.unknown[0]);
            },
            o = 'command:' + this.name();
          if (this._actionHandler) {
            r();
            const n = this.args.slice();
            this._args.forEach((e, t) => {
              e.required && null == n[t]
                ? this.missingArgument(e.name)
                : e.variadic && ((n[t] = n.splice(t)), (n.length = Math.min(t + 1, n.length)));
            }),
              n.length > this._args.length && this._excessArguments(n),
              this._actionHandler(n),
              this.parent && this.parent.emit(o, e, t);
          } else
            this.parent && this.parent.listenerCount(o)
              ? (r(), this.parent.emit(o, e, t))
              : e.length
              ? this._findCommand('*')
                ? this._dispatchSubcommand('*', e, t)
                : this.listenerCount('command:*')
                ? this.emit('command:*', e, t)
                : this.commands.length
                ? this.unknownCommand()
                : r()
              : this.commands.length
              ? this.help({ error: !0 })
              : r();
        }
      }
      _findCommand(e) {
        if (e) return this.commands.find(t => t._name === e || t._aliases.includes(e));
      }
      _findOption(e) {
        return this.options.find(t => t.is(e));
      }
      _checkForMissingMandatoryOptions() {
        for (let e = this; e; e = e.parent)
          e.options.forEach(t => {
            t.mandatory && void 0 === e._getOptionValue(t.attributeName()) && e.missingMandatoryOptionValue(t);
          });
      }
      parseOptions(e) {
        const t = [],
          n = [];
        let r = t;
        const o = e.slice();
        function i(e) {
          return e.length > 1 && '-' === e[0];
        }
        let s = null;
        for (; o.length; ) {
          const e = o.shift();
          if ('--' === e) {
            r === n && r.push(e), r.push(...o);
            break;
          }
          if (!s || i(e)) {
            if (((s = null), i(e))) {
              const t = this._findOption(e);
              if (t) {
                if (t.required) {
                  const e = o.shift();
                  void 0 === e && this.optionMissingArgument(t), this.emit('option:' + t.name(), e);
                } else if (t.optional) {
                  let e = null;
                  o.length > 0 && !i(o[0]) && (e = o.shift()), this.emit('option:' + t.name(), e);
                } else this.emit('option:' + t.name());
                s = t.variadic ? t : null;
                continue;
              }
            }
            if (e.length > 2 && '-' === e[0] && '-' !== e[1]) {
              const t = this._findOption('-' + e[1]);
              if (t) {
                t.required || (t.optional && this._combineFlagAndOptionalValue)
                  ? this.emit('option:' + t.name(), e.slice(2))
                  : (this.emit('option:' + t.name()), o.unshift('-' + e.slice(2)));
                continue;
              }
            }
            if (/^--[^=]+=/.test(e)) {
              const t = e.indexOf('='),
                n = this._findOption(e.slice(0, t));
              if (n && (n.required || n.optional)) {
                this.emit('option:' + n.name(), e.slice(t + 1));
                continue;
              }
            }
            if (
              (i(e) && (r = n),
              (this._enablePositionalOptions || this._passThroughOptions) && 0 === t.length && 0 === n.length)
            ) {
              if (this._findCommand(e)) {
                t.push(e), o.length > 0 && n.push(...o);
                break;
              }
              if (e === this._helpCommandName && this._hasImplicitHelpCommand()) {
                t.push(e), o.length > 0 && t.push(...o);
                break;
              }
              if (this._defaultCommandName) {
                n.push(e), o.length > 0 && n.push(...o);
                break;
              }
            }
            if (this._passThroughOptions) {
              r.push(e), o.length > 0 && r.push(...o);
              break;
            }
            r.push(e);
          } else this.emit('option:' + s.name(), e);
        }
        return { operands: t, unknown: n };
      }
      opts() {
        if (this._storeOptionsAsProperties) {
          const e = {},
            t = this.options.length;
          for (let n = 0; n < t; n++) {
            const t = this.options[n].attributeName();
            e[t] = t === this._versionOptionName ? this._version : this[t];
          }
          return e;
        }
        return this._optionValues;
      }
      _displayError(e, t, n) {
        this._outputConfiguration.outputError(n + '\n', this._outputConfiguration.writeErr), this._exit(e, t, n);
      }
      missingArgument(e) {
        const t = `error: missing required argument '${e}'`;
        this._displayError(1, 'commander.missingArgument', t);
      }
      optionMissingArgument(e) {
        const t = `error: option '${e.flags}' argument missing`;
        this._displayError(1, 'commander.optionMissingArgument', t);
      }
      missingMandatoryOptionValue(e) {
        const t = `error: required option '${e.flags}' not specified`;
        this._displayError(1, 'commander.missingMandatoryOptionValue', t);
      }
      unknownOption(e) {
        if (this._allowUnknownOption) return;
        const t = `error: unknown option '${e}'`;
        this._displayError(1, 'commander.unknownOption', t);
      }
      _excessArguments(e) {
        if (this._allowExcessArguments) return;
        const t = this._args.length,
          n = 1 === t ? '' : 's',
          r = `error: too many arguments${
            this.parent ? ` for '${this.name()}'` : ''
          }. Expected ${t} argument${n} but got ${e.length}.`;
        this._displayError(1, 'commander.excessArguments', r);
      }
      unknownCommand() {
        const e = [this.name()];
        for (let t = this.parent; t; t = t.parent) e.unshift(t.name());
        const t = e.join(' '),
          n =
            `error: unknown command '${this.args[0]}'.` +
            (this._hasHelpOption ? ` See '${t} ${this._helpLongFlag}'.` : '');
        this._displayError(1, 'commander.unknownCommand', n);
      }
      version(e, t, n) {
        if (void 0 === e) return this._version;
        (this._version = e), (t = t || '-V, --version'), (n = n || 'output the version number');
        const r = this.createOption(t, n);
        return (
          (this._versionOptionName = r.attributeName()),
          this.options.push(r),
          this.on('option:' + r.name(), () => {
            this._outputConfiguration.writeOut(e + '\n'), this._exit(0, 'commander.version', e);
          }),
          this
        );
      }
      description(e, t) {
        return void 0 === e && void 0 === t
          ? this._description
          : ((this._description = e), (this._argsDescription = t), this);
      }
      alias(e) {
        if (void 0 === e) return this._aliases[0];
        let t = this;
        if (
          (0 !== this.commands.length &&
            this.commands[this.commands.length - 1]._executableHandler &&
            (t = this.commands[this.commands.length - 1]),
          e === t._name)
        )
          throw new Error("Command alias can't be the same as its name");
        return t._aliases.push(e), this;
      }
      aliases(e) {
        return void 0 === e ? this._aliases : (e.forEach(e => this.alias(e)), this);
      }
      usage(e) {
        if (void 0 === e) {
          if (this._usage) return this._usage;
          const e = this._args.map(e => u(e));
          return []
            .concat(
              this.options.length || this._hasHelpOption ? '[options]' : [],
              this.commands.length ? '[command]' : [],
              this._args.length ? e : []
            )
            .join(' ');
        }
        return (this._usage = e), this;
      }
      name(e) {
        return void 0 === e ? this._name : ((this._name = e), this);
      }
      helpInformation(e) {
        const t = this.createHelp();
        return (
          void 0 === t.helpWidth &&
            (t.helpWidth =
              e && e.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth()),
          t.formatHelp(this, t)
        );
      }
      _getHelpContext(e) {
        const t = { error: !!(e = e || {}).error };
        let n;
        return (
          (n = t.error ? e => this._outputConfiguration.writeErr(e) : e => this._outputConfiguration.writeOut(e)),
          (t.write = e.write || n),
          (t.command = this),
          t
        );
      }
      outputHelp(e) {
        let t;
        'function' == typeof e && ((t = e), (e = void 0));
        const n = this._getHelpContext(e),
          r = [];
        let o = this;
        for (; o; ) r.push(o), (o = o.parent);
        r
          .slice()
          .reverse()
          .forEach(e => e.emit('beforeAllHelp', n)),
          this.emit('beforeHelp', n);
        let i = this.helpInformation(n);
        if (t && ((i = t(i)), 'string' != typeof i && !Buffer.isBuffer(i)))
          throw new Error('outputHelp callback must return a string or a Buffer');
        n.write(i), this.emit(this._helpLongFlag), this.emit('afterHelp', n), r.forEach(e => e.emit('afterAllHelp', n));
      }
      helpOption(e, t) {
        if ('boolean' == typeof e) return (this._hasHelpOption = e), this;
        (this._helpFlags = e || this._helpFlags), (this._helpDescription = t || this._helpDescription);
        const n = l(this._helpFlags);
        return (this._helpShortFlag = n.shortFlag), (this._helpLongFlag = n.longFlag), this;
      }
      help(e) {
        this.outputHelp(e);
        let t = process.exitCode || 0;
        0 === t && e && 'function' != typeof e && e.error && (t = 1), this._exit(t, 'commander.help', '(outputHelp)');
      }
      addHelpText(e, t) {
        const n = ['beforeAll', 'before', 'after', 'afterAll'];
        if (!n.includes(e))
          throw new Error(`Unexpected value for position to addHelpText.\nExpecting one of '${n.join("', '")}'`);
        const r = e + 'Help';
        return (
          this.on(r, e => {
            let n;
            (n = 'function' == typeof t ? t({ error: e.error, command: e.command }) : t), n && e.write(n + '\n');
          }),
          this
        );
      }
    }
    function c(e, t) {
      e._hasHelpOption &&
        t.find(t => t === e._helpLongFlag || t === e._helpShortFlag) &&
        (e.outputHelp(), e._exit(0, 'commander.helpDisplayed', '(outputHelp)'));
    }
    function u(e) {
      const t = e.name + (!0 === e.variadic ? '...' : '');
      return e.required ? '<' + t + '>' : '[' + t + ']';
    }
    function l(e) {
      let t, n;
      const r = e.split(/[ |,]+/);
      return (
        r.length > 1 && !/^[[<]/.test(r[1]) && (t = r.shift()),
        (n = r.shift()),
        !t && /^-[^-]$/.test(n) && ((t = n), (n = void 0)),
        { shortFlag: t, longFlag: n }
      );
    }
    function h(e) {
      return e.map(e => {
        if (!e.startsWith('--inspect')) return e;
        let t,
          n,
          r = '127.0.0.1',
          o = '9229';
        return (
          null !== (n = e.match(/^(--inspect(-brk)?)$/))
            ? (t = n[1])
            : null !== (n = e.match(/^(--inspect(-brk|-port)?)=([^:]+)$/))
            ? ((t = n[1]), /^\d+$/.test(n[3]) ? (o = n[3]) : (r = n[3]))
            : null !== (n = e.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) &&
              ((t = n[1]), (r = n[3]), (o = n[4])),
          t && '0' !== o ? `${t}=${r}:${parseInt(o) + 1}` : e
        );
      });
    }
    ((t = e.exports = new a()).program = t),
      (t.Command = a),
      (t.Option = o),
      (t.CommanderError = i),
      (t.InvalidOptionArgumentError = s),
      (t.Help = r);
  }),
  S = P(function (e, t) {
    function n(e) {
      return 'string' == typeof e || e instanceof String;
    }
    function r(e) {
      return 'function' == typeof e;
    }
    function o(e) {
      return Array.isArray(e);
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.thenable = t.typedArray = t.stringArray = t.array = t.func = t.error = t.number = t.string = t.boolean = void 0),
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
      (t.func = r),
      (t.array = o),
      (t.stringArray = function (e) {
        return o(e) && e.every(e => n(e));
      }),
      (t.typedArray = function (e, t) {
        return Array.isArray(e) && e.every(t);
      }),
      (t.thenable = function (e) {
        return e && r(e.then);
      });
  });
let E;
function q() {
  if (void 0 === E) throw new Error('No runtime abstraction layer installed');
  return E;
}
!(function (e) {
  e.install = function (e) {
    if (void 0 === e) throw new Error('No runtime abstraction layer provided');
    E = e;
  };
})(q || (q = {}));
var D = q,
  M = Object.defineProperty({ default: D }, '__esModule', { value: !0 }),
  j = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.Disposable = void 0),
      ((t.Disposable || (t.Disposable = {})).create = function (e) {
        return { dispose: e };
      });
  }),
  N = P(function (e, t) {
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
          r = 0;
        e: for (; t < this._chunks.length; ) {
          const o = this._chunks[t];
          for (n = 0; n < o.length; ) {
            switch (o[n]) {
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
          (r += o.byteLength), t++;
        }
        if (4 !== e) return;
        const o = this._read(r + n),
          i = new Map(),
          s = this.toString(o, 'ascii').split('\r\n');
        if (s.length < 2) return i;
        for (let e = 0; e < s.length - 2; e++) {
          const t = s[e],
            n = t.indexOf(':');
          if (-1 === n) throw new Error('Message header must separate key and value using :');
          const r = t.substr(0, n),
            o = t.substr(n + 1).trim();
          i.set(r, o);
        }
        return i;
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
          const r = this._chunks[0];
          if (r.byteLength > e) {
            const o = r.slice(0, e);
            t.set(o, n), (n += e), (this._chunks[0] = r.slice(e)), (this._totalLength -= e), (e -= e);
          } else
            t.set(r, n),
              (n += r.byteLength),
              this._chunks.shift(),
              (this._totalLength -= r.byteLength),
              (e -= r.byteLength);
        }
        return t;
      }
    };
  });
class A extends N.AbstractMessageBuffer {
  constructor(e = 'utf-8') {
    super(e);
  }
  emptyBuffer() {
    return A.emptyBuffer;
  }
  fromString(e, t) {
    return Buffer.from(e, t);
  }
  toString(e, t) {
    return e instanceof Buffer ? e.toString(t) : new v.default.TextDecoder(t).decode(e);
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
A.emptyBuffer = Buffer.allocUnsafe(0);
class F {
  constructor(e) {
    this.stream = e;
  }
  onClose(e) {
    return this.stream.on('close', e), j.Disposable.create(() => this.stream.off('close', e));
  }
  onError(e) {
    return this.stream.on('error', e), j.Disposable.create(() => this.stream.off('error', e));
  }
  onEnd(e) {
    return this.stream.on('end', e), j.Disposable.create(() => this.stream.off('end', e));
  }
  onData(e) {
    return this.stream.on('data', e), j.Disposable.create(() => this.stream.off('data', e));
  }
}
class I {
  constructor(e) {
    this.stream = e;
  }
  onClose(e) {
    return this.stream.on('close', e), j.Disposable.create(() => this.stream.off('close', e));
  }
  onError(e) {
    return this.stream.on('error', e), j.Disposable.create(() => this.stream.off('error', e));
  }
  onEnd(e) {
    return this.stream.on('end', e), j.Disposable.create(() => this.stream.off('end', e));
  }
  write(e, t) {
    return new Promise((n, r) => {
      const o = e => {
        null == e ? n() : r(e);
      };
      'string' == typeof e ? this.stream.write(e, t, o) : this.stream.write(e, o);
    });
  }
  end() {
    this.stream.end();
  }
}
const L = Object.freeze({
  messageBuffer: Object.freeze({ create: e => new A(e) }),
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
            : Promise.resolve(JSON.parse(new v.default.TextDecoder(t.charset).decode(e)));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    })
  }),
  stream: Object.freeze({ asReadableStream: e => new F(e), asWritableStream: e => new I(e) }),
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
function W() {
  return L;
}
!(function (e) {
  e.install = function () {
    M.default.install(L);
  };
})(W || (W = {}));
var $,
  H,
  B,
  U,
  z,
  V,
  G,
  K,
  J,
  Y,
  Q,
  X,
  Z,
  ee,
  te,
  ne,
  re,
  oe,
  ie,
  se,
  ae,
  ce,
  ue,
  le,
  he,
  de,
  fe = W,
  pe = Object.defineProperty({ default: fe }, '__esModule', { value: !0 }),
  ge = P(function (e, t) {
    function n(e) {
      return 'string' == typeof e || e instanceof String;
    }
    function r(e) {
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
      (t.array = r),
      (t.stringArray = function (e) {
        return r(e) && e.every(e => n(e));
      });
  }),
  me = P(function (e, t) {
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
    class r extends Error {
      constructor(e, t, o) {
        super(t),
          (this.code = ge.number(e) ? e : n.UnknownErrorCode),
          (this.data = o),
          Object.setPrototypeOf(this, r.prototype);
      }
      toJson() {
        return { code: this.code, message: this.message, data: this.data };
      }
    }
    t.ResponseError = r;
    class o {
      constructor(e) {
        this.kind = e;
      }
      static is(e) {
        return e === o.auto || e === o.byName || e === o.byPosition;
      }
      toString() {
        return this.kind;
      }
    }
    (t.ParameterStructures = o),
      (o.auto = new o('auto')),
      (o.byPosition = new o('byPosition')),
      (o.byName = new o('byName'));
    class i {
      constructor(e, t) {
        (this.method = e), (this.numberOfParams = t);
      }
      get parameterStructures() {
        return o.auto;
      }
    }
    t.AbstractMessageSignature = i;
    t.RequestType0 = class extends i {
      constructor(e) {
        super(e, 0);
      }
    };
    t.RequestType = class extends i {
      constructor(e, t = o.auto) {
        super(e, 1), (this._parameterStructures = t);
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    t.RequestType1 = class extends i {
      constructor(e, t = o.auto) {
        super(e, 1), (this._parameterStructures = t);
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    t.RequestType2 = class extends i {
      constructor(e) {
        super(e, 2);
      }
    };
    t.RequestType3 = class extends i {
      constructor(e) {
        super(e, 3);
      }
    };
    t.RequestType4 = class extends i {
      constructor(e) {
        super(e, 4);
      }
    };
    t.RequestType5 = class extends i {
      constructor(e) {
        super(e, 5);
      }
    };
    t.RequestType6 = class extends i {
      constructor(e) {
        super(e, 6);
      }
    };
    t.RequestType7 = class extends i {
      constructor(e) {
        super(e, 7);
      }
    };
    t.RequestType8 = class extends i {
      constructor(e) {
        super(e, 8);
      }
    };
    t.RequestType9 = class extends i {
      constructor(e) {
        super(e, 9);
      }
    };
    t.NotificationType = class extends i {
      constructor(e, t = o.auto) {
        super(e, 1), (this._parameterStructures = t);
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    t.NotificationType0 = class extends i {
      constructor(e) {
        super(e, 0);
      }
    };
    t.NotificationType1 = class extends i {
      constructor(e, t = o.auto) {
        super(e, 1), (this._parameterStructures = t);
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    t.NotificationType2 = class extends i {
      constructor(e) {
        super(e, 2);
      }
    };
    t.NotificationType3 = class extends i {
      constructor(e) {
        super(e, 3);
      }
    };
    t.NotificationType4 = class extends i {
      constructor(e) {
        super(e, 4);
      }
    };
    t.NotificationType5 = class extends i {
      constructor(e) {
        super(e, 5);
      }
    };
    t.NotificationType6 = class extends i {
      constructor(e) {
        super(e, 6);
      }
    };
    t.NotificationType7 = class extends i {
      constructor(e) {
        super(e, 7);
      }
    };
    t.NotificationType8 = class extends i {
      constructor(e) {
        super(e, 8);
      }
    };
    (t.NotificationType9 = class extends i {
      constructor(e) {
        super(e, 9);
      }
    }),
      (t.isRequestMessage = function (e) {
        const t = e;
        return t && ge.string(t.method) && (ge.string(t.id) || ge.number(t.id));
      }),
      (t.isNotificationMessage = function (e) {
        const t = e;
        return t && ge.string(t.method) && void 0 === e.id;
      }),
      (t.isResponseMessage = function (e) {
        const t = e;
        return t && (void 0 !== t.result || !!t.error) && (ge.string(t.id) || ge.number(t.id) || null === t.id);
      });
  }),
  ye = P(function (e, t) {
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
        for (let r = 0, o = this._callbacks.length; r < o; r++)
          if (this._callbacks[r] === e) {
            if (this._contexts[r] === t) return this._callbacks.splice(r, 1), void this._contexts.splice(r, 1);
            n = !0;
          }
        if (n) throw new Error('When adding a listener with a context, you should remove it with the same context');
      }
      invoke(...e) {
        if (!this._callbacks) return [];
        const t = [],
          n = this._callbacks.slice(0),
          r = this._contexts.slice(0);
        for (let o = 0, i = n.length; o < i; o++)
          try {
            t.push(n[o].apply(r[o], e));
          } catch (e) {
            M.default().console.error(e);
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
    class r {
      constructor(e) {
        this._options = e;
      }
      get event() {
        return (
          this._event ||
            (this._event = (e, t, o) => {
              this._callbacks || (this._callbacks = new n()),
                this._options &&
                  this._options.onFirstListenerAdd &&
                  this._callbacks.isEmpty() &&
                  this._options.onFirstListenerAdd(this),
                this._callbacks.add(e, t);
              const i = {
                dispose: () => {
                  this._callbacks &&
                    (this._callbacks.remove(e, t),
                    (i.dispose = r._noop),
                    this._options &&
                      this._options.onLastListenerRemove &&
                      this._callbacks.isEmpty() &&
                      this._options.onLastListenerRemove(this));
                }
              };
              return Array.isArray(o) && o.push(i), i;
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
    (t.Emitter = r), (r._noop = function () {});
  }),
  ve = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.CancellationTokenSource = t.CancellationToken = void 0),
      (function (e) {
        (e.None = Object.freeze({ isCancellationRequested: !1, onCancellationRequested: ye.Event.None })),
          (e.Cancelled = Object.freeze({ isCancellationRequested: !0, onCancellationRequested: ye.Event.None })),
          (e.is = function (t) {
            const n = t;
            return (
              n &&
              (n === e.None ||
                n === e.Cancelled ||
                (ge.boolean(n.isCancellationRequested) && !!n.onCancellationRequested))
            );
          });
      })((n = t.CancellationToken || (t.CancellationToken = {})));
    const r = Object.freeze(function (e, t) {
      const n = M.default().timer.setTimeout(e.bind(t), 0);
      return {
        dispose() {
          M.default().timer.clearTimeout(n);
        }
      };
    });
    class o {
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
        return this._isCancelled ? r : (this._emitter || (this._emitter = new ye.Emitter()), this._emitter.event);
      }
      dispose() {
        this._emitter && (this._emitter.dispose(), (this._emitter = void 0));
      }
    }
    t.CancellationTokenSource = class {
      get token() {
        return this._token || (this._token = new o()), this._token;
      }
      cancel() {
        this._token ? this._token.cancel() : (this._token = n.Cancelled);
      }
      dispose() {
        this._token ? this._token instanceof o && this._token.dispose() : (this._token = n.None);
      }
    };
  }),
  be = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ReadableStreamMessageReader = t.AbstractMessageReader = t.MessageReader = void 0),
      ((t.MessageReader || (t.MessageReader = {})).is = function (e) {
        let t = e;
        return (
          t &&
          ge.func(t.listen) &&
          ge.func(t.dispose) &&
          ge.func(t.onError) &&
          ge.func(t.onClose) &&
          ge.func(t.onPartialMessage)
        );
      });
    class r {
      constructor() {
        (this.errorEmitter = new ye.Emitter()),
          (this.closeEmitter = new ye.Emitter()),
          (this.partialMessageEmitter = new ye.Emitter());
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
          : new Error('Reader received error. Reason: ' + (ge.string(e.message) ? e.message : 'unknown'));
      }
    }
    (t.AbstractMessageReader = r),
      (function (e) {
        e.fromOptions = function (e) {
          var t;
          let n, r;
          const o = new Map();
          let i;
          const s = new Map();
          if (void 0 === e || 'string' == typeof e) n = null != e ? e : 'utf-8';
          else {
            if (
              ((n = null !== (t = e.charset) && void 0 !== t ? t : 'utf-8'),
              void 0 !== e.contentDecoder && ((r = e.contentDecoder), o.set(r.name, r)),
              void 0 !== e.contentDecoders)
            )
              for (const t of e.contentDecoders) o.set(t.name, t);
            if (
              (void 0 !== e.contentTypeDecoder && ((i = e.contentTypeDecoder), s.set(i.name, i)),
              void 0 !== e.contentTypeDecoders)
            )
              for (const t of e.contentTypeDecoders) s.set(t.name, t);
          }
          return (
            void 0 === i && ((i = M.default().applicationJson.decoder), s.set(i.name, i)),
            { charset: n, contentDecoder: r, contentDecoders: o, contentTypeDecoder: i, contentTypeDecoders: s }
          );
        };
      })(n || (n = {}));
    t.ReadableStreamMessageReader = class extends r {
      constructor(e, t) {
        super(),
          (this.readable = e),
          (this.options = n.fromOptions(t)),
          (this.buffer = M.default().messageBuffer.create(this.options.charset)),
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
          (M.default().timer.clearTimeout(this.partialMessageTimer), (this.partialMessageTimer = void 0));
      }
      setPartialMessageTimer() {
        this.clearPartialMessageTimer(),
          this._partialMessageTimeout <= 0 ||
            (this.partialMessageTimer = M.default().timer.setTimeout(
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
  _e = P(function (e, t) {
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
          M.default().timer.setImmediate(() => this.doRunNext());
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
  we = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WriteableStreamMessageWriter = t.AbstractMessageWriter = t.MessageWriter = void 0);
    var n;
    (t.MessageWriter || (t.MessageWriter = {})).is = function (e) {
      let t = e;
      return t && ge.func(t.dispose) && ge.func(t.onClose) && ge.func(t.onError) && ge.func(t.write);
    };
    class r {
      constructor() {
        (this.errorEmitter = new ye.Emitter()), (this.closeEmitter = new ye.Emitter());
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
          : new Error('Writer received error. Reason: ' + (ge.string(e.message) ? e.message : 'unknown'));
      }
    }
    (t.AbstractMessageWriter = r),
      (function (e) {
        e.fromOptions = function (e) {
          var t, n;
          return void 0 === e || 'string' == typeof e
            ? { charset: null != e ? e : 'utf-8', contentTypeEncoder: M.default().applicationJson.encoder }
            : {
                charset: null !== (t = e.charset) && void 0 !== t ? t : 'utf-8',
                contentEncoder: e.contentEncoder,
                contentTypeEncoder:
                  null !== (n = e.contentTypeEncoder) && void 0 !== n ? n : M.default().applicationJson.encoder
              };
        };
      })(n || (n = {}));
    t.WriteableStreamMessageWriter = class extends r {
      constructor(e, t) {
        super(),
          (this.writable = e),
          (this.options = n.fromOptions(t)),
          (this.errorCount = 0),
          (this.writeSemaphore = new _e.Semaphore(1)),
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
  Re = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.LRUCache = t.LinkedMap = t.Touch = void 0),
      (function (e) {
        (e.None = 0), (e.First = 1), (e.AsOld = e.First), (e.Last = 2), (e.AsNew = e.Last);
      })((n = t.Touch || (t.Touch = {})));
    class r {
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
        const r = this._map.get(e);
        if (r) return t !== n.None && this.touch(r, t), r.value;
      }
      set(e, t, r = n.None) {
        let o = this._map.get(e);
        if (o) (o.value = t), r !== n.None && this.touch(o, r);
        else {
          switch (((o = { key: e, value: t, next: void 0, previous: void 0 }), r)) {
            case n.None:
              this.addItemLast(o);
              break;
            case n.First:
              this.addItemFirst(o);
              break;
            case n.Last:
            default:
              this.addItemLast(o);
          }
          this._map.set(e, o), this._size++;
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
        let r = this._head;
        for (; r; ) {
          if ((t ? e.bind(t)(r.value, r.key, this) : e(r.value, r.key, this), this._state !== n))
            throw new Error('LinkedMap got modified during iteration.');
          r = r.next;
        }
      }
      keys() {
        const e = this,
          t = this._state;
        let n = this._head;
        const r = {
          [Symbol.iterator]: () => r,
          next() {
            if (e._state !== t) throw new Error('LinkedMap got modified during iteration.');
            if (n) {
              const e = { value: n.key, done: !1 };
              return (n = n.next), e;
            }
            return { value: void 0, done: !0 };
          }
        };
        return r;
      }
      values() {
        const e = this,
          t = this._state;
        let n = this._head;
        const r = {
          [Symbol.iterator]: () => r,
          next() {
            if (e._state !== t) throw new Error('LinkedMap got modified during iteration.');
            if (n) {
              const e = { value: n.value, done: !1 };
              return (n = n.next), e;
            }
            return { value: void 0, done: !0 };
          }
        };
        return r;
      }
      entries() {
        const e = this,
          t = this._state;
        let n = this._head;
        const r = {
          [Symbol.iterator]: () => r,
          next() {
            if (e._state !== t) throw new Error('LinkedMap got modified during iteration.');
            if (n) {
              const e = { value: [n.key, n.value], done: !1 };
              return (n = n.next), e;
            }
            return { value: void 0, done: !0 };
          }
        };
        return r;
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
    t.LinkedMap = r;
    t.LRUCache = class extends r {
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
  ke = P(function (e, t) {
    var n, r, o, i, s, a, c, u, l, h, d, f, p;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createMessageConnection = t.ConnectionOptions = t.CancellationStrategy = t.CancellationSenderStrategy = t.CancellationReceiverStrategy = t.ConnectionStrategy = t.ConnectionError = t.ConnectionErrors = t.LogTraceNotification = t.SetTraceNotification = t.TraceFormat = t.Trace = t.NullLogger = t.ProgressType = void 0),
      (function (e) {
        e.type = new me.NotificationType('$/cancelRequest');
      })(n || (n = {})),
      (function (e) {
        e.type = new me.NotificationType('$/progress');
      })(r || (r = {}));
    (t.ProgressType = class {
      constructor() {}
    }),
      (function (e) {
        e.is = function (e) {
          return ge.func(e);
        };
      })(o || (o = {})),
      (t.NullLogger = Object.freeze({ error: () => {}, warn: () => {}, info: () => {}, log: () => {} })),
      (function (e) {
        (e[(e.Off = 0)] = 'Off'), (e[(e.Messages = 1)] = 'Messages'), (e[(e.Verbose = 2)] = 'Verbose');
      })((i = t.Trace || (t.Trace = {}))),
      (function (e) {
        (e.fromString = function (t) {
          if (!ge.string(t)) return e.Off;
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
      })((i = t.Trace || (t.Trace = {}))),
      (function (e) {
        (e.Text = 'text'), (e.JSON = 'json');
      })(t.TraceFormat || (t.TraceFormat = {})),
      (function (e) {
        e.fromString = function (t) {
          return 'json' === (t = t.toLowerCase()) ? e.JSON : e.Text;
        };
      })((s = t.TraceFormat || (t.TraceFormat = {}))),
      (function (e) {
        e.type = new me.NotificationType('$/setTrace');
      })((a = t.SetTraceNotification || (t.SetTraceNotification = {}))),
      (function (e) {
        e.type = new me.NotificationType('$/logTrace');
      })((c = t.LogTraceNotification || (t.LogTraceNotification = {}))),
      (function (e) {
        (e[(e.Closed = 1)] = 'Closed'),
          (e[(e.Disposed = 2)] = 'Disposed'),
          (e[(e.AlreadyListening = 3)] = 'AlreadyListening');
      })((u = t.ConnectionErrors || (t.ConnectionErrors = {})));
    class g extends Error {
      constructor(e, t) {
        super(t), (this.code = e), Object.setPrototypeOf(this, g.prototype);
      }
    }
    (t.ConnectionError = g),
      (function (e) {
        e.is = function (e) {
          const t = e;
          return t && ge.func(t.cancelUndispatched);
        };
      })((l = t.ConnectionStrategy || (t.ConnectionStrategy = {}))),
      (function (e) {
        (e.Message = Object.freeze({ createCancellationTokenSource: e => new ve.CancellationTokenSource() })),
          (e.is = function (e) {
            const t = e;
            return t && ge.func(t.createCancellationTokenSource);
          });
      })((h = t.CancellationReceiverStrategy || (t.CancellationReceiverStrategy = {}))),
      (function (e) {
        (e.Message = Object.freeze({
          sendCancellation(e, t) {
            e.sendNotification(n.type, { id: t });
          },
          cleanup(e) {}
        })),
          (e.is = function (e) {
            const t = e;
            return t && ge.func(t.sendCancellation) && ge.func(t.cleanup);
          });
      })((d = t.CancellationSenderStrategy || (t.CancellationSenderStrategy = {}))),
      (function (e) {
        (e.Message = Object.freeze({ receiver: h.Message, sender: d.Message })),
          (e.is = function (e) {
            const t = e;
            return t && h.is(t.receiver) && d.is(t.sender);
          });
      })((f = t.CancellationStrategy || (t.CancellationStrategy = {}))),
      ((t.ConnectionOptions || (t.ConnectionOptions = {})).is = function (e) {
        const t = e;
        return t && (f.is(t.cancellationStrategy) || l.is(t.connectionStrategy));
      }),
      (function (e) {
        (e[(e.New = 1)] = 'New'),
          (e[(e.Listening = 2)] = 'Listening'),
          (e[(e.Closed = 3)] = 'Closed'),
          (e[(e.Disposed = 4)] = 'Disposed');
      })(p || (p = {})),
      (t.createMessageConnection = function (e, l, h, d) {
        const m = void 0 !== h ? h : t.NullLogger;
        let y = 0,
          v = 0,
          b = 0;
        const _ = '2.0';
        let w = void 0;
        const R = Object.create(null);
        let k = void 0;
        const C = Object.create(null),
          O = new Map();
        let T,
          P,
          x = new Re.LinkedMap(),
          S = Object.create(null),
          E = Object.create(null),
          q = i.Off,
          D = s.Text,
          j = p.New;
        const N = new ye.Emitter(),
          A = new ye.Emitter(),
          F = new ye.Emitter(),
          I = new ye.Emitter(),
          L = new ye.Emitter(),
          W = d && d.cancellationStrategy ? d.cancellationStrategy : f.Message;
        function $(e) {
          if (null === e) throw new Error("Can't send requests with id null since the response can't be correlated.");
          return 'req-' + e.toString();
        }
        function H(e, t) {
          var n;
          me.isRequestMessage(t)
            ? e.set($(t.id), t)
            : me.isResponseMessage(t)
            ? e.set(null === (n = t.id) ? 'res-unknown-' + (++b).toString() : 'res-' + n.toString(), t)
            : e.set('not-' + (++v).toString(), t);
        }
        function B(e) {}
        function U() {
          return j === p.Listening;
        }
        function z() {
          return j === p.Closed;
        }
        function V() {
          return j === p.Disposed;
        }
        function G() {
          (j !== p.New && j !== p.Listening) || ((j = p.Closed), A.fire(void 0));
        }
        function K() {
          T ||
            0 === x.size ||
            (T = M.default().timer.setImmediate(() => {
              (T = void 0),
                (function () {
                  if (0 === x.size) return;
                  const e = x.shift();
                  try {
                    me.isRequestMessage(e)
                      ? (function (e) {
                          if (V()) return;
                          function t(t, n, r) {
                            const o = { jsonrpc: _, id: e.id };
                            t instanceof me.ResponseError
                              ? (o.error = t.toJson())
                              : (o.result = void 0 === t ? null : t),
                              Y(o, n, r),
                              l.write(o);
                          }
                          function n(t, n, r) {
                            const o = { jsonrpc: _, id: e.id, error: t.toJson() };
                            Y(o, n, r), l.write(o);
                          }
                          function r(t, n, r) {
                            void 0 === t && (t = null);
                            const o = { jsonrpc: _, id: e.id, result: t };
                            Y(o, n, r), l.write(o);
                          }
                          !(function (e) {
                            if (q === i.Off || !P) return;
                            if (D === s.Text) {
                              let t = void 0;
                              q === i.Verbose && e.params && (t = `Params: ${JSON.stringify(e.params, null, 4)}\n\n`),
                                P.log(`Received request '${e.method} - (${e.id})'.`, t);
                            } else Q('receive-request', e);
                          })(e);
                          const o = R[e.method];
                          let a, c;
                          o && ((a = o.type), (c = o.handler));
                          const u = Date.now();
                          if (c || w) {
                            const o = String(e.id),
                              i = W.receiver.createCancellationTokenSource(o);
                            E[o] = i;
                            try {
                              let s;
                              if (c)
                                if (void 0 === e.params) {
                                  if (void 0 !== a && 0 !== a.numberOfParams)
                                    return void n(
                                      new me.ResponseError(
                                        me.ErrorCodes.InvalidParams,
                                        `Request ${e.method} defines ${a.numberOfParams} params but recevied none.`
                                      ),
                                      e.method,
                                      u
                                    );
                                  s = c(i.token);
                                } else if (Array.isArray(e.params)) {
                                  if (void 0 !== a && a.parameterStructures === me.ParameterStructures.byName)
                                    return void n(
                                      new me.ResponseError(
                                        me.ErrorCodes.InvalidParams,
                                        `Request ${e.method} defines parameters by name but received parameters by position`
                                      ),
                                      e.method,
                                      u
                                    );
                                  s = c(...e.params, i.token);
                                } else {
                                  if (void 0 !== a && a.parameterStructures === me.ParameterStructures.byPosition)
                                    return void n(
                                      new me.ResponseError(
                                        me.ErrorCodes.InvalidParams,
                                        `Request ${e.method} defines parameters by position but received parameters by name`
                                      ),
                                      e.method,
                                      u
                                    );
                                  s = c(e.params, i.token);
                                }
                              else w && (s = w(e.method, e.params, i.token));
                              const l = s;
                              s
                                ? l.then
                                  ? l.then(
                                      n => {
                                        delete E[o], t(n, e.method, u);
                                      },
                                      t => {
                                        delete E[o],
                                          t instanceof me.ResponseError
                                            ? n(t, e.method, u)
                                            : t && ge.string(t.message)
                                            ? n(
                                                new me.ResponseError(
                                                  me.ErrorCodes.InternalError,
                                                  `Request ${e.method} failed with message: ${t.message}`
                                                ),
                                                e.method,
                                                u
                                              )
                                            : n(
                                                new me.ResponseError(
                                                  me.ErrorCodes.InternalError,
                                                  `Request ${e.method} failed unexpectedly without providing any details.`
                                                ),
                                                e.method,
                                                u
                                              );
                                      }
                                    )
                                  : (delete E[o], t(s, e.method, u))
                                : (delete E[o], r(s, e.method, u));
                            } catch (r) {
                              delete E[o],
                                r instanceof me.ResponseError
                                  ? t(r, e.method, u)
                                  : r && ge.string(r.message)
                                  ? n(
                                      new me.ResponseError(
                                        me.ErrorCodes.InternalError,
                                        `Request ${e.method} failed with message: ${r.message}`
                                      ),
                                      e.method,
                                      u
                                    )
                                  : n(
                                      new me.ResponseError(
                                        me.ErrorCodes.InternalError,
                                        `Request ${e.method} failed unexpectedly without providing any details.`
                                      ),
                                      e.method,
                                      u
                                    );
                            }
                          } else
                            n(
                              new me.ResponseError(me.ErrorCodes.MethodNotFound, 'Unhandled method ' + e.method),
                              e.method,
                              u
                            );
                        })(e)
                      : me.isNotificationMessage(e)
                      ? (function (e) {
                          if (V()) return;
                          let t,
                            r = void 0;
                          if (e.method === n.type.method)
                            t = e => {
                              const t = e.id,
                                n = E[String(t)];
                              n && n.cancel();
                            };
                          else {
                            const n = C[e.method];
                            n && ((t = n.handler), (r = n.type));
                          }
                          if (t || k)
                            try {
                              !(function (e) {
                                if (q === i.Off || !P || e.method === c.type.method) return;
                                if (D === s.Text) {
                                  let t = void 0;
                                  q === i.Verbose &&
                                    (t = e.params
                                      ? `Params: ${JSON.stringify(e.params, null, 4)}\n\n`
                                      : 'No parameters provided.\n\n'),
                                    P.log(`Received notification '${e.method}'.`, t);
                                } else Q('receive-notification', e);
                              })(e),
                                t
                                  ? void 0 === e.params
                                    ? (void 0 !== r &&
                                        0 !== r.numberOfParams &&
                                        r.parameterStructures !== me.ParameterStructures.byName &&
                                        m.error(
                                          `Notification ${e.method} defines ${r.numberOfParams} params but recevied none.`
                                        ),
                                      t())
                                    : Array.isArray(e.params)
                                    ? (void 0 !== r &&
                                        (r.parameterStructures === me.ParameterStructures.byName &&
                                          m.error(
                                            `Notification ${e.method} defines parameters by name but received parameters by position`
                                          ),
                                        r.numberOfParams !== e.params.length &&
                                          m.error(
                                            `Notification ${e.method} defines ${r.numberOfParams} params but received ${e.params.length} argumennts`
                                          )),
                                      t(...e.params))
                                    : (void 0 !== r &&
                                        r.parameterStructures === me.ParameterStructures.byPosition &&
                                        m.error(
                                          `Notification ${e.method} defines parameters by position but received parameters by name`
                                        ),
                                      t(e.params))
                                  : k && k(e.method, e.params);
                            } catch (t) {
                              t.message
                                ? m.error(`Notification handler '${e.method}' failed with message: ${t.message}`)
                                : m.error(`Notification handler '${e.method}' failed unexpectedly.`);
                            }
                          else F.fire(e);
                        })(e)
                      : me.isResponseMessage(e)
                      ? (function (e) {
                          if (V()) return;
                          if (null === e.id)
                            e.error
                              ? m.error(
                                  'Received response message without id: Error is: \n' +
                                    JSON.stringify(e.error, void 0, 4)
                                )
                              : m.error('Received response message without id. No further error information provided.');
                          else {
                            const t = String(e.id),
                              n = S[t];
                            if (
                              ((function (e, t) {
                                if (q === i.Off || !P) return;
                                if (D === s.Text) {
                                  let n = void 0;
                                  if (
                                    (q === i.Verbose &&
                                      (e.error && e.error.data
                                        ? (n = `Error data: ${JSON.stringify(e.error.data, null, 4)}\n\n`)
                                        : e.result
                                        ? (n = `Result: ${JSON.stringify(e.result, null, 4)}\n\n`)
                                        : void 0 === e.error && (n = 'No result returned.\n\n')),
                                    t)
                                  ) {
                                    const r = e.error ? ` Request failed: ${e.error.message} (${e.error.code}).` : '';
                                    P.log(
                                      `Received response '${t.method} - (${e.id})' in ${
                                        Date.now() - t.timerStart
                                      }ms.${r}`,
                                      n
                                    );
                                  } else P.log(`Received response ${e.id} without active response promise.`, n);
                                } else Q('receive-response', e);
                              })(e, n),
                              n)
                            ) {
                              delete S[t];
                              try {
                                if (e.error) {
                                  const t = e.error;
                                  n.reject(new me.ResponseError(t.code, t.message, t.data));
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
                          if (ge.string(t.id) || ge.number(t.id)) {
                            const e = String(t.id),
                              n = S[e];
                            n &&
                              n.reject(new Error('The received response has neither a result nor an error property.'));
                          }
                        })(e);
                  } finally {
                    K();
                  }
                })();
            }));
        }
        e.onClose(G),
          e.onError(function (e) {
            N.fire([e, void 0, void 0]);
          }),
          l.onClose(G),
          l.onError(function (e) {
            N.fire(e);
          });
        const J = e => {
          try {
            if (me.isNotificationMessage(e) && e.method === n.type.method) {
              const t = $(e.params.id),
                n = x.get(t);
              if (me.isRequestMessage(n)) {
                const r = null == d ? void 0 : d.connectionStrategy,
                  o = r && r.cancelUndispatched ? r.cancelUndispatched(n, B) : void 0;
                if (o && (void 0 !== o.error || void 0 !== o.result))
                  return x.delete(t), (o.id = n.id), Y(o, e.method, Date.now()), void l.write(o);
              }
            }
            H(x, e);
          } finally {
            K();
          }
        };
        function Y(e, t, n) {
          if (q !== i.Off && P)
            if (D === s.Text) {
              let r = void 0;
              q === i.Verbose &&
                (e.error && e.error.data
                  ? (r = `Error data: ${JSON.stringify(e.error.data, null, 4)}\n\n`)
                  : e.result
                  ? (r = `Result: ${JSON.stringify(e.result, null, 4)}\n\n`)
                  : void 0 === e.error && (r = 'No result returned.\n\n')),
                P.log(`Sending response '${t} - (${e.id})'. Processing request took ${Date.now() - n}ms`, r);
            } else Q('send-response', e);
        }
        function Q(e, t) {
          if (!P || q === i.Off) return;
          const n = { isLSPMessage: !0, type: e, message: t, timestamp: Date.now() };
          P.log(n);
        }
        function X() {
          if (z()) throw new g(u.Closed, 'Connection is closed.');
          if (V()) throw new g(u.Disposed, 'Connection is disposed.');
        }
        function Z(e) {
          return void 0 === e ? null : e;
        }
        function ee(e) {
          return null === e ? void 0 : e;
        }
        function te(e) {
          return null != e && !Array.isArray(e) && 'object' == typeof e;
        }
        function ne(e, t) {
          switch (e) {
            case me.ParameterStructures.auto:
              return te(t) ? ee(t) : [Z(t)];
            case me.ParameterStructures.byName:
              if (!te(t)) throw new Error('Recevied parameters by name but param is not an object literal.');
              return ee(t);
            case me.ParameterStructures.byPosition:
              return [Z(t)];
            default:
              throw new Error('Unknown parameter structure ' + e.toString());
          }
        }
        function re(e, t) {
          let n;
          const r = e.numberOfParams;
          switch (r) {
            case 0:
              n = void 0;
              break;
            case 1:
              n = ne(e.parameterStructures, t[0]);
              break;
            default:
              n = [];
              for (let e = 0; e < t.length && e < r; e++) n.push(Z(t[e]));
              if (t.length < r) for (let e = t.length; e < r; e++) n.push(null);
          }
          return n;
        }
        const oe = {
          sendNotification: (e, ...t) => {
            let n, r;
            if ((X(), ge.string(e))) {
              n = e;
              const o = t[0];
              let i = 0,
                s = me.ParameterStructures.auto;
              me.ParameterStructures.is(o) && ((i = 1), (s = o));
              let a = t.length;
              const c = a - i;
              switch (c) {
                case 0:
                  r = void 0;
                  break;
                case 1:
                  r = ne(s, t[i]);
                  break;
                default:
                  if (s === me.ParameterStructures.byName)
                    throw new Error(`Recevied ${c} parameters for 'by Name' notification parameter structure.`);
                  r = t.slice(i, a).map(e => Z(e));
              }
            } else {
              const o = t;
              (n = e.method), (r = re(e, o));
            }
            const o = { jsonrpc: _, method: n, params: r };
            !(function (e) {
              if (q !== i.Off && P)
                if (D === s.Text) {
                  let t = void 0;
                  q === i.Verbose &&
                    (t = e.params ? `Params: ${JSON.stringify(e.params, null, 4)}\n\n` : 'No parameters provided.\n\n'),
                    P.log(`Sending notification '${e.method}'.`, t);
                } else Q('send-notification', e);
            })(o),
              l.write(o);
          },
          onNotification: (e, t) => {
            let n;
            return (
              X(),
              ge.func(e)
                ? (k = e)
                : t &&
                  (ge.string(e)
                    ? ((n = e), (C[e] = { type: void 0, handler: t }))
                    : ((n = e.method), (C[e.method] = { type: e, handler: t }))),
              {
                dispose: () => {
                  void 0 !== n ? delete C[n] : (k = void 0);
                }
              }
            );
          },
          onProgress: (e, t, n) => {
            if (O.has(t)) throw new Error(`Progress handler for token ${t} already registered`);
            return (
              O.set(t, n),
              {
                dispose: () => {
                  O.delete(t);
                }
              }
            );
          },
          sendProgress: (e, t, n) => {
            oe.sendNotification(r.type, { token: t, value: n });
          },
          onUnhandledProgress: I.event,
          sendRequest: (e, ...t) => {
            let n, r;
            X(),
              (function () {
                if (!U()) throw new Error('Call listen() first.');
              })();
            let o = void 0;
            if (ge.string(e)) {
              n = e;
              const i = t[0],
                s = t[t.length - 1];
              let a = 0,
                c = me.ParameterStructures.auto;
              me.ParameterStructures.is(i) && ((a = 1), (c = i));
              let u = t.length;
              ve.CancellationToken.is(s) && ((u -= 1), (o = s));
              const l = u - a;
              switch (l) {
                case 0:
                  r = void 0;
                  break;
                case 1:
                  r = ne(c, t[a]);
                  break;
                default:
                  if (c === me.ParameterStructures.byName)
                    throw new Error(`Recevied ${l} parameters for 'by Name' request parameter structure.`);
                  r = t.slice(a, u).map(e => Z(e));
              }
            } else {
              const i = t;
              (n = e.method), (r = re(e, i));
              const s = e.numberOfParams;
              o = ve.CancellationToken.is(i[s]) ? i[s] : void 0;
            }
            const a = y++;
            let c;
            o &&
              (c = o.onCancellationRequested(() => {
                W.sender.sendCancellation(oe, a);
              }));
            return new Promise((e, t) => {
              const o = { jsonrpc: _, id: a, method: n, params: r };
              let u = {
                method: n,
                timerStart: Date.now(),
                resolve: t => {
                  e(t), W.sender.cleanup(a), null == c || c.dispose();
                },
                reject: e => {
                  t(e), W.sender.cleanup(a), null == c || c.dispose();
                }
              };
              !(function (e) {
                if (q !== i.Off && P)
                  if (D === s.Text) {
                    let t = void 0;
                    q === i.Verbose && e.params && (t = `Params: ${JSON.stringify(e.params, null, 4)}\n\n`),
                      P.log(`Sending request '${e.method} - (${e.id})'.`, t);
                  } else Q('send-request', e);
              })(o);
              try {
                l.write(o);
              } catch (e) {
                u.reject(
                  new me.ResponseError(me.ErrorCodes.MessageWriteError, e.message ? e.message : 'Unknown reason')
                ),
                  (u = null);
              }
              u && (S[String(a)] = u);
            });
          },
          onRequest: (e, t) => {
            X();
            let n = null;
            return (
              o.is(e)
                ? ((n = void 0), (w = e))
                : ge.string(e)
                ? ((n = null), void 0 !== t && ((n = e), (R[e] = { handler: t, type: void 0 })))
                : void 0 !== t && ((n = e.method), (R[e.method] = { type: e, handler: t })),
              {
                dispose: () => {
                  null !== n && (void 0 !== n ? delete R[n] : (w = void 0));
                }
              }
            );
          },
          trace: (e, t, n) => {
            let r = !1,
              o = s.Text;
            void 0 !== n && (ge.boolean(n) ? (r = n) : ((r = n.sendNotification || !1), (o = n.traceFormat || s.Text))),
              (q = e),
              (D = o),
              (P = q === i.Off ? void 0 : t),
              !r || z() || V() || oe.sendNotification(a.type, { value: i.toString(e) });
          },
          onError: N.event,
          onClose: A.event,
          onUnhandledNotification: F.event,
          onDispose: L.event,
          end: () => {
            l.end();
          },
          dispose: () => {
            if (V()) return;
            (j = p.Disposed), L.fire(void 0);
            const t = new Error('Connection got disposed.');
            Object.keys(S).forEach(e => {
              S[e].reject(t);
            }),
              (S = Object.create(null)),
              (E = Object.create(null)),
              (x = new Re.LinkedMap()),
              ge.func(l.dispose) && l.dispose(),
              ge.func(e.dispose) && e.dispose();
          },
          listen: () => {
            X(),
              (function () {
                if (U()) throw new g(u.AlreadyListening, 'Connection is already listening');
              })(),
              (j = p.Listening),
              e.listen(J);
          },
          inspect: () => {
            M.default().console.log('inspect');
          }
        };
        return (
          oe.onNotification(c.type, e => {
            q !== i.Off && P && P.log(e.message, q === i.Verbose ? e.verbose : void 0);
          }),
          oe.onNotification(r.type, e => {
            const t = O.get(e.token);
            t ? t(e.value) : I.fire(e);
          }),
          oe
        );
      });
  }),
  Ce = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.CancellationSenderStrategy = t.CancellationReceiverStrategy = t.ConnectionError = t.ConnectionErrors = t.LogTraceNotification = t.SetTraceNotification = t.TraceFormat = t.Trace = t.ProgressType = t.createMessageConnection = t.NullLogger = t.ConnectionOptions = t.ConnectionStrategy = t.WriteableStreamMessageWriter = t.AbstractMessageWriter = t.MessageWriter = t.ReadableStreamMessageReader = t.AbstractMessageReader = t.MessageReader = t.CancellationToken = t.CancellationTokenSource = t.Emitter = t.Event = t.Disposable = t.ParameterStructures = t.NotificationType9 = t.NotificationType8 = t.NotificationType7 = t.NotificationType6 = t.NotificationType5 = t.NotificationType4 = t.NotificationType3 = t.NotificationType2 = t.NotificationType1 = t.NotificationType0 = t.NotificationType = t.ErrorCodes = t.ResponseError = t.RequestType9 = t.RequestType8 = t.RequestType7 = t.RequestType6 = t.RequestType5 = t.RequestType4 = t.RequestType3 = t.RequestType2 = t.RequestType1 = t.RequestType0 = t.RequestType = t.RAL = void 0),
      (t.CancellationStrategy = void 0),
      Object.defineProperty(t, 'RequestType', {
        enumerable: !0,
        get: function () {
          return me.RequestType;
        }
      }),
      Object.defineProperty(t, 'RequestType0', {
        enumerable: !0,
        get: function () {
          return me.RequestType0;
        }
      }),
      Object.defineProperty(t, 'RequestType1', {
        enumerable: !0,
        get: function () {
          return me.RequestType1;
        }
      }),
      Object.defineProperty(t, 'RequestType2', {
        enumerable: !0,
        get: function () {
          return me.RequestType2;
        }
      }),
      Object.defineProperty(t, 'RequestType3', {
        enumerable: !0,
        get: function () {
          return me.RequestType3;
        }
      }),
      Object.defineProperty(t, 'RequestType4', {
        enumerable: !0,
        get: function () {
          return me.RequestType4;
        }
      }),
      Object.defineProperty(t, 'RequestType5', {
        enumerable: !0,
        get: function () {
          return me.RequestType5;
        }
      }),
      Object.defineProperty(t, 'RequestType6', {
        enumerable: !0,
        get: function () {
          return me.RequestType6;
        }
      }),
      Object.defineProperty(t, 'RequestType7', {
        enumerable: !0,
        get: function () {
          return me.RequestType7;
        }
      }),
      Object.defineProperty(t, 'RequestType8', {
        enumerable: !0,
        get: function () {
          return me.RequestType8;
        }
      }),
      Object.defineProperty(t, 'RequestType9', {
        enumerable: !0,
        get: function () {
          return me.RequestType9;
        }
      }),
      Object.defineProperty(t, 'ResponseError', {
        enumerable: !0,
        get: function () {
          return me.ResponseError;
        }
      }),
      Object.defineProperty(t, 'ErrorCodes', {
        enumerable: !0,
        get: function () {
          return me.ErrorCodes;
        }
      }),
      Object.defineProperty(t, 'NotificationType', {
        enumerable: !0,
        get: function () {
          return me.NotificationType;
        }
      }),
      Object.defineProperty(t, 'NotificationType0', {
        enumerable: !0,
        get: function () {
          return me.NotificationType0;
        }
      }),
      Object.defineProperty(t, 'NotificationType1', {
        enumerable: !0,
        get: function () {
          return me.NotificationType1;
        }
      }),
      Object.defineProperty(t, 'NotificationType2', {
        enumerable: !0,
        get: function () {
          return me.NotificationType2;
        }
      }),
      Object.defineProperty(t, 'NotificationType3', {
        enumerable: !0,
        get: function () {
          return me.NotificationType3;
        }
      }),
      Object.defineProperty(t, 'NotificationType4', {
        enumerable: !0,
        get: function () {
          return me.NotificationType4;
        }
      }),
      Object.defineProperty(t, 'NotificationType5', {
        enumerable: !0,
        get: function () {
          return me.NotificationType5;
        }
      }),
      Object.defineProperty(t, 'NotificationType6', {
        enumerable: !0,
        get: function () {
          return me.NotificationType6;
        }
      }),
      Object.defineProperty(t, 'NotificationType7', {
        enumerable: !0,
        get: function () {
          return me.NotificationType7;
        }
      }),
      Object.defineProperty(t, 'NotificationType8', {
        enumerable: !0,
        get: function () {
          return me.NotificationType8;
        }
      }),
      Object.defineProperty(t, 'NotificationType9', {
        enumerable: !0,
        get: function () {
          return me.NotificationType9;
        }
      }),
      Object.defineProperty(t, 'ParameterStructures', {
        enumerable: !0,
        get: function () {
          return me.ParameterStructures;
        }
      }),
      Object.defineProperty(t, 'Disposable', {
        enumerable: !0,
        get: function () {
          return j.Disposable;
        }
      }),
      Object.defineProperty(t, 'Event', {
        enumerable: !0,
        get: function () {
          return ye.Event;
        }
      }),
      Object.defineProperty(t, 'Emitter', {
        enumerable: !0,
        get: function () {
          return ye.Emitter;
        }
      }),
      Object.defineProperty(t, 'CancellationTokenSource', {
        enumerable: !0,
        get: function () {
          return ve.CancellationTokenSource;
        }
      }),
      Object.defineProperty(t, 'CancellationToken', {
        enumerable: !0,
        get: function () {
          return ve.CancellationToken;
        }
      }),
      Object.defineProperty(t, 'MessageReader', {
        enumerable: !0,
        get: function () {
          return be.MessageReader;
        }
      }),
      Object.defineProperty(t, 'AbstractMessageReader', {
        enumerable: !0,
        get: function () {
          return be.AbstractMessageReader;
        }
      }),
      Object.defineProperty(t, 'ReadableStreamMessageReader', {
        enumerable: !0,
        get: function () {
          return be.ReadableStreamMessageReader;
        }
      }),
      Object.defineProperty(t, 'MessageWriter', {
        enumerable: !0,
        get: function () {
          return we.MessageWriter;
        }
      }),
      Object.defineProperty(t, 'AbstractMessageWriter', {
        enumerable: !0,
        get: function () {
          return we.AbstractMessageWriter;
        }
      }),
      Object.defineProperty(t, 'WriteableStreamMessageWriter', {
        enumerable: !0,
        get: function () {
          return we.WriteableStreamMessageWriter;
        }
      }),
      Object.defineProperty(t, 'ConnectionStrategy', {
        enumerable: !0,
        get: function () {
          return ke.ConnectionStrategy;
        }
      }),
      Object.defineProperty(t, 'ConnectionOptions', {
        enumerable: !0,
        get: function () {
          return ke.ConnectionOptions;
        }
      }),
      Object.defineProperty(t, 'NullLogger', {
        enumerable: !0,
        get: function () {
          return ke.NullLogger;
        }
      }),
      Object.defineProperty(t, 'createMessageConnection', {
        enumerable: !0,
        get: function () {
          return ke.createMessageConnection;
        }
      }),
      Object.defineProperty(t, 'ProgressType', {
        enumerable: !0,
        get: function () {
          return ke.ProgressType;
        }
      }),
      Object.defineProperty(t, 'Trace', {
        enumerable: !0,
        get: function () {
          return ke.Trace;
        }
      }),
      Object.defineProperty(t, 'TraceFormat', {
        enumerable: !0,
        get: function () {
          return ke.TraceFormat;
        }
      }),
      Object.defineProperty(t, 'SetTraceNotification', {
        enumerable: !0,
        get: function () {
          return ke.SetTraceNotification;
        }
      }),
      Object.defineProperty(t, 'LogTraceNotification', {
        enumerable: !0,
        get: function () {
          return ke.LogTraceNotification;
        }
      }),
      Object.defineProperty(t, 'ConnectionErrors', {
        enumerable: !0,
        get: function () {
          return ke.ConnectionErrors;
        }
      }),
      Object.defineProperty(t, 'ConnectionError', {
        enumerable: !0,
        get: function () {
          return ke.ConnectionError;
        }
      }),
      Object.defineProperty(t, 'CancellationReceiverStrategy', {
        enumerable: !0,
        get: function () {
          return ke.CancellationReceiverStrategy;
        }
      }),
      Object.defineProperty(t, 'CancellationSenderStrategy', {
        enumerable: !0,
        get: function () {
          return ke.CancellationSenderStrategy;
        }
      }),
      Object.defineProperty(t, 'CancellationStrategy', {
        enumerable: !0,
        get: function () {
          return ke.CancellationStrategy;
        }
      }),
      (t.RAL = M.default);
  }),
  Oe = P(function (e, t) {
    var n =
        (O && O.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      r =
        (O && O.__exportStar) ||
        function (e, t) {
          for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createMessageConnection = t.createServerSocketTransport = t.createClientSocketTransport = t.createServerPipeTransport = t.createClientPipeTransport = t.generateRandomPipeName = t.StreamMessageWriter = t.StreamMessageReader = t.SocketMessageWriter = t.SocketMessageReader = t.IPCMessageWriter = t.IPCMessageReader = void 0),
      pe.default.install(),
      r(Ce, t);
    class o extends Ce.AbstractMessageReader {
      constructor(e) {
        super(), (this.process = e);
        let t = this.process;
        t.on('error', e => this.fireError(e)), t.on('close', () => this.fireClose());
      }
      listen(e) {
        return this.process.on('message', e), Ce.Disposable.create(() => this.process.off('message', e));
      }
    }
    t.IPCMessageReader = o;
    class i extends Ce.AbstractMessageWriter {
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
    t.IPCMessageWriter = i;
    class s extends Ce.ReadableStreamMessageReader {
      constructor(e, t = 'utf-8') {
        super(pe.default().stream.asReadableStream(e), t);
      }
    }
    t.SocketMessageReader = s;
    class a extends Ce.WriteableStreamMessageWriter {
      constructor(e, t) {
        super(pe.default().stream.asWritableStream(e), t), (this.socket = e);
      }
      dispose() {
        super.dispose(), this.socket.destroy();
      }
    }
    t.SocketMessageWriter = a;
    class c extends Ce.ReadableStreamMessageReader {
      constructor(e, t) {
        super(pe.default().stream.asReadableStream(e), t);
      }
    }
    t.StreamMessageReader = c;
    class u extends Ce.WriteableStreamMessageWriter {
      constructor(e, t) {
        super(pe.default().stream.asWritableStream(e), t);
      }
    }
    t.StreamMessageWriter = u;
    const l = process.env.XDG_RUNTIME_DIR,
      h = new Map([
        ['linux', 107],
        ['darwin', 103]
      ]);
    (t.generateRandomPipeName = function () {
      const e = _.default.randomBytes(21).toString('hex');
      if ('win32' === process.platform) return `\\\\.\\pipe\\vscode-jsonrpc-${e}-sock`;
      let t;
      t = l ? m.default.join(l, `vscode-ipc-${e}.sock`) : m.default.join(b.default.tmpdir(), `vscode-${e}.sock`);
      const n = h.get(process.platform);
      return (
        void 0 !== n &&
          t.length >= n &&
          pe.default().console.warn(`WARNING: IPC handle "${t}" is longer than ${n} characters.`),
        t
      );
    }),
      (t.createClientPipeTransport = function (e, t = 'utf-8') {
        let n;
        const r = new Promise((e, t) => {
          n = e;
        });
        return new Promise((o, i) => {
          let c = w.default.createServer(e => {
            c.close(), n([new s(e, t), new a(e, t)]);
          });
          c.on('error', i),
            c.listen(e, () => {
              c.removeListener('error', i), o({ onConnected: () => r });
            });
        });
      }),
      (t.createServerPipeTransport = function (e, t = 'utf-8') {
        const n = w.default.createConnection(e);
        return [new s(n, t), new a(n, t)];
      }),
      (t.createClientSocketTransport = function (e, t = 'utf-8') {
        let n;
        const r = new Promise((e, t) => {
          n = e;
        });
        return new Promise((o, i) => {
          const c = w.default.createServer(e => {
            c.close(), n([new s(e, t), new a(e, t)]);
          });
          c.on('error', i),
            c.listen(e, '127.0.0.1', () => {
              c.removeListener('error', i), o({ onConnected: () => r });
            });
        });
      }),
      (t.createServerSocketTransport = function (e, t = 'utf-8') {
        const n = w.default.createConnection(e, '127.0.0.1');
        return [new s(n, t), new a(n, t)];
      }),
      (t.createMessageConnection = function (e, t, n, r) {
        n || (n = Ce.NullLogger);
        const o = (function (e) {
            const t = e;
            return void 0 !== t.read && void 0 !== t.addListener;
          })(e)
            ? new c(e)
            : e,
          i = (function (e) {
            const t = e;
            return void 0 !== t.write && void 0 !== t.addListener;
          })(t)
            ? new u(t)
            : t;
        return Ce.ConnectionStrategy.is(r) && (r = { connectionStrategy: r }), Ce.createMessageConnection(o, i, n, r);
      });
  }),
  Te = Oe;
!(function (e) {
  (e.MIN_VALUE = -2147483648), (e.MAX_VALUE = 2147483647);
})($ || ($ = {})),
  (function (e) {
    (e.MIN_VALUE = 0), (e.MAX_VALUE = 2147483647);
  })(H || (H = {})),
  (function (e) {
    (e.create = function (e, t) {
      return (
        e === Number.MAX_VALUE && (e = H.MAX_VALUE),
        t === Number.MAX_VALUE && (t = H.MAX_VALUE),
        { line: e, character: t }
      );
    }),
      (e.is = function (e) {
        var t = e;
        return at.objectLiteral(t) && at.uinteger(t.line) && at.uinteger(t.character);
      });
  })(B || (B = {})),
  (function (e) {
    (e.create = function (e, t, n, r) {
      if (at.uinteger(e) && at.uinteger(t) && at.uinteger(n) && at.uinteger(r))
        return { start: B.create(e, t), end: B.create(n, r) };
      if (B.is(e) && B.is(t)) return { start: e, end: t };
      throw new Error('Range#create called with invalid arguments[' + e + ', ' + t + ', ' + n + ', ' + r + ']');
    }),
      (e.is = function (e) {
        var t = e;
        return at.objectLiteral(t) && B.is(t.start) && B.is(t.end);
      });
  })(U || (U = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { uri: e, range: t };
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && U.is(t.range) && (at.string(t.uri) || at.undefined(t.uri));
      });
  })(z || (z = {})),
  (function (e) {
    (e.create = function (e, t, n, r) {
      return { targetUri: e, targetRange: t, targetSelectionRange: n, originSelectionRange: r };
    }),
      (e.is = function (e) {
        var t = e;
        return (
          at.defined(t) &&
          U.is(t.targetRange) &&
          at.string(t.targetUri) &&
          (U.is(t.targetSelectionRange) || at.undefined(t.targetSelectionRange)) &&
          (U.is(t.originSelectionRange) || at.undefined(t.originSelectionRange))
        );
      });
  })(V || (V = {})),
  (function (e) {
    (e.create = function (e, t, n, r) {
      return { red: e, green: t, blue: n, alpha: r };
    }),
      (e.is = function (e) {
        var t = e;
        return (
          at.numberRange(t.red, 0, 1) &&
          at.numberRange(t.green, 0, 1) &&
          at.numberRange(t.blue, 0, 1) &&
          at.numberRange(t.alpha, 0, 1)
        );
      });
  })(G || (G = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { range: e, color: t };
    }),
      (e.is = function (e) {
        var t = e;
        return U.is(t.range) && G.is(t.color);
      });
  })(K || (K = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      return { label: e, textEdit: t, additionalTextEdits: n };
    }),
      (e.is = function (e) {
        var t = e;
        return (
          at.string(t.label) &&
          (at.undefined(t.textEdit) || oe.is(t)) &&
          (at.undefined(t.additionalTextEdits) || at.typedArray(t.additionalTextEdits, oe.is))
        );
      });
  })(J || (J = {})),
  (function (e) {
    (e.Comment = 'comment'), (e.Imports = 'imports'), (e.Region = 'region');
  })(Y || (Y = {})),
  (function (e) {
    (e.create = function (e, t, n, r, o) {
      var i = { startLine: e, endLine: t };
      return (
        at.defined(n) && (i.startCharacter = n), at.defined(r) && (i.endCharacter = r), at.defined(o) && (i.kind = o), i
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          at.uinteger(t.startLine) &&
          at.uinteger(t.startLine) &&
          (at.undefined(t.startCharacter) || at.uinteger(t.startCharacter)) &&
          (at.undefined(t.endCharacter) || at.uinteger(t.endCharacter)) &&
          (at.undefined(t.kind) || at.string(t.kind))
        );
      });
  })(Q || (Q = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { location: e, message: t };
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && z.is(t.location) && at.string(t.message);
      });
  })(X || (X = {})),
  (function (e) {
    (e.Error = 1), (e.Warning = 2), (e.Information = 3), (e.Hint = 4);
  })(Z || (Z = {})),
  (function (e) {
    (e.Unnecessary = 1), (e.Deprecated = 2);
  })(ee || (ee = {})),
  (function (e) {
    e.is = function (e) {
      var t = e;
      return null != t && at.string(t.href);
    };
  })(te || (te = {})),
  (function (e) {
    (e.create = function (e, t, n, r, o, i) {
      var s = { range: e, message: t };
      return (
        at.defined(n) && (s.severity = n),
        at.defined(r) && (s.code = r),
        at.defined(o) && (s.source = o),
        at.defined(i) && (s.relatedInformation = i),
        s
      );
    }),
      (e.is = function (e) {
        var t,
          n = e;
        return (
          at.defined(n) &&
          U.is(n.range) &&
          at.string(n.message) &&
          (at.number(n.severity) || at.undefined(n.severity)) &&
          (at.integer(n.code) || at.string(n.code) || at.undefined(n.code)) &&
          (at.undefined(n.codeDescription) ||
            at.string(null === (t = n.codeDescription) || void 0 === t ? void 0 : t.href)) &&
          (at.string(n.source) || at.undefined(n.source)) &&
          (at.undefined(n.relatedInformation) || at.typedArray(n.relatedInformation, X.is))
        );
      });
  })(ne || (ne = {})),
  (function (e) {
    (e.create = function (e, t) {
      for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
      var o = { title: e, command: t };
      return at.defined(n) && n.length > 0 && (o.arguments = n), o;
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && at.string(t.title) && at.string(t.command);
      });
  })(re || (re = {})),
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
        return at.objectLiteral(t) && at.string(t.newText) && U.is(t.range);
      });
  })(oe || (oe = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      var r = { label: e };
      return void 0 !== t && (r.needsConfirmation = t), void 0 !== n && (r.description = n), r;
    }),
      (e.is = function (e) {
        var t = e;
        return (
          void 0 !== t &&
          at.objectLiteral(t) &&
          at.string(t.label) &&
          (at.boolean(t.needsConfirmation) || void 0 === t.needsConfirmation) &&
          (at.string(t.description) || void 0 === t.description)
        );
      });
  })(ie || (ie = {})),
  (function (e) {
    e.is = function (e) {
      return 'string' == typeof e;
    };
  })(se || (se = {})),
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
        return oe.is(t) && (ie.is(t.annotationId) || se.is(t.annotationId));
      });
  })(ae || (ae = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { textDocument: e, edits: t };
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && Se.is(t.textDocument) && Array.isArray(t.edits);
      });
  })(ce || (ce = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      var r = { kind: 'create', uri: e };
      return (
        void 0 === t || (void 0 === t.overwrite && void 0 === t.ignoreIfExists) || (r.options = t),
        void 0 !== n && (r.annotationId = n),
        r
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          'create' === t.kind &&
          at.string(t.uri) &&
          (void 0 === t.options ||
            ((void 0 === t.options.overwrite || at.boolean(t.options.overwrite)) &&
              (void 0 === t.options.ignoreIfExists || at.boolean(t.options.ignoreIfExists)))) &&
          (void 0 === t.annotationId || se.is(t.annotationId))
        );
      });
  })(ue || (ue = {})),
  (function (e) {
    (e.create = function (e, t, n, r) {
      var o = { kind: 'rename', oldUri: e, newUri: t };
      return (
        void 0 === n || (void 0 === n.overwrite && void 0 === n.ignoreIfExists) || (o.options = n),
        void 0 !== r && (o.annotationId = r),
        o
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          'rename' === t.kind &&
          at.string(t.oldUri) &&
          at.string(t.newUri) &&
          (void 0 === t.options ||
            ((void 0 === t.options.overwrite || at.boolean(t.options.overwrite)) &&
              (void 0 === t.options.ignoreIfExists || at.boolean(t.options.ignoreIfExists)))) &&
          (void 0 === t.annotationId || se.is(t.annotationId))
        );
      });
  })(le || (le = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      var r = { kind: 'delete', uri: e };
      return (
        void 0 === t || (void 0 === t.recursive && void 0 === t.ignoreIfNotExists) || (r.options = t),
        void 0 !== n && (r.annotationId = n),
        r
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          'delete' === t.kind &&
          at.string(t.uri) &&
          (void 0 === t.options ||
            ((void 0 === t.options.recursive || at.boolean(t.options.recursive)) &&
              (void 0 === t.options.ignoreIfNotExists || at.boolean(t.options.ignoreIfNotExists)))) &&
          (void 0 === t.annotationId || se.is(t.annotationId))
        );
      });
  })(he || (he = {})),
  (function (e) {
    e.is = function (e) {
      var t = e;
      return (
        t &&
        (void 0 !== t.changes || void 0 !== t.documentChanges) &&
        (void 0 === t.documentChanges ||
          t.documentChanges.every(function (e) {
            return at.string(e.kind) ? ue.is(e) || le.is(e) || he.is(e) : ce.is(e);
          }))
      );
    };
  })(de || (de = {}));
var Pe,
  xe,
  Se,
  Ee,
  qe,
  De,
  Me,
  je,
  Ne,
  Ae,
  Fe,
  Ie,
  Le,
  We,
  $e,
  He,
  Be,
  Ue,
  ze,
  Ve,
  Ge,
  Ke,
  Je,
  Ye,
  Qe,
  Xe,
  Ze,
  et,
  tt,
  nt,
  rt = (function () {
    function e(e, t) {
      (this.edits = e), (this.changeAnnotations = t);
    }
    return (
      (e.prototype.insert = function (e, t, n) {
        var r, o;
        if (
          (void 0 === n
            ? (r = oe.insert(e, t))
            : se.is(n)
            ? ((o = n), (r = ae.insert(e, t, n)))
            : (this.assertChangeAnnotations(this.changeAnnotations),
              (o = this.changeAnnotations.manage(n)),
              (r = ae.insert(e, t, o))),
          this.edits.push(r),
          void 0 !== o)
        )
          return o;
      }),
      (e.prototype.replace = function (e, t, n) {
        var r, o;
        if (
          (void 0 === n
            ? (r = oe.replace(e, t))
            : se.is(n)
            ? ((o = n), (r = ae.replace(e, t, n)))
            : (this.assertChangeAnnotations(this.changeAnnotations),
              (o = this.changeAnnotations.manage(n)),
              (r = ae.replace(e, t, o))),
          this.edits.push(r),
          void 0 !== o)
        )
          return o;
      }),
      (e.prototype.delete = function (e, t) {
        var n, r;
        if (
          (void 0 === t
            ? (n = oe.del(e))
            : se.is(t)
            ? ((r = t), (n = ae.del(e, t)))
            : (this.assertChangeAnnotations(this.changeAnnotations),
              (r = this.changeAnnotations.manage(t)),
              (n = ae.del(e, r))),
          this.edits.push(n),
          void 0 !== r)
        )
          return r;
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
  ot = (function () {
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
        if ((se.is(e) ? (n = e) : ((n = this.nextId()), (t = e)), void 0 !== this._annotations[n]))
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
  it = (function () {
    function e(e) {
      var t = this;
      (this._textEditChanges = Object.create(null)),
        void 0 !== e
          ? ((this._workspaceEdit = e),
            e.documentChanges
              ? ((this._changeAnnotations = new ot(e.changeAnnotations)),
                (e.changeAnnotations = this._changeAnnotations.all()),
                e.documentChanges.forEach(function (e) {
                  if (ce.is(e)) {
                    var n = new rt(e.edits, t._changeAnnotations);
                    t._textEditChanges[e.textDocument.uri] = n;
                  }
                }))
              : e.changes &&
                Object.keys(e.changes).forEach(function (n) {
                  var r = new rt(e.changes[n]);
                  t._textEditChanges[n] = r;
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
        if (Se.is(e)) {
          if ((this.initDocumentChanges(), void 0 === this._workspaceEdit.documentChanges))
            throw new Error('Workspace edit is not configured for document changes.');
          var t = { uri: e.uri, version: e.version };
          if (!(r = this._textEditChanges[t.uri])) {
            var n = { textDocument: t, edits: (o = []) };
            this._workspaceEdit.documentChanges.push(n),
              (r = new rt(o, this._changeAnnotations)),
              (this._textEditChanges[t.uri] = r);
          }
          return r;
        }
        if ((this.initChanges(), void 0 === this._workspaceEdit.changes))
          throw new Error('Workspace edit is not configured for normal text edit changes.');
        var r;
        if (!(r = this._textEditChanges[e])) {
          var o = [];
          (this._workspaceEdit.changes[e] = o), (r = new rt(o)), (this._textEditChanges[e] = r);
        }
        return r;
      }),
      (e.prototype.initDocumentChanges = function () {
        void 0 === this._workspaceEdit.documentChanges &&
          void 0 === this._workspaceEdit.changes &&
          ((this._changeAnnotations = new ot()),
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
        var r, o, i;
        if (
          (ie.is(t) || se.is(t) ? (r = t) : (n = t),
          void 0 === r
            ? (o = ue.create(e, n))
            : ((i = se.is(r) ? r : this._changeAnnotations.manage(r)), (o = ue.create(e, n, i))),
          this._workspaceEdit.documentChanges.push(o),
          void 0 !== i)
        )
          return i;
      }),
      (e.prototype.renameFile = function (e, t, n, r) {
        if ((this.initDocumentChanges(), void 0 === this._workspaceEdit.documentChanges))
          throw new Error('Workspace edit is not configured for document changes.');
        var o, i, s;
        if (
          (ie.is(n) || se.is(n) ? (o = n) : (r = n),
          void 0 === o
            ? (i = le.create(e, t, r))
            : ((s = se.is(o) ? o : this._changeAnnotations.manage(o)), (i = le.create(e, t, r, s))),
          this._workspaceEdit.documentChanges.push(i),
          void 0 !== s)
        )
          return s;
      }),
      (e.prototype.deleteFile = function (e, t, n) {
        if ((this.initDocumentChanges(), void 0 === this._workspaceEdit.documentChanges))
          throw new Error('Workspace edit is not configured for document changes.');
        var r, o, i;
        if (
          (ie.is(t) || se.is(t) ? (r = t) : (n = t),
          void 0 === r
            ? (o = he.create(e, n))
            : ((i = se.is(r) ? r : this._changeAnnotations.manage(r)), (o = he.create(e, n, i))),
          this._workspaceEdit.documentChanges.push(o),
          void 0 !== i)
        )
          return i;
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
      return at.defined(t) && at.string(t.uri);
    });
})(Pe || (Pe = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { uri: e, version: t };
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && at.string(t.uri) && at.integer(t.version);
      });
  })(xe || (xe = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { uri: e, version: t };
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && at.string(t.uri) && (null === t.version || at.integer(t.version));
      });
  })(Se || (Se = {})),
  (function (e) {
    (e.create = function (e, t, n, r) {
      return { uri: e, languageId: t, version: n, text: r };
    }),
      (e.is = function (e) {
        var t = e;
        return (
          at.defined(t) && at.string(t.uri) && at.string(t.languageId) && at.integer(t.version) && at.string(t.text)
        );
      });
  })(Ee || (Ee = {})),
  (function (e) {
    (e.PlainText = 'plaintext'), (e.Markdown = 'markdown');
  })(qe || (qe = {})),
  (function (e) {
    e.is = function (t) {
      var n = t;
      return n === e.PlainText || n === e.Markdown;
    };
  })(qe || (qe = {})),
  (function (e) {
    e.is = function (e) {
      var t = e;
      return at.objectLiteral(e) && qe.is(t.kind) && at.string(t.value);
    };
  })(De || (De = {})),
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
  })(Me || (Me = {})),
  (function (e) {
    (e.PlainText = 1), (e.Snippet = 2);
  })(je || (je = {})),
  (function (e) {
    e.Deprecated = 1;
  })(Ne || (Ne = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      return { newText: e, insert: t, replace: n };
    }),
      (e.is = function (e) {
        var t = e;
        return t && at.string(t.newText) && U.is(t.insert) && U.is(t.replace);
      });
  })(Ae || (Ae = {})),
  (function (e) {
    (e.asIs = 1), (e.adjustIndentation = 2);
  })(Fe || (Fe = {})),
  (function (e) {
    e.create = function (e) {
      return { label: e };
    };
  })(Ie || (Ie = {})),
  (function (e) {
    e.create = function (e, t) {
      return { items: e || [], isIncomplete: !!t };
    };
  })(Le || (Le = {})),
  (function (e) {
    (e.fromPlainText = function (e) {
      return e.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
    }),
      (e.is = function (e) {
        var t = e;
        return at.string(t) || (at.objectLiteral(t) && at.string(t.language) && at.string(t.value));
      });
  })(We || (We = {})),
  (function (e) {
    e.is = function (e) {
      var t = e;
      return (
        !!t &&
        at.objectLiteral(t) &&
        (De.is(t.contents) || We.is(t.contents) || at.typedArray(t.contents, We.is)) &&
        (void 0 === e.range || U.is(e.range))
      );
    };
  })($e || ($e = {})),
  (function (e) {
    e.create = function (e, t) {
      return t ? { label: e, documentation: t } : { label: e };
    };
  })(He || (He = {})),
  (function (e) {
    e.create = function (e, t) {
      for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
      var o = { label: e };
      return at.defined(t) && (o.documentation = t), at.defined(n) ? (o.parameters = n) : (o.parameters = []), o;
    };
  })(Be || (Be = {})),
  (function (e) {
    (e.Text = 1), (e.Read = 2), (e.Write = 3);
  })(Ue || (Ue = {})),
  (function (e) {
    e.create = function (e, t) {
      var n = { range: e };
      return at.number(t) && (n.kind = t), n;
    };
  })(ze || (ze = {})),
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
  })(Ve || (Ve = {})),
  (function (e) {
    e.Deprecated = 1;
  })(Ge || (Ge = {})),
  (function (e) {
    e.create = function (e, t, n, r, o) {
      var i = { name: e, kind: t, location: { uri: r, range: n } };
      return o && (i.containerName = o), i;
    };
  })(Ke || (Ke = {})),
  (function (e) {
    (e.create = function (e, t, n, r, o, i) {
      var s = { name: e, detail: t, kind: n, range: r, selectionRange: o };
      return void 0 !== i && (s.children = i), s;
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          at.string(t.name) &&
          at.number(t.kind) &&
          U.is(t.range) &&
          U.is(t.selectionRange) &&
          (void 0 === t.detail || at.string(t.detail)) &&
          (void 0 === t.deprecated || at.boolean(t.deprecated)) &&
          (void 0 === t.children || Array.isArray(t.children)) &&
          (void 0 === t.tags || Array.isArray(t.tags))
        );
      });
  })(Je || (Je = {})),
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
  })(Ye || (Ye = {})),
  (function (e) {
    (e.create = function (e, t) {
      var n = { diagnostics: e };
      return null != t && (n.only = t), n;
    }),
      (e.is = function (e) {
        var t = e;
        return (
          at.defined(t) &&
          at.typedArray(t.diagnostics, ne.is) &&
          (void 0 === t.only || at.typedArray(t.only, at.string))
        );
      });
  })(Qe || (Qe = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      var r = { title: e },
        o = !0;
      return (
        'string' == typeof t ? ((o = !1), (r.kind = t)) : re.is(t) ? (r.command = t) : (r.edit = t),
        o && void 0 !== n && (r.kind = n),
        r
      );
    }),
      (e.is = function (e) {
        var t = e;
        return (
          t &&
          at.string(t.title) &&
          (void 0 === t.diagnostics || at.typedArray(t.diagnostics, ne.is)) &&
          (void 0 === t.kind || at.string(t.kind)) &&
          (void 0 !== t.edit || void 0 !== t.command) &&
          (void 0 === t.command || re.is(t.command)) &&
          (void 0 === t.isPreferred || at.boolean(t.isPreferred)) &&
          (void 0 === t.edit || de.is(t.edit))
        );
      });
  })(Xe || (Xe = {})),
  (function (e) {
    (e.create = function (e, t) {
      var n = { range: e };
      return at.defined(t) && (n.data = t), n;
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && U.is(t.range) && (at.undefined(t.command) || re.is(t.command));
      });
  })(Ze || (Ze = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { tabSize: e, insertSpaces: t };
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && at.uinteger(t.tabSize) && at.boolean(t.insertSpaces);
      });
  })(et || (et = {})),
  (function (e) {
    (e.create = function (e, t, n) {
      return { range: e, target: t, data: n };
    }),
      (e.is = function (e) {
        var t = e;
        return at.defined(t) && U.is(t.range) && (at.undefined(t.target) || at.string(t.target));
      });
  })(tt || (tt = {})),
  (function (e) {
    (e.create = function (e, t) {
      return { range: e, parent: t };
    }),
      (e.is = function (t) {
        var n = t;
        return void 0 !== n && U.is(n.range) && (void 0 === n.parent || e.is(n.parent));
      });
  })(nt || (nt = {}));
var st;
!(function (e) {
  function t(e, n) {
    if (e.length <= 1) return e;
    var r = (e.length / 2) | 0,
      o = e.slice(0, r),
      i = e.slice(r);
    t(o, n), t(i, n);
    for (var s = 0, a = 0, c = 0; s < o.length && a < i.length; ) {
      var u = n(o[s], i[a]);
      e[c++] = u <= 0 ? o[s++] : i[a++];
    }
    for (; s < o.length; ) e[c++] = o[s++];
    for (; a < i.length; ) e[c++] = i[a++];
    return e;
  }
  (e.create = function (e, t, n, r) {
    return new ct(e, t, n, r);
  }),
    (e.is = function (e) {
      var t = e;
      return !!(
        at.defined(t) &&
        at.string(t.uri) &&
        (at.undefined(t.languageId) || at.string(t.languageId)) &&
        at.uinteger(t.lineCount) &&
        at.func(t.getText) &&
        at.func(t.positionAt) &&
        at.func(t.offsetAt)
      );
    }),
    (e.applyEdits = function (e, n) {
      for (
        var r = e.getText(),
          o = t(n, function (e, t) {
            var n = e.range.start.line - t.range.start.line;
            return 0 === n ? e.range.start.character - t.range.start.character : n;
          }),
          i = r.length,
          s = o.length - 1;
        s >= 0;
        s--
      ) {
        var a = o[s],
          c = e.offsetAt(a.range.start),
          u = e.offsetAt(a.range.end);
        if (!(u <= i)) throw new Error('Overlapping edit');
        (r = r.substring(0, c) + a.newText + r.substring(u, r.length)), (i = c);
      }
      return r;
    });
})(st || (st = {}));
var at,
  ct = (function () {
    function e(e, t, n, r) {
      (this._uri = e), (this._languageId = t), (this._version = n), (this._content = r), (this._lineOffsets = void 0);
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
          for (var e = [], t = this._content, n = !0, r = 0; r < t.length; r++) {
            n && (e.push(r), (n = !1));
            var o = t.charAt(r);
            (n = '\r' === o || '\n' === o), '\r' === o && r + 1 < t.length && '\n' === t.charAt(r + 1) && r++;
          }
          n && t.length > 0 && e.push(t.length), (this._lineOffsets = e);
        }
        return this._lineOffsets;
      }),
      (e.prototype.positionAt = function (e) {
        e = Math.max(Math.min(e, this._content.length), 0);
        var t = this.getLineOffsets(),
          n = 0,
          r = t.length;
        if (0 === r) return B.create(0, e);
        for (; n < r; ) {
          var o = Math.floor((n + r) / 2);
          t[o] > e ? (r = o) : (n = o + 1);
        }
        var i = n - 1;
        return B.create(i, e - t[i]);
      }),
      (e.prototype.offsetAt = function (e) {
        var t = this.getLineOffsets();
        if (e.line >= t.length) return this._content.length;
        if (e.line < 0) return 0;
        var n = t[e.line],
          r = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
        return Math.max(Math.min(n + e.character, r), n);
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
    (e.numberRange = function (e, n, r) {
      return '[object Number]' === t.call(e) && n <= e && e <= r;
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
})(at || (at = {}));
var ut,
  lt = Object.freeze({
    __proto__: null,
    get integer() {
      return $;
    },
    get uinteger() {
      return H;
    },
    get Position() {
      return B;
    },
    get Range() {
      return U;
    },
    get Location() {
      return z;
    },
    get LocationLink() {
      return V;
    },
    get Color() {
      return G;
    },
    get ColorInformation() {
      return K;
    },
    get ColorPresentation() {
      return J;
    },
    get FoldingRangeKind() {
      return Y;
    },
    get FoldingRange() {
      return Q;
    },
    get DiagnosticRelatedInformation() {
      return X;
    },
    get DiagnosticSeverity() {
      return Z;
    },
    get DiagnosticTag() {
      return ee;
    },
    get CodeDescription() {
      return te;
    },
    get Diagnostic() {
      return ne;
    },
    get Command() {
      return re;
    },
    get TextEdit() {
      return oe;
    },
    get ChangeAnnotation() {
      return ie;
    },
    get ChangeAnnotationIdentifier() {
      return se;
    },
    get AnnotatedTextEdit() {
      return ae;
    },
    get TextDocumentEdit() {
      return ce;
    },
    get CreateFile() {
      return ue;
    },
    get RenameFile() {
      return le;
    },
    get DeleteFile() {
      return he;
    },
    get WorkspaceEdit() {
      return de;
    },
    WorkspaceChange: it,
    get TextDocumentIdentifier() {
      return Pe;
    },
    get VersionedTextDocumentIdentifier() {
      return xe;
    },
    get OptionalVersionedTextDocumentIdentifier() {
      return Se;
    },
    get TextDocumentItem() {
      return Ee;
    },
    get MarkupKind() {
      return qe;
    },
    get MarkupContent() {
      return De;
    },
    get CompletionItemKind() {
      return Me;
    },
    get InsertTextFormat() {
      return je;
    },
    get CompletionItemTag() {
      return Ne;
    },
    get InsertReplaceEdit() {
      return Ae;
    },
    get InsertTextMode() {
      return Fe;
    },
    get CompletionItem() {
      return Ie;
    },
    get CompletionList() {
      return Le;
    },
    get MarkedString() {
      return We;
    },
    get Hover() {
      return $e;
    },
    get ParameterInformation() {
      return He;
    },
    get SignatureInformation() {
      return Be;
    },
    get DocumentHighlightKind() {
      return Ue;
    },
    get DocumentHighlight() {
      return ze;
    },
    get SymbolKind() {
      return Ve;
    },
    get SymbolTag() {
      return Ge;
    },
    get SymbolInformation() {
      return Ke;
    },
    get DocumentSymbol() {
      return Je;
    },
    get CodeActionKind() {
      return Ye;
    },
    get CodeActionContext() {
      return Qe;
    },
    get CodeAction() {
      return Xe;
    },
    get CodeLens() {
      return Ze;
    },
    get FormattingOptions() {
      return et;
    },
    get DocumentLink() {
      return tt;
    },
    get SelectionRange() {
      return nt;
    },
    EOL: ['\n', '\r\n', '\r'],
    get TextDocument() {
      return st;
    }
  }),
  ht = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ProtocolNotificationType = t.ProtocolNotificationType0 = t.ProtocolRequestType = t.ProtocolRequestType0 = t.RegistrationType = void 0);
    t.RegistrationType = class {
      constructor(e) {
        this.method = e;
      }
    };
    class n extends Oe.RequestType0 {
      constructor(e) {
        super(e);
      }
    }
    t.ProtocolRequestType0 = n;
    class r extends Oe.RequestType {
      constructor(e) {
        super(e, Oe.ParameterStructures.byName);
      }
    }
    t.ProtocolRequestType = r;
    class o extends Oe.NotificationType0 {
      constructor(e) {
        super(e);
      }
    }
    t.ProtocolNotificationType0 = o;
    class i extends Oe.NotificationType {
      constructor(e) {
        super(e, Oe.ParameterStructures.byName);
      }
    }
    t.ProtocolNotificationType = i;
  }),
  dt = P(function (e, t) {
    function n(e) {
      return 'string' == typeof e || e instanceof String;
    }
    function r(e) {
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
      (t.array = r),
      (t.stringArray = function (e) {
        return r(e) && e.every(e => n(e));
      }),
      (t.typedArray = function (e, t) {
        return Array.isArray(e) && e.every(t);
      }),
      (t.objectLiteral = function (e) {
        return null !== e && 'object' == typeof e;
      });
  }),
  ft = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ImplementationRequest = void 0),
      ((n = t.ImplementationRequest || (t.ImplementationRequest = {})).method = 'textDocument/implementation'),
      (n.type = new ht.ProtocolRequestType(n.method));
  }),
  pt = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.TypeDefinitionRequest = void 0),
      ((n = t.TypeDefinitionRequest || (t.TypeDefinitionRequest = {})).method = 'textDocument/typeDefinition'),
      (n.type = new ht.ProtocolRequestType(n.method));
  }),
  gt = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.DidChangeWorkspaceFoldersNotification = t.WorkspaceFoldersRequest = void 0),
      ((t.WorkspaceFoldersRequest || (t.WorkspaceFoldersRequest = {})).type = new ht.ProtocolRequestType0(
        'workspace/workspaceFolders'
      )),
      ((
        t.DidChangeWorkspaceFoldersNotification || (t.DidChangeWorkspaceFoldersNotification = {})
      ).type = new ht.ProtocolNotificationType('workspace/didChangeWorkspaceFolders'));
  }),
  mt = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ConfigurationRequest = void 0),
      ((t.ConfigurationRequest || (t.ConfigurationRequest = {})).type = new ht.ProtocolRequestType(
        'workspace/configuration'
      ));
  }),
  yt = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ColorPresentationRequest = t.DocumentColorRequest = void 0),
      ((n = t.DocumentColorRequest || (t.DocumentColorRequest = {})).method = 'textDocument/documentColor'),
      (n.type = new ht.ProtocolRequestType(n.method)),
      ((t.ColorPresentationRequest || (t.ColorPresentationRequest = {})).type = new ht.ProtocolRequestType(
        'textDocument/colorPresentation'
      ));
  }),
  vt = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.FoldingRangeRequest = t.FoldingRangeKind = void 0),
      (function (e) {
        (e.Comment = 'comment'), (e.Imports = 'imports'), (e.Region = 'region');
      })(t.FoldingRangeKind || (t.FoldingRangeKind = {})),
      ((n = t.FoldingRangeRequest || (t.FoldingRangeRequest = {})).method = 'textDocument/foldingRange'),
      (n.type = new ht.ProtocolRequestType(n.method));
  }),
  bt = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.DeclarationRequest = void 0),
      ((n = t.DeclarationRequest || (t.DeclarationRequest = {})).method = 'textDocument/declaration'),
      (n.type = new ht.ProtocolRequestType(n.method));
  }),
  _t = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.SelectionRangeRequest = void 0),
      ((n = t.SelectionRangeRequest || (t.SelectionRangeRequest = {})).method = 'textDocument/selectionRange'),
      (n.type = new ht.ProtocolRequestType(n.method));
  }),
  wt = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WorkDoneProgressCancelNotification = t.WorkDoneProgressCreateRequest = t.WorkDoneProgress = void 0),
      ((n = t.WorkDoneProgress || (t.WorkDoneProgress = {})).type = new Oe.ProgressType()),
      (n.is = function (e) {
        return e === n.type;
      }),
      ((t.WorkDoneProgressCreateRequest || (t.WorkDoneProgressCreateRequest = {})).type = new ht.ProtocolRequestType(
        'window/workDoneProgress/create'
      )),
      ((
        t.WorkDoneProgressCancelNotification || (t.WorkDoneProgressCancelNotification = {})
      ).type = new ht.ProtocolNotificationType('window/workDoneProgress/cancel'));
  }),
  Rt = P(function (e, t) {
    var n, r, o;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.CallHierarchyOutgoingCallsRequest = t.CallHierarchyIncomingCallsRequest = t.CallHierarchyPrepareRequest = void 0),
      ((n = t.CallHierarchyPrepareRequest || (t.CallHierarchyPrepareRequest = {})).method =
        'textDocument/prepareCallHierarchy'),
      (n.type = new ht.ProtocolRequestType(n.method)),
      ((r = t.CallHierarchyIncomingCallsRequest || (t.CallHierarchyIncomingCallsRequest = {})).method =
        'callHierarchy/incomingCalls'),
      (r.type = new ht.ProtocolRequestType(r.method)),
      ((o = t.CallHierarchyOutgoingCallsRequest || (t.CallHierarchyOutgoingCallsRequest = {})).method =
        'callHierarchy/outgoingCalls'),
      (o.type = new ht.ProtocolRequestType(o.method));
  }),
  kt = P(function (e, t) {
    var n, r, o, i, s, a, c;
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
      ((r = t.SemanticTokenModifiers || (t.SemanticTokenModifiers = {})).declaration = 'declaration'),
      (r.definition = 'definition'),
      (r.readonly = 'readonly'),
      (r.static = 'static'),
      (r.deprecated = 'deprecated'),
      (r.abstract = 'abstract'),
      (r.async = 'async'),
      (r.modification = 'modification'),
      (r.documentation = 'documentation'),
      (r.defaultLibrary = 'defaultLibrary'),
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
      ((o = t.SemanticTokensRegistrationType || (t.SemanticTokensRegistrationType = {})).method =
        'textDocument/semanticTokens'),
      (o.type = new ht.RegistrationType(o.method)),
      ((i = t.SemanticTokensRequest || (t.SemanticTokensRequest = {})).method = 'textDocument/semanticTokens/full'),
      (i.type = new ht.ProtocolRequestType(i.method)),
      ((s = t.SemanticTokensDeltaRequest || (t.SemanticTokensDeltaRequest = {})).method =
        'textDocument/semanticTokens/full/delta'),
      (s.type = new ht.ProtocolRequestType(s.method)),
      ((a = t.SemanticTokensRangeRequest || (t.SemanticTokensRangeRequest = {})).method =
        'textDocument/semanticTokens/range'),
      (a.type = new ht.ProtocolRequestType(a.method)),
      ((c = t.SemanticTokensRefreshRequest || (t.SemanticTokensRefreshRequest = {})).method =
        'workspace/semanticTokens/refresh'),
      (c.type = new ht.ProtocolRequestType0(c.method));
  }),
  Ct = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ShowDocumentRequest = void 0),
      ((n = t.ShowDocumentRequest || (t.ShowDocumentRequest = {})).method = 'window/showDocument'),
      (n.type = new ht.ProtocolRequestType(n.method));
  }),
  Ot = P(function (e, t) {
    var n;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.LinkedEditingRangeRequest = void 0),
      ((n = t.LinkedEditingRangeRequest || (t.LinkedEditingRangeRequest = {})).method =
        'textDocument/linkedEditingRange'),
      (n.type = new ht.ProtocolRequestType(n.method));
  }),
  Tt = P(function (e, t) {
    var n, r, o, i, s, a, c;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WillDeleteFilesRequest = t.DidDeleteFilesNotification = t.DidRenameFilesNotification = t.WillRenameFilesRequest = t.DidCreateFilesNotification = t.WillCreateFilesRequest = t.FileOperationPatternKind = void 0),
      ((n = t.FileOperationPatternKind || (t.FileOperationPatternKind = {})).file = 'file'),
      (n.folder = 'folder'),
      ((r = t.WillCreateFilesRequest || (t.WillCreateFilesRequest = {})).method = 'workspace/willCreateFiles'),
      (r.type = new ht.ProtocolRequestType(r.method)),
      ((o = t.DidCreateFilesNotification || (t.DidCreateFilesNotification = {})).method = 'workspace/didCreateFiles'),
      (o.type = new ht.ProtocolNotificationType(o.method)),
      ((i = t.WillRenameFilesRequest || (t.WillRenameFilesRequest = {})).method = 'workspace/willRenameFiles'),
      (i.type = new ht.ProtocolRequestType(i.method)),
      ((s = t.DidRenameFilesNotification || (t.DidRenameFilesNotification = {})).method = 'workspace/didRenameFiles'),
      (s.type = new ht.ProtocolNotificationType(s.method)),
      ((a = t.DidDeleteFilesNotification || (t.DidDeleteFilesNotification = {})).method = 'workspace/didDeleteFiles'),
      (a.type = new ht.ProtocolNotificationType(a.method)),
      ((c = t.WillDeleteFilesRequest || (t.WillDeleteFilesRequest = {})).method = 'workspace/willDeleteFiles'),
      (c.type = new ht.ProtocolRequestType(c.method));
  }),
  Pt = P(function (e, t) {
    var n, r, o;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.MonikerRequest = t.MonikerKind = t.UniquenessLevel = void 0),
      ((n = t.UniquenessLevel || (t.UniquenessLevel = {})).document = 'document'),
      (n.project = 'project'),
      (n.group = 'group'),
      (n.scheme = 'scheme'),
      (n.global = 'global'),
      ((r = t.MonikerKind || (t.MonikerKind = {})).import = 'import'),
      (r.export = 'export'),
      (r.local = 'local'),
      ((o = t.MonikerRequest || (t.MonikerRequest = {})).method = 'textDocument/moniker'),
      (o.type = new ht.ProtocolRequestType(o.method));
  }),
  xt = P(function (e, t) {
    var n,
      r,
      o,
      i,
      s,
      a,
      c,
      u,
      l,
      h,
      d,
      f,
      p,
      g,
      m,
      y,
      v,
      b,
      _,
      w,
      R,
      k,
      C,
      O,
      T,
      P,
      x,
      S,
      E,
      q,
      D,
      M,
      j,
      N,
      A,
      F,
      I,
      L,
      W,
      $;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.DocumentLinkRequest = t.CodeLensRefreshRequest = t.CodeLensResolveRequest = t.CodeLensRequest = t.WorkspaceSymbolRequest = t.CodeActionResolveRequest = t.CodeActionRequest = t.DocumentSymbolRequest = t.DocumentHighlightRequest = t.ReferencesRequest = t.DefinitionRequest = t.SignatureHelpRequest = t.SignatureHelpTriggerKind = t.HoverRequest = t.CompletionResolveRequest = t.CompletionRequest = t.CompletionTriggerKind = t.PublishDiagnosticsNotification = t.WatchKind = t.FileChangeType = t.DidChangeWatchedFilesNotification = t.WillSaveTextDocumentWaitUntilRequest = t.WillSaveTextDocumentNotification = t.TextDocumentSaveReason = t.DidSaveTextDocumentNotification = t.DidCloseTextDocumentNotification = t.DidChangeTextDocumentNotification = t.TextDocumentContentChangeEvent = t.DidOpenTextDocumentNotification = t.TextDocumentSyncKind = t.TelemetryEventNotification = t.LogMessageNotification = t.ShowMessageRequest = t.ShowMessageNotification = t.MessageType = t.DidChangeConfigurationNotification = t.ExitNotification = t.ShutdownRequest = t.InitializedNotification = t.InitializeError = t.InitializeRequest = t.WorkDoneProgressOptions = t.TextDocumentRegistrationOptions = t.StaticRegistrationOptions = t.FailureHandlingKind = t.ResourceOperationKind = t.UnregistrationRequest = t.RegistrationRequest = t.DocumentSelector = t.DocumentFilter = void 0),
      (t.MonikerRequest = t.MonikerKind = t.UniquenessLevel = t.WillDeleteFilesRequest = t.DidDeleteFilesNotification = t.WillRenameFilesRequest = t.DidRenameFilesNotification = t.WillCreateFilesRequest = t.DidCreateFilesNotification = t.FileOperationPatternKind = t.LinkedEditingRangeRequest = t.ShowDocumentRequest = t.SemanticTokensRegistrationType = t.SemanticTokensRefreshRequest = t.SemanticTokensRangeRequest = t.SemanticTokensDeltaRequest = t.SemanticTokensRequest = t.TokenFormat = t.SemanticTokens = t.SemanticTokenModifiers = t.SemanticTokenTypes = t.CallHierarchyPrepareRequest = t.CallHierarchyOutgoingCallsRequest = t.CallHierarchyIncomingCallsRequest = t.WorkDoneProgressCancelNotification = t.WorkDoneProgressCreateRequest = t.WorkDoneProgress = t.SelectionRangeRequest = t.DeclarationRequest = t.FoldingRangeRequest = t.ColorPresentationRequest = t.DocumentColorRequest = t.ConfigurationRequest = t.DidChangeWorkspaceFoldersNotification = t.WorkspaceFoldersRequest = t.TypeDefinitionRequest = t.ImplementationRequest = t.ApplyWorkspaceEditRequest = t.ExecuteCommandRequest = t.PrepareRenameRequest = t.RenameRequest = t.PrepareSupportDefaultBehavior = t.DocumentOnTypeFormattingRequest = t.DocumentRangeFormattingRequest = t.DocumentFormattingRequest = t.DocumentLinkResolveRequest = void 0),
      Object.defineProperty(t, 'ImplementationRequest', {
        enumerable: !0,
        get: function () {
          return ft.ImplementationRequest;
        }
      }),
      Object.defineProperty(t, 'TypeDefinitionRequest', {
        enumerable: !0,
        get: function () {
          return pt.TypeDefinitionRequest;
        }
      }),
      Object.defineProperty(t, 'WorkspaceFoldersRequest', {
        enumerable: !0,
        get: function () {
          return gt.WorkspaceFoldersRequest;
        }
      }),
      Object.defineProperty(t, 'DidChangeWorkspaceFoldersNotification', {
        enumerable: !0,
        get: function () {
          return gt.DidChangeWorkspaceFoldersNotification;
        }
      }),
      Object.defineProperty(t, 'ConfigurationRequest', {
        enumerable: !0,
        get: function () {
          return mt.ConfigurationRequest;
        }
      }),
      Object.defineProperty(t, 'DocumentColorRequest', {
        enumerable: !0,
        get: function () {
          return yt.DocumentColorRequest;
        }
      }),
      Object.defineProperty(t, 'ColorPresentationRequest', {
        enumerable: !0,
        get: function () {
          return yt.ColorPresentationRequest;
        }
      }),
      Object.defineProperty(t, 'FoldingRangeRequest', {
        enumerable: !0,
        get: function () {
          return vt.FoldingRangeRequest;
        }
      }),
      Object.defineProperty(t, 'DeclarationRequest', {
        enumerable: !0,
        get: function () {
          return bt.DeclarationRequest;
        }
      }),
      Object.defineProperty(t, 'SelectionRangeRequest', {
        enumerable: !0,
        get: function () {
          return _t.SelectionRangeRequest;
        }
      }),
      Object.defineProperty(t, 'WorkDoneProgress', {
        enumerable: !0,
        get: function () {
          return wt.WorkDoneProgress;
        }
      }),
      Object.defineProperty(t, 'WorkDoneProgressCreateRequest', {
        enumerable: !0,
        get: function () {
          return wt.WorkDoneProgressCreateRequest;
        }
      }),
      Object.defineProperty(t, 'WorkDoneProgressCancelNotification', {
        enumerable: !0,
        get: function () {
          return wt.WorkDoneProgressCancelNotification;
        }
      }),
      Object.defineProperty(t, 'CallHierarchyIncomingCallsRequest', {
        enumerable: !0,
        get: function () {
          return Rt.CallHierarchyIncomingCallsRequest;
        }
      }),
      Object.defineProperty(t, 'CallHierarchyOutgoingCallsRequest', {
        enumerable: !0,
        get: function () {
          return Rt.CallHierarchyOutgoingCallsRequest;
        }
      }),
      Object.defineProperty(t, 'CallHierarchyPrepareRequest', {
        enumerable: !0,
        get: function () {
          return Rt.CallHierarchyPrepareRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokenTypes', {
        enumerable: !0,
        get: function () {
          return kt.SemanticTokenTypes;
        }
      }),
      Object.defineProperty(t, 'SemanticTokenModifiers', {
        enumerable: !0,
        get: function () {
          return kt.SemanticTokenModifiers;
        }
      }),
      Object.defineProperty(t, 'SemanticTokens', {
        enumerable: !0,
        get: function () {
          return kt.SemanticTokens;
        }
      }),
      Object.defineProperty(t, 'TokenFormat', {
        enumerable: !0,
        get: function () {
          return kt.TokenFormat;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensRequest', {
        enumerable: !0,
        get: function () {
          return kt.SemanticTokensRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensDeltaRequest', {
        enumerable: !0,
        get: function () {
          return kt.SemanticTokensDeltaRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensRangeRequest', {
        enumerable: !0,
        get: function () {
          return kt.SemanticTokensRangeRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensRefreshRequest', {
        enumerable: !0,
        get: function () {
          return kt.SemanticTokensRefreshRequest;
        }
      }),
      Object.defineProperty(t, 'SemanticTokensRegistrationType', {
        enumerable: !0,
        get: function () {
          return kt.SemanticTokensRegistrationType;
        }
      }),
      Object.defineProperty(t, 'ShowDocumentRequest', {
        enumerable: !0,
        get: function () {
          return Ct.ShowDocumentRequest;
        }
      }),
      Object.defineProperty(t, 'LinkedEditingRangeRequest', {
        enumerable: !0,
        get: function () {
          return Ot.LinkedEditingRangeRequest;
        }
      }),
      Object.defineProperty(t, 'FileOperationPatternKind', {
        enumerable: !0,
        get: function () {
          return Tt.FileOperationPatternKind;
        }
      }),
      Object.defineProperty(t, 'DidCreateFilesNotification', {
        enumerable: !0,
        get: function () {
          return Tt.DidCreateFilesNotification;
        }
      }),
      Object.defineProperty(t, 'WillCreateFilesRequest', {
        enumerable: !0,
        get: function () {
          return Tt.WillCreateFilesRequest;
        }
      }),
      Object.defineProperty(t, 'DidRenameFilesNotification', {
        enumerable: !0,
        get: function () {
          return Tt.DidRenameFilesNotification;
        }
      }),
      Object.defineProperty(t, 'WillRenameFilesRequest', {
        enumerable: !0,
        get: function () {
          return Tt.WillRenameFilesRequest;
        }
      }),
      Object.defineProperty(t, 'DidDeleteFilesNotification', {
        enumerable: !0,
        get: function () {
          return Tt.DidDeleteFilesNotification;
        }
      }),
      Object.defineProperty(t, 'WillDeleteFilesRequest', {
        enumerable: !0,
        get: function () {
          return Tt.WillDeleteFilesRequest;
        }
      }),
      Object.defineProperty(t, 'UniquenessLevel', {
        enumerable: !0,
        get: function () {
          return Pt.UniquenessLevel;
        }
      }),
      Object.defineProperty(t, 'MonikerKind', {
        enumerable: !0,
        get: function () {
          return Pt.MonikerKind;
        }
      }),
      Object.defineProperty(t, 'MonikerRequest', {
        enumerable: !0,
        get: function () {
          return Pt.MonikerRequest;
        }
      }),
      (function (e) {
        e.is = function (e) {
          const t = e;
          return dt.string(t.language) || dt.string(t.scheme) || dt.string(t.pattern);
        };
      })((n = t.DocumentFilter || (t.DocumentFilter = {}))),
      (function (e) {
        e.is = function (e) {
          if (!Array.isArray(e)) return !1;
          for (let t of e) if (!dt.string(t) && !n.is(t)) return !1;
          return !0;
        };
      })((r = t.DocumentSelector || (t.DocumentSelector = {}))),
      ((t.RegistrationRequest || (t.RegistrationRequest = {})).type = new ht.ProtocolRequestType(
        'client/registerCapability'
      )),
      ((t.UnregistrationRequest || (t.UnregistrationRequest = {})).type = new ht.ProtocolRequestType(
        'client/unregisterCapability'
      )),
      ((o = t.ResourceOperationKind || (t.ResourceOperationKind = {})).Create = 'create'),
      (o.Rename = 'rename'),
      (o.Delete = 'delete'),
      ((i = t.FailureHandlingKind || (t.FailureHandlingKind = {})).Abort = 'abort'),
      (i.Transactional = 'transactional'),
      (i.TextOnlyTransactional = 'textOnlyTransactional'),
      (i.Undo = 'undo'),
      ((t.StaticRegistrationOptions || (t.StaticRegistrationOptions = {})).hasId = function (e) {
        const t = e;
        return t && dt.string(t.id) && t.id.length > 0;
      }),
      ((t.TextDocumentRegistrationOptions || (t.TextDocumentRegistrationOptions = {})).is = function (e) {
        const t = e;
        return t && (null === t.documentSelector || r.is(t.documentSelector));
      }),
      ((s = t.WorkDoneProgressOptions || (t.WorkDoneProgressOptions = {})).is = function (e) {
        const t = e;
        return dt.objectLiteral(t) && (void 0 === t.workDoneProgress || dt.boolean(t.workDoneProgress));
      }),
      (s.hasWorkDoneProgress = function (e) {
        const t = e;
        return t && dt.boolean(t.workDoneProgress);
      }),
      ((t.InitializeRequest || (t.InitializeRequest = {})).type = new ht.ProtocolRequestType('initialize')),
      ((t.InitializeError || (t.InitializeError = {})).unknownProtocolVersion = 1),
      ((t.InitializedNotification || (t.InitializedNotification = {})).type = new ht.ProtocolNotificationType(
        'initialized'
      )),
      ((t.ShutdownRequest || (t.ShutdownRequest = {})).type = new ht.ProtocolRequestType0('shutdown')),
      ((t.ExitNotification || (t.ExitNotification = {})).type = new ht.ProtocolNotificationType0('exit')),
      ((
        t.DidChangeConfigurationNotification || (t.DidChangeConfigurationNotification = {})
      ).type = new ht.ProtocolNotificationType('workspace/didChangeConfiguration')),
      ((a = t.MessageType || (t.MessageType = {})).Error = 1),
      (a.Warning = 2),
      (a.Info = 3),
      (a.Log = 4),
      ((t.ShowMessageNotification || (t.ShowMessageNotification = {})).type = new ht.ProtocolNotificationType(
        'window/showMessage'
      )),
      ((t.ShowMessageRequest || (t.ShowMessageRequest = {})).type = new ht.ProtocolRequestType(
        'window/showMessageRequest'
      )),
      ((t.LogMessageNotification || (t.LogMessageNotification = {})).type = new ht.ProtocolNotificationType(
        'window/logMessage'
      )),
      ((t.TelemetryEventNotification || (t.TelemetryEventNotification = {})).type = new ht.ProtocolNotificationType(
        'telemetry/event'
      )),
      ((c = t.TextDocumentSyncKind || (t.TextDocumentSyncKind = {})).None = 0),
      (c.Full = 1),
      (c.Incremental = 2),
      ((u = t.DidOpenTextDocumentNotification || (t.DidOpenTextDocumentNotification = {})).method =
        'textDocument/didOpen'),
      (u.type = new ht.ProtocolNotificationType(u.method)),
      ((l = t.TextDocumentContentChangeEvent || (t.TextDocumentContentChangeEvent = {})).isIncremental = function (e) {
        let t = e;
        return (
          null != t &&
          'string' == typeof t.text &&
          void 0 !== t.range &&
          (void 0 === t.rangeLength || 'number' == typeof t.rangeLength)
        );
      }),
      (l.isFull = function (e) {
        let t = e;
        return null != t && 'string' == typeof t.text && void 0 === t.range && void 0 === t.rangeLength;
      }),
      ((h = t.DidChangeTextDocumentNotification || (t.DidChangeTextDocumentNotification = {})).method =
        'textDocument/didChange'),
      (h.type = new ht.ProtocolNotificationType(h.method)),
      ((d = t.DidCloseTextDocumentNotification || (t.DidCloseTextDocumentNotification = {})).method =
        'textDocument/didClose'),
      (d.type = new ht.ProtocolNotificationType(d.method)),
      ((f = t.DidSaveTextDocumentNotification || (t.DidSaveTextDocumentNotification = {})).method =
        'textDocument/didSave'),
      (f.type = new ht.ProtocolNotificationType(f.method)),
      ((p = t.TextDocumentSaveReason || (t.TextDocumentSaveReason = {})).Manual = 1),
      (p.AfterDelay = 2),
      (p.FocusOut = 3),
      ((g = t.WillSaveTextDocumentNotification || (t.WillSaveTextDocumentNotification = {})).method =
        'textDocument/willSave'),
      (g.type = new ht.ProtocolNotificationType(g.method)),
      ((m = t.WillSaveTextDocumentWaitUntilRequest || (t.WillSaveTextDocumentWaitUntilRequest = {})).method =
        'textDocument/willSaveWaitUntil'),
      (m.type = new ht.ProtocolRequestType(m.method)),
      ((
        t.DidChangeWatchedFilesNotification || (t.DidChangeWatchedFilesNotification = {})
      ).type = new ht.ProtocolNotificationType('workspace/didChangeWatchedFiles')),
      ((y = t.FileChangeType || (t.FileChangeType = {})).Created = 1),
      (y.Changed = 2),
      (y.Deleted = 3),
      ((v = t.WatchKind || (t.WatchKind = {})).Create = 1),
      (v.Change = 2),
      (v.Delete = 4),
      ((
        t.PublishDiagnosticsNotification || (t.PublishDiagnosticsNotification = {})
      ).type = new ht.ProtocolNotificationType('textDocument/publishDiagnostics')),
      ((b = t.CompletionTriggerKind || (t.CompletionTriggerKind = {})).Invoked = 1),
      (b.TriggerCharacter = 2),
      (b.TriggerForIncompleteCompletions = 3),
      ((_ = t.CompletionRequest || (t.CompletionRequest = {})).method = 'textDocument/completion'),
      (_.type = new ht.ProtocolRequestType(_.method)),
      ((w = t.CompletionResolveRequest || (t.CompletionResolveRequest = {})).method = 'completionItem/resolve'),
      (w.type = new ht.ProtocolRequestType(w.method)),
      ((R = t.HoverRequest || (t.HoverRequest = {})).method = 'textDocument/hover'),
      (R.type = new ht.ProtocolRequestType(R.method)),
      ((k = t.SignatureHelpTriggerKind || (t.SignatureHelpTriggerKind = {})).Invoked = 1),
      (k.TriggerCharacter = 2),
      (k.ContentChange = 3),
      ((C = t.SignatureHelpRequest || (t.SignatureHelpRequest = {})).method = 'textDocument/signatureHelp'),
      (C.type = new ht.ProtocolRequestType(C.method)),
      ((O = t.DefinitionRequest || (t.DefinitionRequest = {})).method = 'textDocument/definition'),
      (O.type = new ht.ProtocolRequestType(O.method)),
      ((T = t.ReferencesRequest || (t.ReferencesRequest = {})).method = 'textDocument/references'),
      (T.type = new ht.ProtocolRequestType(T.method)),
      ((P = t.DocumentHighlightRequest || (t.DocumentHighlightRequest = {})).method = 'textDocument/documentHighlight'),
      (P.type = new ht.ProtocolRequestType(P.method)),
      ((x = t.DocumentSymbolRequest || (t.DocumentSymbolRequest = {})).method = 'textDocument/documentSymbol'),
      (x.type = new ht.ProtocolRequestType(x.method)),
      ((S = t.CodeActionRequest || (t.CodeActionRequest = {})).method = 'textDocument/codeAction'),
      (S.type = new ht.ProtocolRequestType(S.method)),
      ((E = t.CodeActionResolveRequest || (t.CodeActionResolveRequest = {})).method = 'codeAction/resolve'),
      (E.type = new ht.ProtocolRequestType(E.method)),
      ((q = t.WorkspaceSymbolRequest || (t.WorkspaceSymbolRequest = {})).method = 'workspace/symbol'),
      (q.type = new ht.ProtocolRequestType(q.method)),
      ((D = t.CodeLensRequest || (t.CodeLensRequest = {})).method = 'textDocument/codeLens'),
      (D.type = new ht.ProtocolRequestType(D.method)),
      ((M = t.CodeLensResolveRequest || (t.CodeLensResolveRequest = {})).method = 'codeLens/resolve'),
      (M.type = new ht.ProtocolRequestType(M.method)),
      ((j = t.CodeLensRefreshRequest || (t.CodeLensRefreshRequest = {})).method = 'workspace/codeLens/refresh'),
      (j.type = new ht.ProtocolRequestType0(j.method)),
      ((N = t.DocumentLinkRequest || (t.DocumentLinkRequest = {})).method = 'textDocument/documentLink'),
      (N.type = new ht.ProtocolRequestType(N.method)),
      ((A = t.DocumentLinkResolveRequest || (t.DocumentLinkResolveRequest = {})).method = 'documentLink/resolve'),
      (A.type = new ht.ProtocolRequestType(A.method)),
      ((F = t.DocumentFormattingRequest || (t.DocumentFormattingRequest = {})).method = 'textDocument/formatting'),
      (F.type = new ht.ProtocolRequestType(F.method)),
      ((I = t.DocumentRangeFormattingRequest || (t.DocumentRangeFormattingRequest = {})).method =
        'textDocument/rangeFormatting'),
      (I.type = new ht.ProtocolRequestType(I.method)),
      ((L = t.DocumentOnTypeFormattingRequest || (t.DocumentOnTypeFormattingRequest = {})).method =
        'textDocument/onTypeFormatting'),
      (L.type = new ht.ProtocolRequestType(L.method)),
      ((t.PrepareSupportDefaultBehavior || (t.PrepareSupportDefaultBehavior = {})).Identifier = 1),
      ((W = t.RenameRequest || (t.RenameRequest = {})).method = 'textDocument/rename'),
      (W.type = new ht.ProtocolRequestType(W.method)),
      (($ = t.PrepareRenameRequest || (t.PrepareRenameRequest = {})).method = 'textDocument/prepareRename'),
      ($.type = new ht.ProtocolRequestType($.method)),
      ((t.ExecuteCommandRequest || (t.ExecuteCommandRequest = {})).type = new ht.ProtocolRequestType(
        'workspace/executeCommand'
      )),
      ((t.ApplyWorkspaceEditRequest || (t.ApplyWorkspaceEditRequest = {})).type = new ht.ProtocolRequestType(
        'workspace/applyEdit'
      ));
  }),
  St = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createProtocolConnection = void 0),
      (t.createProtocolConnection = function (e, t, n, r) {
        return Oe.ConnectionStrategy.is(r) && (r = { connectionStrategy: r }), Oe.createMessageConnection(e, t, n, r);
      });
  }),
  Et = T(lt),
  qt = P(function (e, t) {
    var n,
      r =
        (O && O.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      o =
        (O && O.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.LSPErrorCodes = t.createProtocolConnection = void 0),
      o(Oe, t),
      o(Et, t),
      o(ht, t),
      o(xt, t),
      Object.defineProperty(t, 'createProtocolConnection', {
        enumerable: !0,
        get: function () {
          return St.createProtocolConnection;
        }
      }),
      ((n = t.LSPErrorCodes || (t.LSPErrorCodes = {})).lspReservedErrorRangeStart = -32899),
      (n.ContentModified = -32801),
      (n.RequestCancelled = -32800),
      (n.lspReservedErrorRangeEnd = -32800);
  }),
  Dt = P(function (e, t) {
    var n =
        (O && O.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      r =
        (O && O.__exportStar) ||
        function (e, t) {
          for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createProtocolConnection = void 0),
      r(Te, t),
      r(qt, t),
      (t.createProtocolConnection = function (e, t, n, r) {
        return Te.createMessageConnection(e, t, n, r);
      });
  }),
  Mt = P(function (e, t) {
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
    class r extends n {
      constructor() {
        super(
          [
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            '-',
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            '-',
            '4',
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            '-',
            r._oneOf(r._timeHighBits),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            '-',
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex(),
            r._randomHex()
          ].join('')
        );
      }
      static _oneOf(e) {
        return e[Math.floor(e.length * Math.random())];
      }
      static _randomHex() {
        return r._oneOf(r._chars);
      }
    }
    function o() {
      return new r();
    }
    (r._chars = ['0', '1', '2', '3', '4', '5', '6', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']),
      (r._timeHighBits = ['8', '9', 'a', 'b']),
      (t.empty = new n('00000000-0000-0000-0000-000000000000')),
      (t.v4 = o);
    const i = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    function s(e) {
      return i.test(e);
    }
    (t.isUUID = s),
      (t.parse = function (e) {
        if (!s(e)) throw new Error('invalid uuid');
        return new n(e);
      }),
      (t.generateUuid = function () {
        return o().asHex();
      });
  }),
  jt = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.attachPartialResult = t.ProgressFeature = t.attachWorkDone = void 0);
    class n {
      constructor(e, t) {
        (this._connection = e), (this._token = t), n.Instances.set(this._token, this);
      }
      begin(e, t, n, r) {
        let o = { kind: 'begin', title: e, percentage: t, message: n, cancellable: r };
        this._connection.sendProgress(Dt.WorkDoneProgress.type, this._token, o);
      }
      report(e, t) {
        let n = { kind: 'report' };
        'number' == typeof e ? ((n.percentage = e), void 0 !== t && (n.message = t)) : (n.message = e),
          this._connection.sendProgress(Dt.WorkDoneProgress.type, this._token, n);
      }
      done() {
        n.Instances.delete(this._token),
          this._connection.sendProgress(Dt.WorkDoneProgress.type, this._token, { kind: 'end' });
      }
    }
    n.Instances = new Map();
    class r extends n {
      constructor(e, t) {
        super(e, t), (this._source = new Dt.CancellationTokenSource());
      }
      get token() {
        return this._source.token;
      }
      done() {
        this._source.dispose(), super.done();
      }
      cancel() {
        this._source.cancel();
      }
    }
    class o {
      constructor() {}
      begin() {}
      report() {}
      done() {}
    }
    class i extends o {
      constructor() {
        super(), (this._source = new Dt.CancellationTokenSource());
      }
      get token() {
        return this._source.token;
      }
      done() {
        this._source.dispose();
      }
      cancel() {
        this._source.cancel();
      }
    }
    t.attachWorkDone = function (e, t) {
      if (void 0 === t || void 0 === t.workDoneToken) return new o();
      const r = t.workDoneToken;
      return delete t.workDoneToken, new n(e, r);
    };
    var s;
    (t.ProgressFeature = e =>
      class extends e {
        constructor() {
          super(), (this._progressSupported = !1);
        }
        initialize(e) {
          var t;
          !0 === (null === (t = null == e ? void 0 : e.window) || void 0 === t ? void 0 : t.workDoneProgress) &&
            ((this._progressSupported = !0),
            this.connection.onNotification(Dt.WorkDoneProgressCancelNotification.type, e => {
              let t = n.Instances.get(e.token);
              (t instanceof r || t instanceof i) && t.cancel();
            }));
        }
        attachWorkDoneProgress(e) {
          return void 0 === e ? new o() : new n(this.connection, e);
        }
        createWorkDoneProgress() {
          if (this._progressSupported) {
            const e = Mt.generateUuid();
            return this.connection
              .sendRequest(Dt.WorkDoneProgressCreateRequest.type, { token: e })
              .then(() => new r(this.connection, e));
          }
          return Promise.resolve(new i());
        }
      }),
      (function (e) {
        e.type = new Dt.ProgressType();
      })(s || (s = {}));
    class a {
      constructor(e, t) {
        (this._connection = e), (this._token = t);
      }
      report(e) {
        this._connection.sendProgress(s.type, this._token, e);
      }
    }
    t.attachPartialResult = function (e, t) {
      if (void 0 === t || void 0 === t.partialResultToken) return;
      const n = t.partialResultToken;
      return delete t.partialResultToken, new a(e, n);
    };
  }),
  Nt = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ConfigurationFeature = void 0);
    t.ConfigurationFeature = e =>
      class extends e {
        getConfiguration(e) {
          return e
            ? S.string(e)
              ? this._getConfiguration({ section: e })
              : this._getConfiguration(e)
            : this._getConfiguration({});
        }
        _getConfiguration(e) {
          let t = { items: Array.isArray(e) ? e : [e] };
          return this.connection.sendRequest(Dt.ConfigurationRequest.type, t).then(t => (Array.isArray(e) ? t : t[0]));
        }
      };
  }),
  At = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.WorkspaceFoldersFeature = void 0);
    t.WorkspaceFoldersFeature = e =>
      class extends e {
        initialize(e) {
          let t = e.workspace;
          t &&
            t.workspaceFolders &&
            ((this._onDidChangeWorkspaceFolders = new Dt.Emitter()),
            this.connection.onNotification(Dt.DidChangeWorkspaceFoldersNotification.type, e => {
              this._onDidChangeWorkspaceFolders.fire(e.event);
            }));
        }
        getWorkspaceFolders() {
          return this.connection.sendRequest(Dt.WorkspaceFoldersRequest.type);
        }
        get onDidChangeWorkspaceFolders() {
          if (!this._onDidChangeWorkspaceFolders)
            throw new Error("Client doesn't support sending workspace folder change events.");
          return (
            this._unregistration ||
              (this._unregistration = this.connection.client.register(Dt.DidChangeWorkspaceFoldersNotification.type)),
            this._onDidChangeWorkspaceFolders.event
          );
        }
      };
  }),
  Ft = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.CallHierarchyFeature = void 0);
    t.CallHierarchyFeature = e =>
      class extends e {
        get callHierarchy() {
          return {
            onPrepare: e => {
              this.connection.onRequest(Dt.CallHierarchyPrepareRequest.type, (t, n) =>
                e(t, n, this.attachWorkDoneProgress(t), void 0)
              );
            },
            onIncomingCalls: e => {
              const t = Dt.CallHierarchyIncomingCallsRequest.type;
              this.connection.onRequest(t, (n, r) =>
                e(n, r, this.attachWorkDoneProgress(n), this.attachPartialResultProgress(t, n))
              );
            },
            onOutgoingCalls: e => {
              const t = Dt.CallHierarchyOutgoingCallsRequest.type;
              this.connection.onRequest(t, (n, r) =>
                e(n, r, this.attachWorkDoneProgress(n), this.attachPartialResultProgress(t, n))
              );
            }
          };
        }
      };
  }),
  It = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.SemanticTokensBuilder = t.SemanticTokensFeature = void 0);
    t.SemanticTokensFeature = e =>
      class extends e {
        get semanticTokens() {
          return {
            on: e => {
              const t = Dt.SemanticTokensRequest.type;
              this.connection.onRequest(t, (n, r) =>
                e(n, r, this.attachWorkDoneProgress(n), this.attachPartialResultProgress(t, n))
              );
            },
            onDelta: e => {
              const t = Dt.SemanticTokensDeltaRequest.type;
              this.connection.onRequest(t, (n, r) =>
                e(n, r, this.attachWorkDoneProgress(n), this.attachPartialResultProgress(t, n))
              );
            },
            onRange: e => {
              const t = Dt.SemanticTokensRangeRequest.type;
              this.connection.onRequest(t, (n, r) =>
                e(n, r, this.attachWorkDoneProgress(n), this.attachPartialResultProgress(t, n))
              );
            }
          };
        }
      };
    t.SemanticTokensBuilder = class {
      constructor() {
        (this._prevData = void 0), this.initialize();
      }
      initialize() {
        (this._id = Date.now()), (this._prevLine = 0), (this._prevChar = 0), (this._data = []), (this._dataLen = 0);
      }
      push(e, t, n, r, o) {
        let i = e,
          s = t;
        this._dataLen > 0 && ((i -= this._prevLine), 0 === i && (s -= this._prevChar)),
          (this._data[this._dataLen++] = i),
          (this._data[this._dataLen++] = s),
          (this._data[this._dataLen++] = n),
          (this._data[this._dataLen++] = r),
          (this._data[this._dataLen++] = o),
          (this._prevLine = e),
          (this._prevChar = t);
      }
      get id() {
        return this._id.toString();
      }
      previousResult(e) {
        this.id === e && (this._prevData = this._data), this.initialize();
      }
      build() {
        return (this._prevData = void 0), { resultId: this.id, data: this._data };
      }
      canBuildEdits() {
        return void 0 !== this._prevData;
      }
      buildEdits() {
        if (void 0 !== this._prevData) {
          const e = this._prevData.length,
            t = this._data.length;
          let n = 0;
          for (; n < t && n < e && this._prevData[n] === this._data[n]; ) n++;
          if (n < t && n < e) {
            let r = 0;
            for (; r < t && r < e && this._prevData[e - 1 - r] === this._data[t - 1 - r]; ) r++;
            const o = this._data.slice(n, t - r);
            return { resultId: this.id, edits: [{ start: n, deleteCount: e - r - n, data: o }] };
          }
          return n < t
            ? { resultId: this.id, edits: [{ start: n, deleteCount: 0, data: this._data.slice(n) }] }
            : n < e
            ? { resultId: this.id, edits: [{ start: n, deleteCount: e - n }] }
            : { resultId: this.id, edits: [] };
        }
        return this.build();
      }
    };
  }),
  Lt = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ShowDocumentFeature = void 0);
    t.ShowDocumentFeature = e =>
      class extends e {
        showDocument(e) {
          return this.connection.sendRequest(Dt.ShowDocumentRequest.type, e);
        }
      };
  }),
  Wt = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.FileOperationsFeature = void 0);
    t.FileOperationsFeature = e =>
      class extends e {
        onDidCreateFiles(e) {
          this.connection.onNotification(Dt.DidCreateFilesNotification.type, t => {
            e(t);
          });
        }
        onDidRenameFiles(e) {
          this.connection.onNotification(Dt.DidRenameFilesNotification.type, t => {
            e(t);
          });
        }
        onDidDeleteFiles(e) {
          this.connection.onNotification(Dt.DidDeleteFilesNotification.type, t => {
            e(t);
          });
        }
        onWillCreateFiles(e) {
          return this.connection.onRequest(Dt.WillCreateFilesRequest.type, (t, n) => e(t, n));
        }
        onWillRenameFiles(e) {
          return this.connection.onRequest(Dt.WillRenameFilesRequest.type, (t, n) => e(t, n));
        }
        onWillDeleteFiles(e) {
          return this.connection.onRequest(Dt.WillDeleteFilesRequest.type, (t, n) => e(t, n));
        }
      };
  }),
  $t = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.LinkedEditingRangeFeature = void 0);
    t.LinkedEditingRangeFeature = e =>
      class extends e {
        onLinkedEditingRange(e) {
          this.connection.onRequest(Dt.LinkedEditingRangeRequest.type, (t, n) =>
            e(t, n, this.attachWorkDoneProgress(t), void 0)
          );
        }
      };
  }),
  Ht = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.MonikerFeature = void 0);
    t.MonikerFeature = e =>
      class extends e {
        get moniker() {
          return {
            on: e => {
              const t = Dt.MonikerRequest.type;
              this.connection.onRequest(t, (n, r) =>
                e(n, r, this.attachWorkDoneProgress(n), this.attachPartialResultProgress(t, n))
              );
            }
          };
        }
      };
  }),
  Bt = P(function (e, t) {
    function n(e) {
      if (null !== e) return e;
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createConnection = t.combineFeatures = t.combineLanguagesFeatures = t.combineWorkspaceFeatures = t.combineWindowFeatures = t.combineClientFeatures = t.combineTracerFeatures = t.combineTelemetryFeatures = t.combineConsoleFeatures = t._LanguagesImpl = t.BulkUnregistration = t.BulkRegistration = t.ErrorMessageTracker = t.TextDocuments = void 0);
    t.TextDocuments = class {
      constructor(e) {
        (this._documents = Object.create(null)),
          (this._configuration = e),
          (this._onDidChangeContent = new Dt.Emitter()),
          (this._onDidOpen = new Dt.Emitter()),
          (this._onDidClose = new Dt.Emitter()),
          (this._onDidSave = new Dt.Emitter()),
          (this._onWillSave = new Dt.Emitter());
      }
      get onDidChangeContent() {
        return this._onDidChangeContent.event;
      }
      get onDidOpen() {
        return this._onDidOpen.event;
      }
      get onWillSave() {
        return this._onWillSave.event;
      }
      onWillSaveWaitUntil(e) {
        this._willSaveWaitUntil = e;
      }
      get onDidSave() {
        return this._onDidSave.event;
      }
      get onDidClose() {
        return this._onDidClose.event;
      }
      get(e) {
        return this._documents[e];
      }
      all() {
        return Object.keys(this._documents).map(e => this._documents[e]);
      }
      keys() {
        return Object.keys(this._documents);
      }
      listen(e) {
        (e.__textDocumentSync = Dt.TextDocumentSyncKind.Full),
          e.onDidOpenTextDocument(e => {
            let t = e.textDocument,
              n = this._configuration.create(t.uri, t.languageId, t.version, t.text);
            this._documents[t.uri] = n;
            let r = Object.freeze({ document: n });
            this._onDidOpen.fire(r), this._onDidChangeContent.fire(r);
          }),
          e.onDidChangeTextDocument(e => {
            let t = e.textDocument,
              n = e.contentChanges;
            if (0 === n.length) return;
            let r = this._documents[t.uri];
            const { version: o } = t;
            if (null == o)
              throw new Error(`Received document change event for ${t.uri} without valid version identifier`);
            (r = this._configuration.update(r, n, o)),
              (this._documents[t.uri] = r),
              this._onDidChangeContent.fire(Object.freeze({ document: r }));
          }),
          e.onDidCloseTextDocument(e => {
            let t = this._documents[e.textDocument.uri];
            t && (delete this._documents[e.textDocument.uri], this._onDidClose.fire(Object.freeze({ document: t })));
          }),
          e.onWillSaveTextDocument(e => {
            let t = this._documents[e.textDocument.uri];
            t && this._onWillSave.fire(Object.freeze({ document: t, reason: e.reason }));
          }),
          e.onWillSaveTextDocumentWaitUntil((e, t) => {
            let n = this._documents[e.textDocument.uri];
            return n && this._willSaveWaitUntil
              ? this._willSaveWaitUntil(Object.freeze({ document: n, reason: e.reason }), t)
              : [];
          }),
          e.onDidSaveTextDocument(e => {
            let t = this._documents[e.textDocument.uri];
            t && this._onDidSave.fire(Object.freeze({ document: t }));
          });
      }
    };
    t.ErrorMessageTracker = class {
      constructor() {
        this._messages = Object.create(null);
      }
      add(e) {
        let t = this._messages[e];
        t || (t = 0), t++, (this._messages[e] = t);
      }
      sendErrors(e) {
        Object.keys(this._messages).forEach(t => {
          e.window.showErrorMessage(t);
        });
      }
    };
    class r {
      constructor() {}
      rawAttach(e) {
        this._rawConnection = e;
      }
      attach(e) {
        this._connection = e;
      }
      get connection() {
        if (!this._connection) throw new Error('Remote is not attached to a connection yet.');
        return this._connection;
      }
      fillServerCapabilities(e) {}
      initialize(e) {}
      error(e) {
        this.send(Dt.MessageType.Error, e);
      }
      warn(e) {
        this.send(Dt.MessageType.Warning, e);
      }
      info(e) {
        this.send(Dt.MessageType.Info, e);
      }
      log(e) {
        this.send(Dt.MessageType.Log, e);
      }
      send(e, t) {
        this._rawConnection &&
          this._rawConnection.sendNotification(Dt.LogMessageNotification.type, { type: e, message: t });
      }
    }
    const o = Lt.ShowDocumentFeature(
      jt.ProgressFeature(
        class {
          constructor() {}
          attach(e) {
            this._connection = e;
          }
          get connection() {
            if (!this._connection) throw new Error('Remote is not attached to a connection yet.');
            return this._connection;
          }
          initialize(e) {}
          fillServerCapabilities(e) {}
          showErrorMessage(e, ...t) {
            let r = { type: Dt.MessageType.Error, message: e, actions: t };
            return this.connection.sendRequest(Dt.ShowMessageRequest.type, r).then(n);
          }
          showWarningMessage(e, ...t) {
            let r = { type: Dt.MessageType.Warning, message: e, actions: t };
            return this.connection.sendRequest(Dt.ShowMessageRequest.type, r).then(n);
          }
          showInformationMessage(e, ...t) {
            let r = { type: Dt.MessageType.Info, message: e, actions: t };
            return this.connection.sendRequest(Dt.ShowMessageRequest.type, r).then(n);
          }
        }
      )
    );
    (t.BulkRegistration || (t.BulkRegistration = {})).create = function () {
      return new i();
    };
    class i {
      constructor() {
        (this._registrations = []), (this._registered = new Set());
      }
      add(e, t) {
        const n = S.string(e) ? e : e.method;
        if (this._registered.has(n)) throw new Error(n + ' is already added to this registration');
        const r = Mt.generateUuid();
        this._registrations.push({ id: r, method: n, registerOptions: t || {} }), this._registered.add(n);
      }
      asRegistrationParams() {
        return { registrations: this._registrations };
      }
    }
    (t.BulkUnregistration || (t.BulkUnregistration = {})).create = function () {
      return new s(void 0, []);
    };
    class s {
      constructor(e, t) {
        (this._connection = e),
          (this._unregistrations = new Map()),
          t.forEach(e => {
            this._unregistrations.set(e.method, e);
          });
      }
      get isAttached() {
        return !!this._connection;
      }
      attach(e) {
        this._connection = e;
      }
      add(e) {
        this._unregistrations.set(e.method, e);
      }
      dispose() {
        let e = [];
        for (let t of this._unregistrations.values()) e.push(t);
        let t = { unregisterations: e };
        this._connection.sendRequest(Dt.UnregistrationRequest.type, t).then(void 0, e => {
          this._connection.console.info('Bulk unregistration failed.');
        });
      }
      disposeSingle(e) {
        const t = S.string(e) ? e : e.method,
          n = this._unregistrations.get(t);
        if (!n) return !1;
        let r = { unregisterations: [n] };
        return (
          this._connection.sendRequest(Dt.UnregistrationRequest.type, r).then(
            () => {
              this._unregistrations.delete(t);
            },
            e => {
              this._connection.console.info(`Un-registering request handler for ${n.id} failed.`);
            }
          ),
          !0
        );
      }
    }
    class a {
      attach(e) {
        this._connection = e;
      }
      get connection() {
        if (!this._connection) throw new Error('Remote is not attached to a connection yet.');
        return this._connection;
      }
      initialize(e) {}
      fillServerCapabilities(e) {}
      register(e, t, n) {
        return e instanceof i
          ? this.registerMany(e)
          : e instanceof s
          ? this.registerSingle1(e, t, n)
          : this.registerSingle2(e, t);
      }
      registerSingle1(e, t, n) {
        const r = S.string(t) ? t : t.method,
          o = Mt.generateUuid();
        let i = { registrations: [{ id: o, method: r, registerOptions: n || {} }] };
        return (
          e.isAttached || e.attach(this.connection),
          this.connection.sendRequest(Dt.RegistrationRequest.type, i).then(
            t => (e.add({ id: o, method: r }), e),
            e => (this.connection.console.info(`Registering request handler for ${r} failed.`), Promise.reject(e))
          )
        );
      }
      registerSingle2(e, t) {
        const n = S.string(e) ? e : e.method,
          r = Mt.generateUuid();
        let o = { registrations: [{ id: r, method: n, registerOptions: t || {} }] };
        return this.connection.sendRequest(Dt.RegistrationRequest.type, o).then(
          e =>
            Dt.Disposable.create(() => {
              this.unregisterSingle(r, n);
            }),
          e => (this.connection.console.info(`Registering request handler for ${n} failed.`), Promise.reject(e))
        );
      }
      unregisterSingle(e, t) {
        let n = { unregisterations: [{ id: e, method: t }] };
        return this.connection.sendRequest(Dt.UnregistrationRequest.type, n).then(void 0, t => {
          this.connection.console.info(`Un-registering request handler for ${e} failed.`);
        });
      }
      registerMany(e) {
        let t = e.asRegistrationParams();
        return this.connection.sendRequest(Dt.RegistrationRequest.type, t).then(
          () =>
            new s(
              this._connection,
              t.registrations.map(e => ({ id: e.id, method: e.method }))
            ),
          e => (this.connection.console.info('Bulk registration failed.'), Promise.reject(e))
        );
      }
    }
    const c = Wt.FileOperationsFeature(
      At.WorkspaceFoldersFeature(
        Nt.ConfigurationFeature(
          class {
            constructor() {}
            attach(e) {
              this._connection = e;
            }
            get connection() {
              if (!this._connection) throw new Error('Remote is not attached to a connection yet.');
              return this._connection;
            }
            initialize(e) {}
            fillServerCapabilities(e) {}
            applyEdit(e) {
              let t = (n = e) && n.edit ? e : { edit: e };
              var n;
              return this.connection.sendRequest(Dt.ApplyWorkspaceEditRequest.type, t);
            }
          }
        )
      )
    );
    class u {
      constructor() {
        this._trace = Dt.Trace.Off;
      }
      attach(e) {
        this._connection = e;
      }
      get connection() {
        if (!this._connection) throw new Error('Remote is not attached to a connection yet.');
        return this._connection;
      }
      initialize(e) {}
      fillServerCapabilities(e) {}
      set trace(e) {
        this._trace = e;
      }
      log(e, t) {
        this._trace !== Dt.Trace.Off &&
          this.connection.sendNotification(Dt.LogTraceNotification.type, {
            message: e,
            verbose: this._trace === Dt.Trace.Verbose ? t : void 0
          });
      }
    }
    class l {
      constructor() {}
      attach(e) {
        this._connection = e;
      }
      get connection() {
        if (!this._connection) throw new Error('Remote is not attached to a connection yet.');
        return this._connection;
      }
      initialize(e) {}
      fillServerCapabilities(e) {}
      logEvent(e) {
        this.connection.sendNotification(Dt.TelemetryEventNotification.type, e);
      }
    }
    class h {
      constructor() {}
      attach(e) {
        this._connection = e;
      }
      get connection() {
        if (!this._connection) throw new Error('Remote is not attached to a connection yet.');
        return this._connection;
      }
      initialize(e) {}
      fillServerCapabilities(e) {}
      attachWorkDoneProgress(e) {
        return jt.attachWorkDone(this.connection, e);
      }
      attachPartialResultProgress(e, t) {
        return jt.attachPartialResult(this.connection, t);
      }
    }
    t._LanguagesImpl = h;
    const d = Ht.MonikerFeature($t.LinkedEditingRangeFeature(It.SemanticTokensFeature(Ft.CallHierarchyFeature(h))));
    function f(e, t) {
      return function (n) {
        return t(e(n));
      };
    }
    function p(e, t) {
      return function (n) {
        return t(e(n));
      };
    }
    function g(e, t) {
      return function (n) {
        return t(e(n));
      };
    }
    function m(e, t) {
      return function (n) {
        return t(e(n));
      };
    }
    function y(e, t) {
      return function (n) {
        return t(e(n));
      };
    }
    function v(e, t) {
      return function (n) {
        return t(e(n));
      };
    }
    (t.combineConsoleFeatures = f),
      (t.combineTelemetryFeatures = p),
      (t.combineTracerFeatures = g),
      (t.combineClientFeatures = m),
      (t.combineWindowFeatures = y),
      (t.combineWorkspaceFeatures = v),
      (t.combineLanguagesFeatures = function (e, t) {
        return function (n) {
          return t(e(n));
        };
      }),
      (t.combineFeatures = function (e, t) {
        function n(e, t, n) {
          return e && t ? n(e, t) : e || t;
        }
        return {
          __brand: 'features',
          console: n(e.console, t.console, f),
          tracer: n(e.tracer, t.tracer, g),
          telemetry: n(e.telemetry, t.telemetry, p),
          client: n(e.client, t.client, m),
          window: n(e.window, t.window, y),
          workspace: n(e.workspace, t.workspace, v)
        };
      }),
      (t.createConnection = function (e, t, n) {
        const i = n && n.console ? new (n.console(r))() : new r(),
          s = e(i);
        i.rawAttach(s);
        const h = n && n.tracer ? new (n.tracer(u))() : new u(),
          f = n && n.telemetry ? new (n.telemetry(l))() : new l(),
          p = n && n.client ? new (n.client(a))() : new a(),
          g = n && n.window ? new (n.window(o))() : new o(),
          m = n && n.workspace ? new (n.workspace(c))() : new c(),
          y = n && n.languages ? new (n.languages(d))() : new d(),
          v = [i, h, f, p, g, m, y];
        function b(e) {
          return e instanceof Promise
            ? e
            : S.thenable(e)
            ? new Promise((t, n) => {
                e.then(
                  e => t(e),
                  e => n(e)
                );
              })
            : Promise.resolve(e);
        }
        let _ = void 0,
          w = void 0,
          R = void 0,
          k = {
            listen: () => s.listen(),
            sendRequest: (e, ...t) => s.sendRequest(S.string(e) ? e : e.method, ...t),
            onRequest: (e, t) => s.onRequest(e, t),
            sendNotification: (e, t) => {
              const n = S.string(e) ? e : e.method;
              1 === arguments.length ? s.sendNotification(n) : s.sendNotification(n, t);
            },
            onNotification: (e, t) => s.onNotification(e, t),
            onProgress: s.onProgress,
            sendProgress: s.sendProgress,
            onInitialize: e => (w = e),
            onInitialized: e => s.onNotification(Dt.InitializedNotification.type, e),
            onShutdown: e => (_ = e),
            onExit: e => (R = e),
            get console() {
              return i;
            },
            get telemetry() {
              return f;
            },
            get tracer() {
              return h;
            },
            get client() {
              return p;
            },
            get window() {
              return g;
            },
            get workspace() {
              return m;
            },
            get languages() {
              return y;
            },
            onDidChangeConfiguration: e => s.onNotification(Dt.DidChangeConfigurationNotification.type, e),
            onDidChangeWatchedFiles: e => s.onNotification(Dt.DidChangeWatchedFilesNotification.type, e),
            __textDocumentSync: void 0,
            onDidOpenTextDocument: e => s.onNotification(Dt.DidOpenTextDocumentNotification.type, e),
            onDidChangeTextDocument: e => s.onNotification(Dt.DidChangeTextDocumentNotification.type, e),
            onDidCloseTextDocument: e => s.onNotification(Dt.DidCloseTextDocumentNotification.type, e),
            onWillSaveTextDocument: e => s.onNotification(Dt.WillSaveTextDocumentNotification.type, e),
            onWillSaveTextDocumentWaitUntil: e => s.onRequest(Dt.WillSaveTextDocumentWaitUntilRequest.type, e),
            onDidSaveTextDocument: e => s.onNotification(Dt.DidSaveTextDocumentNotification.type, e),
            sendDiagnostics: e => s.sendNotification(Dt.PublishDiagnosticsNotification.type, e),
            onHover: e => s.onRequest(Dt.HoverRequest.type, (t, n) => e(t, n, jt.attachWorkDone(s, t), void 0)),
            onCompletion: e =>
              s.onRequest(Dt.CompletionRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onCompletionResolve: e => s.onRequest(Dt.CompletionResolveRequest.type, e),
            onSignatureHelp: e =>
              s.onRequest(Dt.SignatureHelpRequest.type, (t, n) => e(t, n, jt.attachWorkDone(s, t), void 0)),
            onDeclaration: e =>
              s.onRequest(Dt.DeclarationRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onDefinition: e =>
              s.onRequest(Dt.DefinitionRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onTypeDefinition: e =>
              s.onRequest(Dt.TypeDefinitionRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onImplementation: e =>
              s.onRequest(Dt.ImplementationRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onReferences: e =>
              s.onRequest(Dt.ReferencesRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onDocumentHighlight: e =>
              s.onRequest(Dt.DocumentHighlightRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onDocumentSymbol: e =>
              s.onRequest(Dt.DocumentSymbolRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onWorkspaceSymbol: e =>
              s.onRequest(Dt.WorkspaceSymbolRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onCodeAction: e =>
              s.onRequest(Dt.CodeActionRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onCodeActionResolve: e => s.onRequest(Dt.CodeActionResolveRequest.type, (t, n) => e(t, n)),
            onCodeLens: e =>
              s.onRequest(Dt.CodeLensRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onCodeLensResolve: e => s.onRequest(Dt.CodeLensResolveRequest.type, (t, n) => e(t, n)),
            onDocumentFormatting: e =>
              s.onRequest(Dt.DocumentFormattingRequest.type, (t, n) => e(t, n, jt.attachWorkDone(s, t), void 0)),
            onDocumentRangeFormatting: e =>
              s.onRequest(Dt.DocumentRangeFormattingRequest.type, (t, n) => e(t, n, jt.attachWorkDone(s, t), void 0)),
            onDocumentOnTypeFormatting: e => s.onRequest(Dt.DocumentOnTypeFormattingRequest.type, (t, n) => e(t, n)),
            onRenameRequest: e =>
              s.onRequest(Dt.RenameRequest.type, (t, n) => e(t, n, jt.attachWorkDone(s, t), void 0)),
            onPrepareRename: e => s.onRequest(Dt.PrepareRenameRequest.type, (t, n) => e(t, n)),
            onDocumentLinks: e =>
              s.onRequest(Dt.DocumentLinkRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onDocumentLinkResolve: e => s.onRequest(Dt.DocumentLinkResolveRequest.type, (t, n) => e(t, n)),
            onDocumentColor: e =>
              s.onRequest(Dt.DocumentColorRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onColorPresentation: e =>
              s.onRequest(Dt.ColorPresentationRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onFoldingRanges: e =>
              s.onRequest(Dt.FoldingRangeRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onSelectionRanges: e =>
              s.onRequest(Dt.SelectionRangeRequest.type, (t, n) =>
                e(t, n, jt.attachWorkDone(s, t), jt.attachPartialResult(s, t))
              ),
            onExecuteCommand: e =>
              s.onRequest(Dt.ExecuteCommandRequest.type, (t, n) => e(t, n, jt.attachWorkDone(s, t), void 0)),
            dispose: () => s.dispose()
          };
        for (let e of v) e.attach(k);
        return (
          s.onRequest(Dt.InitializeRequest.type, e => {
            t.initialize(e), S.string(e.trace) && (h.trace = Dt.Trace.fromString(e.trace));
            for (let t of v) t.initialize(e.capabilities);
            if (w) {
              return b(w(e, new Dt.CancellationTokenSource().token, jt.attachWorkDone(s, e), void 0)).then(e => {
                if (e instanceof Dt.ResponseError) return e;
                let t = e;
                t || (t = { capabilities: {} });
                let n = t.capabilities;
                n || ((n = {}), (t.capabilities = n)),
                  void 0 === n.textDocumentSync || null === n.textDocumentSync
                    ? (n.textDocumentSync = S.number(k.__textDocumentSync)
                        ? k.__textDocumentSync
                        : Dt.TextDocumentSyncKind.None)
                    : S.number(n.textDocumentSync) ||
                      S.number(n.textDocumentSync.change) ||
                      (n.textDocumentSync.change = S.number(k.__textDocumentSync)
                        ? k.__textDocumentSync
                        : Dt.TextDocumentSyncKind.None);
                for (let e of v) e.fillServerCapabilities(n);
                return t;
              });
            }
            {
              let e = { capabilities: { textDocumentSync: Dt.TextDocumentSyncKind.None } };
              for (let t of v) t.fillServerCapabilities(e.capabilities);
              return e;
            }
          }),
          s.onRequest(
            Dt.ShutdownRequest.type,
            () => ((t.shutdownReceived = !0), _ ? _(new Dt.CancellationTokenSource().token) : void 0)
          ),
          s.onNotification(Dt.ExitNotification.type, () => {
            try {
              R && R();
            } finally {
              t.shutdownReceived ? t.exit(0) : t.exit(1);
            }
          }),
          s.onNotification(Dt.SetTraceNotification.type, e => {
            h.trace = Dt.Trace.fromString(e.value);
          }),
          k
        );
      });
  }),
  Ut = P(function (e, t) {
    function n() {
      return 'win32' === process.platform;
    }
    function r(e, t, n, r) {
      const o = [
        'var p = process;',
        "p.on('message',function(m){",
        "if(m.c==='e'){",
        'p.exit(0);',
        '}',
        "else if(m.c==='rs'){",
        'try{',
        'var r=require.resolve(m.a);',
        "p.send({c:'r',s:true,r:r});",
        '}',
        'catch(err){',
        "p.send({c:'r',s:false});",
        '}',
        '}',
        '});'
      ].join('');
      return new Promise((i, s) => {
        let a = process.env,
          c = Object.create(null);
        Object.keys(a).forEach(e => (c[e] = a[e])),
          t &&
            y.default.existsSync(t) &&
            (c.NODE_PATH ? (c.NODE_PATH = t + m.default.delimiter + c.NODE_PATH) : (c.NODE_PATH = t),
            r && r('NODE_PATH value is: ' + c.NODE_PATH)),
          (c.ELECTRON_RUN_AS_NODE = '1');
        try {
          let t = g.default.fork('', [], { cwd: n, env: c, execArgv: ['-e', o] });
          if (void 0 === t.pid) return void s(new Error(`Starting process to resolve node module  ${e} failed`));
          t.on('error', e => {
            s(e);
          }),
            t.on('message', n => {
              'r' === n.c && (t.send({ c: 'e' }), n.s ? i(n.r) : s(new Error('Failed to resolve module: ' + e)));
            });
          let r = { c: 'rs', a: e };
          t.send(r);
        } catch (e) {
          s(e);
        }
      });
    }
    function o(e) {
      let t = 'npm';
      const r = Object.create(null);
      Object.keys(process.env).forEach(e => (r[e] = process.env[e])), (r.NO_UPDATE_NOTIFIER = 'true');
      const o = { encoding: 'utf8', env: r };
      n() && ((t = 'npm.cmd'), (o.shell = !0));
      let i = () => {};
      try {
        process.on('SIGPIPE', i);
        let r = g.default.spawnSync(t, ['config', 'get', 'prefix'], o).stdout;
        if (!r) return void (e && e("'npm config get prefix' didn't return a value."));
        let s = r.trim();
        return (
          e && e("'npm config get prefix' value is: " + s),
          s.length > 0 ? (n() ? m.default.join(s, 'node_modules') : m.default.join(s, 'lib', 'node_modules')) : void 0
        );
      } catch (e) {
        return;
      } finally {
        process.removeListener('SIGPIPE', i);
      }
    }
    var i;
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.resolveModulePath = t.FileSystem = t.resolveGlobalYarnPath = t.resolveGlobalNodePath = t.resolve = t.uriToFilePath = void 0),
      (t.uriToFilePath = function (e) {
        let t = R.default.parse(e);
        if ('file:' !== t.protocol || !t.path) return;
        let n = t.path.split('/');
        for (var r = 0, o = n.length; r < o; r++) n[r] = decodeURIComponent(n[r]);
        if ('win32' === process.platform && n.length > 1) {
          let e = n[0],
            t = n[1];
          0 === e.length && t.length > 1 && ':' === t[1] && n.shift();
        }
        return m.default.normalize(n.join('/'));
      }),
      (t.resolve = r),
      (t.resolveGlobalNodePath = o),
      (t.resolveGlobalYarnPath = function (e) {
        let t = 'yarn',
          r = { encoding: 'utf8' };
        n() && ((t = 'yarn.cmd'), (r.shell = !0));
        let o = () => {};
        try {
          process.on('SIGPIPE', o);
          let n = g.default.spawnSync(t, ['global', 'dir', '--json'], r),
            i = n.stdout;
          if (!i) return void (e && (e("'yarn global dir' didn't return a value."), n.stderr && e(n.stderr)));
          let s = i.trim().split(/\r?\n/);
          for (let e of s)
            try {
              let t = JSON.parse(e);
              if ('log' === t.type) return m.default.join(t.data, 'node_modules');
            } catch (e) {}
          return;
        } catch (e) {
          return;
        } finally {
          process.removeListener('SIGPIPE', o);
        }
      }),
      (function (e) {
        let t = void 0;
        function n() {
          return (
            void 0 !== t ||
              (t =
                'win32' !== process.platform &&
                (!y.default.existsSync(__filename.toUpperCase()) || !y.default.existsSync(__filename.toLowerCase()))),
            t
          );
        }
        (e.isCaseSensitive = n),
          (e.isParent = function (e, t) {
            return n()
              ? 0 === m.default.normalize(t).indexOf(m.default.normalize(e))
              : 0 === m.default.normalize(t).toLowerCase().indexOf(m.default.normalize(e).toLowerCase());
          });
      })((i = t.FileSystem || (t.FileSystem = {}))),
      (t.resolveModulePath = function (e, t, n, s) {
        return n
          ? (m.default.isAbsolute(n) || (n = m.default.join(e, n)),
            r(t, n, n, s)
              .then(e =>
                i.isParent(n, e) ? e : Promise.reject(new Error(`Failed to load ${t} from node path location.`))
              )
              .then(void 0, n => r(t, o(s), e, s)))
          : r(t, o(s), e, s);
      });
  }),
  zt = Dt,
  Vt = P(function (e, t) {
    var n =
        (O && O.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      r =
        (O && O.__exportStar) ||
        function (e, t) {
          for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ProposedFeatures = t.SemanticTokensBuilder = void 0),
      Object.defineProperty(t, 'SemanticTokensBuilder', {
        enumerable: !0,
        get: function () {
          return It.SemanticTokensBuilder;
        }
      }),
      r(Dt, t),
      r(Bt, t),
      ((t.ProposedFeatures || (t.ProposedFeatures = {})).all = { __brand: 'features' });
  }),
  Gt = P(function (e, t) {
    var n,
      r =
        (O && O.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  }
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      o =
        (O && O.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.createConnection = t.Files = void 0),
      o(zt, t),
      o(Vt, t),
      ((n = t.Files || (t.Files = {})).uriToFilePath = Ut.uriToFilePath),
      (n.resolveGlobalNodePath = Ut.resolveGlobalNodePath),
      (n.resolveGlobalYarnPath = Ut.resolveGlobalYarnPath),
      (n.resolve = Ut.resolve),
      (n.resolveModulePath = Ut.resolveModulePath);
    let i = !1,
      s = void 0;
    !(function () {
      const e = '--clientProcessId';
      function t(e) {
        try {
          let t = parseInt(e);
          isNaN(t) ||
            (s = setInterval(() => {
              try {
                process.kill(t, 0);
              } catch (e) {
                process.exit(i ? 0 : 1);
              }
            }, 3e3));
        } catch (e) {}
      }
      for (let n = 2; n < process.argv.length; n++) {
        let r = process.argv[n];
        if (r === e && n + 1 < process.argv.length) return void t(process.argv[n + 1]);
        {
          let n = r.split('=');
          n[0] === e && t(n[1]);
        }
      }
    })();
    const a = {
      initialize: e => {
        const t = e.processId;
        S.number(t) &&
          void 0 === s &&
          setInterval(() => {
            try {
              process.kill(t, 0);
            } catch (e) {
              process.exit(i ? 0 : 1);
            }
          }, 3e3);
      },
      get shutdownReceived() {
        return i;
      },
      set shutdownReceived(e) {
        i = e;
      },
      exit: e => {
        process.exit(e);
      }
    };
    t.createConnection = function (e, t, n, r) {
      let o, s, c, u;
      return (
        void 0 !== e && 'features' === e.__brand && ((o = e), (e = t), (t = n), (n = r)),
        zt.ConnectionStrategy.is(e) || zt.ConnectionOptions.is(e) ? (u = e) : ((s = e), (c = t), (u = n)),
        (function (e, t, n, r) {
          if (!e && !t && process.argv.length > 2) {
            let n = void 0,
              r = void 0,
              i = process.argv.slice(2);
            for (let s = 0; s < i.length; s++) {
              let a = i[s];
              if ('--node-ipc' === a) {
                (e = new zt.IPCMessageReader(process)), (t = new zt.IPCMessageWriter(process));
                break;
              }
              if ('--stdio' === a) {
                (e = process.stdin), (t = process.stdout);
                break;
              }
              if ('--socket' === a) {
                n = parseInt(i[s + 1]);
                break;
              }
              if ('--pipe' === a) {
                r = i[s + 1];
                break;
              }
              var o = a.split('=');
              if ('--socket' === o[0]) {
                n = parseInt(o[1]);
                break;
              }
              if ('--pipe' === o[0]) {
                r = o[1];
                break;
              }
            }
            if (n) {
              let r = zt.createServerSocketTransport(n);
              (e = r[0]), (t = r[1]);
            } else if (r) {
              let n = zt.createServerPipeTransport(r);
              (e = n[0]), (t = n[1]);
            }
          }
          var s =
            "Use arguments of createConnection or set command line parameters: '--node-ipc', '--stdio' or '--socket={number}'";
          if (!e) throw new Error('Connection input stream is not set. ' + s);
          if (!t) throw new Error('Connection output stream is not set. ' + s);
          if (S.func(e.read) && S.func(e.on)) {
            let t = e;
            t.on('end', () => {
              process.exit(i ? 0 : 1);
            }),
              t.on('close', () => {
                process.exit(i ? 0 : 1);
              });
          }
          const c = r => zt.createProtocolConnection(e, t, r, n);
          return Bt.createConnection(c, a, r);
        })(s, c, u, o)
      );
    };
  });
ut = (() => {
  var e = {
      470: e => {
        function t(e) {
          if ('string' != typeof e) throw new TypeError('Path must be a string. Received ' + JSON.stringify(e));
        }
        function n(e, t) {
          for (var n, r = '', o = 0, i = -1, s = 0, a = 0; a <= e.length; ++a) {
            if (a < e.length) n = e.charCodeAt(a);
            else {
              if (47 === n) break;
              n = 47;
            }
            if (47 === n) {
              if (i === a - 1 || 1 === s);
              else if (i !== a - 1 && 2 === s) {
                if (r.length < 2 || 2 !== o || 46 !== r.charCodeAt(r.length - 1) || 46 !== r.charCodeAt(r.length - 2))
                  if (r.length > 2) {
                    var c = r.lastIndexOf('/');
                    if (c !== r.length - 1) {
                      -1 === c ? ((r = ''), (o = 0)) : (o = (r = r.slice(0, c)).length - 1 - r.lastIndexOf('/')),
                        (i = a),
                        (s = 0);
                      continue;
                    }
                  } else if (2 === r.length || 1 === r.length) {
                    (r = ''), (o = 0), (i = a), (s = 0);
                    continue;
                  }
                t && (r.length > 0 ? (r += '/..') : (r = '..'), (o = 2));
              } else r.length > 0 ? (r += '/' + e.slice(i + 1, a)) : (r = e.slice(i + 1, a)), (o = a - i - 1);
              (i = a), (s = 0);
            } else 46 === n && -1 !== s ? ++s : (s = -1);
          }
          return r;
        }
        var r = {
          resolve: function () {
            for (var e, r = '', o = !1, i = arguments.length - 1; i >= -1 && !o; i--) {
              var s;
              i >= 0 ? (s = arguments[i]) : (void 0 === e && (e = process.cwd()), (s = e)),
                t(s),
                0 !== s.length && ((r = s + '/' + r), (o = 47 === s.charCodeAt(0)));
            }
            return (r = n(r, !o)), o ? (r.length > 0 ? '/' + r : '/') : r.length > 0 ? r : '.';
          },
          normalize: function (e) {
            if ((t(e), 0 === e.length)) return '.';
            var r = 47 === e.charCodeAt(0),
              o = 47 === e.charCodeAt(e.length - 1);
            return 0 !== (e = n(e, !r)).length || r || (e = '.'), e.length > 0 && o && (e += '/'), r ? '/' + e : e;
          },
          isAbsolute: function (e) {
            return t(e), e.length > 0 && 47 === e.charCodeAt(0);
          },
          join: function () {
            if (0 === arguments.length) return '.';
            for (var e, n = 0; n < arguments.length; ++n) {
              var o = arguments[n];
              t(o), o.length > 0 && (void 0 === e ? (e = o) : (e += '/' + o));
            }
            return void 0 === e ? '.' : r.normalize(e);
          },
          relative: function (e, n) {
            if ((t(e), t(n), e === n)) return '';
            if ((e = r.resolve(e)) === (n = r.resolve(n))) return '';
            for (var o = 1; o < e.length && 47 === e.charCodeAt(o); ++o);
            for (var i = e.length, s = i - o, a = 1; a < n.length && 47 === n.charCodeAt(a); ++a);
            for (var c = n.length - a, u = s < c ? s : c, l = -1, h = 0; h <= u; ++h) {
              if (h === u) {
                if (c > u) {
                  if (47 === n.charCodeAt(a + h)) return n.slice(a + h + 1);
                  if (0 === h) return n.slice(a + h);
                } else s > u && (47 === e.charCodeAt(o + h) ? (l = h) : 0 === h && (l = 0));
                break;
              }
              var d = e.charCodeAt(o + h);
              if (d !== n.charCodeAt(a + h)) break;
              47 === d && (l = h);
            }
            var f = '';
            for (h = o + l + 1; h <= i; ++h)
              (h !== i && 47 !== e.charCodeAt(h)) || (0 === f.length ? (f += '..') : (f += '/..'));
            return f.length > 0 ? f + n.slice(a + l) : ((a += l), 47 === n.charCodeAt(a) && ++a, n.slice(a));
          },
          _makeLong: function (e) {
            return e;
          },
          dirname: function (e) {
            if ((t(e), 0 === e.length)) return '.';
            for (var n = e.charCodeAt(0), r = 47 === n, o = -1, i = !0, s = e.length - 1; s >= 1; --s)
              if (47 === (n = e.charCodeAt(s))) {
                if (!i) {
                  o = s;
                  break;
                }
              } else i = !1;
            return -1 === o ? (r ? '/' : '.') : r && 1 === o ? '//' : e.slice(0, o);
          },
          basename: function (e, n) {
            if (void 0 !== n && 'string' != typeof n) throw new TypeError('"ext" argument must be a string');
            t(e);
            var r,
              o = 0,
              i = -1,
              s = !0;
            if (void 0 !== n && n.length > 0 && n.length <= e.length) {
              if (n.length === e.length && n === e) return '';
              var a = n.length - 1,
                c = -1;
              for (r = e.length - 1; r >= 0; --r) {
                var u = e.charCodeAt(r);
                if (47 === u) {
                  if (!s) {
                    o = r + 1;
                    break;
                  }
                } else
                  -1 === c && ((s = !1), (c = r + 1)),
                    a >= 0 && (u === n.charCodeAt(a) ? -1 == --a && (i = r) : ((a = -1), (i = c)));
              }
              return o === i ? (i = c) : -1 === i && (i = e.length), e.slice(o, i);
            }
            for (r = e.length - 1; r >= 0; --r)
              if (47 === e.charCodeAt(r)) {
                if (!s) {
                  o = r + 1;
                  break;
                }
              } else -1 === i && ((s = !1), (i = r + 1));
            return -1 === i ? '' : e.slice(o, i);
          },
          extname: function (e) {
            t(e);
            for (var n = -1, r = 0, o = -1, i = !0, s = 0, a = e.length - 1; a >= 0; --a) {
              var c = e.charCodeAt(a);
              if (47 !== c)
                -1 === o && ((i = !1), (o = a + 1)),
                  46 === c ? (-1 === n ? (n = a) : 1 !== s && (s = 1)) : -1 !== n && (s = -1);
              else if (!i) {
                r = a + 1;
                break;
              }
            }
            return -1 === n || -1 === o || 0 === s || (1 === s && n === o - 1 && n === r + 1) ? '' : e.slice(n, o);
          },
          format: function (e) {
            if (null === e || 'object' != typeof e)
              throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
            return (function (e, t) {
              var n = t.dir || t.root,
                r = t.base || (t.name || '') + (t.ext || '');
              return n ? (n === t.root ? n + r : n + '/' + r) : r;
            })(0, e);
          },
          parse: function (e) {
            t(e);
            var n = { root: '', dir: '', base: '', ext: '', name: '' };
            if (0 === e.length) return n;
            var r,
              o = e.charCodeAt(0),
              i = 47 === o;
            i ? ((n.root = '/'), (r = 1)) : (r = 0);
            for (var s = -1, a = 0, c = -1, u = !0, l = e.length - 1, h = 0; l >= r; --l)
              if (47 !== (o = e.charCodeAt(l)))
                -1 === c && ((u = !1), (c = l + 1)),
                  46 === o ? (-1 === s ? (s = l) : 1 !== h && (h = 1)) : -1 !== s && (h = -1);
              else if (!u) {
                a = l + 1;
                break;
              }
            return (
              -1 === s || -1 === c || 0 === h || (1 === h && s === c - 1 && s === a + 1)
                ? -1 !== c && (n.base = n.name = 0 === a && i ? e.slice(1, c) : e.slice(a, c))
                : (0 === a && i
                    ? ((n.name = e.slice(1, s)), (n.base = e.slice(1, c)))
                    : ((n.name = e.slice(a, s)), (n.base = e.slice(a, c))),
                  (n.ext = e.slice(s, c))),
              a > 0 ? (n.dir = e.slice(0, a - 1)) : i && (n.dir = '/'),
              n
            );
          },
          sep: '/',
          delimiter: ':',
          win32: null,
          posix: null
        };
        (r.posix = r), (e.exports = r);
      },
      447: (e, t, n) => {
        var r;
        if ((n.r(t), n.d(t, { URI: () => p, Utils: () => O }), 'object' == typeof process))
          r = 'win32' === process.platform;
        else if ('object' == typeof navigator) {
          var o = navigator.userAgent;
          r = o.indexOf('Windows') >= 0;
        }
        var i,
          s,
          a =
            ((i = function (e, t) {
              return (i =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, t) {
                    e.__proto__ = t;
                  }) ||
                function (e, t) {
                  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                })(e, t);
            }),
            function (e, t) {
              function n() {
                this.constructor = e;
              }
              i(e, t), (e.prototype = null === t ? Object.create(t) : ((n.prototype = t.prototype), new n()));
            }),
          c = /^\w[\w\d+.-]*$/,
          u = /^\//,
          l = /^\/\//,
          h = '',
          d = '/',
          f = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,
          p = (function () {
            function e(e, t, n, r, o, i) {
              void 0 === i && (i = !1),
                'object' == typeof e
                  ? ((this.scheme = e.scheme || h),
                    (this.authority = e.authority || h),
                    (this.path = e.path || h),
                    (this.query = e.query || h),
                    (this.fragment = e.fragment || h))
                  : ((this.scheme = (function (e, t) {
                      return e || t ? e : 'file';
                    })(e, i)),
                    (this.authority = t || h),
                    (this.path = (function (e, t) {
                      switch (e) {
                        case 'https':
                        case 'http':
                        case 'file':
                          t ? t[0] !== d && (t = d + t) : (t = d);
                      }
                      return t;
                    })(this.scheme, n || h)),
                    (this.query = r || h),
                    (this.fragment = o || h),
                    (function (e, t) {
                      if (!e.scheme && t)
                        throw new Error(
                          '[UriError]: Scheme is missing: {scheme: "", authority: "' +
                            e.authority +
                            '", path: "' +
                            e.path +
                            '", query: "' +
                            e.query +
                            '", fragment: "' +
                            e.fragment +
                            '"}'
                        );
                      if (e.scheme && !c.test(e.scheme))
                        throw new Error('[UriError]: Scheme contains illegal characters.');
                      if (e.path)
                        if (e.authority) {
                          if (!u.test(e.path))
                            throw new Error(
                              '[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character'
                            );
                        } else if (l.test(e.path))
                          throw new Error(
                            '[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")'
                          );
                    })(this, i));
            }
            return (
              (e.isUri = function (t) {
                return (
                  t instanceof e ||
                  (!!t &&
                    'string' == typeof t.authority &&
                    'string' == typeof t.fragment &&
                    'string' == typeof t.path &&
                    'string' == typeof t.query &&
                    'string' == typeof t.scheme &&
                    'function' == typeof t.fsPath &&
                    'function' == typeof t.with &&
                    'function' == typeof t.toString)
                );
              }),
              Object.defineProperty(e.prototype, 'fsPath', {
                get: function () {
                  return _(this, !1);
                },
                enumerable: !1,
                configurable: !0
              }),
              (e.prototype.with = function (e) {
                if (!e) return this;
                var t = e.scheme,
                  n = e.authority,
                  r = e.path,
                  o = e.query,
                  i = e.fragment;
                return (
                  void 0 === t ? (t = this.scheme) : null === t && (t = h),
                  void 0 === n ? (n = this.authority) : null === n && (n = h),
                  void 0 === r ? (r = this.path) : null === r && (r = h),
                  void 0 === o ? (o = this.query) : null === o && (o = h),
                  void 0 === i ? (i = this.fragment) : null === i && (i = h),
                  t === this.scheme &&
                  n === this.authority &&
                  r === this.path &&
                  o === this.query &&
                  i === this.fragment
                    ? this
                    : new m(t, n, r, o, i)
                );
              }),
              (e.parse = function (e, t) {
                void 0 === t && (t = !1);
                var n = f.exec(e);
                return n
                  ? new m(n[2] || h, C(n[4] || h), C(n[5] || h), C(n[7] || h), C(n[9] || h), t)
                  : new m(h, h, h, h, h);
              }),
              (e.file = function (e) {
                var t = h;
                if ((r && (e = e.replace(/\\/g, d)), e[0] === d && e[1] === d)) {
                  var n = e.indexOf(d, 2);
                  -1 === n ? ((t = e.substring(2)), (e = d)) : ((t = e.substring(2, n)), (e = e.substring(n) || d));
                }
                return new m('file', t, e, h, h);
              }),
              (e.from = function (e) {
                return new m(e.scheme, e.authority, e.path, e.query, e.fragment);
              }),
              (e.prototype.toString = function (e) {
                return void 0 === e && (e = !1), w(this, e);
              }),
              (e.prototype.toJSON = function () {
                return this;
              }),
              (e.revive = function (t) {
                if (t) {
                  if (t instanceof e) return t;
                  var n = new m(t);
                  return (n._formatted = t.external), (n._fsPath = t._sep === g ? t.fsPath : null), n;
                }
                return t;
              }),
              e
            );
          })(),
          g = r ? 1 : void 0,
          m = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (t._formatted = null), (t._fsPath = null), t;
            }
            return (
              a(t, e),
              Object.defineProperty(t.prototype, 'fsPath', {
                get: function () {
                  return this._fsPath || (this._fsPath = _(this, !1)), this._fsPath;
                },
                enumerable: !1,
                configurable: !0
              }),
              (t.prototype.toString = function (e) {
                return (
                  void 0 === e && (e = !1),
                  e ? w(this, !0) : (this._formatted || (this._formatted = w(this, !1)), this._formatted)
                );
              }),
              (t.prototype.toJSON = function () {
                var e = { $mid: 1 };
                return (
                  this._fsPath && ((e.fsPath = this._fsPath), (e._sep = g)),
                  this._formatted && (e.external = this._formatted),
                  this.path && (e.path = this.path),
                  this.scheme && (e.scheme = this.scheme),
                  this.authority && (e.authority = this.authority),
                  this.query && (e.query = this.query),
                  this.fragment && (e.fragment = this.fragment),
                  e
                );
              }),
              t
            );
          })(p),
          y =
            (((s = {})[58] = '%3A'),
            (s[47] = '%2F'),
            (s[63] = '%3F'),
            (s[35] = '%23'),
            (s[91] = '%5B'),
            (s[93] = '%5D'),
            (s[64] = '%40'),
            (s[33] = '%21'),
            (s[36] = '%24'),
            (s[38] = '%26'),
            (s[39] = '%27'),
            (s[40] = '%28'),
            (s[41] = '%29'),
            (s[42] = '%2A'),
            (s[43] = '%2B'),
            (s[44] = '%2C'),
            (s[59] = '%3B'),
            (s[61] = '%3D'),
            (s[32] = '%20'),
            s);
        function v(e, t) {
          for (var n = void 0, r = -1, o = 0; o < e.length; o++) {
            var i = e.charCodeAt(o);
            if (
              (i >= 97 && i <= 122) ||
              (i >= 65 && i <= 90) ||
              (i >= 48 && i <= 57) ||
              45 === i ||
              46 === i ||
              95 === i ||
              126 === i ||
              (t && 47 === i)
            )
              -1 !== r && ((n += encodeURIComponent(e.substring(r, o))), (r = -1)), void 0 !== n && (n += e.charAt(o));
            else {
              void 0 === n && (n = e.substr(0, o));
              var s = y[i];
              void 0 !== s
                ? (-1 !== r && ((n += encodeURIComponent(e.substring(r, o))), (r = -1)), (n += s))
                : -1 === r && (r = o);
            }
          }
          return -1 !== r && (n += encodeURIComponent(e.substring(r))), void 0 !== n ? n : e;
        }
        function b(e) {
          for (var t = void 0, n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            35 === r || 63 === r ? (void 0 === t && (t = e.substr(0, n)), (t += y[r])) : void 0 !== t && (t += e[n]);
          }
          return void 0 !== t ? t : e;
        }
        function _(e, t) {
          var n;
          return (
            (n =
              e.authority && e.path.length > 1 && 'file' === e.scheme
                ? '//' + e.authority + e.path
                : 47 === e.path.charCodeAt(0) &&
                  ((e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90) ||
                    (e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122)) &&
                  58 === e.path.charCodeAt(2)
                ? t
                  ? e.path.substr(1)
                  : e.path[1].toLowerCase() + e.path.substr(2)
                : e.path),
            r && (n = n.replace(/\//g, '\\')),
            n
          );
        }
        function w(e, t) {
          var n = t ? b : v,
            r = '',
            o = e.scheme,
            i = e.authority,
            s = e.path,
            a = e.query,
            c = e.fragment;
          if ((o && ((r += o), (r += ':')), (i || 'file' === o) && ((r += d), (r += d)), i)) {
            var u = i.indexOf('@');
            if (-1 !== u) {
              var l = i.substr(0, u);
              (i = i.substr(u + 1)),
                -1 === (u = l.indexOf(':'))
                  ? (r += n(l, !1))
                  : ((r += n(l.substr(0, u), !1)), (r += ':'), (r += n(l.substr(u + 1), !1))),
                (r += '@');
            }
            -1 === (u = (i = i.toLowerCase()).indexOf(':'))
              ? (r += n(i, !1))
              : ((r += n(i.substr(0, u), !1)), (r += i.substr(u)));
          }
          if (s) {
            if (s.length >= 3 && 47 === s.charCodeAt(0) && 58 === s.charCodeAt(2))
              (h = s.charCodeAt(1)) >= 65 && h <= 90 && (s = '/' + String.fromCharCode(h + 32) + ':' + s.substr(3));
            else if (s.length >= 2 && 58 === s.charCodeAt(1)) {
              var h;
              (h = s.charCodeAt(0)) >= 65 && h <= 90 && (s = String.fromCharCode(h + 32) + ':' + s.substr(2));
            }
            r += n(s, !0);
          }
          return a && ((r += '?'), (r += n(a, !1))), c && ((r += '#'), (r += t ? c : v(c, !1))), r;
        }
        function R(e) {
          try {
            return decodeURIComponent(e);
          } catch (t) {
            return e.length > 3 ? e.substr(0, 3) + R(e.substr(3)) : e;
          }
        }
        var k = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
        function C(e) {
          return e.match(k)
            ? e.replace(k, function (e) {
                return R(e);
              })
            : e;
        }
        var O,
          T = n(470),
          P = function () {
            for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
            var r = Array(e),
              o = 0;
            for (t = 0; t < n; t++) for (var i = arguments[t], s = 0, a = i.length; s < a; s++, o++) r[o] = i[s];
            return r;
          },
          x = T.posix || T;
        !(function (e) {
          (e.joinPath = function (e) {
            for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
            return e.with({ path: x.join.apply(x, P([e.path], t)) });
          }),
            (e.resolvePath = function (e) {
              for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
              var r = e.path || '/';
              return e.with({ path: x.resolve.apply(x, P([r], t)) });
            }),
            (e.dirname = function (e) {
              var t = x.dirname(e.path);
              return 1 === t.length && 46 === t.charCodeAt(0) ? e : e.with({ path: t });
            }),
            (e.basename = function (e) {
              return x.basename(e.path);
            }),
            (e.extname = function (e) {
              return x.extname(e.path);
            });
        })(O || (O = {}));
      }
    },
    t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = { exports: {} });
    return e[r](o, o.exports, n), o.exports;
  }
  return (
    (n.d = (e, t) => {
      for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
    }),
    (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (n.r = e => {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    n(447)
  );
})();
const { URI: Kt, Utils: Jt } = ut;
var Yt = 'win32' === process.platform,
  Qt = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
function Xt(e) {
  return 'function' == typeof e
    ? e
    : (function () {
        var e;
        if (Qt) {
          var t = new Error();
          e = function (e) {
            e && ((t.message = e.message), n((e = t)));
          };
        } else e = n;
        return e;
        function n(e) {
          if (e) {
            if (process.throwDeprecation) throw e;
            if (!process.noDeprecation) {
              var t = 'fs: missing callback ' + (e.stack || e.message);
              process.traceDeprecation ? console.trace(t) : console.error(t);
            }
          }
        }
      })();
}
if ((m.default.normalize, Yt)) var Zt = /(.*?)(?:[\/\\]+|$)/g;
else Zt = /(.*?)(?:[\/]+|$)/g;
if (Yt) var en = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
else en = /^[\/]*/;
var tn = function (e, t) {
    if (((e = m.default.resolve(e)), t && Object.prototype.hasOwnProperty.call(t, e))) return t[e];
    var n,
      r,
      o,
      i,
      s = e,
      a = {},
      c = {};
    function u() {
      var t = en.exec(e);
      (n = t[0].length), (r = t[0]), (o = t[0]), (i = ''), Yt && !c[o] && (y.default.lstatSync(o), (c[o] = !0));
    }
    for (u(); n < e.length; ) {
      Zt.lastIndex = n;
      var l = Zt.exec(e);
      if (((i = r), (r += l[0]), (o = i + l[1]), (n = Zt.lastIndex), !(c[o] || (t && t[o] === o)))) {
        var h;
        if (t && Object.prototype.hasOwnProperty.call(t, o)) h = t[o];
        else {
          var d = y.default.lstatSync(o);
          if (!d.isSymbolicLink()) {
            (c[o] = !0), t && (t[o] = o);
            continue;
          }
          var f = null;
          if (!Yt) {
            var p = d.dev.toString(32) + ':' + d.ino.toString(32);
            a.hasOwnProperty(p) && (f = a[p]);
          }
          null === f && (y.default.statSync(o), (f = y.default.readlinkSync(o))),
            (h = m.default.resolve(i, f)),
            t && (t[o] = h),
            Yt || (a[p] = f);
        }
        (e = m.default.resolve(h, e.slice(n))), u();
      }
    }
    return t && (t[s] = e), e;
  },
  nn = function (e, t, n) {
    if (
      ('function' != typeof n && ((n = Xt(t)), (t = null)),
      (e = m.default.resolve(e)),
      t && Object.prototype.hasOwnProperty.call(t, e))
    )
      return process.nextTick(n.bind(null, null, t[e]));
    var r,
      o,
      i,
      s,
      a = e,
      c = {},
      u = {};
    function l() {
      var t = en.exec(e);
      (r = t[0].length),
        (o = t[0]),
        (i = t[0]),
        (s = ''),
        Yt && !u[i]
          ? y.default.lstat(i, function (e) {
              if (e) return n(e);
              (u[i] = !0), h();
            })
          : process.nextTick(h);
    }
    function h() {
      if (r >= e.length) return t && (t[a] = e), n(null, e);
      Zt.lastIndex = r;
      var c = Zt.exec(e);
      return (
        (s = o),
        (o += c[0]),
        (i = s + c[1]),
        (r = Zt.lastIndex),
        u[i] || (t && t[i] === i)
          ? process.nextTick(h)
          : t && Object.prototype.hasOwnProperty.call(t, i)
          ? p(t[i])
          : y.default.lstat(i, d)
      );
    }
    function d(e, r) {
      if (e) return n(e);
      if (!r.isSymbolicLink()) return (u[i] = !0), t && (t[i] = i), process.nextTick(h);
      if (!Yt) {
        var o = r.dev.toString(32) + ':' + r.ino.toString(32);
        if (c.hasOwnProperty(o)) return f(null, c[o], i);
      }
      y.default.stat(i, function (e) {
        if (e) return n(e);
        y.default.readlink(i, function (e, t) {
          Yt || (c[o] = t), f(e, t);
        });
      });
    }
    function f(e, r, o) {
      if (e) return n(e);
      var i = m.default.resolve(s, r);
      t && (t[o] = i), p(i);
    }
    function p(t) {
      (e = m.default.resolve(t, e.slice(r))), l();
    }
    l();
  },
  rn = ln;
(ln.realpath = ln),
  (ln.sync = hn),
  (ln.realpathSync = hn),
  (ln.monkeypatch = function () {
    (y.default.realpath = ln), (y.default.realpathSync = hn);
  }),
  (ln.unmonkeypatch = function () {
    (y.default.realpath = on), (y.default.realpathSync = sn);
  });
var on = y.default.realpath,
  sn = y.default.realpathSync,
  an = process.version,
  cn = /^v[0-5]\./.test(an);
function un(e) {
  return e && 'realpath' === e.syscall && ('ELOOP' === e.code || 'ENOMEM' === e.code || 'ENAMETOOLONG' === e.code);
}
function ln(e, t, n) {
  if (cn) return on(e, t, n);
  'function' == typeof t && ((n = t), (t = null)),
    on(e, t, function (r, o) {
      un(r) ? nn(e, t, n) : n(r, o);
    });
}
function hn(e, t) {
  if (cn) return sn(e, t);
  try {
    return sn(e, t);
  } catch (n) {
    if (un(n)) return tn(e, t);
    throw n;
  }
}
var dn =
    Array.isArray ||
    function (e) {
      return '[object Array]' === Object.prototype.toString.call(e);
    },
  fn = pn;
function pn(e, t, n) {
  e instanceof RegExp && (e = gn(e, n)), t instanceof RegExp && (t = gn(t, n));
  var r = mn(e, t, n);
  return (
    r && {
      start: r[0],
      end: r[1],
      pre: n.slice(0, r[0]),
      body: n.slice(r[0] + e.length, r[1]),
      post: n.slice(r[1] + t.length)
    }
  );
}
function gn(e, t) {
  var n = t.match(e);
  return n ? n[0] : null;
}
function mn(e, t, n) {
  var r,
    o,
    i,
    s,
    a,
    c = n.indexOf(e),
    u = n.indexOf(t, c + 1),
    l = c;
  if (c >= 0 && u > 0) {
    for (r = [], i = n.length; l >= 0 && !a; )
      l == c
        ? (r.push(l), (c = n.indexOf(e, l + 1)))
        : 1 == r.length
        ? (a = [r.pop(), u])
        : ((o = r.pop()) < i && ((i = o), (s = u)), (u = n.indexOf(t, l + 1))),
        (l = c < u && c >= 0 ? c : u);
    r.length && (a = [i, s]);
  }
  return a;
}
pn.range = mn;
var yn = function (e) {
    if (!e) return [];
    '{}' === e.substr(0, 2) && (e = '\\{\\}' + e.substr(2));
    return En(
      (function (e) {
        return e
          .split('\\\\')
          .join(vn)
          .split('\\{')
          .join(bn)
          .split('\\}')
          .join(_n)
          .split('\\,')
          .join(wn)
          .split('\\.')
          .join(Rn);
      })(e),
      !0
    ).map(Cn);
  },
  vn = '\0SLASH' + Math.random() + '\0',
  bn = '\0OPEN' + Math.random() + '\0',
  _n = '\0CLOSE' + Math.random() + '\0',
  wn = '\0COMMA' + Math.random() + '\0',
  Rn = '\0PERIOD' + Math.random() + '\0';
function kn(e) {
  return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
}
function Cn(e) {
  return e.split(vn).join('\\').split(bn).join('{').split(_n).join('}').split(wn).join(',').split(Rn).join('.');
}
function On(e) {
  if (!e) return [''];
  var t = [],
    n = fn('{', '}', e);
  if (!n) return e.split(',');
  var r = n.pre,
    o = n.body,
    i = n.post,
    s = r.split(',');
  s[s.length - 1] += '{' + o + '}';
  var a = On(i);
  return i.length && ((s[s.length - 1] += a.shift()), s.push.apply(s, a)), t.push.apply(t, s), t;
}
function Tn(e) {
  return '{' + e + '}';
}
function Pn(e) {
  return /^-?0\d/.test(e);
}
function xn(e, t) {
  return e <= t;
}
function Sn(e, t) {
  return e >= t;
}
function En(e, t) {
  var n = [],
    r = fn('{', '}', e);
  if (!r || /\$$/.test(r.pre)) return [e];
  var o,
    i = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(r.body),
    s = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(r.body),
    a = i || s,
    c = r.body.indexOf(',') >= 0;
  if (!a && !c) return r.post.match(/,.*\}/) ? En((e = r.pre + '{' + r.body + _n + r.post)) : [e];
  if (a) o = r.body.split(/\.\./);
  else if (1 === (o = On(r.body)).length && 1 === (o = En(o[0], !1).map(Tn)).length)
    return (h = r.post.length ? En(r.post, !1) : ['']).map(function (e) {
      return r.pre + o[0] + e;
    });
  var u,
    l = r.pre,
    h = r.post.length ? En(r.post, !1) : [''];
  if (a) {
    var d = kn(o[0]),
      f = kn(o[1]),
      p = Math.max(o[0].length, o[1].length),
      g = 3 == o.length ? Math.abs(kn(o[2])) : 1,
      m = xn;
    f < d && ((g *= -1), (m = Sn));
    var y = o.some(Pn);
    u = [];
    for (var v = d; m(v, f); v += g) {
      var b;
      if (s) '\\' === (b = String.fromCharCode(v)) && (b = '');
      else if (((b = String(v)), y)) {
        var _ = p - b.length;
        if (_ > 0) {
          var w = new Array(_ + 1).join('0');
          b = v < 0 ? '-' + w + b.slice(1) : w + b;
        }
      }
      u.push(b);
    }
  } else
    u = (function (e, t) {
      for (var n = [], r = 0; r < e.length; r++) {
        var o = t(e[r], r);
        dn(o) ? n.push.apply(n, o) : n.push(o);
      }
      return n;
    })(o, function (e) {
      return En(e, !1);
    });
  for (var R = 0; R < u.length; R++)
    for (var k = 0; k < h.length; k++) {
      var C = l + u[R] + h[k];
      (!t || a || C) && n.push(C);
    }
  return n;
}
var qn = In;
In.Minimatch = Ln;
var Dn = { sep: '/' };
try {
  Dn = m.default;
} catch (e) {}
var Mn = (In.GLOBSTAR = Ln.GLOBSTAR = {}),
  jn = {
    '!': { open: '(?:(?!(?:', close: '))[^/]*?)' },
    '?': { open: '(?:', close: ')?' },
    '+': { open: '(?:', close: ')+' },
    '*': { open: '(?:', close: ')*' },
    '@': { open: '(?:', close: ')' }
  },
  Nn = '().*{}+?[]^$\\!'.split('').reduce(function (e, t) {
    return (e[t] = !0), e;
  }, {});
var An = /\/+/;
function Fn(e, t) {
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
function In(e, t, n) {
  if ('string' != typeof t) throw new TypeError('glob pattern string required');
  return n || (n = {}), !(!n.nocomment && '#' === t.charAt(0)) && ('' === t.trim() ? '' === e : new Ln(t, n).match(e));
}
function Ln(e, t) {
  if (!(this instanceof Ln)) return new Ln(e, t);
  if ('string' != typeof e) throw new TypeError('glob pattern string required');
  t || (t = {}),
    (e = e.trim()),
    '/' !== Dn.sep && (e = e.split(Dn.sep).join('/')),
    (this.options = t),
    (this.set = []),
    (this.pattern = e),
    (this.regexp = null),
    (this.negate = !1),
    (this.comment = !1),
    (this.empty = !1),
    this.make();
}
function Wn(e, t) {
  if ((t || (t = this instanceof Ln ? this.options : {}), void 0 === (e = void 0 === e ? this.pattern : e)))
    throw new TypeError('undefined pattern');
  return t.nobrace || !e.match(/\{.*\}/) ? [e] : yn(e);
}
(In.filter = function (e, t) {
  return (
    (t = t || {}),
    function (n, r, o) {
      return In(n, e, t);
    }
  );
}),
  (In.defaults = function (e) {
    if (!e || !Object.keys(e).length) return In;
    var t = In,
      n = function (n, r, o) {
        return t.minimatch(n, r, Fn(e, o));
      };
    return (
      (n.Minimatch = function (n, r) {
        return new t.Minimatch(n, Fn(e, r));
      }),
      n
    );
  }),
  (Ln.defaults = function (e) {
    return e && Object.keys(e).length ? In.defaults(e).Minimatch : Ln;
  }),
  (Ln.prototype.debug = function () {}),
  (Ln.prototype.make = function () {
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
        return e.split(An);
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
  (Ln.prototype.parseNegate = function () {
    var e = this.pattern,
      t = !1,
      n = this.options,
      r = 0;
    if (n.nonegate) return;
    for (var o = 0, i = e.length; o < i && '!' === e.charAt(o); o++) (t = !t), r++;
    r && (this.pattern = e.substr(r));
    this.negate = t;
  }),
  (In.braceExpand = function (e, t) {
    return Wn(e, t);
  }),
  (Ln.prototype.braceExpand = Wn),
  (Ln.prototype.parse = function (e, t) {
    if (e.length > 65536) throw new TypeError('pattern is too long');
    var n = this.options;
    if (!n.noglobstar && '**' === e) return Mn;
    if ('' === e) return '';
    var r,
      o = '',
      i = !!n.nocase,
      s = !1,
      a = [],
      c = [],
      u = !1,
      l = -1,
      h = -1,
      d = '.' === e.charAt(0) ? '' : n.dot ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))' : '(?!\\.)',
      f = this;
    function p() {
      if (r) {
        switch (r) {
          case '*':
            (o += '[^/]*?'), (i = !0);
            break;
          case '?':
            (o += '[^/]'), (i = !0);
            break;
          default:
            o += '\\' + r;
        }
        f.debug('clearStateChar %j %j', r, o), (r = !1);
      }
    }
    for (var g, m = 0, y = e.length; m < y && (g = e.charAt(m)); m++)
      if ((this.debug('%s\t%s %s %j', e, m, o, g), s && Nn[g])) (o += '\\' + g), (s = !1);
      else
        switch (g) {
          case '/':
            return !1;
          case '\\':
            p(), (s = !0);
            continue;
          case '?':
          case '*':
          case '+':
          case '@':
          case '!':
            if ((this.debug('%s\t%s %s %j <-- stateChar', e, m, o, g), u)) {
              this.debug('  in class'), '!' === g && m === h + 1 && (g = '^'), (o += g);
              continue;
            }
            f.debug('call clearStateChar %j', r), p(), (r = g), n.noext && p();
            continue;
          case '(':
            if (u) {
              o += '(';
              continue;
            }
            if (!r) {
              o += '\\(';
              continue;
            }
            a.push({ type: r, start: m - 1, reStart: o.length, open: jn[r].open, close: jn[r].close }),
              (o += '!' === r ? '(?:(?!(?:' : '(?:'),
              this.debug('plType %j %j', r, o),
              (r = !1);
            continue;
          case ')':
            if (u || !a.length) {
              o += '\\)';
              continue;
            }
            p(), (i = !0);
            var v = a.pop();
            (o += v.close), '!' === v.type && c.push(v), (v.reEnd = o.length);
            continue;
          case '|':
            if (u || !a.length || s) {
              (o += '\\|'), (s = !1);
              continue;
            }
            p(), (o += '|');
            continue;
          case '[':
            if ((p(), u)) {
              o += '\\' + g;
              continue;
            }
            (u = !0), (h = m), (l = o.length), (o += g);
            continue;
          case ']':
            if (m === h + 1 || !u) {
              (o += '\\' + g), (s = !1);
              continue;
            }
            if (u) {
              var b = e.substring(h + 1, m);
              try {
                RegExp('[' + b + ']');
              } catch (e) {
                var _ = this.parse(b, $n);
                (o = o.substr(0, l) + '\\[' + _[0] + '\\]'), (i = i || _[1]), (u = !1);
                continue;
              }
            }
            (i = !0), (u = !1), (o += g);
            continue;
          default:
            p(), s ? (s = !1) : !Nn[g] || ('^' === g && u) || (o += '\\'), (o += g);
        }
    u && ((b = e.substr(h + 1)), (_ = this.parse(b, $n)), (o = o.substr(0, l) + '\\[' + _[0]), (i = i || _[1]));
    for (v = a.pop(); v; v = a.pop()) {
      var w = o.slice(v.reStart + v.open.length);
      this.debug('setting tail', o, v),
        (w = w.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (e, t, n) {
          return n || (n = '\\'), t + t + n + '|';
        })),
        this.debug('tail=%j\n   %s', w, w, v, o);
      var R = '*' === v.type ? '[^/]*?' : '?' === v.type ? '[^/]' : '\\' + v.type;
      (i = !0), (o = o.slice(0, v.reStart) + R + '\\(' + w);
    }
    p(), s && (o += '\\\\');
    var k = !1;
    switch (o.charAt(0)) {
      case '.':
      case '[':
      case '(':
        k = !0;
    }
    for (var C = c.length - 1; C > -1; C--) {
      var O = c[C],
        T = o.slice(0, O.reStart),
        P = o.slice(O.reStart, O.reEnd - 8),
        x = o.slice(O.reEnd - 8, O.reEnd),
        S = o.slice(O.reEnd);
      x += S;
      var E = T.split('(').length - 1,
        q = S;
      for (m = 0; m < E; m++) q = q.replace(/\)[+*?]?/, '');
      var D = '';
      '' === (S = q) && t !== $n && (D = '$'), (o = T + P + S + D + x);
    }
    '' !== o && i && (o = '(?=.)' + o);
    k && (o = d + o);
    if (t === $n) return [o, i];
    if (!i)
      return (function (e) {
        return e.replace(/\\(.)/g, '$1');
      })(e);
    var M = n.nocase ? 'i' : '';
    try {
      var j = new RegExp('^' + o + '$', M);
    } catch (e) {
      return new RegExp('$.');
    }
    return (j._glob = e), (j._src = o), j;
  });
var $n = {};
(In.makeRe = function (e, t) {
  return new Ln(e, t || {}).makeRe();
}),
  (Ln.prototype.makeRe = function () {
    if (this.regexp || !1 === this.regexp) return this.regexp;
    var e = this.set;
    if (!e.length) return (this.regexp = !1), this.regexp;
    var t = this.options,
      n = t.noglobstar ? '[^/]*?' : t.dot ? '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?' : '(?:(?!(?:\\/|^)\\.).)*?',
      r = t.nocase ? 'i' : '',
      o = e
        .map(function (e) {
          return e
            .map(function (e) {
              return e === Mn
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
    (o = '^(?:' + o + ')$'), this.negate && (o = '^(?!' + o + ').*$');
    try {
      this.regexp = new RegExp(o, r);
    } catch (e) {
      this.regexp = !1;
    }
    return this.regexp;
  }),
  (In.match = function (e, t, n) {
    var r = new Ln(t, (n = n || {}));
    return (
      (e = e.filter(function (e) {
        return r.match(e);
      })),
      r.options.nonull && !e.length && e.push(t),
      e
    );
  }),
  (Ln.prototype.match = function (e, t) {
    if ((this.debug('match', e, this.pattern), this.comment)) return !1;
    if (this.empty) return '' === e;
    if ('/' === e && t) return !0;
    var n = this.options;
    '/' !== Dn.sep && (e = e.split(Dn.sep).join('/'));
    (e = e.split(An)), this.debug(this.pattern, 'split', e);
    var r,
      o,
      i = this.set;
    for (this.debug(this.pattern, 'set', i), o = e.length - 1; o >= 0 && !(r = e[o]); o--);
    for (o = 0; o < i.length; o++) {
      var s = i[o],
        a = e;
      if ((n.matchBase && 1 === s.length && (a = [r]), this.matchOne(a, s, t))) return !!n.flipNegate || !this.negate;
    }
    return !n.flipNegate && this.negate;
  }),
  (Ln.prototype.matchOne = function (e, t, n) {
    var r = this.options;
    this.debug('matchOne', { this: this, file: e, pattern: t }), this.debug('matchOne', e.length, t.length);
    for (var o = 0, i = 0, s = e.length, a = t.length; o < s && i < a; o++, i++) {
      this.debug('matchOne loop');
      var c,
        u = t[i],
        l = e[o];
      if ((this.debug(t, u, l), !1 === u)) return !1;
      if (u === Mn) {
        this.debug('GLOBSTAR', [t, u, l]);
        var h = o,
          d = i + 1;
        if (d === a) {
          for (this.debug('** at the end'); o < s; o++)
            if ('.' === e[o] || '..' === e[o] || (!r.dot && '.' === e[o].charAt(0))) return !1;
          return !0;
        }
        for (; h < s; ) {
          var f = e[h];
          if ((this.debug('\nglobstar while', e, h, t, d, f), this.matchOne(e.slice(h), t.slice(d), n)))
            return this.debug('globstar found match!', h, s, f), !0;
          if ('.' === f || '..' === f || (!r.dot && '.' === f.charAt(0))) {
            this.debug('dot detected!', e, h, t, d);
            break;
          }
          this.debug('globstar swallow a segment, and continue'), h++;
        }
        return !(!n || (this.debug('\n>>> no match, partial?', e, h, t, d), h !== s));
      }
      if (
        ('string' == typeof u
          ? ((c = r.nocase ? l.toLowerCase() === u.toLowerCase() : l === u), this.debug('string match', u, l, c))
          : ((c = l.match(u)), this.debug('pattern match', u, l, c)),
        !c)
      )
        return !1;
    }
    if (o === s && i === a) return !0;
    if (o === s) return n;
    if (i === a) return o === s - 1 && '' === e[o];
    throw new Error('wtf?');
  });
var Hn = P(function (e) {
    'function' == typeof Object.create
      ? (e.exports = function (e, t) {
          t &&
            ((e.super_ = t),
            (e.prototype = Object.create(t.prototype, {
              constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 }
            })));
        })
      : (e.exports = function (e, t) {
          if (t) {
            e.super_ = t;
            var n = function () {};
            (n.prototype = t.prototype), (e.prototype = new n()), (e.prototype.constructor = e);
          }
        });
  }),
  Bn = P(function (e) {
    try {
      var t = v.default;
      if ('function' != typeof t.inherits) throw '';
      e.exports = t.inherits;
    } catch (t) {
      e.exports = Hn;
    }
  });
function Un(e) {
  return '/' === e.charAt(0);
}
function zn(e) {
  var t = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(e),
    n = t[1] || '',
    r = Boolean(n && ':' !== n.charAt(1));
  return Boolean(t[2] || r);
}
var Vn = 'win32' === process.platform ? zn : Un,
  Gn = Un,
  Kn = zn;
(Vn.posix = Gn), (Vn.win32 = Kn);
var Jn = function (e, t, n) {
    n || (n = {});
    if (n.matchBase && -1 === t.indexOf('/')) {
      if (n.noglobstar) throw new Error('base matching requires globstar');
      t = '**/' + t;
    }
    (e.silent = !!n.silent),
      (e.pattern = t),
      (e.strict = !1 !== n.strict),
      (e.realpath = !!n.realpath),
      (e.realpathCache = n.realpathCache || Object.create(null)),
      (e.follow = !!n.follow),
      (e.dot = !!n.dot),
      (e.mark = !!n.mark),
      (e.nodir = !!n.nodir),
      e.nodir && (e.mark = !0);
    (e.sync = !!n.sync),
      (e.nounique = !!n.nounique),
      (e.nonull = !!n.nonull),
      (e.nosort = !!n.nosort),
      (e.nocase = !!n.nocase),
      (e.stat = !!n.stat),
      (e.noprocess = !!n.noprocess),
      (e.absolute = !!n.absolute),
      (e.maxLength = n.maxLength || 1 / 0),
      (e.cache = n.cache || Object.create(null)),
      (e.statCache = n.statCache || Object.create(null)),
      (e.symlinks = n.symlinks || Object.create(null)),
      (function (e, t) {
        (e.ignore = t.ignore || []), Array.isArray(e.ignore) || (e.ignore = [e.ignore]);
        e.ignore.length && (e.ignore = e.ignore.map(ir));
      })(e, n),
      (e.changedCwd = !1);
    var r = process.cwd();
    nr(n, 'cwd') ? ((e.cwd = m.default.resolve(n.cwd)), (e.changedCwd = e.cwd !== r)) : (e.cwd = r);
    (e.root = n.root || m.default.resolve(e.cwd, '/')),
      (e.root = m.default.resolve(e.root)),
      'win32' === process.platform && (e.root = e.root.replace(/\\/g, '/'));
    (e.cwdAbs = Vn(e.cwd) ? e.cwd : sr(e, e.cwd)),
      'win32' === process.platform && (e.cwdAbs = e.cwdAbs.replace(/\\/g, '/'));
    (e.nomount = !!n.nomount),
      (n.nonegate = !0),
      (n.nocomment = !0),
      (e.minimatch = new rr(t, n)),
      (e.options = e.minimatch.options);
  },
  Yn = nr,
  Qn = sr,
  Xn = function (e) {
    for (var t = e.nounique, n = t ? [] : Object.create(null), r = 0, o = e.matches.length; r < o; r++) {
      var i = e.matches[r];
      if (i && 0 !== Object.keys(i).length) {
        var s = Object.keys(i);
        t
          ? n.push.apply(n, s)
          : s.forEach(function (e) {
              n[e] = !0;
            });
      } else if (e.nonull) {
        var a = e.minimatch.globSet[r];
        t ? n.push(a) : (n[a] = !0);
      }
    }
    t || (n = Object.keys(n));
    e.nosort || (n = n.sort(or));
    if (e.mark) {
      for (r = 0; r < n.length; r++) n[r] = e._mark(n[r]);
      e.nodir &&
        (n = n.filter(function (t) {
          var n = !/\/$/.test(t),
            r = e.cache[t] || e.cache[sr(e, t)];
          return n && r && (n = 'DIR' !== r && !Array.isArray(r)), n;
        }));
    }
    e.ignore.length &&
      (n = n.filter(function (t) {
        return !ar(e, t);
      }));
    e.found = n;
  },
  Zn = function (e, t) {
    var n = sr(e, t),
      r = e.cache[n],
      o = t;
    if (r) {
      var i = 'DIR' === r || Array.isArray(r),
        s = '/' === t.slice(-1);
      if ((i && !s ? (o += '/') : !i && s && (o = o.slice(0, -1)), o !== t)) {
        var a = sr(e, o);
        (e.statCache[a] = e.statCache[n]), (e.cache[a] = e.cache[n]);
      }
    }
    return o;
  },
  er = ar,
  tr = function (e, t) {
    return (
      !!e.ignore.length &&
      e.ignore.some(function (e) {
        return !(!e.gmatcher || !e.gmatcher.match(t));
      })
    );
  };
function nr(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
var rr = qn.Minimatch;
function or(e, t) {
  return e.localeCompare(t, 'en');
}
function ir(e) {
  var t = null;
  if ('/**' === e.slice(-3)) {
    var n = e.replace(/(\/\*\*)+$/, '');
    t = new rr(n, { dot: !0 });
  }
  return { matcher: new rr(e, { dot: !0 }), gmatcher: t };
}
function sr(e, t) {
  var n = t;
  return (
    (n =
      '/' === t.charAt(0)
        ? m.default.join(e.root, t)
        : Vn(t) || '' === t
        ? t
        : e.changedCwd
        ? m.default.resolve(e.cwd, t)
        : m.default.resolve(t)),
    'win32' === process.platform && (n = n.replace(/\\/g, '/')),
    n
  );
}
function ar(e, t) {
  return (
    !!e.ignore.length &&
    e.ignore.some(function (e) {
      return e.matcher.match(t) || !(!e.gmatcher || !e.gmatcher.match(t));
    })
  );
}
var cr = { setopts: Jn, ownProp: Yn, makeAbs: Qn, finish: Xn, mark: Zn, isIgnored: er, childrenIgnored: tr },
  ur = pr;
pr.GlobSync = gr;
var lr = cr.setopts,
  hr = cr.ownProp,
  dr = cr.childrenIgnored,
  fr = cr.isIgnored;
function pr(e, t) {
  if ('function' == typeof t || 3 === arguments.length)
    throw new TypeError('callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167');
  return new gr(e, t).found;
}
function gr(e, t) {
  if (!e) throw new Error('must provide pattern');
  if ('function' == typeof t || 3 === arguments.length)
    throw new TypeError('callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167');
  if (!(this instanceof gr)) return new gr(e, t);
  if ((lr(this, e, t), this.noprocess)) return this;
  var n = this.minimatch.set.length;
  this.matches = new Array(n);
  for (var r = 0; r < n; r++) this._process(this.minimatch.set[r], r, !1);
  this._finish();
}
(gr.prototype._finish = function () {
  if ((k.default(this instanceof gr), this.realpath)) {
    var e = this;
    this.matches.forEach(function (t, n) {
      var r = (e.matches[n] = Object.create(null));
      for (var o in t)
        try {
          (o = e._makeAbs(o)), (r[rn.realpathSync(o, e.realpathCache)] = !0);
        } catch (t) {
          if ('stat' !== t.syscall) throw t;
          r[e._makeAbs(o)] = !0;
        }
    });
  }
  cr.finish(this);
}),
  (gr.prototype._process = function (e, t, n) {
    k.default(this instanceof gr);
    for (var r, o = 0; 'string' == typeof e[o]; ) o++;
    switch (o) {
      case e.length:
        return void this._processSimple(e.join('/'), t);
      case 0:
        r = null;
        break;
      default:
        r = e.slice(0, o).join('/');
    }
    var i,
      s = e.slice(o);
    null === r ? (i = '.') : Vn(r) || Vn(e.join('/')) ? ((r && Vn(r)) || (r = '/' + r), (i = r)) : (i = r);
    var a = this._makeAbs(i);
    dr(this, i) ||
      (s[0] === qn.GLOBSTAR ? this._processGlobStar(r, i, a, s, t, n) : this._processReaddir(r, i, a, s, t, n));
  }),
  (gr.prototype._processReaddir = function (e, t, n, r, o, i) {
    var s = this._readdir(n, i);
    if (s) {
      for (
        var a = r[0], c = !!this.minimatch.negate, u = a._glob, l = this.dot || '.' === u.charAt(0), h = [], d = 0;
        d < s.length;
        d++
      ) {
        if ('.' !== (g = s[d]).charAt(0) || l) (c && !e ? !g.match(a) : g.match(a)) && h.push(g);
      }
      var f = h.length;
      if (0 !== f)
        if (1 !== r.length || this.mark || this.stat) {
          r.shift();
          for (d = 0; d < f; d++) {
            var p;
            g = h[d];
            (p = e ? [e, g] : [g]), this._process(p.concat(r), o, i);
          }
        } else {
          this.matches[o] || (this.matches[o] = Object.create(null));
          for (var d = 0; d < f; d++) {
            var g = h[d];
            e && (g = '/' !== e.slice(-1) ? e + '/' + g : e + g),
              '/' !== g.charAt(0) || this.nomount || (g = m.default.join(this.root, g)),
              this._emitMatch(o, g);
          }
        }
    }
  }),
  (gr.prototype._emitMatch = function (e, t) {
    if (!fr(this, t)) {
      var n = this._makeAbs(t);
      if ((this.mark && (t = this._mark(t)), this.absolute && (t = n), !this.matches[e][t])) {
        if (this.nodir) {
          var r = this.cache[n];
          if ('DIR' === r || Array.isArray(r)) return;
        }
        (this.matches[e][t] = !0), this.stat && this._stat(t);
      }
    }
  }),
  (gr.prototype._readdirInGlobStar = function (e) {
    if (this.follow) return this._readdir(e, !1);
    var t, n;
    try {
      n = y.default.lstatSync(e);
    } catch (e) {
      if ('ENOENT' === e.code) return null;
    }
    var r = n && n.isSymbolicLink();
    return (
      (this.symlinks[e] = r), r || !n || n.isDirectory() ? (t = this._readdir(e, !1)) : (this.cache[e] = 'FILE'), t
    );
  }),
  (gr.prototype._readdir = function (e, t) {
    if (t && !hr(this.symlinks, e)) return this._readdirInGlobStar(e);
    if (hr(this.cache, e)) {
      var n = this.cache[e];
      if (!n || 'FILE' === n) return null;
      if (Array.isArray(n)) return n;
    }
    try {
      return this._readdirEntries(e, y.default.readdirSync(e));
    } catch (t) {
      return this._readdirError(e, t), null;
    }
  }),
  (gr.prototype._readdirEntries = function (e, t) {
    if (!this.mark && !this.stat)
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r = '/' === e ? e + r : e + '/' + r), (this.cache[r] = !0);
      }
    return (this.cache[e] = t), t;
  }),
  (gr.prototype._readdirError = function (e, t) {
    switch (t.code) {
      case 'ENOTSUP':
      case 'ENOTDIR':
        var n = this._makeAbs(e);
        if (((this.cache[n] = 'FILE'), n === this.cwdAbs)) {
          var r = new Error(t.code + ' invalid cwd ' + this.cwd);
          throw ((r.path = this.cwd), (r.code = t.code), r);
        }
        break;
      case 'ENOENT':
      case 'ELOOP':
      case 'ENAMETOOLONG':
      case 'UNKNOWN':
        this.cache[this._makeAbs(e)] = !1;
        break;
      default:
        if (((this.cache[this._makeAbs(e)] = !1), this.strict)) throw t;
        this.silent || console.error('glob error', t);
    }
  }),
  (gr.prototype._processGlobStar = function (e, t, n, r, o, i) {
    var s = this._readdir(n, i);
    if (s) {
      var a = r.slice(1),
        c = e ? [e] : [],
        u = c.concat(a);
      this._process(u, o, !1);
      var l = s.length;
      if (!this.symlinks[n] || !i)
        for (var h = 0; h < l; h++) {
          if ('.' !== s[h].charAt(0) || this.dot) {
            var d = c.concat(s[h], a);
            this._process(d, o, !0);
            var f = c.concat(s[h], r);
            this._process(f, o, !0);
          }
        }
    }
  }),
  (gr.prototype._processSimple = function (e, t) {
    var n = this._stat(e);
    if ((this.matches[t] || (this.matches[t] = Object.create(null)), n)) {
      if (e && Vn(e) && !this.nomount) {
        var r = /[\/\\]$/.test(e);
        '/' === e.charAt(0)
          ? (e = m.default.join(this.root, e))
          : ((e = m.default.resolve(this.root, e)), r && (e += '/'));
      }
      'win32' === process.platform && (e = e.replace(/\\/g, '/')), this._emitMatch(t, e);
    }
  }),
  (gr.prototype._stat = function (e) {
    var t = this._makeAbs(e),
      n = '/' === e.slice(-1);
    if (e.length > this.maxLength) return !1;
    if (!this.stat && hr(this.cache, t)) {
      var r = this.cache[t];
      if ((Array.isArray(r) && (r = 'DIR'), !n || 'DIR' === r)) return r;
      if (n && 'FILE' === r) return !1;
    }
    var o = this.statCache[t];
    if (!o) {
      var i;
      try {
        i = y.default.lstatSync(t);
      } catch (e) {
        if (e && ('ENOENT' === e.code || 'ENOTDIR' === e.code)) return (this.statCache[t] = !1), !1;
      }
      if (i && i.isSymbolicLink())
        try {
          o = y.default.statSync(t);
        } catch (e) {
          o = i;
        }
      else o = i;
    }
    this.statCache[t] = o;
    r = !0;
    return o && (r = o.isDirectory() ? 'DIR' : 'FILE'), (this.cache[t] = this.cache[t] || r), (!n || 'FILE' !== r) && r;
  }),
  (gr.prototype._mark = function (e) {
    return cr.mark(this, e);
  }),
  (gr.prototype._makeAbs = function (e) {
    return cr.makeAbs(this, e);
  });
var mr = function e(t, n) {
  if (t && n) return e(t)(n);
  if ('function' != typeof t) throw new TypeError('need wrapper function');
  return (
    Object.keys(t).forEach(function (e) {
      r[e] = t[e];
    }),
    r
  );
  function r() {
    for (var e = new Array(arguments.length), n = 0; n < e.length; n++) e[n] = arguments[n];
    var r = t.apply(this, e),
      o = e[e.length - 1];
    return (
      'function' == typeof r &&
        r !== o &&
        Object.keys(o).forEach(function (e) {
          r[e] = o[e];
        }),
      r
    );
  }
};
var yr = mr(br),
  vr = mr(_r);
function br(e) {
  var t = function () {
    return t.called ? t.value : ((t.called = !0), (t.value = e.apply(this, arguments)));
  };
  return (t.called = !1), t;
}
function _r(e) {
  var t = function () {
      if (t.called) throw new Error(t.onceError);
      return (t.called = !0), (t.value = e.apply(this, arguments));
    },
    n = e.name || 'Function wrapped with `once`';
  return (t.onceError = n + " shouldn't be called more than once"), (t.called = !1), t;
}
(br.proto = br(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return br(this);
    },
    configurable: !0
  }),
    Object.defineProperty(Function.prototype, 'onceStrict', {
      value: function () {
        return _r(this);
      },
      configurable: !0
    });
})),
  (yr.strict = vr);
var wr = Object.create(null),
  Rr = mr(function (e, t) {
    return wr[e]
      ? (wr[e].push(t), null)
      : ((wr[e] = [t]),
        (function (e) {
          return yr(function t() {
            var n = wr[e],
              r = n.length,
              o = kr(arguments);
            try {
              for (var i = 0; i < r; i++) n[i].apply(null, o);
            } finally {
              n.length > r
                ? (n.splice(0, r),
                  process.nextTick(function () {
                    t.apply(null, o);
                  }))
                : delete wr[e];
            }
          });
        })(e));
  });
function kr(e) {
  for (var t = e.length, n = [], r = 0; r < t; r++) n[r] = e[r];
  return n;
}
var Cr = Er,
  Or = p.default.EventEmitter,
  Tr = cr.setopts,
  Pr = cr.ownProp,
  xr = cr.childrenIgnored,
  Sr = cr.isIgnored;
function Er(e, t, n) {
  if (('function' == typeof t && ((n = t), (t = {})), t || (t = {}), t.sync)) {
    if (n) throw new TypeError('callback provided to sync glob');
    return ur(e, t);
  }
  return new Dr(e, t, n);
}
Er.sync = ur;
var qr = (Er.GlobSync = ur.GlobSync);
function Dr(e, t, n) {
  if (('function' == typeof t && ((n = t), (t = null)), t && t.sync)) {
    if (n) throw new TypeError('callback provided to sync glob');
    return new qr(e, t);
  }
  if (!(this instanceof Dr)) return new Dr(e, t, n);
  Tr(this, e, t), (this._didRealPath = !1);
  var r = this.minimatch.set.length;
  (this.matches = new Array(r)),
    'function' == typeof n &&
      ((n = yr(n)),
      this.on('error', n),
      this.on('end', function (e) {
        n(null, e);
      }));
  var o = this;
  if (((this._processing = 0), (this._emitQueue = []), (this._processQueue = []), (this.paused = !1), this.noprocess))
    return this;
  if (0 === r) return s();
  for (var i = 0; i < r; i++) this._process(this.minimatch.set[i], i, !1, s);
  function s() {
    --o._processing, o._processing <= 0 && o._finish();
  }
}
(Er.glob = Er),
  (Er.hasMagic = function (e, t) {
    var n = (function (e, t) {
      if (null === t || 'object' != typeof t) return e;
      for (var n = Object.keys(t), r = n.length; r--; ) e[n[r]] = t[n[r]];
      return e;
    })({}, t);
    n.noprocess = !0;
    var r = new Dr(e, n).minimatch.set;
    if (!e) return !1;
    if (r.length > 1) return !0;
    for (var o = 0; o < r[0].length; o++) if ('string' != typeof r[0][o]) return !0;
    return !1;
  }),
  (Er.Glob = Dr),
  Bn(Dr, Or),
  (Dr.prototype._finish = function () {
    if ((k.default(this instanceof Dr), !this.aborted)) {
      if (this.realpath && !this._didRealpath) return this._realpath();
      cr.finish(this), this.emit('end', this.found);
    }
  }),
  (Dr.prototype._realpath = function () {
    if (!this._didRealpath) {
      this._didRealpath = !0;
      var e = this.matches.length;
      if (0 === e) return this._finish();
      for (var t = this, n = 0; n < this.matches.length; n++) this._realpathSet(n, r);
    }
    function r() {
      0 == --e && t._finish();
    }
  }),
  (Dr.prototype._realpathSet = function (e, t) {
    var n = this.matches[e];
    if (!n) return t();
    var r = Object.keys(n),
      o = this,
      i = r.length;
    if (0 === i) return t();
    var s = (this.matches[e] = Object.create(null));
    r.forEach(function (n, r) {
      (n = o._makeAbs(n)),
        rn.realpath(n, o.realpathCache, function (r, a) {
          r ? ('stat' === r.syscall ? (s[n] = !0) : o.emit('error', r)) : (s[a] = !0),
            0 == --i && ((o.matches[e] = s), t());
        });
    });
  }),
  (Dr.prototype._mark = function (e) {
    return cr.mark(this, e);
  }),
  (Dr.prototype._makeAbs = function (e) {
    return cr.makeAbs(this, e);
  }),
  (Dr.prototype.abort = function () {
    (this.aborted = !0), this.emit('abort');
  }),
  (Dr.prototype.pause = function () {
    this.paused || ((this.paused = !0), this.emit('pause'));
  }),
  (Dr.prototype.resume = function () {
    if (this.paused) {
      if ((this.emit('resume'), (this.paused = !1), this._emitQueue.length)) {
        var e = this._emitQueue.slice(0);
        this._emitQueue.length = 0;
        for (var t = 0; t < e.length; t++) {
          var n = e[t];
          this._emitMatch(n[0], n[1]);
        }
      }
      if (this._processQueue.length) {
        var r = this._processQueue.slice(0);
        this._processQueue.length = 0;
        for (t = 0; t < r.length; t++) {
          var o = r[t];
          this._processing--, this._process(o[0], o[1], o[2], o[3]);
        }
      }
    }
  }),
  (Dr.prototype._process = function (e, t, n, r) {
    if ((k.default(this instanceof Dr), k.default('function' == typeof r), !this.aborted))
      if ((this._processing++, this.paused)) this._processQueue.push([e, t, n, r]);
      else {
        for (var o, i = 0; 'string' == typeof e[i]; ) i++;
        switch (i) {
          case e.length:
            return void this._processSimple(e.join('/'), t, r);
          case 0:
            o = null;
            break;
          default:
            o = e.slice(0, i).join('/');
        }
        var s,
          a = e.slice(i);
        null === o ? (s = '.') : Vn(o) || Vn(e.join('/')) ? ((o && Vn(o)) || (o = '/' + o), (s = o)) : (s = o);
        var c = this._makeAbs(s);
        if (xr(this, s)) return r();
        a[0] === qn.GLOBSTAR ? this._processGlobStar(o, s, c, a, t, n, r) : this._processReaddir(o, s, c, a, t, n, r);
      }
  }),
  (Dr.prototype._processReaddir = function (e, t, n, r, o, i, s) {
    var a = this;
    this._readdir(n, i, function (c, u) {
      return a._processReaddir2(e, t, n, r, o, i, u, s);
    });
  }),
  (Dr.prototype._processReaddir2 = function (e, t, n, r, o, i, s, a) {
    if (!s) return a();
    for (
      var c = r[0], u = !!this.minimatch.negate, l = c._glob, h = this.dot || '.' === l.charAt(0), d = [], f = 0;
      f < s.length;
      f++
    ) {
      if ('.' !== (g = s[f]).charAt(0) || h) (u && !e ? !g.match(c) : g.match(c)) && d.push(g);
    }
    var p = d.length;
    if (0 === p) return a();
    if (1 === r.length && !this.mark && !this.stat) {
      this.matches[o] || (this.matches[o] = Object.create(null));
      for (f = 0; f < p; f++) {
        var g = d[f];
        e && (g = '/' !== e ? e + '/' + g : e + g),
          '/' !== g.charAt(0) || this.nomount || (g = m.default.join(this.root, g)),
          this._emitMatch(o, g);
      }
      return a();
    }
    r.shift();
    for (f = 0; f < p; f++) {
      g = d[f];
      e && (g = '/' !== e ? e + '/' + g : e + g), this._process([g].concat(r), o, i, a);
    }
    a();
  }),
  (Dr.prototype._emitMatch = function (e, t) {
    if (!this.aborted && !Sr(this, t))
      if (this.paused) this._emitQueue.push([e, t]);
      else {
        var n = Vn(t) ? t : this._makeAbs(t);
        if ((this.mark && (t = this._mark(t)), this.absolute && (t = n), !this.matches[e][t])) {
          if (this.nodir) {
            var r = this.cache[n];
            if ('DIR' === r || Array.isArray(r)) return;
          }
          this.matches[e][t] = !0;
          var o = this.statCache[n];
          o && this.emit('stat', t, o), this.emit('match', t);
        }
      }
  }),
  (Dr.prototype._readdirInGlobStar = function (e, t) {
    if (!this.aborted) {
      if (this.follow) return this._readdir(e, !1, t);
      var n = this,
        r = Rr('lstat\0' + e, function (r, o) {
          if (r && 'ENOENT' === r.code) return t();
          var i = o && o.isSymbolicLink();
          (n.symlinks[e] = i), i || !o || o.isDirectory() ? n._readdir(e, !1, t) : ((n.cache[e] = 'FILE'), t());
        });
      r && y.default.lstat(e, r);
    }
  }),
  (Dr.prototype._readdir = function (e, t, n) {
    if (!this.aborted && (n = Rr('readdir\0' + e + '\0' + t, n))) {
      if (t && !Pr(this.symlinks, e)) return this._readdirInGlobStar(e, n);
      if (Pr(this.cache, e)) {
        var r = this.cache[e];
        if (!r || 'FILE' === r) return n();
        if (Array.isArray(r)) return n(null, r);
      }
      y.default.readdir(
        e,
        (function (e, t, n) {
          return function (r, o) {
            r ? e._readdirError(t, r, n) : e._readdirEntries(t, o, n);
          };
        })(this, e, n)
      );
    }
  }),
  (Dr.prototype._readdirEntries = function (e, t, n) {
    if (!this.aborted) {
      if (!this.mark && !this.stat)
        for (var r = 0; r < t.length; r++) {
          var o = t[r];
          (o = '/' === e ? e + o : e + '/' + o), (this.cache[o] = !0);
        }
      return (this.cache[e] = t), n(null, t);
    }
  }),
  (Dr.prototype._readdirError = function (e, t, n) {
    if (!this.aborted) {
      switch (t.code) {
        case 'ENOTSUP':
        case 'ENOTDIR':
          var r = this._makeAbs(e);
          if (((this.cache[r] = 'FILE'), r === this.cwdAbs)) {
            var o = new Error(t.code + ' invalid cwd ' + this.cwd);
            (o.path = this.cwd), (o.code = t.code), this.emit('error', o), this.abort();
          }
          break;
        case 'ENOENT':
        case 'ELOOP':
        case 'ENAMETOOLONG':
        case 'UNKNOWN':
          this.cache[this._makeAbs(e)] = !1;
          break;
        default:
          (this.cache[this._makeAbs(e)] = !1),
            this.strict && (this.emit('error', t), this.abort()),
            this.silent || console.error('glob error', t);
      }
      return n();
    }
  }),
  (Dr.prototype._processGlobStar = function (e, t, n, r, o, i, s) {
    var a = this;
    this._readdir(n, i, function (c, u) {
      a._processGlobStar2(e, t, n, r, o, i, u, s);
    });
  }),
  (Dr.prototype._processGlobStar2 = function (e, t, n, r, o, i, s, a) {
    if (!s) return a();
    var c = r.slice(1),
      u = e ? [e] : [],
      l = u.concat(c);
    this._process(l, o, !1, a);
    var h = this.symlinks[n],
      d = s.length;
    if (h && i) return a();
    for (var f = 0; f < d; f++) {
      if ('.' !== s[f].charAt(0) || this.dot) {
        var p = u.concat(s[f], c);
        this._process(p, o, !0, a);
        var g = u.concat(s[f], r);
        this._process(g, o, !0, a);
      }
    }
    a();
  }),
  (Dr.prototype._processSimple = function (e, t, n) {
    var r = this;
    this._stat(e, function (o, i) {
      r._processSimple2(e, t, o, i, n);
    });
  }),
  (Dr.prototype._processSimple2 = function (e, t, n, r, o) {
    if ((this.matches[t] || (this.matches[t] = Object.create(null)), !r)) return o();
    if (e && Vn(e) && !this.nomount) {
      var i = /[\/\\]$/.test(e);
      '/' === e.charAt(0)
        ? (e = m.default.join(this.root, e))
        : ((e = m.default.resolve(this.root, e)), i && (e += '/'));
    }
    'win32' === process.platform && (e = e.replace(/\\/g, '/')), this._emitMatch(t, e), o();
  }),
  (Dr.prototype._stat = function (e, t) {
    var n = this._makeAbs(e),
      r = '/' === e.slice(-1);
    if (e.length > this.maxLength) return t();
    if (!this.stat && Pr(this.cache, n)) {
      var o = this.cache[n];
      if ((Array.isArray(o) && (o = 'DIR'), !r || 'DIR' === o)) return t(null, o);
      if (r && 'FILE' === o) return t();
    }
    var i = this.statCache[n];
    if (void 0 !== i) {
      if (!1 === i) return t(null, i);
      var s = i.isDirectory() ? 'DIR' : 'FILE';
      return r && 'FILE' === s ? t() : t(null, s, i);
    }
    var a = this,
      c = Rr('stat\0' + n, function (r, o) {
        if (o && o.isSymbolicLink())
          return y.default.stat(n, function (r, i) {
            r ? a._stat2(e, n, null, o, t) : a._stat2(e, n, r, i, t);
          });
        a._stat2(e, n, r, o, t);
      });
    c && y.default.lstat(n, c);
  }),
  (Dr.prototype._stat2 = function (e, t, n, r, o) {
    if (n && ('ENOENT' === n.code || 'ENOTDIR' === n.code)) return (this.statCache[t] = !1), o();
    var i = '/' === e.slice(-1);
    if (((this.statCache[t] = r), '/' === t.slice(-1) && r && !r.isDirectory())) return o(null, !1, r);
    var s = !0;
    return (
      r && (s = r.isDirectory() ? 'DIR' : 'FILE'),
      (this.cache[t] = this.cache[t] || s),
      i && 'FILE' === s ? o() : o(null, s, r)
    );
  });
var Mr = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
const jr = {};
for (const e of Object.keys(Mr)) jr[Mr[e]] = e;
const Nr = {
  rgb: { channels: 3, labels: 'rgb' },
  hsl: { channels: 3, labels: 'hsl' },
  hsv: { channels: 3, labels: 'hsv' },
  hwb: { channels: 3, labels: 'hwb' },
  cmyk: { channels: 4, labels: 'cmyk' },
  xyz: { channels: 3, labels: 'xyz' },
  lab: { channels: 3, labels: 'lab' },
  lch: { channels: 3, labels: 'lch' },
  hex: { channels: 1, labels: ['hex'] },
  keyword: { channels: 1, labels: ['keyword'] },
  ansi16: { channels: 1, labels: ['ansi16'] },
  ansi256: { channels: 1, labels: ['ansi256'] },
  hcg: { channels: 3, labels: ['h', 'c', 'g'] },
  apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
  gray: { channels: 1, labels: ['gray'] }
};
var Ar = Nr;
for (const e of Object.keys(Nr)) {
  if (!('channels' in Nr[e])) throw new Error('missing channels property: ' + e);
  if (!('labels' in Nr[e])) throw new Error('missing channel labels property: ' + e);
  if (Nr[e].labels.length !== Nr[e].channels) throw new Error('channel and label counts mismatch: ' + e);
  const { channels: t, labels: n } = Nr[e];
  delete Nr[e].channels,
    delete Nr[e].labels,
    Object.defineProperty(Nr[e], 'channels', { value: t }),
    Object.defineProperty(Nr[e], 'labels', { value: n });
}
function Fr(e) {
  const t = (function () {
      const e = {},
        t = Object.keys(Ar);
      for (let n = t.length, r = 0; r < n; r++) e[t[r]] = { distance: -1, parent: null };
      return e;
    })(),
    n = [e];
  for (t[e].distance = 0; n.length; ) {
    const e = n.pop(),
      r = Object.keys(Ar[e]);
    for (let o = r.length, i = 0; i < o; i++) {
      const o = r[i],
        s = t[o];
      -1 === s.distance && ((s.distance = t[e].distance + 1), (s.parent = e), n.unshift(o));
    }
  }
  return t;
}
function Ir(e, t) {
  return function (n) {
    return t(e(n));
  };
}
function Lr(e, t) {
  const n = [t[e].parent, e];
  let r = Ar[t[e].parent][e],
    o = t[e].parent;
  for (; t[o].parent; ) n.unshift(t[o].parent), (r = Ir(Ar[t[o].parent][o], r)), (o = t[o].parent);
  return (r.conversion = n), r;
}
(Nr.rgb.hsl = function (e) {
  const t = e[0] / 255,
    n = e[1] / 255,
    r = e[2] / 255,
    o = Math.min(t, n, r),
    i = Math.max(t, n, r),
    s = i - o;
  let a, c;
  i === o ? (a = 0) : t === i ? (a = (n - r) / s) : n === i ? (a = 2 + (r - t) / s) : r === i && (a = 4 + (t - n) / s),
    (a = Math.min(60 * a, 360)),
    a < 0 && (a += 360);
  const u = (o + i) / 2;
  return (c = i === o ? 0 : u <= 0.5 ? s / (i + o) : s / (2 - i - o)), [a, 100 * c, 100 * u];
}),
  (Nr.rgb.hsv = function (e) {
    let t, n, r, o, i;
    const s = e[0] / 255,
      a = e[1] / 255,
      c = e[2] / 255,
      u = Math.max(s, a, c),
      l = u - Math.min(s, a, c),
      h = function (e) {
        return (u - e) / 6 / l + 0.5;
      };
    return (
      0 === l
        ? ((o = 0), (i = 0))
        : ((i = l / u),
          (t = h(s)),
          (n = h(a)),
          (r = h(c)),
          s === u ? (o = r - n) : a === u ? (o = 1 / 3 + t - r) : c === u && (o = 2 / 3 + n - t),
          o < 0 ? (o += 1) : o > 1 && (o -= 1)),
      [360 * o, 100 * i, 100 * u]
    );
  }),
  (Nr.rgb.hwb = function (e) {
    const t = e[0],
      n = e[1];
    let r = e[2];
    const o = Nr.rgb.hsl(e)[0],
      i = (1 / 255) * Math.min(t, Math.min(n, r));
    return (r = 1 - (1 / 255) * Math.max(t, Math.max(n, r))), [o, 100 * i, 100 * r];
  }),
  (Nr.rgb.cmyk = function (e) {
    const t = e[0] / 255,
      n = e[1] / 255,
      r = e[2] / 255,
      o = Math.min(1 - t, 1 - n, 1 - r);
    return [
      100 * ((1 - t - o) / (1 - o) || 0),
      100 * ((1 - n - o) / (1 - o) || 0),
      100 * ((1 - r - o) / (1 - o) || 0),
      100 * o
    ];
  }),
  (Nr.rgb.keyword = function (e) {
    const t = jr[e];
    if (t) return t;
    let n,
      r = 1 / 0;
    for (const t of Object.keys(Mr)) {
      const s = ((i = Mr[t]), ((o = e)[0] - i[0]) ** 2 + (o[1] - i[1]) ** 2 + (o[2] - i[2]) ** 2);
      s < r && ((r = s), (n = t));
    }
    var o, i;
    return n;
  }),
  (Nr.keyword.rgb = function (e) {
    return Mr[e];
  }),
  (Nr.rgb.xyz = function (e) {
    let t = e[0] / 255,
      n = e[1] / 255,
      r = e[2] / 255;
    (t = t > 0.04045 ? ((t + 0.055) / 1.055) ** 2.4 : t / 12.92),
      (n = n > 0.04045 ? ((n + 0.055) / 1.055) ** 2.4 : n / 12.92),
      (r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92);
    return [
      100 * (0.4124 * t + 0.3576 * n + 0.1805 * r),
      100 * (0.2126 * t + 0.7152 * n + 0.0722 * r),
      100 * (0.0193 * t + 0.1192 * n + 0.9505 * r)
    ];
  }),
  (Nr.rgb.lab = function (e) {
    const t = Nr.rgb.xyz(e);
    let n = t[0],
      r = t[1],
      o = t[2];
    (n /= 95.047),
      (r /= 100),
      (o /= 108.883),
      (n = n > 0.008856 ? n ** (1 / 3) : 7.787 * n + 16 / 116),
      (r = r > 0.008856 ? r ** (1 / 3) : 7.787 * r + 16 / 116),
      (o = o > 0.008856 ? o ** (1 / 3) : 7.787 * o + 16 / 116);
    return [116 * r - 16, 500 * (n - r), 200 * (r - o)];
  }),
  (Nr.hsl.rgb = function (e) {
    const t = e[0] / 360,
      n = e[1] / 100,
      r = e[2] / 100;
    let o, i, s;
    if (0 === n) return (s = 255 * r), [s, s, s];
    o = r < 0.5 ? r * (1 + n) : r + n - r * n;
    const a = 2 * r - o,
      c = [0, 0, 0];
    for (let e = 0; e < 3; e++)
      (i = t + (1 / 3) * -(e - 1)),
        i < 0 && i++,
        i > 1 && i--,
        (s = 6 * i < 1 ? a + 6 * (o - a) * i : 2 * i < 1 ? o : 3 * i < 2 ? a + (o - a) * (2 / 3 - i) * 6 : a),
        (c[e] = 255 * s);
    return c;
  }),
  (Nr.hsl.hsv = function (e) {
    const t = e[0];
    let n = e[1] / 100,
      r = e[2] / 100,
      o = n;
    const i = Math.max(r, 0.01);
    (r *= 2), (n *= r <= 1 ? r : 2 - r), (o *= i <= 1 ? i : 2 - i);
    return [t, 100 * (0 === r ? (2 * o) / (i + o) : (2 * n) / (r + n)), 100 * ((r + n) / 2)];
  }),
  (Nr.hsv.rgb = function (e) {
    const t = e[0] / 60,
      n = e[1] / 100;
    let r = e[2] / 100;
    const o = Math.floor(t) % 6,
      i = t - Math.floor(t),
      s = 255 * r * (1 - n),
      a = 255 * r * (1 - n * i),
      c = 255 * r * (1 - n * (1 - i));
    switch (((r *= 255), o)) {
      case 0:
        return [r, c, s];
      case 1:
        return [a, r, s];
      case 2:
        return [s, r, c];
      case 3:
        return [s, a, r];
      case 4:
        return [c, s, r];
      case 5:
        return [r, s, a];
    }
  }),
  (Nr.hsv.hsl = function (e) {
    const t = e[0],
      n = e[1] / 100,
      r = e[2] / 100,
      o = Math.max(r, 0.01);
    let i, s;
    s = (2 - n) * r;
    const a = (2 - n) * o;
    return (i = n * o), (i /= a <= 1 ? a : 2 - a), (i = i || 0), (s /= 2), [t, 100 * i, 100 * s];
  }),
  (Nr.hwb.rgb = function (e) {
    const t = e[0] / 360;
    let n = e[1] / 100,
      r = e[2] / 100;
    const o = n + r;
    let i;
    o > 1 && ((n /= o), (r /= o));
    const s = Math.floor(6 * t),
      a = 1 - r;
    (i = 6 * t - s), 0 != (1 & s) && (i = 1 - i);
    const c = n + i * (a - n);
    let u, l, h;
    switch (s) {
      default:
      case 6:
      case 0:
        (u = a), (l = c), (h = n);
        break;
      case 1:
        (u = c), (l = a), (h = n);
        break;
      case 2:
        (u = n), (l = a), (h = c);
        break;
      case 3:
        (u = n), (l = c), (h = a);
        break;
      case 4:
        (u = c), (l = n), (h = a);
        break;
      case 5:
        (u = a), (l = n), (h = c);
    }
    return [255 * u, 255 * l, 255 * h];
  }),
  (Nr.cmyk.rgb = function (e) {
    const t = e[0] / 100,
      n = e[1] / 100,
      r = e[2] / 100,
      o = e[3] / 100;
    return [
      255 * (1 - Math.min(1, t * (1 - o) + o)),
      255 * (1 - Math.min(1, n * (1 - o) + o)),
      255 * (1 - Math.min(1, r * (1 - o) + o))
    ];
  }),
  (Nr.xyz.rgb = function (e) {
    const t = e[0] / 100,
      n = e[1] / 100,
      r = e[2] / 100;
    let o, i, s;
    return (
      (o = 3.2406 * t + -1.5372 * n + -0.4986 * r),
      (i = -0.9689 * t + 1.8758 * n + 0.0415 * r),
      (s = 0.0557 * t + -0.204 * n + 1.057 * r),
      (o = o > 0.0031308 ? 1.055 * o ** (1 / 2.4) - 0.055 : 12.92 * o),
      (i = i > 0.0031308 ? 1.055 * i ** (1 / 2.4) - 0.055 : 12.92 * i),
      (s = s > 0.0031308 ? 1.055 * s ** (1 / 2.4) - 0.055 : 12.92 * s),
      (o = Math.min(Math.max(0, o), 1)),
      (i = Math.min(Math.max(0, i), 1)),
      (s = Math.min(Math.max(0, s), 1)),
      [255 * o, 255 * i, 255 * s]
    );
  }),
  (Nr.xyz.lab = function (e) {
    let t = e[0],
      n = e[1],
      r = e[2];
    (t /= 95.047),
      (n /= 100),
      (r /= 108.883),
      (t = t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116),
      (n = n > 0.008856 ? n ** (1 / 3) : 7.787 * n + 16 / 116),
      (r = r > 0.008856 ? r ** (1 / 3) : 7.787 * r + 16 / 116);
    return [116 * n - 16, 500 * (t - n), 200 * (n - r)];
  }),
  (Nr.lab.xyz = function (e) {
    let t, n, r;
    (n = (e[0] + 16) / 116), (t = e[1] / 500 + n), (r = n - e[2] / 200);
    const o = n ** 3,
      i = t ** 3,
      s = r ** 3;
    return (
      (n = o > 0.008856 ? o : (n - 16 / 116) / 7.787),
      (t = i > 0.008856 ? i : (t - 16 / 116) / 7.787),
      (r = s > 0.008856 ? s : (r - 16 / 116) / 7.787),
      (t *= 95.047),
      (n *= 100),
      (r *= 108.883),
      [t, n, r]
    );
  }),
  (Nr.lab.lch = function (e) {
    const t = e[0],
      n = e[1],
      r = e[2];
    let o;
    (o = (360 * Math.atan2(r, n)) / 2 / Math.PI), o < 0 && (o += 360);
    return [t, Math.sqrt(n * n + r * r), o];
  }),
  (Nr.lch.lab = function (e) {
    const t = e[0],
      n = e[1],
      r = (e[2] / 360) * 2 * Math.PI;
    return [t, n * Math.cos(r), n * Math.sin(r)];
  }),
  (Nr.rgb.ansi16 = function (e, t = null) {
    const [n, r, o] = e;
    let i = null === t ? Nr.rgb.hsv(e)[2] : t;
    if (((i = Math.round(i / 50)), 0 === i)) return 30;
    let s = 30 + ((Math.round(o / 255) << 2) | (Math.round(r / 255) << 1) | Math.round(n / 255));
    return 2 === i && (s += 60), s;
  }),
  (Nr.hsv.ansi16 = function (e) {
    return Nr.rgb.ansi16(Nr.hsv.rgb(e), e[2]);
  }),
  (Nr.rgb.ansi256 = function (e) {
    const t = e[0],
      n = e[1],
      r = e[2];
    if (t === n && n === r) return t < 8 ? 16 : t > 248 ? 231 : Math.round(((t - 8) / 247) * 24) + 232;
    return 16 + 36 * Math.round((t / 255) * 5) + 6 * Math.round((n / 255) * 5) + Math.round((r / 255) * 5);
  }),
  (Nr.ansi16.rgb = function (e) {
    let t = e % 10;
    if (0 === t || 7 === t) return e > 50 && (t += 3.5), (t = (t / 10.5) * 255), [t, t, t];
    const n = 0.5 * (1 + ~~(e > 50));
    return [(1 & t) * n * 255, ((t >> 1) & 1) * n * 255, ((t >> 2) & 1) * n * 255];
  }),
  (Nr.ansi256.rgb = function (e) {
    if (e >= 232) {
      const t = 10 * (e - 232) + 8;
      return [t, t, t];
    }
    let t;
    e -= 16;
    return [(Math.floor(e / 36) / 5) * 255, (Math.floor((t = e % 36) / 6) / 5) * 255, ((t % 6) / 5) * 255];
  }),
  (Nr.rgb.hex = function (e) {
    const t = (((255 & Math.round(e[0])) << 16) + ((255 & Math.round(e[1])) << 8) + (255 & Math.round(e[2])))
      .toString(16)
      .toUpperCase();
    return '000000'.substring(t.length) + t;
  }),
  (Nr.hex.rgb = function (e) {
    const t = e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!t) return [0, 0, 0];
    let n = t[0];
    3 === t[0].length &&
      (n = n
        .split('')
        .map(e => e + e)
        .join(''));
    const r = parseInt(n, 16);
    return [(r >> 16) & 255, (r >> 8) & 255, 255 & r];
  }),
  (Nr.rgb.hcg = function (e) {
    const t = e[0] / 255,
      n = e[1] / 255,
      r = e[2] / 255,
      o = Math.max(Math.max(t, n), r),
      i = Math.min(Math.min(t, n), r),
      s = o - i;
    let a, c;
    return (
      (a = s < 1 ? i / (1 - s) : 0),
      (c = s <= 0 ? 0 : o === t ? ((n - r) / s) % 6 : o === n ? 2 + (r - t) / s : 4 + (t - n) / s),
      (c /= 6),
      (c %= 1),
      [360 * c, 100 * s, 100 * a]
    );
  }),
  (Nr.hsl.hcg = function (e) {
    const t = e[1] / 100,
      n = e[2] / 100,
      r = n < 0.5 ? 2 * t * n : 2 * t * (1 - n);
    let o = 0;
    return r < 1 && (o = (n - 0.5 * r) / (1 - r)), [e[0], 100 * r, 100 * o];
  }),
  (Nr.hsv.hcg = function (e) {
    const t = e[1] / 100,
      n = e[2] / 100,
      r = t * n;
    let o = 0;
    return r < 1 && (o = (n - r) / (1 - r)), [e[0], 100 * r, 100 * o];
  }),
  (Nr.hcg.rgb = function (e) {
    const t = e[0] / 360,
      n = e[1] / 100,
      r = e[2] / 100;
    if (0 === n) return [255 * r, 255 * r, 255 * r];
    const o = [0, 0, 0],
      i = (t % 1) * 6,
      s = i % 1,
      a = 1 - s;
    let c = 0;
    switch (Math.floor(i)) {
      case 0:
        (o[0] = 1), (o[1] = s), (o[2] = 0);
        break;
      case 1:
        (o[0] = a), (o[1] = 1), (o[2] = 0);
        break;
      case 2:
        (o[0] = 0), (o[1] = 1), (o[2] = s);
        break;
      case 3:
        (o[0] = 0), (o[1] = a), (o[2] = 1);
        break;
      case 4:
        (o[0] = s), (o[1] = 0), (o[2] = 1);
        break;
      default:
        (o[0] = 1), (o[1] = 0), (o[2] = a);
    }
    return (c = (1 - n) * r), [255 * (n * o[0] + c), 255 * (n * o[1] + c), 255 * (n * o[2] + c)];
  }),
  (Nr.hcg.hsv = function (e) {
    const t = e[1] / 100,
      n = t + (e[2] / 100) * (1 - t);
    let r = 0;
    return n > 0 && (r = t / n), [e[0], 100 * r, 100 * n];
  }),
  (Nr.hcg.hsl = function (e) {
    const t = e[1] / 100,
      n = (e[2] / 100) * (1 - t) + 0.5 * t;
    let r = 0;
    return (
      n > 0 && n < 0.5 ? (r = t / (2 * n)) : n >= 0.5 && n < 1 && (r = t / (2 * (1 - n))), [e[0], 100 * r, 100 * n]
    );
  }),
  (Nr.hcg.hwb = function (e) {
    const t = e[1] / 100,
      n = t + (e[2] / 100) * (1 - t);
    return [e[0], 100 * (n - t), 100 * (1 - n)];
  }),
  (Nr.hwb.hcg = function (e) {
    const t = e[1] / 100,
      n = 1 - e[2] / 100,
      r = n - t;
    let o = 0;
    return r < 1 && (o = (n - r) / (1 - r)), [e[0], 100 * r, 100 * o];
  }),
  (Nr.apple.rgb = function (e) {
    return [(e[0] / 65535) * 255, (e[1] / 65535) * 255, (e[2] / 65535) * 255];
  }),
  (Nr.rgb.apple = function (e) {
    return [(e[0] / 255) * 65535, (e[1] / 255) * 65535, (e[2] / 255) * 65535];
  }),
  (Nr.gray.rgb = function (e) {
    return [(e[0] / 100) * 255, (e[0] / 100) * 255, (e[0] / 100) * 255];
  }),
  (Nr.gray.hsl = function (e) {
    return [0, 0, e[0]];
  }),
  (Nr.gray.hsv = Nr.gray.hsl),
  (Nr.gray.hwb = function (e) {
    return [0, 100, e[0]];
  }),
  (Nr.gray.cmyk = function (e) {
    return [0, 0, 0, e[0]];
  }),
  (Nr.gray.lab = function (e) {
    return [e[0], 0, 0];
  }),
  (Nr.gray.hex = function (e) {
    const t = 255 & Math.round((e[0] / 100) * 255),
      n = ((t << 16) + (t << 8) + t).toString(16).toUpperCase();
    return '000000'.substring(n.length) + n;
  }),
  (Nr.rgb.gray = function (e) {
    return [((e[0] + e[1] + e[2]) / 3 / 255) * 100];
  });
const Wr = {};
Object.keys(Ar).forEach(e => {
  (Wr[e] = {}),
    Object.defineProperty(Wr[e], 'channels', { value: Ar[e].channels }),
    Object.defineProperty(Wr[e], 'labels', { value: Ar[e].labels });
  const t = (function (e) {
    const t = Fr(e),
      n = {},
      r = Object.keys(t);
    for (let e = r.length, o = 0; o < e; o++) {
      const e = r[o];
      null !== t[e].parent && (n[e] = Lr(e, t));
    }
    return n;
  })(e);
  Object.keys(t).forEach(n => {
    const r = t[n];
    (Wr[e][n] = (function (e) {
      const t = function (...t) {
        const n = t[0];
        if (null == n) return n;
        n.length > 1 && (t = n);
        const r = e(t);
        if ('object' == typeof r) for (let e = r.length, t = 0; t < e; t++) r[t] = Math.round(r[t]);
        return r;
      };
      return 'conversion' in e && (t.conversion = e.conversion), t;
    })(r)),
      (Wr[e][n].raw = (function (e) {
        const t = function (...t) {
          const n = t[0];
          return null == n ? n : (n.length > 1 && (t = n), e(t));
        };
        return 'conversion' in e && (t.conversion = e.conversion), t;
      })(r));
  });
});
var $r = Wr,
  Hr = P(function (e) {
    const t = (e, t) => (...n) => `[${e(...n) + t}m`,
      n = (e, t) => (...n) => {
        const r = e(...n);
        return `[${38 + t};5;${r}m`;
      },
      r = (e, t) => (...n) => {
        const r = e(...n);
        return `[${38 + t};2;${r[0]};${r[1]};${r[2]}m`;
      },
      o = e => e,
      i = (e, t, n) => [e, t, n],
      s = (e, t, n) => {
        Object.defineProperty(e, t, {
          get: () => {
            const r = n();
            return Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0 }), r;
          },
          enumerable: !0,
          configurable: !0
        });
      };
    let a;
    const c = (e, t, n, r) => {
      void 0 === a && (a = $r);
      const o = r ? 10 : 0,
        i = {};
      for (const [r, s] of Object.entries(a)) {
        const a = 'ansi16' === r ? 'ansi' : r;
        r === t ? (i[a] = e(n, o)) : 'object' == typeof s && (i[a] = e(s[t], o));
      }
      return i;
    };
    Object.defineProperty(e, 'exports', {
      enumerable: !0,
      get: function () {
        const e = new Map(),
          a = {
            modifier: {
              reset: [0, 0],
              bold: [1, 22],
              dim: [2, 22],
              italic: [3, 23],
              underline: [4, 24],
              inverse: [7, 27],
              hidden: [8, 28],
              strikethrough: [9, 29]
            },
            color: {
              black: [30, 39],
              red: [31, 39],
              green: [32, 39],
              yellow: [33, 39],
              blue: [34, 39],
              magenta: [35, 39],
              cyan: [36, 39],
              white: [37, 39],
              blackBright: [90, 39],
              redBright: [91, 39],
              greenBright: [92, 39],
              yellowBright: [93, 39],
              blueBright: [94, 39],
              magentaBright: [95, 39],
              cyanBright: [96, 39],
              whiteBright: [97, 39]
            },
            bgColor: {
              bgBlack: [40, 49],
              bgRed: [41, 49],
              bgGreen: [42, 49],
              bgYellow: [43, 49],
              bgBlue: [44, 49],
              bgMagenta: [45, 49],
              bgCyan: [46, 49],
              bgWhite: [47, 49],
              bgBlackBright: [100, 49],
              bgRedBright: [101, 49],
              bgGreenBright: [102, 49],
              bgYellowBright: [103, 49],
              bgBlueBright: [104, 49],
              bgMagentaBright: [105, 49],
              bgCyanBright: [106, 49],
              bgWhiteBright: [107, 49]
            }
          };
        (a.color.gray = a.color.blackBright),
          (a.bgColor.bgGray = a.bgColor.bgBlackBright),
          (a.color.grey = a.color.blackBright),
          (a.bgColor.bgGrey = a.bgColor.bgBlackBright);
        for (const [t, n] of Object.entries(a)) {
          for (const [t, r] of Object.entries(n))
            (a[t] = { open: `[${r[0]}m`, close: `[${r[1]}m` }), (n[t] = a[t]), e.set(r[0], r[1]);
          Object.defineProperty(a, t, { value: n, enumerable: !1 });
        }
        return (
          Object.defineProperty(a, 'codes', { value: e, enumerable: !1 }),
          (a.color.close = '[39m'),
          (a.bgColor.close = '[49m'),
          s(a.color, 'ansi', () => c(t, 'ansi16', o, !1)),
          s(a.color, 'ansi256', () => c(n, 'ansi256', o, !1)),
          s(a.color, 'ansi16m', () => c(r, 'rgb', i, !1)),
          s(a.bgColor, 'ansi', () => c(t, 'ansi16', o, !0)),
          s(a.bgColor, 'ansi256', () => c(n, 'ansi256', o, !0)),
          s(a.bgColor, 'ansi16m', () => c(r, 'rgb', i, !0)),
          a
        );
      }
    });
  }),
  Br = (e, t = process.argv) => {
    const n = e.startsWith('-') ? '' : 1 === e.length ? '-' : '--',
      r = t.indexOf(n + e),
      o = t.indexOf('--');
    return -1 !== r && (-1 === o || r < o);
  };
const { env: Ur } = process;
let zr;
function Vr(e) {
  return 0 !== e && { level: e, hasBasic: !0, has256: e >= 2, has16m: e >= 3 };
}
function Gr(e, t) {
  if (0 === zr) return 0;
  if (Br('color=16m') || Br('color=full') || Br('color=truecolor')) return 3;
  if (Br('color=256')) return 2;
  if (e && !t && void 0 === zr) return 0;
  const n = zr || 0;
  if ('dumb' === Ur.TERM) return n;
  if ('win32' === process.platform) {
    const e = b.default.release().split('.');
    return Number(e[0]) >= 10 && Number(e[2]) >= 10586 ? (Number(e[2]) >= 14931 ? 3 : 2) : 1;
  }
  if ('CI' in Ur)
    return ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(e => e in Ur) ||
      'codeship' === Ur.CI_NAME
      ? 1
      : n;
  if ('TEAMCITY_VERSION' in Ur) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(Ur.TEAMCITY_VERSION) ? 1 : 0;
  if ('truecolor' === Ur.COLORTERM) return 3;
  if ('TERM_PROGRAM' in Ur) {
    const e = parseInt((Ur.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
    switch (Ur.TERM_PROGRAM) {
      case 'iTerm.app':
        return e >= 3 ? 3 : 2;
      case 'Apple_Terminal':
        return 2;
    }
  }
  return /-256(color)?$/i.test(Ur.TERM)
    ? 2
    : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(Ur.TERM) || 'COLORTERM' in Ur
    ? 1
    : n;
}
Br('no-color') || Br('no-colors') || Br('color=false') || Br('color=never')
  ? (zr = 0)
  : (Br('color') || Br('colors') || Br('color=true') || Br('color=always')) && (zr = 1),
  'FORCE_COLOR' in Ur &&
    (zr =
      'true' === Ur.FORCE_COLOR
        ? 1
        : 'false' === Ur.FORCE_COLOR
        ? 0
        : 0 === Ur.FORCE_COLOR.length
        ? 1
        : Math.min(parseInt(Ur.FORCE_COLOR, 10), 3));
var Kr = {
  supportsColor: function (e) {
    return Vr(Gr(e, e && e.isTTY));
  },
  stdout: Vr(Gr(!0, C.default.isatty(1))),
  stderr: Vr(Gr(!0, C.default.isatty(2)))
};
var Jr = {
  stringReplaceAll: (e, t, n) => {
    let r = e.indexOf(t);
    if (-1 === r) return e;
    const o = t.length;
    let i = 0,
      s = '';
    do {
      (s += e.substr(i, r - i) + t + n), (i = r + o), (r = e.indexOf(t, i));
    } while (-1 !== r);
    return (s += e.substr(i)), s;
  },
  stringEncaseCRLFWithFirstIndex: (e, t, n, r) => {
    let o = 0,
      i = '';
    do {
      const s = '\r' === e[r - 1];
      (i += e.substr(o, (s ? r - 1 : r) - o) + t + (s ? '\r\n' : '\n') + n), (o = r + 1), (r = e.indexOf('\n', o));
    } while (-1 !== r);
    return (i += e.substr(o)), i;
  }
};
const Yr = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
  Qr = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
  Xr = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
  Zr = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
  eo = new Map([
    ['n', '\n'],
    ['r', '\r'],
    ['t', '\t'],
    ['b', '\b'],
    ['f', '\f'],
    ['v', '\v'],
    ['0', '\0'],
    ['\\', '\\'],
    ['e', ''],
    ['a', '']
  ]);
function to(e) {
  const t = 'u' === e[0],
    n = '{' === e[1];
  return (t && !n && 5 === e.length) || ('x' === e[0] && 3 === e.length)
    ? String.fromCharCode(parseInt(e.slice(1), 16))
    : t && n
    ? String.fromCodePoint(parseInt(e.slice(2, -1), 16))
    : eo.get(e) || e;
}
function no(e, t) {
  const n = [],
    r = t.trim().split(/\s*,\s*/g);
  let o;
  for (const t of r) {
    const r = Number(t);
    if (Number.isNaN(r)) {
      if (!(o = t.match(Xr))) throw new Error(`Invalid Chalk template style argument: ${t} (in style '${e}')`);
      n.push(o[2].replace(Zr, (e, t, n) => (t ? to(t) : n)));
    } else n.push(r);
  }
  return n;
}
function ro(e) {
  Qr.lastIndex = 0;
  const t = [];
  let n;
  for (; null !== (n = Qr.exec(e)); ) {
    const e = n[1];
    if (n[2]) {
      const r = no(e, n[2]);
      t.push([e].concat(r));
    } else t.push([e]);
  }
  return t;
}
function oo(e, t) {
  const n = {};
  for (const e of t) for (const t of e.styles) n[t[0]] = e.inverse ? null : t.slice(1);
  let r = e;
  for (const [e, t] of Object.entries(n))
    if (Array.isArray(t)) {
      if (!(e in r)) throw new Error('Unknown Chalk style: ' + e);
      r = t.length > 0 ? r[e](...t) : r[e];
    }
  return r;
}
var io = (e, t) => {
  const n = [],
    r = [];
  let o = [];
  if (
    (t.replace(Yr, (t, i, s, a, c, u) => {
      if (i) o.push(to(i));
      else if (a) {
        const t = o.join('');
        (o = []), r.push(0 === n.length ? t : oo(e, n)(t)), n.push({ inverse: s, styles: ro(a) });
      } else if (c) {
        if (0 === n.length) throw new Error('Found extraneous } in Chalk template literal');
        r.push(oo(e, n)(o.join(''))), (o = []), n.pop();
      } else o.push(u);
    }),
    r.push(o.join('')),
    n.length > 0)
  ) {
    const e = `Chalk template literal is missing ${n.length} closing bracket${1 === n.length ? '' : 's'} (\`}\`)`;
    throw new Error(e);
  }
  return r.join('');
};
const { stdout: so, stderr: ao } = Kr,
  { stringReplaceAll: co, stringEncaseCRLFWithFirstIndex: uo } = Jr,
  { isArray: lo } = Array,
  ho = ['ansi', 'ansi', 'ansi256', 'ansi16m'],
  fo = Object.create(null);
class po {
  constructor(e) {
    return go(e);
  }
}
const go = e => {
  const t = {};
  return (
    ((e, t = {}) => {
      if (t.level && !(Number.isInteger(t.level) && t.level >= 0 && t.level <= 3))
        throw new Error('The `level` option should be an integer from 0 to 3');
      const n = so ? so.level : 0;
      e.level = void 0 === t.level ? n : t.level;
    })(t, e),
    (t.template = (...e) => ko(t.template, ...e)),
    Object.setPrototypeOf(t, mo.prototype),
    Object.setPrototypeOf(t.template, t),
    (t.template.constructor = () => {
      throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
    }),
    (t.template.Instance = po),
    t.template
  );
};
function mo(e) {
  return go(e);
}
for (const [e, t] of Object.entries(Hr))
  fo[e] = {
    get() {
      const n = _o(this, bo(t.open, t.close, this._styler), this._isEmpty);
      return Object.defineProperty(this, e, { value: n }), n;
    }
  };
fo.visible = {
  get() {
    const e = _o(this, this._styler, !0);
    return Object.defineProperty(this, 'visible', { value: e }), e;
  }
};
const yo = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];
for (const e of yo)
  fo[e] = {
    get() {
      const { level: t } = this;
      return function (...n) {
        const r = bo(Hr.color[ho[t]][e](...n), Hr.color.close, this._styler);
        return _o(this, r, this._isEmpty);
      };
    }
  };
for (const e of yo) {
  fo['bg' + e[0].toUpperCase() + e.slice(1)] = {
    get() {
      const { level: t } = this;
      return function (...n) {
        const r = bo(Hr.bgColor[ho[t]][e](...n), Hr.bgColor.close, this._styler);
        return _o(this, r, this._isEmpty);
      };
    }
  };
}
const vo = Object.defineProperties(() => {}, {
    ...fo,
    level: {
      enumerable: !0,
      get() {
        return this._generator.level;
      },
      set(e) {
        this._generator.level = e;
      }
    }
  }),
  bo = (e, t, n) => {
    let r, o;
    return (
      void 0 === n ? ((r = e), (o = t)) : ((r = n.openAll + e), (o = t + n.closeAll)),
      { open: e, close: t, openAll: r, closeAll: o, parent: n }
    );
  },
  _o = (e, t, n) => {
    const r = (...e) =>
      lo(e[0]) && lo(e[0].raw) ? wo(r, ko(r, ...e)) : wo(r, 1 === e.length ? '' + e[0] : e.join(' '));
    return Object.setPrototypeOf(r, vo), (r._generator = e), (r._styler = t), (r._isEmpty = n), r;
  },
  wo = (e, t) => {
    if (e.level <= 0 || !t) return e._isEmpty ? '' : t;
    let n = e._styler;
    if (void 0 === n) return t;
    const { openAll: r, closeAll: o } = n;
    if (-1 !== t.indexOf('')) for (; void 0 !== n; ) (t = co(t, n.close, n.open)), (n = n.parent);
    const i = t.indexOf('\n');
    return -1 !== i && (t = uo(t, o, r, i)), r + t + o;
  };
let Ro;
const ko = (e, ...t) => {
  const [n] = t;
  if (!lo(n) || !lo(n.raw)) return t.join(' ');
  const r = t.slice(1),
    o = [n.raw[0]];
  for (let e = 1; e < n.length; e++) o.push(String(r[e - 1]).replace(/[{}\\]/g, '\\$&'), String(n.raw[e]));
  return void 0 === Ro && (Ro = io), Ro(e, o.join(''));
};
Object.defineProperties(mo.prototype, fo);
const Co = mo();
(Co.supportsColor = so), (Co.stderr = mo({ level: ao ? ao.level : 0 })), (Co.stderr.supportsColor = ao);
var Oo = Co,
  To = Object.defineProperty(
    {
      default: /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g,
      matchToToken: function (e) {
        var t = { type: 'invalid', value: e[0], closed: void 0 };
        return (
          e[1]
            ? ((t.type = 'string'), (t.closed = !(!e[3] && !e[4])))
            : e[5]
            ? (t.type = 'comment')
            : e[6]
            ? ((t.type = 'comment'), (t.closed = !!e[7]))
            : e[8]
            ? (t.type = 'regex')
            : e[9]
            ? (t.type = 'number')
            : e[10]
            ? (t.type = 'name')
            : e[11]
            ? (t.type = 'punctuator')
            : e[12] && (t.type = 'whitespace'),
          t
        );
      }
    },
    '__esModule',
    { value: !0 }
  ),
  Po = Fo,
  xo = Io,
  So = function (e) {
    let t = !0;
    for (let n = 0, r = Array.from(e); n < r.length; n++) {
      const e = r[n].codePointAt(0);
      if (t) {
        if (!Fo(e)) return !1;
        t = !1;
      } else if (!Io(e)) return !1;
    }
    return !t;
  };
let Eo =
    'ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࢠ-ࢴࢶ-ࣇऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲈᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-鿼ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞿꟂ-ꟊꟵ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ',
  qo =
    '‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛࣓-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿᫀᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷹᷻-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿';
const Do = new RegExp('[' + Eo + ']'),
  Mo = new RegExp('[' + Eo + qo + ']');
Eo = qo = null;
const jo = [
    0,
    11,
    2,
    25,
    2,
    18,
    2,
    1,
    2,
    14,
    3,
    13,
    35,
    122,
    70,
    52,
    268,
    28,
    4,
    48,
    48,
    31,
    14,
    29,
    6,
    37,
    11,
    29,
    3,
    35,
    5,
    7,
    2,
    4,
    43,
    157,
    19,
    35,
    5,
    35,
    5,
    39,
    9,
    51,
    157,
    310,
    10,
    21,
    11,
    7,
    153,
    5,
    3,
    0,
    2,
    43,
    2,
    1,
    4,
    0,
    3,
    22,
    11,
    22,
    10,
    30,
    66,
    18,
    2,
    1,
    11,
    21,
    11,
    25,
    71,
    55,
    7,
    1,
    65,
    0,
    16,
    3,
    2,
    2,
    2,
    28,
    43,
    28,
    4,
    28,
    36,
    7,
    2,
    27,
    28,
    53,
    11,
    21,
    11,
    18,
    14,
    17,
    111,
    72,
    56,
    50,
    14,
    50,
    14,
    35,
    349,
    41,
    7,
    1,
    79,
    28,
    11,
    0,
    9,
    21,
    107,
    20,
    28,
    22,
    13,
    52,
    76,
    44,
    33,
    24,
    27,
    35,
    30,
    0,
    3,
    0,
    9,
    34,
    4,
    0,
    13,
    47,
    15,
    3,
    22,
    0,
    2,
    0,
    36,
    17,
    2,
    24,
    85,
    6,
    2,
    0,
    2,
    3,
    2,
    14,
    2,
    9,
    8,
    46,
    39,
    7,
    3,
    1,
    3,
    21,
    2,
    6,
    2,
    1,
    2,
    4,
    4,
    0,
    19,
    0,
    13,
    4,
    159,
    52,
    19,
    3,
    21,
    2,
    31,
    47,
    21,
    1,
    2,
    0,
    185,
    46,
    42,
    3,
    37,
    47,
    21,
    0,
    60,
    42,
    14,
    0,
    72,
    26,
    230,
    43,
    117,
    63,
    32,
    7,
    3,
    0,
    3,
    7,
    2,
    1,
    2,
    23,
    16,
    0,
    2,
    0,
    95,
    7,
    3,
    38,
    17,
    0,
    2,
    0,
    29,
    0,
    11,
    39,
    8,
    0,
    22,
    0,
    12,
    45,
    20,
    0,
    35,
    56,
    264,
    8,
    2,
    36,
    18,
    0,
    50,
    29,
    113,
    6,
    2,
    1,
    2,
    37,
    22,
    0,
    26,
    5,
    2,
    1,
    2,
    31,
    15,
    0,
    328,
    18,
    190,
    0,
    80,
    921,
    103,
    110,
    18,
    195,
    2749,
    1070,
    4050,
    582,
    8634,
    568,
    8,
    30,
    114,
    29,
    19,
    47,
    17,
    3,
    32,
    20,
    6,
    18,
    689,
    63,
    129,
    74,
    6,
    0,
    67,
    12,
    65,
    1,
    2,
    0,
    29,
    6135,
    9,
    1237,
    43,
    8,
    8952,
    286,
    50,
    2,
    18,
    3,
    9,
    395,
    2309,
    106,
    6,
    12,
    4,
    8,
    8,
    9,
    5991,
    84,
    2,
    70,
    2,
    1,
    3,
    0,
    3,
    1,
    3,
    3,
    2,
    11,
    2,
    0,
    2,
    6,
    2,
    64,
    2,
    3,
    3,
    7,
    2,
    6,
    2,
    27,
    2,
    3,
    2,
    4,
    2,
    0,
    4,
    6,
    2,
    339,
    3,
    24,
    2,
    24,
    2,
    30,
    2,
    24,
    2,
    30,
    2,
    24,
    2,
    30,
    2,
    24,
    2,
    30,
    2,
    24,
    2,
    7,
    2357,
    44,
    11,
    6,
    17,
    0,
    370,
    43,
    1301,
    196,
    60,
    67,
    8,
    0,
    1205,
    3,
    2,
    26,
    2,
    1,
    2,
    0,
    3,
    0,
    2,
    9,
    2,
    3,
    2,
    0,
    2,
    0,
    7,
    0,
    5,
    0,
    2,
    0,
    2,
    0,
    2,
    2,
    2,
    1,
    2,
    0,
    3,
    0,
    2,
    0,
    2,
    0,
    2,
    0,
    2,
    0,
    2,
    1,
    2,
    0,
    3,
    3,
    2,
    6,
    2,
    3,
    2,
    3,
    2,
    0,
    2,
    9,
    2,
    16,
    6,
    2,
    2,
    4,
    2,
    16,
    4421,
    42717,
    35,
    4148,
    12,
    221,
    3,
    5761,
    15,
    7472,
    3104,
    541,
    1507,
    4938
  ],
  No = [
    509,
    0,
    227,
    0,
    150,
    4,
    294,
    9,
    1368,
    2,
    2,
    1,
    6,
    3,
    41,
    2,
    5,
    0,
    166,
    1,
    574,
    3,
    9,
    9,
    370,
    1,
    154,
    10,
    176,
    2,
    54,
    14,
    32,
    9,
    16,
    3,
    46,
    10,
    54,
    9,
    7,
    2,
    37,
    13,
    2,
    9,
    6,
    1,
    45,
    0,
    13,
    2,
    49,
    13,
    9,
    3,
    2,
    11,
    83,
    11,
    7,
    0,
    161,
    11,
    6,
    9,
    7,
    3,
    56,
    1,
    2,
    6,
    3,
    1,
    3,
    2,
    10,
    0,
    11,
    1,
    3,
    6,
    4,
    4,
    193,
    17,
    10,
    9,
    5,
    0,
    82,
    19,
    13,
    9,
    214,
    6,
    3,
    8,
    28,
    1,
    83,
    16,
    16,
    9,
    82,
    12,
    9,
    9,
    84,
    14,
    5,
    9,
    243,
    14,
    166,
    9,
    71,
    5,
    2,
    1,
    3,
    3,
    2,
    0,
    2,
    1,
    13,
    9,
    120,
    6,
    3,
    6,
    4,
    0,
    29,
    9,
    41,
    6,
    2,
    3,
    9,
    0,
    10,
    10,
    47,
    15,
    406,
    7,
    2,
    7,
    17,
    9,
    57,
    21,
    2,
    13,
    123,
    5,
    4,
    0,
    2,
    1,
    2,
    6,
    2,
    0,
    9,
    9,
    49,
    4,
    2,
    1,
    2,
    4,
    9,
    9,
    330,
    3,
    19306,
    9,
    135,
    4,
    60,
    6,
    26,
    9,
    1014,
    0,
    2,
    54,
    8,
    3,
    82,
    0,
    12,
    1,
    19628,
    1,
    5319,
    4,
    4,
    5,
    9,
    7,
    3,
    6,
    31,
    3,
    149,
    2,
    1418,
    49,
    513,
    54,
    5,
    49,
    9,
    0,
    15,
    0,
    23,
    4,
    2,
    14,
    1361,
    6,
    2,
    16,
    3,
    6,
    2,
    1,
    2,
    4,
    262,
    6,
    10,
    9,
    419,
    13,
    1495,
    6,
    110,
    6,
    6,
    9,
    4759,
    9,
    787719,
    239
  ];
function Ao(e, t) {
  let n = 65536;
  for (let r = 0, o = t.length; r < o; r += 2) {
    if (((n += t[r]), n > e)) return !1;
    if (((n += t[r + 1]), n >= e)) return !0;
  }
  return !1;
}
function Fo(e) {
  return e < 65
    ? 36 === e
    : e <= 90 ||
        (e < 97 ? 95 === e : e <= 122 || (e <= 65535 ? e >= 170 && Do.test(String.fromCharCode(e)) : Ao(e, jo)));
}
function Io(e) {
  return e < 48
    ? 36 === e
    : e < 58 ||
        (!(e < 65) &&
          (e <= 90 ||
            (e < 97
              ? 95 === e
              : e <= 122 || (e <= 65535 ? e >= 170 && Mo.test(String.fromCharCode(e)) : Ao(e, jo) || Ao(e, No)))));
}
var Lo = Object.defineProperty({ isIdentifierStart: Po, isIdentifierChar: xo, isIdentifierName: So }, '__esModule', {
    value: !0
  }),
  Wo = Yo,
  $o = Qo,
  Ho = Xo,
  Bo = function (e, t) {
    return Qo(e, t) || Xo(e);
  },
  Uo = function (e) {
    return Go.has(e);
  };
const zo = ['implements', 'interface', 'let', 'package', 'private', 'protected', 'public', 'static', 'yield'],
  Vo = ['eval', 'arguments'],
  Go = new Set([
    'break',
    'case',
    'catch',
    'continue',
    'debugger',
    'default',
    'do',
    'else',
    'finally',
    'for',
    'function',
    'if',
    'return',
    'switch',
    'throw',
    'try',
    'var',
    'const',
    'while',
    'with',
    'new',
    'this',
    'super',
    'class',
    'extends',
    'export',
    'import',
    'null',
    'true',
    'false',
    'in',
    'instanceof',
    'typeof',
    'void',
    'delete'
  ]),
  Ko = new Set(zo),
  Jo = new Set(Vo);
function Yo(e, t) {
  return (t && 'await' === e) || 'enum' === e;
}
function Qo(e, t) {
  return Yo(e, t) || Ko.has(e);
}
function Xo(e) {
  return Jo.has(e);
}
var Zo = Object.defineProperty(
    {
      isReservedWord: Wo,
      isStrictReservedWord: $o,
      isStrictBindOnlyReservedWord: Ho,
      isStrictBindReservedWord: Bo,
      isKeyword: Uo
    },
    '__esModule',
    { value: !0 }
  ),
  ei = P(function (e, t) {
    Object.defineProperty(t, '__esModule', { value: !0 }),
      Object.defineProperty(t, 'isIdentifierName', {
        enumerable: !0,
        get: function () {
          return Lo.isIdentifierName;
        }
      }),
      Object.defineProperty(t, 'isIdentifierChar', {
        enumerable: !0,
        get: function () {
          return Lo.isIdentifierChar;
        }
      }),
      Object.defineProperty(t, 'isIdentifierStart', {
        enumerable: !0,
        get: function () {
          return Lo.isIdentifierStart;
        }
      }),
      Object.defineProperty(t, 'isReservedWord', {
        enumerable: !0,
        get: function () {
          return Zo.isReservedWord;
        }
      }),
      Object.defineProperty(t, 'isStrictBindOnlyReservedWord', {
        enumerable: !0,
        get: function () {
          return Zo.isStrictBindOnlyReservedWord;
        }
      }),
      Object.defineProperty(t, 'isStrictBindReservedWord', {
        enumerable: !0,
        get: function () {
          return Zo.isStrictBindReservedWord;
        }
      }),
      Object.defineProperty(t, 'isStrictReservedWord', {
        enumerable: !0,
        get: function () {
          return Zo.isStrictReservedWord;
        }
      }),
      Object.defineProperty(t, 'isKeyword', {
        enumerable: !0,
        get: function () {
          return Zo.isKeyword;
        }
      });
  }),
  ti = /[|\\{}()[\]^$+*?.]/g,
  ni = function (e) {
    if ('string' != typeof e) throw new TypeError('Expected a string');
    return e.replace(ti, '\\$&');
  },
  ri = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50]
  },
  oi = P(function (e) {
    var t = {};
    for (var n in ri) ri.hasOwnProperty(n) && (t[ri[n]] = n);
    var r = (e.exports = {
      rgb: { channels: 3, labels: 'rgb' },
      hsl: { channels: 3, labels: 'hsl' },
      hsv: { channels: 3, labels: 'hsv' },
      hwb: { channels: 3, labels: 'hwb' },
      cmyk: { channels: 4, labels: 'cmyk' },
      xyz: { channels: 3, labels: 'xyz' },
      lab: { channels: 3, labels: 'lab' },
      lch: { channels: 3, labels: 'lch' },
      hex: { channels: 1, labels: ['hex'] },
      keyword: { channels: 1, labels: ['keyword'] },
      ansi16: { channels: 1, labels: ['ansi16'] },
      ansi256: { channels: 1, labels: ['ansi256'] },
      hcg: { channels: 3, labels: ['h', 'c', 'g'] },
      apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
      gray: { channels: 1, labels: ['gray'] }
    });
    for (var o in r)
      if (r.hasOwnProperty(o)) {
        if (!('channels' in r[o])) throw new Error('missing channels property: ' + o);
        if (!('labels' in r[o])) throw new Error('missing channel labels property: ' + o);
        if (r[o].labels.length !== r[o].channels) throw new Error('channel and label counts mismatch: ' + o);
        var i = r[o].channels,
          s = r[o].labels;
        delete r[o].channels,
          delete r[o].labels,
          Object.defineProperty(r[o], 'channels', { value: i }),
          Object.defineProperty(r[o], 'labels', { value: s });
      }
    (r.rgb.hsl = function (e) {
      var t,
        n,
        r = e[0] / 255,
        o = e[1] / 255,
        i = e[2] / 255,
        s = Math.min(r, o, i),
        a = Math.max(r, o, i),
        c = a - s;
      return (
        a === s
          ? (t = 0)
          : r === a
          ? (t = (o - i) / c)
          : o === a
          ? (t = 2 + (i - r) / c)
          : i === a && (t = 4 + (r - o) / c),
        (t = Math.min(60 * t, 360)) < 0 && (t += 360),
        (n = (s + a) / 2),
        [t, 100 * (a === s ? 0 : n <= 0.5 ? c / (a + s) : c / (2 - a - s)), 100 * n]
      );
    }),
      (r.rgb.hsv = function (e) {
        var t,
          n,
          r,
          o,
          i,
          s = e[0] / 255,
          a = e[1] / 255,
          c = e[2] / 255,
          u = Math.max(s, a, c),
          l = u - Math.min(s, a, c),
          h = function (e) {
            return (u - e) / 6 / l + 0.5;
          };
        return (
          0 === l
            ? (o = i = 0)
            : ((i = l / u),
              (t = h(s)),
              (n = h(a)),
              (r = h(c)),
              s === u ? (o = r - n) : a === u ? (o = 1 / 3 + t - r) : c === u && (o = 2 / 3 + n - t),
              o < 0 ? (o += 1) : o > 1 && (o -= 1)),
          [360 * o, 100 * i, 100 * u]
        );
      }),
      (r.rgb.hwb = function (e) {
        var t = e[0],
          n = e[1],
          o = e[2];
        return [
          r.rgb.hsl(e)[0],
          100 * ((1 / 255) * Math.min(t, Math.min(n, o))),
          100 * (o = 1 - (1 / 255) * Math.max(t, Math.max(n, o)))
        ];
      }),
      (r.rgb.cmyk = function (e) {
        var t,
          n = e[0] / 255,
          r = e[1] / 255,
          o = e[2] / 255;
        return [
          100 * ((1 - n - (t = Math.min(1 - n, 1 - r, 1 - o))) / (1 - t) || 0),
          100 * ((1 - r - t) / (1 - t) || 0),
          100 * ((1 - o - t) / (1 - t) || 0),
          100 * t
        ];
      }),
      (r.rgb.keyword = function (e) {
        var n = t[e];
        if (n) return n;
        var r,
          o,
          i,
          s = 1 / 0;
        for (var a in ri)
          if (ri.hasOwnProperty(a)) {
            var c = ri[a],
              u = ((o = e), (i = c), Math.pow(o[0] - i[0], 2) + Math.pow(o[1] - i[1], 2) + Math.pow(o[2] - i[2], 2));
            u < s && ((s = u), (r = a));
          }
        return r;
      }),
      (r.keyword.rgb = function (e) {
        return ri[e];
      }),
      (r.rgb.xyz = function (e) {
        var t = e[0] / 255,
          n = e[1] / 255,
          r = e[2] / 255;
        return [
          100 *
            (0.4124 * (t = t > 0.04045 ? Math.pow((t + 0.055) / 1.055, 2.4) : t / 12.92) +
              0.3576 * (n = n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) +
              0.1805 * (r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92)),
          100 * (0.2126 * t + 0.7152 * n + 0.0722 * r),
          100 * (0.0193 * t + 0.1192 * n + 0.9505 * r)
        ];
      }),
      (r.rgb.lab = function (e) {
        var t = r.rgb.xyz(e),
          n = t[0],
          o = t[1],
          i = t[2];
        return (
          (o /= 100),
          (i /= 108.883),
          (n = (n /= 95.047) > 0.008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116),
          [
            116 * (o = o > 0.008856 ? Math.pow(o, 1 / 3) : 7.787 * o + 16 / 116) - 16,
            500 * (n - o),
            200 * (o - (i = i > 0.008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116))
          ]
        );
      }),
      (r.hsl.rgb = function (e) {
        var t,
          n,
          r,
          o,
          i,
          s = e[0] / 360,
          a = e[1] / 100,
          c = e[2] / 100;
        if (0 === a) return [(i = 255 * c), i, i];
        (t = 2 * c - (n = c < 0.5 ? c * (1 + a) : c + a - c * a)), (o = [0, 0, 0]);
        for (var u = 0; u < 3; u++)
          (r = s + (1 / 3) * -(u - 1)) < 0 && r++,
            r > 1 && r--,
            (i = 6 * r < 1 ? t + 6 * (n - t) * r : 2 * r < 1 ? n : 3 * r < 2 ? t + (n - t) * (2 / 3 - r) * 6 : t),
            (o[u] = 255 * i);
        return o;
      }),
      (r.hsl.hsv = function (e) {
        var t = e[0],
          n = e[1] / 100,
          r = e[2] / 100,
          o = n,
          i = Math.max(r, 0.01);
        return (
          (n *= (r *= 2) <= 1 ? r : 2 - r),
          (o *= i <= 1 ? i : 2 - i),
          [t, 100 * (0 === r ? (2 * o) / (i + o) : (2 * n) / (r + n)), 100 * ((r + n) / 2)]
        );
      }),
      (r.hsv.rgb = function (e) {
        var t = e[0] / 60,
          n = e[1] / 100,
          r = e[2] / 100,
          o = Math.floor(t) % 6,
          i = t - Math.floor(t),
          s = 255 * r * (1 - n),
          a = 255 * r * (1 - n * i),
          c = 255 * r * (1 - n * (1 - i));
        switch (((r *= 255), o)) {
          case 0:
            return [r, c, s];
          case 1:
            return [a, r, s];
          case 2:
            return [s, r, c];
          case 3:
            return [s, a, r];
          case 4:
            return [c, s, r];
          case 5:
            return [r, s, a];
        }
      }),
      (r.hsv.hsl = function (e) {
        var t,
          n,
          r,
          o = e[0],
          i = e[1] / 100,
          s = e[2] / 100,
          a = Math.max(s, 0.01);
        return (
          (r = (2 - i) * s),
          (n = i * a),
          [o, 100 * (n = (n /= (t = (2 - i) * a) <= 1 ? t : 2 - t) || 0), 100 * (r /= 2)]
        );
      }),
      (r.hwb.rgb = function (e) {
        var t,
          n,
          r,
          o,
          i,
          s,
          a,
          c = e[0] / 360,
          u = e[1] / 100,
          l = e[2] / 100,
          h = u + l;
        switch (
          (h > 1 && ((u /= h), (l /= h)),
          (r = 6 * c - (t = Math.floor(6 * c))),
          0 != (1 & t) && (r = 1 - r),
          (o = u + r * ((n = 1 - l) - u)),
          t)
        ) {
          default:
          case 6:
          case 0:
            (i = n), (s = o), (a = u);
            break;
          case 1:
            (i = o), (s = n), (a = u);
            break;
          case 2:
            (i = u), (s = n), (a = o);
            break;
          case 3:
            (i = u), (s = o), (a = n);
            break;
          case 4:
            (i = o), (s = u), (a = n);
            break;
          case 5:
            (i = n), (s = u), (a = o);
        }
        return [255 * i, 255 * s, 255 * a];
      }),
      (r.cmyk.rgb = function (e) {
        var t = e[0] / 100,
          n = e[1] / 100,
          r = e[2] / 100,
          o = e[3] / 100;
        return [
          255 * (1 - Math.min(1, t * (1 - o) + o)),
          255 * (1 - Math.min(1, n * (1 - o) + o)),
          255 * (1 - Math.min(1, r * (1 - o) + o))
        ];
      }),
      (r.xyz.rgb = function (e) {
        var t,
          n,
          r,
          o = e[0] / 100,
          i = e[1] / 100,
          s = e[2] / 100;
        return (
          (n = -0.9689 * o + 1.8758 * i + 0.0415 * s),
          (r = 0.0557 * o + -0.204 * i + 1.057 * s),
          (t =
            (t = 3.2406 * o + -1.5372 * i + -0.4986 * s) > 0.0031308
              ? 1.055 * Math.pow(t, 1 / 2.4) - 0.055
              : 12.92 * t),
          (n = n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n),
          (r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r),
          [
            255 * (t = Math.min(Math.max(0, t), 1)),
            255 * (n = Math.min(Math.max(0, n), 1)),
            255 * (r = Math.min(Math.max(0, r), 1))
          ]
        );
      }),
      (r.xyz.lab = function (e) {
        var t = e[0],
          n = e[1],
          r = e[2];
        return (
          (n /= 100),
          (r /= 108.883),
          (t = (t /= 95.047) > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116),
          [
            116 * (n = n > 0.008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116) - 16,
            500 * (t - n),
            200 * (n - (r = r > 0.008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116))
          ]
        );
      }),
      (r.lab.xyz = function (e) {
        var t,
          n,
          r,
          o = e[0];
        (t = e[1] / 500 + (n = (o + 16) / 116)), (r = n - e[2] / 200);
        var i = Math.pow(n, 3),
          s = Math.pow(t, 3),
          a = Math.pow(r, 3);
        return (
          (n = i > 0.008856 ? i : (n - 16 / 116) / 7.787),
          (t = s > 0.008856 ? s : (t - 16 / 116) / 7.787),
          (r = a > 0.008856 ? a : (r - 16 / 116) / 7.787),
          [(t *= 95.047), (n *= 100), (r *= 108.883)]
        );
      }),
      (r.lab.lch = function (e) {
        var t,
          n = e[0],
          r = e[1],
          o = e[2];
        return (t = (360 * Math.atan2(o, r)) / 2 / Math.PI) < 0 && (t += 360), [n, Math.sqrt(r * r + o * o), t];
      }),
      (r.lch.lab = function (e) {
        var t,
          n = e[0],
          r = e[1];
        return (t = (e[2] / 360) * 2 * Math.PI), [n, r * Math.cos(t), r * Math.sin(t)];
      }),
      (r.rgb.ansi16 = function (e) {
        var t = e[0],
          n = e[1],
          o = e[2],
          i = 1 in arguments ? arguments[1] : r.rgb.hsv(e)[2];
        if (0 === (i = Math.round(i / 50))) return 30;
        var s = 30 + ((Math.round(o / 255) << 2) | (Math.round(n / 255) << 1) | Math.round(t / 255));
        return 2 === i && (s += 60), s;
      }),
      (r.hsv.ansi16 = function (e) {
        return r.rgb.ansi16(r.hsv.rgb(e), e[2]);
      }),
      (r.rgb.ansi256 = function (e) {
        var t = e[0],
          n = e[1],
          r = e[2];
        return t === n && n === r
          ? t < 8
            ? 16
            : t > 248
            ? 231
            : Math.round(((t - 8) / 247) * 24) + 232
          : 16 + 36 * Math.round((t / 255) * 5) + 6 * Math.round((n / 255) * 5) + Math.round((r / 255) * 5);
      }),
      (r.ansi16.rgb = function (e) {
        var t = e % 10;
        if (0 === t || 7 === t) return e > 50 && (t += 3.5), [(t = (t / 10.5) * 255), t, t];
        var n = 0.5 * (1 + ~~(e > 50));
        return [(1 & t) * n * 255, ((t >> 1) & 1) * n * 255, ((t >> 2) & 1) * n * 255];
      }),
      (r.ansi256.rgb = function (e) {
        if (e >= 232) {
          var t = 10 * (e - 232) + 8;
          return [t, t, t];
        }
        var n;
        return (
          (e -= 16), [(Math.floor(e / 36) / 5) * 255, (Math.floor((n = e % 36) / 6) / 5) * 255, ((n % 6) / 5) * 255]
        );
      }),
      (r.rgb.hex = function (e) {
        var t = (((255 & Math.round(e[0])) << 16) + ((255 & Math.round(e[1])) << 8) + (255 & Math.round(e[2])))
          .toString(16)
          .toUpperCase();
        return '000000'.substring(t.length) + t;
      }),
      (r.hex.rgb = function (e) {
        var t = e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!t) return [0, 0, 0];
        var n = t[0];
        3 === t[0].length &&
          (n = n
            .split('')
            .map(function (e) {
              return e + e;
            })
            .join(''));
        var r = parseInt(n, 16);
        return [(r >> 16) & 255, (r >> 8) & 255, 255 & r];
      }),
      (r.rgb.hcg = function (e) {
        var t,
          n = e[0] / 255,
          r = e[1] / 255,
          o = e[2] / 255,
          i = Math.max(Math.max(n, r), o),
          s = Math.min(Math.min(n, r), o),
          a = i - s;
        return (
          (t = a <= 0 ? 0 : i === n ? ((r - o) / a) % 6 : i === r ? 2 + (o - n) / a : 4 + (n - r) / a + 4),
          (t /= 6),
          [360 * (t %= 1), 100 * a, 100 * (a < 1 ? s / (1 - a) : 0)]
        );
      }),
      (r.hsl.hcg = function (e) {
        var t = e[1] / 100,
          n = e[2] / 100,
          r = 1,
          o = 0;
        return (
          (r = n < 0.5 ? 2 * t * n : 2 * t * (1 - n)) < 1 && (o = (n - 0.5 * r) / (1 - r)), [e[0], 100 * r, 100 * o]
        );
      }),
      (r.hsv.hcg = function (e) {
        var t = e[1] / 100,
          n = e[2] / 100,
          r = t * n,
          o = 0;
        return r < 1 && (o = (n - r) / (1 - r)), [e[0], 100 * r, 100 * o];
      }),
      (r.hcg.rgb = function (e) {
        var t = e[0] / 360,
          n = e[1] / 100,
          r = e[2] / 100;
        if (0 === n) return [255 * r, 255 * r, 255 * r];
        var o,
          i = [0, 0, 0],
          s = (t % 1) * 6,
          a = s % 1,
          c = 1 - a;
        switch (Math.floor(s)) {
          case 0:
            (i[0] = 1), (i[1] = a), (i[2] = 0);
            break;
          case 1:
            (i[0] = c), (i[1] = 1), (i[2] = 0);
            break;
          case 2:
            (i[0] = 0), (i[1] = 1), (i[2] = a);
            break;
          case 3:
            (i[0] = 0), (i[1] = c), (i[2] = 1);
            break;
          case 4:
            (i[0] = a), (i[1] = 0), (i[2] = 1);
            break;
          default:
            (i[0] = 1), (i[1] = 0), (i[2] = c);
        }
        return (o = (1 - n) * r), [255 * (n * i[0] + o), 255 * (n * i[1] + o), 255 * (n * i[2] + o)];
      }),
      (r.hcg.hsv = function (e) {
        var t = e[1] / 100,
          n = t + (e[2] / 100) * (1 - t),
          r = 0;
        return n > 0 && (r = t / n), [e[0], 100 * r, 100 * n];
      }),
      (r.hcg.hsl = function (e) {
        var t = e[1] / 100,
          n = (e[2] / 100) * (1 - t) + 0.5 * t,
          r = 0;
        return (
          n > 0 && n < 0.5 ? (r = t / (2 * n)) : n >= 0.5 && n < 1 && (r = t / (2 * (1 - n))), [e[0], 100 * r, 100 * n]
        );
      }),
      (r.hcg.hwb = function (e) {
        var t = e[1] / 100,
          n = t + (e[2] / 100) * (1 - t);
        return [e[0], 100 * (n - t), 100 * (1 - n)];
      }),
      (r.hwb.hcg = function (e) {
        var t = e[1] / 100,
          n = 1 - e[2] / 100,
          r = n - t,
          o = 0;
        return r < 1 && (o = (n - r) / (1 - r)), [e[0], 100 * r, 100 * o];
      }),
      (r.apple.rgb = function (e) {
        return [(e[0] / 65535) * 255, (e[1] / 65535) * 255, (e[2] / 65535) * 255];
      }),
      (r.rgb.apple = function (e) {
        return [(e[0] / 255) * 65535, (e[1] / 255) * 65535, (e[2] / 255) * 65535];
      }),
      (r.gray.rgb = function (e) {
        return [(e[0] / 100) * 255, (e[0] / 100) * 255, (e[0] / 100) * 255];
      }),
      (r.gray.hsl = r.gray.hsv = function (e) {
        return [0, 0, e[0]];
      }),
      (r.gray.hwb = function (e) {
        return [0, 100, e[0]];
      }),
      (r.gray.cmyk = function (e) {
        return [0, 0, 0, e[0]];
      }),
      (r.gray.lab = function (e) {
        return [e[0], 0, 0];
      }),
      (r.gray.hex = function (e) {
        var t = 255 & Math.round((e[0] / 100) * 255),
          n = ((t << 16) + (t << 8) + t).toString(16).toUpperCase();
        return '000000'.substring(n.length) + n;
      }),
      (r.rgb.gray = function (e) {
        return [((e[0] + e[1] + e[2]) / 3 / 255) * 100];
      });
  });
function ii(e) {
  var t = (function () {
      for (var e = {}, t = Object.keys(oi), n = t.length, r = 0; r < n; r++) e[t[r]] = { distance: -1, parent: null };
      return e;
    })(),
    n = [e];
  for (t[e].distance = 0; n.length; )
    for (var r = n.pop(), o = Object.keys(oi[r]), i = o.length, s = 0; s < i; s++) {
      var a = o[s],
        c = t[a];
      -1 === c.distance && ((c.distance = t[r].distance + 1), (c.parent = r), n.unshift(a));
    }
  return t;
}
function si(e, t) {
  return function (n) {
    return t(e(n));
  };
}
function ai(e, t) {
  for (var n = [t[e].parent, e], r = oi[t[e].parent][e], o = t[e].parent; t[o].parent; )
    n.unshift(t[o].parent), (r = si(oi[t[o].parent][o], r)), (o = t[o].parent);
  return (r.conversion = n), r;
}
var ci = {};
Object.keys(oi).forEach(function (e) {
  (ci[e] = {}),
    Object.defineProperty(ci[e], 'channels', { value: oi[e].channels }),
    Object.defineProperty(ci[e], 'labels', { value: oi[e].labels });
  var t = (function (e) {
    for (var t = ii(e), n = {}, r = Object.keys(t), o = r.length, i = 0; i < o; i++) {
      var s = r[i];
      null !== t[s].parent && (n[s] = ai(s, t));
    }
    return n;
  })(e);
  Object.keys(t).forEach(function (n) {
    var r = t[n];
    (ci[e][n] = (function (e) {
      var t = function (t) {
        if (null == t) return t;
        arguments.length > 1 && (t = Array.prototype.slice.call(arguments));
        var n = e(t);
        if ('object' == typeof n) for (var r = n.length, o = 0; o < r; o++) n[o] = Math.round(n[o]);
        return n;
      };
      return 'conversion' in e && (t.conversion = e.conversion), t;
    })(r)),
      (ci[e][n].raw = (function (e) {
        var t = function (t) {
          return null == t ? t : (arguments.length > 1 && (t = Array.prototype.slice.call(arguments)), e(t));
        };
        return 'conversion' in e && (t.conversion = e.conversion), t;
      })(r));
  });
});
var ui = ci,
  li = P(function (e) {
    const t = (e, t) =>
        function () {
          const n = e.apply(ui, arguments);
          return `[${n + t}m`;
        },
      n = (e, t) =>
        function () {
          const n = e.apply(ui, arguments);
          return `[${38 + t};5;${n}m`;
        },
      r = (e, t) =>
        function () {
          const n = e.apply(ui, arguments);
          return `[${38 + t};2;${n[0]};${n[1]};${n[2]}m`;
        };
    Object.defineProperty(e, 'exports', {
      enumerable: !0,
      get: function () {
        const e = new Map(),
          o = {
            modifier: {
              reset: [0, 0],
              bold: [1, 22],
              dim: [2, 22],
              italic: [3, 23],
              underline: [4, 24],
              inverse: [7, 27],
              hidden: [8, 28],
              strikethrough: [9, 29]
            },
            color: {
              black: [30, 39],
              red: [31, 39],
              green: [32, 39],
              yellow: [33, 39],
              blue: [34, 39],
              magenta: [35, 39],
              cyan: [36, 39],
              white: [37, 39],
              gray: [90, 39],
              redBright: [91, 39],
              greenBright: [92, 39],
              yellowBright: [93, 39],
              blueBright: [94, 39],
              magentaBright: [95, 39],
              cyanBright: [96, 39],
              whiteBright: [97, 39]
            },
            bgColor: {
              bgBlack: [40, 49],
              bgRed: [41, 49],
              bgGreen: [42, 49],
              bgYellow: [43, 49],
              bgBlue: [44, 49],
              bgMagenta: [45, 49],
              bgCyan: [46, 49],
              bgWhite: [47, 49],
              bgBlackBright: [100, 49],
              bgRedBright: [101, 49],
              bgGreenBright: [102, 49],
              bgYellowBright: [103, 49],
              bgBlueBright: [104, 49],
              bgMagentaBright: [105, 49],
              bgCyanBright: [106, 49],
              bgWhiteBright: [107, 49]
            }
          };
        o.color.grey = o.color.gray;
        for (const t of Object.keys(o)) {
          const n = o[t];
          for (const t of Object.keys(n)) {
            const r = n[t];
            (o[t] = { open: `[${r[0]}m`, close: `[${r[1]}m` }), (n[t] = o[t]), e.set(r[0], r[1]);
          }
          Object.defineProperty(o, t, { value: n, enumerable: !1 }),
            Object.defineProperty(o, 'codes', { value: e, enumerable: !1 });
        }
        const i = e => e,
          s = (e, t, n) => [e, t, n];
        (o.color.close = '[39m'),
          (o.bgColor.close = '[49m'),
          (o.color.ansi = { ansi: t(i, 0) }),
          (o.color.ansi256 = { ansi256: n(i, 0) }),
          (o.color.ansi16m = { rgb: r(s, 0) }),
          (o.bgColor.ansi = { ansi: t(i, 10) }),
          (o.bgColor.ansi256 = { ansi256: n(i, 10) }),
          (o.bgColor.ansi16m = { rgb: r(s, 10) });
        for (let e of Object.keys(ui)) {
          if ('object' != typeof ui[e]) continue;
          const i = ui[e];
          'ansi16' === e && (e = 'ansi'),
            'ansi16' in i && ((o.color.ansi[e] = t(i.ansi16, 0)), (o.bgColor.ansi[e] = t(i.ansi16, 10))),
            'ansi256' in i && ((o.color.ansi256[e] = n(i.ansi256, 0)), (o.bgColor.ansi256[e] = n(i.ansi256, 10))),
            'rgb' in i && ((o.color.ansi16m[e] = r(i.rgb, 0)), (o.bgColor.ansi16m[e] = r(i.rgb, 10)));
        }
        return o;
      }
    });
  }),
  hi = (e, t) => {
    t = t || process.argv;
    const n = e.startsWith('-') ? '' : 1 === e.length ? '-' : '--',
      r = t.indexOf(n + e),
      o = t.indexOf('--');
    return -1 !== r && (-1 === o || r < o);
  };
const di = process.env;
let fi;
function pi(e) {
  return (function (e) {
    return 0 !== e && { level: e, hasBasic: !0, has256: e >= 2, has16m: e >= 3 };
  })(
    (function (e) {
      if (!1 === fi) return 0;
      if (hi('color=16m') || hi('color=full') || hi('color=truecolor')) return 3;
      if (hi('color=256')) return 2;
      if (e && !e.isTTY && !0 !== fi) return 0;
      const t = fi ? 1 : 0;
      if ('win32' === process.platform) {
        const e = b.default.release().split('.');
        return Number(process.versions.node.split('.')[0]) >= 8 && Number(e[0]) >= 10 && Number(e[2]) >= 10586
          ? Number(e[2]) >= 14931
            ? 3
            : 2
          : 1;
      }
      if ('CI' in di)
        return ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(e => e in di) || 'codeship' === di.CI_NAME ? 1 : t;
      if ('TEAMCITY_VERSION' in di) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(di.TEAMCITY_VERSION) ? 1 : 0;
      if ('truecolor' === di.COLORTERM) return 3;
      if ('TERM_PROGRAM' in di) {
        const e = parseInt((di.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
        switch (di.TERM_PROGRAM) {
          case 'iTerm.app':
            return e >= 3 ? 3 : 2;
          case 'Apple_Terminal':
            return 2;
        }
      }
      return /-256(color)?$/i.test(di.TERM)
        ? 2
        : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(di.TERM) || 'COLORTERM' in di
        ? 1
        : (di.TERM, t);
    })(e)
  );
}
hi('no-color') || hi('no-colors') || hi('color=false')
  ? (fi = !1)
  : (hi('color') || hi('colors') || hi('color=true') || hi('color=always')) && (fi = !0),
  'FORCE_COLOR' in di && (fi = 0 === di.FORCE_COLOR.length || 0 !== parseInt(di.FORCE_COLOR, 10));
var gi = { supportsColor: pi, stdout: pi(process.stdout), stderr: pi(process.stderr) };
const mi = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
  yi = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
  vi = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
  bi = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi,
  _i = new Map([
    ['n', '\n'],
    ['r', '\r'],
    ['t', '\t'],
    ['b', '\b'],
    ['f', '\f'],
    ['v', '\v'],
    ['0', '\0'],
    ['\\', '\\'],
    ['e', ''],
    ['a', '']
  ]);
function wi(e) {
  return ('u' === e[0] && 5 === e.length) || ('x' === e[0] && 3 === e.length)
    ? String.fromCharCode(parseInt(e.slice(1), 16))
    : _i.get(e) || e;
}
function Ri(e, t) {
  const n = [],
    r = t.trim().split(/\s*,\s*/g);
  let o;
  for (const t of r)
    if (isNaN(t)) {
      if (!(o = t.match(vi))) throw new Error(`Invalid Chalk template style argument: ${t} (in style '${e}')`);
      n.push(o[2].replace(bi, (e, t, n) => (t ? wi(t) : n)));
    } else n.push(Number(t));
  return n;
}
function ki(e) {
  yi.lastIndex = 0;
  const t = [];
  let n;
  for (; null !== (n = yi.exec(e)); ) {
    const e = n[1];
    if (n[2]) {
      const r = Ri(e, n[2]);
      t.push([e].concat(r));
    } else t.push([e]);
  }
  return t;
}
function Ci(e, t) {
  const n = {};
  for (const e of t) for (const t of e.styles) n[t[0]] = e.inverse ? null : t.slice(1);
  let r = e;
  for (const e of Object.keys(n))
    if (Array.isArray(n[e])) {
      if (!(e in r)) throw new Error('Unknown Chalk style: ' + e);
      r = n[e].length > 0 ? r[e].apply(r, n[e]) : r[e];
    }
  return r;
}
var Oi,
  Ti = (e, t) => {
    const n = [],
      r = [];
    let o = [];
    if (
      (t.replace(mi, (t, i, s, a, c, u) => {
        if (i) o.push(wi(i));
        else if (a) {
          const t = o.join('');
          (o = []), r.push(0 === n.length ? t : Ci(e, n)(t)), n.push({ inverse: s, styles: ki(a) });
        } else if (c) {
          if (0 === n.length) throw new Error('Found extraneous } in Chalk template literal');
          r.push(Ci(e, n)(o.join(''))), (o = []), n.pop();
        } else o.push(u);
      }),
      r.push(o.join('')),
      n.length > 0)
    ) {
      const e = `Chalk template literal is missing ${n.length} closing bracket${1 === n.length ? '' : 's'} (\`}\`)`;
      throw new Error(e);
    }
    return r.join('');
  },
  Pi = P(function (e) {
    const t = gi.stdout,
      n = 'win32' === process.platform && !(process.env.TERM || '').toLowerCase().startsWith('xterm'),
      r = ['ansi', 'ansi', 'ansi256', 'ansi16m'],
      o = new Set(['gray']),
      i = Object.create(null);
    function s(e, n) {
      n = n || {};
      const r = t ? t.level : 0;
      (e.level = void 0 === n.level ? r : n.level), (e.enabled = 'enabled' in n ? n.enabled : e.level > 0);
    }
    function a(e) {
      if (!this || !(this instanceof a) || this.template) {
        const t = {};
        return (
          s(t, e),
          (t.template = function () {
            const e = [].slice.call(arguments);
            return h.apply(null, [t.template].concat(e));
          }),
          Object.setPrototypeOf(t, a.prototype),
          Object.setPrototypeOf(t.template, t),
          (t.template.constructor = a),
          t.template
        );
      }
      s(this, e);
    }
    n && (li.blue.open = '[94m');
    for (const e of Object.keys(li))
      (li[e].closeRe = new RegExp(ni(li[e].close), 'g')),
        (i[e] = {
          get() {
            const t = li[e];
            return u.call(this, this._styles ? this._styles.concat(t) : [t], this._empty, e);
          }
        });
    (i.visible = {
      get() {
        return u.call(this, this._styles || [], !0, 'visible');
      }
    }),
      (li.color.closeRe = new RegExp(ni(li.color.close), 'g'));
    for (const e of Object.keys(li.color.ansi))
      o.has(e) ||
        (i[e] = {
          get() {
            const t = this.level;
            return function () {
              const n = li.color[r[t]][e].apply(null, arguments),
                o = { open: n, close: li.color.close, closeRe: li.color.closeRe };
              return u.call(this, this._styles ? this._styles.concat(o) : [o], this._empty, e);
            };
          }
        });
    li.bgColor.closeRe = new RegExp(ni(li.bgColor.close), 'g');
    for (const e of Object.keys(li.bgColor.ansi)) {
      if (o.has(e)) continue;
      i['bg' + e[0].toUpperCase() + e.slice(1)] = {
        get() {
          const t = this.level;
          return function () {
            const n = li.bgColor[r[t]][e].apply(null, arguments),
              o = { open: n, close: li.bgColor.close, closeRe: li.bgColor.closeRe };
            return u.call(this, this._styles ? this._styles.concat(o) : [o], this._empty, e);
          };
        }
      };
    }
    const c = Object.defineProperties(() => {}, i);
    function u(e, t, n) {
      const r = function () {
        return l.apply(r, arguments);
      };
      (r._styles = e), (r._empty = t);
      const o = this;
      return (
        Object.defineProperty(r, 'level', {
          enumerable: !0,
          get: () => o.level,
          set(e) {
            o.level = e;
          }
        }),
        Object.defineProperty(r, 'enabled', {
          enumerable: !0,
          get: () => o.enabled,
          set(e) {
            o.enabled = e;
          }
        }),
        (r.hasGrey = this.hasGrey || 'gray' === n || 'grey' === n),
        (r.__proto__ = c),
        r
      );
    }
    function l() {
      const e = arguments,
        t = e.length;
      let r = String(arguments[0]);
      if (0 === t) return '';
      if (t > 1) for (let n = 1; n < t; n++) r += ' ' + e[n];
      if (!this.enabled || this.level <= 0 || !r) return this._empty ? '' : r;
      const o = li.dim.open;
      n && this.hasGrey && (li.dim.open = '');
      for (const e of this._styles.slice().reverse())
        (r = e.open + r.replace(e.closeRe, e.open) + e.close), (r = r.replace(/\r?\n/g, `${e.close}$&${e.open}`));
      return (li.dim.open = o), r;
    }
    function h(e, t) {
      if (!Array.isArray(t)) return [].slice.call(arguments, 1).join(' ');
      const n = [].slice.call(arguments, 2),
        r = [t.raw[0]];
      for (let e = 1; e < t.length; e++) r.push(String(n[e - 1]).replace(/[{}\\]/g, '\\$&')), r.push(String(t.raw[e]));
      return Ti(e, r.join(''));
    }
    Object.defineProperties(a.prototype, i),
      (e.exports = a()),
      (e.exports.supportsColor = t),
      (e.exports.default = e.exports);
  }),
  xi = Ii,
  Si = Li,
  Ei = function (e, t = {}) {
    if (Ii(t)) {
      const n = Li(t);
      return (function (e, t) {
        let n = '';
        for (const { type: r, value: o } of Fi(t)) {
          const t = e[r];
          n += t
            ? o
                .split(Ni)
                .map(e => t(e))
                .join('\n')
            : o;
        }
        return n;
      })(
        (function (e) {
          return {
            keyword: e.cyan,
            capitalized: e.yellow,
            jsxIdentifier: e.yellow,
            punctuator: e.yellow,
            number: e.magenta,
            string: e.green,
            regex: e.magenta,
            comment: e.grey,
            invalid: e.white.bgRed.bold
          };
        })(n),
        e
      );
    }
    return e;
  },
  qi = (function (e) {
    if (e && e.__esModule) return e;
    if (null === e || ('object' != typeof e && 'function' != typeof e)) return { default: e };
    var t = Mi();
    if (t && t.has(e)) return t.get(e);
    var n = {},
      r = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var o in e)
      if (Object.prototype.hasOwnProperty.call(e, o)) {
        var i = r ? Object.getOwnPropertyDescriptor(e, o) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, o, i) : (n[o] = e[o]);
      }
    (n.default = e), t && t.set(e, n);
    return n;
  })(To),
  Di = (Oi = Pi) && Oi.__esModule ? Oi : { default: Oi };
function Mi() {
  if ('function' != typeof WeakMap) return null;
  var e = new WeakMap();
  return (
    (Mi = function () {
      return e;
    }),
    e
  );
}
const ji = new Set(['as', 'async', 'from', 'get', 'of', 'set']);
const Ni = /\r\n|[\n\r\u2028\u2029]/,
  Ai = /^[()[\]{}]$/;
let Fi;
{
  const { matchToToken: e } = qi,
    t = /^[a-z][\w-]*$/i,
    n = function (e, n, r) {
      if ('name' === e.type) {
        if ((0, ei.isKeyword)(e.value) || (0, ei.isStrictReservedWord)(e.value, !0) || ji.has(e.value))
          return 'keyword';
        if (t.test(e.value) && ('<' === r[n - 1] || '</' == r.substr(n - 2, 2))) return 'jsxIdentifier';
        if (e.value[0] !== e.value[0].toLowerCase()) return 'capitalized';
      }
      return 'punctuator' === e.type && Ai.test(e.value)
        ? 'bracket'
        : 'invalid' !== e.type || ('@' !== e.value && '#' !== e.value)
        ? e.type
        : 'punctuator';
    };
  Fi = function* (t) {
    let r;
    for (; (r = qi.default.exec(t)); ) {
      const o = e(r);
      yield { type: n(o, r.index, t), value: o.value };
    }
  };
}
function Ii(e) {
  return Di.default.supportsColor || e.forceColor;
}
function Li(e) {
  let t = Di.default;
  return e.forceColor && (t = new Di.default.constructor({ enabled: !0, level: 1 })), t;
}
var Wi = function (e, t, n = {}) {
    const r = (n.highlightCode || n.forceColor) && (0, $i.shouldHighlight)(n),
      o = (0, $i.getChalk)(n),
      i = (function (e) {
        return { gutter: e.grey, marker: e.red.bold, message: e.red.bold };
      })(o),
      s = (e, t) => (r ? e(t) : t),
      a = e.split(Bi),
      { start: c, end: u, markerLines: l } = (function (e, t, n) {
        const r = Object.assign({ column: 0, line: -1 }, e.start),
          o = Object.assign({}, r, e.end),
          { linesAbove: i = 2, linesBelow: s = 3 } = n || {},
          a = r.line,
          c = r.column,
          u = o.line,
          l = o.column;
        let h = Math.max(a - (i + 1), 0),
          d = Math.min(t.length, u + s);
        -1 === a && (h = 0);
        -1 === u && (d = t.length);
        const f = u - a,
          p = {};
        if (f)
          for (let e = 0; e <= f; e++) {
            const n = e + a;
            if (c)
              if (0 === e) {
                const e = t[n - 1].length;
                p[n] = [c, e - c + 1];
              } else if (e === f) p[n] = [0, l];
              else {
                const r = t[n - e].length;
                p[n] = [0, r];
              }
            else p[n] = !0;
          }
        else p[a] = c === l ? !c || [c, 0] : [c, l - c];
        return { start: h, end: d, markerLines: p };
      })(t, a, n),
      h = t.start && 'number' == typeof t.start.column,
      d = String(u).length;
    let f = (r ? (0, $i.default)(e, n) : e)
      .split(Bi)
      .slice(c, u)
      .map((e, t) => {
        const r = c + 1 + t,
          o = ` ${(' ' + r).slice(-d)} |`,
          a = l[r],
          u = !l[r + 1];
        if (a) {
          let t = '';
          if (Array.isArray(a)) {
            const r = e.slice(0, Math.max(a[0] - 1, 0)).replace(/[^\t]/g, ' '),
              c = a[1] || 1;
            (t = ['\n ', s(i.gutter, o.replace(/\d/g, ' ')), ' ', r, s(i.marker, '^').repeat(c)].join('')),
              u && n.message && (t += ' ' + s(i.message, n.message));
          }
          return [s(i.marker, '>'), s(i.gutter, o), e.length > 0 ? ' ' + e : '', t].join('');
        }
        return ` ${s(i.gutter, o)}${e.length > 0 ? ' ' + e : ''}`;
      })
      .join('\n');
    n.message && !h && (f = `${' '.repeat(d + 1)}${n.message}\n${f}`);
    return r ? o.reset(f) : f;
  },
  $i = (function (e) {
    if (e && e.__esModule) return e;
    if (null === e || ('object' != typeof e && 'function' != typeof e)) return { default: e };
    var t = Hi();
    if (t && t.has(e)) return t.get(e);
    var n = {},
      r = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var o in e)
      if (Object.prototype.hasOwnProperty.call(e, o)) {
        var i = r ? Object.getOwnPropertyDescriptor(e, o) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, o, i) : (n[o] = e[o]);
      }
    (n.default = e), t && t.set(e, n);
    return n;
  })(Object.defineProperty({ shouldHighlight: xi, getChalk: Si, default: Ei }, '__esModule', { value: !0 }));
function Hi() {
  if ('function' != typeof WeakMap) return null;
  var e = new WeakMap();
  return (
    (Hi = function () {
      return e;
    }),
    e
  );
}
const Bi = /\r\n|[\n\r\u2028\u2029]/;
const Ui = ['ERROR', 'WARN', 'INFO', 'HINT'],
  zi = {
    ERROR: Gt.DiagnosticSeverity.Error,
    WARN: Gt.DiagnosticSeverity.Warning,
    INFO: Gt.DiagnosticSeverity.Information,
    HINT: Gt.DiagnosticSeverity.Hint
  };
async function Vi(e, t) {
  let n;
  if ((console.log('===================================='), console.log('Getting Vetur diagnostics'), e)) {
    const t = m.default.resolve(process.cwd(), e);
    console.log('Loading Vetur in workspace path: ' + Oo.green(t)), (n = Kt.file(t));
  } else console.log('Loading Vetur in current directory: ' + Oo.green(process.cwd())), (n = Kt.file(process.cwd()));
  const r = await (async function (e, t) {
    const n = await (async function (e) {
        const t = new Ki(),
          n = new Ki(),
          r = new Gi(),
          o = Gt.createProtocolConnection(new Gt.StreamMessageReader(n), new Gt.StreamMessageWriter(t), r),
          i = Gt.createConnection(new Gt.StreamMessageReader(t), new Gt.StreamMessageWriter(n)),
          s = new l.VLS(i);
        i.onInitialize(
          async e => (
            await s.init(e),
            console.log('Vetur initialized'),
            console.log('===================================='),
            { capabilities: s.capabilities }
          )
        ),
          s.listen(),
          o.listen();
        const a = (function (e) {
          const t = {
            vetur: {
              useWorkspaceDependencies: !1,
              validation: { template: !0, templateProps: !1, interpolation: !0, style: !0, script: !0 },
              completion: {
                autoImport: !1,
                tagCasing: 'kebab',
                scaffoldSnippetSources: { workspace: '💼', user: '🗒️', vetur: '✌' }
              },
              grammar: { customBlocks: {} },
              format: {
                enable: !0,
                options: { tabSize: 2, useTabs: !1 },
                defaultFormatter: {},
                defaultFormatterOptions: {},
                scriptInitialIndent: !1,
                styleInitialIndent: !1
              },
              languageFeatures: { codeActions: !0 },
              trace: { server: 'off' },
              dev: { vlsPath: '', vlsPort: -1, logLevel: 'INFO' },
              experimental: { templateInterpolationService: !1 }
            },
            css: {},
            html: { suggest: {} },
            javascript: { format: {} },
            typescript: { tsdk: null, format: {} },
            emmet: {},
            stylusSupremacy: {}
          };
          return (
            (t.vetur.validation = { template: !1, style: !1, script: !1, interpolation: !0, templateProps: !0 }),
            (t.vetur.experimental = { templateInterpolationService: !0 }),
            {
              rootPath: e.fsPath,
              rootUri: e.toString(),
              processId: process.pid,
              capabilities: {},
              initializationOptions: { config: t }
            }
          );
        })(e);
        return await o.sendRequest(Gt.InitializeRequest.type, a), o;
      })(e),
      r = Cr.sync('**/*.vue', { cwd: e.fsPath, ignore: ['node_modules/**'] });
    if (0 === r.length) return console.log('No input files'), 0;
    console.log(''), console.log('Getting diagnostics from: ', r, '\n');
    const o = r.map(t => m.default.resolve(e.fsPath, t));
    let i = 0;
    for (const e of o) {
      const r = y.default.readFileSync(e, 'utf-8');
      await n.sendNotification(Gt.DidOpenTextDocumentNotification.type, {
        textDocument: { languageId: 'vue', uri: Kt.file(e).toString(), version: 1, text: r }
      });
      try {
        let o = await n.sendRequest('$/getDiagnostics', { uri: Kt.file(e).toString() });
        (o = o.filter(e => 'eslint-plugin-vue' !== e.source).filter(e => e.severity && e.severity <= t)),
          o.length > 0 &&
            (o.forEach(t => {
              const n = Ji(t.range);
              console.log(`${Oo.green('File')} : ${Oo.green(e)}:${n.start.line}:${n.start.column}`),
                t.severity === Gt.DiagnosticSeverity.Error
                  ? (console.log(`${Oo.red('Error')}: ${t.message.trim()}`), i++)
                  : console.log(`${Oo.yellow('Warn')} : ${t.message.trim()}`),
                console.log(Wi(r, n));
            }),
            console.log(''));
      } catch (e) {
        console.error(e.stack);
      }
    }
    return i;
  })(n, zi[t]);
  console.log('===================================='),
    0 === r
      ? (console.log(Oo.green('VTI found no error')), process.exit(0))
      : (console.log(Oo.red(`VTI found ${r} ${1 === r ? 'error' : 'errors'}`)), process.exit(1));
}
class Gi {
  error(e) {}
  warn(e) {}
  info(e) {}
  log(e) {}
}
class Ki extends u.Duplex {
  _write(e, t, n) {
    this.emit('data', e), n();
  }
  _read(e) {}
}
function Ji(e) {
  return {
    start: { line: e.start.line + 1, column: e.start.character + 1 },
    end: { line: e.end.line + 1, column: e.end.character + 1 }
  };
}
(async () => {
  const e = new x.Command();
  e
    .name('vti')
    .description('Vetur Terminal Interface')
    .version(
      (function () {
        const { version: e } = require('../package.json');
        return 'v' + e;
      })()
    ),
    e
      .command('diagnostics [workspace]')
      .description('Print all diagnostics')
      .addOption(new x.Option('-l, --log-level <logLevel>', 'Log level to print').default('WARN').choices(Ui))
      .action(async (e, t) => {
        const n = t.logLevel;
        if ('string' != typeof (r = n) || !Ui.includes(r)) throw new Error('Invalid log level: ' + n);
        var r;
        await Vi(e, n);
      }),
    e.parse(process.argv);
})().catch(e => {
  console.error('VTI operation failed with error'), console.error(e.stack), process.exit(1);
});
//# sourceMappingURL=cli.js.map
