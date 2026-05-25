// src/shared/components/Layout/Footer.jsx
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
} from 'lucide-react';
import petrocomLogo from '../../../assets/images/petrocom-logo.png';


const Footer = () => {
  return (
    <footer className="bg-[#07073b] text-[#dfe2ea]">
      <div className="container-custom py-16">
        {/* Primera fila con 4 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Marca */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-xl shadow-lg border border-white/40 px-4 py-3">
                <div className="h-14 md:h-16 lg:h-20 max-w-[220px] flex items-center">
                  <img
                    src={petrocomLogo}
                    alt="Petrocom"
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-[#dfe2ea] mb-6 leading-relaxed">
              Arquitectos e ingenieros especializados en soluciones a medida para proyectos
              residenciales, comerciales y corporativos.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/CASALIZEIRL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#05052f] hover:bg-[#1fb74d] rounded-full flex items-center justify-center transition-all group"
              >
                <Facebook className="w-5 h-5 text-[#dfe2ea] group-hover:text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#05052f] hover:bg-[#1fb74d] rounded-full flex items-center justify-center transition-all group"
              >
                <Instagram className="w-5 h-5 text-[#dfe2ea] group-hover:text-white" />
              </a>
              
            </div>
          </div>

          {/* Columna 2: Nuestros Servicios */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Nuestros Servicios</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/services"
                  className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1fb74d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Diseño arquitectónico
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1fb74d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Licencias
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1fb74d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Expedientes tecnicos
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1fb74d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Consultorías y supervisión
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Proyectos / Empresa */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Proyectos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/projects"
                  className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1fb74d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Galería de proyectos
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:5173/about"
                  className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1fb74d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Nosotros
                </a>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1fb74d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1fb74d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Servicios
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contáctanos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contáctanos</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#1fb74d] flex-shrink-0 mt-0.5" />
                <a href="tel:+51984696802" className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors">
                  984 696802
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#1fb74d] flex-shrink-0 mt-0.5" />
                <a href="mailto:lissyosores@hotmail.com" className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors">
                  lissyosores@hotmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1fb74d] flex-shrink-0 mt-0.5" />
                <span className="text-[#dfe2ea]">
                  Av. Lloque Yupanqui, Edificio Ecological Plaza 2do. nivel Of. 202<br />
                  Wanchaq - Cusco - Cusco
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#1fb74d] flex-shrink-0 mt-0.5" />
                <span className="text-[#dfe2ea]">Lun - Vie: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-[#05052f] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#dfe2ea] text-sm">
              © 2025 CasaLiz Arquitectos Ingenieros. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/"
                className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/services"
                className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors"
              >
                Servicios
              </Link>
              <Link
                to="/projects"
                className="text-[#dfe2ea] hover:text-[#1fb74d] transition-colors"
              >
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
