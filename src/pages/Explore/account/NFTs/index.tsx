import { debounce } from 'lodash'
import React, { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { Network } from 'services/zapper'
import { chainsInfo } from 'services/zapper/constances'
import { useGetNftUsersCollections } from 'services/zapper/hooks/useGetData'
import styled, { css, useTheme } from 'styled-components/macro'

import Modal from 'components/Modal'
import Search, { Input } from 'components/Search'

import { ChainWrapper } from '../styleds'

const Z_INDEX = 999

const MenuFlyout = styled.div<{ showList: boolean; hasShadow?: boolean }>`
  overflow: auto;
  background-color: ${({ theme, showList }) => (showList ? theme.tabActive : theme.background)};
  border-radius: 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  top: 500px;
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

export default function NFTs() {
  const [search, setSearch] = useState('')
  const [network, setNetwork] = useState<keyof typeof Network>('ETHEREUM_MAINNET')
  const [showResults, setShowResults] = useState(false)
  const refInput = useRef<HTMLInputElement>(null)

  const listChainAvailable: (keyof typeof Network)[] = ['ETHEREUM_MAINNET', 'ARBITRUM_MAINNET', 'OPTIMISM_MAINNET']
  const theme = useTheme()

  // debounce updateQuery and rename it `setQuery` so it's transparent
  const setQuery = useCallback(debounce(setSearch, 100), [])

  // pass a handling helper to speed up implementation
  const onSearch = useCallback((value: any) => setQuery(value.trim()), [setQuery])
  const { address } = useParams<{ address: string }>()
  const { data } = useGetNftUsersCollections({ address, network, search })
  console.log('nft ', data)

  return (
    <div>
      NFTs
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
      <div>
        <Search
          searchValue={search}
          onSearch={onSearch}
          placeholder="Search NFTs"
          minWidth={'100'}
          onFocus={() => {
            setShowResults(true)
          }}
        />

        <Modal
          isOpen={showResults}
          onDismiss={() => {
            setShowResults(false)
          }}
        >
          {showResults && (
            <MenuFlyout showList={showResults} tabIndex={0} className="no-blur" hasShadow={true}>
              <div>
                {data?.nftUsersCollections.edges.map((item, index) => {
                  return (
                    <div key={index}>
                      <img src={item.collection.logoImageUrl} alt="" height={20} />
                    </div>
                  )
                })}
              </div>
            </MenuFlyout>
          )}
        </Modal>
      </div>
    </div>
  )
}
