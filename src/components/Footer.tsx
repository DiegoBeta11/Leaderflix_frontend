import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Film, Keyboard, BookOpen, Compass, UserCircle } from "lucide-react";

/**
 * Footer component with brand info, navigation, account links,
 * user manual (PDF), and accessibility modal.
 */
export default function Footer() {
  // Controls modal visibility
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAccessibilityModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close modal on click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modalOverlay") {
      setShowAccessibilityModal(false);
    }
  };

  return (
    <footer className="bg-black/50 text-gray-400 py-8 mt-auto border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">

        {/* === Main footer grid === */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">

          {/* --- Brand info --- */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="text-red-600" size={24} />
              <h3 className="text-white font-bold text-lg">Leaderflix</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Tu plataforma de películas favoritas. Descubre y disfruta del mejor contenido cinematográfico.
            </p>
          </div>

          {/* --- Navigation links --- */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="text-red-600" size={20} />
              <h4 className="text-white font-semibold text-sm">Navegación</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-red-500 transition">Inicio</Link></li>
              <li><Link to="/home" className="hover:text-red-500 transition">Películas</Link></li>
              <li><Link to="/favorites" className="hover:text-red-500 transition">Mis Favoritas</Link></li>
              <li><Link to="/about" className="hover:text-red-500 transition">Acerca de</Link></li>
            </ul>
          </div>

          {/* --- Account links --- */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserCircle className="text-red-600" size={20} />
              <h4 className="text-white font-semibold text-sm">Cuenta</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sign_in" className="hover:text-red-500 transition">Iniciar sesión</Link></li>
              <li><Link to="/sign_up" className="hover:text-red-500 transition">Registrarse</Link></li>
              <li><Link to="/profile" className="hover:text-red-500 transition">Mi perfil</Link></li>
              <li><Link to="/forgot-password" className="hover:text-red-500 transition">Recuperar contraseña</Link></li>
            </ul>
          </div>

          {/* --- Help & Documentation --- */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="text-red-600" size={20} />
              <h4 className="text-white font-semibold text-sm">Ayuda</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/docs/manual-de-usuario.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition flex items-center gap-2"
                  title="Descargar Manual de Usuario (PDF)"
                >
                  Manual de Usuario
                </a>
              </li>
            </ul>
          </div>

          {/* --- Accessibility section --- */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="text-red-600" size={20} />
              <h4 className="text-white font-semibold text-sm">Accesibilidad</h4>
            </div>
            <button
              onClick={() => setShowAccessibilityModal(true)}
              className="text-sm text-gray-400 hover:text-red-500 transition"
            >
              Ver atajos de teclado
            </button>
          </div>
        </div>

        {/* --- Footer bottom --- */}
        <div className="text-center text-gray-600 text-xs pt-6 border-t border-gray-800">
          <p>© {new Date().getFullYear()} Leaderflix. Proyecto académico sin fines comerciales.</p>
          <p className="mt-1">Universidad del Valle - Sede Yumbo | Proyecto Integrador 1</p>
        </div>
      </div>

      {/* === Accessibility Modal === */}
      {showAccessibilityModal && (
        <div
          id="modalOverlay"
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-gray-900 rounded-2xl shadow-lg p-6 w-[90%] max-w-lg border border-gray-700 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Keyboard className="text-red-500" size={20} />
                Atajos de Teclado
              </h3>
              <button
                onClick={() => setShowAccessibilityModal(false)}
                className="text-gray-500 hover:text-red-500 transition text-xl"
                aria-label="Cerrar ventana de accesibilidad"
              >
                ×
              </button>
            </div>

            {/* Shortcuts grouped */}
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h4 className="text-red-400 font-semibold mb-2">🎬 Navegación General</h4>
                <ul className="space-y-1">
                  <li><span className="text-red-400 font-semibold">⌘ + H</span> / <span className="font-semibold">Alt + H</span> — Ir a Inicio</li>
                  <li><span className="text-red-400 font-semibold">⌘ + P</span> / <span className="font-semibold">Alt + P</span> — Ir al Perfil</li>
                  <li><span className="text-red-400 font-semibold">⌘ + M</span> / <span className="font-semibold">Alt + M</span> — Ir a Favoritas</li>
                </ul>
              </div>

              <div>
                <h4 className="text-red-400 font-semibold mb-2">⭐ Interacción con Videos</h4>
                <ul className="space-y-1">
                  <li><span className="text-red-400 font-semibold">Click en ❤️</span> — Agregar/quitar de Favoritas</li>
                  <li><span className="text-red-400 font-semibold">Click en video</span> — Reproducir película</li>
                </ul>
              </div>

              <div>
                <h4 className="text-red-400 font-semibold mb-2">📱 Navegación Básica</h4>
                <ul className="space-y-1">
                  <li><span className="text-red-400 font-semibold">↑ / ↓</span> — Mover entre opciones</li>
                  <li><span className="text-red-400 font-semibold">Enter</span> — Seleccionar elemento</li>
                  <li><span className="text-red-400 font-semibold">Tab</span> — Cambiar entre secciones</li>
                  <li><span className="text-red-400 font-semibold">Esc</span> — Cerrar ventana o menú</li>
                </ul>
              </div>
            </div>

            {/* Footer of modal */}
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Los atajos funcionan tanto en Mac (⌘, ⌥) como en Windows/Linux (Alt).  
              Puedes activar/desactivar los atajos desde el botón 🎹 en el navbar.
            </p>

            {/* Close button */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowAccessibilityModal(false)}
                className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}