// API to populate Stats table in the DB with lineChart and pieChart data

import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

interface Device {
  isVPNSpoofed: number
  isVirtualOS: number
  isEmulator: number
  isAppSpoofed: number
  isAppPatched: number
  isAppCloned: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const booleanFields: string[] = [
      'isVPNSpoofed',
      'isVirtualOS',
      'isEmulator',
      'isAppSpoofed',
      'isAppPatched',
      'isAppCloned',
      'riskyDevices'
    ]
    const { os } = req.query

    let statsOs = os
    if (!os || os == '') {
      statsOs = 'All'
    }

    // if (!os) {
    //   os = 'All'
    // }
    console.log('os: ', os)
    console.log('statsOs: ', statsOs)

    if (os && os !== 'iOS' && os !== 'Android') {
      return res.status(400).json({
        message: 'Invalid os value'
      })
    }

    //delete old record
    await prisma.Stats.deleteMany({
      where: {
        os: statsOs
      }
    })

    // const filters: any = {}

    // if (os && os !== 'All') {
    //   filters.OS = os
    // }

    const lineChart: {
      monthly: Record<string, Record<string, number>>
      weekly: Record<string, Record<string, number>>
      daily: Record<string, Record<string, number>>
    } = {
      monthly: {},
      weekly: {},
      daily: {}
    }
    const configurations = await prisma.configuration.findMany()
    const thresholdScore = 33

    let deviceInfos = await prisma.Events.findMany({
      where: {
        device: {
          OS: os
        }
      },
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

    deviceInfos = deviceInfos.map((event: any) => ({
      ...event,
      riskScore: calculateRiskScore(event, configurations)
    }))

    for (const field of booleanFields) {
      lineChart.monthly[field] = {}
      lineChart.weekly[field] = {}
      lineChart.daily[field] = {}

      for (const deviceInfo of deviceInfos) {
        if (deviceInfo.createdAt) {
          // Check if createdAt is defined
          const createdAt = deviceInfo.createdAt

          // Monthly count
          const month = createdAt.toISOString().slice(0, 7)
          if (field !== 'riskyDevices') {
            lineChart.monthly[field][month] = (lineChart.monthly[field][month] || 0) + (deviceInfo[field] ? 1 : 0)
          } else {
            lineChart.monthly[field][month] =
              (lineChart.monthly[field][month] || 0) + (deviceInfo.riskScore > thresholdScore ? 1 : 0)
          }

          // Daily count
          const day = createdAt.toISOString().slice(0, 10)
          if (field !== 'riskyDevices') {
            lineChart.daily[field][day] = (lineChart.daily[field][day] || 0) + (deviceInfo[field] ? 1 : 0)
          } else {
            lineChart.daily[field][day] =
              (lineChart.daily[field][day] || 0) + (deviceInfo.riskScore > thresholdScore ? 1 : 0)
          }
        }
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
            lineChart.weekly[field][weekStart] += deviceInfo.riskScore > thresholdScore ? 1 : 0
          }
        }
      }

      currentWeekStart = getStartOfWeek(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))
      currentWeekEnd = getEndOfWeek(currentWeekStart)
    }

    //pieChart
    const devices = await prisma.events.findMany({
      where: {
        device: {
          OS: os
        }
      }
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
        os: statsOs, // Set the os field from the query parameter
        pieChart,
        lineChart
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
