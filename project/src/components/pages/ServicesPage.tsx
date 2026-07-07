import { Search, FileText, ArrowRight } from 'lucide-react';
import { popularServices, type PageId } from '../../data/mockData';
import { IconBadge } from '../ui/IconBadge';

interface ServicesPageProps {
  onNavigate: (page: PageId) => void;
  onComingSoon: (title: string, description: string) => void;
}

export function ServicesPage({ onComingSoon }: ServicesPageProps) {
  return (
    <div className="container-page py-12 lg:py-16">
      <PageHeader
        eyebrow="Government Services"
        title="Explore Government Services"
        description="Browse citizen services across identity, transport, records, and certificates. Each service includes a guided, plain-language walkthrough."
      />

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search 340+ services…"
            className="w-full rounded-xl border border-navy-200 bg-white pl-10 pr-4 py-3 text-sm text-navy-800 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400"
          />
        </div>
        <button onClick={() => onComingSoon('Service Filters', 'Category, ministry, and eligibility filters are coming soon.')} className="btn-secondary">
          <FileText className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {popularServices.map((service, i) => (
          <article
            key={service.id}
            className="card card-hover group p-5 animate-fade-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <IconBadge icon={service.icon} accent={service.accent} />
              <span className="chip bg-navy-50 text-navy-600">{service.category}</span>
            </div>
            <h3 className="mt-4 font-bold text-lg text-navy-900 group-hover:text-saffron-700 transition-colors">
              {service.name}
            </h3>
            <p className="mt-1.5 text-sm text-navy-500 leading-relaxed">{service.description}</p>
            <button
              onClick={() => onComingSoon(`${service.name} — Apply`, `The online application flow for ${service.name} will be available in a future release.`)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-saffron-600 transition-colors"
            >
              Start application <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="section-eyebrow">{eyebrow}</span>
      <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900">{title}</h1>
      <p className="mt-3 text-navy-600 leading-relaxed">{description}</p>
    </div>
  );
}
