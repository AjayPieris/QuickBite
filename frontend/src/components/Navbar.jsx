// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  User,
  ClipboardList,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Utensils,
  LayoutDashboard,
  Zap,
} from "lucide-react";

// Common neumorphic styles
const colors = {
  primary: '#2C1A0E',
  muted: '#A08060',
  accent: '#E8732A',
  bg: '#F0E8DC',
  success: '#5AAB5E',
  error: '#E85A2A',
  blue: '#4A90E2', 
  warning: '#F5A623', 
}

const neumorphic = {
  raised: {
    background: colors.bg,
    boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85)',
    border: 'none',
  },
  inset: {
    background: colors.bg,
    boxShadow: 'inset 5px 5px 12px rgba(180,130,90,0.26), inset -5px -5px 12px rgba(255,255,255,0.78)',
    border: 'none',
  },
  buttonRaised: {
    background: 'linear-gradient(135deg, #E8732A, #C87820)',
    boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85), 0 4px 12px rgba(232,115,42,0.3)',
    border: 'none',
    color: '#ffffff'
  }
}

const fonts = {
  heading: { fontFamily: "'Outfit', sans-serif" },
  body: { fontFamily: "'Outfit', sans-serif" }
}

const pillStyle = (scrolled) => ({
  background: scrolled ? colors.bg : "transparent",
  boxShadow: scrolled ? '6px 6px 16px rgba(180,130,90,0.3), -6px -6px 16px rgba(255,255,255,0.8)' : "none",
  borderRadius: "9999px",
  transition: "all 0.3s ease",
});

export default function Navbar() {
  const { user, logout, setUser } = useAuth();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("qb_token");
    localStorage.removeItem("qb_cart");
    window.location.href = "/welcome";
  };

  const handleDemoLogin = () => {
    localStorage.setItem("qb_token", "demo_token");
    setUser({ id: 999, name: "Demo User", role: "user" });
    navigate("/");
    setMobileOpen(false);
  };

  const navLinks = user
    ? [
        {
          to: "/",
          label: "Menu",
          icon: <Utensils size={14} strokeWidth={2.5} />,
        },
        ...(user.role !== "admin"
          ? [
              {
                to: "/orders",
                label: "My Orders",
                icon: <ClipboardList size={14} strokeWidth={2.5} />,
              },
            ]
          : []),
      ]
    : [
        {
          to: "/login",
          label: "Login",
          icon: <User size={14} strokeWidth={2.5} />,
        },
        {
          to: "/register",
          label: "Sign Up",
          icon: <Zap size={14} strokeWidth={2.5} />,
        },
      ];

  const isActive = (to) =>
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ padding: "14px 16px 0", ...fonts.body }}
      >
        <motion.nav
          initial={{ y: -80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={pillStyle(scrolled)}
          className="w-full max-w-5xl px-3 py-2.5 flex items-center justify-between"
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0 pl-1"
          >
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
              style={neumorphic.inset}
            >
              <Utensils size={18} color={colors.accent} strokeWidth={2.5} />
            </motion.div>
            <span className="font-bold text-[18px] tracking-tight hidden sm:block" style={{ color: colors.primary }}>
              Quick<span style={{ color: colors.accent }}>Bite</span>
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link key={link.to} to={link.to}>
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300`}
                    style={
                      active 
                        ? neumorphic.buttonRaised 
                        : { color: colors.muted, background: 'transparent' }
                    }
                  >
                    {link.icon}
                    {link.label}
                  </motion.div>
                </Link>
              )
            })}
            {user?.role === "admin" && (
              <Link to="/admin">
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300`}
                  style={
                    location.pathname.startsWith("/admin")
                      ? neumorphic.buttonRaised 
                      : { color: colors.muted, background: 'transparent' }
                  }
                >
                  <LayoutDashboard size={14} strokeWidth={2.5} /> Admin
                </motion.div>
              </Link>
            )}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-3 pr-1">
            {/* Cart */}
            {user && (
              <Link to="/cart">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92, ...neumorphic.inset }}
                  className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={neumorphic.raised}
                >
                  <ShoppingCart
                    size={18}
                    color={colors.primary}
                    strokeWidth={2}
                  />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key={totalItems}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#F0E8DC]"
                        style={{ background: colors.accent }}
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )}

            {/* Profile dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-3 px-3 py-2 rounded-full transition-all"
                  style={neumorphic.raised}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center" style={neumorphic.inset}>
                    {user.profile_image_url ? (
                      <img
                        src={user.profile_image_url}
                        className="w-full h-full object-cover p-0.5 rounded-full"
                        alt="avatar"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-[11px] font-bold"
                        style={{ color: colors.accent }}
                      >
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-[14px] font-semibold hidden sm:block" style={{ color: colors.primary }}>
                    {user.name?.split(" ")[0]}
                  </span>
                  <motion.div
                    animate={{ rotate: dropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown
                      size={14}
                      color={colors.muted}
                      strokeWidth={2.5}
                    />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.93 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.93 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-4 w-52 overflow-hidden py-2"
                      style={{
                        borderRadius: '24px',
                        ...neumorphic.raised,
                        zIndex: 100
                      }}
                    >
                      <div className="px-2">
                        {[
                          {
                            to: "/profile",
                            icon: <User size={15} strokeWidth={2.5} />,
                            label: "My Profile",
                          },
                          {
                            to: "/orders",
                            icon: <ClipboardList size={15} strokeWidth={2.5} />,
                            label: "Order History",
                          },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setDropdown(false)}
                          >
                            <motion.div
                              whileHover={{ scale: 0.98, ...neumorphic.inset }}
                              className="flex items-center gap-3 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all mb-1"
                              style={{ color: colors.primary }}
                            >
                              <span style={{ color: colors.accent }}>{item.icon}</span>
                              {item.label}
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                      
                      <div className="mx-4 my-1 opacity-20 border-t" style={{ borderColor: colors.muted }} />
                      
                      <div className="px-2">
                        <motion.button
                          whileHover={{ scale: 0.98, ...neumorphic.inset }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-[14px] font-bold transition-all mt-1"
                          style={{ color: colors.error }}
                        >
                          <LogOut size={15} strokeWidth={2.5} /> Logout Account
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={handleDemoLogin} className="hidden md:block">
                <motion.div
                  whileHover={{ y: -1, boxShadow: neumorphic.buttonRaised.boxShadow.replace('0.3', '0.45') }}
                  whileTap={{ scale: 0.96 }}
                  className="px-6 py-2.5 rounded-full text-[14px] font-bold text-white flex items-center gap-2"
                  style={neumorphic.buttonRaised}
                >
                  <Zap size={14} fill="currentColor" /> Let's Go
                </motion.div>
              </button>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.92, ...neumorphic.inset }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={neumorphic.raised}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ color: colors.primary }}
                  >
                    <X size={20} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ color: colors.primary }}
                  >
                    <Menu size={20} strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 md:hidden bg-black/10 backdrop-blur-sm"
            />

            {/* Drawer pill */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="fixed top-24 left-4 right-4 z-40 md:hidden p-4"
              style={{
                borderRadius: '32px',
                ...neumorphic.raised,
                ...fonts.body,
              }}
            >
              {/* Links */}
              <div className="flex flex-col gap-2 mb-4">
                {navLinks.map((link, i) => {
                  const active = isActive(link.to);
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link to={link.to}>
                        <motion.div
                          whileTap={{ scale: 0.96 }}
                          className={`flex items-center gap-3 px-5 py-4 rounded-[20px] text-[15px] font-semibold transition-all`}
                          style={
                            active 
                              ? neumorphic.buttonRaised 
                              : { ...neumorphic.inset, color: colors.primary }
                          }
                        >
                          <span style={{ color: active ? '#fff' : colors.accent }}>{link.icon}</span> 
                          {link.label}
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
                {user?.role === "admin" && (
                  <Link to="/admin">
                    <motion.div
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center gap-3 px-5 py-4 rounded-[20px] text-[15px] font-bold transition-all"
                      style={
                         location.pathname.startsWith("/admin")
                          ? neumorphic.buttonRaised
                          : { ...neumorphic.inset, color: colors.primary }
                      }
                    >
                      <span style={{ color: location.pathname.startsWith("/admin") ? '#fff' : colors.accent }}><LayoutDashboard size={15} strokeWidth={2.5} /></span> 
                      Admin Dashboard
                    </motion.div>
                  </Link>
                )}
              </div>

              {/* Divider */}
              {user && <div className="mx-4 mb-4 opacity-10 border-t border-black" />}

              {/* Logout */}
              {user && (
                <motion.button
                  whileTap={{ scale: 0.96, ...neumorphic.inset }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-[20px] text-[15px] font-bold transition-all bg-transparent"
                  style={{ color: colors.error }}
                >
                  <LogOut size={16} strokeWidth={2.5} /> Logout
                </motion.button>
              )}

              {/* Get started for guests */}
              {!user && (
                <button onClick={handleDemoLogin} className="mt-2 block w-full">
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center justify-center gap-2 px-5 py-4 rounded-[20px] text-[15px] font-bold"
                    style={neumorphic.buttonRaised}
                  >
                    <Zap size={16} strokeWidth={2.5} fill="currentColor" /> Let's Go
                  </motion.div>
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
