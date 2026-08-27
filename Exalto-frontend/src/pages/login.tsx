import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Backend authentication will be connected here
    console.log({
      email,
      password,
    });

    navigate("/");
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#fffdfb] px-6 py-24">
      <div className="w-full max-w-md border border-[#eee8e2] bg-white p-8 shadow-sm sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c94708]">Exalto account</p>
          <h1 className="text-3xl font-bold text-[#251c18]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#77716d]">
            Login to your account to continue shopping
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#3d291c]"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
                className="w-full border border-[#ded5cd] bg-[#fffdf8] px-4 py-3 outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                  className="text-sm font-medium text-[#3d291c]"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                  className="text-sm font-medium text-[#c94708] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
                className="w-full border border-[#ded5cd] bg-[#fffdf8] px-4 py-3 outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 accent-[#c94708]"
            />

            <label
              htmlFor="remember"
              className="text-sm text-[#77716d]"
            >
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#c94708] py-3 font-semibold text-white transition hover:bg-[#9f3506]"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-[#77716d]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#c94708] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;