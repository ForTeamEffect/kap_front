import { PencilIcon, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardItem } from "@/components/card-item"
import { Link } from "@/components/ui/link"

interface AccountDetailsProps {
  account: any
  balance: string
  balanceLoading: boolean
  csvLoading: boolean
  createPhysAllowed: boolean
  onRenameAccount: () => void
  onHistoryCSV: () => void
  onAddCard: () => void
  onOrderPhysCard: () => void
  onActivatePhysCard: () => void
  onUpdateData: () => void
}

export function AccountDetails({
  account,
  balance,
  balanceLoading,
  csvLoading,
  createPhysAllowed,
  onRenameAccount,
  onHistoryCSV,
  onAddCard,
  onOrderPhysCard,
  onActivatePhysCard,
  onUpdateData,
}: AccountDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Account: {account.account_name}</h1>
          <Button variant="outline" size="sm" onClick={onRenameAccount} className="h-8 w-8 p-0">
            <PencilIcon className="h-4 w-4" />
            <span className="sr-only">Rename Account</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/payex/cardex/history">
              <FileText className="h-4 w-4" />
              Check Transaction History
            </Link>
          </Button>

          {!csvLoading ? (
            <Button variant="outline" size="sm" onClick={onHistoryCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Download Transaction History
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled className="gap-2">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Downloading...
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">CardEx Account Balance:</h2>
          {balanceLoading ? (
            <div className="mt-2 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          ) : (
            <div className="mt-1 flex items-center">
              <span className="text-2xl font-bold text-orange-500 dark:text-orange-400">{balance}</span>
              <span className="ml-1 font-semibold">MXN</span>
            </div>
          )}
        </div>

        <Button
          asChild
          variant="default"
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
        >
          <Link href={`/payex/cardex/fund/${account.account_name}`}>Fund CardEx Account</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {account.cards.map((card: any, idx: number) => (
          <CardItem key={idx} card={card} onUpdateData={onUpdateData} />
        ))}
      </div>

      <div className="space-y-3">
        <Button
          onClick={onAddCard}
          className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 sm:w-auto"
        >
          Replace Virtual Card
        </Button>

        {createPhysAllowed && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {!account.is_phys_card_ordered ? (
              <Button variant="outline" onClick={onOrderPhysCard} className="w-full sm:w-auto">
                {account.cards.length > 1 ? "Replace Physical Card" : "Order Physical Card"}
              </Button>
            ) : (
              <div className="rounded-md bg-muted p-3 text-sm text-red-600 dark:text-red-400">
                Physical card order is in progress
              </div>
            )}

            <Button
              variant="outline"
              className="w-full bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 sm:w-auto"
              onClick={onActivatePhysCard}
            >
              Activate Physical Card
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

