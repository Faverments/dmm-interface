import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import formatISO from 'date-fns/formatISO'
import getDay from 'date-fns/getDay'
import getMonth from 'date-fns/getMonth'
import nextDay from 'date-fns/nextDay'
import parseISO from 'date-fns/parseISO'
import subWeeks from 'date-fns/subWeeks'
import { Day as WeekDay } from 'date-fns'

import { Day, Weeks, Theme } from './types'

export const NAMESPACE = 'react-activity-calendar'
export const MIN_DISTANCE_MONTH_LABELS = 2

export const DEFAULT_MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const DEFAULT_WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const DEFAULT_LABELS = {
  months: DEFAULT_MONTH_LABELS,
  weekdays: DEFAULT_WEEKDAY_LABELS,
  totalCount: '{{count}} Snapshots in {{year}}',
  // tooltip: '<strong>{{count}} Snapshot </strong> on {{date}}',
  tooltip: '{{count}} Snapshot on {{date}}',

  legend: {
    less: 'Less',
    more: 'More',
  },
}

interface Label {
  x: number
  y: number
  text: string
}

function normalizeCalendarDays(days: Array<Day>): Array<Day> {
  const daysMap = days.reduce((map, day) => {
    map.set(day.date, day)
    return map
  }, new Map<string, Day>())

  return eachDayOfInterval({
    start: parseISO(days[0].date),
    end: parseISO(days[days.length - 1].date),
  }).map(day => {
    const date = formatISO(day, { representation: 'date' })

    if (daysMap.has(date)) {
      return daysMap.get(date) as Day
    }

    return {
      date,
      count: 0,
      level: 0,
    }
  })
}

export function groupByWeeks(
  days: Array<Day>,
  weekStart: WeekDay = 0, // 0 = Sunday
): Weeks {
  if (days.length === 0) {
    return []
  }

  // The calendar expects a continuous sequence of days, so fill gaps with empty
  // activity data.
  const normalizedDays = normalizeCalendarDays(days)

  // Determine the first date of the calendar. If the first contribution date is
  // not the specified weekday, the desired day one week earlier is selected.
  const firstDate = parseISO(normalizedDays[0].date)
  const firstCalendarDate = getDay(firstDate) === weekStart ? firstDate : subWeeks(nextDay(firstDate, weekStart), 1)

  // To correctly group contributions by week, it is necessary to left pad the
  // list because the first date might not be desired weekday.
  const paddedDays = [
    ...Array(differenceInCalendarDays(firstDate, firstCalendarDate)).fill(undefined),
    ...normalizedDays,
  ]

  return Array(Math.ceil(paddedDays.length / 7))
    .fill(undefined)
    .map((_, calendarWeek) => paddedDays.slice(calendarWeek * 7, calendarWeek * 7 + 7))
}

export function getMonthLabels(weeks: Weeks, monthNames: Array<string> = DEFAULT_MONTH_LABELS): Array<Label> {
  return weeks
    .reduce<Array<Label>>((labels, week, index) => {
      const firstWeekDay = week.find(day => day !== undefined)

      if (!firstWeekDay) {
        throw new Error(`Unexpected error: Week is empty: [${week}]`)
      }

      const month = monthNames[getMonth(parseISO(firstWeekDay.date))]
      const prev = labels[labels.length - 1]

      if (index === 0 || prev.text !== month) {
        return [
          ...labels,
          {
            x: index,
            y: 0,
            text: month,
          },
        ]
      }

      return labels
    }, [])
    .filter((label, index, labels) => {
      if (index === 0) {
        return labels[1] && labels[1].x - label.x > MIN_DISTANCE_MONTH_LABELS
      }

      return true
    })
}

export function getClassName(name: string, styles?: string): string {
  if (styles) {
    return `${NAMESPACE}__${name} ${styles}`
  }

  return `${NAMESPACE}__${name}`
}

export function generateEmptyData(): Array<Day> {
  const year = new Date().getFullYear()
  const days = eachDayOfInterval({
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31),
  })

  return days.map(date => ({
    date: formatISO(date, { representation: 'date' }),
    count: 0,
    level: 0,
  }))
}
