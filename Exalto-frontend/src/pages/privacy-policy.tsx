import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This includes your name, email address, phone number, delivery address, and payment information. We also collect information automatically when you use our platform, including usage data and device information.",
  },
  {
    title: "2. How We Use Your Information",
    content: "We use the information we collect to process your orders and payments, deliver products to you, send order confirmations and updates, respond to your enquiries, improve our platform and services, send promotional communications (with your consent), and comply with legal obligations.",
  },
  {
    title: "3. Information Sharing",
    content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with delivery partners to fulfil your orders, payment processors to handle transactions, and service providers who assist in our operations. All third parties are bound by confidentiality agreements.",
  },
  {
    title: "4. Data Security",
    content: "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology.",
  },
  {
    title: "5. Cookies",
    content: "We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie settings through your browser. Disabling cookies may affect some functionality of our platform.",
  },
  {
    title: "6. Your Rights",
    content: "You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at exaltoltd@gmail.com.",
  },
  {
    title: "7. Data Retention",
    content: "We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Order records are retained for 7 years for accounting and legal purposes.",
  },
  {
    title: "8. Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on our platform. Your continued use of our services after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "9. Contact Us",
    content: "If you have questions about this Privacy Policy or our data practices, please contact us at: Exalto Engineering & Supply Solutions Ltd, Kamonyi, Rwanda. Email: exaltoltd@gmail.com. Phone: +250 788 537 463.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fffdf8] pb-20 pt-28 text-[#2a1f1a]">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-[#9a8a82]">
          <Link to="/" className="hover:text-[#c94708]">Home</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-[#251c18]">Privacy Policy</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Legal</p>
        <h1 className="mt-2 text-4xl font-black text-[#251c18]">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[#77716d]">Last updated: January 2025</p>

        <div className="mt-4 rounded-xl border border-[#eadfce] bg-[#f3efe9] p-4 text-sm text-[#6d6b69]">
          This Privacy Policy describes how Exalto Engineering & Supply Solutions Ltd collects, uses, and protects your personal information when you use our platform and services.
        </div>

        <div className="mt-10 space-y-8">
          {SECTIONS.map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-lg font-bold text-[#251c18]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6d6b69]">{content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#eadfce] bg-white p-6 text-center">
          <p className="text-sm text-[#77716d]">Have questions about our privacy practices?</p>
          <Link to="/contact" className="mt-3 inline-flex items-center gap-2 bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]">
            Contact Us <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
