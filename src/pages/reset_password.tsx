import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

/**
 * ResetPassword Component
 * Allows users to reset their password using a token received via email
 * Includes password validation, confirmation matching, and accessibility features
 * @returns {JSX.Element} Password reset form
 */
const ResetPassword: React.FC = () => {
  // Hooks for navigation and accessing URL parameters
  const navigate = useNavigate();
  const location = useLocation();

  // Form state management
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  
  // Refs for accessibility - managing focus on errors and success messages
  const erroresRef = useRef<HTMLDivElement>(null);
  const mensajeRef = useRef<HTMLDivElement>(null);

  /**
   * Extract reset token from URL query parameters on component mount
   * Sets error if token is missing or invalid
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    if (tokenFromURL) setToken(tokenFromURL);
    else setErrores(["Token inválido o ausente."]);
  }, [location.search]);

  /**
   * Validates password strength requirements
   * @param {string} password - Password to validate
   * @returns {boolean} True if password meets requirements (8+ chars, 1 uppercase, 1 special char)
   */
  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  /**
   * Handles form submission
   * Validates all fields, sends reset request to API, and redirects on success
   * @param {React.FormEvent} e - Form submission event
   */
  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: string[] = [];

    // Validate new password field
    if (!nuevaContrasena) {
      nuevosErrores.push("La nueva contraseña es obligatoria.");
    } else if (!validarContrasena(nuevaContrasena)) {
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );
    }

    // Validate password confirmation field
    if (!confirmarContrasena) {
      nuevosErrores.push("Debes confirmar tu nueva contraseña.");
    } else if (nuevaContrasena !== confirmarContrasena) {
      nuevosErrores.push("Las contraseñas no coinciden.");
    }

    // Validate token presence
    if (!token) {
      nuevosErrores.push("Token de restablecimiento no encontrado.");
    }

    // If validation errors exist, display them and focus error container
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      erroresRef.current?.focus();
      return;
    }

    // Attempt password reset via API
    try {
      setCargando(true);
      await resetPassword({ token: token!, newPassword: nuevaContrasena });

      // Show success message and redirect to login after 2 seconds
      setMensaje("¡Contraseña actualizada exitosamente!");
      setErrores([]);
      mensajeRef.current?.focus();
      setTimeout(() => navigate("/sign_in"), 2000);
    } catch (error: any) {
      // Display API error and focus error container
      setErrores([error.message]);
      erroresRef.current?.focus();
    } finally {
      setCargando(false);
    }
  };

  return (
    // Full-screen centered container with dark background
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      {/* Form card with semi-transparent black background */}
      <div className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white relative">
        
        {/* Back button - navigates to sign in page */}
        <button
          onClick={() => navigate("/sign_in")}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-red-600 rounded p-1"
          aria-label="Volver a iniciar sesión"
        >
          {/* Left chevron SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Header section with logo and title */}
        <div className="flex flex-col items-center mb-8">
          <img src="/Logo.png" alt="Leaderflix logo" className="w-28 h-28 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-center mb-2">
            Restablecer Contraseña
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Crea tu nueva contraseña
          </p>
        </div>

        {/* Password reset form */}
        <form
          onSubmit={manejarSubmit}
          className="flex flex-col space-y-5"
          aria-label="Formulario de restablecimiento de contraseña"
          noValidate
        >
          
          {/* Error messages container - displayed when validation fails */}
          {errores.length > 0 && (
            <div
              ref={erroresRef}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              tabIndex={-1}
              className="bg-red-900/30 border border-red-600 rounded p-3 space-y-1 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
            >
              <p className="font-semibold text-red-400 text-sm mb-2">
                Se encontraron {errores.length} error{errores.length > 1 ? "es" : ""}:
              </p>
              {/* Error list with bullet points */}
              <ul className="space-y-1">
                {errores.map((error, index) => (
                  <li key={index} className="text-red-400 text-xs flex items-start">
                    <span className="mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* New Password Field */}
          <div>
            <label htmlFor="new-password" className="block text-sm mb-1 text-gray-300">
              Nueva Contraseña <span className="text-red-500" aria-label="requerido">*</span>
            </label>
            <div className="relative">
              {/* Password input with dynamic type (text/password) for show/hide functionality */}
              <input
                id="new-password"
                type={mostrarContrasena ? "text" : "password"}
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                className={`w-full p-2 rounded bg-[#1c1c1c] border-2 focus:outline-none transition-colors pr-10 ${
                  errores.some((e) => e.includes("nueva contraseña"))
                    ? "border-red-600 focus:border-red-700"
                    : "border-gray-700 focus:border-red-600"
                }`}
                placeholder="Mínimo 8 caracteres"
                aria-required="true"
                aria-invalid={errores.some((e) => e.includes("nueva contraseña")) ? "true" : "false"}
                aria-describedby={
                  errores.some((e) => e.includes("nueva contraseña"))
                    ? "password-error password-requirements"
                    : "password-requirements"
                }
                disabled={cargando}
              />
              {/* Toggle visibility button - Eye/EyeOff icon */}
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition focus:outline-2 focus:outline-offset-2 focus:outline-red-600 rounded p-1"
                aria-label={
                  mostrarContrasena
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password requirements helper text */}
            <p
              id="password-requirements"
              className="text-gray-400 text-xs mt-1"
            >
              Requisitos: Mínimo 8 caracteres, una mayúscula y un signo especial
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm mb-1 text-gray-300">
              Confirmar Nueva Contraseña <span className="text-red-500" aria-label="requerido">*</span>
            </label>
            <div className="relative">
              {/* Password confirmation input with show/hide functionality */}
              <input
                id="confirm-password"
                type={mostrarConfirmarContrasena ? "text" : "password"}
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className={`w-full p-2 rounded bg-[#1c1c1c] border-2 focus:outline-none transition-colors pr-10 ${
                  errores.some((e) => e.includes("coinciden"))
                    ? "border-red-600 focus:border-red-700"
                    : "border-gray-700 focus:border-red-600"
                }`}
                placeholder="Confirma tu contraseña"
                aria-required="true"
                aria-invalid={errores.some((e) => e.includes("coinciden")) ? "true" : "false"}
                aria-describedby={errores.some((e) => e.includes("coinciden")) ? "confirm-error" : undefined}
                disabled={cargando}
              />
              {/* Toggle visibility button */}
              <button
                type="button"
                onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition focus:outline-2 focus:outline-offset-2 focus:outline-red-600 rounded p-1"
                aria-label={
                  mostrarConfirmarContrasena
                    ? "Ocultar confirmación de contraseña"
                    : "Mostrar confirmación de contraseña"
                }
              >
                {mostrarConfirmarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Specific error message for password mismatch */}
            {errores.some((e) => e.includes("coinciden")) && (
              <p id="confirm-error" className="text-red-400 text-xs mt-1">
                {errores.find((e) => e.includes("coinciden"))}
              </p>
            )}
          </div>

          {/* Success message - displayed after successful password reset */}
          {mensaje && (
            <div
              ref={mensajeRef}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              tabIndex={-1}
              className="bg-green-900/30 border border-green-600 rounded p-3 text-green-400 text-xs focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
            >
              {mensaje}
            </div>
          )}

          {/* Submit button - disabled during loading state */}
          <button
            type="submit"
            disabled={cargando}
            className={`p-2 rounded font-semibold transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-red-600 ${
              cargando
                ? "bg-red-700 cursor-not-allowed opacity-70"
                : "bg-red-600 hover:bg-red-700"
            }`}
            aria-busy={cargando}
          >
            {cargando ? "Restableciendo..." : "Restablecer Contraseña"}
          </button>

          {/* Link back to sign in page */}
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿Recordaste tu contraseña?{" "}
            <Link
              to="/sign_in"
              className="text-red-500 hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-red-600 rounded px-1"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;