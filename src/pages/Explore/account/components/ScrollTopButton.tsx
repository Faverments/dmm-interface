import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'react-feather'
import { useMedia } from 'react-use'

import { ScrollToTopWrapperIcon } from '../styleds'

export default function ScrollTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleShow = () => {
      const scrollTop = window.scrollY
      if (scrollTop > 300) {
        setShow(true)
      } else {
        setShow(false)
      }
    }

    window.addEventListener('scroll', handleShow)

    return () => window.removeEventListener('scroll', handleShow)
  }, [])

  const above768 = useMedia('(min-width: 768px)')

  return (
    <div
      style={{
        position: 'fixed',
        bottom: above768 ? 20 : 144,
        right: 16,
        zIndex: 9999,
      }}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }}
    >
      <ScrollToTopWrapperIcon show={show}>
        <ArrowUp size={32} />
      </ScrollToTopWrapperIcon>
    </div>
  )
}
