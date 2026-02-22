import { test, expect, beforeEach, afterEach } from 'vitest'
import { qrono } from '../src/qrono.js'
import MockDate from 'mockdate'

// America/Sao_Paulo
//   spring forward (gap)  : 2018-11-03 24:00 → 2018-11-04 01:00  (-03:00 → -02:00)
//                           local 2018-11-04 00:00–00:59 does not exist
//   fall back   (overlap) : 2019-02-16 24:00 → 2019-02-16 23:00  (-02:00 → -03:00)
//                           local 2019-02-16 23:00–23:59 occurs twice
process.env.TZ = 'America/Sao_Paulo'

beforeEach(() => {
  MockDate.set(new Date())
  qrono.context({ localtime: false, interpretAsDst: false })
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

// ---------------------------------------------------------------------------
// Static / Construction / Accessor
// ---------------------------------------------------------------------------

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
    qrono().context({ localtime: true, interpretAsDst: true }).context()
  ).toEqual({ localtime: true, interpretAsDst: true })
  expect(qrono().nativeDate().toISOString()).toBe(dateText())
  expect(qrono().offset()).toBe(0)
  expect(qrono().localtime(true).localtime()).toBe(true)
  expect(qrono().interpretAsDst(true).interpretAsDst()).toBe(true)
  expect(qrono().valid()).toBe(true)
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

// ---------------------------------------------------------------------------
// Getter (UTC)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Localtime getter (DST-independent baseline)
// ---------------------------------------------------------------------------

test('Localtime basic getter', () => {
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
})

// ---------------------------------------------------------------------------
// Calculation and comparison (DST-independent baseline)
// ---------------------------------------------------------------------------

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
  expect(qrono(2021, 9, 30).isBefore(qrono(2021, 10, 1))).toBe(true)
  expect(qrono(2021, 9, 30).isBefore(qrono(2021, 9, 30))).toBe(false)
  expect(qrono(2021, 9, 30).isAfter(qrono(2021, 9, 29))).toBe(true)
  expect(qrono(2021, 9, 30).isAfter(qrono(2021, 9, 30))).toBe(false)
  expect(qrono(2021, 9, 30).isSameOrBefore(qrono(2021, 9, 30))).toBe(true)
  expect(qrono(2021, 9, 30).isSameOrBefore(qrono(2021, 10, 1))).toBe(true)
  expect(qrono(2021, 9, 30).isSameOrBefore(qrono(2021, 9, 29))).toBe(false)
  expect(qrono(2021, 9, 30).isSameOrAfter(qrono(2021, 9, 30))).toBe(true)
  expect(qrono(2021, 9, 30).isSameOrAfter(qrono(2021, 9, 29))).toBe(true)
  expect(qrono(2021, 9, 30).isSameOrAfter(qrono(2021, 10, 1))).toBe(false)
  expect(
    qrono(2021, 9, 30).isBetween(qrono(2021, 9, 29), qrono(2021, 10, 1))
  ).toBe(true)
  expect(
    qrono(2021, 9, 30).isBetween(qrono(2021, 9, 30), qrono(2021, 9, 30))
  ).toBe(true)
  expect(
    qrono(2021, 10, 1).isBetween(qrono(2021, 9, 29), qrono(2021, 9, 30))
  ).toBe(false)

  const plusByArray = qrono('2024-01-01T00:00:00.000Z').plus([0, 1, 1, 4])
  expect(plusByArray.valid()).toBe(true)
  expect(plusByArray.toString()).toBe('2024-02-02T04:00:00.000Z')

  const minusByArray = qrono('2024-01-01T12:00:00.000Z').minus([0, 0, 0, 6])
  expect(minusByArray.valid()).toBe(true)
  expect(minusByArray.toString()).toBe('2024-01-01T06:00:00.000Z')
})

// ---------------------------------------------------------------------------
// Daylight saving time (localtime mode)
// ---------------------------------------------------------------------------
// Abbreviations used in test names:
//   GAP     = spring forward: 2018-11-04 local 00:00–00:59 does not exist
//   OVERLAP = fall back:      2019-02-16 local 23:00–23:59 occurs twice

test('Daylight saving time — hasDstInYear / isInDst', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  expect(qrono(2018, 1).hasDstInYear()).toBe(true)
  expect(qrono(2020, 1).hasDstInYear()).toBe(false) // DST was abolished in 2020

  // isInDst around GAP
  expect(qrono('2018-11-03 23:59:59.999').isInDst()).toBe(false) // just before: standard time
  expect(qrono('2018-11-04 01:00:00.000').isInDst()).toBe(true) // just after GAP: DST

  // isInDst around OVERLAP
  expect(qrono('2019-02-16 23:59:59.999').isInDst()).toBe(true) // just before: DST side (interpretAsDst=true)
  expect(qrono('2019-02-17 00:00:00.000').isInDst()).toBe(false) // next day: standard time
})

test('Daylight saving time — isDstTransitionDay', () => {
  qrono.context({ localtime: true, interpretAsDst: false })

  // GAP day
  expect(qrono('2018-11-03 23:59:59.999').isDstTransitionDay()).toBe(false) // day before
  expect(qrono('2018-11-04 01:00:00.000').isDstTransitionDay()).toBe(true) // GAP day
  expect(qrono('2018-11-05 00:00:00.000').isDstTransitionDay()).toBe(false) // day after

  // OVERLAP day
  expect(qrono('2019-02-15 23:59:59.999').isDstTransitionDay()).toBe(false) // day before
  expect(qrono('2019-02-16 23:59:59.999').isDstTransitionDay()).toBe(true) // OVERLAP day
  expect(qrono('2019-02-17 00:00:00.000').isDstTransitionDay()).toBe(false) // day after

  // QronoDate behaves the same
  expect(qrono.date('2018-11-03').isDstTransitionDay()).toBe(false)
  expect(qrono.date('2018-11-04').isDstTransitionDay()).toBe(true)
  expect(qrono.date('2019-02-15').isDstTransitionDay()).toBe(false)
  expect(qrono.date('2019-02-16').isDstTransitionDay()).toBe(true)
})

test('Daylight saving time — minutesInDay', () => {
  qrono.context({ localtime: true, interpretAsDst: false })

  // GAP day is 60 min shorter (1380 min)
  expect(qrono('2018-11-03 23:59:59.999').minutesInDay()).toBe(1440) // day before
  expect(qrono('2018-11-04 01:00:00.000').minutesInDay()).toBe(1380) // GAP day
  expect(qrono('2018-11-04 23:59:59.999').minutesInDay()).toBe(1380) // GAP day end
  expect(qrono('2018-11-05 00:00:00.000').minutesInDay()).toBe(1440) // day after

  // OVERLAP day is 60 min longer (1500 min)
  expect(qrono('2019-02-15 23:59:59.999').minutesInDay()).toBe(1440) // day before
  expect(qrono('2019-02-16 00:00:00.000').minutesInDay()).toBe(1500) // OVERLAP day start
  expect(qrono('2019-02-16 23:59:59.999').minutesInDay()).toBe(1500) // OVERLAP day end
  expect(qrono('2019-02-17 00:00:00.000').minutesInDay()).toBe(1440) // day after

  // interpretAsDst does not affect minutesInDay
  qrono.context({ interpretAsDst: true })
  expect(qrono('2018-11-04 01:00:00.000').minutesInDay()).toBe(1380)
  expect(qrono('2019-02-16 23:59:59.999').minutesInDay()).toBe(1500)

  // QronoDate behaves the same
  qrono.context({ interpretAsDst: false })
  expect(qrono.date('2018-11-03').minutesInDay()).toBe(1440)
  expect(qrono.date('2018-11-04').minutesInDay()).toBe(1380)
  expect(qrono.date('2019-02-16').minutesInDay()).toBe(1500)
})

test('Daylight saving time — toString / offset (interpretAsDst=true, GAP)', () => {
  // GAP: local 2018-11-04 00:00–00:59 does not exist
  // interpretAsDst=true → ambiguous local time is mapped to the DST side (-02:00)
  qrono.context({ localtime: true, interpretAsDst: true })

  expect(qrono('2018-11-03 23:59:59.999').toString()).toBe(
    '2018-11-03T23:59:59.999-03:00' // just before GAP: standard time
  )
  expect(qrono('2018-11-04 00:00:00.000').toString()).toBe(
    '2018-11-04T01:00:00.000-02:00' // inside GAP: forwarded to DST side
  )
  expect(qrono('2018-11-04 00:30:00.000').toString()).toBe(
    '2018-11-04T01:30:00.000-02:00'
  )
  expect(qrono('2018-11-04 01:00:00.000').toString()).toBe(
    '2018-11-04T01:00:00.000-02:00' // just after GAP: DST
  )
})

test('Daylight saving time — toString / offset (interpretAsDst=false, GAP)', () => {
  // interpretAsDst=false → ambiguous local time is mapped to the standard side (-03:00)
  qrono.context({ localtime: true, interpretAsDst: false })

  expect(qrono('2018-11-03 23:59:59.999').toString()).toBe(
    '2018-11-03T23:59:59.999-03:00'
  )
  expect(qrono('2018-11-04 00:00:00.000').toString()).toBe(
    '2018-11-03T23:00:00.000-03:00' // inside GAP: mapped to standard side
  )
  expect(qrono('2018-11-04 00:30:00.000').toString()).toBe(
    '2018-11-03T23:30:00.000-03:00'
  )
  expect(qrono('2018-11-04 01:00:00.000').toString()).toBe(
    '2018-11-04T01:00:00.000-02:00' // outside GAP: DST
  )
})

test('Daylight saving time — toString / offset (interpretAsDst=true, OVERLAP)', () => {
  // OVERLAP: local 2019-02-16 23:00–23:59 occurs twice
  // interpretAsDst=true → the DST side (-02:00) is preferred
  qrono.context({ localtime: true, interpretAsDst: true })

  expect(qrono('2019-02-16 23:00:00.000').toString()).toBe(
    '2019-02-16T23:00:00.000-02:00' // DST side of 23:00
  )
  expect(qrono('2019-02-16 23:30:00.000').toString()).toBe(
    '2019-02-16T23:30:00.000-02:00'
  )
  expect(qrono('2019-02-16 23:59:59.999').toString()).toBe(
    '2019-02-16T23:59:59.999-02:00'
  )
  expect(qrono('2019-02-17 00:00:00.000').toString()).toBe(
    '2019-02-17T00:00:00.000-03:00' // after OVERLAP: standard time
  )
})

test('Daylight saving time — toString / offset (interpretAsDst=false, OVERLAP)', () => {
  // interpretAsDst=false → the standard side (-03:00) is preferred
  qrono.context({ localtime: true, interpretAsDst: false })

  expect(qrono('2019-02-16 23:30:00.000').toString()).toBe(
    '2019-02-16T23:30:00.000-03:00' // standard side of 23:30
  )
  expect(qrono('2019-02-16 23:59:59.999').toString()).toBe(
    '2019-02-16T23:59:59.999-03:00'
  )
  expect(qrono('2019-02-17 00:00:00.000').toString()).toBe(
    '2019-02-17T00:00:00.000-03:00'
  )
})

test('Daylight saving time — offset()', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // just before GAP: standard time UTC-3 → offset = -180
  expect(qrono('2018-11-03 23:59:59.999').offset()).toBe(-180)
  // inside GAP (interpretAsDst=true → DST): UTC-2 → offset = -120
  expect(qrono('2018-11-04 00:30:00.000').offset()).toBe(-120)
  // inside OVERLAP (interpretAsDst=true → DST): UTC-2 → offset = -120
  expect(qrono('2019-02-16 23:30:00.000').offset()).toBe(-120)
  // after OVERLAP: standard time UTC-3 → offset = -180
  expect(qrono('2019-02-17 00:00:00.000').offset()).toBe(-180)

  qrono.context({ interpretAsDst: false })
  // inside GAP (interpretAsDst=false → standard): UTC-3 → offset = -180
  expect(qrono('2018-11-04 00:30:00.000').offset()).toBe(-180)
  // inside OVERLAP (interpretAsDst=false → standard): UTC-3 → offset = -180
  expect(qrono('2019-02-16 23:30:00.000').offset()).toBe(-180)
})

// ---------------------------------------------------------------------------
// startOfDay / startOfHour — interaction with GAP and OVERLAP
// ---------------------------------------------------------------------------

test('Daylight saving time — startOfDay on GAP day', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // startOfDay on GAP day: local 00:00 does not exist, so it is forwarded to DST side
  const startGap = qrono('2018-11-04 12:00:00.000').startOfDay()
  expect(startGap.toString()).toBe('2018-11-04T01:00:00.000-02:00')

  // startOfDay on the day before GAP is unaffected
  const startPrev = qrono('2018-11-03 12:00:00.000').startOfDay()
  expect(startPrev.toString()).toBe('2018-11-03T00:00:00.000-03:00')
})

test('Daylight saving time — startOfDay on OVERLAP day', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // startOfDay on OVERLAP day: 00:00 is unambiguous, so it behaves normally
  const startOverlap = qrono('2019-02-16 12:00:00.000').startOfDay()
  expect(startOverlap.toString()).toBe('2019-02-16T00:00:00.000-02:00')

  // startOfDay on the day after OVERLAP falls into standard time
  const startNext = qrono('2019-02-17 12:00:00.000').startOfDay()
  expect(startNext.toString()).toBe('2019-02-17T00:00:00.000-03:00')
})

test('Daylight saving time — startOfHour in GAP', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // startOfHour at 00:30 inside GAP: local 00:00 is forwarded to 01:00 DST
  const startHourGap = qrono('2018-11-04 00:30:00.000').startOfHour()
  expect(startHourGap.toString()).toBe('2018-11-04T01:00:00.000-02:00')
})

test('Daylight saving time — startOfHour in OVERLAP', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // startOfHour at 23:30 on DST side of OVERLAP
  const startHourOverlapDst = qrono('2019-02-16 23:30:00.000').startOfHour()
  expect(startHourOverlapDst.toString()).toBe('2019-02-16T23:00:00.000-02:00')

  qrono.context({ interpretAsDst: false })
  // startOfHour at 23:30 on standard side of OVERLAP
  const startHourOverlapStd = qrono('2019-02-16 23:30:00.000').startOfHour()
  expect(startHourOverlapStd.toString()).toBe('2019-02-16T23:00:00.000-03:00')
})

// ---------------------------------------------------------------------------
// plus / minus — result lands inside GAP or OVERLAP
// ---------------------------------------------------------------------------

test('Daylight saving time — plus/minus result lands in GAP', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // +1 day from the day before GAP → lands on 2018-11-04 00:00 (non-existent) → forwarded to DST side
  const afterPlus = qrono('2018-11-03 00:00:00.000').plus({ day: 1 })
  expect(afterPlus.toString()).toBe('2018-11-04T01:00:00.000-02:00')

  // -1 day from the day after GAP → same result
  const afterMinus = qrono('2018-11-05 00:00:00.000').minus({ day: 1 })
  expect(afterMinus.toString()).toBe('2018-11-04T01:00:00.000-02:00')
})

test('Daylight saving time — plus/minus result lands in OVERLAP', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // +1 day from the day before OVERLAP → lands on 2019-02-16 23:30, DST side
  const afterPlus = qrono('2019-02-15 23:30:00.000').plus({ day: 1 })
  expect(afterPlus.toString()).toBe('2019-02-16T23:30:00.000-02:00')

  qrono.context({ interpretAsDst: false })
  // same operation with interpretAsDst=false → standard side
  const afterPlusStd = qrono('2019-02-15 23:30:00.000').plus({ day: 1 })
  expect(afterPlusStd.toString()).toBe('2019-02-16T23:30:00.000-03:00')
})

test('Daylight saving time — plus/minus crossing DST boundary (wall clock)', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // +1h just before GAP: crosses the gap, so wall clock advances by 2h
  // 23:30-03:00 + 1h = 00:30 (inside GAP) → forwarded → 01:30-02:00
  const crossGap = qrono('2018-11-03 23:30:00.000').plus({ hour: 1 })
  expect(crossGap.toString()).toBe('2018-11-04T01:30:00.000-02:00')

  // +1h just inside OVERLAP (DST side) crosses back to standard time
  // 23:30-02:00 + 1h = 23:30-03:00 (same local clock time, different offset)
  const crossOverlap = qrono('2019-02-16 23:30:00.000').plus({ hour: 1 })
  expect(crossOverlap.toString()).toBe('2019-02-16T23:30:00.000-03:00')
})

// ---------------------------------------------------------------------------
// Field setters (hour, minute) — result lands inside GAP or OVERLAP
// ---------------------------------------------------------------------------

test('Daylight saving time — field setter result lands in GAP', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // Setting hour(0) on GAP day: local 00:00 does not exist → mapped to DST side
  const atGap = qrono('2018-11-04 12:00:00.000').hour(0)
  expect(atGap.toString()).toBe('2018-11-04T01:00:00.000-02:00')

  qrono.context({ interpretAsDst: false })
  // interpretAsDst=false → mapped to standard side
  const atGapStd = qrono('2018-11-04 12:00:00.000').hour(0)
  expect(atGapStd.toString()).toBe('2018-11-03T23:00:00.000-03:00')
})

test('Daylight saving time — field setter result lands in OVERLAP', () => {
  qrono.context({ localtime: true, interpretAsDst: true })

  // Setting hour(23).minute(30) on OVERLAP day → DST side (-02:00)
  const atOverlapDst = qrono('2019-02-16 12:00:00.000').hour(23).minute(30)
  expect(atOverlapDst.toString()).toBe('2019-02-16T23:30:00.000-02:00')

  qrono.context({ interpretAsDst: false })
  // interpretAsDst=false → standard side (-03:00)
  const atOverlapStd = qrono('2019-02-16 12:00:00.000').hour(23).minute(30)
  expect(atOverlapStd.toString()).toBe('2019-02-16T23:30:00.000-03:00')
})

// ---------------------------------------------------------------------------
// QronoDate
// ---------------------------------------------------------------------------

test('QronoDate basic', () => {
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
    '2000-01-01T00:00:00.000-02:00'
  )
  expect(qrono.date(3000, 12, 31).startOfYear().toString()).toBe('3000-01-01')
  expect(qrono.date(3000, 12, 31).startOfMonth().toString()).toBe('3000-12-01')
  expect(qrono.date(2999, 12, 31).year()).toBe(2999)
  expect(qrono.date(2999, 12, 31).month()).toBe(12)
  expect(qrono.date(2999, 12, 31).day()).toBe(31)
  expect(qrono.date('2021-09-30').toArray()).toEqual([2021, 9, 30])
  const dateObj = qrono.date('2021-09-30').toObject()
  expect(dateObj).toEqual({ year: 2021, month: 9, day: 30 })
  expect(dateObj).not.toHaveProperty('hour')

  const date = qrono.date('2021-09-30')
  expect(date.startOfDay().isSame(qrono('2021-09-30'))).toBe(true)

  expect(qrono.date(2021, 12, 31).plus({ day: 1 }).toString()).toBe(
    '2022-01-01'
  )
  expect(qrono.date(2021, 12, 31).minus({ month: 1 }).toString()).toBe(
    '2021-11-30'
  )

  expect(qrono.date('2018-01-01').hasDstInYear()).toBe(true)
  expect(qrono.date('2020-01-01').hasDstInYear()).toBe(false)
})

test('QronoDate — plus/minus across DST transition', () => {
  // QronoDate operates on calendar dates only, so DST gaps/overlaps do not affect day arithmetic
  expect(qrono.date('2018-11-03').plus({ day: 1 }).toString()).toBe(
    '2018-11-04'
  )
  expect(qrono.date('2018-11-05').minus({ day: 1 }).toString()).toBe(
    '2018-11-04'
  )
  expect(qrono.date('2019-02-15').plus({ day: 1 }).toString()).toBe(
    '2019-02-16'
  )
  expect(qrono.date('2019-02-17').minus({ day: 1 }).toString()).toBe(
    '2019-02-16'
  )
})

test('QronoDate — toDatetime on DST transition days', () => {
  qrono.asLocaltime()

  // GAP day: toDatetime produces 00:00, which does not exist → forwarded to DST side
  const gapDay = qrono.date('2018-11-04').toDatetime()
  expect(gapDay.toString()).toBe('2018-11-04T01:00:00.000-02:00')

  // OVERLAP day: 00:00 is unambiguous → standard behaviour (still in DST at start of day)
  const overlapDay = qrono.date('2019-02-16').toDatetime()
  expect(overlapDay.toString()).toBe('2019-02-16T00:00:00.000-02:00')

  // Day after OVERLAP: 00:00 is in standard time
  const afterOverlapDay = qrono.date('2019-02-17').toDatetime()
  expect(afterOverlapDay.toString()).toBe('2019-02-17T00:00:00.000-03:00')
})

test('QronoDate comparison', () => {
  const date1 = qrono.date('2021-09-30')
  const date2 = qrono.date('2021-09-30')
  const date3 = qrono.date('2021-10-01')
  const date4 = qrono.date('2021-09-29')

  expect(date1.isSame(date2)).toBe(true)
  expect(date1.isSame(date3)).toBe(false)
  expect(date1.isBefore(date3)).toBe(true)
  expect(date1.isBefore(date4)).toBe(false)
  expect(date1.isAfter(date4)).toBe(true)
  expect(date1.isAfter(date3)).toBe(false)
  expect(date1.isSameOrBefore(date2)).toBe(true)
  expect(date1.isSameOrBefore(date3)).toBe(true)
  expect(date1.isSameOrBefore(date4)).toBe(false)
  expect(date1.isSameOrAfter(date2)).toBe(true)
  expect(date1.isSameOrAfter(date4)).toBe(true)
  expect(date1.isSameOrAfter(date3)).toBe(false)
  expect(date1.isBetween(date4, date3)).toBe(true)
  expect(date1.isBetween(date2, date2)).toBe(true)
  expect(date3.isBetween(date1, date2)).toBe(false)
})
