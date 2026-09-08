import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/customer-dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    navigate(from);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#fffdfb] px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c94708]">Exalto Account</p>
          <h1 className="text-3xl font-black text-[#251c18]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[#77716d]">Sign in to your account to continue</p>
        </div>

        <div className="rounded-2xl border border-[#eee8e2] bg-white p-8 shadow-sm sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b9aaa1]" />
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full border border-[#ded5cd] bg-[#fffdf8] pl-11 pr-4 py-3.5 text-sm outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#c94708] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b9aaa1]" />
                <input
                  id="password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" required
                  className="w-full border border-[#ded5cd] bg-[#fffdf8] pl-11 pr-12 py-3.5 text-sm outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a82] hover:text-[#c94708]">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="h-4 w-4 accent-[#c94708]" />
              <label htmlFor="remember" className="text-sm text-[#77716d]">Remember me</label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#c94708] py-3.5 text-sm font-bold text-white transition hover:bg-[#9f3506] disabled:opacity-70">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#77716d]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#c94708] hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
