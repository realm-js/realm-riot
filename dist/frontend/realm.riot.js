"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (___scope___) {
   "use strict";
   var $isBackend = ___scope___.isNode;var realm = ___scope___.realm;

   realm.module("realm.riot.AngularExpressionParser", [], function () {
      var $_exports;

      // We don't want to lint angular's code...
      /* eslint-disable */

      // Angular environment stuff
      // ------------------------------
      function noop() {}

      // Simplified extend() for our use-case
      function extend(dst, obj) {
         var key;

         for (key in obj) {
            if (obj.hasOwnProperty(key)) {
               dst[key] = obj[key];
            }
         }

         return dst;
      }

      function isDefined(value) {
         return typeof value !== 'undefined';
      }

      function valueFn(value) {
         return function () {
            return value;
         };
      }

      function $parseMinErr(module, message, arg1, arg2, arg3) {
         var args = arguments;

         message = message.replace(/{(\d)}/g, function (match) {
            return args[2 + parseInt(match[1])];
         });

         throw new SyntaxError(message);
      }

      function lowercase(string) {
         return typeof string === "string" ? string.toLowerCase() : string;
      }

      // Simplified forEach() for our use-case
      function forEach(arr, iterator) {
         arr.forEach(iterator);
      }

      // Sandboxing Angular Expressions
      // ------------------------------
      // Angular expressions are generally considered safe because these expressions only have direct
      // access to $scope and locals. However, one can obtain the ability to execute arbitrary JS code by
      // obtaining a reference to native JS functions such as the Function constructor.
      //
      // As an example, consider the following Angular expression:
      //
      //   {}.toString.constructor(alert("evil JS code"))
      //
      // We want to prevent this type of access. For the sake of performance, during the lexing phase we
      // disallow any "dotted" access to any member named "constructor".
      //
      // For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor
      // while evaluating the expression, which is a stronger but more expensive test. Since reflective
      // calls are expensive anyway, this is not such a big deal compared to static dereferencing.
      //
      // This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
      // against the expression language, but not to prevent exploits that were enabled by exposing
      // sensitive JavaScript or browser apis on Scope. Exposing such objects on a Scope is never a good
      // practice and therefore we are not even trying to protect against interaction with an object
      // explicitly exposed in this way.
      //
      // A developer could foil the name check by aliasing the Function constructor under a different
      // name on the scope.
      //
      // In general, it is not possible to access a Window object from an angular expression unless a
      // window or some DOM object that has a reference to window is published onto a Scope.

      function ensureSafeMemberName(name, fullExpression) {
         if (name === "constructor") {
            throw $parseMinErr('isecfld', 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
         }
         return name;
      }

      function ensureSafeObject(obj, fullExpression) {
         // nifty check if obj is Function that is fast and works across iframes and other contexts
         if (obj) {
            if (obj.constructor === obj) {
               throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
            } else if ( // isWindow(obj)
            obj.document && obj.location && obj.alert && obj.setInterval) {
               throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
            } else if ( // isElement(obj)
            obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) {
               throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
            }
         }
         return obj;
      }

      var OPERATORS = {
         /* jshint bitwise : false */
         'null': function _null() {
            return null;
         },
         'true': function _true() {
            return true;
         },
         'false': function _false() {
            return false;
         },
         undefined: noop,
         '+': function _(self, locals, a, b) {
            a = a(self, locals);
            b = b(self, locals);
            if (isDefined(a)) {
               if (isDefined(b)) {
                  return a + b;
               }
               return a;
            }
            return isDefined(b) ? b : undefined;
         },
         '-': function _(self, locals, a, b) {
            a = a(self, locals);
            b = b(self, locals);
            return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
         },
         '*': function _(self, locals, a, b) {
            return a(self, locals) * b(self, locals);
         },
         '/': function _(self, locals, a, b) {
            return a(self, locals) / b(self, locals);
         },
         '%': function _(self, locals, a, b) {
            return a(self, locals) % b(self, locals);
         },
         '^': function _(self, locals, a, b) {
            return a(self, locals) ^ b(self, locals);
         },
         '=': noop,
         '===': function _(self, locals, a, b) {
            return a(self, locals) === b(self, locals);
         },
         '!==': function _(self, locals, a, b) {
            return a(self, locals) !== b(self, locals);
         },
         '==': function _(self, locals, a, b) {
            return a(self, locals) == b(self, locals);
         },
         '!=': function _(self, locals, a, b) {
            return a(self, locals) != b(self, locals);
         },
         '<': function _(self, locals, a, b) {
            return a(self, locals) < b(self, locals);
         },
         '>': function _(self, locals, a, b) {
            return a(self, locals) > b(self, locals);
         },
         '<=': function _(self, locals, a, b) {
            return a(self, locals) <= b(self, locals);
         },
         '>=': function _(self, locals, a, b) {
            return a(self, locals) >= b(self, locals);
         },
         '&&': function _(self, locals, a, b) {
            return a(self, locals) && b(self, locals);
         },
         '||': function _(self, locals, a, b) {
            return a(self, locals) || b(self, locals);
         },
         '&': function _(self, locals, a, b) {
            return a(self, locals) & b(self, locals);
         },
         //    '|':function(self, locals, a,b){return a|b;},
         '|': function _(self, locals, a, b) {
            return b(self, locals)(self, locals, a(self, locals));
         },
         '!': function _(self, locals, a) {
            return !a(self, locals);
         }
      };
      /* jshint bitwise: true */
      var ESCAPE = {
         "n": "\n",
         "f": "\f",
         "r": "\r",
         "t": "\t",
         "v": "\v",
         "'": "'",
         '"': '"'
      };

      /////////////////////////////////////////

      /**
       * @constructor
       */
      var Lexer = function Lexer(options) {
         this.options = options;
      };

      Lexer.prototype = {
         constructor: Lexer,

         lex: function lex(text) {
            this.text = text;

            this.index = 0;
            this.ch = undefined;
            this.lastCh = ':'; // can start regexp

            this.tokens = [];

            var token;
            var json = [];

            while (this.index < this.text.length) {
               this.ch = this.text.charAt(this.index);
               if (this.is('"\'')) {
                  this.readString(this.ch);
               } else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
                  this.readNumber();
               } else if (this.isIdent(this.ch)) {
                  this.readIdent();
                  // identifiers can only be if the preceding char was a { or ,
                  if (this.was('{,') && json[0] === '{' && (token = this.tokens[this.tokens.length - 1])) {
                     token.json = token.text.indexOf('.') === -1;
                  }
               } else if (this.is('(){}[].,;:?')) {
                  this.tokens.push({
                     index: this.index,
                     text: this.ch,
                     json: this.was(':[,') && this.is('{[') || this.is('}]:,')
                  });
                  if (this.is('{[')) json.unshift(this.ch);
                  if (this.is('}]')) json.shift();
                  this.index++;
               } else if (this.isWhitespace(this.ch)) {
                  this.index++;
                  continue;
               } else {
                  var ch2 = this.ch + this.peek();
                  var ch3 = ch2 + this.peek(2);
                  var fn = OPERATORS[this.ch];
                  var fn2 = OPERATORS[ch2];
                  var fn3 = OPERATORS[ch3];
                  if (fn3) {
                     this.tokens.push({
                        index: this.index,
                        text: ch3,
                        fn: fn3
                     });
                     this.index += 3;
                  } else if (fn2) {
                     this.tokens.push({
                        index: this.index,
                        text: ch2,
                        fn: fn2
                     });
                     this.index += 2;
                  } else if (fn) {
                     this.tokens.push({
                        index: this.index,
                        text: this.ch,
                        fn: fn,
                        json: this.was('[,:') && this.is('+-')
                     });
                     this.index += 1;
                  } else {
                     this.throwError('Unexpected next character ', this.index, this.index + 1);
                  }
               }
               this.lastCh = this.ch;
            }
            return this.tokens;
         },

         is: function is(chars) {
            return chars.indexOf(this.ch) !== -1;
         },

         was: function was(chars) {
            return chars.indexOf(this.lastCh) !== -1;
         },

         peek: function peek(i) {
            var num = i || 1;
            return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
         },

         isNumber: function isNumber(ch) {
            return '0' <= ch && ch <= '9';
         },

         isWhitespace: function isWhitespace(ch) {
            // IE treats non-breaking space as \u00A0
            return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\v' || ch === " ";
         },

         isIdent: function isIdent(ch) {
            return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$';
         },

         isExpOperator: function isExpOperator(ch) {
            return ch === '-' || ch === '+' || this.isNumber(ch);
         },

         throwError: function throwError(error, start, end) {
            end = end || this.index;
            var colStr = isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end;
            throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
         },

         readNumber: function readNumber() {
            var number = '';
            var start = this.index;
            while (this.index < this.text.length) {
               var ch = lowercase(this.text.charAt(this.index));
               if (ch == '.' || this.isNumber(ch)) {
                  number += ch;
               } else {
                  var peekCh = this.peek();
                  if (ch == 'e' && this.isExpOperator(peekCh)) {
                     number += ch;
                  } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
                     number += ch;
                  } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
                     this.throwError('Invalid exponent');
                  } else {
                     break;
                  }
               }
               this.index++;
            }
            number = 1 * number;
            this.tokens.push({
               index: start,
               text: number,
               json: true,
               fn: function fn() {
                  return number;
               }
            });
         },

         readIdent: function readIdent() {
            var parser = this;

            var ident = '';
            var start = this.index;

            var lastDot, peekIndex, methodName, ch;

            while (this.index < this.text.length) {
               ch = this.text.charAt(this.index);
               if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
                  if (ch === '.') lastDot = this.index;
                  ident += ch;
               } else {
                  break;
               }
               this.index++;
            }

            //check if this is not a method invocation and if it is back out to last dot
            if (lastDot) {
               peekIndex = this.index;
               while (peekIndex < this.text.length) {
                  ch = this.text.charAt(peekIndex);
                  if (ch === '(') {
                     methodName = ident.substr(lastDot - start + 1);
                     ident = ident.substr(0, lastDot - start);
                     this.index = peekIndex;
                     break;
                  }
                  if (this.isWhitespace(ch)) {
                     peekIndex++;
                  } else {
                     break;
                  }
               }
            }

            var token = {
               index: start,
               text: ident
            };

            // OPERATORS is our own object so we don't need to use special hasOwnPropertyFn
            if (OPERATORS.hasOwnProperty(ident)) {
               token.fn = OPERATORS[ident];
               token.json = OPERATORS[ident];
            } else {
               var getter = getterFn(ident, this.options, this.text);
               token.fn = extend(function (self, locals) {
                  return getter(self, locals);
               }, {
                  assign: function assign(self, value) {
                     return setter(self, ident, value, parser.text, parser.options);
                  }
               });
            }

            this.tokens.push(token);

            if (methodName) {
               this.tokens.push({
                  index: lastDot,
                  text: '.',
                  json: false
               });
               this.tokens.push({
                  index: lastDot + 1,
                  text: methodName,
                  json: false
               });
            }
         },

         readString: function readString(quote) {
            var start = this.index;
            this.index++;
            var string = '';
            var rawString = quote;
            var escape = false;
            while (this.index < this.text.length) {
               var ch = this.text.charAt(this.index);
               rawString += ch;
               if (escape) {
                  if (ch === 'u') {
                     var hex = this.text.substring(this.index + 1, this.index + 5);
                     if (!hex.match(/[\da-f]{4}/i)) this.throwError("Invalid unicode escape [\\u" + hex + ']');
                     this.index += 4;
                     string += String.fromCharCode(parseInt(hex, 16));
                  } else {
                     var rep = ESCAPE[ch];
                     if (rep) {
                        string += rep;
                     } else {
                        string += ch;
                     }
                  }
                  escape = false;
               } else if (ch === '\\') {
                  escape = true;
               } else if (ch === quote) {
                  this.index++;
                  this.tokens.push({
                     index: start,
                     text: rawString,
                     string: string,
                     json: true,
                     fn: function fn() {
                        return string;
                     }
                  });
                  return;
               } else {
                  string += ch;
               }
               this.index++;
            }
            this.throwError('Unterminated quote', start);
         }
      };

      /**
       * @constructor
       */
      var Parser = function Parser(lexer, $filter, options) {
         this.lexer = lexer;
         this.$filter = $filter;
         this.options = options;
      };

      Parser.ZERO = function () {
         return 0;
      };

      Parser.prototype = {
         constructor: Parser,

         parse: function parse(text) {
            this.text = text;

            this.tokens = this.lexer.lex(text);

            var value = this.statements();

            if (this.tokens.length !== 0) {
               this.throwError('is an unexpected token', this.tokens[0]);
            }

            value.literal = !!value.literal;
            value.constant = !!value.constant;

            return value;
         },
         tokenize: function tokenize(text) {
            this.text = text;
            //2
            this.tokens = this.lexer.lex(text);
            return this.tokens;
         },

         primary: function primary() {
            var primary;
            if (this.expect('(')) {
               primary = this.filterChain();
               this.consume(')');
            } else if (this.expect('[')) {
               primary = this.arrayDeclaration();
            } else if (this.expect('{')) {
               primary = this.object();
            } else {
               var token = this.expect();
               primary = token.fn;
               if (!primary) {
                  this.throwError('not a primary expression', token);
               }
               if (token.json) {
                  primary.constant = true;
                  primary.literal = true;
               }
            }

            var next, context;
            while (next = this.expect('(', '[', '.')) {
               if (next.text === '(') {
                  primary = this.functionCall(primary, context);
                  context = null;
               } else if (next.text === '[') {
                  context = primary;
                  primary = this.objectIndex(primary);
               } else if (next.text === '.') {
                  context = primary;
                  primary = this.fieldAccess(primary);
               } else {
                  this.throwError('IMPOSSIBLE');
               }
            }
            return primary;
         },

         throwError: function throwError(msg, token) {
            throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
         },

         peekToken: function peekToken() {
            if (this.tokens.length === 0) throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
            return this.tokens[0];
         },

         peek: function peek(e1, e2, e3, e4) {
            if (this.tokens.length > 0) {
               var token = this.tokens[0];
               var t = token.text;
               if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
                  return token;
               }
            }
            return false;
         },

         expect: function expect(e1, e2, e3, e4) {
            var token = this.peek(e1, e2, e3, e4);
            if (token) {
               this.tokens.shift();
               return token;
            }
            return false;
         },

         consume: function consume(e1) {
            if (!this.expect(e1)) {
               this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
            }
         },

         unaryFn: function unaryFn(fn, right) {
            return extend(function (self, locals) {
               return fn(self, locals, right);
            }, {
               constant: right.constant
            });
         },

         ternaryFn: function ternaryFn(left, middle, right) {
            return extend(function (self, locals) {
               return left(self, locals) ? middle(self, locals) : right(self, locals);
            }, {
               constant: left.constant && middle.constant && right.constant
            });
         },

         binaryFn: function binaryFn(left, fn, right) {
            return extend(function (self, locals) {
               return fn(self, locals, left, right);
            }, {
               constant: left.constant && right.constant
            });
         },

         statements: function statements() {
            var statements = [];
            while (true) {
               if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']')) {
                  statements.push(this.filterChain());
               }
               if (!this.expect(';')) {
                  // optimize for the common case where there is only one statement.
                  // TODO(size): maybe we should not support multiple statements?
                  return statements.length === 1 ? statements[0] : function (self, locals) {
                     var value;
                     for (var i = 0; i < statements.length; i++) {
                        var statement = statements[i];

                        if (statement) {
                           value = statement(self, locals);
                        }
                     }
                     return value;
                  };
               }
            }
         },

         filterChain: function filterChain() {
            var left = this.expression();
            var token;
            while (true) {
               if (token = this.expect('|')) {
                  left = this.binaryFn(left, token.fn, this.filter());
               } else {
                  return left;
               }
            }
         },

         filter: function filter() {
            var token = this.expect();
            var fn = this.$filter(token.text);
            var argsFn = [];
            while (true) {
               if (token = this.expect(':')) {
                  argsFn.push(this.expression());
               } else {
                  var fnInvoke = function fnInvoke(self, locals, input) {
                     var args = [input];
                     for (var i = 0; i < argsFn.length; i++) {
                        args.push(argsFn[i](self, locals));
                     }
                     return fn.apply(self, args);
                  };
                  return function () {
                     return fnInvoke;
                  };
               }
            }
         },

         expression: function expression() {
            return this.assignment();
         },

         assignment: function assignment() {
            var left = this.ternary();
            var right;
            var token;
            if (token = this.expect('=')) {
               if (!left.assign) {
                  this.throwError('implies assignment but [' + this.text.substring(0, token.index) + '] can not be assigned to', token);
               }
               right = this.ternary();
               return function (scope, locals) {
                  return left.assign(scope, right(scope, locals), locals);
               };
            }
            return left;
         },

         ternary: function ternary() {
            var left = this.logicalOR();
            var middle;
            var token;
            if (token = this.expect('?')) {
               middle = this.ternary();
               if (token = this.expect(':')) {
                  return this.ternaryFn(left, middle, this.ternary());
               } else {
                  this.throwError('expected :', token);
               }
            } else {
               return left;
            }
         },

         logicalOR: function logicalOR() {
            var left = this.logicalAND();
            var token;
            while (true) {
               if (token = this.expect('||')) {
                  left = this.binaryFn(left, token.fn, this.logicalAND());
               } else {
                  return left;
               }
            }
         },

         logicalAND: function logicalAND() {
            var left = this.equality();
            var token;
            if (token = this.expect('&&')) {
               left = this.binaryFn(left, token.fn, this.logicalAND());
            }
            return left;
         },

         equality: function equality() {
            var left = this.relational();
            var token;
            if (token = this.expect('==', '!=', '===', '!==')) {
               left = this.binaryFn(left, token.fn, this.equality());
            }
            return left;
         },

         relational: function relational() {
            var left = this.additive();
            var token;
            if (token = this.expect('<', '>', '<=', '>=')) {
               left = this.binaryFn(left, token.fn, this.relational());
            }
            return left;
         },

         additive: function additive() {
            var left = this.multiplicative();
            var token;
            while (token = this.expect('+', '-')) {
               left = this.binaryFn(left, token.fn, this.multiplicative());
            }
            return left;
         },

         multiplicative: function multiplicative() {
            var left = this.unary();
            var token;
            while (token = this.expect('*', '/', '%')) {
               left = this.binaryFn(left, token.fn, this.unary());
            }
            return left;
         },

         unary: function unary() {
            var token;
            if (this.expect('+')) {
               return this.primary();
            } else if (token = this.expect('-')) {
               return this.binaryFn(Parser.ZERO, token.fn, this.unary());
            } else if (token = this.expect('!')) {
               return this.unaryFn(token.fn, this.unary());
            } else {
               return this.primary();
            }
         },

         fieldAccess: function fieldAccess(object) {
            var parser = this;
            var field = this.expect().text;
            var getter = getterFn(field, this.options, this.text);

            return extend(function (scope, locals, self) {
               return getter(self || object(scope, locals));
            }, {
               assign: function assign(scope, value, locals) {
                  var o = object(scope, locals);
                  if (!o) object.assign(scope, o = {}, locals);
                  return setter(o, field, value, parser.text, parser.options);
               }
            });
         },

         objectIndex: function objectIndex(obj) {
            var parser = this;

            var indexFn = this.expression();
            this.consume(']');

            return extend(function (self, locals) {
               var o = obj(self, locals),
                   i = indexFn(self, locals),
                   v,
                   p;

               if (!o) return undefined;
               v = ensureSafeObject(o[i], parser.text);
               return v;
            }, {
               assign: function assign(self, value, locals) {
                  var key = indexFn(self, locals);
                  // prevent overwriting of Function.constructor which would break ensureSafeObject check
                  var o = ensureSafeObject(obj(self, locals), parser.text);
                  if (!o) obj.assign(self, o = [], locals);
                  return o[key] = value;
               }
            });
         },

         functionCall: function functionCall(fn, contextGetter) {
            var argsFn = [];
            if (this.peekToken().text !== ')') {
               do {
                  argsFn.push(this.expression());
               } while (this.expect(','));
            }
            this.consume(')');

            var parser = this;

            return function (scope, locals) {
               var args = [];
               var context = contextGetter ? contextGetter(scope, locals) : scope;

               for (var i = 0; i < argsFn.length; i++) {
                  args.push(argsFn[i](scope, locals));
               }

               var fnPtr = fn(scope, locals, context) || noop;

               ensureSafeObject(context, parser.text);
               ensureSafeObject(fnPtr, parser.text);

               // IE stupidity! (IE doesn't have apply for some native functions)
               var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);

               return ensureSafeObject(v, parser.text);
            };
         },

         // This is used with json array declaration
         arrayDeclaration: function arrayDeclaration() {
            var elementFns = [];
            var allConstant = true;
            if (this.peekToken().text !== ']') {
               do {
                  if (this.peek(']')) {
                     // Support trailing commas per ES5.1.
                     break;
                  }
                  var elementFn = this.expression();
                  elementFns.push(elementFn);
                  if (!elementFn.constant) {
                     allConstant = false;
                  }
               } while (this.expect(','));
            }
            this.consume(']');

            return extend(function (self, locals) {
               var array = [];
               for (var i = 0; i < elementFns.length; i++) {
                  array.push(elementFns[i](self, locals));
               }
               return array;
            }, {
               literal: true,
               constant: allConstant
            });
         },

         object: function object() {
            var keyValues = [];
            var allConstant = true;
            if (this.peekToken().text !== '}') {
               do {
                  if (this.peek('}')) {
                     // Support trailing commas per ES5.1.
                     break;
                  }
                  var token = this.expect(),
                      key = token.string || token.text;
                  this.consume(':');
                  var value = this.expression();
                  keyValues.push({
                     key: key,
                     value: value
                  });
                  if (!value.constant) {
                     allConstant = false;
                  }
               } while (this.expect(','));
            }
            this.consume('}');

            return extend(function (self, locals) {
               var object = {};
               for (var i = 0; i < keyValues.length; i++) {
                  var keyValue = keyValues[i];
                  object[keyValue.key] = keyValue.value(self, locals);
               }
               return object;
            }, {
               literal: true,
               constant: allConstant
            });
         }
      };

      //////////////////////////////////////////////////
      // Parser helper functions
      //////////////////////////////////////////////////

      function setter(obj, path, setValue, fullExp) {
         var element = path.split('.'),
             key;
         for (var i = 0; element.length > 1; i++) {
            key = ensureSafeMemberName(element.shift(), fullExp);
            var propertyObj = obj[key];
            if (!propertyObj) {
               propertyObj = {};
               obj[key] = propertyObj;
            }
            obj = propertyObj;
         }
         key = ensureSafeMemberName(element.shift(), fullExp);
         obj[key] = setValue;
         return setValue;
      }

      var getterFnCache = {};

      /**
       * Implementation of the "Black Hole" variant from:
       * - http://jsperf.com/angularjs-parse-getter/4
       * - http://jsperf.com/path-evaluation-simplified/7
       */
      function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp) {
         ensureSafeMemberName(key0, fullExp);
         ensureSafeMemberName(key1, fullExp);
         ensureSafeMemberName(key2, fullExp);
         ensureSafeMemberName(key3, fullExp);
         ensureSafeMemberName(key4, fullExp);

         return function cspSafeGetter(scope, locals) {
            var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;

            if (pathVal == null) return pathVal;
            pathVal = pathVal[key0];

            if (!key1) return pathVal;
            if (pathVal == null) return undefined;
            pathVal = pathVal[key1];

            if (!key2) return pathVal;
            if (pathVal == null) return undefined;
            pathVal = pathVal[key2];

            if (!key3) return pathVal;
            if (pathVal == null) return undefined;
            pathVal = pathVal[key3];

            if (!key4) return pathVal;
            if (pathVal == null) return undefined;
            pathVal = pathVal[key4];

            return pathVal;
         };
      }

      function simpleGetterFn1(key0, fullExp) {
         ensureSafeMemberName(key0, fullExp);

         return function simpleGetterFn1(scope, locals) {
            if (scope == null) return undefined;
            return (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
         };
      }

      function simpleGetterFn2(key0, key1, fullExp) {
         ensureSafeMemberName(key0, fullExp);
         ensureSafeMemberName(key1, fullExp);

         return function simpleGetterFn2(scope, locals) {
            if (scope == null) return undefined;
            scope = (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
            return scope == null ? undefined : scope[key1];
         };
      }

      function getterFn(path, options, fullExp) {
         // Check whether the cache has this getter already.
         // We can use hasOwnProperty directly on the cache because we ensure,
         // see below, that the cache never stores a path called 'hasOwnProperty'
         if (getterFnCache.hasOwnProperty(path)) {
            return getterFnCache[path];
         }

         var pathKeys = path.split('.'),
             pathKeysLength = pathKeys.length,
             fn;

         // When we have only 1 or 2 tokens, use optimized special case closures.
         // http://jsperf.com/angularjs-parse-getter/6
         if (pathKeysLength === 1) {
            fn = simpleGetterFn1(pathKeys[0], fullExp);
         } else if (pathKeysLength === 2) {
            fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
         } else if (options.csp) {
            if (pathKeysLength < 6) {
               fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
            } else {
               fn = function fn(scope, locals) {
                  var i = 0,
                      val;
                  do {
                     val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);

                     locals = undefined; // clear after first iteration
                     scope = val;
                  } while (i < pathKeysLength);
                  return val;
               };
            }
         } else {
            var code = 'var p;\n';
            forEach(pathKeys, function (key, index) {
               ensureSafeMemberName(key, fullExp);
               code += 'if(s == null) return undefined;\n' + 's=' + (index
               // we simply dereference 's' on any .dot notation
               ? 's'
               // but if we are first then we check locals first, and if so read it first
               : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n';
            });
            code += 'return s;';

            /* jshint -W054 */
            var evaledFnGetter = new Function('s', 'k', 'pw', code); // s=scope, k=locals, pw=promiseWarning
            /* jshint +W054 */
            evaledFnGetter.toString = valueFn(code);
            fn = evaledFnGetter;
         }

         // Only cache the value if it's not going to mess up the cache object
         // This is more performant that using Object.prototype.hasOwnProperty.call
         if (path !== 'hasOwnProperty') {
            getterFnCache[path] = fn;
         }
         return fn;
      }

      $_exports = {
         Lexer: Lexer,
         Parser: Parser
      };

      return $_exports;
   });
   realm.module("realm.riot.AngularModel", ["realm.riot.Expressions"], function ($expr) {
      var $_exports;

      var Model = function () {
         function Model(tag) {
            _classCallCheck(this, Model);

            this.tag = tag;
            this.path = tag.opts.model;

            this.model = $expr.compile(this.path);
            this.root = this.tag.root;
            var self = this;
            this.tag.on("update", function () {
               self._onUpdate.bind(self)();
            });
            this.tag.on("mount", function () {
               self._onMount.bind(self)();
            });
         }

         _createClass(Model, [{
            key: "getValue",
            value: function getValue() {
               return this.model(this.tag.parent);
            }
         }, {
            key: "assign",
            value: function assign(value) {
               this.model.assign(this.tag.parent, value);
            }
         }, {
            key: "onUpdate",
            value: function onUpdate(fn) {
               this._onUpdate = fn;
            }
         }, {
            key: "onMount",
            value: function onMount(fn) {
               this._onMount = fn;
            }
         }, {
            key: "notify",
            value: function notify(value) {
               this.tag.parent.trigger("model-changed", this.path, value);
            }
         }, {
            key: "attach",
            value: function attach(tag) {
               this.tag = tag;
            }
         }]);

         return Model;
      }();

      $_exports = Model;

      return $_exports;
   });
   realm.module("realm.riot.Dispatcher", ["utils.lodash", "realm.riot.PushState"], function (_, PushState) {
      var $_exports;

      var $rootRoute;

      var url2Method = function url2Method(url) {
         return "on" + url[0].toUpperCase() + url.slice(1, url.length);
      };

      var Dispatcher = function () {

         /**
          * constructor -
          * Subscribes to changes (Should be initialated only once)
          *
          * @return {type}  description
          */

         function Dispatcher() {
            _classCallCheck(this, Dispatcher);

            var self = this;
            this.states = {};
            this.urls = [];

            PushState.subscribe(function () {
               self.changed();
            });
         }

         /**
          * storeEssentials - stores information into the "route" object
          * Creats a hidden proprety
          * @param  {type} obj  description
          * @param  {type} data description
          * @return {type}      description
          */


         _createClass(Dispatcher, [{
            key: "storeEssentials",
            value: function storeEssentials(obj, data) {
               if (!obj.$$router) {
                  Object.defineProperty(obj, "$$router", {
                     enumerable: false,
                     value: data
                  });
                  return obj.$$router;
               } else {

                  _.each(data, function (v, k) {

                     obj.$$router[k] = v;
                  });
               }
               return obj.$$router;
            }
         }, {
            key: "assign",
            value: function assign(route) {
               if (!$rootRoute) {
                  $rootRoute = route;
               }
               this.changed();
            }

            /**
             * getEssentials - gets information from an object
             *
             * @param  {type} obj description
             * @return {type}     description
             */

         }, {
            key: "getEssentials",
            value: function getEssentials(obj) {
               return obj.$$router || {};
            }

            /**
             * getPaths - Retrevies paths
             *
             * @return {type}  description
             */

         }, {
            key: "getPaths",
            value: function getPaths() {
               var path = window.location.pathname;
               return path.split("/");
            }
         }, {
            key: "getFullURL",
            value: function getFullURL() {
               return window.location.href;
            }

            /**
             * register - description
             *
             * @param  {type} element description
             * @param  {type} route   description
             * @return {type}         description
             */

         }, {
            key: "register",
            value: function register(element, tag, route) {
               var self = this;

               var essentials = self.storeEssentials(route, {
                  element: element
               });

               var nextIndex = essentials.index + 1;
               var path = this.paths[essentials.index + 1];
               var args = _.slice(this.paths, essentials.index + 2);
               while (element.firstChild) {
                  element.removeChild(element.firstChild);
               }
               if (!path) {
                  return;
               }

               var method = route[url2Method(path)];

               if (_.isFunction(method)) {
                  var result = this.evaluate(route, method, args);
                  var element = route.$$router.element;
                  if (_.isPlainObject(result)) {
                     self.mount(element, result, true);
                  } else {
                     self.initializeRoute(element, result, nextIndex, args);
                  }
               }
            }

            /**
             * changed - description
             *
             * @return {type}  description
             */

         }, {
            key: "changed",
            value: function changed() {
               var self = this;
               this.paths = this.getPaths();

               if (!this.root) {
                  // initial run
                  self.urls = this.paths;
                  return this.createRoot();
               }
               // on navigation
               var changedRoute;
               _.each(this.paths, function (path, index) {
                  if (self.urls[index] !== path && changedRoute === undefined) {
                     changedRoute = index;
                  }
               });
               //console.log(self.fullURL !== self.getFullURL())
               if (changedRoute === undefined && self.paths.length !== self.urls.length) {
                  changedRoute = _.findLastIndex(this.paths);
               }
               if (changedRoute > -1) {
                  var route = self.states[changedRoute - 1];
                  if (route !== undefined) {
                     if (route.$$router) {
                        var routerData = route.$$router;
                        if (routerData.element && routerData.data) {
                           self.register(routerData.element, routerData.data.tag, routerData.data.parent);
                        }
                     }
                  }
               }
               self.fullURL = self.getFullURL();
               self.urls = this.paths;
            }

            /**
             * initializeRoute - description
             *
             * @param  {type} route     description
             * @param  {type} nextIndex description
             * @return {type}           description
             */

         }, {
            key: "initializeRoute",
            value: function initializeRoute(element, route, nextIndex, args) {
               var self = this;
               self.storeEssentials(route, {
                  index: nextIndex,
                  dispatcher: self,
                  element: element
               });
               self.states[nextIndex] = route;
               var data = this.evaluate(route, route.initialize, args);
               if (data) {
                  var furtherDown = self.mount(element, data);
                  if (furtherDown.nextElement) {
                     var furtherIndex = nextIndex + 1;
                     var furtherArgs = _.slice(this.paths, furtherIndex);

                     if (furtherDown.result && furtherDown.nextElement) {
                        self.initializeRoute(furtherDown.nextElement, furtherDown.result, furtherIndex, furtherArgs);
                     }
                  }
               }
            }

            /**
             * createRoot - description
             *
             * @return {type}  description
             */

         }, {
            key: "createRoot",
            value: function createRoot() {
               var self = this;
               this.root = new $rootRoute();
               self.storeEssentials(this.root, {
                  index: 0,
                  dispatcher: self
               });
               self.states[0] = this.root;
               var data = this.evaluate(this.root, this.root.initialize);
               self.mount('body', data);
            }
         }, {
            key: "patchLinks",
            value: function patchLinks(element) {
               var links = element.querySelectorAll('a');
               _.each(links, function (link) {
                  link.addEventListener('click', function (e) {
                     e.preventDefault();
                     e.stopPropagation();

                     PushState.force({}, this.getAttribute('href'));
                  });
               });
            }
         }, {
            key: "mount",
            value: function mount(element, data, deadEnd) {
               var self = this;
               var tag = riot.mount(element, data.tag, {
                  route: data.parent
               });
               var targetTag = tag[0];
               if (!deadEnd) {
                  self.patchLinks(targetTag.root);
                  var mountTarget = targetTag.root.querySelector("*[route]");
                  if (mountTarget) {
                     data.parent.$$router.data = data;
                     self.register(mountTarget, targetTag, data.parent);
                  }
               }
               return {
                  result: data.callback ? data.callback.apply(data.parent, [targetTag]) : undefined,
                  nextElement: mountTarget
               };
            }

            /**
             * evaluate - checks the response
             *
             * @param  {type} result description
             * @return {type}        description
             */

         }, {
            key: "evaluate",
            value: function evaluate(route, method, args) {
               var index = route.$$router.index;
               var result = method.apply(route, args || []);
               return result;
            }
         }]);

         return Dispatcher;
      }();

      var dispatcher = new Dispatcher();

      $_exports = dispatcher;

      return $_exports;
   });
   realm.module("realm.riot.Expressions", ["realm.riot.AngularExpressionParser", "utils.lodash"], function (AngularExpressionParser, _) {
      var $_exports;

      var parse = AngularExpressionParser;
      var filters = {};
      var Lexer = parse.Lexer;
      var Parser = parse.Parser;
      var lexer = new Lexer({});
      var parser = new Parser(lexer, function getFilter(name) {
         return filters[name];
      });

      /**
       * Compiles src and returns a function that executes src on a target object.
       * The compiled function is cached under compile.cache[src] to speed up further calls.
       *
       * @param {string} src
       * @returns {function}
       */
      function compile(src) {
         var cached;

         if (typeof src !== "string") {
            throw new TypeError("src must be a string, instead saw '" + (typeof src === "undefined" ? "undefined" : _typeof(src)) + "'");
         }

         if (!compile.cache) {
            return parser.parse(src);
         }

         cached = compile.cache[src];

         if (!cached) {
            cached = compile.cache[src] = parser.parse(src);
         }

         return cached;
      }

      function extract(src) {
         if (typeof src !== "string") {
            throw new TypeError("src must be a string, instead saw '" + (typeof src === "undefined" ? "undefined" : _typeof(src)) + "'");
         }
         var tokens = parser.tokenize(src);
         var variables = {};
         var nested = false;
         var latest;
         for (var i in tokens) {
            var item = tokens[i];

            if (_.isString(item.text) && item.text.match(/[a-z0-9\.$]+/i)) {

               if (nested) {
                  if (latest) {
                     if (item.string) {
                        latest.str = item.string;
                     } else {
                        latest.nested = {};
                        latest.nested[item.text] = {};
                        latest = latest.nested[item.text];
                     }
                     nested = false;
                  }
               } else {
                  if (!item.json) {
                     latest = variables[item.text] = {};
                  }
               }
            }
            if (item.text === "[") {
               nested = true;
            }
         }
         return variables;
      }

      /**
       * A cache containing all compiled functions. The src is used as key.
       * Set this on false to disable the cache.
       *
       * @type {object}
       */
      compile.cache = {};

      $_exports = {
         Lexer: Lexer,
         Parser: Parser,
         extract: extract,
         compile: compile,
         filters: filters
      };

      return $_exports;
   });
   realm.module("realm.riot.PushState", ["realm.riot.Query", "utils.lodash"], function (Query, _) {
      var $_exports;

      var subscriptions = [];

      var PushState = function () {
         function PushState() {
            _classCallCheck(this, PushState);
         }

         _createClass(PushState, null, [{
            key: "_createQueryString",
            value: function _createQueryString(data) {
               var stringData = [];
               _.each(data, function (value, k) {
                  stringData.push(k + "=" + encodeURI(value));
               });
               var str = stringData.join("&");
               if (stringData.length > 0) {
                  str = "?" + str;
               }
               return str;
            }
         }, {
            key: "subscribe",
            value: function subscribe(cb) {
               subscriptions.push(cb);
            }
         }, {
            key: "changed",
            value: function changed() {
               _.each(subscriptions, function (cb) {
                  cb();
               });
            }
         }, {
            key: "redirect",
            value: function redirect(url) {
               History.set(url);
            }
         }, {
            key: "get",
            value: function get(item) {
               var q = Query.get();
               if (item) {
                  return q[item];
               }
               return q;
            }
         }, {
            key: "_changeState",
            value: function _changeState(a) {
               var stateObj = {
                  url: a
               };
               history.pushState(stateObj, a, a);
               PushState.changed();
            }
         }, {
            key: "force",
            value: function force(data, userUrl) {
               this._changeState((userUrl || window.location.pathname) + this._createQueryString(data));
            }
         }, {
            key: "merge",
            value: function merge(data, userUrl) {
               if (_.isPlainObject(data)) {
                  var current = Query.get();
                  var params = _.merge(current, data);
                  var url = (userUrl || window.location.pathname) + this._createQueryString(params);
                  this._changeState(url);
               }
            }
         }]);

         return PushState;
      }();

      window.onpopstate = function (state) {
         PushState.changed();
      };

      $_exports = PushState;

      return $_exports;
   });
   realm.module("realm.riot.Query", [], function () {
      var $_exports;

      var Query = function () {
         function Query() {
            _classCallCheck(this, Query);
         }

         _createClass(Query, null, [{
            key: "get",
            value: function get() {
               // This function is anonymous, is executed immediately and
               // the return value is assigned to QueryString!
               var query_string = {};
               var query = window.location.search.substring(1);
               var vars = query.split("&");
               for (var i = 0; i < vars.length; i++) {
                  var pair = vars[i].split("=");
                  // If first entry with this name
                  if (typeof query_string[pair[0]] === "undefined") {

                     if (pair[0]) {
                        query_string[pair[0]] = decodeURIComponent(pair[1]);
                     }

                     // If second entry with this name
                  } else if (typeof query_string[pair[0]] === "string") {
                        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                        query_string[pair[0]] = arr;
                        // If third or later entry with this name
                     } else {
                           query_string[pair[0]].push(decodeURIComponent(pair[1]));
                        }
               }
               return query_string;
            }
         }]);

         return Query;
      }();

      $_exports = Query;

      return $_exports;
   });
   realm.module("realm.riot.Router", ["realm.riot.Dispatcher", "utils.lodash"], function (dispatcher, _) {
      var $_exports;

      var Router = function () {
         function Router() {
            _classCallCheck(this, Router);
         }

         _createClass(Router, [{
            key: "render",
            value: function render(target, callback) {

               return {
                  parent: this,
                  type: "router",
                  tag: target,
                  callback: callback
               };
            }
         }], [{
            key: "start",
            value: function start() {
               dispatcher.assign(this);
            }
         }]);

         return Router;
      }();

      $_exports = Router;

      return $_exports;
   });
   "use realm frontend-raw";

   realm.module("utils.lodash", function () {
      return window._;
   });
})(function (self) {
   var isNode = typeof exports !== 'undefined';return { isNode: isNode, realm: isNode ? require('realm-js') : window.realm };
}());
(function (___scope___) {
   "use strict";
   var $isBackend = ___scope___.isNode;var realm = ___scope___.realm;

   realm.module("realm.tags.form.ui-checkbox", ["realm.riot.AngularModel"], function (AngularModel) {
      var $_exports;
      riot.tag2('ui-checkbox', '<input id="{$name}" type="checkbox"><label style="cursor:pointer" for="{$name}" if="{opts.label}">{opts.label}</label>', '', '', function (opts) {

         var input = new AngularModel(this);
         this.$name = "id_" + new Date().getTime();
         input.$update = true;
         input.onUpdate(function () {
            var value = this.getValue();
            if (this.$update) {
               var input = this.root.querySelector('input');
               input.checked = value;
            } else {
               this.notify(value);
            }
         });
         input.onMount(function () {
            var self = this;
            var input = this.root.querySelector('input');
            input.addEventListener("click", function () {
               self.$update = false;
               self.assign(this.checked);
               self.notify(this.checked);
            });
         });
      });

      return $_exports;
   });
   realm.module("realm.tags.form.ui-input", ["realm.riot.AngularModel"], function (AngularModel) {
      var $_exports;
      riot.tag2('ui-input', '<label if="{opts.label}">{opts.label}</label><input type="text" name="{opts.name}" placeholder="{opts.placeholder}">', '', '', function (opts) {

         var input = new AngularModel(this);

         input.$update = true;
         input.onUpdate(function () {
            var value = this.getValue();
            if (this.$update) {
               var input = this.root.querySelector('input');
               input.value = value !== undefined ? value : '';
            } else {
               this.notify(value);
            }
         });
         input.onMount(function () {
            var self = this;
            var input = this.root.querySelector('input');
            input.addEventListener("keyup", function (e) {

               self.$update = false;
               self.assign(this.value);
               self.notify(this.value);
               if (e.keyCode === 13) {

                  if (self.tag.opts.enter) {
                     self.tag.opts.enter.bind(self.tag.parent)();
                  }
               }
            });
         });
      });

      return $_exports;
   });
   realm.module("realm.tags.form.ui-textarea", ["realm.riot.AngularModel"], function (AngularModel) {
      var $_exports;
      riot.tag2('ui-textarea', '<label if="{opts.title}">{opts.title}</label><textarea name="{opts.name}" placeholder="{opts.placeholder}"></textarea>', '', '', function (opts) {

         var input = new Model(this);

         input.$update = true;
         input.onUpdate(function () {
            var value = this.getValue();
            if (this.$update) {
               var input = this.root.querySelector('textarea');
               input.value = value !== undefined ? value : '';
            } else {
               this.notify(value);
            }
         });
         input.onMount(function () {
            var self = this;
            var input = this.root.querySelector('textarea');
            input.addEventListener("keyup", function () {
               self.$update = false;
               self.assign(this.value);
               self.notify(this.value);
            });
         });
      });

      return $_exports;
   });
})(function (self) {
   var isNode = typeof exports !== 'undefined';return { isNode: isNode, realm: isNode ? require('realm-js') : window.realm };
}());