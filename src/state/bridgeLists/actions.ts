import { createAction } from '@reduxjs/toolkit'
import { ChainId } from 'anyswap-sdk'

export const userSelectCurrency = createAction<{ chainId: ChainId; token?: any; toChainId?: any; tokenKey?: any }>(
  'bridgeLists/userSelectCurrency',
)
