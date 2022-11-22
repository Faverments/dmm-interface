import { Trans } from '@lingui/macro'
import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Flex } from 'rebass'

import { ButtonLight } from 'components/Button'
import { useActiveWeb3React } from 'hooks'
import Account from 'pages/Explore/Account'
import { useToggleSearchExploreModal, useWalletModalToggle } from 'state/application/hooks'

export default function DashBoard(props: RouteComponentProps<{ address: string }>) {
  const { history } = props
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const toggleSearchExploreModal = useToggleSearchExploreModal()
  useEffect(() => {
    if (account) {
      history.push(`/account/${account}`)
    }
  }, [account, history])

  return (
    <div>
      {!account && (
        <Flex>
          <ButtonLight onClick={toggleWalletModal}>
            <Trans>Connect Wallet</Trans>
          </ButtonLight>
          <input
            placeholder="search adddress or ens"
            onClick={e => {
              e.preventDefault()
              toggleSearchExploreModal()
            }}
          />
        </Flex>
      )}
    </div>
  )
}
