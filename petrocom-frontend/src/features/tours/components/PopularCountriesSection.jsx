// src/features/tours/components/PopularCountriesSection.jsx

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Star } from 'lucide-react';
import viviendasImg from '../../../assets/images/servicios-principales/viviendas_unifamiliares_multifamiliares.png';
import casasCampoImg from '../../../assets/images/servicios-principales/casas_de_campo.png';
import interiores3dImg from '../../../assets/images/servicios-principales/diseno_interiores_3d.png';
import expedienteLicenciaImg from '../../../assets/images/servicios-principales/expediente_licencia_construccion.png';
import declaratoriaImg from '../../../assets/images/servicios-principales/declaratoria_de_fabrica.png';
import independizacionesImg from '../../../assets/images/servicios-principales/independizaciones.png';
import habilitacionesImg from '../../../assets/images/servicios-principales/habilitaciones_urbanas.png';
import subdivisionImg from '../../../assets/images/servicios-principales/subdivision_de_lote.png';
import acumulacionImg from '../../../assets/images/servicios-principales/acumulacion_de_lote.png';
import prescripcionImg from '../../../assets/images/servicios-principales/prescripcion_adquisitiva.png';
import visacionImg from '../../../assets/images/servicios-principales/visacion_de_planos.png';
import levantamientosImg from '../../../assets/images/servicios-principales/levantamientos_topograficos.png';
import licenciaFuncionamientoImg from '../../../assets/images/servicios-principales/licencia_de_funcionamiento.png';
import compraVentaImg from '../../../assets/images/servicios-principales/compra_venta_de_terrenos.png';
import expedientesTecnicosImg from '../../../assets/images/servicios-principales/expedientes_tecnicos.png';

const PopularCountriesSection = () => {
  const scrollRef = useRef(null);

  const countries = [
    { name: 'Viviendas unifamiliares y multifamiliares', subtitle: 'Diseño y proyectos residenciales de calidad', image: viviendasImg, projectsCount: 45, rating: 4.9 },
    { name: 'Casas de campo', subtitle: 'Proyectos arquitectonicos rurales y de descanso', image: casasCampoImg, projectsCount: 28, rating: 4.8 },
    { name: 'Diseño de interiores con vistas en 3D', subtitle: 'Visualizacion y planificacion de espacios interiores', image: interiores3dImg, projectsCount: 32, rating: 4.9 },
    { name: 'Expediente de licencia de construccion', subtitle: 'Tramitacion completa de permisos municipales', image: expedienteLicenciaImg, projectsCount: 60, rating: 4.8 },
    { name: 'Declaratoria de fabrica', subtitle: 'Legalizacion de construcciones existentes', image: declaratoriaImg, projectsCount: 22, rating: 4.7 },
    { name: 'Independizaciones', subtitle: 'Segregacion y documentacion de propiedades', image: independizacionesImg, projectsCount: 35, rating: 4.8 },
    { name: 'Habilitaciones urbanas', subtitle: 'Proyectos de urbanizacion y desarrollo territorial', image: habilitacionesImg, projectsCount: 18, rating: 4.7 },
    { name: 'Subdivision de lote', subtitle: 'Parcelacion y division de terrenos', image: subdivisionImg, projectsCount: 25, rating: 4.8 },
    { name: 'Acumulacion de lote', subtitle: 'Unificacion de terrenos para nuevos proyectos', image: acumulacionImg, projectsCount: 16, rating: 4.7 },
    { name: 'Prescripcion adquisitiva', subtitle: 'Gestion de derechos de propiedad por posesion', image: prescripcionImg, projectsCount: 14, rating: 4.8 },
    { name: 'Visacion de planos', subtitle: 'Revision tecnica y aprobacion de documentos', image: visacionImg, projectsCount: 40, rating: 4.9 },
    { name: 'Levantamientos topograficos', subtitle: 'Mediciones y mapeos de terrenos precisos', image: levantamientosImg, projectsCount: 38, rating: 4.8 },
    { name: 'Licencia de funcionamiento', subtitle: 'Permisos para operacion de establecimientos', image: licenciaFuncionamientoImg, projectsCount: 45, rating: 4.7 },
    { name: 'Compra-venta de terrenos', subtitle: 'Asesoria en transacciones inmobiliarias', image: compraVentaImg, projectsCount: 52, rating: 4.9 },
    { name: 'Expedientes tecnicos', subtitle: 'Documentacion completa para proyectos constructivos', image: expedientesTecnicosImg, projectsCount: 48, rating: 4.8 },
  ];

  const duplicatedCountries = [...countries, ...countries, ...countries];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.35;
    let animationFrame;

    const autoScroll = () => {
      scrollPosition += scrollSpeed;
      scrollContainer.scrollLeft = scrollPosition;

      if (scrollPosition >= scrollContainer.scrollWidth / 3) {
        scrollPosition = 0;
      }

      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="py-20 bg-[#f3f4f6] overflow-hidden">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-3 transition-transform duration-500 hover:translate-x-1">
            <Globe className="w-8 h-8 text-[#1fb74d] transition-transform duration-500 hover:scale-110 hover:rotate-6" />
            <h2 className="text-4xl lg:text-5xl font-black text-[#07073b]">
              Nuestros servicios principales
            </h2>
          </div>
          <Link
            to="/services#servicios-listado"
            className="hidden md:inline-flex items-center gap-2 text-[#1fb74d] font-semibold hover:text-[#e8a12f] transition-all duration-300 hover:translate-x-1"
          >
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">Explora nuestros servicios clave</span>
          </Link>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedCountries.map((country, index) => (
            <div
              key={`${country.name}-${index}`}
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <img
                  src={country.image}
                  alt={country.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                    <h3 className="text-white font-bold text-2xl">{country.name}</h3>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#f3f4f6]/90 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <p className="text-sm text-[#07073b] font-semibold">{country.subtitle}</p>
                  </div>
                  <Link
                    to="/services#servicios-listado"
                    state={{ prefill: country.name }}
                    className="w-full bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold py-3 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 text-center block"
                  >
                    Explorar servicios de este tipo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {countries.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-[#65647a] animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCountriesSection;
