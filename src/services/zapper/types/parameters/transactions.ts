import { Network } from '../models'

export type TransactionsParam = {
  network?: Network
} & (
  | {
      addresses: string[]
      address?: never
    }
  | {
      addresses?: never
      address: string
    }
)
