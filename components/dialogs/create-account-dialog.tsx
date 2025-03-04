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

interface CreateAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAccount: (accountName: string) => void
}

export function CreateAccountDialog({ open, onOpenChange, onCreateAccount }: CreateAccountDialogProps) {
  const [accountName, setAccountName] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = []
    if (!accountName.trim()) {
      newErrors.push("Account name is required")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onCreateAccount(accountName)
    setAccountName("")
    setErrors([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>Enter a name for your new account.</DialogDescription>
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
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                maxLength={50}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

