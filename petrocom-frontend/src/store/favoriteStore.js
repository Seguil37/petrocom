// src/store/favoriteStore.js
import { create } from 'zustand';
import { favoritesApi } from '../shared/utils/api';
import useAuthStore from './authStore';
import { ROLES } from '../shared/constants/roles';

const useFavoriteStore = create((set, get) => ({
  favorites: [],
  favoriteTours: [],
  loading: false,
  error: null,
  hasFetched: false,

  fetchFavorites: async (force = false) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== ROLES.CLIENT) {
      set({ favorites: [], hasFetched: false });
      return;
    }

    if (get().loading || (get().hasFetched && !force)) return;

    set({ loading: true, error: null });
    try {
      const response = await favoritesApi.list();
      const data = response.data.data || response.data || [];
      const favoriteIds = data.map((item) => item.id).filter(Boolean);
      set({ favorites: favoriteIds, favoriteTours: data, hasFetched: true });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No se pudieron cargar tus favoritos' });
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (tourId) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== ROLES.CLIENT) {
      throw new Error('AUTH_REQUIRED');
    }

    const isCurrentlyFavorite = get().favorites.includes(tourId);

    if (isCurrentlyFavorite) {
      await favoritesApi.remove(tourId);
      set((state) => ({
        favorites: state.favorites.filter((id) => id !== tourId),
        favoriteTours: state.favoriteTours.filter((tour) => tour.id !== tourId),
      }));
      return { is_favorite: false };
    }

    const response = await favoritesApi.add(tourId);
    const project = response.data?.project || response.data;

    set((state) => ({
      favorites: [...new Set([...state.favorites, tourId])],
      favoriteTours: project
        ? [project, ...state.favoriteTours.filter((tour) => tour.id !== tourId)]
        : state.favoriteTours,
    }));

    return { is_favorite: true };
  },

  reset: () => set({ favorites: [], favoriteTours: [], hasFetched: false, error: null }),
}));

export default useFavoriteStore;
