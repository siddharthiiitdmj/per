import { NextApiRequest, NextApiResponse } from 'next/types'
import prisma from 'src/libs/prismadb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
    const parsedId = parseInt(id as string)

    const user = await prisma.user.findMany({
      where: {
        altUserId: parsedId
      }
    })

    const latestEvent = await prisma.events.findFirst({
      where: {
        userId: parsedId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const lat = latestEvent?.Latitude.toFixed(4) || null
    const lon = latestEvent?.Longitude.toFixed(4) || null
    const location = lat && lon ? `{${lat}, ${lon}}` : null

    // Check if a user was found
    if (user.length > 0) {
      user[0].location = location // Append the location property to the user object
    }

    res.status(200).json({ data: user, total: user.length })
  } catch (err) {
    res.status(500).send(err)
  }
}
