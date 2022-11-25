import React, { useEffect, useMemo } from 'react'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import { chainsInfo } from 'services/zapper/constances'
import { useWalletBalances } from 'services/zapper/hooks/useBalances'
import { ALL_NETWORKS, PresentedBalancePayload, TokenBreakdown } from 'services/zapper/types/models'
import { Network } from 'services/zapper/types/models/index'

import { AutoColumn } from 'components/Column'
import WalletIcon from 'components/Icons/Wallet'
import Pagination from 'components/Pagination'
import useTheme from 'hooks/useTheme'
import { formattedNumLong } from 'utils'

import { LayoutWrapper, TableBodyItemWrapper, TableHeaderItem, TableWrapper } from '../styleds'

export default function Wallet({
  data,
  network,
  setNetwork,
}: {
  data: PresentedBalancePayload[]
  network: Network | ALL_NETWORKS
  setNetwork: React.Dispatch<React.SetStateAction<Network | ALL_NETWORKS>>
}) {
  const [page, setPage] = React.useState(1)
  useEffect(() => {
    setPage(1)
  }, [network])

  const wallet = useWalletBalances(data)

  const walletPaginate = useMemo(() => {
    if (network === 'all-networks') {
      return {
        size: 0,
        list: [],
      }
    }
    const res = [...Object.values<any>(wallet[network].details)].sort((a, b) => b.balance - a.balance)
    return {
      size: res.length,
      list: res.slice((page - 1) * 10, page * 10),
    }
  }, [wallet, network, page])

  const totalsWalletBalances = Object.values(wallet).reduce((acc, cur) => acc + cur.totals, 0)

  const AllToken = useMemo(() => {
    const allToken: TokenBreakdown[] = []
    Object.values(wallet).forEach(item => {
      const listTokenOnNetwork: TokenBreakdown[] = Object.values<any>(item.details)
      allToken.push(...listTokenOnNetwork)
    })

    return {
      size: allToken.length,
      list: allToken.sort((a, b) => b.balanceUSD - a.balanceUSD).slice((page - 1) * 10, page * 10),
    }
  }, [wallet, page])

  const theme = useTheme()

  function TableHeader() {
    return (
      <LayoutWrapper>
        <TableHeaderItem>Asset</TableHeaderItem>
        <TableHeaderItem>Price</TableHeaderItem>
        <TableHeaderItem>Balance</TableHeaderItem>
        <TableHeaderItem>Value</TableHeaderItem>
      </LayoutWrapper>
    )
  }

  const above768 = useMedia('(min-width: 768px)')

  function Token({ token, index }: { token: TokenBreakdown; index: number }) {
    const networkInfo = chainsInfo[token.network as keyof typeof chainsInfo]
    return (
      <LayoutWrapper>
        <TableBodyItemWrapper>
          <Flex alignItems="center" style={{ gap: 8 }}>
            <img
              src={token.displayProps.images[0]}
              width={40}
              height={40}
              style={{ borderRadius: '50%' }}
              alt={token.context.symbol}
            />
            <Flex flexDirection="column" style={{ gap: 4 }}>
              <Text color={theme.text} fontSize={16} fontWeight={400}>
                {token.context.symbol}
              </Text>
              <Flex
                alignItems="center"
                style={{
                  gap: 8,
                  borderRadius: 4,
                  background: theme.background,
                  padding: '2px 8px',
                  width: 'fit-content',
                }}
              >
                <img src={networkInfo.logo} alt="" height={16} />
                {above768 && (
                  <Text fontSize={16} fontWeight={300} color={theme.subText}>
                    {networkInfo.name}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>
        </TableBodyItemWrapper>
        <TableBodyItemWrapper>
          <Flex alignItems={'center'}>{formattedNumLong(token.context.price, true)}</Flex>
        </TableBodyItemWrapper>
        <TableBodyItemWrapper>
          <Flex>
            {formattedNumLong(token.context.balance)}
            {above768 && (
              <Text color={theme.primary} fontSize={14} fontWeight={300} style={{ marginLeft: 8 }}>
                {token.context.symbol}
              </Text>
            )}
          </Flex>
        </TableBodyItemWrapper>
        <TableBodyItemWrapper>
          <Flex alignItems={'center'}>{formattedNumLong(token.balanceUSD, true)}</Flex>
        </TableBodyItemWrapper>
      </LayoutWrapper>
    )
  }

  if (network === 'all-networks') {
    return (
      <TableWrapper>
        <Flex flexDirection={'column'} style={{ gap: 24 }}>
          <Flex alignItems={'center'} style={{ gap: 16 }}>
            <WalletIcon size={24} />
            <Text fontSize={20} fontWeight={500}>
              {' '}
              Wallet : {formattedNumLong(totalsWalletBalances, true)}
            </Text>
          </Flex>

          <AutoColumn gap="16px">
            <TableHeader />
            {AllToken.list.length === 0 && (
              <Flex justifyContent={'center'} alignItems={'center'} style={{ height: 200 }}>
                <Text fontSize={20} fontWeight={500} color={theme.subText}>
                  No data
                </Text>
              </Flex>
            )}
            {Object.keys(wallet).length > 0 &&
              AllToken.list.map((token, index) => {
                return <Token token={token} index={index} key={index} />
              })}
            <Pagination
              pageSize={10}
              onPageChange={newPage => setPage(newPage)}
              currentPage={page}
              totalCount={AllToken.size || 1}
              style={{
                backgroundColor: 'transparent',
              }}
            />
          </AutoColumn>
        </Flex>
      </TableWrapper>
    )
  }

  return (
    <TableWrapper>
      <Flex flexDirection={'column'} style={{ gap: 24 }}>
        <Flex alignItems={'center'} style={{ gap: 16 }}>
          <WalletIcon size={32} />
          <Text fontSize={20} fontWeight={500}>
            {' '}
            Wallet : {formattedNumLong(wallet[network].totals, true)}
          </Text>
        </Flex>

        <AutoColumn gap="16px">
          <TableHeader />
          {walletPaginate.list.length === 0 && (
            <Flex justifyContent={'center'} alignItems={'center'} style={{ height: 200 }}>
              <Text fontSize={20} fontWeight={500} color={theme.subText}>
                No data
              </Text>
            </Flex>
          )}
          {walletPaginate.list.map((token: TokenBreakdown, index) => {
            return <Token token={token} index={index} key={index} />
          })}
          <Pagination
            pageSize={10}
            onPageChange={newPage => setPage(newPage)}
            currentPage={page}
            totalCount={walletPaginate.size || 1}
            style={{
              backgroundColor: 'transparent',
            }}
          />
        </AutoColumn>
      </Flex>
    </TableWrapper>
  )
}
