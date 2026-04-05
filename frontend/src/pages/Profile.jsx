// src/pages/Profile.jsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, setUser }         = useAuth()
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState('')
  const [name, setName]           = useState(user?.name || '')
  const fileRef = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
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
      showToast('✅ Profile image updated!')
    } catch {
      showToast('❌ Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Optimistic UI — update locally
      setUser(prev => ({ ...prev, name }))
      showToast('✅ Profile saved!')
    } catch {
      showToast('❌ Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-2xl mx-auto">
      {/* Toast notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 glass rounded-xl border border-white/10 text-snow text-sm shadow-xl"
        >
          {toast}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-700 text-3xl text-snow mb-8"
      >
        My <span className="text-flame-gradient">Profile</span>
      </motion.h1>

      {/* Avatar section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-3xl p-8 border border-white/8 mb-5 flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="relative group cursor-pointer" onClick={() => fileRef.current.click()}>
          <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-flame/30 ring-offset-2 ring-offset-ink">
            {user?.profile_image_url ? (
              <img src={user.profile_image_url} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-flame to-ember flex items-center justify-center text-3xl font-display font-700 text-white">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          {/* Upload overlay */}
          <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {uploading
              ? <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              : <span className="text-white text-2xl">📷</span>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        <div className="text-center sm:text-left">
          <h2 className="font-display font-700 text-xl text-snow">{user?.name}</h2>
          <p className="text-ash text-sm">{user?.email}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-display font-600 ${
            user?.role === 'admin' ? 'bg-flame/15 text-flame border border-flame/30' : 'bg-blue-500/15 text-blue-400 border border-blue-400/30'
          }`}>
            {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
          </span>
          <p className="text-ash/60 text-xs mt-2">Click image to change photo</p>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {[
          { icon: '🧾', label: 'Total Orders', value: '12' },
          { icon: '💰', label: 'Total Spent', value: 'LKR 4,820' },
          { icon: '📅', label: 'Member Since', value: '2024' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 border border-white/5 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="font-display font-700 text-snow text-sm">{stat.value}</p>
            <p className="text-ash text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h3 className="font-display font-600 text-snow mb-5">Edit Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-display font-600 text-mist mb-2 uppercase tracking-widest">Display Name</label>
            <input
              type="text"
              className="input-dark"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-display font-600 text-mist mb-2 uppercase tracking-widest">Email</label>
            <input type="email" className="input-dark opacity-50 cursor-not-allowed" value={user?.email || ''} disabled />
            <p className="text-ash text-xs mt-1">Email cannot be changed</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="btn-flame mt-5 flex items-center gap-2"
        >
          {saving ? 'Saving…' : '💾 Save Changes'}
        </motion.button>
      </motion.div>
    </div>
  )
}
