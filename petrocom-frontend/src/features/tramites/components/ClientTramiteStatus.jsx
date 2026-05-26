import { createElement } from 'react';
import { CalendarDays, CheckCircle2, CircleDashed, ClipboardList, Clock3, FileText, MapPin } from 'lucide-react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  observed: 'bg-orange-100 text-orange-800 border-orange-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  blocked: 'bg-orange-100 text-orange-800 border-orange-200',
  done: 'bg-green-100 text-green-800 border-green-200',
};

const ClientTramiteStatus = ({ tramite, compact = false }) => {
  if (!tramite) return null;

  const phases = tramite.phases || [];
  const tasks = tramite.tasks_summary || {};

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#D7DCE1] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase text-[#238A55]">Codigo {tramite.code}</p>
            <h2 className="mt-1 text-2xl font-black text-[#07073b]">{tramite.project_name || tramite.type?.name || 'Tramite'}</h2>
            <p className="mt-1 text-sm text-[#5F6B76]">
              {tramite.client_name || 'Cliente'}{tramite.property_name ? ` - ${tramite.property_name}` : ''}
            </p>
          </div>
          <span className={`w-fit rounded-full border px-3 py-1 text-sm font-bold ${statusStyles[tramite.status] || statusStyles.pending}`}>
            {tramite.status_label || 'Pendiente'}
          </span>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#07073b]">
            <span>Avance general</span>
            <span>{tramite.progress || 0}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#D7DCE1]">
            <div
              className="h-full rounded-full bg-[#238A55] transition-all"
              style={{ width: `${Math.max(0, Math.min(100, tramite.progress || 0))}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoItem icon={ClipboardList} label="Tipo de servicio" value={tramite.type?.name || 'Tramite tecnico'} />
          <InfoItem icon={FileText} label="Marco de gestion" value={tramite.entity || 'Normativa aplicable'} />
          <InfoItem icon={CalendarDays} label="Fecha de inicio" value={formatDate(tramite.registered_at)} />
          <InfoItem icon={Clock3} label="Fecha objetivo" value={formatDate(tramite.due_date)} />
          <InfoItem icon={MapPin} label="Ubicacion" value={tramite.location || 'No registrada'} />
          <InfoItem icon={ClipboardList} label="Etapa actual" value={tramite.current_subphase?.name || tramite.current_phase?.name || 'Por iniciar'} />
          <InfoItem icon={CheckCircle2} label="Responsable" value={tramite.responsible_name || 'Equipo PETROCOM'} />
          <InfoItem icon={Clock3} label="Ultima actualizacion" value={formatDateTime(tramite.last_update_at)} />
        </div>

        <div className="mt-5 rounded-lg border border-[#D7DCE1] bg-[#F4F5F6] p-4">
          <p className="text-xs font-black uppercase text-[#238A55]">Proxima accion</p>
          <p className="mt-1 text-sm font-semibold text-[#07073b]">{tramite.next_action}</p>
          <p className="mt-2 text-xs text-[#5F6B76]">Ultima actualizacion: {formatDateTime(tramite.last_update_at)}</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InfoList title="Documentos pendientes" items={tramite.pending_documents} empty="No hay documentos pendientes visibles." />
          <InfoList title="Observaciones" items={tramite.observations} empty="No hay observaciones registradas." />
        </div>
      </section>

      {!compact && (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-lg border border-[#D7DCE1] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CircleDashed className="h-5 w-5 text-[#238A55]" />
              <h3 className="text-lg font-black text-[#07073b]">Etapas del tramite</h3>
            </div>

            {phases.length === 0 ? (
              <p className="text-sm text-[#5F6B76]">Aun no hay etapas configuradas.</p>
            ) : (
              <div className="space-y-3">
                {phases.map((phase) => (
                  <div key={phase.id} className="rounded-lg border border-[#D7DCE1] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-black text-[#07073b]">{phase.name}</p>
                        <p className="text-xs text-[#5F6B76]">Avance de etapa: {phase.progress || 0}%</p>
                      </div>
                      <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[phase.status] || statusStyles.pending}`}>
                        {phase.status_label}
                      </span>
                    </div>
                    {phase.subphases?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {phase.subphases.map((subphase) => (
                          <div key={subphase.id} className="flex items-center justify-between gap-3 rounded-md bg-[#F4F5F6] px-3 py-2">
                            <span className="text-sm font-semibold text-[#07073b]">{subphase.name}</span>
                            <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-bold ${statusStyles[subphase.status] || statusStyles.pending}`}>
                              {subphase.status_label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-[#D7DCE1] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#238A55]" />
                <h3 className="text-lg font-black text-[#07073b]">Tareas del equipo</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <Metric label="Total" value={tasks.total || 0} />
                <Metric label="Completadas" value={tasks.done || 0} />
                <Metric label="En proceso" value={tasks.in_progress || 0} />
                <Metric label="Observadas" value={tasks.blocked || 0} />
              </div>
            </div>

            <div className="rounded-lg border border-[#D7DCE1] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#238A55]" />
                <h3 className="text-lg font-black text-[#07073b]">Actividad reciente</h3>
              </div>
              {tramite.recent_activity?.length ? (
                <div className="space-y-3">
                  {tramite.recent_activity.map((item, index) => (
                    <div key={`${item.type}-${item.title}-${index}`} className="border-b border-[#D7DCE1] pb-3 last:border-b-0 last:pb-0">
                      <p className="text-sm font-bold text-[#07073b]">{item.title}</p>
                      <p className="text-xs text-[#5F6B76]">{item.status_label} - {formatDateTime(item.date)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#5F6B76]">Aun no hay movimientos visibles.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ClientTramiteStatus;

const InfoItem = ({ icon, label, value }) => (
  <div className="rounded-lg border border-[#D7DCE1] bg-[#ffffff] p-3">
    {createElement(icon, { className: 'mb-2 h-4 w-4 text-[#238A55]' })}
    <p className="text-xs font-bold uppercase text-[#5F6B76]">{label}</p>
    <p className="mt-1 text-sm font-black text-[#07073b]">{value}</p>
  </div>
);

const Metric = ({ label, value }) => (
  <div className="rounded-lg bg-[#F4F5F6] p-3">
    <p className="text-2xl font-black text-[#07073b]">{value}</p>
    <p className="text-xs font-bold uppercase text-[#5F6B76]">{label}</p>
  </div>
);

const InfoList = ({ title, items = [], empty }) => (
  <div className="rounded-lg border border-[#D7DCE1] bg-[#ffffff] p-4">
    <p className="text-xs font-black uppercase text-[#238A55]">{title}</p>
    {items.length ? (
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-[#F4F5F6] px-3 py-2 text-sm font-semibold text-[#07073b]">
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-[#5F6B76]">{empty}</p>
    )}
  </div>
);

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const date = parseDate(value);
  return date.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const formatDateTime = (value) => {
  if (!value) return 'Sin registro';
  return new Date(value).toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const parseDate = (value) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
};
