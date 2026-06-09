import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  videoId: number;
}

export default function Rating({ videoId }: RatingProps) {
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadRatings();
  }, [videoId]);

  const loadRatings = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ratings/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Aquí vienen ambos: ratings[] y average
        setAverageRating(data.average || 0);

        // Si quieres además marcar la calificación del usuario actual
        const userRatingFound = data.ratings?.find(
          (r: any) => r.user_id === userId
        );
        setUserRating(userRatingFound?.rating || 0);
      }
    } catch (err) {
      console.error("Error al cargar calificación:", err);
    }
  };

  const handleRate = async (rating: number) => {
    if (!userId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          video_id: videoId,
          user_id: userId,
          rating,
        }),
      });

      if (response.ok) {
        setUserRating(rating);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        // 🔁 Actualizar promedio después de calificar
        loadRatings();
      }
    } catch (err) {
      console.error("Error al calificar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredStar || userRating;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm">
          {userRating > 0 ? "Tu calificación:" : "Califica:"}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              disabled={isSubmitting}
              className="transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                size={24}
                className={`transition-colors ${
                  star <= displayRating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Promedio general */}
      <p className="text-sm text-gray-400">
        Promedio global:{" "}
        <span className="text-yellow-400">
          {averageRating ? averageRating.toFixed(1) : "Sin calificaciones"}
        </span>
      </p>

      {showSuccess && (
        <p className="text-green-400 text-sm">✓ Calificación guardada</p>
      )}
    </div>
  );
}
