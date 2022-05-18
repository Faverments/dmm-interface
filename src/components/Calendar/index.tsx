import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
dayjs.extend(localeData)
function range(end: number) {
  return [...Array(end).keys()]
}
export default function Calendar({
  cancelPicker,
  isPicked,
  setIspicked,
  data,
}: {
  cancelPicker: any
  isPicked: boolean
  setIspicked: any
  data: any
}) {
  console.log(data)
  const todayObj = dayjs()
  const weekdaysShort = dayjs.weekdaysShort()
  const [dayObj, setDayObj] = useState(todayObj)
  const [activeDate, setActiveDate] = useState(dayjs(todayObj.format('YYYY-MM-DD')))

  const thisYear = dayObj.year()
  const thisMonth = dayObj.month() // (January as 0, December as 11)
  const daysInMonth = dayObj.daysInMonth()

  const dayObjOf1 = dayjs(`${thisYear}-${thisMonth + 1}-1`)
  const weekDayOf1 = dayObjOf1.day() // (Sunday as 0, Saturday as 6)

  const dayObjOfLast = dayjs(`${thisYear}-${thisMonth + 1}-${daysInMonth}`)
  const weekDayOfLast = dayObjOfLast.day()

  const handlePrev = () => {
    setDayObj(dayObj.subtract(1, 'month'))
  }

  const handleNext = () => {
    setDayObj(dayObj.add(1, 'month'))
  }
  const today = () => {
    setDayObj(todayObj)
    setActiveDate(dayjs(todayObj.format('YYYY-MM-DD')))
  }
  const theme = useTheme()

  const handleClick = (day: any) => {
    console.log(day.format())
    setActiveDate(day)

    setIspicked(true)
  }
  useEffect(() => {
    console.log(activeDate.format())
  }, [activeDate])

  return (
    <WapperCalendar>
      <h1>Calendar</h1>
      <button type="button" onClick={handlePrev}>
        &lt;
      </button>
      <button type="button" onClick={handleNext}>
        &gt;
      </button>
      <button type="button" onClick={today}>
        Today
      </button>
      <p>{dayObj.format('MMMM YYYY')}</p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          width: '500px',
        }}
      >
        {weekdaysShort.map((day, index) => (
          <div
            key={index}
            style={{
              width: 'calc(500px / 7)',
            }}
          >
            {day}
          </div>
        ))}

        {range(weekDayOf1).map(i => (
          <div
            key={i}
            style={{
              width: 'calc(500px / 7)',
              color: theme.disableText,
              background: dayObjOf1.subtract(weekDayOf1 - i, 'day').isSame(activeDate) ? theme.primary : '',
            }}
            onClick={() => handleClick(dayObjOf1.subtract(weekDayOf1 - i, 'day'))}
          >
            {dayObjOf1.subtract(weekDayOf1 - i, 'day').date()}
          </div>
        ))}

        {range(daysInMonth).map(i => (
          <div
            key={i}
            style={{
              width: 'calc(500px / 7)',
              background: dayjs(`${thisYear}-${thisMonth + 1}-${i + 1}`).isSame(activeDate) ? theme.primary : '',
            }}
            onClick={() => handleClick(dayjs(`${thisYear}-${thisMonth + 1}-${i + 1}`))}
          >
            {i + 1}
          </div>
        ))}

        {range(6 - weekDayOfLast).map(i => (
          <div
            key={i}
            style={{
              width: 'calc(500px / 7)',
              color: theme.disableText,
              background: dayObjOfLast.add(i + 1, 'day').isSame(activeDate) ? theme.primary : '',
            }}
            onClick={() => handleClick(dayObjOfLast.add(i + 1, 'day'))}
          >
            {dayObjOfLast.add(i + 1, 'day').date()}
          </div>
        ))}
      </div>
    </WapperCalendar>
  )
}

const WapperCalendar = styled.div`
  background-color: ${({ theme }) => theme.bg10};
  width: 300px;
`
