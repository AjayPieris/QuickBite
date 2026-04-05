// src/pages/Login.jsx
// Centered login card with elegant design

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      login(res.data.access_token);
      navigate("/menu");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Background */}
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute top-[20%] left-[30%] w-125 h-125 bg-accent/[0.07] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-100 h-100 bg-accent-dark/5 rounded-full blur-[150px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <motion.div
          animate={shake ? { x: [-12, 12, -12, 12, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-115"
        >
          {/* Logo */}
          <div className="text-center mb-10">
            <Link to="/welcome" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-accent-dark flex items-center justify-center shadow-xl shadow-accent/25">
                <span className="text-xl">🍽</span>
              </div>
              <span className="text-2xl font-bold gradient-text tracking-tight">
                QuickBite
              </span>
            </Link>
            <h1 className="text-[28px] font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-[#666] text-[15px]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#141414] rounded-4xl border border-white/6 p-8 md:p-12 shadow-2xl shadow-black/40">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/8 border border-red-500/12 overflow-hidden"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                  </div>
                  <span className="text-red-400/90 text-[13px] font-medium">
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block text-[14px] font-medium text-[#999] ml-1"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full h-[52px] px-5 bg-white/4 border border-white/8 rounded-2xl text-white text-[15px] placeholder-[#555] hover:border-white/15 focus:border-accent/50 focus:bg-white/6 outline-none transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="login-pw"
                  className="block text-[14px] font-medium text-[#999] ml-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-pw"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full h-[52px] px-5 pr-14 bg-white/4 border border-white/8 rounded-2xl text-white text-[15px] placeholder-[#555] hover:border-white/15 focus:border-accent/50 focus:bg-white/6 outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-2 top-1.5 w-10 h-10 rounded-xl flex items-center justify-center text-[#666] hover:text-white hover:bg-white/6 transition-all"
                  >
                    {showPw ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pb-2 ml-1">
                <label
                  className="flex items-center gap-3 cursor-pointer select-none group"
                  onClick={() => setRemember(!remember)}
                >
                  <div
                    className={`w-10.5 h-6 rounded-full transition-colors duration-300 relative cursor-pointer ${remember ? "bg-accent" : "bg-white/8 group-hover:bg-white/12"}`}
                  >
                    <motion.div
                      animate={{ x: remember ? 20 : 3 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="absolute top-0.75 w-4.5 h-4.5 rounded-full bg-white shadow-md"
                    />
                  </div>
                  <span className="text-[14px] text-[#888] group-hover:text-[#aaa] transition-colors">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-linear-to-tr from-[#fcc025] to-[#e6ad03] text-[#563e00] font-bold text-lg rounded-full shadow-[0_10px_40px_-10px_rgba(252,192,37,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center tracking-wide"
              >
                {loading ? (
                  <svg
                    className="w-6 h-6 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-[14px] text-[#555] mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-accent hover:text-[#fbbf24] font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
