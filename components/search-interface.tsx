"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, Palette } from "lucide-react"
import { searchByCustomer, searchByColor } from "@/app/actions/search-actions"
import { CustomerSearchResults } from "@/components/customer-search-results"
import { ColorSearchResults } from "@/components/color-search-results"

export function SearchInterface() {
  const [searchType, setSearchType] = useState<"customer" | "color">("customer")
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [customerResults, setCustomerResults] = useState<any>(null)
  const [colorResults, setColorResults] = useState<any>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      if (searchType === "customer") {
        const results = await searchByCustomer(searchQuery)
        setCustomerResults(results)
        setColorResults(null)
      } else {
        const results = await searchByColor(searchQuery)
        setColorResults(results)
        setCustomerResults(null)
      }
    } catch (error) {
      console.error("Error searching:", error)
      alert("Search failed. Please try again.")
    } finally {
      setSearching(false)
    }
  }

  const handleClear = () => {
    setSearchQuery("")
    setCustomerResults(null)
    setColorResults(null)
  }

  return (
    <div className="space-y-6">
      <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "customer" | "color")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer">
            <User className="h-4 w-4 mr-2" />
            By Customer
          </TabsTrigger>
          <TabsTrigger value="color">
            <Palette className="h-4 w-4 mr-2" />
            By Color
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-search">Customer Name</Label>
            <p className="text-sm text-muted-foreground">
              Search for a customer to see their purchase history and formulations
            </p>
          </div>
        </TabsContent>

        <TabsContent value="color" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color-search">Color Name</Label>
            <p className="text-sm text-muted-foreground">
              Search for a paint color to see all customers who purchased it
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id={searchType === "customer" ? "customer-search" : "color-search"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchType === "customer" ? "Enter customer name..." : "Enter color name..."}
              className="text-base"
            />
          </div>
          <Button type="submit" disabled={searching || !searchQuery.trim()}>
            <Search className="h-4 w-4 mr-2" />
            {searching ? "Searching..." : "Search"}
          </Button>
          {(customerResults || colorResults) && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </form>

      {customerResults && <CustomerSearchResults results={customerResults} />}
      {colorResults && <ColorSearchResults results={colorResults} />}
    </div>
  )
}
