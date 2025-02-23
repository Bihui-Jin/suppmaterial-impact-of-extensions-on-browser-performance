(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],2:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],3:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('../js-common-components/accordion');

var toggleClass = 'is-active';

var init = function init() {
  (0, _dollar2.default)('.expandable__trigger').forEach(function (el) {
    if (!el.getAttribute('data-initialized')) {
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        el.closest('.expandable').classList.toggle(toggleClass);
      });
      el.setAttribute('data-initialized', true);
    }
  });
};

init();

},{"../js-common-components/accordion":4,"../js-common-components/dollar":6}],4:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toggleClass = 'is-active';

var handleClick = function handleClick(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  var trigger = ev.target.closest('.expandable');
  var expandables = trigger.parentNode.querySelectorAll('.expandable');
  Array.prototype.forEach.call(expandables, function (el) {
    if (el !== trigger) {
      el.classList.remove(toggleClass);
    }
    return;
  });
};

var init = function init() {
  (0, _dollar2.default)('[data-behavior*=accordion] .expandable__trigger').forEach(function (el) {
    el.addEventListener('click', handleClick);
  });
};

init();

},{"../js-common-components/dollar":6}],5:[function(require,module,exports){
// matches polyfill
var matchesPolyfill = function applyMatchesPolyfill(proto) {
  var ElementPrototype = proto;
  ElementPrototype.matches = ElementPrototype.matches || ElementPrototype.matchesSelector || ElementPrototype.webkitMatchesSelector || ElementPrototype.msMatchesSelector || function matches(selector) {
    var node = this;
    var nodes = (node.parentNode || node.document).querySelectorAll(selector);
    var i = -1;
    while (nodes[++i] && nodes[i] !== node) {}
    return !!nodes[i];
  };
};
matchesPolyfill(Element.prototype);

// closest polyfill
var closestPolyfill = function applyClosestPolyfill(proto) {
  var ElementPrototype = proto;
  ElementPrototype.closest = ElementPrototype.closest || function closest(selector) {
    var el = this;
    while (el.matches && !el.matches(selector)) {
      el = el.parentNode;
    }return el.matches ? el : null;
  };
};
closestPolyfill(Element.prototype);

},{}],6:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $ = function $(str) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return [].slice.call(context.querySelectorAll(str));
};

exports.default = $;

},{}],7:[function(require,module,exports){
var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toggleClass = 'is-active';

(0, _dollar2.default)('[data-target]').forEach(function (el) {
  el.addEventListener('click', function (ev) {
    if ((0, _dollar2.default)(el.dataset.target)[0]) {
      ev.preventDefault();
      ev.stopPropagation();
      (0, _dollar2.default)(el.dataset.target)[0].classList.toggle(toggleClass);
    }
  });
});

},{"./dollar":6}],8:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
function debounce(callback, wait) {
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

  var timeout = null;
  var callbackArgs = null;

  var later = function later() {
    return callback.apply(context, callbackArgs);
  };

  return function db() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callbackArgs = args;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

exports.debounce = debounce;

},{}],9:[function(require,module,exports){

require('./js-common-components/toggler');
require('./js-common-components/closest');
require('./expandable/expandable');
require('./tabs/tabs');
require('./slider/slider');
require('./table/table');
require('./navbar/navbar');

},{"./expandable/expandable":3,"./js-common-components/closest":5,"./js-common-components/toggler":7,"./navbar/navbar":10,"./slider/slider":11,"./table/table":12,"./tabs/tabs":13}],10:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _utils = require('../js-common-components/utils');

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

require('whatwg-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inputField = document.querySelector('.inputfield--search');

function clearResults(select) {
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
}

function createListElement(result, opts) {
  var opt = document.createElement('li');
  var link = document.createElement('a');
  link.setAttribute('href', result[opts.url]);
  link.classList.add('search__results__link');
  link.textContent = result[opts.title];
  opt.appendChild(link);
  return opt;
}

function fetchResults(select, searchData, params, opts) {
  if (!window.Promise) {
    window.Promise = _promisePolyfill2.default;
  }

  fetch(searchData + '?' + params).catch(function () {
    return '{ results: [] }';
  }).then(function (res) {
    return res.json();
  }).then(function (searchResults) {
    var results = searchResults[opts.resultskey];
    if (!results) {
      return;
    }
    var trimmedresults = results.slice(0, opts.maxresults);
    var elements = trimmedresults.map(function (el) {
      return createListElement(el, opts);
    });
    window.requestAnimationFrame(function () {
      clearResults(select);
      elements.forEach(function (el) {
        return select.appendChild(el);
      });
    });
  });
}

var getfunc = function getfunc(keyCode, indexOfSelected, length) {
  switch (keyCode) {
    case 38:
      return ((indexOfSelected - 1) % length + length) % length;
    default:
      return ((indexOfSelected + 1) % length + length) % length;
  }
};

var getnumb = function getnumb(keyCode, searchResultLinks) {
  switch (keyCode) {
    case 38:
      return searchResultLinks.length - 1;
    default:
      return 0;
  }
};

var handleKeydown = function handleKeydown(ev) {
  if (inputField.classList.contains('has-focus') && (ev.keyCode === 40 || ev.keyCode === 38)) {
    ev.preventDefault();
    ev.stopPropagation();
    var searchResults = document.querySelector('.search__results');
    var selectedLink = searchResults.querySelector('a:focus');

    var searchResultLinks = searchResults.querySelectorAll('a');
    searchResultLinks[getnumb(ev.keyCode, searchResultLinks)].focus();

    if (selectedLink) {
      var indexOfSelected = Array.prototype.indexOf.call(searchResultLinks, selectedLink) || 0;
      searchResultLinks[getfunc(ev.keyCode, indexOfSelected, searchResultLinks.length)].focus();
    }
  }
  return false;
};

var initData = function initData() {
  (0, _dollar2.default)('.js-search:not([action=""])').forEach(function (el) {
    var form = el.parentNode;
    var ul = form.appendChild(document.createElement('ul'));
    ul.addEventListener('click', function (e) {
      return e.stopPropagation();
    });
    ul.classList.add('search__results');

    var searchData = form.dataset.results || form.action;
    var opts = {
      title: form.dataset.titleprop || 'title',
      url: form.dataset.urlprop || 'url',
      maxresults: parseInt(form.dataset.maxresults, 10) || 10,
      resultskey: form.dataset.resultskey || 'results'
    };

    inputField.addEventListener('keyup', (0, _utils.debounce)(function () {
      var params = (0, _dollar2.default)('input', form).map(function (input) {
        return input.name + '=' + input.value;
      }).join('&');
      fetchResults(ul, searchData, params, opts);
      inputField.classList.add('has-focus');
    }, 150));

    document.body.addEventListener('click', function () {
      inputField.classList.remove('has-focus');
    });

    document.body.addEventListener('keydown', handleKeydown);
  });
};

initData();

},{"../js-common-components/dollar":6,"../js-common-components/utils":8,"promise-polyfill":1,"whatwg-fetch":2}],11:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function colorRangeInput() {
  this.min = this.min || 0;
  this.max = this.max || 100;

  var currentValue = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.backgroundImage = 'linear-gradient(to right, #00a1b2 0%, #00a1b2 ' + currentValue + '%,\n  #ccc ' + currentValue + '%, #ccc 100%)';
}

var init = function init() {
  (0, _dollar2.default)('input[type=range]').forEach(function (el) {
    if (!el.getAttribute('data-initialized')) {
      el.addEventListener('change', colorRangeInput);
      el.addEventListener('mousemove', colorRangeInput);
      el.setAttribute('data-initialized', true);
    }
  });
};

init();

},{"../js-common-components/dollar":6}],12:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fillData = function fillData(table) {
  var th = (0, _dollar2.default)('th', table);
  if (!th.length) {
    th = (0, _dollar2.default)('thead td', table);
  }
  var header = th.map(function (el) {
    return el.textContent;
  });
  var tr = (0, _dollar2.default)('tr', table);
  tr.forEach(function (row) {
    var td = (0, _dollar2.default)('td', row);
    td.forEach(function (cell, i) {
      return cell.setAttribute('data-th', header[i]);
    });
  });
};

var init = function init() {
  (0, _dollar2.default)('table').forEach(function (table) {
    if (!table.getAttribute('data-initialized')) {
      table.setAttribute('data-initialized', true);
      fillData(table);
    }
  });
};

init();

},{"../js-common-components/dollar":6}],13:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('../js-common-components/closest');

// TOOD: Flag for refactoring

var clickTab = function clickTab(ev) {
  var target = ev.target;
  var tabContainer = target.closest('.tabs');
  var tabs = tabContainer.querySelectorAll('.tab');
  Array.prototype.forEach.call(tabs, function (t) {
    return t.classList.remove('is-active');
  });
  target.classList.add('is-active');
};

var init = function init() {
  (0, _dollar2.default)('button.tab').forEach(function (el) {
    if (!el.getAttribute('data-initialized')) {
      el.addEventListener('click', function (ev) {
        return clickTab(ev);
      });
      el.setAttribute('data-initialized', true);
    }
  });
};

init();

},{"../js-common-components/closest":5,"../js-common-components/dollar":6}]},{},[9]);
