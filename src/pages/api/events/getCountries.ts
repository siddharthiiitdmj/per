// API to get countryInfo

import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stats = await prisma.Stats.findMany({
      where: {
        os: null
      }
    })

    res.status(200).json(stats[0].countryInfo)
  } catch (error) {
    console.error('Error retrieving stats:', error)
    res.status(500).json({ error: 'An error occurred while retrieving stats data.' })
  }
}
