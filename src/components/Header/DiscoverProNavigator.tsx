import React, { useState, useRef } from 'react'
import MenuFlyout from 'components/MenuFlyout'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SlideToUnlock } from 'components/Header'
import { useDiscoverProMode } from 'state/user/hooks'
import { t, Trans } from '@lingui/macro'
import DiscoverIcon from 'components/Icons/DiscoverIcon'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleDiscoverProNavigator } from 'state/application/hooks'

const DiscoverWrapper = styled.span`
  @media (max-width: 576px) {
    display: none;
  }
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.subText};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.primary};
  }

  :hover {
    color: ${({ theme }) => darken(0.1, theme.primary)};
  }
`

const DropdownIcon = styled.div<{ open: boolean; active: boolean }>`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid ${({ theme, active }) => (active ? theme.primary : theme.subText)};

  transform: rotate(${({ open }) => (open ? '180deg' : '0')});
  transition: transform 300ms;
`

const MenuFlyoutBrowserStyle = css`
  left: 150px;
  right: calc(100% - 150px);
  top: 70px;
`

export default function DiscoverProNavigator() {
  const [isHoverSlide, setIsHoverSlide] = useState(false)
  const isDiscoverProMode = useDiscoverProMode()
  const discoverLink = isDiscoverProMode ? '/discoverPro?tab=trending_soon' : '/discover?tab=trending_soon'
  const { pathname } = useLocation()
  const activeHoverSlide = isDiscoverProMode
    ? pathname.includes('discoverPro')
    : pathname.includes('discover') || isHoverSlide
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.DISCOVER_PRO_NAVIGATOR)
  const toggle = useToggleDiscoverProNavigator()
  return (
    <DiscoverWrapper
      // onMouseEnter={() => {
      //   setIsDiscoverProHover(true)
      //   setIsHoverSlide(true)
      // }}
      // onMouseLeave={() => {
      //   setIsDiscoverProHover(false)
      //   setIsHoverSlide(false)
      // }}
      onClick={() => {
        setIsHoverSlide(!isHoverSlide)
        toggle()
      }}
      ref={node as any}
    >
      <StyledNavLink
        to={discoverLink}
        isActive={match => Boolean(match)}
        style={{ alignItems: 'center' }}
        // onClick={toggle}
      >
        <SlideToUnlock active={activeHoverSlide} isDiscoverProMode={isDiscoverProMode}>
          {isDiscoverProMode ? <Trans>Discover Pro</Trans> : <Trans>Discover</Trans>}
        </SlideToUnlock>

        {isDiscoverProMode ? (
          <DropdownIcon open={open} active={activeHoverSlide} />
        ) : (
          <DiscoverIcon size={14} style={{ marginTop: '-20px', marginLeft: '4px' }} />
        )}
      </StyledNavLink>
      {isDiscoverProMode && (
        <MenuFlyout
          node={node}
          isOpen={open}
          toggle={toggle}
          translatedTitle={t`Nothing`}
          hasArrow
          browserCustomStyle={MenuFlyoutBrowserStyle}
        >
          <NavLink to="/changer">changer</NavLink>
        </MenuFlyout>
      )}
    </DiscoverWrapper>
  )
}
