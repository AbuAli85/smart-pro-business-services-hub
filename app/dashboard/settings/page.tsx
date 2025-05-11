// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/auth'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user.id)
        .single()
        
      if (data) {
        setSettings({
          theme: data.theme || 'light',
          emailNotifications: data.email_notifications || true,
          pushNotifications: data.push_notifications || true,
          twoFactorAuth: data.two_factor_auth || false
        })
      }
      
      setLoading(false)
    }
    
    loadSettings()
  }, [])
  
  async function saveSettings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        id: user.id,
        theme: settings.theme,
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
        two_factor_auth: settings.twoFactorAuth,
        updated_at: new Date()
      })
      
    if (error) {
      console.error('Error saving settings:', error)
    }
  }
  
  if (loading) {
    return <div>Loading settings...</div>
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Theme settings */}
          <div>
            <h2 className="text-lg font-medium mb-4">Appearance</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Theme</label>
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 rounded-md ${
                    settings.theme === 'light'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100'
                  }`}
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                >
                  Light
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    settings.theme === 'dark'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100'
                  }`}
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
          
          {/* Notification settings */}
          <div>
            <h2 className="text-lg font-medium mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Email Notifications</label>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className="sr-only"
                    checked={settings.emailNotifications}
                    onChange={() => setSettings({
                      ...settings,
                      emailNotifications: !settings.emailNotifications
                    })}
                  />
                  <label
                    htmlFor="emailNotifications"
                    className={`block h-6 w-10 rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 mt-1 ml-1 rounded-full transition-transform bg-white ${
                        settings.emailNotifications ? 'transform translate-x-4' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Push Notifications</label>
                  <p className="text-sm text-gray-500">
                    Receive notifications in the app
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    className="sr-only"
                    checked={settings.pushNotifications}
                    onChange={() => setSettings({
                      ...settings,
                      pushNotifications: !settings.pushNotifications
                    })}
                  />
                  <label
                    htmlFor="pushNotifications"
                    className={`block h-6 w-10 rounded-full transition-colors ${
                      settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 mt-1 ml-1 rounded-full transition-transform bg-white ${
                        settings.pushNotifications ? 'transform translate-x-4' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security settings */}
          <div>
            <h2 className="text-lg font-medium mb-4">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Two-Factor Authentication</label>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    className="sr-only"
                    checked={settings.twoFactorAuth}
                    onChange={() => setSettings({
                      ...settings,
                      twoFactorAuth: !settings.twoFactorAuth
                    })}
                  />
                  <label
                    htmlFor="twoFactorAuth"
                    className={`block h-6 w-10 rounded-full transition-colors ${
                      settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 mt-1 ml-1 rounded-full transition-transform bg-white ${
                        settings.twoFactorAuth ? 'transform translate-x-4' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}