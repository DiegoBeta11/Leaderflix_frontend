import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Comments from "./Comments";
import Rating from "./Rating";

interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  link: string;
}

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

type Props = {
  title: string;
  favorites: number[];
  onToggleFavorite: (videoId: number, video: Video) => Promise<void>;
};

export default function MovieSection({ title, favorites, onToggleFavorite }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState<number | null>(null);

  const getSearchQuery = (sectionTitle: string): string => {
    const queryMap: { [key: string]: string } = {
      "Recomendadas para ti": "nature",
      "Más populares": "popular",
      "Nuevos lanzamientos": "technology",
      "Series destacadas": "ocean",
    };
    return queryMap[sectionTitle] || "nature";
  };

  useEffect(() => {
    async function fetchVideos() {
      const query = getSearchQuery(title);

      const endpoint =
        title === "Más populares"
          ? "/videos/popular"
          : `/videos/search?query=${encodeURIComponent(query)}`;

      const url = `${import.meta.env.VITE_API_URL}/api${endpoint}`;

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        setVideos((result.videos || []).slice(0, 6));
      } catch (error: any) {
        setError(`Error al cargar los videos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVideos();
  }, [title]);

  const getBestVideoQuality = (videoFiles: VideoFile[]): string => {
    const hdVideo = videoFiles.find((file) => file.quality === "hd");
    return hdVideo ? hdVideo.link : videoFiles[0]?.link || "";
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedVideo]);

  const handleToggleFavorite = async (e: React.MouseEvent, videoId: number, video: Video) => {
    e.stopPropagation();

    if (isTogglingFavorite === videoId) return;

    setIsTogglingFavorite(videoId);

    try {
      await onToggleFavorite(videoId, video);
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    } finally {
      setIsTogglingFavorite(null);
    }
  };

  const isFavorite = (videoId: number) => favorites.includes(videoId);

  const placeholders = new Array(6).fill(null);

  return (
    <>
      <section className="px-4 sm:px-8 py-8">
        <h2 className="text-white text-xl font-semibold mb-5">{title}</h2>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {isLoading
            ? placeholders.map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-800/50 rounded-lg animate-pulse" />
              ))
            : videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group relative bg-gray-900 hover:ring-2 hover:ring-red-500/50 transition-all"
                >
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium text-white">
                    {video.duration}s
                  </div>

                  <button
                    onClick={(e) => handleToggleFavorite(e, video.id, video)}
                    disabled={isTogglingFavorite === video.id}
                    className={`absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-all ${
                      isTogglingFavorite === video.id ? "cursor-wait opacity-50" : ""
                    }`}
                    aria-label={isFavorite(video.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <Heart
                      size={18}
                      className={`transition-all ${
                        isFavorite(video.id)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      } ${isTogglingFavorite === video.id ? "animate-pulse" : ""}`}
                    />
                  </button>
                </div>
              ))}
        </div>
      </section>

      {/* Modal del video seleccionado */}
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
              {/* Botón cerrar */}
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

              {/* Contenido del modal */}
              <div className="p-6 space-y-6">
                {/* Header con información y botón de favorito */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-gray-800">
                  <div className="flex-1">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {selectedVideo.user.name}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedVideo.duration} segundos
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggleFavorite(e, selectedVideo.id, selectedVideo)}
                    disabled={isTogglingFavorite === selectedVideo.id}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                      isFavorite(selectedVideo.id)
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    } ${isTogglingFavorite === selectedVideo.id ? "cursor-wait opacity-50" : ""}`}
                  >
                    <Heart
                      size={20}
                      className={isFavorite(selectedVideo.id) ? "fill-current" : ""}
                    />
                    <span className="text-sm">
                      {isFavorite(selectedVideo.id) ? "En Favoritas" : "Agregar a Favoritas"}
                    </span>
                  </button>
                </div>

                {/* Calificaciones */}
                <Rating videoId={selectedVideo.id} />

                {/* Comentarios */}
                <div className="pt-6 border-t border-gray-800">
                  <Comments videoId={selectedVideo.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}