import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Default credentials if not provided
    const tokenUsername = username || 'user00'
    const tokenPassword = password || 'lets-converse'

    console.log('🔑 Requesting token from Twilio token service:', {
      username: tokenUsername,
      serviceUrl: 'https://tokens-8856.twil.io/token-service'
    })

    // Request token from your Twilio token service
    const tokenResponse = await fetch('https://tokens-8856.twil.io/token-service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: tokenUsername,
        password: tokenPassword
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token service error:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      })
      
      return NextResponse.json({
        error: 'Failed to get access token',
        details: errorText
      }, { status: tokenResponse.status })
    }

    const tokenData = await tokenResponse.json()
    
    console.log('✅ Token received successfully:', {
      token: tokenData.token ? '***' + tokenData.token.slice(-10) : 'No token',
      identity: tokenData.identity,
      expiresIn: tokenData.expiresIn
    })

    return NextResponse.json({
      token: tokenData.token,
      identity: tokenData.identity,
      expiresIn: tokenData.expiresIn
    })

  } catch (error) {
    console.error('❌ Error in token API:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
