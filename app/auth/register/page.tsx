"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("client")
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailExists, setEmailExists] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const router = useRouter()

  // Generate a unique email on component mount
  useEffect(() => {
    generateUniqueEmail()
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setEmailExists(false)
    setSuccess(null)

    // Validate inputs
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      // Use the simple registration API route
      const response = await fetch("/api/auth/simple-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          role,
          company,
          position,
          phone,
          bio,
        }),
      })

      // Handle non-JSON responses
      let data
      try {
        data = await response.json()
      } catch (err) {
        console.error("Error parsing JSON response:", err)
        const text = await response.text()
        throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}...`)
      }

      if (!response.ok) {
        if (data.error && data.error.includes("Email already in use")) {
          setEmailExists(true)
          throw new Error(data.error)
        } else {
          throw new Error(data.error || "Registration failed")
        }
      }

      setSuccess(data.message || "Account created successfully! Redirecting to login...")

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err) {
      console.error("Registration error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(`Registration failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Function to generate a truly unique email with timestamp
  const generateUniqueEmail = () => {
    const timestamp = new Date().getTime()
    const randomString = Math.random().toString(36).substring(2, 8)
    const newEmail = `test.${randomString}.${timestamp}@example.com`
    setEmail(newEmail)
    // Reset error state when generating a new email
    setEmailExists(false)
    setError(null)
    return newEmail
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {emailExists ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTitle>Email already registered</AlertTitle>
                <AlertDescription>
                  <p>The email address {email} is already registered in our system.</p>
                  <p className="mt-2">Please try a different email address or sign in with your existing account.</p>
                </AlertDescription>
              </Alert>
              <div className="flex flex-col space-y-2">
                <Button variant="default" onClick={generateUniqueEmail}>
                  Generate a unique email
                </Button>
                <Button variant="outline" onClick={() => setEmailExists(false)}>
                  Try a different email
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/auth/login">Sign in instead</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && !emailExists && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="profile">Profile Details</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateUniqueEmail}
                        className="whitespace-nowrap"
                      >
                        Generate Unique
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use the "Generate Unique" button to create a test email that's guaranteed to be unique.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="provider">Service Provider</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("profile")}
                  >
                    Next: Profile Details
                  </Button>
                </TabsContent>

                <TabsContent value="profile" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Your Position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Your Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" className="w-1/2" onClick={() => setActiveTab("basic")}>
                      Back
                    </Button>

                    <Button type="submit" className="w-1/2" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full"></div>
                          Creating...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
