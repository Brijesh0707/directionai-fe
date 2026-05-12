import LoginScreen from '@/components/Auth/LoginScreen'
import NavAndFooterWrapper from '@/providers/NavAndFooterWrapper'
import React from 'react'

const page = () => {
  return (
    <NavAndFooterWrapper>
        <LoginScreen/>
    </NavAndFooterWrapper>
  )
}

export default page