import React from 'react'
import NviSignalHeader from './components/NviSignalHeader'
import NviSignalDetails from './components/NviSignalDetails'
import styled from 'styled-components'
import { Flex, Text } from 'rebass'
import AppBody from 'pages/AppBody'
import { Container } from 'components/swapv2/styleds'
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0px 16px 100px;
  width: 100%;

  @media only screen and (min-width: 768px) {
    padding: 0px 64px 100px;
  }

  @media only screen and (min-width: 1700px) {
    padding: 0px 252px 50px;
  }
`

export const AppBodyWrapped = styled(AppBody)`
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04);
  z-index: 1;
  padding: 30px 24px;
  margin-top: 35px;
  margin-left: 8px;
  text-align: center;
  font-size: 20px;
  @media only screen and (min-width: 768px) {
    /* width: 404px; */
  }
`
export default function NviSignal() {
  return (
    <>
      <NviSignalHeader />
      <PageWrapper>
        <NviSignalDetails />
        <Container>
          <AppBodyWrapped>CURRENT IN DEVELOPMENT</AppBodyWrapped>
        </Container>
      </PageWrapper>
    </>
  )
}
