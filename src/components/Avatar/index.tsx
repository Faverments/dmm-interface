import { createIcon } from '@vukhaihoan/blockies'
import React, { useEffect, useMemo } from 'react'
import { useGetUserAvatar } from 'services/zapper/hooks/useUserAvatar'

export default function Avatar({ address }: { address: string }) {
  const { data: user, isLoading } = useGetUserAvatar(address)
  const avartarUrl = useMemo(() => {
    if (user) return user.user.avatarURI
    return null
  }, [user])
  const [error, setError] = React.useState(false)
  useEffect(() => {
    const icon = createIcon({
      // All options are optional
      seed: address, // seed used to generate icon data, default: random
      // color: '#dfe', // to manually specify the icon color, default: random
      // bgcolor: '#aaa', // choose a different background color, default: white
      size: 12, // width/height of the icon in blocks, default: 10
      scale: 5, // width/height of each block in pixels, default: 5
      // spotcolor: '#000', // each pixel has a 13% chance of being of a third color,
    })

    document.getElementById('avatar')!.replaceChildren(icon)
    document
      .getElementById('avatar')!
      .firstElementChild?.setAttribute('style', 'border-radius: 25%; width: 100%; height: 100%;')
  }, [address, error])

  useEffect(() => {
    if (avartarUrl) {
      const img = document.createElement('img')
      img.src = avartarUrl
      img.setAttribute('style', 'border-radius: 25% ; width: 120px; height: 120px')
      img.onerror = ({ currentTarget }: any) => {
        currentTarget.onerror = null // prevents looping
        setError(true)
      }
      document.getElementById('avatar')!.replaceChildren(img)
    }
  }, [avartarUrl])

  return (
    <div>
      <div
        id="avatar"
        style={{
          borderRadius: '25%',
          width: '120px',
          height: '120px',
        }}
      ></div>
    </div>
  )
}
