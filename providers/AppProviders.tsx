"use client";

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { persistor, store } from '@/store';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ECEAF3',
              color: '#171717',
              border: '1px solid #D8D5E2',
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
}
