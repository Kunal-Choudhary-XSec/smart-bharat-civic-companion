import { ArrowRight, TrendingUp } from 'lucide-react';
import { popularServices, type PageId } from '../../data/mockData';
import { IconBadge } from '../ui/IconBadge';

interface PopularServicesProps {
  onNavigate: (page: PageId) => void;
}

export function PopularServices({ onNavigate }: PopularServicesProps) {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="section-eyebrow">Most Used</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900">
            Popular Government Services
          </h2>
          <p className="mt-2 text-navy-600 max-w-2xl">
            The services citizens reach for most — with clear steps and document guidance.
          </p>
        </div>
        <button
          onClick={() => onNavigate('services')}
          className="btn-secondary self-start sm:self-auto"
        >
          View all services <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {popularServices.map((service, i) => (
          <article
            key={service.id}
            className="card card-hover group p-5 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <IconBadge icon={service.icon} accent={service.accent} />
              <span className="chip bg-navy-50 text-navy-600">
                <TrendingUp className="h-3 w-3" /> {service.popularity}% match
              </span>
            </div>
            <h3 className="mt-4 font-bold text-lg text-navy-900 group-hover:text-saffron-700 transition-colors">
              {service.name}
            </h3>
            <p className="text-xs font-medium text-saffron-600 uppercase tracking-wide mt-0.5">
              {service.category}
            </p>
            <p className="mt-2 text-sm text-navy-500 leading-relaxed">{service.description}</p>
            <button
              onClick={() => onNavigate('services')}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-saffron-600 transition-colors"
            >
              Apply / Learn more
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
