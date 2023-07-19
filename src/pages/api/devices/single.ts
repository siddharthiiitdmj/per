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

    res.status(200).json({ data: device, total: device.length })
  } catch (err) {
    res.status(500).send(err)
  }
}