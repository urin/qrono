# Qrono<small> - Just right date time library</small>

[![MIT License][image-license]][url-license]
[![NPM version][image-npm-version]][url-npm]
[![NPM downloads][image-npm-downloads]][url-npm-downloads]

```js
qrono('2021-08-31 12:34').plus({ month: 1 }).isSame(qrono('2021-09-30 12:34'))
qrono('2021-08-31 12:34') < qrono('2021-09-30 12:34')
qrono({ localtime: true }, '2021-08-31 12:34').toString() === '2021-08-31T12:34.000-04:00'
```

---

* [Design philosophy](#design-philosophy)
* [Examples](#examples)
* [License](#license)

---

## Design philosophy

* Provides functions that are necessary in most cases.
* Supports only UTC (as default) and local time of the environment.
* Enables to handle ambiguous time of daylight saving time strictly.
* Immutable and chainable

## Getting started

### Browser

```html
<script src="path/to/qrono.min.js"></script>
<!-- from UNPKG -->
<script src="https://unpkg.com/qrono/dist/qrono.min.js"></script>
```

### JavaScript

```js
// as module
import { qrono } from 'qrono.js'
// or CommonJS
const { qrono } = require('qrono')
```

## Examples

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

### Time zone

```js
// UTC as default
qrono('2022-12-31 15:23:11.321').toString() // => "2022-12-31T15:23:11.321Z"
// set default to local time
qrono.asLocaltime()
qrono('2022-12-31 15:23:11.321').toString() // => "2022-12-31T15:23:11.321-04:00"
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

time.second(0) // => returns new qrono instance
```

### Calculation

```js
qrono('2000-01-01').numeric() // => 946684800000 milliseconds from epoch
  === +qrono('2000-01-01')    // => true
qrono('2000-01-01 01:00:00.000') - qrono('2000-01-01') // => 3600000 milliseconds = 1 hour
qrono('2000-01-01 01:00:00.000') < qrono('2000-01-01') // => false
qrono('2000-01-01').plus(7200000).minus(3600000)       // => 2000-01-01T01:00:00.000Z
qrono('2000-01-01').minus({ hour: 1, minute: 30 })     // => 1999-12-31T22:30:00.000Z

const today = qrono()
const yesterday = today.minus({ day: 1 })
const tommorrow = today.plus({ day: 1 })
today.isBetween(yesterday, tommorrow) // => true
```

## License

[MIT][url-license]

Copyright (c) 2021 [Urin](https://github.com/urin)


<!-- Reference -->
[image-license]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[url-license]: LICENSE

[url-npm]: https://npmjs.org/package/qrono
[image-npm-version]: https://img.shields.io/npm/v/qrono.svg?style=flat

[image-npm-downloads]: https://img.shields.io/npm/dm/qrono.svg?style=flat
[url-npm-downloads]: https://npmcharts.com/compare/qrono?minimal=true
