import LegalPageLayout from './LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" eyebrow="Legal" lastUpdated="September 2026">
      <p>
        This Privacy Policy explains how Sir Commerce Group Ltd ("JUTORIA", "we", "us") collects,
        uses and protects information when you visit jutoriahome.com or contact us through this
        website.
      </p>

      <h2>Who We Are</h2>
      <p>
        JUTORIA is a brand operated by Sir Commerce Group Ltd, registered in England and Wales
        (Company No. 17029469), with a corporate office in Bangladesh. Contact details are
        available on our{' '}
        <a href="/contact">Contact page</a>.
      </p>

      <h2>Information We Collect</h2>
      <p>We collect information in two ways:</p>
      <ul>
        <li>
          <strong>Information you provide directly</strong> — when you submit a wholesale inquiry
          or contact form, we collect what you enter: your name, company name, business email,
          country, inquiry type, product interest, estimated quantity, and any message you write.
        </li>
        <li>
          <strong>Information collected automatically</strong> — we use Google Analytics (GA4) to
          understand how visitors use our website (pages viewed, general location, device type).
          This uses cookies. We do not use this data to identify you personally.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To respond to your wholesale inquiries and general questions</li>
        <li>To understand and improve how our website is used</li>
        <li>To maintain records of business communications</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>

      <h2>Where Your Information Is Stored</h2>
      <p>
        Inquiry form submissions and product data are stored using Google Firebase (Google Cloud
        infrastructure). Website analytics data is processed by Google Analytics.
      </p>

      <h2>Cookies</h2>
      <p>
        This website uses cookies for analytics purposes (via Google Analytics). You can control
        or disable cookies through your browser settings at any time.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may ask us to confirm what information we hold about you, to correct it, or to delete
        it, by contacting us using the details on our Contact page. We will respond within a
        reasonable timeframe.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Our website may link to third-party platforms, including Amazon and social media. We are
        not responsible for the privacy practices of those third-party sites.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated" date above
        reflects the most recent revision.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions about this Privacy Policy, please reach us via our{' '}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalPageLayout>
  );
}
