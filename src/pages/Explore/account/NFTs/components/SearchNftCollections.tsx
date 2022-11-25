import { debounce } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import { Flex, Text } from 'rebass'
import { CollectionUserCollection, CollectionUserToken } from 'services/zapper/apollo/types'
import styled, { css, useTheme } from 'styled-components/macro'

import Search from 'components/Search'

export default function SearchNftCollections({
  activeView,
  SearchList,
  OnSearchItemClick,
}: {
  activeView: 'single' | 'collection'
  SearchList: CollectionUserCollection[] | CollectionUserToken[]
  OnSearchItemClick: (item: CollectionUserCollection | CollectionUserToken) => void
}) {
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)

  const setQuery = useCallback(debounce(setSearch, 100), [])
  const onSearch = useCallback((value: any) => setQuery(value.trim()), [setQuery])
  const theme = useTheme()

  const filteredList = useMemo(() => {
    if (activeView === 'single') {
      const res = (SearchList as CollectionUserToken[]).filter((item, index, seft) => {
        return seft.findIndex(i => i.address === item.address) === index
      })
      return res
    }
    return SearchList
  }, [SearchList, activeView])

  return (
    <SearchWrapper>
      <Search
        searchValue={search}
        onSearch={onSearch}
        placeholder="Filter by Collection"
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
            {filteredList.map((item, index) => {
              return (
                <SearchListWrapper
                  key={index}
                  onClick={() => {
                    setShowResults(false)
                    OnSearchItemClick(item)
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

                  <Text color={theme.subText} fontSize={16} fontWeight={500}>
                    {item.name}
                  </Text>
                </SearchListWrapper>
              )
            })}
          </SearchListScroll>
        </MenuFlyout>
      )}
    </SearchWrapper>
  )
}

const SearchWrapper = styled.div`
  position: relative;
  min-width: 400px;
`

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

const SearchListScroll = styled.div`
  max-height: 400px;
  overflow: scroll;
`
const SearchListWrapper = styled(Flex)`
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
  align-items: center;
  border-radius: 20px;
  padding: 8px 16px;
  gap: 8px;
  cursor: pointer;
`
