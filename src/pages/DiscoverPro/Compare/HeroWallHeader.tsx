import React from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/macro'

import HeroWallHeaderImg from 'assets/images/HeroWallHeader.png'
import useTheme from 'hooks/useTheme'

const Hero = styled.div`
  width: 100%;
  background-image: url(${HeroWallHeaderImg});
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center bottom;
  padding: 100px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
`

const HeroWallHeader = () => {
  const theme = useTheme()

  return <Hero></Hero>
}

export default HeroWallHeader
