import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle, Download, Mail, Phone, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPaid } = location.state || {};

  useEffect(() => {
    if (!totalPaid) {
      navigate('/');
      return;
    }

    const end = Date.now() + 1800;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 70,
        spread: 60,
        origin: { x: 0.35, y: 0.25 },
        colors: ['#07073b', '#238A55', '#C58A2A', '#D7DCE1'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [totalPaid, navigate]);

  if (!totalPaid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-16">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-[#07073b] to-[#238A55] rounded-full mb-8 shadow-xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-[#07073b] mb-4">
            Solicitud registrada
          </h1>

          <p className="text-xl text-[#5F6B76] mb-6">
            Hemos recibido tu solicitud y el equipo de PETROCOM Energy revisara la informacion enviada.
          </p>

          <div className="inline-flex items-center gap-3 bg-white text-[#07073b] px-6 py-3 rounded-full font-bold text-lg shadow-sm">
            <CheckCircle className="w-6 h-6 text-[#238A55]" />
            Importe registrado: S/. {totalPaid.toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#07073b] mb-4 flex items-center justify-center gap-2">
              <Mail className="w-6 h-6 text-[#238A55]" />
              Proximos pasos
            </h2>
            <p className="text-[#5F6B76]">
              PETROCOM revisara el tipo de servicio, documentacion inicial y datos de contacto para coordinar la atencion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-[#F4F5F6] rounded-xl">
              <div className="w-14 h-14 bg-[#07073b] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-[#07073b] mb-2">Revision inicial</h3>
              <p className="text-sm text-[#5F6B76]">Validamos alcance, actividad y requisitos aplicables.</p>
            </div>

            <div className="text-center p-6 bg-[#F4F5F6] rounded-xl">
              <div className="w-14 h-14 bg-[#07073b] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-[#07073b] mb-2">Coordinacion tecnica</h3>
              <p className="text-sm text-[#5F6B76]">Un responsable se comunicara para solicitar o confirmar documentos.</p>
            </div>

            <div className="text-center p-6 bg-[#F4F5F6] rounded-xl">
              <div className="w-14 h-14 bg-[#07073b] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-[#07073b] mb-2">Seguimiento</h3>
              <p className="text-sm text-[#5F6B76]">Podras consultar el avance del tramite con el codigo asignado.</p>
            </div>
          </div>

          <div className="bg-[#F4F5F6] rounded-xl p-6">
            <h3 className="font-bold text-[#07073b] mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#C58A2A]" />
              Atencion PETROCOM
            </h3>
            <p className="text-[#303840] mb-4">
              Para consultas urgentes sobre ITF, Registro de Hidrocarburos, GLP, estaciones de servicio o transporte de combustibles, contactanos directamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:iaosoress@gmail.com"
                className="flex items-center gap-2 text-[#238A55] hover:text-[#196B43] font-medium transition-colors"
              >
                <Mail className="w-5 h-5" />
                iaosoress@gmail.com
              </a>
              <a
                href="tel:+51927985691"
                className="flex items-center gap-2 text-[#238A55] hover:text-[#196B43] font-medium transition-colors"
              >
                <Phone className="w-5 h-5" />
                +51 927 985 691
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/profile/bookings"
            className="flex items-center justify-center gap-2 bg-[#238A55] hover:bg-[#196B43] text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Calendar className="w-5 h-5" />
            Ver mis solicitudes
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white border-2 border-[#D7DCE1] text-[#07073b] font-bold px-6 py-4 rounded-xl hover:bg-[#F4F5F6] transition-all"
          >
            <Download className="w-5 h-5" />
            Descargar constancia
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-[#07073b] mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#238A55]" />
            Gestion tecnica y normativa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p className="text-[#303840]">
              Elaboramos expedientes, planos, memorias, matrices de riesgo y planes de contingencia para actividades de hidrocarburos.
            </p>
            <p className="text-[#303840]">
              Acompanamos la presentacion, seguimiento y levantamiento de observaciones ante entidades competentes.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/servicios"
            className="inline-flex items-center gap-2 text-[#238A55] hover:text-[#C58A2A] font-bold text-lg transition-colors"
          >
            Ver servicios PETROCOM
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
