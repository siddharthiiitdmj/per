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
    const { os, startDate, endDate } = req.query

    const filters: any = {}

    if (os && os !== 'All') {
      filters.OS = os
    }

    if (startDate && endDate) {
      filters.updatedAt = {
        gte: new Date(String(startDate)),
        lte: new Date(String(endDate))
      }
    }

    // Fetch devices from the database with the applied filters
    const devices = await prisma.deviceInfo.findMany({
      where: filters
    })

    const result: Device = {
      isVPNSpoofed: 0,
      isVirtualOS: 0,
      isEmulator: 0,
      isAppSpoofed: 0,
      isAppPatched: 0,
      isAppCloned: 0
    }

    devices.forEach((device: Device) => {
      if (device.isVPNSpoofed) {
        result.isVPNSpoofed++
      }
      if (device.isVirtualOS) {
        result.isVirtualOS++
      }
      if (device.isEmulator) {
        result.isEmulator++
      }
      if (device.isAppSpoofed) {
        result.isAppSpoofed++
      }
      if (device.isAppPatched) {
        result.isAppPatched++
      }
      if (device.isAppCloned) {
        result.isAppCloned++
      }
    })

    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
