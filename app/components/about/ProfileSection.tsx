import React from "react";

export default function ProfileSection() {
  return (
    <section className="w-full md:w-[40%] h-screen sticky top-0 flex flex-col items-center justify-center p-8 lg:p-16">
      <div className="w-full max-w-md">
        {/* Signature Branding */}
        <div className="mb-12">
          <h1 className="text-5xl text-primary mb-2 font-bold font-display">
            Alex Sterling
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent"></div>
        </div>
        {/* Profile Frame */}
        <div className="glass-panel p-3 rounded-xl relative group">
          <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          <div className="relative bg-background-dark rounded-lg overflow-hidden aspect-[4/5] border border-white/10">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9WgTlBdSmiEh4MyIcn6mM2PQJTaI8nX6agLr9HRR39kCZ2QwPjllwPwtqA62QAMuImdyKwfwPYYcUjV1M05yasT4EUhGeyDfN3lyX0wwokz-pbfxgioTLYRHaKGrYSWJRriXMB8fxuStJTN9MHMeYMU8JpRuqaPXNIopoP_OYoqVg9Cpt3Sm1FStZf8Bz7ID6QM0JnOUv_9K1MpW-IskY7dDNLiy0JGz1Zc1Kn9fELnoUtiNUC9RVT-UIRjUj1Mej2iz47lAlcKSO")',
              }}
              title="Professional portrait of a male developer in a dark studio setting"
            ></div>
          </div>
        </div>
        <div className="mt-8 space-y-2">
          <p className="font-display text-2xl font-bold tracking-tight text-white">
            Senior Fullstack Developer
          </p>
          <p className="text-slate-400 font-light flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">
              location_on
            </span>
            Based in San Francisco, CA
          </p>
        </div>
      </div>
    </section>
  );
}
