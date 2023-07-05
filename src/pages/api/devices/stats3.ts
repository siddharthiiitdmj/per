import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

interface Device {
  isVPNSpoofed: number;
  isVirtualOS: number;
  isEmulator: number;
  isAppSpoofed: number;
  isAppPatched: number;
  isAppCloned: number;
}

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
    let { os } = req.query
    if (!os) {
      os = 'All'
    }

    if (os !== 'All' && os !== 'iOS' && os !== 'Android') {
      return res.status(400).json({
        message: 'Invalid os value'
      })
    }

    //delete old record
    await prisma.Stats.deleteMany({
      where: {
        os: os
      }
    })

    const filters: any = {}

    if (os && os !== 'All') {
      filters.OS = os
    }

    const lineChart: {
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
      lineChart.monthly[field] = {}
      lineChart.weekly[field] = {}
      lineChart.daily[field] = {}

      for (const deviceInfo of deviceInfos) {
        const createdAt = deviceInfo.createdAt

        // Monthly count
        const month = createdAt.toISOString().slice(0, 7)
        lineChart.monthly[field][month] = (lineChart.monthly[field][month] || 0) + (deviceInfo[field] ? 1 : 0)

        // Daily count
        const day = createdAt.toISOString().slice(0, 10)
        lineChart.daily[field][day] = (lineChart.daily[field][day] || 0) + (deviceInfo[field] ? 1 : 0)
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
        lineChart.weekly[field][weekStart] = 0

        for (const deviceInfo of sortedDeviceInfos) {
          if (deviceInfo.createdAt >= currentWeekStart && deviceInfo.createdAt <= currentWeekEnd) {
            lineChart.weekly[field][weekStart] += deviceInfo[field] ? 1 : 0
          }
        }
      }

      currentWeekStart = getStartOfWeek(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))
      currentWeekEnd = getEndOfWeek(currentWeekStart)
    }

    //pieChart
    const devices = await prisma.deviceInfo.findMany({
      where: filters
    })

    const pieChart: Record<string, Device> = {
      '1': initializeDevice(),
      '7': initializeDevice(),
      '30': initializeDevice()
    }

    const currentDate = new Date()

    devices.forEach((device: any) => {
      const deviceDate = new Date(device.updatedAt)

      if (isWithinTimeRange(deviceDate, currentDate, 1)) {
        incrementDeviceCount(pieChart['1'], device)
      }
      if (isWithinTimeRange(deviceDate, currentDate, 7)) {
        incrementDeviceCount(pieChart['7'], device)
      }
      if (isWithinTimeRange(deviceDate, currentDate, 30)) {
        incrementDeviceCount(pieChart['30'], device)
      }
    })

    //Create stats record
    const statsRecord = await prisma.Stats.create({
      data: {
        os: os || null, // Set the os field from the query parameter
        pieChart,
        lineChart,
      }
    })


    res.status(200).json(statsRecord)
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

function initializeDevice(): Device {
  return {
    isVPNSpoofed: 0,
    isVirtualOS: 0,
    isEmulator: 0,
    isAppSpoofed: 0,
    isAppPatched: 0,
    isAppCloned: 0
  }
}

function isWithinTimeRange(date: Date, currentDate: Date, days: number): boolean {
  const timeDiff = currentDate.getTime() - date.getTime()
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const daysDiff = Math.floor(timeDiff / millisecondsPerDay)

  return daysDiff <= days
}

function incrementDeviceCount(device: Device, incrementBy: Device): void {
  device.isVPNSpoofed += incrementBy.isVPNSpoofed
  device.isVirtualOS += incrementBy.isVirtualOS
  device.isEmulator += incrementBy.isEmulator
  device.isAppSpoofed += incrementBy.isAppSpoofed
  device.isAppPatched += incrementBy.isAppPatched
  device.isAppCloned += incrementBy.isAppCloned
}