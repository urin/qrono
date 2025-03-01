import {
  given,
  millisecondsPerDay
} from './helpers.js'
import { qrono } from './qrono.js'

const internal = Symbol('QronoDate.internal')

export default function QronoDate (...args) {
  if (!new.target) { return new QronoDate(...args) }
  const self = this[internal] = {
    datetime: null
  }
  let source = null
  if (args[0] instanceof QronoDate) {
    source = args.shift().toDatetime()
  }
  const first = args[0]
  const second = args[1]
  if (Number.isFinite(first) && !Number.isFinite(second)) {
    args[0] *= millisecondsPerDay
  }
  source = (
    source ? source.clone(...args) : qrono(...args)
  ).startOfDay()
  self.datetime = qrono({ localtime: false }, source.toObject())
  return this
}

QronoDate.prototype.toString = function () {
  return this[internal].datetime.toString().substring(0, 10)
}

QronoDate.prototype.valueOf = function () {
  return this[internal].datetime / millisecondsPerDay
}

QronoDate.prototype.clone = function (...args) {
  return new QronoDate(this, ...args)
}

QronoDate.prototype.toDatetime = function () {
  return qrono(this[internal].datetime.toArray())
}

QronoDate.prototype.numeric = function () {
  return this[internal].datetime.numeric() / millisecondsPerDay
}

QronoDate.prototype.startOfYear = function () {
  return new QronoDate(this[internal].datetime.startOfYear())
}

QronoDate.prototype.startOfMonth = function () {
  return new QronoDate(this[internal].datetime.startOfMonth())
}

;['year', 'month', 'day'].forEach(field => {
  QronoDate.prototype[field] = function (value) {
    if (given(value)) {
      return new QronoDate(this[internal].datetime[field](value))
    }
    return this[internal].datetime[field]()
  }
})

;[
  'dayOfWeek', 'dayOfYear', 'weekOfYear', 'yearOfWeek',
  'isLeapYear', 'daysInMonth', 'daysInYear', 'weeksInYear'
].forEach(method => {
  QronoDate.prototype[method] = function () {
    return this[internal].datetime[method]()
  }
})

QronoDate.prototype.isDstTransitionDay = function () {
  return this[internal].datetime.localtime(true).isDstTransitionDay()
}

QronoDate.prototype.endOfYear = function () {
  return this.clone({ month: 12, day: 31 })
}

QronoDate.prototype.endOfMonth = function () {
  return this.clone({ day: this.daysInMonth() })
}

QronoDate.prototype.plus = function (...args) {
  return this[internal].datetime.plus(...args).toDate()
}

QronoDate.prototype.minus = function (...args) {
  return this[internal].datetime.minus(...args).toDate()
}
