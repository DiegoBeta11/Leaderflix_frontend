import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import SignIn from "../pages/sign_in";
import SignUp from "../pages/sign_up";
import Home from "../pages/home";
import Profile from "../pages/profile";
import ForgotPassword from "../pages/forgotPassword";
import ResetPassword from "../pages/reset_password";
import About from "../pages/about";
import Favorites from "../pages/favorites";
import SearchResults from "../pages/search";

const AppRoutes = () => {
  return (
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/sign_in" replace />} />
          <Route path="/sign_in" element={<SignIn />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default AppRoutes;
