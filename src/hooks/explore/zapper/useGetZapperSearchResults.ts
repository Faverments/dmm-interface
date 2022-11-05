import { ApolloError, gql } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'

import { zapperClient } from 'apollo/ZapperClient'
import useDebounce from 'hooks/useDebounce'

enum SearchType {
  AppResult = 'AppResult',
  BaseTokenResult = 'BaseTokenResult',
  DAOResult = 'DAOResult',
  NftCollectionResult = 'NftCollectionResult',
  UserResult = 'UserResult',
}

const Search_Query = gql`
  query GlobalSearch($searchInput: SearchInput!) {
    search(input: $searchInput) {
      results {
        __typename
        ... on BaseTokenResult {
          category
          title
          imageUrl
          perNetworkInfo {
            network
            address
            marketCap
            imageUrl
          }
          symbol
          name
          marketCap
          id
          score
        }
        ... on AppResult {
          category
          title
          imageUrl
          networks
          appId
          name
          id
          score
        }
        ... on NftCollectionResult {
          category
          title
          imageUrl
          network
          address
          name
          monthlyVolume
          id
          score
        }
        ... on UserResult {
          category
          title
          imageUrl
          address
          ens
          id
          score
        }
        ... on DAOResult {
          id
          category
          title
          slug
          imageUrl
          score
        }
      }
    }
  }
`

const Search_Recommended_Query = gql`
  query SearchRecommended {
    searchRecommendations {
      results {
        __typename
        ... on AppResult {
          id
          category
          title
          imageUrl
          score
          networks
          appId
          name
        }
        ... on BaseTokenResult {
          id
          category
          title
          imageUrl
          score
          symbol
          name
          coingeckoId
          marketCap
          verified
          perNetworkInfo {
            address
            network
          }
        }
        ... on DAOResult {
          id
          category
          title
          slug
          imageUrl
          score
          treasuryAddresses
          tokenAddress
          tags
        }
        ... on NftCollectionResult {
          id
          category
          title
          imageUrl
          score
          network
          address
          name
          monthlyVolume
          openseaSlug
          nftStandard
        }
        ... on UserResult {
          id
          category
          title
          imageUrl
          score
          address
          ens
        }
      }
    }
  }
`

async function getZapperSearchResults(searchQuery: string) {
  if (!searchQuery) {
    const result = await zapperClient.query({
      query: Search_Recommended_Query,
    })
    return result
  } else {
    const result = await zapperClient.query({
      query: Search_Query,
      variables: {
        searchInput: {
          search: searchQuery,
          categories: ['BASE_TOKEN', 'USER', 'NFT_COLLECTION', 'APP', 'DAO'],
        },
      },
    })
    return result
  }
}

function formattedSearchResults(result: any, searchQuery: string) {
  let searchResult
  if (!searchQuery) {
    searchResult = result.data.searchRecommendations.results
  } else {
    searchResult = result.data.search.results
  }
  const searchFormattedResults = {
    [SearchType.AppResult]: [] as any,
    [SearchType.BaseTokenResult]: [] as any,
    [SearchType.DAOResult]: [] as any,
    [SearchType.NftCollectionResult]: [] as any,
    [SearchType.UserResult]: [] as any,
  }
  searchResult.forEach((item: any) => {
    switch (item.__typename) {
      case SearchType.AppResult:
        searchFormattedResults[SearchType.AppResult].push(item)
        break
      case SearchType.BaseTokenResult:
        searchFormattedResults[SearchType.BaseTokenResult].push(item)
        break
      case SearchType.DAOResult:
        searchFormattedResults[SearchType.DAOResult].push(item)
        break
      case SearchType.NftCollectionResult:
        searchFormattedResults[SearchType.NftCollectionResult].push(item)
        break
      case SearchType.UserResult:
        searchFormattedResults[SearchType.UserResult].push(item)
        break
      default:
        break
    }
  })
  return searchFormattedResults
}

export default function useGetZapperSearchResults(searchQuery: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApolloError>()
  const [searchResults, setSearchResults] = useState<any>()
  const debouncedQuery = useDebounce(searchQuery, 200)
  useMemo(async () => {
    setError(undefined)
    setIsLoading(true)
    const result = await getZapperSearchResults(debouncedQuery)

    setSearchResults(formattedSearchResults(result, debouncedQuery))
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
    }
  }, [debouncedQuery])
  return { searchResults, isLoading, error }
}
