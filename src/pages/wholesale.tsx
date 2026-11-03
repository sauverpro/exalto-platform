import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle2, Package, Clock, Users, TrendingUp } from "lucide-react";

const BENEFITS = [
  { icon: Package, title: "Bulk Pricing", desc: "Significant discounts on large orders with flexible minimum order quantities." },
  { icon: Clock, title: "Scheduled Deliveries", desc: "Set recurring delivery schedules that fit your business operations." },
  { icon: Users, title: "Account Manager", desc: "A dedicated point of contact for all your orders and enquiries." },
  { icon: TrendingUp, title: "Business Reports", desc: "Monthly purchase reports and invoices for your accounting." },
];

const STATS = [
  ["24h", "Quote turnaround"],
  ["500+", "Business clients"],
  ["100%", "Natural products"],
  ["Kigali", "Same-day delivery"],
];

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy";
const fieldClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

export default function WholesalePage() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", type: "", products: "", volume: "", message: "" });
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
            "linear-gradient(105deg, rgba(10,8,5,0.94) 0%, rgba(40,18,5,0.86) 55%, rgba(10,8,5,0.6) 100%), url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=2000&q=85')",
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
            <span className="font-semibold text-brand">Wholesale</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">For Business Buyers</p>
          <h1 className="mt-3 text-3xl font-black leading-tight !text-white sm:text-5xl lg:text-6xl">
            Wholesale Solutions
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            Partner with Exalto for reliable bulk supply of premium natural beverages.
            Competitive pricing, flexible terms, and dedicated support.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a href="#apply" className="inline-flex items-center justify-center gap-2 bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(31,107,69,0.4)] transition hover:bg-brand-dark">
              Open an Account <ChevronRight size={16} />
            </a>
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:border-brand hover:text-brand">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-white px-5 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-line md:grid-cols-4 md:divide-y-0">
          {STATS.map(([value, label]) => (
            <div key={label} className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <span className="text-2xl font-black text-brand sm:text-3xl">{value}</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-concrete">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-line bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Why Partner With Us</p>
            <h2 className="mt-2 text-2xl font-black text-navy sm:text-4xl">Built for Business Buyers</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-line bg-offwhite p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_14px_36px_rgba(31,107,69,0.13)] sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-base font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-concrete">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="bg-white px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Get Started</p>
            <h2 className="mt-2 text-2xl font-black text-navy sm:text-4xl">Open a Wholesale Account</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-concrete">Fill in the form below and our sales team will contact you within 24 hours with a tailored quote.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center sm:p-12">
              <CheckCircle2 size={48} className="mx-auto text-green-500" />
              <h3 className="mt-4 text-xl font-bold text-navy">Application Received</h3>
              <p className="mt-2 text-sm text-concrete">Our sales team will contact you within 24 hours. Thank you for choosing Exalto.</p>
              <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">
                Browse Products <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-offwhite p-5 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={fieldClass} placeholder="Your company name" />
                </div>
                <div>
                  <label className={labelClass}>Contact Person *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} placeholder="Full name" />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldClass} placeholder="business@company.com" />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={fieldClass} placeholder="+250 7XX XXX XXX" />
                </div>
                <div>
                  <label className={labelClass}>Business Type *</label>
                  <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={fieldClass}>
                    <option value="">Select type</option>
                    <option>Restaurant / Hotel</option>
                    <option>Supermarket / Retail</option>
                    <option>Distributor</option>
                    <option>Event Company</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Monthly Volume (Est.)</label>
                  <select value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} className={fieldClass}>
                    <option value="">Select range</option>
                    <option>Fr 50,000 – 150,000</option>
                    <option>Fr 150,000 – 500,000</option>
                    <option>Fr 500,000+</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Products of Interest</label>
                  <input value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} className={fieldClass} placeholder="e.g. Passion Juice, Sugarcane Wine" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Additional Notes</label>
                  <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${fieldClass} resize-none`} placeholder="Any specific requirements or questions..." />
                </div>
              </div>
              <button type="submit" className="mt-6 w-full rounded-xl bg-brand py-4 text-sm font-bold text-white shadow-[0_8px_30px_rgba(31,107,69,0.3)] transition hover:bg-brand-dark">
                Submit Application
              </button>
              <p className="mt-4 text-center text-xs text-concrete">Our team will respond within 24 business hours.</p>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}
