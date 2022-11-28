import { Trans, t } from '@lingui/macro'
import { useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import { ButtonWarning } from 'components/Button'
import { ModalCenter } from 'components/Modal'
import useTheme from 'hooks/useTheme'

const ExploreLocalStorageKeys = {
  EXPLORE_INFO: 'exploreInfo',
  SHOWED_DISCLAIMED: 'showedDisclaimed',
}

export const getBridgeLocalstorage = (key: string) => {
  const exploreInfo: { [key: string]: any } = JSON.parse(
    localStorage.getItem(ExploreLocalStorageKeys.EXPLORE_INFO) || '{}',
  )
  return exploreInfo?.[key]
}
export const setBridgeLocalstorage = (key: string, value: any) => {
  const exploreInfo: { [key: string]: any } = JSON.parse(
    localStorage.getItem(ExploreLocalStorageKeys.EXPLORE_INFO) || '{}',
  )
  localStorage.setItem(ExploreLocalStorageKeys.EXPLORE_INFO, JSON.stringify({ ...exploreInfo, [key]: value }))
}

const Container = styled.div`
  padding: 25px 30px;
`
const TextWrapper = styled.p`
  line-height: 20px;
  font-size: 14px;
`
export default function Disclaimer() {
  const showed = getBridgeLocalstorage(ExploreLocalStorageKeys.SHOWED_DISCLAIMED)
  const [show, setShow] = useState(!showed)
  const theme = useTheme()

  const onDismiss = () => {
    setBridgeLocalstorage(ExploreLocalStorageKeys.SHOWED_DISCLAIMED, '1')
    setShow(false)
  }
  return (
    <ModalCenter isOpen={show}>
      <Container>
        <Flex justifyContent={'space-between'}>
          <Flex color={theme.warning} alignItems="center" style={{ gap: 8 }}>
            <AlertTriangle size={20} /> <Text fontSize={20}>{t`Disclaimer`}</Text>
          </Flex>
        </Flex>
        <TextWrapper>
          <Trans>
            This feature use input token address from Zapper but endpoint to get analytic data is Nansen Portfolio. So
            there is a chance that the data is not correct.
          </Trans>
        </TextWrapper>
        <TextWrapper>
          <Trans>please understand that this is an experimental feature.</Trans>
        </TextWrapper>

        <ButtonWarning style={{ marginTop: 20 }} onClick={onDismiss}>
          <Trans>I Understand</Trans>
        </ButtonWarning>
      </Container>
    </ModalCenter>
  )
}
