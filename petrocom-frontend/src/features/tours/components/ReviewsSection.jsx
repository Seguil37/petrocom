// src/features/tours/components/ReviewsSection.jsx
import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Star } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { extractArray, reviewsApi } from '../../../shared/utils/api';
import { ROLES } from '../../../shared/constants/roles';

const RatingStars = ({ value = 0, size = 16 }) => (
  <div className="flex items-center gap-1 text-[#238A55]">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        className={star <= value ? 'fill-[#238A55]' : 'text-[#D7DCE1]'}
      />
    ))}
  </div>
);

const InteractiveStars = ({ value, onChange, disabled }) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        type="button"
        key={star}
        onClick={() => !disabled && onChange(star)}
        disabled={disabled}
        className="group"
      >
        <Star
          size={24}
          className={`transition-transform ${
            star <= value ? 'fill-[#238A55] text-[#238A55]' : 'text-[#D7DCE1]'
          } group-hover:scale-110`}
        />
      </button>
    ))}
    <span className="text-sm font-semibold text-[#07073b]">{value.toFixed(1)} / 5</span>
  </div>
);

const ReviewsSection = ({ projectId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const isClient = user?.role === ROLES.CLIENT;
  const myReview = useMemo(
    () => reviews.find((review) => review.user_id === user?.id),
    [reviews, user?.id]
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, item) => acc + (Number(item.rating) || 0), 0) / reviews.length
      : 0;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await reviewsApi.listByProject(projectId);
        setReviews(extractArray(response.data, ['reviews']));
      } catch {
        setError('No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !isClient) {
      setError('Debes iniciar sesion como cliente para dejar una reseña.');
      return;
    }

    if (!form.comment.trim()) {
      setError('Escribe un comentario antes de enviar.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        project_id: projectId,
        rating: form.rating,
        comment: form.comment.trim(),
      };
      const response = await reviewsApi.createOrUpdate(payload);
      const savedReview = response.data;

      setReviews((current) => {
        const existingIndex = current.findIndex((review) => review.id === savedReview.id);
        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex] = savedReview;
          return updated;
        }
        return [savedReview, ...current];
      });

      setForm({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar tu reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#D7DCE1] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#F3EFE6] border border-[#F3EFE6] flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-[#C58A2A]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#07073b]">Reseñas</h3>
            <p className="text-sm text-[#5F6B76]">Comparte tu experiencia con este proyecto.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F4F5F6] border border-[#D7DCE1]">
          <RatingStars value={reviews.length ? averageRating : 0} />
          <div className="text-xs text-[#07073b] font-semibold">
            {averageRating.toFixed(1)} / 5 ({reviews.length || '0'})
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-[#5F6B76]">Cargando reseñas...</p>
      ) : reviews.length === 0 ? (
        <p className="text-[#07073b]">Se el primero en dejar un comentario.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 rounded-xl bg-[#F4F5F6] border border-[#D7DCE1] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#E9F3EE] text-[#07073b] flex items-center justify-center font-bold">
                    {(review.user?.name || 'C')[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#07073b]">{review.user?.name || 'Cliente'}</p>
                    <p className="text-xs text-[#5F6B76]">{review.user?.email}</p>
                  </div>
                </div>
                {review.rating && <RatingStars value={review.rating} />}
              </div>
              <p className="text-[#303840] leading-relaxed">{review.comment}</p>
              {review.user_id === user?.id && (
                <span className="inline-block mt-1 text-xs font-semibold text-[#238A55]">Tu reseña</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-[#D7DCE1] pt-4">
        <h4 className="text-lg font-bold text-[#07073b] mb-2">Escribe una reseña</h4>
        {!isClient && (
          <p className="text-sm text-[#5F6B76] mb-3">Solo los clientes pueden dejar reseñas.</p>
        )}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-[#07073b]">Calificacion</label>
            <InteractiveStars
              value={form.rating}
              onChange={(rating) => setForm((state) => ({ ...state, rating }))}
              disabled={!isClient || submitting}
            />
          </div>

          <textarea
            value={form.comment}
            onChange={(e) => setForm((state) => ({ ...state, comment: e.target.value }))}
            placeholder={
              isClient ? 'Cuentanos que te parecio este proyecto' : 'Inicia sesion como cliente para comentar'
            }
            className="w-full min-h-[120px] border border-[#D7DCE1] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#238A55] bg-[#ffffff]"
            disabled={!isClient || submitting}
          />

          <button
            type="submit"
            disabled={!isClient || submitting}
            className="bg-[#238A55] disabled:opacity-60 text-white font-bold px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            {submitting ? 'Guardando...' : myReview ? 'Actualizar reseña' : 'Publicar reseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsSection;
