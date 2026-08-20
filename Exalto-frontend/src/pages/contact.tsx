import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
	return (
		<main className="w-full bg-[#fffdf8] text-[#2a1f1a]">
			<section className="flex min-h-90 items-center justify-center bg-[#9b908e] px-5 pt-18 sm:min-h-112.5 sm:pt-24">
				<div className="text-center text-white">
					<h1 className="text-4xl font-bold sm:text-5xl">Contact</h1>
					<p className="mt-5 text-base sm:text-lg">Home&nbsp; / Contact</p>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
				<div className="grid gap-4 sm:grid-cols-3">
					<div className="flex min-h-36 flex-col items-center justify-center border border-[#eee8e2] bg-white px-4 py-6 text-center shadow-[0_5px_18px_rgba(80,52,30,0.06)]">
						<MapPin className="text-[#c94708]" size={25} />
						<h3 className="mt-4 text-sm font-bold">Address</h3>
						<p className="mt-2 text-xs text-[#77716d]">Kamonyi, Rwanda</p>
					</div>
					<div className="flex min-h-36 flex-col items-center justify-center border border-[#eee8e2] bg-white px-4 py-6 text-center shadow-[0_5px_18px_rgba(80,52,30,0.06)]">
						<Mail className="text-[#c94708]" size={25} />
						<h3 className="mt-4 text-sm font-bold">Email Us</h3>
						<a href="mailto:exaltoltd@gmail.com" className="mt-2 text-xs text-[#77716d] hover:text-[#c94708]">exaltoltd@gmail.com</a>
					</div>
					<div className="flex min-h-36 flex-col items-center justify-center border border-[#eee8e2] bg-white px-4 py-6 text-center shadow-[0_5px_18px_rgba(80,52,30,0.06)]">
						<Phone className="text-[#c94708]" size={25} />
						<h3 className="mt-4 text-sm font-bold">Call Now</h3>
						<a href="tel:+250788537463" className="mt-2 text-xs text-[#77716d] hover:text-[#c94708]">+250 788 537 463</a>
					</div>
				</div>

				<div className="mx-auto mt-8 max-w-2xl text-center">
					<h2 className="text-2xl font-bold text-[#3d291c]">Let&apos;s Connect</h2>
					<p className="mt-3 text-xs leading-6 text-[#77716d] sm:text-sm">
						Whether you are a customer, a potential business partner, or simply curious about our products, we would love to hear from you.
					</p>
				</div>

				<form className="mx-auto mt-10 max-w-2xl border border-[#eee8e2] bg-white p-6 shadow-[0_5px_18px_rgba(80,52,30,0.06)] sm:p-8">
					<div className="grid gap-5">
						<label className="text-xs text-[#3d291c]">
							Your name
							<input type="text" name="name" required className="mt-2 w-full border border-[#ded5cd] bg-[#fffdf8] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#c94708]" />
						</label>
						<label className="text-xs text-[#3d291c]">
							Your email
							<input type="email" name="email" required className="mt-2 w-full border border-[#ded5cd] bg-[#fffdf8] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#c94708]" />
						</label>
						<label className="text-xs text-[#3d291c]">
							Subject
							<input type="text" name="subject" required className="mt-2 w-full border border-[#ded5cd] bg-[#fffdf8] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#c94708]" />
						</label>
						<label className="text-xs text-[#3d291c]">
							Your message (optional)
							<textarea name="message" rows={5} className="mt-2 w-full resize-y border border-[#ded5cd] bg-[#fffdf8] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#c94708]" />
						</label>
					</div>
					<button type="submit" className="mt-5 w-full border border-[#ded5cd] bg-white px-5 py-2.5 text-xs font-semibold text-[#3d291c] transition-colors hover:border-[#c94708] hover:text-[#c94708]">Submit</button>
				</form>

				<div className="mx-auto mt-12 max-w-2xl overflow-hidden border border-[#eee8e2] bg-white shadow-[0_5px_18px_rgba(80,52,30,0.06)]">
					<iframe
						title="Map showing Exalto in Kamonyi, Rwanda"
						 src="https://www.google.com/maps?q=Kamonyi%2C%20Rwanda&output=embed"
						 className="h-64 w-full border-0 sm:h-80"
						 loading="lazy"
						 referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</section>
		</main>
	)
}

export default ContactPage
