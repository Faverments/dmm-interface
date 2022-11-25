import { ChainId } from '@kyberswap/ks-sdk-core'
import dayjs from 'dayjs'
import { BigNumber } from 'ethers'
import { rgba } from 'polished'
import React, { useEffect, useState } from 'react'
import { ZapOff } from 'react-feather'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router-dom'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import { TokenApproval, useGetTokenApprovals } from 'services/krystal'
import { ALL_NETWORKS, Network } from 'services/zapper'
import { chainsInfo } from 'services/zapper/constances'
import styled from 'styled-components/macro'

import DefaultIcon from 'assets/images/default-icon.png'
import { AutoColumn } from 'components/Column'
import LocalLoader from 'components/LocalLoader'
import Pagination from 'components/Pagination'
import Search from 'components/Search'
import { NETWORKS_INFO_CONFIG } from 'constants/networks'
import { useFuse } from 'hooks/useFuse'
import useTheme from 'hooks/useTheme'
import { useRevoke } from 'pages/Explore/hooks/userevoke'
import { formattedNumLong } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import getShortenAddress from 'utils/getShortenAddress'

import FuseHighlight from '../../../../components/FuseHighlight/FuseHighlight'
import NotFound from '../components/NotFound'
import { TableWrapper } from '../styleds'
import NetworkSelect from './NetworkSelect'

export default function TokenApprovals() {
  const { address } = useParams<{ address: string }>()
  const [network, setNetwork] = React.useState<Network | ALL_NETWORKS>('all-networks')
  const { data, isLoading, error } = useGetTokenApprovals(
    address,
    chainsInfo[network as Network] ? chainsInfo[network as Network].chainId : 'all-networks',
  )
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')

  useEffect(() => {
    setCurrentPage(1)
  }, [address, network])

  const { hits, query, onSearch } = useFuse<
    {
      refIndex: number
      item: TokenApproval
    }[]
  >(data?.approvals ? data?.approvals : [], {
    keys: ['name', 'symbol', 'tokenAddress', 'spenderAddress'],
    includeMatches: true,
    matchAllOnEmptyQuery: true,
  })

  const sortedHits = hits.sort((a, b) => Number(b.item.lastUpdateTimestamp) - Number(a.item.lastUpdateTimestamp))

  const hitsPaginated = sortedHits.slice((currentPage - 1) * 10, currentPage * 10)

  const theme = useTheme()

  const onSearchQuery = (value: any) => {
    onSearch(value)
    setSearch(value)
  }

  const { update } = useRevoke()

  const above768 = useMedia('(min-width: 768px)')

  return (
    <Flex
      flexDirection="column"
      style={{
        gap: 20,
      }}
    >
      <FilterBarWrapper>
        <Text
          color={theme.subText}
          fontSize={16}
          fontWeight={300}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: theme.background,
            borderRadius: 4,
            padding: '8px 12px',
            width: 'fit-content',
          }}
        >
          {isLoading || error ? (
            <Skeleton width={100} baseColor={theme.background} />
          ) : (
            data!.atRisk?.usd && `Total Allowance : ${formattedNumLong(data!.atRisk['usd'], true)}`
          )}
        </Text>
        <Flex justifyContent="space-between" style={{ gap: 8, width: above768 ? undefined : '100%' }}>
          <NetworkSelect network={network} setNetwork={setNetwork} />

          <Search searchValue={search} onSearch={onSearchQuery} placeholder="Search by name, symbol, address" />
        </Flex>
      </FilterBarWrapper>

      <Flex style={{ gap: 0 }} flexDirection="column">
        <ScrollWrapper>
          <Flex flexDirection="row" style={{ gap: 30, minWidth: 768 }}>
            <TableWrapper>
              <AutoColumn gap="16px">
                <LayoutWrapper>
                  <TableHeaderItem>Asset</TableHeaderItem>
                  <TableHeaderItem>Approved Amount</TableHeaderItem>
                  <TableHeaderItem>Approved Spender</TableHeaderItem>
                  <TableHeaderItem>Last Updated</TableHeaderItem>
                  <TableHeaderItem>Txn Hash</TableHeaderItem>
                  <TableHeaderItem>Revoke</TableHeaderItem>
                </LayoutWrapper>

                {hitsPaginated.map(hit => {
                  const {
                    logo,
                    chainId,
                    name,
                    amount,
                    symbol,
                    spenderAddress,
                    spenderName,
                    lastUpdateTimestamp,
                    lastUpdateTxHash,
                  } = hit.item
                  const network = NETWORKS_INFO_CONFIG[chainId as ChainId]
                  return (
                    <LayoutWrapper key={hit.refIndex}>
                      <TableBodyItem>
                        <Flex alignItems="center">
                          <div
                            style={{
                              position: 'relative',
                            }}
                          >
                            <img
                              src={logo ? logo : DefaultIcon}
                              width={25}
                              height={25}
                              alt={name}
                              style={{
                                borderRadius: '50%',
                              }}
                            />
                            <img
                              src={network.icon}
                              width={16}
                              style={{
                                position: 'absolute',
                                right: -5,
                                bottom: -5,
                                borderRadius: '50%',
                              }}
                              alt={network.name}
                            />
                          </div>
                          <Flex flexDirection="column" style={{ marginLeft: 12 }}>
                            <Text color={theme.subText} fontSize={16} fontWeight={300}>
                              <FuseHighlight hit={hit} attribute="name" />
                            </Text>
                            <Text color={theme.text} fontSize={18} fontWeight={500}>
                              <FuseHighlight hit={hit} attribute="symbol" />
                            </Text>
                          </Flex>
                        </Flex>
                      </TableBodyItem>
                      <TableBodyItem>
                        <Flex>
                          {Number(amount) > 100000000000000000000000000
                            ? 'unlimited'
                            : getFullDisplayBalance(BigNumber.from(amount))}
                          <Text color={theme.primary} fontSize={14} fontWeight={300} style={{ marginLeft: 8 }}>
                            {symbol}
                          </Text>
                        </Flex>
                      </TableBodyItem>
                      <TableBodyItem>
                        <a
                          target="_blank"
                          href={`${network.etherscanUrl}\\address\\${spenderAddress}`}
                          rel="noreferrer"
                        >
                          {spenderName ? spenderName : getShortenAddress(spenderAddress)}
                        </a>
                      </TableBodyItem>
                      <TableBodyItem>
                        {dayjs.unix(Number(lastUpdateTimestamp)).format('YYYY-MM-DD HH:mm:ss')}
                      </TableBodyItem>
                      <TableBodyItem>
                        <a target="_blank" href={`${network.etherscanUrl}\\tx\\${lastUpdateTxHash}`} rel="noreferrer">
                          {lastUpdateTxHash.slice(0, 8) + '...' + lastUpdateTxHash.slice(58, 65)}
                        </a>
                      </TableBodyItem>
                      <TableBodyItem
                        style={{
                          alignItems: above768 ? undefined : 'center',
                        }}
                      >
                        <ZapOffWrapper
                          size={16}
                          onClick={() => {
                            update(hit.item, '0')
                          }}
                        />
                      </TableBodyItem>
                    </LayoutWrapper>
                  )
                })}
              </AutoColumn>
            </TableWrapper>
          </Flex>
        </ScrollWrapper>
        {isLoading ? <LocalLoader /> : hitsPaginated.length === 0 && <NotFound text="No Token Approve found" />}
        <Pagination
          pageSize={10}
          onPageChange={newPage => setCurrentPage(newPage)}
          currentPage={currentPage}
          totalCount={hits.length ?? 1}
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </Flex>
    </Flex>
  )
}

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
  border-bottom: 0.5px solid ${({ theme }) => (theme.darkMode ? rgba(theme.border, 0.2) : theme.border)};
  padding-bottom: 16px;
  min-height: 0;
  min-width: 0;
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
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ZapOffWrapper = styled(ZapOff)`
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => rgba(theme.primary, 0.1)};
    border-radius: 50%;
  }
`

const ScrollWrapper = styled.div`
  overflow-x: scroll;
`

const FilterBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`
