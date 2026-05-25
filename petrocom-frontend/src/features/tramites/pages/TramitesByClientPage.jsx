import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronLeft, ChevronRight, ClipboardList, Loader2, MapPin, Plus, Search, UserCircle } from 'lucide-react';
import { tramitesApi, adminUsersApi } from '../../../shared/utils/api';
import { normalizeSentence, toTitleCase } from '../../../shared/utils/formNormalization';
import { MODULES, canAccessModule, isStaff } from '../../../shared/constants/roles';
import useAuthStore from '../../../store/authStore';
import AdminPanelBackButton from '../../../shared/components/AdminPanelBackButton';

const statusBadges = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  observed: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
};

const TRAMITES_PER_PAGE = 8;

const PERU_DEPARTMENTS = [
  'Amazonas',
  'Ancash',
  'Apurimac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huanuco',
  'Ica',
  'Junin',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martin',
  'Tacna',
  'Tumbes',
  'Ucayali',
];
const LOCATION_SUGGESTIONS = {
  Lima: {
    provinces: ['Lima', 'Huaral', 'Cañete', 'Huaura'],
    districts: ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco', 'Cieneguilla'],
  },
  Cusco: {
    provinces: ['Cusco', 'Anta', 'Urubamba', 'Calca'],
    districts: ['Cusco', 'San Sebastian', 'San Jeronimo', 'Wanchaq', 'Santiago', 'Zurite'],
  },
  Arequipa: {
    provinces: ['Arequipa', 'Camana', 'Caylloma'],
    districts: ['Yanahuara', 'Cayma', 'Cerro Colorado', 'Jose Luis Bustamante'],
  },
  Piura: {
    provinces: ['Piura', 'Sullana', 'Paita'],
    districts: ['Piura', 'Castilla', 'Catacaos'],
  },
};

const TRAMITE_NAME_SUGGESTIONS = [
  'Licencia de Obra',
  'Declaratoria de Fabrica',
  'Independizacion de Predio',
  'Subdivision de Lote',
  'Acumulacion de Lote',
  'Prescripcion Adquisitiva',
  'Saneamiento Fisico Legal',
  'Regularizacion de Edificacion',
];

const emptyForm = {
  tramite_type_id: '',
  client_id: '',
  client_name: '',
  project_name: '',
  property_name: '',
  location_department: '',
  location_province: '',
  location_district: '',
  due_date: '',
  responsible_id: '',
  status: 'pending',
};

const TramitesByClientPage = () => {
  const { user } = useAuthStore();
  const [types, setTypes] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchDraft, setSearchDraft] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, lastPage: 1 });
  const [form, setForm] = useState(emptyForm);
  const provinceHints = LOCATION_SUGGESTIONS[form.location_department]?.provinces || [];
  const districtHints = LOCATION_SUGGESTIONS[form.location_department]?.districts || [];
  const canManageTramites = canAccessModule(user, MODULES.TRAMITES_MANAGE);

  const loadInitial = useCallback(async (page = currentPage) => {
    try {
      setLoading(true);
      const promises = [
        tramitesApi.listTypes(),
        tramitesApi.list({
          page,
          per_page: TRAMITES_PER_PAGE,
          search: filters.search || undefined,
          status: filters.status || undefined,
        }),
      ];
      const shouldLoadUsers = canManageTramites;

      if (shouldLoadUsers) promises.push(adminUsersApi.list(), adminUsersApi.clients());

      const [typesRes, tramitesRes, usersRes, clientsRes] = await Promise.all(promises);

      setTypes(typesRes.data);
      setTramites(tramitesRes.data.data || tramitesRes.data);
      setPagination({
        total: tramitesRes.data.total || (tramitesRes.data.data || tramitesRes.data || []).length,
        lastPage: tramitesRes.data.last_page || 1,
      });

      if (shouldLoadUsers && usersRes) {
        setResponsables((usersRes.data?.data || usersRes.data || []).filter((item) => isStaff(item.role)));
        setClients(clientsRes?.data || []);
      } else {
        setResponsables([]);
        setClients([]);
      }
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la informacion inicial.');
    } finally {
      setLoading(false);
    }
  }, [canManageTramites, currentPage, filters.search, filters.status, user]);

  useEffect(() => {
    loadInitial(currentPage);
  }, [currentPage, loadInitial]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasCompleteLocation(form)) {
      alert('Completa departamento, provincia y distrito del tramite.');
      return;
    }

    setSaving(true);

    try {
      await tramitesApi.create(buildPayload(form));
      setCurrentPage(1);
      await loadInitial(1);
      setForm(emptyForm);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'No se pudo crear el tramite.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (tramite) => {
      setEditing({
        ...tramite,
        client_id: tramite.client_id || '',
        ...parseLocation(tramite.location),
        due_date: tramite.due_date ? String(tramite.due_date).slice(0, 10) : '',
      });
  };

  const applySearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, search: searchDraft.trim() }));
  };

  const clearFilters = () => {
    setSearchDraft('');
    setFilters({ search: '', status: '' });
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setCurrentPage(1);
  };

  if (!canManageTramites) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F6] font-semibold text-[#07073b]">
        No tienes permiso para gestionar tramites por cliente/proyecto.
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 text-[#07073b] outline-none placeholder-[#5F6B76] focus:border-[#238A55] focus:ring-2 focus:ring-[#A8D8BA]';
  const labelClass = 'mb-1 block text-sm font-semibold text-[#07073b]';
  const codePreview = form.tramite_type_id ? buildTramiteCodeSuggestion(types, form.tramite_type_id) : 'Se generara al guardar';
  const canCreateOrDelete = canManageTramites;

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-black text-[#07073b]">Tramites por Cliente / Proyecto</h1>
            <p className="text-[#5F6B76]">
              Asigna un flujo de tramite ya definido a un cliente o proyecto especifico.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap xl:justify-end">
            <AdminPanelBackButton />
            <Link
              to="/tramites/control"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-primary px-4 py-2 text-sm font-bold leading-none text-white shadow-md hover:shadow-lg"
            >
              <ClipboardList className="h-4 w-4 shrink-0" />
              Vista general
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-lg lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#238A55]" />
              <h2 className="text-xl font-black text-[#07073b]">Registrar tramite</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelClass}>Codigo generado</label>
                <div className="rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 font-semibold text-[#07073b]">
                  {codePreview}
                </div>
                <p className="mt-1 text-xs text-[#5F6B76]">
                  El sistema asigna el codigo automaticamente segun el tipo, el año y el correlativo interno.
                </p>
              </div>

              <div>
                <label className={labelClass}>Tipo de tramite</label>
                <select
                  className={inputClass}
                  value={form.tramite_type_id}
                  onChange={(e) => setForm({ ...form, tramite_type_id: e.target.value })}
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.code} - {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Cliente registrado (opcional)</label>
                <select
                  className={inputClass}
                  value={form.client_id}
                  onChange={(e) => {
                    const selectedClient = clients.find((client) => String(client.id) === e.target.value);
                    setForm({
                      ...form,
                      client_id: e.target.value,
                      client_name: selectedClient?.name || form.client_name,
                    });
                  }}
                >
                  <option value="">Sin cuenta vinculada</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-[#5F6B76]">
                  Si eliges un cliente registrado, el tramite aparecera en su portal. Si lo dejas vacio, podra consultar solo con el codigo.
                </p>
              </div>

              <div>
                <label className={labelClass}>Cliente / Propietario</label>
                <input
                  className={inputClass}
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  onBlur={() => setForm((prev) => ({ ...prev, client_name: toTitleCase(prev.client_name) }))}
                  placeholder="Ej: Juan Perez Quispe"
                />
                <p className="mt-1 text-xs text-[#5F6B76]">Usa nombre y apellidos completos. Se corrige a formato titulo al salir del campo.</p>
              </div>

              <div>
                <label className={labelClass}>Nombre del tramite</label>
                <input
                  className={inputClass}
                  value={form.project_name}
                  onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                  onBlur={() => setForm((prev) => ({ ...prev, project_name: normalizeSentence(prev.project_name) }))}
                  list="tramite-name-suggestions"
                  placeholder="Ej: Licencia de obra de vivienda unifamiliar"
                  required
                />
                <datalist id="tramite-name-suggestions">
                  {TRAMITE_NAME_SUGGESTIONS.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                <p className="mt-1 text-xs text-[#5F6B76]">Elige una sugerencia si aplica; evita abreviaciones como lic., reg. o indep.</p>
              </div>

              <div>
                <label className={labelClass}>Nombre del inmueble / establecimiento (opcional)</label>
                <input
                  className={inputClass}
                  value={form.property_name}
                  onChange={(e) => setForm({ ...form, property_name: e.target.value })}
                  onBlur={() => setForm((prev) => ({ ...prev, property_name: toTitleCase(prev.property_name) }))}
                  placeholder="Ej: Torre A, Local 102"
                />
                <p className="mt-1 text-xs text-[#5F6B76]">Usa una denominacion estable: manzana, lote, local o edificio si corresponde.</p>
              </div>

              <div className="space-y-3 rounded-2xl border border-[#F4F5F6] bg-[#ffffff] p-4">
                <div>
                  <label className={labelClass}>Departamento</label>
                  <select
                    className={inputClass}
                    value={form.location_department}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location_department: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Selecciona un departamento</option>
                    {PERU_DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Provincia</label>
                  <input
                    className={inputClass}
                    value={form.location_province}
                    onChange={(e) => setForm({ ...form, location_province: e.target.value })}
                    onBlur={() => setForm((prev) => ({ ...prev, location_province: toTitleCase(prev.location_province) }))}
                    placeholder="Ej: Cusco"
                    list="tramite-province-suggestions"
                    required
                  />
                  <datalist id="tramite-province-suggestions">
                    {provinceHints.map((province) => (
                      <option key={province} value={province} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className={labelClass}>Distrito</label>
                  <input
                    className={inputClass}
                    value={form.location_district}
                    onChange={(e) => setForm({ ...form, location_district: e.target.value })}
                    onBlur={() => setForm((prev) => ({ ...prev, location_district: toTitleCase(prev.location_district) }))}
                    placeholder="Ej: San Sebastian"
                    list="tramite-district-suggestions"
                    required
                  />
                  <datalist id="tramite-district-suggestions">
                    {districtHints.map((district) => (
                      <option key={district} value={district} />
                    ))}
                  </datalist>
                </div>

                <p className="text-xs text-[#5F6B76]">
                  {form.location_department
                    ? `Sugerencias para ${form.location_department}: provincias ${provinceHints.join(', ') || 'sin datos'}; distritos ${districtHints.join(', ') || 'sin datos'}.`
                    : 'Primero elige un departamento para ver sugerencias de provincia y distrito.'}
                </p>
              </div>

              <div>
                <label className={labelClass}>Fecha de vencimiento</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Responsable general</label>
                <select
                  className={inputClass}
                  value={form.responsible_id}
                  onChange={(e) => setForm({ ...form, responsible_id: e.target.value })}
                >
                  <option value="">Selecciona un responsable</option>
                  {responsables.map((responsable) => (
                    <option key={responsable.id} value={responsable.id}>
                      {responsable.name} ({responsable.role})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 font-bold text-white shadow-md transition hover:shadow-lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Registrar tramite
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-lg lg:col-span-2">
            <div className="mb-4 space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-[#238A55]" />
                <h2 className="text-xl font-black text-[#07073b]">Tramites recientes</h2>
              </div>

              <form onSubmit={applySearch} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6B76]" />
                  <input
                    className={`${inputClass} pl-10`}
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    placeholder="Buscar por codigo, nombre, cliente, inmueble, ubicacion o responsable"
                  />
                </div>
                <select
                  className={inputClass}
                  value={filters.status}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En proceso</option>
                  <option value="observed">Observado</option>
                  <option value="completed">Finalizado</option>
                </select>
                <button
                  type="submit"
                  className="rounded-xl bg-[#07073b] px-4 py-2 font-bold text-white transition hover:bg-[#05052f]"
                >
                  Buscar
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl border border-[#D7DCE1] px-4 py-2 font-semibold text-[#07073b] transition hover:bg-[#F4F5F6]"
                >
                  Limpiar
                </button>
              </form>
            </div>

            {loading ? (
              <div className="text-[#5F6B76]">Cargando...</div>
            ) : tramites.length === 0 ? (
              <div className="text-[#5F6B76]">No se encontraron tramites con esos filtros.</div>
            ) : (
              <div className="space-y-3">
                {tramites.map((tramite) => (
                  <div
                    key={tramite.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#D7DCE1] bg-[#ffffff] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-[#238A55]">{tramite.code}</p>
                      <p className="text-lg font-bold text-[#07073b]">{tramite.project_name}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-[#07073b]">
                        <span className="flex items-center gap-1">
                          <UserCircle className="h-4 w-4 text-[#238A55]" />
                          {tramite.client_name || 'Cliente N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-[#238A55]" />
                          {tramite.property_name || 'Inmueble N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-[#238A55]" />
                          {tramite.location || 'Ubicacion N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClipboardList className="h-4 w-4 text-[#238A55]" />
                          Fecha de vencimiento: {formatDate(tramite.due_date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusBadges[tramite.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusLabel(tramite.status)}
                      </span>

                      <Link
                        to={`/tramites/${tramite.id}/tareas`}
                        className="rounded-lg border border-[#07073b] px-4 py-2 font-semibold text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
                      >
                        Ver tareas
                      </Link>

                      <button
                        onClick={() => startEdit(tramite)}
                        className="rounded-lg border border-[#238A55] px-4 py-2 font-semibold text-[#238A55] transition hover:bg-[#E9F3EE]"
                      >
                        Editar
                      </button>

                      {canCreateOrDelete && (
                        <button
                          onClick={async () => {
                            if (!window.confirm('Eliminar este tramite?')) return;

                            try {
                              setDeletingId(tramite.id);
                              await tramitesApi.delete(tramite.id);
                              setTramites((prev) => prev.filter((item) => item.id !== tramite.id));
                            } catch {
                              alert('No se pudo eliminar el tramite');
                            } finally {
                              setDeletingId(null);
                            }
                          }}
                          disabled={deletingId === tramite.id}
                          className="rounded-lg border border-red-500 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === tramite.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {pagination.lastPage > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="text-sm text-[#5F6B76]">
                      Pagina {currentPage} de {pagination.lastPage}. {pagination.total} tramite(s).
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#D7DCE1] px-3 py-2 font-semibold text-[#07073b] transition hover:bg-[#F4F5F6] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.min(pagination.lastPage, page + 1))}
                        disabled={currentPage === pagination.lastPage}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#D7DCE1] px-3 py-2 font-semibold text-[#07073b] transition hover:bg-[#F4F5F6] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#07073b]">Editar tramite</h3>
              <button onClick={() => setEditing(null)} className="text-[#5F6B76] hover:text-[#07073b]">
                x
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Codigo actual</label>
                <div className="rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 font-semibold text-[#07073b]">
                  {editing.code || 'Se generara automaticamente'}
                </div>
                <p className="mt-1 text-xs text-[#5F6B76]">
                  Solo cambia si reasignas el tramite a otro tipo.
                </p>
              </div>

              <div>
                <label className={labelClass}>Tipo</label>
                <select
                  className={inputClass}
                  value={editing.tramite_type_id}
                  onChange={(e) => setEditing({ ...editing, tramite_type_id: e.target.value })}
                >
                  <option value="">Seleccione</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.code} - {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Cliente registrado (opcional)</label>
                <select
                  className={inputClass}
                  value={editing.client_id || ''}
                  onChange={(e) => {
                    const selectedClient = clients.find((client) => String(client.id) === e.target.value);
                    setEditing({
                      ...editing,
                      client_id: e.target.value,
                      client_name: selectedClient?.name || editing.client_name,
                    });
                  }}
                >
                  <option value="">Sin cuenta vinculada</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Cliente</label>
                <input
                  className={inputClass}
                  value={editing.client_name || ''}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                  onBlur={() => setEditing((prev) => ({ ...prev, client_name: toTitleCase(prev.client_name) }))}
                />
              </div>

              <div>
                <label className={labelClass}>Nombre del tramite</label>
                <input
                  className={inputClass}
                  value={editing.project_name || ''}
                  onChange={(e) => setEditing({ ...editing, project_name: e.target.value })}
                  onBlur={() => setEditing((prev) => ({ ...prev, project_name: normalizeSentence(prev.project_name) }))}
                  list="edit-tramite-name-suggestions"
                />
                <datalist id="edit-tramite-name-suggestions">
                  {TRAMITE_NAME_SUGGESTIONS.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className={labelClass}>Inmueble / establecimiento (opcional)</label>
                <input
                  className={inputClass}
                  value={editing.property_name || ''}
                  onChange={(e) => setEditing({ ...editing, property_name: e.target.value })}
                  onBlur={() => setEditing((prev) => ({ ...prev, property_name: toTitleCase(prev.property_name) }))}
                />
              </div>

              <div>
                <label className={labelClass}>Departamento</label>
                <select
                  className={inputClass}
                  value={editing.location_department || ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      location_department: e.target.value,
                    })
                  }
                >
                  <option value="">Selecciona un departamento</option>
                  {PERU_DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Provincia</label>
                <input
                  className={inputClass}
                  value={editing.location_province || ''}
                  onChange={(e) => setEditing({ ...editing, location_province: e.target.value })}
                  onBlur={() => setEditing((prev) => ({ ...prev, location_province: toTitleCase(prev.location_province) }))}
                  list="edit-tramite-province-suggestions"
                />
                <datalist id="edit-tramite-province-suggestions">
                  {(LOCATION_SUGGESTIONS[editing.location_department]?.provinces || []).map((province) => (
                    <option key={province} value={province} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className={labelClass}>Distrito</label>
                <input
                  className={inputClass}
                  value={editing.location_district || ''}
                  onChange={(e) => setEditing({ ...editing, location_district: e.target.value })}
                  onBlur={() => setEditing((prev) => ({ ...prev, location_district: toTitleCase(prev.location_district) }))}
                  list="edit-tramite-district-suggestions"
                />
                <datalist id="edit-tramite-district-suggestions">
                  {(LOCATION_SUGGESTIONS[editing.location_department]?.districts || []).map((district) => (
                    <option key={district} value={district} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className={labelClass}>Fecha de vencimiento</label>
                <input
                  type="date"
                  className={inputClass}
                  value={editing.due_date || ''}
                  onChange={(e) => setEditing({ ...editing, due_date: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Responsable</label>
                <select
                  className={inputClass}
                  value={editing.responsible_id || ''}
                  onChange={(e) => setEditing({ ...editing, responsible_id: e.target.value })}
                >
                  <option value="">Sin responsable</option>
                  {responsables.map((responsable) => (
                    <option key={responsable.id} value={responsable.id}>
                      {responsable.name} ({responsable.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Estado</label>
                <select
                  className={inputClass}
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En proceso</option>
                  <option value="observed">Observado</option>
                  <option value="completed">Finalizado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg border border-[#D7DCE1] px-4 py-2 text-[#5F6B76]"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!hasCompleteLocation(editing)) {
                    alert('Completa departamento, provincia y distrito del tramite.');
                    return;
                  }

                  try {
                    setUpdating(true);

                    const payload = buildPayload(editing);

                    const { data } = await tramitesApi.update(editing.id, payload);
                    setTramites((prev) =>
                      prev.map((tramite) =>
                        tramite.id === editing.id
                          ? { ...tramite, ...data }
                          : tramite
                      )
                    );
                    setEditing(null);
	                  } catch {
	                    alert('No se pudo actualizar el tramite');
	                  } finally {
                    setUpdating(false);
                  }
                }}
                disabled={updating}
                className="rounded-lg bg-gradient-primary px-5 py-2 font-bold text-white shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {updating ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const buildLocation = (values) => {
  const parts = [
    toTitleCase(values.location_district),
    toTitleCase(values.location_province),
    toTitleCase(values.location_department),
  ].filter(Boolean);

  return parts.length ? parts.join(', ') : null;
};

const hasCompleteLocation = (values) =>
  Boolean(
    values.location_department?.trim() &&
      values.location_province?.trim() &&
      values.location_district?.trim()
  );

const buildTramiteCodeSuggestion = (types, typeId) => {
  const type = types.find((item) => String(item.id) === String(typeId));
  const base = type?.code || 'TR';
  const year = new Date().getFullYear();
  return `${base}-${year}-001`;
};

const buildPayload = (values) => ({
  tramite_type_id: values.tramite_type_id,
  client_id: values.client_id || null,
  client_name: toTitleCase(values.client_name),
  project_name: normalizeSentence(values.project_name),
  property_name: toTitleCase(values.property_name),
  location: buildLocation(values),
  due_date: values.due_date || null,
  responsible_id: values.responsible_id || null,
  status: values.status,
});

const parseLocation = (value) => {
  if (!value) {
    return {
      location_department: '',
      location_province: '',
      location_district: '',
    };
  }

  const parts = String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    return {
      location_district: parts[0],
      location_province: parts[1],
      location_department: parts.slice(2).join(', '),
    };
  }

  if (parts.length === 2) {
    return {
      location_district: '',
      location_province: parts[0],
      location_department: parts[1],
    };
  }

  return {
    location_district: '',
    location_province: '',
    location_department: parts[0] || '',
  };
};

const statusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'in_progress':
      return 'En proceso';
    case 'observed':
      return 'Observado';
    case 'completed':
      return 'Finalizado';
    default:
      return status;
  }
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';

  const fixed = typeof value === 'string' ? value.replace(/\.\d+Z$/, 'Z') : value;
  const date = new Date(fixed);

  if (Number.isNaN(date.getTime())) return value;

  try {
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Lima',
    });
  } catch {
    return value;
  }
};

export default TramitesByClientPage;
