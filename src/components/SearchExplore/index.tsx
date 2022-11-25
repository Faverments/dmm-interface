import { Trans, t } from '@lingui/macro'
import ReactBlockies from '@vukhaihoan/react-blockies'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'react-feather'
import { Link } from 'react-router-dom'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import useGetZapperSearchResults from 'services/zapper/hooks/useGetZapperSearchResults'
import styled, { useTheme } from 'styled-components'

import Column, { AutoColumn } from 'components/Column'
import InfoHelper from 'components/InfoHelper'
import LocalLoader from 'components/LocalLoader'
import Modal from 'components/Modal'
import { RowBetween } from 'components/Row'
import { NoResult } from 'components/SearchModal/CurrencySearch'
import { SearchIcon, SearchInput, SearchWrapper } from 'components/SearchModal/styleds'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleSearchExploreModal } from 'state/application/hooks'
import { CloseIcon } from 'theme'
import getShortenAddress from 'utils/getShortenAddress'

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
const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

const ContentWrapper = styled(Column)`
  width: 558px;
  flex: 1 1;
  position: relative;
  padding-bottom: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-bottom: 0px;
  `};
`

const StyledLink = styled(Link)`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.buttonBlack};
  border: 1px solid transparent;

  min-width: fit-content;
  color: ${({ theme }) => theme.subText};
  text-decoration: none;

  /* :not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.border};
  } */
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function SearchExplore() {
  const searchExploreModalOpen = useModalOpen(ApplicationModal.SEARCH_EXPLORE)
  const toggleSearchExploreModal = useToggleSearchExploreModal()
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value)
  }
  const { searchResults, isLoading, error } = useGetZapperSearchResults(searchQuery)

  const userResult = useMemo(() => (searchResults ? searchResults.UserResult : []), [searchResults])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>(null)

  // clear the input on open
  useEffect(() => {
    if (searchExploreModalOpen) {
      setSearchQuery('')
      inputRef.current?.focus()
    }
  }, [searchExploreModalOpen])

  const theme = useTheme()

  const above768 = useMedia('(min-width: 768px)')

  return (
    <StyledSearchButton onClick={() => toggleSearchExploreModal()}>
      <Search size={20} />
      <Modal isOpen={searchExploreModalOpen} onDismiss={toggleSearchExploreModal} minHeight={52} maxWidth="558px">
        <ContentWrapper>
          <PaddedColumn gap="14px">
            <RowBetween>
              <Text fontWeight={500} fontSize={20} display="flex">
                <Trans>Explore Account</Trans>
                <InfoHelper
                  size={16}
                  text={<Trans>Explore any wallet by searching for its address or ENS domain below</Trans>}
                />
              </Text>
              <CloseIcon onClick={toggleSearchExploreModal} />
            </RowBetween>

            <Text style={{ color: theme.subText, fontSize: 12 }}>
              <Trans>
                You can search and select <span style={{ color: theme.text }}> Any EVM Wallet</span>
              </Trans>
            </Text>

            <SearchWrapper>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={t`Search by wallet address or ENS domain`}
                value={searchQuery}
                ref={inputRef}
                onChange={handleSearch}
                // onKeyDown={handleEnter}
                autoComplete="off"
              />
              <SearchIcon size={18} color={theme.border} />
            </SearchWrapper>
            {
              isLoading ? (
                <LocalLoader />
              ) : error ? (
                <NoResult />
              ) : userResult.length > 0 ? (
                userResult.map(item => (
                  <StyledLink to={`/account/${item.address}`} key={item.address}>
                    <Flex style={{ gap: 10 }}>
                      {item.imageUrl ? (
                        <div>
                          <img src={item.imageUrl} alt="logo" style={{ width: 60, height: 60, borderRadius: '25%' }} />
                        </div>
                      ) : (
                        <ReactBlockies
                          seed={item.address}
                          size={12}
                          scale={5}
                          style={{
                            borderRadius: '25%',
                          }}
                        />
                      )}
                      <Flex flexDirection="column" style={{ gap: 5 }}>
                        <Text fontSize={18} color={theme.text}>
                          {item.ens ? item.ens : getShortenAddress(item.address)}
                        </Text>
                        <Flex>
                          <Text fontSize={16} color={theme.subText}>
                            {above768 ? item.address : getShortenAddress(item.address)}
                          </Text>

                          {/* <CenterDiv>
                            <Copy toCopy={item.address} />
                          </CenterDiv> */}
                        </Flex>
                      </Flex>
                    </Flex>
                  </StyledLink>
                ))
              ) : (
                <NoResult />
              )
              // (
              //   <Flex flexDirection="column">
              //     {searchResults?.UserResult.length > 0 && (
              //       <Text fontSize={20} fontWeight={500}>
              //         User
              //       </Text>
              //     )}
              //     {searchResults?.UserResult?.map((item: any) => (
              //       <Link key={item.id} to={`/account/${item.address}`}>
              //         <Text fontSize={14}>{item.address}</Text>
              //       </Link>
              //     ))}
              //     {searchResults?.AppResult.length > 0 && (
              //       <Text fontSize={20} fontWeight={500}>
              //         App
              //       </Text>
              //     )}
              //     {searchResults?.AppResult?.map((item: any) => (
              //       <Text fontSize={14} key={item.id}>
              //         {item.name}
              //       </Text>
              //     ))}
              //     {searchResults?.BaseTokenResult.length > 0 && (
              //       <Text fontSize={20} fontWeight={500}>
              //         BaseToken
              //       </Text>
              //     )}
              //     {searchResults?.BaseTokenResult?.map((item: any) => (
              //       <Text fontSize={14} key={item.id}>
              //         {item.name}
              //       </Text>
              //     ))}
              //     {searchResults?.DAOResult.length > 0 && (
              //       <Text fontSize={20} fontWeight={500}>
              //         DAO
              //       </Text>
              //     )}
              //     {searchResults?.DAOResult?.map((item: any) => (
              //       <Text fontSize={14} key={item.id}>
              //         {item.title}
              //       </Text>
              //     ))}
              //     {searchResults?.NftCollectionResult.length > 0 && (
              //       <Text fontSize={20} fontWeight={500}>
              //         NftCollection
              //       </Text>
              //     )}
              //     {searchResults?.NftCollectionResult?.map((item: any) => (
              //       <Text fontSize={14} key={item.id}>
              //         {item.name}
              //       </Text>
              //     ))}
              //   </Flex>
              // )
            }
          </PaddedColumn>
        </ContentWrapper>
      </Modal>
    </StyledSearchButton>
  )
}
