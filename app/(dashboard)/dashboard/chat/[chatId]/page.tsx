import React from 'react'
import SideBarDashboardWrapper from '@/providers/SideBarDashboardWrapper'
import SingleChatScreen from '@/components/dashboard/SingleChatScreen'

const page = async ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = await params;

  return (
    <SideBarDashboardWrapper>
      <SingleChatScreen chatId={chatId} />
    </SideBarDashboardWrapper>
  )
}

export default page
