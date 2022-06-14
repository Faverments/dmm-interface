import React, { useEffect } from 'react'
import styled from 'styled-components'
import { t, Trans } from '@lingui/macro'
import { Box, Flex, Text } from 'rebass'
import { DiscoverProFilter } from '../TrueSight'
import lottie from 'lottie-web'
import RainBowCat from './rainbow-cat-remix.json'

const Container = styled.div``
const Wapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const ListTokenWithPickerDay = ({ filter }: { filter: DiscoverProFilter }) => {
  return <div></div>
}

export default function CompareTrendingSoonLayout({ filter }: { filter: DiscoverProFilter }) {
  useEffect(() => {
    lottie.loadAnimation({
      container: document.getElementById('rainbow-cat') as HTMLElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: RainBowCat,
    })
  }, [])

  return (
    <Container>
      <Wapper>
        <ListTokenWithPickerDay filter={filter} />
        <div
          id="rainbow-cat"
          style={{
            width: 320,
          }}
        />
        <ListTokenWithPickerDay filter={filter} />
      </Wapper>
    </Container>
  )
}
