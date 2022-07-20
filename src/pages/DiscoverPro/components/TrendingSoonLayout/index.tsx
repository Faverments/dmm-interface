import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useMedia } from 'react-use'
import { TrueSightContainer } from 'pages/TrueSight/components/TrendingSoonLayout'
import TrendingTokenItemMobileOnly from 'pages/DiscoverPro/components/TrendingTokenItemMobileOnly'
import useGetTrendingSoonData, { TrueSightTokenData } from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import { TrueSightChartCategory, TrueSightFilter, TrueSightTimeframe } from 'pages/TrueSight/index'
import useGetCoinGeckoChartData from 'pages/TrueSight/hooks/useGetCoinGeckoChartData'
import useTheme from 'hooks/useTheme'
import Pagination from 'components/Pagination/index'
import { Box, Flex, Text, Image } from 'rebass'
import MobileChartModal from 'pages/DiscoverPro/components/MobileChartModal'
import useGetTrendingData from 'pages/TrueSight/hooks/useGetTrendingData'
import LocalLoader from 'components/LocalLoader'
import WarningIcon from 'components/LiveChart/WarningIcon'
import { Trans } from '@lingui/macro'
import styled from 'styled-components'
import ButtonWithOptions from 'pages/TrueSight/components/ButtonWithOptions'
import { ButtonEmpty } from 'components/Button'
import { ChevronDown } from 'react-feather'
import { TruncatedText } from 'pages/TrueSight/components/TrendingSoonLayout/TrendingSoonTokenItem'
import { formattedNumLong } from 'utils'
import { rgba } from 'polished'
import Tags from 'pages/DiscoverPro/components/Tags'
import CommunityButton, { StyledCommunityButton } from 'pages/TrueSight/components/CommunityButton'
import { ExternalLink } from 'theme'
import AddressButton from 'pages/TrueSight/components/AddressButton'
import {
  TagWebsiteCommunityAddressContainer,
  WebsiteCommunityAddressContainer,
} from 'pages/TrueSight/components/TrendingSoonLayout/TrendingSoonTokenDetail'
import Chart from 'pages/TrueSight/components/Chart'
import dayjs from 'dayjs'
import Divider from 'components/Divider'
import getFormattedNumLongDiscoveredDetails from 'pages/TrueSight/utils/getFormattedNumLongDiscoveredDetails'
import { TRENDING_ITEM_PER_PAGE, TRENDING_MAX_ITEM } from 'constants/index'

import {
  DiscoverProFilter,
  DiscoverProSortSettings,
  TableDetailObject,
  tableDetailsDisplay,
} from 'pages/DiscoverPro/TrueSight/index'
import { TableDetail, SortDirection, ChartDisplaySettings } from 'constants/discoverPro'
import Modal from 'components/Modal'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import TrendingSoonTokenDetail from 'pages/DiscoverPro/components/TrendingSoonTokenDetail'
import TrendingSoonTokenItem from 'pages/DiscoverPro/components/TrendingSoonTokenItem'

import useMakeDiscoverProTokensList, { DiscoverProToken } from 'pages/DiscoverPro/hooks/useMakeDiscoverProTokensList'
import useGetTrueSightFilterData from 'pages/DiscoverPro/hooks/useGetTrueSightFilterData'
import Gold from 'assets/svg/gold_icon.svg'
import Silver from 'assets/svg/silver_icon.svg'
import Bronze from 'assets/svg/bronze_icon.svg'

import { Circle, ArrowRight } from 'react-feather'

import useGetTokenPredictedDetails from 'pages/DiscoverPro/hooks/useGetTokenPredictedDetails'

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

const TableHeaderItem = styled.div<{ align?: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.subText};
  text-align: ${({ align }) => align ?? 'left'};
  text-transform: uppercase;
`

const ListHeader: {
  [key in TableDetail]: JSX.Element
} = {
  [TableDetail.RANK]: (
    <TableHeaderItem align="center" key={1}>
      <Trans>#</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.NAME]: (
    <TableHeaderItem key={2}>
      <Trans>Name</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.DISCOVERED_ON]: (
    <TableHeaderItem key={3}>
      <Trans>Discover On</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.LAST_RANK]: (
    <TableHeaderItem key={4}>
      <Trans>Last Rank</Trans>
    </TableHeaderItem>
  ),

  [TableDetail.CURRENT_PRICE]: (
    // <TableHeaderItem>
    //   <div
    //     style={{
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'flex-start',
    //     }}
    //   >
    //     <Trans>Price</Trans>
    //     <div
    //       style={{
    //         marginLeft: 4,
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //       }}
    //     >
    //       <Circle fill="#dad873" color="#dad873" size={12} />
    //       <ArrowRight size={12} />
    //       <Circle fill="#309975" color="#309975" size={12} />
    //     </div>
    //   </div>
    // </TableHeaderItem>
    <TableHeaderItem key={5}>
      <Trans>Price</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.CURRENT_VOLUME_24H]: (
    <TableHeaderItem align="right" key={6}>
      <Trans>Trading Volume (24H)</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.CURRENT_MARKET_CAP]: (
    <TableHeaderItem align="right" key={7}>
      <Trans>Market Cap</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.CURRENT_NUMBER_HOLDERS]: (
    <TableHeaderItem align="right" key={8}>
      <Trans>Holders</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.CURRENT_PRICE_CHANGE_PERCENTAGE_24H]: (
    <TableHeaderItem key={9}>
      <Trans>Current Price Change %</Trans>
    </TableHeaderItem>
  ),

  [TableDetail.PREDICTED_PRICE]: (
    <TableHeaderItem key={10}>
      <Trans>Predicted Price</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.PREDICTED_VOLUME_24H]: (
    <TableHeaderItem key={11}>
      <Trans>Predicted Volume</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.PREDICTED_MARKET_CAP]: (
    <TableHeaderItem key={12}>
      <Trans>Predicted Market Cap</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.PREDICTED_NUMBER_HOLDERS]: (
    <TableHeaderItem key={13}>
      <Trans>Predicted Number of Holders</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.PREDICTED_PRICE_CHANGE_PERCENTAGE_24H]: (
    <TableHeaderItem key={14}>
      <Trans>Predicted Price Change %</Trans>
    </TableHeaderItem>
  ),

  [TableDetail.PRICE_CHANGE_PERCENTAGE_FROM_PREDICTED]: (
    <TableHeaderItem key={15}>
      <Trans>Price Change % from Predicted</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.VOLUME_CHANGE_PERCENTAGE__FROM_PREDICTED]: (
    <TableHeaderItem key={16}>
      <Trans>Volume Change % from Predicted</Trans>
    </TableHeaderItem>
  ),
  [TableDetail.ACTION]: (
    <TableHeaderItem align="right" key={17}>
      <Trans>Actions</Trans>
    </TableHeaderItem>
  ),
}

const TableBody = ({
  tokenData,
  selectedToken,
  setSelectedToken,
  tableCustomize,
}: {
  tokenData: DiscoverProToken
  selectedToken: DiscoverProToken | undefined
  setSelectedToken: Dispatch<SetStateAction<DiscoverProToken | undefined>>
  tableCustomize: TableDetail[]
}) => {
  const isThisTokenSelected = !!selectedToken && selectedToken.token_id === tokenData.token_id
  const isTopToken = tokenData.rank == 1 || tokenData.rank == 2 || tokenData.rank == 3
  const date = dayjs(tokenData.discovered_on * 1000).format('YYYY/MM/DD')
  const formattedDetails = getFormattedNumLongDiscoveredDetails(tokenData)

  const toggleTrendingSoonTokenDetailModal = useToggleModal(ApplicationModal.TRENDING_SOON_TOKEN_DETAIL)

  const onSelectToken = () => {
    setSelectedToken(prev => (prev?.token_id === tokenData.token_id ? undefined : tokenData))
    toggleTrendingSoonTokenDetailModal()
  }
  const theme = useTheme()
  const tableCustomizeLayout = tableCustomize.map(e => tableDetailsDisplay[e])

  const TableProperty = ({ property }: { property: TableDetail }) => {
    const MedalIndex = () =>
      tokenData.rank === 1 ? (
        <Image src={Gold} style={{ minWidth: '18px' }} />
      ) : tokenData.rank === 2 ? (
        <Image src={Silver} style={{ minWidth: '18px' }} />
      ) : tokenData.rank === 3 ? (
        <Image src={Bronze} style={{ minWidth: '18px' }} />
      ) : tokenData.rank !== undefined ? (
        <Text fontSize="14px" fontWeight={500} color={theme.subText} width="18px" textAlign="center">
          {tokenData.rank}
        </Text>
      ) : null
    switch (property) {
      case TableDetail.RANK:
        return (
          <TableBodyItem align="left">
            <MedalIndex />
          </TableBodyItem>
        )
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
        return <TableBodyItem>{formattedNumLong(tokenData.price, true)}</TableBodyItem>
      case TableDetail.CURRENT_VOLUME_24H:
        return <TableBodyItem align="right">{formattedNumLong(tokenData.trading_volume, true)}</TableBodyItem>
      case TableDetail.CURRENT_MARKET_CAP:
        return (
          <TableBodyItem align="right">
            {tokenData.market_cap <= 0 ? '--' : formattedNumLong(tokenData.market_cap, true)}
          </TableBodyItem>
        )
      case TableDetail.CURRENT_NUMBER_HOLDERS:
        return (
          <TableBodyItem align="right">
            {tokenData.number_holders <= 0 ? '--' : formattedNumLong(tokenData.number_holders, false)}
          </TableBodyItem>
        )
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
      case TableDetail.ACTION:
        return (
          <TableBodyItem align="right" style={{ overflow: 'visible' }}>
            <ButtonWithOptions
              platforms={tokenData.platforms}
              style={{
                minWidth: 'fit-content',
                padding: '0 36px 0 12px',
                justifyContent: 'flex-start',
                height: '28px',
                zIndex: 'unset',
              }}
              tokenData={tokenData}
            />
            {/* <ButtonEmpty padding="0" height="100%" width="unset">
              <ChevronDown
                size={16}
                style={{ transform: isThisTokenSelected ? 'rotate(180deg)' : 'unset', minWidth: '16px' }}
              />
            </ButtonEmpty> */}
          </TableBodyItem>
        )
      // default:
      //   return
    }
  }

  return (
    <TableBodyWithDetailContainer isSelected={isThisTokenSelected} isTopToken={isTopToken}>
      <TableBodyContainer
        // onClick={() => setSelectedToken(prev => (prev?.token_id === tokenData.token_id ? undefined : tokenData))}
        onClick={onSelectToken}
        tableLayout={tableCustomizeLayout}
      >
        {tableCustomize.map(property => (
          <TableProperty key={property} property={property} />
        ))}
      </TableBodyContainer>
      {/* {isThisTokenSelected && isTopToken && (
        <>
          <TableBodyContainer style={{ cursor: 'default' }}>
            <TableBodyItemSmall style={{ fontStyle: 'italic' }}>
              <Trans>We discovered this on </Trans> {date}
            </TableBodyItemSmall>
            <TableBodyItemSmall>
              <TableBodyItemSmallDiff up={!formattedDetails.pricePercent.startsWith('-')}>
                {formattedDetails.pricePercent}
              </TableBodyItemSmallDiff>
              <span>{formattedDetails.price}</span>
            </TableBodyItemSmall>
            <TableBodyItemSmall align="right">
              <TableBodyItemSmallDiff up={!formattedDetails.tradingVolumePercent.startsWith('-')}>
                {formattedDetails.tradingVolumePercent}
              </TableBodyItemSmallDiff>
              <span>{formattedDetails.tradingVolume}</span>
            </TableBodyItemSmall>
            <TableBodyItemSmall align="right">
              <TableBodyItemSmallDiff up={!formattedDetails.marketCapPercent.startsWith('-')}>
                {formattedDetails.marketCapPercent}
              </TableBodyItemSmallDiff>
              <span>{formattedDetails.marketCap}</span>
            </TableBodyItemSmall>
            <TableBodyItemSmall align="right" />
            <TableBodyItemSmall />
          </TableBodyContainer>
          <Divider margin="10px 20px" />
        </>
      )}
      {isThisTokenSelected && (
        <Box padding="10px 20px 20px">
          <TagWebsiteCommunityAddressContainer>
            <Tags tags={tokenData.tags} setFilter={setFilter} backgroundColor={theme.tableHeader} />
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
          <Box height="360px" marginTop="20px">
            <Chart
              chartData={chartData}
              isLoading={isChartDataLoading}
              chartCategory={chartCategory}
              setChartCategory={setChartCategory}
              chartTimeframe={chartTimeframe}
              setChartTimeframe={setChartTimeframe}
            />
          </Box>
        </Box>
      )} */}
    </TableBodyWithDetailContainer>
  )
}

const TrendingLayout = ({
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
  const [selectedToken, setSelectedToken] = useState<DiscoverProToken>()
  const [isOpenChartModal, setIsOpenChartModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const above1200 = useMedia('(min-width: 1200px)')
  // const {
  //   data: trendingSoonData,
  //   isLoading: isLoadingTrendingSoonTokens,
  //   error: errorWhenLoadingTrendingSoonData,
  // } = useGetTrendingData(filter, currentPage, TRENDING_ITEM_PER_PAGE)

  const {
    data: trendingSoonData,
    isLoading: isLoadingTrendingSoonTokens,
    error: errorWhenLoadingTrendingSoonData,
  } = useGetTrendingSoonData(filter, TRENDING_MAX_ITEM)

  const {
    data: trueSightFilterData,
    isLoading: isLoadingTrueSightFilterTokens,
    error: errorWhenLoadingTrueSightFilterData,
  } = useGetTrueSightFilterData(filter.timeframe)

  // const trendingSoonTokens = trendingSoonData?.tokens ?? []

  const { tokens: discoverProTokens, total_number_tokens } = useMakeDiscoverProTokensList(
    trendingSoonData?.tokens ?? [],
    trueSightFilterData?.tokens ?? [],
    // currentPage,
    filter.selectedTokenStatus,
  )

  const sortedPaginatedDiscoverProTokens = useMemo(() => {
    return discoverProTokens.slice((currentPage - 1) * TRENDING_ITEM_PER_PAGE, currentPage * TRENDING_ITEM_PER_PAGE)
  }, [discoverProTokens, currentPage])

  useEffect(() => {
    setCurrentPage(1)
    setSelectedToken(undefined)
  }, [filter])

  const [chartTimeframe, setChartTimeframe] = useState<TrueSightTimeframe>(TrueSightTimeframe.ONE_DAY)
  const [chartCategory, setChartCategory] = useState<TrueSightChartCategory>(TrueSightChartCategory.TRADING_VOLUME)
  const tokenNetwork = useMemo(
    () => (selectedToken ? selectedToken.platforms.keys().next().value ?? undefined : undefined),
    [selectedToken],
  )

  const [chartDisplaySettings, setChartDisplaySettings] = useState<ChartDisplaySettings>({
    showPredictedDate: true,
    showRanking: true,
  })

  const tokenAddress = useMemo(
    () => (selectedToken && tokenNetwork ? selectedToken.platforms.get(tokenNetwork) : undefined),
    [selectedToken, tokenNetwork],
  )
  const { data: chartData, isLoading: isChartDataLoading } = useGetCoinGeckoChartData(
    tokenNetwork,
    tokenAddress,
    chartTimeframe,
  )

  const selectedTokenId = useMemo(() => (selectedToken ? selectedToken.token_id : undefined), [selectedToken])

  const {
    data: tokenPredictedDetails,
    isLoading: isTokenPredictedDetailsLoading,
    error: errorWhenLoadingTokenPredictedDetails,
  } = useGetTokenPredictedDetails(selectedTokenId, filter.timeframe)

  const theme = useTheme()

  const isTrendingSoonTokenDetailModalOpen = useModalOpen(ApplicationModal.TRENDING_SOON_TOKEN_DETAIL)
  const toggleTrendingSoonTokenDetailModal = useToggleModal(ApplicationModal.TRENDING_SOON_TOKEN_DETAIL)

  const onDismiss = () => {
    toggleTrendingSoonTokenDetailModal()
    setSelectedToken(undefined)
  }

  const tableCustomizeLayout = tableCustomize.map(e => tableDetailsDisplay[e])

  const above768 = useMedia('(min-width: 768px)')

  const MobileLayout = () => (
    <Box overflow="hidden">
      {sortedPaginatedDiscoverProTokens.map(tokenData => (
        <TrendingTokenItemMobileOnly
          key={tokenData.token_id}
          isSelected={selectedToken?.token_id === tokenData.token_id}
          tokenData={tokenData}
          onSelect={() => setSelectedToken(prev => (prev?.token_id === tokenData.token_id ? undefined : tokenData))}
          setIsOpenChartModal={setIsOpenChartModal}
          setFilter={setFilter as React.Dispatch<React.SetStateAction<TrueSightFilter>>}
        />
      ))}
      <Pagination
        pageSize={TRENDING_ITEM_PER_PAGE}
        onPageChange={newPage => setCurrentPage(newPage)}
        currentPage={currentPage}
        totalCount={trendingSoonData?.total_number_tokens ?? 1}
      />
      <MobileChartModal
        isOpen={isOpenChartModal}
        setIsOpen={setIsOpenChartModal}
        chartData={chartData}
        isLoading={isChartDataLoading}
        chartCategory={chartCategory}
        setChartCategory={setChartCategory}
        chartTimeframe={chartTimeframe}
        setChartTimeframe={setChartTimeframe}
      />
    </Box>
  )

  const DesktopLayout = () => (
    <TableContainer>
      <TableHeader tableLayout={tableCustomizeLayout}>
        {/* <TableHeaderItem>
          <Trans>Name</Trans>
        </TableHeaderItem>
        <TableHeaderItem>
          <Trans>Price</Trans>
        </TableHeaderItem>
        <TableHeaderItem align="right">
          <Trans>Trading Volume (24H)</Trans>
        </TableHeaderItem>
        <TableHeaderItem align="right">
          <Trans>Market Cap</Trans>
        </TableHeaderItem>
        <TableHeaderItem align="right">
          <Trans>Holders</Trans>
        </TableHeaderItem>
        <TableHeaderItem align="right">
          <Trans>Actions</Trans>
        </TableHeaderItem> */}
        {tableCustomize.map(e => ListHeader[e])}
      </TableHeader>
      {sortedPaginatedDiscoverProTokens.map(tokenData => (
        <TableBody
          key={tokenData.token_id}
          tokenData={tokenData}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          tableCustomize={tableCustomize}
        />
      ))}
      <Pagination
        pageSize={TRENDING_ITEM_PER_PAGE}
        onPageChange={newPage => setCurrentPage(newPage)}
        currentPage={currentPage}
        totalCount={total_number_tokens ?? 1}
      />
    </TableContainer>
  )

  return (
    <div>
      {above768 ? (
        <Modal isOpen={isTrendingSoonTokenDetailModalOpen} onDismiss={onDismiss} maxWidth="928px">
          {selectedToken && (
            <Scrollable>
              <TrendingSoonTokenDetail
                tokenData={selectedToken}
                chartData={chartData}
                isChartDataLoading={isChartDataLoading}
                chartCategory={chartCategory}
                setChartCategory={setChartCategory}
                chartTimeframe={chartTimeframe}
                setChartTimeframe={setChartTimeframe}
                setFilter={undefined}
                predictedDetails={tokenPredictedDetails}
                isPredictedDetailsLoading={isTokenPredictedDetailsLoading}
                chartDisplaySettings={chartDisplaySettings}
                setChartDisplaySettings={setChartDisplaySettings}
                style={{
                  // width: '928px',
                  // height: '570px',
                  padding: '20px',
                }}
              />
            </Scrollable>
          )}
        </Modal>
      ) : (
        <Modal isOpen={isTrendingSoonTokenDetailModalOpen} onDismiss={onDismiss}>
          {selectedToken && (
            <Box width="100%">
              <TrendingSoonTokenItem
                isSelected={true}
                tokenIndex={undefined}
                tokenData={selectedToken}
                onSelect={undefined}
                setIsOpenChartModal={setIsOpenChartModal}
                setFilter={undefined}
                isShowMedal={false}
              />
            </Box>
          )}
        </Modal>
      )}
      <TrueSightContainer style={{ minHeight: 'unset' }}>
        {isLoadingTrendingSoonTokens || isLoadingTrueSightFilterTokens ? (
          <LocalLoader />
        ) : errorWhenLoadingTrendingSoonData ||
          errorWhenLoadingTrueSightFilterData ||
          sortedPaginatedDiscoverProTokens.length === 0 ? (
          <Flex
            flexDirection="column"
            height="100%"
            justifyContent="center"
            alignItems="center"
            style={{ height: '616px', gap: '16px' }}
          >
            <WarningIcon />
            <Text color={theme.disableText}>
              {sortedPaginatedDiscoverProTokens.length === 0 && filter.isShowTrueSightOnly ? (
                <Trans>No token found. Try turn off truesight.</Trans>
              ) : (
                <Trans>No token found</Trans>
              )}
            </Text>
          </Flex>
        ) : above1200 ? (
          <DesktopLayout />
        ) : (
          <MobileLayout />
        )}
      </TrueSightContainer>
    </div>
  )
}

export default TrendingLayout

const Scrollable = styled.div`
  overflow-y: scroll;
  scroll-behavior: smooth;
  width: 100%;
`

const TableContainer = styled.div`
  border-radius: 8px;
`

const TableHeader = styled.div<{ tableLayout: TableDetailObject[] }>`
  display: grid;
  padding: 18px 20px;
  grid-template-columns: ${({ tableLayout }) => tableLayout.map(e => e.template).join(' ')};
  background: ${({ theme }) => theme.tableHeader};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  gap: 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const TableBodyWithDetailContainer = styled.div<{ isTopToken: boolean; isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme, isTopToken, isSelected }) =>
    isSelected ? theme.tableHeader : isTopToken ? rgba(theme.bg8, 0.12) : theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const TableBodyContainer = styled.div<{ tableLayout: TableDetailObject[] }>`
  display: grid;
  padding: 10px 20px;
  grid-template-columns: ${({ tableLayout }) => tableLayout.map(e => e.template).join(' ')};
  gap: 16px;
  cursor: pointer;
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

export const TableBodyItemSmall = styled(TableBodyItem)`
  font-size: 12px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: ${({ align }) => (align === 'right' ? 'flex-end' : 'flex-start')};
  gap: 8px;
`

export const TableBodyItemSmallDiff = styled.div<{ up: boolean }>`
  font-size: 10px;
  color: ${({ theme, up }) => (up ? theme.apr : theme.red)};
  background: ${({ theme, up }) => (up ? rgba(theme.apr, 0.2) : rgba(theme.red, 0.2))};
  padding: 5px 8px;
  border-radius: 24px;
`
