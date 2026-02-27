var rt = Object.defineProperty;
var K = Object.getOwnPropertySymbols;
var st = Object.prototype.hasOwnProperty, at = Object.prototype.propertyIsEnumerable;
var V = (t, e, n) => e in t ? rt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, k = (t, e) => {
  for (var n in e || (e = {}))
    st.call(e, n) && V(t, n, e[n]);
  if (K)
    for (var n of K(e))
      at.call(e, n) && V(t, n, e[n]);
  return t;
};
const ut = new Date(1915, 0, 1, 12, 0, 0, 0), T = 7, _ = 24, v = 60, N = v * _, J = 60, ct = J * v, ft = ct * _, X = 1e3, ht = J * X, U = ft * X;
function D(t, ...e) {
  return e.flat().some(t.hasOwnProperty, t);
}
function F(t) {
  return Object.entries(t).filter(([, e]) => !lt(e)).map(([e]) => e);
}
function w(t) {
  return t !== void 0;
}
function lt(t) {
  return t instanceof Function;
}
function mt(t) {
  return typeof t == "string" || t instanceof String;
}
function S(t) {
  return t !== null && typeof t == "object" && t.constructor === Object;
}
function tt(t) {
  return !Number.isNaN(t.getTime());
}
function Y(t) {
  return D(t, [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
  ]);
}
const C = o;
o.date = a;
const d = {
  localtime: !1,
  disambiguation: "compatible"
};
for (const t of F(d))
  o[t] = function(e) {
    return w(e) ? (d[t] = e, this) : d[t];
  };
o.context = function(t) {
  if (w(t)) {
    for (const e of F(d))
      D(t, e) && (d[e] = t[e]);
    return this;
  }
  return k({}, d);
};
o.asUtc = function() {
  return d.localtime = !1, this;
};
o.asLocaltime = function() {
  return d.localtime = !0, this;
};
const yt = 1, dt = 2, et = 3, M = 4, pt = 5, Dt = 6, gt = 7;
Object.assign(o, {
  monday: yt,
  tuesday: dt,
  wednesday: et,
  thursday: M,
  friday: pt,
  saturday: Dt,
  sunday: gt
});
const c = /* @__PURE__ */ Symbol();
function o(...t) {
  var s;
  if (!new.target)
    return new o(...t);
  const e = {
    // properties
    nativeDate: null,
    localtime: !1,
    disambiguation: "compatible",
    // methods
    set: Mt,
    parse: vt,
    valid: Ot,
    context: wt,
    getNative: bt
  };
  if (this[c] = e, e.context(d), t[0] instanceof o) {
    const r = t.shift();
    for (const i of F(e))
      e[i] = r[i]();
  }
  S(t[0]) && !Y(t[0]) && e.context(t.shift());
  const n = t[0], u = t[1];
  if (n == null)
    (s = e.nativeDate) != null || (e.nativeDate = /* @__PURE__ */ new Date());
  else if (n instanceof Date)
    e.nativeDate = new Date(n.getTime());
  else if (mt(n))
    e.parse(n);
  else if (S(n)) {
    if (!Y(n))
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    e.set(n);
  } else if (Number.isFinite(n) && !Number.isFinite(u))
    e.nativeDate = new Date(n);
  else if (Number.isFinite(n) || Array.isArray(n)) {
    const r = t.flat(), i = r.filter((m) => Number.isSafeInteger(m));
    if (i.length !== r.length)
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
function Ot() {
  return tt(this.nativeDate);
}
function wt(t) {
  if (t) {
    for (const e of F(d))
      D(t, e) && (this[e] = t[e]);
    return this;
  }
}
function bt(t) {
  return this.nativeDate[`get${this.localtime ? "" : "UTC"}${t}`]();
}
function Mt(t) {
  var A, H, I, E, R, P, W, j, x, L, B, z, q, Z, Q, G;
  const e = k({}, t);
  if (e.month = e.month && e.month - 1, !this.localtime) {
    const O = (A = this.nativeDate) != null ? A : /* @__PURE__ */ new Date(0), $ = /* @__PURE__ */ new Date(0);
    return $.setUTCFullYear(
      (H = e.year) != null ? H : O.getUTCFullYear(),
      (I = e.month) != null ? I : O.getUTCMonth(),
      (E = e.day) != null ? E : O.getUTCDate()
    ), $.setUTCHours(
      (R = e.hour) != null ? R : O.getUTCHours(),
      (P = e.minute) != null ? P : O.getUTCMinutes(),
      (W = e.second) != null ? W : O.getUTCSeconds(),
      (j = e.millisecond) != null ? j : O.getUTCMilliseconds()
    ), this.nativeDate = $, this;
  }
  const n = !D(t, "hour", "minute", "second", "millisecond"), u = n ? "later" : this.disambiguation, s = (x = this.nativeDate) != null ? x : new Date(0, 0), r = new Date(ut.getTime()), i = {
    year: (L = e.year) != null ? L : s.getFullYear(),
    month: (B = e.month) != null ? B : s.getMonth(),
    day: (z = e.day) != null ? z : s.getDate(),
    hour: (q = e.hour) != null ? q : n ? 0 : s.getHours(),
    minute: (Z = e.minute) != null ? Z : n ? 0 : s.getMinutes(),
    second: (Q = e.second) != null ? Q : n ? 0 : s.getSeconds(),
    millisecond: (G = e.millisecond) != null ? G : n ? 0 : s.getMilliseconds()
  };
  r.setFullYear(i.year, i.month, i.day), r.setHours(
    i.hour,
    i.minute,
    i.second,
    i.millisecond
  );
  const m = r.getTime(), y = new Date(m);
  y.setDate(r.getDate() + 1);
  const h = new Date(m);
  h.setDate(r.getDate() - 1);
  const f = y.getTimezoneOffset() - h.getTimezoneOffset();
  if (u === "compatible" || f === 0)
    return this.nativeDate = r, this;
  const g = i.year * 1e8 + i.month * 1e6 + i.day * 1e4 + i.hour * 100 + i.minute < r.getFullYear() * 1e8 + r.getMonth() * 1e6 + r.getDate() * 1e4 + r.getHours() * 100 + r.getMinutes(), b = new Date(
    new Date(m).setUTCMinutes(r.getUTCMinutes() + f)
  ), it = b.getHours() === r.getHours() && b.getMinutes() === r.getMinutes();
  if (!g && !it)
    return this.nativeDate = r, this;
  if (u === "reject")
    throw new RangeError(`Requested local time ${i} is ambiguous.`);
  return this.nativeDate = u === "later" ? r : b, this;
}
const Tt = new RegExp(
  // yyyy[[-|/]MM[[-|/]DD]]
  "^(\\d{4})(?:[-/]?([0-2]?\\d)(?:[-/]?([0-3]?\\d))?)?(?:[T\\s]([0-2]?\\d)(?::([0-5]?\\d)?(?::([0-6]?\\d)?(?:[.:](\\d{1,3})?\\d*)?)?)?)?(Z|[-+]\\d{2}:?\\d{2})?$"
);
function vt(t) {
  var h;
  const e = t.trim().toUpperCase(), n = e.match(Tt);
  if (!n)
    throw RangeError(
      `Failed to parse '${t}'. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  const u = n[4] !== void 0, [s, r, i, m] = [
    +n[1],
    +n[2] || 1,
    +n[3] || 1,
    n[8]
  ], y = new Date(e);
  if (!tt(y))
    throw RangeError(
      `Failed to parse '${t}' by Date. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  return m ? this.nativeDate = y : u ? this.set({
    year: s,
    month: r,
    day: i,
    hour: +n[4] || 0,
    minute: +n[5] || 0,
    second: +n[6] || 0,
    millisecond: +((h = n[7]) == null ? void 0 : h.padStart(3, "0")) || 0
  }) : this.set({ year: s, month: r, day: i }), this;
}
const p = (t, e) => String(t).padStart(e, "0");
o.prototype.toString = function() {
  if (this[c].localtime) {
    const t = this[c].nativeDate, e = -t.getTimezoneOffset(), n = Math.abs(e);
    return `${p(t.getFullYear(), 4)}-${p(t.getMonth() + 1, 2)}-${p(t.getDate(), 2)}T${p(t.getHours(), 2)}:${p(t.getMinutes(), 2)}:${p(t.getSeconds(), 2)}.${p(t.getMilliseconds(), 3)}${e >= 0 ? "+" : "-"}${p(Math.trunc(n / v), 2)}:${p(n % v, 2)}`;
  }
  return this[c].nativeDate.toISOString();
};
o.prototype.valueOf = function() {
  return this[c].nativeDate.valueOf();
};
o.prototype.clone = function(...t) {
  return new o(this, ...t);
};
o.prototype.context = function(t) {
  return w(t) ? this.clone(t) : {
    localtime: this[c].localtime,
    disambiguation: this[c].disambiguation
  };
};
o.prototype.nativeDate = function() {
  return new Date(this[c].nativeDate.getTime());
};
o.prototype.offset = function() {
  return this[c].localtime ? -this[c].nativeDate.getTimezoneOffset() : 0;
};
o.prototype.localtime = function(t) {
  return w(t) ? this.clone({ localtime: t }) : this[c].localtime;
};
o.prototype.disambiguation = function(t) {
  return w(t) ? this.clone({ disambiguation: t }) : this[c].disambiguation;
};
o.prototype.valid = function() {
  return this[c].valid();
};
o.prototype.numeric = function() {
  return this[c].nativeDate.getTime();
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
  return new a(this.clone(...t));
};
o.prototype.asUtc = function() {
  return this.clone({ localtime: !1 });
};
o.prototype.asLocaltime = function() {
  return this.clone({ localtime: !0 });
};
for (const [t, e, n] of [
  ["year", "FullYear", 0],
  ["month", "Month", 1],
  ["day", "Date", 0],
  ["hour", "Hours", 0],
  ["minute", "Minutes", 0],
  ["second", "Seconds", 0],
  ["millisecond", "Milliseconds", 0]
])
  o.prototype[t] = function(u) {
    return w(u) ? this.clone({ [t]: u }) : this[c].getNative(e) + n;
  };
o.prototype.dayOfWeek = function() {
  return 1 + (this[c].getNative("Day") - 1 + T) % T;
};
o.prototype.dayOfYear = function() {
  const t = this.toDate();
  return 1 + t - t.startOfYear();
};
o.prototype.weekOfYear = function() {
  const t = this.toDate(), e = t.day(t.day() - t.dayOfWeek() + M), n = e.startOfYear(), u = n.dayOfWeek() === M ? n : n.day(
    1 + (M - n.dayOfWeek() + T) % T
  );
  return 1 + Math.ceil((e - u) / T);
};
o.prototype.yearOfWeek = function() {
  const t = this.toDate();
  return t.day(t.day() - t.dayOfWeek() + M).year();
};
o.prototype.isLeapYear = function() {
  const t = this.year();
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
};
o.prototype.hasDstInYear = function() {
  if (!this[c].localtime)
    return !1;
  const t = this.offset();
  return [3, 6, 9, 12].map((e) => this.month(e).offset()).some((e) => e !== t);
};
o.prototype.isInDst = function() {
  if (!this[c].localtime)
    return !1;
  const t = Array.from(
    { length: 12 },
    (u, s) => this.month(s + 1).offset()
  ), e = Math.min(...t), n = Math.max(...t);
  return e !== n && this.offset() === n;
};
o.prototype.isDstTransitionDay = function() {
  return this[c].localtime ? this.minutesInDay() !== N : !1;
};
o.prototype.minutesInDay = function() {
  if (!this[c].localtime)
    return N;
  const t = this.context({ disambiguation: "later" }).startOfDay(), e = t.plus({ day: 1 }).startOfDay();
  return t.day() === e.day() ? N : (e - t) / ht;
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
  return t.dayOfWeek() === M || e.dayOfWeek() === et ? 53 : 52;
};
for (const [t, e] of [
  ["Year", { month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }],
  ["Month", { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }],
  ["Hour", { minute: 0, second: 0, millisecond: 0 }],
  ["Minute", { second: 0, millisecond: 0 }],
  ["Second", { millisecond: 0 }]
])
  o.prototype[`startOf${t}`] = function() {
    return this.clone(e);
  };
o.prototype.startOfDay = function() {
  const t = this.clone(
    { disambiguation: "later" },
    { hour: 0, minute: 0, second: 0, millisecond: 0 }
  ).numeric();
  return this.clone(t);
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
  return nt.call(this, 1, ...t);
};
o.prototype.minus = function(...t) {
  return nt.call(this, -1, ...t);
};
function nt(t, ...e) {
  var m, y;
  const n = e[0], u = e[1];
  if (Number.isFinite(n) && !Number.isFinite(u))
    return this.clone(this.numeric() + n);
  let s = null;
  if (S(n)) {
    if (!Y(n))
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    s = n;
  } else if (Number.isFinite(n) || Array.isArray(n)) {
    const h = e.flat(), f = h.filter((g) => Number.isSafeInteger(g));
    if (f.length !== h.length)
      throw RangeError("Should be safe integers");
    if (f.length > 7)
      throw RangeError("Too many numbers");
    s = {
      year: f[0],
      month: f[1],
      day: f[2],
      hour: f[3],
      minute: f[4],
      second: f[5],
      millisecond: f[6]
    };
  } else
    throw TypeError();
  const r = this.nativeDate(), i = this[c].localtime ? "" : "UTC";
  if (D(s, "year") || D(s, "month")) {
    const h = this.year() + t * ((m = s.year) != null ? m : 0), f = this.month() + t * ((y = s.month) != null ? y : 0), g = new Date(r.getTime());
    g[`set${i}FullYear`](h, f, 0);
    const b = g[`get${i}Date`]();
    b < this.day() ? r[`set${i}FullYear`](h, g[`get${i}Month`](), b) : r[`set${i}FullYear`](h, f - 1);
  }
  D(s, "day") && r[`set${i}Date`](r[`get${i}Date`]() + t * s.day);
  for (const [h, f] of [
    ["hour", "Hours"],
    ["minute", "Minutes"],
    ["second", "Seconds"],
    ["millisecond", "Milliseconds"]
  ])
    !D(s, h) || s[h] == null || r[`setUTC${f}`](
      r[`getUTC${f}`]() + t * s[h]
    );
  return this.clone(r);
}
const l = /* @__PURE__ */ Symbol();
function a(...t) {
  if (!new.target)
    return new a(...t);
  const e = { datetime: null };
  this[l] = e;
  let n = null;
  t[0] instanceof a ? n = t.shift().toDatetime() : t[0] instanceof o && (n = t.shift());
  const u = t[0], s = t[1];
  return Number.isFinite(u) && !Number.isFinite(s) && (t[0] = Math.floor(u) * U), n ? n = n.clone(...t) : n = C(...t), e.datetime = n.startOfDay(), this;
}
a.prototype.toString = function() {
  return this[l].datetime.toString().substring(0, 10);
};
a.prototype.valueOf = function() {
  return this[l].datetime / U;
};
a.prototype.valid = function() {
  return this[l].datetime.valid();
};
a.prototype.clone = function(...t) {
  return new a(this, ...t);
};
a.prototype.toDatetime = function() {
  return C(this[l].datetime.toArray());
};
a.prototype.numeric = function() {
  return this[l].datetime.numeric() / U;
};
a.prototype.toObject = function() {
  return {
    year: this.year(),
    month: this.month(),
    day: this.day()
  };
};
a.prototype.toArray = function() {
  return [this.year(), this.month(), this.day()];
};
a.prototype.startOfYear = function() {
  return new a(this[l].datetime.startOfYear());
};
a.prototype.startOfMonth = function() {
  return new a(this[l].datetime.startOfMonth());
};
a.prototype.startOfDay = function() {
  return this[l].datetime.clone();
};
for (const t of ["year", "month", "day"])
  a.prototype[t] = function(e) {
    return w(e) ? new a(this[l].datetime[t](e)) : this[l].datetime[t]();
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
  a.prototype[t] = function() {
    return this[l].datetime[t]();
  };
for (const t of ["minutesInDay", "hasDstInYear", "isDstTransitionDay"])
  a.prototype[t] = function() {
    return C(
      { disambiguation: "later" },
      this[l].datetime.toArray().slice(0, 3)
    )[t]();
  };
a.prototype.endOfYear = function() {
  return this.clone({ month: 12, day: 31 });
};
a.prototype.endOfMonth = function() {
  return this.clone({ day: this.daysInMonth() });
};
a.prototype.isSame = function(t) {
  return +this == +t;
};
a.prototype.isBefore = function(t) {
  return this < t;
};
a.prototype.isAfter = function(t) {
  return this > t;
};
a.prototype.isSameOrBefore = function(t) {
  return this <= t;
};
a.prototype.isSameOrAfter = function(t) {
  return this >= t;
};
a.prototype.isBetween = function(t, e) {
  return t <= this && this <= e || e <= this && this <= t;
};
a.prototype.plus = function(...t) {
  return ot.call(this, 1, ...t);
};
a.prototype.minus = function(...t) {
  return ot.call(this, -1, ...t);
};
function ot(t, ...e) {
  var i, m, y;
  const n = e[0], u = e[1], s = this[l].datetime;
  if (Number.isFinite(n) && !Number.isFinite(u))
    return s.plus({ day: t * n }).toDate();
  let r = null;
  if (S(n) && Y(n))
    r = {
      year: t * ((i = n.year) != null ? i : 0),
      month: t * ((m = n.month) != null ? m : 0),
      day: t * ((y = n.day) != null ? y : 0)
    };
  else if (Number.isFinite(n)) {
    if (e.length > 3)
      throw RangeError("Too many arguments");
    r = { year: t * n, month: t * u, day: t * arg2 };
  } else if (Array.isArray(n)) {
    if (n.length > 3)
      throw RangeError("Too many elements");
    r = {
      year: t * n[0],
      month: t * n[1],
      day: t * n[2]
    };
  } else
    throw TypeError();
  return s.plus(r).toDate();
}
export {
  C as qrono
};
//# sourceMappingURL=qrono.js.map
