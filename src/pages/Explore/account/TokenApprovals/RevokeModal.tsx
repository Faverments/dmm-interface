import { Trans, t } from '@lingui/macro'
import React from 'react'
import { X } from 'react-feather'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import { TokenApproval } from 'services/krystal'
import styled from 'styled-components/macro'

import { ButtonOutlined, ButtonPrimary } from 'components/Button'
import Modal from 'components/Modal'
import useTheme from 'hooks/useTheme'
import { useRevoke } from 'pages/Explore/hooks/userevoke'
import getShortenAddress from 'utils/getShortenAddress'

const Container = styled.div`
  padding: 25px 30px;
  width: 100%;
`

const StyledAddress = styled.div`
  padding: 16px 12px;
  border-radius: 16px;
  background: ${({ theme }) => theme.buttonBlack};
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

export default function RevokeModal({
  isOpen,
  setIsOpen,
  tokenSelected,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  tokenSelected: TokenApproval | undefined
}) {
  const onDismiss = () => {
    setIsOpen(false)
  }

  const theme = useTheme()

  const above576 = useMedia('(min-width: 576px)')

  const { update } = useRevoke()

  return tokenSelected ? (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth="498px">
      <Container>
        <Flex flexDirection={'column'} style={{ gap: 25 }}>
          <Flex justifyContent={'space-between'}>
            <Flex color={theme.text} alignItems="center" style={{ gap: 8 }}>
              <Text fontSize={20}>{t`Token Approval`}</Text>
            </Flex>
            <X onClick={onDismiss} style={{ cursor: 'pointer' }} color={theme.text} />
          </Flex>

          <Flex flexDirection={'column'} style={{ gap: 10 }}>
            <Text fontSize={16}>Token</Text>
            <StyledAddress>
              {above576 ? tokenSelected.tokenAddress : getShortenAddress(tokenSelected.tokenAddress)}
            </StyledAddress>
          </Flex>

          <Flex flexDirection={'column'} style={{ gap: 10 }}>
            <Text fontSize={16}>Spender</Text>
            <StyledAddress>
              {above576 ? tokenSelected.spenderAddress : getShortenAddress(tokenSelected.spenderAddress)}
            </StyledAddress>
          </Flex>

          <Flex justifyContent="center" alignItems="center">
            <Flex style={{ gap: 16 }}>
              <ButtonOutlined onClick={onDismiss}>
                <Trans>Close</Trans>
              </ButtonOutlined>
              <ButtonPrimary
                onClick={() => {
                  update(tokenSelected, '0')
                }}
              >
                <Trans>Revoke</Trans>
              </ButtonPrimary>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Modal>
  ) : null
}
