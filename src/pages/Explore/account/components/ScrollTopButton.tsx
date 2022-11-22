import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'react-feather'

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
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
      }}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }}
    >
      <ScrollToTopWrapperIcon show={show}>
        <ArrowUp size={24} />
      </ScrollToTopWrapperIcon>
    </div>
  )
}
