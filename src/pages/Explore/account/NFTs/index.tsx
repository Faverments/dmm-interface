import React, { useState } from 'react'
import { Flex, Text } from 'rebass'
import { Network } from 'services/zapper'
import { chainsInfo } from 'services/zapper/constances'

import useTheme from 'hooks/useTheme'

import { ChainWrapper } from '../styleds'
import CollectionView from './CollectionView'
import SingleView from './SingleView'

function ListChain({
  network,
  setNetwork,
}: {
  network: keyof typeof Network
  setNetwork: React.Dispatch<React.SetStateAction<keyof typeof Network>>
}) {
  const listChainAvailable: (keyof typeof Network)[] = ['ETHEREUM_MAINNET', 'ARBITRUM_MAINNET', 'OPTIMISM_MAINNET']
  const theme = useTheme()
  return (
    <Flex style={{ gap: 8 }}>
      {listChainAvailable.map((item, index) => {
        const active = item === network
        return (
          <ChainWrapper
            key={index}
            style={
              {
                // flexBasis: '100%',
                // maxWidth: 230,
              }
            }
            onClick={() => {
              setNetwork(item)
            }}
            active={active}
          >
            <Flex alignItems="center" style={{ gap: 8 }} justifyContent="space-between">
              <Flex alignItems="center" style={{ gap: 8 }}>
                <img src={chainsInfo[Network[item]].logo} alt="" height={24} />

                <Text fontSize={16} fontWeight={500} color={active ? theme.textReverse : theme.text}>
                  {chainsInfo[Network[item]].name}{' '}
                </Text>
              </Flex>
            </Flex>
          </ChainWrapper>
        )
      })}
    </Flex>
  )
}

export default function Nfts() {
  const [network, setNetwork] = useState<keyof typeof Network>('ETHEREUM_MAINNET')
  const [activeViewType, setActiveViewType] = useState<'single' | 'collection'>('single')

  return (
    <Flex flexDirection="column" style={{ gap: 20 }}>
      <ListChain network={network} setNetwork={setNetwork} />
      {activeViewType === 'single' ? (
        <SingleView activeViewType={activeViewType} setActiveViewType={setActiveViewType} network={network} />
      ) : (
        <CollectionView activeViewType={activeViewType} setActiveViewType={setActiveViewType} network={network} />
      )}
    </Flex>
  )
}
