/* eslint-disable @typescript-eslint/camelcase */
import { formattedNumLong } from 'utils'
import { DiscoverProToken } from '../hooks/useMakeDiscoverProTokensList'

interface PredictedDetails {
  price: string
  pricePercent: string
  tradingVolume: string
  tradingVolumePercent: string
  marketCap: string
  marketCapPercent: string
  numberHolders: string
  numberHoldersPercent: string
}

export default function getFormattedNumLongDiscoverProTokenDetails(
  tokenData: DiscoverProToken,
): {
  predicted_details: PredictedDetails
  last_predicted: PredictedDetails
} {
  const {
    price,
    trading_volume,
    market_cap,
    number_holders,
    discovered_details,
    predicted_details,
    last_predicted,
  } = tokenData

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
  return {
    predicted_details: getPredictedDetailsFormat(
      predicted_details.price,
      predicted_details.trading_volume,
      predicted_details.market_cap,
      predicted_details.number_holders,
    ),
    last_predicted: getPredictedDetailsFormat(
      last_predicted.price,
      last_predicted.trading_volume,
      last_predicted.market_cap,
      last_predicted.number_holders,
    ),
  }
}
