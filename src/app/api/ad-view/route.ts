import { NextRequest, NextResponse } from 'next/server'

interface AdViewRequest {
  adId: string
  creatorId: string
  userId?: string
  viewDuration: number
  completed: boolean
  clicked?: boolean
  stayDuration?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: AdViewRequest = await request.json()
    
    const { adId, creatorId, userId, viewDuration, completed, clicked, stayDuration } = body

    // Validate required fields
    if (!adId || !creatorId || viewDuration === undefined || completed === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate earnings based on view completion and bonus triggers
    let creatorEarnings = 0
    let advertiserCharge = 0
    
    const baseRate = 0.10 // $0.10 per completed view
    
    if (completed) {
      creatorEarnings = baseRate * 0.7 // Creator gets 70%
      advertiserCharge = baseRate
      
      // Bonus for click-through with 2+ minute stay
      if (clicked && stayDuration && stayDuration >= 120) {
        const bonusAmount = baseRate * 0.5 // 50% bonus
        creatorEarnings += bonusAmount
        advertiserCharge += bonusAmount
      }
    }

    // In a real implementation, you would:
    // 1. Validate the ad exists and is active
    // 2. Check if user hasn't exceeded daily view limit
    // 3. Update ad view count in database
    // 4. Update creator earnings
    // 5. Update advertiser charges
    // 6. Check if ad has reached target views and deactivate if needed
    // 7. Send notifications if needed

    console.log('Recording ad view:', {
      adId,
      creatorId,
      userId,
      viewDuration,
      completed,
      clicked,
      stayDuration,
      creatorEarnings,
      advertiserCharge
    })

    // Simulate database operations
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock response data
    const viewRecord = {
      id: `view_${Date.now()}`,
      adId,
      creatorId,
      userId: userId || 'anonymous',
      viewDuration,
      completed,
      clicked: clicked || false,
      stayDuration: stayDuration || 0,
      creatorEarnings,
      advertiserCharge,
      timestamp: new Date().toISOString(),
      bonusTriggered: clicked && stayDuration && stayDuration >= 120
    }

    // Mock updated stats
    const updatedStats = {
      totalViews: Math.floor(Math.random() * 1000) + 500,
      todayViews: Math.floor(Math.random() * 50) + 10,
      totalEarnings: Math.floor(Math.random() * 500) + 100,
      todayEarnings: Math.floor(Math.random() * 20) + 5
    }

    return NextResponse.json({
      success: true,
      message: completed ? 'Ad view recorded successfully' : 'Partial view recorded',
      viewRecord,
      updatedStats,
      earnings: {
        amount: creatorEarnings,
        bonusTriggered: viewRecord.bonusTriggered
      }
    })

  } catch (error) {
    console.error('Ad view recording error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('creatorId')
    const adId = searchParams.get('adId')

    if (!creatorId && !adId) {
      return NextResponse.json(
        { error: 'creatorId or adId parameter required' },
        { status: 400 }
      )
    }

    // Mock analytics data
    const analyticsData = {
      totalViews: Math.floor(Math.random() * 10000) + 1000,
      totalEarnings: Math.floor(Math.random() * 1000) + 100,
      averageCTR: (Math.random() * 5 + 1).toFixed(2),
      completionRate: (Math.random() * 30 + 70).toFixed(1),
      bonusTriggers: Math.floor(Math.random() * 100) + 10,
      dailyStats: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 200) + 50,
        earnings: Math.floor(Math.random() * 50) + 10,
        clicks: Math.floor(Math.random() * 20) + 2
      }))
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
