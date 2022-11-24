import { rgba } from 'polished'
import { Flex, Text } from 'rebass'
import { chainsInfo } from 'services/zapper/constances'
import { useAppBalances } from 'services/zapper/hooks/useBalances'
import {
  ALL_NETWORKS,
  Network,
  NonFungibleTokenBreakdown,
  PositionBreakdown,
  PresentedBalancePayload,
  TokenBreakdown,
} from 'services/zapper/types/models/index'
import styled from 'styled-components/macro'

import { AutoColumn } from 'components/Column'
import useTheme from 'hooks/useTheme'
import { formattedNumLong } from 'utils'

import { TableBodyItemWrapper, TableHeaderItem, TableWrapper } from '../styleds'

const AppSubDetailsStyled = styled.div`
  margin-left: 5rem;
`

export default function Apps({ data, network }: { data: PresentedBalancePayload[]; network: Network | ALL_NETWORKS }) {
  const apps = useAppBalances(data, network)
  const theme = useTheme()
  return (
    <>
      {Object.values(apps)
        .sort((a, b) => b.totals - a.totals)
        .map((item, index) => {
          const AppMain = item.details.app
          const networkInfoMain = chainsInfo[AppMain.network as keyof typeof chainsInfo]
          const AppSubDetails = item.details.app.data.sort((a, b) => b.balanceUSD - a.balanceUSD)
          const tokens = AppSubDetails.filter(item => item.type === 'token')
          const positions = AppSubDetails.filter(item => item.type === 'position')
          const nfts = AppSubDetails.filter(item => item.type === 'nft')

          let isTokensContainDetail = false
          tokens.forEach(token => {
            if (token.displayProps.tertiaryLabel && token.displayProps.tertiaryLabel.value) {
              isTokensContainDetail = true
              // break forEach
              return false
            }
            return true
          })

          const status = Object.entries(item.details.balance).map(([keyStatus, value]) => {
            const listKey = Object.keys(value)
            const listStatus = listKey.map(item => ({
              key: item,
              status: keyStatus,
            }))
            return listStatus
          })

          return (
            <TableWrapper key={index}>
              <Flex flexDirection={'column'} style={{ gap: 24 }}>
                <Flex justifyContent="space-between" alignItems={'center'}>
                  <Flex alignItems={'center'} style={{ gap: 16 }}>
                    <img
                      src={AppMain.displayProps.images[0]}
                      height={28}
                      style={{
                        borderRadius: '50%',
                      }}
                      alt={AppMain.displayProps.appName}
                    />
                    <Text fontSize={20} fontWeight={500}>
                      {AppMain.displayProps.appName} :{' '}
                      <span style={{ color: theme.subText, fontWeight: 400 }}>
                        {formattedNumLong(item.totals, true)}
                      </span>
                    </Text>
                  </Flex>
                  <Flex
                    alignItems="center"
                    style={{
                      gap: 8,
                    }}
                  >
                    <img src={networkInfoMain.logo} alt="" height={28} />
                    <Text fontSize={14} fontWeight={300} color={theme.subText}>
                      {networkInfoMain.name}
                    </Text>
                  </Flex>
                </Flex>
                <AutoColumn gap="48px">
                  {tokens.length > 0 && (
                    <AutoColumn gap="16px">
                      <LayoutWrapper colum={isTokensContainDetail ? 5 : 4}>
                        <TableHeaderItem>Asset</TableHeaderItem>
                        <TableHeaderItem>Price</TableHeaderItem>
                        <TableHeaderItem>Balance</TableHeaderItem>
                        <TableHeaderItem>Value</TableHeaderItem>
                        {isTokensContainDetail && <TableHeaderItem>Detail</TableHeaderItem>}
                      </LayoutWrapper>
                      {tokens.map((token, index) => {
                        const { context, displayProps, key } = token as unknown as TokenBreakdown
                        const networkInfo = chainsInfo[token.network as keyof typeof chainsInfo]
                        const displayStatus = status.filter(subStatus => {
                          return subStatus.filter(item => item.key === key).length !== 0
                        })

                        return (
                          <LayoutWrapper key={index} colum={isTokensContainDetail ? 5 : 4}>
                            <TableBodyItemWrapper>
                              <Flex alignItems="center" style={{ gap: 8 }}>
                                <div
                                  style={{
                                    position: 'relative',
                                  }}
                                >
                                  <img
                                    src={displayProps.images[0]}
                                    width={40}
                                    height={40}
                                    style={{ borderRadius: '50%' }}
                                    alt={displayProps.label}
                                  />
                                  <img
                                    src={AppMain.displayProps.images[0]}
                                    width={20}
                                    style={{
                                      position: 'absolute',
                                      top: -5,
                                      left: -5,
                                      borderRadius: '50%',
                                    }}
                                    alt={AppMain.displayProps.appName}
                                  />
                                </div>

                                <Flex flexDirection="column" style={{ gap: 4 }}>
                                  <Flex alignItems="center" style={{ gap: 16 }}>
                                    <Text color={theme.text} fontSize={16} fontWeight={400}>
                                      {displayProps.label}
                                    </Text>
                                    <Text
                                      style={{
                                        padding: '4px 8px',
                                        color: theme.primary,
                                        backgroundColor: rgba(theme.primary, 0.2),
                                        borderRadius: 16,
                                      }}
                                    >
                                      {displayStatus.length > 0 &&
                                        displayStatus[0].length > 0 &&
                                        displayStatus[0][0].status}
                                    </Text>
                                  </Flex>
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
                                    <Text fontSize={16} fontWeight={300} color={theme.subText}>
                                      {networkInfo.name}
                                    </Text>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </TableBodyItemWrapper>
                            <TableBodyItemWrapper>
                              <Flex alignItems={'center'}>{formattedNumLong(context.price, true)}</Flex>
                            </TableBodyItemWrapper>
                            <TableBodyItemWrapper>
                              <Flex>
                                {formattedNumLong(context.balance)}
                                <Text color={theme.primary} fontSize={14} fontWeight={300} style={{ marginLeft: 8 }}>
                                  {displayProps.label}
                                </Text>
                              </Flex>
                            </TableBodyItemWrapper>
                            <TableBodyItemWrapper>
                              <Flex alignItems={'center'}>{formattedNumLong(token.balanceUSD, true)}</Flex>
                            </TableBodyItemWrapper>
                            {isTokensContainDetail && (
                              <TableBodyItemWrapper>{displayProps.tertiaryLabel?.value || '--'}</TableBodyItemWrapper>
                            )}
                          </LayoutWrapper>
                        )
                      })}
                    </AutoColumn>
                  )}

                  {positions.length > 0 &&
                    positions.map((item, index) => {
                      const { displayProps, key } = item

                      const displayPositionStatus = status.filter(subStatus => {
                        return subStatus.filter(item => item.key === key).length !== 0
                      })

                      // let isTokensContainDetailBreakdown = false
                      // breakdownList.forEach(token => {
                      //   if (token.displayProps.secondaryLabel && token.displayProps.secondaryLabel.value) {
                      //     isTokensContainDetailBreakdown = true
                      //     // break forEach
                      //     return false
                      //   }
                      //   return true
                      // })
                      return (
                        <PostionWrapper key={index}>
                          <AutoColumn gap="16px">
                            <SecondaryLayoutWrapper colum={4}>
                              <TableHeaderItem>
                                <Text color={theme.text} fontSize={14}>
                                  {displayProps.label}
                                </Text>
                              </TableHeaderItem>
                              <TableHeaderItem>Price</TableHeaderItem>
                              <TableHeaderItem>Balance</TableHeaderItem>
                              <TableHeaderItem>Value</TableHeaderItem>
                              {/* {isTokensContainDetailBreakdown && <TableHeaderItem>Detail</TableHeaderItem>} */}
                            </SecondaryLayoutWrapper>
                            {item.breakdown.map((token, index) => {
                              const { context, displayProps } = token as unknown as TokenBreakdown
                              const networkInfo = chainsInfo[token.network as keyof typeof chainsInfo]
                              return (
                                <>
                                  {token.type === 'token' && (
                                    <SecondaryLayoutWrapper key={index} colum={4}>
                                      <TableBodyItemWrapper>
                                        <Flex alignItems="center" style={{ gap: 8 }}>
                                          <div
                                            style={{
                                              position: 'relative',
                                            }}
                                          >
                                            <img
                                              src={displayProps.images[0]}
                                              width={40}
                                              height={40}
                                              style={{ borderRadius: '50%' }}
                                              alt={displayProps.label}
                                            />
                                            <img
                                              src={AppMain.displayProps.images[0]}
                                              width={20}
                                              style={{
                                                position: 'absolute',
                                                top: -5,
                                                left: -5,
                                                borderRadius: '50%',
                                              }}
                                              alt={AppMain.displayProps.appName}
                                            />
                                          </div>

                                          <Flex flexDirection="column" style={{ gap: 4 }}>
                                            <Text color={theme.text} fontSize={16} fontWeight={400}>
                                              {displayProps.label}
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
                                              <Text fontSize={16} fontWeight={300} color={theme.subText}>
                                                {networkInfo.name}
                                              </Text>
                                            </Flex>
                                          </Flex>
                                        </Flex>
                                      </TableBodyItemWrapper>
                                      <TableBodyItemWrapper>
                                        <Flex alignItems={'center'}>{formattedNumLong(context.price, true)}</Flex>
                                      </TableBodyItemWrapper>
                                      <TableBodyItemWrapper>
                                        <Flex>
                                          {formattedNumLong(context.balance)}
                                          <Text
                                            color={theme.primary}
                                            fontSize={14}
                                            fontWeight={300}
                                            style={{ marginLeft: 8 }}
                                          >
                                            {displayProps.label}
                                          </Text>
                                        </Flex>
                                      </TableBodyItemWrapper>
                                      <TableBodyItemWrapper>
                                        <Flex alignItems={'center'}>{formattedNumLong(token.balanceUSD, true)}</Flex>
                                      </TableBodyItemWrapper>
                                      {/* {isTokensContainDetailBreakdown && (
                                        <TableBodyItemWrapper>
                                          {displayProps.secondaryLabel?.value || '--'}
                                        </TableBodyItemWrapper>
                                      )} */}
                                    </SecondaryLayoutWrapper>
                                  )}
                                </>
                              )
                            })}
                          </AutoColumn>
                        </PostionWrapper>
                      )
                    })}
                </AutoColumn>
              </Flex>
            </TableWrapper>
          )
        })}
    </>
  )
}

const LayoutWrapper = styled.div<{ colum: number }>`
  display: grid;
  grid-template-columns: ${({ colum }) => {
    return colum === 4 ? '1.5fr 1fr 1fr 1fr' : colum === 5 ? '1.5fr 1fr 1fr 1fr 1fr' : '1.5fr 1fr 1fr 1fr'
  }};
  border-bottom: 0.5px solid ${({ theme }) => (theme.darkMode ? rgba(theme.border, 0.2) : theme.border)};
  padding-bottom: 16px;
`
const SecondaryLayoutWrapper = styled.div<{ colum: number }>`
  display: grid;
  grid-template-columns: ${({ colum }) => {
    return colum === 4 ? '2fr 1fr 1fr 1fr' : colum === 5 ? '1.5fr 1fr 1fr 1fr 1fr' : '2 1fr 1fr 1fr'
  }};
  border-bottom: 0.5px solid ${({ theme }) => (theme.darkMode ? rgba(theme.border, 0.2) : theme.border)};
  padding-bottom: 16px;
`

const PostionWrapper = styled.div`
  border-left: ${({ theme }) => `2px solid ${theme.primary}`};
  padding-left: 16px;
`
