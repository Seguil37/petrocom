// src/features/tours/components/PopularCountriesSection.jsx

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Star } from 'lucide-react';

const GAS_STATION_IMAGE = 'https://images.unsplash.com/photo-1727483892297-56448c8f1af1?auto=format&fit=crop&w=900&q=80';
const TANKER_IMAGE = 'https://images.unsplash.com/photo-1768637656191-133fe8f95786?auto=format&fit=crop&w=900&q=80';

const PopularCountriesSection = () => {
  const scrollRef = useRef(null);

  const categories = [
    { name: 'Informe Tecnico Favorable - ITF', subtitle: 'Instalacion, modificacion o ampliacion de infraestructura de hidrocarburos', image: GAS_STATION_IMAGE },
    { name: 'Registro de Hidrocarburos', subtitle: 'Inscripcion, modificacion y actualizacion ante OSINERGMIN', image: GAS_STATION_IMAGE },
    { name: 'Grifos y estaciones de servicio', subtitle: 'Expedientes para combustibles liquidos, tanques, islas y zonas de descarga', image: GAS_STATION_IMAGE },
    { name: 'Gasocentros y GLP', subtitle: 'Soporte tecnico para GLP, almacenamiento, despacho y venta', image: GAS_STATION_IMAGE },
    { name: 'Consumidores directos', subtitle: 'Documentacion para almacenamiento y consumo propio de combustibles', image: TANKER_IMAGE },
    { name: 'Transporte de combustibles', subtitle: 'Planes, matrices y requisitos para unidades de transporte terrestre', image: TANKER_IMAGE },
    { name: 'Planes de contingencia', subtitle: 'Riesgos, emergencia, senalizacion y procedimientos operativos', image: TANKER_IMAGE },
    { name: 'Levantamiento de observaciones', subtitle: 'Descargos tecnicos, subsanaciones y planos corregidos', image: GAS_STATION_IMAGE },
  ];

  const duplicatedCategories = [...categories, ...categories, ...categories];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.35;
    let animationFrame;

    const autoScroll = () => {
      scrollPosition += scrollSpeed;
      scrollContainer.scrollLeft = scrollPosition;

      if (scrollPosition >= scrollContainer.scrollWidth / 3) scrollPosition = 0;
      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="py-20 bg-[#F4F5F6] overflow-hidden">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-3 transition-transform duration-500 hover:translate-x-1">
            <Globe className="w-8 h-8 text-[#238A55] transition-transform duration-500 hover:scale-110 hover:rotate-6" />
            <h2 className="text-4xl lg:text-5xl font-black text-[#07073b]">
              Soluciones para hidrocarburos
            </h2>
          </div>
          <Link
            to="/services#servicios-listado"
            className="hidden md:inline-flex items-center gap-2 text-[#238A55] font-semibold hover:text-[#C58A2A] transition-all duration-300 hover:translate-x-1"
          >
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">Explora servicios clave</span>
          </Link>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-hidden scrollbar-hide" style={{ scrollBehavior: 'auto' }}>
          {duplicatedCategories.map((category, index) => (
            <div key={`${category.name}-${index}`} className="flex-shrink-0 w-80 group cursor-pointer">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-[#07073b]/35 to-transparent" />
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                    <h3 className="text-white font-bold text-2xl leading-tight">{category.name}</h3>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#F4F5F6]/90 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <p className="text-sm text-[#07073b] font-semibold">{category.subtitle}</p>
                  </div>
                  <Link
                    to="/services#servicios-listado"
                    state={{ prefill: category.name }}
                    className="w-full bg-[#238A55] hover:bg-[#196B43] text-white font-bold py-3 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 text-center block"
                  >
                    Consultar servicio
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {categories.map((_, index) => (
            <div key={index} className="w-2 h-2 rounded-full bg-[#5F6B76] animate-pulse" style={{ animationDelay: `${index * 0.2}s` }} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCountriesSection;
