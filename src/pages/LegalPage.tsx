import { Placeholder } from './Placeholder';

export type LegalKind = 'terms' | 'privacy' | 'refunds';

const titles: Record<LegalKind, string> = {
  terms: 'Terms',
  privacy: 'Privacy',
  refunds: 'Refunds'
};

export function LegalPage({ kind }: { kind: LegalKind }) {
  return <Placeholder title={titles[kind]} />;
}
