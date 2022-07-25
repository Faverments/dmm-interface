import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from 'rebass'
import { Trans } from '@lingui/macro'
import Divider from 'components/Divider'
import ButtonWithOptions from 'pages/TrueSight/components/ButtonWithOptions'
import AddressButton from 'pages/TrueSight/components/AddressButton'
import CommunityButton, { StyledCommunityButton } from 'pages/TrueSight/components/CommunityButton'
import { ExternalLink, theme } from 'theme'
import Tags from 'pages/DiscoverPro/components/Tags'
import Chart from 'pages/DiscoverPro/components/Chart'
import { TrueSightTokenData } from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import { formattedNumLong } from 'utils'
import { FormattedCoinGeckoChartData } from 'pages/TrueSight/hooks/useGetCoinGeckoChartData'
import { TrueSightChartCategory, TrueSightFilter, TrueSightTimeframe } from 'pages/TrueSight/index'

import { DiscoverProFilter } from 'pages/DiscoverPro/TrueSight'
import { DiscoverProToken } from '../hooks/useMakeDiscoverProTokensList'
import { TableBodyItemSmall } from './TrendingSoonLayout'
import { PredictedDetails } from 'pages/DiscoverPro/hooks/useGetTokenPredictedDetails'

import dayjs from 'dayjs'
import { ChartDisplaySettings } from 'constants/discoverPro'
import { rgba } from 'polished'
import { AutoColumn } from 'components/Column'
import useTheme from 'hooks/useTheme'
import getFormattedNumLongDiscoverProTokenDetails from '../utils/getFormattedNumLongDiscoveredDetails'
import { Award } from 'react-feather'

const TrendingSoonTokenDetail = ({
  tokenData,
  chartData,
  isChartDataLoading,
  chartCategory,
  setChartCategory,
  chartTimeframe,
  setChartTimeframe,
  setFilter,
  style,
  predictedDetails,
  isPredictedDetailsLoading,
  chartDisplaySettings,
  setChartDisplaySettings,
}: {
  tokenData: DiscoverProToken
  isChartDataLoading: boolean
  chartData: FormattedCoinGeckoChartData
  chartCategory: TrueSightChartCategory
  setChartCategory: React.Dispatch<React.SetStateAction<TrueSightChartCategory>>
  chartTimeframe: TrueSightTimeframe
  setChartTimeframe: React.Dispatch<React.SetStateAction<TrueSightTimeframe>>
  setFilter?: React.Dispatch<React.SetStateAction<DiscoverProFilter>>
  style?: CSSProperties
  predictedDetails: PredictedDetails[]
  isPredictedDetailsLoading: boolean
  chartDisplaySettings: ChartDisplaySettings
  setChartDisplaySettings: React.Dispatch<React.SetStateAction<ChartDisplaySettings>>
}) => {
  const now = dayjs().format('h:m A - MMM D')
  const predictedDate = dayjs(Number(tokenData.predicted_date) * 1000).format('h:m A - MMM D')
  const lastPredictedDate = dayjs(Number(tokenData.last_predicted.predicted_date) * 1000).format('h:m A - MMM D')
  // console.log(tokenData)
  const theme = useTheme()
  const formattedDetails = getFormattedNumLongDiscoverProTokenDetails(tokenData)
  return (
    <Flex flexDirection="column" style={{ ...style, gap: '24px' }}>
      <LogoNameSwapContainer>
        <LogoNameContainer>
          <img
            src={tokenData.logo_url}
            style={{ minWidth: '36px', width: '36px', minHeight: '36px', height: '36px', borderRadius: '50%' }}
            alt="logo"
          />
          <Text fontWeight={500} style={{ textTransform: 'uppercase' }}>
            {tokenData.name}
          </Text>
        </LogoNameContainer>
        <ButtonWithOptions platforms={tokenData.platforms} tokenData={tokenData} />
      </LogoNameSwapContainer>
      <TagWebsiteCommunityAddressContainer>
        <Tags tags={tokenData.tags} setFilter={setFilter} />
        <WebsiteCommunityAddressContainer>
          <StyledCommunityButton
            as={ExternalLink}
            href={tokenData.official_web}
            target="_blank"
            style={{ fontWeight: 400 }}
          >
            Website ↗
          </StyledCommunityButton>
          <CommunityButton communityOption={tokenData.social_urls} />
          <AddressButton platforms={tokenData.platforms} />
        </WebsiteCommunityAddressContainer>
      </TagWebsiteCommunityAddressContainer>

      {/*  */}
      {/* <Flex flexDirection="column" style={{ gap: '12px' }}>
        <TokenStatisticsContainer>
          <TokenStatisticsFieldName style={{ textAlign: 'left' }}>
            <Trans>Trading Volume (24H)</Trans>
          </TokenStatisticsFieldName>
          <TokenStatisticsFieldName>
            <Trans>Market Cap</Trans>
          </TokenStatisticsFieldName>
          <TokenStatisticsFieldName>
            <Trans>Holders</Trans>
          </TokenStatisticsFieldName>
          <TokenStatisticsFieldName>
            <Trans>Price</Trans>
          </TokenStatisticsFieldName>
          <TokenStatisticsValue style={{ textAlign: 'left' }}>
            {formattedNumLong(tokenData.trading_volume, true)}
          </TokenStatisticsValue>
          <TokenStatisticsValue>
            {tokenData.market_cap <= 0 ? '--' : formattedNumLong(tokenData.market_cap, true)}
          </TokenStatisticsValue>
          <TokenStatisticsValue>
            {tokenData.number_holders <= 0 ? '--' : formattedNumLong(tokenData.number_holders, false)}
          </TokenStatisticsValue>
          <TokenStatisticsValue>{formattedNumLong(tokenData.price, true)}</TokenStatisticsValue>
        </TokenStatisticsContainer>
      </Flex> */}
      <Text fontWeight={400} fontSize={12} color={theme.subText} fontStyle="italic">
        History details of the token
      </Text>
      <Flex flexDirection="row" style={{ gap: 30 }}>
        {/* IN_DEV TIMELINE */}
        {/* <div style={{ height: 'auto', display: 'flex', alignItems: 'center', marginLeft: 10 }}>
          <TimeLine />
        </div> */}
        <TableWrapper>
          <AutoColumn gap="16px">
            <>
              <LayoutWrapper>
                <TableHeaderItem>Time</TableHeaderItem>
                <TableHeaderItem align="right">Trading Volume (24H)</TableHeaderItem>
                <TableHeaderItem align="right">Market Cap</TableHeaderItem>
                <TableHeaderItem align="right">Holders</TableHeaderItem>
                <TableHeaderItem align="right">Price</TableHeaderItem>
              </LayoutWrapper>
            </>
            <>
              <LayoutWrapper>
                <TableBodyItem>
                  Current <span style={{ fontStyle: 'italic', color: theme.subText, fontSize: 12 }}>( {now} )</span>
                </TableBodyItem>
                <TableBodyItem style={{ textAlign: 'left' }} align="right">
                  {formattedNumLong(tokenData.trading_volume, true)}
                </TableBodyItem>
                <TableBodyItem align="right">
                  {tokenData.market_cap <= 0 ? '--' : formattedNumLong(tokenData.market_cap, true)}
                </TableBodyItem>
                <TableBodyItem align="right">
                  {tokenData.number_holders <= 0 ? '--' : formattedNumLong(tokenData.number_holders, false)}
                </TableBodyItem>
                <TableBodyItem align="right">{formattedNumLong(tokenData.price, true)}</TableBodyItem>
              </LayoutWrapper>
            </>
            <>
              <LayoutWrapper>
                <TableBodyItem>
                  <span
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                  >
                    Predicted Point{' '}
                    <RankWrapper>
                      <Award size={14} />
                      {tokenData.rank}
                    </RankWrapper>
                  </span>
                  <span style={{ fontStyle: 'italic', color: theme.subText, fontSize: 12 }}>( {predictedDate} )</span>
                </TableBodyItem>
                <TableBodyItem style={{ textAlign: 'left' }} align="right">
                  <TableBodyItemDiff up={!formattedDetails.predicted_details.tradingVolumePercent.startsWith('-')}>
                    {formattedDetails.predicted_details.tradingVolumePercent}
                  </TableBodyItemDiff>
                  <span>{formattedDetails.predicted_details.tradingVolume}</span>
                </TableBodyItem>
                <TableBodyItem align="right">
                  <TableBodyItemDiff up={!formattedDetails.predicted_details.marketCapPercent.startsWith('-')}>
                    {formattedDetails.predicted_details.marketCapPercent}
                  </TableBodyItemDiff>
                  <span>{formattedDetails.predicted_details.marketCap}</span>
                </TableBodyItem>
                <TableBodyItem align="right">
                  <TableBodyItemDiff up={!formattedDetails.predicted_details.numberHoldersPercent.startsWith('-')}>
                    {formattedDetails.predicted_details.numberHoldersPercent}
                  </TableBodyItemDiff>
                  <span>{formattedDetails.predicted_details.numberHolders}</span>
                </TableBodyItem>
                <TableBodyItem align="right">
                  <TableBodyItemDiff up={!formattedDetails.predicted_details.pricePercent.startsWith('-')}>
                    {formattedDetails.predicted_details.pricePercent}
                  </TableBodyItemDiff>
                  <span>{formattedDetails.predicted_details.price}</span>
                </TableBodyItem>
              </LayoutWrapper>
            </>
            <>
              <LayoutWrapper>
                <TableBodyItem>
                  <span
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                  >
                    Last Predicted{' '}
                    <RankWrapper>
                      <Award size={14} />
                      {tokenData.last_predicted.rank}
                    </RankWrapper>
                  </span>
                  <span style={{ fontStyle: 'italic', color: theme.subText, fontSize: 12 }}>
                    ( {lastPredictedDate} )
                  </span>
                </TableBodyItem>
                <TableBodyItem style={{ textAlign: 'left' }} align="right">
                  <TableBodyItemDiff up={!formattedDetails.last_predicted.tradingVolumePercent.startsWith('-')}>
                    {formattedDetails.last_predicted.tradingVolumePercent}
                  </TableBodyItemDiff>
                  <span>{formattedDetails.last_predicted.tradingVolume}</span>
                </TableBodyItem>
                <TableBodyItem align="right">
                  <TableBodyItemDiff up={!formattedDetails.last_predicted.marketCapPercent.startsWith('-')}>
                    {formattedDetails.last_predicted.marketCapPercent}
                  </TableBodyItemDiff>
                  <span>{formattedDetails.last_predicted.marketCap}</span>
                </TableBodyItem>
                <TableBodyItem align="right">
                  <TableBodyItemDiff up={!formattedDetails.last_predicted.numberHoldersPercent.startsWith('-')}>
                    {formattedDetails.last_predicted.numberHoldersPercent}
                  </TableBodyItemDiff>
                  <span>{formattedDetails.last_predicted.numberHolders}</span>
                </TableBodyItem>
                <TableBodyItem align="right">
                  <TableBodyItemDiff up={!formattedDetails.last_predicted.pricePercent.startsWith('-')}>
                    {formattedDetails.last_predicted.pricePercent}
                  </TableBodyItemDiff>
                  <span>{formattedDetails.last_predicted.price}</span>
                </TableBodyItem>
              </LayoutWrapper>
            </>
          </AutoColumn>
        </TableWrapper>
      </Flex>
      {/* <Divider /> */}
      <div
        style={{
          height: '320px',
        }}
      >
        <Chart
          chartData={chartData}
          isLoading={isChartDataLoading}
          chartCategory={chartCategory}
          setChartCategory={setChartCategory}
          chartTimeframe={chartTimeframe}
          setChartTimeframe={setChartTimeframe}
          predictedDetails={predictedDetails}
          isPredictedDetailsLoading={isPredictedDetailsLoading}
          chartDisplaySettings={chartDisplaySettings}
          setChartDisplaySettings={setChartDisplaySettings}
        />
      </div>
    </Flex>
  )
}

const LogoNameSwapContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`

const LogoNameContainer = styled(Flex)`
  align-items: center;
  gap: 8px;
`

export const TagWebsiteCommunityAddressContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`

export const WebsiteCommunityAddressContainer = styled(Flex)`
  align-items: center;
  gap: 8px;
`

const TokenStatisticsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 4px;
`

const TokenStatisticsFieldName = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
  text-align: right;
`

const TokenStatisticsValue = styled(Text)`
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  text-align: right;
  width: 100%;
`

const TableWrapper = styled.div`
  border-radius: 8px;
  padding: 16px;
  background: ${({ theme }) => rgba(theme.buttonBlack, 0.2)};
  flex-basis: 100%;
`

const TimeLine = styled.div`
  width: 2px;
  background-color: ${({ theme }) => theme.border};
  height: 80%;
`
const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.25fr 1.5fr 1fr 1fr 1fr;
  border-bottom: 0.5px solid ${({ theme }) => (theme.darkMode ? rgba(theme.border, 0.2) : theme.border)};
  padding-bottom: 16px;
`
const TableHeaderItem = styled.div<{ align?: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.subText};
  text-align: ${({ align }) => align ?? 'left'};
  text-transform: uppercase;
`

const TableBodyItem = styled.div<{ align?: string }>`
  font-size: 14px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: ${({ align }) => (align === 'right' ? 'flex-end' : 'flex-start')};
  gap: 8px;
  color: ${({ theme }) => rgba(theme.text, 0.85)};
`
const TableBodyItemDiff = styled.div<{ up: boolean }>`
  font-size: 12px;
  color: ${({ theme, up }) => (up ? theme.primary : theme.red2)};
  background: ${({ theme, up }) => (up ? rgba(theme.primary, 0.08) : rgba(theme.red2, 0.08))};
  padding: 5px 8px;
  border-radius: 16px;
  width: fit-content;
`

const RankWrapper = styled.span`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  background: ${({ theme }) => theme.buttonBlack};
  padding: 5px 6px 3px 4px;
  border-radius: 8px;
  display: flex;
  width: fit-content;
  margin-left: 5px;
`

export default TrendingSoonTokenDetail
