import MainHome from '@/components/HomePage/MainHome'
import NavAndFooterWrapper from '@/providers/NavAndFooterWrapper'
import React from 'react'

const page = () => {
  return (
    <NavAndFooterWrapper>
      <MainHome/>
    </NavAndFooterWrapper>
  )
}

export default page