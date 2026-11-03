import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/logo-image.png";
import wineImage from "../assets/sugarcane-wine.jpg";
import { loginUser } from "../api/auth";
import { useUser } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
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
      //console.log(email);
      const data = await loginUser({ email, password });
      //console.log(data);
      login(data.data, data.token);
     // let's get user data from api end point
       

     const dashboardRedirect =
  data.data.role === "admin"
    ? "/admin-dashboard"
    : data.data.role === "sales_manager"
      ? "/sales-manager-dashboard"
      : "/shop";

      navigate(from || dashboardRedirect, { replace: true });
      
    } catch (err: any) {
      const msg = err.response?.data?.message;
      
      if (msg && typeof msg === "object") {
        setError(Object.values(msg).flat().join(" "));
      } else {
        setError(err.response?.data?.error || msg || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen">

      {/* ── Left: Form ── */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-5 py-10 sm:px-8 sm:py-12 md:w-[55%]">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Link to="/">
              <img src={logoImage} alt="Exalto" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Heading */}
          <h1 className="mb-1 text-center text-3xl font-black text-navy">Welcome Back!</h1>
          <p className="mb-7 text-center text-sm text-concrete">Please enter your details</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">Email Address</label>
              <input
                type="email" value={email} required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-sm text-navy placeholder-[#c4b8b0] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 pr-10 text-sm text-navy placeholder-[#c4b8b0] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-brand transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-concrete">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 accent-brand" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-brand hover:underline">
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
              className="w-full rounded-lg bg-brand py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(31,107,69,0.35)] transition hover:bg-brand-dark disabled:opacity-60"
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
          <p className="mt-5 text-center text-xs text-concrete">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-brand hover:underline">Create account</Link>
          </p>
          <p className="mt-4 text-center text-[10px] text-[#bbb]">
            By continuing, you agree to Exalto's{" "}
            <Link to="/terms" className="underline hover:text-brand">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy-policy" className="underline hover:text-brand">Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden md:block md:w-[45%]">
        <img
          src={wineImage}
          alt="Exalto Products"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;