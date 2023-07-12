import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

type StatsData = Record<string, number>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await prisma.Stats.deleteMany({
      where: {
        os: null
      }
    })

    const jsonData: StatsData = {
      US: 743,
      undefined: 270,
      CN: 179,
      JP: 112,
      KR: 69,
      DE: 68,
      GB: 52,
      BR: 47,
      FR: 40,
      CA: 31,
      AU: 31,
      others: 471
    }

    await prisma.Stats.create({
      data: {
        countryInfo: jsonData
      }
    })

    res.status(200).json({ message: 'Stats data has been saved successfully.' })
  } catch (error) {
    console.error('Error saving stats:', error)
    res.status(500).json({ error: 'An error occurred while saving stats data.' })
  }
}
