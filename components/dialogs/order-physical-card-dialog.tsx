"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { countries } from "@/lib/countries"
import { dockApi } from "@/lib/dock-api"

interface OrderPhysicalCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountName: string
  cardholderName: string
  countryCode: string
  onOrderCard: (data: any) => void
}

export function OrderPhysicalCardDialog({
  open,
  onOpenChange,
  accountName,
  cardholderName,
  countryCode,
  onOrderCard,
}: OrderPhysicalCardDialogProps) {
  const [fastExBalance, setFastExBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  const physCardPrice = 500.0

  // Form state
  const [formData, setFormData] = useState({
    addrCountryCode: countryCode,
    addrCity: "",
    addrPostalCode: "",
    addrStreet: "",
    addrNumber: "",
    addrNeighborhood: "",
    addrComplement: "",
    addrAdmAreaCode: "",
  })

  useEffect(() => {
    if (open) {
      fetchBalance()
      setFormData({
        ...formData,
        addrCountryCode: countryCode,
      })
    }
  }, [open, countryCode, formData]) // Added formData to dependencies

  const fetchBalance = async () => {
    setLoading(true)
    try {
      const balance = await dockApi.getFastExBalance()
      setFastExBalance(balance)
    } catch (error) {
      console.error("Error fetching balance:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCountryChange = (value: string) => {
    setFormData({
      ...formData,
      addrCountryCode: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = []
    if (!formData.addrCountryCode) {
      newErrors.push("Country is required")
    }
    if (!formData.addrCity) {
      newErrors.push("City is required")
    }
    if (!formData.addrPostalCode) {
      newErrors.push("Postal code is required")
    }
    if (!formData.addrStreet) {
      newErrors.push("Street is required")
    }
    if (!formData.addrNumber) {
      newErrors.push("Building number is required")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onOrderCard({
      ...formData,
      cardholderName,
      cardApplicationProcessing: true,
    })

    // Reset form
    setFormData({
      addrCountryCode: countryCode,
      addrCity: "",
      addrPostalCode: "",
      addrStreet: "",
      addrNumber: "",
      addrNeighborhood: "",
      addrComplement: "",
      addrAdmAreaCode: "",
    })
    setErrors([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order New Physical Card</DialogTitle>
          <DialogDescription>Physical card costs {physCardPrice} MXNT</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm">
                Your FastEx Balance: <span className="font-semibold">{fastExBalance} MXNT</span>
              </p>
            </div>

            {fastExBalance > physCardPrice ? (
              <form onSubmit={handleSubmit}>
                <Alert className="mb-4 border-orange-200 bg-orange-50 text-orange-800">
                  <AlertDescription>
                    <strong>
                      The amount of {physCardPrice} MXNT will be expended from your FastEx wallet balance.
                    </strong>
                  </AlertDescription>
                </Alert>

                {errors.length > 0 && (
                  <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">
                    {errors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium">Cardholder Address</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="addrCountryCode">Country</Label>
                      <Select value={formData.addrCountryCode} onValueChange={handleCountryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.name} ({country.value})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addrCity">City</Label>
                      <Input
                        id="addrCity"
                        name="addrCity"
                        value={formData.addrCity}
                        onChange={handleChange}
                        maxLength={100}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addrPostalCode">Postal Code</Label>
                      <Input
                        id="addrPostalCode"
                        name="addrPostalCode"
                        value={formData.addrPostalCode}
                        onChange={handleChange}
                        maxLength={8}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addrStreet">Street</Label>
                      <Input
                        id="addrStreet"
                        name="addrStreet"
                        value={formData.addrStreet}
                        onChange={handleChange}
                        maxLength={100}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addrNumber">Building Number</Label>
                      <Input
                        id="addrNumber"
                        name="addrNumber"
                        value={formData.addrNumber}
                        onChange={handleChange}
                        maxLength={8}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addrNeighborhood">Neighborhood</Label>
                      <Input
                        id="addrNeighborhood"
                        name="addrNeighborhood"
                        value={formData.addrNeighborhood}
                        onChange={handleChange}
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addrComplement">Complement</Label>
                      <Input
                        id="addrComplement"
                        name="addrComplement"
                        value={formData.addrComplement}
                        onChange={handleChange}
                        maxLength={100}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">Order Card</Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4 py-4 text-center">
                <p className="text-red-600">Not enough funds.</p>
                <p>To create a physical card, please fund your FastEx Wallet.</p>
                <Button asChild variant="outline">
                  <a href="/funding/transfer/MXNT">Fund your FastEx Wallet</a>
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

