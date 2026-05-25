// src/features/tours/components/WhyUsSection.jsx

import { Shield, Gift, Calendar, Award, Users, Clock } from 'lucide-react';

const WhyUsSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Tu proyecto, nuestra prioridad',
      description:
        'Acompañamos cada etapa: idea, diseño, planos y obra. Nos enfocamos en que el resultado se ajuste a tu estilo, presupuesto y necesidades reales.',
      color: 'from-[#07073b] to-[#05052f]',
    },
    {
      icon: Gift,
      title: 'Diseño funcional y estético',
      description:
        'Creamos espacios que se ven bien, se sienten bien y funcionan mejor: iluminación, circulación, materiales y cada detalle pensado para el uso diario.',
      color: 'from-[#07073b] to-[#05052f]',
    },
    {
      icon: Calendar,
      title: 'Gestión integral y transparente',
      description:
        'Coordinamos con ingenieros, proveedores y constructores. Tú ves el avance, nosotros nos encargamos de la complejidad técnica.',
      color: 'from-[#07073b] to-[#10104d]',
    },
  ];

  const stats = [
    { icon: Award, value: '98%', label: 'Proyectos entregados a tiempo' },
    { icon: Users, value: '120+', label: 'Proyectos diseñados y ejecutados' },
    { icon: Clock, value: '10+ años', label: 'Experiencia en arquitectura y construcción' },
  ];

  return (
    <section id="nosotros" className="py-20 bg-gradient-to-br from-[#F4F5F6] to-[#F4F5F6]">
      <div className="container-custom">
        {/* Título */}
        <div className="text-center mb-16 animate-fade-in transition-transform duration-500 hover:-translate-y-1">
          <h2 className="text-4xl lg:text-5xl font-black text-[#07073b] mb-4 transition-transform duration-500 hover:scale-[1.01]">
            ¿Por qué diseñar tu proyecto con Casaliz?
          </h2>
          <div className="w-24 h-1 bg-[#238A55] mx-auto rounded-full transition-all duration-500 hover:w-32"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Icono con gradiente */}
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-[#07073b] mb-4 group-hover:text-[#238A55] transition-colors">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="text-[#5F6B76] leading-relaxed">{feature.description}</p>

                {/* Línea decorativa */}
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-[#238A55] transition-all duration-500 rounded-full"></div>
              </div>
            );
          })}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative overflow-hidden bg-gradient-to-br from-[#07073b] via-[#10104d] to-[#303840] rounded-2xl p-8 text-center animate-fade-in shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_55px_rgba(35,50,116,0.20)]"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#C58A2A] to-[#C58A2A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transition-transform duration-500 hover:scale-110">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="relative text-4xl font-black text-white drop-shadow mb-2">{stat.value}</div>
                <div className="relative text-white/90 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
