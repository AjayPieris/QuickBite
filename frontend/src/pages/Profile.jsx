// src/pages/Profile.jsx
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { Camera, Crown, User, Receipt, Wallet, CalendarDays, UserPen, Lock, Save, CheckCircle, AlertCircle } from 'lucide-react'

// Common neumorphic styles
const neumorphic = {
  raised: {
    background: '#F0E8DC',
    boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85)',
    border: 'none',
  },
  inset: {
    background: '#F0E8DC',
    boxShadow: 'inset 5px 5px 12px rgba(180,130,90,0.26), -5px -5px 12px rgba(255,255,255,0.78)',
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

const colors = {
  primary: '#2C1A0E',
  muted: '#A08060',
  accent: '#E8732A',
  bg: '#F0E8DC',
  success: '#5AAB5E',
  error: '#E85A2A'
}

export default function Profile() {
  const { user, setUser }         = useAuth()
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState({ visible: false, msg: '', type: 'success' })
  const [name, setName]           = useState(user?.name || '')
  const [isFocused, setIsFocused] = useState(false)
  const fileRef = useRef(null)

  const showToast = (msg, type = 'success') => {
    setToast({ visible: true, msg, type })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/users/upload-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setUser(res.data)
      showToast('Profile image updated!', 'success')
    } catch {
      showToast('Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Optimistic locally
      setUser(prev => ({ ...prev, name }))
      // TODO: Call your actual update endpoint here if needed!
      showToast('Profile saved!', 'success')
    } catch {
      showToast('Failed to save profile.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom = 0) => ({
      opacity: 1, 
      y: 0, 
      transition: { delay: custom * 0.05, duration: 0.5, ease: 'easeOut' }
    })
  }

  return (
    <div className="min-h-screen py-24 px-6 overflow-x-hidden" style={{ background: colors.bg, ...fonts.body }}>
      <div className="max-w-xl mx-auto relative">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toast.visible && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 flex items-center gap-2.5 shadow-xl"
              style={{
                ...neumorphic.raised,
                borderRadius: '16px',
                borderLeft: `3px solid ${toast.type === 'success' ? colors.success : colors.error}`,
                color: colors.primary
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={16} color={colors.success} />
              ) : (
                <AlertCircle size={16} color={colors.error} />
              )}
              <span className="text-sm font-semibold">{toast.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <motion.h1
          custom={0} initial="hidden" animate="visible" variants={fadeInUp}
          className="text-[32px] font-semibold mb-8"
          style={{ ...fonts.heading, color: colors.primary }}
        >
          My{' '}
          <span style={{ 
            background: `linear-gradient(90deg, ${colors.accent}, #C8931A)`, 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            Profile
          </span>
        </motion.h1>

        {/* Avatar Card (Hero) */}
        <motion.div
          custom={1} initial="hidden" animate="visible" variants={fadeInUp}
          className="p-[2rem] mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ ...neumorphic.raised, borderRadius: '32px' }}
        >
          <div 
            className="relative group cursor-pointer w-24 h-24 flex-shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            {/* Avatar image / initials */}
            <div 
              className="w-full h-full overflow-hidden flex items-center justify-center relative z-0"
              style={{ 
                ...neumorphic.raised, 
                borderRadius: '28px', // squircle-like
                boxShadow: `inset 0 0 0 1.5px rgba(232,115,42,0.15), ${neumorphic.raised.boxShadow}` // subtle inner orange ring
              }}
            >
              {user?.profile_image_url ? (
                <img src={user.profile_image_url} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center font-bold text-3xl"
                  style={{ ...fonts.heading, color: colors.accent, background: colors.bg }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}

              {/* Hover overlay */}
              <div 
                className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250 rounded-[28px]" 
                style={{ background: 'rgba(232,115,42,0.85)' }}
              >
                {uploading ? (
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                ) : (
                  <Camera size={20} color="#ffffff" />
                )}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <div className="text-center sm:text-left flex-1 mt-1 sm:mt-2">
            <h2 style={{ ...fonts.heading, fontSize: '22px', fontWeight: 600, color: colors.primary }}>
              {user?.name || 'Chef Gordon'}
            </h2>
            <p style={{ fontSize: '13px', color: colors.muted, marginTop: '2px' }}>
              {user?.email || 'chef@quickbite.com'}
            </p>
            {/* Role Badge */}
            <div 
              className="inline-flex items-center gap-1.5 mt-4"
              style={{ ...neumorphic.raised, borderRadius: '999px', padding: '6px 12px' }}
            >
              {user?.role === 'admin' ? <Crown size={13} color={colors.accent} /> : <User size={13} color={colors.accent} />}
              <span style={{ fontSize: '12px', fontWeight: 600, color: colors.accent, textTransform: 'capitalize' }}>
                {user?.role || 'Customer'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Form Card */}
        <motion.div
           custom={3} initial="hidden" animate="visible" variants={fadeInUp}
           className="p-6 sm:p-8"
           style={{ ...neumorphic.raised, borderRadius: '24px' }}
        >
          {/* Section header */}
          <div className="flex items-center gap-2.5 mb-7">
            <UserPen size={18} color={colors.primary} />
            <h3 style={{ ...fonts.heading, fontSize: '18px', fontWeight: 600, color: colors.primary }}>Edit Profile</h3>
          </div>

          <div className="space-y-5">
            {/* Display Name */}
            <div>
              <label className="block mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: colors.muted }}>
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full transition-all duration-300 outline-none"
                style={{
                  ...neumorphic.inset,
                  borderRadius: '14px',
                  padding: '13px 16px',
                  color: colors.primary,
                  fontSize: '14px',
                  fontWeight: 500,
                  boxShadow: isFocused 
                    ? `0 0 0 3px rgba(232,115,42,0.15), inset 5px 5px 12px rgba(180,130,90,0.26), inset -5px -5px 12px rgba(255,255,255,0.78)`
                    : neumorphic.inset.boxShadow
                }}
              />
            </div>

            {/* Email (Disabled) */}
            <div>
              <label className="flex items-center gap-1.5 mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: colors.muted }}>
                Email Address <Lock size={12} color={colors.muted} />
              </label>
              <input 
                type="email" 
                value={user?.email || 'chef@quickbite.com'} 
                disabled 
                className="w-full"
                style={{
                  ...neumorphic.inset,
                  borderRadius: '14px',
                  padding: '13px 16px',
                  color: colors.primary,
                  fontSize: '14px',
                  fontWeight: 500,
                  opacity: 0.55,
                  cursor: 'not-allowed'
                }}
              />
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ 
              y: -1, 
              boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85), 0 6px 14px rgba(232,115,42,0.45)' 
            }}
            whileTap={{ 
              scale: 0.98, 
              boxShadow: 'inset 6px 6px 12px rgba(180, 70, 0, 0.4), inset -4px -4px 10px rgba(255, 180, 100, 0.3)' 
            }}
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-8 py-3.5 rounded-[16px] flex items-center justify-center gap-2 font-medium transition-colors"
            style={{ ...neumorphic.buttonRaised, fontSize: '15px' }}
          >
            {saving ? (
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </motion.button>
        </motion.div>

      </div>
    </div>
  )
}
