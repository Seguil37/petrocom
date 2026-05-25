// src/features/agency/pages/MyToursPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight, Archive } from 'lucide-react';
import { projectsApi, toPublicUrl } from '../../../shared/utils/api';

const STATUS_CONFIG = {
  published: {
    label: 'Publicado',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  draft: {
    label: 'Borrador',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  },
  archived: {
    label: 'Archivado',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700'
  }
};

const MyToursPage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.list({ per_page: 1000 });
      const data = response.data?.data ?? response.data ?? [];
      setAllProjects(data);
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await projectsApi.delete(projectId);
      setAllProjects(allProjects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  // Filtrar por búsqueda
  const filtered = allProjects.filter((project) =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginación
  const totalPages = Math.ceil(filtered.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedProjects = filtered.slice(startIndex, startIndex + perPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a página 1 al buscar
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F6] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#07073b] mb-2">Mis proyectos</h1>
            <p className="text-[#5F6B76]">Gestiona todos tus proyectos</p>
          </div>
          <Link
            to="/agency/tours/create"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-gradient-secondary transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Crear proyecto
          </Link>
        </div>

        {/* Search */}
        <div className="bg-[#F4F5F6] rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B76] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-primary focus:outline-none"
              placeholder="Buscar proyectos..."
            />
          </div>
        </div>

        {/* List */}
        <div className="bg-[#F4F5F6] rounded-2xl shadow-lg overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#5F6B76]">
                {allProjects.length === 0 ? 'No tienes proyectos' : 'No se encontraron proyectos'}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[#5F6B76]">
                {paginatedProjects.map((project) => {
                  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.draft;
                  
                  return (
                    <div
                      key={project.id}
                      className="p-6 hover:bg-[#F4F5F6] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={toPublicUrl(project.hero_image || project.featuredImages?.[0]?.path) || 'https://via.placeholder.com/100'}
                          alt={project.title}
                          className="w-24 h-24 rounded-xl object-cover"
                        />

                        <div className="flex-1">
                          <h3 className="font-bold text-[#07073b] text-lg mb-2">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-[#5F6B76]">
                            <span>{project.city}{project.state ? `, ${project.state}` : ''}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                              {statusConfig.label}
                            </span>
                            {project.is_featured && (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                Destacado
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${project.id}`}
                            className="p-2 hover:bg-[#F4F5F6] rounded-lg transition-colors"
                            title="Ver"
                          >
                            <Eye className="w-5 h-5 text-[#5F6B76]" />
                          </Link>
                          <Link
                            to={`/agency/tours/${project.id}/edit`}
                            className="p-2 hover:bg-[#F4F5F6] rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5 text-[#5F6B76]" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 hover:bg-[#F4F5F6] rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5 text-[#C58A2A]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="bg-white border-t border-[#D7DCE1] px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-[#5F6B76]">
                  Mostrando <span className="font-bold text-[#07073b]">{startIndex + 1}</span> a <span className="font-bold text-[#07073b]">{Math.min(startIndex + perPage, filtered.length)}</span> de <span className="font-bold text-[#07073b]">{filtered.length}</span> proyectos
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[#D7DCE1] hover:bg-[#F4F5F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#07073b]" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-gradient-primary text-white'
                            : 'border border-[#D7DCE1] text-[#5F6B76] hover:bg-[#F4F5F6]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[#D7DCE1] hover:bg-[#F4F5F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-[#07073b]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyToursPage;
