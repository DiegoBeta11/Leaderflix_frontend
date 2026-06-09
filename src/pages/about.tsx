import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * About Component
 * Displays comprehensive information about the Leaderflix platform
 * Includes university project details, team members, mission, and contact information
 * @returns {JSX.Element} About page with full platform information
 */
const About: React.FC = () => {
  // Hook for programmatic navigation (used for back button)
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      
      {/* Header section with navigation */}
      <header className="bg-black/80 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          {/* Back button - navigates to previous page in history */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors mr-4"
            aria-label="Go back"
          >
            {/* Left chevron SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {/* Page title */}
          <h1 className="text-2xl font-bold">Acerca de Leaderflix</h1>
        </div>
      </header>

      {/* Main content container with centered layout */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Hero section with logo and tagline */}
        <div className="text-center mb-12">
          {/* Platform logo */}
          <img
            src="/Logo.png"
            alt="Leaderflix logo"
            className="w-32 h-32 mx-auto mb-6"
          />
          {/* Platform name with gradient text effect */}
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Leaderflix
          </h2>
          {/* Platform tagline */}
          <p className="text-xl text-gray-300">
            Tu plataforma de streaming educativo
          </p>
        </div>

        {/* University Project Information Section */}
        <section className="bg-black/50 rounded-2xl p-8 mb-8 border border-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-red-500">
            Proyecto Académico
          </h3>
          {/* First paragraph: University and course context */}
          <p className="text-gray-300 leading-relaxed mb-4">
            Leaderflix es un proyecto desarrollado por estudiantes de la{" "}
            <span className="text-red-500 font-semibold">
              Universidad del Valle - Sede Yumbo
            </span>
            , como parte del curso de{" "}
            <span className="text-red-500 font-semibold">
              Proyecto Integrador 1
            </span>
            .
          </p>
          {/* Second paragraph: Project significance and scope */}
          <p className="text-gray-300 leading-relaxed">
            Este proyecto representa la integración de conocimientos adquiridos
            en diferentes áreas de la ingeniería de sistemas, aplicando
            tecnologías modernas para crear una solución innovadora en el ámbito
            del streaming educativo.
          </p>
        </section>

        {/* Development Team Section */}
        <section className="bg-black/50 rounded-2xl p-8 mb-8 border border-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-red-500 text-center">
            Nuestro Equipo
          </h3>
          <p className="text-gray-300 text-center mb-8">
            Desarrollado con dedicación por:
          </p>
          {/* Grid layout for team members - 2 columns on medium+ screens */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Team Member Card 1: Diego Betancourt */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors">
              <div className="flex items-center space-x-4">
                {/* Avatar with initials */}
                <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  DB
                </div>
                {/* Member information */}
                <div>
                  <h4 className="font-bold text-lg">Diego Betancourt</h4>
                  <p className="text-gray-400 text-sm">Desarrollador</p>
                </div>
              </div>
            </div>

            {/* Team Member Card 2: Yancarlo Ospina */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  YO
                </div>
                <div>
                  <h4 className="font-bold text-lg">Yancarlo Ospina</h4>
                  <p className="text-gray-400 text-sm">Desarrollador</p>
                </div>
              </div>
            </div>

            {/* Team Member Card 3: Andrés Mesa */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  AM
                </div>
                <div>
                  <h4 className="font-bold text-lg">Andrés Mesa</h4>
                  <p className="text-gray-400 text-sm">Desarrollador</p>
                </div>
              </div>
            </div>

            {/* Team Member Card 4: Juan Manuel Mena */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  JM
                </div>
                <div>
                  <h4 className="font-bold text-lg">Juan Manuel Mena</h4>
                  <p className="text-gray-400 text-sm">Desarrollador</p>
                </div>
              </div>
            </div>

            {/* Team Member Card 5: Benjamin Rizo - Centered on medium+ screens */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors md:col-span-2 md:w-1/2 md:mx-auto">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  BR
                </div>
                <div>
                  <h4 className="font-bold text-lg">Benjamin Rizo</h4>
                  <p className="text-gray-400 text-sm">Desarrollador</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Mission Statement Section */}
        <section className="bg-black/50 rounded-2xl p-8 mb-8 border border-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-red-500">
            Nuestra Misión
          </h3>
          {/* Mission description emphasizing accessibility and modern learning */}
          <p className="text-gray-300 leading-relaxed">
            Leaderflix nace con el objetivo de democratizar el acceso a contenido
            educativo de calidad. Creemos que el aprendizaje debe ser accesible,
            entretenido y adaptado a las necesidades del siglo XXI. Nuestra
            plataforma combina lo mejor del streaming con recursos educativos
            cuidadosamente seleccionados.
          </p>
        </section>

        {/* Contact Information Section */}
        <section className="bg-black/50 rounded-2xl p-8 border border-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-red-500">
            Contáctanos
          </h3>
          <p className="text-gray-300 mb-4">
            ¿Tienes preguntas o sugerencias? Nos encantaría escucharte.
          </p>
          {/* Contact details list */}
          <div className="space-y-2 text-gray-400">
            {/* Email contact with envelope icon */}
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              contacto@leaderflix.com
            </p>
            {/* Physical location with building icon */}
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Universidad del Valle - Sede Yumbo
            </p>
          </div>
        </section>
      </main>

      {/* Page Footer with copyright information */}
      <footer className="bg-black/80 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          {/* Copyright notice */}
          <p>&copy; 2025 Leaderflix - Universidad del Valle, Sede Yumbo</p>
          {/* Course reference */}
          <p className="mt-1">Proyecto Integrador 1</p>
        </div>
      </footer>
    </div>
  );
};

export default About;