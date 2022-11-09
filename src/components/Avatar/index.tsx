import { createIcon } from '@vukhaihoan/blockies'
import React, { useEffect } from 'react'

export default function Avatar({ address }: { address: string }) {
  useEffect(() => {
    const icon = createIcon({
      // All options are optional
      seed: address, // seed used to generate icon data, default: random
      // color: '#dfe', // to manually specify the icon color, default: random
      // bgcolor: '#aaa', // choose a different background color, default: white
      size: 15, // width/height of the icon in blocks, default: 10
      scale: 7, // width/height of each block in pixels, default: 5
      // spotcolor: '#000', // each pixel has a 13% chance of being of a third color,
    })

    document.getElementById('avatar')!.replaceChildren(icon)
    document.getElementById('avatar')!.firstElementChild?.setAttribute('style', 'border-radius: 50%')
  }, [address])

  return (
    <div>
      <div
        id="avatar"
        style={{
          borderRadius: '50%',
        }}
      >
        Avatar
      </div>
    </div>
  )
}
