import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { chainsInfo } from 'services/zapper/constances'
import { useGetTransactions } from 'services/zapper/hooks/useTransactions'
import { Network, Transaction } from 'services/zapper/types/models/index'
import styled, { useTheme } from 'styled-components/macro'

import Pagination from 'components/Pagination'
import { useFuse } from 'hooks/useFuse'

import FuseHighlight from '../../../../components/FuseHighlight/FuseHighlight'
import { ChainWrapper } from '../styleds'

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
  const { address } = useParams<{ address: string }>()
  const { transactions, isLoading, isError } = useGetTransactions({
    network,
    address,
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [address, network])

  const AllTransactions = useMemo(() => {
    return transactions?.data || []
  }, [transactions])

  const { hits, query, onSearch } = useFuse(AllTransactions, {
    keys: ['name', 'symbol', 'address'],
    includeMatches: true,
    matchAllOnEmptyQuery: true,
  })

  const { listTimeStamp, transactionsPaginated, hitsPaginated } = useMemo<{
    listTimeStamp: any[]
    transactionsPaginated: Transaction[]
    hitsPaginated: any[]
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

  return (
    <Flex>
      <Flex flexDirection="column" style={{ gap: 18 }}>
        <div>
          <input
            name="search"
            type="search"
            placeholder="Search..."
            autoComplete="off"
            onKeyUp={onSearch}
            onChange={onSearch} // handles "clear search" click
          />
          <p>Results for &quot;{query}&quot;:</p>
          {/* <ol>
            {hits.map((hit: any) => {
              return (
                <li key={hit.refIndex}>
                  <FuseHighlight hit={hit} attribute="symbol" />
                </li>
              )
            })}
          </ol> */}
        </div>
        <Flex>
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
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error</div>
        ) : listTimeStamp.length === 0 ? (
          <Text>No transactions found</Text>
        ) : (
          <div>
            {listTimeStamp.map(timeStamp => {
              return (
                <div key={timeStamp}>
                  <Text>{dayjs(Number(timeStamp) * 1000).format('YYYY-MM-DD')}</Text>
                  {transactionsPaginated
                    .filter(item => {
                      const date1 = dayjs(Number(item.timeStamp) * 1000)
                      const date2 = dayjs(Number(timeStamp) * 1000)
                      return date1.isSame(date2, 'day')
                    })
                    .map((transaction, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            marginLeft: 100,
                          }}
                        >
                          <Flex>
                            <Flex flexDirection="column">
                              <div>
                                <FuseHighlight hit={hitsPaginated[index]} attribute="name" />
                              </div>
                              <Text>{dayjs(Number(transaction.timeStamp) * 1000).format('hh:mm A')}</Text>
                              <div>
                                <FuseHighlight hit={hitsPaginated[index]} attribute="symbol" />
                              </div>
                            </Flex>
                          </Flex>
                        </div>
                      )
                    })}
                </div>
              )
            })}
            <Pagination
              pageSize={20}
              onPageChange={newPage => setCurrentPage(newPage)}
              currentPage={currentPage}
              totalCount={hits.length ?? 1}
            />
          </div>
        )}
      </Flex>
    </Flex>
  )
}
