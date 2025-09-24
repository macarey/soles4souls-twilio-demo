import { NextRequest, NextResponse } from 'next/server'

// Mock gift card data
const mockGiftCards = [
  {
    cardNumber: 'GC-1234-5678-9012',
    balance: 75.00,
    originalAmount: 100.00,
    purchaseDate: '2024-11-15',
    expiryDate: '2025-11-15',
    status: 'active',
    purchaserEmail: 'john.doe@email.com',
    recipientEmail: 'jane.smith@email.com'
  },
  {
    cardNumber: 'GC-9876-5432-1098',
    balance: 0.00,
    originalAmount: 50.00,
    purchaseDate: '2024-10-20',
    expiryDate: '2025-10-20',
    status: 'used',
    purchaserEmail: 'sarah.wilson@email.com',
    recipientEmail: 'mike.johnson@email.com'
  },
  {
    cardNumber: 'GC-5555-7777-9999',
    balance: 25.00,
    originalAmount: 25.00,
    purchaseDate: '2024-12-01',
    expiryDate: '2025-12-01',
    status: 'active',
    purchaserEmail: 'alex.brown@email.com',
    recipientEmail: 'alex.brown@email.com'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { action, cardNumber, amount, recipientEmail, purchaserEmail } = await request.json()
    
    if (!action) {
      return NextResponse.json({ 
        error: 'Action is required (check_balance, purchase, or redeem)',
        success: false 
      }, { status: 400 })
    }

    switch (action) {
      case 'check_balance':
        return handleCheckBalance(cardNumber)
      
      case 'purchase':
        return handlePurchase(amount, recipientEmail, purchaserEmail)
      
      case 'redeem':
        return handleRedeem(cardNumber, amount)
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: check_balance, purchase, or redeem',
          success: false 
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error processing gift card request:', error)
    return NextResponse.json({ 
      error: 'Failed to process gift card request',
      success: false 
    }, { status: 500 })
  }
}

function handleCheckBalance(cardNumber: string) {
  if (!cardNumber) {
    return NextResponse.json({ 
      error: 'Card number is required for balance check',
      success: false 
    }, { status: 400 })
  }

  const giftCard = mockGiftCards.find(card => card.cardNumber === cardNumber)
  
  if (!giftCard) {
    return NextResponse.json({
      success: false,
      error: 'Gift card not found',
      cardNumber
    })
  }

  if (giftCard.status === 'expired') {
    return NextResponse.json({
      success: false,
      error: 'Gift card has expired',
      cardNumber,
      expiryDate: giftCard.expiryDate
    })
  }

  return NextResponse.json({
    success: true,
    giftCard: {
      cardNumber: giftCard.cardNumber,
      balance: giftCard.balance,
      originalAmount: giftCard.originalAmount,
      status: giftCard.status,
      expiryDate: giftCard.expiryDate,
      purchaseDate: giftCard.purchaseDate,
      remainingBalance: giftCard.balance,
      usedAmount: giftCard.originalAmount - giftCard.balance
    }
  })
}

function handlePurchase(amount: number, recipientEmail?: string, purchaserEmail?: string) {
  if (!amount || amount <= 0) {
    return NextResponse.json({ 
      error: 'Valid amount is required for gift card purchase',
      success: false 
    }, { status: 400 })
  }

  if (amount < 10) {
    return NextResponse.json({ 
      error: 'Minimum gift card amount is $10',
      success: false 
    }, { status: 400 })
  }

  if (amount > 500) {
    return NextResponse.json({ 
      error: 'Maximum gift card amount is $500',
      success: false 
    }, { status: 400 })
  }

  // Generate new gift card
  const newCardNumber = `GC-${Math.random().toString().substr(2, 4)}-${Math.random().toString().substr(2, 4)}-${Math.random().toString().substr(2, 4)}`
  const purchaseDate = new Date().toISOString().split('T')[0]
  const expiryDate = new Date()
  expiryDate.setFullYear(expiryDate.getFullYear() + 1)
  
  return NextResponse.json({
    success: true,
    giftCard: {
      cardNumber: newCardNumber,
      amount: amount,
      balance: amount,
      purchaseDate: purchaseDate,
      expiryDate: expiryDate.toISOString().split('T')[0],
      status: 'active',
      recipientEmail: recipientEmail || 'Not specified',
      purchaserEmail: purchaserEmail || 'Not specified',
      deliveryMethod: 'Email',
      instructions: [
        'Gift card will be delivered via email within 24 hours',
        'Card can be used online or in-store',
        'Card expires 1 year from purchase date',
        'No expiration for unused balance'
      ]
    }
  })
}

function handleRedeem(cardNumber: string, amount: number) {
  if (!cardNumber) {
    return NextResponse.json({ 
      error: 'Card number is required for redemption',
      success: false 
    }, { status: 400 })
  }

  if (!amount || amount <= 0) {
    return NextResponse.json({ 
      error: 'Valid amount is required for redemption',
      success: false 
    }, { status: 400 })
  }

  const giftCard = mockGiftCards.find(card => card.cardNumber === cardNumber)
  
  if (!giftCard) {
    return NextResponse.json({
      success: false,
      error: 'Gift card not found',
      cardNumber
    })
  }

  if (giftCard.status !== 'active') {
    return NextResponse.json({
      success: false,
      error: 'Gift card is not active',
      cardNumber,
      status: giftCard.status
    })
  }

  if (amount > giftCard.balance) {
    return NextResponse.json({
      success: false,
      error: 'Insufficient balance',
      cardNumber,
      requestedAmount: amount,
      availableBalance: giftCard.balance
    })
  }

  // Simulate redemption
  const newBalance = giftCard.balance - amount
  
  return NextResponse.json({
    success: true,
    redemption: {
      cardNumber: giftCard.cardNumber,
      redeemedAmount: amount,
      remainingBalance: newBalance,
      originalAmount: giftCard.originalAmount,
      transactionId: `TXN-${Date.now()}`,
      redemptionDate: new Date().toISOString(),
      status: newBalance === 0 ? 'fully_used' : 'partially_used'
    }
  })
}
