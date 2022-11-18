import React from 'react'
import { useParams } from 'react-router-dom'
import { Flex } from 'rebass'
import { useGetTokenApprovals } from 'services/krystal'
import { ALL_NETWORKS, Network } from 'services/zapper'
import { chainsInfo } from 'services/zapper/constances'

import { useFuse } from 'hooks/useFuse'

import FuseHighlight from '../../../../components/FuseHighlight/FuseHighlight'
import NetworkSelect from './NetworkSelect'

export default function TokenApprovals() {
  const { address } = useParams<{ address: string }>()
  const [network, setNetwork] = React.useState<Network | ALL_NETWORKS>('all-networks')
  const data = useGetTokenApprovals(
    address,
    chainsInfo[network as Network] ? chainsInfo[network as Network].chainId : 'all-networks',
  )

  const { hits, query, onSearch } = useFuse(data.data?.approvals ? data.data?.approvals : [], {
    keys: ['name', 'symbol', 'tokenAddress', 'spenderAddress'],
    includeMatches: true,
    matchAllOnEmptyQuery: true,
  })

  console.log('data ', data)
  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between">
        <div>Total Allowance : {data.data?.atRisk['usd']}</div>
        <Flex>
          <div>
            <input
              name="search"
              type="search"
              placeholder="Search..."
              autoComplete="off"
              onKeyUp={onSearch}
              onChange={onSearch} // handles "clear search" click
            />
            <p>Results for &quot;{query}&quot;:</p>
          </div>
          <NetworkSelect network={network} setNetwork={setNetwork} />
        </Flex>
      </Flex>
      <ol>
        {hits.map((hit: any) => {
          return (
            <li key={hit.refIndex}>
              <FuseHighlight hit={hit} attribute="symbol" />
            </li>
          )
        })}
      </ol>
    </Flex>
  )
}
