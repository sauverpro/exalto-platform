import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  User,
  Building2,
} from "lucide-react";
import { registerUser } from "../api/auth";
import logoImage from "../assets/logo-image.png";
import wineImage from "../assets/sugarcane-wine.jpg";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<
    "individual" | "business"
  >("individual");

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Account type determines the role
      const role =
        accountType === "business" ? "sales_manager" : "client";

      const data = await registerUser({
        full_name: form.name,
        email: form.email,
        phone_number: form.phone,
        password: form.password,
        role,
        company_name:
          accountType === "business" ? form.company : undefined,
      });

      console.log("Registration successful:", data);

      setSuccess("Account created! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err: any) {
      const msg = err.response?.data?.message;

      if (msg && typeof msg === "object") {
        setError(Object.values(msg).flat().join(" "));
      } else {
        setError(
          msg || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Left: Form */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-5 py-10 sm:px-8 sm:py-12 md:w-[55%]">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Link to="/">
              <img
                src={logoImage}
                alt="Exalto"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Heading */}
          <h1 className="mb-1 text-center text-3xl font-black text-navy">
            Create Account
          </h1>

          <p className="mb-6 text-center text-sm text-concrete">
            Join Exalto and start ordering today
          </p>

          {/* Account Type Toggle */}
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-[#eee] bg-[#f9f6f3] p-1">
            {(
              [
                {
                  value: "individual",
                  label: "Customer",
                  icon: User,
                },
                {
                  value: "business",
                  label: "Business",
                  icon: Building2,
                },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setAccountType(value)}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                  accountType === value
                    ? "bg-white text-brand shadow-sm"
                    : "text-concrete hover:text-navy"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3.5"
          >

            {/* Full Name */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">
                Full Name *
              </label>

              <input
                required
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Your full name"
                className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-sm text-navy placeholder-[#c4b8b0] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>

            {/* Company Name */}
            {accountType === "business" && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy">
                  Company Name *
                </label>

                <input
                  required
                  type="text"
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Your company name"
                  className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-sm text-navy placeholder-[#c4b8b0] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">
                Email Address *
              </label>

              <input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="youremail@gmail.com"
                className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-sm text-navy placeholder-[#c4b8b0] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">
                Phone Number
              </label>

              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+250 7XX XXX XXX"
                className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-sm text-navy placeholder-[#c4b8b0] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy">
                Password *
              </label>

              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 pr-10 text-sm text-navy placeholder-[#c4b8b0] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] transition hover:text-brand"
                >
                  {showPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                required
                id="terms"
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 accent-brand"
              />

              <label
                htmlFor="terms"
                className="text-[11px] leading-5 text-concrete"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-semibold text-brand hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="font-semibold text-brand hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-600">
                <CheckCircle2 size={13} />
                {success}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(31,107,69,0.35)] transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-5 text-center text-xs text-concrete">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-brand hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-3 text-center text-[10px] text-[#bbb]">
            By continuing, you agree to Exalto's{" "}
            <Link
              to="/terms"
              className="underline hover:text-brand"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy-policy"
              className="underline hover:text-brand"
            >
              Privacy Policy
            </Link>
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
}
