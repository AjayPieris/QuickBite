// src/pages/Profile.jsx
// Profile page with hero banner, avatar upload, stats, edit form, danger zone

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import PageTransition from '../components/PageTransition'

export default function Profile() {
  const { user, login } = useAuth()
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [showDelete, setShowDelete] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await api.post('/users/upload-profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      // Refresh token/user data
      const token = localStorage.getItem('token')
      if (token) login(token)
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (!user) return null

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 max-w-3xl mx-auto">
        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl overflow-hidden mb-20">
          <div className="h-48 bg-gradient-to-br from-[#f97316]/30 via-[#ea580c]/20 to-[#0a0a0a] relative">
            <div className="absolute inset-0 backdrop-blur-3xl" />
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-32 h-32 rounded-full bg-[#111] ring-4 ring-[#f97316] cursor-pointer group overflow-hidden"
            >
              <img
                src={preview || user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff&size=128`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <svg className="w-8 h-8 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>
          </div>
        </div>

        {/* User Name & Email */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-[#9ca3af] text-sm">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 capitalize">
            {user.role}
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Member Since', value: '2026', icon: '📅' },
            { label: 'Total Orders', value: '—', icon: '📦' },
            { label: 'Amount Spent', value: '—', icon: '💰' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-4 text-center"
            >
              <span className="text-2xl block mb-1">{stat.icon}</span>
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-[#9ca3af] text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Profile Info Card */}
        <div className="glass-strong rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#9ca3af] mb-1 block">Full Name</label>
              <input type="text" defaultValue={user.name} readOnly className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#9ca3af] mb-1 block">Email</label>
              <input type="email" defaultValue={user.email} readOnly className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#9ca3af] mb-1 block">Role</label>
              <input type="text" defaultValue={user.role} readOnly className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm capitalize" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-strong rounded-2xl p-6 border border-red-500/10">
          <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
          <p className="text-[#9ca3af] text-sm mb-4">Once you delete your account, there is no going back.</p>
          <button onClick={() => setShowDelete(true)} className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors">
            Delete Account
          </button>
        </div>

        {/* Delete Modal */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowDelete(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} className="glass-strong rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-[#9ca3af] text-sm mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-xl glass text-white font-medium text-sm">Cancel</button>
                <button className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
