"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react"

export default function TransactionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [transactions] = useState([
    {
      id: 1,
      type: "sent",
      recipient: "Alice Johnson",
      amount: 150.0,
      fee: 1.5,
      date: "2024-01-15",
      status: "completed",
      reference: "TXN001",
    },
    {
      id: 2,
      type: "received",
      sender: "Bob Smith",
      amount: 75.5,
      fee: 0,
      date: "2024-01-14",
      status: "completed",
      reference: "TXN002",
    },
    {
      id: 3,
      type: "sent",
      recipient: "Carol Davis",
      amount: 200.0,
      fee: 2.0,
      date: "2024-01-13",
      status: "pending",
      reference: "TXN003",
    },
    {
      id: 4,
      type: "sent",
      recipient: "David Wilson",
      amount: 300.0,
      fee: 3.0,
      date: "2024-01-12",
      status: "completed",
      reference: "TXN004",
    },
    {
      id: 5,
      type: "received",
      sender: "Emma Brown",
      amount: 125.75,
      fee: 0,
      date: "2024-01-11",
      status: "completed",
      reference: "TXN005",
    },
    {
      id: 6,
      type: "sent",
      recipient: "Frank Miller",
      amount: 50.0,
      fee: 0.5,
      date: "2024-01-10",
      status: "failed",
      reference: "TXN006",
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      (transaction.type === "sent" ? transaction.recipient : transaction.sender)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || transaction.status === filterStatus

    return matchesSearch && matchesFilter
  })

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-4 max-w-4xl mx-auto">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Transaction History</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>{filteredTransactions.length} transaction(s) found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "sent" ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      {transaction.type === "sent" ? (
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {transaction.type === "sent" ? `To ${transaction.recipient}` : `From ${transaction.sender}`}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                      <p className="text-xs text-gray-400">Ref: {transaction.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-lg ${
                        transaction.type === "sent" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {transaction.type === "sent" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </p>
                    {transaction.fee > 0 && <p className="text-sm text-gray-500">Fee: ${transaction.fee.toFixed(2)}</p>}
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="mt-1"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
