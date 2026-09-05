import { Link } from 'react-router-dom';
import { ArrowRight, Fuel, MapPinned } from 'lucide-react';
import MotionTitle from '../../../shared/motion/MotionTitle';

import huancayoJuninImage from '../../../assets/images/servicios-principales/huancayo_junin.png';
import grifosEstacionesImage from '../../../assets/images/servicios-principales/grifos_estaciones_servicio.png';
import gasocentrosGlpImage from '../../../assets/images/servicios-principales/gasocentros_glp.png';

const activityAreas = [
  {
    name: 'Huancayo y Junin',
    eyebrow: 'Cobertura regional',
    subtitle: 'Base de atencion para expedientes tecnicos y gestiones documentales.',
    image: huancayoJuninImage,
    icon: MapPinned,
  },
  {
    name: 'Estaciones y grifos',
    eyebrow: 'Combustibles liquidos',
    subtitle: 'Documentacion para tanques, islas, zonas de descarga y operacion.',
    image: grifosEstacionesImage,
    icon: Fuel,
  },
  {
    name: 'GLP y consumidores directos',
    eyebrow: 'Instalaciones especializadas',
    subtitle: 'Soporte para almacenamiento, despacho, venta y consumo propio.',
    image: gasocentrosGlpImage,
    icon: Fuel,
  },
];

const PopularLocationsSection = () => (
  <section className="bg-[#F4F5F6] py-20 lg:py-28">
    <div className="container-custom">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-[#238A55]">
            Alcance operativo
          </p>
          <MotionTitle className="text-3xl font-black leading-tight text-[#07073b] sm:text-4xl lg:text-5xl">
            Actividades que atendemos
          </MotionTitle>
        </div>
        <Link
          to="/projects"
          className="inline-flex min-h-11 items-center gap-2 self-start border-b-2 border-[#238A55] pb-2 text-sm font-extrabold text-[#07073b] transition-colors hover:text-[#238A55] md:self-auto"
        >
          Ver todas las categorias
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activityAreas.map((area) => {
          const Icon = area.icon;
          return (
            <Link
              key={area.name}
              to={`/projects?search=${encodeURIComponent(area.name)}`}
              className="group overflow-hidden rounded-lg border border-[#D7DCE1] bg-white shadow-[0_14px_36px_rgba(7,7,59,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(7,7,59,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#238A55] focus-visible:ring-offset-4"
              data-motion-card
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <img
                  src={area.image}
                  alt={area.name}
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.025]"
                  loading="lazy"
                />
              </div>
              <div className="border-t border-[#D7DCE1] p-6">
                <div className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#238A55]">
                  <Icon className="h-4 w-4" />
                  {area.eyebrow}
                </div>
                <h3 className="text-2xl font-black leading-tight text-[#07073b]">{area.name}</h3>
                <p className="mt-3 leading-7 text-[#5F6B76]">{area.subtitle}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#07073b]">
                  Ver proyectos
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default PopularLocationsSection;
