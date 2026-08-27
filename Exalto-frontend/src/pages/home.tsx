import { ChevronRight } from 'lucide-react'

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <section
          className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden bg-[#252525] bg-cover bg-center sm:min-h-[calc(100svh-96px)]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(20, 20, 20, 0.86) 0%, rgba(20, 20, 20, 0.66) 46%, rgba(20, 20, 20, 0.42) 100%), url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2200&q=85')",
          }}
        >
          <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 py-20 sm:px-12 lg:px-16 lg:py-28">
            <h1 className="max-w-[520px] text-left text-5xl font-black uppercase leading-[0.95] tracking-[0.02em] text-white sm:text-7xl lg:text-9xl">
              Exalto
            </h1>
            <a
              href="/shop"
              className="mt-10 inline-flex h-14 min-w-[200px] items-center justify-center gap-3 rounded-full bg-[#c94f0d] px-6 text-base font-bold text-white transition-colors hover:bg-[#a83d08] sm:mt-16 sm:h-16 sm:min-w-[250px] sm:px-8 sm:text-lg"
            >
              SHOP NOW <ChevronRight size={24} className="sm:h-[28px] sm:w-[28px]" />
            </a>
          </div>
        </section>

        <section className="bg-[#fffdf8] px-5 py-12 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1480px] items-center gap-10 lg:grid-cols-[minmax(360px,0.9fr)_minmax(480px,1.1fr)] lg:gap-20">
            <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#fff5b5] shadow-[0_24px_70px_rgba(205,103,22,0.14)] sm:max-w-[500px] lg:max-w-[560px]">
              <div className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-[#ffc400] blur-[2px]" />
              <div className="absolute -right-12 bottom-8 h-72 w-72 rounded-full bg-[#f7a313] opacity-80 blur-2xl" />
              <div className="absolute bottom-10 h-12 w-72 rounded-[50%] bg-[#e4a50c]/40 blur-xl" />
              <div className="relative z-10 flex h-[72%] w-32 flex-col items-center rounded-[2rem] bg-gradient-to-r from-[#a83a16] via-[#e47632] to-[#8b2c12] shadow-[8px_20px_20px_rgba(106,44,10,0.25)] sm:w-40">
                <div className="-mt-10 h-14 w-16 rounded-t-xl bg-white shadow-md sm:w-20" />
                <div className="mt-2 h-16 w-full rounded-t-[1.5rem] border-b-4 border-[#f6aa58]/70 bg-[#ba5426]/80" />
                <div className="mt-4 flex h-32 w-[86%] flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#a8e2ad] to-[#e5f28a] text-center text-[#73366b] shadow-inner sm:h-40">
                  <span className="text-xs font-black tracking-[0.2em] text-[#ffffff]">LA VIE</span>
                  <span className="mt-1 font-serif text-xl italic leading-none sm:text-2xl">Passion</span>
                  <span className="font-serif text-xl italic leading-none sm:text-2xl">Juice</span>
                </div>
              </div>
              <span className="absolute bottom-20 left-8 z-20 -rotate-12 font-serif text-3xl font-bold italic text-[#7c2d69] sm:left-12 sm:text-5xl">
                Passion
                <br />
                Juice
              </span>
            </div>

            <div className="max-w-3xl lg:pb-4">
              <p className="text-center text-lg font-medium text-[#be4b1b] sm:text-xl lg:text-left">Welcome to Exalto Ltd</p>
              <h1 className="mt-6 max-w-3xl text-center text-4xl font-black leading-[1.08] tracking-tight text-[#29150e] sm:text-5xl lg:text-left lg:text-7xl">
                All in one <span className="text-[#bd4212]">to make a</span> different structure
              </h1>
              <div className="mt-8 flex justify-center gap-3 lg:justify-start">
                <span className="h-2 w-10 bg-[#c54b16]" />
                <span className="h-2 w-10 bg-[#c54b16]" />
              </div>
              <p className="mt-8 text-center text-base leading-7 text-[#6d6b69] sm:text-lg sm:leading-8 lg:text-left">
                “At Exalto, we transform Rwanda’s finest sugarcane and passion fruit into exceptional natural wines and juices. By merging advanced engineering with time-honored traditions, we create beverages that are as pure and vibrant as their source. Experience a refreshing taste of innovation and nature, crafted for both local enjoyment and global appreciation.”
              </p>
              <a href="/contact" className="mx-auto mt-10 inline-flex h-14 items-center justify-center gap-3 bg-[#c44b16] px-6 text-sm font-bold text-white transition-colors hover:bg-[#9e3710] sm:h-16 sm:px-8 sm:text-base lg:mx-0">
                BECOME A DISTRIBUTOR <ChevronRight size={22} />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[#f3efe9] px-5 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-18">
          <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-3">
            <div className="rounded-[18px] bg-[#f0e8e1] p-6 sm:p-8">
              <div className="mx-auto mb-8 flex h-56 w-56 items-center justify-center rounded-full bg-[#f6efe9]">
                <div className="relative flex h-28 w-20 items-end justify-center rounded-[16px_16px_10px_10px] bg-gradient-to-b from-[#0a2109] via-[#102f13] to-[#091d0d] shadow-[0_22px_28px_rgba(0,0,0,0.18)]">
                  <div className="absolute -top-7 left-1/2 h-8 w-4 -translate-x-1/2 rounded-t-[1.2rem] border-b-[8px] border-[#f0efee] bg-[#2a2a2a]" />
                  <div className="absolute inset-x-[18%] top-6 h-10 rounded-[10px] border border-[#d8b36a]/40 bg-[#f2f7ef]/10" />
                </div>
              </div>
              <h2 className="text-center text-4xl font-black leading-tight text-[#1b1b1b] sm:text-5xl">Naturally Sourced</h2>
              <p className="mt-6 text-center text-lg leading-8 text-[#514d49] sm:text-[1.15rem]">
                We use 100% locally grown sugarcane and passion fruit, supporting Rwandan farmers.
              </p>
            </div>

            <div className="rounded-[18px] bg-[#f0e8e1] p-6 sm:p-8">
              <div className="mx-auto mb-8 flex h-56 w-56 items-center justify-center rounded-full bg-[#f6efe9]">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#f2f5f2] shadow-[0_18px_24px_rgba(0,0,0,0.08)]">
                  <div className="absolute inset-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f2d090_0%,#f7d66c_18%,#d38d23_42%,#a44a20_58%,#7a2416_100%)] opacity-90" />
                  <div className="absolute inset-x-5 bottom-5 h-8 rounded-full bg-[#f0e9d7] opacity-70 blur-sm" />
                  <div className="absolute left-5 top-5 h-7 w-7 rounded-full bg-[#d46f39] opacity-90" />
                  <div className="absolute right-5 top-5 h-7 w-7 rounded-full bg-[#d46f39] opacity-90" />
                  <div className="absolute bottom-8 left-10 h-8 w-8 rounded-full bg-[#d66e2a] opacity-90" />
                  <div className="absolute bottom-8 right-10 h-8 w-8 rounded-full bg-[#d66e2a] opacity-90" />
                </div>
              </div>
              <h2 className="text-center text-4xl font-black leading-tight text-[#1b1b1b] sm:text-5xl">Engineered for Purity</h2>
              <p className="mt-6 text-center text-lg leading-8 text-[#514d49] sm:text-[1.15rem]">
                Our modern processing techniques ensure every bottle retains its natural flavour and health benefits.
              </p>
            </div>

            <div className="rounded-[18px] bg-[#f0e8e1] p-6 sm:p-8">
              <div className="mx-auto mb-8 flex h-56 w-56 items-center justify-center rounded-full bg-[#f6efe9]">
                <div className="relative flex h-28 w-20 items-end justify-center rounded-[16px_16px_10px_10px] bg-gradient-to-b from-[#120b12] via-[#472a1d] to-[#140903] shadow-[0_22px_28px_rgba(0,0,0,0.18)]">
                  <div className="absolute -top-7 left-1/2 h-8 w-4 -translate-x-1/2 rounded-t-[1.2rem] border-b-[8px] border-[#f0efee] bg-[#2a2a2a]" />
                  <div className="absolute bottom-8 left-1/2 h-6 w-14 -translate-x-1/2 rounded-full bg-[#f5d8a7] opacity-90" />
                  <div className="absolute bottom-3 left-1/2 h-8 w-10 -translate-x-1/2 rounded-[12px] bg-[#f0d6a0] opacity-90" />
                </div>
              </div>
              <h2 className="text-center text-4xl font-black leading-tight text-[#1b1b1b] sm:text-5xl">Local &amp; Global Reach</h2>
              <p className="mt-6 text-center text-lg leading-8 text-[#514d49] sm:text-[1.15rem]">
                Text: Proudly serving our community in Rwanda and sharing our craft with the world.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f3efe9] px-5 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-[1200px] text-center">
            <h2 className="text-4xl font-black tracking-tight text-[#1a130f] sm:text-5xl lg:text-6xl">
              100% <span className="text-[#c94f0d]">Fresh Product</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#5c5854] sm:text-lg">
              Experience the pure, vibrant flavours of Rwanda in every sip. Our beverages are all-natural, with no artificial additives.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <article className="overflow-hidden rounded-[18px] border border-[#eadfce] bg-[#f6f1ed] shadow-[0_14px_35px_rgba(80,52,30,0.06)]">
                <div className="flex h-[360px] items-center justify-center bg-[#f7f2ee] p-6">
                  <img
                    src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80"
                    alt="Sugarcane wine"
                    className="h-full w-full rounded-[12px] object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-4 text-[#1d1d1d] sm:px-6">
                  <span className="text-base font-medium sm:text-lg">Vicas sugarcane wine</span>
                  <span className="text-base font-semibold text-[#1d1d1d] sm:text-lg">Fr 12.000</span>
                </div>
              </article>

              <article className="overflow-hidden rounded-[18px] border border-[#eadfce] bg-[#f6f1ed] shadow-[0_14px_35px_rgba(80,52,30,0.06)]">
                <div className="flex h-[360px] items-center justify-center bg-[#f7f2ee] p-6">
                  <img
                    src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80"
                    alt="Passion juice"
                    className="h-full w-full rounded-[12px] object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-4 text-[#1d1d1d] sm:px-6">
                  <span className="text-base font-medium sm:text-lg">La vie Passion juice</span>
                  <span className="text-base font-semibold text-[#1d1d1d] sm:text-lg">Fr 9.000</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#f3efe9] px-5 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-[1300px]">
            <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="relative w-full max-w-[680px] overflow-hidden rounded-[18px] border border-[#e7d6c3] bg-[#f8f5f2] p-3 shadow-[0_10px_30px_rgba(110,66,20,0.08)] sm:p-5 lg:p-6">
                <div className="absolute left-0 right-0 top-6 h-[3px] bg-[#c95d1d] opacity-90" />

                <div className="relative mt-8 flex items-end justify-center gap-3 sm:gap-6 lg:gap-8">
                  <img
                    src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80"
                    alt="Exalto wine bottles"
                    className="h-[220px] w-[150px] object-cover object-center sm:h-[280px] sm:w-[200px] lg:h-[380px] lg:w-[260px]"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80"
                    alt="Exalto passion fruit juice bottle"
                    className="h-[220px] w-[150px] object-cover object-center sm:h-[280px] sm:w-[200px] lg:h-[380px] lg:w-[260px]"
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#c95d1d] opacity-90" />
              </div>

              <div className="max-w-[520px] text-center lg:text-left">
                <p className="text-base font-medium italic text-[#c84e17] sm:text-lg lg:text-xl">Limited Offer For Customer</p>
                <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.04em] text-[#1f1a17] sm:text-4xl lg:text-6xl">
                  Exalto Pure Passion
                  <span className="mt-2 block text-[#c84e17]">Fruit Juice</span>
                  <span className="mt-2 block font-black text-[#1f1a17]">La vie passion juice.</span>
                </h2>

                <div className="mx-auto my-6 h-[2px] w-20 bg-[#b7662d] lg:mx-0 lg:w-24" />

                <p className="text-sm leading-7 text-[#534d49] sm:text-base lg:text-lg lg:leading-8">
                  A burst of tropical sunshine in a bottle. Tangy, aromatic, and intensely
                  flavourful. Cold-pressed from ripe, locally sourced passion fruits to preserve
                  nutrients and taste. A healthy, refreshing beverage rich in vitamins and
                  antioxidants.
                </p>

                <a href="/shop" className="mt-8 inline-flex items-center justify-center gap-3 rounded-md bg-[#c84e17] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_20px_rgba(200,78,23,0.28)] transition-transform hover:-translate-y-0.5 hover:bg-[#a83e12] sm:px-8 sm:py-4 sm:text-base">
                  Shop Now <ChevronRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}

export default HomePage
