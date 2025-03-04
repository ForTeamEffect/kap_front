"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ActivatePhysicalCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountName: string
  onActivateCard: (data: any) => void
}

export function ActivatePhysicalCardDialog({
  open,
  onOpenChange,
  accountName,
  onActivateCard,
}: ActivatePhysicalCardDialogProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [pin, setPin] = useState("")
  const [pin2, setPin2] = useState("")
  const [errors, setErrors] = useState<{
    cardNotFound?: boolean
    panlen16?: boolean
    pin12dontmatch?: boolean
    pin12len4?: boolean
    pin12notdig?: boolean
  }>({})

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const text = value.replace(/\s/g, "")
    if (text.length > 0) {
      return text.match(/.{1,4}/g)?.join(" ") || ""
    }
    return text
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits and spaces
    if (/^[\d\s]*$/.test(value)) {
      setCardNumber(formatCardNumber(value))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous validations
    setErrors({})

    // Get raw card number without spaces
    const rawCardNumber = cardNumber.replace(/\s/g, "")

    // Validate card number
    if (rawCardNumber.length !== 16) {
      setErrors((prev) => ({ ...prev, panlen16: true }))
      return
    }

    // Validate PINs
    if (pin !== pin2) {
      setErrors((prev) => ({ ...prev, pin12dontmatch: true }))
      return
    }

    if (pin.length !== 4 || pin2.length !== 4) {
      setErrors((prev) => ({ ...prev, pin12len4: true }))
      return
    }

    if (!/^\d+$/.test(pin) || !/^\d+$/.test(pin2)) {
      setErrors((prev) => ({ ...prev, pin12notdig: true }))
      return
    }

    onActivateCard({
      pan: rawCardNumber,
      pin,
      accountName,
    })

    // Reset form
    setCardNumber("")
    setPin("")
    setPin2("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Activate Physical Card</DialogTitle>
            <DialogDescription>Enter your card details to activate your physical card.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <Alert className="border-amber-200 bg-amber-50 text-amber-800">
              <AlertDescription>Please enter the details of your physical card to activate it.</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                {errors.cardNotFound && <p className="text-sm text-red-600">Card not found</p>}
                {errors.panlen16 && <p className="text-sm text-red-600">Card number must be 16 digits</p>}
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19} // 16 digits + 3 spaces
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin2">Repeat PIN</Label>
                  <Input
                    id="pin2"
                    type="password"
                    value={pin2}
                    onChange={(e) => setPin2(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {errors.pin12dontmatch && <p className="text-sm text-red-600">PINs do not match</p>}
              {errors.pin12len4 && <p className="text-sm text-red-600">PIN must be 4 digits</p>}
              {errors.pin12notdig && <p className="text-sm text-red-600">PIN must contain only digits</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">Activate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

