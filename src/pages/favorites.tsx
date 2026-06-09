import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Comments from "../components/Comments";
import Rating from "../components/Rating"; // ✅ Importar componente de calificaciones
import { getFavorites, removeFavorite } from "../services/api";

/**
 * Interface para archivos de video
 * Define las diferentes calidades disponibles para reproducción
 */
interface VideoFile {
  id: number;
  quality: string;      // Calidad: "hd", "sd", etc.
  file_type: string;    // Tipo MIME: "video/mp4"
  link: string;         // URL del archivo de video
}

/**
 * Interface para favoritos obtenidos de la API
 * Estructura simplificada que viene del backend
 */
interface FavoriteFromAPI {
  video_id: number;     // ID único del video
  image: string;        // URL de la imagen de portada
  duration: number;     // Duración en segundos
  video_url: string;    // URL directa del video
  user_name: string;    // Nombre del creador
}

/**
 * Interface completa de Video
 * Estructura estandarizada usada en toda la aplicación
 */
interface Video {
  id: number;
  image: string;
  video_files: VideoFile[];
  user: {
    id: number;
    name: string;
    url: string;
  };
  duration: number;
}

/**
 * Componente Favorites
 * Página que muestra la lista de videos marcados como favoritos por el usuario
 * Permite reproducir, calificar y eliminar videos de favoritos
 */
export default function Favorites() {
  // Hook de navegación para redireccionar entre páginas
  const navigate = useNavigate();
  
  // Estados del componente
  const [favorites, setFavorites] = useState<Video[]>([]);              // Lista de videos favoritos
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null); // Video actualmente seleccionado
  const [isLoading, setIsLoading] = useState(true);                     // Estado de carga inicial
  const [error, setError] = useState<string>("");                       // Mensaje de error si falla la carga

  /**
   * Effect: Cargar videos favoritos al montar el componente
   * Se ejecuta una sola vez cuando la página carga
   */
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Obtener ID del usuario desde localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Debes iniciar sesión para ver tus favoritos");
          setIsLoading(false);
          return;
        }

        // Llamar a la API para obtener favoritos del usuario
        const favoritesData: FavoriteFromAPI[] = await getFavorites(userId);
        
        /**
         * Transformar datos de la API al formato Video
         * Necesario porque la API devuelve una estructura simplificada
         * y el componente necesita la estructura completa
         */
        const transformedVideos: Video[] = favoritesData.map(fav => ({
          id: fav.video_id,
          image: fav.image,
          duration: fav.duration,
          video_files: [
            {
              id: fav.video_id,
              quality: "hd",
              file_type: "video/mp4",
              link: fav.video_url,
            }
          ],
          user: {
            id: 0,
            name: fav.user_name,
            url: "",
          }
        }));

        setFavorites(transformedVideos);
      } catch (error: any) {
        console.error("Error al cargar favoritos:", error);
        setError(error.message || "Error al cargar favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []); // Array vacío = solo se ejecuta al montar

  /**
   * Effect: Controlar el scroll del body cuando el modal está abierto
   * Previene que el usuario haga scroll en el fondo mientras ve el video
   */
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden"; // Bloquear scroll
    } else {
      document.body.style.overflow = "unset";  // Restaurar scroll
    }
    // Cleanup: restaurar scroll al desmontar el componente
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedVideo]); // Se ejecuta cada vez que cambia selectedVideo

  /**
   * Función auxiliar: Obtener la mejor calidad de video disponible
   * Prioriza HD, si no existe toma el primer archivo disponible
   */
  const getBestVideoQuality = (videoFiles: VideoFile[]): string => {
    const hdVideo = videoFiles.find(file => file.quality === "hd");
    return hdVideo ? hdVideo.link : videoFiles[0]?.link || "";
  };

  /**
   * Handler: Abrir modal de reproducción al hacer clic en un video
   */
  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  /**
   * Handler: Cerrar modal de reproducción
   */
  const closeModal = () => {
    setSelectedVideo(null);
  };

  /**
   * Handler: Eliminar un video específico de favoritos
   * @param videoId - ID del video a eliminar
   * @param e - Evento del mouse (opcional) para prevenir propagación
   */
  const handleRemoveFavorite = async (videoId: number, e?: React.MouseEvent) => {
    // Prevenir que se abra el modal al hacer clic en el botón eliminar
    if (e) e.stopPropagation();
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debes iniciar sesión");
        return;
      }

      // Llamar a la API para eliminar de favoritos en el backend
      await removeFavorite(userId, videoId);
      
      // Actualizar el estado local eliminando el video de la lista
      setFavorites(prev => prev.filter(v => v.id !== videoId));
      
    } catch (error: any) {
      console.error("Error al eliminar favorito:", error);
      alert(error.message || "Error al eliminar favorito");
    }
  };

  /**
   * Handler: Eliminar TODOS los favoritos del usuario
   * Muestra confirmación antes de proceder
   */
  const clearAllFavorites = async () => {
    // Confirmación del usuario antes de eliminar todo
    if (!confirm("¿Estás seguro de que quieres eliminar todos tus favoritos?")) {
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debes iniciar sesión");
        return;
      }

      // Crear un array de promesas para eliminar todos los favoritos en paralelo
      const deletePromises = favorites.map(video => 
        removeFavorite(userId, video.id)
      );
      
      // Esperar a que todas las eliminaciones terminen
      await Promise.all(deletePromises);
      
      // Limpiar el estado local
      setFavorites([]);
      
    } catch (error: any) {
      console.error("Error al limpiar favoritos:", error);
      alert(error.message || "Error al limpiar favoritos");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      {/* Barra de navegación superior */}
      <Navbar />
      
      {/* Contenido principal de la página */}
      <main className="flex-1 px-4 sm:px-8 py-8">
        {/* Header de la página */}
        <div className="mb-8">
          {/* Título con botón de regreso */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <button
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-gray-800 rounded-full transition"
              aria-label="Volver"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <Heart className="text-red-500 fill-red-500" size={28} />
              Mis Favoritas
            </h1>
          </div>
          
          {/* Contador de favoritos y botón de limpiar todo */}
          <div className="flex items-center justify-between pl-14 sm:pl-16">
            <p className="text-gray-400 text-sm">
              {favorites.length} {favorites.length === 1 ? "película" : "películas"} guardada{favorites.length !== 1 ? "s" : ""}
            </p>
            
            {/* Botón de limpiar todo - solo visible si hay favoritos */}
            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Limpiar todo</span>
                <span className="sm:hidden">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Estado de carga: Spinner mientras se cargan los favoritos */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-gray-400">Cargando favoritos...</p>
          </div>
        )}

        {/* Estado de error: Mostrar si falla la carga */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-red-500 mb-4 text-5xl">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              Error al cargar favoritos
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado vacío: No hay favoritos guardados */}
        {!isLoading && !error && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={80} className="text-gray-700 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No tienes favoritos aún
            </h2>
            <p className="text-gray-500 mb-6">
              Comienza a agregar películas que te gusten
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Explorar películas
            </button>
          </div>
        )}

        {/* Grid de videos favoritos */}
        {!isLoading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {favorites.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group relative bg-gray-900 hover:ring-2 hover:ring-red-500/50 transition-all"
              >
                {/* Video con thumbnail y preview en hover */}
                <video
                  poster={video.image}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={getBestVideoQuality(video.video_files)}
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />

                {/* Overlay oscuro en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Badge de duración */}
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium text-white">
                  {video.duration}s
                </div>

                {/* Botón para eliminar de favoritos */}
                <button
                  onClick={(e) => handleRemoveFavorite(video.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-600 rounded-full transition-all z-10"
                  aria-label="Eliminar de favoritos"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer de la página */}
      <Footer />

      {/* Modal de reproducción de video */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto"
          onClick={closeModal}
        >
          <div className="min-h-screen flex items-start justify-center p-4 py-8">
            <div
              className="relative w-full max-w-5xl bg-[#141414] rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar modal */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
                aria-label="Cerrar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Reproductor de video */}
              <div className="relative bg-black">
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  src={getBestVideoQuality(selectedVideo.video_files)}
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>

              {/* Contenido del modal: información, calificación y comentarios */}
              <div className="p-6 space-y-6">
                {/* Header: Información del video y botón de eliminar */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-gray-800">
                  <div className="flex-1">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {selectedVideo.user.name}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        {/* Icono de reloj */}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedVideo.duration} segundos
                      </span>
                    </div>
                  </div>

                  {/* Botón para eliminar de favoritos */}
                  <button
                    onClick={() => {
                      handleRemoveFavorite(selectedVideo.id);
                      closeModal(); // Cerrar modal después de eliminar
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all"
                  >
                    <Trash2 size={18} />
                    <span className="text-sm">Eliminar de Favoritas</span>
                  </button>
                </div>

                {/* ✅ Componente de calificación con estrellas */}
                <Rating videoId={selectedVideo.id} />

                {/* Sección de comentarios */}
                <div className="pt-6 border-t border-gray-800">
                  <Comments videoId={selectedVideo.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}