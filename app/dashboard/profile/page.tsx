// app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/auth'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    company: '',
    bio: '',
    avatarUrl: ''
  })
  
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        
      if (data) {
        setProfile(data)
        setFormData({
          fullName: data.full_name || '',
          phone: data.phone || '',
          company: data.company || '',
          bio: data.bio || '',
          avatarUrl: data.avatar_url || ''
        })
      }
      
      setLoading(false)
    }
    
    loadProfile()
  }, [])
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        company: formData.company,
        bio: formData.bio,
        avatar_url: formData.avatarUrl,
        updated_at: new Date()
      })
      
    if (!error) {
      setEditing(false)
      // Reload profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        
      setProfile(data)
    }
  }
  
  // Handle avatar upload
  async function uploadAvatar(file: File) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)
      
    if (uploadError) {
      console.error(uploadError)
      return
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
      
    setFormData({
      ...formData,
      avatarUrl: data.publicUrl
    })
  }
  
  if (loading) {
    return <div>Loading profile...</div>
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile display */}
          <div className="p-6 flex justify-end">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  )
}