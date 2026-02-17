var q = Object.defineProperty;
var R = Object.getOwnPropertySymbols;
var V = Object.prototype.hasOwnProperty, G = Object.prototype.propertyIsEnumerable;
var W = (t, e, n) => e in t ? q(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, A = (t, e) => {
  for (var n in e || (e = {}))
    V.call(e, n) && W(t, n, e[n]);
  if (R)
    for (var n of R(e))
      G.call(e, n) && W(t, n, e[n]);
  return t;
};
const J = new Date(1915, 0, 1, 12, 0, 0, 0), M = 7, j = 24, v = 60, N = v * j, k = 60, X = k * v, _ = X * j, x = 1e3, K = k * x, $ = _ * x, tt = 1, et = 2, L = 3, T = 4, nt = 5, it = 6, ot = 7;
function w(t, ...e) {
  return e.flat().some(t.hasOwnProperty, t);
}
function F(t) {
  return Object.entries(t).filter(([, e]) => !rt(e)).map(([e]) => e);
}
function m(t) {
  return t !== void 0;
}
function rt(t) {
  return t instanceof Function;
}
function st(t) {
  return typeof t == "string" || t instanceof String;
}
function Y(t) {
  return t !== null && typeof t == "object" && t.constructor === Object;
}
function B(t) {
  return !isNaN(t.getTime());
}
function b(t) {
  return w(t, [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
  ]);
}
function z(t, e) {
  const n = e.getTime(), c = new Date(n);
  if (t)
    return c;
  const a = new Date(n);
  a.setDate(e.getDate() + 1);
  const o = new Date(n);
  o.setDate(e.getDate() - 1);
  const u = a.getTimezoneOffset() - o.getTimezoneOffset();
  if (u === 0)
    return c;
  const y = new Date(n).setMinutes(e.getMinutes() + u), p = new Date(n).setUTCMinutes(
    e.getUTCMinutes() + u
  );
  return y === p || y === n ? c : new Date(p);
}
const E = i;
i.date = r;
const D = {
  localtime: !1,
  interpretAsDst: !0
};
F(D).forEach((t) => {
  i[t] = function(e) {
    return m(e) ? (D[t] = e, this) : D[t];
  };
});
i.context = function(t) {
  return m(t) ? (F(D).filter((e) => w(t, e)).forEach((e) => {
    D[e] = t[e];
  }), this) : A({}, D);
};
i.asUtc = function() {
  return D.localtime = !1, this;
};
i.asLocaltime = function() {
  return D.localtime = !0, this;
};
Object.assign(i, {
  monday: tt,
  tuesday: et,
  wednesday: L,
  thursday: T,
  friday: nt,
  saturday: it,
  sunday: ot
});
const s = /* @__PURE__ */ Symbol("Qrono.internal");
function i(...t) {
  var a;
  if (!new.target)
    return new i(...t);
  const e = this[s] = {
    // properties
    nativeDate: null,
    localtime: !1,
    interpretAsDst: !1,
    // methods
    set: ht,
    parse: lt,
    valid: at,
    context: ut,
    getNative: ct
  };
  if (e.context(D), t[0] instanceof i) {
    const o = t.shift();
    F(e).forEach((u) => {
      e[u] = o[u]();
    });
  }
  Y(t[0]) && !b(t[0]) && e.context(t.shift());
  const n = t[0], c = t[1];
  if (n == null)
    (a = e.nativeDate) != null || (e.nativeDate = /* @__PURE__ */ new Date());
  else if (n instanceof Date)
    e.nativeDate = new Date(n.getTime());
  else if (st(n))
    e.parse(n);
  else if (Y(n)) {
    if (!b(n))
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    e.set(n);
  } else if (Number.isFinite(n) && !Number.isFinite(c))
    e.nativeDate = new Date(n);
  else if (Number.isFinite(n) || Array.isArray(n)) {
    const o = t.flat().filter((u) => Number.isSafeInteger(u));
    if (o.length !== t.flat().length)
      throw RangeError("Should be safe integers");
    if (o.length > 7)
      throw RangeError("Too many numbers");
    e.set({
      year: o[0],
      month: o[1],
      day: o[2],
      hour: o[3],
      minute: o[4],
      second: o[5],
      millisecond: o[6]
    });
  } else
    throw TypeError(`Invalid argument ${t}`);
  return this;
}
function at() {
  return B(this.nativeDate);
}
function ut(t) {
  if (t)
    return F(D).filter((e) => w(t, e)).forEach((e) => {
      this[e] = t[e];
    }), this;
}
function ct(t) {
  return this.nativeDate[`get${this.localtime ? "" : "UTC"}${t}`]();
}
function ht(t) {
  var n, c, a, o, u, y, p, f, d, g, O, U, C, I, H, P;
  const e = A({}, t);
  if (e.month = e.month && e.month - 1, this.localtime) {
    const h = (n = this.nativeDate) != null ? n : new Date(0, 0), S = new Date(J.getTime());
    S.setFullYear(
      (c = e.year) != null ? c : h.getFullYear(),
      (a = e.month) != null ? a : h.getMonth(),
      (o = e.day) != null ? o : h.getDate()
    ), S.setHours(
      (u = e.hour) != null ? u : h.getHours(),
      (y = e.minute) != null ? y : h.getMinutes(),
      (p = e.second) != null ? p : h.getSeconds(),
      (f = e.millisecond) != null ? f : h.getMilliseconds()
    ), this.nativeDate = z(this.interpretAsDst, S);
  } else {
    const h = (d = this.nativeDate) != null ? d : /* @__PURE__ */ new Date(0), S = /* @__PURE__ */ new Date(0);
    S.setUTCFullYear(
      (g = e.year) != null ? g : h.getUTCFullYear(),
      (O = e.month) != null ? O : h.getUTCMonth(),
      (U = e.day) != null ? U : h.getUTCDate()
    ), S.setUTCHours(
      (C = e.hour) != null ? C : h.getUTCHours(),
      (I = e.minute) != null ? I : h.getUTCMinutes(),
      (H = e.second) != null ? H : h.getUTCSeconds(),
      (P = e.millisecond) != null ? P : h.getUTCMilliseconds()
    ), this.nativeDate = S;
  }
  return this;
}
const ft = new RegExp(
  // yyyy[[-|/]MM[[-|/]DD]]
  "^(\\d{4})(?:[-/]?([0-2]?\\d)(?:[-/]?([0-3]?\\d))?)?(?:[T\\s]([0-2]?\\d)(?::([0-5]?\\d)?(?::([0-6]?\\d)?(?:[.:](\\d{1,3})?\\d*)?)?)?)?(Z|[-+]\\d{2}:?\\d{2})?$"
);
function lt(t) {
  var O;
  const e = t.trim().toUpperCase(), n = e.match(ft);
  if (!n)
    throw RangeError(
      `Failed to parse '${t}'. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  const [c, a, o, u, y, p, f, d] = [
    +n[1],
    +n[2] || 1,
    +n[3] || 1,
    +n[4] || 0,
    +n[5] || 0,
    +n[6] || 0,
    +((O = n[7]) == null ? void 0 : O.padStart(3, "0")) || 0,
    n[8]
  ], g = new Date(e);
  if (!B(g))
    throw RangeError(
      `Failed to parse '${t}' by Date. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  return d ? this.nativeDate = g : this.set({ year: c, month: a, day: o, hour: u, minute: y, second: p, millisecond: f }), this;
}
i.prototype.toString = function() {
  if (this[s].localtime) {
    const t = this[s].nativeDate, e = -t.getTimezoneOffset(), n = Math.abs(e);
    return `${String(t.getFullYear()).padStart(4, "0")}-${String(
      t.getMonth() + 1
    ).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(
      t.getHours()
    ).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(
      t.getSeconds()
    ).padStart(2, "0")}.${String(t.getMilliseconds()).padStart(3, "0")}${(e >= 0 ? "+" : "-") + String(Math.trunc(n / v)).padStart(2, "0") + ":" + String(n % v).padStart(2, "0")}`;
  }
  return this[s].nativeDate.toISOString();
};
i.prototype.valueOf = function() {
  return this[s].nativeDate.valueOf();
};
i.prototype.clone = function(...t) {
  return new i(this, ...t);
};
i.prototype.context = function(t) {
  return m(t) ? this.clone(t) : {
    localtime: this[s].localtime,
    interpretAsDst: this[s].interpretAsDst
  };
};
i.prototype.nativeDate = function() {
  return new Date(this[s].nativeDate.getTime());
};
i.prototype.offset = function() {
  return this[s].localtime ? -this[s].nativeDate.getTimezoneOffset() : 0;
};
i.prototype.localtime = function(t) {
  return m(t) ? this.clone({ localtime: t }) : this[s].localtime;
};
i.prototype.interpretAsDst = function(t) {
  return m(t) ? this.clone({ interpretAsDst: t }) : this[s].interpretAsDst;
};
i.prototype.valid = function() {
  return this[s].valid();
};
i.prototype.numeric = function() {
  return this[s].nativeDate.getTime();
};
i.prototype.toObject = function() {
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
i.prototype.toArray = function() {
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
i.prototype.toDate = function(...t) {
  return new r(this.clone(...t));
};
i.prototype.asUtc = function() {
  return this.clone({ localtime: !1 });
};
i.prototype.asLocaltime = function() {
  return this.clone({ localtime: !0 });
};
i.prototype.year = function(t) {
  return m(t) ? this.clone({ year: t }) : this[s].getNative("FullYear");
};
i.prototype.month = function(t) {
  return m(t) ? this.clone({ month: t }) : this[s].getNative("Month") + 1;
};
i.prototype.day = function(t) {
  return m(t) ? this.clone({ day: t }) : this[s].getNative("Date");
};
i.prototype.hour = function(t) {
  return m(t) ? this.clone({ hour: t }) : this[s].getNative("Hours");
};
i.prototype.minute = function(t) {
  return m(t) ? this.clone({ minute: t }) : this[s].getNative("Minutes");
};
i.prototype.second = function(t) {
  return m(t) ? this.clone({ second: t }) : this[s].getNative("Seconds");
};
i.prototype.millisecond = function(t) {
  return m(t) ? this.clone({ millisecond: t }) : this[s].getNative("Milliseconds");
};
i.prototype.dayOfWeek = function() {
  return 1 + (this[s].getNative("Day") - 1 + M) % M;
};
i.prototype.dayOfYear = function() {
  const t = this.toDate();
  return 1 + t - t.startOfYear();
};
i.prototype.weekOfYear = function() {
  const t = this.toDate(), e = t.day(t.day() - t.dayOfWeek() + T), n = e.startOfYear(), c = n.dayOfWeek() === T ? n : n.day(
    1 + (T - n.dayOfWeek() + M) % M
  );
  return 1 + Math.ceil((e - c) / M);
};
i.prototype.yearOfWeek = function() {
  const t = this.toDate();
  return t.day(t.day() - t.dayOfWeek() + T).year();
};
i.prototype.isLeapYear = function() {
  const t = this.year();
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
};
i.prototype.hasDstInYear = function() {
  if (!this[s].localtime)
    return !1;
  const t = this.offset();
  return [3, 6, 9, 12].map((e) => this.month(e).offset()).some((e) => e !== t);
};
i.prototype.isInDst = function() {
  return this[s].localtime ? this.offset() === Math.max(...[3, 6, 9, 12].map((t) => this.month(t).offset())) : !1;
};
i.prototype.isDstTransitionDay = function() {
  return this[s].localtime ? this.minutesInDay() !== N : !1;
};
i.prototype.minutesInDay = function() {
  if (!this[s].localtime)
    return N;
  const t = this.context({ interpretAsDst: !0 }).startOfDay(), e = t.plus({ day: 1 }).startOfDay();
  return t.day() === e.day() ? N : (e - t) / K;
};
i.prototype.daysInMonth = function() {
  const t = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], e = this.month();
  return t[e - 1] + (this.isLeapYear() && e === 2 ? 1 : 0);
};
i.prototype.daysInYear = function() {
  return this.isLeapYear() ? 366 : 365;
};
i.prototype.weeksInYear = function() {
  const t = this.toDate({ month: 12, day: 31 }), e = t.minus({ year: 1 });
  return t.dayOfWeek() === T || e.dayOfWeek() === L ? 53 : 52;
};
i.prototype.startOfYear = function() {
  return this.clone({
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
i.prototype.startOfMonth = function() {
  return this.clone({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
};
i.prototype.startOfDay = function() {
  return this.clone({ hour: 0, minute: 0, second: 0, millisecond: 0 });
};
i.prototype.startOfHour = function() {
  return this.clone({ minute: 0, second: 0, millisecond: 0 });
};
i.prototype.startOfMinute = function() {
  return this.clone({ second: 0, millisecond: 0 });
};
i.prototype.startOfSecond = function() {
  return this.clone({ millisecond: 0 });
};
i.prototype.isSame = function(t) {
  return +this == +t;
};
i.prototype.isBefore = function(t) {
  return this < t;
};
i.prototype.isAfter = function(t) {
  return this > t;
};
i.prototype.isSameOrBefore = function(t) {
  return this <= t;
};
i.prototype.isSameOrAfter = function(t) {
  return this >= t;
};
i.prototype.isBetween = function(t, e) {
  return t <= this && this <= e || e <= this && this <= t;
};
i.prototype.plus = function(...t) {
  return Q.call(this, 1, ...t);
};
i.prototype.minus = function(...t) {
  return Q.call(this, -1, ...t);
};
function Q(t, ...e) {
  var y, p;
  const n = e[0], c = e[1];
  if (Number.isFinite(n) && !Number.isFinite(c))
    return this.clone(this.numeric() + n);
  let a = null;
  if (Y(n)) {
    if (!b(n))
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    a = n;
  } else if (Number.isFinite(n) || Array.isArray(n)) {
    const f = e.flat().filter((d) => Number.isSafeInteger(d));
    if (f.length !== e.flat().length)
      throw RangeError("Should be safe integers");
    if (f.length > 7)
      throw RangeError("Too many numbers");
    a = {
      year: e[0],
      month: e[1],
      day: e[2],
      hour: e[3],
      minute: e[4],
      second: e[5],
      millisecond: e[6]
    };
  } else
    throw TypeError();
  const o = this.nativeDate(), u = this[s].localtime ? "" : "UTC";
  if (w(a, "year") || w(a, "month")) {
    const f = this.year() + t * ((y = a.year) != null ? y : 0), d = this.month() + t * ((p = a.month) != null ? p : 0), g = new Date(o.getTime());
    g[`set${u}FullYear`](f, d, 0);
    const O = g[`get${u}Date`]();
    O < this.day() ? o[`set${u}FullYear`](f, g[`get${u}Month`](), O) : o[`set${u}FullYear`](f, d - 1);
  }
  return w(a, "day") && o[`set${u}Date`](o[`get${u}Date`]() + t * a.day), [
    ["hour", "Hours"],
    ["minute", "Minutes"],
    ["second", "Seconds"],
    ["millisecond", "Milliseconds"]
  ].forEach(([f, d]) => {
    w(a, f) && o[`setUTC${d}`](
      o[`getUTC${d}`]() + t * a[f]
    );
  }), this.clone(z(this[s].interpretAsDst, o));
}
const l = /* @__PURE__ */ Symbol("QronoDate.internal");
function r(...t) {
  if (!new.target)
    return new r(...t);
  const e = this[l] = {
    datetime: null
  };
  let n = null;
  t[0] instanceof r && (n = t.shift().toDatetime());
  const c = t[0], a = t[1];
  return Number.isFinite(c) && !Number.isFinite(a) && (t[0] = Math.floor(c) * $), n = n ? n.clone(...t) : E(...t), e.datetime = n.startOfDay(), this;
}
r.prototype.toString = function() {
  return this[l].datetime.toString().substring(0, 10);
};
r.prototype.valueOf = function() {
  return this[l].datetime / $;
};
r.prototype.valid = function() {
  return this[l].datetime.valid();
};
r.prototype.clone = function(...t) {
  return new r(this, ...t);
};
r.prototype.toDatetime = function() {
  return E(this[l].datetime.toArray());
};
r.prototype.numeric = function() {
  return this[l].datetime.numeric() / $;
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
["year", "month", "day"].forEach((t) => {
  r.prototype[t] = function(e) {
    return m(e) ? new r(this[l].datetime[t](e)) : this[l].datetime[t]();
  };
});
[
  "dayOfWeek",
  "dayOfYear",
  "weekOfYear",
  "yearOfWeek",
  "isLeapYear",
  "daysInMonth",
  "daysInYear",
  "weeksInYear"
].forEach((t) => {
  r.prototype[t] = function() {
    return this[l].datetime[t]();
  };
});
["minutesInDay", "hasDstInYear", "isDstTransitionDay"].forEach((t) => {
  r.prototype[t] = function() {
    return E(
      { interpretAsDst: !0 },
      this[l].datetime.toArray().slice(0, 3)
    )[t]();
  };
});
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
  return Z.call(this, 1, ...t);
};
r.prototype.minus = function(...t) {
  return Z.call(this, -1, ...t);
};
function Z(t, ...e) {
  var u, y, p;
  const n = e[0], c = e[1], a = this[l].datetime;
  if (Number.isFinite(n) && !Number.isFinite(c))
    return a.plus({ day: t * n }).toDate();
  let o = null;
  if (Y(n) && b(n))
    o = {
      year: t * ((u = n.year) != null ? u : 0),
      month: t * ((y = n.month) != null ? y : 0),
      day: t * ((p = n.day) != null ? p : 0)
    };
  else if (Number.isFinite(n)) {
    if (e.length > 3)
      throw RangeError("Too many arguments");
    o = { year: e[0], month: e[1], day: e[2] };
  } else if (Array.isArray(n)) {
    if (n.length > 3)
      throw RangeError("Too many elements");
    o = { year: n[0], month: n[1], day: n[2] };
  } else
    throw TypeError();
  return a.plus(o).toDate();
}
export {
  nt as friday,
  tt as monday,
  E as qrono,
  it as saturday,
  ot as sunday,
  T as thursday,
  et as tuesday,
  L as wednesday
};
//# sourceMappingURL=qrono.js.map
