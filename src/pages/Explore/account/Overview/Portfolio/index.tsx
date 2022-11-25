import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { PresentedBalancePayload } from 'services/zapper'
import { useAppBalances, useTotalsWalletBalances } from 'services/zapper/hooks/useBalances'
import useGetNftUsersCollectionsTotals from 'services/zapper/hooks/useGetZapperNftUsersCollectionsTotals'
import styled from 'styled-components'

import { AutoColumn } from 'components/Column'
import Pagination from 'components/Pagination'
import useTheme from 'hooks/useTheme'
import { formatDollarAmount } from 'utils/numbers'

import { OverflowPagination, SideTitle, SideWrapper } from '../../styleds'

function getColor(index: number) {
  const colors = ['rgb(120, 79, 254)', 'rgb(57, 255, 185)', '#FF5C00', 'rgb(255, 190, 11)']
  return colors[index]
}

export default function Portfolio({ data }: { data: PresentedBalancePayload[] }) {
  const { address } = useParams<{ address: string }>()

  const { total: wallet } = useTotalsWalletBalances(data, 'all-networks')
  const { nftUsersCollectionsTotals } = useGetNftUsersCollectionsTotals(address, undefined)
  const apps = useAppBalances(data, 'all-networks')

  const [page, setPage] = React.useState(1)
  useEffect(() => {
    setPage(1)
  }, [address])

  const portfolioList = useMemo(() => {
    const nftTotals = Number(nftUsersCollectionsTotals?.nftUsersCollections.totals.balanceUSD || 0)
    const appBalances = Object.values(apps).reduce(
      (acc, cur) => (acc < 0 ? 0 : acc) + (cur.totals < 0 ? 0 : cur.totals),
      0,
    )
    const totals = wallet + nftTotals + appBalances
    const walletPercent = (wallet / totals) * 100
    const nftPercent = (nftTotals / totals) * 100
    const res = [
      {
        title: 'Wallet',
        value: wallet,
        percent: isNaN(walletPercent) ? 0 : walletPercent,
      },
      {
        title: 'NFTs',
        value: nftTotals || 0,
        percent: isNaN(nftPercent) ? 0 : nftPercent,
      },
      ...Object.entries(apps).map(([key, value], index) => {
        return {
          title: key,
          value: value.totals,
          percent: value.totals < 0 ? 0 : (value.totals / totals) * 100,
        }
      }),
    ]
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        ...item,
        key: index,
      }))
    // .filter(item => item.percent > 0.001)
    return {
      size: res.length,
      list: res.slice((page - 1) * 6, page * 6),
    }
  }, [apps, wallet, nftUsersCollectionsTotals, page])
  const theme = useTheme()
  return (
    <SideWrapper>
      <AutoColumn gap="8px">
        <SideTitle>Portfolio Breakdown</SideTitle>
        <AutoColumn gap="16px">
          {portfolioList.list.map((item, index) => {
            const { title, percent, value, key } = item
            return (
              <Flex style={{ gap: 12 }} key={index} justifyContent="space-between" alignItems="center" flexBasis={''}>
                <Text
                  style={{
                    width: 120,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {title}
                </Text>
                <WrapperBar>
                  <Bar
                    percent={percent > 10 ? Number(percent.toFixed(2)) : 10}
                    color={getColor(key) ? getColor(key) : 'rgb(54, 75, 88)'}
                  />
                </WrapperBar>

                <Flex flexDirection="column" style={{ gap: 4, width: 120 }} alignItems="flex-end">
                  <Text color={theme.subText} fontSize={14}>
                    {formatDollarAmount(value)}
                  </Text>
                  <Text color={theme.primary} fontSize={12}>
                    {' '}
                    ( {percent.toFixed(2) === '0.00' ? '<0.01' : percent.toFixed(2)}% )
                  </Text>
                </Flex>
              </Flex>
            )
          })}
          <OverflowPagination>
            <Pagination
              pageSize={6}
              onPageChange={newPage => setPage(newPage)}
              currentPage={page}
              totalCount={portfolioList.size || 1}
              style={{
                backgroundColor: 'transparent',
                paddingLeft: 0,
                paddingRight: 0,
              }}
              forceMobileMode={true}
            />
          </OverflowPagination>
        </AutoColumn>
      </AutoColumn>
    </SideWrapper>
  )
}

const Bar = styled.div<{ percent: number; color: string }>`
  height: 16px;
  width: ${({ percent }) => percent}%;
  background-color: ${({ color }) => color};
  border-radius: 8px;
`
const WrapperBar = styled.div`
  height: 16px;
  width: 100%;
  background-color: #28353d;
  border-radius: 8px;
`
