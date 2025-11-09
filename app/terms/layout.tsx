export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 py-8 md:py-10">
      <div className="max-w-4xl">{children}</div>
    </section>
  );
}
