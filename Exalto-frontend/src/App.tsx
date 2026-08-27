import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/home";
import ShopPage from "./pages/shop";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import CartPage from "./pages/cart";
import LoginPage from "./pages/login";
import { CartProvider } from "./context/CartContext";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot-password";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>

        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
