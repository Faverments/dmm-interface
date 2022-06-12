import React, { Dispatch, SetStateAction } from 'react'
import Modal from 'components/Modal'
import { useModalOpen, useTrendingSoonSortingModalToggle } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import { Flex, Text } from 'rebass'
import { t, Trans } from '@lingui/macro'
import { ArrowDown, X } from 'react-feather'
import useTheme from 'hooks/useTheme'
import { ArrowUpDown } from 'components/Icons'

import { DiscoverProSortSettings } from 'pages/DiscoverPro/TrueSight/index'
import { TableDetail, SortDirection } from 'constants/discoverPro'

const SortItem = ({
  text,
  active,
  sortDirection,
  onClick,
}: {
  text: string
  active: boolean
  sortDirection: SortDirection
  onClick: () => void
}) => {
  const theme = useTheme()
  const textColor = active ? '#3a3a3a' : theme.subText
  const bgColor = active ? theme.primary : theme.buttonBlack

  return (
    <Flex
      p="12.5px"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
      style={{ borderRadius: '4px', gap: '4px' }}
      onClick={onClick}
    >
      <Text color={textColor} fontSize="16px" fontWeight={500}>
        {text}
      </Text>
      {active ? (
        <ArrowDown
          size={16}
          color={textColor}
          style={{ transform: sortDirection === SortDirection.ASC ? 'unset' : 'rotate(180deg)' }}
        />
      ) : (
        <ArrowUpDown />
      )}
    </Flex>
  )
}

const ModalSorting = ({
  sortSettings,
  setSortSettings,
}: {
  sortSettings: DiscoverProSortSettings
  setSortSettings: Dispatch<SetStateAction<DiscoverProSortSettings>>
}) => {
  const isSortingModalOpen = useModalOpen(ApplicationModal.TRENDING_SOON_SORTING)
  const toggleSortingModal = useTrendingSoonSortingModalToggle()
  const theme = useTheme()

  return (
    <Modal isOpen={isSortingModalOpen} onDismiss={toggleSortingModal}>
      <Flex flexDirection="column" padding="24px 16px 40px" width="100%">
        <Flex justifyContent="space-between" alignItems="center">
          <Text color={theme.text} fontSize="16px" lineHeight="20px" fontWeight={500}>
            <Trans>Sort by</Trans>
          </Text>
          <X color={theme.subText} size={24} onClick={toggleSortingModal} />
        </Flex>
        <Flex mt="24px" flexDirection="column" style={{ gap: '16px' }}>
          <SortItem
            text={t`Ranking`}
            active={sortSettings.sortBy === TableDetail.RANK}
            sortDirection={sortSettings.sortDirection}
            onClick={() =>
              setSortSettings(prev => ({
                sortBy: TableDetail.RANK,
                sortDirection:
                  prev.sortBy === TableDetail.RANK
                    ? prev.sortDirection === SortDirection.ASC
                      ? SortDirection.DESC
                      : SortDirection.ASC
                    : SortDirection.ASC,
              }))
            }
          />
          <SortItem
            text={t`Name`}
            active={sortSettings.sortBy === TableDetail.NAME}
            sortDirection={sortSettings.sortDirection}
            onClick={() =>
              setSortSettings(prev => ({
                sortBy: TableDetail.NAME,
                sortDirection:
                  prev.sortBy === TableDetail.NAME
                    ? prev.sortDirection === SortDirection.ASC
                      ? SortDirection.DESC
                      : SortDirection.ASC
                    : SortDirection.ASC,
              }))
            }
          />
          <SortItem
            text={t`Discovered On`}
            active={sortSettings.sortBy === TableDetail.DISCOVERED_ON}
            sortDirection={sortSettings.sortDirection}
            onClick={() =>
              setSortSettings(prev => ({
                sortBy: TableDetail.DISCOVERED_ON,
                sortDirection:
                  prev.sortBy === TableDetail.DISCOVERED_ON
                    ? prev.sortDirection === SortDirection.ASC
                      ? SortDirection.DESC
                      : SortDirection.ASC
                    : SortDirection.ASC,
              }))
            }
          />
        </Flex>
      </Flex>
    </Modal>
  )
}

export default ModalSorting
