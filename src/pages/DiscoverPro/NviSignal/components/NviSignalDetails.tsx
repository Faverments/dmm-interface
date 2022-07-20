import React from 'react'
import NviAvatar from 'assets/images/nvi_group.jpg'
import useTheme from 'hooks/useTheme'
import { Text, Flex } from 'rebass'
import { CheckCircle, Share2 } from 'react-feather'
import styled from 'styled-components'
import Facebook from 'components/Icons/Facebook'
import Telegram from 'components/Icons/Telegram'
import { ExternalLink } from 'theme'

const Divider = styled.div`
  width: 1px;
  height: 30px;
  background: ${({ theme }) => theme.border};
  margin-right: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 12px;
  `}
`
const IconButton = styled.button`
  cursor: pointer;
  height: 36px;
  width: 36px;
  border-radius: 4px;
  //transition: background 0.2s;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.buttonBlack};
  }
`

const SocialIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  /* background-color: ${props => props.theme.primary}; */
  margin-right: 22px;
  cursor: pointer;
  &:hover {
    /* background-color: ${props => props.theme.primary}; */
  }
`
const StyledShareButton = styled(IconButton)`
  svg {
    circle {
      /* fill: ${({ theme }) => theme.text}; */
    }
  }
`
const ShareButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 17px;
  font-weight: 400;
  padding: 2px 18px 2px 4px;
  border: 1px solid ${({ theme }) => theme.subText};
  border-radius: 4px;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`

export default function NviSignalDetails() {
  const theme = useTheme()
  return (
    <div>
      <div
        style={{
          position: 'relative',
        }}
      >
        <img
          src={NviAvatar}
          alt="NVI Group"
          width={168}
          style={{
            border: `4px solid ${theme.bg12}`,
            borderRadius: '10px',
            position: 'absolute',
            top: '-130px',
          }}
        />
      </div>
      <Flex justifyContent="space-between">
        <Flex style={{ marginTop: 40, paddingLeft: 10 }} alignItems="center">
          <Text fontSize={30} fontWeight={500} color={theme.subText}>
            {/* Nvi Signal */}
            Nvi Signal
          </Text>
          <CheckCircle size={18} color={theme.primary} style={{ marginLeft: 10, marginTop: 6 }} />
        </Flex>
        <Flex
          alignItems="center"
          style={{
            marginTop: 30,
          }}
        >
          <SocialIconWrapper>
            <ExternalLink href="https://www.facebook.com/groups/nvigroup">
              <Facebook size={26} color={theme.subText} />
            </ExternalLink>
          </SocialIconWrapper>
          <SocialIconWrapper>
            <ExternalLink href="https://t.me/nhatviet02">
              <Telegram size={26} color={theme.subText} />
            </ExternalLink>
          </SocialIconWrapper>
          <Divider />
          <ShareButtonWrapper>
            <StyledShareButton>
              <Share2 size={20} color={theme.text} />
            </StyledShareButton>
            <Text fontSize={16} fontWeight={200} color={theme.text}>
              Share
            </Text>
          </ShareButtonWrapper>
        </Flex>
      </Flex>
    </div>
  )
}
