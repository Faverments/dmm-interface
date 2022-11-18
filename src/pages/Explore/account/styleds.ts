import { active } from 'd3'
import { lighten, rgba } from 'polished'
import styled from 'styled-components/macro'

import bgimg from 'assets/images/about_background.png'

export const Wrapper = styled.div`
  width: 100%;
  background-image: url(${bgimg});
  background-size: 100% auto;
  background-repeat: repeat-y;
  z-index: 1;
  background-color: transparent;
  background-position: top;
  /* min-height: calc(100vh - 146px); */
  min-height: 100vh;
`

export const PageWrapper = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 24px 36px;
  gap: 24px;
  width: 100%;
  max-width: 1200px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: unset;
`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    gap: 16px;
    padding: 20px 16px;
`};
`
export const TabContainer = styled.div`
  padding-top: 20px;
  display: flex;
  align-items: center;
  gap: 24px;
`

export const TabItem = styled.div<{ active: boolean }>`
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => lighten(0.1, theme.primary)};
  }
  color: ${({ theme, active }) => (active ? theme.primary : theme.subText)};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
    line-height: 20px;
    &:last-child {
      margin-left: 0;
    }
  `}
`

export const ChainWrapper = styled.div<{ active: boolean }>`
  background: ${({ theme, active }) => (active ? theme.primary : theme.buttonBlack)};
  border-radius: 999px;
  padding: 10px 20px;
  cursor: pointer;
`
