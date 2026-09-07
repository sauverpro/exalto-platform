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

export default function ExportPage() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", country: "", products: "", quantity: "", delivery: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="w-full bg-[#fffdf8] text-[#2a1f1a]">

      {/* Hero */}
      <section
        className="relative flex min-h-[480px] items-center overflow-hidden px-5 pb-16 pt-36 sm:px-8"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(10,8,5,0.94) 0%, rgba(30,15,5,0.85) 60%, rgba(10,8,5,0.60) 100%), url('https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=2000&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-[1400px] w-full">
          <div className="flex items-center gap-2 mb-5 text-xs text-white/50">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#c94708]">Export</span>
          </div>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c94708]">International Business</p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              Export<br />
              <span className="text-[#c94708]">Business</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
              Exalto exports premium Rwandan natural beverages to international markets. We handle all documentation, cold chain logistics, and customs clearance.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#quote" className="inline-flex items-center gap-2 bg-[#c94708] px-8 py-4 text-sm font-bold text-white hover:bg-[#9f3506] transition">
                Request a Quote <ChevronRight size={16} />
              </a>
              <a href="#process" className="inline-flex items-center gap-2 border border-white/30 px-8 py-4 text-sm font-bold text-white hover:border-[#c94708] hover:text-[#c94708] transition">
                Our Process
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="border-b border-[#eadfce] bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <Globe size={18} className="text-[#c94708]" />
              <span className="text-sm font-bold text-[#251c18]">We export to:</span>
            </div>
            {DESTINATIONS.map((d) => (
              <span key={d} className="rounded-full border border-[#eadfce] bg-[#f3efe9] px-4 py-1.5 text-xs font-semibold text-[#6d6b69]">{d}</span>
            ))}
            <span className="text-xs text-[#c94708] font-semibold">& more</span>
          </div>
        </div>
      </section>

      {/* Export Process */}
      <section id="process" className="bg-[#fffdf8] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">How It Works</p>
            <h2 className="mt-2 text-3xl font-black text-[#251c18] sm:text-4xl">Our Export Process</h2>
          </div>
          <div className="relative grid gap-8 md:grid-cols-5">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-[#eadfce] md:block" />
            {PROCESS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[#f3efe9] bg-[#c94708] shadow-[0_8px_20px_rgba(201,71,8,0.3)]">
                  <Icon size={22} className="text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#c94708]">Step {step}</span>
                <h3 className="mt-1 font-bold text-[#251c18]">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#77716d]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications + Packaging */}
      <section className="bg-[#251c18] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Compliance & Quality</p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">Certifications</h2>
            <p className="mt-4 text-sm leading-7 text-white/60">All Exalto products meet international food safety and export standards. Our certifications ensure smooth customs clearance in all destination markets.</p>
            <ul className="mt-8 space-y-3">
              {CERTIFICATIONS.map((c) => (
                <li key={c} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 size={16} className="flex-shrink-0 text-[#c94708]" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Packaging Standards", desc: "Export-grade cartons, bottles, and labels compliant with destination country requirements." },
              { title: "Cold Chain Process", desc: "Temperature-controlled storage and transport from production to port of exit." },
              { title: "Shipping Information", desc: "Air freight and sea freight options. Full documentation including Bill of Lading and COO." },
              { title: "Lead Times", desc: "Standard orders: 7–14 days. Custom orders: 21–30 days from order confirmation." },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-[#3d291c] bg-[#1a1008] p-5">
                <h3 className="font-bold text-white text-sm">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#9a8a82]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotation Form */}
      <section id="quote" className="bg-white px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Get a Quote</p>
            <h2 className="mt-2 text-3xl font-black text-[#251c18] sm:text-4xl">Export Quotation Request</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[#77716d]">Submit your requirements and our export team will prepare a detailed quotation within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-12 text-center">
              <CheckCircle2 size={48} className="mx-auto text-green-500" />
              <h3 className="mt-4 text-xl font-bold text-[#251c18]">Quotation Request Received!</h3>
              <p className="mt-2 text-sm text-[#77716d]">Our export team will prepare your quotation and contact you within 24 hours.</p>
              <Link to="/" className="mt-6 inline-flex items-center gap-2 bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]">
                Back to Home <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-[#eadfce] bg-[#fffdf8] p-8 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Company Name *</label>
                  <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="Your company" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Contact Person *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="Full name" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="export@company.com" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Phone *</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="+XXX XXX XXX XXX" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Destination Country *</label>
                  <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="e.g. Kenya, UAE, France" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Required Quantity</label>
                  <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="e.g. 500 cartons, 2 tons" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Products Required *</label>
                  <input required value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="e.g. Passion Juice, Sugarcane Wine" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Preferred Delivery Date</label>
                  <input type="date" value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Special Instructions</label>
                  <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full resize-none border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="Packaging requirements, labelling, certifications needed..." />
                </div>
              </div>
              <button type="submit" className="mt-6 w-full bg-[#c94708] py-4 text-sm font-bold text-white hover:bg-[#9f3506] transition shadow-[0_8px_30px_rgba(201,71,8,0.3)]">
                Submit Quotation Request
              </button>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}
