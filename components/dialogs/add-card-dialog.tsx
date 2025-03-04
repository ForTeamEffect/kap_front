"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface AddCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cardholderName: string
  onCreateCard: (cardholderName: string) => void
}

export function AddCardDialog({ open, onOpenChange, cardholderName, onCreateCard }: AddCardDialogProps) {
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setName(cardholderName)
    }
  }, [open, cardholderName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = []
    if (!name.trim()) {
      newErrors.push("Cardholder name is required")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onCreateCard(name)
    setErrors([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Card</DialogTitle>
            <DialogDescription>Enter the cardholder name for your new card.</DialogDescription>
          </DialogHeader>

          {errors.length > 0 && (
            <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-600">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          <div className="mt-4 grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardholder-name">Cardholder Name</Label>
              <Input
                id="cardholder-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

