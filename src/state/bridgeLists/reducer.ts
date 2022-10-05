import { createReducer } from '@reduxjs/toolkit'

import { userSelectCurrency } from './actions'

export interface BridgeListsState {
  readonly userSelectCurrency: {
    readonly [chainId: string]: {
      readonly token: string | null
      readonly toChainId: string | null
      readonly tokenKey: string | null
    }
  }
}

const initialState: BridgeListsState = {
  userSelectCurrency: {},
}

export default createReducer<BridgeListsState>(initialState, builder =>
  builder.addCase(userSelectCurrency, (state, { payload: { chainId, token, toChainId, tokenKey } }) => {
    if (chainId) {
      if (!state.userSelectCurrency) state.userSelectCurrency = {}
      if (!state.userSelectCurrency[chainId])
        state.userSelectCurrency[chainId] = {
          token: '',
          toChainId: '',
          tokenKey: '',
        }
      if (token) {
        state.userSelectCurrency[chainId].token = token
      }
      if (toChainId) {
        state.userSelectCurrency[chainId].toChainId = toChainId
      }
      if (tokenKey) {
        state.userSelectCurrency[chainId].tokenKey = tokenKey
      }
    }
  }),
)
