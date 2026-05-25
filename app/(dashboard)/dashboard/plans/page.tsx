import React from "react";
import SideBarDashboardWrapper from "@/providers/SideBarDashboardWrapper";
import CreditPlans from "@/components/common/CreditPlans";

const PlansPage = () => {
  return (
    <SideBarDashboardWrapper>
      <section className="min-h-screen bg-[#F4F6FB] px-5 py-8 sm:px-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <CreditPlans />
        </div>
      </section>
    </SideBarDashboardWrapper>
  );
};

export default PlansPage;

