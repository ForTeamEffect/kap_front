"use client"

import { useState } from "react"
import { CreditCard, Info, ShieldAlert, ShieldCheck, Lock, Unlock, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BlockCardDialog } from "@/components/dialogs/block-card-dialog"
import { UpdatePinDialog } from "@/components/dialogs/update-pin-dialog"
import { useToast } from "@/components/ui/use-toast"
import { dockApi } from "@/lib/dock-api"
import { cn } from "@/lib/utils"

interface CardItemProps {
  card: any
  onUpdateData: () => void
}

export function CardItem({ card, onUpdateData }: CardItemProps) {
  const [cardSensData, setCardSensData] = useState<any>(null)
  const [blockCardOpen, setBlockCardOpen] = useState(false)
  const [updatePinOpen, setUpdatePinOpen] = useState(false)
  const { toast } = useToast()

  const getCardSens = async (cardId: string) => {
    try {
      const result = await dockApi.getCardSens(cardId)
      setCardSensData(result)
    } catch (error) {
      console.error("Error getting card details:", error)
      toast({
        title: "Error",
        description: "Failed to get card details",
        variant: "destructive",
      })
    }
  }

  const closeCardInfo = () => {
    setCardSensData(null)
  }

  const handleCardUnblock = async (card: any) => {
    try {
      await dockApi.dockCardActivate(card)
      toast({
        title: "Success",
        description: "Card activation requested",
      })
      onUpdateData()
    } catch (error) {
      console.error("Error unblocking card:", error)
      toast({
        title: "Error",
        description: "Failed to unblock card",
        variant: "destructive",
      })
    }
  }

  const handleBlockCard = async (cardId: string) => {
    try {
      await dockApi.cardBlock({ card_id: cardId })
      toast({
        title: "Success",
        description: "Card block requested",
      })
      setBlockCardOpen(false)
      onUpdateData()
    } catch (error) {
      console.error("Error blocking card:", error)
      toast({
        title: "Error",
        description: "Failed to block card",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePin = async (pin: string) => {
    try {
      await dockApi.cardPinUpd({ card_id: card.id, pin })
      toast({
        title: "Success",
        description: "PIN update requested",
      })
      setUpdatePinOpen(false)
    } catch (error) {
      console.error("Error updating PIN:", error)
      toast({
        title: "Error",
        description: "Failed to update PIN",
        variant: "destructive",
      })
    }
  }

  const isBlocked = card.status === "BLOCKED"
  const isInitialBlocked = isBlocked && card.status_reason === "INITIAL_BLOCKED"
  const isPhysical = card.type === "PHYSICAL"
  const isEmbossed = card.embossing_status === "EMBOSSED"

  return (
    <Card
      className={cn(
        "overflow-hidden border-l-8",
        isPhysical ? "border-l-blue-500 dark:border-l-blue-700" : "border-l-purple-500 dark:border-l-purple-700",
      )}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard
                  className={cn(
                    "h-5 w-5",
                    isPhysical ? "text-blue-500 dark:text-blue-400" : "text-purple-500 dark:text-purple-400",
                  )}
                />
                <p className="text-sm font-medium text-muted-foreground">Card type: {card.type}</p>
              </div>
              <p className="mt-1 text-base font-semibold">
                {card.masked} ({card.brand})
              </p>
            </div>
            <div>
              {isBlocked ? (
                <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <ShieldAlert className="h-3 w-3" />
                  Blocked
                </div>
              ) : (
                <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <ShieldCheck className="h-3 w-3" />
                  Active
                </div>
              )}
            </div>
          </div>

          {cardSensData && (
            <div className="rounded-lg border bg-card p-4 shadow-sm dark:bg-card/80">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{cardSensData.pan}</p>
                  <p className="text-sm">
                    EXP: {cardSensData.exp.slice(5, 7)}/{cardSensData.exp.slice(2, 4)}
                  </p>
                </div>
                <p className="text-sm">{cardSensData.cardholder_name}</p>
                <p className="text-sm">CVV: {cardSensData.cvv}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2" onClick={closeCardInfo}>
                Close
              </Button>
            </div>
          )}

          {/* Physical card info */}
          {isPhysical && (
            <>
              {!isEmbossed && (
                <div className="rounded-md bg-muted p-3 text-sm text-amber-600 dark:text-amber-400">
                  Physical card is scheduled for manufacturing (embossing).
                  <br />
                  This process will be completed in one banking day.
                </div>
              )}

              {isBlocked && isEmbossed && (
                <div className="rounded-md bg-muted p-3 text-sm text-red-600 dark:text-red-400">
                  {!isInitialBlocked ? (
                    <>
                      Card is blocked: {card.status_reason}
                      <br />
                      You can unblock it using the button below.
                    </>
                  ) : (
                    <>
                      Your physical card needs to be activated.
                      <br />
                      Please use the Activate button below.
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* Virtual card info */}
          {!isPhysical && isBlocked && (
            <div className="rounded-md bg-muted p-3 text-sm text-red-600 dark:text-red-400">
              Card is blocked: {card.status_reason}
              <br />
              You can unblock it using the button below.
            </div>
          )}

          {/* Card action buttons */}
          <div className="flex flex-wrap gap-2">
            {!cardSensData && (
              <Button variant="outline" onClick={() => getCardSens(card.id)} className="gap-2">
                <Info className="h-4 w-4" />
                Card Info
              </Button>
            )}

            {!isBlocked && (
              <Button
                variant="outline"
                className="gap-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => setBlockCardOpen(true)}
              >
                <Lock className="h-4 w-4" />
                Block Card
              </Button>
            )}

            {isBlocked && !isInitialBlocked && (
              <Button
                variant="outline"
                className="gap-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50"
                onClick={() => handleCardUnblock(card)}
              >
                <Unlock className="h-4 w-4" />
                Unblock Card
              </Button>
            )}

            {isPhysical && isInitialBlocked && isEmbossed && (
              <Button
                variant="outline"
                className="gap-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50"
                onClick={() => handleCardUnblock(card)}
              >
                <Unlock className="h-4 w-4" />
                Activate Card
              </Button>
            )}

            {isPhysical && isEmbossed && (
              <Button
                variant="outline"
                className="gap-2 bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800"
                onClick={() => setUpdatePinOpen(true)}
              >
                <KeyRound className="h-4 w-4" />
                Change PIN-code
              </Button>
            )}
          </div>
        </div>

        <BlockCardDialog
          open={blockCardOpen}
          onOpenChange={setBlockCardOpen}
          card={card}
          onBlockCard={() => handleBlockCard(card.id)}
        />

        <UpdatePinDialog
          open={updatePinOpen}
          onOpenChange={setUpdatePinOpen}
          card={card}
          onUpdatePin={handleUpdatePin}
        />
      </CardContent>
    </Card>
  )
}

