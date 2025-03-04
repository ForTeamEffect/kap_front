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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MapPin, Upload } from "lucide-react"

interface AddAddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAddress: (data: any) => void
}

export function AddAddressDialog({ open, onOpenChange, onAddAddress }: AddAddressDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = []
    if (!file) {
      newErrors.push("Proof of Address Document is required")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onAddAddress({ file })

    // Reset form
    setFile(null)
    setErrors([])
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setFile(null)
      setErrors([])
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Upload Proof of Address
            </DialogTitle>
            <DialogDescription>Please upload a document that proves your current address.</DialogDescription>
          </DialogHeader>

          {errors.length > 0 && (
            <div className="mt-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload Proof of Address Document</p>
                <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG (max 10MB)</p>
              </div>
              <Label
                htmlFor="file-upload"
                className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Choose File
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && <p className="mt-2 text-sm font-medium text-muted-foreground">Selected: {file.name}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

