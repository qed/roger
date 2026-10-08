import { homeMealPlanCopy } from '../../data/copy/home';
import { homeSteps } from '../../data/homeContent';
import { FadeUp } from '../FadeUp';
import { TimeMathBand } from '../TimeMathBand';

// Spec §6A.5: the featured example, the weekly meal plan. The 4 steps, then the time-math band.
// No photo: the steps carry it, and no stock image can be mistaken for a client's kitchen (R10).
export function HomeMealPlan({ id = 'meal-plan' }: { id?: string }) {
  return (
    <>
      <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <p className="text-sm uppercase tracking-[0.14em] text-copper">{homeMealPlanCopy.label}</p>
          <h2 id={`${id}-heading`} className="mt-3 max-w-3xl font-serif text-3xl leading-tight md:text-5xl">
            {homeMealPlanCopy.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{homeMealPlanCopy.intro}</p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeSteps.map((step, i) => (
              <li key={step.title}>
                <FadeUp delay={Math.min(i, 3) * 0.04} className="h-full rounded-2xl border border-rule bg-paper p-6">
                  <p className="text-sm text-copper">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.when}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-ink">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">{step.body}</p>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <TimeMathBand />
    </>
  );
}
