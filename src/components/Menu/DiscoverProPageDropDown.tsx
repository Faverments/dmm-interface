import React, { useState } from 'react'

import { NavMenuItem } from '.'
import { Trans } from '@lingui/macro'

import { Command, ChevronDown } from 'react-feather'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import styled from 'styled-components'

const LinkCointainer = styled.div`
  padding-left: 20px;
`

export default function DiscoverProPageDropDown() {
  const [isShowOptions, setIsShowOptions] = useState(false)
  const toggle = useToggleModal(ApplicationModal.MENU)

  const handleClick = (e: any) => {
    e.preventDefault()
    setIsShowOptions(prev => !prev)
  }

  return (
    <div>
      <NavMenuItem to="/discoverpro" onClick={handleClick}>
        <Command size={14} />
        <Trans>Pro</Trans>
        <ChevronDown size={16} style={{ marginLeft: '6px' }} />
      </NavMenuItem>
      {isShowOptions && (
        <LinkCointainer>
          <NavMenuItem to={'/discoverpro/truesight'} onClick={toggle}>
            <Trans>TrueSight</Trans>
          </NavMenuItem>

          <NavMenuItem to={'/discoverpro/history'} onClick={toggle}>
            <Trans>History</Trans>
          </NavMenuItem>

          <NavMenuItem to={'/discoverpro/compare'} onClick={toggle}>
            <Trans>Compare</Trans>
          </NavMenuItem>
        </LinkCointainer>
      )}
    </div>
  )
}
