import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

const FAQ_GROUPS = [
  {
    group: "Orders & Delivery",
    faqs: [
      { q: "How do I place an order?", a: "Browse our shop, add products to your cart, and proceed to checkout. You'll need to create an account or log in, then enter your delivery address and complete payment via Mobile Money or cash on delivery." },
      { q: "What are your delivery times?", a: "For Kigali: same-day delivery for orders placed before 12:00 PM, next-day for orders after 12:00 PM. Nationwide delivery takes 2–3 business days. Export orders take 7–21 business days depending on destination." },
      { q: "Is there a minimum order amount?", a: "There is no minimum order for retail customers. Wholesale accounts have a minimum of Fr 50,000 per order. Export orders have a minimum of 10 cartons." },
      { q: "Can I track my order?", a: "Yes. Once your order is confirmed, you can track its status in your customer dashboard under 'Order History'. You will also receive notifications at each stage of your order." },
      { q: "Do you offer free delivery?", a: "Yes! Orders above Fr 20,000 qualify for free delivery within Kigali. Delivery fees for other areas are calculated at checkout based on your location." },
    ],
  },
  {
    group: "Products",
    faqs: [
      { q: "Are your products 100% natural?", a: "Yes. All Exalto products are made from locally sourced Rwandan ingredients with no artificial additives, preservatives, or flavourings. We cold-press our juices to preserve maximum nutrients." },
      { q: "What is the shelf life of your products?", a: "Our passion fruit juice has a shelf life of 6 months when unopened and refrigerated. Sugarcane wine has a shelf life of 12 months. Once opened, consume within 3–5 days and keep refrigerated." },
      { q: "Do you offer wholesale pricing?", a: "Yes. We offer tiered wholesale pricing for businesses. Visit our Wholesale page to learn about our pricing tiers and open a wholesale account." },
      { q: "Are your products available for export?", a: "Yes. Most of our products are export-ready with full certification including RSB, HACCP, and phytosanitary certificates. Visit our Export page to submit a quotation request." },
      { q: "What units do you sell in?", a: "We sell individual bottles (500ml and 750ml), family packs (4 × 1L), bulk boxes (6 × 750ml), and export cartons (12 × 500ml). Check each product page for available units." },
    ],
  },
  {
    group: "Payments",
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept MTN Mobile Money, Airtel Money (via Paypack), and cash on delivery for eligible locations in Kigali. Wholesale and export customers can also pay via bank transfer." },
      { q: "Is my payment information secure?", a: "Yes. All payments are processed through Paypack, a certified payment gateway. Your payment information is encrypted using SSL technology and never stored on our servers." },
      { q: "Can I pay after receiving my order?", a: "Cash on delivery is available for retail orders within Kigali. Wholesale and export orders require full payment before processing and shipment." },
      { q: "How do I get an invoice?", a: "Invoices are automatically generated for every order. You can download them from your customer dashboard under the 'Invoices' tab." },
    ],
  },
  {
    group: "Returns & Refunds",
    faqs: [
      { q: "What is your return policy?", a: "We accept returns for damaged or incorrect products reported within 24 hours of delivery. Products must be unused and in original packaging. Perishable items are only accepted if defective." },
      { q: "How long do refunds take?", a: "Refunds are processed within 5–7 business days after we receive and inspect the returned product. Mobile Money refunds are typically faster." },
      { q: "What if I received the wrong product?", a: "Contact us immediately at exaltoltd@gmail.com or +250 788 537 463. We will arrange a replacement or refund at no additional cost to you." },
    ],
  },
  {
    group: "Wholesale & Export",
    faqs: [
      { q: "How do I open a wholesale account?", a: "Visit our Wholesale page and fill in the application form. Our sales team will contact you within 24 hours to discuss pricing, terms, and set up your account." },
      { q: "What documents are needed for export?", a: "We provide all necessary export documentation including Certificate of Origin, Phytosanitary Certificate, HACCP compliance documents, and Bill of Lading. Contact our export team for details." },
      { q: "Do you offer custom packaging for export?", a: "Yes. We can provide custom labelling and packaging for export orders meeting minimum quantity requirements. Discuss your requirements when submitting your export quotation." },
    ],
  },
];

export default function FAQsPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <main className="min-h-screen bg-[#fffdf8] pb-20 pt-28 text-[#2a1f1a]">

      {/* Hero */}
      <section className="border-b border-[#eadfce] bg-white px-5 pb-12 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Help Centre</p>
          <h1 className="mt-3 text-4xl font-black text-[#251c18] sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77716d]">
            Find answers to common questions about our products, orders, payments, and more. Can't find what you're looking for? Contact our team.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {FAQ_GROUPS.map(({ group }) => (
              <a key={group} href={`#${group.replace(/\s+/g, "-").toLowerCase()}`} className="rounded-full border border-[#eadfce] px-4 py-2 text-xs font-semibold text-[#77716d] hover:border-[#c94708] hover:text-[#c94708] transition">
                {group}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 space-y-12">
        {FAQ_GROUPS.map(({ group, faqs }) => (
          <section key={group} id={group.replace(/\s+/g, "-").toLowerCase()}>
            <h2 className="mb-5 text-xl font-black text-[#251c18]">{group}</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => {
                const key = `${group}-${i}`;
                const open = openItems[key];
                return (
                  <div key={key} className={`rounded-xl border transition ${open ? "border-[#c94708]/30 bg-white" : "border-[#eadfce] bg-white hover:border-[#c94708]/30"}`}>
                    <button
                      onClick={() => toggle(key)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-bold text-[#251c18]">{faq.q}</span>
                      <ChevronDown size={16} className={`flex-shrink-0 text-[#c94708] transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && (
                      <div className="border-t border-[#eadfce] px-5 py-4">
                        <p className="text-sm leading-7 text-[#6d6b69]">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Still need help */}
        <div className="rounded-2xl border border-[#eadfce] bg-[#c94708] p-8 text-center">
          <h3 className="text-xl font-black text-white">Still have questions?</h3>
          <p className="mt-2 text-sm text-white/80">Our team is ready to help you with anything you need.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-bold text-[#c94708] hover:bg-[#f3efe9] transition">
              Contact Us <ChevronRight size={16} />
            </Link>
            <a href="tel:+250788537463" className="inline-flex items-center gap-2 border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
