import { Clock3, Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
	return (
		<main className="w-full bg-[#fffdfb] text-[#251c18]">
			<section className="bg-[linear-gradient(110deg,#c77b5c,#607fe0)] px-5 pb-10 pt-28 text-center text-white sm:pb-12">
				<p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/75">We are here to help</p>
				<h1 className="mt-3 text-4xl font-bold sm:text-5xl">Contact</h1>
				<p className="mx-auto mt-3 max-w-md text-xs leading-5 text-white/85">We&apos;d love to hear from you. Get in touch with our team for any questions or support.</p>
			</section>

			<section className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1.05fr]">
				<form className="border border-[#ded5cd] bg-white p-5 shadow-[0_4px_16px_rgba(80,52,30,0.05)] sm:p-6">
					<h2 className="text-sm font-bold text-[#251c18]">Send us a message</h2>
					<div className="mt-5 grid gap-4">
						<label className="text-[10px] font-semibold text-[#3d291c]">Full name<input type="text" name="name" required className="mt-1.5 w-full border border-[#ded5cd] bg-[#fffdf8] px-3 py-2 text-xs outline-none focus:border-[#c94708]" /></label>
						<label className="text-[10px] font-semibold text-[#3d291c]">Email<input type="email" name="email" required className="mt-1.5 w-full border border-[#ded5cd] bg-[#fffdf8] px-3 py-2 text-xs outline-none focus:border-[#c94708]" /></label>
						<label className="text-[10px] font-semibold text-[#3d291c]">Subject<input type="text" name="subject" required className="mt-1.5 w-full border border-[#ded5cd] bg-[#fffdf8] px-3 py-2 text-xs outline-none focus:border-[#c94708]" /></label>
						<label className="text-[10px] font-semibold text-[#3d291c]">Message<textarea name="message" rows={4} className="mt-1.5 w-full resize-y border border-[#ded5cd] bg-[#fffdf8] px-3 py-2 text-xs outline-none focus:border-[#c94708]" /></label>
					</div>
					<button type="submit" className="mt-4 w-full bg-[#c94708] px-5 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#9f3506]">Send message</button>
				</form>

				<div className="text-left">
					<h2 className="text-sm font-bold">Get in touch</h2>
					<p className="mt-3 text-xs leading-5 text-[#77716d]">Have questions about our products or services? Our team is here to help you with anything you need.</p>
					<div className="mt-5 grid gap-3">
						<div className="flex items-start gap-3 border border-[#ded5cd] bg-white p-3 shadow-[0_4px_12px_rgba(80,52,30,0.04)]"><MapPin className="mt-0.5 rounded-full bg-[#f3eee9] p-2 text-[#c94708]" size={34} /><div><h3 className="text-xs font-bold">Address</h3><p className="mt-1 text-[10px] leading-4 text-[#77716d]">Kamonyi, Rwanda</p></div></div>
						<div className="flex items-start gap-3 border border-[#ded5cd] bg-white p-3 shadow-[0_4px_12px_rgba(80,52,30,0.04)]"><Phone className="mt-0.5 rounded-full bg-[#f3eee9] p-2 text-[#c94708]" size={34} /><div><h3 className="text-xs font-bold">Phone</h3><a href="tel:+250788537463" className="mt-1 block text-[10px] text-[#77716d] hover:text-[#c94708]">+250 788 537 463</a></div></div>
						<div className="flex items-start gap-3 border border-[#ded5cd] bg-white p-3 shadow-[0_4px_12px_rgba(80,52,30,0.04)]"><Mail className="mt-0.5 rounded-full bg-[#f3eee9] p-2 text-[#c94708]" size={34} /><div><h3 className="text-xs font-bold">Email</h3><a href="mailto:exaltoltd@gmail.com" className="mt-1 block text-[10px] text-[#77716d] hover:text-[#c94708]">exaltoltd@gmail.com</a></div></div>
						<div className="flex items-start gap-3 border border-[#ded5cd] bg-white p-3 shadow-[0_4px_12px_rgba(80,52,30,0.04)]"><Clock3 className="mt-0.5 rounded-full bg-[#f3eee9] p-2 text-[#c94708]" size={34} /><div><h3 className="text-xs font-bold">Business hours</h3><p className="mt-1 text-[10px] text-[#77716d]">Mon - Sun: 8:00 AM - 9:00 PM</p></div></div>
					</div>
				</div>
			</section>

			<section className="border-t border-[#eee8e2] bg-white px-5 py-12 sm:py-16"><div className="mx-auto max-w-4xl"><div className="text-center"><h2 className="text-2xl font-bold">Frequently asked questions</h2><p className="mt-2 text-xs text-[#77716d]">Quick answers to common questions</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="border border-[#ded5cd] p-4 text-left"><h3 className="text-xs font-bold">What are your delivery times?</h3><p className="mt-2 text-xs leading-5 text-[#77716d]">Delivery in Kigali usually takes about one hour after placing your order.</p></div><div className="border border-[#ded5cd] p-4 text-left"><h3 className="text-xs font-bold">What if I don&apos;t like the product?</h3><p className="mt-2 text-xs leading-5 text-[#77716d]">Contact us within 24 hours and our team will help you find the best solution.</p></div><div className="border border-[#ded5cd] p-4 text-left"><h3 className="text-xs font-bold">Can I pay after receiving the product?</h3><p className="mt-2 text-xs leading-5 text-[#77716d]">Yes. We offer cash on delivery for customers in Kigali.</p></div><div className="border border-[#ded5cd] p-4 text-left"><h3 className="text-xs font-bold">Do you deliver outside Kigali?</h3><p className="mt-2 text-xs leading-5 text-[#77716d]">Yes, delivery options are available. Contact our support team for details.</p></div></div></div></section>
		</main>
	)
}

export default ContactPage
