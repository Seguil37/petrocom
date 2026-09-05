import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderKanban } from 'lucide-react';
import TourCard from './TourCard';
import api, { extractArray } from '../../../shared/utils/api';
import MotionTitle from '../../../shared/motion/MotionTitle';

import grifosImage from '../../../assets/images/servicios-principales/grifos_estaciones_servicio.png';
import gasocentrosImage from '../../../assets/images/servicios-principales/gasocentros_glp.png';
import itfImage from '../../../assets/images/servicios-principales/informe_tecnico_favorable_itf.png';
import registroImage from '../../../assets/images/servicios-principales/registro_de_hidrocarburos.png';
import transporteImage from '../../../assets/images/servicios-principales/transporte_combustibles.png';
import consumidoresImage from '../../../assets/images/servicios-principales/consumidores_directos.png';

const fallbackProjects = [
  { id: 'grifos', title: 'Expedientes para grifos y estaciones de servicio', type: 'Infraestructura de combustibles', city: 'Huancayo', state: 'Junin', localImage: grifosImage },
  { id: 'gasocentros', title: 'Ingenieria y gestion para gasocentros de GLP', type: 'Instalaciones GLP', city: 'Huancayo', state: 'Junin', localImage: gasocentrosImage },
  { id: 'itf', title: 'Informe Tecnico Favorable para instalaciones', type: 'Permisos tecnicos', city: 'Region centro', localImage: itfImage },
  { id: 'registro', title: 'Inscripcion en el Registro de Hidrocarburos', type: 'Gestion regulatoria', city: 'Junin', localImage: registroImage },
  { id: 'transporte', title: 'Autorizaciones para transporte de combustibles', type: 'Transporte especializado', city: 'Region centro', localImage: transporteImage },
  { id: 'consumidores', title: 'Implementacion para consumidores directos', type: 'Operacion de hidrocarburos', city: 'Junin', localImage: consumidoresImage },
];

const FeaturedToursSection = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchFeaturedProjects = async () => {
      try {
        const response = await api.get('/projects/featured');
        const data = extractArray(response.data, ['projects']);
        if (active) setProjects(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchFeaturedProjects();
    return () => {
      active = false;
    };
  }, []);

  const displayProjects = projects.length ? projects : fallbackProjects;

  return (
    <section className="bg-[#F4F5F6] py-20 lg:py-28">
      <div className="container-custom">
        <div className="mb-10 flex flex-col gap-6 border-b border-[#C9D0D6] pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#238A55]">
              <FolderKanban className="h-4 w-4" />
              Portafolio destacado
            </div>
            <MotionTitle className="text-3xl font-black leading-tight text-[#07073b] sm:text-4xl lg:text-5xl">
              Proyectos que convierten requisitos en operacion
            </MotionTitle>
          </div>

          <Link
            to="/projects"
            className="inline-flex min-h-11 items-center gap-2 self-start border-b-2 border-[#238A55] pb-2 text-sm font-extrabold text-[#07073b] transition-colors hover:text-[#238A55] md:self-auto"
          >
            Ver todos los proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {displayProjects.map((project) => (
            <TourCard key={project.id} tour={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedToursSection;
