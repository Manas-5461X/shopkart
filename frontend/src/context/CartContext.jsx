// We need a global state so that the navbar cart counter stays synced with the cart page and we dont need to fetch data in every component 


import React, { createContext, useState, useEffect, useContext } from 'react';
import { axiosInstance } from '../axiosCalls/axios.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const res = await axiosInstance.get('/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to load cart");
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axiosInstance.post(`/cart/${productId}`);
      toast.success("Added to Cart!");
      fetchCart(); // Refresh cart to get populated data and new quantities
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add to cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axiosInstance.patch(`/cart/${productId}`, { quantity });
      fetchCart(); // Refresh
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/${productId}`);
      toast.success("Removed from Cart");
      fetchCart(); // Refresh
    } catch (error) {
      toast.error("Could not remove item");
    }
  };

  // Derived values
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartSubtotal, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};