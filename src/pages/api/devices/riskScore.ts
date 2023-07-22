// pages/api/events.ts
import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

function calculateRiskScore(event: any, configurations: any[]): number {
  let numerator = 0
  let denominator = 0

  for (const config of configurations) {
    if (event[config.field] && config.isSwitchedOn) {
      numerator += config.value
    }

    if (config.isSwitchedOn) {
      denominator += config.value
    }
  }

  return (numerator / denominator) * 100
}

function groupEventsByMonths(events: any[], thresholdScore: number) {
  const eventsGroupedByMonth: { [month: string]: number } = {}

  for (const event of events) {
    const riskScore = event.riskScore
    const createdAt = new Date(event.createdAt)

    if (riskScore > thresholdScore) {
      const yearMonthKey = `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}`

      if (eventsGroupedByMonth[yearMonthKey]) {
        eventsGroupedByMonth[yearMonthKey]++
      } else {
        eventsGroupedByMonth[yearMonthKey] = 1
      }
    }
  }

  return eventsGroupedByMonth
}

function getStartOfWeek(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust if Sunday

  return new Date(date.getFullYear(), date.getMonth(), diff, 0, 0, 0, 0)
}

// function getEndOfWeek(date: Date): Date {
//   const day = date.getDay()
//   const diff = date.getDate() + (7 - day) // Adjust if not Sunday

//   return new Date(date.getFullYear(), date.getMonth(), diff, 23, 59, 59, 999)
// }

function groupEventsByWeeks(events: any[], thresholdScore: number) {
  const eventsGroupedByWeek: { [week: string]: number } = {}

  for (const event of events) {
    const riskScore = event.riskScore
    const createdAt = new Date(event.createdAt)

    if (riskScore > thresholdScore) {
      const startOfWeek = getStartOfWeek(createdAt)

      const weekKey = startOfWeek.toISOString().substr(0, 10)

      if (eventsGroupedByWeek[weekKey]) {
        eventsGroupedByWeek[weekKey]++
      } else {
        eventsGroupedByWeek[weekKey] = 1
      }
    }
  }

  return eventsGroupedByWeek
}

function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

function groupEventsByDays(events: any[], thresholdScore: number) {
  const eventsGroupedByDay: { [day: string]: number } = {}

  for (const event of events) {
    const riskScore = event.riskScore
    const createdAt = new Date(event.createdAt)

    if (riskScore > thresholdScore) {
      const startOfDay = getStartOfDay(createdAt)

      const dayKey = startOfDay.toISOString().substr(0, 10)

      if (eventsGroupedByDay[dayKey]) {
        eventsGroupedByDay[dayKey]++
      } else {
        eventsGroupedByDay[dayKey] = 1
      }
    }
  }

  return eventsGroupedByDay
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const events = await prisma.events.findMany({
      select: {
        isVPNSpoofed: true,
        isVirtualOS: true,
        isEmulator: true,
        isAppSpoofed: true,
        isAppPatched: true,
        isAppCloned: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    const configurations = await prisma.configuration.findMany()

    // Calculate risk scores for each event
    const eventsWithRiskScore = events.map((event: any) => ({
      createdAt: event.createdAt,
      riskScore: calculateRiskScore(event, configurations)
    }))

    const thresholdScore = configurations.field['Threshold']
    console.log(thresholdScore)

    const eventsGroupedByMonth = groupEventsByMonths(eventsWithRiskScore, thresholdScore)
    const eventsGroupedByWeek = groupEventsByWeeks(eventsWithRiskScore, thresholdScore)
    const eventsGroupedByDay = groupEventsByDays(eventsWithRiskScore, thresholdScore)

    res.status(200).json({ monthly: eventsGroupedByMonth, Weekly: eventsGroupedByWeek, Daily: eventsGroupedByDay })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
