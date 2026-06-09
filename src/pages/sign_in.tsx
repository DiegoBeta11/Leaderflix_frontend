import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/**
 * SignIn Component
 * User authentication form with accessibility and proper document title
 * Implements WCAG 2.4.2 (Page Titled) and 3.3.1 (Error Identification)
 * @returns {JSX.Element} Accessible Sign In form
 */
const SignIn: React.FC = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /** ✅ Criterio 2.4.2 — Página titulada **/
  useEffect(() => {
    document.title = "Iniciar sesión | Leaderflix";
  }, []);

  // Validaciones
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  // Envío de formulario
  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: string[] = [];

    if (!usuario) {
      nuevosErrores.push("El correo electrónico es obligatorio.");
    } else if (!validarEmail(usuario)) {
      nuevosErrores.push("Debes ingresar un correo electrónico válido.");
    }

    if (!contrasena) {
      nuevosErrores.push("La contraseña es obligatoria.");
    } else if (!validarContrasena(contrasena)) {
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setIsLoading(true);
    setErrores([]);

    try {
      const data = await loginUsuario(usuario, contrasena);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      alert("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error: any) {
      console.error("Error:", error);
      setErrores([error.message || "Credenciales inválidas."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-[#141414]"
      role="main"
      aria-labelledby="page-title"
    >
      <div
        className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white"
        role="form"
        aria-describedby={errores.length > 0 ? "form-errors" : undefined}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/Logo.png"
            alt="Logo de Leaderflix"
            className="w-28 h-28 mb-4 mx-auto"
          />
          <h1
            id="page-title"
            className="text-2xl font-bold text-center mb-2"
            tabIndex={0}
          >
            Inicia sesión
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Bienvenido de nuevo a Leaderflix
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5">
          {/* Campo de correo */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-1 text-gray-300 font-medium"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={isLoading}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="tu@email.com"
              aria-required="true"
              aria-invalid={errores.some((err) =>
                err.toLowerCase().includes("correo")
              )}
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-1 text-gray-300 font-medium"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ingresa tu contraseña"
                aria-required="true"
                aria-invalid={errores.some((err) =>
                  err.toLowerCase().includes("contraseña")
                )}
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                disabled={isLoading}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={
                  mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Enlace olvidó contraseña */}
          <div className="flex justify-center text-xs text-gray-400">
            <Link to="/forgot_password" className="hover:text-red-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Mensajes de error accesibles */}
          {errores.length > 0 && (
            <div
              id="form-errors"
              role="alert"
              aria-live="assertive"
              className="bg-red-900/30 border border-red-600 rounded p-3 space-y-1"
            >
              {errores.map((error, index) => (
                <p
                  key={index}
                  className="text-red-400 text-xs flex items-start"
                >
                  <span className="mr-2">•</span>
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-busy={isLoading}
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          {/* Enlace registro */}
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿No tienes cuenta?{" "}
            <Link to="/sign_up" className="text-red-500 hover:underline">
              Regístrate ya
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignIn;
