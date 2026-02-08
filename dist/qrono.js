var q = Object.defineProperty;
var W = Object.getOwnPropertySymbols;
var V = Object.prototype.hasOwnProperty, G = Object.prototype.propertyIsEnumerable;
var k = (t, e, n) => e in t ? q(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Y = (t, e) => {
  for (var n in e || (e = {}))
    V.call(e, n) && k(t, n, e[n]);
  if (W)
    for (var n of W(e))
      G.call(e, n) && k(t, n, e[n]);
  return t;
};
const J = new Date(1915, 0, 1, 12, 0, 0, 0), T = 7, R = 24, b = 60, F = b * R, L = 60, X = L * b, _ = X * R, x = 1e3, B = L * x, A = _ * x, K = 1, tt = 2, z = 3, M = 4, et = 5, nt = 6, it = 7;
function w(t, ...e) {
  return e.flat().some(t.hasOwnProperty, t);
}
function v(t) {
  return Object.entries(t).filter(([, e]) => !ot(e)).map(([e]) => e);
}
function y(t) {
  return t !== void 0;
}
function ot(t) {
  return t instanceof Function;
}
function rt(t) {
  return typeof t == "string" || t instanceof String;
}
function $(t) {
  return t !== null && typeof t == "object" && t.constructor === Object;
}
function Q(t) {
  return !isNaN(t.getTime());
}
function N(t) {
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
function C(t, e) {
  const n = e.getTime(), c = new Date(n), a = new Date(n), r = t ? 1 : -1;
  a.setDate(e.getDate() + r);
  const u = a.getTimezoneOffset() - e.getTimezoneOffset();
  if (t && u < 0 || !t && u > 0) {
    const d = new Date(n).setMinutes(
      e.getMinutes() + r * u
    ), p = new Date(n).setUTCMinutes(
      e.getUTCMinutes() + r * u
    );
    d !== p && (d - p) / B !== u && c.setUTCMinutes(e.getUTCMinutes() + r * u);
  }
  return c;
}
const U = i;
i.date = o;
const g = {
  localtime: !1,
  ambiguousAsDst: !1
};
v(g).forEach((t) => {
  i[t] = function(e) {
    return y(e) ? (g[t] = e, this) : g[t];
  };
});
i.context = function(t) {
  return y(t) ? (v(g).filter((e) => w(t, e)).forEach((e) => {
    g[e] = t[e];
  }), this) : Y({}, g);
};
i.asUtc = function() {
  return g.localtime = !1, this;
};
i.asLocaltime = function() {
  return g.localtime = !0, this;
};
Object.assign(i, {
  monday: K,
  tuesday: tt,
  wednesday: z,
  thursday: M,
  friday: et,
  saturday: nt,
  sunday: it
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
    ambiguousAsDst: !1,
    // methods
    set: ct,
    parse: ht,
    valid: st,
    context: at,
    getNative: ut
  };
  if (e.context(g), t[0] instanceof i) {
    const r = t.shift();
    v(e).forEach((u) => {
      e[u] = r[u]();
    });
  }
  $(t[0]) && !N(t[0]) && e.context(t.shift());
  const n = t[0], c = t[1];
  if (n == null)
    (a = e.nativeDate) != null || (e.nativeDate = /* @__PURE__ */ new Date());
  else if (n instanceof Date)
    e.nativeDate = new Date(n.getTime());
  else if (rt(n))
    e.parse(n);
  else if ($(n)) {
    if (!N(n))
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    e.set(n);
  } else if (Number.isFinite(n) && !Number.isFinite(c))
    e.nativeDate = new Date(n);
  else if (Number.isFinite(n) || Array.isArray(n)) {
    const r = t.flat().filter((u) => Number.isSafeInteger(u));
    if (r.length !== t.flat().length)
      throw RangeError("Should be safe integers");
    if (r.length > 7)
      throw RangeError("Too many numbers");
    e.set({
      year: r[0],
      month: r[1],
      day: r[2],
      hour: r[3],
      minute: r[4],
      second: r[5],
      millisecond: r[6]
    });
  } else
    throw TypeError(`Invalid argument ${t}`);
  return this;
}
function st() {
  return Q(this.nativeDate);
}
function at(t) {
  if (t)
    return v(g).filter((e) => w(t, e)).forEach((e) => {
      this[e] = t[e];
    }), this;
}
function ut(t) {
  return this.nativeDate[`get${this.localtime ? "" : "UTC"}${t}`]();
}
function ct(t) {
  var n, c, a, r, u, d, p, l, m, D, O, E, I, H, P, j;
  const e = Y({}, t);
  if (e.month = e.month && e.month - 1, this.localtime) {
    const f = (n = this.nativeDate) != null ? n : new Date(0, 0), S = new Date(J.getTime());
    S.setFullYear(
      (c = e.year) != null ? c : f.getFullYear(),
      (a = e.month) != null ? a : f.getMonth(),
      (r = e.day) != null ? r : f.getDate()
    ), S.setHours(
      (u = e.hour) != null ? u : f.getHours(),
      (d = e.minute) != null ? d : f.getMinutes(),
      (p = e.second) != null ? p : f.getSeconds(),
      (l = e.millisecond) != null ? l : f.getMilliseconds()
    ), this.nativeDate = C(this.ambiguousAsDst, S);
  } else {
    const f = (m = this.nativeDate) != null ? m : /* @__PURE__ */ new Date(0), S = /* @__PURE__ */ new Date(0);
    S.setUTCFullYear(
      (D = e.year) != null ? D : f.getUTCFullYear(),
      (O = e.month) != null ? O : f.getUTCMonth(),
      (E = e.day) != null ? E : f.getUTCDate()
    ), S.setUTCHours(
      (I = e.hour) != null ? I : f.getUTCHours(),
      (H = e.minute) != null ? H : f.getUTCMinutes(),
      (P = e.second) != null ? P : f.getUTCSeconds(),
      (j = e.millisecond) != null ? j : f.getUTCMilliseconds()
    ), this.nativeDate = S;
  }
  return this;
}
const ft = new RegExp(
  // yyyy[[-|/]MM[[-|/]DD]]
  "^(\\d{4})(?:[-/]?([0-2]?\\d)(?:[-/]?([0-3]?\\d))?)?(?:[T\\s]([0-2]?\\d)(?::([0-5]?\\d)?(?::([0-6]?\\d)?(?:[.:](\\d{1,3})?\\d*)?)?)?)?(Z|[-+]\\d{2}:?\\d{2})?$"
);
function ht(t) {
  var O;
  const e = t.trim().toUpperCase(), n = e.match(ft);
  if (!n)
    throw RangeError(
      `Failed to parse '${t}'. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  const [c, a, r, u, d, p, l, m] = [
    +n[1],
    +n[2] || 1,
    +n[3] || 1,
    +n[4] || 0,
    +n[5] || 0,
    +n[6] || 0,
    +((O = n[7]) == null ? void 0 : O.padStart(3, "0")) || 0,
    n[8]
  ], D = new Date(e);
  if (!Q(D))
    throw RangeError(
      `Failed to parse '${t}' by Date. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  return m ? this.nativeDate = D : this.localtime ? this.nativeDate = C(this.ambiguousAsDst, D) : this.set({ year: c, month: a, day: r, hour: u, minute: d, second: p, millisecond: l }), this;
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
    ).padStart(2, "0")}.${String(t.getMilliseconds()).padStart(3, "0")}${(e >= 0 ? "+" : "-") + String(Math.trunc(n / b)).padStart(2, "0") + ":" + String(n % b).padStart(2, "0")}`;
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
  return y(t) ? this.clone(t) : {
    localtime: this[s].localtime,
    ambiguousAsDst: this[s].ambiguousAsDst
  };
};
i.prototype.nativeDate = function() {
  return new Date(this[s].nativeDate.getTime());
};
i.prototype.offset = function() {
  return this[s].localtime ? -this[s].nativeDate.getTimezoneOffset() : 0;
};
i.prototype.localtime = function(t) {
  return y(t) ? this.clone({ localtime: t }) : this[s].localtime;
};
i.prototype.ambiguousAsDst = function(t) {
  return y(t) ? this.clone({ ambiguousAsDst: t }) : this[s].ambiguousAsDst;
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
  return new o(this.clone(...t));
};
i.prototype.asUtc = function() {
  return this.clone({ localtime: !1 });
};
i.prototype.asLocaltime = function() {
  return this.clone({ localtime: !0 });
};
i.prototype.year = function(t) {
  return y(t) ? this.clone({ year: t }) : this[s].getNative("FullYear");
};
i.prototype.month = function(t) {
  return y(t) ? this.clone({ month: t }) : this[s].getNative("Month") + 1;
};
i.prototype.day = function(t) {
  return y(t) ? this.clone({ day: t }) : this[s].getNative("Date");
};
i.prototype.hour = function(t) {
  return y(t) ? this.clone({ hour: t }) : this[s].getNative("Hours");
};
i.prototype.minute = function(t) {
  return y(t) ? this.clone({ minute: t }) : this[s].getNative("Minutes");
};
i.prototype.second = function(t) {
  return y(t) ? this.clone({ second: t }) : this[s].getNative("Seconds");
};
i.prototype.millisecond = function(t) {
  return y(t) ? this.clone({ millisecond: t }) : this[s].getNative("Milliseconds");
};
i.prototype.dayOfWeek = function() {
  return 1 + (this[s].getNative("Day") - 1 + T) % T;
};
i.prototype.dayOfYear = function() {
  const t = this.toDate();
  return 1 + t - t.startOfYear();
};
i.prototype.weekOfYear = function() {
  const t = this.toDate(), e = t.day(t.day() - t.dayOfWeek() + M), n = e.startOfYear(), c = n.dayOfWeek() === M ? n : n.day(
    1 + (M - n.dayOfWeek() + T) % T
  );
  return 1 + Math.ceil((e - c) / T);
};
i.prototype.yearOfWeek = function() {
  const t = this.toDate();
  return t.day(t.day() - t.dayOfWeek() + M).year();
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
  return this[s].localtime ? this.minutesInDay() !== F : !1;
};
i.prototype.minutesInDay = function() {
  if (!this[s].localtime)
    return F;
  const t = this.startOfDay(), e = t.plus({ day: 1 }).startOfDay();
  return t.day() === e.day() ? F : (e - t) / B;
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
  return t.dayOfWeek() === M || e.dayOfWeek() === z ? 53 : 52;
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
  return this.clone({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
i.prototype.startOfDay = function() {
  return this.clone({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
i.prototype.startOfHour = function() {
  return this.clone({
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
i.prototype.startOfMinute = function() {
  return this.clone({
    second: 0,
    millisecond: 0
  });
};
i.prototype.startOfSecond = function() {
  return this.clone({
    millisecond: 0
  });
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
  return Z.call(this, 1, ...t);
};
i.prototype.minus = function(...t) {
  return Z.call(this, -1, ...t);
};
function Z(t, ...e) {
  var d, p;
  const n = e[0], c = e[1];
  if (Number.isFinite(n) && !Number.isFinite(c))
    return this.clone(this.numeric() + n);
  let a = null;
  if ($(n)) {
    if (!N(n))
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    a = n;
  } else if (Number.isFinite(n) || Array.isArray(n)) {
    const l = e.flat().filter((m) => Number.isSafeInteger(m));
    if (l.length !== e.flat().length)
      throw RangeError("Should be safe integers");
    if (l.length > 7)
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
  const r = this.nativeDate(), u = this[s].localtime ? "" : "UTC";
  if (w(a, "year") || w(a, "month")) {
    const l = this.year() + t * ((d = a.year) != null ? d : 0), m = this.month() + t * ((p = a.month) != null ? p : 0), D = new Date(r.getTime());
    D[`set${u}FullYear`](l, m, 0);
    const O = D.getDate();
    O < this.day() ? r[`set${u}FullYear`](l, D[`get${u}Month`](), O) : r[`set${u}FullYear`](l, m - 1);
  }
  return w(a, "day") && r[`set${u}Date`](r[`get${u}Date`]() + t * a.day), [
    ["hour", "Hours"],
    ["minute", "Minutes"],
    ["second", "Seconds"],
    ["millisecond", "Milliseconds"]
  ].forEach(([l, m]) => {
    w(a, l) && r[`setUTC${m}`](
      r[`getUTC${m}`]() + t * a[l]
    );
  }), this.clone(C(this[s].ambiguousAsDst, r));
}
const h = /* @__PURE__ */ Symbol("QronoDate.internal");
function o(...t) {
  if (!new.target)
    return new o(...t);
  const e = this[h] = {
    datetime: null
  };
  let n = null;
  t[0] instanceof o && (n = t.shift().toDatetime());
  const c = t[0], a = t[1];
  return Number.isFinite(c) && !Number.isFinite(a) && (t[0] *= A), n = (n ? n.clone(...t) : U(...t)).startOfDay(), e.datetime = U({ localtime: !1 }, n.toObject()), this;
}
o.prototype.toString = function() {
  return this[h].datetime.toString().substring(0, 10);
};
o.prototype.valueOf = function() {
  return this[h].datetime / A;
};
o.prototype.valid = function() {
  return this[h].datetime.valid();
};
o.prototype.clone = function(...t) {
  return new o(this, ...t);
};
o.prototype.toDatetime = function() {
  return U(this[h].datetime.toArray());
};
o.prototype.numeric = function() {
  return this[h].datetime.numeric() / A;
};
o.prototype.toObject = function() {
  return {
    year: this.year(),
    month: this.month(),
    day: this.day()
  };
};
o.prototype.toArray = function() {
  return [this.year(), this.month(), this.day()];
};
o.prototype.startOfYear = function() {
  return new o(this[h].datetime.startOfYear());
};
o.prototype.startOfMonth = function() {
  return new o(this[h].datetime.startOfMonth());
};
o.prototype.startOfDay = function() {
  return this[h].datetime.clone();
};
["year", "month", "day"].forEach((t) => {
  o.prototype[t] = function(e) {
    return y(e) ? new o(this[h].datetime[t](e)) : this[h].datetime[t]();
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
  o.prototype[t] = function() {
    return this[h].datetime[t]();
  };
});
["minutesInDay", "hasDstInYear", "isDstTransitionDay"].forEach((t) => {
  o.prototype[t] = function() {
    return this[h].datetime.localtime(!0)[t]();
  };
});
o.prototype.endOfYear = function() {
  return this.clone({ month: 12, day: 31 });
};
o.prototype.endOfMonth = function() {
  return this.clone({ day: this.daysInMonth() });
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
  return this[h].datetime.plus(...t).toDate();
};
o.prototype.minus = function(...t) {
  return this[h].datetime.minus(...t).toDate();
};
export {
  et as friday,
  K as monday,
  U as qrono,
  nt as saturday,
  it as sunday,
  M as thursday,
  tt as tuesday,
  z as wednesday
};
//# sourceMappingURL=qrono.js.map
