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
import { Flex } from 'rebass'
import { AlignJustify } from 'react-feather'

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const StyledLabel = styled.div`
  font-size: ${isMobile ? '12px' : '14px'};
  color: ${({ theme }) => rgba(theme.text, 0.85)};
  font-weight: 400;
  line-height: 20px;
`

const tablePropertyLabels: {
  [key in TableDetail]: string | JSX.Element
} = {
  [TableDetail.RANK]: t`Rank`,
  [TableDetail.NAME]: t`Name`,
  [TableDetail.DISCOVERED_ON]: t`Discovered on`,
  [TableDetail.LAST_RANK]: t`Last Rank`,
  [TableDetail.CURRENT_PRICE]: t`Current Price`,
  [TableDetail.CURRENT_VOLUME_24H]: t`Trading Volume (24H)`,
  [TableDetail.CURRENT_MARKET_CAP]: t`Market Cap`,
  [TableDetail.CURRENT_NUMBER_HOLDERS]: t`Holders`,
  [TableDetail.CURRENT_PRICE_CHANGE_PERCENTAGE_24H]: t`Current Price Change %`,
  [TableDetail.PREDICTED_PRICE]: t`Predicted Price`,
  [TableDetail.PREDICTED_VOLUME_24H]: t`Predicted Trading Volume (24H)`,
  [TableDetail.PREDICTED_MARKET_CAP]: t`Predicted Market Cap`,
  [TableDetail.PREDICTED_NUMBER_HOLDERS]: t`Predicted Holders`,
  [TableDetail.PREDICTED_PRICE_CHANGE_PERCENTAGE_24H]: t`Predicted Price Change %`,
  [TableDetail.PRICE_CHANGE_PERCENTAGE_FROM_PREDICTED]: t`Price Change % from Predicted`,
  [TableDetail.VOLUME_CHANGE_PERCENTAGE__FROM_PREDICTED]: t`Volume Change % from Predicted`,
  [TableDetail.ACTION]: t`Action`,
}

const IconWrapper = styled.div`
  /* color: ${({ theme }) => theme.textReverse};
  background: ${({ theme }) => theme.white}; */
  padding: 3px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.buttonBlack};
  border-radius: 6px;
  padding: 5px 20px;
  margin-bottom: 2px;
  cursor: pointer;
`

const Scrollable = styled.div`
  overflow-y: scroll;
  scroll-behavior: smooth;
  width: 100%;
`

export function MetricsBox({
  tableCustomize,
  setTableCustomize,
}: {
  tableCustomize: TableDetail[]
  setTableCustomize: React.Dispatch<React.SetStateAction<TableDetail[]>>
}) {
  const theme = useTheme()
  return (
    <div style={{ width: '100%', padding: 16, display: 'flex', justifyContent: 'center' }}>
      <Flex
        flexDirection="column"
        style={{
          width: '70%',
          gap: 4,
          padding: '8px 50px',
          background: rgba(theme.buttonBlack, 0.2),
          borderRadius: 16,
        }}
      >
        {Object.keys(tablePropertyLabels).map((metric, index) => {
          if (typeof metric === 'string') {
            return (
              <ItemWrapper draggable>
                <StyledLabel key={index}>{tablePropertyLabels[metric as TableDetail]}</StyledLabel>
                <IconWrapper>
                  <AlignJustify size={20} />
                </IconWrapper>
              </ItemWrapper>
            )
          }
          return metric
        })}
      </Flex>
    </div>
  )
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
        <TableIcon fill={theme.text} />
      </ButtonPrimary>
      <Modal isOpen={isOpen} onDismiss={toggle} maxWidth="728px" maxHeight="500px">
        <Scrollable>
          <MetricsBox tableCustomize={tableCustomize} setTableCustomize={setTableCustomize} />
        </Scrollable>
      </Modal>
    </>
  )
}
