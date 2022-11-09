import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { Search, X } from 'react-feather'
import { Link } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import useGetZapperSearchResults from 'services/zapper/hooks/useGetZapperSearchResults'
import styled from 'styled-components'

import Modal from 'components/Modal'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleSearchExploreModal } from 'state/application/hooks'

const StyledSearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  height: 40px;
  padding-left: 9px;
  padding-right: 9px;

  background-color: ${({ theme }) => theme.buttonBlack};
  color: ${({ theme }) => theme.text};
  border: 1px solid transparent;
  &:hover {
    text-decoration: none;
    border: 1px solid ${({ theme }) => theme.primary};
    cursor: pointer;
  }
`
const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
`

const Input = styled.input`
  outline: none;
  border: none;
  flex: 1;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.buttonBlack};

  :placeholder {
    color: ${({ theme }) => theme.disableText};
  }
`

export default function SearchExplore() {
  const searchExploreModalOpen = useModalOpen(ApplicationModal.SEARCH_EXPLORE)
  const toggleSearchExploreModal = useToggleSearchExploreModal()
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value)
  }
  const { searchResults, isLoading, error } = useGetZapperSearchResults(searchQuery)
  return (
    <StyledSearchButton onClick={() => toggleSearchExploreModal()}>
      <Search size={20} />
      <Modal
        isOpen={searchExploreModalOpen}
        onDismiss={toggleSearchExploreModal}
        //  bgColor={'transparent'}
        maxWidth={800}
      >
        <Wrapper>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontWeight="500" fontSize={20}>
              <Trans>Search and Explore</Trans>
            </Text>

            <Flex sx={{ cursor: 'pointer' }} role="button" onClick={toggleSearchExploreModal}>
              <X />
            </Flex>
          </Flex>

          <Input type="text" placeholder="Search" onChange={handleSearch} />
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <Flex flexDirection="column">
              {searchResults?.UserResult.length > 0 && (
                <Text fontSize={20} fontWeight={500}>
                  User
                </Text>
              )}
              {searchResults?.UserResult?.map((item: any) => (
                <Link key={item.id} to={`/account/${item.address}`}>
                  <Text fontSize={14}>{item.address}</Text>
                </Link>
              ))}
              {searchResults?.AppResult.length > 0 && (
                <Text fontSize={20} fontWeight={500}>
                  App
                </Text>
              )}
              {searchResults?.AppResult?.map((item: any) => (
                <Text fontSize={14} key={item.id}>
                  {item.name}
                </Text>
              ))}
              {searchResults?.BaseTokenResult.length > 0 && (
                <Text fontSize={20} fontWeight={500}>
                  BaseToken
                </Text>
              )}
              {searchResults?.BaseTokenResult?.map((item: any) => (
                <Text fontSize={14} key={item.id}>
                  {item.name}
                </Text>
              ))}
              {searchResults?.DAOResult.length > 0 && (
                <Text fontSize={20} fontWeight={500}>
                  DAO
                </Text>
              )}
              {searchResults?.DAOResult?.map((item: any) => (
                <Text fontSize={14} key={item.id}>
                  {item.title}
                </Text>
              ))}
              {searchResults?.NftCollectionResult.length > 0 && (
                <Text fontSize={20} fontWeight={500}>
                  NftCollection
                </Text>
              )}
              {searchResults?.NftCollectionResult?.map((item: any) => (
                <Text fontSize={14} key={item.id}>
                  {item.name}
                </Text>
              ))}
            </Flex>
          )}
        </Wrapper>
      </Modal>
    </StyledSearchButton>
  )
}
