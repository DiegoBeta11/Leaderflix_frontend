import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieSection from "../components/MovieSection";
import Footer from "../components/Footer";
import { getFavorites, addFavorite, removeFavorite } from "../services/api";

// Interface para el Video completo
interface Video {
  id: number;
  image: string;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    link: string;
  }>;
  user: {
    id: number;
    name: string;
    url: string;
  };
  duration: number;
}

/**
 * Home Component
 * Main landing page of the Leaderflix platform
 * Manages global favorites state and API interactions
 * @returns {JSX.Element} Home page with movie catalog sections
 */
export default function Home() {
  // Estado global de favoritos (solo IDs)
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  /**
   * Carga favoritos desde la API al montar el componente
   */
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No hay usuario autenticado");
          setLoadingFavorites(false);
          return;
        }

        const favoritesData = await getFavorites(userId);
        // Extraer solo los IDs de los videos favoritos
        const favoriteIds = favoritesData.map((fav: any) => fav.video_id);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
        // No mostramos error al usuario, simplemente iniciamos sin favoritos
        setFavorites([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, []);

  /**
   * Maneja agregar/quitar favoritos
   * Actualiza la API y el estado local
   */
  const handleToggleFavorite = async (videoId: number, video: Video) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debes iniciar sesión para agregar favoritos");
        return;
      }

      const isFavorite = favorites.includes(videoId);

      if (isFavorite) {
        // Remover de favoritos
        await removeFavorite(userId, videoId);
        setFavorites(prev => prev.filter(id => id !== videoId));
      } else {
        // Agregar a favoritos - enviamos el video completo
        await addFavorite(userId, {
          video_id: videoId,
          image: video.image,
          duration: video.duration,
          video_url: video.video_files[0]?.link || "",
          user_name: video.user.name,
        });
        setFavorites(prev => [...prev, videoId]);
      }
    } catch (error: any) {
      console.error("Error al actualizar favorito:", error);
      alert(error.message || "Error al actualizar favoritos");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <Navbar />
      
      <main className="pt-4">
        {loadingFavorites ? (
          // Mostrar skeleton mientras cargan los favoritos
          <div className="px-8 py-6">
            <div className="h-6 w-48 bg-gray-800 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <MovieSection 
              title="Recomendadas para ti" 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
            <MovieSection 
              title="Más populares" 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
            <MovieSection 
              title="Nuevos lanzamientos" 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
            <MovieSection 
              title="Series destacadas" 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}