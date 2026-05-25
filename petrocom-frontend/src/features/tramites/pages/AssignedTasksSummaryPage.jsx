import { createElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Filter, UserCircle2, Building2, CircleDashed } from 'lucide-react';
import { tramitesApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { ROLES, roleLabels } from '../../../shared/constants/roles';
import AdminPanelBackButton from '../../../shared/components/AdminPanelBackButton';

const statusMeta = {
  pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
  in_progress: { label: 'En proceso', className: 'bg-blue-100 text-blue-700' },
  blocked: { label: 'Bloqueada', className: 'bg-orange-100 text-orange-700' },
  done: { label: 'Completada', className: 'bg-green-100 text-green-700' },
};

const ITEMS_PER_PAGE = 8;

const AssignedTasksSummaryPage = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data } = await tramitesApi.assignedTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar el resumen de tareas.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' ? true : task.status === statusFilter;
      const text = `${task.title} ${task.tramite?.project_name || ''} ${task.tramite?.code || ''} ${task.assigned_to?.name || ''}`;
      const matchesSearch = search
        ? text.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, search, tasks.length]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / ITEMS_PER_PAGE));
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTasks, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    inProgress: tasks.filter((task) => task.status === 'in_progress').length,
    blocked: tasks.filter((task) => task.status === 'blocked').length,
    done: tasks.filter((task) => task.status === 'done').length,
  }), [tasks]);

  const title =
    user?.role === ROLES.OPERATOR ? 'Mis tareas asignadas' : 'Resumen de tareas asignadas';

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-3">
            <ClipboardList className="w-6 h-6 text-[#1fb74d] mt-1" />
            <div>
              <h1 className="text-3xl font-black text-[#07073b]">{title}</h1>
              <p className="text-[#65647a]">
                {user?.role === ROLES.OPERATOR
                  ? 'Vista de todas las tareas asignadas a tu usuario.'
                  : 'Vista centralizada de tareas por usuario, proyecto y trámite.'}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap xl:justify-end">
            <AdminPanelBackButton />
            <Link
              to="/tramites/control"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#07073b] px-4 py-2 text-sm font-semibold leading-none text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
            >
              Volver a control
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Pendientes" value={stats.pending} accent="text-yellow-700" />
          <StatCard label="En proceso" value={stats.inProgress} accent="text-blue-700" />
          <StatCard label="Bloqueadas" value={stats.blocked} accent="text-orange-700" />
          <StatCard label="Completadas" value={stats.done} accent="text-green-700" />
        </div>

        <div className="bg-white border border-[#dfe2ea] rounded-2xl shadow-lg p-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-[#07073b] font-semibold">
            <Filter className="w-4 h-4 text-[#1fb74d]" />
            Filtros
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por tarea, trámite, proyecto o usuario"
            className="flex-1 px-4 py-2 rounded-xl border border-[#dfe2ea] bg-[#f3f4f6] outline-none focus:border-[#1fb74d] focus:ring-2 focus:ring-[#9be2ad]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#dfe2ea] bg-[#f3f4f6] outline-none focus:border-[#1fb74d] focus:ring-2 focus:ring-[#9be2ad]"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En proceso</option>
            <option value="blocked">Bloqueada</option>
            <option value="done">Completada</option>
          </select>
        </div>

        <div className="bg-white border border-[#dfe2ea] rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-[#65647a]">Cargando...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-[#65647a]">No hay tareas que coincidan con el filtro actual.</div>
          ) : (
            <div className="divide-y divide-[#dfe2ea]">
              {paginatedTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-[#ffffff] transition">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta[task.status]?.className || 'bg-gray-100 text-gray-700'}`}>
                          {statusMeta[task.status]?.label || task.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#07073b] text-white">
                          {task.progress || 0}%
                        </span>
                        <span className="text-xs font-semibold text-[#65647a]">
                          {task.tramite?.code || 'Sin código'}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#07073b]">{task.title}</h2>
                        <p className="text-sm text-[#65647a]">{task.description || 'Sin descripción'}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <InfoLine icon={Building2} label="Proyecto" value={task.tramite?.project_name || 'Sin proyecto'} />
                        <InfoLine icon={UserCircle2} label="Asignado a" value={task.assigned_to?.name || 'Sin asignar'} />
                        <InfoLine icon={CircleDashed} label="Rol" value={task.assigned_to?.role ? (roleLabels[task.assigned_to.role] || task.assigned_to.role) : 'Sin rol'} />
                        <InfoLine icon={ClipboardList} label="Fase" value={task.phase?.name || task.subphase?.name || 'Sin fase'} />
                      </div>
                      {task.observations && (
                        <div className="rounded-xl border border-[#dfe2ea] bg-[#f3f4f6] px-3 py-2 text-sm text-[#454546]">
                          <span className="font-semibold text-[#07073b]">Observaciones:</span> {task.observations}
                        </div>
                      )}
                    </div>

                    <div className="min-w-[220px] space-y-2 lg:text-right">
                      <p className="text-sm text-[#07073b]">
                        <span className="font-semibold">Responsable del trámite:</span> {task.tramite?.responsible || 'Sin asignar'}
                      </p>
                      <p className="text-sm text-[#07073b]">
                        <span className="font-semibold">Vence tarea:</span> {formatDate(task.due_date)}
                      </p>
                      <p className="text-sm text-[#07073b]">
                        <span className="font-semibold">Vence trámite:</span> {formatDate(task.tramite?.due_date)}
                      </p>
                      <div className="pt-2">
                        <Link
                          to={`/tramites/${task.tramite?.id}/tareas`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#07073b] text-[#07073b] font-semibold hover:bg-[#07073b] hover:text-white transition"
                        >
                          Ver trámite
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && filteredTasks.length > 0 && (
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

const StatCard = ({ label, value, accent = 'text-[#07073b]' }) => (
  <div className="bg-white border border-[#dfe2ea] rounded-2xl shadow-sm p-4">
    <p className="text-xs uppercase tracking-wide text-[#65647a] font-semibold">{label}</p>
    <p className={`mt-1 text-2xl font-black ${accent}`}>{value}</p>
  </div>
);

const InfoLine = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-[#07073b]">
    {createElement(icon, { className: 'w-4 h-4 text-[#1fb74d]' })}
    <span className="font-semibold">{label}:</span>
    <span>{value}</span>
  </div>
);

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  return value;
};

export default AssignedTasksSummaryPage;
