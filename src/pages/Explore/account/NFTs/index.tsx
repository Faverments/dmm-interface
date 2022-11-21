import { debounce } from 'lodash'
import { position, rgba } from 'polished'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { Network } from 'services/zapper'
import { CollectionUserCollection } from 'services/zapper/apollo/types'
import { chainsInfo } from 'services/zapper/constances'
import { useGetNftUsersCollections, useGetNftUsersTokens } from 'services/zapper/hooks/useGetData'
import styled, { css, useTheme } from 'styled-components/macro'

import Modal from 'components/Modal'
import Search, { Input } from 'components/Search'

import { ChainWrapper } from '../styleds'
import ViewTypePicker from './ViewTypePicker'

const Z_INDEX = 999

const MenuFlyout = styled.div<{ showList: boolean; hasShadow?: boolean }>`
  overflow: auto;
  background-color: ${({ theme, showList }) => (showList ? theme.tabActive : theme.background)};
  border-radius: 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  /* font-size: 14px; */
  top: 48px;
  left: 0;
  right: 0;
  outline: none;
  z-index: ${Z_INDEX};
  ${({ hasShadow }) =>
    hasShadow
      ? css`
          box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.16);
          position: absolute;
        `
      : css`
          box-shadow: unset;
          position: unset;
        `};
`

const SearchWrapper = styled.div`
  position: relative;
  min-width: 400px;
`

export default function NFTs() {
  const [search, setSearch] = useState('')
  const [network, setNetwork] = useState<keyof typeof Network>('ETHEREUM_MAINNET')
  const [after, setAfter] = useState('')
  const [collectionsAddress, setCollectionsAddress] = useState<string[]>([])
  const [collections, setCollections] = useState<CollectionUserCollection[]>([])
  const [showResults, setShowResults] = useState(false)
  const [activeViewType, setActiveViewType] = useState<'single' | 'collection'>('single')
  const refInput = useRef<HTMLInputElement>(null)

  const listChainAvailable: (keyof typeof Network)[] = ['ETHEREUM_MAINNET', 'ARBITRUM_MAINNET', 'OPTIMISM_MAINNET']
  const theme = useTheme()

  // debounce updateQuery and rename it `setQuery` so it's transparent
  const setQuery = useCallback(debounce(setSearch, 100), [])

  // pass a handling helper to speed up implementation
  const onSearch = useCallback((value: any) => setQuery(value.trim()), [setQuery])
  const { address } = useParams<{ address: string }>()
  const { data: nftUserCollectionsData } = useGetNftUsersCollections({ address, network, search })
  const { data: nftUserTokensData, setData } = useGetNftUsersTokens({
    address,
    network,
    collections: collectionsAddress,
    after,
  })

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lastChild = ref.current?.lastChild
    let observer: IntersectionObserver
    if (lastChild) {
      observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setAfter(nftUserTokensData[nftUserTokensData.length - 1].cursor)
          console.log('fetch')
          observer.unobserve(lastChild as Element)
        }
      })
      observer.observe(lastChild as Element)
    }
    return () => {
      if (lastChild) {
        observer.unobserve(lastChild as Element)
      }
    }
  }, [nftUserTokensData])

  return (
    <Flex flexDirection="column" style={{ gap: 20 }}>
      <Flex>
        {listChainAvailable.map((item, index) => {
          const active = item === network
          return (
            <ChainWrapper
              key={index}
              style={
                {
                  // flexBasis: '100%',
                  // maxWidth: 230,
                }
              }
              onClick={() => setNetwork(item)}
              active={active}
            >
              <Flex alignItems="center" style={{ gap: 8 }} justifyContent="space-between">
                <Flex alignItems="center" style={{ gap: 8 }}>
                  <img src={chainsInfo[Network[item]].logo} alt="" height={24} />

                  <Text fontSize={16} fontWeight={500} color={active ? theme.textReverse : theme.text}>
                    {chainsInfo[Network[item]].name}{' '}
                  </Text>
                </Flex>
              </Flex>
            </ChainWrapper>
          )
        })}
      </Flex>

      <Flex justifyContent="space-between">
        <ViewTypePicker activeViewType={activeViewType} setActiveViewType={setActiveViewType} />
        <SearchWrapper>
          <Search
            searchValue={search}
            onSearch={onSearch}
            placeholder="Search NFTs"
            minWidth={'300px'}
            onFocus={() => {
              setShowResults(true)
            }}
            onBlur={e => {
              const relate = e.relatedTarget as HTMLDivElement
              console.log('relate ', relate)
              if (relate && relate.classList.contains('no-blur')) {
                return // press star / import icon
              }
              setShowResults(false)
            }}
          />

          {showResults && (
            <MenuFlyout showList={showResults} tabIndex={0} className="no-blur" hasShadow={true}>
              <SearchListScroll>
                <div
                  style={
                    {
                      // padding: '16px 0',
                    }
                  }
                >
                  {nftUserCollectionsData?.nftUsersCollections.edges.map((item, index) => {
                    return (
                      <SearchListWrapper
                        key={index}
                        alignItems="center"
                        onClick={() => {
                          setCollectionsAddress([item.collection.address])
                          setCollections([item.collection])
                          setShowResults(false)
                          setData([])
                        }}
                      >
                        <img
                          src={item.collection.logoImageUrl}
                          alt=""
                          height={32}
                          style={{
                            borderRadius: '50%',
                          }}
                        />

                        <Text color={theme.subText} fontSize={16} fontWeight={500}>
                          {item.collection.name}
                        </Text>
                      </SearchListWrapper>
                    )
                  })}
                  {nftUserCollectionsData?.nftUsersCollections.edges.length === 0 && (
                    <Flex justifyContent="center" alignItems="center">
                      <Text color={theme.subText} fontSize={16} fontWeight={500}>
                        No Result
                      </Text>
                    </Flex>
                  )}
                </div>
              </SearchListScroll>
            </MenuFlyout>
          )}
        </SearchWrapper>
      </Flex>

      <Flex flexWrap={'wrap'} justifyContent="flex-end" alignItems="center" style={{ gap: 20 }}>
        {collections.map((item, index) => {
          return (
            <CollectionItemWrapper
              key={index}
              onClick={() => {
                setCollections(pre => pre.filter(collection => collection.address !== item.address) || [item])
                setCollectionsAddress(pre => pre.filter(address => address !== item.address) || [item.address])
                setData([])
              }}
            >
              <img
                src={item.logoImageUrl}
                alt=""
                height={32}
                style={{
                  borderRadius: '50%',
                }}
              />

              <Text fontSize={20} fontWeight={500}>
                {item.name}
              </Text>
              <X size={18} />
            </CollectionItemWrapper>
          )
        })}
      </Flex>
      <div id="single-list" ref={ref}>
        {activeViewType === 'single' &&
          nftUserTokensData.map((item, index) => {
            return (
              <div key={index}>
                <img src={item.token.mediasV2[0].url} alt="" height={20} />
                <div>{item.token.name}</div>
              </div>
            )
          })}
      </div>

      {activeViewType === 'collection' && <></>}
    </Flex>
  )
}

const SearchListScroll = styled.div`
  max-height: 400px;
  overflow: scroll;
`
const SearchListWrapper = styled(Flex)`
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
  border-radius: 20px;
  padding: 8px 16px;
  gap: 8px;
  cursor: pointer;
`

const CollectionItemWrapper = styled(Flex)`
  color: ${({ theme }) => theme.subText};
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 4px 12px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => rgba(theme.primary, 0.1)};
  }
`
