import React from 'react'
import { TrueSightPageWrapper } from 'pages/TrueSight/styled'
import styled from 'styled-components'
import HeaderBg from 'assets/images/peakpx.jpg'

const HeaderWrapper = styled.div`
  background-image: url(${HeaderBg});
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center bottom;
  width: 100%;
  padding: 140px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
`

export default function NviSignalHeader() {
  return <HeaderWrapper />
}
