import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, ClipboardList, MapPin, UserCircle, Search, Filter } from 'lucide-react';
import { tramitesApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { isStaff, ROLES } from '../../../shared/constants/roles';
import AdminPanelBackButton from '../../../shared/components/AdminPanelBackButton';

const ITEMS_PER_PAGE = 8;

const ControlBoardPage = () => {
  const { user } = useAuthStore();
  const [rows, setRows] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [noteDrafts, setNoteDrafts] = useState({});
  const [dueDrafts, setDueDrafts] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data } = await tramitesApi.overview();
      setRows(data);
      setNoteDrafts(Object.fromEntries(data.map((row) => [row.id, row.notes || ''])));
      setDueDrafts(Object.fromEntries(data.map((row) => [row.id, row.due_date || ''])));
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la vista general.');
    } finally {
      setLoading(false);
    }
  };

  const canEditNotes = user && user.role !== ROLES.OPERATOR;

  const filteredRows = rows.filter((row) => {
    const text = `${row.code || ''} ${row.client || ''} ${row.project || ''} ${row.responsible || ''} ${row.current_phase || ''}`.toLowerCase();
    const matchesSearch = search ? text.includes(search.toLowerCase()) : true;
    const matchesStatus = statusFilter === 'all' ? true : row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, rows.length]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const paginatedRows = filteredRows.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (!isStaff(user?.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] font-semibold text-[#07073b]">
        Solo el equipo interno puede ver la vista de control.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-[#1fb74d]" />
            <div>
              <h1 className="text-3xl font-black text-[#07073b]">Vista General de Control</h1>
              <p className="text-[#65647a]">Monitor de todos los clientes y tramites en tiempo real.</p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap xl:justify-end">
            <AdminPanelBackButton />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#dfe2ea] bg-white px-4 py-3 text-sm text-[#07073b] shadow-sm">
          <span className="text-xs font-semibold uppercase text-[#65647a]">Leyenda SLA:</span>
          <SlaBadge sla="green" /> <span>En tiempo</span>
          <SlaBadge sla="yellow" /> <span>Proximo a vencer (3 dias o menos)</span>
          <SlaBadge sla="red" /> <span>Vencido</span>
          <SlaBadge sla="none" /> <span>Sin fecha</span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-[#dfe2ea] bg-white p-4 shadow-sm lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 font-semibold text-[#07073b]">
            <Filter className="h-4 w-4 text-[#1fb74d]" />
            Filtros
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#65647a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, cliente, proyecto, responsable o fase"
              className="w-full rounded-xl border border-[#dfe2ea] bg-[#f3f4f6] py-2 pl-10 pr-4 outline-none focus:border-[#1fb74d] focus:ring-2 focus:ring-[#9be2ad]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#dfe2ea] bg-[#f3f4f6] px-4 py-2 outline-none focus:border-[#1fb74d] focus:ring-2 focus:ring-[#9be2ad]"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En proceso</option>
            <option value="observed">Observado</option>
            <option value="completed">Finalizado</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#dfe2ea] bg-white shadow-lg">
          <div className="grid grid-cols-10 bg-[#07073b] text-xs font-semibold uppercase tracking-wide text-white">
            <div className="p-3">Codigo</div>
            <div className="col-span-2 p-3">Cliente</div>
            <div className="col-span-2 p-3">Proyecto / Tramite</div>
            <div className="p-3">Responsable</div>
            <div className="p-3">Fase actual</div>
            <div className="p-3">Fecha de registro</div>
            <div className="p-3">Fecha de vencimiento</div>
            <div className="p-3 text-center">Estado</div>
          </div>

          {loading ? (
            <div className="p-6 text-[#65647a]">Cargando...</div>
          ) : filteredRows.length === 0 ? (
            <div className="p-6 text-[#65647a]">No hay trámites que coincidan con el filtro actual.</div>
          ) : (
            paginatedRows.map((row) => (
              <div key={row.id} className="border-t border-[#dfe2ea]">
                <button
                  className="grid w-full grid-cols-10 text-left transition hover:bg-[#ffffff]"
                  onClick={() => setOpenId(openId === row.id ? null : row.id)}
                >
                  <div className="flex items-center gap-2 p-3 font-semibold text-[#07073b]">
                    <span>{row.code}</span>
                    {openId === row.id ? (
                      <ChevronUp className="h-4 w-4 text-[#1fb74d]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#1fb74d]" />
                    )}
                  </div>
                  <div className="col-span-2 p-3 text-[#07073b]">{row.client || 'N/D'}</div>
                  <div className="col-span-2 p-3 text-[#07073b]">{row.project}</div>
                  <div className="p-3 text-[#07073b]">{row.responsible || 'Sin asignar'}</div>
                  <div className="p-3 text-[#07073b]">{row.current_phase || '-'}</div>
                  <div className="p-3 text-[#07073b]">{row.registered_at || '-'}</div>
                  <div className="p-3 text-[#07073b]">{row.due_date || 'Sin fecha'}</div>
                  <div className="flex items-center justify-center p-3">
                    <StatusBadge status={row.status} />
                  </div>
                </button>

                {openId === row.id && (
                  <div className="grid grid-cols-1 gap-3 border-t border-[#dfe2ea] bg-[#ffffff] px-4 py-4 md:grid-cols-3">
                    <div className="flex items-start gap-2 text-[#07073b]">
                      <UserCircle className="h-5 w-5 text-[#1fb74d]" />
                      <div>
                        <p className="text-xs uppercase text-[#65647a]">Responsable</p>
                        <p className="font-semibold">{row.responsible || 'Sin asignar'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-[#07073b]">
                      <MapPin className="h-5 w-5 text-[#1fb74d]" />
                      <div>
                        <p className="text-xs uppercase text-[#65647a]">Ubicacion</p>
                        <p className="font-semibold">{row.location || 'No definida'}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-[#65647a]">Observaciones</p>
                      {canEditNotes ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full rounded-lg border border-[#dfe2ea] px-3 py-2 text-sm"
                            value={noteDrafts[row.id] || ''}
                            onChange={(e) =>
                              setNoteDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))
                            }
                          />

                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-[#07073b]">Vence</span>
                            <input
                              type="date"
                              className="rounded-lg border border-[#dfe2ea] px-3 py-2"
                              value={dueDrafts[row.id] || ''}
                              onChange={(e) =>
                                setDueDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))
                              }
                            />
                          </div>

                          <button
                            disabled={savingNoteId === row.id}
                            onClick={async () => {
                              try {
                                setSavingNoteId(row.id);
                                await tramitesApi.updateNotes(row.id, {
                                  notes: noteDrafts[row.id],
                                  due_date: dueDrafts[row.id] || null,
                                });
                                await loadData();
                              } catch (error) {
                                console.error(error);
                                alert('No se pudo guardar la nota');
                              } finally {
                                setSavingNoteId(null);
                              }
                            }}
                            className="rounded-lg border border-[#07073b] px-3 py-2 font-semibold text-[#07073b] transition hover:bg-[#07073b] hover:text-white disabled:opacity-50"
                          >
                            {savingNoteId === row.id ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line font-semibold text-[#07073b]">
                          {row.notes || '-'}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-3 rounded-xl border border-[#dfe2ea] bg-white p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-sm font-semibold text-[#07073b]">
                          Fases: {row.phases_progress?.completed || 0}/{row.phases_progress?.total || 0}
                        </div>
                        <div className="text-sm font-semibold text-[#07073b]">
                          Subfases: {row.subphases_progress?.completed || 0}/{row.subphases_progress?.total || 0}
                        </div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#dfe2ea]">
                          <div
                            className="h-full bg-[#1fb74d]"
                            style={{ width: `${row.progress_percent || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#07073b]">
                          {row.progress_percent || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#07073b]">SLA</span>
                        <SlaBadge sla={row.sla} />
                      </div>
                      <div className="text-sm font-semibold text-[#07073b]">
                        Tareas: {row.tasks_done}/{row.tasks_total} ({row.tasks_progress}%)
                      </div>
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-3">
                      <a
                        href={`/tramites/${row.id}/detalle`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#07073b] px-4 py-2 font-semibold text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
                      >
                        Ver fases
                      </a>
                      <a
                        href={`/tramites/${row.id}/tareas`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#07073b] px-4 py-2 font-semibold text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
                      >
                        Ver tareas
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {!loading && filteredRows.length > 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-[#dfe2ea] bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#65647a]">
              Página <span className="font-bold text-[#07073b]">{currentPage}</span> de{' '}
              <span className="font-bold text-[#07073b]">{totalPages}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#dfe2ea] px-4 py-2 text-sm font-semibold text-[#07073b] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition ${
                    currentPage === page
                      ? 'bg-[#07073b] text-white shadow-md'
                      : 'border border-[#dfe2ea] text-[#07073b] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#dfe2ea] px-4 py-2 text-sm font-semibold text-[#07073b] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
    in_progress: { label: 'En proceso', className: 'bg-blue-100 text-blue-700' },
    observed: { label: 'Observado', className: 'bg-orange-100 text-orange-700' },
    completed: { label: 'Finalizado', className: 'bg-green-100 text-green-700' },
  };

  const data = map[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${data.className}`}>
      {data.label}
    </span>
  );
};

const SlaBadge = ({ sla }) => {
  const map = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    none: 'bg-gray-100 text-gray-700',
  };

  const labels = {
    green: 'En tiempo',
    yellow: 'Proximo a vencer',
    red: 'Vencido',
    none: 'Sin fecha',
  };

  const cls = map[sla] || map.none;

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {labels[sla] || labels.none}
    </span>
  );
};

export default ControlBoardPage;
