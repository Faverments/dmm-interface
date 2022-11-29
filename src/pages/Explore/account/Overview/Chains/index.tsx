import { rgba } from 'polished'
import { Flex, Text } from 'rebass'
import { ALL_NETWORKS, Network, PresentedBalancePayload } from 'services/zapper'
import { chainsInfo } from 'services/zapper/constances'
import { useChainBalances } from 'services/zapper/hooks/useBalances'
import styled from 'styled-components/macro'

import AllNetwork from 'assets/images/all-networks.png'
import useTheme from 'hooks/useTheme'
import { formattedNumLong } from 'utils'

const ChainBalanceStyled = styled.div<{ active: boolean }>`
  background: ${({ theme, active }) => (active ? theme.primary : theme.buttonBlack)};
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  border: 1px solid ${({ theme, active }) => rgba(theme.border, 0.3)};
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary};

    img {
      transform: rotate(360deg);
      transition-duration: 1s;
    }
    #kid {
      transform: rotate(360deg);
      transition-duration: 1s;
    }
  }
`

const Wrapper = styled.div`
  background: ${({ theme }) => rgba(theme.buttonBlack, 0.3)};
  border-radius: 8px;
  padding: 16px;
  border: 1px solid ${({ theme }) => rgba(theme.border, 0.1)};
  @media screen and (max-width: 768px) {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 8px;
  `}
`

const ChainsLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-gap : 8px;
  `}
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
    <Wrapper>
      <ChainsLayout>
        <div>
          <ChainBalanceStyled
            active={network === 'all-networks'}
            onClick={() => {
              setNetwork('all-networks')
            }}
          >
            <Flex flexDirection="column" style={{ gap: 16 }}>
              <Flex alignItems="center" style={{ gap: 8 }}>
                <Flex id="kid" justifyContent="center" alignItems="colum">
                  {/* <Kyber size={40} color={theme.border} /> */}
                  <img src={AllNetwork} alt="" height={40} />
                </Flex>
                <Text
                  fontSize={16}
                  fontWeight={500}
                  color={network === 'all-networks' ? theme.textReverse : theme.text}
                >
                  All Chains
                </Text>
              </Flex>

              <Text fontSize={16} fontWeight={400} color={network === 'all-networks' ? theme.textReverse : theme.text}>
                {' '}
                {formattedNumLong(totalsChainBalances, true)}
              </Text>
            </Flex>
          </ChainBalanceStyled>
        </div>
        {Object.keys(chainsBalances).map(key => {
          const chainData = chainsBalances[key as keyof typeof chainsBalances]
          const active = key === network

          if (chainData.total === 0) return null

          return (
            <div key={key}>
              <ChainBalanceStyled
                style={
                  {
                    // flexBasis: '100%',
                    // maxWidth: 230,
                  }
                }
                onClick={() => setNetwork(key as Network)}
                active={active}
              >
                <Flex flexDirection="column" style={{ gap: 16 }}>
                  <Flex alignItems="center" style={{ gap: 8 }}>
                    <img src={chainsInfo[key as keyof typeof chainsInfo].logo} alt="" height={40} />

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
            </div>
          )
        })}
      </ChainsLayout>
    </Wrapper>
  )
}
