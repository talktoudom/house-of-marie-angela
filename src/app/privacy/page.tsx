export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      <div className="bg-brand-fuchsia py-16 text-white text-center">
        <h1 className="font-display text-4xl font-400">Privacy Policy</h1>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white p-8 space-y-6 prose-content">
          <h2>Information We Collect</h2>
          <p>We collect information you provide when creating an account, placing an order, or subscribing to our newsletter, including name, email address, phone number, and shipping address.</p>
          <h2>How We Use Your Information</h2>
          <p>Your information is used to process orders, send order confirmations, provide customer support, send marketing emails (with your consent), and improve our services.</p>
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. Payment data is handled securely by Paystack and we do not store card details on our servers.</p>
          <h2>Contact</h2>
          <p>For privacy inquiries, contact us at privacy@houseofmarieangela.com</p>
        </div>
      </div>
    </div>
  )
}
