import { Phone, Mail, MapPin, Shield, Heart } from 'lucide-react';
import { Logo } from './ui/Logo';
import { footerSections } from '../data/mockData';

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      {/* Emergency banner */}
      <div className="border-b border-navy-800/60 bg-gradient-to-r from-saffron-600/10 via-navy-900 to-ashoka-600/10">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-white">
            <Phone className="h-4 w-4 text-saffron-400" />
            24×7 Emergency & Citizen Support
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <span className="text-navy-300">Police <strong className="text-white">100</strong></span>
            <span className="text-navy-300">Ambulance <strong className="text-white">108</strong></span>
            <span className="text-navy-300">Fire <strong className="text-white">101</strong></span>
            <span className="text-navy-300">Women Helpline <strong className="text-white">1091</strong></span>
            <span className="text-navy-300">Citizen Helpline <strong className="text-white">14434</strong></span>
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo size="lg" variant="light" />
            <p className="mt-4 text-sm text-navy-300 leading-relaxed max-w-sm">
              Smart Bharat is an AI-powered civic companion that simplifies access to government
              services, welfare schemes, and grievance redressal for every citizen.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-navy-300">
                <Mail className="h-4 w-4 text-saffron-400" /> support@smartbharat.gov.in
              </p>
              <p className="flex items-center gap-2 text-navy-300">
                <MapPin className="h-4 w-4 text-saffron-400" /> New Delhi, India
              </p>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-saffron-400 mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="text-sm text-navy-300 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-400">
          <p className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Secure · Accessible · Made in India
          </p>
          <p>© {new Date().getFullYear()} Smart Bharat. A PromptWars civic-tech prototype.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 text-saffron-400" /> for citizens
          </p>
        </div>
      </div>
    </footer>
  );
}
