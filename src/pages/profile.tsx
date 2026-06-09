import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Calendar,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getUserProfile, updateUserProfile, deleteUserAccount } from "../services/api";

/**
 * Profile Component
 * Displays and manages user profile information
 * Accessible version (WCAG 2.1 – 3.3.1 Error Identification)
 */
export default function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Main user data
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    username: "",
    birthdate: "",
  });

  // Editable form data
  const [formData, setFormData] = useState(userData);

  // Password management
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  // Error message for password section
  const [passwordError, setPasswordError] = useState("");

  /** Validates password strength */
  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  /** Load user profile */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("No se encontró el ID del usuario");

        const data = await getUserProfile(userId);
        setUserData(data);
        setFormData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /** Handle text field changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle password changes */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  /** Toggle password visibility */
  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /** Save changes (profile + optional password) */
  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró el ID del usuario");

      const { newPassword, confirmPassword } = passwordData;

      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          setPasswordError("Las contraseñas no coinciden.");
          return;
        }
        if (!validarContrasena(newPassword)) {
          setPasswordError(
            "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial."
          );
          return;
        }
      }

      const updatedInfo = {
        username: formData.username,
        email: formData.email,
        birthdate: formData.birthdate,
        ...(newPassword && { password: newPassword }),
      };

      const updated = await updateUserProfile(userId, updatedInfo);
      setUserData(updated);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setPasswordError("");
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar los cambios");
    }
  };

  /** Delete account */
  const handleDelete = async () => {
    if (
      !confirm(
        "¿Seguro que deseas eliminar tu perfil? Esta acción es irreversible."
      )
    )
      return;
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró el ID del usuario");

      await deleteUserAccount(userId);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      alert("Perfil eliminado correctamente.");
      navigate("/sign_in");
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la cuenta.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#141414] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <div
          className="relative w-full max-w-md bg-black/80 rounded-2xl shadow-2xl p-8 border border-gray-800"
          role="form"
          aria-label="Formulario de perfil de usuario"
        >
          {/* Back button */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition mb-6 font-medium"
            aria-label="Volver al inicio"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Mi perfil
          </h1>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="bg-red-600 rounded-full w-24 h-24 flex items-center justify-center">
              <UserIcon size={48} className="text-white" />
            </div>
          </div>

          {/* Editable fields */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Información de la cuenta
            </h3>

            {/* Username */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <UserIcon size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label htmlFor="username" className="text-xs text-gray-500 block">
                    Nombre de usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    aria-required="true"
                    className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label htmlFor="email" className="text-xs text-gray-500 block">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-required="true"
                    className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1"
                  />
                </div>
              </div>
            </div>

            {/* Birth date */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 border border-gray-700 mb-8">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label htmlFor="birthdate" className="text-xs text-gray-500 block">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="birthdate"
                    type="date"
                    name="birthdate"
                    value={
                      formData.birthdate
                        ? formData.birthdate.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    aria-required="true"
                    className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100"
                  />
                </div>
              </div>
            </div>

            {/* Password update section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Actualizar contraseña
              </h3>

              {/* Nueva contraseña */}
              <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <label
                      htmlFor="newPassword"
                      className="text-xs text-gray-500 block"
                    >
                      Nueva contraseña
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        aria-label="Nueva contraseña"
                        aria-required="false"
                        aria-invalid={passwordError ? "true" : "false"}
                        aria-describedby={passwordError ? "passwordError" : undefined}
                        className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        aria-label={
                          showPasswords.new
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        className="text-gray-400 hover:text-white transition"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs text-gray-500 block"
                    >
                      Confirmar nueva contraseña
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        aria-label="Confirmar nueva contraseña"
                        aria-required="false"
                        aria-invalid={passwordError ? "true" : "false"}
                        aria-describedby={passwordError ? "passwordError" : undefined}
                        className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        aria-label={
                          showPasswords.confirm
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        className="text-gray-400 hover:text-white transition"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de error accesible */}
              {passwordError && (
                <p
                  id="passwordError"
                  role="alert"
                  aria-live="assertive"
                  className="text-red-500 text-sm mt-2 text-center font-medium"
                >
                  {passwordError}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition shadow-md"
            >
              Guardar cambios
            </button>

            <button
              onClick={handleDelete}
              className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-semibold transition shadow-md"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
