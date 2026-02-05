export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="text-gray-600 mb-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          Welcome to PlugMe. By accessing or using our platform, you agree to be
          bound by these Terms of Service.
        </p>

        <h2 className="text-xl font-semibold">1. Use of the Platform</h2>
        <p>
          You may use PlugMe only for lawful purposes and in accordance with
          these terms. You agree not to misuse the platform or attempt to gain
          unauthorized access.
        </p>

        <h2 className="text-xl font-semibold">2. Business Listings</h2>
        <p>
          Businesses listed on PlugMe are responsible for the accuracy of their
          information. We reserve the right to approve, reject, or remove
          listings.
        </p>

        <h2 className="text-xl font-semibold">3. Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account and password and for all activities under your account.
        </p>

        <h2 className="text-xl font-semibold">4. Termination</h2>
        <p>
          We may suspend or terminate access to the platform at our discretion
          if these terms are violated.
        </p>

        <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
        <p>
          PlugMe is provided “as is”. We are not liable for any damages arising
          from use of the platform.
        </p>

        <h2 className="text-xl font-semibold">6. Changes</h2>
        <p>
          We may update these terms at any time. Continued use of the platform
          means you accept the updated terms.
        </p>
      </div>
    </div>
  )
}
