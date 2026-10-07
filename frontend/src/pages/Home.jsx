import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';

const categories = [
  { name: "Electronics", filter: "Electronics", icon: "◉" },
  { name: "Fashion", filter: "Fashion", icon: "◇" },
  { name: "Home", filter: "Home", icon: "⌂" },
  { name: "Books", filter: "Books", icon: "✦" },
  { name: "Other", filter: "Other", icon: "○" }
];

function Home() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { checkAuth, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        //to display the first 4 products on the home page
        setProducts(response.data.products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products for home page", error);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await fetch("/customers/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log("Logout response:", data);
      await checkAuth(); // Clear user from context
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      await checkAuth(); // Ensure user is cleared even if network fails
      toast.success("Logged out / session cleared");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">

      {/* TOP ANNOUNCEMENT */}
      <div className="bg-[#111] px-4 py-2 text-center text-[11px] font-medium tracking-[0.18em] text-white">
        FREE SHIPPING ON ORDERS OVER ₹999
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f7f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center px-5 sm:px-8">

          <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
            Shop<span className="text-[#6d5dfc]">Kart</span>
          </Link>

          <nav className="ml-14 hidden items-center gap-9 text-[13px] font-medium lg:flex">
            <Link to="/products" className="transition hover:text-[#6d5dfc]">New Arrivals</Link>
            <Link to="/products" className="transition hover:text-[#6d5dfc]">Categories</Link>
            <Link to="/products" className="transition hover:text-[#6d5dfc]">Best Sellers</Link>
            <Link to="/products" className="font-semibold text-[#6d5dfc]">Deals</Link>
          </nav>

          <div className="ml-auto flex items-center gap-3 sm:gap-6">

            {/* SEARCH */}
            <button className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-gray-500 transition hover:border-black/20 md:flex">
              <span>⌕</span>
              <span>Search products</span>
            </button>

            {user ? (
              <div className="group relative z-50">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[15px] font-bold text-gray-700 transition hover:bg-gray-200 uppercase">
                  {(user?.fullname || user?.fullName)?.charAt(0) || "👤"}
                </button>

                <div className="invisible absolute right-0 top-full mt-2 w-64 translate-y-2 rounded-2xl border border-black/[0.08] bg-white p-2 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="mb-2 flex items-center gap-3 border-b border-gray-100 px-3 pb-3 pt-2">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f1efff] text-lg font-bold uppercase text-[#6d5dfc]">
                      {(user?.fullname || user?.fullName)?.charAt(0) || "👤"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <p className="truncate text-sm font-bold text-gray-900">{user?.fullname || user?.fullName}</p>
                      <p className="truncate text-[12px] text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Link to="/profile" className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-[#6d5dfc]">
                    Edit Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc] sm:block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc] sm:block"
                >
                  Register
                </Link>
              </>
            )}

            <button className="relative text-[21px] transition hover:scale-105">
              ♡
            </button>

            <button className="relative text-[20px] transition hover:scale-105">
              🛒
              <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#6d5dfc] px-1 text-[9px] font-bold text-white">
                2
              </span>
            </button>

            <button className="text-xl lg:hidden">☰</button>
          </div>
        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-8 lg:pt-8">
          <div className="relative min-h-[540px] overflow-hidden rounded-[28px] bg-[#151515]">

            {/* Background image */}
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800"
              alt="ShopKart collection"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

            <div className="relative z-10 flex min-h-[540px] items-center px-7 py-16 sm:px-14 lg:px-20">

              <div className="max-w-[620px] text-white">

                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-10 bg-white/70" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/75">
                    The new collection
                  </span>
                </div>

                <h1 className="text-[48px] font-black leading-[0.98] tracking-[-0.055em] sm:text-[64px] lg:text-[78px]">
                  Better things.
                  <br />
                  <span className="text-white/55">Better prices.</span>
                </h1>

                <p className="mt-7 max-w-[500px] text-[15px] leading-7 text-white/70 sm:text-[17px]">
                  Discover products designed to make everyday life better.
                  Curated essentials, standout pieces and unbeatable value.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link to="/products" className="inline-block rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[#6d5dfc] hover:text-white">
                    Shop collection →
                  </Link>

                  <Link to="/products" className="inline-block rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold backdrop-blur-md transition hover:bg-white/20">
                    Explore deals
                  </Link>
                </div>

              </div>
            </div>

            {/* Hero floating badge */}
            <div className="absolute bottom-7 right-7 hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl md:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Up to
              </p>
              <p className="mt-1 text-3xl font-black text-white">70%</p>
              <p className="text-xs text-white/60">off selected products</p>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8">
          <div className="grid grid-cols-2 divide-x divide-black/10 border-y border-black/10 py-5 md:grid-cols-4">

            {[
              ["01", "Free shipping", "On orders over ₹999"],
              ["02", "Easy returns", "7-day return policy"],
              ["03", "Secure payments", "100% protected checkout"],
              ["04", "Curated quality", "Products we believe in"],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="px-4 py-3 first:pl-0 last:pr-0 sm:px-7"
              >
                <div className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#6d5dfc]">
                  {number}
                </div>
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-1 text-[11px] text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">

          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6d5dfc]">
                Browse
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Shop by category
              </h2>
            </div>

            <Link to="/products" className="hidden text-xs font-bold sm:block">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => (
              <Link
                to={`/products?category=${encodeURIComponent(category.filter)}`}
                key={category.name}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#f1efff] text-lg text-[#6d5dfc] transition group-hover:bg-[#6d5dfc] group-hover:text-white">
                  {category.icon}
                </div>

                <p className="text-sm font-bold">{category.name}</p>

                <span className="absolute bottom-5 right-5 text-xs text-gray-300 transition group-hover:text-[#6d5dfc]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8">

          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6d5dfc]">
                Trending now
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Popular picks
              </h2>
            </div>

            <Link to="/products" className="text-xs font-bold hover:text-[#6d5dfc] transition">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

            {products.map((product) => (
              <article
                key={product._id}
                className="group overflow-hidden rounded-2xl bg-white transition duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col border border-gray-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase shadow-sm">
                    {product.category}
                  </span>
                  <Link to={`/products/${product._id}`} className="absolute bottom-3 left-3 right-3 translate-y-4 rounded-xl bg-black py-3 text-center text-xs font-bold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#6d5dfc]">
                    View Details
                  </Link>
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[13px] font-bold line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-black">
                      ₹{product.price}
                    </span>
                    <span className="text-[10px] text-gray-400">4.8 ★</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BIG PROMO */}
        <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8">
          <div className="relative overflow-hidden rounded-[28px] bg-[#e8e5ff] px-7 py-12 sm:px-12 lg:px-16 lg:py-16">

            <div className="relative z-10 max-w-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6d5dfc]">
                Limited time
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Your cart called.
                <br />
                It wants a discount.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-gray-600">
                Save up to 70% on selected products before the offer
                disappears.
              </p>

              <Link to="/products" className="inline-block mt-7 rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#6d5dfc]">
                Shop the sale →
              </Link>
            </div>

            <div className="absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full border-[70px] border-white/50" />
            <div className="absolute -bottom-40 right-32 h-[320px] w-[320px] rounded-full border-[50px] border-[#6d5dfc]/10" />
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#111] text-white">

        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">

          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">

            <div>
              <div className="text-2xl font-black tracking-[-0.05em]">
                Shop<span className="text-[#8b7cff]">Kart</span>
              </div>

              <p className="mt-5 max-w-xs text-sm leading-6 text-white/45">
                A modern marketplace for products you'll actually want to
                keep.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                Shop
              </h3>

              <div className="mt-5 space-y-3 text-sm text-white/50">
                <p className="cursor-pointer hover:text-white">New arrivals</p>
                <p className="cursor-pointer hover:text-white">Categories</p>
                <p className="cursor-pointer hover:text-white">Best sellers</p>
                <p className="cursor-pointer hover:text-white">Deals</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                Help
              </h3>

              <div className="mt-5 space-y-3 text-sm text-white/50">
                <p className="cursor-pointer hover:text-white">Contact</p>
                <p className="cursor-pointer hover:text-white">Shipping</p>
                <p className="cursor-pointer hover:text-white">Returns</p>
                <p className="cursor-pointer hover:text-white">FAQ</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                Newsletter
              </h3>

              <p className="mt-5 text-sm leading-6 text-white/45">
                New drops, exclusive offers and things worth knowing.
              </p>

              <div className="mt-5 flex border-b border-white/20 pb-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/30"
                />

                <button className="text-sm font-bold">
                  →
                </button>
              </div>
            </div>

          </div>

          <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/30 sm:flex-row">
            <p>© 2026 ShopKart. All rights reserved.</p>
            <div className="flex gap-6">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default Home;


