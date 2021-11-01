# Qrono<small> - 🕥 Just right date time library</small>

[![MIT License][image-license]][url-license]
[![NPM version][image-npm-version]][url-npm]
[![NPM downloads][image-npm-downloads]][url-npm-downloads]
[![gzip size][image-size]][url-size]

```js
qrono('2021-08-31 12:34').plus({ month: 1 }).isSame(qrono('2021-09-30 12:34'))
qrono('2021-08-31 12:34') < qrono('2021-09-30 12:34')
qrono({ localtime: true }, '2021-08-31 12:34').toString() === '2021-08-31T12:34.000-04:00'
```

[🎨 Design philosophy](#design-philosophy-) \| [📥 Getting started](#getting-started-) \| [🚀 Quick tour](#quick-tour-) \| [🌏 License](#license-)

---

## Design philosophy 🎨

- Provides immutable and chainable functions that are necessary in most cases.
- Supports only UTC (as default) and local time of the environment.
- Enables to handle ambiguous time of daylight saving time strictly.
- Not support localization.
  It could be done with [ECMAScript® Internationalization API](https://402.ecma-international.org/#overview).
- Follows [ISO 8601](https://www.iso.org/obp/ui/#iso:std:iso:8601:-1:ed-1:v1:en).
- Pure JavaScript without dependencies.

<details>
  <summary>Alternatives</summary>
  <ul>
    <li>
      <a href="https://github.com/moment/moment">Moment.js</a>
      <br>
      Legacy, mutable, rich, widely support localization and time zone
    </li>
    <li>
      <a href="https://github.com/moment/luxon">Luxon</a>
      <br>
      Modern, rich, good code base and docs, widely support localization and time zone
    </li>
    <li>
      <a href="https://github.com/iamkun/dayjs">Day.js</a>
      <br>
      Modern, rich, extendable by plugins, widely support localization and time zone
    </li>
    <li>
      <a href="https://github.com/date-fns/date-fns">date-fns</a>
      <br>
      Modern, pure functions for JavaScript Date object, tree-shaking available
    </li>
    <li>
      <a href="https://tc39.es/proposal-temporal/docs/index.html">
        The ECMA TC39 Temporal Proposal
      </a>
      <br>
      Standard for future, class-based, similar to <a href="https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html">java.time</a>
    </li>
  </ul>
</details>


## Getting started 📥

### Browser

```html
<script src="path/to/qrono.min.js"></script>
<!-- from UNPKG -->
<script src="https://unpkg.com/qrono/dist/qrono.min.js"></script>
```

### Node.js

```sh
npm install qrono
```

```js
// as module
import qrono from 'qrono'
// or CommonJS
const { qrono } = require('qrono')
```

## Quick tour 🚀

### Construction

```js
// now
qrono()
// from various type of arguments
qrono('2022-12-31') // => 2022-12-31T00:00:00.000Z
qrono(new Date())
// followings are same 2022-12-31T15:23:11.321Z
qrono('2022-12-31 15:23:11.321')
qrono(1672500191321)
qrono(2022, 12, 31, 15, 23, 11, 321)
qrono([2022, 12, 31, 15, 23, 11, 321])
qrono({ year: 2022, month: 12, day: 31, hour: 15, minute: 23, second: 11, millisecond: 321 })
```

### Accessor

```js
const time = qrono(2022, 12, 31, 15, 23, 11, 321)
time.year()        // => 2022
time.month()       // => 12
time.day()         // => 31
time.hour()        // => 15
time.minute()      // => 23
time.second()      // => 11
time.millisecond() // => 321

time.second(0) // => returns new Qrono instance
```

### Time zone

```js
// UTC as default
qrono('2022-12-31 15:23:11.321').toString() // => "2022-12-31T15:23:11.321Z"
// set default to local time
qrono.asLocaltime()
qrono('2022-12-31 15:23:11.321').toString()     // => "2022-12-31T15:23:11.321-04:00"
qrono('2022-12-31 15:23:11.321').asUtc().hour() // => 11 as UTC
qrono('2022-12-31 15:23:11.321').hour()         // => 15 as local time
```

### Conversion

```js
qrono('2000-01-01').numeric() // => 946,684,800,000 milliseconds from UNIX epoch
  === +qrono('2000-01-01')    // => true
const time = qrono('2000-01-02 03:04:05.006')
time.toObject()   // => { year: 2000, month: 1, day: 2, hour: 3, minute: 4, second: 5, millisecond: 6 }
time.toArray()    // => [2000, 1, 2, 3, 4, 5, 6]
time.nativeDate() // => JavaScript native Date instance
```

### Calculation

```js
qrono('2000-01-01 01:00:00.000') - qrono('2000-01-01') // => 3,600,000 milliseconds = 1 hour
qrono('2000-01-01 01:00:00.000') < qrono('2000-01-01') // => false
qrono('2000-01-01').plus(7200000).minus(3600000)       // => 2000-01-01T01:00:00.000Z
qrono('2000-01-01').minus({ hour: 1, minute: 30 })     // => 1999-12-31T22:30:00.000Z

const today = qrono()
const yesterday = today.minus({ day: 1 })
const tommorrow = today.plus({ day: 1 })
today.isBetween(yesterday, tommorrow) // => true
```

### QronoDate

`qrono.date(...)` returns a `QronoDate` instance with only date information.

Methods of `QronoDate` are almost compatible with those of `Qrono`.

```js
qrono.date('2000-01-02').toString()       // => "2000-01-02"
qrono('2000-01-02 23:04:05.006').toDate() // => QronoDate instance 2000-01-02
qrono.date('2000-01-02').numeric()        // => 10958 days from UNIX epoch
```

### Short-hands

```js
const time = qrono('2000-01-02 03:04:05.006')
time.startOfYear()   // => 2000-01-01T00:00:00.000Z
time.startOfMonth()  // => 2000-01-01T00:00:00.000Z
time.startOfDay()    // => 2000-01-02T00:00:00.000Z
time.startOfHour()   // => 2000-01-02T03:00:00.000Z
time.startOfMinute() // => 2000-01-02T03:04:00.000Z
time.startOfSecond() // => 2000-01-02T03:04:05.000Z
time.dayOfWeek()     // => 7 === qrono.sunday
time.dayOfYear()     // => 2
time.isLeapYear()    // => true
time.daysInMonth()   // => 31
time.daysInYear()    // => 366
// ISO week number. See https://en.wikipedia.org/wiki/ISO_week_date
time.weeksInYear()   // => 52
time.weekOfYear()    // => 52
time.yearOfWeek()    // => 1999
// Daylight saving time stuff that is meaningful in case of local time
const localtime = time.asLocaltime()
localtime.hasDstInYear()
localtime.isInDst()
localtime.isDstTransitionDay()
localtime.minutesInDay()
```

## License 🌏

[MIT][url-license]

Copyright (c) 2021 [Urin](https://github.com/urin)


<!-- Reference -->
[image-license]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[url-license]: LICENSE

[image-npm-version]: https://img.shields.io/npm/v/qrono.svg?style=flat
[url-npm]: https://npmjs.org/package/qrono

[image-npm-downloads]: https://img.shields.io/npm/dm/qrono.svg?style=flat
[url-npm-downloads]: https://npmcharts.com/compare/qrono?minimal=true

[image-size]: https://img.badgesize.io/https://unpkg.com/qrono/dist/qrono.min.js?compression=gzip&color=blue
[url-size]: https://unpkg.com/qrono/dist/qrono.min.js

