// API to fetch all the data corresponding to a single device

import { NextApiRequest, NextApiResponse } from 'next/types'
import prisma from 'src/libs/prismadb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query

    const device = await prisma.device.findMany({
      where: {
        id: id
      }
    })

    const latestEvent = await prisma.events.findFirst({
      where: {
        deviceId: id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const lat = latestEvent?.Latitude.toFixed(4) || null
    const lon = latestEvent?.Longitude.toFixed(4) || null
    const location = lat && lon ? `(${lat}, ${lon})` : null

    // Check if a user was found
    if (device.length > 0) {
      device[0].location = location // Append the location property to the user object
    }

    res.status(200).json({ data: device, total: device.length })
  } catch (err) {
    res.status(500).send(err)
  }
}
