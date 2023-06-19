import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const booleanFields: string[] = [
      'isVPNSpoofed',
      'isVirtualOS',
      'isEmulator',
      'isAppSpoofed',
      'isAppPatched',
      'isAppCloned'
    ]
    const { os } = req.query

    const filters: any = {}

    if (os && os !== 'All') {
      filters.OS = os
    }

    const result: {
      monthly: Record<string, Record<string, number>>
      weekly: Record<string, Record<string, number>>
      daily: Record<string, Record<string, number>>
    } = {
      monthly: {},
      weekly: {},
      daily: {}
    }

    const deviceInfos = await prisma.deviceInfo.findMany({
      where: filters,
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        createdAt: true,
        isVPNSpoofed: true,
        isVirtualOS: true,
        isEmulator: true,
        isAppSpoofed: true,
        isAppPatched: true,
        isAppCloned: true
      }
    })

    for (const field of booleanFields) {
      result.monthly[field] = {}
      result.weekly[field] = {}
      result.daily[field] = {}

      for (const deviceInfo of deviceInfos) {
        const createdAt = deviceInfo.createdAt

        // Monthly count
        const month = createdAt.toISOString().slice(0, 7)
        result.monthly[field][month] = (result.monthly[field][month] || 0) + (deviceInfo[field] ? 1 : 0)

        // Daily count
        const day = createdAt.toISOString().slice(0, 10)
        result.daily[field][day] = (result.daily[field][day] || 0) + (deviceInfo[field] ? 1 : 0)
      }
    }

    // Weekly count (Monday to Sunday)
    const sortedDeviceInfos = deviceInfos
      .slice()
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
    let currentWeekStart: Date = getStartOfWeek(sortedDeviceInfos[0].createdAt)
    let currentWeekEnd: Date = getEndOfWeek(sortedDeviceInfos[0].createdAt)

    while (currentWeekStart >= sortedDeviceInfos[sortedDeviceInfos.length - 1].createdAt) {
      const weekStart = currentWeekStart.toISOString().slice(0, 10)

      // const weekEnd = currentWeekEnd.toISOString().slice(0, 10)

      for (const field of booleanFields) {
        result.weekly[field][weekStart] = 0

        for (const deviceInfo of sortedDeviceInfos) {
          if (deviceInfo.createdAt >= currentWeekStart && deviceInfo.createdAt <= currentWeekEnd) {
            result.weekly[field][weekStart] += deviceInfo[field] ? 1 : 0
          }
        }
      }

      currentWeekStart = getStartOfWeek(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))
      currentWeekEnd = getEndOfWeek(currentWeekStart)
    }

    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

function getStartOfWeek(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust if Sunday

  return new Date(date.getFullYear(), date.getMonth(), diff, 0, 0, 0, 0)
}

function getEndOfWeek(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() + (7 - day) // Adjust if not Sunday

  return new Date(date.getFullYear(), date.getMonth(), diff, 23, 59, 59, 999)
}
