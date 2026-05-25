import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Loader2, SearchCheck } from 'lucide-react';
import { clientTramitesApi } from '../../../shared/utils/api';
import ClientTramiteStatus from '../components/ClientTramiteStatus';

const PublicTramiteLookupPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = useMemo(() => searchParams.get('codigo') || '', [searchParams]);
  const [code, setCode] = useState(initialCode);
  const [tramite, setTramite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setError('Ingresa el codigo de tu tramite.');
      setTramite(null);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { data } = await clientTramitesApi.publicShow(normalizedCode);
      setTramite(data);
      setSearchParams({ codigo: data.code });
    } catch (err) {
      console.error(err);
      setTramite(null);
      if (err.response?.status === 404) {
        setError('No encontramos un tramite con ese codigo. Revisa el dato o comunicate con el equipo.');
      } else {
        setError('No se pudo consultar el tramite en este momento.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F5F6]">
      <section className="border-b border-[#D7DCE1] bg-white">
        <div className="container-custom py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase text-[#238A55]">Seguimiento de tramites</p>
              <h1 className="mt-2 text-3xl font-black text-[#07073b] md:text-4xl">
                Consulta tu tramite con tu codigo
              </h1>
              <p className="mt-3 max-w-xl text-[#5F6B76]">
                Ingresa el codigo que te entrego el equipo de Casaliz para ver el estado, avance, fechas y proximas acciones sin crear una cuenta.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#07073b]">
                <span className="rounded-full border border-[#D7DCE1] bg-[#F4F5F6] px-3 py-1">Sin registro</span>
                <span className="rounded-full border border-[#D7DCE1] bg-[#F4F5F6] px-3 py-1">Vista simple</span>
                <span className="rounded-full border border-[#D7DCE1] bg-[#F4F5F6] px-3 py-1">Actualizado por el equipo</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-lg border border-[#D7DCE1] bg-[#ffffff] p-5 shadow-sm">
              <label htmlFor="tramite-code" className="text-sm font-black text-[#07073b]">
                Codigo de tramite
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  id="tramite-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder=""
                  className="min-h-[48px] flex-1 rounded-lg border border-[#D7DCE1] bg-white px-4 text-[#07073b] outline-none transition focus:border-[#238A55]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#238A55] px-5 font-black text-white transition hover:bg-[#196B43] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchCheck className="h-5 w-5" />}
                  Consultar
                </button>
              </div>
              {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
              <div className="mt-4 border-t border-[#D7DCE1] pt-4 text-sm text-[#5F6B76]">
                Los clientes registrados tambien pueden ver todos sus tramites desde{' '}
                <Link to="/cliente/tramites" className="font-black text-[#07073b] hover:text-[#238A55]">
                  Mis tramites
                </Link>
                .
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="container-custom py-8">
        {tramite ? (
          <ClientTramiteStatus tramite={tramite} />
        ) : (
          <div className="rounded-lg border border-dashed border-[#D7DCE1] bg-white p-8 text-center">
            <ArrowRight className="mx-auto h-8 w-8 text-[#238A55]" />
            <p className="mt-3 text-lg font-black text-[#07073b]">Tu resultado aparecera aqui</p>
            <p className="mt-1 text-sm text-[#5F6B76]">Usa el codigo exacto entregado por el equipo.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default PublicTramiteLookupPage;
