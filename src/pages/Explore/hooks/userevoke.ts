import { t } from '@lingui/macro'
import { BigNumber, Contract } from 'ethers'
import { TokenApproval } from 'services/krystal'

import ERC20_INTERFACE from 'constants/abis/erc20'
import { useActiveWeb3React } from 'hooks'
import { useActiveNetwork } from 'hooks/useActiveNetwork'
import { NotificationType, useNotify } from 'state/application/hooks'

const fromFloat = (floatString: string, decimals: number): string => {
  const sides = floatString.split('.')
  if (sides.length === 1) return floatString.padEnd(decimals + floatString.length, '0')
  if (sides.length > 2) return '0'

  return sides[1].length > decimals ? sides[0] + sides[1].slice(0, decimals) : sides[0] + sides[1].padEnd(decimals, '0')
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useRevoke = () => {
  const { chainId, library } = useActiveWeb3React()
  const { changeNetwork } = useActiveNetwork()
  const signer = library?.getSigner()
  const notify = useNotify()

  // const revoke = async () => update('0')
  const update = async (token: TokenApproval, newAmount: string) => {
    if (!token || !signer) return

    if (chainId !== token.chainId) {
      notify({
        title: t`Change Network to ${token.chainId}`,
        type: NotificationType.WARNING,
        summary: t`In order to use Revode on ${token.chainId}, please confirm in wallet to switch chain to ${token.chainId}.`,
      })
      await changeNetwork(token.chainId)
    }
    try {
      const bnNew = BigNumber.from(fromFloat(newAmount, token.decimals))
      const writeContract = new Contract(token.tokenAddress, ERC20_INTERFACE, signer)
      const tx = await writeContract.approve(token.spenderAddress, bnNew)
      if (tx) {
        console.log(tx)
        const wait = await tx.wait(1)
        console.log(wait)
      }
      return tx
    } catch (error) {
      notify({
        title: t`Failed to Revoke`,
        type: NotificationType.ERROR,
        summary: t`In order to use Revode token  ${token.name}, you must confirm in wallet to revoke this token.`,
      })
    }
  }
  return { update }
}
