/* @ts-self-types="../types/qrono.d.ts" */
import {
  has,
  given,
  fields,
  isObject,
  isString,
  isValidDate,
  asDst,
  hasDatetimeField,
  initialSafeDate,
  daysPerWeek,
  minutesPerDay,
  minutesPerHour,
  millisecondsPerMinute,
  millisecondsPerDay,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
} from './helpers.js'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
const qrono = Qrono

export { qrono }

export {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
} from './helpers'

// -----------------------------------------------------------------------------
// Static
// -----------------------------------------------------------------------------
Qrono.date = QronoDate

// NOTE Must be flat object for shallow cloning.
const defaultContext = {
  localtime: false,
  interpretAsDst: true,
}

fields(defaultContext).forEach(key => {
  Qrono[key] = function (arg) {
    if (given(arg)) {
      defaultContext[key] = arg
      return this
    }
    return defaultContext[key]
  }
})

Qrono.context = function (context) {
  if (given(context)) {
    fields(defaultContext)
      .filter(key => has(context, key))
      .forEach(key => {
        defaultContext[key] = context[key]
      })
    return this
  }
  return { ...defaultContext }
}

Qrono.asUtc = function () {
  defaultContext.localtime = false
  return this
}

Qrono.asLocaltime = function () {
  defaultContext.localtime = true
  return this
}

Object.assign(Qrono, {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
})

// -----------------------------------------------------------------------------
// Constructor
// -----------------------------------------------------------------------------
const internal = Symbol('Qrono.internal')

function Qrono(...args) {
  if (!new.target) {
    return new Qrono(...args)
  }
  const self = (this[internal] = {
    // properties
    nativeDate: null,
    localtime: false,
    interpretAsDst: false,
    // methods
    set,
    parse,
    valid,
    context,
    getNative,
  })

  // Construction
  self.context(defaultContext)
  if (args[0] instanceof Qrono) {
    const source = args.shift()
    fields(self).forEach(key => {
      self[key] = source[key]()
    })
  }
  if (isObject(args[0]) && !hasDatetimeField(args[0])) {
    self.context(args.shift())
  }
  const first = args[0]
  const second = args[1]
  if (first == null) {
    self.nativeDate ??= new Date()
  } else if (first instanceof Date) {
    self.nativeDate = new Date(first.getTime())
  } else if (isString(first)) {
    self.parse(first)
  } else if (isObject(first)) {
    if (!hasDatetimeField(first)) {
      throw RangeError(
        'Missing time field' +
          ' (year, minute, day, hour, minute, second or millisecond)'
      )
    }
    self.set(first)
  } else if (Number.isFinite(first) && !Number.isFinite(second)) {
    self.nativeDate = new Date(first)
  } else if (Number.isFinite(first) || Array.isArray(first)) {
    const values = args.flat().filter(v => Number.isSafeInteger(v))
    if (values.length !== args.flat().length) {
      throw RangeError('Should be safe integers')
    }
    if (values.length > 7) {
      throw RangeError('Too many numbers')
    }
    self.set({
      year: values[0],
      month: values[1],
      day: values[2],
      hour: values[3],
      minute: values[4],
      second: values[5],
      millisecond: values[6],
    })
  } else {
    throw TypeError(`Invalid argument ${args}`)
  }
  return this
}

// -----------------------------------------------------------------------------
// Private methods
// -----------------------------------------------------------------------------
function valid() {
  return isValidDate(this.nativeDate)
}

function context(context) {
  if (!context) {
    return
  }
  fields(defaultContext)
    .filter(key => has(context, key))
    .forEach(key => {
      this[key] = context[key]
    })
  return this
}

function getNative(name) {
  return this.nativeDate[`get${this.localtime ? '' : 'UTC'}${name}`]()
}

function set(values) {
  const args = { ...values }
  args.month = args.month && args.month - 1
  if (this.localtime) {
    const baseDate = this.nativeDate ?? new Date(0, 0)
    const newDate = new Date(initialSafeDate.getTime())
    newDate.setFullYear(
      args.year ?? baseDate.getFullYear(),
      args.month ?? baseDate.getMonth(),
      args.day ?? baseDate.getDate()
    )
    newDate.setHours(
      args.hour ?? baseDate.getHours(),
      args.minute ?? baseDate.getMinutes(),
      args.second ?? baseDate.getSeconds(),
      args.millisecond ?? baseDate.getMilliseconds()
    )
    this.nativeDate = asDst(this.interpretAsDst, newDate)
  } else {
    const baseDate = this.nativeDate ?? new Date(0)
    const newDate = new Date(0)
    newDate.setUTCFullYear(
      args.year ?? baseDate.getUTCFullYear(),
      args.month ?? baseDate.getUTCMonth(),
      args.day ?? baseDate.getUTCDate()
    )
    newDate.setUTCHours(
      args.hour ?? baseDate.getUTCHours(),
      args.minute ?? baseDate.getUTCMinutes(),
      args.second ?? baseDate.getUTCSeconds(),
      args.millisecond ?? baseDate.getUTCMilliseconds()
    )
    this.nativeDate = newDate
  }
  return this
}

const parsePattern = new RegExp(
  // yyyy[[-|/]MM[[-|/]DD]]
  '^(\\d{4})(?:[-/]?([0-2]?\\d)(?:[-/]?([0-3]?\\d))?)?' +
    // [(T| )HH[:]mm[[:]ss[(.|:)SSS]]]
    '(?:[T\\s]([0-2]?\\d)(?::([0-5]?\\d)?(?::([0-6]?\\d)?(?:[.:](\\d{1,3})?\\d*)?)?)?)?' +
    // [Z|(+|-)hh:mm]
    '(Z|[-+]\\d{2}:?\\d{2})?$'
)

function parse(str) {
  const text = str.trim().toUpperCase()
  const values = text.match(parsePattern)
  if (!values) {
    throw RangeError(
      `Failed to parse '${str}'.` +
        ' Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]'
    )
  }
  const [year, month, day, hour, minute, second, millisecond, offset] = [
    +values[1],
    +values[2] || 1,
    +values[3] || 1,
    +values[4] || 0,
    +values[5] || 0,
    +values[6] || 0,
    +values[7]?.padStart(3, '0') || 0,
    values[8],
  ]
  const native = new Date(text)
  if (!isValidDate(native)) {
    throw RangeError(
      `Failed to parse '${str}' by Date.` +
        ' Should be yyyy[[-|/]MM[[-|/]DD]][(T| )HH:mm[:ss[(.|:)SSS]]][Z|(+|-)hh:mm]'
    )
  }
  if (offset) {
    this.nativeDate = native
  } else if (this.localtime) {
    this.nativeDate = asDst(this.interpretAsDst, native)
  } else {
    this.set({ year, month, day, hour, minute, second, millisecond })
  }
  return this
}

// -----------------------------------------------------------------------------
// Public methods
// -----------------------------------------------------------------------------
// Basic
Qrono.prototype.toString = function () {
  if (this[internal].localtime) {
    const t = this[internal].nativeDate
    const offset = -t.getTimezoneOffset()
    const offsetAbs = Math.abs(offset)
    return `${String(t.getFullYear()).padStart(4, '0')}-${String(
      t.getMonth() + 1
    ).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}T${String(
      t.getHours()
    ).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(
      t.getSeconds()
    ).padStart(2, '0')}.${String(t.getMilliseconds()).padStart(3, '0')}${
      (offset >= 0 ? '+' : '-') +
      String(Math.trunc(offsetAbs / minutesPerHour)).padStart(2, '0') +
      ':' +
      String(offsetAbs % minutesPerHour).padStart(2, '0')
    }`
  }
  return this[internal].nativeDate.toISOString()
}

Qrono.prototype.valueOf = function () {
  return this[internal].nativeDate.valueOf()
}

Qrono.prototype.clone = function (...args) {
  return new Qrono(this, ...args)
}

Qrono.prototype.context = function (context) {
  return given(context)
    ? this.clone(context)
    : {
        localtime: this[internal].localtime,
        interpretAsDst: this[internal].interpretAsDst,
      }
}

Qrono.prototype.nativeDate = function () {
  return new Date(this[internal].nativeDate.getTime())
}

Qrono.prototype.offset = function () {
  return this[internal].localtime
    ? -this[internal].nativeDate.getTimezoneOffset()
    : 0
}

Qrono.prototype.localtime = function (arg) {
  return given(arg) ? this.clone({ localtime: arg }) : this[internal].localtime
}

Qrono.prototype.interpretAsDst = function (arg) {
  return given(arg)
    ? this.clone({ interpretAsDst: arg })
    : this[internal].interpretAsDst
}

Qrono.prototype.valid = function () {
  return this[internal].valid()
}

// Transform
Qrono.prototype.numeric = function () {
  return this[internal].nativeDate.getTime()
}

Qrono.prototype.toObject = function () {
  return {
    year: this.year(),
    month: this.month(),
    day: this.day(),
    hour: this.hour(),
    minute: this.minute(),
    second: this.second(),
    millisecond: this.millisecond(),
  }
}

Qrono.prototype.toArray = function () {
  return [
    this.year(),
    this.month(),
    this.day(),
    this.hour(),
    this.minute(),
    this.second(),
    this.millisecond(),
  ]
}

Qrono.prototype.toDate = function (...args) {
  return new QronoDate(this.clone(...args))
}

// Context
Qrono.prototype.asUtc = function () {
  return this.clone({ localtime: false })
}

Qrono.prototype.asLocaltime = function () {
  return this.clone({ localtime: true })
}

// Accessor
Qrono.prototype.year = function (value) {
  return given(value)
    ? this.clone({ year: value })
    : this[internal].getNative('FullYear')
}

Qrono.prototype.month = function (value) {
  return given(value)
    ? this.clone({ month: value })
    : this[internal].getNative('Month') + 1
}

Qrono.prototype.day = function (value) {
  return given(value)
    ? this.clone({ day: value })
    : this[internal].getNative('Date')
}

Qrono.prototype.hour = function (value) {
  return given(value)
    ? this.clone({ hour: value })
    : this[internal].getNative('Hours')
}

Qrono.prototype.minute = function (value) {
  return given(value)
    ? this.clone({ minute: value })
    : this[internal].getNative('Minutes')
}

Qrono.prototype.second = function (value) {
  return given(value)
    ? this.clone({ second: value })
    : this[internal].getNative('Seconds')
}

Qrono.prototype.millisecond = function (value) {
  return given(value)
    ? this.clone({ millisecond: value })
    : this[internal].getNative('Milliseconds')
}

// Getter
Qrono.prototype.dayOfWeek = function () {
  return 1 + ((this[internal].getNative('Day') - 1 + daysPerWeek) % daysPerWeek)
}

Qrono.prototype.dayOfYear = function () {
  const date = this.toDate()
  return 1 + date - date.startOfYear()
}

Qrono.prototype.weekOfYear = function () {
  const date = this.toDate()
  const theThursday = date.day(date.day() - date.dayOfWeek() + thursday)
  const startOfYear = theThursday.startOfYear()
  const firstThursday =
    startOfYear.dayOfWeek() === thursday
      ? startOfYear
      : startOfYear.day(
          1 + ((thursday - startOfYear.dayOfWeek() + daysPerWeek) % daysPerWeek)
        )
  return 1 + Math.ceil((theThursday - firstThursday) / daysPerWeek)
}

Qrono.prototype.yearOfWeek = function () {
  const date = this.toDate()
  return date.day(date.day() - date.dayOfWeek() + thursday).year()
}

Qrono.prototype.isLeapYear = function () {
  const year = this.year()
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

Qrono.prototype.hasDstInYear = function () {
  if (!this[internal].localtime) {
    return false
  }
  const currentOffset = this.offset()
  return [3, 6, 9, 12]
    .map(month => this.month(month).offset())
    .some(offset => offset !== currentOffset)
}

Qrono.prototype.isInDst = function () {
  if (!this[internal].localtime) {
    return false
  }
  return (
    this.offset() ===
    Math.max(...[3, 6, 9, 12].map(month => this.month(month).offset()))
  )
}

Qrono.prototype.isDstTransitionDay = function () {
  if (!this[internal].localtime) {
    return false
  }
  return this.minutesInDay() !== minutesPerDay
}

Qrono.prototype.minutesInDay = function () {
  if (!this[internal].localtime) {
    return minutesPerDay
  }
  const startOfDay = this.startOfDay()
  const nextDay = startOfDay.plus({ day: 1 }).startOfDay()
  if (startOfDay.day() === nextDay.day()) {
    return minutesPerDay
  }
  return (nextDay - startOfDay) / millisecondsPerMinute
}

Qrono.prototype.daysInMonth = function () {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const month = this.month()
  return days[month - 1] + (this.isLeapYear() && month === 2 ? 1 : 0)
}

Qrono.prototype.daysInYear = function () {
  return this.isLeapYear() ? 366 : 365
}

Qrono.prototype.weeksInYear = function () {
  const endOfYear = this.toDate({ month: 12, day: 31 })
  const endOfLastYear = endOfYear.minus({ year: 1 })
  if (
    endOfYear.dayOfWeek() === thursday ||
    endOfLastYear.dayOfWeek() === wednesday
  ) {
    return 53
  }
  return 52
}

Qrono.prototype.startOfYear = function () {
  return this.clone({
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
}

Qrono.prototype.startOfMonth = function () {
  return this.clone({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
}

Qrono.prototype.startOfDay = function () {
  return this.clone({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
}

Qrono.prototype.startOfHour = function () {
  return this.clone({
    minute: 0,
    second: 0,
    millisecond: 0,
  })
}

Qrono.prototype.startOfMinute = function () {
  return this.clone({
    second: 0,
    millisecond: 0,
  })
}

Qrono.prototype.startOfSecond = function () {
  return this.clone({
    millisecond: 0,
  })
}

Qrono.prototype.isSame = function (another) {
  return +this === +another
}
Qrono.prototype.isBefore = function (another) {
  return this < another
}
Qrono.prototype.isAfter = function (another) {
  return this > another
}
Qrono.prototype.isSameOrBefore = function (another) {
  return this <= another
}
Qrono.prototype.isSameOrAfter = function (another) {
  return this >= another
}
Qrono.prototype.isBetween = function (a, b) {
  return (a <= this && this <= b) || (b <= this && this <= a)
}

// Calculation
Qrono.prototype.plus = function (...args) {
  return plus.call(this, 1, ...args)
}

Qrono.prototype.minus = function (...args) {
  return plus.call(this, -1, ...args)
}

function plus(sign, ...args) {
  const arg0 = args[0]
  const arg1 = args[1]
  if (Number.isFinite(arg0) && !Number.isFinite(arg1)) {
    return this.clone(this.numeric() + arg0)
  }
  let timeFields = null
  if (isObject(arg0)) {
    if (!hasDatetimeField(arg0)) {
      throw RangeError(
        'Missing time field' +
          ' (year, minute, day, hour, minute, second or millisecond)'
      )
    }
    timeFields = arg0
  } else if (Number.isFinite(arg0) || Array.isArray(arg0)) {
    const values = args.flat().filter(v => Number.isSafeInteger(v))
    if (values.length !== args.flat().length) {
      throw RangeError('Should be safe integers')
    }
    if (values.length > 7) {
      throw RangeError('Too many numbers')
    }
    timeFields = {
      year: args[0],
      month: args[1],
      day: args[2],
      hour: args[3],
      minute: args[4],
      second: args[5],
      millisecond: args[6],
    }
  } else {
    throw TypeError()
  }
  const date = this.nativeDate()
  const utc = this[internal].localtime ? '' : 'UTC'
  if (has(timeFields, 'year') || has(timeFields, 'month')) {
    const year = this.year() + sign * (timeFields.year ?? 0)
    const month = this.month() + sign * (timeFields.month ?? 0)
    const endOfMonth = new Date(date.getTime())
    endOfMonth[`set${utc}FullYear`](year, month, 0)
    const lastDay = endOfMonth.getDate()
    if (lastDay < this.day()) {
      date[`set${utc}FullYear`](year, endOfMonth[`get${utc}Month`](), lastDay)
    } else {
      date[`set${utc}FullYear`](year, month - 1)
    }
  }
  if (has(timeFields, 'day')) {
    date[`set${utc}Date`](date[`get${utc}Date`]() + sign * timeFields.day)
  }
  ;[
    ['hour', 'Hours'],
    ['minute', 'Minutes'],
    ['second', 'Seconds'],
    ['millisecond', 'Milliseconds'],
  ].forEach(([key, nativeKey]) => {
    if (has(timeFields, key)) {
      date[`setUTC${nativeKey}`](
        date[`getUTC${nativeKey}`]() + sign * timeFields[key]
      )
    }
  })
  return this.clone(asDst(this[internal].interpretAsDst, date))
}

// -----------------------------------------------------------------------------
// QronoDate Class
// -----------------------------------------------------------------------------
const internalDate = Symbol('QronoDate.internal')

function QronoDate(...args) {
  if (!new.target) {
    return new QronoDate(...args)
  }
  const self = (this[internalDate] = {
    datetime: null,
  })
  let source = null
  if (args[0] instanceof QronoDate) {
    source = args.shift().toDatetime()
  }
  const first = args[0]
  const second = args[1]
  if (Number.isFinite(first) && !Number.isFinite(second)) {
    args[0] *= millisecondsPerDay
  }
  source = (source ? source.clone(...args) : qrono(...args)).startOfDay()
  self.datetime = qrono({ localtime: false }, source.toObject())
  return this
}

QronoDate.prototype.toString = function () {
  return this[internalDate].datetime.toString().substring(0, 10)
}

QronoDate.prototype.valueOf = function () {
  return this[internalDate].datetime / millisecondsPerDay
}

QronoDate.prototype.valid = function () {
  return this[internalDate].datetime.valid()
}

QronoDate.prototype.clone = function (...args) {
  return new QronoDate(this, ...args)
}

QronoDate.prototype.toDatetime = function () {
  return qrono(this[internalDate].datetime.toArray())
}

QronoDate.prototype.numeric = function () {
  return this[internalDate].datetime.numeric() / millisecondsPerDay
}

QronoDate.prototype.toObject = function () {
  return {
    year: this.year(),
    month: this.month(),
    day: this.day(),
  }
}

QronoDate.prototype.toArray = function () {
  return [this.year(), this.month(), this.day()]
}

QronoDate.prototype.startOfYear = function () {
  return new QronoDate(this[internalDate].datetime.startOfYear())
}

QronoDate.prototype.startOfMonth = function () {
  return new QronoDate(this[internalDate].datetime.startOfMonth())
}

QronoDate.prototype.startOfDay = function () {
  return this[internalDate].datetime.clone()
}
;['year', 'month', 'day'].forEach(field => {
  QronoDate.prototype[field] = function (value) {
    if (given(value)) {
      return new QronoDate(this[internalDate].datetime[field](value))
    }
    return this[internalDate].datetime[field]()
  }
})
;[
  'dayOfWeek',
  'dayOfYear',
  'weekOfYear',
  'yearOfWeek',
  'isLeapYear',
  'daysInMonth',
  'daysInYear',
  'weeksInYear',
].forEach(method => {
  QronoDate.prototype[method] = function () {
    return this[internalDate].datetime[method]()
  }
})
;['minutesInDay', 'hasDstInYear', 'isDstTransitionDay'].forEach(method => {
  QronoDate.prototype[method] = function () {
    return this[internalDate].datetime.localtime(true)[method]()
  }
})

QronoDate.prototype.endOfYear = function () {
  return this.clone({ month: 12, day: 31 })
}

QronoDate.prototype.endOfMonth = function () {
  return this.clone({ day: this.daysInMonth() })
}

QronoDate.prototype.isSame = function (another) {
  return +this === +another
}
QronoDate.prototype.isBefore = function (another) {
  return this < another
}
QronoDate.prototype.isAfter = function (another) {
  return this > another
}
QronoDate.prototype.isSameOrBefore = function (another) {
  return this <= another
}
QronoDate.prototype.isSameOrAfter = function (another) {
  return this >= another
}
QronoDate.prototype.isBetween = function (a, b) {
  return (a <= this && this <= b) || (b <= this && this <= a)
}

QronoDate.prototype.plus = function (...args) {
  return plusDate.call(this, 1, ...args)
}

QronoDate.prototype.minus = function (...args) {
  return plusDate.call(this, -1, ...args)
}

function plusDate(sign, ...args) {
  const arg0 = args[0]
  const arg1 = args[1]
  const datetime = this[internalDate].datetime
  if (Number.isFinite(arg0) && !Number.isFinite(arg1)) {
    return datetime.plus({ day: sign * arg0 }).toDate()
  }
  let timeFields = null
  if (isObject(arg0) && hasDatetimeField(arg0)) {
    timeFields = {
      year: sign * (arg0.year ?? 0),
      month: sign * (arg0.month ?? 0),
      day: sign * (arg0.day ?? 0),
    }
  } else if (Number.isFinite(arg0)) {
    if (args.length > 3) {
      throw RangeError('Too many arguments')
    }
    timeFields = { year: args[0], month: args[1], day: args[2] }
  } else if (Array.isArray(arg0)) {
    if (arg0.length > 3) {
      throw RangeError('Too many elements')
    }
    timeFields = { year: arg0[0], month: arg0[1], day: arg0[2] }
  } else {
    throw TypeError()
  }
  return datetime.plus(timeFields).toDate()
}
