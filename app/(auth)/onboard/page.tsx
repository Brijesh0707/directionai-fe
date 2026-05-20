import type { Metadata } from 'next';
import OnboardingProcess from '@/components/Auth/OnboardingProcess';
import NavAndFooterWrapper from '@/providers/NavAndFooterWrapper';
import { createPageMetadata } from '../../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Onboarding',
  description: 'Set up your Direction AI workspace and personalize your product execution path.',
  path: '/onboard',
});

const page = () => {
  return (
    <NavAndFooterWrapper>
      <OnboardingProcess />
    </NavAndFooterWrapper>
  );
};

export default page;
