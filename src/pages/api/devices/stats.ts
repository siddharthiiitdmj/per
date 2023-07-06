import { NextApiRequest, NextApiResponse } from 'next/types'
import prisma from 'src/libs/prismadb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { OS } = req.query

    if (!OS) {
      OS = 'All'
    }

    const pieChartData = await prisma.stats.findFirst({
      where: {
        os: OS // Set the os field from the query parameter
      },
      select: {
        ['pieChart']: true
      }
    })

    const lineChartData = await prisma.stats.findFirst({
      where: {
        os: OS // Set the os field from the query parameter
      },
      select: {
        ['lineChart']: true
      }
    })

    res.status(200).json({ pieChartData: pieChartData['pieChart'], lineChartData: lineChartData['lineChart'] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
