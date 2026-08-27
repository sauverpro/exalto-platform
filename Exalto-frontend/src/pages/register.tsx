import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 pb-20 pt-32 text-[#2a1f1a]">
      <form className="mx-auto max-w-md border border-[#eadfce] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c94708]">Exalto account</p>
        <h1 className="mt-3 text-3xl font-black">Create your account</h1>
        <p className="mt-2 text-sm text-[#77716d]">Save your details for a faster checkout.</p>
        <div className="mt-8 space-y-5">
          <label className="block text-sm font-medium">Full name<input required type="text" className="mt-2 w-full border border-[#ded5cd] px-4 py-3 outline-none focus:border-[#c94708]" /></label>
          <label className="block text-sm font-medium">Email address<input required type="email" className="mt-2 w-full border border-[#ded5cd] px-4 py-3 outline-none focus:border-[#c94708]" /></label>
          <label className="block text-sm font-medium">Password<input required minLength={8} type="password" className="mt-2 w-full border border-[#ded5cd] px-4 py-3 outline-none focus:border-[#c94708]" /></label>
          <button type="submit" className="w-full bg-[#c94708] px-5 py-3 font-bold text-white hover:bg-[#9f3506]">Create account</button>
        </div>
        <p className="mt-6 text-center text-sm text-[#77716d]">Already registered? <Link to="/login" className="font-bold text-[#c94708]">Log in</Link></p>
      </form>
    </main>
  );
}
