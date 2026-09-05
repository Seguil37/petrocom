// src/features/tours/components/TourCard.jsx
import { Link } from 'react-router-dom';
import { MapPin, Home } from 'lucide-react';
import { toPublicUrl } from '../../../shared/utils/api';

const TourCard = ({ tour }) => {
  const image = tour.localImage || toPublicUrl(tour.hero_image || tour.featured_image || tour.images?.[0]?.path);
  const destination = tour.localImage ? '/projects' : `/projects/${tour.id}`;

  return (
    <Link
      to={destination}
      className="group block min-w-0 overflow-hidden rounded-lg border border-[#D7DCE1] bg-white shadow-[0_14px_36px_rgba(7,7,59,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(7,7,59,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#238A55] focus-visible:ring-offset-4"
      data-motion-card
    >
      <div className="flex min-h-12 items-center justify-between border-b border-[#E1E5E8] px-4 py-3">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#238A55]">
          Proyecto tecnico
        </span>
        {tour.is_featured && (
          <span className="inline-flex bg-[#C58A2A] px-2.5 py-1 text-[10px] font-black uppercase text-white">
            Destacado
          </span>
        )}
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {image ? (
          <img
            src={image}
            alt={tour.title}
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.025]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#f8f5ef] px-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#5F6B76]">
            Sin imagen
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-[#E1E5E8] p-5">
        <div className="flex items-center gap-2 text-sm text-[#5F6B76]">
          <MapPin className="w-4 h-4 text-[#238A55]" />
          <span>{tour.city ? `${tour.city}${tour.state ? ', ' + tour.state : ''}` : 'Ubicacion por confirmar'}</span>
        </div>

        <h3 className="line-clamp-2 min-h-14 text-xl font-black leading-tight text-[#07073b] transition-colors group-hover:text-[#238A55]">{tour.title}</h3>

        <div className="flex items-center gap-2 text-sm text-[#07073b]">
          <Home className="w-4 h-4 text-[#238A55]" />
          <span>{tour.type || 'Proyecto de hidrocarburos'}</span>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
