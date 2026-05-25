import { useEffect, useMemo, useState } from 'react';
import { createElement } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Link2,
  Loader2,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { adminClientsApi } from '../../../shared/utils/api';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  observed: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
};

const AdminClientsPage = () => {
  const [summary, setSummary] = useState({
    total_clients: 0,
    clients_with_active_tramites: 0,
    recurrent_clients: 0,
    unlinked_tramites: 0,
  });
  const [clients, setClients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchDraft, setSearchDraft] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 8 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await adminClientsApi.dashboard({
          search: search || undefined,
          filter,
          page: currentPage,
          per_page: pagination.per_page,
        });
        setSummary(data.summary || {});
        setClients(data.clients || []);
        setPagination(data.meta || { current_page: 1, last_page: 1, total: 0, per_page: pagination.per_page });
        setSelectedId((current) => current || data.clients?.[0]?.id || null);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la informacion de clientes.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, filter, currentPage, pagination.per_page]);

  const selected = useMemo(
    () => clients.find((client) => String(client.id) === String(selectedId)) || clients[0] || null,
    [clients, selectedId]
  );

  const applySearch = (event) => {
    event.preventDefault();
    setSelectedId(null);
    setCurrentPage(1);
    setSearch(searchDraft.trim());
  };

  const clearSearch = () => {
    setSearchDraft('');
    setSearch('');
    setFilter('all');
    setCurrentPage(1);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#238A55]">Gestion comercial</p>
            <h1 className="mt-2 text-3xl font-black text-[#07073b]">Clientes</h1>
            <p className="mt-2 max-w-3xl text-[#5F6B76]">
              Administra clientes registrados, vincula sus tramites, revisa historial y detecta oportunidades de seguimiento.
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[430px]">
            <Link
              to="/admin/panel"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#07073b] bg-white px-3 py-2 text-sm font-black leading-none text-[#07073b] shadow-sm transition hover:bg-[#07073b] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span className="truncate">Panel principal</span>
            </Link>
            <Link
              to="/tramites/gestion"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#07073b] px-4 py-2 text-sm font-black text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
            >
              <Link2 className="h-4 w-4" />
              Vincular tramite
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Users} label="Clientes registrados" value={summary.total_clients} />
          <Metric icon={ClipboardList} label="Con tramites activos" value={summary.clients_with_active_tramites} />
          <Metric icon={Sparkles} label="Clientes recurrentes" value={summary.recurrent_clients} />
          <Metric icon={Link2} label="Tramites sin cuenta" value={summary.unlinked_tramites} />
        </div>

        <section className="rounded-2xl border border-[#D7DCE1] bg-white p-5 shadow-sm">
          <form onSubmit={applySearch} className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5F6B76]" />
              <input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Buscar por cliente, correo, telefono, codigo o tramite"
                className="min-h-[48px] w-full rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] pl-12 pr-4 text-[#07073b] outline-none focus:border-[#238A55]"
              />
            </div>
            <select
              value={filter}
              onChange={(event) => {
                setSelectedId(null);
                setCurrentPage(1);
                setFilter(event.target.value);
              }}
              className="min-h-[48px] rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 font-semibold text-[#07073b] outline-none focus:border-[#238A55]"
            >
              <option value="all">Todos los clientes</option>
              <option value="with_tramites">Solo con tramites</option>
              <option value="active_tramites">Con tramites activos</option>
              <option value="recurrent">Clientes recurrentes</option>
              <option value="without_tramites">Sin tramites</option>
            </select>
            <button
              type="submit"
              className="min-h-[48px] rounded-xl bg-[#07073b] px-6 font-black text-white transition hover:bg-[#05052f]"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={clearSearch}
              className="min-h-[48px] rounded-xl border border-[#D7DCE1] px-6 font-black text-[#07073b] transition hover:bg-[#F4F5F6]"
            >
              Limpiar
            </button>
          </form>
        </section>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#D7DCE1] bg-white text-[#07073b]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Cargando clientes...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 font-semibold text-red-700">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
            <div className="space-y-3">
              {clients.length === 0 ? (
                <div className="rounded-2xl border border-[#D7DCE1] bg-white p-6 text-center text-[#5F6B76]">
                  No se encontraron clientes.
                </div>
              ) : (
                clients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelectedId(client.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected?.id === client.id
                        ? 'border-[#238A55] bg-white shadow-md'
                        : 'border-[#D7DCE1] bg-white hover:border-[#07073b]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-black text-[#07073b]">{client.name}</p>
                        <p className="truncate text-sm text-[#5F6B76]">{client.email}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${client.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {client.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <MiniMetric label="Total" value={client.tramites_count} />
                      <MiniMetric label="Activos" value={client.active_tramites_count} />
                      <MiniMetric label="Finalizados" value={client.completed_tramites_count} />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-[#5F6B76]">
                      Ultimo: {client.latest_tramite?.code || 'Sin tramites vinculados'}
                    </p>
                  </button>
                ))
              )}
              {clients.length > 0 && (
                <Pagination
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  total={pagination.total}
                  perPage={pagination.per_page}
                  onPageChange={(page) => {
                    setSelectedId(null);
                    setCurrentPage(page);
                  }}
                />
              )}
            </div>

            <ClientDetail client={selected} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClientsPage;

const Metric = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-[#D7DCE1] bg-white p-5 shadow-sm">
    {createElement(icon, { className: 'h-6 w-6 text-[#238A55]' })}
    <p className="mt-4 text-3xl font-black text-[#07073b]">{value || 0}</p>
    <p className="mt-1 text-sm font-bold text-[#5F6B76]">{label}</p>
  </div>
);

const MiniMetric = ({ label, value }) => (
  <div className="rounded-xl bg-[#F4F5F6] p-2">
    <p className="text-lg font-black text-[#07073b]">{value || 0}</p>
    <p className="text-[11px] font-bold uppercase text-[#5F6B76]">{label}</p>
  </div>
);

const Pagination = ({ currentPage, lastPage, total, perPage, onPageChange }) => {
  const safeCurrent = Number(currentPage || 1);
  const safeLast = Math.max(1, Number(lastPage || 1));
  const start = total === 0 ? 0 : (safeCurrent - 1) * perPage + 1;
  const end = Math.min(total, safeCurrent * perPage);

  return (
    <div className="rounded-2xl border border-[#D7DCE1] bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5F6B76]">
        Mostrando {start}-{end} de {total}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={safeCurrent <= 1}
          onClick={() => onPageChange(safeCurrent - 1)}
          className="min-h-[40px] rounded-lg border border-[#07073b] px-3 text-sm font-black text-[#07073b] transition hover:bg-[#07073b] hover:text-white disabled:cursor-not-allowed disabled:border-[#D7DCE1] disabled:text-[#5F6B76] disabled:hover:bg-white"
        >
          Anterior
        </button>
        <span className="text-sm font-black text-[#07073b]">
          {safeCurrent} / {safeLast}
        </span>
        <button
          type="button"
          disabled={safeCurrent >= safeLast}
          onClick={() => onPageChange(safeCurrent + 1)}
          className="min-h-[40px] rounded-lg border border-[#07073b] px-3 text-sm font-black text-[#07073b] transition hover:bg-[#07073b] hover:text-white disabled:cursor-not-allowed disabled:border-[#D7DCE1] disabled:text-[#5F6B76] disabled:hover:bg-white"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

const ClientDetail = ({ client }) => {
  if (!client) {
    return (
      <div className="rounded-2xl border border-[#D7DCE1] bg-white p-8 text-center text-[#5F6B76]">
        Selecciona un cliente para ver su historial.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#238A55]">Perfil cliente</p>
            <h2 className="mt-2 text-2xl font-black text-[#07073b]">{client.name}</h2>
            <p className="mt-1 text-sm text-[#5F6B76]">{client.email}</p>
            <p className="text-sm text-[#5F6B76]">{client.phone || 'Sin telefono registrado'}</p>
          </div>
          <Link
            to="/tramites/gestion"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#238A55] px-4 py-2 text-sm font-black text-white transition hover:bg-[#196B43]"
          >
            Vincular nuevo tramite
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <InfoBlock icon={BriefcaseBusiness} label="Tramites" value={client.tramites_count} />
          <InfoBlock icon={ClipboardList} label="Activos" value={client.active_tramites_count} />
          <InfoBlock icon={CheckCircle2} label="Finalizados" value={client.completed_tramites_count} />
        </div>
      </section>

      <section className="rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#238A55]" />
          <h3 className="text-xl font-black text-[#07073b]">Historial de tramites</h3>
        </div>
        {client.tramites?.length ? (
          <div className="space-y-3">
            {client.tramites.map((tramite) => (
              <div key={tramite.id} className="rounded-xl border border-[#D7DCE1] bg-[#ffffff] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-[#238A55]">{tramite.code}</p>
                    <p className="mt-1 font-black text-[#07073b]">{tramite.project_name}</p>
                    <p className="text-sm text-[#5F6B76]">{tramite.property_name || 'Sin inmueble especifico'}</p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${statusStyles[tramite.status] || statusStyles.pending}`}>
                    {tramite.status_label}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[#5F6B76] sm:grid-cols-3">
                  <span>Registro: {formatDate(tramite.registered_at)}</span>
                  <span>Vence: {formatDate(tramite.due_date)}</span>
                  <span>Actualizado: {formatDateTime(tramite.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#5F6B76]">Este cliente aun no tiene tramites vinculados.</p>
        )}
      </section>

      <section className="rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#238A55]" />
          <h3 className="text-xl font-black text-[#07073b]">Oportunidades de seguimiento</h3>
        </div>
        <div className="space-y-2">
          {(client.opportunities || []).map((item) => (
            <div key={item} className="rounded-xl bg-[#F4F5F6] px-4 py-3 text-sm font-semibold text-[#07073b]">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const InfoBlock = ({ icon, label, value }) => (
  <div className="rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] p-4">
    {createElement(icon, { className: 'h-5 w-5 text-[#238A55]' })}
    <p className="mt-3 text-2xl font-black text-[#07073b]">{value || 0}</p>
    <p className="text-xs font-bold uppercase text-[#5F6B76]">{label}</p>
  </div>
);

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  if (year && month && day) return new Date(year, month - 1, day).toLocaleDateString('es-PE');
  return value;
};

const formatDateTime = (value) => {
  if (!value) return 'Sin registro';
  return new Date(value).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
};
