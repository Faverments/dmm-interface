import { useEffect, useRef } from 'react'
export default function useScrollToTopWhenPageChange(currentPage: number, topPx: number) {
  const firstUpdate = useRef(true)
  const scrollToDiv = () => {
    window.scrollTo({
      top: topPx,
      behavior: 'smooth',
    })
  }
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    scrollToDiv()
  }, [currentPage])
}
