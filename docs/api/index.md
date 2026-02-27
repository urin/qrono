# API Reference

Complete API reference for Qrono.

The library provides two classes: `Qrono`, which represents a point in time, and `QronoDate`, which represents a calendar date. `QronoDate` is not affected by time zones.

- [Factory](#factory)
  - [qrono(...args)](#qrono) <Badge type="info" text="static" /> <small>14 overloads</small>
  - [qrono.date(...args)](#qrono-date) <Badge type="info" text="static" /> <small>7 overloads</small>
- [Conversion](#conversion)
  - [.toString()](#tostring) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.numeric()](#numeric) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.valueOf()](#valueof) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.toArray()](#toarray) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.toObject()](#toobject) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.nativeDate()](#nativedate) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.toDate()](#todate) <Badge type="tip" text="Qrono" />
  - [.toDatetime()](#todatetime) <Badge type="warning" text="QronoDate" />
- [Constants](#constants)
  - [qrono.monday](#day-constants) <Badge type="info" text="static" />
  - [qrono.tuesday](#day-constants) <Badge type="info" text="static" />
  - [qrono.wednesday](#day-constants) <Badge type="info" text="static" />
  - [qrono.thursday](#day-constants) <Badge type="info" text="static" />
  - [qrono.friday](#day-constants) <Badge type="info" text="static" />
  - [qrono.saturday](#day-constants) <Badge type="info" text="static" />
  - [qrono.sunday](#day-constants) <Badge type="info" text="static" />
- [Accessors](#accessors)
  - [.year()](#year) <Badge type="tip" text="Qrono" /> <small>2 overloads</small> <Badge type="warning" text="QronoDate" /> <small>2 overloads</small>
  - [.month()](#month) <Badge type="tip" text="Qrono" /> <small>2 overloads</small> <Badge type="warning" text="QronoDate" /> <small>2 overloads</small>
  - [.day()](#day) <Badge type="tip" text="Qrono" /> <small>2 overloads</small> <Badge type="warning" text="QronoDate" /> <small>2 overloads</small>
  - [.hour()](#hour) <Badge type="tip" text="Qrono" /> <small>2 overloads</small>
  - [.minute()](#minute) <Badge type="tip" text="Qrono" /> <small>2 overloads</small>
  - [.second()](#second) <Badge type="tip" text="Qrono" /> <small>2 overloads</small>
  - [.millisecond()](#millisecond) <Badge type="tip" text="Qrono" /> <small>2 overloads</small>
  - [.offset()](#offset) <Badge type="tip" text="Qrono" />
- [Context](#context-methods)
  - [qrono.context()](#default-context) <Badge type="info" text="static" /> <small>2 overloads</small>
  - [qrono.asUtc()](#default-asutc) <Badge type="info" text="static" />
  - [qrono.asLocaltime()](#default-aslocaltime) <Badge type="info" text="static" />
  - [qrono.localtime()](#default-localtime) <Badge type="info" text="static" /> <small>2 overloads</small>
  - [.context()](#context) <Badge type="tip" text="Qrono" /> <small>2 overloads</small>
  - [.localtime()](#localtime) <Badge type="tip" text="Qrono" /> <small>2 overloads</small>
  - [.disambiguation()](#disambiguation) <Badge type="tip" text="Qrono" /> <small>2 overloads</small>
  - [qrono.disambiguation()](#default-disambiguation) <Badge type="info" text="static" /> <small>2 overloads</small>
  - [.asUtc()](#asutc) <Badge type="tip" text="Qrono" />
  - [.asLocaltime()](#aslocaltime) <Badge type="tip" text="Qrono" />
- [Calculation](#calculation)
  - [.plus(duration)](#plus) <Badge type="tip" text="Qrono" /> <small>4 overloads</small> <Badge type="warning" text="QronoDate" /> <small>4 overloads</small>
  - [.minus(duration)](#minus) <Badge type="tip" text="Qrono" /> <small>4 overloads</small> <Badge type="warning" text="QronoDate" /> <small>4 overloads</small>
  - [.valid()](#valid) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
- [Comparison](#comparison)
  - [.isSame(other)](#issame) <Badge type="tip" text="Qrono" /> <small>3 overloads</small> <Badge type="warning" text="QronoDate" /> <small>3 overloads</small>
  - [.isBefore(other)](#isbefore) <Badge type="tip" text="Qrono" /> <small>3 overloads</small> <Badge type="warning" text="QronoDate" /> <small>3 overloads</small>
  - [.isAfter(other)](#isafter) <Badge type="tip" text="Qrono" /> <small>3 overloads</small> <Badge type="warning" text="QronoDate" /> <small>3 overloads</small>
  - [.isSameOrBefore(other)](#issameorbefore) <Badge type="tip" text="Qrono" /> <small>3 overloads</small> <Badge type="warning" text="QronoDate" /> <small>3 overloads</small>
  - [.isSameOrAfter(other)](#issameorafter) <Badge type="tip" text="Qrono" /> <small>3 overloads</small> <Badge type="warning" text="QronoDate" /> <small>3 overloads</small>
  - [.isBetween(start, end)](#isbetween) <Badge type="tip" text="Qrono" /> <small>3 overloads</small> <Badge type="warning" text="QronoDate" /> <small>3 overloads</small>
- [Time Unit Boundary](#boundary)
  - [.startOfYear()](#startofyear) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.startOfMonth()](#startofmonth) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.startOfDay()](#startofday) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.startOfHour()](#startofhour) <Badge type="tip" text="Qrono" />
  - [.startOfMinute()](#startofminute) <Badge type="tip" text="Qrono" />
  - [.startOfSecond()](#startofsecond) <Badge type="tip" text="Qrono" />
  - [.endOfYear()](#endofyear) <Badge type="warning" text="QronoDate" />
  - [.endOfMonth()](#endofmonth) <Badge type="warning" text="QronoDate" />
- [Date Information](#date-info)
  - [.dayOfWeek()](#dayofweek) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.dayOfYear()](#dayofyear) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.weekOfYear()](#weekofyear) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.yearOfWeek()](#yearofweek) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.isLeapYear()](#isleapyear) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.daysInMonth()](#daysinmonth) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.daysInYear()](#daysinyear) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.weeksInYear()](#weeksinyear) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
- [Daylight Saving Time](#dst)
  - [.hasDstInYear()](#hasdstinyear) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.isInDst()](#isindst) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.isDstTransitionDay()](#isdsttransitionday) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />
  - [.minutesInDay()](#minutesinday) <Badge type="tip" text="Qrono" /> <Badge type="warning" text="QronoDate" />

## Factory {#factory}

All Factory methods accept an optional `context` object as the first argument to configure how the instance handles timezone and DST settings.

### qrono(...args) {#qrono}

Creates a new `Qrono` datetime instance.

```javascript
import { qrono } from 'qrono'

// Current time
qrono()

// From Date object
qrono(new Date())

// From timestamp (milliseconds)
qrono(1704067200000)

// From ISO string
//
// Conforms to ISO 8601 format except for a few exceptions.
// If no time zone is specified, parsing is performed
// according to the current context (`localtime`).
//
// Format:
// yyyy[[-|/]MM[[-|/]DD]][(T| )HH[:]mm[[:]ss[(.|:)SSS]]][Z|(+|-)hh:mm]
//
qrono('2024-01-15T10:30:00.000Z')

// From components (year, month, day, hour, minute, second, millisecond)
qrono(2024, 1, 15, 10, 30, 0, 0)

// From array
qrono([2024, 1, 15, 10, 30])

// From object
qrono({ year: 2024, month: 1, day: 15 })

// With context options (context as first argument)
qrono({ localtime: true }, '2024-01-15')
```

### qrono.date(...args) {#qrono-date}

Creates a new `QronoDate` instance (date only, no time component).

```javascript
// Today
qrono.date()

// From string
qrono.date('2024-01-15')

// From components
qrono.date(2024, 1, 15)

// From array
qrono.date([2024, 1, 15])

// From object
qrono.date({ year: 2024, month: 1, day: 15 })
```

## Conversion {#conversion}

### toString() {#tostring}

Get the ISO 8601 string representation.

```javascript
time.toString()  // "2024-06-15T14:30:00.000Z"

qrono.date('2024-06-15').toString()  // "2024-06-15"
```

### numeric() {#numeric}

Get the Unix timestamp in milliseconds.

```javascript
time.numeric()  // 1718458200000
```

### valueOf() {#valueof}

Same as `numeric()`. Allows using `+time` syntax.

```javascript
+time  // 1718458200000
```

### toArray() {#toarray}

Get an array of components.

```javascript
time.toArray()  // [2024, 6, 15, 14, 30, 0, 0]

qrono.date('2024-06-15').toArray()  // [2024, 6, 15]
```

### toObject() {#toobject}

Get an object with named properties.

```javascript
time.toObject()
// { year: 2024, month: 6, day: 15, hour: 14, minute: 30, second: 0, millisecond: 0 }

qrono.date('2024-06-15').toObject()
// { year: 2024, month: 6, day: 15 }
```

### nativeDate() {#nativedate}

Get a native JavaScript Date object.

```javascript
time.nativeDate()  // Date instance
```

### toDate() {#todate}

Get a `QronoDate` instance (date portion only).

```javascript
time.toDate()  // QronoDate instance
```

### toDatetime() {#todatetime}

Converts a `QronoDate` to a `Qrono` datetime at midnight.

```javascript
qrono.date('2024-06-15').toDatetime().toString()
// "2024-06-15T00:00:00.000Z"
```

## Constants {#constants}

### Day of Week {#day-constants}

```javascript
qrono.monday    // 1
qrono.tuesday   // 2
qrono.wednesday // 3
qrono.thursday  // 4
qrono.friday    // 5
qrono.saturday  // 6
qrono.sunday    // 7
```

## Accessors {#accessors}

All component methods work as both getters (no argument) and setters (with argument). Setters return a new instance (immutable).

### year() {#year}

```javascript
const time = qrono('2024-06-15')
time.year()      // 2024 (getter)
time.year(2025)  // New instance with year 2025
```

### month() {#month}

```javascript
time.month()    // 6 (getter, 1-12)
time.month(12)  // New instance with month 12
```

### day() {#day}

```javascript
time.day()    // 15 (getter)
time.day(20)  // New instance with day 20
```

### hour() {#hour}

```javascript
time.hour()    // 14 (getter, 0-23)
time.hour(10)  // New instance with hour 10
```

### minute() {#minute}

```javascript
time.minute()    // 30 (getter, 0-59)
time.minute(45)  // New instance with minute 45
```

### second() {#second}

```javascript
time.second()    // 45 (getter, 0-59)
time.second(30)  // New instance with second 30
```

### millisecond() {#millisecond}

```javascript
time.millisecond()     // 123 (getter, 0-999)
time.millisecond(500)  // New instance with millisecond 500
```

### offset() {#offset}

Returns the time zone offset of the Qrono instance in minutes.  
A positive value indicates that the base time is ahead of UTC, and a negative value indicates that it is behind UTC.  

::: tip
This is the opposite sign convention of JavaScript's `Date.prototype.getTimezoneOffset`.
:::

```javascript
qrono().asUtc().offset()       // 0
qrono().asLocaltime().offset() // e.g., 540 (JST)
```

## Context {#context-methods}

### qrono.context(options) {#default-context}

Sets the default context for all new instances.

```javascript
qrono.context({ localtime: true, disambiguation: 'earlier' })
```

**Parameters:**
- `localtime` - `boolean` - Use local time instead of UTC
- `disambiguation` - `'compatible' | 'earlier' | 'later' | 'reject'` - How to resolve ambiguous local times at DST transitions (default: `'compatible'`)
  | Option                     | Gap (spring-forward)    | Overlap (fall-back)     |
  |----------------------------|-------------------------|-------------------------|
  | `'compatible'` *(default)* | Later (DST side)        | Earlier (standard side) |
  | `'earlier'`                | Earlier (standard side) | Earlier (standard side) |
  | `'later'`                  | Later (DST side)        | Later (DST side)        |
  | `'reject'`                 | Throws `RangeError`     | Throws `RangeError`     |

### qrono.asUtc() {#default-asutc}

Sets the default context to UTC mode and returns the qrono function for chaining.

```javascript
qrono.asUtc()
const utcTime = qrono('2024-01-15')
utcTime.localtime()  // false
```

### qrono.asLocaltime() {#default-aslocaltime}

Sets the default context to local time mode and returns the qrono function for chaining.

```javascript
qrono.asLocaltime()
const localTime = qrono('2024-01-15')
localTime.localtime()  // true
```

### qrono.localtime(value) {#default-localtime}

Sets and returns the qrono default localtime setting.

```javascript
qrono.localtime(true)
qrono.localtime()  // true
```

### context() {#context}

Get or set context options.

```javascript
// Get current context
time.context()  // { localtime: false, disambiguation: 'compatible' }

// Set context (returns new instance)
time.context({ localtime: true })
```

### localtime() {#localtime}

Get or set localtime mode.

```javascript
time.localtime()      // Get: true or false
time.localtime(true)  // Set: returns new instance
```

### disambiguation() {#disambiguation}

Get or set the DST disambiguation strategy. Controls how local times that fall in a DST gap (spring-forward) or overlap (fall-back) are resolved.

```javascript
time.disambiguation()            // Get: 'compatible' | 'earlier' | 'later' | 'reject'
time.disambiguation('earlier')   // Set: returns new instance
```

| Value | Gap (spring-forward) | Overlap (fall-back) |
|---|---|---|
| `'compatible'` *(default)* | Later (DST side, JS native) | Earlier (standard-time side) |
| `'earlier'` | Earlier (standard-time side) | Earlier (standard-time side) |
| `'later'` | Later (DST side) | Later (DST side) |
| `'reject'` | Throws `RangeError` | Throws `RangeError` |

### qrono.disambiguation(value) {#default-disambiguation}

Sets and returns the qrono default disambiguation setting.

```javascript
qrono.disambiguation('later')
qrono.disambiguation()  // 'later'
```

### asUtc() {#asutc}

Convert to UTC mode.

```javascript
const utc = time.asUtc()
utc.localtime()  // false
```

### asLocaltime() {#aslocaltime}

Convert to local time mode.

```javascript
const local = time.asLocaltime()
local.localtime()  // true
```

## Calculation {#calculation}

When a `Qrono` instance is cast to a number, it represents the milliseconds since the UNIX epoch, just like a `Date` object. A `QronoDate` instance uses “days” as its unit. Therefore, expressions like the following work as expected.

```javascript
qrono('2021-08-31 12:34') < qrono('2021-09-30 12:34')
const today = qrono.date('2021-08-31')
const tomorrow = qrono.date(today + 1)
tomorrow - today === 1
```

### plus(duration) {#plus}

Add time to the date.  
In operations using Object, `year`, `month`, and `day` are calculated _literally_.  
For example, adding one month at the end of a month results in the end of the following month.  
`hour`, `minute`, `second`, and `millisecond` are treated as a duration in calculations.

```javascript
time.plus({ month: 2, day: 15 })
time.plus({ hour: 5, minute: 30, second: 45, millisecond: 500 })
time.plus(3600 * 1000)                // add one hour via milliseconds
time.plus([0, 1, 1, 4])               // add 1 month, 1 day, 4 hours
time.plus({ minute: 15, second: 30 }) // add minutes + seconds
```
`QronoDate` variants also accept:
```javascript
qrono.date('2024-01-01').plus(1)            // +1 day
qrono.date('2024-01-01').plus([0, 1, 1])    // +1 month, +1 day
qrono.date('2024-01-01').plus({ year: 1 })  // same object form
```

### minus(duration) {#minus}

Subtract time from the date.  
In operations using Object, `year`, `month`, and `day` are calculated _literally_.  
For example, subtracting `{ month: 1 }` from July 31 results in June 28.  
`hour`, `minute`, `second`, and `millisecond` are treated as a duration in calculations.

```javascript
time.minus({ year: 1 })
time.minus({ month: 2, day: 15 })
time.minus({ hour: 5, minute: 30 })
time.minus(15 * 60 * 1000)          // subtract 15 minutes via milliseconds
time.minus([0, 0, 0, 6])            // subtract 6 hours
time.minus({ day: 1, minute: 45 })  // subtract days + minutes
```
`QronoDate` variants also accept:
```javascript
qrono.date('2024-01-05').minus(2)             // -2 days
qrono.date('2024-01-05').minus([0, 0, 5])     // -5 days
qrono.date('2024-01-05').minus({ month: 1 })  // subtract month
```

### valid() {#valid}

Check if the instance represents a valid date.

```javascript
qrono('2024-01-15').valid()        // true
qrono(new Date('invalid')).valid() // false
```

## Comparison {#comparison}

### isSame(other) {#issame}

Check if two dates are equal.

```javascript
time.isSame(qrono('2024-01-15'))  // true or false
time.isSame(new Date())
time.isSame(1704067200000)
```

### isBefore(other) {#isbefore}

Check if this date is before another.

```javascript
time.isBefore(qrono('2024-12-31'))  // true or false
```

### isAfter(other) {#isafter}

Check if this date is after another.

```javascript
time.isAfter(qrono('2024-01-01'))  // true or false
```

### isSameOrBefore(other) {#issameorbefore}

Check if this date is the same or before another.

```javascript
time.isSameOrBefore(qrono('2024-12-31'))  // true or false
```

### isSameOrAfter(other) {#issameorafter}

Check if this date is the same or after another.

```javascript
time.isSameOrAfter(qrono('2024-01-01'))  // true or false
```

### isBetween(start, end) {#isbetween}

Check if this date is between two dates (inclusive).

```javascript
time.isBetween(qrono('2024-01-01'), qrono('2024-12-31'))  // true or false
```

## Time Unit Boundary {#boundary}

### startOfYear() {#startofyear}

Get the start of the year.

```javascript
qrono('2024-06-15 14:30:00').startOfYear()
// 2024-01-01T00:00:00.000Z
```

### startOfMonth() {#startofmonth}

Get the start of the month.

```javascript
qrono('2024-06-15 14:30:00').startOfMonth()
// 2024-06-01T00:00:00.000Z
```

### startOfDay() {#startofday}

Get the start of the day.

```javascript
qrono('2024-06-15 14:30:00').startOfDay()
// 2024-06-15T00:00:00.000Z
```

### startOfHour() {#startofhour}

Get the start of the hour.

```javascript
qrono('2024-06-15 14:30:45').startOfHour()
// 2024-06-15T14:00:00.000Z
```

### startOfMinute() {#startofminute}

Get the start of the minute.

```javascript
qrono('2024-06-15 14:30:45').startOfMinute()
// 2024-06-15T14:30:00.000Z
```

### startOfSecond() {#startofsecond}

Get the start of the second.

```javascript
qrono('2024-06-15 14:30:45.123').startOfSecond()
// 2024-06-15T14:30:45.000Z
```

### endOfYear() {#endofyear}

Returns the last day of the year.

```javascript
qrono.date('2024-06-15').endOfYear().toString()  // "2024-12-31"
```

### endOfMonth() {#endofmonth}

Returns the last day of the month.

```javascript
qrono.date('2024-06-15').endOfMonth().toString()  // "2024-06-30"
```

## Date Information {#date-info}

### dayOfWeek() {#dayofweek}

Get the day of the week (Monday = 1, Sunday = 7).

```javascript
qrono('2024-06-15').dayOfWeek() === qrono.saturday  // 6
```

### dayOfYear() {#dayofyear}

Get the day of the year (1-366).

```javascript
qrono('2024-06-15').dayOfYear()  // 167
```

### weekOfYear() {#weekofyear}

Get the ISO week number.

```javascript
qrono('2024-06-15').weekOfYear()  // 24
```

### yearOfWeek() {#yearofweek}

Get the year of the ISO week (may differ at year boundaries).

```javascript
qrono('2025-12-29').yearOfWeek()  // 2026
```

### isLeapYear() {#isleapyear}

Check if the year is a leap year.

```javascript
qrono('2024-01-01').isLeapYear()  // true
```

### daysInMonth() {#daysinmonth}

Get the number of days in the current month.

```javascript
qrono('2024-02-15').daysInMonth()  // 29
```

### daysInYear() {#daysinyear}

Get the number of days in the current year.

```javascript
qrono('2024-01-01').daysInYear()  // 366
```

### weeksInYear() {#weeksinyear}

Get the number of ISO weeks in the current year (52 or 53).

```javascript
qrono('2024-01-01').weeksInYear()  // 52
```

## Daylight Saving Time {#dst}

### hasDstInYear() {#hasdstinyear}

Check if the year has daylight saving time transitions.

```javascript
qrono.asLocaltime()

qrono(1950, 1, 1).hasDstInYear()  // true
qrono(2024, 1, 1).hasDstInYear()  // false (in Japan)
```

### isInDst() {#isindst}

Check if the current time is in daylight saving time.

```javascript
qrono.asLocaltime()

qrono('1950-09-10 00:59:59').isInDst()  // true
```

### isDstTransitionDay() {#isdsttransitionday}

Check if the current day has a DST transition.

```javascript
qrono.asLocaltime()

qrono('1950-05-07').isDstTransitionDay()  // true
```

### minutesInDay() {#minutesinday}

Get the number of minutes in the current day (accounts for DST).

```javascript
qrono.asLocaltime()

qrono('1950-05-06').minutesInDay()  // 1440
qrono('1950-05-07').minutesInDay()  // 1380 (DST spring forward)
qrono('1950-09-10').minutesInDay()  // 1500 (DST fall back)
```
