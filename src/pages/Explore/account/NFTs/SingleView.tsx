import { useEffect, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { Network } from 'services/zapper'
import { CollectionUserToken } from 'services/zapper/apollo/types'
import { useGetNftUsersTokensSwrInfinite } from 'services/zapper/hooks/useGetData'

import DefaultIcon from 'assets/images/default-icon.png'
import ETH from 'assets/images/ethereum-logo.png'
import LocalLoader from 'components/LocalLoader'
import useTheme from 'hooks/useTheme'
import { formattedNumLong } from 'utils'

import NotFound from '../components/NotFound'
import FilterCollections from './components/FilterCollections'
import { ListChain } from './components/ListChain'
import SearchNftCollections from './components/SearchNftCollections'
import ViewTypePicker from './components/ViewTypePicker'
import { BannerImageWrapper, ItemWrapper, LayoutWrapper, LogoImageWrapper, Wrapper } from './styleds'

export default function SingleView({
  activeViewType,
  setActiveViewType,
}: {
  activeViewType: 'single' | 'collection'
  setActiveViewType: (mode: 'single' | 'collection') => void
}) {
  const [network, setNetwork] = useState<keyof typeof Network>('ETHEREUM_MAINNET')
  const { address } = useParams<{ address: string }>()
  const [collectionsAddress, setCollectionsAddress] = useState<string[]>([])
  const [collections, setCollections] = useState<CollectionUserToken[]>([])
  const [searchList, setSearchList] = useState<CollectionUserToken[]>([])

  const onSearchItemClick = (item: any) => {
    item as CollectionUserToken
    setCollectionsAddress(pre => [...pre, item.address])
    setCollections(pre => [...pre, item])
  }

  const onFilterCollectionClick = (item: any, index: number) => {
    function set(item: CollectionUserToken) {
      setCollections(pre => pre.filter(collection => collection.address !== item.address) || [item])
      setCollectionsAddress(pre => pre.filter(address => address !== item.address) || [item.address])
    }
    set(item)
  }

  const theme = useTheme()

  const t = useGetNftUsersTokensSwrInfinite({
    address,
    network,
    collections: collectionsAddress,
  })

  const { data: infiniteData, size, setSize, isLoadingMore, isReachingEnd } = t
  useEffect(() => {
    if (collectionsAddress.length === 0) {
      const res = infiniteData.map(item => item.token.collection)
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
              token: {
                mediasV2,
                name,
                collection: { logoImageUrl, name: collectionName },
                estimatedValueEth,
              },
            } = item
            return (
              <ItemWrapper key={index}>
                <BannerImageWrapper>
                  <img
                    src={mediasV2[0].url || logoImageUrl || DefaultIcon}
                    alt={name}
                    onError={(e: any) => {
                      e.target.onerror = null
                      e.target.src = logoImageUrl || DefaultIcon
                    }}
                  />
                  <LogoImageWrapper>
                    <img
                      src={logoImageUrl || DefaultIcon}
                      alt={collectionName}
                      onError={(e: any) => {
                        e.target.onerror = null
                        e.target.src = DefaultIcon
                      }}
                    />
                  </LogoImageWrapper>
                </BannerImageWrapper>
                <Flex flexDirection="column" style={{ gap: 16 }}>
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
                  <Flex flexDirection="column" style={{ gap: 4 }}>
                    <Text color={theme.subText} fontSize={13}>
                      Est. Value
                    </Text>
                    <Flex style={{ gap: 4 }}>
                      <img src={ETH} alt="ETH" height={16} width={16} />
                      <Text fontSize={13}>{estimatedValueEth ? formattedNumLong(Number(estimatedValueEth)) : ''}</Text>
                    </Flex>
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
