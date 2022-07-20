import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { t, Trans } from '@lingui/macro'
import { Box, Flex, Text } from 'rebass'
import { DiscoverProFilter } from '../../TrueSight'
import lottie from 'lottie-web'
import RainBowCat from '../rocket-loader.json'
import useGetListTrueSightFilterData from '../../hooks/useGetListTrueSightFilterData'
import { TrueSightFilterTokenData } from '../../hooks/useGetTrueSightFilterData'
import CompareTrendingSoonTokenItem from './CompareTrendingSoonTokenItem'
import useTheme from 'hooks/useTheme'
import LocalLoader from 'components/LocalLoader'
import Pagination from 'components/Pagination/index'
import { COMPARE_MAX_ITEMS, PredictedDate } from 'constants/discoverPro'
import DateSelect from '../DateSelect'
import { useMedia } from 'react-use'
// import { FixedSizeList } from 'react-window'

const Container = styled.div``
const Wapper = styled.div`
  /* display: flex;
  justify-content: space-between; */
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  /* padding: 20px;
  background-color: ${({ theme }) => theme.bg16};
  border: 8px; */
  padding-top: 10px;
  @media screen and (max-width: 1020px) {
    grid-template-columns: 2fr 1.5fr 2fr ;
  }
`

const ListTokenWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  /* background-color: ${({ theme }) => theme.bg10}; */
  /* border-radius: 8px; */
  padding: 4px 6px;
  @media screen and (max-width: 1280px) {
    grid-template-columns: 1fr 1fr 1fr ;
  }
  @media screen and (max-width: 1020px) {
    grid-template-columns: 1fr 1fr ;
  }
  // layout mobile
  /* @media screen and (max-width: 650px) {
    grid-template-columns: 1fr ;
  } */
`

const ListTokenContainer = styled.div`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  width: fit-content;
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

  const above1020 = useMedia('(min-width: 1020px)')
  const above1280 = useMedia('(min-width: 1280px)')
  const COMPARE_ITEM_PER_PAGE = above1280 ? 20 : above1020 ? 15 : 10
  const paginatedTokenData = useMemo(() => {
    return tokenData.slice((currentPage - 1) * COMPARE_ITEM_PER_PAGE, currentPage * COMPARE_ITEM_PER_PAGE)
  }, [currentPage, tokenData, COMPARE_ITEM_PER_PAGE])
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, above1020, above1280])

  const setActivePredictedDate = (predictedDate: PredictedDate) => {
    // setFilter(prev => ({ ...prev, selectedPredictedDate: predictedDate }))
  }
  return (
    <ListTokenContainer>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: theme.tableHeader,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          padding: 20,
        }}
      >
        <DateSelect activeTimeFrame={filter.timeframe} setActivePredictedDate={setActivePredictedDate} />
      </Box>
      <div
        style={{
          minHeight: 390,
          borderTop: `1px solid ${theme.border}`,
          borderBottom: `1px solid ${theme.border}`,
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
        pageSize={COMPARE_ITEM_PER_PAGE}
        onPageChange={newPage => setCurrentPage(newPage)}
        currentPage={currentPage}
        totalCount={tokenData.length ?? 1}
      />
    </ListTokenContainer>
  )
}

const RocketCompare = styled.div`
  width: 280;
  transform: rotate(360deg);
  margin-left: 5;
  /* @media screen and (max-width: 768px) {
    display: none;
  } */
`

export default function CompareTrendingSoonLayout({ filter }: { filter: DiscoverProFilter }) {
  const { isLoading, data, error } = useGetListTrueSightFilterData(filter.timeframe, [1647569885, 1647425470])

  const above800 = useMedia('(min-width: 800px)')
  useEffect(() => {
    lottie.loadAnimation({
      container: document.getElementById('energy-rocket') as HTMLElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: RainBowCat,
    })
  }, [isLoading, above800])

  const firstTokensData = data ? (data[0] ? data[0].data.tokens : []) : []
  const secondTokensData = data ? (data[1] ? data[1].data.tokens : []) : []

  return (
    <Container>
      {isLoading ? (
        <LocalLoader />
      ) : (
        <Wapper>
          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          > */}
          <ListTokenWithPickerDay filter={filter} tokenData={firstTokensData} />
          {/* </div> */}
          {above800 ? <RocketCompare id="energy-rocket" /> : <div />}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <ListTokenWithPickerDay filter={filter} tokenData={secondTokensData} />
          </div>
        </Wapper>
      )}
    </Container>
  )
}
