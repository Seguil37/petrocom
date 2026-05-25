// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../shared/utils/api';

const DEFAULT_AUTH_ERROR = 'No pudimos conectarnos con el servicio en este momento. Intenta nuevamente en unos minutos.';

const hasTechnicalDetails = (message = '') =>
  /SQLSTATE|select \* from|Connection:|mysql|PDOException|QueryException|users`\.`deleted_at/i.test(message);

const sanitizeAuthError = (error, fallback = DEFAULT_AUTH_ERROR) => {
  const validationError = error.response?.data?.errors?.email?.[0];
  const serverMessage = error.response?.data?.message;
  const message = validationError || serverMessage || fallback;

  if (!error.response || hasTechnicalDetails(message)) {
    return fallback;
  }

  return message;
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login
      login: async (email, password) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/auth/login', { 
            email: String(email || '').trim().toLowerCase(),
            password 
          });

          const { user, token } = response.data;

          // Guardar token en localStorage
          localStorage.setItem('token', token);
          
          // Configurar token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage = sanitizeAuthError(error);
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      // Register
      register: async (userData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/auth/register', userData);

          const { user, token } = response.data;

          // Guardar token
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const serverMessage = error.response?.data?.message;
          const emailError = error.response?.data?.errors?.email?.[0];
          let errorMessage = sanitizeAuthError(
            error,
            'No pudimos completar el registro en este momento. Intenta nuevamente en unos minutos.'
          );

          if (emailError) {
            errorMessage = emailError;
          } else if (serverMessage && !hasTechnicalDetails(serverMessage)) {
            errorMessage = serverMessage;
          }

          if (errorMessage === 'The email has already been taken.') {
            errorMessage = 'El correo ya está registrado.';
          }
          
          set({
            loading: false,
            error: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        } finally {
          // Limpiar todo
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      // Actualizar usuario
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      // Verificar autenticación al cargar la app
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          // Configurar token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obtener usuario actual
          const response = await api.get('/auth/me');
          
          set({
            user: response.data.user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Token inválido:', error);
          
          // Token inválido, limpiar
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      // Limpiar errores
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
