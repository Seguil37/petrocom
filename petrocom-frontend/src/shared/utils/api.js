// src/shared/utils/api.js
import axios from 'axios';

const DEFAULT_API_ORIGIN = 'https://api.casaliz-arquitectura.com';

const isLocalHostname = (hostname) =>
  ['localhost', '127.0.0.1', '::1'].includes(hostname);

const envApiOrigin = import.meta.env.VITE_API_ORIGIN?.trim();
const appHostname =
  typeof window !== 'undefined' ? window.location.hostname : '';

// Evita que un build público use accidentalmente una URL local inyectada al compilar.
const resolvedApiOrigin =
  envApiOrigin &&
  !(appHostname && !isLocalHostname(appHostname) && /localhost|127\.0\.0\.1/i.test(envApiOrigin))
    ? envApiOrigin
    : DEFAULT_API_ORIGIN;

// Backend (Laravel)
export const API_ORIGIN = resolvedApiOrigin;
export const API_BASE = `${API_ORIGIN}/api/v1`;

// Helpers para URLs públicas (imágenes /storage)
export const toPublicUrl = (path) => {
  if (!path) return '';
  const clean = String(path).replaceAll('\\', '/'); // por si llega con \ de Windows
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  if (clean.startsWith('/')) return `${API_ORIGIN}${clean}`;
  return `${API_ORIGIN}/${clean}`;
};

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const isFormData = (data) => typeof FormData !== 'undefined' && data instanceof FormData;

const postWithData = (url, data) =>
  isFormData(data)
    ? api.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    : api.post(url, data);

const putWithData = (url, data) => {
  if (isFormData(data)) {
    if (!data.has('_method')) data.append('_method', 'PUT');
    return api.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
  return api.put(url, data);
};

export const projectsApi = {
  list: (params) => api.get('/projects', { params }),
  show: (id) => api.get(`/projects/${id}`),
  featured: () => api.get('/projects/featured'),
  create: (data) => postWithData('/projects', data),
  update: (id, data) => putWithData(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const servicesApi = {
  list: (params) => api.get('/services', { params }),
  show: (slug) => api.get(`/services/${slug}`),
  create: (data) => postWithData('/services', data),
  update: (id, data) => putWithData(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const reviewsApi = {
  listByProject: (projectId) => api.get('/reviews', { params: { project_id: projectId } }),
  createOrUpdate: (payload) => api.post('/reviews', payload),
  remove: (id) => api.delete(`/reviews/${id}`),
};

export const favoritesApi = {
  list: () => api.get('/favorites'),
  add: (projectId) => api.post('/favorites', { project_id: projectId }),
  remove: (projectId) => api.delete(`/favorites/${projectId}`),
};

export const notificationsApi = {
  list: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  preferences: () => api.get('/notifications/preferences'),
  updatePreferences: (preferences) => api.put('/notifications/preferences', { preferences }),
};

export const adminUsersApi = {
  list: (page = 1, search = '') => api.get('/users', { params: { page, search } }),
  clients: (search = '') => api.get('/clients', { params: { search } }),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const adminClientsApi = {
  dashboard: (params) => api.get('/clients/dashboard', { params }),
};

export const modulePermissionsApi = {
  list: () => api.get('/module-permissions'),
  update: (role, permissions) => api.put('/module-permissions', { role, permissions }),
  updateUser: (userId, permissions) => api.put(`/module-permissions/users/${userId}`, { permissions }),
};

export const settingsApi = {
  public: () => api.get('/settings/public'),
  list: (group) => api.get('/admin/settings', { params: { group } }),
  update: (key, data) => api.put(`/admin/settings/${key}`, data),
  updateGroup: (group, settings) => api.put(`/admin/settings/group/${group}`, { settings }),
  clearCache: () => api.post('/admin/settings/clear-cache'),
};

export const tramitesApi = {
  // Tipos de trámite
  listTypes: () => api.get('/tramite-types'),
  createType: (data) => api.post('/tramite-types', data),
  updateType: (id, data) => api.put(`/tramite-types/${id}`, data),
  showType: (id) => api.get(`/tramite-types/${id}`),
  deleteType: (id) => api.delete(`/tramite-types/${id}`),

  // Trámites asignados a cliente/proyecto
  list: (params) => api.get('/tramites', { params }),
  create: (data) => api.post('/tramites', data),
  update: (id, data) => api.put(`/tramites/${id}`, data),
  show: (id) => api.get(`/tramites/${id}`),
  delete: (id) => api.delete(`/tramites/${id}`),
  updatePhase: (tramiteId, phaseInstanceId, data) =>
    api.put(`/tramites/${tramiteId}/phases/${phaseInstanceId}`, data),
  updateSubphase: (tramiteId, subphaseInstanceId, data) =>
    api.put(`/tramites/${tramiteId}/subphases/${subphaseInstanceId}`, data),
  updateNotes: (id, data) => api.put(`/tramites/${id}/notes`, data),

  // Tareas
  listTasks: (tramiteId) => api.get(`/tramites/${tramiteId}/tasks`),
  createTask: (tramiteId, data) => api.post(`/tramites/${tramiteId}/tasks`, data),
  updateTask: (tramiteId, taskId, data) => api.put(`/tramites/${tramiteId}/tasks/${taskId}`, data),
  deleteTask: (tramiteId, taskId) => api.delete(`/tramites/${tramiteId}/tasks/${taskId}`),

  // Vista general
  overview: () => api.get('/tramites-dashboard/overview'),
  assignedTasks: () => api.get('/tramites-dashboard/assigned-tasks'),
};

export const clientTramitesApi = {
  publicShow: (code) => api.get(`/public/tramites/${encodeURIComponent(code)}`),
  mine: () => api.get('/client/tramites'),
};

export default api;
