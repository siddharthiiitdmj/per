// API to fetch either lineChart or pieChart data (one at a time based on the query)

import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { os } = req.query
    const { chart } = req.query
    if (!os) {
      os = 'All'
    }

    const selectField = chart === 'pieChart' ? 'pieChart' : 'lineChart'

    const stats = await prisma.stats.findFirst({
      where: {
        os: os // Set the os field from the query parameter
      },
      select: {
        [selectField]: true
      }
    })

    res.status(200).json(stats[selectField])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
