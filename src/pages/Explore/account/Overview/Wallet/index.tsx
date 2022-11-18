import React, { useEffect, useMemo } from 'react'
import { Flex, Text } from 'rebass'
import { useWalletBalances } from 'services/zapper/hooks/useBalances'
import { ALL_NETWORKS, PresentedBalancePayload, TokenBreakdown } from 'services/zapper/types/models'
import { Network } from 'services/zapper/types/models/index'

import { formattedNumLong } from 'utils'

export default function Wallet({
  data,
  network,
  setNetwork,
}: {
  data: PresentedBalancePayload[]
  network: Network | ALL_NETWORKS
  setNetwork: React.Dispatch<React.SetStateAction<Network | ALL_NETWORKS>>
}) {
  const wallet = useWalletBalances(data)

  const totalsWalletBalances = Object.values(wallet).reduce((acc, cur) => acc + cur.totals, 0)

  const AllToken = useMemo(() => {
    const allToken: TokenBreakdown[] = []
    Object.values(wallet).forEach(item => {
      const listTokenOnNetwork: TokenBreakdown[] = Object.values<any>(item.details)
      allToken.push(...listTokenOnNetwork)
    })

    console.log('allToken', allToken)
    return allToken
  }, [wallet])

  console.log('wallet', wallet)

  if (network === 'all-networks') {
    return (
      <div>
        {Object.keys(wallet).length > 0 && (
          <>
            <div>
              {' '}
              balances on {network} wallet: {formattedNumLong(totalsWalletBalances, true)}
            </div>
            <div>
              {AllToken.sort((a, b) => b.balanceUSD - a.balanceUSD).map((token, index) => {
                return (
                  <Flex justifyContent="space-between" key={index}>
                    <Flex>
                      <img src={token.displayProps.images[0]} height={24} />
                      <Flex flexDirection="column">
                        <Text> {token.displayProps.label}</Text>
                        <Text> {formattedNumLong(token.context.price, true)}</Text>
                      </Flex>
                    </Flex>

                    <Flex flexDirection="column">
                      <Text>{formattedNumLong(token.balanceUSD, true)}</Text>
                      <Text>{formattedNumLong(token.context.balance)}</Text>
                    </Flex>
                  </Flex>
                )
              })}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      {Object.keys(wallet).length > 0 && (
        <>
          <div>
            {' '}
            balances on {network} wallet: {formattedNumLong(wallet[network].totals, true)}
          </div>
          <div>
            {Object.values<any>(wallet[network].details)
              .sort((a: TokenBreakdown, b: TokenBreakdown) => b.balanceUSD - a.balanceUSD)
              .map((token: TokenBreakdown, index) => {
                return (
                  <Flex justifyContent="space-between" key={index}>
                    <Flex>
                      <img src={token.displayProps.images[0]} height={24} />
                      <Flex flexDirection="column">
                        <Text> {token.displayProps.label}</Text>
                        <Text> {formattedNumLong(token.context.price, true)}</Text>
                      </Flex>
                    </Flex>

                    <Flex flexDirection="column">
                      <Text>{formattedNumLong(token.balanceUSD, true)}</Text>
                      <Text>{formattedNumLong(token.context.balance, true)}</Text>
                    </Flex>
                  </Flex>
                )
              })}
          </div>
        </>
      )}
    </div>
  )
}
