import ReactBlockies from '@vukhaihoan/react-blockies'
import dayjs from 'dayjs'
import { rgba } from 'polished'
import { useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { ArrowDown, ArrowUp, Repeat, Search as SearchIcon, X } from 'react-feather'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { chainsInfo } from 'services/zapper/constances'
import { useGetTransactions } from 'services/zapper/hooks/useTransactions'
import { Network, Transaction } from 'services/zapper/types/models/index'
import styled, { useTheme } from 'styled-components/macro'

import DefaultIcon from 'assets/images/default-icon.png'
import ETH from 'assets/images/ethereum-logo.png'
import { ButtonLight } from 'components/Button'
import { AutoColumn } from 'components/Column'
import LocalLoader from 'components/LocalLoader'
import Pagination from 'components/Pagination'
import Search from 'components/Search'
import { useFuse } from 'hooks/useFuse'
import { formattedNumLong } from 'utils'
import getShortenAddress from 'utils/getShortenAddress'

import FuseHighlight from '../../../../components/FuseHighlight/FuseHighlight'
import { ChainWrapper, TableWrapper } from '../styleds'

export default function TransactionsHistory() {
  const listChainAvailable = [
    Network.ETHEREUM_MAINNET,
    Network.BINANCE_SMART_CHAIN_MAINNET,
    Network.POLYGON_MAINNET,
    Network.AVALANCHE_MAINNET,
    Network.FANTOM_OPERA_MAINNET,
    Network.ARBITRUM_MAINNET,
    Network.OPTIMISM_MAINNET,
  ]
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useState(1)
  const [network, setNetwork] = useState<Network>(Network.ETHEREUM_MAINNET)
  const [search, setSearch] = useState('')
  const { address } = useParams<{ address: string }>()
  const { transactions, isLoading, isError } = useGetTransactions({
    network,
    address,
  })

  const AllTransactions = useMemo(() => {
    return transactions?.data || []
  }, [transactions])

  const { hits, query, onSearch } = useFuse<any>(AllTransactions, {
    keys: ['name', 'symbol', 'address', 'from'],
    includeMatches: true,
    matchAllOnEmptyQuery: true,
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [address, network, query])

  const { listTimeStamp, transactionsPaginated, hitsPaginated } = useMemo<{
    listTimeStamp: any[]
    transactionsPaginated: Transaction[]
    hitsPaginated: {
      refIndex: number
      item: Transaction
    }[]
  }>(() => {
    if (!hits)
      return {
        listTimeStamp: [],
        transactionsPaginated: [],
        hitsPaginated: [],
      }
    const res = hits
      .map((item: any) => item.item)
      // .filter((item: any) => item.direction === 'exchange')
      .slice((currentPage - 1) * 20, currentPage * 20)
    const listTimeStamp = [
      ...new Set(
        res.map((item: any) => {
          return dayjs(Number(item.timeStamp) * 1000)
            .startOf('date')
            .unix()
        }),
      ),
    ]

    const hitsPaginated = hits.slice((currentPage - 1) * 20, currentPage * 20)
    return {
      listTimeStamp,
      transactionsPaginated: res,
      hitsPaginated,
    }
  }, [hits, currentPage])

  const onSearchQuery = (value: any) => {
    onSearch(value)
    setSearch(value)
  }

  console.log('transactionsPaginated', transactionsPaginated)

  return (
    <Flex flexDirection="column" style={{ gap: 18 }}>
      <Flex style={{ gap: 8 }} flexWrap="wrap">
        {listChainAvailable.map((item, index) => {
          const active = item === network
          return (
            <ChainWrapper
              key={index}
              style={
                {
                  // flexBasis: '100%',
                  // maxWidth: 230,
                }
              }
              onClick={() => setNetwork(item as Network)}
              active={active}
            >
              <Flex alignItems="center" style={{ gap: 8 }} justifyContent="space-between">
                <Flex alignItems="center" style={{ gap: 8 }}>
                  <img src={chainsInfo[item as keyof typeof chainsInfo].logo} alt="" height={24} />

                  <Text fontSize={16} fontWeight={500} color={active ? theme.textReverse : theme.text}>
                    {chainsInfo[item as keyof typeof chainsInfo].name}{' '}
                  </Text>
                </Flex>
              </Flex>
            </ChainWrapper>
          )
        })}
      </Flex>

      <Flex justifyContent="space-between" alignItems="center">
        <Search
          searchValue={search}
          onSearch={onSearchQuery}
          placeholder="Search by name, symbol, address"
          minWidth={'350px'}
        />

        <CSVLink data={AllTransactions} filename={`${address}_transactions.csv`}>
          <ButtonLight> Download CSV</ButtonLight>
        </CSVLink>
      </Flex>

      {isLoading ? (
        <LocalLoader />
      ) : isError ? (
        <div>Error</div>
      ) : listTimeStamp.length === 0 ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          style={{
            height: 300,
            width: '100%',
            border: `1px solid ${theme.background}`,
            borderRadius: 12,
          }}
        >
          <Flex justifyContent="center" alignItems="center" flexDirection="column" style={{ gap: 20 }}>
            <div
              style={{
                position: 'relative',
                width: 'fit-content',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: theme.background,
                }}
              >
                <SearchIcon size={36} />
              </div>
              <X
                size={24}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: theme.primary,
                  borderRadius: '50%',
                  color: theme.textReverse,
                }}
              />
            </div>
            <Text color={theme.subText} fontSize={24} fontWeight={300}>
              No transactions found on {chainsInfo[network as keyof typeof chainsInfo].name}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <AutoColumn gap="16px">
          {listTimeStamp.map(timeStamp => {
            return (
              <AutoColumn gap="16px" key={timeStamp}>
                <Text fontSize={20} fontWeight={500}>
                  {dayjs(Number(timeStamp) * 1000).format('MMMM DD, YYYY')}
                </Text>
                <Flex flexDirection="row" style={{ gap: 30 }}>
                  <TableWrapper>
                    <AutoColumn gap="16px">
                      {transactionsPaginated
                        .filter(item => {
                          const date1 = dayjs(Number(item.timeStamp) * 1000)
                          const date2 = dayjs(Number(timeStamp) * 1000)
                          return date1.isSame(date2, 'day')
                        })
                        .map((transaction, index) => {
                          const hit = hitsPaginated[index]
                          const { direction, timeStamp, network, subTransactions, symbol, from, gasPrice } = hit.item
                          const networkInfo = chainsInfo[network as keyof typeof chainsInfo]
                          return (
                            <LayoutWrapper key={hit.refIndex}>
                              <TableBodyItem>
                                <Flex alignItems="center" style={{ gap: 8 }}>
                                  {direction === 'exchange' ? (
                                    <DirectionIcon>
                                      <Repeat size={16} />
                                    </DirectionIcon>
                                  ) : direction === 'outgoing' ? (
                                    <DirectionIcon>
                                      <ArrowUp size={16} />
                                    </DirectionIcon>
                                  ) : (
                                    <DirectionIcon>
                                      <ArrowDown size={16} />
                                    </DirectionIcon>
                                  )}

                                  <Flex flexDirection="column" style={{ marginLeft: 12 }}>
                                    <Text color={theme.text} fontSize={18} fontWeight={400}>
                                      <FuseHighlight hit={hit} attribute="name" />
                                    </Text>
                                    <Text color={theme.subText} fontSize={16} fontWeight={300}>
                                      {dayjs(Number(timeStamp)).format('hh:mm A')}
                                    </Text>
                                  </Flex>
                                  <Flex alignItems="flex-end" height="100%" style={{ marginLeft: 12 }}>
                                    <Flex alignItems="flex-end" style={{ gap: 8 }}>
                                      <img src={networkInfo.logo} alt="" height={16} />
                                      <Text fontSize={16} fontWeight={300} color={theme.subText}>
                                        {networkInfo.name}
                                      </Text>
                                    </Flex>
                                  </Flex>
                                </Flex>
                              </TableBodyItem>
                              <TableBodyItem>
                                <Flex alignItems="center">
                                  <img
                                    src={`https://storage.googleapis.com/zapper-fi-assets/tokens/${network}/${subTransactions[0].address}.png`}
                                    alt={symbol}
                                    onError={e => {
                                      e.currentTarget.onerror = null
                                      e.currentTarget.src = DefaultIcon
                                    }}
                                    height={32}
                                    width={32}
                                    style={{ borderRadius: '50%' }}
                                  />
                                  <Flex flexDirection="column" style={{ marginLeft: 12 }}>
                                    <Flex>
                                      <Text color={theme.subText} fontSize={16} fontWeight={300}>
                                        {direction === 'exchange' ? <></> : direction === 'outgoing' ? '-' : '+'}
                                        {formattedNumLong(Number(subTransactions[0].amount))}
                                      </Text>
                                    </Flex>
                                    <Text
                                      color={theme.text}
                                      fontSize={18}
                                      fontWeight={500}
                                      style={{
                                        maxWidth: 120,
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                      }}
                                    >
                                      <FuseHighlight hit={hit} attribute="symbol" />
                                    </Text>
                                  </Flex>
                                </Flex>
                              </TableBodyItem>
                              <TableBodyItem>
                                <Flex alignItems="center" style={{ gap: 12 }}>
                                  <ReactBlockies
                                    seed={from}
                                    size={10}
                                    scale={4}
                                    style={{
                                      borderRadius: 8,
                                    }}
                                  />
                                  <Flex flexDirection="column" style={{ gap: 6 }}>
                                    <Text>
                                      {direction === 'exchange' ? '' : direction === 'outgoing' ? 'To' : 'From'}
                                    </Text>
                                    <Text
                                      style={{
                                        gap: 8,
                                        borderRadius: 4,
                                        background: theme.background,
                                        padding: '2px 8px',
                                      }}
                                    >
                                      {getShortenAddress(from)}
                                    </Text>
                                  </Flex>
                                </Flex>
                              </TableBodyItem>
                              <TableBodyItem>
                                <Flex flexDirection="column" style={{ gap: 8 }}>
                                  <Text color={theme.subText} fontSize={13}>
                                    Gas Fee
                                  </Text>
                                  <Flex style={{ gap: 4 }}>
                                    <img src={ETH} alt="ETH" height={16} width={16} />
                                    <Text fontSize={13}>${gasPrice}</Text>
                                  </Flex>
                                </Flex>
                              </TableBodyItem>
                            </LayoutWrapper>
                          )
                        })}
                    </AutoColumn>
                  </TableWrapper>
                </Flex>
              </AutoColumn>
            )
          })}
          <Pagination
            pageSize={20}
            onPageChange={newPage => setCurrentPage(newPage)}
            currentPage={currentPage}
            totalCount={hits.length ?? 1}
            style={{
              backgroundColor: 'transparent',
            }}
          />
        </AutoColumn>
      )}
    </Flex>
  )
}

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  border-bottom: 0.5px solid ${({ theme }) => (theme.darkMode ? rgba(theme.border, 0.2) : theme.border)};
  padding-bottom: 16px;
`

const TableHeaderItem = styled.div<{ align?: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.subText};
  text-align: ${({ align }) => align ?? 'left'};
  text-transform: uppercase;
`

const TableBodyItem = styled.div<{ align?: string }>`
  font-size: 14px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ align }) => (align === 'right' ? 'flex-end' : 'flex-start')};
  gap: 8px;
  color: ${({ theme }) => rgba(theme.text, 0.85)};
`

const DirectionIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => rgba(theme.primary, 0.1)};
  border-radius: 50%;
  width: 30px;
  height: 30px;
`
