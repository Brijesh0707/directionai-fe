"use client";

import React from "react";
import CreditPlans from "@/components/common/CreditPlans";

const Pricing = () => {
  return (
    <section id="pricing" className="relative py-20 sm:py-24 lg:py-28 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <CreditPlans compact />
      </div>
    </section>
  );
};

export default Pricing;
