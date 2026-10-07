import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetails"
import Profile from "./pages/Profile"
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import NotFound from './pages/NotFound';

function App() {

  return (
    <AuthProvider>
      <CartProvider>
       <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
       </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
