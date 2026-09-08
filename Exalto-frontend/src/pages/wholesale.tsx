import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle2, Package, Clock, Users, TrendingUp } from "lucide-react";

const BENEFITS = [
  { icon: Package, title: "Bulk Pricing", desc: "Significant discounts on large orders with flexible minimum order quantities." },
  { icon: Clock, title: "Scheduled Deliveries", desc: "Set recurring delivery schedules that fit your business operations." },
  { icon: Users, title: "Account Manager", desc: "A dedicated point of contact for all your orders and enquiries." },
  { icon: TrendingUp, title: "Business Reports", desc: "Monthly purchase reports and invoices for your accounting." },
];

export default function WholesalePage() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", type: "", products: "", volume: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="w-full bg-[#fffdf8] text-[#2a1f1a]">

      {/* Hero */}
      <section className="relative flex min-h-[480px] items-center overflow-hidden bg-[#251c18] px-5 pb-16 pt-36 sm:px-8">
        <div className="mx-auto max-w-[1400px] w-full">
          <div className="flex items-center gap-2 mb-5 text-xs text-white/50">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#c94708]">Wholesale</span>
          </div>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c94708]">For Business Buyers</p>
            <h1 className="mt-4 text-5xl font-black leading-tight !text-white sm:text-6xl lg:text-7xl">
              Wholesale<br />
              <span className="text-[#c94708]">Solutions</span>
            </h1>
            <p className="mt-3 max-w-3xl text-[11px] leading-4 text-white/70 sm:whitespace-nowrap sm:text-xs">
              Partner with Exalto for reliable bulk supply of premium natural beverages. Competitive pricing, flexible terms, and dedicated support for your business.
            </p>
          
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-[#eadfce] bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#c94708]/10">
                <Icon size={22} className="text-[#c94708]" />
              </div>
              <div>
                <h3 className="font-bold text-[#251c18]">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#77716d]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Tiers */}
      

      {/* Application Form */}
      <section id="apply" className="bg-white px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Get Started</p>
            <h2 className="mt-2 text-3xl font-black text-[#251c18] sm:text-4xl">Open a Wholesale Account</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[#77716d]">Fill in the form below and our sales team will contact you within 24 hours with a tailored quote.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-12 text-center">
              <CheckCircle2 size={48} className="mx-auto text-green-500" />
              <h3 className="mt-4 text-xl font-bold text-[#251c18]">Application Received!</h3>
              <p className="mt-2 text-sm text-[#77716d]">Our sales team will contact you within 24 hours. Thank you for choosing Exalto.</p>
              <Link to="/shop" className="mt-6 inline-flex items-center gap-2 bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]">
                Browse Products <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-[#eadfce] bg-[#fffdf8] p-8 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Company Name *</label>
                  <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="Your company name" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Contact Person *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="Full name" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Email Address *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="business@company.com" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Phone Number *</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="+250 7XX XXX XXX" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Business Type *</label>
                  <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]">
                    <option value="">Select type</option>
                    <option>Restaurant / Hotel</option>
                    <option>Supermarket / Retail</option>
                    <option>Distributor</option>
                    <option>Event Company</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Monthly Volume (Est.)</label>
                  <select value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708]">
                    <option value="">Select range</option>
                    <option>Fr 50,000 – 150,000</option>
                    <option>Fr 150,000 – 500,000</option>
                    <option>Fr 500,000+</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Products of Interest</label>
                  <input value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} className="w-full border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="e.g. Passion Juice, Sugarcane Wine" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Additional Notes</label>
                  <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full resize-none border border-[#ded5cd] bg-white px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="Any specific requirements or questions..." />
                </div>
              </div>
              <button type="submit" className="mt-6 w-full bg-[#c94708] py-4 text-sm font-bold text-white hover:bg-[#9f3506] transition shadow-[0_8px_30px_rgba(201,71,8,0.3)]">
                Submit Application
              </button>
              <p className="mt-4 text-center text-xs text-[#9a8a82]">Our team will respond within 24 business hours.</p>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}
