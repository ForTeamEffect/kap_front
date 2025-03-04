"use client"

import { useState, useEffect } from "react"
import { AccountSidebar } from "@/components/account-sidebar"
import { AccountDetails } from "@/components/account-details"
import { CreateAccountDialog } from "@/components/dialogs/create-account-dialog"
import { RenameAccountDialog } from "@/components/dialogs/rename-account-dialog"
import { AddCardDialog } from "@/components/dialogs/add-card-dialog"
import { OrderPhysicalCardDialog } from "@/components/dialogs/order-physical-card-dialog"
import { ActivatePhysicalCardDialog } from "@/components/dialogs/activate-physical-card-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { AddAddressDialog } from "@/components/dialogs/add-address-dialog"

// Mock API service
import { dockApi } from "@/lib/dock-api"

export function CardManagementDashboard() {
  const [dockNatPerson, setDockNatPerson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [balancesLoading, setBalancesLoading] = useState(true)
  const [cardexAccBalances, setCardexAccBalances] = useState<Record<string, string>>({})
  const [currentAccount, setCurrentAccount] = useState<string | null>(null)
  const [selectedAccountName, setSelectedAccountName] = useState<string>("")
  const [csvLoading, setCsvLoading] = useState(false)

  // Dialog states
  const [createAccountOpen, setCreateAccountOpen] = useState(false)
  const [renameAccountOpen, setRenameAccountOpen] = useState(false)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [orderPhysCardOpen, setOrderPhysCardOpen] = useState(false)
  const [activatePhysCardOpen, setActivatePhysCardOpen] = useState(false)
  const [addAddressOpen, setAddAddressOpen] = useState(false)

  const { toast } = useToast()

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dockApi.getDockNatPerson()
        setDockNatPerson(data)
        if (data.accounts.length > 0) {
          setCurrentAccount(data.accounts[0].account_name)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load account data",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    const fetchBalances = async () => {
      try {
        const balances = await dockApi.getCardexAccBalances()
        setCardexAccBalances(balances)
        setBalancesLoading(false)
      } catch (error) {
        console.error("Error fetching balances:", error)
        setBalancesLoading(false)
      }
    }

    fetchData()
    fetchBalances()
  }, [toast])

  const handleSelectAccount = (accountName: string) => {
    setCurrentAccount(accountName)
  }

  const handleCreateAccount = async (accountName: string) => {
    try {
      await dockApi.createNewAccount(accountName)
      toast({
        title: "Success",
        description: "New account created",
      })
      setCreateAccountOpen(false)
      updateData()
    } catch (error) {
      console.error("Error creating account:", error)
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      })
    }
  }

  const handleRenameAccount = async (newName: string) => {
    try {
      await dockApi.changeCardexAccountName(selectedAccountName, newName)
      toast({
        title: "Success",
        description: "Account name updated",
      })
      setRenameAccountOpen(false)
      if (currentAccount === selectedAccountName) {
        setCurrentAccount(newName)
      }
      updateData()
    } catch (error) {
      console.error("Error renaming account:", error)
      toast({
        title: "Error",
        description: "Failed to rename account",
        variant: "destructive",
      })
    }
  }

  const handleCreateCard = async (cardholderName: string) => {
    try {
      await dockApi.createCardExCard({
        cardholderName,
        cardApplicationProcessing: true,
      })
      toast({
        title: "Success",
        description: "Card created successfully",
      })
      setAddCardOpen(false)
      updateData()
    } catch (error) {
      console.error("Error creating card:", error)
      toast({
        title: "Error",
        description: "Failed to create card",
        variant: "destructive",
      })
    }
  }

  const handleOrderPhysicalCard = async (data: any) => {
    try {
      await dockApi.orderCardExPhysCard(data)
      toast({
        title: "Success",
        description: "Physical card ordered successfully",
      })
      setOrderPhysCardOpen(false)
      updateData()
    } catch (error) {
      console.error("Error ordering physical card:", error)
      toast({
        title: "Error",
        description: "Failed to order physical card",
        variant: "destructive",
      })
    }
  }

  const handleActivatePhysicalCard = async (data: any) => {
    try {
      await dockApi.activatePhysCard(data)
      toast({
        title: "Success",
        description: "Physical card activated successfully",
      })
      setActivatePhysCardOpen(false)
      updateData()
    } catch (error) {
      console.error("Error activating physical card:", error)
      toast({
        title: "Error",
        description: "Failed to activate physical card",
        variant: "destructive",
      })
    }
  }

  const handleAddAddress = async (data: any) => {
    try {
      await dockApi.addAddress(data)
      toast({
        title: "Success",
        description: "Address added successfully",
      })
      setAddAddressOpen(false)
      updateData()
    } catch (error) {
      console.error("Error adding address:", error)
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      })
    }
  }

  const handleHistoryCSV = async (accountName: string) => {
    setCsvLoading(true)
    try {
      await dockApi.getCardexHistoryCsv(accountName)
      setCsvLoading(false)
    } catch (error) {
      console.error("Error downloading CSV:", error)
      toast({
        title: "Error",
        description: "Failed to download history CSV",
        variant: "destructive",
      })
      setCsvLoading(false)
    }
  }

  const updateData = async () => {
    setLoading(true)
    try {
      const data = await dockApi.getDockNatPerson()
      setDockNatPerson(data)
      setLoading(false)
    } catch (error) {
      console.error("Error updating data:", error)
      setLoading(false)
    }
  }

  const openRenameAccountDialog = (accountName: string) => {
    setSelectedAccountName(accountName)
    setRenameAccountOpen(true)
  }

  const openAddCardDialog = (accountName: string) => {
    setSelectedAccountName(accountName)
    setAddCardOpen(true)
  }

  const openOrderPhysCardDialog = (accountName: string) => {
    setSelectedAccountName(accountName)
    setOrderPhysCardOpen(true)
  }

  const openActivatePhysCardDialog = (accountName: string) => {
    setSelectedAccountName(accountName)
    setActivatePhysCardOpen(true)
  }

  const needsAddress = dockNatPerson && (!dockNatPerson.address || dockNatPerson.address.length === 0)
  const addressPending =
    dockNatPerson?.address?.[0] && (dockNatPerson.address[0].is_moderated !== 10 || !dockNatPerson.address[0].is_active)
  const tierLevelNeeded = dockNatPerson?.tierLevel === 0 || !dockNatPerson?.exist_mexdoc

  if (loading && !dockNatPerson) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const selectedAccountData = dockNatPerson?.accounts.find((acc: any) => acc.account_name === currentAccount) || null

  const createPhysAllowed = dockNatPerson?.accounts.some(
    (account: any) =>
      !account.cards.some((card: any) => card.type === "PHYSICAL") ||
      account.cards.some((card: any) => card.type === "PHYSICAL" && card.embossing_status === "EMBOSSED"),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">CardEx Management</h1>
          <ThemeToggle />
        </div>
      </header>

      {dockNatPerson?.address?.[0] && (
        <div className="border-b bg-muted/40 px-4 py-2 text-sm">
          <span className="font-medium">Billing address:</span> {dockNatPerson.address[0].formatted_address}
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        {tierLevelNeeded ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Tier Level Required</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              You need to complete your tier level verification before using CardEx services.
            </p>
            <a
              href="/tier-level"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get Tier Level
            </a>
          </div>
        ) : needsAddress ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Billing Address Required</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              You need to add a verified billing address to use CardEx services.
            </p>
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={() => setAddAddressOpen(true)}
            >
              Add Verified Billing Address
            </button>
          </div>
        ) : addressPending ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Address Verification Pending</h2>
            <p className="max-w-md text-muted-foreground">
              Your billing address is awaiting moderation. Please check back later.
            </p>
          </div>
        ) : (
          <>
            <AccountSidebar
              accounts={dockNatPerson?.accounts || []}
              currentAccount={currentAccount}
              onSelectAccount={handleSelectAccount}
              onCreateAccount={() => setCreateAccountOpen(true)}
              onRenameAccount={openRenameAccountDialog}
            />

            <div className="flex-1 overflow-auto p-4 md:p-6">
              {currentAccount && selectedAccountData ? (
                <AccountDetails
                  account={selectedAccountData}
                  balance={cardexAccBalances[selectedAccountData.account_name] || "N/A"}
                  balanceLoading={balancesLoading}
                  csvLoading={csvLoading}
                  createPhysAllowed={createPhysAllowed}
                  onRenameAccount={() => openRenameAccountDialog(selectedAccountData.account_name)}
                  onHistoryCSV={() => handleHistoryCSV(selectedAccountData.account_name)}
                  onAddCard={() => openAddCardDialog(selectedAccountData.account_name)}
                  onOrderPhysCard={() => openOrderPhysCardDialog(selectedAccountData.account_name)}
                  onActivatePhysCard={() => openActivatePhysCardDialog(selectedAccountData.account_name)}
                  onUpdateData={updateData}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Select an account or create a new one</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      <CreateAccountDialog
        open={createAccountOpen}
        onOpenChange={setCreateAccountOpen}
        onCreateAccount={handleCreateAccount}
      />

      <RenameAccountDialog
        open={renameAccountOpen}
        onOpenChange={setRenameAccountOpen}
        currentAccountName={selectedAccountName}
        onRenameAccount={handleRenameAccount}
      />

      <AddCardDialog
        open={addCardOpen}
        onOpenChange={setAddCardOpen}
        cardholderName={dockNatPerson?.fullName || ""}
        onCreateCard={handleCreateCard}
      />

      <OrderPhysicalCardDialog
        open={orderPhysCardOpen}
        onOpenChange={setOrderPhysCardOpen}
        accountName={selectedAccountName}
        cardholderName={dockNatPerson?.fullName || ""}
        countryCode={dockNatPerson?.countryCode || ""}
        onOrderCard={handleOrderPhysicalCard}
      />

      <ActivatePhysicalCardDialog
        open={activatePhysCardOpen}
        onOpenChange={setActivatePhysCardOpen}
        accountName={selectedAccountName}
        onActivateCard={handleActivatePhysicalCard}
      />

      <AddAddressDialog open={addAddressOpen} onOpenChange={setAddAddressOpen} onAddAddress={handleAddAddress} />
    </div>
  )
}

