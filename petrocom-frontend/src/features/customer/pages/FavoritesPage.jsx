// src/features/customer/pages/FavoritesPage.jsx
import { useEffect } from 'react';
import TourCard from '../../tours/components/TourCard';
import useFavoriteStore from '../../../store/favoriteStore';
import useAuthStore from '../../../store/authStore';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const { favorites, favoriteTours, fetchFavorites, loading } = useFavoriteStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites(true);
    }
  }, [fetchFavorites, isAuthenticated]);

  const hasFavorites = favorites.length > 0;
  const toursToShow = favoriteTours.length > 0 ? favoriteTours : [];

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-10">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-[#C58A2A]" />
          <div>
            <h1 className="text-3xl font-black text-[#07073b]">Servicios y proyectos guardados</h1>
            <p className="text-[#5F6B76]">Guarda servicios, categorias de proyecto o expedientes que quieras revisar.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-[#5F6B76]">Cargando elementos guardados...</p>
        ) : hasFavorites ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {toursToShow.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="bg-[#F4F5F6] rounded-xl shadow-md p-8 text-center">
            <p className="text-[#07073b] mb-2">Todavia no tienes elementos guardados.</p>
            <p className="text-sm text-[#5F6B76]">Explora servicios PETROCOM y guarda los que quieras revisar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
