var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/helpers.js
var initialSafeDate = new Date(1915, 0, 1, 12, 0, 0, 0);
var daysPerWeek = 7;
var hoursPerDay = 24;
var hoursPerWeek = hoursPerDay * daysPerWeek;
var minutesPerHour = 60;
var minutesPerDay = minutesPerHour * hoursPerDay;
var minutesPerWeek = minutesPerDay * daysPerWeek;
var secondsPerMinute = 60;
var secondsPerHour = secondsPerMinute * minutesPerHour;
var secondsPerDay = secondsPerHour * hoursPerDay;
var secondsPerWeek = secondsPerDay * daysPerWeek;
var millisecondsPerSecond = 1e3;
var millisecondsPerMinute = secondsPerMinute * millisecondsPerSecond;
var millisecondsPerHour = secondsPerHour * millisecondsPerSecond;
var millisecondsPerDay = secondsPerDay * millisecondsPerSecond;
var millisecondsPerWeek = secondsPerWeek * millisecondsPerSecond;
var monday = 1;
var tuesday = 2;
var wednesday = 3;
var thursday = 4;
var friday = 5;
var saturday = 6;
var sunday = 7;
function has(object, ...keys) {
  return keys.flat().some(object.hasOwnProperty, object);
}
function fields(object) {
  return Object.entries(object).filter(
    ([, value]) => !isFunction(value)
  ).map(([key]) => key);
}
function given(arg) {
  return arg !== void 0;
}
function isFunction(a) {
  return a instanceof Function;
}
function isString(a) {
  return typeof a === "string" || a instanceof String;
}
function isObject(a) {
  return a !== null && typeof a === "object" && a.constructor === Object;
}
function isValidDate(date) {
  return !isNaN(date.getTime());
}
function hasDatetimeField(object) {
  return has(object, [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
  ]);
}
function asDst(ambiguousAsDst, date) {
  const numeric = date.getTime();
  const result = new Date(numeric);
  const adjacentDay = new Date(numeric);
  const sign = ambiguousAsDst ? 1 : -1;
  adjacentDay.setDate(date.getDate() + sign);
  const adjust = adjacentDay.getTimezoneOffset() - date.getTimezoneOffset();
  if (ambiguousAsDst && adjust < 0 || !ambiguousAsDst && adjust > 0) {
    const adjusted = new Date(numeric).setMinutes(date.getMinutes() + sign * adjust);
    const adjustedUTC = new Date(numeric).setUTCMinutes(date.getUTCMinutes() + sign * adjust);
    if (adjusted !== adjustedUTC && (adjusted - adjustedUTC) / millisecondsPerMinute !== adjust) {
      result.setUTCMinutes(date.getUTCMinutes() + sign * adjust);
    }
  }
  return result;
}

// src/qrono.js
var qrono = Qrono;
Qrono.date = QronoDate;
var defaultContext = {
  localtime: false,
  ambiguousAsDst: false
};
fields(defaultContext).forEach((key) => {
  Qrono[key] = function(arg) {
    if (given(arg)) {
      defaultContext[key] = arg;
      return this;
    }
    return defaultContext[key];
  };
});
Qrono.context = function(context2) {
  if (given(context2)) {
    fields(defaultContext).filter((key) => has(context2, key)).forEach((key) => {
      defaultContext[key] = context2[key];
    });
    return this;
  }
  return __spreadValues({}, defaultContext);
};
Qrono.asUtc = function() {
  defaultContext.localtime = false;
  return this;
};
Qrono.asLocaltime = function() {
  defaultContext.localtime = true;
  return this;
};
Object.assign(
  Qrono,
  { monday, tuesday, wednesday, thursday, friday, saturday, sunday }
);
var internal = Symbol("Qrono.internal");
function Qrono(...args) {
  var _a;
  if (!new.target) {
    return new Qrono(...args);
  }
  const self = this[internal] = {
    // properties
    nativeDate: null,
    localtime: false,
    ambiguousAsDst: false,
    // methods
    set,
    parse,
    valid,
    context,
    getNative
  };
  self.context(defaultContext);
  if (args[0] instanceof Qrono) {
    const source = args.shift();
    fields(self).forEach((key) => {
      self[key] = source[key]();
    });
  }
  if (isObject(args[0]) && !hasDatetimeField(args[0])) {
    self.context(args.shift());
  }
  const first = args[0];
  const second = args[1];
  if (first == null) {
    (_a = self.nativeDate) != null ? _a : self.nativeDate = /* @__PURE__ */ new Date();
  } else if (first instanceof Date) {
    self.nativeDate = new Date(first.getTime());
  } else if (isString(first)) {
    self.parse(first);
  } else if (isObject(first)) {
    if (!hasDatetimeField(first)) {
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    }
    self.set(first);
  } else if (Number.isFinite(first) && !Number.isFinite(second)) {
    self.nativeDate = new Date(first);
  } else if (Number.isFinite(first) || Array.isArray(first)) {
    const values = args.flat().filter((v) => Number.isSafeInteger(v));
    if (values.length !== args.flat().length) {
      throw RangeError("Should be safe integers");
    }
    if (values.length > 7) {
      throw RangeError("Too many numbers");
    }
    self.set({
      year: values[0],
      month: values[1],
      day: values[2],
      hour: values[3],
      minute: values[4],
      second: values[5],
      millisecond: values[6]
    });
  } else {
    throw TypeError(`Invalid argument ${args}`);
  }
  return this;
}
function valid() {
  return isValidDate(this.nativeDate);
}
function context(context2) {
  if (!context2) {
    return;
  }
  fields(defaultContext).filter((key) => has(context2, key)).forEach((key) => {
    this[key] = context2[key];
  });
  return this;
}
function getNative(name) {
  return this.nativeDate[`get${this.localtime ? "" : "UTC"}${name}`]();
}
function set(values) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  const args = __spreadValues({}, values);
  args.month = args.month && args.month - 1;
  if (this.localtime) {
    const baseDate = (_a = this.nativeDate) != null ? _a : new Date(0, 0);
    const newDate = new Date(initialSafeDate.getTime());
    newDate.setFullYear(
      (_b = args.year) != null ? _b : baseDate.getFullYear(),
      (_c = args.month) != null ? _c : baseDate.getMonth(),
      (_d = args.day) != null ? _d : baseDate.getDate()
    );
    newDate.setHours(
      (_e = args.hour) != null ? _e : baseDate.getHours(),
      (_f = args.minute) != null ? _f : baseDate.getMinutes(),
      (_g = args.second) != null ? _g : baseDate.getSeconds(),
      (_h = args.millisecond) != null ? _h : baseDate.getMilliseconds()
    );
    this.nativeDate = asDst(this.ambiguousAsDst, newDate);
  } else {
    const baseDate = (_i = this.nativeDate) != null ? _i : /* @__PURE__ */ new Date(0);
    const newDate = /* @__PURE__ */ new Date(0);
    newDate.setUTCFullYear(
      (_j = args.year) != null ? _j : baseDate.getUTCFullYear(),
      (_k = args.month) != null ? _k : baseDate.getUTCMonth(),
      (_l = args.day) != null ? _l : baseDate.getUTCDate()
    );
    newDate.setUTCHours(
      (_m = args.hour) != null ? _m : baseDate.getUTCHours(),
      (_n = args.minute) != null ? _n : baseDate.getUTCMinutes(),
      (_o = args.second) != null ? _o : baseDate.getUTCSeconds(),
      (_p = args.millisecond) != null ? _p : baseDate.getUTCMilliseconds()
    );
    this.nativeDate = newDate;
  }
  return this;
}
var parsePattern = new RegExp(
  // yyyy[[-|/]MM[[-|/]DD]]
  "^(\\d{4})(?:[-/]?([0-2]?\\d)(?:[-/]?([0-3]?\\d))?)?(?:[T\\s]([0-2]?\\d)(?::([0-5]?\\d)?(?::([0-6]?\\d)?(?:[.:](\\d{1,3})?\\d*)?)?)?)?(Z|[-+]\\d{2}:?\\d{2})?$"
);
function parse(str) {
  var _a;
  const text = str.trim().toUpperCase();
  const values = text.match(parsePattern);
  if (!values) {
    throw RangeError(
      `Failed to parse '${str}'. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  }
  const [year, month, day, hour, minute, second, millisecond, offset] = [
    +values[1],
    +values[2] || 1,
    +values[3] || 1,
    +values[4] || 0,
    +values[5] || 0,
    +values[6] || 0,
    +((_a = values[7]) == null ? void 0 : _a.padStart(3, "0")) || 0,
    values[8]
  ];
  const native = new Date(text);
  if (!isValidDate(native)) {
    throw RangeError(
      `Failed to parse '${str}' by Date. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`
    );
  }
  if (offset) {
    this.nativeDate = native;
  } else if (this.localtime) {
    this.nativeDate = asDst(this.ambiguousAsDst, native);
  } else {
    this.set({ year, month, day, hour, minute, second, millisecond });
  }
  return this;
}
Qrono.prototype.toString = function() {
  if (this[internal].localtime) {
    const t = this[internal].nativeDate;
    const offset = -t.getTimezoneOffset();
    const offsetAbs = Math.abs(offset);
    return `${String(t.getFullYear()).padStart(4, "0")}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}.${String(t.getMilliseconds()).padStart(3, "0")}${(offset >= 0 ? "+" : "-") + String(Math.trunc(offsetAbs / minutesPerHour)).padStart(2, "0") + ":" + String(offsetAbs % minutesPerHour).padStart(2, "0")}`;
  }
  return this[internal].nativeDate.toISOString();
};
Qrono.prototype.valueOf = function() {
  return this[internal].nativeDate.valueOf();
};
Qrono.prototype.clone = function(...args) {
  return new Qrono(this, ...args);
};
Qrono.prototype.context = function(context2) {
  return given(context2) ? this.clone(context2) : { localtime: this[internal].localtime, ambiguousAsDst: this[internal].ambiguousAsDst };
};
Qrono.prototype.nativeDate = function() {
  return new Date(this[internal].nativeDate.getTime());
};
Qrono.prototype.offset = function() {
  return this[internal].localtime ? -this[internal].nativeDate.getTimezoneOffset() : 0;
};
Qrono.prototype.localtime = function(arg) {
  return given(arg) ? this.clone({ localtime: arg }) : this[internal].localtime;
};
Qrono.prototype.ambiguousAsDst = function(arg) {
  return given(arg) ? this.clone({ ambiguousAsDst: arg }) : this[internal].ambiguousAsDst;
};
Qrono.prototype.valid = function() {
  return this[internal].valid();
};
Qrono.prototype.numeric = function() {
  return this[internal].nativeDate.getTime();
};
Qrono.prototype.toObject = function() {
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
Qrono.prototype.toArray = function() {
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
Qrono.prototype.toDate = function(...args) {
  return new QronoDate(this.clone(...args));
};
Qrono.prototype.asUtc = function() {
  return this.clone({ localtime: false });
};
Qrono.prototype.asLocaltime = function() {
  return this.clone({ localtime: true });
};
Qrono.prototype.year = function(value) {
  return given(value) ? this.clone({ year: value }) : this[internal].getNative("FullYear");
};
Qrono.prototype.month = function(value) {
  return given(value) ? this.clone({ month: value }) : this[internal].getNative("Month") + 1;
};
Qrono.prototype.day = function(value) {
  return given(value) ? this.clone({ day: value }) : this[internal].getNative("Date");
};
Qrono.prototype.hour = function(value) {
  return given(value) ? this.clone({ hour: value }) : this[internal].getNative("Hours");
};
Qrono.prototype.minute = function(value) {
  return given(value) ? this.clone({ minute: value }) : this[internal].getNative("Minutes");
};
Qrono.prototype.second = function(value) {
  return given(value) ? this.clone({ second: value }) : this[internal].getNative("Seconds");
};
Qrono.prototype.millisecond = function(value) {
  return given(value) ? this.clone({ millisecond: value }) : this[internal].getNative("Milliseconds");
};
Qrono.prototype.dayOfWeek = function() {
  return 1 + (this[internal].getNative("Day") - 1 + daysPerWeek) % daysPerWeek;
};
Qrono.prototype.dayOfYear = function() {
  const date = this.toDate();
  return 1 + date - date.startOfYear();
};
Qrono.prototype.weekOfYear = function() {
  const date = this.toDate();
  const theThursday = date.day(date.day() - date.dayOfWeek() + thursday);
  const startOfYear = theThursday.startOfYear();
  const firstThursday = startOfYear.dayOfWeek() === thursday ? startOfYear : startOfYear.day(
    1 + (thursday - startOfYear.dayOfWeek() + daysPerWeek) % daysPerWeek
  );
  return 1 + Math.ceil((theThursday - firstThursday) / daysPerWeek);
};
Qrono.prototype.yearOfWeek = function() {
  const date = this.toDate();
  return date.day(date.day() - date.dayOfWeek() + thursday).year();
};
Qrono.prototype.isLeapYear = function() {
  const year = this.year();
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};
Qrono.prototype.hasDstInYear = function() {
  if (!this[internal].localtime) {
    return false;
  }
  const currentOffset = this.offset();
  return [3, 6, 9, 12].map(
    (month) => this.month(month).offset()
  ).some((offset) => offset !== currentOffset);
};
Qrono.prototype.isInDst = function() {
  if (!this[internal].localtime) {
    return false;
  }
  return this.offset() === Math.max(...[3, 6, 9, 12].map((month) => this.month(month).offset()));
};
Qrono.prototype.isDstTransitionDay = function() {
  if (!this[internal].localtime) {
    return false;
  }
  return this.minutesInDay() !== minutesPerDay;
};
Qrono.prototype.minutesInDay = function() {
  if (!this[internal].localtime) {
    return minutesPerDay;
  }
  const startOfDay = this.startOfDay();
  const nextDay = startOfDay.plus({ day: 1 }).startOfDay();
  if (startOfDay.day() === nextDay.day()) {
    return minutesPerDay;
  }
  return (nextDay - startOfDay) / millisecondsPerMinute;
};
Qrono.prototype.daysInMonth = function() {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const month = this.month();
  return days[month - 1] + (this.isLeapYear() && month === 2 ? 1 : 0);
};
Qrono.prototype.daysInYear = function() {
  return this.isLeapYear() ? 366 : 365;
};
Qrono.prototype.weeksInYear = function() {
  const endOfYear = this.toDate({ month: 12, day: 31 });
  const endOfLastYear = endOfYear.minus({ year: 1 });
  if (endOfYear.dayOfWeek() === thursday || endOfLastYear.dayOfWeek() === wednesday) {
    return 53;
  }
  return 52;
};
Qrono.prototype.startOfYear = function() {
  return this.clone({
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
Qrono.prototype.startOfMonth = function() {
  return this.clone({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
Qrono.prototype.startOfDay = function() {
  return this.clone({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
Qrono.prototype.startOfHour = function() {
  return this.clone({
    minute: 0,
    second: 0,
    millisecond: 0
  });
};
Qrono.prototype.startOfMinute = function() {
  return this.clone({
    second: 0,
    millisecond: 0
  });
};
Qrono.prototype.startOfSecond = function() {
  return this.clone({
    millisecond: 0
  });
};
Qrono.prototype.isSame = function(another) {
  return +this === +another;
};
Qrono.prototype.isBefore = function(another) {
  return this < another;
};
Qrono.prototype.isAfter = function(another) {
  return this > another;
};
Qrono.prototype.isSameOrBefore = function(another) {
  return this <= another;
};
Qrono.prototype.isSameOrAfter = function(another) {
  return this >= another;
};
Qrono.prototype.isBetween = function(a, b) {
  return a <= this && this <= b || b <= this && this <= a;
};
Qrono.prototype.plus = function(...args) {
  return plus.call(this, 1, ...args);
};
Qrono.prototype.minus = function(...args) {
  return plus.call(this, -1, ...args);
};
function plus(sign, ...args) {
  var _a, _b;
  const arg0 = args[0];
  const arg1 = args[1];
  if (Number.isFinite(arg0) && !Number.isFinite(arg1)) {
    return this.clone(this.numeric() + arg0);
  }
  let timeFields = null;
  if (isObject(arg0)) {
    if (!hasDatetimeField(arg0)) {
      throw RangeError(
        "Missing time field (year, minute, day, hour, minute, second or millisecond)"
      );
    }
    timeFields = arg0;
  } else if (Number.isFinite(arg0) || Array.isArray(arg0)) {
    const values = args.flat().filter((v) => Number.isSafeInteger(v));
    if (values.length !== args.flat().length) {
      throw RangeError("Should be safe integers");
    }
    if (values.length > 7) {
      throw RangeError("Too many numbers");
    }
    timeFields = {
      year: args[0],
      month: args[1],
      day: args[2],
      hour: args[3],
      minute: args[4],
      second: args[5],
      millisecond: args[6]
    };
  } else {
    throw TypeError();
  }
  const date = this.nativeDate();
  const utc = this[internal].localtime ? "" : "UTC";
  if (has(timeFields, "year") || has(timeFields, "month")) {
    const year = this.year() + sign * ((_a = timeFields.year) != null ? _a : 0);
    const month = this.month() + sign * ((_b = timeFields.month) != null ? _b : 0);
    const endOfMonth = new Date(date.getTime());
    endOfMonth[`set${utc}FullYear`](year, month, 0);
    const lastDay = endOfMonth.getDate();
    if (lastDay < this.day()) {
      date[`set${utc}FullYear`](year, endOfMonth[`get${utc}Month`](), lastDay);
    } else {
      date[`set${utc}FullYear`](year, month - 1);
    }
  }
  if (has(timeFields, "day")) {
    date[`set${utc}Date`](date[`get${utc}Date`]() + sign * timeFields.day);
  }
  [
    ["hour", "Hours"],
    ["minute", "Minutes"],
    ["second", "Seconds"],
    ["millisecond", "Milliseconds"]
  ].forEach(([key, nativeKey]) => {
    if (has(timeFields, key)) {
      date[`setUTC${nativeKey}`](
        date[`getUTC${nativeKey}`]() + sign * timeFields[key]
      );
    }
  });
  return this.clone(asDst(this[internal].ambiguousAsDst, date));
}
var internalDate = Symbol("QronoDate.internal");
function QronoDate(...args) {
  if (!new.target) {
    return new QronoDate(...args);
  }
  const self = this[internalDate] = {
    datetime: null
  };
  let source = null;
  if (args[0] instanceof QronoDate) {
    source = args.shift().toDatetime();
  }
  const first = args[0];
  const second = args[1];
  if (Number.isFinite(first) && !Number.isFinite(second)) {
    args[0] *= millisecondsPerDay;
  }
  source = (source ? source.clone(...args) : qrono(...args)).startOfDay();
  self.datetime = qrono({ localtime: false }, source.toObject());
  return this;
}
QronoDate.prototype.toString = function() {
  return this[internalDate].datetime.toString().substring(0, 10);
};
QronoDate.prototype.valueOf = function() {
  return this[internalDate].datetime / millisecondsPerDay;
};
QronoDate.prototype.clone = function(...args) {
  return new QronoDate(this, ...args);
};
QronoDate.prototype.toDatetime = function() {
  return qrono(this[internalDate].datetime.toArray());
};
QronoDate.prototype.numeric = function() {
  return this[internalDate].datetime.numeric() / millisecondsPerDay;
};
QronoDate.prototype.startOfYear = function() {
  return new QronoDate(this[internalDate].datetime.startOfYear());
};
QronoDate.prototype.startOfMonth = function() {
  return new QronoDate(this[internalDate].datetime.startOfMonth());
};
["year", "month", "day"].forEach((field) => {
  QronoDate.prototype[field] = function(value) {
    if (given(value)) {
      return new QronoDate(this[internalDate].datetime[field](value));
    }
    return this[internalDate].datetime[field]();
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
].forEach((method) => {
  QronoDate.prototype[method] = function() {
    return this[internalDate].datetime[method]();
  };
});
QronoDate.prototype.isDstTransitionDay = function() {
  return this[internalDate].datetime.localtime(true).isDstTransitionDay();
};
QronoDate.prototype.endOfYear = function() {
  return this.clone({ month: 12, day: 31 });
};
QronoDate.prototype.endOfMonth = function() {
  return this.clone({ day: this.daysInMonth() });
};
QronoDate.prototype.plus = function(...args) {
  return this[internalDate].datetime.plus(...args).toDate();
};
QronoDate.prototype.minus = function(...args) {
  return this[internalDate].datetime.minus(...args).toDate();
};
export {
  friday,
  monday,
  qrono,
  saturday,
  sunday,
  thursday,
  tuesday,
  wednesday
};
//# sourceMappingURL=qrono.mjs.map
