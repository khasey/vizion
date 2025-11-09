export default function TermsPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-lg text-default-600 mb-8">
        Last updated: November 9, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
        <p className="text-default-600">
          By accessing or using Vizion, you agree to be bound by these Terms of
          Service and all applicable laws and regulations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Use License</h2>
        <p className="text-default-600">
          Permission is granted to use Vizion for personal or commercial trading
          journal purposes under the terms of your subscription plan.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
        <p className="text-default-600">
          Vizion is a trading journal tool. We do not provide financial advice,
          and trading involves risk. Past performance is not indicative of
          future results.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Limitations</h2>
        <p className="text-default-600">
          In no event shall Vizion be liable for any damages arising out of the
          use or inability to use our services.
        </p>
      </section>
    </div>
  );
}
