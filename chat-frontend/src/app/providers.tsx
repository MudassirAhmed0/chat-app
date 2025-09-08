'use client';

import ApolloProviderClient from '@/lib/apollo';
import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloProviderClient>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </ApolloProviderClient>
  );
};

export default Providers;
