
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [accountType, setAccountType] = useState<
    "individual" | "business"
  >("individual");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await registerUser({
  name: form.name,
  email: form.email,
  phone: form.phone,
  password: form.password,
});

      console.log("Registration successful:", data);

      setSuccess("Account created successfully!");

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;

        setError(
          Object.values(errors)
            .flat()
            .join(" ")
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 pb-20 pt-28 sm:px-8">
      <div className="mx-auto max-w-lg">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c94708]">
            Exalto Account
          </p>

          <h1 className="mt-3 text-3xl font-black text-[#251c18]">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-[#77716d]">
            Join thousands of customers enjoying Rwanda's finest beverages.
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-[#eadfce] bg-[#f3efe9] p-1.5">
          {(["individual", "business"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAccountType(type)}
              className={`rounded-lg py-2.5 text-sm font-bold capitalize transition ${
                accountType === type
                  ? "bg-white text-[#c94708] shadow-sm"
                  : "text-[#77716d] hover:text-[#251c18]"
              }`}
            >
              {type === "individual"
                ? "Personal"
                : "Business / Wholesale"}
            </button>
          ))}
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#eadfce] bg-white p-7 sm:p-8"
        >
          <div className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">
                Full Name *
              </label>

              <input
                required
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30"
                placeholder="Your full name"
              />
            </div>

            {/* Company Name */}
            {accountType === "business" && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">
                  Company Name *
                </label>

                <input
                  required={accountType === "business"}
                  type="text"
                  value={form.company}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: e.target.value,
                    })
                  }
                  className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30"
                  placeholder="Your company name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">
                Email *
              </label>

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">
                Phone Number
              </label>

              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30"
                placeholder="+250 7XX XXX XXX"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">
                Password *
              </label>

              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="w-full border border-[#ded5cd] px-4 py-3 pr-12 text-sm outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30"
                  placeholder="Min. 8 characters"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a82] hover:text-[#c94708]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Business Information */}
            {accountType === "business" && (
              <div className="rounded-xl border border-[#eadfce] bg-[#f3efe9] p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-[#c94708]"
                  />

                  <p className="text-xs leading-5 text-[#6d6b69]">
                    Business accounts get access to wholesale pricing,
                    bulk ordering, and a dedicated account manager.
                    Our team will verify your account within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c94708] py-3.5 text-sm font-bold text-white transition hover:bg-[#9f3506] disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_8px_20px_rgba(201,71,8,0.25)]"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="mt-5 text-center text-sm text-[#77716d]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#c94708] hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* Wholesale Link */}
        {accountType === "business" && (
          <p className="mt-3 text-center text-xs text-[#9a8a82]">
            Need bulk pricing now?{" "}
            <Link
              to="/wholesale"
              className="font-semibold text-[#c94708] hover:underline"
            >
              Open a wholesale account →
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
