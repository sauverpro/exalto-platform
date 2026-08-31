import sugarcaneJuice from "../assets/sugarcane juice.avif";

const AboutPage = () => {
	return (
		<main className="w-full bg-[#fffdf8] text-[#2a1f1a]">
			<section className="flex min-h-90 items-center justify-center bg-[#9b908e] px-5 pt-18 sm:min-h-112.5 sm:pt-24">
				<div className="text-center text-white">
					<h1 className="text-4xl font-bold sm:text-5xl">About</h1>
					<p className="mt-5 text-base sm:text-lg">Home&nbsp; / About</p>
				</div>
			</section>

			<section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12">
	{/* Image */}
<div className="overflow-hidden rounded-2xl bg-[#f1e6dc]">
  <img
    src={sugarcaneJuice}
    alt="Sugarcane and passion fruit juice"
    className="h-90 w-full object-cover sm:h-115"
  />
</div>

	{/* Content */}
	<div>
		<h2 className="text-4xl font-black leading-tight text-[#3d291c] sm:text-5xl">
			Our <span className="text-[#a9430d]">Story</span>
		</h2>

		{/* Decorative lines */}
		<div className="mt-6 flex gap-2">
			<span className="h-1.5 w-10 bg-[#a9430d]" />
			<span className="h-1.5 w-10 bg-[#a9430d]" />
		</div>

		<p className="mt-7 text-base leading-8 text-[#6d6b69] sm:text-lg">
			EXALTO ENGINEERING AND SUPPLY SOLUTIONS LTD was founded on a dual
			passion: a love for Rwanda&apos;s rich agricultural bounty and a
			drive for engineering excellence. We saw an opportunity to elevate
			two of our country&apos;s natural treasures, sugarcane and passion
			fruit, into premium beverages.
		</p>

		<p className="mt-5 text-base leading-8 text-[#6d6b69] sm:text-lg">
			By applying meticulous engineering principles to the art of beverage
			making, we developed a unique process that captures the authentic
			taste and vitality of our ingredients. From our base in Rwanda, we
			are not just a company, but a team of innovators dedicated to
			quality, sustainability, and the growth of Rwanda&apos;s
			agro-processing industry.
		</p>
	</div>
</section>

			<section className="bg-[#f3efe9] px-5 py-16 sm:px-8 sm:py-20">
	<div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
		{/* Our Vision */}
		<article className="bg-[#fffdf8] p-7 sm:p-9">
			<h3 className="text-2xl font-bold text-[#151515]">
				Our Vision
			</h3>

			<p className="mt-4 leading-7 text-[#6d6b69]">
				To be a globally recognized leader in the creation of
				innovative, natural beverages, showcasing the quality and
				potential of Rwandan-sourced ingredients.
			</p>
		</article>

		{/* Our Mission */}
		<article className="bg-[#fffdf8] p-7 sm:p-9">
			<h3 className="text-2xl font-bold text-[#151515]">
				Our Mission
			</h3>

			<p className="mt-4 leading-7 text-[#6d6b69]">
				To produce and supply superior natural wines and juices using
				innovative, sustainable manufacturing processes, while creating
				value for our local farming partners and delivering refreshing,
				healthy products to our customers worldwide.
			</p>
		</article>

		
	</div>
</section>
		</main>
	)
}

export default AboutPage
