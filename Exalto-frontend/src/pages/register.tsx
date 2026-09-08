import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"individual" | "business">("individual");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 pb-20 pt-28 sm:px-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c94708]">Exalto Account</p>
          <h1 className="mt-3 text-3xl font-black text-[#251c18]">Create Your Account</h1>
          <p className="mt-2 text-sm text-[#77716d]">Join thousands of customers enjoying Rwanda's finest beverages.</p>
        </div>

        {/* Account type toggle */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-[#eadfce] bg-[#f3efe9] p-1.5">
          {(["individual", "business"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAccountType(type)}
              className={`rounded-lg py-2.5 text-sm font-bold capitalize transition ${accountType === type ? "bg-white text-[#c94708] shadow-sm" : "text-[#77716d] hover:text-[#251c18]"}`}
            >
              {type === "individual" ? "Personal" : "Business / Wholesale"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#eadfce] bg-white p-7 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Full Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="Your full name" />
            </div>

            {accountType === "business" && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Company Name *</label>
                <input required={accountType === "business"} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="Your company name" />
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Email Address *</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="you@example.com" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Phone Number</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="+250 7XX XXX XXX" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Password *</label>
              <div className="relative">
                <input required minLength={8} type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 pr-12 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a82] hover:text-[#c94708]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {accountType === "business" && (
              <div className="rounded-xl border border-[#eadfce] bg-[#f3efe9] p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#c94708]" />
                  <p className="text-xs leading-5 text-[#6d6b69]">
                    Business accounts get access to wholesale pricing, bulk ordering, and a dedicated account manager. Our team will verify your account within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-[#c94708] py-3.5 text-sm font-bold text-white hover:bg-[#9f3506] transition shadow-[0_8px_20px_rgba(201,71,8,0.25)]">
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-[#77716d]">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#c94708] hover:underline">Sign in</Link>
        </p>

        {accountType === "business" && (
          <p className="mt-3 text-center text-xs text-[#9a8a82]">
            Need bulk pricing now?{" "}
            <Link to="/wholesale" className="font-semibold text-[#c94708] hover:underline">Open a wholesale account →</Link>
          </p>
        )}
      </div>
    </main>
  );
}
