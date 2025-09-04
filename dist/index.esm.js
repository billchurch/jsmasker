function L(r, a, o, y = "*") {
  let u = r;
  return u === "random" && (u = Math.floor(Math.random() * (o - a + 1)) + a), y.repeat(u);
}
function b(r) {
  return r.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function P(r, a = {}, o = /* @__PURE__ */ new WeakMap()) {
  const {
    properties: y = [
      "password",
      "key",
      "secret",
      "token",
      "privatekey",
      "passphrase"
    ],
    propertyMatcher: u = null,
    maskLength: j = 8,
    minLength: w = 5,
    maxLength: z = 15,
    maskChar: i = "*",
    fullMask: k = !1
  } = a;
  if (o.has(r))
    return o.get(r);
  const A = y.map((e) => b(e));
  function O(e) {
    return typeof k == "string" ? k : k === !0 ? i.repeat(e.length) : L(j, w, z, i);
  }
  function g(e, s, n = []) {
    const t = b(e);
    return u && typeof u == "function" ? u(e, t, s, n) : A.indexOf(t) !== -1;
  }
  function h(e, s, n = []) {
    if (e == null)
      return e;
    if (typeof e == "object" && o.has(e))
      return o.get(e);
    let t;
    if (Array.isArray(e)) {
      t = [], o.set(e, t);
      for (let f = 0; f < e.length; f += 1) {
        const c = [...n, f];
        t[f] = h(e[f], s, c);
      }
    } else if (typeof e == "object") {
      t = {}, o.set(e, t);
      const f = Object.keys(e);
      for (let c = 0; c < f.length; c += 1) {
        const p = f[c], M = [...n, p], x = s || g(p, e[p], M);
        t[p] = h(
          e[p],
          x,
          M
        );
      }
    } else s && typeof e == "string" ? t = O(e) : t = e;
    return t;
  }
  let l;
  if (Array.isArray(r)) {
    l = [], o.set(r, l);
    for (let e = 0; e < r.length; e += 1)
      l[e] = h(r[e], !1, [e]);
  } else if (r && typeof r == "object") {
    l = {}, o.set(r, l);
    const e = Object.keys(r);
    for (let s = 0; s < e.length; s += 1) {
      const n = e[s], t = g(n, r[n], [n]);
      l[n] = h(r[n], t, [n]);
    }
  } else
    l = r;
  return l;
}
export {
  P as default
};
