(() => {
  // src/helpers.js
  var epoch = new Date(0);
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
    return Object.entries(object).filter(([, value]) => !isFunction(value)).map(([key]) => key);
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
    if (!ambiguousAsDst) {
      const nextday = new Date(numeric);
      nextday.setDate(date.getDate() + 1);
      const adjust = nextday.getTimezoneOffset() - date.getTimezoneOffset();
      if (adjust > 0) {
        const advanced = new Date(numeric).setMinutes(date.getMinutes() + adjust);
        const advancedUTC = new Date(numeric).setUTCMinutes(date.getUTCMinutes() + adjust);
        if (advanced !== advancedUTC) {
          result.setUTCMinutes(date.getUTCMinutes() + adjust);
        }
      }
    }
    return result;
  }

  // src/qrono.date.js
  var internal = Symbol("QronoDate.internal");
  function QronoDate(...args) {
    if (!new.target) {
      return new QronoDate(...args);
    }
    const self = this[internal] = {
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
    source = (source ? source.clone(...args) : qrono_default(...args)).startOfDay();
    self.datetime = qrono_default({ localtime: false }, source.toObject());
    return this;
  }
  QronoDate.prototype.toString = function() {
    return this[internal].datetime.toString().substring(0, 10);
  };
  QronoDate.prototype.valueOf = function() {
    return this[internal].datetime / millisecondsPerDay;
  };
  QronoDate.prototype.clone = function(...args) {
    return new QronoDate(this, ...args);
  };
  QronoDate.prototype.toDatetime = function() {
    return qrono_default(this[internal].datetime.toArray());
  };
  QronoDate.prototype.numeric = function() {
    return this[internal].datetime.numeric() / millisecondsPerDay;
  };
  QronoDate.prototype.startOfYear = function() {
    return new QronoDate(this[internal].datetime.startOfYear());
  };
  QronoDate.prototype.startOfMonth = function() {
    return new QronoDate(this[internal].datetime.startOfMonth());
  };
  ["year", "month", "day"].forEach((field) => {
    QronoDate.prototype[field] = function(value) {
      if (given(value)) {
        return new QronoDate(this[internal].datetime[field](value));
      }
      return this[internal].datetime[field]();
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
      return this[internal].datetime[method]();
    };
  });
  QronoDate.prototype.isDstTransitionDay = function() {
    return this[internal].datetime.localtime(true).isDstTransitionDay();
  };
  QronoDate.prototype.endOfYear = function() {
    return this.clone({ month: 12, day: 31 });
  };
  QronoDate.prototype.endOfMonth = function() {
    return this.clone({ day: this.daysInMonth() });
  };
  QronoDate.prototype.plus = function(...args) {
    return this[internal].datetime.plus(...args).toDate();
  };
  QronoDate.prototype.minus = function(...args) {
    return this[internal].datetime.minus(...args).toDate();
  };

  // src/qrono.js
  var qrono = Qrono;
  Qrono.date = QronoDate;
  var qrono_default = qrono;
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
    return { ...defaultContext };
  };
  Qrono.asUtc = function() {
    defaultContext.localtime = false;
    return this;
  };
  Qrono.asLocaltime = function() {
    defaultContext.localtime = true;
    return this;
  };
  Object.assign(Qrono, { monday, tuesday, wednesday, thursday, friday, saturday, sunday });
  var internal2 = Symbol("Qrono.internal");
  function Qrono(...args) {
    if (!new.target) {
      return new Qrono(...args);
    }
    const self = this[internal2] = {
      nativeDate: null,
      localtime: false,
      ambiguousAsDst: false,
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
      self.nativeDate ?? (self.nativeDate = new Date());
    } else if (first instanceof Date) {
      self.nativeDate = new Date(first.getTime());
    } else if (isString(first)) {
      self.parse(first);
    } else if (isObject(first)) {
      if (!hasDatetimeField(first)) {
        throw RangeError("Missing time field (year, minute, day, hour, minute, second or millisecond)");
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
    const args = { ...values };
    args.month = args.month && args.month - 1;
    const date = this.nativeDate ?? new Date();
    if (this.localtime) {
      this.nativeDate = asDst(this.ambiguousAsDst, new Date(args.year ?? date.getFullYear(), args.month ?? (this.nativeDate ? date.getMonth() : 0), args.day ?? (this.nativeDate ? date.getDate() : 1), args.hour ?? (this.nativeDate ? date.getHours() : 0), args.minute ?? (this.nativeDate ? date.getMinutes() : 0), args.second ?? (this.nativeDate ? date.getSeconds() : 0), args.millisecond ?? (this.nativeDate ? date.getMilliseconds() : 0)));
    } else {
      this.nativeDate = new Date(Date.UTC(args.year ?? date.getUTCFullYear(), args.month ?? (this.nativeDate ? date.getUTCMonth() : 0), args.day ?? (this.nativeDate ? date.getUTCDate() : 1), args.hour ?? (this.nativeDate ? date.getUTCHours() : 0), args.minute ?? (this.nativeDate ? date.getUTCMinutes() : 0), args.second ?? (this.nativeDate ? date.getUTCSeconds() : 0), args.millisecond ?? (this.nativeDate ? date.getUTCMilliseconds() : 0)));
    }
    return this;
  }
  var parsePattern = new RegExp("^(\\d{4})(?:[-/]?([0-2]?\\d)(?:[-/]?([0-3]?\\d))?)?(?:[T\\s]([0-2]?\\d)(?::([0-5]?\\d)?(?::([0-6]?\\d)?(?:[.:](\\d{1,3})?\\d*)?)?)?)?(Z|[-+]\\d{2}:?\\d{2})?$");
  function parse(str) {
    const text = str.trim().toUpperCase();
    const values = text.match(parsePattern);
    if (!values) {
      throw RangeError(`Failed to parse '${str}'. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`);
    }
    const [year, month, day, hour, minute, second, millisecond, offset] = [
      +values[1],
      +values[2] || 1,
      +values[3] || 1,
      +values[4] || 0,
      +values[5] || 0,
      +values[6] || 0,
      +values[7]?.padStart(3, "0") || 0,
      values[8]
    ];
    const native = new Date(text);
    if (!isValidDate(native)) {
      throw RangeError(`Failed to parse '${str}' by Date. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`);
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
    if (this[internal2].localtime) {
      const t = this[internal2].nativeDate;
      const offset = -t.getTimezoneOffset();
      const offsetAbs = Math.abs(offset);
      return `${String(t.getFullYear()).padStart(4, "0")}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}.${String(t.getMilliseconds()).padStart(3, "0")}${(offset >= 0 ? "+" : "-") + String(Math.trunc(offsetAbs / minutesPerHour)).padStart(2, "0") + ":" + String(offsetAbs % minutesPerHour).padStart(2, "0")}`;
    }
    return this[internal2].nativeDate.toISOString();
  };
  Qrono.prototype.valueOf = function() {
    return this[internal2].nativeDate.valueOf();
  };
  Qrono.prototype.clone = function(...args) {
    return new Qrono(this, ...args);
  };
  Qrono.prototype.context = function(context2) {
    return given(context2) ? this.clone(context2) : { localtime: this[internal2].localtime, ambiguousAsDst: this[internal2].ambiguousAsDst };
  };
  Qrono.prototype.nativeDate = function() {
    return new Date(this[internal2].nativeDate.getTime());
  };
  Qrono.prototype.offset = function() {
    return this[internal2].localtime ? -this[internal2].nativeDate.getTimezoneOffset() : 0;
  };
  Qrono.prototype.localtime = function(arg) {
    return given(arg) ? this.clone({ localtime: arg }) : this[internal2].localtime;
  };
  Qrono.prototype.ambiguousAsDst = function(arg) {
    return given(arg) ? this.clone({ ambiguousAsDst: arg }) : this[internal2].ambiguousAsDst;
  };
  Qrono.prototype.valid = function() {
    return this[internal2].valid();
  };
  Qrono.prototype.numeric = function() {
    return this[internal2].nativeDate.getTime();
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
  Qrono.prototype.asLocalTime = function() {
    return this.clone({ localtime: true });
  };
  Qrono.prototype.year = function(value) {
    return given(value) ? this.clone({ year: value }) : this[internal2].getNative("FullYear");
  };
  Qrono.prototype.month = function(value) {
    return given(value) ? this.clone({ month: value }) : this[internal2].getNative("Month") + 1;
  };
  Qrono.prototype.day = function(value) {
    return given(value) ? this.clone({ day: value }) : this[internal2].getNative("Date");
  };
  Qrono.prototype.hour = function(value) {
    return given(value) ? this.clone({ hour: value }) : this[internal2].getNative("Hours");
  };
  Qrono.prototype.minute = function(value) {
    return given(value) ? this.clone({ minute: value }) : this[internal2].getNative("Minutes");
  };
  Qrono.prototype.second = function(value) {
    return given(value) ? this.clone({ second: value }) : this[internal2].getNative("Seconds");
  };
  Qrono.prototype.millisecond = function(value) {
    return given(value) ? this.clone({ millisecond: value }) : this[internal2].getNative("Milliseconds");
  };
  Qrono.prototype.dayOfWeek = function() {
    return 1 + (this[internal2].getNative("Day") - 1 + daysPerWeek) % daysPerWeek;
  };
  Qrono.prototype.dayOfYear = function() {
    const date = this.toDate();
    return 1 + date - date.startOfYear();
  };
  Qrono.prototype.weekOfYear = function() {
    const date = this.toDate();
    const theThursday = date.day(date.day() - date.dayOfWeek() + thursday);
    const startOfYear = theThursday.startOfYear();
    const firstThursday = startOfYear.dayOfWeek() === thursday ? startOfYear : startOfYear.day(1 + (thursday - startOfYear.dayOfWeek() + daysPerWeek) % daysPerWeek);
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
    if (!this[internal2].localtime) {
      return false;
    }
    const currentOffset = this.offset();
    return [3, 6, 9, 12].map((month) => this.month(month).offset()).some((offset) => offset !== currentOffset);
  };
  Qrono.prototype.isInDst = function() {
    if (!this[internal2].localtime) {
      return false;
    }
    return this.offset() === Math.max(...[3, 6, 9, 12].map((month) => this.month(month).offset()));
  };
  Qrono.prototype.isDstTransitionDay = function() {
    if (!this[internal2].localtime) {
      return false;
    }
    const startOfDay = this.startOfDay();
    return startOfDay.plus({ day: 1 }).startOfDay() - startOfDay !== millisecondsPerDay;
  };
  Qrono.prototype.minutesInDay = function() {
    if (!this[internal2].localtime) {
      return minutesPerDay;
    }
    const startOfDay = this.startOfDay();
    return (startOfDay.plus({ day: 1 }).startOfDay() - startOfDay) / millisecondsPerMinute;
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
    const arg0 = args[0];
    const arg1 = args[1];
    if (Number.isFinite(arg0) && !Number.isFinite(arg1)) {
      return this.clone(this.numeric() - arg0);
    }
    let timeFields = null;
    if (isObject(arg0)) {
      if (!hasDatetimeField(arg0)) {
        throw RangeError("Missing time field (year, minute, day, hour, minute, second or millisecond)");
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
    const utc = this[internal2].localtime ? "" : "UTC";
    if (has(timeFields, "year")) {
      date[`set${utc}FullYear`](date[`get${utc}FullYear`]() + sign * timeFields.year);
    }
    if (has(timeFields, "month")) {
      const month = timeFields.month;
      const endOfMonth = new Date(date.getTime());
      endOfMonth[`set${utc}Month`](endOfMonth[`get${utc}Month`]() + sign * month + 1, 0);
      const daysInMonth = endOfMonth.getDate();
      if (date[`get${utc}Date`]() >= daysInMonth) {
        date[`set${utc}Month`](endOfMonth[`get${utc}Month`](), daysInMonth);
      } else {
        date[`set${utc}Month`](date[`get${utc}Month`]() + sign * month);
      }
    }
    ;
    [
      ["day", "Date"],
      ["hour", "Hours"],
      ["minute", "Minutes"],
      ["second", "Seconds"],
      ["millisecond", "Milliseconds"]
    ].forEach(([key, nativeKey]) => {
      if (has(timeFields, key)) {
        date[`set${utc}${nativeKey}`](date[`get${utc}${nativeKey}`]() + sign * timeFields[key]);
      }
    });
    return this.clone(asDst(this[internal2].ambiguousAsDst, date));
  }
})();
//# sourceMappingURL=qrono.js.map
