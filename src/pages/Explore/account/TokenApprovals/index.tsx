import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetTokenApprovals } from 'services/krystal'

export default function TokenApprovals() {
  const { address } = useParams<{ address: string }>()
  const data = useGetTokenApprovals(address, 'all-networks')
  console.log('data ', data)
  return <div>TokenApprovals</div>
}
