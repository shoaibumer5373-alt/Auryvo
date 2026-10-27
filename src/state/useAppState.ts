import { useContext } from 'react';
import { AppStateContext, type AppStateValue } from './AppStateContext';

export function useAppState(): AppStateValue {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider.');
  }

  return context;
}
