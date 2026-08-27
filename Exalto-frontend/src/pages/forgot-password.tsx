import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 pb-20 pt-32 text-[#2a1f1a]">
      <form className="mx-auto max-w-md border border-[#eadfce] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c94708]">Account recovery</p>
        <h1 className="mt-3 text-3xl font-black">Reset your password</h1>
        <p className="mt-2 text-sm text-[#77716d]">Enter your email and we will send recovery instructions.</p>
        <label className="mt-8 block text-sm font-medium">Email address<input required type="email" className="mt-2 w-full border border-[#ded5cd] px-4 py-3 outline-none focus:border-[#c94708]" /></label>
        <button type="submit" className="mt-5 w-full bg-[#c94708] px-5 py-3 font-bold text-white hover:bg-[#9f3506]">Send reset link</button>
        <Link to="/login" className="mt-6 block text-center text-sm font-bold text-[#c94708]">Back to login</Link>
      </form>
    </main>
  );
}
