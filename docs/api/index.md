# API Reference

Complete API reference for Qrono.

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
qrono('2024-01-15T10:30:00.000Z')

// From components (year, month, day, hour, minute, second, millisecond)
qrono(2024, 1, 15, 10, 30, 0, 0)

// From array
qrono([2024, 1, 15, 10, 30])

// From object
qrono({ year: 2024, month: 1, day: 15 })

// With context options (context as first argument)
qrono({ localtime: true }, '2024-01-15')

// Context options are applied to the instance
qrono({ localtime: true, ambiguousAsDst: false }, '2024-01-15')
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

### valid() {#valid}

Check if the instance represents a valid date.

```javascript
qrono('2024-01-15').valid()        // true
qrono(new Date('invalid')).valid() // false
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

Get the timezone offset in minutes.

```javascript
qrono().asUtc().offset()       // 0
qrono().asLocaltime().offset() // e.g., 540 (JST)
```

## Context {#context-methods}

### qrono.context(options) {#default-context}

Sets the default context for all new instances.

```javascript
qrono.context({ localtime: true, ambiguousAsDst: false })
```

**Parameters:**
- `localtime` - `boolean` - Use local time instead of UTC
- `ambiguousAsDst` - `boolean` - Interpret ambiguous times as DST

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
time.context()  // { localtime: false, ambiguousAsDst: false }

// Set context (returns new instance)
time.context({ localtime: true })
```

### localtime() {#localtime}

Get or set localtime mode.

```javascript
time.localtime()      // Get: true or false
time.localtime(true)  // Set: returns new instance
```

### ambiguousAsDst() {#ambiguousasdst}

Get or set ambiguous DST handling.

```javascript
time.ambiguousAsDst()      // Get: true or false
time.ambiguousAsDst(true)  // Set: returns new instance
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

### plus(duration) {#plus}

Add time to the date.

```javascript
time.plus({ year: 1 })
time.plus({ month: 2, day: 15 })
time.plus({ hour: 5, minute: 30, second: 45, millisecond: 500 })
```

### minus(duration) {#minus}

Subtract time from the date.

```javascript
time.minus({ year: 1 })
time.minus({ month: 2, day: 15 })
```

## Comparison Methods {#comparison}

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

## Start Of Methods {#start-of}

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

## End Of Methods {#end-of}

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

## DST Methods {#dst}

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
