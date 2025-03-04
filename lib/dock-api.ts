// Mock API service for demonstration purposes
// In a real application, this would make actual API calls to your backend

// Mock data
const mockDockNatPerson = {
  fullName: "John Doe",
  countryCode: "MX",
  tierLevel: 1,
  exist_mexdoc: true,
  address: [
    {
      formatted_address: "123 Main St, Mexico City, 12345, Mexico",
      is_moderated: 10,
      is_active: true,
    },
  ],
  accounts: [
    {
      account_name: "Personal Account",
      is_phys_card_ordered: false,
      cards: [
        {
          id: "card1",
          type: "VIRTUAL",
          masked: "4111 **** **** 1111",
          brand: "Visa",
          status: "NORMAL",
          status_reason: "",
          embossing_status: "",
        },
        {
          id: "card2",
          type: "PHYSICAL",
          masked: "5555 **** **** 5555",
          brand: "Mastercard",
          status: "BLOCKED",
          status_reason: "INITIAL_BLOCKED",
          embossing_status: "EMBOSSED",
        },
      ],
    },
    {
      account_name: "Business Account",
      is_phys_card_ordered: true,
      cards: [
        {
          id: "card3",
          type: "VIRTUAL",
          masked: "4222 **** **** 2222",
          brand: "Visa",
          status: "BLOCKED",
          status_reason: "OWNER_REQUEST",
          embossing_status: "",
        },
      ],
    },
  ],
}

const mockCardexAccBalances = {
  "Personal Account": "1,500.00",
  "Business Account": "3,750.50",
}

// Mock card sensitive data
const mockCardSensData = {
  card1: {
    pan: "4111 2222 3333 1111",
    exp: "2025-12-31",
    cardholder_name: "John Doe",
    cvv: "123",
  },
  card2: {
    pan: "5555 6666 7777 5555",
    exp: "2026-10-31",
    cardholder_name: "John Doe",
    cvv: "456",
  },
  card3: {
    pan: "4222 3333 4444 2222",
    exp: "2027-08-31",
    cardholder_name: "John Doe",
    cvv: "789",
  },
}

// Mock API service
export const dockApi = {
  // Get user data
  getDockNatPerson: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDockNatPerson)
      }, 500)
    })
  },

  // Get account balances
  getCardexAccBalances: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCardexAccBalances)
      }, 700)
    })
  },

  // Create new account
  createNewAccount: async (accountName: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        mockDockNatPerson.accounts.push({
          account_name: accountName,
          is_phys_card_ordered: false,
          cards: [],
        })
        mockCardexAccBalances[accountName] = "0.00"
        resolve({ success: true })
      }, 500)
    })
  },

  // Rename account
  changeCardexAccountName: async (oldName: string, newName: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const account = mockDockNatPerson.accounts.find((acc) => acc.account_name === oldName)
        if (account) {
          account.account_name = newName
          mockCardexAccBalances[newName] = mockCardexAccBalances[oldName]
          delete mockCardexAccBalances[oldName]
        }
        resolve({ success: true })
      }, 500)
    })
  },

  // Create card
  createCardExCard: async (data: any) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  },

  // Order physical card
  orderCardExPhysCard: async (data: any) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  },

  // Activate physical card
  activatePhysCard: async (data: any) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const account = mockDockNatPerson.accounts.find((acc) => acc.account_name === data.accountName)
        if (account) {
          const card = account.cards.find((c) => c.type === "PHYSICAL" && c.status === "BLOCKED")
          if (card) {
            card.status = "NORMAL"
            card.status_reason = ""
          }
        }
        resolve({ success: true })
      }, 500)
    })
  },

  // Get card sensitive data
  getCardSens: async (cardId: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCardSensData[cardId as keyof typeof mockCardSensData])
      }, 300)
    })
  },

  // Block card
  cardBlock: async (data: { card_id: string }) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        mockDockNatPerson.accounts.forEach((account) => {
          account.cards.forEach((card) => {
            if (card.id === data.card_id) {
              card.status = "BLOCKED"
              card.status_reason = "OWNER_REQUEST"
            }
          })
        })
        resolve({ success: true })
      }, 500)
    })
  },

  // Unblock/activate card
  dockCardActivate: async (card: any) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        card.status = "NORMAL"
        card.status_reason = ""
        resolve({ success: true })
      }, 500)
    })
  },

  // Update card PIN
  cardPinUpd: async (data: { card_id: string; pin: string }) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  },

  // Get history CSV
  getCardexHistoryCsv: async (accountName: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, this would trigger a file download
        console.log(`Downloading CSV for account: ${accountName}`)
        resolve({ success: true })
      }, 1000)
    })
  },

  // Get FastEx balance
  getFastExBalance: async () => {
    // Simulate API call
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(2500.0) // Mock balance
      }, 800)
    })
  },

  // Add address
  addAddress: async (data: any) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        mockDockNatPerson.address = [
          {
            formatted_address: "123 New Address St, Mexico City, 12345, Mexico",
            is_moderated: 10,
            is_active: true,
          },
        ]
        resolve({ success: true })
      }, 800)
    })
  },
}

