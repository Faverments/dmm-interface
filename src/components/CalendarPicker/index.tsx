import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import useTheme from 'hooks/useTheme'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Circle, Square } from 'react-feather'
import { Flex, Text } from 'rebass'
import { PredictedDate } from 'constants/discoverPro'
import { ButtonPrimary } from 'components/Button'

dayjs.extend(localeData)
function range(end: number) {
  return [...Array(end).keys()]
}

interface PredictedDay {
  date: dayjs.Dayjs
  mediumDate: number
  firstDate: number
  index: number
}

const StyledDot = styled.i<{ out?: boolean }>`
  display: inline-block;
  margin-top: 1px;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.secondary4};
`

export default function CalendarPicker({
  cancelPicker,
  isPicked,
  setIsPicked,
  listPredictedDate = [],
}: {
  cancelPicker: any
  isPicked: boolean
  setIsPicked: any
  listPredictedDate?: PredictedDate[]
}) {
  const todayObj = dayjs()
  const weekdaysShort = dayjs.weekdaysShort()
  const [dayObj, setDayObj] = useState(todayObj)
  const [activeDate, setActiveDate] = useState(dayjs(todayObj.format('YYYY-MM-DD')))
  const [predictedDate, setPredictedDate] = useState<PredictedDate[]>([])

  const thisYear = dayObj.year()
  const thisMonth = dayObj.month() // (January as 0, December as 11)
  const daysInMonth = dayObj.daysInMonth()

  const dayObjOf1 = dayjs(`${thisYear}-${thisMonth + 1}-1`)
  const weekDayOf1 = dayObjOf1.day() // (Sunday as 0, Saturday as 6)

  const dayObjOfLast = dayjs(`${thisYear}-${thisMonth + 1}-${daysInMonth}`)
  const weekDayOfLast = dayObjOfLast.day()

  const handlePrev = () => {
    const prevMonth = dayObj.subtract(1, 'month')
    const fistDate = prevMonth.date(1)
    setDayObj(prevMonth)
    setActiveDate(fistDate)
  }

  const handleNext = () => {
    const nextMonth = dayObj.add(1, 'month')
    const fistDate = nextMonth.date(1)
    setDayObj(nextMonth)
    setActiveDate(fistDate)
  }
  const today = () => {
    setDayObj(todayObj)
    setActiveDate(dayjs(todayObj.format('YYYY-MM-DD')))
  }
  const theme = useTheme()

  const handleClick = (date: dayjs.Dayjs, predictedDate: PredictedDate[]) => {
    // console.log(date.format())
    setActiveDate(date)
    setPredictedDate(predictedDate)
  }

  function dateDisplay(date: dayjs.Dayjs) {
    const isSelectedDate = date.isSame(activeDate, 'day')
    const predictedDay = listPredictedDate.filter(day => date.isSame(dayjs(day.firstDate * 1000), 'date')).reverse()
    // .map(day => ({ ...day, date: dayjs(day.firstDate * 1000) }))
    return {
      isSelectedDate,
      predictedDay,
    }
  }

  useEffect(() => {
    const { predictedDay } = dateDisplay(activeDate)
    setPredictedDate(predictedDay)
  }, [activeDate])

  return (
    <WapperCalendar>
      <Flex justifyContent="space-between" alignItems="center" style={{ paddingRight: 8, paddingLeft: 8 }}>
        <DateNavigateWarper>
          <NavigateDateButton onClick={handlePrev}>
            <ChevronLeft size={18} />
          </NavigateDateButton>
          <NavigateDateButton onClick={handleNext}>
            <ChevronRight size={18} />
          </NavigateDateButton>
          <NavigateDateButton onClick={today}>
            <Circle size={18} />
          </NavigateDateButton>
        </DateNavigateWarper>
        <Text fontSize={18} color={theme.text}>
          {dayObj.format('MMMM YYYY')}
        </Text>
      </Flex>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
        }}
      >
        {weekdaysShort.map((day, index) => (
          <ItemDefalutStyle
            key={index}
            style={{
              margin: '2px 8px',
              color: theme.text7,
            }}
          >
            {day}
          </ItemDefalutStyle>
        ))}

        {range(weekDayOf1).map(i => {
          const date = dayObjOf1.subtract(weekDayOf1 - i, 'day')
          const { isSelectedDate, predictedDay } = dateDisplay(date)

          return (
            <ItemDefalutStyle
              key={i}
              style={{
                color: isSelectedDate ? theme.text : theme.disableText,
                background: isSelectedDate ? theme.buttonBlack : '',
              }}
              onClick={() => {
                handleClick(date, predictedDay)
                handlePrev()
              }}
            >
              {date.date()}
              {predictedDay.length > 0 && <StyledDot />}
            </ItemDefalutStyle>
          )
        })}

        {range(daysInMonth).map(i => {
          const date = dayjs(`${thisYear}-${thisMonth + 1}-${i + 1}`)
          // console.log(date)
          const { isSelectedDate, predictedDay } = dateDisplay(date)
          return (
            <ItemDefalutStyle
              key={i}
              style={{
                color: isSelectedDate ? theme.text : undefined,
                background: isSelectedDate ? theme.buttonBlack : '',
              }}
              onClick={() => handleClick(date, predictedDay)}
            >
              {i + 1}
              {predictedDay.length > 0 && <StyledDot />}
            </ItemDefalutStyle>
          )
        })}

        {range(6 - weekDayOfLast).map(i => {
          const date = dayObjOfLast.add(i + 1, 'day')
          const { isSelectedDate, predictedDay } = dateDisplay(date)
          return (
            <ItemDefalutStyle
              key={i}
              style={{
                color: isSelectedDate ? theme.text : theme.disableText,
                background: isSelectedDate ? theme.buttonBlack : '',
              }}
              onClick={() => {
                handleClick(date, predictedDay)
                handleNext()
              }}
            >
              {date.date()}
              {predictedDay.length > 0 && <StyledDot />}
            </ItemDefalutStyle>
          )
        })}
      </div>
      {activeDate && predictedDate.length > 0 && (
        <Flex flexWrap="wrap" justifyContent="space-between" style={{ gap: 8, paddingRight: 8, paddingLeft: 8 }}>
          {predictedDate.map((day, i) => {
            const date = dayjs(day.firstDate * 1000).format('h:m A - MMM D')
            return (
              <div key={i}>
                <ButtonPrimary
                  onClick={() => {
                    setIsPicked(activeDate, predictedDate, day)
                  }}
                >
                  {date}
                </ButtonPrimary>
              </div>
            )
          })}
        </Flex>
      )}
    </WapperCalendar>
  )
}

const WapperCalendar = styled.div`
  /* background-color: ${({ theme }) => theme.bg10}; */
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap : 16px;
`

const ItemDefalutStyle = styled.div`
  text-align: center;
  border-radius: 25%;
  padding: 5px 1px;
  margin: 1px;
  width: 35px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NavigateDateButton = styled.div<{ disabled?: boolean }>`
  padding: 8px 12px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.subText};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled
      ? css`
          background-color: ${({ theme }) => theme.buttonGray};
          color: ${({ theme }) => theme.disableText};
          cursor: not-allowed;
          pointer-events: none;
        `
      : css`
          &:hover {
            background-color: ${({ theme }) => darken(0.1, theme.buttonBlack)};
            color: ${({ theme }) => darken(0.1, theme.text)};
          }
          &:active {
            transform: scale(0.9);
          }
        `};
`

const DateNavigateWarper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`
