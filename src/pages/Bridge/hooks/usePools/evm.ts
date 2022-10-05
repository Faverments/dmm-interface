import { ExternalProvider } from '@ethersproject/providers'
import { ChainId } from '@kyberswap/ks-sdk-core'
import { useCallback, useMemo } from 'react'

import ERC20_INTERFACE from 'constants/abis/erc20'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'

import { TokenListAddress } from '.'
import { useBatchData } from '../../utils/useBatchData'

interface CallDetails {
  callData: string
  target: string
  label: string
  fragment: string
  key: string
}

export function useEvmPoolDatas() {
  const getEvmPoolsDatas = useCallback(
    (chainId: ChainId, tokenListAddress: TokenListAddress, account?: string, provider?: ExternalProvider) => {
      return new Promise((resolve, reject) => {
        const calls: CallDetails[] = []
        for (const item of tokenListAddress) {
          calls.push({
            callData: ERC20_INTERFACE.encodeFunctionData('balanceOf', [item.anyTokenAddress]),
            target: item.underlyingAddress,
            label: 'balanceOf',
            fragment: 'balanceOf',
            key: item.anyTokenAddress,
          })
          calls.push({
            callData: ERC20_INTERFACE.encodeFunctionData('totalSupply', []),
            target: item.anyTokenAddress,
            label: 'totalSupply',
            fragment: 'totalSupply',
            key: item.anyTokenAddress,
          })
          if (isAddress(account)) {
            calls.push({
              callData: ERC20_INTERFACE.encodeFunctionData('balanceOf', [account]),
              target: item.anyTokenAddress,
              label: 'balance',
              fragment: 'balanceOf',
              key: item.anyTokenAddress,
            })
          }
        }
        if (calls.length > 0 && chainId) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useBatchData({ chainId, calls, provider }).then(res => {
            const resultList: any = {}
            if (res) {
              try {
                for (let i = 0; i < calls.length; i++) {
                  const item = calls[i]
                  if (res[i]) {
                    const bl =
                      res[i] === '0x' ? '' : ERC20_INTERFACE?.decodeFunctionResult(item.fragment, res[i])?.toString()
                    if (!resultList[item.key]) resultList[item.key] = {}
                    resultList[item.key][item.label] = bl
                  }
                }
              } catch (error) {
                console.log(error)
              }
            }
            resolve(resultList)
          })
        } else {
          resolve({})
        }
      })
    },
    [],
  )
  return {
    getEvmPoolsDatas,
  }
}

export function useEvmPools({
  account,
  tokenListAddress,
  chainId,
}: {
  account: string
  tokenListAddress: TokenListAddress
  chainId: ChainId
}) {
  const { library, chainId: currentChainId } = useActiveWeb3React()
  const { getEvmPoolsDatas } = useEvmPoolDatas()
  const getEvmPoolsData = useCallback(() => {
    return new Promise(resolve => {
      if (chainId) {
        const provider =
          currentChainId?.toString() === chainId.toString() && library?.provider ? library?.provider : undefined
        getEvmPoolsDatas(chainId, tokenListAddress, account, provider).then(res => {
          resolve(res)
        })
      }
    })
  }, [account, currentChainId, chainId, tokenListAddress, getEvmPoolsDatas])
  return { getEvmPoolsData }
}

export function useEvmPool(chainId: ChainId, account: string, anyTokenAddress: string, underlyingAddress: string) {
  const tokenListAddress = useMemo(() => {
    if (anyTokenAddress && underlyingAddress) {
      return [{ anyTokenAddress, underlyingAddress }]
    }
    return []
  }, [anyTokenAddress, underlyingAddress])

  const { getEvmPoolsData } = useEvmPools({ account, tokenListAddress, chainId })

  return { getEvmPoolsData }
}
