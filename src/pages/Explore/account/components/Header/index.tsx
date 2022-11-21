import { rgba } from 'polished'
import React, { useEffect, useState } from 'react'
import { CheckCircle, RefreshCcw } from 'react-feather'
import Skeleton from 'react-loading-skeleton'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { Return24h } from 'services/defiyield'
import { useTotalsBalances } from 'services/zapper/hooks/useBalances'
import { PresentedBalancePayload } from 'services/zapper/types/models'
import styled from 'styled-components/macro'

import Avatar from 'components/Avatar'
import Copy from 'components/Copy'
import { Spinner } from 'components/Header/Polling'
import AnimatingNumber from 'components/LiveChart/AnimatingNumber'
import useENSName from 'hooks/useENSName'
import useParsedQueryString from 'hooks/useParsedQueryString'
import useTheme from 'hooks/useTheme'
import { formattedNumLong } from 'utils'
import { formatTokenBalance } from 'utils/formatBalance'
import getShortenAddress from 'utils/getShortenAddress'

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PercentStyled = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  background-color: ${({ theme, active }) => (active ? rgba(theme.primary, 0.2) : rgba(theme.red, 0.2))};
  padding: 4px 8px;
  border-radius: 12px;
`

export default function Header({
  data,
  // return24hs,
  isBalanceSyncing,
}: // isReturn24hSyncing,
{
  data: PresentedBalancePayload[]
  // return24hs: Return24h[]
  isBalanceSyncing: boolean
  // isReturn24hSyncing: boolean
}) {
  const theme = useTheme()
  const { address } = useParams<{ address: string }>()
  const { ENSName, loading } = useENSName(address)
  const details = useTotalsBalances(data, 'all-networks')
  // const allChain24hReturn = return24hs.reduce((acc, cur) => acc + (cur[address] ? cur[address].totalUSD : 0), 0)
  // const percent = (allChain24hReturn / details.total) * 100
  return (
    <Flex justifyContent="space-between" width="100%">
      <Flex style={{ gap: 20 }} width="100%">
        <Avatar address={address} />
        <Flex flexDirection="column" style={{ gap: 5 }} width="100%">
          <Flex justifyContent="space-between" width="100%">
            <Text fontSize={26} color={theme.text}>
              {loading ? (
                <Skeleton baseColor={theme.background} width={300} />
              ) : ENSName ? (
                ENSName
              ) : (
                getShortenAddress(address)
              )}
            </Text>
            {/* <Text fontSize={18} color={theme.subText}>
              Past 24h Hours
            </Text> */}
          </Flex>
          <Flex justifyContent="space-between" alignItems="flex-end" style={{ gap: 25 }}>
            <Text fontSize={38} fontWeight={700} color={theme.text} minWidth={200}>
              {details.total === 0 ? <Skeleton baseColor={theme.background} /> : formattedNumLong(details.total, true)}
            </Text>

            {/* <PercentStyled active={allChain24hReturn > 0}> */}
            {/* {isReturn24hSyncing ? (
                <Flex>
                  {/* {formattedNumLong(allChain24hReturn, true)} */}
            {/* {allChain24hReturn < 0 && <div style={{ color: theme.subText, fontSize: 20 }}>-</div>}
                  <AnimatingNumber value={Math.abs(allChain24hReturn)} symbol={'$'} fontSize={20} />
                </Flex> */}
            {/* ) : ( */}
            {/* <Text fontSize={20} color={theme.subText}>
                {formattedNumLong(allChain24hReturn)} $
              </Text> */}
            {/* )} */}

            {/* <Text fontSize={20} fontWeight={400} color={allChain24hReturn > 0 ? theme.primary : theme.red}>
                {isNaN(percent) ? '0.00%' : `(${formattedNumLong(percent)}%)`}
              </Text> */}
            {/* {
                isBalanceSyncing || isReturn24hSyncing ? <Spinner /> : <CheckCircle size={18} color={theme.green1} />
                // <RefreshCcw size={18} />
              } */}
            {/* </PercentStyled> */}
          </Flex>
          <Flex>
            <Text fontSize={20} color={theme.subText}>
              {getShortenAddress(address)}
            </Text>

            <CenterDiv>
              <Copy toCopy={address} />
            </CenterDiv>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
