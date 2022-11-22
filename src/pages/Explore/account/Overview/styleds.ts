import { rgba } from 'polished'
import styled from 'styled-components/macro'

export const TableWrapper = styled.div`
  border-radius: 8px;
  padding: 16px;
  background: ${({ theme }) => rgba(theme.buttonBlack, 0.3)};
  flex-basis: 100%;
  border: ${({ theme }) => `1px solid ${rgba(theme.border, 0.1)}`};
`

export const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  border-bottom: 0.5px solid ${({ theme }) => (theme.darkMode ? rgba(theme.border, 0.2) : theme.border)};
  padding-bottom: 16px;
`

export const TableHeaderItem = styled.div<{ align?: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.subText};
  text-align: ${({ align }) => align ?? 'left'};
  text-transform: uppercase;
`

export const TableBodyItemWrapper = styled.div<{ align?: string }>`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => rgba(theme.text, 0.85)};
`
