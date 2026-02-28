export { qrono }

/**
 * Creates a new Qrono instance.
 * @param date - A native Date to initialize the Qrono instance with.
 * @returns A new Qrono instance.
 * @example
 * qrono('2021-08-31 12:34')
 */
declare function qrono(date?: Date): qrono.Qrono

/**
 * Creates a new Qrono instance.
 * @param date - A millisecond timestamp (Unix epoch ms).
 * @returns A new Qrono instance.
 */
declare function qrono(date?: number): qrono.Qrono

/**
 * Creates a new Qrono instance.
 * @param date - A date-time string.
 * @returns A new Qrono instance.
 */
declare function qrono(date?: string): qrono.Qrono

/**
 * Creates a new Qrono instance.
 * @param date - Another Qrono instance to clone.
 * @returns A new Qrono instance.
 */
declare function qrono(date?: qrono.Qrono): qrono.Qrono

/**
 * Creates a new Qrono instance.
 * @param date - An array of time fields: `[year, month, day, hour, minute, second, millisecond]`.
 * @returns A new Qrono instance.
 */
declare function qrono(date?: qrono.TimeTuple): qrono.Qrono

/**
 * Creates a new Qrono instance.
 * @param date - An object of time fields.
 * @returns A new Qrono instance.
 */
declare function qrono(date?: qrono.TimeFields): qrono.Qrono

/**
 * Creates a new Qrono instance.
 * @returns A new Qrono instance.
 * @example
 * qrono(2022, 12, 31, 15, 23, 11, 321)
 */
declare function qrono(
  year?: number,
  month?: number,
  day?: number,
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number
): qrono.Qrono

/**
 * Creates a new Qrono instance with a specific context.
 * @param context - The context to initialize the Qrono instance with.
 * @param date - A native Date to initialize the Qrono instance with.
 * @returns A new Qrono instance.
 * @example
 * qrono({ localtime: true }, '2021-08-31 12:34').toString() === '2021-08-31T12:34.000-04:00'
 */
declare function qrono(context?: qrono.Context, date?: Date): qrono.Qrono

/**
 * Creates a new Qrono instance with a specific context.
 * @param context - The context to initialize the Qrono instance with.
 * @param date - A millisecond timestamp (Unix epoch ms).
 * @returns A new Qrono instance.
 */
declare function qrono(context?: qrono.Context, date?: number): qrono.Qrono

/**
 * Creates a new Qrono instance with a specific context.
 * @param context - The context to initialize the Qrono instance with.
 * @param date - A date-time string.
 * @returns A new Qrono instance.
 */
declare function qrono(context?: qrono.Context, date?: string): qrono.Qrono

/**
 * Creates a new Qrono instance with a specific context.
 * @param context - The context to initialize the Qrono instance with.
 * @param date - Another Qrono instance to clone.
 * @returns A new Qrono instance.
 */
declare function qrono(context?: qrono.Context, date?: qrono.Qrono): qrono.Qrono

/**
 * Creates a new Qrono instance with a specific context.
 * @param context - The context to initialize the Qrono instance with.
 * @param date - An array of time fields: `[year, month, day, hour, minute, second, millisecond]`.
 * @returns A new Qrono instance.
 */
declare function qrono(
  context?: qrono.Context,
  date?: qrono.TimeTuple
): qrono.Qrono

/**
 * Creates a new Qrono instance with a specific context.
 * @param context - The context to initialize the Qrono instance with.
 * @param date - An object of time fields.
 * @returns A new Qrono instance.
 */
declare function qrono(
  context?: qrono.Context,
  date?: qrono.TimeFields
): qrono.Qrono

/**
 * Creates a new Qrono instance with a specific context.
 * @param context - The context to initialize the Qrono instance with.
 * @returns A new Qrono instance.
 */
declare function qrono(
  context?: qrono.Context,
  year?: number,
  month?: number,
  day?: number,
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number
): qrono.Qrono

declare namespace qrono {
  type DateTuple = [] | [number] | [number, number] | [number, number, number]
  type TimeTuple =
    | []
    | [number]
    | [number, number]
    | [number, number, number]
    | [number, number, number, number]
    | [number, number, number, number, number]
    | [number, number, number, number, number, number]
    | [number, number, number, number, number, number, number]

  export const monday: number
  export const tuesday: number
  export const wednesday: number
  export const thursday: number
  export const friday: number
  export const saturday: number
  export const sunday: number

  /**
   * Creates a new QronoDate instance.
   * @param date - A native Date to initialize the QronoDate instance with.
   * @returns A new QronoDate instance.
   * @example
   * qrono.date('2000-01-02')
   */
  export function date(date?: Date): QronoDate

  /**
   * Creates a new QronoDate instance.
   * @param date - A millisecond timestamp (Unix epoch ms).
   * @returns A new QronoDate instance.
   */
  export function date(date?: number): QronoDate

  /**
   * Creates a new QronoDate instance.
   * @param date - A date string.
   * @returns A new QronoDate instance.
   */
  export function date(date?: string): QronoDate

  /**
   * Creates a new QronoDate instance.
   * @param date - Another Qrono instance to derive the date from.
   * @returns A new QronoDate instance.
   */
  export function date(date?: qrono.Qrono): QronoDate

  /**
   * Creates a new QronoDate instance.
   * @param date - An array of date fields: `[year, month, day]`.
   * @returns A new QronoDate instance.
   */
  export function date(date?: DateTuple): QronoDate

  /**
   * Creates a new QronoDate instance.
   * @param date - An object of date fields.
   * @returns A new QronoDate instance.
   */
  export function date(date?: qrono.DateFields): QronoDate

  /**
   * Creates a new QronoDate instance.
   * @param year
   * @param month
   * @param day
   * @returns A new QronoDate instance.
   */
  export function date(year?: number, month?: number, day?: number): QronoDate

  /**
   * Returns the current global context.
   */
  export function context(): Context

  /**
   * Sets the context.
   * @param context - The global context to set.
   * @returns The qrono object.
   */
  export function context(context: Context): typeof qrono

  /**
   * The four disambiguation options for resolving ambiguous local times,
   * mirroring the Temporal API.
   *
   * - `'compatible'`: Gap → later (JS native forward-shift). Overlap → earlier (standard-time side).
   * - `'earlier'`:    Gap or overlap → the earlier (standard-time / pre-transition) instant.
   * - `'later'`:      Gap or overlap → the later (DST side / post-transition) instant.
   * - `'reject'`:     Throws `RangeError` if the time falls in a gap or overlap.
   */
  export type Disambiguation = 'compatible' | 'earlier' | 'later' | 'reject'

  export type Context = {
    localtime?: boolean
    disambiguation?: Disambiguation
  }

  export type TimeFields = {
    year?: number
    month?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
    millisecond?: number
  }

  export type DateFields = {
    year?: number
    month?: number
    day?: number
  }

  type Comparable = Qrono | number | Date

  export class Qrono {
    /**
     * Returns the string representation of the Qrono instance.
     */
    toString(): string

    /**
     * Returns the numeric value of the Qrono instance.
     */
    valueOf(): number

    /**
     * Returns the context of the Qrono instance.
     */
    context(): Context

    /**
     * Sets the context of the Qrono instance.
     * @param context - The context to set.
     * @returns The Qrono instance.
     */
    context(context: Context): Qrono

    /**
     * Returns the native `Date` object of the Qrono instance.
     */
    nativeDate(): Date

    /**
     * Returns the time zone offset of the Qrono instance in minutes.
     * A positive value indicates that the base time is ahead of UTC, and a negative value indicates that it is behind UTC.
     * This is the opposite sign convention of Date.prototype.getTimezoneOffset in JavaScript.
     */
    offset(): number

    /**
     * Returns whether the Qrono instance is valid.
     */
    valid(): boolean

    /**
     * Returns the object representation of the Qrono instance.
     */
    toObject(): {
      year: number
      month: number
      day: number
      hour: number
      minute: number
      second: number
      millisecond: number
    }

    /**
     * Returns the array representation of the Qrono instance.
     */
    toArray(): number[]

    /**
     * Returns the QronoDate instance of the Qrono instance.
     */
    toDate(): QronoDate

    /**
     * Returns the year of the Qrono instance.
     */
    year(): number

    /**
     * Sets the year of the Qrono instance.
     * @param value - The year to set.
     * @returns The Qrono instance.
     */
    year(value: number): Qrono

    /**
     * Returns the month of the Qrono instance.
     */
    month(): number

    /**
     * Sets the month of the Qrono instance.
     * @param value - The month to set.
     * @returns The Qrono instance.
     */
    month(value: number): Qrono

    /**
     * Returns the day of the Qrono instance.
     */
    day(): number

    /**
     * Sets the day of the Qrono instance.
     * @param value - The day to set.
     * @returns The Qrono instance.
     */
    day(value: number): Qrono

    /**
     * Returns the hour of the Qrono instance.
     */
    hour(): number

    /**
     * Sets the hour of the Qrono instance.
     * @param value - The hour to set.
     * @returns The Qrono instance.
     */
    hour(value: number): Qrono

    /**
     * Returns the minute of the Qrono instance.
     */
    minute(): number

    /**
     * Sets the minute of the Qrono instance.
     * @param value - The minute to set.
     * @returns The Qrono instance.
     */
    minute(value: number): Qrono

    /**
     * Returns the second of the Qrono instance.
     */
    second(): number

    /**
     * Sets the second of the Qrono instance.
     * @param value - The second to set.
     * @returns The Qrono instance.
     */
    second(value: number): Qrono

    /**
     * Returns the millisecond of the Qrono instance.
     */
    millisecond(): number

    /**
     * Sets the millisecond of the Qrono instance.
     * @param value - The millisecond to set.
     * @returns The Qrono instance.
     */
    millisecond(value: number): Qrono

    /**
     * Returns the day of the week of the Qrono instance.
     */
    dayOfWeek(): number

    /**
     * Returns the day of the year of the Qrono instance.
     */
    dayOfYear(): number

    /**
     * Returns the week of the year of the Qrono instance.
     */
    weekOfYear(): number

    /**
     * Returns the year of the week of the Qrono instance.
     */
    yearOfWeek(): number

    /**
     * Returns whether the Qrono instance is in a leap year.
     */
    isLeapYear(): boolean

    /**
     * Returns whether the Qrono instance has daylight saving time in the year.
     */
    hasDstInYear(): boolean

    /**
     * Returns whether the Qrono instance is in daylight saving time.
     */
    isInDst(): boolean

    /**
     * Returns whether the Qrono instance is on a daylight saving time transition day.
     */
    isDstTransitionDay(): boolean

    /**
     * Returns the number of minutes in the day of the Qrono instance.
     */
    minutesInDay(): number

    /**
     * Returns the number of days in the month of the Qrono instance.
     */
    daysInMonth(): number

    /**
     * Returns the number of days in the year of the Qrono instance.
     */
    daysInYear(): number

    /**
     * Returns the number of weeks in the year of the Qrono instance.
     */
    weeksInYear(): number

    /**
     * Returns a new Qrono instance representing the start of the year.
     */
    startOfYear(): Qrono

    /**
     * Returns a new Qrono instance representing the start of the month.
     */
    startOfMonth(): Qrono

    /**
     * Returns a new Qrono instance representing the start of the day.
     */
    startOfDay(): Qrono

    /**
     * Returns a new Qrono instance representing the start of the hour.
     */
    startOfHour(): Qrono

    /**
     * Returns a new Qrono instance representing the start of the minute.
     */
    startOfMinute(): Qrono

    /**
     * Returns a new Qrono instance representing the start of the second.
     */
    startOfSecond(): Qrono

    /**
     * Returns whether the Qrono instance is the same as another.
     * @param another - The other instance to compare.
     * @returns True if the instances are the same, false otherwise.
     */
    isSame(another: Comparable): boolean

    /**
     * Returns whether the Qrono instance is before another.
     * @param another - The other instance to compare.
     * @returns True if the instance is before the other, false otherwise.
     */
    isBefore(another: Comparable): boolean

    /**
     * Returns whether the Qrono instance is after another.
     * @param another - The other instance to compare.
     * @returns True if the instance is after the other, false otherwise.
     */
    isAfter(another: Comparable): boolean

    /**
     * Returns whether the Qrono instance is the same or before another.
     * @param another - The other instance to compare.
     * @returns True if the instance is the same or before the other, false otherwise.
     */
    isSameOrBefore(another: Comparable): boolean

    /**
     * Returns whether the Qrono instance is the same or after another.
     * @param another - The other instance to compare.
     * @returns True if the instance is the same or after the other, false otherwise.
     */
    isSameOrAfter(another: Comparable): boolean

    /**
     * Returns whether the Qrono instance is between two other instances.
     * @param a - The first instance to compare.
     * @param b - The second instance to compare.
     * @returns True if the instance is between the two others, false otherwise.
     */
    isBetween(a: Comparable, b: Comparable): boolean

    /**
     * Adds a duration to the Qrono instance.
     * @param args - The duration to add.
     * @returns A new Qrono instance with the added duration.
     * @example
     * qrono().plus(3600 * 1000)
     */
    plus(...args: TimeTuple): Qrono

    /**
     * Adds a duration to the Qrono instance.
     * @param value - A millisecond offset to add.
     * @returns A new Qrono instance with the added duration.
     */
    plus(value: number): Qrono

    /**
     * Adds a duration to the Qrono instance.
     * @param value - An object of time fields to add.
     * @returns A new Qrono instance with the added duration.
     */
    plus(value: TimeFields): Qrono

    /**
     * Adds a duration to the Qrono instance.
     * @param value - An array of time fields to add.
     * @returns A new Qrono instance with the added duration.
     */
    plus(value: TimeTuple): Qrono

    /**
     * Subtracts a duration from the Qrono instance.
     * @param args - The duration to subtract.
     * @returns A new Qrono instance with the subtracted duration.
     */
    minus(...args: TimeTuple): Qrono

    /**
     * Subtracts a duration from the Qrono instance.
     * @param value - A millisecond offset to subtract.
     * @returns A new Qrono instance with the subtracted duration.
     */
    minus(value: number): Qrono

    /**
     * Subtracts a duration from the Qrono instance.
     * @param value - An object of time fields to subtract.
     * @returns A new Qrono instance with the subtracted duration.
     */
    minus(value: TimeFields): Qrono

    /**
     * Subtracts a duration from the Qrono instance.
     * @param value - An array of time fields to subtract.
     * @returns A new Qrono instance with the subtracted duration.
     */
    minus(value: TimeTuple): Qrono
  }

  export class QronoDate {
    /**
     * Returns the string representation of the QronoDate instance.
     */
    toString(): string

    /**
     * Returns the numeric value of the QronoDate instance.
     */
    valueOf(): number

    /**
     * Returns whether the QronoDate instance is valid.
     */
    valid(): boolean

    /**
     * Returns the object representation of the QronoDate instance.
     */
    toObject(): {
      year: number
      month: number
      day: number
    }

    /**
     * Returns the array representation of the QronoDate instance.
     */
    toArray(): number[]

    /**
     * Returns the Qrono instance of the QronoDate instance.
     */
    toDatetime(): Qrono

    /**
     * Returns the year of the QronoDate instance.
     */
    year(): number

    /**
     * Sets the year of the QronoDate instance.
     * @param value - The year to set.
     * @returns The QronoDate instance.
     */
    year(value: number): QronoDate

    /**
     * Returns the month of the QronoDate instance.
     */
    month(): number

    /**
     * Sets the month of the QronoDate instance.
     * @param value - The month to set.
     * @returns The QronoDate instance.
     */
    month(value: number): QronoDate

    /**
     * Returns the day of the QronoDate instance.
     */
    day(): number

    /**
     * Sets the day of the QronoDate instance.
     * @param value - The day to set.
     * @returns The QronoDate instance.
     */
    day(value: number): QronoDate

    /**
     * Returns the day of the week of the QronoDate instance.
     */
    dayOfWeek(): number

    /**
     * Returns the day of the year of the QronoDate instance.
     */
    dayOfYear(): number

    /**
     * Returns the week of the year of the QronoDate instance.
     */
    weekOfYear(): number

    /**
     * Returns the year of the week of the QronoDate instance.
     */
    yearOfWeek(): number

    /**
     * Returns whether the QronoDate instance is in a leap year.
     */
    isLeapYear(): boolean

    /**
     * Returns whether the QronoDate instance has daylight saving time in the year.
     */
    hasDstInYear(): boolean

    /**
     * Returns whether the QronoDate instance is on a daylight saving time transition day.
     */
    isDstTransitionDay(): boolean

    /**
     * Returns the number of minutes in the day of the QronoDate instance.
     */
    minutesInDay(): number

    /**
     * Returns the number of days in the month of the QronoDate instance.
     */
    daysInMonth(): number

    /**
     * Returns the number of days in the year of the QronoDate instance.
     */
    daysInYear(): number

    /**
     * Returns the number of weeks in the year of the QronoDate instance.
     */
    weeksInYear(): number

    /**
     * Returns a new QronoDate instance representing the start of the year.
     */
    startOfYear(): QronoDate

    /**
     * Returns a new QronoDate instance representing the start of the month.
     */
    startOfMonth(): QronoDate

    /**
     * Returns a new QronoDate instance representing the end of the year.
     */
    endOfYear(): QronoDate

    /**
     * Returns a new QronoDate instance representing the end of the month.
     */
    endOfMonth(): QronoDate

    /**
     * Returns whether the QronoDate instance is the same as another.
     * @param another - The other instance to compare.
     * @returns True if the instances are the same, false otherwise.
     */
    isSame(another: Comparable): boolean

    /**
     * Returns whether the QronoDate instance is before another.
     * @param another - The other instance to compare.
     * @returns True if the instance is before the other, false otherwise.
     */
    isBefore(another: Comparable): boolean

    /**
     * Returns whether the QronoDate instance is after another.
     * @param another - The other instance to compare.
     * @returns True if the instance is after the other, false otherwise.
     */
    isAfter(another: Comparable): boolean

    /**
     * Returns whether the QronoDate instance is the same or before another.
     * @param another - The other instance to compare.
     * @returns True if the instance is the same or before the other, false otherwise.
     */
    isSameOrBefore(another: Comparable): boolean

    /**
     * Returns whether the QronoDate instance is the same or after another.
     * @param another - The other instance to compare.
     * @returns True if the instance is the same or after the other, false otherwise.
     */
    isSameOrAfter(another: Comparable): boolean

    /**
     * Returns whether the QronoDate instance is between two other instances.
     * @param a - The first instance to compare.
     * @param b - The second instance to compare.
     * @returns True if the instance is between the two others, false otherwise.
     */
    isBetween(a: Comparable, b: Comparable): boolean

    /**
     * Adds a duration to the QronoDate instance.
     * @param args - The duration to add.
     * @returns A new QronoDate instance with the added duration.
     */
    plus(...args: DateTuple): QronoDate

    /**
     * Adds a duration to the QronoDate instance.
     * @param value - A day count to add.
     * @returns A new QronoDate instance with the added duration.
     */
    plus(value: number): QronoDate

    /**
     * Adds a duration to the QronoDate instance.
     * @param value - An object of date fields to add.
     * @returns A new QronoDate instance with the added duration.
     */
    plus(value: DateFields): QronoDate

    /**
     * Adds a duration to the QronoDate instance.
     * @param value - An array of date fields to add.
     * @returns A new QronoDate instance with the added duration.
     */
    plus(value: DateTuple): QronoDate

    /**
     * Subtracts a duration from the QronoDate instance.
     * @param args - The duration to subtract.
     * @returns A new QronoDate instance with the subtracted duration.
     */
    minus(...args: DateTuple): QronoDate

    /**
     * Subtracts a duration from the QronoDate instance.
     * @param value - A day count to subtract.
     * @returns A new QronoDate instance with the subtracted duration.
     */
    minus(value: number): QronoDate

    /**
     * Subtracts a duration from the QronoDate instance.
     * @param value - An object of date fields to subtract.
     * @returns A new QronoDate instance with the subtracted duration.
     */
    minus(value: DateFields): QronoDate

    /**
     * Subtracts a duration from the QronoDate instance.
     * @param value - An array of date fields to subtract.
     * @returns A new QronoDate instance with the subtracted duration.
     */
    minus(value: DateTuple): QronoDate
  }
}
