import { rgba } from 'polished'
import Skeleton from 'react-loading-skeleton'
import { useHistory, useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { ALL_NETWORKS, Network } from 'services/zapper'
import { useGetNftUsersCollectionsNormal } from 'services/zapper/hooks/useGetData'
import useGetNftUsersCollectionsTotals from 'services/zapper/hooks/useGetZapperNftUsersCollectionsTotals'
import styled from 'styled-components/macro'

import ETH from 'assets/images/ethereum-logo.png'
import { ButtonLight } from 'components/Button'
import { AutoColumn } from 'components/Column'
import useTheme from 'hooks/useTheme'
import { formattedNumLong, toKInChart } from 'utils'

import { AccountTabs } from '../..'
import { SideTitle, SideWrapper } from '../../styleds'

const getNetworkKey = (value: string) => {
  const key = Object.keys(Network).find(key => Network[key as keyof typeof Network] === value)
  return key
}

export default function Nfts({ network }: { network: Network | ALL_NETWORKS }) {
  const { address } = useParams<{ address: string }>()
  const { nftUsersCollectionsTotals, isLoading: isNftsTotalsLoading } = useGetNftUsersCollectionsTotals(
    address,
    network === 'all-networks' ? undefined : getNetworkKey(network),
  )

  const { data, isLoading: isNftTokensLoading } = useGetNftUsersCollectionsNormal({
    address,
    network: (getNetworkKey(network) || 'ETHEREUM_MAINNET') as any,
    first: 6,
  })

  const history = useHistory()

  const theme = useTheme()
  return (
    <SideWrapper>
      <AutoColumn gap="8px">
        <SideTitle>
          <Flex justifyContent={'space-between'} alignItems="center">
            <span>
              NFTs :{' '}
              {isNftsTotalsLoading ? (
                <Skeleton baseColor={theme.background} width={80} />
              ) : (
                formattedNumLong(Number(nftUsersCollectionsTotals?.nftUsersCollections.totals.balanceUSD), true)
              )}
            </span>
            <ButtonLight
              onClick={() => {
                history.push({ search: '?tab=' + AccountTabs.NFTS })
              }}
              minWidth="fit-content"
              width="fit-content"
              height="100%"
              padding="6px 12px"
              borderRadius="20px"
              margin="0 0 0 12px"
              style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
            >
              view all
            </ButtonLight>
          </Flex>
        </SideTitle>
      </AutoColumn>

      {data.length === 0 && !isNftTokensLoading && (
        <Flex justifyContent={'center'} alignItems="center">
          <Text fontSize={18} color={theme.subText} fontWeight={500}>
            No Result
          </Text>
        </Flex>
      )}

      <LayoutWrapper>
        {data.map((item, index) => {
          const {
            collection: { bannerImageUrl, logoImageUrl, name, floorPriceEth },
            balances,
          } = item
          const { balanceUSD } = balances[0]
          return (
            <ItemWrapper key={index}>
              <BannerImageWrapper>
                <img src={bannerImageUrl ? bannerImageUrl : logoImageUrl} alt={name} />
                <LogoImageWrapper>
                  <img src={logoImageUrl} alt={name} />
                </LogoImageWrapper>
              </BannerImageWrapper>
              <Text
                color={theme.text}
                fontWeight={400}
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  maxWidth: '120px',
                }}
              >
                {name}
              </Text>
              <Flex justifyContent="space-between">
                <Flex flexDirection="column" style={{ gap: 8 }}>
                  <Text color={theme.subText} fontSize={13}>
                    Floor Price
                  </Text>
                  <Flex style={{ gap: 4 }}>
                    <img src={ETH} alt="ETH" height={16} width={16} />
                    <Text fontSize={13}>{floorPriceEth ? formattedNumLong(Number(floorPriceEth)) : ''}</Text>
                  </Flex>
                </Flex>
                <Flex flexDirection="column" style={{ gap: 8 }}>
                  <Text color={theme.subText} fontSize={13}>
                    Est. Value
                  </Text>
                  <Text fontSize={13}>{toKInChart(balanceUSD)}</Text>
                </Flex>
              </Flex>
            </ItemWrapper>
          )
        })}
      </LayoutWrapper>
    </SideWrapper>
  )
}

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`
const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${rgba(theme.border, 0.1)}`};
`
const BannerImageWrapper = styled.div`
  width: 100%;
  height: 128px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    &:hover {
      transform: scale(1.1);
      transition-duration: 0.5s;
    }
  }
`
const LogoImageWrapper = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    &:hover {
      transform: rotate(360deg);
      transition-duration: 0.5s;
    }
  }
`
