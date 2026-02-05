export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-gray-600 mb-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          Your privacy is important to us. This Privacy Policy explains how
          PlugMe collects, uses, and protects your information.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address,
          and business details when you register or submit a listing.
        </p>

        <h2 className="text-xl font-semibold">2. How We Use Information</h2>
        <p>
          We use your information to operate the platform, manage listings,
          communicate with users, and improve our services.
        </p>

        <h2 className="text-xl font-semibold">3. Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share data only when
          required by law or to operate essential services.
        </p>

        <h2 className="text-xl font-semibold">4. Data Security</h2>
        <p>
          We take reasonable measures to protect your data but cannot guarantee
          absolute security.
        </p>

        <h2 className="text-xl font-semibold">5. Cookies</h2>
        <p>
          We may use cookies to improve user experience and analyze site usage.
        </p>

        <h2 className="text-xl font-semibold">6. Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your personal data
          by contacting us.
        </p>
      </div>
    </div>
  )
}
