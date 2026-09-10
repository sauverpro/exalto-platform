import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, Mail, MapPin, Phone, ChevronRight, CheckCircle2 } from "lucide-react";

const CONTACT_ITEMS = [
  { icon: MapPin, title: "Our Location", lines: ["Kamonyi District, Rwanda"], sub: "Visit us at our production facility" },
  { icon: Phone, title: "Phone", lines: ["+250 788 537 463"], href: "tel:+250788537463", sub: "Mon – Sun, 8:00 AM – 9:00 PM" },
  { icon: Mail, title: "Email", lines: ["exaltoltd@gmail.com"], href: "mailto:exaltoltd@gmail.com", sub: "We reply within 24 hours" },
  { icon: Clock3, title: "Business Hours", lines: ["Monday – Sunday", "8:00 AM – 9:00 PM"], sub: "Including public holidays" },
];

const FAQS = [
  { q: "What are your delivery times?", a: "Same-day delivery in Kigali for orders placed before 12:00 PM. Nationwide delivery takes 2–3 business days." },
  { q: "Do you offer cash on delivery?", a: "Yes. Cash on delivery is available for retail orders within Kigali." },
  { q: "Can I visit your facility?", a: "Yes, visits are welcome by appointment. Contact us to schedule a tour in Kamonyi." },
  { q: "Do you deliver outside Kigali?", a: "Yes. We deliver nationwide across Rwanda. Contact us for delivery fees and schedules." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="w-full bg-[#fffdf8] text-[#2a1f1a]">

      {/* Page header */}
      <section className="border-b border-[#eadfce] bg-white px-5 pt-28 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-center gap-2 mb-4 text-xs text-[#9a8a82]">
            <Link to="/" className="hover:text-[#c94708] transition">Home</Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#c94708]">Contact</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">We're here to help</p>
          <h1 className="mt-2 text-4xl font-black text-[#251c18] sm:text-5xl">Get in Touch</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#77716d]">
            Have a question, want to place a bulk order, or just want to say hello? Our team is ready to help you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-[#fffdf8] px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_ITEMS.map(({ icon: Icon, title, lines, href, sub }) => (
              <div key={title} className="group rounded-2xl border border-[#eadfce] bg-white p-7 shadow-sm transition hover:border-[#c94708]/40 hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#c94708]/10 transition group-hover:bg-[#c94708]/20">
                  <Icon size={22} className="text-[#c94708]" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a8a82]">{title}</p>
                <div className="mt-2">
                  {lines.map((line) =>
                    href ? (
                      <a key={line} href={href} className="block text-base font-bold text-[#251c18] hover:text-[#c94708] transition">{line}</a>
                    ) : (
                      <p key={line} className="text-base font-bold text-[#251c18]">{line}</p>
                    )
                  )}
                </div>
                <p className="mt-2 text-xs text-[#9a8a82]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Side */}
      <section className="bg-[#f3efe9] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

            {/* Form */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Send a Message</p>
              <h2 className="mt-3 text-3xl font-black text-[#251c18] sm:text-4xl">We'd Love to Hear From You</h2>
              <p className="mt-3 text-sm leading-7 text-[#77716d]">Fill in the form and we'll get back to you within 24 hours.</p>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-[#251c18]">Message Sent!</h3>
                  <p className="mt-2 text-sm text-[#77716d]">Thank you for reaching out. We'll reply within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-5 text-sm font-bold text-[#c94708] hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Full Name *</label>
                      <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full border border-[#ded5cd] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/20" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Email Address *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full border border-[#ded5cd] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/20" />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Phone Number</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+250 7XX XXX XXX"
                        className="w-full border border-[#ded5cd] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/20" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Subject *</label>
                      <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-[#ded5cd] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#c94708]">
                        <option value="">Select a subject</option>
                        <option>Product Enquiry</option>
                        <option>Wholesale / Bulk Order</option>
                        <option>Export Enquiry</option>
                        <option>Order Support</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      className="w-full resize-none border border-[#ded5cd] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/20" />
                  </div>
                  <button type="submit" className="w-full bg-[#c94708] py-4 text-sm font-bold text-white hover:bg-[#9f3506] transition shadow-[0_8px_20px_rgba(201,71,8,0.25)]">
                    Send Message
                  </button>
                  <p className="text-center text-xs text-[#9a8a82]">We respond to all messages within 24 business hours.</p>
                </form>
              )}
            </div>

            {/* Right side */}
            <div className="space-y-6">
              {/* Map */}
              <div className="overflow-hidden rounded-2xl border border-[#eadfce] shadow-sm">
                <iframe
                  title="Exalto Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63799.41!2d29.87!3d-2.00!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc400000000000%3A0x0!2sKamonyi%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1700000000000"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Direct contact */}
              <div className="rounded-2xl border border-[#eadfce] bg-white p-7">
                <h3 className="font-bold text-[#251c18]">Prefer to talk directly?</h3>
                <p className="mt-1 text-sm text-[#77716d]">Our team is available 7 days a week.</p>
                <div className="mt-5 space-y-3">
                  <a href="tel:+250788537463" className="flex items-center gap-4 rounded-xl border border-[#eadfce] p-4 hover:border-[#c94708]/40 transition group">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#c94708]/10 group-hover:bg-[#c94708]/20 transition">
                      <Phone size={18} className="text-[#c94708]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a8a82]">Call us</p>
                      <p className="font-bold text-[#251c18]">+250 788 537 463</p>
                    </div>
                  </a>
                  <a href="mailto:exaltoltd@gmail.com" className="flex items-center gap-4 rounded-xl border border-[#eadfce] p-4 hover:border-[#c94708]/40 transition group">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#c94708]/10 group-hover:bg-[#c94708]/20 transition">
                      <Mail size={18} className="text-[#c94708]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a8a82]">Email us</p>
                      <p className="font-bold text-[#251c18]">exaltoltd@gmail.com</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Quick links */}
              <div className="rounded-2xl border border-[#eadfce] bg-white p-7">
                <h3 className="font-bold text-[#251c18]">Looking for something specific?</h3>
                <div className="mt-4 space-y-2">
                  {[
                    { label: "Open a Wholesale Account", to: "/wholesale" },
                    { label: "Request an Export Quote", to: "/export" },
                    { label: "Browse Our Products", to: "/shop" },
                    { label: "Read our FAQs", to: "/faqs" },
                  ].map(({ label, to }) => (
                    <Link key={to} to={to} className="flex items-center justify-between rounded-xl border border-[#eadfce] px-4 py-3 text-sm font-semibold text-[#251c18] hover:border-[#c94708]/40 hover:text-[#c94708] transition group">
                      {label}
                      <ChevronRight size={15} className="text-[#c94708] group-hover:translate-x-0.5 transition" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Quick Answers</p>
            <h2 className="mt-3 text-2xl font-black text-[#251c18] sm:text-3xl">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-[#eadfce] bg-[#fffdf8] p-6">
                <h3 className="font-bold text-[#251c18]">{q}</h3>
                <p className="mt-3 text-sm leading-7 text-[#77716d]">{a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/faqs" className="inline-flex items-center gap-2 text-sm font-bold text-[#c94708] hover:underline">
              View all FAQs <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
