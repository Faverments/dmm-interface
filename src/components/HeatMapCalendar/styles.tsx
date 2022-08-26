import styled, { css, keyframes } from 'styled-components'

export const Calendar = styled.svg`
  display: block;
  max-width: 100%;
  height: auto;
  overflow: visible;
  & > text {
    fill: ${({ theme }) => theme.text};
  }
  &:focus {
    outline: none;
  }
`
const loadingAnimation = keyframes`
  0% {
    fill: var(--react-activity-calendar-loading);
  }
  50% {
    fill: var(--react-activity-calendar-loading-active);
  }
  100% {
    fill: var(--react-activity-calendar-loading);
  }
`

export const Block = styled.rect<{ loading: boolean; active: boolean }>`
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 1px;
  shape-rendering: geometricPrecision;
  cursor: pointer;
  animation: ${({ loading }) =>
    loading
      ? css`
          ${loadingAnimation} 1.5s ease-in-out infinite
        `
      : undefined};
  outline: ${({ active, theme }) => (active ? `2px auto ${theme.text}` : 'none')};
`

export const Footer = styled.footer`
  display: flex;
`

export const LegendColors = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.2em;
`
