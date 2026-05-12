import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Header/Navbar'
import React, { ReactNode } from 'react'

const NavAndFooterWrapper = ({children}: {children: ReactNode}) => {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}

export default NavAndFooterWrapper