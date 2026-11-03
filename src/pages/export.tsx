import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Globe, FileText, Package, Thermometer, Ship, CheckCircle2, Award } from "lucide-react";

const PROCESS = [
  { step: "01", icon: FileText, title: "Submit Enquiry", desc: "Fill in our export quotation form with your product requirements, destination, and quantity." },
  { step: "02", icon: Award, title: "Quotation Prepared", desc: "Our sales team reviews your request and prepares a detailed quotation within 24 hours." },
  { step: "03", icon: Package, title: "Order Confirmed", desc: "Once you approve the quote, we begin production and packaging to your specifications." },
  { step: "04", icon: Thermometer, title: "Cold Chain Packed", desc: "Products are packed under strict cold chain conditions to preserve freshness during transit." },
  { step: "05", icon: Ship, title: "Shipped & Tracked", desc: "Your order is shipped with full documentation and real-time tracking until delivery." },
];

const CERTIFICATIONS = [
  "Rwanda Standards Board (RSB) Certified",
  "HACCP Food Safety Compliant",
  "ISO 22000 Food Management",
  "Rwanda FDA Approved",
  "Export Phytosanitary Certificate",
  "Certificate of Origin — Rwanda",
];

const DESTINATIONS = ["Kenya", "Uganda", "Tanzania", "DRC", "Burundi", "South Africa", "UAE", "Europe", "USA"];

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy";
const fieldClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

export default function ExportPage() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", country: "", products: "", quantity: "", delivery: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="w-full bg-offwhite text-navy">

      {/* Hero */}
      <section
        className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-20 lg:px-16"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(10,8,5,0.94) 0%, rgba(40,18,5,0.86) 55%, rgba(10,8,5,0.6) 100%), url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=2000&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* text-left is explicit: #root sets `text-align: center` globally, which
            centres the headline/paragraph while leaving the flex breadcrumb and
            button row at the left edge. */}
        <div className="relative z-10 mx-auto max-w-[1400px] text-left">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <Link to="/" className="transition hover:text-brand">Home</Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-brand">Export</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">International Business</p>
          <h1 className="mt-3 text-3xl font-black leading-tight !text-white sm:text-5xl lg:text-6xl">
            Export Business
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            Exalto exports premium Rwandan natural beverages to international markets.
            We handle all documentation, cold chain logistics, and customs clearance.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a href="#quote" className="inline-flex items-center justify-center gap-2 bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(31,107,69,0.4)] transition hover:bg-brand-dark">
              Request a Quote <ChevronRight size={16} />
            </a>
            <a href="#process" className="inline-flex items-center justify-center gap-2 border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:border-brand hover:text-brand">
              Our Process
            </a>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="border-b border-line bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <Globe size={18} className="text-brand" />
              <span className="text-sm font-bold text-navy">We export to:</span>
            </div>
            {DESTINATIONS.map((d) => (
              <span key={d} className="rounded-full border border-line bg-brand-soft px-4 py-1.5 text-xs font-semibold text-concrete">{d}</span>
            ))}
            <span className="text-xs text-brand font-semibold">& more</span>
          </div>
        </div>
      </section>

      {/* Export Process */}
      <section id="process" className="bg-offwhite px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">How It Works</p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">Our Export Process</h2>
          </div>
          <div className="relative grid gap-8 md:grid-cols-5">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-line md:block" />
            {PROCESS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-brand-soft bg-brand shadow-[0_8px_20px_rgba(31,107,69,0.3)]">
                  <Icon size={22} className="text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand">Step {step}</span>
                <h3 className="mt-1 font-bold text-navy">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-concrete">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications + Packaging */}
      <section className="bg-navy px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Compliance & Quality</p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">Certifications</h2>
            <p className="mt-4 text-sm leading-7 text-white/60">All Exalto products meet international food safety and export standards. Our certifications ensure smooth customs clearance in all destination markets.</p>
            <ul className="mt-8 space-y-3">
              {CERTIFICATIONS.map((c) => (
                <li key={c} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 size={16} className="flex-shrink-0 text-brand" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { title: "Packaging Standards", desc: "Export-grade cartons, bottles, and labels compliant with destination country requirements." },
              { title: "Cold Chain Process", desc: "Temperature-controlled storage and transport from production to port of exit." },
              { title: "Shipping Information", desc: "Air freight and sea freight options. Full documentation including Bill of Lading and COO." },
              { title: "Lead Times", desc: "Standard orders: 7–14 days. Custom orders: 21–30 days from order confirmation." },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-navy bg-navy-dark p-5">
                <h3 className="font-bold text-white text-sm">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-concrete">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotation Form */}
      <section id="quote" className="bg-white px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Get a Quote</p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">Export Quotation Request</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-concrete">Submit your requirements and our export team will prepare a detailed quotation within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center sm:p-12">
              <CheckCircle2 size={48} className="mx-auto text-green-500" />
              <h3 className="mt-4 text-xl font-bold text-navy">Quotation Request Received</h3>
              <p className="mt-2 text-sm text-concrete">Our export team will prepare your quotation and contact you within 24 hours.</p>
              <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">
                Browse Products <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-offwhite p-5 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={fieldClass} placeholder="Your company" />
                </div>
                <div>
                  <label className={labelClass}>Contact Person *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} placeholder="Full name" />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldClass} placeholder="export@company.com" />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={fieldClass} placeholder="+XXX XXX XXX XXX" />
                </div>
                <div>
                  <label className={labelClass}>Destination Country *</label>
                  <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={fieldClass} placeholder="e.g. Kenya, UAE, France" />
                </div>
                <div>
                  <label className={labelClass}>Required Quantity</label>
                  <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className={fieldClass} placeholder="e.g. 500 cartons, 2 tons" />
                </div>
                <div>
                  <label className={labelClass}>Products Required *</label>
                  <input required value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} className={fieldClass} placeholder="e.g. Passion Juice, Sugarcane Wine" />
                </div>
                <div>
                  <label className={labelClass}>Preferred Delivery Date</label>
                  <input type="date" value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} className={fieldClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Special Instructions</label>
                  <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${fieldClass} resize-none`} placeholder="Packaging requirements, labelling, certifications needed..." />
                </div>
              </div>
              <button type="submit" className="mt-6 w-full rounded-xl bg-brand py-4 text-sm font-bold text-white shadow-[0_8px_30px_rgba(31,107,69,0.3)] transition hover:bg-brand-dark">
                Submit Quotation Request
              </button>
              <p className="mt-4 text-center text-xs text-concrete">Our export team will respond within 24 business hours.</p>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}
