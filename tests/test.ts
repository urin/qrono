import { test, expect, beforeEach, afterEach } from 'vitest'
import { qrono } from '../src/qrono.js'
import MockDate from 'mockdate'

beforeEach(() => {
  MockDate.set(new Date())
  qrono.context({ localtime: false, ambiguousAsDst: false })
})

afterEach(() => {
  MockDate.reset()
})

function dateText(date?) {
  let dateObject = null
  if (date === undefined) {
    dateObject = new Date()
  } else if (date instanceof Date) {
    dateObject = new Date(date.getTime())
  } else if (Number.isSafeInteger(date)) {
    dateObject = new Date(date)
  } else if (typeof date === 'string' || date instanceof String) {
    dateObject = new Date(date as string)
  }
  return dateObject.toISOString()
}

test('Static', () => {
  expect(qrono.localtime(true).localtime()).toBe(true)
  expect(qrono.localtime(false).localtime()).toBe(false)
  expect(qrono.asUtc().localtime()).toBe(false)
  expect(qrono.asLocaltime().localtime()).toBe(true)
  expect(qrono.monday).toBe(1)
  expect(qrono.tuesday).toBe(2)
  expect(qrono.wednesday).toBe(3)
  expect(qrono.thursday).toBe(4)
  expect(qrono.friday).toBe(5)
  expect(qrono.saturday).toBe(6)
  expect(qrono.sunday).toBe(7)
})

test('toString', () => {
  expect(qrono().toString()).toBe(dateText())
})

test('Construction', () => {
  expect(qrono().numeric()).toBe(Date.now())
  expect(+qrono()).toBe(Date.now())
  expect(qrono(new Date()).toString()).toBe(dateText())
  expect(qrono(qrono(2020, 10)).toString()).toBe(dateText(Date.UTC(2020, 9)))
  expect(qrono({ year: 10, month: 1, day: 2 }).month(2).toString()).toBe(
    '0010-02-02T00:00:00.000Z'
  )
})

test('Construction from string', () => {
  expect(qrono('2021-09-30T12:34:56.789Z').toString()).toBe(
    dateText('2021-09-30T12:34:56.789Z')
  )
  expect(qrono('2021-09-30T12:34:56.7Z').toString()).toBe(
    dateText('2021-09-30T12:34:56.7Z')
  )
  expect(qrono('2021-09-30T12:00').toString()).toBe(
    dateText('2021-09-30T12:00:00Z')
  )
  expect(qrono('2021-09-30').toString()).toBe(dateText('2021-09-30Z'))
  expect(qrono('2021-09').toString()).toBe(dateText('2021-09Z'))
  expect(qrono('2021').toString()).toBe(dateText('2021Z'))
})

test('Construction from number', () => {
  expect(qrono(Date.now()).toString()).toBe(dateText(Date.now()))
  expect(qrono(2021, 12, 31, 12, 34, 56, 987).toString()).toBe(
    dateText(Date.UTC(2021, 11, 31, 12, 34, 56, 987))
  )
  expect(qrono(2021, 12).toString()).toBe(
    dateText(Date.UTC(2021, 11, 1, 0, 0, 0, 0))
  )
  expect(qrono([2021, 12, 31, 12, 34, 56, 987]).toString()).toBe(
    dateText(Date.UTC(2021, 11, 31, 12, 34, 56, 987))
  )
  expect(qrono([2021]).toString()).toBe(dateText(Date.UTC(2021, 0)))
})

test('Accessor', () => {
  expect(
    qrono().context({ localtime: true, ambiguousAsDst: true }).context()
  ).toEqual({ localtime: true, ambiguousAsDst: true })
  expect(qrono().nativeDate().toISOString()).toBe(dateText())
  expect(qrono().offset()).toBe(0)
  expect(qrono().localtime(true).localtime()).toBe(true)
  expect(qrono().ambiguousAsDst(true).ambiguousAsDst()).toBe(true)
  expect(qrono().valid()).toBe(true)
  expect(qrono(new Date(NaN)).valid()).toBe(false)
  expect(qrono().numeric()).toBe(qrono().valueOf())
  const value = {
    year: 2021,
    month: 9,
    day: 30,
    hour: 12,
    minute: 34,
    second: 56,
    millisecond: 789,
  }
  expect(qrono(value).toObject()).toEqual(value)
  expect(qrono(value).toArray()).toEqual([2021, 9, 30, 12, 34, 56, 789])
  expect(qrono().toDate()).toEqual(qrono.date())
  expect(qrono().localtime(true).asUtc().localtime()).toBe(false)
  expect(qrono().localtime(false).asLocaltime().localtime()).toBe(true)
})

test('Getter', () => {
  const time = qrono('2021-09-30 12:34:56.789')
  expect(time.year()).toBe(2021)
  expect(time.month()).toBe(9)
  expect(time.day()).toBe(30)
  expect(time.hour()).toBe(12)
  expect(time.minute()).toBe(34)
  expect(time.second()).toBe(56)
  expect(time.millisecond()).toBe(789)
  expect(time.startOfYear().toArray()).toEqual([2021, 1, 1, 0, 0, 0, 0])
  expect(time.startOfMonth().toArray()).toEqual([2021, 9, 1, 0, 0, 0, 0])
  expect(time.startOfDay().toArray()).toEqual([2021, 9, 30, 0, 0, 0, 0])
  expect(time.startOfHour().toArray()).toEqual([2021, 9, 30, 12, 0, 0, 0])
  expect(time.startOfMinute().toArray()).toEqual([2021, 9, 30, 12, 34, 0, 0])
  expect(time.startOfSecond().toArray()).toEqual([2021, 9, 30, 12, 34, 56, 0])
  expect(time.dayOfWeek()).toBe(qrono.thursday)
  expect(time.dayOfYear()).toBe(273)
  expect(qrono(2025, 12, 28).weekOfYear()).toBe(52)
  expect(qrono(2025, 12, 29).weekOfYear()).toBe(1)
  expect(qrono(2026, 1, 1).weekOfYear()).toBe(1)
  expect(qrono(2026, 1, 4).weekOfYear()).toBe(1)
  expect(qrono(2026, 1, 5).weekOfYear()).toBe(2)
  expect(qrono(2025, 12, 28).yearOfWeek()).toBe(2025)
  expect(qrono(2025, 12, 29).yearOfWeek()).toBe(2026)
  expect(qrono(2040, 1).isLeapYear()).toBe(true)
  expect(qrono(2041, 1).isLeapYear()).toBe(false)
  expect(qrono('1950-05-07 00:00:00.000').daysInMonth()).toBe(31)
  expect(qrono('1950-02-07 00:00:00.000').daysInMonth()).toBe(28)
  expect(qrono('1950-02-07 00:00:00.000').daysInYear()).toBe(365)
  expect(qrono('1952-02-07 00:00:00.000').daysInYear()).toBe(366)
  expect(qrono('1950-02-07 00:00:00.000').weeksInYear()).toBe(52)
  expect(qrono('1953-02-07 00:00:00.000').weeksInYear()).toBe(53)
})

test('Localtime', () => {
  const time = qrono({ localtime: true }, '2021-09-30 12:34:56.789')
  expect(time.year()).toBe(2021)
  expect(time.month()).toBe(9)
  expect(time.day()).toBe(30)
  expect(time.hour()).toBe(12)
  expect(time.minute()).toBe(34)
  expect(time.second()).toBe(56)
  expect(time.millisecond()).toBe(789)
  expect(time.startOfYear().toArray()).toEqual([2021, 1, 1, 0, 0, 0, 0])
  expect(time.startOfMonth().toArray()).toEqual([2021, 9, 1, 0, 0, 0, 0])
  expect(time.startOfDay().toArray()).toEqual([2021, 9, 30, 0, 0, 0, 0])
  expect(time.startOfHour().toArray()).toEqual([2021, 9, 30, 12, 0, 0, 0])
  expect(time.startOfMinute().toArray()).toEqual([2021, 9, 30, 12, 34, 0, 0])
  expect(time.startOfSecond().toArray()).toEqual([2021, 9, 30, 12, 34, 56, 0])
  expect(time.dayOfWeek()).toBe(qrono.thursday)
  expect(time.dayOfYear()).toBe(273)
  qrono.asLocaltime()
  expect(qrono(2025, 12, 28).weekOfYear()).toBe(52)
  expect(qrono(2025, 12, 29).weekOfYear()).toBe(1)
  expect(qrono(2026, 1, 1).weekOfYear()).toBe(1)
  expect(qrono(2026, 1, 4).weekOfYear()).toBe(1)
  expect(qrono(2026, 1, 5).weekOfYear()).toBe(2)
  expect(qrono(2025, 12, 28).yearOfWeek()).toBe(2025)
  expect(qrono(2025, 12, 29).yearOfWeek()).toBe(2026)
  expect(qrono(2040, 1).isLeapYear()).toBe(true)
  expect(qrono(2041, 1).isLeapYear()).toBe(false)
  expect(qrono('1950-05-07 00:00:00.000').daysInMonth()).toBe(31)
  expect(qrono('1950-02-07 00:00:00.000').daysInMonth()).toBe(28)
  expect(qrono('1950-02-07 00:00:00.000').daysInYear()).toBe(365)
  expect(qrono('1952-02-07 00:00:00.000').daysInYear()).toBe(366)
  expect(qrono('1950-02-07 00:00:00.000').weeksInYear()).toBe(52)
  expect(qrono('1953-02-07 00:00:00.000').weeksInYear()).toBe(53)
})

test('Calculation and comparison', () => {
  expect(qrono(2020, 2, 29).plus({ year: 1 }).toString()).toBe(
    '2021-02-28T00:00:00.000Z'
  )
  expect(qrono(2021, 12, 31).plus({ day: 1 }).toString()).toBe(
    '2022-01-01T00:00:00.000Z'
  )
  expect(qrono(2021, 12, 31).minus({ millisecond: 1 }).toString()).toBe(
    '2021-12-30T23:59:59.999Z'
  )
  expect(qrono(2021, 12, 31).minus({ month: 1 }).toString()).toBe(
    '2021-11-30T00:00:00.000Z'
  )
  expect(qrono().isSame(qrono())).toBe(true)
  expect(qrono().isSame(new Date())).toBe(true)
  expect(qrono().isSame(Date.now())).toBe(true)
  expect(qrono(1234, 12, 31).isSame(qrono())).toBe(false)
  expect(qrono('1111 11:11:11.998').isBefore(qrono('1111 11:11:11.999'))).toBe(
    true
  )
  expect(qrono('1111 11:11:11.999').isBefore(qrono('1111 11:11:11.999'))).toBe(
    false
  )
  expect(
    qrono('1111 11:11:11.997').isSameOrBefore(qrono('1111 11:11:11.998'))
  ).toBe(true)
  expect(
    qrono('1111 11:11:11.997').isSameOrBefore(qrono('1111 11:11:11.997'))
  ).toBe(true)
  expect(
    qrono('1111 11:11:11.997').isSameOrBefore(qrono('1111 11:11:11.996'))
  ).toBe(false)
  expect(qrono('1111 11:11:11.997').isAfter(qrono('1111 11:11:11.997'))).toBe(
    false
  )
  expect(qrono('1111 11:11:11.997').isAfter(qrono('1111 11:11:11.996'))).toBe(
    true
  )
  expect(
    qrono('1111 11:11:11.997').isSameOrAfter(qrono('1111 11:11:11.998'))
  ).toBe(false)
  expect(
    qrono('1111 11:11:11.997').isSameOrAfter(qrono('1111 11:11:11.997'))
  ).toBe(true)
  expect(
    qrono('1111 11:11:11.997').isSameOrAfter(qrono('1111 11:11:11.996'))
  ).toBe(true)
  expect(
    qrono('1111 11:11:11.997').isBetween(
      qrono('1111 11:11:11.997'),
      qrono('1111 11:11:11.997')
    )
  ).toBe(true)
  expect(
    qrono('1111 11:11:11.997').isBetween(
      qrono('1111 11:11:11.998'),
      qrono('1111 11:11:11.997')
    )
  ).toBe(true)
  expect(
    qrono('1111 11:11:11.997').isBetween(
      qrono('1111 11:11:11.998'),
      qrono('1111 11:11:11.998')
    )
  ).toBe(false)
})

test('Daylight saving time', () => {
  qrono.context({ localtime: true, ambiguousAsDst: true })
  expect(qrono(1950, 1).hasDstInYear()).toBe(true)
  expect(qrono(1954, 1).hasDstInYear()).toBe(false)
  expect(qrono('1950-09-10 00:59:59.999').isInDst()).toBe(true)
  expect(qrono('1950-09-10 01:00:00.000').isInDst()).toBe(false)
  expect(qrono('1950-05-06 00:00:00.000').minutesInDay()).toBe(1440)
  expect(qrono('1950-05-06 23:59:59.999').minutesInDay()).toBe(1440)
  expect(qrono('1950-05-07 00:00:00.000').minutesInDay()).toBe(1380)
  expect(qrono('1950-09-09 23:59:59:999').minutesInDay()).toBe(1440)
  expect(qrono('1950-09-10 00:00:00.000').minutesInDay()).toBe(1500)
  expect(qrono('1950-09-10 01:00:00.000').minutesInDay()).toBe(1500)
  expect(qrono('1950-05-06 23:59:59.999').isDstTransitionDay()).toBe(false)
  expect(qrono('1950-05-07 00:00:00.000').isDstTransitionDay()).toBe(true)
  expect(qrono('1950-09-09 23:59:59.999').isDstTransitionDay()).toBe(false)
  expect(qrono('1950-09-10 01:00:00.000').isDstTransitionDay()).toBe(true)
  qrono.context({ localtime: true, ambiguousAsDst: false })
  expect(qrono('1950-05-07 01:00:00.000').minutesInDay()).toBe(1380)
  expect(qrono('1950-09-10 00:00:00.000').minutesInDay()).toBe(1500)
  qrono.context({ ambiguousAsDst: false })
  ;[
    { q: '1950-05-06 23:59:59.999', a: '1950-05-06T23:59:59.999+09:00' },
    { q: '1950-05-07 00:00:00.000', a: '1950-05-07T01:00:00.000+10:00' },
    { q: '1950-05-07 01:00:00.000', a: '1950-05-07T01:00:00.000+10:00' },
    { q: '1950-09-09 23:59:59.999', a: '1950-09-09T23:59:59.999+10:00' },
    { q: '1950-09-10 00:59:59.999', a: '1950-09-10T00:59:59.999+10:00' },
    { q: '1950-09-10 01:00:00.000', a: '1950-09-10T01:00:00.000+09:00' },
  ].forEach(({ q, a }) => {
    expect(qrono(q).toString()).toBe(a)
  })
  qrono.context({ ambiguousAsDst: true })
  ;[
    { q: '1950-05-06 23:59:59.999', a: '1950-05-06T23:59:59.999+09:00' },
    { q: '1950-05-07 00:00:00.000', a: '1950-05-07T01:00:00.000+10:00' },
    { q: '1950-05-07 01:00:00.000', a: '1950-05-07T01:00:00.000+10:00' },
    { q: '1950-09-09 23:59:59.999', a: '1950-09-09T23:59:59.999+10:00' },
    { q: '1950-09-10 00:59:59.999', a: '1950-09-10T00:59:59.999+10:00' },
    { q: '1950-09-10 01:00:00.000', a: '1950-09-10T01:00:00.000+09:00' },
  ].forEach(({ q, a }) => {
    expect(qrono(q).toString()).toBe(a)
  })
})

test('QronoDate', () => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const todayNumeric = Math.trunc(Date.now() / millisecondsPerDay)
  const todayString = dateText(Date.now()).substring(0, 10)
  expect(qrono.date().numeric()).toBe(todayNumeric)
  expect(+qrono.date()).toBe(todayNumeric)
  expect(qrono.date(todayNumeric).toString()).toBe(todayString)
  expect(qrono.date(new Date()).toString()).toBe(todayString)
  expect(qrono.date(qrono(2020, 10)).toString()).toBe(
    dateText(Date.UTC(2020, 9)).substring(0, 10)
  )
  qrono.asLocaltime()
  expect(qrono.date(2000, 1, 1).toDatetime().toString()).toBe(
    '2000-01-01T00:00:00.000+09:00'
  )
  expect(qrono.date(3000, 12, 31).startOfYear().toString()).toBe('3000-01-01')
  expect(qrono.date(3000, 12, 31).startOfMonth().toString()).toBe('3000-12-01')
  expect(qrono.date(2999, 12, 31).year()).toBe(2999)
  expect(qrono.date(2999, 12, 31).month()).toBe(12)
  expect(qrono.date(2999, 12, 31).day()).toBe(31)

  const time = qrono.date('2021-09-30')
  expect(time.dayOfWeek()).toBe(qrono.thursday)
  expect(time.dayOfYear()).toBe(273)
  expect(qrono.date(2025, 12, 28).weekOfYear()).toBe(52)
  expect(qrono.date(2025, 12, 29).weekOfYear()).toBe(1)
  expect(qrono.date(2026, 1, 1).weekOfYear()).toBe(1)
  expect(qrono.date(2026, 1, 4).weekOfYear()).toBe(1)
  expect(qrono.date(2026, 1, 5).weekOfYear()).toBe(2)
  expect(qrono.date(2025, 12, 28).yearOfWeek()).toBe(2025)
  expect(qrono.date(2025, 12, 29).yearOfWeek()).toBe(2026)
  expect(qrono.date(2040, 1).isLeapYear()).toBe(true)
  expect(qrono.date(2041, 1).isLeapYear()).toBe(false)
  expect(qrono.date('1950-05-07').daysInMonth()).toBe(31)
  expect(qrono.date('1950-02-07').daysInMonth()).toBe(28)
  expect(qrono.date('1950-05-06').isDstTransitionDay()).toBe(false)
  expect(qrono.date('1950-05-07').isDstTransitionDay()).toBe(true)
  expect(qrono.date('1950-09-09').isDstTransitionDay()).toBe(false)
  expect(qrono.date('1950-09-10').isDstTransitionDay()).toBe(true)
  expect(qrono.date(2025, 12, 29).endOfYear()).toEqual(qrono.date(2025, 12, 31))
  expect(qrono.date(2025, 12, 29).endOfMonth()).toEqual(
    qrono.date(2025, 12, 31)
  )
  expect(qrono.date(2021, 12, 31).plus({ day: 1 }).toString()).toBe(
    '2022-01-01'
  )
  expect(qrono.date(2021, 12, 31).minus({ month: 1 }).toString()).toBe(
    '2021-11-30'
  )
  expect(qrono.date('2021-09-30').valid()).toBe(true)
  expect(qrono.date(new Date('invalid')).valid()).toBe(false)
  expect(qrono.date(2021, 9, 30).valid()).toBe(true)

  expect(qrono.date('2021-09-30').toArray()).toEqual([2021, 9, 30])
  expect(qrono.date(2025, 12, 31).toArray()).toEqual([2025, 12, 31])
  expect(qrono.date(1999, 1, 1).toArray()).toEqual([1999, 1, 1])

  const dateObj = qrono.date('2021-09-30').toObject()
  expect(dateObj).toEqual({
    year: 2021,
    month: 9,
    day: 30,
  })
  expect(dateObj).not.toHaveProperty('hour')
  expect(dateObj).not.toHaveProperty('minute')
  expect(dateObj).not.toHaveProperty('second')
  expect(dateObj).not.toHaveProperty('millisecond')

  const date = qrono.date('2021-09-30')
  const startOfDay = date.startOfDay()
  expect(startOfDay.isSame(qrono('2021-09-30'))).toBe(true)

  expect(qrono.date('1950-05-06').minutesInDay()).toBe(1440)
  expect(qrono.date('1950-05-07').minutesInDay()).toBe(1380)
  expect(qrono.date('1950-09-10').minutesInDay()).toBe(1500)

  expect(qrono.date('1950-01-01').hasDstInYear()).toBe(true)
  expect(qrono.date('1954-01-01').hasDstInYear()).toBe(false)
  expect(qrono.date('2021-06-15').hasDstInYear()).toBe(false)

  const date1 = qrono.date('2021-09-30')
  const date2 = qrono.date('2021-09-30')
  const date3 = qrono.date('2021-10-01')
  const date4 = qrono.date('2021-09-29')

  expect(date1.isSame(date2)).toBe(true)
  expect(date1.isSame(date3)).toBe(false)
  expect(date1.isSame(qrono.date('2021-09-30'))).toBe(true)

  expect(date1.isBefore(date3)).toBe(true)
  expect(date1.isBefore(date4)).toBe(false)
  expect(date1.isBefore(date2)).toBe(false)

  expect(date1.isAfter(date4)).toBe(true)
  expect(date1.isAfter(date3)).toBe(false)
  expect(date1.isAfter(date2)).toBe(false)

  expect(date1.isSameOrBefore(date2)).toBe(true)
  expect(date1.isSameOrBefore(date3)).toBe(true)
  expect(date1.isSameOrBefore(date4)).toBe(false)

  expect(date1.isSameOrAfter(date2)).toBe(true)
  expect(date1.isSameOrAfter(date4)).toBe(true)
  expect(date1.isSameOrAfter(date3)).toBe(false)

  expect(date1.isBetween(date4, date3)).toBe(true)
  expect(date1.isBetween(date3, date4)).toBe(true)
  expect(date1.isBetween(date2, date2)).toBe(true)
  expect(date3.isBetween(date1, date2)).toBe(false)
  expect(date4.isBetween(date1, date3)).toBe(false)

  const dateNumeric = +date1
  expect(date1.isSame(dateNumeric)).toBe(true)
  expect(date1.isBefore(dateNumeric + 1)).toBe(true)
  expect(date1.isAfter(dateNumeric - 1)).toBe(true)

  qrono.asUtc()

  const testDate = qrono.date(2022, 6, 15)
  const arr = testDate.toArray()
  const obj = testDate.toObject()

  expect(arr[0]).toBe(obj.year)
  expect(arr[1]).toBe(obj.month)
  expect(arr[2]).toBe(obj.day)

  const earlyDate = qrono.date('1900-01-01')
  const lateDate = qrono.date('2100-12-31')

  expect(earlyDate.isBefore(lateDate)).toBe(true)
  expect(lateDate.isAfter(earlyDate)).toBe(true)
  expect(earlyDate.isBetween(earlyDate, lateDate)).toBe(true)
  expect(lateDate.isBetween(earlyDate, lateDate)).toBe(true)

  qrono.asUtc()

  const baseDate = qrono.date('2021-09-30')

  const nextDay = baseDate.plus({ day: 1 })
  expect(nextDay.toString()).toBe('2021-10-01')
  expect(nextDay.toArray()).toEqual([2021, 10, 1])
  expect(nextDay.valid()).toBe(true)

  const prevMonth = baseDate.minus({ month: 1 })
  expect(prevMonth.toString()).toBe('2021-08-30')
  expect(prevMonth.toObject()).toEqual({ year: 2021, month: 8, day: 30 })

  expect(nextDay.isAfter(baseDate)).toBe(true)
  expect(prevMonth.isBefore(baseDate)).toBe(true)
  expect(baseDate.isBetween(prevMonth, nextDay)).toBe(true)
})
