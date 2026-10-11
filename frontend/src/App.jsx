import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
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
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminRoute from "./components/AdminRoute";
import { CartProvider } from './context/CartContext';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

function ConditionalFooter() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/register'];
  if (hideFooterRoutes.includes(location.pathname)) {
    return null;
  }
  return <Footer />;
}

function App() {

  return (
    <AuthProvider>
      <CartProvider>
       <BrowserRouter>
        <Toaster position="bottom-right" reverseOrder={false} />
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ConditionalFooter />
        </div>
       </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
