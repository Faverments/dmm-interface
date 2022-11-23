import { rgba } from 'polished'
import { Flex, Text } from 'rebass'
import { useAppBalances } from 'services/zapper/hooks/useBalances'
import { ALL_NETWORKS, Network, PresentedBalancePayload } from 'services/zapper/types/models/index'
import styled from 'styled-components/macro'

import { AutoColumn } from 'components/Column'
import { formattedNumLong } from 'utils'

import { TableHeaderItem, TableWrapper } from '../styleds'

const AppSubDetailsStyled = styled.div`
  margin-left: 5rem;
`

export default function Apps({ data, network }: { data: PresentedBalancePayload[]; network: Network | ALL_NETWORKS }) {
  const apps = useAppBalances(data, network)
  return (
    <>
      {Object.values(apps)
        .sort((a, b) => b.totals - a.totals)
        .map((app, index) => {
          const AppMain = app.details
          const AppSubDetails = app.details.data.sort((a, b) => b.balanceUSD - a.balanceUSD)
          return (
            // <div key={index}>
            //   <Flex justifyContent="space-between">
            //     <Flex>
            //       <img src={AppMain.displayProps.images[0]} height={28} />
            //       <Flex flexDirection="column">
            //         <div></div>
            //         <Text>{chainsInfo[AppMain.network as Network].name}</Text>
            //       </Flex>
            //     </Flex>

            //     <div>{formattedNumLong(app.totals, true)}</div>
            //   </Flex>
            //   <AppSubDetailsStyled>
            //     {AppSubDetails.map((detail, index) => {
            //       if (detail.type === 'token') {
            //         return (
            //           <div key={index}>
            //             <Flex justifyContent="space-between">
            //               <Flex>
            //                 <div>
            //                   <img
            //                     src={detail.displayProps.images[detail.displayProps.images.length - 1] || DefaultIcon}
            //                     height={28}
            //                     alt={detail.displayProps.label}
            //                     // onError={({ currentTarget }) => {
            //                     //   currentTarget.onerror = null // prevents looping
            //                     //   currentTarget.src = DefaultIcon
            //                     // }}
            //                   />
            //                 </div>

            //                 <Flex flexDirection="column">
            //                   <Text>{detail.displayProps.label}</Text>
            //                   <Text>{detail.displayProps.secondaryLabel?.value}</Text>
            //                 </Flex>
            //               </Flex>
            //               <Flex flexDirection="column">
            //                 <Text>{formattedNumLong(detail.balanceUSD, true)}</Text>
            //                 <Text>{formattedNumLong(detail.context.balance)}</Text>
            //               </Flex>
            //             </Flex>
            //           </div>
            //         )
            //       } else if (detail.type === 'position') {
            //         return <div key={index}>position</div>
            //       } else {
            //         return <div key={index}>other</div>
            //       }
            //     })}
            //   </AppSubDetailsStyled>
            // </div>
            <TableWrapper key={index}>
              <Flex flexDirection={'column'} style={{ gap: 24 }}>
                <Flex alignItems={'center'} style={{ gap: 16 }}>
                  <img
                    src={AppMain.displayProps.images[0]}
                    height={28}
                    style={{
                      borderRadius: '50%',
                    }}
                    alt={AppMain.displayProps.appName}
                  />
                  <Text fontSize={20} fontWeight={500}>
                    {AppMain.displayProps.appName} : {formattedNumLong(app.totals, true)}
                  </Text>
                </Flex>
                <AutoColumn gap="16px">
                  <LayoutWrapper>
                    <TableHeaderItem>Asset</TableHeaderItem>
                    <TableHeaderItem>Price</TableHeaderItem>
                    <TableHeaderItem>Balance</TableHeaderItem>
                    <TableHeaderItem>Value</TableHeaderItem>
                  </LayoutWrapper>
                </AutoColumn>
              </Flex>
            </TableWrapper>
          )
        })}
    </>
  )
}

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr;
  border-bottom: 0.5px solid ${({ theme }) => (theme.darkMode ? rgba(theme.border, 0.2) : theme.border)};
  padding-bottom: 16px;
`
