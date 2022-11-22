import React from 'react'
import { Flex, Text } from 'rebass'
import { chainsInfo } from 'services/zapper/constances'
import { useAppBalances } from 'services/zapper/hooks/useBalances'
import { ALL_NETWORKS, Network, PresentedBalancePayload } from 'services/zapper/types/models/index'
import styled from 'styled-components/macro'

import DefaultIcon from 'assets/images/default-icon.png'
import { formattedNumLong } from 'utils'

const AppSubDetailsStyled = styled.div`
  margin-left: 5rem;
`

export default function Apps({ data, network }: { data: PresentedBalancePayload[]; network: Network | ALL_NETWORKS }) {
  const apps = useAppBalances(data, network)
  return (
    <div>
      {Object.values(apps)
        .sort((a, b) => b.totals - a.totals)
        .map((app, index) => {
          const AppMain = app.details
          const AppSubDetails = app.details.data.sort((a, b) => b.balanceUSD - a.balanceUSD)
          return (
            <div key={index}>
              <Flex justifyContent="space-between">
                <Flex>
                  <img src={AppMain.displayProps.images[0]} height={28} />
                  <Flex flexDirection="column">
                    <div>{AppMain.displayProps.appName}</div>
                    <Text>{chainsInfo[AppMain.network as Network].name}</Text>
                  </Flex>
                </Flex>

                <div>{formattedNumLong(app.totals, true)}</div>
              </Flex>
              <AppSubDetailsStyled>
                {AppSubDetails.map((detail, index) => {
                  if (detail.type === 'token') {
                    return (
                      <div key={index}>
                        <Flex justifyContent="space-between">
                          <Flex>
                            <div>
                              <img
                                src={detail.displayProps.images[detail.displayProps.images.length - 1] || DefaultIcon}
                                height={28}
                                alt={detail.displayProps.label}
                                // onError={({ currentTarget }) => {
                                //   currentTarget.onerror = null // prevents looping
                                //   currentTarget.src = DefaultIcon
                                // }}
                              />
                            </div>

                            <Flex flexDirection="column">
                              <Text>{detail.displayProps.label}</Text>
                              <Text>{detail.displayProps.secondaryLabel?.value}</Text>
                            </Flex>
                          </Flex>
                          <Flex flexDirection="column">
                            <Text>{formattedNumLong(detail.balanceUSD, true)}</Text>
                            <Text>{formattedNumLong(detail.context.balance)}</Text>
                          </Flex>
                        </Flex>
                      </div>
                    )
                  } else if (detail.type === 'position') {
                    return <div key={index}>position</div>
                  } else {
                    return <div key={index}>other</div>
                  }
                })}
              </AppSubDetailsStyled>
            </div>
          )
        })}
    </div>
  )
}
