export const epoch = new Date(0)

/**
 * When creating or updating a local time, both `Date.setFullYear` and `Date.setHours` are used.
 * Noon is used as the initial reference point to avoid the time after `setFullYear`
 * from falling into an ambiguous DST period. Historically, DST transitions in all countries
 * have been scheduled around midnight, and it should be the same in the future.
 * The reason for selecting 1915 as the initial value is as follows.
 * Since DST was first established in 1916, the initial value should be set to a year prior to that.
 * If a year too far in the past is chosen, it may correspond to a period when time zones were not yet
 * precisely defined in some regions, which could result in unexpected timezone offsets.
 */
export const initialSafeDate = new Date(1915, 0, 1, 12, 0, 0, 0)

export const daysPerWeek = 7
export const hoursPerDay = 24
export const hoursPerWeek = hoursPerDay * daysPerWeek
export const minutesPerHour = 60
export const minutesPerDay = minutesPerHour * hoursPerDay
export const minutesPerWeek = minutesPerDay * daysPerWeek
export const secondsPerMinute = 60
export const secondsPerHour = secondsPerMinute * minutesPerHour
export const secondsPerDay = secondsPerHour * hoursPerDay
export const secondsPerWeek = secondsPerDay * daysPerWeek
export const millisecondsPerSecond = 1000
export const millisecondsPerMinute = secondsPerMinute * millisecondsPerSecond
export const millisecondsPerHour = secondsPerHour * millisecondsPerSecond
export const millisecondsPerDay = secondsPerDay * millisecondsPerSecond
export const millisecondsPerWeek = secondsPerWeek * millisecondsPerSecond

export const monday = 1
export const tuesday = 2
export const wednesday = 3
export const thursday = 4
export const friday = 5
export const saturday = 6
export const sunday = 7

export function has(object, ...keys) {
  return keys.flat().some(object.hasOwnProperty, object)
}

export function fields(object) {
  return Object.entries(object)
    .filter(([, value]) => !isFunction(value))
    .map(([key]) => key)
}

export function given(arg) {
  return arg !== undefined
}

export function isFunction(a) {
  return a instanceof Function
}

export function isString(a) {
  return typeof a === 'string' || a instanceof String
}

export function isObject(a) {
  return a !== null && typeof a === 'object' && a.constructor === Object
}

export function isValidDate(date) {
  return !isNaN(date.getTime())
}

export function hasDateField(object) {
  return has(object, ['year', 'month', 'day'])
}

export function hasTimeField(object) {
  return has(object, ['hour', 'minute', 'second', 'millisecond'])
}

export function hasDatetimeField(object) {
  return has(object, [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'millisecond',
  ])
}

/**
 * Adjust a Date to respect the caller's interpretation of DST (Daylight Saving Time).
 *
 * - If `interpretAsDst` is true, the function returns a copy of the original `date`
 *   unchanged. `Date` always treats the ambiguous time as DST.
 * - If `interpretAsDst` is false, the function will attempt to detect a nearby DST
 *   offset change and adjust the moment in time so that the returned `Date` represents
 *   the same nominal local fields but interpreted as the non-DST side of the
 *   transition. This helps disambiguate ambiguous local times by moving to the
 *   corresponding instant in UTC that matches the requested DST interpretation.
 */
export function asDst(interpretAsDst, date) {
  const numeric = date.getTime()
  const original = new Date(numeric)
  if (interpretAsDst) { return original }
  const nextDay = new Date(numeric)
  nextDay.setDate(date.getDate() + 1)
  const prevDay = new Date(numeric)
  prevDay.setDate(date.getDate() - 1)
  const adjust = nextDay.getTimezoneOffset() - prevDay.getTimezoneOffset()
  if (adjust === 0) { return original }
  const adjusted = new Date(numeric).setMinutes(date.getMinutes() + adjust)
  const adjustedUTC = new Date(numeric).setUTCMinutes(date.getUTCMinutes() + adjust)
  if (adjusted === adjustedUTC || (
    (adjust < 0 && adjusted === numeric) ||
    (adjust > 0 && adjusted !== numeric)
  )) {
    return original
  }
  return new Date(adjustedUTC)
}
