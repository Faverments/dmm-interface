import React, { useRef } from 'react'
import useTheme from 'hooks/useTheme'
import { useModalOpen, useToggleTableCustomize } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import Modal from 'components/Modal'
import styled, { css } from 'styled-components'
import { Layout as TableIcon } from 'react-feather'
import { darken, rgba } from 'polished'

import MenuFlyout from 'components/MenuFlyout'
import { t, Trans } from '@lingui/macro'
import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { AutoRow, RowFixed } from 'components/Row'

import { isMobile } from 'react-device-detect'

const MenuFlyoutBrowserStyle = css`
  min-width: 322px;
  right: -10px;
  top: 3.25rem;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    top: 3.25rem;
    bottom: unset;
    & > div:after {
      top: -40px;
      border-top-color: transparent;
      border-bottom-color: ${({ theme }) => theme.tableHeader};
      border-width: 10px;
      margin-left: -10px;
    }
  `};
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const StyledLabel = styled.div`
  font-size: ${isMobile ? '14px' : '12px'};
  color: ${({ theme }) => theme.text};
  font-weigh: 400;
  line-height: 20px;
`

export function MetricsBox() {
  return (
    <AutoColumn gap="md">
      <RowFixed>
        <StyledLabel>
          <Trans>Metrics</Trans>
        </StyledLabel>
      </RowFixed>
      <AutoRow gap="md" justify="flex-start"></AutoRow>
    </AutoColumn>
  )
}

export default function TableCustomize() {
  const theme = useTheme()
  const toggle = useToggleTableCustomize()
  const open = useModalOpen(ApplicationModal.TABLE_CUSTOMIZE)
  const node = useRef<HTMLDivElement>()

  return (
    <>
      <StyledMenu ref={node as any}>
        <ButtonPrimary
          padding="7px 8px"
          width="fit-content"
          style={{ borderRadius: '4px', fontSize: '14px' }}
          onClick={toggle}
          id="open-table-customize-dialog-button"
          aria-label="Table Customize"
        >
          <TableIcon size={18} />
        </ButtonPrimary>

        <MenuFlyout
          node={node}
          isOpen={open}
          toggle={toggle}
          translatedTitle={t`Table Customize`}
          browserCustomStyle={MenuFlyoutBrowserStyle}
          hasArrow
        >
          <MetricsBox />
        </MenuFlyout>
      </StyledMenu>
    </>
  )
}
