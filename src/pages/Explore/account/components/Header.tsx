import { rgba } from 'polished'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router-dom'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import { useTotalsBalances } from 'services/zapper/hooks/useBalances'
import useGetNftUsersCollectionsTotals from 'services/zapper/hooks/useGetZapperNftUsersCollectionsTotals'
import { PresentedBalancePayload } from 'services/zapper/types/models'
import styled, { keyframes } from 'styled-components/macro'

import Avatar from 'components/Avatar'
import Copy from 'components/Copy'
import useENSName from 'hooks/useENSName'
import useTheme from 'hooks/useTheme'
import { formattedNumLong } from 'utils'
import getShortenAddress from 'utils/getShortenAddress'
import { stringToColor } from 'utils/stringToColor'

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

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.green1};
  background: transparent;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  /* position: relative;

  left: -3px;
  top: -3px; */
`

const Circle = styled.div`
  transform: translateZ(0);
  border: 2px solid ${({ theme }) => theme.green1};
  background: transparent;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  /* position: relative;

  left: -3px;
  top: -3px; */
`

export default function Header({
  balances,
}: {
  balances: {
    isSyncing: boolean
    data: PresentedBalancePayload[]
    currentMessageData: PresentedBalancePayload | undefined
    error: Error | undefined
  }
}) {
  const { data, isSyncing, error } = balances
  const theme = useTheme()
  const { address } = useParams<{ address: string }>()
  const { ENSName, loading } = useENSName(address)
  const details = useTotalsBalances(data, 'all-networks')
  // const allChain24hReturn = return24hs.reduce((acc, cur) => acc + (cur[address] ? cur[address].totalUSD : 0), 0)
  // const percent = (allChain24hReturn / details.total) * 100

  const { nftUsersCollectionsTotals, isLoading: isNftsTotalsLoading } = useGetNftUsersCollectionsTotals(address)

  const above576 = useMedia('(min-width: 576px)')

  return (
    <Wrapper color={stringToColor(address)}>
      <Flex justifyContent="space-between" width="100%">
        <Flex style={{ gap: 20 }} width="100%">
          <div
            style={{
              position: 'relative',
            }}
          >
            <Avatar address={address} />
            <div
              style={{
                position: 'absolute',
                top: -16,
                right: -16,
              }}
            >
              {isSyncing ? <Spinner /> : <Circle />}
            </div>
          </div>
          <Flex flexDirection="column" style={{ gap: 5 }} width="100%">
            <Flex justifyContent="space-between" width="100%">
              <Text fontSize={above576 ? 26 : 20} color={theme.text}>
                {loading ? (
                  <Skeleton baseColor={theme.background} width={200} />
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
            <Flex alignItems="center" style={{ gap: 10 }}>
              <Text fontSize={above576 ? 38 : 32} fontWeight={700} color={theme.text} minWidth={200}>
                {details.total === 0 && isSyncing ? (
                  <Skeleton baseColor={theme.background} />
                ) : (
                  formattedNumLong(
                    details.total +
                      (nftUsersCollectionsTotals
                        ? Number(nftUsersCollectionsTotals.nftUsersCollections.totals.balanceUSD)
                        : 0),
                    true,
                  )
                )}
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
              <Text fontSize={above576 ? 20 : 16} color={theme.subText}>
                {getShortenAddress(address)}
              </Text>

              <CenterDiv>
                <Copy toCopy={address} />
              </CenterDiv>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ color: string }>`
  padding: 16px 32px;
  border-radius: 8px;
  @media screen and (max-width: 578px) {
    padding: 16px 0px;
  }
`
