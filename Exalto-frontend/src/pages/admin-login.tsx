import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (loginAdmin(email, password)) {
      navigate("/admin-dashboard");
    } else {
      setError("Invalid admin credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#0f0a08]">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(15,10,8,0.92) 0%, rgba(60,20,5,0.85) 100%), url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#c94708]/20 via-transparent to-transparent" />
        <div className="relative z-10 px-16 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#c94708] shadow-[0_0_60px_rgba(201,71,8,0.5)]">
            <span className="text-3xl font-black text-white">E</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">EXALTO</h1>
          <p className="mt-3 text-lg font-light tracking-[0.3em] text-[#c94708] uppercase">Admin Portal</p>
          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#c94708] to-transparent" />
          <p className="mt-8 max-w-xs text-sm leading-7 text-[#9a8a82]">
            Manage your products, orders, and business analytics from one powerful dashboard.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full border border-[#c94708]/10" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-[#c94708]/15" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-[#c94708]/10" />
      </div>

      {/* Right login form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 bg-[#0f0a08]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 flex flex-col items-center lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c94708] shadow-[0_0_40px_rgba(201,71,8,0.4)]">
              <span className="text-2xl font-black text-white">E</span>
            </div>
            <h1 className="mt-4 text-3xl font-black text-white">EXALTO</h1>
            <p className="mt-1 text-xs tracking-[0.3em] text-[#c94708] uppercase">Admin Portal</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-[#c94708]" />
              <h2 className="text-2xl font-bold text-white">Secure Sign In</h2>
            </div>
            <p className="mt-2 text-sm text-[#6b5e58]">Enter your admin credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-[#6b5e58]">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a3d38]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exalto.com"
                  required
                  className="w-full border border-[#2a1f1a] bg-[#1a1008] pl-11 pr-4 py-3.5 text-sm text-white placeholder-[#4a3d38] outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/50 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-[#6b5e58]">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a3d38]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-[#2a1f1a] bg-[#1a1008] pl-11 pr-12 py-3.5 text-sm text-white placeholder-[#4a3d38] outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/50 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a3d38] hover:text-[#c94708] transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-lg bg-[#c94708] py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_8px_30px_rgba(201,71,8,0.35)] transition hover:bg-[#a83906] hover:shadow-[0_8px_30px_rgba(201,71,8,0.5)] disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Authenticating...
                </span>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-[#2a1f1a] bg-[#1a1008] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#4a3d38]">Demo Credentials</p>
            <p className="text-xs text-[#6b5e58]">
              Email: <span className="font-mono text-[#c94708]">admin@exalto.com</span>
            </p>
            <p className="mt-1 text-xs text-[#6b5e58]">
              Password: <span className="font-mono text-[#c94708]">Admin123!</span>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-[#3d3028]">
            © {new Date().getFullYear()} Exalto Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
