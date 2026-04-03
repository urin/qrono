//#region src/helpers.js
/**
* When creating or updating a local time, both `Date.setFullYear` and `Date.setHours` are used.
* Noon is used as the initial reference point to avoid the time after `setFullYear`
* from falling into an ambiguous DST period. Historically, DST transitions in all countries
* have been scheduled around midnight, and it should be the same in the future.
* The reason for selecting 1915 as the initial value is as follows.
* Since DST was first established in 1916, the initial value should be set to a year prior to that.
* If a year too far in the past is chosen, it may correspond to a period when time zones were not yet
* precisely defined in some regions, which could result in unexpected timezone offsets.
*/
var initialSafeDate = new Date(1915, 0, 1, 12, 0, 0, 0);
var minutesPerDay = 1440;
minutesPerDay * 7;
var secondsPerHour = 3600;
var secondsPerDay = secondsPerHour * 24;
var secondsPerWeek = secondsPerDay * 7;
var millisecondsPerSecond = 1e3;
var millisecondsPerMinute = 60 * millisecondsPerSecond;
secondsPerHour * millisecondsPerSecond;
var millisecondsPerDay = secondsPerDay * millisecondsPerSecond;
secondsPerWeek * millisecondsPerSecond;
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
	return !Number.isNaN(date.getTime());
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
//#endregion
//#region src/qrono.js
var qrono = Qrono;
Qrono.date = QronoDate;
var defaultContext = {
	localtime: false,
	disambiguation: "compatible"
};
Qrono.context = function(context) {
	if (given(context)) {
		for (const key of fields(defaultContext)) {
			if (!has(context, key)) continue;
			defaultContext[key] = context[key];
		}
		return this;
	}
	return { ...defaultContext };
};
var monday = 1;
var tuesday = 2;
var wednesday = 3;
var thursday = 4;
Object.assign(Qrono, {
	monday,
	tuesday,
	wednesday,
	thursday,
	friday: 5,
	saturday: 6,
	sunday: 7
});
var internal = Symbol();
function Qrono(...args) {
	if (!new.target) return new Qrono(...args);
	const self = {
		nativeDate: null,
		localtime: false,
		disambiguation: "compatible",
		set,
		parse,
		valid,
		context,
		getNative
	};
	this[internal] = self;
	self.context(defaultContext);
	if (args[0] instanceof Qrono) {
		const source = args.shift();
		self.nativeDate = source.nativeDate();
		self.context(source.context());
	}
	if (isObject(args[0]) && !hasDatetimeField(args[0])) self.context(args.shift());
	const first = args[0];
	const second = args[1];
	if (first == null) self.nativeDate ??= /* @__PURE__ */ new Date();
	else if (first instanceof Date) self.nativeDate = new Date(first.getTime());
	else if (isString(first)) self.parse(first);
	else if (isObject(first)) {
		if (!hasDatetimeField(first)) throw RangeError("Missing time field (year, minute, day, hour, minute, second or millisecond)");
		self.set(first);
	} else if (Number.isFinite(first) && !Number.isFinite(second)) self.nativeDate = new Date(first);
	else if (Number.isFinite(first) || Array.isArray(first)) {
		const flat = args.flat();
		const values = flat.filter((v) => Number.isSafeInteger(v));
		if (values.length !== flat.length) throw RangeError("Should be safe integers");
		if (values.length > 7) throw RangeError("Too many numbers");
		self.set({
			year: values[0],
			month: values[1],
			day: values[2],
			hour: values[3],
			minute: values[4],
			second: values[5],
			millisecond: values[6]
		});
	} else throw TypeError(`Invalid argument ${args}`);
	return this;
}
function valid() {
	return isValidDate(this.nativeDate);
}
function context(arg) {
	if (!arg) return {
		localtime: this.localtime,
		disambiguation: this.disambiguation
	};
	if ("localtime" in arg) this.localtime = arg.localtime;
	if ("disambiguation" in arg) this.disambiguation = arg.disambiguation;
	return this;
}
function getNative(name) {
	return this.nativeDate[`get${this.localtime ? "" : "UTC"}${name}`]();
}
function set(values) {
	const args = { ...values };
	args.month = args.month && args.month - 1;
	if (!this.localtime) {
		const baseDate = this.nativeDate ?? /* @__PURE__ */ new Date(0);
		const newDate = /* @__PURE__ */ new Date(0);
		newDate.setUTCFullYear(args.year ?? baseDate.getUTCFullYear(), args.month ?? baseDate.getUTCMonth(), args.day ?? baseDate.getUTCDate());
		newDate.setUTCHours(args.hour ?? baseDate.getUTCHours(), args.minute ?? baseDate.getUTCMinutes(), args.second ?? baseDate.getUTCSeconds(), args.millisecond ?? baseDate.getUTCMilliseconds());
		this.nativeDate = newDate;
		return this;
	}
	const dateOnly = !has(values, "hour", "minute", "second", "millisecond");
	const disambig = dateOnly ? "later" : this.disambiguation;
	const baseDate = this.nativeDate ?? new Date(0, 0);
	const newDate = new Date(initialSafeDate.getTime());
	const requested = {
		year: args.year ?? baseDate.getFullYear(),
		month: args.month ?? baseDate.getMonth(),
		day: args.day ?? baseDate.getDate(),
		hour: args.hour ?? (dateOnly ? 0 : baseDate.getHours()),
		minute: args.minute ?? (dateOnly ? 0 : baseDate.getMinutes()),
		second: args.second ?? (dateOnly ? 0 : baseDate.getSeconds()),
		millisecond: args.millisecond ?? (dateOnly ? 0 : baseDate.getMilliseconds())
	};
	newDate.setFullYear(requested.year, requested.month, requested.day);
	newDate.setHours(requested.hour, requested.minute, requested.second, requested.millisecond);
	const numeric = newDate.getTime();
	const nextDay = new Date(numeric);
	nextDay.setDate(newDate.getDate() + 1);
	const prevDay = new Date(numeric);
	prevDay.setDate(newDate.getDate() - 1);
	const adjust = nextDay.getTimezoneOffset() - prevDay.getTimezoneOffset();
	if (disambig === "compatible" || adjust === 0) {
		this.nativeDate = newDate;
		return this;
	}
	const isGap = requested.year * 1e8 + requested.month * 1e6 + requested.day * 1e4 + requested.hour * 100 + requested.minute < newDate.getFullYear() * 1e8 + newDate.getMonth() * 1e6 + newDate.getDate() * 1e4 + newDate.getHours() * 100 + newDate.getMinutes();
	const adjustedUTC = new Date(new Date(numeric).setUTCMinutes(newDate.getUTCMinutes() + adjust));
	const isOverlap = adjustedUTC.getHours() === newDate.getHours() && adjustedUTC.getMinutes() === newDate.getMinutes();
	if (!isGap && !isOverlap) {
		this.nativeDate = newDate;
		return this;
	}
	if (disambig === "reject") throw new RangeError(`Requested local time ${requested} is ambiguous.`);
	this.nativeDate = disambig === "later" ? newDate : adjustedUTC;
	return this;
}
var parsePattern = /* @__PURE__ */ new RegExp("^(\\d{4})(?:[-/]?([0-2]?\\d)(?:[-/]?([0-3]?\\d))?)?(?:[T\\s]([0-2]?\\d)(?::([0-5]?\\d)?(?::([0-6]?\\d)?(?:[.:](\\d{1,3})?\\d*)?)?)?)?(Z|[-+]\\d{2}:?\\d{2})?$");
function parse(str) {
	const text = str.trim().toUpperCase();
	const values = text.match(parsePattern);
	if (!values) throw RangeError(`Failed to parse '${str}'. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`);
	const hasTime = values[4] !== void 0;
	const [year, month, day, offset] = [
		+values[1],
		+values[2] || 1,
		+values[3] || 1,
		values[8]
	];
	const native = new Date(text);
	if (!isValidDate(native)) throw RangeError(`Failed to parse '${str}' by Date. Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]`);
	if (offset) this.nativeDate = native;
	else if (hasTime) this.set({
		year,
		month,
		day,
		hour: +values[4] || 0,
		minute: +values[5] || 0,
		second: +values[6] || 0,
		millisecond: +values[7]?.padStart(3, "0") || 0
	});
	else this.set({
		year,
		month,
		day
	});
	return this;
}
var pad0 = (v, n) => String(v).padStart(n, "0");
Qrono.prototype.toString = function() {
	if (this[internal].localtime) {
		const t = this[internal].nativeDate;
		const offset = -t.getTimezoneOffset();
		const offsetAbs = Math.abs(offset);
		return `${pad0(t.getFullYear(), 4)}-${pad0(t.getMonth() + 1, 2)}-${pad0(t.getDate(), 2)}T${pad0(t.getHours(), 2)}:${pad0(t.getMinutes(), 2)}:${pad0(t.getSeconds(), 2)}.${pad0(t.getMilliseconds(), 3)}${offset >= 0 ? "+" : "-"}${pad0(Math.trunc(offsetAbs / 60), 2)}:${pad0(offsetAbs % 60, 2)}`;
	}
	return this[internal].nativeDate.toISOString();
};
Qrono.prototype.valueOf = function() {
	return this[internal].nativeDate.valueOf();
};
Qrono.prototype.clone = function(...args) {
	return new Qrono(this, ...args);
};
Qrono.prototype.context = function(context) {
	return given(context) ? this.clone(context) : {
		localtime: this[internal].localtime,
		disambiguation: this[internal].disambiguation
	};
};
Qrono.prototype.nativeDate = function() {
	return new Date(this[internal].nativeDate.getTime());
};
Qrono.prototype.offset = function() {
	return this[internal].localtime ? -this[internal].nativeDate.getTimezoneOffset() : 0;
};
Qrono.prototype.valid = function() {
	return this[internal].valid();
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
for (const [field, native, base] of [
	[
		"year",
		"FullYear",
		0
	],
	[
		"month",
		"Month",
		1
	],
	[
		"day",
		"Date",
		0
	],
	[
		"hour",
		"Hours",
		0
	],
	[
		"minute",
		"Minutes",
		0
	],
	[
		"second",
		"Seconds",
		0
	],
	[
		"millisecond",
		"Milliseconds",
		0
	]
]) Qrono.prototype[field] = function(value) {
	return given(value) ? this.clone({ [field]: value }) : this[internal].getNative(native) + base;
};
Qrono.prototype.dayOfWeek = function() {
	return 1 + (this[internal].getNative("Day") - 1 + 7) % 7;
};
Qrono.prototype.dayOfYear = function() {
	const date = this.toDate();
	return 1 + date - date.startOfYear();
};
Qrono.prototype.weekOfYear = function() {
	const date = this.toDate();
	const theThursday = date.day(date.day() - date.dayOfWeek() + thursday);
	const startOfYear = theThursday.startOfYear();
	const firstThursday = startOfYear.dayOfWeek() === thursday ? startOfYear : startOfYear.day(1 + (thursday - startOfYear.dayOfWeek() + 7) % 7);
	return 1 + Math.ceil((theThursday - firstThursday) / 7);
};
Qrono.prototype.yearOfWeek = function() {
	const date = this.toDate();
	return date.day(date.day() - date.dayOfWeek() + thursday).year();
};
Qrono.prototype.isLeapYear = function() {
	const year = this.year();
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};
Qrono.prototype.hasOffsetChangeInYear = function() {
	if (!this[internal].localtime) return false;
	const currentOffset = this.offset();
	return [
		3,
		6,
		9,
		12
	].map((month) => this.month(month).offset()).some((offset) => offset !== currentOffset);
};
Qrono.prototype.isInDst = function() {
	if (!this[internal].localtime) return false;
	const offset = this.offset();
	let past = false, future = false;
	for (let i = 1; i <= 5; i += 2) {
		if (this.month(-i).offset() < offset) past = true;
		if (this.month(i).offset() < offset) future = true;
		if (past && future) return true;
	}
	return false;
};
Qrono.prototype.hasOffsetChangeInDay = function() {
	if (!this[internal].localtime) return false;
	return this.minutesInDay() !== minutesPerDay;
};
Qrono.prototype.minutesInDay = function() {
	if (!this[internal].localtime) return minutesPerDay;
	const startOfDay = this.context({ disambiguation: "later" }).startOfDay();
	const nextDay = startOfDay.plus({ day: 1 }).startOfDay();
	if (startOfDay.day() === nextDay.day()) return minutesPerDay;
	return (nextDay - startOfDay) / millisecondsPerMinute;
};
Qrono.prototype.daysInMonth = function() {
	const days = [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	const month = this.month();
	return days[month - 1] + (this.isLeapYear() && month === 2 ? 1 : 0);
};
Qrono.prototype.daysInYear = function() {
	return this.isLeapYear() ? 366 : 365;
};
Qrono.prototype.weeksInYear = function() {
	const endOfYear = this.toDate({
		month: 12,
		day: 31
	});
	const endOfLastYear = endOfYear.minus({ year: 1 });
	if (endOfYear.dayOfWeek() === thursday || endOfLastYear.dayOfWeek() === wednesday) return 53;
	return 52;
};
for (const [name, cloneArg] of [
	["Year", {
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	}],
	["Month", {
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	}],
	["Hour", {
		minute: 0,
		second: 0,
		millisecond: 0
	}],
	["Minute", {
		second: 0,
		millisecond: 0
	}],
	["Second", { millisecond: 0 }]
]) Qrono.prototype[`startOf${name}`] = function() {
	return this.clone(cloneArg);
};
Qrono.prototype.startOfDay = function() {
	const timestamp = this.clone({ disambiguation: "later" }, {
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	}).valueOf();
	return this.clone(timestamp);
};
function implementComparison(prototype) {
	Object.assign(prototype, {
		isSame(another) {
			return +this === +another;
		},
		isBefore(another) {
			return this < another;
		},
		isAfter(another) {
			return this > another;
		},
		isSameOrBefore(another) {
			return this <= another;
		},
		isSameOrAfter(another) {
			return this >= another;
		},
		isBetween(a, b) {
			return a <= this && this <= b || b <= this && this <= a;
		}
	});
}
implementComparison(Qrono.prototype);
Qrono.prototype.plus = function(...args) {
	return plus.call(this, 1, ...args);
};
Qrono.prototype.minus = function(...args) {
	return plus.call(this, -1, ...args);
};
function plus(sign, ...args) {
	const arg0 = args[0];
	const arg1 = args[1];
	if (Number.isFinite(arg0) && !Number.isFinite(arg1)) return this.clone(this.valueOf() + arg0);
	let timeFields = null;
	if (isObject(arg0)) {
		if (!hasDatetimeField(arg0)) throw RangeError("Missing time field (year, minute, day, hour, minute, second or millisecond)");
		timeFields = arg0;
	} else if (Number.isFinite(arg0) || Array.isArray(arg0)) {
		const flat = args.flat();
		const values = flat.filter((v) => Number.isSafeInteger(v));
		if (values.length !== flat.length) throw RangeError("Should be safe integers");
		if (values.length > 7) throw RangeError("Too many numbers");
		timeFields = {
			year: values[0],
			month: values[1],
			day: values[2],
			hour: values[3],
			minute: values[4],
			second: values[5],
			millisecond: values[6]
		};
	} else throw TypeError();
	const date = this.nativeDate();
	const utc = this[internal].localtime ? "" : "UTC";
	if (has(timeFields, "year") || has(timeFields, "month")) {
		const year = this.year() + sign * (timeFields.year ?? 0);
		const month = this.month() + sign * (timeFields.month ?? 0);
		const endOfMonth = new Date(date.getTime());
		endOfMonth[`set${utc}FullYear`](year, month, 0);
		const lastDay = endOfMonth[`get${utc}Date`]();
		if (lastDay < this.day()) date[`set${utc}FullYear`](year, endOfMonth[`get${utc}Month`](), lastDay);
		else date[`set${utc}FullYear`](year, month - 1);
	}
	if (has(timeFields, "day")) date[`set${utc}Date`](date[`get${utc}Date`]() + sign * timeFields.day);
	for (const [key, nativeKey] of [
		["hour", "Hours"],
		["minute", "Minutes"],
		["second", "Seconds"],
		["millisecond", "Milliseconds"]
	]) {
		if (!has(timeFields, key) || timeFields[key] == null) continue;
		date[`setUTC${nativeKey}`](date[`getUTC${nativeKey}`]() + sign * timeFields[key]);
	}
	return this.clone(date);
}
var internalDate = Symbol();
function QronoDate(...args) {
	if (!new.target) return new QronoDate(...args);
	const self = { datetime: null };
	this[internalDate] = self;
	let source = null;
	if (args[0] instanceof QronoDate) source = args.shift().toDatetime();
	else if (args[0] instanceof Qrono) source = args.shift();
	const first = args[0];
	const second = args[1];
	if (Number.isFinite(first) && !Number.isFinite(second)) args[0] = Math.floor(first) * millisecondsPerDay;
	if (source) source = source.clone(...args);
	else source = qrono(...args);
	self.datetime = source.startOfDay();
	return this;
}
QronoDate.prototype.toString = function() {
	return this[internalDate].datetime.toString().substring(0, 10);
};
QronoDate.prototype.valueOf = function() {
	return this[internalDate].datetime / millisecondsPerDay;
};
QronoDate.prototype.valid = function() {
	return this[internalDate].datetime.valid();
};
QronoDate.prototype.clone = function(...args) {
	return new QronoDate(this, ...args);
};
QronoDate.prototype.toDatetime = function() {
	return qrono(this[internalDate].datetime.toArray());
};
QronoDate.prototype.toObject = function() {
	return {
		year: this.year(),
		month: this.month(),
		day: this.day()
	};
};
QronoDate.prototype.toArray = function() {
	return [
		this.year(),
		this.month(),
		this.day()
	];
};
for (const name of ["Year", "Month"]) QronoDate.prototype[`startOf${name}`] = function() {
	return new QronoDate(this[internalDate].datetime[`startOf${name}`]());
};
for (const field of [
	"year",
	"month",
	"day"
]) QronoDate.prototype[field] = function(value) {
	if (given(value)) return new QronoDate(this[internalDate].datetime[field](value));
	return this[internalDate].datetime[field]();
};
for (const method of [
	"dayOfWeek",
	"dayOfYear",
	"weekOfYear",
	"yearOfWeek",
	"isLeapYear",
	"daysInMonth",
	"daysInYear",
	"weeksInYear"
]) QronoDate.prototype[method] = function() {
	return this[internalDate].datetime[method]();
};
for (const method of [
	"minutesInDay",
	"hasOffsetChangeInYear",
	"hasOffsetChangeInDay"
]) QronoDate.prototype[method] = function() {
	return qrono({ disambiguation: "later" }, this[internalDate].datetime.toArray().slice(0, 3))[method]();
};
QronoDate.prototype.endOfYear = function() {
	return this.clone({
		month: 12,
		day: 31
	});
};
QronoDate.prototype.endOfMonth = function() {
	return this.clone({ day: this.daysInMonth() });
};
implementComparison(QronoDate.prototype);
QronoDate.prototype.plus = function(...args) {
	return plusDate.call(this, 1, ...args);
};
QronoDate.prototype.minus = function(...args) {
	return plusDate.call(this, -1, ...args);
};
function plusDate(sign, ...args) {
	const arg0 = args[0];
	const arg1 = args[1];
	const datetime = this[internalDate].datetime;
	if (Number.isFinite(arg0) && !Number.isFinite(arg1)) return datetime.plus({ day: sign * arg0 }).toDate();
	let timeFields = null;
	if (isObject(arg0) && hasDatetimeField(arg0)) timeFields = {
		year: sign * (arg0.year ?? 0),
		month: sign * (arg0.month ?? 0),
		day: sign * (arg0.day ?? 0)
	};
	else if (Number.isFinite(arg0)) {
		if (args.length > 3) throw RangeError("Too many arguments");
		timeFields = {
			year: sign * arg0,
			month: sign * arg1,
			day: sign * arg2
		};
	} else if (Array.isArray(arg0)) {
		if (arg0.length > 3) throw RangeError("Too many elements");
		timeFields = {
			year: sign * arg0[0],
			month: sign * arg0[1],
			day: sign * arg0[2]
		};
	} else throw TypeError();
	return datetime.plus(timeFields).toDate();
}
//#endregion
export { qrono };

//# sourceMappingURL=qrono.js.map