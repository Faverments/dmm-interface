import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Flex } from 'rebass'
import { useGetTokenApprovals } from 'services/krystal'
import { ALL_NETWORKS, Network } from 'services/zapper'
import { chainsInfo } from 'services/zapper/constances'

import Pagination from 'components/Pagination'
import Search from 'components/Search'
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
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [address, network])

  const { hits, query, onSearch } = useFuse(data.data?.approvals ? data.data?.approvals : [], {
    keys: ['name', 'symbol', 'tokenAddress', 'spenderAddress'],
    includeMatches: true,
    matchAllOnEmptyQuery: true,
  })

  const hitsPaginated = hits.slice((currentPage - 1) * 20, currentPage * 20)

  console.log('data ', data)
  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between">
        <div>Total Allowance : {data.data?.atRisk['usd']}</div>
        <Flex>
          <div>
            <Search
              searchValue={query}
              onSearch={onSearch}
              placeholder="Search by name, symbol, address"
              minWidth={'100'}
            />
            {/* <p>Results for &quot;{query}&quot;:</p> */}
          </div>
          <NetworkSelect network={network} setNetwork={setNetwork} />
        </Flex>
      </Flex>
      <ol>
        {hitsPaginated.map((hit: any) => {
          return (
            <li key={hit.refIndex}>
              <div>{hit.refIndex}</div>
              <FuseHighlight hit={hit} attribute="symbol" />
            </li>
          )
        })}
      </ol>
      <Pagination
        pageSize={20}
        onPageChange={newPage => setCurrentPage(newPage)}
        currentPage={currentPage}
        totalCount={hits.length ?? 1}
      />
    </Flex>
  )
}
