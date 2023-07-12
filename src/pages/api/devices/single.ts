import { NextApiRequest, NextApiResponse } from 'next/types'
import prisma from 'src/libs/prismadb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
    const parsedId = parseInt(id as string)

    const device = await prisma.device.findMany({
      where: {
        id: parsedId
      }
    })

    res.status(200).json({ data: device, total: device.length })
  } catch (err) {
    res.status(500).send(err)
  }
}
