import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-5 py-24">
      <div className="w-full max-w-md">

        <Link to="/login" className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#77716d] hover:text-[#c94708] transition">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {sent ? (
          <div className="rounded-2xl border border-[#eadfce] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-[#251c18]">Check Your Email</h2>
            <p className="mt-3 text-sm leading-6 text-[#77716d]">
              We've sent password reset instructions to <strong className="text-[#251c18]">{email}</strong>. Check your inbox and follow the link.
            </p>
            <p className="mt-4 text-xs text-[#9a8a82]">Didn't receive it? Check your spam folder or</p>
            <button onClick={() => setSent(false)} className="mt-1 text-xs font-bold text-[#c94708] hover:underline">
              try a different email address
            </button>
            <Link to="/login" className="mt-6 block w-full bg-[#c94708] py-3 text-sm font-bold text-white hover:bg-[#9f3506] transition text-center">
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#eadfce] bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c94708]/10">
                <Mail size={24} className="text-[#c94708]" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c94708]">Account Recovery</p>
              <h1 className="mt-3 text-3xl font-black text-[#251c18]">Reset Password</h1>
              <p className="mt-2 text-sm text-[#77716d]">Enter your email address and we'll send you instructions to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b9aaa1]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-[#ded5cd] bg-[#fffdf8] pl-11 pr-4 py-3.5 text-sm outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c94708] py-3.5 text-sm font-bold text-white hover:bg-[#9f3506] transition disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </span>
                ) : "Send Reset Link"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#77716d]">
              Remember your password?{" "}
              <Link to="/login" className="font-bold text-[#c94708] hover:underline">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
