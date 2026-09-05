import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, FileClock, LogIn, UserPlus } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import MotionTitle from '../../../shared/motion/MotionTitle';

const benefits = [
  {
    icon: FileClock,
    title: 'Seguimiento del expediente',
    description: 'Consulta estados, fechas, responsables y documentos pendientes desde un solo lugar.',
  },
  {
    icon: ClipboardCheck,
    title: 'Historial organizado',
    description: 'Mantiene visibles los avances y siguientes acciones de cada gestion tecnica.',
  },
];

const CTASection = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return null;

  return (
    <section className="overflow-hidden bg-[#07073b] py-20 text-white lg:py-24">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-[#71D69B]">
              Portal Petrocom
            </p>
            <MotionTitle className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              Tus gestiones tecnicas, claras y siempre disponibles
            </MotionTitle>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 lg:text-lg">
              Accede a los expedientes vinculados con tu cuenta, revisa avances y conoce la siguiente accion del equipo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#238A55] px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#1C7548]"
              >
                <LogIn className="h-5 w-5" />
                Iniciar sesion
              </Link>
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/35 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:border-white hover:bg-white hover:text-[#07073b]"
              >
                <UserPlus className="h-5 w-5" />
                Crear cuenta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="border-y border-white/20">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="grid grid-cols-[3rem_1fr] gap-5 border-b border-white/20 py-7 last:border-b-0"
                  data-motion-card
                >
                  <span className="flex h-12 w-12 items-center justify-center bg-[#C58A2A] text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-white">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">{benefit.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
