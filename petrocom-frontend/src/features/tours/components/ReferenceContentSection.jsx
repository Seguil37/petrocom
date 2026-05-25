// src/features/tours/components/ReferenceContentSection.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, MapPin, Globe2, Star } from 'lucide-react';

const ReferenceContentSection = () => {
  const [activeTab, setActiveTab] = useState('guides');

  const tabs = [
    {
      id: 'guides',
      label: 'Guías para clientes',
      icon: Landmark,
    },
    {
      id: 'permits',
      label: 'Normativas y trámites',
      icon: MapPin,
    },
    {
      id: 'trends',
      label: 'Tendencias y materiales',
      icon: Globe2,
    },
  ];

  const content = {
    guides: [
      { name: 'Cómo preparar tu terreno antes de diseñar tu casa', count: 12, rating: 4.9 },
      { name: 'Checklist para definir tu proyecto de vivienda', count: 18, rating: 4.8 },
      { name: 'Guía para elegir materiales según tu presupuesto', count: 10, rating: 4.7 },
      { name: 'Cómo planificar una remodelación sin sorpresas', count: 16, rating: 4.8 },
      { name: 'Errores comunes al diseñar tu casa en Cusco', count: 14, rating: 4.7 },
      { name: 'Qué esperar en cada etapa del proyecto', count: 9, rating: 4.8 },
    ],
    permits: [
      { name: 'Guía básica de licencias y permisos municipales', count: 11, rating: 4.8 },
      { name: 'Requisitos para habilitación urbana y saneamiento', count: 8, rating: 4.7 },
      { name: 'Documentos clave para iniciar obra', count: 13, rating: 4.8 },
      { name: 'Cómo coordinar con tu junta de propietarios', count: 7, rating: 4.6 },
      { name: 'Supervisión de seguridad y defensa civil', count: 6, rating: 4.7 },
      { name: 'Cronograma de trámites para proyectos comerciales', count: 5, rating: 4.6 },
    ],
    trends: [
      { name: 'Tendencias en diseño de interiores 2024', count: 15, rating: 4.9 },
      { name: 'Materiales sostenibles para fachadas y pisos', count: 12, rating: 4.8 },
      { name: 'Cómo optimizar tu presupuesto sin sacrificar calidad', count: 14, rating: 4.8 },
      { name: 'Iluminación natural: estrategias y ejemplos', count: 9, rating: 4.7 },
      { name: 'Diseño biofílico para oficinas', count: 11, rating: 4.7 },
      { name: 'Colores y texturas para espacios comerciales', count: 10, rating: 4.6 },
    ],
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#F4F5F6] to-[#F4F5F6]">
      <div className="container-custom">
        {/* Título */}
        <h2 className="text-4xl lg:text-5xl font-black text-[#07073b] mb-8 text-center animate-fade-in">
          Contenido para ayudarte a tomar mejores decisiones
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#238A55] text-white shadow-lg scale-105'
                    : 'bg-[#F4F5F6] text-[#5F6B76] hover:bg-[#F4F5F6] shadow-md hover:shadow-lg'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-[#238A55]'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
          {content[activeTab].map((item, index) => (
            <Link
              key={index}
              to={`/projects?tema=${encodeURIComponent(item.name)}`}
              className="group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#F4F5F6] hover:border-[#238A55]"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <h3 className="font-bold text-[#07073b] mb-2 group-hover:text-[#238A55] transition-colors truncate">
                {item.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-[#238A55] fill-current" />
                <span className="text-sm font-medium text-[#07073b]">{item.rating}</span>
              </div>

              <p className="text-sm text-[#5F6B76]">
                {item.count} {item.count === 1 ? 'recurso' : 'recursos'} destacados
              </p>

              {/* Indicador de hover */}
              <div className="mt-3 h-1 w-0 group-hover:w-full bg-[#238A55] transition-all duration-500 rounded-full"></div>
            </Link>
          ))}
        </div>

        {/* Ver más */}
        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-[#238A55] hover:bg-[#196B43] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todos los recursos
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

export default ReferenceContentSection;
