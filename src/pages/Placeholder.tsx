// Temporary page body used by the route placeholders until each page's unit lands.
export function Placeholder({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 md:px-8">
      <h1 className="font-serif text-4xl">{title}</h1>
    </section>
  );
}
