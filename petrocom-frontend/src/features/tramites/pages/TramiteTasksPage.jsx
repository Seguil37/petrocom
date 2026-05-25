import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, ClipboardCheck, Loader2, PlayCircle, Trash2 } from 'lucide-react';
import { tramitesApi, adminUsersApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../shared/constants/roles';
import AdminPanelBackButton from '../../../shared/components/AdminPanelBackButton';
import { normalizeSentence } from '../../../shared/utils/formNormalization';

const taskStatusOptions = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'in_progress', label: 'En proceso', color: 'bg-blue-100 text-blue-700' },
  { value: 'blocked', label: 'Bloqueado', color: 'bg-orange-100 text-orange-700' },
  { value: 'done', label: 'Completado', color: 'bg-green-100 text-green-700' },
];

const emptyForm = {
  title: '',
  description: '',
  tramite_phase_instance_id: '',
  tramite_subphase_instance_id: '',
  assigned_to: '',
  status: 'pending',
  progress: 0,
  due_date: '',
};

const syncStatusAndProgress = (status, progress) => {
  if (status === 'pending') return 0;
  if (status === 'done') return 100;
  if (status === 'in_progress') return Math.min(99, Math.max(1, Number(progress) || 1));
  if (status === 'blocked') return Math.min(99, Math.max(1, Number(progress) || 1));
  return Number(progress) || 0;
};

const TramiteTasksPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [tramite, setTramite] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const canCreate = useMemo(() => {
    if (!tramite || !user) return false;
    if ([ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(user.role)) return true;
    return String(tramite.responsible?.id) === String(user.id);
  }, [tramite, user]);

  const canViewStaff = useMemo(
    () => user && [ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR].includes(user.role),
    [user]
  );

  const currentStep = useMemo(() => getCurrentStep(tramite), [tramite]);
  const createSubphaseOptions = useMemo(
    () => getSubphaseOptions(tramite?.phases || [], form.tramite_phase_instance_id),
    [tramite, form.tramite_phase_instance_id]
  );

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!tramite) return;

    setForm((prev) => ({
      ...prev,
      tramite_phase_instance_id: prev.tramite_phase_instance_id || (currentStep.phase?.id ? String(currentStep.phase.id) : ''),
      tramite_subphase_instance_id:
        prev.tramite_subphase_instance_id || (currentStep.subphase?.id ? String(currentStep.subphase.id) : ''),
    }));
  }, [tramite, currentStep.phase?.id, currentStep.subphase?.id]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const promises = [tramitesApi.show(id), tramitesApi.listTasks(id)];
      if (canViewStaff) promises.push(adminUsersApi.list());

      const [tramiteRes, tasksRes, staffRes] = await Promise.all(promises);
      setTramite(tramiteRes.data);
      setTasks(tasksRes.data);

      if (canViewStaff && staffRes) {
        setStaff(staffRes.data?.data || staffRes.data || []);
      } else {
        setStaff([]);
      }
    } catch (requestError) {
      console.error(requestError);
      const status = requestError.response?.status;

      if (status === 403) {
        setError(
          'No tienes permiso para ver este tramite. Si eres operador, solo puedes ver tramites con tareas asignadas a ti.'
        );
      } else {
        setError('No se pudieron cargar las tareas del tramite.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = normalizeTaskPayload(form);
      await tramitesApi.createTask(id, payload);
      setForm({
        ...emptyForm,
        tramite_phase_instance_id: currentStep.phase?.id ? String(currentStep.phase.id) : '',
        tramite_subphase_instance_id: currentStep.subphase?.id ? String(currentStep.subphase.id) : '',
      });
      await loadData();
    } catch (requestError) {
      console.error(requestError);
      alert('No se pudo crear la tarea.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (taskId, payload) => {
    try {
      await tramitesApi.updateTask(id, taskId, payload);
      await loadData();
    } catch (requestError) {
      console.error(requestError);
      alert(requestError.response?.data?.message || 'No se pudo actualizar la tarea.');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('¿Eliminar esta tarea? Esta accion no se puede deshacer.')) return;

    try {
      await tramitesApi.deleteTask(id, taskId);
      await loadData();
    } catch (requestError) {
      console.error(requestError);
      alert(requestError.response?.data?.message || 'No se pudo eliminar la tarea.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#D7DCE1] bg-[#F4F5F6] px-4 py-2 text-[#07073b] outline-none placeholder-[#5F6B76] focus:border-[#238A55] focus:ring-2 focus:ring-[#A8D8BA]';
  const labelClass = 'mb-1 block text-sm font-semibold text-[#07073b]';
  const formProgressLocked = form.status === 'pending' || form.status === 'done';

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#238A55]">TRAMITE</p>
            <h1 className="text-3xl font-black text-[#07073b]">{tramite?.project_name || 'Cargando...'}</h1>
            <p className="text-sm text-[#5F6B76]">{tramite?.code}</p>
            {tramite && (
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-[#07073b] px-3 py-1 font-semibold text-white">
                  Fase actual: {currentStep.phase?.name || 'Sin fase'}
                </span>
                <span className="rounded-full bg-[#E9F3EE] px-3 py-1 font-semibold text-[#238A55]">
                  Subfase actual: {currentStep.subphase?.name || 'Sin subfase'}
                </span>
              </div>
            )}
          </div>

          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap xl:justify-end">
            <AdminPanelBackButton />
            <Link
              to="/tramites/control"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[#07073b] px-4 py-2 text-sm font-semibold leading-none text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
            >
              Volver a vista general
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-[#5F6B76]">Cargando...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-4 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-[#238A55]" />
                <h2 className="text-xl font-black text-[#07073b]">Tareas asignadas</h2>
              </div>

              {tasks.length === 0 ? (
                <div className="text-[#5F6B76]">Aun no hay tareas.</div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      inputClass={inputClass}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      isOperator={user?.role === ROLES.OPERATOR}
                      userId={user?.id}
                      staff={staff}
                      canManageAssignments={canCreate && canViewStaff}
                      canManageTaskPlanning={canCreate}
                      canDeleteTask={canCreate}
                      phases={tramite?.phases || []}
                    />
                  ))}
                </div>
              )}
            </div>

            {canCreate && (
              <div className="rounded-2xl border border-[#D7DCE1] bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-[#238A55]" />
                  <h3 className="text-lg font-black text-[#07073b]">Nueva tarea</h3>
                </div>

                <form onSubmit={handleCreate} className="space-y-3">
                  <div>
                    <label className={labelClass}>Titulo</label>
                    <input
                      className={inputClass}
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      onBlur={() => setForm((prev) => ({ ...prev, title: normalizeSentence(prev.title) }))}
                      placeholder="Ej: Desarrollo de planos arquitectonicos"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Descripcion</label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      onBlur={() => setForm((prev) => ({ ...prev, description: normalizeSentence(prev.description) }))}
                      placeholder="Detalla el entregable esperado y el alcance de esta tarea."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Fase</label>
                      <select
                        className={inputClass}
                        value={form.tramite_phase_instance_id}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            tramite_phase_instance_id: e.target.value,
                            tramite_subphase_instance_id: '',
                          })
                        }
                      >
                        <option value="">Sin fase</option>
                        {(tramite?.phases || []).map((phase) => (
                          <option key={phase.id} value={phase.id}>
                            {phase.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Subfase</label>
                      <select
                        className={inputClass}
                        value={form.tramite_subphase_instance_id}
                        onChange={(e) => setForm({ ...form, tramite_subphase_instance_id: e.target.value })}
                      >
                        <option value="">Sin subfase</option>
                        {createSubphaseOptions.map((subphase) => (
                          <option key={subphase.id} value={subphase.id}>
                            {subphase.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Asignar a (opcional)</label>
                    <select
                      className={inputClass}
                      value={form.assigned_to}
                      onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                    >
                      <option value="">Sin asignar</option>
                      {staff.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Estado</label>
                      <select
                        className={inputClass}
                        value={form.status}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            status: e.target.value,
                            progress: syncStatusAndProgress(e.target.value, prev.progress),
                          }))
                        }
                      >
                        {taskStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Progreso (%)</label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min={form.status === 'pending' ? 0 : 1}
                          max={form.status === 'done' ? 100 : 99}
                          step={1}
                          value={form.progress}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              progress: syncStatusAndProgress(prev.status, e.target.value),
                            }))
                          }
                          className="w-full accent-[#238A55]"
                          disabled={formProgressLocked}
                        />
                        <input
                          type="number"
                          min={form.status === 'pending' ? 0 : 1}
                          max={form.status === 'done' ? 100 : 99}
                          value={form.progress}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              progress: syncStatusAndProgress(prev.status, e.target.value),
                            }))
                          }
                          className={inputClass}
                          disabled={formProgressLocked}
                        />
                        <div className="text-xs font-semibold text-[#07073b]">
                          {form.status === 'pending' && 'Pendiente siempre usa 0%.'}
                          {form.status === 'done' && 'Completado siempre usa 100%.'}
                          {(form.status === 'in_progress' || form.status === 'blocked') &&
                            'En proceso y bloqueado permiten un avance entre 1% y 99%.'}
                        </div>
                        {(form.status === 'in_progress' || form.status === 'blocked') && (
                          <div className="flex flex-wrap gap-2">
                            {[10, 25, 50, 75].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                className="rounded-full border border-[#D7DCE1] px-3 py-1 text-xs font-semibold text-[#07073b] hover:border-[#238A55] hover:text-[#238A55]"
                                onClick={() => setForm((prev) => ({ ...prev, progress: preset }))}
                              >
                                {preset}%
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Fecha limite</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.due_date}
                      onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 font-bold text-white shadow-md transition hover:shadow-lg"
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    {saving ? 'Creando...' : 'Crear tarea'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({
  task,
  inputClass,
  onUpdate,
  onDelete,
  isOperator,
  userId,
  staff,
  canManageAssignments,
  canManageTaskPlanning,
  canDeleteTask,
  phases,
}) => {
  const isAssignedToCurrentUser = task.assignee?.id && userId && String(task.assignee.id) === String(userId);
  const canEditPlanningFields = canManageTaskPlanning;
  const canEditProgressFields = !isOperator || isAssignedToCurrentUser || canEditPlanningFields;
  const locked = !canEditProgressFields;
  const [local, setLocal] = useState({
    title: task.title || '',
    description: task.description || '',
    status: task.status,
    progress: task.progress,
    observations: task.observations || '',
    assigned_to: task.assignee?.id || '',
    due_date: task.due_date ? String(task.due_date).slice(0, 10) : '',
    tramite_phase_instance_id: task.phase?.id ? String(task.phase.id) : '',
    tramite_subphase_instance_id: task.subphase?.id ? String(task.subphase.id) : '',
  });
  const progressLocked = local.status === 'pending' || local.status === 'done';

  useEffect(() => {
    setLocal({
      title: task.title || '',
      description: task.description || '',
      status: task.status,
      progress: task.progress,
      observations: task.observations || '',
      assigned_to: task.assignee?.id || '',
      due_date: task.due_date ? String(task.due_date).slice(0, 10) : '',
      tramite_phase_instance_id: task.phase?.id ? String(task.phase.id) : '',
      tramite_subphase_instance_id: task.subphase?.id ? String(task.subphase.id) : '',
    });
  }, [task]);

  const handleSave = () => {
    const payload = normalizeTaskUpdatePayload(local, {
      includeProgress: canEditProgressFields,
      includePlanning: canEditPlanningFields,
      includeAssignment: canManageAssignments,
    });

    onUpdate(task.id, payload);
  };

  const handleChange = (field, value) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-2 rounded-xl border border-[#D7DCE1] bg-[#ffffff] p-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#238A55]">
            {task.phase?.name || 'Sin fase'}
            {task.subphase?.name ? ` / ${task.subphase.name}` : ''}
          </p>
          <p className="text-lg font-bold text-[#07073b]">{task.title}</p>
          <p className="text-sm text-[#5F6B76]">{task.description}</p>
        </div>

        <span className="rounded-full bg-[#07073b] px-3 py-1 text-xs font-semibold text-white">
          {task.assignee?.name || 'Sin asignar'}
        </span>
      </div>

      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
        {canEditPlanningFields && (
          <>
            <div>
              <label className="text-xs font-semibold text-[#07073b]">Titulo</label>
              <input
                className={inputClass}
                value={local.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleChange('title', normalizeSentence(local.title))}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#07073b]">Descripcion</label>
              <input
                className={inputClass}
                value={local.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleChange('description', normalizeSentence(local.description))}
                placeholder="Sin descripcion"
              />
            </div>
          </>
        )}

        <div>
          <label className="text-xs font-semibold text-[#07073b]">Estado</label>
          <select
            className={inputClass}
            value={local.status}
            onChange={(e) =>
              setLocal((prev) => ({
                ...prev,
                status: e.target.value,
                progress: syncStatusAndProgress(e.target.value, prev.progress),
              }))
            }
            disabled={locked}
          >
            {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              taskStatusOptions.find((item) => item.value === local.status)?.color || 'bg-gray-100 text-gray-700'
            }`}
          >
            {taskStatusOptions.find((item) => item.value === local.status)?.label || local.status}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#07073b]">Progreso</label>
          <div className="space-y-2">
            <input
              type="range"
              min={local.status === 'pending' ? 0 : 1}
              max={local.status === 'done' ? 100 : 99}
              step={1}
              className="w-full accent-[#238A55]"
              value={local.progress}
              onChange={(e) => handleChange('progress', syncStatusAndProgress(local.status, e.target.value))}
              disabled={locked || progressLocked}
            />
            <input
              type="number"
              min={local.status === 'pending' ? 0 : 1}
              max={local.status === 'done' ? 100 : 99}
              className={inputClass}
              value={local.progress}
              onChange={(e) => handleChange('progress', syncStatusAndProgress(local.status, e.target.value))}
              disabled={locked || progressLocked}
            />
            <div className="text-xs font-semibold text-[#07073b]">
              {local.status === 'pending' && 'Pendiente siempre usa 0%.'}
              {local.status === 'done' && 'Completado siempre usa 100%.'}
              {(local.status === 'in_progress' || local.status === 'blocked') &&
                'En proceso y bloqueado permiten un avance entre 1% y 99%.'}
            </div>
            {(local.status === 'in_progress' || local.status === 'blocked') && (
              <div className="flex flex-wrap gap-2">
                {[10, 25, 50, 75].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="rounded-full border border-[#D7DCE1] px-3 py-1 text-xs font-semibold text-[#07073b] hover:border-[#238A55] hover:text-[#238A55] disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleChange('progress', preset)}
                    disabled={!canEditProgressFields}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#07073b]">Observaciones de avance</label>
          <input
            className={inputClass}
            value={local.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            placeholder="Ej: Planos preliminares listos, falta revision estructural."
            disabled={locked}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#07073b]">Fase</label>
          <select
            className={inputClass}
            value={local.tramite_phase_instance_id}
            onChange={(e) =>
              setLocal((prev) => ({
                ...prev,
                tramite_phase_instance_id: e.target.value,
                tramite_subphase_instance_id: '',
              }))
            }
            disabled={!canEditPlanningFields}
          >
            <option value="">Sin fase</option>
            {phases.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#07073b]">Subfase</label>
          <select
            className={inputClass}
            value={local.tramite_subphase_instance_id}
            onChange={(e) => handleChange('tramite_subphase_instance_id', e.target.value)}
            disabled={!canEditPlanningFields}
          >
            <option value="">Sin subfase</option>
            {getSubphaseOptions(phases, local.tramite_phase_instance_id).map((subphase) => (
              <option key={subphase.id} value={subphase.id}>
                {subphase.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#07073b]">Fecha limite</label>
          <input
            type="date"
            className={inputClass}
            value={local.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
            disabled={!canEditPlanningFields}
            readOnly={!canEditPlanningFields}
          />
        </div>

        {canManageAssignments && (
          <div>
            <label className="text-xs font-semibold text-[#07073b]">Asignado a</label>
            <select
              className={inputClass}
              value={local.assigned_to}
              onChange={(e) => handleChange('assigned_to', e.target.value)}
            >
              <option value="">Sin asignar</option>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.role})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {task.status === 'blocked' && (
        <div className="flex items-center gap-2 text-sm text-orange-600">
          <AlertCircle className="h-4 w-4" /> Esta tarea esta bloqueada, agrega observaciones.
        </div>
      )}

      {(canEditProgressFields || canEditPlanningFields) && (
        <div className="flex flex-wrap justify-end gap-2">
          {canDeleteTask && (
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg border border-[#07073b] px-4 py-2 font-semibold text-[#07073b] transition hover:bg-[#07073b] hover:text-white"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
};

const normalizeTaskPayload = (values) => ({
  title: normalizeSentence(values.title),
  description: normalizeSentence(values.description) || null,
  tramite_phase_instance_id: values.tramite_phase_instance_id ? Number(values.tramite_phase_instance_id) : null,
  tramite_subphase_instance_id: values.tramite_subphase_instance_id ? Number(values.tramite_subphase_instance_id) : null,
  assigned_to: values.assigned_to ? Number(values.assigned_to) : null,
  status: values.status,
  progress: Number(values.progress) || 0,
  due_date: values.due_date || null,
  observations: values.observations || null,
});

const normalizeTaskUpdatePayload = (values, options = {}) => {
  const payload = {};

  if (options.includeProgress) {
    payload.status = values.status;
    payload.progress = Number(values.progress) || 0;
    payload.observations = values.observations || null;
  }

  if (options.includePlanning) {
    payload.title = normalizeSentence(values.title);
    payload.description = normalizeSentence(values.description) || null;
    payload.tramite_phase_instance_id = values.tramite_phase_instance_id
      ? Number(values.tramite_phase_instance_id)
      : null;
    payload.tramite_subphase_instance_id = values.tramite_subphase_instance_id
      ? Number(values.tramite_subphase_instance_id)
      : null;
    payload.due_date = values.due_date || null;
  }

  if (options.includeAssignment) {
    payload.assigned_to = values.assigned_to ? Number(values.assigned_to) : null;
  }

  return payload;
};

const getSubphaseOptions = (phases, phaseId) => {
  if (!phaseId) return [];
  const phase = phases.find((item) => String(item.id) === String(phaseId));
  return phase?.subphases || [];
};

const getCurrentStep = (tramite) => {
  const phases = tramite?.phases || [];
  const phase = phases.find((item) => item.status !== 'completed') || phases[phases.length - 1] || null;
  const subphases = phase?.subphases || [];
  const subphase = subphases.find((item) => item.status !== 'completed') || subphases[subphases.length - 1] || null;
  return { phase, subphase };
};

export default TramiteTasksPage;
