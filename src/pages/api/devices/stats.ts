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

    const filterFields: string[] = [
      'isVPNSpoofed',
      'isVirtualOS',
      'isEmulator',
      'isAppSpoofed',
      'isAppPatched',
      'isAppCloned'
    ]

    const filterCounts: { [key: string]: { [key: string]: number } } = {
      Android: {},
      iOS: {}
    }

    const calculateCounts = (filter: string) => {
      filterFields.forEach(field => {
        const count: number = devices.filter((device: DeviceInfo) => device[field as keyof DeviceInfo] && device.OS === filter).length
        filterCounts[filter][field] = count
      })
    }

    Object.keys(filterCounts).forEach(filter => calculateCounts(filter))

    const calculateAllCounts = () => {
      filterCounts.All = {} // Initialize the "All" object

      filterFields.forEach(field => {
        const count: number = filterCounts.Android[field] + filterCounts.iOS[field]
        filterCounts.All[field] = count
      })
    }

    calculateAllCounts()

    const totalDevices: { [key: string]: number } = {
      Android: devices.filter(device => device.OS === 'Android').length,
      iOS: devices.filter(device => device.OS === 'iOS').length,
      ALL: devices.length
    }

    const filterPercentages: { [key: string]: { [key: string]: string } } = {}

    const calculatePercentages = (filter: string) => {
      filterPercentages[filter] = {}

      filterFields.forEach(field => {
        const percentage: number =
          (filterCounts[filter][field] / (filter === 'All' ? devices.length : totalDevices[filter])) * 100
        filterPercentages[filter][field] = percentage.toFixed(2)
      })
    }

    Object.keys(filterCounts).forEach(filter => calculatePercentages(filter))

    const result = {
      totalDevices,
      filterCounts,
      filterPercentages
    }

    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
