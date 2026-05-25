// src/features/customer/pages/MyBookingsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Download,
  MessageSquare,
  XCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  ChevronRight
} from 'lucide-react';
import api from '../../../shared/utils/api';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/bookings', { params });
      setBookings(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await api.post(`/bookings/${bookingId}/cancel`, {
        reason: 'Cancelado por el cliente'
      });
      
      // Actualizar la lista
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));

      alert('Reserva cancelada exitosamente');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.response?.data?.message || 'Error al cancelar la reserva');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadVoucher = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/documents/voucher`, {
        responseType: 'blob'
      });
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `voucher-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading voucher:', err);
      alert('Error al descargar el voucher. Inténtalo más tarde.');
    }
  };

  const handleContactAgency = (booking) => {
    // Navegar a mensajes o abrir modal de contacto
    navigate(`/bookings/${booking.id}/messages`);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Pendiente',
        color: 'bg-[#f3f4f6] text-[#e8a12f]',
        icon: Clock
      },
      confirmed: {
        label: 'Confirmado',
        color: 'bg-[#f3f4f6] text-[#05052f]',
        icon: CheckCircle
      },
      cancelled: {
        label: 'Cancelado',
        color: 'bg-[#f3f4f6] text-[#e8a12f]',
        icon: XCircle
      },
      completed: {
        label: 'Completado',
        color: 'bg-[#f3f4f6] text-[#05052f]',
        icon: CheckCircle
      },
      in_progress: {
        label: 'En progreso',
        color: 'bg-[#f3f4f6] text-[#05052f]',
        icon: Clock
      }
    };
    return configs[status] || configs.pending;
  };

  const canCancelBooking = (booking) => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }
    
    // Verificar si está dentro del periodo de cancelación
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);
    
    // Asumiendo 24 horas de cancelación
    return hoursUntilBooking > 24;
  };

  const filteredBookings = bookings;

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1fb74d] animate-spin mx-auto mb-4" />
          <p className="text-[#65647a] font-medium">Cargando tus reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#07073b] mb-2">
            Mis Reservas
          </h1>
          <p className="text-[#65647a]">
            Gestiona y revisa todas tus experiencias reservadas
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-[#f3f4f6] rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[#1fb74d] text-white'
                  : 'bg-[#f3f4f6] text-[#07073b] hover:bg-[#f3f4f6]'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'confirmed'
                  ? 'bg-[#07073b] text-white'
                  : 'bg-[#f3f4f6] text-[#07073b] hover:bg-[#f3f4f6]'
              }`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'pending'
                  ? 'bg-[#1fb74d] text-white'
                  : 'bg-[#f3f4f6] text-[#07073b] hover:bg-[#f3f4f6]'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-[#07073b] text-white'
                  : 'bg-[#f3f4f6] text-[#07073b] hover:bg-[#f3f4f6]'
              }`}
            >
              Completadas
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'cancelled'
                  ? 'bg-[#07073b] text-white'
                  : 'bg-[#f3f4f6] text-[#07073b] hover:bg-[#f3f4f6]'
              }`}
            >
              Canceladas
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#f3f4f6] border-l-4 border-[#e8a12f] p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#e8a12f]" />
              <p className="text-[#e8a12f] font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Lista de Reservas */}
        {filteredBookings.length === 0 ? (
          <div className="bg-[#f3f4f6] rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-[#65647a]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No tienes reservas
            </h3>
            <p className="text-[#65647a] mb-6">
              Explora nuestros proyectos y comienza tu aventura
            </p>
            <button
              onClick={() => navigate('/projects')}
              className="bg-[#1fb74d] hover:bg-[#168a3d] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Explorar proyectos
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={booking.id}
                  className="bg-[#f3f4f6] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="md:flex">
                    {/* Imagen */}
                    <div className="md:w-64 h-48 md:h-auto relative">
                      <img
                        src={booking.tour?.featured_image || 'https://via.placeholder.com/400x300'}
                        alt={booking.tour?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-4 right-4 ${statusConfig.color} px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#07073b] mb-2">
                            {booking.tour?.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-[#65647a]">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.booking_date).toLocaleDateString('es-PE', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            {booking.booking_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.booking_time}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#65647a] mb-1">Total pagado</p>
                          <p className="text-2xl font-black text-[#1fb74d]">
                            S/. {parseFloat(booking.total_price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Detalles */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-[#07073b]">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-[#65647a]" />
                          {booking.number_of_people} persona{booking.number_of_people > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-[#65647a]" />
                          {booking.tour?.location_city}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleDownloadVoucher(booking.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#07073b] hover:bg-[#07073b] text-white rounded-lg transition-all font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Descargar
                        </button>

                        <button
                          onClick={() => handleContactAgency(booking)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#07073b] hover:bg-[#05052f] text-white rounded-lg transition-all font-medium"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Contactar
                        </button>

                        {canCancelBooking(booking) && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="flex items-center gap-2 px-4 py-2 bg-[#07073b] hover:bg-[#e8a12f] text-white rounded-lg transition-all font-medium disabled:opacity-50"
                          >
                            {cancellingId === booking.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cancelando...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Cancelar
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/projects/${booking.tour_id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#f3f4f6] hover:bg-[#65647a] text-[#07073b] rounded-lg transition-all font-medium ml-auto"
                        >
                          Ver proyecto
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dejar reseña si está completado */}
                      {booking.status === 'completed' && !booking.review && (
                        <div className="mt-4 bg-[#f3f4f6] border-l-4 border-[#1fb74d] p-3 rounded">
                          <p className="text-sm text-[#e8a12f] mb-2">
                            ¿Disfrutaste esta experiencia? ¡Déjanos tu reseña!
                          </p>
                          <button
                            onClick={() => navigate(`/projects/${booking.tour_id}?review=true`)}
                            className="flex items-center gap-1 text-[#e8a12f] hover:text-[#e8a12f] font-medium text-sm"
                          >
                            <Star className="w-4 h-4" />
                            Dejar reseña
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
