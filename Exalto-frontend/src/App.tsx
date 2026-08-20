import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/home";
import ShopPage from "./pages/shop";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
