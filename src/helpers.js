export const epoch = new Date(0)

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

export function has (object, ...keys) {
  return keys.flat().some(object.hasOwnProperty, object)
}

export function fields (object) {
  return Object.entries(object).filter(
    ([, value]) => !isFunction(value)
  ).map(([key]) => key)
}

export function given (arg) {
  return arg !== undefined
}

export function isFunction (a) {
  return a instanceof Function
}

export function isString (a) {
  return typeof a === 'string' || a instanceof String
}

export function isObject (a) {
  return a !== null && typeof (a) === 'object' && a.constructor === Object
}

export function isValidDate (date) {
  return !isNaN(date.getTime())
}

export function hasDateField (object) {
  return has(object, ['year', 'month', 'day'])
}

export function hasTimeField (object) {
  return has(object, ['hour', 'minute', 'second', 'millisecond'])
}

export function hasDatetimeField (object) {
  return has(object, [
    'year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'
  ])
}

export function asDst (ambiguousAsDst, date) {
  const numeric = date.getTime()
  const result = new Date(numeric)
  if (!ambiguousAsDst) {
    const nextday = new Date(numeric)
    nextday.setDate(date.getDate() + 1)
    const adjust = nextday.getTimezoneOffset() - date.getTimezoneOffset()
    if (adjust > 0) {
      const advanced = new Date(numeric).setMinutes(date.getMinutes() + adjust)
      const advancedUTC = new Date(numeric).setUTCMinutes(date.getUTCMinutes() + adjust)
      if (advanced !== advancedUTC) {
        result.setUTCMinutes(date.getUTCMinutes() + adjust)
      }
    }
  }
  return result
}
