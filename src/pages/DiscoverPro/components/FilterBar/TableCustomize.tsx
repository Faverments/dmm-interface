import React, { useRef } from 'react'
import useTheme from 'hooks/useTheme'
import { useModalOpen, useToggleTableCustomize } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import Modal from 'components/Modal'
import styled, { css } from 'styled-components'
// import { Sliders as TableIcon } from 'react-feather'
import TableIcon from 'components/Icons/TransactionSettingsIcon'
import { darken, rgba } from 'polished'
import { t, Trans } from '@lingui/macro'
import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { AutoRow, RowFixed } from 'components/Row'

import { isMobile } from 'react-device-detect'

import { initialTableCustomize } from 'pages/DiscoverPro/TrueSight/index'
import { TableDetail } from 'constants/discoverPro'

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
  return <div></div>
}

export default function TableCustomize({
  tableCustomize,
  setTableCustomize,
}: {
  tableCustomize: TableDetail[]
  setTableCustomize: React.Dispatch<React.SetStateAction<TableDetail[]>>
}) {
  const theme = useTheme()
  const toggle = useToggleTableCustomize()
  const isOpen = useModalOpen(ApplicationModal.TABLE_CUSTOMIZE)
  const node = useRef<HTMLDivElement>()

  return (
    <>
      <ButtonPrimary
        padding="6px 7px"
        width="fit-content"
        style={{ borderRadius: '4px', fontSize: '14px' }}
        onClick={toggle}
        id="open-table-customize-dialog-button"
        aria-label="Table Customize"
      >
        {/* <TableIcon size={18} /> */}
        <TableIcon fill={theme.text14} />
      </ButtonPrimary>
      <Modal isOpen={isOpen} onDismiss={toggle} maxWidth="728px">
        <MetricsBox />
      </Modal>
    </>
  )
}
