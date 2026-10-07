import React, { createContext, useContext, useState } from 'react';
import type { Audience } from '../types/waitlist';

type AudienceContextValue = {
  audience: Audience;
  setAudience: (audience: Audience) => void;
};

const AudienceContext = createContext<AudienceContextValue | null>(null);

type AudienceProviderProps = {
  initial: Audience;
  children: React.ReactNode;
};

export function AudienceProvider({ initial, children }: AudienceProviderProps) {
  const [audience, setAudience] = useState<Audience>(initial);
  return (
    <AudienceContext.Provider value={{ audience, setAudience }}>{children}</AudienceContext.Provider>);

}

export function useAudience(): AudienceContextValue {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error('useAudience must be used inside AudienceProvider');
  return ctx;
}