"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, Lock } from "lucide-react"

interface BlockCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card: any
  onBlockCard: () => void
}

export function BlockCardDialog({ open, onOpenChange, card, onBlockCard }: BlockCardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
            Block Card
          </DialogTitle>
          <DialogDescription>Are you sure you want to block this card?</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <p className="font-medium">{card?.masked}</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Blocking this card will prevent any further transactions. You can unblock it later if needed.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onBlockCard}>
            Block Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

