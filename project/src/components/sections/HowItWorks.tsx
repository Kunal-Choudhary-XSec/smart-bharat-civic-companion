import { howItWorksSteps } from '../../data/mockData';

export function HowItWorks() {
  return (
    <section className="bg-white border-y border-navy-100">
      <div className="container-page py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="section-eyebrow">Simple by design</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900">
            How Smart Bharat Works
          </h2>
          <p className="mt-2 text-navy-600">
            Three steps from confusion to clarity — no paperwork maze, no jargon.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-saffron-200 via-navy-200 to-ashoka-200" />

          {howItWorksSteps.map((step, i) => (
            <div
              key={step.number}
              className="relative text-center animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative inline-flex">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-navy-50 to-white border border-navy-100 shadow-card">
                  <step.icon className="h-10 w-10 text-saffron-500" strokeWidth={1.8} />
                </div>
                <span className="absolute -top-2 -right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-white text-sm font-bold ring-4 ring-white">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy-900">{step.title}</h3>
              <p className="mt-2 text-sm text-navy-600 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
