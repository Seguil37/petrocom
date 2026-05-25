import { useEffect, useMemo, useState } from 'react';
import { CheckCheck, Filter, Inbox, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { notificationsApi } from '../../../shared/utils/api';

const typeTone = {
  task_blocked: 'border-red-200 bg-red-50 text-red-700',
  task_overdue: 'border-red-200 bg-red-50 text-red-700',
  task_due_soon: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  task_completed: 'border-green-200 bg-green-50 text-green-700',
  tramite_status_changed: 'border-blue-200 bg-blue-50 text-blue-700',
  client_tramite_updated: 'border-blue-200 bg-blue-50 text-blue-700',
};

const NotificationsPage = () => {
  const [items, setItems] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [filters, setFilters] = useState({ read: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);

  const typeOptions = useMemo(() => preferences.map((item) => ({ value: item.type, label: item.label })), [preferences]);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const [{ data: notificationData }, { data: preferenceData }] = await Promise.all([
        notificationsApi.list({
          page,
          per_page: 20,
          read: filters.read || undefined,
          type: filters.type || undefined,
        }),
        notificationsApi.preferences(),
      ]);

      setItems(notificationData.items || []);
      setUnreadCount(notificationData.unread_count || 0);
      setMeta(notificationData.meta || { current_page: 1, last_page: 1, total: 0 });
      setPreferences(preferenceData.types || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [filters.read, filters.type]);

  const markAllAsRead = async () => {
    await notificationsApi.markAllAsRead();
    await load(meta.current_page || 1);
  };

  const openNotification = async (notification) => {
    if (!notification.read_at) {
      await notificationsApi.markAsRead(notification.id);
    }

    if (notification.data?.url) {
      window.location.href = notification.data.url;
      return;
    }

    await load(meta.current_page || 1);
  };

  const togglePreference = async (type) => {
    const nextPreferences = preferences.map((item) =>
      item.type === type ? { ...item, enabled: !item.enabled } : item
    );

    setPreferences(nextPreferences);
    setSavingPreferences(true);

    try {
      const { data } = await notificationsApi.updatePreferences(
        nextPreferences.map(({ type: itemType, enabled }) => ({ type: itemType, enabled }))
      );
      setPreferences(data.types || nextPreferences);
    } finally {
      setSavingPreferences(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-8">
      <div className="container-custom max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5F6B76]">Centro de notificaciones</p>
            <h1 className="mt-2 text-3xl font-black text-[#07073b]">Notificaciones</h1>
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#07073b] bg-white px-4 py-2 font-semibold text-[#07073b] shadow-sm transition hover:bg-[#07073b] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas como leidas
          </button>
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-lg border border-[#D7DCE1] bg-white p-4 shadow-sm md:flex-row md:items-center">
              <div className="flex items-center gap-2 font-bold text-[#07073b]">
                <Filter className="h-4 w-4" />
                Filtros
              </div>
              <select
                value={filters.read}
                onChange={(event) => setFilters((prev) => ({ ...prev, read: event.target.value }))}
                className="rounded-lg border border-[#D7DCE1] bg-white px-3 py-2 text-[#07073b] outline-none"
              >
                <option value="">Todas</option>
                <option value="0">No leidas</option>
                <option value="1">Leidas</option>
              </select>
              <select
                value={filters.type}
                onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
                className="rounded-lg border border-[#D7DCE1] bg-white px-3 py-2 text-[#07073b] outline-none"
              >
                <option value="">Todos los tipos</option>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <span className="ml-auto text-sm font-semibold text-[#5F6B76]">
                {unreadCount} no leida(s)
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#D7DCE1] bg-white shadow-sm">
              {loading ? (
                <div className="p-8 text-center text-[#5F6B76]">Cargando notificaciones...</div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 p-12 text-center text-[#5F6B76]">
                  <Inbox className="h-10 w-10" />
                  No hay notificaciones con esos filtros.
                </div>
              ) : (
                <div className="divide-y divide-[#F4F5F6]">
                  {items.map((notification) => {
                    const unread = !notification.read_at;
                    const tone = typeTone[notification.type] || 'border-[#D7DCE1] bg-[#F4F5F6] text-[#07073b]';

                    return (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => openNotification(notification)}
                        className={`block w-full px-5 py-4 text-left transition hover:bg-[#ffffff] ${unread ? 'bg-[#F3EFE6]' : 'bg-white'}`}
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}>
                                {notification.data?.label || notification.type}
                              </span>
                              {unread && <span className="rounded-full bg-[#238A55] px-2 py-0.5 text-xs font-bold text-white">Nueva</span>}
                            </div>
                            <p className="font-bold text-[#07073b]">{notification.data?.task_title || notification.data?.tramite_project_name || notification.data?.tramite_code}</p>
                            <p className="text-sm leading-6 text-[#5F6B76]">{notification.data?.message}</p>
                            <p className="text-xs font-semibold text-[#5F6B76]">{notification.data?.tramite_code}</p>
                          </div>
                          <span className="shrink-0 text-xs text-[#5F6B76]">
                            {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-lg border border-[#D7DCE1] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#238A55]" />
              <h2 className="text-lg font-black text-[#07073b]">Preferencias</h2>
            </div>
            <div className="space-y-2">
              {preferences.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => togglePreference(item.type)}
                  disabled={savingPreferences}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#D7DCE1] px-3 py-2 text-left transition hover:bg-[#F4F5F6] disabled:opacity-60"
                >
                  <span className="text-sm font-semibold text-[#07073b]">{item.label}</span>
                  {item.enabled ? (
                    <ToggleRight className="h-6 w-6 shrink-0 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 shrink-0 text-[#5F6B76]" />
                  )}
                </button>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default NotificationsPage;
