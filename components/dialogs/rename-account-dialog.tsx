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

interface RenameAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAccountName: string
  onRenameAccount: (newName: string) => void
}

export function RenameAccountDialog({
  open,
  onOpenChange,
  currentAccountName,
  onRenameAccount,
}: RenameAccountDialogProps) {
  const [newName, setNewName] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setNewName(currentAccountName)
    }
  }, [open, currentAccountName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = []
    if (!newName.trim()) {
      newErrors.push("Account name is required")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onRenameAccount(newName)
    setErrors([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Account</DialogTitle>
            <DialogDescription>Enter a new name for your account.</DialogDescription>
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
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={50}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Rename</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

