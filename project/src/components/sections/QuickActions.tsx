import { ArrowRight } from 'lucide-react';
import { quickActions, type PageId } from '../../data/mockData';
import { IconBadge } from '../ui/IconBadge';

interface QuickActionsProps {
  onNavigate: (page: PageId) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <section className="container-page -mt-8 relative z-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action, i) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.page)}
            className="card card-hover group p-5 text-left animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-4">
              <IconBadge icon={action.icon} accent={action.accent} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-navy-900 group-hover:text-saffron-700 transition-colors">
                    {action.title}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-navy-300 group-hover:text-saffron-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="mt-1 text-sm text-navy-500 leading-relaxed">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
