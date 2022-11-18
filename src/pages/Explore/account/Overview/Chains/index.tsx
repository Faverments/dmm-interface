import { Flex, Text } from 'rebass'
import { ALL_NETWORKS, Network, PresentedBalancePayload } from 'services/zapper'
import { chainsInfo } from 'services/zapper/constances'
import { useChainBalances } from 'services/zapper/hooks/useBalances'
import styled from 'styled-components/macro'

import AllNetworks from 'assets/images/all-networks.png'
import { Kyber } from 'components/Icons'
import useTheme from 'hooks/useTheme'
import { formattedNumLong } from 'utils'

const ChainBalanceStyled = styled.div<{ active: boolean }>`
  background: ${({ theme, active }) => (active ? theme.primary : theme.buttonBlack)};
  border-radius: 999px;
  padding: 10px 20px;
  cursor: pointer;
`

const BalanceStyled = styled.div`
  background: ${({ theme }) => theme.tabActive};
  border-radius: 20px;
  padding: 6px 8px;
`

export default function Chains({
  data,
  network,
  setNetwork,
}: {
  data: PresentedBalancePayload[]
  network: Network | ALL_NETWORKS
  setNetwork: React.Dispatch<React.SetStateAction<Network | ALL_NETWORKS>>
}) {
  const chainsBalances = useChainBalances(data)
  const totalsChainBalances = Object.values(chainsBalances).reduce((acc, cur) => acc + cur.total, 0)
  const theme = useTheme()
  return (
    <BalanceStyled>
      <Flex flexWrap="wrap" style={{ gap: 16 }}>
        <ChainBalanceStyled
          active={network === 'all-networks'}
          onClick={() => {
            setNetwork('all-networks')
          }}
        >
          <Flex alignItems="center" style={{ gap: 8 }} justifyContent="space-between">
            <Flex alignItems="center" style={{ gap: 8 }}>
              <Kyber size={24} color={theme.border} />

              <Text fontSize={16} fontWeight={500} color={network === 'all-networks' ? theme.textReverse : theme.text}>
                All Networks
              </Text>
            </Flex>

            <Text fontSize={16} fontWeight={400} color={network === 'all-networks' ? theme.textReverse : theme.text}>
              {' '}
              {formattedNumLong(totalsChainBalances, true)}
            </Text>
          </Flex>
        </ChainBalanceStyled>

        {Object.keys(chainsBalances).map(key => {
          const chainData = chainsBalances[key as keyof typeof chainsBalances]
          const active = key === network

          if (chainData.total === 0) return null

          return (
            <ChainBalanceStyled
              key={key}
              style={
                {
                  // flexBasis: '100%',
                  // maxWidth: 230,
                }
              }
              onClick={() => setNetwork(key as Network)}
              active={active}
            >
              {/* <Flex alignItems="center" justifyContent="space-between"> */}
              <Flex alignItems="center" style={{ gap: 8 }} justifyContent="space-between">
                <Flex alignItems="center" style={{ gap: 8 }}>
                  <img src={chainsInfo[key as keyof typeof chainsInfo].logo} alt="" height={24} />

                  <Text fontSize={16} fontWeight={500} color={active ? theme.textReverse : theme.text}>
                    {chainsInfo[key as keyof typeof chainsInfo].name}{' '}
                  </Text>
                </Flex>
                <Text fontSize={16} fontWeight={400} color={active ? theme.textReverse : theme.text}>
                  {' '}
                  {formattedNumLong(chainData.total, true)}
                </Text>
              </Flex>
            </ChainBalanceStyled>
          )
        })}
      </Flex>
    </BalanceStyled>
  )
}
