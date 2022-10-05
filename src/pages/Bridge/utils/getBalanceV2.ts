import ERC20_INTERFACE from 'constants/abis/erc20'
import { isAddress } from 'utils'

import { fromWei, getLocalConfig, setLocalConfig } from './tools'
import { getContract, useWeb3 } from './web3UtilsV2'

const DESTBALANCE = 'DESTBALANCE'

const contract = getContract()

export function getNodeBalance(account?: any, token?: string, chainID?: any, dec?: any, isNativeToken?: boolean) {
  return new Promise(resolve => {
    if (account && token && chainID && !isNaN(chainID)) {
      const tokenKey = isNativeToken ? 'NATIVE' + token : token
      const lObj = getLocalConfig(account, tokenKey, chainID, DESTBALANCE, 1000 * 10)
      if (lObj && lObj.balance) {
        resolve(fromWei(lObj.balance, dec))
      } else {
        if (isNativeToken || !isAddress(token)) {
          useWeb3(chainID, 'eth', 'getBalance', [account]).then((res: any) => {
            // console.log(res)
            if (res && res.toString().indexOf('Error: Returned error') === -1) {
              const bl = res
              setLocalConfig(account, tokenKey, chainID, DESTBALANCE, { balance: bl })
              resolve(fromWei(bl, dec))
            } else {
              resolve('')
            }
          })
        } else {
          contract.options.address = token
          const data = contract.methods.balanceOf(account).encodeABI()
          useWeb3(chainID, 'eth', 'call', [{ data, to: token }]).then((res: any) => {
            // console.log(res)
            if (res && res.toString().indexOf('Error: Returned error') === -1) {
              try {
                const bl = ERC20_INTERFACE?.decodeFunctionResult('balanceOf', res)?.toString()
                setLocalConfig(account, tokenKey, chainID, DESTBALANCE, { balance: bl })
                resolve(fromWei(bl, dec))
              } catch (error) {
                resolve('')
              }
            } else {
              resolve('')
            }
          })
        }
      }
    } else {
      resolve('')
    }
  })
}
