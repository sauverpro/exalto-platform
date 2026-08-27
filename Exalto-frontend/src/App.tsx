import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/home";
import Shop from "./pages/shop";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import CartPage from "./pages/cart";
import Login from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot-password";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>

        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
