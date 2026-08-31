import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AdminProvider } from "./context/AdminContext";

import Home from "./pages/home";
import Shop from "./pages/shop";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import CartPage from "./pages/cart";
import Login from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot-password";
import FavoritesPage from "./pages/favorites";
import AdminLogin from "./pages/admin-login";
import AdminDashboard from "./pages/admin-dashboard";

const ADMIN_PATHS = ["/admin-login", "/admin-dashboard"];

function Layout() {
  const { pathname } = useLocation();
  const isAdmin = ADMIN_PATHS.includes(pathname);

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <CartProvider>
          <FavoritesProvider>
            <Layout />
          </FavoritesProvider>
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;
