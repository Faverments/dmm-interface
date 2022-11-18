export interface TokenApprovalsResponse {
  approvals: TokenApproval[]
  atRisk: { [key: string]: number }
}

export interface TokenApproval {
  ownerAddress: string
  chainId: number
  tokenAddress: string
  spenderAddress: string
  amount: string
  lastUpdateTxHash: string
  lastUpdateTimestamp: string
  spenderName: string
  symbol: string
  name: string
  logo: string
  tag: string
  decimals: number
}

// export enum Tag {
//   Empty = '',
//   Unverified = 'UNVERIFIED',
//   Verified = 'VERIFIED',
// }
