// src/features/tours/components/PopularLocationsSection.jsx

import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const activityAreas = [
  {
    name: 'Huancayo y Junin',
    subtitle: 'Base de atencion para expedientes tecnicos y gestiones documentales.',
    image: 'https://images.unsplash.com/photo-1727483892297-56448c8f1af1?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Estaciones y grifos',
    subtitle: 'Documentacion para combustibles liquidos, tanques, islas y zonas de descarga.',
    image: 'https://images.unsplash.com/photo-1727483892297-56448c8f1af1?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'GLP y consumidores directos',
    subtitle: 'Soporte para almacenamiento, despacho, venta y consumo propio.',
    image: 'https://images.unsplash.com/photo-1768637656191-133fe8f95786?auto=format&fit=crop&w=900&q=80',
  },
];

const PopularLocationsSection = () => {
  return (
    <section className="py-20 bg-[#F4F5F6]">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-12 animate-fade-in">
          <TrendingUp className="w-8 h-8 text-[#238A55]" />
          <h2 className="text-4xl lg:text-5xl font-black text-[#07073b]">
            Actividades que atendemos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activityAreas.map((location, index) => (
            <Link
              key={index}
              to={`/projects?search=${encodeURIComponent(location.name)}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img src={location.image} alt={location.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#07073b] mb-2 group-hover:text-[#238A55] transition-colors">
                  {location.name}
                </h3>
                <p className="text-[#5F6B76] mb-3">{location.subtitle}</p>
                <div className="flex items-center justify-start">
                  <div className="flex items-center gap-1 text-[#238A55] opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Ver categorias</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/projects" className="inline-flex items-center gap-2 bg-[#238A55] hover:bg-[#196B43] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            Ver todas las categorias
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularLocationsSection;
