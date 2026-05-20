import type { Metadata } from 'next';
import MainHome from '@/components/HomePage/MainHome';
import NavAndFooterWrapper from '@/providers/NavAndFooterWrapper';
import { createPageMetadata } from './seo';

export const metadata: Metadata = createPageMetadata({
  title: 'AI Execution Platform for Startups',
  description:
    'Direction AI helps you move from idea to execution with AI-generated research, strategy, pitch assets, and development planning.',
  path: '/',
});

const page = () => {
  return (
    <NavAndFooterWrapper>
      <MainHome />
    </NavAndFooterWrapper>
  );
};

export default page;
