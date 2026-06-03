import type { Metadata } from 'next';
import ForgotPasswordScreen from '@/components/Auth/ForgotPasswordScreen';
import NavAndFooterWrapper from '@/providers/NavAndFooterWrapper';
import { createPageMetadata } from '../../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Forgot Password',
  description: 'Reset your Direction AI password using a secure OTP flow.',
  path: '/forgot-password',
});

const page = () => {
  return (
    <NavAndFooterWrapper>
      <ForgotPasswordScreen />
    </NavAndFooterWrapper>
  );
};

export default page;
