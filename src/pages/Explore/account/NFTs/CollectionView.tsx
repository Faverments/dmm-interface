import React, { useMemo, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { Network } from 'services/zapper'
import { useGetNftUsersCollections } from 'services/zapper/hooks/useGetData'

import ETH from 'assets/images/ethereum-logo.png'
import LocalLoader from 'components/LocalLoader'
import useTheme from 'hooks/useTheme'
import { formattedNumLong, toKInChart } from 'utils'

import SearchNftCollections from './SearchNftCollections'
import ViewTypePicker from './ViewTypePicker'
import { ListChain } from './index'
import { BannerImageWrapper, ItemWrapper, LayoutWrapper, LogoImageWrapper, Wrapper } from './styleds'

export default function CollectionView({
  activeViewType,
  setActiveViewType,
}: {
  activeViewType: 'single' | 'collection'
  setActiveViewType: (mode: 'single' | 'collection') => void
}) {
  const [network, setNetwork] = useState<keyof typeof Network>('ETHEREUM_MAINNET')
  const { address } = useParams<{ address: string }>()
  const [after, setAfter] = useState<string | undefined>(undefined)

  const { data, isLoading } = useGetNftUsersCollections({
    address,
    network,
    after,
  })

  const searchList = useMemo(() => {
    return data.map(item => item.collection)
  }, [data])

  const onSearchItemClick = (item: any) => {
    console.log('item ', item)
  }

  const theme = useTheme()

  return (
    <>
      <ListChain
        network={network}
        setNetwork={setNetwork}
        onNetworkChange={i => {
          console.log(i)
        }}
      />
      <Flex justifyContent="space-between">
        <ViewTypePicker activeViewType={activeViewType} setActiveViewType={setActiveViewType} />
        <SearchNftCollections SearchList={searchList} OnSearchItemClick={onSearchItemClick} />
      </Flex>
      <Wrapper>
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
                  z
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
                    maxWidth: '180px',
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
        {data.length > 0 && (
          <InView
            onChange={inView => {
              if (inView) {
                setAfter(data[data.length - 1].cursor)
              }
            }}
          />
        )}
        {isLoading && <LocalLoader />}
      </Wrapper>
    </>
  )
}
