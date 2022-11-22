import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import useGetUserDaoMembership from 'services/zapper/hooks/useGetZapperUserDaoMembership'
import { useTheme } from 'styled-components/macro'

import { AutoColumn } from 'components/Column'
import Pagination from 'components/Pagination'
import { formattedNumLong, toKInChart } from 'utils'
import { formatDollarAmount } from 'utils/numbers'

import { ItemLayout, ItemWrapper, OverflowPagination, SideTitle, SideWrapper } from '../../styleds'

export default function DaoMemberShip() {
  const { address } = useParams<{ address: string }>()
  const { daoMemberships } = useGetUserDaoMembership(address)
  const [page, setPage] = React.useState(1)
  useEffect(() => {
    setPage(1)
  }, [address])
  const daoSortAvaliable = useMemo(() => {
    const res = [...daoMemberships].sort((a, b) => b.percentileShare - a.percentileShare)
    return res.slice((page - 1) * 8, page * 8)
  }, [daoMemberships, page])

  const theme = useTheme()
  return (
    <SideWrapper>
      <AutoColumn gap="8px">
        <SideTitle>Dao MemberShips</SideTitle>
        {daoSortAvaliable.map((daoMembership, index) => (
          <ItemWrapper key={index}>
            <ItemLayout>
              <Flex style={{ gap: 8 }} alignItems="center">
                <img
                  src={daoMembership.img}
                  width={40}
                  height={40}
                  alt={daoMembership.name}
                  style={{
                    borderRadius: '50%',
                  }}
                />
                <Text color={theme.subText} fontSize={18} fontWeight={400}>
                  {daoMembership.name}
                </Text>
              </Flex>
              <Flex
                flexDirection="column"
                alignItems="flex-end"
                style={{
                  gap: 8,
                }}
              >
                <Text color={theme.text}>
                  {toKInChart(String(daoMembership.share))}{' '}
                  {daoMembership.governanceBaseToken ? daoMembership.governanceBaseToken.symbol : 'NFT'}
                </Text>
                <Text color={theme.subText}>{formattedNumLong(daoMembership.percentileShare)}%</Text>
              </Flex>
            </ItemLayout>
          </ItemWrapper>
        ))}
        <OverflowPagination>
          <Pagination
            pageSize={8}
            onPageChange={newPage => setPage(newPage)}
            currentPage={page}
            totalCount={daoMemberships.length || 1}
            style={{
              backgroundColor: 'transparent',
              paddingLeft: 0,
              paddingRight: 0,
            }}
            forceMobileMode={true}
          />
        </OverflowPagination>
      </AutoColumn>
    </SideWrapper>
  )
}
