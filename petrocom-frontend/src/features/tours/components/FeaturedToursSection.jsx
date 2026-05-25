import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import TourCard from './TourCard';
import api from '../../../shared/utils/api';

const FeaturedToursSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await api.get('/projects/featured');
        setProjects(response.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const exampleProjects = [
    {
      id: 1,
      title: 'Casa Miraflores',
      type: 'Residencial',
      hero_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      city: 'Lima',
      state: 'Lima',
      is_featured: true,
    },
    {
      id: 2,
      title: 'Loft Barranco',
      type: 'Departamento',
      hero_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      city: 'Lima',
      state: 'Lima',
      is_featured: true,
    },
    {
      id: 3,
      title: 'Condominio Valle Sagrado',
      type: 'Condominio',
      hero_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      city: 'Urubamba',
      state: 'Cusco',
      is_featured: true,
    },
  ];

  const displayProjects = projects.length > 0 ? projects : exampleProjects;

  if (loading) {
    return (
      <section className="py-20 bg-[#f3f4f6]">
        <div className="container-custom text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1fb74d] border-t-transparent"></div>
          <p className="mt-4 text-[#65647a]">Cargando proyectos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#f3f4f6]">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 transition-transform duration-500 hover:translate-x-1">
            <Sparkles className="w-8 h-8 text-[#1fb74d] transition-transform duration-500 hover:scale-110 hover:rotate-6" />
            <h2 className="text-4xl lg:text-5xl font-black text-[#07073b]">
              Proyectos destacados
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden md:flex items-center gap-2 text-[#1fb74d] hover:text-[#e8a12f] font-semibold transition-all duration-300 hover:translate-x-1"
          >
            Ver todos los proyectos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProjects.map((project) => (
            <TourCard key={project.id} tour={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedToursSection;
