import { formatUnits, parseUnits } from '@ethersproject/units'

import { USE_VERSION } from '../config/constant'
import config from '../config/index'

const VERSION = 'VERSION'

export function getLocalConfig(
  account: string,
  token: string,
  chainID: any,
  type: string,
  timeout?: string | number | undefined,
  saveType?: number | undefined,
  version?: string,
) {
  version = version ? version : USE_VERSION
  const curVersion = window.localStorage.getItem(version + '_' + VERSION)
  // console.log(curVersion)
  if (curVersion && curVersion !== config.version) {
    sessionStorage.clear()
    return false
  }
  const lStorage = saveType ? window.localStorage : window.sessionStorage
  // console.log(version + '_' + type)
  const lstr = lStorage.getItem(version + '_' + type)
  if (!lstr) {
    return false
  } else {
    const lboj = JSON.parse(lstr)
    // console.log(lboj)
    if (!lboj[chainID]) {
      return false
    } else if (!lboj[chainID][account]) {
      return false
    } else if (!lboj[chainID][account][token] && token !== 'all') {
      return false
    } else if (
      (lboj[chainID][account].timestamp < config.localDataDeadline && token !== 'all') ||
      (lboj[chainID][account].timestamp < config.localDataDeadline && token === 'all')
    ) {
      // 在某个时间之前的数据无效
      lStorage.setItem(version + '_' + type, '')
      return false
    } else if (token === 'all') {
      return lboj[chainID][account]
    } else if (timeout && Date.now() - lboj[chainID][account][token].timestamp > timeout) {
      return false
    } else {
      return lboj[chainID][account][token]
    }
  }
}

export function setLocalConfig(
  account: string,
  token: string,
  chainID: any,
  type: string,
  data: any,
  saveType?: number | undefined,
  version?: string,
) {
  version = version ? version : USE_VERSION
  const lStorage = saveType ? window.localStorage : window.sessionStorage
  const lstr = lStorage.getItem(version + '_' + type)
  let lboj: any = {}
  if (!lstr) {
    lboj[chainID] = { timestamp: Date.now() }
    lboj[chainID][account] = { timestamp: Date.now() }
    lboj[chainID][account][token] = {
      ...data,
      timestamp: Date.now(),
    }
  } else {
    lboj = JSON.parse(lstr)
    if (!lboj[chainID]) {
      lboj[chainID] = { timestamp: Date.now() }
      lboj[chainID][account] = { timestamp: Date.now() }
      lboj[chainID][account][token] = {
        ...data,
        timestamp: Date.now(),
      }
    } else if (!lboj[chainID][account]) {
      lboj[chainID] = {
        ...lboj[chainID],
        timestamp: Date.now(),
      }
      lboj[chainID][account] = { timestamp: Date.now() }
      lboj[chainID][account][token] = {
        ...data,
        timestamp: Date.now(),
      }
    } else {
      lboj[chainID][account][token] = {
        ...data,
        timestamp: Date.now(),
      }
    }
  }
  window.localStorage.setItem(version + '_' + VERSION, config.version)
  lStorage.setItem(version + '_' + type, JSON.stringify(lboj))
}

export function fromWei(value: any, decimals?: number, dec?: number) {
  if (!value || !value) {
    return ''
  }
  if (Number(value) === 0) {
    return 0
  }
  decimals = decimals !== undefined ? decimals : 18
  if (dec) {
    return formatDecimal(Number(formatUnits(value.toString(), decimals)), dec)
  }
  // return formatUnits(value.toString(), decimals)
  return Number(formatUnits(value.toString(), decimals))
}

export function formatDecimal(num: any, decimal: number) {
  if (isNaN(num)) {
    return num
  }
  const minnum = 1 / Math.pow(10, decimal)
  // console.log(decimal)
  // console.log(minnum)
  if (!num || Number(num) <= 0) {
    return '0.00'
  }
  if (Number(num) < minnum) {
    return '<' + minnum
  }
  // num = (num * 10000).toFixed(decimal) / 10000
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return Number(parseFloat(num).toFixed(decimal))
}

function thousandBitFormat(num: any, dec: any = 8) {
  const numArr = num.toString().split('.')
  const numInt = numArr[0]
  const numDec = numArr[1] ? numArr[1] : ''
  const numStr = numInt.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function (s: any) {
    return s + ','
  })
  // console.log(num)
  // console.log(numDec)
  // console.log(dec)
  if (isNaN(dec)) {
    return numStr + (numDec ? '.' + numDec : '')
  }
  return numStr + (numDec ? '.' + numDec.substr(0, dec) : '')
}

export function thousandBit(num: any, dec: any = 8) {
  if (!Number(num)) return '0.00'
  if (Number(num) < 0.00000001) return '<0.00000001'
  if (Number(num) < 0.01) {
    if (isNaN(dec)) {
      return num
    } else {
      return formatDecimal(num, 6)
    }
  }
  if (Number(num) < 1) {
    if (isNaN(dec)) {
      return num
    } else {
      return formatDecimal(num, 4)
    }
  }
  if (Number(num) < 1000) {
    if (isNaN(dec)) {
      return num
    } else {
      return formatDecimal(num, dec)
    }
  }
  const _num = (num = Number(num))
  if (isNaN(num)) {
    num = 0
    num = formatDecimal(num, dec)
  } else {
    num = thousandBitFormat(num, dec)
    // if (isNaN(dec)) {
    //   if (num.toString().indexOf('.') === -1) {
    //     num = Number(num).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //       return s+','
    //     })
    //   } else {
    //     const numSplit = num.toString().split('.')
    //     numSplit[1] = numSplit[1].length > 9 ? numSplit[1].substr(0, 8) : numSplit[1]
    //     num = Number(numSplit[0]).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    //     // num = Number(numSplit[0]).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //     //   return s+','
    //     // })
    //     num = num.toString().split('.')[0] + '.' + numSplit[1]
    //   }
    // } else {
    //   if (num.toString().indexOf('.') === -1) {
    //     num = formatDecimal(num, dec).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //       return s+','
    //     })
    //   } else {
    //     num = formatDecimal(num, dec).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    //   }
    // }
  }
  if (_num < 0 && num.toString().indexOf('-') < 0) {
    num = '-' + num
  }
  return num
}
