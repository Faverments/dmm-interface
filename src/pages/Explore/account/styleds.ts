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
  position: 'relative';
`

export const BackgroundOverlay = styled.div<{ isDark: boolean }>`
  width: 100%;
  height: 100%;
  background: ${({ isDark }) => (isDark ? rgba('#000', 0.2) : rgba('#fff', 0.5))};
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
`

export const LeftSideWrapper = styled.div`
  padding: 16px 16px;
`

export const PageWrapper = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 24px 36px;
  gap: 24px;
  width: 100%;
  max-width: 1320px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: unset;
`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    gap: 16px;
    padding: 20px 16px;
`};
`
export const TabContainer = styled.div`
  /* padding-top: 20px; */
  display: flex;
  align-items: center;
  gap: 24px;
  overflow-x: scroll;
  border-bottom: ${({ theme }) => `1px solid ${rgba(theme.border, 0.2)}`};
`

export const TabItem = styled.div<{ active: boolean }>`
  white-space: nowrap;
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => lighten(0.1, theme.primary)};
  }
  color: ${({ theme, active }) => (active ? theme.primary : rgba(theme.text, 0.9))};
  border-bottom: ${({ theme, active }) => (active ? `2px solid ${theme.primary}` : 'none')};

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
  border: 1px solid ${({ theme }) => theme.buttonBlack};
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`

export const ScrollToTopWrapperIcon = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => rgba(theme.primary, 0.1)};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  &:hover {
    cursor: pointer;
    // enlarge icon
    transform: scale(1.2);
  }
`

export const SideWrapper = styled.div`
  border-radius: 25px;
  padding: 16px;
  background: ${({ theme }) => rgba(theme.buttonBlack, 0.2)};
  flex-basis: 100%;
  border: ${({ theme }) => `1px solid ${rgba(theme.border, 0.1)}`};
`
export const SideTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  padding-bottom: 16px;
`

export const ItemWrapper = styled.div`
  border-bottom: 0.5px solid ${({ theme }) => (theme.darkMode ? rgba(theme.border, 0.2) : theme.border)};
  padding-bottom: 16px;
`
export const ItemLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const OverflowPagination = styled.div`
  overflow-x: scroll;
`
export const TableWrapper = styled.div`
  border-radius: 8px;
  padding: 16px;
  background: ${({ theme }) => rgba(theme.buttonBlack, 0.3)};
  flex-basis: 100%;
`
