# API Comparison

This section compares Qrono's API against three popular JavaScript date libraries — [Day.js](https://day.js.org/), [Luxon](https://moment.github.io/luxon/), and [date-fns](https://date-fns.org/) — across common use cases. Use it as a quick reference to understand how each library approaches the same task and to evaluate which best fits your needs.

## Instance creation

Qrono and Day.js use a single overloaded function.
Luxon uses dedicated static factory methods per input type (`fromISO`, `fromJSDate`, `fromFormat`, …).

<FourCompare>
<template #a>

```ts
// Current time
qrono()

// String
// Almost compliant with ISO 8601
// String parsing format (i.e. dd/mm/yyyy) is NOT supported.
qrono('2024-01-15 12:34:56')

// Date object
qrono(new Date())

// Millisecond timestamp
qrono(1705286096000)

// Spread arguments
qrono(2024, 1, 15, 12, 34, 56, 0)

// Array
qrono([2024, 1, 15, 12, 34, 56, 0])

// Object
qrono({ year: 2024, month: 1, day: 15 })

// Clone another instance
qrono(another)
```

</template>
<template #b>

```ts
// Current time
dayjs()

// String
dayjs('2024-01-15 12:34:56')

// Date object
dayjs(new Date())

// Millisecond timestamp
dayjs(1705286096000)

// Array
dayjs([2024, 0, 15, 12, 34, 56, 0])

// Object
dayjs({ year: 2024, month: 0, day: 15 })

// Clone another instance
dayjs(another)
```

</template>
<template #c>

```ts
// Current time
DateTime.now()

// ISO string
DateTime.fromISO('2024-01-15T12:34:56')

// Date object
DateTime.fromJSDate(new Date())

// Millisecond timestamp
DateTime.fromMillis(1705286096000)

// Object
DateTime.fromObject({
  year: 2024,
  month: 1,
  day: 15,
})

// Format string
DateTime.fromFormat('2024-01-15', 'yyyy-MM-dd')
```

</template>
<template #d>

```ts
import { parseISO, parse } from 'date-fns'

// ISO string
parseISO('2024-01-15T12:34:56')

// Format string
parse('2024-01-15', 'yyyy-MM-dd', new Date())
```

</template>
</FourCompare>

## DST gap/overlap handling

When a local time string falls in a DST gap or overlap, each library must resolve the ambiguity differently.
Day.js and date-fns default to the DST-active (later) offset, just like JavaScript's `Date`.
Luxon defaults to the standard (earlier) offset in overlap cases.
Qrono defaults to `'compatible'` — gap times are forwarded to the later (DST) side, overlap times use the earlier (standard-time) side — and uniquely exposes all four resolution strategies via its `disambiguation` option, mirroring the [Temporal API](https://tc39.es/proposal-temporal/docs/).

Europe/London DST is used here as an example.

- Spring forward (Gap)  
  2019-03-31 01:00 → 2019-03-31 02:00  (+00:00 → +01:00)
- Fall back (Overlap)  
  2019-10-27 02:00 → 2019-10-27 01:00  (+01:00 → +00:00)

### Gap (non-existent local time)

```ts
const input = '2019-03-31T01:30:00'

qrono.asLocaltime() // defaults localtime
qrono(input)                                // Qrono    2019-03-31T02:30:00.000+01:00
qrono({ disambiguation: 'earlier' }, input) // Qrono    2019-03-31T00:30:00.000+00:00
qrono({ disambiguation: 'later' }, input)   // Qrono    2019-03-31T02:30:00.000+01:00
qrono({ disambiguation: 'reject' }, input)  // Qrono    throws RangeError
dayjs(input)                                // Day.js   2019-03-31T02:30:00.000+01:00
DateTime.fromISO(input)                     // Luxon    2019-03-31T02:30:00.000+01:00
parseISO(input)                             // date-fns 2019-03-31T02:30:00.000+01:00
```

### Overlap (duplicated local time)

```ts
const input = '2019-10-27T01:30:00'

qrono.asLocaltime() // defaults localtime
qrono(input)                                // Qrono    2019-10-27T01:30:00.000+00:00
qrono({ disambiguation: 'earlier' }, input) // Qrono    2019-10-27T01:30:00.000+00:00
qrono({ disambiguation: 'later' }, input)   // Qrono    2019-10-27T01:30:00.000+01:00
qrono({ disambiguation: 'reject' }, input)  // Qrono    throws RangeError
dayjs(input)                                // Day.js   2019-10-27T01:30:00.000+01:00
DateTime.fromISO(input)                     // Luxon    2019-10-27T01:30:00.000+00:00
parseISO(input)                             // date-fns 2019-10-27T01:30:00.000+01:00
```

## Date-only instance

Qrono provides a dedicated `QronoDate` type for calendar dates with no time component. The other libraries have no equivalent — date-only values are represented as a datetime at midnight, which can be affected by timezone handling.

<FourCompare>
<template #a>

```ts
// Current date
qrono.date()

// String
qrono.date('2024-01-15')

// Date object
qrono.date(new Date())

// Object
qrono.date({ year: 2024, month: 1, day: 15 })
```

</template>
<template #b>

```ts
// Not available
```

</template>
<template #c>

```ts
// Not available
```

</template>
<template #d>

```ts
// Not available
```

</template>
</FourCompare>

## DST information

Qrono exposes several DST introspection methods. Luxon covers `isInDST` only. Day.js and date-fns provide no DST introspection.

<FourCompare>
<template #a>

```ts
qrono.asLocaltime()

// Whether DST is currently active
qrono('2024-07-15').isInDst()

// Whether the year has DST at all
qrono('2024-07-15').hasDstInYear()

// Whether the day is a DST transition day
qrono('2024-03-10').isDstTransitionDay()

// Minutes in the day considering DST
qrono('2024-03-10').minutesInDay()
```

</template>
<template #b>

```ts
// Not available
```

</template>
<template #c>

```ts
// Whether DST is currently active
DateTime.local().isInDST
```

</template>
<template #d>

```ts
// Not available
```

</template>
</FourCompare>

## Timezone

Qrono supports UTC and the runtime's local timezone only; arbitrary IANA timezone IDs are __NOT__ supported. Day.js supports them via a plugin; Luxon supports them natively; date-fns handles timezone conversion through the companion `date-fns-tz` package.

<FourCompare>
<template #a>

```ts
// Local time (runtime environment TZ)
qrono({ localtime: true }, '2024-01-15 12:00')

// UTC (default)
qrono('2024-01-15 12:00')

// Switch an instance to local time
qrono('2024-01-15 12:00').asLocaltime()

// Switch an instance to UTC
qrono({ localtime: true }, '2024-01-15 12:00').asUtc()

// Note: arbitrary TZID is NOT supported
```

</template>
<template #b>

```ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

// UTC
dayjs.utc('2024-01-15 12:00')

// Arbitrary timezone
dayjs.tz('2024-01-15 12:00', 'America/New_York')

// Convert timezone
dayjs('2024-01-15 12:00').tz('America/New_York')
```

</template>
<template #c>

```ts
// UTC
DateTime.fromISO('2024-01-15T12:00:00', {
  zone: 'utc',
})

// Arbitrary timezone
DateTime.fromISO('2024-01-15T12:00:00', {
  zone: 'America/New_York',
})

// Convert timezone
DateTime.now().setZone('America/New_York')
```

</template>
<template #d>

```ts
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

// Convert local time to UTC
fromZonedTime('2024-01-15 12:00', 'America/New_York')

// Convert UTC to a specific timezone
toZonedTime(new Date(), 'America/New_York')
```

</template>
</FourCompare>

## Timezone offset

All libraries return the UTC offset in minutes (positive = east of UTC), except date-fns-tz which returns milliseconds and requires an explicit IANA timezone ID. Luxon additionally exposes the offset as a short name string (e.g. `'JST'`). Note that the native `Date.prototype.getTimezoneOffset()` uses the opposite sign convention (positive = west of UTC).

<FourCompare>
<template #a>

```ts
// Offset in minutes, positive = east of UTC
qrono({ localtime: true }).offset()
// e.g. JST => 540
```

</template>
<template #b>

```ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

// Offset in minutes, positive = east of UTC
dayjs().utcOffset()
// e.g. JST => 540
```

</template>
<template #c>

```ts
// Offset in minutes
DateTime.local().offset
// e.g. JST => 540

// Offset as string
DateTime.local().offsetNameShort
// e.g. 'JST'
```

</template>
<template #d>

```ts
import { getTimezoneOffset } from 'date-fns-tz'

// Offset in milliseconds
getTimezoneOffset('America/New_York', new Date())
// e.g. -18000000
```

</template>
</FourCompare>

## Converting

All libraries convert to a native `Date`, millisecond timestamp, ISO 8601 string, and plain object. Day.js and Luxon include a built-in format method for custom strings; Qrono delegates that to `Intl.DateTimeFormat` (see [Formatting](#formatting)).

<FourCompare>
<template #a>

```ts
const dt = qrono('2024-01-15 12:34:56.789')

// Native Date
dt.nativeDate()

// Millisecond timestamp
dt.numeric() // or dt.valueOf()

// Object
dt.toObject()
// { year, month, day, hour, minute, second, millisecond }

// Array
dt.toArray()
// [2024, 1, 15, 12, 34, 56, 789]

// QronoDate (date only)
dt.toDate()

// ISO 8601 string
dt.toString()
```

</template>
<template #b>

```ts
const dt = dayjs('2024-01-15T12:34:56.789')

// Native Date
dt.toDate()

// Millisecond timestamp
dt.valueOf()

// Object
dt.toObject()
// { years, months, date, hours, minutes, seconds, milliseconds }

// Array
dt.toArray()
// [2024, 0, 15, 12, 34, 56, 789]

// ISO 8601 string
dt.toISOString()

// Custom format string
dt.format('YYYY-MM-DD HH:mm:ss')
```

</template>
<template #c>

```ts
const dt = DateTime.fromISO('2024-01-15T12:34:56.789')

// Native Date
dt.toJSDate()

// Millisecond timestamp
dt.toMillis() // or dt.valueOf()

// Object
dt.toObject()
// { year, month, day, hour, minute, second, millisecond }

// ISO 8601 string
dt.toISO()

// Custom format string
dt.toFormat('yyyy-MM-dd HH:mm:ss')
```

</template>
<template #d>

```ts
import { format } from 'date-fns'

// ISO 8601 string
const d = new Date('2024-01-15T12:34:56.789').toISOString()

// Custom format string
format(d, 'yyyy-MM-dd HH:mm:ss')
```

</template>
</FourCompare>

## Arithmetic

Qrono's `plus`/`minus` accept spread arguments, object, array, or a raw millisecond number. Day.js uses a `(value, unit)` pair; Luxon uses an object with plural unit keys; date-fns provides individual functions per unit (`addMonths`, `addDays`, …). For differences, Qrono and date-fns return a plain number; Day.js and Luxon can return a Duration object (see [Duration](#duration)).

<FourCompare>
<template #a>

```ts
const dt = qrono('2024-01-15 12:00:00')

// Addition (spread: year, month, day, h, m, s, ms)
dt.plus(0, 1, 10) // +1 month, +10 days
dt.plus({ month: 1, day: 10 })
dt.plus([0, 1, 10])
dt.plus(3600 * 1000) // +1 hour (ms)

// Subtraction
dt.minus(0, 0, 7) // -7 days
dt.minus({ day: 7 })
dt.minus(3600 * 1000)

// Difference (ms)
dt.valueOf() - qrono('2024-01-01').valueOf()
```

</template>
<template #b>

```ts
const dt = dayjs('2024-01-15 12:00:00')

// Addition
dt.add(1, 'month').add(10, 'day')
dt.add(1, 'hour')

// Subtraction
dt.subtract(7, 'day')
dt.subtract(1, 'hour')

// Difference
dt.diff(dayjs('2024-01-01'), 'day')
```

</template>
<template #c>

```ts
const dt = DateTime.fromISO('2024-01-15T12:00:00')

// Addition
dt.plus({ months: 1, days: 10 })
dt.plus({ hours: 1 })

// Subtraction
dt.minus({ days: 7 })
dt.minus({ hours: 1 })

// Difference
dt.diff(DateTime.fromISO('2024-01-01'), 'days').days
```

</template>
<template #d>

```ts
import {
  addMonths,
  addDays,
  addHours,
  subDays,
  subHours,
  differenceInDays,
} from 'date-fns'

const d = new Date('2024-01-15T12:00:00')

// Addition
addMonths(addDays(d, 10), 1)
addHours(d, 1)

// Subtraction
subDays(d, 7)
subHours(d, 1)

// Difference
differenceInDays(d, new Date('2024-01-01'))
```

</template>
</FourCompare>

## Comparing

Qrono and Day.js (with plugins) provide all six comparison methods as named methods. Luxon relies on native comparison operators (`<`, `>`, `<=`, `>=`) for ordering and `Interval.contains()` for range checks. date-fns provides `isBefore`, `isAfter`, and `isEqual` as functions, and falls back to native operators for the rest.

<FourCompare>
<template #a>

```ts
const a = qrono('2024-01-15')
const b = qrono('2024-06-01')

a.isBefore(b)       // true
a.isAfter(b)        // false
a.isSame(b)         // false
a.isSameOrBefore(b) // true
a.isSameOrAfter(b)  // false
a.isBetween(qrono('2024-01-01'), qrono('2024-12-31')) // true
```

</template>
<template #b>

```ts
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)

const a = dayjs('2024-01-15')
const b = dayjs('2024-06-01')

a.isBefore(b)       // true
a.isAfter(b)        // false
a.isSame(b)         // false
a.isSameOrBefore(b) // true  (plugin)
a.isSameOrAfter(b)  // false (plugin)
a.isBetween(dayjs('2024-01-01'), dayjs('2024-12-31')) // true  (plugin)
```

</template>
<template #c>

```ts
import { DateTime, Interval } from 'luxon'

const a = DateTime.fromISO('2024-01-15')
const b = DateTime.fromISO('2024-06-01')

a < b       // true  (isBefore)
a > b       // false (isAfter)
a.equals(b) // false
a <= b      // true  (isSameOrBefore)
a >= b      // false (isSameOrAfter)
Interval.fromDateTimes(
  DateTime.fromISO('2024-01-01'),
  DateTime.fromISO('2024-12-31'),
).contains(a) // true  (isBetween)
```

</template>
<template #d>

```ts
import {
  isBefore,
  isAfter,
  isEqual,
  isWithinInterval
} from 'date-fns'

const a = new Date('2024-01-15')
const b = new Date('2024-06-01')

isBefore(a, b) // true
isAfter(a, b)  // false
isEqual(a, b)  // false
a <= b         // true  (isSameOrBefore)
a >= b         // false (isSameOrAfter)
isWithinInterval(a, {
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31'),
}) // true
```

</template>
</FourCompare>

## Start/End boundaries

Day.js, Luxon, and date-fns use a generic `startOf(unit)` / `endOf(unit)` style down to the hour level. Qrono uses dedicated methods per granularity (`startOfYear()`, `startOfMonth()`, …) but does not provide `endOf` on `Qrono` instances; `endOfYear()` and `endOfMonth()` are available on `QronoDate` only.

<FourCompare>
<template #a>

```ts
const dt = qrono('2024-06-15 12:34:56')

dt.startOfYear()   // 2024-01-01 00:00:00
dt.startOfMonth()  // 2024-06-01 00:00:00
dt.startOfDay()    // 2024-06-15 00:00:00
dt.startOfHour()   // 2024-06-15 12:00:00
dt.startOfMinute() // 2024-06-15 12:34:00
dt.startOfSecond() // 2024-06-15 12:34:56

qrono.date('2024-06-15').endOfYear()
// => QronoDate: 2024-12-31
qrono.date('2024-06-15').endOfMonth()
// => QronoDate: 2024-06-30
```

</template>
<template #b>

```ts
const dt = dayjs('2024-06-15 12:34:56')

dt.startOf('year')   // 2024-01-01 00:00:00
dt.startOf('month')  // 2024-06-01 00:00:00
dt.startOf('day')    // 2024-06-15 00:00:00
dt.startOf('hour')   // 2024-06-15 12:00:00
dt.startOf('minute') // 2024-06-15 12:34:00
dt.startOf('second') // 2024-06-15 12:34:56

dt.endOf('year')     // 2024-12-31 23:59:59
dt.endOf('month')    // 2024-06-30 23:59:59
dt.endOf('day')      // 2024-06-15 23:59:59
dt.endOf('hour')     // 2024-06-15 12:59:59
```

</template>
<template #c>

```ts
const dt = DateTime.fromISO('2024-06-15T12:34:56')

dt.startOf('year')   // 2024-01-01 00:00:00
dt.startOf('month')  // 2024-06-01 00:00:00
dt.startOf('day')    // 2024-06-15 00:00:00
dt.startOf('hour')   // 2024-06-15 12:00:00
dt.startOf('minute') // 2024-06-15 12:34:00
dt.startOf('second') // 2024-06-15 12:34:56

dt.endOf('year')     // 2024-12-31 23:59:59
dt.endOf('month')    // 2024-06-30 23:59:59
dt.endOf('day')      // 2024-06-15 23:59:59
dt.endOf('hour')     // 2024-06-15 12:59:59
```

</template>
<template #d>

```ts
import {
  startOfYear,
  startOfMonth,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfSecond,
  endOfYear,
  endOfMonth,
  endOfDay,
  endOfHour,
} from 'date-fns'

const d = new Date('2024-06-15T12:34:56')

startOfYear(d)   // 2024-01-01 00:00:00
startOfMonth(d)  // 2024-06-01 00:00:00
startOfDay(d)    // 2024-06-15 00:00:00
startOfHour(d)   // 2024-06-15 12:00:00
startOfMinute(d) // 2024-06-15 12:34:00
startOfSecond(d) // 2024-06-15 12:34:56

endOfYear(d)     // 2024-12-31 23:59:59
endOfMonth(d)    // 2024-06-30 23:59:59
endOfDay(d)      // 2024-06-15 23:59:59
endOfHour(d)     // 2024-06-15 12:59:59
```

</template>
</FourCompare>

## Day and Week

All libraries support day-of-year, ISO week number, and ISO week year. `daysInYear` is available in Qrono and Luxon but not in Day.js or date-fns directly. `weeksInYear` is available in Qrono and date-fns but not in Luxon. Day.js requires plugins for this entire group. Note that Luxon exposes day-of-year as the `ordinal` property.

<FourCompare>
<template #a>

```ts
const dt = qrono('2024-06-15 12:00:00')

// Day of year
dt.dayOfYear() // e.g. 167

// ISO week of year
dt.weekOfYear() // e.g. 24
dt.yearOfWeek() // ISO week year, e.g. 2024

// Total days in the year
dt.daysInYear() // 366 (leap year)

// Total ISO weeks in the year
dt.weeksInYear() // e.g. 52

// Also available on QronoDate
qrono.date('2024-06-15').dayOfYear()
qrono.date('2024-06-15').weekOfYear()
qrono.date('2024-06-15').daysInYear()
qrono.date('2024-06-15').weeksInYear()
```

</template>
<template #b>

```ts
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import isLeapYear from 'dayjs/plugin/isLeapYear'
dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(isLeapYear)

const dt = dayjs('2024-06-15 12:00:00')

// Day of year
dt.dayOfYear() // e.g. 167

// ISO week of year
dt.week() // e.g. 24
dt.weekYear() // e.g. 2024

// Total days in the year
// Not available
dt.isLeapYear() ? 366 : 365

// Total ISO weeks in the year
// Not available
```

</template>
<template #c>

```ts
const dt = DateTime.fromISO('2024-06-15T12:00:00')

// Day of year
dt.ordinal // e.g. 167

// ISO week of year
dt.weekNumber // e.g. 24
dt.weekYear // e.g. 2024

// Total days in the year
dt.daysInYear // 366

// Total ISO weeks in the year
// Not available
```

</template>
<template #d>

```ts
import {
  getDayOfYear,
  getISOWeek,
  getISOWeekYear,
  getISOWeeksInYear,
  isLeapYear,
} from 'date-fns'

const d = new Date('2024-06-15T12:00:00')

// Day of year
getDayOfYear(d) // e.g. 167

// ISO week of year
getISOWeek(d)     // e.g. 24
getISOWeekYear(d) // e.g. 2024

// Total days in the year
// Not available
isLeapYear(d) ? 366 : 365

// Total ISO weeks in the year
getISOWeeksInYear(d) // e.g. 52
```

</template>
</FourCompare>

## Get / Set

Qrono and Day.js use the same method name for both get (no argument) and set (with argument). Luxon uses read-only property accessors for get and `set({ … })` for set. date-fns provides individual `getX` / `setX` functions. Note that Day.js and date-fns months are **0-indexed** while Qrono and Luxon use **1-indexed** months.

<FourCompare>
<template #a>

```ts
const dt = qrono('2024-06-15 12:34:56.789')

// Get
dt.year()        // 2024
dt.month()       // 6  (1-indexed)
dt.day()         // 15
dt.hour()        // 12
dt.minute()      // 34
dt.second()      // 56
dt.millisecond() // 789
dt.dayOfWeek()   // 6  (1=Mon ... 7=Sun, ISO 8601)

// Set (returns new instance)
dt.year(2025)
dt.month(1)
dt.day(1)
dt.hour(0)
dt.minute(0)
dt.second(0)
dt.millisecond(0)
```

</template>
<template #b>

```ts
const dt = dayjs('2024-06-15 12:34:56.789')

// Get
dt.year()        // 2024
dt.month()       // 5  (0-indexed!)
dt.date()        // 15
dt.hour()        // 12
dt.minute()      // 34
dt.second()      // 56
dt.millisecond() // 789
dt.day()         // 6  (0=Sun ... 6=Sat)

// Generic getter/setter
dt.get('year')
dt.set('year', 2025)
dt.set('month', 0)  // 0-indexed
dt.set('date', 1)
```

</template>
<template #c>

```ts
const dt = DateTime.fromISO('2024-06-15T12:34:56.789')

// Get (property accessors)
dt.year        // 2024
dt.month       // 6  (1-indexed)
dt.day         // 15
dt.hour        // 12
dt.minute      // 34
dt.second      // 56
dt.millisecond // 789
dt.weekday     // 6  (1=Mon ... 7=Sun, ISO 8601)

// Set (returns new instance)
dt.set({ year: 2025 })
dt.set({ month: 1, day: 1 })
```

</template>
<template #d>

```ts
import {
  getYear, getMonth, getDate,
  getHours, getMinutes, getSeconds, getMilliseconds,
  getDay,
  setYear, setMonth, setDate,
  setHours, setMinutes, setSeconds, setMilliseconds,
} from 'date-fns'

const d = new Date('2024-06-15T12:34:56.789')

// Get
getYear(d)         // 2024
getMonth(d)        // 5  (0-indexed!)
getDate(d)         // 15
getHours(d)        // 12
getMinutes(d)      // 34
getSeconds(d)      // 56
getMilliseconds(d) // 789
getDay(d)          // 6  (0=Sun ... 6=Sat)

// Set (returns new Date)
setYear(d, 2025)
setMonth(d, 0)  // 0-indexed
setDate(d, 1)
setHours(d, 0)
```

</template>
</FourCompare>

## Validation

All libraries expose a validity check. Qrono and Day.js use a `valid()` / `isValid()` method; Luxon uses an `isValid` property and additionally provides `invalidReason` and `invalidExplanation`; date-fns's `isValid()` is a standalone function.

<FourCompare>
<template #a>

```ts
qrono('2024-01-15').valid()    // true
qrono('invalid').valid()       // false
qrono(NaN).valid()             // false

// QronoDate
qrono.date('2024-01-15').valid() // true
qrono.date('invalid').valid()    // false
```

</template>
<template #b>

```ts
dayjs('2024-01-15').isValid()  // true
dayjs('invalid').isValid()     // false
dayjs(NaN).isValid()           // false
```

</template>
<template #c>

```ts
DateTime.fromISO('2024-01-15').isValid  // true
DateTime.fromISO('invalid').isValid     // false

// Detailed reason for invalidity
DateTime.fromISO('invalid').invalidReason
// e.g. 'unparsable'
DateTime.fromISO('invalid').invalidExplanation
```

</template>
<template #d>

```ts
import { isValid, parseISO } from 'date-fns'

isValid(parseISO('2024-01-15')) // true
isValid(parseISO('invalid'))    // false
isValid(new Date('invalid'))    // false
isValid(NaN)                    // false
```

</template>
</FourCompare>

## Formatting

Day.js uses `YYYY`-style tokens (Moment.js compatible); Luxon and date-fns use `yyyy`-style tokens (Unicode CLDR).
Qrono has **NO** built-in format method and delegates to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

<FourCompare>
<template #a>

```ts
const dt = qrono('2024-06-15 12:34:56')

// ISO 8601 (built-in)
dt.toString() // '2024-06-15T12:34:56.000Z'

// Custom format via Intl.DateTimeFormat
new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false,
}).format(dt.nativeDate())
// e.g. '06/15/2024, 12:34:56'
```

</template>
<template #b>

```ts
const dt = dayjs('2024-06-15 12:34:56')

// ISO 8601
dt.toISOString() // '2024-06-15T12:34:56.000Z'

// Custom format (Moment.js-compatible tokens)
dt.format('YYYY-MM-DD HH:mm:ss')
// '2024-06-15 12:34:56'

dt.format('ddd, MMM D YYYY')
// 'Sat, Jun 15 2024'
```

</template>
<template #c>

```ts
const dt = DateTime.fromISO('2024-06-15T12:34:56')

// ISO 8601
dt.toISO() // '2024-06-15T12:34:56.000Z'

// Custom format (CLDR tokens)
dt.toFormat('yyyy-MM-dd HH:mm:ss')
// '2024-06-15 12:34:56'

dt.toFormat('EEE, MMM d yyyy')
// 'Sat, Jun 15 2024'
```

</template>
<template #d>

```ts
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const d = new Date('2024-06-15T12:34:56')

// Custom format (CLDR tokens)
format(d, 'yyyy-MM-dd HH:mm:ss')
// '2024-06-15 12:34:56'

format(d, 'EEE, MMM d yyyy')
// 'Sat, Jun 15 2024'
```

</template>
</FourCompare>

## Locale / i18n

Qrono and Luxon rely on the runtime's `Intl` API with no locale files to import. Day.js requires importing locale files and the `localizedFormat` plugin. date-fns requires importing locale objects per call site, which allows fine-grained tree-shaking.

<FourCompare>
<template #a>

```ts
// Qrono delegates locale handling to Intl APIs.
// No built-in locale configuration is needed.

const dt = qrono('2024-06-15 12:34:56')
const d = dt.nativeDate()

// Localized month name
new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(d)
// 'juin'

// Localized weekday
new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(d)
// 'Samstag'

// Localized full date
new Intl.DateTimeFormat('ja-JP', { dateStyle: 'full' }).format(d)
// '2024年6月15日土曜日'
```

</template>
<template #b>

```ts
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/de'
import 'dayjs/locale/ja'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

// Set global locale
dayjs.locale('ja')

// Or per-instance locale
const dt = dayjs('2024-06-15').locale('fr')

// Localized month name
dt.locale('fr').format('MMMM') // 'juin'

// Localized weekday
dt.locale('de').format('dddd') // 'Samstag'

// Localized date format
dt.locale('ja').format('LL') // '2024年6月15日'
```

</template>
<template #c>

```ts
// Luxon uses the runtime's Intl API natively.
// No locale files to import.

// Per-instance locale
const dt = DateTime.fromISO('2024-06-15T12:34:56')
  .setLocale('fr')

// Localized month name
dt.setLocale('fr').toFormat('MMMM') // 'juin'

// Localized weekday
dt.setLocale('de').toFormat('EEEE') // 'Samstag'

// Localized date format
dt.setLocale('ja').toLocaleString(DateTime.DATE_FULL)
// '2024年6月15日'
```

</template>
<template #d>

```ts
import { format } from 'date-fns'
import { fr, de, ja } from 'date-fns/locale'

const d = new Date('2024-06-15T12:34:56')

// Localized month name
format(d, 'MMMM', { locale: fr }) // 'juin'

// Localized weekday
format(d, 'EEEE', { locale: de }) // 'Samstag'

// Localized date format
format(d, 'PPP', { locale: ja })  // '2024年6月15日'

// Note: locale objects must be explicitly imported,
// which enables effective tree-shaking.
```

</template>
</FourCompare>

## Relative time

Luxon supports relative time natively via `toRelative()` / `toRelativeCalendar()`. Day.js supports it via the `relativeTime` plugin. date-fns provides `formatDistanceToNow` and `formatDistance` as standalone functions. Qrono has no built-in; `Intl.RelativeTimeFormat` can be used directly with `valueOf()`.

<FourCompare>
<template #a>

```ts
// Not available as a built-in.
// Use Intl.RelativeTimeFormat with valueOf() difference.

const days = qrono.date('2024-01-10').valueOf()
           - qrono.date('2024-01-15').valueOf()

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
rtf.format(days, 'day') // '5 days ago'

// With locale
const rtfJa = new Intl.RelativeTimeFormat('ja', { numeric: 'auto' })
rtfJa.format(days, 'day') // '5日前'
```

</template>
<template #b>

```ts
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ja'
dayjs.extend(relativeTime)

const dt = dayjs('2024-01-10')

// Relative to now
dt.fromNow()          // 'a year ago'
dt.toNow()            // 'in a year'

// Relative to another date
dt.from(dayjs('2024-01-15')) // '5 days ago'
dt.to(dayjs('2024-01-15'))   // 'in 5 days'

// With locale
dayjs.locale('ja')
dt.fromNow() // '1年前'
```

</template>
<template #c>

```ts
// Luxon uses Intl.RelativeTimeFormat natively.

const dt = DateTime.fromISO('2024-01-10')

// Relative to now
dt.toRelative()       // 'a year ago'
dt.toRelativeCalendar() // 'last year'

// Relative to another date
dt.toRelative({ base: DateTime.fromISO('2024-01-15') })
// '5 days ago'

// With locale
dt.setLocale('ja').toRelative() // '1年前'
```

</template>
<template #d>

```ts
import {
  formatDistance,
  formatRelative,
  formatDistanceToNow,
} from 'date-fns'
import { ja } from 'date-fns/locale'

const d = new Date('2024-01-10')

// Relative to now
formatDistanceToNow(d, { addSuffix: true })
// 'about 1 year ago'

// Relative to another date
formatDistance(d, new Date('2024-01-15'), { addSuffix: true })
// '5 days ago'

// Calendar-style relative
formatRelative(d, new Date('2024-01-15'))
// e.g. 'last Monday at 12:00 AM'

// With locale
formatDistanceToNow(d, { addSuffix: true, locale: ja })
// '約1年前'
```

</template>
</FourCompare>

## Duration

Qrono intentionally has no Duration type. Differences between `Qrono` instances are plain milliseconds; differences between `QronoDate` instances are plain integers (days).

<FourCompare>
<template #a>

```ts
const a = qrono('2024-01-15 12:00:00')
const b = qrono('2024-03-20 18:30:00')

// Difference as milliseconds
const ms = b.valueOf() - a.valueOf()
// 5_734_200_000

// Decompose manually if needed
const totalMinutes = Math.floor(ms / 60000)
const hours   = Math.floor(totalMinutes / 60)
const minutes = totalMinutes % 60

// QronoDate difference as integer days
const da = qrono.date('2024-01-15')
const db = qrono.date('2024-03-20')
const days = db.valueOf() - da.valueOf() // 65
```

</template>
<template #b>

```ts
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

// Create a duration
const dur = dayjs.duration({ months: 2, days: 5 })

dur.months()       // 2
dur.days()         // 5
dur.asMilliseconds() // total ms

// Difference as duration
const a = dayjs('2024-01-15')
const b = dayjs('2024-03-20')
const diff = dayjs.duration(b.diff(a))

diff.months() // 2
diff.days()   // 5
diff.humanize() // 'in 2 months'
```

</template>
<template #c>

```ts
import { Duration, DateTime } from 'luxon'

// Create a duration
const dur = Duration.fromObject({ months: 2, days: 5 })

dur.months // 2
dur.days   // 5
dur.toMillis() // total ms
dur.toISO()    // 'P2M5D'

// Difference as duration
const a = DateTime.fromISO('2024-01-15')
const b = DateTime.fromISO('2024-03-20')
const diff = b.diff(a, ['months', 'days'])

diff.months // 2
diff.days   // 5
diff.toHuman() // '2 months, 5 days'
```

</template>
<template #d>

```ts
import {
  intervalToDuration,
  formatDuration,
  differenceInDays,
  differenceInHours,
} from 'date-fns'

const a = new Date('2024-01-15')
const b = new Date('2024-03-20')

// Structured duration object
const dur = intervalToDuration({ start: a, end: b })
// { months: 2, days: 5 }

dur.months // 2
dur.days   // 5

// Human-readable
formatDuration(dur) // '2 months 5 days'

// Single-unit differences
differenceInDays(b, a)  // 65
differenceInHours(b, a) // 1566
```

</template>
</FourCompare>
