// import { TEN, SolidityType } from '../../constants'
// import { parseBigintIsh, validateSolidityTypeInstance } from '../../utils'
import {
  BigintIsh,
  Fraction,
  JSBI,
  Rounding,
  SolidityType,
  parseBigintIsh,
  validateSolidityTypeInstance,
} from 'anyswap-sdk'
import _Big from 'big.js'
import invariant from 'tiny-invariant'
import toFormat from 'toformat'

const Big = toFormat(_Big)

const TEN = JSBI.BigInt(10)

export class BigAmount extends Fraction {
  public readonly decimals: number

  public static format(decimals: number, amount: BigintIsh): BigAmount {
    return new BigAmount(decimals, amount)
  }

  // amount _must_ be raw, i.e. in the native representation
  protected constructor(decimals: number, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

    super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(decimals)))
    this.decimals = decimals
  }

  public get raw(): JSBI {
    return this.numerator
  }

  public toSignificant(
    significantDigits = 6,
    format?: Record<string, unknown>,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.decimals,
    format?: Record<string, unknown>,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    invariant(decimalPlaces <= this.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: Record<string, unknown> = { groupSeparator: '' }): string {
    Big.DP = this.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }
}
