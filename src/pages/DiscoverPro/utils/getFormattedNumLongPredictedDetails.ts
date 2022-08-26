/* eslint-disable @typescript-eslint/camelcase */
import { formattedNumLong } from 'utils'
import { PredictedDetails } from '../hooks/useGetTokenPredictedDetails'
import { DiscoverProToken } from '../hooks/useMakeDiscoverProTokensList'

interface PredictedDetailsFormat {
  price: string
  pricePercent: string
  tradingVolume: string
  tradingVolumePercent: string
  marketCap: string
  marketCapPercent: string
  numberHolders: string
  numberHoldersPercent: string
}

export default function getFormattedNumLongPredictedDetails(
  tokenData: DiscoverProToken,
  predictedDetail: PredictedDetails,
): PredictedDetailsFormat {
  const { price, trading_volume, market_cap, number_holders, discovered_details } = tokenData

  function getPredictedDetailsFormat(
    Pprice: number,
    Ptrading_volume: number,
    Pmarket_cap: number,
    Pnumber_holders: number,
  ) {
    return {
      price: Pprice <= 0 ? '--' : formattedNumLong(Pprice, true),
      pricePercent: price <= 0 || Pprice <= 0 ? '--' : formattedNumLong((price / Pprice) * 100 - 100, false) + '%',
      tradingVolume: Ptrading_volume <= 0 ? '--' : formattedNumLong(Ptrading_volume, true),
      tradingVolumePercent:
        trading_volume <= 0 || Ptrading_volume <= 0
          ? '--'
          : formattedNumLong((trading_volume / Ptrading_volume) * 100 - 100, false) + '%',
      marketCap: Pmarket_cap <= 0 ? '--' : formattedNumLong(Pmarket_cap, true),
      marketCapPercent:
        market_cap <= 0 || Pmarket_cap <= 0
          ? '--'
          : formattedNumLong((market_cap / Pmarket_cap) * 100 - 100, false) + '%',
      numberHolders: Pnumber_holders <= 0 ? '--' : formattedNumLong(Pnumber_holders, false),
      numberHoldersPercent:
        number_holders <= 0 || Pnumber_holders <= 0
          ? '--'
          : formattedNumLong((number_holders / Pnumber_holders) * 100 - 100, false) + '%',
    }
  }
  return getPredictedDetailsFormat(
    predictedDetail.price,
    predictedDetail.trading_volume,
    predictedDetail.market_cap,
    predictedDetail.number_holders,
  )
}
