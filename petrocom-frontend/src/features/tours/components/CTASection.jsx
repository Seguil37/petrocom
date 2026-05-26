// src/features/tours/components/CTASection.jsx

import { Link } from 'react-router-dom';
import { LogIn, UserPlus, ClipboardList } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const CTASection = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-[#238A55] via-[#2E9F63] to-[#07073b] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-[-6rem] right-[-4rem] w-96 h-96 bg-[#C58A2A]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] w-[28rem] h-[28rem] bg-[#05052f]/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 animate-fade-in transition-transform duration-500 hover:-translate-y-1">
            Consulta y gestiona tus tramites PETROCOM
          </h2>

          <p className="text-xl text-white mb-8 animate-fade-in transition-colors duration-500 hover:text-white">
            Accede para revisar expedientes vinculados, tareas, estados, documentos pendientes y actualizaciones del equipo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link to="/login" className="group bg-[#07073b] hover:bg-[#05052f] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 min-w-[200px] justify-center">
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Iniciar sesion
            </Link>

            <Link to="/register" className="group bg-[#F4F5F6] hover:bg-[#F4F5F6] text-[#07073b] font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 min-w-[200px] justify-center border-2 border-[#07073b]">
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Crear cuenta
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: ClipboardList,
                title: 'Seguimiento de expediente',
                description: 'Consulta codigo, estado actual, responsable, fechas, siguiente accion y documentos pendientes.',
                color: 'from-[#238A55] to-[#196B43]',
              },
              {
                icon: UserPlus,
                title: 'Portal del cliente',
                description: 'Revisa tramites vinculados a tu cuenta y manten un historial ordenado de gestiones tecnicas.',
                color: 'from-[#07073b] to-[#05052f]',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-[#F4F5F6]/80 backdrop-blur-sm rounded-xl p-6 shadow-lg animate-fade-in transition-all duration-500 hover:-translate-y-2 hover:bg-white" style={{ animationDelay: `${index * 0.1}s` }}>
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
