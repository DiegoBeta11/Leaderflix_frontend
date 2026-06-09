// src/components/Comments.tsx
import { useState, useEffect } from "react";
import { MessageCircle, Send, Edit2, Trash2, X, Check, User } from "lucide-react";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../services/api";

interface Comment {
  _id: string;
  video_id: number;
  user_id: string;
  username?: string;
  comment_text: string;
  created_at: string;
}

interface CommentsProps {
  videoId: number;
}

export default function Comments({ videoId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  // Cargar comentarios al montar el componente
  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getComments(videoId);
      setComments(data);
    } catch (err: any) {
      console.error("Error al cargar comentarios:", err);
      setError(err.message || "Error al cargar comentarios");
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nuevo comentario
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    if (!currentUserId) {
      setError("Debes iniciar sesión para comentar");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      await addComment({
        video_id: videoId,
        user_id: currentUserId,
        comment_text: newComment.trim(),
      });
      
      setNewComment("");
      await loadComments(); // Recargar comentarios
    } catch (err: any) {
      console.error("Error al agregar comentario:", err);
      setError(err.message || "Error al agregar comentario");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Iniciar edición
  const startEditing = (comment: Comment) => {
    setEditingId(comment._id);
    setEditText(comment.comment_text);
    setError("");
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
    setError("");
  };

  // Guardar edición
  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    try {
      setError("");
      await updateComment(commentId, editText.trim());
      setEditingId(null);
      setEditText("");
      await loadComments();
    } catch (err: any) {
      console.error("Error al actualizar comentario:", err);
      setError(err.message || "Error al actualizar comentario");
    }
  };

  // Eliminar comentario
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("¿Estás seguro de eliminar este comentario?")) {
      return;
    }

    try {
      setError("");
      await deleteComment(commentId);
      await loadComments();
    } catch (err: any) {
      console.error("Error al eliminar comentario:", err);
      setError(err.message || "Error al eliminar comentario");
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 mt-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="text-red-500" size={20} />
        <h3 className="text-white font-semibold">
          Comentarios ({comments.length})
        </h3>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/30 border border-red-600 rounded p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Formulario para nuevo comentario */}
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            disabled={isSubmitting}
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} />
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Cargando comentarios...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && comments.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="text-gray-700 mx-auto mb-2" size={40} />
          <p className="text-gray-500 text-sm">
            Sé el primero en comentar este video
          </p>
        </div>
      )}

      {/* Lista de comentarios */}
      {!isLoading && comments.length > 0 && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              {/* Header del comentario */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {comment.username}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                </div>

                {/* Botones de acción (solo si es el autor) */}
                {comment.user_id === currentUserId && (
                  <div className="flex gap-2">
                    {editingId === comment._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateComment(comment._id)}
                          className="text-green-500 hover:text-green-400 transition p-1"
                          aria-label="Guardar cambios"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-500 hover:text-gray-400 transition p-1"
                          aria-label="Cancelar edición"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(comment)}
                          className="text-blue-500 hover:text-blue-400 transition p-1"
                          aria-label="Editar comentario"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-400 transition p-1"
                          aria-label="Eliminar comentario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Contenido del comentario */}
              {editingId === comment._id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-500 resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {comment.comment_text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}