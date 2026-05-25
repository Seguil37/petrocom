// src/features/tours/components/PopularLocationsSection.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Loader2 } from 'lucide-react';
import cuscoImg from '../../../assets/images/zonas/cusco.png';
import sanJeronimoImg from '../../../assets/images/zonas/san-jeronimo.png';
import sanSebastianImg from '../../../assets/images/zonas/san-sebastian.png';
import santiagoImg from '../../../assets/images/zonas/santiago.png';

const PopularLocationsSection = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const projectLocations = [
    {
      name: 'Cusco Centro',
      subtitle: 'Proyectos de vivienda e interiores',
      image: cuscoImg,
      projects: 32,
      rating: 4.8,
    },
    {
      name: 'San Sebastian',
      subtitle: 'Casas unifamiliares y multifamiliares',
      image: sanSebastianImg,
      projects: 28,
      rating: 4.7,
    },
    {
      name: 'San Jeronimo',
      subtitle: 'Casas de campo y proyectos residenciales',
      image: sanJeronimoImg,
      projects: 22,
      rating: 4.6,
    },
    {
      name: 'Santiago',
      subtitle: 'Vivienda y comercio local',
      image: santiagoImg,
      projects: 18,
      rating: 4.6,
    },
  ];

  useEffect(() => {
    setLocations(projectLocations);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#f3f4f6]">
        <div className="container-custom">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#1fb74d] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#f3f4f6]">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-12 animate-fade-in">
          <TrendingUp className="w-8 h-8 text-[#1fb74d]" />
          <h2 className="text-4xl lg:text-5xl font-black text-[#07073b]">
            Zonas donde mas diseñamos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <Link
              key={index}
              to={`/projects?search=${encodeURIComponent(location.name)}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#07073b] mb-2 group-hover:text-[#1fb74d] transition-colors">
                  {location.name}
                </h3>
                <p className="text-[#65647a] mb-3">{location.subtitle}</p>
                <div className="flex items-center justify-start">
                  <div className="flex items-center gap-1 text-[#1fb74d] opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Ver proyectos</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todos los proyectos
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularLocationsSection;
