"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Plus, Mail, Phone, MoreVertical } from "lucide-react"

export default function BeneficiariesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "+1234567890", country: "US" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "+1234567891", country: "UK" },
    { id: 3, name: "Carol Davis", email: "carol@example.com", phone: "+1234567892", country: "CA" },
  ])
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = Math.max(...beneficiaries.map((b) => b.id)) + 1
    setBeneficiaries([...beneficiaries, { ...newBeneficiary, id: newId }])
    setNewBeneficiary({ name: "", email: "", phone: "", country: "" })
    setIsDialogOpen(false)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Beneficiaries</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Beneficiary
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Beneficiary</DialogTitle>
                <DialogDescription>Add a new contact to send money to</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBeneficiary} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newBeneficiary.name}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newBeneficiary.email}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newBeneficiary.phone}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newBeneficiary.country}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, country: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Beneficiary
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Beneficiaries</CardTitle>
            <CardDescription>Manage your saved contacts for quick money transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {beneficiaries.map((beneficiary) => (
                <Card key={beneficiary.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {beneficiary.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{beneficiary.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{beneficiary.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{beneficiary.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href="/send-money">
                        <Button size="sm">Send Money</Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
