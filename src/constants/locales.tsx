import React from 'react'
import FlagEN from '../assets/images/flag-EN.svg'
import FlagZH from '../assets/images/flag-ZH.svg'
import FlagTR from '../assets/images/flag-TR.svg'
import FlagKO from '../assets/images/flag-KO.svg'
import FlagVI from '../assets/images/flag-VI.svg'

export const SUPPORTED_LOCALES = ['en-US', 'ko-KR', 'tr-TR', 'vi-VN', 'zh-CN'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en-US'

export const LOCALE_LABEL: { [locale in SupportedLocale]: JSX.Element } = {
  'en-US': (
    <>
      <img src={FlagEN} style={{ verticalAlign: 'middle' }} /> &nbsp;English
    </>
  ),
  'zh-CN': (
    <>
      <img src={FlagZH} style={{ verticalAlign: 'middle' }} /> &nbsp;中文
    </>
  ),
  'tr-TR': (
    <>
      <img src={FlagTR} style={{ verticalAlign: 'middle' }} /> &nbsp;Türkçe
    </>
  ),
  'ko-KR': (
    <>
      <img src={FlagKO} style={{ verticalAlign: 'middle' }} /> &nbsp;한국어
    </>
  ),
  'vi-VN': (
    <>
      <img src={FlagVI} style={{ verticalAlign: 'middle' }} /> &nbsp;Tiếng Việt
    </>
  )
}
