import LegalPageLayout from './LegalPageLayout';

export default function ShippingPolicy() {
  return (
    <LegalPageLayout title="Shipping Policy" eyebrow="Legal" lastUpdated="September 2026">
      <p>
        This Shipping Policy applies to wholesale and bulk orders placed directly with JUTORIA
        (operated by Sir Commerce Group Ltd). It does not apply to purchases made through Amazon,
        which are covered by Amazon's own shipping and fulfilment policies.
      </p>

      <h2>Production Lead Time</h2>
      <p>
        Our products are handcrafted by artisans in Bangladesh. Production typically requires a
        minimum of <strong>40 days</strong> from order confirmation, depending on the product,
        quantity, and current production schedule. Exact lead times are confirmed at the time of
        quotation.
      </p>

      <h2>Shipping Terms</h2>
      <p>
        We ship internationally to support our wholesale and distribution partners. Available
        shipping methods and incoterms (such as FOB or EXW) are discussed and confirmed as part of
        each wholesale quotation, based on destination, order volume, and your requirements.
      </p>

      <h2>Delivery Timeline</h2>
      <p>
        Total delivery time — production plus shipping — varies by destination and shipping method
        selected, and is confirmed with you before an order is finalised. We are happy to discuss
        timelines for your specific market as part of the wholesale inquiry process.
      </p>

      <h2>Customs & Import Duties</h2>
      <p>
        For international shipments, the receiving business is generally responsible for any
        import duties, taxes, or customs clearance requirements in the destination country, unless
        otherwise agreed in writing.
      </p>

      <h2>Questions About a Specific Order</h2>
      <p>
        For shipping timelines, costs, or terms for your specific order, please{' '}
        <a href="/contact">submit a wholesale inquiry</a> and our team will confirm the details
        with you directly.
      </p>
    </LegalPageLayout>
  );
}
