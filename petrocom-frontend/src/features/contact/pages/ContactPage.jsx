import { Mail, MapPin, Phone, Facebook, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const contactChannels = [
  {
    title: 'Escríbenos',
    description: 'Cuéntanos tu proyecto y recibe una respuesta clara en menos de 24 horas.',
    value: 'lissyosores@hotmail.com',
    href: 'mailto:lissyosores@hotmail.com',
    icon: Mail,
    accent: 'from-[#07073b] via-[#10104d] to-[#10104d]',
  },
  {
    title: 'Llámanos',
    description: 'Habla directamente con nuestro equipo para resolver dudas o coordinar una reunión.',
    value: '+51 984 696 802',
    href: 'tel:+51984696802',
    icon: Phone,
    accent: 'from-[#1fb74d] via-[#168a3d] to-[#1fb74d]',
  },
  {
    title: 'Visítanos',
    description: 'Estamos en Cusco para atender proyectos residenciales, comerciales e inmobiliarios.',
    value: 'Cusco, Perú',
    href: null,
    icon: MapPin,
    accent: 'from-[#168a3d] via-[#1fb74d] to-[#1fb74d]',
  },
];

const socialLinks = [
  {
    label: 'Síguenos en Facebook',
    href: 'https://www.facebook.com/CASALIZEIRL',
    icon: Facebook,
    bg: 'bg-[#07073b] hover:bg-[#1fb74d]',
  },
  {
    label: 'Escríbenos por WhatsApp',
    href: 'https://tinyurl.com/CasalizArquitectura',
    icon: null,
    bg: 'bg-[#1fb74d] hover:bg-[#168a3d]',
  },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(35,50,116,0.12),_transparent_30%),linear-gradient(180deg,#f3f4f6_0%,#f3f4f6_100%)] pb-14">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07073b] via-[#10104d] to-[#454546] text-white py-16">
        <div className="absolute inset-0 opacity-15" aria-hidden>
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#e8a12f] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        </div>

        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#fbf3df] transition-transform duration-500 hover:translate-x-1">
              <Sparkles className="h-4 w-4 transition-transform duration-500 hover:scale-110 hover:rotate-12" />
              Contacto Casaliz
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight transition-transform duration-500 hover:translate-x-1">
              Hablemos de tu proyecto con una propuesta clara, técnica y bien ejecutada.
            </h1>

            <p className="text-lg max-w-2xl text-white/88 transition-colors duration-500 hover:text-white">
              En Casaliz integramos arquitectura, gestión técnica y acompañamiento cercano. Si estás evaluando una obra, licencia,
              remodelación o proyecto inmobiliario, aquí empieza la conversación correcta.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://tinyurl.com/CasalizArquitectura"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#07073b] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              >
                Escribir por WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#ubicacion"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                Ver ubicación
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/15">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#fbf3df]">Atención directa</p>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Tiempo de respuesta', value: '24h' },
                { label: 'Ubicación base', value: 'Cusco' },
                { label: 'Especialidades', value: 'Arquitectura + Gestión' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3 transition-all duration-300 hover:bg-white/14">
                  <span className="text-sm text-white/80">{item.label}</span>
                  <span className="text-lg font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/85">
              Atendemos consultas para viviendas, oficinas, licencias, regularizaciones y servicios inmobiliarios con una ruta de
              trabajo más ordenada desde el primer contacto.
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom -mt-8 relative z-10 space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {contactChannels.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_24px_60px_rgba(77,58,31,0.10)] transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`h-24 bg-gradient-to-br ${item.accent} px-6 py-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black">{item.title}</p>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <p className="text-sm leading-6 text-[#65647a]">{item.description}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-2 text-sm font-bold text-[#07073b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f3f4f6]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-2 text-sm font-bold text-[#07073b]">
                      {item.value}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div
          id="ubicacion"
          className="overflow-hidden rounded-[34px] border border-[#dfe2ea] bg-white shadow-[0_25px_70px_rgba(77,58,31,0.08)]"
        >
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f3f4f6_100%)] p-8 md:p-10">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e8a12f]">Nuestra ubicación</p>
                  <h2 className="mt-3 text-3xl font-black text-[#07073b]">CasaLiz</h2>
                  <p className="mt-2 text-sm font-medium text-[#65647a]">Arquitectos e Ingenieros</p>
                </div>

                <div className="rounded-[28px] border border-[#dfe2ea] bg-white p-6 shadow-sm">
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#f3f4f6]">
                        <MapPin className="h-5 w-5 text-[#1fb74d]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#65647a]">Dirección</p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-[#07073b]">
                          Av. Lloque Yupanqui, Edificio Ecological Plaza
                          <br />
                          2do. Nivel, Oficina 202
                          <br />
                          Wanchaq, Cusco
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#f3f4f6]">
                        <Phone className="h-5 w-5 text-[#1fb74d]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#65647a]">Teléfono</p>
                        <a href="tel:+51984696802" className="mt-1 inline-flex text-sm font-bold text-[#1fb74d] transition-colors hover:text-[#e8a12f]">
                          +51 984 696 802
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#f3f4f6]">
                        <Mail className="h-5 w-5 text-[#1fb74d]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#65647a]">Correo</p>
                        <a
                          href="mailto:lissyosores@hotmail.com"
                          className="mt-1 inline-flex break-all text-sm font-bold text-[#1fb74d] transition-colors hover:text-[#e8a12f]"
                        >
                          lissyosores@hotmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((item) => {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-[#dfe2ea] bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1"
                      >
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors ${item.bg}`}>
                          {item.label.includes('WhatsApp') ? (
                            <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden="true">
                              <path d="M19.11 17.36c-.27-.14-1.58-.78-1.82-.86-.24-.09-.42-.14-.59.14-.18.27-.68.86-.84 1.04-.15.18-.31.2-.58.07-.27-.14-1.15-.42-2.18-1.35-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.56.12-.12.27-.31.41-.46.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.59-1.43-.81-1.96-.21-.51-.43-.44-.59-.45h-.5c-.18 0-.45.07-.68.31-.24.27-.91.89-.91 2.16 0 1.27.93 2.5 1.05 2.66.13.18 1.82 2.78 4.42 3.89.62.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.58-.65 1.81-1.27.22-.63.22-1.16.15-1.27-.06-.11-.24-.18-.51-.31Z" />
                              <path d="M16.02 3.2c-7.03 0-12.74 5.66-12.74 12.64 0 2.23.59 4.41 1.72 6.33L3.2 28.8l6.82-1.78a12.86 12.86 0 0 0 6 1.52h.01c7.03 0 12.77-5.67 12.77-12.65 0-3.38-1.32-6.56-3.7-8.94A12.67 12.67 0 0 0 16.02 3.2Zm0 23.2h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-4.05 1.05 1.08-3.95-.26-.4a10.47 10.47 0 0 1-1.64-5.55c0-5.82 4.82-10.56 10.74-10.56 2.86 0 5.54 1.1 7.57 3.12a10.41 10.41 0 0 1 3.14 7.44c0 5.83-4.83 10.57-10.73 10.57Z" />
                            </svg>
                          ) : (
                            <Facebook className="h-5 w-5" />
                          )}
                        </span>
                        <span className="text-sm font-semibold text-[#07073b]">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-[#07073b]/80 to-transparent px-6 py-5 text-white">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#fbf3df]">Mapa</p>
                  <p className="mt-1 text-lg font-black">Encuéntranos en Cusco</p>
                </div>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1371.5035743018245!2d-71.96059956528927!3d-13.523442715970118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd5fdb208814b%3A0xccb5144368db6c15!2sCasaLiz%20%E2%80%93%20Arquitectos%20%E2%80%93%20Ingenieros!5e0!3m2!1ses-419!2spe!4v1765583209300!5m2!1ses-419!2spe"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CasaLiz Ubicación"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
