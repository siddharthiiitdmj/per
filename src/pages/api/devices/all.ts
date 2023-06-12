import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const devices = await prisma.deviceInfo.findMany()

    res.status(200).json(devices)
  } catch (err) {
    res.status(500).send(err)
  }
}
