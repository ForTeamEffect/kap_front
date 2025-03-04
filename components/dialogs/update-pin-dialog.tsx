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
import { KeyRound } from "lucide-react"

interface UpdatePinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card: any
  onUpdatePin: (pin: string) => void
}

export function UpdatePinDialog({ open, onOpenChange, card, onUpdatePin }: UpdatePinDialogProps) {
  const [pin, setPin] = useState("")
  const [pin2, setPin2] = useState("")
  const [errors, setErrors] = useState<{
    pin12dontmatch?: boolean
    pin12len4?: boolean
    pin12notdig?: boolean
  }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous validations
    setErrors({})

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

    onUpdatePin(pin)

    // Reset form
    setPin("")
    setPin2("")
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setPin("")
      setPin2("")
      setErrors({})
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Update PIN-code
            </DialogTitle>
            <DialogDescription>Enter a new PIN for your card {card?.masked}</DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pin">New PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  required
                  className="font-mono text-lg tracking-widest"
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
                  className="font-mono text-lg tracking-widest"
                />
              </div>
            </div>

            {errors.pin12dontmatch && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">PINs do not match</p>
            )}
            {errors.pin12len4 && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">PIN must be 4 digits</p>
            )}
            {errors.pin12notdig && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">PIN must contain only digits</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">Change PIN</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

