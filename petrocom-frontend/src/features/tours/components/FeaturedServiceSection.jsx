import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Sparkles } from 'lucide-react';
import { extractArray, servicesApi, toPublicUrl } from '../../../shared/utils/api';
import MotionTitle from '../../../shared/motion/MotionTitle';

import itfImage from '../../../assets/images/servicios-principales/informe_tecnico_favorable_itf.png';
import registroImage from '../../../assets/images/servicios-principales/registro_de_hidrocarburos.png';
import grifosImage from '../../../assets/images/servicios-principales/grifos_estaciones_servicio.png';
import gasocentrosImage from '../../../assets/images/servicios-principales/gasocentros_glp.png';
import consumidoresImage from '../../../assets/images/servicios-principales/consumidores_directos.png';
import contingenciaImage from '../../../assets/images/servicios-principales/planes_de_contingencia.png';

const fallbackServices = [
  {
    id: 'itf',
    title: 'Informe Tecnico Favorable (ITF)',
    category: 'Ingenieria y permisos',
    localImage: itfImage,
  },
  {
    id: 'registro-hidrocarburos',
    title: 'Registro de Hidrocarburos',
    category: 'Gestion regulatoria',
    localImage: registroImage,
  },
  {
    id: 'grifos-estaciones',
    title: 'Grifos y estaciones de servicio',
    category: 'Infraestructura',
    localImage: grifosImage,
  },
  {
    id: 'gasocentros-glp',
    title: 'Gasocentros de GLP',
    category: 'GLP',
    localImage: gasocentrosImage,
  },
  {
    id: 'consumidores-directos',
    title: 'Consumidores directos',
    category: 'Operacion y seguridad',
    localImage: consumidoresImage,
  },
  {
    id: 'planes-contingencia',
    title: 'Planes de contingencia',
    category: 'Seguridad operativa',
    localImage: contingenciaImage,
  },
];

const isFeaturedService = (service) => {
  const value = service?.is_featured ?? service?.featured;
  if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
  if (typeof value === 'number') return value === 1;
  return Boolean(value);
};

const getCategory = (service) => {
  if (typeof service.category === 'string') return service.category;
  return service.category?.name || 'Servicio especializado';
};

const FeaturedServiceSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchFeaturedServices = async () => {
      try {
        const response = await servicesApi.list({ per_page: 6, is_featured: true });
        const data = extractArray(response.data, ['services']);
        const featured = data.filter(isFeaturedService).slice(0, 6);
        if (active) setServices(featured);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchFeaturedServices();
    return () => {
      active = false;
    };
  }, []);

  const displayServices = services.length ? services : fallbackServices;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-custom">
        <div className="mb-10 flex flex-col gap-6 border-b border-[#D7DCE1] pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#238A55]">
              <Sparkles className="h-4 w-4" />
              Servicios destacados
            </div>
            <MotionTitle className="text-3xl font-black leading-tight text-[#07073b] sm:text-4xl lg:text-5xl">
              Soluciones tecnicas para operar con seguridad
            </MotionTitle>
          </div>

          <Link
            to="/services"
            className="inline-flex min-h-11 items-center gap-2 self-start border-b-2 border-[#238A55] pb-2 text-sm font-extrabold text-[#07073b] transition-colors hover:text-[#238A55] md:self-auto"
          >
            Ver todos los servicios
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {displayServices.map((service) => {
            const coverImage = service.localImage || toPublicUrl(service.cover_image || service.gallery?.[0]?.path);
            const destination = service.slug || (!service.localImage && service.id)
              ? `/services/${service.slug || service.id}`
              : '/services';

            return (
              <Link
                key={service.id}
                to={destination}
                className="group block min-w-0 focus:outline-none"
                data-motion-card
              >
                <article className="h-full overflow-hidden rounded-lg border border-[#D7DCE1] bg-[#07073b] shadow-[0_14px_38px_rgba(7,7,59,0.10)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_54px_rgba(7,7,59,0.18)] group-focus-visible:ring-2 group-focus-visible:ring-[#238A55] group-focus-visible:ring-offset-4">
                  <div className="flex min-h-12 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                    <span className="flex min-w-0 items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">
                      <BriefcaseBusiness className="h-4 w-4 shrink-0 text-[#58C487]" />
                      <span className="truncate">{getCategory(service)}</span>
                    </span>
                    {(service.localImage || isFeaturedService(service)) && (
                      <span className="shrink-0 bg-[#C58A2A] px-2.5 py-1 text-[10px] font-black uppercase text-white">
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={service.title}
                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.025]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-xs font-black uppercase tracking-[0.16em] text-[#5F6B76]">
                        Imagen no disponible
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 translate-y-[calc(100%-5.5rem)] bg-[#07073b]/95 p-5 text-white backdrop-blur-sm transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0 max-md:translate-y-0">
                      <h3 className="line-clamp-2 min-h-12 text-xl font-black leading-tight">
                        {service.title}
                      </h3>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#71D69B]">
                        Ver mas detalle
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServiceSection;
