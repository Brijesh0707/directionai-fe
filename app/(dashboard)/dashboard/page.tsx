import NewProject from '@/components/dashboard/NewProject'
import SideBarDashboardWrapper from '@/providers/SideBarDashboardWrapper'
import React from 'react'

const page = () => {
  return (
   <SideBarDashboardWrapper>
    <NewProject/>
   </SideBarDashboardWrapper>
  )
}

export default page