const API_URL = import.meta.env.VITE_API_URL;

/**
 * Register new user with username, email, birthdate, and password
 * @param {string} username - User's chosen username
 * @param {string} email - User's email address
 * @param {string} birthdate - User's birth date (format: YYYY-MM-DD)
 * @param {string} password - User's chosen password
 * @returns {Promise<any>} API response JSON
 */
export async function registrarUsuario(
  username: string,
  email: string,
  birthdate: string,
  password: string
) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, birthdate, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error al registrar usuario");
  }

  return data;
}

/**
 * Login user with email and password
 */
export async function loginUsuario(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data;
}

/**
 * Send password reset email
 */
export async function forgotPassword(email: string) {
  const response = await fetch(`${API_URL}/password/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Error al enviar el correo");
  }

  return data;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(id: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Error al obtener el perfil");
  return await response.json();
}

/**
 * Update user profile information
 */
export async function updateUserProfile(id: string, formData: {
  email: string;
  username: string;
  birthdate: string;
  password?: string;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error("Error al actualizar perfil");
  return await response.json();
}

/**
 * Reset password using token from email
 */
export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) {
  try {
    const response = await fetch(`${API_URL}/password/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar la contraseña.");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error de conexión con el servidor.");
  }
}

/**
 * Delete user account permanently
 */
export async function deleteUserAccount(id: string) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la cuenta");
    }

    return await response.json();
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    throw error;
  }
}

// ============================================
// FUNCIONES DE FAVORITOS 
// ============================================

/**
 * Get all favorites for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of favorite videos with their data
 * @example
 * const favorites = await getFavorites("user123");
 * // [{ video_id: 1, image: "...", duration: 120, ... }, ...]
 */
export async function getFavorites(userId: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/favorites/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener favoritos");
  }

  return await response.json();
}

/**
 * Add a video to user's favorites
 * @param {string} userId - User ID
 * @param {Object} videoData - Video information to save
 * @param {number} videoData.video_id - Pexels video ID
 * @param {string} videoData.image - Video thumbnail URL
 * @param {number} videoData.duration - Video duration in seconds
 * @param {string} videoData.video_url - Video playback URL
 * @param {string} videoData.user_name - Video creator name
 * @returns {Promise<any>} API response with created favorite
 * @example
 * await addFavorite("user123", {
 *   video_id: 1,
 *   image: "https://...",
 *   duration: 120,
 *   video_url: "https://...",
 *   user_name: "John Doe"
 * });
 */
export async function addFavorite(
  userId: string,
  videoData: {
    video_id: number;
    image: string;
    duration: number;
    video_url: string;
    user_name: string;
  }
) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/favorites/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(videoData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar favorito");
  }

  return data;
}

/**
 * Remove a video from user's favorites
 * @param {string} userId - User ID
 * @param {number} videoId - Pexels video ID to remove
 * @returns {Promise<any>} API response confirming deletion
 * @example
 * await removeFavorite("user123", 1);
 */
export async function removeFavorite(userId: string, videoId: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/favorites/${userId}/${videoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al eliminar favorito");
  }

  return await response.json();
}
// ============================================
// FUNCIONES DE COMENTARIOS 
// ============================================

/**
 * Get all comments for a specific video
 * @param {number} videoId - Video ID
 * @returns {Promise<Array>} Array of comments
 */
export async function getComments(videoId: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/comments/${videoId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener comentarios");
  }

  return await response.json();
}

/**
 * Add a comment to a video
 * @param {Object} commentData - Comment information
 * @param {number} commentData.video_id - Video ID
 * @param {string} commentData.user_id - User ID
 * @param {string} commentData.comment_text - Comment content
 * @returns {Promise<any>} Created comment
 */
export async function addComment(commentData: {
  video_id: number;
  user_id: string;
  comment_text: string;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar comentario");
  }

  return data;
}

/**
 * Update an existing comment
 * @param {number} commentId - Comment ID
 * @param {string} commentText - New comment text
 * @returns {Promise<any>} Updated comment
 */


export async function updateComment(commentId: string, commentText: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment_text: commentText }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar comentario");
  }

  return data;
}

/**
 * Delete a comment
 * @param {number} commentId - Comment ID
 * @returns {Promise<any>} Deletion confirmation
 */
export async function deleteComment(commentId: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al eliminar comentario");
  }

  return await response.json();
}
// ============================================
// FUNCIONES DE CALIFICACIONES (RATINGS)
// ============================================

/**
 * Get ratings for a specific video
 * @param {number} videoId - Video ID
 * @returns {Promise<Object>} Rating data with average, total, and user rating
 */
export async function getRatings(videoId: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/ratings/${videoId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener calificaciones");
  }

  return await response.json();
}

/**
 * Add or update a rating for a video
 * @param {Object} ratingData - Rating information
 * @param {number} ratingData.video_id - Video ID
 * @param {string} ratingData.user_id - User ID
 * @param {number} ratingData.rating - Rating value (1-5)
 * @returns {Promise<any>} Created or updated rating
 */
export async function addRating(ratingData: {
  video_id: number;
  user_id: string;
  rating: number;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/ratings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ratingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al agregar calificación");
  }

  return data;
}