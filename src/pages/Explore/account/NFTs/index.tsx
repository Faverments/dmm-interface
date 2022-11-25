import React, { useState } from 'react'
import { Flex } from 'rebass'

import CollectionView from './CollectionView'
import SingleView from './SingleView'

export default function Nfts() {
  const [activeViewType, setActiveViewType] = useState<'single' | 'collection'>('single')

  return (
    <Flex flexDirection="column" style={{ gap: 20 }}>
      {activeViewType === 'single' ? (
        <SingleView activeViewType={activeViewType} setActiveViewType={setActiveViewType} />
      ) : (
        <CollectionView activeViewType={activeViewType} setActiveViewType={setActiveViewType} />
      )}
    </Flex>
  )
}
