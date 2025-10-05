import { NextRequest, NextResponse } from 'next/server'
import { mockImpactStories } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const { category, location } = await request.json()
    
    // Filter impact stories based on parameters
    let filteredStories = mockImpactStories
    
    if (category) {
      filteredStories = filteredStories.filter(story => story.category === category)
    }
    
    if (location) {
      filteredStories = filteredStories.filter(story => 
        story.location.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    // Get the most recent stories (limit to 5)
    const recentStories = filteredStories
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
    
    // Generate impact metrics
    const totalStories = recentStories.length
    const categories = [...new Set(recentStories.map(story => story.category))]
    
    return NextResponse.json({
      success: true,
      impactReport: {
        summary: {
          totalStories: totalStories,
          programs: categories,
          period: 'Last 30 days',
          totalImpact: 'Over 73 million pairs of shoes and clothing distributed worldwide'
        },
        stories: recentStories.map(story => ({
          id: story.id,
          title: story.title,
          description: story.description,
          location: story.location,
          date: story.date,
          category: story.category,
          impact: {
            familiesHelped: story.category === '4EveryKid' ? 50 : 15,
            jobsCreated: story.category === '4Opportunity' ? 3 : 0,
            livesChanged: story.category === '4EveryKid' ? 50 : 45
          }
        })),
        programBreakdown: {
          '4Relief': {
            description: 'Emergency relief and disaster response',
            impact: '2,000+ families helped this month'
          },
          '4Opportunity': {
            description: 'Micro-enterprise and job creation',
            impact: '15+ new businesses started this month'
          },
          '4EveryKid': {
            description: 'Children experiencing homelessness',
            impact: '50+ children received new shoes this month'
          }
        },
        globalStats: {
          totalShoesDistributed: '73,000,000+',
          countriesServed: '127',
          yearsActive: '19',
          partnersWorldwide: '1,200+'
        }
      }
    })
    
  } catch (error) {
    console.error('Error generating impact report:', error)
    return NextResponse.json({ 
      error: 'Failed to generate impact report',
      success: false 
    }, { status: 500 })
  }
}
