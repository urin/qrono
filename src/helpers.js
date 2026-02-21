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
  return !Number.isNaN(date.getTime())
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
 * Resolve a local time that falls on or near a DST transition boundary.
 *
 * Handles two distinct cases that arise when constructing a local Date:
 *
 * GAP (spring-forward, isGap = true):
 *   A range of local times is skipped entirely. JavaScript automatically advances
 *   the time to the next valid moment (post-transition / DST side), adding the gap
 *   size to the UTC timestamp. The caller detects a gap by comparing the constructed
 *   Date's local fields against the originally requested values.
 *   - interpretAsDst = true  → accept JS's forward-shift as-is (DST side)
 *   - interpretAsDst = false → shift UTC back by the gap size (pre-transition side)
 *
 * OVERLAP (fall-back, isGap = false):
 *   A range of local times occurs twice. JavaScript always picks the DST side
 *   (first occurrence). If the time is not actually in an overlap, the adjustment
 *   will not preserve the original local fields and the original Date is returned.
 *   - interpretAsDst = true  → accept JS's DST-side interpretation as-is
 *   - interpretAsDst = false → shift UTC by the offset difference (standard-time side)
 *
 * In both cases the UTC adjustment uses the same formula:
 *   adjustedUTC = date.getTime() + adjust * millisecondsPerMinute
 * where adjust = nextDay.timezoneOffset - prevDay.timezoneOffset.
 * For a gap  the adjust is negative (offsets decrease going forward),
 * so subtracting it moves UTC backward to the pre-transition side.
 * For an overlap the adjust is also negative in the same direction,
 * and the same subtraction moves to the standard-time side.
 *
 * @param {boolean} interpretAsDst
 * @param {Date}    date  - The Date constructed from the requested local fields.
 * @param {boolean} isGap - true if the requested time fell in a DST gap (spring-forward).
 * @returns {Date}
 */
export function resolveDstTime(interpretAsDst, date, isGap) {
  const numeric = date.getTime()
  const original = new Date(numeric)
  if (interpretAsDst) {
    return original
  }
  const nextDay = new Date(numeric)
  nextDay.setDate(date.getDate() + 1)
  const prevDay = new Date(numeric)
  prevDay.setDate(date.getDate() - 1)
  const adjust = nextDay.getTimezoneOffset() - prevDay.getTimezoneOffset()
  if (adjust === 0) {
    return original
  }
  const adjustedUTC = new Date(
    new Date(numeric).setUTCMinutes(date.getUTCMinutes() + adjust)
  )
  if (isGap) {
    return adjustedUTC
  }
  // For an overlap, verify the candidate preserves the original local fields.
  // If it does not, the time is not actually in an overlap — return as-is.
  if (
    adjustedUTC.getHours() !== date.getHours() ||
    adjustedUTC.getMinutes() !== date.getMinutes()
  ) {
    return original
  }
  return adjustedUTC
}
