import React, { useMemo } from 'react'
import { InView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { Network } from 'services/zapper'
import { useGetNftUsersTokens } from 'services/zapper/hooks/useGetData'

import ETH from 'assets/images/ethereum-logo.png'
import LocalLoader from 'components/LocalLoader'
import useTheme from 'hooks/useTheme'
import { formattedNumLong } from 'utils'

import SearchNftCollections from './SearchNftCollections'
import ViewTypePicker from './ViewTypePicker'
import { BannerImageWrapper, ItemWrapper, LayoutWrapper, LogoImageWrapper, Wrapper } from './styleds'

export default function SingleView({
  activeViewType,
  setActiveViewType,
  network,
}: {
  activeViewType: 'single' | 'collection'
  setActiveViewType: (mode: 'single' | 'collection') => void
  network: keyof typeof Network
}) {
  const { address } = useParams<{ address: string }>()
  const [after, setAfter] = React.useState<string | undefined>(undefined)

  const { data, isLoading } = useGetNftUsersTokens({
    address,
    network,
    after,
  })

  const searchList = useMemo(() => {
    return data.map(item => item.token.collection)
  }, [data])

  const onSearchItemClick = (item: any) => {
    console.log('item ', item)
  }

  const theme = useTheme()

  console.log('data ', data)

  return (
    <>
      <Flex justifyContent="space-between">
        <ViewTypePicker activeViewType={activeViewType} setActiveViewType={setActiveViewType} />
        <SearchNftCollections SearchList={searchList} OnSearchItemClick={onSearchItemClick} />
      </Flex>
      <Wrapper>
        <LayoutWrapper>
          {data.map((item, index) => {
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
                    src={mediasV2[0].url}
                    alt={name}
                    onError={(e: any) => {
                      e.target.onerror = null
                      e.target.src = logoImageUrl
                    }}
                  />
                  <LogoImageWrapper>
                    <img src={logoImageUrl} alt={collectionName} />
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
