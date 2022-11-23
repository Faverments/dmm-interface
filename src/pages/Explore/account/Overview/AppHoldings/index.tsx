import React from 'react'
import { Flex, Text } from 'rebass'
import { chainsInfo } from 'services/zapper/constances'
import { useAppBalances } from 'services/zapper/hooks/useBalances'
import { ALL_NETWORKS, Network, PresentedBalancePayload } from 'services/zapper/types/models/index'

import { AutoColumn } from 'components/Column'
import Pagination from 'components/Pagination'
import useTheme from 'hooks/useTheme'
import { formatDollarAmount } from 'utils/numbers'

import { ItemLayout, ItemWrapper, OverflowPagination, SideTitle, SideWrapper } from '../../styleds'

export default function AppHolding({
  data,
  network,
}: {
  data: PresentedBalancePayload[]
  network: Network | ALL_NETWORKS
}) {
  const apps = useAppBalances(data, network)
  const [page, setPage] = React.useState(1)
  React.useEffect(() => {
    setPage(1)
  }, [network])

  const appPaginate = React.useMemo(() => {
    return Object.values(apps)
      .sort((a, b) => b.totals - a.totals)
      .slice((page - 1) * 6, page * 6)
  }, [apps, page])
  const theme = useTheme()
  return (
    <SideWrapper>
      <AutoColumn gap="8px">
        {appPaginate.length > 0 && <SideTitle>Protocol Holdings</SideTitle>}
        {appPaginate.map((app, index) => {
          const AppMain = app.details
          const AppSubDetails = app.details.data.sort((a, b) => b.balanceUSD - a.balanceUSD)
          const networkInfo = chainsInfo[AppMain.network as keyof typeof chainsInfo]
          return (
            <ItemWrapper key={index}>
              <ItemLayout>
                <Flex style={{ gap: 8 }} alignItems="center">
                  <img
                    src={AppMain.displayProps.images[0]}
                    width={40}
                    height={40}
                    style={{
                      borderRadius: '50%',
                    }}
                    alt={AppMain.displayProps.appName}
                  />

                  <Flex flexDirection="column" style={{ gap: 4 }}>
                    <Text color={theme.text} fontSize={18} fontWeight={400}>
                      {AppMain.displayProps.appName}
                    </Text>
                    <Flex
                      alignItems="flex-end"
                      style={{
                        gap: 8,
                        borderRadius: 4,
                        background: theme.background,
                        padding: '2px 8px',
                        width: 'fit-content',
                      }}
                    >
                      <img src={networkInfo.logo} alt="" height={16} />
                      <Text fontSize={14} fontWeight={300} color={theme.subText}>
                        {networkInfo.name}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  flexDirection="column"
                  alignItems="flex-end"
                  style={{
                    gap: 8,
                  }}
                >
                  <Text color={theme.text}>{formatDollarAmount(app.totals)}</Text>
                  <Text color={theme.subText}>{AppMain.data.length} positions</Text>
                </Flex>
              </ItemLayout>
            </ItemWrapper>
          )
        })}
        <OverflowPagination>
          <Pagination
            pageSize={6}
            onPageChange={newPage => setPage(newPage)}
            currentPage={page}
            totalCount={Object.keys(apps).length || 1}
            style={{
              backgroundColor: 'transparent',
              paddingLeft: 0,
              paddingRight: 0,
            }}
            forceMobileMode={true}
          />
        </OverflowPagination>
      </AutoColumn>
    </SideWrapper>
  )
}
