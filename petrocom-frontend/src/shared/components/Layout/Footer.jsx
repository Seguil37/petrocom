// src/shared/components/Layout/Footer.jsx
import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone, MapPin, Clock } from 'lucide-react';
import petrocomLogo from '../../../assets/images/petrocom-logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#07073b] text-[#D7DCE1]">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-xl shadow-lg border border-white/40 px-4 py-3">
                <div className="h-14 md:h-16 lg:h-20 max-w-[220px] flex items-center">
                  <img
                    src={petrocomLogo}
                    alt="PETROCOM Energy"
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-[#D7DCE1] mb-6 leading-relaxed">
              Servicios tecnicos para hidrocarburos: ITF, Registro de Hidrocarburos, expedientes,
              planes de contingencia y seguimiento de tramites ante entidades competentes.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61574640909224"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#05052f] hover:bg-[#238A55] rounded-full flex items-center justify-center transition-all group"
                aria-label="Facebook PETROCOM Energy"
              >
                <Facebook className="w-5 h-5 text-[#D7DCE1] group-hover:text-white" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Nuestros Servicios</h3>
            <ul className="space-y-3">
              {[
                'Informe Tecnico Favorable - ITF',
                'Registro de Hidrocarburos',
                'Grifos y estaciones de servicio',
                'Gasocentros y GLP',
                'Transporte de combustibles',
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="text-[#D7DCE1] hover:text-[#238A55] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#238A55] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">PETROCOM Energy</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/projects" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#238A55] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Proyectos y categorias
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#238A55] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Empresa
                </Link>
              </li>
              <li>
                <Link to="/consulta-tramite" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#238A55] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Consulta de tramite
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#238A55] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contactanos</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#238A55] flex-shrink-0 mt-0.5" />
                <a href="tel:+51927985691" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors">
                  927 985 691
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#238A55] flex-shrink-0 mt-0.5" />
                <a href="mailto:iaosoress@gmail.com" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors">
                  iaosoress@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#238A55] flex-shrink-0 mt-0.5" />
                <span className="text-[#D7DCE1]">
                  Jr. Chiclayo 345, El Tambo<br />
                  Huancayo, Junin
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#238A55] flex-shrink-0 mt-0.5" />
                <span className="text-[#D7DCE1]">Lun - Vie: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#05052f] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#D7DCE1] text-sm">
              © 2026 PETROCOM Energy. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors">
                Inicio
              </Link>
              <Link to="/services" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors">
                Servicios
              </Link>
              <Link to="/projects" className="text-[#D7DCE1] hover:text-[#238A55] transition-colors">
                Proyectos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
