import { rgba } from 'polished'
import React from 'react'
import { X } from 'react-feather'
import { Flex, Text } from 'rebass'
import { CollectionUserCollection, CollectionUserToken } from 'services/zapper/apollo/types'
import styled from 'styled-components'

export default function FilterCollections({
  collections,
  onFilterCollectionClick,
}: {
  collections: CollectionUserToken[] | CollectionUserCollection[]
  onFilterCollectionClick: (collection: CollectionUserToken | CollectionUserCollection, index: number) => void
}) {
  return (
    <Flex flexWrap={'wrap'} justifyContent="flex-end" alignItems="center" style={{ gap: 20 }}>
      {collections.map((item, index: number) => {
        return (
          <CollectionItemWrapper
            key={index}
            onClick={() => {
              onFilterCollectionClick(item, index)
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
  )
}

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
