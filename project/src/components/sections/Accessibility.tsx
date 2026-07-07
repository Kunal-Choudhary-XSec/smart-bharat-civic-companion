import { accessibilityFeatures } from '../../data/mockData';

export function Accessibility() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-900 to-navy-950 overflow-hidden relative">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-saffron-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-ashoka-500/15 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-12 p-8 sm:p-10 lg:p-14">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-saffron-300">
              Built for every Indian
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Accessible to all.
              <br />
              <span className="text-saffron-400">Inclusive by default.</span>
            </h2>
            <p className="mt-4 text-navy-200 leading-relaxed max-w-md">
              Smart Bharat is designed so that geography, language, or ability never stand between
              a citizen and the services they need.
            </p>
          </div>

          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {accessibilityFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-saffron-500/20 text-saffron-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-bold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-navy-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
