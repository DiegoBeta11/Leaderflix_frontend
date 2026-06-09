import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook para habilitar o deshabilitar la navegación por teclado accesible
 * Atajos: Alt + H (Home), Alt + P (Perfil), Alt + A (Acerca de)
 */
export const useKeyboardNavigation = () => {
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "h") navigate("/home");
      if (e.altKey && e.key === "p") navigate("/profile");
      if (e.altKey && e.key === "a") navigate("/about");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, navigate]);

  const toggleNavigation = () => setEnabled((prev) => !prev);

  return { enabled, toggleNavigation };
};
