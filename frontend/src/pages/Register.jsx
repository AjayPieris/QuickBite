// src/pages/Register.jsx
// Centered register card matching login design, with password strength + confetti

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";

function getStrength(p) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s <= 1) return { level: "Weak", color: "#ef4444", pct: 25 };
  if (s <= 3) return { level: "Medium", color: "#eab308", pct: 60 };
  return { level: "Strong", color: "#22c55e", pct: 100 };
}

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 6,
      color: ["#f97316", "#fbbf24", "#22c55e", "#3b82f6", "#a855f7"][i % 5],
      isRound: Math.random() > 0.5,
    })),
  );

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.isRound ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("user");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const nameOk = form.name.length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const pwStr = getStrength(form.password);
  const pwOk = form.password.length >= 6;
  const allOk = nameOk && emailOk && pwOk;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allOk) return;
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      await api.post("/auth/register", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const Check = () => (
    <div className="absolute right-3 top-[46px] w-6 h-6 rounded-full bg-[#22c55e]/15 flex items-center justify-center">
      <svg
        className="w-3.5 h-3.5 text-[#22c55e]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    </div>
  );

  return (
    <PageTransition>
      {success && <Confetti />}
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* BG Effects */}
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute top-[15%] right-[25%] w-125 h-125 bg-accent/[0.07] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[15%] left-[20%] w-100 h-100 bg-accent-dark/5 rounded-full blur-[150px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 w-full max-w-115">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-3xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    className="w-10 h-10 text-[#22c55e]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Account Created! 🎉
                </h2>
                <p className="text-[#666]">Redirecting to login...</p>
              </motion.div>
            ) : (
              <motion.div key="form">
                {/* Logo */}
                <div className="text-center mb-10">
                  <Link
                    to="/welcome"
                    className="inline-flex items-center gap-3 mb-6"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-accent-dark flex items-center justify-center shadow-xl shadow-accent/25">
                      <span className="text-xl">🍽</span>
                    </div>
                    <span className="text-2xl font-bold gradient-text tracking-tight">
                      QuickBite
                    </span>
                  </Link>
                  <h1 className="text-[28px] font-bold text-white mb-2">
                    Create your account
                  </h1>
                  <p className="text-[#666] text-[15px]">
                    Join QuickBite and start ordering today
                  </p>
                </div>

                {/* Card */}
                <div className="bg-[#141414] rounded-4xl border border-white/6 p-8 md:p-12 shadow-2xl shadow-black/40">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/8 border border-red-500/12 mb-6"
                    >
                      <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                        <span className="text-sm">⚠️</span>
                      </div>
                      <span className="text-red-400/90 text-[13px]">
                        {error}
                      </span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2 relative">
                      <label className="block text-[14px] font-medium text-[#999] ml-1">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                        placeholder="John Doe"
                        autoComplete="name"
                        className="w-full h-[52px] px-5 pr-10 bg-white/4 border border-white/8 rounded-2xl text-white text-[15px] placeholder-[#555] hover:border-white/15 focus:border-accent/50 focus:bg-white/6 outline-none transition-all duration-300"
                      />
                      {nameOk && <Check />}
                    </div>

                    {/* Email */}
                    <div className="space-y-2 relative">
                      <label className="block text-[14px] font-medium text-[#999] ml-1">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                        placeholder="name@company.com"
                        autoComplete="email"
                        className="w-full h-[52px] px-5 pr-10 bg-white/4 border border-white/8 rounded-2xl text-white text-[15px] placeholder-[#555] hover:border-white/15 focus:border-accent/50 focus:bg-white/6 outline-none transition-all duration-300"
                      />
                      {emailOk && <Check />}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="block text-[14px] font-medium text-[#999] ml-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          required
                          placeholder="Min. 6 characters"
                          autoComplete="new-password"
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
                      {form.password && (
                        <div className="mt-4 flex items-center gap-4 ml-1">
                          <div className="flex-1 h-2 bg-white/4 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pwStr.pct}%` }}
                              className="h-full rounded-full transition-all duration-500"
                              style={{ backgroundColor: pwStr.color }}
                            />
                          </div>
                          <span
                            className="text-[12px] font-bold shrink-0 uppercase tracking-wider"
                            style={{ color: pwStr.color }}
                          >
                            {pwStr.level}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Role Toggle */}
                    <div className="space-y-2 pb-2">
                      <label className="block text-[14px] font-medium text-[#999] ml-1">
                        Register as
                      </label>
                      <div className="flex gap-3">
                        {[
                          { key: "user", label: "Customer", icon: "👤" },
                          { key: "admin", label: "Admin", icon: "⚙️" },
                        ].map((r) => (
                          <button
                            key={r.key}
                            type="button"
                            onClick={() => setRole(r.key)}
                            className={`flex-1 h-12 rounded-2xl text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                              role === r.key
                                ? "bg-accent text-white shadow-xl shadow-accent/30 -translate-y-[1px]"
                                : "bg-white/4 border border-white/8 text-[#777] hover:text-white hover:border-white/15 hover:bg-white/6"
                            }`}
                          >
                            <span>{r.icon}</span> {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={!allOk || loading}
                      className="w-full h-14 rounded-2xl bg-linear-to-r from-accent to-accent-dark text-white text-[15px] font-bold shadow-xl shadow-accent/20 hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center tracking-wide"
                    >
                      {loading ? (
                        <svg
                          className="w-5 h-5 animate-spin"
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
                        "Create account"
                      )}
                    </motion.button>
                  </form>
                </div>

                <p className="text-center text-[14px] text-[#555] mt-8">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#f97316] hover:text-[#fbbf24] font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
