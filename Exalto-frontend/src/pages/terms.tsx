import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const SECTIONS = [
  { title: "1. Acceptance of Terms", content: "By accessing and using the Exalto platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform." },
  { title: "2. Account Registration", content: "To place orders, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorised use." },
  { title: "3. Orders and Pricing", content: "All prices are listed in Rwandan Francs (Fr) and are subject to change without notice. An order is confirmed only after payment is received and verified. We reserve the right to cancel orders in cases of pricing errors, stock unavailability, or suspected fraud." },
  { title: "4. Payment", content: "We accept Mobile Money payments (MTN MoMo, Airtel Money) via Paypack and cash on delivery for eligible locations. All payments must be completed before order processing begins. Payment information is encrypted and processed securely." },
  { title: "5. Delivery", content: "Delivery times are estimates and not guaranteed. We are not liable for delays caused by circumstances beyond our control. Risk of loss passes to you upon delivery. Please inspect your order upon receipt and report any issues within 24 hours." },
  { title: "6. Returns and Refunds", content: "We accept returns for damaged or incorrect products reported within 24 hours of delivery. Refunds are processed within 5–7 business days. Products must be unused and in original packaging. We do not accept returns for perishable items unless they are defective." },
  { title: "7. Wholesale and Export", content: "Wholesale and export accounts are subject to additional terms agreed upon account opening. Minimum order quantities, pricing, and delivery schedules are specified in your wholesale agreement. Export orders require full payment before shipment." },
  { title: "8. Intellectual Property", content: "All content on this platform, including logos, images, text, and design, is the property of Exalto Engineering & Supply Solutions Ltd and is protected by copyright law. You may not reproduce or use our content without written permission." },
  { title: "9. Limitation of Liability", content: "Exalto shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform or products. Our total liability shall not exceed the amount paid for the specific order giving rise to the claim." },
  { title: "10. Governing Law", content: "These Terms are governed by the laws of Rwanda. Any disputes shall be resolved through the courts of Rwanda. We encourage you to contact us first to resolve any issues amicably." },
  { title: "11. Changes to Terms", content: "We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of our platform after changes constitutes acceptance of the new Terms." },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf8] pb-20 pt-28 text-[#2a1f1a]">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-[#9a8a82]">
          <Link to="/" className="hover:text-[#c94708]">Home</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-[#251c18]">Terms & Conditions</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Legal</p>
        <h1 className="mt-2 text-4xl font-black text-[#251c18]">Terms & Conditions</h1>
        <p className="mt-3 text-sm text-[#77716d]">Last updated: January 2025</p>

        <div className="mt-4 rounded-xl border border-[#eadfce] bg-[#f3efe9] p-4 text-sm text-[#6d6b69]">
          Please read these Terms and Conditions carefully before using the Exalto platform. These terms govern your use of our website and services.
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
          <p className="text-sm text-[#77716d]">Questions about our terms?</p>
          <Link to="/contact" className="mt-3 inline-flex items-center gap-2 bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]">
            Contact Us <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
