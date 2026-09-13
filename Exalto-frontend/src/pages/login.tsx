import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/logo image.png";
import { loginUser } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🔐 This handles the redirect fallbacks safely
  const from = (location.state as any)?.from || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send credentials Laravel API
      const data = await loginUser({ email, password });
      
      console.log("Login successful:", data);
      
      // Save authentication details in browser storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Dynamic routing path check based on the Laravel role string
      const dashboardRedirect = 
        data.user.role === "business" 
          ? "/business-dashboard" 
          : "/customer-dashboard";

      // 🔐 FIX: Explicitly check and read the 'from' variable so the build passes
      const targetRoute = from || dashboardRedirect;
      navigate(targetRoute, { replace: true });
      
    } catch (err: any) {
      // catch standard backend error strings or array validation errors
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(" "));
      } else {
        setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Left: Form ── */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-8 py-12 md:w-[55%]">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Link to="/">
              <img src={logoImage} alt="Exalto" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Heading */}
          <h1 className="mb-1 text-center text-3xl font-black text-[#251c18]">Welcome Back!</h1>
          <p className="mb-7 text-center text-sm text-[#9a8a82]">Please enter your details</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#3d291c]">Email Address</label>
              <input
                type="email" value={email} required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-sm text-[#251c18] placeholder-[#c4b8b0] outline-none transition focus:border-[#c94708] focus:ring-2 focus:ring-[#c94708]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#3d291c]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 pr-10 text-sm text-[#251c18] placeholder-[#c4b8b0] outline-none transition focus:border-[#c94708] focus:ring-2 focus:ring-[#c94708]/10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#c94708] transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#77716d]">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#c94708]" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-[#c94708] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full rounded-lg bg-[#c94708] py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(201,71,8,0.35)] transition hover:bg-[#9f3506] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Bottom links */}
          <p className="mt-5 text-center text-xs text-[#9a8a82]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#c94708] hover:underline">Create account</Link>
          </p>
          <p className="mt-4 text-center text-[10px] text-[#bbb]">
            By continuing, you agree to Exalto's{" "}
            <Link to="/terms" className="underline hover:text-[#c94708]">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy-policy" className="underline hover:text-[#c94708]">Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* ── Right: Image Visual Sidebar ── */}
      <div className="hidden md:flex md:w-[45%] h-full bg-[#251c18] items-center justify-center p-12">
        <p className="text-white text-xl font-medium italic text-center">"Welcome back to Exalto Premium Beverages"</p>
      </div>

    </div>
  );
};

export default Login;