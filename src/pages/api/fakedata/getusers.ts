import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await prisma.user.findMany()

    res.status(200).json(users)
  } catch (err) {
    res.status(500).send(err)
  }
}
