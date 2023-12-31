import { NextApiRequest, NextApiResponse } from 'next/types'
import prisma from 'src/libs/prismadb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
    const parsedId = parseInt(id as string)

    const user = await prisma.user.findMany({
      where: {
        altUserId : parsedId
      }
    })

    res.status(200).json({ data: user, total: user.length })
  } catch (err) {
    res.status(500).send(err)
  }
}
