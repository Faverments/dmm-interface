import { NANSEN_PORTFOLIO_API, NANSEN_PORTFOLIO_PASSCODE } from 'services/config'
import { WalletDetails } from 'services/zapper/hooks/useBalances'
import useSWR from 'swr'

import { HistoryPricesResponse, TokensParam } from './types'

export * from './types'

export function useGetHistoricalPrices(tokens: TokensParam, wallet: WalletDetails) {
  const fetcher = (url: string) =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'ape-secret':
        //   // "U2FsdGVkX18EGUu6+vHHibJOghKAqVYZirkkCXGG9tswaYGZmN95Yd3tBb+XVB6LF72V39swB8K+RoUPgn4XZxvIlBPndYapOEdyHJxGCpRMwJVd6MqElb4Bp2rWQn6G+FxKxIPNFkuGaUN9Sh/SIA==",
        //   'U2FsdGVkX1/Di3weetIBSnIUzfLc1QJ+hGmcPfFWh/RxNPpEW2LXgDOVDO41+S20PAfnz+ldePhMSdxlznns6g==',
        // U2FsdGVkX1+8coz8f0ZVncjuphnzIoHtV+yk2dUtSumpv1CmrtCTZnbwLvdXZKbfGc2eGEeSF2fHvMzbGXq4Vw==
        // authorization:
        //   // "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMzdkNTkzNjVjNjIyOGI4Y2NkYWNhNTM2MGFjMjRkMDQxNWMxZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZDUtbmFuc2VuLXByb2QiLCJhdWQiOiJkNS1uYW5zZW4tcHJvZCIsImF1dGhfdGltZSI6MTY2NzY2MjcyMiwidXNlcl9pZCI6IlN5clRjNDdCY2NaSENWWkFzRVRkbUhmd0l5RzIiLCJzdWIiOiJTeXJUYzQ3QmNjWkhDVlpBc0VUZG1IZndJeUcyIiwiaWF0IjoxNjY3NjYyNzIyLCJleHAiOjE2Njc2NjYzMjIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.xLOYc01fJs-HWzpOVTkXBKZ-dRTxh4WbERKFmsykP0OT-UXStAYVGxDU5k64jKgqr46-yfPzvE8QRmMkFjS0tNfvmzJcln7UweVyEXdO0IuMefACL515tP1AOWYV8G-GyppxGd8vDiu-M5ysyoE4b67MDdOm15G0O2V0CkxU6i-dDZFFFFJz5gcX_-_r65p1rc90G3V3__hqYb5uWWLd5B1XRdaLEcItSTeEjTt6B0y3eSDA3SoMo0Ros6_Ac0x5eUxIop-EuUoIIDAKGM-V8Qu70ZceoeuZqWU4B9E6M5Trjl6WHqm5-sNdOCv2ER6wESQAgVDldVKFihwmHnqcqw",
        //   'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMzdkNTkzNjVjNjIyOGI4Y2NkYWNhNTM2MGFjMjRkMDQxNWMxZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZDUtbmFuc2VuLXByb2QiLCJhdWQiOiJkNS1uYW5zZW4tcHJvZCIsImF1dGhfdGltZSI6MTY2Nzc0NjM3MSwidXNlcl9pZCI6IkhQdmxQWnJmNHhSV2hieVFzVEVFUHRFMDRXdzIiLCJzdWIiOiJIUHZsUFpyZjR4UldoYnlRc1RFRVB0RTA0V3cyIiwiaWF0IjoxNjY3NzQ2MzcxLCJleHAiOjE2Njc3NDk5NzEsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.wszfAxYNzGznoUGORikyae5xMmtrn0zicdktFoo3iydHXw7BfsNIZ0SU5DvW45SUuK0qbG0Hbb1ezLpeVdtmASkIk-gBpS1dljDzwnmegHCbuaTL6nOtvmTfEHaJwSJlslDOhU_nuvmycRdA1nyKWD76KWVquPUuJ0tcuCAhKvVjolI_HXpSosgooJgPZpGr_Tltz1qKxGx_8sSJ53OpLnZ4caSs7pDjpRusiLogblHqAYpKZPajUrc-1bfwLSTh6RWx1-xRxThDKAfUEdQQ8S6cOiAn4WAAKCcDaHhzN57wnJu3dTh3ZdtWi2wPK77BJJ-SIfalaoA4XOs-6_jq8Q',
        passcode: NANSEN_PORTFOLIO_PASSCODE,
        // A63uGa8775Ne89wwqADwKYGeyceXAxmHL
      },
      body: JSON.stringify(tokens),
    }).then(r => r.json())
  const url = `${NANSEN_PORTFOLIO_API}/historical-price`
  const { data, error } = useSWR<HistoryPricesResponse>(Object.keys(wallet).length >= 7 ? url : null, fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
