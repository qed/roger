import React from 'react';
import { AudienceProvider } from './contexts/AudienceContext';
import { Landing } from './pages/Landing';

type AppProps = {
  headline?: 'mastery' | 'miseEnPlace' | 'prepared' | 'sunday';
  defaultAudience?: 'home' | 'work';
};

export function App({ headline = 'mastery', defaultAudience = 'home' }: AppProps) {
  return (
    <AudienceProvider initial={defaultAudience}>
      <Landing headline={headline} />
    </AudienceProvider>);

}