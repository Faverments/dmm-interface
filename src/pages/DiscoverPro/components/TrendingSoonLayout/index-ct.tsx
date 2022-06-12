import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { ClickableText } from 'components/YieldPools/styleds'
import { TrueSightContainer } from 'pages/TrueSight/components/TrendingSoonLayout'
import { Trans } from '@lingui/macro'
import { Circle, ArrowRight } from 'react-feather'

import Panel from 'components/Panel'
import { rgba } from 'polished'

import {
  DiscoverProFilter,
  DiscoverProSortSettings,
  TableDetailObject,
  tableDetailsDisplay,
} from 'pages/DiscoverPro/TrueSight/index'

import { TableDetail, SortDirection } from 'constants/discoverPro'
import useGetTrueSightFilterData from 'pages/DiscoverPro/hooks/useGetTrueSightFilterData'
import useGetTrendingSoonData from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import useMakeDiscoverProTokensList, { DiscoverProToken } from 'pages/DiscoverPro/hooks/useMakeDiscoverProTokensList'
import { TruncatedText } from 'pages/TrueSight/components/TrendingSoonLayout/TrendingSoonTokenItem'
import useTheme from 'hooks/useTheme'

function getPropertyNameOfObjectV1(obj: any, propertyName: string) {
  return Object.keys(obj).find(key => key === propertyName)
}

function getPropertyNameOfObjectV2(obj: any, expression: any) {
  const res: any = {}
  Object.keys(obj).map(k => {
    res[k] = () => k
  })
  return expression(res)()
}

const TableContainer = styled.div`
  border-radius: 8px;
`

const TableHeader = styled.div<{ tableLayout: TableDetailObject[] }>`
  display: grid;
  padding: 18px 16px;
  grid-template-columns: ${({ tableLayout }) => tableLayout.map(e => e.template).join(' ')};
  background: ${({ theme }) => theme.tableHeader};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  gap: 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const TableHeaderItem = styled.div<{ align?: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.subText};
  text-align: ${({ align }) => align ?? 'left'};
  text-transform: uppercase;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const TableBodyWithDetailContainer = styled.div<{ isTrueSightToken: boolean; isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme, isTrueSightToken, isSelected }) =>
    isSelected ? theme.tableHeader : isTrueSightToken ? rgba(theme.bg8, 0.12) : theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const TableBodyItem = styled.div<{ align?: string }>`
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.subText};
  text-align: ${({ align }) => align ?? 'left'};
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => (align === 'right' ? 'flex-end' : 'flex-start')};
  gap: 8px;
`

const TableBodyContainer = styled.div<{ tableLayout: TableDetailObject[] }>`
  display: grid;
  padding: 10px 20px;
  grid-template-columns: ${({ tableLayout }) => tableLayout.map(e => e.template).join(' ')};
  gap: 16px;
  cursor: pointer;
`

const ListHeader: {
  [key in TableDetail]: JSX.Element
} = {
  [TableDetail.RANK]: (
    <TableHeaderItem>
      <Trans>#</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.NAME]: (
    <TableHeaderItem>
      <Trans>Name</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.DISCOVERED_ON]: (
    <TableHeaderItem>
      <Trans>Discover On</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.LAST_RANK]: (
    <TableHeaderItem>
      <Trans>Last Rank</Trans>
    </TableHeaderItem>
  ),

  [TableDetail.CURRENT_PRICE]: (
    <TableHeaderItem>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Trans>Price</Trans>
        <div
          style={{
            marginLeft: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Circle fill="#dad873" color="#dad873" size={12} />
          <ArrowRight size={12} />
          <Circle fill="#309975" color="#309975" size={12} />
        </div>
      </div>
    </TableHeaderItem>
  ),
  [TableDetail.CURRENT_VOLUME_24H]: (
    <TableHeaderItem>
      <Trans>Current Volume</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.CURRENT_MARKET_CAP]: (
    <TableHeaderItem>
      <Trans>Current Market Cap</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.CURRENT_NUMBER_HOLDERS]: (
    <TableHeaderItem>
      <Trans>Current Number of Holders</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.CURRENT_PRICE_CHANGE_PERCENTAGE_24H]: (
    <TableHeaderItem>
      <Trans>Current Price Change %</Trans>
    </TableHeaderItem>
  ),

  [TableDetail.PREDICTED_PRICE]: (
    <TableHeaderItem>
      <Trans>Predicted Price</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.PREDICTED_VOLUME_24H]: (
    <TableHeaderItem>
      <Trans>Predicted Volume</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.PREDICTED_MARKET_CAP]: (
    <TableHeaderItem>
      <Trans>Predicted Market Cap</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.PREDICTED_NUMBER_HOLDERS]: (
    <TableHeaderItem>
      <Trans>Predicted Number of Holders</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.PREDICTED_PRICE_CHANGE_PERCENTAGE_24H]: (
    <TableHeaderItem>
      <Trans>Predicted Price Change %</Trans>
    </TableHeaderItem>
  ),

  [TableDetail.PRICE_CHANGE_PERCENTAGE_FROM_PREDICTED]: (
    <TableHeaderItem>
      <Trans>Price Change % from Predicted</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.VOLUME_CHANGE_PERCENTAGE__FROM_PREDICTED]: (
    <TableHeaderItem>
      <Trans>Volume Change % from Predicted</Trans>
    </TableHeaderItem>
  ),
}

const TableProperty = ({ tokenData, property }: { tokenData: DiscoverProToken; property: TableDetail }) => {
  const theme = useTheme()
  switch (property) {
    case TableDetail.RANK:
      return <TableBodyItem align="center">{tokenData.rank}</TableBodyItem>
    case TableDetail.NAME:
      return (
        <TableBodyItem>
          <img
            src={tokenData.logo_url}
            alt="icon"
            style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px', borderRadius: '50%' }}
          />
          <TruncatedText color={theme.subText}>{tokenData.name}</TruncatedText>
          <span style={{ color: theme.disableText }}>{tokenData.symbol}</span>
        </TableBodyItem>
      )
    case TableDetail.DISCOVERED_ON:
      return <TableBodyItem>{tokenData.discovered_on}</TableBodyItem>
    case TableDetail.LAST_RANK:
      return <TableBodyItem>{tokenData.last_predicted.rank}</TableBodyItem>
    case TableDetail.CURRENT_PRICE:
      return <TableBodyItem>{tokenData.price}</TableBodyItem>
    case TableDetail.CURRENT_VOLUME_24H:
      return <TableBodyItem>{tokenData.trading_volume}</TableBodyItem>
    case TableDetail.CURRENT_MARKET_CAP:
      return <TableBodyItem>{tokenData.market_cap}</TableBodyItem>
    case TableDetail.CURRENT_NUMBER_HOLDERS:
      return <TableBodyItem>{tokenData.number_holders}</TableBodyItem>
    case TableDetail.CURRENT_PRICE_CHANGE_PERCENTAGE_24H:
      return <TableBodyItem>{tokenData.price_change_percentage_24h}</TableBodyItem>
    case TableDetail.PREDICTED_PRICE:
      return <TableBodyItem>{tokenData.predicted_details.price}</TableBodyItem>
    case TableDetail.PREDICTED_VOLUME_24H:
      return <TableBodyItem>{tokenData.predicted_details.trading_volume}</TableBodyItem>
    case TableDetail.PREDICTED_MARKET_CAP:
      return <TableBodyItem>{tokenData.predicted_details.market_cap}</TableBodyItem>
    case TableDetail.PREDICTED_NUMBER_HOLDERS:
      return <TableBodyItem>{tokenData.predicted_details.number_holders}</TableBodyItem>
    case TableDetail.PREDICTED_PRICE_CHANGE_PERCENTAGE_24H:
      return <TableBodyItem>{tokenData.predicted_details.price_change_percentage_24h}</TableBodyItem>
    case TableDetail.PRICE_CHANGE_PERCENTAGE_FROM_PREDICTED:
      return <TableBodyItem>{tokenData.price_change_percentage_from_predicted}</TableBodyItem>
    case TableDetail.VOLUME_CHANGE_PERCENTAGE__FROM_PREDICTED:
      return <TableBodyItem>{tokenData.volume_change_percentage_from_predicted}</TableBodyItem>
    // default:
    //   return
  }
}

const DiscoverProTokenItem = ({
  tokenData,
  tableCustomize,
}: {
  tokenData: DiscoverProToken
  tableCustomize: TableDetail[]
}) => {
  const tableCustomizeLayout = tableCustomize.map(e => tableDetailsDisplay[e])
  return (
    <TableBodyWithDetailContainer isTrueSightToken={false} isSelected={false}>
      <TableBodyContainer tableLayout={tableCustomizeLayout}>
        {tableCustomize.map(property => (
          <TableProperty key={property} tokenData={tokenData} property={property} />
        ))}
      </TableBodyContainer>
    </TableBodyWithDetailContainer>
  )
}

function TrendingSoonTable({
  tableCustomize,
  setTableCustomize,
  discoverProTokensList,
}: {
  tableCustomize: TableDetail[]
  setTableCustomize: (tableCustomize: TableDetail[]) => void
  discoverProTokensList: DiscoverProToken[]
}) {
  const tableCustomizeLayout = tableCustomize.map(e => tableDetailsDisplay[e])

  const renderHeader = () => {
    return <TableHeader tableLayout={tableCustomizeLayout}>{tableCustomize.map(e => ListHeader[e])}</TableHeader>
  }
  const renderBody = () => {
    return discoverProTokensList.map(tokenData => (
      <DiscoverProTokenItem key={tokenData.token_id} tokenData={tokenData} tableCustomize={tableCustomize} />
    ))
  }
  return (
    <TableContainer>
      {renderHeader()}
      {renderBody()}
    </TableContainer>
  )
}

const TrendingSoonLayout = ({
  filter,
  setFilter,
  sortSettings,
  setSortSettings,
  tableCustomize,
  setTableCustomize,
}: {
  filter: DiscoverProFilter
  setFilter: React.Dispatch<React.SetStateAction<DiscoverProFilter>>
  sortSettings: DiscoverProSortSettings
  setSortSettings: React.Dispatch<React.SetStateAction<DiscoverProSortSettings>>
  tableCustomize: TableDetail[]
  setTableCustomize: React.Dispatch<React.SetStateAction<TableDetail[]>>
}) => {
  const {
    data: trendingSoonData,
    isLoading: isLoadingTrendingSoonTokens,
    error: errorWhenLoadingTrendingSoonData,
  } = useGetTrendingSoonData(filter, 999)

  const {
    data: trueSightFilterData,
    isLoading: isLoadingTrueSightFilterTokens,
    error: errorWhenLoadingTrueSightFilterData,
  } = useGetTrueSightFilterData(filter.timeframe)

  const discoverProTokensList = useMakeDiscoverProTokensList(
    trendingSoonData?.tokens ?? [],
    trueSightFilterData?.tokens ?? [],
  )

  return (
    <>
      <TrueSightContainer style={{ minHeight: 'unset' }}>
        <TrendingSoonTable
          tableCustomize={tableCustomize}
          setTableCustomize={setTableCustomize}
          discoverProTokensList={discoverProTokensList}
        />
      </TrueSightContainer>
    </>
  )
}

export default TrendingSoonLayout
