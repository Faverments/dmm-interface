import { Trans } from '@lingui/macro'
import { useEffect } from 'react'
import { ExternalLink } from 'react-feather'
import { RouteComponentProps } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import styled, { useTheme } from 'styled-components/macro'

import { ButtonPrimary } from 'components/Button'
import { Arbitrum, Aurora, Avalanche, Binance, Cronos, Ethereum, Fantom, OptimismLogo, Polygon } from 'components/Icons'
import { useActiveWeb3React } from 'hooks'
import { PageWrapper, Wrapper } from 'pages/Explore/Account/styleds'
import { useToggleSearchExploreModal, useWalletModalToggle } from 'state/application/hooks'
import { useIsDarkMode } from 'state/user/hooks'

export default function DashBoard(props: RouteComponentProps<{ address: string }>) {
  const { history } = props
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const toggleSearchExploreModal = useToggleSearchExploreModal()
  useEffect(() => {
    if (account) {
      history.replace(`/account/${account.toLowerCase()}`)
    }
  }, [account, history])

  const theme = useTheme()

  const isDarkMode = useIsDarkMode()

  return (
    <>
      {!account && (
        <Wrapper>
          <PageWrapper>
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="100%"
              style={{
                padding: '160px 12px',
              }}
            >
              <Text
                as="h1"
                fontSize={['28px', '48px']}
                textAlign="center"
                lineHeight={['32px', '60px']}
                fontWeight="300"
              >
                <Trans>
                  Manage Your DeFi
                  <Text fontWeight="500" color={theme.primary} as="span">
                    DeFi
                  </Text>
                  Life
                </Trans>
              </Text>

              <Text
                color={theme.text}
                fontSize={['1rem', '1.25rem']}
                marginTop={['40px', '48px']}
                textAlign="center"
                lineHeight={1.5}
              >
                <Trans>Control your digital assets with a full suite of innovative tools.</Trans>
                <div>Invest confidently, supported by our auditing experts.</div>
              </Text>

              <SupportChain>
                <Ethereum />
                {/* <EthW /> */}
                <Polygon />
                <Binance />
                <Avalanche />
                <Fantom />
                <Cronos />
                <Arbitrum />
                {/* <Velas /> */}
                <Aurora />
                {/* <Oasis /> */}
                {/* <Bttc /> */}
                <OptimismLogo />
              </SupportChain>

              {/* <ButtonLight onClick={toggleWalletModal}>Collect Wallet</ButtonLight> */}
              <ButtonPrimary
                onClick={toggleWalletModal}
                style={{
                  marginTop: '40px',
                  maxWidth: '300px',
                }}
              >
                Collect Wallet
              </ButtonPrimary>

              <Text
                style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                }}
              >
                Or
              </Text>

              <Input
                placeholder={'Enter a valid Address or ENS ...'}
                onClick={e => {
                  e.preventDefault()
                  toggleSearchExploreModal()
                }}
                onChange={e => {
                  e.preventDefault()
                  toggleSearchExploreModal()
                }}
                value={''}
              />

              <Text
                style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  cursor: 'pointer',
                }}
                color={theme.subText}
                onClick={() => {
                  // history.push('/account/0xd874387ebb001a6b0bea98072f8de05f8965e51e')
                  history.push('/account/0xa7888f85bd76deef3bd03d4dbcf57765a49883b3')
                }}
              >
                Open With Demo Address
                <ExternalLink
                  size={16}
                  style={{
                    marginLeft: '4px',
                  }}
                />
              </Text>
            </Flex>
          </PageWrapper>
        </Wrapper>
      )}
    </>
  )
}

const SupportChain = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: 20px;
  margin: auto;
  margin-top: 48px;
`

const Input = styled.input`
  outline: none;
  border: none;
  background-color: ${({ theme }) => theme.tabActive};
  color: ${({ theme }) => theme.primary};

  width: 500px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  border-radius: 8px;
  padding: 12px 16px;

  border: 1px solid ${({ theme }) => theme.border};

  ::placeholder {
    color: ${({ theme }) => theme.subText};
  }

  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary};
  }
  @media screen and (max-width: 568px) {
    width: 100%;
  }
`
