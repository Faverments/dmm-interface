import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { t, Trans } from '@lingui/macro'
import { Box, Flex, Text } from 'rebass'
import { DiscoverProFilter } from '../TrueSight'
import lottie from 'lottie-web'
import RainBowCat from './rocket-loader.json'
import useGetListTrueSightFilterData from '../hooks/useGetListTrueSightFilterData'
import { TrueSightFilterTokenData } from '../hooks/useGetTrueSightFilterData'
import CompareTrendingSoonTokenItem from './CompareTrendingSoonTokenItem'
import useTheme from 'hooks/useTheme'
import LocalLoader from 'components/LocalLoader'
import Pagination from 'components/Pagination'
import { COMPARE_ITEM_PER_PAGE, COMPARE_MAX_ITEMS, PredictedDate } from 'constants/discoverPro'
import DateSelect from './DateSelect'
// import { FixedSizeList } from 'react-window'

const Container = styled.div``
const Wapper = styled.div`
  /* display: flex;
  justify-content: space-between; */
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
`

const ListTokenWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  /* background-color: ${({ theme }) => theme.bg10}; */
  /* border-radius: 8px; */
  padding: 4px 6px;
`

const ListTokenWithPickerDay = ({
  filter,
  tokenData,
}: {
  filter: DiscoverProFilter
  tokenData: TrueSightFilterTokenData[]
}) => {
  const [selectedToken, setSelectedToken] = useState<TrueSightFilterTokenData>()
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useState(1)
  const maxPage = Math.min(
    Math.ceil((tokenData.length ?? 1) / COMPARE_ITEM_PER_PAGE),
    COMPARE_MAX_ITEMS / COMPARE_ITEM_PER_PAGE,
  )
  const paginatedTokenData = tokenData.slice(
    (currentPage - 1) * COMPARE_ITEM_PER_PAGE,
    currentPage * COMPARE_ITEM_PER_PAGE,
  )
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const setActivePredictedDate = (predictedDate: PredictedDate) => {
    // setFilter(prev => ({ ...prev, selectedPredictedDate: predictedDate }))
  }
  return (
    <div>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: theme.oddRow,
          borderRadius: 8,
          marginBottom: 6,
          padding: 18,
        }}
      >
        <DateSelect activeTimeFrame={filter.timeframe} setActivePredictedDate={setActivePredictedDate} />
      </Box>
      <div>
        <div
          style={{
            minHeight: '388px',
            backgroundColor: theme.oddRow,
            // borderRadius: '8px',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <ListTokenWrapper>
            {paginatedTokenData.map((token, index) => (
              <CompareTrendingSoonTokenItem
                key={index}
                tokenData={token}
                top={token.rank || index}
                setSelectedToken={setSelectedToken}
              />
            ))}
          </ListTokenWrapper>
        </div>
        <Pagination
          onPrev={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          onNext={() => setCurrentPage(prev => Math.min(maxPage, prev + 1))}
          currentPage={currentPage}
          maxPage={maxPage}
          // style={{ padding: '20px', marginTop: '6px', borderRadius: '8px' }}
          style={{ padding: '20px', borderTop: `1px solid ${theme.border}` }}
        />
      </div>
    </div>
  )
}
export default function CompareTrendingSoonLayout({ filter }: { filter: DiscoverProFilter }) {
  const { isLoading, data, error } = useGetListTrueSightFilterData(filter.timeframe, [1647569885, 1647425470])

  useEffect(() => {
    lottie.loadAnimation({
      container: document.getElementById('energy-rocket') as HTMLElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: RainBowCat,
    })
  }, [isLoading])

  const firstTokensData = data ? (data[0] ? data[0].data.tokens : []) : []
  const secondTokensData = data ? (data[1] ? data[1].data.tokens : []) : []

  return (
    <Container>
      {isLoading ? (
        <LocalLoader />
      ) : (
        <Wapper>
          <ListTokenWithPickerDay filter={filter} tokenData={firstTokensData} />
          <div
            id="energy-rocket"
            style={{
              width: 220,
              transform: 'rotate(30deg)',
              marginLeft: 40,
            }}
          />
          <ListTokenWithPickerDay filter={filter} tokenData={secondTokensData} />
        </Wapper>
      )}
    </Container>
  )
}
