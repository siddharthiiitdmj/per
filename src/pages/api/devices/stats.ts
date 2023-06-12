import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

interface DeviceInfo {
  UID: string
  DeviceID: string
  userID: string | null
  IP: string
  isVPNSpoofed: boolean
  isVirtualOS: boolean
  isEmulator: boolean
  isAppSpoofed: boolean
  isAppPatched: boolean
  isAppCloned: boolean
  Latitude: number
  Longitude: number
  OS: string
  Kernel: string
  devicemodel: string
  devicename: string
  nodename: string
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
  } | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const devices: DeviceInfo[] = await prisma.deviceInfo.findMany()
    const totalDevices: number = devices.length

    const booleanFields: string[] = [
      'isVPNSpoofed',
      'isVirtualOS',
      'isEmulator',
      'isAppSpoofed',
      'isAppPatched',
      'isAppCloned'
    ]
    const booleanCounts: { [key: string]: number } = {}

    booleanFields.forEach(field => {
      const count: number = devices.filter(device => device[field]).length
      booleanCounts[field] = count
    })

    const booleanPercentages: { [key: string]: string } = {}
    booleanFields.forEach(field => {
      const percentage: number = (booleanCounts[field] / totalDevices) * 100
      booleanPercentages[field] = percentage.toFixed(2) // Round the percentage to 2 decimal places
    })

    const result = {
      totalDevices,
      booleanCounts,
      booleanPercentages
    }

    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
