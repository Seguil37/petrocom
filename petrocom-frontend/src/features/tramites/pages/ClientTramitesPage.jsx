import { useEffect, useMemo, useState } from 'react';
import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, CheckCircle2, Loader2, Search, Sparkles } from 'lucide-react';
import { clientTramitesApi, extractArray } from '../../../shared/utils/api';
import ClientTramiteStatus from '../components/ClientTramiteStatus';

const ClientTramitesPage = () => {
  const [tramites, setTramites] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, completed: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await clientTramitesApi.mine();
        const items = extractArray(data, ['tramites']);
        setTramites(items);
        setSummary(data.summary || { total: 0, active: 0, completed: 0 });
        setSelectedId(items[0]?.id || null);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus tramites.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tramites;
    return tramites.filter((tramite) => {
      const text = `${tramite.code || ''} ${tramite.project_name || ''} ${tramite.property_name || ''} ${tramite.status_label || ''}`.toLowerCase();
      return text.includes(term);
    });
  }, [tramites, search]);

  const selected = tramites.find((tramite) => tramite.id === selectedId) || filtered[0] || null;
  const recommendations = buildRecommendations(tramites);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4F5F6]">
        <div className="container-custom flex min-h-[60vh] items-center justify-center text-[#07073b]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando tus tramites...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F5F6]">
      <section className="border-b border-[#D7DCE1] bg-white">
        <div className="container-custom py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-[#238A55]">Portal del cliente</p>
              <h1 className="mt-1 text-3xl font-black text-[#07073b]">Mis tramites</h1>
              <p className="mt-2 max-w-2xl text-[#5F6B76]">
                Revisa tus expedientes activos, historial con PETROCOM Energy y siguientes servicios recomendados.
              </p>
            </div>
            <Link
              to="/consulta-tramite"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#07073b] px-4 py-2 text-sm font-black text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
            >
              Consultar por codigo
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat icon={BriefcaseBusiness} label="Total" value={summary.total} />
            <Stat icon={Sparkles} label="Activos" value={summary.active} />
            <Stat icon={CheckCircle2} label="Finalizados" value={summary.completed} />
          </div>
        </div>
      </section>

      <section className="container-custom py-8">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">{error}</div>
        ) : tramites.length === 0 ? (
          <div className="rounded-lg border border-[#D7DCE1] bg-white p-8 text-center">
            <p className="text-xl font-black text-[#07073b]">Aun no tienes tramites vinculados a tu cuenta</p>
            <p className="mt-2 text-sm text-[#5F6B76]">
              Si ya tienes un codigo, puedes consultar el estado sin iniciar sesion o pedir al equipo que lo vincule a tu perfil.
            </p>
            <Link
              to="/consulta-tramite"
              className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#238A55] px-5 font-black text-white transition hover:bg-[#196B43]"
            >
              Consultar por codigo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
            <aside className="space-y-4">
              <div className="rounded-lg border border-[#D7DCE1] bg-white p-4 shadow-sm">
                <label htmlFor="client-tramite-search" className="text-xs font-black uppercase text-[#5F6B76]">
                  Buscar
                </label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6B76]" />
                  <input
                    id="client-tramite-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Codigo, expediente o servicio"
                    className="min-h-[44px] w-full rounded-lg border border-[#D7DCE1] pl-10 pr-3 text-sm text-[#07073b] outline-none focus:border-[#238A55]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filtered.map((tramite) => (
                  <button
                    key={tramite.id}
                    type="button"
                    onClick={() => setSelectedId(tramite.id)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      selected?.id === tramite.id
                        ? 'border-[#238A55] bg-white shadow-sm'
                        : 'border-[#D7DCE1] bg-white hover:border-[#07073b]'
                    }`}
                  >
                    <p className="text-xs font-black uppercase text-[#238A55]">{tramite.code}</p>
                    <p className="mt-1 font-black text-[#07073b]">{tramite.project_name || tramite.type?.name}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D7DCE1]">
                      <div className="h-full rounded-full bg-[#238A55]" style={{ width: `${tramite.progress || 0}%` }} />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#5F6B76]">{tramite.status_label} - {tramite.progress || 0}%</p>
                  </button>
                ))}
              </div>
            </aside>

            <div className="space-y-6">
              <ClientTramiteStatus tramite={selected} />

              <section className="rounded-lg border border-[#D7DCE1] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#238A55]" />
                  <h2 className="text-lg font-black text-[#07073b]">Servicios recomendados</h2>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  {recommendations.map((item) => (
                    <div key={item.title} className="rounded-lg border border-[#D7DCE1] bg-[#ffffff] p-4">
                      <p className="font-black text-[#07073b]">{item.title}</p>
                      <p className="mt-1 text-sm text-[#5F6B76]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ClientTramitesPage;

const Stat = ({ icon, label, value }) => (
  <div className="rounded-lg border border-[#D7DCE1] bg-[#ffffff] p-4">
    {createElement(icon, { className: 'h-5 w-5 text-[#238A55]' })}
    <p className="mt-3 text-3xl font-black text-[#07073b]">{value || 0}</p>
    <p className="text-sm font-bold text-[#5F6B76]">{label}</p>
  </div>
);

const buildRecommendations = (tramites) => {
  const text = tramites.map((tramite) => `${tramite.type?.name || ''} ${tramite.project_name || ''}`).join(' ').toLowerCase();

  if (text.includes('itf') || text.includes('estacion') || text.includes('grifo')) {
    return [
      { title: 'Registro de Hidrocarburos', description: 'Continua con la inscripcion o actualizacion cuando el expediente tecnico lo requiera.' },
      { title: 'Plan de contingencia', description: 'Ordena protocolos, riesgos y respuesta ante emergencias para la actividad.' },
      { title: 'Levantamiento de observaciones', description: 'Prepara descargos, planos corregidos y memorias complementarias.' },
    ];
  }

  if (text.includes('glp') || text.includes('consumidor')) {
    return [
      { title: 'Matriz de riesgo', description: 'Identifica peligros y medidas de control para almacenamiento o despacho.' },
      { title: 'Planos tecnicos', description: 'Actualiza distribucion, tanques, tuberias, venteos y zonas de seguridad.' },
      { title: 'Registro de Hidrocarburos', description: 'Valida requisitos para inscripcion, modificacion o actualizacion.' },
    ];
  }

  return [
    { title: 'Revision tecnica', description: 'Detecta brechas documentales antes de iniciar nuevas gestiones.' },
    { title: 'Plan de contingencia', description: 'Ordena medidas de control y respuesta ante emergencias.' },
    { title: 'Documentos ordenados', description: 'Centraliza entregables, antecedentes y observaciones del expediente.' },
  ];
};
