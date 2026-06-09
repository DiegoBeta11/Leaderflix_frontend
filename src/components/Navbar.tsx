import { Search, Heart, User, LogOut, Menu, X, Keyboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shortcutsEnabled, setShortcutsEnabled] = useState(() => {
    return localStorage.getItem("shortcutsEnabled") === "true";
  });

  //Actualiza el título de la página según la ruta (criterio 2.4.2)
  useEffect(() => {
    const titles: Record<string, string> = {
      "/home": "Leaderflix | Inicio",
      "/favorites": "Leaderflix | Favoritas",
      "/profile": "Leaderflix | Perfil de usuario",
      "/about": "Leaderflix | Acerca de",
      "/search": "Leaderflix | Resultados de búsqueda",
      "/sign_in": "Leaderflix | Iniciar sesión",
      "/sign_up": "Leaderflix | Crear cuenta",
    };

    document.title = titles[location.pathname] || "Leaderflix | Plataforma de entretenimiento";
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign_in");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (!shortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const altOrCmd = isMac ? e.metaKey : e.altKey;

      if (altOrCmd && e.key.toLowerCase() === "h") {
        e.preventDefault();
        navigate("/home");
      } else if (altOrCmd && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate("/profile");
      } else if (altOrCmd && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/about");
      } else if (altOrCmd && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/favorites");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, shortcutsEnabled]);

  const toggleShortcuts = () => {
    const newState = !shortcutsEnabled;
    setShortcutsEnabled(newState);
    localStorage.setItem("shortcutsEnabled", String(newState));
  };

  return (
    <nav
      className="bg-[#141414] text-white relative overflow-visible"
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo con tooltip */}
        <Link
          to="/home"
          className="flex items-center gap-3 cursor-pointer relative group"
          aria-label="Ir al inicio de Leaderflix"
        >
          <img
            src="/Logo.png"
            alt="Logo de Leaderflix"
            className="w-10 h-10 object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold">Leaderflix</h1>
            <p className="text-xs text-gray-400">Explora - Mira - Califica</p>
          </div>
          {/* Tooltip */}
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#E8E8E8] text-gray-800 text-sm px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
            Ir al inicio
          </span>
        </Link>

        {/* Barra de búsqueda */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-[#1f1f1f] px-4 py-2 rounded-full w-1/3 max-w-md"
          role="search"
          aria-label="Buscar contenido"
        >
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar películas, directores, series"
            className="bg-transparent w-full outline-none px-2 text-sm text-gray-300"
            aria-label="Campo de búsqueda"
          />
        </form>

        {/* Íconos (desktop) con tooltips */}
        <div className="hidden md:flex items-center gap-3" role="menubar">
          {/* Favoritas con tooltip */}
          <div className="relative group">
            <Link to="/favorites" aria-label="Ir a favoritas">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer">
                <Heart size={18} />
                <span className="hidden lg:inline">Favoritas</span>
              </button>
            </Link>
            {/* Tooltip */}
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#E8E8E8] text-gray-800 text-sm px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
              Mis Favoritas
            </span>
          </div>

          {/* Perfil con tooltip */}
          <div className="relative group">
            <Link to="/profile" aria-label="Ir al perfil de usuario">
              <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition cursor-pointer">
                <User size={18} />
              </button>
            </Link>
            {/* Tooltip */}
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#E8E8E8] text-gray-800 text-sm px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
              Mi Perfil
            </span>
          </div>

          {/* Atajos de teclado con tooltip */}
          <div className="relative group">
            <button
              onClick={toggleShortcuts}
              className={`p-2 rounded-full transition cursor-pointer ${
                shortcutsEnabled
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              aria-pressed={shortcutsEnabled}
              aria-label={
                shortcutsEnabled ? "Desactivar atajos de teclado" : "Activar atajos de teclado"
              }
            >
              <Keyboard size={18} />
            </button>
            {/* Tooltip */}
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#E8E8E8] text-gray-800 text-sm px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
              {shortcutsEnabled ? "Desactivar atajos" : "Activar atajos"}
            </span>
          </div>

          {/* Cerrar sesión con tooltip */}
          <div className="relative group">
            <button
              onClick={handleLogout}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition cursor-pointer"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
            {/* Tooltip */}
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#E8E8E8] text-gray-800 text-sm px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
              Cerrar sesión
            </span>
          </div>
        </div>

        {/* Menú móvil */}
        <div className="relative group md:hidden">
          <button
            className="p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-[#1f1f1f] border-t border-gray-800"
          role="menu"
        >
          <div className="flex flex-col gap-2 p-4">
            <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
              <button
                role="menuitem"
                className="flex items-center gap-3 w-full text-gray-300 hover:text-white transition py-3 px-4 rounded-lg hover:bg-gray-800"
              >
                <Heart size={18} /> Favoritas
              </button>
            </Link>

            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              <button
                role="menuitem"
                className="flex items-center gap-3 w-full text-gray-300 hover:text-white transition py-3 px-4 rounded-lg hover:bg-gray-800"
              >
                <User size={18} /> Perfil
              </button>
            </Link>

            <button
              onClick={toggleShortcuts}
              role="menuitem"
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                shortcutsEnabled
                  ? "text-green-400 hover:text-green-300"
                  : "text-gray-300 hover:text-white"
              } hover:bg-gray-800`}
            >
              <Keyboard size={18} />{" "}
              {shortcutsEnabled ? "Desactivar atajos" : "Activar atajos"}
            </button>

            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              role="menuitem"
              className="flex items-center gap-3 text-red-400 hover:text-red-300 transition py-3 px-4 rounded-lg hover:bg-gray-800"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}