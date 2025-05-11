"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Bell, Moon, Sun, Shield, Check, X } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    notifications: {
      emailBookings: true,
      emailContracts: true,
      emailMessages: true,
      emailMarketing: false,
      appBookings: true,
      appContracts: true,
      appMessages: true,
    },
    appearance: {
      theme: "light",
      language: "en",
      timezone: "america-los_angeles",
      dateFormat: "mdy",
    },
    security: {
      twoFactorEnabled: false,
    },
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) throw userError

        if (userData?.user) {
          // Get user settings
          const { data: userSettings, error: settingsError } = await supabase
            .from("user_settings")
            .select("*")
            .eq("user_id", userData.user.id)
            .single()

          if (settingsError && settingsError.code !== "PGRST116") {
            // PGRST116 is "no rows returned" error, which is fine for new users
            throw settingsError
          }

          if (userSettings) {
            setSettings({
              notifications: {
                emailBookings: userSettings.email_bookings ?? true,
                emailContracts: userSettings.email_contracts ?? true,
                emailMessages: userSettings.email_messages ?? true,
                emailMarketing: userSettings.email_marketing ?? false,
                appBookings: userSettings.app_bookings ?? true,
                appContracts: userSettings.app_contracts ?? true,
                appMessages: userSettings.app_messages ?? true,
              },
              appearance: {
                theme: userSettings.theme ?? "light",
                language: userSettings.language ?? "en",
                timezone: userSettings.timezone ?? "america-los_angeles",
                dateFormat: userSettings.date_format ?? "mdy",
              },
              security: {
                twoFactorEnabled: userSettings.two_factor_enabled ?? false,
              },
            })
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }))
  }

  const handleAppearanceChange = (name: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [name]: value,
      },
    }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [name]: checked,
      },
    }))
  }

  const saveSettings = async () => {
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!userData?.user) {
        throw new Error("User not found")
      }

      const { error } = await supabase.from("user_settings").upsert({
        user_id: userData.user.id,
        email_bookings: settings.notifications.emailBookings,
        email_contracts: settings.notifications.emailContracts,
        email_messages: settings.notifications.emailMessages,
        email_marketing: settings.notifications.emailMarketing,
        app_bookings: settings.notifications.appBookings,
        app_contracts: settings.notifications.appContracts,
        app_messages: settings.notifications.appMessages,
        theme: settings.appearance.theme,
        language: settings.appearance.language,
        timezone: settings.appearance.timezone,
        date_format: settings.appearance.dateFormat,
        two_factor_enabled: settings.security.twoFactorEnabled,
        updated_at: new Date(),
      })

      if (error) throw error

      setSuccessMessage("Settings saved successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error: any) {
      console.error("Error saving settings:", error)
      setErrorMessage(error.message || "Failed to save settings")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded-lg mb-8"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
          <X className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "notifications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "appearance"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Sun className="h-5 w-5 mr-2" />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "security"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Shield className="h-5 w-5 mr-2" />
              Security
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-medium mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Email Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailBookings" className="font-medium">
                          Booking Updates
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive notifications about booking changes and confirmations
                        </p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="emailBookings"
                          name="emailBookings"
                          checked={settings.notifications.emailBookings}
                          onChange={handleNotificationChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="emailBookings"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.emailBookings ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                              settings.notifications.emailBookings ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailContracts" className="font-medium">
                          Contract Updates
                        </label>
                        <p className="text-sm text-gray-500">Receive notifications about contract status changes</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="emailContracts"
                          name="emailContracts"
                          checked={settings.notifications.emailContracts}
                          onChange={handleNotificationChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="emailContracts"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.emailContracts ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                              settings.notifications.emailContracts ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailMessages" className="font-medium">
                          New Messages
                        </label>
                        <p className="text-sm text-gray-500">Receive notifications when you get new messages</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="emailMessages"
                          name="emailMessages"
                          checked={settings.notifications.emailMessages}
                          onChange={handleNotificationChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="emailMessages"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.emailMessages ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                              settings.notifications.emailMessages ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailMarketing" className="font-medium">
                          Marketing & Promotions
                        </label>
                        <p className="text-sm text-gray-500">Receive updates about new features and special offers</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="emailMarketing"
                          name="emailMarketing"
                          checked={settings.notifications.emailMarketing}
                          onChange={handleNotificationChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="emailMarketing"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.emailMarketing ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                              settings.notifications.emailMarketing ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">In-App Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="appBookings" className="font-medium">
                          Booking Updates
                        </label>
                        <p className="text-sm text-gray-500">Show notifications for booking changes</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="appBookings"
                          name="appBookings"
                          checked={settings.notifications.appBookings}
                          onChange={handleNotificationChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="appBookings"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.appBookings ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                              settings.notifications.appBookings ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="appContracts" className="font-medium">
                          Contract Updates
                        </label>
                        <p className="text-sm text-gray-500">Show notifications for contract changes</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="appContracts"
                          name="appContracts"
                          checked={settings.notifications.appContracts}
                          onChange={handleNotificationChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="appContracts"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.appContracts ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                              settings.notifications.appContracts ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="appMessages" className="font-medium">
                          New Messages
                        </label>
                        <p className="text-sm text-gray-500">Show notifications for new messages</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="appMessages"
                          name="appMessages"
                          checked={settings.notifications.appMessages}
                          onChange={handleNotificationChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="appMessages"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.appMessages ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                              settings.notifications.appMessages ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div>
              <h2 className="text-lg font-medium mb-6">Appearance Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Theme</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer ${
                        settings.appearance.theme === "light"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleAppearanceChange("theme", "light")}
                    >
                      <Sun className="h-6 w-6 text-amber-500" />
                      <span className="text-sm font-medium">Light</span>
                      {settings.appearance.theme === "light" && (
                        <div className="h-4 w-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer ${
                        settings.appearance.theme === "dark"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleAppearanceChange("theme", "dark")}
                    >
                      <Moon className="h-6 w-6 text-blue-700" />
                      <span className="text-sm font-medium">Dark</span>
                      {settings.appearance.theme === "dark" && (
                        <div className="h-4 w-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer ${
                        settings.appearance.theme === "system"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleAppearanceChange("theme", "system")}
                    >
                      <div className="flex">
                        <Sun className="h-6 w-6 text-amber-500" />
                        <Moon className="h-6 w-6 text-blue-700 -ml-1" />
                      </div>
                      <span className="text-sm font-medium">System</span>
                      {settings.appearance.theme === "system" && (
                        <div className="h-4 w-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Language & Region</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium mb-1">
                        Language
                      </label>
                      <select
                        id="language"
                        value={settings.appearance.language}
                        onChange={(e) => handleAppearanceChange("language", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium mb-1">
                        Time Zone
                      </label>
                      <select
                        id="timezone"
                        value={settings.appearance.timezone}
                        onChange={(e) => handleAppearanceChange("timezone", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="america-los_angeles">Pacific Time (US & Canada)</option>
                        <option value="america-new_york">Eastern Time (US & Canada)</option>
                        <option value="europe-london">London</option>
                        <option value="europe-paris">Paris</option>
                        <option value="asia-tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dateFormat" className="block text-sm font-medium mb-1">
                        Date Format
                      </label>
                      <select
                        id="dateFormat"
                        value={settings.appearance.dateFormat}
                        onChange={(e) => handleAppearanceChange("dateFormat", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="mdy">MM/DD/YYYY</option>
                        <option value="dmy">DD/MM/YYYY</option>
                        <option value="ymd">YYYY/MM/DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h2 className="text-lg font-medium mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Password</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Two-Factor Authentication</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="twoFactorEnabled" className="font-medium">
                        Enable Two-Factor Authentication
                      </label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="twoFactorEnabled"
                        name="twoFactorEnabled"
                        checked={settings.security.twoFactorEnabled}
                        onChange={handleSecurityChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor="twoFactorEnabled"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          settings.security.twoFactorEnabled ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            settings.security.twoFactorEnabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  {settings.security.twoFactorEnabled && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-4">
                        Two-factor authentication adds an additional layer of security to your account by requiring more
                        than just a password to sign in.
                      </p>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                      >
                        Set Up Two-Factor Authentication
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Session Management</h3>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-gray-500">Manage your active login sessions</p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Sign Out All Devices
                      </button>
                    </div>

                    <div className="border rounded-lg divide-y">
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">Current Session</div>
                          <div className="text-sm text-gray-500">Chrome on Windows • San Francisco, CA</div>
                          <div className="text-xs text-gray-400">Started 2 hours ago</div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Current</span>
                      </div>

                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">Mobile App</div>
                          <div className="text-sm text-gray-500">iPhone 13 • New York, NY</div>
                          <div className="text-xs text-gray-400">Started 3 days ago</div>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-end">
            <button
              type="button"
              onClick={saveSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
