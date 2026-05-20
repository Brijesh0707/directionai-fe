import type { Metadata } from 'next';
import LoginScreen from '@/components/Auth/LoginScreen';
import NavAndFooterWrapper from '@/providers/NavAndFooterWrapper';
import { createPageMetadata } from '../../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Login',
  description: 'Sign in to Direction AI and continue your startup execution workflow.',
  path: '/login',
});

const page = () => {
  return (
    <NavAndFooterWrapper>
      <LoginScreen />
    </NavAndFooterWrapper>
  );
};

export default page;
