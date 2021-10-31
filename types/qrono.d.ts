export = qrono

declare function qrono (
  date?: Date | number | string | qrono.Qrono | number[] | qrono.TimeFields
): qrono.Qrono

declare function qrono (
  year?: number,
  month?: number,
  day?: number,
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number
): qrono.Qrono

declare function qrono (
  context?: qrono.Context,
  date?: Date | number | string | qrono.Qrono | number[] | qrono.TimeFields
): qrono.Qrono

declare function qrono (
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
  export const monday: number
  export const tuesday: number
  export const wednesday: number
  export const thursday: number
  export const friday: number
  export const saturday: number
  export const sunday: number

  export function date (
    date?: Date | number | string | qrono.Qrono | number[] | qrono.TimeFields
  ): QronoDate
  export function date (
    year?: number,
    month?: number,
    day?: number
  ): QronoDate
  export function context (): Context
  export function context (context: Context): typeof qrono
  export function localtime (): boolean
  export function localtime (value: boolean): typeof qrono
  export function ambiguousAsDst (): boolean
  export function ambiguousAsDst (value: boolean): typeof qrono
  export function asUtc (): typeof qrono
  export function asLocaltime (): typeof qrono

  export type Context = {
    localtime?: boolean
    ambiguousAsDst?: boolean
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

  type Comparable = Qrono | number | Date

  export class Qrono {
    toString (): string
    valueOf (): number
    context (): Context
    context (context: Context): Qrono
    nativeDate (): Date
    offset (): number
    localtime (): boolean
    localtime (yes: boolean): Qrono
    ambiguousAsDst (): boolean
    ambiguousAsDst (yes: boolean): Qrono
    valid (): boolean
    numeric (): number
    toObject (): {
      year: number
      month: number
      day: number
      hour: number
      minute: number
      second: number
      millisecond: number
    }
    toArray (): number[]
    toDate (): QronoDate
    asUtc (): Qrono
    asLocaltime (): Qrono
    year (): number
    year (value: number): Qrono
    month (): number
    month (value: number): Qrono
    day (): number
    day (value: number): Qrono
    hour (): number
    hour (value: number): Qrono
    minute (): number
    minute (value: number): Qrono
    second (): number
    second (value: number): Qrono
    millisecond (): number
    millisecond (value: number): Qrono
    dayOfWeek (): number
    dayOfYear (): number
    weekOfYear (): number
    yearOfWeek (): number
    isLeapYear (): boolean
    hasDstInYear (): boolean
    isInDst (): boolean
    isDstTransitionDay (): boolean
    minutesInDay (): number
    daysInMonth (): number
    daysInYear (): number
    weeksInYear (): number
    startOfYear (): Qrono
    startOfMonth (): Qrono
    startOfDay (): Qrono
    startOfHour (): Qrono
    startOfMinute (): Qrono
    startOfSecond (): Qrono
    isSame (another: Comparable): boolean
    isBefore (another: Comparable): boolean
    isAfter (another: Comparable): boolean
    isSameOrBefore (another: Comparable): boolean
    isSameOrAfter (another: Comparable): boolean
    isBetween (a: Comparable, b: Comparable): boolean
    plus (...args: number[]): Qrono
    plus (value: TimeFields | number[]): Qrono
    minus (...args: number[]): Qrono
    minus (value: TimeFields | number[]): Qrono
  }

  export class QronoDate {
    toString (): string
    valueOf (): number
    valid (): boolean
    numeric (): number
    toObject (): {
      year: number
      month: number
      day: number
      hour: number
      minute: number
      second: number
      millisecond: number
    }
    toArray (): number[]
    toDatetime (): Qrono
    year (): number
    year (value: number): QronoDate
    month (): number
    month (value: number): QronoDate
    day (): number
    day (value: number): QronoDate
    dayOfWeek (): number
    dayOfYear (): number
    weekOfYear (): number
    yearOfWeek (): number
    isLeapYear (): boolean
    hasDstInYear (): boolean
    isInDst (): boolean
    isDstTransitionDay (): boolean
    minutesInDay (): number
    daysInMonth (): number
    daysInYear (): number
    weeksInYear (): number
    startOfYear (): QronoDate
    startOfMonth (): QronoDate
    startOfDay (): QronoDate
    endOfYear (): QronoDate
    endOfMonth (): QronoDate
    isSame (another: Comparable): boolean
    isBefore (another: Comparable): boolean
    isAfter (another: Comparable): boolean
    isSameOrBefore (another: Comparable): boolean
    isSameOrAfter (another: Comparable): boolean
    isBetween (a: Comparable, b: Comparable): boolean
    plus (...args: number[]): QronoDate
    plus (value: TimeFields | number[]): QronoDate
    minus (...args: number[]): QronoDate
    minus (value: TimeFields | number[]): QronoDate
  }
}
