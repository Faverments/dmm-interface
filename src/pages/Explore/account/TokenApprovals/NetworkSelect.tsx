import { Trans } from '@lingui/macro'
import React, { CSSProperties, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Flex, Image, Text } from 'rebass'
import { ALL_NETWORKS, Network } from 'services/zapper'
import { chainsInfo } from 'services/zapper/constances'
import styled from 'styled-components'

import { ReactComponent as ChevronDown } from 'assets/svg/down.svg'
import Kyber from 'components/Icons/Kyber'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useTheme from 'hooks/useTheme'
import { OptionsContainer } from 'pages/TrueSight/styled'
import { useTrueSightNetworkModalToggle } from 'state/application/hooks'

const NetworkSelectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  position: relative;
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
  min-width: 160px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: unset;
    width: 100%;
  `}
`

const NetworkSelect = ({
  network,
  setNetwork,
  style,
}: {
  network: Network | ALL_NETWORKS
  setNetwork: React.Dispatch<React.SetStateAction<Network | ALL_NETWORKS>>
  style?: CSSProperties
}) => {
  const theme = useTheme()

  const [isShowOptions, setIsShowOptions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(containerRef, () => !isMobile && setIsShowOptions(false))

  const toggleTrueSightNetworkModal = useTrueSightNetworkModalToggle()

  return (
    <NetworkSelectContainer
      role="button"
      onClick={() => {
        if (isMobile) {
          toggleTrueSightNetworkModal()
        } else {
          setIsShowOptions(prev => !prev)
        }
      }}
      ref={containerRef}
      style={style}
    >
      <Flex alignItems="center" style={{ gap: '8px' }}>
        {network !== 'all-networks' ? (
          <Image minHeight={20} minWidth={20} height={20} width={20} src={chainsInfo[network as Network].logo} />
        ) : (
          <Kyber size={24} color={theme.border} />
        )}
        <Text color={network ? theme.subText : theme.border} fontSize="14px" lineHeight="24px">
          {network !== 'all-networks' ? chainsInfo[network as Network].name : <Trans>All Networks</Trans>}
        </Text>
      </Flex>
      <Flex alignItems="center">
        {/* {network !== 'all-networks' ? (
          <X
            size={16}
            color={theme.subText}
            onClick={e => {
              e.stopPropagation()
              setNetwork('all-networks')
            }}
          />
        ) : ( */}
        <ChevronDown
          color={theme.border}
          style={{ transform: `rotate(${isShowOptions ? '180deg' : 0})`, transition: 'transform 0.2s' }}
        />
        {/* )} */}
      </Flex>

      {/* <TrueSightNetworkModal filter={filter} setFilter={setFilter} /> */}

      {isShowOptions && !isMobile && (
        <OptionsContainer>
          <Flex
            alignItems="center"
            style={{ gap: '6px' }}
            onClick={() => {
              setNetwork('all-networks')
            }}
          >
            <Kyber size={18} color={theme.border} />
            <Text color={theme.subText} fontSize="15px">
              <Trans>All NetWorks</Trans>
            </Text>
          </Flex>
          {Object.values(Network).map((network, index) => (
            <Flex
              key={index}
              alignItems="center"
              style={{ gap: '6px' }}
              onClick={() => {
                setNetwork(network)
              }}
            >
              <Image minHeight={18} minWidth={18} height={18} width={18} src={chainsInfo[network].logo} />
              <Text key={index} color={theme.subText} fontSize="15px">
                <Trans>{chainsInfo[network].name}</Trans>
              </Text>
            </Flex>
          ))}
        </OptionsContainer>
      )}
    </NetworkSelectContainer>
  )
}

export default NetworkSelect
