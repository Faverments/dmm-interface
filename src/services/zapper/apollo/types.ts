import { Network } from '../types/models'

export interface UserAvatarResponse {
  user: {
    avatarURI: string | null
    avatar: {
      tokenId: string
      collection: {
        address: string
        network: string
      }
      medias: { url: string }[]
    }
  }
}

export interface NftUsersCollections {
  nftUsersCollections: { edges: EdgeUserCollection[] }
}

interface EdgeUserCollection {
  cursor: string
  balances: BalanceCollection[]
  collection: CollectionUserCollection
}

interface BalanceCollection {
  user: UserCollection
  balance: string
  balanceUSD: string
  balanceUnique: string
}

interface UserCollection {
  address: string
  ens: string
  avatarURI: string
  avatar: {
    medias: {
      url: string
    }[]
  }
}

export interface CollectionUserCollection {
  name: string
  address: string
  network: keyof typeof Network
  floorPriceEth: null | string
  logoImageUrl: string
  bannerImageUrl: null | string
  openseaId: null | string
}

export interface NftUsersTokens {
  nftUsersTokens: {
    edges: EdgeUserToken[]
  }
}

export interface EdgeUserToken {
  cursor: string
  balances: Balance[]
  token: Token
}

interface Balance {
  user: User
  balance: string
}

interface User {
  address: string
  ens: null
  avatarURI: null
  avatar: {
    mediasV2: {
      url: string
    }[]
  }
}

interface Token {
  name: string
  tokenId: string
  rarityRank: number | null
  estimatedValueEth: null | string
  lastSaleEth: null | string
  mediasV2: {
    url: string
  }[]
  collection: CollectionUserToken
}

interface CollectionUserToken {
  address: string
  name: string
  network: string
  nftStandard: string
  logoImageUrl: string
}

export interface SearchRecommendations {
  // this time only support user search
  UserResult: {
    id: string
    category: string
    title: string
    imageUrl: string
    score: number | null
    address: string
    ens: string | null
    __typename: string
  }[]
}
