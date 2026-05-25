// src/features/tours/components/CTASection.jsx

import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Heart } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const CTASection = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-[#1fb74d] via-[#28c85a] to-[#07073b] relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-[-6rem] right-[-4rem] w-96 h-96 bg-[#e8a12f]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] w-[28rem] h-[28rem] bg-[#05052f]/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 animate-fade-in transition-transform duration-500 hover:-translate-y-1">
            Accede a tu cuenta Casaliz
          </h2>

          {/* Subtítulo */}
          <p className="text-xl text-white mb-8 animate-fade-in transition-colors duration-500 hover:text-white">
            Inicia sesión para dejar reseñas, descubrir proyectos destacados y guardar tus favoritos.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              to="/login"
              className="group bg-[#07073b] hover:bg-[#05052f] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 min-w-[200px] justify-center"
            >
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Iniciar sesión
            </Link>

            <Link
              to="/register"
              className="group bg-[#f3f4f6] hover:bg-[#f3f4f6] text-[#07073b] font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 min-w-[200px] justify-center border-2 border-[#07073b]"
            >
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Crear cuenta
            </Link>
          </div>

          {/* Beneficios */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Heart,
                title: 'Proyectos favoritos',
                description:
                  'Guarda tus proyectos favoritos para consultarlos siempre que los necesites. Descubre trabajos populares de la comunidad, comparte tus favoritos con otros usuarios y mantén una lista personalizada de inspiración.',
                color: 'from-[#1fb74d] to-[#168a3d]',
              },
              {
                icon: UserPlus,
                title: 'Opiniones de clientes',
                description:
                  'Lee reseñas de la comunidad, descubre proyectos destacados y guarda tus favoritos. Crea tu cuenta para dejar tus propias valoraciones y ayudar a otros usuarios a tomar mejores decisiones.',
                color: 'from-[#07073b] to-[#05052f]',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-[#f3f4f6]/80 backdrop-blur-sm rounded-xl p-6 shadow-lg animate-fade-in transition-all duration-500 hover:-translate-y-2 hover:bg-white"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-500 hover:scale-110`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-[#07073b] text-center">
                    <span className="font-extrabold">{benefit.title}</span>
                    <br />
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
