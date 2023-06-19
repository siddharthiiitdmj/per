import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { omit } from 'lodash'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const { startDate, endDate } = req.query

      const filters: any = {}

      if (startDate && endDate) {
        filters.updatedAt = {
          gte: new Date(startDate[0]),
          lte: new Date(endDate[0])
        }
      }

      const users = await prisma.user.findMany({
        where: filters
      })

      const usersWithoutPassword = users.map((user: any) => omit(user, 'hashedPassword'))

      return res.status(200).json(usersWithoutPassword)
    } else {
      return res.status(400).json({
        message: `${req.method} not allowed`
      })
    }
  } catch (err) {
    console.error(err)

    return res.status(500).json({ message: 'Server error' })
  }
}