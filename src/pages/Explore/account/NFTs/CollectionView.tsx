import { useEffect, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { Network } from 'services/zapper'
import { CollectionUserCollection } from 'services/zapper/apollo/types'
import { useGetNftUsersCollectionsSwrInfinite } from 'services/zapper/hooks/useGetData'

import ETH from 'assets/images/ethereum-logo.png'
import LocalLoader from 'components/LocalLoader'
import useTheme from 'hooks/useTheme'
import { formattedNumLong, toKInChart } from 'utils'

import NotFound from '../components/NotFound'
import FilterCollections from './components/FilterCollections'
import { ListChain } from './components/ListChain'
import SearchNftCollections from './components/SearchNftCollections'
import ViewTypePicker from './components/ViewTypePicker'
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
  const [collectionsAddress, setCollectionsAddress] = useState<string[]>([])
  const [collections, setCollections] = useState<CollectionUserCollection[]>([])
  const [searchList, setSearchList] = useState<CollectionUserCollection[]>([])

  const onSearchItemClick = (item: any) => {
    item as CollectionUserCollection
    setCollectionsAddress(pre => [...pre, item.address])
    setCollections(pre => [...pre, item])
  }

  const onFilterCollectionClick = (item: any, index: number) => {
    function set(item: CollectionUserCollection) {
      setCollections(pre => pre.filter(collection => collection.address !== item.address) || [item])
      setCollectionsAddress(pre => pre.filter(address => address !== item.address) || [item.address])
    }
    set(item)
  }

  const theme = useTheme()

  const t = useGetNftUsersCollectionsSwrInfinite({
    address,
    network,
    collections: collectionsAddress,
  })

  const { data: infiniteData, size, setSize, isLoadingMore, isReachingEnd } = t

  useEffect(() => {
    if (collectionsAddress.length === 0) {
      const res = infiniteData.map(item => item.collection)
      setSearchList(res)
    }
  }, [infiniteData, collectionsAddress])

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
        <SearchNftCollections
          SearchList={searchList}
          OnSearchItemClick={onSearchItemClick}
          activeView={activeViewType}
        />
      </Flex>

      <FilterCollections collections={collections} onFilterCollectionClick={onFilterCollectionClick} />

      <Wrapper>
        {infiniteData.length === 0 && !isLoadingMore && <NotFound text={'Nothing to see here!'} />}
        <LayoutWrapper>
          {infiniteData.map((item, index) => {
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
        {infiniteData.length > 0 && (
          <InView
            onChange={inView => {
              if (inView && !isReachingEnd) {
                setSize(size + 1)
              }
            }}
          />
        )}
        {isLoadingMore && <LocalLoader />}
      </Wrapper>
    </>
  )
}
