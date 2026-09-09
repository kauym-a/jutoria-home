import LegalPageLayout from './LegalPageLayout';

export default function RefundPolicy() {
  return (
    <LegalPageLayout title="Refund Policy" eyebrow="Legal" lastUpdated="September 2026">
      <p>
        This website does not process direct retail sales or payments. JUTORIA products are made
        available through two channels, each with its own refund arrangements:
      </p>

      <h2>Purchases via Amazon</h2>
      <p>
        Products purchased through our Amazon storefront are covered by Amazon's own return and
        refund policies. Please refer to Amazon's policies or contact Amazon customer service for
        those orders.
      </p>

      <h2>Wholesale & Bulk Orders</h2>
      <p>
        For orders placed directly with JUTORIA through our wholesale process, refund, replacement
        and quality-claim terms are agreed as part of the commercial terms for that specific order
        — this reflects the fact that wholesale orders vary in product, quantity, and destination.
      </p>
      <p>
        If you believe a wholesale shipment has a quality issue, damage, or discrepancy from what
        was agreed, please contact our wholesale team as soon as possible after receiving the
        goods, with details and photos where relevant. We will review each case individually
        against the terms agreed for that order.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions about a specific order, please reach us via our{' '}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalPageLayout>
  );
}
