import { MapPin, Briefcase, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function daysSince(dateStr) {
  const diff = (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
  if (diff < 1) return "Aujourd'hui";
  if (diff < 2) return 'Hier';
  return `Il y a ${Math.floor(diff)} jours`;
}

export default function JobCard({ job }) {
  return (
    <Link
      to={`/candidature?poste=${encodeURIComponent(job.title)}&enseigne=${encodeURIComponent(job.storeName)}&mall=${encodeURIComponent(job.mallName)}`}
      className="group flex flex-col bg-white border border-[#E5DDD0] hover:border-[#C9A96E] hover:shadow-[0_4px_24px_rgba(201,169,110,0.12)] transition-all duration-300"
    >
      {/* Gold top accent line — revealed on hover */}
      <div className="h-[2px] w-0 group-hover:w-full bg-[#C9A96E] transition-all duration-300" />

      <div className="p-6 flex-1 flex flex-col">
        {/* Brand + badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.15em] text-[#C9A96E]">
            {job.storeName}
          </span>
          <div className="flex items-center gap-2">
            {job.isNew && (
              <span className="px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider bg-[#C9A96E] text-white">
                Nouveau
              </span>
            )}
            <span className={`text-[0.6rem] font-medium uppercase tracking-wider px-2 py-0.5 border ${
              job.contract === 'cdi'
                ? 'border-[#1C1C1C]/20 text-[#1C1C1C]/60'
                : job.contract === 'cdd'
                ? 'border-[#C9A96E]/40 text-[#A8813F]'
                : 'border-[#C9A96E] text-[#C9A96E]'
            }`}>
              {job.contractLabel}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-light leading-snug text-[#1C1C1C] group-hover:text-[#A8813F] transition-colors mb-3"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#6B6560] leading-relaxed line-clamp-2 mb-5 flex-1 font-light">
          {job.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#6B6560]/80 font-light">
          <span className="flex items-center gap-1.5">
            <MapPin size={11} className="text-[#C9A96E] shrink-0" />
            {job.mallName}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase size={11} className="text-[#C9A96E] shrink-0" />
            {job.city}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="text-[#C9A96E] shrink-0" />
            {daysSince(job.posted)}
          </span>
        </div>
      </div>

      {/* CTA footer */}
      <div className="px-6 py-3.5 border-t border-[#E5DDD0] flex items-center justify-between">
        <span className="text-[0.65rem] uppercase tracking-[0.12em] font-medium text-[#6B6560] group-hover:text-[#C9A96E] transition-colors">
          Postuler
        </span>
        <span className="text-[#C9A96E] text-sm group-hover:translate-x-1 transition-transform inline-block">→</span>
      </div>
    </Link>
  );
}
