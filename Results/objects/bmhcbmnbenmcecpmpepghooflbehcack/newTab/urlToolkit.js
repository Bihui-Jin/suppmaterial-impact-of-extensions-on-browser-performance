!(function (r) {
  var e =
      /^(?=((?:[a-zA-Z0-9+\-.]+:)?))\1(?=((?:\/\/[^\/?#]*)?))\2(?=((?:(?:[^?#\/]*\/)*[^;?#\/]*)?))\3((?:;[^?#]*)?)(\?[^#]*)?(#[^]*)?$/,
    t = /^(?=([^\/?#]*))\1([^]*)$/,
    a = /(?:\/|^)\.(?=\/)/g,
    o = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g,
    n = {
      buildAbsoluteURL: function (r, e, a) {
        if (((a = a || {}), (r = r.trim()), !(e = e.trim()))) {
          if (!a.alwaysNormalize) return r;
          var o = n.parseURL(r);
          if (!o) throw new Error('Error trying to parse base URL.');
          return (o.path = n.normalizePath(o.path)), n.buildURLFromParts(o);
        }
        var p = n.parseURL(e);
        if (!p) throw new Error('Error trying to parse relative URL.');
        if (p.scheme)
          return a.alwaysNormalize
            ? ((p.path = n.normalizePath(p.path)), n.buildURLFromParts(p))
            : e;
        var i = n.parseURL(r);
        if (!i) throw new Error('Error trying to parse base URL.');
        if (!i.netLoc && i.path && '/' !== i.path[0]) {
          var s = t.exec(i.path);
          (i.netLoc = s[1]), (i.path = s[2]);
        }
        i.netLoc && !i.path && (i.path = '/');
        var h = {
          scheme: i.scheme,
          netLoc: p.netLoc,
          path: null,
          params: p.params,
          query: p.query,
          fragment: p.fragment,
        };
        if (!p.netLoc && ((h.netLoc = i.netLoc), '/' !== p.path[0]))
          if (p.path) {
            var l = i.path,
              u = l.substring(0, l.lastIndexOf('/') + 1) + p.path;
            h.path = n.normalizePath(u);
          } else
            (h.path = i.path), p.params || ((h.params = i.params), p.query || (h.query = i.query));
        return (
          null === h.path && (h.path = a.alwaysNormalize ? n.normalizePath(p.path) : p.path),
          n.buildURLFromParts(h)
        );
      },
      parseURL: function (r) {
        var t = e.exec(r);
        return t
          ? {
              scheme: t[1] || '',
              netLoc: t[2] || '',
              path: t[3] || '',
              params: t[4] || '',
              query: t[5] || '',
              fragment: t[6] || '',
            }
          : null;
      },
      normalizePath: function (r) {
        for (
          r = r.split('').reverse().join('').replace(a, '');
          r.length !== (r = r.replace(o, '')).length;

        );
        return r.split('').reverse().join('');
      },
      buildURLFromParts: function (r) {
        return r.scheme + r.netLoc + r.path + r.params + r.query + r.fragment;
      },
    };
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = n)
    : 'function' == typeof define && define.amd
    ? define([], function () {
        return n;
      })
    : 'object' == typeof exports
    ? (exports.URLToolkit = n)
    : (r.URLToolkit = n);
})(this);
