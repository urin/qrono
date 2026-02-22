var _ = Object.defineProperty;
var x = Object.getOwnPropertySymbols;
var J = Object.prototype.hasOwnProperty, X = Object.prototype.propertyIsEnumerable;
var j = (t, e, n) => e in t ? _(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, k = (t, e) => {
  for (var n in e || (e = {}))
    J.call(e, n) && j(t, n, e[n]);
  if (x)
    for (var n of x(e))
      X.call(e, n) && j(t, n, e[n]);
  return t;
};
const tt = new Date(1915, 0, 1, 12, 0, 0, 0), b = 7, L = 24, A = 60, U = A * L, B = 60, et = B * A, nt = et * L, z = 1e3, ot = B * z, C = nt * z, it = 1, rt = 2, Q = 3, T = 4, st = 5, at = 6, ut = 7;
function S(t, ...e) {
  return e.flat().some(t.hasOwnProperty, t);
}
function $(t) {
  return Object.entries(t).filter(([, e]) => !ct(e)).map(([e]) => e);
}
function d(t) {
  return t !== void 0;
}
function ct(t) {
  return t instanceof Function;
}
function ft(t) {
  return typeof t == "string" || t instanceof String;
}
function F(t) {
  return t !== null && typeof t == "object" && t.constructor === Object;
}
function Z(t) {
  return !Number.isNaN(t.getTime());
}
function N(t) {
  return S(t, [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
  ]);
}
function q(t, e, n) {
  const f = e.getTime(), s = new Date(f);
  if (t)
    return s;
  const i = new Date(f);
  i.setDate(e.getDate() + 1);
  const u = new Date(f);
  u.setDate(e.getDate() - 1);
  const y = i.getTimezoneOffset() - u.getTimezoneOffset();
  if (y === 0)
    return s;
  const h = new Date(
    new Date(f).setUTCMinutes(e.getUTCMinutes() + y)
  );
  return n ? h : h.getHours() !== e.getHours() || h.getMinutes() !== e.getMinutes() ? s : h;
}
const H = o;
o.date = r;
const g = {
  localtime: !1,
  interpretAsDst: !0
};
for (const t of $(g))
  o[t] = function(e) {
    return d(e) ? (g[t] = e, this) : g[t];
  };
o.context = function(t) {
  if (d(t)) {
    for (const e of $(g))
      S(t, e) && (g[e] = t[e]);
    return this;
  }
  return k({}, g);
};
o.asUtc = function() {
  return g.localtime = !1, this;
};
o.asLocaltime = function() {
  return g.localtime = !0, this;
};
Object.assign(o, {
  monday: it,
  tuesday: rt,
  wednesday: Q,
  thursday: T,
  friday: st,
  saturday: at,
  sunday: ut
});
const a = /* @__PURE__ */ Symbol("Qrono.internal");
function o(...t) {
  var s;
  if (!new.target)
    return new o(...t);
  const e = {
    // properties
    nativeDate: null,
    localtime: !1,
    interpretAsDst: !1,
    // methods
    set: mt,
    parse: pt,
    valid: ht,
    context: lt,
    getNative: yt
  };
  if (this[a] = e, e.context(g), t[0] instanceof o) {
    const i = t.shift();
    for (const u of $(e))
      e[u] = i[u]();
  }
  F(t[0]) && !N(t[0]) && e.context(t.shift());
  const n = t[0], f = t[1];
  if (n == null)
    (s = e.nativeDate) != null || (e.nativeDate = /* @__PURE__ */ new Date());
  else if (n instanceof Date)
    e.nativeDate = new Date(n.getTime());
  else if (ft(n))
    e.parse(n);
  else if (F(n)) {
    if (!N(n))
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    e.set(n);
  } else if (Number.isFinite(n) && !Number.isFinite(f))
    e.nativeDate = new Date(n);
  else if (Number.isFinite(n) || Array.isArray(n)) {
    const i = t.flat().filter((u) => Number.isSafeInteger(u));
    if (i.length !== t.flat().length)
      throw RangeError("Should be safe integers");
    if (i.length > 7)
      throw RangeError("Too many numbers");
    e.set({
      year: i[0],
      month: i[1],
      day: i[2],
      hour: i[3],
      minute: i[4],
      second: i[5],
      millisecond: i[6]
    });
  } else
    throw TypeError(`Invalid argument ${t}`);
  return this;
}
function ht() {
  return Z(this.nativeDate);
}
function lt(t) {
  if (t) {
    for (const e of $(g))
      S(t, e) && (this[e] = t[e]);
    return this;
  }
}
function yt(t) {
  return this.nativeDate[`get${this.localtime ? "" : "UTC"}${t}`]();
}
function mt(t) {
  var n, f, s, i, u, y, h, c, D, M, v, I, E, P, R, W;
  const e = k({}, t);
  if (e.month = e.month && e.month - 1, this.localtime) {
    const m = !S(t, "hour", "minute", "second", "millisecond"), Y = m ? !0 : this.interpretAsDst, w = (n = this.nativeDate) != null ? n : new Date(0, 0), O = new Date(tt.getTime()), p = {
      year: (f = e.year) != null ? f : w.getFullYear(),
      month: (s = e.month) != null ? s : w.getMonth(),
      day: (i = e.day) != null ? i : w.getDate(),
      hour: (u = e.hour) != null ? u : m ? 0 : w.getHours(),
      minute: (y = e.minute) != null ? y : m ? 0 : w.getMinutes(),
      second: (h = e.second) != null ? h : m ? 0 : w.getSeconds(),
      millisecond: (c = e.millisecond) != null ? c : m ? 0 : w.getMilliseconds()
    };
    O.setFullYear(p.year, p.month, p.day), O.setHours(
      p.hour,
      p.minute,
      p.second,
      p.millisecond
    );
    const V = p.year * 1e8 + p.month * 1e6 + p.day * 1e4 + p.hour * 100 + p.minute < O.getFullYear() * 1e8 + O.getMonth() * 1e6 + O.getDate() * 1e4 + O.getHours() * 100 + O.getMinutes();
    this.nativeDate = q(Y, O, V);
  } else {
    const m = (D = this.nativeDate) != null ? D : /* @__PURE__ */ new Date(0), Y = /* @__PURE__ */ new Date(0);
    Y.setUTCFullYear(
      (M = e.year) != null ? M : m.getUTCFullYear(),
      (v = e.month) != null ? v : m.getUTCMonth(),
      (I = e.day) != null ? I : m.getUTCDate()
    ), Y.setUTCHours(
      (E = e.hour) != null ? E : m.getUTCHours(),
      (P = e.minute) != null ? P : m.getUTCMinutes(),
      (R = e.second) != null ? R : m.getUTCSeconds(),
      (W = e.millisecond) != null ? W : m.getUTCMilliseconds()
    ), this.nativeDate = Y;
  }
  return this;
}
const dt = new RegExp(
  // yyyy[[-|/]MM[[-|/]DD]]
  "^(\\d{4})(?:[-/]?([0-2]?\\d)(?:[-/]?([0-3]?\\d))?)?(?:[T\\s]([0-2]?\\d)(?::([0-5]?\\d)?(?::([0-6]?\\d)?(?:[.:](\\d{1,3})?\\d*)?)?)?)?(Z|[-+]\\d{2}:?\\d{2})?$"
);
function pt(t) {
  var c;
  const e = t.trim().toUpperCase(), n = e.match(dt);
  if (!n)
    throw RangeError(
      `Failed to parse '${t}'. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  const f = n[4] !== void 0, [s, i, u, y] = [
    +n[1],
    +n[2] || 1,
    +n[3] || 1,
    n[8]
  ], h = new Date(e);
  if (!Z(h))
    throw RangeError(
      `Failed to parse '${t}' by Date. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  return y ? this.nativeDate = h : f ? this.set({
    year: s,
    month: i,
    day: u,
    hour: +n[4] || 0,
    minute: +n[5] || 0,
    second: +n[6] || 0,
    millisecond: +((c = n[7]) == null ? void 0 : c.padStart(3, "0")) || 0
  }) : this.set({ year: s, month: i, day: u }), this;
}
o.prototype.toString = function() {
  if (this[a].localtime) {
    const t = this[a].nativeDate, e = -t.getTimezoneOffset(), n = Math.abs(e);
    return `${String(t.getFullYear()).padStart(4, "0")}-${String(
      t.getMonth() + 1
    ).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(
      t.getHours()
    ).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(
      t.getSeconds()
    ).padStart(2, "0")}.${String(t.getMilliseconds()).padStart(3, "0")}${(e >= 0 ? "+" : "-") + String(Math.trunc(n / A)).padStart(2, "0") + ":" + String(n % A).padStart(2, "0")}`;
  }
  return this[a].nativeDate.toISOString();
};
o.prototype.valueOf = function() {
  return this[a].nativeDate.valueOf();
};
o.prototype.clone = function(...t) {
  return new o(this, ...t);
};
o.prototype.context = function(t) {
  return d(t) ? this.clone(t) : {
    localtime: this[a].localtime,
    interpretAsDst: this[a].interpretAsDst
  };
};
o.prototype.nativeDate = function() {
  return new Date(this[a].nativeDate.getTime());
};
o.prototype.offset = function() {
  return this[a].localtime ? -this[a].nativeDate.getTimezoneOffset() : 0;
};
o.prototype.localtime = function(t) {
  return d(t) ? this.clone({ localtime: t }) : this[a].localtime;
};
o.prototype.interpretAsDst = function(t) {
  return d(t) ? this.clone({ interpretAsDst: t }) : this[a].interpretAsDst;
};
o.prototype.valid = function() {
  return this[a].valid();
};
o.prototype.numeric = function() {
  return this[a].nativeDate.getTime();
};
o.prototype.toObject = function() {
  return {
    year: this.year(),
    month: this.month(),
    day: this.day(),
    hour: this.hour(),
    minute: this.minute(),
    second: this.second(),
    millisecond: this.millisecond()
  };
};
o.prototype.toArray = function() {
  return [
    this.year(),
    this.month(),
    this.day(),
    this.hour(),
    this.minute(),
    this.second(),
    this.millisecond()
  ];
};
o.prototype.toDate = function(...t) {
  return new r(this.clone(...t));
};
o.prototype.asUtc = function() {
  return this.clone({ localtime: !1 });
};
o.prototype.asLocaltime = function() {
  return this.clone({ localtime: !0 });
};
o.prototype.year = function(t) {
  return d(t) ? this.clone({ year: t }) : this[a].getNative("FullYear");
};
o.prototype.month = function(t) {
  return d(t) ? this.clone({ month: t }) : this[a].getNative("Month") + 1;
};
o.prototype.day = function(t) {
  return d(t) ? this.clone({ day: t }) : this[a].getNative("Date");
};
o.prototype.hour = function(t) {
  return d(t) ? this.clone({ hour: t }) : this[a].getNative("Hours");
};
o.prototype.minute = function(t) {
  return d(t) ? this.clone({ minute: t }) : this[a].getNative("Minutes");
};
o.prototype.second = function(t) {
  return d(t) ? this.clone({ second: t }) : this[a].getNative("Seconds");
};
o.prototype.millisecond = function(t) {
  return d(t) ? this.clone({ millisecond: t }) : this[a].getNative("Milliseconds");
};
o.prototype.dayOfWeek = function() {
  return 1 + (this[a].getNative("Day") - 1 + b) % b;
};
o.prototype.dayOfYear = function() {
  const t = this.toDate();
  return 1 + t - t.startOfYear();
};
o.prototype.weekOfYear = function() {
  const t = this.toDate(), e = t.day(t.day() - t.dayOfWeek() + T), n = e.startOfYear(), f = n.dayOfWeek() === T ? n : n.day(
    1 + (T - n.dayOfWeek() + b) % b
  );
  return 1 + Math.ceil((e - f) / b);
};
o.prototype.yearOfWeek = function() {
  const t = this.toDate();
  return t.day(t.day() - t.dayOfWeek() + T).year();
};
o.prototype.isLeapYear = function() {
  const t = this.year();
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
};
o.prototype.hasDstInYear = function() {
  if (!this[a].localtime)
    return !1;
  const t = this.offset();
  return [3, 6, 9, 12].map((e) => this.month(e).offset()).some((e) => e !== t);
};
o.prototype.isInDst = function() {
  if (!this[a].localtime)
    return !1;
  const t = Array.from(
    { length: 12 },
    (f, s) => this.month(s + 1).offset()
  ), e = Math.min(...t), n = Math.max(...t);
  return e !== n && this.offset() === n;
};
o.prototype.isDstTransitionDay = function() {
  return this[a].localtime ? this.minutesInDay() !== U : !1;
};
o.prototype.minutesInDay = function() {
  if (!this[a].localtime)
    return U;
  const t = this.context({ interpretAsDst: !0 }).startOfDay(), e = t.plus({ day: 1 }).startOfDay();
  return t.day() === e.day() ? U : (e - t) / ot;
};
o.prototype.daysInMonth = function() {
  const t = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], e = this.month();
  return t[e - 1] + (this.isLeapYear() && e === 2 ? 1 : 0);
};
o.prototype.daysInYear = function() {
  return this.isLeapYear() ? 366 : 365;
};
o.prototype.weeksInYear = function() {
  const t = this.toDate({ month: 12, day: 31 }), e = t.minus({ year: 1 });
  return t.dayOfWeek() === T || e.dayOfWeek() === Q ? 53 : 52;
};
o.prototype.startOfYear = function() {
  return this.clone({
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
o.prototype.startOfMonth = function() {
  return this.clone({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
};
o.prototype.startOfDay = function() {
  const t = this.clone(
    { interpretAsDst: !0 },
    { hour: 0, minute: 0, second: 0, millisecond: 0 }
  ).numeric();
  return this.clone(t);
};
o.prototype.startOfHour = function() {
  return this.clone({ minute: 0, second: 0, millisecond: 0 });
};
o.prototype.startOfMinute = function() {
  return this.clone({ second: 0, millisecond: 0 });
};
o.prototype.startOfSecond = function() {
  return this.clone({ millisecond: 0 });
};
o.prototype.isSame = function(t) {
  return +this == +t;
};
o.prototype.isBefore = function(t) {
  return this < t;
};
o.prototype.isAfter = function(t) {
  return this > t;
};
o.prototype.isSameOrBefore = function(t) {
  return this <= t;
};
o.prototype.isSameOrAfter = function(t) {
  return this >= t;
};
o.prototype.isBetween = function(t, e) {
  return t <= this && this <= e || e <= this && this <= t;
};
o.prototype.plus = function(...t) {
  return G.call(this, 1, ...t);
};
o.prototype.minus = function(...t) {
  return G.call(this, -1, ...t);
};
function G(t, ...e) {
  var y, h;
  const n = e[0], f = e[1];
  if (Number.isFinite(n) && !Number.isFinite(f))
    return this.clone(this.numeric() + n);
  let s = null;
  if (F(n)) {
    if (!N(n))
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    s = n;
  } else if (Number.isFinite(n) || Array.isArray(n)) {
    const c = e.flat().filter((D) => Number.isSafeInteger(D));
    if (c.length !== e.flat().length)
      throw RangeError("Should be safe integers");
    if (c.length > 7)
      throw RangeError("Too many numbers");
    s = {
      year: c[0],
      month: c[1],
      day: c[2],
      hour: c[3],
      minute: c[4],
      second: c[5],
      millisecond: c[6]
    };
  } else
    throw TypeError();
  const i = this.nativeDate(), u = this[a].localtime ? "" : "UTC";
  if (S(s, "year") || S(s, "month")) {
    const c = this.year() + t * ((y = s.year) != null ? y : 0), D = this.month() + t * ((h = s.month) != null ? h : 0), M = new Date(i.getTime());
    M[`set${u}FullYear`](c, D, 0);
    const v = M[`get${u}Date`]();
    v < this.day() ? i[`set${u}FullYear`](c, M[`get${u}Month`](), v) : i[`set${u}FullYear`](c, D - 1);
  }
  S(s, "day") && i[`set${u}Date`](i[`get${u}Date`]() + t * s.day);
  for (const [c, D] of [
    ["hour", "Hours"],
    ["minute", "Minutes"],
    ["second", "Seconds"],
    ["millisecond", "Milliseconds"]
  ])
    !S(s, c) || s[c] == null || i[`setUTC${D}`](
      i[`getUTC${D}`]() + t * s[c]
    );
  return this.clone(q(this[a].interpretAsDst, i, !1));
}
const l = /* @__PURE__ */ Symbol("QronoDate.internal");
function r(...t) {
  if (!new.target)
    return new r(...t);
  const e = { datetime: null };
  this[l] = e;
  let n = null;
  t[0] instanceof r ? n = t.shift().toDatetime() : t[0] instanceof o && (n = t.shift());
  const f = t[0], s = t[1];
  return Number.isFinite(f) && !Number.isFinite(s) && (t[0] = Math.floor(f) * C), n ? n = n.clone(...t) : n = H(...t), e.datetime = n.startOfDay(), this;
}
r.prototype.toString = function() {
  return this[l].datetime.toString().substring(0, 10);
};
r.prototype.valueOf = function() {
  return this[l].datetime / C;
};
r.prototype.valid = function() {
  return this[l].datetime.valid();
};
r.prototype.clone = function(...t) {
  return new r(this, ...t);
};
r.prototype.toDatetime = function() {
  return H(this[l].datetime.toArray());
};
r.prototype.numeric = function() {
  return this[l].datetime.numeric() / C;
};
r.prototype.toObject = function() {
  return {
    year: this.year(),
    month: this.month(),
    day: this.day()
  };
};
r.prototype.toArray = function() {
  return [this.year(), this.month(), this.day()];
};
r.prototype.startOfYear = function() {
  return new r(this[l].datetime.startOfYear());
};
r.prototype.startOfMonth = function() {
  return new r(this[l].datetime.startOfMonth());
};
r.prototype.startOfDay = function() {
  return this[l].datetime.clone();
};
for (const t of ["year", "month", "day"])
  r.prototype[t] = function(e) {
    return d(e) ? new r(this[l].datetime[t](e)) : this[l].datetime[t]();
  };
for (const t of [
  "dayOfWeek",
  "dayOfYear",
  "weekOfYear",
  "yearOfWeek",
  "isLeapYear",
  "daysInMonth",
  "daysInYear",
  "weeksInYear"
])
  r.prototype[t] = function() {
    return this[l].datetime[t]();
  };
for (const t of ["minutesInDay", "hasDstInYear", "isDstTransitionDay"])
  r.prototype[t] = function() {
    return H(
      { interpretAsDst: !0 },
      this[l].datetime.toArray().slice(0, 3)
    )[t]();
  };
r.prototype.endOfYear = function() {
  return this.clone({ month: 12, day: 31 });
};
r.prototype.endOfMonth = function() {
  return this.clone({ day: this.daysInMonth() });
};
r.prototype.isSame = function(t) {
  return +this == +t;
};
r.prototype.isBefore = function(t) {
  return this < t;
};
r.prototype.isAfter = function(t) {
  return this > t;
};
r.prototype.isSameOrBefore = function(t) {
  return this <= t;
};
r.prototype.isSameOrAfter = function(t) {
  return this >= t;
};
r.prototype.isBetween = function(t, e) {
  return t <= this && this <= e || e <= this && this <= t;
};
r.prototype.plus = function(...t) {
  return K.call(this, 1, ...t);
};
r.prototype.minus = function(...t) {
  return K.call(this, -1, ...t);
};
function K(t, ...e) {
  var u, y, h;
  const n = e[0], f = e[1], s = this[l].datetime;
  if (Number.isFinite(n) && !Number.isFinite(f))
    return s.plus({ day: t * n }).toDate();
  let i = null;
  if (F(n) && N(n))
    i = {
      year: t * ((u = n.year) != null ? u : 0),
      month: t * ((y = n.month) != null ? y : 0),
      day: t * ((h = n.day) != null ? h : 0)
    };
  else if (Number.isFinite(n)) {
    if (e.length > 3)
      throw RangeError("Too many arguments");
    i = { year: t * n, month: t * f, day: t * arg2 };
  } else if (Array.isArray(n)) {
    if (n.length > 3)
      throw RangeError("Too many elements");
    i = {
      year: t * n[0],
      month: t * n[1],
      day: t * n[2]
    };
  } else
    throw TypeError();
  return s.plus(i).toDate();
}
export {
  st as friday,
  it as monday,
  H as qrono,
  at as saturday,
  ut as sunday,
  T as thursday,
  rt as tuesday,
  Q as wednesday
};
//# sourceMappingURL=qrono.js.map
