import { PencilIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AccountSidebarProps {
  accounts: any[]
  currentAccount: string | null
  onSelectAccount: (accountName: string) => void
  onCreateAccount: () => void
  onRenameAccount: (accountName: string) => void
}

export function AccountSidebar({
  accounts,
  currentAccount,
  onSelectAccount,
  onCreateAccount,
  onRenameAccount,
}: AccountSidebarProps) {
  return (
    <div className="w-full border-r bg-card/50 md:w-72 lg:w-80">
      <div className="p-4">
        <h2 className="mb-2 text-lg font-semibold">Accounts</h2>
        <Button className="w-full" onClick={onCreateAccount}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Account
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2 p-4">
          {accounts.map((account) => (
            <div
              key={account.account_name}
              className={cn(
                "flex items-center justify-between rounded-md border p-3 transition-colors",
                currentAccount === account.account_name
                  ? "border-primary bg-primary/10 dark:bg-primary/20"
                  : "border-border bg-background hover:bg-accent",
              )}
            >
              <button
                className={cn(
                  "flex-1 text-left text-sm font-medium",
                  currentAccount === account.account_name
                    ? "text-primary dark:text-primary-foreground"
                    : "text-foreground",
                )}
                onClick={() => onSelectAccount(account.account_name)}
              >
                {account.account_name}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => onRenameAccount(account.account_name)}
              >
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Rename account</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

