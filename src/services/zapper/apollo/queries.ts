import { gql } from '@apollo/client'

const GlobalSearch = gql`
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
          imageUrl
          score
        }
      }
    }
  }
`

// input: { address: e[0] }
const UserDaoMembership = gql`
  query UserDaoMembership($input: UserInput!) {
    user(input: $input) {
      daoMemberships {
        id
        img
        name
        governanceTokenType
        share
        percentileShare
        governanceBaseToken {
          symbol
        }
      }
    }
  }
`

const UserAvatar = gql`
  query UserAvatar($userInput: UserInput!) {
    user(input: $userInput) {
      address
      ens
      avatarURI
      avatar {
        tokenId
        collection {
          address
          network
        }
        medias {
          ... on Image {
            url(input: { size: MEDIUM })
          }
        }
      }
    }
  }
`

const UserConnections = gql`
  query UserConnections(
    $userInput: UserInput!
    $followeesInput: UserConnectionsInput!
    $followersInput: UserConnectionsInput!
    $followedByAddress: Address!
  ) {
    user(input: $userInput) {
      address
      followedBy(address: $followedByAddress)
      followed(input: $followeesInput) {
        totalCount
        edges {
          node {
            address
            ens
            avatarURI
            socialStats {
              followersCount
            }
          }
        }
      }
      followers(input: $followersInput) {
        totalCount
        edges {
          node {
            address
            ens
            avatarURI
            socialStats {
              followersCount
            }
          }
        }
      }
    }
  }
`
// "variables":{"userInput":{"address":"0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459"},"followeesInput":{},"followersInput":{},"followedByAddress":"0x49dc443fabfb4a5c2b1ca36bf6315858688049ba"}}

const UserSocialStats = gql`
  query UserSocialStats($address: Address!) {
    user(input: { address: $address }) {
      address
      level
      xp
      ens
      socialStats {
        followersCount
        followedCount
      }
    }
  }
`

const NftNetWorth = gql`
  query NftNetWorth($addresses: [Address!]!, $network: Network) {
    nftNetWorth(addresses: $addresses, network: $network)
  }
`

const nftUsersTokens = gql`
  query NftUsersTokens(
    $owners: [Address!]!
    $network: Network
    $minEstimatedValueUsd: Float
    $collections: [Address!]
    $first: Int
    $after: String
  ) {
    nftUsersTokens(
      input: {
        owners: $owners
        network: $network
        minEstimatedValueUsd: $minEstimatedValueUsd
        collections: $collections
        first: $first
        after: $after
      }
    ) {
      edges {
        cursor
        balances {
          user {
            address
            ens
            avatarURI
            avatar {
              mediasV2 {
                ... on Image {
                  url(input: { size: THUMBNAIL })
                }
              }
            }
          }
          balance
        }
        token {
          name
          tokenId
          rarityRank
          estimatedValueEth
          lastSaleEth
          mediasV2 {
            ... on Image {
              url(input: { size: MEDIUM })
            }
          }
          collection {
            address
            name
            network
            nftStandard
            logoImageUrl
          }
        }
      }
    }
  }
`

const nftUsersCollections = gql`
  query NftUsersCollections(
    $owners: [Address!]!
    $network: Network
    $search: String
    $minCollectionValueUsd: Float
    $collections: [Address!]
    $first: Int
    $after: String
  ) {
    nftUsersCollections(
      input: {
        owners: $owners
        network: $network
        search: $search
        minCollectionValueUsd: $minCollectionValueUsd
        collections: $collections
        first: $first
        after: $after
      }
    ) {
      edges {
        cursor
        balances {
          user {
            address
            ens
            avatarURI
            avatar {
              medias {
                ... on Image {
                  url(input: { size: THUMBNAIL })
                }
              }
            }
          }
          balance
          balanceUSD
          balanceUnique
        }
        collection {
          name
          address
          network
          floorPriceEth
          logoImageUrl
          bannerImageUrl
          openseaId
        }
      }
    }
  }
`

const supportedTokenWithSiblings = gql`
  query supportedTokenWithSiblings($address: Address!, $network: Network!) {
    supportedTokenWithSiblings(input: { address: $address, network: $network }) {
      name
      address
      symbol
      network
      imgUrl
    }
  }
`

// {"query":"\n        query NftUsersCollectionsTotals(\n          $owners: [Address!]!\n          $network: Network\n          $minCollectionValueUsd: Float\n          $search: String\n          $collections: [Address!]\n        ) {\n          nftUsersCollections(\n            input: {\n              owners: $owners\n              network: $network\n              search: $search\n              minCollectionValueUsd: $minCollectionValueUsd\n              collections: $collections\n            }\n          ) {\n            totals {\n              count\n              balanceUSD\n            }\n          }\n        }\n      ","variables":{"owners":["0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459"],"minCollectionValueUsd":0,"search":"","collections":[]}}
export {
  GlobalSearch,
  UserDaoMembership,
  UserAvatar,
  UserConnections,
  UserSocialStats,
  NftNetWorth,
  nftUsersTokens,
  nftUsersCollections,
  supportedTokenWithSiblings,
}
