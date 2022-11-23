import { Flex } from 'rebass'
import styled from 'styled-components'

import useTheme from 'hooks/useTheme'

const PickerItem = styled.div<{ isActive: boolean }>`
  border-radius: 999px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme, isActive }) => (isActive ? theme.text : theme.subText)};
  background: ${({ theme, isActive }) => (isActive ? theme.tabActive : theme.tabBackgound)};
  cursor: pointer;
  transition: all 0.2s ease;
`

const ViewTypePicker = ({
  activeViewType,
  setActiveViewType,
}: {
  activeViewType: 'single' | 'collection'
  setActiveViewType: (mode: 'single' | 'collection') => void
}) => {
  const theme = useTheme()

  return (
    <Flex style={{ borderRadius: '999px', padding: '2px', background: theme.tabBackgound }}>
      <PickerItem
        isActive={activeViewType === 'single'}
        onClick={() => {
          setActiveViewType('single')
        }}
      >
        Single
      </PickerItem>
      <PickerItem
        isActive={activeViewType === 'collection'}
        onClick={() => {
          setActiveViewType('collection')
        }}
      >
        Collection
      </PickerItem>
    </Flex>
  )
}

export default ViewTypePicker
