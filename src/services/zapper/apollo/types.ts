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
  nftUsersCollections: { edges: Edge[] }
}

interface Edge {
  cursor: string
  balances: Balance[]
  collection: Collection
}

interface Balance {
  user: User
  balance: string
  balanceUSD: string
  balanceUnique: string
}

interface User {
  address: string
  ens: string
  avatarURI: string
  avatar: {
    medias: {
      url: string
    }[]
  }
}

interface Collection {
  name: string
  address: string
  network: keyof typeof Network
  floorPriceEth: null | string
  logoImageUrl: string
  bannerImageUrl: null | string
  openseaId: null | string
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
