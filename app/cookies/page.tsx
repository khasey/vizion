export default function CookiesPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
      <p className="text-lg text-default-600 mb-8">
        Last updated: November 9, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
        <p className="text-default-600">
          Cookies are small text files that are placed on your device to help
          Vizion provide you with a better user experience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
        <p className="text-default-600">
          We use cookies to remember your preferences, authenticate your
          sessions, and analyze how you use our platform to improve our
          services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
        <ul className="list-disc pl-6 text-default-600 space-y-2">
          <li>
            Essential Cookies: Required for the platform to function properly
          </li>
          <li>Preference Cookies: Remember your settings and choices</li>
          <li>Analytics Cookies: Help us understand how you use Vizion</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
        <p className="text-default-600">
          You can control and manage cookies through your browser settings.
          However, disabling certain cookies may impact your experience with
          Vizion.
        </p>
      </section>
    </div>
  );
}
