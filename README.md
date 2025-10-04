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

- Provides type-safe, immutable and chainable functions necessary for most cases.
- Locality-Agnostic.
  - Localization can be done with the [ECMAScript® Internationalization API](https://402.ecma-international.org/#overview).
- Supports only UTC (default) and the local time of the environment.
  - [Other libraries](#alternatives) have larger codebases and more complicated usage to support multiple time zones and locales.
  - In most cases, supporting only the client's time zone is sufficient.
    [Luxon's explanation](https://moment.github.io/luxon/#/zones?id=don39t-worry) is right to the point.
- Handles ambiguous daylight saving time strictly.
  - This feature is possible due to the lack of support for multiple time zones and locales.
- Follows [ISO 8601](https://www.iso.org/obp/ui/#iso:std:iso:8601:-1:ed-1:v1:en).
- Pure JavaScript without dependencies.

<details>
  <summary id="alternatives">Alternatives</summary>
  <ul>
    <li>
      <a href="https://github.com/moment/moment">Moment.js</a>
      <br>
      A widely used library that was the de-facto standard. It went into maintenance mode in 2020.<br>
      It has a fundamental problem with mutable objects, making it prone to bugs. The later date-time libraries introduced below are all designed to be immutable.<br>
    </li>
    <li>
      <a href="https://github.com/moment/luxon">Luxon</a>
      <br>
      An immutable and rich library created by the maintainers of <a href="https://github.com/moment/moment">Moment.js</a>. Sophisticated and feature-rich. Good codebase to explore.<br>
      By default, it handles time in local time and <a href="https://moment.github.io/luxon/#/zones?id=ambiguous-times">cannot strictly handle ambiguous times</a>.<br>
      It differs from other libraries in that the documentation clearly shows how it behaves with ambiguous time.<br>
    </li>
    <li>
      <a href="https://github.com/iamkun/dayjs">Day.js</a>
      <br>
      A <a href="https://github.com/moment/moment">Moment.js</a> compatible library with a minimum size of 2KB, which has <a href="https://github.com/iamkun/dayjs/stargazers">many GitHub stars</a> and is becoming the de-facto standard. The code readability is not high.<br>
      The codebase is large due to time zone and locale support (178 source files as of 2021-11-02), but the effective size can be reduced if tree-shaking is available.<br>
      Requires importing plugins each time because most functions are provided as plugins.<br>
      Planning a major version upgrade while solving <a href="https://github.com/iamkun/dayjs/issues?q=is%3Aissue+is%3Aopen">many issues</a>.<br>
    </li>
    <li>
      <a href="https://github.com/date-fns/date-fns">date-fns</a>
      <br>
      Provides over 200 pure functions for manipulating JavaScript `Date` objects, implemented in TypeScript and tree-shaking enabled.<br>
      Since the JavaScript `Date` object takes the lead, problems such as mutability and month starting at 0 are inherited. <br>
    </li>
    <li>
      <a href="https://tc39.es/proposal-temporal/docs/index.html">
        The ECMA TC39 Temporal Proposal
      </a>
      <br>
      An ECMAScript® API proposal that may become a future standard. The specification is rigorous, spectacular, and inspired by <a href="https://jcp.org/aboutJava/communityprocess/pfd/jsr310/JSR-310-guide.html">java.time</a>.
    </li>
  </ul>
</details>

### About daylight saving time transitions

JavaScript's `Date` object can behave in non-intuitive ways when handling daylight saving time transitions.

For example, see the following scenario in the Central Standard Time (CST) zone of the USA.

```js
const date = new Date('2021-03-14T03:00:00.000')
date.setMilliseconds(-1) // results 2021-03-14 03:59:59.999 CST
```

On March 14, 2021, daylight saving time begins. The time jumps directly from `2021-03-14 01:59:59 CST` to `2021-03-14 03:00:00 CST`.
In this example, subtracting 1 millisecond from `2021-03-14 03:00:00.000 CST` results in `2021-03-14 03:59:59.999 CST`. This appears to be a simple subtraction of 1 millisecond, but it actually advances the time by 1 hour.

This behavior is not a bug but a result of strictly following the ECMAScript specification (https://262.ecma-international.org/11.0/#sec-local-time-zone-adjustment).

Additionally, a `Date` object created from a duplicated time during daylight saving time (DST) transition always refers to the time before DST ends. In other words, there is no simple way to obtain a `Date` object that refers to the UTC time **after** the end of DST from a duplicated time.

This library addresses these issues by providing a more understandable approach to handling such transitions.

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
import { qrono } from 'qrono'
// or CommonJS
const { qrono } = require('qrono')
```

## Quick tour 🚀

### Construction

```js
// now
qrono()
// from various types of arguments
qrono('2022-12-31') // => 2022-12-31T00:00:00.000Z
qrono(new Date())
// the following are the same 2022-12-31T15:23:11.321Z
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
time.nativeDate() // => JavaScript native `Date` instance
```

### Calculation

```js
qrono('2000-01-01 01:00:00.000') - qrono('2000-01-01') // => 3,600,000 milliseconds = 1 hour
qrono('2000-01-01 01:00:00.000') < qrono('2000-01-01') // => false
qrono('2000-01-01').plus(7200000).minus(3600000)       // => 2000-01-01T01:00:00.000Z
// In operations using Object, `year`, `month`, and `day` are calculated literally.
// For example, adding one month at the end of a month results in the end of the following month.
// `hour`, `minute`, `second`, and `millisecond` are treated as a duration in calculations.
qrono('2000-01-01').minus({ hour: 1, minute: 30 })     // => 1999-12-31T22:30:00.000Z
qrono('2020-02-29').plus({ year: 1 })                  // => 2021-02-28T00:00:00.000Z
qrono('2021-12-31').minus({ month: 1 })                // => 2021-11-30T00:00:00.000Z

const today = qrono()
const yesterday = today.minus({ day: 1 })
const tomorrow = today.plus({ day: 1 })
today.isBetween(yesterday, tomorrow) // => true
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

### QronoDate

`qrono.date(...)` returns a `QronoDate` instance with only date information.

Methods of `QronoDate` are almost compatible with those of `Qrono`.

```js
qrono.date('2000-01-02').toString()       // => "2000-01-02"
qrono('2000-01-02 23:04:05.006').toDate() // => QronoDate instance 2000-01-02
qrono.date('2000-01-02').numeric()        // => 10958 days from UNIX epoch
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
