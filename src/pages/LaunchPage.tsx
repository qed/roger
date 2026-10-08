import { groupLaunchItems } from '../data/launch';
import { launchStatus } from '../components/launch/launchStatus';

// /launch (spec §8.4.6): the full checklist on previews. Not registered in production builds.
export default function LaunchPage() {
  if (!launchStatus) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-serif text-4xl">Launch check</h1>
        <p className="mt-4 text-ink-soft">No status yet. Run npm run launch-check -- --write, then reload.</p>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl">Launch check</h1>
      <p className="mt-3 text-ink-soft">{launchStatus.summary}</p>
      {groupLaunchItems(launchStatus.items).map(({ title, items }) => (
        <div key={title} className="mt-10">
          <h2 className="font-serif text-2xl">{title}</h2>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span>
                  <span aria-hidden="true">{item.done ? '✅' : '❌'}</span>{' '}
                  <span className="sr-only">{item.done ? 'Done: ' : 'Not done: '}</span>
                  {item.label}
                </span>
                <span className="text-ink-faint">{item.kind}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
