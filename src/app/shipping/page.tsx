export default function ShippingPage() {
  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      <div className="bg-brand-fuchsia py-16 text-white text-center"><h1 className="font-display text-4xl font-400">Shipping Information</h1></div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white p-8 space-y-6 prose-content">
          <h2>Domestic Shipping (Nigeria)</h2>
          <p>Orders within Lagos are typically delivered within 2-3 business days. Other Nigerian states take 3-7 business days. Free shipping on orders over ₦50,000.</p>
          <h2>International Shipping</h2>
          <p>We ship internationally. Delivery times are 7-21 business days depending on destination. International customers are responsible for customs duties and taxes.</p>
          <h2>Tracking</h2>
          <p>You will receive a tracking number via email once your order is dispatched.</p>
          <h2>Processing Time</h2>
          <p>Orders are processed within 1-2 business days. Custom orders may require additional processing time.</p>
        </div>
      </div>
    </div>
  )
}
