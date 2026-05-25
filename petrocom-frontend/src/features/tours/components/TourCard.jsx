// src/features/tours/components/TourCard.jsx
import { Link } from 'react-router-dom';
import { MapPin, Home } from 'lucide-react';
import { toPublicUrl } from '../../../shared/utils/api';

const TourCard = ({ tour }) => {
  const image =
    toPublicUrl(tour.hero_image || tour.featured_image || tour.images?.[0]?.path) ||
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511';

  return (
    <Link
      to={`/projects/${tour.id}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-[#dfe2ea]"
    >
      <div className="p-4 pb-0">
        {tour.is_featured && (
          <span className="inline-flex bg-[#1fb74d] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            Destacado
          </span>
        )}
      </div>
        
      <div className="relative overflow-hidden bg-white aspect-[4/3]">
        <img
          src={image}
          alt={tour.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-[#65647a]">
          <MapPin className="w-4 h-4 text-[#1fb74d]" />
          <span>{tour.city ? `${tour.city}${tour.state ? ', ' + tour.state : ''}` : 'Ubicación por confirmar'}</span>
        </div>

        <h3 className="text-xl font-bold text-[#07073b] leading-tight line-clamp-2">{tour.title}</h3>

        <div className="flex items-center gap-2 text-sm text-[#07073b]">
          <Home className="w-4 h-4 text-[#1fb74d]" />
          <span>{tour.type || 'Proyecto residencial'}</span>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
