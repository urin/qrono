# API Comparison

This section compares Qrono's API against three popular JavaScript date libraries — [Day.js](https://day.js.org/), [Luxon](https://moment.github.io/luxon/), and [date-fns](https://date-fns.org/) — across common use cases. Use it as a quick reference to understand how each library approaches the same task and to evaluate which best fits your needs.

## Instance creation

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

## Date-only instance

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
